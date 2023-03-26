// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:10.789Z","fingerprint":"YWNbwGRI1hxRdiq+ayEDZi8JVdizXR39Ix7BXgazG7Q="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnSchedule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html
 */
export interface CfnScheduleProps {

    /**
     * Allows you to configure a time window during which EventBridge Scheduler invokes the schedule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-flexibletimewindow
     */
    readonly flexibleTimeWindow: CfnSchedule.FlexibleTimeWindowProperty | cdk.IResolvable;

    /**
     * The expression that defines when the schedule runs. The following formats are supported.
     *
     * - `at` expression - `at(yyyy-mm-ddThh:mm:ss)`
     * - `rate` expression - `rate(unit value)`
     * - `cron` expression - `cron(fields)`
     *
     * You can use `at` expressions to create one-time schedules that invoke a target once, at the time and in the time zone, that you specify. You can use `rate` and `cron` expressions to create recurring schedules. Rate-based schedules are useful when you want to invoke a target at regular intervals, such as every 15 minutes or every five days. Cron-based schedules are useful when you want to invoke a target periodically at a specific time, such as at 8:00 am (UTC+0) every 1st day of the month.
     *
     * A `cron` expression consists of six fields separated by white spaces: `(minutes hours day_of_month month day_of_week year)` .
     *
     * A `rate` expression consists of a *value* as a positive integer, and a *unit* with the following options: `minute` | `minutes` | `hour` | `hours` | `day` | `days`
     *
     * For more information and examples, see [Schedule types on EventBridge Scheduler](https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html) in the *EventBridge Scheduler User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-scheduleexpression
     */
    readonly scheduleExpression: string;

    /**
     * The schedule's target details.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-target
     */
    readonly target: CfnSchedule.TargetProperty | cdk.IResolvable;

    /**
     * The description you specify for the schedule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-description
     */
    readonly description?: string;

    /**
     * The date, in UTC, before which the schedule can invoke its target. Depending on the schedule's recurrence expression, invocations might stop on, or before, the `EndDate` you specify.
     * EventBridge Scheduler ignores `EndDate` for one-time schedules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-enddate
     */
    readonly endDate?: string;

    /**
     * The name of the schedule group associated with this schedule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-groupname
     */
    readonly groupName?: string;

    /**
     * The Amazon Resource Name (ARN) for the customer managed KMS key that EventBridge Scheduler will use to encrypt and decrypt your data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-kmskeyarn
     */
    readonly kmsKeyArn?: string;

    /**
     * The name of the schedule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-name
     */
    readonly name?: string;

    /**
     * The timezone in which the scheduling expression is evaluated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-scheduleexpressiontimezone
     */
    readonly scheduleExpressionTimezone?: string;

    /**
     * The date, in UTC, after which the schedule can begin invoking its target. Depending on the schedule's recurrence expression, invocations might occur on, or after, the `StartDate` you specify.
     * EventBridge Scheduler ignores `StartDate` for one-time schedules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-startdate
     */
    readonly startDate?: string;

    /**
     * Specifies whether the schedule is enabled or disabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-state
     */
    readonly state?: string;
}

/**
 * Determine whether the given properties match those of a `CfnScheduleProps`
 *
 * @param properties - the TypeScript properties of a `CfnScheduleProps`
 *
 * @returns the result of the validation.
 */
function CfnSchedulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('endDate', cdk.validateString)(properties.endDate));
    errors.collect(cdk.propertyValidator('flexibleTimeWindow', cdk.requiredValidator)(properties.flexibleTimeWindow));
    errors.collect(cdk.propertyValidator('flexibleTimeWindow', CfnSchedule_FlexibleTimeWindowPropertyValidator)(properties.flexibleTimeWindow));
    errors.collect(cdk.propertyValidator('groupName', cdk.validateString)(properties.groupName));
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.requiredValidator)(properties.scheduleExpression));
    errors.collect(cdk.propertyValidator('scheduleExpression', cdk.validateString)(properties.scheduleExpression));
    errors.collect(cdk.propertyValidator('scheduleExpressionTimezone', cdk.validateString)(properties.scheduleExpressionTimezone));
    errors.collect(cdk.propertyValidator('startDate', cdk.validateString)(properties.startDate));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    errors.collect(cdk.propertyValidator('target', cdk.requiredValidator)(properties.target));
    errors.collect(cdk.propertyValidator('target', CfnSchedule_TargetPropertyValidator)(properties.target));
    return errors.wrap('supplied properties not correct for "CfnScheduleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule` resource
 *
 * @param properties - the TypeScript properties of a `CfnScheduleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule` resource.
 */
// @ts-ignore TS6133
function cfnSchedulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedulePropsValidator(properties).assertSuccess();
    return {
        FlexibleTimeWindow: cfnScheduleFlexibleTimeWindowPropertyToCloudFormation(properties.flexibleTimeWindow),
        ScheduleExpression: cdk.stringToCloudFormation(properties.scheduleExpression),
        Target: cfnScheduleTargetPropertyToCloudFormation(properties.target),
        Description: cdk.stringToCloudFormation(properties.description),
        EndDate: cdk.stringToCloudFormation(properties.endDate),
        GroupName: cdk.stringToCloudFormation(properties.groupName),
        KmsKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        Name: cdk.stringToCloudFormation(properties.name),
        ScheduleExpressionTimezone: cdk.stringToCloudFormation(properties.scheduleExpressionTimezone),
        StartDate: cdk.stringToCloudFormation(properties.startDate),
        State: cdk.stringToCloudFormation(properties.state),
    };
}

