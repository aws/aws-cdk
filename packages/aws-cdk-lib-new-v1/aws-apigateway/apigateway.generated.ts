/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::ApiGateway::Account` resource specifies the IAM role that Amazon API Gateway uses to write API logs to Amazon CloudWatch Logs.
 *
 * To avoid overwriting other roles, you should only have one `AWS::ApiGateway::Account` resource per region per account.
 *
 * @cloudformationResource AWS::ApiGateway::Account
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-account.html
 */
export class CfnAccount extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::Account";

  /**
   * Build a CfnAccount from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccount {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccountPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccount(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the account. For example: `abc123` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARN of an Amazon CloudWatch role for the current Account.
   */
  public cloudWatchRoleArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccountProps = {}) {
    super(scope, id, {
      "type": CfnAccount.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.cloudWatchRoleArn = props.cloudWatchRoleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cloudWatchRoleArn": this.cloudWatchRoleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccount.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccountPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAccount`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-account.html
 */
export interface CfnAccountProps {
  /**
   * The ARN of an Amazon CloudWatch role for the current Account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-account.html#cfn-apigateway-account-cloudwatchrolearn
   */
  readonly cloudWatchRoleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAccountProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccountProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccountPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchRoleArn", cdk.validateString)(properties.cloudWatchRoleArn));
  return errors.wrap("supplied properties not correct for \"CfnAccountProps\"");
}

// @ts-ignore TS6133
function convertCfnAccountPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccountPropsValidator(properties).assertSuccess();
  return {
    "CloudWatchRoleArn": cdk.stringToCloudFormation(properties.cloudWatchRoleArn)
  };
}

