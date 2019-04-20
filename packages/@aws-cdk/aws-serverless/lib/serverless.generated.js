"use strict";
// Copyright 2012-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2019-03-21T09:12:23.615Z","fingerprint":"UJ42fezBazlHPOkm0pNitOMM9peubfGEd2/XcTwSlsI="}
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-line-length | This is generated code - line lengths are difficult to control
const cdk = require("@aws-cdk/cdk");
/**
 * Determine whether the given properties match those of a `CfnApiProps`
 *
 * @param properties - the TypeScript properties of a `CfnApiProps`
 *
 * @returns the result of the validation.
 */
function CfnApiPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('auth', CfnApi_AuthPropertyValidator)(properties.auth));
    errors.collect(cdk.propertyValidator('binaryMediaTypes', cdk.listValidator(cdk.validateString))(properties.binaryMediaTypes));
    errors.collect(cdk.propertyValidator('cacheClusterEnabled', cdk.validateBoolean)(properties.cacheClusterEnabled));
    errors.collect(cdk.propertyValidator('cacheClusterSize', cdk.validateString)(properties.cacheClusterSize));
    errors.collect(cdk.propertyValidator('cors', cdk.validateString)(properties.cors));
    errors.collect(cdk.propertyValidator('definitionBody', cdk.validateObject)(properties.definitionBody));
    errors.collect(cdk.propertyValidator('definitionUri', cdk.unionValidator(CfnApi_S3LocationPropertyValidator, cdk.validateString))(properties.definitionUri));
    errors.collect(cdk.propertyValidator('endpointConfiguration', cdk.validateString)(properties.endpointConfiguration));
    errors.collect(cdk.propertyValidator('methodSettings', cdk.validateObject)(properties.methodSettings));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('stageName', cdk.requiredValidator)(properties.stageName));
    errors.collect(cdk.propertyValidator('stageName', cdk.validateString)(properties.stageName));
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
function cfnApiPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnApiPropsValidator(properties).assertSuccess();
    return {
        StageName: cdk.stringToCloudFormation(properties.stageName),
        Auth: cfnApiAuthPropertyToCloudFormation(properties.auth),
        BinaryMediaTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.binaryMediaTypes),
        CacheClusterEnabled: cdk.booleanToCloudFormation(properties.cacheClusterEnabled),
        CacheClusterSize: cdk.stringToCloudFormation(properties.cacheClusterSize),
        Cors: cdk.stringToCloudFormation(properties.cors),
        DefinitionBody: cdk.objectToCloudFormation(properties.definitionBody),
        DefinitionUri: cdk.unionMapper([CfnApi_S3LocationPropertyValidator, cdk.validateString], [cfnApiS3LocationPropertyToCloudFormation, cdk.stringToCloudFormation])(properties.definitionUri),
        EndpointConfiguration: cdk.stringToCloudFormation(properties.endpointConfiguration),
        MethodSettings: cdk.objectToCloudFormation(properties.methodSettings),
        Name: cdk.stringToCloudFormation(properties.name),
        Variables: cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables),
    };
}
/**
 * A CloudFormation `AWS::Serverless::Api`
 *
 * @cloudformationResource AWS::Serverless::Api
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
 */
class CfnApi extends cdk.CfnResource {
    /**
     * Create a new `AWS::Serverless::Api`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnApi.resourceTypeName, properties: props });
        cdk.requireProperty(props, 'stageName', this);
        // If a different transform than the required one is in use, this resource cannot be used
        if (this.node.stack.templateOptions.transform && this.node.stack.templateOptions.transform !== CfnApi.requiredTransform) {
            throw new Error(`The ${JSON.stringify(CfnApi.requiredTransform)} transform is required when using CfnApi, but the ${JSON.stringify(this.node.stack.templateOptions.transform)} is used.`);
        }
        // Automatically configure the required transform
        this.node.stack.templateOptions.transform = CfnApi.requiredTransform;
        this.apiName = this.ref.toString();
    }
    get propertyOverrides() {
        return this.untypedPropertyOverrides;
    }
    renderProperties(properties) {
        return cfnApiPropsToCloudFormation(this.node.resolve(properties));
    }
}
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnApi.resourceTypeName = "AWS::Serverless::Api";
/**
 * The `Transform` a template must use in order to use this resource
 */
CfnApi.requiredTransform = "AWS::Serverless-2016-10-31";
exports.CfnApi = CfnApi;
/**
 * Determine whether the given properties match those of a `AuthProperty`
 *
 * @param properties - the TypeScript properties of a `AuthProperty`
 *
 * @returns the result of the validation.
 */
function CfnApi_AuthPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnApiAuthPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnApi_AuthPropertyValidator(properties).assertSuccess();
    return {
        Authorizers: cdk.objectToCloudFormation(properties.authorizers),
        DefaultAuthorizer: cdk.stringToCloudFormation(properties.defaultAuthorizer),
    };
}
/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApi_S3LocationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnApiS3LocationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnApi_S3LocationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Key: cdk.stringToCloudFormation(properties.key),
        Version: cdk.numberToCloudFormation(properties.version),
    };
}
/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnApplicationPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnApplicationPropsValidator(properties).assertSuccess();
    return {
        Location: cdk.unionMapper([CfnApplication_ApplicationLocationPropertyValidator, cdk.validateString], [cfnApplicationApplicationLocationPropertyToCloudFormation, cdk.stringToCloudFormation])(properties.location),
        NotificationArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationArns),
        Parameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        TimeoutInMinutes: cdk.numberToCloudFormation(properties.timeoutInMinutes),
    };
}
/**
 * A CloudFormation `AWS::Serverless::Application`
 *
 * @cloudformationResource AWS::Serverless::Application
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
 */
class CfnApplication extends cdk.CfnResource {
    /**
     * Create a new `AWS::Serverless::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnApplication.resourceTypeName, properties: props });
        cdk.requireProperty(props, 'location', this);
        // If a different transform than the required one is in use, this resource cannot be used
        if (this.node.stack.templateOptions.transform && this.node.stack.templateOptions.transform !== CfnApplication.requiredTransform) {
            throw new Error(`The ${JSON.stringify(CfnApplication.requiredTransform)} transform is required when using CfnApplication, but the ${JSON.stringify(this.node.stack.templateOptions.transform)} is used.`);
        }
        // Automatically configure the required transform
        this.node.stack.templateOptions.transform = CfnApplication.requiredTransform;
        this.applicationName = this.ref.toString();
        const tags = props === undefined ? undefined : props.tags;
        this.tags = new cdk.TagManager(cdk.TagType.Map, "AWS::Serverless::Application", tags);
    }
    get propertyOverrides() {
        return this.untypedPropertyOverrides;
    }
    renderProperties(properties) {
        return cfnApplicationPropsToCloudFormation(this.node.resolve(properties));
    }
}
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnApplication.resourceTypeName = "AWS::Serverless::Application";
/**
 * The `Transform` a template must use in order to use this resource
 */
CfnApplication.requiredTransform = "AWS::Serverless-2016-10-31";
exports.CfnApplication = CfnApplication;
/**
 * Determine whether the given properties match those of a `ApplicationLocationProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ApplicationLocationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnApplicationApplicationLocationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnApplication_ApplicationLocationPropertyValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        SemanticVersion: cdk.stringToCloudFormation(properties.semanticVersion),
    };
}
/**
 * Determine whether the given properties match those of a `CfnFunctionProps`
 *
 * @param properties - the TypeScript properties of a `CfnFunctionProps`
 *
 * @returns the result of the validation.
 */
function CfnFunctionPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('autoPublishAlias', cdk.validateString)(properties.autoPublishAlias));
    errors.collect(cdk.propertyValidator('codeUri', cdk.requiredValidator)(properties.codeUri));
    errors.collect(cdk.propertyValidator('codeUri', cdk.unionValidator(CfnFunction_S3LocationPropertyValidator, cdk.validateString))(properties.codeUri));
    errors.collect(cdk.propertyValidator('deadLetterQueue', CfnFunction_DeadLetterQueuePropertyValidator)(properties.deadLetterQueue));
    errors.collect(cdk.propertyValidator('deploymentPreference', CfnFunction_DeploymentPreferencePropertyValidator)(properties.deploymentPreference));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('environment', CfnFunction_FunctionEnvironmentPropertyValidator)(properties.environment));
    errors.collect(cdk.propertyValidator('events', cdk.hashValidator(CfnFunction_EventSourcePropertyValidator))(properties.events));
    errors.collect(cdk.propertyValidator('functionName', cdk.validateString)(properties.functionName));
    errors.collect(cdk.propertyValidator('handler', cdk.requiredValidator)(properties.handler));
    errors.collect(cdk.propertyValidator('handler', cdk.validateString)(properties.handler));
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('layers', cdk.listValidator(cdk.validateString))(properties.layers));
    errors.collect(cdk.propertyValidator('memorySize', cdk.validateNumber)(properties.memorySize));
    errors.collect(cdk.propertyValidator('policies', cdk.unionValidator(cdk.unionValidator(CfnFunction_IAMPolicyDocumentPropertyValidator, cdk.validateString), cdk.listValidator(cdk.unionValidator(CfnFunction_IAMPolicyDocumentPropertyValidator, cdk.validateString))))(properties.policies));
    errors.collect(cdk.propertyValidator('reservedConcurrentExecutions', cdk.validateNumber)(properties.reservedConcurrentExecutions));
    errors.collect(cdk.propertyValidator('role', cdk.validateString)(properties.role));
    errors.collect(cdk.propertyValidator('runtime', cdk.requiredValidator)(properties.runtime));
    errors.collect(cdk.propertyValidator('runtime', cdk.validateString)(properties.runtime));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('timeout', cdk.validateNumber)(properties.timeout));
    errors.collect(cdk.propertyValidator('tracing', cdk.validateString)(properties.tracing));
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
function cfnFunctionPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunctionPropsValidator(properties).assertSuccess();
    return {
        CodeUri: cdk.unionMapper([CfnFunction_S3LocationPropertyValidator, cdk.validateString], [cfnFunctionS3LocationPropertyToCloudFormation, cdk.stringToCloudFormation])(properties.codeUri),
        Handler: cdk.stringToCloudFormation(properties.handler),
        Runtime: cdk.stringToCloudFormation(properties.runtime),
        AutoPublishAlias: cdk.stringToCloudFormation(properties.autoPublishAlias),
        DeadLetterQueue: cfnFunctionDeadLetterQueuePropertyToCloudFormation(properties.deadLetterQueue),
        DeploymentPreference: cfnFunctionDeploymentPreferencePropertyToCloudFormation(properties.deploymentPreference),
        Description: cdk.stringToCloudFormation(properties.description),
        Environment: cfnFunctionFunctionEnvironmentPropertyToCloudFormation(properties.environment),
        Events: cdk.hashMapper(cfnFunctionEventSourcePropertyToCloudFormation)(properties.events),
        FunctionName: cdk.stringToCloudFormation(properties.functionName),
        KmsKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        Layers: cdk.listMapper(cdk.stringToCloudFormation)(properties.layers),
        MemorySize: cdk.numberToCloudFormation(properties.memorySize),
        Policies: cdk.unionMapper([cdk.unionValidator(CfnFunction_IAMPolicyDocumentPropertyValidator, cdk.validateString), cdk.listValidator(cdk.unionValidator(CfnFunction_IAMPolicyDocumentPropertyValidator, cdk.validateString))], [cdk.unionMapper([CfnFunction_IAMPolicyDocumentPropertyValidator, cdk.validateString], [cfnFunctionIAMPolicyDocumentPropertyToCloudFormation, cdk.stringToCloudFormation]), cdk.listMapper(cdk.unionMapper([CfnFunction_IAMPolicyDocumentPropertyValidator, cdk.validateString], [cfnFunctionIAMPolicyDocumentPropertyToCloudFormation, cdk.stringToCloudFormation]))])(properties.policies),
        ReservedConcurrentExecutions: cdk.numberToCloudFormation(properties.reservedConcurrentExecutions),
        Role: cdk.stringToCloudFormation(properties.role),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        Timeout: cdk.numberToCloudFormation(properties.timeout),
        Tracing: cdk.stringToCloudFormation(properties.tracing),
        VpcConfig: cfnFunctionVpcConfigPropertyToCloudFormation(properties.vpcConfig),
    };
}
/**
 * A CloudFormation `AWS::Serverless::Function`
 *
 * @cloudformationResource AWS::Serverless::Function
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
 */