// @ts-ignore TS6133
function CfnSchedulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduleProps>();
    ret.addPropertyResult('flexibleTimeWindow', 'FlexibleTimeWindow', CfnScheduleFlexibleTimeWindowPropertyFromCloudFormation(properties.FlexibleTimeWindow));
    ret.addPropertyResult('scheduleExpression', 'ScheduleExpression', cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression));
    ret.addPropertyResult('target', 'Target', CfnScheduleTargetPropertyFromCloudFormation(properties.Target));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('endDate', 'EndDate', properties.EndDate != null ? cfn_parse.FromCloudFormation.getString(properties.EndDate) : undefined);
    ret.addPropertyResult('groupName', 'GroupName', properties.GroupName != null ? cfn_parse.FromCloudFormation.getString(properties.GroupName) : undefined);
    ret.addPropertyResult('kmsKeyArn', 'KmsKeyArn', properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('scheduleExpressionTimezone', 'ScheduleExpressionTimezone', properties.ScheduleExpressionTimezone != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpressionTimezone) : undefined);
    ret.addPropertyResult('startDate', 'StartDate', properties.StartDate != null ? cfn_parse.FromCloudFormation.getString(properties.StartDate) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Scheduler::Schedule`
 *
 * Creates the specified schedule.
 *
 * @cloudformationResource AWS::Scheduler::Schedule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html
 */
export class CfnSchedule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Scheduler::Schedule";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchedule {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSchedulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnSchedule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) for the Amazon EventBridge Scheduler schedule.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Allows you to configure a time window during which EventBridge Scheduler invokes the schedule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-flexibletimewindow
     */
    public flexibleTimeWindow: CfnSchedule.FlexibleTimeWindowProperty | cdk.IResolvable;

    /**
     * The expression that defines when the schedule runs. The following formats are supported.
     *
     * - `at` expression - `at(yyyy-mm-ddThh:mm:ss)`
     * - `rate` expression - `rate(unit value)`
     * - `cron` expression - `cron(fields)`
     *
     * You can use `at` expressions to create one-time schedules that invoke a target once, at the time and in the time zone, that you specify. You can use `rate` and `cron` expressions to create recurring schedules. Rate-based schedules are useful when you want to invoke a target at regular intervals, such as every 15 minutes or every five days. Cron-based schedules are useful when you want to invoke a target periodically at a specific time, such as at 8:00 am (UTC+0) every 1st day of the month.
     *
     * A `cron` expression consists of six fields separated by white spaces: `(minutes hours day_of_month month day_of_week year)` .
     *
     * A `rate` expression consists of a *value* as a positive integer, and a *unit* with the following options: `minute` | `minutes` | `hour` | `hours` | `day` | `days`
     *
     * For more information and examples, see [Schedule types on EventBridge Scheduler](https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html) in the *EventBridge Scheduler User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-scheduleexpression
     */
    public scheduleExpression: string;

    /**
     * The schedule's target details.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-target
     */
    public target: CfnSchedule.TargetProperty | cdk.IResolvable;

    /**
     * The description you specify for the schedule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-description
     */
    public description: string | undefined;

    /**
     * The date, in UTC, before which the schedule can invoke its target. Depending on the schedule's recurrence expression, invocations might stop on, or before, the `EndDate` you specify.
     * EventBridge Scheduler ignores `EndDate` for one-time schedules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-enddate
     */
    public endDate: string | undefined;

    /**
     * The name of the schedule group associated with this schedule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-groupname
     */
    public groupName: string | undefined;

    /**
     * The Amazon Resource Name (ARN) for the customer managed KMS key that EventBridge Scheduler will use to encrypt and decrypt your data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-kmskeyarn
     */
    public kmsKeyArn: string | undefined;

    /**
     * The name of the schedule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-name
     */
    public name: string | undefined;

    /**
     * The timezone in which the scheduling expression is evaluated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-scheduleexpressiontimezone
     */
    public scheduleExpressionTimezone: string | undefined;

    /**
     * The date, in UTC, after which the schedule can begin invoking its target. Depending on the schedule's recurrence expression, invocations might occur on, or after, the `StartDate` you specify.
     * EventBridge Scheduler ignores `StartDate` for one-time schedules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-startdate
     */
    public startDate: string | undefined;

    /**
     * Specifies whether the schedule is enabled or disabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedule.html#cfn-scheduler-schedule-state
     */
    public state: string | undefined;

    /**
     * Create a new `AWS::Scheduler::Schedule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnScheduleProps) {
        super(scope, id, { type: CfnSchedule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'flexibleTimeWindow', this);
        cdk.requireProperty(props, 'scheduleExpression', this);
        cdk.requireProperty(props, 'target', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.flexibleTimeWindow = props.flexibleTimeWindow;
        this.scheduleExpression = props.scheduleExpression;
        this.target = props.target;
        this.description = props.description;
        this.endDate = props.endDate;
        this.groupName = props.groupName;
        this.kmsKeyArn = props.kmsKeyArn;
        this.name = props.name;
        this.scheduleExpressionTimezone = props.scheduleExpressionTimezone;
        this.startDate = props.startDate;
        this.state = props.state;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchedule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            flexibleTimeWindow: this.flexibleTimeWindow,
            scheduleExpression: this.scheduleExpression,
            target: this.target,
            description: this.description,
            endDate: this.endDate,
            groupName: this.groupName,
            kmsKeyArn: this.kmsKeyArn,
            name: this.name,
            scheduleExpressionTimezone: this.scheduleExpressionTimezone,
            startDate: this.startDate,
            state: this.state,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSchedulePropsToCloudFormation(props);
    }
}

export namespace CfnSchedule {
    /**
     * This structure specifies the VPC subnets and security groups for the task, and whether a public IP address is to be used. This structure is relevant only for ECS tasks that use the awsvpc network mode.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-awsvpcconfiguration.html
     */
    export interface AwsVpcConfigurationProperty {
        /**
         * Specifies whether the task's elastic network interface receives a public IP address. You can specify `ENABLED` only when `LaunchType` in `EcsParameters` is set to `FARGATE` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-awsvpcconfiguration.html#cfn-scheduler-schedule-awsvpcconfiguration-assignpublicip
         */
        readonly assignPublicIp?: string;
        /**
         * Specifies the security groups associated with the task. These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-awsvpcconfiguration.html#cfn-scheduler-schedule-awsvpcconfiguration-securitygroups
         */
        readonly securityGroups?: string[];
        /**
         * Specifies the subnets associated with the task. These subnets must all be in the same VPC. You can specify as many as 16 subnets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-awsvpcconfiguration.html#cfn-scheduler-schedule-awsvpcconfiguration-subnets
         */
        readonly subnets: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AwsVpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AwsVpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_AwsVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assignPublicIp', cdk.validateString)(properties.assignPublicIp));
    errors.collect(cdk.propertyValidator('securityGroups', cdk.listValidator(cdk.validateString))(properties.securityGroups));
    errors.collect(cdk.propertyValidator('subnets', cdk.requiredValidator)(properties.subnets));
    errors.collect(cdk.propertyValidator('subnets', cdk.listValidator(cdk.validateString))(properties.subnets));
    return errors.wrap('supplied properties not correct for "AwsVpcConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.AwsVpcConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AwsVpcConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.AwsVpcConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnScheduleAwsVpcConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_AwsVpcConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AssignPublicIp: cdk.stringToCloudFormation(properties.assignPublicIp),
        SecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
        Subnets: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
    };
}

// @ts-ignore TS6133
function CfnScheduleAwsVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.AwsVpcConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.AwsVpcConfigurationProperty>();
    ret.addPropertyResult('assignPublicIp', 'AssignPublicIp', properties.AssignPublicIp != null ? cfn_parse.FromCloudFormation.getString(properties.AssignPublicIp) : undefined);
    ret.addPropertyResult('securityGroups', 'SecurityGroups', properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroups) : undefined);
    ret.addPropertyResult('subnets', 'Subnets', cfn_parse.FromCloudFormation.getStringArray(properties.Subnets));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * The details of a capacity provider strategy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-capacityproviderstrategyitem.html
     */
    export interface CapacityProviderStrategyItemProperty {
        /**
         * The base value designates how many tasks, at a minimum, to run on the specified capacity provider. Only one capacity provider in a capacity provider strategy can have a base defined. If no value is specified, the default value of `0` is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-capacityproviderstrategyitem.html#cfn-scheduler-schedule-capacityproviderstrategyitem-base
         */
        readonly base?: number;
        /**
         * The short name of the capacity provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-capacityproviderstrategyitem.html#cfn-scheduler-schedule-capacityproviderstrategyitem-capacityprovider
         */
        readonly capacityProvider: string;
        /**
         * The weight value designates the relative percentage of the total number of tasks launched that should use the specified capacity provider. The weight value is taken into consideration after the base value, if defined, is satisfied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-capacityproviderstrategyitem.html#cfn-scheduler-schedule-capacityproviderstrategyitem-weight
         */
        readonly weight?: number;
    }
}

