// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-09T03:50:41.800Z","fingerprint":"IjwKfoNv078Ml7HPcuTUr2iRcl+HHlGVvPzZfG3mjZc="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnApi`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
 */
export interface CfnApiProps {

    /**
     * `AWS::Serverless::Api.StageName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly stageName: string;

    /**
     * `AWS::Serverless::Api.AccessLogSetting`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly accessLogSetting?: CfnApi.AccessLogSettingProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.Auth`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly auth?: CfnApi.AuthProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.BinaryMediaTypes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly binaryMediaTypes?: string[];

    /**
     * `AWS::Serverless::Api.CacheClusterEnabled`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly cacheClusterEnabled?: boolean | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.CacheClusterSize`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly cacheClusterSize?: string;

    /**
     * `AWS::Serverless::Api.CanarySetting`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-canarysetting
     */
    readonly canarySetting?: CfnApi.CanarySettingProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.Cors`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly cors?: CfnApi.CorsConfigurationProperty | string | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.DefinitionBody`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly definitionBody?: any | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.DefinitionUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly definitionUri?: CfnApi.S3LocationProperty | string | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.Description`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-description
     */
    readonly description?: string;

    /**
     * `AWS::Serverless::Api.DisableExecuteApiEndpoint`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-disableexecuteapiendpoint
     */
    readonly disableExecuteApiEndpoint?: boolean | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.Domain`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-domain
     */
    readonly domain?: CfnApi.DomainConfigurationProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.EndpointConfiguration`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly endpointConfiguration?: CfnApi.EndpointConfigurationProperty | string | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.GatewayResponses`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-gatewayresponses
     */
    readonly gatewayResponses?: any | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.MethodSettings`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly methodSettings?: Array<any | cdk.IResolvable> | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.MinimumCompressionSize`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-minimumcompressionsize
     */
    readonly minimumCompressionSize?: number;

    /**
     * `AWS::Serverless::Api.Models`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-models
     */
    readonly models?: any | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.Name`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly name?: string;

    /**
     * `AWS::Serverless::Api.OpenApiVersion`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly openApiVersion?: string;

    /**
     * `AWS::Serverless::Api.Tags`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly tags?: { [key: string]: (string) };

    /**
     * `AWS::Serverless::Api.TracingEnabled`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly tracingEnabled?: boolean | cdk.IResolvable;

    /**
     * `AWS::Serverless::Api.Variables`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly variables?: { [key: string]: (string) } | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnApiProps`
 *
 * @param properties - the TypeScript properties of a `CfnApiProps`
 *
 * @returns the result of the validation.
 */
function CfnApiPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessLogSetting', CfnApi_AccessLogSettingPropertyValidator)(properties.accessLogSetting));
    errors.collect(cdk.propertyValidator('auth', CfnApi_AuthPropertyValidator)(properties.auth));
    errors.collect(cdk.propertyValidator('binaryMediaTypes', cdk.listValidator(cdk.validateString))(properties.binaryMediaTypes));
    errors.collect(cdk.propertyValidator('cacheClusterEnabled', cdk.validateBoolean)(properties.cacheClusterEnabled));
    errors.collect(cdk.propertyValidator('cacheClusterSize', cdk.validateString)(properties.cacheClusterSize));
    errors.collect(cdk.propertyValidator('canarySetting', CfnApi_CanarySettingPropertyValidator)(properties.canarySetting));
    errors.collect(cdk.propertyValidator('cors', cdk.unionValidator(CfnApi_CorsConfigurationPropertyValidator, cdk.validateString))(properties.cors));
    errors.collect(cdk.propertyValidator('definitionBody', cdk.validateObject)(properties.definitionBody));
    errors.collect(cdk.propertyValidator('definitionUri', cdk.unionValidator(CfnApi_S3LocationPropertyValidator, cdk.validateString))(properties.definitionUri));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('disableExecuteApiEndpoint', cdk.validateBoolean)(properties.disableExecuteApiEndpoint));
    errors.collect(cdk.propertyValidator('domain', CfnApi_DomainConfigurationPropertyValidator)(properties.domain));
    errors.collect(cdk.propertyValidator('endpointConfiguration', cdk.unionValidator(CfnApi_EndpointConfigurationPropertyValidator, cdk.validateString))(properties.endpointConfiguration));
    errors.collect(cdk.propertyValidator('gatewayResponses', cdk.validateObject)(properties.gatewayResponses));
    errors.collect(cdk.propertyValidator('methodSettings', cdk.listValidator(cdk.validateObject))(properties.methodSettings));
    errors.collect(cdk.propertyValidator('minimumCompressionSize', cdk.validateNumber)(properties.minimumCompressionSize));
    errors.collect(cdk.propertyValidator('models', cdk.validateObject)(properties.models));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('openApiVersion', cdk.validateString)(properties.openApiVersion));
    errors.collect(cdk.propertyValidator('stageName', cdk.requiredValidator)(properties.stageName));
    errors.collect(cdk.propertyValidator('stageName', cdk.validateString)(properties.stageName));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('tracingEnabled', cdk.validateBoolean)(properties.tracingEnabled));
    errors.collect(cdk.propertyValidator('variables', cdk.hashValidator(cdk.validateString))(properties.variables));
    return errors.wrap('supplied properties not correct for "CfnApiProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Api` resource
 *
 * @param properties - the TypeScript properties of a `CfnApiProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Api` resource.
 */
// @ts-ignore TS6133
function cfnApiPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApiPropsValidator(properties).assertSuccess();
    return {
        StageName: cdk.stringToCloudFormation(properties.stageName),
        AccessLogSetting: cfnApiAccessLogSettingPropertyToCloudFormation(properties.accessLogSetting),
        Auth: cfnApiAuthPropertyToCloudFormation(properties.auth),
        BinaryMediaTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.binaryMediaTypes),
        CacheClusterEnabled: cdk.booleanToCloudFormation(properties.cacheClusterEnabled),
        CacheClusterSize: cdk.stringToCloudFormation(properties.cacheClusterSize),
        CanarySetting: cfnApiCanarySettingPropertyToCloudFormation(properties.canarySetting),
        Cors: cdk.unionMapper([CfnApi_CorsConfigurationPropertyValidator, cdk.validateString], [cfnApiCorsConfigurationPropertyToCloudFormation, cdk.stringToCloudFormation])(properties.cors),
        DefinitionBody: cdk.objectToCloudFormation(properties.definitionBody),
        DefinitionUri: cdk.unionMapper([CfnApi_S3LocationPropertyValidator, cdk.validateString], [cfnApiS3LocationPropertyToCloudFormation, cdk.stringToCloudFormation])(properties.definitionUri),
        Description: cdk.stringToCloudFormation(properties.description),
        DisableExecuteApiEndpoint: cdk.booleanToCloudFormation(properties.disableExecuteApiEndpoint),
        Domain: cfnApiDomainConfigurationPropertyToCloudFormation(properties.domain),
        EndpointConfiguration: cdk.unionMapper([CfnApi_EndpointConfigurationPropertyValidator, cdk.validateString], [cfnApiEndpointConfigurationPropertyToCloudFormation, cdk.stringToCloudFormation])(properties.endpointConfiguration),
        GatewayResponses: cdk.objectToCloudFormation(properties.gatewayResponses),
        MethodSettings: cdk.listMapper(cdk.objectToCloudFormation)(properties.methodSettings),
        MinimumCompressionSize: cdk.numberToCloudFormation(properties.minimumCompressionSize),
        Models: cdk.objectToCloudFormation(properties.models),
        Name: cdk.stringToCloudFormation(properties.name),
        OpenApiVersion: cdk.stringToCloudFormation(properties.openApiVersion),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        TracingEnabled: cdk.booleanToCloudFormation(properties.tracingEnabled),
        Variables: cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables),
    };
}

// @ts-ignore TS6133
function CfnApiPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiProps>();
    ret.addPropertyResult('stageName', 'StageName', cfn_parse.FromCloudFormation.getString(properties.StageName));
    ret.addPropertyResult('accessLogSetting', 'AccessLogSetting', properties.AccessLogSetting != null ? CfnApiAccessLogSettingPropertyFromCloudFormation(properties.AccessLogSetting) : undefined);
    ret.addPropertyResult('auth', 'Auth', properties.Auth != null ? CfnApiAuthPropertyFromCloudFormation(properties.Auth) : undefined);
    ret.addPropertyResult('binaryMediaTypes', 'BinaryMediaTypes', properties.BinaryMediaTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.BinaryMediaTypes) : undefined);
    ret.addPropertyResult('cacheClusterEnabled', 'CacheClusterEnabled', properties.CacheClusterEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CacheClusterEnabled) : undefined);
    ret.addPropertyResult('cacheClusterSize', 'CacheClusterSize', properties.CacheClusterSize != null ? cfn_parse.FromCloudFormation.getString(properties.CacheClusterSize) : undefined);
    ret.addPropertyResult('canarySetting', 'CanarySetting', properties.CanarySetting != null ? CfnApiCanarySettingPropertyFromCloudFormation(properties.CanarySetting) : undefined);
    ret.addPropertyResult('cors', 'Cors', properties.Cors != null ? cfn_parse.FromCloudFormation.getTypeUnion([CfnApi_CorsConfigurationPropertyValidator, cdk.validateString], [CfnApiCorsConfigurationPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString])(properties.Cors) : undefined);
    ret.addPropertyResult('definitionBody', 'DefinitionBody', properties.DefinitionBody != null ? cfn_parse.FromCloudFormation.getAny(properties.DefinitionBody) : undefined);
    ret.addPropertyResult('definitionUri', 'DefinitionUri', properties.DefinitionUri != null ? cfn_parse.FromCloudFormation.getTypeUnion([CfnApi_S3LocationPropertyValidator, cdk.validateString], [CfnApiS3LocationPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString])(properties.DefinitionUri) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('disableExecuteApiEndpoint', 'DisableExecuteApiEndpoint', properties.DisableExecuteApiEndpoint != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableExecuteApiEndpoint) : undefined);
    ret.addPropertyResult('domain', 'Domain', properties.Domain != null ? CfnApiDomainConfigurationPropertyFromCloudFormation(properties.Domain) : undefined);
    ret.addPropertyResult('endpointConfiguration', 'EndpointConfiguration', properties.EndpointConfiguration != null ? cfn_parse.FromCloudFormation.getTypeUnion([CfnApi_EndpointConfigurationPropertyValidator, cdk.validateString], [CfnApiEndpointConfigurationPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString])(properties.EndpointConfiguration) : undefined);
    ret.addPropertyResult('gatewayResponses', 'GatewayResponses', properties.GatewayResponses != null ? cfn_parse.FromCloudFormation.getAny(properties.GatewayResponses) : undefined);
    ret.addPropertyResult('methodSettings', 'MethodSettings', properties.MethodSettings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.MethodSettings) : undefined);
    ret.addPropertyResult('minimumCompressionSize', 'MinimumCompressionSize', properties.MinimumCompressionSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumCompressionSize) : undefined);
    ret.addPropertyResult('models', 'Models', properties.Models != null ? cfn_parse.FromCloudFormation.getAny(properties.Models) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('openApiVersion', 'OpenApiVersion', properties.OpenApiVersion != null ? cfn_parse.FromCloudFormation.getString(properties.OpenApiVersion) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addPropertyResult('tracingEnabled', 'TracingEnabled', properties.TracingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TracingEnabled) : undefined);
    ret.addPropertyResult('variables', 'Variables', properties.Variables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Variables) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Serverless::Api`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::Api
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
 */
export class CfnApi extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::Api";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApi {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApiPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApi(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * `AWS::Serverless::Api.StageName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public stageName: string;

    /**
     * `AWS::Serverless::Api.AccessLogSetting`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public accessLogSetting: CfnApi.AccessLogSettingProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.Auth`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public auth: CfnApi.AuthProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.BinaryMediaTypes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public binaryMediaTypes: string[] | undefined;

    /**
     * `AWS::Serverless::Api.CacheClusterEnabled`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public cacheClusterEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.CacheClusterSize`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public cacheClusterSize: string | undefined;

    /**
     * `AWS::Serverless::Api.CanarySetting`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-canarysetting
     */
    public canarySetting: CfnApi.CanarySettingProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.Cors`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public cors: CfnApi.CorsConfigurationProperty | string | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.DefinitionBody`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public definitionBody: any | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.DefinitionUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public definitionUri: CfnApi.S3LocationProperty | string | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.Description`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-description
     */
    public description: string | undefined;

    /**
     * `AWS::Serverless::Api.DisableExecuteApiEndpoint`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-disableexecuteapiendpoint
     */
    public disableExecuteApiEndpoint: boolean | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.Domain`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-domain
     */
    public domain: CfnApi.DomainConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.EndpointConfiguration`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public endpointConfiguration: CfnApi.EndpointConfigurationProperty | string | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.GatewayResponses`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-gatewayresponses
     */
    public gatewayResponses: any | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.MethodSettings`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public methodSettings: Array<any | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.MinimumCompressionSize`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-minimumcompressionsize
     */
    public minimumCompressionSize: number | undefined;

    /**
     * `AWS::Serverless::Api.Models`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-models
     */
    public models: any | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.Name`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public name: string | undefined;

    /**
     * `AWS::Serverless::Api.OpenApiVersion`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public openApiVersion: string | undefined;

    /**
     * `AWS::Serverless::Api.Tags`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public readonly tags: cdk.TagManager;

    /**
     * `AWS::Serverless::Api.TracingEnabled`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public tracingEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Api.Variables`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    public variables: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Serverless::Api`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApiProps) {
        super(scope, id, { type: CfnApi.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'stageName', this);
        // Automatically add the required transform
        this.stack.addTransform(CfnApi.REQUIRED_TRANSFORM);

        this.stageName = props.stageName;
        this.accessLogSetting = props.accessLogSetting;
        this.auth = props.auth;
        this.binaryMediaTypes = props.binaryMediaTypes;
        this.cacheClusterEnabled = props.cacheClusterEnabled;
        this.cacheClusterSize = props.cacheClusterSize;
        this.canarySetting = props.canarySetting;
        this.cors = props.cors;
        this.definitionBody = props.definitionBody;
        this.definitionUri = props.definitionUri;
        this.description = props.description;
        this.disableExecuteApiEndpoint = props.disableExecuteApiEndpoint;
        this.domain = props.domain;
        this.endpointConfiguration = props.endpointConfiguration;
        this.gatewayResponses = props.gatewayResponses;
        this.methodSettings = props.methodSettings;
        this.minimumCompressionSize = props.minimumCompressionSize;
        this.models = props.models;
        this.name = props.name;
        this.openApiVersion = props.openApiVersion;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::Api", props.tags, { tagPropertyName: 'tags' });
        this.tracingEnabled = props.tracingEnabled;
        this.variables = props.variables;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApi.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            stageName: this.stageName,
            accessLogSetting: this.accessLogSetting,
            auth: this.auth,
            binaryMediaTypes: this.binaryMediaTypes,
            cacheClusterEnabled: this.cacheClusterEnabled,
            cacheClusterSize: this.cacheClusterSize,
            canarySetting: this.canarySetting,
            cors: this.cors,
            definitionBody: this.definitionBody,
            definitionUri: this.definitionUri,
            description: this.description,
            disableExecuteApiEndpoint: this.disableExecuteApiEndpoint,
            domain: this.domain,
            endpointConfiguration: this.endpointConfiguration,
            gatewayResponses: this.gatewayResponses,
            methodSettings: this.methodSettings,
            minimumCompressionSize: this.minimumCompressionSize,
            models: this.models,
            name: this.name,
            openApiVersion: this.openApiVersion,
            tags: this.tags.renderTags(),
            tracingEnabled: this.tracingEnabled,
            variables: this.variables,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApiPropsToCloudFormation(props);
    }
}

export namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html
     */
    export interface AccessLogSettingProperty {
        /**
         * `CfnApi.AccessLogSettingProperty.DestinationArn`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html#cfn-apigateway-stage-accesslogsetting-destinationarn
         */
        readonly destinationArn?: string;
        /**
         * `CfnApi.AccessLogSettingProperty.Format`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html#cfn-apigateway-stage-accesslogsetting-format
         */
        readonly format?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AccessLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnApi_AccessLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationArn', cdk.validateString)(properties.destinationArn));
    errors.collect(cdk.propertyValidator('format', cdk.validateString)(properties.format));
    return errors.wrap('supplied properties not correct for "AccessLogSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Api.AccessLogSetting` resource
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Api.AccessLogSetting` resource.
 */
// @ts-ignore TS6133
function cfnApiAccessLogSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApi_AccessLogSettingPropertyValidator(properties).assertSuccess();
    return {
        DestinationArn: cdk.stringToCloudFormation(properties.destinationArn),
        Format: cdk.stringToCloudFormation(properties.format),
    };
}

// @ts-ignore TS6133
function CfnApiAccessLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.AccessLogSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.AccessLogSettingProperty>();
    ret.addPropertyResult('destinationArn', 'DestinationArn', properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined);
    ret.addPropertyResult('format', 'Format', properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
     */
    export interface AuthProperty {
        /**
         * `CfnApi.AuthProperty.AddDefaultAuthorizerToCorsPreflight`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
         */
        readonly addDefaultAuthorizerToCorsPreflight?: boolean | cdk.IResolvable;
        /**
         * `CfnApi.AuthProperty.Authorizers`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
         */
        readonly authorizers?: any | cdk.IResolvable;
        /**
         * `CfnApi.AuthProperty.DefaultAuthorizer`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
         */
        readonly defaultAuthorizer?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AuthProperty`
 *
 * @param properties - the TypeScript properties of a `AuthProperty`
 *
 * @returns the result of the validation.
 */
function CfnApi_AuthPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addDefaultAuthorizerToCorsPreflight', cdk.validateBoolean)(properties.addDefaultAuthorizerToCorsPreflight));
    errors.collect(cdk.propertyValidator('authorizers', cdk.validateObject)(properties.authorizers));
    errors.collect(cdk.propertyValidator('defaultAuthorizer', cdk.validateString)(properties.defaultAuthorizer));
    return errors.wrap('supplied properties not correct for "AuthProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Api.Auth` resource
 *
 * @param properties - the TypeScript properties of a `AuthProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Api.Auth` resource.
 */
// @ts-ignore TS6133
function cfnApiAuthPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApi_AuthPropertyValidator(properties).assertSuccess();
    return {
        AddDefaultAuthorizerToCorsPreflight: cdk.booleanToCloudFormation(properties.addDefaultAuthorizerToCorsPreflight),
        Authorizers: cdk.objectToCloudFormation(properties.authorizers),
        DefaultAuthorizer: cdk.stringToCloudFormation(properties.defaultAuthorizer),
    };
}

// @ts-ignore TS6133
function CfnApiAuthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.AuthProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.AuthProperty>();
    ret.addPropertyResult('addDefaultAuthorizerToCorsPreflight', 'AddDefaultAuthorizerToCorsPreflight', properties.AddDefaultAuthorizerToCorsPreflight != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AddDefaultAuthorizerToCorsPreflight) : undefined);
    ret.addPropertyResult('authorizers', 'Authorizers', properties.Authorizers != null ? cfn_parse.FromCloudFormation.getAny(properties.Authorizers) : undefined);
    ret.addPropertyResult('defaultAuthorizer', 'DefaultAuthorizer', properties.DefaultAuthorizer != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthorizer) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html
     */
    export interface CanarySettingProperty {
        /**
         * `CfnApi.CanarySettingProperty.DeploymentId`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-deploymentid
         */
        readonly deploymentId?: string;
        /**
         * `CfnApi.CanarySettingProperty.PercentTraffic`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-percenttraffic
         */
        readonly percentTraffic?: number;
        /**
         * `CfnApi.CanarySettingProperty.StageVariableOverrides`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-stagevariableoverrides
         */
        readonly stageVariableOverrides?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * `CfnApi.CanarySettingProperty.UseStageCache`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-usestagecache
         */
        readonly useStageCache?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CanarySettingProperty`
 *
 * @param properties - the TypeScript properties of a `CanarySettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnApi_CanarySettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deploymentId', cdk.validateString)(properties.deploymentId));
    errors.collect(cdk.propertyValidator('percentTraffic', cdk.validateNumber)(properties.percentTraffic));
    errors.collect(cdk.propertyValidator('stageVariableOverrides', cdk.hashValidator(cdk.validateString))(properties.stageVariableOverrides));
    errors.collect(cdk.propertyValidator('useStageCache', cdk.validateBoolean)(properties.useStageCache));
    return errors.wrap('supplied properties not correct for "CanarySettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Api.CanarySetting` resource
 *
 * @param properties - the TypeScript properties of a `CanarySettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Api.CanarySetting` resource.
 */
// @ts-ignore TS6133
function cfnApiCanarySettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApi_CanarySettingPropertyValidator(properties).assertSuccess();
    return {
        DeploymentId: cdk.stringToCloudFormation(properties.deploymentId),
        PercentTraffic: cdk.numberToCloudFormation(properties.percentTraffic),
        StageVariableOverrides: cdk.hashMapper(cdk.stringToCloudFormation)(properties.stageVariableOverrides),
        UseStageCache: cdk.booleanToCloudFormation(properties.useStageCache),
    };
}

// @ts-ignore TS6133
function CfnApiCanarySettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.CanarySettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.CanarySettingProperty>();
    ret.addPropertyResult('deploymentId', 'DeploymentId', properties.DeploymentId != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentId) : undefined);
    ret.addPropertyResult('percentTraffic', 'PercentTraffic', properties.PercentTraffic != null ? cfn_parse.FromCloudFormation.getNumber(properties.PercentTraffic) : undefined);
    ret.addPropertyResult('stageVariableOverrides', 'StageVariableOverrides', properties.StageVariableOverrides != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.StageVariableOverrides) : undefined);
    ret.addPropertyResult('useStageCache', 'UseStageCache', properties.UseStageCache != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseStageCache) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
     */
    export interface CorsConfigurationProperty {
        /**
         * `CfnApi.CorsConfigurationProperty.AllowCredentials`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
         */
        readonly allowCredentials?: boolean | cdk.IResolvable;
        /**
         * `CfnApi.CorsConfigurationProperty.AllowHeaders`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
         */
        readonly allowHeaders?: string;
        /**
         * `CfnApi.CorsConfigurationProperty.AllowMethods`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
         */
        readonly allowMethods?: string;
        /**
         * `CfnApi.CorsConfigurationProperty.AllowOrigin`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
         */
        readonly allowOrigin: string;
        /**
         * `CfnApi.CorsConfigurationProperty.MaxAge`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
         */
        readonly maxAge?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CorsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CorsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApi_CorsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowCredentials', cdk.validateBoolean)(properties.allowCredentials));
    errors.collect(cdk.propertyValidator('allowHeaders', cdk.validateString)(properties.allowHeaders));
    errors.collect(cdk.propertyValidator('allowMethods', cdk.validateString)(properties.allowMethods));
    errors.collect(cdk.propertyValidator('allowOrigin', cdk.requiredValidator)(properties.allowOrigin));
    errors.collect(cdk.propertyValidator('allowOrigin', cdk.validateString)(properties.allowOrigin));
    errors.collect(cdk.propertyValidator('maxAge', cdk.validateString)(properties.maxAge));
    return errors.wrap('supplied properties not correct for "CorsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Api.CorsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CorsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Api.CorsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApiCorsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApi_CorsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AllowCredentials: cdk.booleanToCloudFormation(properties.allowCredentials),
        AllowHeaders: cdk.stringToCloudFormation(properties.allowHeaders),
        AllowMethods: cdk.stringToCloudFormation(properties.allowMethods),
        AllowOrigin: cdk.stringToCloudFormation(properties.allowOrigin),
        MaxAge: cdk.stringToCloudFormation(properties.maxAge),
    };
}

// @ts-ignore TS6133
function CfnApiCorsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.CorsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.CorsConfigurationProperty>();
    ret.addPropertyResult('allowCredentials', 'AllowCredentials', properties.AllowCredentials != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCredentials) : undefined);
    ret.addPropertyResult('allowHeaders', 'AllowHeaders', properties.AllowHeaders != null ? cfn_parse.FromCloudFormation.getString(properties.AllowHeaders) : undefined);
    ret.addPropertyResult('allowMethods', 'AllowMethods', properties.AllowMethods != null ? cfn_parse.FromCloudFormation.getString(properties.AllowMethods) : undefined);
    ret.addPropertyResult('allowOrigin', 'AllowOrigin', cfn_parse.FromCloudFormation.getString(properties.AllowOrigin));
    ret.addPropertyResult('maxAge', 'MaxAge', properties.MaxAge != null ? cfn_parse.FromCloudFormation.getString(properties.MaxAge) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html
     */
    export interface DomainConfigurationProperty {
        /**
         * `CfnApi.DomainConfigurationProperty.BasePath`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-basepath
         */
        readonly basePath?: string[];
        /**
         * `CfnApi.DomainConfigurationProperty.CertificateArn`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-certificatearn
         */
        readonly certificateArn: string;
        /**
         * `CfnApi.DomainConfigurationProperty.DomainName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-domainname
         */
        readonly domainName: string;
        /**
         * `CfnApi.DomainConfigurationProperty.EndpointConfiguration`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-endpointconfiguration
         */
        readonly endpointConfiguration?: string;
        /**
         * `CfnApi.DomainConfigurationProperty.MutualTlsAuthentication`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-mutualtlsauthentication
         */
        readonly mutualTlsAuthentication?: CfnApi.MutualTlsAuthenticationProperty | cdk.IResolvable;
        /**
         * `CfnApi.DomainConfigurationProperty.OwnershipVerificationCertificateArn`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-ownershipverificationcertificatearn
         */
        readonly ownershipVerificationCertificateArn?: string;
        /**
         * `CfnApi.DomainConfigurationProperty.Route53`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-route53
         */
        readonly route53?: CfnApi.Route53ConfigurationProperty | cdk.IResolvable;
        /**
         * `CfnApi.DomainConfigurationProperty.SecurityPolicy`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-securitypolicy
         */
        readonly securityPolicy?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DomainConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DomainConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApi_DomainConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('basePath', cdk.listValidator(cdk.validateString))(properties.basePath));
    errors.collect(cdk.propertyValidator('certificateArn', cdk.requiredValidator)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('endpointConfiguration', cdk.validateString)(properties.endpointConfiguration));
    errors.collect(cdk.propertyValidator('mutualTlsAuthentication', CfnApi_MutualTlsAuthenticationPropertyValidator)(properties.mutualTlsAuthentication));
    errors.collect(cdk.propertyValidator('ownershipVerificationCertificateArn', cdk.validateString)(properties.ownershipVerificationCertificateArn));
    errors.collect(cdk.propertyValidator('route53', CfnApi_Route53ConfigurationPropertyValidator)(properties.route53));
    errors.collect(cdk.propertyValidator('securityPolicy', cdk.validateString)(properties.securityPolicy));
    return errors.wrap('supplied properties not correct for "DomainConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Api.DomainConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DomainConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Api.DomainConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApiDomainConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApi_DomainConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BasePath: cdk.listMapper(cdk.stringToCloudFormation)(properties.basePath),
        CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        EndpointConfiguration: cdk.stringToCloudFormation(properties.endpointConfiguration),
        MutualTlsAuthentication: cfnApiMutualTlsAuthenticationPropertyToCloudFormation(properties.mutualTlsAuthentication),
        OwnershipVerificationCertificateArn: cdk.stringToCloudFormation(properties.ownershipVerificationCertificateArn),
        Route53: cfnApiRoute53ConfigurationPropertyToCloudFormation(properties.route53),
        SecurityPolicy: cdk.stringToCloudFormation(properties.securityPolicy),
    };
}

