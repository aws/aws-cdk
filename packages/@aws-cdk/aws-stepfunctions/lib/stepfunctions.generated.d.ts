import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnActivity`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html
 */
export interface CfnActivityProps {
    /**
     * The name of the activity.
     *
     * A name must *not* contain:
     *
     * - white space
     * - brackets `< > { } [ ]`
     * - wildcard characters `? *`
     * - special characters `" # % \ ^ | ~ ` $ & , ; : /`
     * - control characters ( `U+0000-001F` , `U+007F-009F` )
     *
     * To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html#cfn-stepfunctions-activity-name
     */
    readonly name: string;
    /**
     * The list of tags to add to a resource.
     *
     * Tags may only contain Unicode letters, digits, white space, or these symbols: `_ . : / = + - @` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html#cfn-stepfunctions-activity-tags
     */
    readonly tags?: CfnActivity.TagsEntryProperty[];
}
/**
 * A CloudFormation `AWS::StepFunctions::Activity`
 *
 * An activity is a task that you write in any programming language and host on any machine that has access to AWS Step Functions . Activities must poll Step Functions using the `GetActivityTask` API action and respond using `SendTask*` API actions. This function lets Step Functions know the existence of your activity and returns an identifier for use in a state machine and when polling from the activity.
 *
 * For information about creating an activity, see [Creating an Activity State Machine](https://docs.aws.amazon.com/step-functions/latest/dg/tutorial-creating-activity-state-machine.html) in the *AWS Step Functions Developer Guide* and [CreateActivity](https://docs.aws.amazon.com/step-functions/latest/apireference/API_CreateActivity.html) in the *AWS Step Functions API Reference* .
 *
 * @cloudformationResource AWS::StepFunctions::Activity
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html
 */
export declare class CfnActivity extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::StepFunctions::Activity";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnActivity;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Returns the name of the activity. For example:
     *
     * `{ "Fn::GetAtt": ["MyActivity", "Name"] }`
     *
     * Returns a value similar to the following:
     *
     * `myActivity`
     *
     * For more information about using `Fn::GetAtt` , see [Fn::GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html) .
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * The name of the activity.
     *
     * A name must *not* contain:
     *
     * - white space
     * - brackets `< > { } [ ]`
     * - wildcard characters `? *`
     * - special characters `" # % \ ^ | ~ ` $ & , ; : /`
     * - control characters ( `U+0000-001F` , `U+007F-009F` )
     *
     * To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html#cfn-stepfunctions-activity-name
     */
    name: string;
    /**
     * The list of tags to add to a resource.
     *
     * Tags may only contain Unicode letters, digits, white space, or these symbols: `_ . : / = + - @` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html#cfn-stepfunctions-activity-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::StepFunctions::Activity`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnActivityProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnActivity {
    /**
     * The `TagsEntry` property specifies *tags* to identify an activity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-activity-tagsentry.html
     */
    interface TagsEntryProperty {
        /**
         * The `key` for a key-value pair in a tag entry.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-activity-tagsentry.html#cfn-stepfunctions-activity-tagsentry-key
         */
        readonly key: string;
        /**
         * The `value` for a key-value pair in a tag entry.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-activity-tagsentry.html#cfn-stepfunctions-activity-tagsentry-value
         */
        readonly value: string;
    }
}
/**
 * Properties for defining a `CfnStateMachine`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html
 */
