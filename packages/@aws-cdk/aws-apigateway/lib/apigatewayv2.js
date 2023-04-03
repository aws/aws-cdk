"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnStageV2 = exports.CfnRouteResponseV2 = exports.CfnRouteV2 = exports.CfnModelV2 = exports.CfnIntegrationResponseV2 = exports.CfnIntegrationV2 = exports.CfnDomainNameV2 = exports.CfnDeploymentV2 = exports.CfnAuthorizerV2 = exports.CfnApiMappingV2 = exports.CfnApiV2 = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
// Copyright 2012-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Originally generated from the AWS CloudFormation Resource Specification. Now, hand managed.
/* eslint-disable max-len */
const cdk = require("@aws-cdk/core");
/**
 * Determine whether the given properties match those of a `CfnApiV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnApiV2Props`
 *
 * @returns the result of the validation.
 */
function CfnApiV2PropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('apiKeySelectionExpression', cdk.validateString)(properties.apiKeySelectionExpression));
    errors.collect(cdk.propertyValidator('basePath', cdk.validateString)(properties.basePath));
    errors.collect(cdk.propertyValidator('body', cdk.validateObject)(properties.body));
    errors.collect(cdk.propertyValidator('bodyS3Location', CfnApiV2_BodyS3LocationPropertyValidator)(properties.bodyS3Location));
    errors.collect(cdk.propertyValidator('corsConfiguration', CfnApiV2_CorsPropertyValidator)(properties.corsConfiguration));
    errors.collect(cdk.propertyValidator('credentialsArn', cdk.validateString)(properties.credentialsArn));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('disableSchemaValidation', cdk.validateBoolean)(properties.disableSchemaValidation));
    errors.collect(cdk.propertyValidator('failOnWarnings', cdk.validateBoolean)(properties.failOnWarnings));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('protocolType', cdk.validateString)(properties.protocolType));
    errors.collect(cdk.propertyValidator('routeKey', cdk.validateString)(properties.routeKey));
    errors.collect(cdk.propertyValidator('routeSelectionExpression', cdk.validateString)(properties.routeSelectionExpression));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('target', cdk.validateString)(properties.target));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "CfnApiV2Props"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api` resource
 *
 * @param properties - the TypeScript properties of a `CfnApiV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api` resource.
 */
// @ts-ignore TS6133
function cfnApiV2PropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnApiV2PropsValidator(properties).assertSuccess();
    return {
        ApiKeySelectionExpression: cdk.stringToCloudFormation(properties.apiKeySelectionExpression),
        BasePath: cdk.stringToCloudFormation(properties.basePath),
        Body: cdk.objectToCloudFormation(properties.body),
        BodyS3Location: cfnApiV2BodyS3LocationPropertyToCloudFormation(properties.bodyS3Location),
        CorsConfiguration: cfnApiV2CorsPropertyToCloudFormation(properties.corsConfiguration),
        CredentialsArn: cdk.stringToCloudFormation(properties.credentialsArn),
        Description: cdk.stringToCloudFormation(properties.description),
        DisableSchemaValidation: cdk.booleanToCloudFormation(properties.disableSchemaValidation),
        FailOnWarnings: cdk.booleanToCloudFormation(properties.failOnWarnings),
        Name: cdk.stringToCloudFormation(properties.name),
        ProtocolType: cdk.stringToCloudFormation(properties.protocolType),
        RouteKey: cdk.stringToCloudFormation(properties.routeKey),
        RouteSelectionExpression: cdk.stringToCloudFormation(properties.routeSelectionExpression),
        Tags: cdk.objectToCloudFormation(properties.tags),
        Target: cdk.stringToCloudFormation(properties.target),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Api`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Api
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html
 * @deprecated moved to package aws-apigatewayv2
 */
class CfnApiV2 extends cdk.CfnResource {
    /**
     * Create a new `AWS::ApiGatewayV2::Api`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props = {}) {
        super(scope, id, { type: CfnApiV2.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnApiV2", "moved to package aws-apigatewayv2");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnApiV2Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnApiV2);
            }
            throw error;
        }
        this.apiKeySelectionExpression = props.apiKeySelectionExpression;
        this.basePath = props.basePath;
        this.body = props.body;
        this.bodyS3Location = props.bodyS3Location;
        this.corsConfiguration = props.corsConfiguration;
        this.credentialsArn = props.credentialsArn;
        this.description = props.description;
        this.disableSchemaValidation = props.disableSchemaValidation;
        this.failOnWarnings = props.failOnWarnings;
        this.name = props.name;
        this.protocolType = props.protocolType;
        this.routeKey = props.routeKey;
        this.routeSelectionExpression = props.routeSelectionExpression;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, 'AWS::ApiGatewayV2::Api', props.tags, { tagPropertyName: 'tags' });
        this.target = props.target;
        this.version = props.version;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnApiV2#inspect", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inspect);
            }
            throw error;
        }
        inspector.addAttribute('aws:cdk:cloudformation:type', CfnApiV2.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
    get cfnProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnApiV2#cfnProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "cfnProperties").get);
            }
            throw error;
        }
        return {
            apiKeySelectionExpression: this.apiKeySelectionExpression,
            basePath: this.basePath,
            body: this.body,
            bodyS3Location: this.bodyS3Location,
            corsConfiguration: this.corsConfiguration,
            credentialsArn: this.credentialsArn,
            description: this.description,
            disableSchemaValidation: this.disableSchemaValidation,
            failOnWarnings: this.failOnWarnings,
            name: this.name,
            protocolType: this.protocolType,
            routeKey: this.routeKey,
            routeSelectionExpression: this.routeSelectionExpression,
            tags: this.tags.renderTags(),
            target: this.target,
            version: this.version,
        };
    }
    renderProperties(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnApiV2#renderProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderProperties);
            }
            throw error;
        }
        return cfnApiV2PropsToCloudFormation(props);
    }
}
exports.CfnApiV2 = CfnApiV2;
_a = JSII_RTTI_SYMBOL_1;
CfnApiV2[_a] = { fqn: "@aws-cdk/aws-apigateway.CfnApiV2", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnApiV2.CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Api';
/**
 * Determine whether the given properties match those of a `BodyS3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `BodyS3LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApiV2_BodyS3LocationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('etag', cdk.validateString)(properties.etag));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "BodyS3LocationProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api.BodyS3Location` resource
 *
 * @param properties - the TypeScript properties of a `BodyS3LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api.BodyS3Location` resource.
 */
// @ts-ignore TS6133
function cfnApiV2BodyS3LocationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnApiV2_BodyS3LocationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Etag: cdk.stringToCloudFormation(properties.etag),
        Key: cdk.stringToCloudFormation(properties.key),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}
/**
 * Determine whether the given properties match those of a `CorsProperty`
 *
 * @param properties - the TypeScript properties of a `CorsProperty`
 *
 * @returns the result of the validation.
 */
function CfnApiV2_CorsPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('allowCredentials', cdk.validateBoolean)(properties.allowCredentials));
    errors.collect(cdk.propertyValidator('allowHeaders', cdk.listValidator(cdk.validateString))(properties.allowHeaders));
    errors.collect(cdk.propertyValidator('allowMethods', cdk.listValidator(cdk.validateString))(properties.allowMethods));
    errors.collect(cdk.propertyValidator('allowOrigins', cdk.listValidator(cdk.validateString))(properties.allowOrigins));
    errors.collect(cdk.propertyValidator('exposeHeaders', cdk.listValidator(cdk.validateString))(properties.exposeHeaders));
    errors.collect(cdk.propertyValidator('maxAge', cdk.validateNumber)(properties.maxAge));
    return errors.wrap('supplied properties not correct for "CorsProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api.Cors` resource
 *
 * @param properties - the TypeScript properties of a `CorsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api.Cors` resource.
 */
// @ts-ignore TS6133
function cfnApiV2CorsPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnApiV2_CorsPropertyValidator(properties).assertSuccess();
    return {
        AllowCredentials: cdk.booleanToCloudFormation(properties.allowCredentials),
        AllowHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowHeaders),
        AllowMethods: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowMethods),
        AllowOrigins: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowOrigins),
        ExposeHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.exposeHeaders),
        MaxAge: cdk.numberToCloudFormation(properties.maxAge),
    };
}
/**
 * Determine whether the given properties match those of a `CfnApiMappingV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnApiMappingV2Props`
 *
 * @returns the result of the validation.
 */
function CfnApiMappingV2PropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiMappingKey', cdk.validateString)(properties.apiMappingKey));
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('stage', cdk.requiredValidator)(properties.stage));
    errors.collect(cdk.propertyValidator('stage', cdk.validateString)(properties.stage));
    return errors.wrap('supplied properties not correct for "CfnApiMappingV2Props"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::ApiMapping` resource
 *
 * @param properties - the TypeScript properties of a `CfnApiMappingV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::ApiMapping` resource.
 */
// @ts-ignore TS6133
function cfnApiMappingV2PropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnApiMappingV2PropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        Stage: cdk.stringToCloudFormation(properties.stage),
        ApiMappingKey: cdk.stringToCloudFormation(properties.apiMappingKey),
    };
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::ApiMapping`
 *
 * @cloudformationResource AWS::ApiGatewayV2::ApiMapping
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html
 * @deprecated moved to package aws-apigatewayv2
 */
class CfnApiMappingV2 extends cdk.CfnResource {
    /**
     * Create a new `AWS::ApiGatewayV2::ApiMapping`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnApiMappingV2.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnApiMappingV2", "moved to package aws-apigatewayv2");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnApiMappingV2Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnApiMappingV2);
            }
            throw error;
        }
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'domainName', this);
        cdk.requireProperty(props, 'stage', this);
        this.apiId = props.apiId;
        this.domainName = props.domainName;
        this.stage = props.stage;
        this.apiMappingKey = props.apiMappingKey;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnApiMappingV2#inspect", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inspect);
            }
            throw error;
        }
        inspector.addAttribute('aws:cdk:cloudformation:type', CfnApiMappingV2.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
    get cfnProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnApiMappingV2#cfnProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "cfnProperties").get);
            }
            throw error;
        }
        return {
            apiId: this.apiId,
            domainName: this.domainName,
            stage: this.stage,
            apiMappingKey: this.apiMappingKey,
        };
    }
    renderProperties(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnApiMappingV2#renderProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderProperties);
            }
            throw error;
        }
        return cfnApiMappingV2PropsToCloudFormation(props);
    }
}
exports.CfnApiMappingV2 = CfnApiMappingV2;
_b = JSII_RTTI_SYMBOL_1;
CfnApiMappingV2[_b] = { fqn: "@aws-cdk/aws-apigateway.CfnApiMappingV2", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnApiMappingV2.CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::ApiMapping';
/**
 * Determine whether the given properties match those of a `CfnAuthorizerV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnAuthorizerV2Props`
 *
 * @returns the result of the validation.
 */
function CfnAuthorizerV2PropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('authorizerCredentialsArn', cdk.validateString)(properties.authorizerCredentialsArn));
    errors.collect(cdk.propertyValidator('authorizerResultTtlInSeconds', cdk.validateNumber)(properties.authorizerResultTtlInSeconds));
    errors.collect(cdk.propertyValidator('authorizerType', cdk.requiredValidator)(properties.authorizerType));
    errors.collect(cdk.propertyValidator('authorizerType', cdk.validateString)(properties.authorizerType));
    errors.collect(cdk.propertyValidator('authorizerUri', cdk.validateString)(properties.authorizerUri));
    errors.collect(cdk.propertyValidator('identitySource', cdk.requiredValidator)(properties.identitySource));
    errors.collect(cdk.propertyValidator('identitySource', cdk.listValidator(cdk.validateString))(properties.identitySource));
    errors.collect(cdk.propertyValidator('identityValidationExpression', cdk.validateString)(properties.identityValidationExpression));
    errors.collect(cdk.propertyValidator('jwtConfiguration', CfnAuthorizerV2_JWTConfigurationPropertyValidator)(properties.jwtConfiguration));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "CfnAuthorizerV2Props"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Authorizer` resource
 *
 * @param properties - the TypeScript properties of a `CfnAuthorizerV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Authorizer` resource.
 */
// @ts-ignore TS6133
function cfnAuthorizerV2PropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnAuthorizerV2PropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        AuthorizerType: cdk.stringToCloudFormation(properties.authorizerType),
        IdentitySource: cdk.listMapper(cdk.stringToCloudFormation)(properties.identitySource),
        Name: cdk.stringToCloudFormation(properties.name),
        AuthorizerCredentialsArn: cdk.stringToCloudFormation(properties.authorizerCredentialsArn),
        AuthorizerResultTtlInSeconds: cdk.numberToCloudFormation(properties.authorizerResultTtlInSeconds),
        AuthorizerUri: cdk.stringToCloudFormation(properties.authorizerUri),
        IdentityValidationExpression: cdk.stringToCloudFormation(properties.identityValidationExpression),
        JwtConfiguration: cfnAuthorizerV2JWTConfigurationPropertyToCloudFormation(properties.jwtConfiguration),
    };
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Authorizer`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Authorizer
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html
 * @deprecated moved to package aws-apigatewayv2
 */
class CfnAuthorizerV2 extends cdk.CfnResource {
    /**
     * Create a new `AWS::ApiGatewayV2::Authorizer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnAuthorizerV2.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnAuthorizerV2", "moved to package aws-apigatewayv2");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnAuthorizerV2Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnAuthorizerV2);
            }
            throw error;
        }
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'authorizerType', this);
        cdk.requireProperty(props, 'identitySource', this);
        cdk.requireProperty(props, 'name', this);
        this.apiId = props.apiId;
        this.authorizerType = props.authorizerType;
        this.identitySource = props.identitySource;
        this.name = props.name;
        this.authorizerCredentialsArn = props.authorizerCredentialsArn;
        this.authorizerResultTtlInSeconds = props.authorizerResultTtlInSeconds;
        this.authorizerUri = props.authorizerUri;
        this.identityValidationExpression = props.identityValidationExpression;
        this.jwtConfiguration = props.jwtConfiguration;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnAuthorizerV2#inspect", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inspect);
            }
            throw error;
        }
        inspector.addAttribute('aws:cdk:cloudformation:type', CfnAuthorizerV2.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
    get cfnProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnAuthorizerV2#cfnProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "cfnProperties").get);
            }
            throw error;
        }
        return {
            apiId: this.apiId,
            authorizerType: this.authorizerType,
            identitySource: this.identitySource,
            name: this.name,
            authorizerCredentialsArn: this.authorizerCredentialsArn,
            authorizerResultTtlInSeconds: this.authorizerResultTtlInSeconds,
            authorizerUri: this.authorizerUri,
            identityValidationExpression: this.identityValidationExpression,
            jwtConfiguration: this.jwtConfiguration,
        };
    }
    renderProperties(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnAuthorizerV2#renderProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderProperties);
            }
            throw error;
        }
        return cfnAuthorizerV2PropsToCloudFormation(props);
    }
}
exports.CfnAuthorizerV2 = CfnAuthorizerV2;
_c = JSII_RTTI_SYMBOL_1;
CfnAuthorizerV2[_c] = { fqn: "@aws-cdk/aws-apigateway.CfnAuthorizerV2", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnAuthorizerV2.CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Authorizer';
/**
 * Determine whether the given properties match those of a `JWTConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `JWTConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAuthorizerV2_JWTConfigurationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('audience', cdk.listValidator(cdk.validateString))(properties.audience));
    errors.collect(cdk.propertyValidator('issuer', cdk.validateString)(properties.issuer));
    return errors.wrap('supplied properties not correct for "JWTConfigurationProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Authorizer.JWTConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `JWTConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Authorizer.JWTConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAuthorizerV2JWTConfigurationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnAuthorizerV2_JWTConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Audience: cdk.listMapper(cdk.stringToCloudFormation)(properties.audience),
        Issuer: cdk.stringToCloudFormation(properties.issuer),
    };
}
/**
 * Determine whether the given properties match those of a `CfnDeploymentV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentV2Props`
 *
 * @returns the result of the validation.
 */
function CfnDeploymentV2PropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('stageName', cdk.validateString)(properties.stageName));
    return errors.wrap('supplied properties not correct for "CfnDeploymentV2Props"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Deployment` resource
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Deployment` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentV2PropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnDeploymentV2PropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        Description: cdk.stringToCloudFormation(properties.description),
        StageName: cdk.stringToCloudFormation(properties.stageName),
    };
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Deployment`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Deployment
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html
 * @deprecated moved to package aws-apigatewayv2
 */
class CfnDeploymentV2 extends cdk.CfnResource {
    /**
     * Create a new `AWS::ApiGatewayV2::Deployment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnDeploymentV2.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnDeploymentV2", "moved to package aws-apigatewayv2");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnDeploymentV2Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnDeploymentV2);
            }
            throw error;
        }
        cdk.requireProperty(props, 'apiId', this);
        this.apiId = props.apiId;
        this.description = props.description;
        this.stageName = props.stageName;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnDeploymentV2#inspect", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inspect);
            }
            throw error;
        }
        inspector.addAttribute('aws:cdk:cloudformation:type', CfnDeploymentV2.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
    get cfnProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnDeploymentV2#cfnProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "cfnProperties").get);
            }
            throw error;
        }
        return {
            apiId: this.apiId,
            description: this.description,
            stageName: this.stageName,
        };
    }
    renderProperties(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnDeploymentV2#renderProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderProperties);
            }
            throw error;
        }
        return cfnDeploymentV2PropsToCloudFormation(props);
    }
}
exports.CfnDeploymentV2 = CfnDeploymentV2;
_d = JSII_RTTI_SYMBOL_1;
CfnDeploymentV2[_d] = { fqn: "@aws-cdk/aws-apigateway.CfnDeploymentV2", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnDeploymentV2.CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Deployment';
/**
 * Determine whether the given properties match those of a `CfnDomainNameV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnDomainNameV2Props`
 *
 * @returns the result of the validation.
 */
function CfnDomainNameV2PropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainNameConfigurations', cdk.listValidator(CfnDomainNameV2_DomainNameConfigurationPropertyValidator))(properties.domainNameConfigurations));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDomainNameV2Props"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::DomainName` resource
 *
 * @param properties - the TypeScript properties of a `CfnDomainNameV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::DomainName` resource.
 */
// @ts-ignore TS6133
function cfnDomainNameV2PropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnDomainNameV2PropsValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        DomainNameConfigurations: cdk.listMapper(cfnDomainNameV2DomainNameConfigurationPropertyToCloudFormation)(properties.domainNameConfigurations),
        Tags: cdk.objectToCloudFormation(properties.tags),
    };
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::DomainName`
 *
 * @cloudformationResource AWS::ApiGatewayV2::DomainName
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html
 * @deprecated moved to package aws-apigatewayv2
 */
class CfnDomainNameV2 extends cdk.CfnResource {
    /**
     * Create a new `AWS::ApiGatewayV2::DomainName`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnDomainNameV2.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnDomainNameV2", "moved to package aws-apigatewayv2");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnDomainNameV2Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnDomainNameV2);
            }
            throw error;
        }
        cdk.requireProperty(props, 'domainName', this);
        this.attrRegionalDomainName = cdk.Token.asString(this.getAtt('RegionalDomainName'));
        this.attrRegionalHostedZoneId = cdk.Token.asString(this.getAtt('RegionalHostedZoneId'));
        this.domainName = props.domainName;
        this.domainNameConfigurations = props.domainNameConfigurations;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, 'AWS::ApiGatewayV2::DomainName', props.tags, { tagPropertyName: 'tags' });
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnDomainNameV2#inspect", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inspect);
            }
            throw error;
        }
        inspector.addAttribute('aws:cdk:cloudformation:type', CfnDomainNameV2.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
    get cfnProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnDomainNameV2#cfnProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "cfnProperties").get);
            }
            throw error;
        }
        return {
            domainName: this.domainName,
            domainNameConfigurations: this.domainNameConfigurations,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnDomainNameV2#renderProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderProperties);
            }
            throw error;
        }
        return cfnDomainNameV2PropsToCloudFormation(props);
    }
}
exports.CfnDomainNameV2 = CfnDomainNameV2;
_e = JSII_RTTI_SYMBOL_1;
CfnDomainNameV2[_e] = { fqn: "@aws-cdk/aws-apigateway.CfnDomainNameV2", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnDomainNameV2.CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::DomainName';
/**
 * Determine whether the given properties match those of a `DomainNameConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DomainNameConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomainNameV2_DomainNameConfigurationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('certificateName', cdk.validateString)(properties.certificateName));
    errors.collect(cdk.propertyValidator('endpointType', cdk.validateString)(properties.endpointType));
    return errors.wrap('supplied properties not correct for "DomainNameConfigurationProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::DomainName.DomainNameConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DomainNameConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::DomainName.DomainNameConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDomainNameV2DomainNameConfigurationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnDomainNameV2_DomainNameConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
        CertificateName: cdk.stringToCloudFormation(properties.certificateName),
        EndpointType: cdk.stringToCloudFormation(properties.endpointType),
    };
}
/**
 * Determine whether the given properties match those of a `CfnIntegrationV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationV2Props`
 *
 * @returns the result of the validation.
 */
