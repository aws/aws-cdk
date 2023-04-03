// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-09T03:53:32.569Z","fingerprint":"Si6ywdFl0jE7HV8USp9zWBeW4+2UqvnTYhJobkl68Q4="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

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
 * Determine whether the given properties match those of a `CfnActivityProps`
 *
 * @param properties - the TypeScript properties of a `CfnActivityProps`
 *
 * @returns the result of the validation.
 */
function CfnActivityPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnActivity_TagsEntryPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnActivityProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::StepFunctions::Activity` resource
 *
 * @param properties - the TypeScript properties of a `CfnActivityProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::StepFunctions::Activity` resource.
 */
// @ts-ignore TS6133
function cfnActivityPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnActivityPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cfnActivityTagsEntryPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnActivityPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnActivityProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnActivityProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnActivityTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnActivity extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::StepFunctions::Activity";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnActivity {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnActivityPropsFromCloudFormation(resourceProperties);
        const ret = new CfnActivity(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

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
    public readonly attrName: string;

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
    public name: string;

    /**
     * The list of tags to add to a resource.
     *
     * Tags may only contain Unicode letters, digits, white space, or these symbols: `_ . : / = + - @` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html#cfn-stepfunctions-activity-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::StepFunctions::Activity`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnActivityProps) {
        super(scope, id, { type: CfnActivity.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::StepFunctions::Activity", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnActivity.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnActivityPropsToCloudFormation(props);
    }
}

export namespace CfnActivity {
    /**
     * The `TagsEntry` property specifies *tags* to identify an activity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-activity-tagsentry.html
     */
    export interface TagsEntryProperty {
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
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
function CfnActivity_TagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsEntryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::StepFunctions::Activity.TagsEntry` resource
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::StepFunctions::Activity.TagsEntry` resource.
 */
// @ts-ignore TS6133
function cfnActivityTagsEntryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnActivity_TagsEntryPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnActivityTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnActivity.TagsEntryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnActivity.TagsEntryProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
    readonly definitionSubstitutions?: { [key: string]: (string) } | cdk.IResolvable;

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
    errors.collect(cdk.propertyValidator('definitionS3Location', CfnStateMachine_S3LocationPropertyValidator)(properties.definitionS3Location));
    errors.collect(cdk.propertyValidator('definitionString', cdk.validateString)(properties.definitionString));
    errors.collect(cdk.propertyValidator('definitionSubstitutions', cdk.hashValidator(cdk.validateString))(properties.definitionSubstitutions));
    errors.collect(cdk.propertyValidator('loggingConfiguration', CfnStateMachine_LoggingConfigurationPropertyValidator)(properties.loggingConfiguration));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('stateMachineName', cdk.validateString)(properties.stateMachineName));
    errors.collect(cdk.propertyValidator('stateMachineType', cdk.validateString)(properties.stateMachineType));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnStateMachine_TagsEntryPropertyValidator))(properties.tags));
    errors.collect(cdk.propertyValidator('tracingConfiguration', CfnStateMachine_TracingConfigurationPropertyValidator)(properties.tracingConfiguration));
    return errors.wrap('supplied properties not correct for "CfnStateMachineProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine` resource
 *
 * @param properties - the TypeScript properties of a `CfnStateMachineProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine` resource.
 */
// @ts-ignore TS6133
function cfnStateMachinePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachinePropsValidator(properties).assertSuccess();
    return {
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        Definition: cdk.objectToCloudFormation(properties.definition),
        DefinitionS3Location: cfnStateMachineS3LocationPropertyToCloudFormation(properties.definitionS3Location),
        DefinitionString: cdk.stringToCloudFormation(properties.definitionString),
        DefinitionSubstitutions: cdk.hashMapper(cdk.stringToCloudFormation)(properties.definitionSubstitutions),
        LoggingConfiguration: cfnStateMachineLoggingConfigurationPropertyToCloudFormation(properties.loggingConfiguration),
        StateMachineName: cdk.stringToCloudFormation(properties.stateMachineName),
        StateMachineType: cdk.stringToCloudFormation(properties.stateMachineType),
        Tags: cdk.listMapper(cfnStateMachineTagsEntryPropertyToCloudFormation)(properties.tags),
        TracingConfiguration: cfnStateMachineTracingConfigurationPropertyToCloudFormation(properties.tracingConfiguration),
    };
}