// @ts-ignore TS6133
function CfnApiDomainConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.DomainConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.DomainConfigurationProperty>();
    ret.addPropertyResult('basePath', 'BasePath', properties.BasePath != null ? cfn_parse.FromCloudFormation.getStringArray(properties.BasePath) : undefined);
    ret.addPropertyResult('certificateArn', 'CertificateArn', cfn_parse.FromCloudFormation.getString(properties.CertificateArn));
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('endpointConfiguration', 'EndpointConfiguration', properties.EndpointConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointConfiguration) : undefined);
    ret.addPropertyResult('mutualTlsAuthentication', 'MutualTlsAuthentication', properties.MutualTlsAuthentication != null ? CfnApiMutualTlsAuthenticationPropertyFromCloudFormation(properties.MutualTlsAuthentication) : undefined);
    ret.addPropertyResult('ownershipVerificationCertificateArn', 'OwnershipVerificationCertificateArn', properties.OwnershipVerificationCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.OwnershipVerificationCertificateArn) : undefined);
    ret.addPropertyResult('route53', 'Route53', properties.Route53 != null ? CfnApiRoute53ConfigurationPropertyFromCloudFormation(properties.Route53) : undefined);
    ret.addPropertyResult('securityPolicy', 'SecurityPolicy', properties.SecurityPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-endpointconfiguration.html
     */
    export interface EndpointConfigurationProperty {
        /**
         * `CfnApi.EndpointConfigurationProperty.Type`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-endpointconfiguration.html#sam-api-endpointconfiguration-type
         */
        readonly type?: string;
        /**
         * `CfnApi.EndpointConfigurationProperty.VpcEndpointIds`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-endpointconfiguration.html#sam-api-endpointconfiguration-vpcendpointids
         */
        readonly vpcEndpointIds?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `EndpointConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApi_EndpointConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('vpcEndpointIds', cdk.listValidator(cdk.validateString))(properties.vpcEndpointIds));
    return errors.wrap('supplied properties not correct for "EndpointConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Api.EndpointConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EndpointConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Api.EndpointConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApiEndpointConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApi_EndpointConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        VpcEndpointIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcEndpointIds),
    };
}

// @ts-ignore TS6133
function CfnApiEndpointConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.EndpointConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.EndpointConfigurationProperty>();
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('vpcEndpointIds', 'VpcEndpointIds', properties.VpcEndpointIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.VpcEndpointIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-mutualtlsauthentication.html
     */
    export interface MutualTlsAuthenticationProperty {
        /**
         * `CfnApi.MutualTlsAuthenticationProperty.TruststoreUri`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-mutualtlsauthentication.html#cfn-apigateway-domainname-mutualtlsauthentication-truststoreuri
         */
        readonly truststoreUri?: string;
        /**
         * `CfnApi.MutualTlsAuthenticationProperty.TruststoreVersion`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-mutualtlsauthentication.html#cfn-apigateway-domainname-mutualtlsauthentication-truststoreversion
         */
        readonly truststoreVersion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MutualTlsAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `MutualTlsAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApi_MutualTlsAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('truststoreUri', cdk.validateString)(properties.truststoreUri));
    errors.collect(cdk.propertyValidator('truststoreVersion', cdk.validateString)(properties.truststoreVersion));
    return errors.wrap('supplied properties not correct for "MutualTlsAuthenticationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Api.MutualTlsAuthentication` resource
 *
 * @param properties - the TypeScript properties of a `MutualTlsAuthenticationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Api.MutualTlsAuthentication` resource.
 */
// @ts-ignore TS6133
function cfnApiMutualTlsAuthenticationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApi_MutualTlsAuthenticationPropertyValidator(properties).assertSuccess();
    return {
        TruststoreUri: cdk.stringToCloudFormation(properties.truststoreUri),
        TruststoreVersion: cdk.stringToCloudFormation(properties.truststoreVersion),
    };
}

// @ts-ignore TS6133
function CfnApiMutualTlsAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.MutualTlsAuthenticationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.MutualTlsAuthenticationProperty>();
    ret.addPropertyResult('truststoreUri', 'TruststoreUri', properties.TruststoreUri != null ? cfn_parse.FromCloudFormation.getString(properties.TruststoreUri) : undefined);
    ret.addPropertyResult('truststoreVersion', 'TruststoreVersion', properties.TruststoreVersion != null ? cfn_parse.FromCloudFormation.getString(properties.TruststoreVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html
     */
    export interface Route53ConfigurationProperty {
        /**
         * `CfnApi.Route53ConfigurationProperty.DistributedDomainName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html#sam-api-route53configuration-distributiondomainname
         */
        readonly distributedDomainName?: string;
        /**
         * `CfnApi.Route53ConfigurationProperty.EvaluateTargetHealth`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html#sam-api-route53configuration-evaluatetargethealth
         */
        readonly evaluateTargetHealth?: boolean | cdk.IResolvable;
        /**
         * `CfnApi.Route53ConfigurationProperty.HostedZoneId`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html#sam-api-route53configuration-hostedzoneid
         */
        readonly hostedZoneId?: string;
        /**
         * `CfnApi.Route53ConfigurationProperty.HostedZoneName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html#sam-api-route53configuration-hostedzonename
         */
        readonly hostedZoneName?: string;
        /**
         * `CfnApi.Route53ConfigurationProperty.IpV6`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html#sam-api-route53configuration-ipv6
         */
        readonly ipV6?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `Route53ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `Route53ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApi_Route53ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('distributedDomainName', cdk.validateString)(properties.distributedDomainName));
    errors.collect(cdk.propertyValidator('evaluateTargetHealth', cdk.validateBoolean)(properties.evaluateTargetHealth));
    errors.collect(cdk.propertyValidator('hostedZoneId', cdk.validateString)(properties.hostedZoneId));
    errors.collect(cdk.propertyValidator('hostedZoneName', cdk.validateString)(properties.hostedZoneName));
    errors.collect(cdk.propertyValidator('ipV6', cdk.validateBoolean)(properties.ipV6));
    return errors.wrap('supplied properties not correct for "Route53ConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Api.Route53Configuration` resource
 *
 * @param properties - the TypeScript properties of a `Route53ConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Api.Route53Configuration` resource.
 */
// @ts-ignore TS6133
function cfnApiRoute53ConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApi_Route53ConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DistributedDomainName: cdk.stringToCloudFormation(properties.distributedDomainName),
        EvaluateTargetHealth: cdk.booleanToCloudFormation(properties.evaluateTargetHealth),
        HostedZoneId: cdk.stringToCloudFormation(properties.hostedZoneId),
        HostedZoneName: cdk.stringToCloudFormation(properties.hostedZoneName),
        IpV6: cdk.booleanToCloudFormation(properties.ipV6),
    };
}

// @ts-ignore TS6133
function CfnApiRoute53ConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.Route53ConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.Route53ConfigurationProperty>();
    ret.addPropertyResult('distributedDomainName', 'DistributedDomainName', properties.DistributedDomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DistributedDomainName) : undefined);
    ret.addPropertyResult('evaluateTargetHealth', 'EvaluateTargetHealth', properties.EvaluateTargetHealth != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EvaluateTargetHealth) : undefined);
    ret.addPropertyResult('hostedZoneId', 'HostedZoneId', properties.HostedZoneId != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneId) : undefined);
    ret.addPropertyResult('hostedZoneName', 'HostedZoneName', properties.HostedZoneName != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneName) : undefined);
    ret.addPropertyResult('ipV6', 'IpV6', properties.IpV6 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IpV6) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    export interface S3LocationProperty {
        /**
         * `CfnApi.S3LocationProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly bucket: string;
        /**
         * `CfnApi.S3LocationProperty.Key`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly key: string;
        /**
         * `CfnApi.S3LocationProperty.Version`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly version: number;
    }
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApi_S3LocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('version', cdk.requiredValidator)(properties.version));
    errors.collect(cdk.propertyValidator('version', cdk.validateNumber)(properties.version));
    return errors.wrap('supplied properties not correct for "S3LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Api.S3Location` resource
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Api.S3Location` resource.
 */
// @ts-ignore TS6133
function cfnApiS3LocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApi_S3LocationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Key: cdk.stringToCloudFormation(properties.key),
        Version: cdk.numberToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnApiS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.S3LocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.S3LocationProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('version', 'Version', cfn_parse.FromCloudFormation.getNumber(properties.Version));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
 */
export interface CfnApplicationProps {

    /**
     * `AWS::Serverless::Application.Location`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    readonly location: CfnApplication.ApplicationLocationProperty | string | cdk.IResolvable;

    /**
     * `AWS::Serverless::Application.NotificationArns`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    readonly notificationArns?: string[];

    /**
     * `AWS::Serverless::Application.Parameters`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    readonly parameters?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * `AWS::Serverless::Application.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    readonly tags?: { [key: string]: (string) };

    /**
     * `AWS::Serverless::Application.TimeoutInMinutes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    readonly timeoutInMinutes?: number;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('location', cdk.requiredValidator)(properties.location));
    errors.collect(cdk.propertyValidator('location', cdk.unionValidator(CfnApplication_ApplicationLocationPropertyValidator, cdk.validateString))(properties.location));
    errors.collect(cdk.propertyValidator('notificationArns', cdk.listValidator(cdk.validateString))(properties.notificationArns));
    errors.collect(cdk.propertyValidator('parameters', cdk.hashValidator(cdk.validateString))(properties.parameters));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('timeoutInMinutes', cdk.validateNumber)(properties.timeoutInMinutes));
    return errors.wrap('supplied properties not correct for "CfnApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Application` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Application` resource.
 */
// @ts-ignore TS6133
function cfnApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationPropsValidator(properties).assertSuccess();
    return {
        Location: cdk.unionMapper([CfnApplication_ApplicationLocationPropertyValidator, cdk.validateString], [cfnApplicationApplicationLocationPropertyToCloudFormation, cdk.stringToCloudFormation])(properties.location),
        NotificationArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationArns),
        Parameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        TimeoutInMinutes: cdk.numberToCloudFormation(properties.timeoutInMinutes),
    };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
    ret.addPropertyResult('location', 'Location', cfn_parse.FromCloudFormation.getTypeUnion([CfnApplication_ApplicationLocationPropertyValidator, cdk.validateString], [CfnApplicationApplicationLocationPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString])(properties.Location));
    ret.addPropertyResult('notificationArns', 'NotificationArns', properties.NotificationArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.NotificationArns) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addPropertyResult('timeoutInMinutes', 'TimeoutInMinutes', properties.TimeoutInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInMinutes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Serverless::Application`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::Application
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::Application";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";

    /**
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
        const ret = new CfnApplication(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * `AWS::Serverless::Application.Location`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    public location: CfnApplication.ApplicationLocationProperty | string | cdk.IResolvable;

    /**
     * `AWS::Serverless::Application.NotificationArns`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    public notificationArns: string[] | undefined;

    /**
     * `AWS::Serverless::Application.Parameters`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    public parameters: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Application.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    public readonly tags: cdk.TagManager;

    /**
     * `AWS::Serverless::Application.TimeoutInMinutes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    public timeoutInMinutes: number | undefined;

    /**
     * Create a new `AWS::Serverless::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
        super(scope, id, { type: CfnApplication.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'location', this);
        // Automatically add the required transform
        this.stack.addTransform(CfnApplication.REQUIRED_TRANSFORM);

        this.location = props.location;
        this.notificationArns = props.notificationArns;
        this.parameters = props.parameters;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::Application", props.tags, { tagPropertyName: 'tags' });
        this.timeoutInMinutes = props.timeoutInMinutes;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            location: this.location,
            notificationArns: this.notificationArns,
            parameters: this.parameters,
            tags: this.tags.renderTags(),
            timeoutInMinutes: this.timeoutInMinutes,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationPropsToCloudFormation(props);
    }
}

export namespace CfnApplication {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    export interface ApplicationLocationProperty {
        /**
         * `CfnApplication.ApplicationLocationProperty.ApplicationId`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
         */
        readonly applicationId: string;
        /**
         * `CfnApplication.ApplicationLocationProperty.SemanticVersion`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
         */
        readonly semanticVersion: string;
    }
}

/**
 * Determine whether the given properties match those of a `ApplicationLocationProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ApplicationLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('semanticVersion', cdk.requiredValidator)(properties.semanticVersion));
    errors.collect(cdk.propertyValidator('semanticVersion', cdk.validateString)(properties.semanticVersion));
    return errors.wrap('supplied properties not correct for "ApplicationLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Application.ApplicationLocation` resource
 *
 * @param properties - the TypeScript properties of a `ApplicationLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Application.ApplicationLocation` resource.
 */
// @ts-ignore TS6133
function cfnApplicationApplicationLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ApplicationLocationPropertyValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        SemanticVersion: cdk.stringToCloudFormation(properties.semanticVersion),
    };
}

// @ts-ignore TS6133
function CfnApplicationApplicationLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApplicationLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApplicationLocationProperty>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('semanticVersion', 'SemanticVersion', cfn_parse.FromCloudFormation.getString(properties.SemanticVersion));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFunction`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
 */
export interface CfnFunctionProps {

    /**
     * `AWS::Serverless::Function.Architectures`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-architectures
     */
    readonly architectures?: string[];

    /**
     * `AWS::Serverless::Function.AssumeRolePolicyDocument`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-assumerolepolicydocument
     */
    readonly assumeRolePolicyDocument?: any | cdk.IResolvable;

    /**
     * `AWS::Serverless::Function.AutoPublishAlias`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly autoPublishAlias?: string;

    /**
     * `AWS::Serverless::Function.AutoPublishCodeSha256`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-autopublishcodesha256
     */
    readonly autoPublishCodeSha256?: string;

    /**
     * `AWS::Serverless::Function.CodeSigningConfigArn`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-codesigningconfigarn
     */
    readonly codeSigningConfigArn?: string;

    /**
     * `AWS::Serverless::Function.CodeUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly codeUri?: CfnFunction.S3LocationProperty | string | cdk.IResolvable;

    /**
     * `AWS::Serverless::Function.DeadLetterQueue`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly deadLetterQueue?: CfnFunction.DeadLetterQueueProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::Function.DeploymentPreference`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
     */
    readonly deploymentPreference?: CfnFunction.DeploymentPreferenceProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::Function.Description`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly description?: string;

    /**
     * `AWS::Serverless::Function.Environment`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly environment?: CfnFunction.FunctionEnvironmentProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::Function.EventInvokeConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly eventInvokeConfig?: CfnFunction.EventInvokeConfigProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::Function.Events`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly events?: { [key: string]: (CfnFunction.EventSourceProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * `AWS::Serverless::Function.FileSystemConfigs`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html
     */
    readonly fileSystemConfigs?: Array<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * `AWS::Serverless::Function.FunctionName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly functionName?: string;

    /**
     * `AWS::Serverless::Function.Handler`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly handler?: string;

    /**
     * `AWS::Serverless::Function.ImageConfig`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-imageconfig
     */
    readonly imageConfig?: CfnFunction.ImageConfigProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::Function.ImageUri`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-imageuri
     */
    readonly imageUri?: string;

    /**
     * `AWS::Serverless::Function.InlineCode`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly inlineCode?: string;

    /**
     * `AWS::Serverless::Function.KmsKeyArn`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly kmsKeyArn?: string;

    /**
     * `AWS::Serverless::Function.Layers`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly layers?: string[];

    /**
     * `AWS::Serverless::Function.MemorySize`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly memorySize?: number;

    /**
     * `AWS::Serverless::Function.PackageType`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-packagetype
     */
    readonly packageType?: string;

    /**
     * `AWS::Serverless::Function.PermissionsBoundary`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly permissionsBoundary?: string;

    /**
     * `AWS::Serverless::Function.Policies`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly policies?: Array<CfnFunction.IAMPolicyDocumentProperty | CfnFunction.SAMPolicyTemplateProperty | string | cdk.IResolvable> | CfnFunction.IAMPolicyDocumentProperty | string | cdk.IResolvable;

    /**
     * `AWS::Serverless::Function.ProvisionedConcurrencyConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly provisionedConcurrencyConfig?: CfnFunction.ProvisionedConcurrencyConfigProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::Function.ReservedConcurrentExecutions`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly reservedConcurrentExecutions?: number;

    /**
     * `AWS::Serverless::Function.Role`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly role?: string;

    /**
     * `AWS::Serverless::Function.Runtime`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly runtime?: string;

    /**
     * `AWS::Serverless::Function.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly tags?: { [key: string]: (string) };

    /**
     * `AWS::Serverless::Function.Timeout`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly timeout?: number;

    /**
     * `AWS::Serverless::Function.Tracing`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly tracing?: string;

    /**
     * `AWS::Serverless::Function.VersionDescription`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly versionDescription?: string;

    /**
     * `AWS::Serverless::Function.VpcConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly vpcConfig?: CfnFunction.VpcConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnFunctionProps`
 *
 * @param properties - the TypeScript properties of a `CfnFunctionProps`
 *
 * @returns the result of the validation.
 */
function CfnFunctionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('architectures', cdk.listValidator(cdk.validateString))(properties.architectures));
    errors.collect(cdk.propertyValidator('assumeRolePolicyDocument', cdk.validateObject)(properties.assumeRolePolicyDocument));
    errors.collect(cdk.propertyValidator('autoPublishAlias', cdk.validateString)(properties.autoPublishAlias));
    errors.collect(cdk.propertyValidator('autoPublishCodeSha256', cdk.validateString)(properties.autoPublishCodeSha256));
    errors.collect(cdk.propertyValidator('codeSigningConfigArn', cdk.validateString)(properties.codeSigningConfigArn));
    errors.collect(cdk.propertyValidator('codeUri', cdk.unionValidator(CfnFunction_S3LocationPropertyValidator, cdk.validateString))(properties.codeUri));
    errors.collect(cdk.propertyValidator('deadLetterQueue', CfnFunction_DeadLetterQueuePropertyValidator)(properties.deadLetterQueue));
    errors.collect(cdk.propertyValidator('deploymentPreference', CfnFunction_DeploymentPreferencePropertyValidator)(properties.deploymentPreference));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('environment', CfnFunction_FunctionEnvironmentPropertyValidator)(properties.environment));
    errors.collect(cdk.propertyValidator('eventInvokeConfig', CfnFunction_EventInvokeConfigPropertyValidator)(properties.eventInvokeConfig));
    errors.collect(cdk.propertyValidator('events', cdk.hashValidator(CfnFunction_EventSourcePropertyValidator))(properties.events));
    errors.collect(cdk.propertyValidator('fileSystemConfigs', cdk.listValidator(CfnFunction_FileSystemConfigPropertyValidator))(properties.fileSystemConfigs));
    errors.collect(cdk.propertyValidator('functionName', cdk.validateString)(properties.functionName));
    errors.collect(cdk.propertyValidator('handler', cdk.validateString)(properties.handler));
    errors.collect(cdk.propertyValidator('imageConfig', CfnFunction_ImageConfigPropertyValidator)(properties.imageConfig));
    errors.collect(cdk.propertyValidator('imageUri', cdk.validateString)(properties.imageUri));
    errors.collect(cdk.propertyValidator('inlineCode', cdk.validateString)(properties.inlineCode));
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('layers', cdk.listValidator(cdk.validateString))(properties.layers));
    errors.collect(cdk.propertyValidator('memorySize', cdk.validateNumber)(properties.memorySize));
    errors.collect(cdk.propertyValidator('packageType', cdk.validateString)(properties.packageType));
    errors.collect(cdk.propertyValidator('permissionsBoundary', cdk.validateString)(properties.permissionsBoundary));
    errors.collect(cdk.propertyValidator('policies', cdk.unionValidator(cdk.unionValidator(CfnFunction_IAMPolicyDocumentPropertyValidator, cdk.validateString), cdk.listValidator(cdk.unionValidator(CfnFunction_IAMPolicyDocumentPropertyValidator, CfnFunction_SAMPolicyTemplatePropertyValidator, cdk.validateString))))(properties.policies));
    errors.collect(cdk.propertyValidator('provisionedConcurrencyConfig', CfnFunction_ProvisionedConcurrencyConfigPropertyValidator)(properties.provisionedConcurrencyConfig));
    errors.collect(cdk.propertyValidator('reservedConcurrentExecutions', cdk.validateNumber)(properties.reservedConcurrentExecutions));
    errors.collect(cdk.propertyValidator('role', cdk.validateString)(properties.role));
    errors.collect(cdk.propertyValidator('runtime', cdk.validateString)(properties.runtime));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('timeout', cdk.validateNumber)(properties.timeout));
    errors.collect(cdk.propertyValidator('tracing', cdk.validateString)(properties.tracing));
    errors.collect(cdk.propertyValidator('versionDescription', cdk.validateString)(properties.versionDescription));
    errors.collect(cdk.propertyValidator('vpcConfig', CfnFunction_VpcConfigPropertyValidator)(properties.vpcConfig));
    return errors.wrap('supplied properties not correct for "CfnFunctionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function` resource
 *
 * @param properties - the TypeScript properties of a `CfnFunctionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function` resource.
 */
// @ts-ignore TS6133
function cfnFunctionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunctionPropsValidator(properties).assertSuccess();
    return {
        Architectures: cdk.listMapper(cdk.stringToCloudFormation)(properties.architectures),
        AssumeRolePolicyDocument: cdk.objectToCloudFormation(properties.assumeRolePolicyDocument),
        AutoPublishAlias: cdk.stringToCloudFormation(properties.autoPublishAlias),
        AutoPublishCodeSha256: cdk.stringToCloudFormation(properties.autoPublishCodeSha256),
        CodeSigningConfigArn: cdk.stringToCloudFormation(properties.codeSigningConfigArn),
        CodeUri: cdk.unionMapper([CfnFunction_S3LocationPropertyValidator, cdk.validateString], [cfnFunctionS3LocationPropertyToCloudFormation, cdk.stringToCloudFormation])(properties.codeUri),
        DeadLetterQueue: cfnFunctionDeadLetterQueuePropertyToCloudFormation(properties.deadLetterQueue),
        DeploymentPreference: cfnFunctionDeploymentPreferencePropertyToCloudFormation(properties.deploymentPreference),
        Description: cdk.stringToCloudFormation(properties.description),
        Environment: cfnFunctionFunctionEnvironmentPropertyToCloudFormation(properties.environment),
        EventInvokeConfig: cfnFunctionEventInvokeConfigPropertyToCloudFormation(properties.eventInvokeConfig),
        Events: cdk.hashMapper(cfnFunctionEventSourcePropertyToCloudFormation)(properties.events),
        FileSystemConfigs: cdk.listMapper(cfnFunctionFileSystemConfigPropertyToCloudFormation)(properties.fileSystemConfigs),
        FunctionName: cdk.stringToCloudFormation(properties.functionName),
        Handler: cdk.stringToCloudFormation(properties.handler),
        ImageConfig: cfnFunctionImageConfigPropertyToCloudFormation(properties.imageConfig),
        ImageUri: cdk.stringToCloudFormation(properties.imageUri),
        InlineCode: cdk.stringToCloudFormation(properties.inlineCode),
        KmsKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        Layers: cdk.listMapper(cdk.stringToCloudFormation)(properties.layers),
        MemorySize: cdk.numberToCloudFormation(properties.memorySize),
        PackageType: cdk.stringToCloudFormation(properties.packageType),
        PermissionsBoundary: cdk.stringToCloudFormation(properties.permissionsBoundary),
        Policies: cdk.unionMapper([cdk.unionValidator(CfnFunction_IAMPolicyDocumentPropertyValidator, cdk.validateString), cdk.listValidator(cdk.unionValidator(CfnFunction_IAMPolicyDocumentPropertyValidator, CfnFunction_SAMPolicyTemplatePropertyValidator, cdk.validateString))], [cdk.unionMapper([CfnFunction_IAMPolicyDocumentPropertyValidator, cdk.validateString], [cfnFunctionIAMPolicyDocumentPropertyToCloudFormation, cdk.stringToCloudFormation]), cdk.listMapper(cdk.unionMapper([CfnFunction_IAMPolicyDocumentPropertyValidator, CfnFunction_SAMPolicyTemplatePropertyValidator, cdk.validateString], [cfnFunctionIAMPolicyDocumentPropertyToCloudFormation, cfnFunctionSAMPolicyTemplatePropertyToCloudFormation, cdk.stringToCloudFormation]))])(properties.policies),
        ProvisionedConcurrencyConfig: cfnFunctionProvisionedConcurrencyConfigPropertyToCloudFormation(properties.provisionedConcurrencyConfig),
        ReservedConcurrentExecutions: cdk.numberToCloudFormation(properties.reservedConcurrentExecutions),
        Role: cdk.stringToCloudFormation(properties.role),
        Runtime: cdk.stringToCloudFormation(properties.runtime),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        Timeout: cdk.numberToCloudFormation(properties.timeout),
        Tracing: cdk.stringToCloudFormation(properties.tracing),
        VersionDescription: cdk.stringToCloudFormation(properties.versionDescription),
        VpcConfig: cfnFunctionVpcConfigPropertyToCloudFormation(properties.vpcConfig),
    };
}

