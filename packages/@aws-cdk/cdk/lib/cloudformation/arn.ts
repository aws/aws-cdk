import { AwsAccountId, AwsPartition, AwsRegion, FnConcat, Token } from '..';
import { FnSelect, FnSplit } from '../cloudformation/fn';
import { unresolved } from '../core/tokens';
import { CloudFormationToken } from './cloudformation-token';

/**
 * An Amazon Resource Name (ARN).
 * http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html
 */
export class ArnUtils {
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
   *   arn:{partition}:{service}:{region}:{account}:{resource}{sep}}{resource-name}
   *
   */
  public static fromComponents(components: ArnComponents): string {
    const partition = components.partition == null
      ? new AwsPartition()
      : components.partition;
    const region = components.region == null
      ? new AwsRegion()
      : components.region;
    const account = components.account == null
      ? new AwsAccountId()
      : components.account;

    const values = [ 'arn', ':', partition, ':', components.service, ':', region, ':', account, ':', components.resource ];

    const sep = components.sep || '/';
    if (sep !== '/' && sep !== ':') {
      throw new Error('resourcePathSep may only be ":" or "/"');
    }

    if (components.resourceName != null) {
      values.push(sep);
      values.push(components.resourceName);
    }

    return new FnConcat(...values).toString();
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
   * @param sep The separator used to separate resource from resourceName
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
    if (unresolved(arn)) {
      return ArnUtils.parseToken(new CloudFormationToken(arn), sepIfToken, hasName);
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

    const result: ArnComponents = { service, resource };
    if (partition) {
      result.partition = partition;
    }

    if (region) {
      result.region = region;
    }

    if (account) {
      result.account = account;
    }

    if (resourceName) {
      result.resourceName = resourceName;
    }

    if (sep) {
      result.sep = sep;
    }

    return result;
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
   * @param arn The input token that contains an ARN
   * @param sep The separator used to separate resource from resourceName
   * @param hasName Whether there is a name component in the ARN at all.
   * For example, SNS Topics ARNs have the 'resource' component contain the
   * topic name, and no 'resourceName' component.
   * @returns an ArnComponents object which allows access to the various
   * components of the ARN.
   */
  public static parseToken(arn: Token, sep: string = '/', hasName: boolean = true): ArnComponents {
    // Arn ARN looks like:
    // arn:partition:service:region:account-id:resource
    // arn:partition:service:region:account-id:resourcetype/resource
    // arn:partition:service:region:account-id:resourcetype:resource

    // We need the 'hasName' argument because {Fn::Select}ing a nonexistent field
    // throws an error.

    const components = new FnSplit(':', arn);

    const partition = new FnSelect(1, components).toString();
    const service = new FnSelect(2, components).toString();
    const region = new FnSelect(3, components).toString();
    const account = new FnSelect(4, components).toString();

    if (sep === ':') {
      const resource = new FnSelect(5, components).toString();
      const resourceName = hasName ? new FnSelect(6, components).toString() : undefined;

      return { partition, service, region, account, resource, resourceName, sep };
    } else {
      const lastComponents = new FnSplit(sep, new FnSelect(5, components));

      const resource = new FnSelect(0, lastComponents).toString();
      const resourceName = hasName ? new FnSelect(1, lastComponents).toString() : undefined;

      return { partition, service, region, account, resource, resourceName, sep };
    }
  }

  /**
   * Return a Token that represents the resource component of the ARN
   */
  public static resourceComponent(arn: string, sep: string = '/'): string {
    return ArnUtils.parseToken(new Token(arn), sep).resource;
  }

  /**
   * Return a Token that represents the resource Name component of the ARN
   */
  public static resourceNameComponent(arn: string, sep: string = '/'): string {
    return ArnUtils.parseToken(new Token(arn), sep, true).resourceName!;
  }
}

export interface ArnComponents {
  /**
   * The partition that the resource is in. For standard AWS regions, the
   * partition is aws. If you have resources in other partitions, the
   * partition is aws-partitionname. For example, the partition for resources
   * in the China (Beijing) region is aws-cn.
   *
   * @default The AWS partition the stack is deployed to.
   */
  partition?: string;

  /**
   * The service namespace that identifies the AWS product (for example,
   * 's3', 'iam', 'codepipline').
   */
  service: string;

  /**
   * The region the resource resides in. Note that the ARNs for some resources
   * do not require a region, so this component might be omitted.
   *
   * @default The region the stack is deployed to.
   */
  region?: string;

  /**
   * The ID of the AWS account that owns the resource, without the hyphens.
   * For example, 123456789012. Note that the ARNs for some resources don't
   * require an account number, so this component might be omitted.
   *
   * @default The account the stack is deployed to.
   */
  account?: string;

  /**
   * Resource type (e.g. "table", "autoScalingGroup", "certificate").
   * For some resource types, e.g. S3 buckets, this field defines the bucket name.
   */
  resource: string;

  /**
   * Separator between resource type and the resource.
   *
   * Can be either '/' or ':'. Will only be used if path is defined.
   * @default '/'
   */
  sep?: string;

  /**
   * Resource name or path within the resource (i.e. S3 bucket object key) or
   * a wildcard such as ``"*"``. This is service-dependent.
   */
  resourceName?: string;
}
