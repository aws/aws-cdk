/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::AppSync::ApiCache` resource represents the input of a `CreateApiCache` operation.
 *
 * @cloudformationResource AWS::AppSync::ApiCache
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html
 */
export class CfnApiCache extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppSync::ApiCache";

  /**
   * Build a CfnApiCache from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApiCache {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApiCachePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApiCache(scope, id, propsResult.value);
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
   * Caching behavior.
   */
  public apiCachingBehavior: string;

  /**
   * The GraphQL API ID.
   */
  public apiId: string;

  /**
   * At-rest encryption flag for cache.
   */
  public atRestEncryptionEnabled?: boolean | cdk.IResolvable;

  /**
   * Transit encryption flag when connecting to cache.
   */
  public transitEncryptionEnabled?: boolean | cdk.IResolvable;

  /**
   * TTL in seconds for cache entries.
   */
  public ttl: number;

  /**
   * The cache instance type. Valid values are.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApiCacheProps) {
    super(scope, id, {
      "type": CfnApiCache.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiCachingBehavior", this);
    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "ttl", this);
    cdk.requireProperty(props, "type", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.apiCachingBehavior = props.apiCachingBehavior;
    this.apiId = props.apiId;
    this.atRestEncryptionEnabled = props.atRestEncryptionEnabled;
    this.transitEncryptionEnabled = props.transitEncryptionEnabled;
    this.ttl = props.ttl;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiCachingBehavior": this.apiCachingBehavior,
      "apiId": this.apiId,
      "atRestEncryptionEnabled": this.atRestEncryptionEnabled,
      "transitEncryptionEnabled": this.transitEncryptionEnabled,
      "ttl": this.ttl,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApiCache.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApiCachePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnApiCache`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html
 */
export interface CfnApiCacheProps {
  /**
   * Caching behavior.
   *
   * - *FULL_REQUEST_CACHING* : All requests are fully cached.
   * - *PER_RESOLVER_CACHING* : Individual resolvers that you specify are cached.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-apicachingbehavior
   */
  readonly apiCachingBehavior: string;

  /**
   * The GraphQL API ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-apiid
   */
  readonly apiId: string;

  /**
   * At-rest encryption flag for cache.
   *
   * You cannot update this setting after creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-atrestencryptionenabled
   */
  readonly atRestEncryptionEnabled?: boolean | cdk.IResolvable;

  /**
   * Transit encryption flag when connecting to cache.
   *
   * You cannot update this setting after creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-transitencryptionenabled
   */
  readonly transitEncryptionEnabled?: boolean | cdk.IResolvable;

  /**
   * TTL in seconds for cache entries.
   *
   * Valid values are 1–3,600 seconds.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-ttl
   */
  readonly ttl: number;

  /**
   * The cache instance type. Valid values are.
   *
   * - `SMALL`
   * - `MEDIUM`
   * - `LARGE`
   * - `XLARGE`
   * - `LARGE_2X`
   * - `LARGE_4X`
   * - `LARGE_8X` (not available in all regions)
   * - `LARGE_12X`
   *
   * Historically, instance types were identified by an EC2-style value. As of July 2020, this is deprecated, and the generic identifiers above should be used.
   *
   * The following legacy instance types are available, but their use is discouraged:
   *
   * - *T2_SMALL* : A t2.small instance type.
   * - *T2_MEDIUM* : A t2.medium instance type.
   * - *R4_LARGE* : A r4.large instance type.
   * - *R4_XLARGE* : A r4.xlarge instance type.
   * - *R4_2XLARGE* : A r4.2xlarge instance type.
   * - *R4_4XLARGE* : A r4.4xlarge instance type.
   * - *R4_8XLARGE* : A r4.8xlarge instance type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `CfnApiCacheProps`
 *
 * @param properties - the TypeScript properties of a `CfnApiCacheProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiCachePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiCachingBehavior", cdk.requiredValidator)(properties.apiCachingBehavior));
  errors.collect(cdk.propertyValidator("apiCachingBehavior", cdk.validateString)(properties.apiCachingBehavior));
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("atRestEncryptionEnabled", cdk.validateBoolean)(properties.atRestEncryptionEnabled));
  errors.collect(cdk.propertyValidator("transitEncryptionEnabled", cdk.validateBoolean)(properties.transitEncryptionEnabled));
  errors.collect(cdk.propertyValidator("ttl", cdk.requiredValidator)(properties.ttl));
  errors.collect(cdk.propertyValidator("ttl", cdk.validateNumber)(properties.ttl));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnApiCacheProps\"");
}

// @ts-ignore TS6133
function convertCfnApiCachePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiCachePropsValidator(properties).assertSuccess();
  return {
    "ApiCachingBehavior": cdk.stringToCloudFormation(properties.apiCachingBehavior),
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "AtRestEncryptionEnabled": cdk.booleanToCloudFormation(properties.atRestEncryptionEnabled),
    "TransitEncryptionEnabled": cdk.booleanToCloudFormation(properties.transitEncryptionEnabled),
    "Ttl": cdk.numberToCloudFormation(properties.ttl),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnApiCachePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiCacheProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiCacheProps>();
  ret.addPropertyResult("apiCachingBehavior", "ApiCachingBehavior", (properties.ApiCachingBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.ApiCachingBehavior) : undefined));
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("atRestEncryptionEnabled", "AtRestEncryptionEnabled", (properties.AtRestEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AtRestEncryptionEnabled) : undefined));
  ret.addPropertyResult("transitEncryptionEnabled", "TransitEncryptionEnabled", (properties.TransitEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TransitEncryptionEnabled) : undefined));
  ret.addPropertyResult("ttl", "Ttl", (properties.Ttl != null ? cfn_parse.FromCloudFormation.getNumber(properties.Ttl) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppSync::ApiKey` resource creates a unique key that you can distribute to clients who are executing GraphQL operations with AWS AppSync that require an API key.
 *
 * @cloudformationResource AWS::AppSync::ApiKey
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html
 */
export class CfnApiKey extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppSync::ApiKey";

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
   * The API key.
   *
   * @cloudformationAttribute ApiKey
   */
  public readonly attrApiKey: string;

  /**
   * The API key ID.
   *
   * @cloudformationAttribute ApiKeyId
   */
  public readonly attrApiKeyId: string;

  /**
   * The Amazon Resource Name (ARN) of the API key, such as `arn:aws:appsync:us-east-1:123456789012:apis/graphqlapiid/apikey/apikeya1bzhi` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Unique AWS AppSync GraphQL API ID for this API key.
   */
  public apiId: string;

  /**
   * Unique description of your API key.
   */
  public description?: string;