// @ts-ignore TS6133
function CfnFunctionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionProps>();
    ret.addPropertyResult('architectures', 'Architectures', properties.Architectures != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Architectures) : undefined);
    ret.addPropertyResult('assumeRolePolicyDocument', 'AssumeRolePolicyDocument', properties.AssumeRolePolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.AssumeRolePolicyDocument) : undefined);
    ret.addPropertyResult('autoPublishAlias', 'AutoPublishAlias', properties.AutoPublishAlias != null ? cfn_parse.FromCloudFormation.getString(properties.AutoPublishAlias) : undefined);
    ret.addPropertyResult('autoPublishCodeSha256', 'AutoPublishCodeSha256', properties.AutoPublishCodeSha256 != null ? cfn_parse.FromCloudFormation.getString(properties.AutoPublishCodeSha256) : undefined);
    ret.addPropertyResult('codeSigningConfigArn', 'CodeSigningConfigArn', properties.CodeSigningConfigArn != null ? cfn_parse.FromCloudFormation.getString(properties.CodeSigningConfigArn) : undefined);
    ret.addPropertyResult('codeUri', 'CodeUri', properties.CodeUri != null ? cfn_parse.FromCloudFormation.getTypeUnion([CfnFunction_S3LocationPropertyValidator, cdk.validateString], [CfnFunctionS3LocationPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString])(properties.CodeUri) : undefined);
    ret.addPropertyResult('deadLetterQueue', 'DeadLetterQueue', properties.DeadLetterQueue != null ? CfnFunctionDeadLetterQueuePropertyFromCloudFormation(properties.DeadLetterQueue) : undefined);
    ret.addPropertyResult('deploymentPreference', 'DeploymentPreference', properties.DeploymentPreference != null ? CfnFunctionDeploymentPreferencePropertyFromCloudFormation(properties.DeploymentPreference) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('environment', 'Environment', properties.Environment != null ? CfnFunctionFunctionEnvironmentPropertyFromCloudFormation(properties.Environment) : undefined);
    ret.addPropertyResult('eventInvokeConfig', 'EventInvokeConfig', properties.EventInvokeConfig != null ? CfnFunctionEventInvokeConfigPropertyFromCloudFormation(properties.EventInvokeConfig) : undefined);
    ret.addPropertyResult('events', 'Events', properties.Events != null ? cfn_parse.FromCloudFormation.getMap(CfnFunctionEventSourcePropertyFromCloudFormation)(properties.Events) : undefined);
    ret.addPropertyResult('fileSystemConfigs', 'FileSystemConfigs', properties.FileSystemConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnFunctionFileSystemConfigPropertyFromCloudFormation)(properties.FileSystemConfigs) : undefined);
    ret.addPropertyResult('functionName', 'FunctionName', properties.FunctionName != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionName) : undefined);
    ret.addPropertyResult('handler', 'Handler', properties.Handler != null ? cfn_parse.FromCloudFormation.getString(properties.Handler) : undefined);
    ret.addPropertyResult('imageConfig', 'ImageConfig', properties.ImageConfig != null ? CfnFunctionImageConfigPropertyFromCloudFormation(properties.ImageConfig) : undefined);
    ret.addPropertyResult('imageUri', 'ImageUri', properties.ImageUri != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUri) : undefined);
    ret.addPropertyResult('inlineCode', 'InlineCode', properties.InlineCode != null ? cfn_parse.FromCloudFormation.getString(properties.InlineCode) : undefined);
    ret.addPropertyResult('kmsKeyArn', 'KmsKeyArn', properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined);
    ret.addPropertyResult('layers', 'Layers', properties.Layers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Layers) : undefined);
    ret.addPropertyResult('memorySize', 'MemorySize', properties.MemorySize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemorySize) : undefined);
    ret.addPropertyResult('packageType', 'PackageType', properties.PackageType != null ? cfn_parse.FromCloudFormation.getString(properties.PackageType) : undefined);
    ret.addPropertyResult('permissionsBoundary', 'PermissionsBoundary', properties.PermissionsBoundary != null ? cfn_parse.FromCloudFormation.getString(properties.PermissionsBoundary) : undefined);
    ret.addPropertyResult('policies', 'Policies', properties.Policies != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.unionValidator(CfnFunction_IAMPolicyDocumentPropertyValidator, cdk.validateString), cdk.listValidator(cdk.unionValidator(CfnFunction_IAMPolicyDocumentPropertyValidator, CfnFunction_SAMPolicyTemplatePropertyValidator, cdk.validateString))], [cfn_parse.FromCloudFormation.getTypeUnion([CfnFunction_IAMPolicyDocumentPropertyValidator, cdk.validateString], [CfnFunctionIAMPolicyDocumentPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString]), cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getTypeUnion([CfnFunction_IAMPolicyDocumentPropertyValidator, CfnFunction_SAMPolicyTemplatePropertyValidator, cdk.validateString], [CfnFunctionIAMPolicyDocumentPropertyFromCloudFormation, CfnFunctionSAMPolicyTemplatePropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString]))])(properties.Policies) : undefined);
    ret.addPropertyResult('provisionedConcurrencyConfig', 'ProvisionedConcurrencyConfig', properties.ProvisionedConcurrencyConfig != null ? CfnFunctionProvisionedConcurrencyConfigPropertyFromCloudFormation(properties.ProvisionedConcurrencyConfig) : undefined);
    ret.addPropertyResult('reservedConcurrentExecutions', 'ReservedConcurrentExecutions', properties.ReservedConcurrentExecutions != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReservedConcurrentExecutions) : undefined);
    ret.addPropertyResult('role', 'Role', properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined);
    ret.addPropertyResult('runtime', 'Runtime', properties.Runtime != null ? cfn_parse.FromCloudFormation.getString(properties.Runtime) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addPropertyResult('timeout', 'Timeout', properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined);
    ret.addPropertyResult('tracing', 'Tracing', properties.Tracing != null ? cfn_parse.FromCloudFormation.getString(properties.Tracing) : undefined);
    ret.addPropertyResult('versionDescription', 'VersionDescription', properties.VersionDescription != null ? cfn_parse.FromCloudFormation.getString(properties.VersionDescription) : undefined);
    ret.addPropertyResult('vpcConfig', 'VpcConfig', properties.VpcConfig != null ? CfnFunctionVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Serverless::Function`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::Function
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
 */
export class CfnFunction extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::Function";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFunction {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFunctionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnFunction(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * `AWS::Serverless::Function.Architectures`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-architectures
     */
    public architectures: string[] | undefined;

    /**
     * `AWS::Serverless::Function.AssumeRolePolicyDocument`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-assumerolepolicydocument
     */
    public assumeRolePolicyDocument: any | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Function.AutoPublishAlias`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public autoPublishAlias: string | undefined;

    /**
     * `AWS::Serverless::Function.AutoPublishCodeSha256`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-autopublishcodesha256
     */
    public autoPublishCodeSha256: string | undefined;

    /**
     * `AWS::Serverless::Function.CodeSigningConfigArn`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-codesigningconfigarn
     */
    public codeSigningConfigArn: string | undefined;

    /**
     * `AWS::Serverless::Function.CodeUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public codeUri: CfnFunction.S3LocationProperty | string | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Function.DeadLetterQueue`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public deadLetterQueue: CfnFunction.DeadLetterQueueProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Function.DeploymentPreference`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
     */
    public deploymentPreference: CfnFunction.DeploymentPreferenceProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Function.Description`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public description: string | undefined;

    /**
     * `AWS::Serverless::Function.Environment`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public environment: CfnFunction.FunctionEnvironmentProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Function.EventInvokeConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public eventInvokeConfig: CfnFunction.EventInvokeConfigProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Function.Events`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public events: { [key: string]: (CfnFunction.EventSourceProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Function.FileSystemConfigs`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html
     */
    public fileSystemConfigs: Array<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Function.FunctionName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public functionName: string | undefined;

    /**
     * `AWS::Serverless::Function.Handler`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public handler: string | undefined;

    /**
     * `AWS::Serverless::Function.ImageConfig`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-imageconfig
     */
    public imageConfig: CfnFunction.ImageConfigProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Function.ImageUri`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-imageuri
     */
    public imageUri: string | undefined;

    /**
     * `AWS::Serverless::Function.InlineCode`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public inlineCode: string | undefined;

    /**
     * `AWS::Serverless::Function.KmsKeyArn`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public kmsKeyArn: string | undefined;

    /**
     * `AWS::Serverless::Function.Layers`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public layers: string[] | undefined;

    /**
     * `AWS::Serverless::Function.MemorySize`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public memorySize: number | undefined;

    /**
     * `AWS::Serverless::Function.PackageType`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-packagetype
     */
    public packageType: string | undefined;

    /**
     * `AWS::Serverless::Function.PermissionsBoundary`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public permissionsBoundary: string | undefined;

    /**
     * `AWS::Serverless::Function.Policies`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public policies: Array<CfnFunction.IAMPolicyDocumentProperty | CfnFunction.SAMPolicyTemplateProperty | string | cdk.IResolvable> | CfnFunction.IAMPolicyDocumentProperty | string | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Function.ProvisionedConcurrencyConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public provisionedConcurrencyConfig: CfnFunction.ProvisionedConcurrencyConfigProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::Function.ReservedConcurrentExecutions`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public reservedConcurrentExecutions: number | undefined;

    /**
     * `AWS::Serverless::Function.Role`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public role: string | undefined;

    /**
     * `AWS::Serverless::Function.Runtime`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public runtime: string | undefined;

    /**
     * `AWS::Serverless::Function.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public readonly tags: cdk.TagManager;

    /**
     * `AWS::Serverless::Function.Timeout`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public timeout: number | undefined;

    /**
     * `AWS::Serverless::Function.Tracing`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public tracing: string | undefined;

    /**
     * `AWS::Serverless::Function.VersionDescription`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public versionDescription: string | undefined;

    /**
     * `AWS::Serverless::Function.VpcConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    public vpcConfig: CfnFunction.VpcConfigProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Serverless::Function`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFunctionProps = {}) {
        super(scope, id, { type: CfnFunction.CFN_RESOURCE_TYPE_NAME, properties: props });
        // Automatically add the required transform
        this.stack.addTransform(CfnFunction.REQUIRED_TRANSFORM);

        this.architectures = props.architectures;
        this.assumeRolePolicyDocument = props.assumeRolePolicyDocument;
        this.autoPublishAlias = props.autoPublishAlias;
        this.autoPublishCodeSha256 = props.autoPublishCodeSha256;
        this.codeSigningConfigArn = props.codeSigningConfigArn;
        this.codeUri = props.codeUri;
        this.deadLetterQueue = props.deadLetterQueue;
        this.deploymentPreference = props.deploymentPreference;
        this.description = props.description;
        this.environment = props.environment;
        this.eventInvokeConfig = props.eventInvokeConfig;
        this.events = props.events;
        this.fileSystemConfigs = props.fileSystemConfigs;
        this.functionName = props.functionName;
        this.handler = props.handler;
        this.imageConfig = props.imageConfig;
        this.imageUri = props.imageUri;
        this.inlineCode = props.inlineCode;
        this.kmsKeyArn = props.kmsKeyArn;
        this.layers = props.layers;
        this.memorySize = props.memorySize;
        this.packageType = props.packageType;
        this.permissionsBoundary = props.permissionsBoundary;
        this.policies = props.policies;
        this.provisionedConcurrencyConfig = props.provisionedConcurrencyConfig;
        this.reservedConcurrentExecutions = props.reservedConcurrentExecutions;
        this.role = props.role;
        this.runtime = props.runtime;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::Function", props.tags, { tagPropertyName: 'tags' });
        this.timeout = props.timeout;
        this.tracing = props.tracing;
        this.versionDescription = props.versionDescription;
        this.vpcConfig = props.vpcConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFunction.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            architectures: this.architectures,
            assumeRolePolicyDocument: this.assumeRolePolicyDocument,
            autoPublishAlias: this.autoPublishAlias,
            autoPublishCodeSha256: this.autoPublishCodeSha256,
            codeSigningConfigArn: this.codeSigningConfigArn,
            codeUri: this.codeUri,
            deadLetterQueue: this.deadLetterQueue,
            deploymentPreference: this.deploymentPreference,
            description: this.description,
            environment: this.environment,
            eventInvokeConfig: this.eventInvokeConfig,
            events: this.events,
            fileSystemConfigs: this.fileSystemConfigs,
            functionName: this.functionName,
            handler: this.handler,
            imageConfig: this.imageConfig,
            imageUri: this.imageUri,
            inlineCode: this.inlineCode,
            kmsKeyArn: this.kmsKeyArn,
            layers: this.layers,
            memorySize: this.memorySize,
            packageType: this.packageType,
            permissionsBoundary: this.permissionsBoundary,
            policies: this.policies,
            provisionedConcurrencyConfig: this.provisionedConcurrencyConfig,
            reservedConcurrentExecutions: this.reservedConcurrentExecutions,
            role: this.role,
            runtime: this.runtime,
            tags: this.tags.renderTags(),
            timeout: this.timeout,
            tracing: this.tracing,
            versionDescription: this.versionDescription,
            vpcConfig: this.vpcConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFunctionPropsToCloudFormation(props);
    }
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill
     */
    export interface AlexaSkillEventProperty {
        /**
         * `CfnFunction.AlexaSkillEventProperty.Variables`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill
         */
        readonly variables?: { [key: string]: (string) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AlexaSkillEventProperty`
 *
 * @param properties - the TypeScript properties of a `AlexaSkillEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_AlexaSkillEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('variables', cdk.hashValidator(cdk.validateString))(properties.variables));
    return errors.wrap('supplied properties not correct for "AlexaSkillEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.AlexaSkillEvent` resource
 *
 * @param properties - the TypeScript properties of a `AlexaSkillEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.AlexaSkillEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionAlexaSkillEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_AlexaSkillEventPropertyValidator(properties).assertSuccess();
    return {
        Variables: cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables),
    };
}

// @ts-ignore TS6133
function CfnFunctionAlexaSkillEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.AlexaSkillEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.AlexaSkillEventProperty>();
    ret.addPropertyResult('variables', 'Variables', properties.Variables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Variables) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
     */
    export interface ApiEventProperty {
        /**
         * `CfnFunction.ApiEventProperty.Auth`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly auth?: CfnFunction.AuthProperty | cdk.IResolvable;
        /**
         * `CfnFunction.ApiEventProperty.Method`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly method: string;
        /**
         * `CfnFunction.ApiEventProperty.Path`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly path: string;
        /**
         * `CfnFunction.ApiEventProperty.RequestModel`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly requestModel?: CfnFunction.RequestModelProperty | cdk.IResolvable;
        /**
         * `CfnFunction.ApiEventProperty.RequestParameters`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly requestParameters?: Array<CfnFunction.RequestParameterProperty | string | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnFunction.ApiEventProperty.RestApiId`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly restApiId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ApiEventProperty`
 *
 * @param properties - the TypeScript properties of a `ApiEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_ApiEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('auth', CfnFunction_AuthPropertyValidator)(properties.auth));
    errors.collect(cdk.propertyValidator('method', cdk.requiredValidator)(properties.method));
    errors.collect(cdk.propertyValidator('method', cdk.validateString)(properties.method));
    errors.collect(cdk.propertyValidator('path', cdk.requiredValidator)(properties.path));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    errors.collect(cdk.propertyValidator('requestModel', CfnFunction_RequestModelPropertyValidator)(properties.requestModel));
    errors.collect(cdk.propertyValidator('requestParameters', cdk.listValidator(cdk.unionValidator(CfnFunction_RequestParameterPropertyValidator, cdk.validateString)))(properties.requestParameters));
    errors.collect(cdk.propertyValidator('restApiId', cdk.validateString)(properties.restApiId));
    return errors.wrap('supplied properties not correct for "ApiEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.ApiEvent` resource
 *
 * @param properties - the TypeScript properties of a `ApiEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.ApiEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionApiEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_ApiEventPropertyValidator(properties).assertSuccess();
    return {
        Auth: cfnFunctionAuthPropertyToCloudFormation(properties.auth),
        Method: cdk.stringToCloudFormation(properties.method),
        Path: cdk.stringToCloudFormation(properties.path),
        RequestModel: cfnFunctionRequestModelPropertyToCloudFormation(properties.requestModel),
        RequestParameters: cdk.listMapper(cdk.unionMapper([CfnFunction_RequestParameterPropertyValidator, cdk.validateString], [cfnFunctionRequestParameterPropertyToCloudFormation, cdk.stringToCloudFormation]))(properties.requestParameters),
        RestApiId: cdk.stringToCloudFormation(properties.restApiId),
    };
}

// @ts-ignore TS6133
function CfnFunctionApiEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.ApiEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.ApiEventProperty>();
    ret.addPropertyResult('auth', 'Auth', properties.Auth != null ? CfnFunctionAuthPropertyFromCloudFormation(properties.Auth) : undefined);
    ret.addPropertyResult('method', 'Method', cfn_parse.FromCloudFormation.getString(properties.Method));
    ret.addPropertyResult('path', 'Path', cfn_parse.FromCloudFormation.getString(properties.Path));
    ret.addPropertyResult('requestModel', 'RequestModel', properties.RequestModel != null ? CfnFunctionRequestModelPropertyFromCloudFormation(properties.RequestModel) : undefined);
    ret.addPropertyResult('requestParameters', 'RequestParameters', properties.RequestParameters != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getTypeUnion([CfnFunction_RequestParameterPropertyValidator, cdk.validateString], [CfnFunctionRequestParameterPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString]))(properties.RequestParameters) : undefined);
    ret.addPropertyResult('restApiId', 'RestApiId', properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
     */
    export interface AuthProperty {
        /**
         * `CfnFunction.AuthProperty.ApiKeyRequired`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly apiKeyRequired?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.AuthProperty.AuthorizationScopes`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly authorizationScopes?: string[];
        /**
         * `CfnFunction.AuthProperty.Authorizer`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly authorizer?: string;
        /**
         * `CfnFunction.AuthProperty.ResourcePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly resourcePolicy?: CfnFunction.AuthResourcePolicyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AuthProperty`
 *
 * @param properties - the TypeScript properties of a `AuthProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_AuthPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apiKeyRequired', cdk.validateBoolean)(properties.apiKeyRequired));
    errors.collect(cdk.propertyValidator('authorizationScopes', cdk.listValidator(cdk.validateString))(properties.authorizationScopes));
    errors.collect(cdk.propertyValidator('authorizer', cdk.validateString)(properties.authorizer));
    errors.collect(cdk.propertyValidator('resourcePolicy', CfnFunction_AuthResourcePolicyPropertyValidator)(properties.resourcePolicy));
    return errors.wrap('supplied properties not correct for "AuthProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.Auth` resource
 *
 * @param properties - the TypeScript properties of a `AuthProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.Auth` resource.
 */
// @ts-ignore TS6133
function cfnFunctionAuthPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_AuthPropertyValidator(properties).assertSuccess();
    return {
        ApiKeyRequired: cdk.booleanToCloudFormation(properties.apiKeyRequired),
        AuthorizationScopes: cdk.listMapper(cdk.stringToCloudFormation)(properties.authorizationScopes),
        Authorizer: cdk.stringToCloudFormation(properties.authorizer),
        ResourcePolicy: cfnFunctionAuthResourcePolicyPropertyToCloudFormation(properties.resourcePolicy),
    };
}

// @ts-ignore TS6133
function CfnFunctionAuthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.AuthProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.AuthProperty>();
    ret.addPropertyResult('apiKeyRequired', 'ApiKeyRequired', properties.ApiKeyRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApiKeyRequired) : undefined);
    ret.addPropertyResult('authorizationScopes', 'AuthorizationScopes', properties.AuthorizationScopes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AuthorizationScopes) : undefined);
    ret.addPropertyResult('authorizer', 'Authorizer', properties.Authorizer != null ? cfn_parse.FromCloudFormation.getString(properties.Authorizer) : undefined);
    ret.addPropertyResult('resourcePolicy', 'ResourcePolicy', properties.ResourcePolicy != null ? CfnFunctionAuthResourcePolicyPropertyFromCloudFormation(properties.ResourcePolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
     */
    export interface AuthResourcePolicyProperty {
        /**
         * `CfnFunction.AuthResourcePolicyProperty.AwsAccountBlacklist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly awsAccountBlacklist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.AwsAccountWhitelist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly awsAccountWhitelist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.CustomStatements`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly customStatements?: Array<any | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IntrinsicVpcBlacklist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly intrinsicVpcBlacklist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IntrinsicVpcWhitelist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly intrinsicVpcWhitelist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IntrinsicVpceBlacklist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly intrinsicVpceBlacklist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IntrinsicVpceWhitelist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly intrinsicVpceWhitelist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IpRangeBlacklist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly ipRangeBlacklist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IpRangeWhitelist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly ipRangeWhitelist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.SourceVpcBlacklist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly sourceVpcBlacklist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.SourceVpcWhitelist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly sourceVpcWhitelist?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AuthResourcePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AuthResourcePolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_AuthResourcePolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsAccountBlacklist', cdk.listValidator(cdk.validateString))(properties.awsAccountBlacklist));
    errors.collect(cdk.propertyValidator('awsAccountWhitelist', cdk.listValidator(cdk.validateString))(properties.awsAccountWhitelist));
    errors.collect(cdk.propertyValidator('customStatements', cdk.listValidator(cdk.validateObject))(properties.customStatements));
    errors.collect(cdk.propertyValidator('intrinsicVpcBlacklist', cdk.listValidator(cdk.validateString))(properties.intrinsicVpcBlacklist));
    errors.collect(cdk.propertyValidator('intrinsicVpcWhitelist', cdk.listValidator(cdk.validateString))(properties.intrinsicVpcWhitelist));
    errors.collect(cdk.propertyValidator('intrinsicVpceBlacklist', cdk.listValidator(cdk.validateString))(properties.intrinsicVpceBlacklist));
    errors.collect(cdk.propertyValidator('intrinsicVpceWhitelist', cdk.listValidator(cdk.validateString))(properties.intrinsicVpceWhitelist));
    errors.collect(cdk.propertyValidator('ipRangeBlacklist', cdk.listValidator(cdk.validateString))(properties.ipRangeBlacklist));
    errors.collect(cdk.propertyValidator('ipRangeWhitelist', cdk.listValidator(cdk.validateString))(properties.ipRangeWhitelist));
    errors.collect(cdk.propertyValidator('sourceVpcBlacklist', cdk.listValidator(cdk.validateString))(properties.sourceVpcBlacklist));
    errors.collect(cdk.propertyValidator('sourceVpcWhitelist', cdk.listValidator(cdk.validateString))(properties.sourceVpcWhitelist));
    return errors.wrap('supplied properties not correct for "AuthResourcePolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.AuthResourcePolicy` resource
 *
 * @param properties - the TypeScript properties of a `AuthResourcePolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.AuthResourcePolicy` resource.
 */
// @ts-ignore TS6133
function cfnFunctionAuthResourcePolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_AuthResourcePolicyPropertyValidator(properties).assertSuccess();
    return {
        AwsAccountBlacklist: cdk.listMapper(cdk.stringToCloudFormation)(properties.awsAccountBlacklist),
        AwsAccountWhitelist: cdk.listMapper(cdk.stringToCloudFormation)(properties.awsAccountWhitelist),
        CustomStatements: cdk.listMapper(cdk.objectToCloudFormation)(properties.customStatements),
        IntrinsicVpcBlacklist: cdk.listMapper(cdk.stringToCloudFormation)(properties.intrinsicVpcBlacklist),
        IntrinsicVpcWhitelist: cdk.listMapper(cdk.stringToCloudFormation)(properties.intrinsicVpcWhitelist),
        IntrinsicVpceBlacklist: cdk.listMapper(cdk.stringToCloudFormation)(properties.intrinsicVpceBlacklist),
        IntrinsicVpceWhitelist: cdk.listMapper(cdk.stringToCloudFormation)(properties.intrinsicVpceWhitelist),
        IpRangeBlacklist: cdk.listMapper(cdk.stringToCloudFormation)(properties.ipRangeBlacklist),
        IpRangeWhitelist: cdk.listMapper(cdk.stringToCloudFormation)(properties.ipRangeWhitelist),
        SourceVpcBlacklist: cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceVpcBlacklist),
        SourceVpcWhitelist: cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceVpcWhitelist),
    };
}

// @ts-ignore TS6133
function CfnFunctionAuthResourcePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.AuthResourcePolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.AuthResourcePolicyProperty>();
    ret.addPropertyResult('awsAccountBlacklist', 'AwsAccountBlacklist', properties.AwsAccountBlacklist != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AwsAccountBlacklist) : undefined);
    ret.addPropertyResult('awsAccountWhitelist', 'AwsAccountWhitelist', properties.AwsAccountWhitelist != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AwsAccountWhitelist) : undefined);
    ret.addPropertyResult('customStatements', 'CustomStatements', properties.CustomStatements != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.CustomStatements) : undefined);
    ret.addPropertyResult('intrinsicVpcBlacklist', 'IntrinsicVpcBlacklist', properties.IntrinsicVpcBlacklist != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IntrinsicVpcBlacklist) : undefined);
    ret.addPropertyResult('intrinsicVpcWhitelist', 'IntrinsicVpcWhitelist', properties.IntrinsicVpcWhitelist != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IntrinsicVpcWhitelist) : undefined);
    ret.addPropertyResult('intrinsicVpceBlacklist', 'IntrinsicVpceBlacklist', properties.IntrinsicVpceBlacklist != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IntrinsicVpceBlacklist) : undefined);
    ret.addPropertyResult('intrinsicVpceWhitelist', 'IntrinsicVpceWhitelist', properties.IntrinsicVpceWhitelist != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IntrinsicVpceWhitelist) : undefined);
    ret.addPropertyResult('ipRangeBlacklist', 'IpRangeBlacklist', properties.IpRangeBlacklist != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IpRangeBlacklist) : undefined);
    ret.addPropertyResult('ipRangeWhitelist', 'IpRangeWhitelist', properties.IpRangeWhitelist != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IpRangeWhitelist) : undefined);
    ret.addPropertyResult('sourceVpcBlacklist', 'SourceVpcBlacklist', properties.SourceVpcBlacklist != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SourceVpcBlacklist) : undefined);
    ret.addPropertyResult('sourceVpcWhitelist', 'SourceVpcWhitelist', properties.SourceVpcWhitelist != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SourceVpcWhitelist) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface BucketSAMPTProperty {
        /**
         * `CfnFunction.BucketSAMPTProperty.BucketName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly bucketName: string;
    }
}

/**
 * Determine whether the given properties match those of a `BucketSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `BucketSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_BucketSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketName', cdk.requiredValidator)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    return errors.wrap('supplied properties not correct for "BucketSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.BucketSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `BucketSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.BucketSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionBucketSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_BucketSAMPTPropertyValidator(properties).assertSuccess();
    return {
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
    };
}

// @ts-ignore TS6133
function CfnFunctionBucketSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.BucketSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.BucketSAMPTProperty>();
    ret.addPropertyResult('bucketName', 'BucketName', cfn_parse.FromCloudFormation.getString(properties.BucketName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
     */
    export interface CloudWatchEventEventProperty {
        /**
         * `CfnFunction.CloudWatchEventEventProperty.Input`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
         */
        readonly input?: string;
        /**
         * `CfnFunction.CloudWatchEventEventProperty.InputPath`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
         */
        readonly inputPath?: string;
        /**
         * `CfnFunction.CloudWatchEventEventProperty.Pattern`
         *
         * @link http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEventsandEventPatterns.html
         */
        readonly pattern: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchEventEventProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchEventEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_CloudWatchEventEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('input', cdk.validateString)(properties.input));
    errors.collect(cdk.propertyValidator('inputPath', cdk.validateString)(properties.inputPath));
    errors.collect(cdk.propertyValidator('pattern', cdk.requiredValidator)(properties.pattern));
    errors.collect(cdk.propertyValidator('pattern', cdk.validateObject)(properties.pattern));
    return errors.wrap('supplied properties not correct for "CloudWatchEventEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.CloudWatchEventEvent` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchEventEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.CloudWatchEventEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionCloudWatchEventEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_CloudWatchEventEventPropertyValidator(properties).assertSuccess();
    return {
        Input: cdk.stringToCloudFormation(properties.input),
        InputPath: cdk.stringToCloudFormation(properties.inputPath),
        Pattern: cdk.objectToCloudFormation(properties.pattern),
    };
}

// @ts-ignore TS6133
function CfnFunctionCloudWatchEventEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.CloudWatchEventEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.CloudWatchEventEventProperty>();
    ret.addPropertyResult('input', 'Input', properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined);
    ret.addPropertyResult('inputPath', 'InputPath', properties.InputPath != null ? cfn_parse.FromCloudFormation.getString(properties.InputPath) : undefined);
    ret.addPropertyResult('pattern', 'Pattern', cfn_parse.FromCloudFormation.getAny(properties.Pattern));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
     */
    export interface CloudWatchLogsEventProperty {
        /**
         * `CfnFunction.CloudWatchLogsEventProperty.FilterPattern`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchlogs
         */
        readonly filterPattern: string;
        /**
         * `CfnFunction.CloudWatchLogsEventProperty.LogGroupName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchlogs
         */
        readonly logGroupName: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsEventProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_CloudWatchLogsEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filterPattern', cdk.requiredValidator)(properties.filterPattern));
    errors.collect(cdk.propertyValidator('filterPattern', cdk.validateString)(properties.filterPattern));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.requiredValidator)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    return errors.wrap('supplied properties not correct for "CloudWatchLogsEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.CloudWatchLogsEvent` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.CloudWatchLogsEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionCloudWatchLogsEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_CloudWatchLogsEventPropertyValidator(properties).assertSuccess();
    return {
        FilterPattern: cdk.stringToCloudFormation(properties.filterPattern),
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
    };
}

// @ts-ignore TS6133
function CfnFunctionCloudWatchLogsEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.CloudWatchLogsEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.CloudWatchLogsEventProperty>();
    ret.addPropertyResult('filterPattern', 'FilterPattern', cfn_parse.FromCloudFormation.getString(properties.FilterPattern));
    ret.addPropertyResult('logGroupName', 'LogGroupName', cfn_parse.FromCloudFormation.getString(properties.LogGroupName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface CollectionSAMPTProperty {
        /**
         * `CfnFunction.CollectionSAMPTProperty.CollectionId`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly collectionId: string;
    }
}

/**
 * Determine whether the given properties match those of a `CollectionSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `CollectionSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_CollectionSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('collectionId', cdk.requiredValidator)(properties.collectionId));
    errors.collect(cdk.propertyValidator('collectionId', cdk.validateString)(properties.collectionId));
    return errors.wrap('supplied properties not correct for "CollectionSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.CollectionSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `CollectionSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.CollectionSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionCollectionSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_CollectionSAMPTPropertyValidator(properties).assertSuccess();
    return {
        CollectionId: cdk.stringToCloudFormation(properties.collectionId),
    };
}

// @ts-ignore TS6133
function CfnFunctionCollectionSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.CollectionSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.CollectionSAMPTProperty>();
    ret.addPropertyResult('collectionId', 'CollectionId', cfn_parse.FromCloudFormation.getString(properties.CollectionId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deadletterqueue-object
     */
    export interface DeadLetterQueueProperty {
        /**
         * `CfnFunction.DeadLetterQueueProperty.TargetArn`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly targetArn: string;
        /**
         * `CfnFunction.DeadLetterQueueProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeadLetterQueueProperty`
 *
 * @param properties - the TypeScript properties of a `DeadLetterQueueProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_DeadLetterQueuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('targetArn', cdk.requiredValidator)(properties.targetArn));
    errors.collect(cdk.propertyValidator('targetArn', cdk.validateString)(properties.targetArn));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "DeadLetterQueueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.DeadLetterQueue` resource
 *
 * @param properties - the TypeScript properties of a `DeadLetterQueueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.DeadLetterQueue` resource.
 */
// @ts-ignore TS6133
function cfnFunctionDeadLetterQueuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_DeadLetterQueuePropertyValidator(properties).assertSuccess();
    return {
        TargetArn: cdk.stringToCloudFormation(properties.targetArn),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnFunctionDeadLetterQueuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DeadLetterQueueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DeadLetterQueueProperty>();
    ret.addPropertyResult('targetArn', 'TargetArn', cfn_parse.FromCloudFormation.getString(properties.TargetArn));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/safe_lambda_deployments.rst
     */
    export interface DeploymentPreferenceProperty {
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Alarms`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly alarms?: string[];
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Enabled`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Hooks`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly hooks?: CfnFunction.HooksProperty | cdk.IResolvable;
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeploymentPreferenceProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentPreferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_DeploymentPreferencePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alarms', cdk.listValidator(cdk.validateString))(properties.alarms));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('hooks', CfnFunction_HooksPropertyValidator)(properties.hooks));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "DeploymentPreferenceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.DeploymentPreference` resource
 *
 * @param properties - the TypeScript properties of a `DeploymentPreferenceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.DeploymentPreference` resource.
 */
// @ts-ignore TS6133
function cfnFunctionDeploymentPreferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_DeploymentPreferencePropertyValidator(properties).assertSuccess();
    return {
        Alarms: cdk.listMapper(cdk.stringToCloudFormation)(properties.alarms),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        Hooks: cfnFunctionHooksPropertyToCloudFormation(properties.hooks),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnFunctionDeploymentPreferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DeploymentPreferenceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DeploymentPreferenceProperty>();
    ret.addPropertyResult('alarms', 'Alarms', properties.Alarms != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Alarms) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('hooks', 'Hooks', properties.Hooks != null ? CfnFunctionHooksPropertyFromCloudFormation(properties.Hooks) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#destination-config-object
     */
    export interface DestinationProperty {
        /**
         * `CfnFunction.DestinationProperty.Destination`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#destination-config-object
         */
        readonly destination: string;
        /**
         * `CfnFunction.DestinationProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#destination-config-object
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DestinationProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_DestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', cdk.validateString)(properties.destination));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "DestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.Destination` resource
 *
 * @param properties - the TypeScript properties of a `DestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.Destination` resource.
 */
// @ts-ignore TS6133
function cfnFunctionDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_DestinationPropertyValidator(properties).assertSuccess();
    return {
        Destination: cdk.stringToCloudFormation(properties.destination),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnFunctionDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DestinationProperty>();
    ret.addPropertyResult('destination', 'Destination', cfn_parse.FromCloudFormation.getString(properties.Destination));
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#destination-config-object
     */
    export interface DestinationConfigProperty {
        /**
         * `CfnFunction.DestinationConfigProperty.OnFailure`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#destination-config-object
         */
        readonly onFailure: CfnFunction.DestinationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DestinationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_DestinationConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('onFailure', cdk.requiredValidator)(properties.onFailure));
    errors.collect(cdk.propertyValidator('onFailure', CfnFunction_DestinationPropertyValidator)(properties.onFailure));
    return errors.wrap('supplied properties not correct for "DestinationConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.DestinationConfig` resource
 *
 * @param properties - the TypeScript properties of a `DestinationConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.DestinationConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionDestinationConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_DestinationConfigPropertyValidator(properties).assertSuccess();
    return {
        OnFailure: cfnFunctionDestinationPropertyToCloudFormation(properties.onFailure),
    };
}

// @ts-ignore TS6133
function CfnFunctionDestinationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DestinationConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DestinationConfigProperty>();
    ret.addPropertyResult('onFailure', 'OnFailure', CfnFunctionDestinationPropertyFromCloudFormation(properties.OnFailure));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface DomainSAMPTProperty {
        /**
         * `CfnFunction.DomainSAMPTProperty.DomainName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly domainName: string;
    }
}

/**
 * Determine whether the given properties match those of a `DomainSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `DomainSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_DomainSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    return errors.wrap('supplied properties not correct for "DomainSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.DomainSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `DomainSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.DomainSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionDomainSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_DomainSAMPTPropertyValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
    };
}

// @ts-ignore TS6133
function CfnFunctionDomainSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DomainSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DomainSAMPTProperty>();
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
     */
    export interface DynamoDBEventProperty {
        /**
         * `CfnFunction.DynamoDBEventProperty.BatchSize`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly batchSize?: number;
        /**
         * `CfnFunction.DynamoDBEventProperty.BisectBatchOnFunctionError`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly bisectBatchOnFunctionError?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.DynamoDBEventProperty.DestinationConfig`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly destinationConfig?: CfnFunction.DestinationConfigProperty | cdk.IResolvable;
        /**
         * `CfnFunction.DynamoDBEventProperty.Enabled`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.DynamoDBEventProperty.MaximumBatchingWindowInSeconds`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly maximumBatchingWindowInSeconds?: number;
        /**
         * `CfnFunction.DynamoDBEventProperty.MaximumRecordAgeInSeconds`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly maximumRecordAgeInSeconds?: number;
        /**
         * `CfnFunction.DynamoDBEventProperty.MaximumRetryAttempts`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly maximumRetryAttempts?: number;
        /**
         * `CfnFunction.DynamoDBEventProperty.ParallelizationFactor`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly parallelizationFactor?: number;
        /**
         * `CfnFunction.DynamoDBEventProperty.StartingPosition`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly startingPosition: string;
        /**
         * `CfnFunction.DynamoDBEventProperty.Stream`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly stream: string;
    }
}

/**
 * Determine whether the given properties match those of a `DynamoDBEventProperty`
 *
 * @param properties - the TypeScript properties of a `DynamoDBEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_DynamoDBEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('bisectBatchOnFunctionError', cdk.validateBoolean)(properties.bisectBatchOnFunctionError));
    errors.collect(cdk.propertyValidator('destinationConfig', CfnFunction_DestinationConfigPropertyValidator)(properties.destinationConfig));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('maximumBatchingWindowInSeconds', cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
    errors.collect(cdk.propertyValidator('maximumRecordAgeInSeconds', cdk.validateNumber)(properties.maximumRecordAgeInSeconds));
    errors.collect(cdk.propertyValidator('maximumRetryAttempts', cdk.validateNumber)(properties.maximumRetryAttempts));
    errors.collect(cdk.propertyValidator('parallelizationFactor', cdk.validateNumber)(properties.parallelizationFactor));
    errors.collect(cdk.propertyValidator('startingPosition', cdk.requiredValidator)(properties.startingPosition));
    errors.collect(cdk.propertyValidator('startingPosition', cdk.validateString)(properties.startingPosition));
    errors.collect(cdk.propertyValidator('stream', cdk.requiredValidator)(properties.stream));
    errors.collect(cdk.propertyValidator('stream', cdk.validateString)(properties.stream));
    return errors.wrap('supplied properties not correct for "DynamoDBEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.DynamoDBEvent` resource
 *
 * @param properties - the TypeScript properties of a `DynamoDBEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.DynamoDBEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionDynamoDBEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_DynamoDBEventPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        BisectBatchOnFunctionError: cdk.booleanToCloudFormation(properties.bisectBatchOnFunctionError),
        DestinationConfig: cfnFunctionDestinationConfigPropertyToCloudFormation(properties.destinationConfig),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        MaximumBatchingWindowInSeconds: cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
        MaximumRecordAgeInSeconds: cdk.numberToCloudFormation(properties.maximumRecordAgeInSeconds),
        MaximumRetryAttempts: cdk.numberToCloudFormation(properties.maximumRetryAttempts),
        ParallelizationFactor: cdk.numberToCloudFormation(properties.parallelizationFactor),
        StartingPosition: cdk.stringToCloudFormation(properties.startingPosition),
        Stream: cdk.stringToCloudFormation(properties.stream),
    };
}

// @ts-ignore TS6133
function CfnFunctionDynamoDBEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DynamoDBEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DynamoDBEventProperty>();
    ret.addPropertyResult('batchSize', 'BatchSize', properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined);
    ret.addPropertyResult('bisectBatchOnFunctionError', 'BisectBatchOnFunctionError', properties.BisectBatchOnFunctionError != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BisectBatchOnFunctionError) : undefined);
    ret.addPropertyResult('destinationConfig', 'DestinationConfig', properties.DestinationConfig != null ? CfnFunctionDestinationConfigPropertyFromCloudFormation(properties.DestinationConfig) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('maximumBatchingWindowInSeconds', 'MaximumBatchingWindowInSeconds', properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined);
    ret.addPropertyResult('maximumRecordAgeInSeconds', 'MaximumRecordAgeInSeconds', properties.MaximumRecordAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRecordAgeInSeconds) : undefined);
    ret.addPropertyResult('maximumRetryAttempts', 'MaximumRetryAttempts', properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined);
    ret.addPropertyResult('parallelizationFactor', 'ParallelizationFactor', properties.ParallelizationFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParallelizationFactor) : undefined);
    ret.addPropertyResult('startingPosition', 'StartingPosition', cfn_parse.FromCloudFormation.getString(properties.StartingPosition));
    ret.addPropertyResult('stream', 'Stream', cfn_parse.FromCloudFormation.getString(properties.Stream));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface EmptySAMPTProperty {
    }
}

/**
 * Determine whether the given properties match those of a `EmptySAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `EmptySAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_EmptySAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "EmptySAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.EmptySAMPT` resource
 *
 * @param properties - the TypeScript properties of a `EmptySAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.EmptySAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionEmptySAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_EmptySAMPTPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EmptySAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EmptySAMPTProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#eventbridgerule
     */
    export interface EventBridgeRuleEventProperty {
        /**
         * `CfnFunction.EventBridgeRuleEventProperty.EventBusName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#eventbridgerule
         */
        readonly eventBusName?: string;
        /**
         * `CfnFunction.EventBridgeRuleEventProperty.Input`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#eventbridgerule
         */
        readonly input?: string;
        /**
         * `CfnFunction.EventBridgeRuleEventProperty.InputPath`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#eventbridgerule
         */
        readonly inputPath?: string;
        /**
         * `CfnFunction.EventBridgeRuleEventProperty.Pattern`
         *
         * @link https://docs.aws.amazon.com/eventbridge/latest/userguide/filtering-examples-structure.html
         */
        readonly pattern: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EventBridgeRuleEventProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeRuleEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_EventBridgeRuleEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventBusName', cdk.validateString)(properties.eventBusName));
    errors.collect(cdk.propertyValidator('input', cdk.validateString)(properties.input));
    errors.collect(cdk.propertyValidator('inputPath', cdk.validateString)(properties.inputPath));
    errors.collect(cdk.propertyValidator('pattern', cdk.requiredValidator)(properties.pattern));
    errors.collect(cdk.propertyValidator('pattern', cdk.validateObject)(properties.pattern));
    return errors.wrap('supplied properties not correct for "EventBridgeRuleEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.EventBridgeRuleEvent` resource
 *
 * @param properties - the TypeScript properties of a `EventBridgeRuleEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.EventBridgeRuleEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionEventBridgeRuleEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_EventBridgeRuleEventPropertyValidator(properties).assertSuccess();
    return {
        EventBusName: cdk.stringToCloudFormation(properties.eventBusName),
        Input: cdk.stringToCloudFormation(properties.input),
        InputPath: cdk.stringToCloudFormation(properties.inputPath),
        Pattern: cdk.objectToCloudFormation(properties.pattern),
    };
}

// @ts-ignore TS6133
function CfnFunctionEventBridgeRuleEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EventBridgeRuleEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EventBridgeRuleEventProperty>();
    ret.addPropertyResult('eventBusName', 'EventBusName', properties.EventBusName != null ? cfn_parse.FromCloudFormation.getString(properties.EventBusName) : undefined);
    ret.addPropertyResult('input', 'Input', properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined);
    ret.addPropertyResult('inputPath', 'InputPath', properties.InputPath != null ? cfn_parse.FromCloudFormation.getString(properties.InputPath) : undefined);
    ret.addPropertyResult('pattern', 'Pattern', cfn_parse.FromCloudFormation.getAny(properties.Pattern));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-config-object
     */
    export interface EventInvokeConfigProperty {
        /**
         * `CfnFunction.EventInvokeConfigProperty.DestinationConfig`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-config-object
         */
        readonly destinationConfig?: CfnFunction.EventInvokeDestinationConfigProperty | cdk.IResolvable;
        /**
         * `CfnFunction.EventInvokeConfigProperty.MaximumEventAgeInSeconds`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-config-object
         */
        readonly maximumEventAgeInSeconds?: number;
        /**
         * `CfnFunction.EventInvokeConfigProperty.MaximumRetryAttempts`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-config-object
         */
        readonly maximumRetryAttempts?: number;
    }
}

/**
 * Determine whether the given properties match those of a `EventInvokeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EventInvokeConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_EventInvokeConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationConfig', CfnFunction_EventInvokeDestinationConfigPropertyValidator)(properties.destinationConfig));
    errors.collect(cdk.propertyValidator('maximumEventAgeInSeconds', cdk.validateNumber)(properties.maximumEventAgeInSeconds));
    errors.collect(cdk.propertyValidator('maximumRetryAttempts', cdk.validateNumber)(properties.maximumRetryAttempts));
    return errors.wrap('supplied properties not correct for "EventInvokeConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.EventInvokeConfig` resource
 *
 * @param properties - the TypeScript properties of a `EventInvokeConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.EventInvokeConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionEventInvokeConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_EventInvokeConfigPropertyValidator(properties).assertSuccess();
    return {
        DestinationConfig: cfnFunctionEventInvokeDestinationConfigPropertyToCloudFormation(properties.destinationConfig),
        MaximumEventAgeInSeconds: cdk.numberToCloudFormation(properties.maximumEventAgeInSeconds),
        MaximumRetryAttempts: cdk.numberToCloudFormation(properties.maximumRetryAttempts),
    };
}

// @ts-ignore TS6133
function CfnFunctionEventInvokeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EventInvokeConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EventInvokeConfigProperty>();
    ret.addPropertyResult('destinationConfig', 'DestinationConfig', properties.DestinationConfig != null ? CfnFunctionEventInvokeDestinationConfigPropertyFromCloudFormation(properties.DestinationConfig) : undefined);
    ret.addPropertyResult('maximumEventAgeInSeconds', 'MaximumEventAgeInSeconds', properties.MaximumEventAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumEventAgeInSeconds) : undefined);
    ret.addPropertyResult('maximumRetryAttempts', 'MaximumRetryAttempts', properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-destination-config-object
     */
    export interface EventInvokeDestinationConfigProperty {
        /**
         * `CfnFunction.EventInvokeDestinationConfigProperty.OnFailure`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-destination-config-object
         */
        readonly onFailure: CfnFunction.DestinationProperty | cdk.IResolvable;
        /**
         * `CfnFunction.EventInvokeDestinationConfigProperty.OnSuccess`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-destination-config-object
         */
        readonly onSuccess: CfnFunction.DestinationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EventInvokeDestinationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EventInvokeDestinationConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_EventInvokeDestinationConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('onFailure', cdk.requiredValidator)(properties.onFailure));
    errors.collect(cdk.propertyValidator('onFailure', CfnFunction_DestinationPropertyValidator)(properties.onFailure));
    errors.collect(cdk.propertyValidator('onSuccess', cdk.requiredValidator)(properties.onSuccess));
    errors.collect(cdk.propertyValidator('onSuccess', CfnFunction_DestinationPropertyValidator)(properties.onSuccess));
    return errors.wrap('supplied properties not correct for "EventInvokeDestinationConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.EventInvokeDestinationConfig` resource
 *
 * @param properties - the TypeScript properties of a `EventInvokeDestinationConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.EventInvokeDestinationConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionEventInvokeDestinationConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_EventInvokeDestinationConfigPropertyValidator(properties).assertSuccess();
    return {
        OnFailure: cfnFunctionDestinationPropertyToCloudFormation(properties.onFailure),
        OnSuccess: cfnFunctionDestinationPropertyToCloudFormation(properties.onSuccess),
    };
}

// @ts-ignore TS6133
function CfnFunctionEventInvokeDestinationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EventInvokeDestinationConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EventInvokeDestinationConfigProperty>();
    ret.addPropertyResult('onFailure', 'OnFailure', CfnFunctionDestinationPropertyFromCloudFormation(properties.OnFailure));
    ret.addPropertyResult('onSuccess', 'OnSuccess', CfnFunctionDestinationPropertyFromCloudFormation(properties.OnSuccess));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object
     */
    export interface EventSourceProperty {
        /**
         * `CfnFunction.EventSourceProperty.Properties`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-types
         */
        readonly properties: CfnFunction.S3EventProperty | CfnFunction.SNSEventProperty | CfnFunction.SQSEventProperty | CfnFunction.KinesisEventProperty | CfnFunction.DynamoDBEventProperty | CfnFunction.ApiEventProperty | CfnFunction.ScheduleEventProperty | CfnFunction.CloudWatchEventEventProperty | CfnFunction.CloudWatchLogsEventProperty | CfnFunction.IoTRuleEventProperty | CfnFunction.AlexaSkillEventProperty | CfnFunction.EventBridgeRuleEventProperty | CfnFunction.HttpApiEventProperty | cdk.IResolvable;
        /**
         * `CfnFunction.EventSourceProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `EventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `EventSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_EventSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('properties', cdk.requiredValidator)(properties.properties));
    errors.collect(cdk.propertyValidator('properties', cdk.unionValidator(CfnFunction_S3EventPropertyValidator, CfnFunction_SNSEventPropertyValidator, CfnFunction_SQSEventPropertyValidator, CfnFunction_KinesisEventPropertyValidator, CfnFunction_DynamoDBEventPropertyValidator, CfnFunction_ApiEventPropertyValidator, CfnFunction_ScheduleEventPropertyValidator, CfnFunction_CloudWatchEventEventPropertyValidator, CfnFunction_CloudWatchLogsEventPropertyValidator, CfnFunction_IoTRuleEventPropertyValidator, CfnFunction_AlexaSkillEventPropertyValidator, CfnFunction_EventBridgeRuleEventPropertyValidator, CfnFunction_HttpApiEventPropertyValidator))(properties.properties));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "EventSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.EventSource` resource
 *
 * @param properties - the TypeScript properties of a `EventSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.EventSource` resource.
 */
// @ts-ignore TS6133
function cfnFunctionEventSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_EventSourcePropertyValidator(properties).assertSuccess();
    return {
        Properties: cdk.unionMapper([CfnFunction_S3EventPropertyValidator, CfnFunction_SNSEventPropertyValidator, CfnFunction_SQSEventPropertyValidator, CfnFunction_KinesisEventPropertyValidator, CfnFunction_DynamoDBEventPropertyValidator, CfnFunction_ApiEventPropertyValidator, CfnFunction_ScheduleEventPropertyValidator, CfnFunction_CloudWatchEventEventPropertyValidator, CfnFunction_CloudWatchLogsEventPropertyValidator, CfnFunction_IoTRuleEventPropertyValidator, CfnFunction_AlexaSkillEventPropertyValidator, CfnFunction_EventBridgeRuleEventPropertyValidator, CfnFunction_HttpApiEventPropertyValidator], [cfnFunctionS3EventPropertyToCloudFormation, cfnFunctionSNSEventPropertyToCloudFormation, cfnFunctionSQSEventPropertyToCloudFormation, cfnFunctionKinesisEventPropertyToCloudFormation, cfnFunctionDynamoDBEventPropertyToCloudFormation, cfnFunctionApiEventPropertyToCloudFormation, cfnFunctionScheduleEventPropertyToCloudFormation, cfnFunctionCloudWatchEventEventPropertyToCloudFormation, cfnFunctionCloudWatchLogsEventPropertyToCloudFormation, cfnFunctionIoTRuleEventPropertyToCloudFormation, cfnFunctionAlexaSkillEventPropertyToCloudFormation, cfnFunctionEventBridgeRuleEventPropertyToCloudFormation, cfnFunctionHttpApiEventPropertyToCloudFormation])(properties.properties),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnFunctionEventSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EventSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EventSourceProperty>();
    ret.addPropertyResult('properties', 'Properties', cfn_parse.FromCloudFormation.getTypeUnion([CfnFunction_S3EventPropertyValidator, CfnFunction_SNSEventPropertyValidator, CfnFunction_SQSEventPropertyValidator, CfnFunction_KinesisEventPropertyValidator, CfnFunction_DynamoDBEventPropertyValidator, CfnFunction_ApiEventPropertyValidator, CfnFunction_ScheduleEventPropertyValidator, CfnFunction_CloudWatchEventEventPropertyValidator, CfnFunction_CloudWatchLogsEventPropertyValidator, CfnFunction_IoTRuleEventPropertyValidator, CfnFunction_AlexaSkillEventPropertyValidator, CfnFunction_EventBridgeRuleEventPropertyValidator, CfnFunction_HttpApiEventPropertyValidator], [CfnFunctionS3EventPropertyFromCloudFormation, CfnFunctionSNSEventPropertyFromCloudFormation, CfnFunctionSQSEventPropertyFromCloudFormation, CfnFunctionKinesisEventPropertyFromCloudFormation, CfnFunctionDynamoDBEventPropertyFromCloudFormation, CfnFunctionApiEventPropertyFromCloudFormation, CfnFunctionScheduleEventPropertyFromCloudFormation, CfnFunctionCloudWatchEventEventPropertyFromCloudFormation, CfnFunctionCloudWatchLogsEventPropertyFromCloudFormation, CfnFunctionIoTRuleEventPropertyFromCloudFormation, CfnFunctionAlexaSkillEventPropertyFromCloudFormation, CfnFunctionEventBridgeRuleEventPropertyFromCloudFormation, CfnFunctionHttpApiEventPropertyFromCloudFormation])(properties.Properties));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html#cfn-lambda-function-filesystemconfig-localmountpath
     */
    export interface FileSystemConfigProperty {
        /**
         * `CfnFunction.FileSystemConfigProperty.Arn`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html#cfn-lambda-function-filesystemconfig-localmountpath
         */
        readonly arn?: string;
        /**
         * `CfnFunction.FileSystemConfigProperty.LocalMountPath`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html#cfn-lambda-function-filesystemconfig-localmountpath
         */
        readonly localMountPath?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FileSystemConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FileSystemConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_FileSystemConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('localMountPath', cdk.validateString)(properties.localMountPath));
    return errors.wrap('supplied properties not correct for "FileSystemConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.FileSystemConfig` resource
 *
 * @param properties - the TypeScript properties of a `FileSystemConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.FileSystemConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionFileSystemConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_FileSystemConfigPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        LocalMountPath: cdk.stringToCloudFormation(properties.localMountPath),
    };
}

// @ts-ignore TS6133
function CfnFunctionFileSystemConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FileSystemConfigProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('localMountPath', 'LocalMountPath', properties.LocalMountPath != null ? cfn_parse.FromCloudFormation.getString(properties.LocalMountPath) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#environment-object
     */
    export interface FunctionEnvironmentProperty {
        /**
         * `CfnFunction.FunctionEnvironmentProperty.Variables`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#environment-object
         */
        readonly variables: { [key: string]: (string) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FunctionEnvironmentProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionEnvironmentProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_FunctionEnvironmentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('variables', cdk.requiredValidator)(properties.variables));
    errors.collect(cdk.propertyValidator('variables', cdk.hashValidator(cdk.validateString))(properties.variables));
    return errors.wrap('supplied properties not correct for "FunctionEnvironmentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.FunctionEnvironment` resource
 *
 * @param properties - the TypeScript properties of a `FunctionEnvironmentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.FunctionEnvironment` resource.
 */
// @ts-ignore TS6133
function cfnFunctionFunctionEnvironmentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_FunctionEnvironmentPropertyValidator(properties).assertSuccess();
    return {
        Variables: cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables),
    };
}

// @ts-ignore TS6133
function CfnFunctionFunctionEnvironmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FunctionEnvironmentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FunctionEnvironmentProperty>();
    ret.addPropertyResult('variables', 'Variables', cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Variables));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface FunctionSAMPTProperty {
        /**
         * `CfnFunction.FunctionSAMPTProperty.FunctionName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly functionName: string;
    }
}

/**
 * Determine whether the given properties match those of a `FunctionSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_FunctionSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('functionName', cdk.requiredValidator)(properties.functionName));
    errors.collect(cdk.propertyValidator('functionName', cdk.validateString)(properties.functionName));
    return errors.wrap('supplied properties not correct for "FunctionSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.FunctionSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `FunctionSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.FunctionSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionFunctionSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_FunctionSAMPTPropertyValidator(properties).assertSuccess();
    return {
        FunctionName: cdk.stringToCloudFormation(properties.functionName),
    };
}

// @ts-ignore TS6133
function CfnFunctionFunctionSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FunctionSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FunctionSAMPTProperty>();
    ret.addPropertyResult('functionName', 'FunctionName', cfn_parse.FromCloudFormation.getString(properties.FunctionName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/safe_lambda_deployments.rst
     */
    export interface HooksProperty {
        /**
         * `CfnFunction.HooksProperty.PostTraffic`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly postTraffic?: string;
        /**
         * `CfnFunction.HooksProperty.PreTraffic`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly preTraffic?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HooksProperty`
 *
 * @param properties - the TypeScript properties of a `HooksProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_HooksPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('postTraffic', cdk.validateString)(properties.postTraffic));
    errors.collect(cdk.propertyValidator('preTraffic', cdk.validateString)(properties.preTraffic));
    return errors.wrap('supplied properties not correct for "HooksProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.Hooks` resource
 *
 * @param properties - the TypeScript properties of a `HooksProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.Hooks` resource.
 */
// @ts-ignore TS6133
function cfnFunctionHooksPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_HooksPropertyValidator(properties).assertSuccess();
    return {
        PostTraffic: cdk.stringToCloudFormation(properties.postTraffic),
        PreTraffic: cdk.stringToCloudFormation(properties.preTraffic),
    };
}

// @ts-ignore TS6133
function CfnFunctionHooksPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.HooksProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.HooksProperty>();
    ret.addPropertyResult('postTraffic', 'PostTraffic', properties.PostTraffic != null ? cfn_parse.FromCloudFormation.getString(properties.PostTraffic) : undefined);
    ret.addPropertyResult('preTraffic', 'PreTraffic', properties.PreTraffic != null ? cfn_parse.FromCloudFormation.getString(properties.PreTraffic) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
     */
    export interface HttpApiEventProperty {
        /**
         * `CfnFunction.HttpApiEventProperty.ApiId`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
         */
        readonly apiId?: string;
        /**
         * `CfnFunction.HttpApiEventProperty.Auth`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-httpapi.html
         */
        readonly auth?: CfnFunction.HttpApiFunctionAuthProperty | cdk.IResolvable;
        /**
         * `CfnFunction.HttpApiEventProperty.Method`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
         */
        readonly method?: string;
        /**
         * `CfnFunction.HttpApiEventProperty.Path`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
         */
        readonly path?: string;
        /**
         * `CfnFunction.HttpApiEventProperty.PayloadFormatVersion`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
         */
        readonly payloadFormatVersion?: string;
        /**
         * `CfnFunction.HttpApiEventProperty.RouteSettings`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-routesettings
         */
        readonly routeSettings?: CfnFunction.RouteSettingsProperty | cdk.IResolvable;
        /**
         * `CfnFunction.HttpApiEventProperty.TimeoutInMillis`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
         */
        readonly timeoutInMillis?: number;
    }
}

/**
 * Determine whether the given properties match those of a `HttpApiEventProperty`
 *
 * @param properties - the TypeScript properties of a `HttpApiEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_HttpApiEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('auth', CfnFunction_HttpApiFunctionAuthPropertyValidator)(properties.auth));
    errors.collect(cdk.propertyValidator('method', cdk.validateString)(properties.method));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    errors.collect(cdk.propertyValidator('payloadFormatVersion', cdk.validateString)(properties.payloadFormatVersion));
    errors.collect(cdk.propertyValidator('routeSettings', CfnFunction_RouteSettingsPropertyValidator)(properties.routeSettings));
    errors.collect(cdk.propertyValidator('timeoutInMillis', cdk.validateNumber)(properties.timeoutInMillis));
    return errors.wrap('supplied properties not correct for "HttpApiEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.HttpApiEvent` resource
 *
 * @param properties - the TypeScript properties of a `HttpApiEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.HttpApiEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionHttpApiEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_HttpApiEventPropertyValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        Auth: cfnFunctionHttpApiFunctionAuthPropertyToCloudFormation(properties.auth),
        Method: cdk.stringToCloudFormation(properties.method),
        Path: cdk.stringToCloudFormation(properties.path),
        PayloadFormatVersion: cdk.stringToCloudFormation(properties.payloadFormatVersion),
        RouteSettings: cfnFunctionRouteSettingsPropertyToCloudFormation(properties.routeSettings),
        TimeoutInMillis: cdk.numberToCloudFormation(properties.timeoutInMillis),
    };
}

// @ts-ignore TS6133
function CfnFunctionHttpApiEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.HttpApiEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.HttpApiEventProperty>();
    ret.addPropertyResult('apiId', 'ApiId', properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined);
    ret.addPropertyResult('auth', 'Auth', properties.Auth != null ? CfnFunctionHttpApiFunctionAuthPropertyFromCloudFormation(properties.Auth) : undefined);
    ret.addPropertyResult('method', 'Method', properties.Method != null ? cfn_parse.FromCloudFormation.getString(properties.Method) : undefined);
    ret.addPropertyResult('path', 'Path', properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined);
    ret.addPropertyResult('payloadFormatVersion', 'PayloadFormatVersion', properties.PayloadFormatVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadFormatVersion) : undefined);
    ret.addPropertyResult('routeSettings', 'RouteSettings', properties.RouteSettings != null ? CfnFunctionRouteSettingsPropertyFromCloudFormation(properties.RouteSettings) : undefined);
    ret.addPropertyResult('timeoutInMillis', 'TimeoutInMillis', properties.TimeoutInMillis != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInMillis) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-httpapifunctionauth.html
     */
    export interface HttpApiFunctionAuthProperty {
        /**
         * `CfnFunction.HttpApiFunctionAuthProperty.AuthorizationScopes`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-httpapifunctionauth.html
         */
        readonly authorizationScopes?: string[];
        /**
         * `CfnFunction.HttpApiFunctionAuthProperty.Authorizer`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-httpapifunctionauth.html
         */
        readonly authorizer?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpApiFunctionAuthProperty`
 *
 * @param properties - the TypeScript properties of a `HttpApiFunctionAuthProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_HttpApiFunctionAuthPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authorizationScopes', cdk.listValidator(cdk.validateString))(properties.authorizationScopes));
    errors.collect(cdk.propertyValidator('authorizer', cdk.validateString)(properties.authorizer));
    return errors.wrap('supplied properties not correct for "HttpApiFunctionAuthProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.HttpApiFunctionAuth` resource
 *
 * @param properties - the TypeScript properties of a `HttpApiFunctionAuthProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.HttpApiFunctionAuth` resource.
 */
// @ts-ignore TS6133
function cfnFunctionHttpApiFunctionAuthPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_HttpApiFunctionAuthPropertyValidator(properties).assertSuccess();
    return {
        AuthorizationScopes: cdk.listMapper(cdk.stringToCloudFormation)(properties.authorizationScopes),
        Authorizer: cdk.stringToCloudFormation(properties.authorizer),
    };
}

// @ts-ignore TS6133
function CfnFunctionHttpApiFunctionAuthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.HttpApiFunctionAuthProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.HttpApiFunctionAuthProperty>();
    ret.addPropertyResult('authorizationScopes', 'AuthorizationScopes', properties.AuthorizationScopes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AuthorizationScopes) : undefined);
    ret.addPropertyResult('authorizer', 'Authorizer', properties.Authorizer != null ? cfn_parse.FromCloudFormation.getString(properties.Authorizer) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
     */
    export interface IAMPolicyDocumentProperty {
        /**
         * `CfnFunction.IAMPolicyDocumentProperty.Statement`
         *
         * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
         */
        readonly statement: any | cdk.IResolvable;
        /**
         * `CfnFunction.IAMPolicyDocumentProperty.Version`
         *
         * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `IAMPolicyDocumentProperty`
 *
 * @param properties - the TypeScript properties of a `IAMPolicyDocumentProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_IAMPolicyDocumentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('statement', cdk.requiredValidator)(properties.statement));
    errors.collect(cdk.propertyValidator('statement', cdk.validateObject)(properties.statement));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "IAMPolicyDocumentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.IAMPolicyDocument` resource
 *
 * @param properties - the TypeScript properties of a `IAMPolicyDocumentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.IAMPolicyDocument` resource.
 */
// @ts-ignore TS6133
function cfnFunctionIAMPolicyDocumentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_IAMPolicyDocumentPropertyValidator(properties).assertSuccess();
    return {
        Statement: cdk.objectToCloudFormation(properties.statement),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnFunctionIAMPolicyDocumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.IAMPolicyDocumentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.IAMPolicyDocumentProperty>();
    ret.addPropertyResult('statement', 'Statement', cfn_parse.FromCloudFormation.getAny(properties.Statement));
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface IdentitySAMPTProperty {
        /**
         * `CfnFunction.IdentitySAMPTProperty.IdentityName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly identityName: string;
    }
}

/**
 * Determine whether the given properties match those of a `IdentitySAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `IdentitySAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_IdentitySAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('identityName', cdk.requiredValidator)(properties.identityName));
    errors.collect(cdk.propertyValidator('identityName', cdk.validateString)(properties.identityName));
    return errors.wrap('supplied properties not correct for "IdentitySAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.IdentitySAMPT` resource
 *
 * @param properties - the TypeScript properties of a `IdentitySAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.IdentitySAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionIdentitySAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_IdentitySAMPTPropertyValidator(properties).assertSuccess();
    return {
        IdentityName: cdk.stringToCloudFormation(properties.identityName),
    };
}

// @ts-ignore TS6133
function CfnFunctionIdentitySAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.IdentitySAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.IdentitySAMPTProperty>();
    ret.addPropertyResult('identityName', 'IdentityName', cfn_parse.FromCloudFormation.getString(properties.IdentityName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html
     */
    export interface ImageConfigProperty {
        /**
         * `CfnFunction.ImageConfigProperty.Command`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-command
         */
        readonly command?: string[];
        /**
         * `CfnFunction.ImageConfigProperty.EntryPoint`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-entrypoint
         */
        readonly entryPoint?: string[];
        /**
         * `CfnFunction.ImageConfigProperty.WorkingDirectory`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-workingdirectory
         */
        readonly workingDirectory?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ImageConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ImageConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_ImageConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('command', cdk.listValidator(cdk.validateString))(properties.command));
    errors.collect(cdk.propertyValidator('entryPoint', cdk.listValidator(cdk.validateString))(properties.entryPoint));
    errors.collect(cdk.propertyValidator('workingDirectory', cdk.validateString)(properties.workingDirectory));
    return errors.wrap('supplied properties not correct for "ImageConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.ImageConfig` resource
 *
 * @param properties - the TypeScript properties of a `ImageConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.ImageConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionImageConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_ImageConfigPropertyValidator(properties).assertSuccess();
    return {
        Command: cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
        EntryPoint: cdk.listMapper(cdk.stringToCloudFormation)(properties.entryPoint),
        WorkingDirectory: cdk.stringToCloudFormation(properties.workingDirectory),
    };
}

// @ts-ignore TS6133
function CfnFunctionImageConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.ImageConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.ImageConfigProperty>();
    ret.addPropertyResult('command', 'Command', properties.Command != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Command) : undefined);
    ret.addPropertyResult('entryPoint', 'EntryPoint', properties.EntryPoint != null ? cfn_parse.FromCloudFormation.getStringArray(properties.EntryPoint) : undefined);
    ret.addPropertyResult('workingDirectory', 'WorkingDirectory', properties.WorkingDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.WorkingDirectory) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule
     */
    export interface IoTRuleEventProperty {
        /**
         * `CfnFunction.IoTRuleEventProperty.AwsIotSqlVersion`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule
         */
        readonly awsIotSqlVersion?: string;
        /**
         * `CfnFunction.IoTRuleEventProperty.Sql`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule
         */
        readonly sql: string;
    }
}

/**
 * Determine whether the given properties match those of a `IoTRuleEventProperty`
 *
 * @param properties - the TypeScript properties of a `IoTRuleEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_IoTRuleEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsIotSqlVersion', cdk.validateString)(properties.awsIotSqlVersion));
    errors.collect(cdk.propertyValidator('sql', cdk.requiredValidator)(properties.sql));
    errors.collect(cdk.propertyValidator('sql', cdk.validateString)(properties.sql));
    return errors.wrap('supplied properties not correct for "IoTRuleEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.IoTRuleEvent` resource
 *
 * @param properties - the TypeScript properties of a `IoTRuleEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.IoTRuleEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionIoTRuleEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_IoTRuleEventPropertyValidator(properties).assertSuccess();
    return {
        AwsIotSqlVersion: cdk.stringToCloudFormation(properties.awsIotSqlVersion),
        Sql: cdk.stringToCloudFormation(properties.sql),
    };
}

// @ts-ignore TS6133
function CfnFunctionIoTRuleEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.IoTRuleEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.IoTRuleEventProperty>();
    ret.addPropertyResult('awsIotSqlVersion', 'AwsIotSqlVersion', properties.AwsIotSqlVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsIotSqlVersion) : undefined);
    ret.addPropertyResult('sql', 'Sql', cfn_parse.FromCloudFormation.getString(properties.Sql));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface KeySAMPTProperty {
        /**
         * `CfnFunction.KeySAMPTProperty.KeyId`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly keyId: string;
    }
}

/**
 * Determine whether the given properties match those of a `KeySAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `KeySAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_KeySAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('keyId', cdk.requiredValidator)(properties.keyId));
    errors.collect(cdk.propertyValidator('keyId', cdk.validateString)(properties.keyId));
    return errors.wrap('supplied properties not correct for "KeySAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.KeySAMPT` resource
 *
 * @param properties - the TypeScript properties of a `KeySAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.KeySAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionKeySAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_KeySAMPTPropertyValidator(properties).assertSuccess();
    return {
        KeyId: cdk.stringToCloudFormation(properties.keyId),
    };
}

// @ts-ignore TS6133
function CfnFunctionKeySAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.KeySAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.KeySAMPTProperty>();
    ret.addPropertyResult('keyId', 'KeyId', cfn_parse.FromCloudFormation.getString(properties.KeyId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
     */
    export interface KinesisEventProperty {
        /**
         * `CfnFunction.KinesisEventProperty.BatchSize`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        readonly batchSize?: number;
        /**
         * `CfnFunction.KinesisEventProperty.Enabled`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.KinesisEventProperty.FunctionResponseTypes`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        readonly functionResponseTypes?: string[];
        /**
         * `CfnFunction.KinesisEventProperty.StartingPosition`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        readonly startingPosition: string;
        /**
         * `CfnFunction.KinesisEventProperty.Stream`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        readonly stream: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisEventProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_KinesisEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('functionResponseTypes', cdk.listValidator(cdk.validateString))(properties.functionResponseTypes));
    errors.collect(cdk.propertyValidator('startingPosition', cdk.requiredValidator)(properties.startingPosition));
    errors.collect(cdk.propertyValidator('startingPosition', cdk.validateString)(properties.startingPosition));
    errors.collect(cdk.propertyValidator('stream', cdk.requiredValidator)(properties.stream));
    errors.collect(cdk.propertyValidator('stream', cdk.validateString)(properties.stream));
    return errors.wrap('supplied properties not correct for "KinesisEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.KinesisEvent` resource
 *
 * @param properties - the TypeScript properties of a `KinesisEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.KinesisEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionKinesisEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_KinesisEventPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        FunctionResponseTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.functionResponseTypes),
        StartingPosition: cdk.stringToCloudFormation(properties.startingPosition),
        Stream: cdk.stringToCloudFormation(properties.stream),
    };
}

// @ts-ignore TS6133
function CfnFunctionKinesisEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.KinesisEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.KinesisEventProperty>();
    ret.addPropertyResult('batchSize', 'BatchSize', properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('functionResponseTypes', 'FunctionResponseTypes', properties.FunctionResponseTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.FunctionResponseTypes) : undefined);
    ret.addPropertyResult('startingPosition', 'StartingPosition', cfn_parse.FromCloudFormation.getString(properties.StartingPosition));
    ret.addPropertyResult('stream', 'Stream', cfn_parse.FromCloudFormation.getString(properties.Stream));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface LogGroupSAMPTProperty {
        /**
         * `CfnFunction.LogGroupSAMPTProperty.LogGroupName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly logGroupName: string;
    }
}

/**
 * Determine whether the given properties match those of a `LogGroupSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `LogGroupSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_LogGroupSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroupName', cdk.requiredValidator)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    return errors.wrap('supplied properties not correct for "LogGroupSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.LogGroupSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `LogGroupSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.LogGroupSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionLogGroupSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_LogGroupSAMPTPropertyValidator(properties).assertSuccess();
    return {
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
    };
}

// @ts-ignore TS6133
function CfnFunctionLogGroupSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.LogGroupSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.LogGroupSAMPTProperty>();
    ret.addPropertyResult('logGroupName', 'LogGroupName', cfn_parse.FromCloudFormation.getString(properties.LogGroupName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface ParameterNameSAMPTProperty {
        /**
         * `CfnFunction.ParameterNameSAMPTProperty.ParameterName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly parameterName: string;
    }
}

/**
 * Determine whether the given properties match those of a `ParameterNameSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterNameSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_ParameterNameSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('parameterName', cdk.requiredValidator)(properties.parameterName));
    errors.collect(cdk.propertyValidator('parameterName', cdk.validateString)(properties.parameterName));
    return errors.wrap('supplied properties not correct for "ParameterNameSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.ParameterNameSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `ParameterNameSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.ParameterNameSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionParameterNameSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_ParameterNameSAMPTPropertyValidator(properties).assertSuccess();
    return {
        ParameterName: cdk.stringToCloudFormation(properties.parameterName),
    };
}

// @ts-ignore TS6133
function CfnFunctionParameterNameSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.ParameterNameSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.ParameterNameSAMPTProperty>();
    ret.addPropertyResult('parameterName', 'ParameterName', cfn_parse.FromCloudFormation.getString(properties.ParameterName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#provisioned-concurrency-config-object
     */
    export interface ProvisionedConcurrencyConfigProperty {
        /**
         * `CfnFunction.ProvisionedConcurrencyConfigProperty.ProvisionedConcurrentExecutions`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#provisioned-concurrency-config-object
         */
        readonly provisionedConcurrentExecutions: string;
    }
}

/**
 * Determine whether the given properties match those of a `ProvisionedConcurrencyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedConcurrencyConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_ProvisionedConcurrencyConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('provisionedConcurrentExecutions', cdk.requiredValidator)(properties.provisionedConcurrentExecutions));
    errors.collect(cdk.propertyValidator('provisionedConcurrentExecutions', cdk.validateString)(properties.provisionedConcurrentExecutions));
    return errors.wrap('supplied properties not correct for "ProvisionedConcurrencyConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.ProvisionedConcurrencyConfig` resource
 *
 * @param properties - the TypeScript properties of a `ProvisionedConcurrencyConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.ProvisionedConcurrencyConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionProvisionedConcurrencyConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_ProvisionedConcurrencyConfigPropertyValidator(properties).assertSuccess();
    return {
        ProvisionedConcurrentExecutions: cdk.stringToCloudFormation(properties.provisionedConcurrentExecutions),
    };
}

// @ts-ignore TS6133
function CfnFunctionProvisionedConcurrencyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.ProvisionedConcurrencyConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.ProvisionedConcurrencyConfigProperty>();
    ret.addPropertyResult('provisionedConcurrentExecutions', 'ProvisionedConcurrentExecutions', cfn_parse.FromCloudFormation.getString(properties.ProvisionedConcurrentExecutions));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface QueueSAMPTProperty {
        /**
         * `CfnFunction.QueueSAMPTProperty.QueueName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly queueName: string;
    }
}

/**
 * Determine whether the given properties match those of a `QueueSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `QueueSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_QueueSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('queueName', cdk.requiredValidator)(properties.queueName));
    errors.collect(cdk.propertyValidator('queueName', cdk.validateString)(properties.queueName));
    return errors.wrap('supplied properties not correct for "QueueSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.QueueSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `QueueSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.QueueSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionQueueSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_QueueSAMPTPropertyValidator(properties).assertSuccess();
    return {
        QueueName: cdk.stringToCloudFormation(properties.queueName),
    };
}

// @ts-ignore TS6133
function CfnFunctionQueueSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.QueueSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.QueueSAMPTProperty>();
    ret.addPropertyResult('queueName', 'QueueName', cfn_parse.FromCloudFormation.getString(properties.QueueName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestmodel.html
     */
    export interface RequestModelProperty {
        /**
         * `CfnFunction.RequestModelProperty.Model`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestmodel.html#sam-function-requestmodel-model
         */
        readonly model: string;
        /**
         * `CfnFunction.RequestModelProperty.Required`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestmodel.html#sam-function-requestmodel-required
         */
        readonly required?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.RequestModelProperty.ValidateBody`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestmodel.html#sam-function-requestmodel-validatebody
         */
        readonly validateBody?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.RequestModelProperty.ValidateParameters`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestmodel.html#sam-function-requestmodel-validateparameters
         */
        readonly validateParameters?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RequestModelProperty`
 *
 * @param properties - the TypeScript properties of a `RequestModelProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_RequestModelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('model', cdk.requiredValidator)(properties.model));
    errors.collect(cdk.propertyValidator('model', cdk.validateString)(properties.model));
    errors.collect(cdk.propertyValidator('required', cdk.validateBoolean)(properties.required));
    errors.collect(cdk.propertyValidator('validateBody', cdk.validateBoolean)(properties.validateBody));
    errors.collect(cdk.propertyValidator('validateParameters', cdk.validateBoolean)(properties.validateParameters));
    return errors.wrap('supplied properties not correct for "RequestModelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.RequestModel` resource
 *
 * @param properties - the TypeScript properties of a `RequestModelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.RequestModel` resource.
 */
// @ts-ignore TS6133
function cfnFunctionRequestModelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_RequestModelPropertyValidator(properties).assertSuccess();
    return {
        Model: cdk.stringToCloudFormation(properties.model),
        Required: cdk.booleanToCloudFormation(properties.required),
        ValidateBody: cdk.booleanToCloudFormation(properties.validateBody),
        ValidateParameters: cdk.booleanToCloudFormation(properties.validateParameters),
    };
}

// @ts-ignore TS6133
function CfnFunctionRequestModelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.RequestModelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.RequestModelProperty>();
    ret.addPropertyResult('model', 'Model', cfn_parse.FromCloudFormation.getString(properties.Model));
    ret.addPropertyResult('required', 'Required', properties.Required != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Required) : undefined);
    ret.addPropertyResult('validateBody', 'ValidateBody', properties.ValidateBody != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ValidateBody) : undefined);
    ret.addPropertyResult('validateParameters', 'ValidateParameters', properties.ValidateParameters != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ValidateParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestparameter.html
     */
    export interface RequestParameterProperty {
        /**
         * `CfnFunction.RequestParameterProperty.Caching`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestparameter.html#sam-function-requestparameter-caching
         */
        readonly caching?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.RequestParameterProperty.Required`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestparameter.html#sam-function-requestparameter-required
         */
        readonly required?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RequestParameterProperty`
 *
 * @param properties - the TypeScript properties of a `RequestParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_RequestParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('caching', cdk.validateBoolean)(properties.caching));
    errors.collect(cdk.propertyValidator('required', cdk.validateBoolean)(properties.required));
    return errors.wrap('supplied properties not correct for "RequestParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.RequestParameter` resource
 *
 * @param properties - the TypeScript properties of a `RequestParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.RequestParameter` resource.
 */
// @ts-ignore TS6133
function cfnFunctionRequestParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_RequestParameterPropertyValidator(properties).assertSuccess();
    return {
        Caching: cdk.booleanToCloudFormation(properties.caching),
        Required: cdk.booleanToCloudFormation(properties.required),
    };
}

// @ts-ignore TS6133
function CfnFunctionRequestParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.RequestParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.RequestParameterProperty>();
    ret.addPropertyResult('caching', 'Caching', properties.Caching != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Caching) : undefined);
    ret.addPropertyResult('required', 'Required', properties.Required != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Required) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html
     */
    export interface RouteSettingsProperty {
        /**
         * `CfnFunction.RouteSettingsProperty.DataTraceEnabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-datatraceenabled
         */
        readonly dataTraceEnabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.RouteSettingsProperty.DetailedMetricsEnabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-detailedmetricsenabled
         */
        readonly detailedMetricsEnabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.RouteSettingsProperty.LoggingLevel`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-logginglevel
         */
        readonly loggingLevel?: string;
        /**
         * `CfnFunction.RouteSettingsProperty.ThrottlingBurstLimit`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingburstlimit
         */
        readonly throttlingBurstLimit?: number;
        /**
         * `CfnFunction.RouteSettingsProperty.ThrottlingRateLimit`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingratelimit
         */
        readonly throttlingRateLimit?: number;
    }
}

/**
 * Determine whether the given properties match those of a `RouteSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_RouteSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataTraceEnabled', cdk.validateBoolean)(properties.dataTraceEnabled));
    errors.collect(cdk.propertyValidator('detailedMetricsEnabled', cdk.validateBoolean)(properties.detailedMetricsEnabled));
    errors.collect(cdk.propertyValidator('loggingLevel', cdk.validateString)(properties.loggingLevel));
    errors.collect(cdk.propertyValidator('throttlingBurstLimit', cdk.validateNumber)(properties.throttlingBurstLimit));
    errors.collect(cdk.propertyValidator('throttlingRateLimit', cdk.validateNumber)(properties.throttlingRateLimit));
    return errors.wrap('supplied properties not correct for "RouteSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.RouteSettings` resource
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.RouteSettings` resource.
 */
// @ts-ignore TS6133
function cfnFunctionRouteSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_RouteSettingsPropertyValidator(properties).assertSuccess();
    return {
        DataTraceEnabled: cdk.booleanToCloudFormation(properties.dataTraceEnabled),
        DetailedMetricsEnabled: cdk.booleanToCloudFormation(properties.detailedMetricsEnabled),
        LoggingLevel: cdk.stringToCloudFormation(properties.loggingLevel),
        ThrottlingBurstLimit: cdk.numberToCloudFormation(properties.throttlingBurstLimit),
        ThrottlingRateLimit: cdk.numberToCloudFormation(properties.throttlingRateLimit),
    };
}

// @ts-ignore TS6133
function CfnFunctionRouteSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.RouteSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.RouteSettingsProperty>();
    ret.addPropertyResult('dataTraceEnabled', 'DataTraceEnabled', properties.DataTraceEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataTraceEnabled) : undefined);
    ret.addPropertyResult('detailedMetricsEnabled', 'DetailedMetricsEnabled', properties.DetailedMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DetailedMetricsEnabled) : undefined);
    ret.addPropertyResult('loggingLevel', 'LoggingLevel', properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined);
    ret.addPropertyResult('throttlingBurstLimit', 'ThrottlingBurstLimit', properties.ThrottlingBurstLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingBurstLimit) : undefined);
    ret.addPropertyResult('throttlingRateLimit', 'ThrottlingRateLimit', properties.ThrottlingRateLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingRateLimit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
     */
    export interface S3EventProperty {
        /**
         * `CfnFunction.S3EventProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
         */
        readonly bucket: string;
        /**
         * `CfnFunction.S3EventProperty.Events`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
         */
        readonly events: string[] | string | cdk.IResolvable;
        /**
         * `CfnFunction.S3EventProperty.Filter`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
         */
        readonly filter?: CfnFunction.S3NotificationFilterProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `S3EventProperty`
 *
 * @param properties - the TypeScript properties of a `S3EventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_S3EventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('events', cdk.requiredValidator)(properties.events));
    errors.collect(cdk.propertyValidator('events', cdk.unionValidator(cdk.unionValidator(cdk.validateString), cdk.listValidator(cdk.unionValidator(cdk.validateString))))(properties.events));
    errors.collect(cdk.propertyValidator('filter', CfnFunction_S3NotificationFilterPropertyValidator)(properties.filter));
    return errors.wrap('supplied properties not correct for "S3EventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.S3Event` resource
 *
 * @param properties - the TypeScript properties of a `S3EventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.S3Event` resource.
 */
// @ts-ignore TS6133
function cfnFunctionS3EventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_S3EventPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Events: cdk.unionMapper([cdk.unionValidator(cdk.validateString), cdk.listValidator(cdk.unionValidator(cdk.validateString))], [cdk.unionMapper([cdk.validateString], [cdk.stringToCloudFormation]), cdk.listMapper(cdk.unionMapper([cdk.validateString], [cdk.stringToCloudFormation]))])(properties.events),
        Filter: cfnFunctionS3NotificationFilterPropertyToCloudFormation(properties.filter),
    };
}

// @ts-ignore TS6133
function CfnFunctionS3EventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.S3EventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.S3EventProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('events', 'Events', cfn_parse.FromCloudFormation.getTypeUnion([cdk.unionValidator(cdk.validateString), cdk.listValidator(cdk.unionValidator(cdk.validateString))], [cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString], [cfn_parse.FromCloudFormation.getString]), cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString], [cfn_parse.FromCloudFormation.getString]))])(properties.Events));
    ret.addPropertyResult('filter', 'Filter', properties.Filter != null ? CfnFunctionS3NotificationFilterPropertyFromCloudFormation(properties.Filter) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
     */
    export interface S3KeyFilterProperty {
        /**
         * `CfnFunction.S3KeyFilterProperty.Rules`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
         */
        readonly rules: Array<CfnFunction.S3KeyFilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `S3KeyFilterProperty`
 *
 * @param properties - the TypeScript properties of a `S3KeyFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_S3KeyFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rules', cdk.requiredValidator)(properties.rules));
    errors.collect(cdk.propertyValidator('rules', cdk.listValidator(CfnFunction_S3KeyFilterRulePropertyValidator))(properties.rules));
    return errors.wrap('supplied properties not correct for "S3KeyFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.S3KeyFilter` resource
 *
 * @param properties - the TypeScript properties of a `S3KeyFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.S3KeyFilter` resource.
 */
// @ts-ignore TS6133
function cfnFunctionS3KeyFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_S3KeyFilterPropertyValidator(properties).assertSuccess();
    return {
        Rules: cdk.listMapper(cfnFunctionS3KeyFilterRulePropertyToCloudFormation)(properties.rules),
    };
}

// @ts-ignore TS6133
function CfnFunctionS3KeyFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.S3KeyFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.S3KeyFilterProperty>();
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getArray(CfnFunctionS3KeyFilterRulePropertyFromCloudFormation)(properties.Rules));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html
     */
    export interface S3KeyFilterRuleProperty {
        /**
         * `CfnFunction.S3KeyFilterRuleProperty.Name`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html
         */
        readonly name: string;
        /**
         * `CfnFunction.S3KeyFilterRuleProperty.Value`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3KeyFilterRuleProperty`
 *
 * @param properties - the TypeScript properties of a `S3KeyFilterRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_S3KeyFilterRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "S3KeyFilterRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.S3KeyFilterRule` resource
 *
 * @param properties - the TypeScript properties of a `S3KeyFilterRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.S3KeyFilterRule` resource.
 */
// @ts-ignore TS6133
function cfnFunctionS3KeyFilterRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_S3KeyFilterRulePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnFunctionS3KeyFilterRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.S3KeyFilterRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.S3KeyFilterRuleProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    export interface S3LocationProperty {
        /**
         * `CfnFunction.S3LocationProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly bucket: string;
        /**
         * `CfnFunction.S3LocationProperty.Key`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly key: string;
        /**
         * `CfnFunction.S3LocationProperty.Version`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly version?: number;
    }
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_S3LocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('version', cdk.validateNumber)(properties.version));
    return errors.wrap('supplied properties not correct for "S3LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.S3Location` resource
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.S3Location` resource.
 */
// @ts-ignore TS6133
function cfnFunctionS3LocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_S3LocationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Key: cdk.stringToCloudFormation(properties.key),
        Version: cdk.numberToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnFunctionS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.S3LocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.S3LocationProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
     */
    export interface S3NotificationFilterProperty {
        /**
         * `CfnFunction.S3NotificationFilterProperty.S3Key`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
         */
        readonly s3Key: CfnFunction.S3KeyFilterProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `S3NotificationFilterProperty`
 *
 * @param properties - the TypeScript properties of a `S3NotificationFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_S3NotificationFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Key', cdk.requiredValidator)(properties.s3Key));
    errors.collect(cdk.propertyValidator('s3Key', CfnFunction_S3KeyFilterPropertyValidator)(properties.s3Key));
    return errors.wrap('supplied properties not correct for "S3NotificationFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.S3NotificationFilter` resource
 *
 * @param properties - the TypeScript properties of a `S3NotificationFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.S3NotificationFilter` resource.
 */
// @ts-ignore TS6133
function cfnFunctionS3NotificationFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_S3NotificationFilterPropertyValidator(properties).assertSuccess();
    return {
        S3Key: cfnFunctionS3KeyFilterPropertyToCloudFormation(properties.s3Key),
    };
}

// @ts-ignore TS6133
function CfnFunctionS3NotificationFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.S3NotificationFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.S3NotificationFilterProperty>();
    ret.addPropertyResult('s3Key', 'S3Key', CfnFunctionS3KeyFilterPropertyFromCloudFormation(properties.S3Key));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface SAMPolicyTemplateProperty {
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.AMIDescribePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly amiDescribePolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.AWSSecretsManagerGetSecretValuePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly awsSecretsManagerGetSecretValuePolicy?: CfnFunction.SecretArnSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.CloudFormationDescribeStacksPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly cloudFormationDescribeStacksPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.CloudWatchPutMetricPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly cloudWatchPutMetricPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.DynamoDBCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly dynamoDbCrudPolicy?: CfnFunction.TableSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.DynamoDBReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly dynamoDbReadPolicy?: CfnFunction.TableSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.DynamoDBStreamReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly dynamoDbStreamReadPolicy?: CfnFunction.TableStreamSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.DynamoDBWritePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly dynamoDbWritePolicy?: CfnFunction.TableSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.EC2DescribePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly ec2DescribePolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.ElasticsearchHttpPostPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly elasticsearchHttpPostPolicy?: CfnFunction.DomainSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.FilterLogEventsPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly filterLogEventsPolicy?: CfnFunction.LogGroupSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.KMSDecryptPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly kmsDecryptPolicy?: CfnFunction.KeySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.KinesisCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly kinesisCrudPolicy?: CfnFunction.StreamSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.KinesisStreamReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly kinesisStreamReadPolicy?: CfnFunction.StreamSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.LambdaInvokePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly lambdaInvokePolicy?: CfnFunction.FunctionSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.RekognitionDetectOnlyPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly rekognitionDetectOnlyPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.RekognitionLabelsPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly rekognitionLabelsPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.RekognitionNoDataAccessPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly rekognitionNoDataAccessPolicy?: CfnFunction.CollectionSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.RekognitionReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly rekognitionReadPolicy?: CfnFunction.CollectionSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.RekognitionWriteOnlyAccessPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly rekognitionWriteOnlyAccessPolicy?: CfnFunction.CollectionSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.S3CrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly s3CrudPolicy?: CfnFunction.BucketSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.S3ReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly s3ReadPolicy?: CfnFunction.BucketSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.S3WritePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly s3WritePolicy?: CfnFunction.BucketSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SESBulkTemplatedCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sesBulkTemplatedCrudPolicy?: CfnFunction.IdentitySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SESCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sesCrudPolicy?: CfnFunction.IdentitySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SESEmailTemplateCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sesEmailTemplateCrudPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SESSendBouncePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sesSendBouncePolicy?: CfnFunction.IdentitySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SNSCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly snsCrudPolicy?: CfnFunction.TopicSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SNSPublishMessagePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly snsPublishMessagePolicy?: CfnFunction.TopicSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SQSPollerPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sqsPollerPolicy?: CfnFunction.QueueSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SQSSendMessagePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sqsSendMessagePolicy?: CfnFunction.QueueSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SSMParameterReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly ssmParameterReadPolicy?: CfnFunction.ParameterNameSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.StepFunctionsExecutionPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly stepFunctionsExecutionPolicy?: CfnFunction.StateMachineSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.VPCAccessPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly vpcAccessPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SAMPolicyTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `SAMPolicyTemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_SAMPolicyTemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('amiDescribePolicy', CfnFunction_EmptySAMPTPropertyValidator)(properties.amiDescribePolicy));
    errors.collect(cdk.propertyValidator('awsSecretsManagerGetSecretValuePolicy', CfnFunction_SecretArnSAMPTPropertyValidator)(properties.awsSecretsManagerGetSecretValuePolicy));
    errors.collect(cdk.propertyValidator('cloudFormationDescribeStacksPolicy', CfnFunction_EmptySAMPTPropertyValidator)(properties.cloudFormationDescribeStacksPolicy));
    errors.collect(cdk.propertyValidator('cloudWatchPutMetricPolicy', CfnFunction_EmptySAMPTPropertyValidator)(properties.cloudWatchPutMetricPolicy));
    errors.collect(cdk.propertyValidator('dynamoDbCrudPolicy', CfnFunction_TableSAMPTPropertyValidator)(properties.dynamoDbCrudPolicy));
    errors.collect(cdk.propertyValidator('dynamoDbReadPolicy', CfnFunction_TableSAMPTPropertyValidator)(properties.dynamoDbReadPolicy));
    errors.collect(cdk.propertyValidator('dynamoDbStreamReadPolicy', CfnFunction_TableStreamSAMPTPropertyValidator)(properties.dynamoDbStreamReadPolicy));
    errors.collect(cdk.propertyValidator('dynamoDbWritePolicy', CfnFunction_TableSAMPTPropertyValidator)(properties.dynamoDbWritePolicy));
    errors.collect(cdk.propertyValidator('ec2DescribePolicy', CfnFunction_EmptySAMPTPropertyValidator)(properties.ec2DescribePolicy));
    errors.collect(cdk.propertyValidator('elasticsearchHttpPostPolicy', CfnFunction_DomainSAMPTPropertyValidator)(properties.elasticsearchHttpPostPolicy));
    errors.collect(cdk.propertyValidator('filterLogEventsPolicy', CfnFunction_LogGroupSAMPTPropertyValidator)(properties.filterLogEventsPolicy));
    errors.collect(cdk.propertyValidator('kmsDecryptPolicy', CfnFunction_KeySAMPTPropertyValidator)(properties.kmsDecryptPolicy));
    errors.collect(cdk.propertyValidator('kinesisCrudPolicy', CfnFunction_StreamSAMPTPropertyValidator)(properties.kinesisCrudPolicy));
    errors.collect(cdk.propertyValidator('kinesisStreamReadPolicy', CfnFunction_StreamSAMPTPropertyValidator)(properties.kinesisStreamReadPolicy));
    errors.collect(cdk.propertyValidator('lambdaInvokePolicy', CfnFunction_FunctionSAMPTPropertyValidator)(properties.lambdaInvokePolicy));
    errors.collect(cdk.propertyValidator('rekognitionDetectOnlyPolicy', CfnFunction_EmptySAMPTPropertyValidator)(properties.rekognitionDetectOnlyPolicy));
    errors.collect(cdk.propertyValidator('rekognitionLabelsPolicy', CfnFunction_EmptySAMPTPropertyValidator)(properties.rekognitionLabelsPolicy));
    errors.collect(cdk.propertyValidator('rekognitionNoDataAccessPolicy', CfnFunction_CollectionSAMPTPropertyValidator)(properties.rekognitionNoDataAccessPolicy));
    errors.collect(cdk.propertyValidator('rekognitionReadPolicy', CfnFunction_CollectionSAMPTPropertyValidator)(properties.rekognitionReadPolicy));
    errors.collect(cdk.propertyValidator('rekognitionWriteOnlyAccessPolicy', CfnFunction_CollectionSAMPTPropertyValidator)(properties.rekognitionWriteOnlyAccessPolicy));
    errors.collect(cdk.propertyValidator('s3CrudPolicy', CfnFunction_BucketSAMPTPropertyValidator)(properties.s3CrudPolicy));
    errors.collect(cdk.propertyValidator('s3ReadPolicy', CfnFunction_BucketSAMPTPropertyValidator)(properties.s3ReadPolicy));
    errors.collect(cdk.propertyValidator('s3WritePolicy', CfnFunction_BucketSAMPTPropertyValidator)(properties.s3WritePolicy));
    errors.collect(cdk.propertyValidator('sesBulkTemplatedCrudPolicy', CfnFunction_IdentitySAMPTPropertyValidator)(properties.sesBulkTemplatedCrudPolicy));
    errors.collect(cdk.propertyValidator('sesCrudPolicy', CfnFunction_IdentitySAMPTPropertyValidator)(properties.sesCrudPolicy));
    errors.collect(cdk.propertyValidator('sesEmailTemplateCrudPolicy', CfnFunction_EmptySAMPTPropertyValidator)(properties.sesEmailTemplateCrudPolicy));
    errors.collect(cdk.propertyValidator('sesSendBouncePolicy', CfnFunction_IdentitySAMPTPropertyValidator)(properties.sesSendBouncePolicy));
    errors.collect(cdk.propertyValidator('snsCrudPolicy', CfnFunction_TopicSAMPTPropertyValidator)(properties.snsCrudPolicy));
    errors.collect(cdk.propertyValidator('snsPublishMessagePolicy', CfnFunction_TopicSAMPTPropertyValidator)(properties.snsPublishMessagePolicy));
    errors.collect(cdk.propertyValidator('sqsPollerPolicy', CfnFunction_QueueSAMPTPropertyValidator)(properties.sqsPollerPolicy));
    errors.collect(cdk.propertyValidator('sqsSendMessagePolicy', CfnFunction_QueueSAMPTPropertyValidator)(properties.sqsSendMessagePolicy));
    errors.collect(cdk.propertyValidator('ssmParameterReadPolicy', CfnFunction_ParameterNameSAMPTPropertyValidator)(properties.ssmParameterReadPolicy));
    errors.collect(cdk.propertyValidator('stepFunctionsExecutionPolicy', CfnFunction_StateMachineSAMPTPropertyValidator)(properties.stepFunctionsExecutionPolicy));
    errors.collect(cdk.propertyValidator('vpcAccessPolicy', CfnFunction_EmptySAMPTPropertyValidator)(properties.vpcAccessPolicy));
    return errors.wrap('supplied properties not correct for "SAMPolicyTemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.SAMPolicyTemplate` resource
 *
 * @param properties - the TypeScript properties of a `SAMPolicyTemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.SAMPolicyTemplate` resource.
 */
// @ts-ignore TS6133
function cfnFunctionSAMPolicyTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_SAMPolicyTemplatePropertyValidator(properties).assertSuccess();
    return {
        AMIDescribePolicy: cfnFunctionEmptySAMPTPropertyToCloudFormation(properties.amiDescribePolicy),
        AWSSecretsManagerGetSecretValuePolicy: cfnFunctionSecretArnSAMPTPropertyToCloudFormation(properties.awsSecretsManagerGetSecretValuePolicy),
        CloudFormationDescribeStacksPolicy: cfnFunctionEmptySAMPTPropertyToCloudFormation(properties.cloudFormationDescribeStacksPolicy),
        CloudWatchPutMetricPolicy: cfnFunctionEmptySAMPTPropertyToCloudFormation(properties.cloudWatchPutMetricPolicy),
        DynamoDBCrudPolicy: cfnFunctionTableSAMPTPropertyToCloudFormation(properties.dynamoDbCrudPolicy),
        DynamoDBReadPolicy: cfnFunctionTableSAMPTPropertyToCloudFormation(properties.dynamoDbReadPolicy),
        DynamoDBStreamReadPolicy: cfnFunctionTableStreamSAMPTPropertyToCloudFormation(properties.dynamoDbStreamReadPolicy),
        DynamoDBWritePolicy: cfnFunctionTableSAMPTPropertyToCloudFormation(properties.dynamoDbWritePolicy),
        EC2DescribePolicy: cfnFunctionEmptySAMPTPropertyToCloudFormation(properties.ec2DescribePolicy),
        ElasticsearchHttpPostPolicy: cfnFunctionDomainSAMPTPropertyToCloudFormation(properties.elasticsearchHttpPostPolicy),
        FilterLogEventsPolicy: cfnFunctionLogGroupSAMPTPropertyToCloudFormation(properties.filterLogEventsPolicy),
        KMSDecryptPolicy: cfnFunctionKeySAMPTPropertyToCloudFormation(properties.kmsDecryptPolicy),
        KinesisCrudPolicy: cfnFunctionStreamSAMPTPropertyToCloudFormation(properties.kinesisCrudPolicy),
        KinesisStreamReadPolicy: cfnFunctionStreamSAMPTPropertyToCloudFormation(properties.kinesisStreamReadPolicy),
        LambdaInvokePolicy: cfnFunctionFunctionSAMPTPropertyToCloudFormation(properties.lambdaInvokePolicy),
        RekognitionDetectOnlyPolicy: cfnFunctionEmptySAMPTPropertyToCloudFormation(properties.rekognitionDetectOnlyPolicy),
        RekognitionLabelsPolicy: cfnFunctionEmptySAMPTPropertyToCloudFormation(properties.rekognitionLabelsPolicy),
        RekognitionNoDataAccessPolicy: cfnFunctionCollectionSAMPTPropertyToCloudFormation(properties.rekognitionNoDataAccessPolicy),
        RekognitionReadPolicy: cfnFunctionCollectionSAMPTPropertyToCloudFormation(properties.rekognitionReadPolicy),
        RekognitionWriteOnlyAccessPolicy: cfnFunctionCollectionSAMPTPropertyToCloudFormation(properties.rekognitionWriteOnlyAccessPolicy),
        S3CrudPolicy: cfnFunctionBucketSAMPTPropertyToCloudFormation(properties.s3CrudPolicy),
        S3ReadPolicy: cfnFunctionBucketSAMPTPropertyToCloudFormation(properties.s3ReadPolicy),
        S3WritePolicy: cfnFunctionBucketSAMPTPropertyToCloudFormation(properties.s3WritePolicy),
        SESBulkTemplatedCrudPolicy: cfnFunctionIdentitySAMPTPropertyToCloudFormation(properties.sesBulkTemplatedCrudPolicy),
        SESCrudPolicy: cfnFunctionIdentitySAMPTPropertyToCloudFormation(properties.sesCrudPolicy),
        SESEmailTemplateCrudPolicy: cfnFunctionEmptySAMPTPropertyToCloudFormation(properties.sesEmailTemplateCrudPolicy),
        SESSendBouncePolicy: cfnFunctionIdentitySAMPTPropertyToCloudFormation(properties.sesSendBouncePolicy),
        SNSCrudPolicy: cfnFunctionTopicSAMPTPropertyToCloudFormation(properties.snsCrudPolicy),
        SNSPublishMessagePolicy: cfnFunctionTopicSAMPTPropertyToCloudFormation(properties.snsPublishMessagePolicy),
        SQSPollerPolicy: cfnFunctionQueueSAMPTPropertyToCloudFormation(properties.sqsPollerPolicy),
        SQSSendMessagePolicy: cfnFunctionQueueSAMPTPropertyToCloudFormation(properties.sqsSendMessagePolicy),
        SSMParameterReadPolicy: cfnFunctionParameterNameSAMPTPropertyToCloudFormation(properties.ssmParameterReadPolicy),
        StepFunctionsExecutionPolicy: cfnFunctionStateMachineSAMPTPropertyToCloudFormation(properties.stepFunctionsExecutionPolicy),
        VPCAccessPolicy: cfnFunctionEmptySAMPTPropertyToCloudFormation(properties.vpcAccessPolicy),
    };
}

// @ts-ignore TS6133
function CfnFunctionSAMPolicyTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.SAMPolicyTemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.SAMPolicyTemplateProperty>();
    ret.addPropertyResult('amiDescribePolicy', 'AMIDescribePolicy', properties.AMIDescribePolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.AMIDescribePolicy) : undefined);
    ret.addPropertyResult('awsSecretsManagerGetSecretValuePolicy', 'AWSSecretsManagerGetSecretValuePolicy', properties.AWSSecretsManagerGetSecretValuePolicy != null ? CfnFunctionSecretArnSAMPTPropertyFromCloudFormation(properties.AWSSecretsManagerGetSecretValuePolicy) : undefined);
    ret.addPropertyResult('cloudFormationDescribeStacksPolicy', 'CloudFormationDescribeStacksPolicy', properties.CloudFormationDescribeStacksPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.CloudFormationDescribeStacksPolicy) : undefined);
    ret.addPropertyResult('cloudWatchPutMetricPolicy', 'CloudWatchPutMetricPolicy', properties.CloudWatchPutMetricPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.CloudWatchPutMetricPolicy) : undefined);
    ret.addPropertyResult('dynamoDbCrudPolicy', 'DynamoDBCrudPolicy', properties.DynamoDBCrudPolicy != null ? CfnFunctionTableSAMPTPropertyFromCloudFormation(properties.DynamoDBCrudPolicy) : undefined);
    ret.addPropertyResult('dynamoDbReadPolicy', 'DynamoDBReadPolicy', properties.DynamoDBReadPolicy != null ? CfnFunctionTableSAMPTPropertyFromCloudFormation(properties.DynamoDBReadPolicy) : undefined);
    ret.addPropertyResult('dynamoDbStreamReadPolicy', 'DynamoDBStreamReadPolicy', properties.DynamoDBStreamReadPolicy != null ? CfnFunctionTableStreamSAMPTPropertyFromCloudFormation(properties.DynamoDBStreamReadPolicy) : undefined);
    ret.addPropertyResult('dynamoDbWritePolicy', 'DynamoDBWritePolicy', properties.DynamoDBWritePolicy != null ? CfnFunctionTableSAMPTPropertyFromCloudFormation(properties.DynamoDBWritePolicy) : undefined);
    ret.addPropertyResult('ec2DescribePolicy', 'EC2DescribePolicy', properties.EC2DescribePolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.EC2DescribePolicy) : undefined);
    ret.addPropertyResult('elasticsearchHttpPostPolicy', 'ElasticsearchHttpPostPolicy', properties.ElasticsearchHttpPostPolicy != null ? CfnFunctionDomainSAMPTPropertyFromCloudFormation(properties.ElasticsearchHttpPostPolicy) : undefined);
    ret.addPropertyResult('filterLogEventsPolicy', 'FilterLogEventsPolicy', properties.FilterLogEventsPolicy != null ? CfnFunctionLogGroupSAMPTPropertyFromCloudFormation(properties.FilterLogEventsPolicy) : undefined);
    ret.addPropertyResult('kmsDecryptPolicy', 'KMSDecryptPolicy', properties.KMSDecryptPolicy != null ? CfnFunctionKeySAMPTPropertyFromCloudFormation(properties.KMSDecryptPolicy) : undefined);
    ret.addPropertyResult('kinesisCrudPolicy', 'KinesisCrudPolicy', properties.KinesisCrudPolicy != null ? CfnFunctionStreamSAMPTPropertyFromCloudFormation(properties.KinesisCrudPolicy) : undefined);
    ret.addPropertyResult('kinesisStreamReadPolicy', 'KinesisStreamReadPolicy', properties.KinesisStreamReadPolicy != null ? CfnFunctionStreamSAMPTPropertyFromCloudFormation(properties.KinesisStreamReadPolicy) : undefined);
    ret.addPropertyResult('lambdaInvokePolicy', 'LambdaInvokePolicy', properties.LambdaInvokePolicy != null ? CfnFunctionFunctionSAMPTPropertyFromCloudFormation(properties.LambdaInvokePolicy) : undefined);
    ret.addPropertyResult('rekognitionDetectOnlyPolicy', 'RekognitionDetectOnlyPolicy', properties.RekognitionDetectOnlyPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.RekognitionDetectOnlyPolicy) : undefined);
    ret.addPropertyResult('rekognitionLabelsPolicy', 'RekognitionLabelsPolicy', properties.RekognitionLabelsPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.RekognitionLabelsPolicy) : undefined);
    ret.addPropertyResult('rekognitionNoDataAccessPolicy', 'RekognitionNoDataAccessPolicy', properties.RekognitionNoDataAccessPolicy != null ? CfnFunctionCollectionSAMPTPropertyFromCloudFormation(properties.RekognitionNoDataAccessPolicy) : undefined);
    ret.addPropertyResult('rekognitionReadPolicy', 'RekognitionReadPolicy', properties.RekognitionReadPolicy != null ? CfnFunctionCollectionSAMPTPropertyFromCloudFormation(properties.RekognitionReadPolicy) : undefined);
    ret.addPropertyResult('rekognitionWriteOnlyAccessPolicy', 'RekognitionWriteOnlyAccessPolicy', properties.RekognitionWriteOnlyAccessPolicy != null ? CfnFunctionCollectionSAMPTPropertyFromCloudFormation(properties.RekognitionWriteOnlyAccessPolicy) : undefined);
    ret.addPropertyResult('s3CrudPolicy', 'S3CrudPolicy', properties.S3CrudPolicy != null ? CfnFunctionBucketSAMPTPropertyFromCloudFormation(properties.S3CrudPolicy) : undefined);
    ret.addPropertyResult('s3ReadPolicy', 'S3ReadPolicy', properties.S3ReadPolicy != null ? CfnFunctionBucketSAMPTPropertyFromCloudFormation(properties.S3ReadPolicy) : undefined);
    ret.addPropertyResult('s3WritePolicy', 'S3WritePolicy', properties.S3WritePolicy != null ? CfnFunctionBucketSAMPTPropertyFromCloudFormation(properties.S3WritePolicy) : undefined);
    ret.addPropertyResult('sesBulkTemplatedCrudPolicy', 'SESBulkTemplatedCrudPolicy', properties.SESBulkTemplatedCrudPolicy != null ? CfnFunctionIdentitySAMPTPropertyFromCloudFormation(properties.SESBulkTemplatedCrudPolicy) : undefined);
    ret.addPropertyResult('sesCrudPolicy', 'SESCrudPolicy', properties.SESCrudPolicy != null ? CfnFunctionIdentitySAMPTPropertyFromCloudFormation(properties.SESCrudPolicy) : undefined);
    ret.addPropertyResult('sesEmailTemplateCrudPolicy', 'SESEmailTemplateCrudPolicy', properties.SESEmailTemplateCrudPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.SESEmailTemplateCrudPolicy) : undefined);
    ret.addPropertyResult('sesSendBouncePolicy', 'SESSendBouncePolicy', properties.SESSendBouncePolicy != null ? CfnFunctionIdentitySAMPTPropertyFromCloudFormation(properties.SESSendBouncePolicy) : undefined);
    ret.addPropertyResult('snsCrudPolicy', 'SNSCrudPolicy', properties.SNSCrudPolicy != null ? CfnFunctionTopicSAMPTPropertyFromCloudFormation(properties.SNSCrudPolicy) : undefined);
    ret.addPropertyResult('snsPublishMessagePolicy', 'SNSPublishMessagePolicy', properties.SNSPublishMessagePolicy != null ? CfnFunctionTopicSAMPTPropertyFromCloudFormation(properties.SNSPublishMessagePolicy) : undefined);
    ret.addPropertyResult('sqsPollerPolicy', 'SQSPollerPolicy', properties.SQSPollerPolicy != null ? CfnFunctionQueueSAMPTPropertyFromCloudFormation(properties.SQSPollerPolicy) : undefined);
    ret.addPropertyResult('sqsSendMessagePolicy', 'SQSSendMessagePolicy', properties.SQSSendMessagePolicy != null ? CfnFunctionQueueSAMPTPropertyFromCloudFormation(properties.SQSSendMessagePolicy) : undefined);
    ret.addPropertyResult('ssmParameterReadPolicy', 'SSMParameterReadPolicy', properties.SSMParameterReadPolicy != null ? CfnFunctionParameterNameSAMPTPropertyFromCloudFormation(properties.SSMParameterReadPolicy) : undefined);
    ret.addPropertyResult('stepFunctionsExecutionPolicy', 'StepFunctionsExecutionPolicy', properties.StepFunctionsExecutionPolicy != null ? CfnFunctionStateMachineSAMPTPropertyFromCloudFormation(properties.StepFunctionsExecutionPolicy) : undefined);
    ret.addPropertyResult('vpcAccessPolicy', 'VPCAccessPolicy', properties.VPCAccessPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.VPCAccessPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns
     */
    export interface SNSEventProperty {
        /**
         * `CfnFunction.SNSEventProperty.Topic`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns
         */
        readonly topic: string;
    }
}

/**
 * Determine whether the given properties match those of a `SNSEventProperty`
 *
 * @param properties - the TypeScript properties of a `SNSEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_SNSEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('topic', cdk.requiredValidator)(properties.topic));
    errors.collect(cdk.propertyValidator('topic', cdk.validateString)(properties.topic));
    return errors.wrap('supplied properties not correct for "SNSEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.SNSEvent` resource
 *
 * @param properties - the TypeScript properties of a `SNSEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.SNSEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionSNSEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_SNSEventPropertyValidator(properties).assertSuccess();
    return {
        Topic: cdk.stringToCloudFormation(properties.topic),
    };
}

// @ts-ignore TS6133
function CfnFunctionSNSEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.SNSEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.SNSEventProperty>();
    ret.addPropertyResult('topic', 'Topic', cfn_parse.FromCloudFormation.getString(properties.Topic));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
     */
    export interface SQSEventProperty {
        /**
         * `CfnFunction.SQSEventProperty.BatchSize`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
         */
        readonly batchSize?: number;
        /**
         * `CfnFunction.SQSEventProperty.Enabled`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.SQSEventProperty.Queue`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
         */
        readonly queue: string;
    }
}

/**
 * Determine whether the given properties match those of a `SQSEventProperty`
 *
 * @param properties - the TypeScript properties of a `SQSEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_SQSEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('queue', cdk.requiredValidator)(properties.queue));
    errors.collect(cdk.propertyValidator('queue', cdk.validateString)(properties.queue));
    return errors.wrap('supplied properties not correct for "SQSEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.SQSEvent` resource
 *
 * @param properties - the TypeScript properties of a `SQSEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.SQSEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionSQSEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_SQSEventPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        Queue: cdk.stringToCloudFormation(properties.queue),
    };
}

// @ts-ignore TS6133
function CfnFunctionSQSEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.SQSEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.SQSEventProperty>();
    ret.addPropertyResult('batchSize', 'BatchSize', properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('queue', 'Queue', cfn_parse.FromCloudFormation.getString(properties.Queue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
     */
    export interface ScheduleEventProperty {
        /**
         * `CfnFunction.ScheduleEventProperty.Description`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly description?: string;
        /**
         * `CfnFunction.ScheduleEventProperty.Enabled`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.ScheduleEventProperty.Input`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly input?: string;
        /**
         * `CfnFunction.ScheduleEventProperty.Name`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly name?: string;
        /**
         * `CfnFunction.ScheduleEventProperty.Schedule`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly schedule: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScheduleEventProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_ScheduleEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('input', cdk.validateString)(properties.input));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('schedule', cdk.requiredValidator)(properties.schedule));
    errors.collect(cdk.propertyValidator('schedule', cdk.validateString)(properties.schedule));
    return errors.wrap('supplied properties not correct for "ScheduleEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.ScheduleEvent` resource
 *
 * @param properties - the TypeScript properties of a `ScheduleEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.ScheduleEvent` resource.
 */
// @ts-ignore TS6133
function cfnFunctionScheduleEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_ScheduleEventPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        Input: cdk.stringToCloudFormation(properties.input),
        Name: cdk.stringToCloudFormation(properties.name),
        Schedule: cdk.stringToCloudFormation(properties.schedule),
    };
}

// @ts-ignore TS6133
function CfnFunctionScheduleEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.ScheduleEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.ScheduleEventProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('input', 'Input', properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('schedule', 'Schedule', cfn_parse.FromCloudFormation.getString(properties.Schedule));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface SecretArnSAMPTProperty {
        /**
         * `CfnFunction.SecretArnSAMPTProperty.SecretArn`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly secretArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `SecretArnSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `SecretArnSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_SecretArnSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('secretArn', cdk.requiredValidator)(properties.secretArn));
    errors.collect(cdk.propertyValidator('secretArn', cdk.validateString)(properties.secretArn));
    return errors.wrap('supplied properties not correct for "SecretArnSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.SecretArnSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `SecretArnSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.SecretArnSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionSecretArnSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_SecretArnSAMPTPropertyValidator(properties).assertSuccess();
    return {
        SecretArn: cdk.stringToCloudFormation(properties.secretArn),
    };
}

// @ts-ignore TS6133
function CfnFunctionSecretArnSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.SecretArnSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.SecretArnSAMPTProperty>();
    ret.addPropertyResult('secretArn', 'SecretArn', cfn_parse.FromCloudFormation.getString(properties.SecretArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface StateMachineSAMPTProperty {
        /**
         * `CfnFunction.StateMachineSAMPTProperty.StateMachineName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly stateMachineName: string;
    }
}

/**
 * Determine whether the given properties match those of a `StateMachineSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `StateMachineSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_StateMachineSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('stateMachineName', cdk.requiredValidator)(properties.stateMachineName));
    errors.collect(cdk.propertyValidator('stateMachineName', cdk.validateString)(properties.stateMachineName));
    return errors.wrap('supplied properties not correct for "StateMachineSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.StateMachineSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `StateMachineSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.StateMachineSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionStateMachineSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_StateMachineSAMPTPropertyValidator(properties).assertSuccess();
    return {
        StateMachineName: cdk.stringToCloudFormation(properties.stateMachineName),
    };
}

// @ts-ignore TS6133
function CfnFunctionStateMachineSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.StateMachineSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.StateMachineSAMPTProperty>();
    ret.addPropertyResult('stateMachineName', 'StateMachineName', cfn_parse.FromCloudFormation.getString(properties.StateMachineName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface StreamSAMPTProperty {
        /**
         * `CfnFunction.StreamSAMPTProperty.StreamName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly streamName: string;
    }
}

/**
 * Determine whether the given properties match those of a `StreamSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `StreamSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_StreamSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('streamName', cdk.requiredValidator)(properties.streamName));
    errors.collect(cdk.propertyValidator('streamName', cdk.validateString)(properties.streamName));
    return errors.wrap('supplied properties not correct for "StreamSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.StreamSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `StreamSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.StreamSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionStreamSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_StreamSAMPTPropertyValidator(properties).assertSuccess();
    return {
        StreamName: cdk.stringToCloudFormation(properties.streamName),
    };
}

// @ts-ignore TS6133
function CfnFunctionStreamSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.StreamSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.StreamSAMPTProperty>();
    ret.addPropertyResult('streamName', 'StreamName', cfn_parse.FromCloudFormation.getString(properties.StreamName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface TableSAMPTProperty {
        /**
         * `CfnFunction.TableSAMPTProperty.TableName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly tableName: string;
    }
}

/**
 * Determine whether the given properties match those of a `TableSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `TableSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_TableSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('tableName', cdk.requiredValidator)(properties.tableName));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    return errors.wrap('supplied properties not correct for "TableSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.TableSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `TableSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.TableSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionTableSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_TableSAMPTPropertyValidator(properties).assertSuccess();
    return {
        TableName: cdk.stringToCloudFormation(properties.tableName),
    };
}

// @ts-ignore TS6133
function CfnFunctionTableSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.TableSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.TableSAMPTProperty>();
    ret.addPropertyResult('tableName', 'TableName', cfn_parse.FromCloudFormation.getString(properties.TableName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface TableStreamSAMPTProperty {
        /**
         * `CfnFunction.TableStreamSAMPTProperty.StreamName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly streamName: string;
        /**
         * `CfnFunction.TableStreamSAMPTProperty.TableName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly tableName: string;
    }
}

/**
 * Determine whether the given properties match those of a `TableStreamSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `TableStreamSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_TableStreamSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('streamName', cdk.requiredValidator)(properties.streamName));
    errors.collect(cdk.propertyValidator('streamName', cdk.validateString)(properties.streamName));
    errors.collect(cdk.propertyValidator('tableName', cdk.requiredValidator)(properties.tableName));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    return errors.wrap('supplied properties not correct for "TableStreamSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.TableStreamSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `TableStreamSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.TableStreamSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionTableStreamSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_TableStreamSAMPTPropertyValidator(properties).assertSuccess();
    return {
        StreamName: cdk.stringToCloudFormation(properties.streamName),
        TableName: cdk.stringToCloudFormation(properties.tableName),
    };
}

// @ts-ignore TS6133
function CfnFunctionTableStreamSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.TableStreamSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.TableStreamSAMPTProperty>();
    ret.addPropertyResult('streamName', 'StreamName', cfn_parse.FromCloudFormation.getString(properties.StreamName));
    ret.addPropertyResult('tableName', 'TableName', cfn_parse.FromCloudFormation.getString(properties.TableName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface TopicSAMPTProperty {
        /**
         * `CfnFunction.TopicSAMPTProperty.TopicName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly topicName: string;
    }
}

/**
 * Determine whether the given properties match those of a `TopicSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `TopicSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_TopicSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('topicName', cdk.requiredValidator)(properties.topicName));
    errors.collect(cdk.propertyValidator('topicName', cdk.validateString)(properties.topicName));
    return errors.wrap('supplied properties not correct for "TopicSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.TopicSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `TopicSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.TopicSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnFunctionTopicSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_TopicSAMPTPropertyValidator(properties).assertSuccess();
    return {
        TopicName: cdk.stringToCloudFormation(properties.topicName),
    };
}

// @ts-ignore TS6133
function CfnFunctionTopicSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.TopicSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.TopicSAMPTProperty>();
    ret.addPropertyResult('topicName', 'TopicName', cfn_parse.FromCloudFormation.getString(properties.TopicName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
     */
    export interface VpcConfigProperty {
        /**
         * `CfnFunction.VpcConfigProperty.SecurityGroupIds`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
         */
        readonly securityGroupIds: string[];
        /**
         * `CfnFunction.VpcConfigProperty.SubnetIds`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
         */
        readonly subnetIds: string[];
    }
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_VpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.requiredValidator)(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    return errors.wrap('supplied properties not correct for "VpcConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::Function.VpcConfig` resource
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::Function.VpcConfig` resource.
 */
// @ts-ignore TS6133
function cfnFunctionVpcConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_VpcConfigPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}

// @ts-ignore TS6133
function CfnFunctionVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.VpcConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.VpcConfigProperty>();
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds));
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnHttpApi`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
 */
export interface CfnHttpApiProps {

    /**
     * `AWS::Serverless::HttpApi.AccessLogSetting`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly accessLogSetting?: CfnHttpApi.AccessLogSettingProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::HttpApi.Auth`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly auth?: CfnHttpApi.HttpApiAuthProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::HttpApi.CorsConfiguration`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly corsConfiguration?: CfnHttpApi.CorsConfigurationObjectProperty | boolean | cdk.IResolvable;

    /**
     * `AWS::Serverless::HttpApi.DefaultRouteSettings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly defaultRouteSettings?: CfnHttpApi.RouteSettingsProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::HttpApi.DefinitionBody`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly definitionBody?: any | cdk.IResolvable;

    /**
     * `AWS::Serverless::HttpApi.DefinitionUri`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly definitionUri?: CfnHttpApi.S3LocationProperty | string | cdk.IResolvable;

    /**
     * `AWS::Serverless::HttpApi.Description`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly description?: string;

    /**
     * `AWS::Serverless::HttpApi.DisableExecuteApiEndpoint`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-httpapi.html#sam-httpapi-disableexecuteapiendpoint
     */
    readonly disableExecuteApiEndpoint?: boolean | cdk.IResolvable;

    /**
     * `AWS::Serverless::HttpApi.Domain`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly domain?: CfnHttpApi.HttpApiDomainConfigurationProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::HttpApi.FailOnWarnings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly failOnWarnings?: boolean | cdk.IResolvable;

    /**
     * `AWS::Serverless::HttpApi.RouteSettings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly routeSettings?: CfnHttpApi.RouteSettingsProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::HttpApi.StageName`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly stageName?: string;

    /**
     * `AWS::Serverless::HttpApi.StageVariables`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly stageVariables?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * `AWS::Serverless::HttpApi.Tags`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnHttpApiProps`
 *
 * @param properties - the TypeScript properties of a `CfnHttpApiProps`
 *
 * @returns the result of the validation.
 */
function CfnHttpApiPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessLogSetting', CfnHttpApi_AccessLogSettingPropertyValidator)(properties.accessLogSetting));
    errors.collect(cdk.propertyValidator('auth', CfnHttpApi_HttpApiAuthPropertyValidator)(properties.auth));
    errors.collect(cdk.propertyValidator('corsConfiguration', cdk.unionValidator(CfnHttpApi_CorsConfigurationObjectPropertyValidator, cdk.validateBoolean))(properties.corsConfiguration));
    errors.collect(cdk.propertyValidator('defaultRouteSettings', CfnHttpApi_RouteSettingsPropertyValidator)(properties.defaultRouteSettings));
    errors.collect(cdk.propertyValidator('definitionBody', cdk.validateObject)(properties.definitionBody));
    errors.collect(cdk.propertyValidator('definitionUri', cdk.unionValidator(CfnHttpApi_S3LocationPropertyValidator, cdk.validateString))(properties.definitionUri));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('disableExecuteApiEndpoint', cdk.validateBoolean)(properties.disableExecuteApiEndpoint));
    errors.collect(cdk.propertyValidator('domain', CfnHttpApi_HttpApiDomainConfigurationPropertyValidator)(properties.domain));
    errors.collect(cdk.propertyValidator('failOnWarnings', cdk.validateBoolean)(properties.failOnWarnings));
    errors.collect(cdk.propertyValidator('routeSettings', CfnHttpApi_RouteSettingsPropertyValidator)(properties.routeSettings));
    errors.collect(cdk.propertyValidator('stageName', cdk.validateString)(properties.stageName));
    errors.collect(cdk.propertyValidator('stageVariables', cdk.hashValidator(cdk.validateString))(properties.stageVariables));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnHttpApiProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::HttpApi` resource
 *
 * @param properties - the TypeScript properties of a `CfnHttpApiProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::HttpApi` resource.
 */
// @ts-ignore TS6133
function cfnHttpApiPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHttpApiPropsValidator(properties).assertSuccess();
    return {
        AccessLogSetting: cfnHttpApiAccessLogSettingPropertyToCloudFormation(properties.accessLogSetting),
        Auth: cfnHttpApiHttpApiAuthPropertyToCloudFormation(properties.auth),
        CorsConfiguration: cdk.unionMapper([CfnHttpApi_CorsConfigurationObjectPropertyValidator, cdk.validateBoolean], [cfnHttpApiCorsConfigurationObjectPropertyToCloudFormation, cdk.booleanToCloudFormation])(properties.corsConfiguration),
        DefaultRouteSettings: cfnHttpApiRouteSettingsPropertyToCloudFormation(properties.defaultRouteSettings),
        DefinitionBody: cdk.objectToCloudFormation(properties.definitionBody),
        DefinitionUri: cdk.unionMapper([CfnHttpApi_S3LocationPropertyValidator, cdk.validateString], [cfnHttpApiS3LocationPropertyToCloudFormation, cdk.stringToCloudFormation])(properties.definitionUri),
        Description: cdk.stringToCloudFormation(properties.description),
        DisableExecuteApiEndpoint: cdk.booleanToCloudFormation(properties.disableExecuteApiEndpoint),
        Domain: cfnHttpApiHttpApiDomainConfigurationPropertyToCloudFormation(properties.domain),
        FailOnWarnings: cdk.booleanToCloudFormation(properties.failOnWarnings),
        RouteSettings: cfnHttpApiRouteSettingsPropertyToCloudFormation(properties.routeSettings),
        StageName: cdk.stringToCloudFormation(properties.stageName),
        StageVariables: cdk.hashMapper(cdk.stringToCloudFormation)(properties.stageVariables),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnHttpApiPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApiProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApiProps>();
    ret.addPropertyResult('accessLogSetting', 'AccessLogSetting', properties.AccessLogSetting != null ? CfnHttpApiAccessLogSettingPropertyFromCloudFormation(properties.AccessLogSetting) : undefined);
    ret.addPropertyResult('auth', 'Auth', properties.Auth != null ? CfnHttpApiHttpApiAuthPropertyFromCloudFormation(properties.Auth) : undefined);
    ret.addPropertyResult('corsConfiguration', 'CorsConfiguration', properties.CorsConfiguration != null ? cfn_parse.FromCloudFormation.getTypeUnion([CfnHttpApi_CorsConfigurationObjectPropertyValidator, cdk.validateBoolean], [CfnHttpApiCorsConfigurationObjectPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getBoolean])(properties.CorsConfiguration) : undefined);
    ret.addPropertyResult('defaultRouteSettings', 'DefaultRouteSettings', properties.DefaultRouteSettings != null ? CfnHttpApiRouteSettingsPropertyFromCloudFormation(properties.DefaultRouteSettings) : undefined);
    ret.addPropertyResult('definitionBody', 'DefinitionBody', properties.DefinitionBody != null ? cfn_parse.FromCloudFormation.getAny(properties.DefinitionBody) : undefined);
    ret.addPropertyResult('definitionUri', 'DefinitionUri', properties.DefinitionUri != null ? cfn_parse.FromCloudFormation.getTypeUnion([CfnHttpApi_S3LocationPropertyValidator, cdk.validateString], [CfnHttpApiS3LocationPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString])(properties.DefinitionUri) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('disableExecuteApiEndpoint', 'DisableExecuteApiEndpoint', properties.DisableExecuteApiEndpoint != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableExecuteApiEndpoint) : undefined);
    ret.addPropertyResult('domain', 'Domain', properties.Domain != null ? CfnHttpApiHttpApiDomainConfigurationPropertyFromCloudFormation(properties.Domain) : undefined);
    ret.addPropertyResult('failOnWarnings', 'FailOnWarnings', properties.FailOnWarnings != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FailOnWarnings) : undefined);
    ret.addPropertyResult('routeSettings', 'RouteSettings', properties.RouteSettings != null ? CfnHttpApiRouteSettingsPropertyFromCloudFormation(properties.RouteSettings) : undefined);
    ret.addPropertyResult('stageName', 'StageName', properties.StageName != null ? cfn_parse.FromCloudFormation.getString(properties.StageName) : undefined);
    ret.addPropertyResult('stageVariables', 'StageVariables', properties.StageVariables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.StageVariables) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Serverless::HttpApi`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::HttpApi
 * @stability external
 *
 * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
 */
export class CfnHttpApi extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::HttpApi";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHttpApi {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnHttpApiPropsFromCloudFormation(resourceProperties);
        const ret = new CfnHttpApi(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * `AWS::Serverless::HttpApi.AccessLogSetting`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public accessLogSetting: CfnHttpApi.AccessLogSettingProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::HttpApi.Auth`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public auth: CfnHttpApi.HttpApiAuthProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::HttpApi.CorsConfiguration`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public corsConfiguration: CfnHttpApi.CorsConfigurationObjectProperty | boolean | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::HttpApi.DefaultRouteSettings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public defaultRouteSettings: CfnHttpApi.RouteSettingsProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::HttpApi.DefinitionBody`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public definitionBody: any | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::HttpApi.DefinitionUri`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public definitionUri: CfnHttpApi.S3LocationProperty | string | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::HttpApi.Description`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public description: string | undefined;

    /**
     * `AWS::Serverless::HttpApi.DisableExecuteApiEndpoint`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-httpapi.html#sam-httpapi-disableexecuteapiendpoint
     */
    public disableExecuteApiEndpoint: boolean | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::HttpApi.Domain`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public domain: CfnHttpApi.HttpApiDomainConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::HttpApi.FailOnWarnings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public failOnWarnings: boolean | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::HttpApi.RouteSettings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public routeSettings: CfnHttpApi.RouteSettingsProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::HttpApi.StageName`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public stageName: string | undefined;

    /**
     * `AWS::Serverless::HttpApi.StageVariables`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public stageVariables: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::HttpApi.Tags`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Serverless::HttpApi`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnHttpApiProps = {}) {
        super(scope, id, { type: CfnHttpApi.CFN_RESOURCE_TYPE_NAME, properties: props });
        // Automatically add the required transform
        this.stack.addTransform(CfnHttpApi.REQUIRED_TRANSFORM);

        this.accessLogSetting = props.accessLogSetting;
        this.auth = props.auth;
        this.corsConfiguration = props.corsConfiguration;
        this.defaultRouteSettings = props.defaultRouteSettings;
        this.definitionBody = props.definitionBody;
        this.definitionUri = props.definitionUri;
        this.description = props.description;
        this.disableExecuteApiEndpoint = props.disableExecuteApiEndpoint;
        this.domain = props.domain;
        this.failOnWarnings = props.failOnWarnings;
        this.routeSettings = props.routeSettings;
        this.stageName = props.stageName;
        this.stageVariables = props.stageVariables;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::HttpApi", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnHttpApi.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            accessLogSetting: this.accessLogSetting,
            auth: this.auth,
            corsConfiguration: this.corsConfiguration,
            defaultRouteSettings: this.defaultRouteSettings,
            definitionBody: this.definitionBody,
            definitionUri: this.definitionUri,
            description: this.description,
            disableExecuteApiEndpoint: this.disableExecuteApiEndpoint,
            domain: this.domain,
            failOnWarnings: this.failOnWarnings,
            routeSettings: this.routeSettings,
            stageName: this.stageName,
            stageVariables: this.stageVariables,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnHttpApiPropsToCloudFormation(props);
    }
}

export namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html
     */
    export interface AccessLogSettingProperty {
        /**
         * `CfnHttpApi.AccessLogSettingProperty.DestinationArn`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html#cfn-apigateway-stage-accesslogsetting-destinationarn
         */
        readonly destinationArn?: string;
        /**
         * `CfnHttpApi.AccessLogSettingProperty.Format`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html#cfn-apigateway-stage-accesslogsetting-format
         */
        readonly format?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AccessLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnHttpApi_AccessLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationArn', cdk.validateString)(properties.destinationArn));
    errors.collect(cdk.propertyValidator('format', cdk.validateString)(properties.format));
    return errors.wrap('supplied properties not correct for "AccessLogSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.AccessLogSetting` resource
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.AccessLogSetting` resource.
 */
// @ts-ignore TS6133
function cfnHttpApiAccessLogSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHttpApi_AccessLogSettingPropertyValidator(properties).assertSuccess();
    return {
        DestinationArn: cdk.stringToCloudFormation(properties.destinationArn),
        Format: cdk.stringToCloudFormation(properties.format),
    };
}

// @ts-ignore TS6133
function CfnHttpApiAccessLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.AccessLogSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.AccessLogSettingProperty>();
    ret.addPropertyResult('destinationArn', 'DestinationArn', properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined);
    ret.addPropertyResult('format', 'Format', properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
     */
    export interface CorsConfigurationObjectProperty {
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.AllowCredentials`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly allowCredentials?: boolean | cdk.IResolvable;
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.AllowHeaders`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly allowHeaders?: string[];
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.AllowMethods`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly allowMethods?: string[];
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.AllowOrigins`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly allowOrigins?: string[];
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.ExposeHeaders`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly exposeHeaders?: string[];
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.MaxAge`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly maxAge?: number;
    }
}

/**
 * Determine whether the given properties match those of a `CorsConfigurationObjectProperty`
 *
 * @param properties - the TypeScript properties of a `CorsConfigurationObjectProperty`
 *
 * @returns the result of the validation.
 */
function CfnHttpApi_CorsConfigurationObjectPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowCredentials', cdk.validateBoolean)(properties.allowCredentials));
    errors.collect(cdk.propertyValidator('allowHeaders', cdk.listValidator(cdk.validateString))(properties.allowHeaders));
    errors.collect(cdk.propertyValidator('allowMethods', cdk.listValidator(cdk.validateString))(properties.allowMethods));
    errors.collect(cdk.propertyValidator('allowOrigins', cdk.listValidator(cdk.validateString))(properties.allowOrigins));
    errors.collect(cdk.propertyValidator('exposeHeaders', cdk.listValidator(cdk.validateString))(properties.exposeHeaders));
    errors.collect(cdk.propertyValidator('maxAge', cdk.validateNumber)(properties.maxAge));
    return errors.wrap('supplied properties not correct for "CorsConfigurationObjectProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.CorsConfigurationObject` resource
 *
 * @param properties - the TypeScript properties of a `CorsConfigurationObjectProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.CorsConfigurationObject` resource.
 */
// @ts-ignore TS6133
function cfnHttpApiCorsConfigurationObjectPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHttpApi_CorsConfigurationObjectPropertyValidator(properties).assertSuccess();
    return {
        AllowCredentials: cdk.booleanToCloudFormation(properties.allowCredentials),
        AllowHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowHeaders),
        AllowMethods: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowMethods),
        AllowOrigins: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowOrigins),
        ExposeHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.exposeHeaders),
        MaxAge: cdk.numberToCloudFormation(properties.maxAge),
    };
}

// @ts-ignore TS6133
function CfnHttpApiCorsConfigurationObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.CorsConfigurationObjectProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.CorsConfigurationObjectProperty>();
    ret.addPropertyResult('allowCredentials', 'AllowCredentials', properties.AllowCredentials != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCredentials) : undefined);
    ret.addPropertyResult('allowHeaders', 'AllowHeaders', properties.AllowHeaders != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowHeaders) : undefined);
    ret.addPropertyResult('allowMethods', 'AllowMethods', properties.AllowMethods != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowMethods) : undefined);
    ret.addPropertyResult('allowOrigins', 'AllowOrigins', properties.AllowOrigins != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowOrigins) : undefined);
    ret.addPropertyResult('exposeHeaders', 'ExposeHeaders', properties.ExposeHeaders != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExposeHeaders) : undefined);
    ret.addPropertyResult('maxAge', 'MaxAge', properties.MaxAge != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAge) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-httpapiauth.html
     */
    export interface HttpApiAuthProperty {
        /**
         * `CfnHttpApi.HttpApiAuthProperty.Authorizers`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-httpapiauth.html#sam-httpapi-httpapiauth-defaultauthorizer
         */
        readonly authorizers?: any | cdk.IResolvable;
        /**
         * `CfnHttpApi.HttpApiAuthProperty.DefaultAuthorizer`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-httpapiauth.html#sam-httpapi-httpapiauth-authorizers
         */
        readonly defaultAuthorizer?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpApiAuthProperty`
 *
 * @param properties - the TypeScript properties of a `HttpApiAuthProperty`
 *
 * @returns the result of the validation.
 */
function CfnHttpApi_HttpApiAuthPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authorizers', cdk.validateObject)(properties.authorizers));
    errors.collect(cdk.propertyValidator('defaultAuthorizer', cdk.validateString)(properties.defaultAuthorizer));
    return errors.wrap('supplied properties not correct for "HttpApiAuthProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.HttpApiAuth` resource
 *
 * @param properties - the TypeScript properties of a `HttpApiAuthProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.HttpApiAuth` resource.
 */
// @ts-ignore TS6133
function cfnHttpApiHttpApiAuthPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHttpApi_HttpApiAuthPropertyValidator(properties).assertSuccess();
    return {
        Authorizers: cdk.objectToCloudFormation(properties.authorizers),
        DefaultAuthorizer: cdk.stringToCloudFormation(properties.defaultAuthorizer),
    };
}