class CfnFunction extends cdk.CfnResource {
    /**
     * Create a new `AWS::Serverless::Function`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnFunction.resourceTypeName, properties: props });
        cdk.requireProperty(props, 'codeUri', this);
        cdk.requireProperty(props, 'handler', this);
        cdk.requireProperty(props, 'runtime', this);
        // If a different transform than the required one is in use, this resource cannot be used
        if (this.node.stack.templateOptions.transform && this.node.stack.templateOptions.transform !== CfnFunction.requiredTransform) {
            throw new Error(`The ${JSON.stringify(CfnFunction.requiredTransform)} transform is required when using CfnFunction, but the ${JSON.stringify(this.node.stack.templateOptions.transform)} is used.`);
        }
        // Automatically configure the required transform
        this.node.stack.templateOptions.transform = CfnFunction.requiredTransform;
        this.functionName = this.ref.toString();
        const tags = props === undefined ? undefined : props.tags;
        this.tags = new cdk.TagManager(cdk.TagType.Map, "AWS::Serverless::Function", tags);
    }
    get propertyOverrides() {
        return this.untypedPropertyOverrides;
    }
    renderProperties(properties) {
        return cfnFunctionPropsToCloudFormation(this.node.resolve(properties));
    }
}
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnFunction.resourceTypeName = "AWS::Serverless::Function";
/**
 * The `Transform` a template must use in order to use this resource
 */
CfnFunction.requiredTransform = "AWS::Serverless-2016-10-31";
exports.CfnFunction = CfnFunction;
/**
 * Determine whether the given properties match those of a `AlexaSkillEventProperty`
 *
 * @param properties - the TypeScript properties of a `AlexaSkillEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_AlexaSkillEventPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnFunctionAlexaSkillEventPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_AlexaSkillEventPropertyValidator(properties).assertSuccess();
    return {
        Variables: cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables),
    };
}
/**
 * Determine whether the given properties match those of a `ApiEventProperty`
 *
 * @param properties - the TypeScript properties of a `ApiEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_ApiEventPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('method', cdk.requiredValidator)(properties.method));
    errors.collect(cdk.propertyValidator('method', cdk.validateString)(properties.method));
    errors.collect(cdk.propertyValidator('path', cdk.requiredValidator)(properties.path));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
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
function cfnFunctionApiEventPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_ApiEventPropertyValidator(properties).assertSuccess();
    return {
        Method: cdk.stringToCloudFormation(properties.method),
        Path: cdk.stringToCloudFormation(properties.path),
        RestApiId: cdk.stringToCloudFormation(properties.restApiId),
    };
}
/**
 * Determine whether the given properties match those of a `CloudWatchEventEventProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchEventEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_CloudWatchEventEventPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnFunctionCloudWatchEventEventPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_CloudWatchEventEventPropertyValidator(properties).assertSuccess();
    return {
        Input: cdk.stringToCloudFormation(properties.input),
        InputPath: cdk.stringToCloudFormation(properties.inputPath),
        Pattern: cdk.objectToCloudFormation(properties.pattern),
    };
}
/**
 * Determine whether the given properties match those of a `DeadLetterQueueProperty`
 *
 * @param properties - the TypeScript properties of a `DeadLetterQueueProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_DeadLetterQueuePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnFunctionDeadLetterQueuePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_DeadLetterQueuePropertyValidator(properties).assertSuccess();
    return {
        TargetArn: cdk.stringToCloudFormation(properties.targetArn),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}
/**
 * Determine whether the given properties match those of a `DeploymentPreferenceProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentPreferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_DeploymentPreferencePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('alarms', cdk.listValidator(cdk.validateString))(properties.alarms));
    errors.collect(cdk.propertyValidator('hooks', cdk.listValidator(cdk.validateString))(properties.hooks));
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
function cfnFunctionDeploymentPreferencePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_DeploymentPreferencePropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        Type: cdk.stringToCloudFormation(properties.type),
        Alarms: cdk.listMapper(cdk.stringToCloudFormation)(properties.alarms),
        Hooks: cdk.listMapper(cdk.stringToCloudFormation)(properties.hooks),
    };
}
/**
 * Determine whether the given properties match those of a `DynamoDBEventProperty`
 *
 * @param properties - the TypeScript properties of a `DynamoDBEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_DynamoDBEventPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('batchSize', cdk.requiredValidator)(properties.batchSize));
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
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
function cfnFunctionDynamoDBEventPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_DynamoDBEventPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        StartingPosition: cdk.stringToCloudFormation(properties.startingPosition),
        Stream: cdk.stringToCloudFormation(properties.stream),
    };
}
/**
 * Determine whether the given properties match those of a `EventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `EventSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_EventSourcePropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('properties', cdk.requiredValidator)(properties.properties));
    errors.collect(cdk.propertyValidator('properties', cdk.unionValidator(CfnFunction_S3EventPropertyValidator, CfnFunction_SNSEventPropertyValidator, CfnFunction_SQSEventPropertyValidator, CfnFunction_KinesisEventPropertyValidator, CfnFunction_DynamoDBEventPropertyValidator, CfnFunction_ApiEventPropertyValidator, CfnFunction_ScheduleEventPropertyValidator, CfnFunction_CloudWatchEventEventPropertyValidator, CfnFunction_IoTRuleEventPropertyValidator, CfnFunction_AlexaSkillEventPropertyValidator))(properties.properties));
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
function cfnFunctionEventSourcePropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_EventSourcePropertyValidator(properties).assertSuccess();
    return {
        Properties: cdk.unionMapper([CfnFunction_S3EventPropertyValidator, CfnFunction_SNSEventPropertyValidator, CfnFunction_SQSEventPropertyValidator, CfnFunction_KinesisEventPropertyValidator, CfnFunction_DynamoDBEventPropertyValidator, CfnFunction_ApiEventPropertyValidator, CfnFunction_ScheduleEventPropertyValidator, CfnFunction_CloudWatchEventEventPropertyValidator, CfnFunction_IoTRuleEventPropertyValidator, CfnFunction_AlexaSkillEventPropertyValidator], [cfnFunctionS3EventPropertyToCloudFormation, cfnFunctionSNSEventPropertyToCloudFormation, cfnFunctionSQSEventPropertyToCloudFormation, cfnFunctionKinesisEventPropertyToCloudFormation, cfnFunctionDynamoDBEventPropertyToCloudFormation, cfnFunctionApiEventPropertyToCloudFormation, cfnFunctionScheduleEventPropertyToCloudFormation, cfnFunctionCloudWatchEventEventPropertyToCloudFormation, cfnFunctionIoTRuleEventPropertyToCloudFormation, cfnFunctionAlexaSkillEventPropertyToCloudFormation])(properties.properties),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}
/**
 * Determine whether the given properties match those of a `FunctionEnvironmentProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionEnvironmentProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_FunctionEnvironmentPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnFunctionFunctionEnvironmentPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_FunctionEnvironmentPropertyValidator(properties).assertSuccess();
    return {
        Variables: cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables),
    };
}
/**
 * Determine whether the given properties match those of a `IAMPolicyDocumentProperty`
 *
 * @param properties - the TypeScript properties of a `IAMPolicyDocumentProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_IAMPolicyDocumentPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('statement', cdk.requiredValidator)(properties.statement));
    errors.collect(cdk.propertyValidator('statement', cdk.validateObject)(properties.statement));
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
function cfnFunctionIAMPolicyDocumentPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_IAMPolicyDocumentPropertyValidator(properties).assertSuccess();
    return {
        Statement: cdk.objectToCloudFormation(properties.statement),
    };
}
/**
 * Determine whether the given properties match those of a `IoTRuleEventProperty`
 *
 * @param properties - the TypeScript properties of a `IoTRuleEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_IoTRuleEventPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnFunctionIoTRuleEventPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_IoTRuleEventPropertyValidator(properties).assertSuccess();
    return {
        AwsIotSqlVersion: cdk.stringToCloudFormation(properties.awsIotSqlVersion),
        Sql: cdk.stringToCloudFormation(properties.sql),
    };
}
/**
 * Determine whether the given properties match those of a `KinesisEventProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_KinesisEventPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
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
function cfnFunctionKinesisEventPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_KinesisEventPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        StartingPosition: cdk.stringToCloudFormation(properties.startingPosition),
        Stream: cdk.stringToCloudFormation(properties.stream),
    };
}
/**
 * Determine whether the given properties match those of a `S3EventProperty`
 *
 * @param properties - the TypeScript properties of a `S3EventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_S3EventPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnFunctionS3EventPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_S3EventPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Events: cdk.unionMapper([cdk.unionValidator(cdk.validateString), cdk.listValidator(cdk.unionValidator(cdk.validateString))], [cdk.unionMapper([cdk.validateString], [cdk.stringToCloudFormation]), cdk.listMapper(cdk.unionMapper([cdk.validateString], [cdk.stringToCloudFormation]))])(properties.events),
        Filter: cfnFunctionS3NotificationFilterPropertyToCloudFormation(properties.filter),
    };
}
/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_S3LocationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnFunctionS3LocationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_S3LocationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Key: cdk.stringToCloudFormation(properties.key),
        Version: cdk.numberToCloudFormation(properties.version),
    };
}
/**
 * Determine whether the given properties match those of a `S3NotificationFilterProperty`
 *
 * @param properties - the TypeScript properties of a `S3NotificationFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_S3NotificationFilterPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('s3Key', cdk.requiredValidator)(properties.s3Key));
    errors.collect(cdk.propertyValidator('s3Key', cdk.validateString)(properties.s3Key));
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
function cfnFunctionS3NotificationFilterPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_S3NotificationFilterPropertyValidator(properties).assertSuccess();
    return {
        S3Key: cdk.stringToCloudFormation(properties.s3Key),
    };
}
/**
 * Determine whether the given properties match those of a `SNSEventProperty`
 *
 * @param properties - the TypeScript properties of a `SNSEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_SNSEventPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnFunctionSNSEventPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_SNSEventPropertyValidator(properties).assertSuccess();
    return {
        Topic: cdk.stringToCloudFormation(properties.topic),
    };
}
/**
 * Determine whether the given properties match those of a `SQSEventProperty`
 *
 * @param properties - the TypeScript properties of a `SQSEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_SQSEventPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('batchSize', cdk.validateNumber)(properties.batchSize));
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
function cfnFunctionSQSEventPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_SQSEventPropertyValidator(properties).assertSuccess();
    return {
        BatchSize: cdk.numberToCloudFormation(properties.batchSize),
        Queue: cdk.stringToCloudFormation(properties.queue),
    };
}
/**
 * Determine whether the given properties match those of a `ScheduleEventProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_ScheduleEventPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('input', cdk.validateString)(properties.input));
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
function cfnFunctionScheduleEventPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_ScheduleEventPropertyValidator(properties).assertSuccess();
    return {
        Input: cdk.stringToCloudFormation(properties.input),
        Schedule: cdk.stringToCloudFormation(properties.schedule),
    };
}
/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFunction_VpcConfigPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnFunctionVpcConfigPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnFunction_VpcConfigPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}
/**
 * Determine whether the given properties match those of a `CfnLayerVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnLayerVersionProps`
 *
 * @returns the result of the validation.
 */
function CfnLayerVersionPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    errors.collect(cdk.propertyValidator('compatibleRuntimes', cdk.listValidator(cdk.validateString))(properties.compatibleRuntimes));
    errors.collect(cdk.propertyValidator('contentUri', cdk.validateString)(properties.contentUri));
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
function cfnLayerVersionPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnLayerVersionPropsValidator(properties).assertSuccess();
    return {
        CompatibleRuntimes: cdk.listMapper(cdk.stringToCloudFormation)(properties.compatibleRuntimes),
        ContentUri: cdk.stringToCloudFormation(properties.contentUri),
        Description: cdk.stringToCloudFormation(properties.description),
        LayerName: cdk.stringToCloudFormation(properties.layerName),
        LicenseInfo: cdk.stringToCloudFormation(properties.licenseInfo),
        RetentionPolicy: cdk.stringToCloudFormation(properties.retentionPolicy),
    };
}
/**
 * A CloudFormation `AWS::Serverless::LayerVersion`
 *
 * @cloudformationResource AWS::Serverless::LayerVersion
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
 */