function CfnIntegrationV2PropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('connectionType', cdk.validateString)(properties.connectionType));
    errors.collect(cdk.propertyValidator('contentHandlingStrategy', cdk.validateString)(properties.contentHandlingStrategy));
    errors.collect(cdk.propertyValidator('credentialsArn', cdk.validateString)(properties.credentialsArn));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('integrationMethod', cdk.validateString)(properties.integrationMethod));
    errors.collect(cdk.propertyValidator('integrationType', cdk.requiredValidator)(properties.integrationType));
    errors.collect(cdk.propertyValidator('integrationType', cdk.validateString)(properties.integrationType));
    errors.collect(cdk.propertyValidator('integrationUri', cdk.validateString)(properties.integrationUri));
    errors.collect(cdk.propertyValidator('passthroughBehavior', cdk.validateString)(properties.passthroughBehavior));
    errors.collect(cdk.propertyValidator('payloadFormatVersion', cdk.validateString)(properties.payloadFormatVersion));
    errors.collect(cdk.propertyValidator('requestParameters', cdk.validateObject)(properties.requestParameters));
    errors.collect(cdk.propertyValidator('requestTemplates', cdk.validateObject)(properties.requestTemplates));
    errors.collect(cdk.propertyValidator('templateSelectionExpression', cdk.validateString)(properties.templateSelectionExpression));
    errors.collect(cdk.propertyValidator('timeoutInMillis', cdk.validateNumber)(properties.timeoutInMillis));
    return errors.wrap('supplied properties not correct for "CfnIntegrationV2Props"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Integration` resource
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Integration` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationV2PropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnIntegrationV2PropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        IntegrationType: cdk.stringToCloudFormation(properties.integrationType),
        ConnectionType: cdk.stringToCloudFormation(properties.connectionType),
        ContentHandlingStrategy: cdk.stringToCloudFormation(properties.contentHandlingStrategy),
        CredentialsArn: cdk.stringToCloudFormation(properties.credentialsArn),
        Description: cdk.stringToCloudFormation(properties.description),
        IntegrationMethod: cdk.stringToCloudFormation(properties.integrationMethod),
        IntegrationUri: cdk.stringToCloudFormation(properties.integrationUri),
        PassthroughBehavior: cdk.stringToCloudFormation(properties.passthroughBehavior),
        PayloadFormatVersion: cdk.stringToCloudFormation(properties.payloadFormatVersion),
        RequestParameters: cdk.objectToCloudFormation(properties.requestParameters),
        RequestTemplates: cdk.objectToCloudFormation(properties.requestTemplates),
        TemplateSelectionExpression: cdk.stringToCloudFormation(properties.templateSelectionExpression),
        TimeoutInMillis: cdk.numberToCloudFormation(properties.timeoutInMillis),
    };
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Integration`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Integration
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html
 * @deprecated moved to package aws-apigatewayv2
 */
class CfnIntegrationV2 extends cdk.CfnResource {
    /**
     * Create a new `AWS::ApiGatewayV2::Integration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnIntegrationV2.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnIntegrationV2", "moved to package aws-apigatewayv2");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnIntegrationV2Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnIntegrationV2);
            }
            throw error;
        }
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'integrationType', this);
        this.apiId = props.apiId;
        this.integrationType = props.integrationType;
        this.connectionType = props.connectionType;
        this.contentHandlingStrategy = props.contentHandlingStrategy;
        this.credentialsArn = props.credentialsArn;
        this.description = props.description;
        this.integrationMethod = props.integrationMethod;
        this.integrationUri = props.integrationUri;
        this.passthroughBehavior = props.passthroughBehavior;
        this.payloadFormatVersion = props.payloadFormatVersion;
        this.requestParameters = props.requestParameters;
        this.requestTemplates = props.requestTemplates;
        this.templateSelectionExpression = props.templateSelectionExpression;
        this.timeoutInMillis = props.timeoutInMillis;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnIntegrationV2#inspect", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inspect);
            }
            throw error;
        }
        inspector.addAttribute('aws:cdk:cloudformation:type', CfnIntegrationV2.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
    get cfnProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnIntegrationV2#cfnProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "cfnProperties").get);
            }
            throw error;
        }
        return {
            apiId: this.apiId,
            integrationType: this.integrationType,
            connectionType: this.connectionType,
            contentHandlingStrategy: this.contentHandlingStrategy,
            credentialsArn: this.credentialsArn,
            description: this.description,
            integrationMethod: this.integrationMethod,
            integrationUri: this.integrationUri,
            passthroughBehavior: this.passthroughBehavior,
            payloadFormatVersion: this.payloadFormatVersion,
            requestParameters: this.requestParameters,
            requestTemplates: this.requestTemplates,
            templateSelectionExpression: this.templateSelectionExpression,
            timeoutInMillis: this.timeoutInMillis,
        };
    }
    renderProperties(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnIntegrationV2#renderProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderProperties);
            }
            throw error;
        }
        return cfnIntegrationV2PropsToCloudFormation(props);
    }
}
exports.CfnIntegrationV2 = CfnIntegrationV2;
_f = JSII_RTTI_SYMBOL_1;
CfnIntegrationV2[_f] = { fqn: "@aws-cdk/aws-apigateway.CfnIntegrationV2", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnIntegrationV2.CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Integration';
/**
 * Determine whether the given properties match those of a `CfnIntegrationResponseV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationResponseV2Props`
 *
 * @returns the result of the validation.
 */
function CfnIntegrationResponseV2PropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('contentHandlingStrategy', cdk.validateString)(properties.contentHandlingStrategy));
    errors.collect(cdk.propertyValidator('integrationId', cdk.requiredValidator)(properties.integrationId));
    errors.collect(cdk.propertyValidator('integrationId', cdk.validateString)(properties.integrationId));
    errors.collect(cdk.propertyValidator('integrationResponseKey', cdk.requiredValidator)(properties.integrationResponseKey));
    errors.collect(cdk.propertyValidator('integrationResponseKey', cdk.validateString)(properties.integrationResponseKey));
    errors.collect(cdk.propertyValidator('responseParameters', cdk.validateObject)(properties.responseParameters));
    errors.collect(cdk.propertyValidator('responseTemplates', cdk.validateObject)(properties.responseTemplates));
    errors.collect(cdk.propertyValidator('templateSelectionExpression', cdk.validateString)(properties.templateSelectionExpression));
    return errors.wrap('supplied properties not correct for "CfnIntegrationResponseV2Props"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::IntegrationResponse` resource
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationResponseV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::IntegrationResponse` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationResponseV2PropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnIntegrationResponseV2PropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        IntegrationId: cdk.stringToCloudFormation(properties.integrationId),
        IntegrationResponseKey: cdk.stringToCloudFormation(properties.integrationResponseKey),
        ContentHandlingStrategy: cdk.stringToCloudFormation(properties.contentHandlingStrategy),
        ResponseParameters: cdk.objectToCloudFormation(properties.responseParameters),
        ResponseTemplates: cdk.objectToCloudFormation(properties.responseTemplates),
        TemplateSelectionExpression: cdk.stringToCloudFormation(properties.templateSelectionExpression),
    };
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::IntegrationResponse`
 *
 * @cloudformationResource AWS::ApiGatewayV2::IntegrationResponse
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html
 * @deprecated moved to package aws-apigatewayv2
 */
class CfnIntegrationResponseV2 extends cdk.CfnResource {
    /**
     * Create a new `AWS::ApiGatewayV2::IntegrationResponse`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnIntegrationResponseV2.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnIntegrationResponseV2", "moved to package aws-apigatewayv2");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnIntegrationResponseV2Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnIntegrationResponseV2);
            }
            throw error;
        }
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'integrationId', this);
        cdk.requireProperty(props, 'integrationResponseKey', this);
        this.apiId = props.apiId;
        this.integrationId = props.integrationId;
        this.integrationResponseKey = props.integrationResponseKey;
        this.contentHandlingStrategy = props.contentHandlingStrategy;
        this.responseParameters = props.responseParameters;
        this.responseTemplates = props.responseTemplates;
        this.templateSelectionExpression = props.templateSelectionExpression;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnIntegrationResponseV2#inspect", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inspect);
            }
            throw error;
        }
        inspector.addAttribute('aws:cdk:cloudformation:type', CfnIntegrationResponseV2.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
    get cfnProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnIntegrationResponseV2#cfnProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "cfnProperties").get);
            }
            throw error;
        }
        return {
            apiId: this.apiId,
            integrationId: this.integrationId,
            integrationResponseKey: this.integrationResponseKey,
            contentHandlingStrategy: this.contentHandlingStrategy,
            responseParameters: this.responseParameters,
            responseTemplates: this.responseTemplates,
            templateSelectionExpression: this.templateSelectionExpression,
        };
    }
    renderProperties(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnIntegrationResponseV2#renderProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderProperties);
            }
            throw error;
        }
        return cfnIntegrationResponseV2PropsToCloudFormation(props);
    }
}
exports.CfnIntegrationResponseV2 = CfnIntegrationResponseV2;
_g = JSII_RTTI_SYMBOL_1;
CfnIntegrationResponseV2[_g] = { fqn: "@aws-cdk/aws-apigateway.CfnIntegrationResponseV2", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnIntegrationResponseV2.CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::IntegrationResponse';
/**
 * Determine whether the given properties match those of a `CfnModelV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnModelV2Props`
 *
 * @returns the result of the validation.
 */
function CfnModelV2PropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('contentType', cdk.validateString)(properties.contentType));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('schema', cdk.requiredValidator)(properties.schema));
    errors.collect(cdk.propertyValidator('schema', cdk.validateObject)(properties.schema));
    return errors.wrap('supplied properties not correct for "CfnModelV2Props"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Model` resource
 *
 * @param properties - the TypeScript properties of a `CfnModelV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Model` resource.
 */
// @ts-ignore TS6133
function cfnModelV2PropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnModelV2PropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        Name: cdk.stringToCloudFormation(properties.name),
        Schema: cdk.objectToCloudFormation(properties.schema),
        ContentType: cdk.stringToCloudFormation(properties.contentType),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Model`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Model
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html
 * @deprecated moved to package aws-apigatewayv2
 */
class CfnModelV2 extends cdk.CfnResource {
    /**
     * Create a new `AWS::ApiGatewayV2::Model`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnModelV2.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnModelV2", "moved to package aws-apigatewayv2");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnModelV2Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnModelV2);
            }
            throw error;
        }
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'schema', this);
        this.apiId = props.apiId;
        this.name = props.name;
        this.schema = props.schema;
        this.contentType = props.contentType;
        this.description = props.description;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnModelV2#inspect", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inspect);
            }
            throw error;
        }
        inspector.addAttribute('aws:cdk:cloudformation:type', CfnModelV2.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
    get cfnProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnModelV2#cfnProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "cfnProperties").get);
            }
            throw error;
        }
        return {
            apiId: this.apiId,
            name: this.name,
            schema: this.schema,
            contentType: this.contentType,
            description: this.description,
        };
    }
    renderProperties(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnModelV2#renderProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderProperties);
            }
            throw error;
        }
        return cfnModelV2PropsToCloudFormation(props);
    }
}
exports.CfnModelV2 = CfnModelV2;
_h = JSII_RTTI_SYMBOL_1;
CfnModelV2[_h] = { fqn: "@aws-cdk/aws-apigateway.CfnModelV2", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnModelV2.CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Model';
/**
 * Determine whether the given properties match those of a `CfnRouteV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnRouteV2Props`
 *
 * @returns the result of the validation.
 */
function CfnRouteV2PropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiKeyRequired', cdk.validateBoolean)(properties.apiKeyRequired));
    errors.collect(cdk.propertyValidator('authorizationScopes', cdk.listValidator(cdk.validateString))(properties.authorizationScopes));
    errors.collect(cdk.propertyValidator('authorizationType', cdk.validateString)(properties.authorizationType));
    errors.collect(cdk.propertyValidator('authorizerId', cdk.validateString)(properties.authorizerId));
    errors.collect(cdk.propertyValidator('modelSelectionExpression', cdk.validateString)(properties.modelSelectionExpression));
    errors.collect(cdk.propertyValidator('operationName', cdk.validateString)(properties.operationName));
    errors.collect(cdk.propertyValidator('requestModels', cdk.validateObject)(properties.requestModels));
    errors.collect(cdk.propertyValidator('requestParameters', cdk.validateObject)(properties.requestParameters));
    errors.collect(cdk.propertyValidator('routeKey', cdk.requiredValidator)(properties.routeKey));
    errors.collect(cdk.propertyValidator('routeKey', cdk.validateString)(properties.routeKey));
    errors.collect(cdk.propertyValidator('routeResponseSelectionExpression', cdk.validateString)(properties.routeResponseSelectionExpression));
    errors.collect(cdk.propertyValidator('target', cdk.validateString)(properties.target));
    return errors.wrap('supplied properties not correct for "CfnRouteV2Props"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Route` resource
 *
 * @param properties - the TypeScript properties of a `CfnRouteV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Route` resource.
 */
// @ts-ignore TS6133
function cfnRouteV2PropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRouteV2PropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        RouteKey: cdk.stringToCloudFormation(properties.routeKey),
        ApiKeyRequired: cdk.booleanToCloudFormation(properties.apiKeyRequired),
        AuthorizationScopes: cdk.listMapper(cdk.stringToCloudFormation)(properties.authorizationScopes),
        AuthorizationType: cdk.stringToCloudFormation(properties.authorizationType),
        AuthorizerId: cdk.stringToCloudFormation(properties.authorizerId),
        ModelSelectionExpression: cdk.stringToCloudFormation(properties.modelSelectionExpression),
        OperationName: cdk.stringToCloudFormation(properties.operationName),
        RequestModels: cdk.objectToCloudFormation(properties.requestModels),
        RequestParameters: cdk.objectToCloudFormation(properties.requestParameters),
        RouteResponseSelectionExpression: cdk.stringToCloudFormation(properties.routeResponseSelectionExpression),
        Target: cdk.stringToCloudFormation(properties.target),
    };
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Route`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Route
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html
 * @deprecated moved to package aws-apigatewayv2
 */
class CfnRouteV2 extends cdk.CfnResource {
    /**
     * Create a new `AWS::ApiGatewayV2::Route`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnRouteV2.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnRouteV2", "moved to package aws-apigatewayv2");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnRouteV2Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnRouteV2);
            }
            throw error;
        }
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'routeKey', this);
        this.apiId = props.apiId;
        this.routeKey = props.routeKey;
        this.apiKeyRequired = props.apiKeyRequired;
        this.authorizationScopes = props.authorizationScopes;
        this.authorizationType = props.authorizationType;
        this.authorizerId = props.authorizerId;
        this.modelSelectionExpression = props.modelSelectionExpression;
        this.operationName = props.operationName;
        this.requestModels = props.requestModels;
        this.requestParameters = props.requestParameters;
        this.routeResponseSelectionExpression = props.routeResponseSelectionExpression;
        this.target = props.target;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnRouteV2#inspect", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inspect);
            }
            throw error;
        }
        inspector.addAttribute('aws:cdk:cloudformation:type', CfnRouteV2.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
    get cfnProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnRouteV2#cfnProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "cfnProperties").get);
            }
            throw error;
        }
        return {
            apiId: this.apiId,
            routeKey: this.routeKey,
            apiKeyRequired: this.apiKeyRequired,
            authorizationScopes: this.authorizationScopes,
            authorizationType: this.authorizationType,
            authorizerId: this.authorizerId,
            modelSelectionExpression: this.modelSelectionExpression,
            operationName: this.operationName,
            requestModels: this.requestModels,
            requestParameters: this.requestParameters,
            routeResponseSelectionExpression: this.routeResponseSelectionExpression,
            target: this.target,
        };
    }
    renderProperties(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnRouteV2#renderProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderProperties);
            }
            throw error;
        }
        return cfnRouteV2PropsToCloudFormation(props);
    }
}
exports.CfnRouteV2 = CfnRouteV2;
_j = JSII_RTTI_SYMBOL_1;
CfnRouteV2[_j] = { fqn: "@aws-cdk/aws-apigateway.CfnRouteV2", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnRouteV2.CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Route';
/**
 * Determine whether the given properties match those of a `ParameterConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterConstraintsProperty`
 *
 * @returns the result of the validation.
 */
function CfnRouteV2_ParameterConstraintsPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('required', cdk.requiredValidator)(properties.required));
    errors.collect(cdk.propertyValidator('required', cdk.validateBoolean)(properties.required));
    return errors.wrap('supplied properties not correct for "ParameterConstraintsProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Route.ParameterConstraints` resource
 *
 * @param properties - the TypeScript properties of a `ParameterConstraintsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Route.ParameterConstraints` resource.
 */
// @ts-ignore TS6133
function cfnRouteV2ParameterConstraintsPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRouteV2_ParameterConstraintsPropertyValidator(properties).assertSuccess();
    return {
        Required: cdk.booleanToCloudFormation(properties.required),
    };
}
/**
 * Determine whether the given properties match those of a `CfnRouteResponseV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnRouteResponseV2Props`
 *
 * @returns the result of the validation.
 */
function CfnRouteResponseV2PropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('modelSelectionExpression', cdk.validateString)(properties.modelSelectionExpression));
    errors.collect(cdk.propertyValidator('responseModels', cdk.validateObject)(properties.responseModels));
    errors.collect(cdk.propertyValidator('responseParameters', cdk.validateObject)(properties.responseParameters));
    errors.collect(cdk.propertyValidator('routeId', cdk.requiredValidator)(properties.routeId));
    errors.collect(cdk.propertyValidator('routeId', cdk.validateString)(properties.routeId));
    errors.collect(cdk.propertyValidator('routeResponseKey', cdk.requiredValidator)(properties.routeResponseKey));
    errors.collect(cdk.propertyValidator('routeResponseKey', cdk.validateString)(properties.routeResponseKey));
    return errors.wrap('supplied properties not correct for "CfnRouteResponseV2Props"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::RouteResponse` resource
 *
 * @param properties - the TypeScript properties of a `CfnRouteResponseV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::RouteResponse` resource.
 */
// @ts-ignore TS6133
function cfnRouteResponseV2PropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRouteResponseV2PropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        RouteId: cdk.stringToCloudFormation(properties.routeId),
        RouteResponseKey: cdk.stringToCloudFormation(properties.routeResponseKey),
        ModelSelectionExpression: cdk.stringToCloudFormation(properties.modelSelectionExpression),
        ResponseModels: cdk.objectToCloudFormation(properties.responseModels),
        ResponseParameters: cdk.objectToCloudFormation(properties.responseParameters),
    };
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::RouteResponse`
 *
 * @cloudformationResource AWS::ApiGatewayV2::RouteResponse
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html
 * @deprecated moved to package aws-apigatewayv2
 */
class CfnRouteResponseV2 extends cdk.CfnResource {
    /**
     * Create a new `AWS::ApiGatewayV2::RouteResponse`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnRouteResponseV2.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnRouteResponseV2", "moved to package aws-apigatewayv2");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnRouteResponseV2Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnRouteResponseV2);
            }
            throw error;
        }
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'routeId', this);
        cdk.requireProperty(props, 'routeResponseKey', this);
        this.apiId = props.apiId;
        this.routeId = props.routeId;
        this.routeResponseKey = props.routeResponseKey;
        this.modelSelectionExpression = props.modelSelectionExpression;
        this.responseModels = props.responseModels;
        this.responseParameters = props.responseParameters;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnRouteResponseV2#inspect", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inspect);
            }
            throw error;
        }
        inspector.addAttribute('aws:cdk:cloudformation:type', CfnRouteResponseV2.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
    get cfnProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnRouteResponseV2#cfnProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "cfnProperties").get);
            }
            throw error;
        }
        return {
            apiId: this.apiId,
            routeId: this.routeId,
            routeResponseKey: this.routeResponseKey,
            modelSelectionExpression: this.modelSelectionExpression,
            responseModels: this.responseModels,
            responseParameters: this.responseParameters,
        };
    }
    renderProperties(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnRouteResponseV2#renderProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderProperties);
            }
            throw error;
        }
        return cfnRouteResponseV2PropsToCloudFormation(props);
    }
}
exports.CfnRouteResponseV2 = CfnRouteResponseV2;
_k = JSII_RTTI_SYMBOL_1;
CfnRouteResponseV2[_k] = { fqn: "@aws-cdk/aws-apigateway.CfnRouteResponseV2", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnRouteResponseV2.CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::RouteResponse';
/**
 * Determine whether the given properties match those of a `ParameterConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterConstraintsProperty`
 *
 * @returns the result of the validation.
 */
function CfnRouteResponseV2_ParameterConstraintsPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('required', cdk.requiredValidator)(properties.required));
    errors.collect(cdk.propertyValidator('required', cdk.validateBoolean)(properties.required));
    return errors.wrap('supplied properties not correct for "ParameterConstraintsProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::RouteResponse.ParameterConstraints` resource
 *
 * @param properties - the TypeScript properties of a `ParameterConstraintsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::RouteResponse.ParameterConstraints` resource.
 */
// @ts-ignore TS6133
function cfnRouteResponseV2ParameterConstraintsPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnRouteResponseV2_ParameterConstraintsPropertyValidator(properties).assertSuccess();
    return {
        Required: cdk.booleanToCloudFormation(properties.required),
    };
}
/**
 * Determine whether the given properties match those of a `CfnStageV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnStageV2Props`
 *
 * @returns the result of the validation.
 */
function CfnStageV2PropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('accessLogSettings', CfnStageV2_AccessLogSettingsPropertyValidator)(properties.accessLogSettings));
    errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
    errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
    errors.collect(cdk.propertyValidator('autoDeploy', cdk.validateBoolean)(properties.autoDeploy));
    errors.collect(cdk.propertyValidator('clientCertificateId', cdk.validateString)(properties.clientCertificateId));
    errors.collect(cdk.propertyValidator('defaultRouteSettings', CfnStageV2_RouteSettingsPropertyValidator)(properties.defaultRouteSettings));
    errors.collect(cdk.propertyValidator('deploymentId', cdk.validateString)(properties.deploymentId));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('routeSettings', cdk.validateObject)(properties.routeSettings));
    errors.collect(cdk.propertyValidator('stageName', cdk.requiredValidator)(properties.stageName));
    errors.collect(cdk.propertyValidator('stageName', cdk.validateString)(properties.stageName));
    errors.collect(cdk.propertyValidator('stageVariables', cdk.validateObject)(properties.stageVariables));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnStageV2Props"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage` resource
 *
 * @param properties - the TypeScript properties of a `CfnStageV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage` resource.
 */