export interface CfnStateMachineProps {
    /**
     * The Amazon Resource Name (ARN) of the IAM role to use for this state machine.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-rolearn
     */
    readonly roleArn: string;
    /**
     * The Amazon States Language definition of the state machine. The state machine definition must be in JSON or YAML, and the format of the object must match the format of your AWS Step Functions template file. See [Amazon States Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definition
     */
    readonly definition?: any | cdk.IResolvable;
    /**
     * The name of the S3 bucket where the state machine definition is stored. The state machine definition must be a JSON or YAML file.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitions3location
     */
    readonly definitionS3Location?: CfnStateMachine.S3LocationProperty | cdk.IResolvable;
    /**
     * The Amazon States Language definition of the state machine. The state machine definition must be in JSON. See [Amazon States Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitionstring
     */
    readonly definitionString?: string;
    /**
     * A map (string to string) that specifies the mappings for placeholder variables in the state machine definition. This enables the customer to inject values obtained at runtime, for example from intrinsic functions, in the state machine definition. Variables can be template parameter names, resource logical IDs, resource attributes, or a variable in a key-value map.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitionsubstitutions
     */
    readonly definitionSubstitutions?: {
        [key: string]: (string);
    } | cdk.IResolvable;
    /**
     * Defines what execution history events are logged and where they are logged.
     *
     * > By default, the `level` is set to `OFF` . For more information see [Log Levels](https://docs.aws.amazon.com/step-functions/latest/dg/cloudwatch-log-level.html) in the AWS Step Functions User Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-loggingconfiguration
     */
    readonly loggingConfiguration?: CfnStateMachine.LoggingConfigurationProperty | cdk.IResolvable;
    /**
     * The name of the state machine.
     *
     * A name must *not* contain:
     *
     * - white space
     * - brackets `< > { } [ ]`
     * - wildcard characters `? *`
     * - special characters `" # % \ ^ | ~ ` $ & , ; : /`
     * - control characters ( `U+0000-001F` , `U+007F-009F` )
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-statemachinename
     */
    readonly stateMachineName?: string;
    /**
     * Determines whether a `STANDARD` or `EXPRESS` state machine is created. The default is `STANDARD` . You cannot update the `type` of a state machine once it has been created. For more information on `STANDARD` and `EXPRESS` workflows, see [Standard Versus Express Workflows](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html) in the AWS Step Functions Developer Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-statemachinetype
     */
    readonly stateMachineType?: string;
    /**
     * The list of tags to add to a resource.
     *
     * Tags may only contain Unicode letters, digits, white space, or these symbols: `_ . : / = + - @` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-tags
     */
    readonly tags?: CfnStateMachine.TagsEntryProperty[];
    /**
     * Selects whether or not the state machine's AWS X-Ray tracing is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-tracingconfiguration
     */
    readonly tracingConfiguration?: CfnStateMachine.TracingConfigurationProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::StepFunctions::StateMachine`
 *
 * Provisions a state machine. A state machine consists of a collection of states that can do work ( `Task` states), determine to which states to transition next ( `Choice` states), stop an execution with an error ( `Fail` states), and so on. State machines are specified using a JSON-based, structured language.
 *
 * @cloudformationResource AWS::StepFunctions::StateMachine
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html
 */
export declare class CfnStateMachine extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::StepFunctions::StateMachine";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStateMachine;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Returns the name of the state machine. For example:
     *
     * `{ "Fn::GetAtt": ["MyStateMachine", "Name"] }`
     *
     * Returns the name of your state machine:
     *
     * `HelloWorld-StateMachine`
     *
     * If you did not specify the name it will be similar to the following:
     *
     * `MyStateMachine-1234abcdefgh`
     *
     * For more information about using `Fn::GetAtt` , see [Fn::GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html) .
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to use for this state machine.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-rolearn
     */
    roleArn: string;
    /**
     * The Amazon States Language definition of the state machine. The state machine definition must be in JSON or YAML, and the format of the object must match the format of your AWS Step Functions template file. See [Amazon States Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definition
     */
    definition: any | cdk.IResolvable | undefined;
    /**
     * The name of the S3 bucket where the state machine definition is stored. The state machine definition must be a JSON or YAML file.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitions3location
     */
    definitionS3Location: CfnStateMachine.S3LocationProperty | cdk.IResolvable | undefined;
    /**
     * The Amazon States Language definition of the state machine. The state machine definition must be in JSON. See [Amazon States Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitionstring
     */
    definitionString: string | undefined;
    /**
     * A map (string to string) that specifies the mappings for placeholder variables in the state machine definition. This enables the customer to inject values obtained at runtime, for example from intrinsic functions, in the state machine definition. Variables can be template parameter names, resource logical IDs, resource attributes, or a variable in a key-value map.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitionsubstitutions
     */
    definitionSubstitutions: {
        [key: string]: (string);
    } | cdk.IResolvable | undefined;
    /**
     * Defines what execution history events are logged and where they are logged.
     *
     * > By default, the `level` is set to `OFF` . For more information see [Log Levels](https://docs.aws.amazon.com/step-functions/latest/dg/cloudwatch-log-level.html) in the AWS Step Functions User Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-loggingconfiguration
     */
    loggingConfiguration: CfnStateMachine.LoggingConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The name of the state machine.
     *
     * A name must *not* contain:
     *
     * - white space
     * - brackets `< > { } [ ]`
     * - wildcard characters `? *`
     * - special characters `" # % \ ^ | ~ ` $ & , ; : /`
     * - control characters ( `U+0000-001F` , `U+007F-009F` )
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-statemachinename
     */
    stateMachineName: string | undefined;
    /**
     * Determines whether a `STANDARD` or `EXPRESS` state machine is created. The default is `STANDARD` . You cannot update the `type` of a state machine once it has been created. For more information on `STANDARD` and `EXPRESS` workflows, see [Standard Versus Express Workflows](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html) in the AWS Step Functions Developer Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-statemachinetype
     */
    stateMachineType: string | undefined;
    /**
     * The list of tags to add to a resource.
     *
     * Tags may only contain Unicode letters, digits, white space, or these symbols: `_ . : / = + - @` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Selects whether or not the state machine's AWS X-Ray tracing is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-tracingconfiguration
     */
    tracingConfiguration: CfnStateMachine.TracingConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::StepFunctions::StateMachine`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStateMachineProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnStateMachine {
    /**
     * Defines a CloudWatch log group.
     *
     * > For more information see [Standard Versus Express Workflows](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html) in the AWS Step Functions Developer Guide.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-cloudwatchlogsloggroup.html
     */
    interface CloudWatchLogsLogGroupProperty {
        /**
         * The ARN of the the CloudWatch log group to which you want your logs emitted to. The ARN must end with `:*`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-cloudwatchlogsloggroup.html#cfn-stepfunctions-statemachine-cloudwatchlogsloggroup-loggrouparn
         */
        readonly logGroupArn?: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     * Defines a destination for `LoggingConfiguration` .
     *
     * > For more information on logging with `EXPRESS` workflows, see [Logging Express Workflows Using CloudWatch Logs](https://docs.aws.amazon.com/step-functions/latest/dg/cw-logs.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination.html
     */
    interface LogDestinationProperty {
        /**
         * An object describing a CloudWatch log group. For more information, see [AWS::Logs::LogGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html) in the AWS CloudFormation User Guide.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination.html#cfn-stepfunctions-statemachine-logdestination-cloudwatchlogsloggroup
         */
        readonly cloudWatchLogsLogGroup?: CfnStateMachine.CloudWatchLogsLogGroupProperty | cdk.IResolvable;
    }
}
export declare namespace CfnStateMachine {
    /**
     * Defines what execution history events are logged and where they are logged.
     *
     * > By default, the `level` is set to `OFF` . For more information see [Log Levels](https://docs.aws.amazon.com/step-functions/latest/dg/cloudwatch-log-level.html) in the AWS Step Functions User Guide.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html
     */
    interface LoggingConfigurationProperty {
        /**
         * An array of objects that describes where your execution history events will be logged. Limited to size 1. Required, if your log level is not set to `OFF` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html#cfn-stepfunctions-statemachine-loggingconfiguration-destinations
         */
        readonly destinations?: Array<CfnStateMachine.LogDestinationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Determines whether execution data is included in your log. When set to `false` , data is excluded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html#cfn-stepfunctions-statemachine-loggingconfiguration-includeexecutiondata
         */
        readonly includeExecutionData?: boolean | cdk.IResolvable;
        /**
         * Defines which category of execution history events are logged.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html#cfn-stepfunctions-statemachine-loggingconfiguration-level
         */
        readonly level?: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     * Defines the S3 bucket location where a state machine definition is stored. The state machine definition must be a JSON or YAML file.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-s3location.html
     */
    interface S3LocationProperty {
        /**
         * The name of the S3 bucket where the state machine definition JSON or YAML file is stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-s3location.html#cfn-stepfunctions-statemachine-s3location-bucket
         */
        readonly bucket: string;
        /**
         * The name of the state machine definition file (Amazon S3 object name).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-s3location.html#cfn-stepfunctions-statemachine-s3location-key
         */
        readonly key: string;
        /**
         * For versioning-enabled buckets, a specific version of the state machine definition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-s3location.html#cfn-stepfunctions-statemachine-s3location-version
         */
        readonly version?: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     * The `TagsEntry` property specifies *tags* to identify a state machine.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tagsentry.html
     */
    interface TagsEntryProperty {
        /**
         * The `key` for a key-value pair in a tag entry.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tagsentry.html#cfn-stepfunctions-statemachine-tagsentry-key
         */
        readonly key: string;
        /**
         * The `value` for a key-value pair in a tag entry.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tagsentry.html#cfn-stepfunctions-statemachine-tagsentry-value
         */
        readonly value: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     * Selects whether or not the state machine's AWS X-Ray tracing is enabled. To configure your state machine to send trace data to X-Ray, set `Enabled` to `true` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tracingconfiguration.html
     */
    interface TracingConfigurationProperty {
        /**
         * When set to `true` , X-Ray tracing is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tracingconfiguration.html#cfn-stepfunctions-statemachine-tracingconfiguration-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}
