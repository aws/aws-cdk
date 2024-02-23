/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * In a CloudFormation template, you use the `AWS::CloudFormation::CustomResource` or `Custom:: *String*` resource type to specify custom resources.
 *
 * Custom resources provide a way for you to write custom provisioning logic in CloudFormation template and have CloudFormation run it during a stack operation, such as when you create, update or delete a stack. For more information, see [Custom resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html) .
 *
 * > If you use the [VPC endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-endpoints.html) feature, custom resources in the VPC must have access to CloudFormation -specific Amazon Simple Storage Service ( Amazon S3 ) buckets. Custom resources must send responses to a presigned Amazon S3 URL. If they can't send responses to Amazon S3 , CloudFormation won't receive a response and the stack operation fails. For more information, see [Setting up VPC endpoints for AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-vpce-bucketnames.html) .
 *
 * @cloudformationResource AWS::CloudFormation::CustomResource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-customresource.html
 */
export class CfnCustomResource extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::CustomResource";

  /**
   * Build a CfnCustomResource from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomResource {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCustomResourcePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCustomResource(scope, id, propsResult.value);
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
   * > Only one property is defined by AWS for a custom resource: `ServiceToken` .
   */
  public serviceToken: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCustomResourceProps) {
    super(scope, id, {
      "type": CfnCustomResource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "serviceToken", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.serviceToken = props.serviceToken;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "serviceToken": this.serviceToken
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCustomResource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCustomResourcePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCustomResource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-customresource.html
 */
export interface CfnCustomResourceProps {
  /**
   * > Only one property is defined by AWS for a custom resource: `ServiceToken` .
   *
   * All other properties are defined by the service provider.
   *
   * The service token that was given to the template developer by the service provider to access the service, such as an Amazon SNS topic ARN or Lambda function ARN. The service token must be from the same Region in which you are creating the stack.
   *
   * Updates aren't supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-customresource.html#cfn-cloudformation-customresource-servicetoken
   */
  readonly serviceToken: string;
}

/**
 * Determine whether the given properties match those of a `CfnCustomResourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnCustomResourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomResourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serviceToken", cdk.requiredValidator)(properties.serviceToken));
  errors.collect(cdk.propertyValidator("serviceToken", cdk.validateString)(properties.serviceToken));
  return errors.wrap("supplied properties not correct for \"CfnCustomResourceProps\"");
}

// @ts-ignore TS6133
function convertCfnCustomResourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomResourcePropsValidator(properties).assertSuccess();
  return {
    "ServiceToken": cdk.stringToCloudFormation(properties.serviceToken)
  };
}

// @ts-ignore TS6133
function CfnCustomResourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomResourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomResourceProps>();
  ret.addPropertyResult("serviceToken", "ServiceToken", (properties.ServiceToken != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceToken) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `HookDefaultVersion` resource specifies the default version of the hook.
 *
 * The default version of the hook is used in CloudFormation operations for this AWS account and AWS Region .
 *
 * @cloudformationResource AWS::CloudFormation::HookDefaultVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html
 */
export class CfnHookDefaultVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::HookDefaultVersion";

  /**
   * Build a CfnHookDefaultVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHookDefaultVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnHookDefaultVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnHookDefaultVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Number (ARN) of the activated extension, in this account and Region.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the hook.
   */
  public typeName?: string;

  /**
   * The version ID of the type configuration.
   */
  public typeVersionArn?: string;

  /**
   * The version ID of the type specified.
   */
  public versionId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnHookDefaultVersionProps = {}) {
    super(scope, id, {
      "type": CfnHookDefaultVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.typeName = props.typeName;
    this.typeVersionArn = props.typeVersionArn;
    this.versionId = props.versionId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "typeName": this.typeName,
      "typeVersionArn": this.typeVersionArn,
      "versionId": this.versionId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnHookDefaultVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnHookDefaultVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnHookDefaultVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html
 */
export interface CfnHookDefaultVersionProps {
  /**
   * The name of the hook.
   *
   * You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html#cfn-cloudformation-hookdefaultversion-typename
   */
  readonly typeName?: string;

  /**
   * The version ID of the type configuration.
   *
   * You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html#cfn-cloudformation-hookdefaultversion-typeversionarn
   */
  readonly typeVersionArn?: string;

  /**
   * The version ID of the type specified.
   *
   * You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookdefaultversion.html#cfn-cloudformation-hookdefaultversion-versionid
   */
  readonly versionId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnHookDefaultVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnHookDefaultVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHookDefaultVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("typeName", cdk.validateString)(properties.typeName));
  errors.collect(cdk.propertyValidator("typeVersionArn", cdk.validateString)(properties.typeVersionArn));
  errors.collect(cdk.propertyValidator("versionId", cdk.validateString)(properties.versionId));
  return errors.wrap("supplied properties not correct for \"CfnHookDefaultVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnHookDefaultVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHookDefaultVersionPropsValidator(properties).assertSuccess();
  return {
    "TypeName": cdk.stringToCloudFormation(properties.typeName),
    "TypeVersionArn": cdk.stringToCloudFormation(properties.typeVersionArn),
    "VersionId": cdk.stringToCloudFormation(properties.versionId)
  };
}

// @ts-ignore TS6133
function CfnHookDefaultVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHookDefaultVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHookDefaultVersionProps>();
  ret.addPropertyResult("typeName", "TypeName", (properties.TypeName != null ? cfn_parse.FromCloudFormation.getString(properties.TypeName) : undefined));
  ret.addPropertyResult("typeVersionArn", "TypeVersionArn", (properties.TypeVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.TypeVersionArn) : undefined));
  ret.addPropertyResult("versionId", "VersionId", (properties.VersionId != null ? cfn_parse.FromCloudFormation.getString(properties.VersionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `HookTypeConfig` resource specifies the configuration of a hook.
 *
 * @cloudformationResource AWS::CloudFormation::HookTypeConfig
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html
 */
export class CfnHookTypeConfig extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::HookTypeConfig";

  /**
   * Build a CfnHookTypeConfig from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHookTypeConfig {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnHookTypeConfigPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnHookTypeConfig(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Number (ARN) of the activated hook type configuration, in this account and Region.
   *
   * @cloudformationAttribute ConfigurationArn
   */
  public readonly attrConfigurationArn: string;

  /**
   * Specifies the activated hook type configuration, in this AWS account and AWS Region .
   */
  public configuration: string;

  /**
   * Specifies the activated hook type configuration, in this AWS account and AWS Region .
   */
  public configurationAlias?: string;

  /**
   * The Amazon Resource Number (ARN) for the hook to set `Configuration` for.
   */
  public typeArn?: string;

  /**
   * The unique name for your hook.
   */
  public typeName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnHookTypeConfigProps) {
    super(scope, id, {
      "type": CfnHookTypeConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "configuration", this);

    this.attrConfigurationArn = cdk.Token.asString(this.getAtt("ConfigurationArn", cdk.ResolutionTypeHint.STRING));
    this.configuration = props.configuration;
    this.configurationAlias = props.configurationAlias;
    this.typeArn = props.typeArn;
    this.typeName = props.typeName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configuration": this.configuration,
      "configurationAlias": this.configurationAlias,
      "typeArn": this.typeArn,
      "typeName": this.typeName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnHookTypeConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnHookTypeConfigPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnHookTypeConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html
 */
export interface CfnHookTypeConfigProps {
  /**
   * Specifies the activated hook type configuration, in this AWS account and AWS Region .
   *
   * You must specify either `TypeName` and `Configuration` or `TypeARN` and `Configuration` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-configuration
   */
  readonly configuration: string;

  /**
   * Specifies the activated hook type configuration, in this AWS account and AWS Region .
   *
   * Defaults to `default` alias. Hook types currently support default configuration alias.
   *
   * @default - "default"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-configurationalias
   */
  readonly configurationAlias?: string;

  /**
   * The Amazon Resource Number (ARN) for the hook to set `Configuration` for.
   *
   * You must specify either `TypeName` and `Configuration` or `TypeARN` and `Configuration` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-typearn
   */
  readonly typeArn?: string;

  /**
   * The unique name for your hook.
   *
   * Specifies a three-part namespace for your hook, with a recommended pattern of `Organization::Service::Hook` .
   *
   * You must specify either `TypeName` and `Configuration` or `TypeARN` and `Configuration` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hooktypeconfig.html#cfn-cloudformation-hooktypeconfig-typename
   */
  readonly typeName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnHookTypeConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnHookTypeConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHookTypeConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configuration", cdk.requiredValidator)(properties.configuration));
  errors.collect(cdk.propertyValidator("configuration", cdk.validateString)(properties.configuration));
  errors.collect(cdk.propertyValidator("configurationAlias", cdk.validateString)(properties.configurationAlias));
  errors.collect(cdk.propertyValidator("typeArn", cdk.validateString)(properties.typeArn));
  errors.collect(cdk.propertyValidator("typeName", cdk.validateString)(properties.typeName));
  return errors.wrap("supplied properties not correct for \"CfnHookTypeConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnHookTypeConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHookTypeConfigPropsValidator(properties).assertSuccess();
  return {
    "Configuration": cdk.stringToCloudFormation(properties.configuration),
    "ConfigurationAlias": cdk.stringToCloudFormation(properties.configurationAlias),
    "TypeArn": cdk.stringToCloudFormation(properties.typeArn),
    "TypeName": cdk.stringToCloudFormation(properties.typeName)
  };
}

// @ts-ignore TS6133
function CfnHookTypeConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHookTypeConfigProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHookTypeConfigProps>();
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? cfn_parse.FromCloudFormation.getString(properties.Configuration) : undefined));
  ret.addPropertyResult("configurationAlias", "ConfigurationAlias", (properties.ConfigurationAlias != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationAlias) : undefined));
  ret.addPropertyResult("typeArn", "TypeArn", (properties.TypeArn != null ? cfn_parse.FromCloudFormation.getString(properties.TypeArn) : undefined));
  ret.addPropertyResult("typeName", "TypeName", (properties.TypeName != null ? cfn_parse.FromCloudFormation.getString(properties.TypeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `HookVersion` resource publishes new or first hook version to the AWS CloudFormation registry.
 *
 * @cloudformationResource AWS::CloudFormation::HookVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html
 */
export class CfnHookVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::HookVersion";

  /**
   * Build a CfnHookVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHookVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnHookVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnHookVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the hook.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Whether the specified hook version is set as the default version.
   *
   * @cloudformationAttribute IsDefaultVersion
   */
  public readonly attrIsDefaultVersion: cdk.IResolvable;

  /**
   * The Amazon Resource Number (ARN) assigned to this version of the hook.
   *
   * @cloudformationAttribute TypeArn
   */
  public readonly attrTypeArn: string;

  /**
   * The ID of this version of the hook.
   *
   * @cloudformationAttribute VersionId
   */
  public readonly attrVersionId: string;

  /**
   * The scope at which the resource is visible and usable in CloudFormation operations.
   *
   * Valid values include:
   *
   * - `PRIVATE` : The resource is only visible and usable within the account in which it's registered. CloudFormation marks any resources you register as `PRIVATE` .
   * - `PUBLIC` : The resource is publicly visible and usable within any Amazon account.
   *
   * @cloudformationAttribute Visibility
   */
  public readonly attrVisibility: string;

  /**
   * The Amazon Resource Name (ARN) of the task execution role that grants the hook permission.
   */
  public executionRoleArn?: string;

  /**
   * Contains logging configuration information for an extension.
   */
  public loggingConfig?: cdk.IResolvable | CfnHookVersion.LoggingConfigProperty;

  /**
   * A URL to the Amazon S3 bucket containing the hook project package that contains the necessary files for the hook you want to register.
   */
  public schemaHandlerPackage: string;

  /**
   * The unique name for your hook.
   */
  public typeName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnHookVersionProps) {
    super(scope, id, {
      "type": CfnHookVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "schemaHandlerPackage", this);
    cdk.requireProperty(props, "typeName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrIsDefaultVersion = this.getAtt("IsDefaultVersion");
    this.attrTypeArn = cdk.Token.asString(this.getAtt("TypeArn", cdk.ResolutionTypeHint.STRING));
    this.attrVersionId = cdk.Token.asString(this.getAtt("VersionId", cdk.ResolutionTypeHint.STRING));
    this.attrVisibility = cdk.Token.asString(this.getAtt("Visibility", cdk.ResolutionTypeHint.STRING));
    this.executionRoleArn = props.executionRoleArn;
    this.loggingConfig = props.loggingConfig;
    this.schemaHandlerPackage = props.schemaHandlerPackage;
    this.typeName = props.typeName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "executionRoleArn": this.executionRoleArn,
      "loggingConfig": this.loggingConfig,
      "schemaHandlerPackage": this.schemaHandlerPackage,
      "typeName": this.typeName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnHookVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnHookVersionPropsToCloudFormation(props);
  }
}

export namespace CfnHookVersion {
  /**
   * The `LoggingConfig` property type specifies logging configuration information for an extension.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-hookversion-loggingconfig.html
   */
  export interface LoggingConfigProperty {
    /**
     * The Amazon CloudWatch Logs group to which CloudFormation sends error logging information when invoking the extension's handlers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-hookversion-loggingconfig.html#cfn-cloudformation-hookversion-loggingconfig-loggroupname
     */
    readonly logGroupName?: string;

    /**
     * The Amazon Resource Name (ARN) of the role that CloudFormation should assume when sending log entries to CloudWatch Logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-hookversion-loggingconfig.html#cfn-cloudformation-hookversion-loggingconfig-logrolearn
     */
    readonly logRoleArn?: string;
  }
}

/**
 * Properties for defining a `CfnHookVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html
 */
export interface CfnHookVersionProps {
  /**
   * The Amazon Resource Name (ARN) of the task execution role that grants the hook permission.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-executionrolearn
   */
  readonly executionRoleArn?: string;

  /**
   * Contains logging configuration information for an extension.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-loggingconfig
   */
  readonly loggingConfig?: cdk.IResolvable | CfnHookVersion.LoggingConfigProperty;

  /**
   * A URL to the Amazon S3 bucket containing the hook project package that contains the necessary files for the hook you want to register.
   *
   * For information on generating a schema handler package for the resource you want to register, see [submit](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-type-cli-submit.html) in the *CloudFormation CLI User Guide for Extension Development* .
   *
   * > The user registering the resource must be able to access the package in the S3 bucket. That's, the user must have [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html) permissions for the schema handler package. For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-schemahandlerpackage
   */
  readonly schemaHandlerPackage: string;

  /**
   * The unique name for your hook.
   *
   * Specifies a three-part namespace for your hook, with a recommended pattern of `Organization::Service::Hook` .
   *
   * > The following organization namespaces are reserved and can't be used in your hook type names:
   * >
   * > - `Alexa`
   * > - `AMZN`
   * > - `Amazon`
   * > - `ASK`
   * > - `AWS`
   * > - `Custom`
   * > - `Dev`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-hookversion.html#cfn-cloudformation-hookversion-typename
   */
  readonly typeName: string;
}

/**
 * Determine whether the given properties match those of a `LoggingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHookVersionLoggingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logRoleArn", cdk.validateString)(properties.logRoleArn));
  return errors.wrap("supplied properties not correct for \"LoggingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnHookVersionLoggingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHookVersionLoggingConfigPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName),
    "LogRoleArn": cdk.stringToCloudFormation(properties.logRoleArn)
  };
}

// @ts-ignore TS6133
function CfnHookVersionLoggingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnHookVersion.LoggingConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHookVersion.LoggingConfigProperty>();
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addPropertyResult("logRoleArn", "LogRoleArn", (properties.LogRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogRoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnHookVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnHookVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHookVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("loggingConfig", CfnHookVersionLoggingConfigPropertyValidator)(properties.loggingConfig));
  errors.collect(cdk.propertyValidator("schemaHandlerPackage", cdk.requiredValidator)(properties.schemaHandlerPackage));
  errors.collect(cdk.propertyValidator("schemaHandlerPackage", cdk.validateString)(properties.schemaHandlerPackage));
  errors.collect(cdk.propertyValidator("typeName", cdk.requiredValidator)(properties.typeName));
  errors.collect(cdk.propertyValidator("typeName", cdk.validateString)(properties.typeName));
  return errors.wrap("supplied properties not correct for \"CfnHookVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnHookVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHookVersionPropsValidator(properties).assertSuccess();
  return {
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "LoggingConfig": convertCfnHookVersionLoggingConfigPropertyToCloudFormation(properties.loggingConfig),
    "SchemaHandlerPackage": cdk.stringToCloudFormation(properties.schemaHandlerPackage),
    "TypeName": cdk.stringToCloudFormation(properties.typeName)
  };
}

// @ts-ignore TS6133
function CfnHookVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHookVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHookVersionProps>();
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("loggingConfig", "LoggingConfig", (properties.LoggingConfig != null ? CfnHookVersionLoggingConfigPropertyFromCloudFormation(properties.LoggingConfig) : undefined));
  ret.addPropertyResult("schemaHandlerPackage", "SchemaHandlerPackage", (properties.SchemaHandlerPackage != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaHandlerPackage) : undefined));
  ret.addPropertyResult("typeName", "TypeName", (properties.TypeName != null ? cfn_parse.FromCloudFormation.getString(properties.TypeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::CloudFormation::Macro` resource is a CloudFormation resource type that creates a CloudFormation macro to perform custom processing on CloudFormation templates.
 *
 * For more information, see [Using AWS CloudFormation macros to perform custom processing on templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-macros.html) .
 *
 * @cloudformationResource AWS::CloudFormation::Macro
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html
 */
export class CfnMacro extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::Macro";

  /**
   * Build a CfnMacro from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMacro {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMacroPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMacro(scope, id, propsResult.value);
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
   * A description of the macro.
   */
  public description?: string;

  /**
   * The Amazon Resource Name (ARN) of the underlying AWS Lambda function that you want AWS CloudFormation to invoke when the macro is run.
   */
  public functionName: string;

  /**
   * The CloudWatch Logs group to which AWS CloudFormation sends error logging information when invoking the macro's underlying AWS Lambda function.
   */
  public logGroupName?: string;

  /**
   * The ARN of the role AWS CloudFormation should assume when sending log entries to CloudWatch Logs .
   */
  public logRoleArn?: string;

  /**
   * The name of the macro.
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMacroProps) {
    super(scope, id, {
      "type": CfnMacro.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "functionName", this);
    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.functionName = props.functionName;
    this.logGroupName = props.logGroupName;
    this.logRoleArn = props.logRoleArn;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "functionName": this.functionName,
      "logGroupName": this.logGroupName,
      "logRoleArn": this.logRoleArn,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMacro.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMacroPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnMacro`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html
 */
export interface CfnMacroProps {
  /**
   * A description of the macro.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-description
   */
  readonly description?: string;

  /**
   * The Amazon Resource Name (ARN) of the underlying AWS Lambda function that you want AWS CloudFormation to invoke when the macro is run.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-functionname
   */
  readonly functionName: string;

  /**
   * The CloudWatch Logs group to which AWS CloudFormation sends error logging information when invoking the macro's underlying AWS Lambda function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-loggroupname
   */
  readonly logGroupName?: string;

  /**
   * The ARN of the role AWS CloudFormation should assume when sending log entries to CloudWatch Logs .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-logrolearn
   */
  readonly logRoleArn?: string;

  /**
   * The name of the macro.
   *
   * The name of the macro must be unique across all macros in the account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-macro.html#cfn-cloudformation-macro-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `CfnMacroProps`
 *
 * @param properties - the TypeScript properties of a `CfnMacroProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMacroPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("functionName", cdk.requiredValidator)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionName", cdk.validateString)(properties.functionName));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logRoleArn", cdk.validateString)(properties.logRoleArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnMacroProps\"");
}

// @ts-ignore TS6133
function convertCfnMacroPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMacroPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "FunctionName": cdk.stringToCloudFormation(properties.functionName),
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName),
    "LogRoleARN": cdk.stringToCloudFormation(properties.logRoleArn),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnMacroPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMacroProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMacroProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("functionName", "FunctionName", (properties.FunctionName != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionName) : undefined));
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addPropertyResult("logRoleArn", "LogRoleARN", (properties.LogRoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.LogRoleARN) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies the default version of a module.
 *
 * The default version of the module will be used in CloudFormation operations for this account and Region.
 *
 * To register a module version, use the `[`AWS::CloudFormation::ModuleVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html)` resource.
 *
 * For more information using modules, see [Using modules to encapsulate and reuse resource configurations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/modules.html) and [Registering extensions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/registry.html#registry-register) in the *AWS CloudFormation User Guide* . For information on developing modules, see [Developing modules](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/modules.html) in the *AWS CloudFormation CLI User Guide* .
 *
 * @cloudformationResource AWS::CloudFormation::ModuleDefaultVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html
 */
export class CfnModuleDefaultVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::ModuleDefaultVersion";

  /**
   * Build a CfnModuleDefaultVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnModuleDefaultVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnModuleDefaultVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnModuleDefaultVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the module version to set as the default version.
   */
  public arn?: string;

  /**
   * The name of the module.
   */
  public moduleName?: string;

  /**
   * The ID for the specific version of the module.
   */
  public versionId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnModuleDefaultVersionProps = {}) {
    super(scope, id, {
      "type": CfnModuleDefaultVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.arn = props.arn;
    this.moduleName = props.moduleName;
    this.versionId = props.versionId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "arn": this.arn,
      "moduleName": this.moduleName,
      "versionId": this.versionId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnModuleDefaultVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnModuleDefaultVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnModuleDefaultVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html
 */
export interface CfnModuleDefaultVersionProps {
  /**
   * The Amazon Resource Name (ARN) of the module version to set as the default version.
   *
   * Conditional: You must specify either `Arn` , or `ModuleName` and `VersionId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html#cfn-cloudformation-moduledefaultversion-arn
   */
  readonly arn?: string;

  /**
   * The name of the module.
   *
   * Conditional: You must specify either `Arn` , or `ModuleName` and `VersionId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html#cfn-cloudformation-moduledefaultversion-modulename
   */
  readonly moduleName?: string;

  /**
   * The ID for the specific version of the module.
   *
   * Conditional: You must specify either `Arn` , or `ModuleName` and `VersionId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html#cfn-cloudformation-moduledefaultversion-versionid
   */
  readonly versionId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnModuleDefaultVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnModuleDefaultVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnModuleDefaultVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("moduleName", cdk.validateString)(properties.moduleName));
  errors.collect(cdk.propertyValidator("versionId", cdk.validateString)(properties.versionId));
  return errors.wrap("supplied properties not correct for \"CfnModuleDefaultVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnModuleDefaultVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnModuleDefaultVersionPropsValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "ModuleName": cdk.stringToCloudFormation(properties.moduleName),
    "VersionId": cdk.stringToCloudFormation(properties.versionId)
  };
}

// @ts-ignore TS6133
function CfnModuleDefaultVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnModuleDefaultVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnModuleDefaultVersionProps>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("moduleName", "ModuleName", (properties.ModuleName != null ? cfn_parse.FromCloudFormation.getString(properties.ModuleName) : undefined));
  ret.addPropertyResult("versionId", "VersionId", (properties.VersionId != null ? cfn_parse.FromCloudFormation.getString(properties.VersionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Registers the specified version of the module with the CloudFormation service.
 *
 * Registering a module makes it available for use in CloudFormation templates in your AWS account and Region.
 *
 * To specify a module version as the default version, use the `[`AWS::CloudFormation::ModuleDefaultVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduledefaultversion.html)` resource.
 *
 * For more information using modules, see [Using modules to encapsulate and reuse resource configurations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/modules.html) and [Registering extensions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/registry.html#registry-register) in the *CloudFormation User Guide* . For information on developing modules, see [Developing modules](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/modules.html) in the *CloudFormation CLI User Guide* .
 *
 * @cloudformationResource AWS::CloudFormation::ModuleVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html
 */
export class CfnModuleVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::ModuleVersion";

  /**
   * Build a CfnModuleVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnModuleVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnModuleVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnModuleVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the extension.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The description of the extension.
   *
   * @cloudformationAttribute Description
   */
  public readonly attrDescription: string;

  /**
   * The URL of a page providing detailed documentation for this module.
   *
   * @cloudformationAttribute DocumentationUrl
   */
  public readonly attrDocumentationUrl: string;

  /**
   * Whether the specified extension version is set as the default version.
   *
   * This applies only to private extensions you have registered in your account, and extensions published by AWS . For public third-party extensions, whether they are activated in your account, CloudFormation returns `null` .
   *
   * @cloudformationAttribute IsDefaultVersion
   */
  public readonly attrIsDefaultVersion: cdk.IResolvable;

  /**
   * The schema that defines the extension.
   *
   * For more information about extension schemas, see [Resource Provider Schema](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-type-schema.html) in the *CloudFormation CLI User Guide* .
   *
   * @cloudformationAttribute Schema
   */
  public readonly attrSchema: string;

  /**
   * When the specified private extension version was registered or activated in your account.
   *
   * @cloudformationAttribute TimeCreated
   */
  public readonly attrTimeCreated: string;

  /**
   * The ID of this version of the module.
   *
   * @cloudformationAttribute VersionId
   */
  public readonly attrVersionId: string;

  /**
   * The scope at which the extension is visible and usable in CloudFormation operations.
   *
   * Valid values include:
   *
   * - `PRIVATE` : The extension is only visible and usable within the account in which it is registered. AWS CloudFormation marks any extensions you register as `PRIVATE` .
   * - `PUBLIC` : The extension is publicly visible and usable within any AWS account.
   *
   * @cloudformationAttribute Visibility
   */
  public readonly attrVisibility: string;

  /**
   * The name of the module being registered.
   */
  public moduleName: string;

  /**
   * A URL to the S3 bucket containing the package that contains the template fragment and schema files for the module version to register.
   */
  public modulePackage: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnModuleVersionProps) {
    super(scope, id, {
      "type": CfnModuleVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "moduleName", this);
    cdk.requireProperty(props, "modulePackage", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDescription = cdk.Token.asString(this.getAtt("Description", cdk.ResolutionTypeHint.STRING));
    this.attrDocumentationUrl = cdk.Token.asString(this.getAtt("DocumentationUrl", cdk.ResolutionTypeHint.STRING));
    this.attrIsDefaultVersion = this.getAtt("IsDefaultVersion");
    this.attrSchema = cdk.Token.asString(this.getAtt("Schema", cdk.ResolutionTypeHint.STRING));
    this.attrTimeCreated = cdk.Token.asString(this.getAtt("TimeCreated", cdk.ResolutionTypeHint.STRING));
    this.attrVersionId = cdk.Token.asString(this.getAtt("VersionId", cdk.ResolutionTypeHint.STRING));
    this.attrVisibility = cdk.Token.asString(this.getAtt("Visibility", cdk.ResolutionTypeHint.STRING));
    this.moduleName = props.moduleName;
    this.modulePackage = props.modulePackage;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "moduleName": this.moduleName,
      "modulePackage": this.modulePackage
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnModuleVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnModuleVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnModuleVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html
 */
export interface CfnModuleVersionProps {
  /**
   * The name of the module being registered.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html#cfn-cloudformation-moduleversion-modulename
   */
  readonly moduleName: string;

  /**
   * A URL to the S3 bucket containing the package that contains the template fragment and schema files for the module version to register.
   *
   * > The user registering the module version must be able to access the module package in the S3 bucket. That's, the user needs to have [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html) permissions for the package. For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-moduleversion.html#cfn-cloudformation-moduleversion-modulepackage
   */
  readonly modulePackage: string;
}

/**
 * Determine whether the given properties match those of a `CfnModuleVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnModuleVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnModuleVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("moduleName", cdk.requiredValidator)(properties.moduleName));
  errors.collect(cdk.propertyValidator("moduleName", cdk.validateString)(properties.moduleName));
  errors.collect(cdk.propertyValidator("modulePackage", cdk.requiredValidator)(properties.modulePackage));
  errors.collect(cdk.propertyValidator("modulePackage", cdk.validateString)(properties.modulePackage));
  return errors.wrap("supplied properties not correct for \"CfnModuleVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnModuleVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnModuleVersionPropsValidator(properties).assertSuccess();
  return {
    "ModuleName": cdk.stringToCloudFormation(properties.moduleName),
    "ModulePackage": cdk.stringToCloudFormation(properties.modulePackage)
  };
}

// @ts-ignore TS6133
function CfnModuleVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnModuleVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnModuleVersionProps>();
  ret.addPropertyResult("moduleName", "ModuleName", (properties.ModuleName != null ? cfn_parse.FromCloudFormation.getString(properties.ModuleName) : undefined));
  ret.addPropertyResult("modulePackage", "ModulePackage", (properties.ModulePackage != null ? cfn_parse.FromCloudFormation.getString(properties.ModulePackage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Tests and publishes a registered extension as a public, third-party extension.
 *
 * CloudFormation first tests the extension to make sure it meets all necessary requirements for being published in the CloudFormation registry. If it does, CloudFormation then publishes it to the registry as a public third-party extension in this Region. Public extensions are available for use by all CloudFormation users.
 *
 * - For resource types, testing includes passing all contracts tests defined for the type.
 * - For modules, testing includes determining if the module's model meets all necessary requirements.
 *
 * For more information, see [Testing your public extension prior to publishing](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/publish-extension.html#publish-extension-testing) in the *CloudFormation CLI User Guide* .
 *
 * If you don't specify a version, CloudFormation uses the default version of the extension in your account and Region for testing.
 *
 * To perform testing, CloudFormation assumes the execution role specified when the type was registered.
 *
 * An extension must have a test status of `PASSED` before it can be published. For more information, see [Publishing extensions to make them available for public use](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-type-publish.html) in the *CloudFormation CLI User Guide* .
 *
 * @cloudformationResource AWS::CloudFormation::PublicTypeVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html
 */
export class CfnPublicTypeVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::PublicTypeVersion";

  /**
   * Build a CfnPublicTypeVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPublicTypeVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPublicTypeVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPublicTypeVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Number (ARN) assigned to the public extension upon publication.
   *
   * @cloudformationAttribute PublicTypeArn
   */
  public readonly attrPublicTypeArn: string;

  /**
   * The publisher ID of the extension publisher.
   *
   * This applies only to public third-party extensions. For private registered extensions, and extensions provided by AWS , CloudFormation returns `null` .
   *
   * @cloudformationAttribute PublisherId
   */
  public readonly attrPublisherId: string;

  /**
   * The Amazon Resource Number (ARN) assigned to this version of the extension.
   *
   * @cloudformationAttribute TypeVersionArn
   */
  public readonly attrTypeVersionArn: string;

  /**
   * The Amazon Resource Number (ARN) of the extension.
   */
  public arn?: string;

  /**
   * The S3 bucket to which CloudFormation delivers the contract test execution logs.
   */
  public logDeliveryBucket?: string;

  /**
   * The version number to assign to this version of the extension.
   */
  public publicVersionNumber?: string;

  /**
   * The type of the extension to test.
   */
  public type?: string;

  /**
   * The name of the extension to test.
   */
  public typeName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPublicTypeVersionProps = {}) {
    super(scope, id, {
      "type": CfnPublicTypeVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrPublicTypeArn = cdk.Token.asString(this.getAtt("PublicTypeArn", cdk.ResolutionTypeHint.STRING));
    this.attrPublisherId = cdk.Token.asString(this.getAtt("PublisherId", cdk.ResolutionTypeHint.STRING));
    this.attrTypeVersionArn = cdk.Token.asString(this.getAtt("TypeVersionArn", cdk.ResolutionTypeHint.STRING));
    this.arn = props.arn;
    this.logDeliveryBucket = props.logDeliveryBucket;
    this.publicVersionNumber = props.publicVersionNumber;
    this.type = props.type;
    this.typeName = props.typeName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "arn": this.arn,
      "logDeliveryBucket": this.logDeliveryBucket,
      "publicVersionNumber": this.publicVersionNumber,
      "type": this.type,
      "typeName": this.typeName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPublicTypeVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPublicTypeVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPublicTypeVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html
 */
export interface CfnPublicTypeVersionProps {
  /**
   * The Amazon Resource Number (ARN) of the extension.
   *
   * Conditional: You must specify `Arn` , or `TypeName` and `Type` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-arn
   */
  readonly arn?: string;

  /**
   * The S3 bucket to which CloudFormation delivers the contract test execution logs.
   *
   * CloudFormation delivers the logs by the time contract testing has completed and the extension has been assigned a test type status of `PASSED` or `FAILED` .
   *
   * The user initiating the stack operation must be able to access items in the specified S3 bucket. Specifically, the user needs the following permissions:
   *
   * - GetObject
   * - PutObject
   *
   * For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-logdeliverybucket
   */
  readonly logDeliveryBucket?: string;

  /**
   * The version number to assign to this version of the extension.
   *
   * Use the following format, and adhere to semantic versioning when assigning a version number to your extension:
   *
   * `MAJOR.MINOR.PATCH`
   *
   * For more information, see [Semantic Versioning 2.0.0](https://docs.aws.amazon.com/https://semver.org/) .
   *
   * If you don't specify a version number, CloudFormation increments the version number by one minor version release.
   *
   * You cannot specify a version number the first time you publish a type. AWS CloudFormation automatically sets the first version number to be `1.0.0` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-publicversionnumber
   */
  readonly publicVersionNumber?: string;

  /**
   * The type of the extension to test.
   *
   * Conditional: You must specify `Arn` , or `TypeName` and `Type` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-type
   */
  readonly type?: string;

  /**
   * The name of the extension to test.
   *
   * Conditional: You must specify `Arn` , or `TypeName` and `Type` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publictypeversion.html#cfn-cloudformation-publictypeversion-typename
   */
  readonly typeName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPublicTypeVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnPublicTypeVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPublicTypeVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("logDeliveryBucket", cdk.validateString)(properties.logDeliveryBucket));
  errors.collect(cdk.propertyValidator("publicVersionNumber", cdk.validateString)(properties.publicVersionNumber));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("typeName", cdk.validateString)(properties.typeName));
  return errors.wrap("supplied properties not correct for \"CfnPublicTypeVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnPublicTypeVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPublicTypeVersionPropsValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "LogDeliveryBucket": cdk.stringToCloudFormation(properties.logDeliveryBucket),
    "PublicVersionNumber": cdk.stringToCloudFormation(properties.publicVersionNumber),
    "Type": cdk.stringToCloudFormation(properties.type),
    "TypeName": cdk.stringToCloudFormation(properties.typeName)
  };
}

// @ts-ignore TS6133
function CfnPublicTypeVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPublicTypeVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPublicTypeVersionProps>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("logDeliveryBucket", "LogDeliveryBucket", (properties.LogDeliveryBucket != null ? cfn_parse.FromCloudFormation.getString(properties.LogDeliveryBucket) : undefined));
  ret.addPropertyResult("publicVersionNumber", "PublicVersionNumber", (properties.PublicVersionNumber != null ? cfn_parse.FromCloudFormation.getString(properties.PublicVersionNumber) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("typeName", "TypeName", (properties.TypeName != null ? cfn_parse.FromCloudFormation.getString(properties.TypeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Registers your account as a publisher of public extensions in the CloudFormation registry.
 *
 * Public extensions are available for use by all CloudFormation users.
 *
 * For information on requirements for registering as a public extension publisher, see [Registering your account to publish CloudFormation extensions](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/publish-extension.html#publish-extension-prereqs) in the *CloudFormation CLI User Guide* .
 *
 * @cloudformationResource AWS::CloudFormation::Publisher
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publisher.html
 */
export class CfnPublisher extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::Publisher";

  /**
   * Build a CfnPublisher from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPublisher {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPublisherPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPublisher(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The type of account used as the identity provider when registering this publisher with CloudFormation.
   *
   * @cloudformationAttribute IdentityProvider
   */
  public readonly attrIdentityProvider: string;

  /**
   * The ID of the extension publisher.
   *
   * @cloudformationAttribute PublisherId
   */
  public readonly attrPublisherId: string;

  /**
   * The URL to the publisher's profile with the identity provider.
   *
   * @cloudformationAttribute PublisherProfile
   */
  public readonly attrPublisherProfile: string;

  /**
   * Whether the publisher is verified. Currently, all registered publishers are verified.
   *
   * @cloudformationAttribute PublisherStatus
   */
  public readonly attrPublisherStatus: string;

  /**
   * Whether you accept the [Terms and Conditions](https://docs.aws.amazon.com/https://cloudformation-registry-documents.s3.amazonaws.com/Terms_and_Conditions_for_AWS_CloudFormation_Registry_Publishers.pdf) for publishing extensions in the CloudFormation registry. You must accept the terms and conditions in order to register to publish public extensions to the CloudFormation registry.
   */
  public acceptTermsAndConditions: boolean | cdk.IResolvable;

  /**
   * If you are using a Bitbucket or GitHub account for identity verification, the Amazon Resource Name (ARN) for your connection to that account.
   */
  public connectionArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPublisherProps) {
    super(scope, id, {
      "type": CfnPublisher.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "acceptTermsAndConditions", this);

    this.attrIdentityProvider = cdk.Token.asString(this.getAtt("IdentityProvider", cdk.ResolutionTypeHint.STRING));
    this.attrPublisherId = cdk.Token.asString(this.getAtt("PublisherId", cdk.ResolutionTypeHint.STRING));
    this.attrPublisherProfile = cdk.Token.asString(this.getAtt("PublisherProfile", cdk.ResolutionTypeHint.STRING));
    this.attrPublisherStatus = cdk.Token.asString(this.getAtt("PublisherStatus", cdk.ResolutionTypeHint.STRING));
    this.acceptTermsAndConditions = props.acceptTermsAndConditions;
    this.connectionArn = props.connectionArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptTermsAndConditions": this.acceptTermsAndConditions,
      "connectionArn": this.connectionArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPublisher.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPublisherPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPublisher`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publisher.html
 */
export interface CfnPublisherProps {
  /**
   * Whether you accept the [Terms and Conditions](https://docs.aws.amazon.com/https://cloudformation-registry-documents.s3.amazonaws.com/Terms_and_Conditions_for_AWS_CloudFormation_Registry_Publishers.pdf) for publishing extensions in the CloudFormation registry. You must accept the terms and conditions in order to register to publish public extensions to the CloudFormation registry.
   *
   * The default is `false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publisher.html#cfn-cloudformation-publisher-accepttermsandconditions
   */
  readonly acceptTermsAndConditions: boolean | cdk.IResolvable;

  /**
   * If you are using a Bitbucket or GitHub account for identity verification, the Amazon Resource Name (ARN) for your connection to that account.
   *
   * For more information, see [Registering your account to publish CloudFormation extensions](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/publish-extension.html#publish-extension-prereqs) in the *CloudFormation CLI User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-publisher.html#cfn-cloudformation-publisher-connectionarn
   */
  readonly connectionArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPublisherProps`
 *
 * @param properties - the TypeScript properties of a `CfnPublisherProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPublisherPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptTermsAndConditions", cdk.requiredValidator)(properties.acceptTermsAndConditions));
  errors.collect(cdk.propertyValidator("acceptTermsAndConditions", cdk.validateBoolean)(properties.acceptTermsAndConditions));
  errors.collect(cdk.propertyValidator("connectionArn", cdk.validateString)(properties.connectionArn));
  return errors.wrap("supplied properties not correct for \"CfnPublisherProps\"");
}

// @ts-ignore TS6133
function convertCfnPublisherPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPublisherPropsValidator(properties).assertSuccess();
  return {
    "AcceptTermsAndConditions": cdk.booleanToCloudFormation(properties.acceptTermsAndConditions),
    "ConnectionArn": cdk.stringToCloudFormation(properties.connectionArn)
  };
}

// @ts-ignore TS6133
function CfnPublisherPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPublisherProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPublisherProps>();
  ret.addPropertyResult("acceptTermsAndConditions", "AcceptTermsAndConditions", (properties.AcceptTermsAndConditions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AcceptTermsAndConditions) : undefined));
  ret.addPropertyResult("connectionArn", "ConnectionArn", (properties.ConnectionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies the default version of a resource.
 *
 * The default version of a resource will be used in CloudFormation operations.
 *
 * @cloudformationResource AWS::CloudFormation::ResourceDefaultVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html
 */
export class CfnResourceDefaultVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::ResourceDefaultVersion";

  /**
   * Build a CfnResourceDefaultVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceDefaultVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourceDefaultVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourceDefaultVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the resource.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the resource.
   */
  public typeName?: string;

  /**
   * The Amazon Resource Name (ARN) of the resource version.
   */
  public typeVersionArn?: string;

  /**
   * The ID of a specific version of the resource.
   */
  public versionId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceDefaultVersionProps = {}) {
    super(scope, id, {
      "type": CfnResourceDefaultVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.typeName = props.typeName;
    this.typeVersionArn = props.typeVersionArn;
    this.versionId = props.versionId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "typeName": this.typeName,
      "typeVersionArn": this.typeVersionArn,
      "versionId": this.versionId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceDefaultVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourceDefaultVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResourceDefaultVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html
 */
export interface CfnResourceDefaultVersionProps {
  /**
   * The name of the resource.
   *
   * Conditional: You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html#cfn-cloudformation-resourcedefaultversion-typename
   */
  readonly typeName?: string;

  /**
   * The Amazon Resource Name (ARN) of the resource version.
   *
   * Conditional: You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html#cfn-cloudformation-resourcedefaultversion-typeversionarn
   */
  readonly typeVersionArn?: string;

  /**
   * The ID of a specific version of the resource.
   *
   * The version ID is the value at the end of the Amazon Resource Name (ARN) assigned to the resource version when it's registered.
   *
   * Conditional: You must specify either `TypeVersionArn` , or `TypeName` and `VersionId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourcedefaultversion.html#cfn-cloudformation-resourcedefaultversion-versionid
   */
  readonly versionId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourceDefaultVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceDefaultVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceDefaultVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("typeName", cdk.validateString)(properties.typeName));
  errors.collect(cdk.propertyValidator("typeVersionArn", cdk.validateString)(properties.typeVersionArn));
  errors.collect(cdk.propertyValidator("versionId", cdk.validateString)(properties.versionId));
  return errors.wrap("supplied properties not correct for \"CfnResourceDefaultVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnResourceDefaultVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceDefaultVersionPropsValidator(properties).assertSuccess();
  return {
    "TypeName": cdk.stringToCloudFormation(properties.typeName),
    "TypeVersionArn": cdk.stringToCloudFormation(properties.typeVersionArn),
    "VersionId": cdk.stringToCloudFormation(properties.versionId)
  };
}

// @ts-ignore TS6133
function CfnResourceDefaultVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceDefaultVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceDefaultVersionProps>();
  ret.addPropertyResult("typeName", "TypeName", (properties.TypeName != null ? cfn_parse.FromCloudFormation.getString(properties.TypeName) : undefined));
  ret.addPropertyResult("typeVersionArn", "TypeVersionArn", (properties.TypeVersionArn != null ? cfn_parse.FromCloudFormation.getString(properties.TypeVersionArn) : undefined));
  ret.addPropertyResult("versionId", "VersionId", (properties.VersionId != null ? cfn_parse.FromCloudFormation.getString(properties.VersionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Registers a resource version with the CloudFormation service.
 *
 * Registering a resource version makes it available for use in CloudFormation templates in your AWS account , and includes:
 *
 * - Validating the resource schema.
 * - Determining which handlers, if any, have been specified for the resource.
 * - Making the resource available for use in your account.
 *
 * For more information on how to develop resources and ready them for registration, see [Creating Resource Providers](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-types.html) in the *CloudFormation CLI User Guide* .
 *
 * You can have a maximum of 50 resource versions registered at a time. This maximum is per account and per Region.
 *
 * @cloudformationResource AWS::CloudFormation::ResourceVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html
 */
export class CfnResourceVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::ResourceVersion";

  /**
   * Build a CfnResourceVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourceVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourceVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the extension.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Whether the specified extension version is set as the default version.
   *
   * This applies only to private extensions you have registered in your account, and extensions published by AWS . For public third-party extensions, whether they are activated in your account, CloudFormation returns `null` .
   *
   * @cloudformationAttribute IsDefaultVersion
   */
  public readonly attrIsDefaultVersion: cdk.IResolvable;

  /**
   * For resource type extensions, the provisioning behavior of the resource type. AWS CloudFormation determines the provisioning type during registration, based on the types of handlers in the schema handler package submitted.
   *
   * Valid values include:
   *
   * - `FULLY_MUTABLE` : The resource type includes an update handler to process updates to the type during stack update operations.
   * - `IMMUTABLE` : The resource type doesn't include an update handler, so the type can't be updated and must instead be replaced during stack update operations.
   * - `NON_PROVISIONABLE` : The resource type doesn't include all the following handlers, and therefore can't actually be provisioned.
   *
   * - create
   * - read
   * - delete
   *
   * @cloudformationAttribute ProvisioningType
   */
  public readonly attrProvisioningType: string;

  /**
   * The Amazon Resource Name (ARN) of the extension.
   *
   * @cloudformationAttribute TypeArn
   */
  public readonly attrTypeArn: string;

  /**
   * The ID of a specific version of the extension. The version ID is the value at the end of the Amazon Resource Name (ARN) assigned to the extension version when it is registered.
   *
   * If you specify a `VersionId` , `DescribeType` returns information about that specific extension version. Otherwise, it returns information about the default extension version.
   *
   * @cloudformationAttribute VersionId
   */
  public readonly attrVersionId: string;

  /**
   * The scope at which the extension is visible and usable in CloudFormation operations.
   *
   * Valid values include:
   *
   * - `PRIVATE` : The extension is only visible and usable within the account in which it is registered. AWS CloudFormation marks any extensions you register as `PRIVATE` .
   * - `PUBLIC` : The extension is publicly visible and usable within any AWS account.
   *
   * @cloudformationAttribute Visibility
   */
  public readonly attrVisibility: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role for CloudFormation to assume when invoking the resource.
   */
  public executionRoleArn?: string;

  /**
   * Logging configuration information for a resource.
   */
  public loggingConfig?: cdk.IResolvable | CfnResourceVersion.LoggingConfigProperty;

  /**
   * A URL to the S3 bucket containing the resource project package that contains the necessary files for the resource you want to register.
   */
  public schemaHandlerPackage: string;

  /**
   * The name of the resource being registered.
   */
  public typeName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceVersionProps) {
    super(scope, id, {
      "type": CfnResourceVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "schemaHandlerPackage", this);
    cdk.requireProperty(props, "typeName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrIsDefaultVersion = this.getAtt("IsDefaultVersion");
    this.attrProvisioningType = cdk.Token.asString(this.getAtt("ProvisioningType", cdk.ResolutionTypeHint.STRING));
    this.attrTypeArn = cdk.Token.asString(this.getAtt("TypeArn", cdk.ResolutionTypeHint.STRING));
    this.attrVersionId = cdk.Token.asString(this.getAtt("VersionId", cdk.ResolutionTypeHint.STRING));
    this.attrVisibility = cdk.Token.asString(this.getAtt("Visibility", cdk.ResolutionTypeHint.STRING));
    this.executionRoleArn = props.executionRoleArn;
    this.loggingConfig = props.loggingConfig;
    this.schemaHandlerPackage = props.schemaHandlerPackage;
    this.typeName = props.typeName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "executionRoleArn": this.executionRoleArn,
      "loggingConfig": this.loggingConfig,
      "schemaHandlerPackage": this.schemaHandlerPackage,
      "typeName": this.typeName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourceVersionPropsToCloudFormation(props);
  }
}

export namespace CfnResourceVersion {
  /**
   * Logging configuration information for a resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-resourceversion-loggingconfig.html
   */
  export interface LoggingConfigProperty {
    /**
     * The Amazon CloudWatch logs group to which CloudFormation sends error logging information when invoking the type's handlers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-resourceversion-loggingconfig.html#cfn-cloudformation-resourceversion-loggingconfig-loggroupname
     */
    readonly logGroupName?: string;

    /**
     * The ARN of the role that CloudFormation should assume when sending log entries to CloudWatch logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-resourceversion-loggingconfig.html#cfn-cloudformation-resourceversion-loggingconfig-logrolearn
     */
    readonly logRoleArn?: string;
  }
}

/**
 * Properties for defining a `CfnResourceVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html
 */
export interface CfnResourceVersionProps {
  /**
   * The Amazon Resource Name (ARN) of the IAM role for CloudFormation to assume when invoking the resource.
   *
   * If your resource calls AWS APIs in any of its handlers, you must create an *[IAM execution role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)* that includes the necessary permissions to call those AWS APIs, and provision that execution role in your account. When CloudFormation needs to invoke the resource type handler, CloudFormation assumes this execution role to create a temporary session token, which it then passes to the resource type handler, thereby supplying your resource type with the appropriate credentials.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-executionrolearn
   */
  readonly executionRoleArn?: string;

  /**
   * Logging configuration information for a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-loggingconfig
   */
  readonly loggingConfig?: cdk.IResolvable | CfnResourceVersion.LoggingConfigProperty;

  /**
   * A URL to the S3 bucket containing the resource project package that contains the necessary files for the resource you want to register.
   *
   * For information on generating a schema handler package for the resource you want to register, see [submit](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-type-cli-submit.html) in the *CloudFormation CLI User Guide* .
   *
   * > The user registering the resource must be able to access the package in the S3 bucket. That is, the user needs to have [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html) permissions for the schema handler package. For more information, see [Actions, Resources, and Condition Keys for Amazon S3](https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazons3.html) in the *AWS Identity and Access Management User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-schemahandlerpackage
   */
  readonly schemaHandlerPackage: string;

  /**
   * The name of the resource being registered.
   *
   * We recommend that resource names adhere to the following pattern: *company_or_organization* :: *service* :: *type* .
   *
   * > The following organization namespaces are reserved and can't be used in your resource names:
   * >
   * > - `Alexa`
   * > - `AMZN`
   * > - `Amazon`
   * > - `AWS`
   * > - `Custom`
   * > - `Dev`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html#cfn-cloudformation-resourceversion-typename
   */
  readonly typeName: string;
}

/**
 * Determine whether the given properties match those of a `LoggingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceVersionLoggingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logRoleArn", cdk.validateString)(properties.logRoleArn));
  return errors.wrap("supplied properties not correct for \"LoggingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceVersionLoggingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceVersionLoggingConfigPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName),
    "LogRoleArn": cdk.stringToCloudFormation(properties.logRoleArn)
  };
}

// @ts-ignore TS6133
function CfnResourceVersionLoggingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceVersion.LoggingConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceVersion.LoggingConfigProperty>();
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addPropertyResult("logRoleArn", "LogRoleArn", (properties.LogRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogRoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnResourceVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("loggingConfig", CfnResourceVersionLoggingConfigPropertyValidator)(properties.loggingConfig));
  errors.collect(cdk.propertyValidator("schemaHandlerPackage", cdk.requiredValidator)(properties.schemaHandlerPackage));
  errors.collect(cdk.propertyValidator("schemaHandlerPackage", cdk.validateString)(properties.schemaHandlerPackage));
  errors.collect(cdk.propertyValidator("typeName", cdk.requiredValidator)(properties.typeName));
  errors.collect(cdk.propertyValidator("typeName", cdk.validateString)(properties.typeName));
  return errors.wrap("supplied properties not correct for \"CfnResourceVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnResourceVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceVersionPropsValidator(properties).assertSuccess();
  return {
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "LoggingConfig": convertCfnResourceVersionLoggingConfigPropertyToCloudFormation(properties.loggingConfig),
    "SchemaHandlerPackage": cdk.stringToCloudFormation(properties.schemaHandlerPackage),
    "TypeName": cdk.stringToCloudFormation(properties.typeName)
  };
}

// @ts-ignore TS6133
function CfnResourceVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceVersionProps>();
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("loggingConfig", "LoggingConfig", (properties.LoggingConfig != null ? CfnResourceVersionLoggingConfigPropertyFromCloudFormation(properties.LoggingConfig) : undefined));
  ret.addPropertyResult("schemaHandlerPackage", "SchemaHandlerPackage", (properties.SchemaHandlerPackage != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaHandlerPackage) : undefined));
  ret.addPropertyResult("typeName", "TypeName", (properties.TypeName != null ? cfn_parse.FromCloudFormation.getString(properties.TypeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::CloudFormation::Stack` resource nests a stack as a resource in a top-level template.
 *
 * You can add output values from a nested stack within the containing template. You use the [GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html) function with the nested stack's logical name and the name of the output value in the nested stack in the format `Outputs. *NestedStackOutputName*` .
 *
 * > We strongly recommend that updates to nested stacks are run from the parent stack.
 *
 * When you apply template changes to update a top-level stack, CloudFormation updates the top-level stack and initiates an update to its nested stacks. CloudFormation updates the resources of modified nested stacks, but doesn't update the resources of unmodified nested stacks. For more information, see [CloudFormation stack updates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html) .
 *
 * > You must acknowledge IAM capabilities for nested stacks that contain IAM resources. Also, verify that you have cancel update stack permissions, which is required if an update rolls back. For more information about IAM and CloudFormation , see [Controlling access with AWS Identity and Access Management](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html) . > A subset of `AWS::CloudFormation::Stack` resource type properties listed below are available to customers using AWS CloudFormation , AWS CDK , and AWS Cloud Control API to configure.
 * >
 * > - `NotificationARNs`
 * > - `Parameters`
 * > - `Tags`
 * > - `TemplateURL`
 * > - `TimeoutInMinutes`
 * >
 * > These properties can be configured only when using AWS Cloud Control API . This is because the below properties are set by the parent stack, and thus cannot be configured using AWS CloudFormation or AWS CDK but only AWS Cloud Control API .
 * >
 * > - `Capabilities`
 * > - `Description`
 * > - `DisableRollback`
 * > - `EnableTerminationProtection`
 * > - `RoleARN`
 * > - `StackName`
 * > - `StackPolicyBody`
 * > - `StackPolicyURL`
 * > - `StackStatusReason`
 * > - `TemplateBody`
 * >
 * > Customers that configure `AWS::CloudFormation::Stack` using AWS CloudFormation and AWS CDK can do so for nesting a CloudFormation stack as a resource in their top-level template.
 * >
 * > These read-only properties can be accessed only when using AWS Cloud Control API .
 * >
 * > - `ChangeSetId`
 * > - `CreationTime`
 * > - `LastUpdateTime`
 * > - `Outputs`
 * > - `ParentId`
 * > - `RootId`
 * > - `StackId`
 * > - `StackStatus`
 *
 * @cloudformationResource AWS::CloudFormation::Stack
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stack.html
 */
export class CfnStack extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::Stack";

  /**
   * Build a CfnStack from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStack {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStackPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStack(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the unique ID of the change set.
   *
   * @cloudformationAttribute ChangeSetId
   */
  public readonly attrChangeSetId: string;

  /**
   * Returns The time at which the stack was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * Returns the time the stack was last updated. This will only be returned if the stack has been updated at least once.
   *
   * @cloudformationAttribute LastUpdateTime
   */
  public readonly attrLastUpdateTime: string;

  /**
   * Returns a list of output structures.
   *
   * @cloudformationAttribute Outputs
   */
  public readonly attrOutputs: cdk.IResolvable;

  /**
   * For nested stacks--stacks created as resources for another stack--returns the stack ID of the direct parent of this stack. For the first level of nested stacks, the root stack is also the parent stack.
   *
   * For more information, see [Working with Nested Stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html) in the *AWS CloudFormation User Guide* .
   *
   * @cloudformationAttribute ParentId
   */
  public readonly attrParentId: string;

  /**
   * For nested stacks--stacks created as resources for another stack--returns the stack ID of the top-level stack to which the nested stack ultimately belongs.
   *
   * For more information, see [Working with Nested Stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html) in the *AWS CloudFormation User Guide* .
   *
   * @cloudformationAttribute RootId
   */
  public readonly attrRootId: string;

  /**
   * Returns the unique identifier of the stack.
   *
   * @cloudformationAttribute StackId
   */
  public readonly attrStackId: string;

  /**
   * Returns a success or failure message associated with the stack status.
   *
   * @cloudformationAttribute StackStatus
   */
  public readonly attrStackStatus: string;

  /**
   * The Amazon Simple Notification Service (Amazon SNS) topic ARNs to publish stack related events.
   */
  public notificationArns?: Array<string>;

  /**
   * The set value pairs that represent the parameters passed to CloudFormation when this nested stack is created.
   */
  public parameters?: cdk.IResolvable | Record<string, string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key-value pairs to associate with this stack.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Location of file containing the template body.
   */
  public templateUrl?: string;

  /**
   * The length of time, in minutes, that CloudFormation waits for the nested stack to reach the `CREATE_COMPLETE` state.
   */
  public timeoutInMinutes?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStackProps = {}) {
    super(scope, id, {
      "type": CfnStack.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrChangeSetId = cdk.Token.asString(this.getAtt("ChangeSetId", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrLastUpdateTime = cdk.Token.asString(this.getAtt("LastUpdateTime", cdk.ResolutionTypeHint.STRING));
    this.attrOutputs = this.getAtt("Outputs");
    this.attrParentId = cdk.Token.asString(this.getAtt("ParentId", cdk.ResolutionTypeHint.STRING));
    this.attrRootId = cdk.Token.asString(this.getAtt("RootId", cdk.ResolutionTypeHint.STRING));
    this.attrStackId = cdk.Token.asString(this.getAtt("StackId", cdk.ResolutionTypeHint.STRING));
    this.attrStackStatus = cdk.Token.asString(this.getAtt("StackStatus", cdk.ResolutionTypeHint.STRING));
    this.notificationArns = props.notificationArns;
    this.parameters = props.parameters;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CloudFormation::Stack", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.templateUrl = props.templateUrl;
    this.timeoutInMinutes = props.timeoutInMinutes;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::CloudFormation::Stack' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "notificationArns": this.notificationArns,
      "parameters": this.parameters,
      "tags": this.tags.renderTags(),
      "templateUrl": this.templateUrl,
      "timeoutInMinutes": this.timeoutInMinutes
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStack.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStackPropsToCloudFormation(props);
  }
}

export namespace CfnStack {
  /**
   * The Output data type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stack-output.html
   */
  export interface OutputProperty {
    /**
     * User defined description associated with the output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stack-output.html#cfn-cloudformation-stack-output-description
     */
    readonly description?: string;

    /**
     * The name of the export associated with the output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stack-output.html#cfn-cloudformation-stack-output-exportname
     */
    readonly exportName?: string;

    /**
     * The key associated with the output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stack-output.html#cfn-cloudformation-stack-output-outputkey
     */
    readonly outputKey?: string;

    /**
     * The value associated with the output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stack-output.html#cfn-cloudformation-stack-output-outputvalue
     */
    readonly outputValue?: string;
  }
}

/**
 * Properties for defining a `CfnStack`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stack.html
 */
export interface CfnStackProps {
  /**
   * The Amazon Simple Notification Service (Amazon SNS) topic ARNs to publish stack related events.
   *
   * You can find your Amazon SNS topic ARNs using the Amazon SNS console or your Command Line Interface (CLI).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stack.html#cfn-cloudformation-stack-notificationarns
   */
  readonly notificationArns?: Array<string>;

  /**
   * The set value pairs that represent the parameters passed to CloudFormation when this nested stack is created.
   *
   * Each parameter has a name corresponding to a parameter defined in the embedded template and a value representing the value that you want to set for the parameter.
   *
   * > If you use the `Ref` function to pass a parameter value to a nested stack, comma-delimited list parameters must be of type `String` . In other words, you can't pass values that are of type `CommaDelimitedList` to nested stacks.
   *
   * Conditional. Required if the nested stack requires input parameters.
   *
   * Whether an update causes interruptions depends on the resources that are being updated. An update never causes a nested stack to be replaced.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stack.html#cfn-cloudformation-stack-parameters
   */
  readonly parameters?: cdk.IResolvable | Record<string, string>;

  /**
   * Key-value pairs to associate with this stack.
   *
   * AWS CloudFormation also propagates these tags to the resources created in the stack. A maximum number of 50 tags can be specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stack.html#cfn-cloudformation-stack-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Location of file containing the template body.
   *
   * The URL must point to a template (max size: 460,800 bytes) that's located in an Amazon S3 bucket. For more information, see [Template anatomy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html) .
   *
   * Whether an update causes interruptions depends on the resources that are being updated. An update never causes a nested stack to be replaced.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stack.html#cfn-cloudformation-stack-templateurl
   */
  readonly templateUrl?: string;

  /**
   * The length of time, in minutes, that CloudFormation waits for the nested stack to reach the `CREATE_COMPLETE` state.
   *
   * The default is no timeout. When CloudFormation detects that the nested stack has reached the `CREATE_COMPLETE` state, it marks the nested stack resource as `CREATE_COMPLETE` in the parent stack and resumes creating the parent stack. If the timeout period expires before the nested stack reaches `CREATE_COMPLETE` , CloudFormation marks the nested stack as failed and rolls back both the nested stack and parent stack.
   *
   * Updates aren't supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stack.html#cfn-cloudformation-stack-timeoutinminutes
   */
  readonly timeoutInMinutes?: number;
}

/**
 * Determine whether the given properties match those of a `OutputProperty`
 *
 * @param properties - the TypeScript properties of a `OutputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackOutputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("exportName", cdk.validateString)(properties.exportName));
  errors.collect(cdk.propertyValidator("outputKey", cdk.validateString)(properties.outputKey));
  errors.collect(cdk.propertyValidator("outputValue", cdk.validateString)(properties.outputValue));
  return errors.wrap("supplied properties not correct for \"OutputProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackOutputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackOutputPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExportName": cdk.stringToCloudFormation(properties.exportName),
    "OutputKey": cdk.stringToCloudFormation(properties.outputKey),
    "OutputValue": cdk.stringToCloudFormation(properties.outputValue)
  };
}

// @ts-ignore TS6133
function CfnStackOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStack.OutputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.OutputProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("exportName", "ExportName", (properties.ExportName != null ? cfn_parse.FromCloudFormation.getString(properties.ExportName) : undefined));
  ret.addPropertyResult("outputKey", "OutputKey", (properties.OutputKey != null ? cfn_parse.FromCloudFormation.getString(properties.OutputKey) : undefined));
  ret.addPropertyResult("outputValue", "OutputValue", (properties.OutputValue != null ? cfn_parse.FromCloudFormation.getString(properties.OutputValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStackProps`
 *
 * @param properties - the TypeScript properties of a `CfnStackProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("notificationArns", cdk.listValidator(cdk.validateString))(properties.notificationArns));
  errors.collect(cdk.propertyValidator("parameters", cdk.hashValidator(cdk.validateString))(properties.parameters));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("templateUrl", cdk.validateString)(properties.templateUrl));
  errors.collect(cdk.propertyValidator("timeoutInMinutes", cdk.validateNumber)(properties.timeoutInMinutes));
  return errors.wrap("supplied properties not correct for \"CfnStackProps\"");
}

// @ts-ignore TS6133
function convertCfnStackPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackPropsValidator(properties).assertSuccess();
  return {
    "NotificationARNs": cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationArns),
    "Parameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TemplateURL": cdk.stringToCloudFormation(properties.templateUrl),
    "TimeoutInMinutes": cdk.numberToCloudFormation(properties.timeoutInMinutes)
  };
}

// @ts-ignore TS6133
function CfnStackPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStackProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackProps>();
  ret.addPropertyResult("notificationArns", "NotificationARNs", (properties.NotificationARNs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.NotificationARNs) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("templateUrl", "TemplateURL", (properties.TemplateURL != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateURL) : undefined));
  ret.addPropertyResult("timeoutInMinutes", "TimeoutInMinutes", (properties.TimeoutInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::CloudFormation::StackSet` enables you to provision stacks into AWS accounts and across Regions by using a single CloudFormation template.
 *
 * In the stack set, you specify the template to use, in addition to any parameters and capabilities that the template requires.
 *
 * > Run deployments to nested StackSets from the parent stack, not directly through the StackSet API.
 *
 * @cloudformationResource AWS::CloudFormation::StackSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html
 */
export class CfnStackSet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::StackSet";

  /**
   * Build a CfnStackSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStackSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStackSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStackSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the stack that you're creating.
   *
   * @cloudformationAttribute StackSetId
   */
  public readonly attrStackSetId: string;

  /**
   * The Amazon Resource Number (ARN) of the IAM role to use to create this stack set.
   */
  public administrationRoleArn?: string;

  /**
   * [ `Service-managed` permissions] Describes whether StackSets automatically deploys to AWS Organizations accounts that are added to a target organization or organizational unit (OU).
   */
  public autoDeployment?: CfnStackSet.AutoDeploymentProperty | cdk.IResolvable;

  /**
   * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account.
   */
  public callAs?: string;

  /**
   * The capabilities that are allowed in the stack set.
   */
  public capabilities?: Array<string>;

  /**
   * A description of the stack set.
   */
  public description?: string;

  /**
   * The name of the IAM execution role to use to create the stack set.
   */
  public executionRoleName?: string;

  /**
   * Describes whether StackSets performs non-conflicting operations concurrently and queues conflicting operations.
   */
  public managedExecution?: any | cdk.IResolvable;

  /**
   * The user-specified preferences for how AWS CloudFormation performs a stack set operation.
   */
  public operationPreferences?: cdk.IResolvable | CfnStackSet.OperationPreferencesProperty;

  /**
   * The input parameters for the stack set template.
   */
  public parameters?: Array<cdk.IResolvable | CfnStackSet.ParameterProperty> | cdk.IResolvable;

  /**
   * Describes how the IAM roles required for stack set operations are created.
   */
  public permissionModel: string;

  /**
   * A group of stack instances with parameters in some specific accounts and Regions.
   */
  public stackInstancesGroup?: Array<cdk.IResolvable | CfnStackSet.StackInstancesProperty> | cdk.IResolvable;

  /**
   * The name to associate with the stack set.
   */
  public stackSetName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Key-value pairs to associate with this stack.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The structure that contains the template body, with a minimum length of 1 byte and a maximum length of 51,200 bytes.
   */
  public templateBody?: string;

  /**
   * Location of file containing the template body.
   */
  public templateUrl?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStackSetProps) {
    super(scope, id, {
      "type": CfnStackSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "permissionModel", this);
    cdk.requireProperty(props, "stackSetName", this);

    this.attrStackSetId = cdk.Token.asString(this.getAtt("StackSetId", cdk.ResolutionTypeHint.STRING));
    this.administrationRoleArn = props.administrationRoleArn;
    this.autoDeployment = props.autoDeployment;
    this.callAs = props.callAs;
    this.capabilities = props.capabilities;
    this.description = props.description;
    this.executionRoleName = props.executionRoleName;
    this.managedExecution = props.managedExecution;
    this.operationPreferences = props.operationPreferences;
    this.parameters = props.parameters;
    this.permissionModel = props.permissionModel;
    this.stackInstancesGroup = props.stackInstancesGroup;
    this.stackSetName = props.stackSetName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CloudFormation::StackSet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.templateBody = props.templateBody;
    this.templateUrl = props.templateUrl;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "administrationRoleArn": this.administrationRoleArn,
      "autoDeployment": this.autoDeployment,
      "callAs": this.callAs,
      "capabilities": this.capabilities,
      "description": this.description,
      "executionRoleName": this.executionRoleName,
      "managedExecution": this.managedExecution,
      "operationPreferences": this.operationPreferences,
      "parameters": this.parameters,
      "permissionModel": this.permissionModel,
      "stackInstancesGroup": this.stackInstancesGroup,
      "stackSetName": this.stackSetName,
      "tags": this.tags.renderTags(),
      "templateBody": this.templateBody,
      "templateUrl": this.templateUrl
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStackSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStackSetPropsToCloudFormation(props);
  }
}

export namespace CfnStackSet {
  /**
   * The Parameter data type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-parameter.html
   */
  export interface ParameterProperty {
    /**
     * The key associated with the parameter.
     *
     * If you don't specify a key and value for a particular parameter, AWS CloudFormation uses the default value that's specified in your template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-parameter.html#cfn-cloudformation-stackset-parameter-parameterkey
     */
    readonly parameterKey: string;

    /**
     * The input value associated with the parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-parameter.html#cfn-cloudformation-stackset-parameter-parametervalue
     */
    readonly parameterValue: string;
  }

  /**
   * Stack instances in some specific accounts and Regions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-stackinstances.html
   */
  export interface StackInstancesProperty {
    /**
     * The AWS `OrganizationalUnitIds` or `Accounts` for which to create stack instances in the specified Regions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-stackinstances.html#cfn-cloudformation-stackset-stackinstances-deploymenttargets
     */
    readonly deploymentTargets: CfnStackSet.DeploymentTargetsProperty | cdk.IResolvable;

    /**
     * A list of stack set parameters whose values you want to override in the selected stack instances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-stackinstances.html#cfn-cloudformation-stackset-stackinstances-parameteroverrides
     */
    readonly parameterOverrides?: Array<cdk.IResolvable | CfnStackSet.ParameterProperty> | cdk.IResolvable;

    /**
     * The names of one or more Regions where you want to create stack instances using the specified AWS accounts .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-stackinstances.html#cfn-cloudformation-stackset-stackinstances-regions
     */
    readonly regions: Array<string>;
  }

  /**
   * The AWS OrganizationalUnitIds or Accounts for which to create stack instances in the specified Regions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-deploymenttargets.html
   */
  export interface DeploymentTargetsProperty {
    /**
     * Limit deployment targets to individual accounts or include additional accounts with provided OUs.
     *
     * The following is a list of possible values for the `AccountFilterType` operation.
     *
     * - `INTERSECTION` : StackSets deploys to the accounts specified in `Accounts` parameter.
     * - `DIFFERENCE` : StackSets excludes the accounts specified in `Accounts` parameter. This enables user to avoid certain accounts within an OU such as suspended accounts.
     * - `UNION` : StackSets includes additional accounts deployment targets.
     *
     * This is the default value if `AccountFilterType` is not provided. This enables user to update an entire OU and individual accounts from a different OU in one request, which used to be two separate requests.
     * - `NONE` : Deploys to all the accounts in specified organizational units (OU).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-deploymenttargets.html#cfn-cloudformation-stackset-deploymenttargets-accountfiltertype
     */
    readonly accountFilterType?: string;

    /**
     * The names of one or more AWS accounts for which you want to deploy stack set updates.
     *
     * *Pattern* : `^[0-9]{12}$`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-deploymenttargets.html#cfn-cloudformation-stackset-deploymenttargets-accounts
     */
    readonly accounts?: Array<string>;

    /**
     * Returns the value of the `AccountsUrl` property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-deploymenttargets.html#cfn-cloudformation-stackset-deploymenttargets-accountsurl
     */
    readonly accountsUrl?: string;

    /**
     * The organization root ID or organizational unit (OU) IDs to which StackSets deploys.
     *
     * *Pattern* : `^(ou-[a-z0-9]{4,32}-[a-z0-9]{8,32}|r-[a-z0-9]{4,32})$`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-deploymenttargets.html#cfn-cloudformation-stackset-deploymenttargets-organizationalunitids
     */
    readonly organizationalUnitIds?: Array<string>;
  }

  /**
   * The user-specified preferences for how AWS CloudFormation performs a stack set operation.
   *
   * For more information on maximum concurrent accounts and failure tolerance, see [Stack set operation options](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-concepts.html#stackset-ops-options) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html
   */
  export interface OperationPreferencesProperty {
    /**
     * The number of accounts, per Region, for which this operation can fail before AWS CloudFormation stops the operation in that Region.
     *
     * If the operation is stopped in a Region, AWS CloudFormation doesn't attempt the operation in any subsequent Regions.
     *
     * Conditional: You must specify either `FailureToleranceCount` or `FailureTolerancePercentage` (but not both).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-failuretolerancecount
     */
    readonly failureToleranceCount?: number;

    /**
     * The percentage of accounts, per Region, for which this stack operation can fail before AWS CloudFormation stops the operation in that Region.
     *
     * If the operation is stopped in a Region, AWS CloudFormation doesn't attempt the operation in any subsequent Regions.
     *
     * When calculating the number of accounts based on the specified percentage, AWS CloudFormation rounds *down* to the next whole number.
     *
     * Conditional: You must specify either `FailureToleranceCount` or `FailureTolerancePercentage` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-failuretolerancepercentage
     */
    readonly failureTolerancePercentage?: number;

    /**
     * The maximum number of accounts in which to perform this operation at one time.
     *
     * This is dependent on the value of `FailureToleranceCount` . `MaxConcurrentCount` is at most one more than the `FailureToleranceCount` .
     *
     * Note that this setting lets you specify the *maximum* for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling.
     *
     * Conditional: You must specify either `MaxConcurrentCount` or `MaxConcurrentPercentage` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-maxconcurrentcount
     */
    readonly maxConcurrentCount?: number;

    /**
     * The maximum percentage of accounts in which to perform this operation at one time.
     *
     * When calculating the number of accounts based on the specified percentage, AWS CloudFormation rounds down to the next whole number. This is true except in cases where rounding down would result is zero. In this case, CloudFormation sets the number as one instead.
     *
     * Note that this setting lets you specify the *maximum* for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling.
     *
     * Conditional: You must specify either `MaxConcurrentCount` or `MaxConcurrentPercentage` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-maxconcurrentpercentage
     */
    readonly maxConcurrentPercentage?: number;

    /**
     * The concurrency type of deploying StackSets operations in Regions, could be in parallel or one Region at a time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-regionconcurrencytype
     */
    readonly regionConcurrencyType?: string;

    /**
     * The order of the Regions where you want to perform the stack operation.
     *
     * > `RegionOrder` isn't followed if `AutoDeployment` is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-operationpreferences.html#cfn-cloudformation-stackset-operationpreferences-regionorder
     */
    readonly regionOrder?: Array<string>;
  }

  /**
   * [ `Service-managed` permissions] Describes whether StackSets automatically deploys to AWS Organizations accounts that are added to a target organizational unit (OU).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-autodeployment.html
   */
  export interface AutoDeploymentProperty {
    /**
     * If set to `true` , StackSets automatically deploys additional stack instances to AWS Organizations accounts that are added to a target organization or organizational unit (OU) in the specified Regions.
     *
     * If an account is removed from a target organization or OU, StackSets deletes stack instances from the account in the specified Regions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-autodeployment.html#cfn-cloudformation-stackset-autodeployment-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * If set to `true` , stack resources are retained when an account is removed from a target organization or OU.
     *
     * If set to `false` , stack resources are deleted. Specify only if `Enabled` is set to `True` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-autodeployment.html#cfn-cloudformation-stackset-autodeployment-retainstacksonaccountremoval
     */
    readonly retainStacksOnAccountRemoval?: boolean | cdk.IResolvable;
  }

  /**
   * Describes whether StackSets performs non-conflicting operations concurrently and queues conflicting operations.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-managedexecution.html
   */
  export interface ManagedExecutionProperty {
    /**
     * When `true` , StackSets performs non-conflicting operations concurrently and queues conflicting operations.
     *
     * After conflicting operations finish, StackSets starts queued operations in request order.
     *
     * > If there are already running or queued operations, StackSets queues all incoming operations even if they are non-conflicting.
     * >
     * > You can't modify your stack set's execution configuration while there are running or queued operations for that stack set.
     *
     * When `false` (default), StackSets performs one operation at a time in request order.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-stackset-managedexecution.html#cfn-cloudformation-stackset-managedexecution-active
     */
    readonly active?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnStackSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html
 */
export interface CfnStackSetProps {
  /**
   * The Amazon Resource Number (ARN) of the IAM role to use to create this stack set.
   *
   * Specify an IAM role only if you are using customized administrator roles to control which users or groups can manage specific stack sets within the same administrator account.
   *
   * Use customized administrator roles to control which users or groups can manage specific stack sets within the same administrator account. For more information, see [Prerequisites: Granting Permissions for Stack Set Operations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs.html) in the *AWS CloudFormation User Guide* .
   *
   * *Minimum* : `20`
   *
   * *Maximum* : `2048`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-administrationrolearn
   */
  readonly administrationRoleArn?: string;

  /**
   * [ `Service-managed` permissions] Describes whether StackSets automatically deploys to AWS Organizations accounts that are added to a target organization or organizational unit (OU).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-autodeployment
   */
  readonly autoDeployment?: CfnStackSet.AutoDeploymentProperty | cdk.IResolvable;

  /**
   * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account.
   *
   * By default, `SELF` is specified. Use `SELF` for stack sets with self-managed permissions.
   *
   * - To create a stack set with service-managed permissions while signed in to the management account, specify `SELF` .
   * - To create a stack set with service-managed permissions while signed in to a delegated administrator account, specify `DELEGATED_ADMIN` .
   *
   * Your AWS account must be registered as a delegated admin in the management account. For more information, see [Register a delegated administrator](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-delegated-admin.html) in the *AWS CloudFormation User Guide* .
   *
   * Stack sets with service-managed permissions are created in the management account, including stack sets that are created by delegated administrators.
   *
   * *Valid Values* : `SELF` | `DELEGATED_ADMIN`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-callas
   */
  readonly callAs?: string;

  /**
   * The capabilities that are allowed in the stack set.
   *
   * Some stack set templates might include resources that can affect permissions in your AWS account —for example, by creating new AWS Identity and Access Management ( IAM ) users. For more information, see [Acknowledging IAM Resources in AWS CloudFormation Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#capabilities) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-capabilities
   */
  readonly capabilities?: Array<string>;

  /**
   * A description of the stack set.
   *
   * *Minimum* : `1`
   *
   * *Maximum* : `1024`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-description
   */
  readonly description?: string;

  /**
   * The name of the IAM execution role to use to create the stack set.
   *
   * If you don't specify an execution role, AWS CloudFormation uses the `AWSCloudFormationStackSetExecutionRole` role for the stack set operation.
   *
   * *Minimum* : `1`
   *
   * *Maximum* : `64`
   *
   * *Pattern* : `[a-zA-Z_0-9+=,.@-]+`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-executionrolename
   */
  readonly executionRoleName?: string;

  /**
   * Describes whether StackSets performs non-conflicting operations concurrently and queues conflicting operations.
   *
   * When active, StackSets performs non-conflicting operations concurrently and queues conflicting operations. After conflicting operations finish, StackSets starts queued operations in request order.
   *
   * > If there are already running or queued operations, StackSets queues all incoming operations even if they are non-conflicting.
   * >
   * > You can't modify your stack set's execution configuration while there are running or queued operations for that stack set.
   *
   * When inactive (default), StackSets performs one operation at a time in request order.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-managedexecution
   */
  readonly managedExecution?: any | cdk.IResolvable;

  /**
   * The user-specified preferences for how AWS CloudFormation performs a stack set operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-operationpreferences
   */
  readonly operationPreferences?: cdk.IResolvable | CfnStackSet.OperationPreferencesProperty;

  /**
   * The input parameters for the stack set template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-parameters
   */
  readonly parameters?: Array<cdk.IResolvable | CfnStackSet.ParameterProperty> | cdk.IResolvable;

  /**
   * Describes how the IAM roles required for stack set operations are created.
   *
   * - With `SELF_MANAGED` permissions, you must create the administrator and execution roles required to deploy to target accounts. For more information, see [Grant Self-Managed Stack Set Permissions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html) .
   * - With `SERVICE_MANAGED` permissions, StackSets automatically creates the IAM roles required to deploy to accounts managed by AWS Organizations .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-permissionmodel
   */
  readonly permissionModel: string;

  /**
   * A group of stack instances with parameters in some specific accounts and Regions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-stackinstancesgroup
   */
  readonly stackInstancesGroup?: Array<cdk.IResolvable | CfnStackSet.StackInstancesProperty> | cdk.IResolvable;

  /**
   * The name to associate with the stack set.
   *
   * The name must be unique in the Region where you create your stack set.
   *
   * > The `StackSetName` property is required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-stacksetname
   */
  readonly stackSetName: string;

  /**
   * Key-value pairs to associate with this stack.
   *
   * AWS CloudFormation also propagates these tags to supported resources in the stack. You can specify a maximum number of 50 tags.
   *
   * If you don't specify this parameter, AWS CloudFormation doesn't modify the stack's tags. If you specify an empty value, AWS CloudFormation removes all associated tags.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The structure that contains the template body, with a minimum length of 1 byte and a maximum length of 51,200 bytes.
   *
   * You must include either `TemplateURL` or `TemplateBody` in a StackSet, but you can't use both. Dynamic references in the `TemplateBody` may not work correctly in all cases. It's recommended to pass templates containing dynamic references through `TemplateUrl` instead.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-templatebody
   */
  readonly templateBody?: string;

  /**
   * Location of file containing the template body.
   *
   * The URL must point to a template that's located in an Amazon S3 bucket or a Systems Manager document. For more information, go to [Template Anatomy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html) in the AWS CloudFormation User Guide.
   *
   * Conditional: You must specify only one of the following parameters: `TemplateBody` , `TemplateURL` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stackset.html#cfn-cloudformation-stackset-templateurl
   */
  readonly templateUrl?: string;
}

/**
 * Determine whether the given properties match those of a `ParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackSetParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameterKey", cdk.requiredValidator)(properties.parameterKey));
  errors.collect(cdk.propertyValidator("parameterKey", cdk.validateString)(properties.parameterKey));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.requiredValidator)(properties.parameterValue));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.validateString)(properties.parameterValue));
  return errors.wrap("supplied properties not correct for \"ParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackSetParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackSetParameterPropertyValidator(properties).assertSuccess();
  return {
    "ParameterKey": cdk.stringToCloudFormation(properties.parameterKey),
    "ParameterValue": cdk.stringToCloudFormation(properties.parameterValue)
  };
}

// @ts-ignore TS6133
function CfnStackSetParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStackSet.ParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackSet.ParameterProperty>();
  ret.addPropertyResult("parameterKey", "ParameterKey", (properties.ParameterKey != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterKey) : undefined));
  ret.addPropertyResult("parameterValue", "ParameterValue", (properties.ParameterValue != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentTargetsProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentTargetsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackSetDeploymentTargetsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountFilterType", cdk.validateString)(properties.accountFilterType));
  errors.collect(cdk.propertyValidator("accounts", cdk.listValidator(cdk.validateString))(properties.accounts));
  errors.collect(cdk.propertyValidator("accountsUrl", cdk.validateString)(properties.accountsUrl));
  errors.collect(cdk.propertyValidator("organizationalUnitIds", cdk.listValidator(cdk.validateString))(properties.organizationalUnitIds));
  return errors.wrap("supplied properties not correct for \"DeploymentTargetsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackSetDeploymentTargetsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackSetDeploymentTargetsPropertyValidator(properties).assertSuccess();
  return {
    "AccountFilterType": cdk.stringToCloudFormation(properties.accountFilterType),
    "Accounts": cdk.listMapper(cdk.stringToCloudFormation)(properties.accounts),
    "AccountsUrl": cdk.stringToCloudFormation(properties.accountsUrl),
    "OrganizationalUnitIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationalUnitIds)
  };
}

// @ts-ignore TS6133
function CfnStackSetDeploymentTargetsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStackSet.DeploymentTargetsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackSet.DeploymentTargetsProperty>();
  ret.addPropertyResult("accountFilterType", "AccountFilterType", (properties.AccountFilterType != null ? cfn_parse.FromCloudFormation.getString(properties.AccountFilterType) : undefined));
  ret.addPropertyResult("accounts", "Accounts", (properties.Accounts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Accounts) : undefined));
  ret.addPropertyResult("accountsUrl", "AccountsUrl", (properties.AccountsUrl != null ? cfn_parse.FromCloudFormation.getString(properties.AccountsUrl) : undefined));
  ret.addPropertyResult("organizationalUnitIds", "OrganizationalUnitIds", (properties.OrganizationalUnitIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OrganizationalUnitIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StackInstancesProperty`
 *
 * @param properties - the TypeScript properties of a `StackInstancesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackSetStackInstancesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deploymentTargets", cdk.requiredValidator)(properties.deploymentTargets));
  errors.collect(cdk.propertyValidator("deploymentTargets", CfnStackSetDeploymentTargetsPropertyValidator)(properties.deploymentTargets));
  errors.collect(cdk.propertyValidator("parameterOverrides", cdk.listValidator(CfnStackSetParameterPropertyValidator))(properties.parameterOverrides));
  errors.collect(cdk.propertyValidator("regions", cdk.requiredValidator)(properties.regions));
  errors.collect(cdk.propertyValidator("regions", cdk.listValidator(cdk.validateString))(properties.regions));
  return errors.wrap("supplied properties not correct for \"StackInstancesProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackSetStackInstancesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackSetStackInstancesPropertyValidator(properties).assertSuccess();
  return {
    "DeploymentTargets": convertCfnStackSetDeploymentTargetsPropertyToCloudFormation(properties.deploymentTargets),
    "ParameterOverrides": cdk.listMapper(convertCfnStackSetParameterPropertyToCloudFormation)(properties.parameterOverrides),
    "Regions": cdk.listMapper(cdk.stringToCloudFormation)(properties.regions)
  };
}

// @ts-ignore TS6133
function CfnStackSetStackInstancesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStackSet.StackInstancesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackSet.StackInstancesProperty>();
  ret.addPropertyResult("deploymentTargets", "DeploymentTargets", (properties.DeploymentTargets != null ? CfnStackSetDeploymentTargetsPropertyFromCloudFormation(properties.DeploymentTargets) : undefined));
  ret.addPropertyResult("parameterOverrides", "ParameterOverrides", (properties.ParameterOverrides != null ? cfn_parse.FromCloudFormation.getArray(CfnStackSetParameterPropertyFromCloudFormation)(properties.ParameterOverrides) : undefined));
  ret.addPropertyResult("regions", "Regions", (properties.Regions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Regions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OperationPreferencesProperty`
 *
 * @param properties - the TypeScript properties of a `OperationPreferencesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackSetOperationPreferencesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failureToleranceCount", cdk.validateNumber)(properties.failureToleranceCount));
  errors.collect(cdk.propertyValidator("failureTolerancePercentage", cdk.validateNumber)(properties.failureTolerancePercentage));
  errors.collect(cdk.propertyValidator("maxConcurrentCount", cdk.validateNumber)(properties.maxConcurrentCount));
  errors.collect(cdk.propertyValidator("maxConcurrentPercentage", cdk.validateNumber)(properties.maxConcurrentPercentage));
  errors.collect(cdk.propertyValidator("regionConcurrencyType", cdk.validateString)(properties.regionConcurrencyType));
  errors.collect(cdk.propertyValidator("regionOrder", cdk.listValidator(cdk.validateString))(properties.regionOrder));
  return errors.wrap("supplied properties not correct for \"OperationPreferencesProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackSetOperationPreferencesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackSetOperationPreferencesPropertyValidator(properties).assertSuccess();
  return {
    "FailureToleranceCount": cdk.numberToCloudFormation(properties.failureToleranceCount),
    "FailureTolerancePercentage": cdk.numberToCloudFormation(properties.failureTolerancePercentage),
    "MaxConcurrentCount": cdk.numberToCloudFormation(properties.maxConcurrentCount),
    "MaxConcurrentPercentage": cdk.numberToCloudFormation(properties.maxConcurrentPercentage),
    "RegionConcurrencyType": cdk.stringToCloudFormation(properties.regionConcurrencyType),
    "RegionOrder": cdk.listMapper(cdk.stringToCloudFormation)(properties.regionOrder)
  };
}

// @ts-ignore TS6133
function CfnStackSetOperationPreferencesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStackSet.OperationPreferencesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackSet.OperationPreferencesProperty>();
  ret.addPropertyResult("failureToleranceCount", "FailureToleranceCount", (properties.FailureToleranceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.FailureToleranceCount) : undefined));
  ret.addPropertyResult("failureTolerancePercentage", "FailureTolerancePercentage", (properties.FailureTolerancePercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.FailureTolerancePercentage) : undefined));
  ret.addPropertyResult("maxConcurrentCount", "MaxConcurrentCount", (properties.MaxConcurrentCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxConcurrentCount) : undefined));
  ret.addPropertyResult("maxConcurrentPercentage", "MaxConcurrentPercentage", (properties.MaxConcurrentPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxConcurrentPercentage) : undefined));
  ret.addPropertyResult("regionConcurrencyType", "RegionConcurrencyType", (properties.RegionConcurrencyType != null ? cfn_parse.FromCloudFormation.getString(properties.RegionConcurrencyType) : undefined));
  ret.addPropertyResult("regionOrder", "RegionOrder", (properties.RegionOrder != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RegionOrder) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoDeploymentProperty`
 *
 * @param properties - the TypeScript properties of a `AutoDeploymentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackSetAutoDeploymentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("retainStacksOnAccountRemoval", cdk.validateBoolean)(properties.retainStacksOnAccountRemoval));
  return errors.wrap("supplied properties not correct for \"AutoDeploymentProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackSetAutoDeploymentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackSetAutoDeploymentPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "RetainStacksOnAccountRemoval": cdk.booleanToCloudFormation(properties.retainStacksOnAccountRemoval)
  };
}

// @ts-ignore TS6133
function CfnStackSetAutoDeploymentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStackSet.AutoDeploymentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackSet.AutoDeploymentProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("retainStacksOnAccountRemoval", "RetainStacksOnAccountRemoval", (properties.RetainStacksOnAccountRemoval != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RetainStacksOnAccountRemoval) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ManagedExecutionProperty`
 *
 * @param properties - the TypeScript properties of a `ManagedExecutionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackSetManagedExecutionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("active", cdk.validateBoolean)(properties.active));
  return errors.wrap("supplied properties not correct for \"ManagedExecutionProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackSetManagedExecutionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackSetManagedExecutionPropertyValidator(properties).assertSuccess();
  return {
    "Active": cdk.booleanToCloudFormation(properties.active)
  };
}

// @ts-ignore TS6133
function CfnStackSetManagedExecutionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStackSet.ManagedExecutionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackSet.ManagedExecutionProperty>();
  ret.addPropertyResult("active", "Active", (properties.Active != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Active) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStackSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnStackSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("administrationRoleArn", cdk.validateString)(properties.administrationRoleArn));
  errors.collect(cdk.propertyValidator("autoDeployment", CfnStackSetAutoDeploymentPropertyValidator)(properties.autoDeployment));
  errors.collect(cdk.propertyValidator("callAs", cdk.validateString)(properties.callAs));
  errors.collect(cdk.propertyValidator("capabilities", cdk.listValidator(cdk.validateString))(properties.capabilities));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("executionRoleName", cdk.validateString)(properties.executionRoleName));
  errors.collect(cdk.propertyValidator("managedExecution", cdk.validateObject)(properties.managedExecution));
  errors.collect(cdk.propertyValidator("operationPreferences", CfnStackSetOperationPreferencesPropertyValidator)(properties.operationPreferences));
  errors.collect(cdk.propertyValidator("parameters", cdk.listValidator(CfnStackSetParameterPropertyValidator))(properties.parameters));
  errors.collect(cdk.propertyValidator("permissionModel", cdk.requiredValidator)(properties.permissionModel));
  errors.collect(cdk.propertyValidator("permissionModel", cdk.validateString)(properties.permissionModel));
  errors.collect(cdk.propertyValidator("stackInstancesGroup", cdk.listValidator(CfnStackSetStackInstancesPropertyValidator))(properties.stackInstancesGroup));
  errors.collect(cdk.propertyValidator("stackSetName", cdk.requiredValidator)(properties.stackSetName));
  errors.collect(cdk.propertyValidator("stackSetName", cdk.validateString)(properties.stackSetName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("templateBody", cdk.validateString)(properties.templateBody));
  errors.collect(cdk.propertyValidator("templateUrl", cdk.validateString)(properties.templateUrl));
  return errors.wrap("supplied properties not correct for \"CfnStackSetProps\"");
}

// @ts-ignore TS6133
function convertCfnStackSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackSetPropsValidator(properties).assertSuccess();
  return {
    "AdministrationRoleARN": cdk.stringToCloudFormation(properties.administrationRoleArn),
    "AutoDeployment": convertCfnStackSetAutoDeploymentPropertyToCloudFormation(properties.autoDeployment),
    "CallAs": cdk.stringToCloudFormation(properties.callAs),
    "Capabilities": cdk.listMapper(cdk.stringToCloudFormation)(properties.capabilities),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExecutionRoleName": cdk.stringToCloudFormation(properties.executionRoleName),
    "ManagedExecution": cdk.objectToCloudFormation(properties.managedExecution),
    "OperationPreferences": convertCfnStackSetOperationPreferencesPropertyToCloudFormation(properties.operationPreferences),
    "Parameters": cdk.listMapper(convertCfnStackSetParameterPropertyToCloudFormation)(properties.parameters),
    "PermissionModel": cdk.stringToCloudFormation(properties.permissionModel),
    "StackInstancesGroup": cdk.listMapper(convertCfnStackSetStackInstancesPropertyToCloudFormation)(properties.stackInstancesGroup),
    "StackSetName": cdk.stringToCloudFormation(properties.stackSetName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TemplateBody": cdk.stringToCloudFormation(properties.templateBody),
    "TemplateURL": cdk.stringToCloudFormation(properties.templateUrl)
  };
}

// @ts-ignore TS6133
function CfnStackSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStackSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackSetProps>();
  ret.addPropertyResult("administrationRoleArn", "AdministrationRoleARN", (properties.AdministrationRoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.AdministrationRoleARN) : undefined));
  ret.addPropertyResult("autoDeployment", "AutoDeployment", (properties.AutoDeployment != null ? CfnStackSetAutoDeploymentPropertyFromCloudFormation(properties.AutoDeployment) : undefined));
  ret.addPropertyResult("callAs", "CallAs", (properties.CallAs != null ? cfn_parse.FromCloudFormation.getString(properties.CallAs) : undefined));
  ret.addPropertyResult("capabilities", "Capabilities", (properties.Capabilities != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Capabilities) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("executionRoleName", "ExecutionRoleName", (properties.ExecutionRoleName != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleName) : undefined));
  ret.addPropertyResult("managedExecution", "ManagedExecution", (properties.ManagedExecution != null ? cfn_parse.FromCloudFormation.getAny(properties.ManagedExecution) : undefined));
  ret.addPropertyResult("operationPreferences", "OperationPreferences", (properties.OperationPreferences != null ? CfnStackSetOperationPreferencesPropertyFromCloudFormation(properties.OperationPreferences) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnStackSetParameterPropertyFromCloudFormation)(properties.Parameters) : undefined));
  ret.addPropertyResult("permissionModel", "PermissionModel", (properties.PermissionModel != null ? cfn_parse.FromCloudFormation.getString(properties.PermissionModel) : undefined));
  ret.addPropertyResult("stackInstancesGroup", "StackInstancesGroup", (properties.StackInstancesGroup != null ? cfn_parse.FromCloudFormation.getArray(CfnStackSetStackInstancesPropertyFromCloudFormation)(properties.StackInstancesGroup) : undefined));
  ret.addPropertyResult("stackSetName", "StackSetName", (properties.StackSetName != null ? cfn_parse.FromCloudFormation.getString(properties.StackSetName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("templateBody", "TemplateBody", (properties.TemplateBody != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateBody) : undefined));
  ret.addPropertyResult("templateUrl", "TemplateURL", (properties.TemplateURL != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateURL) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Activates a public third-party extension, making it available for use in stack templates.
 *
 * For more information, see [Using public extensions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/registry-public.html) in the *AWS CloudFormation User Guide* .
 *
 * Once you have activated a public third-party extension in your account and Region, use [SetTypeConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_SetTypeConfiguration.html) to specify configuration properties for the extension. For more information, see [Configuring extensions at the account level](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/registry-register.html#registry-set-configuration) in the *CloudFormation User Guide* .
 *
 * @cloudformationResource AWS::CloudFormation::TypeActivation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html
 */
export class CfnTypeActivation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::TypeActivation";

  /**
   * Build a CfnTypeActivation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTypeActivation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTypeActivationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTypeActivation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the activated extension, in this account and Region.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Whether to automatically update the extension in this account and Region when a new *minor* version is published by the extension publisher.
   */
  public autoUpdate?: boolean | cdk.IResolvable;

  /**
   * The name of the IAM execution role to use to activate the extension.
   */
  public executionRoleArn?: string;

  /**
   * Specifies logging configuration information for an extension.
   */
  public loggingConfig?: cdk.IResolvable | CfnTypeActivation.LoggingConfigProperty;

  /**
   * The major version of this extension you want to activate, if multiple major versions are available.
   */
  public majorVersion?: string;

  /**
   * The Amazon Resource Number (ARN) of the public extension.
   */
  public publicTypeArn?: string;

  /**
   * The ID of the extension publisher.
   */
  public publisherId?: string;

  /**
   * The extension type.
   */
  public type?: string;

  /**
   * The name of the extension.
   */
  public typeName?: string;

  /**
   * An alias to assign to the public extension, in this account and Region.
   */
  public typeNameAlias?: string;

  /**
   * Manually updates a previously-activated type to a new major or minor version, if available.
   */
  public versionBump?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTypeActivationProps = {}) {
    super(scope, id, {
      "type": CfnTypeActivation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.autoUpdate = props.autoUpdate;
    this.executionRoleArn = props.executionRoleArn;
    this.loggingConfig = props.loggingConfig;
    this.majorVersion = props.majorVersion;
    this.publicTypeArn = props.publicTypeArn;
    this.publisherId = props.publisherId;
    this.type = props.type;
    this.typeName = props.typeName;
    this.typeNameAlias = props.typeNameAlias;
    this.versionBump = props.versionBump;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoUpdate": this.autoUpdate,
      "executionRoleArn": this.executionRoleArn,
      "loggingConfig": this.loggingConfig,
      "majorVersion": this.majorVersion,
      "publicTypeArn": this.publicTypeArn,
      "publisherId": this.publisherId,
      "type": this.type,
      "typeName": this.typeName,
      "typeNameAlias": this.typeNameAlias,
      "versionBump": this.versionBump
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTypeActivation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTypeActivationPropsToCloudFormation(props);
  }
}

export namespace CfnTypeActivation {
  /**
   * Contains logging configuration information for an extension.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-typeactivation-loggingconfig.html
   */
  export interface LoggingConfigProperty {
    /**
     * The Amazon CloudWatch Logs group to which CloudFormation sends error logging information when invoking the extension's handlers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-typeactivation-loggingconfig.html#cfn-cloudformation-typeactivation-loggingconfig-loggroupname
     */
    readonly logGroupName?: string;

    /**
     * The Amazon Resource Name (ARN) of the role that CloudFormation should assume when sending log entries to CloudWatch Logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudformation-typeactivation-loggingconfig.html#cfn-cloudformation-typeactivation-loggingconfig-logrolearn
     */
    readonly logRoleArn?: string;
  }
}

/**
 * Properties for defining a `CfnTypeActivation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html
 */
export interface CfnTypeActivationProps {
  /**
   * Whether to automatically update the extension in this account and Region when a new *minor* version is published by the extension publisher.
   *
   * Major versions released by the publisher must be manually updated.
   *
   * The default is `true` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-autoupdate
   */
  readonly autoUpdate?: boolean | cdk.IResolvable;

  /**
   * The name of the IAM execution role to use to activate the extension.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-executionrolearn
   */
  readonly executionRoleArn?: string;

  /**
   * Specifies logging configuration information for an extension.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-loggingconfig
   */
  readonly loggingConfig?: cdk.IResolvable | CfnTypeActivation.LoggingConfigProperty;

  /**
   * The major version of this extension you want to activate, if multiple major versions are available.
   *
   * The default is the latest major version. CloudFormation uses the latest available *minor* version of the major version selected.
   *
   * You can specify `MajorVersion` or `VersionBump` , but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-majorversion
   */
  readonly majorVersion?: string;

  /**
   * The Amazon Resource Number (ARN) of the public extension.
   *
   * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-publictypearn
   */
  readonly publicTypeArn?: string;

  /**
   * The ID of the extension publisher.
   *
   * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-publisherid
   */
  readonly publisherId?: string;

  /**
   * The extension type.
   *
   * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-type
   */
  readonly type?: string;

  /**
   * The name of the extension.
   *
   * Conditional: You must specify `PublicTypeArn` , or `TypeName` , `Type` , and `PublisherId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-typename
   */
  readonly typeName?: string;

  /**
   * An alias to assign to the public extension, in this account and Region.
   *
   * If you specify an alias for the extension, CloudFormation treats the alias as the extension type name within this account and Region. You must use the alias to refer to the extension in your templates, API calls, and CloudFormation console.
   *
   * An extension alias must be unique within a given account and Region. You can activate the same public resource multiple times in the same account and Region, using different type name aliases.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-typenamealias
   */
  readonly typeNameAlias?: string;

  /**
   * Manually updates a previously-activated type to a new major or minor version, if available.
   *
   * You can also use this parameter to update the value of `AutoUpdate` .
   *
   * - `MAJOR` : CloudFormation updates the extension to the newest major version, if one is available.
   * - `MINOR` : CloudFormation updates the extension to the newest minor version, if one is available.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-typeactivation.html#cfn-cloudformation-typeactivation-versionbump
   */
  readonly versionBump?: string;
}

/**
 * Determine whether the given properties match those of a `LoggingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTypeActivationLoggingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logRoleArn", cdk.validateString)(properties.logRoleArn));
  return errors.wrap("supplied properties not correct for \"LoggingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnTypeActivationLoggingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTypeActivationLoggingConfigPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName),
    "LogRoleArn": cdk.stringToCloudFormation(properties.logRoleArn)
  };
}

// @ts-ignore TS6133
function CfnTypeActivationLoggingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTypeActivation.LoggingConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTypeActivation.LoggingConfigProperty>();
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addPropertyResult("logRoleArn", "LogRoleArn", (properties.LogRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogRoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTypeActivationProps`
 *
 * @param properties - the TypeScript properties of a `CfnTypeActivationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTypeActivationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoUpdate", cdk.validateBoolean)(properties.autoUpdate));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("loggingConfig", CfnTypeActivationLoggingConfigPropertyValidator)(properties.loggingConfig));
  errors.collect(cdk.propertyValidator("majorVersion", cdk.validateString)(properties.majorVersion));
  errors.collect(cdk.propertyValidator("publicTypeArn", cdk.validateString)(properties.publicTypeArn));
  errors.collect(cdk.propertyValidator("publisherId", cdk.validateString)(properties.publisherId));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("typeName", cdk.validateString)(properties.typeName));
  errors.collect(cdk.propertyValidator("typeNameAlias", cdk.validateString)(properties.typeNameAlias));
  errors.collect(cdk.propertyValidator("versionBump", cdk.validateString)(properties.versionBump));
  return errors.wrap("supplied properties not correct for \"CfnTypeActivationProps\"");
}

// @ts-ignore TS6133
function convertCfnTypeActivationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTypeActivationPropsValidator(properties).assertSuccess();
  return {
    "AutoUpdate": cdk.booleanToCloudFormation(properties.autoUpdate),
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "LoggingConfig": convertCfnTypeActivationLoggingConfigPropertyToCloudFormation(properties.loggingConfig),
    "MajorVersion": cdk.stringToCloudFormation(properties.majorVersion),
    "PublicTypeArn": cdk.stringToCloudFormation(properties.publicTypeArn),
    "PublisherId": cdk.stringToCloudFormation(properties.publisherId),
    "Type": cdk.stringToCloudFormation(properties.type),
    "TypeName": cdk.stringToCloudFormation(properties.typeName),
    "TypeNameAlias": cdk.stringToCloudFormation(properties.typeNameAlias),
    "VersionBump": cdk.stringToCloudFormation(properties.versionBump)
  };
}

// @ts-ignore TS6133
function CfnTypeActivationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTypeActivationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTypeActivationProps>();
  ret.addPropertyResult("autoUpdate", "AutoUpdate", (properties.AutoUpdate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoUpdate) : undefined));
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("loggingConfig", "LoggingConfig", (properties.LoggingConfig != null ? CfnTypeActivationLoggingConfigPropertyFromCloudFormation(properties.LoggingConfig) : undefined));
  ret.addPropertyResult("majorVersion", "MajorVersion", (properties.MajorVersion != null ? cfn_parse.FromCloudFormation.getString(properties.MajorVersion) : undefined));
  ret.addPropertyResult("publicTypeArn", "PublicTypeArn", (properties.PublicTypeArn != null ? cfn_parse.FromCloudFormation.getString(properties.PublicTypeArn) : undefined));
  ret.addPropertyResult("publisherId", "PublisherId", (properties.PublisherId != null ? cfn_parse.FromCloudFormation.getString(properties.PublisherId) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("typeName", "TypeName", (properties.TypeName != null ? cfn_parse.FromCloudFormation.getString(properties.TypeName) : undefined));
  ret.addPropertyResult("typeNameAlias", "TypeNameAlias", (properties.TypeNameAlias != null ? cfn_parse.FromCloudFormation.getString(properties.TypeNameAlias) : undefined));
  ret.addPropertyResult("versionBump", "VersionBump", (properties.VersionBump != null ? cfn_parse.FromCloudFormation.getString(properties.VersionBump) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > For Amazon EC2 and Auto Scaling resources, we recommend that you use a `CreationPolicy` attribute instead of wait conditions.
 *
 * Add a CreationPolicy attribute to those resources, and use the cfn-signal helper script to signal when an instance creation process has completed successfully.
 *
 * You can use a wait condition for situations like the following:
 *
 * - To coordinate stack resource creation with configuration actions that are external to the stack creation.
 * - To track the status of a configuration process.
 *
 * For these situations, we recommend that you associate a [CreationPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html) attribute with the wait condition so that you don't have to use a wait condition handle. For more information and an example, see [Creating wait conditions in a template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-waitcondition.html) . If you use a CreationPolicy with a wait condition, don't specify any of the wait condition's properties.
 *
 * > If you use the [VPC endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-endpoints.html) feature, resources in the VPC that respond to wait conditions must have access to CloudFormation , specific Amazon Simple Storage Service ( Amazon S3 ) buckets. Resources must send wait condition responses to a presigned Amazon S3 URL. If they can't send responses to Amazon S3 , CloudFormation won't receive a response and the stack operation fails. For more information, see [Setting up VPC endpoints for AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-vpce-bucketnames.html) .
 *
 * @cloudformationResource AWS::CloudFormation::WaitCondition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-waitcondition.html
 */
export class CfnWaitCondition extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::WaitCondition";

  /**
   * Build a CfnWaitCondition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWaitCondition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWaitConditionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWaitCondition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A JSON object that contains the `UniqueId` and `Data` values from the wait condition signal(s) for the specified wait condition. For more information about wait condition signals, see [Wait condition signal JSON format](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-waitcondition.html#using-cfn-waitcondition-signaljson) .
   *
   * Example return value for a wait condition with 2 signals:
   *
   * `{ "Signal1" : "Step 1 complete." , "Signal2" : "Step 2 complete." }`
   *
   * @cloudformationAttribute Data
   */
  public readonly attrData: cdk.IResolvable;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The number of success signals that CloudFormation must receive before it continues the stack creation process.
   */
  public count?: number;

  /**
   * A reference to the wait condition handle used to signal this wait condition.
   */
  public handle?: string;

  /**
   * The length of time (in seconds) to wait for the number of signals that the `Count` property specifies.
   */
  public timeout?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWaitConditionProps = {}) {
    super(scope, id, {
      "type": CfnWaitCondition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrData = this.getAtt("Data");
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.count = props.count;
    this.handle = props.handle;
    this.timeout = props.timeout;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "count": this.count,
      "handle": this.handle,
      "timeout": this.timeout
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWaitCondition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWaitConditionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnWaitCondition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-waitcondition.html
 */
export interface CfnWaitConditionProps {
  /**
   * The number of success signals that CloudFormation must receive before it continues the stack creation process.
   *
   * When the wait condition receives the requisite number of success signals, CloudFormation resumes the creation of the stack. If the wait condition doesn't receive the specified number of success signals before the Timeout period expires, CloudFormation assumes that the wait condition has failed and rolls the stack back.
   *
   * Updates aren't supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-waitcondition.html#cfn-cloudformation-waitcondition-count
   */
  readonly count?: number;

  /**
   * A reference to the wait condition handle used to signal this wait condition.
   *
   * Use the `Ref` intrinsic function to specify an [`AWS::CloudFormation::WaitConditionHandle`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitconditionhandle.html) resource.
   *
   * Anytime you add a `WaitCondition` resource during a stack update, you must associate the wait condition with a new WaitConditionHandle resource. Don't reuse an old wait condition handle that has already been defined in the template. If you reuse a wait condition handle, the wait condition might evaluate old signals from a previous create or update stack command.
   *
   * Updates aren't supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-waitcondition.html#cfn-cloudformation-waitcondition-handle
   */
  readonly handle?: string;

  /**
   * The length of time (in seconds) to wait for the number of signals that the `Count` property specifies.
   *
   * `Timeout` is a minimum-bound property, meaning the timeout occurs no sooner than the time you specify, but can occur shortly thereafter. The maximum time that can be specified for this property is 12 hours (43200 seconds).
   *
   * Updates aren't supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-waitcondition.html#cfn-cloudformation-waitcondition-timeout
   */
  readonly timeout?: string;
}

/**
 * Determine whether the given properties match those of a `CfnWaitConditionProps`
 *
 * @param properties - the TypeScript properties of a `CfnWaitConditionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWaitConditionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("count", cdk.validateNumber)(properties.count));
  errors.collect(cdk.propertyValidator("handle", cdk.validateString)(properties.handle));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateString)(properties.timeout));
  return errors.wrap("supplied properties not correct for \"CfnWaitConditionProps\"");
}

// @ts-ignore TS6133
function convertCfnWaitConditionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWaitConditionPropsValidator(properties).assertSuccess();
  return {
    "Count": cdk.numberToCloudFormation(properties.count),
    "Handle": cdk.stringToCloudFormation(properties.handle),
    "Timeout": cdk.stringToCloudFormation(properties.timeout)
  };
}

// @ts-ignore TS6133
function CfnWaitConditionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWaitConditionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWaitConditionProps>();
  ret.addPropertyResult("count", "Count", (properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined));
  ret.addPropertyResult("handle", "Handle", (properties.Handle != null ? cfn_parse.FromCloudFormation.getString(properties.Handle) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getString(properties.Timeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > For Amazon EC2 and Auto Scaling resources, we recommend that you use a `CreationPolicy` attribute instead of wait conditions.
 *
 * Add a `CreationPolicy` attribute to those resources, and use the cfn-signal helper script to signal when an instance creation process has completed successfully.
 * >
 * > For more information, see [Deploying applications on Amazon EC2 with AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/deploying.applications.html) .
 *
 * The `AWS::CloudFormation::WaitConditionHandle` type has no properties. When you reference the `WaitConditionHandle` resource by using the `Ref` function, AWS CloudFormation returns a presigned URL. You pass this URL to applications or scripts that are running on your Amazon EC2 instances to send signals to that URL. An associated `AWS::CloudFormation::WaitCondition` resource checks the URL for the required number of success signals or for a failure signal.
 *
 * > Anytime you add a `WaitCondition` resource during a stack update or update a resource with a wait condition, you must associate the wait condition with a new `WaitConditionHandle` resource. Don't reuse an old wait condition handle that has already been defined in the template. If you reuse a wait condition handle, the wait condition might evaluate old signals from a previous create or update stack command. > Updates aren't supported for this resource.
 *
 * @cloudformationResource AWS::CloudFormation::WaitConditionHandle
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-waitconditionhandle.html
 */
export class CfnWaitConditionHandle extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CloudFormation::WaitConditionHandle";

  /**
   * Build a CfnWaitConditionHandle from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWaitConditionHandle {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWaitConditionHandlePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWaitConditionHandle(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A unique identifier for the resource.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWaitConditionHandleProps = {}) {
    super(scope, id, {
      "type": CfnWaitConditionHandle.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
  }

  protected get cfnProperties(): Record<string, any> {
    return {};
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWaitConditionHandle.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWaitConditionHandlePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnWaitConditionHandle`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-waitconditionhandle.html
 */
export interface CfnWaitConditionHandleProps {

}

/**
 * Determine whether the given properties match those of a `CfnWaitConditionHandleProps`
 *
 * @param properties - the TypeScript properties of a `CfnWaitConditionHandleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWaitConditionHandlePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  return errors.wrap("supplied properties not correct for \"CfnWaitConditionHandleProps\"");
}

// @ts-ignore TS6133
function convertCfnWaitConditionHandlePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWaitConditionHandlePropsValidator(properties).assertSuccess();
  return {};
}

// @ts-ignore TS6133
function CfnWaitConditionHandlePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWaitConditionHandleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWaitConditionHandleProps>();
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}