// @ts-ignore TS6133
function CfnStateMachinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachineProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachineProps>();
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('definition', 'Definition', properties.Definition != null ? cfn_parse.FromCloudFormation.getAny(properties.Definition) : undefined);
    ret.addPropertyResult('definitionS3Location', 'DefinitionS3Location', properties.DefinitionS3Location != null ? CfnStateMachineS3LocationPropertyFromCloudFormation(properties.DefinitionS3Location) : undefined);
    ret.addPropertyResult('definitionString', 'DefinitionString', properties.DefinitionString != null ? cfn_parse.FromCloudFormation.getString(properties.DefinitionString) : undefined);
    ret.addPropertyResult('definitionSubstitutions', 'DefinitionSubstitutions', properties.DefinitionSubstitutions != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.DefinitionSubstitutions) : undefined);
    ret.addPropertyResult('loggingConfiguration', 'LoggingConfiguration', properties.LoggingConfiguration != null ? CfnStateMachineLoggingConfigurationPropertyFromCloudFormation(properties.LoggingConfiguration) : undefined);
    ret.addPropertyResult('stateMachineName', 'StateMachineName', properties.StateMachineName != null ? cfn_parse.FromCloudFormation.getString(properties.StateMachineName) : undefined);
    ret.addPropertyResult('stateMachineType', 'StateMachineType', properties.StateMachineType != null ? cfn_parse.FromCloudFormation.getString(properties.StateMachineType) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnStateMachineTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addPropertyResult('tracingConfiguration', 'TracingConfiguration', properties.TracingConfiguration != null ? CfnStateMachineTracingConfigurationPropertyFromCloudFormation(properties.TracingConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnStateMachine extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::StepFunctions::StateMachine";

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
     *
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

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
    public readonly attrName: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role to use for this state machine.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-rolearn
     */
    public roleArn: string;

    /**
     * The Amazon States Language definition of the state machine. The state machine definition must be in JSON or YAML, and the format of the object must match the format of your AWS Step Functions template file. See [Amazon States Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definition
     */
    public definition: any | cdk.IResolvable | undefined;

    /**
     * The name of the S3 bucket where the state machine definition is stored. The state machine definition must be a JSON or YAML file.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitions3location
     */
    public definitionS3Location: CfnStateMachine.S3LocationProperty | cdk.IResolvable | undefined;

    /**
     * The Amazon States Language definition of the state machine. The state machine definition must be in JSON. See [Amazon States Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitionstring
     */
    public definitionString: string | undefined;

    /**
     * A map (string to string) that specifies the mappings for placeholder variables in the state machine definition. This enables the customer to inject values obtained at runtime, for example from intrinsic functions, in the state machine definition. Variables can be template parameter names, resource logical IDs, resource attributes, or a variable in a key-value map.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitionsubstitutions
     */
    public definitionSubstitutions: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * Defines what execution history events are logged and where they are logged.
     *
     * > By default, the `level` is set to `OFF` . For more information see [Log Levels](https://docs.aws.amazon.com/step-functions/latest/dg/cloudwatch-log-level.html) in the AWS Step Functions User Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-loggingconfiguration
     */
    public loggingConfiguration: CfnStateMachine.LoggingConfigurationProperty | cdk.IResolvable | undefined;

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
    public stateMachineName: string | undefined;

    /**
     * Determines whether a `STANDARD` or `EXPRESS` state machine is created. The default is `STANDARD` . You cannot update the `type` of a state machine once it has been created. For more information on `STANDARD` and `EXPRESS` workflows, see [Standard Versus Express Workflows](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html) in the AWS Step Functions Developer Guide.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-statemachinetype
     */
    public stateMachineType: string | undefined;

    /**
     * The list of tags to add to a resource.
     *
     * Tags may only contain Unicode letters, digits, white space, or these symbols: `_ . : / = + - @` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Selects whether or not the state machine's AWS X-Ray tracing is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-tracingconfiguration
     */
    public tracingConfiguration: CfnStateMachine.TracingConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::StepFunctions::StateMachine`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStateMachineProps) {
        super(scope, id, { type: CfnStateMachine.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'roleArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrName = cdk.Token.asString(this.getAtt('Name', cdk.ResolutionTypeHint.STRING));

        this.roleArn = props.roleArn;
        this.definition = props.definition;
        this.definitionS3Location = props.definitionS3Location;
        this.definitionString = props.definitionString;
        this.definitionSubstitutions = props.definitionSubstitutions;
        this.loggingConfiguration = props.loggingConfiguration;
        this.stateMachineName = props.stateMachineName;
        this.stateMachineType = props.stateMachineType;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::StepFunctions::StateMachine", props.tags, { tagPropertyName: 'tags' });
        this.tracingConfiguration = props.tracingConfiguration;
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
            roleArn: this.roleArn,
            definition: this.definition,
            definitionS3Location: this.definitionS3Location,
            definitionString: this.definitionString,
            definitionSubstitutions: this.definitionSubstitutions,
            loggingConfiguration: this.loggingConfiguration,
            stateMachineName: this.stateMachineName,
            stateMachineType: this.stateMachineType,
            tags: this.tags.renderTags(),
            tracingConfiguration: this.tracingConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStateMachinePropsToCloudFormation(props);
    }
}

export namespace CfnStateMachine {
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
    export interface CloudWatchLogsLogGroupProperty {
        /**
         * The ARN of the the CloudWatch log group to which you want your logs emitted to. The ARN must end with `:*`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-cloudwatchlogsloggroup.html#cfn-stepfunctions-statemachine-cloudwatchlogsloggroup-loggrouparn
         */
        readonly logGroupArn?: string;
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
    errors.collect(cdk.propertyValidator('logGroupArn', cdk.validateString)(properties.logGroupArn));
    return errors.wrap('supplied properties not correct for "CloudWatchLogsLogGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.CloudWatchLogsLogGroup` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsLogGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.CloudWatchLogsLogGroup` resource.
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
    ret.addPropertyResult('logGroupArn', 'LogGroupArn', properties.LogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
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
    export interface LogDestinationProperty {
        /**
         * An object describing a CloudWatch log group. For more information, see [AWS::Logs::LogGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html) in the AWS CloudFormation User Guide.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination.html#cfn-stepfunctions-statemachine-logdestination-cloudwatchlogsloggroup
         */
        readonly cloudWatchLogsLogGroup?: CfnStateMachine.CloudWatchLogsLogGroupProperty | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('cloudWatchLogsLogGroup', CfnStateMachine_CloudWatchLogsLogGroupPropertyValidator)(properties.cloudWatchLogsLogGroup));
    return errors.wrap('supplied properties not correct for "LogDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.LogDestination` resource
 *
 * @param properties - the TypeScript properties of a `LogDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.LogDestination` resource.
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
    ret.addPropertyResult('cloudWatchLogsLogGroup', 'CloudWatchLogsLogGroup', properties.CloudWatchLogsLogGroup != null ? CfnStateMachineCloudWatchLogsLogGroupPropertyFromCloudFormation(properties.CloudWatchLogsLogGroup) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
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
    export interface LoggingConfigurationProperty {
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
    errors.collect(cdk.propertyValidator('destinations', cdk.listValidator(CfnStateMachine_LogDestinationPropertyValidator))(properties.destinations));
    errors.collect(cdk.propertyValidator('includeExecutionData', cdk.validateBoolean)(properties.includeExecutionData));
    errors.collect(cdk.propertyValidator('level', cdk.validateString)(properties.level));
    return errors.wrap('supplied properties not correct for "LoggingConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.LoggingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.LoggingConfiguration` resource.
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
    ret.addPropertyResult('destinations', 'Destinations', properties.Destinations != null ? cfn_parse.FromCloudFormation.getArray(CfnStateMachineLogDestinationPropertyFromCloudFormation)(properties.Destinations) : undefined);
    ret.addPropertyResult('includeExecutionData', 'IncludeExecutionData', properties.IncludeExecutionData != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeExecutionData) : undefined);
    ret.addPropertyResult('level', 'Level', properties.Level != null ? cfn_parse.FromCloudFormation.getString(properties.Level) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     * Defines the S3 bucket location where a state machine definition is stored. The state machine definition must be a JSON or YAML file.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-s3location.html
     */
    export interface S3LocationProperty {
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
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "S3LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.S3Location` resource
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.S3Location` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineS3LocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_S3LocationPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        Key: cdk.stringToCloudFormation(properties.key),
        Version: cdk.stringToCloudFormation(properties.version),
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
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     * The `TagsEntry` property specifies *tags* to identify a state machine.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tagsentry.html
     */
    export interface TagsEntryProperty {
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

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
function CfnStateMachine_TagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsEntryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.TagsEntry` resource
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.TagsEntry` resource.
 */
// @ts-ignore TS6133
function cfnStateMachineTagsEntryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStateMachine_TagsEntryPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnStateMachineTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.TagsEntryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.TagsEntryProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStateMachine {
    /**
     * Selects whether or not the state machine's AWS X-Ray tracing is enabled. To configure your state machine to send trace data to X-Ray, set `Enabled` to `true` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tracingconfiguration.html
     */
    export interface TracingConfigurationProperty {
        /**
         * When set to `true` , X-Ray tracing is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tracingconfiguration.html#cfn-stepfunctions-statemachine-tracingconfiguration-enabled
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
 * Renders the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.TracingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `TracingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::StepFunctions::StateMachine.TracingConfiguration` resource.
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