/**
 * Determine whether the given properties match those of a `CapacityProviderStrategyItemProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityProviderStrategyItemProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_CapacityProviderStrategyItemPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('base', cdk.validateNumber)(properties.base));
    errors.collect(cdk.propertyValidator('capacityProvider', cdk.requiredValidator)(properties.capacityProvider));
    errors.collect(cdk.propertyValidator('capacityProvider', cdk.validateString)(properties.capacityProvider));
    errors.collect(cdk.propertyValidator('weight', cdk.validateNumber)(properties.weight));
    return errors.wrap('supplied properties not correct for "CapacityProviderStrategyItemProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.CapacityProviderStrategyItem` resource
 *
 * @param properties - the TypeScript properties of a `CapacityProviderStrategyItemProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.CapacityProviderStrategyItem` resource.
 */
// @ts-ignore TS6133
function cfnScheduleCapacityProviderStrategyItemPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_CapacityProviderStrategyItemPropertyValidator(properties).assertSuccess();
    return {
        Base: cdk.numberToCloudFormation(properties.base),
        CapacityProvider: cdk.stringToCloudFormation(properties.capacityProvider),
        Weight: cdk.numberToCloudFormation(properties.weight),
    };
}

// @ts-ignore TS6133
function CfnScheduleCapacityProviderStrategyItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.CapacityProviderStrategyItemProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.CapacityProviderStrategyItemProperty>();
    ret.addPropertyResult('base', 'Base', properties.Base != null ? cfn_parse.FromCloudFormation.getNumber(properties.Base) : undefined);
    ret.addPropertyResult('capacityProvider', 'CapacityProvider', cfn_parse.FromCloudFormation.getString(properties.CapacityProvider));
    ret.addPropertyResult('weight', 'Weight', properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * An object that contains information about an Amazon SQS queue that EventBridge Scheduler uses as a dead-letter queue for your schedule. If specified, EventBridge Scheduler delivers failed events that could not be successfully delivered to a target to the queue.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-deadletterconfig.html
     */
    export interface DeadLetterConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the SQS queue specified as the destination for the dead-letter queue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-deadletterconfig.html#cfn-scheduler-schedule-deadletterconfig-arn
         */
        readonly arn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeadLetterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DeadLetterConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_DeadLetterConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "DeadLetterConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.DeadLetterConfig` resource
 *
 * @param properties - the TypeScript properties of a `DeadLetterConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.DeadLetterConfig` resource.
 */
// @ts-ignore TS6133
function cfnScheduleDeadLetterConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_DeadLetterConfigPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnScheduleDeadLetterConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.DeadLetterConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.DeadLetterConfigProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * The templated target type for the Amazon ECS [`RunTask`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html) API operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html
     */
    export interface EcsParametersProperty {
        /**
         * The capacity provider strategy to use for the task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-capacityproviderstrategy
         */
        readonly capacityProviderStrategy?: Array<CfnSchedule.CapacityProviderStrategyItemProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies whether to enable Amazon ECS managed tags for the task. For more information, see [Tagging Your Amazon ECS Resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html) in the *Amazon ECS Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-enableecsmanagedtags
         */
        readonly enableEcsManagedTags?: boolean | cdk.IResolvable;
        /**
         * Whether or not to enable the execute command functionality for the containers in this task. If true, this enables execute command functionality on all containers in the task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-enableexecutecommand
         */
        readonly enableExecuteCommand?: boolean | cdk.IResolvable;
        /**
         * Specifies an ECS task group for the task. The maximum length is 255 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-group
         */
        readonly group?: string;
        /**
         * Specifies the launch type on which your task is running. The launch type that you specify here must match one of the launch type (compatibilities) of the target task. The `FARGATE` value is supported only in the Regions where Fargate with Amazon ECS is supported. For more information, see [AWS Fargate on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html) in the *Amazon ECS Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-launchtype
         */
        readonly launchType?: string;
        /**
         * This structure specifies the network configuration for an ECS task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-networkconfiguration
         */
        readonly networkConfiguration?: CfnSchedule.NetworkConfigurationProperty | cdk.IResolvable;
        /**
         * An array of placement constraint objects to use for the task. You can specify up to 10 constraints per task (including constraints in the task definition and those specified at runtime).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-placementconstraints
         */
        readonly placementConstraints?: Array<CfnSchedule.PlacementConstraintProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The task placement strategy for a task or service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-placementstrategy
         */
        readonly placementStrategy?: Array<CfnSchedule.PlacementStrategyProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies the platform version for the task. Specify only the numeric portion of the platform version, such as `1.1.0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-platformversion
         */
        readonly platformVersion?: string;
        /**
         * Specifies whether to propagate the tags from the task definition to the task. If no value is specified, the tags are not propagated. Tags can only be propagated to the task during task creation. To add tags to a task after task creation, use Amazon ECS's [`TagResource`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_TagResource.html) API action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-propagatetags
         */
        readonly propagateTags?: string;
        /**
         * The reference ID to use for the task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-referenceid
         */
        readonly referenceId?: string;
        /**
         * The metadata that you apply to the task to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. For more information, see [`RunTask`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html) in the *Amazon ECS API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-tags
         */
        readonly tags?: any;
        /**
         * The number of tasks to create based on `TaskDefinition` . The default is `1` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-taskcount
         */
        readonly taskCount?: number;
        /**
         * The Amazon Resource Name (ARN) of the task definition to use if the event target is an Amazon ECS task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-ecsparameters.html#cfn-scheduler-schedule-ecsparameters-taskdefinitionarn
         */
        readonly taskDefinitionArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `EcsParametersProperty`
 *
 * @param properties - the TypeScript properties of a `EcsParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_EcsParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('capacityProviderStrategy', cdk.listValidator(CfnSchedule_CapacityProviderStrategyItemPropertyValidator))(properties.capacityProviderStrategy));
    errors.collect(cdk.propertyValidator('enableEcsManagedTags', cdk.validateBoolean)(properties.enableEcsManagedTags));
    errors.collect(cdk.propertyValidator('enableExecuteCommand', cdk.validateBoolean)(properties.enableExecuteCommand));
    errors.collect(cdk.propertyValidator('group', cdk.validateString)(properties.group));
    errors.collect(cdk.propertyValidator('launchType', cdk.validateString)(properties.launchType));
    errors.collect(cdk.propertyValidator('networkConfiguration', CfnSchedule_NetworkConfigurationPropertyValidator)(properties.networkConfiguration));
    errors.collect(cdk.propertyValidator('placementConstraints', cdk.listValidator(CfnSchedule_PlacementConstraintPropertyValidator))(properties.placementConstraints));
    errors.collect(cdk.propertyValidator('placementStrategy', cdk.listValidator(CfnSchedule_PlacementStrategyPropertyValidator))(properties.placementStrategy));
    errors.collect(cdk.propertyValidator('platformVersion', cdk.validateString)(properties.platformVersion));
    errors.collect(cdk.propertyValidator('propagateTags', cdk.validateString)(properties.propagateTags));
    errors.collect(cdk.propertyValidator('referenceId', cdk.validateString)(properties.referenceId));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('taskCount', cdk.validateNumber)(properties.taskCount));
    errors.collect(cdk.propertyValidator('taskDefinitionArn', cdk.requiredValidator)(properties.taskDefinitionArn));
    errors.collect(cdk.propertyValidator('taskDefinitionArn', cdk.validateString)(properties.taskDefinitionArn));
    return errors.wrap('supplied properties not correct for "EcsParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.EcsParameters` resource
 *
 * @param properties - the TypeScript properties of a `EcsParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.EcsParameters` resource.
 */
// @ts-ignore TS6133
function cfnScheduleEcsParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_EcsParametersPropertyValidator(properties).assertSuccess();
    return {
        CapacityProviderStrategy: cdk.listMapper(cfnScheduleCapacityProviderStrategyItemPropertyToCloudFormation)(properties.capacityProviderStrategy),
        EnableECSManagedTags: cdk.booleanToCloudFormation(properties.enableEcsManagedTags),
        EnableExecuteCommand: cdk.booleanToCloudFormation(properties.enableExecuteCommand),
        Group: cdk.stringToCloudFormation(properties.group),
        LaunchType: cdk.stringToCloudFormation(properties.launchType),
        NetworkConfiguration: cfnScheduleNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
        PlacementConstraints: cdk.listMapper(cfnSchedulePlacementConstraintPropertyToCloudFormation)(properties.placementConstraints),
        PlacementStrategy: cdk.listMapper(cfnSchedulePlacementStrategyPropertyToCloudFormation)(properties.placementStrategy),
        PlatformVersion: cdk.stringToCloudFormation(properties.platformVersion),
        PropagateTags: cdk.stringToCloudFormation(properties.propagateTags),
        ReferenceId: cdk.stringToCloudFormation(properties.referenceId),
        Tags: cdk.objectToCloudFormation(properties.tags),
        TaskCount: cdk.numberToCloudFormation(properties.taskCount),
        TaskDefinitionArn: cdk.stringToCloudFormation(properties.taskDefinitionArn),
    };
}

