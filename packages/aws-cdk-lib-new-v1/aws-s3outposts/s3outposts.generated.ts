/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::S3Outposts::AccessPoint resource specifies an access point and associates it with the specified Amazon S3 on Outposts bucket.
 *
 * For more information, see [Managing data access with Amazon S3 access points](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points.html) .
 *
 * > S3 on Outposts supports only VPC-style access points.
 *
 * @cloudformationResource AWS::S3Outposts::AccessPoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html
 */
export class CfnAccessPoint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3Outposts::AccessPoint";

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
   * This resource contains the details of the S3 on Outposts bucket access point ARN. This resource is read-only.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The Amazon Resource Name (ARN) of the S3 on Outposts bucket that is associated with this access point.
   */
  public bucket: string;

  /**
   * The name of this access point.
   */
  public name: string;

  /**
   * The access point policy associated with this access point.
   */
  public policy?: any | cdk.IResolvable;

  /**
   * The virtual private cloud (VPC) configuration for this access point, if one exists.
   */
  public vpcConfiguration: cdk.IResolvable | CfnAccessPoint.VpcConfigurationProperty;

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
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "vpcConfiguration", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.bucket = props.bucket;
    this.name = props.name;
    this.policy = props.policy;
    this.vpcConfiguration = props.vpcConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bucket": this.bucket,
      "name": this.name,
      "policy": this.policy,
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
   * Contains the virtual private cloud (VPC) configuration for the specified access point.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-accesspoint-vpcconfiguration.html
   */
  export interface VpcConfigurationProperty {
    /**
     * Virtual Private Cloud (VPC) Id from which AccessPoint will allow requests.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-accesspoint-vpcconfiguration.html#cfn-s3outposts-accesspoint-vpcconfiguration-vpcid
     */
    readonly vpcId?: string;
  }
}

/**
 * Properties for defining a `CfnAccessPoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html
 */
export interface CfnAccessPointProps {
  /**
   * The Amazon Resource Name (ARN) of the S3 on Outposts bucket that is associated with this access point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-bucket
   */
  readonly bucket: string;

  /**
   * The name of this access point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-name
   */
  readonly name: string;

  /**
   * The access point policy associated with this access point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-policy
   */
  readonly policy?: any | cdk.IResolvable;

