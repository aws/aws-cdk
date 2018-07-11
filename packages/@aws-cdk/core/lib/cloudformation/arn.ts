import { AwsAccountId, AwsPartition, AwsRegion, FnConcat, Token } from '..';

/**
 * An Amazon Resource Name (ARN).
 * http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html
 */
export class Arn extends Token {
    /**
     * Creates an ARN from components.
     * If any component is the empty string,
     * an empty string will be inserted into the generated ARN
     * at the location that component corresponds to.
     */
    public static fromComponents(components: ArnComponents) {
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

        return new Arn(new FnConcat(...values));
    }

    /**
     * Given an ARN, parses it and returns components.
     *
     * The ARN it will be parsed and validated. The separator (`sep`) will be
     * set to '/' if the 6th component includes a '/', in which case, `resource`
     * will be set to the value before the '/' and `resourceName` will be the
     * rest. In case there is no '/', `resource` will be set to the 6th
     * components and `resourceName` will be set to the rest of the string.
     *
     * @returns an ArnComponents object which allows access to the various
     *          components of the ARN.
     */
    public static parse(arn: string): ArnComponents {
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
    account?: any;

    /**
     * Resource type (e.g. "table", "autoScalingGroup", "certificate").
     * For some resource types, e.g. S3 buckets, this field defines the bucket name.
     */
    resource: any;

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
    resourceName?: any;
}
