// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:11.292Z","fingerprint":"h6IB456w5vtgfK1BSjUcVF1yumXJoEF7gGWCNYTgea8="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnExperimentTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html
 */
export interface CfnExperimentTemplateProps {

    /**
     * A description for the experiment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-description
     */
    readonly description: string;

    /**
     * The Amazon Resource Name (ARN) of an IAM role that grants the AWS FIS service permission to perform service actions on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-rolearn
     */
    readonly roleArn: string;

    /**
     * The stop conditions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-stopconditions
     */
    readonly stopConditions: Array<CfnExperimentTemplate.ExperimentTemplateStopConditionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The tags to apply to the experiment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-tags
     */
    readonly tags: { [key: string]: (string) };

    /**
     * The targets for the experiment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-targets
     */
    readonly targets: { [key: string]: (CfnExperimentTemplate.ExperimentTemplateTargetProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The actions for the experiment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-actions
     */
    readonly actions?: { [key: string]: (CfnExperimentTemplate.ExperimentTemplateActionProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The configuration for experiment logging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-logconfiguration
     */
    readonly logConfiguration?: CfnExperimentTemplate.ExperimentTemplateLogConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnExperimentTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnExperimentTemplateProps`
 *
 * @returns the result of the validation.
 */
function CfnExperimentTemplatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.hashValidator(CfnExperimentTemplate_ExperimentTemplateActionPropertyValidator))(properties.actions));
    errors.collect(cdk.propertyValidator('description', cdk.requiredValidator)(properties.description));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('logConfiguration', CfnExperimentTemplate_ExperimentTemplateLogConfigurationPropertyValidator)(properties.logConfiguration));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('stopConditions', cdk.requiredValidator)(properties.stopConditions));
    errors.collect(cdk.propertyValidator('stopConditions', cdk.listValidator(CfnExperimentTemplate_ExperimentTemplateStopConditionPropertyValidator))(properties.stopConditions));
    errors.collect(cdk.propertyValidator('tags', cdk.requiredValidator)(properties.tags));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('targets', cdk.requiredValidator)(properties.targets));
    errors.collect(cdk.propertyValidator('targets', cdk.hashValidator(CfnExperimentTemplate_ExperimentTemplateTargetPropertyValidator))(properties.targets));
    return errors.wrap('supplied properties not correct for "CfnExperimentTemplateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate` resource
 *
 * @param properties - the TypeScript properties of a `CfnExperimentTemplateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate` resource.
 */
// @ts-ignore TS6133
function cfnExperimentTemplatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnExperimentTemplatePropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        StopConditions: cdk.listMapper(cfnExperimentTemplateExperimentTemplateStopConditionPropertyToCloudFormation)(properties.stopConditions),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
        Targets: cdk.hashMapper(cfnExperimentTemplateExperimentTemplateTargetPropertyToCloudFormation)(properties.targets),
        Actions: cdk.hashMapper(cfnExperimentTemplateExperimentTemplateActionPropertyToCloudFormation)(properties.actions),
        LogConfiguration: cfnExperimentTemplateExperimentTemplateLogConfigurationPropertyToCloudFormation(properties.logConfiguration),
    };
}

// @ts-ignore TS6133
function CfnExperimentTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplateProps>();
    ret.addPropertyResult('description', 'Description', cfn_parse.FromCloudFormation.getString(properties.Description));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('stopConditions', 'StopConditions', cfn_parse.FromCloudFormation.getArray(CfnExperimentTemplateExperimentTemplateStopConditionPropertyFromCloudFormation)(properties.StopConditions));
    ret.addPropertyResult('tags', 'Tags', cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) as any);
    ret.addPropertyResult('targets', 'Targets', cfn_parse.FromCloudFormation.getMap(CfnExperimentTemplateExperimentTemplateTargetPropertyFromCloudFormation)(properties.Targets));
    ret.addPropertyResult('actions', 'Actions', properties.Actions != null ? cfn_parse.FromCloudFormation.getMap(CfnExperimentTemplateExperimentTemplateActionPropertyFromCloudFormation)(properties.Actions) : undefined);
    ret.addPropertyResult('logConfiguration', 'LogConfiguration', properties.LogConfiguration != null ? CfnExperimentTemplateExperimentTemplateLogConfigurationPropertyFromCloudFormation(properties.LogConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FIS::ExperimentTemplate`
 *
 * Specifies an experiment template.
 *
 * An experiment template includes the following components:
 *
 * - *Targets* : A target can be a specific resource in your AWS environment, or one or more resources that match criteria that you specify, for example, resources that have specific tags.
 * - *Actions* : The actions to carry out on the target. You can specify multiple actions, the duration of each action, and when to start each action during an experiment.
 * - *Stop conditions* : If a stop condition is triggered while an experiment is running, the experiment is automatically stopped. You can define a stop condition as a CloudWatch alarm.
 *
 * For more information, see [Experiment templates](https://docs.aws.amazon.com/fis/latest/userguide/experiment-templates.html) in the *AWS Fault Injection Simulator User Guide* .
 *
 * @cloudformationResource AWS::FIS::ExperimentTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html
 */
export class CfnExperimentTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FIS::ExperimentTemplate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnExperimentTemplate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnExperimentTemplatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnExperimentTemplate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the experiment template.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * A description for the experiment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-description
     */
    public description: string;

    /**
     * The Amazon Resource Name (ARN) of an IAM role that grants the AWS FIS service permission to perform service actions on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-rolearn
     */
    public roleArn: string;

    /**
     * The stop conditions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-stopconditions
     */
    public stopConditions: Array<CfnExperimentTemplate.ExperimentTemplateStopConditionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The tags to apply to the experiment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The targets for the experiment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-targets
     */
    public targets: { [key: string]: (CfnExperimentTemplate.ExperimentTemplateTargetProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The actions for the experiment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-actions
     */
    public actions: { [key: string]: (CfnExperimentTemplate.ExperimentTemplateActionProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * The configuration for experiment logging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-logconfiguration
     */
    public logConfiguration: CfnExperimentTemplate.ExperimentTemplateLogConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::FIS::ExperimentTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnExperimentTemplateProps) {
        super(scope, id, { type: CfnExperimentTemplate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'description', this);
        cdk.requireProperty(props, 'roleArn', this);
        cdk.requireProperty(props, 'stopConditions', this);
        cdk.requireProperty(props, 'tags', this);
        cdk.requireProperty(props, 'targets', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.description = props.description;
        this.roleArn = props.roleArn;
        this.stopConditions = props.stopConditions;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::FIS::ExperimentTemplate", props.tags, { tagPropertyName: 'tags' });
        this.targets = props.targets;
        this.actions = props.actions;
        this.logConfiguration = props.logConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnExperimentTemplate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            roleArn: this.roleArn,
            stopConditions: this.stopConditions,
            tags: this.tags.renderTags(),
            targets: this.targets,
            actions: this.actions,
            logConfiguration: this.logConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnExperimentTemplatePropsToCloudFormation(props);
    }
}

export namespace CfnExperimentTemplate {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-cloudwatchlogsconfiguration.html
     */
    export interface CloudWatchLogsConfigurationProperty {
        /**
         * `CfnExperimentTemplate.CloudWatchLogsConfigurationProperty.LogGroupArn`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-cloudwatchlogsconfiguration.html#cfn-fis-experimenttemplate-cloudwatchlogsconfiguration-loggrouparn
         */
        readonly logGroupArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnExperimentTemplate_CloudWatchLogsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroupArn', cdk.requiredValidator)(properties.logGroupArn));
    errors.collect(cdk.propertyValidator('logGroupArn', cdk.validateString)(properties.logGroupArn));
    return errors.wrap('supplied properties not correct for "CloudWatchLogsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.CloudWatchLogsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.CloudWatchLogsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnExperimentTemplateCloudWatchLogsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnExperimentTemplate_CloudWatchLogsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        LogGroupArn: cdk.stringToCloudFormation(properties.logGroupArn),
    };
}

// @ts-ignore TS6133
function CfnExperimentTemplateCloudWatchLogsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.CloudWatchLogsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.CloudWatchLogsConfigurationProperty>();
    ret.addPropertyResult('logGroupArn', 'LogGroupArn', cfn_parse.FromCloudFormation.getString(properties.LogGroupArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnExperimentTemplate {
    /**
     * Specifies an action for an experiment template.
     *
     * For more information, see [Actions](https://docs.aws.amazon.com/fis/latest/userguide/actions.html) in the *AWS Fault Injection Simulator User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html
     */
    export interface ExperimentTemplateActionProperty {
        /**
         * The ID of the action. The format of the action ID is: aws: *service-name* : *action-type* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-actionid
         */
        readonly actionId: string;
        /**
         * A description for the action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-description
         */
        readonly description?: string;
        /**
         * The parameters for the action, if applicable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-parameters
         */
        readonly parameters?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The name of the action that must be completed before the current action starts. Omit this parameter to run the action at the start of the experiment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-startafter
         */
        readonly startAfter?: string[];
        /**
         * The targets for the action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-targets
         */
        readonly targets?: { [key: string]: (string) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ExperimentTemplateActionProperty`
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnExperimentTemplate_ExperimentTemplateActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionId', cdk.requiredValidator)(properties.actionId));
    errors.collect(cdk.propertyValidator('actionId', cdk.validateString)(properties.actionId));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('parameters', cdk.hashValidator(cdk.validateString))(properties.parameters));
    errors.collect(cdk.propertyValidator('startAfter', cdk.listValidator(cdk.validateString))(properties.startAfter));
    errors.collect(cdk.propertyValidator('targets', cdk.hashValidator(cdk.validateString))(properties.targets));
    return errors.wrap('supplied properties not correct for "ExperimentTemplateActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.ExperimentTemplateAction` resource
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.ExperimentTemplateAction` resource.
 */
// @ts-ignore TS6133
function cfnExperimentTemplateExperimentTemplateActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnExperimentTemplate_ExperimentTemplateActionPropertyValidator(properties).assertSuccess();
    return {
        ActionId: cdk.stringToCloudFormation(properties.actionId),
        Description: cdk.stringToCloudFormation(properties.description),
        Parameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
        StartAfter: cdk.listMapper(cdk.stringToCloudFormation)(properties.startAfter),
        Targets: cdk.hashMapper(cdk.stringToCloudFormation)(properties.targets),
    };
}

// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.ExperimentTemplateActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.ExperimentTemplateActionProperty>();
    ret.addPropertyResult('actionId', 'ActionId', cfn_parse.FromCloudFormation.getString(properties.ActionId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined);
    ret.addPropertyResult('startAfter', 'StartAfter', properties.StartAfter != null ? cfn_parse.FromCloudFormation.getStringArray(properties.StartAfter) : undefined);
    ret.addPropertyResult('targets', 'Targets', properties.Targets != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Targets) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnExperimentTemplate {
    /**
     * Specifies the configuration for experiment logging.
     *
     * For more information, see [Experiment logging](https://docs.aws.amazon.com/fis/latest/userguide/monitoring-logging.html) in the *AWS Fault Injection Simulator User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html
     */
    export interface ExperimentTemplateLogConfigurationProperty {
        /**
         * The configuration for experiment logging to Amazon CloudWatch Logs. The supported field is `LogGroupArn` . For example:
         *
         * `{"LogGroupArn": "aws:arn:logs: *region_name* : *account_id* :log-group: *log_group_name* "}`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html#cfn-fis-experimenttemplate-experimenttemplatelogconfiguration-cloudwatchlogsconfiguration
         */
        readonly cloudWatchLogsConfiguration?: any | cdk.IResolvable;
        /**
         * The schema version. The supported value is 1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html#cfn-fis-experimenttemplate-experimenttemplatelogconfiguration-logschemaversion
         */
        readonly logSchemaVersion: number;
        /**
         * The configuration for experiment logging to Amazon S3. The following fields are supported:
         *
         * - `bucketName` - The name of the destination bucket.
         * - `prefix` - An optional bucket prefix.
         *
         * For example:
         *
         * `{"BucketName": " *my-s3-bucket* ", "Prefix": " *log-folder* "}`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html#cfn-fis-experimenttemplate-experimenttemplatelogconfiguration-s3configuration
         */
        readonly s3Configuration?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ExperimentTemplateLogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateLogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnExperimentTemplate_ExperimentTemplateLogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchLogsConfiguration', cdk.validateObject)(properties.cloudWatchLogsConfiguration));
    errors.collect(cdk.propertyValidator('logSchemaVersion', cdk.requiredValidator)(properties.logSchemaVersion));
    errors.collect(cdk.propertyValidator('logSchemaVersion', cdk.validateNumber)(properties.logSchemaVersion));
    errors.collect(cdk.propertyValidator('s3Configuration', cdk.validateObject)(properties.s3Configuration));
    return errors.wrap('supplied properties not correct for "ExperimentTemplateLogConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.ExperimentTemplateLogConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateLogConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.ExperimentTemplateLogConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnExperimentTemplateExperimentTemplateLogConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnExperimentTemplate_ExperimentTemplateLogConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchLogsConfiguration: cdk.objectToCloudFormation(properties.cloudWatchLogsConfiguration),
        LogSchemaVersion: cdk.numberToCloudFormation(properties.logSchemaVersion),
        S3Configuration: cdk.objectToCloudFormation(properties.s3Configuration),
    };
}

// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.ExperimentTemplateLogConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.ExperimentTemplateLogConfigurationProperty>();
    ret.addPropertyResult('cloudWatchLogsConfiguration', 'CloudWatchLogsConfiguration', properties.CloudWatchLogsConfiguration != null ? cfn_parse.FromCloudFormation.getAny(properties.CloudWatchLogsConfiguration) : undefined);
    ret.addPropertyResult('logSchemaVersion', 'LogSchemaVersion', cfn_parse.FromCloudFormation.getNumber(properties.LogSchemaVersion));
    ret.addPropertyResult('s3Configuration', 'S3Configuration', properties.S3Configuration != null ? cfn_parse.FromCloudFormation.getAny(properties.S3Configuration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnExperimentTemplate {
    /**
     * Specifies a stop condition for an experiment template.
     *
     * For more information, see [Stop conditions](https://docs.aws.amazon.com/fis/latest/userguide/stop-conditions.html) in the *AWS Fault Injection Simulator User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatestopcondition.html
     */
    export interface ExperimentTemplateStopConditionProperty {
        /**
         * The source for the stop condition. Specify `aws:cloudwatch:alarm` if the stop condition is defined by a CloudWatch alarm. Specify `none` if there is no stop condition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatestopcondition.html#cfn-fis-experimenttemplate-experimenttemplatestopcondition-source
         */
        readonly source: string;
        /**
         * The Amazon Resource Name (ARN) of the CloudWatch alarm. This is required if the source is a CloudWatch alarm.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatestopcondition.html#cfn-fis-experimenttemplate-experimenttemplatestopcondition-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ExperimentTemplateStopConditionProperty`
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateStopConditionProperty`
 *
 * @returns the result of the validation.
 */
function CfnExperimentTemplate_ExperimentTemplateStopConditionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('source', cdk.requiredValidator)(properties.source));
    errors.collect(cdk.propertyValidator('source', cdk.validateString)(properties.source));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ExperimentTemplateStopConditionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.ExperimentTemplateStopCondition` resource
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateStopConditionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.ExperimentTemplateStopCondition` resource.
 */
// @ts-ignore TS6133
function cfnExperimentTemplateExperimentTemplateStopConditionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnExperimentTemplate_ExperimentTemplateStopConditionPropertyValidator(properties).assertSuccess();
    return {
        Source: cdk.stringToCloudFormation(properties.source),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateStopConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.ExperimentTemplateStopConditionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.ExperimentTemplateStopConditionProperty>();
    ret.addPropertyResult('source', 'Source', cfn_parse.FromCloudFormation.getString(properties.Source));
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnExperimentTemplate {
    /**
     * Specifies a target for an experiment. You must specify at least one Amazon Resource Name (ARN) or at least one resource tag. You cannot specify both ARNs and tags.
     *
     * For more information, see [Targets](https://docs.aws.amazon.com/fis/latest/userguide/targets.html) in the *AWS Fault Injection Simulator User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html
     */
    export interface ExperimentTemplateTargetProperty {
        /**
         * The filters to apply to identify target resources using specific attributes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-filters
         */
        readonly filters?: Array<CfnExperimentTemplate.ExperimentTemplateTargetFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters for the resource type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-parameters
         */
        readonly parameters?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The Amazon Resource Names (ARNs) of the resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-resourcearns
         */
        readonly resourceArns?: string[];
        /**
         * The tags for the target resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-resourcetags
         */
        readonly resourceTags?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The resource type. The resource type must be supported for the specified action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-resourcetype
         */
        readonly resourceType: string;
        /**
         * Scopes the identified resources to a specific count of the resources at random, or a percentage of the resources. All identified resources are included in the target.
         *
         * - ALL - Run the action on all identified targets. This is the default.
         * - COUNT(n) - Run the action on the specified number of targets, chosen from the identified targets at random. For example, COUNT(1) selects one of the targets.
         * - PERCENT(n) - Run the action on the specified percentage of targets, chosen from the identified targets at random. For example, PERCENT(25) selects 25% of the targets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-selectionmode
         */
        readonly selectionMode: string;
    }
}

/**
 * Determine whether the given properties match those of a `ExperimentTemplateTargetProperty`
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateTargetProperty`
 *
 * @returns the result of the validation.
 */
function CfnExperimentTemplate_ExperimentTemplateTargetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filters', cdk.listValidator(CfnExperimentTemplate_ExperimentTemplateTargetFilterPropertyValidator))(properties.filters));
    errors.collect(cdk.propertyValidator('parameters', cdk.hashValidator(cdk.validateString))(properties.parameters));
    errors.collect(cdk.propertyValidator('resourceArns', cdk.listValidator(cdk.validateString))(properties.resourceArns));
    errors.collect(cdk.propertyValidator('resourceTags', cdk.hashValidator(cdk.validateString))(properties.resourceTags));
    errors.collect(cdk.propertyValidator('resourceType', cdk.requiredValidator)(properties.resourceType));
    errors.collect(cdk.propertyValidator('resourceType', cdk.validateString)(properties.resourceType));
    errors.collect(cdk.propertyValidator('selectionMode', cdk.requiredValidator)(properties.selectionMode));
    errors.collect(cdk.propertyValidator('selectionMode', cdk.validateString)(properties.selectionMode));
    return errors.wrap('supplied properties not correct for "ExperimentTemplateTargetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.ExperimentTemplateTarget` resource
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateTargetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.ExperimentTemplateTarget` resource.
 */
// @ts-ignore TS6133
function cfnExperimentTemplateExperimentTemplateTargetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnExperimentTemplate_ExperimentTemplateTargetPropertyValidator(properties).assertSuccess();
    return {
        Filters: cdk.listMapper(cfnExperimentTemplateExperimentTemplateTargetFilterPropertyToCloudFormation)(properties.filters),
        Parameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
        ResourceArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceArns),
        ResourceTags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.resourceTags),
        ResourceType: cdk.stringToCloudFormation(properties.resourceType),
        SelectionMode: cdk.stringToCloudFormation(properties.selectionMode),
    };
}

// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.ExperimentTemplateTargetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.ExperimentTemplateTargetProperty>();
    ret.addPropertyResult('filters', 'Filters', properties.Filters != null ? cfn_parse.FromCloudFormation.getArray(CfnExperimentTemplateExperimentTemplateTargetFilterPropertyFromCloudFormation)(properties.Filters) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined);
    ret.addPropertyResult('resourceArns', 'ResourceArns', properties.ResourceArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ResourceArns) : undefined);
    ret.addPropertyResult('resourceTags', 'ResourceTags', properties.ResourceTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ResourceTags) : undefined);
    ret.addPropertyResult('resourceType', 'ResourceType', cfn_parse.FromCloudFormation.getString(properties.ResourceType));
    ret.addPropertyResult('selectionMode', 'SelectionMode', cfn_parse.FromCloudFormation.getString(properties.SelectionMode));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnExperimentTemplate {
    /**
     * Specifies a filter used for the target resource input in an experiment template.
     *
     * For more information, see [Resource filters](https://docs.aws.amazon.com/fis/latest/userguide/targets.html#target-filters) in the *AWS Fault Injection Simulator User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetargetfilter.html
     */
    export interface ExperimentTemplateTargetFilterProperty {
        /**
         * The attribute path for the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetargetfilter.html#cfn-fis-experimenttemplate-experimenttemplatetargetfilter-path
         */
        readonly path: string;
        /**
         * The attribute values for the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetargetfilter.html#cfn-fis-experimenttemplate-experimenttemplatetargetfilter-values
         */
        readonly values: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ExperimentTemplateTargetFilterProperty`
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateTargetFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnExperimentTemplate_ExperimentTemplateTargetFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('path', cdk.requiredValidator)(properties.path));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "ExperimentTemplateTargetFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.ExperimentTemplateTargetFilter` resource
 *
 * @param properties - the TypeScript properties of a `ExperimentTemplateTargetFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.ExperimentTemplateTargetFilter` resource.
 */
// @ts-ignore TS6133
function cfnExperimentTemplateExperimentTemplateTargetFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnExperimentTemplate_ExperimentTemplateTargetFilterPropertyValidator(properties).assertSuccess();
    return {
        Path: cdk.stringToCloudFormation(properties.path),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnExperimentTemplateExperimentTemplateTargetFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.ExperimentTemplateTargetFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.ExperimentTemplateTargetFilterProperty>();
    ret.addPropertyResult('path', 'Path', cfn_parse.FromCloudFormation.getString(properties.Path));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getStringArray(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnExperimentTemplate {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-s3configuration.html
     */
    export interface S3ConfigurationProperty {
        /**
         * `CfnExperimentTemplate.S3ConfigurationProperty.BucketName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-s3configuration.html#cfn-fis-experimenttemplate-s3configuration-bucketname
         */
        readonly bucketName: string;
        /**
         * `CfnExperimentTemplate.S3ConfigurationProperty.Prefix`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-s3configuration.html#cfn-fis-experimenttemplate-s3configuration-prefix
         */
        readonly prefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnExperimentTemplate_S3ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketName', cdk.requiredValidator)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    return errors.wrap('supplied properties not correct for "S3ConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.S3Configuration` resource
 *
 * @param properties - the TypeScript properties of a `S3ConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FIS::ExperimentTemplate.S3Configuration` resource.
 */
// @ts-ignore TS6133
function cfnExperimentTemplateS3ConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnExperimentTemplate_S3ConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
    };
}

// @ts-ignore TS6133
function CfnExperimentTemplateS3ConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExperimentTemplate.S3ConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExperimentTemplate.S3ConfigurationProperty>();
    ret.addPropertyResult('bucketName', 'BucketName', cfn_parse.FromCloudFormation.getString(properties.BucketName));
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