// @ts-ignore TS6133
function CfnHttpApiHttpApiAuthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.HttpApiAuthProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.HttpApiAuthProperty>();
    ret.addPropertyResult('authorizers', 'Authorizers', properties.Authorizers != null ? cfn_parse.FromCloudFormation.getAny(properties.Authorizers) : undefined);
    ret.addPropertyResult('defaultAuthorizer', 'DefaultAuthorizer', properties.DefaultAuthorizer != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthorizer) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
     */
    export interface HttpApiDomainConfigurationProperty {
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.BasePath`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly basePath?: string;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.CertificateArn`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly certificateArn: string;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.DomainName`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly domainName: string;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.EndpointConfiguration`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly endpointConfiguration?: string;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.MutualTlsAuthentication`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-httpapidomainconfiguration.html#sam-httpapi-httpapidomainconfiguration-mutualtlsauthentication
         */
        readonly mutualTlsAuthentication?: CfnHttpApi.MutualTlsAuthenticationProperty | cdk.IResolvable;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.Route53`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly route53?: CfnHttpApi.Route53ConfigurationProperty | cdk.IResolvable;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.SecurityPolicy`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly securityPolicy?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HttpApiDomainConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HttpApiDomainConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnHttpApi_HttpApiDomainConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('basePath', cdk.validateString)(properties.basePath));
    errors.collect(cdk.propertyValidator('certificateArn', cdk.requiredValidator)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('endpointConfiguration', cdk.validateString)(properties.endpointConfiguration));
    errors.collect(cdk.propertyValidator('mutualTlsAuthentication', CfnHttpApi_MutualTlsAuthenticationPropertyValidator)(properties.mutualTlsAuthentication));
    errors.collect(cdk.propertyValidator('route53', CfnHttpApi_Route53ConfigurationPropertyValidator)(properties.route53));
    errors.collect(cdk.propertyValidator('securityPolicy', cdk.validateString)(properties.securityPolicy));
    return errors.wrap('supplied properties not correct for "HttpApiDomainConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.HttpApiDomainConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `HttpApiDomainConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.HttpApiDomainConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnHttpApiHttpApiDomainConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHttpApi_HttpApiDomainConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BasePath: cdk.stringToCloudFormation(properties.basePath),
        CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        EndpointConfiguration: cdk.stringToCloudFormation(properties.endpointConfiguration),
        MutualTlsAuthentication: cfnHttpApiMutualTlsAuthenticationPropertyToCloudFormation(properties.mutualTlsAuthentication),
        Route53: cfnHttpApiRoute53ConfigurationPropertyToCloudFormation(properties.route53),
        SecurityPolicy: cdk.stringToCloudFormation(properties.securityPolicy),
    };
}