class CfnLayerVersion extends cdk.CfnResource {
    /**
     * Create a new `AWS::Serverless::LayerVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnLayerVersion.resourceTypeName, properties: props });
        // If a different transform than the required one is in use, this resource cannot be used
        if (this.node.stack.templateOptions.transform && this.node.stack.templateOptions.transform !== CfnLayerVersion.requiredTransform) {
            throw new Error(`The ${JSON.stringify(CfnLayerVersion.requiredTransform)} transform is required when using CfnLayerVersion, but the ${JSON.stringify(this.node.stack.templateOptions.transform)} is used.`);
        }
        // Automatically configure the required transform
        this.node.stack.templateOptions.transform = CfnLayerVersion.requiredTransform;
        this.layerVersionArn = this.ref.toString();
    }
    get propertyOverrides() {
        return this.untypedPropertyOverrides;
    }
    renderProperties(properties) {
        return cfnLayerVersionPropsToCloudFormation(this.node.resolve(properties));
    }
}
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnLayerVersion.resourceTypeName = "AWS::Serverless::LayerVersion";
/**
 * The `Transform` a template must use in order to use this resource
 */
CfnLayerVersion.requiredTransform = "AWS::Serverless-2016-10-31";
exports.CfnLayerVersion = CfnLayerVersion;
/**
 * Determine whether the given properties match those of a `CfnSimpleTableProps`
 *
 * @param properties - the TypeScript properties of a `CfnSimpleTableProps`
 *
 * @returns the result of the validation.
 */
function CfnSimpleTablePropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnSimpleTablePropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSimpleTablePropsValidator(properties).assertSuccess();
    return {
        PrimaryKey: cfnSimpleTablePrimaryKeyPropertyToCloudFormation(properties.primaryKey),
        ProvisionedThroughput: cfnSimpleTableProvisionedThroughputPropertyToCloudFormation(properties.provisionedThroughput),
        SSESpecification: cfnSimpleTableSSESpecificationPropertyToCloudFormation(properties.sseSpecification),
        TableName: cdk.stringToCloudFormation(properties.tableName),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}
/**
 * A CloudFormation `AWS::Serverless::SimpleTable`
 *
 * @cloudformationResource AWS::Serverless::SimpleTable
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
 */
class CfnSimpleTable extends cdk.CfnResource {
    /**
     * Create a new `AWS::Serverless::SimpleTable`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnSimpleTable.resourceTypeName, properties: props });
        // If a different transform than the required one is in use, this resource cannot be used
        if (this.node.stack.templateOptions.transform && this.node.stack.templateOptions.transform !== CfnSimpleTable.requiredTransform) {
            throw new Error(`The ${JSON.stringify(CfnSimpleTable.requiredTransform)} transform is required when using CfnSimpleTable, but the ${JSON.stringify(this.node.stack.templateOptions.transform)} is used.`);
        }
        // Automatically configure the required transform
        this.node.stack.templateOptions.transform = CfnSimpleTable.requiredTransform;
        this.simpleTableName = this.ref.toString();
        const tags = props === undefined ? undefined : props.tags;
        this.tags = new cdk.TagManager(cdk.TagType.Map, "AWS::Serverless::SimpleTable", tags);
    }
    get propertyOverrides() {
        return this.untypedPropertyOverrides;
    }
    renderProperties(properties) {
        return cfnSimpleTablePropsToCloudFormation(this.node.resolve(properties));
    }
}
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnSimpleTable.resourceTypeName = "AWS::Serverless::SimpleTable";
/**
 * The `Transform` a template must use in order to use this resource
 */
CfnSimpleTable.requiredTransform = "AWS::Serverless-2016-10-31";
exports.CfnSimpleTable = CfnSimpleTable;
/**
 * Determine whether the given properties match those of a `PrimaryKeyProperty`
 *
 * @param properties - the TypeScript properties of a `PrimaryKeyProperty`
 *
 * @returns the result of the validation.
 */
function CfnSimpleTable_PrimaryKeyPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnSimpleTablePrimaryKeyPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSimpleTable_PrimaryKeyPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}
/**
 * Determine whether the given properties match those of a `ProvisionedThroughputProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedThroughputProperty`
 *
 * @returns the result of the validation.
 */
function CfnSimpleTable_ProvisionedThroughputPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnSimpleTableProvisionedThroughputPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSimpleTable_ProvisionedThroughputPropertyValidator(properties).assertSuccess();
    return {
        ReadCapacityUnits: cdk.numberToCloudFormation(properties.readCapacityUnits),
        WriteCapacityUnits: cdk.numberToCloudFormation(properties.writeCapacityUnits),
    };
}
/**
 * Determine whether the given properties match those of a `SSESpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnSimpleTable_SSESpecificationPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
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
function cfnSimpleTableSSESpecificationPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSimpleTable_SSESpecificationPropertyValidator(properties).assertSuccess();
    return {
        SSEEnabled: cdk.booleanToCloudFormation(properties.sseEnabled),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVybGVzcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2ZXJsZXNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLCtEQUErRDtBQUMvRCw4RkFBOEY7QUFDOUYsc0hBQXNIOztBQUV0SCxrR0FBa0c7QUFFbEcsb0NBQXFDO0FBcUVyQzs7Ozs7O0dBTUc7QUFDSCxTQUFTLG9CQUFvQixDQUFDLFVBQWU7SUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLDRCQUE0QixDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQzlILE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0lBQ2xILE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQzNHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxD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c0JBQXNCLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0tBQzlFLENBQUM7QUFDTixDQUFDO0FBZUQ7Ozs7OztHQU1HO0FBQ0gsU0FBUyxnREFBZ0QsQ0FBQyxVQUFlO0lBQ3JFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUM7S0FBRTtJQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDaEcsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLGdFQUFnRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILG9CQUFvQjtBQUNwQixTQUFTLHNEQUFzRCxDQUFDLFVBQWU7SUFDM0UsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLFVBQVUsQ0FBQztLQUFFO0lBQ3ZELGdEQUFnRCxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzdFLE9BQU87UUFDTCxVQUFVLEVBQUUsR0FBRyxDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7S0FDL0QsQ0FBQztBQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDE5IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vLyBHZW5lcmF0ZWQgZnJvbSB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIFJlc291cmNlIFNwZWNpZmljYXRpb25cbi8vIFNlZTogZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2Nmbi1yZXNvdXJjZS1zcGVjaWZpY2F0aW9uLmh0bWxcbi8vIEBjZm4ydHM6bWV0YUAge1wiZ2VuZXJhdGVkXCI6XCIyMDE5LTAzLTIxVDA5OjEyOjIzLjYxNVpcIixcImZpbmdlcnByaW50XCI6XCJVSjQyZmV6QmF6bEhQT2ttMHBOaXRPTU05cGV1YmZHRWQyL1hjVHdTbHNJPVwifVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggfCBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5pbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY2RrJyk7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGlgXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzYXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQXBpUHJvcHMge1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkFwaS5TdGFnZU5hbWVgXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2FwaVxuICAgICAqL1xuICAgIHN0YWdlTmFtZTogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkFwaS5BdXRoYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NhcGlcbiAgICAgKi9cbiAgICBhdXRoPzogQ2ZuQXBpLkF1dGhQcm9wZXJ0eSB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGkuQmluYXJ5TWVkaWFUeXBlc2BcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzYXBpXG4gICAgICovXG4gICAgYmluYXJ5TWVkaWFUeXBlcz86IHN0cmluZ1tdO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkFwaS5DYWNoZUNsdXN0ZXJFbmFibGVkYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NhcGlcbiAgICAgKi9cbiAgICBjYWNoZUNsdXN0ZXJFbmFibGVkPzogYm9vbGVhbiB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGkuQ2FjaGVDbHVzdGVyU2l6ZWBcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzYXBpXG4gICAgICovXG4gICAgY2FjaGVDbHVzdGVyU2l6ZT86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGkuQ29yc2BcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzYXBpXG4gICAgICovXG4gICAgY29ycz86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGkuRGVmaW5pdGlvbkJvZHlgXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2FwaVxuICAgICAqL1xuICAgIGRlZmluaXRpb25Cb2R5Pzogb2JqZWN0IHwgY2RrLlRva2VuO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkFwaS5EZWZpbml0aW9uVXJpYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NhcGlcbiAgICAgKi9cbiAgICBkZWZpbml0aW9uVXJpPzogQ2ZuQXBpLlMzTG9jYXRpb25Qcm9wZXJ0eSB8IHN0cmluZyB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGkuRW5kcG9pbnRDb25maWd1cmF0aW9uYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NhcGlcbiAgICAgKi9cbiAgICBlbmRwb2ludENvbmZpZ3VyYXRpb24/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogYEFXUzo6U2VydmVybGVzczo6QXBpLk1ldGhvZFNldHRpbmdzYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NhcGlcbiAgICAgKi9cbiAgICBtZXRob2RTZXR0aW5ncz86IG9iamVjdCB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGkuTmFtZWBcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzYXBpXG4gICAgICovXG4gICAgbmFtZT86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGkuVmFyaWFibGVzYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NhcGlcbiAgICAgKi9cbiAgICB2YXJpYWJsZXM/OiB7IFtrZXk6IHN0cmluZ106IChzdHJpbmcpIH0gfCBjZGsuVG9rZW47XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuQXBpUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkFwaVByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkFwaVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXV0aCcsIENmbkFwaV9BdXRoUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMuYXV0aCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYmluYXJ5TWVkaWFUeXBlcycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMuYmluYXJ5TWVkaWFUeXBlcykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY2FjaGVDbHVzdGVyRW5hYmxlZCcsIGNkay52YWxpZGF0ZUJvb2xlYW4pKHByb3BlcnRpZXMuY2FjaGVDbHVzdGVyRW5hYmxlZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY2FjaGVDbHVzdGVyU2l6ZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5jYWNoZUNsdXN0ZXJTaXplKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjb3JzJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmNvcnMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2RlZmluaXRpb25Cb2R5JywgY2RrLnZhbGlkYXRlT2JqZWN0KShwcm9wZXJ0aWVzLmRlZmluaXRpb25Cb2R5KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZWZpbml0aW9uVXJpJywgY2RrLnVuaW9uVmFsaWRhdG9yKENmbkFwaV9TM0xvY2F0aW9uUHJvcGVydHlWYWxpZGF0b3IsIGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMuZGVmaW5pdGlvblVyaSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZW5kcG9pbnRDb25maWd1cmF0aW9uJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmVuZHBvaW50Q29uZmlndXJhdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0aG9kU2V0dGluZ3MnLCBjZGsudmFsaWRhdGVPYmplY3QpKHByb3BlcnRpZXMubWV0aG9kU2V0dGluZ3MpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc3RhZ2VOYW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnN0YWdlTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc3RhZ2VOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnN0YWdlTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmFyaWFibGVzJywgY2RrLmhhc2hWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy52YXJpYWJsZXMpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuQXBpUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkFwaWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQXBpUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkFwaWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5BcGlQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQXBpUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBTdGFnZU5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuc3RhZ2VOYW1lKSxcbiAgICAgIEF1dGg6IGNmbkFwaUF1dGhQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hdXRoKSxcbiAgICAgIEJpbmFyeU1lZGlhVHlwZXM6IGNkay5saXN0TWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLmJpbmFyeU1lZGlhVHlwZXMpLFxuICAgICAgQ2FjaGVDbHVzdGVyRW5hYmxlZDogY2RrLmJvb2xlYW5Ub0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuY2FjaGVDbHVzdGVyRW5hYmxlZCksXG4gICAgICBDYWNoZUNsdXN0ZXJTaXplOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNhY2hlQ2x1c3RlclNpemUpLFxuICAgICAgQ29yczogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5jb3JzKSxcbiAgICAgIERlZmluaXRpb25Cb2R5OiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmRlZmluaXRpb25Cb2R5KSxcbiAgICAgIERlZmluaXRpb25Vcmk6IGNkay51bmlvbk1hcHBlcihbQ2ZuQXBpX1MzTG9jYXRpb25Qcm9wZXJ0eVZhbGlkYXRvciwgY2RrLnZhbGlkYXRlU3RyaW5nXSwgW2NmbkFwaVMzTG9jYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24sIGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uXSkocHJvcGVydGllcy5kZWZpbml0aW9uVXJpKSxcbiAgICAgIEVuZHBvaW50Q29uZmlndXJhdGlvbjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5lbmRwb2ludENvbmZpZ3VyYXRpb24pLFxuICAgICAgTWV0aG9kU2V0dGluZ3M6IGNkay5vYmplY3RUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubWV0aG9kU2V0dGluZ3MpLFxuICAgICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICAgIFZhcmlhYmxlczogY2RrLmhhc2hNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMudmFyaWFibGVzKSxcbiAgICB9O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6U2VydmVybGVzczo6QXBpYFxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6U2VydmVybGVzczo6QXBpXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzYXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5BcGkgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2Uge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSByZXNvdXJjZVR5cGVOYW1lID0gXCJBV1M6OlNlcnZlcmxlc3M6OkFwaVwiO1xuICAgIC8qKlxuICAgICAqIFRoZSBgVHJhbnNmb3JtYCBhIHRlbXBsYXRlIG11c3QgdXNlIGluIG9yZGVyIHRvIHVzZSB0aGlzIHJlc291cmNlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSByZXF1aXJlZFRyYW5zZm9ybSA9IFwiQVdTOjpTZXJ2ZXJsZXNzLTIwMTYtMTAtMzFcIjtcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXBpTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OlNlcnZlcmxlc3M6OkFwaWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuQXBpUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkFwaS5yZXNvdXJjZVR5cGVOYW1lLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ3N0YWdlTmFtZScsIHRoaXMpO1xuICAgICAgICAvLyBJZiBhIGRpZmZlcmVudCB0cmFuc2Zvcm0gdGhhbiB0aGUgcmVxdWlyZWQgb25lIGlzIGluIHVzZSwgdGhpcyByZXNvdXJjZSBjYW5ub3QgYmUgdXNlZFxuICAgICAgICBpZiAodGhpcy5ub2RlLnN0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm0gJiYgdGhpcy5ub2RlLnN0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm0gIT09IENmbkFwaS5yZXF1aXJlZFRyYW5zZm9ybSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgJHtKU09OLnN0cmluZ2lmeShDZm5BcGkucmVxdWlyZWRUcmFuc2Zvcm0pfSB0cmFuc2Zvcm0gaXMgcmVxdWlyZWQgd2hlbiB1c2luZyBDZm5BcGksIGJ1dCB0aGUgJHtKU09OLnN0cmluZ2lmeSh0aGlzLm5vZGUuc3RhY2sudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybSl9IGlzIHVzZWQuYCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQXV0b21hdGljYWxseSBjb25maWd1cmUgdGhlIHJlcXVpcmVkIHRyYW5zZm9ybVxuICAgICAgICB0aGlzLm5vZGUuc3RhY2sudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybSA9IENmbkFwaS5yZXF1aXJlZFRyYW5zZm9ybTtcbiAgICAgICAgdGhpcy5hcGlOYW1lID0gdGhpcy5yZWYudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHByb3BlcnR5T3ZlcnJpZGVzKCk6IENmbkFwaVByb3BzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudW50eXBlZFByb3BlcnR5T3ZlcnJpZGVzO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wZXJ0aWVzOiBhbnkpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5BcGlQcm9wc1RvQ2xvdWRGb3JtYXRpb24odGhpcy5ub2RlLnJlc29sdmUocHJvcGVydGllcykpO1xuICAgIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5BcGkge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2FwaS1hdXRoLW9iamVjdFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgQXV0aFByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5BcGkuQXV0aFByb3BlcnR5LkF1dGhvcml6ZXJzYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhcGktYXV0aC1vYmplY3RcbiAgICAgICAgICovXG4gICAgICAgIGF1dGhvcml6ZXJzPzogb2JqZWN0IHwgY2RrLlRva2VuO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkFwaS5BdXRoUHJvcGVydHkuRGVmYXVsdEF1dGhvcml6ZXJgXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2FwaS1hdXRoLW9iamVjdFxuICAgICAgICAgKi9cbiAgICAgICAgZGVmYXVsdEF1dGhvcml6ZXI/OiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEF1dGhQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQXV0aFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkFwaV9BdXRoUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhdXRob3JpemVycycsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5hdXRob3JpemVycykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGVmYXVsdEF1dGhvcml6ZXInLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZGVmYXVsdEF1dGhvcml6ZXIpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQXV0aFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGkuQXV0aGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQXV0aFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGkuQXV0aGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5BcGlBdXRoUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkFwaV9BdXRoUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBBdXRob3JpemVyczogY2RrLm9iamVjdFRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hdXRob3JpemVycyksXG4gICAgICBEZWZhdWx0QXV0aG9yaXplcjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5kZWZhdWx0QXV0aG9yaXplciksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5BcGkge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI3MzLWxvY2F0aW9uLW9iamVjdFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgUzNMb2NhdGlvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5BcGkuUzNMb2NhdGlvblByb3BlcnR5LkJ1Y2tldGBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2Z1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBidWNrZXQ6IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5BcGkuUzNMb2NhdGlvblByb3BlcnR5LktleWBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2Z1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBrZXk6IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5BcGkuUzNMb2NhdGlvblByb3BlcnR5LlZlcnNpb25gXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdmVyc2lvbjogbnVtYmVyIHwgY2RrLlRva2VuO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBTM0xvY2F0aW9uUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFMzTG9jYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5BcGlfUzNMb2NhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYnVja2V0JywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmJ1Y2tldCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYnVja2V0JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmJ1Y2tldCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5JywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmtleSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmtleSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmVyc2lvbicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy52ZXJzaW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd2ZXJzaW9uJywgY2RrLnZhbGlkYXRlTnVtYmVyKShwcm9wZXJ0aWVzLnZlcnNpb24pKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiUzNMb2NhdGlvblByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGkuUzNMb2NhdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUzNMb2NhdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcGkuUzNMb2NhdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5BcGlTM0xvY2F0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkFwaV9TM0xvY2F0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBCdWNrZXQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYnVja2V0KSxcbiAgICAgIEtleTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5rZXkpLFxuICAgICAgVmVyc2lvbjogY2RrLm51bWJlclRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy52ZXJzaW9uKSxcbiAgICB9O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYEFXUzo6U2VydmVybGVzczo6QXBwbGljYXRpb25gXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzYXBwbGljYXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5BcHBsaWNhdGlvblByb3BzIHtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcHBsaWNhdGlvbi5Mb2NhdGlvbmBcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzYXBwbGljYXRpb25cbiAgICAgKi9cbiAgICBsb2NhdGlvbjogQ2ZuQXBwbGljYXRpb24uQXBwbGljYXRpb25Mb2NhdGlvblByb3BlcnR5IHwgc3RyaW5nIHwgY2RrLlRva2VuO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkFwcGxpY2F0aW9uLk5vdGlmaWNhdGlvbkFybnNgXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2FwcGxpY2F0aW9uXG4gICAgICovXG4gICAgbm90aWZpY2F0aW9uQXJucz86IHN0cmluZ1tdO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkFwcGxpY2F0aW9uLlBhcmFtZXRlcnNgXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2FwcGxpY2F0aW9uXG4gICAgICovXG4gICAgcGFyYW1ldGVycz86IHsgW2tleTogc3RyaW5nXTogKHN0cmluZykgfSB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcHBsaWNhdGlvbi5UYWdzYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NhcHBsaWNhdGlvblxuICAgICAqL1xuICAgIHRhZ3M/OiB7IFtrZXk6IHN0cmluZ106IChzdHJpbmcpIH07XG4gICAgLyoqXG4gICAgICogYEFXUzo6U2VydmVybGVzczo6QXBwbGljYXRpb24uVGltZW91dEluTWludXRlc2BcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzYXBwbGljYXRpb25cbiAgICAgKi9cbiAgICB0aW1lb3V0SW5NaW51dGVzPzogbnVtYmVyIHwgY2RrLlRva2VuO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkFwcGxpY2F0aW9uUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkFwcGxpY2F0aW9uUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQXBwbGljYXRpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2xvY2F0aW9uJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmxvY2F0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdsb2NhdGlvbicsIGNkay51bmlvblZhbGlkYXRvcihDZm5BcHBsaWNhdGlvbl9BcHBsaWNhdGlvbkxvY2F0aW9uUHJvcGVydHlWYWxpZGF0b3IsIGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMubG9jYXRpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25vdGlmaWNhdGlvbkFybnMnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpKShwcm9wZXJ0aWVzLm5vdGlmaWNhdGlvbkFybnMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3BhcmFtZXRlcnMnLCBjZGsuaGFzaFZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpKShwcm9wZXJ0aWVzLnBhcmFtZXRlcnMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhZ3MnLCBjZGsuaGFzaFZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpKShwcm9wZXJ0aWVzLnRhZ3MpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RpbWVvdXRJbk1pbnV0ZXMnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMudGltZW91dEluTWludXRlcykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5BcHBsaWNhdGlvblByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcHBsaWNhdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQXBwbGljYXRpb25Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6QXBwbGljYXRpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQXBwbGljYXRpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQXBwbGljYXRpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIExvY2F0aW9uOiBjZGsudW5pb25NYXBwZXIoW0NmbkFwcGxpY2F0aW9uX0FwcGxpY2F0aW9uTG9jYXRpb25Qcm9wZXJ0eVZhbGlkYXRvciwgY2RrLnZhbGlkYXRlU3RyaW5nXSwgW2NmbkFwcGxpY2F0aW9uQXBwbGljYXRpb25Mb2NhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbiwgY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb25dKShwcm9wZXJ0aWVzLmxvY2F0aW9uKSxcbiAgICAgIE5vdGlmaWNhdGlvbkFybnM6IGNkay5saXN0TWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLm5vdGlmaWNhdGlvbkFybnMpLFxuICAgICAgUGFyYW1ldGVyczogY2RrLmhhc2hNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMucGFyYW1ldGVycyksXG4gICAgICBUYWdzOiBjZGsuaGFzaE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy50YWdzKSxcbiAgICAgIFRpbWVvdXRJbk1pbnV0ZXM6IGNkay5udW1iZXJUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudGltZW91dEluTWludXRlcyksXG4gICAgfTtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OlNlcnZlcmxlc3M6OkFwcGxpY2F0aW9uYFxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6U2VydmVybGVzczo6QXBwbGljYXRpb25cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NhcHBsaWNhdGlvblxuICovXG5leHBvcnQgY2xhc3MgQ2ZuQXBwbGljYXRpb24gZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2Uge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSByZXNvdXJjZVR5cGVOYW1lID0gXCJBV1M6OlNlcnZlcmxlc3M6OkFwcGxpY2F0aW9uXCI7XG4gICAgLyoqXG4gICAgICogVGhlIGBUcmFuc2Zvcm1gIGEgdGVtcGxhdGUgbXVzdCB1c2UgaW4gb3JkZXIgdG8gdXNlIHRoaXMgcmVzb3VyY2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHJlcXVpcmVkVHJhbnNmb3JtID0gXCJBV1M6OlNlcnZlcmxlc3MtMjAxNi0xMC0zMVwiO1xuICAgIHB1YmxpYyByZWFkb25seSBhcHBsaWNhdGlvbk5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBgVGFnTWFuYWdlcmAgaGFuZGxlcyBzZXR0aW5nLCByZW1vdmluZyBhbmQgZm9ybWF0dGluZyB0YWdzXG4gICAgICpcbiAgICAgKiBUYWdzIHNob3VsZCBiZSBtYW5hZ2VkIGVpdGhlciBwYXNzaW5nIHRoZW0gYXMgcHJvcGVydGllcyBkdXJpbmdcbiAgICAgKiBpbml0aWF0aW9uIG9yIGJ5IGNhbGxpbmcgbWV0aG9kcyBvbiB0aGlzIG9iamVjdC4gSWYgYm90aCB0ZWNobmlxdWVzIGFyZVxuICAgICAqIHVzZWQgb25seSB0aGUgdGFncyBmcm9tIHRoZSBUYWdNYW5hZ2VyIHdpbGwgYmUgdXNlZC4gYFRhZ2AgKGFzcGVjdClcbiAgICAgKiB3aWxsIHVzZSB0aGUgbWFuYWdlci5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGFnczogY2RrLlRhZ01hbmFnZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6U2VydmVybGVzczo6QXBwbGljYXRpb25gLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkFwcGxpY2F0aW9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkFwcGxpY2F0aW9uLnJlc291cmNlVHlwZU5hbWUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnbG9jYXRpb24nLCB0aGlzKTtcbiAgICAgICAgLy8gSWYgYSBkaWZmZXJlbnQgdHJhbnNmb3JtIHRoYW4gdGhlIHJlcXVpcmVkIG9uZSBpcyBpbiB1c2UsIHRoaXMgcmVzb3VyY2UgY2Fubm90IGJlIHVzZWRcbiAgICAgICAgaWYgKHRoaXMubm9kZS5zdGFjay50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3JtICYmIHRoaXMubm9kZS5zdGFjay50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3JtICE9PSBDZm5BcHBsaWNhdGlvbi5yZXF1aXJlZFRyYW5zZm9ybSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgJHtKU09OLnN0cmluZ2lmeShDZm5BcHBsaWNhdGlvbi5yZXF1aXJlZFRyYW5zZm9ybSl9IHRyYW5zZm9ybSBpcyByZXF1aXJlZCB3aGVuIHVzaW5nIENmbkFwcGxpY2F0aW9uLCBidXQgdGhlICR7SlNPTi5zdHJpbmdpZnkodGhpcy5ub2RlLnN0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm0pfSBpcyB1c2VkLmApO1xuICAgICAgICB9XG4gICAgICAgIC8vIEF1dG9tYXRpY2FsbHkgY29uZmlndXJlIHRoZSByZXF1aXJlZCB0cmFuc2Zvcm1cbiAgICAgICAgdGhpcy5ub2RlLnN0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm0gPSBDZm5BcHBsaWNhdGlvbi5yZXF1aXJlZFRyYW5zZm9ybTtcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbk5hbWUgPSB0aGlzLnJlZi50b1N0cmluZygpO1xuICAgICAgICBjb25zdCB0YWdzID0gcHJvcHMgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHByb3BzLnRhZ3M7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5NYXAsIFwiQVdTOjpTZXJ2ZXJsZXNzOjpBcHBsaWNhdGlvblwiLCB0YWdzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHByb3BlcnR5T3ZlcnJpZGVzKCk6IENmbkFwcGxpY2F0aW9uUHJvcHMge1xuICAgICAgICByZXR1cm4gdGhpcy51bnR5cGVkUHJvcGVydHlPdmVycmlkZXM7XG4gICAgfVxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IGFueSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmbkFwcGxpY2F0aW9uUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHRoaXMubm9kZS5yZXNvbHZlKHByb3BlcnRpZXMpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuQXBwbGljYXRpb24ge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NhcHBsaWNhdGlvblxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgQXBwbGljYXRpb25Mb2NhdGlvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5BcHBsaWNhdGlvbi5BcHBsaWNhdGlvbkxvY2F0aW9uUHJvcGVydHkuQXBwbGljYXRpb25JZGBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2FwcGxpY2F0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBhcHBsaWNhdGlvbklkOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuQXBwbGljYXRpb24uQXBwbGljYXRpb25Mb2NhdGlvblByb3BlcnR5LlNlbWFudGljVmVyc2lvbmBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2FwcGxpY2F0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBzZW1hbnRpY1ZlcnNpb246IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQXBwbGljYXRpb25Mb2NhdGlvblByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBBcHBsaWNhdGlvbkxvY2F0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuQXBwbGljYXRpb25fQXBwbGljYXRpb25Mb2NhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYXBwbGljYXRpb25JZCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5hcHBsaWNhdGlvbklkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhcHBsaWNhdGlvbklkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmFwcGxpY2F0aW9uSWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3NlbWFudGljVmVyc2lvbicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5zZW1hbnRpY1ZlcnNpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3NlbWFudGljVmVyc2lvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5zZW1hbnRpY1ZlcnNpb24pKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQXBwbGljYXRpb25Mb2NhdGlvblByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpBcHBsaWNhdGlvbi5BcHBsaWNhdGlvbkxvY2F0aW9uYCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBBcHBsaWNhdGlvbkxvY2F0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkFwcGxpY2F0aW9uLkFwcGxpY2F0aW9uTG9jYXRpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuQXBwbGljYXRpb25BcHBsaWNhdGlvbkxvY2F0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkFwcGxpY2F0aW9uX0FwcGxpY2F0aW9uTG9jYXRpb25Qcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXBwbGljYXRpb25JZCksXG4gICAgICBTZW1hbnRpY1ZlcnNpb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuc2VtYW50aWNWZXJzaW9uKSxcbiAgICB9O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb25gXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5GdW5jdGlvblByb3BzIHtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5Db2RlVXJpYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAqL1xuICAgIGNvZGVVcmk6IENmbkZ1bmN0aW9uLlMzTG9jYXRpb25Qcm9wZXJ0eSB8IHN0cmluZyB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5IYW5kbGVyYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAqL1xuICAgIGhhbmRsZXI6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5SdW50aW1lYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAqL1xuICAgIHJ1bnRpbWU6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5BdXRvUHVibGlzaEFsaWFzYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAqL1xuICAgIGF1dG9QdWJsaXNoQWxpYXM/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uRGVhZExldHRlclF1ZXVlYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAqL1xuICAgIGRlYWRMZXR0ZXJRdWV1ZT86IENmbkZ1bmN0aW9uLkRlYWRMZXR0ZXJRdWV1ZVByb3BlcnR5IHwgY2RrLlRva2VuO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLkRlcGxveW1lbnRQcmVmZXJlbmNlYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2RlcGxveW1lbnRwcmVmZXJlbmNlLW9iamVjdFxuICAgICAqL1xuICAgIGRlcGxveW1lbnRQcmVmZXJlbmNlPzogQ2ZuRnVuY3Rpb24uRGVwbG95bWVudFByZWZlcmVuY2VQcm9wZXJ0eSB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5EZXNjcmlwdGlvbmBcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzZnVuY3Rpb25cbiAgICAgKi9cbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5FbnZpcm9ubWVudGBcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzZnVuY3Rpb25cbiAgICAgKi9cbiAgICBlbnZpcm9ubWVudD86IENmbkZ1bmN0aW9uLkZ1bmN0aW9uRW52aXJvbm1lbnRQcm9wZXJ0eSB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5FdmVudHNgXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2Z1bmN0aW9uXG4gICAgICovXG4gICAgZXZlbnRzPzogeyBba2V5OiBzdHJpbmddOiAoQ2ZuRnVuY3Rpb24uRXZlbnRTb3VyY2VQcm9wZXJ0eSB8IGNkay5Ub2tlbikgfSB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5GdW5jdGlvbk5hbWVgXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2Z1bmN0aW9uXG4gICAgICovXG4gICAgZnVuY3Rpb25OYW1lPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLkttc0tleUFybmBcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzZnVuY3Rpb25cbiAgICAgKi9cbiAgICBrbXNLZXlBcm4/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uTGF5ZXJzYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAqL1xuICAgIGxheWVycz86IHN0cmluZ1tdO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLk1lbW9yeVNpemVgXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2Z1bmN0aW9uXG4gICAgICovXG4gICAgbWVtb3J5U2l6ZT86IG51bWJlciB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5Qb2xpY2llc2BcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzZnVuY3Rpb25cbiAgICAgKi9cbiAgICBwb2xpY2llcz86IEFycmF5PENmbkZ1bmN0aW9uLklBTVBvbGljeURvY3VtZW50UHJvcGVydHkgfCBzdHJpbmcgfCBjZGsuVG9rZW4+IHwgQ2ZuRnVuY3Rpb24uSUFNUG9saWN5RG9jdW1lbnRQcm9wZXJ0eSB8IHN0cmluZyB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5SZXNlcnZlZENvbmN1cnJlbnRFeGVjdXRpb25zYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAqL1xuICAgIHJlc2VydmVkQ29uY3VycmVudEV4ZWN1dGlvbnM/OiBudW1iZXIgfCBjZGsuVG9rZW47XG4gICAgLyoqXG4gICAgICogYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uUm9sZWBcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzZnVuY3Rpb25cbiAgICAgKi9cbiAgICByb2xlPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLlRhZ3NgXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2Z1bmN0aW9uXG4gICAgICovXG4gICAgdGFncz86IHsgW2tleTogc3RyaW5nXTogKHN0cmluZykgfTtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5UaW1lb3V0YFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAqL1xuICAgIHRpbWVvdXQ/OiBudW1iZXIgfCBjZGsuVG9rZW47XG4gICAgLyoqXG4gICAgICogYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uVHJhY2luZ2BcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzZnVuY3Rpb25cbiAgICAgKi9cbiAgICB0cmFjaW5nPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLlZwY0NvbmZpZ2BcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzZnVuY3Rpb25cbiAgICAgKi9cbiAgICB2cGNDb25maWc/OiBDZm5GdW5jdGlvbi5WcGNDb25maWdQcm9wZXJ0eSB8IGNkay5Ub2tlbjtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5GdW5jdGlvblByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5GdW5jdGlvblByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkZ1bmN0aW9uUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdhdXRvUHVibGlzaEFsaWFzJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmF1dG9QdWJsaXNoQWxpYXMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2NvZGVVcmknLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuY29kZVVyaSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY29kZVVyaScsIGNkay51bmlvblZhbGlkYXRvcihDZm5GdW5jdGlvbl9TM0xvY2F0aW9uUHJvcGVydHlWYWxpZGF0b3IsIGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMuY29kZVVyaSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZGVhZExldHRlclF1ZXVlJywgQ2ZuRnVuY3Rpb25fRGVhZExldHRlclF1ZXVlUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMuZGVhZExldHRlclF1ZXVlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZXBsb3ltZW50UHJlZmVyZW5jZScsIENmbkZ1bmN0aW9uX0RlcGxveW1lbnRQcmVmZXJlbmNlUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMuZGVwbG95bWVudFByZWZlcmVuY2UpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2Rlc2NyaXB0aW9uJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmRlc2NyaXB0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdlbnZpcm9ubWVudCcsIENmbkZ1bmN0aW9uX0Z1bmN0aW9uRW52aXJvbm1lbnRQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5lbnZpcm9ubWVudCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZXZlbnRzJywgY2RrLmhhc2hWYWxpZGF0b3IoQ2ZuRnVuY3Rpb25fRXZlbnRTb3VyY2VQcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMuZXZlbnRzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmdW5jdGlvbk5hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZnVuY3Rpb25OYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdoYW5kbGVyJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmhhbmRsZXIpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2hhbmRsZXInLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuaGFuZGxlcikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna21zS2V5QXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmttc0tleUFybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbGF5ZXJzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5sYXllcnMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ21lbW9yeVNpemUnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMubWVtb3J5U2l6ZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncG9saWNpZXMnLCBjZGsudW5pb25WYWxpZGF0b3IoY2RrLnVuaW9uVmFsaWRhdG9yKENmbkZ1bmN0aW9uX0lBTVBvbGljeURvY3VtZW50UHJvcGVydHlWYWxpZGF0b3IsIGNkay52YWxpZGF0ZVN0cmluZyksIGNkay5saXN0VmFsaWRhdG9yKGNkay51bmlvblZhbGlkYXRvcihDZm5GdW5jdGlvbl9JQU1Qb2xpY3lEb2N1bWVudFByb3BlcnR5VmFsaWRhdG9yLCBjZGsudmFsaWRhdGVTdHJpbmcpKSkpKHByb3BlcnRpZXMucG9saWNpZXMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Jlc2VydmVkQ29uY3VycmVudEV4ZWN1dGlvbnMnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMucmVzZXJ2ZWRDb25jdXJyZW50RXhlY3V0aW9ucykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncm9sZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5yb2xlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdydW50aW1lJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnJ1bnRpbWUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3J1bnRpbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucnVudGltZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGFncycsIGNkay5oYXNoVmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMudGFncykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGltZW91dCcsIGNkay52YWxpZGF0ZU51bWJlcikocHJvcGVydGllcy50aW1lb3V0KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0cmFjaW5nJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnRyYWNpbmcpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ZwY0NvbmZpZycsIENmbkZ1bmN0aW9uX1ZwY0NvbmZpZ1Byb3BlcnR5VmFsaWRhdG9yKShwcm9wZXJ0aWVzLnZwY0NvbmZpZykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5GdW5jdGlvblByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuRnVuY3Rpb25Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRnVuY3Rpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRnVuY3Rpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIENvZGVVcmk6IGNkay51bmlvbk1hcHBlcihbQ2ZuRnVuY3Rpb25fUzNMb2NhdGlvblByb3BlcnR5VmFsaWRhdG9yLCBjZGsudmFsaWRhdGVTdHJpbmddLCBbY2ZuRnVuY3Rpb25TM0xvY2F0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uLCBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbl0pKHByb3BlcnRpZXMuY29kZVVyaSksXG4gICAgICBIYW5kbGVyOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmhhbmRsZXIpLFxuICAgICAgUnVudGltZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5ydW50aW1lKSxcbiAgICAgIEF1dG9QdWJsaXNoQWxpYXM6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYXV0b1B1Ymxpc2hBbGlhcyksXG4gICAgICBEZWFkTGV0dGVyUXVldWU6IGNmbkZ1bmN0aW9uRGVhZExldHRlclF1ZXVlUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGVhZExldHRlclF1ZXVlKSxcbiAgICAgIERlcGxveW1lbnRQcmVmZXJlbmNlOiBjZm5GdW5jdGlvbkRlcGxveW1lbnRQcmVmZXJlbmNlUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGVwbG95bWVudFByZWZlcmVuY2UpLFxuICAgICAgRGVzY3JpcHRpb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGVzY3JpcHRpb24pLFxuICAgICAgRW52aXJvbm1lbnQ6IGNmbkZ1bmN0aW9uRnVuY3Rpb25FbnZpcm9ubWVudFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmVudmlyb25tZW50KSxcbiAgICAgIEV2ZW50czogY2RrLmhhc2hNYXBwZXIoY2ZuRnVuY3Rpb25FdmVudFNvdXJjZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5ldmVudHMpLFxuICAgICAgRnVuY3Rpb25OYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmZ1bmN0aW9uTmFtZSksXG4gICAgICBLbXNLZXlBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMua21zS2V5QXJuKSxcbiAgICAgIExheWVyczogY2RrLmxpc3RNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMubGF5ZXJzKSxcbiAgICAgIE1lbW9yeVNpemU6IGNkay5udW1iZXJUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubWVtb3J5U2l6ZSksXG4gICAgICBQb2xpY2llczogY2RrLnVuaW9uTWFwcGVyKFtjZGsudW5pb25WYWxpZGF0b3IoQ2ZuRnVuY3Rpb25fSUFNUG9saWN5RG9jdW1lbnRQcm9wZXJ0eVZhbGlkYXRvciwgY2RrLnZhbGlkYXRlU3RyaW5nKSwgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnVuaW9uVmFsaWRhdG9yKENmbkZ1bmN0aW9uX0lBTVBvbGljeURvY3VtZW50UHJvcGVydHlWYWxpZGF0b3IsIGNkay52YWxpZGF0ZVN0cmluZykpXSwgW2Nkay51bmlvbk1hcHBlcihbQ2ZuRnVuY3Rpb25fSUFNUG9saWN5RG9jdW1lbnRQcm9wZXJ0eVZhbGlkYXRvciwgY2RrLnZhbGlkYXRlU3RyaW5nXSwgW2NmbkZ1bmN0aW9uSUFNUG9saWN5RG9jdW1lbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24sIGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uXSksIGNkay5saXN0TWFwcGVyKGNkay51bmlvbk1hcHBlcihbQ2ZuRnVuY3Rpb25fSUFNUG9saWN5RG9jdW1lbnRQcm9wZXJ0eVZhbGlkYXRvciwgY2RrLnZhbGlkYXRlU3RyaW5nXSwgW2NmbkZ1bmN0aW9uSUFNUG9saWN5RG9jdW1lbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24sIGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uXSkpXSkocHJvcGVydGllcy5wb2xpY2llcyksXG4gICAgICBSZXNlcnZlZENvbmN1cnJlbnRFeGVjdXRpb25zOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnJlc2VydmVkQ29uY3VycmVudEV4ZWN1dGlvbnMpLFxuICAgICAgUm9sZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yb2xlKSxcbiAgICAgIFRhZ3M6IGNkay5oYXNoTWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnRhZ3MpLFxuICAgICAgVGltZW91dDogY2RrLm51bWJlclRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50aW1lb3V0KSxcbiAgICAgIFRyYWNpbmc6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudHJhY2luZyksXG4gICAgICBWcGNDb25maWc6IGNmbkZ1bmN0aW9uVnBjQ29uZmlnUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudnBjQ29uZmlnKSxcbiAgICB9O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb25gXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvblxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2Z1bmN0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5GdW5jdGlvbiBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHJlc291cmNlVHlwZU5hbWUgPSBcIkFXUzo6U2VydmVybGVzczo6RnVuY3Rpb25cIjtcbiAgICAvKipcbiAgICAgKiBUaGUgYFRyYW5zZm9ybWAgYSB0ZW1wbGF0ZSBtdXN0IHVzZSBpbiBvcmRlciB0byB1c2UgdGhpcyByZXNvdXJjZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgcmVxdWlyZWRUcmFuc2Zvcm0gPSBcIkFXUzo6U2VydmVybGVzcy0yMDE2LTEwLTMxXCI7XG4gICAgcHVibGljIHJlYWRvbmx5IGZ1bmN0aW9uTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBUYWdNYW5hZ2VyYCBoYW5kbGVzIHNldHRpbmcsIHJlbW92aW5nIGFuZCBmb3JtYXR0aW5nIHRhZ3NcbiAgICAgKlxuICAgICAqIFRhZ3Mgc2hvdWxkIGJlIG1hbmFnZWQgZWl0aGVyIHBhc3NpbmcgdGhlbSBhcyBwcm9wZXJ0aWVzIGR1cmluZ1xuICAgICAqIGluaXRpYXRpb24gb3IgYnkgY2FsbGluZyBtZXRob2RzIG9uIHRoaXMgb2JqZWN0LiBJZiBib3RoIHRlY2huaXF1ZXMgYXJlXG4gICAgICogdXNlZCBvbmx5IHRoZSB0YWdzIGZyb20gdGhlIFRhZ01hbmFnZXIgd2lsbCBiZSB1c2VkLiBgVGFnYCAoYXNwZWN0KVxuICAgICAqIHdpbGwgdXNlIHRoZSBtYW5hZ2VyLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0YWdzOiBjZGsuVGFnTWFuYWdlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbmAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuRnVuY3Rpb25Qcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuRnVuY3Rpb24ucmVzb3VyY2VUeXBlTmFtZSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdjb2RlVXJpJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdoYW5kbGVyJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdydW50aW1lJywgdGhpcyk7XG4gICAgICAgIC8vIElmIGEgZGlmZmVyZW50IHRyYW5zZm9ybSB0aGFuIHRoZSByZXF1aXJlZCBvbmUgaXMgaW4gdXNlLCB0aGlzIHJlc291cmNlIGNhbm5vdCBiZSB1c2VkXG4gICAgICAgIGlmICh0aGlzLm5vZGUuc3RhY2sudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybSAmJiB0aGlzLm5vZGUuc3RhY2sudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybSAhPT0gQ2ZuRnVuY3Rpb24ucmVxdWlyZWRUcmFuc2Zvcm0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlICR7SlNPTi5zdHJpbmdpZnkoQ2ZuRnVuY3Rpb24ucmVxdWlyZWRUcmFuc2Zvcm0pfSB0cmFuc2Zvcm0gaXMgcmVxdWlyZWQgd2hlbiB1c2luZyBDZm5GdW5jdGlvbiwgYnV0IHRoZSAke0pTT04uc3RyaW5naWZ5KHRoaXMubm9kZS5zdGFjay50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3JtKX0gaXMgdXNlZC5gKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBdXRvbWF0aWNhbGx5IGNvbmZpZ3VyZSB0aGUgcmVxdWlyZWQgdHJhbnNmb3JtXG4gICAgICAgIHRoaXMubm9kZS5zdGFjay50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3JtID0gQ2ZuRnVuY3Rpb24ucmVxdWlyZWRUcmFuc2Zvcm07XG4gICAgICAgIHRoaXMuZnVuY3Rpb25OYW1lID0gdGhpcy5yZWYudG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3QgdGFncyA9IHByb3BzID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBwcm9wcy50YWdzO1xuICAgICAgICB0aGlzLnRhZ3MgPSBuZXcgY2RrLlRhZ01hbmFnZXIoY2RrLlRhZ1R5cGUuTWFwLCBcIkFXUzo6U2VydmVybGVzczo6RnVuY3Rpb25cIiwgdGFncyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBwcm9wZXJ0eU92ZXJyaWRlcygpOiBDZm5GdW5jdGlvblByb3BzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudW50eXBlZFByb3BlcnR5T3ZlcnJpZGVzO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wZXJ0aWVzOiBhbnkpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5GdW5jdGlvblByb3BzVG9DbG91ZEZvcm1hdGlvbih0aGlzLm5vZGUucmVzb2x2ZShwcm9wZXJ0aWVzKSk7XG4gICAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkZ1bmN0aW9uIHtcbiAgICAvKipcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhbGV4YXNraWxsXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBBbGV4YVNraWxsRXZlbnRQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uQWxleGFTa2lsbEV2ZW50UHJvcGVydHkuVmFyaWFibGVzYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhbGV4YXNraWxsXG4gICAgICAgICAqL1xuICAgICAgICB2YXJpYWJsZXM/OiB7IFtrZXk6IHN0cmluZ106IChzdHJpbmcpIH0gfCBjZGsuVG9rZW47XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEFsZXhhU2tpbGxFdmVudFByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBBbGV4YVNraWxsRXZlbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5GdW5jdGlvbl9BbGV4YVNraWxsRXZlbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ZhcmlhYmxlcycsIGNkay5oYXNoVmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMudmFyaWFibGVzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkFsZXhhU2tpbGxFdmVudFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5BbGV4YVNraWxsRXZlbnRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEFsZXhhU2tpbGxFdmVudFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5BbGV4YVNraWxsRXZlbnRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRnVuY3Rpb25BbGV4YVNraWxsRXZlbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRnVuY3Rpb25fQWxleGFTa2lsbEV2ZW50UHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBWYXJpYWJsZXM6IGNkay5oYXNoTWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnZhcmlhYmxlcyksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5GdW5jdGlvbiB7XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXBpXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBBcGlFdmVudFByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5BcGlFdmVudFByb3BlcnR5Lk1ldGhvZGBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXBpXG4gICAgICAgICAqL1xuICAgICAgICBtZXRob2Q6IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5BcGlFdmVudFByb3BlcnR5LlBhdGhgXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2FwaVxuICAgICAgICAgKi9cbiAgICAgICAgcGF0aDogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkZ1bmN0aW9uLkFwaUV2ZW50UHJvcGVydHkuUmVzdEFwaUlkYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhcGlcbiAgICAgICAgICovXG4gICAgICAgIHJlc3RBcGlJZD86IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQXBpRXZlbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQXBpRXZlbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5GdW5jdGlvbl9BcGlFdmVudFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0aG9kJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLm1ldGhvZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbWV0aG9kJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLm1ldGhvZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncGF0aCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5wYXRoKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwYXRoJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnBhdGgpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Jlc3RBcGlJZCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5yZXN0QXBpSWQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQXBpRXZlbnRQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uQXBpRXZlbnRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEFwaUV2ZW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLkFwaUV2ZW50YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkZ1bmN0aW9uQXBpRXZlbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRnVuY3Rpb25fQXBpRXZlbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1ldGhvZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5tZXRob2QpLFxuICAgICAgUGF0aDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5wYXRoKSxcbiAgICAgIFJlc3RBcGlJZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5yZXN0QXBpSWQpLFxuICAgIH07XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuRnVuY3Rpb24ge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2Nsb3Vkd2F0Y2hldmVudFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRXYXRjaEV2ZW50RXZlbnRQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uQ2xvdWRXYXRjaEV2ZW50RXZlbnRQcm9wZXJ0eS5JbnB1dGBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjY2xvdWR3YXRjaGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBpbnB1dD86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5DbG91ZFdhdGNoRXZlbnRFdmVudFByb3BlcnR5LklucHV0UGF0aGBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjY2xvdWR3YXRjaGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBpbnB1dFBhdGg/OiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uQ2xvdWRXYXRjaEV2ZW50RXZlbnRQcm9wZXJ0eS5QYXR0ZXJuYFxuICAgICAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2V2ZW50cy9DbG91ZFdhdGNoRXZlbnRzYW5kRXZlbnRQYXR0ZXJucy5odG1sXG4gICAgICAgICAqL1xuICAgICAgICBwYXR0ZXJuOiBvYmplY3QgfCBjZGsuVG9rZW47XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENsb3VkV2F0Y2hFdmVudEV2ZW50UHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENsb3VkV2F0Y2hFdmVudEV2ZW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRnVuY3Rpb25fQ2xvdWRXYXRjaEV2ZW50RXZlbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2lucHV0JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmlucHV0KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdpbnB1dFBhdGgnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuaW5wdXRQYXRoKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwYXR0ZXJuJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnBhdHRlcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3BhdHRlcm4nLCBjZGsudmFsaWRhdGVPYmplY3QpKHByb3BlcnRpZXMucGF0dGVybikpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDbG91ZFdhdGNoRXZlbnRFdmVudFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5DbG91ZFdhdGNoRXZlbnRFdmVudGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2xvdWRXYXRjaEV2ZW50RXZlbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uQ2xvdWRXYXRjaEV2ZW50RXZlbnRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRnVuY3Rpb25DbG91ZFdhdGNoRXZlbnRFdmVudFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5GdW5jdGlvbl9DbG91ZFdhdGNoRXZlbnRFdmVudFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgSW5wdXQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuaW5wdXQpLFxuICAgICAgSW5wdXRQYXRoOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmlucHV0UGF0aCksXG4gICAgICBQYXR0ZXJuOiBjZGsub2JqZWN0VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnBhdHRlcm4pLFxuICAgIH07XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuRnVuY3Rpb24ge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2RlYWRsZXR0ZXJxdWV1ZS1vYmplY3RcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIERlYWRMZXR0ZXJRdWV1ZVByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5EZWFkTGV0dGVyUXVldWVQcm9wZXJ0eS5UYXJnZXRBcm5gXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdGFyZ2V0QXJuOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uRGVhZExldHRlclF1ZXVlUHJvcGVydHkuVHlwZWBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2Z1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB0eXBlOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYERlYWRMZXR0ZXJRdWV1ZVByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBEZWFkTGV0dGVyUXVldWVQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5GdW5jdGlvbl9EZWFkTGV0dGVyUXVldWVQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhcmdldEFybicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy50YXJnZXRBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhcmdldEFybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50YXJnZXRBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50eXBlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkRlYWRMZXR0ZXJRdWV1ZVByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5EZWFkTGV0dGVyUXVldWVgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYERlYWRMZXR0ZXJRdWV1ZVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5EZWFkTGV0dGVyUXVldWVgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRnVuY3Rpb25EZWFkTGV0dGVyUXVldWVQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRnVuY3Rpb25fRGVhZExldHRlclF1ZXVlUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBUYXJnZXRBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudGFyZ2V0QXJuKSxcbiAgICAgIFR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudHlwZSksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5GdW5jdGlvbiB7XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL2RvY3Mvc2FmZV9sYW1iZGFfZGVwbG95bWVudHMucnN0XG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZXBsb3ltZW50UHJlZmVyZW5jZVByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5EZXBsb3ltZW50UHJlZmVyZW5jZVByb3BlcnR5LkVuYWJsZWRgXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2RlcGxveW1lbnRwcmVmZXJlbmNlLW9iamVjdFxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlZDogYm9vbGVhbiB8IGNkay5Ub2tlbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5EZXBsb3ltZW50UHJlZmVyZW5jZVByb3BlcnR5LlR5cGVgXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2RlcGxveW1lbnRwcmVmZXJlbmNlLW9iamVjdFxuICAgICAgICAgKi9cbiAgICAgICAgdHlwZTogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkZ1bmN0aW9uLkRlcGxveW1lbnRQcmVmZXJlbmNlUHJvcGVydHkuQWxhcm1zYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNkZXBsb3ltZW50cHJlZmVyZW5jZS1vYmplY3RcbiAgICAgICAgICovXG4gICAgICAgIGFsYXJtcz86IHN0cmluZ1tdO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkZ1bmN0aW9uLkRlcGxveW1lbnRQcmVmZXJlbmNlUHJvcGVydHkuSG9va3NgXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2RlcGxveW1lbnRwcmVmZXJlbmNlLW9iamVjdFxuICAgICAgICAgKi9cbiAgICAgICAgaG9va3M/OiBzdHJpbmdbXTtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgRGVwbG95bWVudFByZWZlcmVuY2VQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRGVwbG95bWVudFByZWZlcmVuY2VQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5GdW5jdGlvbl9EZXBsb3ltZW50UHJlZmVyZW5jZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZW5hYmxlZCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5lbmFibGVkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdlbmFibGVkJywgY2RrLnZhbGlkYXRlQm9vbGVhbikocHJvcGVydGllcy5lbmFibGVkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0eXBlJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnR5cGUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYWxhcm1zJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5hbGFybXMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2hvb2tzJywgY2RrLmxpc3RWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy5ob29rcykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJEZXBsb3ltZW50UHJlZmVyZW5jZVByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5EZXBsb3ltZW50UHJlZmVyZW5jZWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRGVwbG95bWVudFByZWZlcmVuY2VQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uRGVwbG95bWVudFByZWZlcmVuY2VgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRnVuY3Rpb25EZXBsb3ltZW50UHJlZmVyZW5jZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5GdW5jdGlvbl9EZXBsb3ltZW50UHJlZmVyZW5jZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgRW5hYmxlZDogY2RrLmJvb2xlYW5Ub0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZW5hYmxlZCksXG4gICAgICBUeXBlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnR5cGUpLFxuICAgICAgQWxhcm1zOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5hbGFybXMpLFxuICAgICAgSG9va3M6IGNkay5saXN0TWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLmhvb2tzKSxcbiAgICB9O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkZ1bmN0aW9uIHtcbiAgICAvKipcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNkeW5hbW9kYlxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgRHluYW1vREJFdmVudFByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5EeW5hbW9EQkV2ZW50UHJvcGVydHkuQmF0Y2hTaXplYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNkeW5hbW9kYlxuICAgICAgICAgKi9cbiAgICAgICAgYmF0Y2hTaXplOiBudW1iZXIgfCBjZGsuVG9rZW47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uRHluYW1vREJFdmVudFByb3BlcnR5LlN0YXJ0aW5nUG9zaXRpb25gXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2R5bmFtb2RiXG4gICAgICAgICAqL1xuICAgICAgICBzdGFydGluZ1Bvc2l0aW9uOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uRHluYW1vREJFdmVudFByb3BlcnR5LlN0cmVhbWBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjZHluYW1vZGJcbiAgICAgICAgICovXG4gICAgICAgIHN0cmVhbTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBEeW5hbW9EQkV2ZW50UHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYER5bmFtb0RCRXZlbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5GdW5jdGlvbl9EeW5hbW9EQkV2ZW50UHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdiYXRjaFNpemUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuYmF0Y2hTaXplKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdiYXRjaFNpemUnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMuYmF0Y2hTaXplKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzdGFydGluZ1Bvc2l0aW9uJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnN0YXJ0aW5nUG9zaXRpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N0YXJ0aW5nUG9zaXRpb24nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuc3RhcnRpbmdQb3NpdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc3RyZWFtJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnN0cmVhbSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc3RyZWFtJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnN0cmVhbSkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJEeW5hbW9EQkV2ZW50UHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLkR5bmFtb0RCRXZlbnRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYER5bmFtb0RCRXZlbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uRHluYW1vREJFdmVudGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5GdW5jdGlvbkR5bmFtb0RCRXZlbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRnVuY3Rpb25fRHluYW1vREJFdmVudFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgQmF0Y2hTaXplOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmJhdGNoU2l6ZSksXG4gICAgICBTdGFydGluZ1Bvc2l0aW9uOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnN0YXJ0aW5nUG9zaXRpb24pLFxuICAgICAgU3RyZWFtOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnN0cmVhbSksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5GdW5jdGlvbiB7XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjZXZlbnQtc291cmNlLW9iamVjdFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgRXZlbnRTb3VyY2VQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uRXZlbnRTb3VyY2VQcm9wZXJ0eS5Qcm9wZXJ0aWVzYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNldmVudC1zb3VyY2UtdHlwZXNcbiAgICAgICAgICovXG4gICAgICAgIHByb3BlcnRpZXM6IENmbkZ1bmN0aW9uLlMzRXZlbnRQcm9wZXJ0eSB8IENmbkZ1bmN0aW9uLlNOU0V2ZW50UHJvcGVydHkgfCBDZm5GdW5jdGlvbi5TUVNFdmVudFByb3BlcnR5IHwgQ2ZuRnVuY3Rpb24uS2luZXNpc0V2ZW50UHJvcGVydHkgfCBDZm5GdW5jdGlvbi5EeW5hbW9EQkV2ZW50UHJvcGVydHkgfCBDZm5GdW5jdGlvbi5BcGlFdmVudFByb3BlcnR5IHwgQ2ZuRnVuY3Rpb24uU2NoZWR1bGVFdmVudFByb3BlcnR5IHwgQ2ZuRnVuY3Rpb24uQ2xvdWRXYXRjaEV2ZW50RXZlbnRQcm9wZXJ0eSB8IENmbkZ1bmN0aW9uLklvVFJ1bGVFdmVudFByb3BlcnR5IHwgQ2ZuRnVuY3Rpb24uQWxleGFTa2lsbEV2ZW50UHJvcGVydHkgfCBjZGsuVG9rZW47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uRXZlbnRTb3VyY2VQcm9wZXJ0eS5UeXBlYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNldmVudC1zb3VyY2Utb2JqZWN0XG4gICAgICAgICAqL1xuICAgICAgICB0eXBlOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYEV2ZW50U291cmNlUHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEV2ZW50U291cmNlUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRnVuY3Rpb25fRXZlbnRTb3VyY2VQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3Byb3BlcnRpZXMnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMucHJvcGVydGllcykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncHJvcGVydGllcycsIGNkay51bmlvblZhbGlkYXRvcihDZm5GdW5jdGlvbl9TM0V2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX1NOU0V2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX1NRU0V2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX0tpbmVzaXNFdmVudFByb3BlcnR5VmFsaWRhdG9yLCBDZm5GdW5jdGlvbl9EeW5hbW9EQkV2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX0FwaUV2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX1NjaGVkdWxlRXZlbnRQcm9wZXJ0eVZhbGlkYXRvciwgQ2ZuRnVuY3Rpb25fQ2xvdWRXYXRjaEV2ZW50RXZlbnRQcm9wZXJ0eVZhbGlkYXRvciwgQ2ZuRnVuY3Rpb25fSW9UUnVsZUV2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX0FsZXhhU2tpbGxFdmVudFByb3BlcnR5VmFsaWRhdG9yKSkocHJvcGVydGllcy5wcm9wZXJ0aWVzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0eXBlJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnR5cGUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJFdmVudFNvdXJjZVByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5FdmVudFNvdXJjZWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRXZlbnRTb3VyY2VQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uRXZlbnRTb3VyY2VgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRnVuY3Rpb25FdmVudFNvdXJjZVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5GdW5jdGlvbl9FdmVudFNvdXJjZVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgUHJvcGVydGllczogY2RrLnVuaW9uTWFwcGVyKFtDZm5GdW5jdGlvbl9TM0V2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX1NOU0V2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX1NRU0V2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX0tpbmVzaXNFdmVudFByb3BlcnR5VmFsaWRhdG9yLCBDZm5GdW5jdGlvbl9EeW5hbW9EQkV2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX0FwaUV2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX1NjaGVkdWxlRXZlbnRQcm9wZXJ0eVZhbGlkYXRvciwgQ2ZuRnVuY3Rpb25fQ2xvdWRXYXRjaEV2ZW50RXZlbnRQcm9wZXJ0eVZhbGlkYXRvciwgQ2ZuRnVuY3Rpb25fSW9UUnVsZUV2ZW50UHJvcGVydHlWYWxpZGF0b3IsIENmbkZ1bmN0aW9uX0FsZXhhU2tpbGxFdmVudFByb3BlcnR5VmFsaWRhdG9yXSwgW2NmbkZ1bmN0aW9uUzNFdmVudFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbiwgY2ZuRnVuY3Rpb25TTlNFdmVudFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbiwgY2ZuRnVuY3Rpb25TUVNFdmVudFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbiwgY2ZuRnVuY3Rpb25LaW5lc2lzRXZlbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24sIGNmbkZ1bmN0aW9uRHluYW1vREJFdmVudFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbiwgY2ZuRnVuY3Rpb25BcGlFdmVudFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbiwgY2ZuRnVuY3Rpb25TY2hlZHVsZUV2ZW50UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uLCBjZm5GdW5jdGlvbkNsb3VkV2F0Y2hFdmVudEV2ZW50UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uLCBjZm5GdW5jdGlvbklvVFJ1bGVFdmVudFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbiwgY2ZuRnVuY3Rpb25BbGV4YVNraWxsRXZlbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb25dKShwcm9wZXJ0aWVzLnByb3BlcnRpZXMpLFxuICAgICAgVHlwZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50eXBlKSxcbiAgICB9O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkZ1bmN0aW9uIHtcbiAgICAvKipcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNlbnZpcm9ubWVudC1vYmplY3RcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIEZ1bmN0aW9uRW52aXJvbm1lbnRQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uRnVuY3Rpb25FbnZpcm9ubWVudFByb3BlcnR5LlZhcmlhYmxlc2BcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjZW52aXJvbm1lbnQtb2JqZWN0XG4gICAgICAgICAqL1xuICAgICAgICB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogKHN0cmluZykgfSB8IGNkay5Ub2tlbjtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgRnVuY3Rpb25FbnZpcm9ubWVudFByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBGdW5jdGlvbkVudmlyb25tZW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRnVuY3Rpb25fRnVuY3Rpb25FbnZpcm9ubWVudFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmFyaWFibGVzJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnZhcmlhYmxlcykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmFyaWFibGVzJywgY2RrLmhhc2hWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy52YXJpYWJsZXMpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiRnVuY3Rpb25FbnZpcm9ubWVudFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5GdW5jdGlvbkVudmlyb25tZW50YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBGdW5jdGlvbkVudmlyb25tZW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLkZ1bmN0aW9uRW52aXJvbm1lbnRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRnVuY3Rpb25GdW5jdGlvbkVudmlyb25tZW50UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkZ1bmN0aW9uX0Z1bmN0aW9uRW52aXJvbm1lbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIFZhcmlhYmxlczogY2RrLmhhc2hNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMudmFyaWFibGVzKSxcbiAgICB9O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkZ1bmN0aW9uIHtcbiAgICAvKipcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL3JlZmVyZW5jZV9wb2xpY2llcy5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQU1Qb2xpY3lEb2N1bWVudFByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5JQU1Qb2xpY3lEb2N1bWVudFByb3BlcnR5LlN0YXRlbWVudGBcbiAgICAgICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXMuaHRtbFxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGVtZW50OiBvYmplY3QgfCBjZGsuVG9rZW47XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYElBTVBvbGljeURvY3VtZW50UHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYElBTVBvbGljeURvY3VtZW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRnVuY3Rpb25fSUFNUG9saWN5RG9jdW1lbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N0YXRlbWVudCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5zdGF0ZW1lbnQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N0YXRlbWVudCcsIGNkay52YWxpZGF0ZU9iamVjdCkocHJvcGVydGllcy5zdGF0ZW1lbnQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiSUFNUG9saWN5RG9jdW1lbnRQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uSUFNUG9saWN5RG9jdW1lbnRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYElBTVBvbGljeURvY3VtZW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLklBTVBvbGljeURvY3VtZW50YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkZ1bmN0aW9uSUFNUG9saWN5RG9jdW1lbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRnVuY3Rpb25fSUFNUG9saWN5RG9jdW1lbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIFN0YXRlbWVudDogY2RrLm9iamVjdFRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zdGF0ZW1lbnQpLFxuICAgIH07XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuRnVuY3Rpb24ge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2lvdHJ1bGVcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIElvVFJ1bGVFdmVudFByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5Jb1RSdWxlRXZlbnRQcm9wZXJ0eS5Bd3NJb3RTcWxWZXJzaW9uYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNpb3RydWxlXG4gICAgICAgICAqL1xuICAgICAgICBhd3NJb3RTcWxWZXJzaW9uPzogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkZ1bmN0aW9uLklvVFJ1bGVFdmVudFByb3BlcnR5LlNxbGBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjaW90cnVsZVxuICAgICAgICAgKi9cbiAgICAgICAgc3FsOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYElvVFJ1bGVFdmVudFByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBJb1RSdWxlRXZlbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5GdW5jdGlvbl9Jb1RSdWxlRXZlbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2F3c0lvdFNxbFZlcnNpb24nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuYXdzSW90U3FsVmVyc2lvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc3FsJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnNxbCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc3FsJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnNxbCkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJJb1RSdWxlRXZlbnRQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uSW9UUnVsZUV2ZW50YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBJb1RSdWxlRXZlbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uSW9UUnVsZUV2ZW50YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkZ1bmN0aW9uSW9UUnVsZUV2ZW50UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkZ1bmN0aW9uX0lvVFJ1bGVFdmVudFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgQXdzSW90U3FsVmVyc2lvbjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hd3NJb3RTcWxWZXJzaW9uKSxcbiAgICAgIFNxbDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zcWwpLFxuICAgIH07XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuRnVuY3Rpb24ge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2tpbmVzaXNcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIEtpbmVzaXNFdmVudFByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5LaW5lc2lzRXZlbnRQcm9wZXJ0eS5CYXRjaFNpemVgXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2tpbmVzaXNcbiAgICAgICAgICovXG4gICAgICAgIGJhdGNoU2l6ZT86IG51bWJlciB8IGNkay5Ub2tlbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5LaW5lc2lzRXZlbnRQcm9wZXJ0eS5TdGFydGluZ1Bvc2l0aW9uYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNraW5lc2lzXG4gICAgICAgICAqL1xuICAgICAgICBzdGFydGluZ1Bvc2l0aW9uOiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uS2luZXNpc0V2ZW50UHJvcGVydHkuU3RyZWFtYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNraW5lc2lzXG4gICAgICAgICAqL1xuICAgICAgICBzdHJlYW06IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgS2luZXNpc0V2ZW50UHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEtpbmVzaXNFdmVudFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkZ1bmN0aW9uX0tpbmVzaXNFdmVudFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYmF0Y2hTaXplJywgY2RrLnZhbGlkYXRlTnVtYmVyKShwcm9wZXJ0aWVzLmJhdGNoU2l6ZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc3RhcnRpbmdQb3NpdGlvbicsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5zdGFydGluZ1Bvc2l0aW9uKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzdGFydGluZ1Bvc2l0aW9uJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnN0YXJ0aW5nUG9zaXRpb24pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N0cmVhbScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5zdHJlYW0pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N0cmVhbScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5zdHJlYW0pKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiS2luZXNpc0V2ZW50UHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLktpbmVzaXNFdmVudGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgS2luZXNpc0V2ZW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLktpbmVzaXNFdmVudGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5GdW5jdGlvbktpbmVzaXNFdmVudFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5GdW5jdGlvbl9LaW5lc2lzRXZlbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIEJhdGNoU2l6ZTogY2RrLm51bWJlclRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5iYXRjaFNpemUpLFxuICAgICAgU3RhcnRpbmdQb3NpdGlvbjogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zdGFydGluZ1Bvc2l0aW9uKSxcbiAgICAgIFN0cmVhbTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zdHJlYW0pLFxuICAgIH07XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuRnVuY3Rpb24ge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI3MzXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBTM0V2ZW50UHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkZ1bmN0aW9uLlMzRXZlbnRQcm9wZXJ0eS5CdWNrZXRgXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI3MzXG4gICAgICAgICAqL1xuICAgICAgICBidWNrZXQ6IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5TM0V2ZW50UHJvcGVydHkuRXZlbnRzYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNzM1xuICAgICAgICAgKi9cbiAgICAgICAgZXZlbnRzOiBzdHJpbmdbXSB8IHN0cmluZyB8IGNkay5Ub2tlbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5TM0V2ZW50UHJvcGVydHkuRmlsdGVyYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNzM1xuICAgICAgICAgKi9cbiAgICAgICAgZmlsdGVyPzogQ2ZuRnVuY3Rpb24uUzNOb3RpZmljYXRpb25GaWx0ZXJQcm9wZXJ0eSB8IGNkay5Ub2tlbjtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUzNFdmVudFByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBTM0V2ZW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRnVuY3Rpb25fUzNFdmVudFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYnVja2V0JywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmJ1Y2tldCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYnVja2V0JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmJ1Y2tldCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZXZlbnRzJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmV2ZW50cykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZXZlbnRzJywgY2RrLnVuaW9uVmFsaWRhdG9yKGNkay51bmlvblZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudW5pb25WYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkpKShwcm9wZXJ0aWVzLmV2ZW50cykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignZmlsdGVyJywgQ2ZuRnVuY3Rpb25fUzNOb3RpZmljYXRpb25GaWx0ZXJQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5maWx0ZXIpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiUzNFdmVudFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5TM0V2ZW50YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBTM0V2ZW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLlMzRXZlbnRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRnVuY3Rpb25TM0V2ZW50UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkZ1bmN0aW9uX1MzRXZlbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIEJ1Y2tldDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5idWNrZXQpLFxuICAgICAgRXZlbnRzOiBjZGsudW5pb25NYXBwZXIoW2Nkay51bmlvblZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudW5pb25WYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSldLCBbY2RrLnVuaW9uTWFwcGVyKFtjZGsudmFsaWRhdGVTdHJpbmddLCBbY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb25dKSwgY2RrLmxpc3RNYXBwZXIoY2RrLnVuaW9uTWFwcGVyKFtjZGsudmFsaWRhdGVTdHJpbmddLCBbY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb25dKSldKShwcm9wZXJ0aWVzLmV2ZW50cyksXG4gICAgICBGaWx0ZXI6IGNmbkZ1bmN0aW9uUzNOb3RpZmljYXRpb25GaWx0ZXJQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5maWx0ZXIpLFxuICAgIH07XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuRnVuY3Rpb24ge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI3MzLWxvY2F0aW9uLW9iamVjdFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgUzNMb2NhdGlvblByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5TM0xvY2F0aW9uUHJvcGVydHkuQnVja2V0YFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzZnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIGJ1Y2tldDogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkZ1bmN0aW9uLlMzTG9jYXRpb25Qcm9wZXJ0eS5LZXlgXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAga2V5OiBzdHJpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uUzNMb2NhdGlvblByb3BlcnR5LlZlcnNpb25gXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdmVyc2lvbj86IG51bWJlciB8IGNkay5Ub2tlbjtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUzNMb2NhdGlvblByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBTM0xvY2F0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRnVuY3Rpb25fUzNMb2NhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYnVja2V0JywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmJ1Y2tldCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignYnVja2V0JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmJ1Y2tldCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5JywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLmtleSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigna2V5JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmtleSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmVyc2lvbicsIGNkay52YWxpZGF0ZU51bWJlcikocHJvcGVydGllcy52ZXJzaW9uKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlMzTG9jYXRpb25Qcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uUzNMb2NhdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUzNMb2NhdGlvblByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5TM0xvY2F0aW9uYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkZ1bmN0aW9uUzNMb2NhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5GdW5jdGlvbl9TM0xvY2F0aW9uUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBCdWNrZXQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYnVja2V0KSxcbiAgICAgIEtleTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5rZXkpLFxuICAgICAgVmVyc2lvbjogY2RrLm51bWJlclRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy52ZXJzaW9uKSxcbiAgICB9O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkZ1bmN0aW9uIHtcbiAgICAvKipcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczMtYnVja2V0LW5vdGlmaWNhdGlvbmNvbmZpZ3VyYXRpb24tY29uZmlnLWZpbHRlci5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBTM05vdGlmaWNhdGlvbkZpbHRlclByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5TM05vdGlmaWNhdGlvbkZpbHRlclByb3BlcnR5LlMzS2V5YFxuICAgICAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczMtYnVja2V0LW5vdGlmaWNhdGlvbmNvbmZpZ3VyYXRpb24tY29uZmlnLWZpbHRlci5odG1sXG4gICAgICAgICAqL1xuICAgICAgICBzM0tleTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBTM05vdGlmaWNhdGlvbkZpbHRlclByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBTM05vdGlmaWNhdGlvbkZpbHRlclByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkZ1bmN0aW9uX1MzTm90aWZpY2F0aW9uRmlsdGVyUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzM0tleScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5zM0tleSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignczNLZXknLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuczNLZXkpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiUzNOb3RpZmljYXRpb25GaWx0ZXJQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uUzNOb3RpZmljYXRpb25GaWx0ZXJgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFMzTm90aWZpY2F0aW9uRmlsdGVyUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLlMzTm90aWZpY2F0aW9uRmlsdGVyYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkZ1bmN0aW9uUzNOb3RpZmljYXRpb25GaWx0ZXJQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRnVuY3Rpb25fUzNOb3RpZmljYXRpb25GaWx0ZXJQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIFMzS2V5OiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnMzS2V5KSxcbiAgICB9O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkZ1bmN0aW9uIHtcbiAgICAvKipcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNzbnNcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNOU0V2ZW50UHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkZ1bmN0aW9uLlNOU0V2ZW50UHJvcGVydHkuVG9waWNgXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI3Nuc1xuICAgICAgICAgKi9cbiAgICAgICAgdG9waWM6IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgU05TRXZlbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgU05TRXZlbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5GdW5jdGlvbl9TTlNFdmVudFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndG9waWMnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudG9waWMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RvcGljJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnRvcGljKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlNOU0V2ZW50UHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLlNOU0V2ZW50YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBTTlNFdmVudFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5TTlNFdmVudGAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5GdW5jdGlvblNOU0V2ZW50UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkZ1bmN0aW9uX1NOU0V2ZW50UHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBUb3BpYzogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50b3BpYyksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5GdW5jdGlvbiB7XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjc3FzXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBTUVNFdmVudFByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5GdW5jdGlvbi5TUVNFdmVudFByb3BlcnR5LkJhdGNoU2l6ZWBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjc3FzXG4gICAgICAgICAqL1xuICAgICAgICBiYXRjaFNpemU/OiBudW1iZXIgfCBjZGsuVG9rZW47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uU1FTRXZlbnRQcm9wZXJ0eS5RdWV1ZWBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjc3FzXG4gICAgICAgICAqL1xuICAgICAgICBxdWV1ZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBTUVNFdmVudFByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBTUVNFdmVudFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkZ1bmN0aW9uX1NRU0V2ZW50UHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdiYXRjaFNpemUnLCBjZGsudmFsaWRhdGVOdW1iZXIpKHByb3BlcnRpZXMuYmF0Y2hTaXplKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdxdWV1ZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5xdWV1ZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncXVldWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMucXVldWUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiU1FTRXZlbnRQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6RnVuY3Rpb24uU1FTRXZlbnRgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFNRU0V2ZW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLlNRU0V2ZW50YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkZ1bmN0aW9uU1FTRXZlbnRQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRnVuY3Rpb25fU1FTRXZlbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIEJhdGNoU2l6ZTogY2RrLm51bWJlclRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5iYXRjaFNpemUpLFxuICAgICAgUXVldWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucXVldWUpLFxuICAgIH07XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuRnVuY3Rpb24ge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI3NjaGVkdWxlXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBTY2hlZHVsZUV2ZW50UHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkZ1bmN0aW9uLlNjaGVkdWxlRXZlbnRQcm9wZXJ0eS5JbnB1dGBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjc2NoZWR1bGVcbiAgICAgICAgICovXG4gICAgICAgIGlucHV0Pzogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmbkZ1bmN0aW9uLlNjaGVkdWxlRXZlbnRQcm9wZXJ0eS5TY2hlZHVsZWBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjc2NoZWR1bGVcbiAgICAgICAgICovXG4gICAgICAgIHNjaGVkdWxlOiBzdHJpbmc7XG4gICAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYFNjaGVkdWxlRXZlbnRQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgU2NoZWR1bGVFdmVudFByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkZ1bmN0aW9uX1NjaGVkdWxlRXZlbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2lucHV0JywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmlucHV0KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzY2hlZHVsZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5zY2hlZHVsZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc2NoZWR1bGUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuc2NoZWR1bGUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiU2NoZWR1bGVFdmVudFByb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5TY2hlZHVsZUV2ZW50YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBTY2hlZHVsZUV2ZW50UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkZ1bmN0aW9uLlNjaGVkdWxlRXZlbnRgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRnVuY3Rpb25TY2hlZHVsZUV2ZW50UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkZ1bmN0aW9uX1NjaGVkdWxlRXZlbnRQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIElucHV0OiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmlucHV0KSxcbiAgICAgIFNjaGVkdWxlOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnNjaGVkdWxlKSxcbiAgICB9O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIENmbkZ1bmN0aW9uIHtcbiAgICAvKipcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbGFtYmRhLWZ1bmN0aW9uLXZwY2NvbmZpZy5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBWcGNDb25maWdQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uVnBjQ29uZmlnUHJvcGVydHkuU2VjdXJpdHlHcm91cElkc2BcbiAgICAgICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWxhbWJkYS1mdW5jdGlvbi12cGNjb25maWcuaHRtbFxuICAgICAgICAgKi9cbiAgICAgICAgc2VjdXJpdHlHcm91cElkczogc3RyaW5nW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuRnVuY3Rpb24uVnBjQ29uZmlnUHJvcGVydHkuU3VibmV0SWRzYFxuICAgICAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbGFtYmRhLWZ1bmN0aW9uLXZwY2NvbmZpZy5odG1sXG4gICAgICAgICAqL1xuICAgICAgICBzdWJuZXRJZHM6IHN0cmluZ1tdO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBWcGNDb25maWdQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgVnBjQ29uZmlnUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuRnVuY3Rpb25fVnBjQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdzZWN1cml0eUdyb3VwSWRzJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnNlY3VyaXR5R3JvdXBJZHMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3NlY3VyaXR5R3JvdXBJZHMnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpKShwcm9wZXJ0aWVzLnNlY3VyaXR5R3JvdXBJZHMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N1Ym5ldElkcycsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5zdWJuZXRJZHMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3N1Ym5ldElkcycsIGNkay5saXN0VmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMuc3VibmV0SWRzKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIlZwY0NvbmZpZ1Byb3BlcnR5XCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5WcGNDb25maWdgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFZwY0NvbmZpZ1Byb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpGdW5jdGlvbi5WcGNDb25maWdgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRnVuY3Rpb25WcGNDb25maWdQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuRnVuY3Rpb25fVnBjQ29uZmlnUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBTZWN1cml0eUdyb3VwSWRzOiBjZGsubGlzdE1hcHBlcihjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbikocHJvcGVydGllcy5zZWN1cml0eUdyb3VwSWRzKSxcbiAgICAgIFN1Ym5ldElkczogY2RrLmxpc3RNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuc3VibmV0SWRzKSxcbiAgICB9O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYEFXUzo6U2VydmVybGVzczo6TGF5ZXJWZXJzaW9uYFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2xheWVydmVyc2lvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkxheWVyVmVyc2lvblByb3BzIHtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpMYXllclZlcnNpb24uQ29tcGF0aWJsZVJ1bnRpbWVzYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NsYXllcnZlcnNpb25cbiAgICAgKi9cbiAgICBjb21wYXRpYmxlUnVudGltZXM/OiBzdHJpbmdbXTtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpMYXllclZlcnNpb24uQ29udGVudFVyaWBcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzbGF5ZXJ2ZXJzaW9uXG4gICAgICovXG4gICAgY29udGVudFVyaT86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpMYXllclZlcnNpb24uRGVzY3JpcHRpb25gXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2xheWVydmVyc2lvblxuICAgICAqL1xuICAgIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkxheWVyVmVyc2lvbi5MYXllck5hbWVgXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2xheWVydmVyc2lvblxuICAgICAqL1xuICAgIGxheWVyTmFtZT86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpMYXllclZlcnNpb24uTGljZW5zZUluZm9gXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2xheWVydmVyc2lvblxuICAgICAqL1xuICAgIGxpY2Vuc2VJbmZvPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OkxheWVyVmVyc2lvbi5SZXRlbnRpb25Qb2xpY3lgXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc2xheWVydmVyc2lvblxuICAgICAqL1xuICAgIHJldGVudGlvblBvbGljeT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5MYXllclZlcnNpb25Qcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuTGF5ZXJWZXJzaW9uUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuTGF5ZXJWZXJzaW9uUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjb21wYXRpYmxlUnVudGltZXMnLCBjZGsubGlzdFZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpKShwcm9wZXJ0aWVzLmNvbXBhdGlibGVSdW50aW1lcykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY29udGVudFVyaScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5jb250ZW50VXJpKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdkZXNjcmlwdGlvbicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5kZXNjcmlwdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbGF5ZXJOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmxheWVyTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbGljZW5zZUluZm8nLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubGljZW5zZUluZm8pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3JldGVudGlvblBvbGljeScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5yZXRlbnRpb25Qb2xpY3kpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuTGF5ZXJWZXJzaW9uUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkxheWVyVmVyc2lvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuTGF5ZXJWZXJzaW9uUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OkxheWVyVmVyc2lvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5MYXllclZlcnNpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuTGF5ZXJWZXJzaW9uUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICBDb21wYXRpYmxlUnVudGltZXM6IGNkay5saXN0TWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLmNvbXBhdGlibGVSdW50aW1lcyksXG4gICAgICBDb250ZW50VXJpOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNvbnRlbnRVcmkpLFxuICAgICAgRGVzY3JpcHRpb246IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZGVzY3JpcHRpb24pLFxuICAgICAgTGF5ZXJOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmxheWVyTmFtZSksXG4gICAgICBMaWNlbnNlSW5mbzogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5saWNlbnNlSW5mbyksXG4gICAgICBSZXRlbnRpb25Qb2xpY3k6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmV0ZW50aW9uUG9saWN5KSxcbiAgICB9O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6U2VydmVybGVzczo6TGF5ZXJWZXJzaW9uYFxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6U2VydmVybGVzczo6TGF5ZXJWZXJzaW9uXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNhd3NzZXJ2ZXJsZXNzbGF5ZXJ2ZXJzaW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5MYXllclZlcnNpb24gZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2Uge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSByZXNvdXJjZVR5cGVOYW1lID0gXCJBV1M6OlNlcnZlcmxlc3M6OkxheWVyVmVyc2lvblwiO1xuICAgIC8qKlxuICAgICAqIFRoZSBgVHJhbnNmb3JtYCBhIHRlbXBsYXRlIG11c3QgdXNlIGluIG9yZGVyIHRvIHVzZSB0aGlzIHJlc291cmNlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSByZXF1aXJlZFRyYW5zZm9ybSA9IFwiQVdTOjpTZXJ2ZXJsZXNzLTIwMTYtMTAtMzFcIjtcbiAgICBwdWJsaWMgcmVhZG9ubHkgbGF5ZXJWZXJzaW9uQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6U2VydmVybGVzczo6TGF5ZXJWZXJzaW9uYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogQ2ZuTGF5ZXJWZXJzaW9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkxheWVyVmVyc2lvbi5yZXNvdXJjZVR5cGVOYW1lLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgLy8gSWYgYSBkaWZmZXJlbnQgdHJhbnNmb3JtIHRoYW4gdGhlIHJlcXVpcmVkIG9uZSBpcyBpbiB1c2UsIHRoaXMgcmVzb3VyY2UgY2Fubm90IGJlIHVzZWRcbiAgICAgICAgaWYgKHRoaXMubm9kZS5zdGFjay50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3JtICYmIHRoaXMubm9kZS5zdGFjay50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3JtICE9PSBDZm5MYXllclZlcnNpb24ucmVxdWlyZWRUcmFuc2Zvcm0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlICR7SlNPTi5zdHJpbmdpZnkoQ2ZuTGF5ZXJWZXJzaW9uLnJlcXVpcmVkVHJhbnNmb3JtKX0gdHJhbnNmb3JtIGlzIHJlcXVpcmVkIHdoZW4gdXNpbmcgQ2ZuTGF5ZXJWZXJzaW9uLCBidXQgdGhlICR7SlNPTi5zdHJpbmdpZnkodGhpcy5ub2RlLnN0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm0pfSBpcyB1c2VkLmApO1xuICAgICAgICB9XG4gICAgICAgIC8vIEF1dG9tYXRpY2FsbHkgY29uZmlndXJlIHRoZSByZXF1aXJlZCB0cmFuc2Zvcm1cbiAgICAgICAgdGhpcy5ub2RlLnN0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm0gPSBDZm5MYXllclZlcnNpb24ucmVxdWlyZWRUcmFuc2Zvcm07XG4gICAgICAgIHRoaXMubGF5ZXJWZXJzaW9uQXJuID0gdGhpcy5yZWYudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHByb3BlcnR5T3ZlcnJpZGVzKCk6IENmbkxheWVyVmVyc2lvblByb3BzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudW50eXBlZFByb3BlcnR5T3ZlcnJpZGVzO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wZXJ0aWVzOiBhbnkpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5MYXllclZlcnNpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24odGhpcy5ub2RlLnJlc29sdmUocHJvcGVydGllcykpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBBV1M6OlNlcnZlcmxlc3M6OlNpbXBsZVRhYmxlYFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjYXdzc2VydmVybGVzc3NpbXBsZXRhYmxlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuU2ltcGxlVGFibGVQcm9wcyB7XG4gICAgLyoqXG4gICAgICogYEFXUzo6U2VydmVybGVzczo6U2ltcGxlVGFibGUuUHJpbWFyeUtleWBcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNwcmltYXJ5LWtleS1vYmplY3RcbiAgICAgKi9cbiAgICBwcmltYXJ5S2V5PzogQ2ZuU2ltcGxlVGFibGUuUHJpbWFyeUtleVByb3BlcnR5IHwgY2RrLlRva2VuO1xuICAgIC8qKlxuICAgICAqIGBBV1M6OlNlcnZlcmxlc3M6OlNpbXBsZVRhYmxlLlByb3Zpc2lvbmVkVGhyb3VnaHB1dGBcbiAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZHluYW1vZGItcHJvdmlzaW9uZWR0aHJvdWdocHV0Lmh0bWxcbiAgICAgKi9cbiAgICBwcm92aXNpb25lZFRocm91Z2hwdXQ/OiBDZm5TaW1wbGVUYWJsZS5Qcm92aXNpb25lZFRocm91Z2hwdXRQcm9wZXJ0eSB8IGNkay5Ub2tlbjtcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpTaW1wbGVUYWJsZS5TU0VTcGVjaWZpY2F0aW9uYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NzaW1wbGV0YWJsZVxuICAgICAqL1xuICAgIHNzZVNwZWNpZmljYXRpb24/OiBDZm5TaW1wbGVUYWJsZS5TU0VTcGVjaWZpY2F0aW9uUHJvcGVydHkgfCBjZGsuVG9rZW47XG4gICAgLyoqXG4gICAgICogYEFXUzo6U2VydmVybGVzczo6U2ltcGxlVGFibGUuVGFibGVOYW1lYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NzaW1wbGV0YWJsZVxuICAgICAqL1xuICAgIHRhYmxlTmFtZT86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBgQVdTOjpTZXJ2ZXJsZXNzOjpTaW1wbGVUYWJsZS5UYWdzYFxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NzaW1wbGV0YWJsZVxuICAgICAqL1xuICAgIHRhZ3M/OiB7IFtrZXk6IHN0cmluZ106IChzdHJpbmcpIH07XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgQ2ZuU2ltcGxlVGFibGVQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuU2ltcGxlVGFibGVQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5TaW1wbGVUYWJsZVByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigncHJpbWFyeUtleScsIENmblNpbXBsZVRhYmxlX1ByaW1hcnlLZXlQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5wcmltYXJ5S2V5KSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdwcm92aXNpb25lZFRocm91Z2hwdXQnLCBDZm5TaW1wbGVUYWJsZV9Qcm92aXNpb25lZFRocm91Z2hwdXRQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5wcm92aXNpb25lZFRocm91Z2hwdXQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3NzZVNwZWNpZmljYXRpb24nLCBDZm5TaW1wbGVUYWJsZV9TU0VTcGVjaWZpY2F0aW9uUHJvcGVydHlWYWxpZGF0b3IpKHByb3BlcnRpZXMuc3NlU3BlY2lmaWNhdGlvbikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGFibGVOYW1lJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnRhYmxlTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGFncycsIGNkay5oYXNoVmFsaWRhdG9yKGNkay52YWxpZGF0ZVN0cmluZykpKHByb3BlcnRpZXMudGFncykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5TaW1wbGVUYWJsZVByb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpTZXJ2ZXJsZXNzOjpTaW1wbGVUYWJsZWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuU2ltcGxlVGFibGVQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6U2ltcGxlVGFibGVgIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuU2ltcGxlVGFibGVQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuU2ltcGxlVGFibGVQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIFByaW1hcnlLZXk6IGNmblNpbXBsZVRhYmxlUHJpbWFyeUtleVByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnByaW1hcnlLZXkpLFxuICAgICAgUHJvdmlzaW9uZWRUaHJvdWdocHV0OiBjZm5TaW1wbGVUYWJsZVByb3Zpc2lvbmVkVGhyb3VnaHB1dFByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLnByb3Zpc2lvbmVkVGhyb3VnaHB1dCksXG4gICAgICBTU0VTcGVjaWZpY2F0aW9uOiBjZm5TaW1wbGVUYWJsZVNTRVNwZWNpZmljYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5zc2VTcGVjaWZpY2F0aW9uKSxcbiAgICAgIFRhYmxlTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50YWJsZU5hbWUpLFxuICAgICAgVGFnczogY2RrLmhhc2hNYXBwZXIoY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMudGFncyksXG4gICAgfTtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OlNlcnZlcmxlc3M6OlNpbXBsZVRhYmxlYFxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6U2VydmVybGVzczo6U2ltcGxlVGFibGVcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI2F3c3NlcnZlcmxlc3NzaW1wbGV0YWJsZVxuICovXG5leHBvcnQgY2xhc3MgQ2ZuU2ltcGxlVGFibGUgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2Uge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSByZXNvdXJjZVR5cGVOYW1lID0gXCJBV1M6OlNlcnZlcmxlc3M6OlNpbXBsZVRhYmxlXCI7XG4gICAgLyoqXG4gICAgICogVGhlIGBUcmFuc2Zvcm1gIGEgdGVtcGxhdGUgbXVzdCB1c2UgaW4gb3JkZXIgdG8gdXNlIHRoaXMgcmVzb3VyY2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHJlcXVpcmVkVHJhbnNmb3JtID0gXCJBV1M6OlNlcnZlcmxlc3MtMjAxNi0xMC0zMVwiO1xuICAgIHB1YmxpYyByZWFkb25seSBzaW1wbGVUYWJsZU5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBgVGFnTWFuYWdlcmAgaGFuZGxlcyBzZXR0aW5nLCByZW1vdmluZyBhbmQgZm9ybWF0dGluZyB0YWdzXG4gICAgICpcbiAgICAgKiBUYWdzIHNob3VsZCBiZSBtYW5hZ2VkIGVpdGhlciBwYXNzaW5nIHRoZW0gYXMgcHJvcGVydGllcyBkdXJpbmdcbiAgICAgKiBpbml0aWF0aW9uIG9yIGJ5IGNhbGxpbmcgbWV0aG9kcyBvbiB0aGlzIG9iamVjdC4gSWYgYm90aCB0ZWNobmlxdWVzIGFyZVxuICAgICAqIHVzZWQgb25seSB0aGUgdGFncyBmcm9tIHRoZSBUYWdNYW5hZ2VyIHdpbGwgYmUgdXNlZC4gYFRhZ2AgKGFzcGVjdClcbiAgICAgKiB3aWxsIHVzZSB0aGUgbWFuYWdlci5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGFnczogY2RrLlRhZ01hbmFnZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFXUzo6U2VydmVybGVzczo6U2ltcGxlVGFibGVgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBDZm5TaW1wbGVUYWJsZVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5TaW1wbGVUYWJsZS5yZXNvdXJjZVR5cGVOYW1lLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgLy8gSWYgYSBkaWZmZXJlbnQgdHJhbnNmb3JtIHRoYW4gdGhlIHJlcXVpcmVkIG9uZSBpcyBpbiB1c2UsIHRoaXMgcmVzb3VyY2UgY2Fubm90IGJlIHVzZWRcbiAgICAgICAgaWYgKHRoaXMubm9kZS5zdGFjay50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3JtICYmIHRoaXMubm9kZS5zdGFjay50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3JtICE9PSBDZm5TaW1wbGVUYWJsZS5yZXF1aXJlZFRyYW5zZm9ybSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgJHtKU09OLnN0cmluZ2lmeShDZm5TaW1wbGVUYWJsZS5yZXF1aXJlZFRyYW5zZm9ybSl9IHRyYW5zZm9ybSBpcyByZXF1aXJlZCB3aGVuIHVzaW5nIENmblNpbXBsZVRhYmxlLCBidXQgdGhlICR7SlNPTi5zdHJpbmdpZnkodGhpcy5ub2RlLnN0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm0pfSBpcyB1c2VkLmApO1xuICAgICAgICB9XG4gICAgICAgIC8vIEF1dG9tYXRpY2FsbHkgY29uZmlndXJlIHRoZSByZXF1aXJlZCB0cmFuc2Zvcm1cbiAgICAgICAgdGhpcy5ub2RlLnN0YWNrLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm0gPSBDZm5TaW1wbGVUYWJsZS5yZXF1aXJlZFRyYW5zZm9ybTtcbiAgICAgICAgdGhpcy5zaW1wbGVUYWJsZU5hbWUgPSB0aGlzLnJlZi50b1N0cmluZygpO1xuICAgICAgICBjb25zdCB0YWdzID0gcHJvcHMgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHByb3BzLnRhZ3M7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5NYXAsIFwiQVdTOjpTZXJ2ZXJsZXNzOjpTaW1wbGVUYWJsZVwiLCB0YWdzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHByb3BlcnR5T3ZlcnJpZGVzKCk6IENmblNpbXBsZVRhYmxlUHJvcHMge1xuICAgICAgICByZXR1cm4gdGhpcy51bnR5cGVkUHJvcGVydHlPdmVycmlkZXM7XG4gICAgfVxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IGFueSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmblNpbXBsZVRhYmxlUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHRoaXMubm9kZS5yZXNvbHZlKHByb3BlcnRpZXMpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuU2ltcGxlVGFibGUge1xuICAgIC8qKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvc2VydmVybGVzcy1hcHBsaWNhdGlvbi1tb2RlbC9ibG9iL21hc3Rlci92ZXJzaW9ucy8yMDE2LTEwLTMxLm1kI3ByaW1hcnkta2V5LW9iamVjdFxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJpbWFyeUtleVByb3BlcnR5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGBDZm5TaW1wbGVUYWJsZS5QcmltYXJ5S2V5UHJvcGVydHkuTmFtZWBcbiAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uLW1vZGVsL2Jsb2IvbWFzdGVyL3ZlcnNpb25zLzIwMTYtMTAtMzEubWQjcHJpbWFyeS1rZXktb2JqZWN0XG4gICAgICAgICAqL1xuICAgICAgICBuYW1lPzogc3RyaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICogYENmblNpbXBsZVRhYmxlLlByaW1hcnlLZXlQcm9wZXJ0eS5UeXBlYFxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL3NlcnZlcmxlc3MtYXBwbGljYXRpb24tbW9kZWwvYmxvYi9tYXN0ZXIvdmVyc2lvbnMvMjAxNi0xMC0zMS5tZCNwcmltYXJ5LWtleS1vYmplY3RcbiAgICAgICAgICovXG4gICAgICAgIHR5cGU6IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgUHJpbWFyeUtleVByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBQcmltYXJ5S2V5UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuU2ltcGxlVGFibGVfUHJpbWFyeUtleVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5uYW1lKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0eXBlJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnR5cGUpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJQcmltYXJ5S2V5UHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OlNpbXBsZVRhYmxlLlByaW1hcnlLZXlgIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFByaW1hcnlLZXlQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6U2ltcGxlVGFibGUuUHJpbWFyeUtleWAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5TaW1wbGVUYWJsZVByaW1hcnlLZXlQcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuU2ltcGxlVGFibGVfUHJpbWFyeUtleVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgTmFtZTogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5uYW1lKSxcbiAgICAgIFR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudHlwZSksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5TaW1wbGVUYWJsZSB7XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWR5bmFtb2RiLXByb3Zpc2lvbmVkdGhyb3VnaHB1dC5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBQcm92aXNpb25lZFRocm91Z2hwdXRQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuU2ltcGxlVGFibGUuUHJvdmlzaW9uZWRUaHJvdWdocHV0UHJvcGVydHkuUmVhZENhcGFjaXR5VW5pdHNgXG4gICAgICAgICAqIEBzZWUgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi1wcm92aXNpb25lZHRocm91Z2hwdXQuaHRtbFxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZENhcGFjaXR5VW5pdHM/OiBudW1iZXIgfCBjZGsuVG9rZW47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuU2ltcGxlVGFibGUuUHJvdmlzaW9uZWRUaHJvdWdocHV0UHJvcGVydHkuV3JpdGVDYXBhY2l0eVVuaXRzYFxuICAgICAgICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZHluYW1vZGItcHJvdmlzaW9uZWR0aHJvdWdocHV0Lmh0bWxcbiAgICAgICAgICovXG4gICAgICAgIHdyaXRlQ2FwYWNpdHlVbml0czogbnVtYmVyIHwgY2RrLlRva2VuO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBQcm92aXNpb25lZFRocm91Z2hwdXRQcm9wZXJ0eWBcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgUHJvdmlzaW9uZWRUaHJvdWdocHV0UHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuU2ltcGxlVGFibGVfUHJvdmlzaW9uZWRUaHJvdWdocHV0UHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdyZWFkQ2FwYWNpdHlVbml0cycsIGNkay52YWxpZGF0ZU51bWJlcikocHJvcGVydGllcy5yZWFkQ2FwYWNpdHlVbml0cykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignd3JpdGVDYXBhY2l0eVVuaXRzJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLndyaXRlQ2FwYWNpdHlVbml0cykpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignd3JpdGVDYXBhY2l0eVVuaXRzJywgY2RrLnZhbGlkYXRlTnVtYmVyKShwcm9wZXJ0aWVzLndyaXRlQ2FwYWNpdHlVbml0cykpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJQcm92aXNpb25lZFRocm91Z2hwdXRQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6U2ltcGxlVGFibGUuUHJvdmlzaW9uZWRUaHJvdWdocHV0YCByZXNvdXJjZVxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBQcm92aXNpb25lZFRocm91Z2hwdXRQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6U2ltcGxlVGFibGUuUHJvdmlzaW9uZWRUaHJvdWdocHV0YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblNpbXBsZVRhYmxlUHJvdmlzaW9uZWRUaHJvdWdocHV0UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblNpbXBsZVRhYmxlX1Byb3Zpc2lvbmVkVGhyb3VnaHB1dFByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgUmVhZENhcGFjaXR5VW5pdHM6IGNkay5udW1iZXJUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMucmVhZENhcGFjaXR5VW5pdHMpLFxuICAgICAgV3JpdGVDYXBhY2l0eVVuaXRzOiBjZGsubnVtYmVyVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLndyaXRlQ2FwYWNpdHlVbml0cyksXG4gICAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDZm5TaW1wbGVUYWJsZSB7XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1keW5hbW9kYi10YWJsZS1zc2VzcGVjaWZpY2F0aW9uLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNTRVNwZWNpZmljYXRpb25Qcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuU2ltcGxlVGFibGUuU1NFU3BlY2lmaWNhdGlvblByb3BlcnR5LlNTRUVuYWJsZWRgXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZHluYW1vZGItdGFibGUtc3Nlc3BlY2lmaWNhdGlvbi5odG1sXG4gICAgICAgICAqL1xuICAgICAgICBzc2VFbmFibGVkPzogYm9vbGVhbiB8IGNkay5Ub2tlbjtcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgU1NFU3BlY2lmaWNhdGlvblByb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBTU0VTcGVjaWZpY2F0aW9uUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuU2ltcGxlVGFibGVfU1NFU3BlY2lmaWNhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXM6IGFueSk6IGNkay5WYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBjZGsuVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IGNkay5WYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignc3NlRW5hYmxlZCcsIGNkay52YWxpZGF0ZUJvb2xlYW4pKHByb3BlcnRpZXMuc3NlRW5hYmxlZCkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJTU0VTcGVjaWZpY2F0aW9uUHJvcGVydHlcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlNlcnZlcmxlc3M6OlNpbXBsZVRhYmxlLlNTRVNwZWNpZmljYXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYFNTRVNwZWNpZmljYXRpb25Qcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U2VydmVybGVzczo6U2ltcGxlVGFibGUuU1NFU3BlY2lmaWNhdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5TaW1wbGVUYWJsZVNTRVNwZWNpZmljYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuU2ltcGxlVGFibGVfU1NFU3BlY2lmaWNhdGlvblByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgU1NFRW5hYmxlZDogY2RrLmJvb2xlYW5Ub0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuc3NlRW5hYmxlZCksXG4gICAgfTtcbn1cbiJdfQ==