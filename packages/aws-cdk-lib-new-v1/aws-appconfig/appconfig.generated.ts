/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::AppConfig::Application` resource creates an application.
 *
 * In AWS AppConfig , an application is simply an organizational construct like a folder. This organizational construct has a relationship with some unit of executable code. For example, you could create an application called MyMobileApp to organize and manage configuration data for a mobile application installed by your users.
 *
 * AWS AppConfig requires that you create resources and deploy a configuration in the following order:
 *
 * - Create an application
 * - Create an environment
 * - Create a configuration profile
 * - Create a deployment strategy
 * - Deploy the configuration
 *
 * For more information, see [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::Application
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppConfig::Application";

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
   * The application ID.
   *
   * @cloudformationAttribute ApplicationId
   */
  public readonly attrApplicationId: string;

  /**
   * A description of the application.
   */
  public description?: string;

  /**
   * A name for the application.
   */
  public name: string;

  /**
   * Metadata to assign to the application.
   */
  public tags?: Array<CfnApplication.TagsProperty>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
    super(scope, id, {
      "type": CfnApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrApplicationId = cdk.Token.asString(this.getAtt("ApplicationId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationPropsToCloudFormation(props);
  }
}

export namespace CfnApplication {
  /**
   * Metadata to assign to the application.
   *
   * Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-application-tags.html
   */
  export interface TagsProperty {
    /**
     * The key-value string map.
     *
     * The valid character set is `[a-zA-Z+-=._:/]` . The tag key can be up to 128 characters and must not start with `aws:` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-application-tags.html#cfn-appconfig-application-tags-key
     */
    readonly key?: string;

    /**
     * The tag value can be up to 256 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-application-tags.html#cfn-appconfig-application-tags-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html
 */
export interface CfnApplicationProps {
  /**
   * A description of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html#cfn-appconfig-application-description
   */
  readonly description?: string;

  /**
   * A name for the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html#cfn-appconfig-application-name
   */
  readonly name: string;

  /**
   * Metadata to assign to the application.
   *
   * Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-application.html#cfn-appconfig-application-tags
   */
  readonly tags?: Array<CfnApplication.TagsProperty>;
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationTagsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationTagsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationTagsPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnApplicationTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.TagsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.TagsProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
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
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnApplicationTagsPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(convertCfnApplicationTagsPropertyToCloudFormation)(properties.tags)
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
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationTagsPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppConfig::ConfigurationProfile` resource creates a configuration profile that enables AWS AppConfig to access the configuration source.
 *
 * Valid configuration sources include AWS Systems Manager (SSM) documents, SSM Parameter Store parameters, and Amazon S3 . A configuration profile includes the following information.
 *
 * - The Uri location of the configuration data.
 * - The AWS Identity and Access Management ( IAM ) role that provides access to the configuration data.
 * - A validator for the configuration data. Available validators include either a JSON Schema or the Amazon Resource Name (ARN) of an AWS Lambda function.
 *
 * AWS AppConfig requires that you create resources and deploy a configuration in the following order:
 *
 * - Create an application
 * - Create an environment
 * - Create a configuration profile
 * - Create a deployment strategy
 * - Deploy the configuration
 *
 * For more information, see [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::ConfigurationProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html
 */
export class CfnConfigurationProfile extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppConfig::ConfigurationProfile";

  /**
   * Build a CfnConfigurationProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfigurationProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfigurationProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The configuration profile ID.
   *
   * @cloudformationAttribute ConfigurationProfileId
   */
  public readonly attrConfigurationProfileId: string;

  /**
   * The Amazon Resource Name of the AWS Key Management Service key to encrypt new configuration data versions in the AWS AppConfig hosted configuration store. This attribute is only used for hosted configuration types. To encrypt data managed in other configuration stores, see the documentation for how to specify an AWS KMS key for that particular service.
   *
   * @cloudformationAttribute KmsKeyArn
   */
  public readonly attrKmsKeyArn: string;

  /**
   * The application ID.
   */
  public applicationId: string;

  /**
   * A description of the configuration profile.
   */
  public description?: string;

  /**
   * The AWS Key Management Service key identifier (key ID, key alias, or key ARN) provided when the resource was created or updated.
   */
  public kmsKeyIdentifier?: string;

  /**
   * A URI to locate the configuration. You can specify the following:.
   */
  public locationUri: string;

  /**
   * A name for the configuration profile.
   */
  public name: string;

  /**
   * The ARN of an IAM role with permission to access the configuration at the specified `LocationUri` .
   */
  public retrievalRoleArn?: string;

  /**
   * Metadata to assign to the configuration profile.
   */
  public tags?: Array<CfnConfigurationProfile.TagsProperty>;

  /**
   * The type of configurations contained in the profile.
   */
  public type?: string;

  /**
   * A list of methods for validating the configuration.
   */
  public validators?: Array<cdk.IResolvable | CfnConfigurationProfile.ValidatorsProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigurationProfileProps) {
    super(scope, id, {
      "type": CfnConfigurationProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);
    cdk.requireProperty(props, "locationUri", this);
    cdk.requireProperty(props, "name", this);

    this.attrConfigurationProfileId = cdk.Token.asString(this.getAtt("ConfigurationProfileId", cdk.ResolutionTypeHint.STRING));
    this.attrKmsKeyArn = cdk.Token.asString(this.getAtt("KmsKeyArn", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.description = props.description;
    this.kmsKeyIdentifier = props.kmsKeyIdentifier;
    this.locationUri = props.locationUri;
    this.name = props.name;
    this.retrievalRoleArn = props.retrievalRoleArn;
    this.tags = props.tags;
    this.type = props.type;
    this.validators = props.validators;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "description": this.description,
      "kmsKeyIdentifier": this.kmsKeyIdentifier,
      "locationUri": this.locationUri,
      "name": this.name,
      "retrievalRoleArn": this.retrievalRoleArn,
      "tags": this.tags,
      "type": this.type,
      "validators": this.validators
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfigurationProfilePropsToCloudFormation(props);
  }
}

export namespace CfnConfigurationProfile {
  /**
   * A validator provides a syntactic or semantic check to ensure the configuration that you want to deploy functions as intended.
   *
   * To validate your application configuration data, you provide a schema or an AWS Lambda function that runs against the configuration. The configuration deployment or update can only proceed when the configuration data is valid.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-validators.html
   */
  export interface ValidatorsProperty {
    /**
     * Either the JSON Schema content or the Amazon Resource Name (ARN) of an Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-validators.html#cfn-appconfig-configurationprofile-validators-content
     */
    readonly content?: string;

    /**
     * AWS AppConfig supports validators of type `JSON_SCHEMA` and `LAMBDA`.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-validators.html#cfn-appconfig-configurationprofile-validators-type
     */
    readonly type?: string;
  }

  /**
   * Metadata to assign to the configuration profile.
   *
   * Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-tags.html
   */
  export interface TagsProperty {
    /**
     * The key-value string map.
     *
     * The valid character set is `[a-zA-Z+-=._:/]` . The tag key can be up to 128 characters and must not start with `aws:` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-tags.html#cfn-appconfig-configurationprofile-tags-key
     */
    readonly key?: string;

    /**
     * The tag value can be up to 256 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-configurationprofile-tags.html#cfn-appconfig-configurationprofile-tags-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnConfigurationProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html
 */
export interface CfnConfigurationProfileProps {
  /**
   * The application ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-applicationid
   */
  readonly applicationId: string;

  /**
   * A description of the configuration profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-description
   */
  readonly description?: string;

  /**
   * The AWS Key Management Service key identifier (key ID, key alias, or key ARN) provided when the resource was created or updated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-kmskeyidentifier
   */
  readonly kmsKeyIdentifier?: string;

  /**
   * A URI to locate the configuration. You can specify the following:.
   *
   * - For the AWS AppConfig hosted configuration store and for feature flags, specify `hosted` .
   * - For an AWS Systems Manager Parameter Store parameter, specify either the parameter name in the format `ssm-parameter://<parameter name>` or the ARN.
   * - For an AWS CodePipeline pipeline, specify the URI in the following format: `codepipeline` ://<pipeline name>.
   * - For an AWS Secrets Manager secret, specify the URI in the following format: `secretsmanager` ://<secret name>.
   * - For an Amazon S3 object, specify the URI in the following format: `s3://<bucket>/<objectKey>` . Here is an example: `s3://my-bucket/my-app/us-east-1/my-config.json`
   * - For an SSM document, specify either the document name in the format `ssm-document://<document name>` or the Amazon Resource Name (ARN).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-locationuri
   */
  readonly locationUri: string;

  /**
   * A name for the configuration profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-name
   */
  readonly name: string;

  /**
   * The ARN of an IAM role with permission to access the configuration at the specified `LocationUri` .
   *
   * > A retrieval role ARN is not required for configurations stored in the AWS AppConfig hosted configuration store. It is required for all other sources that store your configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-retrievalrolearn
   */
  readonly retrievalRoleArn?: string;

  /**
   * Metadata to assign to the configuration profile.
   *
   * Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-tags
   */
  readonly tags?: Array<CfnConfigurationProfile.TagsProperty>;

  /**
   * The type of configurations contained in the profile.
   *
   * AWS AppConfig supports `feature flags` and `freeform` configurations. We recommend you create feature flag configurations to enable or disable new features and freeform configurations to distribute configurations to an application. When calling this API, enter one of the following values for `Type` :
   *
   * `AWS.AppConfig.FeatureFlags`
   *
   * `AWS.Freeform`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-type
   */
  readonly type?: string;

  /**
   * A list of methods for validating the configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-configurationprofile.html#cfn-appconfig-configurationprofile-validators
   */
  readonly validators?: Array<cdk.IResolvable | CfnConfigurationProfile.ValidatorsProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ValidatorsProperty`
 *
 * @param properties - the TypeScript properties of a `ValidatorsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationProfileValidatorsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("content", cdk.validateString)(properties.content));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ValidatorsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationProfileValidatorsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationProfileValidatorsPropertyValidator(properties).assertSuccess();
  return {
    "Content": cdk.stringToCloudFormation(properties.content),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnConfigurationProfileValidatorsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationProfile.ValidatorsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationProfile.ValidatorsProperty>();
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getString(properties.Content) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationProfileTagsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationProfileTagsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationProfileTagsPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnConfigurationProfileTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationProfile.TagsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationProfile.TagsProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("kmsKeyIdentifier", cdk.validateString)(properties.kmsKeyIdentifier));
  errors.collect(cdk.propertyValidator("locationUri", cdk.requiredValidator)(properties.locationUri));
  errors.collect(cdk.propertyValidator("locationUri", cdk.validateString)(properties.locationUri));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("retrievalRoleArn", cdk.validateString)(properties.retrievalRoleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnConfigurationProfileTagsPropertyValidator))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("validators", cdk.listValidator(CfnConfigurationProfileValidatorsPropertyValidator))(properties.validators));
  return errors.wrap("supplied properties not correct for \"CfnConfigurationProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationProfilePropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "KmsKeyIdentifier": cdk.stringToCloudFormation(properties.kmsKeyIdentifier),
    "LocationUri": cdk.stringToCloudFormation(properties.locationUri),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RetrievalRoleArn": cdk.stringToCloudFormation(properties.retrievalRoleArn),
    "Tags": cdk.listMapper(convertCfnConfigurationProfileTagsPropertyToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Validators": cdk.listMapper(convertCfnConfigurationProfileValidatorsPropertyToCloudFormation)(properties.validators)
  };
}

// @ts-ignore TS6133
function CfnConfigurationProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationProfileProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("kmsKeyIdentifier", "KmsKeyIdentifier", (properties.KmsKeyIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyIdentifier) : undefined));
  ret.addPropertyResult("locationUri", "LocationUri", (properties.LocationUri != null ? cfn_parse.FromCloudFormation.getString(properties.LocationUri) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("retrievalRoleArn", "RetrievalRoleArn", (properties.RetrievalRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RetrievalRoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationProfileTagsPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("validators", "Validators", (properties.Validators != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationProfileValidatorsPropertyFromCloudFormation)(properties.Validators) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppConfig::Deployment` resource starts a deployment.
 *
 * Starting a deployment in AWS AppConfig calls the `StartDeployment` API action. This call includes the IDs of the AWS AppConfig application, the environment, the configuration profile, and (optionally) the configuration data version to deploy. The call also includes the ID of the deployment strategy to use, which determines how the configuration data is deployed.
 *
 * AWS AppConfig monitors the distribution to all hosts and reports status. If a distribution fails, then AWS AppConfig rolls back the configuration.
 *
 * AWS AppConfig requires that you create resources and deploy a configuration in the following order:
 *
 * - Create an application
 * - Create an environment
 * - Create a configuration profile
 * - Create a deployment strategy
 * - Deploy the configuration
 *
 * For more information, see [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::Deployment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html
 */
export class CfnDeployment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppConfig::Deployment";

  /**
   * Build a CfnDeployment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeployment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeploymentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeployment(scope, id, propsResult.value);
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
   * The application ID.
   */
  public applicationId: string;

  /**
   * The configuration profile ID.
   */
  public configurationProfileId: string;

  /**
   * The configuration version to deploy.
   */
  public configurationVersion: string;

  /**
   * The deployment strategy ID.
   */
  public deploymentStrategyId: string;

  /**
   * A description of the deployment.
   */
  public description?: string;

  /**
   * The environment ID.
   */
  public environmentId: string;

  /**
   * The AWS Key Management Service key identifier (key ID, key alias, or key ARN) provided when the resource was created or updated.
   */
  public kmsKeyIdentifier?: string;

  /**
   * Metadata to assign to the deployment.
   */
  public tags?: Array<CfnDeployment.TagsProperty>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeploymentProps) {
    super(scope, id, {
      "type": CfnDeployment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);
    cdk.requireProperty(props, "configurationProfileId", this);
    cdk.requireProperty(props, "configurationVersion", this);
    cdk.requireProperty(props, "deploymentStrategyId", this);
    cdk.requireProperty(props, "environmentId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.configurationProfileId = props.configurationProfileId;
    this.configurationVersion = props.configurationVersion;
    this.deploymentStrategyId = props.deploymentStrategyId;
    this.description = props.description;
    this.environmentId = props.environmentId;
    this.kmsKeyIdentifier = props.kmsKeyIdentifier;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "configurationProfileId": this.configurationProfileId,
      "configurationVersion": this.configurationVersion,
      "deploymentStrategyId": this.deploymentStrategyId,
      "description": this.description,
      "environmentId": this.environmentId,
      "kmsKeyIdentifier": this.kmsKeyIdentifier,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeployment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeploymentPropsToCloudFormation(props);
  }
}

export namespace CfnDeployment {
  /**
   * Metadata to assign to the deployment strategy.
   *
   * Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deployment-tags.html
   */
  export interface TagsProperty {
    /**
     * The key-value string map.
     *
     * The valid character set is `[a-zA-Z+-=._:/]` . The tag key can be up to 128 characters and must not start with `aws:` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deployment-tags.html#cfn-appconfig-deployment-tags-key
     */
    readonly key?: string;

    /**
     * The tag value can be up to 256 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deployment-tags.html#cfn-appconfig-deployment-tags-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnDeployment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html
 */
export interface CfnDeploymentProps {
  /**
   * The application ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-applicationid
   */
  readonly applicationId: string;

  /**
   * The configuration profile ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-configurationprofileid
   */
  readonly configurationProfileId: string;

  /**
   * The configuration version to deploy.
   *
   * If deploying an AWS AppConfig hosted configuration version, you can specify either the version number or version label. For all other configurations, you must specify the version number.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-configurationversion
   */
  readonly configurationVersion: string;

  /**
   * The deployment strategy ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-deploymentstrategyid
   */
  readonly deploymentStrategyId: string;

  /**
   * A description of the deployment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-description
   */
  readonly description?: string;

  /**
   * The environment ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-environmentid
   */
  readonly environmentId: string;

  /**
   * The AWS Key Management Service key identifier (key ID, key alias, or key ARN) provided when the resource was created or updated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-kmskeyidentifier
   */
  readonly kmsKeyIdentifier?: string;

  /**
   * Metadata to assign to the deployment.
   *
   * Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deployment.html#cfn-appconfig-deployment-tags
   */
  readonly tags?: Array<CfnDeployment.TagsProperty>;
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentTagsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentTagsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentTagsPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDeploymentTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeployment.TagsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.TagsProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDeploymentProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("configurationProfileId", cdk.requiredValidator)(properties.configurationProfileId));
  errors.collect(cdk.propertyValidator("configurationProfileId", cdk.validateString)(properties.configurationProfileId));
  errors.collect(cdk.propertyValidator("configurationVersion", cdk.requiredValidator)(properties.configurationVersion));
  errors.collect(cdk.propertyValidator("configurationVersion", cdk.validateString)(properties.configurationVersion));
  errors.collect(cdk.propertyValidator("deploymentStrategyId", cdk.requiredValidator)(properties.deploymentStrategyId));
  errors.collect(cdk.propertyValidator("deploymentStrategyId", cdk.validateString)(properties.deploymentStrategyId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("environmentId", cdk.requiredValidator)(properties.environmentId));
  errors.collect(cdk.propertyValidator("environmentId", cdk.validateString)(properties.environmentId));
  errors.collect(cdk.propertyValidator("kmsKeyIdentifier", cdk.validateString)(properties.kmsKeyIdentifier));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnDeploymentTagsPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDeploymentProps\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "ConfigurationProfileId": cdk.stringToCloudFormation(properties.configurationProfileId),
    "ConfigurationVersion": cdk.stringToCloudFormation(properties.configurationVersion),
    "DeploymentStrategyId": cdk.stringToCloudFormation(properties.deploymentStrategyId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EnvironmentId": cdk.stringToCloudFormation(properties.environmentId),
    "KmsKeyIdentifier": cdk.stringToCloudFormation(properties.kmsKeyIdentifier),
    "Tags": cdk.listMapper(convertCfnDeploymentTagsPropertyToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDeploymentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("configurationProfileId", "ConfigurationProfileId", (properties.ConfigurationProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationProfileId) : undefined));
  ret.addPropertyResult("configurationVersion", "ConfigurationVersion", (properties.ConfigurationVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationVersion) : undefined));
  ret.addPropertyResult("deploymentStrategyId", "DeploymentStrategyId", (properties.DeploymentStrategyId != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentStrategyId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("environmentId", "EnvironmentId", (properties.EnvironmentId != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentId) : undefined));
  ret.addPropertyResult("kmsKeyIdentifier", "KmsKeyIdentifier", (properties.KmsKeyIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyIdentifier) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentTagsPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppConfig::DeploymentStrategy` resource creates an AWS AppConfig deployment strategy.
 *
 * A deployment strategy defines important criteria for rolling out your configuration to the designated targets. A deployment strategy includes: the overall duration required, a percentage of targets to receive the deployment during each interval, an algorithm that defines how percentage grows, and bake time.
 *
 * AWS AppConfig requires that you create resources and deploy a configuration in the following order:
 *
 * - Create an application
 * - Create an environment
 * - Create a configuration profile
 * - Create a deployment strategy
 * - Deploy the configuration
 *
 * For more information, see [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::DeploymentStrategy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html
 */
export class CfnDeploymentStrategy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppConfig::DeploymentStrategy";

  /**
   * Build a CfnDeploymentStrategy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeploymentStrategy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeploymentStrategyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeploymentStrategy(scope, id, propsResult.value);
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
   * Total amount of time for a deployment to last.
   */
  public deploymentDurationInMinutes: number;

  /**
   * A description of the deployment strategy.
   */
  public description?: string;

  /**
   * Specifies the amount of time AWS AppConfig monitors for Amazon CloudWatch alarms after the configuration has been deployed to 100% of its targets, before considering the deployment to be complete.
   */
  public finalBakeTimeInMinutes?: number;

  /**
   * The percentage of targets to receive a deployed configuration during each interval.
   */
  public growthFactor: number;

  /**
   * The algorithm used to define how percentage grows over time. AWS AppConfig supports the following growth types:.
   */
  public growthType?: string;

  /**
   * A name for the deployment strategy.
   */
  public name: string;

  /**
   * Save the deployment strategy to a Systems Manager (SSM) document.
   */
  public replicateTo: string;

  /**
   * Assigns metadata to an AWS AppConfig resource.
   */
  public tags?: Array<CfnDeploymentStrategy.TagsProperty>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeploymentStrategyProps) {
    super(scope, id, {
      "type": CfnDeploymentStrategy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "deploymentDurationInMinutes", this);
    cdk.requireProperty(props, "growthFactor", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "replicateTo", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.deploymentDurationInMinutes = props.deploymentDurationInMinutes;
    this.description = props.description;
    this.finalBakeTimeInMinutes = props.finalBakeTimeInMinutes;
    this.growthFactor = props.growthFactor;
    this.growthType = props.growthType;
    this.name = props.name;
    this.replicateTo = props.replicateTo;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deploymentDurationInMinutes": this.deploymentDurationInMinutes,
      "description": this.description,
      "finalBakeTimeInMinutes": this.finalBakeTimeInMinutes,
      "growthFactor": this.growthFactor,
      "growthType": this.growthType,
      "name": this.name,
      "replicateTo": this.replicateTo,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeploymentStrategy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeploymentStrategyPropsToCloudFormation(props);
  }
}

export namespace CfnDeploymentStrategy {
  /**
   * Metadata to assign to the deployment strategy.
   *
   * Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deploymentstrategy-tags.html
   */
  export interface TagsProperty {
    /**
     * The key-value string map.
     *
     * The valid character set is `[a-zA-Z+-=._:/]` . The tag key can be up to 128 characters and must not start with `aws:` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deploymentstrategy-tags.html#cfn-appconfig-deploymentstrategy-tags-key
     */
    readonly key?: string;

    /**
     * The tag value can be up to 256 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-deploymentstrategy-tags.html#cfn-appconfig-deploymentstrategy-tags-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnDeploymentStrategy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html
 */
export interface CfnDeploymentStrategyProps {
  /**
   * Total amount of time for a deployment to last.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-deploymentdurationinminutes
   */
  readonly deploymentDurationInMinutes: number;

  /**
   * A description of the deployment strategy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-description
   */
  readonly description?: string;

  /**
   * Specifies the amount of time AWS AppConfig monitors for Amazon CloudWatch alarms after the configuration has been deployed to 100% of its targets, before considering the deployment to be complete.
   *
   * If an alarm is triggered during this time, AWS AppConfig rolls back the deployment. You must configure permissions for AWS AppConfig to roll back based on CloudWatch alarms. For more information, see [Configuring permissions for rollback based on Amazon CloudWatch alarms](https://docs.aws.amazon.com/appconfig/latest/userguide/getting-started-with-appconfig-cloudwatch-alarms-permissions.html) in the *AWS AppConfig User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-finalbaketimeinminutes
   */
  readonly finalBakeTimeInMinutes?: number;

  /**
   * The percentage of targets to receive a deployed configuration during each interval.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-growthfactor
   */
  readonly growthFactor: number;

  /**
   * The algorithm used to define how percentage grows over time. AWS AppConfig supports the following growth types:.
   *
   * *Linear* : For this type, AWS AppConfig processes the deployment by dividing the total number of targets by the value specified for `Step percentage` . For example, a linear deployment that uses a `Step percentage` of 10 deploys the configuration to 10 percent of the hosts. After those deployments are complete, the system deploys the configuration to the next 10 percent. This continues until 100% of the targets have successfully received the configuration.
   *
   * *Exponential* : For this type, AWS AppConfig processes the deployment exponentially using the following formula: `G*(2^N)` . In this formula, `G` is the growth factor specified by the user and `N` is the number of steps until the configuration is deployed to all targets. For example, if you specify a growth factor of 2, then the system rolls out the configuration as follows:
   *
   * `2*(2^0)`
   *
   * `2*(2^1)`
   *
   * `2*(2^2)`
   *
   * Expressed numerically, the deployment rolls out as follows: 2% of the targets, 4% of the targets, 8% of the targets, and continues until the configuration has been deployed to all targets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-growthtype
   */
  readonly growthType?: string;

  /**
   * A name for the deployment strategy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-name
   */
  readonly name: string;

  /**
   * Save the deployment strategy to a Systems Manager (SSM) document.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-replicateto
   */
  readonly replicateTo: string;

  /**
   * Assigns metadata to an AWS AppConfig resource.
   *
   * Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define. You can specify a maximum of 50 tags for a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-deploymentstrategy.html#cfn-appconfig-deploymentstrategy-tags
   */
  readonly tags?: Array<CfnDeploymentStrategy.TagsProperty>;
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentStrategyTagsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentStrategyTagsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentStrategyTagsPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDeploymentStrategyTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentStrategy.TagsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentStrategy.TagsProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDeploymentStrategyProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentStrategyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentStrategyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deploymentDurationInMinutes", cdk.requiredValidator)(properties.deploymentDurationInMinutes));
  errors.collect(cdk.propertyValidator("deploymentDurationInMinutes", cdk.validateNumber)(properties.deploymentDurationInMinutes));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("finalBakeTimeInMinutes", cdk.validateNumber)(properties.finalBakeTimeInMinutes));
  errors.collect(cdk.propertyValidator("growthFactor", cdk.requiredValidator)(properties.growthFactor));
  errors.collect(cdk.propertyValidator("growthFactor", cdk.validateNumber)(properties.growthFactor));
  errors.collect(cdk.propertyValidator("growthType", cdk.validateString)(properties.growthType));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("replicateTo", cdk.requiredValidator)(properties.replicateTo));
  errors.collect(cdk.propertyValidator("replicateTo", cdk.validateString)(properties.replicateTo));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnDeploymentStrategyTagsPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDeploymentStrategyProps\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentStrategyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentStrategyPropsValidator(properties).assertSuccess();
  return {
    "DeploymentDurationInMinutes": cdk.numberToCloudFormation(properties.deploymentDurationInMinutes),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FinalBakeTimeInMinutes": cdk.numberToCloudFormation(properties.finalBakeTimeInMinutes),
    "GrowthFactor": cdk.numberToCloudFormation(properties.growthFactor),
    "GrowthType": cdk.stringToCloudFormation(properties.growthType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ReplicateTo": cdk.stringToCloudFormation(properties.replicateTo),
    "Tags": cdk.listMapper(convertCfnDeploymentStrategyTagsPropertyToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDeploymentStrategyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentStrategyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentStrategyProps>();
  ret.addPropertyResult("deploymentDurationInMinutes", "DeploymentDurationInMinutes", (properties.DeploymentDurationInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.DeploymentDurationInMinutes) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("finalBakeTimeInMinutes", "FinalBakeTimeInMinutes", (properties.FinalBakeTimeInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.FinalBakeTimeInMinutes) : undefined));
  ret.addPropertyResult("growthFactor", "GrowthFactor", (properties.GrowthFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.GrowthFactor) : undefined));
  ret.addPropertyResult("growthType", "GrowthType", (properties.GrowthType != null ? cfn_parse.FromCloudFormation.getString(properties.GrowthType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("replicateTo", "ReplicateTo", (properties.ReplicateTo != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicateTo) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentStrategyTagsPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppConfig::Environment` resource creates an environment, which is a logical deployment group of AWS AppConfig targets, such as applications in a `Beta` or `Production` environment.
 *
 * You define one or more environments for each AWS AppConfig application. You can also define environments for application subcomponents such as the `Web` , `Mobile` and `Back-end` components for your application. You can configure Amazon CloudWatch alarms for each environment. The system monitors alarms during a configuration deployment. If an alarm is triggered, the system rolls back the configuration.
 *
 * AWS AppConfig requires that you create resources and deploy a configuration in the following order:
 *
 * - Create an application
 * - Create an environment
 * - Create a configuration profile
 * - Create a deployment strategy
 * - Deploy the configuration
 *
 * For more information, see [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::Environment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppConfig::Environment";

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
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The application ID.
   */
  public applicationId: string;

  /**
   * A description of the environment.
   */
  public description?: string;

  /**
   * Amazon CloudWatch alarms to monitor during the deployment process.
   */
  public monitors?: Array<cdk.IResolvable | CfnEnvironment.MonitorsProperty> | cdk.IResolvable;

  /**
   * A name for the environment.
   */
  public name: string;

  /**
   * Metadata to assign to the environment.
   */
  public tags?: Array<CfnEnvironment.TagsProperty>;

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

    cdk.requireProperty(props, "applicationId", this);
    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.description = props.description;
    this.monitors = props.monitors;
    this.name = props.name;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "description": this.description,
      "monitors": this.monitors,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnvironment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEnvironmentPropsToCloudFormation(props);
  }
}

export namespace CfnEnvironment {
  /**
   * Amazon CloudWatch alarms to monitor during the deployment process.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-monitors.html
   */
  export interface MonitorsProperty {
    /**
     * Amazon Resource Name (ARN) of the Amazon CloudWatch alarm.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-monitors.html#cfn-appconfig-environment-monitors-alarmarn
     */
    readonly alarmArn?: string;

    /**
     * ARN of an AWS Identity and Access Management (IAM) role for AWS AppConfig to monitor `AlarmArn` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-monitors.html#cfn-appconfig-environment-monitors-alarmrolearn
     */
    readonly alarmRoleArn?: string;
  }

  /**
   * Metadata to assign to the environment.
   *
   * Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-tags.html
   */
  export interface TagsProperty {
    /**
     * The key-value string map.
     *
     * The valid character set is `[a-zA-Z+-=._:/]` . The tag key can be up to 128 characters and must not start with `aws:` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-tags.html#cfn-appconfig-environment-tags-key
     */
    readonly key?: string;

    /**
     * The tag value can be up to 256 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-environment-tags.html#cfn-appconfig-environment-tags-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html
 */
export interface CfnEnvironmentProps {
  /**
   * The application ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-applicationid
   */
  readonly applicationId: string;

  /**
   * A description of the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-description
   */
  readonly description?: string;

  /**
   * Amazon CloudWatch alarms to monitor during the deployment process.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-monitors
   */
  readonly monitors?: Array<cdk.IResolvable | CfnEnvironment.MonitorsProperty> | cdk.IResolvable;

  /**
   * A name for the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-name
   */
  readonly name: string;

  /**
   * Metadata to assign to the environment.
   *
   * Tags help organize and categorize your AWS AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-environment.html#cfn-appconfig-environment-tags
   */
  readonly tags?: Array<CfnEnvironment.TagsProperty>;
}

/**
 * Determine whether the given properties match those of a `MonitorsProperty`
 *
 * @param properties - the TypeScript properties of a `MonitorsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentMonitorsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarmArn", cdk.validateString)(properties.alarmArn));
  errors.collect(cdk.propertyValidator("alarmRoleArn", cdk.validateString)(properties.alarmRoleArn));
  return errors.wrap("supplied properties not correct for \"MonitorsProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentMonitorsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentMonitorsPropertyValidator(properties).assertSuccess();
  return {
    "AlarmArn": cdk.stringToCloudFormation(properties.alarmArn),
    "AlarmRoleArn": cdk.stringToCloudFormation(properties.alarmRoleArn)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentMonitorsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEnvironment.MonitorsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.MonitorsProperty>();
  ret.addPropertyResult("alarmArn", "AlarmArn", (properties.AlarmArn != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmArn) : undefined));
  ret.addPropertyResult("alarmRoleArn", "AlarmRoleArn", (properties.AlarmRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmRoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentTagsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentTagsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentTagsPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEnvironment.TagsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.TagsProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
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
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("monitors", cdk.listValidator(CfnEnvironmentMonitorsPropertyValidator))(properties.monitors));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnEnvironmentTagsPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnEnvironmentProps\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Monitors": cdk.listMapper(convertCfnEnvironmentMonitorsPropertyToCloudFormation)(properties.monitors),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(convertCfnEnvironmentTagsPropertyToCloudFormation)(properties.tags)
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
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("monitors", "Monitors", (properties.Monitors != null ? cfn_parse.FromCloudFormation.getArray(CfnEnvironmentMonitorsPropertyFromCloudFormation)(properties.Monitors) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnEnvironmentTagsPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an AWS AppConfig extension.
 *
 * An extension augments your ability to inject logic or behavior at different points during the AWS AppConfig workflow of creating or deploying a configuration.
 *
 * You can create your own extensions or use the AWS authored extensions provided by AWS AppConfig . For an AWS AppConfig extension that uses AWS Lambda , you must create a Lambda function to perform any computation and processing defined in the extension. If you plan to create custom versions of the AWS authored notification extensions, you only need to specify an Amazon Resource Name (ARN) in the `Uri` field for the new extension version.
 *
 * - For a custom EventBridge notification extension, enter the ARN of the EventBridge default events in the `Uri` field.
 * - For a custom Amazon SNS notification extension, enter the ARN of an Amazon SNS topic in the `Uri` field.
 * - For a custom Amazon SQS notification extension, enter the ARN of an Amazon SQS message queue in the `Uri` field.
 *
 * For more information about extensions, see [Working with AWS AppConfig extensions](https://docs.aws.amazon.com/appconfig/latest/userguide/working-with-appconfig-extensions.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::Extension
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extension.html
 */
export class CfnExtension extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppConfig::Extension";

  /**
   * Build a CfnExtension from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnExtension {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnExtensionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnExtension(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The system-generated Amazon Resource Name (ARN) for the extension.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The system-generated ID of the extension.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The extension version number.
   *
   * @cloudformationAttribute VersionNumber
   */
  public readonly attrVersionNumber: number;

  /**
   * The actions defined in the extension.
   */
  public actions: any | cdk.IResolvable;

  /**
   * Information about the extension.
   */
  public description?: string;

  /**
   * You can omit this field when you create an extension.
   */
  public latestVersionNumber?: number;

  /**
   * A name for the extension.
   */
  public name: string;

  /**
   * The parameters accepted by the extension.
   */
  public parameters?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnExtension.ParameterProperty>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Adds one or more tags for the specified extension.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnExtensionProps) {
    super(scope, id, {
      "type": CfnExtension.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "actions", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrVersionNumber = cdk.Token.asNumber(this.getAtt("VersionNumber", cdk.ResolutionTypeHint.NUMBER));
    this.actions = props.actions;
    this.description = props.description;
    this.latestVersionNumber = props.latestVersionNumber;
    this.name = props.name;
    this.parameters = props.parameters;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppConfig::Extension", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actions": this.actions,
      "description": this.description,
      "latestVersionNumber": this.latestVersionNumber,
      "name": this.name,
      "parameters": this.parameters,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnExtension.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnExtensionPropsToCloudFormation(props);
  }
}

export namespace CfnExtension {
  /**
   * A value such as an Amazon Resource Name (ARN) or an Amazon Simple Notification Service topic entered in an extension when invoked.
   *
   * Parameter values are specified in an extension association. For more information about extensions, see [Working with AWS AppConfig extensions](https://docs.aws.amazon.com/appconfig/latest/userguide/working-with-appconfig-extensions.html) in the *AWS AppConfig User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-extension-parameter.html
   */
  export interface ParameterProperty {
    /**
     * Information about the parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-extension-parameter.html#cfn-appconfig-extension-parameter-description
     */
    readonly description?: string;

    /**
     * A parameter value must be specified in the extension association.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-extension-parameter.html#cfn-appconfig-extension-parameter-required
     */
    readonly required: boolean | cdk.IResolvable;
  }

  /**
   * An action defines the tasks that the extension performs during the AWS AppConfig workflow.
   *
   * Each action includes an action point such as `ON_CREATE_HOSTED_CONFIGURATION` , `PRE_DEPLOYMENT` , or `ON_DEPLOYMENT` . Each action also includes a name, a URI to an AWS Lambda function, and an Amazon Resource Name (ARN) for an AWS Identity and Access Management assume role. You specify the name, URI, and ARN for each *action point* defined in the extension. You can specify the following actions for an extension:
   *
   * - `PRE_CREATE_HOSTED_CONFIGURATION_VERSION`
   * - `PRE_START_DEPLOYMENT`
   * - `ON_DEPLOYMENT_START`
   * - `ON_DEPLOYMENT_STEP`
   * - `ON_DEPLOYMENT_BAKING`
   * - `ON_DEPLOYMENT_COMPLETE`
   * - `ON_DEPLOYMENT_ROLLED_BACK`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-extension-action.html
   */
  export interface ActionProperty {
    /**
     * Information about the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-extension-action.html#cfn-appconfig-extension-action-description
     */
    readonly description?: string;

    /**
     * The action name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-extension-action.html#cfn-appconfig-extension-action-name
     */
    readonly name: string;

    /**
     * An Amazon Resource Name (ARN) for an AWS Identity and Access Management assume role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-extension-action.html#cfn-appconfig-extension-action-rolearn
     */
    readonly roleArn?: string;

    /**
     * The extension URI associated to the action point in the extension definition.
     *
     * The URI can be an Amazon Resource Name (ARN) for one of the following: an AWS Lambda function, an Amazon Simple Queue Service queue, an Amazon Simple Notification Service topic, or the Amazon EventBridge default event bus.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appconfig-extension-action.html#cfn-appconfig-extension-action-uri
     */
    readonly uri: string;
  }
}

/**
 * Properties for defining a `CfnExtension`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extension.html
 */
export interface CfnExtensionProps {
  /**
   * The actions defined in the extension.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extension.html#cfn-appconfig-extension-actions
   */
  readonly actions: any | cdk.IResolvable;

  /**
   * Information about the extension.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extension.html#cfn-appconfig-extension-description
   */
  readonly description?: string;

  /**
   * You can omit this field when you create an extension.
   *
   * When you create a new version, specify the most recent current version number. For example, you create version 3, enter 2 for this field.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extension.html#cfn-appconfig-extension-latestversionnumber
   */
  readonly latestVersionNumber?: number;

  /**
   * A name for the extension.
   *
   * Each extension name in your account must be unique. Extension versions use the same name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extension.html#cfn-appconfig-extension-name
   */
  readonly name: string;

  /**
   * The parameters accepted by the extension.
   *
   * You specify parameter values when you associate the extension to an AWS AppConfig resource by using the `CreateExtensionAssociation` API action. For AWS Lambda extension actions, these parameters are included in the Lambda request object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extension.html#cfn-appconfig-extension-parameters
   */
  readonly parameters?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnExtension.ParameterProperty>;

  /**
   * Adds one or more tags for the specified extension.
   *
   * Tags are metadata that help you categorize resources in different ways, for example, by purpose, owner, or environment. Each tag consists of a key and an optional value, both of which you define.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extension.html#cfn-appconfig-extension-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExtensionParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("required", cdk.requiredValidator)(properties.required));
  errors.collect(cdk.propertyValidator("required", cdk.validateBoolean)(properties.required));
  return errors.wrap("supplied properties not correct for \"ParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnExtensionParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExtensionParameterPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Required": cdk.booleanToCloudFormation(properties.required)
  };
}

// @ts-ignore TS6133
function CfnExtensionParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnExtension.ParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExtension.ParameterProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("required", "Required", (properties.Required != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Required) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExtensionActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("uri", cdk.requiredValidator)(properties.uri));
  errors.collect(cdk.propertyValidator("uri", cdk.validateString)(properties.uri));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnExtensionActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExtensionActionPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Uri": cdk.stringToCloudFormation(properties.uri)
  };
}

// @ts-ignore TS6133
function CfnExtensionActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExtension.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExtension.ActionProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("uri", "Uri", (properties.Uri != null ? cfn_parse.FromCloudFormation.getString(properties.Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnExtensionProps`
 *
 * @param properties - the TypeScript properties of a `CfnExtensionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExtensionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", cdk.validateObject)(properties.actions));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("latestVersionNumber", cdk.validateNumber)(properties.latestVersionNumber));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parameters", cdk.hashValidator(CfnExtensionParameterPropertyValidator))(properties.parameters));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnExtensionProps\"");
}

// @ts-ignore TS6133
function convertCfnExtensionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExtensionPropsValidator(properties).assertSuccess();
  return {
    "Actions": cdk.objectToCloudFormation(properties.actions),
    "Description": cdk.stringToCloudFormation(properties.description),
    "LatestVersionNumber": cdk.numberToCloudFormation(properties.latestVersionNumber),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Parameters": cdk.hashMapper(convertCfnExtensionParameterPropertyToCloudFormation)(properties.parameters),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnExtensionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExtensionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExtensionProps>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getAny(properties.Actions) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("latestVersionNumber", "LatestVersionNumber", (properties.LatestVersionNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.LatestVersionNumber) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(CfnExtensionParameterPropertyFromCloudFormation)(properties.Parameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * When you create an extension or configure an AWS authored extension, you associate the extension with an AWS AppConfig application, environment, or configuration profile.
 *
 * For example, you can choose to run the `AWS AppConfig deployment events to Amazon SNS` AWS authored extension and receive notifications on an Amazon SNS topic anytime a configuration deployment is started for a specific application. Defining which extension to associate with an AWS AppConfig resource is called an *extension association* . An extension association is a specified relationship between an extension and an AWS AppConfig resource, such as an application or a configuration profile. For more information about extensions and associations, see [Working with AWS AppConfig extensions](https://docs.aws.amazon.com/appconfig/latest/userguide/working-with-appconfig-extensions.html) in the *AWS AppConfig User Guide* .
 *
 * @cloudformationResource AWS::AppConfig::ExtensionAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extensionassociation.html
 */
export class CfnExtensionAssociation extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppConfig::ExtensionAssociation";

  /**
   * Build a CfnExtensionAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnExtensionAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnExtensionAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnExtensionAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the extension defined in the association.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ARN of the extension defined in the association.
   *
   * @cloudformationAttribute ExtensionArn
   */
  public readonly attrExtensionArn: string;

  /**
   * The system-generated ID for the association.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARNs of applications, configuration profiles, or environments defined in the association.
   *
   * @cloudformationAttribute ResourceArn
   */
  public readonly attrResourceArn: string;

  /**
   * The name, the ID, or the Amazon Resource Name (ARN) of the extension.
   */
  public extensionIdentifier?: string;

  /**
   * The version number of the extension.
   */
  public extensionVersionNumber?: number;

  /**
   * The parameter names and values defined in the extensions.
   */
  public parameters?: cdk.IResolvable | Record<string, string>;

  /**
   * The ARN of an application, configuration profile, or environment.
   */
  public resourceIdentifier?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Adds one or more tags for the specified extension association.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnExtensionAssociationProps = {}) {
    super(scope, id, {
      "type": CfnExtensionAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrExtensionArn = cdk.Token.asString(this.getAtt("ExtensionArn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrResourceArn = cdk.Token.asString(this.getAtt("ResourceArn", cdk.ResolutionTypeHint.STRING));
    this.extensionIdentifier = props.extensionIdentifier;
    this.extensionVersionNumber = props.extensionVersionNumber;
    this.parameters = props.parameters;
    this.resourceIdentifier = props.resourceIdentifier;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppConfig::ExtensionAssociation", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "extensionIdentifier": this.extensionIdentifier,
      "extensionVersionNumber": this.extensionVersionNumber,
      "parameters": this.parameters,
      "resourceIdentifier": this.resourceIdentifier,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnExtensionAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnExtensionAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnExtensionAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extensionassociation.html
 */
export interface CfnExtensionAssociationProps {
  /**
   * The name, the ID, or the Amazon Resource Name (ARN) of the extension.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extensionassociation.html#cfn-appconfig-extensionassociation-extensionidentifier
   */
  readonly extensionIdentifier?: string;

  /**
   * The version number of the extension.
   *
   * If not specified, AWS AppConfig uses the maximum version of the extension.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extensionassociation.html#cfn-appconfig-extensionassociation-extensionversionnumber
   */
  readonly extensionVersionNumber?: number;

  /**
   * The parameter names and values defined in the extensions.
   *
   * Extension parameters marked `Required` must be entered for this field.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extensionassociation.html#cfn-appconfig-extensionassociation-parameters
   */
  readonly parameters?: cdk.IResolvable | Record<string, string>;

  /**
   * The ARN of an application, configuration profile, or environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extensionassociation.html#cfn-appconfig-extensionassociation-resourceidentifier
   */
  readonly resourceIdentifier?: string;

  /**
   * Adds one or more tags for the specified extension association.
   *
   * Tags are metadata that help you categorize resources in different ways, for example, by purpose, owner, or environment. Each tag consists of a key and an optional value, both of which you define.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-extensionassociation.html#cfn-appconfig-extensionassociation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnExtensionAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnExtensionAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnExtensionAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("extensionIdentifier", cdk.validateString)(properties.extensionIdentifier));
  errors.collect(cdk.propertyValidator("extensionVersionNumber", cdk.validateNumber)(properties.extensionVersionNumber));
  errors.collect(cdk.propertyValidator("parameters", cdk.hashValidator(cdk.validateString))(properties.parameters));
  errors.collect(cdk.propertyValidator("resourceIdentifier", cdk.validateString)(properties.resourceIdentifier));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnExtensionAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnExtensionAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnExtensionAssociationPropsValidator(properties).assertSuccess();
  return {
    "ExtensionIdentifier": cdk.stringToCloudFormation(properties.extensionIdentifier),
    "ExtensionVersionNumber": cdk.numberToCloudFormation(properties.extensionVersionNumber),
    "Parameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
    "ResourceIdentifier": cdk.stringToCloudFormation(properties.resourceIdentifier),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnExtensionAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExtensionAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExtensionAssociationProps>();
  ret.addPropertyResult("extensionIdentifier", "ExtensionIdentifier", (properties.ExtensionIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ExtensionIdentifier) : undefined));
  ret.addPropertyResult("extensionVersionNumber", "ExtensionVersionNumber", (properties.ExtensionVersionNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExtensionVersionNumber) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined));
  ret.addPropertyResult("resourceIdentifier", "ResourceIdentifier", (properties.ResourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdentifier) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create a new configuration in the AWS AppConfig hosted configuration store.
 *
 * Configurations must be 1 MB or smaller. The AWS AppConfig hosted configuration store provides the following benefits over other configuration store options.
 *
 * - You don't need to set up and configure other services such as Amazon Simple Storage Service ( Amazon S3 ) or Parameter Store.
 * - You don't need to configure AWS Identity and Access Management ( IAM ) permissions to use the configuration store.
 * - You can store configurations in any content type.
 * - There is no cost to use the store.
 * - You can create a configuration and add it to the store when you create a configuration profile.
 *
 * @cloudformationResource AWS::AppConfig::HostedConfigurationVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html
 */
export class CfnHostedConfigurationVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppConfig::HostedConfigurationVersion";

  /**
   * Build a CfnHostedConfigurationVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHostedConfigurationVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnHostedConfigurationVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnHostedConfigurationVersion(scope, id, propsResult.value);
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
   * The application ID.
   */
  public applicationId: string;

  /**
   * The configuration profile ID.
   */
  public configurationProfileId: string;

  /**
   * The content of the configuration or the configuration data.
   */
  public content: string;

  /**
   * A standard MIME type describing the format of the configuration content.
   */
  public contentType: string;

  /**
   * A description of the configuration.
   */
  public description?: string;

  /**
   * An optional locking token used to prevent race conditions from overwriting configuration updates when creating a new version.
   */
  public latestVersionNumber?: number;

  /**
   * A user-defined label for an AWS AppConfig hosted configuration version.
   */
  public versionLabel?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnHostedConfigurationVersionProps) {
    super(scope, id, {
      "type": CfnHostedConfigurationVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);
    cdk.requireProperty(props, "configurationProfileId", this);
    cdk.requireProperty(props, "content", this);
    cdk.requireProperty(props, "contentType", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.configurationProfileId = props.configurationProfileId;
    this.content = props.content;
    this.contentType = props.contentType;
    this.description = props.description;
    this.latestVersionNumber = props.latestVersionNumber;
    this.versionLabel = props.versionLabel;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "configurationProfileId": this.configurationProfileId,
      "content": this.content,
      "contentType": this.contentType,
      "description": this.description,
      "latestVersionNumber": this.latestVersionNumber,
      "versionLabel": this.versionLabel
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnHostedConfigurationVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnHostedConfigurationVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnHostedConfigurationVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html
 */
export interface CfnHostedConfigurationVersionProps {
  /**
   * The application ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-applicationid
   */
  readonly applicationId: string;

  /**
   * The configuration profile ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-configurationprofileid
   */
  readonly configurationProfileId: string;

  /**
   * The content of the configuration or the configuration data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-content
   */
  readonly content: string;

  /**
   * A standard MIME type describing the format of the configuration content.
   *
   * For more information, see [Content-Type](https://docs.aws.amazon.com/https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-contenttype
   */
  readonly contentType: string;

  /**
   * A description of the configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-description
   */
  readonly description?: string;

  /**
   * An optional locking token used to prevent race conditions from overwriting configuration updates when creating a new version.
   *
   * To ensure your data is not overwritten when creating multiple hosted configuration versions in rapid succession, specify the version number of the latest hosted configuration version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-latestversionnumber
   */
  readonly latestVersionNumber?: number;

  /**
   * A user-defined label for an AWS AppConfig hosted configuration version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appconfig-hostedconfigurationversion.html#cfn-appconfig-hostedconfigurationversion-versionlabel
   */
  readonly versionLabel?: string;
}

/**
 * Determine whether the given properties match those of a `CfnHostedConfigurationVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnHostedConfigurationVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHostedConfigurationVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("configurationProfileId", cdk.requiredValidator)(properties.configurationProfileId));
  errors.collect(cdk.propertyValidator("configurationProfileId", cdk.validateString)(properties.configurationProfileId));
  errors.collect(cdk.propertyValidator("content", cdk.requiredValidator)(properties.content));
  errors.collect(cdk.propertyValidator("content", cdk.validateString)(properties.content));
  errors.collect(cdk.propertyValidator("contentType", cdk.requiredValidator)(properties.contentType));
  errors.collect(cdk.propertyValidator("contentType", cdk.validateString)(properties.contentType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("latestVersionNumber", cdk.validateNumber)(properties.latestVersionNumber));
  errors.collect(cdk.propertyValidator("versionLabel", cdk.validateString)(properties.versionLabel));
  return errors.wrap("supplied properties not correct for \"CfnHostedConfigurationVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnHostedConfigurationVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHostedConfigurationVersionPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "ConfigurationProfileId": cdk.stringToCloudFormation(properties.configurationProfileId),
    "Content": cdk.stringToCloudFormation(properties.content),
    "ContentType": cdk.stringToCloudFormation(properties.contentType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "LatestVersionNumber": cdk.numberToCloudFormation(properties.latestVersionNumber),
    "VersionLabel": cdk.stringToCloudFormation(properties.versionLabel)
  };
}

// @ts-ignore TS6133
function CfnHostedConfigurationVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHostedConfigurationVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHostedConfigurationVersionProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("configurationProfileId", "ConfigurationProfileId", (properties.ConfigurationProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationProfileId) : undefined));
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getString(properties.Content) : undefined));
  ret.addPropertyResult("contentType", "ContentType", (properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("latestVersionNumber", "LatestVersionNumber", (properties.LatestVersionNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.LatestVersionNumber) : undefined));
  ret.addPropertyResult("versionLabel", "VersionLabel", (properties.VersionLabel != null ? cfn_parse.FromCloudFormation.getString(properties.VersionLabel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}