// @ts-ignore TS6133
function CfnHttpApiHttpApiDomainConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.HttpApiDomainConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.HttpApiDomainConfigurationProperty>();
    ret.addPropertyResult('basePath', 'BasePath', properties.BasePath != null ? cfn_parse.FromCloudFormation.getString(properties.BasePath) : undefined);
    ret.addPropertyResult('certificateArn', 'CertificateArn', cfn_parse.FromCloudFormation.getString(properties.CertificateArn));
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('endpointConfiguration', 'EndpointConfiguration', properties.EndpointConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointConfiguration) : undefined);
    ret.addPropertyResult('mutualTlsAuthentication', 'MutualTlsAuthentication', properties.MutualTlsAuthentication != null ? CfnHttpApiMutualTlsAuthenticationPropertyFromCloudFormation(properties.MutualTlsAuthentication) : undefined);
    ret.addPropertyResult('route53', 'Route53', properties.Route53 != null ? CfnHttpApiRoute53ConfigurationPropertyFromCloudFormation(properties.Route53) : undefined);
    ret.addPropertyResult('securityPolicy', 'SecurityPolicy', properties.SecurityPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-mutualtlsauthentication.html
     */
    export interface MutualTlsAuthenticationProperty {
        /**
         * `CfnHttpApi.MutualTlsAuthenticationProperty.TruststoreUri`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-mutualtlsauthentication.html#cfn-apigatewayv2-domainname-mutualtlsauthentication-truststoreuri
         */
        readonly truststoreUri?: string;
        /**
         * `CfnHttpApi.MutualTlsAuthenticationProperty.TruststoreVersion`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-mutualtlsauthentication.html#cfn-apigatewayv2-domainname-mutualtlsauthentication-truststoreversion
         */
        readonly truststoreVersion?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MutualTlsAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `MutualTlsAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
function CfnHttpApi_MutualTlsAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('truststoreUri', cdk.validateString)(properties.truststoreUri));
    errors.collect(cdk.propertyValidator('truststoreVersion', cdk.validateBoolean)(properties.truststoreVersion));
    return errors.wrap('supplied properties not correct for "MutualTlsAuthenticationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.MutualTlsAuthentication` resource
 *
 * @param properties - the TypeScript properties of a `MutualTlsAuthenticationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.MutualTlsAuthentication` resource.
 */
// @ts-ignore TS6133
function cfnHttpApiMutualTlsAuthenticationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHttpApi_MutualTlsAuthenticationPropertyValidator(properties).assertSuccess();
    return {
        TruststoreUri: cdk.stringToCloudFormation(properties.truststoreUri),
        TruststoreVersion: cdk.booleanToCloudFormation(properties.truststoreVersion),
    };
}

// @ts-ignore TS6133
function CfnHttpApiMutualTlsAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.MutualTlsAuthenticationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.MutualTlsAuthenticationProperty>();
    ret.addPropertyResult('truststoreUri', 'TruststoreUri', properties.TruststoreUri != null ? cfn_parse.FromCloudFormation.getString(properties.TruststoreUri) : undefined);
    ret.addPropertyResult('truststoreVersion', 'TruststoreVersion', properties.TruststoreVersion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TruststoreVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html
     */
    export interface Route53ConfigurationProperty {
        /**
         * `CfnHttpApi.Route53ConfigurationProperty.DistributedDomainName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html#sam-httpapi-route53configuration-distributiondomainname
         */
        readonly distributedDomainName?: string;
        /**
         * `CfnHttpApi.Route53ConfigurationProperty.EvaluateTargetHealth`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html#sam-httpapi-route53configuration-evaluatetargethealth
         */
        readonly evaluateTargetHealth?: boolean | cdk.IResolvable;
        /**
         * `CfnHttpApi.Route53ConfigurationProperty.HostedZoneId`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html#sam-httpapi-route53configuration-hostedzoneid
         */
        readonly hostedZoneId?: string;
        /**
         * `CfnHttpApi.Route53ConfigurationProperty.HostedZoneName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html#sam-httpapi-route53configuration-hostedzonename
         */
        readonly hostedZoneName?: string;
        /**
         * `CfnHttpApi.Route53ConfigurationProperty.IpV6`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html#sam-httpapi-route53configuration-ipv6
         */
        readonly ipV6?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `Route53ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `Route53ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnHttpApi_Route53ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('distributedDomainName', cdk.validateString)(properties.distributedDomainName));
    errors.collect(cdk.propertyValidator('evaluateTargetHealth', cdk.validateBoolean)(properties.evaluateTargetHealth));
    errors.collect(cdk.propertyValidator('hostedZoneId', cdk.validateString)(properties.hostedZoneId));
    errors.collect(cdk.propertyValidator('hostedZoneName', cdk.validateString)(properties.hostedZoneName));
    errors.collect(cdk.propertyValidator('ipV6', cdk.validateBoolean)(properties.ipV6));
    return errors.wrap('supplied properties not correct for "Route53ConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.Route53Configuration` resource
 *
 * @param properties - the TypeScript properties of a `Route53ConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.Route53Configuration` resource.
 */
// @ts-ignore TS6133
function cfnHttpApiRoute53ConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHttpApi_Route53ConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DistributedDomainName: cdk.stringToCloudFormation(properties.distributedDomainName),
        EvaluateTargetHealth: cdk.booleanToCloudFormation(properties.evaluateTargetHealth),
        HostedZoneId: cdk.stringToCloudFormation(properties.hostedZoneId),
        HostedZoneName: cdk.stringToCloudFormation(properties.hostedZoneName),
        IpV6: cdk.booleanToCloudFormation(properties.ipV6),
    };
}

// @ts-ignore TS6133
function CfnHttpApiRoute53ConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.Route53ConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.Route53ConfigurationProperty>();
    ret.addPropertyResult('distributedDomainName', 'DistributedDomainName', properties.DistributedDomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DistributedDomainName) : undefined);
    ret.addPropertyResult('evaluateTargetHealth', 'EvaluateTargetHealth', properties.EvaluateTargetHealth != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EvaluateTargetHealth) : undefined);
    ret.addPropertyResult('hostedZoneId', 'HostedZoneId', properties.HostedZoneId != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneId) : undefined);
    ret.addPropertyResult('hostedZoneName', 'HostedZoneName', properties.HostedZoneName != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneName) : undefined);
    ret.addPropertyResult('ipV6', 'IpV6', properties.IpV6 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IpV6) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html
     */
    export interface RouteSettingsProperty {
        /**
         * `CfnHttpApi.RouteSettingsProperty.DataTraceEnabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-datatraceenabled
         */
        readonly dataTraceEnabled?: boolean | cdk.IResolvable;
        /**
         * `CfnHttpApi.RouteSettingsProperty.DetailedMetricsEnabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-detailedmetricsenabled
         */
        readonly detailedMetricsEnabled?: boolean | cdk.IResolvable;
        /**
         * `CfnHttpApi.RouteSettingsProperty.LoggingLevel`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-logginglevel
         */
        readonly loggingLevel?: string;
        /**
         * `CfnHttpApi.RouteSettingsProperty.ThrottlingBurstLimit`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingburstlimit
         */
        readonly throttlingBurstLimit?: number;
        /**
         * `CfnHttpApi.RouteSettingsProperty.ThrottlingRateLimit`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingratelimit
         */
        readonly throttlingRateLimit?: number;
    }
}