// @ts-ignore TS6133
function CfnAccountPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccountProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccountProps>();
  ret.addPropertyResult("cloudWatchRoleArn", "CloudWatchRoleArn", (properties.CloudWatchRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchRoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::ApiKey` resource creates a unique key that you can distribute to clients who are executing API Gateway `Method` resources that require an API key.
 *
 * To specify which API key clients must use, map the API key with the `RestApi` and `Stage` resources that include the methods that require a key.
 *
 * @cloudformationResource AWS::ApiGateway::ApiKey
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html
 */
export class CfnApiKey extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::ApiKey";

  /**
   * Build a CfnApiKey from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApiKey {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApiKeyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApiKey(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the API key. For example: `abc123` .
   *
   * @cloudformationAttribute APIKeyId
   */
  public readonly attrApiKeyId: string;

  /**
   * An AWS Marketplace customer identifier, when integrating with the AWS SaaS Marketplace.
   */
  public customerId?: string;

  /**
   * The description of the ApiKey.
   */
  public description?: string;

  /**
   * Specifies whether the ApiKey can be used by callers.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * Specifies whether ( `true` ) or not ( `false` ) the key identifier is distinct from the created API key value.
   */
  public generateDistinctId?: boolean | cdk.IResolvable;

  /**
   * A name for the API key.
   */
  public name?: string;

  /**
   * DEPRECATED FOR USAGE PLANS - Specifies stages associated with the API key.
   */
  public stageKeys?: Array<cdk.IResolvable | CfnApiKey.StageKeyProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The key-value map of strings.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Specifies a value of the API key.
   */
  public value?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApiKeyProps = {}) {
    super(scope, id, {
      "type": CfnApiKey.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrApiKeyId = cdk.Token.asString(this.getAtt("APIKeyId", cdk.ResolutionTypeHint.STRING));
    this.customerId = props.customerId;
    this.description = props.description;
    this.enabled = props.enabled;
    this.generateDistinctId = props.generateDistinctId;
    this.name = props.name;
    this.stageKeys = props.stageKeys;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ApiGateway::ApiKey", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.value = props.value;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "customerId": this.customerId,
      "description": this.description,
      "enabled": this.enabled,
      "generateDistinctId": this.generateDistinctId,
      "name": this.name,
      "stageKeys": this.stageKeys,
      "tags": this.tags.renderTags(),
      "value": this.value
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApiKey.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApiKeyPropsToCloudFormation(props);
  }
}

export namespace CfnApiKey {
  /**
   * `StageKey` is a property of the [AWS::ApiGateway::ApiKey](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html) resource that specifies the stage to associate with the API key. This association allows only clients with the key to make requests to methods in that stage.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-apikey-stagekey.html
   */
  export interface StageKeyProperty {
    /**
     * The string identifier of the associated RestApi.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-apikey-stagekey.html#cfn-apigateway-apikey-stagekey-restapiid
     */
    readonly restApiId?: string;

    /**
     * The stage name associated with the stage key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-apikey-stagekey.html#cfn-apigateway-apikey-stagekey-stagename
     */
    readonly stageName?: string;
  }
}

/**
 * Properties for defining a `CfnApiKey`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html
 */
export interface CfnApiKeyProps {
  /**
   * An AWS Marketplace customer identifier, when integrating with the AWS SaaS Marketplace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-customerid
   */
  readonly customerId?: string;

  /**
   * The description of the ApiKey.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-description
   */
  readonly description?: string;

  /**
   * Specifies whether the ApiKey can be used by callers.
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * Specifies whether ( `true` ) or not ( `false` ) the key identifier is distinct from the created API key value.
   *
   * This parameter is deprecated and should not be used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-generatedistinctid
   */
  readonly generateDistinctId?: boolean | cdk.IResolvable;

  /**
   * A name for the API key.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the API key name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-name
   */
  readonly name?: string;

  /**
   * DEPRECATED FOR USAGE PLANS - Specifies stages associated with the API key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-stagekeys
   */
  readonly stageKeys?: Array<cdk.IResolvable | CfnApiKey.StageKeyProperty> | cdk.IResolvable;

  /**
   * The key-value map of strings.
   *
   * The valid character set is [a-zA-Z+-=._:/]. The tag key can be up to 128 characters and must not start with `aws:` . The tag value can be up to 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Specifies a value of the API key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-value
   */
  readonly value?: string;
}

/**
 * Determine whether the given properties match those of a `StageKeyProperty`
 *
 * @param properties - the TypeScript properties of a `StageKeyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiKeyStageKeyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  errors.collect(cdk.propertyValidator("stageName", cdk.validateString)(properties.stageName));
  return errors.wrap("supplied properties not correct for \"StageKeyProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiKeyStageKeyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiKeyStageKeyPropertyValidator(properties).assertSuccess();
  return {
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId),
    "StageName": cdk.stringToCloudFormation(properties.stageName)
  };
}

// @ts-ignore TS6133
function CfnApiKeyStageKeyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApiKey.StageKeyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiKey.StageKeyProperty>();
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addPropertyResult("stageName", "StageName", (properties.StageName != null ? cfn_parse.FromCloudFormation.getString(properties.StageName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApiKeyProps`
 *
 * @param properties - the TypeScript properties of a `CfnApiKeyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiKeyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customerId", cdk.validateString)(properties.customerId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("generateDistinctId", cdk.validateBoolean)(properties.generateDistinctId));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("stageKeys", cdk.listValidator(CfnApiKeyStageKeyPropertyValidator))(properties.stageKeys));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"CfnApiKeyProps\"");
}

// @ts-ignore TS6133
function convertCfnApiKeyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiKeyPropsValidator(properties).assertSuccess();
  return {
    "CustomerId": cdk.stringToCloudFormation(properties.customerId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "GenerateDistinctId": cdk.booleanToCloudFormation(properties.generateDistinctId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "StageKeys": cdk.listMapper(convertCfnApiKeyStageKeyPropertyToCloudFormation)(properties.stageKeys),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnApiKeyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiKeyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiKeyProps>();
  ret.addPropertyResult("customerId", "CustomerId", (properties.CustomerId != null ? cfn_parse.FromCloudFormation.getString(properties.CustomerId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("generateDistinctId", "GenerateDistinctId", (properties.GenerateDistinctId != null ? cfn_parse.FromCloudFormation.getBoolean(properties.GenerateDistinctId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("stageKeys", "StageKeys", (properties.StageKeys != null ? cfn_parse.FromCloudFormation.getArray(CfnApiKeyStageKeyPropertyFromCloudFormation)(properties.StageKeys) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::Authorizer` resource creates an authorization layer that API Gateway activates for methods that have authorization enabled.
 *
 * API Gateway activates the authorizer when a client calls those methods.
 *
 * @cloudformationResource AWS::ApiGateway::Authorizer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html
 */
export class CfnAuthorizer extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::Authorizer";

  /**
   * Build a CfnAuthorizer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAuthorizer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAuthorizerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAuthorizer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the authorizer. For example: `abc123` .
   *
   * @cloudformationAttribute AuthorizerId
   */
  public readonly attrAuthorizerId: string;

  /**
   * Specifies the required credentials as an IAM role for API Gateway to invoke the authorizer.
   */
  public authorizerCredentials?: string;

  /**
   * The TTL in seconds of cached authorizer results.
   */
  public authorizerResultTtlInSeconds?: number;

  /**
   * Specifies the authorizer's Uniform Resource Identifier (URI).
   */
  public authorizerUri?: string;

  /**
   * Optional customer-defined field, used in OpenAPI imports and exports without functional impact.
   */
  public authType?: string;

  /**
   * The identity source for which authorization is requested.
   */
  public identitySource?: string;

  /**
   * A validation expression for the incoming identity token.
   */
  public identityValidationExpression?: string;

  /**
   * The name of the authorizer.
   */
  public name: string;

  /**
   * A list of the Amazon Cognito user pool ARNs for the `COGNITO_USER_POOLS` authorizer.
   */
  public providerArns?: Array<string>;

  /**
   * The string identifier of the associated RestApi.
   */
  public restApiId: string;

  /**
   * The authorizer type.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAuthorizerProps) {
    super(scope, id, {
      "type": CfnAuthorizer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "restApiId", this);
    cdk.requireProperty(props, "type", this);

    this.attrAuthorizerId = cdk.Token.asString(this.getAtt("AuthorizerId", cdk.ResolutionTypeHint.STRING));
    this.authorizerCredentials = props.authorizerCredentials;
    this.authorizerResultTtlInSeconds = props.authorizerResultTtlInSeconds;
    this.authorizerUri = props.authorizerUri;
    this.authType = props.authType;
    this.identitySource = props.identitySource;
    this.identityValidationExpression = props.identityValidationExpression;
    this.name = props.name;
    this.providerArns = props.providerArns;
    this.restApiId = props.restApiId;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authorizerCredentials": this.authorizerCredentials,
      "authorizerResultTtlInSeconds": this.authorizerResultTtlInSeconds,
      "authorizerUri": this.authorizerUri,
      "authType": this.authType,
      "identitySource": this.identitySource,
      "identityValidationExpression": this.identityValidationExpression,
      "name": this.name,
      "providerArns": this.providerArns,
      "restApiId": this.restApiId,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAuthorizer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAuthorizerPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAuthorizer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html
 */
export interface CfnAuthorizerProps {
  /**
   * Specifies the required credentials as an IAM role for API Gateway to invoke the authorizer.
   *
   * To specify an IAM role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To use resource-based permissions on the Lambda function, specify null.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html#cfn-apigateway-authorizer-authorizercredentials
   */
  readonly authorizerCredentials?: string;

  /**
   * The TTL in seconds of cached authorizer results.
   *
   * If it equals 0, authorization caching is disabled. If it is greater than 0, API Gateway will cache authorizer responses. If this field is not set, the default value is 300. The maximum value is 3600, or 1 hour.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html#cfn-apigateway-authorizer-authorizerresultttlinseconds
   */
  readonly authorizerResultTtlInSeconds?: number;

  /**
   * Specifies the authorizer's Uniform Resource Identifier (URI).
   *
   * For `TOKEN` or `REQUEST` authorizers, this must be a well-formed Lambda function URI, for example, `arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:{account_id}:function:{lambda_function_name}/invocations` . In general, the URI has this form `arn:aws:apigateway:{region}:lambda:path/{service_api}` , where `{region}` is the same as the region hosting the Lambda function, `path` indicates that the remaining substring in the URI should be treated as the path to the resource, including the initial `/` . For Lambda functions, this is usually of the form `/2015-03-31/functions/[FunctionARN]/invocations` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html#cfn-apigateway-authorizer-authorizeruri
   */
  readonly authorizerUri?: string;

  /**
   * Optional customer-defined field, used in OpenAPI imports and exports without functional impact.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html#cfn-apigateway-authorizer-authtype
   */
  readonly authType?: string;

  /**
   * The identity source for which authorization is requested.
   *
   * For a `TOKEN` or `COGNITO_USER_POOLS` authorizer, this is required and specifies the request header mapping expression for the custom header holding the authorization token submitted by the client. For example, if the token header name is `Auth` , the header mapping expression is `method.request.header.Auth` . For the `REQUEST` authorizer, this is required when authorization caching is enabled. The value is a comma-separated string of one or more mapping expressions of the specified request parameters. For example, if an `Auth` header, a `Name` query string parameter are defined as identity sources, this value is `method.request.header.Auth, method.request.querystring.Name` . These parameters will be used to derive the authorization caching key and to perform runtime validation of the `REQUEST` authorizer by verifying all of the identity-related request parameters are present, not null and non-empty. Only when this is true does the authorizer invoke the authorizer Lambda function, otherwise, it returns a 401 Unauthorized response without calling the Lambda function. The valid value is a string of comma-separated mapping expressions of the specified request parameters. When the authorization caching is not enabled, this property is optional.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html#cfn-apigateway-authorizer-identitysource
   */
  readonly identitySource?: string;

  /**
   * A validation expression for the incoming identity token.
   *
   * For `TOKEN` authorizers, this value is a regular expression. For `COGNITO_USER_POOLS` authorizers, API Gateway will match the `aud` field of the incoming token from the client against the specified regular expression. It will invoke the authorizer's Lambda function when there is a match. Otherwise, it will return a 401 Unauthorized response without calling the Lambda function. The validation expression does not apply to the `REQUEST` authorizer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html#cfn-apigateway-authorizer-identityvalidationexpression
   */
  readonly identityValidationExpression?: string;

  /**
   * The name of the authorizer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html#cfn-apigateway-authorizer-name
   */
  readonly name: string;

  /**
   * A list of the Amazon Cognito user pool ARNs for the `COGNITO_USER_POOLS` authorizer.
   *
   * Each element is of this format: `arn:aws:cognito-idp:{region}:{account_id}:userpool/{user_pool_id}` . For a `TOKEN` or `REQUEST` authorizer, this is not defined.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html#cfn-apigateway-authorizer-providerarns
   */
  readonly providerArns?: Array<string>;

  /**
   * The string identifier of the associated RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html#cfn-apigateway-authorizer-restapiid
   */
  readonly restApiId: string;

  /**
   * The authorizer type.
   *
   * Valid values are `TOKEN` for a Lambda function using a single authorization token submitted in a custom header, `REQUEST` for a Lambda function using incoming request parameters, and `COGNITO_USER_POOLS` for using an Amazon Cognito user pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html#cfn-apigateway-authorizer-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `CfnAuthorizerProps`
 *
 * @param properties - the TypeScript properties of a `CfnAuthorizerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAuthorizerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authType", cdk.validateString)(properties.authType));
  errors.collect(cdk.propertyValidator("authorizerCredentials", cdk.validateString)(properties.authorizerCredentials));
  errors.collect(cdk.propertyValidator("authorizerResultTtlInSeconds", cdk.validateNumber)(properties.authorizerResultTtlInSeconds));
  errors.collect(cdk.propertyValidator("authorizerUri", cdk.validateString)(properties.authorizerUri));
  errors.collect(cdk.propertyValidator("identitySource", cdk.validateString)(properties.identitySource));
  errors.collect(cdk.propertyValidator("identityValidationExpression", cdk.validateString)(properties.identityValidationExpression));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("providerArns", cdk.listValidator(cdk.validateString))(properties.providerArns));
  errors.collect(cdk.propertyValidator("restApiId", cdk.requiredValidator)(properties.restApiId));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnAuthorizerProps\"");
}

// @ts-ignore TS6133
function convertCfnAuthorizerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAuthorizerPropsValidator(properties).assertSuccess();
  return {
    "AuthType": cdk.stringToCloudFormation(properties.authType),
    "AuthorizerCredentials": cdk.stringToCloudFormation(properties.authorizerCredentials),
    "AuthorizerResultTtlInSeconds": cdk.numberToCloudFormation(properties.authorizerResultTtlInSeconds),
    "AuthorizerUri": cdk.stringToCloudFormation(properties.authorizerUri),
    "IdentitySource": cdk.stringToCloudFormation(properties.identitySource),
    "IdentityValidationExpression": cdk.stringToCloudFormation(properties.identityValidationExpression),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ProviderARNs": cdk.listMapper(cdk.stringToCloudFormation)(properties.providerArns),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAuthorizerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAuthorizerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAuthorizerProps>();
  ret.addPropertyResult("authorizerCredentials", "AuthorizerCredentials", (properties.AuthorizerCredentials != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerCredentials) : undefined));
  ret.addPropertyResult("authorizerResultTtlInSeconds", "AuthorizerResultTtlInSeconds", (properties.AuthorizerResultTtlInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.AuthorizerResultTtlInSeconds) : undefined));
  ret.addPropertyResult("authorizerUri", "AuthorizerUri", (properties.AuthorizerUri != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerUri) : undefined));
  ret.addPropertyResult("authType", "AuthType", (properties.AuthType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthType) : undefined));
  ret.addPropertyResult("identitySource", "IdentitySource", (properties.IdentitySource != null ? cfn_parse.FromCloudFormation.getString(properties.IdentitySource) : undefined));
  ret.addPropertyResult("identityValidationExpression", "IdentityValidationExpression", (properties.IdentityValidationExpression != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityValidationExpression) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("providerArns", "ProviderARNs", (properties.ProviderARNs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ProviderARNs) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::BasePathMapping` resource creates a base path that clients who call your API must use in the invocation URL.
 *
 * @cloudformationResource AWS::ApiGateway::BasePathMapping
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-basepathmapping.html
 */
export class CfnBasePathMapping extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::BasePathMapping";

  /**
   * Build a CfnBasePathMapping from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBasePathMapping {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBasePathMappingPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBasePathMapping(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The base path name that callers of the API must provide as part of the URL after the domain name.
   */
  public basePath?: string;

  /**
   * The domain name of the BasePathMapping resource to be described.
   */
  public domainName: string;

  public id?: string;

  /**
   * The string identifier of the associated RestApi.
   */
  public restApiId?: string;

  /**
   * The name of the associated stage.
   */
  public stage?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBasePathMappingProps) {
    super(scope, id, {
      "type": CfnBasePathMapping.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "domainName", this);

    this.basePath = props.basePath;
    this.domainName = props.domainName;
    this.id = props.id;
    this.restApiId = props.restApiId;
    this.stage = props.stage;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "basePath": this.basePath,
      "domainName": this.domainName,
      "id": this.id,
      "restApiId": this.restApiId,
      "stage": this.stage
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBasePathMapping.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBasePathMappingPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnBasePathMapping`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-basepathmapping.html
 */
export interface CfnBasePathMappingProps {
  /**
   * The base path name that callers of the API must provide as part of the URL after the domain name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-basepathmapping.html#cfn-apigateway-basepathmapping-basepath
   */
  readonly basePath?: string;

  /**
   * The domain name of the BasePathMapping resource to be described.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-basepathmapping.html#cfn-apigateway-basepathmapping-domainname
   */
  readonly domainName: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-basepathmapping.html#cfn-apigateway-basepathmapping-id
   */
  readonly id?: string;

  /**
   * The string identifier of the associated RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-basepathmapping.html#cfn-apigateway-basepathmapping-restapiid
   */
  readonly restApiId?: string;

  /**
   * The name of the associated stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-basepathmapping.html#cfn-apigateway-basepathmapping-stage
   */
  readonly stage?: string;
}

/**
 * Determine whether the given properties match those of a `CfnBasePathMappingProps`
 *
 * @param properties - the TypeScript properties of a `CfnBasePathMappingProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBasePathMappingPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("basePath", cdk.validateString)(properties.basePath));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  errors.collect(cdk.propertyValidator("stage", cdk.validateString)(properties.stage));
  return errors.wrap("supplied properties not correct for \"CfnBasePathMappingProps\"");
}

// @ts-ignore TS6133
function convertCfnBasePathMappingPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBasePathMappingPropsValidator(properties).assertSuccess();
  return {
    "BasePath": cdk.stringToCloudFormation(properties.basePath),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "Id": cdk.stringToCloudFormation(properties.id),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId),
    "Stage": cdk.stringToCloudFormation(properties.stage)
  };
}

// @ts-ignore TS6133
function CfnBasePathMappingPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBasePathMappingProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBasePathMappingProps>();
  ret.addPropertyResult("basePath", "BasePath", (properties.BasePath != null ? cfn_parse.FromCloudFormation.getString(properties.BasePath) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addPropertyResult("stage", "Stage", (properties.Stage != null ? cfn_parse.FromCloudFormation.getString(properties.Stage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::ClientCertificate` resource creates a client certificate that API Gateway uses to configure client-side SSL authentication for sending requests to the integration endpoint.
 *
 * @cloudformationResource AWS::ApiGateway::ClientCertificate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-clientcertificate.html
 */
export class CfnClientCertificate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::ClientCertificate";

  /**
   * Build a CfnClientCertificate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnClientCertificate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClientCertificatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnClientCertificate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the client certificate. For example: `abc123` .
   *
   * @cloudformationAttribute ClientCertificateId
   */
  public readonly attrClientCertificateId: string;

  /**
   * The description of the client certificate.
   */
  public description?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The collection of tags.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClientCertificateProps = {}) {
    super(scope, id, {
      "type": CfnClientCertificate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrClientCertificateId = cdk.Token.asString(this.getAtt("ClientCertificateId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ApiGateway::ClientCertificate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnClientCertificate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClientCertificatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnClientCertificate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-clientcertificate.html
 */
export interface CfnClientCertificateProps {
  /**
   * The description of the client certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-clientcertificate.html#cfn-apigateway-clientcertificate-description
   */
  readonly description?: string;

  /**
   * The collection of tags.
   *
   * Each tag element is associated with a given resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-clientcertificate.html#cfn-apigateway-clientcertificate-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnClientCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnClientCertificateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClientCertificatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnClientCertificateProps\"");
}

// @ts-ignore TS6133
function convertCfnClientCertificatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClientCertificatePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnClientCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClientCertificateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClientCertificateProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::Deployment` resource deploys an API Gateway `RestApi` resource to a stage so that clients can call the API over the internet.
 *
 * The stage acts as an environment.
 *
 * @cloudformationResource AWS::ApiGateway::Deployment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-deployment.html
 */
export class CfnDeployment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::Deployment";

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
   * The ID for the deployment. For example: `abc123` .
   *
   * @cloudformationAttribute DeploymentId
   */
  public readonly attrDeploymentId: string;

  /**
   * The input configuration for a canary deployment.
   */
  public deploymentCanarySettings?: CfnDeployment.DeploymentCanarySettingsProperty | cdk.IResolvable;

  /**
   * The description for the Deployment resource to create.
   */
  public description?: string;

  /**
   * The string identifier of the associated RestApi.
   */
  public restApiId: string;

  /**
   * The description of the Stage resource for the Deployment resource to create.
   */
  public stageDescription?: cdk.IResolvable | CfnDeployment.StageDescriptionProperty;

  /**
   * The name of the Stage resource for the Deployment resource to create.
   */
  public stageName?: string;

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

    cdk.requireProperty(props, "restApiId", this);

    this.attrDeploymentId = cdk.Token.asString(this.getAtt("DeploymentId", cdk.ResolutionTypeHint.STRING));
    this.deploymentCanarySettings = props.deploymentCanarySettings;
    this.description = props.description;
    this.restApiId = props.restApiId;
    this.stageDescription = props.stageDescription;
    this.stageName = props.stageName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deploymentCanarySettings": this.deploymentCanarySettings,
      "description": this.description,
      "restApiId": this.restApiId,
      "stageDescription": this.stageDescription,
      "stageName": this.stageName
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
   * `StageDescription` is a property of the [AWS::ApiGateway::Deployment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-deployment.html) resource that configures a deployment stage.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html
   */
  export interface StageDescriptionProperty {
    /**
     * Specifies settings for logging access in this stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-accesslogsetting
     */
    readonly accessLogSetting?: CfnDeployment.AccessLogSettingProperty | cdk.IResolvable;

    /**
     * Specifies whether a cache cluster is enabled for the stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-cacheclusterenabled
     */
    readonly cacheClusterEnabled?: boolean | cdk.IResolvable;

    /**
     * The size of the stage's cache cluster.
     *
     * For more information, see [cacheClusterSize](https://docs.aws.amazon.com/apigateway/latest/api/API_CreateStage.html#apigw-CreateStage-request-cacheClusterSize) in the *API Gateway API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-cacheclustersize
     */
    readonly cacheClusterSize?: string;

    /**
     * Indicates whether the cached responses are encrypted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-cachedataencrypted
     */
    readonly cacheDataEncrypted?: boolean | cdk.IResolvable;

    /**
     * The time-to-live (TTL) period, in seconds, that specifies how long API Gateway caches responses.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-cachettlinseconds
     */
    readonly cacheTtlInSeconds?: number;

    /**
     * Indicates whether responses are cached and returned for requests.
     *
     * You must enable a cache cluster on the stage to cache responses. For more information, see [Enable API Gateway Caching in a Stage to Enhance API Performance](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html) in the *API Gateway Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-cachingenabled
     */
    readonly cachingEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies settings for the canary deployment in this stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-canarysetting
     */
    readonly canarySetting?: CfnDeployment.CanarySettingProperty | cdk.IResolvable;

    /**
     * The identifier of the client certificate that API Gateway uses to call your integration endpoints in the stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-clientcertificateid
     */
    readonly clientCertificateId?: string;

    /**
     * Indicates whether data trace logging is enabled for methods in the stage.
     *
     * API Gateway pushes these logs to Amazon CloudWatch Logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-datatraceenabled
     */
    readonly dataTraceEnabled?: boolean | cdk.IResolvable;

    /**
     * A description of the purpose of the stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-description
     */
    readonly description?: string;

    /**
     * The version identifier of the API documentation snapshot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-documentationversion
     */
    readonly documentationVersion?: string;

    /**
     * The logging level for this method.
     *
     * For valid values, see the `loggingLevel` property of the [MethodSetting](https://docs.aws.amazon.com/apigateway/latest/api/API_MethodSetting.html) resource in the *Amazon API Gateway API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-logginglevel
     */
    readonly loggingLevel?: string;

    /**
     * Configures settings for all of the stage's methods.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-methodsettings
     */
    readonly methodSettings?: Array<cdk.IResolvable | CfnDeployment.MethodSettingProperty> | cdk.IResolvable;

    /**
     * Indicates whether Amazon CloudWatch metrics are enabled for methods in the stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-metricsenabled
     */
    readonly metricsEnabled?: boolean | cdk.IResolvable;

    /**
     * An array of arbitrary tags (key-value pairs) to associate with the stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-tags
     */
    readonly tags?: Array<cdk.CfnTag>;

    /**
     * The target request burst rate limit.
     *
     * This allows more requests through for a period of time than the target rate limit. For more information, see [Manage API Request Throttling](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html) in the *API Gateway Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-throttlingburstlimit
     */
    readonly throttlingBurstLimit?: number;

    /**
     * The target request steady-state rate limit.
     *
     * For more information, see [Manage API Request Throttling](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html) in the *API Gateway Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-throttlingratelimit
     */
    readonly throttlingRateLimit?: number;

    /**
     * Specifies whether active tracing with X-ray is enabled for this stage.
     *
     * For more information, see [Trace API Gateway API Execution with AWS X-Ray](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-xray.html) in the *API Gateway Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-tracingenabled
     */
    readonly tracingEnabled?: boolean | cdk.IResolvable;

    /**
     * A map that defines the stage variables.
     *
     * Variable names must consist of alphanumeric characters, and the values must match the following regular expression: `[A-Za-z0-9-._~:/?#&=,]+` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html#cfn-apigateway-deployment-stagedescription-variables
     */
    readonly variables?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * The `CanarySetting` property type specifies settings for the canary deployment in this stage.
   *
   * `CanarySetting` is a property of the [StageDescription](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-canarysetting.html
   */
  export interface CanarySettingProperty {
    /**
     * The percent (0-100) of traffic diverted to a canary deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-canarysetting.html#cfn-apigateway-deployment-canarysetting-percenttraffic
     */
    readonly percentTraffic?: number;

    /**
     * Stage variables overridden for a canary release deployment, including new stage variables introduced in the canary.
     *
     * These stage variables are represented as a string-to-string map between stage variable names and their values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-canarysetting.html#cfn-apigateway-deployment-canarysetting-stagevariableoverrides
     */
    readonly stageVariableOverrides?: cdk.IResolvable | Record<string, string>;

    /**
     * A Boolean flag to indicate whether the canary deployment uses the stage cache or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-canarysetting.html#cfn-apigateway-deployment-canarysetting-usestagecache
     */
    readonly useStageCache?: boolean | cdk.IResolvable;
  }

  /**
   * The `MethodSetting` property type configures settings for all methods in a stage.
   *
   * The `MethodSettings` property of the [Amazon API Gateway Deployment StageDescription](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html) property type contains a list of `MethodSetting` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-methodsetting.html
   */
  export interface MethodSettingProperty {
    /**
     * Specifies whether the cached responses are encrypted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-methodsetting.html#cfn-apigateway-deployment-methodsetting-cachedataencrypted
     */
    readonly cacheDataEncrypted?: boolean | cdk.IResolvable;

    /**
     * Specifies the time to live (TTL), in seconds, for cached responses.
     *
     * The higher the TTL, the longer the response will be cached.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-methodsetting.html#cfn-apigateway-deployment-methodsetting-cachettlinseconds
     */
    readonly cacheTtlInSeconds?: number;

    /**
     * Specifies whether responses should be cached and returned for requests.
     *
     * A cache cluster must be enabled on the stage for responses to be cached.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-methodsetting.html#cfn-apigateway-deployment-methodsetting-cachingenabled
     */
    readonly cachingEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies whether data trace logging is enabled for this method, which affects the log entries pushed to Amazon CloudWatch Logs.
     *
     * This can be useful to troubleshoot APIs, but can result in logging sensitive data. We recommend that you don't enable this option for production APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-methodsetting.html#cfn-apigateway-deployment-methodsetting-datatraceenabled
     */
    readonly dataTraceEnabled?: boolean | cdk.IResolvable;

    /**
     * The HTTP method.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-methodsetting.html#cfn-apigateway-deployment-methodsetting-httpmethod
     */
    readonly httpMethod?: string;

    /**
     * Specifies the logging level for this method, which affects the log entries pushed to Amazon CloudWatch Logs.
     *
     * Valid values are `OFF` , `ERROR` , and `INFO` . Choose `ERROR` to write only error-level entries to CloudWatch Logs, or choose `INFO` to include all `ERROR` events as well as extra informational events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-methodsetting.html#cfn-apigateway-deployment-methodsetting-logginglevel
     */
    readonly loggingLevel?: string;

    /**
     * Specifies whether Amazon CloudWatch metrics are enabled for this method.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-methodsetting.html#cfn-apigateway-deployment-methodsetting-metricsenabled
     */
    readonly metricsEnabled?: boolean | cdk.IResolvable;

    /**
     * The resource path for this method.
     *
     * Forward slashes ( `/` ) are encoded as `~1` and the initial slash must include a forward slash. For example, the path value `/resource/subresource` must be encoded as `/~1resource~1subresource` . To specify the root path, use only a slash ( `/` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-methodsetting.html#cfn-apigateway-deployment-methodsetting-resourcepath
     */
    readonly resourcePath?: string;

    /**
     * Specifies the throttling burst limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-methodsetting.html#cfn-apigateway-deployment-methodsetting-throttlingburstlimit
     */
    readonly throttlingBurstLimit?: number;

    /**
     * Specifies the throttling rate limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-methodsetting.html#cfn-apigateway-deployment-methodsetting-throttlingratelimit
     */
    readonly throttlingRateLimit?: number;
  }

  /**
   * The `AccessLogSetting` property type specifies settings for logging access in this stage.
   *
   * `AccessLogSetting` is a property of the [StageDescription](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-stagedescription.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-accesslogsetting.html
   */
  export interface AccessLogSettingProperty {
    /**
     * The Amazon Resource Name (ARN) of the CloudWatch Logs log group or Kinesis Data Firehose delivery stream to receive access logs.
     *
     * If you specify a Kinesis Data Firehose delivery stream, the stream name must begin with `amazon-apigateway-` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-accesslogsetting.html#cfn-apigateway-deployment-accesslogsetting-destinationarn
     */
    readonly destinationArn?: string;

    /**
     * A single line format of the access logs of data, as specified by selected $context variables.
     *
     * The format must include at least `$context.requestId` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-accesslogsetting.html#cfn-apigateway-deployment-accesslogsetting-format
     */
    readonly format?: string;
  }

  /**
   * The `DeploymentCanarySettings` property type specifies settings for the canary deployment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-deploymentcanarysettings.html
   */
  export interface DeploymentCanarySettingsProperty {
    /**
     * The percentage (0.0-100.0) of traffic routed to the canary deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-deploymentcanarysettings.html#cfn-apigateway-deployment-deploymentcanarysettings-percenttraffic
     */
    readonly percentTraffic?: number;

    /**
     * A stage variable overrides used for the canary release deployment.
     *
     * They can override existing stage variables or add new stage variables for the canary release deployment. These stage variables are represented as a string-to-string map between stage variable names and their values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-deploymentcanarysettings.html#cfn-apigateway-deployment-deploymentcanarysettings-stagevariableoverrides
     */
    readonly stageVariableOverrides?: cdk.IResolvable | Record<string, string>;

    /**
     * A Boolean flag to indicate whether the canary release deployment uses the stage cache or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-deployment-deploymentcanarysettings.html#cfn-apigateway-deployment-deploymentcanarysettings-usestagecache
     */
    readonly useStageCache?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnDeployment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-deployment.html
 */
export interface CfnDeploymentProps {
  /**
   * The input configuration for a canary deployment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-deployment.html#cfn-apigateway-deployment-deploymentcanarysettings
   */
  readonly deploymentCanarySettings?: CfnDeployment.DeploymentCanarySettingsProperty | cdk.IResolvable;

  /**
   * The description for the Deployment resource to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-deployment.html#cfn-apigateway-deployment-description
   */
  readonly description?: string;

  /**
   * The string identifier of the associated RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-deployment.html#cfn-apigateway-deployment-restapiid
   */
  readonly restApiId: string;

  /**
   * The description of the Stage resource for the Deployment resource to create.
   *
   * To specify a stage description, you must also provide a stage name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-deployment.html#cfn-apigateway-deployment-stagedescription
   */
  readonly stageDescription?: cdk.IResolvable | CfnDeployment.StageDescriptionProperty;

  /**
   * The name of the Stage resource for the Deployment resource to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-deployment.html#cfn-apigateway-deployment-stagename
   */
  readonly stageName?: string;
}

/**
 * Determine whether the given properties match those of a `CanarySettingProperty`
 *
 * @param properties - the TypeScript properties of a `CanarySettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentCanarySettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("percentTraffic", cdk.validateNumber)(properties.percentTraffic));
  errors.collect(cdk.propertyValidator("stageVariableOverrides", cdk.hashValidator(cdk.validateString))(properties.stageVariableOverrides));
  errors.collect(cdk.propertyValidator("useStageCache", cdk.validateBoolean)(properties.useStageCache));
  return errors.wrap("supplied properties not correct for \"CanarySettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentCanarySettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentCanarySettingPropertyValidator(properties).assertSuccess();
  return {
    "PercentTraffic": cdk.numberToCloudFormation(properties.percentTraffic),
    "StageVariableOverrides": cdk.hashMapper(cdk.stringToCloudFormation)(properties.stageVariableOverrides),
    "UseStageCache": cdk.booleanToCloudFormation(properties.useStageCache)
  };
}

// @ts-ignore TS6133
function CfnDeploymentCanarySettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.CanarySettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.CanarySettingProperty>();
  ret.addPropertyResult("percentTraffic", "PercentTraffic", (properties.PercentTraffic != null ? cfn_parse.FromCloudFormation.getNumber(properties.PercentTraffic) : undefined));
  ret.addPropertyResult("stageVariableOverrides", "StageVariableOverrides", (properties.StageVariableOverrides != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.StageVariableOverrides) : undefined));
  ret.addPropertyResult("useStageCache", "UseStageCache", (properties.UseStageCache != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseStageCache) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MethodSettingProperty`
 *
 * @param properties - the TypeScript properties of a `MethodSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentMethodSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cacheDataEncrypted", cdk.validateBoolean)(properties.cacheDataEncrypted));
  errors.collect(cdk.propertyValidator("cacheTtlInSeconds", cdk.validateNumber)(properties.cacheTtlInSeconds));
  errors.collect(cdk.propertyValidator("cachingEnabled", cdk.validateBoolean)(properties.cachingEnabled));
  errors.collect(cdk.propertyValidator("dataTraceEnabled", cdk.validateBoolean)(properties.dataTraceEnabled));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.validateString)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("loggingLevel", cdk.validateString)(properties.loggingLevel));
  errors.collect(cdk.propertyValidator("metricsEnabled", cdk.validateBoolean)(properties.metricsEnabled));
  errors.collect(cdk.propertyValidator("resourcePath", cdk.validateString)(properties.resourcePath));
  errors.collect(cdk.propertyValidator("throttlingBurstLimit", cdk.validateNumber)(properties.throttlingBurstLimit));
  errors.collect(cdk.propertyValidator("throttlingRateLimit", cdk.validateNumber)(properties.throttlingRateLimit));
  return errors.wrap("supplied properties not correct for \"MethodSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentMethodSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentMethodSettingPropertyValidator(properties).assertSuccess();
  return {
    "CacheDataEncrypted": cdk.booleanToCloudFormation(properties.cacheDataEncrypted),
    "CacheTtlInSeconds": cdk.numberToCloudFormation(properties.cacheTtlInSeconds),
    "CachingEnabled": cdk.booleanToCloudFormation(properties.cachingEnabled),
    "DataTraceEnabled": cdk.booleanToCloudFormation(properties.dataTraceEnabled),
    "HttpMethod": cdk.stringToCloudFormation(properties.httpMethod),
    "LoggingLevel": cdk.stringToCloudFormation(properties.loggingLevel),
    "MetricsEnabled": cdk.booleanToCloudFormation(properties.metricsEnabled),
    "ResourcePath": cdk.stringToCloudFormation(properties.resourcePath),
    "ThrottlingBurstLimit": cdk.numberToCloudFormation(properties.throttlingBurstLimit),
    "ThrottlingRateLimit": cdk.numberToCloudFormation(properties.throttlingRateLimit)
  };
}

// @ts-ignore TS6133
function CfnDeploymentMethodSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeployment.MethodSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.MethodSettingProperty>();
  ret.addPropertyResult("cacheDataEncrypted", "CacheDataEncrypted", (properties.CacheDataEncrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CacheDataEncrypted) : undefined));
  ret.addPropertyResult("cacheTtlInSeconds", "CacheTtlInSeconds", (properties.CacheTtlInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.CacheTtlInSeconds) : undefined));
  ret.addPropertyResult("cachingEnabled", "CachingEnabled", (properties.CachingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CachingEnabled) : undefined));
  ret.addPropertyResult("dataTraceEnabled", "DataTraceEnabled", (properties.DataTraceEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataTraceEnabled) : undefined));
  ret.addPropertyResult("httpMethod", "HttpMethod", (properties.HttpMethod != null ? cfn_parse.FromCloudFormation.getString(properties.HttpMethod) : undefined));
  ret.addPropertyResult("loggingLevel", "LoggingLevel", (properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined));
  ret.addPropertyResult("metricsEnabled", "MetricsEnabled", (properties.MetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MetricsEnabled) : undefined));
  ret.addPropertyResult("resourcePath", "ResourcePath", (properties.ResourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.ResourcePath) : undefined));
  ret.addPropertyResult("throttlingBurstLimit", "ThrottlingBurstLimit", (properties.ThrottlingBurstLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingBurstLimit) : undefined));
  ret.addPropertyResult("throttlingRateLimit", "ThrottlingRateLimit", (properties.ThrottlingRateLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingRateLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentAccessLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  return errors.wrap("supplied properties not correct for \"AccessLogSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentAccessLogSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentAccessLogSettingPropertyValidator(properties).assertSuccess();
  return {
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn),
    "Format": cdk.stringToCloudFormation(properties.format)
  };
}

// @ts-ignore TS6133
function CfnDeploymentAccessLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.AccessLogSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.AccessLogSettingProperty>();
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StageDescriptionProperty`
 *
 * @param properties - the TypeScript properties of a `StageDescriptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentStageDescriptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessLogSetting", CfnDeploymentAccessLogSettingPropertyValidator)(properties.accessLogSetting));
  errors.collect(cdk.propertyValidator("cacheClusterEnabled", cdk.validateBoolean)(properties.cacheClusterEnabled));
  errors.collect(cdk.propertyValidator("cacheClusterSize", cdk.validateString)(properties.cacheClusterSize));
  errors.collect(cdk.propertyValidator("cacheDataEncrypted", cdk.validateBoolean)(properties.cacheDataEncrypted));
  errors.collect(cdk.propertyValidator("cacheTtlInSeconds", cdk.validateNumber)(properties.cacheTtlInSeconds));
  errors.collect(cdk.propertyValidator("cachingEnabled", cdk.validateBoolean)(properties.cachingEnabled));
  errors.collect(cdk.propertyValidator("canarySetting", CfnDeploymentCanarySettingPropertyValidator)(properties.canarySetting));
  errors.collect(cdk.propertyValidator("clientCertificateId", cdk.validateString)(properties.clientCertificateId));
  errors.collect(cdk.propertyValidator("dataTraceEnabled", cdk.validateBoolean)(properties.dataTraceEnabled));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("documentationVersion", cdk.validateString)(properties.documentationVersion));
  errors.collect(cdk.propertyValidator("loggingLevel", cdk.validateString)(properties.loggingLevel));
  errors.collect(cdk.propertyValidator("methodSettings", cdk.listValidator(CfnDeploymentMethodSettingPropertyValidator))(properties.methodSettings));
  errors.collect(cdk.propertyValidator("metricsEnabled", cdk.validateBoolean)(properties.metricsEnabled));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("throttlingBurstLimit", cdk.validateNumber)(properties.throttlingBurstLimit));
  errors.collect(cdk.propertyValidator("throttlingRateLimit", cdk.validateNumber)(properties.throttlingRateLimit));
  errors.collect(cdk.propertyValidator("tracingEnabled", cdk.validateBoolean)(properties.tracingEnabled));
  errors.collect(cdk.propertyValidator("variables", cdk.hashValidator(cdk.validateString))(properties.variables));
  return errors.wrap("supplied properties not correct for \"StageDescriptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentStageDescriptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentStageDescriptionPropertyValidator(properties).assertSuccess();
  return {
    "AccessLogSetting": convertCfnDeploymentAccessLogSettingPropertyToCloudFormation(properties.accessLogSetting),
    "CacheClusterEnabled": cdk.booleanToCloudFormation(properties.cacheClusterEnabled),
    "CacheClusterSize": cdk.stringToCloudFormation(properties.cacheClusterSize),
    "CacheDataEncrypted": cdk.booleanToCloudFormation(properties.cacheDataEncrypted),
    "CacheTtlInSeconds": cdk.numberToCloudFormation(properties.cacheTtlInSeconds),
    "CachingEnabled": cdk.booleanToCloudFormation(properties.cachingEnabled),
    "CanarySetting": convertCfnDeploymentCanarySettingPropertyToCloudFormation(properties.canarySetting),
    "ClientCertificateId": cdk.stringToCloudFormation(properties.clientCertificateId),
    "DataTraceEnabled": cdk.booleanToCloudFormation(properties.dataTraceEnabled),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DocumentationVersion": cdk.stringToCloudFormation(properties.documentationVersion),
    "LoggingLevel": cdk.stringToCloudFormation(properties.loggingLevel),
    "MethodSettings": cdk.listMapper(convertCfnDeploymentMethodSettingPropertyToCloudFormation)(properties.methodSettings),
    "MetricsEnabled": cdk.booleanToCloudFormation(properties.metricsEnabled),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "ThrottlingBurstLimit": cdk.numberToCloudFormation(properties.throttlingBurstLimit),
    "ThrottlingRateLimit": cdk.numberToCloudFormation(properties.throttlingRateLimit),
    "TracingEnabled": cdk.booleanToCloudFormation(properties.tracingEnabled),
    "Variables": cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables)
  };
}

// @ts-ignore TS6133
function CfnDeploymentStageDescriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeployment.StageDescriptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.StageDescriptionProperty>();
  ret.addPropertyResult("accessLogSetting", "AccessLogSetting", (properties.AccessLogSetting != null ? CfnDeploymentAccessLogSettingPropertyFromCloudFormation(properties.AccessLogSetting) : undefined));
  ret.addPropertyResult("cacheClusterEnabled", "CacheClusterEnabled", (properties.CacheClusterEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CacheClusterEnabled) : undefined));
  ret.addPropertyResult("cacheClusterSize", "CacheClusterSize", (properties.CacheClusterSize != null ? cfn_parse.FromCloudFormation.getString(properties.CacheClusterSize) : undefined));
  ret.addPropertyResult("cacheDataEncrypted", "CacheDataEncrypted", (properties.CacheDataEncrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CacheDataEncrypted) : undefined));
  ret.addPropertyResult("cacheTtlInSeconds", "CacheTtlInSeconds", (properties.CacheTtlInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.CacheTtlInSeconds) : undefined));
  ret.addPropertyResult("cachingEnabled", "CachingEnabled", (properties.CachingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CachingEnabled) : undefined));
  ret.addPropertyResult("canarySetting", "CanarySetting", (properties.CanarySetting != null ? CfnDeploymentCanarySettingPropertyFromCloudFormation(properties.CanarySetting) : undefined));
  ret.addPropertyResult("clientCertificateId", "ClientCertificateId", (properties.ClientCertificateId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientCertificateId) : undefined));
  ret.addPropertyResult("dataTraceEnabled", "DataTraceEnabled", (properties.DataTraceEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataTraceEnabled) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("documentationVersion", "DocumentationVersion", (properties.DocumentationVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentationVersion) : undefined));
  ret.addPropertyResult("loggingLevel", "LoggingLevel", (properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined));
  ret.addPropertyResult("methodSettings", "MethodSettings", (properties.MethodSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentMethodSettingPropertyFromCloudFormation)(properties.MethodSettings) : undefined));
  ret.addPropertyResult("metricsEnabled", "MetricsEnabled", (properties.MetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MetricsEnabled) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("throttlingBurstLimit", "ThrottlingBurstLimit", (properties.ThrottlingBurstLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingBurstLimit) : undefined));
  ret.addPropertyResult("throttlingRateLimit", "ThrottlingRateLimit", (properties.ThrottlingRateLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingRateLimit) : undefined));
  ret.addPropertyResult("tracingEnabled", "TracingEnabled", (properties.TracingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TracingEnabled) : undefined));
  ret.addPropertyResult("variables", "Variables", (properties.Variables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Variables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentCanarySettingsProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentCanarySettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentDeploymentCanarySettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("percentTraffic", cdk.validateNumber)(properties.percentTraffic));
  errors.collect(cdk.propertyValidator("stageVariableOverrides", cdk.hashValidator(cdk.validateString))(properties.stageVariableOverrides));
  errors.collect(cdk.propertyValidator("useStageCache", cdk.validateBoolean)(properties.useStageCache));
  return errors.wrap("supplied properties not correct for \"DeploymentCanarySettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentDeploymentCanarySettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentDeploymentCanarySettingsPropertyValidator(properties).assertSuccess();
  return {
    "PercentTraffic": cdk.numberToCloudFormation(properties.percentTraffic),
    "StageVariableOverrides": cdk.hashMapper(cdk.stringToCloudFormation)(properties.stageVariableOverrides),
    "UseStageCache": cdk.booleanToCloudFormation(properties.useStageCache)
  };
}

// @ts-ignore TS6133
function CfnDeploymentDeploymentCanarySettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeployment.DeploymentCanarySettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeployment.DeploymentCanarySettingsProperty>();
  ret.addPropertyResult("percentTraffic", "PercentTraffic", (properties.PercentTraffic != null ? cfn_parse.FromCloudFormation.getNumber(properties.PercentTraffic) : undefined));
  ret.addPropertyResult("stageVariableOverrides", "StageVariableOverrides", (properties.StageVariableOverrides != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.StageVariableOverrides) : undefined));
  ret.addPropertyResult("useStageCache", "UseStageCache", (properties.UseStageCache != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseStageCache) : undefined));
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
  errors.collect(cdk.propertyValidator("deploymentCanarySettings", CfnDeploymentDeploymentCanarySettingsPropertyValidator)(properties.deploymentCanarySettings));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("restApiId", cdk.requiredValidator)(properties.restApiId));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  errors.collect(cdk.propertyValidator("stageDescription", CfnDeploymentStageDescriptionPropertyValidator)(properties.stageDescription));
  errors.collect(cdk.propertyValidator("stageName", cdk.validateString)(properties.stageName));
  return errors.wrap("supplied properties not correct for \"CfnDeploymentProps\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentPropsValidator(properties).assertSuccess();
  return {
    "DeploymentCanarySettings": convertCfnDeploymentDeploymentCanarySettingsPropertyToCloudFormation(properties.deploymentCanarySettings),
    "Description": cdk.stringToCloudFormation(properties.description),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId),
    "StageDescription": convertCfnDeploymentStageDescriptionPropertyToCloudFormation(properties.stageDescription),
    "StageName": cdk.stringToCloudFormation(properties.stageName)
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
  ret.addPropertyResult("deploymentCanarySettings", "DeploymentCanarySettings", (properties.DeploymentCanarySettings != null ? CfnDeploymentDeploymentCanarySettingsPropertyFromCloudFormation(properties.DeploymentCanarySettings) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addPropertyResult("stageDescription", "StageDescription", (properties.StageDescription != null ? CfnDeploymentStageDescriptionPropertyFromCloudFormation(properties.StageDescription) : undefined));
  ret.addPropertyResult("stageName", "StageName", (properties.StageName != null ? cfn_parse.FromCloudFormation.getString(properties.StageName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::DocumentationPart` resource creates a documentation part for an API.
 *
 * For more information, see [Representation of API Documentation in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-documenting-api-content-representation.html) in the *API Gateway Developer Guide* .
 *
 * @cloudformationResource AWS::ApiGateway::DocumentationPart
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html
 */
export class CfnDocumentationPart extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::DocumentationPart";

  /**
   * Build a CfnDocumentationPart from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDocumentationPart {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDocumentationPartPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDocumentationPart(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the documentation part.
   *
   * @cloudformationAttribute DocumentationPartId
   */
  public readonly attrDocumentationPartId: string;

  /**
   * The location of the targeted API entity of the to-be-created documentation part.
   */
  public location: cdk.IResolvable | CfnDocumentationPart.LocationProperty;

  /**
   * The new documentation content map of the targeted API entity.
   */
  public properties: string;

  /**
   * The string identifier of the associated RestApi.
   */
  public restApiId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDocumentationPartProps) {
    super(scope, id, {
      "type": CfnDocumentationPart.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "location", this);
    cdk.requireProperty(props, "properties", this);
    cdk.requireProperty(props, "restApiId", this);

    this.attrDocumentationPartId = cdk.Token.asString(this.getAtt("DocumentationPartId", cdk.ResolutionTypeHint.STRING));
    this.location = props.location;
    this.properties = props.properties;
    this.restApiId = props.restApiId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "location": this.location,
      "properties": this.properties,
      "restApiId": this.restApiId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDocumentationPart.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDocumentationPartPropsToCloudFormation(props);
  }
}

export namespace CfnDocumentationPart {
  /**
   * The `Location` property specifies the location of the Amazon API Gateway API entity that the documentation applies to.
   *
   * `Location` is a property of the [AWS::ApiGateway::DocumentationPart](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html) resource.
   *
   * > For more information about each property, including constraints and valid values, see [DocumentationPart](https://docs.aws.amazon.com/apigateway/latest/api/API_DocumentationPartLocation.html) in the *Amazon API Gateway REST API Reference* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-documentationpart-location.html
   */
  export interface LocationProperty {
    /**
     * The HTTP verb of a method.
     *
     * It is a valid field for the API entity types of `METHOD` , `PATH_PARAMETER` , `QUERY_PARAMETER` , `REQUEST_HEADER` , `REQUEST_BODY` , `RESPONSE` , `RESPONSE_HEADER` , and `RESPONSE_BODY` . The default value is `*` for any method. When an applicable child entity inherits the content of an entity of the same type with more general specifications of the other `location` attributes, the child entity's `method` attribute must match that of the parent entity exactly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-documentationpart-location.html#cfn-apigateway-documentationpart-location-method
     */
    readonly method?: string;

    /**
     * The name of the targeted API entity.
     *
     * It is a valid and required field for the API entity types of `AUTHORIZER` , `MODEL` , `PATH_PARAMETER` , `QUERY_PARAMETER` , `REQUEST_HEADER` , `REQUEST_BODY` and `RESPONSE_HEADER` . It is an invalid field for any other entity type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-documentationpart-location.html#cfn-apigateway-documentationpart-location-name
     */
    readonly name?: string;

    /**
     * The URL path of the target.
     *
     * It is a valid field for the API entity types of `RESOURCE` , `METHOD` , `PATH_PARAMETER` , `QUERY_PARAMETER` , `REQUEST_HEADER` , `REQUEST_BODY` , `RESPONSE` , `RESPONSE_HEADER` , and `RESPONSE_BODY` . The default value is `/` for the root resource. When an applicable child entity inherits the content of another entity of the same type with more general specifications of the other `location` attributes, the child entity's `path` attribute must match that of the parent entity as a prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-documentationpart-location.html#cfn-apigateway-documentationpart-location-path
     */
    readonly path?: string;

    /**
     * The HTTP status code of a response.
     *
     * It is a valid field for the API entity types of `RESPONSE` , `RESPONSE_HEADER` , and `RESPONSE_BODY` . The default value is `*` for any status code. When an applicable child entity inherits the content of an entity of the same type with more general specifications of the other `location` attributes, the child entity's `statusCode` attribute must match that of the parent entity exactly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-documentationpart-location.html#cfn-apigateway-documentationpart-location-statuscode
     */
    readonly statusCode?: string;

    /**
     * The type of API entity to which the documentation content applies.
     *
     * Valid values are `API` , `AUTHORIZER` , `MODEL` , `RESOURCE` , `METHOD` , `PATH_PARAMETER` , `QUERY_PARAMETER` , `REQUEST_HEADER` , `REQUEST_BODY` , `RESPONSE` , `RESPONSE_HEADER` , and `RESPONSE_BODY` . Content inheritance does not apply to any entity of the `API` , `AUTHORIZER` , `METHOD` , `MODEL` , `REQUEST_BODY` , or `RESOURCE` type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-documentationpart-location.html#cfn-apigateway-documentationpart-location-type
     */
    readonly type?: string;
  }
}

/**
 * Properties for defining a `CfnDocumentationPart`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html
 */
export interface CfnDocumentationPartProps {
  /**
   * The location of the targeted API entity of the to-be-created documentation part.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html#cfn-apigateway-documentationpart-location
   */
  readonly location: cdk.IResolvable | CfnDocumentationPart.LocationProperty;

  /**
   * The new documentation content map of the targeted API entity.
   *
   * Enclosed key-value pairs are API-specific, but only OpenAPI-compliant key-value pairs can be exported and, hence, published.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html#cfn-apigateway-documentationpart-properties
   */
  readonly properties: string;

  /**
   * The string identifier of the associated RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html#cfn-apigateway-documentationpart-restapiid
   */
  readonly restApiId: string;
}

/**
 * Determine whether the given properties match those of a `LocationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentationPartLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("method", cdk.validateString)(properties.method));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("statusCode", cdk.validateString)(properties.statusCode));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDocumentationPartLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentationPartLocationPropertyValidator(properties).assertSuccess();
  return {
    "Method": cdk.stringToCloudFormation(properties.method),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Path": cdk.stringToCloudFormation(properties.path),
    "StatusCode": cdk.stringToCloudFormation(properties.statusCode),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDocumentationPartLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDocumentationPart.LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentationPart.LocationProperty>();
  ret.addPropertyResult("method", "Method", (properties.Method != null ? cfn_parse.FromCloudFormation.getString(properties.Method) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? cfn_parse.FromCloudFormation.getString(properties.StatusCode) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDocumentationPartProps`
 *
 * @param properties - the TypeScript properties of a `CfnDocumentationPartProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentationPartPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("location", cdk.requiredValidator)(properties.location));
  errors.collect(cdk.propertyValidator("location", CfnDocumentationPartLocationPropertyValidator)(properties.location));
  errors.collect(cdk.propertyValidator("properties", cdk.requiredValidator)(properties.properties));
  errors.collect(cdk.propertyValidator("properties", cdk.validateString)(properties.properties));
  errors.collect(cdk.propertyValidator("restApiId", cdk.requiredValidator)(properties.restApiId));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  return errors.wrap("supplied properties not correct for \"CfnDocumentationPartProps\"");
}

// @ts-ignore TS6133
function convertCfnDocumentationPartPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentationPartPropsValidator(properties).assertSuccess();
  return {
    "Location": convertCfnDocumentationPartLocationPropertyToCloudFormation(properties.location),
    "Properties": cdk.stringToCloudFormation(properties.properties),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId)
  };
}

// @ts-ignore TS6133
function CfnDocumentationPartPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocumentationPartProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentationPartProps>();
  ret.addPropertyResult("location", "Location", (properties.Location != null ? CfnDocumentationPartLocationPropertyFromCloudFormation(properties.Location) : undefined));
  ret.addPropertyResult("properties", "Properties", (properties.Properties != null ? cfn_parse.FromCloudFormation.getString(properties.Properties) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::DocumentationVersion` resource creates a snapshot of the documentation for an API.
 *
 * For more information, see [Representation of API Documentation in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-documenting-api-content-representation.html) in the *API Gateway Developer Guide* .
 *
 * @cloudformationResource AWS::ApiGateway::DocumentationVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationversion.html
 */
export class CfnDocumentationVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::DocumentationVersion";

  /**
   * Build a CfnDocumentationVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDocumentationVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDocumentationVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDocumentationVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A description about the new documentation snapshot.
   */
  public description?: string;

  /**
   * The version identifier of the to-be-updated documentation version.
   */
  public documentationVersion: string;

  /**
   * The string identifier of the associated RestApi.
   */
  public restApiId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDocumentationVersionProps) {
    super(scope, id, {
      "type": CfnDocumentationVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "documentationVersion", this);
    cdk.requireProperty(props, "restApiId", this);

    this.description = props.description;
    this.documentationVersion = props.documentationVersion;
    this.restApiId = props.restApiId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "documentationVersion": this.documentationVersion,
      "restApiId": this.restApiId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDocumentationVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDocumentationVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDocumentationVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationversion.html
 */
export interface CfnDocumentationVersionProps {
  /**
   * A description about the new documentation snapshot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationversion.html#cfn-apigateway-documentationversion-description
   */
  readonly description?: string;

  /**
   * The version identifier of the to-be-updated documentation version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationversion.html#cfn-apigateway-documentationversion-documentationversion
   */
  readonly documentationVersion: string;

  /**
   * The string identifier of the associated RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationversion.html#cfn-apigateway-documentationversion-restapiid
   */
  readonly restApiId: string;
}

/**
 * Determine whether the given properties match those of a `CfnDocumentationVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnDocumentationVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentationVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("documentationVersion", cdk.requiredValidator)(properties.documentationVersion));
  errors.collect(cdk.propertyValidator("documentationVersion", cdk.validateString)(properties.documentationVersion));
  errors.collect(cdk.propertyValidator("restApiId", cdk.requiredValidator)(properties.restApiId));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  return errors.wrap("supplied properties not correct for \"CfnDocumentationVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnDocumentationVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentationVersionPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DocumentationVersion": cdk.stringToCloudFormation(properties.documentationVersion),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId)
  };
}

// @ts-ignore TS6133
function CfnDocumentationVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocumentationVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentationVersionProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("documentationVersion", "DocumentationVersion", (properties.DocumentationVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentationVersion) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::DomainName` resource specifies a custom domain name for your API in API Gateway.
 *
 * You can use a custom domain name to provide a URL that's more intuitive and easier to recall. For more information about using custom domain names, see [Set up Custom Domain Name for an API in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html) in the *API Gateway Developer Guide* .
 *
 * @cloudformationResource AWS::ApiGateway::DomainName
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html
 */
export class CfnDomainName extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::DomainName";

  /**
   * Build a CfnDomainName from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDomainName {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDomainNamePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDomainName(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon CloudFront distribution domain name that's mapped to the custom domain name. This is only applicable for endpoints whose type is `EDGE` .
   *
   * Example: `d111111abcdef8.cloudfront.net`
   *
   * @cloudformationAttribute DistributionDomainName
   */
  public readonly attrDistributionDomainName: string;

  /**
   * The region-agnostic Amazon Route 53 Hosted Zone ID of the edge-optimized endpoint. The only valid value is `Z2FDTNDATAQYW2` for all regions.
   *
   * @cloudformationAttribute DistributionHostedZoneId
   */
  public readonly attrDistributionHostedZoneId: string;

  /**
   * The domain name associated with the regional endpoint for this custom domain name. You set up this association by adding a DNS record that points the custom domain name to this regional domain name.
   *
   * @cloudformationAttribute RegionalDomainName
   */
  public readonly attrRegionalDomainName: string;

  /**
   * The region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
   *
   * @cloudformationAttribute RegionalHostedZoneId
   */
  public readonly attrRegionalHostedZoneId: string;

  /**
   * The reference to an AWS -managed certificate that will be used by edge-optimized endpoint for this domain name.
   */
  public certificateArn?: string;

  /**
   * The custom domain name as an API host name, for example, `my-api.example.com` .
   */
  public domainName?: string;

  /**
   * The endpoint configuration of this DomainName showing the endpoint types of the domain name.
   */
  public endpointConfiguration?: CfnDomainName.EndpointConfigurationProperty | cdk.IResolvable;

  /**
   * The mutual TLS authentication configuration for a custom domain name.
   */
  public mutualTlsAuthentication?: cdk.IResolvable | CfnDomainName.MutualTlsAuthenticationProperty;

  /**
   * The ARN of the public certificate issued by ACM to validate ownership of your custom domain.
   */
  public ownershipVerificationCertificateArn?: string;

  /**
   * The reference to an AWS -managed certificate that will be used for validating the regional domain name.
   */
  public regionalCertificateArn?: string;

  /**
   * The Transport Layer Security (TLS) version + cipher suite for this DomainName.
   */
  public securityPolicy?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The collection of tags.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDomainNameProps = {}) {
    super(scope, id, {
      "type": CfnDomainName.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrDistributionDomainName = cdk.Token.asString(this.getAtt("DistributionDomainName", cdk.ResolutionTypeHint.STRING));
    this.attrDistributionHostedZoneId = cdk.Token.asString(this.getAtt("DistributionHostedZoneId", cdk.ResolutionTypeHint.STRING));
    this.attrRegionalDomainName = cdk.Token.asString(this.getAtt("RegionalDomainName", cdk.ResolutionTypeHint.STRING));
    this.attrRegionalHostedZoneId = cdk.Token.asString(this.getAtt("RegionalHostedZoneId", cdk.ResolutionTypeHint.STRING));
    this.certificateArn = props.certificateArn;
    this.domainName = props.domainName;
    this.endpointConfiguration = props.endpointConfiguration;
    this.mutualTlsAuthentication = props.mutualTlsAuthentication;
    this.ownershipVerificationCertificateArn = props.ownershipVerificationCertificateArn;
    this.regionalCertificateArn = props.regionalCertificateArn;
    this.securityPolicy = props.securityPolicy;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ApiGateway::DomainName", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "certificateArn": this.certificateArn,
      "domainName": this.domainName,
      "endpointConfiguration": this.endpointConfiguration,
      "mutualTlsAuthentication": this.mutualTlsAuthentication,
      "ownershipVerificationCertificateArn": this.ownershipVerificationCertificateArn,
      "regionalCertificateArn": this.regionalCertificateArn,
      "securityPolicy": this.securityPolicy,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomainName.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDomainNamePropsToCloudFormation(props);
  }
}

export namespace CfnDomainName {
  /**
   * The mutual TLS authentication configuration for a custom domain name.
   *
   * If specified, API Gateway performs two-way authentication between the client and the server. Clients must present a trusted certificate to access your API.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-mutualtlsauthentication.html
   */
  export interface MutualTlsAuthenticationProperty {
    /**
     * An Amazon S3 URL that specifies the truststore for mutual TLS authentication, for example `s3://bucket-name/key-name` .
     *
     * The truststore can contain certificates from public or private certificate authorities. To update the truststore, upload a new version to S3, and then update your custom domain name to use the new version. To update the truststore, you must have permissions to access the S3 object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-mutualtlsauthentication.html#cfn-apigateway-domainname-mutualtlsauthentication-truststoreuri
     */
    readonly truststoreUri?: string;

    /**
     * The version of the S3 object that contains your truststore.
     *
     * To specify a version, you must have versioning enabled for the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-mutualtlsauthentication.html#cfn-apigateway-domainname-mutualtlsauthentication-truststoreversion
     */
    readonly truststoreVersion?: string;
  }

  /**
   * The `EndpointConfiguration` property type specifies the endpoint types of an Amazon API Gateway domain name.
   *
   * `EndpointConfiguration` is a property of the [AWS::ApiGateway::DomainName](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-endpointconfiguration.html
   */
  export interface EndpointConfigurationProperty {
    /**
     * A list of endpoint types of an API (RestApi) or its custom domain name (DomainName).
     *
     * For an edge-optimized API and its custom domain name, the endpoint type is `"EDGE"` . For a regional API and its custom domain name, the endpoint type is `REGIONAL` . For a private API, the endpoint type is `PRIVATE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-endpointconfiguration.html#cfn-apigateway-domainname-endpointconfiguration-types
     */
    readonly types?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnDomainName`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html
 */
export interface CfnDomainNameProps {
  /**
   * The reference to an AWS -managed certificate that will be used by edge-optimized endpoint for this domain name.
   *
   * AWS Certificate Manager is the only supported source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html#cfn-apigateway-domainname-certificatearn
   */
  readonly certificateArn?: string;

  /**
   * The custom domain name as an API host name, for example, `my-api.example.com` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html#cfn-apigateway-domainname-domainname
   */
  readonly domainName?: string;

  /**
   * The endpoint configuration of this DomainName showing the endpoint types of the domain name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html#cfn-apigateway-domainname-endpointconfiguration
   */
  readonly endpointConfiguration?: CfnDomainName.EndpointConfigurationProperty | cdk.IResolvable;

  /**
   * The mutual TLS authentication configuration for a custom domain name.
   *
   * If specified, API Gateway performs two-way authentication between the client and the server. Clients must present a trusted certificate to access your API.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html#cfn-apigateway-domainname-mutualtlsauthentication
   */
  readonly mutualTlsAuthentication?: cdk.IResolvable | CfnDomainName.MutualTlsAuthenticationProperty;

  /**
   * The ARN of the public certificate issued by ACM to validate ownership of your custom domain.
   *
   * Only required when configuring mutual TLS and using an ACM imported or private CA certificate ARN as the RegionalCertificateArn.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html#cfn-apigateway-domainname-ownershipverificationcertificatearn
   */
  readonly ownershipVerificationCertificateArn?: string;

  /**
   * The reference to an AWS -managed certificate that will be used for validating the regional domain name.
   *
   * AWS Certificate Manager is the only supported source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html#cfn-apigateway-domainname-regionalcertificatearn
   */
  readonly regionalCertificateArn?: string;

  /**
   * The Transport Layer Security (TLS) version + cipher suite for this DomainName.
   *
   * The valid values are `TLS_1_0` and `TLS_1_2` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html#cfn-apigateway-domainname-securitypolicy
   */
  readonly securityPolicy?: string;

  /**
   * The collection of tags.
   *
   * Each tag element is associated with a given resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html#cfn-apigateway-domainname-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `MutualTlsAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `MutualTlsAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainNameMutualTlsAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("truststoreUri", cdk.validateString)(properties.truststoreUri));
  errors.collect(cdk.propertyValidator("truststoreVersion", cdk.validateString)(properties.truststoreVersion));
  return errors.wrap("supplied properties not correct for \"MutualTlsAuthenticationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainNameMutualTlsAuthenticationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainNameMutualTlsAuthenticationPropertyValidator(properties).assertSuccess();
  return {
    "TruststoreUri": cdk.stringToCloudFormation(properties.truststoreUri),
    "TruststoreVersion": cdk.stringToCloudFormation(properties.truststoreVersion)
  };
}

// @ts-ignore TS6133
function CfnDomainNameMutualTlsAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomainName.MutualTlsAuthenticationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainName.MutualTlsAuthenticationProperty>();
  ret.addPropertyResult("truststoreUri", "TruststoreUri", (properties.TruststoreUri != null ? cfn_parse.FromCloudFormation.getString(properties.TruststoreUri) : undefined));
  ret.addPropertyResult("truststoreVersion", "TruststoreVersion", (properties.TruststoreVersion != null ? cfn_parse.FromCloudFormation.getString(properties.TruststoreVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EndpointConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainNameEndpointConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("types", cdk.listValidator(cdk.validateString))(properties.types));
  return errors.wrap("supplied properties not correct for \"EndpointConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainNameEndpointConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainNameEndpointConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Types": cdk.listMapper(cdk.stringToCloudFormation)(properties.types)
  };
}

// @ts-ignore TS6133
function CfnDomainNameEndpointConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainName.EndpointConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainName.EndpointConfigurationProperty>();
  ret.addPropertyResult("types", "Types", (properties.Types != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Types) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDomainNameProps`
 *
 * @param properties - the TypeScript properties of a `CfnDomainNameProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainNamePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("endpointConfiguration", CfnDomainNameEndpointConfigurationPropertyValidator)(properties.endpointConfiguration));
  errors.collect(cdk.propertyValidator("mutualTlsAuthentication", CfnDomainNameMutualTlsAuthenticationPropertyValidator)(properties.mutualTlsAuthentication));
  errors.collect(cdk.propertyValidator("ownershipVerificationCertificateArn", cdk.validateString)(properties.ownershipVerificationCertificateArn));
  errors.collect(cdk.propertyValidator("regionalCertificateArn", cdk.validateString)(properties.regionalCertificateArn));
  errors.collect(cdk.propertyValidator("securityPolicy", cdk.validateString)(properties.securityPolicy));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDomainNameProps\"");
}

// @ts-ignore TS6133
function convertCfnDomainNamePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainNamePropsValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "EndpointConfiguration": convertCfnDomainNameEndpointConfigurationPropertyToCloudFormation(properties.endpointConfiguration),
    "MutualTlsAuthentication": convertCfnDomainNameMutualTlsAuthenticationPropertyToCloudFormation(properties.mutualTlsAuthentication),
    "OwnershipVerificationCertificateArn": cdk.stringToCloudFormation(properties.ownershipVerificationCertificateArn),
    "RegionalCertificateArn": cdk.stringToCloudFormation(properties.regionalCertificateArn),
    "SecurityPolicy": cdk.stringToCloudFormation(properties.securityPolicy),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDomainNamePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainNameProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainNameProps>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("endpointConfiguration", "EndpointConfiguration", (properties.EndpointConfiguration != null ? CfnDomainNameEndpointConfigurationPropertyFromCloudFormation(properties.EndpointConfiguration) : undefined));
  ret.addPropertyResult("mutualTlsAuthentication", "MutualTlsAuthentication", (properties.MutualTlsAuthentication != null ? CfnDomainNameMutualTlsAuthenticationPropertyFromCloudFormation(properties.MutualTlsAuthentication) : undefined));
  ret.addPropertyResult("ownershipVerificationCertificateArn", "OwnershipVerificationCertificateArn", (properties.OwnershipVerificationCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.OwnershipVerificationCertificateArn) : undefined));
  ret.addPropertyResult("regionalCertificateArn", "RegionalCertificateArn", (properties.RegionalCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.RegionalCertificateArn) : undefined));
  ret.addPropertyResult("securityPolicy", "SecurityPolicy", (properties.SecurityPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityPolicy) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::GatewayResponse` resource creates a gateway response for your API.
 *
 * For more information, see [API Gateway Responses](https://docs.aws.amazon.com/apigateway/latest/developerguide/customize-gateway-responses.html#api-gateway-gatewayResponse-definition) in the *API Gateway Developer Guide* .
 *
 * @cloudformationResource AWS::ApiGateway::GatewayResponse
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-gatewayresponse.html
 */
export class CfnGatewayResponse extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::GatewayResponse";

  /**
   * Build a CfnGatewayResponse from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGatewayResponse {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGatewayResponsePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGatewayResponse(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the gateway response. For example: `abc123` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Response parameters (paths, query strings and headers) of the GatewayResponse as a string-to-string map of key-value pairs.
   */
  public responseParameters?: cdk.IResolvable | Record<string, string>;

  /**
   * Response templates of the GatewayResponse as a string-to-string map of key-value pairs.
   */
  public responseTemplates?: cdk.IResolvable | Record<string, string>;

  /**
   * The response type of the associated GatewayResponse.
   */
  public responseType: string;

  /**
   * The string identifier of the associated RestApi.
   */
  public restApiId: string;

  /**
   * The HTTP status code for this GatewayResponse.
   */
  public statusCode?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGatewayResponseProps) {
    super(scope, id, {
      "type": CfnGatewayResponse.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "responseType", this);
    cdk.requireProperty(props, "restApiId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.responseParameters = props.responseParameters;
    this.responseTemplates = props.responseTemplates;
    this.responseType = props.responseType;
    this.restApiId = props.restApiId;
    this.statusCode = props.statusCode;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "responseParameters": this.responseParameters,
      "responseTemplates": this.responseTemplates,
      "responseType": this.responseType,
      "restApiId": this.restApiId,
      "statusCode": this.statusCode
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGatewayResponse.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGatewayResponsePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGatewayResponse`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-gatewayresponse.html
 */
export interface CfnGatewayResponseProps {
  /**
   * Response parameters (paths, query strings and headers) of the GatewayResponse as a string-to-string map of key-value pairs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-gatewayresponse.html#cfn-apigateway-gatewayresponse-responseparameters
   */
  readonly responseParameters?: cdk.IResolvable | Record<string, string>;

  /**
   * Response templates of the GatewayResponse as a string-to-string map of key-value pairs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-gatewayresponse.html#cfn-apigateway-gatewayresponse-responsetemplates
   */
  readonly responseTemplates?: cdk.IResolvable | Record<string, string>;

  /**
   * The response type of the associated GatewayResponse.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-gatewayresponse.html#cfn-apigateway-gatewayresponse-responsetype
   */
  readonly responseType: string;

  /**
   * The string identifier of the associated RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-gatewayresponse.html#cfn-apigateway-gatewayresponse-restapiid
   */
  readonly restApiId: string;

  /**
   * The HTTP status code for this GatewayResponse.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-gatewayresponse.html#cfn-apigateway-gatewayresponse-statuscode
   */
  readonly statusCode?: string;
}

/**
 * Determine whether the given properties match those of a `CfnGatewayResponseProps`
 *
 * @param properties - the TypeScript properties of a `CfnGatewayResponseProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGatewayResponsePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("responseParameters", cdk.hashValidator(cdk.validateString))(properties.responseParameters));
  errors.collect(cdk.propertyValidator("responseTemplates", cdk.hashValidator(cdk.validateString))(properties.responseTemplates));
  errors.collect(cdk.propertyValidator("responseType", cdk.requiredValidator)(properties.responseType));
  errors.collect(cdk.propertyValidator("responseType", cdk.validateString)(properties.responseType));
  errors.collect(cdk.propertyValidator("restApiId", cdk.requiredValidator)(properties.restApiId));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  errors.collect(cdk.propertyValidator("statusCode", cdk.validateString)(properties.statusCode));
  return errors.wrap("supplied properties not correct for \"CfnGatewayResponseProps\"");
}

// @ts-ignore TS6133
function convertCfnGatewayResponsePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGatewayResponsePropsValidator(properties).assertSuccess();
  return {
    "ResponseParameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.responseParameters),
    "ResponseTemplates": cdk.hashMapper(cdk.stringToCloudFormation)(properties.responseTemplates),
    "ResponseType": cdk.stringToCloudFormation(properties.responseType),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId),
    "StatusCode": cdk.stringToCloudFormation(properties.statusCode)
  };
}

// @ts-ignore TS6133
function CfnGatewayResponsePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayResponseProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayResponseProps>();
  ret.addPropertyResult("responseParameters", "ResponseParameters", (properties.ResponseParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ResponseParameters) : undefined));
  ret.addPropertyResult("responseTemplates", "ResponseTemplates", (properties.ResponseTemplates != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ResponseTemplates) : undefined));
  ret.addPropertyResult("responseType", "ResponseType", (properties.ResponseType != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseType) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? cfn_parse.FromCloudFormation.getString(properties.StatusCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::Method` resource creates API Gateway methods that define the parameters and body that clients must send in their requests.
 *
 * @cloudformationResource AWS::ApiGateway::Method
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html
 */
export class CfnMethod extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::Method";

  /**
   * Build a CfnMethod from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMethod {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMethodPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMethod(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A boolean flag specifying whether a valid ApiKey is required to invoke this method.
   */
  public apiKeyRequired?: boolean | cdk.IResolvable;

  /**
   * A list of authorization scopes configured on the method.
   */
  public authorizationScopes?: Array<string>;

  /**
   * The method's authorization type.
   */
  public authorizationType?: string;

  /**
   * The identifier of an authorizer to use on this method.
   */
  public authorizerId?: string;

  /**
   * The method's HTTP verb.
   */
  public httpMethod: string;

  /**
   * Represents an `HTTP` , `HTTP_PROXY` , `AWS` , `AWS_PROXY` , or Mock integration.
   */
  public integration?: CfnMethod.IntegrationProperty | cdk.IResolvable;

  /**
   * Gets a method response associated with a given HTTP status code.
   */
  public methodResponses?: Array<cdk.IResolvable | CfnMethod.MethodResponseProperty> | cdk.IResolvable;

  /**
   * A human-friendly operation identifier for the method.
   */
  public operationName?: string;

  /**
   * A key-value map specifying data schemas, represented by Model resources, (as the mapped value) of the request payloads of given content types (as the mapping key).
   */
  public requestModels?: cdk.IResolvable | Record<string, string>;

  /**
   * A key-value map defining required or optional method request parameters that can be accepted by API Gateway.
   */
  public requestParameters?: cdk.IResolvable | Record<string, boolean | cdk.IResolvable>;

  /**
   * The identifier of a RequestValidator for request validation.
   */
  public requestValidatorId?: string;

  /**
   * The Resource identifier for the MethodResponse resource.
   */
  public resourceId: string;

  /**
   * The string identifier of the associated RestApi.
   */
  public restApiId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMethodProps) {
    super(scope, id, {
      "type": CfnMethod.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "httpMethod", this);
    cdk.requireProperty(props, "resourceId", this);
    cdk.requireProperty(props, "restApiId", this);

    this.apiKeyRequired = props.apiKeyRequired;
    this.authorizationScopes = props.authorizationScopes;
    this.authorizationType = props.authorizationType;
    this.authorizerId = props.authorizerId;
    this.httpMethod = props.httpMethod;
    this.integration = props.integration;
    this.methodResponses = props.methodResponses;
    this.operationName = props.operationName;
    this.requestModels = props.requestModels;
    this.requestParameters = props.requestParameters;
    this.requestValidatorId = props.requestValidatorId;
    this.resourceId = props.resourceId;
    this.restApiId = props.restApiId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiKeyRequired": this.apiKeyRequired,
      "authorizationScopes": this.authorizationScopes,
      "authorizationType": this.authorizationType,
      "authorizerId": this.authorizerId,
      "httpMethod": this.httpMethod,
      "integration": this.integration,
      "methodResponses": this.methodResponses,
      "operationName": this.operationName,
      "requestModels": this.requestModels,
      "requestParameters": this.requestParameters,
      "requestValidatorId": this.requestValidatorId,
      "resourceId": this.resourceId,
      "restApiId": this.restApiId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMethod.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMethodPropsToCloudFormation(props);
  }
}

export namespace CfnMethod {
  /**
   * `Integration` is a property of the [AWS::ApiGateway::Method](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html) resource that specifies information about the target backend that a method calls.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html
   */
  export interface IntegrationProperty {
    /**
     * A list of request parameters whose values API Gateway caches.
     *
     * To be valid values for `cacheKeyParameters` , these parameters must also be specified for Method `requestParameters` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-cachekeyparameters
     */
    readonly cacheKeyParameters?: Array<string>;

    /**
     * Specifies a group of related cached parameters.
     *
     * By default, API Gateway uses the resource ID as the `cacheNamespace` . You can specify the same `cacheNamespace` across resources to return the same cached data for requests to different resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-cachenamespace
     */
    readonly cacheNamespace?: string;

    /**
     * The ID of the VpcLink used for the integration when `connectionType=VPC_LINK` and undefined, otherwise.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-connectionid
     */
    readonly connectionId?: string;

    /**
     * The type of the network connection to the integration endpoint.
     *
     * The valid value is `INTERNET` for connections through the public routable internet or `VPC_LINK` for private connections between API Gateway and a network load balancer in a VPC. The default value is `INTERNET` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-connectiontype
     */
    readonly connectionType?: string;

    /**
     * Specifies how to handle request payload content type conversions.
     *
     * Supported values are `CONVERT_TO_BINARY` and `CONVERT_TO_TEXT` , with the following behaviors:
     *
     * If this property is not defined, the request payload will be passed through from the method request to integration request without modification, provided that the `passthroughBehavior` is configured to support payload pass-through.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-contenthandling
     */
    readonly contentHandling?: string;

    /**
     * Specifies the credentials required for the integration, if any.
     *
     * For AWS integrations, three options are available. To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To require that the caller's identity be passed through from the request, specify the string `arn:aws:iam::\*:user/\*` . To use resource-based permissions on supported AWS services, specify null.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-credentials
     */
    readonly credentials?: string;

    /**
     * Specifies the integration's HTTP method type.
     *
     * For the Type property, if you specify `MOCK` , this property is optional. For Lambda integrations, you must set the integration method to `POST` . For all other types, you must specify this property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-integrationhttpmethod
     */
    readonly integrationHttpMethod?: string;

    /**
     * Specifies the integration's responses.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-integrationresponses
     */
    readonly integrationResponses?: Array<CfnMethod.IntegrationResponseProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies how the method request body of an unmapped content type will be passed through the integration request to the back end without transformation.
     *
     * A content type is unmapped if no mapping template is defined in the integration or the content type does not match any of the mapped content types, as specified in `requestTemplates` . The valid value is one of the following: `WHEN_NO_MATCH` : passes the method request body through the integration request to the back end without transformation when the method request content type does not match any content type associated with the mapping templates defined in the integration request. `WHEN_NO_TEMPLATES` : passes the method request body through the integration request to the back end without transformation when no mapping template is defined in the integration request. If a template is defined when this option is selected, the method request of an unmapped content-type will be rejected with an HTTP 415 Unsupported Media Type response. `NEVER` : rejects the method request with an HTTP 415 Unsupported Media Type response when either the method request content type does not match any content type associated with the mapping templates defined in the integration request or no mapping template is defined in the integration request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-passthroughbehavior
     */
    readonly passthroughBehavior?: string;

    /**
     * A key-value map specifying request parameters that are passed from the method request to the back end.
     *
     * The key is an integration request parameter name and the associated value is a method request parameter value or static value that must be enclosed within single quotes and pre-encoded as required by the back end. The method request parameter value must match the pattern of `method.request.{location}.{name}` , where `location` is `querystring` , `path` , or `header` and `name` must be a valid and unique method request parameter name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-requestparameters
     */
    readonly requestParameters?: cdk.IResolvable | Record<string, string>;

    /**
     * Represents a map of Velocity templates that are applied on the request payload based on the value of the Content-Type header sent by the client.
     *
     * The content type value is the key in this map, and the template (as a String) is the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-requesttemplates
     */
    readonly requestTemplates?: cdk.IResolvable | Record<string, string>;

    /**
     * Custom timeout between 50 and 29,000 milliseconds.
     *
     * The default value is 29,000 milliseconds or 29 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-timeoutinmillis
     */
    readonly timeoutInMillis?: number;

    /**
     * Specifies an API method integration type. The valid value is one of the following:.
     *
     * For the HTTP and HTTP proxy integrations, each integration can specify a protocol ( `http/https` ), port and path. Standard 80 and 443 ports are supported as well as custom ports above 1024. An HTTP or HTTP proxy integration with a `connectionType` of `VPC_LINK` is referred to as a private integration and uses a VpcLink to connect API Gateway to a network load balancer of a VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-type
     */
    readonly type: string;

    /**
     * Specifies Uniform Resource Identifier (URI) of the integration endpoint.
     *
     * For `HTTP` or `HTTP_PROXY` integrations, the URI must be a fully formed, encoded HTTP(S) URL according to the RFC-3986 specification for standard integrations. If `connectionType` is `VPC_LINK` specify the Network Load Balancer DNS name. For `AWS` or `AWS_PROXY` integrations, the URI is of the form `arn:aws:apigateway:{region}:{subdomain.service|service}:path|action/{service_api}` . Here, {Region} is the API Gateway region (e.g., us-east-1); {service} is the name of the integrated AWS service (e.g., s3); and {subdomain} is a designated subdomain supported by certain AWS service for fast host-name lookup. action can be used for an AWS service action-based API, using an Action={name}&{p1}={v1}&p2={v2}... query string. The ensuing {service_api} refers to a supported action {name} plus any required input parameters. Alternatively, path can be used for an AWS service path-based API. The ensuing service_api refers to the path to an AWS service resource, including the region of the integrated AWS service, if applicable. For example, for integration with the S3 API of GetObject, the uri can be either `arn:aws:apigateway:us-west-2:s3:action/GetObject&Bucket={bucket}&Key={key}` or `arn:aws:apigateway:us-west-2:s3:path/{bucket}/{key}`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integration.html#cfn-apigateway-method-integration-uri
     */
    readonly uri?: string;
  }

  /**
   * `IntegrationResponse` is a property of the [Amazon API Gateway Method Integration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apitgateway-method-integration.html) property type that specifies the response that API Gateway sends after a method's backend finishes processing a request.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integrationresponse.html
   */
  export interface IntegrationResponseProperty {
    /**
     * Specifies how to handle response payload content type conversions.
     *
     * Supported values are `CONVERT_TO_BINARY` and `CONVERT_TO_TEXT` , with the following behaviors:
     *
     * If this property is not defined, the response payload will be passed through from the integration response to the method response without modification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integrationresponse.html#cfn-apigateway-method-integrationresponse-contenthandling
     */
    readonly contentHandling?: string;

    /**
     * A key-value map specifying response parameters that are passed to the method response from the back end.
     *
     * The key is a method response header parameter name and the mapped value is an integration response header value, a static value enclosed within a pair of single quotes, or a JSON expression from the integration response body. The mapping key must match the pattern of `method.response.header.{name}` , where `name` is a valid and unique header name. The mapped non-static value must match the pattern of `integration.response.header.{name}` or `integration.response.body.{JSON-expression}` , where `name` is a valid and unique response header name and `JSON-expression` is a valid JSON expression without the `$` prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integrationresponse.html#cfn-apigateway-method-integrationresponse-responseparameters
     */
    readonly responseParameters?: cdk.IResolvable | Record<string, string>;

    /**
     * Specifies the templates used to transform the integration response body.
     *
     * Response templates are represented as a key/value map, with a content-type as the key and a template as the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integrationresponse.html#cfn-apigateway-method-integrationresponse-responsetemplates
     */
    readonly responseTemplates?: cdk.IResolvable | Record<string, string>;

    /**
     * Specifies the regular expression (regex) pattern used to choose an integration response based on the response from the back end.
     *
     * For example, if the success response returns nothing and the error response returns some string, you could use the `.+` regex to match error response. However, make sure that the error response does not contain any newline ( `\n` ) character in such cases. If the back end is an AWS Lambda function, the AWS Lambda function error header is matched. For all other HTTP and AWS back ends, the HTTP status code is matched.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integrationresponse.html#cfn-apigateway-method-integrationresponse-selectionpattern
     */
    readonly selectionPattern?: string;

    /**
     * Specifies the status code that is used to map the integration response to an existing MethodResponse.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-integrationresponse.html#cfn-apigateway-method-integrationresponse-statuscode
     */
    readonly statusCode: string;
  }

  /**
   * Represents a method response of a given HTTP status code returned to the client.
   *
   * The method response is passed from the back end through the associated integration response that can be transformed using a mapping template.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-methodresponse.html
   */
  export interface MethodResponseProperty {
    /**
     * Specifies the Model resources used for the response's content-type.
     *
     * Response models are represented as a key/value map, with a content-type as the key and a Model name as the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-methodresponse.html#cfn-apigateway-method-methodresponse-responsemodels
     */
    readonly responseModels?: cdk.IResolvable | Record<string, string>;

    /**
     * A key-value map specifying required or optional response parameters that API Gateway can send back to the caller.
     *
     * A key defines a method response header and the value specifies whether the associated method response header is required or not. The expression of the key must match the pattern `method.response.header.{name}` , where `name` is a valid and unique header name. API Gateway passes certain integration response data to the method response headers specified here according to the mapping you prescribe in the API's IntegrationResponse. The integration response data that can be mapped include an integration response header expressed in `integration.response.header.{name}` , a static value enclosed within a pair of single quotes (e.g., `'application/json'` ), or a JSON expression from the back-end response payload in the form of `integration.response.body.{JSON-expression}` , where `JSON-expression` is a valid JSON expression without the `$` prefix.)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-methodresponse.html#cfn-apigateway-method-methodresponse-responseparameters
     */
    readonly responseParameters?: cdk.IResolvable | Record<string, boolean | cdk.IResolvable>;

    /**
     * The method response's status code.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-method-methodresponse.html#cfn-apigateway-method-methodresponse-statuscode
     */
    readonly statusCode: string;
  }
}

/**
 * Properties for defining a `CfnMethod`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html
 */
export interface CfnMethodProps {
  /**
   * A boolean flag specifying whether a valid ApiKey is required to invoke this method.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-apikeyrequired
   */
  readonly apiKeyRequired?: boolean | cdk.IResolvable;

  /**
   * A list of authorization scopes configured on the method.
   *
   * The scopes are used with a `COGNITO_USER_POOLS` authorizer to authorize the method invocation. The authorization works by matching the method scopes against the scopes parsed from the access token in the incoming request. The method invocation is authorized if any method scopes matches a claimed scope in the access token. Otherwise, the invocation is not authorized. When the method scope is configured, the client must provide an access token instead of an identity token for authorization purposes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-authorizationscopes
   */
  readonly authorizationScopes?: Array<string>;

  /**
   * The method's authorization type.
   *
   * This parameter is required. For valid values, see [Method](https://docs.aws.amazon.com/apigateway/latest/api/API_Method.html) in the *API Gateway API Reference* .
   *
   * > If you specify the `AuthorizerId` property, specify `CUSTOM` or `COGNITO_USER_POOLS` for this property.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-authorizationtype
   */
  readonly authorizationType?: string;

  /**
   * The identifier of an authorizer to use on this method.
   *
   * The method's authorization type must be `CUSTOM` or `COGNITO_USER_POOLS` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-authorizerid
   */
  readonly authorizerId?: string;

  /**
   * The method's HTTP verb.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-httpmethod
   */
  readonly httpMethod: string;

  /**
   * Represents an `HTTP` , `HTTP_PROXY` , `AWS` , `AWS_PROXY` , or Mock integration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-integration
   */
  readonly integration?: CfnMethod.IntegrationProperty | cdk.IResolvable;

  /**
   * Gets a method response associated with a given HTTP status code.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-methodresponses
   */
  readonly methodResponses?: Array<cdk.IResolvable | CfnMethod.MethodResponseProperty> | cdk.IResolvable;

  /**
   * A human-friendly operation identifier for the method.
   *
   * For example, you can assign the `operationName` of `ListPets` for the `GET /pets` method in the `PetStore` example.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-operationname
   */
  readonly operationName?: string;

  /**
   * A key-value map specifying data schemas, represented by Model resources, (as the mapped value) of the request payloads of given content types (as the mapping key).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-requestmodels
   */
  readonly requestModels?: cdk.IResolvable | Record<string, string>;

  /**
   * A key-value map defining required or optional method request parameters that can be accepted by API Gateway.
   *
   * A key is a method request parameter name matching the pattern of `method.request.{location}.{name}` , where `location` is `querystring` , `path` , or `header` and `name` is a valid and unique parameter name. The value associated with the key is a Boolean flag indicating whether the parameter is required ( `true` ) or optional ( `false` ). The method request parameter names defined here are available in Integration to be mapped to integration request parameters or templates.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-requestparameters
   */
  readonly requestParameters?: cdk.IResolvable | Record<string, boolean | cdk.IResolvable>;

  /**
   * The identifier of a RequestValidator for request validation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-requestvalidatorid
   */
  readonly requestValidatorId?: string;

  /**
   * The Resource identifier for the MethodResponse resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-resourceid
   */
  readonly resourceId: string;

  /**
   * The string identifier of the associated RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-restapiid
   */
  readonly restApiId: string;
}

/**
 * Determine whether the given properties match those of a `IntegrationResponseProperty`
 *
 * @param properties - the TypeScript properties of a `IntegrationResponseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMethodIntegrationResponsePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contentHandling", cdk.validateString)(properties.contentHandling));
  errors.collect(cdk.propertyValidator("responseParameters", cdk.hashValidator(cdk.validateString))(properties.responseParameters));
  errors.collect(cdk.propertyValidator("responseTemplates", cdk.hashValidator(cdk.validateString))(properties.responseTemplates));
  errors.collect(cdk.propertyValidator("selectionPattern", cdk.validateString)(properties.selectionPattern));
  errors.collect(cdk.propertyValidator("statusCode", cdk.requiredValidator)(properties.statusCode));
  errors.collect(cdk.propertyValidator("statusCode", cdk.validateString)(properties.statusCode));
  return errors.wrap("supplied properties not correct for \"IntegrationResponseProperty\"");
}

// @ts-ignore TS6133
function convertCfnMethodIntegrationResponsePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMethodIntegrationResponsePropertyValidator(properties).assertSuccess();
  return {
    "ContentHandling": cdk.stringToCloudFormation(properties.contentHandling),
    "ResponseParameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.responseParameters),
    "ResponseTemplates": cdk.hashMapper(cdk.stringToCloudFormation)(properties.responseTemplates),
    "SelectionPattern": cdk.stringToCloudFormation(properties.selectionPattern),
    "StatusCode": cdk.stringToCloudFormation(properties.statusCode)
  };
}

// @ts-ignore TS6133
function CfnMethodIntegrationResponsePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMethod.IntegrationResponseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMethod.IntegrationResponseProperty>();
  ret.addPropertyResult("contentHandling", "ContentHandling", (properties.ContentHandling != null ? cfn_parse.FromCloudFormation.getString(properties.ContentHandling) : undefined));
  ret.addPropertyResult("responseParameters", "ResponseParameters", (properties.ResponseParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ResponseParameters) : undefined));
  ret.addPropertyResult("responseTemplates", "ResponseTemplates", (properties.ResponseTemplates != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ResponseTemplates) : undefined));
  ret.addPropertyResult("selectionPattern", "SelectionPattern", (properties.SelectionPattern != null ? cfn_parse.FromCloudFormation.getString(properties.SelectionPattern) : undefined));
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? cfn_parse.FromCloudFormation.getString(properties.StatusCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IntegrationProperty`
 *
 * @param properties - the TypeScript properties of a `IntegrationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMethodIntegrationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cacheKeyParameters", cdk.listValidator(cdk.validateString))(properties.cacheKeyParameters));
  errors.collect(cdk.propertyValidator("cacheNamespace", cdk.validateString)(properties.cacheNamespace));
  errors.collect(cdk.propertyValidator("connectionId", cdk.validateString)(properties.connectionId));
  errors.collect(cdk.propertyValidator("connectionType", cdk.validateString)(properties.connectionType));
  errors.collect(cdk.propertyValidator("contentHandling", cdk.validateString)(properties.contentHandling));
  errors.collect(cdk.propertyValidator("credentials", cdk.validateString)(properties.credentials));
  errors.collect(cdk.propertyValidator("integrationHttpMethod", cdk.validateString)(properties.integrationHttpMethod));
  errors.collect(cdk.propertyValidator("integrationResponses", cdk.listValidator(CfnMethodIntegrationResponsePropertyValidator))(properties.integrationResponses));
  errors.collect(cdk.propertyValidator("passthroughBehavior", cdk.validateString)(properties.passthroughBehavior));
  errors.collect(cdk.propertyValidator("requestParameters", cdk.hashValidator(cdk.validateString))(properties.requestParameters));
  errors.collect(cdk.propertyValidator("requestTemplates", cdk.hashValidator(cdk.validateString))(properties.requestTemplates));
  errors.collect(cdk.propertyValidator("timeoutInMillis", cdk.validateNumber)(properties.timeoutInMillis));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("uri", cdk.validateString)(properties.uri));
  return errors.wrap("supplied properties not correct for \"IntegrationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMethodIntegrationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMethodIntegrationPropertyValidator(properties).assertSuccess();
  return {
    "CacheKeyParameters": cdk.listMapper(cdk.stringToCloudFormation)(properties.cacheKeyParameters),
    "CacheNamespace": cdk.stringToCloudFormation(properties.cacheNamespace),
    "ConnectionId": cdk.stringToCloudFormation(properties.connectionId),
    "ConnectionType": cdk.stringToCloudFormation(properties.connectionType),
    "ContentHandling": cdk.stringToCloudFormation(properties.contentHandling),
    "Credentials": cdk.stringToCloudFormation(properties.credentials),
    "IntegrationHttpMethod": cdk.stringToCloudFormation(properties.integrationHttpMethod),
    "IntegrationResponses": cdk.listMapper(convertCfnMethodIntegrationResponsePropertyToCloudFormation)(properties.integrationResponses),
    "PassthroughBehavior": cdk.stringToCloudFormation(properties.passthroughBehavior),
    "RequestParameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.requestParameters),
    "RequestTemplates": cdk.hashMapper(cdk.stringToCloudFormation)(properties.requestTemplates),
    "TimeoutInMillis": cdk.numberToCloudFormation(properties.timeoutInMillis),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Uri": cdk.stringToCloudFormation(properties.uri)
  };
}

// @ts-ignore TS6133
function CfnMethodIntegrationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMethod.IntegrationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMethod.IntegrationProperty>();
  ret.addPropertyResult("cacheKeyParameters", "CacheKeyParameters", (properties.CacheKeyParameters != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CacheKeyParameters) : undefined));
  ret.addPropertyResult("cacheNamespace", "CacheNamespace", (properties.CacheNamespace != null ? cfn_parse.FromCloudFormation.getString(properties.CacheNamespace) : undefined));
  ret.addPropertyResult("connectionId", "ConnectionId", (properties.ConnectionId != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionId) : undefined));
  ret.addPropertyResult("connectionType", "ConnectionType", (properties.ConnectionType != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionType) : undefined));
  ret.addPropertyResult("contentHandling", "ContentHandling", (properties.ContentHandling != null ? cfn_parse.FromCloudFormation.getString(properties.ContentHandling) : undefined));
  ret.addPropertyResult("credentials", "Credentials", (properties.Credentials != null ? cfn_parse.FromCloudFormation.getString(properties.Credentials) : undefined));
  ret.addPropertyResult("integrationHttpMethod", "IntegrationHttpMethod", (properties.IntegrationHttpMethod != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationHttpMethod) : undefined));
  ret.addPropertyResult("integrationResponses", "IntegrationResponses", (properties.IntegrationResponses != null ? cfn_parse.FromCloudFormation.getArray(CfnMethodIntegrationResponsePropertyFromCloudFormation)(properties.IntegrationResponses) : undefined));
  ret.addPropertyResult("passthroughBehavior", "PassthroughBehavior", (properties.PassthroughBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.PassthroughBehavior) : undefined));
  ret.addPropertyResult("requestParameters", "RequestParameters", (properties.RequestParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.RequestParameters) : undefined));
  ret.addPropertyResult("requestTemplates", "RequestTemplates", (properties.RequestTemplates != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.RequestTemplates) : undefined));
  ret.addPropertyResult("timeoutInMillis", "TimeoutInMillis", (properties.TimeoutInMillis != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInMillis) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("uri", "Uri", (properties.Uri != null ? cfn_parse.FromCloudFormation.getString(properties.Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MethodResponseProperty`
 *
 * @param properties - the TypeScript properties of a `MethodResponseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMethodMethodResponsePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("responseModels", cdk.hashValidator(cdk.validateString))(properties.responseModels));
  errors.collect(cdk.propertyValidator("responseParameters", cdk.hashValidator(cdk.validateBoolean))(properties.responseParameters));
  errors.collect(cdk.propertyValidator("statusCode", cdk.requiredValidator)(properties.statusCode));
  errors.collect(cdk.propertyValidator("statusCode", cdk.validateString)(properties.statusCode));
  return errors.wrap("supplied properties not correct for \"MethodResponseProperty\"");
}

// @ts-ignore TS6133
function convertCfnMethodMethodResponsePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMethodMethodResponsePropertyValidator(properties).assertSuccess();
  return {
    "ResponseModels": cdk.hashMapper(cdk.stringToCloudFormation)(properties.responseModels),
    "ResponseParameters": cdk.hashMapper(cdk.booleanToCloudFormation)(properties.responseParameters),
    "StatusCode": cdk.stringToCloudFormation(properties.statusCode)
  };
}

// @ts-ignore TS6133
function CfnMethodMethodResponsePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMethod.MethodResponseProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMethod.MethodResponseProperty>();
  ret.addPropertyResult("responseModels", "ResponseModels", (properties.ResponseModels != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ResponseModels) : undefined));
  ret.addPropertyResult("responseParameters", "ResponseParameters", (properties.ResponseParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getBoolean)(properties.ResponseParameters) : undefined));
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? cfn_parse.FromCloudFormation.getString(properties.StatusCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMethodProps`
 *
 * @param properties - the TypeScript properties of a `CfnMethodProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMethodPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKeyRequired", cdk.validateBoolean)(properties.apiKeyRequired));
  errors.collect(cdk.propertyValidator("authorizationScopes", cdk.listValidator(cdk.validateString))(properties.authorizationScopes));
  errors.collect(cdk.propertyValidator("authorizationType", cdk.validateString)(properties.authorizationType));
  errors.collect(cdk.propertyValidator("authorizerId", cdk.validateString)(properties.authorizerId));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.requiredValidator)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.validateString)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("integration", CfnMethodIntegrationPropertyValidator)(properties.integration));
  errors.collect(cdk.propertyValidator("methodResponses", cdk.listValidator(CfnMethodMethodResponsePropertyValidator))(properties.methodResponses));
  errors.collect(cdk.propertyValidator("operationName", cdk.validateString)(properties.operationName));
  errors.collect(cdk.propertyValidator("requestModels", cdk.hashValidator(cdk.validateString))(properties.requestModels));
  errors.collect(cdk.propertyValidator("requestParameters", cdk.hashValidator(cdk.validateBoolean))(properties.requestParameters));
  errors.collect(cdk.propertyValidator("requestValidatorId", cdk.validateString)(properties.requestValidatorId));
  errors.collect(cdk.propertyValidator("resourceId", cdk.requiredValidator)(properties.resourceId));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  errors.collect(cdk.propertyValidator("restApiId", cdk.requiredValidator)(properties.restApiId));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  return errors.wrap("supplied properties not correct for \"CfnMethodProps\"");
}

// @ts-ignore TS6133
function convertCfnMethodPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMethodPropsValidator(properties).assertSuccess();
  return {
    "ApiKeyRequired": cdk.booleanToCloudFormation(properties.apiKeyRequired),
    "AuthorizationScopes": cdk.listMapper(cdk.stringToCloudFormation)(properties.authorizationScopes),
    "AuthorizationType": cdk.stringToCloudFormation(properties.authorizationType),
    "AuthorizerId": cdk.stringToCloudFormation(properties.authorizerId),
    "HttpMethod": cdk.stringToCloudFormation(properties.httpMethod),
    "Integration": convertCfnMethodIntegrationPropertyToCloudFormation(properties.integration),
    "MethodResponses": cdk.listMapper(convertCfnMethodMethodResponsePropertyToCloudFormation)(properties.methodResponses),
    "OperationName": cdk.stringToCloudFormation(properties.operationName),
    "RequestModels": cdk.hashMapper(cdk.stringToCloudFormation)(properties.requestModels),
    "RequestParameters": cdk.hashMapper(cdk.booleanToCloudFormation)(properties.requestParameters),
    "RequestValidatorId": cdk.stringToCloudFormation(properties.requestValidatorId),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId)
  };
}

// @ts-ignore TS6133
function CfnMethodPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMethodProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMethodProps>();
  ret.addPropertyResult("apiKeyRequired", "ApiKeyRequired", (properties.ApiKeyRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApiKeyRequired) : undefined));
  ret.addPropertyResult("authorizationScopes", "AuthorizationScopes", (properties.AuthorizationScopes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AuthorizationScopes) : undefined));
  ret.addPropertyResult("authorizationType", "AuthorizationType", (properties.AuthorizationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizationType) : undefined));
  ret.addPropertyResult("authorizerId", "AuthorizerId", (properties.AuthorizerId != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerId) : undefined));
  ret.addPropertyResult("httpMethod", "HttpMethod", (properties.HttpMethod != null ? cfn_parse.FromCloudFormation.getString(properties.HttpMethod) : undefined));
  ret.addPropertyResult("integration", "Integration", (properties.Integration != null ? CfnMethodIntegrationPropertyFromCloudFormation(properties.Integration) : undefined));
  ret.addPropertyResult("methodResponses", "MethodResponses", (properties.MethodResponses != null ? cfn_parse.FromCloudFormation.getArray(CfnMethodMethodResponsePropertyFromCloudFormation)(properties.MethodResponses) : undefined));
  ret.addPropertyResult("operationName", "OperationName", (properties.OperationName != null ? cfn_parse.FromCloudFormation.getString(properties.OperationName) : undefined));
  ret.addPropertyResult("requestModels", "RequestModels", (properties.RequestModels != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.RequestModels) : undefined));
  ret.addPropertyResult("requestParameters", "RequestParameters", (properties.RequestParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getBoolean)(properties.RequestParameters) : undefined));
  ret.addPropertyResult("requestValidatorId", "RequestValidatorId", (properties.RequestValidatorId != null ? cfn_parse.FromCloudFormation.getString(properties.RequestValidatorId) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::Model` resource defines the structure of a request or response payload for an API method.
 *
 * @cloudformationResource AWS::ApiGateway::Model
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-model.html
 */
export class CfnModel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::Model";

  /**
   * Build a CfnModel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnModel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnModelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnModel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The content-type for the model.
   */
  public contentType?: string;

  /**
   * The description of the model.
   */
  public description?: string;

  /**
   * A name for the model.
   */
  public name?: string;

  /**
   * The string identifier of the associated RestApi.
   */
  public restApiId: string;

  /**
   * The schema for the model.
   */
  public schema?: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnModelProps) {
    super(scope, id, {
      "type": CfnModel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "restApiId", this);

    this.contentType = props.contentType;
    this.description = props.description;
    this.name = props.name;
    this.restApiId = props.restApiId;
    this.schema = props.schema;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "contentType": this.contentType,
      "description": this.description,
      "name": this.name,
      "restApiId": this.restApiId,
      "schema": this.schema
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnModel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnModelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnModel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-model.html
 */
export interface CfnModelProps {
  /**
   * The content-type for the model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-model.html#cfn-apigateway-model-contenttype
   */
  readonly contentType?: string;

  /**
   * The description of the model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-model.html#cfn-apigateway-model-description
   */
  readonly description?: string;

  /**
   * A name for the model.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the model name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-model.html#cfn-apigateway-model-name
   */
  readonly name?: string;

  /**
   * The string identifier of the associated RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-model.html#cfn-apigateway-model-restapiid
   */
  readonly restApiId: string;

  /**
   * The schema for the model.
   *
   * For `application/json` models, this should be JSON schema draft 4 model. Do not include "\* /" characters in the description of any properties because such "\* /" characters may be interpreted as the closing marker for comments in some languages, such as Java or JavaScript, causing the installation of your API's SDK generated by API Gateway to fail.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-model.html#cfn-apigateway-model-schema
   */
  readonly schema?: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnModelProps`
 *
 * @param properties - the TypeScript properties of a `CfnModelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnModelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contentType", cdk.validateString)(properties.contentType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("restApiId", cdk.requiredValidator)(properties.restApiId));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  errors.collect(cdk.propertyValidator("schema", cdk.validateObject)(properties.schema));
  return errors.wrap("supplied properties not correct for \"CfnModelProps\"");
}

// @ts-ignore TS6133
function convertCfnModelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnModelPropsValidator(properties).assertSuccess();
  return {
    "ContentType": cdk.stringToCloudFormation(properties.contentType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId),
    "Schema": cdk.objectToCloudFormation(properties.schema)
  };
}

// @ts-ignore TS6133
function CfnModelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnModelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnModelProps>();
  ret.addPropertyResult("contentType", "ContentType", (properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addPropertyResult("schema", "Schema", (properties.Schema != null ? cfn_parse.FromCloudFormation.getAny(properties.Schema) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::RequestValidator` resource sets up basic validation rules for incoming requests to your API.
 *
 * For more information, see [Enable Basic Request Validation for an API in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-request-validation.html) in the *API Gateway Developer Guide* .
 *
 * @cloudformationResource AWS::ApiGateway::RequestValidator
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-requestvalidator.html
 */
export class CfnRequestValidator extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::RequestValidator";

  /**
   * Build a CfnRequestValidator from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRequestValidator {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRequestValidatorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRequestValidator(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the request validator. For example: `abc123` .
   *
   * @cloudformationAttribute RequestValidatorId
   */
  public readonly attrRequestValidatorId: string;

  /**
   * The name of this RequestValidator.
   */
  public name?: string;

  /**
   * The string identifier of the associated RestApi.
   */
  public restApiId: string;

  /**
   * A Boolean flag to indicate whether to validate a request body according to the configured Model schema.
   */
  public validateRequestBody?: boolean | cdk.IResolvable;

  /**
   * A Boolean flag to indicate whether to validate request parameters ( `true` ) or not ( `false` ).
   */
  public validateRequestParameters?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRequestValidatorProps) {
    super(scope, id, {
      "type": CfnRequestValidator.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "restApiId", this);

    this.attrRequestValidatorId = cdk.Token.asString(this.getAtt("RequestValidatorId", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.restApiId = props.restApiId;
    this.validateRequestBody = props.validateRequestBody;
    this.validateRequestParameters = props.validateRequestParameters;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "restApiId": this.restApiId,
      "validateRequestBody": this.validateRequestBody,
      "validateRequestParameters": this.validateRequestParameters
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRequestValidator.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRequestValidatorPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRequestValidator`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-requestvalidator.html
 */
export interface CfnRequestValidatorProps {
  /**
   * The name of this RequestValidator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-requestvalidator.html#cfn-apigateway-requestvalidator-name
   */
  readonly name?: string;

  /**
   * The string identifier of the associated RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-requestvalidator.html#cfn-apigateway-requestvalidator-restapiid
   */
  readonly restApiId: string;

  /**
   * A Boolean flag to indicate whether to validate a request body according to the configured Model schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-requestvalidator.html#cfn-apigateway-requestvalidator-validaterequestbody
   */
  readonly validateRequestBody?: boolean | cdk.IResolvable;

  /**
   * A Boolean flag to indicate whether to validate request parameters ( `true` ) or not ( `false` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-requestvalidator.html#cfn-apigateway-requestvalidator-validaterequestparameters
   */
  readonly validateRequestParameters?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnRequestValidatorProps`
 *
 * @param properties - the TypeScript properties of a `CfnRequestValidatorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRequestValidatorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("restApiId", cdk.requiredValidator)(properties.restApiId));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  errors.collect(cdk.propertyValidator("validateRequestBody", cdk.validateBoolean)(properties.validateRequestBody));
  errors.collect(cdk.propertyValidator("validateRequestParameters", cdk.validateBoolean)(properties.validateRequestParameters));
  return errors.wrap("supplied properties not correct for \"CfnRequestValidatorProps\"");
}

// @ts-ignore TS6133
function convertCfnRequestValidatorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRequestValidatorPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId),
    "ValidateRequestBody": cdk.booleanToCloudFormation(properties.validateRequestBody),
    "ValidateRequestParameters": cdk.booleanToCloudFormation(properties.validateRequestParameters)
  };
}

// @ts-ignore TS6133
function CfnRequestValidatorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRequestValidatorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRequestValidatorProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addPropertyResult("validateRequestBody", "ValidateRequestBody", (properties.ValidateRequestBody != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ValidateRequestBody) : undefined));
  ret.addPropertyResult("validateRequestParameters", "ValidateRequestParameters", (properties.ValidateRequestParameters != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ValidateRequestParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::Resource` resource creates a resource in an API.
 *
 * @cloudformationResource AWS::ApiGateway::Resource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-resource.html
 */
export class CfnResource extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::Resource";

  /**
   * Build a CfnResource from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResource {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourcePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResource(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the resource. For example: `abc123` .
   *
   * @cloudformationAttribute ResourceId
   */
  public readonly attrResourceId: string;

  /**
   * The parent resource's identifier.
   */
  public parentId: string;

  /**
   * The last path segment for this resource.
   */
  public pathPart: string;

  /**
   * The string identifier of the associated RestApi.
   */
  public restApiId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceProps) {
    super(scope, id, {
      "type": CfnResource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "parentId", this);
    cdk.requireProperty(props, "pathPart", this);
    cdk.requireProperty(props, "restApiId", this);

    this.attrResourceId = cdk.Token.asString(this.getAtt("ResourceId", cdk.ResolutionTypeHint.STRING));
    this.parentId = props.parentId;
    this.pathPart = props.pathPart;
    this.restApiId = props.restApiId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "parentId": this.parentId,
      "pathPart": this.pathPart,
      "restApiId": this.restApiId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourcePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-resource.html
 */
export interface CfnResourceProps {
  /**
   * The parent resource's identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-resource.html#cfn-apigateway-resource-parentid
   */
  readonly parentId: string;

  /**
   * The last path segment for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-resource.html#cfn-apigateway-resource-pathpart
   */
  readonly pathPart: string;

  /**
   * The string identifier of the associated RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-resource.html#cfn-apigateway-resource-restapiid
   */
  readonly restApiId: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parentId", cdk.requiredValidator)(properties.parentId));
  errors.collect(cdk.propertyValidator("parentId", cdk.validateString)(properties.parentId));
  errors.collect(cdk.propertyValidator("pathPart", cdk.requiredValidator)(properties.pathPart));
  errors.collect(cdk.propertyValidator("pathPart", cdk.validateString)(properties.pathPart));
  errors.collect(cdk.propertyValidator("restApiId", cdk.requiredValidator)(properties.restApiId));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  return errors.wrap("supplied properties not correct for \"CfnResourceProps\"");
}

// @ts-ignore TS6133
function convertCfnResourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourcePropsValidator(properties).assertSuccess();
  return {
    "ParentId": cdk.stringToCloudFormation(properties.parentId),
    "PathPart": cdk.stringToCloudFormation(properties.pathPart),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId)
  };
}

// @ts-ignore TS6133
function CfnResourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceProps>();
  ret.addPropertyResult("parentId", "ParentId", (properties.ParentId != null ? cfn_parse.FromCloudFormation.getString(properties.ParentId) : undefined));
  ret.addPropertyResult("pathPart", "PathPart", (properties.PathPart != null ? cfn_parse.FromCloudFormation.getString(properties.PathPart) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::RestApi` resource creates a REST API.
 *
 * For more information, see [restapi:create](https://docs.aws.amazon.com/apigateway/latest/api/API_CreateRestApi.html) in the *Amazon API Gateway REST API Reference* .
 *
 * > On January 1, 2016, the Swagger Specification was donated to the [OpenAPI initiative](https://docs.aws.amazon.com/https://www.openapis.org/) , becoming the foundation of the OpenAPI Specification.
 *
 * @cloudformationResource AWS::ApiGateway::RestApi
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html
 */
export class CfnRestApi extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::RestApi";

  /**
   * Build a CfnRestApi from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRestApi {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRestApiPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRestApi(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The string identifier of the associated RestApi.
   *
   * @cloudformationAttribute RestApiId
   */
  public readonly attrRestApiId: string;

  /**
   * The root resource ID for a `RestApi` resource, such as `a0bc123d4e` .
   *
   * @cloudformationAttribute RootResourceId
   */
  public readonly attrRootResourceId: string;

  /**
   * The source of the API key for metering requests according to a usage plan.
   */
  public apiKeySourceType?: string;

  /**
   * The list of binary media types supported by the RestApi.
   */
  public binaryMediaTypes?: Array<string>;

  /**
   * An OpenAPI specification that defines a set of RESTful APIs in JSON format.
   */
  public body?: any | cdk.IResolvable;

  /**
   * The Amazon Simple Storage Service (Amazon S3) location that points to an OpenAPI file, which defines a set of RESTful APIs in JSON or YAML format.
   */
  public bodyS3Location?: cdk.IResolvable | CfnRestApi.S3LocationProperty;

  /**
   * The ID of the RestApi that you want to clone from.
   */
  public cloneFrom?: string;

  /**
   * The description of the RestApi.
   */
  public description?: string;

  /**
   * Specifies whether clients can invoke your API by using the default `execute-api` endpoint.
   */
  public disableExecuteApiEndpoint?: boolean | cdk.IResolvable;

  /**
   * A list of the endpoint types of the API.
   */
  public endpointConfiguration?: CfnRestApi.EndpointConfigurationProperty | cdk.IResolvable;

  /**
   * A query parameter to indicate whether to rollback the API update ( `true` ) or not ( `false` ) when a warning is encountered.
   */
  public failOnWarnings?: boolean | cdk.IResolvable;

  /**
   * A nullable integer that is used to enable compression (with non-negative between 0 and 10485760 (10M) bytes, inclusive) or disable compression (with a null value) on an API.
   */
  public minimumCompressionSize?: number;

  /**
   * This property applies only when you use OpenAPI to define your REST API.
   */
  public mode?: string;

  /**
   * The name of the RestApi.
   */
  public name?: string;

  /**
   * Custom header parameters as part of the request.
   */
  public parameters?: cdk.IResolvable | Record<string, string>;

  /**
   * A policy document that contains the permissions for the `RestApi` resource.
   */
  public policy?: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The key-value map of strings.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRestApiProps = {}) {
    super(scope, id, {
      "type": CfnRestApi.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrRestApiId = cdk.Token.asString(this.getAtt("RestApiId", cdk.ResolutionTypeHint.STRING));
    this.attrRootResourceId = cdk.Token.asString(this.getAtt("RootResourceId", cdk.ResolutionTypeHint.STRING));
    this.apiKeySourceType = props.apiKeySourceType;
    this.binaryMediaTypes = props.binaryMediaTypes;
    this.body = props.body;
    this.bodyS3Location = props.bodyS3Location;
    this.cloneFrom = props.cloneFrom;
    this.description = props.description;
    this.disableExecuteApiEndpoint = props.disableExecuteApiEndpoint;
    this.endpointConfiguration = props.endpointConfiguration;
    this.failOnWarnings = props.failOnWarnings;
    this.minimumCompressionSize = props.minimumCompressionSize;
    this.mode = props.mode;
    this.name = props.name;
    this.parameters = props.parameters;
    this.policy = props.policy;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ApiGateway::RestApi", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiKeySourceType": this.apiKeySourceType,
      "binaryMediaTypes": this.binaryMediaTypes,
      "body": this.body,
      "bodyS3Location": this.bodyS3Location,
      "cloneFrom": this.cloneFrom,
      "description": this.description,
      "disableExecuteApiEndpoint": this.disableExecuteApiEndpoint,
      "endpointConfiguration": this.endpointConfiguration,
      "failOnWarnings": this.failOnWarnings,
      "minimumCompressionSize": this.minimumCompressionSize,
      "mode": this.mode,
      "name": this.name,
      "parameters": this.parameters,
      "policy": this.policy,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRestApi.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRestApiPropsToCloudFormation(props);
  }
}

export namespace CfnRestApi {
  /**
   * `S3Location` is a property of the [AWS::ApiGateway::RestApi](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html) resource that specifies the Amazon S3 location of a OpenAPI (formerly Swagger) file that defines a set of RESTful APIs in JSON or YAML.
   *
   * > On January 1, 2016, the Swagger Specification was donated to the [OpenAPI initiative](https://docs.aws.amazon.com/https://www.openapis.org/) , becoming the foundation of the OpenAPI Specification.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * The name of the S3 bucket where the OpenAPI file is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-s3location.html#cfn-apigateway-restapi-s3location-bucket
     */
    readonly bucket?: string;

    /**
     * The Amazon S3 ETag (a file checksum) of the OpenAPI file.
     *
     * If you don't specify a value, API Gateway skips ETag validation of your OpenAPI file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-s3location.html#cfn-apigateway-restapi-s3location-etag
     */
    readonly eTag?: string;

    /**
     * The file name of the OpenAPI file (Amazon S3 object name).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-s3location.html#cfn-apigateway-restapi-s3location-key
     */
    readonly key?: string;

    /**
     * For versioning-enabled buckets, a specific version of the OpenAPI file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-s3location.html#cfn-apigateway-restapi-s3location-version
     */
    readonly version?: string;
  }

  /**
   * The `EndpointConfiguration` property type specifies the endpoint types of a REST API.
   *
   * `EndpointConfiguration` is a property of the [AWS::ApiGateway::RestApi](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-endpointconfiguration.html
   */
  export interface EndpointConfigurationProperty {
    /**
     * A list of endpoint types of an API (RestApi) or its custom domain name (DomainName).
     *
     * For an edge-optimized API and its custom domain name, the endpoint type is `"EDGE"` . For a regional API and its custom domain name, the endpoint type is `REGIONAL` . For a private API, the endpoint type is `PRIVATE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-endpointconfiguration.html#cfn-apigateway-restapi-endpointconfiguration-types
     */
    readonly types?: Array<string>;

    /**
     * A list of VpcEndpointIds of an API (RestApi) against which to create Route53 ALIASes.
     *
     * It is only supported for `PRIVATE` endpoint type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-endpointconfiguration.html#cfn-apigateway-restapi-endpointconfiguration-vpcendpointids
     */
    readonly vpcEndpointIds?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnRestApi`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html
 */
export interface CfnRestApiProps {
  /**
   * The source of the API key for metering requests according to a usage plan.
   *
   * Valid values are: `HEADER` to read the API key from the `X-API-Key` header of a request. `AUTHORIZER` to read the API key from the `UsageIdentifierKey` from a custom authorizer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-apikeysourcetype
   */
  readonly apiKeySourceType?: string;

  /**
   * The list of binary media types supported by the RestApi.
   *
   * By default, the RestApi supports only UTF-8-encoded text payloads.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-binarymediatypes
   */
  readonly binaryMediaTypes?: Array<string>;

  /**
   * An OpenAPI specification that defines a set of RESTful APIs in JSON format.
   *
   * For YAML templates, you can also provide the specification in YAML format.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-body
   */
  readonly body?: any | cdk.IResolvable;

  /**
   * The Amazon Simple Storage Service (Amazon S3) location that points to an OpenAPI file, which defines a set of RESTful APIs in JSON or YAML format.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-bodys3location
   */
  readonly bodyS3Location?: cdk.IResolvable | CfnRestApi.S3LocationProperty;

  /**
   * The ID of the RestApi that you want to clone from.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-clonefrom
   */
  readonly cloneFrom?: string;

  /**
   * The description of the RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-description
   */
  readonly description?: string;

  /**
   * Specifies whether clients can invoke your API by using the default `execute-api` endpoint.
   *
   * By default, clients can invoke your API with the default `https://{api_id}.execute-api.{region}.amazonaws.com` endpoint. To require that clients use a custom domain name to invoke your API, disable the default endpoint
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-disableexecuteapiendpoint
   */
  readonly disableExecuteApiEndpoint?: boolean | cdk.IResolvable;

  /**
   * A list of the endpoint types of the API.
   *
   * Use this property when creating an API. When importing an existing API, specify the endpoint configuration types using the `Parameters` property.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-endpointconfiguration
   */
  readonly endpointConfiguration?: CfnRestApi.EndpointConfigurationProperty | cdk.IResolvable;

  /**
   * A query parameter to indicate whether to rollback the API update ( `true` ) or not ( `false` ) when a warning is encountered.
   *
   * The default value is `false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-failonwarnings
   */
  readonly failOnWarnings?: boolean | cdk.IResolvable;

  /**
   * A nullable integer that is used to enable compression (with non-negative between 0 and 10485760 (10M) bytes, inclusive) or disable compression (with a null value) on an API.
   *
   * When compression is enabled, compression or decompression is not applied on the payload if the payload size is smaller than this value. Setting it to zero allows compression for any payload size.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-minimumcompressionsize
   */
  readonly minimumCompressionSize?: number;

  /**
   * This property applies only when you use OpenAPI to define your REST API.
   *
   * The `Mode` determines how API Gateway handles resource updates.
   *
   * Valid values are `overwrite` or `merge` .
   *
   * For `overwrite` , the new API definition replaces the existing one. The existing API identifier remains unchanged.
   *
   * For `merge` , the new API definition is merged with the existing API.
   *
   * If you don't specify this property, a default value is chosen. For REST APIs created before March 29, 2021, the default is `overwrite` . For REST APIs created after March 29, 2021, the new API definition takes precedence, but any container types such as endpoint configurations and binary media types are merged with the existing API.
   *
   * Use the default mode to define top-level `RestApi` properties in addition to using OpenAPI. Generally, it's preferred to use API Gateway's OpenAPI extensions to model these properties.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-mode
   */
  readonly mode?: string;

  /**
   * The name of the RestApi.
   *
   * A name is required if the REST API is not based on an OpenAPI specification.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-name
   */
  readonly name?: string;

  /**
   * Custom header parameters as part of the request.
   *
   * For example, to exclude DocumentationParts from an imported API, set `ignore=documentation` as a `parameters` value, as in the AWS CLI command of `aws apigateway import-rest-api --parameters ignore=documentation --body 'file:///path/to/imported-api-body.json'` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-parameters
   */
  readonly parameters?: cdk.IResolvable | Record<string, string>;

  /**
   * A policy document that contains the permissions for the `RestApi` resource.
   *
   * To set the ARN for the policy, use the `!Join` intrinsic function with `""` as delimiter and values of `"execute-api:/"` and `"*"` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-policy
   */
  readonly policy?: any | cdk.IResolvable;

  /**
   * The key-value map of strings.
   *
   * The valid character set is [a-zA-Z+-=._:/]. The tag key can be up to 128 characters and must not start with `aws:` . The tag value can be up to 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRestApiS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("eTag", cdk.validateString)(properties.eTag));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRestApiS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRestApiS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "ETag": cdk.stringToCloudFormation(properties.eTag),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnRestApiS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRestApi.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRestApi.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("eTag", "ETag", (properties.ETag != null ? cfn_parse.FromCloudFormation.getString(properties.ETag) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EndpointConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRestApiEndpointConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("types", cdk.listValidator(cdk.validateString))(properties.types));
  errors.collect(cdk.propertyValidator("vpcEndpointIds", cdk.listValidator(cdk.validateString))(properties.vpcEndpointIds));
  return errors.wrap("supplied properties not correct for \"EndpointConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRestApiEndpointConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRestApiEndpointConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Types": cdk.listMapper(cdk.stringToCloudFormation)(properties.types),
    "VpcEndpointIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcEndpointIds)
  };
}

// @ts-ignore TS6133
function CfnRestApiEndpointConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRestApi.EndpointConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRestApi.EndpointConfigurationProperty>();
  ret.addPropertyResult("types", "Types", (properties.Types != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Types) : undefined));
  ret.addPropertyResult("vpcEndpointIds", "VpcEndpointIds", (properties.VpcEndpointIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcEndpointIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRestApiProps`
 *
 * @param properties - the TypeScript properties of a `CfnRestApiProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRestApiPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKeySourceType", cdk.validateString)(properties.apiKeySourceType));
  errors.collect(cdk.propertyValidator("binaryMediaTypes", cdk.listValidator(cdk.validateString))(properties.binaryMediaTypes));
  errors.collect(cdk.propertyValidator("body", cdk.validateObject)(properties.body));
  errors.collect(cdk.propertyValidator("bodyS3Location", CfnRestApiS3LocationPropertyValidator)(properties.bodyS3Location));
  errors.collect(cdk.propertyValidator("cloneFrom", cdk.validateString)(properties.cloneFrom));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("disableExecuteApiEndpoint", cdk.validateBoolean)(properties.disableExecuteApiEndpoint));
  errors.collect(cdk.propertyValidator("endpointConfiguration", CfnRestApiEndpointConfigurationPropertyValidator)(properties.endpointConfiguration));
  errors.collect(cdk.propertyValidator("failOnWarnings", cdk.validateBoolean)(properties.failOnWarnings));
  errors.collect(cdk.propertyValidator("minimumCompressionSize", cdk.validateNumber)(properties.minimumCompressionSize));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parameters", cdk.hashValidator(cdk.validateString))(properties.parameters));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRestApiProps\"");
}

// @ts-ignore TS6133
function convertCfnRestApiPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRestApiPropsValidator(properties).assertSuccess();
  return {
    "ApiKeySourceType": cdk.stringToCloudFormation(properties.apiKeySourceType),
    "BinaryMediaTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.binaryMediaTypes),
    "Body": cdk.objectToCloudFormation(properties.body),
    "BodyS3Location": convertCfnRestApiS3LocationPropertyToCloudFormation(properties.bodyS3Location),
    "CloneFrom": cdk.stringToCloudFormation(properties.cloneFrom),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisableExecuteApiEndpoint": cdk.booleanToCloudFormation(properties.disableExecuteApiEndpoint),
    "EndpointConfiguration": convertCfnRestApiEndpointConfigurationPropertyToCloudFormation(properties.endpointConfiguration),
    "FailOnWarnings": cdk.booleanToCloudFormation(properties.failOnWarnings),
    "MinimumCompressionSize": cdk.numberToCloudFormation(properties.minimumCompressionSize),
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Parameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
    "Policy": cdk.objectToCloudFormation(properties.policy),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRestApiPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRestApiProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRestApiProps>();
  ret.addPropertyResult("apiKeySourceType", "ApiKeySourceType", (properties.ApiKeySourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ApiKeySourceType) : undefined));
  ret.addPropertyResult("binaryMediaTypes", "BinaryMediaTypes", (properties.BinaryMediaTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.BinaryMediaTypes) : undefined));
  ret.addPropertyResult("body", "Body", (properties.Body != null ? cfn_parse.FromCloudFormation.getAny(properties.Body) : undefined));
  ret.addPropertyResult("bodyS3Location", "BodyS3Location", (properties.BodyS3Location != null ? CfnRestApiS3LocationPropertyFromCloudFormation(properties.BodyS3Location) : undefined));
  ret.addPropertyResult("cloneFrom", "CloneFrom", (properties.CloneFrom != null ? cfn_parse.FromCloudFormation.getString(properties.CloneFrom) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("disableExecuteApiEndpoint", "DisableExecuteApiEndpoint", (properties.DisableExecuteApiEndpoint != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableExecuteApiEndpoint) : undefined));
  ret.addPropertyResult("endpointConfiguration", "EndpointConfiguration", (properties.EndpointConfiguration != null ? CfnRestApiEndpointConfigurationPropertyFromCloudFormation(properties.EndpointConfiguration) : undefined));
  ret.addPropertyResult("failOnWarnings", "FailOnWarnings", (properties.FailOnWarnings != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FailOnWarnings) : undefined));
  ret.addPropertyResult("minimumCompressionSize", "MinimumCompressionSize", (properties.MinimumCompressionSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumCompressionSize) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::Stage` resource creates a stage for a deployment.
 *
 * @cloudformationResource AWS::ApiGateway::Stage
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html
 */
export class CfnStage extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::Stage";

  /**
   * Build a CfnStage from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStage {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStagePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStage(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Access log settings, including the access log format and access log destination ARN.
   */
  public accessLogSetting?: CfnStage.AccessLogSettingProperty | cdk.IResolvable;

  /**
   * Specifies whether a cache cluster is enabled for the stage.
   */
  public cacheClusterEnabled?: boolean | cdk.IResolvable;

  /**
   * The stage's cache capacity in GB.
   */
  public cacheClusterSize?: string;

  /**
   * Settings for the canary deployment in this stage.
   */
  public canarySetting?: CfnStage.CanarySettingProperty | cdk.IResolvable;

  /**
   * The identifier of a client certificate for an API stage.
   */
  public clientCertificateId?: string;

  /**
   * The identifier of the Deployment that the stage points to.
   */
  public deploymentId?: string;

  /**
   * The stage's description.
   */
  public description?: string;

  /**
   * The version of the associated API documentation.
   */
  public documentationVersion?: string;

  /**
   * A map that defines the method settings for a Stage resource.
   */
  public methodSettings?: Array<cdk.IResolvable | CfnStage.MethodSettingProperty> | cdk.IResolvable;

  /**
   * The string identifier of the associated RestApi.
   */
  public restApiId: string;

  /**
   * The name of the stage is the first path segment in the Uniform Resource Identifier (URI) of a call to API Gateway.
   */
  public stageName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The collection of tags.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Specifies whether active tracing with X-ray is enabled for the Stage.
   */
  public tracingEnabled?: boolean | cdk.IResolvable;

  /**
   * A map (string-to-string map) that defines the stage variables, where the variable name is the key and the variable value is the value.
   */
  public variables?: cdk.IResolvable | Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStageProps) {
    super(scope, id, {
      "type": CfnStage.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "restApiId", this);

    this.accessLogSetting = props.accessLogSetting;
    this.cacheClusterEnabled = props.cacheClusterEnabled;
    this.cacheClusterSize = props.cacheClusterSize;
    this.canarySetting = props.canarySetting;
    this.clientCertificateId = props.clientCertificateId;
    this.deploymentId = props.deploymentId;
    this.description = props.description;
    this.documentationVersion = props.documentationVersion;
    this.methodSettings = props.methodSettings;
    this.restApiId = props.restApiId;
    this.stageName = props.stageName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ApiGateway::Stage", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tracingEnabled = props.tracingEnabled;
    this.variables = props.variables;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessLogSetting": this.accessLogSetting,
      "cacheClusterEnabled": this.cacheClusterEnabled,
      "cacheClusterSize": this.cacheClusterSize,
      "canarySetting": this.canarySetting,
      "clientCertificateId": this.clientCertificateId,
      "deploymentId": this.deploymentId,
      "description": this.description,
      "documentationVersion": this.documentationVersion,
      "methodSettings": this.methodSettings,
      "restApiId": this.restApiId,
      "stageName": this.stageName,
      "tags": this.tags.renderTags(),
      "tracingEnabled": this.tracingEnabled,
      "variables": this.variables
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStage.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStagePropsToCloudFormation(props);
  }
}

export namespace CfnStage {
  /**
   * Configuration settings of a canary deployment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html
   */
  export interface CanarySettingProperty {
    /**
     * The ID of the canary deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-deploymentid
     */
    readonly deploymentId?: string;

    /**
     * The percent (0-100) of traffic diverted to a canary deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-percenttraffic
     */
    readonly percentTraffic?: number;

    /**
     * Stage variables overridden for a canary release deployment, including new stage variables introduced in the canary.
     *
     * These stage variables are represented as a string-to-string map between stage variable names and their values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-stagevariableoverrides
     */
    readonly stageVariableOverrides?: cdk.IResolvable | Record<string, string>;

    /**
     * A Boolean flag to indicate whether the canary deployment uses the stage cache or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-usestagecache
     */
    readonly useStageCache?: boolean | cdk.IResolvable;
  }

  /**
   * The `MethodSetting` property type configures settings for all methods in a stage.
   *
   * The `MethodSettings` property of the `AWS::ApiGateway::Stage` resource contains a list of `MethodSetting` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-methodsetting.html
   */
  export interface MethodSettingProperty {
    /**
     * Specifies whether the cached responses are encrypted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-methodsetting.html#cfn-apigateway-stage-methodsetting-cachedataencrypted
     */
    readonly cacheDataEncrypted?: boolean | cdk.IResolvable;

    /**
     * Specifies the time to live (TTL), in seconds, for cached responses.
     *
     * The higher the TTL, the longer the response will be cached.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-methodsetting.html#cfn-apigateway-stage-methodsetting-cachettlinseconds
     */
    readonly cacheTtlInSeconds?: number;

    /**
     * Specifies whether responses should be cached and returned for requests.
     *
     * A cache cluster must be enabled on the stage for responses to be cached.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-methodsetting.html#cfn-apigateway-stage-methodsetting-cachingenabled
     */
    readonly cachingEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies whether data trace logging is enabled for this method, which affects the log entries pushed to Amazon CloudWatch Logs.
     *
     * This can be useful to troubleshoot APIs, but can result in logging sensitive data. We recommend that you don't enable this option for production APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-methodsetting.html#cfn-apigateway-stage-methodsetting-datatraceenabled
     */
    readonly dataTraceEnabled?: boolean | cdk.IResolvable;

    /**
     * The HTTP method.
     *
     * To apply settings to multiple resources and methods, specify an asterisk ( `*` ) for the `HttpMethod` and `/*` for the `ResourcePath` . This parameter is required when you specify a `MethodSetting` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-methodsetting.html#cfn-apigateway-stage-methodsetting-httpmethod
     */
    readonly httpMethod?: string;

    /**
     * Specifies the logging level for this method, which affects the log entries pushed to Amazon CloudWatch Logs.
     *
     * Valid values are `OFF` , `ERROR` , and `INFO` . Choose `ERROR` to write only error-level entries to CloudWatch Logs, or choose `INFO` to include all `ERROR` events as well as extra informational events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-methodsetting.html#cfn-apigateway-stage-methodsetting-logginglevel
     */
    readonly loggingLevel?: string;

    /**
     * Specifies whether Amazon CloudWatch metrics are enabled for this method.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-methodsetting.html#cfn-apigateway-stage-methodsetting-metricsenabled
     */
    readonly metricsEnabled?: boolean | cdk.IResolvable;

    /**
     * The resource path for this method.
     *
     * Forward slashes ( `/` ) are encoded as `~1` and the initial slash must include a forward slash. For example, the path value `/resource/subresource` must be encoded as `/~1resource~1subresource` . To specify the root path, use only a slash ( `/` ). To apply settings to multiple resources and methods, specify an asterisk ( `*` ) for the `HttpMethod` and `/*` for the `ResourcePath` . This parameter is required when you specify a `MethodSetting` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-methodsetting.html#cfn-apigateway-stage-methodsetting-resourcepath
     */
    readonly resourcePath?: string;

    /**
     * Specifies the throttling burst limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-methodsetting.html#cfn-apigateway-stage-methodsetting-throttlingburstlimit
     */
    readonly throttlingBurstLimit?: number;

    /**
     * Specifies the throttling rate limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-methodsetting.html#cfn-apigateway-stage-methodsetting-throttlingratelimit
     */
    readonly throttlingRateLimit?: number;
  }

  /**
   * The `AccessLogSetting` property type specifies settings for logging access in this stage.
   *
   * `AccessLogSetting` is a property of the [AWS::ApiGateway::Stage](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html
   */
  export interface AccessLogSettingProperty {
    /**
     * The Amazon Resource Name (ARN) of the CloudWatch Logs log group or Kinesis Data Firehose delivery stream to receive access logs.
     *
     * If you specify a Kinesis Data Firehose delivery stream, the stream name must begin with `amazon-apigateway-` . This parameter is required to enable access logging.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html#cfn-apigateway-stage-accesslogsetting-destinationarn
     */
    readonly destinationArn?: string;

    /**
     * A single line format of the access logs of data, as specified by selected [$context variables](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference) . The format must include at least `$context.requestId` . This parameter is required to enable access logging.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html#cfn-apigateway-stage-accesslogsetting-format
     */
    readonly format?: string;
  }
}

/**
 * Properties for defining a `CfnStage`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html
 */
export interface CfnStageProps {
  /**
   * Access log settings, including the access log format and access log destination ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-accesslogsetting
   */
  readonly accessLogSetting?: CfnStage.AccessLogSettingProperty | cdk.IResolvable;

  /**
   * Specifies whether a cache cluster is enabled for the stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-cacheclusterenabled
   */
  readonly cacheClusterEnabled?: boolean | cdk.IResolvable;

  /**
   * The stage's cache capacity in GB.
   *
   * For more information about choosing a cache size, see [Enabling API caching to enhance responsiveness](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-cacheclustersize
   */
  readonly cacheClusterSize?: string;

  /**
   * Settings for the canary deployment in this stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-canarysetting
   */
  readonly canarySetting?: CfnStage.CanarySettingProperty | cdk.IResolvable;

  /**
   * The identifier of a client certificate for an API stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-clientcertificateid
   */
  readonly clientCertificateId?: string;

  /**
   * The identifier of the Deployment that the stage points to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-deploymentid
   */
  readonly deploymentId?: string;

  /**
   * The stage's description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-description
   */
  readonly description?: string;

  /**
   * The version of the associated API documentation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-documentationversion
   */
  readonly documentationVersion?: string;

  /**
   * A map that defines the method settings for a Stage resource.
   *
   * Keys (designated as `/{method_setting_key` below) are method paths defined as `{resource_path}/{http_method}` for an individual method override, or `/\* /\*` for overriding all methods in the stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-methodsettings
   */
  readonly methodSettings?: Array<cdk.IResolvable | CfnStage.MethodSettingProperty> | cdk.IResolvable;

  /**
   * The string identifier of the associated RestApi.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-restapiid
   */
  readonly restApiId: string;

  /**
   * The name of the stage is the first path segment in the Uniform Resource Identifier (URI) of a call to API Gateway.
   *
   * Stage names can only contain alphanumeric characters, hyphens, and underscores. Maximum length is 128 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-stagename
   */
  readonly stageName?: string;

  /**
   * The collection of tags.
   *
   * Each tag element is associated with a given resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Specifies whether active tracing with X-ray is enabled for the Stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-tracingenabled
   */
  readonly tracingEnabled?: boolean | cdk.IResolvable;

  /**
   * A map (string-to-string map) that defines the stage variables, where the variable name is the key and the variable value is the value.
   *
   * Variable names are limited to alphanumeric characters. Values must match the following regular expression: `[A-Za-z0-9-._~:/?#&=,]+` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html#cfn-apigateway-stage-variables
   */
  readonly variables?: cdk.IResolvable | Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CanarySettingProperty`
 *
 * @param properties - the TypeScript properties of a `CanarySettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStageCanarySettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deploymentId", cdk.validateString)(properties.deploymentId));
  errors.collect(cdk.propertyValidator("percentTraffic", cdk.validateNumber)(properties.percentTraffic));
  errors.collect(cdk.propertyValidator("stageVariableOverrides", cdk.hashValidator(cdk.validateString))(properties.stageVariableOverrides));
  errors.collect(cdk.propertyValidator("useStageCache", cdk.validateBoolean)(properties.useStageCache));
  return errors.wrap("supplied properties not correct for \"CanarySettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnStageCanarySettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStageCanarySettingPropertyValidator(properties).assertSuccess();
  return {
    "DeploymentId": cdk.stringToCloudFormation(properties.deploymentId),
    "PercentTraffic": cdk.numberToCloudFormation(properties.percentTraffic),
    "StageVariableOverrides": cdk.hashMapper(cdk.stringToCloudFormation)(properties.stageVariableOverrides),
    "UseStageCache": cdk.booleanToCloudFormation(properties.useStageCache)
  };
}

// @ts-ignore TS6133
function CfnStageCanarySettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStage.CanarySettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStage.CanarySettingProperty>();
  ret.addPropertyResult("deploymentId", "DeploymentId", (properties.DeploymentId != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentId) : undefined));
  ret.addPropertyResult("percentTraffic", "PercentTraffic", (properties.PercentTraffic != null ? cfn_parse.FromCloudFormation.getNumber(properties.PercentTraffic) : undefined));
  ret.addPropertyResult("stageVariableOverrides", "StageVariableOverrides", (properties.StageVariableOverrides != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.StageVariableOverrides) : undefined));
  ret.addPropertyResult("useStageCache", "UseStageCache", (properties.UseStageCache != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseStageCache) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MethodSettingProperty`
 *
 * @param properties - the TypeScript properties of a `MethodSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStageMethodSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cacheDataEncrypted", cdk.validateBoolean)(properties.cacheDataEncrypted));
  errors.collect(cdk.propertyValidator("cacheTtlInSeconds", cdk.validateNumber)(properties.cacheTtlInSeconds));
  errors.collect(cdk.propertyValidator("cachingEnabled", cdk.validateBoolean)(properties.cachingEnabled));
  errors.collect(cdk.propertyValidator("dataTraceEnabled", cdk.validateBoolean)(properties.dataTraceEnabled));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.validateString)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("loggingLevel", cdk.validateString)(properties.loggingLevel));
  errors.collect(cdk.propertyValidator("metricsEnabled", cdk.validateBoolean)(properties.metricsEnabled));
  errors.collect(cdk.propertyValidator("resourcePath", cdk.validateString)(properties.resourcePath));
  errors.collect(cdk.propertyValidator("throttlingBurstLimit", cdk.validateNumber)(properties.throttlingBurstLimit));
  errors.collect(cdk.propertyValidator("throttlingRateLimit", cdk.validateNumber)(properties.throttlingRateLimit));
  return errors.wrap("supplied properties not correct for \"MethodSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnStageMethodSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStageMethodSettingPropertyValidator(properties).assertSuccess();
  return {
    "CacheDataEncrypted": cdk.booleanToCloudFormation(properties.cacheDataEncrypted),
    "CacheTtlInSeconds": cdk.numberToCloudFormation(properties.cacheTtlInSeconds),
    "CachingEnabled": cdk.booleanToCloudFormation(properties.cachingEnabled),
    "DataTraceEnabled": cdk.booleanToCloudFormation(properties.dataTraceEnabled),
    "HttpMethod": cdk.stringToCloudFormation(properties.httpMethod),
    "LoggingLevel": cdk.stringToCloudFormation(properties.loggingLevel),
    "MetricsEnabled": cdk.booleanToCloudFormation(properties.metricsEnabled),
    "ResourcePath": cdk.stringToCloudFormation(properties.resourcePath),
    "ThrottlingBurstLimit": cdk.numberToCloudFormation(properties.throttlingBurstLimit),
    "ThrottlingRateLimit": cdk.numberToCloudFormation(properties.throttlingRateLimit)
  };
}

// @ts-ignore TS6133
function CfnStageMethodSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStage.MethodSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStage.MethodSettingProperty>();
  ret.addPropertyResult("cacheDataEncrypted", "CacheDataEncrypted", (properties.CacheDataEncrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CacheDataEncrypted) : undefined));
  ret.addPropertyResult("cacheTtlInSeconds", "CacheTtlInSeconds", (properties.CacheTtlInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.CacheTtlInSeconds) : undefined));
  ret.addPropertyResult("cachingEnabled", "CachingEnabled", (properties.CachingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CachingEnabled) : undefined));
  ret.addPropertyResult("dataTraceEnabled", "DataTraceEnabled", (properties.DataTraceEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataTraceEnabled) : undefined));
  ret.addPropertyResult("httpMethod", "HttpMethod", (properties.HttpMethod != null ? cfn_parse.FromCloudFormation.getString(properties.HttpMethod) : undefined));
  ret.addPropertyResult("loggingLevel", "LoggingLevel", (properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined));
  ret.addPropertyResult("metricsEnabled", "MetricsEnabled", (properties.MetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MetricsEnabled) : undefined));
  ret.addPropertyResult("resourcePath", "ResourcePath", (properties.ResourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.ResourcePath) : undefined));
  ret.addPropertyResult("throttlingBurstLimit", "ThrottlingBurstLimit", (properties.ThrottlingBurstLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingBurstLimit) : undefined));
  ret.addPropertyResult("throttlingRateLimit", "ThrottlingRateLimit", (properties.ThrottlingRateLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingRateLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStageAccessLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  return errors.wrap("supplied properties not correct for \"AccessLogSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnStageAccessLogSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStageAccessLogSettingPropertyValidator(properties).assertSuccess();
  return {
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn),
    "Format": cdk.stringToCloudFormation(properties.format)
  };
}

// @ts-ignore TS6133
function CfnStageAccessLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStage.AccessLogSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStage.AccessLogSettingProperty>();
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStageProps`
 *
 * @param properties - the TypeScript properties of a `CfnStageProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStagePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessLogSetting", CfnStageAccessLogSettingPropertyValidator)(properties.accessLogSetting));
  errors.collect(cdk.propertyValidator("cacheClusterEnabled", cdk.validateBoolean)(properties.cacheClusterEnabled));
  errors.collect(cdk.propertyValidator("cacheClusterSize", cdk.validateString)(properties.cacheClusterSize));
  errors.collect(cdk.propertyValidator("canarySetting", CfnStageCanarySettingPropertyValidator)(properties.canarySetting));
  errors.collect(cdk.propertyValidator("clientCertificateId", cdk.validateString)(properties.clientCertificateId));
  errors.collect(cdk.propertyValidator("deploymentId", cdk.validateString)(properties.deploymentId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("documentationVersion", cdk.validateString)(properties.documentationVersion));
  errors.collect(cdk.propertyValidator("methodSettings", cdk.listValidator(CfnStageMethodSettingPropertyValidator))(properties.methodSettings));
  errors.collect(cdk.propertyValidator("restApiId", cdk.requiredValidator)(properties.restApiId));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  errors.collect(cdk.propertyValidator("stageName", cdk.validateString)(properties.stageName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("tracingEnabled", cdk.validateBoolean)(properties.tracingEnabled));
  errors.collect(cdk.propertyValidator("variables", cdk.hashValidator(cdk.validateString))(properties.variables));
  return errors.wrap("supplied properties not correct for \"CfnStageProps\"");
}

// @ts-ignore TS6133
function convertCfnStagePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStagePropsValidator(properties).assertSuccess();
  return {
    "AccessLogSetting": convertCfnStageAccessLogSettingPropertyToCloudFormation(properties.accessLogSetting),
    "CacheClusterEnabled": cdk.booleanToCloudFormation(properties.cacheClusterEnabled),
    "CacheClusterSize": cdk.stringToCloudFormation(properties.cacheClusterSize),
    "CanarySetting": convertCfnStageCanarySettingPropertyToCloudFormation(properties.canarySetting),
    "ClientCertificateId": cdk.stringToCloudFormation(properties.clientCertificateId),
    "DeploymentId": cdk.stringToCloudFormation(properties.deploymentId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DocumentationVersion": cdk.stringToCloudFormation(properties.documentationVersion),
    "MethodSettings": cdk.listMapper(convertCfnStageMethodSettingPropertyToCloudFormation)(properties.methodSettings),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId),
    "StageName": cdk.stringToCloudFormation(properties.stageName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TracingEnabled": cdk.booleanToCloudFormation(properties.tracingEnabled),
    "Variables": cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables)
  };
}

// @ts-ignore TS6133
function CfnStagePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStageProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStageProps>();
  ret.addPropertyResult("accessLogSetting", "AccessLogSetting", (properties.AccessLogSetting != null ? CfnStageAccessLogSettingPropertyFromCloudFormation(properties.AccessLogSetting) : undefined));
  ret.addPropertyResult("cacheClusterEnabled", "CacheClusterEnabled", (properties.CacheClusterEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CacheClusterEnabled) : undefined));
  ret.addPropertyResult("cacheClusterSize", "CacheClusterSize", (properties.CacheClusterSize != null ? cfn_parse.FromCloudFormation.getString(properties.CacheClusterSize) : undefined));
  ret.addPropertyResult("canarySetting", "CanarySetting", (properties.CanarySetting != null ? CfnStageCanarySettingPropertyFromCloudFormation(properties.CanarySetting) : undefined));
  ret.addPropertyResult("clientCertificateId", "ClientCertificateId", (properties.ClientCertificateId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientCertificateId) : undefined));
  ret.addPropertyResult("deploymentId", "DeploymentId", (properties.DeploymentId != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("documentationVersion", "DocumentationVersion", (properties.DocumentationVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentationVersion) : undefined));
  ret.addPropertyResult("methodSettings", "MethodSettings", (properties.MethodSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnStageMethodSettingPropertyFromCloudFormation)(properties.MethodSettings) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addPropertyResult("stageName", "StageName", (properties.StageName != null ? cfn_parse.FromCloudFormation.getString(properties.StageName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("tracingEnabled", "TracingEnabled", (properties.TracingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TracingEnabled) : undefined));
  ret.addPropertyResult("variables", "Variables", (properties.Variables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Variables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::UsagePlan` resource creates a usage plan for deployed APIs.
 *
 * A usage plan sets a target for the throttling and quota limits on individual client API keys. For more information, see [Creating and Using API Usage Plans in Amazon API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html) in the *API Gateway Developer Guide* .
 *
 * In some cases clients can exceed the targets that you set. Don’t rely on usage plans to control costs. Consider using [AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) to monitor costs and [AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) to manage API requests.
 *
 * @cloudformationResource AWS::ApiGateway::UsagePlan
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html
 */
export class CfnUsagePlan extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::UsagePlan";

  /**
   * Build a CfnUsagePlan from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUsagePlan {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUsagePlanPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUsagePlan(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the usage plan. For example: `abc123` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The associated API stages of a usage plan.
   */
  public apiStages?: Array<CfnUsagePlan.ApiStageProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of a usage plan.
   */
  public description?: string;

  /**
   * The target maximum number of permitted requests per a given unit time interval.
   */
  public quota?: cdk.IResolvable | CfnUsagePlan.QuotaSettingsProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The collection of tags.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A map containing method level throttling information for API stage in a usage plan.
   */
  public throttle?: cdk.IResolvable | CfnUsagePlan.ThrottleSettingsProperty;

  /**
   * The name of a usage plan.
   */
  public usagePlanName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUsagePlanProps = {}) {
    super(scope, id, {
      "type": CfnUsagePlan.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.apiStages = props.apiStages;
    this.description = props.description;
    this.quota = props.quota;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ApiGateway::UsagePlan", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.throttle = props.throttle;
    this.usagePlanName = props.usagePlanName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiStages": this.apiStages,
      "description": this.description,
      "quota": this.quota,
      "tags": this.tags.renderTags(),
      "throttle": this.throttle,
      "usagePlanName": this.usagePlanName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUsagePlan.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUsagePlanPropsToCloudFormation(props);
  }
}

export namespace CfnUsagePlan {
  /**
   * `QuotaSettings` is a property of the [AWS::ApiGateway::UsagePlan](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html) resource that specifies a target for the maximum number of requests users can make to your REST APIs.
   *
   * In some cases clients can exceed the targets that you set. Don’t rely on usage plans to control costs. Consider using [AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) to monitor costs and [AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html) to manage API requests.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html
   */
  export interface QuotaSettingsProperty {
    /**
     * The target maximum number of requests that can be made in a given time period.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html#cfn-apigateway-usageplan-quotasettings-limit
     */
    readonly limit?: number;

    /**
     * The number of requests subtracted from the given limit in the initial time period.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html#cfn-apigateway-usageplan-quotasettings-offset
     */
    readonly offset?: number;

    /**
     * The time period in which the limit applies.
     *
     * Valid values are "DAY", "WEEK" or "MONTH".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html#cfn-apigateway-usageplan-quotasettings-period
     */
    readonly period?: string;
  }

  /**
   * API stage name of the associated API stage in a usage plan.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-apistage.html
   */
  export interface ApiStageProperty {
    /**
     * API Id of the associated API stage in a usage plan.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-apistage.html#cfn-apigateway-usageplan-apistage-apiid
     */
    readonly apiId?: string;

    /**
     * API stage name of the associated API stage in a usage plan.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-apistage.html#cfn-apigateway-usageplan-apistage-stage
     */
    readonly stage?: string;

    /**
     * Map containing method level throttling information for API stage in a usage plan.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-apistage.html#cfn-apigateway-usageplan-apistage-throttle
     */
    readonly throttle?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnUsagePlan.ThrottleSettingsProperty>;
  }

  /**
   * `ThrottleSettings` is a property of the [AWS::ApiGateway::UsagePlan](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html) resource that specifies the overall request rate (average requests per second) and burst capacity when users call your REST APIs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-throttlesettings.html
   */
  export interface ThrottleSettingsProperty {
    /**
     * The API target request burst rate limit.
     *
     * This allows more requests through for a period of time than the target rate limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-throttlesettings.html#cfn-apigateway-usageplan-throttlesettings-burstlimit
     */
    readonly burstLimit?: number;

    /**
     * The API target request rate limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-throttlesettings.html#cfn-apigateway-usageplan-throttlesettings-ratelimit
     */
    readonly rateLimit?: number;
  }
}

/**
 * Properties for defining a `CfnUsagePlan`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html
 */
export interface CfnUsagePlanProps {
  /**
   * The associated API stages of a usage plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html#cfn-apigateway-usageplan-apistages
   */
  readonly apiStages?: Array<CfnUsagePlan.ApiStageProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of a usage plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html#cfn-apigateway-usageplan-description
   */
  readonly description?: string;

  /**
   * The target maximum number of permitted requests per a given unit time interval.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html#cfn-apigateway-usageplan-quota
   */
  readonly quota?: cdk.IResolvable | CfnUsagePlan.QuotaSettingsProperty;

  /**
   * The collection of tags.
   *
   * Each tag element is associated with a given resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html#cfn-apigateway-usageplan-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A map containing method level throttling information for API stage in a usage plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html#cfn-apigateway-usageplan-throttle
   */
  readonly throttle?: cdk.IResolvable | CfnUsagePlan.ThrottleSettingsProperty;

  /**
   * The name of a usage plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplan.html#cfn-apigateway-usageplan-usageplanname
   */
  readonly usagePlanName?: string;
}

/**
 * Determine whether the given properties match those of a `QuotaSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `QuotaSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUsagePlanQuotaSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("limit", cdk.validateNumber)(properties.limit));
  errors.collect(cdk.propertyValidator("offset", cdk.validateNumber)(properties.offset));
  errors.collect(cdk.propertyValidator("period", cdk.validateString)(properties.period));
  return errors.wrap("supplied properties not correct for \"QuotaSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnUsagePlanQuotaSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUsagePlanQuotaSettingsPropertyValidator(properties).assertSuccess();
  return {
    "Limit": cdk.numberToCloudFormation(properties.limit),
    "Offset": cdk.numberToCloudFormation(properties.offset),
    "Period": cdk.stringToCloudFormation(properties.period)
  };
}

// @ts-ignore TS6133
function CfnUsagePlanQuotaSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUsagePlan.QuotaSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUsagePlan.QuotaSettingsProperty>();
  ret.addPropertyResult("limit", "Limit", (properties.Limit != null ? cfn_parse.FromCloudFormation.getNumber(properties.Limit) : undefined));
  ret.addPropertyResult("offset", "Offset", (properties.Offset != null ? cfn_parse.FromCloudFormation.getNumber(properties.Offset) : undefined));
  ret.addPropertyResult("period", "Period", (properties.Period != null ? cfn_parse.FromCloudFormation.getString(properties.Period) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ThrottleSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ThrottleSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUsagePlanThrottleSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("burstLimit", cdk.validateNumber)(properties.burstLimit));
  errors.collect(cdk.propertyValidator("rateLimit", cdk.validateNumber)(properties.rateLimit));
  return errors.wrap("supplied properties not correct for \"ThrottleSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnUsagePlanThrottleSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUsagePlanThrottleSettingsPropertyValidator(properties).assertSuccess();
  return {
    "BurstLimit": cdk.numberToCloudFormation(properties.burstLimit),
    "RateLimit": cdk.numberToCloudFormation(properties.rateLimit)
  };
}

// @ts-ignore TS6133
function CfnUsagePlanThrottleSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUsagePlan.ThrottleSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUsagePlan.ThrottleSettingsProperty>();
  ret.addPropertyResult("burstLimit", "BurstLimit", (properties.BurstLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.BurstLimit) : undefined));
  ret.addPropertyResult("rateLimit", "RateLimit", (properties.RateLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.RateLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApiStageProperty`
 *
 * @param properties - the TypeScript properties of a `ApiStageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUsagePlanApiStagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("stage", cdk.validateString)(properties.stage));
  errors.collect(cdk.propertyValidator("throttle", cdk.hashValidator(CfnUsagePlanThrottleSettingsPropertyValidator))(properties.throttle));
  return errors.wrap("supplied properties not correct for \"ApiStageProperty\"");
}

// @ts-ignore TS6133
function convertCfnUsagePlanApiStagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUsagePlanApiStagePropertyValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "Stage": cdk.stringToCloudFormation(properties.stage),
    "Throttle": cdk.hashMapper(convertCfnUsagePlanThrottleSettingsPropertyToCloudFormation)(properties.throttle)
  };
}

// @ts-ignore TS6133
function CfnUsagePlanApiStagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUsagePlan.ApiStageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUsagePlan.ApiStageProperty>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("stage", "Stage", (properties.Stage != null ? cfn_parse.FromCloudFormation.getString(properties.Stage) : undefined));
  ret.addPropertyResult("throttle", "Throttle", (properties.Throttle != null ? cfn_parse.FromCloudFormation.getMap(CfnUsagePlanThrottleSettingsPropertyFromCloudFormation)(properties.Throttle) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnUsagePlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnUsagePlanProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUsagePlanPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiStages", cdk.listValidator(CfnUsagePlanApiStagePropertyValidator))(properties.apiStages));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("quota", CfnUsagePlanQuotaSettingsPropertyValidator)(properties.quota));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("throttle", CfnUsagePlanThrottleSettingsPropertyValidator)(properties.throttle));
  errors.collect(cdk.propertyValidator("usagePlanName", cdk.validateString)(properties.usagePlanName));
  return errors.wrap("supplied properties not correct for \"CfnUsagePlanProps\"");
}

// @ts-ignore TS6133
function convertCfnUsagePlanPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUsagePlanPropsValidator(properties).assertSuccess();
  return {
    "ApiStages": cdk.listMapper(convertCfnUsagePlanApiStagePropertyToCloudFormation)(properties.apiStages),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Quota": convertCfnUsagePlanQuotaSettingsPropertyToCloudFormation(properties.quota),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Throttle": convertCfnUsagePlanThrottleSettingsPropertyToCloudFormation(properties.throttle),
    "UsagePlanName": cdk.stringToCloudFormation(properties.usagePlanName)
  };
}

// @ts-ignore TS6133
function CfnUsagePlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUsagePlanProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUsagePlanProps>();
  ret.addPropertyResult("apiStages", "ApiStages", (properties.ApiStages != null ? cfn_parse.FromCloudFormation.getArray(CfnUsagePlanApiStagePropertyFromCloudFormation)(properties.ApiStages) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("quota", "Quota", (properties.Quota != null ? CfnUsagePlanQuotaSettingsPropertyFromCloudFormation(properties.Quota) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("throttle", "Throttle", (properties.Throttle != null ? CfnUsagePlanThrottleSettingsPropertyFromCloudFormation(properties.Throttle) : undefined));
  ret.addPropertyResult("usagePlanName", "UsagePlanName", (properties.UsagePlanName != null ? cfn_parse.FromCloudFormation.getString(properties.UsagePlanName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::UsagePlanKey` resource associates an API key with a usage plan.
 *
 * This association determines which users the usage plan is applied to.
 *
 * @cloudformationResource AWS::ApiGateway::UsagePlanKey
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplankey.html
 */
export class CfnUsagePlanKey extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::UsagePlanKey";

  /**
   * Build a CfnUsagePlanKey from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUsagePlanKey {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUsagePlanKeyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUsagePlanKey(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the usage plan key. For example: `abc123` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Id of the UsagePlanKey resource.
   */
  public keyId: string;

  /**
   * The type of a UsagePlanKey resource for a plan customer.
   */
  public keyType: string;

  /**
   * The Id of the UsagePlan resource representing the usage plan containing the UsagePlanKey resource representing a plan customer.
   */
  public usagePlanId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUsagePlanKeyProps) {
    super(scope, id, {
      "type": CfnUsagePlanKey.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "keyId", this);
    cdk.requireProperty(props, "keyType", this);
    cdk.requireProperty(props, "usagePlanId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.keyId = props.keyId;
    this.keyType = props.keyType;
    this.usagePlanId = props.usagePlanId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "keyId": this.keyId,
      "keyType": this.keyType,
      "usagePlanId": this.usagePlanId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUsagePlanKey.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUsagePlanKeyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnUsagePlanKey`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplankey.html
 */
export interface CfnUsagePlanKeyProps {
  /**
   * The Id of the UsagePlanKey resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplankey.html#cfn-apigateway-usageplankey-keyid
   */
  readonly keyId: string;

  /**
   * The type of a UsagePlanKey resource for a plan customer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplankey.html#cfn-apigateway-usageplankey-keytype
   */
  readonly keyType: string;

  /**
   * The Id of the UsagePlan resource representing the usage plan containing the UsagePlanKey resource representing a plan customer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-usageplankey.html#cfn-apigateway-usageplankey-usageplanid
   */
  readonly usagePlanId: string;
}

/**
 * Determine whether the given properties match those of a `CfnUsagePlanKeyProps`
 *
 * @param properties - the TypeScript properties of a `CfnUsagePlanKeyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUsagePlanKeyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyId", cdk.requiredValidator)(properties.keyId));
  errors.collect(cdk.propertyValidator("keyId", cdk.validateString)(properties.keyId));
  errors.collect(cdk.propertyValidator("keyType", cdk.requiredValidator)(properties.keyType));
  errors.collect(cdk.propertyValidator("keyType", cdk.validateString)(properties.keyType));
  errors.collect(cdk.propertyValidator("usagePlanId", cdk.requiredValidator)(properties.usagePlanId));
  errors.collect(cdk.propertyValidator("usagePlanId", cdk.validateString)(properties.usagePlanId));
  return errors.wrap("supplied properties not correct for \"CfnUsagePlanKeyProps\"");
}

// @ts-ignore TS6133
function convertCfnUsagePlanKeyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUsagePlanKeyPropsValidator(properties).assertSuccess();
  return {
    "KeyId": cdk.stringToCloudFormation(properties.keyId),
    "KeyType": cdk.stringToCloudFormation(properties.keyType),
    "UsagePlanId": cdk.stringToCloudFormation(properties.usagePlanId)
  };
}

// @ts-ignore TS6133
function CfnUsagePlanKeyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUsagePlanKeyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUsagePlanKeyProps>();
  ret.addPropertyResult("keyId", "KeyId", (properties.KeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KeyId) : undefined));
  ret.addPropertyResult("keyType", "KeyType", (properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined));
  ret.addPropertyResult("usagePlanId", "UsagePlanId", (properties.UsagePlanId != null ? cfn_parse.FromCloudFormation.getString(properties.UsagePlanId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGateway::VpcLink` resource creates an API Gateway VPC link for a REST API to access resources in an Amazon Virtual Private Cloud (VPC).
 *
 * For more information, see [vpclink:create](https://docs.aws.amazon.com/apigateway/latest/api/API_CreateVpcLink.html) in the `Amazon API Gateway REST API Reference` .
 *
 * @cloudformationResource AWS::ApiGateway::VpcLink
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-vpclink.html
 */
export class CfnVpcLink extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGateway::VpcLink";

  /**
   * Build a CfnVpcLink from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVpcLink {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVpcLinkPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVpcLink(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the VPC link. For example: `abc123` .
   *
   * @cloudformationAttribute VpcLinkId
   */
  public readonly attrVpcLinkId: string;

  /**
   * The description of the VPC link.
   */
  public description?: string;

  /**
   * The name used to label and identify the VPC link.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of arbitrary tags (key-value pairs) to associate with the VPC link.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN of the network load balancer of the VPC targeted by the VPC link.
   */
  public targetArns: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVpcLinkProps) {
    super(scope, id, {
      "type": CfnVpcLink.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "targetArns", this);

    this.attrVpcLinkId = cdk.Token.asString(this.getAtt("VpcLinkId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ApiGateway::VpcLink", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetArns = props.targetArns;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "targetArns": this.targetArns
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVpcLink.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVpcLinkPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnVpcLink`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-vpclink.html
 */
export interface CfnVpcLinkProps {
  /**
   * The description of the VPC link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-vpclink.html#cfn-apigateway-vpclink-description
   */
  readonly description?: string;

  /**
   * The name used to label and identify the VPC link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-vpclink.html#cfn-apigateway-vpclink-name
   */
  readonly name: string;

  /**
   * An array of arbitrary tags (key-value pairs) to associate with the VPC link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-vpclink.html#cfn-apigateway-vpclink-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the network load balancer of the VPC targeted by the VPC link.
   *
   * The network load balancer must be owned by the same AWS account of the API owner.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-vpclink.html#cfn-apigateway-vpclink-targetarns
   */
  readonly targetArns: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnVpcLinkProps`
 *
 * @param properties - the TypeScript properties of a `CfnVpcLinkProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVpcLinkPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("targetArns", cdk.requiredValidator)(properties.targetArns));
  errors.collect(cdk.propertyValidator("targetArns", cdk.listValidator(cdk.validateString))(properties.targetArns));
  return errors.wrap("supplied properties not correct for \"CfnVpcLinkProps\"");
}

// @ts-ignore TS6133
function convertCfnVpcLinkPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVpcLinkPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TargetArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.targetArns)
  };
}

// @ts-ignore TS6133
function CfnVpcLinkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcLinkProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcLinkProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("targetArns", "TargetArns", (properties.TargetArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TargetArns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}