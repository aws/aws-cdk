import { Fn } from './cfn-fn';
import { Stack } from './stack';
import { Token } from './token';
import { filterUndefined } from './util';

export interface ArnComponents {
  /**
   * The partition that the resource is in. For standard AWS regions, the
   * partition is aws. If you have resources in other partitions, the
   * partition is aws-partitionname. For example, the partition for resources
   * in the China (Beijing) region is aws-cn.
   *
   * @default The AWS partition the stack is deployed to.
   */
  readonly partition?: string;

  /**
   * The service namespace that identifies the AWS product (for example,
   * 's3', 'iam', 'codepipline').
   */
  readonly service: string;

  /**
   * The region the resource resides in. Note that the ARNs for some resources
   * do not require a region, so this component might be omitted.
   *
   * @default The region the stack is deployed to.
   */
  readonly region?: string;

  /**
   * The ID of the AWS account that owns the resource, without the hyphens.
   * For example, 123456789012. Note that the ARNs for some resources don't
   * require an account number, so this component might be omitted.
   *
   * @default The account the stack is deployed to.
   */
  readonly account?: string;

  /**
   * Resource type (e.g. "table", "autoScalingGroup", "certificate").
   * For some resource types, e.g. S3 buckets, this field defines the bucket name.
   */
  readonly resource: string;

  /**
   * Separator between resource type and the resource.
   *
   * Can be either '/', ':' or an empty string. Will only be used if resourceName is defined.
   * @default '/'
   */
  readonly sep?: string;

  /**
   * Resource name or path within the resource (i.e. S3 bucket object key) or
   * a wildcard such as ``"*"``. This is service-dependent.
   */
  readonly resourceName?: string;
}

export class Arn {
  /**
   * Creates an ARN from components.
   *
   * If `partition`, `region` or `account` are not specified, the stack's
   * partition, region and account will be used.
   *
   * If any component is the empty string, an empty string will be inserted
   * into the generated ARN at the location that component corresponds to.
   *
   * The ARN will be formatted as follows:
   *
   *   arn:{partition}:{service}:{region}:{account}:{resource}{sep}{resource-name}
   *
   * The required ARN pieces that are omitted will be taken from the stack that
   * the 'scope' is attached to. If all ARN pieces are supplied, the supplied scope
   * can be 'undefined'.
   */
  public static format(components: ArnComponents, stack: Stack): string {
    const partition = components.partition !== undefined ? components.partition : stack.partition;
    const region = components.region !== undefined ? components.region : stack.region;
    const account = components.account !== undefined ? components.account : stack.account;
    const sep = components.sep !== undefined ? components.sep : '/';

    const values = [ 'arn', ':', partition, ':', components.service, ':', region, ':', account, ':', components.resource ];

    if (sep !== '/' && sep !== ':' && sep !== '') {
      throw new Error('resourcePathSep may only be ":", "/" or an empty string');
    }

    if (components.resourceName != null) {
      values.push(sep);
      values.push(components.resourceName);
    }

    return values.join('');
  }