  /**
   * The time after which the API key expires.
   */
  public expires?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApiKeyProps) {
    super(scope, id, {
      "type": CfnApiKey.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);

    this.attrApiKey = cdk.Token.asString(this.getAtt("ApiKey", cdk.ResolutionTypeHint.STRING));
    this.attrApiKeyId = cdk.Token.asString(this.getAtt("ApiKeyId", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.description = props.description;
    this.expires = props.expires;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "description": this.description,
      "expires": this.expires
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

/**
 * Properties for defining a `CfnApiKey`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html
 */
export interface CfnApiKeyProps {
  /**
   * Unique AWS AppSync GraphQL API ID for this API key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html#cfn-appsync-apikey-apiid
   */
  readonly apiId: string;

  /**
   * Unique description of your API key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html#cfn-appsync-apikey-description
   */
  readonly description?: string;

  /**
   * The time after which the API key expires.
   *
   * The date is represented as seconds since the epoch, rounded down to the nearest hour.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html#cfn-appsync-apikey-expires
   */
  readonly expires?: number;
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
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("expires", cdk.validateNumber)(properties.expires));
  return errors.wrap("supplied properties not correct for \"CfnApiKeyProps\"");
}

// @ts-ignore TS6133
function convertCfnApiKeyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiKeyPropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Expires": cdk.numberToCloudFormation(properties.expires)
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
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("expires", "Expires", (properties.Expires != null ? cfn_parse.FromCloudFormation.getNumber(properties.Expires) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppSync::DataSource` resource creates data sources for resolvers in AWS AppSync to connect to, such as Amazon DynamoDB , AWS Lambda , and Amazon OpenSearch Service .
 *
 * Resolvers use these data sources to fetch data when clients make GraphQL calls.
 *
 * @cloudformationResource AWS::AppSync::DataSource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html
 */
export class CfnDataSource extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppSync::DataSource";

  /**
   * Build a CfnDataSource from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataSource {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDataSourcePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataSource(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the API key, such as `arn:aws:appsync:us-east-1:123456789012:apis/graphqlapiid/datasources/datasourcename` .
   *
   * @cloudformationAttribute DataSourceArn
   */
  public readonly attrDataSourceArn: string;

  /**
   * The ID value.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Friendly name for you to identify your AWS AppSync data source after creation.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * Unique AWS AppSync GraphQL API identifier where this data source will be created.
   */
  public apiId: string;

  /**
   * The description of the data source.
   */
  public description?: string;

  /**
   * AWS Region and TableName for an Amazon DynamoDB table in your account.
   */
  public dynamoDbConfig?: CfnDataSource.DynamoDBConfigProperty | cdk.IResolvable;

  /**
   * AWS Region and Endpoints for an Amazon OpenSearch Service domain in your account.
   */
  public elasticsearchConfig?: CfnDataSource.ElasticsearchConfigProperty | cdk.IResolvable;

  /**
   * An EventBridge configuration that contains a valid ARN of an event bus.
   */
  public eventBridgeConfig?: CfnDataSource.EventBridgeConfigProperty | cdk.IResolvable;

  /**
   * Endpoints for an HTTP data source.
   */
  public httpConfig?: CfnDataSource.HttpConfigProperty | cdk.IResolvable;

  /**
   * An ARN of a Lambda function in valid ARN format.
   */
  public lambdaConfig?: cdk.IResolvable | CfnDataSource.LambdaConfigProperty;

  /**
   * Friendly name for you to identify your AppSync data source after creation.
   */
  public name: string;

  /**
   * AWS Region and Endpoints for an Amazon OpenSearch Service domain in your account.
   */
  public openSearchServiceConfig?: cdk.IResolvable | CfnDataSource.OpenSearchServiceConfigProperty;

  /**
   * Relational Database configuration of the relational database data source.
   */
  public relationalDatabaseConfig?: cdk.IResolvable | CfnDataSource.RelationalDatabaseConfigProperty;

  /**
   * The AWS Identity and Access Management service role ARN for the data source.
   */
  public serviceRoleArn?: string;

  /**
   * The type of the data source.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDataSourceProps) {
    super(scope, id, {
      "type": CfnDataSource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "type", this);

    this.attrDataSourceArn = cdk.Token.asString(this.getAtt("DataSourceArn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.description = props.description;
    this.dynamoDbConfig = props.dynamoDbConfig;
    this.elasticsearchConfig = props.elasticsearchConfig;
    this.eventBridgeConfig = props.eventBridgeConfig;
    this.httpConfig = props.httpConfig;
    this.lambdaConfig = props.lambdaConfig;
    this.name = props.name;
    this.openSearchServiceConfig = props.openSearchServiceConfig;
    this.relationalDatabaseConfig = props.relationalDatabaseConfig;
    this.serviceRoleArn = props.serviceRoleArn;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "description": this.description,
      "dynamoDbConfig": this.dynamoDbConfig,
      "elasticsearchConfig": this.elasticsearchConfig,
      "eventBridgeConfig": this.eventBridgeConfig,
      "httpConfig": this.httpConfig,
      "lambdaConfig": this.lambdaConfig,
      "name": this.name,
      "openSearchServiceConfig": this.openSearchServiceConfig,
      "relationalDatabaseConfig": this.relationalDatabaseConfig,
      "serviceRoleArn": this.serviceRoleArn,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataSource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDataSourcePropsToCloudFormation(props);
  }
}

export namespace CfnDataSource {
  /**
   * The `OpenSearchServiceConfig` property type specifies the `AwsRegion` and `Endpoints` for an Amazon OpenSearch Service domain in your account for an AWS AppSync data source.
   *
   * `OpenSearchServiceConfig` is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-opensearchserviceconfig.html
   */
  export interface OpenSearchServiceConfigProperty {
    /**
     * The AWS Region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-opensearchserviceconfig.html#cfn-appsync-datasource-opensearchserviceconfig-awsregion
     */
    readonly awsRegion: string;

    /**
     * The endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-opensearchserviceconfig.html#cfn-appsync-datasource-opensearchserviceconfig-endpoint
     */
    readonly endpoint: string;
  }

  /**
   * The data source.
   *
   * This can be an API destination, resource, or AWS service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-eventbridgeconfig.html
   */
  export interface EventBridgeConfigProperty {
    /**
     * The event bus pipeline's ARN.
     *
     * For more information about event buses, see [EventBridge event buses](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-eventbridgeconfig.html#cfn-appsync-datasource-eventbridgeconfig-eventbusarn
     */
    readonly eventBusArn: string;
  }

  /**
   * Use the `HttpConfig` property type to specify `HttpConfig` for an AWS AppSync data source.
   *
   * `HttpConfig` is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-httpconfig.html
   */
  export interface HttpConfigProperty {
    /**
     * The authorization configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-httpconfig.html#cfn-appsync-datasource-httpconfig-authorizationconfig
     */
    readonly authorizationConfig?: CfnDataSource.AuthorizationConfigProperty | cdk.IResolvable;

    /**
     * The endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-httpconfig.html#cfn-appsync-datasource-httpconfig-endpoint
     */
    readonly endpoint: string;
  }

  /**
   * The `AuthorizationConfig` property type specifies the authorization type and configuration for an AWS AppSync http data source.
   *
   * `AuthorizationConfig` is a property of the [AWS AppSync DataSource HttpConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-httpconfig.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-authorizationconfig.html
   */
  export interface AuthorizationConfigProperty {
    /**
     * The authorization type that the HTTP endpoint requires.
     *
     * - *AWS_IAM* : The authorization type is Signature Version 4 (SigV4).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-authorizationconfig.html#cfn-appsync-datasource-authorizationconfig-authorizationtype
     */
    readonly authorizationType: string;

    /**
     * The AWS Identity and Access Management settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-authorizationconfig.html#cfn-appsync-datasource-authorizationconfig-awsiamconfig
     */
    readonly awsIamConfig?: CfnDataSource.AwsIamConfigProperty | cdk.IResolvable;
  }

  /**
   * Use the `AwsIamConfig` property type to specify `AwsIamConfig` for a AWS AppSync authorizaton.
   *
   * `AwsIamConfig` is a property of the [AWS AppSync DataSource AuthorizationConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-httpconfig-authorizationconfig.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-awsiamconfig.html
   */
  export interface AwsIamConfigProperty {
    /**
     * The signing Region for AWS Identity and Access Management authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-awsiamconfig.html#cfn-appsync-datasource-awsiamconfig-signingregion
     */
    readonly signingRegion?: string;

    /**
     * The signing service name for AWS Identity and Access Management authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-awsiamconfig.html#cfn-appsync-datasource-awsiamconfig-signingservicename
     */
    readonly signingServiceName?: string;
  }

  /**
   * Use the `RelationalDatabaseConfig` property type to specify `RelationalDatabaseConfig` for an AWS AppSync data source.
   *
   * `RelationalDatabaseConfig` is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-relationaldatabaseconfig.html
   */
  export interface RelationalDatabaseConfigProperty {
    /**
     * Information about the Amazon RDS resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-relationaldatabaseconfig.html#cfn-appsync-datasource-relationaldatabaseconfig-rdshttpendpointconfig
     */
    readonly rdsHttpEndpointConfig?: cdk.IResolvable | CfnDataSource.RdsHttpEndpointConfigProperty;

    /**
     * The type of relational data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-relationaldatabaseconfig.html#cfn-appsync-datasource-relationaldatabaseconfig-relationaldatabasesourcetype
     */
    readonly relationalDatabaseSourceType: string;
  }

  /**
   * Use the `RdsHttpEndpointConfig` property type to specify the `RdsHttpEndpoint` for an AWS AppSync relational database.
   *
   * `RdsHttpEndpointConfig` is a property of the [AWS AppSync DataSource RelationalDatabaseConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-relationaldatabaseconfig.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html
   */
  export interface RdsHttpEndpointConfigProperty {
    /**
     * AWS Region for RDS HTTP endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html#cfn-appsync-datasource-rdshttpendpointconfig-awsregion
     */
    readonly awsRegion: string;

    /**
     * The ARN for database credentials stored in AWS Secrets Manager .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html#cfn-appsync-datasource-rdshttpendpointconfig-awssecretstorearn
     */
    readonly awsSecretStoreArn: string;

    /**
     * Logical database name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html#cfn-appsync-datasource-rdshttpendpointconfig-databasename
     */
    readonly databaseName?: string;

    /**
     * Amazon RDS cluster Amazon Resource Name (ARN).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html#cfn-appsync-datasource-rdshttpendpointconfig-dbclusteridentifier
     */
    readonly dbClusterIdentifier: string;

    /**
     * Logical schema name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html#cfn-appsync-datasource-rdshttpendpointconfig-schema
     */
    readonly schema?: string;
  }

  /**
   * The `LambdaConfig` property type specifies the Lambda function ARN for an AWS AppSync data source.
   *
   * `LambdaConfig` is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-lambdaconfig.html
   */
  export interface LambdaConfigProperty {
    /**
     * The ARN for the Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-lambdaconfig.html#cfn-appsync-datasource-lambdaconfig-lambdafunctionarn
     */
    readonly lambdaFunctionArn: string;
  }

  /**
   * The `DynamoDBConfig` property type specifies the `AwsRegion` and `TableName` for an Amazon DynamoDB table in your account for an AWS AppSync data source.
   *
   * `DynamoDBConfig` is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html
   */
  export interface DynamoDBConfigProperty {
    /**
     * The AWS Region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-awsregion
     */
    readonly awsRegion: string;

    /**
     * The `DeltaSyncConfig` for a versioned datasource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-deltasyncconfig
     */
    readonly deltaSyncConfig?: CfnDataSource.DeltaSyncConfigProperty | cdk.IResolvable;

    /**
     * The table name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-tablename
     */
    readonly tableName: string;

    /**
     * Set to `TRUE` to use AWS Identity and Access Management with this data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-usecallercredentials
     */
    readonly useCallerCredentials?: boolean | cdk.IResolvable;

    /**
     * Set to TRUE to use Conflict Detection and Resolution with this data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-versioned
     */
    readonly versioned?: boolean | cdk.IResolvable;
  }

  /**
   * Describes a Delta Sync configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-deltasyncconfig.html
   */
  export interface DeltaSyncConfigProperty {
    /**
     * The number of minutes that an Item is stored in the data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-deltasyncconfig.html#cfn-appsync-datasource-deltasyncconfig-basetablettl
     */
    readonly baseTableTtl: string;

    /**
     * The Delta Sync table name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-deltasyncconfig.html#cfn-appsync-datasource-deltasyncconfig-deltasynctablename
     */
    readonly deltaSyncTableName: string;

    /**
     * The number of minutes that a Delta Sync log entry is stored in the Delta Sync table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-deltasyncconfig.html#cfn-appsync-datasource-deltasyncconfig-deltasynctablettl
     */
    readonly deltaSyncTableTtl: string;
  }

  /**
   * The `ElasticsearchConfig` property type specifies the `AwsRegion` and `Endpoints` for an Amazon OpenSearch Service domain in your account for an AWS AppSync data source.
   *
   * ElasticsearchConfig is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) property type.
   *
   * As of September 2021, Amazon Elasticsearch Service is Amazon OpenSearch Service . This property is deprecated. For new data sources, use *OpenSearchServiceConfig* to specify an OpenSearch Service data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html
   */
  export interface ElasticsearchConfigProperty {
    /**
     * The AWS Region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html#cfn-appsync-datasource-elasticsearchconfig-awsregion
     */
    readonly awsRegion: string;

    /**
     * The endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html#cfn-appsync-datasource-elasticsearchconfig-endpoint
     */
    readonly endpoint: string;
  }
}

/**
 * Properties for defining a `CfnDataSource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html
 */
export interface CfnDataSourceProps {
  /**
   * Unique AWS AppSync GraphQL API identifier where this data source will be created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-apiid
   */
  readonly apiId: string;

  /**
   * The description of the data source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-description
   */
  readonly description?: string;

  /**
   * AWS Region and TableName for an Amazon DynamoDB table in your account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-dynamodbconfig
   */
  readonly dynamoDbConfig?: CfnDataSource.DynamoDBConfigProperty | cdk.IResolvable;

  /**
   * AWS Region and Endpoints for an Amazon OpenSearch Service domain in your account.
   *
   * As of September 2021, Amazon Elasticsearch Service is Amazon OpenSearch Service . This property is deprecated. For new data sources, use *OpenSearchServiceConfig* to specify an OpenSearch Service data source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-elasticsearchconfig
   */
  readonly elasticsearchConfig?: CfnDataSource.ElasticsearchConfigProperty | cdk.IResolvable;

  /**
   * An EventBridge configuration that contains a valid ARN of an event bus.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-eventbridgeconfig
   */
  readonly eventBridgeConfig?: CfnDataSource.EventBridgeConfigProperty | cdk.IResolvable;

  /**
   * Endpoints for an HTTP data source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-httpconfig
   */
  readonly httpConfig?: CfnDataSource.HttpConfigProperty | cdk.IResolvable;

  /**
   * An ARN of a Lambda function in valid ARN format.
   *
   * This can be the ARN of a Lambda function that exists in the current account or in another account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-lambdaconfig
   */
  readonly lambdaConfig?: cdk.IResolvable | CfnDataSource.LambdaConfigProperty;

  /**
   * Friendly name for you to identify your AppSync data source after creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-name
   */
  readonly name: string;

  /**
   * AWS Region and Endpoints for an Amazon OpenSearch Service domain in your account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-opensearchserviceconfig
   */
  readonly openSearchServiceConfig?: cdk.IResolvable | CfnDataSource.OpenSearchServiceConfigProperty;

  /**
   * Relational Database configuration of the relational database data source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-relationaldatabaseconfig
   */
  readonly relationalDatabaseConfig?: cdk.IResolvable | CfnDataSource.RelationalDatabaseConfigProperty;

  /**
   * The AWS Identity and Access Management service role ARN for the data source.
   *
   * The system assumes this role when accessing the data source.
   *
   * Required if `Type` is specified as `AWS_LAMBDA` , `AMAZON_DYNAMODB` , `AMAZON_ELASTICSEARCH` , `AMAZON_EVENTBRIDGE` , or `AMAZON_OPENSEARCH_SERVICE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-servicerolearn
   */
  readonly serviceRoleArn?: string;

  /**
   * The type of the data source.
   *
   * - *AWS_LAMBDA* : The data source is an AWS Lambda function.
   * - *AMAZON_DYNAMODB* : The data source is an Amazon DynamoDB table.
   * - *AMAZON_ELASTICSEARCH* : The data source is an Amazon OpenSearch Service domain.
   * - *AMAZON_EVENTBRIDGE* : The data source is an Amazon EventBridge event bus.
   * - *AMAZON_OPENSEARCH_SERVICE* : The data source is an Amazon OpenSearch Service domain.
   * - *NONE* : There is no data source. This type is used when you wish to invoke a GraphQL operation without connecting to a data source, such as performing data transformation with resolvers or triggering a subscription to be invoked from a mutation.
   * - *HTTP* : The data source is an HTTP endpoint.
   * - *RELATIONAL_DATABASE* : The data source is a relational database.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `OpenSearchServiceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OpenSearchServiceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceOpenSearchServiceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsRegion", cdk.requiredValidator)(properties.awsRegion));
  errors.collect(cdk.propertyValidator("awsRegion", cdk.validateString)(properties.awsRegion));
  errors.collect(cdk.propertyValidator("endpoint", cdk.requiredValidator)(properties.endpoint));
  errors.collect(cdk.propertyValidator("endpoint", cdk.validateString)(properties.endpoint));
  return errors.wrap("supplied properties not correct for \"OpenSearchServiceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceOpenSearchServiceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceOpenSearchServiceConfigPropertyValidator(properties).assertSuccess();
  return {
    "AwsRegion": cdk.stringToCloudFormation(properties.awsRegion),
    "Endpoint": cdk.stringToCloudFormation(properties.endpoint)
  };
}

// @ts-ignore TS6133
function CfnDataSourceOpenSearchServiceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.OpenSearchServiceConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.OpenSearchServiceConfigProperty>();
  ret.addPropertyResult("awsRegion", "AwsRegion", (properties.AwsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsRegion) : undefined));
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventBridgeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceEventBridgeConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventBusArn", cdk.requiredValidator)(properties.eventBusArn));
  errors.collect(cdk.propertyValidator("eventBusArn", cdk.validateString)(properties.eventBusArn));
  return errors.wrap("supplied properties not correct for \"EventBridgeConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceEventBridgeConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceEventBridgeConfigPropertyValidator(properties).assertSuccess();
  return {
    "EventBusArn": cdk.stringToCloudFormation(properties.eventBusArn)
  };
}

// @ts-ignore TS6133
function CfnDataSourceEventBridgeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.EventBridgeConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.EventBridgeConfigProperty>();
  ret.addPropertyResult("eventBusArn", "EventBusArn", (properties.EventBusArn != null ? cfn_parse.FromCloudFormation.getString(properties.EventBusArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AwsIamConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AwsIamConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceAwsIamConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("signingRegion", cdk.validateString)(properties.signingRegion));
  errors.collect(cdk.propertyValidator("signingServiceName", cdk.validateString)(properties.signingServiceName));
  return errors.wrap("supplied properties not correct for \"AwsIamConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceAwsIamConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceAwsIamConfigPropertyValidator(properties).assertSuccess();
  return {
    "SigningRegion": cdk.stringToCloudFormation(properties.signingRegion),
    "SigningServiceName": cdk.stringToCloudFormation(properties.signingServiceName)
  };
}

// @ts-ignore TS6133
function CfnDataSourceAwsIamConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.AwsIamConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.AwsIamConfigProperty>();
  ret.addPropertyResult("signingRegion", "SigningRegion", (properties.SigningRegion != null ? cfn_parse.FromCloudFormation.getString(properties.SigningRegion) : undefined));
  ret.addPropertyResult("signingServiceName", "SigningServiceName", (properties.SigningServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.SigningServiceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthorizationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthorizationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceAuthorizationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizationType", cdk.requiredValidator)(properties.authorizationType));
  errors.collect(cdk.propertyValidator("authorizationType", cdk.validateString)(properties.authorizationType));
  errors.collect(cdk.propertyValidator("awsIamConfig", CfnDataSourceAwsIamConfigPropertyValidator)(properties.awsIamConfig));
  return errors.wrap("supplied properties not correct for \"AuthorizationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceAuthorizationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceAuthorizationConfigPropertyValidator(properties).assertSuccess();
  return {
    "AuthorizationType": cdk.stringToCloudFormation(properties.authorizationType),
    "AwsIamConfig": convertCfnDataSourceAwsIamConfigPropertyToCloudFormation(properties.awsIamConfig)
  };
}

// @ts-ignore TS6133
function CfnDataSourceAuthorizationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.AuthorizationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.AuthorizationConfigProperty>();
  ret.addPropertyResult("authorizationType", "AuthorizationType", (properties.AuthorizationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizationType) : undefined));
  ret.addPropertyResult("awsIamConfig", "AwsIamConfig", (properties.AwsIamConfig != null ? CfnDataSourceAwsIamConfigPropertyFromCloudFormation(properties.AwsIamConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HttpConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceHttpConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizationConfig", CfnDataSourceAuthorizationConfigPropertyValidator)(properties.authorizationConfig));
  errors.collect(cdk.propertyValidator("endpoint", cdk.requiredValidator)(properties.endpoint));
  errors.collect(cdk.propertyValidator("endpoint", cdk.validateString)(properties.endpoint));
  return errors.wrap("supplied properties not correct for \"HttpConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceHttpConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceHttpConfigPropertyValidator(properties).assertSuccess();
  return {
    "AuthorizationConfig": convertCfnDataSourceAuthorizationConfigPropertyToCloudFormation(properties.authorizationConfig),
    "Endpoint": cdk.stringToCloudFormation(properties.endpoint)
  };
}

// @ts-ignore TS6133
function CfnDataSourceHttpConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.HttpConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.HttpConfigProperty>();
  ret.addPropertyResult("authorizationConfig", "AuthorizationConfig", (properties.AuthorizationConfig != null ? CfnDataSourceAuthorizationConfigPropertyFromCloudFormation(properties.AuthorizationConfig) : undefined));
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RdsHttpEndpointConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RdsHttpEndpointConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceRdsHttpEndpointConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsRegion", cdk.requiredValidator)(properties.awsRegion));
  errors.collect(cdk.propertyValidator("awsRegion", cdk.validateString)(properties.awsRegion));
  errors.collect(cdk.propertyValidator("awsSecretStoreArn", cdk.requiredValidator)(properties.awsSecretStoreArn));
  errors.collect(cdk.propertyValidator("awsSecretStoreArn", cdk.validateString)(properties.awsSecretStoreArn));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("dbClusterIdentifier", cdk.requiredValidator)(properties.dbClusterIdentifier));
  errors.collect(cdk.propertyValidator("dbClusterIdentifier", cdk.validateString)(properties.dbClusterIdentifier));
  errors.collect(cdk.propertyValidator("schema", cdk.validateString)(properties.schema));
  return errors.wrap("supplied properties not correct for \"RdsHttpEndpointConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceRdsHttpEndpointConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceRdsHttpEndpointConfigPropertyValidator(properties).assertSuccess();
  return {
    "AwsRegion": cdk.stringToCloudFormation(properties.awsRegion),
    "AwsSecretStoreArn": cdk.stringToCloudFormation(properties.awsSecretStoreArn),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "DbClusterIdentifier": cdk.stringToCloudFormation(properties.dbClusterIdentifier),
    "Schema": cdk.stringToCloudFormation(properties.schema)
  };
}

// @ts-ignore TS6133
function CfnDataSourceRdsHttpEndpointConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.RdsHttpEndpointConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.RdsHttpEndpointConfigProperty>();
  ret.addPropertyResult("awsRegion", "AwsRegion", (properties.AwsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsRegion) : undefined));
  ret.addPropertyResult("awsSecretStoreArn", "AwsSecretStoreArn", (properties.AwsSecretStoreArn != null ? cfn_parse.FromCloudFormation.getString(properties.AwsSecretStoreArn) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("dbClusterIdentifier", "DbClusterIdentifier", (properties.DbClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DbClusterIdentifier) : undefined));
  ret.addPropertyResult("schema", "Schema", (properties.Schema != null ? cfn_parse.FromCloudFormation.getString(properties.Schema) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RelationalDatabaseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RelationalDatabaseConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceRelationalDatabaseConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rdsHttpEndpointConfig", CfnDataSourceRdsHttpEndpointConfigPropertyValidator)(properties.rdsHttpEndpointConfig));
  errors.collect(cdk.propertyValidator("relationalDatabaseSourceType", cdk.requiredValidator)(properties.relationalDatabaseSourceType));
  errors.collect(cdk.propertyValidator("relationalDatabaseSourceType", cdk.validateString)(properties.relationalDatabaseSourceType));
  return errors.wrap("supplied properties not correct for \"RelationalDatabaseConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceRelationalDatabaseConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceRelationalDatabaseConfigPropertyValidator(properties).assertSuccess();
  return {
    "RdsHttpEndpointConfig": convertCfnDataSourceRdsHttpEndpointConfigPropertyToCloudFormation(properties.rdsHttpEndpointConfig),
    "RelationalDatabaseSourceType": cdk.stringToCloudFormation(properties.relationalDatabaseSourceType)
  };
}

// @ts-ignore TS6133
function CfnDataSourceRelationalDatabaseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.RelationalDatabaseConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.RelationalDatabaseConfigProperty>();
  ret.addPropertyResult("rdsHttpEndpointConfig", "RdsHttpEndpointConfig", (properties.RdsHttpEndpointConfig != null ? CfnDataSourceRdsHttpEndpointConfigPropertyFromCloudFormation(properties.RdsHttpEndpointConfig) : undefined));
  ret.addPropertyResult("relationalDatabaseSourceType", "RelationalDatabaseSourceType", (properties.RelationalDatabaseSourceType != null ? cfn_parse.FromCloudFormation.getString(properties.RelationalDatabaseSourceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceLambdaConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaFunctionArn", cdk.requiredValidator)(properties.lambdaFunctionArn));
  errors.collect(cdk.propertyValidator("lambdaFunctionArn", cdk.validateString)(properties.lambdaFunctionArn));
  return errors.wrap("supplied properties not correct for \"LambdaConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceLambdaConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceLambdaConfigPropertyValidator(properties).assertSuccess();
  return {
    "LambdaFunctionArn": cdk.stringToCloudFormation(properties.lambdaFunctionArn)
  };
}

// @ts-ignore TS6133
function CfnDataSourceLambdaConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.LambdaConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.LambdaConfigProperty>();
  ret.addPropertyResult("lambdaFunctionArn", "LambdaFunctionArn", (properties.LambdaFunctionArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaFunctionArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeltaSyncConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DeltaSyncConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceDeltaSyncConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("baseTableTtl", cdk.requiredValidator)(properties.baseTableTtl));
  errors.collect(cdk.propertyValidator("baseTableTtl", cdk.validateString)(properties.baseTableTtl));
  errors.collect(cdk.propertyValidator("deltaSyncTableName", cdk.requiredValidator)(properties.deltaSyncTableName));
  errors.collect(cdk.propertyValidator("deltaSyncTableName", cdk.validateString)(properties.deltaSyncTableName));
  errors.collect(cdk.propertyValidator("deltaSyncTableTtl", cdk.requiredValidator)(properties.deltaSyncTableTtl));
  errors.collect(cdk.propertyValidator("deltaSyncTableTtl", cdk.validateString)(properties.deltaSyncTableTtl));
  return errors.wrap("supplied properties not correct for \"DeltaSyncConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceDeltaSyncConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceDeltaSyncConfigPropertyValidator(properties).assertSuccess();
  return {
    "BaseTableTTL": cdk.stringToCloudFormation(properties.baseTableTtl),
    "DeltaSyncTableName": cdk.stringToCloudFormation(properties.deltaSyncTableName),
    "DeltaSyncTableTTL": cdk.stringToCloudFormation(properties.deltaSyncTableTtl)
  };
}

// @ts-ignore TS6133
function CfnDataSourceDeltaSyncConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DeltaSyncConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DeltaSyncConfigProperty>();
  ret.addPropertyResult("baseTableTtl", "BaseTableTTL", (properties.BaseTableTTL != null ? cfn_parse.FromCloudFormation.getString(properties.BaseTableTTL) : undefined));
  ret.addPropertyResult("deltaSyncTableName", "DeltaSyncTableName", (properties.DeltaSyncTableName != null ? cfn_parse.FromCloudFormation.getString(properties.DeltaSyncTableName) : undefined));
  ret.addPropertyResult("deltaSyncTableTtl", "DeltaSyncTableTTL", (properties.DeltaSyncTableTTL != null ? cfn_parse.FromCloudFormation.getString(properties.DeltaSyncTableTTL) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamoDBConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DynamoDBConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceDynamoDBConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsRegion", cdk.requiredValidator)(properties.awsRegion));
  errors.collect(cdk.propertyValidator("awsRegion", cdk.validateString)(properties.awsRegion));
  errors.collect(cdk.propertyValidator("deltaSyncConfig", CfnDataSourceDeltaSyncConfigPropertyValidator)(properties.deltaSyncConfig));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("useCallerCredentials", cdk.validateBoolean)(properties.useCallerCredentials));
  errors.collect(cdk.propertyValidator("versioned", cdk.validateBoolean)(properties.versioned));
  return errors.wrap("supplied properties not correct for \"DynamoDBConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceDynamoDBConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceDynamoDBConfigPropertyValidator(properties).assertSuccess();
  return {
    "AwsRegion": cdk.stringToCloudFormation(properties.awsRegion),
    "DeltaSyncConfig": convertCfnDataSourceDeltaSyncConfigPropertyToCloudFormation(properties.deltaSyncConfig),
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "UseCallerCredentials": cdk.booleanToCloudFormation(properties.useCallerCredentials),
    "Versioned": cdk.booleanToCloudFormation(properties.versioned)
  };
}

// @ts-ignore TS6133
function CfnDataSourceDynamoDBConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DynamoDBConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DynamoDBConfigProperty>();
  ret.addPropertyResult("awsRegion", "AwsRegion", (properties.AwsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsRegion) : undefined));
  ret.addPropertyResult("deltaSyncConfig", "DeltaSyncConfig", (properties.DeltaSyncConfig != null ? CfnDataSourceDeltaSyncConfigPropertyFromCloudFormation(properties.DeltaSyncConfig) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("useCallerCredentials", "UseCallerCredentials", (properties.UseCallerCredentials != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseCallerCredentials) : undefined));
  ret.addPropertyResult("versioned", "Versioned", (properties.Versioned != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Versioned) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ElasticsearchConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticsearchConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceElasticsearchConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsRegion", cdk.requiredValidator)(properties.awsRegion));
  errors.collect(cdk.propertyValidator("awsRegion", cdk.validateString)(properties.awsRegion));
  errors.collect(cdk.propertyValidator("endpoint", cdk.requiredValidator)(properties.endpoint));
  errors.collect(cdk.propertyValidator("endpoint", cdk.validateString)(properties.endpoint));
  return errors.wrap("supplied properties not correct for \"ElasticsearchConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceElasticsearchConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceElasticsearchConfigPropertyValidator(properties).assertSuccess();
  return {
    "AwsRegion": cdk.stringToCloudFormation(properties.awsRegion),
    "Endpoint": cdk.stringToCloudFormation(properties.endpoint)
  };
}

// @ts-ignore TS6133
function CfnDataSourceElasticsearchConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ElasticsearchConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ElasticsearchConfigProperty>();
  ret.addPropertyResult("awsRegion", "AwsRegion", (properties.AwsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsRegion) : undefined));
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDataSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataSourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("dynamoDbConfig", CfnDataSourceDynamoDBConfigPropertyValidator)(properties.dynamoDbConfig));
  errors.collect(cdk.propertyValidator("elasticsearchConfig", CfnDataSourceElasticsearchConfigPropertyValidator)(properties.elasticsearchConfig));
  errors.collect(cdk.propertyValidator("eventBridgeConfig", CfnDataSourceEventBridgeConfigPropertyValidator)(properties.eventBridgeConfig));
  errors.collect(cdk.propertyValidator("httpConfig", CfnDataSourceHttpConfigPropertyValidator)(properties.httpConfig));
  errors.collect(cdk.propertyValidator("lambdaConfig", CfnDataSourceLambdaConfigPropertyValidator)(properties.lambdaConfig));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("openSearchServiceConfig", CfnDataSourceOpenSearchServiceConfigPropertyValidator)(properties.openSearchServiceConfig));
  errors.collect(cdk.propertyValidator("relationalDatabaseConfig", CfnDataSourceRelationalDatabaseConfigPropertyValidator)(properties.relationalDatabaseConfig));
  errors.collect(cdk.propertyValidator("serviceRoleArn", cdk.validateString)(properties.serviceRoleArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnDataSourceProps\"");
}

// @ts-ignore TS6133
function convertCfnDataSourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourcePropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DynamoDBConfig": convertCfnDataSourceDynamoDBConfigPropertyToCloudFormation(properties.dynamoDbConfig),
    "ElasticsearchConfig": convertCfnDataSourceElasticsearchConfigPropertyToCloudFormation(properties.elasticsearchConfig),
    "EventBridgeConfig": convertCfnDataSourceEventBridgeConfigPropertyToCloudFormation(properties.eventBridgeConfig),
    "HttpConfig": convertCfnDataSourceHttpConfigPropertyToCloudFormation(properties.httpConfig),
    "LambdaConfig": convertCfnDataSourceLambdaConfigPropertyToCloudFormation(properties.lambdaConfig),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OpenSearchServiceConfig": convertCfnDataSourceOpenSearchServiceConfigPropertyToCloudFormation(properties.openSearchServiceConfig),
    "RelationalDatabaseConfig": convertCfnDataSourceRelationalDatabaseConfigPropertyToCloudFormation(properties.relationalDatabaseConfig),
    "ServiceRoleArn": cdk.stringToCloudFormation(properties.serviceRoleArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDataSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSourceProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("dynamoDbConfig", "DynamoDBConfig", (properties.DynamoDBConfig != null ? CfnDataSourceDynamoDBConfigPropertyFromCloudFormation(properties.DynamoDBConfig) : undefined));
  ret.addPropertyResult("elasticsearchConfig", "ElasticsearchConfig", (properties.ElasticsearchConfig != null ? CfnDataSourceElasticsearchConfigPropertyFromCloudFormation(properties.ElasticsearchConfig) : undefined));
  ret.addPropertyResult("eventBridgeConfig", "EventBridgeConfig", (properties.EventBridgeConfig != null ? CfnDataSourceEventBridgeConfigPropertyFromCloudFormation(properties.EventBridgeConfig) : undefined));
  ret.addPropertyResult("httpConfig", "HttpConfig", (properties.HttpConfig != null ? CfnDataSourceHttpConfigPropertyFromCloudFormation(properties.HttpConfig) : undefined));
  ret.addPropertyResult("lambdaConfig", "LambdaConfig", (properties.LambdaConfig != null ? CfnDataSourceLambdaConfigPropertyFromCloudFormation(properties.LambdaConfig) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("openSearchServiceConfig", "OpenSearchServiceConfig", (properties.OpenSearchServiceConfig != null ? CfnDataSourceOpenSearchServiceConfigPropertyFromCloudFormation(properties.OpenSearchServiceConfig) : undefined));
  ret.addPropertyResult("relationalDatabaseConfig", "RelationalDatabaseConfig", (properties.RelationalDatabaseConfig != null ? CfnDataSourceRelationalDatabaseConfigPropertyFromCloudFormation(properties.RelationalDatabaseConfig) : undefined));
  ret.addPropertyResult("serviceRoleArn", "ServiceRoleArn", (properties.ServiceRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRoleArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppSync::DomainName` resource creates a `DomainNameConfig` object to configure a custom domain.
 *
 * @cloudformationResource AWS::AppSync::DomainName
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html
 */
export class CfnDomainName extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppSync::DomainName";

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
   * The domain name provided by AWS AppSync .
   *
   * @cloudformationAttribute AppSyncDomainName
   */
  public readonly attrAppSyncDomainName: string;

  /**
   * The domain name.
   *
   * @cloudformationAttribute DomainName
   */
  public readonly attrDomainName: string;

  /**
   * The ID of your Amazon Route 53 hosted zone.
   *
   * @cloudformationAttribute HostedZoneId
   */
  public readonly attrHostedZoneId: string;

  /**
   * The Amazon Resource Name (ARN) of the certificate.
   */
  public certificateArn: string;

  /**
   * The decription for your domain name.
   */
  public description?: string;

  /**
   * The domain name.
   */
  public domainName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDomainNameProps) {
    super(scope, id, {
      "type": CfnDomainName.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "certificateArn", this);
    cdk.requireProperty(props, "domainName", this);

    this.attrAppSyncDomainName = cdk.Token.asString(this.getAtt("AppSyncDomainName", cdk.ResolutionTypeHint.STRING));
    this.attrDomainName = cdk.Token.asString(this.getAtt("DomainName", cdk.ResolutionTypeHint.STRING));
    this.attrHostedZoneId = cdk.Token.asString(this.getAtt("HostedZoneId", cdk.ResolutionTypeHint.STRING));
    this.certificateArn = props.certificateArn;
    this.description = props.description;
    this.domainName = props.domainName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "certificateArn": this.certificateArn,
      "description": this.description,
      "domainName": this.domainName
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

/**
 * Properties for defining a `CfnDomainName`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html
 */
export interface CfnDomainNameProps {
  /**
   * The Amazon Resource Name (ARN) of the certificate.
   *
   * This will be an AWS Certificate Manager certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html#cfn-appsync-domainname-certificatearn
   */
  readonly certificateArn: string;

  /**
   * The decription for your domain name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html#cfn-appsync-domainname-description
   */
  readonly description?: string;

  /**
   * The domain name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html#cfn-appsync-domainname-domainname
   */
  readonly domainName: string;
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
  errors.collect(cdk.propertyValidator("certificateArn", cdk.requiredValidator)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  return errors.wrap("supplied properties not correct for \"CfnDomainNameProps\"");
}

// @ts-ignore TS6133
function convertCfnDomainNamePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainNamePropsValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DomainName": cdk.stringToCloudFormation(properties.domainName)
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
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppSync::DomainNameApiAssociation` resource represents the mapping of your custom domain name to the assigned API URL.
 *
 * @cloudformationResource AWS::AppSync::DomainNameApiAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainnameapiassociation.html
 */
export class CfnDomainNameApiAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppSync::DomainNameApiAssociation";

  /**
   * Build a CfnDomainNameApiAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDomainNameApiAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDomainNameApiAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDomainNameApiAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute ApiAssociationIdentifier
   */
  public readonly attrApiAssociationIdentifier: string;

  /**
   * The API ID.
   */
  public apiId: string;

  /**
   * The domain name.
   */
  public domainName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDomainNameApiAssociationProps) {
    super(scope, id, {
      "type": CfnDomainNameApiAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "domainName", this);

    this.attrApiAssociationIdentifier = cdk.Token.asString(this.getAtt("ApiAssociationIdentifier", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.domainName = props.domainName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "domainName": this.domainName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomainNameApiAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDomainNameApiAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDomainNameApiAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainnameapiassociation.html
 */
export interface CfnDomainNameApiAssociationProps {
  /**
   * The API ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainnameapiassociation.html#cfn-appsync-domainnameapiassociation-apiid
   */
  readonly apiId: string;

  /**
   * The domain name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainnameapiassociation.html#cfn-appsync-domainnameapiassociation-domainname
   */
  readonly domainName: string;
}

/**
 * Determine whether the given properties match those of a `CfnDomainNameApiAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDomainNameApiAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainNameApiAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  return errors.wrap("supplied properties not correct for \"CfnDomainNameApiAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnDomainNameApiAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainNameApiAssociationPropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "DomainName": cdk.stringToCloudFormation(properties.domainName)
  };
}

// @ts-ignore TS6133
function CfnDomainNameApiAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainNameApiAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainNameApiAssociationProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppSync::FunctionConfiguration` resource defines the functions in GraphQL APIs to perform certain operations.
 *
 * You can use pipeline resolvers to attach functions. For more information, see [Pipeline Resolvers](https://docs.aws.amazon.com/appsync/latest/devguide/pipeline-resolvers.html) in the *AWS AppSync Developer Guide* .
 *
 * > When you submit an update, AWS CloudFormation updates resources based on differences between what you submit and the stack's current template. To cause this resource to be updated you must change a property value for this resource in the AWS CloudFormation template. Changing the Amazon S3 file content without changing a property value will not result in an update operation.
 * >
 * > See [Update Behaviors of Stack Resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html) in the *AWS CloudFormation User Guide* .
 *
 * @cloudformationResource AWS::AppSync::FunctionConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html
 */
export class CfnFunctionConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppSync::FunctionConfiguration";

  /**
   * Build a CfnFunctionConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFunctionConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFunctionConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFunctionConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of data source this function will attach.
   *
   * @cloudformationAttribute DataSourceName
   */
  public readonly attrDataSourceName: string;

  /**
   * ARN of the function, such as `arn:aws:appsync:us-east-1:123456789012:apis/graphqlapiid/functions/functionId` .
   *
   * @cloudformationAttribute FunctionArn
   */
  public readonly attrFunctionArn: string;

  /**
   * The unique ID of this function.
   *
   * @cloudformationAttribute FunctionId
   */
  public readonly attrFunctionId: string;

  /**
   * The name of the function.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The AWS AppSync GraphQL API that you want to attach using this function.
   */
  public apiId: string;

  /**
   * The `resolver` code that contains the request and response functions.
   */
  public code?: string;

  /**
   * The Amazon S3 endpoint.
   */
  public codeS3Location?: string;

  /**
   * The name of data source this function will attach.
   */
  public dataSourceName: string;

  /**
   * The `Function` description.
   */
  public description?: string;

  /**
   * The version of the request mapping template.
   */
  public functionVersion?: string;

  /**
   * The maximum number of resolver request inputs that will be sent to a single AWS Lambda function in a `BatchInvoke` operation.
   */
  public maxBatchSize?: number;

  /**
   * The name of the function.
   */
  public name: string;

  /**
   * The `Function` request mapping template.
   */
  public requestMappingTemplate?: string;

  /**
   * Describes a Sync configuration for a resolver.
   */
  public requestMappingTemplateS3Location?: string;

  /**
   * The `Function` response mapping template.
   */
  public responseMappingTemplate?: string;

  /**
   * The location of a response mapping template in an Amazon S3 bucket.
   */
  public responseMappingTemplateS3Location?: string;

  /**
   * Describes a runtime used by an AWS AppSync resolver or AWS AppSync function.
   */
  public runtime?: CfnFunctionConfiguration.AppSyncRuntimeProperty | cdk.IResolvable;

  /**
   * Describes a Sync configuration for a resolver.
   */
  public syncConfig?: cdk.IResolvable | CfnFunctionConfiguration.SyncConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFunctionConfigurationProps) {
    super(scope, id, {
      "type": CfnFunctionConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "dataSourceName", this);
    cdk.requireProperty(props, "name", this);

    this.attrDataSourceName = cdk.Token.asString(this.getAtt("DataSourceName", cdk.ResolutionTypeHint.STRING));
    this.attrFunctionArn = cdk.Token.asString(this.getAtt("FunctionArn", cdk.ResolutionTypeHint.STRING));
    this.attrFunctionId = cdk.Token.asString(this.getAtt("FunctionId", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.code = props.code;
    this.codeS3Location = props.codeS3Location;
    this.dataSourceName = props.dataSourceName;
    this.description = props.description;
    this.functionVersion = props.functionVersion;
    this.maxBatchSize = props.maxBatchSize;
    this.name = props.name;
    this.requestMappingTemplate = props.requestMappingTemplate;
    this.requestMappingTemplateS3Location = props.requestMappingTemplateS3Location;
    this.responseMappingTemplate = props.responseMappingTemplate;
    this.responseMappingTemplateS3Location = props.responseMappingTemplateS3Location;
    this.runtime = props.runtime;
    this.syncConfig = props.syncConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "code": this.code,
      "codeS3Location": this.codeS3Location,
      "dataSourceName": this.dataSourceName,
      "description": this.description,
      "functionVersion": this.functionVersion,
      "maxBatchSize": this.maxBatchSize,
      "name": this.name,
      "requestMappingTemplate": this.requestMappingTemplate,
      "requestMappingTemplateS3Location": this.requestMappingTemplateS3Location,
      "responseMappingTemplate": this.responseMappingTemplate,
      "responseMappingTemplateS3Location": this.responseMappingTemplateS3Location,
      "runtime": this.runtime,
      "syncConfig": this.syncConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFunctionConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFunctionConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnFunctionConfiguration {
  /**
   * Describes a Sync configuration for a resolver.
   *
   * Specifies which Conflict Detection strategy and Resolution strategy to use when the resolver is invoked.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-syncconfig.html
   */
  export interface SyncConfigProperty {
    /**
     * The Conflict Detection strategy to use.
     *
     * - *VERSION* : Detect conflicts based on object versions for this resolver.
     * - *NONE* : Do not detect conflicts when invoking this resolver.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-syncconfig.html#cfn-appsync-functionconfiguration-syncconfig-conflictdetection
     */
    readonly conflictDetection: string;

    /**
     * The Conflict Resolution strategy to perform in the event of a conflict.
     *
     * - *OPTIMISTIC_CONCURRENCY* : Resolve conflicts by rejecting mutations when versions don't match the latest version at the server.
     * - *AUTOMERGE* : Resolve conflicts with the Automerge conflict resolution strategy.
     * - *LAMBDA* : Resolve conflicts with an AWS Lambda function supplied in the `LambdaConflictHandlerConfig` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-syncconfig.html#cfn-appsync-functionconfiguration-syncconfig-conflicthandler
     */
    readonly conflictHandler?: string;

    /**
     * The `LambdaConflictHandlerConfig` when configuring `LAMBDA` as the Conflict Handler.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-syncconfig.html#cfn-appsync-functionconfiguration-syncconfig-lambdaconflicthandlerconfig
     */
    readonly lambdaConflictHandlerConfig?: cdk.IResolvable | CfnFunctionConfiguration.LambdaConflictHandlerConfigProperty;
  }

  /**
   * The `LambdaConflictHandlerConfig` object when configuring `LAMBDA` as the Conflict Handler.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-lambdaconflicthandlerconfig.html
   */
  export interface LambdaConflictHandlerConfigProperty {
    /**
     * The Amazon Resource Name (ARN) for the Lambda function to use as the Conflict Handler.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-lambdaconflicthandlerconfig.html#cfn-appsync-functionconfiguration-lambdaconflicthandlerconfig-lambdaconflicthandlerarn
     */
    readonly lambdaConflictHandlerArn?: string;
  }

  /**
   * Describes a runtime used by an AWS AppSync resolver or AWS AppSync function.
   *
   * Specifies the name and version of the runtime to use. Note that if a runtime is specified, code must also be specified.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-appsyncruntime.html
   */
  export interface AppSyncRuntimeProperty {
    /**
     * The `name` of the runtime to use.
     *
     * Currently, the only allowed value is `APPSYNC_JS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-appsyncruntime.html#cfn-appsync-functionconfiguration-appsyncruntime-name
     */
    readonly name: string;

    /**
     * The `version` of the runtime to use.
     *
     * Currently, the only allowed version is `1.0.0` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-appsyncruntime.html#cfn-appsync-functionconfiguration-appsyncruntime-runtimeversion
     */
    readonly runtimeVersion: string;
  }
}

/**
 * Properties for defining a `CfnFunctionConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html
 */
export interface CfnFunctionConfigurationProps {
  /**
   * The AWS AppSync GraphQL API that you want to attach using this function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-apiid
   */
  readonly apiId: string;

  /**
   * The `resolver` code that contains the request and response functions.
   *
   * When code is used, the `runtime` is required. The runtime value must be `APPSYNC_JS` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-code
   */
  readonly code?: string;

  /**
   * The Amazon S3 endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-codes3location
   */
  readonly codeS3Location?: string;

  /**
   * The name of data source this function will attach.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-datasourcename
   */
  readonly dataSourceName: string;

  /**
   * The `Function` description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-description
   */
  readonly description?: string;

  /**
   * The version of the request mapping template.
   *
   * Currently, only the 2018-05-29 version of the template is supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-functionversion
   */
  readonly functionVersion?: string;

  /**
   * The maximum number of resolver request inputs that will be sent to a single AWS Lambda function in a `BatchInvoke` operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-maxbatchsize
   */
  readonly maxBatchSize?: number;

  /**
   * The name of the function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-name
   */
  readonly name: string;

  /**
   * The `Function` request mapping template.
   *
   * Functions support only the 2018-05-29 version of the request mapping template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-requestmappingtemplate
   */
  readonly requestMappingTemplate?: string;

  /**
   * Describes a Sync configuration for a resolver.
   *
   * Contains information on which Conflict Detection, as well as Resolution strategy, should be performed when the resolver is invoked.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-requestmappingtemplates3location
   */
  readonly requestMappingTemplateS3Location?: string;

  /**
   * The `Function` response mapping template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-responsemappingtemplate
   */
  readonly responseMappingTemplate?: string;

  /**
   * The location of a response mapping template in an Amazon S3 bucket.
   *
   * Use this if you want to provision with a template file in Amazon S3 rather than embedding it in your CloudFormation template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-responsemappingtemplates3location
   */
  readonly responseMappingTemplateS3Location?: string;

  /**
   * Describes a runtime used by an AWS AppSync resolver or AWS AppSync function.
   *
   * Specifies the name and version of the runtime to use. Note that if a runtime is specified, code must also be specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-runtime
   */
  readonly runtime?: CfnFunctionConfiguration.AppSyncRuntimeProperty | cdk.IResolvable;

  /**
   * Describes a Sync configuration for a resolver.
   *
   * Specifies which Conflict Detection strategy and Resolution strategy to use when the resolver is invoked.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-syncconfig
   */
  readonly syncConfig?: cdk.IResolvable | CfnFunctionConfiguration.SyncConfigProperty;
}

/**
 * Determine whether the given properties match those of a `LambdaConflictHandlerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConflictHandlerConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionConfigurationLambdaConflictHandlerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaConflictHandlerArn", cdk.validateString)(properties.lambdaConflictHandlerArn));
  return errors.wrap("supplied properties not correct for \"LambdaConflictHandlerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionConfigurationLambdaConflictHandlerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionConfigurationLambdaConflictHandlerConfigPropertyValidator(properties).assertSuccess();
  return {
    "LambdaConflictHandlerArn": cdk.stringToCloudFormation(properties.lambdaConflictHandlerArn)
  };
}

// @ts-ignore TS6133
function CfnFunctionConfigurationLambdaConflictHandlerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunctionConfiguration.LambdaConflictHandlerConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionConfiguration.LambdaConflictHandlerConfigProperty>();
  ret.addPropertyResult("lambdaConflictHandlerArn", "LambdaConflictHandlerArn", (properties.LambdaConflictHandlerArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaConflictHandlerArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SyncConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SyncConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionConfigurationSyncConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conflictDetection", cdk.requiredValidator)(properties.conflictDetection));
  errors.collect(cdk.propertyValidator("conflictDetection", cdk.validateString)(properties.conflictDetection));
  errors.collect(cdk.propertyValidator("conflictHandler", cdk.validateString)(properties.conflictHandler));
  errors.collect(cdk.propertyValidator("lambdaConflictHandlerConfig", CfnFunctionConfigurationLambdaConflictHandlerConfigPropertyValidator)(properties.lambdaConflictHandlerConfig));
  return errors.wrap("supplied properties not correct for \"SyncConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionConfigurationSyncConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionConfigurationSyncConfigPropertyValidator(properties).assertSuccess();
  return {
    "ConflictDetection": cdk.stringToCloudFormation(properties.conflictDetection),
    "ConflictHandler": cdk.stringToCloudFormation(properties.conflictHandler),
    "LambdaConflictHandlerConfig": convertCfnFunctionConfigurationLambdaConflictHandlerConfigPropertyToCloudFormation(properties.lambdaConflictHandlerConfig)
  };
}

// @ts-ignore TS6133
function CfnFunctionConfigurationSyncConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunctionConfiguration.SyncConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionConfiguration.SyncConfigProperty>();
  ret.addPropertyResult("conflictDetection", "ConflictDetection", (properties.ConflictDetection != null ? cfn_parse.FromCloudFormation.getString(properties.ConflictDetection) : undefined));
  ret.addPropertyResult("conflictHandler", "ConflictHandler", (properties.ConflictHandler != null ? cfn_parse.FromCloudFormation.getString(properties.ConflictHandler) : undefined));
  ret.addPropertyResult("lambdaConflictHandlerConfig", "LambdaConflictHandlerConfig", (properties.LambdaConflictHandlerConfig != null ? CfnFunctionConfigurationLambdaConflictHandlerConfigPropertyFromCloudFormation(properties.LambdaConflictHandlerConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AppSyncRuntimeProperty`
 *
 * @param properties - the TypeScript properties of a `AppSyncRuntimeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionConfigurationAppSyncRuntimePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("runtimeVersion", cdk.requiredValidator)(properties.runtimeVersion));
  errors.collect(cdk.propertyValidator("runtimeVersion", cdk.validateString)(properties.runtimeVersion));
  return errors.wrap("supplied properties not correct for \"AppSyncRuntimeProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionConfigurationAppSyncRuntimePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionConfigurationAppSyncRuntimePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "RuntimeVersion": cdk.stringToCloudFormation(properties.runtimeVersion)
  };
}

// @ts-ignore TS6133
function CfnFunctionConfigurationAppSyncRuntimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionConfiguration.AppSyncRuntimeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionConfiguration.AppSyncRuntimeProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("runtimeVersion", "RuntimeVersion", (properties.RuntimeVersion != null ? cfn_parse.FromCloudFormation.getString(properties.RuntimeVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFunctionConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnFunctionConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("code", cdk.validateString)(properties.code));
  errors.collect(cdk.propertyValidator("codeS3Location", cdk.validateString)(properties.codeS3Location));
  errors.collect(cdk.propertyValidator("dataSourceName", cdk.requiredValidator)(properties.dataSourceName));
  errors.collect(cdk.propertyValidator("dataSourceName", cdk.validateString)(properties.dataSourceName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("functionVersion", cdk.validateString)(properties.functionVersion));
  errors.collect(cdk.propertyValidator("maxBatchSize", cdk.validateNumber)(properties.maxBatchSize));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("requestMappingTemplate", cdk.validateString)(properties.requestMappingTemplate));
  errors.collect(cdk.propertyValidator("requestMappingTemplateS3Location", cdk.validateString)(properties.requestMappingTemplateS3Location));
  errors.collect(cdk.propertyValidator("responseMappingTemplate", cdk.validateString)(properties.responseMappingTemplate));
  errors.collect(cdk.propertyValidator("responseMappingTemplateS3Location", cdk.validateString)(properties.responseMappingTemplateS3Location));
  errors.collect(cdk.propertyValidator("runtime", CfnFunctionConfigurationAppSyncRuntimePropertyValidator)(properties.runtime));
  errors.collect(cdk.propertyValidator("syncConfig", CfnFunctionConfigurationSyncConfigPropertyValidator)(properties.syncConfig));
  return errors.wrap("supplied properties not correct for \"CfnFunctionConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnFunctionConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionConfigurationPropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "Code": cdk.stringToCloudFormation(properties.code),
    "CodeS3Location": cdk.stringToCloudFormation(properties.codeS3Location),
    "DataSourceName": cdk.stringToCloudFormation(properties.dataSourceName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FunctionVersion": cdk.stringToCloudFormation(properties.functionVersion),
    "MaxBatchSize": cdk.numberToCloudFormation(properties.maxBatchSize),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RequestMappingTemplate": cdk.stringToCloudFormation(properties.requestMappingTemplate),
    "RequestMappingTemplateS3Location": cdk.stringToCloudFormation(properties.requestMappingTemplateS3Location),
    "ResponseMappingTemplate": cdk.stringToCloudFormation(properties.responseMappingTemplate),
    "ResponseMappingTemplateS3Location": cdk.stringToCloudFormation(properties.responseMappingTemplateS3Location),
    "Runtime": convertCfnFunctionConfigurationAppSyncRuntimePropertyToCloudFormation(properties.runtime),
    "SyncConfig": convertCfnFunctionConfigurationSyncConfigPropertyToCloudFormation(properties.syncConfig)
  };
}

// @ts-ignore TS6133
function CfnFunctionConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionConfigurationProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("code", "Code", (properties.Code != null ? cfn_parse.FromCloudFormation.getString(properties.Code) : undefined));
  ret.addPropertyResult("codeS3Location", "CodeS3Location", (properties.CodeS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.CodeS3Location) : undefined));
  ret.addPropertyResult("dataSourceName", "DataSourceName", (properties.DataSourceName != null ? cfn_parse.FromCloudFormation.getString(properties.DataSourceName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("functionVersion", "FunctionVersion", (properties.FunctionVersion != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionVersion) : undefined));
  ret.addPropertyResult("maxBatchSize", "MaxBatchSize", (properties.MaxBatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBatchSize) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("requestMappingTemplate", "RequestMappingTemplate", (properties.RequestMappingTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.RequestMappingTemplate) : undefined));
  ret.addPropertyResult("requestMappingTemplateS3Location", "RequestMappingTemplateS3Location", (properties.RequestMappingTemplateS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.RequestMappingTemplateS3Location) : undefined));
  ret.addPropertyResult("responseMappingTemplate", "ResponseMappingTemplate", (properties.ResponseMappingTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseMappingTemplate) : undefined));
  ret.addPropertyResult("responseMappingTemplateS3Location", "ResponseMappingTemplateS3Location", (properties.ResponseMappingTemplateS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseMappingTemplateS3Location) : undefined));
  ret.addPropertyResult("runtime", "Runtime", (properties.Runtime != null ? CfnFunctionConfigurationAppSyncRuntimePropertyFromCloudFormation(properties.Runtime) : undefined));
  ret.addPropertyResult("syncConfig", "SyncConfig", (properties.SyncConfig != null ? CfnFunctionConfigurationSyncConfigPropertyFromCloudFormation(properties.SyncConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppSync::GraphQLApi` resource creates a new AWS AppSync GraphQL API.
 *
 * This is the top-level construct for your application. For more information, see [Quick Start](https://docs.aws.amazon.com/appsync/latest/devguide/quickstart.html) in the *AWS AppSync Developer Guide* .
 *
 * @cloudformationResource AWS::AppSync::GraphQLApi
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html
 */
export class CfnGraphQLApi extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppSync::GraphQLApi";

  /**
   * Build a CfnGraphQLApi from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGraphQLApi {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGraphQLApiPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGraphQLApi(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Unique AWS AppSync GraphQL API identifier.
   *
   * @cloudformationAttribute ApiId
   */
  public readonly attrApiId: string;

  /**
   * The Amazon Resource Name (ARN) of the API key, such as `arn:aws:appsync:us-east-1:123456789012:apis/graphqlapiid` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The fully qualified domain name (FQDN) of the endpoint URL of your GraphQL API.
   *
   * @cloudformationAttribute GraphQLDns
   */
  public readonly attrGraphQlDns: string;

  /**
   * The GraphQL endpoint ARN.
   *
   * @cloudformationAttribute GraphQLEndpointArn
   */
  public readonly attrGraphQlEndpointArn: string;

  /**
   * The Endpoint URL of your GraphQL API.
   *
   * @cloudformationAttribute GraphQLUrl
   */
  public readonly attrGraphQlUrl: string;

  /**
   * The ID value.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The fully qualified domain name (FQDN) of the real-time endpoint URL of your GraphQL API.
   *
   * @cloudformationAttribute RealtimeDns
   */
  public readonly attrRealtimeDns: string;

  /**
   * The GraphQL API real-time endpoint URL. For more information, see [Discovering the real-time endpoint from the GraphQL endpoint](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html#handshake-details-to-establish-the-websocket-connection) .
   *
   * @cloudformationAttribute RealtimeUrl
   */
  public readonly attrRealtimeUrl: string;

  /**
   * A list of additional authentication providers for the `GraphqlApi` API.
   */
  public additionalAuthenticationProviders?: Array<CfnGraphQLApi.AdditionalAuthenticationProviderProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The value that indicates whether the GraphQL API is a standard API ( `GRAPHQL` ) or merged API ( `MERGED` ).
   */
  public apiType?: string;

  /**
   * Security configuration for your GraphQL API.
   */
  public authenticationType: string;

  /**
   * Sets the value of the GraphQL API to enable ( `ENABLED` ) or disable ( `DISABLED` ) introspection.
   */
  public introspectionConfig?: string;

  /**
   * A `LambdaAuthorizerConfig` holds configuration on how to authorize AWS AppSync API access when using the `AWS_LAMBDA` authorizer mode.
   */
  public lambdaAuthorizerConfig?: cdk.IResolvable | CfnGraphQLApi.LambdaAuthorizerConfigProperty;

  /**
   * The Amazon CloudWatch Logs configuration.
   */
  public logConfig?: cdk.IResolvable | CfnGraphQLApi.LogConfigProperty;

  /**
   * The AWS Identity and Access Management service role ARN for a merged API.
   */
  public mergedApiExecutionRoleArn?: string;

  /**
   * The API name.
   */
  public name: string;

  /**
   * The OpenID Connect configuration.
   */
  public openIdConnectConfig?: cdk.IResolvable | CfnGraphQLApi.OpenIDConnectConfigProperty;

  /**
   * The owner contact information for an API resource.
   */
  public ownerContact?: string;

  /**
   * The maximum depth a query can have in a single request.
   */
  public queryDepthLimit?: number;

  /**
   * The maximum number of resolvers that can be invoked in a single request.
   */
  public resolverCountLimit?: number;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An arbitrary set of tags (key-value pairs) for this GraphQL API.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Optional authorization configuration for using Amazon Cognito user pools with your GraphQL endpoint.
   */
  public userPoolConfig?: cdk.IResolvable | CfnGraphQLApi.UserPoolConfigProperty;

  /**
   * Sets the scope of the GraphQL API to public ( `GLOBAL` ) or private ( `PRIVATE` ).
   */
  public visibility?: string;

  /**
   * A flag indicating whether to use AWS X-Ray tracing for this `GraphqlApi` .
   */
  public xrayEnabled?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGraphQLApiProps) {
    super(scope, id, {
      "type": CfnGraphQLApi.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "authenticationType", this);
    cdk.requireProperty(props, "name", this);

    this.attrApiId = cdk.Token.asString(this.getAtt("ApiId", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrGraphQlDns = cdk.Token.asString(this.getAtt("GraphQLDns", cdk.ResolutionTypeHint.STRING));
    this.attrGraphQlEndpointArn = cdk.Token.asString(this.getAtt("GraphQLEndpointArn", cdk.ResolutionTypeHint.STRING));
    this.attrGraphQlUrl = cdk.Token.asString(this.getAtt("GraphQLUrl", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrRealtimeDns = cdk.Token.asString(this.getAtt("RealtimeDns", cdk.ResolutionTypeHint.STRING));
    this.attrRealtimeUrl = cdk.Token.asString(this.getAtt("RealtimeUrl", cdk.ResolutionTypeHint.STRING));
    this.additionalAuthenticationProviders = props.additionalAuthenticationProviders;
    this.apiType = props.apiType;
    this.authenticationType = props.authenticationType;
    this.introspectionConfig = props.introspectionConfig;
    this.lambdaAuthorizerConfig = props.lambdaAuthorizerConfig;
    this.logConfig = props.logConfig;
    this.mergedApiExecutionRoleArn = props.mergedApiExecutionRoleArn;
    this.name = props.name;
    this.openIdConnectConfig = props.openIdConnectConfig;
    this.ownerContact = props.ownerContact;
    this.queryDepthLimit = props.queryDepthLimit;
    this.resolverCountLimit = props.resolverCountLimit;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppSync::GraphQLApi", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.userPoolConfig = props.userPoolConfig;
    this.visibility = props.visibility;
    this.xrayEnabled = props.xrayEnabled;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "additionalAuthenticationProviders": this.additionalAuthenticationProviders,
      "apiType": this.apiType,
      "authenticationType": this.authenticationType,
      "introspectionConfig": this.introspectionConfig,
      "lambdaAuthorizerConfig": this.lambdaAuthorizerConfig,
      "logConfig": this.logConfig,
      "mergedApiExecutionRoleArn": this.mergedApiExecutionRoleArn,
      "name": this.name,
      "openIdConnectConfig": this.openIdConnectConfig,
      "ownerContact": this.ownerContact,
      "queryDepthLimit": this.queryDepthLimit,
      "resolverCountLimit": this.resolverCountLimit,
      "tags": this.tags.renderTags(),
      "userPoolConfig": this.userPoolConfig,
      "visibility": this.visibility,
      "xrayEnabled": this.xrayEnabled
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGraphQLApi.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGraphQLApiPropsToCloudFormation(props);
  }
}

export namespace CfnGraphQLApi {
  /**
   * The `OpenIDConnectConfig` property type specifies the optional authorization configuration for using an OpenID Connect compliant service with your GraphQL endpoint for an AWS AppSync GraphQL API.
   *
   * `OpenIDConnectConfig` is a property of the [AWS::AppSync::GraphQLApi](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html
   */
  export interface OpenIDConnectConfigProperty {
    /**
     * The number of milliseconds that a token is valid after being authenticated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-authttl
     */
    readonly authTtl?: number;

    /**
     * The client identifier of the Relying party at the OpenID identity provider.
     *
     * This identifier is typically obtained when the Relying party is registered with the OpenID identity provider. You can specify a regular expression so that AWS AppSync can validate against multiple client identifiers at a time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-clientid
     */
    readonly clientId?: string;

    /**
     * The number of milliseconds that a token is valid after it's issued to a user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-iatttl
     */
    readonly iatTtl?: number;

    /**
     * The issuer for the OIDC configuration.
     *
     * The issuer returned by discovery must exactly match the value of `iss` in the ID token.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-issuer
     */
    readonly issuer?: string;
  }

  /**
   * Describes an additional authentication provider.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-additionalauthenticationprovider.html
   */
  export interface AdditionalAuthenticationProviderProperty {
    /**
     * The authentication type for API key, AWS Identity and Access Management , OIDC, Amazon Cognito user pools , or AWS Lambda .
     *
     * Valid Values: `API_KEY` | `AWS_IAM` | `OPENID_CONNECT` | `AMAZON_COGNITO_USER_POOLS` | `AWS_LAMBDA`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-additionalauthenticationprovider.html#cfn-appsync-graphqlapi-additionalauthenticationprovider-authenticationtype
     */
    readonly authenticationType: string;

    /**
     * Configuration for AWS Lambda function authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-additionalauthenticationprovider.html#cfn-appsync-graphqlapi-additionalauthenticationprovider-lambdaauthorizerconfig
     */
    readonly lambdaAuthorizerConfig?: cdk.IResolvable | CfnGraphQLApi.LambdaAuthorizerConfigProperty;

    /**
     * The OIDC configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-additionalauthenticationprovider.html#cfn-appsync-graphqlapi-additionalauthenticationprovider-openidconnectconfig
     */
    readonly openIdConnectConfig?: cdk.IResolvable | CfnGraphQLApi.OpenIDConnectConfigProperty;

    /**
     * The Amazon Cognito user pool configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-additionalauthenticationprovider.html#cfn-appsync-graphqlapi-additionalauthenticationprovider-userpoolconfig
     */
    readonly userPoolConfig?: CfnGraphQLApi.CognitoUserPoolConfigProperty | cdk.IResolvable;
  }

  /**
   * Configuration for AWS Lambda function authorization.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-lambdaauthorizerconfig.html
   */
  export interface LambdaAuthorizerConfigProperty {
    /**
     * The number of seconds a response should be cached for.
     *
     * The default is 0 seconds, which disables caching. If you don't specify a value for `authorizerResultTtlInSeconds` , the default value is used. The maximum value is one hour (3600 seconds). The Lambda function can override this by returning a `ttlOverride` key in its response.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-lambdaauthorizerconfig.html#cfn-appsync-graphqlapi-lambdaauthorizerconfig-authorizerresultttlinseconds
     */
    readonly authorizerResultTtlInSeconds?: number;

    /**
     * The ARN of the Lambda function to be called for authorization.
     *
     * This may be a standard Lambda ARN, a version ARN ( `.../v3` ) or alias ARN.
     *
     * *Note* : This Lambda function must have the following resource-based policy assigned to it. When configuring Lambda authorizers in the console, this is done for you. To do so with the AWS CLI , run the following:
     *
     * `aws lambda add-permission --function-name "arn:aws:lambda:us-east-2:111122223333:function:my-function" --statement-id "appsync" --principal appsync.amazonaws.com --action lambda:InvokeFunction`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-lambdaauthorizerconfig.html#cfn-appsync-graphqlapi-lambdaauthorizerconfig-authorizeruri
     */
    readonly authorizerUri?: string;

    /**
     * A regular expression for validation of tokens before the Lambda function is called.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-lambdaauthorizerconfig.html#cfn-appsync-graphqlapi-lambdaauthorizerconfig-identityvalidationexpression
     */
    readonly identityValidationExpression?: string;
  }

  /**
   * Describes an Amazon Cognito user pool configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-cognitouserpoolconfig.html
   */
  export interface CognitoUserPoolConfigProperty {
    /**
     * A regular expression for validating the incoming Amazon Cognito user pool app client ID.
     *
     * If this value isn't set, no filtering is applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-cognitouserpoolconfig.html#cfn-appsync-graphqlapi-cognitouserpoolconfig-appidclientregex
     */
    readonly appIdClientRegex?: string;

    /**
     * The AWS Region in which the user pool was created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-cognitouserpoolconfig.html#cfn-appsync-graphqlapi-cognitouserpoolconfig-awsregion
     */
    readonly awsRegion?: string;

    /**
     * The user pool ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-cognitouserpoolconfig.html#cfn-appsync-graphqlapi-cognitouserpoolconfig-userpoolid
     */
    readonly userPoolId?: string;
  }

  /**
   * The `UserPoolConfig` property type specifies the optional authorization configuration for using Amazon Cognito user pools with your GraphQL endpoint for an AWS AppSync GraphQL API.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-userpoolconfig.html
   */
  export interface UserPoolConfigProperty {
    /**
     * A regular expression for validating the incoming Amazon Cognito user pool app client ID.
     *
     * If this value isn't set, no filtering is applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-userpoolconfig.html#cfn-appsync-graphqlapi-userpoolconfig-appidclientregex
     */
    readonly appIdClientRegex?: string;

    /**
     * The AWS Region in which the user pool was created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-userpoolconfig.html#cfn-appsync-graphqlapi-userpoolconfig-awsregion
     */
    readonly awsRegion?: string;

    /**
     * The action that you want your GraphQL API to take when a request that uses Amazon Cognito user pool authentication doesn't match the Amazon Cognito user pool configuration.
     *
     * When specifying Amazon Cognito user pools as the default authentication, you must set the value for `DefaultAction` to `ALLOW` if specifying `AdditionalAuthenticationProviders` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-userpoolconfig.html#cfn-appsync-graphqlapi-userpoolconfig-defaultaction
     */
    readonly defaultAction?: string;

    /**
     * The user pool ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-userpoolconfig.html#cfn-appsync-graphqlapi-userpoolconfig-userpoolid
     */
    readonly userPoolId?: string;
  }

  /**
   * The `LogConfig` property type specifies the logging configuration when writing GraphQL operations and tracing to Amazon CloudWatch for an AWS AppSync GraphQL API.
   *
   * `LogConfig` is a property of the [AWS::AppSync::GraphQLApi](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-logconfig.html
   */
  export interface LogConfigProperty {
    /**
     * The service role that AWS AppSync will assume to publish to Amazon CloudWatch Logs in your account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-logconfig.html#cfn-appsync-graphqlapi-logconfig-cloudwatchlogsrolearn
     */
    readonly cloudWatchLogsRoleArn?: string;

    /**
     * Set to TRUE to exclude sections that contain information such as headers, context, and evaluated mapping templates, regardless of logging level.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-logconfig.html#cfn-appsync-graphqlapi-logconfig-excludeverbosecontent
     */
    readonly excludeVerboseContent?: boolean | cdk.IResolvable;

    /**
     * The field logging level. Values can be NONE, ERROR, or ALL.
     *
     * - *NONE* : No field-level logs are captured.
     * - *ERROR* : Logs the following information only for the fields that are in error:
     *
     * - The error section in the server response.
     * - Field-level errors.
     * - The generated request/response functions that got resolved for error fields.
     * - *ALL* : The following information is logged for all fields in the query:
     *
     * - Field-level tracing information.
     * - The generated request/response functions that got resolved for each field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-logconfig.html#cfn-appsync-graphqlapi-logconfig-fieldloglevel
     */
    readonly fieldLogLevel?: string;
  }
}

/**
 * Properties for defining a `CfnGraphQLApi`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html
 */
export interface CfnGraphQLApiProps {
  /**
   * A list of additional authentication providers for the `GraphqlApi` API.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-additionalauthenticationproviders
   */
  readonly additionalAuthenticationProviders?: Array<CfnGraphQLApi.AdditionalAuthenticationProviderProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The value that indicates whether the GraphQL API is a standard API ( `GRAPHQL` ) or merged API ( `MERGED` ).
   *
   * *WARNING* : If the `ApiType` has not been defined, *explicitly* setting it to `GRAPHQL` in a template/stack update will result in an API replacement and new DNS values.
   *
   * The following values are valid:
   *
   * `GRAPHQL | MERGED`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-apitype
   */
  readonly apiType?: string;

  /**
   * Security configuration for your GraphQL API.
   *
   * For allowed values (such as `API_KEY` , `AWS_IAM` , `AMAZON_COGNITO_USER_POOLS` , `OPENID_CONNECT` , or `AWS_LAMBDA` ), see [Security](https://docs.aws.amazon.com/appsync/latest/devguide/security.html) in the *AWS AppSync Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-authenticationtype
   */
  readonly authenticationType: string;

  /**
   * Sets the value of the GraphQL API to enable ( `ENABLED` ) or disable ( `DISABLED` ) introspection.
   *
   * If no value is provided, the introspection configuration will be set to `ENABLED` by default. This field will produce an error if the operation attempts to use the introspection feature while this field is disabled.
   *
   * For more information about introspection, see [GraphQL introspection](https://docs.aws.amazon.com/https://graphql.org/learn/introspection/) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-introspectionconfig
   */
  readonly introspectionConfig?: string;

  /**
   * A `LambdaAuthorizerConfig` holds configuration on how to authorize AWS AppSync API access when using the `AWS_LAMBDA` authorizer mode.
   *
   * Be aware that an AWS AppSync API may have only one Lambda authorizer configured at a time.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-lambdaauthorizerconfig
   */
  readonly lambdaAuthorizerConfig?: cdk.IResolvable | CfnGraphQLApi.LambdaAuthorizerConfigProperty;

  /**
   * The Amazon CloudWatch Logs configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-logconfig
   */
  readonly logConfig?: cdk.IResolvable | CfnGraphQLApi.LogConfigProperty;

  /**
   * The AWS Identity and Access Management service role ARN for a merged API.
   *
   * The AppSync service assumes this role on behalf of the Merged API to validate access to source APIs at runtime and to prompt the `AUTO_MERGE` to update the merged API endpoint with the source API changes automatically.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-mergedapiexecutionrolearn
   */
  readonly mergedApiExecutionRoleArn?: string;

  /**
   * The API name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-name
   */
  readonly name: string;

  /**
   * The OpenID Connect configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-openidconnectconfig
   */
  readonly openIdConnectConfig?: cdk.IResolvable | CfnGraphQLApi.OpenIDConnectConfigProperty;

  /**
   * The owner contact information for an API resource.
   *
   * This field accepts any string input with a length of 0 - 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-ownercontact
   */
  readonly ownerContact?: string;

  /**
   * The maximum depth a query can have in a single request.
   *
   * Depth refers to the amount of nested levels allowed in the body of query. The default value is `0` (or unspecified), which indicates there's no depth limit. If you set a limit, it can be between `1` and `75` nested levels. This field will produce a limit error if the operation falls out of bounds. Note that fields can still be set to nullable or non-nullable. If a non-nullable field produces an error, the error will be thrown upwards to the first nullable field available.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-querydepthlimit
   */
  readonly queryDepthLimit?: number;

  /**
   * The maximum number of resolvers that can be invoked in a single request.
   *
   * The default value is `0` (or unspecified), which will set the limit to `10000` . When specified, the limit value can be between `1` and `10000` . This field will produce a limit error if the operation falls out of bounds.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-resolvercountlimit
   */
  readonly resolverCountLimit?: number;

  /**
   * An arbitrary set of tags (key-value pairs) for this GraphQL API.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Optional authorization configuration for using Amazon Cognito user pools with your GraphQL endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-userpoolconfig
   */
  readonly userPoolConfig?: cdk.IResolvable | CfnGraphQLApi.UserPoolConfigProperty;

  /**
   * Sets the scope of the GraphQL API to public ( `GLOBAL` ) or private ( `PRIVATE` ).
   *
   * By default, the scope is set to `Global` if no value is provided.
   *
   * *WARNING* : If `Visibility` has not been defined, *explicitly* setting it to `GLOBAL` in a template/stack update will result in an API replacement and new DNS values.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-visibility
   */
  readonly visibility?: string;

  /**
   * A flag indicating whether to use AWS X-Ray tracing for this `GraphqlApi` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-xrayenabled
   */
  readonly xrayEnabled?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `OpenIDConnectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OpenIDConnectConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGraphQLApiOpenIDConnectConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authTtl", cdk.validateNumber)(properties.authTtl));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("iatTtl", cdk.validateNumber)(properties.iatTtl));
  errors.collect(cdk.propertyValidator("issuer", cdk.validateString)(properties.issuer));
  return errors.wrap("supplied properties not correct for \"OpenIDConnectConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnGraphQLApiOpenIDConnectConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGraphQLApiOpenIDConnectConfigPropertyValidator(properties).assertSuccess();
  return {
    "AuthTTL": cdk.numberToCloudFormation(properties.authTtl),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "IatTTL": cdk.numberToCloudFormation(properties.iatTtl),
    "Issuer": cdk.stringToCloudFormation(properties.issuer)
  };
}

// @ts-ignore TS6133
function CfnGraphQLApiOpenIDConnectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGraphQLApi.OpenIDConnectConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.OpenIDConnectConfigProperty>();
  ret.addPropertyResult("authTtl", "AuthTTL", (properties.AuthTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.AuthTTL) : undefined));
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("iatTtl", "IatTTL", (properties.IatTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.IatTTL) : undefined));
  ret.addPropertyResult("issuer", "Issuer", (properties.Issuer != null ? cfn_parse.FromCloudFormation.getString(properties.Issuer) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaAuthorizerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaAuthorizerConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGraphQLApiLambdaAuthorizerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizerResultTtlInSeconds", cdk.validateNumber)(properties.authorizerResultTtlInSeconds));
  errors.collect(cdk.propertyValidator("authorizerUri", cdk.validateString)(properties.authorizerUri));
  errors.collect(cdk.propertyValidator("identityValidationExpression", cdk.validateString)(properties.identityValidationExpression));
  return errors.wrap("supplied properties not correct for \"LambdaAuthorizerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnGraphQLApiLambdaAuthorizerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGraphQLApiLambdaAuthorizerConfigPropertyValidator(properties).assertSuccess();
  return {
    "AuthorizerResultTtlInSeconds": cdk.numberToCloudFormation(properties.authorizerResultTtlInSeconds),
    "AuthorizerUri": cdk.stringToCloudFormation(properties.authorizerUri),
    "IdentityValidationExpression": cdk.stringToCloudFormation(properties.identityValidationExpression)
  };
}

// @ts-ignore TS6133
function CfnGraphQLApiLambdaAuthorizerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGraphQLApi.LambdaAuthorizerConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.LambdaAuthorizerConfigProperty>();
  ret.addPropertyResult("authorizerResultTtlInSeconds", "AuthorizerResultTtlInSeconds", (properties.AuthorizerResultTtlInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.AuthorizerResultTtlInSeconds) : undefined));
  ret.addPropertyResult("authorizerUri", "AuthorizerUri", (properties.AuthorizerUri != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerUri) : undefined));
  ret.addPropertyResult("identityValidationExpression", "IdentityValidationExpression", (properties.IdentityValidationExpression != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityValidationExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CognitoUserPoolConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CognitoUserPoolConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGraphQLApiCognitoUserPoolConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appIdClientRegex", cdk.validateString)(properties.appIdClientRegex));
  errors.collect(cdk.propertyValidator("awsRegion", cdk.validateString)(properties.awsRegion));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  return errors.wrap("supplied properties not correct for \"CognitoUserPoolConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnGraphQLApiCognitoUserPoolConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGraphQLApiCognitoUserPoolConfigPropertyValidator(properties).assertSuccess();
  return {
    "AppIdClientRegex": cdk.stringToCloudFormation(properties.appIdClientRegex),
    "AwsRegion": cdk.stringToCloudFormation(properties.awsRegion),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId)
  };
}

// @ts-ignore TS6133
function CfnGraphQLApiCognitoUserPoolConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLApi.CognitoUserPoolConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.CognitoUserPoolConfigProperty>();
  ret.addPropertyResult("appIdClientRegex", "AppIdClientRegex", (properties.AppIdClientRegex != null ? cfn_parse.FromCloudFormation.getString(properties.AppIdClientRegex) : undefined));
  ret.addPropertyResult("awsRegion", "AwsRegion", (properties.AwsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsRegion) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AdditionalAuthenticationProviderProperty`
 *
 * @param properties - the TypeScript properties of a `AdditionalAuthenticationProviderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGraphQLApiAdditionalAuthenticationProviderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationType", cdk.requiredValidator)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("authenticationType", cdk.validateString)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("lambdaAuthorizerConfig", CfnGraphQLApiLambdaAuthorizerConfigPropertyValidator)(properties.lambdaAuthorizerConfig));
  errors.collect(cdk.propertyValidator("openIdConnectConfig", CfnGraphQLApiOpenIDConnectConfigPropertyValidator)(properties.openIdConnectConfig));
  errors.collect(cdk.propertyValidator("userPoolConfig", CfnGraphQLApiCognitoUserPoolConfigPropertyValidator)(properties.userPoolConfig));
  return errors.wrap("supplied properties not correct for \"AdditionalAuthenticationProviderProperty\"");
}

// @ts-ignore TS6133
function convertCfnGraphQLApiAdditionalAuthenticationProviderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGraphQLApiAdditionalAuthenticationProviderPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticationType": cdk.stringToCloudFormation(properties.authenticationType),
    "LambdaAuthorizerConfig": convertCfnGraphQLApiLambdaAuthorizerConfigPropertyToCloudFormation(properties.lambdaAuthorizerConfig),
    "OpenIDConnectConfig": convertCfnGraphQLApiOpenIDConnectConfigPropertyToCloudFormation(properties.openIdConnectConfig),
    "UserPoolConfig": convertCfnGraphQLApiCognitoUserPoolConfigPropertyToCloudFormation(properties.userPoolConfig)
  };
}

// @ts-ignore TS6133
function CfnGraphQLApiAdditionalAuthenticationProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLApi.AdditionalAuthenticationProviderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.AdditionalAuthenticationProviderProperty>();
  ret.addPropertyResult("authenticationType", "AuthenticationType", (properties.AuthenticationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationType) : undefined));
  ret.addPropertyResult("lambdaAuthorizerConfig", "LambdaAuthorizerConfig", (properties.LambdaAuthorizerConfig != null ? CfnGraphQLApiLambdaAuthorizerConfigPropertyFromCloudFormation(properties.LambdaAuthorizerConfig) : undefined));
  ret.addPropertyResult("openIdConnectConfig", "OpenIDConnectConfig", (properties.OpenIDConnectConfig != null ? CfnGraphQLApiOpenIDConnectConfigPropertyFromCloudFormation(properties.OpenIDConnectConfig) : undefined));
  ret.addPropertyResult("userPoolConfig", "UserPoolConfig", (properties.UserPoolConfig != null ? CfnGraphQLApiCognitoUserPoolConfigPropertyFromCloudFormation(properties.UserPoolConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UserPoolConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UserPoolConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGraphQLApiUserPoolConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appIdClientRegex", cdk.validateString)(properties.appIdClientRegex));
  errors.collect(cdk.propertyValidator("awsRegion", cdk.validateString)(properties.awsRegion));
  errors.collect(cdk.propertyValidator("defaultAction", cdk.validateString)(properties.defaultAction));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  return errors.wrap("supplied properties not correct for \"UserPoolConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnGraphQLApiUserPoolConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGraphQLApiUserPoolConfigPropertyValidator(properties).assertSuccess();
  return {
    "AppIdClientRegex": cdk.stringToCloudFormation(properties.appIdClientRegex),
    "AwsRegion": cdk.stringToCloudFormation(properties.awsRegion),
    "DefaultAction": cdk.stringToCloudFormation(properties.defaultAction),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId)
  };
}

// @ts-ignore TS6133
function CfnGraphQLApiUserPoolConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGraphQLApi.UserPoolConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.UserPoolConfigProperty>();
  ret.addPropertyResult("appIdClientRegex", "AppIdClientRegex", (properties.AppIdClientRegex != null ? cfn_parse.FromCloudFormation.getString(properties.AppIdClientRegex) : undefined));
  ret.addPropertyResult("awsRegion", "AwsRegion", (properties.AwsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsRegion) : undefined));
  ret.addPropertyResult("defaultAction", "DefaultAction", (properties.DefaultAction != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAction) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LogConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGraphQLApiLogConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogsRoleArn", cdk.validateString)(properties.cloudWatchLogsRoleArn));
  errors.collect(cdk.propertyValidator("excludeVerboseContent", cdk.validateBoolean)(properties.excludeVerboseContent));
  errors.collect(cdk.propertyValidator("fieldLogLevel", cdk.validateString)(properties.fieldLogLevel));
  return errors.wrap("supplied properties not correct for \"LogConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnGraphQLApiLogConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGraphQLApiLogConfigPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogsRoleArn": cdk.stringToCloudFormation(properties.cloudWatchLogsRoleArn),
    "ExcludeVerboseContent": cdk.booleanToCloudFormation(properties.excludeVerboseContent),
    "FieldLogLevel": cdk.stringToCloudFormation(properties.fieldLogLevel)
  };
}

// @ts-ignore TS6133
function CfnGraphQLApiLogConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGraphQLApi.LogConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.LogConfigProperty>();
  ret.addPropertyResult("cloudWatchLogsRoleArn", "CloudWatchLogsRoleArn", (properties.CloudWatchLogsRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogsRoleArn) : undefined));
  ret.addPropertyResult("excludeVerboseContent", "ExcludeVerboseContent", (properties.ExcludeVerboseContent != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExcludeVerboseContent) : undefined));
  ret.addPropertyResult("fieldLogLevel", "FieldLogLevel", (properties.FieldLogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.FieldLogLevel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGraphQLApiProps`
 *
 * @param properties - the TypeScript properties of a `CfnGraphQLApiProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGraphQLApiPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalAuthenticationProviders", cdk.listValidator(CfnGraphQLApiAdditionalAuthenticationProviderPropertyValidator))(properties.additionalAuthenticationProviders));
  errors.collect(cdk.propertyValidator("apiType", cdk.validateString)(properties.apiType));
  errors.collect(cdk.propertyValidator("authenticationType", cdk.requiredValidator)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("authenticationType", cdk.validateString)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("introspectionConfig", cdk.validateString)(properties.introspectionConfig));
  errors.collect(cdk.propertyValidator("lambdaAuthorizerConfig", CfnGraphQLApiLambdaAuthorizerConfigPropertyValidator)(properties.lambdaAuthorizerConfig));
  errors.collect(cdk.propertyValidator("logConfig", CfnGraphQLApiLogConfigPropertyValidator)(properties.logConfig));
  errors.collect(cdk.propertyValidator("mergedApiExecutionRoleArn", cdk.validateString)(properties.mergedApiExecutionRoleArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("openIdConnectConfig", CfnGraphQLApiOpenIDConnectConfigPropertyValidator)(properties.openIdConnectConfig));
  errors.collect(cdk.propertyValidator("ownerContact", cdk.validateString)(properties.ownerContact));
  errors.collect(cdk.propertyValidator("queryDepthLimit", cdk.validateNumber)(properties.queryDepthLimit));
  errors.collect(cdk.propertyValidator("resolverCountLimit", cdk.validateNumber)(properties.resolverCountLimit));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("userPoolConfig", CfnGraphQLApiUserPoolConfigPropertyValidator)(properties.userPoolConfig));
  errors.collect(cdk.propertyValidator("visibility", cdk.validateString)(properties.visibility));
  errors.collect(cdk.propertyValidator("xrayEnabled", cdk.validateBoolean)(properties.xrayEnabled));
  return errors.wrap("supplied properties not correct for \"CfnGraphQLApiProps\"");
}

// @ts-ignore TS6133
function convertCfnGraphQLApiPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGraphQLApiPropsValidator(properties).assertSuccess();
  return {
    "AdditionalAuthenticationProviders": cdk.listMapper(convertCfnGraphQLApiAdditionalAuthenticationProviderPropertyToCloudFormation)(properties.additionalAuthenticationProviders),
    "ApiType": cdk.stringToCloudFormation(properties.apiType),
    "AuthenticationType": cdk.stringToCloudFormation(properties.authenticationType),
    "IntrospectionConfig": cdk.stringToCloudFormation(properties.introspectionConfig),
    "LambdaAuthorizerConfig": convertCfnGraphQLApiLambdaAuthorizerConfigPropertyToCloudFormation(properties.lambdaAuthorizerConfig),
    "LogConfig": convertCfnGraphQLApiLogConfigPropertyToCloudFormation(properties.logConfig),
    "MergedApiExecutionRoleArn": cdk.stringToCloudFormation(properties.mergedApiExecutionRoleArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OpenIDConnectConfig": convertCfnGraphQLApiOpenIDConnectConfigPropertyToCloudFormation(properties.openIdConnectConfig),
    "OwnerContact": cdk.stringToCloudFormation(properties.ownerContact),
    "QueryDepthLimit": cdk.numberToCloudFormation(properties.queryDepthLimit),
    "ResolverCountLimit": cdk.numberToCloudFormation(properties.resolverCountLimit),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UserPoolConfig": convertCfnGraphQLApiUserPoolConfigPropertyToCloudFormation(properties.userPoolConfig),
    "Visibility": cdk.stringToCloudFormation(properties.visibility),
    "XrayEnabled": cdk.booleanToCloudFormation(properties.xrayEnabled)
  };
}

// @ts-ignore TS6133
function CfnGraphQLApiPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLApiProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApiProps>();
  ret.addPropertyResult("additionalAuthenticationProviders", "AdditionalAuthenticationProviders", (properties.AdditionalAuthenticationProviders != null ? cfn_parse.FromCloudFormation.getArray(CfnGraphQLApiAdditionalAuthenticationProviderPropertyFromCloudFormation)(properties.AdditionalAuthenticationProviders) : undefined));
  ret.addPropertyResult("apiType", "ApiType", (properties.ApiType != null ? cfn_parse.FromCloudFormation.getString(properties.ApiType) : undefined));
  ret.addPropertyResult("authenticationType", "AuthenticationType", (properties.AuthenticationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationType) : undefined));
  ret.addPropertyResult("introspectionConfig", "IntrospectionConfig", (properties.IntrospectionConfig != null ? cfn_parse.FromCloudFormation.getString(properties.IntrospectionConfig) : undefined));
  ret.addPropertyResult("lambdaAuthorizerConfig", "LambdaAuthorizerConfig", (properties.LambdaAuthorizerConfig != null ? CfnGraphQLApiLambdaAuthorizerConfigPropertyFromCloudFormation(properties.LambdaAuthorizerConfig) : undefined));
  ret.addPropertyResult("logConfig", "LogConfig", (properties.LogConfig != null ? CfnGraphQLApiLogConfigPropertyFromCloudFormation(properties.LogConfig) : undefined));
  ret.addPropertyResult("mergedApiExecutionRoleArn", "MergedApiExecutionRoleArn", (properties.MergedApiExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.MergedApiExecutionRoleArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("openIdConnectConfig", "OpenIDConnectConfig", (properties.OpenIDConnectConfig != null ? CfnGraphQLApiOpenIDConnectConfigPropertyFromCloudFormation(properties.OpenIDConnectConfig) : undefined));
  ret.addPropertyResult("ownerContact", "OwnerContact", (properties.OwnerContact != null ? cfn_parse.FromCloudFormation.getString(properties.OwnerContact) : undefined));
  ret.addPropertyResult("queryDepthLimit", "QueryDepthLimit", (properties.QueryDepthLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.QueryDepthLimit) : undefined));
  ret.addPropertyResult("resolverCountLimit", "ResolverCountLimit", (properties.ResolverCountLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ResolverCountLimit) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("userPoolConfig", "UserPoolConfig", (properties.UserPoolConfig != null ? CfnGraphQLApiUserPoolConfigPropertyFromCloudFormation(properties.UserPoolConfig) : undefined));
  ret.addPropertyResult("visibility", "Visibility", (properties.Visibility != null ? cfn_parse.FromCloudFormation.getString(properties.Visibility) : undefined));
  ret.addPropertyResult("xrayEnabled", "XrayEnabled", (properties.XrayEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.XrayEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppSync::GraphQLSchema` resource is used for your AWS AppSync GraphQL schema that controls the data model for your API.
 *
 * Schema files are text written in Schema Definition Language (SDL) format. For more information about schema authoring, see [Designing a GraphQL API](https://docs.aws.amazon.com/appsync/latest/devguide/designing-a-graphql-api.html) in the *AWS AppSync Developer Guide* .
 *
 * > When you submit an update, AWS CloudFormation updates resources based on differences between what you submit and the stack's current template. To cause this resource to be updated you must change a property value for this resource in the CloudFormation template. Changing the Amazon S3 file content without changing a property value will not result in an update operation.
 * >
 * > See [Update Behaviors of Stack Resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html) in the *AWS CloudFormation User Guide* .
 *
 * @cloudformationResource AWS::AppSync::GraphQLSchema
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html
 */
export class CfnGraphQLSchema extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppSync::GraphQLSchema";

  /**
   * Build a CfnGraphQLSchema from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGraphQLSchema {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGraphQLSchemaPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGraphQLSchema(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID value.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The AWS AppSync GraphQL API identifier to which you want to apply this schema.
   */
  public apiId: string;

  /**
   * The text representation of a GraphQL schema in SDL format.
   */
  public definition?: string;

  /**
   * The location of a GraphQL schema file in an Amazon S3 bucket.
   */
  public definitionS3Location?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGraphQLSchemaProps) {
    super(scope, id, {
      "type": CfnGraphQLSchema.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.definition = props.definition;
    this.definitionS3Location = props.definitionS3Location;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "definition": this.definition,
      "definitionS3Location": this.definitionS3Location
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGraphQLSchema.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGraphQLSchemaPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGraphQLSchema`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html
 */
export interface CfnGraphQLSchemaProps {
  /**
   * The AWS AppSync GraphQL API identifier to which you want to apply this schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-apiid
   */
  readonly apiId: string;

  /**
   * The text representation of a GraphQL schema in SDL format.
   *
   * For more information about using the `Ref` function, see [Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-definition
   */
  readonly definition?: string;

  /**
   * The location of a GraphQL schema file in an Amazon S3 bucket.
   *
   * Use this if you want to provision with the schema living in Amazon S3 rather than embedding it in your CloudFormation template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-definitions3location
   */
  readonly definitionS3Location?: string;
}

/**
 * Determine whether the given properties match those of a `CfnGraphQLSchemaProps`
 *
 * @param properties - the TypeScript properties of a `CfnGraphQLSchemaProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGraphQLSchemaPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("definition", cdk.validateString)(properties.definition));
  errors.collect(cdk.propertyValidator("definitionS3Location", cdk.validateString)(properties.definitionS3Location));
  return errors.wrap("supplied properties not correct for \"CfnGraphQLSchemaProps\"");
}

// @ts-ignore TS6133
function convertCfnGraphQLSchemaPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGraphQLSchemaPropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "Definition": cdk.stringToCloudFormation(properties.definition),
    "DefinitionS3Location": cdk.stringToCloudFormation(properties.definitionS3Location)
  };
}

// @ts-ignore TS6133
function CfnGraphQLSchemaPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLSchemaProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLSchemaProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? cfn_parse.FromCloudFormation.getString(properties.Definition) : undefined));
  ret.addPropertyResult("definitionS3Location", "DefinitionS3Location", (properties.DefinitionS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.DefinitionS3Location) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppSync::Resolver` resource defines the logical GraphQL resolver that you attach to fields in a schema.
 *
 * Request and response templates for resolvers are written in Apache Velocity Template Language (VTL) format. For more information about resolvers, see [Resolver Mapping Template Reference](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference.html) .
 *
 * > When you submit an update, AWS CloudFormation updates resources based on differences between what you submit and the stack's current template. To cause this resource to be updated you must change a property value for this resource in the CloudFormation template. Changing the Amazon S3 file content without changing a property value will not result in an update operation.
 * >
 * > See [Update Behaviors of Stack Resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html) in the *AWS CloudFormation User Guide* .
 *
 * @cloudformationResource AWS::AppSync::Resolver
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html
 */
export class CfnResolver extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppSync::Resolver";

  /**
   * Build a CfnResolver from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResolver {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResolverPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResolver(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The GraphQL field on a type that invokes the resolver.
   *
   * @cloudformationAttribute FieldName
   */
  public readonly attrFieldName: string;

  /**
   * ARN of the resolver, such as `arn:aws:appsync:us-east-1:123456789012:apis/graphqlapiid/types/typename/resolvers/resolvername` .
   *
   * @cloudformationAttribute ResolverArn
   */
  public readonly attrResolverArn: string;

  /**
   * The GraphQL type that invokes this resolver.
   *
   * @cloudformationAttribute TypeName
   */
  public readonly attrTypeName: string;

  /**
   * The AWS AppSync GraphQL API to which you want to attach this resolver.
   */
  public apiId: string;

  /**
   * The caching configuration for the resolver.
   */
  public cachingConfig?: CfnResolver.CachingConfigProperty | cdk.IResolvable;

  /**
   * The `resolver` code that contains the request and response functions.
   */
  public code?: string;

  /**
   * The Amazon S3 endpoint.
   */
  public codeS3Location?: string;

  /**
   * The resolver data source name.
   */
  public dataSourceName?: string;

  /**
   * The GraphQL field on a type that invokes the resolver.
   */
  public fieldName: string;

  /**
   * The resolver type.
   */
  public kind?: string;

  /**
   * The maximum number of resolver request inputs that will be sent to a single AWS Lambda function in a `BatchInvoke` operation.
   */
  public maxBatchSize?: number;

  /**
   * Functions linked with the pipeline resolver.
   */
  public pipelineConfig?: cdk.IResolvable | CfnResolver.PipelineConfigProperty;

  /**
   * The request mapping template.
   */
  public requestMappingTemplate?: string;

  /**
   * The location of a request mapping template in an Amazon S3 bucket.
   */
  public requestMappingTemplateS3Location?: string;

  /**
   * The response mapping template.
   */
  public responseMappingTemplate?: string;

  /**
   * The location of a response mapping template in an Amazon S3 bucket.
   */
  public responseMappingTemplateS3Location?: string;

  /**
   * Describes a runtime used by an AWS AppSync resolver or AWS AppSync function.
   */
  public runtime?: CfnResolver.AppSyncRuntimeProperty | cdk.IResolvable;

  /**
   * The `SyncConfig` for a resolver attached to a versioned data source.
   */
  public syncConfig?: cdk.IResolvable | CfnResolver.SyncConfigProperty;

  /**
   * The GraphQL type that invokes this resolver.
   */
  public typeName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResolverProps) {
    super(scope, id, {
      "type": CfnResolver.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "fieldName", this);
    cdk.requireProperty(props, "typeName", this);

    this.attrFieldName = cdk.Token.asString(this.getAtt("FieldName", cdk.ResolutionTypeHint.STRING));
    this.attrResolverArn = cdk.Token.asString(this.getAtt("ResolverArn", cdk.ResolutionTypeHint.STRING));
    this.attrTypeName = cdk.Token.asString(this.getAtt("TypeName", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.cachingConfig = props.cachingConfig;
    this.code = props.code;
    this.codeS3Location = props.codeS3Location;
    this.dataSourceName = props.dataSourceName;
    this.fieldName = props.fieldName;
    this.kind = props.kind;
    this.maxBatchSize = props.maxBatchSize;
    this.pipelineConfig = props.pipelineConfig;
    this.requestMappingTemplate = props.requestMappingTemplate;
    this.requestMappingTemplateS3Location = props.requestMappingTemplateS3Location;
    this.responseMappingTemplate = props.responseMappingTemplate;
    this.responseMappingTemplateS3Location = props.responseMappingTemplateS3Location;
    this.runtime = props.runtime;
    this.syncConfig = props.syncConfig;
    this.typeName = props.typeName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "cachingConfig": this.cachingConfig,
      "code": this.code,
      "codeS3Location": this.codeS3Location,
      "dataSourceName": this.dataSourceName,
      "fieldName": this.fieldName,
      "kind": this.kind,
      "maxBatchSize": this.maxBatchSize,
      "pipelineConfig": this.pipelineConfig,
      "requestMappingTemplate": this.requestMappingTemplate,
      "requestMappingTemplateS3Location": this.requestMappingTemplateS3Location,
      "responseMappingTemplate": this.responseMappingTemplate,
      "responseMappingTemplateS3Location": this.responseMappingTemplateS3Location,
      "runtime": this.runtime,
      "syncConfig": this.syncConfig,
      "typeName": this.typeName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResolver.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResolverPropsToCloudFormation(props);
  }
}

export namespace CfnResolver {
  /**
   * Use the `PipelineConfig` property type to specify `PipelineConfig` for an AWS AppSync resolver.
   *
   * `PipelineConfig` is a property of the [AWS::AppSync::Resolver](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-pipelineconfig.html
   */
  export interface PipelineConfigProperty {
    /**
     * A list of `Function` objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-pipelineconfig.html#cfn-appsync-resolver-pipelineconfig-functions
     */
    readonly functions?: Array<string>;
  }

  /**
   * Describes a Sync configuration for a resolver.
   *
   * Specifies which Conflict Detection strategy and Resolution strategy to use when the resolver is invoked.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-syncconfig.html
   */
  export interface SyncConfigProperty {
    /**
     * The Conflict Detection strategy to use.
     *
     * - *VERSION* : Detect conflicts based on object versions for this resolver.
     * - *NONE* : Do not detect conflicts when invoking this resolver.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-syncconfig.html#cfn-appsync-resolver-syncconfig-conflictdetection
     */
    readonly conflictDetection: string;

    /**
     * The Conflict Resolution strategy to perform in the event of a conflict.
     *
     * - *OPTIMISTIC_CONCURRENCY* : Resolve conflicts by rejecting mutations when versions don't match the latest version at the server.
     * - *AUTOMERGE* : Resolve conflicts with the Automerge conflict resolution strategy.
     * - *LAMBDA* : Resolve conflicts with an AWS Lambda function supplied in the `LambdaConflictHandlerConfig` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-syncconfig.html#cfn-appsync-resolver-syncconfig-conflicthandler
     */
    readonly conflictHandler?: string;

    /**
     * The `LambdaConflictHandlerConfig` when configuring `LAMBDA` as the Conflict Handler.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-syncconfig.html#cfn-appsync-resolver-syncconfig-lambdaconflicthandlerconfig
     */
    readonly lambdaConflictHandlerConfig?: cdk.IResolvable | CfnResolver.LambdaConflictHandlerConfigProperty;
  }

  /**
   * The `LambdaConflictHandlerConfig` when configuring LAMBDA as the Conflict Handler.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-lambdaconflicthandlerconfig.html
   */
  export interface LambdaConflictHandlerConfigProperty {
    /**
     * The Amazon Resource Name (ARN) for the Lambda function to use as the Conflict Handler.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-lambdaconflicthandlerconfig.html#cfn-appsync-resolver-lambdaconflicthandlerconfig-lambdaconflicthandlerarn
     */
    readonly lambdaConflictHandlerArn?: string;
  }

  /**
   * Describes a runtime used by an AWS AppSync resolver or AWS AppSync function.
   *
   * Specifies the name and version of the runtime to use. Note that if a runtime is specified, code must also be specified.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-appsyncruntime.html
   */
  export interface AppSyncRuntimeProperty {
    /**
     * The `name` of the runtime to use.
     *
     * Currently, the only allowed value is `APPSYNC_JS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-appsyncruntime.html#cfn-appsync-resolver-appsyncruntime-name
     */
    readonly name: string;

    /**
     * The `version` of the runtime to use.
     *
     * Currently, the only allowed version is `1.0.0` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-appsyncruntime.html#cfn-appsync-resolver-appsyncruntime-runtimeversion
     */
    readonly runtimeVersion: string;
  }

  /**
   * The caching configuration for a resolver that has caching activated.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-cachingconfig.html
   */
  export interface CachingConfigProperty {
    /**
     * The caching keys for a resolver that has caching activated.
     *
     * Valid values are entries from the `$context.arguments` , `$context.source` , and `$context.identity` maps.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-cachingconfig.html#cfn-appsync-resolver-cachingconfig-cachingkeys
     */
    readonly cachingKeys?: Array<string>;

    /**
     * The TTL in seconds for a resolver that has caching activated.
     *
     * Valid values are 1–3,600 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-cachingconfig.html#cfn-appsync-resolver-cachingconfig-ttl
     */
    readonly ttl: number;
  }
}

/**
 * Properties for defining a `CfnResolver`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html
 */
export interface CfnResolverProps {
  /**
   * The AWS AppSync GraphQL API to which you want to attach this resolver.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-apiid
   */
  readonly apiId: string;

  /**
   * The caching configuration for the resolver.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-cachingconfig
   */
  readonly cachingConfig?: CfnResolver.CachingConfigProperty | cdk.IResolvable;

  /**
   * The `resolver` code that contains the request and response functions.
   *
   * When code is used, the `runtime` is required. The runtime value must be `APPSYNC_JS` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-code
   */
  readonly code?: string;

  /**
   * The Amazon S3 endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-codes3location
   */
  readonly codeS3Location?: string;

  /**
   * The resolver data source name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-datasourcename
   */
  readonly dataSourceName?: string;

  /**
   * The GraphQL field on a type that invokes the resolver.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-fieldname
   */
  readonly fieldName: string;

  /**
   * The resolver type.
   *
   * - *UNIT* : A UNIT resolver type. A UNIT resolver is the default resolver type. You can use a UNIT resolver to run a GraphQL query against a single data source.
   * - *PIPELINE* : A PIPELINE resolver type. You can use a PIPELINE resolver to invoke a series of `Function` objects in a serial manner. You can use a pipeline resolver to run a GraphQL query against multiple data sources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-kind
   */
  readonly kind?: string;

  /**
   * The maximum number of resolver request inputs that will be sent to a single AWS Lambda function in a `BatchInvoke` operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-maxbatchsize
   */
  readonly maxBatchSize?: number;

  /**
   * Functions linked with the pipeline resolver.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-pipelineconfig
   */
  readonly pipelineConfig?: cdk.IResolvable | CfnResolver.PipelineConfigProperty;

  /**
   * The request mapping template.
   *
   * Request mapping templates are optional when using a Lambda data source. For all other data sources, a request mapping template is required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-requestmappingtemplate
   */
  readonly requestMappingTemplate?: string;

  /**
   * The location of a request mapping template in an Amazon S3 bucket.
   *
   * Use this if you want to provision with a template file in Amazon S3 rather than embedding it in your CloudFormation template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-requestmappingtemplates3location
   */
  readonly requestMappingTemplateS3Location?: string;

  /**
   * The response mapping template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-responsemappingtemplate
   */
  readonly responseMappingTemplate?: string;

  /**
   * The location of a response mapping template in an Amazon S3 bucket.
   *
   * Use this if you want to provision with a template file in Amazon S3 rather than embedding it in your CloudFormation template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-responsemappingtemplates3location
   */
  readonly responseMappingTemplateS3Location?: string;

  /**
   * Describes a runtime used by an AWS AppSync resolver or AWS AppSync function.
   *
   * Specifies the name and version of the runtime to use. Note that if a runtime is specified, code must also be specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-runtime
   */
  readonly runtime?: CfnResolver.AppSyncRuntimeProperty | cdk.IResolvable;

  /**
   * The `SyncConfig` for a resolver attached to a versioned data source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-syncconfig
   */
  readonly syncConfig?: cdk.IResolvable | CfnResolver.SyncConfigProperty;

  /**
   * The GraphQL type that invokes this resolver.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-typename
   */
  readonly typeName: string;
}

/**
 * Determine whether the given properties match those of a `PipelineConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PipelineConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResolverPipelineConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functions", cdk.listValidator(cdk.validateString))(properties.functions));
  return errors.wrap("supplied properties not correct for \"PipelineConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnResolverPipelineConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResolverPipelineConfigPropertyValidator(properties).assertSuccess();
  return {
    "Functions": cdk.listMapper(cdk.stringToCloudFormation)(properties.functions)
  };
}

// @ts-ignore TS6133
function CfnResolverPipelineConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResolver.PipelineConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolver.PipelineConfigProperty>();
  ret.addPropertyResult("functions", "Functions", (properties.Functions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Functions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaConflictHandlerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConflictHandlerConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResolverLambdaConflictHandlerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaConflictHandlerArn", cdk.validateString)(properties.lambdaConflictHandlerArn));
  return errors.wrap("supplied properties not correct for \"LambdaConflictHandlerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnResolverLambdaConflictHandlerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResolverLambdaConflictHandlerConfigPropertyValidator(properties).assertSuccess();
  return {
    "LambdaConflictHandlerArn": cdk.stringToCloudFormation(properties.lambdaConflictHandlerArn)
  };
}

// @ts-ignore TS6133
function CfnResolverLambdaConflictHandlerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResolver.LambdaConflictHandlerConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolver.LambdaConflictHandlerConfigProperty>();
  ret.addPropertyResult("lambdaConflictHandlerArn", "LambdaConflictHandlerArn", (properties.LambdaConflictHandlerArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaConflictHandlerArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SyncConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SyncConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResolverSyncConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conflictDetection", cdk.requiredValidator)(properties.conflictDetection));
  errors.collect(cdk.propertyValidator("conflictDetection", cdk.validateString)(properties.conflictDetection));
  errors.collect(cdk.propertyValidator("conflictHandler", cdk.validateString)(properties.conflictHandler));
  errors.collect(cdk.propertyValidator("lambdaConflictHandlerConfig", CfnResolverLambdaConflictHandlerConfigPropertyValidator)(properties.lambdaConflictHandlerConfig));
  return errors.wrap("supplied properties not correct for \"SyncConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnResolverSyncConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResolverSyncConfigPropertyValidator(properties).assertSuccess();
  return {
    "ConflictDetection": cdk.stringToCloudFormation(properties.conflictDetection),
    "ConflictHandler": cdk.stringToCloudFormation(properties.conflictHandler),
    "LambdaConflictHandlerConfig": convertCfnResolverLambdaConflictHandlerConfigPropertyToCloudFormation(properties.lambdaConflictHandlerConfig)
  };
}

// @ts-ignore TS6133
function CfnResolverSyncConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResolver.SyncConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolver.SyncConfigProperty>();
  ret.addPropertyResult("conflictDetection", "ConflictDetection", (properties.ConflictDetection != null ? cfn_parse.FromCloudFormation.getString(properties.ConflictDetection) : undefined));
  ret.addPropertyResult("conflictHandler", "ConflictHandler", (properties.ConflictHandler != null ? cfn_parse.FromCloudFormation.getString(properties.ConflictHandler) : undefined));
  ret.addPropertyResult("lambdaConflictHandlerConfig", "LambdaConflictHandlerConfig", (properties.LambdaConflictHandlerConfig != null ? CfnResolverLambdaConflictHandlerConfigPropertyFromCloudFormation(properties.LambdaConflictHandlerConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AppSyncRuntimeProperty`
 *
 * @param properties - the TypeScript properties of a `AppSyncRuntimeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResolverAppSyncRuntimePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("runtimeVersion", cdk.requiredValidator)(properties.runtimeVersion));
  errors.collect(cdk.propertyValidator("runtimeVersion", cdk.validateString)(properties.runtimeVersion));
  return errors.wrap("supplied properties not correct for \"AppSyncRuntimeProperty\"");
}

// @ts-ignore TS6133
function convertCfnResolverAppSyncRuntimePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResolverAppSyncRuntimePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "RuntimeVersion": cdk.stringToCloudFormation(properties.runtimeVersion)
  };
}

// @ts-ignore TS6133
function CfnResolverAppSyncRuntimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResolver.AppSyncRuntimeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolver.AppSyncRuntimeProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("runtimeVersion", "RuntimeVersion", (properties.RuntimeVersion != null ? cfn_parse.FromCloudFormation.getString(properties.RuntimeVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CachingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CachingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResolverCachingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cachingKeys", cdk.listValidator(cdk.validateString))(properties.cachingKeys));
  errors.collect(cdk.propertyValidator("ttl", cdk.requiredValidator)(properties.ttl));
  errors.collect(cdk.propertyValidator("ttl", cdk.validateNumber)(properties.ttl));
  return errors.wrap("supplied properties not correct for \"CachingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnResolverCachingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResolverCachingConfigPropertyValidator(properties).assertSuccess();
  return {
    "CachingKeys": cdk.listMapper(cdk.stringToCloudFormation)(properties.cachingKeys),
    "Ttl": cdk.numberToCloudFormation(properties.ttl)
  };
}

// @ts-ignore TS6133
function CfnResolverCachingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResolver.CachingConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolver.CachingConfigProperty>();
  ret.addPropertyResult("cachingKeys", "CachingKeys", (properties.CachingKeys != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CachingKeys) : undefined));
  ret.addPropertyResult("ttl", "Ttl", (properties.Ttl != null ? cfn_parse.FromCloudFormation.getNumber(properties.Ttl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnResolverProps`
 *
 * @param properties - the TypeScript properties of a `CfnResolverProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResolverPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("cachingConfig", CfnResolverCachingConfigPropertyValidator)(properties.cachingConfig));
  errors.collect(cdk.propertyValidator("code", cdk.validateString)(properties.code));
  errors.collect(cdk.propertyValidator("codeS3Location", cdk.validateString)(properties.codeS3Location));
  errors.collect(cdk.propertyValidator("dataSourceName", cdk.validateString)(properties.dataSourceName));
  errors.collect(cdk.propertyValidator("fieldName", cdk.requiredValidator)(properties.fieldName));
  errors.collect(cdk.propertyValidator("fieldName", cdk.validateString)(properties.fieldName));
  errors.collect(cdk.propertyValidator("kind", cdk.validateString)(properties.kind));
  errors.collect(cdk.propertyValidator("maxBatchSize", cdk.validateNumber)(properties.maxBatchSize));
  errors.collect(cdk.propertyValidator("pipelineConfig", CfnResolverPipelineConfigPropertyValidator)(properties.pipelineConfig));
  errors.collect(cdk.propertyValidator("requestMappingTemplate", cdk.validateString)(properties.requestMappingTemplate));
  errors.collect(cdk.propertyValidator("requestMappingTemplateS3Location", cdk.validateString)(properties.requestMappingTemplateS3Location));
  errors.collect(cdk.propertyValidator("responseMappingTemplate", cdk.validateString)(properties.responseMappingTemplate));
  errors.collect(cdk.propertyValidator("responseMappingTemplateS3Location", cdk.validateString)(properties.responseMappingTemplateS3Location));
  errors.collect(cdk.propertyValidator("runtime", CfnResolverAppSyncRuntimePropertyValidator)(properties.runtime));
  errors.collect(cdk.propertyValidator("syncConfig", CfnResolverSyncConfigPropertyValidator)(properties.syncConfig));
  errors.collect(cdk.propertyValidator("typeName", cdk.requiredValidator)(properties.typeName));
  errors.collect(cdk.propertyValidator("typeName", cdk.validateString)(properties.typeName));
  return errors.wrap("supplied properties not correct for \"CfnResolverProps\"");
}

// @ts-ignore TS6133
function convertCfnResolverPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResolverPropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "CachingConfig": convertCfnResolverCachingConfigPropertyToCloudFormation(properties.cachingConfig),
    "Code": cdk.stringToCloudFormation(properties.code),
    "CodeS3Location": cdk.stringToCloudFormation(properties.codeS3Location),
    "DataSourceName": cdk.stringToCloudFormation(properties.dataSourceName),
    "FieldName": cdk.stringToCloudFormation(properties.fieldName),
    "Kind": cdk.stringToCloudFormation(properties.kind),
    "MaxBatchSize": cdk.numberToCloudFormation(properties.maxBatchSize),
    "PipelineConfig": convertCfnResolverPipelineConfigPropertyToCloudFormation(properties.pipelineConfig),
    "RequestMappingTemplate": cdk.stringToCloudFormation(properties.requestMappingTemplate),
    "RequestMappingTemplateS3Location": cdk.stringToCloudFormation(properties.requestMappingTemplateS3Location),
    "ResponseMappingTemplate": cdk.stringToCloudFormation(properties.responseMappingTemplate),
    "ResponseMappingTemplateS3Location": cdk.stringToCloudFormation(properties.responseMappingTemplateS3Location),
    "Runtime": convertCfnResolverAppSyncRuntimePropertyToCloudFormation(properties.runtime),
    "SyncConfig": convertCfnResolverSyncConfigPropertyToCloudFormation(properties.syncConfig),
    "TypeName": cdk.stringToCloudFormation(properties.typeName)
  };
}

// @ts-ignore TS6133
function CfnResolverPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResolverProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolverProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("cachingConfig", "CachingConfig", (properties.CachingConfig != null ? CfnResolverCachingConfigPropertyFromCloudFormation(properties.CachingConfig) : undefined));
  ret.addPropertyResult("code", "Code", (properties.Code != null ? cfn_parse.FromCloudFormation.getString(properties.Code) : undefined));
  ret.addPropertyResult("codeS3Location", "CodeS3Location", (properties.CodeS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.CodeS3Location) : undefined));
  ret.addPropertyResult("dataSourceName", "DataSourceName", (properties.DataSourceName != null ? cfn_parse.FromCloudFormation.getString(properties.DataSourceName) : undefined));
  ret.addPropertyResult("fieldName", "FieldName", (properties.FieldName != null ? cfn_parse.FromCloudFormation.getString(properties.FieldName) : undefined));
  ret.addPropertyResult("kind", "Kind", (properties.Kind != null ? cfn_parse.FromCloudFormation.getString(properties.Kind) : undefined));
  ret.addPropertyResult("maxBatchSize", "MaxBatchSize", (properties.MaxBatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBatchSize) : undefined));
  ret.addPropertyResult("pipelineConfig", "PipelineConfig", (properties.PipelineConfig != null ? CfnResolverPipelineConfigPropertyFromCloudFormation(properties.PipelineConfig) : undefined));
  ret.addPropertyResult("requestMappingTemplate", "RequestMappingTemplate", (properties.RequestMappingTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.RequestMappingTemplate) : undefined));
  ret.addPropertyResult("requestMappingTemplateS3Location", "RequestMappingTemplateS3Location", (properties.RequestMappingTemplateS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.RequestMappingTemplateS3Location) : undefined));
  ret.addPropertyResult("responseMappingTemplate", "ResponseMappingTemplate", (properties.ResponseMappingTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseMappingTemplate) : undefined));
  ret.addPropertyResult("responseMappingTemplateS3Location", "ResponseMappingTemplateS3Location", (properties.ResponseMappingTemplateS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseMappingTemplateS3Location) : undefined));
  ret.addPropertyResult("runtime", "Runtime", (properties.Runtime != null ? CfnResolverAppSyncRuntimePropertyFromCloudFormation(properties.Runtime) : undefined));
  ret.addPropertyResult("syncConfig", "SyncConfig", (properties.SyncConfig != null ? CfnResolverSyncConfigPropertyFromCloudFormation(properties.SyncConfig) : undefined));
  ret.addPropertyResult("typeName", "TypeName", (properties.TypeName != null ? cfn_parse.FromCloudFormation.getString(properties.TypeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Describes the configuration of a source API.
 *
 * A source API is a GraphQL API that is linked to a merged API. There can be multiple source APIs attached to each merged API. When linked to a merged API, the source API's schema, data sources, and resolvers will be combined with other linked source API data to form a new, singular API. Source APIs can originate from your account or from other accounts via Resource Access Manager.
 *
 * @cloudformationResource AWS::AppSync::SourceApiAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-sourceapiassociation.html
 */
export class CfnSourceApiAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppSync::SourceApiAssociation";

  /**
   * Build a CfnSourceApiAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSourceApiAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSourceApiAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSourceApiAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the source API association.
   *
   * @cloudformationAttribute AssociationArn
   */
  public readonly attrAssociationArn: string;

  /**
   * The ID generated by the AppSync service for the source API association.
   *
   * @cloudformationAttribute AssociationId
   */
  public readonly attrAssociationId: string;

  /**
   * The datetime value of the last successful merge of the source API association. The result will be in UTC format and your local time zone.
   *
   * @cloudformationAttribute LastSuccessfulMergeDate
   */
  public readonly attrLastSuccessfulMergeDate: string;

  /**
   * The Amazon Resource Name (ARN) of the merged API.
   *
   * @cloudformationAttribute MergedApiArn
   */
  public readonly attrMergedApiArn: string;

  /**
   * The ID of the merged API.
   *
   * @cloudformationAttribute MergedApiId
   */
  public readonly attrMergedApiId: string;

  /**
   * The source API's Amazon Resource Name (ARN) value.
   *
   * @cloudformationAttribute SourceApiArn
   */
  public readonly attrSourceApiArn: string;

  /**
   * The state of the source API association.
   *
   * The following values are valid:
   *
   * `MERGE_SCHEDULED | MERGE_FAILED | MERGE_SUCCESS | MERGE_IN_PROGRESS | AUTO_MERGE_SCHEDULE_FAILED | DELETION_SCHEDULED | DELETION_IN_PROGRESS | DELETION_FAILED`
   *
   * @cloudformationAttribute SourceApiAssociationStatus
   */
  public readonly attrSourceApiAssociationStatus: string;

  /**
   * The message describing the state of the source API association.
   *
   * @cloudformationAttribute SourceApiAssociationStatusDetail
   */
  public readonly attrSourceApiAssociationStatusDetail: string;

  /**
   * The ID of the source API.
   *
   * @cloudformationAttribute SourceApiId
   */
  public readonly attrSourceApiId: string;

  /**
   * The description field of the association configuration.
   */
  public description?: string;

  /**
   * The identifier of the AppSync Merged API.
   */
  public mergedApiIdentifier?: string;

  /**
   * The `SourceApiAssociationConfig` object data.
   */
  public sourceApiAssociationConfig?: cdk.IResolvable | CfnSourceApiAssociation.SourceApiAssociationConfigProperty;

  /**
   * The identifier of the AppSync Source API.
   */
  public sourceApiIdentifier?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSourceApiAssociationProps = {}) {
    super(scope, id, {
      "type": CfnSourceApiAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrAssociationArn = cdk.Token.asString(this.getAtt("AssociationArn", cdk.ResolutionTypeHint.STRING));
    this.attrAssociationId = cdk.Token.asString(this.getAtt("AssociationId", cdk.ResolutionTypeHint.STRING));
    this.attrLastSuccessfulMergeDate = cdk.Token.asString(this.getAtt("LastSuccessfulMergeDate", cdk.ResolutionTypeHint.STRING));
    this.attrMergedApiArn = cdk.Token.asString(this.getAtt("MergedApiArn", cdk.ResolutionTypeHint.STRING));
    this.attrMergedApiId = cdk.Token.asString(this.getAtt("MergedApiId", cdk.ResolutionTypeHint.STRING));
    this.attrSourceApiArn = cdk.Token.asString(this.getAtt("SourceApiArn", cdk.ResolutionTypeHint.STRING));
    this.attrSourceApiAssociationStatus = cdk.Token.asString(this.getAtt("SourceApiAssociationStatus", cdk.ResolutionTypeHint.STRING));
    this.attrSourceApiAssociationStatusDetail = cdk.Token.asString(this.getAtt("SourceApiAssociationStatusDetail", cdk.ResolutionTypeHint.STRING));
    this.attrSourceApiId = cdk.Token.asString(this.getAtt("SourceApiId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.mergedApiIdentifier = props.mergedApiIdentifier;
    this.sourceApiAssociationConfig = props.sourceApiAssociationConfig;
    this.sourceApiIdentifier = props.sourceApiIdentifier;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "mergedApiIdentifier": this.mergedApiIdentifier,
      "sourceApiAssociationConfig": this.sourceApiAssociationConfig,
      "sourceApiIdentifier": this.sourceApiIdentifier
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSourceApiAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSourceApiAssociationPropsToCloudFormation(props);
  }
}

export namespace CfnSourceApiAssociation {
  /**
   * Describes properties used to specify configurations related to a source API.
   *
   * This is a property of the `AWS:AppSync:SourceApiAssociation` type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-sourceapiassociation-sourceapiassociationconfig.html
   */
  export interface SourceApiAssociationConfigProperty {
    /**
     * The property that indicates which merging option is enabled in the source API association.
     *
     * Valid merge types are `MANUAL_MERGE` (default) and `AUTO_MERGE` . Manual merges are the default behavior and require the user to trigger any changes from the source APIs to the merged API manually. Auto merges subscribe the merged API to the changes performed on the source APIs so that any change in the source APIs are also made to the merged API. Auto merges use `MergedApiExecutionRoleArn` to perform merge operations.
     *
     * The following values are valid:
     *
     * `MANUAL_MERGE | AUTO_MERGE`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-sourceapiassociation-sourceapiassociationconfig.html#cfn-appsync-sourceapiassociation-sourceapiassociationconfig-mergetype
     */
    readonly mergeType?: string;
  }
}

/**
 * Properties for defining a `CfnSourceApiAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-sourceapiassociation.html
 */
export interface CfnSourceApiAssociationProps {
  /**
   * The description field of the association configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-sourceapiassociation.html#cfn-appsync-sourceapiassociation-description
   */
  readonly description?: string;

  /**
   * The identifier of the AppSync Merged API.
   *
   * This is generated by the AppSync service. In most cases, Merged APIs (especially in your account) only require the API ID value or ARN of the merged API. However, Merged APIs from other accounts (cross-account use cases) strictly require the full resource ARN of the merged API.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-sourceapiassociation.html#cfn-appsync-sourceapiassociation-mergedapiidentifier
   */
  readonly mergedApiIdentifier?: string;

  /**
   * The `SourceApiAssociationConfig` object data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-sourceapiassociation.html#cfn-appsync-sourceapiassociation-sourceapiassociationconfig
   */
  readonly sourceApiAssociationConfig?: cdk.IResolvable | CfnSourceApiAssociation.SourceApiAssociationConfigProperty;

  /**
   * The identifier of the AppSync Source API.
   *
   * This is generated by the AppSync service. In most cases, source APIs (especially in your account) only require the API ID value or ARN of the source API. However, source APIs from other accounts (cross-account use cases) strictly require the full resource ARN of the source API.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-sourceapiassociation.html#cfn-appsync-sourceapiassociation-sourceapiidentifier
   */
  readonly sourceApiIdentifier?: string;
}

/**
 * Determine whether the given properties match those of a `SourceApiAssociationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SourceApiAssociationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSourceApiAssociationSourceApiAssociationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mergeType", cdk.validateString)(properties.mergeType));
  return errors.wrap("supplied properties not correct for \"SourceApiAssociationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnSourceApiAssociationSourceApiAssociationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSourceApiAssociationSourceApiAssociationConfigPropertyValidator(properties).assertSuccess();
  return {
    "MergeType": cdk.stringToCloudFormation(properties.mergeType)
  };
}

// @ts-ignore TS6133
function CfnSourceApiAssociationSourceApiAssociationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSourceApiAssociation.SourceApiAssociationConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSourceApiAssociation.SourceApiAssociationConfigProperty>();
  ret.addPropertyResult("mergeType", "MergeType", (properties.MergeType != null ? cfn_parse.FromCloudFormation.getString(properties.MergeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSourceApiAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSourceApiAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSourceApiAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("mergedApiIdentifier", cdk.validateString)(properties.mergedApiIdentifier));
  errors.collect(cdk.propertyValidator("sourceApiAssociationConfig", CfnSourceApiAssociationSourceApiAssociationConfigPropertyValidator)(properties.sourceApiAssociationConfig));
  errors.collect(cdk.propertyValidator("sourceApiIdentifier", cdk.validateString)(properties.sourceApiIdentifier));
  return errors.wrap("supplied properties not correct for \"CfnSourceApiAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnSourceApiAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSourceApiAssociationPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "MergedApiIdentifier": cdk.stringToCloudFormation(properties.mergedApiIdentifier),
    "SourceApiAssociationConfig": convertCfnSourceApiAssociationSourceApiAssociationConfigPropertyToCloudFormation(properties.sourceApiAssociationConfig),
    "SourceApiIdentifier": cdk.stringToCloudFormation(properties.sourceApiIdentifier)
  };
}

// @ts-ignore TS6133
function CfnSourceApiAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSourceApiAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSourceApiAssociationProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("mergedApiIdentifier", "MergedApiIdentifier", (properties.MergedApiIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.MergedApiIdentifier) : undefined));
  ret.addPropertyResult("sourceApiAssociationConfig", "SourceApiAssociationConfig", (properties.SourceApiAssociationConfig != null ? CfnSourceApiAssociationSourceApiAssociationConfigPropertyFromCloudFormation(properties.SourceApiAssociationConfig) : undefined));
  ret.addPropertyResult("sourceApiIdentifier", "SourceApiIdentifier", (properties.SourceApiIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SourceApiIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}