// @ts-ignore TS6133
function cfnStageV2PropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnStageV2PropsValidator(properties).assertSuccess();
    return {
        ApiId: cdk.stringToCloudFormation(properties.apiId),
        StageName: cdk.stringToCloudFormation(properties.stageName),
        AccessLogSettings: cfnStageV2AccessLogSettingsPropertyToCloudFormation(properties.accessLogSettings),
        AutoDeploy: cdk.booleanToCloudFormation(properties.autoDeploy),
        ClientCertificateId: cdk.stringToCloudFormation(properties.clientCertificateId),
        DefaultRouteSettings: cfnStageV2RouteSettingsPropertyToCloudFormation(properties.defaultRouteSettings),
        DeploymentId: cdk.stringToCloudFormation(properties.deploymentId),
        Description: cdk.stringToCloudFormation(properties.description),
        RouteSettings: cdk.objectToCloudFormation(properties.routeSettings),
        StageVariables: cdk.objectToCloudFormation(properties.stageVariables),
        Tags: cdk.objectToCloudFormation(properties.tags),
    };
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Stage`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Stage
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html
 * @deprecated moved to package aws-apigatewayv2
 */
class CfnStageV2 extends cdk.CfnResource {
    /**
     * Create a new `AWS::ApiGatewayV2::Stage`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnStageV2.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnStageV2", "moved to package aws-apigatewayv2");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnStageV2Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnStageV2);
            }
            throw error;
        }
        cdk.requireProperty(props, 'apiId', this);
        cdk.requireProperty(props, 'stageName', this);
        this.apiId = props.apiId;
        this.stageName = props.stageName;
        this.accessLogSettings = props.accessLogSettings;
        this.autoDeploy = props.autoDeploy;
        this.clientCertificateId = props.clientCertificateId;
        this.defaultRouteSettings = props.defaultRouteSettings;
        this.deploymentId = props.deploymentId;
        this.description = props.description;
        this.routeSettings = props.routeSettings;
        this.stageVariables = props.stageVariables;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, 'AWS::ApiGatewayV2::Stage', props.tags, { tagPropertyName: 'tags' });
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnStageV2#inspect", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inspect);
            }
            throw error;
        }
        inspector.addAttribute('aws:cdk:cloudformation:type', CfnStageV2.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
    get cfnProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnStageV2#cfnProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "cfnProperties").get);
            }
            throw error;
        }
        return {
            apiId: this.apiId,
            stageName: this.stageName,
            accessLogSettings: this.accessLogSettings,
            autoDeploy: this.autoDeploy,
            clientCertificateId: this.clientCertificateId,
            defaultRouteSettings: this.defaultRouteSettings,
            deploymentId: this.deploymentId,
            description: this.description,
            routeSettings: this.routeSettings,
            stageVariables: this.stageVariables,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.CfnStageV2#renderProperties", "moved to package aws-apigatewayv2");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderProperties);
            }
            throw error;
        }
        return cfnStageV2PropsToCloudFormation(props);
    }
}
exports.CfnStageV2 = CfnStageV2;
_l = JSII_RTTI_SYMBOL_1;
CfnStageV2[_l] = { fqn: "@aws-cdk/aws-apigateway.CfnStageV2", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnStageV2.CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Stage';
/**
 * Determine whether the given properties match those of a `AccessLogSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStageV2_AccessLogSettingsPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('destinationArn', cdk.validateString)(properties.destinationArn));
    errors.collect(cdk.propertyValidator('format', cdk.validateString)(properties.format));
    return errors.wrap('supplied properties not correct for "AccessLogSettingsProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage.AccessLogSettings` resource
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage.AccessLogSettings` resource.
 */
// @ts-ignore TS6133
function cfnStageV2AccessLogSettingsPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnStageV2_AccessLogSettingsPropertyValidator(properties).assertSuccess();
    return {
        DestinationArn: cdk.stringToCloudFormation(properties.destinationArn),
        Format: cdk.stringToCloudFormation(properties.format),
    };
}
/**
 * Determine whether the given properties match those of a `RouteSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStageV2_RouteSettingsPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('dataTraceEnabled', cdk.validateBoolean)(properties.dataTraceEnabled));
    errors.collect(cdk.propertyValidator('detailedMetricsEnabled', cdk.validateBoolean)(properties.detailedMetricsEnabled));
    errors.collect(cdk.propertyValidator('loggingLevel', cdk.validateString)(properties.loggingLevel));
    errors.collect(cdk.propertyValidator('throttlingBurstLimit', cdk.validateNumber)(properties.throttlingBurstLimit));
    errors.collect(cdk.propertyValidator('throttlingRateLimit', cdk.validateNumber)(properties.throttlingRateLimit));
    return errors.wrap('supplied properties not correct for "RouteSettingsProperty"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage.RouteSettings` resource
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage.RouteSettings` resource.
 */
// @ts-ignore TS6133
function cfnStageV2RouteSettingsPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnStageV2_RouteSettingsPropertyValidator(properties).assertSuccess();
    return {
        DataTraceEnabled: cdk.booleanToCloudFormation(properties.dataTraceEnabled),
        DetailedMetricsEnabled: cdk.booleanToCloudFormation(properties.detailedMetricsEnabled),
        LoggingLevel: cdk.stringToCloudFormation(properties.loggingLevel),
        ThrottlingBurstLimit: cdk.numberToCloudFormation(properties.throttlingBurstLimit),
        ThrottlingRateLimit: cdk.numberToCloudFormation(properties.throttlingRateLimit),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpZ2F0ZXdheXYyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpZ2F0ZXdheXYyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtFQUErRTtBQUMvRSw4RkFBOEY7QUFFOUYsNEJBQTRCO0FBRTVCLHFDQUFxQztBQTZHckM7Ozs7OztHQU1HO0FBQ0gsU0FBUyxzQkFBc0IsQ0FBQyxVQUFlO0lBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLDJCQUEyQixFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO0lBQzdILE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDM0YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQzdILE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixFQUFFLDhCQUE4QixDQUFDLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENB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QW1CLENBQUM7S0FDaEYsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIwIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vLyBPcmlnaW5hbGx5IGdlbmVyYXRlZCBmcm9tIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2UgU3BlY2lmaWNhdGlvbi4gTm93LCBoYW5kIG1hbmFnZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQVdTOjpBcGlHYXRld2F5VjI6OkFwaWBcbiAqXG4gKiBAc3RhYmlsaXR5IGRlcHJlY2F0ZWRcbiAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaS5odG1sXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5BcGlWMlByb3BzIHtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuQXBpS2V5U2VsZWN0aW9uRXhwcmVzc2lvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktYXBpa2V5c2VsZWN0aW9uZXhwcmVzc2lvblxuICAgKi9cbiAgcmVhZG9ubHkgYXBpS2V5U2VsZWN0aW9uRXhwcmVzc2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuQmFzZVBhdGhgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaS5odG1sI2Nmbi1hcGlnYXRld2F5djItYXBpLWJhc2VwYXRoXG4gICAqL1xuICByZWFkb25seSBiYXNlUGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuQm9keWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktYm9keVxuICAgKi9cbiAgcmVhZG9ubHkgYm9keT86IGFueSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuQm9keVMzTG9jYXRpb25gXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaS5odG1sI2Nmbi1hcGlnYXRld2F5djItYXBpLWJvZHlzM2xvY2F0aW9uXG4gICAqL1xuICByZWFkb25seSBib2R5UzNMb2NhdGlvbj86IENmbkFwaVYyLkJvZHlTM0xvY2F0aW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpLkNvcnNDb25maWd1cmF0aW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1jb3JzY29uZmlndXJhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgY29yc0NvbmZpZ3VyYXRpb24/OiBDZm5BcGlWMi5Db3JzUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpLkNyZWRlbnRpYWxzQXJuYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1jcmVkZW50aWFsc2FyblxuICAgKi9cbiAgcmVhZG9ubHkgY3JlZGVudGlhbHNBcm4/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpLkRlc2NyaXB0aW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1kZXNjcmlwdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpLkRpc2FibGVTY2hlbWFWYWxpZGF0aW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1kaXNhYmxlc2NoZW1hdmFsaWRhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgZGlzYWJsZVNjaGVtYVZhbGlkYXRpb24/OiBib29sZWFuIHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkFwaS5GYWlsT25XYXJuaW5nc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktZmFpbG9ud2FybmluZ3NcbiAgICovXG4gIHJlYWRvbmx5IGZhaWxPbldhcm5pbmdzPzogYm9vbGVhbiB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuTmFtZWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuUHJvdG9jb2xUeXBlYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1wcm90b2NvbHR5cGVcbiAgICovXG4gIHJlYWRvbmx5IHByb3RvY29sVHlwZT86IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuUm91dGVLZXlgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaS5odG1sI2Nmbi1hcGlnYXRld2F5djItYXBpLXJvdXRla2V5XG4gICAqL1xuICByZWFkb25seSByb3V0ZUtleT86IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuUm91dGVTZWxlY3Rpb25FeHByZXNzaW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1yb3V0ZXNlbGVjdGlvbmV4cHJlc3Npb25cbiAgICovXG4gIHJlYWRvbmx5IHJvdXRlU2VsZWN0aW9uRXhwcmVzc2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuVGFnc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktdGFnc1xuICAgKi9cbiAgcmVhZG9ubHkgdGFncz86IGFueTtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuVGFyZ2V0YFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS10YXJnZXRcbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldD86IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuVmVyc2lvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktdmVyc2lvblxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5BcGlWMlByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5BcGlWMlByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkFwaVYyUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhcGlLZXlTZWxlY3Rpb25FeHByZXNzaW9uJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmFwaUtleVNlbGVjdGlvbkV4cHJlc3Npb24pKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdiYXNlUGF0aCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5iYXNlUGF0aCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2JvZHknLCBjZGsudmFsaWRhdGVPYmplY3QpKHByb3BlcnRpZXMuYm9keSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2JvZHlTM0xvY2F0aW9uJywgQ2ZuQXBpVjJfQm9keVMzTG9jYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5ib2R5UzNMb2NhdGlvbikpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2NvcnNDb25maWd1cmF0aW9uJywgQ2ZuQXBpVjJfQ29yc1Byb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmNvcnNDb25maWd1cmF0aW9uKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY3JlZGVudGlhbHNBcm4nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuY3JlZGVudGlhbHNBcm4pKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZXNjcmlwdGlvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kZXNjcmlwdGlvbikpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Rpc2FibGVTY2hlbWFWYWxpZGF0aW9uJywgY2RrLnZhbGlkYXRlQm9vbGVhbikocHJvcGVydGllcy5kaXNhYmxlU2NoZW1hVmFsaWRhdGlvbikpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ZhaWxPbldhcm5pbmdzJywgY2RrLnZhbGlkYXRlQm9vbGVhbikocHJvcGVydGllcy5mYWlsT25XYXJuaW5ncykpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubmFtZSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Byb3RvY29sVHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5wcm90b2NvbFR5cGUpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyb3V0ZUtleScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5yb3V0ZUtleSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JvdXRlU2VsZWN0aW9uRXhwcmVzc2lvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5yb3V0ZVNlbGVjdGlvbkV4cHJlc3Npb24pKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLnZhbGlkYXRlT2JqZWN0KShwcm9wZXJ0aWVzLnRhZ3MpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YXJnZXQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudGFyZ2V0KSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmVyc2lvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy52ZXJzaW9uKSk7XG4gIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5BcGlWMlByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OkFwaWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQXBpVjJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGlgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQXBpVjJQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICBDZm5BcGlWMlByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgcmV0dXJuIHtcbiAgICBBcGlLZXlTZWxlY3Rpb25FeHByZXNzaW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmFwaUtleVNlbGVjdGlvbkV4cHJlc3Npb24pLFxuICAgIEJhc2VQYXRoOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmJhc2VQYXRoKSxcbiAgICBCb2R5OiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmJvZHkpLFxuICAgIEJvZHlTM0xvY2F0aW9uOiBjZm5BcGlWMkJvZHlTM0xvY2F0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYm9keVMzTG9jYXRpb24pLFxuICAgIENvcnNDb25maWd1cmF0aW9uOiBjZm5BcGlWMkNvcnNQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5jb3JzQ29uZmlndXJhdGlvbiksXG4gICAgQ3JlZGVudGlhbHNBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuY3JlZGVudGlhbHNBcm4pLFxuICAgIERlc2NyaXB0aW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRlc2NyaXB0aW9uKSxcbiAgICBEaXNhYmxlU2NoZW1hVmFsaWRhdGlvbjogY2RrLmJvb2xlYW5Ub0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGlzYWJsZVNjaGVtYVZhbGlkYXRpb24pLFxuICAgIEZhaWxPbldhcm5pbmdzOiBjZGsuYm9vbGVhblRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5mYWlsT25XYXJuaW5ncyksXG4gICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICBQcm90b2NvbFR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucHJvdG9jb2xUeXBlKSxcbiAgICBSb3V0ZUtleTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yb3V0ZUtleSksXG4gICAgUm91dGVTZWxlY3Rpb25FeHByZXNzaW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJvdXRlU2VsZWN0aW9uRXhwcmVzc2lvbiksXG4gICAgVGFnczogY2RrLm9iamVjdFRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50YWdzKSxcbiAgICBUYXJnZXQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudGFyZ2V0KSxcbiAgICBWZXJzaW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnZlcnNpb24pLFxuICB9O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGlgXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpBcGlHYXRld2F5VjI6OkFwaVxuICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbFxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5BcGlWMiBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAvKipcbiAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9ICdBV1M6OkFwaUdhdGV3YXlWMjo6QXBpJztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuQXBpS2V5U2VsZWN0aW9uRXhwcmVzc2lvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktYXBpa2V5c2VsZWN0aW9uZXhwcmVzc2lvblxuICAgKi9cbiAgcHVibGljIGFwaUtleVNlbGVjdGlvbkV4cHJlc3Npb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuQmFzZVBhdGhgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaS5odG1sI2Nmbi1hcGlnYXRld2F5djItYXBpLWJhc2VwYXRoXG4gICAqL1xuICBwdWJsaWMgYmFzZVBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuQm9keWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktYm9keVxuICAgKi9cbiAgcHVibGljIGJvZHk6IGFueSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuQm9keVMzTG9jYXRpb25gXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaS5odG1sI2Nmbi1hcGlnYXRld2F5djItYXBpLWJvZHlzM2xvY2F0aW9uXG4gICAqL1xuICBwdWJsaWMgYm9keVMzTG9jYXRpb246IENmbkFwaVYyLkJvZHlTM0xvY2F0aW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpLkNvcnNDb25maWd1cmF0aW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1jb3JzY29uZmlndXJhdGlvblxuICAgKi9cbiAgcHVibGljIGNvcnNDb25maWd1cmF0aW9uOiBDZm5BcGlWMi5Db3JzUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpLkNyZWRlbnRpYWxzQXJuYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1jcmVkZW50aWFsc2FyblxuICAgKi9cbiAgcHVibGljIGNyZWRlbnRpYWxzQXJuOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpLkRlc2NyaXB0aW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1kZXNjcmlwdGlvblxuICAgKi9cbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpLkRpc2FibGVTY2hlbWFWYWxpZGF0aW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1kaXNhYmxlc2NoZW1hdmFsaWRhdGlvblxuICAgKi9cbiAgcHVibGljIGRpc2FibGVTY2hlbWFWYWxpZGF0aW9uOiBib29sZWFuIHwgY2RrLklSZXNvbHZhYmxlIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkFwaS5GYWlsT25XYXJuaW5nc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktZmFpbG9ud2FybmluZ3NcbiAgICovXG4gIHB1YmxpYyBmYWlsT25XYXJuaW5nczogYm9vbGVhbiB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuTmFtZWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktbmFtZVxuICAgKi9cbiAgcHVibGljIG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuUHJvdG9jb2xUeXBlYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1wcm90b2NvbHR5cGVcbiAgICovXG4gIHB1YmxpYyBwcm90b2NvbFR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuUm91dGVLZXlgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaS5odG1sI2Nmbi1hcGlnYXRld2F5djItYXBpLXJvdXRla2V5XG4gICAqL1xuICBwdWJsaWMgcm91dGVLZXk6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuUm91dGVTZWxlY3Rpb25FeHByZXNzaW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1yb3V0ZXNlbGVjdGlvbmV4cHJlc3Npb25cbiAgICovXG4gIHB1YmxpYyByb3V0ZVNlbGVjdGlvbkV4cHJlc3Npb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuVGFnc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktdGFnc1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRhZ3M6IGNkay5UYWdNYW5hZ2VyO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkFwaS5UYXJnZXRgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaS5odG1sI2Nmbi1hcGlnYXRld2F5djItYXBpLXRhcmdldFxuICAgKi9cbiAgcHVibGljIHRhcmdldDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkFwaS5WZXJzaW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGkuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS12ZXJzaW9uXG4gICAqL1xuICBwdWJsaWMgdmVyc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGlgLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuQXBpVjJQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkFwaVYyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuXG4gICAgdGhpcy5hcGlLZXlTZWxlY3Rpb25FeHByZXNzaW9uID0gcHJvcHMuYXBpS2V5U2VsZWN0aW9uRXhwcmVzc2lvbjtcbiAgICB0aGlzLmJhc2VQYXRoID0gcHJvcHMuYmFzZVBhdGg7XG4gICAgdGhpcy5ib2R5ID0gcHJvcHMuYm9keTtcbiAgICB0aGlzLmJvZHlTM0xvY2F0aW9uID0gcHJvcHMuYm9keVMzTG9jYXRpb247XG4gICAgdGhpcy5jb3JzQ29uZmlndXJhdGlvbiA9IHByb3BzLmNvcnNDb25maWd1cmF0aW9uO1xuICAgIHRoaXMuY3JlZGVudGlhbHNBcm4gPSBwcm9wcy5jcmVkZW50aWFsc0FybjtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gcHJvcHMuZGVzY3JpcHRpb247XG4gICAgdGhpcy5kaXNhYmxlU2NoZW1hVmFsaWRhdGlvbiA9IHByb3BzLmRpc2FibGVTY2hlbWFWYWxpZGF0aW9uO1xuICAgIHRoaXMuZmFpbE9uV2FybmluZ3MgPSBwcm9wcy5mYWlsT25XYXJuaW5ncztcbiAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lO1xuICAgIHRoaXMucHJvdG9jb2xUeXBlID0gcHJvcHMucHJvdG9jb2xUeXBlO1xuICAgIHRoaXMucm91dGVLZXkgPSBwcm9wcy5yb3V0ZUtleTtcbiAgICB0aGlzLnJvdXRlU2VsZWN0aW9uRXhwcmVzc2lvbiA9IHByb3BzLnJvdXRlU2VsZWN0aW9uRXhwcmVzc2lvbjtcbiAgICB0aGlzLnRhZ3MgPSBuZXcgY2RrLlRhZ01hbmFnZXIoY2RrLlRhZ1R5cGUuTUFQLCAnQVdTOjpBcGlHYXRld2F5VjI6OkFwaScsIHByb3BzLnRhZ3MsIHsgdGFnUHJvcGVydHlOYW1lOiAndGFncycgfSk7XG4gICAgdGhpcy50YXJnZXQgPSBwcm9wcy50YXJnZXQ7XG4gICAgdGhpcy52ZXJzaW9uID0gcHJvcHMudmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAqXG4gICAqL1xuICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZSgnYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlJywgQ2ZuQXBpVjIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZSgnYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wcycsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFwaUtleVNlbGVjdGlvbkV4cHJlc3Npb246IHRoaXMuYXBpS2V5U2VsZWN0aW9uRXhwcmVzc2lvbixcbiAgICAgIGJhc2VQYXRoOiB0aGlzLmJhc2VQYXRoLFxuICAgICAgYm9keTogdGhpcy5ib2R5LFxuICAgICAgYm9keVMzTG9jYXRpb246IHRoaXMuYm9keVMzTG9jYXRpb24sXG4gICAgICBjb3JzQ29uZmlndXJhdGlvbjogdGhpcy5jb3JzQ29uZmlndXJhdGlvbixcbiAgICAgIGNyZWRlbnRpYWxzQXJuOiB0aGlzLmNyZWRlbnRpYWxzQXJuLFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBkaXNhYmxlU2NoZW1hVmFsaWRhdGlvbjogdGhpcy5kaXNhYmxlU2NoZW1hVmFsaWRhdGlvbixcbiAgICAgIGZhaWxPbldhcm5pbmdzOiB0aGlzLmZhaWxPbldhcm5pbmdzLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgcHJvdG9jb2xUeXBlOiB0aGlzLnByb3RvY29sVHlwZSxcbiAgICAgIHJvdXRlS2V5OiB0aGlzLnJvdXRlS2V5LFxuICAgICAgcm91dGVTZWxlY3Rpb25FeHByZXNzaW9uOiB0aGlzLnJvdXRlU2VsZWN0aW9uRXhwcmVzc2lvbixcbiAgICAgIHRhZ3M6IHRoaXMudGFncy5yZW5kZXJUYWdzKCksXG4gICAgICB0YXJnZXQ6IHRoaXMudGFyZ2V0LFxuICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgIH07XG4gIH1cbiAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIGNmbkFwaVYyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgfVxufVxuXG4vKipcbiAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICovXG5leHBvcnQgbmFtZXNwYWNlIENmbkFwaVYyIHtcbiAgLyoqXG4gICAqIEBzdGFiaWxpdHkgZGVwcmVjYXRlZFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtYXBpZ2F0ZXdheXYyLWFwaS1ib2R5czNsb2NhdGlvbi5odG1sXG4gICAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICAgKi9cbiAgZXhwb3J0IGludGVyZmFjZSBCb2R5UzNMb2NhdGlvblByb3BlcnR5IHtcbiAgICAvKipcbiAgICAgKiBgQ2ZuQXBpVjIuQm9keVMzTG9jYXRpb25Qcm9wZXJ0eS5CdWNrZXRgXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1hcGktYm9keXMzbG9jYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1ib2R5czNsb2NhdGlvbi1idWNrZXRcbiAgICAgKi9cbiAgICByZWFkb25seSBidWNrZXQ/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogYENmbkFwaVYyLkJvZHlTM0xvY2F0aW9uUHJvcGVydHkuRXRhZ2BcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtYXBpZ2F0ZXdheXYyLWFwaS1ib2R5czNsb2NhdGlvbi5odG1sI2Nmbi1hcGlnYXRld2F5djItYXBpLWJvZHlzM2xvY2F0aW9uLWV0YWdcbiAgICAgKi9cbiAgICByZWFkb25seSBldGFnPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIGBDZm5BcGlWMi5Cb2R5UzNMb2NhdGlvblByb3BlcnR5LktleWBcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtYXBpZ2F0ZXdheXYyLWFwaS1ib2R5czNsb2NhdGlvbi5odG1sI2Nmbi1hcGlnYXRld2F5djItYXBpLWJvZHlzM2xvY2F0aW9uLWtleVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGtleT86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBgQ2ZuQXBpVjIuQm9keVMzTG9jYXRpb25Qcm9wZXJ0eS5WZXJzaW9uYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItYXBpLWJvZHlzM2xvY2F0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktYm9keXMzbG9jYXRpb24tdmVyc2lvblxuICAgICAqL1xuICAgIHJlYWRvbmx5IHZlcnNpb24/OiBzdHJpbmc7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBCb2R5UzNMb2NhdGlvblByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBCb2R5UzNMb2NhdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkFwaVYyX0JvZHlTM0xvY2F0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdidWNrZXQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYnVja2V0KSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZXRhZycsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5ldGFnKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmtleSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ZlcnNpb24nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudmVyc2lvbikpO1xuICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQm9keVMzTG9jYXRpb25Qcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGkuQm9keVMzTG9jYXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEJvZHlTM0xvY2F0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpLkJvZHlTM0xvY2F0aW9uYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkFwaVYyQm9keVMzTG9jYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICBDZm5BcGlWMl9Cb2R5UzNMb2NhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgcmV0dXJuIHtcbiAgICBCdWNrZXQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYnVja2V0KSxcbiAgICBFdGFnOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmV0YWcpLFxuICAgIEtleTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5rZXkpLFxuICAgIFZlcnNpb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudmVyc2lvbiksXG4gIH07XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuQXBpVjIge1xuICAvKipcbiAgICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItYXBpLWNvcnMuaHRtbFxuICAgKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAgICovXG4gIGV4cG9ydCBpbnRlcmZhY2UgQ29yc1Byb3BlcnR5IHtcbiAgICAvKipcbiAgICAgKiBgQ2ZuQXBpVjIuQ29yc1Byb3BlcnR5LkFsbG93Q3JlZGVudGlhbHNgXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1hcGktY29ycy5odG1sI2Nmbi1hcGlnYXRld2F5djItYXBpLWNvcnMtYWxsb3djcmVkZW50aWFsc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGFsbG93Q3JlZGVudGlhbHM/OiBib29sZWFuIHwgY2RrLklSZXNvbHZhYmxlO1xuICAgIC8qKlxuICAgICAqIGBDZm5BcGlWMi5Db3JzUHJvcGVydHkuQWxsb3dIZWFkZXJzYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItYXBpLWNvcnMuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1jb3JzLWFsbG93aGVhZGVyc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGFsbG93SGVhZGVycz86IHN0cmluZ1tdO1xuICAgIC8qKlxuICAgICAqIGBDZm5BcGlWMi5Db3JzUHJvcGVydHkuQWxsb3dNZXRob2RzYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItYXBpLWNvcnMuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1jb3JzLWFsbG93bWV0aG9kc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGFsbG93TWV0aG9kcz86IHN0cmluZ1tdO1xuICAgIC8qKlxuICAgICAqIGBDZm5BcGlWMi5Db3JzUHJvcGVydHkuQWxsb3dPcmlnaW5zYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItYXBpLWNvcnMuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1jb3JzLWFsbG93b3JpZ2luc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGFsbG93T3JpZ2lucz86IHN0cmluZ1tdO1xuICAgIC8qKlxuICAgICAqIGBDZm5BcGlWMi5Db3JzUHJvcGVydHkuRXhwb3NlSGVhZGVyc2BcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtYXBpZ2F0ZXdheXYyLWFwaS1jb3JzLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGktY29ycy1leHBvc2VoZWFkZXJzXG4gICAgICovXG4gICAgcmVhZG9ubHkgZXhwb3NlSGVhZGVycz86IHN0cmluZ1tdO1xuICAgIC8qKlxuICAgICAqIGBDZm5BcGlWMi5Db3JzUHJvcGVydHkuTWF4QWdlYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItYXBpLWNvcnMuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaS1jb3JzLW1heGFnZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IG1heEFnZT86IG51bWJlcjtcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENvcnNQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ29yc1Byb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkFwaVYyX0NvcnNQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FsbG93Q3JlZGVudGlhbHMnLCBjZGsudmFsaWRhdGVCb29sZWFuKShwcm9wZXJ0aWVzLmFsbG93Q3JlZGVudGlhbHMpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhbGxvd0hlYWRlcnMnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpKShwcm9wZXJ0aWVzLmFsbG93SGVhZGVycykpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FsbG93TWV0aG9kcycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMuYWxsb3dNZXRob2RzKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYWxsb3dPcmlnaW5zJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5hbGxvd09yaWdpbnMpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdleHBvc2VIZWFkZXJzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5leHBvc2VIZWFkZXJzKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWF4QWdlJywgY2RrLnZhbGlkYXRlTnVtYmVyKShwcm9wZXJ0aWVzLm1heEFnZSkpO1xuICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ29yc1Byb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OkFwaS5Db3JzYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDb3JzUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpLkNvcnNgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQXBpVjJDb3JzUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgQ2ZuQXBpVjJfQ29yc1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgcmV0dXJuIHtcbiAgICBBbGxvd0NyZWRlbnRpYWxzOiBjZGsuYm9vbGVhblRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hbGxvd0NyZWRlbnRpYWxzKSxcbiAgICBBbGxvd0hlYWRlcnM6IGNkay5saXN0TWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLmFsbG93SGVhZGVycyksXG4gICAgQWxsb3dNZXRob2RzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5hbGxvd01ldGhvZHMpLFxuICAgIEFsbG93T3JpZ2luczogY2RrLmxpc3RNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuYWxsb3dPcmlnaW5zKSxcbiAgICBFeHBvc2VIZWFkZXJzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5leHBvc2VIZWFkZXJzKSxcbiAgICBNYXhBZ2U6IGNkay5udW1iZXJUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubWF4QWdlKSxcbiAgfTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpTWFwcGluZ2BcbiAqXG4gKiBAc3RhYmlsaXR5IGRlcHJlY2F0ZWRcbiAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaW1hcHBpbmcuaHRtbFxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQXBpTWFwcGluZ1YyUHJvcHMge1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkFwaU1hcHBpbmcuQXBpSWRgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaW1hcHBpbmcuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaW1hcHBpbmctYXBpaWRcbiAgICovXG4gIHJlYWRvbmx5IGFwaUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpTWFwcGluZy5Eb21haW5OYW1lYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGltYXBwaW5nLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGltYXBwaW5nLWRvbWFpbm5hbWVcbiAgICovXG4gIHJlYWRvbmx5IGRvbWFpbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGlNYXBwaW5nLlN0YWdlYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGltYXBwaW5nLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGltYXBwaW5nLXN0YWdlXG4gICAqL1xuICByZWFkb25seSBzdGFnZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkFwaU1hcHBpbmcuQXBpTWFwcGluZ0tleWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXBpbWFwcGluZy5odG1sI2Nmbi1hcGlnYXRld2F5djItYXBpbWFwcGluZy1hcGltYXBwaW5na2V5XG4gICAqL1xuICByZWFkb25seSBhcGlNYXBwaW5nS2V5Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkFwaU1hcHBpbmdWMlByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5BcGlNYXBwaW5nVjJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5BcGlNYXBwaW5nVjJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FwaUlkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmFwaUlkKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXBpSWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYXBpSWQpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhcGlNYXBwaW5nS2V5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmFwaU1hcHBpbmdLZXkpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkb21haW5OYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmRvbWFpbk5hbWUpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkb21haW5OYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRvbWFpbk5hbWUpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzdGFnZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5zdGFnZSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N0YWdlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnN0YWdlKSk7XG4gIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5BcGlNYXBwaW5nVjJQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGlNYXBwaW5nYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5BcGlNYXBwaW5nVjJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGlNYXBwaW5nYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkFwaU1hcHBpbmdWMlByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gIENmbkFwaU1hcHBpbmdWMlByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgcmV0dXJuIHtcbiAgICBBcGlJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hcGlJZCksXG4gICAgRG9tYWluTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kb21haW5OYW1lKSxcbiAgICBTdGFnZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zdGFnZSksXG4gICAgQXBpTWFwcGluZ0tleTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hcGlNYXBwaW5nS2V5KSxcbiAgfTtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpTWFwcGluZ2BcbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpTWFwcGluZ1xuICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGltYXBwaW5nLmh0bWxcbiAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuQXBpTWFwcGluZ1YyIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gJ0FXUzo6QXBpR2F0ZXdheVYyOjpBcGlNYXBwaW5nJztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGlNYXBwaW5nLkFwaUlkYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGltYXBwaW5nLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGltYXBwaW5nLWFwaWlkXG4gICAqL1xuICBwdWJsaWMgYXBpSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGlNYXBwaW5nLkRvbWFpbk5hbWVgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaW1hcHBpbmcuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaW1hcHBpbmctZG9tYWlubmFtZVxuICAgKi9cbiAgcHVibGljIGRvbWFpbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGlNYXBwaW5nLlN0YWdlYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hcGltYXBwaW5nLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hcGltYXBwaW5nLXN0YWdlXG4gICAqL1xuICBwdWJsaWMgc3RhZ2U6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBcGlNYXBwaW5nLkFwaU1hcHBpbmdLZXlgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWFwaW1hcHBpbmcuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWFwaW1hcHBpbmctYXBpbWFwcGluZ2tleVxuICAgKi9cbiAgcHVibGljIGFwaU1hcHBpbmdLZXk6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkFwaUdhdGV3YXlWMjo6QXBpTWFwcGluZ2AuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5BcGlNYXBwaW5nVjJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5BcGlNYXBwaW5nVjIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2FwaUlkJywgdGhpcyk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2RvbWFpbk5hbWUnLCB0aGlzKTtcbiAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnc3RhZ2UnLCB0aGlzKTtcblxuICAgIHRoaXMuYXBpSWQgPSBwcm9wcy5hcGlJZDtcbiAgICB0aGlzLmRvbWFpbk5hbWUgPSBwcm9wcy5kb21haW5OYW1lO1xuICAgIHRoaXMuc3RhZ2UgPSBwcm9wcy5zdGFnZTtcbiAgICB0aGlzLmFwaU1hcHBpbmdLZXkgPSBwcm9wcy5hcGlNYXBwaW5nS2V5O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICpcbiAgICovXG4gIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKCdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGUnLCBDZm5BcGlNYXBwaW5nVjIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZSgnYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wcycsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFwaUlkOiB0aGlzLmFwaUlkLFxuICAgICAgZG9tYWluTmFtZTogdGhpcy5kb21haW5OYW1lLFxuICAgICAgc3RhZ2U6IHRoaXMuc3RhZ2UsXG4gICAgICBhcGlNYXBwaW5nS2V5OiB0aGlzLmFwaU1hcHBpbmdLZXksXG4gICAgfTtcbiAgfVxuICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgICByZXR1cm4gY2ZuQXBpTWFwcGluZ1YyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYEFXUzo6QXBpR2F0ZXdheVYyOjpBdXRob3JpemVyYFxuICpcbiAqIEBzdGFiaWxpdHkgZGVwcmVjYXRlZFxuICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXV0aG9yaXplci5odG1sXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5BdXRob3JpemVyVjJQcm9wcyB7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXV0aG9yaXplci5BcGlJZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXV0aG9yaXplci5odG1sI2Nmbi1hcGlnYXRld2F5djItYXV0aG9yaXplci1hcGlpZFxuICAgKi9cbiAgcmVhZG9ubHkgYXBpSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBdXRob3JpemVyLkF1dGhvcml6ZXJUeXBlYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLWF1dGhvcml6ZXJ0eXBlXG4gICAqL1xuICByZWFkb25seSBhdXRob3JpemVyVHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuSWRlbnRpdHlTb3VyY2VgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWF1dGhvcml6ZXIuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWF1dGhvcml6ZXItaWRlbnRpdHlzb3VyY2VcbiAgICovXG4gIHJlYWRvbmx5IGlkZW50aXR5U291cmNlOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBdXRob3JpemVyLk5hbWVgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWF1dGhvcml6ZXIuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWF1dGhvcml6ZXItbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuQXV0aG9yaXplckNyZWRlbnRpYWxzQXJuYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLWF1dGhvcml6ZXJjcmVkZW50aWFsc2FyblxuICAgKi9cbiAgcmVhZG9ubHkgYXV0aG9yaXplckNyZWRlbnRpYWxzQXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuQXV0aG9yaXplclJlc3VsdFR0bEluU2Vjb25kc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXV0aG9yaXplci5odG1sI2Nmbi1hcGlnYXRld2F5djItYXV0aG9yaXplci1hdXRob3JpemVycmVzdWx0dHRsaW5zZWNvbmRzXG4gICAqL1xuICByZWFkb25seSBhdXRob3JpemVyUmVzdWx0VHRsSW5TZWNvbmRzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuQXV0aG9yaXplclVyaWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXV0aG9yaXplci5odG1sI2Nmbi1hcGlnYXRld2F5djItYXV0aG9yaXplci1hdXRob3JpemVydXJpXG4gICAqL1xuICByZWFkb25seSBhdXRob3JpemVyVXJpPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuSWRlbnRpdHlWYWxpZGF0aW9uRXhwcmVzc2lvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXV0aG9yaXplci5odG1sI2Nmbi1hcGlnYXRld2F5djItYXV0aG9yaXplci1pZGVudGl0eXZhbGlkYXRpb25leHByZXNzaW9uXG4gICAqL1xuICByZWFkb25seSBpZGVudGl0eVZhbGlkYXRpb25FeHByZXNzaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuSnd0Q29uZmlndXJhdGlvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXV0aG9yaXplci5odG1sI2Nmbi1hcGlnYXRld2F5djItYXV0aG9yaXplci1qd3Rjb25maWd1cmF0aW9uXG4gICAqL1xuICByZWFkb25seSBqd3RDb25maWd1cmF0aW9uPzogQ2ZuQXV0aG9yaXplclYyLkpXVENvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5BdXRob3JpemVyVjJQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQXV0aG9yaXplclYyUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQXV0aG9yaXplclYyUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhcGlJZCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5hcGlJZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FwaUlkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmFwaUlkKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXV0aG9yaXplckNyZWRlbnRpYWxzQXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmF1dGhvcml6ZXJDcmVkZW50aWFsc0FybikpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2F1dGhvcml6ZXJSZXN1bHRUdGxJblNlY29uZHMnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMuYXV0aG9yaXplclJlc3VsdFR0bEluU2Vjb25kcykpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2F1dGhvcml6ZXJUeXBlJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmF1dGhvcml6ZXJUeXBlKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXV0aG9yaXplclR5cGUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYXV0aG9yaXplclR5cGUpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhdXRob3JpemVyVXJpJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmF1dGhvcml6ZXJVcmkpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdpZGVudGl0eVNvdXJjZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5pZGVudGl0eVNvdXJjZSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2lkZW50aXR5U291cmNlJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5pZGVudGl0eVNvdXJjZSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2lkZW50aXR5VmFsaWRhdGlvbkV4cHJlc3Npb24nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuaWRlbnRpdHlWYWxpZGF0aW9uRXhwcmVzc2lvbikpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2p3dENvbmZpZ3VyYXRpb24nLCBDZm5BdXRob3JpemVyVjJfSldUQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmp3dENvbmZpZ3VyYXRpb24pKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCduYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm5hbWUpKTtcbiAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkF1dGhvcml6ZXJWMlByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXJgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkF1dGhvcml6ZXJWMlByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXJgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQXV0aG9yaXplclYyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgQ2ZuQXV0aG9yaXplclYyUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICByZXR1cm4ge1xuICAgIEFwaUlkOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmFwaUlkKSxcbiAgICBBdXRob3JpemVyVHlwZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hdXRob3JpemVyVHlwZSksXG4gICAgSWRlbnRpdHlTb3VyY2U6IGNkay5saXN0TWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLmlkZW50aXR5U291cmNlKSxcbiAgICBOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm5hbWUpLFxuICAgIEF1dGhvcml6ZXJDcmVkZW50aWFsc0FybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hdXRob3JpemVyQ3JlZGVudGlhbHNBcm4pLFxuICAgIEF1dGhvcml6ZXJSZXN1bHRUdGxJblNlY29uZHM6IGNkay5udW1iZXJUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXV0aG9yaXplclJlc3VsdFR0bEluU2Vjb25kcyksXG4gICAgQXV0aG9yaXplclVyaTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hdXRob3JpemVyVXJpKSxcbiAgICBJZGVudGl0eVZhbGlkYXRpb25FeHByZXNzaW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmlkZW50aXR5VmFsaWRhdGlvbkV4cHJlc3Npb24pLFxuICAgIEp3dENvbmZpZ3VyYXRpb246IGNmbkF1dGhvcml6ZXJWMkpXVENvbmZpZ3VyYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5qd3RDb25maWd1cmF0aW9uKSxcbiAgfTtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OkFwaUdhdGV3YXlWMjo6QXV0aG9yaXplcmBcbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkFwaUdhdGV3YXlWMjo6QXV0aG9yaXplclxuICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLmh0bWxcbiAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuQXV0aG9yaXplclYyIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gJ0FXUzo6QXBpR2F0ZXdheVYyOjpBdXRob3JpemVyJztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBdXRob3JpemVyLkFwaUlkYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLWFwaWlkXG4gICAqL1xuICBwdWJsaWMgYXBpSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBdXRob3JpemVyLkF1dGhvcml6ZXJUeXBlYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLWF1dGhvcml6ZXJ0eXBlXG4gICAqL1xuICBwdWJsaWMgYXV0aG9yaXplclR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpBdXRob3JpemVyLklkZW50aXR5U291cmNlYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLWlkZW50aXR5c291cmNlXG4gICAqL1xuICBwdWJsaWMgaWRlbnRpdHlTb3VyY2U6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuTmFtZWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXV0aG9yaXplci5odG1sI2Nmbi1hcGlnYXRld2F5djItYXV0aG9yaXplci1uYW1lXG4gICAqL1xuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuQXV0aG9yaXplckNyZWRlbnRpYWxzQXJuYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLWF1dGhvcml6ZXJjcmVkZW50aWFsc2FyblxuICAgKi9cbiAgcHVibGljIGF1dGhvcml6ZXJDcmVkZW50aWFsc0Fybjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuQXV0aG9yaXplclJlc3VsdFR0bEluU2Vjb25kc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXV0aG9yaXplci5odG1sI2Nmbi1hcGlnYXRld2F5djItYXV0aG9yaXplci1hdXRob3JpemVycmVzdWx0dHRsaW5zZWNvbmRzXG4gICAqL1xuICBwdWJsaWMgYXV0aG9yaXplclJlc3VsdFR0bEluU2Vjb25kczogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuQXV0aG9yaXplclVyaWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXV0aG9yaXplci5odG1sI2Nmbi1hcGlnYXRld2F5djItYXV0aG9yaXplci1hdXRob3JpemVydXJpXG4gICAqL1xuICBwdWJsaWMgYXV0aG9yaXplclVyaTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuSWRlbnRpdHlWYWxpZGF0aW9uRXhwcmVzc2lvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXV0aG9yaXplci5odG1sI2Nmbi1hcGlnYXRld2F5djItYXV0aG9yaXplci1pZGVudGl0eXZhbGlkYXRpb25leHByZXNzaW9uXG4gICAqL1xuICBwdWJsaWMgaWRlbnRpdHlWYWxpZGF0aW9uRXhwcmVzc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkF1dGhvcml6ZXIuSnd0Q29uZmlndXJhdGlvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItYXV0aG9yaXplci5odG1sI2Nmbi1hcGlnYXRld2F5djItYXV0aG9yaXplci1qd3Rjb25maWd1cmF0aW9uXG4gICAqL1xuICBwdWJsaWMgand0Q29uZmlndXJhdGlvbjogQ2ZuQXV0aG9yaXplclYyLkpXVENvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkFwaUdhdGV3YXlWMjo6QXV0aG9yaXplcmAuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5BdXRob3JpemVyVjJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5BdXRob3JpemVyVjIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2FwaUlkJywgdGhpcyk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2F1dGhvcml6ZXJUeXBlJywgdGhpcyk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2lkZW50aXR5U291cmNlJywgdGhpcyk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ25hbWUnLCB0aGlzKTtcblxuICAgIHRoaXMuYXBpSWQgPSBwcm9wcy5hcGlJZDtcbiAgICB0aGlzLmF1dGhvcml6ZXJUeXBlID0gcHJvcHMuYXV0aG9yaXplclR5cGU7XG4gICAgdGhpcy5pZGVudGl0eVNvdXJjZSA9IHByb3BzLmlkZW50aXR5U291cmNlO1xuICAgIHRoaXMubmFtZSA9IHByb3BzLm5hbWU7XG4gICAgdGhpcy5hdXRob3JpemVyQ3JlZGVudGlhbHNBcm4gPSBwcm9wcy5hdXRob3JpemVyQ3JlZGVudGlhbHNBcm47XG4gICAgdGhpcy5hdXRob3JpemVyUmVzdWx0VHRsSW5TZWNvbmRzID0gcHJvcHMuYXV0aG9yaXplclJlc3VsdFR0bEluU2Vjb25kcztcbiAgICB0aGlzLmF1dGhvcml6ZXJVcmkgPSBwcm9wcy5hdXRob3JpemVyVXJpO1xuICAgIHRoaXMuaWRlbnRpdHlWYWxpZGF0aW9uRXhwcmVzc2lvbiA9IHByb3BzLmlkZW50aXR5VmFsaWRhdGlvbkV4cHJlc3Npb247XG4gICAgdGhpcy5qd3RDb25maWd1cmF0aW9uID0gcHJvcHMuand0Q29uZmlndXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAqXG4gICAqL1xuICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZSgnYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlJywgQ2ZuQXV0aG9yaXplclYyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHMnLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiB7XG4gICAgICBhcGlJZDogdGhpcy5hcGlJZCxcbiAgICAgIGF1dGhvcml6ZXJUeXBlOiB0aGlzLmF1dGhvcml6ZXJUeXBlLFxuICAgICAgaWRlbnRpdHlTb3VyY2U6IHRoaXMuaWRlbnRpdHlTb3VyY2UsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBhdXRob3JpemVyQ3JlZGVudGlhbHNBcm46IHRoaXMuYXV0aG9yaXplckNyZWRlbnRpYWxzQXJuLFxuICAgICAgYXV0aG9yaXplclJlc3VsdFR0bEluU2Vjb25kczogdGhpcy5hdXRob3JpemVyUmVzdWx0VHRsSW5TZWNvbmRzLFxuICAgICAgYXV0aG9yaXplclVyaTogdGhpcy5hdXRob3JpemVyVXJpLFxuICAgICAgaWRlbnRpdHlWYWxpZGF0aW9uRXhwcmVzc2lvbjogdGhpcy5pZGVudGl0eVZhbGlkYXRpb25FeHByZXNzaW9uLFxuICAgICAgand0Q29uZmlndXJhdGlvbjogdGhpcy5qd3RDb25maWd1cmF0aW9uLFxuICAgIH07XG4gIH1cbiAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIGNmbkF1dGhvcml6ZXJWMlByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAqL1xuZXhwb3J0IG5hbWVzcGFjZSBDZm5BdXRob3JpemVyVjIge1xuICAvKipcbiAgICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItYXV0aG9yaXplci1qd3Rjb25maWd1cmF0aW9uLmh0bWxcbiAgICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gICAqL1xuICBleHBvcnQgaW50ZXJmYWNlIEpXVENvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB7XG4gICAgLyoqXG4gICAgICogYENmbkF1dGhvcml6ZXJWMi5KV1RDb25maWd1cmF0aW9uUHJvcGVydHkuQXVkaWVuY2VgXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLWp3dGNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWF1dGhvcml6ZXItand0Y29uZmlndXJhdGlvbi1hdWRpZW5jZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGF1ZGllbmNlPzogc3RyaW5nW107XG4gICAgLyoqXG4gICAgICogYENmbkF1dGhvcml6ZXJWMi5KV1RDb25maWd1cmF0aW9uUHJvcGVydHkuSXNzdWVyYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItYXV0aG9yaXplci1qd3Rjb25maWd1cmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1hdXRob3JpemVyLWp3dGNvbmZpZ3VyYXRpb24taXNzdWVyXG4gICAgICovXG4gICAgcmVhZG9ubHkgaXNzdWVyPzogc3RyaW5nO1xuICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgSldUQ29uZmlndXJhdGlvblByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBKV1RDb25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQXV0aG9yaXplclYyX0pXVENvbmZpZ3VyYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2F1ZGllbmNlJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5hdWRpZW5jZSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2lzc3VlcicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5pc3N1ZXIpKTtcbiAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkpXVENvbmZpZ3VyYXRpb25Qcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpBdXRob3JpemVyLkpXVENvbmZpZ3VyYXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEpXVENvbmZpZ3VyYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpBdXRob3JpemVyLkpXVENvbmZpZ3VyYXRpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQXV0aG9yaXplclYySldUQ29uZmlndXJhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gIENmbkF1dGhvcml6ZXJWMl9KV1RDb25maWd1cmF0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICByZXR1cm4ge1xuICAgIEF1ZGllbmNlOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5hdWRpZW5jZSksXG4gICAgSXNzdWVyOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmlzc3VlciksXG4gIH07XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQVdTOjpBcGlHYXRld2F5VjI6OkRlcGxveW1lbnRgXG4gKlxuICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1kZXBsb3ltZW50Lmh0bWxcbiAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkRlcGxveW1lbnRWMlByb3BzIHtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpEZXBsb3ltZW50LkFwaUlkYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1kZXBsb3ltZW50Lmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1kZXBsb3ltZW50LWFwaWlkXG4gICAqL1xuICByZWFkb25seSBhcGlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkRlcGxveW1lbnQuRGVzY3JpcHRpb25gXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWRlcGxveW1lbnQuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWRlcGxveW1lbnQtZGVzY3JpcHRpb25cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkRlcGxveW1lbnQuU3RhZ2VOYW1lYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1kZXBsb3ltZW50Lmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1kZXBsb3ltZW50LXN0YWdlbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhZ2VOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkRlcGxveW1lbnRWMlByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5EZXBsb3ltZW50VjJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5EZXBsb3ltZW50VjJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FwaUlkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmFwaUlkKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXBpSWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYXBpSWQpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZXNjcmlwdGlvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kZXNjcmlwdGlvbikpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N0YWdlTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5zdGFnZU5hbWUpKTtcbiAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkRlcGxveW1lbnRWMlByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OkRlcGxveW1lbnRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkRlcGxveW1lbnRWMlByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OkRlcGxveW1lbnRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRGVwbG95bWVudFYyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgQ2ZuRGVwbG95bWVudFYyUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICByZXR1cm4ge1xuICAgIEFwaUlkOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmFwaUlkKSxcbiAgICBEZXNjcmlwdGlvbjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kZXNjcmlwdGlvbiksXG4gICAgU3RhZ2VOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnN0YWdlTmFtZSksXG4gIH07XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpBcGlHYXRld2F5VjI6OkRlcGxveW1lbnRgXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpBcGlHYXRld2F5VjI6OkRlcGxveW1lbnRcbiAqIEBzdGFiaWxpdHkgZGVwcmVjYXRlZFxuICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItZGVwbG95bWVudC5odG1sXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkRlcGxveW1lbnRWMiBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAvKipcbiAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9ICdBV1M6OkFwaUdhdGV3YXlWMjo6RGVwbG95bWVudCc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6RGVwbG95bWVudC5BcGlJZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItZGVwbG95bWVudC5odG1sI2Nmbi1hcGlnYXRld2F5djItZGVwbG95bWVudC1hcGlpZFxuICAgKi9cbiAgcHVibGljIGFwaUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6RGVwbG95bWVudC5EZXNjcmlwdGlvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItZGVwbG95bWVudC5odG1sI2Nmbi1hcGlnYXRld2F5djItZGVwbG95bWVudC1kZXNjcmlwdGlvblxuICAgKi9cbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6RGVwbG95bWVudC5TdGFnZU5hbWVgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWRlcGxveW1lbnQuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWRlcGxveW1lbnQtc3RhZ2VuYW1lXG4gICAqL1xuICBwdWJsaWMgc3RhZ2VOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpBcGlHYXRld2F5VjI6OkRlcGxveW1lbnRgLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuRGVwbG95bWVudFYyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuRGVwbG95bWVudFYyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdhcGlJZCcsIHRoaXMpO1xuXG4gICAgdGhpcy5hcGlJZCA9IHByb3BzLmFwaUlkO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBwcm9wcy5kZXNjcmlwdGlvbjtcbiAgICB0aGlzLnN0YWdlTmFtZSA9IHByb3BzLnN0YWdlTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAqXG4gICAqL1xuICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZSgnYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlJywgQ2ZuRGVwbG95bWVudFYyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHMnLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiB7XG4gICAgICBhcGlJZDogdGhpcy5hcGlJZCxcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgc3RhZ2VOYW1lOiB0aGlzLnN0YWdlTmFtZSxcbiAgICB9O1xuICB9XG4gIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiBjZm5EZXBsb3ltZW50VjJQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWVgXG4gKlxuICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1kb21haW5uYW1lLmh0bWxcbiAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkRvbWFpbk5hbWVWMlByb3BzIHtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpEb21haW5OYW1lLkRvbWFpbk5hbWVgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWRvbWFpbm5hbWUuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWRvbWFpbm5hbWUtZG9tYWlubmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWUuRG9tYWluTmFtZUNvbmZpZ3VyYXRpb25zYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1kb21haW5uYW1lLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1kb21haW5uYW1lLWRvbWFpbm5hbWVjb25maWd1cmF0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZUNvbmZpZ3VyYXRpb25zPzogQXJyYXk8Q2ZuRG9tYWluTmFtZVYyLkRvbWFpbk5hbWVDb25maWd1cmF0aW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWUuVGFnc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItZG9tYWlubmFtZS5odG1sI2Nmbi1hcGlnYXRld2F5djItZG9tYWlubmFtZS10YWdzXG4gICAqL1xuICByZWFkb25seSB0YWdzPzogYW55O1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkRvbWFpbk5hbWVWMlByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5Eb21haW5OYW1lVjJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5Eb21haW5OYW1lVjJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RvbWFpbk5hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuZG9tYWluTmFtZSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RvbWFpbk5hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZG9tYWluTmFtZSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RvbWFpbk5hbWVDb25maWd1cmF0aW9ucycsIGNkay5saXN0VmFsaWRhdG9yKENmbkRvbWFpbk5hbWVWMl9Eb21haW5OYW1lQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy5kb21haW5OYW1lQ29uZmlndXJhdGlvbnMpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLnZhbGlkYXRlT2JqZWN0KShwcm9wZXJ0aWVzLnRhZ3MpKTtcbiAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkRvbWFpbk5hbWVWMlByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWVgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkRvbWFpbk5hbWVWMlByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWVgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRG9tYWluTmFtZVYyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgQ2ZuRG9tYWluTmFtZVYyUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICByZXR1cm4ge1xuICAgIERvbWFpbk5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZG9tYWluTmFtZSksXG4gICAgRG9tYWluTmFtZUNvbmZpZ3VyYXRpb25zOiBjZGsubGlzdE1hcHBlcihjZm5Eb21haW5OYW1lVjJEb21haW5OYW1lQ29uZmlndXJhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5kb21haW5OYW1lQ29uZmlndXJhdGlvbnMpLFxuICAgIFRhZ3M6IGNkay5vYmplY3RUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudGFncyksXG4gIH07XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWVgXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWVcbiAqIEBzdGFiaWxpdHkgZGVwcmVjYXRlZFxuICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItZG9tYWlubmFtZS5odG1sXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkRvbWFpbk5hbWVWMiBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAvKipcbiAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9ICdBV1M6OkFwaUdhdGV3YXlWMjo6RG9tYWluTmFtZSc7XG5cbiAgLyoqXG4gICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBSZWdpb25hbERvbWFpbk5hbWVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhdHRyUmVnaW9uYWxEb21haW5OYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBSZWdpb25hbEhvc3RlZFpvbmVJZFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGF0dHJSZWdpb25hbEhvc3RlZFpvbmVJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWUuRG9tYWluTmFtZWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItZG9tYWlubmFtZS5odG1sI2Nmbi1hcGlnYXRld2F5djItZG9tYWlubmFtZS1kb21haW5uYW1lXG4gICAqL1xuICBwdWJsaWMgZG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWUuRG9tYWluTmFtZUNvbmZpZ3VyYXRpb25zYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1kb21haW5uYW1lLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1kb21haW5uYW1lLWRvbWFpbm5hbWVjb25maWd1cmF0aW9uc1xuICAgKi9cbiAgcHVibGljIGRvbWFpbk5hbWVDb25maWd1cmF0aW9uczogQXJyYXk8Q2ZuRG9tYWluTmFtZVYyLkRvbWFpbk5hbWVDb25maWd1cmF0aW9uUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWUuVGFnc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItZG9tYWlubmFtZS5odG1sI2Nmbi1hcGlnYXRld2F5djItZG9tYWlubmFtZS10YWdzXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdGFnczogY2RrLlRhZ01hbmFnZXI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWVgLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuRG9tYWluTmFtZVYyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuRG9tYWluTmFtZVYyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdkb21haW5OYW1lJywgdGhpcyk7XG4gICAgdGhpcy5hdHRyUmVnaW9uYWxEb21haW5OYW1lID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdSZWdpb25hbERvbWFpbk5hbWUnKSk7XG4gICAgdGhpcy5hdHRyUmVnaW9uYWxIb3N0ZWRab25lSWQgPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ1JlZ2lvbmFsSG9zdGVkWm9uZUlkJykpO1xuXG4gICAgdGhpcy5kb21haW5OYW1lID0gcHJvcHMuZG9tYWluTmFtZTtcbiAgICB0aGlzLmRvbWFpbk5hbWVDb25maWd1cmF0aW9ucyA9IHByb3BzLmRvbWFpbk5hbWVDb25maWd1cmF0aW9ucztcbiAgICB0aGlzLnRhZ3MgPSBuZXcgY2RrLlRhZ01hbmFnZXIoY2RrLlRhZ1R5cGUuTUFQLCAnQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWUnLCBwcm9wcy50YWdzLCB7IHRhZ1Byb3BlcnR5TmFtZTogJ3RhZ3MnIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICpcbiAgICovXG4gIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKCdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGUnLCBDZm5Eb21haW5OYW1lVjIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZSgnYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wcycsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRvbWFpbk5hbWU6IHRoaXMuZG9tYWluTmFtZSxcbiAgICAgIGRvbWFpbk5hbWVDb25maWd1cmF0aW9uczogdGhpcy5kb21haW5OYW1lQ29uZmlndXJhdGlvbnMsXG4gICAgICB0YWdzOiB0aGlzLnRhZ3MucmVuZGVyVGFncygpLFxuICAgIH07XG4gIH1cbiAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIGNmbkRvbWFpbk5hbWVWMlByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAqL1xuZXhwb3J0IG5hbWVzcGFjZSBDZm5Eb21haW5OYW1lVjIge1xuICAvKipcbiAgICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItZG9tYWlubmFtZS1kb21haW5uYW1lY29uZmlndXJhdGlvbi5odG1sXG4gICAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICAgKi9cbiAgZXhwb3J0IGludGVyZmFjZSBEb21haW5OYW1lQ29uZmlndXJhdGlvblByb3BlcnR5IHtcbiAgICAvKipcbiAgICAgKiBgQ2ZuRG9tYWluTmFtZVYyLkRvbWFpbk5hbWVDb25maWd1cmF0aW9uUHJvcGVydHkuQ2VydGlmaWNhdGVBcm5gXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1kb21haW5uYW1lLWRvbWFpbm5hbWVjb25maWd1cmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1kb21haW5uYW1lLWRvbWFpbm5hbWVjb25maWd1cmF0aW9uLWNlcnRpZmljYXRlYXJuXG4gICAgICovXG4gICAgcmVhZG9ubHkgY2VydGlmaWNhdGVBcm4/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogYENmbkRvbWFpbk5hbWVWMi5Eb21haW5OYW1lQ29uZmlndXJhdGlvblByb3BlcnR5LkNlcnRpZmljYXRlTmFtZWBcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtYXBpZ2F0ZXdheXYyLWRvbWFpbm5hbWUtZG9tYWlubmFtZWNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWRvbWFpbm5hbWUtZG9tYWlubmFtZWNvbmZpZ3VyYXRpb24tY2VydGlmaWNhdGVuYW1lXG4gICAgICovXG4gICAgcmVhZG9ubHkgY2VydGlmaWNhdGVOYW1lPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIGBDZm5Eb21haW5OYW1lVjIuRG9tYWluTmFtZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eS5FbmRwb2ludFR5cGVgXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1kb21haW5uYW1lLWRvbWFpbm5hbWVjb25maWd1cmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1kb21haW5uYW1lLWRvbWFpbm5hbWVjb25maWd1cmF0aW9uLWVuZHBvaW50dHlwZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGVuZHBvaW50VHlwZT86IHN0cmluZztcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYERvbWFpbk5hbWVDb25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYERvbWFpbk5hbWVDb25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRG9tYWluTmFtZVYyX0RvbWFpbk5hbWVDb25maWd1cmF0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjZXJ0aWZpY2F0ZUFybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5jZXJ0aWZpY2F0ZUFybikpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2NlcnRpZmljYXRlTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5jZXJ0aWZpY2F0ZU5hbWUpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdlbmRwb2ludFR5cGUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZW5kcG9pbnRUeXBlKSk7XG4gIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJEb21haW5OYW1lQ29uZmlndXJhdGlvblByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OkRvbWFpbk5hbWUuRG9tYWluTmFtZUNvbmZpZ3VyYXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYERvbWFpbk5hbWVDb25maWd1cmF0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkFwaUdhdGV3YXlWMjo6RG9tYWluTmFtZS5Eb21haW5OYW1lQ29uZmlndXJhdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5Eb21haW5OYW1lVjJEb21haW5OYW1lQ29uZmlndXJhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gIENmbkRvbWFpbk5hbWVWMl9Eb21haW5OYW1lQ29uZmlndXJhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgcmV0dXJuIHtcbiAgICBDZXJ0aWZpY2F0ZUFybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5jZXJ0aWZpY2F0ZUFybiksXG4gICAgQ2VydGlmaWNhdGVOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNlcnRpZmljYXRlTmFtZSksXG4gICAgRW5kcG9pbnRUeXBlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmVuZHBvaW50VHlwZSksXG4gIH07XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQVdTOjpBcGlHYXRld2F5VjI6OkludGVncmF0aW9uYFxuICpcbiAqIEBzdGFiaWxpdHkgZGVwcmVjYXRlZFxuICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbFxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuSW50ZWdyYXRpb25WMlByb3BzIHtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5BcGlJZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLWFwaWlkXG4gICAqL1xuICByZWFkb25seSBhcGlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkludGVncmF0aW9uLkludGVncmF0aW9uVHlwZWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLWludGVncmF0aW9udHlwZVxuICAgKi9cbiAgcmVhZG9ubHkgaW50ZWdyYXRpb25UeXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uQ29ubmVjdGlvblR5cGVgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi1jb25uZWN0aW9udHlwZVxuICAgKi9cbiAgcmVhZG9ubHkgY29ubmVjdGlvblR5cGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uQ29udGVudEhhbmRsaW5nU3RyYXRlZ3lgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi1jb250ZW50aGFuZGxpbmdzdHJhdGVneVxuICAgKi9cbiAgcmVhZG9ubHkgY29udGVudEhhbmRsaW5nU3RyYXRlZ3k/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uQ3JlZGVudGlhbHNBcm5gXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi1jcmVkZW50aWFsc2FyblxuICAgKi9cbiAgcmVhZG9ubHkgY3JlZGVudGlhbHNBcm4/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uRGVzY3JpcHRpb25gXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi1kZXNjcmlwdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uSW50ZWdyYXRpb25NZXRob2RgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi1pbnRlZ3JhdGlvbm1ldGhvZFxuICAgKi9cbiAgcmVhZG9ubHkgaW50ZWdyYXRpb25NZXRob2Q/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uSW50ZWdyYXRpb25VcmlgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi1pbnRlZ3JhdGlvbnVyaVxuICAgKi9cbiAgcmVhZG9ubHkgaW50ZWdyYXRpb25Vcmk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uUGFzc3Rocm91Z2hCZWhhdmlvcmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLXBhc3N0aHJvdWdoYmVoYXZpb3JcbiAgICovXG4gIHJlYWRvbmx5IHBhc3N0aHJvdWdoQmVoYXZpb3I/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uUGF5bG9hZEZvcm1hdFZlcnNpb25gXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi1wYXlsb2FkZm9ybWF0dmVyc2lvblxuICAgKi9cbiAgcmVhZG9ubHkgcGF5bG9hZEZvcm1hdFZlcnNpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uUmVxdWVzdFBhcmFtZXRlcnNgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi1yZXF1ZXN0cGFyYW1ldGVyc1xuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWVzdFBhcmFtZXRlcnM/OiBhbnkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uUmVxdWVzdFRlbXBsYXRlc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLXJlcXVlc3R0ZW1wbGF0ZXNcbiAgICovXG4gIHJlYWRvbmx5IHJlcXVlc3RUZW1wbGF0ZXM/OiBhbnkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uVGVtcGxhdGVTZWxlY3Rpb25FeHByZXNzaW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi5odG1sI2Nmbi1hcGlnYXRld2F5djItaW50ZWdyYXRpb24tdGVtcGxhdGVzZWxlY3Rpb25leHByZXNzaW9uXG4gICAqL1xuICByZWFkb25seSB0ZW1wbGF0ZVNlbGVjdGlvbkV4cHJlc3Npb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24uVGltZW91dEluTWlsbGlzYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi5odG1sI2Nmbi1hcGlnYXRld2F5djItaW50ZWdyYXRpb24tdGltZW91dGlubWlsbGlzXG4gICAqL1xuICByZWFkb25seSB0aW1lb3V0SW5NaWxsaXM/OiBudW1iZXI7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuSW50ZWdyYXRpb25WMlByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5JbnRlZ3JhdGlvblYyUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuSW50ZWdyYXRpb25WMlByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXBpSWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuYXBpSWQpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhcGlJZCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5hcGlJZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Nvbm5lY3Rpb25UeXBlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmNvbm5lY3Rpb25UeXBlKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY29udGVudEhhbmRsaW5nU3RyYXRlZ3knLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuY29udGVudEhhbmRsaW5nU3RyYXRlZ3kpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjcmVkZW50aWFsc0FybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5jcmVkZW50aWFsc0FybikpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Rlc2NyaXB0aW9uJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRlc2NyaXB0aW9uKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignaW50ZWdyYXRpb25NZXRob2QnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuaW50ZWdyYXRpb25NZXRob2QpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdpbnRlZ3JhdGlvblR5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuaW50ZWdyYXRpb25UeXBlKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignaW50ZWdyYXRpb25UeXBlJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmludGVncmF0aW9uVHlwZSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ludGVncmF0aW9uVXJpJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmludGVncmF0aW9uVXJpKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncGFzc3Rocm91Z2hCZWhhdmlvcicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5wYXNzdGhyb3VnaEJlaGF2aW9yKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncGF5bG9hZEZvcm1hdFZlcnNpb24nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucGF5bG9hZEZvcm1hdFZlcnNpb24pKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXF1ZXN0UGFyYW1ldGVycycsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5yZXF1ZXN0UGFyYW1ldGVycykpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlcXVlc3RUZW1wbGF0ZXMnLCBjZGsudmFsaWRhdGVPYmplY3QpKHByb3BlcnRpZXMucmVxdWVzdFRlbXBsYXRlcykpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RlbXBsYXRlU2VsZWN0aW9uRXhwcmVzc2lvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50ZW1wbGF0ZVNlbGVjdGlvbkV4cHJlc3Npb24pKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0aW1lb3V0SW5NaWxsaXMnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMudGltZW91dEluTWlsbGlzKSk7XG4gIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5JbnRlZ3JhdGlvblYyUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkludGVncmF0aW9uVjJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5JbnRlZ3JhdGlvblYyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgQ2ZuSW50ZWdyYXRpb25WMlByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgcmV0dXJuIHtcbiAgICBBcGlJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hcGlJZCksXG4gICAgSW50ZWdyYXRpb25UeXBlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmludGVncmF0aW9uVHlwZSksXG4gICAgQ29ubmVjdGlvblR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuY29ubmVjdGlvblR5cGUpLFxuICAgIENvbnRlbnRIYW5kbGluZ1N0cmF0ZWd5OiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNvbnRlbnRIYW5kbGluZ1N0cmF0ZWd5KSxcbiAgICBDcmVkZW50aWFsc0FybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5jcmVkZW50aWFsc0FybiksXG4gICAgRGVzY3JpcHRpb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGVzY3JpcHRpb24pLFxuICAgIEludGVncmF0aW9uTWV0aG9kOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmludGVncmF0aW9uTWV0aG9kKSxcbiAgICBJbnRlZ3JhdGlvblVyaTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5pbnRlZ3JhdGlvblVyaSksXG4gICAgUGFzc3Rocm91Z2hCZWhhdmlvcjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wYXNzdGhyb3VnaEJlaGF2aW9yKSxcbiAgICBQYXlsb2FkRm9ybWF0VmVyc2lvbjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wYXlsb2FkRm9ybWF0VmVyc2lvbiksXG4gICAgUmVxdWVzdFBhcmFtZXRlcnM6IGNkay5vYmplY3RUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVxdWVzdFBhcmFtZXRlcnMpLFxuICAgIFJlcXVlc3RUZW1wbGF0ZXM6IGNkay5vYmplY3RUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVxdWVzdFRlbXBsYXRlcyksXG4gICAgVGVtcGxhdGVTZWxlY3Rpb25FeHByZXNzaW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRlbXBsYXRlU2VsZWN0aW9uRXhwcmVzc2lvbiksXG4gICAgVGltZW91dEluTWlsbGlzOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRpbWVvdXRJbk1pbGxpcyksXG4gIH07XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpBcGlHYXRld2F5VjI6OkludGVncmF0aW9uYFxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvblxuICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi5odG1sXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkludGVncmF0aW9uVjIgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgLyoqXG4gICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSAnQVdTOjpBcGlHYXRld2F5VjI6OkludGVncmF0aW9uJztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5BcGlJZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLWFwaWlkXG4gICAqL1xuICBwdWJsaWMgYXBpSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5JbnRlZ3JhdGlvblR5cGVgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi1pbnRlZ3JhdGlvbnR5cGVcbiAgICovXG4gIHB1YmxpYyBpbnRlZ3JhdGlvblR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5Db25uZWN0aW9uVHlwZWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLWNvbm5lY3Rpb250eXBlXG4gICAqL1xuICBwdWJsaWMgY29ubmVjdGlvblR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5Db250ZW50SGFuZGxpbmdTdHJhdGVneWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLWNvbnRlbnRoYW5kbGluZ3N0cmF0ZWd5XG4gICAqL1xuICBwdWJsaWMgY29udGVudEhhbmRsaW5nU3RyYXRlZ3k6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5DcmVkZW50aWFsc0FybmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLWNyZWRlbnRpYWxzYXJuXG4gICAqL1xuICBwdWJsaWMgY3JlZGVudGlhbHNBcm46IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5EZXNjcmlwdGlvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLWRlc2NyaXB0aW9uXG4gICAqL1xuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5JbnRlZ3JhdGlvbk1ldGhvZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLWludGVncmF0aW9ubWV0aG9kXG4gICAqL1xuICBwdWJsaWMgaW50ZWdyYXRpb25NZXRob2Q6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5JbnRlZ3JhdGlvblVyaWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLWludGVncmF0aW9udXJpXG4gICAqL1xuICBwdWJsaWMgaW50ZWdyYXRpb25Vcmk6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5QYXNzdGhyb3VnaEJlaGF2aW9yYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi5odG1sI2Nmbi1hcGlnYXRld2F5djItaW50ZWdyYXRpb24tcGFzc3Rocm91Z2hiZWhhdmlvclxuICAgKi9cbiAgcHVibGljIHBhc3N0aHJvdWdoQmVoYXZpb3I6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5QYXlsb2FkRm9ybWF0VmVyc2lvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLXBheWxvYWRmb3JtYXR2ZXJzaW9uXG4gICAqL1xuICBwdWJsaWMgcGF5bG9hZEZvcm1hdFZlcnNpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5SZXF1ZXN0UGFyYW1ldGVyc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb24uaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLXJlcXVlc3RwYXJhbWV0ZXJzXG4gICAqL1xuICBwdWJsaWMgcmVxdWVzdFBhcmFtZXRlcnM6IGFueSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5SZXF1ZXN0VGVtcGxhdGVzYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi5odG1sI2Nmbi1hcGlnYXRld2F5djItaW50ZWdyYXRpb24tcmVxdWVzdHRlbXBsYXRlc1xuICAgKi9cbiAgcHVibGljIHJlcXVlc3RUZW1wbGF0ZXM6IGFueSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5UZW1wbGF0ZVNlbGVjdGlvbkV4cHJlc3Npb25gXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi10ZW1wbGF0ZXNlbGVjdGlvbmV4cHJlc3Npb25cbiAgICovXG4gIHB1YmxpYyB0ZW1wbGF0ZVNlbGVjdGlvbkV4cHJlc3Npb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbi5UaW1lb3V0SW5NaWxsaXNgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9uLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbi10aW1lb3V0aW5taWxsaXNcbiAgICovXG4gIHB1YmxpYyB0aW1lb3V0SW5NaWxsaXM6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb25gLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuSW50ZWdyYXRpb25WMlByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkludGVncmF0aW9uVjIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2FwaUlkJywgdGhpcyk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2ludGVncmF0aW9uVHlwZScsIHRoaXMpO1xuXG4gICAgdGhpcy5hcGlJZCA9IHByb3BzLmFwaUlkO1xuICAgIHRoaXMuaW50ZWdyYXRpb25UeXBlID0gcHJvcHMuaW50ZWdyYXRpb25UeXBlO1xuICAgIHRoaXMuY29ubmVjdGlvblR5cGUgPSBwcm9wcy5jb25uZWN0aW9uVHlwZTtcbiAgICB0aGlzLmNvbnRlbnRIYW5kbGluZ1N0cmF0ZWd5ID0gcHJvcHMuY29udGVudEhhbmRsaW5nU3RyYXRlZ3k7XG4gICAgdGhpcy5jcmVkZW50aWFsc0FybiA9IHByb3BzLmNyZWRlbnRpYWxzQXJuO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBwcm9wcy5kZXNjcmlwdGlvbjtcbiAgICB0aGlzLmludGVncmF0aW9uTWV0aG9kID0gcHJvcHMuaW50ZWdyYXRpb25NZXRob2Q7XG4gICAgdGhpcy5pbnRlZ3JhdGlvblVyaSA9IHByb3BzLmludGVncmF0aW9uVXJpO1xuICAgIHRoaXMucGFzc3Rocm91Z2hCZWhhdmlvciA9IHByb3BzLnBhc3N0aHJvdWdoQmVoYXZpb3I7XG4gICAgdGhpcy5wYXlsb2FkRm9ybWF0VmVyc2lvbiA9IHByb3BzLnBheWxvYWRGb3JtYXRWZXJzaW9uO1xuICAgIHRoaXMucmVxdWVzdFBhcmFtZXRlcnMgPSBwcm9wcy5yZXF1ZXN0UGFyYW1ldGVycztcbiAgICB0aGlzLnJlcXVlc3RUZW1wbGF0ZXMgPSBwcm9wcy5yZXF1ZXN0VGVtcGxhdGVzO1xuICAgIHRoaXMudGVtcGxhdGVTZWxlY3Rpb25FeHByZXNzaW9uID0gcHJvcHMudGVtcGxhdGVTZWxlY3Rpb25FeHByZXNzaW9uO1xuICAgIHRoaXMudGltZW91dEluTWlsbGlzID0gcHJvcHMudGltZW91dEluTWlsbGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICpcbiAgICovXG4gIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKCdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGUnLCBDZm5JbnRlZ3JhdGlvblYyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHMnLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiB7XG4gICAgICBhcGlJZDogdGhpcy5hcGlJZCxcbiAgICAgIGludGVncmF0aW9uVHlwZTogdGhpcy5pbnRlZ3JhdGlvblR5cGUsXG4gICAgICBjb25uZWN0aW9uVHlwZTogdGhpcy5jb25uZWN0aW9uVHlwZSxcbiAgICAgIGNvbnRlbnRIYW5kbGluZ1N0cmF0ZWd5OiB0aGlzLmNvbnRlbnRIYW5kbGluZ1N0cmF0ZWd5LFxuICAgICAgY3JlZGVudGlhbHNBcm46IHRoaXMuY3JlZGVudGlhbHNBcm4sXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIGludGVncmF0aW9uTWV0aG9kOiB0aGlzLmludGVncmF0aW9uTWV0aG9kLFxuICAgICAgaW50ZWdyYXRpb25Vcmk6IHRoaXMuaW50ZWdyYXRpb25VcmksXG4gICAgICBwYXNzdGhyb3VnaEJlaGF2aW9yOiB0aGlzLnBhc3N0aHJvdWdoQmVoYXZpb3IsXG4gICAgICBwYXlsb2FkRm9ybWF0VmVyc2lvbjogdGhpcy5wYXlsb2FkRm9ybWF0VmVyc2lvbixcbiAgICAgIHJlcXVlc3RQYXJhbWV0ZXJzOiB0aGlzLnJlcXVlc3RQYXJhbWV0ZXJzLFxuICAgICAgcmVxdWVzdFRlbXBsYXRlczogdGhpcy5yZXF1ZXN0VGVtcGxhdGVzLFxuICAgICAgdGVtcGxhdGVTZWxlY3Rpb25FeHByZXNzaW9uOiB0aGlzLnRlbXBsYXRlU2VsZWN0aW9uRXhwcmVzc2lvbixcbiAgICAgIHRpbWVvdXRJbk1pbGxpczogdGhpcy50aW1lb3V0SW5NaWxsaXMsXG4gICAgfTtcbiAgfVxuICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgICByZXR1cm4gY2ZuSW50ZWdyYXRpb25WMlByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb25SZXNwb25zZWBcbiAqXG4gKiBAc3RhYmlsaXR5IGRlcHJlY2F0ZWRcbiAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UuaHRtbFxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuSW50ZWdyYXRpb25SZXNwb25zZVYyUHJvcHMge1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkludGVncmF0aW9uUmVzcG9uc2UuQXBpSWRgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UtYXBpaWRcbiAgICovXG4gIHJlYWRvbmx5IGFwaUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb25SZXNwb25zZS5JbnRlZ3JhdGlvbklkYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLWludGVncmF0aW9uaWRcbiAgICovXG4gIHJlYWRvbmx5IGludGVncmF0aW9uSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvblJlc3BvbnNlLkludGVncmF0aW9uUmVzcG9uc2VLZXlgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UtaW50ZWdyYXRpb25yZXNwb25zZWtleVxuICAgKi9cbiAgcmVhZG9ubHkgaW50ZWdyYXRpb25SZXNwb25zZUtleTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkludGVncmF0aW9uUmVzcG9uc2UuQ29udGVudEhhbmRsaW5nU3RyYXRlZ3lgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UtY29udGVudGhhbmRsaW5nc3RyYXRlZ3lcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRlbnRIYW5kbGluZ1N0cmF0ZWd5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkludGVncmF0aW9uUmVzcG9uc2UuUmVzcG9uc2VQYXJhbWV0ZXJzYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLXJlc3BvbnNlcGFyYW1ldGVyc1xuICAgKi9cbiAgcmVhZG9ubHkgcmVzcG9uc2VQYXJhbWV0ZXJzPzogYW55IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkludGVncmF0aW9uUmVzcG9uc2UuUmVzcG9uc2VUZW1wbGF0ZXNgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UtcmVzcG9uc2V0ZW1wbGF0ZXNcbiAgICovXG4gIHJlYWRvbmx5IHJlc3BvbnNlVGVtcGxhdGVzPzogYW55IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OkludGVncmF0aW9uUmVzcG9uc2UuVGVtcGxhdGVTZWxlY3Rpb25FeHByZXNzaW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLXRlbXBsYXRlc2VsZWN0aW9uZXhwcmVzc2lvblxuICAgKi9cbiAgcmVhZG9ubHkgdGVtcGxhdGVTZWxlY3Rpb25FeHByZXNzaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkludGVncmF0aW9uUmVzcG9uc2VWMlByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5JbnRlZ3JhdGlvblJlc3BvbnNlVjJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5JbnRlZ3JhdGlvblJlc3BvbnNlVjJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FwaUlkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmFwaUlkKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXBpSWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYXBpSWQpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjb250ZW50SGFuZGxpbmdTdHJhdGVneScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5jb250ZW50SGFuZGxpbmdTdHJhdGVneSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ludGVncmF0aW9uSWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuaW50ZWdyYXRpb25JZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ludGVncmF0aW9uSWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuaW50ZWdyYXRpb25JZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ludGVncmF0aW9uUmVzcG9uc2VLZXknLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuaW50ZWdyYXRpb25SZXNwb25zZUtleSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ludGVncmF0aW9uUmVzcG9uc2VLZXknLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuaW50ZWdyYXRpb25SZXNwb25zZUtleSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Jlc3BvbnNlUGFyYW1ldGVycycsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5yZXNwb25zZVBhcmFtZXRlcnMpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXNwb25zZVRlbXBsYXRlcycsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5yZXNwb25zZVRlbXBsYXRlcykpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RlbXBsYXRlU2VsZWN0aW9uRXhwcmVzc2lvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50ZW1wbGF0ZVNlbGVjdGlvbkV4cHJlc3Npb24pKTtcbiAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkludGVncmF0aW9uUmVzcG9uc2VWMlByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OkludGVncmF0aW9uUmVzcG9uc2VgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkludGVncmF0aW9uUmVzcG9uc2VWMlByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OkludGVncmF0aW9uUmVzcG9uc2VgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuSW50ZWdyYXRpb25SZXNwb25zZVYyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgQ2ZuSW50ZWdyYXRpb25SZXNwb25zZVYyUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICByZXR1cm4ge1xuICAgIEFwaUlkOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmFwaUlkKSxcbiAgICBJbnRlZ3JhdGlvbklkOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmludGVncmF0aW9uSWQpLFxuICAgIEludGVncmF0aW9uUmVzcG9uc2VLZXk6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuaW50ZWdyYXRpb25SZXNwb25zZUtleSksXG4gICAgQ29udGVudEhhbmRsaW5nU3RyYXRlZ3k6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuY29udGVudEhhbmRsaW5nU3RyYXRlZ3kpLFxuICAgIFJlc3BvbnNlUGFyYW1ldGVyczogY2RrLm9iamVjdFRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZXNwb25zZVBhcmFtZXRlcnMpLFxuICAgIFJlc3BvbnNlVGVtcGxhdGVzOiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJlc3BvbnNlVGVtcGxhdGVzKSxcbiAgICBUZW1wbGF0ZVNlbGVjdGlvbkV4cHJlc3Npb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudGVtcGxhdGVTZWxlY3Rpb25FeHByZXNzaW9uKSxcbiAgfTtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb25SZXNwb25zZWBcbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb25SZXNwb25zZVxuICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLmh0bWxcbiAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuSW50ZWdyYXRpb25SZXNwb25zZVYyIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gJ0FXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvblJlc3BvbnNlJztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvblJlc3BvbnNlLkFwaUlkYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLWFwaWlkXG4gICAqL1xuICBwdWJsaWMgYXBpSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvblJlc3BvbnNlLkludGVncmF0aW9uSWRgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UtaW50ZWdyYXRpb25pZFxuICAgKi9cbiAgcHVibGljIGludGVncmF0aW9uSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvblJlc3BvbnNlLkludGVncmF0aW9uUmVzcG9uc2VLZXlgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLWludGVncmF0aW9ucmVzcG9uc2UtaW50ZWdyYXRpb25yZXNwb25zZWtleVxuICAgKi9cbiAgcHVibGljIGludGVncmF0aW9uUmVzcG9uc2VLZXk6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvblJlc3BvbnNlLkNvbnRlbnRIYW5kbGluZ1N0cmF0ZWd5YFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLWNvbnRlbnRoYW5kbGluZ3N0cmF0ZWd5XG4gICAqL1xuICBwdWJsaWMgY29udGVudEhhbmRsaW5nU3RyYXRlZ3k6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvblJlc3BvbnNlLlJlc3BvbnNlUGFyYW1ldGVyc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb25yZXNwb25zZS5odG1sI2Nmbi1hcGlnYXRld2F5djItaW50ZWdyYXRpb25yZXNwb25zZS1yZXNwb25zZXBhcmFtZXRlcnNcbiAgICovXG4gIHB1YmxpYyByZXNwb25zZVBhcmFtZXRlcnM6IGFueSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvblJlc3BvbnNlLlJlc3BvbnNlVGVtcGxhdGVzYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnJlc3BvbnNlLXJlc3BvbnNldGVtcGxhdGVzXG4gICAqL1xuICBwdWJsaWMgcmVzcG9uc2VUZW1wbGF0ZXM6IGFueSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvblJlc3BvbnNlLlRlbXBsYXRlU2VsZWN0aW9uRXhwcmVzc2lvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItaW50ZWdyYXRpb25yZXNwb25zZS5odG1sI2Nmbi1hcGlnYXRld2F5djItaW50ZWdyYXRpb25yZXNwb25zZS10ZW1wbGF0ZXNlbGVjdGlvbmV4cHJlc3Npb25cbiAgICovXG4gIHB1YmxpYyB0ZW1wbGF0ZVNlbGVjdGlvbkV4cHJlc3Npb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb25SZXNwb25zZWAuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5JbnRlZ3JhdGlvblJlc3BvbnNlVjJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5JbnRlZ3JhdGlvblJlc3BvbnNlVjIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2FwaUlkJywgdGhpcyk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2ludGVncmF0aW9uSWQnLCB0aGlzKTtcbiAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnaW50ZWdyYXRpb25SZXNwb25zZUtleScsIHRoaXMpO1xuXG4gICAgdGhpcy5hcGlJZCA9IHByb3BzLmFwaUlkO1xuICAgIHRoaXMuaW50ZWdyYXRpb25JZCA9IHByb3BzLmludGVncmF0aW9uSWQ7XG4gICAgdGhpcy5pbnRlZ3JhdGlvblJlc3BvbnNlS2V5ID0gcHJvcHMuaW50ZWdyYXRpb25SZXNwb25zZUtleTtcbiAgICB0aGlzLmNvbnRlbnRIYW5kbGluZ1N0cmF0ZWd5ID0gcHJvcHMuY29udGVudEhhbmRsaW5nU3RyYXRlZ3k7XG4gICAgdGhpcy5yZXNwb25zZVBhcmFtZXRlcnMgPSBwcm9wcy5yZXNwb25zZVBhcmFtZXRlcnM7XG4gICAgdGhpcy5yZXNwb25zZVRlbXBsYXRlcyA9IHByb3BzLnJlc3BvbnNlVGVtcGxhdGVzO1xuICAgIHRoaXMudGVtcGxhdGVTZWxlY3Rpb25FeHByZXNzaW9uID0gcHJvcHMudGVtcGxhdGVTZWxlY3Rpb25FeHByZXNzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICpcbiAgICovXG4gIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKCdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGUnLCBDZm5JbnRlZ3JhdGlvblJlc3BvbnNlVjIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZSgnYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wcycsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFwaUlkOiB0aGlzLmFwaUlkLFxuICAgICAgaW50ZWdyYXRpb25JZDogdGhpcy5pbnRlZ3JhdGlvbklkLFxuICAgICAgaW50ZWdyYXRpb25SZXNwb25zZUtleTogdGhpcy5pbnRlZ3JhdGlvblJlc3BvbnNlS2V5LFxuICAgICAgY29udGVudEhhbmRsaW5nU3RyYXRlZ3k6IHRoaXMuY29udGVudEhhbmRsaW5nU3RyYXRlZ3ksXG4gICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHRoaXMucmVzcG9uc2VQYXJhbWV0ZXJzLFxuICAgICAgcmVzcG9uc2VUZW1wbGF0ZXM6IHRoaXMucmVzcG9uc2VUZW1wbGF0ZXMsXG4gICAgICB0ZW1wbGF0ZVNlbGVjdGlvbkV4cHJlc3Npb246IHRoaXMudGVtcGxhdGVTZWxlY3Rpb25FeHByZXNzaW9uLFxuICAgIH07XG4gIH1cbiAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIGNmbkludGVncmF0aW9uUmVzcG9uc2VWMlByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBBV1M6OkFwaUdhdGV3YXlWMjo6TW9kZWxgXG4gKlxuICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1tb2RlbC5odG1sXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5Nb2RlbFYyUHJvcHMge1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6Ok1vZGVsLkFwaUlkYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1tb2RlbC5odG1sI2Nmbi1hcGlnYXRld2F5djItbW9kZWwtYXBpaWRcbiAgICovXG4gIHJlYWRvbmx5IGFwaUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6TW9kZWwuTmFtZWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItbW9kZWwuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLW1vZGVsLW5hbWVcbiAgICovXG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpNb2RlbC5TY2hlbWFgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLW1vZGVsLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1tb2RlbC1zY2hlbWFcbiAgICovXG4gIHJlYWRvbmx5IHNjaGVtYTogYW55IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6Ok1vZGVsLkNvbnRlbnRUeXBlYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1tb2RlbC5odG1sI2Nmbi1hcGlnYXRld2F5djItbW9kZWwtY29udGVudHR5cGVcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRlbnRUeXBlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6Ok1vZGVsLkRlc2NyaXB0aW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1tb2RlbC5odG1sI2Nmbi1hcGlnYXRld2F5djItbW9kZWwtZGVzY3JpcHRpb25cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbk1vZGVsVjJQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuTW9kZWxWMlByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbk1vZGVsVjJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FwaUlkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmFwaUlkKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXBpSWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYXBpSWQpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjb250ZW50VHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5jb250ZW50VHlwZSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Rlc2NyaXB0aW9uJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRlc2NyaXB0aW9uKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5uYW1lKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5uYW1lKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc2NoZW1hJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnNjaGVtYSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3NjaGVtYScsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5zY2hlbWEpKTtcbiAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbk1vZGVsVjJQcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpNb2RlbGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuTW9kZWxWMlByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6Ok1vZGVsYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbk1vZGVsVjJQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICBDZm5Nb2RlbFYyUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICByZXR1cm4ge1xuICAgIEFwaUlkOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmFwaUlkKSxcbiAgICBOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm5hbWUpLFxuICAgIFNjaGVtYTogY2RrLm9iamVjdFRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zY2hlbWEpLFxuICAgIENvbnRlbnRUeXBlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNvbnRlbnRUeXBlKSxcbiAgICBEZXNjcmlwdGlvbjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kZXNjcmlwdGlvbiksXG4gIH07XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpBcGlHYXRld2F5VjI6Ok1vZGVsYFxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6QXBpR2F0ZXdheVYyOjpNb2RlbFxuICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1tb2RlbC5odG1sXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAqL1xuZXhwb3J0IGNsYXNzIENmbk1vZGVsVjIgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgLyoqXG4gICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSAnQVdTOjpBcGlHYXRld2F5VjI6Ok1vZGVsJztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpNb2RlbC5BcGlJZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItbW9kZWwuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLW1vZGVsLWFwaWlkXG4gICAqL1xuICBwdWJsaWMgYXBpSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpNb2RlbC5OYW1lYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1tb2RlbC5odG1sI2Nmbi1hcGlnYXRld2F5djItbW9kZWwtbmFtZVxuICAgKi9cbiAgcHVibGljIG5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpNb2RlbC5TY2hlbWFgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLW1vZGVsLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1tb2RlbC1zY2hlbWFcbiAgICovXG4gIHB1YmxpYyBzY2hlbWE6IGFueSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpNb2RlbC5Db250ZW50VHlwZWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItbW9kZWwuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLW1vZGVsLWNvbnRlbnR0eXBlXG4gICAqL1xuICBwdWJsaWMgY29udGVudFR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpNb2RlbC5EZXNjcmlwdGlvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItbW9kZWwuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLW1vZGVsLWRlc2NyaXB0aW9uXG4gICAqL1xuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OkFwaUdhdGV3YXlWMjo6TW9kZWxgLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuTW9kZWxWMlByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbk1vZGVsVjIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2FwaUlkJywgdGhpcyk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ25hbWUnLCB0aGlzKTtcbiAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnc2NoZW1hJywgdGhpcyk7XG5cbiAgICB0aGlzLmFwaUlkID0gcHJvcHMuYXBpSWQ7XG4gICAgdGhpcy5uYW1lID0gcHJvcHMubmFtZTtcbiAgICB0aGlzLnNjaGVtYSA9IHByb3BzLnNjaGVtYTtcbiAgICB0aGlzLmNvbnRlbnRUeXBlID0gcHJvcHMuY29udGVudFR5cGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IHByb3BzLmRlc2NyaXB0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICpcbiAgICovXG4gIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKCdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGUnLCBDZm5Nb2RlbFYyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHMnLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiB7XG4gICAgICBhcGlJZDogdGhpcy5hcGlJZCxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIHNjaGVtYTogdGhpcy5zY2hlbWEsXG4gICAgICBjb250ZW50VHlwZTogdGhpcy5jb250ZW50VHlwZSxcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgIH07XG4gIH1cbiAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIGNmbk1vZGVsVjJQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlYFxuICpcbiAqIEBzdGFiaWxpdHkgZGVwcmVjYXRlZFxuICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGUuaHRtbFxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuUm91dGVWMlByb3BzIHtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpSb3V0ZS5BcGlJZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGUuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXJvdXRlLWFwaWlkXG4gICAqL1xuICByZWFkb25seSBhcGlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlLlJvdXRlS2V5YFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGUtcm91dGVrZXlcbiAgICovXG4gIHJlYWRvbmx5IHJvdXRlS2V5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuQXBpS2V5UmVxdWlyZWRgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1hcGlrZXlyZXF1aXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgYXBpS2V5UmVxdWlyZWQ/OiBib29sZWFuIHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlLkF1dGhvcml6YXRpb25TY29wZXNgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1hdXRob3JpemF0aW9uc2NvcGVzXG4gICAqL1xuICByZWFkb25seSBhdXRob3JpemF0aW9uU2NvcGVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuQXV0aG9yaXphdGlvblR5cGVgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1hdXRob3JpemF0aW9udHlwZVxuICAgKi9cbiAgcmVhZG9ubHkgYXV0aG9yaXphdGlvblR5cGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuQXV0aG9yaXplcklkYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGUtYXV0aG9yaXplcmlkXG4gICAqL1xuICByZWFkb25seSBhdXRob3JpemVySWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuTW9kZWxTZWxlY3Rpb25FeHByZXNzaW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGUtbW9kZWxzZWxlY3Rpb25leHByZXNzaW9uXG4gICAqL1xuICByZWFkb25seSBtb2RlbFNlbGVjdGlvbkV4cHJlc3Npb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuT3BlcmF0aW9uTmFtZWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGUuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXJvdXRlLW9wZXJhdGlvbm5hbWVcbiAgICovXG4gIHJlYWRvbmx5IG9wZXJhdGlvbk5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuUmVxdWVzdE1vZGVsc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGUuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXJvdXRlLXJlcXVlc3Rtb2RlbHNcbiAgICovXG4gIHJlYWRvbmx5IHJlcXVlc3RNb2RlbHM/OiBhbnkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuUmVxdWVzdFBhcmFtZXRlcnNgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1yZXF1ZXN0cGFyYW1ldGVyc1xuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWVzdFBhcmFtZXRlcnM/OiBhbnkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuUm91dGVSZXNwb25zZVNlbGVjdGlvbkV4cHJlc3Npb25gXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1yb3V0ZXJlc3BvbnNlc2VsZWN0aW9uZXhwcmVzc2lvblxuICAgKi9cbiAgcmVhZG9ubHkgcm91dGVSZXNwb25zZVNlbGVjdGlvbkV4cHJlc3Npb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuVGFyZ2V0YFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGUtdGFyZ2V0XG4gICAqL1xuICByZWFkb25seSB0YXJnZXQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuUm91dGVWMlByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5Sb3V0ZVYyUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUm91dGVWMlByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXBpSWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuYXBpSWQpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhcGlJZCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5hcGlJZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FwaUtleVJlcXVpcmVkJywgY2RrLnZhbGlkYXRlQm9vbGVhbikocHJvcGVydGllcy5hcGlLZXlSZXF1aXJlZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2F1dGhvcml6YXRpb25TY29wZXMnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpKShwcm9wZXJ0aWVzLmF1dGhvcml6YXRpb25TY29wZXMpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhdXRob3JpemF0aW9uVHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5hdXRob3JpemF0aW9uVHlwZSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2F1dGhvcml6ZXJJZCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5hdXRob3JpemVySWQpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdtb2RlbFNlbGVjdGlvbkV4cHJlc3Npb24nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubW9kZWxTZWxlY3Rpb25FeHByZXNzaW9uKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignb3BlcmF0aW9uTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5vcGVyYXRpb25OYW1lKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVxdWVzdE1vZGVscycsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5yZXF1ZXN0TW9kZWxzKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVxdWVzdFBhcmFtZXRlcnMnLCBjZGsudmFsaWRhdGVPYmplY3QpKHByb3BlcnRpZXMucmVxdWVzdFBhcmFtZXRlcnMpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyb3V0ZUtleScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5yb3V0ZUtleSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JvdXRlS2V5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnJvdXRlS2V5KSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncm91dGVSZXNwb25zZVNlbGVjdGlvbkV4cHJlc3Npb24nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucm91dGVSZXNwb25zZVNlbGVjdGlvbkV4cHJlc3Npb24pKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YXJnZXQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudGFyZ2V0KSk7XG4gIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5Sb3V0ZVYyUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblJvdXRlVjJQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpSb3V0ZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5Sb3V0ZVYyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgQ2ZuUm91dGVWMlByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgcmV0dXJuIHtcbiAgICBBcGlJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hcGlJZCksXG4gICAgUm91dGVLZXk6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucm91dGVLZXkpLFxuICAgIEFwaUtleVJlcXVpcmVkOiBjZGsuYm9vbGVhblRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hcGlLZXlSZXF1aXJlZCksXG4gICAgQXV0aG9yaXphdGlvblNjb3BlczogY2RrLmxpc3RNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuYXV0aG9yaXphdGlvblNjb3BlcyksXG4gICAgQXV0aG9yaXphdGlvblR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXV0aG9yaXphdGlvblR5cGUpLFxuICAgIEF1dGhvcml6ZXJJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hdXRob3JpemVySWQpLFxuICAgIE1vZGVsU2VsZWN0aW9uRXhwcmVzc2lvbjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5tb2RlbFNlbGVjdGlvbkV4cHJlc3Npb24pLFxuICAgIE9wZXJhdGlvbk5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMub3BlcmF0aW9uTmFtZSksXG4gICAgUmVxdWVzdE1vZGVsczogY2RrLm9iamVjdFRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZXF1ZXN0TW9kZWxzKSxcbiAgICBSZXF1ZXN0UGFyYW1ldGVyczogY2RrLm9iamVjdFRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZXF1ZXN0UGFyYW1ldGVycyksXG4gICAgUm91dGVSZXNwb25zZVNlbGVjdGlvbkV4cHJlc3Npb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucm91dGVSZXNwb25zZVNlbGVjdGlvbkV4cHJlc3Npb24pLFxuICAgIFRhcmdldDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50YXJnZXQpLFxuICB9O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6QXBpR2F0ZXdheVYyOjpSb3V0ZWBcbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVcbiAqIEBzdGFiaWxpdHkgZGVwcmVjYXRlZFxuICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGUuaHRtbFxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5Sb3V0ZVYyIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gJ0FXUzo6QXBpR2F0ZXdheVYyOjpSb3V0ZSc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuQXBpSWRgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1hcGlpZFxuICAgKi9cbiAgcHVibGljIGFwaUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuUm91dGVLZXlgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1yb3V0ZWtleVxuICAgKi9cbiAgcHVibGljIHJvdXRlS2V5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuQXBpS2V5UmVxdWlyZWRgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1hcGlrZXlyZXF1aXJlZFxuICAgKi9cbiAgcHVibGljIGFwaUtleVJlcXVpcmVkOiBib29sZWFuIHwgY2RrLklSZXNvbHZhYmxlIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlLkF1dGhvcml6YXRpb25TY29wZXNgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1hdXRob3JpemF0aW9uc2NvcGVzXG4gICAqL1xuICBwdWJsaWMgYXV0aG9yaXphdGlvblNjb3Blczogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuQXV0aG9yaXphdGlvblR5cGVgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1hdXRob3JpemF0aW9udHlwZVxuICAgKi9cbiAgcHVibGljIGF1dGhvcml6YXRpb25UeXBlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuQXV0aG9yaXplcklkYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGUtYXV0aG9yaXplcmlkXG4gICAqL1xuICBwdWJsaWMgYXV0aG9yaXplcklkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuTW9kZWxTZWxlY3Rpb25FeHByZXNzaW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGUtbW9kZWxzZWxlY3Rpb25leHByZXNzaW9uXG4gICAqL1xuICBwdWJsaWMgbW9kZWxTZWxlY3Rpb25FeHByZXNzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuT3BlcmF0aW9uTmFtZWBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGUuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXJvdXRlLW9wZXJhdGlvbm5hbWVcbiAgICovXG4gIHB1YmxpYyBvcGVyYXRpb25OYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuUmVxdWVzdE1vZGVsc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGUuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXJvdXRlLXJlcXVlc3Rtb2RlbHNcbiAgICovXG4gIHB1YmxpYyByZXF1ZXN0TW9kZWxzOiBhbnkgfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuUmVxdWVzdFBhcmFtZXRlcnNgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1yZXF1ZXN0cGFyYW1ldGVyc1xuICAgKi9cbiAgcHVibGljIHJlcXVlc3RQYXJhbWV0ZXJzOiBhbnkgfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuUm91dGVSZXNwb25zZVNlbGVjdGlvbkV4cHJlc3Npb25gXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1yb3V0ZXJlc3BvbnNlc2VsZWN0aW9uZXhwcmVzc2lvblxuICAgKi9cbiAgcHVibGljIHJvdXRlUmVzcG9uc2VTZWxlY3Rpb25FeHByZXNzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUuVGFyZ2V0YFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGUtdGFyZ2V0XG4gICAqL1xuICBwdWJsaWMgdGFyZ2V0OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblJvdXRlVjJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5Sb3V0ZVYyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdhcGlJZCcsIHRoaXMpO1xuICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdyb3V0ZUtleScsIHRoaXMpO1xuXG4gICAgdGhpcy5hcGlJZCA9IHByb3BzLmFwaUlkO1xuICAgIHRoaXMucm91dGVLZXkgPSBwcm9wcy5yb3V0ZUtleTtcbiAgICB0aGlzLmFwaUtleVJlcXVpcmVkID0gcHJvcHMuYXBpS2V5UmVxdWlyZWQ7XG4gICAgdGhpcy5hdXRob3JpemF0aW9uU2NvcGVzID0gcHJvcHMuYXV0aG9yaXphdGlvblNjb3BlcztcbiAgICB0aGlzLmF1dGhvcml6YXRpb25UeXBlID0gcHJvcHMuYXV0aG9yaXphdGlvblR5cGU7XG4gICAgdGhpcy5hdXRob3JpemVySWQgPSBwcm9wcy5hdXRob3JpemVySWQ7XG4gICAgdGhpcy5tb2RlbFNlbGVjdGlvbkV4cHJlc3Npb24gPSBwcm9wcy5tb2RlbFNlbGVjdGlvbkV4cHJlc3Npb247XG4gICAgdGhpcy5vcGVyYXRpb25OYW1lID0gcHJvcHMub3BlcmF0aW9uTmFtZTtcbiAgICB0aGlzLnJlcXVlc3RNb2RlbHMgPSBwcm9wcy5yZXF1ZXN0TW9kZWxzO1xuICAgIHRoaXMucmVxdWVzdFBhcmFtZXRlcnMgPSBwcm9wcy5yZXF1ZXN0UGFyYW1ldGVycztcbiAgICB0aGlzLnJvdXRlUmVzcG9uc2VTZWxlY3Rpb25FeHByZXNzaW9uID0gcHJvcHMucm91dGVSZXNwb25zZVNlbGVjdGlvbkV4cHJlc3Npb247XG4gICAgdGhpcy50YXJnZXQgPSBwcm9wcy50YXJnZXQ7XG4gIH1cblxuICAvKipcbiAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICpcbiAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgKlxuICAgKi9cbiAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZScsIENmblJvdXRlVjIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZSgnYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wcycsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFwaUlkOiB0aGlzLmFwaUlkLFxuICAgICAgcm91dGVLZXk6IHRoaXMucm91dGVLZXksXG4gICAgICBhcGlLZXlSZXF1aXJlZDogdGhpcy5hcGlLZXlSZXF1aXJlZCxcbiAgICAgIGF1dGhvcml6YXRpb25TY29wZXM6IHRoaXMuYXV0aG9yaXphdGlvblNjb3BlcyxcbiAgICAgIGF1dGhvcml6YXRpb25UeXBlOiB0aGlzLmF1dGhvcml6YXRpb25UeXBlLFxuICAgICAgYXV0aG9yaXplcklkOiB0aGlzLmF1dGhvcml6ZXJJZCxcbiAgICAgIG1vZGVsU2VsZWN0aW9uRXhwcmVzc2lvbjogdGhpcy5tb2RlbFNlbGVjdGlvbkV4cHJlc3Npb24sXG4gICAgICBvcGVyYXRpb25OYW1lOiB0aGlzLm9wZXJhdGlvbk5hbWUsXG4gICAgICByZXF1ZXN0TW9kZWxzOiB0aGlzLnJlcXVlc3RNb2RlbHMsXG4gICAgICByZXF1ZXN0UGFyYW1ldGVyczogdGhpcy5yZXF1ZXN0UGFyYW1ldGVycyxcbiAgICAgIHJvdXRlUmVzcG9uc2VTZWxlY3Rpb25FeHByZXNzaW9uOiB0aGlzLnJvdXRlUmVzcG9uc2VTZWxlY3Rpb25FeHByZXNzaW9uLFxuICAgICAgdGFyZ2V0OiB0aGlzLnRhcmdldCxcbiAgICB9O1xuICB9XG4gIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiBjZm5Sb3V0ZVYyUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgfVxufVxuXG4vKipcbiAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICovXG5leHBvcnQgbmFtZXNwYWNlIENmblJvdXRlVjIge1xuICAvKipcbiAgICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItcm91dGUtcGFyYW1ldGVyY29uc3RyYWludHMuaHRtbFxuICAgKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAgICovXG4gIGV4cG9ydCBpbnRlcmZhY2UgUGFyYW1ldGVyQ29uc3RyYWludHNQcm9wZXJ0eSB7XG4gICAgLyoqXG4gICAgICogYENmblJvdXRlVjIuUGFyYW1ldGVyQ29uc3RyYWludHNQcm9wZXJ0eS5SZXF1aXJlZGBcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtYXBpZ2F0ZXdheXYyLXJvdXRlLXBhcmFtZXRlcmNvbnN0cmFpbnRzLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZS1wYXJhbWV0ZXJjb25zdHJhaW50cy1yZXF1aXJlZFxuICAgICAqL1xuICAgIHJlYWRvbmx5IHJlcXVpcmVkOiBib29sZWFuIHwgY2RrLklSZXNvbHZhYmxlO1xuICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUGFyYW1ldGVyQ29uc3RyYWludHNQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUGFyYW1ldGVyQ29uc3RyYWludHNQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5Sb3V0ZVYyX1BhcmFtZXRlckNvbnN0cmFpbnRzUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZXF1aXJlZCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5yZXF1aXJlZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlcXVpcmVkJywgY2RrLnZhbGlkYXRlQm9vbGVhbikocHJvcGVydGllcy5yZXF1aXJlZCkpO1xuICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiUGFyYW1ldGVyQ29uc3RyYWludHNQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpSb3V0ZS5QYXJhbWV0ZXJDb25zdHJhaW50c2AgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUGFyYW1ldGVyQ29uc3RyYWludHNQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpSb3V0ZS5QYXJhbWV0ZXJDb25zdHJhaW50c2AgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5Sb3V0ZVYyUGFyYW1ldGVyQ29uc3RyYWludHNQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICBDZm5Sb3V0ZVYyX1BhcmFtZXRlckNvbnN0cmFpbnRzUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICByZXR1cm4ge1xuICAgIFJlcXVpcmVkOiBjZGsuYm9vbGVhblRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZXF1aXJlZCksXG4gIH07XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlUmVzcG9uc2VgXG4gKlxuICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZXJlc3BvbnNlLmh0bWxcbiAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblJvdXRlUmVzcG9uc2VWMlByb3BzIHtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpSb3V0ZVJlc3BvbnNlLkFwaUlkYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZXJlc3BvbnNlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZXJlc3BvbnNlLWFwaWlkXG4gICAqL1xuICByZWFkb25seSBhcGlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlUmVzcG9uc2UuUm91dGVJZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS1yb3V0ZWlkXG4gICAqL1xuICByZWFkb25seSByb3V0ZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVSZXNwb25zZS5Sb3V0ZVJlc3BvbnNlS2V5YFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZXJlc3BvbnNlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZXJlc3BvbnNlLXJvdXRlcmVzcG9uc2VrZXlcbiAgICovXG4gIHJlYWRvbmx5IHJvdXRlUmVzcG9uc2VLZXk6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpSb3V0ZVJlc3BvbnNlLk1vZGVsU2VsZWN0aW9uRXhwcmVzc2lvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS1tb2RlbHNlbGVjdGlvbmV4cHJlc3Npb25cbiAgICovXG4gIHJlYWRvbmx5IG1vZGVsU2VsZWN0aW9uRXhwcmVzc2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpSb3V0ZVJlc3BvbnNlLlJlc3BvbnNlTW9kZWxzYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZXJlc3BvbnNlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZXJlc3BvbnNlLXJlc3BvbnNlbW9kZWxzXG4gICAqL1xuICByZWFkb25seSByZXNwb25zZU1vZGVscz86IGFueSB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpSb3V0ZVJlc3BvbnNlLlJlc3BvbnNlUGFyYW1ldGVyc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS1yZXNwb25zZXBhcmFtZXRlcnNcbiAgICovXG4gIHJlYWRvbmx5IHJlc3BvbnNlUGFyYW1ldGVycz86IGFueSB8IGNkay5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5Sb3V0ZVJlc3BvbnNlVjJQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUm91dGVSZXNwb25zZVYyUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuUm91dGVSZXNwb25zZVYyUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhcGlJZCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5hcGlJZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FwaUlkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmFwaUlkKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbW9kZWxTZWxlY3Rpb25FeHByZXNzaW9uJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm1vZGVsU2VsZWN0aW9uRXhwcmVzc2lvbikpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Jlc3BvbnNlTW9kZWxzJywgY2RrLnZhbGlkYXRlT2JqZWN0KShwcm9wZXJ0aWVzLnJlc3BvbnNlTW9kZWxzKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVzcG9uc2VQYXJhbWV0ZXJzJywgY2RrLnZhbGlkYXRlT2JqZWN0KShwcm9wZXJ0aWVzLnJlc3BvbnNlUGFyYW1ldGVycykpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JvdXRlSWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucm91dGVJZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JvdXRlSWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucm91dGVJZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JvdXRlUmVzcG9uc2VLZXknLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucm91dGVSZXNwb25zZUtleSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JvdXRlUmVzcG9uc2VLZXknLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucm91dGVSZXNwb25zZUtleSkpO1xuICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuUm91dGVSZXNwb25zZVYyUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVSZXNwb25zZWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuUm91dGVSZXNwb25zZVYyUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVSZXNwb25zZWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5Sb3V0ZVJlc3BvbnNlVjJQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICBDZm5Sb3V0ZVJlc3BvbnNlVjJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gIHJldHVybiB7XG4gICAgQXBpSWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXBpSWQpLFxuICAgIFJvdXRlSWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucm91dGVJZCksXG4gICAgUm91dGVSZXNwb25zZUtleTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yb3V0ZVJlc3BvbnNlS2V5KSxcbiAgICBNb2RlbFNlbGVjdGlvbkV4cHJlc3Npb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubW9kZWxTZWxlY3Rpb25FeHByZXNzaW9uKSxcbiAgICBSZXNwb25zZU1vZGVsczogY2RrLm9iamVjdFRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZXNwb25zZU1vZGVscyksXG4gICAgUmVzcG9uc2VQYXJhbWV0ZXJzOiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJlc3BvbnNlUGFyYW1ldGVycyksXG4gIH07XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlUmVzcG9uc2VgXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlUmVzcG9uc2VcbiAqIEBzdGFiaWxpdHkgZGVwcmVjYXRlZFxuICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS5odG1sXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAqL1xuZXhwb3J0IGNsYXNzIENmblJvdXRlUmVzcG9uc2VWMiBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAvKipcbiAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9ICdBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVSZXNwb25zZSc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVSZXNwb25zZS5BcGlJZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS1hcGlpZFxuICAgKi9cbiAgcHVibGljIGFwaUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVSZXNwb25zZS5Sb3V0ZUlkYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZXJlc3BvbnNlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZXJlc3BvbnNlLXJvdXRlaWRcbiAgICovXG4gIHB1YmxpYyByb3V0ZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVSZXNwb25zZS5Sb3V0ZVJlc3BvbnNlS2V5YFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1yb3V0ZXJlc3BvbnNlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1yb3V0ZXJlc3BvbnNlLXJvdXRlcmVzcG9uc2VrZXlcbiAgICovXG4gIHB1YmxpYyByb3V0ZVJlc3BvbnNlS2V5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVSZXNwb25zZS5Nb2RlbFNlbGVjdGlvbkV4cHJlc3Npb25gXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlcmVzcG9uc2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXJvdXRlcmVzcG9uc2UtbW9kZWxzZWxlY3Rpb25leHByZXNzaW9uXG4gICAqL1xuICBwdWJsaWMgbW9kZWxTZWxlY3Rpb25FeHByZXNzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVSZXNwb25zZS5SZXNwb25zZU1vZGVsc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS1yZXNwb25zZW1vZGVsc1xuICAgKi9cbiAgcHVibGljIHJlc3BvbnNlTW9kZWxzOiBhbnkgfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVSZXNwb25zZS5SZXNwb25zZVBhcmFtZXRlcnNgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXJvdXRlcmVzcG9uc2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXJvdXRlcmVzcG9uc2UtcmVzcG9uc2VwYXJhbWV0ZXJzXG4gICAqL1xuICBwdWJsaWMgcmVzcG9uc2VQYXJhbWV0ZXJzOiBhbnkgfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlUmVzcG9uc2VgLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUm91dGVSZXNwb25zZVYyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuUm91dGVSZXNwb25zZVYyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdhcGlJZCcsIHRoaXMpO1xuICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdyb3V0ZUlkJywgdGhpcyk7XG4gICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ3JvdXRlUmVzcG9uc2VLZXknLCB0aGlzKTtcblxuICAgIHRoaXMuYXBpSWQgPSBwcm9wcy5hcGlJZDtcbiAgICB0aGlzLnJvdXRlSWQgPSBwcm9wcy5yb3V0ZUlkO1xuICAgIHRoaXMucm91dGVSZXNwb25zZUtleSA9IHByb3BzLnJvdXRlUmVzcG9uc2VLZXk7XG4gICAgdGhpcy5tb2RlbFNlbGVjdGlvbkV4cHJlc3Npb24gPSBwcm9wcy5tb2RlbFNlbGVjdGlvbkV4cHJlc3Npb247XG4gICAgdGhpcy5yZXNwb25zZU1vZGVscyA9IHByb3BzLnJlc3BvbnNlTW9kZWxzO1xuICAgIHRoaXMucmVzcG9uc2VQYXJhbWV0ZXJzID0gcHJvcHMucmVzcG9uc2VQYXJhbWV0ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICpcbiAgICovXG4gIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKCdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGUnLCBDZm5Sb3V0ZVJlc3BvbnNlVjIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZSgnYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wcycsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFwaUlkOiB0aGlzLmFwaUlkLFxuICAgICAgcm91dGVJZDogdGhpcy5yb3V0ZUlkLFxuICAgICAgcm91dGVSZXNwb25zZUtleTogdGhpcy5yb3V0ZVJlc3BvbnNlS2V5LFxuICAgICAgbW9kZWxTZWxlY3Rpb25FeHByZXNzaW9uOiB0aGlzLm1vZGVsU2VsZWN0aW9uRXhwcmVzc2lvbixcbiAgICAgIHJlc3BvbnNlTW9kZWxzOiB0aGlzLnJlc3BvbnNlTW9kZWxzLFxuICAgICAgcmVzcG9uc2VQYXJhbWV0ZXJzOiB0aGlzLnJlc3BvbnNlUGFyYW1ldGVycyxcbiAgICB9O1xuICB9XG4gIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiBjZm5Sb3V0ZVJlc3BvbnNlVjJQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICB9XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuUm91dGVSZXNwb25zZVYyIHtcbiAgLyoqXG4gICAqIEBzdGFiaWxpdHkgZGVwcmVjYXRlZFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtYXBpZ2F0ZXdheXYyLXJvdXRlcmVzcG9uc2UtcGFyYW1ldGVyY29uc3RyYWludHMuaHRtbFxuICAgKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAgICovXG4gIGV4cG9ydCBpbnRlcmZhY2UgUGFyYW1ldGVyQ29uc3RyYWludHNQcm9wZXJ0eSB7XG4gICAgLyoqXG4gICAgICogYENmblJvdXRlUmVzcG9uc2VWMi5QYXJhbWV0ZXJDb25zdHJhaW50c1Byb3BlcnR5LlJlcXVpcmVkYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS1wYXJhbWV0ZXJjb25zdHJhaW50cy5odG1sI2Nmbi1hcGlnYXRld2F5djItcm91dGVyZXNwb25zZS1wYXJhbWV0ZXJjb25zdHJhaW50cy1yZXF1aXJlZFxuICAgICAqL1xuICAgIHJlYWRvbmx5IHJlcXVpcmVkOiBib29sZWFuIHwgY2RrLklSZXNvbHZhYmxlO1xuICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUGFyYW1ldGVyQ29uc3RyYWludHNQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUGFyYW1ldGVyQ29uc3RyYWludHNQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5Sb3V0ZVJlc3BvbnNlVjJfUGFyYW1ldGVyQ29uc3RyYWludHNQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JlcXVpcmVkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnJlcXVpcmVkKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncmVxdWlyZWQnLCBjZGsudmFsaWRhdGVCb29sZWFuKShwcm9wZXJ0aWVzLnJlcXVpcmVkKSk7XG4gIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJQYXJhbWV0ZXJDb25zdHJhaW50c1Byb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlUmVzcG9uc2UuUGFyYW1ldGVyQ29uc3RyYWludHNgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFBhcmFtZXRlckNvbnN0cmFpbnRzUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGVSZXNwb25zZS5QYXJhbWV0ZXJDb25zdHJhaW50c2AgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5Sb3V0ZVJlc3BvbnNlVjJQYXJhbWV0ZXJDb25zdHJhaW50c1Byb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gIENmblJvdXRlUmVzcG9uc2VWMl9QYXJhbWV0ZXJDb25zdHJhaW50c1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgcmV0dXJuIHtcbiAgICBSZXF1aXJlZDogY2RrLmJvb2xlYW5Ub0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVxdWlyZWQpLFxuICB9O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZWBcbiAqXG4gKiBAc3RhYmlsaXR5IGRlcHJlY2F0ZWRcbiAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXN0YWdlLmh0bWxcbiAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblN0YWdlVjJQcm9wcyB7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6U3RhZ2UuQXBpSWRgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXN0YWdlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS1hcGlpZFxuICAgKi9cbiAgcmVhZG9ubHkgYXBpSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5TdGFnZU5hbWVgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXN0YWdlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS1zdGFnZW5hbWVcbiAgICovXG4gIHJlYWRvbmx5IHN0YWdlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OlN0YWdlLkFjY2Vzc0xvZ1NldHRpbmdzYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1zdGFnZS5odG1sI2Nmbi1hcGlnYXRld2F5djItc3RhZ2UtYWNjZXNzbG9nc2V0dGluZ3NcbiAgICovXG4gIHJlYWRvbmx5IGFjY2Vzc0xvZ1NldHRpbmdzPzogQ2ZuU3RhZ2VWMi5BY2Nlc3NMb2dTZXR0aW5nc1Byb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OlN0YWdlLkF1dG9EZXBsb3lgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXN0YWdlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS1hdXRvZGVwbG95XG4gICAqL1xuICByZWFkb25seSBhdXRvRGVwbG95PzogYm9vbGVhbiB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5DbGllbnRDZXJ0aWZpY2F0ZUlkYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1zdGFnZS5odG1sI2Nmbi1hcGlnYXRld2F5djItc3RhZ2UtY2xpZW50Y2VydGlmaWNhdGVpZFxuICAgKi9cbiAgcmVhZG9ubHkgY2xpZW50Q2VydGlmaWNhdGVJZD86IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5EZWZhdWx0Um91dGVTZXR0aW5nc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItc3RhZ2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXN0YWdlLWRlZmF1bHRyb3V0ZXNldHRpbmdzXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0Um91dGVTZXR0aW5ncz86IENmblN0YWdlVjIuUm91dGVTZXR0aW5nc1Byb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OlN0YWdlLkRlcGxveW1lbnRJZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItc3RhZ2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXN0YWdlLWRlcGxveW1lbnRpZFxuICAgKi9cbiAgcmVhZG9ubHkgZGVwbG95bWVudElkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OlN0YWdlLkRlc2NyaXB0aW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1zdGFnZS5odG1sI2Nmbi1hcGlnYXRld2F5djItc3RhZ2UtZGVzY3JpcHRpb25cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OlN0YWdlLlJvdXRlU2V0dGluZ3NgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXN0YWdlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS1yb3V0ZXNldHRpbmdzXG4gICAqL1xuICByZWFkb25seSByb3V0ZVNldHRpbmdzPzogYW55IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OlN0YWdlLlN0YWdlVmFyaWFibGVzYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1zdGFnZS5odG1sI2Nmbi1hcGlnYXRld2F5djItc3RhZ2Utc3RhZ2V2YXJpYWJsZXNcbiAgICovXG4gIHJlYWRvbmx5IHN0YWdlVmFyaWFibGVzPzogYW55IHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gIC8qKlxuICAgKiBgQVdTOjpBcGlHYXRld2F5VjI6OlN0YWdlLlRhZ3NgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXN0YWdlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS10YWdzXG4gICAqL1xuICByZWFkb25seSB0YWdzPzogYW55O1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmblN0YWdlVjJQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuU3RhZ2VWMlByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblN0YWdlVjJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FjY2Vzc0xvZ1NldHRpbmdzJywgQ2ZuU3RhZ2VWMl9BY2Nlc3NMb2dTZXR0aW5nc1Byb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmFjY2Vzc0xvZ1NldHRpbmdzKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXBpSWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuYXBpSWQpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhcGlJZCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5hcGlJZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2F1dG9EZXBsb3knLCBjZGsudmFsaWRhdGVCb29sZWFuKShwcm9wZXJ0aWVzLmF1dG9EZXBsb3kpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjbGllbnRDZXJ0aWZpY2F0ZUlkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmNsaWVudENlcnRpZmljYXRlSWQpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZWZhdWx0Um91dGVTZXR0aW5ncycsIENmblN0YWdlVjJfUm91dGVTZXR0aW5nc1Byb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLmRlZmF1bHRSb3V0ZVNldHRpbmdzKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGVwbG95bWVudElkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRlcGxveW1lbnRJZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Rlc2NyaXB0aW9uJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRlc2NyaXB0aW9uKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncm91dGVTZXR0aW5ncycsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5yb3V0ZVNldHRpbmdzKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc3RhZ2VOYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnN0YWdlTmFtZSkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N0YWdlTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5zdGFnZU5hbWUpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzdGFnZVZhcmlhYmxlcycsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5zdGFnZVZhcmlhYmxlcykpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhZ3MnLCBjZGsudmFsaWRhdGVPYmplY3QpKHByb3BlcnRpZXMudGFncykpO1xuICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuU3RhZ2VWMlByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OlN0YWdlYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5TdGFnZVYyUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkFwaUdhdGV3YXlWMjo6U3RhZ2VgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuU3RhZ2VWMlByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gIENmblN0YWdlVjJQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gIHJldHVybiB7XG4gICAgQXBpSWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXBpSWQpLFxuICAgIFN0YWdlTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zdGFnZU5hbWUpLFxuICAgIEFjY2Vzc0xvZ1NldHRpbmdzOiBjZm5TdGFnZVYyQWNjZXNzTG9nU2V0dGluZ3NQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hY2Nlc3NMb2dTZXR0aW5ncyksXG4gICAgQXV0b0RlcGxveTogY2RrLmJvb2xlYW5Ub0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXV0b0RlcGxveSksXG4gICAgQ2xpZW50Q2VydGlmaWNhdGVJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5jbGllbnRDZXJ0aWZpY2F0ZUlkKSxcbiAgICBEZWZhdWx0Um91dGVTZXR0aW5nczogY2ZuU3RhZ2VWMlJvdXRlU2V0dGluZ3NQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kZWZhdWx0Um91dGVTZXR0aW5ncyksXG4gICAgRGVwbG95bWVudElkOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRlcGxveW1lbnRJZCksXG4gICAgRGVzY3JpcHRpb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGVzY3JpcHRpb24pLFxuICAgIFJvdXRlU2V0dGluZ3M6IGNkay5vYmplY3RUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucm91dGVTZXR0aW5ncyksXG4gICAgU3RhZ2VWYXJpYWJsZXM6IGNkay5vYmplY3RUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuc3RhZ2VWYXJpYWJsZXMpLFxuICAgIFRhZ3M6IGNkay5vYmplY3RUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudGFncyksXG4gIH07XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpBcGlHYXRld2F5VjI6OlN0YWdlYFxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZVxuICogQHN0YWJpbGl0eSBkZXByZWNhdGVkXG4gKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1zdGFnZS5odG1sXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlIGF3cy1hcGlnYXRld2F5djJcbiAqL1xuZXhwb3J0IGNsYXNzIENmblN0YWdlVjIgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgLyoqXG4gICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSAnQVdTOjpBcGlHYXRld2F5VjI6OlN0YWdlJztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5BcGlJZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItc3RhZ2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXN0YWdlLWFwaWlkXG4gICAqL1xuICBwdWJsaWMgYXBpSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5TdGFnZU5hbWVgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXN0YWdlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS1zdGFnZW5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGFnZU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5BY2Nlc3NMb2dTZXR0aW5nc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItc3RhZ2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXN0YWdlLWFjY2Vzc2xvZ3NldHRpbmdzXG4gICAqL1xuICBwdWJsaWMgYWNjZXNzTG9nU2V0dGluZ3M6IENmblN0YWdlVjIuQWNjZXNzTG9nU2V0dGluZ3NQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5BdXRvRGVwbG95YFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1zdGFnZS5odG1sI2Nmbi1hcGlnYXRld2F5djItc3RhZ2UtYXV0b2RlcGxveVxuICAgKi9cbiAgcHVibGljIGF1dG9EZXBsb3k6IGJvb2xlYW4gfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6U3RhZ2UuQ2xpZW50Q2VydGlmaWNhdGVJZGBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItc3RhZ2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXN0YWdlLWNsaWVudGNlcnRpZmljYXRlaWRcbiAgICovXG4gIHB1YmxpYyBjbGllbnRDZXJ0aWZpY2F0ZUlkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkFwaUdhdGV3YXlWMjo6U3RhZ2UuRGVmYXVsdFJvdXRlU2V0dGluZ3NgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXN0YWdlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS1kZWZhdWx0cm91dGVzZXR0aW5nc1xuICAgKi9cbiAgcHVibGljIGRlZmF1bHRSb3V0ZVNldHRpbmdzOiBDZm5TdGFnZVYyLlJvdXRlU2V0dGluZ3NQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5EZXBsb3ltZW50SWRgXG4gICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtYXBpZ2F0ZXdheXYyLXN0YWdlLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS1kZXBsb3ltZW50aWRcbiAgICovXG4gIHB1YmxpYyBkZXBsb3ltZW50SWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5EZXNjcmlwdGlvbmBcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItc3RhZ2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXN0YWdlLWRlc2NyaXB0aW9uXG4gICAqL1xuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5Sb3V0ZVNldHRpbmdzYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1zdGFnZS5odG1sI2Nmbi1hcGlnYXRld2F5djItc3RhZ2Utcm91dGVzZXR0aW5nc1xuICAgKi9cbiAgcHVibGljIHJvdXRlU2V0dGluZ3M6IGFueSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5TdGFnZVZhcmlhYmxlc2BcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5djItc3RhZ2UuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXN0YWdlLXN0YWdldmFyaWFibGVzXG4gICAqL1xuICBwdWJsaWMgc3RhZ2VWYXJpYWJsZXM6IGFueSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5UYWdzYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwaWdhdGV3YXl2Mi1zdGFnZS5odG1sI2Nmbi1hcGlnYXRld2F5djItc3RhZ2UtdGFnc1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRhZ3M6IGNkay5UYWdNYW5hZ2VyO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZWAuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5TdGFnZVYyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuU3RhZ2VWMi5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnYXBpSWQnLCB0aGlzKTtcbiAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnc3RhZ2VOYW1lJywgdGhpcyk7XG5cbiAgICB0aGlzLmFwaUlkID0gcHJvcHMuYXBpSWQ7XG4gICAgdGhpcy5zdGFnZU5hbWUgPSBwcm9wcy5zdGFnZU5hbWU7XG4gICAgdGhpcy5hY2Nlc3NMb2dTZXR0aW5ncyA9IHByb3BzLmFjY2Vzc0xvZ1NldHRpbmdzO1xuICAgIHRoaXMuYXV0b0RlcGxveSA9IHByb3BzLmF1dG9EZXBsb3k7XG4gICAgdGhpcy5jbGllbnRDZXJ0aWZpY2F0ZUlkID0gcHJvcHMuY2xpZW50Q2VydGlmaWNhdGVJZDtcbiAgICB0aGlzLmRlZmF1bHRSb3V0ZVNldHRpbmdzID0gcHJvcHMuZGVmYXVsdFJvdXRlU2V0dGluZ3M7XG4gICAgdGhpcy5kZXBsb3ltZW50SWQgPSBwcm9wcy5kZXBsb3ltZW50SWQ7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IHByb3BzLmRlc2NyaXB0aW9uO1xuICAgIHRoaXMucm91dGVTZXR0aW5ncyA9IHByb3BzLnJvdXRlU2V0dGluZ3M7XG4gICAgdGhpcy5zdGFnZVZhcmlhYmxlcyA9IHByb3BzLnN0YWdlVmFyaWFibGVzO1xuICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5NQVAsICdBV1M6OkFwaUdhdGV3YXlWMjo6U3RhZ2UnLCBwcm9wcy50YWdzLCB7IHRhZ1Byb3BlcnR5TmFtZTogJ3RhZ3MnIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICpcbiAgICovXG4gIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKCdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGUnLCBDZm5TdGFnZVYyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHMnLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiB7XG4gICAgICBhcGlJZDogdGhpcy5hcGlJZCxcbiAgICAgIHN0YWdlTmFtZTogdGhpcy5zdGFnZU5hbWUsXG4gICAgICBhY2Nlc3NMb2dTZXR0aW5nczogdGhpcy5hY2Nlc3NMb2dTZXR0aW5ncyxcbiAgICAgIGF1dG9EZXBsb3k6IHRoaXMuYXV0b0RlcGxveSxcbiAgICAgIGNsaWVudENlcnRpZmljYXRlSWQ6IHRoaXMuY2xpZW50Q2VydGlmaWNhdGVJZCxcbiAgICAgIGRlZmF1bHRSb3V0ZVNldHRpbmdzOiB0aGlzLmRlZmF1bHRSb3V0ZVNldHRpbmdzLFxuICAgICAgZGVwbG95bWVudElkOiB0aGlzLmRlcGxveW1lbnRJZCxcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgcm91dGVTZXR0aW5nczogdGhpcy5yb3V0ZVNldHRpbmdzLFxuICAgICAgc3RhZ2VWYXJpYWJsZXM6IHRoaXMuc3RhZ2VWYXJpYWJsZXMsXG4gICAgICB0YWdzOiB0aGlzLnRhZ3MucmVuZGVyVGFncygpLFxuICAgIH07XG4gIH1cbiAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIGNmblN0YWdlVjJQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICB9XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuU3RhZ2VWMiB7XG4gIC8qKlxuICAgKiBAc3RhYmlsaXR5IGRlcHJlY2F0ZWRcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1zdGFnZS1hY2Nlc3Nsb2dzZXR0aW5ncy5odG1sXG4gICAqIEBkZXByZWNhdGVkIG1vdmVkIHRvIHBhY2thZ2UgYXdzLWFwaWdhdGV3YXl2MlxuICAgKi9cbiAgZXhwb3J0IGludGVyZmFjZSBBY2Nlc3NMb2dTZXR0aW5nc1Byb3BlcnR5IHtcbiAgICAvKipcbiAgICAgKiBgQ2ZuU3RhZ2VWMi5BY2Nlc3NMb2dTZXR0aW5nc1Byb3BlcnR5LkRlc3RpbmF0aW9uQXJuYFxuICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5djItc3RhZ2UtYWNjZXNzbG9nc2V0dGluZ3MuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXN0YWdlLWFjY2Vzc2xvZ3NldHRpbmdzLWRlc3RpbmF0aW9uYXJuXG4gICAgICovXG4gICAgcmVhZG9ubHkgZGVzdGluYXRpb25Bcm4/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogYENmblN0YWdlVjIuQWNjZXNzTG9nU2V0dGluZ3NQcm9wZXJ0eS5Gb3JtYXRgXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1zdGFnZS1hY2Nlc3Nsb2dzZXR0aW5ncy5odG1sI2Nmbi1hcGlnYXRld2F5djItc3RhZ2UtYWNjZXNzbG9nc2V0dGluZ3MtZm9ybWF0XG4gICAgICovXG4gICAgcmVhZG9ubHkgZm9ybWF0Pzogc3RyaW5nO1xuICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQWNjZXNzTG9nU2V0dGluZ3NQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQWNjZXNzTG9nU2V0dGluZ3NQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5TdGFnZVYyX0FjY2Vzc0xvZ1NldHRpbmdzUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZXN0aW5hdGlvbkFybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kZXN0aW5hdGlvbkFybikpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Zvcm1hdCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5mb3JtYXQpKTtcbiAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkFjY2Vzc0xvZ1NldHRpbmdzUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkFwaUdhdGV3YXlWMjo6U3RhZ2UuQWNjZXNzTG9nU2V0dGluZ3NgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEFjY2Vzc0xvZ1NldHRpbmdzUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OkFwaUdhdGV3YXlWMjo6U3RhZ2UuQWNjZXNzTG9nU2V0dGluZ3NgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuU3RhZ2VWMkFjY2Vzc0xvZ1NldHRpbmdzUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgQ2ZuU3RhZ2VWMl9BY2Nlc3NMb2dTZXR0aW5nc1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgcmV0dXJuIHtcbiAgICBEZXN0aW5hdGlvbkFybjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kZXN0aW5hdGlvbkFybiksXG4gICAgRm9ybWF0OiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmZvcm1hdCksXG4gIH07XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuU3RhZ2VWMiB7XG4gIC8qKlxuICAgKiBAc3RhYmlsaXR5IGRlcHJlY2F0ZWRcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1zdGFnZS1yb3V0ZXNldHRpbmdzLmh0bWxcbiAgICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSBhd3MtYXBpZ2F0ZXdheXYyXG4gICAqL1xuICBleHBvcnQgaW50ZXJmYWNlIFJvdXRlU2V0dGluZ3NQcm9wZXJ0eSB7XG4gICAgLyoqXG4gICAgICogYENmblN0YWdlVjIuUm91dGVTZXR0aW5nc1Byb3BlcnR5LkRhdGFUcmFjZUVuYWJsZWRgXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1zdGFnZS1yb3V0ZXNldHRpbmdzLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS1yb3V0ZXNldHRpbmdzLWRhdGF0cmFjZWVuYWJsZWRcbiAgICAgKi9cbiAgICByZWFkb25seSBkYXRhVHJhY2VFbmFibGVkPzogYm9vbGVhbiB8IGNkay5JUmVzb2x2YWJsZTtcbiAgICAvKipcbiAgICAgKiBgQ2ZuU3RhZ2VWMi5Sb3V0ZVNldHRpbmdzUHJvcGVydHkuRGV0YWlsZWRNZXRyaWNzRW5hYmxlZGBcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtYXBpZ2F0ZXdheXYyLXN0YWdlLXJvdXRlc2V0dGluZ3MuaHRtbCNjZm4tYXBpZ2F0ZXdheXYyLXN0YWdlLXJvdXRlc2V0dGluZ3MtZGV0YWlsZWRtZXRyaWNzZW5hYmxlZFxuICAgICAqL1xuICAgIHJlYWRvbmx5IGRldGFpbGVkTWV0cmljc0VuYWJsZWQ/OiBib29sZWFuIHwgY2RrLklSZXNvbHZhYmxlO1xuICAgIC8qKlxuICAgICAqIGBDZm5TdGFnZVYyLlJvdXRlU2V0dGluZ3NQcm9wZXJ0eS5Mb2dnaW5nTGV2ZWxgXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1zdGFnZS1yb3V0ZXNldHRpbmdzLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS1yb3V0ZXNldHRpbmdzLWxvZ2dpbmdsZXZlbFxuICAgICAqL1xuICAgIHJlYWRvbmx5IGxvZ2dpbmdMZXZlbD86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBgQ2ZuU3RhZ2VWMi5Sb3V0ZVNldHRpbmdzUHJvcGVydHkuVGhyb3R0bGluZ0J1cnN0TGltaXRgXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1zdGFnZS1yb3V0ZXNldHRpbmdzLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS1yb3V0ZXNldHRpbmdzLXRocm90dGxpbmdidXJzdGxpbWl0XG4gICAgICovXG4gICAgcmVhZG9ubHkgdGhyb3R0bGluZ0J1cnN0TGltaXQ/OiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogYENmblN0YWdlVjIuUm91dGVTZXR0aW5nc1Byb3BlcnR5LlRocm90dGxpbmdSYXRlTGltaXRgXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFwaWdhdGV3YXl2Mi1zdGFnZS1yb3V0ZXNldHRpbmdzLmh0bWwjY2ZuLWFwaWdhdGV3YXl2Mi1zdGFnZS1yb3V0ZXNldHRpbmdzLXRocm90dGxpbmdyYXRlbGltaXRcbiAgICAgKi9cbiAgICByZWFkb25seSB0aHJvdHRsaW5nUmF0ZUxpbWl0PzogbnVtYmVyO1xuICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUm91dGVTZXR0aW5nc1Byb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBSb3V0ZVNldHRpbmdzUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuU3RhZ2VWMl9Sb3V0ZVNldHRpbmdzUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkYXRhVHJhY2VFbmFibGVkJywgY2RrLnZhbGlkYXRlQm9vbGVhbikocHJvcGVydGllcy5kYXRhVHJhY2VFbmFibGVkKSk7XG4gIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGV0YWlsZWRNZXRyaWNzRW5hYmxlZCcsIGNkay52YWxpZGF0ZUJvb2xlYW4pKHByb3BlcnRpZXMuZGV0YWlsZWRNZXRyaWNzRW5hYmxlZCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvZ2dpbmdMZXZlbCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5sb2dnaW5nTGV2ZWwpKTtcbiAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0aHJvdHRsaW5nQnVyc3RMaW1pdCcsIGNkay52YWxpZGF0ZU51bWJlcikocHJvcGVydGllcy50aHJvdHRsaW5nQnVyc3RMaW1pdCkpO1xuICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Rocm90dGxpbmdSYXRlTGltaXQnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMudGhyb3R0bGluZ1JhdGVMaW1pdCkpO1xuICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiUm91dGVTZXR0aW5nc1Byb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpBcGlHYXRld2F5VjI6OlN0YWdlLlJvdXRlU2V0dGluZ3NgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFJvdXRlU2V0dGluZ3NQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6QXBpR2F0ZXdheVYyOjpTdGFnZS5Sb3V0ZVNldHRpbmdzYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblN0YWdlVjJSb3V0ZVNldHRpbmdzUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgQ2ZuU3RhZ2VWMl9Sb3V0ZVNldHRpbmdzUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICByZXR1cm4ge1xuICAgIERhdGFUcmFjZUVuYWJsZWQ6IGNkay5ib29sZWFuVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRhdGFUcmFjZUVuYWJsZWQpLFxuICAgIERldGFpbGVkTWV0cmljc0VuYWJsZWQ6IGNkay5ib29sZWFuVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRldGFpbGVkTWV0cmljc0VuYWJsZWQpLFxuICAgIExvZ2dpbmdMZXZlbDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5sb2dnaW5nTGV2ZWwpLFxuICAgIFRocm90dGxpbmdCdXJzdExpbWl0OiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRocm90dGxpbmdCdXJzdExpbWl0KSxcbiAgICBUaHJvdHRsaW5nUmF0ZUxpbWl0OiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnRocm90dGxpbmdSYXRlTGltaXQpLFxuICB9O1xufVxuIl19