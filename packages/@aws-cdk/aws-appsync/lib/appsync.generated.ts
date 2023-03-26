// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T06:40:01.893Z","fingerprint":"tVOjpQVMIPV8vwls3Mu9KzlvHhE9Aq7Ng5RtgARrCLc="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnApiCache`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html
 */
export interface CfnApiCacheProps {

    /**
     * Caching behavior.
     *
     * - *FULL_REQUEST_CACHING* : All requests are fully cached.
     * - *PER_RESOLVER_CACHING* : Individual resolvers that you specify are cached.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-apicachingbehavior
     */
    readonly apiCachingBehavior: string;

    /**
     * The GraphQL API ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-apiid
     */
    readonly apiId: string;

    /**
     * TTL in seconds for cache entries.
     *
     * Valid values are 1–3,600 seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-ttl
     */
    readonly ttl: number;

    /**
     * The cache instance type. Valid values are
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-type
     */
    readonly type: string;

    /**
     * At-rest encryption flag for cache. You cannot update this setting after creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-atrestencryptionenabled
     */
    readonly atRestEncryptionEnabled?: boolean | cdk.IResolvable;

    /**
     * Transit encryption flag when connecting to cache. You cannot update this setting after creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-transitencryptionenabled
     */
    readonly transitEncryptionEnabled?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnApiCacheProps`
 *
 * @param properties - the TypeScript properties of a `CfnApiCacheProps`
 *
 * @returns the result of the validation.
 */
function CfnApiCachePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apiCachingBehavior', cdk.requiredValidator)(properties.apiCachingBehavior));
    errors.collect(cdk.propertyValidator('apiCachingBehavior', cdk.validateString)(properties.apiCachingBehavior));
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('atRestEncryptionEnabled', cdk.validateBoolean)(properties.atRestEncryptionEnabled));
    errors.collect(cdk.propertyValidator('transitEncryptionEnabled', cdk.validateBoolean)(properties.transitEncryptionEnabled));
    errors.collect(cdk.propertyValidator('ttl', cdk.requiredValidator)(properties.ttl));
    errors.collect(cdk.propertyValidator('ttl', cdk.validateNumber)(properties.ttl));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnApiCacheProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::ApiCache` resource
 *
 * @param properties - the TypeScript properties of a `CfnApiCacheProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::ApiCache` resource.
 */
// @ts-ignore TS6133
function cfnApiCachePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApiCachePropsValidator(properties).assertSuccess();
    return {
        ApiCachingBehavior: cdk.stringToCloudFormation(properties.apiCachingBehavior),
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        Ttl: cdk.numberToCloudFormation(properties.ttl),
        Type: cdk.stringToCloudFormation(properties.type),
        AtRestEncryptionEnabled: cdk.booleanToCloudFormation(properties.atRestEncryptionEnabled),
        TransitEncryptionEnabled: cdk.booleanToCloudFormation(properties.transitEncryptionEnabled),
    };
}

// @ts-ignore TS6133
function CfnApiCachePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiCacheProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiCacheProps>();
    ret.addPropertyResult('apiCachingBehavior', 'ApiCachingBehavior', cfn_parse.FromCloudFormation.getString(properties.ApiCachingBehavior));
    ret.addPropertyResult('apiId', 'ApiId', cfn_parse.FromCloudFormation.getString(properties.ApiId));
    ret.addPropertyResult('ttl', 'Ttl', cfn_parse.FromCloudFormation.getNumber(properties.Ttl));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('atRestEncryptionEnabled', 'AtRestEncryptionEnabled', properties.AtRestEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AtRestEncryptionEnabled) : undefined);
    ret.addPropertyResult('transitEncryptionEnabled', 'TransitEncryptionEnabled', properties.TransitEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TransitEncryptionEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppSync::ApiCache`
 *
 * The `AWS::AppSync::ApiCache` resource represents the input of a `CreateApiCache` operation.
 *
 * @cloudformationResource AWS::AppSync::ApiCache
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html
 */
export class CfnApiCache extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppSync::ApiCache";

    /**
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
        const ret = new CfnApiCache(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Caching behavior.
     *
     * - *FULL_REQUEST_CACHING* : All requests are fully cached.
     * - *PER_RESOLVER_CACHING* : Individual resolvers that you specify are cached.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-apicachingbehavior
     */
    public apiCachingBehavior: string;

    /**
     * The GraphQL API ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-apiid
     */
    public apiId: string;

    /**
     * TTL in seconds for cache entries.
     *
     * Valid values are 1–3,600 seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-ttl
     */
    public ttl: number;

    /**
     * The cache instance type. Valid values are
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-type
     */
    public type: string;

    /**
     * At-rest encryption flag for cache. You cannot update this setting after creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-atrestencryptionenabled
     */
    public atRestEncryptionEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * Transit encryption flag when connecting to cache. You cannot update this setting after creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apicache.html#cfn-appsync-apicache-transitencryptionenabled
     */
    public transitEncryptionEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::AppSync::ApiCache`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApiCacheProps) {
        super(scope, id, { type: CfnApiCache.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'apiCachingBehavior', this);
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'ttl', this);
        cdk.requireProperty(props, 'type', this);

        this.apiCachingBehavior = props.apiCachingBehavior;
        this.apiId = props.apiId;
        this.ttl = props.ttl;
        this.type = props.type;
        this.atRestEncryptionEnabled = props.atRestEncryptionEnabled;
        this.transitEncryptionEnabled = props.transitEncryptionEnabled;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApiCache.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            apiCachingBehavior: this.apiCachingBehavior,
            apiId: this.apiId,
            ttl: this.ttl,
            type: this.type,
            atRestEncryptionEnabled: this.atRestEncryptionEnabled,
            transitEncryptionEnabled: this.transitEncryptionEnabled,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApiCachePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnApiKey`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html
 */
export interface CfnApiKeyProps {

    /**
     * Unique AWS AppSync GraphQL API ID for this API key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html#cfn-appsync-apikey-apiid
     */
    readonly apiId: string;

    /**
     * The API key ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html#cfn-appsync-apikey-apikeyid
     */
    readonly apiKeyId?: string;

    /**
     * Unique description of your API key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html#cfn-appsync-apikey-description
     */
    readonly description?: string;

    /**
     * The time after which the API key expires. The date is represented as seconds since the epoch, rounded down to the nearest hour.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html#cfn-appsync-apikey-expires
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
function CfnApiKeyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiKeyId', cdk.validateString)(properties.apiKeyId));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('expires', cdk.validateNumber)(properties.expires));
    return errors.wrap('supplied properties not correct for "CfnApiKeyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::ApiKey` resource
 *
 * @param properties - the TypeScript properties of a `CfnApiKeyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::ApiKey` resource.
 */
// @ts-ignore TS6133
function cfnApiKeyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApiKeyPropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        ApiKeyId: cdk.stringToCloudFormation(properties.apiKeyId),
        Description: cdk.stringToCloudFormation(properties.description),
        Expires: cdk.numberToCloudFormation(properties.expires),
    };
}

// @ts-ignore TS6133
function CfnApiKeyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiKeyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiKeyProps>();
    ret.addPropertyResult('apiId', 'ApiId', cfn_parse.FromCloudFormation.getString(properties.ApiId));
    ret.addPropertyResult('apiKeyId', 'ApiKeyId', properties.ApiKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiKeyId) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('expires', 'Expires', properties.Expires != null ? cfn_parse.FromCloudFormation.getNumber(properties.Expires) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppSync::ApiKey`
 *
 * The `AWS::AppSync::ApiKey` resource creates a unique key that you can distribute to clients who are executing GraphQL operations with AWS AppSync that require an API key.
 *
 * @cloudformationResource AWS::AppSync::ApiKey
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html
 */
export class CfnApiKey extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppSync::ApiKey";

    /**
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
        const ret = new CfnApiKey(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The API key.
     * @cloudformationAttribute ApiKey
     */
    public readonly attrApiKey: string;

    /**
     * The Amazon Resource Name (ARN) of the API key, such as `arn:aws:appsync:us-east-1:123456789012:apis/graphqlapiid/apikey/apikeya1bzhi` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Unique AWS AppSync GraphQL API ID for this API key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html#cfn-appsync-apikey-apiid
     */
    public apiId: string;

    /**
     * The API key ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html#cfn-appsync-apikey-apikeyid
     */
    public apiKeyId: string | undefined;

    /**
     * Unique description of your API key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html#cfn-appsync-apikey-description
     */
    public description: string | undefined;

    /**
     * The time after which the API key expires. The date is represented as seconds since the epoch, rounded down to the nearest hour.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html#cfn-appsync-apikey-expires
     */
    public expires: number | undefined;

    /**
     * Create a new `AWS::AppSync::ApiKey`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApiKeyProps) {
        super(scope, id, { type: CfnApiKey.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'apiId', this);
        this.attrApiKey = cdk.Token.asString(this.getAtt('ApiKey', cdk.ResolutionTypeHint.STRING));
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.apiId = props.apiId;
        this.apiKeyId = props.apiKeyId;
        this.description = props.description;
        this.expires = props.expires;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApiKey.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            apiId: this.apiId,
            apiKeyId: this.apiKeyId,
            description: this.description,
            expires: this.expires,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApiKeyPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnDataSource`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html
 */
export interface CfnDataSourceProps {

    /**
     * Unique AWS AppSync GraphQL API identifier where this data source will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-apiid
     */
    readonly apiId: string;

    /**
     * Friendly name for you to identify your AppSync data source after creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-name
     */
    readonly name: string;

    /**
     * The type of the data source.
     *
     * - *AWS_LAMBDA* : The data source is an AWS Lambda function.
     * - *AMAZON_DYNAMODB* : The data source is an Amazon DynamoDB table.
     * - *AMAZON_ELASTICSEARCH* : The data source is an Amazon OpenSearch Service domain.
     * - *AMAZON_OPENSEARCH_SERVICE* : The data source is an Amazon OpenSearch Service domain.
     * - *NONE* : There is no data source. This type is used when you wish to invoke a GraphQL operation without connecting to a data source, such as performing data transformation with resolvers or triggering a subscription to be invoked from a mutation.
     * - *HTTP* : The data source is an HTTP endpoint.
     * - *RELATIONAL_DATABASE* : The data source is a relational database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-type
     */
    readonly type: string;

    /**
     * The description of the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-description
     */
    readonly description?: string;

    /**
     * AWS Region and TableName for an Amazon DynamoDB table in your account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-dynamodbconfig
     */
    readonly dynamoDbConfig?: CfnDataSource.DynamoDBConfigProperty | cdk.IResolvable;

    /**
     * AWS Region and Endpoints for an Amazon OpenSearch Service domain in your account.
     *
     * As of September 2021, Amazon Elasticsearch Service is Amazon OpenSearch Service . This property is deprecated. For new data sources, use *OpenSearchServiceConfig* to specify an OpenSearch Service data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-elasticsearchconfig
     */
    readonly elasticsearchConfig?: CfnDataSource.ElasticsearchConfigProperty | cdk.IResolvable;

    /**
     * `AWS::AppSync::DataSource.EventBridgeConfig`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-eventbridgeconfig
     */
    readonly eventBridgeConfig?: CfnDataSource.EventBridgeConfigProperty | cdk.IResolvable;

    /**
     * Endpoints for an HTTP data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-httpconfig
     */
    readonly httpConfig?: CfnDataSource.HttpConfigProperty | cdk.IResolvable;

    /**
     * An ARN of a Lambda function in valid ARN format. This can be the ARN of a Lambda function that exists in the current account or in another account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-lambdaconfig
     */
    readonly lambdaConfig?: CfnDataSource.LambdaConfigProperty | cdk.IResolvable;

    /**
     * AWS Region and Endpoints for an Amazon OpenSearch Service domain in your account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-opensearchserviceconfig
     */
    readonly openSearchServiceConfig?: CfnDataSource.OpenSearchServiceConfigProperty | cdk.IResolvable;

    /**
     * Relational Database configuration of the relational database data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-relationaldatabaseconfig
     */
    readonly relationalDatabaseConfig?: CfnDataSource.RelationalDatabaseConfigProperty | cdk.IResolvable;

    /**
     * The AWS Identity and Access Management service role ARN for the data source. The system assumes this role when accessing the data source.
     *
     * Required if `Type` is specified as `AWS_LAMBDA` , `AMAZON_DYNAMODB` , `AMAZON_ELASTICSEARCH` , or `AMAZON_OPENSEARCH_SERVICE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-servicerolearn
     */
    readonly serviceRoleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDataSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataSourceProps`
 *
 * @returns the result of the validation.
 */
function CfnDataSourcePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('dynamoDbConfig', CfnDataSource_DynamoDBConfigPropertyValidator)(properties.dynamoDbConfig));
    errors.collect(cdk.propertyValidator('elasticsearchConfig', CfnDataSource_ElasticsearchConfigPropertyValidator)(properties.elasticsearchConfig));
    errors.collect(cdk.propertyValidator('eventBridgeConfig', CfnDataSource_EventBridgeConfigPropertyValidator)(properties.eventBridgeConfig));
    errors.collect(cdk.propertyValidator('httpConfig', CfnDataSource_HttpConfigPropertyValidator)(properties.httpConfig));
    errors.collect(cdk.propertyValidator('lambdaConfig', CfnDataSource_LambdaConfigPropertyValidator)(properties.lambdaConfig));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('openSearchServiceConfig', CfnDataSource_OpenSearchServiceConfigPropertyValidator)(properties.openSearchServiceConfig));
    errors.collect(cdk.propertyValidator('relationalDatabaseConfig', CfnDataSource_RelationalDatabaseConfigPropertyValidator)(properties.relationalDatabaseConfig));
    errors.collect(cdk.propertyValidator('serviceRoleArn', cdk.validateString)(properties.serviceRoleArn));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnDataSourceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource` resource
 *
 * @param properties - the TypeScript properties of a `CfnDataSourceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource` resource.
 */
// @ts-ignore TS6133
function cfnDataSourcePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSourcePropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
        Description: cdk.stringToCloudFormation(properties.description),
        DynamoDBConfig: cfnDataSourceDynamoDBConfigPropertyToCloudFormation(properties.dynamoDbConfig),
        ElasticsearchConfig: cfnDataSourceElasticsearchConfigPropertyToCloudFormation(properties.elasticsearchConfig),
        EventBridgeConfig: cfnDataSourceEventBridgeConfigPropertyToCloudFormation(properties.eventBridgeConfig),
        HttpConfig: cfnDataSourceHttpConfigPropertyToCloudFormation(properties.httpConfig),
        LambdaConfig: cfnDataSourceLambdaConfigPropertyToCloudFormation(properties.lambdaConfig),
        OpenSearchServiceConfig: cfnDataSourceOpenSearchServiceConfigPropertyToCloudFormation(properties.openSearchServiceConfig),
        RelationalDatabaseConfig: cfnDataSourceRelationalDatabaseConfigPropertyToCloudFormation(properties.relationalDatabaseConfig),
        ServiceRoleArn: cdk.stringToCloudFormation(properties.serviceRoleArn),
    };
}