/**
 * Determine whether the given properties match those of a `RouteSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnHttpApi_RouteSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataTraceEnabled', cdk.validateBoolean)(properties.dataTraceEnabled));
    errors.collect(cdk.propertyValidator('detailedMetricsEnabled', cdk.validateBoolean)(properties.detailedMetricsEnabled));
    errors.collect(cdk.propertyValidator('loggingLevel', cdk.validateString)(properties.loggingLevel));
    errors.collect(cdk.propertyValidator('throttlingBurstLimit', cdk.validateNumber)(properties.throttlingBurstLimit));
    errors.collect(cdk.propertyValidator('throttlingRateLimit', cdk.validateNumber)(properties.throttlingRateLimit));
    return errors.wrap('supplied properties not correct for "RouteSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.RouteSettings` resource
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.RouteSettings` resource.
 */
// @ts-ignore TS6133
function cfnHttpApiRouteSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHttpApi_RouteSettingsPropertyValidator(properties).assertSuccess();
    return {
        DataTraceEnabled: cdk.booleanToCloudFormation(properties.dataTraceEnabled),
        DetailedMetricsEnabled: cdk.booleanToCloudFormation(properties.detailedMetricsEnabled),
        LoggingLevel: cdk.stringToCloudFormation(properties.loggingLevel),
        ThrottlingBurstLimit: cdk.numberToCloudFormation(properties.throttlingBurstLimit),
        ThrottlingRateLimit: cdk.numberToCloudFormation(properties.throttlingRateLimit),
    };
}

