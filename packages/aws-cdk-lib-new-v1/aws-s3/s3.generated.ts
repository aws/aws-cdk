/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::S3::AccessPoint resource is an Amazon S3 resource type that you can use to access buckets.
 *
 * @cloudformationResource AWS::S3::AccessPoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html
 */
export class CfnAccessPoint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3::AccessPoint";

  /**
   * Build a CfnAccessPoint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessPoint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccessPointPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccessPoint(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The alias for this access point.
   *
   * @cloudformationAttribute Alias
   */
  public readonly attrAlias: string;

  /**
   * This property contains the details of the ARN for the access point.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of this access point.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * Indicates whether this access point allows access from the internet. If `VpcConfiguration` is specified for this access point, then `NetworkOrigin` is `VPC` , and the access point doesn't allow access from the internet. Otherwise, `NetworkOrigin` is `Internet` , and the access point allows access from the internet, subject to the access point and bucket access policies.
   *
   * *Allowed values* : `VPC` | `Internet`
   *
   * @cloudformationAttribute NetworkOrigin
   */
  public readonly attrNetworkOrigin: string;

  /**
   * The name of the bucket associated with this access point.
   */
  public bucket: string;

  /**
   * The AWS account ID associated with the S3 bucket associated with this access point.
   */
  public bucketAccountId?: string;

  /**
   * The name of this access point.
   */
  public name?: string;

  /**
   * The access point policy associated with this access point.
   */
  public policy?: any | cdk.IResolvable;

  /**
   * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket.
   */
  public publicAccessBlockConfiguration?: cdk.IResolvable | CfnAccessPoint.PublicAccessBlockConfigurationProperty;

  /**
   * The Virtual Private Cloud (VPC) configuration for this access point, if one exists.
   */
  public vpcConfiguration?: cdk.IResolvable | CfnAccessPoint.VpcConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessPointProps) {
    super(scope, id, {
      "type": CfnAccessPoint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "bucket", this);

    this.attrAlias = cdk.Token.asString(this.getAtt("Alias", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.attrNetworkOrigin = cdk.Token.asString(this.getAtt("NetworkOrigin", cdk.ResolutionTypeHint.STRING));
    this.bucket = props.bucket;
    this.bucketAccountId = props.bucketAccountId;
    this.name = props.name;
    this.policy = props.policy;
    this.publicAccessBlockConfiguration = props.publicAccessBlockConfiguration;
    this.vpcConfiguration = props.vpcConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bucket": this.bucket,
      "bucketAccountId": this.bucketAccountId,
      "name": this.name,
      "policy": this.policy,
      "publicAccessBlockConfiguration": this.publicAccessBlockConfiguration,
      "vpcConfiguration": this.vpcConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessPoint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessPointPropsToCloudFormation(props);
  }
}

export namespace CfnAccessPoint {
  /**
   * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket.
   *
   * You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html
   */
  export interface PublicAccessBlockConfigurationProperty {
    /**
     * Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket.
     *
     * Setting this element to `TRUE` causes the following behavior:
     *
     * - PUT Bucket ACL and PUT Object ACL calls fail if the specified ACL is public.
     * - PUT Object calls fail if the request includes a public ACL.
     * - PUT Bucket calls fail if the request includes a public ACL.
     *
     * Enabling this setting doesn't affect existing policies or ACLs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-blockpublicacls
     */
    readonly blockPublicAcls?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should block public bucket policies for this bucket.
     *
     * Setting this element to `TRUE` causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access.
     *
     * Enabling this setting doesn't affect existing bucket policies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-blockpublicpolicy
     */
    readonly blockPublicPolicy?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket.
     *
     * Setting this element to `TRUE` causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket.
     *
     * Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-ignorepublicacls
     */
    readonly ignorePublicAcls?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should restrict public bucket policies for this bucket.
     *
     * Setting this element to `TRUE` restricts access to this bucket to only AWS service principals and authorized users within this account if the bucket has a public policy.
     *
     * Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-publicaccessblockconfiguration.html#cfn-s3-accesspoint-publicaccessblockconfiguration-restrictpublicbuckets
     */
    readonly restrictPublicBuckets?: boolean | cdk.IResolvable;
  }

  /**
   * The Virtual Private Cloud (VPC) configuration for this access point.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-vpcconfiguration.html
   */
  export interface VpcConfigurationProperty {
    /**
     * If this field is specified, the access point will only allow connections from the specified VPC ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accesspoint-vpcconfiguration.html#cfn-s3-accesspoint-vpcconfiguration-vpcid
     */
    readonly vpcId?: string;
  }
}

/**
 * Properties for defining a `CfnAccessPoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html
 */
export interface CfnAccessPointProps {
  /**
   * The name of the bucket associated with this access point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-bucket
   */
  readonly bucket: string;

  /**
   * The AWS account ID associated with the S3 bucket associated with this access point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-bucketaccountid
   */
  readonly bucketAccountId?: string;

  /**
   * The name of this access point.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the access point name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-name
   */
  readonly name?: string;

  /**
   * The access point policy associated with this access point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-policy
   */
  readonly policy?: any | cdk.IResolvable;

  /**
   * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket.
   *
   * You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-publicaccessblockconfiguration
   */
  readonly publicAccessBlockConfiguration?: cdk.IResolvable | CfnAccessPoint.PublicAccessBlockConfigurationProperty;

  /**
   * The Virtual Private Cloud (VPC) configuration for this access point, if one exists.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accesspoint.html#cfn-s3-accesspoint-vpcconfiguration
   */
  readonly vpcConfiguration?: cdk.IResolvable | CfnAccessPoint.VpcConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `PublicAccessBlockConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PublicAccessBlockConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointPublicAccessBlockConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("blockPublicAcls", cdk.validateBoolean)(properties.blockPublicAcls));
  errors.collect(cdk.propertyValidator("blockPublicPolicy", cdk.validateBoolean)(properties.blockPublicPolicy));
  errors.collect(cdk.propertyValidator("ignorePublicAcls", cdk.validateBoolean)(properties.ignorePublicAcls));
  errors.collect(cdk.propertyValidator("restrictPublicBuckets", cdk.validateBoolean)(properties.restrictPublicBuckets));
  return errors.wrap("supplied properties not correct for \"PublicAccessBlockConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointPublicAccessBlockConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointPublicAccessBlockConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BlockPublicAcls": cdk.booleanToCloudFormation(properties.blockPublicAcls),
    "BlockPublicPolicy": cdk.booleanToCloudFormation(properties.blockPublicPolicy),
    "IgnorePublicAcls": cdk.booleanToCloudFormation(properties.ignorePublicAcls),
    "RestrictPublicBuckets": cdk.booleanToCloudFormation(properties.restrictPublicBuckets)
  };
}

// @ts-ignore TS6133
function CfnAccessPointPublicAccessBlockConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAccessPoint.PublicAccessBlockConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.PublicAccessBlockConfigurationProperty>();
  ret.addPropertyResult("blockPublicAcls", "BlockPublicAcls", (properties.BlockPublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicAcls) : undefined));
  ret.addPropertyResult("blockPublicPolicy", "BlockPublicPolicy", (properties.BlockPublicPolicy != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicPolicy) : undefined));
  ret.addPropertyResult("ignorePublicAcls", "IgnorePublicAcls", (properties.IgnorePublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IgnorePublicAcls) : undefined));
  ret.addPropertyResult("restrictPublicBuckets", "RestrictPublicBuckets", (properties.RestrictPublicBuckets != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RestrictPublicBuckets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"VpcConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointVpcConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointVpcConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnAccessPointVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAccessPoint.VpcConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.VpcConfigurationProperty>();
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAccessPointProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessPointProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucketAccountId", cdk.validateString)(properties.bucketAccountId));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  errors.collect(cdk.propertyValidator("publicAccessBlockConfiguration", CfnAccessPointPublicAccessBlockConfigurationPropertyValidator)(properties.publicAccessBlockConfiguration));
  errors.collect(cdk.propertyValidator("vpcConfiguration", CfnAccessPointVpcConfigurationPropertyValidator)(properties.vpcConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnAccessPointProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointPropsValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "BucketAccountId": cdk.stringToCloudFormation(properties.bucketAccountId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Policy": cdk.objectToCloudFormation(properties.policy),
    "PublicAccessBlockConfiguration": convertCfnAccessPointPublicAccessBlockConfigurationPropertyToCloudFormation(properties.publicAccessBlockConfiguration),
    "VpcConfiguration": convertCfnAccessPointVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnAccessPointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPointProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPointProps>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("bucketAccountId", "BucketAccountId", (properties.BucketAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.BucketAccountId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addPropertyResult("publicAccessBlockConfiguration", "PublicAccessBlockConfiguration", (properties.PublicAccessBlockConfiguration != null ? CfnAccessPointPublicAccessBlockConfigurationPropertyFromCloudFormation(properties.PublicAccessBlockConfiguration) : undefined));
  ret.addPropertyResult("vpcConfiguration", "VpcConfiguration", (properties.VpcConfiguration != null ? CfnAccessPointVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::S3::Bucket` resource creates an Amazon S3 bucket in the same AWS Region where you create the AWS CloudFormation stack.
 *
 * To control how AWS CloudFormation handles the bucket when the stack is deleted, you can set a deletion policy for your bucket. You can choose to *retain* the bucket or to *delete* the bucket. For more information, see [DeletionPolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) .
 *
 * > You can only delete empty buckets. Deletion fails for buckets that have contents.
 *
 * @cloudformationResource AWS::S3::Bucket
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html
 */
export class CfnBucket extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3::Bucket";

  /**
   * Build a CfnBucket from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBucket {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBucketPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBucket(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the specified bucket.
   *
   * Example: `arn:aws:s3:::DOC-EXAMPLE-BUCKET`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the IPv4 DNS name of the specified bucket.
   *
   * Example: `DOC-EXAMPLE-BUCKET.s3.amazonaws.com`
   *
   * @cloudformationAttribute DomainName
   */
  public readonly attrDomainName: string;

  /**
   * Returns the IPv6 DNS name of the specified bucket.
   *
   * Example: `DOC-EXAMPLE-BUCKET.s3.dualstack.us-east-2.amazonaws.com`
   *
   * For more information about dual-stack endpoints, see [Using Amazon S3 Dual-Stack Endpoints](https://docs.aws.amazon.com/AmazonS3/latest/dev/dual-stack-endpoints.html) .
   *
   * @cloudformationAttribute DualStackDomainName
   */
  public readonly attrDualStackDomainName: string;

  /**
   * Returns the regional domain name of the specified bucket.
   *
   * Example: `DOC-EXAMPLE-BUCKET.s3.us-east-2.amazonaws.com`
   *
   * @cloudformationAttribute RegionalDomainName
   */
  public readonly attrRegionalDomainName: string;

  /**
   * Returns the Amazon S3 website endpoint for the specified bucket.
   *
   * Example (IPv4): `http://DOC-EXAMPLE-BUCKET.s3-website.us-east-2.amazonaws.com`
   *
   * Example (IPv6): `http://DOC-EXAMPLE-BUCKET.s3.dualstack.us-east-2.amazonaws.com`
   *
   * @cloudformationAttribute WebsiteURL
   */
  public readonly attrWebsiteUrl: string;

  /**
   * Configures the transfer acceleration state for an Amazon S3 bucket.
   */
  public accelerateConfiguration?: CfnBucket.AccelerateConfigurationProperty | cdk.IResolvable;

  /**
   * > This is a legacy property, and it is not recommended for most use cases.
   */
  public accessControl?: string;

  /**
   * Specifies the configuration and any analyses for the analytics filter of an Amazon S3 bucket.
   */
  public analyticsConfigurations?: Array<CfnBucket.AnalyticsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies default encryption for a bucket using server-side encryption with Amazon S3-managed keys (SSE-S3), AWS KMS-managed keys (SSE-KMS), or dual-layer server-side encryption with KMS-managed keys (DSSE-KMS).
   */
  public bucketEncryption?: CfnBucket.BucketEncryptionProperty | cdk.IResolvable;

  /**
   * A name for the bucket.
   */
  public bucketName?: string;

  /**
   * Describes the cross-origin access configuration for objects in an Amazon S3 bucket.
   */
  public corsConfiguration?: CfnBucket.CorsConfigurationProperty | cdk.IResolvable;

  /**
   * Defines how Amazon S3 handles Intelligent-Tiering storage.
   */
  public intelligentTieringConfigurations?: Array<CfnBucket.IntelligentTieringConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies the inventory configuration for an Amazon S3 bucket.
   */
  public inventoryConfigurations?: Array<CfnBucket.InventoryConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies the lifecycle configuration for objects in an Amazon S3 bucket.
   */
  public lifecycleConfiguration?: cdk.IResolvable | CfnBucket.LifecycleConfigurationProperty;

  /**
   * Settings that define where logs are stored.
   */
  public loggingConfiguration?: cdk.IResolvable | CfnBucket.LoggingConfigurationProperty;

  /**
   * Specifies a metrics configuration for the CloudWatch request metrics (specified by the metrics configuration ID) from an Amazon S3 bucket.
   */
  public metricsConfigurations?: Array<cdk.IResolvable | CfnBucket.MetricsConfigurationProperty> | cdk.IResolvable;

  /**
   * Configuration that defines how Amazon S3 handles bucket notifications.
   */
  public notificationConfiguration?: cdk.IResolvable | CfnBucket.NotificationConfigurationProperty;

  /**
   * > This operation is not supported by directory buckets.
   */
  public objectLockConfiguration?: cdk.IResolvable | CfnBucket.ObjectLockConfigurationProperty;

  /**
   * Indicates whether this bucket has an Object Lock configuration enabled.
   */
  public objectLockEnabled?: boolean | cdk.IResolvable;

  /**
   * Configuration that defines how Amazon S3 handles Object Ownership rules.
   */
  public ownershipControls?: cdk.IResolvable | CfnBucket.OwnershipControlsProperty;

  /**
   * Configuration that defines how Amazon S3 handles public access.
   */
  public publicAccessBlockConfiguration?: cdk.IResolvable | CfnBucket.PublicAccessBlockConfigurationProperty;

  /**
   * Configuration for replicating objects in an S3 bucket.
   */
  public replicationConfiguration?: cdk.IResolvable | CfnBucket.ReplicationConfigurationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An arbitrary set of tags (key-value pairs) for this S3 bucket.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Enables multiple versions of all objects in this bucket.
   */
  public versioningConfiguration?: cdk.IResolvable | CfnBucket.VersioningConfigurationProperty;

  /**
   * Information used to configure the bucket as a static website.
   */
  public websiteConfiguration?: cdk.IResolvable | CfnBucket.WebsiteConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBucketProps = {}) {
    super(scope, id, {
      "type": CfnBucket.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDomainName = cdk.Token.asString(this.getAtt("DomainName", cdk.ResolutionTypeHint.STRING));
    this.attrDualStackDomainName = cdk.Token.asString(this.getAtt("DualStackDomainName", cdk.ResolutionTypeHint.STRING));
    this.attrRegionalDomainName = cdk.Token.asString(this.getAtt("RegionalDomainName", cdk.ResolutionTypeHint.STRING));
    this.attrWebsiteUrl = cdk.Token.asString(this.getAtt("WebsiteURL", cdk.ResolutionTypeHint.STRING));
    this.accelerateConfiguration = props.accelerateConfiguration;
    this.accessControl = props.accessControl;
    this.analyticsConfigurations = props.analyticsConfigurations;
    this.bucketEncryption = props.bucketEncryption;
    this.bucketName = props.bucketName;
    this.corsConfiguration = props.corsConfiguration;
    this.intelligentTieringConfigurations = props.intelligentTieringConfigurations;
    this.inventoryConfigurations = props.inventoryConfigurations;
    this.lifecycleConfiguration = props.lifecycleConfiguration;
    this.loggingConfiguration = props.loggingConfiguration;
    this.metricsConfigurations = props.metricsConfigurations;
    this.notificationConfiguration = props.notificationConfiguration;
    this.objectLockConfiguration = props.objectLockConfiguration;
    this.objectLockEnabled = props.objectLockEnabled;
    this.ownershipControls = props.ownershipControls;
    this.publicAccessBlockConfiguration = props.publicAccessBlockConfiguration;
    this.replicationConfiguration = props.replicationConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::S3::Bucket", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.versioningConfiguration = props.versioningConfiguration;
    this.websiteConfiguration = props.websiteConfiguration;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::S3::Bucket' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accelerateConfiguration": this.accelerateConfiguration,
      "accessControl": this.accessControl,
      "analyticsConfigurations": this.analyticsConfigurations,
      "bucketEncryption": this.bucketEncryption,
      "bucketName": this.bucketName,
      "corsConfiguration": this.corsConfiguration,
      "intelligentTieringConfigurations": this.intelligentTieringConfigurations,
      "inventoryConfigurations": this.inventoryConfigurations,
      "lifecycleConfiguration": this.lifecycleConfiguration,
      "loggingConfiguration": this.loggingConfiguration,
      "metricsConfigurations": this.metricsConfigurations,
      "notificationConfiguration": this.notificationConfiguration,
      "objectLockConfiguration": this.objectLockConfiguration,
      "objectLockEnabled": this.objectLockEnabled,
      "ownershipControls": this.ownershipControls,
      "publicAccessBlockConfiguration": this.publicAccessBlockConfiguration,
      "replicationConfiguration": this.replicationConfiguration,
      "tags": this.tags.renderTags(),
      "versioningConfiguration": this.versioningConfiguration,
      "websiteConfiguration": this.websiteConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBucket.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBucketPropsToCloudFormation(props);
  }
}

export namespace CfnBucket {
  /**
   * Configures the transfer acceleration state for an Amazon S3 bucket.
   *
   * For more information, see [Amazon S3 Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accelerateconfiguration.html
   */
  export interface AccelerateConfigurationProperty {
    /**
     * Specifies the transfer acceleration status of the bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accelerateconfiguration.html#cfn-s3-bucket-accelerateconfiguration-accelerationstatus
     */
    readonly accelerationStatus: string;
  }

  /**
   * Specifies the configuration and any analyses for the analytics filter of an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html
   */
  export interface AnalyticsConfigurationProperty {
    /**
     * The ID that identifies the analytics configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-id
     */
    readonly id: string;

    /**
     * The prefix that an object must have to be included in the analytics results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-prefix
     */
    readonly prefix?: string;

    /**
     * Contains data related to access patterns to be collected and made available to analyze the tradeoffs between different storage classes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-storageclassanalysis
     */
    readonly storageClassAnalysis: cdk.IResolvable | CfnBucket.StorageClassAnalysisProperty;

    /**
     * The tags to use when evaluating an analytics filter.
     *
     * The analytics only includes objects that meet the filter's criteria. If no filter is specified, all of the contents of the bucket are included in the analysis.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-analyticsconfiguration.html#cfn-s3-bucket-analyticsconfiguration-tagfilters
     */
    readonly tagFilters?: Array<cdk.IResolvable | CfnBucket.TagFilterProperty> | cdk.IResolvable;
  }

  /**
   * Specifies data related to access patterns to be collected and made available to analyze the tradeoffs between different storage classes for an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-storageclassanalysis.html
   */
  export interface StorageClassAnalysisProperty {
    /**
     * Specifies how data related to the storage class analysis for an Amazon S3 bucket should be exported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-storageclassanalysis.html#cfn-s3-bucket-storageclassanalysis-dataexport
     */
    readonly dataExport?: CfnBucket.DataExportProperty | cdk.IResolvable;
  }

  /**
   * Specifies how data related to the storage class analysis for an Amazon S3 bucket should be exported.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html
   */
  export interface DataExportProperty {
    /**
     * The place to store the data for an analysis.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html#cfn-s3-bucket-dataexport-destination
     */
    readonly destination: CfnBucket.DestinationProperty | cdk.IResolvable;

    /**
     * The version of the output schema to use when exporting data.
     *
     * Must be `V_1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-dataexport.html#cfn-s3-bucket-dataexport-outputschemaversion
     */
    readonly outputSchemaVersion: string;
  }

  /**
   * Specifies information about where to publish analysis or configuration results for an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html
   */
  export interface DestinationProperty {
    /**
     * The account ID that owns the destination S3 bucket.
     *
     * If no account ID is provided, the owner is not validated before exporting data.
     *
     * > Although this value is optional, we strongly recommend that you set it to help prevent problems if the destination bucket ownership changes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-bucketaccountid
     */
    readonly bucketAccountId?: string;

    /**
     * The Amazon Resource Name (ARN) of the bucket to which data is exported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-bucketarn
     */
    readonly bucketArn: string;

    /**
     * Specifies the file format used when exporting data to Amazon S3.
     *
     * *Allowed values* : `CSV` | `ORC` | `Parquet`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-format
     */
    readonly format: string;

    /**
     * The prefix to use when exporting data.
     *
     * The prefix is prepended to all results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-destination.html#cfn-s3-bucket-destination-prefix
     */
    readonly prefix?: string;
  }

  /**
   * Specifies tags to use to identify a subset of objects for an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tagfilter.html
   */
  export interface TagFilterProperty {
    /**
     * The tag key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tagfilter.html#cfn-s3-bucket-tagfilter-key
     */
    readonly key: string;

    /**
     * The tag value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tagfilter.html#cfn-s3-bucket-tagfilter-value
     */
    readonly value: string;
  }

  /**
   * Specifies default encryption for a bucket using server-side encryption with Amazon S3-managed keys (SSE-S3), AWS KMS-managed keys (SSE-KMS), or dual-layer server-side encryption with KMS-managed keys (DSSE-KMS).
   *
   * For information about the Amazon S3 default encryption feature, see [Amazon S3 Default Encryption for S3 Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-bucketencryption.html
   */
  export interface BucketEncryptionProperty {
    /**
     * Specifies the default server-side-encryption configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-bucketencryption.html#cfn-s3-bucket-bucketencryption-serversideencryptionconfiguration
     */
    readonly serverSideEncryptionConfiguration: Array<cdk.IResolvable | CfnBucket.ServerSideEncryptionRuleProperty> | cdk.IResolvable;
  }

  /**
   * Specifies the default server-side encryption configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html
   */
  export interface ServerSideEncryptionRuleProperty {
    /**
     * Specifies whether Amazon S3 should use an S3 Bucket Key with server-side encryption using KMS (SSE-KMS) for new objects in the bucket.
     *
     * Existing objects are not affected. Setting the `BucketKeyEnabled` element to `true` causes Amazon S3 to use an S3 Bucket Key. By default, S3 Bucket Key is not enabled.
     *
     * For more information, see [Amazon S3 Bucket Keys](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-key.html) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html#cfn-s3-bucket-serversideencryptionrule-bucketkeyenabled
     */
    readonly bucketKeyEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies the default server-side encryption to apply to new objects in the bucket.
     *
     * If a PUT Object request doesn't specify any server-side encryption, this default encryption will be applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionrule.html#cfn-s3-bucket-serversideencryptionrule-serversideencryptionbydefault
     */
    readonly serverSideEncryptionByDefault?: cdk.IResolvable | CfnBucket.ServerSideEncryptionByDefaultProperty;
  }

  /**
   * Describes the default server-side encryption to apply to new objects in the bucket.
   *
   * If a PUT Object request doesn't specify any server-side encryption, this default encryption will be applied. If you don't specify a customer managed key at configuration, Amazon S3 automatically creates an AWS KMS key in your AWS account the first time that you add an object encrypted with SSE-KMS to a bucket. By default, Amazon S3 uses this KMS key for SSE-KMS. For more information, see [PUT Bucket encryption](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTencryption.html) in the *Amazon S3 API Reference* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html
   */
  export interface ServerSideEncryptionByDefaultProperty {
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html#cfn-s3-bucket-serversideencryptionbydefault-kmsmasterkeyid
     */
    readonly kmsMasterKeyId?: string;

    /**
     * Server-side encryption algorithm to use for the default encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html#cfn-s3-bucket-serversideencryptionbydefault-ssealgorithm
     */
    readonly sseAlgorithm: string;
  }

  /**
   * Describes the cross-origin access configuration for objects in an Amazon S3 bucket.
   *
   * For more information, see [Enabling Cross-Origin Resource Sharing](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-corsconfiguration.html
   */
  export interface CorsConfigurationProperty {
    /**
     * A set of origins and methods (cross-origin access that you want to allow).
     *
     * You can add up to 100 rules to the configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-corsconfiguration.html#cfn-s3-bucket-corsconfiguration-corsrules
     */
    readonly corsRules: Array<CfnBucket.CorsRuleProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Specifies a cross-origin access rule for an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-corsrule.html
   */
  export interface CorsRuleProperty {
    /**
     * Headers that are specified in the `Access-Control-Request-Headers` header.
     *
     * These headers are allowed in a preflight OPTIONS request. In response to any preflight OPTIONS request, Amazon S3 returns any requested headers that are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-corsrule.html#cfn-s3-bucket-corsrule-allowedheaders
     */
    readonly allowedHeaders?: Array<string>;

    /**
     * An HTTP method that you allow the origin to run.
     *
     * *Allowed values* : `GET` | `PUT` | `HEAD` | `POST` | `DELETE`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-corsrule.html#cfn-s3-bucket-corsrule-allowedmethods
     */
    readonly allowedMethods: Array<string>;

    /**
     * One or more origins you want customers to be able to access the bucket from.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-corsrule.html#cfn-s3-bucket-corsrule-allowedorigins
     */
    readonly allowedOrigins: Array<string>;

    /**
     * One or more headers in the response that you want customers to be able to access from their applications (for example, from a JavaScript `XMLHttpRequest` object).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-corsrule.html#cfn-s3-bucket-corsrule-exposedheaders
     */
    readonly exposedHeaders?: Array<string>;

    /**
     * A unique identifier for this rule.
     *
     * The value must be no more than 255 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-corsrule.html#cfn-s3-bucket-corsrule-id
     */
    readonly id?: string;

    /**
     * The time in seconds that your browser is to cache the preflight response for the specified resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-corsrule.html#cfn-s3-bucket-corsrule-maxage
     */
    readonly maxAge?: number;
  }

  /**
   * Specifies the S3 Intelligent-Tiering configuration for an Amazon S3 bucket.
   *
   * For information about the S3 Intelligent-Tiering storage class, see [Storage class for automatically optimizing frequently and infrequently accessed objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-class-intro.html#sc-dynamic-data-access) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html
   */
  export interface IntelligentTieringConfigurationProperty {
    /**
     * The ID used to identify the S3 Intelligent-Tiering configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-id
     */
    readonly id: string;

    /**
     * An object key name prefix that identifies the subset of objects to which the rule applies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-prefix
     */
    readonly prefix?: string;

    /**
     * Specifies the status of the configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-status
     */
    readonly status: string;

    /**
     * A container for a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-tagfilters
     */
    readonly tagFilters?: Array<cdk.IResolvable | CfnBucket.TagFilterProperty> | cdk.IResolvable;

    /**
     * Specifies a list of S3 Intelligent-Tiering storage class tiers in the configuration.
     *
     * At least one tier must be defined in the list. At most, you can specify two tiers in the list, one for each available AccessTier: `ARCHIVE_ACCESS` and `DEEP_ARCHIVE_ACCESS` .
     *
     * > You only need Intelligent Tiering Configuration enabled on a bucket if you want to automatically move objects stored in the Intelligent-Tiering storage class to Archive Access or Deep Archive Access tiers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-intelligenttieringconfiguration.html#cfn-s3-bucket-intelligenttieringconfiguration-tierings
     */
    readonly tierings: Array<cdk.IResolvable | CfnBucket.TieringProperty> | cdk.IResolvable;
  }

  /**
   * The S3 Intelligent-Tiering storage class is designed to optimize storage costs by automatically moving data to the most cost-effective storage access tier, without additional operational overhead.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tiering.html
   */
  export interface TieringProperty {
    /**
     * S3 Intelligent-Tiering access tier.
     *
     * See [Storage class for automatically optimizing frequently and infrequently accessed objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-class-intro.html#sc-dynamic-data-access) for a list of access tiers in the S3 Intelligent-Tiering storage class.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tiering.html#cfn-s3-bucket-tiering-accesstier
     */
    readonly accessTier: string;

    /**
     * The number of consecutive days of no access after which an object will be eligible to be transitioned to the corresponding tier.
     *
     * The minimum number of days specified for Archive Access tier must be at least 90 days and Deep Archive Access tier must be at least 180 days. The maximum can be up to 2 years (730 days).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-tiering.html#cfn-s3-bucket-tiering-days
     */
    readonly days: number;
  }

  /**
   * Specifies the inventory configuration for an Amazon S3 bucket.
   *
   * For more information, see [GET Bucket inventory](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketGETInventoryConfig.html) in the *Amazon S3 API Reference* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html
   */
  export interface InventoryConfigurationProperty {
    /**
     * Contains information about where to publish the inventory results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-destination
     */
    readonly destination: CfnBucket.DestinationProperty | cdk.IResolvable;

    /**
     * Specifies whether the inventory is enabled or disabled.
     *
     * If set to `True` , an inventory list is generated. If set to `False` , no inventory list is generated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The ID used to identify the inventory configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-id
     */
    readonly id: string;

    /**
     * Object versions to include in the inventory list.
     *
     * If set to `All` , the list includes all the object versions, which adds the version-related fields `VersionId` , `IsLatest` , and `DeleteMarker` to the list. If set to `Current` , the list does not contain these version-related fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-includedobjectversions
     */
    readonly includedObjectVersions: string;

    /**
     * Contains the optional fields that are included in the inventory results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-optionalfields
     */
    readonly optionalFields?: Array<string>;

    /**
     * Specifies the inventory filter prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-prefix
     */
    readonly prefix?: string;

    /**
     * Specifies the schedule for generating inventory results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-inventoryconfiguration.html#cfn-s3-bucket-inventoryconfiguration-schedulefrequency
     */
    readonly scheduleFrequency: string;
  }

  /**
   * Specifies the lifecycle configuration for objects in an Amazon S3 bucket.
   *
   * For more information, see [Object Lifecycle Management](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfiguration.html
   */
  export interface LifecycleConfigurationProperty {
    /**
     * A lifecycle rule for individual objects in an Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfiguration.html#cfn-s3-bucket-lifecycleconfiguration-rules
     */
    readonly rules: Array<cdk.IResolvable | CfnBucket.RuleProperty> | cdk.IResolvable;
  }

  /**
   * Specifies lifecycle rules for an Amazon S3 bucket.
   *
   * For more information, see [Put Bucket Lifecycle Configuration](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTlifecycle.html) in the *Amazon S3 API Reference* .
   *
   * You must specify at least one of the following properties: `AbortIncompleteMultipartUpload` , `ExpirationDate` , `ExpirationInDays` , `NoncurrentVersionExpirationInDays` , `NoncurrentVersionTransition` , `NoncurrentVersionTransitions` , `Transition` , or `Transitions` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html
   */
  export interface RuleProperty {
    /**
     * Specifies a lifecycle rule that stops incomplete multipart uploads to an Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-abortincompletemultipartupload
     */
    readonly abortIncompleteMultipartUpload?: CfnBucket.AbortIncompleteMultipartUploadProperty | cdk.IResolvable;

    /**
     * Indicates when objects are deleted from Amazon S3 and Amazon S3 Glacier.
     *
     * The date value must be in ISO 8601 format. The time is always midnight UTC. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-expirationdate
     */
    readonly expirationDate?: Date | cdk.IResolvable;

    /**
     * Indicates the number of days after creation when objects are deleted from Amazon S3 and Amazon S3 Glacier.
     *
     * If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-expirationindays
     */
    readonly expirationInDays?: number;

    /**
     * Indicates whether Amazon S3 will remove a delete marker without any noncurrent versions.
     *
     * If set to true, the delete marker will be removed if there are no noncurrent versions. This cannot be specified with `ExpirationInDays` , `ExpirationDate` , or `TagFilters` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-expiredobjectdeletemarker
     */
    readonly expiredObjectDeleteMarker?: boolean | cdk.IResolvable;

    /**
     * Unique identifier for the rule.
     *
     * The value can't be longer than 255 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-id
     */
    readonly id?: string;

    /**
     * Specifies when noncurrent object versions expire.
     *
     * Upon expiration, Amazon S3 permanently deletes the noncurrent object versions. You set this lifecycle configuration action on a bucket that has versioning enabled (or suspended) to request that Amazon S3 delete noncurrent object versions at a specific period in the object's lifetime.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-noncurrentversionexpiration
     */
    readonly noncurrentVersionExpiration?: cdk.IResolvable | CfnBucket.NoncurrentVersionExpirationProperty;

    /**
     * (Deprecated.) For buckets with versioning enabled (or suspended), specifies the time, in days, between when a new version of the object is uploaded to the bucket and when old versions of the object expire. When object versions expire, Amazon S3 permanently deletes them. If you specify a transition and expiration time, the expiration time must be later than the transition time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-noncurrentversionexpirationindays
     */
    readonly noncurrentVersionExpirationInDays?: number;

    /**
     * (Deprecated.) For buckets with versioning enabled (or suspended), specifies when non-current objects transition to a specified storage class. If you specify a transition and expiration time, the expiration time must be later than the transition time. If you specify this property, don't specify the `NoncurrentVersionTransitions` property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-noncurrentversiontransition
     */
    readonly noncurrentVersionTransition?: cdk.IResolvable | CfnBucket.NoncurrentVersionTransitionProperty;

    /**
     * For buckets with versioning enabled (or suspended), one or more transition rules that specify when non-current objects transition to a specified storage class.
     *
     * If you specify a transition and expiration time, the expiration time must be later than the transition time. If you specify this property, don't specify the `NoncurrentVersionTransition` property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-noncurrentversiontransitions
     */
    readonly noncurrentVersionTransitions?: Array<cdk.IResolvable | CfnBucket.NoncurrentVersionTransitionProperty> | cdk.IResolvable;

    /**
     * Specifies the minimum object size in bytes for this rule to apply to.
     *
     * Objects must be larger than this value in bytes. For more information about size based rules, see [Lifecycle configuration using size-based rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html#lc-size-rules) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-objectsizegreaterthan
     */
    readonly objectSizeGreaterThan?: number;

    /**
     * Specifies the maximum object size in bytes for this rule to apply to.
     *
     * Objects must be smaller than this value in bytes. For more information about sized based rules, see [Lifecycle configuration using size-based rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html#lc-size-rules) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-objectsizelessthan
     */
    readonly objectSizeLessThan?: number;

    /**
     * Object key prefix that identifies one or more objects to which this rule applies.
     *
     * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-prefix
     */
    readonly prefix?: string;

    /**
     * If `Enabled` , the rule is currently being applied.
     *
     * If `Disabled` , the rule is not currently being applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-status
     */
    readonly status: string;

    /**
     * Tags to use to identify a subset of objects to which the lifecycle rule applies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-tagfilters
     */
    readonly tagFilters?: Array<cdk.IResolvable | CfnBucket.TagFilterProperty> | cdk.IResolvable;

    /**
     * (Deprecated.) Specifies when an object transitions to a specified storage class. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time. If you specify this property, don't specify the `Transitions` property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-transition
     */
    readonly transition?: cdk.IResolvable | CfnBucket.TransitionProperty;

    /**
     * One or more transition rules that specify when an object transitions to a specified storage class.
     *
     * If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time. If you specify this property, don't specify the `Transition` property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-rule.html#cfn-s3-bucket-rule-transitions
     */
    readonly transitions?: Array<cdk.IResolvable | CfnBucket.TransitionProperty> | cdk.IResolvable;
  }

  /**
   * Specifies the days since the initiation of an incomplete multipart upload that Amazon S3 will wait before permanently removing all parts of the upload.
   *
   * For more information, see [Stopping Incomplete Multipart Uploads Using a Bucket Lifecycle Policy](https://docs.aws.amazon.com/AmazonS3/latest/dev/mpuoverview.html#mpu-abort-incomplete-mpu-lifecycle-config) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-abortincompletemultipartupload.html
   */
  export interface AbortIncompleteMultipartUploadProperty {
    /**
     * Specifies the number of days after which Amazon S3 stops an incomplete multipart upload.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-abortincompletemultipartupload.html#cfn-s3-bucket-abortincompletemultipartupload-daysafterinitiation
     */
    readonly daysAfterInitiation: number;
  }

  /**
   * Specifies when noncurrent object versions expire.
   *
   * Upon expiration, Amazon S3 permanently deletes the noncurrent object versions. You set this lifecycle configuration action on a bucket that has versioning enabled (or suspended) to request that Amazon S3 delete noncurrent object versions at a specific period in the object's lifetime. For more information about setting a lifecycle rule configuration, see [AWS::S3::Bucket Rule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-noncurrentversionexpiration.html
   */
  export interface NoncurrentVersionExpirationProperty {
    /**
     * Specifies how many noncurrent versions Amazon S3 will retain.
     *
     * If there are this many more recent noncurrent versions, Amazon S3 will take the associated action. For more information about noncurrent versions, see [Lifecycle configuration elements](https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-noncurrentversionexpiration.html#cfn-s3-bucket-noncurrentversionexpiration-newernoncurrentversions
     */
    readonly newerNoncurrentVersions?: number;

    /**
     * Specifies the number of days an object is noncurrent before Amazon S3 can perform the associated action.
     *
     * For information about the noncurrent days calculations, see [How Amazon S3 Calculates When an Object Became Noncurrent](https://docs.aws.amazon.com/AmazonS3/latest/dev/intro-lifecycle-rules.html#non-current-days-calculations) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-noncurrentversionexpiration.html#cfn-s3-bucket-noncurrentversionexpiration-noncurrentdays
     */
    readonly noncurrentDays: number;
  }

  /**
   * Container for the transition rule that describes when noncurrent objects transition to the `STANDARD_IA` , `ONEZONE_IA` , `INTELLIGENT_TIERING` , `GLACIER_IR` , `GLACIER` , or `DEEP_ARCHIVE` storage class.
   *
   * If your bucket is versioning-enabled (or versioning is suspended), you can set this action to request that Amazon S3 transition noncurrent object versions to the `STANDARD_IA` , `ONEZONE_IA` , `INTELLIGENT_TIERING` , `GLACIER_IR` , `GLACIER` , or `DEEP_ARCHIVE` storage class at a specific period in the object's lifetime. If you specify this property, don't specify the `NoncurrentVersionTransitions` property.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-noncurrentversiontransition.html
   */
  export interface NoncurrentVersionTransitionProperty {
    /**
     * Specifies how many noncurrent versions Amazon S3 will retain.
     *
     * If there are this many more recent noncurrent versions, Amazon S3 will take the associated action. For more information about noncurrent versions, see [Lifecycle configuration elements](https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-noncurrentversiontransition.html#cfn-s3-bucket-noncurrentversiontransition-newernoncurrentversions
     */
    readonly newerNoncurrentVersions?: number;

    /**
     * The class of storage used to store the object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-noncurrentversiontransition.html#cfn-s3-bucket-noncurrentversiontransition-storageclass
     */
    readonly storageClass: string;

    /**
     * Specifies the number of days an object is noncurrent before Amazon S3 can perform the associated action.
     *
     * For information about the noncurrent days calculations, see [How Amazon S3 Calculates How Long an Object Has Been Noncurrent](https://docs.aws.amazon.com/AmazonS3/latest/dev/intro-lifecycle-rules.html#non-current-days-calculations) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-noncurrentversiontransition.html#cfn-s3-bucket-noncurrentversiontransition-transitionindays
     */
    readonly transitionInDays: number;
  }

  /**
   * Specifies when an object transitions to a specified storage class.
   *
   * For more information about Amazon S3 lifecycle configuration rules, see [Transitioning Objects Using Amazon S3 Lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/dev/lifecycle-transition-general-considerations.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-transition.html
   */
  export interface TransitionProperty {
    /**
     * The storage class to which you want the object to transition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-transition.html#cfn-s3-bucket-transition-storageclass
     */
    readonly storageClass: string;

    /**
     * Indicates when objects are transitioned to the specified storage class.
     *
     * The date value must be in ISO 8601 format. The time is always midnight UTC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-transition.html#cfn-s3-bucket-transition-transitiondate
     */
    readonly transitionDate?: Date | cdk.IResolvable;

    /**
     * Indicates the number of days after creation when objects are transitioned to the specified storage class.
     *
     * The value must be a positive integer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-transition.html#cfn-s3-bucket-transition-transitionindays
     */
    readonly transitionInDays?: number;
  }

  /**
   * Describes where logs are stored and the prefix that Amazon S3 assigns to all log object keys for a bucket.
   *
   * For examples and more information, see [PUT Bucket logging](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTlogging.html) in the *Amazon S3 API Reference* .
   *
   * > To successfully complete the `AWS::S3::Bucket LoggingConfiguration` request, you must have `s3:PutObject` and `s3:PutObjectAcl` in your IAM permissions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfiguration.html
   */
  export interface LoggingConfigurationProperty {
    /**
     * The name of the bucket where Amazon S3 should store server access log files.
     *
     * You can store log files in any bucket that you own. By default, logs are stored in the bucket where the `LoggingConfiguration` property is defined.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfiguration.html#cfn-s3-bucket-loggingconfiguration-destinationbucketname
     */
    readonly destinationBucketName?: string;

    /**
     * A prefix for all log object keys.
     *
     * If you store log files from multiple Amazon S3 buckets in a single bucket, you can use a prefix to distinguish which log files came from which bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfiguration.html#cfn-s3-bucket-loggingconfiguration-logfileprefix
     */
    readonly logFilePrefix?: string;

    /**
     * Amazon S3 key format for log objects.
     *
     * Only one format, PartitionedPrefix or SimplePrefix, is allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfiguration.html#cfn-s3-bucket-loggingconfiguration-targetobjectkeyformat
     */
    readonly targetObjectKeyFormat?: cdk.IResolvable | CfnBucket.TargetObjectKeyFormatProperty;
  }

  /**
   * Amazon S3 key format for log objects.
   *
   * Only one format, PartitionedPrefix or SimplePrefix, is allowed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-targetobjectkeyformat.html
   */
  export interface TargetObjectKeyFormatProperty {
    /**
     * Partitioned S3 key for log objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-targetobjectkeyformat.html#cfn-s3-bucket-targetobjectkeyformat-partitionedprefix
     */
    readonly partitionedPrefix?: cdk.IResolvable | CfnBucket.PartitionedPrefixProperty;

    /**
     * To use the simple format for S3 keys for log objects.
     *
     * To specify SimplePrefix format, set SimplePrefix to {}.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-targetobjectkeyformat.html#cfn-s3-bucket-targetobjectkeyformat-simpleprefix
     */
    readonly simplePrefix?: any | cdk.IResolvable;
  }

  /**
   * Amazon S3 keys for log objects are partitioned in the following format:.
   *
   * `[DestinationPrefix][SourceAccountId]/[SourceRegion]/[SourceBucket]/[YYYY]/[MM]/[DD]/[YYYY]-[MM]-[DD]-[hh]-[mm]-[ss]-[UniqueString]`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-partitionedprefix.html
   */
  export interface PartitionedPrefixProperty {
    /**
     * Specifies the partition date source for the partitioned prefix.
     *
     * PartitionDateSource can be EventTime or DeliveryTime.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-partitionedprefix.html#cfn-s3-bucket-partitionedprefix-partitiondatesource
     */
    readonly partitionDateSource?: string;
  }

  /**
   * Specifies a metrics configuration for the CloudWatch request metrics (specified by the metrics configuration ID) from an Amazon S3 bucket.
   *
   * If you're updating an existing metrics configuration, note that this is a full replacement of the existing metrics configuration. If you don't include the elements you want to keep, they are erased. For examples, see [AWS::S3::Bucket](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#aws-properties-s3-bucket--examples) . For more information, see [PUT Bucket metrics](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTMetricConfiguration.html) in the *Amazon S3 API Reference* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html
   */
  export interface MetricsConfigurationProperty {
    /**
     * The access point that was used while performing operations on the object.
     *
     * The metrics configuration only includes objects that meet the filter's criteria.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-accesspointarn
     */
    readonly accessPointArn?: string;

    /**
     * The ID used to identify the metrics configuration.
     *
     * This can be any value you choose that helps you identify your metrics configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-id
     */
    readonly id: string;

    /**
     * The prefix that an object must have to be included in the metrics results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-prefix
     */
    readonly prefix?: string;

    /**
     * Specifies a list of tag filters to use as a metrics configuration filter.
     *
     * The metrics configuration includes only objects that meet the filter's criteria.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html#cfn-s3-bucket-metricsconfiguration-tagfilters
     */
    readonly tagFilters?: Array<cdk.IResolvable | CfnBucket.TagFilterProperty> | cdk.IResolvable;
  }

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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration.html
   */
  export interface NotificationConfigurationProperty {
    /**
     * Enables delivery of events to Amazon EventBridge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration.html#cfn-s3-bucket-notificationconfiguration-eventbridgeconfiguration
     */
    readonly eventBridgeConfiguration?: CfnBucket.EventBridgeConfigurationProperty | cdk.IResolvable;

    /**
     * Describes the AWS Lambda functions to invoke and the events for which to invoke them.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration.html#cfn-s3-bucket-notificationconfiguration-lambdaconfigurations
     */
    readonly lambdaConfigurations?: Array<cdk.IResolvable | CfnBucket.LambdaConfigurationProperty> | cdk.IResolvable;

    /**
     * The Amazon Simple Queue Service queues to publish messages to and the events for which to publish messages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration.html#cfn-s3-bucket-notificationconfiguration-queueconfigurations
     */
    readonly queueConfigurations?: Array<cdk.IResolvable | CfnBucket.QueueConfigurationProperty> | cdk.IResolvable;

    /**
     * The topic to which notifications are sent and the events for which notifications are generated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration.html#cfn-s3-bucket-notificationconfiguration-topicconfigurations
     */
    readonly topicConfigurations?: Array<cdk.IResolvable | CfnBucket.TopicConfigurationProperty> | cdk.IResolvable;
  }

  /**
   * Amazon S3 can send events to Amazon EventBridge whenever certain events happen in your bucket, see [Using EventBridge](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventBridge.html) in the *Amazon S3 User Guide* .
   *
   * Unlike other destinations, delivery of events to EventBridge can be either enabled or disabled for a bucket. If enabled, all events will be sent to EventBridge and you can use EventBridge rules to route events to additional targets. For more information, see [What Is Amazon EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html) in the *Amazon EventBridge User Guide*
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-eventbridgeconfiguration.html
   */
  export interface EventBridgeConfigurationProperty {
    /**
     * Enables delivery of events to Amazon EventBridge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-eventbridgeconfiguration.html#cfn-s3-bucket-eventbridgeconfiguration-eventbridgeenabled
     */
    readonly eventBridgeEnabled: boolean | cdk.IResolvable;
  }

  /**
   * Describes the AWS Lambda functions to invoke and the events for which to invoke them.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lambdaconfiguration.html
   */
  export interface LambdaConfigurationProperty {
    /**
     * The Amazon S3 bucket event for which to invoke the AWS Lambda function.
     *
     * For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lambdaconfiguration.html#cfn-s3-bucket-lambdaconfiguration-event
     */
    readonly event: string;

    /**
     * The filtering rules that determine which objects invoke the AWS Lambda function.
     *
     * For example, you can create a filter so that only image files with a `.jpg` extension invoke the function when they are added to the Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lambdaconfiguration.html#cfn-s3-bucket-lambdaconfiguration-filter
     */
    readonly filter?: cdk.IResolvable | CfnBucket.NotificationFilterProperty;

    /**
     * The Amazon Resource Name (ARN) of the AWS Lambda function that Amazon S3 invokes when the specified event type occurs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lambdaconfiguration.html#cfn-s3-bucket-lambdaconfiguration-function
     */
    readonly function: string;
  }

  /**
   * Specifies object key name filtering rules.
   *
   * For information about key name filtering, see [Configuring event notifications using object key name filtering](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-filtering.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationfilter.html
   */
  export interface NotificationFilterProperty {
    /**
     * A container for object key name prefix and suffix filtering rules.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationfilter.html#cfn-s3-bucket-notificationfilter-s3key
     */
    readonly s3Key: cdk.IResolvable | CfnBucket.S3KeyFilterProperty;
  }

  /**
   * A container for object key name prefix and suffix filtering rules.
   *
   * For more information about object key name filtering, see [Configuring event notifications using object key name filtering](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-filtering.html) in the *Amazon S3 User Guide* .
   *
   * > The same type of filter rule cannot be used more than once. For example, you cannot specify two prefix rules.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-s3keyfilter.html
   */
  export interface S3KeyFilterProperty {
    /**
     * A list of containers for the key-value pair that defines the criteria for the filter rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-s3keyfilter.html#cfn-s3-bucket-s3keyfilter-rules
     */
    readonly rules: Array<CfnBucket.FilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Specifies the Amazon S3 object key name to filter on.
   *
   * An object key name is the name assigned to an object in your Amazon S3 bucket. You specify whether to filter on the suffix or prefix of the object key name. A prefix is a specific string of characters at the beginning of an object key name, which you can use to organize objects. For example, you can start the key names of related objects with a prefix, such as `2023-` or `engineering/` . Then, you can use `FilterRule` to find objects in a bucket with key names that have the same prefix. A suffix is similar to a prefix, but it is at the end of the object key name instead of at the beginning.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-filterrule.html
   */
  export interface FilterRuleProperty {
    /**
     * The object key name prefix or suffix identifying one or more objects to which the filtering rule applies.
     *
     * The maximum length is 1,024 characters. Overlapping prefixes and suffixes are not supported. For more information, see [Configuring Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-filterrule.html#cfn-s3-bucket-filterrule-name
     */
    readonly name: string;

    /**
     * The value that the filter searches for in object key names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-filterrule.html#cfn-s3-bucket-filterrule-value
     */
    readonly value: string;
  }

  /**
   * Specifies the configuration for publishing messages to an Amazon Simple Queue Service (Amazon SQS) queue when Amazon S3 detects specified events.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-queueconfiguration.html
   */
  export interface QueueConfigurationProperty {
    /**
     * The Amazon S3 bucket event about which you want to publish messages to Amazon SQS.
     *
     * For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-queueconfiguration.html#cfn-s3-bucket-queueconfiguration-event
     */
    readonly event: string;

    /**
     * The filtering rules that determine which objects trigger notifications.
     *
     * For example, you can create a filter so that Amazon S3 sends notifications only when image files with a `.jpg` extension are added to the bucket. For more information, see [Configuring event notifications using object key name filtering](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/notification-how-to-filtering.html) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-queueconfiguration.html#cfn-s3-bucket-queueconfiguration-filter
     */
    readonly filter?: cdk.IResolvable | CfnBucket.NotificationFilterProperty;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SQS queue to which Amazon S3 publishes a message when it detects events of the specified type.
     *
     * FIFO queues are not allowed when enabling an SQS queue as the event notification destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-queueconfiguration.html#cfn-s3-bucket-queueconfiguration-queue
     */
    readonly queue: string;
  }

  /**
   * A container for specifying the configuration for publication of messages to an Amazon Simple Notification Service (Amazon SNS) topic when Amazon S3 detects specified events.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-topicconfiguration.html
   */
  export interface TopicConfigurationProperty {
    /**
     * The Amazon S3 bucket event about which to send notifications.
     *
     * For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-topicconfiguration.html#cfn-s3-bucket-topicconfiguration-event
     */
    readonly event: string;

    /**
     * The filtering rules that determine for which objects to send notifications.
     *
     * For example, you can create a filter so that Amazon S3 sends notifications only when image files with a `.jpg` extension are added to the bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-topicconfiguration.html#cfn-s3-bucket-topicconfiguration-filter
     */
    readonly filter?: cdk.IResolvable | CfnBucket.NotificationFilterProperty;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to which Amazon S3 publishes a message when it detects events of the specified type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-topicconfiguration.html#cfn-s3-bucket-topicconfiguration-topic
     */
    readonly topic: string;
  }

  /**
   * Places an Object Lock configuration on the specified bucket.
   *
   * The rule specified in the Object Lock configuration will be applied by default to every new object placed in the specified bucket. For more information, see [Locking Objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lock.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockconfiguration.html
   */
  export interface ObjectLockConfigurationProperty {
    /**
     * Indicates whether this bucket has an Object Lock configuration enabled.
     *
     * Enable `ObjectLockEnabled` when you apply `ObjectLockConfiguration` to a bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockconfiguration.html#cfn-s3-bucket-objectlockconfiguration-objectlockenabled
     */
    readonly objectLockEnabled?: string;

    /**
     * Specifies the Object Lock rule for the specified object.
     *
     * Enable this rule when you apply `ObjectLockConfiguration` to a bucket. If Object Lock is turned on, bucket settings require both `Mode` and a period of either `Days` or `Years` . You cannot specify `Days` and `Years` at the same time. For more information, see [ObjectLockRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html) and [DefaultRetention](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockconfiguration.html#cfn-s3-bucket-objectlockconfiguration-rule
     */
    readonly rule?: cdk.IResolvable | CfnBucket.ObjectLockRuleProperty;
  }

  /**
   * Specifies the Object Lock rule for the specified object.
   *
   * Enable the this rule when you apply `ObjectLockConfiguration` to a bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html
   */
  export interface ObjectLockRuleProperty {
    /**
     * The default Object Lock retention mode and period that you want to apply to new objects placed in the specified bucket.
     *
     * If Object Lock is turned on, bucket settings require both `Mode` and a period of either `Days` or `Years` . You cannot specify `Days` and `Years` at the same time. For more information about allowable values for mode and period, see [DefaultRetention](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html#cfn-s3-bucket-objectlockrule-defaultretention
     */
    readonly defaultRetention?: CfnBucket.DefaultRetentionProperty | cdk.IResolvable;
  }

  /**
   * The container element for specifying the default Object Lock retention settings for new objects placed in the specified bucket.
   *
   * > - The `DefaultRetention` settings require both a mode and a period.
   * > - The `DefaultRetention` period can be either `Days` or `Years` but you must select one. You cannot specify `Days` and `Years` at the same time.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html
   */
  export interface DefaultRetentionProperty {
    /**
     * The number of days that you want to specify for the default retention period.
     *
     * If Object Lock is turned on, you must specify `Mode` and specify either `Days` or `Years` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html#cfn-s3-bucket-defaultretention-days
     */
    readonly days?: number;

    /**
     * The default Object Lock retention mode you want to apply to new objects placed in the specified bucket.
     *
     * If Object Lock is turned on, you must specify `Mode` and specify either `Days` or `Years` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html#cfn-s3-bucket-defaultretention-mode
     */
    readonly mode?: string;

    /**
     * The number of years that you want to specify for the default retention period.
     *
     * If Object Lock is turned on, you must specify `Mode` and specify either `Days` or `Years` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html#cfn-s3-bucket-defaultretention-years
     */
    readonly years?: number;
  }

  /**
   * Specifies the container element for Object Ownership rules.
   *
   * S3 Object Ownership is an Amazon S3 bucket-level setting that you can use to disable access control lists (ACLs) and take ownership of every object in your bucket, simplifying access management for data stored in Amazon S3. For more information, see [Controlling ownership of objects and disabling ACLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrols.html
   */
  export interface OwnershipControlsProperty {
    /**
     * Specifies the container element for Object Ownership rules.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrols.html#cfn-s3-bucket-ownershipcontrols-rules
     */
    readonly rules: Array<cdk.IResolvable | CfnBucket.OwnershipControlsRuleProperty> | cdk.IResolvable;
  }

  /**
   * Specifies an Object Ownership rule.
   *
   * S3 Object Ownership is an Amazon S3 bucket-level setting that you can use to disable access control lists (ACLs) and take ownership of every object in your bucket, simplifying access management for data stored in Amazon S3. For more information, see [Controlling ownership of objects and disabling ACLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrolsrule.html
   */
  export interface OwnershipControlsRuleProperty {
    /**
     * Specifies an object ownership rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrolsrule.html#cfn-s3-bucket-ownershipcontrolsrule-objectownership
     */
    readonly objectOwnership?: string;
  }

  /**
   * The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket.
   *
   * You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html
   */
  export interface PublicAccessBlockConfigurationProperty {
    /**
     * Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket.
     *
     * Setting this element to `TRUE` causes the following behavior:
     *
     * - PUT Bucket ACL and PUT Object ACL calls fail if the specified ACL is public.
     * - PUT Object calls fail if the request includes a public ACL.
     * - PUT Bucket calls fail if the request includes a public ACL.
     *
     * Enabling this setting doesn't affect existing policies or ACLs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-blockpublicacls
     */
    readonly blockPublicAcls?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should block public bucket policies for this bucket.
     *
     * Setting this element to `TRUE` causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access.
     *
     * Enabling this setting doesn't affect existing bucket policies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-blockpublicpolicy
     */
    readonly blockPublicPolicy?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket.
     *
     * Setting this element to `TRUE` causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket.
     *
     * Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-ignorepublicacls
     */
    readonly ignorePublicAcls?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should restrict public bucket policies for this bucket.
     *
     * Setting this element to `TRUE` restricts access to this bucket to only AWS service principals and authorized users within this account if the bucket has a public policy.
     *
     * Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-publicaccessblockconfiguration.html#cfn-s3-bucket-publicaccessblockconfiguration-restrictpublicbuckets
     */
    readonly restrictPublicBuckets?: boolean | cdk.IResolvable;
  }

  /**
   * A container for replication rules.
   *
   * You can add up to 1,000 rules. The maximum size of a replication configuration is 2 MB. The latest version of the replication configuration XML is V2. For more information about XML V2 replication configurations, see [Replication configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-add-config.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html
   */
  export interface ReplicationConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that Amazon S3 assumes when replicating objects.
     *
     * For more information, see [How to Set Up Replication](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-how-setup.html) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html#cfn-s3-bucket-replicationconfiguration-role
     */
    readonly role: string;

    /**
     * A container for one or more replication rules.
     *
     * A replication configuration must have at least one rule and can contain a maximum of 1,000 rules.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationconfiguration.html#cfn-s3-bucket-replicationconfiguration-rules
     */
    readonly rules: Array<cdk.IResolvable | CfnBucket.ReplicationRuleProperty> | cdk.IResolvable;
  }

  /**
   * Specifies which Amazon S3 objects to replicate and where to store the replicas.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrule.html
   */
  export interface ReplicationRuleProperty {
    /**
     * Specifies whether Amazon S3 replicates delete markers.
     *
     * If you specify a `Filter` in your replication configuration, you must also include a `DeleteMarkerReplication` element. If your `Filter` includes a `Tag` element, the `DeleteMarkerReplication` `Status` must be set to Disabled, because Amazon S3 does not support replicating delete markers for tag-based rules. For an example configuration, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-config-min-rule-config) .
     *
     * For more information about delete marker replication, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/delete-marker-replication.html) .
     *
     * > If you are using an earlier version of the replication configuration, Amazon S3 handles replication of delete markers differently. For more information, see [Backward Compatibility](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-backward-compat-considerations) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrule.html#cfn-s3-bucket-replicationrule-deletemarkerreplication
     */
    readonly deleteMarkerReplication?: CfnBucket.DeleteMarkerReplicationProperty | cdk.IResolvable;

    /**
     * A container for information about the replication destination and its configurations including enabling the S3 Replication Time Control (S3 RTC).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrule.html#cfn-s3-bucket-replicationrule-destination
     */
    readonly destination: cdk.IResolvable | CfnBucket.ReplicationDestinationProperty;

    /**
     * A filter that identifies the subset of objects to which the replication rule applies.
     *
     * A `Filter` must specify exactly one `Prefix` , `TagFilter` , or an `And` child element. The use of the filter field indicates that this is a V2 replication configuration. This field isn't supported in a V1 replication configuration.
     *
     * > V1 replication configuration only supports filtering by key prefix. To filter using a V1 replication configuration, add the `Prefix` directly as a child element of the `Rule` element.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrule.html#cfn-s3-bucket-replicationrule-filter
     */
    readonly filter?: cdk.IResolvable | CfnBucket.ReplicationRuleFilterProperty;

    /**
     * A unique identifier for the rule.
     *
     * The maximum value is 255 characters. If you don't specify a value, AWS CloudFormation generates a random ID. When using a V2 replication configuration this property is capitalized as "ID".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrule.html#cfn-s3-bucket-replicationrule-id
     */
    readonly id?: string;

    /**
     * An object key name prefix that identifies the object or objects to which the rule applies.
     *
     * The maximum prefix length is 1,024 characters. To include all objects in a bucket, specify an empty string. To filter using a V1 replication configuration, add the `Prefix` directly as a child element of the `Rule` element.
     *
     * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrule.html#cfn-s3-bucket-replicationrule-prefix
     */
    readonly prefix?: string;

    /**
     * The priority indicates which rule has precedence whenever two or more replication rules conflict.
     *
     * Amazon S3 will attempt to replicate objects according to all replication rules. However, if there are two or more rules with the same destination bucket, then objects will be replicated according to the rule with the highest priority. The higher the number, the higher the priority.
     *
     * For more information, see [Replication](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication.html) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrule.html#cfn-s3-bucket-replicationrule-priority
     */
    readonly priority?: number;

    /**
     * A container that describes additional filters for identifying the source objects that you want to replicate.
     *
     * You can choose to enable or disable the replication of these objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrule.html#cfn-s3-bucket-replicationrule-sourceselectioncriteria
     */
    readonly sourceSelectionCriteria?: cdk.IResolvable | CfnBucket.SourceSelectionCriteriaProperty;

    /**
     * Specifies whether the rule is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrule.html#cfn-s3-bucket-replicationrule-status
     */
    readonly status: string;
  }

  /**
   * Specifies whether Amazon S3 replicates delete markers.
   *
   * If you specify a `Filter` in your replication configuration, you must also include a `DeleteMarkerReplication` element. If your `Filter` includes a `Tag` element, the `DeleteMarkerReplication` `Status` must be set to Disabled, because Amazon S3 does not support replicating delete markers for tag-based rules. For an example configuration, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-config-min-rule-config) .
   *
   * For more information about delete marker replication, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/delete-marker-replication.html) .
   *
   * > If you are using an earlier version of the replication configuration, Amazon S3 handles replication of delete markers differently. For more information, see [Backward Compatibility](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-backward-compat-considerations) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-deletemarkerreplication.html
   */
  export interface DeleteMarkerReplicationProperty {
    /**
     * Indicates whether to replicate delete markers.
     *
     * Disabled by default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-deletemarkerreplication.html#cfn-s3-bucket-deletemarkerreplication-status
     */
    readonly status?: string;
  }

  /**
   * A container for information about the replication destination and its configurations including enabling the S3 Replication Time Control (S3 RTC).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationdestination.html
   */
  export interface ReplicationDestinationProperty {
    /**
     * Specify this only in a cross-account scenario (where source and destination bucket owners are not the same), and you want to change replica ownership to the AWS account that owns the destination bucket.
     *
     * If this is not specified in the replication configuration, the replicas are owned by same AWS account that owns the source object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationdestination.html#cfn-s3-bucket-replicationdestination-accesscontroltranslation
     */
    readonly accessControlTranslation?: CfnBucket.AccessControlTranslationProperty | cdk.IResolvable;

    /**
     * Destination bucket owner account ID.
     *
     * In a cross-account scenario, if you direct Amazon S3 to change replica ownership to the AWS account that owns the destination bucket by specifying the `AccessControlTranslation` property, this is the account ID of the destination bucket owner. For more information, see [Cross-Region Replication Additional Configuration: Change Replica Owner](https://docs.aws.amazon.com/AmazonS3/latest/dev/crr-change-owner.html) in the *Amazon S3 User Guide* .
     *
     * If you specify the `AccessControlTranslation` property, the `Account` property is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationdestination.html#cfn-s3-bucket-replicationdestination-account
     */
    readonly account?: string;

    /**
     * The Amazon Resource Name (ARN) of the bucket where you want Amazon S3 to store the results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationdestination.html#cfn-s3-bucket-replicationdestination-bucket
     */
    readonly bucket: string;

    /**
     * Specifies encryption-related information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationdestination.html#cfn-s3-bucket-replicationdestination-encryptionconfiguration
     */
    readonly encryptionConfiguration?: CfnBucket.EncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * A container specifying replication metrics-related settings enabling replication metrics and events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationdestination.html#cfn-s3-bucket-replicationdestination-metrics
     */
    readonly metrics?: cdk.IResolvable | CfnBucket.MetricsProperty;

    /**
     * A container specifying S3 Replication Time Control (S3 RTC), including whether S3 RTC is enabled and the time when all objects and operations on objects must be replicated.
     *
     * Must be specified together with a `Metrics` block.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationdestination.html#cfn-s3-bucket-replicationdestination-replicationtime
     */
    readonly replicationTime?: cdk.IResolvable | CfnBucket.ReplicationTimeProperty;

    /**
     * The storage class to use when replicating objects, such as S3 Standard or reduced redundancy.
     *
     * By default, Amazon S3 uses the storage class of the source object to create the object replica.
     *
     * For valid values, see the `StorageClass` element of the [PUT Bucket replication](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTreplication.html) action in the *Amazon S3 API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationdestination.html#cfn-s3-bucket-replicationdestination-storageclass
     */
    readonly storageClass?: string;
  }

  /**
   * Specify this only in a cross-account scenario (where source and destination bucket owners are not the same), and you want to change replica ownership to the AWS account that owns the destination bucket.
   *
   * If this is not specified in the replication configuration, the replicas are owned by same AWS account that owns the source object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accesscontroltranslation.html
   */
  export interface AccessControlTranslationProperty {
    /**
     * Specifies the replica ownership.
     *
     * For default and valid values, see [PUT bucket replication](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTreplication.html) in the *Amazon S3 API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accesscontroltranslation.html#cfn-s3-bucket-accesscontroltranslation-owner
     */
    readonly owner: string;
  }

  /**
   * Specifies encryption-related information for an Amazon S3 bucket that is a destination for replicated objects.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-encryptionconfiguration.html
   */
  export interface EncryptionConfigurationProperty {
    /**
     * Specifies the ID (Key ARN or Alias ARN) of the customer managed AWS KMS key stored in AWS Key Management Service (KMS) for the destination bucket.
     *
     * Amazon S3 uses this key to encrypt replica objects. Amazon S3 only supports symmetric encryption KMS keys. For more information, see [Asymmetric keys in AWS KMS](https://docs.aws.amazon.com//kms/latest/developerguide/symmetric-asymmetric.html) in the *AWS Key Management Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-encryptionconfiguration.html#cfn-s3-bucket-encryptionconfiguration-replicakmskeyid
     */
    readonly replicaKmsKeyId: string;
  }

  /**
   * A container specifying replication metrics-related settings enabling replication metrics and events.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metrics.html
   */
  export interface MetricsProperty {
    /**
     * A container specifying the time threshold for emitting the `s3:Replication:OperationMissedThreshold` event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metrics.html#cfn-s3-bucket-metrics-eventthreshold
     */
    readonly eventThreshold?: cdk.IResolvable | CfnBucket.ReplicationTimeValueProperty;

    /**
     * Specifies whether the replication metrics are enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metrics.html#cfn-s3-bucket-metrics-status
     */
    readonly status: string;
  }

  /**
   * A container specifying the time value for S3 Replication Time Control (S3 RTC) and replication metrics `EventThreshold` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtimevalue.html
   */
  export interface ReplicationTimeValueProperty {
    /**
     * Contains an integer specifying time in minutes.
     *
     * Valid value: 15
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtimevalue.html#cfn-s3-bucket-replicationtimevalue-minutes
     */
    readonly minutes: number;
  }

  /**
   * A container specifying S3 Replication Time Control (S3 RTC) related information, including whether S3 RTC is enabled and the time when all objects and operations on objects must be replicated.
   *
   * Must be specified together with a `Metrics` block.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtime.html
   */
  export interface ReplicationTimeProperty {
    /**
     * Specifies whether the replication time is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtime.html#cfn-s3-bucket-replicationtime-status
     */
    readonly status: string;

    /**
     * A container specifying the time by which replication should be complete for all objects and operations on objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationtime.html#cfn-s3-bucket-replicationtime-time
     */
    readonly time: cdk.IResolvable | CfnBucket.ReplicationTimeValueProperty;
  }

  /**
   * A filter that identifies the subset of objects to which the replication rule applies.
   *
   * A `Filter` must specify exactly one `Prefix` , `TagFilter` , or an `And` child element.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html
   */
  export interface ReplicationRuleFilterProperty {
    /**
     * A container for specifying rule filters.
     *
     * The filters determine the subset of objects to which the rule applies. This element is required only if you specify more than one filter. For example:
     *
     * - If you specify both a `Prefix` and a `TagFilter` , wrap these filters in an `And` tag.
     * - If you specify a filter based on multiple tags, wrap the `TagFilter` elements in an `And` tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html#cfn-s3-bucket-replicationrulefilter-and
     */
    readonly and?: cdk.IResolvable | CfnBucket.ReplicationRuleAndOperatorProperty;

    /**
     * An object key name prefix that identifies the subset of objects to which the rule applies.
     *
     * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html#cfn-s3-bucket-replicationrulefilter-prefix
     */
    readonly prefix?: string;

    /**
     * A container for specifying a tag key and value.
     *
     * The rule applies only to objects that have the tag in their tag set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationrulefilter.html#cfn-s3-bucket-replicationrulefilter-tagfilter
     */
    readonly tagFilter?: cdk.IResolvable | CfnBucket.TagFilterProperty;
  }

  /**
   * A container for specifying rule filters.
   *
   * The filters determine the subset of objects to which the rule applies. This element is required only if you specify more than one filter.
   *
   * For example:
   *
   * - If you specify both a `Prefix` and a `TagFilter` , wrap these filters in an `And` tag.
   * - If you specify a filter based on multiple tags, wrap the `TagFilter` elements in an `And` tag
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationruleandoperator.html
   */
  export interface ReplicationRuleAndOperatorProperty {
    /**
     * An object key name prefix that identifies the subset of objects to which the rule applies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationruleandoperator.html#cfn-s3-bucket-replicationruleandoperator-prefix
     */
    readonly prefix?: string;

    /**
     * An array of tags containing key and value pairs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicationruleandoperator.html#cfn-s3-bucket-replicationruleandoperator-tagfilters
     */
    readonly tagFilters?: Array<cdk.IResolvable | CfnBucket.TagFilterProperty> | cdk.IResolvable;
  }

  /**
   * A container that describes additional filters for identifying the source objects that you want to replicate.
   *
   * You can choose to enable or disable the replication of these objects.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html
   */
  export interface SourceSelectionCriteriaProperty {
    /**
     * A filter that you can specify for selection for modifications on replicas.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html#cfn-s3-bucket-sourceselectioncriteria-replicamodifications
     */
    readonly replicaModifications?: cdk.IResolvable | CfnBucket.ReplicaModificationsProperty;

    /**
     * A container for filter information for the selection of Amazon S3 objects encrypted with AWS KMS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html#cfn-s3-bucket-sourceselectioncriteria-ssekmsencryptedobjects
     */
    readonly sseKmsEncryptedObjects?: cdk.IResolvable | CfnBucket.SseKmsEncryptedObjectsProperty;
  }

  /**
   * A filter that you can specify for selection for modifications on replicas.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicamodifications.html
   */
  export interface ReplicaModificationsProperty {
    /**
     * Specifies whether Amazon S3 replicates modifications on replicas.
     *
     * *Allowed values* : `Enabled` | `Disabled`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-replicamodifications.html#cfn-s3-bucket-replicamodifications-status
     */
    readonly status: string;
  }

  /**
   * A container for filter information for the selection of S3 objects encrypted with AWS KMS.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ssekmsencryptedobjects.html
   */
  export interface SseKmsEncryptedObjectsProperty {
    /**
     * Specifies whether Amazon S3 replicates objects created with server-side encryption using an AWS KMS key stored in AWS Key Management Service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ssekmsencryptedobjects.html#cfn-s3-bucket-ssekmsencryptedobjects-status
     */
    readonly status: string;
  }

  /**
   * Describes the versioning state of an Amazon S3 bucket.
   *
   * For more information, see [PUT Bucket versioning](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTVersioningStatus.html) in the *Amazon S3 API Reference* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfiguration.html
   */
  export interface VersioningConfigurationProperty {
    /**
     * The versioning state of the bucket.
     *
     * @default - "Suspended"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfiguration.html#cfn-s3-bucket-versioningconfiguration-status
     */
    readonly status: string;
  }

  /**
   * Specifies website configuration parameters for an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-websiteconfiguration.html
   */
  export interface WebsiteConfigurationProperty {
    /**
     * The name of the error document for the website.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-websiteconfiguration.html#cfn-s3-bucket-websiteconfiguration-errordocument
     */
    readonly errorDocument?: string;

    /**
     * The name of the index document for the website.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-websiteconfiguration.html#cfn-s3-bucket-websiteconfiguration-indexdocument
     */
    readonly indexDocument?: string;

    /**
     * The redirect behavior for every request to this bucket's website endpoint.
     *
     * > If you specify this property, you can't specify any other property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-websiteconfiguration.html#cfn-s3-bucket-websiteconfiguration-redirectallrequeststo
     */
    readonly redirectAllRequestsTo?: cdk.IResolvable | CfnBucket.RedirectAllRequestsToProperty;

    /**
     * Rules that define when a redirect is applied and the redirect behavior.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-websiteconfiguration.html#cfn-s3-bucket-websiteconfiguration-routingrules
     */
    readonly routingRules?: Array<cdk.IResolvable | CfnBucket.RoutingRuleProperty> | cdk.IResolvable;
  }

  /**
   * Specifies the redirect behavior of all requests to a website endpoint of an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-redirectallrequeststo.html
   */
  export interface RedirectAllRequestsToProperty {
    /**
     * Name of the host where requests are redirected.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-redirectallrequeststo.html#cfn-s3-bucket-redirectallrequeststo-hostname
     */
    readonly hostName: string;

    /**
     * Protocol to use when redirecting requests.
     *
     * The default is the protocol that is used in the original request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-redirectallrequeststo.html#cfn-s3-bucket-redirectallrequeststo-protocol
     */
    readonly protocol?: string;
  }

  /**
   * Specifies the redirect behavior and when a redirect is applied.
   *
   * For more information about routing rules, see [Configuring advanced conditional redirects](https://docs.aws.amazon.com/AmazonS3/latest/dev/how-to-page-redirect.html#advanced-conditional-redirects) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-routingrule.html
   */
  export interface RoutingRuleProperty {
    /**
     * Container for redirect information.
     *
     * You can redirect requests to another host, to another page, or with another protocol. In the event of an error, you can specify a different error code to return.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-routingrule.html#cfn-s3-bucket-routingrule-redirectrule
     */
    readonly redirectRule: cdk.IResolvable | CfnBucket.RedirectRuleProperty;

    /**
     * A container for describing a condition that must be met for the specified redirect to apply.
     *
     * For example, 1. If request is for pages in the `/docs` folder, redirect to the `/documents` folder. 2. If request results in HTTP error 4xx, redirect request to another host where you might process the error.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-routingrule.html#cfn-s3-bucket-routingrule-routingrulecondition
     */
    readonly routingRuleCondition?: cdk.IResolvable | CfnBucket.RoutingRuleConditionProperty;
  }

  /**
   * Specifies how requests are redirected.
   *
   * In the event of an error, you can specify a different error code to return.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-redirectrule.html
   */
  export interface RedirectRuleProperty {
    /**
     * The host name to use in the redirect request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-redirectrule.html#cfn-s3-bucket-redirectrule-hostname
     */
    readonly hostName?: string;

    /**
     * The HTTP redirect code to use on the response.
     *
     * Not required if one of the siblings is present.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-redirectrule.html#cfn-s3-bucket-redirectrule-httpredirectcode
     */
    readonly httpRedirectCode?: string;

    /**
     * Protocol to use when redirecting requests.
     *
     * The default is the protocol that is used in the original request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-redirectrule.html#cfn-s3-bucket-redirectrule-protocol
     */
    readonly protocol?: string;

    /**
     * The object key prefix to use in the redirect request.
     *
     * For example, to redirect requests for all pages with prefix `docs/` (objects in the `docs/` folder) to `documents/` , you can set a condition block with `KeyPrefixEquals` set to `docs/` and in the Redirect set `ReplaceKeyPrefixWith` to `/documents` . Not required if one of the siblings is present. Can be present only if `ReplaceKeyWith` is not provided.
     *
     * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-redirectrule.html#cfn-s3-bucket-redirectrule-replacekeyprefixwith
     */
    readonly replaceKeyPrefixWith?: string;

    /**
     * The specific object key to use in the redirect request.
     *
     * For example, redirect request to `error.html` . Not required if one of the siblings is present. Can be present only if `ReplaceKeyPrefixWith` is not provided.
     *
     * > Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-redirectrule.html#cfn-s3-bucket-redirectrule-replacekeywith
     */
    readonly replaceKeyWith?: string;
  }

  /**
   * A container for describing a condition that must be met for the specified redirect to apply.
   *
   * For example, 1. If request is for pages in the `/docs` folder, redirect to the `/documents` folder. 2. If request results in HTTP error 4xx, redirect request to another host where you might process the error.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-routingrulecondition.html
   */
  export interface RoutingRuleConditionProperty {
    /**
     * The HTTP error code when the redirect is applied.
     *
     * In the event of an error, if the error code equals this value, then the specified redirect is applied.
     *
     * Required when parent element `Condition` is specified and sibling `KeyPrefixEquals` is not specified. If both are specified, then both must be true for the redirect to be applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-routingrulecondition.html#cfn-s3-bucket-routingrulecondition-httperrorcodereturnedequals
     */
    readonly httpErrorCodeReturnedEquals?: string;

    /**
     * The object key name prefix when the redirect is applied.
     *
     * For example, to redirect requests for `ExamplePage.html` , the key prefix will be `ExamplePage.html` . To redirect request for all pages with the prefix `docs/` , the key prefix will be `/docs` , which identifies all objects in the docs/ folder.
     *
     * Required when the parent element `Condition` is specified and sibling `HttpErrorCodeReturnedEquals` is not specified. If both conditions are specified, both must be true for the redirect to be applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-routingrulecondition.html#cfn-s3-bucket-routingrulecondition-keyprefixequals
     */
    readonly keyPrefixEquals?: string;
  }
}

/**
 * Properties for defining a `CfnBucket`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html
 */
export interface CfnBucketProps {
  /**
   * Configures the transfer acceleration state for an Amazon S3 bucket.
   *
   * For more information, see [Amazon S3 Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) in the *Amazon S3 User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-accelerateconfiguration
   */
  readonly accelerateConfiguration?: CfnBucket.AccelerateConfigurationProperty | cdk.IResolvable;

  /**
   * > This is a legacy property, and it is not recommended for most use cases.
   *
   * A majority of modern use cases in Amazon S3 no longer require the use of ACLs, and we recommend that you keep ACLs disabled. For more information, see [Controlling object ownership](https://docs.aws.amazon.com//AmazonS3/latest/userguide/about-object-ownership.html) in the *Amazon S3 User Guide* .
   *
   * A canned access control list (ACL) that grants predefined permissions to the bucket. For more information about canned ACLs, see [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) in the *Amazon S3 User Guide* .
   *
   * S3 buckets are created with ACLs disabled by default. Therefore, unless you explicitly set the [AWS::S3::OwnershipControls](https://docs.aws.amazon.com//AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrols.html) property to enable ACLs, your resource will fail to deploy with any value other than Private. Use cases requiring ACLs are uncommon.
   *
   * The majority of access control configurations can be successfully and more easily achieved with bucket policies. For more information, see [AWS::S3::BucketPolicy](https://docs.aws.amazon.com//AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html) . For examples of common policy configurations, including S3 Server Access Logs buckets and more, see [Bucket policy examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html) in the *Amazon S3 User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-accesscontrol
   */
  readonly accessControl?: string;

  /**
   * Specifies the configuration and any analyses for the analytics filter of an Amazon S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-analyticsconfigurations
   */
  readonly analyticsConfigurations?: Array<CfnBucket.AnalyticsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies default encryption for a bucket using server-side encryption with Amazon S3-managed keys (SSE-S3), AWS KMS-managed keys (SSE-KMS), or dual-layer server-side encryption with KMS-managed keys (DSSE-KMS).
   *
   * For information about the Amazon S3 default encryption feature, see [Amazon S3 Default Encryption for S3 Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html) in the *Amazon S3 User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-bucketencryption
   */
  readonly bucketEncryption?: CfnBucket.BucketEncryptionProperty | cdk.IResolvable;

  /**
   * A name for the bucket.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. The bucket name must contain only lowercase letters, numbers, periods (.), and dashes (-) and must follow [Amazon S3 bucket restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html) . For more information, see [Rules for naming Amazon S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules) in the *Amazon S3 User Guide* .
   *
   * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-bucketname
   */
  readonly bucketName?: string;

  /**
   * Describes the cross-origin access configuration for objects in an Amazon S3 bucket.
   *
   * For more information, see [Enabling Cross-Origin Resource Sharing](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) in the *Amazon S3 User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-corsconfiguration
   */
  readonly corsConfiguration?: CfnBucket.CorsConfigurationProperty | cdk.IResolvable;

  /**
   * Defines how Amazon S3 handles Intelligent-Tiering storage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-intelligenttieringconfigurations
   */
  readonly intelligentTieringConfigurations?: Array<CfnBucket.IntelligentTieringConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies the inventory configuration for an Amazon S3 bucket.
   *
   * For more information, see [GET Bucket inventory](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketGETInventoryConfig.html) in the *Amazon S3 API Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-inventoryconfigurations
   */
  readonly inventoryConfigurations?: Array<CfnBucket.InventoryConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies the lifecycle configuration for objects in an Amazon S3 bucket.
   *
   * For more information, see [Object Lifecycle Management](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) in the *Amazon S3 User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-lifecycleconfiguration
   */
  readonly lifecycleConfiguration?: cdk.IResolvable | CfnBucket.LifecycleConfigurationProperty;

  /**
   * Settings that define where logs are stored.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-loggingconfiguration
   */
  readonly loggingConfiguration?: cdk.IResolvable | CfnBucket.LoggingConfigurationProperty;

  /**
   * Specifies a metrics configuration for the CloudWatch request metrics (specified by the metrics configuration ID) from an Amazon S3 bucket.
   *
   * If you're updating an existing metrics configuration, note that this is a full replacement of the existing metrics configuration. If you don't include the elements you want to keep, they are erased. For more information, see [PutBucketMetricsConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTMetricConfiguration.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-metricsconfigurations
   */
  readonly metricsConfigurations?: Array<cdk.IResolvable | CfnBucket.MetricsConfigurationProperty> | cdk.IResolvable;

  /**
   * Configuration that defines how Amazon S3 handles bucket notifications.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-notificationconfiguration
   */
  readonly notificationConfiguration?: cdk.IResolvable | CfnBucket.NotificationConfigurationProperty;

  /**
   * > This operation is not supported by directory buckets.
   *
   * Places an Object Lock configuration on the specified bucket. The rule specified in the Object Lock configuration will be applied by default to every new object placed in the specified bucket. For more information, see [Locking Objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lock.html) .
   *
   * > - The `DefaultRetention` settings require both a mode and a period.
   * > - The `DefaultRetention` period can be either `Days` or `Years` but you must select one. You cannot specify `Days` and `Years` at the same time.
   * > - You can enable Object Lock for new or existing buckets. For more information, see [Configuring Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-configure.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-objectlockconfiguration
   */
  readonly objectLockConfiguration?: cdk.IResolvable | CfnBucket.ObjectLockConfigurationProperty;

  /**
   * Indicates whether this bucket has an Object Lock configuration enabled.
   *
   * Enable `ObjectLockEnabled` when you apply `ObjectLockConfiguration` to a bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-objectlockenabled
   */
  readonly objectLockEnabled?: boolean | cdk.IResolvable;

  /**
   * Configuration that defines how Amazon S3 handles Object Ownership rules.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-ownershipcontrols
   */
  readonly ownershipControls?: cdk.IResolvable | CfnBucket.OwnershipControlsProperty;

  /**
   * Configuration that defines how Amazon S3 handles public access.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-publicaccessblockconfiguration
   */
  readonly publicAccessBlockConfiguration?: cdk.IResolvable | CfnBucket.PublicAccessBlockConfigurationProperty;

  /**
   * Configuration for replicating objects in an S3 bucket.
   *
   * To enable replication, you must also enable versioning by using the `VersioningConfiguration` property.
   *
   * Amazon S3 can store replicated objects in a single destination bucket or multiple destination buckets. The destination bucket or buckets must already exist.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-replicationconfiguration
   */
  readonly replicationConfiguration?: cdk.IResolvable | CfnBucket.ReplicationConfigurationProperty;

  /**
   * An arbitrary set of tags (key-value pairs) for this S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Enables multiple versions of all objects in this bucket.
   *
   * You might enable versioning to prevent objects from being deleted or overwritten by mistake or to archive objects so that you can retrieve previous versions of them.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-versioningconfiguration
   */
  readonly versioningConfiguration?: cdk.IResolvable | CfnBucket.VersioningConfigurationProperty;

  /**
   * Information used to configure the bucket as a static website.
   *
   * For more information, see [Hosting Websites on Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html#cfn-s3-bucket-websiteconfiguration
   */
  readonly websiteConfiguration?: cdk.IResolvable | CfnBucket.WebsiteConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `AccelerateConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AccelerateConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketAccelerateConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accelerationStatus", cdk.requiredValidator)(properties.accelerationStatus));
  errors.collect(cdk.propertyValidator("accelerationStatus", cdk.validateString)(properties.accelerationStatus));
  return errors.wrap("supplied properties not correct for \"AccelerateConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketAccelerateConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketAccelerateConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AccelerationStatus": cdk.stringToCloudFormation(properties.accelerationStatus)
  };
}

// @ts-ignore TS6133
function CfnBucketAccelerateConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.AccelerateConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.AccelerateConfigurationProperty>();
  ret.addPropertyResult("accelerationStatus", "AccelerationStatus", (properties.AccelerationStatus != null ? cfn_parse.FromCloudFormation.getString(properties.AccelerationStatus) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DestinationProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketAccountId", cdk.validateString)(properties.bucketAccountId));
  errors.collect(cdk.propertyValidator("bucketArn", cdk.requiredValidator)(properties.bucketArn));
  errors.collect(cdk.propertyValidator("bucketArn", cdk.validateString)(properties.bucketArn));
  errors.collect(cdk.propertyValidator("format", cdk.requiredValidator)(properties.format));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"DestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketDestinationPropertyValidator(properties).assertSuccess();
  return {
    "BucketAccountId": cdk.stringToCloudFormation(properties.bucketAccountId),
    "BucketArn": cdk.stringToCloudFormation(properties.bucketArn),
    "Format": cdk.stringToCloudFormation(properties.format),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnBucketDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.DestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.DestinationProperty>();
  ret.addPropertyResult("bucketAccountId", "BucketAccountId", (properties.BucketAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.BucketAccountId) : undefined));
  ret.addPropertyResult("bucketArn", "BucketArn", (properties.BucketArn != null ? cfn_parse.FromCloudFormation.getString(properties.BucketArn) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataExportProperty`
 *
 * @param properties - the TypeScript properties of a `DataExportProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketDataExportPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", CfnBucketDestinationPropertyValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("outputSchemaVersion", cdk.requiredValidator)(properties.outputSchemaVersion));
  errors.collect(cdk.propertyValidator("outputSchemaVersion", cdk.validateString)(properties.outputSchemaVersion));
  return errors.wrap("supplied properties not correct for \"DataExportProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketDataExportPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketDataExportPropertyValidator(properties).assertSuccess();
  return {
    "Destination": convertCfnBucketDestinationPropertyToCloudFormation(properties.destination),
    "OutputSchemaVersion": cdk.stringToCloudFormation(properties.outputSchemaVersion)
  };
}

// @ts-ignore TS6133
function CfnBucketDataExportPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.DataExportProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.DataExportProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? CfnBucketDestinationPropertyFromCloudFormation(properties.Destination) : undefined));
  ret.addPropertyResult("outputSchemaVersion", "OutputSchemaVersion", (properties.OutputSchemaVersion != null ? cfn_parse.FromCloudFormation.getString(properties.OutputSchemaVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StorageClassAnalysisProperty`
 *
 * @param properties - the TypeScript properties of a `StorageClassAnalysisProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketStorageClassAnalysisPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataExport", CfnBucketDataExportPropertyValidator)(properties.dataExport));
  return errors.wrap("supplied properties not correct for \"StorageClassAnalysisProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketStorageClassAnalysisPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketStorageClassAnalysisPropertyValidator(properties).assertSuccess();
  return {
    "DataExport": convertCfnBucketDataExportPropertyToCloudFormation(properties.dataExport)
  };
}

// @ts-ignore TS6133
function CfnBucketStorageClassAnalysisPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.StorageClassAnalysisProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.StorageClassAnalysisProperty>();
  ret.addPropertyResult("dataExport", "DataExport", (properties.DataExport != null ? CfnBucketDataExportPropertyFromCloudFormation(properties.DataExport) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagFilterProperty`
 *
 * @param properties - the TypeScript properties of a `TagFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketTagFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketTagFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketTagFilterPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBucketTagFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.TagFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.TagFilterProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AnalyticsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AnalyticsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketAnalyticsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("storageClassAnalysis", cdk.requiredValidator)(properties.storageClassAnalysis));
  errors.collect(cdk.propertyValidator("storageClassAnalysis", CfnBucketStorageClassAnalysisPropertyValidator)(properties.storageClassAnalysis));
  errors.collect(cdk.propertyValidator("tagFilters", cdk.listValidator(CfnBucketTagFilterPropertyValidator))(properties.tagFilters));
  return errors.wrap("supplied properties not correct for \"AnalyticsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketAnalyticsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketAnalyticsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "StorageClassAnalysis": convertCfnBucketStorageClassAnalysisPropertyToCloudFormation(properties.storageClassAnalysis),
    "TagFilters": cdk.listMapper(convertCfnBucketTagFilterPropertyToCloudFormation)(properties.tagFilters)
  };
}

// @ts-ignore TS6133
function CfnBucketAnalyticsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.AnalyticsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.AnalyticsConfigurationProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("storageClassAnalysis", "StorageClassAnalysis", (properties.StorageClassAnalysis != null ? CfnBucketStorageClassAnalysisPropertyFromCloudFormation(properties.StorageClassAnalysis) : undefined));
  ret.addPropertyResult("tagFilters", "TagFilters", (properties.TagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTagFilterPropertyFromCloudFormation)(properties.TagFilters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServerSideEncryptionByDefaultProperty`
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionByDefaultProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketServerSideEncryptionByDefaultPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsMasterKeyId", cdk.validateString)(properties.kmsMasterKeyId));
  errors.collect(cdk.propertyValidator("sseAlgorithm", cdk.requiredValidator)(properties.sseAlgorithm));
  errors.collect(cdk.propertyValidator("sseAlgorithm", cdk.validateString)(properties.sseAlgorithm));
  return errors.wrap("supplied properties not correct for \"ServerSideEncryptionByDefaultProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketServerSideEncryptionByDefaultPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketServerSideEncryptionByDefaultPropertyValidator(properties).assertSuccess();
  return {
    "KMSMasterKeyID": cdk.stringToCloudFormation(properties.kmsMasterKeyId),
    "SSEAlgorithm": cdk.stringToCloudFormation(properties.sseAlgorithm)
  };
}

// @ts-ignore TS6133
function CfnBucketServerSideEncryptionByDefaultPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ServerSideEncryptionByDefaultProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ServerSideEncryptionByDefaultProperty>();
  ret.addPropertyResult("kmsMasterKeyId", "KMSMasterKeyID", (properties.KMSMasterKeyID != null ? cfn_parse.FromCloudFormation.getString(properties.KMSMasterKeyID) : undefined));
  ret.addPropertyResult("sseAlgorithm", "SSEAlgorithm", (properties.SSEAlgorithm != null ? cfn_parse.FromCloudFormation.getString(properties.SSEAlgorithm) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServerSideEncryptionRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketServerSideEncryptionRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketKeyEnabled", cdk.validateBoolean)(properties.bucketKeyEnabled));
  errors.collect(cdk.propertyValidator("serverSideEncryptionByDefault", CfnBucketServerSideEncryptionByDefaultPropertyValidator)(properties.serverSideEncryptionByDefault));
  return errors.wrap("supplied properties not correct for \"ServerSideEncryptionRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketServerSideEncryptionRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketServerSideEncryptionRulePropertyValidator(properties).assertSuccess();
  return {
    "BucketKeyEnabled": cdk.booleanToCloudFormation(properties.bucketKeyEnabled),
    "ServerSideEncryptionByDefault": convertCfnBucketServerSideEncryptionByDefaultPropertyToCloudFormation(properties.serverSideEncryptionByDefault)
  };
}

// @ts-ignore TS6133
function CfnBucketServerSideEncryptionRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ServerSideEncryptionRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ServerSideEncryptionRuleProperty>();
  ret.addPropertyResult("bucketKeyEnabled", "BucketKeyEnabled", (properties.BucketKeyEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BucketKeyEnabled) : undefined));
  ret.addPropertyResult("serverSideEncryptionByDefault", "ServerSideEncryptionByDefault", (properties.ServerSideEncryptionByDefault != null ? CfnBucketServerSideEncryptionByDefaultPropertyFromCloudFormation(properties.ServerSideEncryptionByDefault) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BucketEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `BucketEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketBucketEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serverSideEncryptionConfiguration", cdk.requiredValidator)(properties.serverSideEncryptionConfiguration));
  errors.collect(cdk.propertyValidator("serverSideEncryptionConfiguration", cdk.listValidator(CfnBucketServerSideEncryptionRulePropertyValidator))(properties.serverSideEncryptionConfiguration));
  return errors.wrap("supplied properties not correct for \"BucketEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketBucketEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketBucketEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "ServerSideEncryptionConfiguration": cdk.listMapper(convertCfnBucketServerSideEncryptionRulePropertyToCloudFormation)(properties.serverSideEncryptionConfiguration)
  };
}

// @ts-ignore TS6133
function CfnBucketBucketEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.BucketEncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.BucketEncryptionProperty>();
  ret.addPropertyResult("serverSideEncryptionConfiguration", "ServerSideEncryptionConfiguration", (properties.ServerSideEncryptionConfiguration != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketServerSideEncryptionRulePropertyFromCloudFormation)(properties.ServerSideEncryptionConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CorsRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CorsRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketCorsRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedHeaders", cdk.listValidator(cdk.validateString))(properties.allowedHeaders));
  errors.collect(cdk.propertyValidator("allowedMethods", cdk.requiredValidator)(properties.allowedMethods));
  errors.collect(cdk.propertyValidator("allowedMethods", cdk.listValidator(cdk.validateString))(properties.allowedMethods));
  errors.collect(cdk.propertyValidator("allowedOrigins", cdk.requiredValidator)(properties.allowedOrigins));
  errors.collect(cdk.propertyValidator("allowedOrigins", cdk.listValidator(cdk.validateString))(properties.allowedOrigins));
  errors.collect(cdk.propertyValidator("exposedHeaders", cdk.listValidator(cdk.validateString))(properties.exposedHeaders));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("maxAge", cdk.validateNumber)(properties.maxAge));
  return errors.wrap("supplied properties not correct for \"CorsRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketCorsRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketCorsRulePropertyValidator(properties).assertSuccess();
  return {
    "AllowedHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedHeaders),
    "AllowedMethods": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedMethods),
    "AllowedOrigins": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedOrigins),
    "ExposedHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.exposedHeaders),
    "Id": cdk.stringToCloudFormation(properties.id),
    "MaxAge": cdk.numberToCloudFormation(properties.maxAge)
  };
}

// @ts-ignore TS6133
function CfnBucketCorsRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.CorsRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.CorsRuleProperty>();
  ret.addPropertyResult("allowedHeaders", "AllowedHeaders", (properties.AllowedHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedHeaders) : undefined));
  ret.addPropertyResult("allowedMethods", "AllowedMethods", (properties.AllowedMethods != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedMethods) : undefined));
  ret.addPropertyResult("allowedOrigins", "AllowedOrigins", (properties.AllowedOrigins != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedOrigins) : undefined));
  ret.addPropertyResult("exposedHeaders", "ExposedHeaders", (properties.ExposedHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExposedHeaders) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("maxAge", "MaxAge", (properties.MaxAge != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAge) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CorsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CorsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketCorsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("corsRules", cdk.requiredValidator)(properties.corsRules));
  errors.collect(cdk.propertyValidator("corsRules", cdk.listValidator(CfnBucketCorsRulePropertyValidator))(properties.corsRules));
  return errors.wrap("supplied properties not correct for \"CorsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketCorsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketCorsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CorsRules": cdk.listMapper(convertCfnBucketCorsRulePropertyToCloudFormation)(properties.corsRules)
  };
}

// @ts-ignore TS6133
function CfnBucketCorsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.CorsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.CorsConfigurationProperty>();
  ret.addPropertyResult("corsRules", "CorsRules", (properties.CorsRules != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketCorsRulePropertyFromCloudFormation)(properties.CorsRules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TieringProperty`
 *
 * @param properties - the TypeScript properties of a `TieringProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketTieringPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessTier", cdk.requiredValidator)(properties.accessTier));
  errors.collect(cdk.propertyValidator("accessTier", cdk.validateString)(properties.accessTier));
  errors.collect(cdk.propertyValidator("days", cdk.requiredValidator)(properties.days));
  errors.collect(cdk.propertyValidator("days", cdk.validateNumber)(properties.days));
  return errors.wrap("supplied properties not correct for \"TieringProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketTieringPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketTieringPropertyValidator(properties).assertSuccess();
  return {
    "AccessTier": cdk.stringToCloudFormation(properties.accessTier),
    "Days": cdk.numberToCloudFormation(properties.days)
  };
}

// @ts-ignore TS6133
function CfnBucketTieringPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.TieringProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.TieringProperty>();
  ret.addPropertyResult("accessTier", "AccessTier", (properties.AccessTier != null ? cfn_parse.FromCloudFormation.getString(properties.AccessTier) : undefined));
  ret.addPropertyResult("days", "Days", (properties.Days != null ? cfn_parse.FromCloudFormation.getNumber(properties.Days) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IntelligentTieringConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IntelligentTieringConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketIntelligentTieringConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tagFilters", cdk.listValidator(CfnBucketTagFilterPropertyValidator))(properties.tagFilters));
  errors.collect(cdk.propertyValidator("tierings", cdk.requiredValidator)(properties.tierings));
  errors.collect(cdk.propertyValidator("tierings", cdk.listValidator(CfnBucketTieringPropertyValidator))(properties.tierings));
  return errors.wrap("supplied properties not correct for \"IntelligentTieringConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketIntelligentTieringConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketIntelligentTieringConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "Status": cdk.stringToCloudFormation(properties.status),
    "TagFilters": cdk.listMapper(convertCfnBucketTagFilterPropertyToCloudFormation)(properties.tagFilters),
    "Tierings": cdk.listMapper(convertCfnBucketTieringPropertyToCloudFormation)(properties.tierings)
  };
}

// @ts-ignore TS6133
function CfnBucketIntelligentTieringConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.IntelligentTieringConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.IntelligentTieringConfigurationProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tagFilters", "TagFilters", (properties.TagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTagFilterPropertyFromCloudFormation)(properties.TagFilters) : undefined));
  ret.addPropertyResult("tierings", "Tierings", (properties.Tierings != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTieringPropertyFromCloudFormation)(properties.Tierings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InventoryConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InventoryConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketInventoryConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", CfnBucketDestinationPropertyValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("includedObjectVersions", cdk.requiredValidator)(properties.includedObjectVersions));
  errors.collect(cdk.propertyValidator("includedObjectVersions", cdk.validateString)(properties.includedObjectVersions));
  errors.collect(cdk.propertyValidator("optionalFields", cdk.listValidator(cdk.validateString))(properties.optionalFields));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("scheduleFrequency", cdk.requiredValidator)(properties.scheduleFrequency));
  errors.collect(cdk.propertyValidator("scheduleFrequency", cdk.validateString)(properties.scheduleFrequency));
  return errors.wrap("supplied properties not correct for \"InventoryConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketInventoryConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketInventoryConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Destination": convertCfnBucketDestinationPropertyToCloudFormation(properties.destination),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Id": cdk.stringToCloudFormation(properties.id),
    "IncludedObjectVersions": cdk.stringToCloudFormation(properties.includedObjectVersions),
    "OptionalFields": cdk.listMapper(cdk.stringToCloudFormation)(properties.optionalFields),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "ScheduleFrequency": cdk.stringToCloudFormation(properties.scheduleFrequency)
  };
}

// @ts-ignore TS6133
function CfnBucketInventoryConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.InventoryConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.InventoryConfigurationProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? CfnBucketDestinationPropertyFromCloudFormation(properties.Destination) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("includedObjectVersions", "IncludedObjectVersions", (properties.IncludedObjectVersions != null ? cfn_parse.FromCloudFormation.getString(properties.IncludedObjectVersions) : undefined));
  ret.addPropertyResult("optionalFields", "OptionalFields", (properties.OptionalFields != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OptionalFields) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("scheduleFrequency", "ScheduleFrequency", (properties.ScheduleFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleFrequency) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AbortIncompleteMultipartUploadProperty`
 *
 * @param properties - the TypeScript properties of a `AbortIncompleteMultipartUploadProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketAbortIncompleteMultipartUploadPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("daysAfterInitiation", cdk.requiredValidator)(properties.daysAfterInitiation));
  errors.collect(cdk.propertyValidator("daysAfterInitiation", cdk.validateNumber)(properties.daysAfterInitiation));
  return errors.wrap("supplied properties not correct for \"AbortIncompleteMultipartUploadProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketAbortIncompleteMultipartUploadPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketAbortIncompleteMultipartUploadPropertyValidator(properties).assertSuccess();
  return {
    "DaysAfterInitiation": cdk.numberToCloudFormation(properties.daysAfterInitiation)
  };
}

// @ts-ignore TS6133
function CfnBucketAbortIncompleteMultipartUploadPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.AbortIncompleteMultipartUploadProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.AbortIncompleteMultipartUploadProperty>();
  ret.addPropertyResult("daysAfterInitiation", "DaysAfterInitiation", (properties.DaysAfterInitiation != null ? cfn_parse.FromCloudFormation.getNumber(properties.DaysAfterInitiation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NoncurrentVersionExpirationProperty`
 *
 * @param properties - the TypeScript properties of a `NoncurrentVersionExpirationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketNoncurrentVersionExpirationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("newerNoncurrentVersions", cdk.validateNumber)(properties.newerNoncurrentVersions));
  errors.collect(cdk.propertyValidator("noncurrentDays", cdk.requiredValidator)(properties.noncurrentDays));
  errors.collect(cdk.propertyValidator("noncurrentDays", cdk.validateNumber)(properties.noncurrentDays));
  return errors.wrap("supplied properties not correct for \"NoncurrentVersionExpirationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketNoncurrentVersionExpirationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketNoncurrentVersionExpirationPropertyValidator(properties).assertSuccess();
  return {
    "NewerNoncurrentVersions": cdk.numberToCloudFormation(properties.newerNoncurrentVersions),
    "NoncurrentDays": cdk.numberToCloudFormation(properties.noncurrentDays)
  };
}

// @ts-ignore TS6133
function CfnBucketNoncurrentVersionExpirationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.NoncurrentVersionExpirationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.NoncurrentVersionExpirationProperty>();
  ret.addPropertyResult("newerNoncurrentVersions", "NewerNoncurrentVersions", (properties.NewerNoncurrentVersions != null ? cfn_parse.FromCloudFormation.getNumber(properties.NewerNoncurrentVersions) : undefined));
  ret.addPropertyResult("noncurrentDays", "NoncurrentDays", (properties.NoncurrentDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.NoncurrentDays) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NoncurrentVersionTransitionProperty`
 *
 * @param properties - the TypeScript properties of a `NoncurrentVersionTransitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketNoncurrentVersionTransitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("newerNoncurrentVersions", cdk.validateNumber)(properties.newerNoncurrentVersions));
  errors.collect(cdk.propertyValidator("storageClass", cdk.requiredValidator)(properties.storageClass));
  errors.collect(cdk.propertyValidator("storageClass", cdk.validateString)(properties.storageClass));
  errors.collect(cdk.propertyValidator("transitionInDays", cdk.requiredValidator)(properties.transitionInDays));
  errors.collect(cdk.propertyValidator("transitionInDays", cdk.validateNumber)(properties.transitionInDays));
  return errors.wrap("supplied properties not correct for \"NoncurrentVersionTransitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketNoncurrentVersionTransitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketNoncurrentVersionTransitionPropertyValidator(properties).assertSuccess();
  return {
    "NewerNoncurrentVersions": cdk.numberToCloudFormation(properties.newerNoncurrentVersions),
    "StorageClass": cdk.stringToCloudFormation(properties.storageClass),
    "TransitionInDays": cdk.numberToCloudFormation(properties.transitionInDays)
  };
}

// @ts-ignore TS6133
function CfnBucketNoncurrentVersionTransitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.NoncurrentVersionTransitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.NoncurrentVersionTransitionProperty>();
  ret.addPropertyResult("newerNoncurrentVersions", "NewerNoncurrentVersions", (properties.NewerNoncurrentVersions != null ? cfn_parse.FromCloudFormation.getNumber(properties.NewerNoncurrentVersions) : undefined));
  ret.addPropertyResult("storageClass", "StorageClass", (properties.StorageClass != null ? cfn_parse.FromCloudFormation.getString(properties.StorageClass) : undefined));
  ret.addPropertyResult("transitionInDays", "TransitionInDays", (properties.TransitionInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.TransitionInDays) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TransitionProperty`
 *
 * @param properties - the TypeScript properties of a `TransitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketTransitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("storageClass", cdk.requiredValidator)(properties.storageClass));
  errors.collect(cdk.propertyValidator("storageClass", cdk.validateString)(properties.storageClass));
  errors.collect(cdk.propertyValidator("transitionDate", cdk.validateDate)(properties.transitionDate));
  errors.collect(cdk.propertyValidator("transitionInDays", cdk.validateNumber)(properties.transitionInDays));
  return errors.wrap("supplied properties not correct for \"TransitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketTransitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketTransitionPropertyValidator(properties).assertSuccess();
  return {
    "StorageClass": cdk.stringToCloudFormation(properties.storageClass),
    "TransitionDate": cdk.dateToCloudFormation(properties.transitionDate),
    "TransitionInDays": cdk.numberToCloudFormation(properties.transitionInDays)
  };
}

// @ts-ignore TS6133
function CfnBucketTransitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.TransitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.TransitionProperty>();
  ret.addPropertyResult("storageClass", "StorageClass", (properties.StorageClass != null ? cfn_parse.FromCloudFormation.getString(properties.StorageClass) : undefined));
  ret.addPropertyResult("transitionDate", "TransitionDate", (properties.TransitionDate != null ? cfn_parse.FromCloudFormation.getDate(properties.TransitionDate) : undefined));
  ret.addPropertyResult("transitionInDays", "TransitionInDays", (properties.TransitionInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.TransitionInDays) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("abortIncompleteMultipartUpload", CfnBucketAbortIncompleteMultipartUploadPropertyValidator)(properties.abortIncompleteMultipartUpload));
  errors.collect(cdk.propertyValidator("expirationDate", cdk.validateDate)(properties.expirationDate));
  errors.collect(cdk.propertyValidator("expirationInDays", cdk.validateNumber)(properties.expirationInDays));
  errors.collect(cdk.propertyValidator("expiredObjectDeleteMarker", cdk.validateBoolean)(properties.expiredObjectDeleteMarker));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("noncurrentVersionExpiration", CfnBucketNoncurrentVersionExpirationPropertyValidator)(properties.noncurrentVersionExpiration));
  errors.collect(cdk.propertyValidator("noncurrentVersionExpirationInDays", cdk.validateNumber)(properties.noncurrentVersionExpirationInDays));
  errors.collect(cdk.propertyValidator("noncurrentVersionTransition", CfnBucketNoncurrentVersionTransitionPropertyValidator)(properties.noncurrentVersionTransition));
  errors.collect(cdk.propertyValidator("noncurrentVersionTransitions", cdk.listValidator(CfnBucketNoncurrentVersionTransitionPropertyValidator))(properties.noncurrentVersionTransitions));
  errors.collect(cdk.propertyValidator("objectSizeGreaterThan", cdk.validateNumber)(properties.objectSizeGreaterThan));
  errors.collect(cdk.propertyValidator("objectSizeLessThan", cdk.validateNumber)(properties.objectSizeLessThan));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tagFilters", cdk.listValidator(CfnBucketTagFilterPropertyValidator))(properties.tagFilters));
  errors.collect(cdk.propertyValidator("transition", CfnBucketTransitionPropertyValidator)(properties.transition));
  errors.collect(cdk.propertyValidator("transitions", cdk.listValidator(CfnBucketTransitionPropertyValidator))(properties.transitions));
  return errors.wrap("supplied properties not correct for \"RuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketRulePropertyValidator(properties).assertSuccess();
  return {
    "AbortIncompleteMultipartUpload": convertCfnBucketAbortIncompleteMultipartUploadPropertyToCloudFormation(properties.abortIncompleteMultipartUpload),
    "ExpirationDate": cdk.dateToCloudFormation(properties.expirationDate),
    "ExpirationInDays": cdk.numberToCloudFormation(properties.expirationInDays),
    "ExpiredObjectDeleteMarker": cdk.booleanToCloudFormation(properties.expiredObjectDeleteMarker),
    "Id": cdk.stringToCloudFormation(properties.id),
    "NoncurrentVersionExpiration": convertCfnBucketNoncurrentVersionExpirationPropertyToCloudFormation(properties.noncurrentVersionExpiration),
    "NoncurrentVersionExpirationInDays": cdk.numberToCloudFormation(properties.noncurrentVersionExpirationInDays),
    "NoncurrentVersionTransition": convertCfnBucketNoncurrentVersionTransitionPropertyToCloudFormation(properties.noncurrentVersionTransition),
    "NoncurrentVersionTransitions": cdk.listMapper(convertCfnBucketNoncurrentVersionTransitionPropertyToCloudFormation)(properties.noncurrentVersionTransitions),
    "ObjectSizeGreaterThan": cdk.numberToCloudFormation(properties.objectSizeGreaterThan),
    "ObjectSizeLessThan": cdk.numberToCloudFormation(properties.objectSizeLessThan),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "Status": cdk.stringToCloudFormation(properties.status),
    "TagFilters": cdk.listMapper(convertCfnBucketTagFilterPropertyToCloudFormation)(properties.tagFilters),
    "Transition": convertCfnBucketTransitionPropertyToCloudFormation(properties.transition),
    "Transitions": cdk.listMapper(convertCfnBucketTransitionPropertyToCloudFormation)(properties.transitions)
  };
}

// @ts-ignore TS6133
function CfnBucketRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.RuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.RuleProperty>();
  ret.addPropertyResult("abortIncompleteMultipartUpload", "AbortIncompleteMultipartUpload", (properties.AbortIncompleteMultipartUpload != null ? CfnBucketAbortIncompleteMultipartUploadPropertyFromCloudFormation(properties.AbortIncompleteMultipartUpload) : undefined));
  ret.addPropertyResult("expirationDate", "ExpirationDate", (properties.ExpirationDate != null ? cfn_parse.FromCloudFormation.getDate(properties.ExpirationDate) : undefined));
  ret.addPropertyResult("expirationInDays", "ExpirationInDays", (properties.ExpirationInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExpirationInDays) : undefined));
  ret.addPropertyResult("expiredObjectDeleteMarker", "ExpiredObjectDeleteMarker", (properties.ExpiredObjectDeleteMarker != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExpiredObjectDeleteMarker) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("noncurrentVersionExpiration", "NoncurrentVersionExpiration", (properties.NoncurrentVersionExpiration != null ? CfnBucketNoncurrentVersionExpirationPropertyFromCloudFormation(properties.NoncurrentVersionExpiration) : undefined));
  ret.addPropertyResult("noncurrentVersionExpirationInDays", "NoncurrentVersionExpirationInDays", (properties.NoncurrentVersionExpirationInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.NoncurrentVersionExpirationInDays) : undefined));
  ret.addPropertyResult("noncurrentVersionTransition", "NoncurrentVersionTransition", (properties.NoncurrentVersionTransition != null ? CfnBucketNoncurrentVersionTransitionPropertyFromCloudFormation(properties.NoncurrentVersionTransition) : undefined));
  ret.addPropertyResult("noncurrentVersionTransitions", "NoncurrentVersionTransitions", (properties.NoncurrentVersionTransitions != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketNoncurrentVersionTransitionPropertyFromCloudFormation)(properties.NoncurrentVersionTransitions) : undefined));
  ret.addPropertyResult("objectSizeGreaterThan", "ObjectSizeGreaterThan", (properties.ObjectSizeGreaterThan != null ? cfn_parse.FromCloudFormation.getNumber(properties.ObjectSizeGreaterThan) : undefined));
  ret.addPropertyResult("objectSizeLessThan", "ObjectSizeLessThan", (properties.ObjectSizeLessThan != null ? cfn_parse.FromCloudFormation.getNumber(properties.ObjectSizeLessThan) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tagFilters", "TagFilters", (properties.TagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTagFilterPropertyFromCloudFormation)(properties.TagFilters) : undefined));
  ret.addPropertyResult("transition", "Transition", (properties.Transition != null ? CfnBucketTransitionPropertyFromCloudFormation(properties.Transition) : undefined));
  ret.addPropertyResult("transitions", "Transitions", (properties.Transitions != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTransitionPropertyFromCloudFormation)(properties.Transitions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LifecycleConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LifecycleConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketLifecycleConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnBucketRulePropertyValidator))(properties.rules));
  return errors.wrap("supplied properties not correct for \"LifecycleConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketLifecycleConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketLifecycleConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Rules": cdk.listMapper(convertCfnBucketRulePropertyToCloudFormation)(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnBucketLifecycleConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.LifecycleConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.LifecycleConfigurationProperty>();
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PartitionedPrefixProperty`
 *
 * @param properties - the TypeScript properties of a `PartitionedPrefixProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketPartitionedPrefixPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("partitionDateSource", cdk.validateString)(properties.partitionDateSource));
  return errors.wrap("supplied properties not correct for \"PartitionedPrefixProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketPartitionedPrefixPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketPartitionedPrefixPropertyValidator(properties).assertSuccess();
  return {
    "PartitionDateSource": cdk.stringToCloudFormation(properties.partitionDateSource)
  };
}

// @ts-ignore TS6133
function CfnBucketPartitionedPrefixPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.PartitionedPrefixProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.PartitionedPrefixProperty>();
  ret.addPropertyResult("partitionDateSource", "PartitionDateSource", (properties.PartitionDateSource != null ? cfn_parse.FromCloudFormation.getString(properties.PartitionDateSource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetObjectKeyFormatProperty`
 *
 * @param properties - the TypeScript properties of a `TargetObjectKeyFormatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketTargetObjectKeyFormatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("partitionedPrefix", CfnBucketPartitionedPrefixPropertyValidator)(properties.partitionedPrefix));
  errors.collect(cdk.propertyValidator("simplePrefix", cdk.validateObject)(properties.simplePrefix));
  return errors.wrap("supplied properties not correct for \"TargetObjectKeyFormatProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketTargetObjectKeyFormatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketTargetObjectKeyFormatPropertyValidator(properties).assertSuccess();
  return {
    "PartitionedPrefix": convertCfnBucketPartitionedPrefixPropertyToCloudFormation(properties.partitionedPrefix),
    "SimplePrefix": cdk.objectToCloudFormation(properties.simplePrefix)
  };
}

// @ts-ignore TS6133
function CfnBucketTargetObjectKeyFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.TargetObjectKeyFormatProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.TargetObjectKeyFormatProperty>();
  ret.addPropertyResult("partitionedPrefix", "PartitionedPrefix", (properties.PartitionedPrefix != null ? CfnBucketPartitionedPrefixPropertyFromCloudFormation(properties.PartitionedPrefix) : undefined));
  ret.addPropertyResult("simplePrefix", "SimplePrefix", (properties.SimplePrefix != null ? cfn_parse.FromCloudFormation.getAny(properties.SimplePrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketLoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationBucketName", cdk.validateString)(properties.destinationBucketName));
  errors.collect(cdk.propertyValidator("logFilePrefix", cdk.validateString)(properties.logFilePrefix));
  errors.collect(cdk.propertyValidator("targetObjectKeyFormat", CfnBucketTargetObjectKeyFormatPropertyValidator)(properties.targetObjectKeyFormat));
  return errors.wrap("supplied properties not correct for \"LoggingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketLoggingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketLoggingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DestinationBucketName": cdk.stringToCloudFormation(properties.destinationBucketName),
    "LogFilePrefix": cdk.stringToCloudFormation(properties.logFilePrefix),
    "TargetObjectKeyFormat": convertCfnBucketTargetObjectKeyFormatPropertyToCloudFormation(properties.targetObjectKeyFormat)
  };
}

// @ts-ignore TS6133
function CfnBucketLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.LoggingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.LoggingConfigurationProperty>();
  ret.addPropertyResult("destinationBucketName", "DestinationBucketName", (properties.DestinationBucketName != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationBucketName) : undefined));
  ret.addPropertyResult("logFilePrefix", "LogFilePrefix", (properties.LogFilePrefix != null ? cfn_parse.FromCloudFormation.getString(properties.LogFilePrefix) : undefined));
  ret.addPropertyResult("targetObjectKeyFormat", "TargetObjectKeyFormat", (properties.TargetObjectKeyFormat != null ? CfnBucketTargetObjectKeyFormatPropertyFromCloudFormation(properties.TargetObjectKeyFormat) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MetricsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketMetricsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessPointArn", cdk.validateString)(properties.accessPointArn));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("tagFilters", cdk.listValidator(CfnBucketTagFilterPropertyValidator))(properties.tagFilters));
  return errors.wrap("supplied properties not correct for \"MetricsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketMetricsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketMetricsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AccessPointArn": cdk.stringToCloudFormation(properties.accessPointArn),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "TagFilters": cdk.listMapper(convertCfnBucketTagFilterPropertyToCloudFormation)(properties.tagFilters)
  };
}

// @ts-ignore TS6133
function CfnBucketMetricsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.MetricsConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.MetricsConfigurationProperty>();
  ret.addPropertyResult("accessPointArn", "AccessPointArn", (properties.AccessPointArn != null ? cfn_parse.FromCloudFormation.getString(properties.AccessPointArn) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("tagFilters", "TagFilters", (properties.TagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTagFilterPropertyFromCloudFormation)(properties.TagFilters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventBridgeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketEventBridgeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventBridgeEnabled", cdk.requiredValidator)(properties.eventBridgeEnabled));
  errors.collect(cdk.propertyValidator("eventBridgeEnabled", cdk.validateBoolean)(properties.eventBridgeEnabled));
  return errors.wrap("supplied properties not correct for \"EventBridgeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketEventBridgeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketEventBridgeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EventBridgeEnabled": cdk.booleanToCloudFormation(properties.eventBridgeEnabled)
  };
}

// @ts-ignore TS6133
function CfnBucketEventBridgeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.EventBridgeConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.EventBridgeConfigurationProperty>();
  ret.addPropertyResult("eventBridgeEnabled", "EventBridgeEnabled", (properties.EventBridgeEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EventBridgeEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterRuleProperty`
 *
 * @param properties - the TypeScript properties of a `FilterRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketFilterRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"FilterRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketFilterRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketFilterRulePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBucketFilterRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.FilterRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.FilterRuleProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3KeyFilterProperty`
 *
 * @param properties - the TypeScript properties of a `S3KeyFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketS3KeyFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnBucketFilterRulePropertyValidator))(properties.rules));
  return errors.wrap("supplied properties not correct for \"S3KeyFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketS3KeyFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketS3KeyFilterPropertyValidator(properties).assertSuccess();
  return {
    "Rules": cdk.listMapper(convertCfnBucketFilterRulePropertyToCloudFormation)(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnBucketS3KeyFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.S3KeyFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.S3KeyFilterProperty>();
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketFilterRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotificationFilterProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketNotificationFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Key", cdk.requiredValidator)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3Key", CfnBucketS3KeyFilterPropertyValidator)(properties.s3Key));
  return errors.wrap("supplied properties not correct for \"NotificationFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketNotificationFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketNotificationFilterPropertyValidator(properties).assertSuccess();
  return {
    "S3Key": convertCfnBucketS3KeyFilterPropertyToCloudFormation(properties.s3Key)
  };
}

// @ts-ignore TS6133
function CfnBucketNotificationFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.NotificationFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.NotificationFilterProperty>();
  ret.addPropertyResult("s3Key", "S3Key", (properties.S3Key != null ? CfnBucketS3KeyFilterPropertyFromCloudFormation(properties.S3Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketLambdaConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("event", cdk.requiredValidator)(properties.event));
  errors.collect(cdk.propertyValidator("event", cdk.validateString)(properties.event));
  errors.collect(cdk.propertyValidator("filter", CfnBucketNotificationFilterPropertyValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("function", cdk.requiredValidator)(properties.function));
  errors.collect(cdk.propertyValidator("function", cdk.validateString)(properties.function));
  return errors.wrap("supplied properties not correct for \"LambdaConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketLambdaConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketLambdaConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Event": cdk.stringToCloudFormation(properties.event),
    "Filter": convertCfnBucketNotificationFilterPropertyToCloudFormation(properties.filter),
    "Function": cdk.stringToCloudFormation(properties.function)
  };
}

// @ts-ignore TS6133
function CfnBucketLambdaConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.LambdaConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.LambdaConfigurationProperty>();
  ret.addPropertyResult("event", "Event", (properties.Event != null ? cfn_parse.FromCloudFormation.getString(properties.Event) : undefined));
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? CfnBucketNotificationFilterPropertyFromCloudFormation(properties.Filter) : undefined));
  ret.addPropertyResult("function", "Function", (properties.Function != null ? cfn_parse.FromCloudFormation.getString(properties.Function) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QueueConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `QueueConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketQueueConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("event", cdk.requiredValidator)(properties.event));
  errors.collect(cdk.propertyValidator("event", cdk.validateString)(properties.event));
  errors.collect(cdk.propertyValidator("filter", CfnBucketNotificationFilterPropertyValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("queue", cdk.requiredValidator)(properties.queue));
  errors.collect(cdk.propertyValidator("queue", cdk.validateString)(properties.queue));
  return errors.wrap("supplied properties not correct for \"QueueConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketQueueConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketQueueConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Event": cdk.stringToCloudFormation(properties.event),
    "Filter": convertCfnBucketNotificationFilterPropertyToCloudFormation(properties.filter),
    "Queue": cdk.stringToCloudFormation(properties.queue)
  };
}

// @ts-ignore TS6133
function CfnBucketQueueConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.QueueConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.QueueConfigurationProperty>();
  ret.addPropertyResult("event", "Event", (properties.Event != null ? cfn_parse.FromCloudFormation.getString(properties.Event) : undefined));
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? CfnBucketNotificationFilterPropertyFromCloudFormation(properties.Filter) : undefined));
  ret.addPropertyResult("queue", "Queue", (properties.Queue != null ? cfn_parse.FromCloudFormation.getString(properties.Queue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TopicConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TopicConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketTopicConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("event", cdk.requiredValidator)(properties.event));
  errors.collect(cdk.propertyValidator("event", cdk.validateString)(properties.event));
  errors.collect(cdk.propertyValidator("filter", CfnBucketNotificationFilterPropertyValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("topic", cdk.requiredValidator)(properties.topic));
  errors.collect(cdk.propertyValidator("topic", cdk.validateString)(properties.topic));
  return errors.wrap("supplied properties not correct for \"TopicConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketTopicConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketTopicConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Event": cdk.stringToCloudFormation(properties.event),
    "Filter": convertCfnBucketNotificationFilterPropertyToCloudFormation(properties.filter),
    "Topic": cdk.stringToCloudFormation(properties.topic)
  };
}

// @ts-ignore TS6133
function CfnBucketTopicConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.TopicConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.TopicConfigurationProperty>();
  ret.addPropertyResult("event", "Event", (properties.Event != null ? cfn_parse.FromCloudFormation.getString(properties.Event) : undefined));
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? CfnBucketNotificationFilterPropertyFromCloudFormation(properties.Filter) : undefined));
  ret.addPropertyResult("topic", "Topic", (properties.Topic != null ? cfn_parse.FromCloudFormation.getString(properties.Topic) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotificationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketNotificationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventBridgeConfiguration", CfnBucketEventBridgeConfigurationPropertyValidator)(properties.eventBridgeConfiguration));
  errors.collect(cdk.propertyValidator("lambdaConfigurations", cdk.listValidator(CfnBucketLambdaConfigurationPropertyValidator))(properties.lambdaConfigurations));
  errors.collect(cdk.propertyValidator("queueConfigurations", cdk.listValidator(CfnBucketQueueConfigurationPropertyValidator))(properties.queueConfigurations));
  errors.collect(cdk.propertyValidator("topicConfigurations", cdk.listValidator(CfnBucketTopicConfigurationPropertyValidator))(properties.topicConfigurations));
  return errors.wrap("supplied properties not correct for \"NotificationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketNotificationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketNotificationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EventBridgeConfiguration": convertCfnBucketEventBridgeConfigurationPropertyToCloudFormation(properties.eventBridgeConfiguration),
    "LambdaConfigurations": cdk.listMapper(convertCfnBucketLambdaConfigurationPropertyToCloudFormation)(properties.lambdaConfigurations),
    "QueueConfigurations": cdk.listMapper(convertCfnBucketQueueConfigurationPropertyToCloudFormation)(properties.queueConfigurations),
    "TopicConfigurations": cdk.listMapper(convertCfnBucketTopicConfigurationPropertyToCloudFormation)(properties.topicConfigurations)
  };
}

// @ts-ignore TS6133
function CfnBucketNotificationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.NotificationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.NotificationConfigurationProperty>();
  ret.addPropertyResult("eventBridgeConfiguration", "EventBridgeConfiguration", (properties.EventBridgeConfiguration != null ? CfnBucketEventBridgeConfigurationPropertyFromCloudFormation(properties.EventBridgeConfiguration) : undefined));
  ret.addPropertyResult("lambdaConfigurations", "LambdaConfigurations", (properties.LambdaConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketLambdaConfigurationPropertyFromCloudFormation)(properties.LambdaConfigurations) : undefined));
  ret.addPropertyResult("queueConfigurations", "QueueConfigurations", (properties.QueueConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketQueueConfigurationPropertyFromCloudFormation)(properties.QueueConfigurations) : undefined));
  ret.addPropertyResult("topicConfigurations", "TopicConfigurations", (properties.TopicConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTopicConfigurationPropertyFromCloudFormation)(properties.TopicConfigurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultRetentionProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultRetentionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketDefaultRetentionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("days", cdk.validateNumber)(properties.days));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("years", cdk.validateNumber)(properties.years));
  return errors.wrap("supplied properties not correct for \"DefaultRetentionProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketDefaultRetentionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketDefaultRetentionPropertyValidator(properties).assertSuccess();
  return {
    "Days": cdk.numberToCloudFormation(properties.days),
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "Years": cdk.numberToCloudFormation(properties.years)
  };
}

// @ts-ignore TS6133
function CfnBucketDefaultRetentionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.DefaultRetentionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.DefaultRetentionProperty>();
  ret.addPropertyResult("days", "Days", (properties.Days != null ? cfn_parse.FromCloudFormation.getNumber(properties.Days) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("years", "Years", (properties.Years != null ? cfn_parse.FromCloudFormation.getNumber(properties.Years) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ObjectLockRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ObjectLockRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketObjectLockRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultRetention", CfnBucketDefaultRetentionPropertyValidator)(properties.defaultRetention));
  return errors.wrap("supplied properties not correct for \"ObjectLockRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketObjectLockRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketObjectLockRulePropertyValidator(properties).assertSuccess();
  return {
    "DefaultRetention": convertCfnBucketDefaultRetentionPropertyToCloudFormation(properties.defaultRetention)
  };
}

// @ts-ignore TS6133
function CfnBucketObjectLockRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ObjectLockRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ObjectLockRuleProperty>();
  ret.addPropertyResult("defaultRetention", "DefaultRetention", (properties.DefaultRetention != null ? CfnBucketDefaultRetentionPropertyFromCloudFormation(properties.DefaultRetention) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ObjectLockConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ObjectLockConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketObjectLockConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("objectLockEnabled", cdk.validateString)(properties.objectLockEnabled));
  errors.collect(cdk.propertyValidator("rule", CfnBucketObjectLockRulePropertyValidator)(properties.rule));
  return errors.wrap("supplied properties not correct for \"ObjectLockConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketObjectLockConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketObjectLockConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ObjectLockEnabled": cdk.stringToCloudFormation(properties.objectLockEnabled),
    "Rule": convertCfnBucketObjectLockRulePropertyToCloudFormation(properties.rule)
  };
}

// @ts-ignore TS6133
function CfnBucketObjectLockConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ObjectLockConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ObjectLockConfigurationProperty>();
  ret.addPropertyResult("objectLockEnabled", "ObjectLockEnabled", (properties.ObjectLockEnabled != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectLockEnabled) : undefined));
  ret.addPropertyResult("rule", "Rule", (properties.Rule != null ? CfnBucketObjectLockRulePropertyFromCloudFormation(properties.Rule) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OwnershipControlsRuleProperty`
 *
 * @param properties - the TypeScript properties of a `OwnershipControlsRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketOwnershipControlsRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("objectOwnership", cdk.validateString)(properties.objectOwnership));
  return errors.wrap("supplied properties not correct for \"OwnershipControlsRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketOwnershipControlsRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketOwnershipControlsRulePropertyValidator(properties).assertSuccess();
  return {
    "ObjectOwnership": cdk.stringToCloudFormation(properties.objectOwnership)
  };
}

// @ts-ignore TS6133
function CfnBucketOwnershipControlsRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.OwnershipControlsRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.OwnershipControlsRuleProperty>();
  ret.addPropertyResult("objectOwnership", "ObjectOwnership", (properties.ObjectOwnership != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectOwnership) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OwnershipControlsProperty`
 *
 * @param properties - the TypeScript properties of a `OwnershipControlsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketOwnershipControlsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnBucketOwnershipControlsRulePropertyValidator))(properties.rules));
  return errors.wrap("supplied properties not correct for \"OwnershipControlsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketOwnershipControlsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketOwnershipControlsPropertyValidator(properties).assertSuccess();
  return {
    "Rules": cdk.listMapper(convertCfnBucketOwnershipControlsRulePropertyToCloudFormation)(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnBucketOwnershipControlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.OwnershipControlsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.OwnershipControlsProperty>();
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketOwnershipControlsRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PublicAccessBlockConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PublicAccessBlockConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketPublicAccessBlockConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("blockPublicAcls", cdk.validateBoolean)(properties.blockPublicAcls));
  errors.collect(cdk.propertyValidator("blockPublicPolicy", cdk.validateBoolean)(properties.blockPublicPolicy));
  errors.collect(cdk.propertyValidator("ignorePublicAcls", cdk.validateBoolean)(properties.ignorePublicAcls));
  errors.collect(cdk.propertyValidator("restrictPublicBuckets", cdk.validateBoolean)(properties.restrictPublicBuckets));
  return errors.wrap("supplied properties not correct for \"PublicAccessBlockConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketPublicAccessBlockConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketPublicAccessBlockConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BlockPublicAcls": cdk.booleanToCloudFormation(properties.blockPublicAcls),
    "BlockPublicPolicy": cdk.booleanToCloudFormation(properties.blockPublicPolicy),
    "IgnorePublicAcls": cdk.booleanToCloudFormation(properties.ignorePublicAcls),
    "RestrictPublicBuckets": cdk.booleanToCloudFormation(properties.restrictPublicBuckets)
  };
}

// @ts-ignore TS6133
function CfnBucketPublicAccessBlockConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.PublicAccessBlockConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.PublicAccessBlockConfigurationProperty>();
  ret.addPropertyResult("blockPublicAcls", "BlockPublicAcls", (properties.BlockPublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicAcls) : undefined));
  ret.addPropertyResult("blockPublicPolicy", "BlockPublicPolicy", (properties.BlockPublicPolicy != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicPolicy) : undefined));
  ret.addPropertyResult("ignorePublicAcls", "IgnorePublicAcls", (properties.IgnorePublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IgnorePublicAcls) : undefined));
  ret.addPropertyResult("restrictPublicBuckets", "RestrictPublicBuckets", (properties.RestrictPublicBuckets != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RestrictPublicBuckets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeleteMarkerReplicationProperty`
 *
 * @param properties - the TypeScript properties of a `DeleteMarkerReplicationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketDeleteMarkerReplicationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"DeleteMarkerReplicationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketDeleteMarkerReplicationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketDeleteMarkerReplicationPropertyValidator(properties).assertSuccess();
  return {
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnBucketDeleteMarkerReplicationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.DeleteMarkerReplicationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.DeleteMarkerReplicationProperty>();
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessControlTranslationProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlTranslationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketAccessControlTranslationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("owner", cdk.requiredValidator)(properties.owner));
  errors.collect(cdk.propertyValidator("owner", cdk.validateString)(properties.owner));
  return errors.wrap("supplied properties not correct for \"AccessControlTranslationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketAccessControlTranslationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketAccessControlTranslationPropertyValidator(properties).assertSuccess();
  return {
    "Owner": cdk.stringToCloudFormation(properties.owner)
  };
}

// @ts-ignore TS6133
function CfnBucketAccessControlTranslationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.AccessControlTranslationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.AccessControlTranslationProperty>();
  ret.addPropertyResult("owner", "Owner", (properties.Owner != null ? cfn_parse.FromCloudFormation.getString(properties.Owner) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("replicaKmsKeyId", cdk.requiredValidator)(properties.replicaKmsKeyId));
  errors.collect(cdk.propertyValidator("replicaKmsKeyId", cdk.validateString)(properties.replicaKmsKeyId));
  return errors.wrap("supplied properties not correct for \"EncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ReplicaKmsKeyID": cdk.stringToCloudFormation(properties.replicaKmsKeyId)
  };
}

// @ts-ignore TS6133
function CfnBucketEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.EncryptionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.EncryptionConfigurationProperty>();
  ret.addPropertyResult("replicaKmsKeyId", "ReplicaKmsKeyID", (properties.ReplicaKmsKeyID != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicaKmsKeyID) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationTimeValueProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationTimeValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketReplicationTimeValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("minutes", cdk.requiredValidator)(properties.minutes));
  errors.collect(cdk.propertyValidator("minutes", cdk.validateNumber)(properties.minutes));
  return errors.wrap("supplied properties not correct for \"ReplicationTimeValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketReplicationTimeValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketReplicationTimeValuePropertyValidator(properties).assertSuccess();
  return {
    "Minutes": cdk.numberToCloudFormation(properties.minutes)
  };
}

// @ts-ignore TS6133
function CfnBucketReplicationTimeValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ReplicationTimeValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationTimeValueProperty>();
  ret.addPropertyResult("minutes", "Minutes", (properties.Minutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.Minutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricsProperty`
 *
 * @param properties - the TypeScript properties of a `MetricsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketMetricsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventThreshold", CfnBucketReplicationTimeValuePropertyValidator)(properties.eventThreshold));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"MetricsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketMetricsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketMetricsPropertyValidator(properties).assertSuccess();
  return {
    "EventThreshold": convertCfnBucketReplicationTimeValuePropertyToCloudFormation(properties.eventThreshold),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnBucketMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.MetricsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.MetricsProperty>();
  ret.addPropertyResult("eventThreshold", "EventThreshold", (properties.EventThreshold != null ? CfnBucketReplicationTimeValuePropertyFromCloudFormation(properties.EventThreshold) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationTimeProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationTimeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketReplicationTimePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("time", cdk.requiredValidator)(properties.time));
  errors.collect(cdk.propertyValidator("time", CfnBucketReplicationTimeValuePropertyValidator)(properties.time));
  return errors.wrap("supplied properties not correct for \"ReplicationTimeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketReplicationTimePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketReplicationTimePropertyValidator(properties).assertSuccess();
  return {
    "Status": cdk.stringToCloudFormation(properties.status),
    "Time": convertCfnBucketReplicationTimeValuePropertyToCloudFormation(properties.time)
  };
}

// @ts-ignore TS6133
function CfnBucketReplicationTimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ReplicationTimeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationTimeProperty>();
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("time", "Time", (properties.Time != null ? CfnBucketReplicationTimeValuePropertyFromCloudFormation(properties.Time) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketReplicationDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessControlTranslation", CfnBucketAccessControlTranslationPropertyValidator)(properties.accessControlTranslation));
  errors.collect(cdk.propertyValidator("account", cdk.validateString)(properties.account));
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("encryptionConfiguration", CfnBucketEncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
  errors.collect(cdk.propertyValidator("metrics", CfnBucketMetricsPropertyValidator)(properties.metrics));
  errors.collect(cdk.propertyValidator("replicationTime", CfnBucketReplicationTimePropertyValidator)(properties.replicationTime));
  errors.collect(cdk.propertyValidator("storageClass", cdk.validateString)(properties.storageClass));
  return errors.wrap("supplied properties not correct for \"ReplicationDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketReplicationDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketReplicationDestinationPropertyValidator(properties).assertSuccess();
  return {
    "AccessControlTranslation": convertCfnBucketAccessControlTranslationPropertyToCloudFormation(properties.accessControlTranslation),
    "Account": cdk.stringToCloudFormation(properties.account),
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "EncryptionConfiguration": convertCfnBucketEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
    "Metrics": convertCfnBucketMetricsPropertyToCloudFormation(properties.metrics),
    "ReplicationTime": convertCfnBucketReplicationTimePropertyToCloudFormation(properties.replicationTime),
    "StorageClass": cdk.stringToCloudFormation(properties.storageClass)
  };
}

// @ts-ignore TS6133
function CfnBucketReplicationDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ReplicationDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationDestinationProperty>();
  ret.addPropertyResult("accessControlTranslation", "AccessControlTranslation", (properties.AccessControlTranslation != null ? CfnBucketAccessControlTranslationPropertyFromCloudFormation(properties.AccessControlTranslation) : undefined));
  ret.addPropertyResult("account", "Account", (properties.Account != null ? cfn_parse.FromCloudFormation.getString(properties.Account) : undefined));
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("encryptionConfiguration", "EncryptionConfiguration", (properties.EncryptionConfiguration != null ? CfnBucketEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined));
  ret.addPropertyResult("metrics", "Metrics", (properties.Metrics != null ? CfnBucketMetricsPropertyFromCloudFormation(properties.Metrics) : undefined));
  ret.addPropertyResult("replicationTime", "ReplicationTime", (properties.ReplicationTime != null ? CfnBucketReplicationTimePropertyFromCloudFormation(properties.ReplicationTime) : undefined));
  ret.addPropertyResult("storageClass", "StorageClass", (properties.StorageClass != null ? cfn_parse.FromCloudFormation.getString(properties.StorageClass) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationRuleAndOperatorProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleAndOperatorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketReplicationRuleAndOperatorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("tagFilters", cdk.listValidator(CfnBucketTagFilterPropertyValidator))(properties.tagFilters));
  return errors.wrap("supplied properties not correct for \"ReplicationRuleAndOperatorProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketReplicationRuleAndOperatorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketReplicationRuleAndOperatorPropertyValidator(properties).assertSuccess();
  return {
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "TagFilters": cdk.listMapper(convertCfnBucketTagFilterPropertyToCloudFormation)(properties.tagFilters)
  };
}

// @ts-ignore TS6133
function CfnBucketReplicationRuleAndOperatorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ReplicationRuleAndOperatorProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationRuleAndOperatorProperty>();
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("tagFilters", "TagFilters", (properties.TagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketTagFilterPropertyFromCloudFormation)(properties.TagFilters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationRuleFilterProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketReplicationRuleFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("and", CfnBucketReplicationRuleAndOperatorPropertyValidator)(properties.and));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("tagFilter", CfnBucketTagFilterPropertyValidator)(properties.tagFilter));
  return errors.wrap("supplied properties not correct for \"ReplicationRuleFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketReplicationRuleFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketReplicationRuleFilterPropertyValidator(properties).assertSuccess();
  return {
    "And": convertCfnBucketReplicationRuleAndOperatorPropertyToCloudFormation(properties.and),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "TagFilter": convertCfnBucketTagFilterPropertyToCloudFormation(properties.tagFilter)
  };
}

// @ts-ignore TS6133
function CfnBucketReplicationRuleFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ReplicationRuleFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationRuleFilterProperty>();
  ret.addPropertyResult("and", "And", (properties.And != null ? CfnBucketReplicationRuleAndOperatorPropertyFromCloudFormation(properties.And) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("tagFilter", "TagFilter", (properties.TagFilter != null ? CfnBucketTagFilterPropertyFromCloudFormation(properties.TagFilter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicaModificationsProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicaModificationsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketReplicaModificationsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"ReplicaModificationsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketReplicaModificationsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketReplicaModificationsPropertyValidator(properties).assertSuccess();
  return {
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnBucketReplicaModificationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ReplicaModificationsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicaModificationsProperty>();
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SseKmsEncryptedObjectsProperty`
 *
 * @param properties - the TypeScript properties of a `SseKmsEncryptedObjectsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketSseKmsEncryptedObjectsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"SseKmsEncryptedObjectsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketSseKmsEncryptedObjectsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketSseKmsEncryptedObjectsPropertyValidator(properties).assertSuccess();
  return {
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnBucketSseKmsEncryptedObjectsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.SseKmsEncryptedObjectsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.SseKmsEncryptedObjectsProperty>();
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceSelectionCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `SourceSelectionCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketSourceSelectionCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("replicaModifications", CfnBucketReplicaModificationsPropertyValidator)(properties.replicaModifications));
  errors.collect(cdk.propertyValidator("sseKmsEncryptedObjects", CfnBucketSseKmsEncryptedObjectsPropertyValidator)(properties.sseKmsEncryptedObjects));
  return errors.wrap("supplied properties not correct for \"SourceSelectionCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketSourceSelectionCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketSourceSelectionCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "ReplicaModifications": convertCfnBucketReplicaModificationsPropertyToCloudFormation(properties.replicaModifications),
    "SseKmsEncryptedObjects": convertCfnBucketSseKmsEncryptedObjectsPropertyToCloudFormation(properties.sseKmsEncryptedObjects)
  };
}

// @ts-ignore TS6133
function CfnBucketSourceSelectionCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.SourceSelectionCriteriaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.SourceSelectionCriteriaProperty>();
  ret.addPropertyResult("replicaModifications", "ReplicaModifications", (properties.ReplicaModifications != null ? CfnBucketReplicaModificationsPropertyFromCloudFormation(properties.ReplicaModifications) : undefined));
  ret.addPropertyResult("sseKmsEncryptedObjects", "SseKmsEncryptedObjects", (properties.SseKmsEncryptedObjects != null ? CfnBucketSseKmsEncryptedObjectsPropertyFromCloudFormation(properties.SseKmsEncryptedObjects) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketReplicationRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deleteMarkerReplication", CfnBucketDeleteMarkerReplicationPropertyValidator)(properties.deleteMarkerReplication));
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", CfnBucketReplicationDestinationPropertyValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("filter", CfnBucketReplicationRuleFilterPropertyValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("sourceSelectionCriteria", CfnBucketSourceSelectionCriteriaPropertyValidator)(properties.sourceSelectionCriteria));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"ReplicationRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketReplicationRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketReplicationRulePropertyValidator(properties).assertSuccess();
  return {
    "DeleteMarkerReplication": convertCfnBucketDeleteMarkerReplicationPropertyToCloudFormation(properties.deleteMarkerReplication),
    "Destination": convertCfnBucketReplicationDestinationPropertyToCloudFormation(properties.destination),
    "Filter": convertCfnBucketReplicationRuleFilterPropertyToCloudFormation(properties.filter),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "SourceSelectionCriteria": convertCfnBucketSourceSelectionCriteriaPropertyToCloudFormation(properties.sourceSelectionCriteria),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnBucketReplicationRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ReplicationRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationRuleProperty>();
  ret.addPropertyResult("deleteMarkerReplication", "DeleteMarkerReplication", (properties.DeleteMarkerReplication != null ? CfnBucketDeleteMarkerReplicationPropertyFromCloudFormation(properties.DeleteMarkerReplication) : undefined));
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? CfnBucketReplicationDestinationPropertyFromCloudFormation(properties.Destination) : undefined));
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? CfnBucketReplicationRuleFilterPropertyFromCloudFormation(properties.Filter) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("sourceSelectionCriteria", "SourceSelectionCriteria", (properties.SourceSelectionCriteria != null ? CfnBucketSourceSelectionCriteriaPropertyFromCloudFormation(properties.SourceSelectionCriteria) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketReplicationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("role", cdk.requiredValidator)(properties.role));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnBucketReplicationRulePropertyValidator))(properties.rules));
  return errors.wrap("supplied properties not correct for \"ReplicationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketReplicationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketReplicationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Role": cdk.stringToCloudFormation(properties.role),
    "Rules": cdk.listMapper(convertCfnBucketReplicationRulePropertyToCloudFormation)(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnBucketReplicationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.ReplicationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.ReplicationConfigurationProperty>();
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketReplicationRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VersioningConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VersioningConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketVersioningConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"VersioningConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketVersioningConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketVersioningConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnBucketVersioningConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.VersioningConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.VersioningConfigurationProperty>();
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RedirectAllRequestsToProperty`
 *
 * @param properties - the TypeScript properties of a `RedirectAllRequestsToProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketRedirectAllRequestsToPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hostName", cdk.requiredValidator)(properties.hostName));
  errors.collect(cdk.propertyValidator("hostName", cdk.validateString)(properties.hostName));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"RedirectAllRequestsToProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketRedirectAllRequestsToPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketRedirectAllRequestsToPropertyValidator(properties).assertSuccess();
  return {
    "HostName": cdk.stringToCloudFormation(properties.hostName),
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnBucketRedirectAllRequestsToPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.RedirectAllRequestsToProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.RedirectAllRequestsToProperty>();
  ret.addPropertyResult("hostName", "HostName", (properties.HostName != null ? cfn_parse.FromCloudFormation.getString(properties.HostName) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RedirectRuleProperty`
 *
 * @param properties - the TypeScript properties of a `RedirectRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketRedirectRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hostName", cdk.validateString)(properties.hostName));
  errors.collect(cdk.propertyValidator("httpRedirectCode", cdk.validateString)(properties.httpRedirectCode));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("replaceKeyPrefixWith", cdk.validateString)(properties.replaceKeyPrefixWith));
  errors.collect(cdk.propertyValidator("replaceKeyWith", cdk.validateString)(properties.replaceKeyWith));
  return errors.wrap("supplied properties not correct for \"RedirectRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketRedirectRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketRedirectRulePropertyValidator(properties).assertSuccess();
  return {
    "HostName": cdk.stringToCloudFormation(properties.hostName),
    "HttpRedirectCode": cdk.stringToCloudFormation(properties.httpRedirectCode),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "ReplaceKeyPrefixWith": cdk.stringToCloudFormation(properties.replaceKeyPrefixWith),
    "ReplaceKeyWith": cdk.stringToCloudFormation(properties.replaceKeyWith)
  };
}

// @ts-ignore TS6133
function CfnBucketRedirectRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.RedirectRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.RedirectRuleProperty>();
  ret.addPropertyResult("hostName", "HostName", (properties.HostName != null ? cfn_parse.FromCloudFormation.getString(properties.HostName) : undefined));
  ret.addPropertyResult("httpRedirectCode", "HttpRedirectCode", (properties.HttpRedirectCode != null ? cfn_parse.FromCloudFormation.getString(properties.HttpRedirectCode) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("replaceKeyPrefixWith", "ReplaceKeyPrefixWith", (properties.ReplaceKeyPrefixWith != null ? cfn_parse.FromCloudFormation.getString(properties.ReplaceKeyPrefixWith) : undefined));
  ret.addPropertyResult("replaceKeyWith", "ReplaceKeyWith", (properties.ReplaceKeyWith != null ? cfn_parse.FromCloudFormation.getString(properties.ReplaceKeyWith) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RoutingRuleConditionProperty`
 *
 * @param properties - the TypeScript properties of a `RoutingRuleConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketRoutingRuleConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpErrorCodeReturnedEquals", cdk.validateString)(properties.httpErrorCodeReturnedEquals));
  errors.collect(cdk.propertyValidator("keyPrefixEquals", cdk.validateString)(properties.keyPrefixEquals));
  return errors.wrap("supplied properties not correct for \"RoutingRuleConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketRoutingRuleConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketRoutingRuleConditionPropertyValidator(properties).assertSuccess();
  return {
    "HttpErrorCodeReturnedEquals": cdk.stringToCloudFormation(properties.httpErrorCodeReturnedEquals),
    "KeyPrefixEquals": cdk.stringToCloudFormation(properties.keyPrefixEquals)
  };
}

// @ts-ignore TS6133
function CfnBucketRoutingRuleConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.RoutingRuleConditionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.RoutingRuleConditionProperty>();
  ret.addPropertyResult("httpErrorCodeReturnedEquals", "HttpErrorCodeReturnedEquals", (properties.HttpErrorCodeReturnedEquals != null ? cfn_parse.FromCloudFormation.getString(properties.HttpErrorCodeReturnedEquals) : undefined));
  ret.addPropertyResult("keyPrefixEquals", "KeyPrefixEquals", (properties.KeyPrefixEquals != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPrefixEquals) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RoutingRuleProperty`
 *
 * @param properties - the TypeScript properties of a `RoutingRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketRoutingRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("redirectRule", cdk.requiredValidator)(properties.redirectRule));
  errors.collect(cdk.propertyValidator("redirectRule", CfnBucketRedirectRulePropertyValidator)(properties.redirectRule));
  errors.collect(cdk.propertyValidator("routingRuleCondition", CfnBucketRoutingRuleConditionPropertyValidator)(properties.routingRuleCondition));
  return errors.wrap("supplied properties not correct for \"RoutingRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketRoutingRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketRoutingRulePropertyValidator(properties).assertSuccess();
  return {
    "RedirectRule": convertCfnBucketRedirectRulePropertyToCloudFormation(properties.redirectRule),
    "RoutingRuleCondition": convertCfnBucketRoutingRuleConditionPropertyToCloudFormation(properties.routingRuleCondition)
  };
}

// @ts-ignore TS6133
function CfnBucketRoutingRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.RoutingRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.RoutingRuleProperty>();
  ret.addPropertyResult("redirectRule", "RedirectRule", (properties.RedirectRule != null ? CfnBucketRedirectRulePropertyFromCloudFormation(properties.RedirectRule) : undefined));
  ret.addPropertyResult("routingRuleCondition", "RoutingRuleCondition", (properties.RoutingRuleCondition != null ? CfnBucketRoutingRuleConditionPropertyFromCloudFormation(properties.RoutingRuleCondition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WebsiteConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WebsiteConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketWebsiteConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("errorDocument", cdk.validateString)(properties.errorDocument));
  errors.collect(cdk.propertyValidator("indexDocument", cdk.validateString)(properties.indexDocument));
  errors.collect(cdk.propertyValidator("redirectAllRequestsTo", CfnBucketRedirectAllRequestsToPropertyValidator)(properties.redirectAllRequestsTo));
  errors.collect(cdk.propertyValidator("routingRules", cdk.listValidator(CfnBucketRoutingRulePropertyValidator))(properties.routingRules));
  return errors.wrap("supplied properties not correct for \"WebsiteConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketWebsiteConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketWebsiteConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ErrorDocument": cdk.stringToCloudFormation(properties.errorDocument),
    "IndexDocument": cdk.stringToCloudFormation(properties.indexDocument),
    "RedirectAllRequestsTo": convertCfnBucketRedirectAllRequestsToPropertyToCloudFormation(properties.redirectAllRequestsTo),
    "RoutingRules": cdk.listMapper(convertCfnBucketRoutingRulePropertyToCloudFormation)(properties.routingRules)
  };
}

// @ts-ignore TS6133
function CfnBucketWebsiteConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBucket.WebsiteConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.WebsiteConfigurationProperty>();
  ret.addPropertyResult("errorDocument", "ErrorDocument", (properties.ErrorDocument != null ? cfn_parse.FromCloudFormation.getString(properties.ErrorDocument) : undefined));
  ret.addPropertyResult("indexDocument", "IndexDocument", (properties.IndexDocument != null ? cfn_parse.FromCloudFormation.getString(properties.IndexDocument) : undefined));
  ret.addPropertyResult("redirectAllRequestsTo", "RedirectAllRequestsTo", (properties.RedirectAllRequestsTo != null ? CfnBucketRedirectAllRequestsToPropertyFromCloudFormation(properties.RedirectAllRequestsTo) : undefined));
  ret.addPropertyResult("routingRules", "RoutingRules", (properties.RoutingRules != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketRoutingRulePropertyFromCloudFormation)(properties.RoutingRules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBucketProps`
 *
 * @param properties - the TypeScript properties of a `CfnBucketProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accelerateConfiguration", CfnBucketAccelerateConfigurationPropertyValidator)(properties.accelerateConfiguration));
  errors.collect(cdk.propertyValidator("accessControl", cdk.validateString)(properties.accessControl));
  errors.collect(cdk.propertyValidator("analyticsConfigurations", cdk.listValidator(CfnBucketAnalyticsConfigurationPropertyValidator))(properties.analyticsConfigurations));
  errors.collect(cdk.propertyValidator("bucketEncryption", CfnBucketBucketEncryptionPropertyValidator)(properties.bucketEncryption));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("corsConfiguration", CfnBucketCorsConfigurationPropertyValidator)(properties.corsConfiguration));
  errors.collect(cdk.propertyValidator("intelligentTieringConfigurations", cdk.listValidator(CfnBucketIntelligentTieringConfigurationPropertyValidator))(properties.intelligentTieringConfigurations));
  errors.collect(cdk.propertyValidator("inventoryConfigurations", cdk.listValidator(CfnBucketInventoryConfigurationPropertyValidator))(properties.inventoryConfigurations));
  errors.collect(cdk.propertyValidator("lifecycleConfiguration", CfnBucketLifecycleConfigurationPropertyValidator)(properties.lifecycleConfiguration));
  errors.collect(cdk.propertyValidator("loggingConfiguration", CfnBucketLoggingConfigurationPropertyValidator)(properties.loggingConfiguration));
  errors.collect(cdk.propertyValidator("metricsConfigurations", cdk.listValidator(CfnBucketMetricsConfigurationPropertyValidator))(properties.metricsConfigurations));
  errors.collect(cdk.propertyValidator("notificationConfiguration", CfnBucketNotificationConfigurationPropertyValidator)(properties.notificationConfiguration));
  errors.collect(cdk.propertyValidator("objectLockConfiguration", CfnBucketObjectLockConfigurationPropertyValidator)(properties.objectLockConfiguration));
  errors.collect(cdk.propertyValidator("objectLockEnabled", cdk.validateBoolean)(properties.objectLockEnabled));
  errors.collect(cdk.propertyValidator("ownershipControls", CfnBucketOwnershipControlsPropertyValidator)(properties.ownershipControls));
  errors.collect(cdk.propertyValidator("publicAccessBlockConfiguration", CfnBucketPublicAccessBlockConfigurationPropertyValidator)(properties.publicAccessBlockConfiguration));
  errors.collect(cdk.propertyValidator("replicationConfiguration", CfnBucketReplicationConfigurationPropertyValidator)(properties.replicationConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("versioningConfiguration", CfnBucketVersioningConfigurationPropertyValidator)(properties.versioningConfiguration));
  errors.collect(cdk.propertyValidator("websiteConfiguration", CfnBucketWebsiteConfigurationPropertyValidator)(properties.websiteConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnBucketProps\"");
}

// @ts-ignore TS6133
function convertCfnBucketPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketPropsValidator(properties).assertSuccess();
  return {
    "AccelerateConfiguration": convertCfnBucketAccelerateConfigurationPropertyToCloudFormation(properties.accelerateConfiguration),
    "AccessControl": cdk.stringToCloudFormation(properties.accessControl),
    "AnalyticsConfigurations": cdk.listMapper(convertCfnBucketAnalyticsConfigurationPropertyToCloudFormation)(properties.analyticsConfigurations),
    "BucketEncryption": convertCfnBucketBucketEncryptionPropertyToCloudFormation(properties.bucketEncryption),
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "CorsConfiguration": convertCfnBucketCorsConfigurationPropertyToCloudFormation(properties.corsConfiguration),
    "IntelligentTieringConfigurations": cdk.listMapper(convertCfnBucketIntelligentTieringConfigurationPropertyToCloudFormation)(properties.intelligentTieringConfigurations),
    "InventoryConfigurations": cdk.listMapper(convertCfnBucketInventoryConfigurationPropertyToCloudFormation)(properties.inventoryConfigurations),
    "LifecycleConfiguration": convertCfnBucketLifecycleConfigurationPropertyToCloudFormation(properties.lifecycleConfiguration),
    "LoggingConfiguration": convertCfnBucketLoggingConfigurationPropertyToCloudFormation(properties.loggingConfiguration),
    "MetricsConfigurations": cdk.listMapper(convertCfnBucketMetricsConfigurationPropertyToCloudFormation)(properties.metricsConfigurations),
    "NotificationConfiguration": convertCfnBucketNotificationConfigurationPropertyToCloudFormation(properties.notificationConfiguration),
    "ObjectLockConfiguration": convertCfnBucketObjectLockConfigurationPropertyToCloudFormation(properties.objectLockConfiguration),
    "ObjectLockEnabled": cdk.booleanToCloudFormation(properties.objectLockEnabled),
    "OwnershipControls": convertCfnBucketOwnershipControlsPropertyToCloudFormation(properties.ownershipControls),
    "PublicAccessBlockConfiguration": convertCfnBucketPublicAccessBlockConfigurationPropertyToCloudFormation(properties.publicAccessBlockConfiguration),
    "ReplicationConfiguration": convertCfnBucketReplicationConfigurationPropertyToCloudFormation(properties.replicationConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VersioningConfiguration": convertCfnBucketVersioningConfigurationPropertyToCloudFormation(properties.versioningConfiguration),
    "WebsiteConfiguration": convertCfnBucketWebsiteConfigurationPropertyToCloudFormation(properties.websiteConfiguration)
  };
}

// @ts-ignore TS6133
function CfnBucketPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucketProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucketProps>();
  ret.addPropertyResult("accelerateConfiguration", "AccelerateConfiguration", (properties.AccelerateConfiguration != null ? CfnBucketAccelerateConfigurationPropertyFromCloudFormation(properties.AccelerateConfiguration) : undefined));
  ret.addPropertyResult("accessControl", "AccessControl", (properties.AccessControl != null ? cfn_parse.FromCloudFormation.getString(properties.AccessControl) : undefined));
  ret.addPropertyResult("analyticsConfigurations", "AnalyticsConfigurations", (properties.AnalyticsConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketAnalyticsConfigurationPropertyFromCloudFormation)(properties.AnalyticsConfigurations) : undefined));
  ret.addPropertyResult("bucketEncryption", "BucketEncryption", (properties.BucketEncryption != null ? CfnBucketBucketEncryptionPropertyFromCloudFormation(properties.BucketEncryption) : undefined));
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("corsConfiguration", "CorsConfiguration", (properties.CorsConfiguration != null ? CfnBucketCorsConfigurationPropertyFromCloudFormation(properties.CorsConfiguration) : undefined));
  ret.addPropertyResult("intelligentTieringConfigurations", "IntelligentTieringConfigurations", (properties.IntelligentTieringConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketIntelligentTieringConfigurationPropertyFromCloudFormation)(properties.IntelligentTieringConfigurations) : undefined));
  ret.addPropertyResult("inventoryConfigurations", "InventoryConfigurations", (properties.InventoryConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketInventoryConfigurationPropertyFromCloudFormation)(properties.InventoryConfigurations) : undefined));
  ret.addPropertyResult("lifecycleConfiguration", "LifecycleConfiguration", (properties.LifecycleConfiguration != null ? CfnBucketLifecycleConfigurationPropertyFromCloudFormation(properties.LifecycleConfiguration) : undefined));
  ret.addPropertyResult("loggingConfiguration", "LoggingConfiguration", (properties.LoggingConfiguration != null ? CfnBucketLoggingConfigurationPropertyFromCloudFormation(properties.LoggingConfiguration) : undefined));
  ret.addPropertyResult("metricsConfigurations", "MetricsConfigurations", (properties.MetricsConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketMetricsConfigurationPropertyFromCloudFormation)(properties.MetricsConfigurations) : undefined));
  ret.addPropertyResult("notificationConfiguration", "NotificationConfiguration", (properties.NotificationConfiguration != null ? CfnBucketNotificationConfigurationPropertyFromCloudFormation(properties.NotificationConfiguration) : undefined));
  ret.addPropertyResult("objectLockConfiguration", "ObjectLockConfiguration", (properties.ObjectLockConfiguration != null ? CfnBucketObjectLockConfigurationPropertyFromCloudFormation(properties.ObjectLockConfiguration) : undefined));
  ret.addPropertyResult("objectLockEnabled", "ObjectLockEnabled", (properties.ObjectLockEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ObjectLockEnabled) : undefined));
  ret.addPropertyResult("ownershipControls", "OwnershipControls", (properties.OwnershipControls != null ? CfnBucketOwnershipControlsPropertyFromCloudFormation(properties.OwnershipControls) : undefined));
  ret.addPropertyResult("publicAccessBlockConfiguration", "PublicAccessBlockConfiguration", (properties.PublicAccessBlockConfiguration != null ? CfnBucketPublicAccessBlockConfigurationPropertyFromCloudFormation(properties.PublicAccessBlockConfiguration) : undefined));
  ret.addPropertyResult("replicationConfiguration", "ReplicationConfiguration", (properties.ReplicationConfiguration != null ? CfnBucketReplicationConfigurationPropertyFromCloudFormation(properties.ReplicationConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("versioningConfiguration", "VersioningConfiguration", (properties.VersioningConfiguration != null ? CfnBucketVersioningConfigurationPropertyFromCloudFormation(properties.VersioningConfiguration) : undefined));
  ret.addPropertyResult("websiteConfiguration", "WebsiteConfiguration", (properties.WebsiteConfiguration != null ? CfnBucketWebsiteConfigurationPropertyFromCloudFormation(properties.WebsiteConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Applies an Amazon S3 bucket policy to an Amazon S3 bucket.
 *
 * If you are using an identity other than the root user of the AWS account that owns the bucket, the calling identity must have the `PutBucketPolicy` permissions on the specified bucket and belong to the bucket owner's account in order to use this operation.
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucketpolicy.html
 */
export class CfnBucketPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3::BucketPolicy";

  /**
   * Build a CfnBucketPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBucketPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBucketPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBucketPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the Amazon S3 bucket to which the policy applies.
   */
  public bucket: string;

  /**
   * A policy document containing permissions to add to the specified bucket.
   */
  public policyDocument: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBucketPolicyProps) {
    super(scope, id, {
      "type": CfnBucketPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "bucket", this);
    cdk.requireProperty(props, "policyDocument", this);

    this.bucket = props.bucket;
    this.policyDocument = props.policyDocument;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bucket": this.bucket,
      "policyDocument": this.policyDocument
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBucketPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBucketPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnBucketPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucketpolicy.html
 */
export interface CfnBucketPolicyProps {
  /**
   * The name of the Amazon S3 bucket to which the policy applies.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucketpolicy.html#cfn-s3-bucketpolicy-bucket
   */
  readonly bucket: string;

  /**
   * A policy document containing permissions to add to the specified bucket.
   *
   * In IAM, you must provide policy documents in JSON format. However, in CloudFormation you can provide the policy in JSON or YAML format because CloudFormation converts YAML to JSON before submitting it to IAM. For more information, see the AWS::IAM::Policy [PolicyDocument](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument) resource description in this guide and [Access Policy Language Overview](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-policy-language-overview.html) in the *Amazon S3 User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucketpolicy.html#cfn-s3-bucketpolicy-policydocument
   */
  readonly policyDocument: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnBucketPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnBucketPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  return errors.wrap("supplied properties not correct for \"CfnBucketPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnBucketPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketPolicyPropsValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument)
  };
}

// @ts-ignore TS6133
function CfnBucketPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucketPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucketPolicyProps>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyDocument) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::S3::MultiRegionAccessPoint` resource creates an Amazon S3 Multi-Region Access Point.
 *
 * To learn more about Multi-Region Access Points, see [Multi-Region Access Points in Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiRegionAccessPoints.html) in the in the *Amazon S3 User Guide* .
 *
 * @cloudformationResource AWS::S3::MultiRegionAccessPoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html
 */
export class CfnMultiRegionAccessPoint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3::MultiRegionAccessPoint";

  /**
   * Build a CfnMultiRegionAccessPoint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMultiRegionAccessPoint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMultiRegionAccessPointPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMultiRegionAccessPoint(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The alias for the Multi-Region Access Point. For more information about the distinction between the name and the alias of an Multi-Region Access Point, see [Managing Multi-Region Access Points](https://docs.aws.amazon.com/AmazonS3/latest/userguide/CreatingMultiRegionAccessPoints.html#multi-region-access-point-naming) in the *Amazon S3 User Guide* .
   *
   * @cloudformationAttribute Alias
   */
  public readonly attrAlias: string;

  /**
   * The timestamp of when the Multi-Region Access Point is created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The name of the Multi-Region Access Point.
   */
  public name?: string;

  /**
   * The PublicAccessBlock configuration that you want to apply to this Multi-Region Access Point.
   */
  public publicAccessBlockConfiguration?: cdk.IResolvable | CfnMultiRegionAccessPoint.PublicAccessBlockConfigurationProperty;

  /**
   * A collection of the Regions and buckets associated with the Multi-Region Access Point.
   */
  public regions: Array<cdk.IResolvable | CfnMultiRegionAccessPoint.RegionProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMultiRegionAccessPointProps) {
    super(scope, id, {
      "type": CfnMultiRegionAccessPoint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "regions", this);

    this.attrAlias = cdk.Token.asString(this.getAtt("Alias", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.publicAccessBlockConfiguration = props.publicAccessBlockConfiguration;
    this.regions = props.regions;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "publicAccessBlockConfiguration": this.publicAccessBlockConfiguration,
      "regions": this.regions
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMultiRegionAccessPoint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMultiRegionAccessPointPropsToCloudFormation(props);
  }
}

export namespace CfnMultiRegionAccessPoint {
  /**
   * The PublicAccessBlock configuration that you want to apply to this Amazon S3 Multi-Region Access Point.
   *
   * You can enable the configuration options in any combination. For more information about when Amazon S3 considers an object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html
   */
  export interface PublicAccessBlockConfigurationProperty {
    /**
     * Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket.
     *
     * Setting this element to `TRUE` causes the following behavior:
     *
     * - PUT Bucket ACL and PUT Object ACL calls fail if the specified ACL is public.
     * - PUT Object calls fail if the request includes a public ACL.
     * - PUT Bucket calls fail if the request includes a public ACL.
     *
     * Enabling this setting doesn't affect existing policies or ACLs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-blockpublicacls
     */
    readonly blockPublicAcls?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should block public bucket policies for this bucket.
     *
     * Setting this element to `TRUE` causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access.
     *
     * Enabling this setting doesn't affect existing bucket policies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-blockpublicpolicy
     */
    readonly blockPublicPolicy?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket.
     *
     * Setting this element to `TRUE` causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket.
     *
     * Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-ignorepublicacls
     */
    readonly ignorePublicAcls?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should restrict public bucket policies for this bucket.
     *
     * Setting this element to `TRUE` restricts access to this bucket to only AWS service principals and authorized users within this account if the bucket has a public policy.
     *
     * Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-publicaccessblockconfiguration.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration-restrictpublicbuckets
     */
    readonly restrictPublicBuckets?: boolean | cdk.IResolvable;
  }

  /**
   * A bucket associated with a specific Region when creating Multi-Region Access Points.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-region.html
   */
  export interface RegionProperty {
    /**
     * The name of the associated bucket for the Region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-region.html#cfn-s3-multiregionaccesspoint-region-bucket
     */
    readonly bucket: string;

    /**
     * The AWS account ID that owns the Amazon S3 bucket that's associated with this Multi-Region Access Point.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspoint-region.html#cfn-s3-multiregionaccesspoint-region-bucketaccountid
     */
    readonly bucketAccountId?: string;
  }
}

/**
 * Properties for defining a `CfnMultiRegionAccessPoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html
 */
export interface CfnMultiRegionAccessPointProps {
  /**
   * The name of the Multi-Region Access Point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-name
   */
  readonly name?: string;

  /**
   * The PublicAccessBlock configuration that you want to apply to this Multi-Region Access Point.
   *
   * You can enable the configuration options in any combination. For more information about when Amazon S3 considers an object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-publicaccessblockconfiguration
   */
  readonly publicAccessBlockConfiguration?: cdk.IResolvable | CfnMultiRegionAccessPoint.PublicAccessBlockConfigurationProperty;

  /**
   * A collection of the Regions and buckets associated with the Multi-Region Access Point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspoint.html#cfn-s3-multiregionaccesspoint-regions
   */
  readonly regions: Array<cdk.IResolvable | CfnMultiRegionAccessPoint.RegionProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `PublicAccessBlockConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PublicAccessBlockConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMultiRegionAccessPointPublicAccessBlockConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("blockPublicAcls", cdk.validateBoolean)(properties.blockPublicAcls));
  errors.collect(cdk.propertyValidator("blockPublicPolicy", cdk.validateBoolean)(properties.blockPublicPolicy));
  errors.collect(cdk.propertyValidator("ignorePublicAcls", cdk.validateBoolean)(properties.ignorePublicAcls));
  errors.collect(cdk.propertyValidator("restrictPublicBuckets", cdk.validateBoolean)(properties.restrictPublicBuckets));
  return errors.wrap("supplied properties not correct for \"PublicAccessBlockConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMultiRegionAccessPointPublicAccessBlockConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMultiRegionAccessPointPublicAccessBlockConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BlockPublicAcls": cdk.booleanToCloudFormation(properties.blockPublicAcls),
    "BlockPublicPolicy": cdk.booleanToCloudFormation(properties.blockPublicPolicy),
    "IgnorePublicAcls": cdk.booleanToCloudFormation(properties.ignorePublicAcls),
    "RestrictPublicBuckets": cdk.booleanToCloudFormation(properties.restrictPublicBuckets)
  };
}

// @ts-ignore TS6133
function CfnMultiRegionAccessPointPublicAccessBlockConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMultiRegionAccessPoint.PublicAccessBlockConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMultiRegionAccessPoint.PublicAccessBlockConfigurationProperty>();
  ret.addPropertyResult("blockPublicAcls", "BlockPublicAcls", (properties.BlockPublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicAcls) : undefined));
  ret.addPropertyResult("blockPublicPolicy", "BlockPublicPolicy", (properties.BlockPublicPolicy != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BlockPublicPolicy) : undefined));
  ret.addPropertyResult("ignorePublicAcls", "IgnorePublicAcls", (properties.IgnorePublicAcls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IgnorePublicAcls) : undefined));
  ret.addPropertyResult("restrictPublicBuckets", "RestrictPublicBuckets", (properties.RestrictPublicBuckets != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RestrictPublicBuckets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RegionProperty`
 *
 * @param properties - the TypeScript properties of a `RegionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMultiRegionAccessPointRegionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucketAccountId", cdk.validateString)(properties.bucketAccountId));
  return errors.wrap("supplied properties not correct for \"RegionProperty\"");
}

// @ts-ignore TS6133
function convertCfnMultiRegionAccessPointRegionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMultiRegionAccessPointRegionPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "BucketAccountId": cdk.stringToCloudFormation(properties.bucketAccountId)
  };
}

// @ts-ignore TS6133
function CfnMultiRegionAccessPointRegionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMultiRegionAccessPoint.RegionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMultiRegionAccessPoint.RegionProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("bucketAccountId", "BucketAccountId", (properties.BucketAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.BucketAccountId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMultiRegionAccessPointProps`
 *
 * @param properties - the TypeScript properties of a `CfnMultiRegionAccessPointProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMultiRegionAccessPointPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("publicAccessBlockConfiguration", CfnMultiRegionAccessPointPublicAccessBlockConfigurationPropertyValidator)(properties.publicAccessBlockConfiguration));
  errors.collect(cdk.propertyValidator("regions", cdk.requiredValidator)(properties.regions));
  errors.collect(cdk.propertyValidator("regions", cdk.listValidator(CfnMultiRegionAccessPointRegionPropertyValidator))(properties.regions));
  return errors.wrap("supplied properties not correct for \"CfnMultiRegionAccessPointProps\"");
}

// @ts-ignore TS6133
function convertCfnMultiRegionAccessPointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMultiRegionAccessPointPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "PublicAccessBlockConfiguration": convertCfnMultiRegionAccessPointPublicAccessBlockConfigurationPropertyToCloudFormation(properties.publicAccessBlockConfiguration),
    "Regions": cdk.listMapper(convertCfnMultiRegionAccessPointRegionPropertyToCloudFormation)(properties.regions)
  };
}

// @ts-ignore TS6133
function CfnMultiRegionAccessPointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMultiRegionAccessPointProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMultiRegionAccessPointProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("publicAccessBlockConfiguration", "PublicAccessBlockConfiguration", (properties.PublicAccessBlockConfiguration != null ? CfnMultiRegionAccessPointPublicAccessBlockConfigurationPropertyFromCloudFormation(properties.PublicAccessBlockConfiguration) : undefined));
  ret.addPropertyResult("regions", "Regions", (properties.Regions != null ? cfn_parse.FromCloudFormation.getArray(CfnMultiRegionAccessPointRegionPropertyFromCloudFormation)(properties.Regions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Applies an Amazon S3 access policy to an Amazon S3 Multi-Region Access Point.
 *
 * It is not possible to delete an access policy for a Multi-Region Access Point from the CloudFormation template. When you attempt to delete the policy, CloudFormation updates the policy using `DeletionPolicy:Retain` and `UpdateReplacePolicy:Retain` . CloudFormation updates the policy to only allow access to the account that created the bucket.
 *
 * @cloudformationResource AWS::S3::MultiRegionAccessPointPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html
 */
export class CfnMultiRegionAccessPointPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3::MultiRegionAccessPointPolicy";

  /**
   * Build a CfnMultiRegionAccessPointPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMultiRegionAccessPointPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMultiRegionAccessPointPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMultiRegionAccessPointPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Policy Status associated with this Multi Region Access Point
   *
   * @cloudformationAttribute PolicyStatus
   */
  public readonly attrPolicyStatus: cdk.IResolvable;

  /**
   * Specifies whether the policy is public or not.
   *
   * @cloudformationAttribute PolicyStatus.IsPublic
   */
  public readonly attrPolicyStatusIsPublic: string;

  /**
   * The name of the Multi-Region Access Point.
   */
  public mrapName: string;

  /**
   * The access policy associated with the Multi-Region Access Point.
   */
  public policy: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMultiRegionAccessPointPolicyProps) {
    super(scope, id, {
      "type": CfnMultiRegionAccessPointPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "mrapName", this);
    cdk.requireProperty(props, "policy", this);

    this.attrPolicyStatus = this.getAtt("PolicyStatus");
    this.attrPolicyStatusIsPublic = cdk.Token.asString(this.getAtt("PolicyStatus.IsPublic", cdk.ResolutionTypeHint.STRING));
    this.mrapName = props.mrapName;
    this.policy = props.policy;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "mrapName": this.mrapName,
      "policy": this.policy
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMultiRegionAccessPointPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMultiRegionAccessPointPolicyPropsToCloudFormation(props);
  }
}

export namespace CfnMultiRegionAccessPointPolicy {
  /**
   * The container element for a bucket's policy status.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspointpolicy-policystatus.html
   */
  export interface PolicyStatusProperty {
    /**
     * The policy status for this bucket.
     *
     * `TRUE` indicates that this bucket is public. `FALSE` indicates that the bucket is not public.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-multiregionaccesspointpolicy-policystatus.html#cfn-s3-multiregionaccesspointpolicy-policystatus-ispublic
     */
    readonly isPublic: string;
  }
}

/**
 * Properties for defining a `CfnMultiRegionAccessPointPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html
 */
export interface CfnMultiRegionAccessPointPolicyProps {
  /**
   * The name of the Multi-Region Access Point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html#cfn-s3-multiregionaccesspointpolicy-mrapname
   */
  readonly mrapName: string;

  /**
   * The access policy associated with the Multi-Region Access Point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-multiregionaccesspointpolicy.html#cfn-s3-multiregionaccesspointpolicy-policy
   */
  readonly policy: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `PolicyStatusProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyStatusProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMultiRegionAccessPointPolicyPolicyStatusPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isPublic", cdk.requiredValidator)(properties.isPublic));
  errors.collect(cdk.propertyValidator("isPublic", cdk.validateString)(properties.isPublic));
  return errors.wrap("supplied properties not correct for \"PolicyStatusProperty\"");
}

// @ts-ignore TS6133
function convertCfnMultiRegionAccessPointPolicyPolicyStatusPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMultiRegionAccessPointPolicyPolicyStatusPropertyValidator(properties).assertSuccess();
  return {
    "IsPublic": cdk.stringToCloudFormation(properties.isPublic)
  };
}

// @ts-ignore TS6133
function CfnMultiRegionAccessPointPolicyPolicyStatusPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMultiRegionAccessPointPolicy.PolicyStatusProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMultiRegionAccessPointPolicy.PolicyStatusProperty>();
  ret.addPropertyResult("isPublic", "IsPublic", (properties.IsPublic != null ? cfn_parse.FromCloudFormation.getString(properties.IsPublic) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMultiRegionAccessPointPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnMultiRegionAccessPointPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMultiRegionAccessPointPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mrapName", cdk.requiredValidator)(properties.mrapName));
  errors.collect(cdk.propertyValidator("mrapName", cdk.validateString)(properties.mrapName));
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  return errors.wrap("supplied properties not correct for \"CfnMultiRegionAccessPointPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnMultiRegionAccessPointPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMultiRegionAccessPointPolicyPropsValidator(properties).assertSuccess();
  return {
    "MrapName": cdk.stringToCloudFormation(properties.mrapName),
    "Policy": cdk.objectToCloudFormation(properties.policy)
  };
}

// @ts-ignore TS6133
function CfnMultiRegionAccessPointPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMultiRegionAccessPointPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMultiRegionAccessPointPolicyProps>();
  ret.addPropertyResult("mrapName", "MrapName", (properties.MrapName != null ? cfn_parse.FromCloudFormation.getString(properties.MrapName) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::S3::StorageLens resource creates an Amazon S3 Storage Lens configuration.
 *
 * @cloudformationResource AWS::S3::StorageLens
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html
 */
export class CfnStorageLens extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3::StorageLens";

  /**
   * Build a CfnStorageLens from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStorageLens {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStorageLensPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStorageLens(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN for the Amazon S3 Storage Lens configuration.
   *
   * @cloudformationAttribute StorageLensConfiguration.StorageLensArn
   */
  public readonly attrStorageLensConfigurationStorageLensArn: string;

  /**
   * This resource contains the details Amazon S3 Storage Lens configuration.
   */
  public storageLensConfiguration: cdk.IResolvable | CfnStorageLens.StorageLensConfigurationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A set of tags (key–value pairs) to associate with the Storage Lens configuration.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStorageLensProps) {
    super(scope, id, {
      "type": CfnStorageLens.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "storageLensConfiguration", this);

    this.attrStorageLensConfigurationStorageLensArn = cdk.Token.asString(this.getAtt("StorageLensConfiguration.StorageLensArn", cdk.ResolutionTypeHint.STRING));
    this.storageLensConfiguration = props.storageLensConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::S3::StorageLens", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "storageLensConfiguration": this.storageLensConfiguration,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStorageLens.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStorageLensPropsToCloudFormation(props);
  }
}

export namespace CfnStorageLens {
  /**
   * This is the property of the Amazon S3 Storage Lens configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html
   */
  export interface StorageLensConfigurationProperty {
    /**
     * This property contains the details of the account-level metrics for Amazon S3 Storage Lens configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-accountlevel
     */
    readonly accountLevel: CfnStorageLens.AccountLevelProperty | cdk.IResolvable;

    /**
     * This property contains the details of the AWS Organization for the S3 Storage Lens configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-awsorg
     */
    readonly awsOrg?: CfnStorageLens.AwsOrgProperty | cdk.IResolvable;

    /**
     * This property contains the details of this S3 Storage Lens configuration's metrics export.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-dataexport
     */
    readonly dataExport?: CfnStorageLens.DataExportProperty | cdk.IResolvable;

    /**
     * This property contains the details of the bucket and or Regions excluded for Amazon S3 Storage Lens configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-exclude
     */
    readonly exclude?: CfnStorageLens.BucketsAndRegionsProperty | cdk.IResolvable;

    /**
     * This property contains the details of the ID of the S3 Storage Lens configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-id
     */
    readonly id: string;

    /**
     * This property contains the details of the bucket and or Regions included for Amazon S3 Storage Lens configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-include
     */
    readonly include?: CfnStorageLens.BucketsAndRegionsProperty | cdk.IResolvable;

    /**
     * This property contains the details of whether the Amazon S3 Storage Lens configuration is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-isenabled
     */
    readonly isEnabled: boolean | cdk.IResolvable;

    /**
     * This property contains the details of the ARN of the S3 Storage Lens configuration.
     *
     * This property is read-only.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensconfiguration.html#cfn-s3-storagelens-storagelensconfiguration-storagelensarn
     */
    readonly storageLensArn?: string;
  }

  /**
   * This resource contains the details of the account-level metrics for Amazon S3 Storage Lens.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html
   */
  export interface AccountLevelProperty {
    /**
     * This property contains the details of account-level activity metrics for S3 Storage Lens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-activitymetrics
     */
    readonly activityMetrics?: CfnStorageLens.ActivityMetricsProperty | cdk.IResolvable;

    /**
     * This property contains the details of account-level advanced cost optimization metrics for S3 Storage Lens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-advancedcostoptimizationmetrics
     */
    readonly advancedCostOptimizationMetrics?: CfnStorageLens.AdvancedCostOptimizationMetricsProperty | cdk.IResolvable;

    /**
     * This property contains the details of account-level advanced data protection metrics for S3 Storage Lens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-advanceddataprotectionmetrics
     */
    readonly advancedDataProtectionMetrics?: CfnStorageLens.AdvancedDataProtectionMetricsProperty | cdk.IResolvable;

    /**
     * This property contains the details of the account-level bucket-level configurations for Amazon S3 Storage Lens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-bucketlevel
     */
    readonly bucketLevel: CfnStorageLens.BucketLevelProperty | cdk.IResolvable;

    /**
     * This property contains the details of account-level detailed status code metrics for S3 Storage Lens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-detailedstatuscodesmetrics
     */
    readonly detailedStatusCodesMetrics?: CfnStorageLens.DetailedStatusCodesMetricsProperty | cdk.IResolvable;

    /**
     * This property determines the scope of Storage Lens group data that is displayed in the Storage Lens dashboard.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-accountlevel.html#cfn-s3-storagelens-accountlevel-storagelensgrouplevel
     */
    readonly storageLensGroupLevel?: cdk.IResolvable | CfnStorageLens.StorageLensGroupLevelProperty;
  }

  /**
   * This resource enables Amazon S3 Storage Lens advanced data protection metrics.
   *
   * Advanced data protection metrics provide insights that you can use to perform audits and protect your data, for example replication rule counts within and across Regions.
   *
   * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advanceddataprotectionmetrics.html
   */
  export interface AdvancedDataProtectionMetricsProperty {
    /**
     * Indicates whether advanced data protection metrics are enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advanceddataprotectionmetrics.html#cfn-s3-storagelens-advanceddataprotectionmetrics-isenabled
     */
    readonly isEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * This resource enables Amazon S3 Storage Lens activity metrics.
   *
   * Activity metrics show details about how your storage is requested, such as requests (for example, All requests, Get requests, Put requests), bytes uploaded or downloaded, and errors.
   *
   * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-activitymetrics.html
   */
  export interface ActivityMetricsProperty {
    /**
     * A property that indicates whether the activity metrics is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-activitymetrics.html#cfn-s3-storagelens-activitymetrics-isenabled
     */
    readonly isEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * A property for the bucket-level storage metrics for Amazon S3 Storage Lens.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html
   */
  export interface BucketLevelProperty {
    /**
     * A property for bucket-level activity metrics for S3 Storage Lens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-activitymetrics
     */
    readonly activityMetrics?: CfnStorageLens.ActivityMetricsProperty | cdk.IResolvable;

    /**
     * A property for bucket-level advanced cost optimization metrics for S3 Storage Lens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-advancedcostoptimizationmetrics
     */
    readonly advancedCostOptimizationMetrics?: CfnStorageLens.AdvancedCostOptimizationMetricsProperty | cdk.IResolvable;

    /**
     * A property for bucket-level advanced data protection metrics for S3 Storage Lens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-advanceddataprotectionmetrics
     */
    readonly advancedDataProtectionMetrics?: CfnStorageLens.AdvancedDataProtectionMetricsProperty | cdk.IResolvable;

    /**
     * A property for bucket-level detailed status code metrics for S3 Storage Lens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-detailedstatuscodesmetrics
     */
    readonly detailedStatusCodesMetrics?: CfnStorageLens.DetailedStatusCodesMetricsProperty | cdk.IResolvable;

    /**
     * A property for bucket-level prefix-level storage metrics for S3 Storage Lens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketlevel.html#cfn-s3-storagelens-bucketlevel-prefixlevel
     */
    readonly prefixLevel?: cdk.IResolvable | CfnStorageLens.PrefixLevelProperty;
  }

  /**
   * This resource contains the details of the prefix-level of the Amazon S3 Storage Lens.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevel.html
   */
  export interface PrefixLevelProperty {
    /**
     * A property for the prefix-level storage metrics for Amazon S3 Storage Lens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevel.html#cfn-s3-storagelens-prefixlevel-storagemetrics
     */
    readonly storageMetrics: cdk.IResolvable | CfnStorageLens.PrefixLevelStorageMetricsProperty;
  }

  /**
   * This resource contains the details of the prefix-level storage metrics for Amazon S3 Storage Lens.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevelstoragemetrics.html
   */
  export interface PrefixLevelStorageMetricsProperty {
    /**
     * This property identifies whether the details of the prefix-level storage metrics for S3 Storage Lens are enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevelstoragemetrics.html#cfn-s3-storagelens-prefixlevelstoragemetrics-isenabled
     */
    readonly isEnabled?: boolean | cdk.IResolvable;

    /**
     * This property identifies whether the details of the prefix-level storage metrics for S3 Storage Lens are enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-prefixlevelstoragemetrics.html#cfn-s3-storagelens-prefixlevelstoragemetrics-selectioncriteria
     */
    readonly selectionCriteria?: cdk.IResolvable | CfnStorageLens.SelectionCriteriaProperty;
  }

  /**
   * This resource contains the details of the Amazon S3 Storage Lens selection criteria.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html
   */
  export interface SelectionCriteriaProperty {
    /**
     * This property contains the details of the S3 Storage Lens delimiter being used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html#cfn-s3-storagelens-selectioncriteria-delimiter
     */
    readonly delimiter?: string;

    /**
     * This property contains the details of the max depth that S3 Storage Lens will collect metrics up to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html#cfn-s3-storagelens-selectioncriteria-maxdepth
     */
    readonly maxDepth?: number;

    /**
     * This property contains the details of the minimum storage bytes percentage threshold that S3 Storage Lens will collect metrics up to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-selectioncriteria.html#cfn-s3-storagelens-selectioncriteria-minstoragebytespercentage
     */
    readonly minStorageBytesPercentage?: number;
  }

  /**
   * This resource enables Amazon S3 Storage Lens advanced cost optimization metrics.
   *
   * Advanced cost optimization metrics provide insights that you can use to manage and optimize your storage costs, for example, lifecycle rule counts for transitions, expirations, and incomplete multipart uploads.
   *
   * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advancedcostoptimizationmetrics.html
   */
  export interface AdvancedCostOptimizationMetricsProperty {
    /**
     * Indicates whether advanced cost optimization metrics are enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-advancedcostoptimizationmetrics.html#cfn-s3-storagelens-advancedcostoptimizationmetrics-isenabled
     */
    readonly isEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * This resource enables Amazon S3 Storage Lens detailed status code metrics.
   *
   * Detailed status code metrics generate metrics for HTTP status codes, such as `200 OK` , `403 Forbidden` , `503 Service Unavailable` and others.
   *
   * For more information, see [Assessing your storage activity and usage with S3 Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) in the *Amazon S3 User Guide* . For a complete list of metrics, see [S3 Storage Lens metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-detailedstatuscodesmetrics.html
   */
  export interface DetailedStatusCodesMetricsProperty {
    /**
     * Indicates whether detailed status code metrics are enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-detailedstatuscodesmetrics.html#cfn-s3-storagelens-detailedstatuscodesmetrics-isenabled
     */
    readonly isEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * This resource determines the scope of Storage Lens group data that is displayed in the Storage Lens dashboard.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensgrouplevel.html
   */
  export interface StorageLensGroupLevelProperty {
    /**
     * This property indicates which Storage Lens group ARNs to include or exclude in the Storage Lens group aggregation.
     *
     * If this value is left null, then all Storage Lens groups are selected.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensgrouplevel.html#cfn-s3-storagelens-storagelensgrouplevel-storagelensgroupselectioncriteria
     */
    readonly storageLensGroupSelectionCriteria?: cdk.IResolvable | CfnStorageLens.StorageLensGroupSelectionCriteriaProperty;
  }

  /**
   * This resource indicates which Storage Lens group ARNs to include or exclude in the Storage Lens group aggregation.
   *
   * You can only attach Storage Lens groups to your dashboard if they're included in your Storage Lens group aggregation. If this value is left null, then all Storage Lens groups are selected.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensgroupselectioncriteria.html
   */
  export interface StorageLensGroupSelectionCriteriaProperty {
    /**
     * This property indicates which Storage Lens group ARNs to exclude from the Storage Lens group aggregation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensgroupselectioncriteria.html#cfn-s3-storagelens-storagelensgroupselectioncriteria-exclude
     */
    readonly exclude?: Array<string>;

    /**
     * This property indicates which Storage Lens group ARNs to include in the Storage Lens group aggregation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-storagelensgroupselectioncriteria.html#cfn-s3-storagelens-storagelensgroupselectioncriteria-include
     */
    readonly include?: Array<string>;
  }

  /**
   * This resource contains the details of the buckets and Regions for the Amazon S3 Storage Lens configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketsandregions.html
   */
  export interface BucketsAndRegionsProperty {
    /**
     * This property contains the details of the buckets for the Amazon S3 Storage Lens configuration.
     *
     * This should be the bucket Amazon Resource Name(ARN). For valid values, see [Buckets ARN format here](https://docs.aws.amazon.com/AmazonS3/latest/API/API_control_Include.html#API_control_Include_Contents) in the *Amazon S3 API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketsandregions.html#cfn-s3-storagelens-bucketsandregions-buckets
     */
    readonly buckets?: Array<string>;

    /**
     * This property contains the details of the Regions for the S3 Storage Lens configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-bucketsandregions.html#cfn-s3-storagelens-bucketsandregions-regions
     */
    readonly regions?: Array<string>;
  }

  /**
   * This resource contains the details of the AWS Organization for Amazon S3 Storage Lens.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-awsorg.html
   */
  export interface AwsOrgProperty {
    /**
     * This resource contains the ARN of the AWS Organization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-awsorg.html#cfn-s3-storagelens-awsorg-arn
     */
    readonly arn: string;
  }

  /**
   * This resource contains the details of the Amazon S3 Storage Lens metrics export.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-dataexport.html
   */
  export interface DataExportProperty {
    /**
     * This property enables the Amazon CloudWatch publishing option for S3 Storage Lens metrics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-dataexport.html#cfn-s3-storagelens-dataexport-cloudwatchmetrics
     */
    readonly cloudWatchMetrics?: CfnStorageLens.CloudWatchMetricsProperty | cdk.IResolvable;

    /**
     * This property contains the details of the bucket where the S3 Storage Lens metrics export will be placed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-dataexport.html#cfn-s3-storagelens-dataexport-s3bucketdestination
     */
    readonly s3BucketDestination?: cdk.IResolvable | CfnStorageLens.S3BucketDestinationProperty;
  }

  /**
   * This resource contains the details of the bucket where the Amazon S3 Storage Lens metrics export will be placed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html
   */
  export interface S3BucketDestinationProperty {
    /**
     * This property contains the details of the AWS account ID of the S3 Storage Lens export bucket destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-accountid
     */
    readonly accountId: string;

    /**
     * This property contains the details of the ARN of the bucket destination of the S3 Storage Lens export.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-arn
     */
    readonly arn: string;

    /**
     * This property contains the details of the encryption of the bucket destination of the Amazon S3 Storage Lens metrics export.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-encryption
     */
    readonly encryption?: CfnStorageLens.EncryptionProperty | cdk.IResolvable;

    /**
     * This property contains the details of the format of the S3 Storage Lens export bucket destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-format
     */
    readonly format: string;

    /**
     * This property contains the details of the output schema version of the S3 Storage Lens export bucket destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-outputschemaversion
     */
    readonly outputSchemaVersion: string;

    /**
     * This property contains the details of the prefix of the bucket destination of the S3 Storage Lens export .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-s3bucketdestination.html#cfn-s3-storagelens-s3bucketdestination-prefix
     */
    readonly prefix?: string;
  }

  /**
   * This resource contains the type of server-side encryption used to encrypt an Amazon S3 Storage Lens metrics export.
   *
   * For valid values, see the [StorageLensDataExportEncryption](https://docs.aws.amazon.com/AmazonS3/latest/API/API_control_StorageLensDataExportEncryption.html) in the *Amazon S3 API Reference* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-encryption.html
   */
  export interface EncryptionProperty {
    /**
     * Specifies the use of AWS Key Management Service keys (SSE-KMS) to encrypt the S3 Storage Lens metrics export file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-encryption.html#cfn-s3-storagelens-encryption-ssekms
     */
    readonly ssekms?: cdk.IResolvable | CfnStorageLens.SSEKMSProperty;

    /**
     * Specifies the use of an Amazon S3-managed key (SSE-S3) to encrypt the S3 Storage Lens metrics export file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-encryption.html#cfn-s3-storagelens-encryption-sses3
     */
    readonly sses3?: any | cdk.IResolvable;
  }

  /**
   * Specifies the use of server-side encryption using an AWS Key Management Service key (SSE-KMS) to encrypt the delivered S3 Storage Lens metrics export file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-ssekms.html
   */
  export interface SSEKMSProperty {
    /**
     * Specifies the Amazon Resource Name (ARN) of the customer managed AWS KMS key to use for encrypting the S3 Storage Lens metrics export file.
     *
     * Amazon S3 only supports symmetric encryption keys. For more information, see [Special-purpose keys](https://docs.aws.amazon.com/kms/latest/developerguide/key-types.html) in the *AWS Key Management Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-ssekms.html#cfn-s3-storagelens-ssekms-keyid
     */
    readonly keyId: string;
  }

  /**
   * This resource enables the Amazon CloudWatch publishing option for Amazon S3 Storage Lens metrics.
   *
   * For more information, see [Monitor S3 Storage Lens metrics in CloudWatch](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_view_metrics_cloudwatch.html) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-cloudwatchmetrics.html
   */
  export interface CloudWatchMetricsProperty {
    /**
     * This property identifies whether the CloudWatch publishing option for S3 Storage Lens is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelens-cloudwatchmetrics.html#cfn-s3-storagelens-cloudwatchmetrics-isenabled
     */
    readonly isEnabled: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnStorageLens`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html
 */
export interface CfnStorageLensProps {
  /**
   * This resource contains the details Amazon S3 Storage Lens configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html#cfn-s3-storagelens-storagelensconfiguration
   */
  readonly storageLensConfiguration: cdk.IResolvable | CfnStorageLens.StorageLensConfigurationProperty;

  /**
   * A set of tags (key–value pairs) to associate with the Storage Lens configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelens.html#cfn-s3-storagelens-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AdvancedDataProtectionMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `AdvancedDataProtectionMetricsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensAdvancedDataProtectionMetricsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isEnabled", cdk.validateBoolean)(properties.isEnabled));
  return errors.wrap("supplied properties not correct for \"AdvancedDataProtectionMetricsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensAdvancedDataProtectionMetricsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensAdvancedDataProtectionMetricsPropertyValidator(properties).assertSuccess();
  return {
    "IsEnabled": cdk.booleanToCloudFormation(properties.isEnabled)
  };
}

// @ts-ignore TS6133
function CfnStorageLensAdvancedDataProtectionMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.AdvancedDataProtectionMetricsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.AdvancedDataProtectionMetricsProperty>();
  ret.addPropertyResult("isEnabled", "IsEnabled", (properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActivityMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `ActivityMetricsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensActivityMetricsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isEnabled", cdk.validateBoolean)(properties.isEnabled));
  return errors.wrap("supplied properties not correct for \"ActivityMetricsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensActivityMetricsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensActivityMetricsPropertyValidator(properties).assertSuccess();
  return {
    "IsEnabled": cdk.booleanToCloudFormation(properties.isEnabled)
  };
}

// @ts-ignore TS6133
function CfnStorageLensActivityMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.ActivityMetricsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.ActivityMetricsProperty>();
  ret.addPropertyResult("isEnabled", "IsEnabled", (properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SelectionCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `SelectionCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensSelectionCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("delimiter", cdk.validateString)(properties.delimiter));
  errors.collect(cdk.propertyValidator("maxDepth", cdk.validateNumber)(properties.maxDepth));
  errors.collect(cdk.propertyValidator("minStorageBytesPercentage", cdk.validateNumber)(properties.minStorageBytesPercentage));
  return errors.wrap("supplied properties not correct for \"SelectionCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensSelectionCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensSelectionCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "Delimiter": cdk.stringToCloudFormation(properties.delimiter),
    "MaxDepth": cdk.numberToCloudFormation(properties.maxDepth),
    "MinStorageBytesPercentage": cdk.numberToCloudFormation(properties.minStorageBytesPercentage)
  };
}

// @ts-ignore TS6133
function CfnStorageLensSelectionCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageLens.SelectionCriteriaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.SelectionCriteriaProperty>();
  ret.addPropertyResult("delimiter", "Delimiter", (properties.Delimiter != null ? cfn_parse.FromCloudFormation.getString(properties.Delimiter) : undefined));
  ret.addPropertyResult("maxDepth", "MaxDepth", (properties.MaxDepth != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxDepth) : undefined));
  ret.addPropertyResult("minStorageBytesPercentage", "MinStorageBytesPercentage", (properties.MinStorageBytesPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinStorageBytesPercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrefixLevelStorageMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `PrefixLevelStorageMetricsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensPrefixLevelStorageMetricsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isEnabled", cdk.validateBoolean)(properties.isEnabled));
  errors.collect(cdk.propertyValidator("selectionCriteria", CfnStorageLensSelectionCriteriaPropertyValidator)(properties.selectionCriteria));
  return errors.wrap("supplied properties not correct for \"PrefixLevelStorageMetricsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensPrefixLevelStorageMetricsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensPrefixLevelStorageMetricsPropertyValidator(properties).assertSuccess();
  return {
    "IsEnabled": cdk.booleanToCloudFormation(properties.isEnabled),
    "SelectionCriteria": convertCfnStorageLensSelectionCriteriaPropertyToCloudFormation(properties.selectionCriteria)
  };
}

// @ts-ignore TS6133
function CfnStorageLensPrefixLevelStorageMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageLens.PrefixLevelStorageMetricsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.PrefixLevelStorageMetricsProperty>();
  ret.addPropertyResult("isEnabled", "IsEnabled", (properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined));
  ret.addPropertyResult("selectionCriteria", "SelectionCriteria", (properties.SelectionCriteria != null ? CfnStorageLensSelectionCriteriaPropertyFromCloudFormation(properties.SelectionCriteria) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrefixLevelProperty`
 *
 * @param properties - the TypeScript properties of a `PrefixLevelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensPrefixLevelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("storageMetrics", cdk.requiredValidator)(properties.storageMetrics));
  errors.collect(cdk.propertyValidator("storageMetrics", CfnStorageLensPrefixLevelStorageMetricsPropertyValidator)(properties.storageMetrics));
  return errors.wrap("supplied properties not correct for \"PrefixLevelProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensPrefixLevelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensPrefixLevelPropertyValidator(properties).assertSuccess();
  return {
    "StorageMetrics": convertCfnStorageLensPrefixLevelStorageMetricsPropertyToCloudFormation(properties.storageMetrics)
  };
}

// @ts-ignore TS6133
function CfnStorageLensPrefixLevelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageLens.PrefixLevelProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.PrefixLevelProperty>();
  ret.addPropertyResult("storageMetrics", "StorageMetrics", (properties.StorageMetrics != null ? CfnStorageLensPrefixLevelStorageMetricsPropertyFromCloudFormation(properties.StorageMetrics) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AdvancedCostOptimizationMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `AdvancedCostOptimizationMetricsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensAdvancedCostOptimizationMetricsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isEnabled", cdk.validateBoolean)(properties.isEnabled));
  return errors.wrap("supplied properties not correct for \"AdvancedCostOptimizationMetricsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensAdvancedCostOptimizationMetricsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensAdvancedCostOptimizationMetricsPropertyValidator(properties).assertSuccess();
  return {
    "IsEnabled": cdk.booleanToCloudFormation(properties.isEnabled)
  };
}

// @ts-ignore TS6133
function CfnStorageLensAdvancedCostOptimizationMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.AdvancedCostOptimizationMetricsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.AdvancedCostOptimizationMetricsProperty>();
  ret.addPropertyResult("isEnabled", "IsEnabled", (properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DetailedStatusCodesMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `DetailedStatusCodesMetricsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensDetailedStatusCodesMetricsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isEnabled", cdk.validateBoolean)(properties.isEnabled));
  return errors.wrap("supplied properties not correct for \"DetailedStatusCodesMetricsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensDetailedStatusCodesMetricsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensDetailedStatusCodesMetricsPropertyValidator(properties).assertSuccess();
  return {
    "IsEnabled": cdk.booleanToCloudFormation(properties.isEnabled)
  };
}

// @ts-ignore TS6133
function CfnStorageLensDetailedStatusCodesMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.DetailedStatusCodesMetricsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.DetailedStatusCodesMetricsProperty>();
  ret.addPropertyResult("isEnabled", "IsEnabled", (properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BucketLevelProperty`
 *
 * @param properties - the TypeScript properties of a `BucketLevelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensBucketLevelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activityMetrics", CfnStorageLensActivityMetricsPropertyValidator)(properties.activityMetrics));
  errors.collect(cdk.propertyValidator("advancedCostOptimizationMetrics", CfnStorageLensAdvancedCostOptimizationMetricsPropertyValidator)(properties.advancedCostOptimizationMetrics));
  errors.collect(cdk.propertyValidator("advancedDataProtectionMetrics", CfnStorageLensAdvancedDataProtectionMetricsPropertyValidator)(properties.advancedDataProtectionMetrics));
  errors.collect(cdk.propertyValidator("detailedStatusCodesMetrics", CfnStorageLensDetailedStatusCodesMetricsPropertyValidator)(properties.detailedStatusCodesMetrics));
  errors.collect(cdk.propertyValidator("prefixLevel", CfnStorageLensPrefixLevelPropertyValidator)(properties.prefixLevel));
  return errors.wrap("supplied properties not correct for \"BucketLevelProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensBucketLevelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensBucketLevelPropertyValidator(properties).assertSuccess();
  return {
    "ActivityMetrics": convertCfnStorageLensActivityMetricsPropertyToCloudFormation(properties.activityMetrics),
    "AdvancedCostOptimizationMetrics": convertCfnStorageLensAdvancedCostOptimizationMetricsPropertyToCloudFormation(properties.advancedCostOptimizationMetrics),
    "AdvancedDataProtectionMetrics": convertCfnStorageLensAdvancedDataProtectionMetricsPropertyToCloudFormation(properties.advancedDataProtectionMetrics),
    "DetailedStatusCodesMetrics": convertCfnStorageLensDetailedStatusCodesMetricsPropertyToCloudFormation(properties.detailedStatusCodesMetrics),
    "PrefixLevel": convertCfnStorageLensPrefixLevelPropertyToCloudFormation(properties.prefixLevel)
  };
}

// @ts-ignore TS6133
function CfnStorageLensBucketLevelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.BucketLevelProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.BucketLevelProperty>();
  ret.addPropertyResult("activityMetrics", "ActivityMetrics", (properties.ActivityMetrics != null ? CfnStorageLensActivityMetricsPropertyFromCloudFormation(properties.ActivityMetrics) : undefined));
  ret.addPropertyResult("advancedCostOptimizationMetrics", "AdvancedCostOptimizationMetrics", (properties.AdvancedCostOptimizationMetrics != null ? CfnStorageLensAdvancedCostOptimizationMetricsPropertyFromCloudFormation(properties.AdvancedCostOptimizationMetrics) : undefined));
  ret.addPropertyResult("advancedDataProtectionMetrics", "AdvancedDataProtectionMetrics", (properties.AdvancedDataProtectionMetrics != null ? CfnStorageLensAdvancedDataProtectionMetricsPropertyFromCloudFormation(properties.AdvancedDataProtectionMetrics) : undefined));
  ret.addPropertyResult("detailedStatusCodesMetrics", "DetailedStatusCodesMetrics", (properties.DetailedStatusCodesMetrics != null ? CfnStorageLensDetailedStatusCodesMetricsPropertyFromCloudFormation(properties.DetailedStatusCodesMetrics) : undefined));
  ret.addPropertyResult("prefixLevel", "PrefixLevel", (properties.PrefixLevel != null ? CfnStorageLensPrefixLevelPropertyFromCloudFormation(properties.PrefixLevel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StorageLensGroupSelectionCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `StorageLensGroupSelectionCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensStorageLensGroupSelectionCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exclude", cdk.listValidator(cdk.validateString))(properties.exclude));
  errors.collect(cdk.propertyValidator("include", cdk.listValidator(cdk.validateString))(properties.include));
  return errors.wrap("supplied properties not correct for \"StorageLensGroupSelectionCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensStorageLensGroupSelectionCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensStorageLensGroupSelectionCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "Exclude": cdk.listMapper(cdk.stringToCloudFormation)(properties.exclude),
    "Include": cdk.listMapper(cdk.stringToCloudFormation)(properties.include)
  };
}

// @ts-ignore TS6133
function CfnStorageLensStorageLensGroupSelectionCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageLens.StorageLensGroupSelectionCriteriaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.StorageLensGroupSelectionCriteriaProperty>();
  ret.addPropertyResult("exclude", "Exclude", (properties.Exclude != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Exclude) : undefined));
  ret.addPropertyResult("include", "Include", (properties.Include != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Include) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StorageLensGroupLevelProperty`
 *
 * @param properties - the TypeScript properties of a `StorageLensGroupLevelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensStorageLensGroupLevelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("storageLensGroupSelectionCriteria", CfnStorageLensStorageLensGroupSelectionCriteriaPropertyValidator)(properties.storageLensGroupSelectionCriteria));
  return errors.wrap("supplied properties not correct for \"StorageLensGroupLevelProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensStorageLensGroupLevelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensStorageLensGroupLevelPropertyValidator(properties).assertSuccess();
  return {
    "StorageLensGroupSelectionCriteria": convertCfnStorageLensStorageLensGroupSelectionCriteriaPropertyToCloudFormation(properties.storageLensGroupSelectionCriteria)
  };
}

// @ts-ignore TS6133
function CfnStorageLensStorageLensGroupLevelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageLens.StorageLensGroupLevelProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.StorageLensGroupLevelProperty>();
  ret.addPropertyResult("storageLensGroupSelectionCriteria", "StorageLensGroupSelectionCriteria", (properties.StorageLensGroupSelectionCriteria != null ? CfnStorageLensStorageLensGroupSelectionCriteriaPropertyFromCloudFormation(properties.StorageLensGroupSelectionCriteria) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccountLevelProperty`
 *
 * @param properties - the TypeScript properties of a `AccountLevelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensAccountLevelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activityMetrics", CfnStorageLensActivityMetricsPropertyValidator)(properties.activityMetrics));
  errors.collect(cdk.propertyValidator("advancedCostOptimizationMetrics", CfnStorageLensAdvancedCostOptimizationMetricsPropertyValidator)(properties.advancedCostOptimizationMetrics));
  errors.collect(cdk.propertyValidator("advancedDataProtectionMetrics", CfnStorageLensAdvancedDataProtectionMetricsPropertyValidator)(properties.advancedDataProtectionMetrics));
  errors.collect(cdk.propertyValidator("bucketLevel", cdk.requiredValidator)(properties.bucketLevel));
  errors.collect(cdk.propertyValidator("bucketLevel", CfnStorageLensBucketLevelPropertyValidator)(properties.bucketLevel));
  errors.collect(cdk.propertyValidator("detailedStatusCodesMetrics", CfnStorageLensDetailedStatusCodesMetricsPropertyValidator)(properties.detailedStatusCodesMetrics));
  errors.collect(cdk.propertyValidator("storageLensGroupLevel", CfnStorageLensStorageLensGroupLevelPropertyValidator)(properties.storageLensGroupLevel));
  return errors.wrap("supplied properties not correct for \"AccountLevelProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensAccountLevelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensAccountLevelPropertyValidator(properties).assertSuccess();
  return {
    "ActivityMetrics": convertCfnStorageLensActivityMetricsPropertyToCloudFormation(properties.activityMetrics),
    "AdvancedCostOptimizationMetrics": convertCfnStorageLensAdvancedCostOptimizationMetricsPropertyToCloudFormation(properties.advancedCostOptimizationMetrics),
    "AdvancedDataProtectionMetrics": convertCfnStorageLensAdvancedDataProtectionMetricsPropertyToCloudFormation(properties.advancedDataProtectionMetrics),
    "BucketLevel": convertCfnStorageLensBucketLevelPropertyToCloudFormation(properties.bucketLevel),
    "DetailedStatusCodesMetrics": convertCfnStorageLensDetailedStatusCodesMetricsPropertyToCloudFormation(properties.detailedStatusCodesMetrics),
    "StorageLensGroupLevel": convertCfnStorageLensStorageLensGroupLevelPropertyToCloudFormation(properties.storageLensGroupLevel)
  };
}

// @ts-ignore TS6133
function CfnStorageLensAccountLevelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.AccountLevelProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.AccountLevelProperty>();
  ret.addPropertyResult("activityMetrics", "ActivityMetrics", (properties.ActivityMetrics != null ? CfnStorageLensActivityMetricsPropertyFromCloudFormation(properties.ActivityMetrics) : undefined));
  ret.addPropertyResult("advancedCostOptimizationMetrics", "AdvancedCostOptimizationMetrics", (properties.AdvancedCostOptimizationMetrics != null ? CfnStorageLensAdvancedCostOptimizationMetricsPropertyFromCloudFormation(properties.AdvancedCostOptimizationMetrics) : undefined));
  ret.addPropertyResult("advancedDataProtectionMetrics", "AdvancedDataProtectionMetrics", (properties.AdvancedDataProtectionMetrics != null ? CfnStorageLensAdvancedDataProtectionMetricsPropertyFromCloudFormation(properties.AdvancedDataProtectionMetrics) : undefined));
  ret.addPropertyResult("bucketLevel", "BucketLevel", (properties.BucketLevel != null ? CfnStorageLensBucketLevelPropertyFromCloudFormation(properties.BucketLevel) : undefined));
  ret.addPropertyResult("detailedStatusCodesMetrics", "DetailedStatusCodesMetrics", (properties.DetailedStatusCodesMetrics != null ? CfnStorageLensDetailedStatusCodesMetricsPropertyFromCloudFormation(properties.DetailedStatusCodesMetrics) : undefined));
  ret.addPropertyResult("storageLensGroupLevel", "StorageLensGroupLevel", (properties.StorageLensGroupLevel != null ? CfnStorageLensStorageLensGroupLevelPropertyFromCloudFormation(properties.StorageLensGroupLevel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BucketsAndRegionsProperty`
 *
 * @param properties - the TypeScript properties of a `BucketsAndRegionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensBucketsAndRegionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("buckets", cdk.listValidator(cdk.validateString))(properties.buckets));
  errors.collect(cdk.propertyValidator("regions", cdk.listValidator(cdk.validateString))(properties.regions));
  return errors.wrap("supplied properties not correct for \"BucketsAndRegionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensBucketsAndRegionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensBucketsAndRegionsPropertyValidator(properties).assertSuccess();
  return {
    "Buckets": cdk.listMapper(cdk.stringToCloudFormation)(properties.buckets),
    "Regions": cdk.listMapper(cdk.stringToCloudFormation)(properties.regions)
  };
}

// @ts-ignore TS6133
function CfnStorageLensBucketsAndRegionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.BucketsAndRegionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.BucketsAndRegionsProperty>();
  ret.addPropertyResult("buckets", "Buckets", (properties.Buckets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Buckets) : undefined));
  ret.addPropertyResult("regions", "Regions", (properties.Regions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Regions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AwsOrgProperty`
 *
 * @param properties - the TypeScript properties of a `AwsOrgProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensAwsOrgPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  return errors.wrap("supplied properties not correct for \"AwsOrgProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensAwsOrgPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensAwsOrgPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn)
  };
}

// @ts-ignore TS6133
function CfnStorageLensAwsOrgPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.AwsOrgProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.AwsOrgProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SSEKMSProperty`
 *
 * @param properties - the TypeScript properties of a `SSEKMSProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensSSEKMSPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyId", cdk.requiredValidator)(properties.keyId));
  errors.collect(cdk.propertyValidator("keyId", cdk.validateString)(properties.keyId));
  return errors.wrap("supplied properties not correct for \"SSEKMSProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensSSEKMSPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensSSEKMSPropertyValidator(properties).assertSuccess();
  return {
    "KeyId": cdk.stringToCloudFormation(properties.keyId)
  };
}

// @ts-ignore TS6133
function CfnStorageLensSSEKMSPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageLens.SSEKMSProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.SSEKMSProperty>();
  ret.addPropertyResult("keyId", "KeyId", (properties.KeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ssekms", CfnStorageLensSSEKMSPropertyValidator)(properties.ssekms));
  errors.collect(cdk.propertyValidator("sses3", cdk.validateObject)(properties.sses3));
  return errors.wrap("supplied properties not correct for \"EncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "SSEKMS": convertCfnStorageLensSSEKMSPropertyToCloudFormation(properties.ssekms),
    "SSES3": cdk.objectToCloudFormation(properties.sses3)
  };
}

// @ts-ignore TS6133
function CfnStorageLensEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.EncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.EncryptionProperty>();
  ret.addPropertyResult("ssekms", "SSEKMS", (properties.SSEKMS != null ? CfnStorageLensSSEKMSPropertyFromCloudFormation(properties.SSEKMS) : undefined));
  ret.addPropertyResult("sses3", "SSES3", (properties.SSES3 != null ? cfn_parse.FromCloudFormation.getAny(properties.SSES3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3BucketDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `S3BucketDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensS3BucketDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountId", cdk.requiredValidator)(properties.accountId));
  errors.collect(cdk.propertyValidator("accountId", cdk.validateString)(properties.accountId));
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("encryption", CfnStorageLensEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("format", cdk.requiredValidator)(properties.format));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  errors.collect(cdk.propertyValidator("outputSchemaVersion", cdk.requiredValidator)(properties.outputSchemaVersion));
  errors.collect(cdk.propertyValidator("outputSchemaVersion", cdk.validateString)(properties.outputSchemaVersion));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"S3BucketDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensS3BucketDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensS3BucketDestinationPropertyValidator(properties).assertSuccess();
  return {
    "AccountId": cdk.stringToCloudFormation(properties.accountId),
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "Encryption": convertCfnStorageLensEncryptionPropertyToCloudFormation(properties.encryption),
    "Format": cdk.stringToCloudFormation(properties.format),
    "OutputSchemaVersion": cdk.stringToCloudFormation(properties.outputSchemaVersion),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnStorageLensS3BucketDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageLens.S3BucketDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.S3BucketDestinationProperty>();
  ret.addPropertyResult("accountId", "AccountId", (properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined));
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnStorageLensEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addPropertyResult("outputSchemaVersion", "OutputSchemaVersion", (properties.OutputSchemaVersion != null ? cfn_parse.FromCloudFormation.getString(properties.OutputSchemaVersion) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchMetricsProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchMetricsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensCloudWatchMetricsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isEnabled", cdk.requiredValidator)(properties.isEnabled));
  errors.collect(cdk.propertyValidator("isEnabled", cdk.validateBoolean)(properties.isEnabled));
  return errors.wrap("supplied properties not correct for \"CloudWatchMetricsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensCloudWatchMetricsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensCloudWatchMetricsPropertyValidator(properties).assertSuccess();
  return {
    "IsEnabled": cdk.booleanToCloudFormation(properties.isEnabled)
  };
}

// @ts-ignore TS6133
function CfnStorageLensCloudWatchMetricsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.CloudWatchMetricsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.CloudWatchMetricsProperty>();
  ret.addPropertyResult("isEnabled", "IsEnabled", (properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataExportProperty`
 *
 * @param properties - the TypeScript properties of a `DataExportProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensDataExportPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchMetrics", CfnStorageLensCloudWatchMetricsPropertyValidator)(properties.cloudWatchMetrics));
  errors.collect(cdk.propertyValidator("s3BucketDestination", CfnStorageLensS3BucketDestinationPropertyValidator)(properties.s3BucketDestination));
  return errors.wrap("supplied properties not correct for \"DataExportProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensDataExportPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensDataExportPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchMetrics": convertCfnStorageLensCloudWatchMetricsPropertyToCloudFormation(properties.cloudWatchMetrics),
    "S3BucketDestination": convertCfnStorageLensS3BucketDestinationPropertyToCloudFormation(properties.s3BucketDestination)
  };
}

// @ts-ignore TS6133
function CfnStorageLensDataExportPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLens.DataExportProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.DataExportProperty>();
  ret.addPropertyResult("cloudWatchMetrics", "CloudWatchMetrics", (properties.CloudWatchMetrics != null ? CfnStorageLensCloudWatchMetricsPropertyFromCloudFormation(properties.CloudWatchMetrics) : undefined));
  ret.addPropertyResult("s3BucketDestination", "S3BucketDestination", (properties.S3BucketDestination != null ? CfnStorageLensS3BucketDestinationPropertyFromCloudFormation(properties.S3BucketDestination) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StorageLensConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StorageLensConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensStorageLensConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountLevel", cdk.requiredValidator)(properties.accountLevel));
  errors.collect(cdk.propertyValidator("accountLevel", CfnStorageLensAccountLevelPropertyValidator)(properties.accountLevel));
  errors.collect(cdk.propertyValidator("awsOrg", CfnStorageLensAwsOrgPropertyValidator)(properties.awsOrg));
  errors.collect(cdk.propertyValidator("dataExport", CfnStorageLensDataExportPropertyValidator)(properties.dataExport));
  errors.collect(cdk.propertyValidator("exclude", CfnStorageLensBucketsAndRegionsPropertyValidator)(properties.exclude));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("include", CfnStorageLensBucketsAndRegionsPropertyValidator)(properties.include));
  errors.collect(cdk.propertyValidator("isEnabled", cdk.requiredValidator)(properties.isEnabled));
  errors.collect(cdk.propertyValidator("isEnabled", cdk.validateBoolean)(properties.isEnabled));
  errors.collect(cdk.propertyValidator("storageLensArn", cdk.validateString)(properties.storageLensArn));
  return errors.wrap("supplied properties not correct for \"StorageLensConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensStorageLensConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensStorageLensConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AccountLevel": convertCfnStorageLensAccountLevelPropertyToCloudFormation(properties.accountLevel),
    "AwsOrg": convertCfnStorageLensAwsOrgPropertyToCloudFormation(properties.awsOrg),
    "DataExport": convertCfnStorageLensDataExportPropertyToCloudFormation(properties.dataExport),
    "Exclude": convertCfnStorageLensBucketsAndRegionsPropertyToCloudFormation(properties.exclude),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Include": convertCfnStorageLensBucketsAndRegionsPropertyToCloudFormation(properties.include),
    "IsEnabled": cdk.booleanToCloudFormation(properties.isEnabled),
    "StorageLensArn": cdk.stringToCloudFormation(properties.storageLensArn)
  };
}

// @ts-ignore TS6133
function CfnStorageLensStorageLensConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageLens.StorageLensConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLens.StorageLensConfigurationProperty>();
  ret.addPropertyResult("accountLevel", "AccountLevel", (properties.AccountLevel != null ? CfnStorageLensAccountLevelPropertyFromCloudFormation(properties.AccountLevel) : undefined));
  ret.addPropertyResult("awsOrg", "AwsOrg", (properties.AwsOrg != null ? CfnStorageLensAwsOrgPropertyFromCloudFormation(properties.AwsOrg) : undefined));
  ret.addPropertyResult("dataExport", "DataExport", (properties.DataExport != null ? CfnStorageLensDataExportPropertyFromCloudFormation(properties.DataExport) : undefined));
  ret.addPropertyResult("exclude", "Exclude", (properties.Exclude != null ? CfnStorageLensBucketsAndRegionsPropertyFromCloudFormation(properties.Exclude) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("include", "Include", (properties.Include != null ? CfnStorageLensBucketsAndRegionsPropertyFromCloudFormation(properties.Include) : undefined));
  ret.addPropertyResult("isEnabled", "IsEnabled", (properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined));
  ret.addPropertyResult("storageLensArn", "StorageLensArn", (properties.StorageLensArn != null ? cfn_parse.FromCloudFormation.getString(properties.StorageLensArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStorageLensProps`
 *
 * @param properties - the TypeScript properties of a `CfnStorageLensProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("storageLensConfiguration", cdk.requiredValidator)(properties.storageLensConfiguration));
  errors.collect(cdk.propertyValidator("storageLensConfiguration", CfnStorageLensStorageLensConfigurationPropertyValidator)(properties.storageLensConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnStorageLensProps\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensPropsValidator(properties).assertSuccess();
  return {
    "StorageLensConfiguration": convertCfnStorageLensStorageLensConfigurationPropertyToCloudFormation(properties.storageLensConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnStorageLensPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLensProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLensProps>();
  ret.addPropertyResult("storageLensConfiguration", "StorageLensConfiguration", (properties.StorageLensConfiguration != null ? CfnStorageLensStorageLensConfigurationPropertyFromCloudFormation(properties.StorageLensConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::S3::AccessGrant` resource creates an access grant that gives a grantee access to your S3 data.
 *
 * The grantee can be an IAM user or role or a directory user, or group. Before you can create a grant, you must have an S3 Access Grants instance in the same Region as the S3 data. You can create an S3 Access Grants instance using the [AWS::S3::AccessGrantsInstance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrantsinstance.html) . You must also have registered at least one S3 data location in your S3 Access Grants instance using [AWS::S3::AccessGrantsLocation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrantslocation.html) .
 *
 * - **Permissions** - You must have the `s3:CreateAccessGrant` permission to use this resource.
 * - **Additional Permissions** - For any directory identity - `sso:DescribeInstance` and `sso:DescribeApplication`
 *
 * For directory users - `identitystore:DescribeUser`
 *
 * For directory groups - `identitystore:DescribeGroup`
 *
 * @cloudformationResource AWS::S3::AccessGrant
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrant.html
 */
export class CfnAccessGrant extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3::AccessGrant";

  /**
   * Build a CfnAccessGrant from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessGrant {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccessGrantPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccessGrant(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the access grant.
   *
   * @cloudformationAttribute AccessGrantArn
   */
  public readonly attrAccessGrantArn: string;

  /**
   * The ID of the access grant. S3 Access Grants auto-generates this ID when you create the access grant.
   *
   * @cloudformationAttribute AccessGrantId
   */
  public readonly attrAccessGrantId: string;

  /**
   * The S3 path of the data to which you are granting access. It is the result of appending the `Subprefix` to the location scope.
   *
   * @cloudformationAttribute GrantScope
   */
  public readonly attrGrantScope: string;

  /**
   * The configuration options of the grant location.
   */
  public accessGrantsLocationConfiguration?: CfnAccessGrant.AccessGrantsLocationConfigurationProperty | cdk.IResolvable;

  /**
   * The ID of the registered location to which you are granting access.
   */
  public accessGrantsLocationId: string;

  /**
   * The Amazon Resource Name (ARN) of an AWS IAM Identity Center application associated with your Identity Center instance.
   */
  public applicationArn?: string;

  /**
   * The user, group, or role to which you are granting access.
   */
  public grantee: CfnAccessGrant.GranteeProperty | cdk.IResolvable;

  /**
   * The type of access that you are granting to your S3 data, which can be set to one of the following values:  - `READ` – Grant read-only access to the S3 data.
   */
  public permission: string;

  /**
   * The type of `S3SubPrefix` .
   */
  public s3PrefixType?: string;

  /**
   * The AWS resource tags that you are adding to the access grant.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessGrantProps) {
    super(scope, id, {
      "type": CfnAccessGrant.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accessGrantsLocationId", this);
    cdk.requireProperty(props, "grantee", this);
    cdk.requireProperty(props, "permission", this);

    this.attrAccessGrantArn = cdk.Token.asString(this.getAtt("AccessGrantArn", cdk.ResolutionTypeHint.STRING));
    this.attrAccessGrantId = cdk.Token.asString(this.getAtt("AccessGrantId", cdk.ResolutionTypeHint.STRING));
    this.attrGrantScope = cdk.Token.asString(this.getAtt("GrantScope", cdk.ResolutionTypeHint.STRING));
    this.accessGrantsLocationConfiguration = props.accessGrantsLocationConfiguration;
    this.accessGrantsLocationId = props.accessGrantsLocationId;
    this.applicationArn = props.applicationArn;
    this.grantee = props.grantee;
    this.permission = props.permission;
    this.s3PrefixType = props.s3PrefixType;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessGrantsLocationConfiguration": this.accessGrantsLocationConfiguration,
      "accessGrantsLocationId": this.accessGrantsLocationId,
      "applicationArn": this.applicationArn,
      "grantee": this.grantee,
      "permission": this.permission,
      "s3PrefixType": this.s3PrefixType,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessGrant.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessGrantPropsToCloudFormation(props);
  }
}

export namespace CfnAccessGrant {
  /**
   * The user, group, or role to which you are granting access.
   *
   * You can grant access to an IAM user or role. If you have added your corporate directory to AWS IAM Identity Center and associated your Identity Center instance with your S3 Access Grants instance, the grantee can also be a corporate directory user or group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accessgrant-grantee.html
   */
  export interface GranteeProperty {
    /**
     * The unique identifier of the `Grantee` .
     *
     * If the grantee type is `IAM` , the identifier is the IAM Amazon Resource Name (ARN) of the user or role. If the grantee type is a directory user or group, the identifier is 128-bit universally unique identifier (UUID) in the format `a1b2c3d4-5678-90ab-cdef-EXAMPLE11111` . You can obtain this UUID from your AWS IAM Identity Center instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accessgrant-grantee.html#cfn-s3-accessgrant-grantee-granteeidentifier
     */
    readonly granteeIdentifier: string;

    /**
     * The type of the grantee to which access has been granted. It can be one of the following values:.
     *
     * - `IAM` - An IAM user or role.
     * - `DIRECTORY_USER` - Your corporate directory user. You can use this option if you have added your corporate identity directory to IAM Identity Center and associated the IAM Identity Center instance with your S3 Access Grants instance.
     * - `DIRECTORY_GROUP` - Your corporate directory group. You can use this option if you have added your corporate identity directory to IAM Identity Center and associated the IAM Identity Center instance with your S3 Access Grants instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accessgrant-grantee.html#cfn-s3-accessgrant-grantee-granteetype
     */
    readonly granteeType: string;
  }

  /**
   * The configuration options of the S3 Access Grants location.
   *
   * It contains the `S3SubPrefix` field. The grant scope, the data to which you are granting access, is the result of appending the `Subprefix` field to the scope of the registered location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accessgrant-accessgrantslocationconfiguration.html
   */
  export interface AccessGrantsLocationConfigurationProperty {
    /**
     * The `S3SubPrefix` is appended to the location scope creating the grant scope.
     *
     * Use this field to narrow the scope of the grant to a subset of the location scope. This field is required if the location scope is the default location `s3://` because you cannot create a grant for all of your S3 data in the Region and must narrow the scope. For example, if the location scope is the default location `s3://` , the `S3SubPrefx` can be a `<bucket-name>/*` , so the full grant scope path would be `s3://<bucket-name>/*` . Or the `S3SubPrefx` can be `<bucket-name>/<prefix-name>*` , so the full grant scope path would be `s3://<bucket-name>/<prefix-name>*` .
     *
     * If the `S3SubPrefix` includes a prefix, append the wildcard character `*` after the prefix to indicate that you want to include all object key names in the bucket that start with that prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-accessgrant-accessgrantslocationconfiguration.html#cfn-s3-accessgrant-accessgrantslocationconfiguration-s3subprefix
     */
    readonly s3SubPrefix: string;
  }
}

/**
 * Properties for defining a `CfnAccessGrant`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrant.html
 */
export interface CfnAccessGrantProps {
  /**
   * The configuration options of the grant location.
   *
   * The grant location is the S3 path to the data to which you are granting access. It contains the `S3SubPrefix` field. The grant scope is the result of appending the subprefix to the location scope of the registered location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrant.html#cfn-s3-accessgrant-accessgrantslocationconfiguration
   */
  readonly accessGrantsLocationConfiguration?: CfnAccessGrant.AccessGrantsLocationConfigurationProperty | cdk.IResolvable;

  /**
   * The ID of the registered location to which you are granting access.
   *
   * S3 Access Grants assigns this ID when you register the location. S3 Access Grants assigns the ID `default` to the default location `s3://` and assigns an auto-generated ID to other locations that you register.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrant.html#cfn-s3-accessgrant-accessgrantslocationid
   */
  readonly accessGrantsLocationId: string;

  /**
   * The Amazon Resource Name (ARN) of an AWS IAM Identity Center application associated with your Identity Center instance.
   *
   * If the grant includes an application ARN, the grantee can only access the S3 data through this application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrant.html#cfn-s3-accessgrant-applicationarn
   */
  readonly applicationArn?: string;

  /**
   * The user, group, or role to which you are granting access.
   *
   * You can grant access to an IAM user or role. If you have added your corporate directory to AWS IAM Identity Center and associated your Identity Center instance with your S3 Access Grants instance, the grantee can also be a corporate directory user or group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrant.html#cfn-s3-accessgrant-grantee
   */
  readonly grantee: CfnAccessGrant.GranteeProperty | cdk.IResolvable;

  /**
   * The type of access that you are granting to your S3 data, which can be set to one of the following values:  - `READ` – Grant read-only access to the S3 data.
   *
   * - `WRITE` – Grant write-only access to the S3 data.
   * - `READWRITE` – Grant both read and write access to the S3 data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrant.html#cfn-s3-accessgrant-permission
   */
  readonly permission: string;

  /**
   * The type of `S3SubPrefix` .
   *
   * The only possible value is `Object` . Pass this value if the access grant scope is an object. Do not pass this value if the access grant scope is a bucket or a bucket and a prefix.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrant.html#cfn-s3-accessgrant-s3prefixtype
   */
  readonly s3PrefixType?: string;

  /**
   * The AWS resource tags that you are adding to the access grant.
   *
   * Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrant.html#cfn-s3-accessgrant-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `GranteeProperty`
 *
 * @param properties - the TypeScript properties of a `GranteeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessGrantGranteePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("granteeIdentifier", cdk.requiredValidator)(properties.granteeIdentifier));
  errors.collect(cdk.propertyValidator("granteeIdentifier", cdk.validateString)(properties.granteeIdentifier));
  errors.collect(cdk.propertyValidator("granteeType", cdk.requiredValidator)(properties.granteeType));
  errors.collect(cdk.propertyValidator("granteeType", cdk.validateString)(properties.granteeType));
  return errors.wrap("supplied properties not correct for \"GranteeProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessGrantGranteePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessGrantGranteePropertyValidator(properties).assertSuccess();
  return {
    "GranteeIdentifier": cdk.stringToCloudFormation(properties.granteeIdentifier),
    "GranteeType": cdk.stringToCloudFormation(properties.granteeType)
  };
}

// @ts-ignore TS6133
function CfnAccessGrantGranteePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessGrant.GranteeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessGrant.GranteeProperty>();
  ret.addPropertyResult("granteeIdentifier", "GranteeIdentifier", (properties.GranteeIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.GranteeIdentifier) : undefined));
  ret.addPropertyResult("granteeType", "GranteeType", (properties.GranteeType != null ? cfn_parse.FromCloudFormation.getString(properties.GranteeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessGrantsLocationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AccessGrantsLocationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessGrantAccessGrantsLocationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3SubPrefix", cdk.requiredValidator)(properties.s3SubPrefix));
  errors.collect(cdk.propertyValidator("s3SubPrefix", cdk.validateString)(properties.s3SubPrefix));
  return errors.wrap("supplied properties not correct for \"AccessGrantsLocationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessGrantAccessGrantsLocationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessGrantAccessGrantsLocationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "S3SubPrefix": cdk.stringToCloudFormation(properties.s3SubPrefix)
  };
}

// @ts-ignore TS6133
function CfnAccessGrantAccessGrantsLocationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessGrant.AccessGrantsLocationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessGrant.AccessGrantsLocationConfigurationProperty>();
  ret.addPropertyResult("s3SubPrefix", "S3SubPrefix", (properties.S3SubPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3SubPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAccessGrantProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessGrantProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessGrantPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessGrantsLocationConfiguration", CfnAccessGrantAccessGrantsLocationConfigurationPropertyValidator)(properties.accessGrantsLocationConfiguration));
  errors.collect(cdk.propertyValidator("accessGrantsLocationId", cdk.requiredValidator)(properties.accessGrantsLocationId));
  errors.collect(cdk.propertyValidator("accessGrantsLocationId", cdk.validateString)(properties.accessGrantsLocationId));
  errors.collect(cdk.propertyValidator("applicationArn", cdk.validateString)(properties.applicationArn));
  errors.collect(cdk.propertyValidator("grantee", cdk.requiredValidator)(properties.grantee));
  errors.collect(cdk.propertyValidator("grantee", CfnAccessGrantGranteePropertyValidator)(properties.grantee));
  errors.collect(cdk.propertyValidator("permission", cdk.requiredValidator)(properties.permission));
  errors.collect(cdk.propertyValidator("permission", cdk.validateString)(properties.permission));
  errors.collect(cdk.propertyValidator("s3PrefixType", cdk.validateString)(properties.s3PrefixType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAccessGrantProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessGrantPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessGrantPropsValidator(properties).assertSuccess();
  return {
    "AccessGrantsLocationConfiguration": convertCfnAccessGrantAccessGrantsLocationConfigurationPropertyToCloudFormation(properties.accessGrantsLocationConfiguration),
    "AccessGrantsLocationId": cdk.stringToCloudFormation(properties.accessGrantsLocationId),
    "ApplicationArn": cdk.stringToCloudFormation(properties.applicationArn),
    "Grantee": convertCfnAccessGrantGranteePropertyToCloudFormation(properties.grantee),
    "Permission": cdk.stringToCloudFormation(properties.permission),
    "S3PrefixType": cdk.stringToCloudFormation(properties.s3PrefixType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAccessGrantPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessGrantProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessGrantProps>();
  ret.addPropertyResult("accessGrantsLocationConfiguration", "AccessGrantsLocationConfiguration", (properties.AccessGrantsLocationConfiguration != null ? CfnAccessGrantAccessGrantsLocationConfigurationPropertyFromCloudFormation(properties.AccessGrantsLocationConfiguration) : undefined));
  ret.addPropertyResult("accessGrantsLocationId", "AccessGrantsLocationId", (properties.AccessGrantsLocationId != null ? cfn_parse.FromCloudFormation.getString(properties.AccessGrantsLocationId) : undefined));
  ret.addPropertyResult("applicationArn", "ApplicationArn", (properties.ApplicationArn != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationArn) : undefined));
  ret.addPropertyResult("grantee", "Grantee", (properties.Grantee != null ? CfnAccessGrantGranteePropertyFromCloudFormation(properties.Grantee) : undefined));
  ret.addPropertyResult("permission", "Permission", (properties.Permission != null ? cfn_parse.FromCloudFormation.getString(properties.Permission) : undefined));
  ret.addPropertyResult("s3PrefixType", "S3PrefixType", (properties.S3PrefixType != null ? cfn_parse.FromCloudFormation.getString(properties.S3PrefixType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::S3::AccessGrantInstance` resource creates an S3 Access Grants instance, which serves as a logical grouping for access grants.
 *
 * You can create one S3 Access Grants instance per Region per account.
 *
 * - **Permissions** - You must have the `s3:CreateAccessGrantsInstance` permission to use this resource.
 * - **Additional Permissions** - To associate an IAM Identity Center instance with your S3 Access Grants instance, you must also have the `sso:DescribeInstance` , `sso:CreateApplication` , `sso:PutApplicationGrant` , and `sso:PutApplicationAuthenticationMethod` permissions.
 *
 * @cloudformationResource AWS::S3::AccessGrantsInstance
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrantsinstance.html
 */
export class CfnAccessGrantsInstance extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3::AccessGrantsInstance";

  /**
   * Build a CfnAccessGrantsInstance from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessGrantsInstance {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccessGrantsInstancePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccessGrantsInstance(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the S3 Access Grants instance.
   *
   * @cloudformationAttribute AccessGrantsInstanceArn
   */
  public readonly attrAccessGrantsInstanceArn: string;

  /**
   * The ID of the S3 Access Grants instance. The ID is `default` . You can have one S3 Access Grants instance per Region per account.
   *
   * @cloudformationAttribute AccessGrantsInstanceId
   */
  public readonly attrAccessGrantsInstanceId: string;

  /**
   * If you would like to associate your S3 Access Grants instance with an AWS IAM Identity Center instance, use this field to pass the Amazon Resource Name (ARN) of the AWS IAM Identity Center instance that you are associating with your S3 Access Grants instance.
   */
  public identityCenterArn?: string;

  /**
   * The AWS resource tags that you are adding to the S3 Access Grants instance.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessGrantsInstanceProps = {}) {
    super(scope, id, {
      "type": CfnAccessGrantsInstance.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrAccessGrantsInstanceArn = cdk.Token.asString(this.getAtt("AccessGrantsInstanceArn", cdk.ResolutionTypeHint.STRING));
    this.attrAccessGrantsInstanceId = cdk.Token.asString(this.getAtt("AccessGrantsInstanceId", cdk.ResolutionTypeHint.STRING));
    this.identityCenterArn = props.identityCenterArn;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "identityCenterArn": this.identityCenterArn,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessGrantsInstance.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessGrantsInstancePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAccessGrantsInstance`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrantsinstance.html
 */
export interface CfnAccessGrantsInstanceProps {
  /**
   * If you would like to associate your S3 Access Grants instance with an AWS IAM Identity Center instance, use this field to pass the Amazon Resource Name (ARN) of the AWS IAM Identity Center instance that you are associating with your S3 Access Grants instance.
   *
   * An IAM Identity Center instance is your corporate identity directory that you added to the IAM Identity Center.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrantsinstance.html#cfn-s3-accessgrantsinstance-identitycenterarn
   */
  readonly identityCenterArn?: string;

  /**
   * The AWS resource tags that you are adding to the S3 Access Grants instance.
   *
   * Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrantsinstance.html#cfn-s3-accessgrantsinstance-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnAccessGrantsInstanceProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessGrantsInstanceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessGrantsInstancePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("identityCenterArn", cdk.validateString)(properties.identityCenterArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAccessGrantsInstanceProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessGrantsInstancePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessGrantsInstancePropsValidator(properties).assertSuccess();
  return {
    "IdentityCenterArn": cdk.stringToCloudFormation(properties.identityCenterArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAccessGrantsInstancePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessGrantsInstanceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessGrantsInstanceProps>();
  ret.addPropertyResult("identityCenterArn", "IdentityCenterArn", (properties.IdentityCenterArn != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityCenterArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::S3::AccessGrantsLocation` resource creates the S3 data location that you would like to register in your S3 Access Grants instance.
 *
 * Your S3 data must be in the same Region as your S3 Access Grants instance. The location can be one of the following:
 *
 * - The default S3 location `s3://`
 * - A bucket - `S3://<bucket-name>`
 * - A bucket and prefix - `S3://<bucket-name>/<prefix>`
 *
 * When you register a location, you must include the IAM role that has permission to manage the S3 location that you are registering. Give S3 Access Grants permission to assume this role [using a policy](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-grants-location.html) . S3 Access Grants assumes this role to manage access to the location and to vend temporary credentials to grantees or client applications.
 *
 * - **Permissions** - You must have the `s3:CreateAccessGrantsLocation` permission to use this resource.
 * - **Additional Permissions** - You must also have the following permission for the specified IAM role: `iam:PassRole`
 *
 * @cloudformationResource AWS::S3::AccessGrantsLocation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrantslocation.html
 */
export class CfnAccessGrantsLocation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3::AccessGrantsLocation";

  /**
   * Build a CfnAccessGrantsLocation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessGrantsLocation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccessGrantsLocationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccessGrantsLocation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the location you are registering.
   *
   * @cloudformationAttribute AccessGrantsLocationArn
   */
  public readonly attrAccessGrantsLocationArn: string;

  /**
   * The ID of the registered location to which you are granting access. S3 Access Grants assigns this ID when you register the location. S3 Access Grants assigns the ID `default` to the default location `s3://` and assigns an auto-generated ID to other locations that you register.
   *
   * @cloudformationAttribute AccessGrantsLocationId
   */
  public readonly attrAccessGrantsLocationId: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role for the registered location.
   */
  public iamRoleArn?: string;

  /**
   * The S3 URI path to the location that you are registering.
   */
  public locationScope?: string;

  /**
   * The AWS resource tags that you are adding to the S3 Access Grants location.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessGrantsLocationProps = {}) {
    super(scope, id, {
      "type": CfnAccessGrantsLocation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrAccessGrantsLocationArn = cdk.Token.asString(this.getAtt("AccessGrantsLocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrAccessGrantsLocationId = cdk.Token.asString(this.getAtt("AccessGrantsLocationId", cdk.ResolutionTypeHint.STRING));
    this.iamRoleArn = props.iamRoleArn;
    this.locationScope = props.locationScope;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "iamRoleArn": this.iamRoleArn,
      "locationScope": this.locationScope,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessGrantsLocation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessGrantsLocationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAccessGrantsLocation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrantslocation.html
 */
export interface CfnAccessGrantsLocationProps {
  /**
   * The Amazon Resource Name (ARN) of the IAM role for the registered location.
   *
   * S3 Access Grants assumes this role to manage access to the registered location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrantslocation.html#cfn-s3-accessgrantslocation-iamrolearn
   */
  readonly iamRoleArn?: string;

  /**
   * The S3 URI path to the location that you are registering.
   *
   * The location scope can be the default S3 location `s3://` , the S3 path to a bucket, or the S3 path to a bucket and prefix. A prefix in S3 is a string of characters at the beginning of an object key name used to organize the objects that you store in your S3 buckets. For example, object key names that start with the `engineering/` prefix or object key names that start with the `marketing/campaigns/` prefix.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrantslocation.html#cfn-s3-accessgrantslocation-locationscope
   */
  readonly locationScope?: string;

  /**
   * The AWS resource tags that you are adding to the S3 Access Grants location.
   *
   * Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-accessgrantslocation.html#cfn-s3-accessgrantslocation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnAccessGrantsLocationProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessGrantsLocationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessGrantsLocationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.validateString)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("locationScope", cdk.validateString)(properties.locationScope));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAccessGrantsLocationProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessGrantsLocationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessGrantsLocationPropsValidator(properties).assertSuccess();
  return {
    "IamRoleArn": cdk.stringToCloudFormation(properties.iamRoleArn),
    "LocationScope": cdk.stringToCloudFormation(properties.locationScope),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAccessGrantsLocationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessGrantsLocationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessGrantsLocationProps>();
  ret.addPropertyResult("iamRoleArn", "IamRoleArn", (properties.IamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamRoleArn) : undefined));
  ret.addPropertyResult("locationScope", "LocationScope", (properties.LocationScope != null ? cfn_parse.FromCloudFormation.getString(properties.LocationScope) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::S3::StorageLensGroup` resource creates an S3 Storage Lens group.
 *
 * A Storage Lens group is a custom grouping of objects that include filters for prefixes, suffixes, object tags, object size, or object age. You can create an S3 Storage Lens group that includes a single filter or multiple filter conditions. To specify multiple filter conditions, you use `AND` or `OR` logical operators. For more information about S3 Storage Lens groups, see [Working with S3 Storage Lens groups](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-lens-groups-overview.html) .
 *
 * @cloudformationResource AWS::S3::StorageLensGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelensgroup.html
 */
export class CfnStorageLensGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3::StorageLensGroup";

  /**
   * Build a CfnStorageLensGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStorageLensGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStorageLensGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStorageLensGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN for the Amazon S3 Storage Lens Group.
   *
   * @cloudformationAttribute StorageLensGroupArn
   */
  public readonly attrStorageLensGroupArn: string;

  /**
   * This property contains the criteria for the Storage Lens group data that is displayed.
   */
  public filter: CfnStorageLensGroup.FilterProperty | cdk.IResolvable;

  /**
   * This property contains the Storage Lens group name.
   */
  public name: string;

  /**
   * This property contains the AWS resource tags that you're adding to your Storage Lens group.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStorageLensGroupProps) {
    super(scope, id, {
      "type": CfnStorageLensGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "filter", this);
    cdk.requireProperty(props, "name", this);

    this.attrStorageLensGroupArn = cdk.Token.asString(this.getAtt("StorageLensGroupArn", cdk.ResolutionTypeHint.STRING));
    this.filter = props.filter;
    this.name = props.name;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "filter": this.filter,
      "name": this.name,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStorageLensGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStorageLensGroupPropsToCloudFormation(props);
  }
}

export namespace CfnStorageLensGroup {
  /**
   * This resource sets the criteria for the Storage Lens group data that is displayed.
   *
   * For multiple filter conditions, the `AND` or `OR` logical operator is used.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-filter.html
   */
  export interface FilterProperty {
    /**
     * This property contains the `And` logical operator, which allows multiple filter conditions to be joined for more complex comparisons of Storage Lens group data.
     *
     * Objects must match all of the listed filter conditions that are joined by the `And` logical operator. Only one of each filter condition is allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-filter.html#cfn-s3-storagelensgroup-filter-and
     */
    readonly and?: CfnStorageLensGroup.AndProperty | cdk.IResolvable;

    /**
     * This property contains a list of prefixes.
     *
     * At least one prefix must be specified. Up to 10 prefixes are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-filter.html#cfn-s3-storagelensgroup-filter-matchanyprefix
     */
    readonly matchAnyPrefix?: Array<string>;

    /**
     * This property contains a list of suffixes.
     *
     * At least one suffix must be specified. Up to 10 suffixes are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-filter.html#cfn-s3-storagelensgroup-filter-matchanysuffix
     */
    readonly matchAnySuffix?: Array<string>;

    /**
     * This property contains the list of S3 object tags.
     *
     * At least one object tag must be specified. Up to 10 object tags are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-filter.html#cfn-s3-storagelensgroup-filter-matchanytag
     */
    readonly matchAnyTag?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

    /**
     * This property contains `DaysGreaterThan` and `DaysLessThan` to define the object age range (minimum and maximum number of days).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-filter.html#cfn-s3-storagelensgroup-filter-matchobjectage
     */
    readonly matchObjectAge?: cdk.IResolvable | CfnStorageLensGroup.MatchObjectAgeProperty;

    /**
     * This property contains `BytesGreaterThan` and `BytesLessThan` to define the object size range (minimum and maximum number of Bytes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-filter.html#cfn-s3-storagelensgroup-filter-matchobjectsize
     */
    readonly matchObjectSize?: cdk.IResolvable | CfnStorageLensGroup.MatchObjectSizeProperty;

    /**
     * This property contains the `Or` logical operator, which allows multiple filter conditions to be joined.
     *
     * Objects can match any of the listed filter conditions, which are joined by the `Or` logical operator. Only one of each filter condition is allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-filter.html#cfn-s3-storagelensgroup-filter-or
     */
    readonly or?: cdk.IResolvable | CfnStorageLensGroup.OrProperty;
  }

  /**
   * This resource filters objects that match the specified object size range.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-matchobjectsize.html
   */
  export interface MatchObjectSizeProperty {
    /**
     * This property specifies the minimum object size in bytes.
     *
     * The value must be a positive number, greater than 0 and less than 5 TB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-matchobjectsize.html#cfn-s3-storagelensgroup-matchobjectsize-bytesgreaterthan
     */
    readonly bytesGreaterThan?: number;

    /**
     * This property specifies the maximum object size in bytes.
     *
     * The value must be a positive number, greater than the minimum object size and less than 5 TB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-matchobjectsize.html#cfn-s3-storagelensgroup-matchobjectsize-byteslessthan
     */
    readonly bytesLessThan?: number;
  }

  /**
   * This resource contains `DaysGreaterThan` and `DaysLessThan` to define the object age range (minimum and maximum number of days).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-matchobjectage.html
   */
  export interface MatchObjectAgeProperty {
    /**
     * This property indicates the minimum object age in days.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-matchobjectage.html#cfn-s3-storagelensgroup-matchobjectage-daysgreaterthan
     */
    readonly daysGreaterThan?: number;

    /**
     * This property indicates the maximum object age in days.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-matchobjectage.html#cfn-s3-storagelensgroup-matchobjectage-dayslessthan
     */
    readonly daysLessThan?: number;
  }

  /**
   * This resource is a logical operator that allows multiple filter conditions to be joined for more complex comparisons of Storage Lens group data.
   *
   * Objects must match all of the listed filter conditions that are joined by the `And` logical operator. Only one of each filter condition is allowed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-and.html
   */
  export interface AndProperty {
    /**
     * This property contains a list of prefixes.
     *
     * At least one prefix must be specified. Up to 10 prefixes are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-and.html#cfn-s3-storagelensgroup-and-matchanyprefix
     */
    readonly matchAnyPrefix?: Array<string>;

    /**
     * This property contains a list of suffixes.
     *
     * At least one suffix must be specified. Up to 10 suffixes are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-and.html#cfn-s3-storagelensgroup-and-matchanysuffix
     */
    readonly matchAnySuffix?: Array<string>;

    /**
     * This property contains the list of object tags.
     *
     * At least one object tag must be specified. Up to 10 object tags are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-and.html#cfn-s3-storagelensgroup-and-matchanytag
     */
    readonly matchAnyTag?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

    /**
     * This property contains `DaysGreaterThan` and `DaysLessThan` properties to define the object age range (minimum and maximum number of days).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-and.html#cfn-s3-storagelensgroup-and-matchobjectage
     */
    readonly matchObjectAge?: cdk.IResolvable | CfnStorageLensGroup.MatchObjectAgeProperty;

    /**
     * This property contains `BytesGreaterThan` and `BytesLessThan` to define the object size range (minimum and maximum number of Bytes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-and.html#cfn-s3-storagelensgroup-and-matchobjectsize
     */
    readonly matchObjectSize?: cdk.IResolvable | CfnStorageLensGroup.MatchObjectSizeProperty;
  }

  /**
   * This resource contains the `Or` logical operator, which allows multiple filter conditions to be joined for more complex comparisons of Storage Lens group data.
   *
   * Objects can match any of the listed filter conditions that are joined by the `Or` logical operator. Only one of each filter condition is allowed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-or.html
   */
  export interface OrProperty {
    /**
     * This property contains a list of prefixes.
     *
     * At least one prefix must be specified. Up to 10 prefixes are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-or.html#cfn-s3-storagelensgroup-or-matchanyprefix
     */
    readonly matchAnyPrefix?: Array<string>;

    /**
     * This property contains the list of suffixes.
     *
     * At least one suffix must be specified. Up to 10 suffixes are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-or.html#cfn-s3-storagelensgroup-or-matchanysuffix
     */
    readonly matchAnySuffix?: Array<string>;

    /**
     * This property contains the list of S3 object tags.
     *
     * At least one object tag must be specified. Up to 10 object tags are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-or.html#cfn-s3-storagelensgroup-or-matchanytag
     */
    readonly matchAnyTag?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

    /**
     * This property filters objects that match the specified object age range.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-or.html#cfn-s3-storagelensgroup-or-matchobjectage
     */
    readonly matchObjectAge?: cdk.IResolvable | CfnStorageLensGroup.MatchObjectAgeProperty;

    /**
     * This property contains the `BytesGreaterThan` and `BytesLessThan` values to define the object size range (minimum and maximum number of Bytes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-storagelensgroup-or.html#cfn-s3-storagelensgroup-or-matchobjectsize
     */
    readonly matchObjectSize?: cdk.IResolvable | CfnStorageLensGroup.MatchObjectSizeProperty;
  }
}

/**
 * Properties for defining a `CfnStorageLensGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelensgroup.html
 */
export interface CfnStorageLensGroupProps {
  /**
   * This property contains the criteria for the Storage Lens group data that is displayed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelensgroup.html#cfn-s3-storagelensgroup-filter
   */
  readonly filter: CfnStorageLensGroup.FilterProperty | cdk.IResolvable;

  /**
   * This property contains the Storage Lens group name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelensgroup.html#cfn-s3-storagelensgroup-name
   */
  readonly name: string;

  /**
   * This property contains the AWS resource tags that you're adding to your Storage Lens group.
   *
   * This parameter is optional.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-storagelensgroup.html#cfn-s3-storagelensgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `MatchObjectSizeProperty`
 *
 * @param properties - the TypeScript properties of a `MatchObjectSizeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensGroupMatchObjectSizePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bytesGreaterThan", cdk.validateNumber)(properties.bytesGreaterThan));
  errors.collect(cdk.propertyValidator("bytesLessThan", cdk.validateNumber)(properties.bytesLessThan));
  return errors.wrap("supplied properties not correct for \"MatchObjectSizeProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensGroupMatchObjectSizePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensGroupMatchObjectSizePropertyValidator(properties).assertSuccess();
  return {
    "BytesGreaterThan": cdk.numberToCloudFormation(properties.bytesGreaterThan),
    "BytesLessThan": cdk.numberToCloudFormation(properties.bytesLessThan)
  };
}

// @ts-ignore TS6133
function CfnStorageLensGroupMatchObjectSizePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageLensGroup.MatchObjectSizeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLensGroup.MatchObjectSizeProperty>();
  ret.addPropertyResult("bytesGreaterThan", "BytesGreaterThan", (properties.BytesGreaterThan != null ? cfn_parse.FromCloudFormation.getNumber(properties.BytesGreaterThan) : undefined));
  ret.addPropertyResult("bytesLessThan", "BytesLessThan", (properties.BytesLessThan != null ? cfn_parse.FromCloudFormation.getNumber(properties.BytesLessThan) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MatchObjectAgeProperty`
 *
 * @param properties - the TypeScript properties of a `MatchObjectAgeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensGroupMatchObjectAgePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("daysGreaterThan", cdk.validateNumber)(properties.daysGreaterThan));
  errors.collect(cdk.propertyValidator("daysLessThan", cdk.validateNumber)(properties.daysLessThan));
  return errors.wrap("supplied properties not correct for \"MatchObjectAgeProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensGroupMatchObjectAgePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensGroupMatchObjectAgePropertyValidator(properties).assertSuccess();
  return {
    "DaysGreaterThan": cdk.numberToCloudFormation(properties.daysGreaterThan),
    "DaysLessThan": cdk.numberToCloudFormation(properties.daysLessThan)
  };
}

// @ts-ignore TS6133
function CfnStorageLensGroupMatchObjectAgePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageLensGroup.MatchObjectAgeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLensGroup.MatchObjectAgeProperty>();
  ret.addPropertyResult("daysGreaterThan", "DaysGreaterThan", (properties.DaysGreaterThan != null ? cfn_parse.FromCloudFormation.getNumber(properties.DaysGreaterThan) : undefined));
  ret.addPropertyResult("daysLessThan", "DaysLessThan", (properties.DaysLessThan != null ? cfn_parse.FromCloudFormation.getNumber(properties.DaysLessThan) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AndProperty`
 *
 * @param properties - the TypeScript properties of a `AndProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensGroupAndPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("matchAnyPrefix", cdk.listValidator(cdk.validateString))(properties.matchAnyPrefix));
  errors.collect(cdk.propertyValidator("matchAnySuffix", cdk.listValidator(cdk.validateString))(properties.matchAnySuffix));
  errors.collect(cdk.propertyValidator("matchAnyTag", cdk.listValidator(cdk.validateCfnTag))(properties.matchAnyTag));
  errors.collect(cdk.propertyValidator("matchObjectAge", CfnStorageLensGroupMatchObjectAgePropertyValidator)(properties.matchObjectAge));
  errors.collect(cdk.propertyValidator("matchObjectSize", CfnStorageLensGroupMatchObjectSizePropertyValidator)(properties.matchObjectSize));
  return errors.wrap("supplied properties not correct for \"AndProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensGroupAndPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensGroupAndPropertyValidator(properties).assertSuccess();
  return {
    "MatchAnyPrefix": cdk.listMapper(cdk.stringToCloudFormation)(properties.matchAnyPrefix),
    "MatchAnySuffix": cdk.listMapper(cdk.stringToCloudFormation)(properties.matchAnySuffix),
    "MatchAnyTag": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.matchAnyTag),
    "MatchObjectAge": convertCfnStorageLensGroupMatchObjectAgePropertyToCloudFormation(properties.matchObjectAge),
    "MatchObjectSize": convertCfnStorageLensGroupMatchObjectSizePropertyToCloudFormation(properties.matchObjectSize)
  };
}

// @ts-ignore TS6133
function CfnStorageLensGroupAndPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLensGroup.AndProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLensGroup.AndProperty>();
  ret.addPropertyResult("matchAnyPrefix", "MatchAnyPrefix", (properties.MatchAnyPrefix != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MatchAnyPrefix) : undefined));
  ret.addPropertyResult("matchAnySuffix", "MatchAnySuffix", (properties.MatchAnySuffix != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MatchAnySuffix) : undefined));
  ret.addPropertyResult("matchAnyTag", "MatchAnyTag", (properties.MatchAnyTag != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.MatchAnyTag) : undefined));
  ret.addPropertyResult("matchObjectAge", "MatchObjectAge", (properties.MatchObjectAge != null ? CfnStorageLensGroupMatchObjectAgePropertyFromCloudFormation(properties.MatchObjectAge) : undefined));
  ret.addPropertyResult("matchObjectSize", "MatchObjectSize", (properties.MatchObjectSize != null ? CfnStorageLensGroupMatchObjectSizePropertyFromCloudFormation(properties.MatchObjectSize) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OrProperty`
 *
 * @param properties - the TypeScript properties of a `OrProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensGroupOrPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("matchAnyPrefix", cdk.listValidator(cdk.validateString))(properties.matchAnyPrefix));
  errors.collect(cdk.propertyValidator("matchAnySuffix", cdk.listValidator(cdk.validateString))(properties.matchAnySuffix));
  errors.collect(cdk.propertyValidator("matchAnyTag", cdk.listValidator(cdk.validateCfnTag))(properties.matchAnyTag));
  errors.collect(cdk.propertyValidator("matchObjectAge", CfnStorageLensGroupMatchObjectAgePropertyValidator)(properties.matchObjectAge));
  errors.collect(cdk.propertyValidator("matchObjectSize", CfnStorageLensGroupMatchObjectSizePropertyValidator)(properties.matchObjectSize));
  return errors.wrap("supplied properties not correct for \"OrProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensGroupOrPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensGroupOrPropertyValidator(properties).assertSuccess();
  return {
    "MatchAnyPrefix": cdk.listMapper(cdk.stringToCloudFormation)(properties.matchAnyPrefix),
    "MatchAnySuffix": cdk.listMapper(cdk.stringToCloudFormation)(properties.matchAnySuffix),
    "MatchAnyTag": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.matchAnyTag),
    "MatchObjectAge": convertCfnStorageLensGroupMatchObjectAgePropertyToCloudFormation(properties.matchObjectAge),
    "MatchObjectSize": convertCfnStorageLensGroupMatchObjectSizePropertyToCloudFormation(properties.matchObjectSize)
  };
}

// @ts-ignore TS6133
function CfnStorageLensGroupOrPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageLensGroup.OrProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLensGroup.OrProperty>();
  ret.addPropertyResult("matchAnyPrefix", "MatchAnyPrefix", (properties.MatchAnyPrefix != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MatchAnyPrefix) : undefined));
  ret.addPropertyResult("matchAnySuffix", "MatchAnySuffix", (properties.MatchAnySuffix != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MatchAnySuffix) : undefined));
  ret.addPropertyResult("matchAnyTag", "MatchAnyTag", (properties.MatchAnyTag != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.MatchAnyTag) : undefined));
  ret.addPropertyResult("matchObjectAge", "MatchObjectAge", (properties.MatchObjectAge != null ? CfnStorageLensGroupMatchObjectAgePropertyFromCloudFormation(properties.MatchObjectAge) : undefined));
  ret.addPropertyResult("matchObjectSize", "MatchObjectSize", (properties.MatchObjectSize != null ? CfnStorageLensGroupMatchObjectSizePropertyFromCloudFormation(properties.MatchObjectSize) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensGroupFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("and", CfnStorageLensGroupAndPropertyValidator)(properties.and));
  errors.collect(cdk.propertyValidator("matchAnyPrefix", cdk.listValidator(cdk.validateString))(properties.matchAnyPrefix));
  errors.collect(cdk.propertyValidator("matchAnySuffix", cdk.listValidator(cdk.validateString))(properties.matchAnySuffix));
  errors.collect(cdk.propertyValidator("matchAnyTag", cdk.listValidator(cdk.validateCfnTag))(properties.matchAnyTag));
  errors.collect(cdk.propertyValidator("matchObjectAge", CfnStorageLensGroupMatchObjectAgePropertyValidator)(properties.matchObjectAge));
  errors.collect(cdk.propertyValidator("matchObjectSize", CfnStorageLensGroupMatchObjectSizePropertyValidator)(properties.matchObjectSize));
  errors.collect(cdk.propertyValidator("or", CfnStorageLensGroupOrPropertyValidator)(properties.or));
  return errors.wrap("supplied properties not correct for \"FilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensGroupFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensGroupFilterPropertyValidator(properties).assertSuccess();
  return {
    "And": convertCfnStorageLensGroupAndPropertyToCloudFormation(properties.and),
    "MatchAnyPrefix": cdk.listMapper(cdk.stringToCloudFormation)(properties.matchAnyPrefix),
    "MatchAnySuffix": cdk.listMapper(cdk.stringToCloudFormation)(properties.matchAnySuffix),
    "MatchAnyTag": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.matchAnyTag),
    "MatchObjectAge": convertCfnStorageLensGroupMatchObjectAgePropertyToCloudFormation(properties.matchObjectAge),
    "MatchObjectSize": convertCfnStorageLensGroupMatchObjectSizePropertyToCloudFormation(properties.matchObjectSize),
    "Or": convertCfnStorageLensGroupOrPropertyToCloudFormation(properties.or)
  };
}

// @ts-ignore TS6133
function CfnStorageLensGroupFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLensGroup.FilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLensGroup.FilterProperty>();
  ret.addPropertyResult("and", "And", (properties.And != null ? CfnStorageLensGroupAndPropertyFromCloudFormation(properties.And) : undefined));
  ret.addPropertyResult("matchAnyPrefix", "MatchAnyPrefix", (properties.MatchAnyPrefix != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MatchAnyPrefix) : undefined));
  ret.addPropertyResult("matchAnySuffix", "MatchAnySuffix", (properties.MatchAnySuffix != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MatchAnySuffix) : undefined));
  ret.addPropertyResult("matchAnyTag", "MatchAnyTag", (properties.MatchAnyTag != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.MatchAnyTag) : undefined));
  ret.addPropertyResult("matchObjectAge", "MatchObjectAge", (properties.MatchObjectAge != null ? CfnStorageLensGroupMatchObjectAgePropertyFromCloudFormation(properties.MatchObjectAge) : undefined));
  ret.addPropertyResult("matchObjectSize", "MatchObjectSize", (properties.MatchObjectSize != null ? CfnStorageLensGroupMatchObjectSizePropertyFromCloudFormation(properties.MatchObjectSize) : undefined));
  ret.addPropertyResult("or", "Or", (properties.Or != null ? CfnStorageLensGroupOrPropertyFromCloudFormation(properties.Or) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStorageLensGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnStorageLensGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageLensGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filter", cdk.requiredValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("filter", CfnStorageLensGroupFilterPropertyValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnStorageLensGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnStorageLensGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageLensGroupPropsValidator(properties).assertSuccess();
  return {
    "Filter": convertCfnStorageLensGroupFilterPropertyToCloudFormation(properties.filter),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnStorageLensGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageLensGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageLensGroupProps>();
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? CfnStorageLensGroupFilterPropertyFromCloudFormation(properties.Filter) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}