// @ts-ignore TS6133
function CfnScheduleEcsParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.EcsParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.EcsParametersProperty>();
    ret.addPropertyResult('capacityProviderStrategy', 'CapacityProviderStrategy', properties.CapacityProviderStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnScheduleCapacityProviderStrategyItemPropertyFromCloudFormation)(properties.CapacityProviderStrategy) : undefined);
    ret.addPropertyResult('enableEcsManagedTags', 'EnableECSManagedTags', properties.EnableECSManagedTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableECSManagedTags) : undefined);
    ret.addPropertyResult('enableExecuteCommand', 'EnableExecuteCommand', properties.EnableExecuteCommand != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableExecuteCommand) : undefined);
    ret.addPropertyResult('group', 'Group', properties.Group != null ? cfn_parse.FromCloudFormation.getString(properties.Group) : undefined);
    ret.addPropertyResult('launchType', 'LaunchType', properties.LaunchType != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchType) : undefined);
    ret.addPropertyResult('networkConfiguration', 'NetworkConfiguration', properties.NetworkConfiguration != null ? CfnScheduleNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined);
    ret.addPropertyResult('placementConstraints', 'PlacementConstraints', properties.PlacementConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnSchedulePlacementConstraintPropertyFromCloudFormation)(properties.PlacementConstraints) : undefined);
    ret.addPropertyResult('placementStrategy', 'PlacementStrategy', properties.PlacementStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnSchedulePlacementStrategyPropertyFromCloudFormation)(properties.PlacementStrategy) : undefined);
    ret.addPropertyResult('platformVersion', 'PlatformVersion', properties.PlatformVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformVersion) : undefined);
    ret.addPropertyResult('propagateTags', 'PropagateTags', properties.PropagateTags != null ? cfn_parse.FromCloudFormation.getString(properties.PropagateTags) : undefined);
    ret.addPropertyResult('referenceId', 'ReferenceId', properties.ReferenceId != null ? cfn_parse.FromCloudFormation.getString(properties.ReferenceId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('taskCount', 'TaskCount', properties.TaskCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.TaskCount) : undefined);
    ret.addPropertyResult('taskDefinitionArn', 'TaskDefinitionArn', cfn_parse.FromCloudFormation.getString(properties.TaskDefinitionArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * The templated target type for the EventBridge [`PutEvents`](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html) API operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-eventbridgeparameters.html
     */
    export interface EventBridgeParametersProperty {
        /**
         * A free-form string, with a maximum of 128 characters, used to decide what fields to expect in the event detail.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-eventbridgeparameters.html#cfn-scheduler-schedule-eventbridgeparameters-detailtype
         */
        readonly detailType: string;
        /**
         * The source of the event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-eventbridgeparameters.html#cfn-scheduler-schedule-eventbridgeparameters-source
         */
        readonly source: string;
    }
}

/**
 * Determine whether the given properties match those of a `EventBridgeParametersProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_EventBridgeParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('detailType', cdk.requiredValidator)(properties.detailType));
    errors.collect(cdk.propertyValidator('detailType', cdk.validateString)(properties.detailType));
    errors.collect(cdk.propertyValidator('source', cdk.requiredValidator)(properties.source));
    errors.collect(cdk.propertyValidator('source', cdk.validateString)(properties.source));
    return errors.wrap('supplied properties not correct for "EventBridgeParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.EventBridgeParameters` resource
 *
 * @param properties - the TypeScript properties of a `EventBridgeParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.EventBridgeParameters` resource.
 */
// @ts-ignore TS6133
function cfnScheduleEventBridgeParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_EventBridgeParametersPropertyValidator(properties).assertSuccess();
    return {
        DetailType: cdk.stringToCloudFormation(properties.detailType),
        Source: cdk.stringToCloudFormation(properties.source),
    };
}

// @ts-ignore TS6133
function CfnScheduleEventBridgeParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.EventBridgeParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.EventBridgeParametersProperty>();
    ret.addPropertyResult('detailType', 'DetailType', cfn_parse.FromCloudFormation.getString(properties.DetailType));
    ret.addPropertyResult('source', 'Source', cfn_parse.FromCloudFormation.getString(properties.Source));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * Allows you to configure a time window during which EventBridge Scheduler invokes the schedule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-flexibletimewindow.html
     */
    export interface FlexibleTimeWindowProperty {
        /**
         * The maximum time window during which a schedule can be invoked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-flexibletimewindow.html#cfn-scheduler-schedule-flexibletimewindow-maximumwindowinminutes
         */
        readonly maximumWindowInMinutes?: number;
        /**
         * Determines whether the schedule is invoked within a flexible time window.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-flexibletimewindow.html#cfn-scheduler-schedule-flexibletimewindow-mode
         */
        readonly mode: string;
    }
}