// @ts-ignore TS6133
function CfnHttpApiRouteSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.RouteSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.RouteSettingsProperty>();
    ret.addPropertyResult('dataTraceEnabled', 'DataTraceEnabled', properties.DataTraceEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataTraceEnabled) : undefined);
    ret.addPropertyResult('detailedMetricsEnabled', 'DetailedMetricsEnabled', properties.DetailedMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DetailedMetricsEnabled) : undefined);
    ret.addPropertyResult('loggingLevel', 'LoggingLevel', properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined);
    ret.addPropertyResult('throttlingBurstLimit', 'ThrottlingBurstLimit', properties.ThrottlingBurstLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingBurstLimit) : undefined);
    ret.addPropertyResult('throttlingRateLimit', 'ThrottlingRateLimit', properties.ThrottlingRateLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingRateLimit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    export interface S3LocationProperty {
        /**
         * `CfnHttpApi.S3LocationProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly bucket: string;
        /**
         * `CfnHttpApi.S3LocationProperty.Key`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly key: string;
        /**
         * `CfnHttpApi.S3LocationProperty.Version`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly version: number;
    }
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnHttpApi_S3LocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('version', cdk.requiredValidator)(properties.version));
    errors.collect(cdk.propertyValidator('version', cdk.validateNumber)(properties.version));
    return errors.wrap('supplied properties not correct for "S3LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.S3Location` resource
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::HttpApi.S3Location` resource.
 */
// @ts-ignore TS6133
function cfnHttpApiS3LocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHttpApi_S3LocationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Key: cdk.stringToCloudFormation(properties.key),
        Version: cdk.numberToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnHttpApiS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.S3LocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.S3LocationProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('version', 'Version', cfn_parse.FromCloudFormation.getNumber(properties.Version));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLayerVersion`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
 */
export interface CfnLayerVersionProps {

    /**
     * `AWS::Serverless::LayerVersion.CompatibleRuntimes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly compatibleRuntimes?: string[];

    /**
     * `AWS::Serverless::LayerVersion.ContentUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly contentUri?: CfnLayerVersion.S3LocationProperty | string | cdk.IResolvable;

    /**
     * `AWS::Serverless::LayerVersion.Description`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly description?: string;

    /**
     * `AWS::Serverless::LayerVersion.LayerName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly layerName?: string;

    /**
     * `AWS::Serverless::LayerVersion.LicenseInfo`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly licenseInfo?: string;

    /**
     * `AWS::Serverless::LayerVersion.RetentionPolicy`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly retentionPolicy?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLayerVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnLayerVersionProps`
 *
 * @returns the result of the validation.
 */
function CfnLayerVersionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('compatibleRuntimes', cdk.listValidator(cdk.validateString))(properties.compatibleRuntimes));
    errors.collect(cdk.propertyValidator('contentUri', cdk.unionValidator(CfnLayerVersion_S3LocationPropertyValidator, cdk.validateString))(properties.contentUri));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('layerName', cdk.validateString)(properties.layerName));
    errors.collect(cdk.propertyValidator('licenseInfo', cdk.validateString)(properties.licenseInfo));
    errors.collect(cdk.propertyValidator('retentionPolicy', cdk.validateString)(properties.retentionPolicy));
    return errors.wrap('supplied properties not correct for "CfnLayerVersionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::LayerVersion` resource
 *
 * @param properties - the TypeScript properties of a `CfnLayerVersionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::LayerVersion` resource.
 */
// @ts-ignore TS6133
function cfnLayerVersionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayerVersionPropsValidator(properties).assertSuccess();
    return {
        CompatibleRuntimes: cdk.listMapper(cdk.stringToCloudFormation)(properties.compatibleRuntimes),
        ContentUri: cdk.unionMapper([CfnLayerVersion_S3LocationPropertyValidator, cdk.validateString], [cfnLayerVersionS3LocationPropertyToCloudFormation, cdk.stringToCloudFormation])(properties.contentUri),
        Description: cdk.stringToCloudFormation(properties.description),
        LayerName: cdk.stringToCloudFormation(properties.layerName),
        LicenseInfo: cdk.stringToCloudFormation(properties.licenseInfo),
        RetentionPolicy: cdk.stringToCloudFormation(properties.retentionPolicy),
    };
}

