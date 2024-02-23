/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::S3ObjectLambda::AccessPoint` resource specifies an Object Lambda Access Point used to access a bucket.
 *
 * @cloudformationResource AWS::S3ObjectLambda::AccessPoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3objectlambda-accesspoint.html
 */
export class CfnAccessPoint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3ObjectLambda::AccessPoint";

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
   * The alias of the Object Lambda Access Point.
   *
   * @cloudformationAttribute Alias
   */
  public readonly attrAlias: cdk.IResolvable;

  /**
   * The status of the Object Lambda alias.
   *
   * @cloudformationAttribute Alias.Status
   */
  public readonly attrAliasStatus: string;

  /**
   * The value of the Object Lambda alias.
   *
   * @cloudformationAttribute Alias.Value
   */
  public readonly attrAliasValue: string;

  /**
   * Specifies the ARN for the Object Lambda Access Point.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time when the specified Object Lambda Access Point was created.
   *
   * @cloudformationAttribute CreationDate
   */
  public readonly attrCreationDate: string;

  /**
   * @cloudformationAttribute PolicyStatus
   */
  public readonly attrPolicyStatus: cdk.IResolvable;

  /**
   * Specifies whether the Object lambda Access Point Policy is Public or not. Object lambda Access Points are private by default.
   *
   * @cloudformationAttribute PolicyStatus.IsPublic
   */
  public readonly attrPolicyStatusIsPublic: cdk.IResolvable;

  /**
   * The Public Access Block Configuration is used to block policies that would allow public access to this Object lambda Access Point. All public access to Object lambda Access Points are blocked by default, and any policy that would give public access to them will be also blocked. This behavior cannot be changed for Object lambda Access Points.
   *
   * @cloudformationAttribute PublicAccessBlockConfiguration
   */
  public readonly attrPublicAccessBlockConfiguration: cdk.IResolvable;

  /**
   * @cloudformationAttribute PublicAccessBlockConfiguration.BlockPublicAcls
   */
  public readonly attrPublicAccessBlockConfigurationBlockPublicAcls: cdk.IResolvable;

  /**
   * @cloudformationAttribute PublicAccessBlockConfiguration.BlockPublicPolicy
   */
  public readonly attrPublicAccessBlockConfigurationBlockPublicPolicy: cdk.IResolvable;

  /**
   * @cloudformationAttribute PublicAccessBlockConfiguration.IgnorePublicAcls
   */
  public readonly attrPublicAccessBlockConfigurationIgnorePublicAcls: cdk.IResolvable;

  /**
   * @cloudformationAttribute PublicAccessBlockConfiguration.RestrictPublicBuckets
   */
  public readonly attrPublicAccessBlockConfigurationRestrictPublicBuckets: cdk.IResolvable;

  /**
   * The name of this access point.
   */
  public name?: string;

  /**
   * A configuration used when creating an Object Lambda Access Point.
   */
  public objectLambdaConfiguration: cdk.IResolvable | CfnAccessPoint.ObjectLambdaConfigurationProperty;

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

    cdk.requireProperty(props, "objectLambdaConfiguration", this);

    this.attrAlias = this.getAtt("Alias");
    this.attrAliasStatus = cdk.Token.asString(this.getAtt("Alias.Status", cdk.ResolutionTypeHint.STRING));
    this.attrAliasValue = cdk.Token.asString(this.getAtt("Alias.Value", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationDate = cdk.Token.asString(this.getAtt("CreationDate", cdk.ResolutionTypeHint.STRING));
    this.attrPolicyStatus = this.getAtt("PolicyStatus");
    this.attrPolicyStatusIsPublic = this.getAtt("PolicyStatus.IsPublic");
    this.attrPublicAccessBlockConfiguration = this.getAtt("PublicAccessBlockConfiguration");
    this.attrPublicAccessBlockConfigurationBlockPublicAcls = this.getAtt("PublicAccessBlockConfiguration.BlockPublicAcls");
    this.attrPublicAccessBlockConfigurationBlockPublicPolicy = this.getAtt("PublicAccessBlockConfiguration.BlockPublicPolicy");
    this.attrPublicAccessBlockConfigurationIgnorePublicAcls = this.getAtt("PublicAccessBlockConfiguration.IgnorePublicAcls");
    this.attrPublicAccessBlockConfigurationRestrictPublicBuckets = this.getAtt("PublicAccessBlockConfiguration.RestrictPublicBuckets");
    this.name = props.name;
    this.objectLambdaConfiguration = props.objectLambdaConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "objectLambdaConfiguration": this.objectLambdaConfiguration
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
   * A configuration used when creating an Object Lambda Access Point.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-objectlambdaconfiguration.html
   */
  export interface ObjectLambdaConfigurationProperty {
    /**
     * A container for allowed features.
     *
     * Valid inputs are `GetObject-Range` , `GetObject-PartNumber` , `HeadObject-Range` , and `HeadObject-PartNumber` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-objectlambdaconfiguration.html#cfn-s3objectlambda-accesspoint-objectlambdaconfiguration-allowedfeatures
     */
    readonly allowedFeatures?: Array<string>;

    /**
     * A container for whether the CloudWatch metrics configuration is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-objectlambdaconfiguration.html#cfn-s3objectlambda-accesspoint-objectlambdaconfiguration-cloudwatchmetricsenabled
     */
    readonly cloudWatchMetricsEnabled?: boolean | cdk.IResolvable;

    /**
     * Standard access point associated with the Object Lambda Access Point.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-objectlambdaconfiguration.html#cfn-s3objectlambda-accesspoint-objectlambdaconfiguration-supportingaccesspoint
     */
    readonly supportingAccessPoint: string;

    /**
     * A container for transformation configurations for an Object Lambda Access Point.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-objectlambdaconfiguration.html#cfn-s3objectlambda-accesspoint-objectlambdaconfiguration-transformationconfigurations
     */
    readonly transformationConfigurations: Array<cdk.IResolvable | CfnAccessPoint.TransformationConfigurationProperty> | cdk.IResolvable;
  }

  /**
   * A configuration used when creating an Object Lambda Access Point transformation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-transformationconfiguration.html
   */
  export interface TransformationConfigurationProperty {
    /**
     * A container for the action of an Object Lambda Access Point configuration.
     *
     * Valid inputs are `GetObject` , `HeadObject` , `ListObjects` , and `ListObjectsV2` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-transformationconfiguration.html#cfn-s3objectlambda-accesspoint-transformationconfiguration-actions
     */
    readonly actions: Array<string>;

    /**
     * A container for the content transformation of an Object Lambda Access Point configuration.
     *
     * Can include the FunctionArn and FunctionPayload. For more information, see [AwsLambdaTransformation](https://docs.aws.amazon.com/AmazonS3/latest/API/API_control_AwsLambdaTransformation.html) in the *Amazon S3 API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-transformationconfiguration.html#cfn-s3objectlambda-accesspoint-transformationconfiguration-contenttransformation
     */
    readonly contentTransformation: any | cdk.IResolvable;
  }

  /**
   * The `PublicAccessBlock` configuration that you want to apply to this Amazon S3 account.
   *
   * You can enable the configuration options in any combination. For more information about when Amazon S3 considers a bucket or object public, see [The Meaning of "Public"](https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the *Amazon S3 User Guide* .
   *
   * This data type is not supported for Amazon S3 on Outposts.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-publicaccessblockconfiguration.html
   */
  export interface PublicAccessBlockConfigurationProperty {
    /**
     * Specifies whether Amazon S3 should block public access control lists (ACLs) for buckets in this account.
     *
     * Setting this element to `TRUE` causes the following behavior:
     *
     * - `PutBucketAcl` and `PutObjectAcl` calls fail if the specified ACL is public.
     * - PUT Object calls fail if the request includes a public ACL.
     * - PUT Bucket calls fail if the request includes a public ACL.
     *
     * Enabling this setting doesn't affect existing policies or ACLs.
     *
     * This property is not supported for Amazon S3 on Outposts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-publicaccessblockconfiguration.html#cfn-s3objectlambda-accesspoint-publicaccessblockconfiguration-blockpublicacls
     */
    readonly blockPublicAcls?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should block public bucket policies for buckets in this account.
     *
     * Setting this element to `TRUE` causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access.
     *
     * Enabling this setting doesn't affect existing bucket policies.
     *
     * This property is not supported for Amazon S3 on Outposts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-publicaccessblockconfiguration.html#cfn-s3objectlambda-accesspoint-publicaccessblockconfiguration-blockpublicpolicy
     */
    readonly blockPublicPolicy?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should ignore public ACLs for buckets in this account.
     *
     * Setting this element to `TRUE` causes Amazon S3 to ignore all public ACLs on buckets in this account and any objects that they contain.
     *
     * Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.
     *
     * This property is not supported for Amazon S3 on Outposts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-publicaccessblockconfiguration.html#cfn-s3objectlambda-accesspoint-publicaccessblockconfiguration-ignorepublicacls
     */
    readonly ignorePublicAcls?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon S3 should restrict public bucket policies for buckets in this account.
     *
     * Setting this element to `TRUE` restricts access to buckets with public policies to only AWS service principals and authorized users within this account.
     *
     * Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.
     *
     * This property is not supported for Amazon S3 on Outposts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-publicaccessblockconfiguration.html#cfn-s3objectlambda-accesspoint-publicaccessblockconfiguration-restrictpublicbuckets
     */
    readonly restrictPublicBuckets?: boolean | cdk.IResolvable;
  }

  /**
   * The alias of an Object Lambda Access Point.
   *
   * For more information, see [How to use a bucket-style alias for your S3 bucket Object Lambda Access Point](https://docs.aws.amazon.com/AmazonS3/latest/userguide/olap-use.html#ol-access-points-alias) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-alias.html
   */
  export interface AliasProperty {
    /**
     * The status of the Object Lambda Access Point alias.
     *
     * If the status is `PROVISIONING` , the Object Lambda Access Point is provisioning the alias and the alias is not ready for use yet. If the status is `READY` , the Object Lambda Access Point alias is successfully provisioned and ready for use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-alias.html#cfn-s3objectlambda-accesspoint-alias-status
     */
    readonly status?: string;

    /**
     * The alias value of the Object Lambda Access Point.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-alias.html#cfn-s3objectlambda-accesspoint-alias-value
     */
    readonly value: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-policystatus.html
   */
  export interface PolicyStatusProperty {
    /**
     * Specifies whether the Object lambda Access Point Policy is Public or not.
     *
     * Object lambda Access Points are private by default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-policystatus.html#cfn-s3objectlambda-accesspoint-policystatus-ispublic
     */
    readonly isPublic?: boolean | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-awslambda.html
   */
  export interface AwsLambdaProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-awslambda.html#cfn-s3objectlambda-accesspoint-awslambda-functionarn
     */
    readonly functionArn: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-awslambda.html#cfn-s3objectlambda-accesspoint-awslambda-functionpayload
     */
    readonly functionPayload?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-contenttransformation.html
   */
  export interface ContentTransformationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3objectlambda-accesspoint-contenttransformation.html#cfn-s3objectlambda-accesspoint-contenttransformation-awslambda
     */
    readonly awsLambda: CfnAccessPoint.AwsLambdaProperty | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnAccessPoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3objectlambda-accesspoint.html
 */
export interface CfnAccessPointProps {
  /**
   * The name of this access point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3objectlambda-accesspoint.html#cfn-s3objectlambda-accesspoint-name
   */
  readonly name?: string;

  /**
   * A configuration used when creating an Object Lambda Access Point.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3objectlambda-accesspoint.html#cfn-s3objectlambda-accesspoint-objectlambdaconfiguration
   */
  readonly objectLambdaConfiguration: cdk.IResolvable | CfnAccessPoint.ObjectLambdaConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `TransformationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TransformationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointTransformationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(cdk.validateString))(properties.actions));
  errors.collect(cdk.propertyValidator("contentTransformation", cdk.requiredValidator)(properties.contentTransformation));
  errors.collect(cdk.propertyValidator("contentTransformation", cdk.validateObject)(properties.contentTransformation));
  return errors.wrap("supplied properties not correct for \"TransformationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointTransformationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointTransformationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(cdk.stringToCloudFormation)(properties.actions),
    "ContentTransformation": cdk.objectToCloudFormation(properties.contentTransformation)
  };
}

