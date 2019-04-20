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
    variables?: {
        [key: string]: (string);
    } | cdk.Token;
}
/**
 * A CloudFormation `AWS::Serverless::Api`
 *
 * @cloudformationResource AWS::Serverless::Api
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
 */
export declare class CfnApi extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly resourceTypeName = "AWS::Serverless::Api";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly requiredTransform = "AWS::Serverless-2016-10-31";
    readonly apiName: string;
    /**
     * Create a new `AWS::Serverless::Api`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props: CfnApiProps);
    readonly propertyOverrides: CfnApiProps;
    protected renderProperties(properties: any): {
        [key: string]: any;
    };
}
export declare namespace CfnApi {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
     */
    interface AuthProperty {
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
export declare namespace CfnApi {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    interface S3LocationProperty {
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
    parameters?: {
        [key: string]: (string);
    } | cdk.Token;
    /**
     * `AWS::Serverless::Application.Tags`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    tags?: {
        [key: string]: (string);
    };
    /**
     * `AWS::Serverless::Application.TimeoutInMinutes`
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    timeoutInMinutes?: number | cdk.Token;
}
/**
 * A CloudFormation `AWS::Serverless::Application`
 *
 * @cloudformationResource AWS::Serverless::Application
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
 */
export declare class CfnApplication extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly resourceTypeName = "AWS::Serverless::Application";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly requiredTransform = "AWS::Serverless-2016-10-31";
    readonly applicationName: string;
    /**
     * The `TagManager` handles setting, removing and formatting tags
     *
     * Tags should be managed either passing them as properties during
     * initiation or by calling methods on this object. If both techniques are
     * used only the tags from the TagManager will be used. `Tag` (aspect)
     * will use the manager.
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Serverless::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props: CfnApplicationProps);
    readonly propertyOverrides: CfnApplicationProps;
    protected renderProperties(properties: any): {
        [key: string]: any;
    };
}
export declare namespace CfnApplication {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    interface ApplicationLocationProperty {
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
    events?: {
        [key: string]: (CfnFunction.EventSourceProperty | cdk.Token);
    } | cdk.Token;
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
    tags?: {
        [key: string]: (string);
    };
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
 * A CloudFormation `AWS::Serverless::Function`
 *
 * @cloudformationResource AWS::Serverless::Function
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
 */
export declare class CfnFunction extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly resourceTypeName = "AWS::Serverless::Function";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly requiredTransform = "AWS::Serverless-2016-10-31";
    readonly functionName: string;
    /**
     * The `TagManager` handles setting, removing and formatting tags
     *
     * Tags should be managed either passing them as properties during
     * initiation or by calling methods on this object. If both techniques are
     * used only the tags from the TagManager will be used. `Tag` (aspect)
     * will use the manager.
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Serverless::Function`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props: CfnFunctionProps);
    readonly propertyOverrides: CfnFunctionProps;
    protected renderProperties(properties: any): {
        [key: string]: any;
    };
}
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill
     */
    interface AlexaSkillEventProperty {
        /**
         * `CfnFunction.AlexaSkillEventProperty.Variables`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill
         */
        variables?: {
            [key: string]: (string);
        } | cdk.Token;
    }
}
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
     */
    interface ApiEventProperty {
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
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
     */
    interface CloudWatchEventEventProperty {
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
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deadletterqueue-object
     */
    interface DeadLetterQueueProperty {
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
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/docs/safe_lambda_deployments.rst
     */
    interface DeploymentPreferenceProperty {
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
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
     */
    interface DynamoDBEventProperty {
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
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object
     */
    interface EventSourceProperty {
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
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#environment-object
     */
    interface FunctionEnvironmentProperty {
        /**
         * `CfnFunction.FunctionEnvironmentProperty.Variables`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#environment-object
         */
        variables: {
            [key: string]: (string);
        } | cdk.Token;
    }
}
export declare namespace CfnFunction {
    /**
     * @see http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
     */
    interface IAMPolicyDocumentProperty {
        /**
         * `CfnFunction.IAMPolicyDocumentProperty.Statement`
         * @see http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
         */
        statement: object | cdk.Token;
    }
}
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule
     */
    interface IoTRuleEventProperty {
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
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
     */
    interface KinesisEventProperty {
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
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
     */
    interface S3EventProperty {
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
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    interface S3LocationProperty {
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
export declare namespace CfnFunction {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
     */
    interface S3NotificationFilterProperty {
        /**
         * `CfnFunction.S3NotificationFilterProperty.S3Key`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
         */
        s3Key: string;
    }
}
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns
     */
    interface SNSEventProperty {
        /**
         * `CfnFunction.SNSEventProperty.Topic`
         * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns
         */
        topic: string;
    }
}
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
     */
    interface SQSEventProperty {
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
export declare namespace CfnFunction {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
     */
    interface ScheduleEventProperty {
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
export declare namespace CfnFunction {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
     */
    interface VpcConfigProperty {
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
 * A CloudFormation `AWS::Serverless::LayerVersion`
 *
 * @cloudformationResource AWS::Serverless::LayerVersion
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
 */
export declare class CfnLayerVersion extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly resourceTypeName = "AWS::Serverless::LayerVersion";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly requiredTransform = "AWS::Serverless-2016-10-31";
    readonly layerVersionArn: string;
    /**
     * Create a new `AWS::Serverless::LayerVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props?: CfnLayerVersionProps);
    readonly propertyOverrides: CfnLayerVersionProps;
    protected renderProperties(properties: any): {
        [key: string]: any;
    };
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
    tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::Serverless::SimpleTable`
 *
 * @cloudformationResource AWS::Serverless::SimpleTable
 * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
 */
export declare class CfnSimpleTable extends cdk.CfnResource {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly resourceTypeName = "AWS::Serverless::SimpleTable";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly requiredTransform = "AWS::Serverless-2016-10-31";
    readonly simpleTableName: string;
    /**
     * The `TagManager` handles setting, removing and formatting tags
     *
     * Tags should be managed either passing them as properties during
     * initiation or by calling methods on this object. If both techniques are
     * used only the tags from the TagManager will be used. `Tag` (aspect)
     * will use the manager.
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Serverless::SimpleTable`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: cdk.Construct, id: string, props?: CfnSimpleTableProps);
    readonly propertyOverrides: CfnSimpleTableProps;
    protected renderProperties(properties: any): {
        [key: string]: any;
    };
}
export declare namespace CfnSimpleTable {
    /**
     * @see https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
     */
    interface PrimaryKeyProperty {
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
export declare namespace CfnSimpleTable {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
     */
    interface ProvisionedThroughputProperty {
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
export declare namespace CfnSimpleTable {
    /**
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
     */
    interface SSESpecificationProperty {
        /**
         * `CfnSimpleTable.SSESpecificationProperty.SSEEnabled`
         * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
         */
        sseEnabled?: boolean | cdk.Token;
    }
}
