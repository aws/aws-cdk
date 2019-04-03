// Copyright 2012-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2019-03-21T09:12:23.615Z","fingerprint":"UJ42fezBazlHPOkm0pNitOMM9peubfGEd2/XcTwSlsI="}

// tslint:disable:max-line-length | This is generated code - line lengths are difficult to control

import cdk = require('@aws-cdk/cdk');

/**
 * Properties for defining a `AWS::Serverless::Api`
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
 */
export interface CfnApiProps {
    /**
     * `AWS::Serverless::Api.StageName`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    stageName: string;
    /**
     * `AWS::Serverless::Api.Auth`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    auth?: CfnApi.AuthProperty | cdk.Token;
    /**
     * `AWS::Serverless::Api.BinaryMediaTypes`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    binaryMediaTypes?: string[];
    /**
     * `AWS::Serverless::Api.CacheClusterEnabled`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    cacheClusterEnabled?: boolean | cdk.Token;
    /**
     * `AWS::Serverless::Api.CacheClusterSize`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    cacheClusterSize?: string;
    /**
     * `AWS::Serverless::Api.Cors`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    cors?: string;
    /**
     * `AWS::Serverless::Api.DefinitionBody`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    definitionBody?: object | cdk.Token;
    /**
     * `AWS::Serverless::Api.DefinitionUri`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    definitionUri?: CfnApi.S3LocationProperty | string | cdk.Token;
    /**
     * `AWS::Serverless::Api.EndpointConfiguration`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    endpointConfiguration?: string;
    /**
     * `AWS::Serverless::Api.MethodSettings`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    methodSettings?: object | cdk.Token;
    /**
     * `AWS::Serverless::Api.Name`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    name?: string;
    /**
     * `AWS::Serverless::Api.Variables`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    variables?: { [key: string]: (string) } | cdk.Token;
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
function cfnApiPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
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
export class CfnApi extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly resourceTypeName = "AWS::Serverless::Api";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly requiredTransform = "AWS::Serverless-2016-10-31";
    public readonly apiName: string;

    /**
     * Create a new `AWS::Serverless::Api`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props: CfnApiProps) {
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

    public get propertyOverrides(): CfnApiProps {
        return this.untypedPropertyOverrides;
    }
    protected renderProperties(properties: any): { [key: string]: any }  {
        return cfnApiPropsToCloudFormation(this.node.resolve(properties));
    }
}

export namespace CfnApi {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
     */
    export interface AuthProperty {
        /**
         * `CfnApi.AuthProperty.Authorizers`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
         */
        authorizers?: object | cdk.Token;
        /**
         * `CfnApi.AuthProperty.DefaultAuthorizer`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
         */
        defaultAuthorizer?: string;
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
      Authorizers: cdk.objectToCloudFormation(properties.authorizers),
      DefaultAuthorizer: cdk.stringToCloudFormation(properties.defaultAuthorizer),
    };
}

export namespace CfnApi {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    export interface S3LocationProperty {
        /**
         * `CfnApi.S3LocationProperty.Bucket`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        bucket: string;
        /**
         * `CfnApi.S3LocationProperty.Key`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        key: string;
        /**
         * `CfnApi.S3LocationProperty.Version`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        version: number | cdk.Token;
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

/**
 * Properties for defining a `AWS::Serverless::Application`
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
 */
export interface CfnApplicationProps {
    /**
     * `AWS::Serverless::Application.Location`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    location: CfnApplication.ApplicationLocationProperty | string | cdk.Token;
    /**
     * `AWS::Serverless::Application.NotificationArns`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    notificationArns?: string[];
    /**
     * `AWS::Serverless::Application.Parameters`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    parameters?: { [key: string]: (string) } | cdk.Token;
    /**
     * `AWS::Serverless::Application.Tags`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    tags?: { [key: string]: (string) };
    /**
     * `AWS::Serverless::Application.TimeoutInMinutes`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    timeoutInMinutes?: number | cdk.Token;
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

/**
 * A CloudFormation `AWS::Serverless::Application`
 *
 * @cloudformationResource AWS::Serverless::Application
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
 */
export class CfnApplication extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly resourceTypeName = "AWS::Serverless::Application";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly requiredTransform = "AWS::Serverless-2016-10-31";
    public readonly applicationName: string;

