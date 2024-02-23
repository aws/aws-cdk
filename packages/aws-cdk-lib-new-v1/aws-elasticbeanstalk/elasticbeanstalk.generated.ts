/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specify an AWS Elastic Beanstalk application by using the AWS::ElasticBeanstalk::Application resource in an AWS CloudFormation template.
 *
 * The AWS::ElasticBeanstalk::Application resource is an AWS Elastic Beanstalk Beanstalk resource type that specifies an Elastic Beanstalk application.
 *
 * @cloudformationResource AWS::ElasticBeanstalk::Application
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticBeanstalk::Application";

  /**
   * Build a CfnApplication from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplication(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A name for the Elastic Beanstalk application.
   */
  public applicationName?: string;

  /**
   * Your description of the application.
   */
  public description?: string;

  /**
   * Specifies an application resource lifecycle configuration to prevent your application from accumulating too many versions.
   */
  public resourceLifecycleConfig?: CfnApplication.ApplicationResourceLifecycleConfigProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps = {}) {
    super(scope, id, {
      "type": CfnApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.applicationName = props.applicationName;
    this.description = props.description;
    this.resourceLifecycleConfig = props.resourceLifecycleConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationName": this.applicationName,
      "description": this.description,
      "resourceLifecycleConfig": this.resourceLifecycleConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationPropsToCloudFormation(props);
  }
}

export namespace CfnApplication {
  /**
   * Use the `ApplicationResourceLifecycleConfig` property type to specify lifecycle settings for resources that belong to an AWS Elastic Beanstalk application when defining an AWS::ElasticBeanstalk::Application resource in an AWS CloudFormation template.
   *
   * The resource lifecycle configuration for an application. Defines lifecycle settings for resources that belong to the application, and the service role that Elastic Beanstalk assumes in order to apply lifecycle settings. The version lifecycle configuration defines lifecycle settings for application versions.
   *
   * `ApplicationResourceLifecycleConfig` is a property of the [AWS::ElasticBeanstalk::Application](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationresourcelifecycleconfig.html
   */
  export interface ApplicationResourceLifecycleConfigProperty {
    /**
     * The ARN of an IAM service role that Elastic Beanstalk has permission to assume.
     *
     * The `ServiceRole` property is required the first time that you provide a `ResourceLifecycleConfig` for the application. After you provide it once, Elastic Beanstalk persists the Service Role with the application, and you don't need to specify it again. You can, however, specify it in subsequent updates to change the Service Role to another value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationresourcelifecycleconfig.html#cfn-elasticbeanstalk-application-applicationresourcelifecycleconfig-servicerole
     */
    readonly serviceRole?: string;

    /**
     * Defines lifecycle settings for application versions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationresourcelifecycleconfig.html#cfn-elasticbeanstalk-application-applicationresourcelifecycleconfig-versionlifecycleconfig
     */
    readonly versionLifecycleConfig?: CfnApplication.ApplicationVersionLifecycleConfigProperty | cdk.IResolvable;
  }

  /**
   * Use the `ApplicationVersionLifecycleConfig` property type to specify application version lifecycle settings for an AWS Elastic Beanstalk application when defining an AWS::ElasticBeanstalk::Application resource in an AWS CloudFormation template.
   *
   * The application version lifecycle settings for an application. Defines the rules that Elastic Beanstalk applies to an application's versions in order to avoid hitting the per-region limit for application versions.
   *
   * When Elastic Beanstalk deletes an application version from its database, you can no longer deploy that version to an environment. The source bundle remains in S3 unless you configure the rule to delete it.
   *
   * `ApplicationVersionLifecycleConfig` is a property of the [ApplicationResourceLifecycleConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationresourcelifecycleconfig.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html
   */
  export interface ApplicationVersionLifecycleConfigProperty {
    /**
     * Specify a max age rule to restrict the length of time that application versions are retained for an application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html#cfn-elasticbeanstalk-application-applicationversionlifecycleconfig-maxagerule
     */
    readonly maxAgeRule?: cdk.IResolvable | CfnApplication.MaxAgeRuleProperty;

    /**
     * Specify a max count rule to restrict the number of application versions that are retained for an application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html#cfn-elasticbeanstalk-application-applicationversionlifecycleconfig-maxcountrule
     */
    readonly maxCountRule?: cdk.IResolvable | CfnApplication.MaxCountRuleProperty;
  }

  /**
   * Use the `MaxAgeRule` property type to specify a max count rule to restrict the number of application versions that are retained for an AWS Elastic Beanstalk application when defining an AWS::ElasticBeanstalk::Application resource in an AWS CloudFormation template.
   *
   * A lifecycle rule that deletes the oldest application version when the maximum count is exceeded.
   *
   * `MaxCountRule` is a property of the [ApplicationVersionLifecycleConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxcountrule.html
   */
  export interface MaxCountRuleProperty {
    /**
     * Set to `true` to delete a version's source bundle from Amazon S3 when Elastic Beanstalk deletes the application version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxcountrule.html#cfn-elasticbeanstalk-application-maxcountrule-deletesourcefroms3
     */
    readonly deleteSourceFromS3?: boolean | cdk.IResolvable;

    /**
     * Specify `true` to apply the rule, or `false` to disable it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxcountrule.html#cfn-elasticbeanstalk-application-maxcountrule-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * Specify the maximum number of application versions to retain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxcountrule.html#cfn-elasticbeanstalk-application-maxcountrule-maxcount
     */
    readonly maxCount?: number;
  }

  /**
   * Use the `MaxAgeRule` property type to specify a max age rule to restrict the length of time that application versions are retained for an AWS Elastic Beanstalk application when defining an AWS::ElasticBeanstalk::Application resource in an AWS CloudFormation template.
   *
   * A lifecycle rule that deletes application versions after the specified number of days.
   *
   * `MaxAgeRule` is a property of the [ApplicationVersionLifecycleConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-applicationversionlifecycleconfig.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxagerule.html
   */
  export interface MaxAgeRuleProperty {
    /**
     * Set to `true` to delete a version's source bundle from Amazon S3 when Elastic Beanstalk deletes the application version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxagerule.html#cfn-elasticbeanstalk-application-maxagerule-deletesourcefroms3
     */
    readonly deleteSourceFromS3?: boolean | cdk.IResolvable;

    /**
     * Specify `true` to apply the rule, or `false` to disable it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxagerule.html#cfn-elasticbeanstalk-application-maxagerule-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * Specify the number of days to retain an application versions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-application-maxagerule.html#cfn-elasticbeanstalk-application-maxagerule-maxageindays
     */
    readonly maxAgeInDays?: number;
  }
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html
 */
export interface CfnApplicationProps {
  /**
   * A name for the Elastic Beanstalk application.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the application name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html#cfn-elasticbeanstalk-application-applicationname
   */
  readonly applicationName?: string;

  /**
   * Your description of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html#cfn-elasticbeanstalk-application-description
   */
  readonly description?: string;

  /**
   * Specifies an application resource lifecycle configuration to prevent your application from accumulating too many versions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-application.html#cfn-elasticbeanstalk-application-resourcelifecycleconfig
   */
  readonly resourceLifecycleConfig?: CfnApplication.ApplicationResourceLifecycleConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `MaxCountRuleProperty`
 *
 * @param properties - the TypeScript properties of a `MaxCountRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationMaxCountRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deleteSourceFromS3", cdk.validateBoolean)(properties.deleteSourceFromS3));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("maxCount", cdk.validateNumber)(properties.maxCount));
  return errors.wrap("supplied properties not correct for \"MaxCountRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationMaxCountRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationMaxCountRulePropertyValidator(properties).assertSuccess();
  return {
    "DeleteSourceFromS3": cdk.booleanToCloudFormation(properties.deleteSourceFromS3),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "MaxCount": cdk.numberToCloudFormation(properties.maxCount)
  };
}

// @ts-ignore TS6133
function CfnApplicationMaxCountRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.MaxCountRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MaxCountRuleProperty>();
  ret.addPropertyResult("deleteSourceFromS3", "DeleteSourceFromS3", (properties.DeleteSourceFromS3 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteSourceFromS3) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("maxCount", "MaxCount", (properties.MaxCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCount) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MaxAgeRuleProperty`
 *
 * @param properties - the TypeScript properties of a `MaxAgeRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationMaxAgeRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deleteSourceFromS3", cdk.validateBoolean)(properties.deleteSourceFromS3));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("maxAgeInDays", cdk.validateNumber)(properties.maxAgeInDays));
  return errors.wrap("supplied properties not correct for \"MaxAgeRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationMaxAgeRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationMaxAgeRulePropertyValidator(properties).assertSuccess();
  return {
    "DeleteSourceFromS3": cdk.booleanToCloudFormation(properties.deleteSourceFromS3),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "MaxAgeInDays": cdk.numberToCloudFormation(properties.maxAgeInDays)
  };
}

// @ts-ignore TS6133
function CfnApplicationMaxAgeRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.MaxAgeRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MaxAgeRuleProperty>();
  ret.addPropertyResult("deleteSourceFromS3", "DeleteSourceFromS3", (properties.DeleteSourceFromS3 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteSourceFromS3) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("maxAgeInDays", "MaxAgeInDays", (properties.MaxAgeInDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAgeInDays) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApplicationVersionLifecycleConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationVersionLifecycleConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationApplicationVersionLifecycleConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxAgeRule", CfnApplicationMaxAgeRulePropertyValidator)(properties.maxAgeRule));
  errors.collect(cdk.propertyValidator("maxCountRule", CfnApplicationMaxCountRulePropertyValidator)(properties.maxCountRule));
  return errors.wrap("supplied properties not correct for \"ApplicationVersionLifecycleConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationApplicationVersionLifecycleConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationApplicationVersionLifecycleConfigPropertyValidator(properties).assertSuccess();
  return {
    "MaxAgeRule": convertCfnApplicationMaxAgeRulePropertyToCloudFormation(properties.maxAgeRule),
    "MaxCountRule": convertCfnApplicationMaxCountRulePropertyToCloudFormation(properties.maxCountRule)
  };
}

// @ts-ignore TS6133
function CfnApplicationApplicationVersionLifecycleConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApplicationVersionLifecycleConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApplicationVersionLifecycleConfigProperty>();
  ret.addPropertyResult("maxAgeRule", "MaxAgeRule", (properties.MaxAgeRule != null ? CfnApplicationMaxAgeRulePropertyFromCloudFormation(properties.MaxAgeRule) : undefined));
  ret.addPropertyResult("maxCountRule", "MaxCountRule", (properties.MaxCountRule != null ? CfnApplicationMaxCountRulePropertyFromCloudFormation(properties.MaxCountRule) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApplicationResourceLifecycleConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationResourceLifecycleConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationApplicationResourceLifecycleConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serviceRole", cdk.validateString)(properties.serviceRole));
  errors.collect(cdk.propertyValidator("versionLifecycleConfig", CfnApplicationApplicationVersionLifecycleConfigPropertyValidator)(properties.versionLifecycleConfig));
  return errors.wrap("supplied properties not correct for \"ApplicationResourceLifecycleConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationApplicationResourceLifecycleConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationApplicationResourceLifecycleConfigPropertyValidator(properties).assertSuccess();
  return {
    "ServiceRole": cdk.stringToCloudFormation(properties.serviceRole),
    "VersionLifecycleConfig": convertCfnApplicationApplicationVersionLifecycleConfigPropertyToCloudFormation(properties.versionLifecycleConfig)
  };
}

// @ts-ignore TS6133
function CfnApplicationApplicationResourceLifecycleConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApplicationResourceLifecycleConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApplicationResourceLifecycleConfigProperty>();
  ret.addPropertyResult("serviceRole", "ServiceRole", (properties.ServiceRole != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRole) : undefined));
  ret.addPropertyResult("versionLifecycleConfig", "VersionLifecycleConfig", (properties.VersionLifecycleConfig != null ? CfnApplicationApplicationVersionLifecycleConfigPropertyFromCloudFormation(properties.VersionLifecycleConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationName", cdk.validateString)(properties.applicationName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("resourceLifecycleConfig", CfnApplicationApplicationResourceLifecycleConfigPropertyValidator)(properties.resourceLifecycleConfig));
  return errors.wrap("supplied properties not correct for \"CfnApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationPropsValidator(properties).assertSuccess();
  return {
    "ApplicationName": cdk.stringToCloudFormation(properties.applicationName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ResourceLifecycleConfig": convertCfnApplicationApplicationResourceLifecycleConfigPropertyToCloudFormation(properties.resourceLifecycleConfig)
  };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
  ret.addPropertyResult("applicationName", "ApplicationName", (properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("resourceLifecycleConfig", "ResourceLifecycleConfig", (properties.ResourceLifecycleConfig != null ? CfnApplicationApplicationResourceLifecycleConfigPropertyFromCloudFormation(properties.ResourceLifecycleConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specify an AWS Elastic Beanstalk application version by using the AWS::ElasticBeanstalk::ApplicationVersion resource in an AWS CloudFormation template.
 *
 * The AWS::ElasticBeanstalk::ApplicationVersion resource is an AWS Elastic Beanstalk resource type that specifies an application version, an iteration of deployable code, for an Elastic Beanstalk application.
 *
 * > After you create an application version with a specified Amazon S3 bucket and key location, you can't change that Amazon S3 location. If you change the Amazon S3 location, an attempt to launch an environment from the application version will fail.
 *
 * @cloudformationResource AWS::ElasticBeanstalk::ApplicationVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html
 */
export class CfnApplicationVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticBeanstalk::ApplicationVersion";

  /**
   * Build a CfnApplicationVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplicationVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the Elastic Beanstalk application that is associated with this application version.
   */
  public applicationName: string;

  /**
   * A description of this application version.
   */
  public description?: string;

  /**
   * The Amazon S3 bucket and key that identify the location of the source bundle for this version.
   */
  public sourceBundle: cdk.IResolvable | CfnApplicationVersion.SourceBundleProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationVersionProps) {
    super(scope, id, {
      "type": CfnApplicationVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationName", this);
    cdk.requireProperty(props, "sourceBundle", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationName = props.applicationName;
    this.description = props.description;
    this.sourceBundle = props.sourceBundle;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationName": this.applicationName,
      "description": this.description,
      "sourceBundle": this.sourceBundle
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationVersionPropsToCloudFormation(props);
  }
}

export namespace CfnApplicationVersion {
  /**
   * Use the `SourceBundle` property type to specify the Amazon S3 location of the source bundle for an AWS Elastic Beanstalk application version when defining an AWS::ElasticBeanstalk::ApplicationVersion resource in an AWS CloudFormation template.
   *
   * The `SourceBundle` property is an embedded property of the [AWS::ElasticBeanstalk::ApplicationVersion](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-sourcebundle.html) resource. It specifies the Amazon S3 location of the source bundle for an AWS Elastic Beanstalk application version.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-applicationversion-sourcebundle.html
   */
  export interface SourceBundleProperty {
    /**
     * The Amazon S3 bucket where the data is located.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-applicationversion-sourcebundle.html#cfn-elasticbeanstalk-applicationversion-sourcebundle-s3bucket
     */
    readonly s3Bucket: string;

    /**
     * The Amazon S3 key where the data is located.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-applicationversion-sourcebundle.html#cfn-elasticbeanstalk-applicationversion-sourcebundle-s3key
     */
    readonly s3Key: string;
  }
}

/**
 * Properties for defining a `CfnApplicationVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html
 */
export interface CfnApplicationVersionProps {
  /**
   * The name of the Elastic Beanstalk application that is associated with this application version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html#cfn-elasticbeanstalk-applicationversion-applicationname
   */
  readonly applicationName: string;

  /**
   * A description of this application version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html#cfn-elasticbeanstalk-applicationversion-description
   */
  readonly description?: string;

  /**
   * The Amazon S3 bucket and key that identify the location of the source bundle for this version.
   *
   * > The Amazon S3 bucket must be in the same region as the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-applicationversion.html#cfn-elasticbeanstalk-applicationversion-sourcebundle
   */
  readonly sourceBundle: cdk.IResolvable | CfnApplicationVersion.SourceBundleProperty;
}

/**
 * Determine whether the given properties match those of a `SourceBundleProperty`
 *
 * @param properties - the TypeScript properties of a `SourceBundleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationVersionSourceBundlePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Key", cdk.requiredValidator)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3Key", cdk.validateString)(properties.s3Key));
  return errors.wrap("supplied properties not correct for \"SourceBundleProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationVersionSourceBundlePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationVersionSourceBundlePropertyValidator(properties).assertSuccess();
  return {
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Key": cdk.stringToCloudFormation(properties.s3Key)
  };
}

// @ts-ignore TS6133
function CfnApplicationVersionSourceBundlePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationVersion.SourceBundleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationVersion.SourceBundleProperty>();
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3Key", "S3Key", (properties.S3Key != null ? cfn_parse.FromCloudFormation.getString(properties.S3Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationName", cdk.requiredValidator)(properties.applicationName));
  errors.collect(cdk.propertyValidator("applicationName", cdk.validateString)(properties.applicationName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("sourceBundle", cdk.requiredValidator)(properties.sourceBundle));
  errors.collect(cdk.propertyValidator("sourceBundle", CfnApplicationVersionSourceBundlePropertyValidator)(properties.sourceBundle));
  return errors.wrap("supplied properties not correct for \"CfnApplicationVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationVersionPropsValidator(properties).assertSuccess();
  return {
    "ApplicationName": cdk.stringToCloudFormation(properties.applicationName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "SourceBundle": convertCfnApplicationVersionSourceBundlePropertyToCloudFormation(properties.sourceBundle)
  };
}

// @ts-ignore TS6133
function CfnApplicationVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationVersionProps>();
  ret.addPropertyResult("applicationName", "ApplicationName", (properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("sourceBundle", "SourceBundle", (properties.SourceBundle != null ? CfnApplicationVersionSourceBundlePropertyFromCloudFormation(properties.SourceBundle) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specify an AWS Elastic Beanstalk configuration template by using the AWS::ElasticBeanstalk::ConfigurationTemplate resource in an AWS CloudFormation template.
 *
 * The AWS::ElasticBeanstalk::ConfigurationTemplate resource is an AWS Elastic Beanstalk resource type that specifies an Elastic Beanstalk configuration template, associated with a specific Elastic Beanstalk application. You define application configuration settings in a configuration template. You can then use the configuration template to deploy different versions of the application with the same configuration settings.
 *
 * > The Elastic Beanstalk console and documentation often refer to configuration templates as *saved configurations* . When you set configuration options in a saved configuration (configuration template), Elastic Beanstalk applies them with a particular precedence as part of applying options from multiple sources. For more information, see [Configuration Options](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options.html) in the *AWS Elastic Beanstalk Developer Guide* .
 *
 * @cloudformationResource AWS::ElasticBeanstalk::ConfigurationTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html
 */
export class CfnConfigurationTemplate extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticBeanstalk::ConfigurationTemplate";

  /**
   * Build a CfnConfigurationTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfigurationTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfigurationTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the configuration template.
   *
   * Constraint: This name must be unique per application.
   *
   * @cloudformationAttribute TemplateName
   */
  public readonly attrTemplateName: string;

  /**
   * The name of the Elastic Beanstalk application to associate with this configuration template.
   */
  public applicationName: string;

  /**
   * An optional description for this configuration.
   */
  public description?: string;

  /**
   * The ID of an environment whose settings you want to use to create the configuration template.
   */
  public environmentId?: string;

  /**
   * Option values for the Elastic Beanstalk configuration, such as the instance type.
   */
  public optionSettings?: Array<CfnConfigurationTemplate.ConfigurationOptionSettingProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the custom platform.
   */
  public platformArn?: string;

  /**
   * The name of an Elastic Beanstalk solution stack (platform version) that this configuration uses.
   */
  public solutionStackName?: string;

  /**
   * An Elastic Beanstalk configuration template to base this one on.
   */
  public sourceConfiguration?: cdk.IResolvable | CfnConfigurationTemplate.SourceConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigurationTemplateProps) {
    super(scope, id, {
      "type": CfnConfigurationTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationName", this);

    this.attrTemplateName = cdk.Token.asString(this.getAtt("TemplateName", cdk.ResolutionTypeHint.STRING));
    this.applicationName = props.applicationName;
    this.description = props.description;
    this.environmentId = props.environmentId;
    this.optionSettings = props.optionSettings;
    this.platformArn = props.platformArn;
    this.solutionStackName = props.solutionStackName;
    this.sourceConfiguration = props.sourceConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationName": this.applicationName,
      "description": this.description,
      "environmentId": this.environmentId,
      "optionSettings": this.optionSettings,
      "platformArn": this.platformArn,
      "solutionStackName": this.solutionStackName,
      "sourceConfiguration": this.sourceConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfigurationTemplatePropsToCloudFormation(props);
  }
}

export namespace CfnConfigurationTemplate {
  /**
   * Use the `ConfigurationOptionSetting` property type to specify an option for an AWS Elastic Beanstalk configuration template when defining an AWS::ElasticBeanstalk::ConfigurationTemplate resource in an AWS CloudFormation template.
   *
   * The `ConfigurationOptionSetting` property type specifies an option for an AWS Elastic Beanstalk configuration template.
   *
   * The `OptionSettings` property of the [AWS::ElasticBeanstalk::ConfigurationTemplate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-beanstalk-configurationtemplate.html) resource contains a list of `ConfigurationOptionSetting` property types.
   *
   * For a list of possible namespaces and option values, see [Option Values](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options.html) in the *AWS Elastic Beanstalk Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-configurationoptionsetting.html
   */
  export interface ConfigurationOptionSettingProperty {
    /**
     * A unique namespace that identifies the option's associated AWS resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-configurationoptionsetting.html#cfn-elasticbeanstalk-configurationtemplate-configurationoptionsetting-namespace
     */
    readonly namespace: string;

    /**
     * The name of the configuration option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-configurationoptionsetting.html#cfn-elasticbeanstalk-configurationtemplate-configurationoptionsetting-optionname
     */
    readonly optionName: string;

    /**
     * A unique resource name for the option setting.
     *
     * Use it for a time–based scaling configuration option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-configurationoptionsetting.html#cfn-elasticbeanstalk-configurationtemplate-configurationoptionsetting-resourcename
     */
    readonly resourceName?: string;

    /**
     * The current value for the configuration option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-configurationoptionsetting.html#cfn-elasticbeanstalk-configurationtemplate-configurationoptionsetting-value
     */
    readonly value?: string;
  }

  /**
   * Use the `SourceConfiguration` property type to specify another AWS Elastic Beanstalk configuration template as the base to creating a new AWS::ElasticBeanstalk::ConfigurationTemplate resource in an AWS CloudFormation template.
   *
   * An AWS Elastic Beanstalk configuration template to base a new one on. You can use it to define a [AWS::ElasticBeanstalk::ConfigurationTemplate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-beanstalk-configurationtemplate.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-sourceconfiguration.html
   */
  export interface SourceConfigurationProperty {
    /**
     * The name of the application associated with the configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-sourceconfiguration.html#cfn-elasticbeanstalk-configurationtemplate-sourceconfiguration-applicationname
     */
    readonly applicationName: string;

    /**
     * The name of the configuration template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-configurationtemplate-sourceconfiguration.html#cfn-elasticbeanstalk-configurationtemplate-sourceconfiguration-templatename
     */
    readonly templateName: string;
  }
}

/**
 * Properties for defining a `CfnConfigurationTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html
 */
export interface CfnConfigurationTemplateProps {
  /**
   * The name of the Elastic Beanstalk application to associate with this configuration template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-applicationname
   */
  readonly applicationName: string;

  /**
   * An optional description for this configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-description
   */
  readonly description?: string;

  /**
   * The ID of an environment whose settings you want to use to create the configuration template.
   *
   * You must specify `EnvironmentId` if you don't specify `PlatformArn` , `SolutionStackName` , or `SourceConfiguration` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-environmentid
   */
  readonly environmentId?: string;

  /**
   * Option values for the Elastic Beanstalk configuration, such as the instance type.
   *
   * If specified, these values override the values obtained from the solution stack or the source configuration template. For a complete list of Elastic Beanstalk configuration options, see [Option Values](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options.html) in the *AWS Elastic Beanstalk Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-optionsettings
   */
  readonly optionSettings?: Array<CfnConfigurationTemplate.ConfigurationOptionSettingProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the custom platform.
   *
   * For more information, see [Custom Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/custom-platforms.html) in the *AWS Elastic Beanstalk Developer Guide* .
   *
   * > If you specify `PlatformArn` , then don't specify `SolutionStackName` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-platformarn
   */
  readonly platformArn?: string;

  /**
   * The name of an Elastic Beanstalk solution stack (platform version) that this configuration uses.
   *
   * For example, `64bit Amazon Linux 2013.09 running Tomcat 7 Java 7` . A solution stack specifies the operating system, runtime, and application server for a configuration template. It also determines the set of configuration options as well as the possible and default values. For more information, see [Supported Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.platforms.html) in the *AWS Elastic Beanstalk Developer Guide* .
   *
   * You must specify `SolutionStackName` if you don't specify `PlatformArn` , `EnvironmentId` , or `SourceConfiguration` .
   *
   * Use the [`ListAvailableSolutionStacks`](https://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_ListAvailableSolutionStacks.html) API to obtain a list of available solution stacks.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-solutionstackname
   */
  readonly solutionStackName?: string;

  /**
   * An Elastic Beanstalk configuration template to base this one on.
   *
   * If specified, Elastic Beanstalk uses the configuration values from the specified configuration template to create a new configuration.
   *
   * Values specified in `OptionSettings` override any values obtained from the `SourceConfiguration` .
   *
   * You must specify `SourceConfiguration` if you don't specify `PlatformArn` , `EnvironmentId` , or `SolutionStackName` .
   *
   * Constraint: If both solution stack name and source configuration are specified, the solution stack of the source configuration template must match the specified solution stack name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-configurationtemplate.html#cfn-elasticbeanstalk-configurationtemplate-sourceconfiguration
   */
  readonly sourceConfiguration?: cdk.IResolvable | CfnConfigurationTemplate.SourceConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `ConfigurationOptionSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationOptionSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationTemplateConfigurationOptionSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("namespace", cdk.requiredValidator)(properties.namespace));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  errors.collect(cdk.propertyValidator("optionName", cdk.requiredValidator)(properties.optionName));
  errors.collect(cdk.propertyValidator("optionName", cdk.validateString)(properties.optionName));
  errors.collect(cdk.propertyValidator("resourceName", cdk.validateString)(properties.resourceName));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ConfigurationOptionSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationTemplateConfigurationOptionSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationTemplateConfigurationOptionSettingPropertyValidator(properties).assertSuccess();
  return {
    "Namespace": cdk.stringToCloudFormation(properties.namespace),
    "OptionName": cdk.stringToCloudFormation(properties.optionName),
    "ResourceName": cdk.stringToCloudFormation(properties.resourceName),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnConfigurationTemplateConfigurationOptionSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationTemplate.ConfigurationOptionSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationTemplate.ConfigurationOptionSettingProperty>();
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addPropertyResult("optionName", "OptionName", (properties.OptionName != null ? cfn_parse.FromCloudFormation.getString(properties.OptionName) : undefined));
  ret.addPropertyResult("resourceName", "ResourceName", (properties.ResourceName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceName) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationTemplateSourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationName", cdk.requiredValidator)(properties.applicationName));
  errors.collect(cdk.propertyValidator("applicationName", cdk.validateString)(properties.applicationName));
  errors.collect(cdk.propertyValidator("templateName", cdk.requiredValidator)(properties.templateName));
  errors.collect(cdk.propertyValidator("templateName", cdk.validateString)(properties.templateName));
  return errors.wrap("supplied properties not correct for \"SourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationTemplateSourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationTemplateSourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ApplicationName": cdk.stringToCloudFormation(properties.applicationName),
    "TemplateName": cdk.stringToCloudFormation(properties.templateName)
  };
}

// @ts-ignore TS6133
function CfnConfigurationTemplateSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationTemplate.SourceConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationTemplate.SourceConfigurationProperty>();
  ret.addPropertyResult("applicationName", "ApplicationName", (properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined));
  ret.addPropertyResult("templateName", "TemplateName", (properties.TemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationName", cdk.requiredValidator)(properties.applicationName));
  errors.collect(cdk.propertyValidator("applicationName", cdk.validateString)(properties.applicationName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("environmentId", cdk.validateString)(properties.environmentId));
  errors.collect(cdk.propertyValidator("optionSettings", cdk.listValidator(CfnConfigurationTemplateConfigurationOptionSettingPropertyValidator))(properties.optionSettings));
  errors.collect(cdk.propertyValidator("platformArn", cdk.validateString)(properties.platformArn));
  errors.collect(cdk.propertyValidator("solutionStackName", cdk.validateString)(properties.solutionStackName));
  errors.collect(cdk.propertyValidator("sourceConfiguration", CfnConfigurationTemplateSourceConfigurationPropertyValidator)(properties.sourceConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnConfigurationTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationTemplatePropsValidator(properties).assertSuccess();
  return {
    "ApplicationName": cdk.stringToCloudFormation(properties.applicationName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EnvironmentId": cdk.stringToCloudFormation(properties.environmentId),
    "OptionSettings": cdk.listMapper(convertCfnConfigurationTemplateConfigurationOptionSettingPropertyToCloudFormation)(properties.optionSettings),
    "PlatformArn": cdk.stringToCloudFormation(properties.platformArn),
    "SolutionStackName": cdk.stringToCloudFormation(properties.solutionStackName),
    "SourceConfiguration": convertCfnConfigurationTemplateSourceConfigurationPropertyToCloudFormation(properties.sourceConfiguration)
  };
}

// @ts-ignore TS6133
function CfnConfigurationTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationTemplateProps>();
  ret.addPropertyResult("applicationName", "ApplicationName", (properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("environmentId", "EnvironmentId", (properties.EnvironmentId != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentId) : undefined));
  ret.addPropertyResult("optionSettings", "OptionSettings", (properties.OptionSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationTemplateConfigurationOptionSettingPropertyFromCloudFormation)(properties.OptionSettings) : undefined));
  ret.addPropertyResult("platformArn", "PlatformArn", (properties.PlatformArn != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformArn) : undefined));
  ret.addPropertyResult("solutionStackName", "SolutionStackName", (properties.SolutionStackName != null ? cfn_parse.FromCloudFormation.getString(properties.SolutionStackName) : undefined));
  ret.addPropertyResult("sourceConfiguration", "SourceConfiguration", (properties.SourceConfiguration != null ? CfnConfigurationTemplateSourceConfigurationPropertyFromCloudFormation(properties.SourceConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specify an AWS Elastic Beanstalk environment by using the AWS::ElasticBeanstalk::Environment resource in an AWS CloudFormation template.
 *
 * The AWS::ElasticBeanstalk::Environment resource is an AWS Elastic Beanstalk resource type that specifies an Elastic Beanstalk environment.
 *
 * @cloudformationResource AWS::ElasticBeanstalk::Environment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticBeanstalk::Environment";

  /**
   * Build a CfnEnvironment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnvironment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEnvironmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEnvironment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * For load-balanced, autoscaling environments, the URL to the load balancer. For single-instance environments, the IP address of the instance.
   *
   * Example load balancer URL:
   *
   * Example instance IP address:
   *
   * `192.0.2.0`
   *
   * @cloudformationAttribute EndpointURL
   */
  public readonly attrEndpointUrl: string;

  /**
   * The name of the application that is associated with this environment.
   */
  public applicationName: string;

  /**
   * If specified, the environment attempts to use this value as the prefix for the CNAME in your Elastic Beanstalk environment URL.
   */
  public cnamePrefix?: string;

  /**
   * Your description for this environment.
   */
  public description?: string;

  /**
   * A unique name for the environment.
   */
  public environmentName?: string;

  /**
   * > The operations role feature of AWS Elastic Beanstalk is in beta release and is subject to change.
   */
  public operationsRole?: string;

  /**
   * Key-value pairs defining configuration options for this environment, such as the instance type.
   */
  public optionSettings?: Array<cdk.IResolvable | CfnEnvironment.OptionSettingProperty> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the custom platform to use with the environment.
   */
  public platformArn?: string;

  /**
   * The name of an Elastic Beanstalk solution stack (platform version) to use with the environment.
   */
  public solutionStackName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies the tags applied to resources in the environment.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name of the Elastic Beanstalk configuration template to use with the environment.
   */
  public templateName?: string;

  /**
   * Specifies the tier to use in creating this environment.
   */
  public tier?: cdk.IResolvable | CfnEnvironment.TierProperty;

  /**
   * The name of the application version to deploy.
   */
  public versionLabel?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentProps) {
    super(scope, id, {
      "type": CfnEnvironment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationName", this);

    this.attrEndpointUrl = cdk.Token.asString(this.getAtt("EndpointURL", cdk.ResolutionTypeHint.STRING));
    this.applicationName = props.applicationName;
    this.cnamePrefix = props.cnamePrefix;
    this.description = props.description;
    this.environmentName = props.environmentName;
    this.operationsRole = props.operationsRole;
    this.optionSettings = props.optionSettings;
    this.platformArn = props.platformArn;
    this.solutionStackName = props.solutionStackName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElasticBeanstalk::Environment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.templateName = props.templateName;
    this.tier = props.tier;
    this.versionLabel = props.versionLabel;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationName": this.applicationName,
      "cnamePrefix": this.cnamePrefix,
      "description": this.description,
      "environmentName": this.environmentName,
      "operationsRole": this.operationsRole,
      "optionSettings": this.optionSettings,
      "platformArn": this.platformArn,
      "solutionStackName": this.solutionStackName,
      "tags": this.tags.renderTags(),
      "templateName": this.templateName,
      "tier": this.tier,
      "versionLabel": this.versionLabel
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnvironment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEnvironmentPropsToCloudFormation(props);
  }
}

export namespace CfnEnvironment {
  /**
   * Use the `Tier` property type to specify the environment tier for an AWS Elastic Beanstalk environment when defining an AWS::ElasticBeanstalk::Environment resource in an AWS CloudFormation template.
   *
   * Describes the environment tier for an [AWS::ElasticBeanstalk::Environment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-environment.html) resource. For more information, see [Environment Tiers](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html) in the *AWS Elastic Beanstalk Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-tier.html
   */
  export interface TierProperty {
    /**
     * The name of this environment tier.
     *
     * Valid values:
     *
     * - For *Web server tier* – `WebServer`
     * - For *Worker tier* – `Worker`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-tier.html#cfn-elasticbeanstalk-environment-tier-name
     */
    readonly name?: string;

    /**
     * The type of this environment tier.
     *
     * Valid values:
     *
     * - For *Web server tier* – `Standard`
     * - For *Worker tier* – `SQS/HTTP`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-tier.html#cfn-elasticbeanstalk-environment-tier-type
     */
    readonly type?: string;

    /**
     * The version of this environment tier.
     *
     * When you don't set a value to it, Elastic Beanstalk uses the latest compatible worker tier version.
     *
     * > This member is deprecated. Any specific version that you set may become out of date. We recommend leaving it unspecified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-tier.html#cfn-elasticbeanstalk-environment-tier-version
     */
    readonly version?: string;
  }

  /**
   * Use the `OptionSetting` property type to specify an option for an AWS Elastic Beanstalk environment when defining an AWS::ElasticBeanstalk::Environment resource in an AWS CloudFormation template.
   *
   * The `OptionSetting` property type specifies an option for an AWS Elastic Beanstalk environment.
   *
   * The `OptionSettings` property of the [AWS::ElasticBeanstalk::Environment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-beanstalk-environment.html) resource contains a list of `OptionSetting` property types.
   *
   * For a list of possible namespaces and option values, see [Option Values](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options.html) in the *AWS Elastic Beanstalk Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-optionsetting.html
   */
  export interface OptionSettingProperty {
    /**
     * A unique namespace that identifies the option's associated AWS resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-optionsetting.html#cfn-elasticbeanstalk-environment-optionsetting-namespace
     */
    readonly namespace: string;

    /**
     * The name of the configuration option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-optionsetting.html#cfn-elasticbeanstalk-environment-optionsetting-optionname
     */
    readonly optionName: string;

    /**
     * A unique resource name for the option setting.
     *
     * Use it for a time–based scaling configuration option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-optionsetting.html#cfn-elasticbeanstalk-environment-optionsetting-resourcename
     */
    readonly resourceName?: string;

    /**
     * The current value for the configuration option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticbeanstalk-environment-optionsetting.html#cfn-elasticbeanstalk-environment-optionsetting-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html
 */
export interface CfnEnvironmentProps {
  /**
   * The name of the application that is associated with this environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-applicationname
   */
  readonly applicationName: string;

  /**
   * If specified, the environment attempts to use this value as the prefix for the CNAME in your Elastic Beanstalk environment URL.
   *
   * If not specified, the CNAME is generated automatically by appending a random alphanumeric string to the environment name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-cnameprefix
   */
  readonly cnamePrefix?: string;

  /**
   * Your description for this environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-description
   */
  readonly description?: string;

  /**
   * A unique name for the environment.
   *
   * Constraint: Must be from 4 to 40 characters in length. The name can contain only letters, numbers, and hyphens. It can't start or end with a hyphen. This name must be unique within a region in your account.
   *
   * If you don't specify the `CNAMEPrefix` parameter, the environment name becomes part of the CNAME, and therefore part of the visible URL for your application.
   *
   * If you don't specify an environment name, AWS CloudFormation generates a unique physical ID and uses that ID for the environment name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-environmentname
   */
  readonly environmentName?: string;

  /**
   * > The operations role feature of AWS Elastic Beanstalk is in beta release and is subject to change.
   *
   * The Amazon Resource Name (ARN) of an existing IAM role to be used as the environment's operations role. If specified, Elastic Beanstalk uses the operations role for permissions to downstream services during this call and during subsequent calls acting on this environment. To specify an operations role, you must have the `iam:PassRole` permission for the role.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-operationsrole
   */
  readonly operationsRole?: string;

  /**
   * Key-value pairs defining configuration options for this environment, such as the instance type.
   *
   * These options override the values that are defined in the solution stack or the [configuration template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-beanstalk-configurationtemplate.html) . If you remove any options during a stack update, the removed options retain their current values.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-optionsettings
   */
  readonly optionSettings?: Array<cdk.IResolvable | CfnEnvironment.OptionSettingProperty> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the custom platform to use with the environment.
   *
   * For more information, see [Custom Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/custom-platforms.html) in the *AWS Elastic Beanstalk Developer Guide* .
   *
   * > If you specify `PlatformArn` , don't specify `SolutionStackName` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-platformarn
   */
  readonly platformArn?: string;

  /**
   * The name of an Elastic Beanstalk solution stack (platform version) to use with the environment.
   *
   * If specified, Elastic Beanstalk sets the configuration values to the default values associated with the specified solution stack. For a list of current solution stacks, see [Elastic Beanstalk Supported Platforms](https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html) in the *AWS Elastic Beanstalk Platforms* guide.
   *
   * > If you specify `SolutionStackName` , don't specify `PlatformArn` or `TemplateName` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-solutionstackname
   */
  readonly solutionStackName?: string;

  /**
   * Specifies the tags applied to resources in the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the Elastic Beanstalk configuration template to use with the environment.
   *
   * > If you specify `TemplateName` , then don't specify `SolutionStackName` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-templatename
   */
  readonly templateName?: string;

  /**
   * Specifies the tier to use in creating this environment.
   *
   * The environment tier that you choose determines whether Elastic Beanstalk provisions resources to support a web application that handles HTTP(S) requests or a web application that handles background-processing tasks.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-tier
   */
  readonly tier?: cdk.IResolvable | CfnEnvironment.TierProperty;

  /**
   * The name of the application version to deploy.
   *
   * Default: If not specified, Elastic Beanstalk attempts to deploy the sample application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticbeanstalk-environment.html#cfn-elasticbeanstalk-environment-versionlabel
   */
  readonly versionLabel?: string;
}

/**
 * Determine whether the given properties match those of a `TierProperty`
 *
 * @param properties - the TypeScript properties of a `TierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentTierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"TierProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentTierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentTierPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentTierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEnvironment.TierProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.TierProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OptionSettingProperty`
 *
 * @param properties - the TypeScript properties of a `OptionSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentOptionSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("namespace", cdk.requiredValidator)(properties.namespace));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  errors.collect(cdk.propertyValidator("optionName", cdk.requiredValidator)(properties.optionName));
  errors.collect(cdk.propertyValidator("optionName", cdk.validateString)(properties.optionName));
  errors.collect(cdk.propertyValidator("resourceName", cdk.validateString)(properties.resourceName));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"OptionSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentOptionSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentOptionSettingPropertyValidator(properties).assertSuccess();
  return {
    "Namespace": cdk.stringToCloudFormation(properties.namespace),
    "OptionName": cdk.stringToCloudFormation(properties.optionName),
    "ResourceName": cdk.stringToCloudFormation(properties.resourceName),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentOptionSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEnvironment.OptionSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.OptionSettingProperty>();
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addPropertyResult("optionName", "OptionName", (properties.OptionName != null ? cfn_parse.FromCloudFormation.getString(properties.OptionName) : undefined));
  ret.addPropertyResult("resourceName", "ResourceName", (properties.ResourceName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceName) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEnvironmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationName", cdk.requiredValidator)(properties.applicationName));
  errors.collect(cdk.propertyValidator("applicationName", cdk.validateString)(properties.applicationName));
  errors.collect(cdk.propertyValidator("cnamePrefix", cdk.validateString)(properties.cnamePrefix));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("environmentName", cdk.validateString)(properties.environmentName));
  errors.collect(cdk.propertyValidator("operationsRole", cdk.validateString)(properties.operationsRole));
  errors.collect(cdk.propertyValidator("optionSettings", cdk.listValidator(CfnEnvironmentOptionSettingPropertyValidator))(properties.optionSettings));
  errors.collect(cdk.propertyValidator("platformArn", cdk.validateString)(properties.platformArn));
  errors.collect(cdk.propertyValidator("solutionStackName", cdk.validateString)(properties.solutionStackName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("templateName", cdk.validateString)(properties.templateName));
  errors.collect(cdk.propertyValidator("tier", CfnEnvironmentTierPropertyValidator)(properties.tier));
  errors.collect(cdk.propertyValidator("versionLabel", cdk.validateString)(properties.versionLabel));
  return errors.wrap("supplied properties not correct for \"CfnEnvironmentProps\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentPropsValidator(properties).assertSuccess();
  return {
    "ApplicationName": cdk.stringToCloudFormation(properties.applicationName),
    "CNAMEPrefix": cdk.stringToCloudFormation(properties.cnamePrefix),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EnvironmentName": cdk.stringToCloudFormation(properties.environmentName),
    "OperationsRole": cdk.stringToCloudFormation(properties.operationsRole),
    "OptionSettings": cdk.listMapper(convertCfnEnvironmentOptionSettingPropertyToCloudFormation)(properties.optionSettings),
    "PlatformArn": cdk.stringToCloudFormation(properties.platformArn),
    "SolutionStackName": cdk.stringToCloudFormation(properties.solutionStackName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TemplateName": cdk.stringToCloudFormation(properties.templateName),
    "Tier": convertCfnEnvironmentTierPropertyToCloudFormation(properties.tier),
    "VersionLabel": cdk.stringToCloudFormation(properties.versionLabel)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentProps>();
  ret.addPropertyResult("applicationName", "ApplicationName", (properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined));
  ret.addPropertyResult("cnamePrefix", "CNAMEPrefix", (properties.CNAMEPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.CNAMEPrefix) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("environmentName", "EnvironmentName", (properties.EnvironmentName != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentName) : undefined));
  ret.addPropertyResult("operationsRole", "OperationsRole", (properties.OperationsRole != null ? cfn_parse.FromCloudFormation.getString(properties.OperationsRole) : undefined));
  ret.addPropertyResult("optionSettings", "OptionSettings", (properties.OptionSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnEnvironmentOptionSettingPropertyFromCloudFormation)(properties.OptionSettings) : undefined));
  ret.addPropertyResult("platformArn", "PlatformArn", (properties.PlatformArn != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformArn) : undefined));
  ret.addPropertyResult("solutionStackName", "SolutionStackName", (properties.SolutionStackName != null ? cfn_parse.FromCloudFormation.getString(properties.SolutionStackName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("templateName", "TemplateName", (properties.TemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateName) : undefined));
  ret.addPropertyResult("tier", "Tier", (properties.Tier != null ? CfnEnvironmentTierPropertyFromCloudFormation(properties.Tier) : undefined));
  ret.addPropertyResult("versionLabel", "VersionLabel", (properties.VersionLabel != null ? cfn_parse.FromCloudFormation.getString(properties.VersionLabel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}