/**
 * Determine whether the given properties match those of a `FlexibleTimeWindowProperty`
 *
 * @param properties - the TypeScript properties of a `FlexibleTimeWindowProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_FlexibleTimeWindowPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maximumWindowInMinutes', cdk.validateNumber)(properties.maximumWindowInMinutes));
    errors.collect(cdk.propertyValidator('mode', cdk.requiredValidator)(properties.mode));
    errors.collect(cdk.propertyValidator('mode', cdk.validateString)(properties.mode));
    return errors.wrap('supplied properties not correct for "FlexibleTimeWindowProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.FlexibleTimeWindow` resource
 *
 * @param properties - the TypeScript properties of a `FlexibleTimeWindowProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.FlexibleTimeWindow` resource.
 */
// @ts-ignore TS6133
function cfnScheduleFlexibleTimeWindowPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_FlexibleTimeWindowPropertyValidator(properties).assertSuccess();
    return {
        MaximumWindowInMinutes: cdk.numberToCloudFormation(properties.maximumWindowInMinutes),
        Mode: cdk.stringToCloudFormation(properties.mode),
    };
}

// @ts-ignore TS6133
function CfnScheduleFlexibleTimeWindowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.FlexibleTimeWindowProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.FlexibleTimeWindowProperty>();
    ret.addPropertyResult('maximumWindowInMinutes', 'MaximumWindowInMinutes', properties.MaximumWindowInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumWindowInMinutes) : undefined);
    ret.addPropertyResult('mode', 'Mode', cfn_parse.FromCloudFormation.getString(properties.Mode));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * The templated target type for the Amazon Kinesis [`PutRecord`](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecord.html) API operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-kinesisparameters.html
     */
    export interface KinesisParametersProperty {
        /**
         * Specifies the shard to which EventBridge Scheduler sends the event. For more information, see [Amazon Kinesis Data Streams terminology and concepts](https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html) in the *Amazon Kinesis Streams Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-kinesisparameters.html#cfn-scheduler-schedule-kinesisparameters-partitionkey
         */
        readonly partitionKey: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisParametersProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_KinesisParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('partitionKey', cdk.requiredValidator)(properties.partitionKey));
    errors.collect(cdk.propertyValidator('partitionKey', cdk.validateString)(properties.partitionKey));
    return errors.wrap('supplied properties not correct for "KinesisParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.KinesisParameters` resource
 *
 * @param properties - the TypeScript properties of a `KinesisParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.KinesisParameters` resource.
 */
// @ts-ignore TS6133
function cfnScheduleKinesisParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_KinesisParametersPropertyValidator(properties).assertSuccess();
    return {
        PartitionKey: cdk.stringToCloudFormation(properties.partitionKey),
    };
}

