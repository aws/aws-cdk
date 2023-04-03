import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnAccessPoint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html
 */
export interface CfnAccessPointProps {
    /**
     * The name of the bucket associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-bucket
     */
    readonly bucket: string;
    /**
     * The AWS account ID associated with the S3 bucket associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-bucketaccountid
     */
    readonly bucketAccountId?: string;
    /**
     * The name of this access point. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the access point name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-name
     */
    readonly name?: string;
    /**
     * The access point policy associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-policy
     */
    readonly policy?: any | cdk.IResolvable;
    /**
     * The container element for a bucket's policy status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-policystatus
     */
    readonly policyStatus?: any | cdk.IResolvable;
    /**
     * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket. You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-publicaccessblockconfiguration
     */
    readonly publicAccessBlockConfiguration?: CfnAccessPoint.PublicAccessBlockConfigurationProperty | cdk.IResolvable;
    /**
     * The Virtual Private Cloud (VPC) configuration for this access point, if one exists.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-vpcconfiguration
     */
    readonly vpcConfiguration?: CfnAccessPoint.VpcConfigurationProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::S3::AccessPoint`
 *
 * The AWS::S3::AccessPoint resource is an Amazon S3 resource type that you can use to access buckets.
 *
 * @cloudformationResource AWS::S3::AccessPoint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html
 */
export declare class CfnAccessPoint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::AccessPoint";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessPoint;
    /**
     * The alias for this access point.
     * @cloudformationAttribute Alias
     */
    readonly attrAlias: string;
    /**
     * This property contains the details of the ARN for the access point.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The name of this access point.
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * Indicates whether this access point allows access from the internet. If `VpcConfiguration` is specified for this access point, then `NetworkOrigin` is `VPC` , and the access point doesn't allow access from the internet. Otherwise, `NetworkOrigin` is `Internet` , and the access point allows access from the internet, subject to the access point and bucket access policies.
     *
     * *Allowed values* : `VPC` | `Internet`
     * @cloudformationAttribute NetworkOrigin
     */
    readonly attrNetworkOrigin: string;
    /**
     * The name of the bucket associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-bucket
     */
    bucket: string;
    /**
     * The AWS account ID associated with the S3 bucket associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-bucketaccountid
     */
    bucketAccountId: string | undefined;
    /**
     * The name of this access point. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the access point name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-name
     */
    name: string | undefined;
    /**
     * The access point policy associated with this access point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-policy
     */
    policy: any | cdk.IResolvable | undefined;
    /**
     * The container element for a bucket's policy status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-policystatus
     */
    policyStatus: any | cdk.IResolvable | undefined;
    /**
     * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket. You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-publicaccessblockconfiguration
     */
    publicAccessBlockConfiguration: CfnAccessPoint.PublicAccessBlockConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The Virtual Private Cloud (VPC) configuration for this access point, if one exists.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-vpcconfiguration
     */
    vpcConfiguration: CfnAccessPoint.VpcConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::S3::AccessPoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAccessPointProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnAccessPoint {
    /**
     * The container element for a bucket's policy status.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-policystatus.html
     */
    interface PolicyStatusProperty {
        /**
         * The policy status for this bucket. `TRUE` indicates that this bucket is public. `FALSE` indicates that the bucket is not public.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-policystatus.html#cfn-s3-accesspoint-policystatus-ispublic
         */
        readonly isPublic?: string;
    }
}
export declare namespace CfnAccessPoint {
    /**
     * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket. You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html
     */
    interface PublicAccessBlockConfigurationProperty {
        /**
         * Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket. Setting this element to `TRUE` causes the following behavior:
         *
         * - PUT Bucket ACL and PUT Object ACL calls fail if the specified ACL is public.
         * - PUT Object calls fail if the request includes a public ACL.
         * - PUT Bucket calls fail if the request includes a public ACL.
         *
         * Enabling this setting doesn't affect existing policies or ACLs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-blockpublicacls
         */
        readonly blockPublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should block public bucket policies for this bucket. Setting this element to `TRUE` causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access.
         *
         * Enabling this setting doesn't affect existing bucket policies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-blockpublicpolicy
         */
        readonly blockPublicPolicy?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket. Setting this element to `TRUE` causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket.
         *
         * Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-ignorepublicacls
         */
        readonly ignorePublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should restrict public bucket policies for this bucket. Setting this element to `TRUE` restricts access to this bucket to only AWS service principals and authorized users within this account if the bucket has a public policy.
         *
         * Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-restrictpublicbuckets
         */
        readonly restrictPublicBuckets?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnAccessPoint {
    /**
     * The Virtual Private Cloud (VPC) configuration for this access point.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-vpcconfiguration.html
     */
    interface VpcConfigurationProperty {
        /**
         * If this field is specified, the access point will only allow connections from the specified VPC ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-vpcconfiguration.html#cfn-s3-accesspoint-vpcconfiguration-vpcid
         */
        readonly vpcId?: string;
    }
}
/**
 * Properties for defining a `CfnBucket`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html
 */
export interface CfnBucketProps {
    /**
     * Configures the transfer acceleration state for an Amazon S3 bucket. For more information, see [Amazon S3 Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-accelerateconfiguration
     */
    readonly accelerateConfiguration?: CfnBucket.AccelerateConfigurationProperty | cdk.IResolvable;
    /**
     * A canned access control list (ACL) that grants predefined permissions to the bucket. For more information about canned ACLs, see [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) in the *Amazon S3 User Guide* .
     *
     * Be aware that the syntax for this property differs from the information provided in the *Amazon S3 User Guide* . The AccessControl property is case-sensitive and must be one of the following values: Private, PublicRead, PublicReadWrite, AuthenticatedRead, LogDeliveryWrite, BucketOwnerRead, BucketOwnerFullControl, or AwsExecRead.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-accesscontrol
     */
    readonly accessControl?: string;
    /**
     * Specifies the configuration and any analyses for the analytics filter of an Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-analyticsconfigurations
     */
    readonly analyticsConfigurations?: Array<CfnBucket.AnalyticsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Specifies default encryption for a bucket using server-side encryption with Amazon S3-managed keys (SSE-S3) or AWS KMS-managed keys (SSE-KMS) bucket. For information about the Amazon S3 default encryption feature, see [Amazon S3 Default Encryption for S3 Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-bucketencryption
     */
    readonly bucketEncryption?: CfnBucket.BucketEncryptionProperty | cdk.IResolvable;
    /**
     * A name for the bucket. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. The bucket name must contain only lowercase letters, numbers, periods (.), and dashes (-) and must follow [Amazon S3 bucket restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html) . For more information, see [Rules for naming Amazon S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules) in the *Amazon S3 User Guide* .
     *
     * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-name
     */
    readonly bucketName?: string;
    /**
     * Describes the cross-origin access configuration for objects in an Amazon S3 bucket. For more information, see [Enabling Cross-Origin Resource Sharing](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-crossoriginconfig
     */
    readonly corsConfiguration?: CfnBucket.CorsConfigurationProperty | cdk.IResolvable;
    /**
     * Defines how Amazon S3 handles Intelligent-Tiering storage.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-intelligenttieringconfigurations
     */
    readonly intelligentTieringConfigurations?: Array<CfnBucket.IntelligentTieringConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Specifies the inventory configuration for an Amazon S3 bucket. For more information, see [GET Bucket inventory](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketGETInventoryConfig.html) in the *Amazon S3 API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-inventoryconfigurations
     */
    readonly inventoryConfigurations?: Array<CfnBucket.InventoryConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Specifies the lifecycle configuration for objects in an Amazon S3 bucket. For more information, see [Object Lifecycle Management](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-lifecycleconfig
     */
    readonly lifecycleConfiguration?: CfnBucket.LifecycleConfigurationProperty | cdk.IResolvable;
    /**
     * Settings that define where logs are stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-loggingconfig
     */
    readonly loggingConfiguration?: CfnBucket.LoggingConfigurationProperty | cdk.IResolvable;
    /**
     * Specifies a metrics configuration for the CloudWatch request metrics (specified by the metrics configuration ID) from an Amazon S3 bucket. If you're updating an existing metrics configuration, note that this is a full replacement of the existing metrics configuration. If you don't include the elements you want to keep, they are erased. For more information, see [PutBucketMetricsConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTMetricConfiguration.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-metricsconfigurations
     */
    readonly metricsConfigurations?: Array<CfnBucket.MetricsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Configuration that defines how Amazon S3 handles bucket notifications.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-notification
     */
    readonly notificationConfiguration?: CfnBucket.NotificationConfigurationProperty | cdk.IResolvable;
    /**
     * Places an Object Lock configuration on the specified bucket. The rule specified in the Object Lock configuration will be applied by default to every new object placed in the specified bucket. For more information, see [Locking Objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lock.html) .
     *
     * > - The `DefaultRetention` settings require both a mode and a period.
     * > - The `DefaultRetention` period can be either `Days` or `Years` but you must select one. You cannot specify `Days` and `Years` at the same time.
     * > - You can only enable Object Lock for new buckets. If you want to turn on Object Lock for an existing bucket, contact AWS Support.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-objectlockconfiguration
     */
    readonly objectLockConfiguration?: CfnBucket.ObjectLockConfigurationProperty | cdk.IResolvable;
    /**
     * Indicates whether this bucket has an Object Lock configuration enabled. Enable `ObjectLockEnabled` when you apply `ObjectLockConfiguration` to a bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-objectlockenabled
     */
    readonly objectLockEnabled?: boolean | cdk.IResolvable;
    /**
     * Configuration that defines how Amazon S3 handles Object Ownership rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-ownershipcontrols
     */
    readonly ownershipControls?: CfnBucket.OwnershipControlsProperty | cdk.IResolvable;
    /**
     * Configuration that defines how Amazon S3 handles public access.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-publicaccessblockconfiguration
     */
    readonly publicAccessBlockConfiguration?: CfnBucket.PublicAccessBlockConfigurationProperty | cdk.IResolvable;
    /**
     * Configuration for replicating objects in an S3 bucket. To enable replication, you must also enable versioning by using the `VersioningConfiguration` property.
     *
     * Amazon S3 can store replicated objects in a single destination bucket or multiple destination buckets. The destination bucket or buckets must already exist.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-replicationconfiguration
     */
    readonly replicationConfiguration?: CfnBucket.ReplicationConfigurationProperty | cdk.IResolvable;
    /**
     * An arbitrary set of tags (key-value pairs) for this S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * Enables multiple versions of all objects in this bucket. You might enable versioning to prevent objects from being deleted or overwritten by mistake or to archive objects so that you can retrieve previous versions of them.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-versioning
     */
    readonly versioningConfiguration?: CfnBucket.VersioningConfigurationProperty | cdk.IResolvable;
    /**
     * Information used to configure the bucket as a static website. For more information, see [Hosting Websites on Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-websiteconfiguration
     */
    readonly websiteConfiguration?: CfnBucket.WebsiteConfigurationProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::S3::Bucket`
 *
 * The `AWS::S3::Bucket` resource creates an Amazon S3 bucket in the same AWS Region where you create the AWS CloudFormation stack.
 *
 * To control how AWS CloudFormation handles the bucket when the stack is deleted, you can set a deletion policy for your bucket. You can choose to *retain* the bucket or to *delete* the bucket. For more information, see [DeletionPolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) .
 *
 * > You can only delete empty buckets. Deletion fails for buckets that have contents.
 *
 * @cloudformationResource AWS::S3::Bucket
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html
 */
export declare class CfnBucket extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::Bucket";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBucket;
    /**
     * Returns the Amazon Resource Name (ARN) of the specified bucket.
     *
     * Example: `arn:aws:s3:::DOC-EXAMPLE-BUCKET`
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Returns the IPv4 DNS name of the specified bucket.
     *
     * Example: `DOC-EXAMPLE-BUCKET.s3.amazonaws.com`
     * @cloudformationAttribute DomainName
     */
    readonly attrDomainName: string;
    /**
     * Returns the IPv6 DNS name of the specified bucket.
     *
     * Example: `DOC-EXAMPLE-BUCKET.s3.dualstack.us-east-2.amazonaws.com`
     *
     * For more information about dual-stack endpoints, see [Using Amazon S3 Dual-Stack Endpoints](https://docs.aws.amazon.com/AmazonS3/latest/dev/dual-stack-endpoints.html) .
     * @cloudformationAttribute DualStackDomainName
     */
    readonly attrDualStackDomainName: string;
    /**
     * Returns the regional domain name of the specified bucket.
     *
     * Example: `DOC-EXAMPLE-BUCKET.s3.us-east-2.amazonaws.com`
     * @cloudformationAttribute RegionalDomainName
     */
    readonly attrRegionalDomainName: string;
    /**
     * Returns the Amazon S3 website endpoint for the specified bucket.
     *
     * Example (IPv4): `http://DOC-EXAMPLE-BUCKET.s3-website.us-east-2.amazonaws.com`
     *
     * Example (IPv6): `http://DOC-EXAMPLE-BUCKET.s3.dualstack.us-east-2.amazonaws.com`
     * @cloudformationAttribute WebsiteURL
     */
    readonly attrWebsiteUrl: string;
    /**
     * Configures the transfer acceleration state for an Amazon S3 bucket. For more information, see [Amazon S3 Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-accelerateconfiguration
     */
    accelerateConfiguration: CfnBucket.AccelerateConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * A canned access control list (ACL) that grants predefined permissions to the bucket. For more information about canned ACLs, see [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) in the *Amazon S3 User Guide* .
     *
     * Be aware that the syntax for this property differs from the information provided in the *Amazon S3 User Guide* . The AccessControl property is case-sensitive and must be one of the following values: Private, PublicRead, PublicReadWrite, AuthenticatedRead, LogDeliveryWrite, BucketOwnerRead, BucketOwnerFullControl, or AwsExecRead.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-accesscontrol
     */
    accessControl: string | undefined;
    /**
     * Specifies the configuration and any analyses for the analytics filter of an Amazon S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-analyticsconfigurations
     */
    analyticsConfigurations: Array<CfnBucket.AnalyticsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Specifies default encryption for a bucket using server-side encryption with Amazon S3-managed keys (SSE-S3) or AWS KMS-managed keys (SSE-KMS) bucket. For information about the Amazon S3 default encryption feature, see [Amazon S3 Default Encryption for S3 Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-bucketencryption
     */
    bucketEncryption: CfnBucket.BucketEncryptionProperty | cdk.IResolvable | undefined;
    /**
     * A name for the bucket. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. The bucket name must contain only lowercase letters, numbers, periods (.), and dashes (-) and must follow [Amazon S3 bucket restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html) . For more information, see [Rules for naming Amazon S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules) in the *Amazon S3 User Guide* .
     *
     * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-name
     */
    bucketName: string | undefined;
    /**
     * Describes the cross-origin access configuration for objects in an Amazon S3 bucket. For more information, see [Enabling Cross-Origin Resource Sharing](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-crossoriginconfig
     */
    corsConfiguration: CfnBucket.CorsConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Defines how Amazon S3 handles Intelligent-Tiering storage.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-intelligenttieringconfigurations
     */
    intelligentTieringConfigurations: Array<CfnBucket.IntelligentTieringConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Specifies the inventory configuration for an Amazon S3 bucket. For more information, see [GET Bucket inventory](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketGETInventoryConfig.html) in the *Amazon S3 API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-inventoryconfigurations
     */
    inventoryConfigurations: Array<CfnBucket.InventoryConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Specifies the lifecycle configuration for objects in an Amazon S3 bucket. For more information, see [Object Lifecycle Management](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-lifecycleconfig
     */
    lifecycleConfiguration: CfnBucket.LifecycleConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Settings that define where logs are stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-loggingconfig
     */
    loggingConfiguration: CfnBucket.LoggingConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Specifies a metrics configuration for the CloudWatch request metrics (specified by the metrics configuration ID) from an Amazon S3 bucket. If you're updating an existing metrics configuration, note that this is a full replacement of the existing metrics configuration. If you don't include the elements you want to keep, they are erased. For more information, see [PutBucketMetricsConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTMetricConfiguration.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-metricsconfigurations
     */
    metricsConfigurations: Array<CfnBucket.MetricsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Configuration that defines how Amazon S3 handles bucket notifications.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-notification
     */
    notificationConfiguration: CfnBucket.NotificationConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Places an Object Lock configuration on the specified bucket. The rule specified in the Object Lock configuration will be applied by default to every new object placed in the specified bucket. For more information, see [Locking Objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lock.html) .
     *
     * > - The `DefaultRetention` settings require both a mode and a period.
     * > - The `DefaultRetention` period can be either `Days` or `Years` but you must select one. You cannot specify `Days` and `Years` at the same time.
     * > - You can only enable Object Lock for new buckets. If you want to turn on Object Lock for an existing bucket, contact AWS Support.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-objectlockconfiguration
     */
    objectLockConfiguration: CfnBucket.ObjectLockConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Indicates whether this bucket has an Object Lock configuration enabled. Enable `ObjectLockEnabled` when you apply `ObjectLockConfiguration` to a bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-objectlockenabled
     */
    objectLockEnabled: boolean | cdk.IResolvable | undefined;
    /**
     * Configuration that defines how Amazon S3 handles Object Ownership rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-ownershipcontrols
     */
    ownershipControls: CfnBucket.OwnershipControlsProperty | cdk.IResolvable | undefined;
    /**
     * Configuration that defines how Amazon S3 handles public access.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-publicaccessblockconfiguration
     */
    publicAccessBlockConfiguration: CfnBucket.PublicAccessBlockConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Configuration for replicating objects in an S3 bucket. To enable replication, you must also enable versioning by using the `VersioningConfiguration` property.
     *
     * Amazon S3 can store replicated objects in a single destination bucket or multiple destination buckets. The destination bucket or buckets must already exist.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-replicationconfiguration
     */
    replicationConfiguration: CfnBucket.ReplicationConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * An arbitrary set of tags (key-value pairs) for this S3 bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Enables multiple versions of all objects in this bucket. You might enable versioning to prevent objects from being deleted or overwritten by mistake or to archive objects so that you can retrieve previous versions of them.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-versioning
     */
    versioningConfiguration: CfnBucket.VersioningConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Information used to configure the bucket as a static website. For more information, see [Hosting Websites on Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-websiteconfiguration
     */
    websiteConfiguration: CfnBucket.WebsiteConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::S3::Bucket`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnBucketProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnBucket {
    /**
     * Specifies the days since the initiation of an incomplete multipart upload that Amazon S3 will wait before permanently removing all parts of the upload. For more information, see [Stopping Incomplete Multipart Uploads Using a Bucket Lifecycle Policy](https://docs.aws.amazon.com/AmazonS3/latest/dev/mpuoverview.html#mpu-abort-incomplete-mpu-lifecycle-config) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-abortincompletemultipartupload.html
     */
    interface AbortIncompleteMultipartUploadProperty {
        /**
         * Specifies the number of days after which Amazon S3 stops an incomplete multipart upload.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-abortincompletemultipartupload.html#cfn-s3-bucket-abortincompletemultipartupload-daysafterinitiation
         */
        readonly daysAfterInitiation: number;
    }
}
export declare namespace CfnBucket {
    /**
     * Configures the transfer acceleration state for an Amazon S3 bucket. For more information, see [Amazon S3 Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accelerateconfiguration.html
     */
    interface AccelerateConfigurationProperty {
        /**
         * Specifies the transfer acceleration status of the bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accelerateconfiguration.html#cfn-s3-bucket-accelerateconfiguration-accelerationstatus
         */
        readonly accelerationStatus: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specify this only in a cross-account scenario (where source and destination bucket owners are not the same), and you want to change replica ownership to the AWS account that owns the destination bucket. If this is not specified in the replication configuration, the replicas are owned by same AWS account that owns the source object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accesscontroltranslation.html
     */
    interface AccessControlTranslationProperty {
        /**
         * Specifies the replica ownership. For default and valid values, see [PUT bucket replication](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTreplication.html) in the *Amazon S3 API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accesscontroltranslation.html#cfn-s3-bucket-accesscontroltranslation-owner
         */
        readonly owner: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies the configuration and any analyses for the analytics filter of an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html
     */
    interface AnalyticsConfigurationProperty {
        /**
         * The ID that identifies the analytics configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-id
         */
        readonly id: string;
        /**
         * The prefix that an object must have to be included in the analytics results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-prefix
         */
        readonly prefix?: string;
        /**
         * Contains data related to access patterns to be collected and made available to analyze the tradeoffs between different storage classes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-storageclassanalysis
         */
        readonly storageClassAnalysis: CfnBucket.StorageClassAnalysisProperty | cdk.IResolvable;
        /**
         * The tags to use when evaluating an analytics filter.
         *
         * The analytics only includes objects that meet the filter's criteria. If no filter is specified, all of the contents of the bucket are included in the analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-tagfilters
         */
        readonly tagFilters?: Array<CfnBucket.TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies default encryption for a bucket using server-side encryption with Amazon S3-managed keys (SSE-S3) or AWS KMS-managed keys (SSE-KMS) bucket. For information about the Amazon S3 default encryption feature, see [Amazon S3 Default Encryption for S3 Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-bucketencryption.html
     */
    interface BucketEncryptionProperty {
        /**
         * Specifies the default server-side-encryption configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-bucketencryption.html#cfn-s3-bucket-bucketencryption-serversideencryptionconfiguration
         */
        readonly serverSideEncryptionConfiguration: Array<CfnBucket.ServerSideEncryptionRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Describes the cross-origin access configuration for objects in an Amazon S3 bucket. For more information, see [Enabling Cross-Origin Resource Sharing](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors.html
     */
    interface CorsConfigurationProperty {
        /**
         * A set of origins and methods (cross-origin access that you want to allow). You can add up to 100 rules to the configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors.html#cfn-s3-bucket-cors-corsrule
         */
        readonly corsRules: Array<CfnBucket.CorsRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies a cross-origin access rule for an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html
     */
    interface CorsRuleProperty {
        /**
         * Headers that are specified in the `Access-Control-Request-Headers` header. These headers are allowed in a preflight OPTIONS request. In response to any preflight OPTIONS request, Amazon S3 returns any requested headers that are allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-allowedheaders
         */
        readonly allowedHeaders?: string[];
        /**
         * An HTTP method that you allow the origin to run.
         *
         * *Allowed values* : `GET` | `PUT` | `HEAD` | `POST` | `DELETE`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-allowedmethods
         */
        readonly allowedMethods: string[];
        /**
         * One or more origins you want customers to be able to access the bucket from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-allowedorigins
         */
        readonly allowedOrigins: string[];
        /**
         * One or more headers in the response that you want customers to be able to access from their applications (for example, from a JavaScript `XMLHttpRequest` object).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-exposedheaders
         */
        readonly exposedHeaders?: string[];
        /**
         * A unique identifier for this rule. The value must be no more than 255 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-id
         */
        readonly id?: string;
        /**
         * The time in seconds that your browser is to cache the preflight response for the specified resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors-corsrule.html#cfn-s3-bucket-cors-corsrule-maxage
         */
        readonly maxAge?: number;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies how data related to the storage class analysis for an Amazon S3 bucket should be exported.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html
     */
    interface DataExportProperty {
        /**
         * The place to store the data for an analysis.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html#cfn-s3-bucket-dataexport-destination
         */
        readonly destination: CfnBucket.DestinationProperty | cdk.IResolvable;
        /**
         * The version of the output schema to use when exporting data. Must be `V_1` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html#cfn-s3-bucket-dataexport-outputschemaversion
         */
        readonly outputSchemaVersion: string;
    }
}
export declare namespace CfnBucket {
    /**
     * The container element for specifying the default Object Lock retention settings for new objects placed in the specified bucket.
     *
     * > - The `DefaultRetention` settings require both a mode and a period.
     * > - The `DefaultRetention` period can be either `Days` or `Years` but you must select one. You cannot specify `Days` and `Years` at the same time.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html
     */
    interface DefaultRetentionProperty {
        /**
         * The number of days that you want to specify for the default retention period. If Object Lock is turned on, you must specify `Mode` and specify either `Days` or `Years` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html#cfn-s3-bucket-defaultretention-days
         */
        readonly days?: number;
        /**
         * The default Object Lock retention mode you want to apply to new objects placed in the specified bucket. If Object Lock is turned on, you must specify `Mode` and specify either `Days` or `Years` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html#cfn-s3-bucket-defaultretention-mode
         */
        readonly mode?: string;
        /**
         * The number of years that you want to specify for the default retention period. If Object Lock is turned on, you must specify `Mode` and specify either `Days` or `Years` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html#cfn-s3-bucket-defaultretention-years
         */
        readonly years?: number;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies whether Amazon S3 replicates delete markers. If you specify a `Filter` in your replication configuration, you must also include a `DeleteMarkerReplication` element. If your `Filter` includes a `Tag` element, the `DeleteMarkerReplication` `Status` must be set to Disabled, because Amazon S3 does not support replicating delete markers for tag-based rules. For an example configuration, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-config-min-rule-config) .
     *
     * For more information about delete marker replication, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/delete-marker-replication.html) .
     *
     * > If you are using an earlier version of the replication configuration, Amazon S3 handles replication of delete markers differently. For more information, see [Backward Compatibility](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-backward-compat-considerations) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-deletemarkerreplication.html
     */
    interface DeleteMarkerReplicationProperty {
        /**
         * Indicates whether to replicate delete markers. Disabled by default.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-deletemarkerreplication.html#cfn-s3-bucket-deletemarkerreplication-status
         */
        readonly status?: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies information about where to publish analysis or configuration results for an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html
     */
    interface DestinationProperty {
        /**
         * The account ID that owns the destination S3 bucket. If no account ID is provided, the owner is not validated before exporting data.
         *
         * > Although this value is optional, we strongly recommend that you set it to help prevent problems if the destination bucket ownership changes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-bucketaccountid
         */
        readonly bucketAccountId?: string;
        /**
         * The Amazon Resource Name (ARN) of the bucket to which data is exported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-bucketarn
         */
        readonly bucketArn: string;
        /**
         * Specifies the file format used when exporting data to Amazon S3.
         *
         * *Allowed values* : `CSV` | `ORC` | `Parquet`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-format
         */
        readonly format: string;
        /**
         * The prefix to use when exporting data. The prefix is prepended to all results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-prefix
         */
        readonly prefix?: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies encryption-related information for an Amazon S3 bucket that is a destination for replicated objects.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-encryptionconfiguration.html
     */
    interface EncryptionConfigurationProperty {
        /**
         * Specifies the ID (Key ARN or Alias ARN) of the customer managed AWS KMS key stored in AWS Key Management Service (KMS) for the destination bucket. Amazon S3 uses this key to encrypt replica objects. Amazon S3 only supports symmetric encryption KMS keys. For more information, see [Asymmetric keys in AWS KMS](https://docs.aws.amazon.com//kms/latest/developerguide/symmetric-asymmetric.html) in the *AWS Key Management Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-encryptionconfiguration.html#cfn-s3-bucket-encryptionconfiguration-replicakmskeyid
         */
        readonly replicaKmsKeyId: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Amazon S3 can send events to Amazon EventBridge whenever certain events happen in your bucket, see [Using EventBridge](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventBridge.html) in the *Amazon S3 User Guide* .
     *
     * Unlike other destinations, delivery of events to EventBridge can be either enabled or disabled for a bucket. If enabled, all events will be sent to EventBridge and you can use EventBridge rules to route events to additional targets. For more information, see [What Is Amazon EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html) in the *Amazon EventBridge User Guide*
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-eventbridgeconfig.html
     */
    interface EventBridgeConfigurationProperty {
        /**
         * Enables delivery of events to Amazon EventBridge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-eventbridgeconfig.html#cfn-s3-bucket-eventbridgeconfiguration-eventbridgeenabled
         */
        readonly eventBridgeEnabled?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies the Amazon S3 object key name to filter on and whether to filter on the suffix or prefix of the key name.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html
     */
    interface FilterRuleProperty {
        /**
         * The object key name prefix or suffix identifying one or more objects to which the filtering rule applies. The maximum length is 1,024 characters. Overlapping prefixes and suffixes are not supported. For more information, see [Configuring Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html#cfn-s3-bucket-notificationconfiguraiton-config-filter-s3key-rules-name
         */
        readonly name: string;
        /**
         * The value that the filter searches for in object key names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html#cfn-s3-bucket-notificationconfiguraiton-config-filter-s3key-rules-value
         */
        readonly value: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies the S3 Intelligent-Tiering configuration for an Amazon S3 bucket.
     *
     * For information about the S3 Intelligent-Tiering storage class, see [Storage class for automatically optimizing frequently and infrequently accessed objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-class-intro.html#sc-dynamic-data-access) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html
     */
    interface IntelligentTieringConfigurationProperty {
        /**
         * The ID used to identify the S3 Intelligent-Tiering configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-id
         */
        readonly id: string;
        /**
         * An object key name prefix that identifies the subset of objects to which the rule applies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-prefix
         */
        readonly prefix?: string;
        /**
         * Specifies the status of the configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-status
         */
        readonly status: string;
        /**
         * A container for a key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-tagfilters
         */
        readonly tagFilters?: Array<CfnBucket.TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies a list of S3 Intelligent-Tiering storage class tiers in the configuration. At least one tier must be defined in the list. At most, you can specify two tiers in the list, one for each available AccessTier: `ARCHIVE_ACCESS` and `DEEP_ARCHIVE_ACCESS` .
         *
         * > You only need Intelligent Tiering Configuration enabled on a bucket if you want to automatically move objects stored in the Intelligent-Tiering storage class to Archive Access or Deep Archive Access tiers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-tierings
         */
        readonly tierings: Array<CfnBucket.TieringProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies the inventory configuration for an Amazon S3 bucket. For more information, see [GET Bucket inventory](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketGETInventoryConfig.html) in the *Amazon S3 API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html
     */
    interface InventoryConfigurationProperty {
        /**
         * Contains information about where to publish the inventory results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-destination
         */
        readonly destination: CfnBucket.DestinationProperty | cdk.IResolvable;
        /**
         * Specifies whether the inventory is enabled or disabled. If set to `True` , an inventory list is generated. If set to `False` , no inventory list is generated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * The ID used to identify the inventory configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-id
         */
        readonly id: string;
        /**
         * Object versions to include in the inventory list. If set to `All` , the list includes all the object versions, which adds the version-related fields `VersionId` , `IsLatest` , and `DeleteMarker` to the list. If set to `Current` , the list does not contain these version-related fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-includedobjectversions
         */
        readonly includedObjectVersions: string;
        /**
         * Contains the optional fields that are included in the inventory results.
         *
         * *Valid values* : `Size | LastModifiedDate | StorageClass | ETag | IsMultipartUploaded | ReplicationStatus | EncryptionStatus | ObjectLockRetainUntilDate | ObjectLockMode | ObjectLockLegalHoldStatus | IntelligentTieringAccessTier | BucketKeyStatus`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-optionalfields
         */
        readonly optionalFields?: string[];
        /**
         * Specifies the inventory filter prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-prefix
         */
        readonly prefix?: string;
        /**
         * Specifies the schedule for generating inventory results.
         *
         * *Allowed values* : `Daily` | `Weekly`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-schedulefrequency
         */
        readonly scheduleFrequency: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Describes the AWS Lambda functions to invoke and the events for which to invoke them.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html
     */
    interface LambdaConfigurationProperty {
        /**
         * The Amazon S3 bucket event for which to invoke the AWS Lambda function. For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig-event
         */
        readonly event: string;
        /**
         * The filtering rules that determine which objects invoke the AWS Lambda function. For example, you can create a filter so that only image files with a `.jpg` extension invoke the function when they are added to the Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig-filter
         */
        readonly filter?: CfnBucket.NotificationFilterProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the AWS Lambda function that Amazon S3 invokes when the specified event type occurs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig-function
         */
        readonly function: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies the lifecycle configuration for objects in an Amazon S3 bucket. For more information, see [Object Lifecycle Management](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig.html
     */
    interface LifecycleConfigurationProperty {
        /**
         * A lifecycle rule for individual objects in an Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig.html#cfn-s3-bucket-lifecycleconfig-rules
         */
        readonly rules: Array<CfnBucket.RuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Describes where logs are stored and the prefix that Amazon S3 assigns to all log object keys for a bucket. For examples and more information, see [PUT Bucket logging](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTlogging.html) in the *Amazon S3 API Reference* .
     *
     * > To successfully complete the `AWS::S3::Bucket LoggingConfiguration` request, you must have `s3:PutObject` and `s3:PutObjectAcl` in your IAM permissions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfig.html
     */
    interface LoggingConfigurationProperty {
        /**
         * The name of the bucket where Amazon S3 should store server access log files. You can store log files in any bucket that you own. By default, logs are stored in the bucket where the `LoggingConfiguration` property is defined.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfig.html#cfn-s3-bucket-loggingconfig-destinationbucketname
         */
        readonly destinationBucketName?: string;
        /**
         * A prefix for all log object keys. If you store log files from multiple Amazon S3 buckets in a single bucket, you can use a prefix to distinguish which log files came from which bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfig.html#cfn-s3-bucket-loggingconfig-logfileprefix
         */
        readonly logFilePrefix?: string;
    }
}
export declare namespace CfnBucket {
    /**
     * A container specifying replication metrics-related settings enabling replication metrics and events.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metrics.html
     */
    interface MetricsProperty {
        /**
         * A container specifying the time threshold for emitting the `s3:Replication:OperationMissedThreshold` event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metrics.html#cfn-s3-bucket-metrics-eventthreshold
         */
        readonly eventThreshold?: CfnBucket.ReplicationTimeValueProperty | cdk.IResolvable;
        /**
         * Specifies whether the replication metrics are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metrics.html#cfn-s3-bucket-metrics-status
         */
        readonly status: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies a metrics configuration for the CloudWatch request metrics (specified by the metrics configuration ID) from an Amazon S3 bucket. If you're updating an existing metrics configuration, note that this is a full replacement of the existing metrics configuration. If you don't include the elements you want to keep, they are erased. For examples, see [AWS::S3::Bucket](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#aws-properties-s3-bucket--examples) . For more information, see [PUT Bucket metrics](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTMetricConfiguration.html) in the *Amazon S3 API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html
     */
    interface MetricsConfigurationProperty {
        /**
         * The access point that was used while performing operations on the object. The metrics configuration only includes objects that meet the filter's criteria.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-accesspointarn
         */
        readonly accessPointArn?: string;
        /**
         * The ID used to identify the metrics configuration. This can be any value you choose that helps you identify your metrics configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-id
         */
        readonly id: string;
        /**
         * The prefix that an object must have to be included in the metrics results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-prefix
         */
        readonly prefix?: string;
        /**
         * Specifies a list of tag filters to use as a metrics configuration filter. The metrics configuration includes only objects that meet the filter's criteria.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-tagfilters
         */
        readonly tagFilters?: Array<CfnBucket.TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies when noncurrent object versions expire. Upon expiration, Amazon S3 permanently deletes the noncurrent object versions. You set this lifecycle configuration action on a bucket that has versioning enabled (or suspended) to request that Amazon S3 delete noncurrent object versions at a specific period in the object's lifetime.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration.html
     */
    interface NoncurrentVersionExpirationProperty {
        /**
         * Specifies how many noncurrent versions Amazon S3 will retain. If there are this many more recent noncurrent versions, Amazon S3 will take the associated action. For more information about noncurrent versions, see [Lifecycle configuration elements](https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration-newernoncurrentversions
         */
        readonly newerNoncurrentVersions?: number;
        /**
         * Specifies the number of days an object is noncurrent before Amazon S3 can perform the associated action. For information about the noncurrent days calculations, see [How Amazon S3 Calculates When an Object Became Noncurrent](https://docs.aws.amazon.com/AmazonS3/latest/dev/intro-lifecycle-rules.html#non-current-days-calculations) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration-noncurrentdays
         */
        readonly noncurrentDays: number;
    }
}
export declare namespace CfnBucket {
    /**
     * Container for the transition rule that describes when noncurrent objects transition to the `STANDARD_IA` , `ONEZONE_IA` , `INTELLIGENT_TIERING` , `GLACIER_IR` , `GLACIER` , or `DEEP_ARCHIVE` storage class. If your bucket is versioning-enabled (or versioning is suspended), you can set this action to request that Amazon S3 transition noncurrent object versions to the `STANDARD_IA` , `ONEZONE_IA` , `INTELLIGENT_TIERING` , `GLACIER_IR` , `GLACIER` , or `DEEP_ARCHIVE` storage class at a specific period in the object's lifetime. If you specify this property, don't specify the `NoncurrentVersionTransitions` property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html
     */
    interface NoncurrentVersionTransitionProperty {
        /**
         * Specifies how many noncurrent versions Amazon S3 will retain. If there are this many more recent noncurrent versions, Amazon S3 will take the associated action. For more information about noncurrent versions, see [Lifecycle configuration elements](https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition-newernoncurrentversions
         */
        readonly newerNoncurrentVersions?: number;
        /**
         * The class of storage used to store the object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition-storageclass
         */
        readonly storageClass: string;
        /**
         * Specifies the number of days an object is noncurrent before Amazon S3 can perform the associated action. For information about the noncurrent days calculations, see [How Amazon S3 Calculates How Long an Object Has Been Noncurrent](https://docs.aws.amazon.com/AmazonS3/latest/dev/intro-lifecycle-rules.html#non-current-days-calculations) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition-transitionindays
         */
        readonly transitionInDays: number;
    }
}
export declare namespace CfnBucket {
    /**
     * Describes the notification configuration for an Amazon S3 bucket.
     *
     * > If you create the target resource and related permissions in the same template, you might have a circular dependency.
     * >
     * > For example, you might use the `AWS::Lambda::Permission` resource to grant the bucket permission to invoke an AWS Lambda function. However, AWS CloudFormation can't create the bucket until the bucket has permission to invoke the function ( AWS CloudFormation checks whether the bucket can invoke the function). If you're using Refs to pass the bucket name, this leads to a circular dependency.
     * >
     * > To avoid this dependency, you can create all resources without specifying the notification configuration. Then, update the stack with a notification configuration.
     * >
     * > For more information on permissions, see [AWS::Lambda::Permission](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html) and [Granting Permissions to Publish Event Notification Messages to a Destination](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html#grant-destinations-permissions-to-s3) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html
     */
    interface NotificationConfigurationProperty {
        /**
         * Enables delivery of events to Amazon EventBridge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html#cfn-s3-bucket-notificationconfig-eventbridgeconfig
         */
        readonly eventBridgeConfiguration?: CfnBucket.EventBridgeConfigurationProperty | cdk.IResolvable;
        /**
         * Describes the AWS Lambda functions to invoke and the events for which to invoke them.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig
         */
        readonly lambdaConfigurations?: Array<CfnBucket.LambdaConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The Amazon Simple Queue Service queues to publish messages to and the events for which to publish messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html#cfn-s3-bucket-notificationconfig-queueconfig
         */
        readonly queueConfigurations?: Array<CfnBucket.QueueConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The topic to which notifications are sent and the events for which notifications are generated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html#cfn-s3-bucket-notificationconfig-topicconfig
         */
        readonly topicConfigurations?: Array<CfnBucket.TopicConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies object key name filtering rules. For information about key name filtering, see [Configuring event notifications using object key name filtering](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-filtering.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
     */
    interface NotificationFilterProperty {
        /**
         * A container for object key name prefix and suffix filtering rules.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html#cfn-s3-bucket-notificationconfiguraiton-config-filter-s3key
         */
        readonly s3Key: CfnBucket.S3KeyFilterProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Places an Object Lock configuration on the specified bucket. The rule specified in the Object Lock configuration will be applied by default to every new object placed in the specified bucket. For more information, see [Locking Objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lock.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockconfiguration.html
     */
    interface ObjectLockConfigurationProperty {
        /**
         * Indicates whether this bucket has an Object Lock configuration enabled. Enable `ObjectLockEnabled` when you apply `ObjectLockConfiguration` to a bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockconfiguration.html#cfn-s3-bucket-objectlockconfiguration-objectlockenabled
         */
        readonly objectLockEnabled?: string;
        /**
         * Specifies the Object Lock rule for the specified object. Enable this rule when you apply `ObjectLockConfiguration` to a bucket. If Object Lock is turned on, bucket settings require both `Mode` and a period of either `Days` or `Years` . You cannot specify `Days` and `Years` at the same time. For more information, see [ObjectLockRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html) and [DefaultRetention](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockconfiguration.html#cfn-s3-bucket-objectlockconfiguration-rule
         */
        readonly rule?: CfnBucket.ObjectLockRuleProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies the Object Lock rule for the specified object. Enable the this rule when you apply `ObjectLockConfiguration` to a bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html
     */
    interface ObjectLockRuleProperty {
        /**
         * The default Object Lock retention mode and period that you want to apply to new objects placed in the specified bucket. If Object Lock is turned on, bucket settings require both `Mode` and a period of either `Days` or `Years` . You cannot specify `Days` and `Years` at the same time. For more information about allowable values for mode and period, see [DefaultRetention](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html#cfn-s3-bucket-objectlockrule-defaultretention
         */
        readonly defaultRetention?: CfnBucket.DefaultRetentionProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies the container element for Object Ownership rules.
     *
     * S3 Object Ownership is an Amazon S3 bucket-level setting that you can use to disable access control lists (ACLs) and take ownership of every object in your bucket, simplifying access management for data stored in Amazon S3. For more information, see [Controlling ownership of objects and disabling ACLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrols.html
     */
    interface OwnershipControlsProperty {
        /**
         * Specifies the container element for Object Ownership rules.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrols.html#cfn-s3-bucket-ownershipcontrols-rules
         */
        readonly rules: Array<CfnBucket.OwnershipControlsRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies an Object Ownership rule.
     *
     * S3 Object Ownership is an Amazon S3 bucket-level setting that you can use to disable access control lists (ACLs) and take ownership of every object in your bucket, simplifying access management for data stored in Amazon S3. For more information, see [Controlling ownership of objects and disabling ACLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrolsrule.html
     */
    interface OwnershipControlsRuleProperty {
        /**
         * Specifies an Object Ownership rule.
         *
         * *Allowed values* : `BucketOwnerEnforced` | `ObjectWriter` | `BucketOwnerPreferred`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrolsrule.html#cfn-s3-bucket-ownershipcontrolsrule-objectownership
         */
        readonly objectOwnership?: string;
    }
}
export declare namespace CfnBucket {
    /**
     * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket. You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html
     */
    interface PublicAccessBlockConfigurationProperty {
        /**
         * Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket. Setting this element to `TRUE` causes the following behavior:
         *
         * - PUT Bucket ACL and PUT Object ACL calls fail if the specified ACL is public.
         * - PUT Object calls fail if the request includes a public ACL.
         * - PUT Bucket calls fail if the request includes a public ACL.
         *
         * Enabling this setting doesn't affect existing policies or ACLs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-blockpublicacls
         */
        readonly blockPublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should block public bucket policies for this bucket. Setting this element to `TRUE` causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access.
         *
         * Enabling this setting doesn't affect existing bucket policies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-blockpublicpolicy
         */
        readonly blockPublicPolicy?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket. Setting this element to `TRUE` causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket.
         *
         * Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-ignorepublicacls
         */
        readonly ignorePublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should restrict public bucket policies for this bucket. Setting this element to `TRUE` restricts access to this bucket to only AWS service principals and authorized users within this account if the bucket has a public policy.
         *
         * Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-restrictpublicbuckets
         */
        readonly restrictPublicBuckets?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies the configuration for publishing messages to an Amazon Simple Queue Service (Amazon SQS) queue when Amazon S3 detects specified events.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html
     */
    interface QueueConfigurationProperty {
        /**
         * The Amazon S3 bucket event about which you want to publish messages to Amazon SQS. For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html#cfn-s3-bucket-notificationconfig-queueconfig-event
         */
        readonly event: string;
        /**
         * The filtering rules that determine which objects trigger notifications. For example, you can create a filter so that Amazon S3 sends notifications only when image files with a `.jpg` extension are added to the bucket. For more information, see [Configuring event notifications using object key name filtering](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/notification-how-to-filtering.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html#cfn-s3-bucket-notificationconfig-queueconfig-filter
         */
        readonly filter?: CfnBucket.NotificationFilterProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the Amazon SQS queue to which Amazon S3 publishes a message when it detects events of the specified type. FIFO queues are not allowed when enabling an SQS queue as the event notification destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html#cfn-s3-bucket-notificationconfig-queueconfig-queue
         */
        readonly queue: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies the redirect behavior of all requests to a website endpoint of an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-redirectallrequeststo.html
     */
    interface RedirectAllRequestsToProperty {
        /**
         * Name of the host where requests are redirected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-redirectallrequeststo.html#cfn-s3-websiteconfiguration-redirectallrequeststo-hostname
         */
        readonly hostName: string;
        /**
         * Protocol to use when redirecting requests. The default is the protocol that is used in the original request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-redirectallrequeststo.html#cfn-s3-websiteconfiguration-redirectallrequeststo-protocol
         */
        readonly protocol?: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies how requests are redirected. In the event of an error, you can specify a different error code to return.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html
     */
    interface RedirectRuleProperty {
        /**
         * The host name to use in the redirect request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html#cfn-s3-websiteconfiguration-redirectrule-hostname
         */
        readonly hostName?: string;
        /**
         * The HTTP redirect code to use on the response. Not required if one of the siblings is present.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html#cfn-s3-websiteconfiguration-redirectrule-httpredirectcode
         */
        readonly httpRedirectCode?: string;
        /**
         * Protocol to use when redirecting requests. The default is the protocol that is used in the original request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html#cfn-s3-websiteconfiguration-redirectrule-protocol
         */
        readonly protocol?: string;
        /**
         * The object key prefix to use in the redirect request. For example, to redirect requests for all pages with prefix `docs/` (objects in the `docs/` folder) to `documents/` , you can set a condition block with `KeyPrefixEquals` set to `docs/` and in the Redirect set `ReplaceKeyPrefixWith` to `/documents` . Not required if one of the siblings is present. Can be present only if `ReplaceKeyWith` is not provided.
         *
         * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html#cfn-s3-websiteconfiguration-redirectrule-replacekeyprefixwith
         */
        readonly replaceKeyPrefixWith?: string;
        /**
         * The specific object key to use in the redirect request. For example, redirect request to `error.html` . Not required if one of the siblings is present. Can be present only if `ReplaceKeyPrefixWith` is not provided.
         *
         * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-redirectrule.html#cfn-s3-websiteconfiguration-redirectrule-replacekeywith
         */
        readonly replaceKeyWith?: string;
    }
}
export declare namespace CfnBucket {
    /**
     * A filter that you can specify for selection for modifications on replicas.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicamodifications.html
     */
    interface ReplicaModificationsProperty {
        /**
         * Specifies whether Amazon S3 replicates modifications on replicas.
         *
         * *Allowed values* : `Enabled` | `Disabled`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicamodifications.html#cfn-s3-bucket-replicamodifications-status
         */
        readonly status: string;
    }
}
export declare namespace CfnBucket {
    /**
     * A container for replication rules. You can add up to 1,000 rules. The maximum size of a replication configuration is 2 MB.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html
     */
    interface ReplicationConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that Amazon S3 assumes when replicating objects. For more information, see [How to Set Up Replication](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-how-setup.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html#cfn-s3-bucket-replicationconfiguration-role
         */
        readonly role: string;
        /**
         * A container for one or more replication rules. A replication configuration must have at least one rule and can contain a maximum of 1,000 rules.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html#cfn-s3-bucket-replicationconfiguration-rules
         */
        readonly rules: Array<CfnBucket.ReplicationRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * A container for information about the replication destination and its configurations including enabling the S3 Replication Time Control (S3 RTC).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html
     */
    interface ReplicationDestinationProperty {
        /**
         * Specify this only in a cross-account scenario (where source and destination bucket owners are not the same), and you want to change replica ownership to the AWS account that owns the destination bucket. If this is not specified in the replication configuration, the replicas are owned by same AWS account that owns the source object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationdestination-accesscontroltranslation
         */
        readonly accessControlTranslation?: CfnBucket.AccessControlTranslationProperty | cdk.IResolvable;
        /**
         * Destination bucket owner account ID. In a cross-account scenario, if you direct Amazon S3 to change replica ownership to the AWS account that owns the destination bucket by specifying the `AccessControlTranslation` property, this is the account ID of the destination bucket owner. For more information, see [Cross-Region Replication Additional Configuration: Change Replica Owner](https://docs.aws.amazon.com/AmazonS3/latest/dev/crr-change-owner.html) in the *Amazon S3 User Guide* .
         *
         * If you specify the `AccessControlTranslation` property, the `Account` property is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationdestination-account
         */
        readonly account?: string;
        /**
         * The Amazon Resource Name (ARN) of the bucket where you want Amazon S3 to store the results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationconfiguration-rules-destination-bucket
         */
        readonly bucket: string;
        /**
         * Specifies encryption-related information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationdestination-encryptionconfiguration
         */
        readonly encryptionConfiguration?: CfnBucket.EncryptionConfigurationProperty | cdk.IResolvable;
        /**
         * A container specifying replication metrics-related settings enabling replication metrics and events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationdestination-metrics
         */
        readonly metrics?: CfnBucket.MetricsProperty | cdk.IResolvable;
        /**
         * A container specifying S3 Replication Time Control (S3 RTC), including whether S3 RTC is enabled and the time when all objects and operations on objects must be replicated. Must be specified together with a `Metrics` block.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationdestination-replicationtime
         */
        readonly replicationTime?: CfnBucket.ReplicationTimeProperty | cdk.IResolvable;
        /**
         * The storage class to use when replicating objects, such as S3 Standard or reduced redundancy. By default, Amazon S3 uses the storage class of the source object to create the object replica.
         *
         * For valid values, see the `StorageClass` element of the [PUT Bucket replication](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTreplication.html) action in the *Amazon S3 API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules-destination.html#cfn-s3-bucket-replicationconfiguration-rules-destination-storageclass
         */
        readonly storageClass?: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies which Amazon S3 objects to replicate and where to store the replicas.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html
     */
    interface ReplicationRuleProperty {
        /**
         * Specifies whether Amazon S3 replicates delete markers. If you specify a `Filter` in your replication configuration, you must also include a `DeleteMarkerReplication` element. If your `Filter` includes a `Tag` element, the `DeleteMarkerReplication` `Status` must be set to Disabled, because Amazon S3 does not support replicating delete markers for tag-based rules. For an example configuration, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-config-min-rule-config) .
         *
         * For more information about delete marker replication, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/delete-marker-replication.html) .
         *
         * > If you are using an earlier version of the replication configuration, Amazon S3 handles replication of delete markers differently. For more information, see [Backward Compatibility](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-backward-compat-considerations) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationrule-deletemarkerreplication
         */
        readonly deleteMarkerReplication?: CfnBucket.DeleteMarkerReplicationProperty | cdk.IResolvable;
        /**
         * A container for information about the replication destination and its configurations including enabling the S3 Replication Time Control (S3 RTC).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationconfiguration-rules-destination
         */
        readonly destination: CfnBucket.ReplicationDestinationProperty | cdk.IResolvable;
        /**
         * A filter that identifies the subset of objects to which the replication rule applies. A `Filter` must specify exactly one `Prefix` , `TagFilter` , or an `And` child element. The use of the filter field indicates that this is a V2 replication configuration. This field isn't supported in a V1 replication configuration.
         *
         * > V1 replication configuration only supports filtering by key prefix. To filter using a V1 replication configuration, add the `Prefix` directly as a child element of the `Rule` element.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationrule-filter
         */
        readonly filter?: CfnBucket.ReplicationRuleFilterProperty | cdk.IResolvable;
        /**
         * A unique identifier for the rule. The maximum value is 255 characters. If you don't specify a value, AWS CloudFormation generates a random ID. When using a V2 replication configuration this property is capitalized as "ID".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationconfiguration-rules-id
         */
        readonly id?: string;
        /**
         * An object key name prefix that identifies the object or objects to which the rule applies. The maximum prefix length is 1,024 characters. To include all objects in a bucket, specify an empty string. To filter using a V1 replication configuration, add the `Prefix` directly as a child element of the `Rule` element.
         *
         * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationconfiguration-rules-prefix
         */
        readonly prefix?: string;
        /**
         * The priority indicates which rule has precedence whenever two or more replication rules conflict. Amazon S3 will attempt to replicate objects according to all replication rules. However, if there are two or more rules with the same destination bucket, then objects will be replicated according to the rule with the highest priority. The higher the number, the higher the priority.
         *
         * For more information, see [Replication](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationrule-priority
         */
        readonly priority?: number;
        /**
         * A container that describes additional filters for identifying the source objects that you want to replicate. You can choose to enable or disable the replication of these objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationrule-sourceselectioncriteria
         */
        readonly sourceSelectionCriteria?: CfnBucket.SourceSelectionCriteriaProperty | cdk.IResolvable;
        /**
         * Specifies whether the rule is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration-rules.html#cfn-s3-bucket-replicationconfiguration-rules-status
         */
        readonly status: string;
    }
}
export declare namespace CfnBucket {
    /**
     * A container for specifying rule filters. The filters determine the subset of objects to which the rule applies. This element is required only if you specify more than one filter.
     *
     * For example:
     *
     * - If you specify both a `Prefix` and a `TagFilter` , wrap these filters in an `And` tag.
     * - If you specify a filter based on multiple tags, wrap the `TagFilter` elements in an `And` tag
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationruleandoperator.html
     */
    interface ReplicationRuleAndOperatorProperty {
        /**
         * An object key name prefix that identifies the subset of objects to which the rule applies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationruleandoperator.html#cfn-s3-bucket-replicationruleandoperator-prefix
         */
        readonly prefix?: string;
        /**
         * An array of tags containing key and value pairs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationruleandoperator.html#cfn-s3-bucket-replicationruleandoperator-tagfilters
         */
        readonly tagFilters?: Array<CfnBucket.TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * A filter that identifies the subset of objects to which the replication rule applies. A `Filter` must specify exactly one `Prefix` , `TagFilter` , or an `And` child element.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html
     */
    interface ReplicationRuleFilterProperty {
        /**
         * A container for specifying rule filters. The filters determine the subset of objects to which the rule applies. This element is required only if you specify more than one filter. For example:
         *
         * - If you specify both a `Prefix` and a `TagFilter` , wrap these filters in an `And` tag.
         * - If you specify a filter based on multiple tags, wrap the `TagFilter` elements in an `And` tag.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html#cfn-s3-bucket-replicationrulefilter-and
         */
        readonly and?: CfnBucket.ReplicationRuleAndOperatorProperty | cdk.IResolvable;
        /**
         * An object key name prefix that identifies the subset of objects to which the rule applies.
         *
         * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html#cfn-s3-bucket-replicationrulefilter-prefix
         */
        readonly prefix?: string;
        /**
         * A container for specifying a tag key and value.
         *
         * The rule applies only to objects that have the tag in their tag set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html#cfn-s3-bucket-replicationrulefilter-tagfilter
         */
        readonly tagFilter?: CfnBucket.TagFilterProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * A container specifying S3 Replication Time Control (S3 RTC) related information, including whether S3 RTC is enabled and the time when all objects and operations on objects must be replicated. Must be specified together with a `Metrics` block.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtime.html
     */
    interface ReplicationTimeProperty {
        /**
         * Specifies whether the replication time is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtime.html#cfn-s3-bucket-replicationtime-status
         */
        readonly status: string;
        /**
         * A container specifying the time by which replication should be complete for all objects and operations on objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtime.html#cfn-s3-bucket-replicationtime-time
         */
        readonly time: CfnBucket.ReplicationTimeValueProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * A container specifying the time value for S3 Replication Time Control (S3 RTC) and replication metrics `EventThreshold` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtimevalue.html
     */
    interface ReplicationTimeValueProperty {
        /**
         * Contains an integer specifying time in minutes.
         *
         * Valid value: 15
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtimevalue.html#cfn-s3-bucket-replicationtimevalue-minutes
         */
        readonly minutes: number;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies the redirect behavior and when a redirect is applied. For more information about routing rules, see [Configuring advanced conditional redirects](https://docs.aws.amazon.com/AmazonS3/latest/dev/how-to-page-redirect.html#advanced-conditional-redirects) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules.html
     */
    interface RoutingRuleProperty {
        /**
         * Container for redirect information. You can redirect requests to another host, to another page, or with another protocol. In the event of an error, you can specify a different error code to return.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules.html#cfn-s3-websiteconfiguration-routingrules-redirectrule
         */
        readonly redirectRule: CfnBucket.RedirectRuleProperty | cdk.IResolvable;
        /**
         * A container for describing a condition that must be met for the specified redirect to apply. For example, 1. If request is for pages in the `/docs` folder, redirect to the `/documents` folder. 2. If request results in HTTP error 4xx, redirect request to another host where you might process the error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules.html#cfn-s3-websiteconfiguration-routingrules-routingrulecondition
         */
        readonly routingRuleCondition?: CfnBucket.RoutingRuleConditionProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * A container for describing a condition that must be met for the specified redirect to apply. For example, 1. If request is for pages in the `/docs` folder, redirect to the `/documents` folder. 2. If request results in HTTP error 4xx, redirect request to another host where you might process the error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-routingrulecondition.html
     */
    interface RoutingRuleConditionProperty {
        /**
         * The HTTP error code when the redirect is applied. In the event of an error, if the error code equals this value, then the specified redirect is applied.
         *
         * Required when parent element `Condition` is specified and sibling `KeyPrefixEquals` is not specified. If both are specified, then both must be true for the redirect to be applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-routingrulecondition.html#cfn-s3-websiteconfiguration-routingrules-routingrulecondition-httperrorcodereturnedequals
         */
        readonly httpErrorCodeReturnedEquals?: string;
        /**
         * The object key name prefix when the redirect is applied. For example, to redirect requests for `ExamplePage.html` , the key prefix will be `ExamplePage.html` . To redirect request for all pages with the prefix `docs/` , the key prefix will be `/docs` , which identifies all objects in the docs/ folder.
         *
         * Required when the parent element `Condition` is specified and sibling `HttpErrorCodeReturnedEquals` is not specified. If both conditions are specified, both must be true for the redirect to be applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules-routingrulecondition.html#cfn-s3-websiteconfiguration-routingrules-routingrulecondition-keyprefixequals
         */
        readonly keyPrefixEquals?: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies lifecycle rules for an Amazon S3 bucket. For more information, see [Put Bucket Lifecycle Configuration](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTlifecycle.html) in the *Amazon S3 API Reference* .
     *
     * You must specify at least one of the following properties: `AbortIncompleteMultipartUpload` , `ExpirationDate` , `ExpirationInDays` , `NoncurrentVersionExpirationInDays` , `NoncurrentVersionTransition` , `NoncurrentVersionTransitions` , `Transition` , or `Transitions` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html
     */
    interface RuleProperty {
        /**
         * Specifies a lifecycle rule that stops incomplete multipart uploads to an Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-rule-abortincompletemultipartupload
         */
        readonly abortIncompleteMultipartUpload?: CfnBucket.AbortIncompleteMultipartUploadProperty | cdk.IResolvable;
        /**
         * Indicates when objects are deleted from Amazon S3 and Amazon S3 Glacier. The date value must be in ISO 8601 format. The time is always midnight UTC. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-expirationdate
         */
        readonly expirationDate?: Date | cdk.IResolvable;
        /**
         * Indicates the number of days after creation when objects are deleted from Amazon S3 and Amazon S3 Glacier. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-expirationindays
         */
        readonly expirationInDays?: number;
        /**
         * Indicates whether Amazon S3 will remove a delete marker without any noncurrent versions. If set to true, the delete marker will be removed if there are no noncurrent versions. This cannot be specified with `ExpirationInDays` , `ExpirationDate` , or `TagFilters` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-rule-expiredobjectdeletemarker
         */
        readonly expiredObjectDeleteMarker?: boolean | cdk.IResolvable;
        /**
         * Unique identifier for the rule. The value can't be longer than 255 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-id
         */
        readonly id?: string;
        /**
         * Specifies when noncurrent object versions expire. Upon expiration, Amazon S3 permanently deletes the noncurrent object versions. You set this lifecycle configuration action on a bucket that has versioning enabled (or suspended) to request that Amazon S3 delete noncurrent object versions at a specific period in the object's lifetime.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversionexpiration
         */
        readonly noncurrentVersionExpiration?: CfnBucket.NoncurrentVersionExpirationProperty | cdk.IResolvable;
        /**
         * (Deprecated.) For buckets with versioning enabled (or suspended), specifies the time, in days, between when a new version of the object is uploaded to the bucket and when old versions of the object expire. When object versions expire, Amazon S3 permanently deletes them. If you specify a transition and expiration time, the expiration time must be later than the transition time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversionexpirationindays
         */
        readonly noncurrentVersionExpirationInDays?: number;
        /**
         * (Deprecated.) For buckets with versioning enabled (or suspended), specifies when non-current objects transition to a specified storage class. If you specify a transition and expiration time, the expiration time must be later than the transition time. If you specify this property, don't specify the `NoncurrentVersionTransitions` property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition
         */
        readonly noncurrentVersionTransition?: CfnBucket.NoncurrentVersionTransitionProperty | cdk.IResolvable;
        /**
         * For buckets with versioning enabled (or suspended), one or more transition rules that specify when non-current objects transition to a specified storage class. If you specify a transition and expiration time, the expiration time must be later than the transition time. If you specify this property, don't specify the `NoncurrentVersionTransition` property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransitions
         */
        readonly noncurrentVersionTransitions?: Array<CfnBucket.NoncurrentVersionTransitionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies the minimum object size in bytes for this rule to apply to. Objects must be larger than this value in bytes. For more information about size based rules, see [Lifecycle configuration using size-based rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html#lc-size-rules) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-objectsizegreaterthan
         */
        readonly objectSizeGreaterThan?: number;
        /**
         * Specifies the maximum object size in bytes for this rule to apply to. Objects must be smaller than this value in bytes. For more information about sized based rules, see [Lifecycle configuration using size-based rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html#lc-size-rules) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-objectsizelessthan
         */
        readonly objectSizeLessThan?: number;
        /**
         * Object key prefix that identifies one or more objects to which this rule applies.
         *
         * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-prefix
         */
        readonly prefix?: string;
        /**
         * If `Enabled` , the rule is currently being applied. If `Disabled` , the rule is not currently being applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-status
         */
        readonly status: string;
        /**
         * Tags to use to identify a subset of objects to which the lifecycle rule applies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-rule-tagfilters
         */
        readonly tagFilters?: Array<CfnBucket.TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * (Deprecated.) Specifies when an object transitions to a specified storage class. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time. If you specify this property, don't specify the `Transitions` property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-transition
         */
        readonly transition?: CfnBucket.TransitionProperty | cdk.IResolvable;
        /**
         * One or more transition rules that specify when an object transitions to a specified storage class. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time. If you specify this property, don't specify the `Transition` property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-transitions
         */
        readonly transitions?: Array<CfnBucket.TransitionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * A container for object key name prefix and suffix filtering rules. For more information about object key name filtering, see [Configuring event notifications using object key name filtering](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-filtering.html) in the *Amazon S3 User Guide* .
     *
     * > The same type of filter rule cannot be used more than once. For example, you cannot specify two prefix rules.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key.html
     */
    interface S3KeyFilterProperty {
        /**
         * A list of containers for the key-value pair that defines the criteria for the filter rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key.html#cfn-s3-bucket-notificationconfiguraiton-config-filter-s3key-rules
         */
        readonly rules: Array<CfnBucket.FilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Describes the default server-side encryption to apply to new objects in the bucket. If a PUT Object request doesn't specify any server-side encryption, this default encryption will be applied. If you don't specify a customer managed key at configuration, Amazon S3 automatically creates an AWS KMS key in your AWS account the first time that you add an object encrypted with SSE-KMS to a bucket. By default, Amazon S3 uses this KMS key for SSE-KMS. For more information, see [PUT Bucket encryption](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTencryption.html) in the *Amazon S3 API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html
     */
    interface ServerSideEncryptionByDefaultProperty {
        /**
         * KMS key ID to use for the default encryption. This parameter is allowed if SSEAlgorithm is aws:kms.
         *
         * You can specify the key ID, key alias, or the Amazon Resource Name (ARN) of the CMK. However, if you are using encryption with cross-account operations, you must use a fully qualified CMK ARN. For more information, see [Using encryption for cross-account operations](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html#bucket-encryption-update-bucket-policy) .
         *
         * For example:
         *
         * - Key ID: `1234abcd-12ab-34cd-56ef-1234567890ab`
         * - Key ARN: `arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab`
         *
         * > Amazon S3 only supports symmetric KMS keys and not asymmetric KMS keys. For more information, see [Using Symmetric and Asymmetric Keys](https://docs.aws.amazon.com//kms/latest/developerguide/symmetric-asymmetric.html) in the *AWS Key Management Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html#cfn-s3-bucket-serversideencryptionbydefault-kmsmasterkeyid
         */
        readonly kmsMasterKeyId?: string;
        /**
         * Server-side encryption algorithm to use for the default encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html#cfn-s3-bucket-serversideencryptionbydefault-ssealgorithm
         */
        readonly sseAlgorithm: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies the default server-side encryption configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html
     */
    interface ServerSideEncryptionRuleProperty {
        /**
         * Specifies whether Amazon S3 should use an S3 Bucket Key with server-side encryption using KMS (SSE-KMS) for new objects in the bucket. Existing objects are not affected. Setting the `BucketKeyEnabled` element to `true` causes Amazon S3 to use an S3 Bucket Key. By default, S3 Bucket Key is not enabled.
         *
         * For more information, see [Amazon S3 Bucket Keys](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-key.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html#cfn-s3-bucket-serversideencryptionrule-bucketkeyenabled
         */
        readonly bucketKeyEnabled?: boolean | cdk.IResolvable;
        /**
         * Specifies the default server-side encryption to apply to new objects in the bucket. If a PUT Object request doesn't specify any server-side encryption, this default encryption will be applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html#cfn-s3-bucket-serversideencryptionrule-serversideencryptionbydefault
         */
        readonly serverSideEncryptionByDefault?: CfnBucket.ServerSideEncryptionByDefaultProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * A container that describes additional filters for identifying the source objects that you want to replicate. You can choose to enable or disable the replication of these objects.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html
     */
    interface SourceSelectionCriteriaProperty {
        /**
         * A filter that you can specify for selection for modifications on replicas.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html#cfn-s3-bucket-sourceselectioncriteria-replicamodifications
         */
        readonly replicaModifications?: CfnBucket.ReplicaModificationsProperty | cdk.IResolvable;
        /**
         * A container for filter information for the selection of Amazon S3 objects encrypted with AWS KMS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html#cfn-s3-bucket-sourceselectioncriteria-ssekmsencryptedobjects
         */
        readonly sseKmsEncryptedObjects?: CfnBucket.SseKmsEncryptedObjectsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * A container for filter information for the selection of S3 objects encrypted with AWS KMS.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ssekmsencryptedobjects.html
     */
    interface SseKmsEncryptedObjectsProperty {
        /**
         * Specifies whether Amazon S3 replicates objects created with server-side encryption using an AWS KMS key stored in AWS Key Management Service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ssekmsencryptedobjects.html#cfn-s3-bucket-ssekmsencryptedobjects-status
         */
        readonly status: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies data related to access patterns to be collected and made available to analyze the tradeoffs between different storage classes for an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-storageclassanalysis.html
     */
    interface StorageClassAnalysisProperty {
        /**
         * Specifies how data related to the storage class analysis for an Amazon S3 bucket should be exported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-storageclassanalysis.html#cfn-s3-bucket-storageclassanalysis-dataexport
         */
        readonly dataExport?: CfnBucket.DataExportProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies tags to use to identify a subset of objects for an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tagfilter.html
     */
    interface TagFilterProperty {
        /**
         * The tag key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tagfilter.html#cfn-s3-bucket-tagfilter-key
         */
        readonly key: string;
        /**
         * The tag value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tagfilter.html#cfn-s3-bucket-tagfilter-value
         */
        readonly value: string;
    }
}
export declare namespace CfnBucket {
    /**
     * The S3 Intelligent-Tiering storage class is designed to optimize storage costs by automatically moving data to the most cost-effective storage access tier, without additional operational overhead.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tiering.html
     */
    interface TieringProperty {
        /**
         * S3 Intelligent-Tiering access tier. See [Storage class for automatically optimizing frequently and infrequently accessed objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-class-intro.html#sc-dynamic-data-access) for a list of access tiers in the S3 Intelligent-Tiering storage class.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tiering.html#cfn-s3-bucket-tiering-accesstier
         */
        readonly accessTier: string;
        /**
         * The number of consecutive days of no access after which an object will be eligible to be transitioned to the corresponding tier. The minimum number of days specified for Archive Access tier must be at least 90 days and Deep Archive Access tier must be at least 180 days. The maximum can be up to 2 years (730 days).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tiering.html#cfn-s3-bucket-tiering-days
         */
        readonly days: number;
    }
}
export declare namespace CfnBucket {
    /**
     * A container for specifying the configuration for publication of messages to an Amazon Simple Notification Service (Amazon SNS) topic when Amazon S3 detects specified events.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-topicconfig.html
     */
    interface TopicConfigurationProperty {
        /**
         * The Amazon S3 bucket event about which to send notifications. For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-topicconfig.html#cfn-s3-bucket-notificationconfig-topicconfig-event
         */
        readonly event: string;
        /**
         * The filtering rules that determine for which objects to send notifications. For example, you can create a filter so that Amazon S3 sends notifications only when image files with a `.jpg` extension are added to the bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-topicconfig.html#cfn-s3-bucket-notificationconfig-topicconfig-filter
         */
        readonly filter?: CfnBucket.NotificationFilterProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the Amazon SNS topic to which Amazon S3 publishes a message when it detects events of the specified type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-topicconfig.html#cfn-s3-bucket-notificationconfig-topicconfig-topic
         */
        readonly topic: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies when an object transitions to a specified storage class. For more information about Amazon S3 lifecycle configuration rules, see [Transitioning Objects Using Amazon S3 Lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/dev/lifecycle-transition-general-considerations.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-transition.html
     */
    interface TransitionProperty {
        /**
         * The storage class to which you want the object to transition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-transition.html#cfn-s3-bucket-lifecycleconfig-rule-transition-storageclass
         */
        readonly storageClass: string;
        /**
         * Indicates when objects are transitioned to the specified storage class. The date value must be in ISO 8601 format. The time is always midnight UTC.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-transition.html#cfn-s3-bucket-lifecycleconfig-rule-transition-transitiondate
         */
        readonly transitionDate?: Date | cdk.IResolvable;
        /**
         * Indicates the number of days after creation when objects are transitioned to the specified storage class. The value must be a positive integer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-transition.html#cfn-s3-bucket-lifecycleconfig-rule-transition-transitionindays
         */
        readonly transitionInDays?: number;
    }
}
export declare namespace CfnBucket {
    /**
     * Describes the versioning state of an Amazon S3 bucket. For more information, see [PUT Bucket versioning](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTVersioningStatus.html) in the *Amazon S3 API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfig.html
     */
    interface VersioningConfigurationProperty {
        /**
         * The versioning state of the bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfig.html#cfn-s3-bucket-versioningconfig-status
         */
        readonly status: string;
    }
}
export declare namespace CfnBucket {
    /**
     * Specifies website configuration parameters for an Amazon S3 bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html
     */
    interface WebsiteConfigurationProperty {
        /**
         * The name of the error document for the website.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-errordocument
         */
        readonly errorDocument?: string;
        /**
         * The name of the index document for the website.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-indexdocument
         */
        readonly indexDocument?: string;
        /**
         * The redirect behavior for every request to this bucket's website endpoint.
         *
         * > If you specify this property, you can't specify any other property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-redirectallrequeststo
         */
        readonly redirectAllRequestsTo?: CfnBucket.RedirectAllRequestsToProperty | cdk.IResolvable;
        /**
         * Rules that define when a redirect is applied and the redirect behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3-websiteconfiguration-routingrules
         */
        readonly routingRules?: Array<CfnBucket.RoutingRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnBucketPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html
 */
export interface CfnBucketPolicyProps {
    /**
     * The name of the Amazon S3 bucket to which the policy applies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html#aws-properties-s3-policy-bucket
     */
    readonly bucket: string;
    /**
     * A policy document containing permissions to add to the specified bucket. In IAM, you must provide policy documents in JSON format. However, in CloudFormation you can provide the policy in JSON or YAML format because CloudFormation converts YAML to JSON before submitting it to IAM. For more information, see the AWS::IAM::Policy [PolicyDocument](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument) resource description in this guide and [Access Policy Language Overview](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-policy-language-overview.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html#aws-properties-s3-policy-policydocument
     */
    readonly policyDocument: any | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::S3::BucketPolicy`
 *
 * Applies an Amazon S3 bucket policy to an Amazon S3 bucket. If you are using an identity other than the root user of the AWS account that owns the bucket, the calling identity must have the `PutBucketPolicy` permissions on the specified bucket and belong to the bucket owner's account in order to use this operation.
 *
 * If you don't have `PutBucketPolicy` permissions, Amazon S3 returns a `403 Access Denied` error. If you have the correct permissions, but you're not using an identity that belongs to the bucket owner's account, Amazon S3 returns a `405 Method Not Allowed` error.
 *
 * > As a security precaution, the root user of the AWS account that owns a bucket can always use this operation, even if the policy explicitly denies the root user the ability to perform this action.
 *
 * For more information, see [Bucket policy examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html) .
 *
 * The following operations are related to `PutBucketPolicy` :
 *
 * - [CreateBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CreateBucket.html)
 * - [DeleteBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucket.html)
 *
 * @cloudformationResource AWS::S3::BucketPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html
 */
export declare class CfnBucketPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::BucketPolicy";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBucketPolicy;
    /**
     * The name of the Amazon S3 bucket to which the policy applies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html#aws-properties-s3-policy-bucket
     */
    bucket: string;
    /**
     * A policy document containing permissions to add to the specified bucket. In IAM, you must provide policy documents in JSON format. However, in CloudFormation you can provide the policy in JSON or YAML format because CloudFormation converts YAML to JSON before submitting it to IAM. For more information, see the AWS::IAM::Policy [PolicyDocument](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument) resource description in this guide and [Access Policy Language Overview](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-policy-language-overview.html) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html#aws-properties-s3-policy-policydocument
     */
    policyDocument: any | cdk.IResolvable;
    /**
     * Create a new `AWS::S3::BucketPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBucketPolicyProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
/**
 * Properties for defining a `CfnMultiRegionAccessPoint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html
 */
export interface CfnMultiRegionAccessPointProps {
    /**
     * A collection of the Regions and buckets associated with the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-regions
     */
    readonly regions: Array<CfnMultiRegionAccessPoint.RegionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-name
     */
    readonly name?: string;
    /**
     * The PublicAccessBlock configuration that you want to apply to this Multi-Region Access Point. You can enable the configuration options in any combination. For more information about when Amazon S3 considers an object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration
     */
    readonly publicAccessBlockConfiguration?: CfnMultiRegionAccessPoint.PublicAccessBlockConfigurationProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::S3::MultiRegionAccessPoint`
 *
 * The `AWS::S3::MultiRegionAccessPoint` resource creates an Amazon S3 Multi-Region Access Point. To learn more about Multi-Region Access Points, see [Multi-Region Access Points in Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiRegionAccessPoints.html) in the in the *Amazon S3 User Guide* .
 *
 * @cloudformationResource AWS::S3::MultiRegionAccessPoint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html
 */
export declare class CfnMultiRegionAccessPoint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::MultiRegionAccessPoint";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMultiRegionAccessPoint;
    /**
     * The alias for the Multi-Region Access Point. For more information about the distinction between the name and the alias of an Multi-Region Access Point, see [Managing Multi-Region Access Points](https://docs.aws.amazon.com/AmazonS3/latest/userguide/CreatingMultiRegionAccessPoints.html#multi-region-access-point-naming) in the *Amazon S3 User Guide* .
     * @cloudformationAttribute Alias
     */
    readonly attrAlias: string;
    /**
     * The timestamp of when the Multi-Region Access Point is created.
     * @cloudformationAttribute CreatedAt
     */
    readonly attrCreatedAt: string;
    /**
     * A collection of the Regions and buckets associated with the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-regions
     */
    regions: Array<CfnMultiRegionAccessPoint.RegionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-name
     */
    name: string | undefined;
    /**
     * The PublicAccessBlock configuration that you want to apply to this Multi-Region Access Point. You can enable the configuration options in any combination. For more information about when Amazon S3 considers an object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration
     */
    publicAccessBlockConfiguration: CfnMultiRegionAccessPoint.PublicAccessBlockConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::S3::MultiRegionAccessPoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMultiRegionAccessPointProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnMultiRegionAccessPoint {
    /**
     * The PublicAccessBlock configuration that you want to apply to this Amazon S3 Multi-Region Access Point. You can enable the configuration options in any combination. For more information about when Amazon S3 considers an object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html
     */
    interface PublicAccessBlockConfigurationProperty {
        /**
         * Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket. Setting this element to `TRUE` causes the following behavior:
         *
         * - PUT Bucket ACL and PUT Object ACL calls fail if the specified ACL is public.
         * - PUT Object calls fail if the request includes a public ACL.
         * - PUT Bucket calls fail if the request includes a public ACL.
         *
         * Enabling this setting doesn't affect existing policies or ACLs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-blockpublicacls
         */
        readonly blockPublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should block public bucket policies for this bucket. Setting this element to `TRUE` causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access.
         *
         * Enabling this setting doesn't affect existing bucket policies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-blockpublicpolicy
         */
        readonly blockPublicPolicy?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket. Setting this element to `TRUE` causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket.
         *
         * Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-ignorepublicacls
         */
        readonly ignorePublicAcls?: boolean | cdk.IResolvable;
        /**
         * Specifies whether Amazon S3 should restrict public bucket policies for this bucket. Setting this element to `TRUE` restricts access to this bucket to only AWS service principals and authorized users within this account if the bucket has a public policy.
         *
         * Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-restrictpublicbuckets
         */
        readonly restrictPublicBuckets?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnMultiRegionAccessPoint {
    /**
     * A bucket associated with a specific Region when creating Multi-Region Access Points.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-region.html
     */
    interface RegionProperty {
        /**
         * The name of the associated bucket for the Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-region.html#cfn-s3-multiregionaccesspoint-region-bucket
         */
        readonly bucket: string;
        /**
         * The AWS account ID that owns the Amazon S3 bucket that's associated with this Multi-Region Access Point.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-region.html#cfn-s3-multiregionaccesspoint-region-bucketaccountid
         */
        readonly bucketAccountId?: string;
    }
}
/**
 * Properties for defining a `CfnMultiRegionAccessPointPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html
 */
export interface CfnMultiRegionAccessPointPolicyProps {
    /**
     * The name of the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html#cfn-s3-multiregionaccesspointpolicy-mrapname
     */
    readonly mrapName: string;
    /**
     * The access policy associated with the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html#cfn-s3-multiregionaccesspointpolicy-policy
     */
    readonly policy: any | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::S3::MultiRegionAccessPointPolicy`
 *
 * Applies an Amazon S3 access policy to an Amazon S3 Multi-Region Access Point.
 *
 * It is not possible to delete an access policy for a Multi-Region Access Point from the CloudFormation template. When you attempt to delete the policy, CloudFormation updates the policy using `DeletionPolicy:Retain` and `UpdateReplacePolicy:Retain` . CloudFormation updates the policy to only allow access to the account that created the bucket.
 *
 * @cloudformationResource AWS::S3::MultiRegionAccessPointPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html
 */
export declare class CfnMultiRegionAccessPointPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::MultiRegionAccessPointPolicy";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMultiRegionAccessPointPolicy;
    /**
     *
     * @cloudformationAttribute PolicyStatus.IsPublic
     */
    readonly attrPolicyStatusIsPublic: string;
    /**
     * The name of the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html#cfn-s3-multiregionaccesspointpolicy-mrapname
     */
    mrapName: string;
    /**
     * The access policy associated with the Multi-Region Access Point.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html#cfn-s3-multiregionaccesspointpolicy-policy
     */
    policy: any | cdk.IResolvable;
    /**
     * Create a new `AWS::S3::MultiRegionAccessPointPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMultiRegionAccessPointPolicyProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnMultiRegionAccessPointPolicy {
    /**
     * The container element for a bucket's policy status.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspointpolicy-policystatus.html
     */
    interface PolicyStatusProperty {
        /**
         * The policy status for this bucket. `TRUE` indicates that this bucket is public. `FALSE` indicates that the bucket is not public.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspointpolicy-policystatus.html#cfn-s3-multiregionaccesspointpolicy-policystatus-ispublic
         */
        readonly isPublic: string;
    }
}
/**
 * Properties for defining a `CfnStorageLens`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html
 */
export interface CfnStorageLensProps {
    /**
     * This resource contains the details Amazon S3 Storage Lens configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html#cfn-s3-storagelens-storagelensconfiguration
     */
    readonly storageLensConfiguration: CfnStorageLens.StorageLensConfigurationProperty | cdk.IResolvable;
    /**
     * A set of tags (key–value pairs) to associate with the Storage Lens configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html#cfn-s3-storagelens-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::S3::StorageLens`
 *
 * The AWS::S3::StorageLens resource creates an Amazon S3 Storage Lens configuration.
 *
 * @cloudformationResource AWS::S3::StorageLens
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html
 */
export declare class CfnStorageLens extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::S3::StorageLens";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStorageLens;
    /**
     * This property contains the details of the ARN of the S3 Storage Lens configuration. This property is read-only.
     * @cloudformationAttribute StorageLensConfiguration.StorageLensArn
     */
    readonly attrStorageLensConfigurationStorageLensArn: string;
    /**
     * This resource contains the details Amazon S3 Storage Lens configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html#cfn-s3-storagelens-storagelensconfiguration
     */
    storageLensConfiguration: CfnStorageLens.StorageLensConfigurationProperty | cdk.IResolvable;
    /**
     * A set of tags (key–value pairs) to associate with the Storage Lens configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html#cfn-s3-storagelens-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::S3::StorageLens`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStorageLensProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnStorageLens {
    /**
     * This resource contains the details of the account-level metrics for Amazon S3 Storage Lens.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html
     */
    interface AccountLevelProperty {
        /**
         * This property contains the details of account-level activity metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-activitymetrics
         */
        readonly activityMetrics?: CfnStorageLens.ActivityMetricsProperty | cdk.IResolvable;
        /**
         * This property contains the details of account-level advanced cost optimization metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-advancedcostoptimizationmetrics
         */
        readonly advancedCostOptimizationMetrics?: CfnStorageLens.AdvancedCostOptimizationMetricsProperty | cdk.IResolvable;
        /**
         * This property contains the details of account-level advanced data protection metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-advanceddataprotectionmetrics
         */
        readonly advancedDataProtectionMetrics?: CfnStorageLens.AdvancedDataProtectionMetricsProperty | cdk.IResolvable;
        /**
         * This property contains the details of the account-level bucket-level configurations for Amazon S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-bucketlevel
         */
        readonly bucketLevel: CfnStorageLens.BucketLevelProperty | cdk.IResolvable;
        /**
         * This property contains the details of account-level detailed status code metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-detailedstatuscodesmetrics
         */
        readonly detailedStatusCodesMetrics?: CfnStorageLens.DetailedStatusCodesMetricsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource enables Amazon S3 Storage Lens activity metrics. Activity metrics show details about how your storage is requested, such as requests (for example, All requests, Get requests, Put requests), bytes uploaded or downloaded, and errors.
     *
     * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-activitymetrics.html
     */
    interface ActivityMetricsProperty {
        /**
         * A property that indicates whether the activity metrics is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-activitymetrics.html#cfn-s3-storagelens-activitymetrics-isenabled
         */
        readonly isEnabled?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource enables Amazon S3 Storage Lens advanced cost optimization metrics. Advanced cost optimization metrics provide insights that you can use to manage and optimize your storage costs, for example, lifecycle rule counts for transitions, expirations, and incomplete multipart uploads.
     *
     * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advancedcostoptimizationmetrics.html
     */
    interface AdvancedCostOptimizationMetricsProperty {
        /**
         * Indicates whether advanced cost optimization metrics are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advancedcostoptimizationmetrics.html#cfn-s3-storagelens-advancedcostoptimizationmetrics-isenabled
         */
        readonly isEnabled?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource enables Amazon S3 Storage Lens advanced data protection metrics. Advanced data protection metrics provide insights that you can use to perform audits and protect your data, for example replication rule counts within and across Regions.
     *
     * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advanceddataprotectionmetrics.html
     */
    interface AdvancedDataProtectionMetricsProperty {
        /**
         * Indicates whether advanced data protection metrics are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advanceddataprotectionmetrics.html#cfn-s3-storagelens-advanceddataprotectionmetrics-isenabled
         */
        readonly isEnabled?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource contains the details of the AWS Organization for Amazon S3 Storage Lens.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-awsorg.html
     */
    interface AwsOrgProperty {
        /**
         * This resource contains the ARN of the AWS Organization.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-awsorg.html#cfn-s3-storagelens-awsorg-arn
         */
        readonly arn: string;
    }
}
export declare namespace CfnStorageLens {
    /**
     * A property for the bucket-level storage metrics for Amazon S3 Storage Lens.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html
     */
    interface BucketLevelProperty {
        /**
         * A property for bucket-level activity metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-activitymetrics
         */
        readonly activityMetrics?: CfnStorageLens.ActivityMetricsProperty | cdk.IResolvable;
        /**
         * A property for bucket-level advanced cost optimization metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-advancedcostoptimizationmetrics
         */
        readonly advancedCostOptimizationMetrics?: CfnStorageLens.AdvancedCostOptimizationMetricsProperty | cdk.IResolvable;
        /**
         * A property for bucket-level advanced data protection metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-advanceddataprotectionmetrics
         */
        readonly advancedDataProtectionMetrics?: CfnStorageLens.AdvancedDataProtectionMetricsProperty | cdk.IResolvable;
        /**
         * A property for bucket-level detailed status code metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-detailedstatuscodesmetrics
         */
        readonly detailedStatusCodesMetrics?: CfnStorageLens.DetailedStatusCodesMetricsProperty | cdk.IResolvable;
        /**
         * A property for bucket-level prefix-level storage metrics for S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-prefixlevel
         */
        readonly prefixLevel?: CfnStorageLens.PrefixLevelProperty | cdk.IResolvable;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource contains the details of the buckets and Regions for the Amazon S3 Storage Lens configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketsandregions.html
     */
    interface BucketsAndRegionsProperty {
        /**
         * This property contains the details of the buckets for the Amazon S3 Storage Lens configuration. This should be the bucket Amazon Resource Name(ARN). For valid values, see [Buckets ARN format here](https://docs.aws.amazon.com/AmazonS3/latest/API/API_control_Include.html#API_control_Include_Contents) in the *Amazon S3 API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketsandregions.html#cfn-s3-storagelens-bucketsandregions-buckets
         */
        readonly buckets?: string[];
        /**
         * This property contains the details of the Regions for the S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketsandregions.html#cfn-s3-storagelens-bucketsandregions-regions
         */
        readonly regions?: string[];
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource enables the Amazon CloudWatch publishing option for Amazon S3 Storage Lens metrics.
     *
     * For more information, see [Monitor S3 Storage Lens metrics in CloudWatch](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_view_metrics_cloudwatch.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-cloudwatchmetrics.html
     */
    interface CloudWatchMetricsProperty {
        /**
         * This property identifies whether the CloudWatch publishing option for S3 Storage Lens is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-cloudwatchmetrics.html#cfn-s3-storagelens-cloudwatchmetrics-isenabled
         */
        readonly isEnabled: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource contains the details of the Amazon S3 Storage Lens metrics export.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-dataexport.html
     */
    interface DataExportProperty {
        /**
         * This property enables the Amazon CloudWatch publishing option for S3 Storage Lens metrics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-dataexport.html#cfn-s3-storagelens-dataexport-cloudwatchmetrics
         */
        readonly cloudWatchMetrics?: CfnStorageLens.CloudWatchMetricsProperty | cdk.IResolvable;
        /**
         * This property contains the details of the bucket where the S3 Storage Lens metrics export will be placed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-dataexport.html#cfn-s3-storagelens-dataexport-s3bucketdestination
         */
        readonly s3BucketDestination?: CfnStorageLens.S3BucketDestinationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource enables Amazon S3 Storage Lens detailed status code metrics. Detailed status code metrics generate metrics for HTTP status codes, such as `200 OK` , `403 Forbidden` , `503 Service Unavailable` and others.
     *
     * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-detailedstatuscodesmetrics.html
     */
    interface DetailedStatusCodesMetricsProperty {
        /**
         * Indicates whether detailed status code metrics are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-detailedstatuscodesmetrics.html#cfn-s3-storagelens-detailedstatuscodesmetrics-isenabled
         */
        readonly isEnabled?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource contains the type of server-side encryption used to encrypt an Amazon S3 Storage Lens metrics export. For valid values, see the [StorageLensDataExportEncryption](https://docs.aws.amazon.com/AmazonS3/latest/API/API_control_StorageLensDataExportEncryption.html) in the *Amazon S3 API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-encryption.html
     */
    interface EncryptionProperty {
        /**
         * Specifies the use of AWS Key Management Service keys (SSE-KMS) to encrypt the S3 Storage Lens metrics export file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-encryption.html#cfn-s3-storagelens-encryption-ssekms
         */
        readonly ssekms?: CfnStorageLens.SSEKMSProperty | cdk.IResolvable;
        /**
         * Specifies the use of an Amazon S3-managed key (SSE-S3) to encrypt the S3 Storage Lens metrics export file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-encryption.html#cfn-s3-storagelens-encryption-sses3
         */
        readonly sses3?: any | cdk.IResolvable;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource contains the details of the prefix-level of the Amazon S3 Storage Lens.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevel.html
     */
    interface PrefixLevelProperty {
        /**
         * A property for the prefix-level storage metrics for Amazon S3 Storage Lens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevel.html#cfn-s3-storagelens-prefixlevel-storagemetrics
         */
        readonly storageMetrics: CfnStorageLens.PrefixLevelStorageMetricsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource contains the details of the prefix-level storage metrics for Amazon S3 Storage Lens.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevelstoragemetrics.html
     */
    interface PrefixLevelStorageMetricsProperty {
        /**
         * This property identifies whether the details of the prefix-level storage metrics for S3 Storage Lens are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevelstoragemetrics.html#cfn-s3-storagelens-prefixlevelstoragemetrics-isenabled
         */
        readonly isEnabled?: boolean | cdk.IResolvable;
        /**
         * This property identifies whether the details of the prefix-level storage metrics for S3 Storage Lens are enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevelstoragemetrics.html#cfn-s3-storagelens-prefixlevelstoragemetrics-selectioncriteria
         */
        readonly selectionCriteria?: CfnStorageLens.SelectionCriteriaProperty | cdk.IResolvable;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource contains the details of the bucket where the Amazon S3 Storage Lens metrics export will be placed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html
     */
    interface S3BucketDestinationProperty {
        /**
         * This property contains the details of the AWS account ID of the S3 Storage Lens export bucket destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-accountid
         */
        readonly accountId: string;
        /**
         * This property contains the details of the ARN of the bucket destination of the S3 Storage Lens export.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-arn
         */
        readonly arn: string;
        /**
         * This property contains the details of the encryption of the bucket destination of the Amazon S3 Storage Lens metrics export.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-encryption
         */
        readonly encryption?: CfnStorageLens.EncryptionProperty | cdk.IResolvable;
        /**
         * This property contains the details of the format of the S3 Storage Lens export bucket destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-format
         */
        readonly format: string;
        /**
         * This property contains the details of the output schema version of the S3 Storage Lens export bucket destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-outputschemaversion
         */
        readonly outputSchemaVersion: string;
        /**
         * This property contains the details of the prefix of the bucket destination of the S3 Storage Lens export .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-prefix
         */
        readonly prefix?: string;
    }
}
export declare namespace CfnStorageLens {
    /**
     * Specifies the use of server-side encryption using an AWS Key Management Service key (SSE-KMS) to encrypt the delivered S3 Storage Lens metrics export file.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-ssekms.html
     */
    interface SSEKMSProperty {
        /**
         * Specifies the Amazon Resource Name (ARN) of the customer managed AWS KMS key to use for encrypting the S3 Storage Lens metrics export file. Amazon S3 only supports symmetric encryption keys. For more information, see [Special-purpose keys](https://docs.aws.amazon.com/kms/latest/developerguide/key-types.html) in the *AWS Key Management Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-ssekms.html#cfn-s3-storagelens-ssekms-keyid
         */
        readonly keyId: string;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This resource contains the details of the Amazon S3 Storage Lens selection criteria.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html
     */
    interface SelectionCriteriaProperty {
        /**
         * This property contains the details of the S3 Storage Lens delimiter being used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html#cfn-s3-storagelens-selectioncriteria-delimiter
         */
        readonly delimiter?: string;
        /**
         * This property contains the details of the max depth that S3 Storage Lens will collect metrics up to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html#cfn-s3-storagelens-selectioncriteria-maxdepth
         */
        readonly maxDepth?: number;
        /**
         * This property contains the details of the minimum storage bytes percentage threshold that S3 Storage Lens will collect metrics up to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html#cfn-s3-storagelens-selectioncriteria-minstoragebytespercentage
         */
        readonly minStorageBytesPercentage?: number;
    }
}
export declare namespace CfnStorageLens {
    /**
     * This is the property of the Amazon S3 Storage Lens configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html
     */
    interface StorageLensConfigurationProperty {
        /**
         * This property contains the details of the account-level metrics for Amazon S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-accountlevel
         */
        readonly accountLevel: CfnStorageLens.AccountLevelProperty | cdk.IResolvable;
        /**
         * This property contains the details of the AWS Organization for the S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-awsorg
         */
        readonly awsOrg?: CfnStorageLens.AwsOrgProperty | cdk.IResolvable;
        /**
         * This property contains the details of this S3 Storage Lens configuration's metrics export.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-dataexport
         */
        readonly dataExport?: CfnStorageLens.DataExportProperty | cdk.IResolvable;
        /**
         * This property contains the details of the bucket and or Regions excluded for Amazon S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-exclude
         */
        readonly exclude?: CfnStorageLens.BucketsAndRegionsProperty | cdk.IResolvable;
        /**
         * This property contains the details of the ID of the S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-id
         */
        readonly id: string;
        /**
         * This property contains the details of the bucket and or Regions included for Amazon S3 Storage Lens configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-include
         */
        readonly include?: CfnStorageLens.BucketsAndRegionsProperty | cdk.IResolvable;
        /**
         * This property contains the details of whether the Amazon S3 Storage Lens configuration is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-isenabled
         */
        readonly isEnabled: boolean | cdk.IResolvable;
        /**
         * This property contains the details of the ARN of the S3 Storage Lens configuration. This property is read-only.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-storagelensarn
         */
        readonly storageLensArn?: string;
    }
}