// @ts-ignore TS6133
function CfnLayerVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayerVersionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayerVersionProps>();
    ret.addPropertyResult('compatibleRuntimes', 'CompatibleRuntimes', properties.CompatibleRuntimes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CompatibleRuntimes) : undefined);
    ret.addPropertyResult('contentUri', 'ContentUri', properties.ContentUri != null ? cfn_parse.FromCloudFormation.getTypeUnion([CfnLayerVersion_S3LocationPropertyValidator, cdk.validateString], [CfnLayerVersionS3LocationPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString])(properties.ContentUri) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('layerName', 'LayerName', properties.LayerName != null ? cfn_parse.FromCloudFormation.getString(properties.LayerName) : undefined);
    ret.addPropertyResult('licenseInfo', 'LicenseInfo', properties.LicenseInfo != null ? cfn_parse.FromCloudFormation.getString(properties.LicenseInfo) : undefined);
    ret.addPropertyResult('retentionPolicy', 'RetentionPolicy', properties.RetentionPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.RetentionPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Serverless::LayerVersion`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::LayerVersion
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
 */
export class CfnLayerVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::LayerVersion";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLayerVersion {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLayerVersionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLayerVersion(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * `AWS::Serverless::LayerVersion.CompatibleRuntimes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    public compatibleRuntimes: string[] | undefined;

    /**
     * `AWS::Serverless::LayerVersion.ContentUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    public contentUri: CfnLayerVersion.S3LocationProperty | string | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::LayerVersion.Description`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    public description: string | undefined;

    /**
     * `AWS::Serverless::LayerVersion.LayerName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    public layerName: string | undefined;

    /**
     * `AWS::Serverless::LayerVersion.LicenseInfo`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    public licenseInfo: string | undefined;

    /**
     * `AWS::Serverless::LayerVersion.RetentionPolicy`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    public retentionPolicy: string | undefined;

    /**
     * Create a new `AWS::Serverless::LayerVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLayerVersionProps = {}) {
        super(scope, id, { type: CfnLayerVersion.CFN_RESOURCE_TYPE_NAME, properties: props });
        // Automatically add the required transform
        this.stack.addTransform(CfnLayerVersion.REQUIRED_TRANSFORM);

        this.compatibleRuntimes = props.compatibleRuntimes;
        this.contentUri = props.contentUri;
        this.description = props.description;
        this.layerName = props.layerName;
        this.licenseInfo = props.licenseInfo;
        this.retentionPolicy = props.retentionPolicy;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLayerVersion.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            compatibleRuntimes: this.compatibleRuntimes,
            contentUri: this.contentUri,
            description: this.description,
            layerName: this.layerName,
            licenseInfo: this.licenseInfo,
            retentionPolicy: this.retentionPolicy,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLayerVersionPropsToCloudFormation(props);
    }
}

export namespace CfnLayerVersion {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    export interface S3LocationProperty {
        /**
         * `CfnLayerVersion.S3LocationProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly bucket: string;
        /**
         * `CfnLayerVersion.S3LocationProperty.Key`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly key: string;
        /**
         * `CfnLayerVersion.S3LocationProperty.Version`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly version?: number;
    }
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLayerVersion_S3LocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('version', cdk.validateNumber)(properties.version));
    return errors.wrap('supplied properties not correct for "S3LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::LayerVersion.S3Location` resource
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::LayerVersion.S3Location` resource.
 */
// @ts-ignore TS6133
function cfnLayerVersionS3LocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLayerVersion_S3LocationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Key: cdk.stringToCloudFormation(properties.key),
        Version: cdk.numberToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnLayerVersionS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayerVersion.S3LocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayerVersion.S3LocationProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnSimpleTable`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
 */
export interface CfnSimpleTableProps {

    /**
     * `AWS::Serverless::SimpleTable.PrimaryKey`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
     */
    readonly primaryKey?: CfnSimpleTable.PrimaryKeyProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::SimpleTable.ProvisionedThroughput`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
     */
    readonly provisionedThroughput?: CfnSimpleTable.ProvisionedThroughputProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::SimpleTable.SSESpecification`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    readonly sseSpecification?: CfnSimpleTable.SSESpecificationProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::SimpleTable.TableName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    readonly tableName?: string;

    /**
     * `AWS::Serverless::SimpleTable.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnSimpleTableProps`
 *
 * @param properties - the TypeScript properties of a `CfnSimpleTableProps`
 *
 * @returns the result of the validation.
 */
function CfnSimpleTablePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('primaryKey', CfnSimpleTable_PrimaryKeyPropertyValidator)(properties.primaryKey));
    errors.collect(cdk.propertyValidator('provisionedThroughput', CfnSimpleTable_ProvisionedThroughputPropertyValidator)(properties.provisionedThroughput));
    errors.collect(cdk.propertyValidator('sseSpecification', CfnSimpleTable_SSESpecificationPropertyValidator)(properties.sseSpecification));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnSimpleTableProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::SimpleTable` resource
 *
 * @param properties - the TypeScript properties of a `CfnSimpleTableProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::SimpleTable` resource.
 */
// @ts-ignore TS6133
function cfnSimpleTablePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimpleTablePropsValidator(properties).assertSuccess();
    return {
        PrimaryKey: cfnSimpleTablePrimaryKeyPropertyToCloudFormation(properties.primaryKey),
        ProvisionedThroughput: cfnSimpleTableProvisionedThroughputPropertyToCloudFormation(properties.provisionedThroughput),
        SSESpecification: cfnSimpleTableSSESpecificationPropertyToCloudFormation(properties.sseSpecification),
        TableName: cdk.stringToCloudFormation(properties.tableName),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSimpleTablePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimpleTableProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleTableProps>();
    ret.addPropertyResult('primaryKey', 'PrimaryKey', properties.PrimaryKey != null ? CfnSimpleTablePrimaryKeyPropertyFromCloudFormation(properties.PrimaryKey) : undefined);
    ret.addPropertyResult('provisionedThroughput', 'ProvisionedThroughput', properties.ProvisionedThroughput != null ? CfnSimpleTableProvisionedThroughputPropertyFromCloudFormation(properties.ProvisionedThroughput) : undefined);
    ret.addPropertyResult('sseSpecification', 'SSESpecification', properties.SSESpecification != null ? CfnSimpleTableSSESpecificationPropertyFromCloudFormation(properties.SSESpecification) : undefined);
    ret.addPropertyResult('tableName', 'TableName', properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Serverless::SimpleTable`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::SimpleTable
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
 */
export class CfnSimpleTable extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::SimpleTable";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimpleTable {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSimpleTablePropsFromCloudFormation(resourceProperties);
        const ret = new CfnSimpleTable(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * `AWS::Serverless::SimpleTable.PrimaryKey`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
     */
    public primaryKey: CfnSimpleTable.PrimaryKeyProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::SimpleTable.ProvisionedThroughput`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
     */
    public provisionedThroughput: CfnSimpleTable.ProvisionedThroughputProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::SimpleTable.SSESpecification`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    public sseSpecification: CfnSimpleTable.SSESpecificationProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::SimpleTable.TableName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    public tableName: string | undefined;

    /**
     * `AWS::Serverless::SimpleTable.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Serverless::SimpleTable`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSimpleTableProps = {}) {
        super(scope, id, { type: CfnSimpleTable.CFN_RESOURCE_TYPE_NAME, properties: props });
        // Automatically add the required transform
        this.stack.addTransform(CfnSimpleTable.REQUIRED_TRANSFORM);

        this.primaryKey = props.primaryKey;
        this.provisionedThroughput = props.provisionedThroughput;
        this.sseSpecification = props.sseSpecification;
        this.tableName = props.tableName;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::SimpleTable", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSimpleTable.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            primaryKey: this.primaryKey,
            provisionedThroughput: this.provisionedThroughput,
            sseSpecification: this.sseSpecification,
            tableName: this.tableName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSimpleTablePropsToCloudFormation(props);
    }
}

export namespace CfnSimpleTable {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
     */
    export interface PrimaryKeyProperty {
        /**
         * `CfnSimpleTable.PrimaryKeyProperty.Name`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
         */
        readonly name?: string;
        /**
         * `CfnSimpleTable.PrimaryKeyProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `PrimaryKeyProperty`
 *
 * @param properties - the TypeScript properties of a `PrimaryKeyProperty`
 *
 * @returns the result of the validation.
 */
function CfnSimpleTable_PrimaryKeyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "PrimaryKeyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::SimpleTable.PrimaryKey` resource
 *
 * @param properties - the TypeScript properties of a `PrimaryKeyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::SimpleTable.PrimaryKey` resource.
 */
// @ts-ignore TS6133
function cfnSimpleTablePrimaryKeyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimpleTable_PrimaryKeyPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnSimpleTablePrimaryKeyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimpleTable.PrimaryKeyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleTable.PrimaryKeyProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSimpleTable {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
     */
    export interface ProvisionedThroughputProperty {
        /**
         * `CfnSimpleTable.ProvisionedThroughputProperty.ReadCapacityUnits`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
         */
        readonly readCapacityUnits?: number;
        /**
         * `CfnSimpleTable.ProvisionedThroughputProperty.WriteCapacityUnits`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
         */
        readonly writeCapacityUnits: number;
    }
}

/**
 * Determine whether the given properties match those of a `ProvisionedThroughputProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedThroughputProperty`
 *
 * @returns the result of the validation.
 */
function CfnSimpleTable_ProvisionedThroughputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('readCapacityUnits', cdk.validateNumber)(properties.readCapacityUnits));
    errors.collect(cdk.propertyValidator('writeCapacityUnits', cdk.requiredValidator)(properties.writeCapacityUnits));
    errors.collect(cdk.propertyValidator('writeCapacityUnits', cdk.validateNumber)(properties.writeCapacityUnits));
    return errors.wrap('supplied properties not correct for "ProvisionedThroughputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::SimpleTable.ProvisionedThroughput` resource
 *
 * @param properties - the TypeScript properties of a `ProvisionedThroughputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::SimpleTable.ProvisionedThroughput` resource.
 */
// @ts-ignore TS6133
function cfnSimpleTableProvisionedThroughputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimpleTable_ProvisionedThroughputPropertyValidator(properties).assertSuccess();
    return {
        ReadCapacityUnits: cdk.numberToCloudFormation(properties.readCapacityUnits),
        WriteCapacityUnits: cdk.numberToCloudFormation(properties.writeCapacityUnits),
    };
}

// @ts-ignore TS6133
function CfnSimpleTableProvisionedThroughputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimpleTable.ProvisionedThroughputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleTable.ProvisionedThroughputProperty>();
    ret.addPropertyResult('readCapacityUnits', 'ReadCapacityUnits', properties.ReadCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReadCapacityUnits) : undefined);
    ret.addPropertyResult('writeCapacityUnits', 'WriteCapacityUnits', cfn_parse.FromCloudFormation.getNumber(properties.WriteCapacityUnits));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSimpleTable {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
     */
    export interface SSESpecificationProperty {
        /**
         * `CfnSimpleTable.SSESpecificationProperty.SSEEnabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
         */
        readonly sseEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SSESpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnSimpleTable_SSESpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sseEnabled', cdk.validateBoolean)(properties.sseEnabled));
    return errors.wrap('supplied properties not correct for "SSESpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::SimpleTable.SSESpecification` resource
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::SimpleTable.SSESpecification` resource.
 */
// @ts-ignore TS6133
function cfnSimpleTableSSESpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSimpleTable_SSESpecificationPropertyValidator(properties).assertSuccess();
    return {
        SSEEnabled: cdk.booleanToCloudFormation(properties.sseEnabled),
    };
}

// @ts-ignore TS6133
function CfnSimpleTableSSESpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimpleTable.SSESpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleTable.SSESpecificationProperty>();
    ret.addPropertyResult('sseEnabled', 'SSEEnabled', properties.SSEEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SSEEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnStateMachine`
 *
 * @struct
 * @stability external
 *
 * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
 */
export interface CfnStateMachineProps {

    /**
     * `AWS::Serverless::StateMachine.Definition`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly definition?: any | cdk.IResolvable;

    /**
     * `AWS::Serverless::StateMachine.DefinitionSubstitutions`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly definitionSubstitutions?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * `AWS::Serverless::StateMachine.DefinitionUri`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly definitionUri?: CfnStateMachine.S3LocationProperty | string | cdk.IResolvable;

    /**
     * `AWS::Serverless::StateMachine.Events`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly events?: { [key: string]: (CfnStateMachine.EventSourceProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * `AWS::Serverless::StateMachine.Logging`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly logging?: CfnStateMachine.LoggingConfigurationProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::StateMachine.Name`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly name?: string;

    /**
     * `AWS::Serverless::StateMachine.PermissionsBoundaries`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html#sam-statemachine-permissionsboundary
     */
    readonly permissionsBoundaries?: string;

    /**
     * `AWS::Serverless::StateMachine.Policies`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly policies?: Array<CfnStateMachine.IAMPolicyDocumentProperty | CfnStateMachine.SAMPolicyTemplateProperty | string | cdk.IResolvable> | CfnStateMachine.IAMPolicyDocumentProperty | string | cdk.IResolvable;

    /**
     * `AWS::Serverless::StateMachine.Role`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly role?: string;

    /**
     * `AWS::Serverless::StateMachine.Tags`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly tags?: { [key: string]: (string) };

    /**
     * `AWS::Serverless::StateMachine.Tracing`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html#sam-statemachine-tracing
     */
    readonly tracing?: CfnStateMachine.TracingConfigurationProperty | cdk.IResolvable;

    /**
     * `AWS::Serverless::StateMachine.Type`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `CfnStateMachineProps`
 *
 * @param properties - the TypeScript properties of a `CfnStateMachineProps`
 *
 * @returns the result of the validation.
 */
function CfnStateMachinePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('definition', cdk.validateObject)(properties.definition));
    errors.collect(cdk.propertyValidator('definitionSubstitutions', cdk.hashValidator(cdk.validateString))(properties.definitionSubstitutions));
    errors.collect(cdk.propertyValidator('definitionUri', cdk.unionValidator(CfnStateMachine_S3LocationPropertyValidator, cdk.validateString))(properties.definitionUri));
    errors.collect(cdk.propertyValidator('events', cdk.hashValidator(CfnStateMachine_EventSourcePropertyValidator))(properties.events));
    errors.collect(cdk.propertyValidator('logging', CfnStateMachine_LoggingConfigurationPropertyValidator)(properties.logging));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('permissionsBoundaries', cdk.validateString)(properties.permissionsBoundaries));
    errors.collect(cdk.propertyValidator('policies', cdk.unionValidator(cdk.unionValidator(CfnStateMachine_IAMPolicyDocumentPropertyValidator, cdk.validateString), cdk.listValidator(cdk.unionValidator(CfnStateMachine_IAMPolicyDocumentPropertyValidator, CfnStateMachine_SAMPolicyTemplatePropertyValidator, cdk.validateString))))(properties.policies));
    errors.collect(cdk.propertyValidator('role', cdk.validateString)(properties.role));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('tracing', CfnStateMachine_TracingConfigurationPropertyValidator)(properties.tracing));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnStateMachineProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine` resource
 *
 * @param properties - the TypeScript properties of a `CfnStateMachineProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine` resource.
 */
// @ts-ignore TS6133
function cfnStateMachinePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachinePropsValidator(properties).assertSuccess();
    return {
        Definition: cdk.objectToCloudFormation(properties.definition),
        DefinitionSubstitutions: cdk.hashMapper(cdk.stringToCloudFormation)(properties.definitionSubstitutions),
        DefinitionUri: cdk.unionMapper([CfnStateMachine_S3LocationPropertyValidator, cdk.validateString], [cfnStateMachineS3LocationPropertyToCloudFormation, cdk.stringToCloudFormation])(properties.definitionUri),
        Events: cdk.hashMapper(cfnStateMachineEventSourcePropertyToCloudFormation)(properties.events),
        Logging: cfnStateMachineLoggingConfigurationPropertyToCloudFormation(properties.logging),
        Name: cdk.stringToCloudFormation(properties.name),
        PermissionsBoundaries: cdk.stringToCloudFormation(properties.permissionsBoundaries),
        Policies: cdk.unionMapper([cdk.unionValidator(CfnStateMachine_IAMPolicyDocumentPropertyValidator, cdk.validateString), cdk.listValidator(cdk.unionValidator(CfnStateMachine_IAMPolicyDocumentPropertyValidator, CfnStateMachine_SAMPolicyTemplatePropertyValidator, cdk.validateString))], [cdk.unionMapper([CfnStateMachine_IAMPolicyDocumentPropertyValidator, cdk.validateString], [cfnStateMachineIAMPolicyDocumentPropertyToCloudFormation, cdk.stringToCloudFormation]), cdk.listMapper(cdk.unionMapper([CfnStateMachine_IAMPolicyDocumentPropertyValidator, CfnStateMachine_SAMPolicyTemplatePropertyValidator, cdk.validateString], [cfnStateMachineIAMPolicyDocumentPropertyToCloudFormation, cfnStateMachineSAMPolicyTemplatePropertyToCloudFormation, cdk.stringToCloudFormation]))])(properties.policies),
        Role: cdk.stringToCloudFormation(properties.role),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        Tracing: cfnStateMachineTracingConfigurationPropertyToCloudFormation(properties.tracing),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnStateMachinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachineProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachineProps>();
    ret.addPropertyResult('definition', 'Definition', properties.Definition != null ? cfn_parse.FromCloudFormation.getAny(properties.Definition) : undefined);
    ret.addPropertyResult('definitionSubstitutions', 'DefinitionSubstitutions', properties.DefinitionSubstitutions != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.DefinitionSubstitutions) : undefined);
    ret.addPropertyResult('definitionUri', 'DefinitionUri', properties.DefinitionUri != null ? cfn_parse.FromCloudFormation.getTypeUnion([CfnStateMachine_S3LocationPropertyValidator, cdk.validateString], [CfnStateMachineS3LocationPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString])(properties.DefinitionUri) : undefined);
    ret.addPropertyResult('events', 'Events', properties.Events != null ? cfn_parse.FromCloudFormation.getMap(CfnStateMachineEventSourcePropertyFromCloudFormation)(properties.Events) : undefined);
    ret.addPropertyResult('logging', 'Logging', properties.Logging != null ? CfnStateMachineLoggingConfigurationPropertyFromCloudFormation(properties.Logging) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('permissionsBoundaries', 'PermissionsBoundaries', properties.PermissionsBoundaries != null ? cfn_parse.FromCloudFormation.getString(properties.PermissionsBoundaries) : undefined);
    ret.addPropertyResult('policies', 'Policies', properties.Policies != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.unionValidator(CfnStateMachine_IAMPolicyDocumentPropertyValidator, cdk.validateString), cdk.listValidator(cdk.unionValidator(CfnStateMachine_IAMPolicyDocumentPropertyValidator, CfnStateMachine_SAMPolicyTemplatePropertyValidator, cdk.validateString))], [cfn_parse.FromCloudFormation.getTypeUnion([CfnStateMachine_IAMPolicyDocumentPropertyValidator, cdk.validateString], [CfnStateMachineIAMPolicyDocumentPropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString]), cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getTypeUnion([CfnStateMachine_IAMPolicyDocumentPropertyValidator, CfnStateMachine_SAMPolicyTemplatePropertyValidator, cdk.validateString], [CfnStateMachineIAMPolicyDocumentPropertyFromCloudFormation, CfnStateMachineSAMPolicyTemplatePropertyFromCloudFormation, cfn_parse.FromCloudFormation.getString]))])(properties.Policies) : undefined);
    ret.addPropertyResult('role', 'Role', properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addPropertyResult('tracing', 'Tracing', properties.Tracing != null ? CfnStateMachineTracingConfigurationPropertyFromCloudFormation(properties.Tracing) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Serverless::StateMachine`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::StateMachine
 * @stability external
 *
 * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
 */
export class CfnStateMachine extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::StateMachine";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStateMachine {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStateMachinePropsFromCloudFormation(resourceProperties);
        const ret = new CfnStateMachine(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * `AWS::Serverless::StateMachine.Definition`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    public definition: any | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::StateMachine.DefinitionSubstitutions`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    public definitionSubstitutions: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::StateMachine.DefinitionUri`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    public definitionUri: CfnStateMachine.S3LocationProperty | string | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::StateMachine.Events`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    public events: { [key: string]: (CfnStateMachine.EventSourceProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::StateMachine.Logging`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    public logging: CfnStateMachine.LoggingConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::StateMachine.Name`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    public name: string | undefined;

    /**
     * `AWS::Serverless::StateMachine.PermissionsBoundaries`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html#sam-statemachine-permissionsboundary
     */
    public permissionsBoundaries: string | undefined;

    /**
     * `AWS::Serverless::StateMachine.Policies`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    public policies: Array<CfnStateMachine.IAMPolicyDocumentProperty | CfnStateMachine.SAMPolicyTemplateProperty | string | cdk.IResolvable> | CfnStateMachine.IAMPolicyDocumentProperty | string | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::StateMachine.Role`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    public role: string | undefined;

    /**
     * `AWS::Serverless::StateMachine.Tags`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    public readonly tags: cdk.TagManager;

    /**
     * `AWS::Serverless::StateMachine.Tracing`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html#sam-statemachine-tracing
     */
    public tracing: CfnStateMachine.TracingConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::Serverless::StateMachine.Type`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    public type: string | undefined;

    /**
     * Create a new `AWS::Serverless::StateMachine`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStateMachineProps = {}) {
        super(scope, id, { type: CfnStateMachine.CFN_RESOURCE_TYPE_NAME, properties: props });
        // Automatically add the required transform
        this.stack.addTransform(CfnStateMachine.REQUIRED_TRANSFORM);

        this.definition = props.definition;
        this.definitionSubstitutions = props.definitionSubstitutions;
        this.definitionUri = props.definitionUri;
        this.events = props.events;
        this.logging = props.logging;
        this.name = props.name;
        this.permissionsBoundaries = props.permissionsBoundaries;
        this.policies = props.policies;
        this.role = props.role;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::StateMachine", props.tags, { tagPropertyName: 'tags' });
        this.tracing = props.tracing;
        this.type = props.type;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStateMachine.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            definition: this.definition,
            definitionSubstitutions: this.definitionSubstitutions,
            definitionUri: this.definitionUri,
            events: this.events,
            logging: this.logging,
            name: this.name,
            permissionsBoundaries: this.permissionsBoundaries,
            policies: this.policies,
            role: this.role,
            tags: this.tags.renderTags(),
            tracing: this.tracing,
            type: this.type,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStateMachinePropsToCloudFormation(props);
    }
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
     */
    export interface ApiEventProperty {
        /**
         * `CfnStateMachine.ApiEventProperty.Method`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly method: string;
        /**
         * `CfnStateMachine.ApiEventProperty.Path`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly path: string;
        /**
         * `CfnStateMachine.ApiEventProperty.RestApiId`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly restApiId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ApiEventProperty`
 *
 * @param properties - the TypeScript properties of a `ApiEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_ApiEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('method', cdk.requiredValidator)(properties.method));
    errors.collect(cdk.propertyValidator('method', cdk.validateString)(properties.method));
    errors.collect(cdk.propertyValidator('path', cdk.requiredValidator)(properties.path));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    errors.collect(cdk.propertyValidator('restApiId', cdk.validateString)(properties.restApiId));
    return errors.wrap('supplied properties not correct for "ApiEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.ApiEvent` resource
 *
 * @param properties - the TypeScript properties of a `ApiEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.ApiEvent` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineApiEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_ApiEventPropertyValidator(properties).assertSuccess();
    return {
        Method: cdk.stringToCloudFormation(properties.method),
        Path: cdk.stringToCloudFormation(properties.path),
        RestApiId: cdk.stringToCloudFormation(properties.restApiId),
    };
}

// @ts-ignore TS6133
function CfnStateMachineApiEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.ApiEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.ApiEventProperty>();
    ret.addPropertyResult('method', 'Method', cfn_parse.FromCloudFormation.getString(properties.Method));
    ret.addPropertyResult('path', 'Path', cfn_parse.FromCloudFormation.getString(properties.Path));
    ret.addPropertyResult('restApiId', 'RestApiId', properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
     */
    export interface CloudWatchEventEventProperty {
        /**
         * `CfnStateMachine.CloudWatchEventEventProperty.EventBusName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly eventBusName?: string;
        /**
         * `CfnStateMachine.CloudWatchEventEventProperty.Input`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly input?: string;
        /**
         * `CfnStateMachine.CloudWatchEventEventProperty.InputPath`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly inputPath?: string;
        /**
         * `CfnStateMachine.CloudWatchEventEventProperty.Pattern`
         *
         * @link http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEventsandEventPatterns.html
         */
        readonly pattern: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchEventEventProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchEventEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_CloudWatchEventEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventBusName', cdk.validateString)(properties.eventBusName));
    errors.collect(cdk.propertyValidator('input', cdk.validateString)(properties.input));
    errors.collect(cdk.propertyValidator('inputPath', cdk.validateString)(properties.inputPath));
    errors.collect(cdk.propertyValidator('pattern', cdk.requiredValidator)(properties.pattern));
    errors.collect(cdk.propertyValidator('pattern', cdk.validateObject)(properties.pattern));
    return errors.wrap('supplied properties not correct for "CloudWatchEventEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.CloudWatchEventEvent` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchEventEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.CloudWatchEventEvent` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineCloudWatchEventEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_CloudWatchEventEventPropertyValidator(properties).assertSuccess();
    return {
        EventBusName: cdk.stringToCloudFormation(properties.eventBusName),
        Input: cdk.stringToCloudFormation(properties.input),
        InputPath: cdk.stringToCloudFormation(properties.inputPath),
        Pattern: cdk.objectToCloudFormation(properties.pattern),
    };
}

// @ts-ignore TS6133
function CfnStateMachineCloudWatchEventEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.CloudWatchEventEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.CloudWatchEventEventProperty>();
    ret.addPropertyResult('eventBusName', 'EventBusName', properties.EventBusName != null ? cfn_parse.FromCloudFormation.getString(properties.EventBusName) : undefined);
    ret.addPropertyResult('input', 'Input', properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined);
    ret.addPropertyResult('inputPath', 'InputPath', properties.InputPath != null ? cfn_parse.FromCloudFormation.getString(properties.InputPath) : undefined);
    ret.addPropertyResult('pattern', 'Pattern', cfn_parse.FromCloudFormation.getAny(properties.Pattern));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination-cloudwatchlogsloggroup.html
     */
    export interface CloudWatchLogsLogGroupProperty {
        /**
         * `CfnStateMachine.CloudWatchLogsLogGroupProperty.LogGroupArn`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination-cloudwatchlogsloggroup.html
         */
        readonly logGroupArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsLogGroupProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsLogGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_CloudWatchLogsLogGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroupArn', cdk.requiredValidator)(properties.logGroupArn));
    errors.collect(cdk.propertyValidator('logGroupArn', cdk.validateString)(properties.logGroupArn));
    return errors.wrap('supplied properties not correct for "CloudWatchLogsLogGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.CloudWatchLogsLogGroup` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsLogGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.CloudWatchLogsLogGroup` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineCloudWatchLogsLogGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_CloudWatchLogsLogGroupPropertyValidator(properties).assertSuccess();
    return {
        LogGroupArn: cdk.stringToCloudFormation(properties.logGroupArn),
    };
}

// @ts-ignore TS6133
function CfnStateMachineCloudWatchLogsLogGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.CloudWatchLogsLogGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.CloudWatchLogsLogGroupProperty>();
    ret.addPropertyResult('logGroupArn', 'LogGroupArn', cfn_parse.FromCloudFormation.getString(properties.LogGroupArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
     */
    export interface EventBridgeRuleEventProperty {
        /**
         * `CfnStateMachine.EventBridgeRuleEventProperty.EventBusName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly eventBusName?: string;
        /**
         * `CfnStateMachine.EventBridgeRuleEventProperty.Input`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly input?: string;
        /**
         * `CfnStateMachine.EventBridgeRuleEventProperty.InputPath`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly inputPath?: string;
        /**
         * `CfnStateMachine.EventBridgeRuleEventProperty.Pattern`
         *
         * @link http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEventsandEventPatterns.html
         */
        readonly pattern: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EventBridgeRuleEventProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeRuleEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_EventBridgeRuleEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventBusName', cdk.validateString)(properties.eventBusName));
    errors.collect(cdk.propertyValidator('input', cdk.validateString)(properties.input));
    errors.collect(cdk.propertyValidator('inputPath', cdk.validateString)(properties.inputPath));
    errors.collect(cdk.propertyValidator('pattern', cdk.requiredValidator)(properties.pattern));
    errors.collect(cdk.propertyValidator('pattern', cdk.validateObject)(properties.pattern));
    return errors.wrap('supplied properties not correct for "EventBridgeRuleEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.EventBridgeRuleEvent` resource
 *
 * @param properties - the TypeScript properties of a `EventBridgeRuleEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.EventBridgeRuleEvent` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineEventBridgeRuleEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_EventBridgeRuleEventPropertyValidator(properties).assertSuccess();
    return {
        EventBusName: cdk.stringToCloudFormation(properties.eventBusName),
        Input: cdk.stringToCloudFormation(properties.input),
        InputPath: cdk.stringToCloudFormation(properties.inputPath),
        Pattern: cdk.objectToCloudFormation(properties.pattern),
    };
}

// @ts-ignore TS6133
function CfnStateMachineEventBridgeRuleEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.EventBridgeRuleEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.EventBridgeRuleEventProperty>();
    ret.addPropertyResult('eventBusName', 'EventBusName', properties.EventBusName != null ? cfn_parse.FromCloudFormation.getString(properties.EventBusName) : undefined);
    ret.addPropertyResult('input', 'Input', properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined);
    ret.addPropertyResult('inputPath', 'InputPath', properties.InputPath != null ? cfn_parse.FromCloudFormation.getString(properties.InputPath) : undefined);
    ret.addPropertyResult('pattern', 'Pattern', cfn_parse.FromCloudFormation.getAny(properties.Pattern));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object
     */
    export interface EventSourceProperty {
        /**
         * `CfnStateMachine.EventSourceProperty.Properties`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-types
         */
        readonly properties: CfnStateMachine.CloudWatchEventEventProperty | CfnStateMachine.EventBridgeRuleEventProperty | CfnStateMachine.ScheduleEventProperty | CfnStateMachine.ApiEventProperty | cdk.IResolvable;
        /**
         * `CfnStateMachine.EventSourceProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `EventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `EventSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_EventSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('properties', cdk.requiredValidator)(properties.properties));
    errors.collect(cdk.propertyValidator('properties', cdk.unionValidator(CfnStateMachine_CloudWatchEventEventPropertyValidator, CfnStateMachine_EventBridgeRuleEventPropertyValidator, CfnStateMachine_ScheduleEventPropertyValidator, CfnStateMachine_ApiEventPropertyValidator))(properties.properties));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "EventSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.EventSource` resource
 *
 * @param properties - the TypeScript properties of a `EventSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.EventSource` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineEventSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_EventSourcePropertyValidator(properties).assertSuccess();
    return {
        Properties: cdk.unionMapper([CfnStateMachine_CloudWatchEventEventPropertyValidator, CfnStateMachine_EventBridgeRuleEventPropertyValidator, CfnStateMachine_ScheduleEventPropertyValidator, CfnStateMachine_ApiEventPropertyValidator], [cfnStateMachineCloudWatchEventEventPropertyToCloudFormation, cfnStateMachineEventBridgeRuleEventPropertyToCloudFormation, cfnStateMachineScheduleEventPropertyToCloudFormation, cfnStateMachineApiEventPropertyToCloudFormation])(properties.properties),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnStateMachineEventSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.EventSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.EventSourceProperty>();
    ret.addPropertyResult('properties', 'Properties', cfn_parse.FromCloudFormation.getTypeUnion([CfnStateMachine_CloudWatchEventEventPropertyValidator, CfnStateMachine_EventBridgeRuleEventPropertyValidator, CfnStateMachine_ScheduleEventPropertyValidator, CfnStateMachine_ApiEventPropertyValidator], [CfnStateMachineCloudWatchEventEventPropertyFromCloudFormation, CfnStateMachineEventBridgeRuleEventPropertyFromCloudFormation, CfnStateMachineScheduleEventPropertyFromCloudFormation, CfnStateMachineApiEventPropertyFromCloudFormation])(properties.Properties));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface FunctionSAMPTProperty {
        /**
         * `CfnStateMachine.FunctionSAMPTProperty.FunctionName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly functionName: string;
    }
}

/**
 * Determine whether the given properties match those of a `FunctionSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_FunctionSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('functionName', cdk.requiredValidator)(properties.functionName));
    errors.collect(cdk.propertyValidator('functionName', cdk.validateString)(properties.functionName));
    return errors.wrap('supplied properties not correct for "FunctionSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.FunctionSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `FunctionSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.FunctionSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineFunctionSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_FunctionSAMPTPropertyValidator(properties).assertSuccess();
    return {
        FunctionName: cdk.stringToCloudFormation(properties.functionName),
    };
}

// @ts-ignore TS6133
function CfnStateMachineFunctionSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.FunctionSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.FunctionSAMPTProperty>();
    ret.addPropertyResult('functionName', 'FunctionName', cfn_parse.FromCloudFormation.getString(properties.FunctionName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
     */
    export interface IAMPolicyDocumentProperty {
        /**
         * `CfnStateMachine.IAMPolicyDocumentProperty.Statement`
         *
         * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
         */
        readonly statement: any | cdk.IResolvable;
        /**
         * `CfnStateMachine.IAMPolicyDocumentProperty.Version`
         *
         * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
         */
        readonly version: string;
    }
}

/**
 * Determine whether the given properties match those of a `IAMPolicyDocumentProperty`
 *
 * @param properties - the TypeScript properties of a `IAMPolicyDocumentProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_IAMPolicyDocumentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('statement', cdk.requiredValidator)(properties.statement));
    errors.collect(cdk.propertyValidator('statement', cdk.validateObject)(properties.statement));
    errors.collect(cdk.propertyValidator('version', cdk.requiredValidator)(properties.version));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "IAMPolicyDocumentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.IAMPolicyDocument` resource
 *
 * @param properties - the TypeScript properties of a `IAMPolicyDocumentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.IAMPolicyDocument` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineIAMPolicyDocumentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_IAMPolicyDocumentPropertyValidator(properties).assertSuccess();
    return {
        Statement: cdk.objectToCloudFormation(properties.statement),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnStateMachineIAMPolicyDocumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.IAMPolicyDocumentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.IAMPolicyDocumentProperty>();
    ret.addPropertyResult('statement', 'Statement', cfn_parse.FromCloudFormation.getAny(properties.Statement));
    ret.addPropertyResult('version', 'Version', cfn_parse.FromCloudFormation.getString(properties.Version));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination.html#cfn-stepfunctions-statemachine-logdestination-cloudwatchlogsloggroup
     */
    export interface LogDestinationProperty {
        /**
         * `CfnStateMachine.LogDestinationProperty.CloudWatchLogsLogGroup`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination.html#cfn-stepfunctions-statemachine-logdestination-cloudwatchlogsloggroup
         */
        readonly cloudWatchLogsLogGroup: CfnStateMachine.CloudWatchLogsLogGroupProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `LogDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_LogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchLogsLogGroup', cdk.requiredValidator)(properties.cloudWatchLogsLogGroup));
    errors.collect(cdk.propertyValidator('cloudWatchLogsLogGroup', CfnStateMachine_CloudWatchLogsLogGroupPropertyValidator)(properties.cloudWatchLogsLogGroup));
    return errors.wrap('supplied properties not correct for "LogDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.LogDestination` resource
 *
 * @param properties - the TypeScript properties of a `LogDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.LogDestination` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineLogDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_LogDestinationPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchLogsLogGroup: cfnStateMachineCloudWatchLogsLogGroupPropertyToCloudFormation(properties.cloudWatchLogsLogGroup),
    };
}

// @ts-ignore TS6133
function CfnStateMachineLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.LogDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.LogDestinationProperty>();
    ret.addPropertyResult('cloudWatchLogsLogGroup', 'CloudWatchLogsLogGroup', CfnStateMachineCloudWatchLogsLogGroupPropertyFromCloudFormation(properties.CloudWatchLogsLogGroup));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html
     */
    export interface LoggingConfigurationProperty {
        /**
         * `CfnStateMachine.LoggingConfigurationProperty.Destinations`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html
         */
        readonly destinations: Array<CfnStateMachine.LogDestinationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnStateMachine.LoggingConfigurationProperty.IncludeExecutionData`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html
         */
        readonly includeExecutionData: boolean | cdk.IResolvable;
        /**
         * `CfnStateMachine.LoggingConfigurationProperty.Level`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html
         */
        readonly level: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_LoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinations', cdk.requiredValidator)(properties.destinations));
    errors.collect(cdk.propertyValidator('destinations', cdk.listValidator(CfnStateMachine_LogDestinationPropertyValidator))(properties.destinations));
    errors.collect(cdk.propertyValidator('includeExecutionData', cdk.requiredValidator)(properties.includeExecutionData));
    errors.collect(cdk.propertyValidator('includeExecutionData', cdk.validateBoolean)(properties.includeExecutionData));
    errors.collect(cdk.propertyValidator('level', cdk.requiredValidator)(properties.level));
    errors.collect(cdk.propertyValidator('level', cdk.validateString)(properties.level));
    return errors.wrap('supplied properties not correct for "LoggingConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.LoggingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.LoggingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineLoggingConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_LoggingConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Destinations: cdk.listMapper(cfnStateMachineLogDestinationPropertyToCloudFormation)(properties.destinations),
        IncludeExecutionData: cdk.booleanToCloudFormation(properties.includeExecutionData),
        Level: cdk.stringToCloudFormation(properties.level),
    };
}

// @ts-ignore TS6133
function CfnStateMachineLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.LoggingConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.LoggingConfigurationProperty>();
    ret.addPropertyResult('destinations', 'Destinations', cfn_parse.FromCloudFormation.getArray(CfnStateMachineLogDestinationPropertyFromCloudFormation)(properties.Destinations));
    ret.addPropertyResult('includeExecutionData', 'IncludeExecutionData', cfn_parse.FromCloudFormation.getBoolean(properties.IncludeExecutionData));
    ret.addPropertyResult('level', 'Level', cfn_parse.FromCloudFormation.getString(properties.Level));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    export interface S3LocationProperty {
        /**
         * `CfnStateMachine.S3LocationProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly bucket: string;
        /**
         * `CfnStateMachine.S3LocationProperty.Key`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly key: string;
        /**
         * `CfnStateMachine.S3LocationProperty.Version`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly version?: number;
    }
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_S3LocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.requiredValidator)(properties.bucket));
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('version', cdk.validateNumber)(properties.version));
    return errors.wrap('supplied properties not correct for "S3LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.S3Location` resource
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.S3Location` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineS3LocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_S3LocationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Key: cdk.stringToCloudFormation(properties.key),
        Version: cdk.numberToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnStateMachineS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.S3LocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.S3LocationProperty>();
    ret.addPropertyResult('bucket', 'Bucket', cfn_parse.FromCloudFormation.getString(properties.Bucket));
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface SAMPolicyTemplateProperty {
        /**
         * `CfnStateMachine.SAMPolicyTemplateProperty.LambdaInvokePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly lambdaInvokePolicy?: CfnStateMachine.FunctionSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnStateMachine.SAMPolicyTemplateProperty.StepFunctionsExecutionPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly stepFunctionsExecutionPolicy?: CfnStateMachine.StateMachineSAMPTProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SAMPolicyTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `SAMPolicyTemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_SAMPolicyTemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lambdaInvokePolicy', CfnStateMachine_FunctionSAMPTPropertyValidator)(properties.lambdaInvokePolicy));
    errors.collect(cdk.propertyValidator('stepFunctionsExecutionPolicy', CfnStateMachine_StateMachineSAMPTPropertyValidator)(properties.stepFunctionsExecutionPolicy));
    return errors.wrap('supplied properties not correct for "SAMPolicyTemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.SAMPolicyTemplate` resource
 *
 * @param properties - the TypeScript properties of a `SAMPolicyTemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.SAMPolicyTemplate` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineSAMPolicyTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_SAMPolicyTemplatePropertyValidator(properties).assertSuccess();
    return {
        LambdaInvokePolicy: cfnStateMachineFunctionSAMPTPropertyToCloudFormation(properties.lambdaInvokePolicy),
        StepFunctionsExecutionPolicy: cfnStateMachineStateMachineSAMPTPropertyToCloudFormation(properties.stepFunctionsExecutionPolicy),
    };
}

// @ts-ignore TS6133
function CfnStateMachineSAMPolicyTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.SAMPolicyTemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.SAMPolicyTemplateProperty>();
    ret.addPropertyResult('lambdaInvokePolicy', 'LambdaInvokePolicy', properties.LambdaInvokePolicy != null ? CfnStateMachineFunctionSAMPTPropertyFromCloudFormation(properties.LambdaInvokePolicy) : undefined);
    ret.addPropertyResult('stepFunctionsExecutionPolicy', 'StepFunctionsExecutionPolicy', properties.StepFunctionsExecutionPolicy != null ? CfnStateMachineStateMachineSAMPTPropertyFromCloudFormation(properties.StepFunctionsExecutionPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
     */
    export interface ScheduleEventProperty {
        /**
         * `CfnStateMachine.ScheduleEventProperty.Input`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly input?: string;
        /**
         * `CfnStateMachine.ScheduleEventProperty.Schedule`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly schedule: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScheduleEventProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_ScheduleEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('input', cdk.validateString)(properties.input));
    errors.collect(cdk.propertyValidator('schedule', cdk.requiredValidator)(properties.schedule));
    errors.collect(cdk.propertyValidator('schedule', cdk.validateString)(properties.schedule));
    return errors.wrap('supplied properties not correct for "ScheduleEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.ScheduleEvent` resource
 *
 * @param properties - the TypeScript properties of a `ScheduleEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.ScheduleEvent` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineScheduleEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_ScheduleEventPropertyValidator(properties).assertSuccess();
    return {
        Input: cdk.stringToCloudFormation(properties.input),
        Schedule: cdk.stringToCloudFormation(properties.schedule),
    };
}

// @ts-ignore TS6133
function CfnStateMachineScheduleEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.ScheduleEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.ScheduleEventProperty>();
    ret.addPropertyResult('input', 'Input', properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined);
    ret.addPropertyResult('schedule', 'Schedule', cfn_parse.FromCloudFormation.getString(properties.Schedule));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    export interface StateMachineSAMPTProperty {
        /**
         * `CfnStateMachine.StateMachineSAMPTProperty.StateMachineName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly stateMachineName: string;
    }
}

/**
 * Determine whether the given properties match those of a `StateMachineSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `StateMachineSAMPTProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_StateMachineSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('stateMachineName', cdk.requiredValidator)(properties.stateMachineName));
    errors.collect(cdk.propertyValidator('stateMachineName', cdk.validateString)(properties.stateMachineName));
    return errors.wrap('supplied properties not correct for "StateMachineSAMPTProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.StateMachineSAMPT` resource
 *
 * @param properties - the TypeScript properties of a `StateMachineSAMPTProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.StateMachineSAMPT` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineStateMachineSAMPTPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_StateMachineSAMPTPropertyValidator(properties).assertSuccess();
    return {
        StateMachineName: cdk.stringToCloudFormation(properties.stateMachineName),
    };
}

// @ts-ignore TS6133
function CfnStateMachineStateMachineSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.StateMachineSAMPTProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.StateMachineSAMPTProperty>();
    ret.addPropertyResult('stateMachineName', 'StateMachineName', cfn_parse.FromCloudFormation.getString(properties.StateMachineName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
     */
    export interface TracingConfigurationProperty {
        /**
         * `CfnStateMachine.TracingConfigurationProperty.Enabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tracingconfiguration.html
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TracingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TracingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_TracingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "TracingConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.TracingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `TracingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Serverless::StateMachine.TracingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineTracingConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_TracingConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnStateMachineTracingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.TracingConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.TracingConfigurationProperty>();
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