  /**
   * Given an ARN, parses it and returns components.
   *
   * If the ARN is a concrete string, it will be parsed and validated. The
   * separator (`sep`) will be set to '/' if the 6th component includes a '/',
   * in which case, `resource` will be set to the value before the '/' and
   * `resourceName` will be the rest. In case there is no '/', `resource` will
   * be set to the 6th components and `resourceName` will be set to the rest
   * of the string.
   *
   * If the ARN includes tokens (or is a token), the ARN cannot be validated,
   * since we don't have the actual value yet at the time of this function
   * call. You will have to know the separator and the type of ARN. The
   * resulting `ArnComponents` object will contain tokens for the
   * subexpressions of the ARN, not string literals. In this case this
   * function cannot properly parse the complete final resourceName (path) out
   * of ARNs that use '/' to both separate the 'resource' from the
   * 'resourceName' AND to subdivide the resourceName further. For example, in
   * S3 ARNs:
   *
   *    arn:aws:s3:::my_corporate_bucket/path/to/exampleobject.png
   *
   * After parsing the resourceName will not contain
   * 'path/to/exampleobject.png' but simply 'path'. This is a limitation
   * because there is no slicing functionality in CloudFormation templates.
   *
   * @param arn The ARN to parse
   * @param sepIfToken The separator used to separate resource from resourceName
   * @param hasName Whether there is a name component in the ARN at all. For
   * example, SNS Topics ARNs have the 'resource' component contain the topic
   * name, and no 'resourceName' component.
   *
   * @returns an ArnComponents object which allows access to the various
   * components of the ARN.
   *
   * @returns an ArnComponents object which allows access to the various
   *      components of the ARN.
   */
  public static parse(arn: string, sepIfToken: string = '/', hasName: boolean = true): ArnComponents {
    if (Token.isUnresolved(arn)) {
      return parseToken(arn, sepIfToken, hasName);
    }

    const components = arn.split(':') as Array<string | undefined>;

    if (components.length < 6) {
      throw new Error('ARNs must have at least 6 components: ' + arn);
    }

    const [ arnPrefix, partition, service, region, account, sixth, ...rest ] = components;

    if (arnPrefix !== 'arn') {
      throw new Error('ARNs must start with "arn:": ' + arn);
    }

    if (!service) {
      throw new Error('The `service` component (3rd component) is required: ' + arn);
    }

    if (!sixth) {
      throw new Error('The `resource` component (6th component) is required: ' + arn);
    }

    let resource: string;
    let resourceName: string | undefined;
    let sep: string | undefined;

    let sepIndex = sixth.indexOf('/');
    if (sepIndex !== -1) {
      sep = '/';
    } else if (rest.length > 0) {
      sep = ':';
      sepIndex = -1;
    }

    if (sepIndex !== -1) {
      resource = sixth.substr(0, sepIndex);
      resourceName = sixth.substr(sepIndex + 1);
    } else {
      resource = sixth;
    }

    if (rest.length > 0) {
      if (!resourceName) {
        resourceName = '';
      } else {
        resourceName += ':';
      }

      resourceName += rest.join(':');
    }

    // "|| undefined" will cause empty strings to be treated as "undefined"
    return filterUndefined({
      service: service || undefined,
      resource: resource || undefined ,
      partition: partition || undefined,
      region: region || undefined,
      account: account || undefined,
      resourceName,
      sep
    });
  }

  private constructor() { }
}

/**
 * Given a Token evaluating to ARN, parses it and returns components.
 *
 * The ARN cannot be validated, since we don't have the actual value yet
 * at the time of this function call. You will have to know the separator
 * and the type of ARN.
 *
 * The resulting `ArnComponents` object will contain tokens for the
 * subexpressions of the ARN, not string literals.
 *
 * WARNING: this function cannot properly parse the complete final
 * resourceName (path) out of ARNs that use '/' to both separate the
 * 'resource' from the 'resourceName' AND to subdivide the resourceName
 * further. For example, in S3 ARNs:
 *
 *    arn:aws:s3:::my_corporate_bucket/path/to/exampleobject.png
 *
 * After parsing the resourceName will not contain 'path/to/exampleobject.png'
 * but simply 'path'. This is a limitation because there is no slicing
 * functionality in CloudFormation templates.
 *
 * @param arnToken The input token that contains an ARN
 * @param sep The separator used to separate resource from resourceName
 * @param hasName Whether there is a name component in the ARN at all.
 * For example, SNS Topics ARNs have the 'resource' component contain the
 * topic name, and no 'resourceName' component.
 * @returns an ArnComponents object which allows access to the various
 * components of the ARN.
 */
function parseToken(arnToken: string, sep: string = '/', hasName: boolean = true): ArnComponents {
  // Arn ARN looks like:
  // arn:partition:service:region:account-id:resource
  // arn:partition:service:region:account-id:resourcetype/resource
  // arn:partition:service:region:account-id:resourcetype:resource

  // We need the 'hasName' argument because {Fn::Select}ing a nonexistent field
  // throws an error.

  const components = Fn.split(':', arnToken);

  const partition = Fn.select(1, components).toString();
  const service = Fn.select(2, components).toString();
  const region = Fn.select(3, components).toString();
  const account = Fn.select(4, components).toString();

  if (sep === ':') {
    const resource = Fn.select(5, components).toString();
    const resourceName = hasName ? Fn.select(6, components).toString() : undefined;

    return { partition, service, region, account, resource, resourceName, sep };
  } else {
    const lastComponents = Fn.split(sep, Fn.select(5, components));

    const resource = Fn.select(0, lastComponents).toString();
    const resourceName = hasName ? Fn.select(1, lastComponents).toString() : undefined;

    return { partition, service, region, account, resource, resourceName, sep };
  }
}