// @ts-ignore TS6133
function CfnScheduleKinesisParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.KinesisParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.KinesisParametersProperty>();
    ret.addPropertyResult('partitionKey', 'PartitionKey', cfn_parse.FromCloudFormation.getString(properties.PartitionKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * Specifies the network configuration for an ECS task.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-networkconfiguration.html
     */
    export interface NetworkConfigurationProperty {
        /**
         * Specifies the Amazon VPC subnets and security groups for the task, and whether a public IP address is to be used. This structure is relevant only for ECS tasks that use the awsvpc network mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-networkconfiguration.html#cfn-scheduler-schedule-networkconfiguration-awsvpcconfiguration
         */
        readonly awsvpcConfiguration?: CfnSchedule.AwsVpcConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_NetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsvpcConfiguration', CfnSchedule_AwsVpcConfigurationPropertyValidator)(properties.awsvpcConfiguration));
    return errors.wrap('supplied properties not correct for "NetworkConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.NetworkConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.NetworkConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnScheduleNetworkConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_NetworkConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AwsvpcConfiguration: cfnScheduleAwsVpcConfigurationPropertyToCloudFormation(properties.awsvpcConfiguration),
    };
}

// @ts-ignore TS6133
function CfnScheduleNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.NetworkConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.NetworkConfigurationProperty>();
    ret.addPropertyResult('awsvpcConfiguration', 'AwsvpcConfiguration', properties.AwsvpcConfiguration != null ? CfnScheduleAwsVpcConfigurationPropertyFromCloudFormation(properties.AwsvpcConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * An object representing a constraint on task placement.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementconstraint.html
     */
    export interface PlacementConstraintProperty {
        /**
         * A cluster query language expression to apply to the constraint. You cannot specify an expression if the constraint type is `distinctInstance` . For more information, see [Cluster query language](https://docs.aws.amazon.com/latest/developerguide/cluster-query-language.html) in the *Amazon ECS Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementconstraint.html#cfn-scheduler-schedule-placementconstraint-expression
         */
        readonly expression?: string;
        /**
         * The type of constraint. Use `distinctInstance` to ensure that each task in a particular group is running on a different container instance. Use `memberOf` to restrict the selection to a group of valid candidates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementconstraint.html#cfn-scheduler-schedule-placementconstraint-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PlacementConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementConstraintProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_PlacementConstraintPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "PlacementConstraintProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.PlacementConstraint` resource
 *
 * @param properties - the TypeScript properties of a `PlacementConstraintProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.PlacementConstraint` resource.
 */
// @ts-ignore TS6133
function cfnSchedulePlacementConstraintPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_PlacementConstraintPropertyValidator(properties).assertSuccess();
    return {
        Expression: cdk.stringToCloudFormation(properties.expression),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnSchedulePlacementConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.PlacementConstraintProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.PlacementConstraintProperty>();
    ret.addPropertyResult('expression', 'Expression', properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * The task placement strategy for a task or service.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementstrategy.html
     */
    export interface PlacementStrategyProperty {
        /**
         * The field to apply the placement strategy against. For the spread placement strategy, valid values are `instanceId` (or `instanceId` , which has the same effect), or any platform or custom attribute that is applied to a container instance, such as `attribute:ecs.availability-zone` . For the binpack placement strategy, valid values are `cpu` and `memory` . For the random placement strategy, this field is not used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementstrategy.html#cfn-scheduler-schedule-placementstrategy-field
         */
        readonly field?: string;
        /**
         * The type of placement strategy. The random placement strategy randomly places tasks on available candidates. The spread placement strategy spreads placement across available candidates evenly based on the field parameter. The binpack strategy places tasks on available candidates that have the least available amount of the resource that is specified with the field parameter. For example, if you binpack on memory, a task is placed on the instance with the least amount of remaining memory (but still enough to run the task).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-placementstrategy.html#cfn-scheduler-schedule-placementstrategy-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PlacementStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementStrategyProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_PlacementStrategyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('field', cdk.validateString)(properties.field));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "PlacementStrategyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.PlacementStrategy` resource
 *
 * @param properties - the TypeScript properties of a `PlacementStrategyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.PlacementStrategy` resource.
 */
// @ts-ignore TS6133
function cfnSchedulePlacementStrategyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_PlacementStrategyPropertyValidator(properties).assertSuccess();
    return {
        Field: cdk.stringToCloudFormation(properties.field),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnSchedulePlacementStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.PlacementStrategyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.PlacementStrategyProperty>();
    ret.addPropertyResult('field', 'Field', properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * A `RetryPolicy` object that includes information about the retry policy settings, including the maximum age of an event, and the maximum number of times EventBridge Scheduler will try to deliver the event to a target.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-retrypolicy.html
     */
    export interface RetryPolicyProperty {
        /**
         * The maximum amount of time, in seconds, to continue to make retry attempts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-retrypolicy.html#cfn-scheduler-schedule-retrypolicy-maximumeventageinseconds
         */
        readonly maximumEventAgeInSeconds?: number;
        /**
         * The maximum number of retry attempts to make before the request fails. Retry attempts with exponential backoff continue until either the maximum number of attempts is made or until the duration of the `MaximumEventAgeInSeconds` is reached.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-retrypolicy.html#cfn-scheduler-schedule-retrypolicy-maximumretryattempts
         */
        readonly maximumRetryAttempts?: number;
    }
}

/**
 * Determine whether the given properties match those of a `RetryPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `RetryPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_RetryPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maximumEventAgeInSeconds', cdk.validateNumber)(properties.maximumEventAgeInSeconds));
    errors.collect(cdk.propertyValidator('maximumRetryAttempts', cdk.validateNumber)(properties.maximumRetryAttempts));
    return errors.wrap('supplied properties not correct for "RetryPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.RetryPolicy` resource
 *
 * @param properties - the TypeScript properties of a `RetryPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.RetryPolicy` resource.
 */
// @ts-ignore TS6133
function cfnScheduleRetryPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_RetryPolicyPropertyValidator(properties).assertSuccess();
    return {
        MaximumEventAgeInSeconds: cdk.numberToCloudFormation(properties.maximumEventAgeInSeconds),
        MaximumRetryAttempts: cdk.numberToCloudFormation(properties.maximumRetryAttempts),
    };
}

// @ts-ignore TS6133
function CfnScheduleRetryPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.RetryPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.RetryPolicyProperty>();
    ret.addPropertyResult('maximumEventAgeInSeconds', 'MaximumEventAgeInSeconds', properties.MaximumEventAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumEventAgeInSeconds) : undefined);
    ret.addPropertyResult('maximumRetryAttempts', 'MaximumRetryAttempts', properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * The name and value pair of a parameter to use to start execution of a SageMaker Model Building Pipeline.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sagemakerpipelineparameter.html
     */
    export interface SageMakerPipelineParameterProperty {
        /**
         * Name of parameter to start execution of a SageMaker Model Building Pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sagemakerpipelineparameter.html#cfn-scheduler-schedule-sagemakerpipelineparameter-name
         */
        readonly name: string;
        /**
         * Value of parameter to start execution of a SageMaker Model Building Pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sagemakerpipelineparameter.html#cfn-scheduler-schedule-sagemakerpipelineparameter-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `SageMakerPipelineParameterProperty`
 *
 * @param properties - the TypeScript properties of a `SageMakerPipelineParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_SageMakerPipelineParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "SageMakerPipelineParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.SageMakerPipelineParameter` resource
 *
 * @param properties - the TypeScript properties of a `SageMakerPipelineParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.SageMakerPipelineParameter` resource.
 */
// @ts-ignore TS6133
function cfnScheduleSageMakerPipelineParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_SageMakerPipelineParameterPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnScheduleSageMakerPipelineParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.SageMakerPipelineParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.SageMakerPipelineParameterProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * The templated target type for the Amazon SageMaker [`StartPipelineExecution`](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_StartPipelineExecution.html) API operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sagemakerpipelineparameters.html
     */
    export interface SageMakerPipelineParametersProperty {
        /**
         * List of parameter names and values to use when executing the SageMaker Model Building Pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sagemakerpipelineparameters.html#cfn-scheduler-schedule-sagemakerpipelineparameters-pipelineparameterlist
         */
        readonly pipelineParameterList?: Array<CfnSchedule.SageMakerPipelineParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SageMakerPipelineParametersProperty`
 *
 * @param properties - the TypeScript properties of a `SageMakerPipelineParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_SageMakerPipelineParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pipelineParameterList', cdk.listValidator(CfnSchedule_SageMakerPipelineParameterPropertyValidator))(properties.pipelineParameterList));
    return errors.wrap('supplied properties not correct for "SageMakerPipelineParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.SageMakerPipelineParameters` resource
 *
 * @param properties - the TypeScript properties of a `SageMakerPipelineParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.SageMakerPipelineParameters` resource.
 */
// @ts-ignore TS6133
function cfnScheduleSageMakerPipelineParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_SageMakerPipelineParametersPropertyValidator(properties).assertSuccess();
    return {
        PipelineParameterList: cdk.listMapper(cfnScheduleSageMakerPipelineParameterPropertyToCloudFormation)(properties.pipelineParameterList),
    };
}

// @ts-ignore TS6133
function CfnScheduleSageMakerPipelineParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.SageMakerPipelineParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.SageMakerPipelineParametersProperty>();
    ret.addPropertyResult('pipelineParameterList', 'PipelineParameterList', properties.PipelineParameterList != null ? cfn_parse.FromCloudFormation.getArray(CfnScheduleSageMakerPipelineParameterPropertyFromCloudFormation)(properties.PipelineParameterList) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * The templated target type for the Amazon SQS [`SendMessage`](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) API operation. Contains the message group ID to use when the target is a FIFO queue. If you specify an Amazon SQS FIFO queue as a target, the queue must have content-based deduplication enabled. For more information, see [Using the Amazon SQS message deduplication ID](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagededuplicationid-property.html) in the *Amazon SQS Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sqsparameters.html
     */
    export interface SqsParametersProperty {
        /**
         * The FIFO message group ID to use as the target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sqsparameters.html#cfn-scheduler-schedule-sqsparameters-messagegroupid
         */
        readonly messageGroupId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SqsParametersProperty`
 *
 * @param properties - the TypeScript properties of a `SqsParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_SqsParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('messageGroupId', cdk.validateString)(properties.messageGroupId));
    return errors.wrap('supplied properties not correct for "SqsParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.SqsParameters` resource
 *
 * @param properties - the TypeScript properties of a `SqsParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.SqsParameters` resource.
 */
// @ts-ignore TS6133
function cfnScheduleSqsParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_SqsParametersPropertyValidator(properties).assertSuccess();
    return {
        MessageGroupId: cdk.stringToCloudFormation(properties.messageGroupId),
    };
}

// @ts-ignore TS6133
function CfnScheduleSqsParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.SqsParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.SqsParametersProperty>();
    ret.addPropertyResult('messageGroupId', 'MessageGroupId', properties.MessageGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.MessageGroupId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSchedule {
    /**
     * The schedule's target. EventBridge Scheduler supports templated target that invoke common API operations, as well as universal targets that you can customize to invoke over 6,000 API operations across more than 270 services. You can only specify one templated or universal target for a schedule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html
     */
    export interface TargetProperty {
        /**
         * The Amazon Resource Name (ARN) of the target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-arn
         */
        readonly arn: string;
        /**
         * An object that contains information about an Amazon SQS queue that EventBridge Scheduler uses as a dead-letter queue for your schedule. If specified, EventBridge Scheduler delivers failed events that could not be successfully delivered to a target to the queue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-deadletterconfig
         */
        readonly deadLetterConfig?: CfnSchedule.DeadLetterConfigProperty | cdk.IResolvable;
        /**
         * The templated target type for the Amazon ECS [`RunTask`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html) API operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-ecsparameters
         */
        readonly ecsParameters?: CfnSchedule.EcsParametersProperty | cdk.IResolvable;
        /**
         * The templated target type for the EventBridge [`PutEvents`](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html) API operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-eventbridgeparameters
         */
        readonly eventBridgeParameters?: CfnSchedule.EventBridgeParametersProperty | cdk.IResolvable;
        /**
         * The text, or well-formed JSON, passed to the target. If you are configuring a templated Lambda , AWS Step Functions , or Amazon EventBridge target, the input must be a well-formed JSON. For all other target types, a JSON is not required. If you do not specify anything for this field, Amazon EventBridge Scheduler delivers a default notification to the target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-input
         */
        readonly input?: string;
        /**
         * The templated target type for the Amazon Kinesis [`PutRecord`](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecord.html) API operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-kinesisparameters
         */
        readonly kinesisParameters?: CfnSchedule.KinesisParametersProperty | cdk.IResolvable;
        /**
         * A `RetryPolicy` object that includes information about the retry policy settings, including the maximum age of an event, and the maximum number of times EventBridge Scheduler will try to deliver the event to a target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-retrypolicy
         */
        readonly retryPolicy?: CfnSchedule.RetryPolicyProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the IAM role that EventBridge Scheduler will use for this target when the schedule is invoked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-rolearn
         */
        readonly roleArn: string;
        /**
         * The templated target type for the Amazon SageMaker [`StartPipelineExecution`](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_StartPipelineExecution.html) API operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-sagemakerpipelineparameters
         */
        readonly sageMakerPipelineParameters?: CfnSchedule.SageMakerPipelineParametersProperty | cdk.IResolvable;
        /**
         * The templated target type for the Amazon SQS [`SendMessage`](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) API operation. Contains the message group ID to use when the target is a FIFO queue. If you specify an Amazon SQS FIFO queue as a target, the queue must have content-based deduplication enabled. For more information, see [Using the Amazon SQS message deduplication ID](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagededuplicationid-property.html) in the *Amazon SQS Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-target.html#cfn-scheduler-schedule-target-sqsparameters
         */
        readonly sqsParameters?: CfnSchedule.SqsParametersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TargetProperty`
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the result of the validation.
 */
function CfnSchedule_TargetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.requiredValidator)(properties.arn));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('deadLetterConfig', CfnSchedule_DeadLetterConfigPropertyValidator)(properties.deadLetterConfig));
    errors.collect(cdk.propertyValidator('ecsParameters', CfnSchedule_EcsParametersPropertyValidator)(properties.ecsParameters));
    errors.collect(cdk.propertyValidator('eventBridgeParameters', CfnSchedule_EventBridgeParametersPropertyValidator)(properties.eventBridgeParameters));
    errors.collect(cdk.propertyValidator('input', cdk.validateString)(properties.input));
    errors.collect(cdk.propertyValidator('kinesisParameters', CfnSchedule_KinesisParametersPropertyValidator)(properties.kinesisParameters));
    errors.collect(cdk.propertyValidator('retryPolicy', CfnSchedule_RetryPolicyPropertyValidator)(properties.retryPolicy));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('sageMakerPipelineParameters', CfnSchedule_SageMakerPipelineParametersPropertyValidator)(properties.sageMakerPipelineParameters));
    errors.collect(cdk.propertyValidator('sqsParameters', CfnSchedule_SqsParametersPropertyValidator)(properties.sqsParameters));
    return errors.wrap('supplied properties not correct for "TargetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.Target` resource
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::Schedule.Target` resource.
 */
// @ts-ignore TS6133
function cfnScheduleTargetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSchedule_TargetPropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
        DeadLetterConfig: cfnScheduleDeadLetterConfigPropertyToCloudFormation(properties.deadLetterConfig),
        EcsParameters: cfnScheduleEcsParametersPropertyToCloudFormation(properties.ecsParameters),
        EventBridgeParameters: cfnScheduleEventBridgeParametersPropertyToCloudFormation(properties.eventBridgeParameters),
        Input: cdk.stringToCloudFormation(properties.input),
        KinesisParameters: cfnScheduleKinesisParametersPropertyToCloudFormation(properties.kinesisParameters),
        RetryPolicy: cfnScheduleRetryPolicyPropertyToCloudFormation(properties.retryPolicy),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SageMakerPipelineParameters: cfnScheduleSageMakerPipelineParametersPropertyToCloudFormation(properties.sageMakerPipelineParameters),
        SqsParameters: cfnScheduleSqsParametersPropertyToCloudFormation(properties.sqsParameters),
    };
}

// @ts-ignore TS6133
function CfnScheduleTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedule.TargetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedule.TargetProperty>();
    ret.addPropertyResult('arn', 'Arn', cfn_parse.FromCloudFormation.getString(properties.Arn));
    ret.addPropertyResult('deadLetterConfig', 'DeadLetterConfig', properties.DeadLetterConfig != null ? CfnScheduleDeadLetterConfigPropertyFromCloudFormation(properties.DeadLetterConfig) : undefined);
    ret.addPropertyResult('ecsParameters', 'EcsParameters', properties.EcsParameters != null ? CfnScheduleEcsParametersPropertyFromCloudFormation(properties.EcsParameters) : undefined);
    ret.addPropertyResult('eventBridgeParameters', 'EventBridgeParameters', properties.EventBridgeParameters != null ? CfnScheduleEventBridgeParametersPropertyFromCloudFormation(properties.EventBridgeParameters) : undefined);
    ret.addPropertyResult('input', 'Input', properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined);
    ret.addPropertyResult('kinesisParameters', 'KinesisParameters', properties.KinesisParameters != null ? CfnScheduleKinesisParametersPropertyFromCloudFormation(properties.KinesisParameters) : undefined);
    ret.addPropertyResult('retryPolicy', 'RetryPolicy', properties.RetryPolicy != null ? CfnScheduleRetryPolicyPropertyFromCloudFormation(properties.RetryPolicy) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('sageMakerPipelineParameters', 'SageMakerPipelineParameters', properties.SageMakerPipelineParameters != null ? CfnScheduleSageMakerPipelineParametersPropertyFromCloudFormation(properties.SageMakerPipelineParameters) : undefined);
    ret.addPropertyResult('sqsParameters', 'SqsParameters', properties.SqsParameters != null ? CfnScheduleSqsParametersPropertyFromCloudFormation(properties.SqsParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnScheduleGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedulegroup.html
 */
export interface CfnScheduleGroupProps {

    /**
     * The name of the schedule group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedulegroup.html#cfn-scheduler-schedulegroup-name
     */
    readonly name?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedulegroup.html#cfn-scheduler-schedulegroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnScheduleGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnScheduleGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnScheduleGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnScheduleGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Scheduler::ScheduleGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnScheduleGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Scheduler::ScheduleGroup` resource.
 */
// @ts-ignore TS6133
function cfnScheduleGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnScheduleGroupPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnScheduleGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduleGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduleGroupProps>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Scheduler::ScheduleGroup`
 *
 * Creates the specified schedule group.
 *
 * @cloudformationResource AWS::Scheduler::ScheduleGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedulegroup.html
 */
export class CfnScheduleGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Scheduler::ScheduleGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScheduleGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnScheduleGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnScheduleGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the schedule group.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The date and time at which the schedule group was created.
     * @cloudformationAttribute CreationDate
     */
    public readonly attrCreationDate: string;

    /**
     * The time at which the schedule group was last modified.
     * @cloudformationAttribute LastModificationDate
     */
    public readonly attrLastModificationDate: string;

    /**
     * Specifies the state of the schedule group.
     *
     * Valid values are `ACTIVE` and `DELETING` .
     * @cloudformationAttribute State
     */
    public readonly attrState: string;

    /**
     * The name of the schedule group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedulegroup.html#cfn-scheduler-schedulegroup-name
     */
    public name: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-scheduler-schedulegroup.html#cfn-scheduler-schedulegroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Scheduler::ScheduleGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnScheduleGroupProps = {}) {
        super(scope, id, { type: CfnScheduleGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationDate = cdk.Token.asString(this.getAtt('CreationDate', cdk.ResolutionTypeHint.STRING));
        this.attrLastModificationDate = cdk.Token.asString(this.getAtt('LastModificationDate', cdk.ResolutionTypeHint.STRING));
        this.attrState = cdk.Token.asString(this.getAtt('State', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Scheduler::ScheduleGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnScheduleGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnScheduleGroupPropsToCloudFormation(props);
    }
}