// @ts-ignore TS6133
function CfnAccessPointTransformationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAccessPoint.TransformationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.TransformationConfigurationProperty>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Actions) : undefined));
  ret.addPropertyResult("contentTransformation", "ContentTransformation", (properties.ContentTransformation != null ? cfn_parse.FromCloudFormation.getAny(properties.ContentTransformation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ObjectLambdaConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ObjectLambdaConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointObjectLambdaConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedFeatures", cdk.listValidator(cdk.validateString))(properties.allowedFeatures));
  errors.collect(cdk.propertyValidator("cloudWatchMetricsEnabled", cdk.validateBoolean)(properties.cloudWatchMetricsEnabled));
  errors.collect(cdk.propertyValidator("supportingAccessPoint", cdk.requiredValidator)(properties.supportingAccessPoint));
  errors.collect(cdk.propertyValidator("supportingAccessPoint", cdk.validateString)(properties.supportingAccessPoint));
  errors.collect(cdk.propertyValidator("transformationConfigurations", cdk.requiredValidator)(properties.transformationConfigurations));
  errors.collect(cdk.propertyValidator("transformationConfigurations", cdk.listValidator(CfnAccessPointTransformationConfigurationPropertyValidator))(properties.transformationConfigurations));
  return errors.wrap("supplied properties not correct for \"ObjectLambdaConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointObjectLambdaConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointObjectLambdaConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AllowedFeatures": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedFeatures),
    "CloudWatchMetricsEnabled": cdk.booleanToCloudFormation(properties.cloudWatchMetricsEnabled),
    "SupportingAccessPoint": cdk.stringToCloudFormation(properties.supportingAccessPoint),
    "TransformationConfigurations": cdk.listMapper(convertCfnAccessPointTransformationConfigurationPropertyToCloudFormation)(properties.transformationConfigurations)
  };
}

// @ts-ignore TS6133
function CfnAccessPointObjectLambdaConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAccessPoint.ObjectLambdaConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.ObjectLambdaConfigurationProperty>();
  ret.addPropertyResult("allowedFeatures", "AllowedFeatures", (properties.AllowedFeatures != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedFeatures) : undefined));
  ret.addPropertyResult("cloudWatchMetricsEnabled", "CloudWatchMetricsEnabled", (properties.CloudWatchMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CloudWatchMetricsEnabled) : undefined));
  ret.addPropertyResult("supportingAccessPoint", "SupportingAccessPoint", (properties.SupportingAccessPoint != null ? cfn_parse.FromCloudFormation.getString(properties.SupportingAccessPoint) : undefined));
  ret.addPropertyResult("transformationConfigurations", "TransformationConfigurations", (properties.TransformationConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnAccessPointTransformationConfigurationPropertyFromCloudFormation)(properties.TransformationConfigurations) : undefined));
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
 * Determine whether the given properties match those of a `AliasProperty`
 *
 * @param properties - the TypeScript properties of a `AliasProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointAliasPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"AliasProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointAliasPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointAliasPropertyValidator(properties).assertSuccess();
  return {
    "Status": cdk.stringToCloudFormation(properties.status),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAccessPointAliasPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.AliasProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.AliasProperty>();
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PolicyStatusProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyStatusProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointPolicyStatusPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isPublic", cdk.validateBoolean)(properties.isPublic));
  return errors.wrap("supplied properties not correct for \"PolicyStatusProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointPolicyStatusPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointPolicyStatusPropertyValidator(properties).assertSuccess();
  return {
    "IsPublic": cdk.booleanToCloudFormation(properties.isPublic)
  };
}

// @ts-ignore TS6133
function CfnAccessPointPolicyStatusPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAccessPoint.PolicyStatusProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.PolicyStatusProperty>();
  ret.addPropertyResult("isPublic", "IsPublic", (properties.IsPublic != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsPublic) : undefined));
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
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("objectLambdaConfiguration", cdk.requiredValidator)(properties.objectLambdaConfiguration));
  errors.collect(cdk.propertyValidator("objectLambdaConfiguration", CfnAccessPointObjectLambdaConfigurationPropertyValidator)(properties.objectLambdaConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnAccessPointProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "ObjectLambdaConfiguration": convertCfnAccessPointObjectLambdaConfigurationPropertyToCloudFormation(properties.objectLambdaConfiguration)
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
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("objectLambdaConfiguration", "ObjectLambdaConfiguration", (properties.ObjectLambdaConfiguration != null ? CfnAccessPointObjectLambdaConfigurationPropertyFromCloudFormation(properties.ObjectLambdaConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AwsLambdaProperty`
 *
 * @param properties - the TypeScript properties of a `AwsLambdaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointAwsLambdaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functionArn", cdk.requiredValidator)(properties.functionArn));
  errors.collect(cdk.propertyValidator("functionArn", cdk.validateString)(properties.functionArn));
  errors.collect(cdk.propertyValidator("functionPayload", cdk.validateString)(properties.functionPayload));
  return errors.wrap("supplied properties not correct for \"AwsLambdaProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointAwsLambdaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointAwsLambdaPropertyValidator(properties).assertSuccess();
  return {
    "FunctionArn": cdk.stringToCloudFormation(properties.functionArn),
    "FunctionPayload": cdk.stringToCloudFormation(properties.functionPayload)
  };
}

// @ts-ignore TS6133
function CfnAccessPointAwsLambdaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.AwsLambdaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.AwsLambdaProperty>();
  ret.addPropertyResult("functionArn", "FunctionArn", (properties.FunctionArn != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionArn) : undefined));
  ret.addPropertyResult("functionPayload", "FunctionPayload", (properties.FunctionPayload != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionPayload) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContentTransformationProperty`
 *
 * @param properties - the TypeScript properties of a `ContentTransformationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointContentTransformationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsLambda", cdk.requiredValidator)(properties.awsLambda));
  errors.collect(cdk.propertyValidator("awsLambda", CfnAccessPointAwsLambdaPropertyValidator)(properties.awsLambda));
  return errors.wrap("supplied properties not correct for \"ContentTransformationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointContentTransformationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointContentTransformationPropertyValidator(properties).assertSuccess();
  return {
    "AwsLambda": convertCfnAccessPointAwsLambdaPropertyToCloudFormation(properties.awsLambda)
  };
}

// @ts-ignore TS6133
function CfnAccessPointContentTransformationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPoint.ContentTransformationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPoint.ContentTransformationProperty>();
  ret.addPropertyResult("awsLambda", "AwsLambda", (properties.AwsLambda != null ? CfnAccessPointAwsLambdaPropertyFromCloudFormation(properties.AwsLambda) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::S3ObjectLambda::AccessPointPolicy` resource specifies the Object Lambda Access Point resource policy document.
 *
 * @cloudformationResource AWS::S3ObjectLambda::AccessPointPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3objectlambda-accesspointpolicy.html
 */