// @ts-ignore TS6133
function CfnDataSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSourceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSourceProps>();
    ret.addPropertyResult('apiId', 'ApiId', cfn_parse.FromCloudFormation.getString(properties.ApiId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('dynamoDbConfig', 'DynamoDBConfig', properties.DynamoDBConfig != null ? CfnDataSourceDynamoDBConfigPropertyFromCloudFormation(properties.DynamoDBConfig) : undefined);
    ret.addPropertyResult('elasticsearchConfig', 'ElasticsearchConfig', properties.ElasticsearchConfig != null ? CfnDataSourceElasticsearchConfigPropertyFromCloudFormation(properties.ElasticsearchConfig) : undefined);
    ret.addPropertyResult('eventBridgeConfig', 'EventBridgeConfig', properties.EventBridgeConfig != null ? CfnDataSourceEventBridgeConfigPropertyFromCloudFormation(properties.EventBridgeConfig) : undefined);
    ret.addPropertyResult('httpConfig', 'HttpConfig', properties.HttpConfig != null ? CfnDataSourceHttpConfigPropertyFromCloudFormation(properties.HttpConfig) : undefined);
    ret.addPropertyResult('lambdaConfig', 'LambdaConfig', properties.LambdaConfig != null ? CfnDataSourceLambdaConfigPropertyFromCloudFormation(properties.LambdaConfig) : undefined);
    ret.addPropertyResult('openSearchServiceConfig', 'OpenSearchServiceConfig', properties.OpenSearchServiceConfig != null ? CfnDataSourceOpenSearchServiceConfigPropertyFromCloudFormation(properties.OpenSearchServiceConfig) : undefined);
    ret.addPropertyResult('relationalDatabaseConfig', 'RelationalDatabaseConfig', properties.RelationalDatabaseConfig != null ? CfnDataSourceRelationalDatabaseConfigPropertyFromCloudFormation(properties.RelationalDatabaseConfig) : undefined);
    ret.addPropertyResult('serviceRoleArn', 'ServiceRoleArn', properties.ServiceRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppSync::DataSource`
 *
 * The `AWS::AppSync::DataSource` resource creates data sources for resolvers in AWS AppSync to connect to, such as Amazon DynamoDB , AWS Lambda , and Amazon OpenSearch Service . Resolvers use these data sources to fetch data when clients make GraphQL calls.
 *
 * @cloudformationResource AWS::AppSync::DataSource
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html
 */
export class CfnDataSource extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppSync::DataSource";

    /**
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
        const ret = new CfnDataSource(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the API key, such as `arn:aws:appsync:us-east-1:123456789012:apis/graphqlapiid/datasources/datasourcename` .
     * @cloudformationAttribute DataSourceArn
     */
    public readonly attrDataSourceArn: string;

    /**
     * Friendly name for you to identify your AWS AppSync data source after creation.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * Unique AWS AppSync GraphQL API identifier where this data source will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-apiid
     */
    public apiId: string;

    /**
     * Friendly name for you to identify your AppSync data source after creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-name
     */
    public name: string;

    /**
     * The type of the data source.
     *
     * - *AWS_LAMBDA* : The data source is an AWS Lambda function.
     * - *AMAZON_DYNAMODB* : The data source is an Amazon DynamoDB table.
     * - *AMAZON_ELASTICSEARCH* : The data source is an Amazon OpenSearch Service domain.
     * - *AMAZON_OPENSEARCH_SERVICE* : The data source is an Amazon OpenSearch Service domain.
     * - *NONE* : There is no data source. This type is used when you wish to invoke a GraphQL operation without connecting to a data source, such as performing data transformation with resolvers or triggering a subscription to be invoked from a mutation.
     * - *HTTP* : The data source is an HTTP endpoint.
     * - *RELATIONAL_DATABASE* : The data source is a relational database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-type
     */
    public type: string;

    /**
     * The description of the data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-description
     */
    public description: string | undefined;

    /**
     * AWS Region and TableName for an Amazon DynamoDB table in your account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-dynamodbconfig
     */
    public dynamoDbConfig: CfnDataSource.DynamoDBConfigProperty | cdk.IResolvable | undefined;

    /**
     * AWS Region and Endpoints for an Amazon OpenSearch Service domain in your account.
     *
     * As of September 2021, Amazon Elasticsearch Service is Amazon OpenSearch Service . This property is deprecated. For new data sources, use *OpenSearchServiceConfig* to specify an OpenSearch Service data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-elasticsearchconfig
     */
    public elasticsearchConfig: CfnDataSource.ElasticsearchConfigProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::AppSync::DataSource.EventBridgeConfig`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-eventbridgeconfig
     */
    public eventBridgeConfig: CfnDataSource.EventBridgeConfigProperty | cdk.IResolvable | undefined;

    /**
     * Endpoints for an HTTP data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-httpconfig
     */
    public httpConfig: CfnDataSource.HttpConfigProperty | cdk.IResolvable | undefined;

    /**
     * An ARN of a Lambda function in valid ARN format. This can be the ARN of a Lambda function that exists in the current account or in another account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-lambdaconfig
     */
    public lambdaConfig: CfnDataSource.LambdaConfigProperty | cdk.IResolvable | undefined;

    /**
     * AWS Region and Endpoints for an Amazon OpenSearch Service domain in your account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-opensearchserviceconfig
     */
    public openSearchServiceConfig: CfnDataSource.OpenSearchServiceConfigProperty | cdk.IResolvable | undefined;

    /**
     * Relational Database configuration of the relational database data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-relationaldatabaseconfig
     */
    public relationalDatabaseConfig: CfnDataSource.RelationalDatabaseConfigProperty | cdk.IResolvable | undefined;

    /**
     * The AWS Identity and Access Management service role ARN for the data source. The system assumes this role when accessing the data source.
     *
     * Required if `Type` is specified as `AWS_LAMBDA` , `AMAZON_DYNAMODB` , `AMAZON_ELASTICSEARCH` , or `AMAZON_OPENSEARCH_SERVICE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-servicerolearn
     */
    public serviceRoleArn: string | undefined;

    /**
     * Create a new `AWS::AppSync::DataSource`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDataSourceProps) {
        super(scope, id, { type: CfnDataSource.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'type', this);
        this.attrDataSourceArn = cdk.Token.asString(this.getAtt('DataSourceArn', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.apiId = props.apiId;
        this.name = props.name;
        this.type = props.type;
        this.description = props.description;
        this.dynamoDbConfig = props.dynamoDbConfig;
        this.elasticsearchConfig = props.elasticsearchConfig;
        this.eventBridgeConfig = props.eventBridgeConfig;
        this.httpConfig = props.httpConfig;
        this.lambdaConfig = props.lambdaConfig;
        this.openSearchServiceConfig = props.openSearchServiceConfig;
        this.relationalDatabaseConfig = props.relationalDatabaseConfig;
        this.serviceRoleArn = props.serviceRoleArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataSource.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            apiId: this.apiId,
            name: this.name,
            type: this.type,
            description: this.description,
            dynamoDbConfig: this.dynamoDbConfig,
            elasticsearchConfig: this.elasticsearchConfig,
            eventBridgeConfig: this.eventBridgeConfig,
            httpConfig: this.httpConfig,
            lambdaConfig: this.lambdaConfig,
            openSearchServiceConfig: this.openSearchServiceConfig,
            relationalDatabaseConfig: this.relationalDatabaseConfig,
            serviceRoleArn: this.serviceRoleArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDataSourcePropsToCloudFormation(props);
    }
}

export namespace CfnDataSource {
    /**
     * The `AuthorizationConfig` property type specifies the authorization type and configuration for an AWS AppSync http data source.
     *
     * `AuthorizationConfig` is a property of the [AWS AppSync DataSource HttpConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-httpconfig.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-authorizationconfig.html
     */
    export interface AuthorizationConfigProperty {
        /**
         * The authorization type that the HTTP endpoint requires.
         *
         * - *AWS_IAM* : The authorization type is Signature Version 4 (SigV4).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-authorizationconfig.html#cfn-appsync-datasource-authorizationconfig-authorizationtype
         */
        readonly authorizationType: string;
        /**
         * The AWS Identity and Access Management settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-authorizationconfig.html#cfn-appsync-datasource-authorizationconfig-awsiamconfig
         */
        readonly awsIamConfig?: CfnDataSource.AwsIamConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AuthorizationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthorizationConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_AuthorizationConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authorizationType', cdk.requiredValidator)(properties.authorizationType));
    errors.collect(cdk.propertyValidator('authorizationType', cdk.validateString)(properties.authorizationType));
    errors.collect(cdk.propertyValidator('awsIamConfig', CfnDataSource_AwsIamConfigPropertyValidator)(properties.awsIamConfig));
    return errors.wrap('supplied properties not correct for "AuthorizationConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource.AuthorizationConfig` resource
 *
 * @param properties - the TypeScript properties of a `AuthorizationConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource.AuthorizationConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceAuthorizationConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_AuthorizationConfigPropertyValidator(properties).assertSuccess();
    return {
        AuthorizationType: cdk.stringToCloudFormation(properties.authorizationType),
        AwsIamConfig: cfnDataSourceAwsIamConfigPropertyToCloudFormation(properties.awsIamConfig),
    };
}

// @ts-ignore TS6133
function CfnDataSourceAuthorizationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.AuthorizationConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.AuthorizationConfigProperty>();
    ret.addPropertyResult('authorizationType', 'AuthorizationType', cfn_parse.FromCloudFormation.getString(properties.AuthorizationType));
    ret.addPropertyResult('awsIamConfig', 'AwsIamConfig', properties.AwsIamConfig != null ? CfnDataSourceAwsIamConfigPropertyFromCloudFormation(properties.AwsIamConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Use the `AwsIamConfig` property type to specify `AwsIamConfig` for a AWS AppSync authorizaton.
     *
     * `AwsIamConfig` is a property of the [AWS AppSync DataSource AuthorizationConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-httpconfig-authorizationconfig.html) resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-awsiamconfig.html
     */
    export interface AwsIamConfigProperty {
        /**
         * The signing Region for AWS Identity and Access Management authorization.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-awsiamconfig.html#cfn-appsync-datasource-awsiamconfig-signingregion
         */
        readonly signingRegion?: string;
        /**
         * The signing service name for AWS Identity and Access Management authorization.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-awsiamconfig.html#cfn-appsync-datasource-awsiamconfig-signingservicename
         */
        readonly signingServiceName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AwsIamConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AwsIamConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_AwsIamConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('signingRegion', cdk.validateString)(properties.signingRegion));
    errors.collect(cdk.propertyValidator('signingServiceName', cdk.validateString)(properties.signingServiceName));
    return errors.wrap('supplied properties not correct for "AwsIamConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource.AwsIamConfig` resource
 *
 * @param properties - the TypeScript properties of a `AwsIamConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource.AwsIamConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceAwsIamConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_AwsIamConfigPropertyValidator(properties).assertSuccess();
    return {
        SigningRegion: cdk.stringToCloudFormation(properties.signingRegion),
        SigningServiceName: cdk.stringToCloudFormation(properties.signingServiceName),
    };
}

// @ts-ignore TS6133
function CfnDataSourceAwsIamConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.AwsIamConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.AwsIamConfigProperty>();
    ret.addPropertyResult('signingRegion', 'SigningRegion', properties.SigningRegion != null ? cfn_parse.FromCloudFormation.getString(properties.SigningRegion) : undefined);
    ret.addPropertyResult('signingServiceName', 'SigningServiceName', properties.SigningServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.SigningServiceName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Describes a Delta Sync configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-deltasyncconfig.html
     */
    export interface DeltaSyncConfigProperty {
        /**
         * The number of minutes that an Item is stored in the data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-deltasyncconfig.html#cfn-appsync-datasource-deltasyncconfig-basetablettl
         */
        readonly baseTableTtl: string;
        /**
         * The Delta Sync table name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-deltasyncconfig.html#cfn-appsync-datasource-deltasyncconfig-deltasynctablename
         */
        readonly deltaSyncTableName: string;
        /**
         * The number of minutes that a Delta Sync log entry is stored in the Delta Sync table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-deltasyncconfig.html#cfn-appsync-datasource-deltasyncconfig-deltasynctablettl
         */
        readonly deltaSyncTableTtl: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeltaSyncConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DeltaSyncConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_DeltaSyncConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('baseTableTtl', cdk.requiredValidator)(properties.baseTableTtl));
    errors.collect(cdk.propertyValidator('baseTableTtl', cdk.validateString)(properties.baseTableTtl));
    errors.collect(cdk.propertyValidator('deltaSyncTableName', cdk.requiredValidator)(properties.deltaSyncTableName));
    errors.collect(cdk.propertyValidator('deltaSyncTableName', cdk.validateString)(properties.deltaSyncTableName));
    errors.collect(cdk.propertyValidator('deltaSyncTableTtl', cdk.requiredValidator)(properties.deltaSyncTableTtl));
    errors.collect(cdk.propertyValidator('deltaSyncTableTtl', cdk.validateString)(properties.deltaSyncTableTtl));
    return errors.wrap('supplied properties not correct for "DeltaSyncConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource.DeltaSyncConfig` resource
 *
 * @param properties - the TypeScript properties of a `DeltaSyncConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource.DeltaSyncConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceDeltaSyncConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_DeltaSyncConfigPropertyValidator(properties).assertSuccess();
    return {
        BaseTableTTL: cdk.stringToCloudFormation(properties.baseTableTtl),
        DeltaSyncTableName: cdk.stringToCloudFormation(properties.deltaSyncTableName),
        DeltaSyncTableTTL: cdk.stringToCloudFormation(properties.deltaSyncTableTtl),
    };
}

// @ts-ignore TS6133
function CfnDataSourceDeltaSyncConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DeltaSyncConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DeltaSyncConfigProperty>();
    ret.addPropertyResult('baseTableTtl', 'BaseTableTTL', cfn_parse.FromCloudFormation.getString(properties.BaseTableTTL));
    ret.addPropertyResult('deltaSyncTableName', 'DeltaSyncTableName', cfn_parse.FromCloudFormation.getString(properties.DeltaSyncTableName));
    ret.addPropertyResult('deltaSyncTableTtl', 'DeltaSyncTableTTL', cfn_parse.FromCloudFormation.getString(properties.DeltaSyncTableTTL));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The `DynamoDBConfig` property type specifies the `AwsRegion` and `TableName` for an Amazon DynamoDB table in your account for an AWS AppSync data source.
     *
     * `DynamoDBConfig` is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html
     */
    export interface DynamoDBConfigProperty {
        /**
         * The AWS Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-awsregion
         */
        readonly awsRegion: string;
        /**
         * The `DeltaSyncConfig` for a versioned datasource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-deltasyncconfig
         */
        readonly deltaSyncConfig?: CfnDataSource.DeltaSyncConfigProperty | cdk.IResolvable;
        /**
         * The table name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-tablename
         */
        readonly tableName: string;
        /**
         * Set to `TRUE` to use AWS Identity and Access Management with this data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-usecallercredentials
         */
        readonly useCallerCredentials?: boolean | cdk.IResolvable;
        /**
         * Set to TRUE to use Conflict Detection and Resolution with this data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-versioned
         */
        readonly versioned?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DynamoDBConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DynamoDBConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_DynamoDBConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsRegion', cdk.requiredValidator)(properties.awsRegion));
    errors.collect(cdk.propertyValidator('awsRegion', cdk.validateString)(properties.awsRegion));
    errors.collect(cdk.propertyValidator('deltaSyncConfig', CfnDataSource_DeltaSyncConfigPropertyValidator)(properties.deltaSyncConfig));
    errors.collect(cdk.propertyValidator('tableName', cdk.requiredValidator)(properties.tableName));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    errors.collect(cdk.propertyValidator('useCallerCredentials', cdk.validateBoolean)(properties.useCallerCredentials));
    errors.collect(cdk.propertyValidator('versioned', cdk.validateBoolean)(properties.versioned));
    return errors.wrap('supplied properties not correct for "DynamoDBConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource.DynamoDBConfig` resource
 *
 * @param properties - the TypeScript properties of a `DynamoDBConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource.DynamoDBConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceDynamoDBConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_DynamoDBConfigPropertyValidator(properties).assertSuccess();
    return {
        AwsRegion: cdk.stringToCloudFormation(properties.awsRegion),
        DeltaSyncConfig: cfnDataSourceDeltaSyncConfigPropertyToCloudFormation(properties.deltaSyncConfig),
        TableName: cdk.stringToCloudFormation(properties.tableName),
        UseCallerCredentials: cdk.booleanToCloudFormation(properties.useCallerCredentials),
        Versioned: cdk.booleanToCloudFormation(properties.versioned),
    };
}

// @ts-ignore TS6133
function CfnDataSourceDynamoDBConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DynamoDBConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DynamoDBConfigProperty>();
    ret.addPropertyResult('awsRegion', 'AwsRegion', cfn_parse.FromCloudFormation.getString(properties.AwsRegion));
    ret.addPropertyResult('deltaSyncConfig', 'DeltaSyncConfig', properties.DeltaSyncConfig != null ? CfnDataSourceDeltaSyncConfigPropertyFromCloudFormation(properties.DeltaSyncConfig) : undefined);
    ret.addPropertyResult('tableName', 'TableName', cfn_parse.FromCloudFormation.getString(properties.TableName));
    ret.addPropertyResult('useCallerCredentials', 'UseCallerCredentials', properties.UseCallerCredentials != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseCallerCredentials) : undefined);
    ret.addPropertyResult('versioned', 'Versioned', properties.Versioned != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Versioned) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The `ElasticsearchConfig` property type specifies the `AwsRegion` and `Endpoints` for an Amazon OpenSearch Service domain in your account for an AWS AppSync data source.
     *
     * ElasticsearchConfig is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) property type.
     *
     * As of September 2021, Amazon Elasticsearch Service is Amazon OpenSearch Service . This property is deprecated. For new data sources, use *OpenSearchServiceConfig* to specify an OpenSearch Service data source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html
     */
    export interface ElasticsearchConfigProperty {
        /**
         * The AWS Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html#cfn-appsync-datasource-elasticsearchconfig-awsregion
         */
        readonly awsRegion: string;
        /**
         * The endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html#cfn-appsync-datasource-elasticsearchconfig-endpoint
         */
        readonly endpoint: string;
    }
}

/**
 * Determine whether the given properties match those of a `ElasticsearchConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticsearchConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_ElasticsearchConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsRegion', cdk.requiredValidator)(properties.awsRegion));
    errors.collect(cdk.propertyValidator('awsRegion', cdk.validateString)(properties.awsRegion));
    errors.collect(cdk.propertyValidator('endpoint', cdk.requiredValidator)(properties.endpoint));
    errors.collect(cdk.propertyValidator('endpoint', cdk.validateString)(properties.endpoint));
    return errors.wrap('supplied properties not correct for "ElasticsearchConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource.ElasticsearchConfig` resource
 *
 * @param properties - the TypeScript properties of a `ElasticsearchConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource.ElasticsearchConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceElasticsearchConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_ElasticsearchConfigPropertyValidator(properties).assertSuccess();
    return {
        AwsRegion: cdk.stringToCloudFormation(properties.awsRegion),
        Endpoint: cdk.stringToCloudFormation(properties.endpoint),
    };
}

// @ts-ignore TS6133
function CfnDataSourceElasticsearchConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ElasticsearchConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ElasticsearchConfigProperty>();
    ret.addPropertyResult('awsRegion', 'AwsRegion', cfn_parse.FromCloudFormation.getString(properties.AwsRegion));
    ret.addPropertyResult('endpoint', 'Endpoint', cfn_parse.FromCloudFormation.getString(properties.Endpoint));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-eventbridgeconfig.html
     */
    export interface EventBridgeConfigProperty {
        /**
         * `CfnDataSource.EventBridgeConfigProperty.EventBusArn`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-eventbridgeconfig.html#cfn-appsync-datasource-eventbridgeconfig-eventbusarn
         */
        readonly eventBusArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `EventBridgeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_EventBridgeConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventBusArn', cdk.requiredValidator)(properties.eventBusArn));
    errors.collect(cdk.propertyValidator('eventBusArn', cdk.validateString)(properties.eventBusArn));
    return errors.wrap('supplied properties not correct for "EventBridgeConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource.EventBridgeConfig` resource
 *
 * @param properties - the TypeScript properties of a `EventBridgeConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource.EventBridgeConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceEventBridgeConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_EventBridgeConfigPropertyValidator(properties).assertSuccess();
    return {
        EventBusArn: cdk.stringToCloudFormation(properties.eventBusArn),
    };
}

// @ts-ignore TS6133
function CfnDataSourceEventBridgeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.EventBridgeConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.EventBridgeConfigProperty>();
    ret.addPropertyResult('eventBusArn', 'EventBusArn', cfn_parse.FromCloudFormation.getString(properties.EventBusArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Use the `HttpConfig` property type to specify `HttpConfig` for an AWS AppSync data source.
     *
     * `HttpConfig` is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-httpconfig.html
     */
    export interface HttpConfigProperty {
        /**
         * The authorization configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-httpconfig.html#cfn-appsync-datasource-httpconfig-authorizationconfig
         */
        readonly authorizationConfig?: CfnDataSource.AuthorizationConfigProperty | cdk.IResolvable;
        /**
         * The endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-httpconfig.html#cfn-appsync-datasource-httpconfig-endpoint
         */
        readonly endpoint: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HttpConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_HttpConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authorizationConfig', CfnDataSource_AuthorizationConfigPropertyValidator)(properties.authorizationConfig));
    errors.collect(cdk.propertyValidator('endpoint', cdk.requiredValidator)(properties.endpoint));
    errors.collect(cdk.propertyValidator('endpoint', cdk.validateString)(properties.endpoint));
    return errors.wrap('supplied properties not correct for "HttpConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource.HttpConfig` resource
 *
 * @param properties - the TypeScript properties of a `HttpConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource.HttpConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceHttpConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_HttpConfigPropertyValidator(properties).assertSuccess();
    return {
        AuthorizationConfig: cfnDataSourceAuthorizationConfigPropertyToCloudFormation(properties.authorizationConfig),
        Endpoint: cdk.stringToCloudFormation(properties.endpoint),
    };
}

// @ts-ignore TS6133
function CfnDataSourceHttpConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.HttpConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.HttpConfigProperty>();
    ret.addPropertyResult('authorizationConfig', 'AuthorizationConfig', properties.AuthorizationConfig != null ? CfnDataSourceAuthorizationConfigPropertyFromCloudFormation(properties.AuthorizationConfig) : undefined);
    ret.addPropertyResult('endpoint', 'Endpoint', cfn_parse.FromCloudFormation.getString(properties.Endpoint));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The `LambdaConfig` property type specifies the Lambda function ARN for an AWS AppSync data source.
     *
     * `LambdaConfig` is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-lambdaconfig.html
     */
    export interface LambdaConfigProperty {
        /**
         * The ARN for the Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-lambdaconfig.html#cfn-appsync-datasource-lambdaconfig-lambdafunctionarn
         */
        readonly lambdaFunctionArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_LambdaConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lambdaFunctionArn', cdk.requiredValidator)(properties.lambdaFunctionArn));
    errors.collect(cdk.propertyValidator('lambdaFunctionArn', cdk.validateString)(properties.lambdaFunctionArn));
    return errors.wrap('supplied properties not correct for "LambdaConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource.LambdaConfig` resource
 *
 * @param properties - the TypeScript properties of a `LambdaConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource.LambdaConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceLambdaConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_LambdaConfigPropertyValidator(properties).assertSuccess();
    return {
        LambdaFunctionArn: cdk.stringToCloudFormation(properties.lambdaFunctionArn),
    };
}

// @ts-ignore TS6133
function CfnDataSourceLambdaConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.LambdaConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.LambdaConfigProperty>();
    ret.addPropertyResult('lambdaFunctionArn', 'LambdaFunctionArn', cfn_parse.FromCloudFormation.getString(properties.LambdaFunctionArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * The `OpenSearchServiceConfig` property type specifies the `AwsRegion` and `Endpoints` for an Amazon OpenSearch Service domain in your account for an AWS AppSync data source.
     *
     * `OpenSearchServiceConfig` is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-opensearchserviceconfig.html
     */
    export interface OpenSearchServiceConfigProperty {
        /**
         * The AWS Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-opensearchserviceconfig.html#cfn-appsync-datasource-opensearchserviceconfig-awsregion
         */
        readonly awsRegion: string;
        /**
         * The endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-opensearchserviceconfig.html#cfn-appsync-datasource-opensearchserviceconfig-endpoint
         */
        readonly endpoint: string;
    }
}

/**
 * Determine whether the given properties match those of a `OpenSearchServiceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OpenSearchServiceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_OpenSearchServiceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsRegion', cdk.requiredValidator)(properties.awsRegion));
    errors.collect(cdk.propertyValidator('awsRegion', cdk.validateString)(properties.awsRegion));
    errors.collect(cdk.propertyValidator('endpoint', cdk.requiredValidator)(properties.endpoint));
    errors.collect(cdk.propertyValidator('endpoint', cdk.validateString)(properties.endpoint));
    return errors.wrap('supplied properties not correct for "OpenSearchServiceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource.OpenSearchServiceConfig` resource
 *
 * @param properties - the TypeScript properties of a `OpenSearchServiceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource.OpenSearchServiceConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceOpenSearchServiceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_OpenSearchServiceConfigPropertyValidator(properties).assertSuccess();
    return {
        AwsRegion: cdk.stringToCloudFormation(properties.awsRegion),
        Endpoint: cdk.stringToCloudFormation(properties.endpoint),
    };
}

// @ts-ignore TS6133
function CfnDataSourceOpenSearchServiceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.OpenSearchServiceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.OpenSearchServiceConfigProperty>();
    ret.addPropertyResult('awsRegion', 'AwsRegion', cfn_parse.FromCloudFormation.getString(properties.AwsRegion));
    ret.addPropertyResult('endpoint', 'Endpoint', cfn_parse.FromCloudFormation.getString(properties.Endpoint));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Use the `RdsHttpEndpointConfig` property type to specify the `RdsHttpEndpoint` for an AWS AppSync relational database.
     *
     * `RdsHttpEndpointConfig` is a property of the [AWS AppSync DataSource RelationalDatabaseConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-relationaldatabaseconfig.html) resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html
     */
    export interface RdsHttpEndpointConfigProperty {
        /**
         * AWS Region for RDS HTTP endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html#cfn-appsync-datasource-rdshttpendpointconfig-awsregion
         */
        readonly awsRegion: string;
        /**
         * The ARN for database credentials stored in AWS Secrets Manager .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html#cfn-appsync-datasource-rdshttpendpointconfig-awssecretstorearn
         */
        readonly awsSecretStoreArn: string;
        /**
         * Logical database name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html#cfn-appsync-datasource-rdshttpendpointconfig-databasename
         */
        readonly databaseName?: string;
        /**
         * Amazon RDS cluster Amazon Resource Name (ARN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html#cfn-appsync-datasource-rdshttpendpointconfig-dbclusteridentifier
         */
        readonly dbClusterIdentifier: string;
        /**
         * Logical schema name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-rdshttpendpointconfig.html#cfn-appsync-datasource-rdshttpendpointconfig-schema
         */
        readonly schema?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RdsHttpEndpointConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RdsHttpEndpointConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_RdsHttpEndpointConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsRegion', cdk.requiredValidator)(properties.awsRegion));
    errors.collect(cdk.propertyValidator('awsRegion', cdk.validateString)(properties.awsRegion));
    errors.collect(cdk.propertyValidator('awsSecretStoreArn', cdk.requiredValidator)(properties.awsSecretStoreArn));
    errors.collect(cdk.propertyValidator('awsSecretStoreArn', cdk.validateString)(properties.awsSecretStoreArn));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('dbClusterIdentifier', cdk.requiredValidator)(properties.dbClusterIdentifier));
    errors.collect(cdk.propertyValidator('dbClusterIdentifier', cdk.validateString)(properties.dbClusterIdentifier));
    errors.collect(cdk.propertyValidator('schema', cdk.validateString)(properties.schema));
    return errors.wrap('supplied properties not correct for "RdsHttpEndpointConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource.RdsHttpEndpointConfig` resource
 *
 * @param properties - the TypeScript properties of a `RdsHttpEndpointConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource.RdsHttpEndpointConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceRdsHttpEndpointConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_RdsHttpEndpointConfigPropertyValidator(properties).assertSuccess();
    return {
        AwsRegion: cdk.stringToCloudFormation(properties.awsRegion),
        AwsSecretStoreArn: cdk.stringToCloudFormation(properties.awsSecretStoreArn),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        DbClusterIdentifier: cdk.stringToCloudFormation(properties.dbClusterIdentifier),
        Schema: cdk.stringToCloudFormation(properties.schema),
    };
}

// @ts-ignore TS6133
function CfnDataSourceRdsHttpEndpointConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.RdsHttpEndpointConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.RdsHttpEndpointConfigProperty>();
    ret.addPropertyResult('awsRegion', 'AwsRegion', cfn_parse.FromCloudFormation.getString(properties.AwsRegion));
    ret.addPropertyResult('awsSecretStoreArn', 'AwsSecretStoreArn', cfn_parse.FromCloudFormation.getString(properties.AwsSecretStoreArn));
    ret.addPropertyResult('databaseName', 'DatabaseName', properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined);
    ret.addPropertyResult('dbClusterIdentifier', 'DbClusterIdentifier', cfn_parse.FromCloudFormation.getString(properties.DbClusterIdentifier));
    ret.addPropertyResult('schema', 'Schema', properties.Schema != null ? cfn_parse.FromCloudFormation.getString(properties.Schema) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataSource {
    /**
     * Use the `RelationalDatabaseConfig` property type to specify `RelationalDatabaseConfig` for an AWS AppSync data source.
     *
     * `RelationalDatabaseConfig` is a property of the [AWS::AppSync::DataSource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-relationaldatabaseconfig.html
     */
    export interface RelationalDatabaseConfigProperty {
        /**
         * Information about the Amazon RDS resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-relationaldatabaseconfig.html#cfn-appsync-datasource-relationaldatabaseconfig-rdshttpendpointconfig
         */
        readonly rdsHttpEndpointConfig?: CfnDataSource.RdsHttpEndpointConfigProperty | cdk.IResolvable;
        /**
         * The type of relational data source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-relationaldatabaseconfig.html#cfn-appsync-datasource-relationaldatabaseconfig-relationaldatabasesourcetype
         */
        readonly relationalDatabaseSourceType: string;
    }
}

/**
 * Determine whether the given properties match those of a `RelationalDatabaseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RelationalDatabaseConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataSource_RelationalDatabaseConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rdsHttpEndpointConfig', CfnDataSource_RdsHttpEndpointConfigPropertyValidator)(properties.rdsHttpEndpointConfig));
    errors.collect(cdk.propertyValidator('relationalDatabaseSourceType', cdk.requiredValidator)(properties.relationalDatabaseSourceType));
    errors.collect(cdk.propertyValidator('relationalDatabaseSourceType', cdk.validateString)(properties.relationalDatabaseSourceType));
    return errors.wrap('supplied properties not correct for "RelationalDatabaseConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DataSource.RelationalDatabaseConfig` resource
 *
 * @param properties - the TypeScript properties of a `RelationalDatabaseConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DataSource.RelationalDatabaseConfig` resource.
 */
// @ts-ignore TS6133
function cfnDataSourceRelationalDatabaseConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataSource_RelationalDatabaseConfigPropertyValidator(properties).assertSuccess();
    return {
        RdsHttpEndpointConfig: cfnDataSourceRdsHttpEndpointConfigPropertyToCloudFormation(properties.rdsHttpEndpointConfig),
        RelationalDatabaseSourceType: cdk.stringToCloudFormation(properties.relationalDatabaseSourceType),
    };
}

// @ts-ignore TS6133
function CfnDataSourceRelationalDatabaseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.RelationalDatabaseConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.RelationalDatabaseConfigProperty>();
    ret.addPropertyResult('rdsHttpEndpointConfig', 'RdsHttpEndpointConfig', properties.RdsHttpEndpointConfig != null ? CfnDataSourceRdsHttpEndpointConfigPropertyFromCloudFormation(properties.RdsHttpEndpointConfig) : undefined);
    ret.addPropertyResult('relationalDatabaseSourceType', 'RelationalDatabaseSourceType', cfn_parse.FromCloudFormation.getString(properties.RelationalDatabaseSourceType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDomainName`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html
 */
export interface CfnDomainNameProps {

    /**
     * The Amazon Resource Name (ARN) of the certificate. This will be an AWS Certificate Manager certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html#cfn-appsync-domainname-certificatearn
     */
    readonly certificateArn: string;

    /**
     * The domain name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html#cfn-appsync-domainname-domainname
     */
    readonly domainName: string;

    /**
     * The decription for your domain name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html#cfn-appsync-domainname-description
     */
    readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDomainNameProps`
 *
 * @param properties - the TypeScript properties of a `CfnDomainNameProps`
 *
 * @returns the result of the validation.
 */
function CfnDomainNamePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateArn', cdk.requiredValidator)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    return errors.wrap('supplied properties not correct for "CfnDomainNameProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DomainName` resource
 *
 * @param properties - the TypeScript properties of a `CfnDomainNameProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DomainName` resource.
 */
// @ts-ignore TS6133
function cfnDomainNamePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomainNamePropsValidator(properties).assertSuccess();
    return {
        CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}

// @ts-ignore TS6133
function CfnDomainNamePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainNameProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainNameProps>();
    ret.addPropertyResult('certificateArn', 'CertificateArn', cfn_parse.FromCloudFormation.getString(properties.CertificateArn));
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppSync::DomainName`
 *
 * The `AWS::AppSync::DomainName` resource creates a `DomainNameConfig` object to configure a custom domain.
 *
 * @cloudformationResource AWS::AppSync::DomainName
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html
 */
export class CfnDomainName extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppSync::DomainName";

    /**
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
        const ret = new CfnDomainName(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The domain name provided by AWS AppSync .
     * @cloudformationAttribute AppSyncDomainName
     */
    public readonly attrAppSyncDomainName: string;

    /**
     * The domain name.
     * @cloudformationAttribute DomainName
     */
    public readonly attrDomainName: string;

    /**
     * The ID of your Amazon Route 53 hosted zone.
     * @cloudformationAttribute HostedZoneId
     */
    public readonly attrHostedZoneId: string;

    /**
     * The Amazon Resource Name (ARN) of the certificate. This will be an AWS Certificate Manager certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html#cfn-appsync-domainname-certificatearn
     */
    public certificateArn: string;

    /**
     * The domain name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html#cfn-appsync-domainname-domainname
     */
    public domainName: string;

    /**
     * The decription for your domain name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainname.html#cfn-appsync-domainname-description
     */
    public description: string | undefined;

    /**
     * Create a new `AWS::AppSync::DomainName`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDomainNameProps) {
        super(scope, id, { type: CfnDomainName.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'certificateArn', this);
        cdk.requireProperty(props, 'domainName', this);
        this.attrAppSyncDomainName = cdk.Token.asString(this.getAtt('AppSyncDomainName', cdk.ResolutionTypeHint.STRING));
        this.attrDomainName = cdk.Token.asString(this.getAtt('DomainName', cdk.ResolutionTypeHint.STRING));
        this.attrHostedZoneId = cdk.Token.asString(this.getAtt('HostedZoneId', cdk.ResolutionTypeHint.STRING));

        this.certificateArn = props.certificateArn;
        this.domainName = props.domainName;
        this.description = props.description;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomainName.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            certificateArn: this.certificateArn,
            domainName: this.domainName,
            description: this.description,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDomainNamePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnDomainNameApiAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainnameapiassociation.html
 */
export interface CfnDomainNameApiAssociationProps {

    /**
     * The API ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainnameapiassociation.html#cfn-appsync-domainnameapiassociation-apiid
     */
    readonly apiId: string;

    /**
     * The domain name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainnameapiassociation.html#cfn-appsync-domainnameapiassociation-domainname
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
function CfnDomainNameApiAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    return errors.wrap('supplied properties not correct for "CfnDomainNameApiAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::DomainNameApiAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnDomainNameApiAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::DomainNameApiAssociation` resource.
 */
// @ts-ignore TS6133
function cfnDomainNameApiAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDomainNameApiAssociationPropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        DomainName: cdk.stringToCloudFormation(properties.domainName),
    };
}

// @ts-ignore TS6133
function CfnDomainNameApiAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainNameApiAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainNameApiAssociationProps>();
    ret.addPropertyResult('apiId', 'ApiId', cfn_parse.FromCloudFormation.getString(properties.ApiId));
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppSync::DomainNameApiAssociation`
 *
 * The `AWS::AppSync::DomainNameApiAssociation` resource represents the mapping of your custom domain name to the assigned API URL.
 *
 * @cloudformationResource AWS::AppSync::DomainNameApiAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainnameapiassociation.html
 */
export class CfnDomainNameApiAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppSync::DomainNameApiAssociation";

    /**
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
        const ret = new CfnDomainNameApiAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute ApiAssociationIdentifier
     */
    public readonly attrApiAssociationIdentifier: string;

    /**
     * The API ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainnameapiassociation.html#cfn-appsync-domainnameapiassociation-apiid
     */
    public apiId: string;

    /**
     * The domain name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-domainnameapiassociation.html#cfn-appsync-domainnameapiassociation-domainname
     */
    public domainName: string;

    /**
     * Create a new `AWS::AppSync::DomainNameApiAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDomainNameApiAssociationProps) {
        super(scope, id, { type: CfnDomainNameApiAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'domainName', this);
        this.attrApiAssociationIdentifier = cdk.Token.asString(this.getAtt('ApiAssociationIdentifier', cdk.ResolutionTypeHint.STRING));

        this.apiId = props.apiId;
        this.domainName = props.domainName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomainNameApiAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            apiId: this.apiId,
            domainName: this.domainName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDomainNameApiAssociationPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnFunctionConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html
 */
export interface CfnFunctionConfigurationProps {

    /**
     * The AWS AppSync GraphQL API that you want to attach using this function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-apiid
     */
    readonly apiId: string;

    /**
     * The name of data source this function will attach.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-datasourcename
     */
    readonly dataSourceName: string;

    /**
     * The name of the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-name
     */
    readonly name: string;

    /**
     * The `resolver` code that contains the request and response functions. When code is used, the `runtime` is required. The runtime value must be `APPSYNC_JS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-code
     */
    readonly code?: string;

    /**
     * The Amazon S3 endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-codes3location
     */
    readonly codeS3Location?: string;

    /**
     * The `Function` description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-description
     */
    readonly description?: string;

    /**
     * The version of the request mapping template. Currently, only the 2018-05-29 version of the template is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-functionversion
     */
    readonly functionVersion?: string;

    /**
     * The maximum number of resolver request inputs that will be sent to a single AWS Lambda function in a `BatchInvoke` operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-maxbatchsize
     */
    readonly maxBatchSize?: number;

    /**
     * The `Function` request mapping template. Functions support only the 2018-05-29 version of the request mapping template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-requestmappingtemplate
     */
    readonly requestMappingTemplate?: string;

    /**
     * Describes a Sync configuration for a resolver.
     *
     * Contains information on which Conflict Detection, as well as Resolution strategy, should be performed when the resolver is invoked.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-requestmappingtemplates3location
     */
    readonly requestMappingTemplateS3Location?: string;

    /**
     * The `Function` response mapping template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-responsemappingtemplate
     */
    readonly responseMappingTemplate?: string;

    /**
     * The location of a response mapping template in an Amazon S3 bucket. Use this if you want to provision with a template file in Amazon S3 rather than embedding it in your CloudFormation template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-responsemappingtemplates3location
     */
    readonly responseMappingTemplateS3Location?: string;

    /**
     * Describes a runtime used by an AWS AppSync pipeline resolver or AWS AppSync function. Specifies the name and version of the runtime to use. Note that if a runtime is specified, code must also be specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-runtime
     */
    readonly runtime?: CfnFunctionConfiguration.AppSyncRuntimeProperty | cdk.IResolvable;

    /**
     * Describes a Sync configuration for a resolver.
     *
     * Specifies which Conflict Detection strategy and Resolution strategy to use when the resolver is invoked.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-syncconfig
     */
    readonly syncConfig?: CfnFunctionConfiguration.SyncConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnFunctionConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnFunctionConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnFunctionConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('code', cdk.validateString)(properties.code));
    errors.collect(cdk.propertyValidator('codeS3Location', cdk.validateString)(properties.codeS3Location));
    errors.collect(cdk.propertyValidator('dataSourceName', cdk.requiredValidator)(properties.dataSourceName));
    errors.collect(cdk.propertyValidator('dataSourceName', cdk.validateString)(properties.dataSourceName));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('functionVersion', cdk.validateString)(properties.functionVersion));
    errors.collect(cdk.propertyValidator('maxBatchSize', cdk.validateNumber)(properties.maxBatchSize));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('requestMappingTemplate', cdk.validateString)(properties.requestMappingTemplate));
    errors.collect(cdk.propertyValidator('requestMappingTemplateS3Location', cdk.validateString)(properties.requestMappingTemplateS3Location));
    errors.collect(cdk.propertyValidator('responseMappingTemplate', cdk.validateString)(properties.responseMappingTemplate));
    errors.collect(cdk.propertyValidator('responseMappingTemplateS3Location', cdk.validateString)(properties.responseMappingTemplateS3Location));
    errors.collect(cdk.propertyValidator('runtime', CfnFunctionConfiguration_AppSyncRuntimePropertyValidator)(properties.runtime));
    errors.collect(cdk.propertyValidator('syncConfig', CfnFunctionConfiguration_SyncConfigPropertyValidator)(properties.syncConfig));
    return errors.wrap('supplied properties not correct for "CfnFunctionConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::FunctionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnFunctionConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::FunctionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFunctionConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunctionConfigurationPropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        DataSourceName: cdk.stringToCloudFormation(properties.dataSourceName),
        Name: cdk.stringToCloudFormation(properties.name),
        Code: cdk.stringToCloudFormation(properties.code),
        CodeS3Location: cdk.stringToCloudFormation(properties.codeS3Location),
        Description: cdk.stringToCloudFormation(properties.description),
        FunctionVersion: cdk.stringToCloudFormation(properties.functionVersion),
        MaxBatchSize: cdk.numberToCloudFormation(properties.maxBatchSize),
        RequestMappingTemplate: cdk.stringToCloudFormation(properties.requestMappingTemplate),
        RequestMappingTemplateS3Location: cdk.stringToCloudFormation(properties.requestMappingTemplateS3Location),
        ResponseMappingTemplate: cdk.stringToCloudFormation(properties.responseMappingTemplate),
        ResponseMappingTemplateS3Location: cdk.stringToCloudFormation(properties.responseMappingTemplateS3Location),
        Runtime: cfnFunctionConfigurationAppSyncRuntimePropertyToCloudFormation(properties.runtime),
        SyncConfig: cfnFunctionConfigurationSyncConfigPropertyToCloudFormation(properties.syncConfig),
    };
}

// @ts-ignore TS6133
function CfnFunctionConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionConfigurationProps>();
    ret.addPropertyResult('apiId', 'ApiId', cfn_parse.FromCloudFormation.getString(properties.ApiId));
    ret.addPropertyResult('dataSourceName', 'DataSourceName', cfn_parse.FromCloudFormation.getString(properties.DataSourceName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('code', 'Code', properties.Code != null ? cfn_parse.FromCloudFormation.getString(properties.Code) : undefined);
    ret.addPropertyResult('codeS3Location', 'CodeS3Location', properties.CodeS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.CodeS3Location) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('functionVersion', 'FunctionVersion', properties.FunctionVersion != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionVersion) : undefined);
    ret.addPropertyResult('maxBatchSize', 'MaxBatchSize', properties.MaxBatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBatchSize) : undefined);
    ret.addPropertyResult('requestMappingTemplate', 'RequestMappingTemplate', properties.RequestMappingTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.RequestMappingTemplate) : undefined);
    ret.addPropertyResult('requestMappingTemplateS3Location', 'RequestMappingTemplateS3Location', properties.RequestMappingTemplateS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.RequestMappingTemplateS3Location) : undefined);
    ret.addPropertyResult('responseMappingTemplate', 'ResponseMappingTemplate', properties.ResponseMappingTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseMappingTemplate) : undefined);
    ret.addPropertyResult('responseMappingTemplateS3Location', 'ResponseMappingTemplateS3Location', properties.ResponseMappingTemplateS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseMappingTemplateS3Location) : undefined);
    ret.addPropertyResult('runtime', 'Runtime', properties.Runtime != null ? CfnFunctionConfigurationAppSyncRuntimePropertyFromCloudFormation(properties.Runtime) : undefined);
    ret.addPropertyResult('syncConfig', 'SyncConfig', properties.SyncConfig != null ? CfnFunctionConfigurationSyncConfigPropertyFromCloudFormation(properties.SyncConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppSync::FunctionConfiguration`
 *
 * The `AWS::AppSync::FunctionConfiguration` resource defines the functions in GraphQL APIs to perform certain operations. You can use pipeline resolvers to attach functions. For more information, see [Pipeline Resolvers](https://docs.aws.amazon.com/appsync/latest/devguide/pipeline-resolvers.html) in the *AWS AppSync Developer Guide* .
 *
 * > When you submit an update, AWS CloudFormation updates resources based on differences between what you submit and the stack's current template. To cause this resource to be updated you must change a property value for this resource in the AWS CloudFormation template. Changing the Amazon S3 file content without changing a property value will not result in an update operation.
 * >
 * > See [Update Behaviors of Stack Resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html) in the *AWS CloudFormation User Guide* .
 *
 * @cloudformationResource AWS::AppSync::FunctionConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html
 */
export class CfnFunctionConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppSync::FunctionConfiguration";

    /**
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
        const ret = new CfnFunctionConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of data source this function will attach.
     * @cloudformationAttribute DataSourceName
     */
    public readonly attrDataSourceName: string;

    /**
     * ARN of the function, such as `arn:aws:appsync:us-east-1:123456789012:apis/graphqlapiid/functions/functionId` .
     * @cloudformationAttribute FunctionArn
     */
    public readonly attrFunctionArn: string;

    /**
     * The unique ID of this function.
     * @cloudformationAttribute FunctionId
     */
    public readonly attrFunctionId: string;

    /**
     * The name of the function.
     * @cloudformationAttribute Name
     */
    public readonly attrName: string;

    /**
     * The AWS AppSync GraphQL API that you want to attach using this function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-apiid
     */
    public apiId: string;

    /**
     * The name of data source this function will attach.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-datasourcename
     */
    public dataSourceName: string;

    /**
     * The name of the function.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-name
     */
    public name: string;

    /**
     * The `resolver` code that contains the request and response functions. When code is used, the `runtime` is required. The runtime value must be `APPSYNC_JS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-code
     */
    public code: string | undefined;

    /**
     * The Amazon S3 endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-codes3location
     */
    public codeS3Location: string | undefined;

    /**
     * The `Function` description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-description
     */
    public description: string | undefined;

    /**
     * The version of the request mapping template. Currently, only the 2018-05-29 version of the template is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-functionversion
     */
    public functionVersion: string | undefined;

    /**
     * The maximum number of resolver request inputs that will be sent to a single AWS Lambda function in a `BatchInvoke` operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-maxbatchsize
     */
    public maxBatchSize: number | undefined;

    /**
     * The `Function` request mapping template. Functions support only the 2018-05-29 version of the request mapping template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-requestmappingtemplate
     */
    public requestMappingTemplate: string | undefined;

    /**
     * Describes a Sync configuration for a resolver.
     *
     * Contains information on which Conflict Detection, as well as Resolution strategy, should be performed when the resolver is invoked.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-requestmappingtemplates3location
     */
    public requestMappingTemplateS3Location: string | undefined;

    /**
     * The `Function` response mapping template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-responsemappingtemplate
     */
    public responseMappingTemplate: string | undefined;

    /**
     * The location of a response mapping template in an Amazon S3 bucket. Use this if you want to provision with a template file in Amazon S3 rather than embedding it in your CloudFormation template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-responsemappingtemplates3location
     */
    public responseMappingTemplateS3Location: string | undefined;

    /**
     * Describes a runtime used by an AWS AppSync pipeline resolver or AWS AppSync function. Specifies the name and version of the runtime to use. Note that if a runtime is specified, code must also be specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-runtime
     */
    public runtime: CfnFunctionConfiguration.AppSyncRuntimeProperty | cdk.IResolvable | undefined;

    /**
     * Describes a Sync configuration for a resolver.
     *
     * Specifies which Conflict Detection strategy and Resolution strategy to use when the resolver is invoked.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-functionconfiguration.html#cfn-appsync-functionconfiguration-syncconfig
     */
    public syncConfig: CfnFunctionConfiguration.SyncConfigProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::AppSync::FunctionConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFunctionConfigurationProps) {
        super(scope, id, { type: CfnFunctionConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'dataSourceName', this);
        cdk.requireProperty(props, 'name', this);
        this.attrDataSourceName = cdk.Token.asString(this.getAtt('DataSourceName', cdk.ResolutionTypeHint.STRING));
        this.attrFunctionArn = cdk.Token.asString(this.getAtt('FunctionArn', cdk.ResolutionTypeHint.STRING));
        this.attrFunctionId = cdk.Token.asString(this.getAtt('FunctionId', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.apiId = props.apiId;
        this.dataSourceName = props.dataSourceName;
        this.name = props.name;
        this.code = props.code;
        this.codeS3Location = props.codeS3Location;
        this.description = props.description;
        this.functionVersion = props.functionVersion;
        this.maxBatchSize = props.maxBatchSize;
        this.requestMappingTemplate = props.requestMappingTemplate;
        this.requestMappingTemplateS3Location = props.requestMappingTemplateS3Location;
        this.responseMappingTemplate = props.responseMappingTemplate;
        this.responseMappingTemplateS3Location = props.responseMappingTemplateS3Location;
        this.runtime = props.runtime;
        this.syncConfig = props.syncConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFunctionConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            apiId: this.apiId,
            dataSourceName: this.dataSourceName,
            name: this.name,
            code: this.code,
            codeS3Location: this.codeS3Location,
            description: this.description,
            functionVersion: this.functionVersion,
            maxBatchSize: this.maxBatchSize,
            requestMappingTemplate: this.requestMappingTemplate,
            requestMappingTemplateS3Location: this.requestMappingTemplateS3Location,
            responseMappingTemplate: this.responseMappingTemplate,
            responseMappingTemplateS3Location: this.responseMappingTemplateS3Location,
            runtime: this.runtime,
            syncConfig: this.syncConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFunctionConfigurationPropsToCloudFormation(props);
    }
}

export namespace CfnFunctionConfiguration {
    /**
     * Describes a runtime used by an AWS AppSync pipeline resolver or AWS AppSync function. Specifies the name and version of the runtime to use. Note that if a runtime is specified, code must also be specified.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-appsyncruntime.html
     */
    export interface AppSyncRuntimeProperty {
        /**
         * The `name` of the runtime to use. Currently, the only allowed value is `APPSYNC_JS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-appsyncruntime.html#cfn-appsync-functionconfiguration-appsyncruntime-name
         */
        readonly name: string;
        /**
         * The `version` of the runtime to use. Currently, the only allowed version is `1.0.0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-appsyncruntime.html#cfn-appsync-functionconfiguration-appsyncruntime-runtimeversion
         */
        readonly runtimeVersion: string;
    }
}

/**
 * Determine whether the given properties match those of a `AppSyncRuntimeProperty`
 *
 * @param properties - the TypeScript properties of a `AppSyncRuntimeProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunctionConfiguration_AppSyncRuntimePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('runtimeVersion', cdk.requiredValidator)(properties.runtimeVersion));
    errors.collect(cdk.propertyValidator('runtimeVersion', cdk.validateString)(properties.runtimeVersion));
    return errors.wrap('supplied properties not correct for "AppSyncRuntimeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::FunctionConfiguration.AppSyncRuntime` resource
 *
 * @param properties - the TypeScript properties of a `AppSyncRuntimeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::FunctionConfiguration.AppSyncRuntime` resource.
 */
// @ts-ignore TS6133
function cfnFunctionConfigurationAppSyncRuntimePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunctionConfiguration_AppSyncRuntimePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        RuntimeVersion: cdk.stringToCloudFormation(properties.runtimeVersion),
    };
}

// @ts-ignore TS6133
function CfnFunctionConfigurationAppSyncRuntimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionConfiguration.AppSyncRuntimeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionConfiguration.AppSyncRuntimeProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('runtimeVersion', 'RuntimeVersion', cfn_parse.FromCloudFormation.getString(properties.RuntimeVersion));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunctionConfiguration {
    /**
     * The `LambdaConflictHandlerConfig` object when configuring `LAMBDA` as the Conflict Handler.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-lambdaconflicthandlerconfig.html
     */
    export interface LambdaConflictHandlerConfigProperty {
        /**
         * The Amazon Resource Name (ARN) for the Lambda function to use as the Conflict Handler.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-lambdaconflicthandlerconfig.html#cfn-appsync-functionconfiguration-lambdaconflicthandlerconfig-lambdaconflicthandlerarn
         */
        readonly lambdaConflictHandlerArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaConflictHandlerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConflictHandlerConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunctionConfiguration_LambdaConflictHandlerConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lambdaConflictHandlerArn', cdk.validateString)(properties.lambdaConflictHandlerArn));
    return errors.wrap('supplied properties not correct for "LambdaConflictHandlerConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::FunctionConfiguration.LambdaConflictHandlerConfig` resource
 *
 * @param properties - the TypeScript properties of a `LambdaConflictHandlerConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::FunctionConfiguration.LambdaConflictHandlerConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionConfigurationLambdaConflictHandlerConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunctionConfiguration_LambdaConflictHandlerConfigPropertyValidator(properties).assertSuccess();
    return {
        LambdaConflictHandlerArn: cdk.stringToCloudFormation(properties.lambdaConflictHandlerArn),
    };
}

// @ts-ignore TS6133
function CfnFunctionConfigurationLambdaConflictHandlerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionConfiguration.LambdaConflictHandlerConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionConfiguration.LambdaConflictHandlerConfigProperty>();
    ret.addPropertyResult('lambdaConflictHandlerArn', 'LambdaConflictHandlerArn', properties.LambdaConflictHandlerArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaConflictHandlerArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunctionConfiguration {
    /**
     * Describes a Sync configuration for a resolver.
     *
     * Specifies which Conflict Detection strategy and Resolution strategy to use when the resolver is invoked.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-syncconfig.html
     */
    export interface SyncConfigProperty {
        /**
         * The Conflict Detection strategy to use.
         *
         * - *VERSION* : Detect conflicts based on object versions for this resolver.
         * - *NONE* : Do not detect conflicts when invoking this resolver.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-syncconfig.html#cfn-appsync-functionconfiguration-syncconfig-conflictdetection
         */
        readonly conflictDetection: string;
        /**
         * The Conflict Resolution strategy to perform in the event of a conflict.
         *
         * - *OPTIMISTIC_CONCURRENCY* : Resolve conflicts by rejecting mutations when versions don't match the latest version at the server.
         * - *AUTOMERGE* : Resolve conflicts with the Automerge conflict resolution strategy.
         * - *LAMBDA* : Resolve conflicts with an AWS Lambda function supplied in the `LambdaConflictHandlerConfig` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-syncconfig.html#cfn-appsync-functionconfiguration-syncconfig-conflicthandler
         */
        readonly conflictHandler?: string;
        /**
         * The `LambdaConflictHandlerConfig` when configuring `LAMBDA` as the Conflict Handler.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-functionconfiguration-syncconfig.html#cfn-appsync-functionconfiguration-syncconfig-lambdaconflicthandlerconfig
         */
        readonly lambdaConflictHandlerConfig?: CfnFunctionConfiguration.LambdaConflictHandlerConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SyncConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SyncConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunctionConfiguration_SyncConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('conflictDetection', cdk.requiredValidator)(properties.conflictDetection));
    errors.collect(cdk.propertyValidator('conflictDetection', cdk.validateString)(properties.conflictDetection));
    errors.collect(cdk.propertyValidator('conflictHandler', cdk.validateString)(properties.conflictHandler));
    errors.collect(cdk.propertyValidator('lambdaConflictHandlerConfig', CfnFunctionConfiguration_LambdaConflictHandlerConfigPropertyValidator)(properties.lambdaConflictHandlerConfig));
    return errors.wrap('supplied properties not correct for "SyncConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::FunctionConfiguration.SyncConfig` resource
 *
 * @param properties - the TypeScript properties of a `SyncConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::FunctionConfiguration.SyncConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionConfigurationSyncConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunctionConfiguration_SyncConfigPropertyValidator(properties).assertSuccess();
    return {
        ConflictDetection: cdk.stringToCloudFormation(properties.conflictDetection),
        ConflictHandler: cdk.stringToCloudFormation(properties.conflictHandler),
        LambdaConflictHandlerConfig: cfnFunctionConfigurationLambdaConflictHandlerConfigPropertyToCloudFormation(properties.lambdaConflictHandlerConfig),
    };
}

// @ts-ignore TS6133
function CfnFunctionConfigurationSyncConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionConfiguration.SyncConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionConfiguration.SyncConfigProperty>();
    ret.addPropertyResult('conflictDetection', 'ConflictDetection', cfn_parse.FromCloudFormation.getString(properties.ConflictDetection));
    ret.addPropertyResult('conflictHandler', 'ConflictHandler', properties.ConflictHandler != null ? cfn_parse.FromCloudFormation.getString(properties.ConflictHandler) : undefined);
    ret.addPropertyResult('lambdaConflictHandlerConfig', 'LambdaConflictHandlerConfig', properties.LambdaConflictHandlerConfig != null ? CfnFunctionConfigurationLambdaConflictHandlerConfigPropertyFromCloudFormation(properties.LambdaConflictHandlerConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnGraphQLApi`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html
 */
export interface CfnGraphQLApiProps {

    /**
     * Security configuration for your GraphQL API. For allowed values (such as `API_KEY` , `AWS_IAM` , `AMAZON_COGNITO_USER_POOLS` , `OPENID_CONNECT` , or `AWS_LAMBDA` ), see [Security](https://docs.aws.amazon.com/appsync/latest/devguide/security.html) in the *AWS AppSync Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-authenticationtype
     */
    readonly authenticationType: string;

    /**
     * The API name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-name
     */
    readonly name: string;

    /**
     * A list of additional authentication providers for the `GraphqlApi` API.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-additionalauthenticationproviders
     */
    readonly additionalAuthenticationProviders?: Array<CfnGraphQLApi.AdditionalAuthenticationProviderProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A `LambdaAuthorizerConfig` holds configuration on how to authorize AWS AppSync API access when using the `AWS_LAMBDA` authorizer mode. Be aware that an AWS AppSync API may have only one Lambda authorizer configured at a time.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-lambdaauthorizerconfig
     */
    readonly lambdaAuthorizerConfig?: CfnGraphQLApi.LambdaAuthorizerConfigProperty | cdk.IResolvable;

    /**
     * The Amazon CloudWatch Logs configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-logconfig
     */
    readonly logConfig?: CfnGraphQLApi.LogConfigProperty | cdk.IResolvable;

    /**
     * The OpenID Connect configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-openidconnectconfig
     */
    readonly openIdConnectConfig?: CfnGraphQLApi.OpenIDConnectConfigProperty | cdk.IResolvable;

    /**
     * An arbitrary set of tags (key-value pairs) for this GraphQL API.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Optional authorization configuration for using Amazon Cognito user pools with your GraphQL endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-userpoolconfig
     */
    readonly userPoolConfig?: CfnGraphQLApi.UserPoolConfigProperty | cdk.IResolvable;

    /**
     * A flag indicating whether to use AWS X-Ray tracing for this `GraphqlApi` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-xrayenabled
     */
    readonly xrayEnabled?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnGraphQLApiProps`
 *
 * @param properties - the TypeScript properties of a `CfnGraphQLApiProps`
 *
 * @returns the result of the validation.
 */
function CfnGraphQLApiPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('additionalAuthenticationProviders', cdk.listValidator(CfnGraphQLApi_AdditionalAuthenticationProviderPropertyValidator))(properties.additionalAuthenticationProviders));
    errors.collect(cdk.propertyValidator('authenticationType', cdk.requiredValidator)(properties.authenticationType));
    errors.collect(cdk.propertyValidator('authenticationType', cdk.validateString)(properties.authenticationType));
    errors.collect(cdk.propertyValidator('lambdaAuthorizerConfig', CfnGraphQLApi_LambdaAuthorizerConfigPropertyValidator)(properties.lambdaAuthorizerConfig));
    errors.collect(cdk.propertyValidator('logConfig', CfnGraphQLApi_LogConfigPropertyValidator)(properties.logConfig));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('openIdConnectConfig', CfnGraphQLApi_OpenIDConnectConfigPropertyValidator)(properties.openIdConnectConfig));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('userPoolConfig', CfnGraphQLApi_UserPoolConfigPropertyValidator)(properties.userPoolConfig));
    errors.collect(cdk.propertyValidator('xrayEnabled', cdk.validateBoolean)(properties.xrayEnabled));
    return errors.wrap('supplied properties not correct for "CfnGraphQLApiProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi` resource
 *
 * @param properties - the TypeScript properties of a `CfnGraphQLApiProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi` resource.
 */
// @ts-ignore TS6133
function cfnGraphQLApiPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGraphQLApiPropsValidator(properties).assertSuccess();
    return {
        AuthenticationType: cdk.stringToCloudFormation(properties.authenticationType),
        Name: cdk.stringToCloudFormation(properties.name),
        AdditionalAuthenticationProviders: cdk.listMapper(cfnGraphQLApiAdditionalAuthenticationProviderPropertyToCloudFormation)(properties.additionalAuthenticationProviders),
        LambdaAuthorizerConfig: cfnGraphQLApiLambdaAuthorizerConfigPropertyToCloudFormation(properties.lambdaAuthorizerConfig),
        LogConfig: cfnGraphQLApiLogConfigPropertyToCloudFormation(properties.logConfig),
        OpenIDConnectConfig: cfnGraphQLApiOpenIDConnectConfigPropertyToCloudFormation(properties.openIdConnectConfig),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        UserPoolConfig: cfnGraphQLApiUserPoolConfigPropertyToCloudFormation(properties.userPoolConfig),
        XrayEnabled: cdk.booleanToCloudFormation(properties.xrayEnabled),
    };
}

// @ts-ignore TS6133
function CfnGraphQLApiPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLApiProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApiProps>();
    ret.addPropertyResult('authenticationType', 'AuthenticationType', cfn_parse.FromCloudFormation.getString(properties.AuthenticationType));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('additionalAuthenticationProviders', 'AdditionalAuthenticationProviders', properties.AdditionalAuthenticationProviders != null ? cfn_parse.FromCloudFormation.getArray(CfnGraphQLApiAdditionalAuthenticationProviderPropertyFromCloudFormation)(properties.AdditionalAuthenticationProviders) : undefined);
    ret.addPropertyResult('lambdaAuthorizerConfig', 'LambdaAuthorizerConfig', properties.LambdaAuthorizerConfig != null ? CfnGraphQLApiLambdaAuthorizerConfigPropertyFromCloudFormation(properties.LambdaAuthorizerConfig) : undefined);
    ret.addPropertyResult('logConfig', 'LogConfig', properties.LogConfig != null ? CfnGraphQLApiLogConfigPropertyFromCloudFormation(properties.LogConfig) : undefined);
    ret.addPropertyResult('openIdConnectConfig', 'OpenIDConnectConfig', properties.OpenIDConnectConfig != null ? CfnGraphQLApiOpenIDConnectConfigPropertyFromCloudFormation(properties.OpenIDConnectConfig) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('userPoolConfig', 'UserPoolConfig', properties.UserPoolConfig != null ? CfnGraphQLApiUserPoolConfigPropertyFromCloudFormation(properties.UserPoolConfig) : undefined);
    ret.addPropertyResult('xrayEnabled', 'XrayEnabled', properties.XrayEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.XrayEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppSync::GraphQLApi`
 *
 * The `AWS::AppSync::GraphQLApi` resource creates a new AWS AppSync GraphQL API. This is the top-level construct for your application. For more information, see [Quick Start](https://docs.aws.amazon.com/appsync/latest/devguide/quickstart.html) in the *AWS AppSync Developer Guide* .
 *
 * @cloudformationResource AWS::AppSync::GraphQLApi
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html
 */
export class CfnGraphQLApi extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppSync::GraphQLApi";

    /**
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
        const ret = new CfnGraphQLApi(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Unique AWS AppSync GraphQL API identifier.
     * @cloudformationAttribute ApiId
     */
    public readonly attrApiId: string;

    /**
     * The Amazon Resource Name (ARN) of the API key, such as `arn:aws:appsync:us-east-1:123456789012:apis/graphqlapiid` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The Endpoint URL of your GraphQL API.
     * @cloudformationAttribute GraphQLUrl
     */
    public readonly attrGraphQlUrl: string;

    /**
     * Security configuration for your GraphQL API. For allowed values (such as `API_KEY` , `AWS_IAM` , `AMAZON_COGNITO_USER_POOLS` , `OPENID_CONNECT` , or `AWS_LAMBDA` ), see [Security](https://docs.aws.amazon.com/appsync/latest/devguide/security.html) in the *AWS AppSync Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-authenticationtype
     */
    public authenticationType: string;

    /**
     * The API name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-name
     */
    public name: string;

    /**
     * A list of additional authentication providers for the `GraphqlApi` API.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-additionalauthenticationproviders
     */
    public additionalAuthenticationProviders: Array<CfnGraphQLApi.AdditionalAuthenticationProviderProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A `LambdaAuthorizerConfig` holds configuration on how to authorize AWS AppSync API access when using the `AWS_LAMBDA` authorizer mode. Be aware that an AWS AppSync API may have only one Lambda authorizer configured at a time.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-lambdaauthorizerconfig
     */
    public lambdaAuthorizerConfig: CfnGraphQLApi.LambdaAuthorizerConfigProperty | cdk.IResolvable | undefined;

    /**
     * The Amazon CloudWatch Logs configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-logconfig
     */
    public logConfig: CfnGraphQLApi.LogConfigProperty | cdk.IResolvable | undefined;

    /**
     * The OpenID Connect configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-openidconnectconfig
     */
    public openIdConnectConfig: CfnGraphQLApi.OpenIDConnectConfigProperty | cdk.IResolvable | undefined;

    /**
     * An arbitrary set of tags (key-value pairs) for this GraphQL API.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Optional authorization configuration for using Amazon Cognito user pools with your GraphQL endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-userpoolconfig
     */
    public userPoolConfig: CfnGraphQLApi.UserPoolConfigProperty | cdk.IResolvable | undefined;

    /**
     * A flag indicating whether to use AWS X-Ray tracing for this `GraphqlApi` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-xrayenabled
     */
    public xrayEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::AppSync::GraphQLApi`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGraphQLApiProps) {
        super(scope, id, { type: CfnGraphQLApi.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'authenticationType', this);
        cdk.requireProperty(props, 'name', this);
        this.attrApiId = cdk.Token.asString(this.getAtt('ApiId', cdk.ResolutionTypeHint.STRING));
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrGraphQlUrl = cdk.Token.asString(this.getAtt('GraphQLUrl', cdk.ResolutionTypeHint.STRING));

        this.authenticationType = props.authenticationType;
        this.name = props.name;
        this.additionalAuthenticationProviders = props.additionalAuthenticationProviders;
        this.lambdaAuthorizerConfig = props.lambdaAuthorizerConfig;
        this.logConfig = props.logConfig;
        this.openIdConnectConfig = props.openIdConnectConfig;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppSync::GraphQLApi", props.tags, { tagPropertyName: 'tags' });
        this.userPoolConfig = props.userPoolConfig;
        this.xrayEnabled = props.xrayEnabled;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGraphQLApi.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            authenticationType: this.authenticationType,
            name: this.name,
            additionalAuthenticationProviders: this.additionalAuthenticationProviders,
            lambdaAuthorizerConfig: this.lambdaAuthorizerConfig,
            logConfig: this.logConfig,
            openIdConnectConfig: this.openIdConnectConfig,
            tags: this.tags.renderTags(),
            userPoolConfig: this.userPoolConfig,
            xrayEnabled: this.xrayEnabled,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGraphQLApiPropsToCloudFormation(props);
    }
}

export namespace CfnGraphQLApi {
    /**
     * Describes an additional authentication provider.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-additionalauthenticationprovider.html
     */
    export interface AdditionalAuthenticationProviderProperty {
        /**
         * The authentication type for API key, AWS Identity and Access Management , OIDC, Amazon Cognito user pools , or AWS Lambda .
         *
         * Valid Values: `API_KEY` | `AWS_IAM` | `OPENID_CONNECT` | `AMAZON_COGNITO_USER_POOLS` | `AWS_LAMBDA`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-additionalauthenticationprovider.html#cfn-appsync-graphqlapi-additionalauthenticationprovider-authenticationtype
         */
        readonly authenticationType: string;
        /**
         * Configuration for AWS Lambda function authorization.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-additionalauthenticationprovider.html#cfn-appsync-graphqlapi-additionalauthenticationprovider-lambdaauthorizerconfig
         */
        readonly lambdaAuthorizerConfig?: CfnGraphQLApi.LambdaAuthorizerConfigProperty | cdk.IResolvable;
        /**
         * The OIDC configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-additionalauthenticationprovider.html#cfn-appsync-graphqlapi-additionalauthenticationprovider-openidconnectconfig
         */
        readonly openIdConnectConfig?: CfnGraphQLApi.OpenIDConnectConfigProperty | cdk.IResolvable;
        /**
         * The Amazon Cognito user pool configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-additionalauthenticationprovider.html#cfn-appsync-graphqlapi-additionalauthenticationprovider-userpoolconfig
         */
        readonly userPoolConfig?: CfnGraphQLApi.CognitoUserPoolConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AdditionalAuthenticationProviderProperty`
 *
 * @param properties - the TypeScript properties of a `AdditionalAuthenticationProviderProperty`
 *
 * @returns the result of the validation.
 */
function CfnGraphQLApi_AdditionalAuthenticationProviderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authenticationType', cdk.requiredValidator)(properties.authenticationType));
    errors.collect(cdk.propertyValidator('authenticationType', cdk.validateString)(properties.authenticationType));
    errors.collect(cdk.propertyValidator('lambdaAuthorizerConfig', CfnGraphQLApi_LambdaAuthorizerConfigPropertyValidator)(properties.lambdaAuthorizerConfig));
    errors.collect(cdk.propertyValidator('openIdConnectConfig', CfnGraphQLApi_OpenIDConnectConfigPropertyValidator)(properties.openIdConnectConfig));
    errors.collect(cdk.propertyValidator('userPoolConfig', CfnGraphQLApi_CognitoUserPoolConfigPropertyValidator)(properties.userPoolConfig));
    return errors.wrap('supplied properties not correct for "AdditionalAuthenticationProviderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.AdditionalAuthenticationProvider` resource
 *
 * @param properties - the TypeScript properties of a `AdditionalAuthenticationProviderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.AdditionalAuthenticationProvider` resource.
 */
// @ts-ignore TS6133
function cfnGraphQLApiAdditionalAuthenticationProviderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGraphQLApi_AdditionalAuthenticationProviderPropertyValidator(properties).assertSuccess();
    return {
        AuthenticationType: cdk.stringToCloudFormation(properties.authenticationType),
        LambdaAuthorizerConfig: cfnGraphQLApiLambdaAuthorizerConfigPropertyToCloudFormation(properties.lambdaAuthorizerConfig),
        OpenIDConnectConfig: cfnGraphQLApiOpenIDConnectConfigPropertyToCloudFormation(properties.openIdConnectConfig),
        UserPoolConfig: cfnGraphQLApiCognitoUserPoolConfigPropertyToCloudFormation(properties.userPoolConfig),
    };
}

// @ts-ignore TS6133
function CfnGraphQLApiAdditionalAuthenticationProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLApi.AdditionalAuthenticationProviderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.AdditionalAuthenticationProviderProperty>();
    ret.addPropertyResult('authenticationType', 'AuthenticationType', cfn_parse.FromCloudFormation.getString(properties.AuthenticationType));
    ret.addPropertyResult('lambdaAuthorizerConfig', 'LambdaAuthorizerConfig', properties.LambdaAuthorizerConfig != null ? CfnGraphQLApiLambdaAuthorizerConfigPropertyFromCloudFormation(properties.LambdaAuthorizerConfig) : undefined);
    ret.addPropertyResult('openIdConnectConfig', 'OpenIDConnectConfig', properties.OpenIDConnectConfig != null ? CfnGraphQLApiOpenIDConnectConfigPropertyFromCloudFormation(properties.OpenIDConnectConfig) : undefined);
    ret.addPropertyResult('userPoolConfig', 'UserPoolConfig', properties.UserPoolConfig != null ? CfnGraphQLApiCognitoUserPoolConfigPropertyFromCloudFormation(properties.UserPoolConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGraphQLApi {
    /**
     * Describes an Amazon Cognito user pool configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-cognitouserpoolconfig.html
     */
    export interface CognitoUserPoolConfigProperty {
        /**
         * A regular expression for validating the incoming Amazon Cognito user pool app client ID. If this value isn't set, no filtering is applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-cognitouserpoolconfig.html#cfn-appsync-graphqlapi-cognitouserpoolconfig-appidclientregex
         */
        readonly appIdClientRegex?: string;
        /**
         * The AWS Region in which the user pool was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-cognitouserpoolconfig.html#cfn-appsync-graphqlapi-cognitouserpoolconfig-awsregion
         */
        readonly awsRegion?: string;
        /**
         * The user pool ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-cognitouserpoolconfig.html#cfn-appsync-graphqlapi-cognitouserpoolconfig-userpoolid
         */
        readonly userPoolId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CognitoUserPoolConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CognitoUserPoolConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnGraphQLApi_CognitoUserPoolConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appIdClientRegex', cdk.validateString)(properties.appIdClientRegex));
    errors.collect(cdk.propertyValidator('awsRegion', cdk.validateString)(properties.awsRegion));
    errors.collect(cdk.propertyValidator('userPoolId', cdk.validateString)(properties.userPoolId));
    return errors.wrap('supplied properties not correct for "CognitoUserPoolConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.CognitoUserPoolConfig` resource
 *
 * @param properties - the TypeScript properties of a `CognitoUserPoolConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.CognitoUserPoolConfig` resource.
 */
// @ts-ignore TS6133
function cfnGraphQLApiCognitoUserPoolConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGraphQLApi_CognitoUserPoolConfigPropertyValidator(properties).assertSuccess();
    return {
        AppIdClientRegex: cdk.stringToCloudFormation(properties.appIdClientRegex),
        AwsRegion: cdk.stringToCloudFormation(properties.awsRegion),
        UserPoolId: cdk.stringToCloudFormation(properties.userPoolId),
    };
}

// @ts-ignore TS6133
function CfnGraphQLApiCognitoUserPoolConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLApi.CognitoUserPoolConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.CognitoUserPoolConfigProperty>();
    ret.addPropertyResult('appIdClientRegex', 'AppIdClientRegex', properties.AppIdClientRegex != null ? cfn_parse.FromCloudFormation.getString(properties.AppIdClientRegex) : undefined);
    ret.addPropertyResult('awsRegion', 'AwsRegion', properties.AwsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsRegion) : undefined);
    ret.addPropertyResult('userPoolId', 'UserPoolId', properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGraphQLApi {
    /**
     * Configuration for AWS Lambda function authorization.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-lambdaauthorizerconfig.html
     */
    export interface LambdaAuthorizerConfigProperty {
        /**
         * The number of seconds a response should be cached for. The default is 5 minutes (300 seconds). The Lambda function can override this by returning a `ttlOverride` key in its response. A value of 0 disables caching of responses.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-lambdaauthorizerconfig.html#cfn-appsync-graphqlapi-lambdaauthorizerconfig-authorizerresultttlinseconds
         */
        readonly authorizerResultTtlInSeconds?: number;
        /**
         * The ARN of the Lambda function to be called for authorization. This may be a standard Lambda ARN, a version ARN ( `.../v3` ) or alias ARN.
         *
         * *Note* : This Lambda function must have the following resource-based policy assigned to it. When configuring Lambda authorizers in the console, this is done for you. To do so with the AWS CLI , run the following:
         *
         * `aws lambda add-permission --function-name "arn:aws:lambda:us-east-2:111122223333:function:my-function" --statement-id "appsync" --principal appsync.amazonaws.com --action lambda:InvokeFunction`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-lambdaauthorizerconfig.html#cfn-appsync-graphqlapi-lambdaauthorizerconfig-authorizeruri
         */
        readonly authorizerUri?: string;
        /**
         * A regular expression for validation of tokens before the Lambda function is called.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-lambdaauthorizerconfig.html#cfn-appsync-graphqlapi-lambdaauthorizerconfig-identityvalidationexpression
         */
        readonly identityValidationExpression?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaAuthorizerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaAuthorizerConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnGraphQLApi_LambdaAuthorizerConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authorizerResultTtlInSeconds', cdk.validateNumber)(properties.authorizerResultTtlInSeconds));
    errors.collect(cdk.propertyValidator('authorizerUri', cdk.validateString)(properties.authorizerUri));
    errors.collect(cdk.propertyValidator('identityValidationExpression', cdk.validateString)(properties.identityValidationExpression));
    return errors.wrap('supplied properties not correct for "LambdaAuthorizerConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.LambdaAuthorizerConfig` resource
 *
 * @param properties - the TypeScript properties of a `LambdaAuthorizerConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.LambdaAuthorizerConfig` resource.
 */
// @ts-ignore TS6133
function cfnGraphQLApiLambdaAuthorizerConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGraphQLApi_LambdaAuthorizerConfigPropertyValidator(properties).assertSuccess();
    return {
        AuthorizerResultTtlInSeconds: cdk.numberToCloudFormation(properties.authorizerResultTtlInSeconds),
        AuthorizerUri: cdk.stringToCloudFormation(properties.authorizerUri),
        IdentityValidationExpression: cdk.stringToCloudFormation(properties.identityValidationExpression),
    };
}

// @ts-ignore TS6133
function CfnGraphQLApiLambdaAuthorizerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLApi.LambdaAuthorizerConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.LambdaAuthorizerConfigProperty>();
    ret.addPropertyResult('authorizerResultTtlInSeconds', 'AuthorizerResultTtlInSeconds', properties.AuthorizerResultTtlInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.AuthorizerResultTtlInSeconds) : undefined);
    ret.addPropertyResult('authorizerUri', 'AuthorizerUri', properties.AuthorizerUri != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerUri) : undefined);
    ret.addPropertyResult('identityValidationExpression', 'IdentityValidationExpression', properties.IdentityValidationExpression != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityValidationExpression) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGraphQLApi {
    /**
     * The `LogConfig` property type specifies the logging configuration when writing GraphQL operations and tracing to Amazon CloudWatch for an AWS AppSync GraphQL API.
     *
     * `LogConfig` is a property of the [AWS::AppSync::GraphQLApi](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-logconfig.html
     */
    export interface LogConfigProperty {
        /**
         * The service role that AWS AppSync will assume to publish to Amazon CloudWatch Logs in your account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-logconfig.html#cfn-appsync-graphqlapi-logconfig-cloudwatchlogsrolearn
         */
        readonly cloudWatchLogsRoleArn?: string;
        /**
         * Set to TRUE to exclude sections that contain information such as headers, context, and evaluated mapping templates, regardless of logging level.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-logconfig.html#cfn-appsync-graphqlapi-logconfig-excludeverbosecontent
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-logconfig.html#cfn-appsync-graphqlapi-logconfig-fieldloglevel
         */
        readonly fieldLogLevel?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LogConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LogConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnGraphQLApi_LogConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchLogsRoleArn', cdk.validateString)(properties.cloudWatchLogsRoleArn));
    errors.collect(cdk.propertyValidator('excludeVerboseContent', cdk.validateBoolean)(properties.excludeVerboseContent));
    errors.collect(cdk.propertyValidator('fieldLogLevel', cdk.validateString)(properties.fieldLogLevel));
    return errors.wrap('supplied properties not correct for "LogConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.LogConfig` resource
 *
 * @param properties - the TypeScript properties of a `LogConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.LogConfig` resource.
 */
// @ts-ignore TS6133
function cfnGraphQLApiLogConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGraphQLApi_LogConfigPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchLogsRoleArn: cdk.stringToCloudFormation(properties.cloudWatchLogsRoleArn),
        ExcludeVerboseContent: cdk.booleanToCloudFormation(properties.excludeVerboseContent),
        FieldLogLevel: cdk.stringToCloudFormation(properties.fieldLogLevel),
    };
}

// @ts-ignore TS6133
function CfnGraphQLApiLogConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLApi.LogConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.LogConfigProperty>();
    ret.addPropertyResult('cloudWatchLogsRoleArn', 'CloudWatchLogsRoleArn', properties.CloudWatchLogsRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogsRoleArn) : undefined);
    ret.addPropertyResult('excludeVerboseContent', 'ExcludeVerboseContent', properties.ExcludeVerboseContent != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExcludeVerboseContent) : undefined);
    ret.addPropertyResult('fieldLogLevel', 'FieldLogLevel', properties.FieldLogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.FieldLogLevel) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGraphQLApi {
    /**
     * The `OpenIDConnectConfig` property type specifies the optional authorization configuration for using an OpenID Connect compliant service with your GraphQL endpoint for an AWS AppSync GraphQL API.
     *
     * `OpenIDConnectConfig` is a property of the [AWS::AppSync::GraphQLApi](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html
     */
    export interface OpenIDConnectConfigProperty {
        /**
         * The number of milliseconds that a token is valid after being authenticated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-authttl
         */
        readonly authTtl?: number;
        /**
         * The client identifier of the Relying party at the OpenID identity provider. This identifier is typically obtained when the Relying party is registered with the OpenID identity provider. You can specify a regular expression so that AWS AppSync can validate against multiple client identifiers at a time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-clientid
         */
        readonly clientId?: string;
        /**
         * The number of milliseconds that a token is valid after it's issued to a user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-iatttl
         */
        readonly iatTtl?: number;
        /**
         * The issuer for the OIDC configuration. The issuer returned by discovery must exactly match the value of `iss` in the ID token.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-issuer
         */
        readonly issuer?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OpenIDConnectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OpenIDConnectConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnGraphQLApi_OpenIDConnectConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authTtl', cdk.validateNumber)(properties.authTtl));
    errors.collect(cdk.propertyValidator('clientId', cdk.validateString)(properties.clientId));
    errors.collect(cdk.propertyValidator('iatTtl', cdk.validateNumber)(properties.iatTtl));
    errors.collect(cdk.propertyValidator('issuer', cdk.validateString)(properties.issuer));
    return errors.wrap('supplied properties not correct for "OpenIDConnectConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.OpenIDConnectConfig` resource
 *
 * @param properties - the TypeScript properties of a `OpenIDConnectConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.OpenIDConnectConfig` resource.
 */
// @ts-ignore TS6133
function cfnGraphQLApiOpenIDConnectConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGraphQLApi_OpenIDConnectConfigPropertyValidator(properties).assertSuccess();
    return {
        AuthTTL: cdk.numberToCloudFormation(properties.authTtl),
        ClientId: cdk.stringToCloudFormation(properties.clientId),
        IatTTL: cdk.numberToCloudFormation(properties.iatTtl),
        Issuer: cdk.stringToCloudFormation(properties.issuer),
    };
}

// @ts-ignore TS6133
function CfnGraphQLApiOpenIDConnectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLApi.OpenIDConnectConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.OpenIDConnectConfigProperty>();
    ret.addPropertyResult('authTtl', 'AuthTTL', properties.AuthTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.AuthTTL) : undefined);
    ret.addPropertyResult('clientId', 'ClientId', properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined);
    ret.addPropertyResult('iatTtl', 'IatTTL', properties.IatTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.IatTTL) : undefined);
    ret.addPropertyResult('issuer', 'Issuer', properties.Issuer != null ? cfn_parse.FromCloudFormation.getString(properties.Issuer) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGraphQLApi {
    /**
     * The `UserPoolConfig` property type specifies the optional authorization configuration for using Amazon Cognito user pools with your GraphQL endpoint for an AWS AppSync GraphQL API.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-userpoolconfig.html
     */
    export interface UserPoolConfigProperty {
        /**
         * A regular expression for validating the incoming Amazon Cognito user pool app client ID. If this value isn't set, no filtering is applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-userpoolconfig.html#cfn-appsync-graphqlapi-userpoolconfig-appidclientregex
         */
        readonly appIdClientRegex?: string;
        /**
         * The AWS Region in which the user pool was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-userpoolconfig.html#cfn-appsync-graphqlapi-userpoolconfig-awsregion
         */
        readonly awsRegion?: string;
        /**
         * The action that you want your GraphQL API to take when a request that uses Amazon Cognito user pool authentication doesn't match the Amazon Cognito user pool configuration.
         *
         * When specifying Amazon Cognito user pools as the default authentication, you must set the value for `DefaultAction` to `ALLOW` if specifying `AdditionalAuthenticationProviders` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-userpoolconfig.html#cfn-appsync-graphqlapi-userpoolconfig-defaultaction
         */
        readonly defaultAction?: string;
        /**
         * The user pool ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-userpoolconfig.html#cfn-appsync-graphqlapi-userpoolconfig-userpoolid
         */
        readonly userPoolId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `UserPoolConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UserPoolConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnGraphQLApi_UserPoolConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appIdClientRegex', cdk.validateString)(properties.appIdClientRegex));
    errors.collect(cdk.propertyValidator('awsRegion', cdk.validateString)(properties.awsRegion));
    errors.collect(cdk.propertyValidator('defaultAction', cdk.validateString)(properties.defaultAction));
    errors.collect(cdk.propertyValidator('userPoolId', cdk.validateString)(properties.userPoolId));
    return errors.wrap('supplied properties not correct for "UserPoolConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.UserPoolConfig` resource
 *
 * @param properties - the TypeScript properties of a `UserPoolConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::GraphQLApi.UserPoolConfig` resource.
 */
// @ts-ignore TS6133
function cfnGraphQLApiUserPoolConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGraphQLApi_UserPoolConfigPropertyValidator(properties).assertSuccess();
    return {
        AppIdClientRegex: cdk.stringToCloudFormation(properties.appIdClientRegex),
        AwsRegion: cdk.stringToCloudFormation(properties.awsRegion),
        DefaultAction: cdk.stringToCloudFormation(properties.defaultAction),
        UserPoolId: cdk.stringToCloudFormation(properties.userPoolId),
    };
}

// @ts-ignore TS6133
function CfnGraphQLApiUserPoolConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLApi.UserPoolConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLApi.UserPoolConfigProperty>();
    ret.addPropertyResult('appIdClientRegex', 'AppIdClientRegex', properties.AppIdClientRegex != null ? cfn_parse.FromCloudFormation.getString(properties.AppIdClientRegex) : undefined);
    ret.addPropertyResult('awsRegion', 'AwsRegion', properties.AwsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsRegion) : undefined);
    ret.addPropertyResult('defaultAction', 'DefaultAction', properties.DefaultAction != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAction) : undefined);
    ret.addPropertyResult('userPoolId', 'UserPoolId', properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnGraphQLSchema`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html
 */
export interface CfnGraphQLSchemaProps {

    /**
     * The AWS AppSync GraphQL API identifier to which you want to apply this schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-apiid
     */
    readonly apiId: string;

    /**
     * The text representation of a GraphQL schema in SDL format.
     *
     * For more information about using the `Ref` function, see [Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-definition
     */
    readonly definition?: string;

    /**
     * The location of a GraphQL schema file in an Amazon S3 bucket. Use this if you want to provision with the schema living in Amazon S3 rather than embedding it in your CloudFormation template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-definitions3location
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
function CfnGraphQLSchemaPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('definition', cdk.validateString)(properties.definition));
    errors.collect(cdk.propertyValidator('definitionS3Location', cdk.validateString)(properties.definitionS3Location));
    return errors.wrap('supplied properties not correct for "CfnGraphQLSchemaProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::GraphQLSchema` resource
 *
 * @param properties - the TypeScript properties of a `CfnGraphQLSchemaProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::GraphQLSchema` resource.
 */
// @ts-ignore TS6133
function cfnGraphQLSchemaPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGraphQLSchemaPropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        Definition: cdk.stringToCloudFormation(properties.definition),
        DefinitionS3Location: cdk.stringToCloudFormation(properties.definitionS3Location),
    };
}

// @ts-ignore TS6133
function CfnGraphQLSchemaPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphQLSchemaProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphQLSchemaProps>();
    ret.addPropertyResult('apiId', 'ApiId', cfn_parse.FromCloudFormation.getString(properties.ApiId));
    ret.addPropertyResult('definition', 'Definition', properties.Definition != null ? cfn_parse.FromCloudFormation.getString(properties.Definition) : undefined);
    ret.addPropertyResult('definitionS3Location', 'DefinitionS3Location', properties.DefinitionS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.DefinitionS3Location) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppSync::GraphQLSchema`
 *
 * The `AWS::AppSync::GraphQLSchema` resource is used for your AWS AppSync GraphQL schema that controls the data model for your API. Schema files are text written in Schema Definition Language (SDL) format. For more information about schema authoring, see [Designing a GraphQL API](https://docs.aws.amazon.com/appsync/latest/devguide/designing-a-graphql-api.html) in the *AWS AppSync Developer Guide* .
 *
 * > When you submit an update, AWS CloudFormation updates resources based on differences between what you submit and the stack's current template. To cause this resource to be updated you must change a property value for this resource in the CloudFormation template. Changing the Amazon S3 file content without changing a property value will not result in an update operation.
 * >
 * > See [Update Behaviors of Stack Resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html) in the *AWS CloudFormation User Guide* .
 *
 * @cloudformationResource AWS::AppSync::GraphQLSchema
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html
 */
export class CfnGraphQLSchema extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppSync::GraphQLSchema";

    /**
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
        const ret = new CfnGraphQLSchema(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The AWS AppSync GraphQL API identifier to which you want to apply this schema.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-apiid
     */
    public apiId: string;

    /**
     * The text representation of a GraphQL schema in SDL format.
     *
     * For more information about using the `Ref` function, see [Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-definition
     */
    public definition: string | undefined;

    /**
     * The location of a GraphQL schema file in an Amazon S3 bucket. Use this if you want to provision with the schema living in Amazon S3 rather than embedding it in your CloudFormation template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-definitions3location
     */
    public definitionS3Location: string | undefined;

    /**
     * Create a new `AWS::AppSync::GraphQLSchema`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGraphQLSchemaProps) {
        super(scope, id, { type: CfnGraphQLSchema.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'apiId', this);

        this.apiId = props.apiId;
        this.definition = props.definition;
        this.definitionS3Location = props.definitionS3Location;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGraphQLSchema.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            apiId: this.apiId,
            definition: this.definition,
            definitionS3Location: this.definitionS3Location,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGraphQLSchemaPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnResolver`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html
 */
export interface CfnResolverProps {

    /**
     * The AWS AppSync GraphQL API to which you want to attach this resolver.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-apiid
     */
    readonly apiId: string;

    /**
     * The GraphQL field on a type that invokes the resolver.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-fieldname
     */
    readonly fieldName: string;

    /**
     * The GraphQL type that invokes this resolver.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-typename
     */
    readonly typeName: string;

    /**
     * The caching configuration for the resolver.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-cachingconfig
     */
    readonly cachingConfig?: CfnResolver.CachingConfigProperty | cdk.IResolvable;

    /**
     * The `resolver` code that contains the request and response functions. When code is used, the `runtime` is required. The runtime value must be `APPSYNC_JS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-code
     */
    readonly code?: string;

    /**
     * The Amazon S3 endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-codes3location
     */
    readonly codeS3Location?: string;

    /**
     * The resolver data source name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-datasourcename
     */
    readonly dataSourceName?: string;

    /**
     * The resolver type.
     *
     * - *UNIT* : A UNIT resolver type. A UNIT resolver is the default resolver type. You can use a UNIT resolver to run a GraphQL query against a single data source.
     * - *PIPELINE* : A PIPELINE resolver type. You can use a PIPELINE resolver to invoke a series of `Function` objects in a serial manner. You can use a pipeline resolver to run a GraphQL query against multiple data sources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-kind
     */
    readonly kind?: string;

    /**
     * The maximum number of resolver request inputs that will be sent to a single AWS Lambda function in a `BatchInvoke` operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-maxbatchsize
     */
    readonly maxBatchSize?: number;

    /**
     * Functions linked with the pipeline resolver.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-pipelineconfig
     */
    readonly pipelineConfig?: CfnResolver.PipelineConfigProperty | cdk.IResolvable;

    /**
     * The request mapping template.
     *
     * Request mapping templates are optional when using a Lambda data source. For all other data sources, a request mapping template is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-requestmappingtemplate
     */
    readonly requestMappingTemplate?: string;

    /**
     * The location of a request mapping template in an Amazon S3 bucket. Use this if you want to provision with a template file in Amazon S3 rather than embedding it in your CloudFormation template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-requestmappingtemplates3location
     */
    readonly requestMappingTemplateS3Location?: string;

    /**
     * The response mapping template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-responsemappingtemplate
     */
    readonly responseMappingTemplate?: string;

    /**
     * The location of a response mapping template in an Amazon S3 bucket. Use this if you want to provision with a template file in Amazon S3 rather than embedding it in your CloudFormation template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-responsemappingtemplates3location
     */
    readonly responseMappingTemplateS3Location?: string;

    /**
     * Describes a runtime used by an AWS AppSync pipeline resolver or AWS AppSync function. Specifies the name and version of the runtime to use. Note that if a runtime is specified, code must also be specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-runtime
     */
    readonly runtime?: CfnResolver.AppSyncRuntimeProperty | cdk.IResolvable;

    /**
     * The `SyncConfig` for a resolver attached to a versioned data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-syncconfig
     */
    readonly syncConfig?: CfnResolver.SyncConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnResolverProps`
 *
 * @param properties - the TypeScript properties of a `CfnResolverProps`
 *
 * @returns the result of the validation.
 */
function CfnResolverPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('cachingConfig', CfnResolver_CachingConfigPropertyValidator)(properties.cachingConfig));
    errors.collect(cdk.propertyValidator('code', cdk.validateString)(properties.code));
    errors.collect(cdk.propertyValidator('codeS3Location', cdk.validateString)(properties.codeS3Location));
    errors.collect(cdk.propertyValidator('dataSourceName', cdk.validateString)(properties.dataSourceName));
    errors.collect(cdk.propertyValidator('fieldName', cdk.requiredValidator)(properties.fieldName));
    errors.collect(cdk.propertyValidator('fieldName', cdk.validateString)(properties.fieldName));
    errors.collect(cdk.propertyValidator('kind', cdk.validateString)(properties.kind));
    errors.collect(cdk.propertyValidator('maxBatchSize', cdk.validateNumber)(properties.maxBatchSize));
    errors.collect(cdk.propertyValidator('pipelineConfig', CfnResolver_PipelineConfigPropertyValidator)(properties.pipelineConfig));
    errors.collect(cdk.propertyValidator('requestMappingTemplate', cdk.validateString)(properties.requestMappingTemplate));
    errors.collect(cdk.propertyValidator('requestMappingTemplateS3Location', cdk.validateString)(properties.requestMappingTemplateS3Location));
    errors.collect(cdk.propertyValidator('responseMappingTemplate', cdk.validateString)(properties.responseMappingTemplate));
    errors.collect(cdk.propertyValidator('responseMappingTemplateS3Location', cdk.validateString)(properties.responseMappingTemplateS3Location));
    errors.collect(cdk.propertyValidator('runtime', CfnResolver_AppSyncRuntimePropertyValidator)(properties.runtime));
    errors.collect(cdk.propertyValidator('syncConfig', CfnResolver_SyncConfigPropertyValidator)(properties.syncConfig));
    errors.collect(cdk.propertyValidator('typeName', cdk.requiredValidator)(properties.typeName));
    errors.collect(cdk.propertyValidator('typeName', cdk.validateString)(properties.typeName));
    return errors.wrap('supplied properties not correct for "CfnResolverProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::Resolver` resource
 *
 * @param properties - the TypeScript properties of a `CfnResolverProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::Resolver` resource.
 */
// @ts-ignore TS6133
function cfnResolverPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResolverPropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        FieldName: cdk.stringToCloudFormation(properties.fieldName),
        TypeName: cdk.stringToCloudFormation(properties.typeName),
        CachingConfig: cfnResolverCachingConfigPropertyToCloudFormation(properties.cachingConfig),
        Code: cdk.stringToCloudFormation(properties.code),
        CodeS3Location: cdk.stringToCloudFormation(properties.codeS3Location),
        DataSourceName: cdk.stringToCloudFormation(properties.dataSourceName),
        Kind: cdk.stringToCloudFormation(properties.kind),
        MaxBatchSize: cdk.numberToCloudFormation(properties.maxBatchSize),
        PipelineConfig: cfnResolverPipelineConfigPropertyToCloudFormation(properties.pipelineConfig),
        RequestMappingTemplate: cdk.stringToCloudFormation(properties.requestMappingTemplate),
        RequestMappingTemplateS3Location: cdk.stringToCloudFormation(properties.requestMappingTemplateS3Location),
        ResponseMappingTemplate: cdk.stringToCloudFormation(properties.responseMappingTemplate),
        ResponseMappingTemplateS3Location: cdk.stringToCloudFormation(properties.responseMappingTemplateS3Location),
        Runtime: cfnResolverAppSyncRuntimePropertyToCloudFormation(properties.runtime),
        SyncConfig: cfnResolverSyncConfigPropertyToCloudFormation(properties.syncConfig),
    };
}

// @ts-ignore TS6133
function CfnResolverPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResolverProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolverProps>();
    ret.addPropertyResult('apiId', 'ApiId', cfn_parse.FromCloudFormation.getString(properties.ApiId));
    ret.addPropertyResult('fieldName', 'FieldName', cfn_parse.FromCloudFormation.getString(properties.FieldName));
    ret.addPropertyResult('typeName', 'TypeName', cfn_parse.FromCloudFormation.getString(properties.TypeName));
    ret.addPropertyResult('cachingConfig', 'CachingConfig', properties.CachingConfig != null ? CfnResolverCachingConfigPropertyFromCloudFormation(properties.CachingConfig) : undefined);
    ret.addPropertyResult('code', 'Code', properties.Code != null ? cfn_parse.FromCloudFormation.getString(properties.Code) : undefined);
    ret.addPropertyResult('codeS3Location', 'CodeS3Location', properties.CodeS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.CodeS3Location) : undefined);
    ret.addPropertyResult('dataSourceName', 'DataSourceName', properties.DataSourceName != null ? cfn_parse.FromCloudFormation.getString(properties.DataSourceName) : undefined);
    ret.addPropertyResult('kind', 'Kind', properties.Kind != null ? cfn_parse.FromCloudFormation.getString(properties.Kind) : undefined);
    ret.addPropertyResult('maxBatchSize', 'MaxBatchSize', properties.MaxBatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBatchSize) : undefined);
    ret.addPropertyResult('pipelineConfig', 'PipelineConfig', properties.PipelineConfig != null ? CfnResolverPipelineConfigPropertyFromCloudFormation(properties.PipelineConfig) : undefined);
    ret.addPropertyResult('requestMappingTemplate', 'RequestMappingTemplate', properties.RequestMappingTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.RequestMappingTemplate) : undefined);
    ret.addPropertyResult('requestMappingTemplateS3Location', 'RequestMappingTemplateS3Location', properties.RequestMappingTemplateS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.RequestMappingTemplateS3Location) : undefined);
    ret.addPropertyResult('responseMappingTemplate', 'ResponseMappingTemplate', properties.ResponseMappingTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseMappingTemplate) : undefined);
    ret.addPropertyResult('responseMappingTemplateS3Location', 'ResponseMappingTemplateS3Location', properties.ResponseMappingTemplateS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.ResponseMappingTemplateS3Location) : undefined);
    ret.addPropertyResult('runtime', 'Runtime', properties.Runtime != null ? CfnResolverAppSyncRuntimePropertyFromCloudFormation(properties.Runtime) : undefined);
    ret.addPropertyResult('syncConfig', 'SyncConfig', properties.SyncConfig != null ? CfnResolverSyncConfigPropertyFromCloudFormation(properties.SyncConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AppSync::Resolver`
 *
 * The `AWS::AppSync::Resolver` resource defines the logical GraphQL resolver that you attach to fields in a schema. Request and response templates for resolvers are written in Apache Velocity Template Language (VTL) format. For more information about resolvers, see [Resolver Mapping Template Reference](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference.html) .
 *
 * > When you submit an update, AWS CloudFormation updates resources based on differences between what you submit and the stack's current template. To cause this resource to be updated you must change a property value for this resource in the CloudFormation template. Changing the Amazon S3 file content without changing a property value will not result in an update operation.
 * >
 * > See [Update Behaviors of Stack Resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html) in the *AWS CloudFormation User Guide* .
 *
 * @cloudformationResource AWS::AppSync::Resolver
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html
 */
export class CfnResolver extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppSync::Resolver";

    /**
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
        const ret = new CfnResolver(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The GraphQL field on a type that invokes the resolver.
     * @cloudformationAttribute FieldName
     */
    public readonly attrFieldName: string;

    /**
     * ARN of the resolver, such as `arn:aws:appsync:us-east-1:123456789012:apis/graphqlapiid/types/typename/resolvers/resolvername` .
     * @cloudformationAttribute ResolverArn
     */
    public readonly attrResolverArn: string;

    /**
     * The GraphQL type that invokes this resolver.
     * @cloudformationAttribute TypeName
     */
    public readonly attrTypeName: string;

    /**
     * The AWS AppSync GraphQL API to which you want to attach this resolver.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-apiid
     */
    public apiId: string;

    /**
     * The GraphQL field on a type that invokes the resolver.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-fieldname
     */
    public fieldName: string;

    /**
     * The GraphQL type that invokes this resolver.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-typename
     */
    public typeName: string;

    /**
     * The caching configuration for the resolver.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-cachingconfig
     */
    public cachingConfig: CfnResolver.CachingConfigProperty | cdk.IResolvable | undefined;

    /**
     * The `resolver` code that contains the request and response functions. When code is used, the `runtime` is required. The runtime value must be `APPSYNC_JS` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-code
     */
    public code: string | undefined;

    /**
     * The Amazon S3 endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-codes3location
     */
    public codeS3Location: string | undefined;

    /**
     * The resolver data source name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-datasourcename
     */
    public dataSourceName: string | undefined;

    /**
     * The resolver type.
     *
     * - *UNIT* : A UNIT resolver type. A UNIT resolver is the default resolver type. You can use a UNIT resolver to run a GraphQL query against a single data source.
     * - *PIPELINE* : A PIPELINE resolver type. You can use a PIPELINE resolver to invoke a series of `Function` objects in a serial manner. You can use a pipeline resolver to run a GraphQL query against multiple data sources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-kind
     */
    public kind: string | undefined;

    /**
     * The maximum number of resolver request inputs that will be sent to a single AWS Lambda function in a `BatchInvoke` operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-maxbatchsize
     */
    public maxBatchSize: number | undefined;

    /**
     * Functions linked with the pipeline resolver.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-pipelineconfig
     */
    public pipelineConfig: CfnResolver.PipelineConfigProperty | cdk.IResolvable | undefined;

    /**
     * The request mapping template.
     *
     * Request mapping templates are optional when using a Lambda data source. For all other data sources, a request mapping template is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-requestmappingtemplate
     */
    public requestMappingTemplate: string | undefined;

    /**
     * The location of a request mapping template in an Amazon S3 bucket. Use this if you want to provision with a template file in Amazon S3 rather than embedding it in your CloudFormation template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-requestmappingtemplates3location
     */
    public requestMappingTemplateS3Location: string | undefined;

    /**
     * The response mapping template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-responsemappingtemplate
     */
    public responseMappingTemplate: string | undefined;

    /**
     * The location of a response mapping template in an Amazon S3 bucket. Use this if you want to provision with a template file in Amazon S3 rather than embedding it in your CloudFormation template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-responsemappingtemplates3location
     */
    public responseMappingTemplateS3Location: string | undefined;

    /**
     * Describes a runtime used by an AWS AppSync pipeline resolver or AWS AppSync function. Specifies the name and version of the runtime to use. Note that if a runtime is specified, code must also be specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-runtime
     */
    public runtime: CfnResolver.AppSyncRuntimeProperty | cdk.IResolvable | undefined;

    /**
     * The `SyncConfig` for a resolver attached to a versioned data source.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-syncconfig
     */
    public syncConfig: CfnResolver.SyncConfigProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::AppSync::Resolver`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResolverProps) {
        super(scope, id, { type: CfnResolver.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'fieldName', this);
        cdk.requireProperty(props, 'typeName', this);
        this.attrFieldName = cdk.Token.asString(this.getAtt('FieldName', cdk.ResolutionTypeHint.STRING));
        this.attrResolverArn = cdk.Token.asString(this.getAtt('ResolverArn', cdk.ResolutionTypeHint.STRING));
        this.attrTypeName = cdk.Token.asString(this.getAtt('TypeName', cdk.ResolutionTypeHint.STRING));

        this.apiId = props.apiId;
        this.fieldName = props.fieldName;
        this.typeName = props.typeName;
        this.cachingConfig = props.cachingConfig;
        this.code = props.code;
        this.codeS3Location = props.codeS3Location;
        this.dataSourceName = props.dataSourceName;
        this.kind = props.kind;
        this.maxBatchSize = props.maxBatchSize;
        this.pipelineConfig = props.pipelineConfig;
        this.requestMappingTemplate = props.requestMappingTemplate;
        this.requestMappingTemplateS3Location = props.requestMappingTemplateS3Location;
        this.responseMappingTemplate = props.responseMappingTemplate;
        this.responseMappingTemplateS3Location = props.responseMappingTemplateS3Location;
        this.runtime = props.runtime;
        this.syncConfig = props.syncConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResolver.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            apiId: this.apiId,
            fieldName: this.fieldName,
            typeName: this.typeName,
            cachingConfig: this.cachingConfig,
            code: this.code,
            codeS3Location: this.codeS3Location,
            dataSourceName: this.dataSourceName,
            kind: this.kind,
            maxBatchSize: this.maxBatchSize,
            pipelineConfig: this.pipelineConfig,
            requestMappingTemplate: this.requestMappingTemplate,
            requestMappingTemplateS3Location: this.requestMappingTemplateS3Location,
            responseMappingTemplate: this.responseMappingTemplate,
            responseMappingTemplateS3Location: this.responseMappingTemplateS3Location,
            runtime: this.runtime,
            syncConfig: this.syncConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResolverPropsToCloudFormation(props);
    }
}

export namespace CfnResolver {
    /**
     * Describes a runtime used by an AWS AppSync pipeline resolver or AWS AppSync function. Specifies the name and version of the runtime to use. Note that if a runtime is specified, code must also be specified.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-appsyncruntime.html
     */
    export interface AppSyncRuntimeProperty {
        /**
         * The `name` of the runtime to use. Currently, the only allowed value is `APPSYNC_JS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-appsyncruntime.html#cfn-appsync-resolver-appsyncruntime-name
         */
        readonly name: string;
        /**
         * The `version` of the runtime to use. Currently, the only allowed version is `1.0.0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-appsyncruntime.html#cfn-appsync-resolver-appsyncruntime-runtimeversion
         */
        readonly runtimeVersion: string;
    }
}

/**
 * Determine whether the given properties match those of a `AppSyncRuntimeProperty`
 *
 * @param properties - the TypeScript properties of a `AppSyncRuntimeProperty`
 *
 * @returns the result of the validation.
 */
function CfnResolver_AppSyncRuntimePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('runtimeVersion', cdk.requiredValidator)(properties.runtimeVersion));
    errors.collect(cdk.propertyValidator('runtimeVersion', cdk.validateString)(properties.runtimeVersion));
    return errors.wrap('supplied properties not correct for "AppSyncRuntimeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::Resolver.AppSyncRuntime` resource
 *
 * @param properties - the TypeScript properties of a `AppSyncRuntimeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::Resolver.AppSyncRuntime` resource.
 */
// @ts-ignore TS6133
function cfnResolverAppSyncRuntimePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResolver_AppSyncRuntimePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        RuntimeVersion: cdk.stringToCloudFormation(properties.runtimeVersion),
    };
}

// @ts-ignore TS6133
function CfnResolverAppSyncRuntimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResolver.AppSyncRuntimeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolver.AppSyncRuntimeProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('runtimeVersion', 'RuntimeVersion', cfn_parse.FromCloudFormation.getString(properties.RuntimeVersion));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResolver {
    /**
     * The caching configuration for a resolver that has caching activated.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-cachingconfig.html
     */
    export interface CachingConfigProperty {
        /**
         * The caching keys for a resolver that has caching activated.
         *
         * Valid values are entries from the `$context.arguments` , `$context.source` , and `$context.identity` maps.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-cachingconfig.html#cfn-appsync-resolver-cachingconfig-cachingkeys
         */
        readonly cachingKeys?: string[];
        /**
         * The TTL in seconds for a resolver that has caching activated.
         *
         * Valid values are 1–3,600 seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-cachingconfig.html#cfn-appsync-resolver-cachingconfig-ttl
         */
        readonly ttl: number;
    }
}

/**
 * Determine whether the given properties match those of a `CachingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CachingConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnResolver_CachingConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cachingKeys', cdk.listValidator(cdk.validateString))(properties.cachingKeys));
    errors.collect(cdk.propertyValidator('ttl', cdk.requiredValidator)(properties.ttl));
    errors.collect(cdk.propertyValidator('ttl', cdk.validateNumber)(properties.ttl));
    return errors.wrap('supplied properties not correct for "CachingConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::Resolver.CachingConfig` resource
 *
 * @param properties - the TypeScript properties of a `CachingConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::Resolver.CachingConfig` resource.
 */
// @ts-ignore TS6133
function cfnResolverCachingConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResolver_CachingConfigPropertyValidator(properties).assertSuccess();
    return {
        CachingKeys: cdk.listMapper(cdk.stringToCloudFormation)(properties.cachingKeys),
        Ttl: cdk.numberToCloudFormation(properties.ttl),
    };
}

// @ts-ignore TS6133
function CfnResolverCachingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResolver.CachingConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolver.CachingConfigProperty>();
    ret.addPropertyResult('cachingKeys', 'CachingKeys', properties.CachingKeys != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CachingKeys) : undefined);
    ret.addPropertyResult('ttl', 'Ttl', cfn_parse.FromCloudFormation.getNumber(properties.Ttl));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResolver {
    /**
     * The `LambdaConflictHandlerConfig` when configuring LAMBDA as the Conflict Handler.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-lambdaconflicthandlerconfig.html
     */
    export interface LambdaConflictHandlerConfigProperty {
        /**
         * The Amazon Resource Name (ARN) for the Lambda function to use as the Conflict Handler.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-lambdaconflicthandlerconfig.html#cfn-appsync-resolver-lambdaconflicthandlerconfig-lambdaconflicthandlerarn
         */
        readonly lambdaConflictHandlerArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaConflictHandlerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConflictHandlerConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnResolver_LambdaConflictHandlerConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lambdaConflictHandlerArn', cdk.validateString)(properties.lambdaConflictHandlerArn));
    return errors.wrap('supplied properties not correct for "LambdaConflictHandlerConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::Resolver.LambdaConflictHandlerConfig` resource
 *
 * @param properties - the TypeScript properties of a `LambdaConflictHandlerConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::Resolver.LambdaConflictHandlerConfig` resource.
 */
// @ts-ignore TS6133
function cfnResolverLambdaConflictHandlerConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResolver_LambdaConflictHandlerConfigPropertyValidator(properties).assertSuccess();
    return {
        LambdaConflictHandlerArn: cdk.stringToCloudFormation(properties.lambdaConflictHandlerArn),
    };
}

// @ts-ignore TS6133
function CfnResolverLambdaConflictHandlerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResolver.LambdaConflictHandlerConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolver.LambdaConflictHandlerConfigProperty>();
    ret.addPropertyResult('lambdaConflictHandlerArn', 'LambdaConflictHandlerArn', properties.LambdaConflictHandlerArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaConflictHandlerArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResolver {
    /**
     * Use the `PipelineConfig` property type to specify `PipelineConfig` for an AWS AppSync resolver.
     *
     * `PipelineConfig` is a property of the [AWS::AppSync::Resolver](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html) resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-pipelineconfig.html
     */
    export interface PipelineConfigProperty {
        /**
         * A list of `Function` objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-pipelineconfig.html#cfn-appsync-resolver-pipelineconfig-functions
         */
        readonly functions?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `PipelineConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PipelineConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnResolver_PipelineConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('functions', cdk.listValidator(cdk.validateString))(properties.functions));
    return errors.wrap('supplied properties not correct for "PipelineConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::Resolver.PipelineConfig` resource
 *
 * @param properties - the TypeScript properties of a `PipelineConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::Resolver.PipelineConfig` resource.
 */
// @ts-ignore TS6133
function cfnResolverPipelineConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResolver_PipelineConfigPropertyValidator(properties).assertSuccess();
    return {
        Functions: cdk.listMapper(cdk.stringToCloudFormation)(properties.functions),
    };
}

// @ts-ignore TS6133
function CfnResolverPipelineConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResolver.PipelineConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolver.PipelineConfigProperty>();
    ret.addPropertyResult('functions', 'Functions', properties.Functions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Functions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResolver {
    /**
     * Describes a Sync configuration for a resolver.
     *
     * Specifies which Conflict Detection strategy and Resolution strategy to use when the resolver is invoked.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-syncconfig.html
     */
    export interface SyncConfigProperty {
        /**
         * The Conflict Detection strategy to use.
         *
         * - *VERSION* : Detect conflicts based on object versions for this resolver.
         * - *NONE* : Do not detect conflicts when invoking this resolver.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-syncconfig.html#cfn-appsync-resolver-syncconfig-conflictdetection
         */
        readonly conflictDetection: string;
        /**
         * The Conflict Resolution strategy to perform in the event of a conflict.
         *
         * - *OPTIMISTIC_CONCURRENCY* : Resolve conflicts by rejecting mutations when versions don't match the latest version at the server.
         * - *AUTOMERGE* : Resolve conflicts with the Automerge conflict resolution strategy.
         * - *LAMBDA* : Resolve conflicts with an AWS Lambda function supplied in the `LambdaConflictHandlerConfig` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-syncconfig.html#cfn-appsync-resolver-syncconfig-conflicthandler
         */
        readonly conflictHandler?: string;
        /**
         * The `LambdaConflictHandlerConfig` when configuring `LAMBDA` as the Conflict Handler.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-syncconfig.html#cfn-appsync-resolver-syncconfig-lambdaconflicthandlerconfig
         */
        readonly lambdaConflictHandlerConfig?: CfnResolver.LambdaConflictHandlerConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SyncConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SyncConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnResolver_SyncConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('conflictDetection', cdk.requiredValidator)(properties.conflictDetection));
    errors.collect(cdk.propertyValidator('conflictDetection', cdk.validateString)(properties.conflictDetection));
    errors.collect(cdk.propertyValidator('conflictHandler', cdk.validateString)(properties.conflictHandler));
    errors.collect(cdk.propertyValidator('lambdaConflictHandlerConfig', CfnResolver_LambdaConflictHandlerConfigPropertyValidator)(properties.lambdaConflictHandlerConfig));
    return errors.wrap('supplied properties not correct for "SyncConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AppSync::Resolver.SyncConfig` resource
 *
 * @param properties - the TypeScript properties of a `SyncConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AppSync::Resolver.SyncConfig` resource.
 */
// @ts-ignore TS6133
function cfnResolverSyncConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResolver_SyncConfigPropertyValidator(properties).assertSuccess();
    return {
        ConflictDetection: cdk.stringToCloudFormation(properties.conflictDetection),
        ConflictHandler: cdk.stringToCloudFormation(properties.conflictHandler),
        LambdaConflictHandlerConfig: cfnResolverLambdaConflictHandlerConfigPropertyToCloudFormation(properties.lambdaConflictHandlerConfig),
    };
}

// @ts-ignore TS6133
function CfnResolverSyncConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResolver.SyncConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResolver.SyncConfigProperty>();
    ret.addPropertyResult('conflictDetection', 'ConflictDetection', cfn_parse.FromCloudFormation.getString(properties.ConflictDetection));
    ret.addPropertyResult('conflictHandler', 'ConflictHandler', properties.ConflictHandler != null ? cfn_parse.FromCloudFormation.getString(properties.ConflictHandler) : undefined);
    ret.addPropertyResult('lambdaConflictHandlerConfig', 'LambdaConflictHandlerConfig', properties.LambdaConflictHandlerConfig != null ? CfnResolverLambdaConflictHandlerConfigPropertyFromCloudFormation(properties.LambdaConflictHandlerConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