    /**
     * The `TagManager` handles setting, removing and formatting tags
     *
     * Tags should be managed either passing them as properties during
     * initiation or by calling methods on this object. If both techniques are
     * used only the tags from the TagManager will be used. `Tag` (aspect)
     * will use the manager.
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Serverless::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props: CfnApplicationProps) {
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

    public get propertyOverrides(): CfnApplicationProps {
        return this.untypedPropertyOverrides;
    }
    protected renderProperties(properties: any): { [key: string]: any }  {
        return cfnApplicationPropsToCloudFormation(this.node.resolve(properties));
    }
}

export namespace CfnApplication {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    export interface ApplicationLocationProperty {
        /**
         * `CfnApplication.ApplicationLocationProperty.ApplicationId`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
         */
        applicationId: string;
        /**
         * `CfnApplication.ApplicationLocationProperty.SemanticVersion`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
         */
        semanticVersion: string;
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

/**
 * Properties for defining a `AWS::Serverless::Function`
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
 */
export interface CfnFunctionProps {
    /**
     * `AWS::Serverless::Function.CodeUri`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    codeUri: CfnFunction.S3LocationProperty | string | cdk.Token;
    /**
     * `AWS::Serverless::Function.Handler`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    handler: string;
    /**
     * `AWS::Serverless::Function.Runtime`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    runtime: string;
    /**
     * `AWS::Serverless::Function.AutoPublishAlias`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    autoPublishAlias?: string;
    /**
     * `AWS::Serverless::Function.DeadLetterQueue`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    deadLetterQueue?: CfnFunction.DeadLetterQueueProperty | cdk.Token;
    /**
     * `AWS::Serverless::Function.DeploymentPreference`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
     */
    deploymentPreference?: CfnFunction.DeploymentPreferenceProperty | cdk.Token;
    /**
     * `AWS::Serverless::Function.Description`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    description?: string;
    /**
     * `AWS::Serverless::Function.Environment`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    environment?: CfnFunction.FunctionEnvironmentProperty | cdk.Token;
    /**
     * `AWS::Serverless::Function.Events`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    events?: { [key: string]: (CfnFunction.EventSourceProperty | cdk.Token) } | cdk.Token;
    /**
     * `AWS::Serverless::Function.FunctionName`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    functionName?: string;
    /**
     * `AWS::Serverless::Function.KmsKeyArn`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    kmsKeyArn?: string;
    /**
     * `AWS::Serverless::Function.Layers`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    layers?: string[];
    /**
     * `AWS::Serverless::Function.MemorySize`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    memorySize?: number | cdk.Token;
    /**
     * `AWS::Serverless::Function.Policies`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    policies?: Array<CfnFunction.IAMPolicyDocumentProperty | string | cdk.Token> | CfnFunction.IAMPolicyDocumentProperty | string | cdk.Token;
    /**
     * `AWS::Serverless::Function.ReservedConcurrentExecutions`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    reservedConcurrentExecutions?: number | cdk.Token;
    /**
     * `AWS::Serverless::Function.Role`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    role?: string;
    /**
     * `AWS::Serverless::Function.Tags`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    tags?: { [key: string]: (string) };
    /**
     * `AWS::Serverless::Function.Timeout`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    timeout?: number | cdk.Token;
    /**
     * `AWS::Serverless::Function.Tracing`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    tracing?: string;
    /**
     * `AWS::Serverless::Function.VpcConfig`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    vpcConfig?: CfnFunction.VpcConfigProperty | cdk.Token;
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
function cfnFunctionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
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
export class CfnFunction extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly resourceTypeName = "AWS::Serverless::Function";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly requiredTransform = "AWS::Serverless-2016-10-31";
    public readonly functionName: string;

    /**
     * The `TagManager` handles setting, removing and formatting tags
     *
     * Tags should be managed either passing them as properties during
     * initiation or by calling methods on this object. If both techniques are
     * used only the tags from the TagManager will be used. `Tag` (aspect)
     * will use the manager.
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Serverless::Function`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props: CfnFunctionProps) {
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

    public get propertyOverrides(): CfnFunctionProps {
        return this.untypedPropertyOverrides;
    }
    protected renderProperties(properties: any): { [key: string]: any }  {
        return cfnFunctionPropsToCloudFormation(this.node.resolve(properties));
    }
}

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill
     */
    export interface AlexaSkillEventProperty {
        /**
         * `CfnFunction.AlexaSkillEventProperty.Variables`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill
         */
        variables?: { [key: string]: (string) } | cdk.Token;
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

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
     */
    export interface ApiEventProperty {
        /**
         * `CfnFunction.ApiEventProperty.Method`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        method: string;
        /**
         * `CfnFunction.ApiEventProperty.Path`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        path: string;
        /**
         * `CfnFunction.ApiEventProperty.RestApiId`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        restApiId?: string;
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
function cfnFunctionApiEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_ApiEventPropertyValidator(properties).assertSuccess();
    return {
      Method: cdk.stringToCloudFormation(properties.method),
      Path: cdk.stringToCloudFormation(properties.path),
      RestApiId: cdk.stringToCloudFormation(properties.restApiId),
    };
}

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
     */
    export interface CloudWatchEventEventProperty {
        /**
         * `CfnFunction.CloudWatchEventEventProperty.Input`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
         */
        input?: string;
        /**
         * `CfnFunction.CloudWatchEventEventProperty.InputPath`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
         */
        inputPath?: string;
        /**
         * `CfnFunction.CloudWatchEventEventProperty.Pattern`
         * @see http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEventsandEventPatterns.html
         */
        pattern: object | cdk.Token;
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

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deadletterqueue-object
     */
    export interface DeadLetterQueueProperty {
        /**
         * `CfnFunction.DeadLetterQueueProperty.TargetArn`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        targetArn: string;
        /**
         * `CfnFunction.DeadLetterQueueProperty.Type`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        type: string;
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

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/docs/safe_lambda_deployments.rst
     */
    export interface DeploymentPreferenceProperty {
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Enabled`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        enabled: boolean | cdk.Token;
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Type`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        type: string;
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Alarms`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        alarms?: string[];
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Hooks`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        hooks?: string[];
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
function cfnFunctionDeploymentPreferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_DeploymentPreferencePropertyValidator(properties).assertSuccess();
    return {
      Enabled: cdk.booleanToCloudFormation(properties.enabled),
      Type: cdk.stringToCloudFormation(properties.type),
      Alarms: cdk.listMapper(cdk.stringToCloudFormation)(properties.alarms),
      Hooks: cdk.listMapper(cdk.stringToCloudFormation)(properties.hooks),
    };
}

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
     */
    export interface DynamoDBEventProperty {
        /**
         * `CfnFunction.DynamoDBEventProperty.BatchSize`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        batchSize: number | cdk.Token;
        /**
         * `CfnFunction.DynamoDBEventProperty.StartingPosition`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        startingPosition: string;
        /**
         * `CfnFunction.DynamoDBEventProperty.Stream`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        stream: string;
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
function cfnFunctionDynamoDBEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_DynamoDBEventPropertyValidator(properties).assertSuccess();
    return {
      BatchSize: cdk.numberToCloudFormation(properties.batchSize),
      StartingPosition: cdk.stringToCloudFormation(properties.startingPosition),
      Stream: cdk.stringToCloudFormation(properties.stream),
    };
}

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object
     */
    export interface EventSourceProperty {
        /**
         * `CfnFunction.EventSourceProperty.Properties`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-types
         */
        properties: CfnFunction.S3EventProperty | CfnFunction.SNSEventProperty | CfnFunction.SQSEventProperty | CfnFunction.KinesisEventProperty | CfnFunction.DynamoDBEventProperty | CfnFunction.ApiEventProperty | CfnFunction.ScheduleEventProperty | CfnFunction.CloudWatchEventEventProperty | CfnFunction.IoTRuleEventProperty | CfnFunction.AlexaSkillEventProperty | cdk.Token;
        /**
         * `CfnFunction.EventSourceProperty.Type`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object
         */
        type: string;
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
function cfnFunctionEventSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_EventSourcePropertyValidator(properties).assertSuccess();
    return {
      Properties: cdk.unionMapper([CfnFunction_S3EventPropertyValidator, CfnFunction_SNSEventPropertyValidator, CfnFunction_SQSEventPropertyValidator, CfnFunction_KinesisEventPropertyValidator, CfnFunction_DynamoDBEventPropertyValidator, CfnFunction_ApiEventPropertyValidator, CfnFunction_ScheduleEventPropertyValidator, CfnFunction_CloudWatchEventEventPropertyValidator, CfnFunction_IoTRuleEventPropertyValidator, CfnFunction_AlexaSkillEventPropertyValidator], [cfnFunctionS3EventPropertyToCloudFormation, cfnFunctionSNSEventPropertyToCloudFormation, cfnFunctionSQSEventPropertyToCloudFormation, cfnFunctionKinesisEventPropertyToCloudFormation, cfnFunctionDynamoDBEventPropertyToCloudFormation, cfnFunctionApiEventPropertyToCloudFormation, cfnFunctionScheduleEventPropertyToCloudFormation, cfnFunctionCloudWatchEventEventPropertyToCloudFormation, cfnFunctionIoTRuleEventPropertyToCloudFormation, cfnFunctionAlexaSkillEventPropertyToCloudFormation])(properties.properties),
      Type: cdk.stringToCloudFormation(properties.type),
    };
}

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#environment-object
     */
    export interface FunctionEnvironmentProperty {
        /**
         * `CfnFunction.FunctionEnvironmentProperty.Variables`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#environment-object
         */
        variables: { [key: string]: (string) } | cdk.Token;
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

export namespace CfnFunction {
    /**
     * @see http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
     */
    export interface IAMPolicyDocumentProperty {
        /**
         * `CfnFunction.IAMPolicyDocumentProperty.Statement`
         * @see http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
         */
        statement: object | cdk.Token;
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
function cfnFunctionIAMPolicyDocumentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_IAMPolicyDocumentPropertyValidator(properties).assertSuccess();
    return {
      Statement: cdk.objectToCloudFormation(properties.statement),
    };
}

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule
     */
    export interface IoTRuleEventProperty {
        /**
         * `CfnFunction.IoTRuleEventProperty.AwsIotSqlVersion`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule
         */
        awsIotSqlVersion?: string;
        /**
         * `CfnFunction.IoTRuleEventProperty.Sql`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule
         */
        sql: string;
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

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
     */
    export interface KinesisEventProperty {
        /**
         * `CfnFunction.KinesisEventProperty.BatchSize`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        batchSize?: number | cdk.Token;
        /**
         * `CfnFunction.KinesisEventProperty.StartingPosition`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        startingPosition: string;
        /**
         * `CfnFunction.KinesisEventProperty.Stream`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        stream: string;
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
function cfnFunctionKinesisEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_KinesisEventPropertyValidator(properties).assertSuccess();
    return {
      BatchSize: cdk.numberToCloudFormation(properties.batchSize),
      StartingPosition: cdk.stringToCloudFormation(properties.startingPosition),
      Stream: cdk.stringToCloudFormation(properties.stream),
    };
}

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
     */
    export interface S3EventProperty {
        /**
         * `CfnFunction.S3EventProperty.Bucket`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
         */
        bucket: string;
        /**
         * `CfnFunction.S3EventProperty.Events`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
         */
        events: string[] | string | cdk.Token;
        /**
         * `CfnFunction.S3EventProperty.Filter`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
         */
        filter?: CfnFunction.S3NotificationFilterProperty | cdk.Token;
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

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    export interface S3LocationProperty {
        /**
         * `CfnFunction.S3LocationProperty.Bucket`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        bucket: string;
        /**
         * `CfnFunction.S3LocationProperty.Key`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        key: string;
        /**
         * `CfnFunction.S3LocationProperty.Version`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        version?: number | cdk.Token;
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

export namespace CfnFunction {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
     */
    export interface S3NotificationFilterProperty {
        /**
         * `CfnFunction.S3NotificationFilterProperty.S3Key`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
         */
        s3Key: string;
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
function cfnFunctionS3NotificationFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_S3NotificationFilterPropertyValidator(properties).assertSuccess();
    return {
      S3Key: cdk.stringToCloudFormation(properties.s3Key),
    };
}

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns
     */
    export interface SNSEventProperty {
        /**
         * `CfnFunction.SNSEventProperty.Topic`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns
         */
        topic: string;
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

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
     */
    export interface SQSEventProperty {
        /**
         * `CfnFunction.SQSEventProperty.BatchSize`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
         */
        batchSize?: number | cdk.Token;
        /**
         * `CfnFunction.SQSEventProperty.Queue`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
         */
        queue: string;
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
function cfnFunctionSQSEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_SQSEventPropertyValidator(properties).assertSuccess();
    return {
      BatchSize: cdk.numberToCloudFormation(properties.batchSize),
      Queue: cdk.stringToCloudFormation(properties.queue),
    };
}

export namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
     */
    export interface ScheduleEventProperty {
        /**
         * `CfnFunction.ScheduleEventProperty.Input`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        input?: string;
        /**
         * `CfnFunction.ScheduleEventProperty.Schedule`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        schedule: string;
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
function cfnFunctionScheduleEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFunction_ScheduleEventPropertyValidator(properties).assertSuccess();
    return {
      Input: cdk.stringToCloudFormation(properties.input),
      Schedule: cdk.stringToCloudFormation(properties.schedule),
    };
}

export namespace CfnFunction {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
     */
    export interface VpcConfigProperty {
        /**
         * `CfnFunction.VpcConfigProperty.SecurityGroupIds`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
         */
        securityGroupIds: string[];
        /**
         * `CfnFunction.VpcConfigProperty.SubnetIds`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
         */
        subnetIds: string[];
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

/**
 * Properties for defining a `AWS::Serverless::LayerVersion`
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
 */
export interface CfnLayerVersionProps {
    /**
     * `AWS::Serverless::LayerVersion.CompatibleRuntimes`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    compatibleRuntimes?: string[];
    /**
     * `AWS::Serverless::LayerVersion.ContentUri`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    contentUri?: string;
    /**
     * `AWS::Serverless::LayerVersion.Description`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    description?: string;
    /**
     * `AWS::Serverless::LayerVersion.LayerName`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    layerName?: string;
    /**
     * `AWS::Serverless::LayerVersion.LicenseInfo`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    licenseInfo?: string;
    /**
     * `AWS::Serverless::LayerVersion.RetentionPolicy`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    retentionPolicy?: string;
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
function cfnLayerVersionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
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
export class CfnLayerVersion extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly resourceTypeName = "AWS::Serverless::LayerVersion";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly requiredTransform = "AWS::Serverless-2016-10-31";
    public readonly layerVersionArn: string;

    /**
     * Create a new `AWS::Serverless::LayerVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props?: CfnLayerVersionProps) {
        super(scope, id, { type: CfnLayerVersion.resourceTypeName, properties: props });
        // If a different transform than the required one is in use, this resource cannot be used
        if (this.node.stack.templateOptions.transform && this.node.stack.templateOptions.transform !== CfnLayerVersion.requiredTransform) {
            throw new Error(`The ${JSON.stringify(CfnLayerVersion.requiredTransform)} transform is required when using CfnLayerVersion, but the ${JSON.stringify(this.node.stack.templateOptions.transform)} is used.`);
        }
        // Automatically configure the required transform
        this.node.stack.templateOptions.transform = CfnLayerVersion.requiredTransform;
        this.layerVersionArn = this.ref.toString();
    }

    public get propertyOverrides(): CfnLayerVersionProps {
        return this.untypedPropertyOverrides;
    }
    protected renderProperties(properties: any): { [key: string]: any }  {
        return cfnLayerVersionPropsToCloudFormation(this.node.resolve(properties));
    }
}

/**
 * Properties for defining a `AWS::Serverless::SimpleTable`
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
 */
export interface CfnSimpleTableProps {
    /**
     * `AWS::Serverless::SimpleTable.PrimaryKey`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
     */
    primaryKey?: CfnSimpleTable.PrimaryKeyProperty | cdk.Token;
    /**
     * `AWS::Serverless::SimpleTable.ProvisionedThroughput`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
     */
    provisionedThroughput?: CfnSimpleTable.ProvisionedThroughputProperty | cdk.Token;
    /**
     * `AWS::Serverless::SimpleTable.SSESpecification`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    sseSpecification?: CfnSimpleTable.SSESpecificationProperty | cdk.Token;
    /**
     * `AWS::Serverless::SimpleTable.TableName`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    tableName?: string;
    /**
     * `AWS::Serverless::SimpleTable.Tags`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    tags?: { [key: string]: (string) };
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

/**
 * A CloudFormation `AWS::Serverless::SimpleTable`
 *
 * @cloudformationResource AWS::Serverless::SimpleTable
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
 */
export class CfnSimpleTable extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly resourceTypeName = "AWS::Serverless::SimpleTable";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    public static readonly requiredTransform = "AWS::Serverless-2016-10-31";
    public readonly simpleTableName: string;

    /**
     * The `TagManager` handles setting, removing and formatting tags
     *
     * Tags should be managed either passing them as properties during
     * initiation or by calling methods on this object. If both techniques are
     * used only the tags from the TagManager will be used. `Tag` (aspect)
     * will use the manager.
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Serverless::SimpleTable`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props?: CfnSimpleTableProps) {
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

    public get propertyOverrides(): CfnSimpleTableProps {
        return this.untypedPropertyOverrides;
    }
    protected renderProperties(properties: any): { [key: string]: any }  {
        return cfnSimpleTablePropsToCloudFormation(this.node.resolve(properties));
    }
}

export namespace CfnSimpleTable {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
     */
    export interface PrimaryKeyProperty {
        /**
         * `CfnSimpleTable.PrimaryKeyProperty.Name`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
         */
        name?: string;
        /**
         * `CfnSimpleTable.PrimaryKeyProperty.Type`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
         */
        type: string;
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

export namespace CfnSimpleTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
     */
    export interface ProvisionedThroughputProperty {
        /**
         * `CfnSimpleTable.ProvisionedThroughputProperty.ReadCapacityUnits`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
         */
        readCapacityUnits?: number | cdk.Token;
        /**
         * `CfnSimpleTable.ProvisionedThroughputProperty.WriteCapacityUnits`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
         */
        writeCapacityUnits: number | cdk.Token;
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

export namespace CfnSimpleTable {
    /**
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
     */
    export interface SSESpecificationProperty {
        /**
         * `CfnSimpleTable.SSESpecificationProperty.SSEEnabled`
         * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
         */
        sseEnabled?: boolean | cdk.Token;
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