  /**
   * The virtual private cloud (VPC) configuration for this access point, if one exists.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-accesspoint.html#cfn-s3outposts-accesspoint-vpcconfiguration
   */
  readonly vpcConfiguration: cdk.IResolvable | CfnAccessPoint.VpcConfigurationProperty;
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
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  errors.collect(cdk.propertyValidator("vpcConfiguration", cdk.requiredValidator)(properties.vpcConfiguration));
  errors.collect(cdk.propertyValidator("vpcConfiguration", CfnAccessPointVpcConfigurationPropertyValidator)(properties.vpcConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnAccessPointProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointPropsValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Policy": cdk.objectToCloudFormation(properties.policy),
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
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addPropertyResult("vpcConfiguration", "VpcConfiguration", (properties.VpcConfiguration != null ? CfnAccessPointVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::S3Outposts::Bucket resource specifies a new Amazon S3 on Outposts bucket.
 *
 * To create an S3 on Outposts bucket, you must have S3 on Outposts capacity provisioned on your Outpost. For more information, see [Using Amazon S3 on Outposts](https://docs.aws.amazon.com/AmazonS3/latest/userguide/S3onOutposts.html) .
 *
 * S3 on Outposts buckets support the following:
 *
 * - Tags
 * - Lifecycle configuration rules for deleting expired objects
 *
 * For a complete list of restrictions and Amazon S3 feature limitations on S3 on Outposts, see [Amazon S3 on Outposts Restrictions and Limitations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/S3OnOutpostsRestrictionsLimitations.html) .
 *
 * @cloudformationResource AWS::S3Outposts::Bucket
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html
 */
export class CfnBucket extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3Outposts::Bucket";

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
   * Returns the ARN of the specified bucket.
   *
   * Example: `arn:aws:s3Outposts:::DOC-EXAMPLE-BUCKET`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A name for the S3 on Outposts bucket.
   */
  public bucketName: string;

  /**
   * Creates a new lifecycle configuration for the S3 on Outposts bucket or replaces an existing lifecycle configuration.
   */
  public lifecycleConfiguration?: cdk.IResolvable | CfnBucket.LifecycleConfigurationProperty;

  /**
   * The ID of the Outpost of the specified bucket.
   */
  public outpostId: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Sets the tags for an S3 on Outposts bucket. For more information, see [Using Amazon S3 on Outposts](https://docs.aws.amazon.com/AmazonS3/latest/userguide/S3onOutposts.html) .
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBucketProps) {
    super(scope, id, {
      "type": CfnBucket.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "bucketName", this);
    cdk.requireProperty(props, "outpostId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.bucketName = props.bucketName;
    this.lifecycleConfiguration = props.lifecycleConfiguration;
    this.outpostId = props.outpostId;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::S3Outposts::Bucket", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bucketName": this.bucketName,
      "lifecycleConfiguration": this.lifecycleConfiguration,
      "outpostId": this.outpostId,
      "tags": this.tags.renderTags()
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
   * The container for the lifecycle configuration for the objects stored in an S3 on Outposts bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-lifecycleconfiguration.html
   */
  export interface LifecycleConfigurationProperty {
    /**
     * The container for the lifecycle configuration rules for the objects stored in the S3 on Outposts bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-lifecycleconfiguration.html#cfn-s3outposts-bucket-lifecycleconfiguration-rules
     */
    readonly rules: Array<cdk.IResolvable | CfnBucket.RuleProperty> | cdk.IResolvable;
  }

  /**
   * A container for an Amazon S3 on Outposts bucket lifecycle rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html
   */
  export interface RuleProperty {
    /**
     * The container for the abort incomplete multipart upload rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-abortincompletemultipartupload
     */
    readonly abortIncompleteMultipartUpload?: CfnBucket.AbortIncompleteMultipartUploadProperty | cdk.IResolvable;

    /**
     * Specifies the expiration for the lifecycle of the object by specifying an expiry date.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-expirationdate
     */
    readonly expirationDate?: string;

    /**
     * Specifies the expiration for the lifecycle of the object in the form of days that the object has been in the S3 on Outposts bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-expirationindays
     */
    readonly expirationInDays?: number;

    /**
     * The container for the filter of the lifecycle rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-filter
     */
    readonly filter?: any | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-id
     */
    readonly id?: string;

    /**
     * If `Enabled` , the rule is currently being applied.
     *
     * If `Disabled` , the rule is not currently being applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-rule.html#cfn-s3outposts-bucket-rule-status
     */
    readonly status: string;
  }

  /**
   * Specifies the days since the initiation of an incomplete multipart upload that Amazon S3 on Outposts waits before permanently removing all parts of the upload.
   *
   * For more information, see [Aborting Incomplete Multipart Uploads Using a Bucket Lifecycle Policy](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html#mpu-abort-incomplete-mpu-lifecycle-config) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-abortincompletemultipartupload.html
   */
  export interface AbortIncompleteMultipartUploadProperty {
    /**
     * Specifies the number of days after initiation that Amazon S3 on Outposts aborts an incomplete multipart upload.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-abortincompletemultipartupload.html#cfn-s3outposts-bucket-abortincompletemultipartupload-daysafterinitiation
     */
    readonly daysAfterInitiation: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filter.html
   */
  export interface FilterProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filter.html#cfn-s3outposts-bucket-filter-andoperator
     */
    readonly andOperator?: CfnBucket.FilterAndOperatorProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filter.html#cfn-s3outposts-bucket-filter-prefix
     */
    readonly prefix?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filter.html#cfn-s3outposts-bucket-filter-tag
     */
    readonly tag?: CfnBucket.FilterTagProperty | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filterandoperator.html
   */
  export interface FilterAndOperatorProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filterandoperator.html#cfn-s3outposts-bucket-filterandoperator-prefix
     */
    readonly prefix?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filterandoperator.html#cfn-s3outposts-bucket-filterandoperator-tags
     */
    readonly tags: Array<CfnBucket.FilterTagProperty>;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filtertag.html
   */
  export interface FilterTagProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filtertag.html#cfn-s3outposts-bucket-filtertag-key
     */
    readonly key: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-bucket-filtertag.html#cfn-s3outposts-bucket-filtertag-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnBucket`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html
 */
export interface CfnBucketProps {
  /**
   * A name for the S3 on Outposts bucket.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. The bucket name must contain only lowercase letters, numbers, periods (.), and dashes (-) and must follow [Amazon S3 bucket restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/BucketRestrictions.html) . For more information, see [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/BucketRestrictions.html#bucketnamingrules) .
   *
   * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-bucketname
   */
  readonly bucketName: string;

  /**
   * Creates a new lifecycle configuration for the S3 on Outposts bucket or replaces an existing lifecycle configuration.
   *
   * Outposts buckets only support lifecycle configurations that delete/expire objects after a certain period of time and abort incomplete multipart uploads.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-lifecycleconfiguration
   */
  readonly lifecycleConfiguration?: cdk.IResolvable | CfnBucket.LifecycleConfigurationProperty;

  /**
   * The ID of the Outpost of the specified bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-outpostid
   */
  readonly outpostId: string;

  /**
   * Sets the tags for an S3 on Outposts bucket. For more information, see [Using Amazon S3 on Outposts](https://docs.aws.amazon.com/AmazonS3/latest/userguide/S3onOutposts.html) .
   *
   * Use tags to organize your AWS bill to reflect your own cost structure. To do this, sign up to get your AWS account bill with tag key values included. Then, to see the cost of combined resources, organize your billing information according to resources with the same tag key values. For example, you can tag several resources with a specific application name, and then organize your billing information to see the total cost of that application across several services. For more information, see [Cost allocation and tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html) .
   *
   * > Within a bucket, if you add a tag that has the same key as an existing tag, the new value overwrites the old value. For more information, see [Using cost allocation and bucket tags](https://docs.aws.amazon.com/AmazonS3/latest/userguide/CostAllocTagging.html) .
   *
   * To use this resource, you must have permissions to perform the `s3-outposts:PutBucketTagging` . The S3 on Outposts bucket owner has this permission by default and can grant this permission to others. For more information about permissions, see [Permissions Related to Bucket Subresource Operations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-with-s3-actions.html#using-with-s3-actions-related-to-bucket-subresources) and [Managing access permissions to your Amazon S3 resources](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-access-control.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucket.html#cfn-s3outposts-bucket-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
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
  errors.collect(cdk.propertyValidator("expirationDate", cdk.validateString)(properties.expirationDate));
  errors.collect(cdk.propertyValidator("expirationInDays", cdk.validateNumber)(properties.expirationInDays));
  errors.collect(cdk.propertyValidator("filter", cdk.validateObject)(properties.filter));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"RuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketRulePropertyValidator(properties).assertSuccess();
  return {
    "AbortIncompleteMultipartUpload": convertCfnBucketAbortIncompleteMultipartUploadPropertyToCloudFormation(properties.abortIncompleteMultipartUpload),
    "ExpirationDate": cdk.stringToCloudFormation(properties.expirationDate),
    "ExpirationInDays": cdk.numberToCloudFormation(properties.expirationInDays),
    "Filter": cdk.objectToCloudFormation(properties.filter),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Status": cdk.stringToCloudFormation(properties.status)
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
  ret.addPropertyResult("expirationDate", "ExpirationDate", (properties.ExpirationDate != null ? cfn_parse.FromCloudFormation.getString(properties.ExpirationDate) : undefined));
  ret.addPropertyResult("expirationInDays", "ExpirationInDays", (properties.ExpirationInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExpirationInDays) : undefined));
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? cfn_parse.FromCloudFormation.getAny(properties.Filter) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
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
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("lifecycleConfiguration", CfnBucketLifecycleConfigurationPropertyValidator)(properties.lifecycleConfiguration));
  errors.collect(cdk.propertyValidator("outpostId", cdk.requiredValidator)(properties.outpostId));
  errors.collect(cdk.propertyValidator("outpostId", cdk.validateString)(properties.outpostId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnBucketProps\"");
}

// @ts-ignore TS6133
function convertCfnBucketPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketPropsValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "LifecycleConfiguration": convertCfnBucketLifecycleConfigurationPropertyToCloudFormation(properties.lifecycleConfiguration),
    "OutpostId": cdk.stringToCloudFormation(properties.outpostId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
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
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("lifecycleConfiguration", "LifecycleConfiguration", (properties.LifecycleConfiguration != null ? CfnBucketLifecycleConfigurationPropertyFromCloudFormation(properties.LifecycleConfiguration) : undefined));
  ret.addPropertyResult("outpostId", "OutpostId", (properties.OutpostId != null ? cfn_parse.FromCloudFormation.getString(properties.OutpostId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterTagProperty`
 *
 * @param properties - the TypeScript properties of a `FilterTagProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketFilterTagPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"FilterTagProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketFilterTagPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketFilterTagPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBucketFilterTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.FilterTagProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.FilterTagProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterAndOperatorProperty`
 *
 * @param properties - the TypeScript properties of a `FilterAndOperatorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketFilterAndOperatorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("tags", cdk.requiredValidator)(properties.tags));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnBucketFilterTagPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"FilterAndOperatorProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketFilterAndOperatorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketFilterAndOperatorPropertyValidator(properties).assertSuccess();
  return {
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "Tags": cdk.listMapper(convertCfnBucketFilterTagPropertyToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnBucketFilterAndOperatorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.FilterAndOperatorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.FilterAndOperatorProperty>();
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnBucketFilterTagPropertyFromCloudFormation)(properties.Tags) : undefined));
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
function CfnBucketFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("andOperator", CfnBucketFilterAndOperatorPropertyValidator)(properties.andOperator));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("tag", CfnBucketFilterTagPropertyValidator)(properties.tag));
  return errors.wrap("supplied properties not correct for \"FilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketFilterPropertyValidator(properties).assertSuccess();
  return {
    "AndOperator": convertCfnBucketFilterAndOperatorPropertyToCloudFormation(properties.andOperator),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "Tag": convertCfnBucketFilterTagPropertyToCloudFormation(properties.tag)
  };
}

// @ts-ignore TS6133
function CfnBucketFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.FilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.FilterProperty>();
  ret.addPropertyResult("andOperator", "AndOperator", (properties.AndOperator != null ? CfnBucketFilterAndOperatorPropertyFromCloudFormation(properties.AndOperator) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("tag", "Tag", (properties.Tag != null ? CfnBucketFilterTagPropertyFromCloudFormation(properties.Tag) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * This resource applies a bucket policy to an Amazon S3 on Outposts bucket.
 *
 * If you are using an identity other than the root user of the AWS account that owns the S3 on Outposts bucket, the calling identity must have the `s3-outposts:PutBucketPolicy` permissions on the specified Outposts bucket and belong to the bucket owner's account in order to use this resource.
 *
 * If you don't have `s3-outposts:PutBucketPolicy` permissions, S3 on Outposts returns a `403 Access Denied` error.
 *
 * > The root user of the AWS account that owns an Outposts bucket can *always* use this resource, even if the policy explicitly denies the root user the ability to perform actions on this resource.
 *
 * For more information, see the AWS::IAM::Policy [PolicyDocument](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument) resource description in this guide and [Access Policy Language Overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-policy-language-overview.html) .
 *
 * @cloudformationResource AWS::S3Outposts::BucketPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucketpolicy.html
 */
export class CfnBucketPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3Outposts::BucketPolicy";

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
   * The name of the Amazon S3 Outposts bucket to which the policy applies.
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucketpolicy.html
 */
export interface CfnBucketPolicyProps {
  /**
   * The name of the Amazon S3 Outposts bucket to which the policy applies.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucketpolicy.html#cfn-s3outposts-bucketpolicy-bucket
   */
  readonly bucket: string;

  /**
   * A policy document containing permissions to add to the specified bucket.
   *
   * In IAM, you must provide policy documents in JSON format. However, in CloudFormation, you can provide the policy in JSON or YAML format because CloudFormation converts YAML to JSON before submitting it to IAM. For more information, see the AWS::IAM::Policy [PolicyDocument](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html#cfn-iam-policy-policydocument) resource description in this guide and [Access Policy Language Overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-policy-language-overview.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-bucketpolicy.html#cfn-s3outposts-bucketpolicy-policydocument
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
 * This AWS::S3Outposts::Endpoint resource specifies an endpoint and associates it with the specified Outpost.
 *
 * Amazon S3 on Outposts access points simplify managing data access at scale for shared datasets in S3 on Outposts. S3 on Outposts uses endpoints to connect to S3 on Outposts buckets so that you can perform actions within your virtual private cloud (VPC). For more information, see [Accessing S3 on Outposts using VPC-only access points](https://docs.aws.amazon.com/AmazonS3/latest/userguide/AccessingS3Outposts.html) .
 *
 * > It can take up to 5 minutes for this resource to be created.
 *
 * @cloudformationResource AWS::S3Outposts::Endpoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html
 */
export class CfnEndpoint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3Outposts::Endpoint";

  /**
   * Build a CfnEndpoint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEndpoint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEndpointPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEndpoint(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the endpoint.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The VPC CIDR block committed by this endpoint.
   *
   * @cloudformationAttribute CidrBlock
   */
  public readonly attrCidrBlock: string;

  /**
   * The time the endpoint was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The ID of the endpoint.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The network interface of the endpoint.
   *
   * @cloudformationAttribute NetworkInterfaces
   */
  public readonly attrNetworkInterfaces: cdk.IResolvable;

  /**
   * The status of the endpoint.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The container for the type of connectivity used to access the Amazon S3 on Outposts endpoint.
   */
  public accessType?: string;

  /**
   * The ID of the customer-owned IPv4 address pool (CoIP pool) for the endpoint.
   */
  public customerOwnedIpv4Pool?: string;

  /**
   * The failure reason, if any, for a create or delete endpoint operation.
   */
  public failedReason?: CfnEndpoint.FailedReasonProperty | cdk.IResolvable;

  /**
   * The ID of the Outpost.
   */
  public outpostId: string;

  /**
   * The ID of the security group used for the endpoint.
   */
  public securityGroupId: string;

  /**
   * The ID of the subnet used for the endpoint.
   */
  public subnetId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEndpointProps) {
    super(scope, id, {
      "type": CfnEndpoint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "outpostId", this);
    cdk.requireProperty(props, "securityGroupId", this);
    cdk.requireProperty(props, "subnetId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCidrBlock = cdk.Token.asString(this.getAtt("CidrBlock", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrNetworkInterfaces = this.getAtt("NetworkInterfaces");
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.accessType = props.accessType;
    this.customerOwnedIpv4Pool = props.customerOwnedIpv4Pool;
    this.failedReason = props.failedReason;
    this.outpostId = props.outpostId;
    this.securityGroupId = props.securityGroupId;
    this.subnetId = props.subnetId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessType": this.accessType,
      "customerOwnedIpv4Pool": this.customerOwnedIpv4Pool,
      "failedReason": this.failedReason,
      "outpostId": this.outpostId,
      "securityGroupId": this.securityGroupId,
      "subnetId": this.subnetId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEndpoint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEndpointPropsToCloudFormation(props);
  }
}

export namespace CfnEndpoint {
  /**
   * The failure reason, if any, for a create or delete endpoint operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-endpoint-failedreason.html
   */
  export interface FailedReasonProperty {
    /**
     * The failure code, if any, for a create or delete endpoint operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-endpoint-failedreason.html#cfn-s3outposts-endpoint-failedreason-errorcode
     */
    readonly errorCode?: string;

    /**
     * Additional error details describing the endpoint failure and recommended action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-endpoint-failedreason.html#cfn-s3outposts-endpoint-failedreason-message
     */
    readonly message?: string;
  }

  /**
   * The container for the network interface.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-endpoint-networkinterface.html
   */
  export interface NetworkInterfaceProperty {
    /**
     * The ID for the network interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3outposts-endpoint-networkinterface.html#cfn-s3outposts-endpoint-networkinterface-networkinterfaceid
     */
    readonly networkInterfaceId: string;
  }
}

/**
 * Properties for defining a `CfnEndpoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html
 */
export interface CfnEndpointProps {
  /**
   * The container for the type of connectivity used to access the Amazon S3 on Outposts endpoint.
   *
   * To use the Amazon VPC , choose `Private` . To use the endpoint with an on-premises network, choose `CustomerOwnedIp` . If you choose `CustomerOwnedIp` , you must also provide the customer-owned IP address pool (CoIP pool).
   *
   * > `Private` is the default access type value.
   *
   * @default - "Private"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-accesstype
   */
  readonly accessType?: string;

  /**
   * The ID of the customer-owned IPv4 address pool (CoIP pool) for the endpoint.
   *
   * IP addresses are allocated from this pool for the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-customerownedipv4pool
   */
  readonly customerOwnedIpv4Pool?: string;

  /**
   * The failure reason, if any, for a create or delete endpoint operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-failedreason
   */
  readonly failedReason?: CfnEndpoint.FailedReasonProperty | cdk.IResolvable;

  /**
   * The ID of the Outpost.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-outpostid
   */
  readonly outpostId: string;

  /**
   * The ID of the security group used for the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-securitygroupid
   */
  readonly securityGroupId: string;

  /**
   * The ID of the subnet used for the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3outposts-endpoint.html#cfn-s3outposts-endpoint-subnetid
   */
  readonly subnetId: string;
}

/**
 * Determine whether the given properties match those of a `FailedReasonProperty`
 *
 * @param properties - the TypeScript properties of a `FailedReasonProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointFailedReasonPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("errorCode", cdk.validateString)(properties.errorCode));
  errors.collect(cdk.propertyValidator("message", cdk.validateString)(properties.message));
  return errors.wrap("supplied properties not correct for \"FailedReasonProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointFailedReasonPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointFailedReasonPropertyValidator(properties).assertSuccess();
  return {
    "ErrorCode": cdk.stringToCloudFormation(properties.errorCode),
    "Message": cdk.stringToCloudFormation(properties.message)
  };
}

// @ts-ignore TS6133
function CfnEndpointFailedReasonPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.FailedReasonProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.FailedReasonProperty>();
  ret.addPropertyResult("errorCode", "ErrorCode", (properties.ErrorCode != null ? cfn_parse.FromCloudFormation.getString(properties.ErrorCode) : undefined));
  ret.addPropertyResult("message", "Message", (properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkInterfaceProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkInterfaceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointNetworkInterfacePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("networkInterfaceId", cdk.requiredValidator)(properties.networkInterfaceId));
  errors.collect(cdk.propertyValidator("networkInterfaceId", cdk.validateString)(properties.networkInterfaceId));
  return errors.wrap("supplied properties not correct for \"NetworkInterfaceProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointNetworkInterfacePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointNetworkInterfacePropertyValidator(properties).assertSuccess();
  return {
    "NetworkInterfaceId": cdk.stringToCloudFormation(properties.networkInterfaceId)
  };
}

// @ts-ignore TS6133
function CfnEndpointNetworkInterfacePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEndpoint.NetworkInterfaceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.NetworkInterfaceProperty>();
  ret.addPropertyResult("networkInterfaceId", "NetworkInterfaceId", (properties.NetworkInterfaceId != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkInterfaceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnEndpointProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessType", cdk.validateString)(properties.accessType));
  errors.collect(cdk.propertyValidator("customerOwnedIpv4Pool", cdk.validateString)(properties.customerOwnedIpv4Pool));
  errors.collect(cdk.propertyValidator("failedReason", CfnEndpointFailedReasonPropertyValidator)(properties.failedReason));
  errors.collect(cdk.propertyValidator("outpostId", cdk.requiredValidator)(properties.outpostId));
  errors.collect(cdk.propertyValidator("outpostId", cdk.validateString)(properties.outpostId));
  errors.collect(cdk.propertyValidator("securityGroupId", cdk.requiredValidator)(properties.securityGroupId));
  errors.collect(cdk.propertyValidator("securityGroupId", cdk.validateString)(properties.securityGroupId));
  errors.collect(cdk.propertyValidator("subnetId", cdk.requiredValidator)(properties.subnetId));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  return errors.wrap("supplied properties not correct for \"CfnEndpointProps\"");
}

// @ts-ignore TS6133
function convertCfnEndpointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointPropsValidator(properties).assertSuccess();
  return {
    "AccessType": cdk.stringToCloudFormation(properties.accessType),
    "CustomerOwnedIpv4Pool": cdk.stringToCloudFormation(properties.customerOwnedIpv4Pool),
    "FailedReason": convertCfnEndpointFailedReasonPropertyToCloudFormation(properties.failedReason),
    "OutpostId": cdk.stringToCloudFormation(properties.outpostId),
    "SecurityGroupId": cdk.stringToCloudFormation(properties.securityGroupId),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId)
  };
}

// @ts-ignore TS6133
function CfnEndpointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpointProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointProps>();
  ret.addPropertyResult("accessType", "AccessType", (properties.AccessType != null ? cfn_parse.FromCloudFormation.getString(properties.AccessType) : undefined));
  ret.addPropertyResult("customerOwnedIpv4Pool", "CustomerOwnedIpv4Pool", (properties.CustomerOwnedIpv4Pool != null ? cfn_parse.FromCloudFormation.getString(properties.CustomerOwnedIpv4Pool) : undefined));
  ret.addPropertyResult("failedReason", "FailedReason", (properties.FailedReason != null ? CfnEndpointFailedReasonPropertyFromCloudFormation(properties.FailedReason) : undefined));
  ret.addPropertyResult("outpostId", "OutpostId", (properties.OutpostId != null ? cfn_parse.FromCloudFormation.getString(properties.OutpostId) : undefined));
  ret.addPropertyResult("securityGroupId", "SecurityGroupId", (properties.SecurityGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityGroupId) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}