export class CfnAccessPointPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::S3ObjectLambda::AccessPointPolicy";

  /**
   * Build a CfnAccessPointPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessPointPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccessPointPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccessPointPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * An access point with an attached AWS Lambda function used to access transformed data from an Amazon S3 bucket.
   */
  public objectLambdaAccessPoint: string;

  /**
   * Object Lambda Access Point resource policy document.
   */
  public policyDocument: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessPointPolicyProps) {
    super(scope, id, {
      "type": CfnAccessPointPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "objectLambdaAccessPoint", this);
    cdk.requireProperty(props, "policyDocument", this);

    this.objectLambdaAccessPoint = props.objectLambdaAccessPoint;
    this.policyDocument = props.policyDocument;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "objectLambdaAccessPoint": this.objectLambdaAccessPoint,
      "policyDocument": this.policyDocument
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessPointPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessPointPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAccessPointPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3objectlambda-accesspointpolicy.html
 */
export interface CfnAccessPointPolicyProps {
  /**
   * An access point with an attached AWS Lambda function used to access transformed data from an Amazon S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3objectlambda-accesspointpolicy.html#cfn-s3objectlambda-accesspointpolicy-objectlambdaaccesspoint
   */
  readonly objectLambdaAccessPoint: string;

  /**
   * Object Lambda Access Point resource policy document.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3objectlambda-accesspointpolicy.html#cfn-s3objectlambda-accesspointpolicy-policydocument
   */
  readonly policyDocument: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnAccessPointPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessPointPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessPointPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("objectLambdaAccessPoint", cdk.requiredValidator)(properties.objectLambdaAccessPoint));
  errors.collect(cdk.propertyValidator("objectLambdaAccessPoint", cdk.validateString)(properties.objectLambdaAccessPoint));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  return errors.wrap("supplied properties not correct for \"CfnAccessPointPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessPointPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessPointPolicyPropsValidator(properties).assertSuccess();
  return {
    "ObjectLambdaAccessPoint": cdk.stringToCloudFormation(properties.objectLambdaAccessPoint),
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument)
  };
}

// @ts-ignore TS6133
function CfnAccessPointPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPointPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPointPolicyProps>();
  ret.addPropertyResult("objectLambdaAccessPoint", "ObjectLambdaAccessPoint", (properties.ObjectLambdaAccessPoint != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectLambdaAccessPoint) : undefined));
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyDocument) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}