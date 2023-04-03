// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-30T13:42:12.925Z","fingerprint":"3U/LZsIxx7jJcqX9jNTL3lxjbjU4AZuGtblaoKMM0FY="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAlarm`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html
 */
export interface CfnAlarmProps {

    /**
     * The arithmetic operation to use when comparing the specified statistic and threshold. The specified statistic value is used as the first operand.
     *
     * You can specify the following values: `GreaterThanThreshold` , `GreaterThanOrEqualToThreshold` , `LessThanThreshold` , or `LessThanOrEqualToThreshold` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-comparisonoperator
     */
    readonly comparisonOperator: string;

    /**
     * The number of periods over which data is compared to the specified threshold. If you are setting an alarm that requires that a number of consecutive data points be breaching to trigger the alarm, this value specifies that number. If you are setting an "M out of N" alarm, this value is the N, and `DatapointsToAlarm` is the M.
     *
     * For more information, see [Evaluating an Alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation) in the *Amazon CloudWatch User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-evaluationperiods
     */
    readonly evaluationPeriods: number;

    /**
     * Indicates whether actions should be executed during any changes to the alarm state. The default is TRUE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-actionsenabled
     */
    readonly actionsEnabled?: boolean | cdk.IResolvable;

    /**
     * The list of actions to execute when this alarm transitions into an ALARM state from any other state. Specify each action as an Amazon Resource Name (ARN). For more information about creating alarms and the actions that you can specify, see [PutMetricAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html) in the *Amazon CloudWatch API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-alarmactions
     */
    readonly alarmActions?: string[];

    /**
     * The description of the alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-alarmdescription
     */
    readonly alarmDescription?: string;

    /**
     * The name of the alarm. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the alarm name.
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-alarmname
     */
    readonly alarmName?: string;

    /**
     * The number of datapoints that must be breaching to trigger the alarm. This is used only if you are setting an "M out of N" alarm. In that case, this value is the M, and the value that you set for `EvaluationPeriods` is the N value. For more information, see [Evaluating an Alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation) in the *Amazon CloudWatch User Guide* .
     *
     * If you omit this parameter, CloudWatch uses the same value here that you set for `EvaluationPeriods` , and the alarm goes to alarm state if that many consecutive periods are breaching.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarm-datapointstoalarm
     */
    readonly datapointsToAlarm?: number;

    /**
     * The dimensions for the metric associated with the alarm. For an alarm based on a math expression, you can't specify `Dimensions` . Instead, you use `Metrics` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-dimension
     */
    readonly dimensions?: Array<CfnAlarm.DimensionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Used only for alarms based on percentiles. If `ignore` , the alarm state does not change during periods with too few data points to be statistically significant. If `evaluate` or this parameter is not used, the alarm is always evaluated and possibly changes state no matter how many data points are available.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-evaluatelowsamplecountpercentile
     */
    readonly evaluateLowSampleCountPercentile?: string;

    /**
     * The percentile statistic for the metric associated with the alarm. Specify a value between p0.0 and p100.
     *
     * For an alarm based on a metric, you must specify either `Statistic` or `ExtendedStatistic` but not both.
     *
     * For an alarm based on a math expression, you can't specify `ExtendedStatistic` . Instead, you use `Metrics` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-extendedstatistic
     */
    readonly extendedStatistic?: string;

    /**
     * The actions to execute when this alarm transitions to the `INSUFFICIENT_DATA` state from any other state. Each action is specified as an Amazon Resource Name (ARN).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-insufficientdataactions
     */
    readonly insufficientDataActions?: string[];

    /**
     * The name of the metric associated with the alarm. This is required for an alarm based on a metric. For an alarm based on a math expression, you use `Metrics` instead and you can't specify `MetricName` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-metricname
     */
    readonly metricName?: string;

    /**
     * An array that enables you to create an alarm based on the result of a metric math expression. Each item in the array either retrieves a metric or performs a math expression.
     *
     * If you specify the `Metrics` parameter, you cannot specify `MetricName` , `Dimensions` , `Period` , `Namespace` , `Statistic` , `ExtendedStatistic` , or `Unit` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarm-metrics
     */
    readonly metrics?: Array<CfnAlarm.MetricDataQueryProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The namespace of the metric associated with the alarm. This is required for an alarm based on a metric. For an alarm based on a math expression, you can't specify `Namespace` and you use `Metrics` instead.
     *
     * For a list of namespaces for metrics from AWS services, see [AWS Services That Publish CloudWatch Metrics.](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-namespace
     */
    readonly namespace?: string;

    /**
     * The actions to execute when this alarm transitions to the `OK` state from any other state. Each action is specified as an Amazon Resource Name (ARN).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-okactions
     */
    readonly okActions?: string[];

    /**
     * The period, in seconds, over which the statistic is applied. This is required for an alarm based on a metric. Valid values are 10, 30, 60, and any multiple of 60.
     *
     * For an alarm based on a math expression, you can't specify `Period` , and instead you use the `Metrics` parameter.
     *
     * *Minimum:* 10
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-period
     */
    readonly period?: number;

    /**
     * The statistic for the metric associated with the alarm, other than percentile. For percentile statistics, use `ExtendedStatistic` .
     *
     * For an alarm based on a metric, you must specify either `Statistic` or `ExtendedStatistic` but not both.
     *
     * For an alarm based on a math expression, you can't specify `Statistic` . Instead, you use `Metrics` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-statistic
     */
    readonly statistic?: string;

    /**
     * The value to compare with the specified statistic.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-threshold
     */
    readonly threshold?: number;

    /**
     * In an alarm based on an anomaly detection model, this is the ID of the `ANOMALY_DETECTION_BAND` function used as the threshold for the alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-dynamic-threshold
     */
    readonly thresholdMetricId?: string;

    /**
     * Sets how this alarm is to handle missing data points. Valid values are `breaching` , `notBreaching` , `ignore` , and `missing` . For more information, see [Configuring How CloudWatch Alarms Treat Missing Data](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-and-missing-data) in the *Amazon CloudWatch User Guide* .
     *
     * If you omit this parameter, the default behavior of `missing` is used.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-treatmissingdata
     */
    readonly treatMissingData?: string;

    /**
     * The unit of the metric associated with the alarm. Specify this only if you are creating an alarm based on a single metric. Do not specify this if you are specifying a `Metrics` array.
     *
     * You can specify the following values: Seconds, Microseconds, Milliseconds, Bytes, Kilobytes, Megabytes, Gigabytes, Terabytes, Bits, Kilobits, Megabits, Gigabits, Terabits, Percent, Count, Bytes/Second, Kilobytes/Second, Megabytes/Second, Gigabytes/Second, Terabytes/Second, Bits/Second, Kilobits/Second, Megabits/Second, Gigabits/Second, Terabits/Second, Count/Second, or None.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-unit
     */
    readonly unit?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAlarmProps`
 *
 * @param properties - the TypeScript properties of a `CfnAlarmProps`
 *
 * @returns the result of the validation.
 */
function CfnAlarmPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionsEnabled', cdk.validateBoolean)(properties.actionsEnabled));
    errors.collect(cdk.propertyValidator('alarmActions', cdk.listValidator(cdk.validateString))(properties.alarmActions));
    errors.collect(cdk.propertyValidator('alarmDescription', cdk.validateString)(properties.alarmDescription));
    errors.collect(cdk.propertyValidator('alarmName', cdk.validateString)(properties.alarmName));
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.requiredValidator)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.validateString)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('datapointsToAlarm', cdk.validateNumber)(properties.datapointsToAlarm));
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnAlarm_DimensionPropertyValidator))(properties.dimensions));
    errors.collect(cdk.propertyValidator('evaluateLowSampleCountPercentile', cdk.validateString)(properties.evaluateLowSampleCountPercentile));
    errors.collect(cdk.propertyValidator('evaluationPeriods', cdk.requiredValidator)(properties.evaluationPeriods));
    errors.collect(cdk.propertyValidator('evaluationPeriods', cdk.validateNumber)(properties.evaluationPeriods));
    errors.collect(cdk.propertyValidator('extendedStatistic', cdk.validateString)(properties.extendedStatistic));
    errors.collect(cdk.propertyValidator('insufficientDataActions', cdk.listValidator(cdk.validateString))(properties.insufficientDataActions));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('metrics', cdk.listValidator(CfnAlarm_MetricDataQueryPropertyValidator))(properties.metrics));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    errors.collect(cdk.propertyValidator('okActions', cdk.listValidator(cdk.validateString))(properties.okActions));
    errors.collect(cdk.propertyValidator('period', cdk.validateNumber)(properties.period));
    errors.collect(cdk.propertyValidator('statistic', cdk.validateString)(properties.statistic));
    errors.collect(cdk.propertyValidator('threshold', cdk.validateNumber)(properties.threshold));
    errors.collect(cdk.propertyValidator('thresholdMetricId', cdk.validateString)(properties.thresholdMetricId));
    errors.collect(cdk.propertyValidator('treatMissingData', cdk.validateString)(properties.treatMissingData));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "CfnAlarmProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::Alarm` resource
 *
 * @param properties - the TypeScript properties of a `CfnAlarmProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::Alarm` resource.
 */
// @ts-ignore TS6133
function cfnAlarmPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlarmPropsValidator(properties).assertSuccess();
    return {
        ComparisonOperator: cdk.stringToCloudFormation(properties.comparisonOperator),
        EvaluationPeriods: cdk.numberToCloudFormation(properties.evaluationPeriods),
        ActionsEnabled: cdk.booleanToCloudFormation(properties.actionsEnabled),
        AlarmActions: cdk.listMapper(cdk.stringToCloudFormation)(properties.alarmActions),
        AlarmDescription: cdk.stringToCloudFormation(properties.alarmDescription),
        AlarmName: cdk.stringToCloudFormation(properties.alarmName),
        DatapointsToAlarm: cdk.numberToCloudFormation(properties.datapointsToAlarm),
        Dimensions: cdk.listMapper(cfnAlarmDimensionPropertyToCloudFormation)(properties.dimensions),
        EvaluateLowSampleCountPercentile: cdk.stringToCloudFormation(properties.evaluateLowSampleCountPercentile),
        ExtendedStatistic: cdk.stringToCloudFormation(properties.extendedStatistic),
        InsufficientDataActions: cdk.listMapper(cdk.stringToCloudFormation)(properties.insufficientDataActions),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Metrics: cdk.listMapper(cfnAlarmMetricDataQueryPropertyToCloudFormation)(properties.metrics),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
        OKActions: cdk.listMapper(cdk.stringToCloudFormation)(properties.okActions),
        Period: cdk.numberToCloudFormation(properties.period),
        Statistic: cdk.stringToCloudFormation(properties.statistic),
        Threshold: cdk.numberToCloudFormation(properties.threshold),
        ThresholdMetricId: cdk.stringToCloudFormation(properties.thresholdMetricId),
        TreatMissingData: cdk.stringToCloudFormation(properties.treatMissingData),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnAlarmPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmProps>();
    ret.addPropertyResult('comparisonOperator', 'ComparisonOperator', cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator));
    ret.addPropertyResult('evaluationPeriods', 'EvaluationPeriods', cfn_parse.FromCloudFormation.getNumber(properties.EvaluationPeriods));
    ret.addPropertyResult('actionsEnabled', 'ActionsEnabled', properties.ActionsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ActionsEnabled) : undefined);
    ret.addPropertyResult('alarmActions', 'AlarmActions', properties.AlarmActions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AlarmActions) : undefined);
    ret.addPropertyResult('alarmDescription', 'AlarmDescription', properties.AlarmDescription != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmDescription) : undefined);
    ret.addPropertyResult('alarmName', 'AlarmName', properties.AlarmName != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmName) : undefined);
    ret.addPropertyResult('datapointsToAlarm', 'DatapointsToAlarm', properties.DatapointsToAlarm != null ? cfn_parse.FromCloudFormation.getNumber(properties.DatapointsToAlarm) : undefined);
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnAlarmDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined);
    ret.addPropertyResult('evaluateLowSampleCountPercentile', 'EvaluateLowSampleCountPercentile', properties.EvaluateLowSampleCountPercentile != null ? cfn_parse.FromCloudFormation.getString(properties.EvaluateLowSampleCountPercentile) : undefined);
    ret.addPropertyResult('extendedStatistic', 'ExtendedStatistic', properties.ExtendedStatistic != null ? cfn_parse.FromCloudFormation.getString(properties.ExtendedStatistic) : undefined);
    ret.addPropertyResult('insufficientDataActions', 'InsufficientDataActions', properties.InsufficientDataActions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.InsufficientDataActions) : undefined);
    ret.addPropertyResult('metricName', 'MetricName', properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined);
    ret.addPropertyResult('metrics', 'Metrics', properties.Metrics != null ? cfn_parse.FromCloudFormation.getArray(CfnAlarmMetricDataQueryPropertyFromCloudFormation)(properties.Metrics) : undefined);
    ret.addPropertyResult('namespace', 'Namespace', properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined);
    ret.addPropertyResult('okActions', 'OKActions', properties.OKActions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OKActions) : undefined);
    ret.addPropertyResult('period', 'Period', properties.Period != null ? cfn_parse.FromCloudFormation.getNumber(properties.Period) : undefined);
    ret.addPropertyResult('statistic', 'Statistic', properties.Statistic != null ? cfn_parse.FromCloudFormation.getString(properties.Statistic) : undefined);
    ret.addPropertyResult('threshold', 'Threshold', properties.Threshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.Threshold) : undefined);
    ret.addPropertyResult('thresholdMetricId', 'ThresholdMetricId', properties.ThresholdMetricId != null ? cfn_parse.FromCloudFormation.getString(properties.ThresholdMetricId) : undefined);
    ret.addPropertyResult('treatMissingData', 'TreatMissingData', properties.TreatMissingData != null ? cfn_parse.FromCloudFormation.getString(properties.TreatMissingData) : undefined);
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CloudWatch::Alarm`
 *
 * The `AWS::CloudWatch::Alarm` type specifies an alarm and associates it with the specified metric or metric math expression.
 *
 * When this operation creates an alarm, the alarm state is immediately set to `INSUFFICIENT_DATA` . The alarm is then evaluated and its state is set appropriately. Any actions associated with the new state are then executed.
 *
 * When you update an existing alarm, its state is left unchanged, but the update completely overwrites the previous configuration of the alarm.
 *
 * @cloudformationResource AWS::CloudWatch::Alarm
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html
 */
export class CfnAlarm extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudWatch::Alarm";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAlarm {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAlarmPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAlarm(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the CloudWatch alarm, such as `arn:aws:cloudwatch:us-west-2:123456789012:alarm:myCloudWatchAlarm-CPUAlarm-UXMMZK36R55Z` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The arithmetic operation to use when comparing the specified statistic and threshold. The specified statistic value is used as the first operand.
     *
     * You can specify the following values: `GreaterThanThreshold` , `GreaterThanOrEqualToThreshold` , `LessThanThreshold` , or `LessThanOrEqualToThreshold` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-comparisonoperator
     */
    public comparisonOperator: string;

    /**
     * The number of periods over which data is compared to the specified threshold. If you are setting an alarm that requires that a number of consecutive data points be breaching to trigger the alarm, this value specifies that number. If you are setting an "M out of N" alarm, this value is the N, and `DatapointsToAlarm` is the M.
     *
     * For more information, see [Evaluating an Alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation) in the *Amazon CloudWatch User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-evaluationperiods
     */
    public evaluationPeriods: number;

    /**
     * Indicates whether actions should be executed during any changes to the alarm state. The default is TRUE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-actionsenabled
     */
    public actionsEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The list of actions to execute when this alarm transitions into an ALARM state from any other state. Specify each action as an Amazon Resource Name (ARN). For more information about creating alarms and the actions that you can specify, see [PutMetricAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html) in the *Amazon CloudWatch API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-alarmactions
     */
    public alarmActions: string[] | undefined;

    /**
     * The description of the alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-alarmdescription
     */
    public alarmDescription: string | undefined;

    /**
     * The name of the alarm. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the alarm name.
     *
     * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-alarmname
     */
    public alarmName: string | undefined;

    /**
     * The number of datapoints that must be breaching to trigger the alarm. This is used only if you are setting an "M out of N" alarm. In that case, this value is the M, and the value that you set for `EvaluationPeriods` is the N value. For more information, see [Evaluating an Alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation) in the *Amazon CloudWatch User Guide* .
     *
     * If you omit this parameter, CloudWatch uses the same value here that you set for `EvaluationPeriods` , and the alarm goes to alarm state if that many consecutive periods are breaching.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarm-datapointstoalarm
     */
    public datapointsToAlarm: number | undefined;

    /**
     * The dimensions for the metric associated with the alarm. For an alarm based on a math expression, you can't specify `Dimensions` . Instead, you use `Metrics` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-dimension
     */
    public dimensions: Array<CfnAlarm.DimensionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Used only for alarms based on percentiles. If `ignore` , the alarm state does not change during periods with too few data points to be statistically significant. If `evaluate` or this parameter is not used, the alarm is always evaluated and possibly changes state no matter how many data points are available.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-evaluatelowsamplecountpercentile
     */
    public evaluateLowSampleCountPercentile: string | undefined;

    /**
     * The percentile statistic for the metric associated with the alarm. Specify a value between p0.0 and p100.
     *
     * For an alarm based on a metric, you must specify either `Statistic` or `ExtendedStatistic` but not both.
     *
     * For an alarm based on a math expression, you can't specify `ExtendedStatistic` . Instead, you use `Metrics` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-extendedstatistic
     */
    public extendedStatistic: string | undefined;

    /**
     * The actions to execute when this alarm transitions to the `INSUFFICIENT_DATA` state from any other state. Each action is specified as an Amazon Resource Name (ARN).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-insufficientdataactions
     */
    public insufficientDataActions: string[] | undefined;

    /**
     * The name of the metric associated with the alarm. This is required for an alarm based on a metric. For an alarm based on a math expression, you use `Metrics` instead and you can't specify `MetricName` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-metricname
     */
    public metricName: string | undefined;

    /**
     * An array that enables you to create an alarm based on the result of a metric math expression. Each item in the array either retrieves a metric or performs a math expression.
     *
     * If you specify the `Metrics` parameter, you cannot specify `MetricName` , `Dimensions` , `Period` , `Namespace` , `Statistic` , `ExtendedStatistic` , or `Unit` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarm-metrics
     */
    public metrics: Array<CfnAlarm.MetricDataQueryProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The namespace of the metric associated with the alarm. This is required for an alarm based on a metric. For an alarm based on a math expression, you can't specify `Namespace` and you use `Metrics` instead.
     *
     * For a list of namespaces for metrics from AWS services, see [AWS Services That Publish CloudWatch Metrics.](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-namespace
     */
    public namespace: string | undefined;

    /**
     * The actions to execute when this alarm transitions to the `OK` state from any other state. Each action is specified as an Amazon Resource Name (ARN).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-okactions
     */
    public okActions: string[] | undefined;

    /**
     * The period, in seconds, over which the statistic is applied. This is required for an alarm based on a metric. Valid values are 10, 30, 60, and any multiple of 60.
     *
     * For an alarm based on a math expression, you can't specify `Period` , and instead you use the `Metrics` parameter.
     *
     * *Minimum:* 10
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-period
     */
    public period: number | undefined;

    /**
     * The statistic for the metric associated with the alarm, other than percentile. For percentile statistics, use `ExtendedStatistic` .
     *
     * For an alarm based on a metric, you must specify either `Statistic` or `ExtendedStatistic` but not both.
     *
     * For an alarm based on a math expression, you can't specify `Statistic` . Instead, you use `Metrics` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-statistic
     */
    public statistic: string | undefined;

    /**
     * The value to compare with the specified statistic.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-threshold
     */
    public threshold: number | undefined;

    /**
     * In an alarm based on an anomaly detection model, this is the ID of the `ANOMALY_DETECTION_BAND` function used as the threshold for the alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-dynamic-threshold
     */
    public thresholdMetricId: string | undefined;

    /**
     * Sets how this alarm is to handle missing data points. Valid values are `breaching` , `notBreaching` , `ignore` , and `missing` . For more information, see [Configuring How CloudWatch Alarms Treat Missing Data](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-and-missing-data) in the *Amazon CloudWatch User Guide* .
     *
     * If you omit this parameter, the default behavior of `missing` is used.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-treatmissingdata
     */
    public treatMissingData: string | undefined;

    /**
     * The unit of the metric associated with the alarm. Specify this only if you are creating an alarm based on a single metric. Do not specify this if you are specifying a `Metrics` array.
     *
     * You can specify the following values: Seconds, Microseconds, Milliseconds, Bytes, Kilobytes, Megabytes, Gigabytes, Terabytes, Bits, Kilobits, Megabits, Gigabits, Terabits, Percent, Count, Bytes/Second, Kilobytes/Second, Megabytes/Second, Gigabytes/Second, Terabytes/Second, Bits/Second, Kilobits/Second, Megabits/Second, Gigabits/Second, Terabits/Second, Count/Second, or None.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html#cfn-cloudwatch-alarms-unit
     */
    public unit: string | undefined;

    /**
     * Create a new `AWS::CloudWatch::Alarm`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAlarmProps) {
        super(scope, id, { type: CfnAlarm.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'comparisonOperator', this);
        cdk.requireProperty(props, 'evaluationPeriods', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.comparisonOperator = props.comparisonOperator;
        this.evaluationPeriods = props.evaluationPeriods;
        this.actionsEnabled = props.actionsEnabled;
        this.alarmActions = props.alarmActions;
        this.alarmDescription = props.alarmDescription;
        this.alarmName = props.alarmName;
        this.datapointsToAlarm = props.datapointsToAlarm;
        this.dimensions = props.dimensions;
        this.evaluateLowSampleCountPercentile = props.evaluateLowSampleCountPercentile;
        this.extendedStatistic = props.extendedStatistic;
        this.insufficientDataActions = props.insufficientDataActions;
        this.metricName = props.metricName;
        this.metrics = props.metrics;
        this.namespace = props.namespace;
        this.okActions = props.okActions;
        this.period = props.period;
        this.statistic = props.statistic;
        this.threshold = props.threshold;
        this.thresholdMetricId = props.thresholdMetricId;
        this.treatMissingData = props.treatMissingData;
        this.unit = props.unit;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAlarm.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            comparisonOperator: this.comparisonOperator,
            evaluationPeriods: this.evaluationPeriods,
            actionsEnabled: this.actionsEnabled,
            alarmActions: this.alarmActions,
            alarmDescription: this.alarmDescription,
            alarmName: this.alarmName,
            datapointsToAlarm: this.datapointsToAlarm,
            dimensions: this.dimensions,
            evaluateLowSampleCountPercentile: this.evaluateLowSampleCountPercentile,
            extendedStatistic: this.extendedStatistic,
            insufficientDataActions: this.insufficientDataActions,
            metricName: this.metricName,
            metrics: this.metrics,
            namespace: this.namespace,
            okActions: this.okActions,
            period: this.period,
            statistic: this.statistic,
            threshold: this.threshold,
            thresholdMetricId: this.thresholdMetricId,
            treatMissingData: this.treatMissingData,
            unit: this.unit,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAlarmPropsToCloudFormation(props);
    }
}

export namespace CfnAlarm {
    /**
     * Dimension is an embedded property of the `AWS::CloudWatch::Alarm` type. Dimensions are name/value pairs that can be associated with a CloudWatch metric. You can specify a maximum of 10 dimensions for a given metric.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cw-dimension.html
     */
    export interface DimensionProperty {
        /**
         * The name of the dimension, from 1–255 characters in length. This dimension name must have been included when the metric was published.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cw-dimension.html#cfn-cloudwatch-alarm-dimension-name
         */
        readonly name: string;
        /**
         * The value for the dimension, from 1–255 characters in length.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cw-dimension.html#cfn-cloudwatch-alarm-dimension-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `DimensionProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnAlarm_DimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "DimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::Alarm.Dimension` resource
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::Alarm.Dimension` resource.
 */
// @ts-ignore TS6133
function cfnAlarmDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlarm_DimensionPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnAlarmDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarm.DimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarm.DimensionProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAlarm {
    /**
     * The `Metric` property type represents a specific metric. `Metric` is a property of the [MetricStat](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricstat.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metric.html
     */
    export interface MetricProperty {
        /**
         * The metric dimensions that you want to be used for the metric that the alarm will watch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metric.html#cfn-cloudwatch-alarm-metric-dimensions
         */
        readonly dimensions?: Array<CfnAlarm.DimensionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the metric that you want the alarm to watch. This is a required field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metric.html#cfn-cloudwatch-alarm-metric-metricname
         */
        readonly metricName?: string;
        /**
         * The namespace of the metric that the alarm will watch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metric.html#cfn-cloudwatch-alarm-metric-namespace
         */
        readonly namespace?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetricProperty`
 *
 * @param properties - the TypeScript properties of a `MetricProperty`
 *
 * @returns the result of the validation.
 */
function CfnAlarm_MetricPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnAlarm_DimensionPropertyValidator))(properties.dimensions));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    return errors.wrap('supplied properties not correct for "MetricProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::Alarm.Metric` resource
 *
 * @param properties - the TypeScript properties of a `MetricProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::Alarm.Metric` resource.
 */
// @ts-ignore TS6133
function cfnAlarmMetricPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlarm_MetricPropertyValidator(properties).assertSuccess();
    return {
        Dimensions: cdk.listMapper(cfnAlarmDimensionPropertyToCloudFormation)(properties.dimensions),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
    };
}

// @ts-ignore TS6133
function CfnAlarmMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarm.MetricProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarm.MetricProperty>();
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnAlarmDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined);
    ret.addPropertyResult('metricName', 'MetricName', properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined);
    ret.addPropertyResult('namespace', 'Namespace', properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAlarm {
    /**
     * The `MetricDataQuery` property type specifies the metric data to return, and whether this call is just retrieving a batch set of data for one metric, or is performing a math expression on metric data.
     *
     * Any expression used must return a single time series. For more information, see [Metric Math Syntax and Functions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html#metric-math-syntax) in the *Amazon CloudWatch User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricdataquery.html
     */
    export interface MetricDataQueryProperty {
        /**
         * The ID of the account where the metrics are located, if this is a cross-account alarm.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricdataquery.html#cfn-cloudwatch-alarm-metricdataquery-accountid
         */
        readonly accountId?: string;
        /**
         * The math expression to be performed on the returned data, if this object is performing a math expression. This expression can use the `Id` of the other metrics to refer to those metrics, and can also use the `Id` of other expressions to use the result of those expressions. For more information about metric math expressions, see [Metric Math Syntax and Functions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html#metric-math-syntax) in the *Amazon CloudWatch User Guide* .
         *
         * Within each MetricDataQuery object, you must specify either `Expression` or `MetricStat` but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricdataquery.html#cfn-cloudwatch-alarm-metricdataquery-expression
         */
        readonly expression?: string;
        /**
         * A short name used to tie this object to the results in the response. This name must be unique within a single call to `GetMetricData` . If you are performing math expressions on this set of data, this name represents that data and can serve as a variable in the mathematical expression. The valid characters are letters, numbers, and underscore. The first character must be a lowercase letter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricdataquery.html#cfn-cloudwatch-alarm-metricdataquery-id
         */
        readonly id: string;
        /**
         * A human-readable label for this metric or expression. This is especially useful if this is an expression, so that you know what the value represents. If the metric or expression is shown in a CloudWatch dashboard widget, the label is shown. If `Label` is omitted, CloudWatch generates a default.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricdataquery.html#cfn-cloudwatch-alarm-metricdataquery-label
         */
        readonly label?: string;
        /**
         * The metric to be returned, along with statistics, period, and units. Use this parameter only if this object is retrieving a metric and not performing a math expression on returned data.
         *
         * Within one MetricDataQuery object, you must specify either `Expression` or `MetricStat` but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricdataquery.html#cfn-cloudwatch-alarm-metricdataquery-metricstat
         */
        readonly metricStat?: CfnAlarm.MetricStatProperty | cdk.IResolvable;
        /**
         * The granularity, in seconds, of the returned data points. For metrics with regular resolution, a period can be as short as one minute (60 seconds) and must be a multiple of 60. For high-resolution metrics that are collected at intervals of less than one minute, the period can be 1, 5, 10, 30, 60, or any multiple of 60. High-resolution metrics are those metrics stored by a `PutMetricData` operation that includes a `StorageResolution of 1 second` .
         */
        readonly period?: number;
        /**
         * This option indicates whether to return the timestamps and raw data values of this metric.
         *
         * When you create an alarm based on a metric math expression, specify `True` for this value for only the one math expression that the alarm is based on. You must specify `False` for `ReturnData` for all the other metrics and expressions used in the alarm.
         *
         * This field is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricdataquery.html#cfn-cloudwatch-alarm-metricdataquery-returndata
         */
        readonly returnData?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MetricDataQueryProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDataQueryProperty`
 *
 * @returns the result of the validation.
 */
function CfnAlarm_MetricDataQueryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountId', cdk.validateString)(properties.accountId));
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('label', cdk.validateString)(properties.label));
    errors.collect(cdk.propertyValidator('metricStat', CfnAlarm_MetricStatPropertyValidator)(properties.metricStat));
    errors.collect(cdk.propertyValidator('period', cdk.validateNumber)(properties.period));
    errors.collect(cdk.propertyValidator('returnData', cdk.validateBoolean)(properties.returnData));
    return errors.wrap('supplied properties not correct for "MetricDataQueryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::Alarm.MetricDataQuery` resource
 *
 * @param properties - the TypeScript properties of a `MetricDataQueryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::Alarm.MetricDataQuery` resource.
 */
// @ts-ignore TS6133
function cfnAlarmMetricDataQueryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlarm_MetricDataQueryPropertyValidator(properties).assertSuccess();
    return {
        AccountId: cdk.stringToCloudFormation(properties.accountId),
        Expression: cdk.stringToCloudFormation(properties.expression),
        Id: cdk.stringToCloudFormation(properties.id),
        Label: cdk.stringToCloudFormation(properties.label),
        MetricStat: cfnAlarmMetricStatPropertyToCloudFormation(properties.metricStat),
        Period: cdk.numberToCloudFormation(properties.period),
        ReturnData: cdk.booleanToCloudFormation(properties.returnData),
    };
}

// @ts-ignore TS6133
function CfnAlarmMetricDataQueryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarm.MetricDataQueryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarm.MetricDataQueryProperty>();
    ret.addPropertyResult('accountId', 'AccountId', properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined);
    ret.addPropertyResult('expression', 'Expression', properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined);
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('label', 'Label', properties.Label != null ? cfn_parse.FromCloudFormation.getString(properties.Label) : undefined);
    ret.addPropertyResult('metricStat', 'MetricStat', properties.MetricStat != null ? CfnAlarmMetricStatPropertyFromCloudFormation(properties.MetricStat) : undefined);
    ret.addPropertyResult('period', 'Period', properties.Period != null ? cfn_parse.FromCloudFormation.getNumber(properties.Period) : undefined);
    ret.addPropertyResult('returnData', 'ReturnData', properties.ReturnData != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReturnData) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAlarm {
    /**
     * This structure defines the metric to be returned, along with the statistics, period, and units.
     *
     * `MetricStat` is a property of the [MetricDataQuery](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricdataquery.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricstat.html
     */
    export interface MetricStatProperty {
        /**
         * The metric to return, including the metric name, namespace, and dimensions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricstat.html#cfn-cloudwatch-alarm-metricstat-metric
         */
        readonly metric: CfnAlarm.MetricProperty | cdk.IResolvable;
        /**
         * The granularity, in seconds, of the returned data points. For metrics with regular resolution, a period can be as short as one minute (60 seconds) and must be a multiple of 60. For high-resolution metrics that are collected at intervals of less than one minute, the period can be 1, 5, 10, 30, 60, or any multiple of 60. High-resolution metrics are those metrics stored by a `PutMetricData` call that includes a `StorageResolution` of 1 second.
         *
         * If the `StartTime` parameter specifies a time stamp that is greater than 3 hours ago, you must specify the period as follows or no data points in that time range is returned:
         *
         * - Start time between 3 hours and 15 days ago - Use a multiple of 60 seconds (1 minute).
         * - Start time between 15 and 63 days ago - Use a multiple of 300 seconds (5 minutes).
         * - Start time greater than 63 days ago - Use a multiple of 3600 seconds (1 hour).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricstat.html#cfn-cloudwatch-alarm-metricstat-period
         */
        readonly period: number;
        /**
         * The statistic to return. It can include any CloudWatch statistic or extended statistic. For a list of valid values, see the table in [Statistics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Statistic) in the *Amazon CloudWatch User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricstat.html#cfn-cloudwatch-alarm-metricstat-stat
         */
        readonly stat: string;
        /**
         * The unit to use for the returned data points.
         *
         * Valid values are: Seconds, Microseconds, Milliseconds, Bytes, Kilobytes, Megabytes, Gigabytes, Terabytes, Bits, Kilobits, Megabits, Gigabits, Terabits, Percent, Count, Bytes/Second, Kilobytes/Second, Megabytes/Second, Gigabytes/Second, Terabytes/Second, Bits/Second, Kilobits/Second, Megabits/Second, Gigabits/Second, Terabits/Second, Count/Second, or None.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metricstat.html#cfn-cloudwatch-alarm-metricstat-unit
         */
        readonly unit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetricStatProperty`
 *
 * @param properties - the TypeScript properties of a `MetricStatProperty`
 *
 * @returns the result of the validation.
 */
function CfnAlarm_MetricStatPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('metric', cdk.requiredValidator)(properties.metric));
    errors.collect(cdk.propertyValidator('metric', CfnAlarm_MetricPropertyValidator)(properties.metric));
    errors.collect(cdk.propertyValidator('period', cdk.requiredValidator)(properties.period));
    errors.collect(cdk.propertyValidator('period', cdk.validateNumber)(properties.period));
    errors.collect(cdk.propertyValidator('stat', cdk.requiredValidator)(properties.stat));
    errors.collect(cdk.propertyValidator('stat', cdk.validateString)(properties.stat));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "MetricStatProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::Alarm.MetricStat` resource
 *
 * @param properties - the TypeScript properties of a `MetricStatProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::Alarm.MetricStat` resource.
 */
// @ts-ignore TS6133
function cfnAlarmMetricStatPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlarm_MetricStatPropertyValidator(properties).assertSuccess();
    return {
        Metric: cfnAlarmMetricPropertyToCloudFormation(properties.metric),
        Period: cdk.numberToCloudFormation(properties.period),
        Stat: cdk.stringToCloudFormation(properties.stat),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnAlarmMetricStatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarm.MetricStatProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarm.MetricStatProperty>();
    ret.addPropertyResult('metric', 'Metric', CfnAlarmMetricPropertyFromCloudFormation(properties.Metric));
    ret.addPropertyResult('period', 'Period', cfn_parse.FromCloudFormation.getNumber(properties.Period));
    ret.addPropertyResult('stat', 'Stat', cfn_parse.FromCloudFormation.getString(properties.Stat));
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnAnomalyDetector`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html
 */
export interface CfnAnomalyDetectorProps {

    /**
     * Specifies details about how the anomaly detection model is to be trained, including time ranges to exclude when training and updating the model. The configuration can also include the time zone to use for the metric.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-configuration
     */
    readonly configuration?: CfnAnomalyDetector.ConfigurationProperty | cdk.IResolvable;

    /**
     * The dimensions of the metric associated with the anomaly detection band.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-dimensions
     */
    readonly dimensions?: Array<CfnAnomalyDetector.DimensionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The CloudWatch metric math expression for this anomaly detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-metricmathanomalydetector
     */
    readonly metricMathAnomalyDetector?: CfnAnomalyDetector.MetricMathAnomalyDetectorProperty | cdk.IResolvable;

    /**
     * The name of the metric associated with the anomaly detection band.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-metricname
     */
    readonly metricName?: string;

    /**
     * The namespace of the metric associated with the anomaly detection band.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-namespace
     */
    readonly namespace?: string;

    /**
     * The CloudWatch metric and statistic for this anomaly detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-singlemetricanomalydetector
     */
    readonly singleMetricAnomalyDetector?: CfnAnomalyDetector.SingleMetricAnomalyDetectorProperty | cdk.IResolvable;

    /**
     * The statistic of the metric associated with the anomaly detection band.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-stat
     */
    readonly stat?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAnomalyDetectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnAnomalyDetectorProps`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetectorPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configuration', CfnAnomalyDetector_ConfigurationPropertyValidator)(properties.configuration));
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnAnomalyDetector_DimensionPropertyValidator))(properties.dimensions));
    errors.collect(cdk.propertyValidator('metricMathAnomalyDetector', CfnAnomalyDetector_MetricMathAnomalyDetectorPropertyValidator)(properties.metricMathAnomalyDetector));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    errors.collect(cdk.propertyValidator('singleMetricAnomalyDetector', CfnAnomalyDetector_SingleMetricAnomalyDetectorPropertyValidator)(properties.singleMetricAnomalyDetector));
    errors.collect(cdk.propertyValidator('stat', cdk.validateString)(properties.stat));
    return errors.wrap('supplied properties not correct for "CfnAnomalyDetectorProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector` resource
 *
 * @param properties - the TypeScript properties of a `CfnAnomalyDetectorProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetectorPropsValidator(properties).assertSuccess();
    return {
        Configuration: cfnAnomalyDetectorConfigurationPropertyToCloudFormation(properties.configuration),
        Dimensions: cdk.listMapper(cfnAnomalyDetectorDimensionPropertyToCloudFormation)(properties.dimensions),
        MetricMathAnomalyDetector: cfnAnomalyDetectorMetricMathAnomalyDetectorPropertyToCloudFormation(properties.metricMathAnomalyDetector),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
        SingleMetricAnomalyDetector: cfnAnomalyDetectorSingleMetricAnomalyDetectorPropertyToCloudFormation(properties.singleMetricAnomalyDetector),
        Stat: cdk.stringToCloudFormation(properties.stat),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetectorProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetectorProps>();
    ret.addPropertyResult('configuration', 'Configuration', properties.Configuration != null ? CfnAnomalyDetectorConfigurationPropertyFromCloudFormation(properties.Configuration) : undefined);
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalyDetectorDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined);
    ret.addPropertyResult('metricMathAnomalyDetector', 'MetricMathAnomalyDetector', properties.MetricMathAnomalyDetector != null ? CfnAnomalyDetectorMetricMathAnomalyDetectorPropertyFromCloudFormation(properties.MetricMathAnomalyDetector) : undefined);
    ret.addPropertyResult('metricName', 'MetricName', properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined);
    ret.addPropertyResult('namespace', 'Namespace', properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined);
    ret.addPropertyResult('singleMetricAnomalyDetector', 'SingleMetricAnomalyDetector', properties.SingleMetricAnomalyDetector != null ? CfnAnomalyDetectorSingleMetricAnomalyDetectorPropertyFromCloudFormation(properties.SingleMetricAnomalyDetector) : undefined);
    ret.addPropertyResult('stat', 'Stat', properties.Stat != null ? cfn_parse.FromCloudFormation.getString(properties.Stat) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CloudWatch::AnomalyDetector`
 *
 * The `AWS::CloudWatch::AnomalyDetector` type specifies an anomaly detection band for a certain metric and statistic. The band represents the expected "normal" range for the metric values. Anomaly detection bands can be used for visualization of a metric's expected values, and for alarms.
 *
 * @cloudformationResource AWS::CloudWatch::AnomalyDetector
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html
 */
export class CfnAnomalyDetector extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudWatch::AnomalyDetector";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnomalyDetector {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAnomalyDetectorPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAnomalyDetector(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Specifies details about how the anomaly detection model is to be trained, including time ranges to exclude when training and updating the model. The configuration can also include the time zone to use for the metric.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-configuration
     */
    public configuration: CfnAnomalyDetector.ConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The dimensions of the metric associated with the anomaly detection band.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-dimensions
     */
    public dimensions: Array<CfnAnomalyDetector.DimensionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The CloudWatch metric math expression for this anomaly detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-metricmathanomalydetector
     */
    public metricMathAnomalyDetector: CfnAnomalyDetector.MetricMathAnomalyDetectorProperty | cdk.IResolvable | undefined;

    /**
     * The name of the metric associated with the anomaly detection band.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-metricname
     */
    public metricName: string | undefined;

    /**
     * The namespace of the metric associated with the anomaly detection band.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-namespace
     */
    public namespace: string | undefined;

    /**
     * The CloudWatch metric and statistic for this anomaly detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-singlemetricanomalydetector
     */
    public singleMetricAnomalyDetector: CfnAnomalyDetector.SingleMetricAnomalyDetectorProperty | cdk.IResolvable | undefined;

    /**
     * The statistic of the metric associated with the anomaly detection band.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-anomalydetector.html#cfn-cloudwatch-anomalydetector-stat
     */
    public stat: string | undefined;

    /**
     * Create a new `AWS::CloudWatch::AnomalyDetector`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAnomalyDetectorProps = {}) {
        super(scope, id, { type: CfnAnomalyDetector.CFN_RESOURCE_TYPE_NAME, properties: props });

        this.configuration = props.configuration;
        this.dimensions = props.dimensions;
        this.metricMathAnomalyDetector = props.metricMathAnomalyDetector;
        this.metricName = props.metricName;
        this.namespace = props.namespace;
        this.singleMetricAnomalyDetector = props.singleMetricAnomalyDetector;
        this.stat = props.stat;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAnomalyDetector.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            configuration: this.configuration,
            dimensions: this.dimensions,
            metricMathAnomalyDetector: this.metricMathAnomalyDetector,
            metricName: this.metricName,
            namespace: this.namespace,
            singleMetricAnomalyDetector: this.singleMetricAnomalyDetector,
            stat: this.stat,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAnomalyDetectorPropsToCloudFormation(props);
    }
}

export namespace CfnAnomalyDetector {
    /**
     * Specifies details about how the anomaly detection model is to be trained, including time ranges to exclude when training and updating the model. The configuration can also include the time zone to use for the metric.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-configuration.html
     */
    export interface ConfigurationProperty {
        /**
         * Specifies an array of time ranges to exclude from use when the anomaly detection model is trained and updated. Use this to make sure that events that could cause unusual values for the metric, such as deployments, aren't used when CloudWatch creates or updates the model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-configuration.html#cfn-cloudwatch-anomalydetector-configuration-excludedtimeranges
         */
        readonly excludedTimeRanges?: Array<CfnAnomalyDetector.RangeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The time zone to use for the metric. This is useful to enable the model to automatically account for daylight savings time changes if the metric is sensitive to such time changes.
         *
         * To specify a time zone, use the name of the time zone as specified in the standard tz database. For more information, see [tz database](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Tz_database) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-configuration.html#cfn-cloudwatch-anomalydetector-configuration-metrictimezone
         */
        readonly metricTimeZone?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('excludedTimeRanges', cdk.listValidator(CfnAnomalyDetector_RangePropertyValidator))(properties.excludedTimeRanges));
    errors.collect(cdk.propertyValidator('metricTimeZone', cdk.validateString)(properties.metricTimeZone));
    return errors.wrap('supplied properties not correct for "ConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.Configuration` resource
 *
 * @param properties - the TypeScript properties of a `ConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.Configuration` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_ConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ExcludedTimeRanges: cdk.listMapper(cfnAnomalyDetectorRangePropertyToCloudFormation)(properties.excludedTimeRanges),
        MetricTimeZone: cdk.stringToCloudFormation(properties.metricTimeZone),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.ConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.ConfigurationProperty>();
    ret.addPropertyResult('excludedTimeRanges', 'ExcludedTimeRanges', properties.ExcludedTimeRanges != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalyDetectorRangePropertyFromCloudFormation)(properties.ExcludedTimeRanges) : undefined);
    ret.addPropertyResult('metricTimeZone', 'MetricTimeZone', properties.MetricTimeZone != null ? cfn_parse.FromCloudFormation.getString(properties.MetricTimeZone) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * A dimension is a name/value pair that is part of the identity of a metric. Because dimensions are part of the unique identifier for a metric, whenever you add a unique name/value pair to one of your metrics, you are creating a new variation of that metric. For example, many Amazon EC2 metrics publish `InstanceId` as a dimension name, and the actual instance ID as the value for that dimension.
     *
     * You can assign up to 30 dimensions to a metric.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-dimension.html
     */
    export interface DimensionProperty {
        /**
         * The name of the dimension.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-dimension.html#cfn-cloudwatch-anomalydetector-dimension-name
         */
        readonly name: string;
        /**
         * The value of the dimension. Dimension values must contain only ASCII characters and must include at least one non-whitespace character. ASCII control characters are not supported as part of dimension values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-dimension.html#cfn-cloudwatch-anomalydetector-dimension-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `DimensionProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_DimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "DimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.Dimension` resource
 *
 * @param properties - the TypeScript properties of a `DimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.Dimension` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_DimensionPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.DimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.DimensionProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Represents a specific metric.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metric.html
     */
    export interface MetricProperty {
        /**
         * The dimensions for the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metric.html#cfn-cloudwatch-anomalydetector-metric-dimensions
         */
        readonly dimensions?: Array<CfnAnomalyDetector.DimensionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the metric. This is a required field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metric.html#cfn-cloudwatch-anomalydetector-metric-metricname
         */
        readonly metricName: string;
        /**
         * The namespace of the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metric.html#cfn-cloudwatch-anomalydetector-metric-namespace
         */
        readonly namespace: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetricProperty`
 *
 * @param properties - the TypeScript properties of a `MetricProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_MetricPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnAnomalyDetector_DimensionPropertyValidator))(properties.dimensions));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('namespace', cdk.requiredValidator)(properties.namespace));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    return errors.wrap('supplied properties not correct for "MetricProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.Metric` resource
 *
 * @param properties - the TypeScript properties of a `MetricProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.Metric` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorMetricPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_MetricPropertyValidator(properties).assertSuccess();
    return {
        Dimensions: cdk.listMapper(cfnAnomalyDetectorDimensionPropertyToCloudFormation)(properties.dimensions),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.MetricProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.MetricProperty>();
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalyDetectorDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined);
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('namespace', 'Namespace', cfn_parse.FromCloudFormation.getString(properties.Namespace));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * This structure is used in both `GetMetricData` and `PutMetricAlarm` . The supported use of this structure is different for those two operations.
     *
     * When used in `GetMetricData` , it indicates the metric data to return, and whether this call is just retrieving a batch set of data for one metric, or is performing a Metrics Insights query or a math expression. A single `GetMetricData` call can include up to 500 `MetricDataQuery` structures.
     *
     * When used in `PutMetricAlarm` , it enables you to create an alarm based on a metric math expression. Each `MetricDataQuery` in the array specifies either a metric to retrieve, or a math expression to be performed on retrieved metrics. A single `PutMetricAlarm` call can include up to 20 `MetricDataQuery` structures in the array. The 20 structures can include as many as 10 structures that contain a `MetricStat` parameter to retrieve a metric, and as many as 10 structures that contain the `Expression` parameter to perform a math expression. Of those `Expression` structures, one must have `true` as the value for `ReturnData` . The result of this expression is the value the alarm watches.
     *
     * Any expression used in a `PutMetricAlarm` operation must return a single time series. For more information, see [Metric Math Syntax and Functions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html#metric-math-syntax) in the *Amazon CloudWatch User Guide* .
     *
     * Some of the parameters of this structure also have different uses whether you are using this structure in a `GetMetricData` operation or a `PutMetricAlarm` operation. These differences are explained in the following parameter list.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricdataquery.html
     */
    export interface MetricDataQueryProperty {
        /**
         * The ID of the account where the metrics are located.
         *
         * If you are performing a `GetMetricData` operation in a monitoring account, use this to specify which account to retrieve this metric from.
         *
         * If you are performing a `PutMetricAlarm` operation, use this to specify which account contains the metric that the alarm is watching.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricdataquery.html#cfn-cloudwatch-anomalydetector-metricdataquery-accountid
         */
        readonly accountId?: string;
        /**
         * This field can contain either a Metrics Insights query, or a metric math expression to be performed on the returned data. For more information about Metrics Insights queries, see [Metrics Insights query components and syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-insights-querylanguage) in the *Amazon CloudWatch User Guide* .
         *
         * A math expression can use the `Id` of the other metrics or queries to refer to those metrics, and can also use the `Id` of other expressions to use the result of those expressions. For more information about metric math expressions, see [Metric Math Syntax and Functions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html#metric-math-syntax) in the *Amazon CloudWatch User Guide* .
         *
         * Within each MetricDataQuery object, you must specify either `Expression` or `MetricStat` but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricdataquery.html#cfn-cloudwatch-anomalydetector-metricdataquery-expression
         */
        readonly expression?: string;
        /**
         * A short name used to tie this object to the results in the response. This name must be unique within a single call to `GetMetricData` . If you are performing math expressions on this set of data, this name represents that data and can serve as a variable in the mathematical expression. The valid characters are letters, numbers, and underscore. The first character must be a lowercase letter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricdataquery.html#cfn-cloudwatch-anomalydetector-metricdataquery-id
         */
        readonly id: string;
        /**
         * A human-readable label for this metric or expression. This is especially useful if this is an expression, so that you know what the value represents. If the metric or expression is shown in a CloudWatch dashboard widget, the label is shown. If Label is omitted, CloudWatch generates a default.
         *
         * You can put dynamic expressions into a label, so that it is more descriptive. For more information, see [Using Dynamic Labels](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/graph-dynamic-labels.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricdataquery.html#cfn-cloudwatch-anomalydetector-metricdataquery-label
         */
        readonly label?: string;
        /**
         * The metric to be returned, along with statistics, period, and units. Use this parameter only if this object is retrieving a metric and not performing a math expression on returned data.
         *
         * Within one MetricDataQuery object, you must specify either `Expression` or `MetricStat` but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricdataquery.html#cfn-cloudwatch-anomalydetector-metricdataquery-metricstat
         */
        readonly metricStat?: CfnAnomalyDetector.MetricStatProperty | cdk.IResolvable;
        /**
         * The granularity, in seconds, of the returned data points. For metrics with regular resolution, a period can be as short as one minute (60 seconds) and must be a multiple of 60. For high-resolution metrics that are collected at intervals of less than one minute, the period can be 1, 5, 10, 30, 60, or any multiple of 60. High-resolution metrics are those metrics stored by a `PutMetricData` operation that includes a `StorageResolution of 1 second` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricdataquery.html#cfn-cloudwatch-anomalydetector-metricdataquery-period
         */
        readonly period?: number;
        /**
         * When used in `GetMetricData` , this option indicates whether to return the timestamps and raw data values of this metric. If you are performing this call just to do math expressions and do not also need the raw data returned, you can specify `false` . If you omit this, the default of `true` is used.
         *
         * When used in `PutMetricAlarm` , specify `true` for the one expression result to use as the alarm. For all other metrics and expressions in the same `PutMetricAlarm` operation, specify `ReturnData` as False.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricdataquery.html#cfn-cloudwatch-anomalydetector-metricdataquery-returndata
         */
        readonly returnData?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MetricDataQueryProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDataQueryProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_MetricDataQueryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountId', cdk.validateString)(properties.accountId));
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('label', cdk.validateString)(properties.label));
    errors.collect(cdk.propertyValidator('metricStat', CfnAnomalyDetector_MetricStatPropertyValidator)(properties.metricStat));
    errors.collect(cdk.propertyValidator('period', cdk.validateNumber)(properties.period));
    errors.collect(cdk.propertyValidator('returnData', cdk.validateBoolean)(properties.returnData));
    return errors.wrap('supplied properties not correct for "MetricDataQueryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.MetricDataQuery` resource
 *
 * @param properties - the TypeScript properties of a `MetricDataQueryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.MetricDataQuery` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorMetricDataQueryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_MetricDataQueryPropertyValidator(properties).assertSuccess();
    return {
        AccountId: cdk.stringToCloudFormation(properties.accountId),
        Expression: cdk.stringToCloudFormation(properties.expression),
        Id: cdk.stringToCloudFormation(properties.id),
        Label: cdk.stringToCloudFormation(properties.label),
        MetricStat: cfnAnomalyDetectorMetricStatPropertyToCloudFormation(properties.metricStat),
        Period: cdk.numberToCloudFormation(properties.period),
        ReturnData: cdk.booleanToCloudFormation(properties.returnData),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorMetricDataQueryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.MetricDataQueryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.MetricDataQueryProperty>();
    ret.addPropertyResult('accountId', 'AccountId', properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined);
    ret.addPropertyResult('expression', 'Expression', properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined);
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('label', 'Label', properties.Label != null ? cfn_parse.FromCloudFormation.getString(properties.Label) : undefined);
    ret.addPropertyResult('metricStat', 'MetricStat', properties.MetricStat != null ? CfnAnomalyDetectorMetricStatPropertyFromCloudFormation(properties.MetricStat) : undefined);
    ret.addPropertyResult('period', 'Period', properties.Period != null ? cfn_parse.FromCloudFormation.getNumber(properties.Period) : undefined);
    ret.addPropertyResult('returnData', 'ReturnData', properties.ReturnData != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReturnData) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Indicates the CloudWatch math expression that provides the time series the anomaly detector uses as input. The designated math expression must return a single time series.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricmathanomalydetector.html
     */
    export interface MetricMathAnomalyDetectorProperty {
        /**
         * An array of metric data query structures that enables you to create an anomaly detector based on the result of a metric math expression. Each item in `MetricDataQueries` gets a metric or performs a math expression. One item in `MetricDataQueries` is the expression that provides the time series that the anomaly detector uses as input. Designate the expression by setting `ReturnData` to `true` for this object in the array. For all other expressions and metrics, set `ReturnData` to `false` . The designated expression must return a single time series.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricmathanomalydetector.html#cfn-cloudwatch-anomalydetector-metricmathanomalydetector-metricdataqueries
         */
        readonly metricDataQueries?: Array<CfnAnomalyDetector.MetricDataQueryProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MetricMathAnomalyDetectorProperty`
 *
 * @param properties - the TypeScript properties of a `MetricMathAnomalyDetectorProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_MetricMathAnomalyDetectorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('metricDataQueries', cdk.listValidator(CfnAnomalyDetector_MetricDataQueryPropertyValidator))(properties.metricDataQueries));
    return errors.wrap('supplied properties not correct for "MetricMathAnomalyDetectorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.MetricMathAnomalyDetector` resource
 *
 * @param properties - the TypeScript properties of a `MetricMathAnomalyDetectorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.MetricMathAnomalyDetector` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorMetricMathAnomalyDetectorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_MetricMathAnomalyDetectorPropertyValidator(properties).assertSuccess();
    return {
        MetricDataQueries: cdk.listMapper(cfnAnomalyDetectorMetricDataQueryPropertyToCloudFormation)(properties.metricDataQueries),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorMetricMathAnomalyDetectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.MetricMathAnomalyDetectorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.MetricMathAnomalyDetectorProperty>();
    ret.addPropertyResult('metricDataQueries', 'MetricDataQueries', properties.MetricDataQueries != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalyDetectorMetricDataQueryPropertyFromCloudFormation)(properties.MetricDataQueries) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * This structure defines the metric to be returned, along with the statistics, period, and units.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricstat.html
     */
    export interface MetricStatProperty {
        /**
         * The metric to return, including the metric name, namespace, and dimensions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricstat.html#cfn-cloudwatch-anomalydetector-metricstat-metric
         */
        readonly metric: CfnAnomalyDetector.MetricProperty | cdk.IResolvable;
        /**
         * The granularity, in seconds, of the returned data points. For metrics with regular resolution, a period can be as short as one minute (60 seconds) and must be a multiple of 60. For high-resolution metrics that are collected at intervals of less than one minute, the period can be 1, 5, 10, 30, 60, or any multiple of 60. High-resolution metrics are those metrics stored by a `PutMetricData` call that includes a `StorageResolution` of 1 second.
         *
         * If the `StartTime` parameter specifies a time stamp that is greater than 3 hours ago, you must specify the period as follows or no data points in that time range is returned:
         *
         * - Start time between 3 hours and 15 days ago - Use a multiple of 60 seconds (1 minute).
         * - Start time between 15 and 63 days ago - Use a multiple of 300 seconds (5 minutes).
         * - Start time greater than 63 days ago - Use a multiple of 3600 seconds (1 hour).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricstat.html#cfn-cloudwatch-anomalydetector-metricstat-period
         */
        readonly period: number;
        /**
         * The statistic to return. It can include any CloudWatch statistic or extended statistic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricstat.html#cfn-cloudwatch-anomalydetector-metricstat-stat
         */
        readonly stat: string;
        /**
         * When you are using a `Put` operation, this defines what unit you want to use when storing the metric.
         *
         * In a `Get` operation, if you omit `Unit` then all data that was collected with any unit is returned, along with the corresponding units that were specified when the data was reported to CloudWatch. If you specify a unit, the operation returns only data that was collected with that unit specified. If you specify a unit that does not match the data collected, the results of the operation are null. CloudWatch does not perform unit conversions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-metricstat.html#cfn-cloudwatch-anomalydetector-metricstat-unit
         */
        readonly unit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetricStatProperty`
 *
 * @param properties - the TypeScript properties of a `MetricStatProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_MetricStatPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('metric', cdk.requiredValidator)(properties.metric));
    errors.collect(cdk.propertyValidator('metric', CfnAnomalyDetector_MetricPropertyValidator)(properties.metric));
    errors.collect(cdk.propertyValidator('period', cdk.requiredValidator)(properties.period));
    errors.collect(cdk.propertyValidator('period', cdk.validateNumber)(properties.period));
    errors.collect(cdk.propertyValidator('stat', cdk.requiredValidator)(properties.stat));
    errors.collect(cdk.propertyValidator('stat', cdk.validateString)(properties.stat));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "MetricStatProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.MetricStat` resource
 *
 * @param properties - the TypeScript properties of a `MetricStatProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.MetricStat` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorMetricStatPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_MetricStatPropertyValidator(properties).assertSuccess();
    return {
        Metric: cfnAnomalyDetectorMetricPropertyToCloudFormation(properties.metric),
        Period: cdk.numberToCloudFormation(properties.period),
        Stat: cdk.stringToCloudFormation(properties.stat),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorMetricStatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.MetricStatProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.MetricStatProperty>();
    ret.addPropertyResult('metric', 'Metric', CfnAnomalyDetectorMetricPropertyFromCloudFormation(properties.Metric));
    ret.addPropertyResult('period', 'Period', cfn_parse.FromCloudFormation.getNumber(properties.Period));
    ret.addPropertyResult('stat', 'Stat', cfn_parse.FromCloudFormation.getString(properties.Stat));
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Each `Range` specifies one range of days or times to exclude from use for training or updating an anomaly detection model.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-range.html
     */
    export interface RangeProperty {
        /**
         * The end time of the range to exclude. The format is `yyyy-MM-dd'T'HH:mm:ss` . For example, `2019-07-01T23:59:59` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-range.html#cfn-cloudwatch-anomalydetector-range-endtime
         */
        readonly endTime: string;
        /**
         * The start time of the range to exclude. The format is `yyyy-MM-dd'T'HH:mm:ss` . For example, `2019-07-01T23:59:59` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-range.html#cfn-cloudwatch-anomalydetector-range-starttime
         */
        readonly startTime: string;
    }
}

/**
 * Determine whether the given properties match those of a `RangeProperty`
 *
 * @param properties - the TypeScript properties of a `RangeProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_RangePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endTime', cdk.requiredValidator)(properties.endTime));
    errors.collect(cdk.propertyValidator('endTime', cdk.validateString)(properties.endTime));
    errors.collect(cdk.propertyValidator('startTime', cdk.requiredValidator)(properties.startTime));
    errors.collect(cdk.propertyValidator('startTime', cdk.validateString)(properties.startTime));
    return errors.wrap('supplied properties not correct for "RangeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.Range` resource
 *
 * @param properties - the TypeScript properties of a `RangeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.Range` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorRangePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_RangePropertyValidator(properties).assertSuccess();
    return {
        EndTime: cdk.stringToCloudFormation(properties.endTime),
        StartTime: cdk.stringToCloudFormation(properties.startTime),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.RangeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.RangeProperty>();
    ret.addPropertyResult('endTime', 'EndTime', cfn_parse.FromCloudFormation.getString(properties.EndTime));
    ret.addPropertyResult('startTime', 'StartTime', cfn_parse.FromCloudFormation.getString(properties.StartTime));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Designates the CloudWatch metric and statistic that provides the time series the anomaly detector uses as input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-singlemetricanomalydetector.html
     */
    export interface SingleMetricAnomalyDetectorProperty {
        /**
         * The metric dimensions to create the anomaly detection model for.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-singlemetricanomalydetector.html#cfn-cloudwatch-anomalydetector-singlemetricanomalydetector-dimensions
         */
        readonly dimensions?: Array<CfnAnomalyDetector.DimensionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the metric to create the anomaly detection model for.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-singlemetricanomalydetector.html#cfn-cloudwatch-anomalydetector-singlemetricanomalydetector-metricname
         */
        readonly metricName?: string;
        /**
         * The namespace of the metric to create the anomaly detection model for.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-singlemetricanomalydetector.html#cfn-cloudwatch-anomalydetector-singlemetricanomalydetector-namespace
         */
        readonly namespace?: string;
        /**
         * The statistic to use for the metric and anomaly detection model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-singlemetricanomalydetector.html#cfn-cloudwatch-anomalydetector-singlemetricanomalydetector-stat
         */
        readonly stat?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SingleMetricAnomalyDetectorProperty`
 *
 * @param properties - the TypeScript properties of a `SingleMetricAnomalyDetectorProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_SingleMetricAnomalyDetectorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnAnomalyDetector_DimensionPropertyValidator))(properties.dimensions));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    errors.collect(cdk.propertyValidator('stat', cdk.validateString)(properties.stat));
    return errors.wrap('supplied properties not correct for "SingleMetricAnomalyDetectorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.SingleMetricAnomalyDetector` resource
 *
 * @param properties - the TypeScript properties of a `SingleMetricAnomalyDetectorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::AnomalyDetector.SingleMetricAnomalyDetector` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorSingleMetricAnomalyDetectorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_SingleMetricAnomalyDetectorPropertyValidator(properties).assertSuccess();
    return {
        Dimensions: cdk.listMapper(cfnAnomalyDetectorDimensionPropertyToCloudFormation)(properties.dimensions),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
        Stat: cdk.stringToCloudFormation(properties.stat),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorSingleMetricAnomalyDetectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.SingleMetricAnomalyDetectorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.SingleMetricAnomalyDetectorProperty>();
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalyDetectorDimensionPropertyFromCloudFormation)(properties.Dimensions) : undefined);
    ret.addPropertyResult('metricName', 'MetricName', properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined);
    ret.addPropertyResult('namespace', 'Namespace', properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined);
    ret.addPropertyResult('stat', 'Stat', properties.Stat != null ? cfn_parse.FromCloudFormation.getString(properties.Stat) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnCompositeAlarm`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html
 */
export interface CfnCompositeAlarmProps {

    /**
     * An expression that specifies which other alarms are to be evaluated to determine this composite alarm's state. For each alarm that you reference, you designate a function that specifies whether that alarm needs to be in ALARM state, OK state, or INSUFFICIENT_DATA state. You can use operators (AND, OR and NOT) to combine multiple functions in a single expression. You can use parenthesis to logically group the functions in your expression.
     *
     * You can use either alarm names or ARNs to reference the other alarms that are to be evaluated.
     *
     * Functions can include the following:
     *
     * - ALARM("alarm-name or alarm-ARN") is TRUE if the named alarm is in ALARM state.
     * - OK("alarm-name or alarm-ARN") is TRUE if the named alarm is in OK state.
     * - INSUFFICIENT_DATA("alarm-name or alarm-ARN") is TRUE if the named alarm is in INSUFFICIENT_DATA state.
     * - TRUE always evaluates to TRUE.
     * - FALSE always evaluates to FALSE.
     *
     * TRUE and FALSE are useful for testing a complex AlarmRule structure, and for testing your alarm actions.
     *
     * For more information about `AlarmRule` syntax, see [PutCompositeAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutCompositeAlarm.html) in the *Amazon CloudWatch API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-alarmrule
     */
    readonly alarmRule: string;

    /**
     * Indicates whether actions should be executed during any changes to the alarm state of the composite alarm. The default is TRUE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-actionsenabled
     */
    readonly actionsEnabled?: boolean | cdk.IResolvable;

    /**
     * Actions will be suppressed if the suppressor alarm is in the `ALARM` state. `ActionsSuppressor` can be an AlarmName or an Amazon Resource Name (ARN) from an existing alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-actionssuppressor
     */
    readonly actionsSuppressor?: string;

    /**
     * The maximum time in seconds that the composite alarm waits after suppressor alarm goes out of the `ALARM` state. After this time, the composite alarm performs its actions.
     *
     * > `ExtensionPeriod` is required only when `ActionsSuppressor` is specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-actionssuppressorextensionperiod
     */
    readonly actionsSuppressorExtensionPeriod?: number;

    /**
     * The maximum time in seconds that the composite alarm waits for the suppressor alarm to go into the `ALARM` state. After this time, the composite alarm performs its actions.
     *
     * > `WaitPeriod` is required only when `ActionsSuppressor` is specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-actionssuppressorwaitperiod
     */
    readonly actionsSuppressorWaitPeriod?: number;

    /**
     * The actions to execute when this alarm transitions to the ALARM state from any other state. Each action is specified as an Amazon Resource Name (ARN). For more information about creating alarms and the actions that you can specify, see [PutCompositeAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutCompositeAlarm.html) in the *Amazon CloudWatch API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-alarmactions
     */
    readonly alarmActions?: string[];

    /**
     * The description for the composite alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-alarmdescription
     */
    readonly alarmDescription?: string;

    /**
     * The name for the composite alarm. This name must be unique within your AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-alarmname
     */
    readonly alarmName?: string;

    /**
     * The actions to execute when this alarm transitions to the INSUFFICIENT_DATA state from any other state. Each action is specified as an Amazon Resource Name (ARN). For more information about creating alarms and the actions that you can specify, see [PutCompositeAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutCompositeAlarm.html) in the *Amazon CloudWatch API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-insufficientdataactions
     */
    readonly insufficientDataActions?: string[];

    /**
     * The actions to execute when this alarm transitions to the OK state from any other state. Each action is specified as an Amazon Resource Name (ARN). For more information about creating alarms and the actions that you can specify, see [PutCompositeAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutCompositeAlarm.html) in the *Amazon CloudWatch API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-okactions
     */
    readonly okActions?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnCompositeAlarmProps`
 *
 * @param properties - the TypeScript properties of a `CfnCompositeAlarmProps`
 *
 * @returns the result of the validation.
 */
function CfnCompositeAlarmPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actionsEnabled', cdk.validateBoolean)(properties.actionsEnabled));
    errors.collect(cdk.propertyValidator('actionsSuppressor', cdk.validateString)(properties.actionsSuppressor));
    errors.collect(cdk.propertyValidator('actionsSuppressorExtensionPeriod', cdk.validateNumber)(properties.actionsSuppressorExtensionPeriod));
    errors.collect(cdk.propertyValidator('actionsSuppressorWaitPeriod', cdk.validateNumber)(properties.actionsSuppressorWaitPeriod));
    errors.collect(cdk.propertyValidator('alarmActions', cdk.listValidator(cdk.validateString))(properties.alarmActions));
    errors.collect(cdk.propertyValidator('alarmDescription', cdk.validateString)(properties.alarmDescription));
    errors.collect(cdk.propertyValidator('alarmName', cdk.validateString)(properties.alarmName));
    errors.collect(cdk.propertyValidator('alarmRule', cdk.requiredValidator)(properties.alarmRule));
    errors.collect(cdk.propertyValidator('alarmRule', cdk.validateString)(properties.alarmRule));
    errors.collect(cdk.propertyValidator('insufficientDataActions', cdk.listValidator(cdk.validateString))(properties.insufficientDataActions));
    errors.collect(cdk.propertyValidator('okActions', cdk.listValidator(cdk.validateString))(properties.okActions));
    return errors.wrap('supplied properties not correct for "CfnCompositeAlarmProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::CompositeAlarm` resource
 *
 * @param properties - the TypeScript properties of a `CfnCompositeAlarmProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::CompositeAlarm` resource.
 */
// @ts-ignore TS6133
function cfnCompositeAlarmPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCompositeAlarmPropsValidator(properties).assertSuccess();
    return {
        AlarmRule: cdk.stringToCloudFormation(properties.alarmRule),
        ActionsEnabled: cdk.booleanToCloudFormation(properties.actionsEnabled),
        ActionsSuppressor: cdk.stringToCloudFormation(properties.actionsSuppressor),
        ActionsSuppressorExtensionPeriod: cdk.numberToCloudFormation(properties.actionsSuppressorExtensionPeriod),
        ActionsSuppressorWaitPeriod: cdk.numberToCloudFormation(properties.actionsSuppressorWaitPeriod),
        AlarmActions: cdk.listMapper(cdk.stringToCloudFormation)(properties.alarmActions),
        AlarmDescription: cdk.stringToCloudFormation(properties.alarmDescription),
        AlarmName: cdk.stringToCloudFormation(properties.alarmName),
        InsufficientDataActions: cdk.listMapper(cdk.stringToCloudFormation)(properties.insufficientDataActions),
        OKActions: cdk.listMapper(cdk.stringToCloudFormation)(properties.okActions),
    };
}

// @ts-ignore TS6133
function CfnCompositeAlarmPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCompositeAlarmProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCompositeAlarmProps>();
    ret.addPropertyResult('alarmRule', 'AlarmRule', cfn_parse.FromCloudFormation.getString(properties.AlarmRule));
    ret.addPropertyResult('actionsEnabled', 'ActionsEnabled', properties.ActionsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ActionsEnabled) : undefined);
    ret.addPropertyResult('actionsSuppressor', 'ActionsSuppressor', properties.ActionsSuppressor != null ? cfn_parse.FromCloudFormation.getString(properties.ActionsSuppressor) : undefined);
    ret.addPropertyResult('actionsSuppressorExtensionPeriod', 'ActionsSuppressorExtensionPeriod', properties.ActionsSuppressorExtensionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.ActionsSuppressorExtensionPeriod) : undefined);
    ret.addPropertyResult('actionsSuppressorWaitPeriod', 'ActionsSuppressorWaitPeriod', properties.ActionsSuppressorWaitPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.ActionsSuppressorWaitPeriod) : undefined);
    ret.addPropertyResult('alarmActions', 'AlarmActions', properties.AlarmActions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AlarmActions) : undefined);
    ret.addPropertyResult('alarmDescription', 'AlarmDescription', properties.AlarmDescription != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmDescription) : undefined);
    ret.addPropertyResult('alarmName', 'AlarmName', properties.AlarmName != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmName) : undefined);
    ret.addPropertyResult('insufficientDataActions', 'InsufficientDataActions', properties.InsufficientDataActions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.InsufficientDataActions) : undefined);
    ret.addPropertyResult('okActions', 'OKActions', properties.OKActions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OKActions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CloudWatch::CompositeAlarm`
 *
 * The `AWS::CloudWatch::CompositeAlarm` type creates or updates a composite alarm. When you create a composite alarm, you specify a rule expression for the alarm that takes into account the alarm states of other alarms that you have created. The composite alarm goes into ALARM state only if all conditions of the rule are met.
 *
 * The alarms specified in a composite alarm's rule expression can include metric alarms and other composite alarms.
 *
 * Using composite alarms can reduce alarm noise. You can create multiple metric alarms, and also create a composite alarm and set up alerts only for the composite alarm. For example, you could create a composite alarm that goes into ALARM state only when more than one of the underlying metric alarms are in ALARM state.
 *
 * Currently, the only alarm actions that can be taken by composite alarms are notifying SNS topics.
 *
 * When this operation creates an alarm, the alarm state is immediately set to INSUFFICIENT_DATA. The alarm is then evaluated and its state is set appropriately. Any actions associated with the new state are then executed. For a composite alarm, this initial time after creation is the only time that the alarm can be in INSUFFICIENT_DATA state.
 *
 * When you update an existing alarm, its state is left unchanged, but the update completely overwrites the previous configuration of the alarm.
 *
 * @cloudformationResource AWS::CloudWatch::CompositeAlarm
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html
 */
export class CfnCompositeAlarm extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudWatch::CompositeAlarm";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCompositeAlarm {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCompositeAlarmPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCompositeAlarm(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the composite alarm, such as `arn:aws:cloudwatch:us-west-2:123456789012:alarm/CompositeAlarmName` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * An expression that specifies which other alarms are to be evaluated to determine this composite alarm's state. For each alarm that you reference, you designate a function that specifies whether that alarm needs to be in ALARM state, OK state, or INSUFFICIENT_DATA state. You can use operators (AND, OR and NOT) to combine multiple functions in a single expression. You can use parenthesis to logically group the functions in your expression.
     *
     * You can use either alarm names or ARNs to reference the other alarms that are to be evaluated.
     *
     * Functions can include the following:
     *
     * - ALARM("alarm-name or alarm-ARN") is TRUE if the named alarm is in ALARM state.
     * - OK("alarm-name or alarm-ARN") is TRUE if the named alarm is in OK state.
     * - INSUFFICIENT_DATA("alarm-name or alarm-ARN") is TRUE if the named alarm is in INSUFFICIENT_DATA state.
     * - TRUE always evaluates to TRUE.
     * - FALSE always evaluates to FALSE.
     *
     * TRUE and FALSE are useful for testing a complex AlarmRule structure, and for testing your alarm actions.
     *
     * For more information about `AlarmRule` syntax, see [PutCompositeAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutCompositeAlarm.html) in the *Amazon CloudWatch API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-alarmrule
     */
    public alarmRule: string;

    /**
     * Indicates whether actions should be executed during any changes to the alarm state of the composite alarm. The default is TRUE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-actionsenabled
     */
    public actionsEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * Actions will be suppressed if the suppressor alarm is in the `ALARM` state. `ActionsSuppressor` can be an AlarmName or an Amazon Resource Name (ARN) from an existing alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-actionssuppressor
     */
    public actionsSuppressor: string | undefined;

    /**
     * The maximum time in seconds that the composite alarm waits after suppressor alarm goes out of the `ALARM` state. After this time, the composite alarm performs its actions.
     *
     * > `ExtensionPeriod` is required only when `ActionsSuppressor` is specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-actionssuppressorextensionperiod
     */
    public actionsSuppressorExtensionPeriod: number | undefined;

    /**
     * The maximum time in seconds that the composite alarm waits for the suppressor alarm to go into the `ALARM` state. After this time, the composite alarm performs its actions.
     *
     * > `WaitPeriod` is required only when `ActionsSuppressor` is specified.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-actionssuppressorwaitperiod
     */
    public actionsSuppressorWaitPeriod: number | undefined;

    /**
     * The actions to execute when this alarm transitions to the ALARM state from any other state. Each action is specified as an Amazon Resource Name (ARN). For more information about creating alarms and the actions that you can specify, see [PutCompositeAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutCompositeAlarm.html) in the *Amazon CloudWatch API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-alarmactions
     */
    public alarmActions: string[] | undefined;

    /**
     * The description for the composite alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-alarmdescription
     */
    public alarmDescription: string | undefined;

    /**
     * The name for the composite alarm. This name must be unique within your AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-alarmname
     */
    public alarmName: string | undefined;

    /**
     * The actions to execute when this alarm transitions to the INSUFFICIENT_DATA state from any other state. Each action is specified as an Amazon Resource Name (ARN). For more information about creating alarms and the actions that you can specify, see [PutCompositeAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutCompositeAlarm.html) in the *Amazon CloudWatch API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-insufficientdataactions
     */
    public insufficientDataActions: string[] | undefined;

    /**
     * The actions to execute when this alarm transitions to the OK state from any other state. Each action is specified as an Amazon Resource Name (ARN). For more information about creating alarms and the actions that you can specify, see [PutCompositeAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutCompositeAlarm.html) in the *Amazon CloudWatch API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-compositealarm.html#cfn-cloudwatch-compositealarm-okactions
     */
    public okActions: string[] | undefined;

    /**
     * Create a new `AWS::CloudWatch::CompositeAlarm`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCompositeAlarmProps) {
        super(scope, id, { type: CfnCompositeAlarm.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'alarmRule', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.alarmRule = props.alarmRule;
        this.actionsEnabled = props.actionsEnabled;
        this.actionsSuppressor = props.actionsSuppressor;
        this.actionsSuppressorExtensionPeriod = props.actionsSuppressorExtensionPeriod;
        this.actionsSuppressorWaitPeriod = props.actionsSuppressorWaitPeriod;
        this.alarmActions = props.alarmActions;
        this.alarmDescription = props.alarmDescription;
        this.alarmName = props.alarmName;
        this.insufficientDataActions = props.insufficientDataActions;
        this.okActions = props.okActions;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCompositeAlarm.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            alarmRule: this.alarmRule,
            actionsEnabled: this.actionsEnabled,
            actionsSuppressor: this.actionsSuppressor,
            actionsSuppressorExtensionPeriod: this.actionsSuppressorExtensionPeriod,
            actionsSuppressorWaitPeriod: this.actionsSuppressorWaitPeriod,
            alarmActions: this.alarmActions,
            alarmDescription: this.alarmDescription,
            alarmName: this.alarmName,
            insufficientDataActions: this.insufficientDataActions,
            okActions: this.okActions,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCompositeAlarmPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnDashboard`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html
 */
export interface CfnDashboardProps {

    /**
     * The detailed information about the dashboard in JSON format, including the widgets to include and their location on the dashboard. This parameter is required.
     *
     * For more information about the syntax, see [Dashboard Body Structure and Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/CloudWatch-Dashboard-Body-Structure.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html#cfn-cloudwatch-dashboard-dashboardbody
     */
    readonly dashboardBody: string;

    /**
     * The name of the dashboard. The name must be between 1 and 255 characters. If you do not specify a name, one will be generated automatically.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html#cfn-cloudwatch-dashboard-dashboardname
     */
    readonly dashboardName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDashboardProps`
 *
 * @param properties - the TypeScript properties of a `CfnDashboardProps`
 *
 * @returns the result of the validation.
 */
function CfnDashboardPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dashboardBody', cdk.requiredValidator)(properties.dashboardBody));
    errors.collect(cdk.propertyValidator('dashboardBody', cdk.validateString)(properties.dashboardBody));
    errors.collect(cdk.propertyValidator('dashboardName', cdk.validateString)(properties.dashboardName));
    return errors.wrap('supplied properties not correct for "CfnDashboardProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::Dashboard` resource
 *
 * @param properties - the TypeScript properties of a `CfnDashboardProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::Dashboard` resource.
 */
// @ts-ignore TS6133
function cfnDashboardPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboardPropsValidator(properties).assertSuccess();
    return {
        DashboardBody: cdk.stringToCloudFormation(properties.dashboardBody),
        DashboardName: cdk.stringToCloudFormation(properties.dashboardName),
    };
}

// @ts-ignore TS6133
function CfnDashboardPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboardProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboardProps>();
    ret.addPropertyResult('dashboardBody', 'DashboardBody', cfn_parse.FromCloudFormation.getString(properties.DashboardBody));
    ret.addPropertyResult('dashboardName', 'DashboardName', properties.DashboardName != null ? cfn_parse.FromCloudFormation.getString(properties.DashboardName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CloudWatch::Dashboard`
 *
 * The `AWS::CloudWatch::Dashboard` resource specifies an Amazon CloudWatch dashboard. A dashboard is a customizable home page in the CloudWatch console that you can use to monitor your AWS resources in a single view.
 *
 * All dashboards in your account are global, not region-specific.
 *
 * @cloudformationResource AWS::CloudWatch::Dashboard
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html
 */
export class CfnDashboard extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudWatch::Dashboard";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDashboard {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDashboardPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDashboard(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The detailed information about the dashboard in JSON format, including the widgets to include and their location on the dashboard. This parameter is required.
     *
     * For more information about the syntax, see [Dashboard Body Structure and Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/CloudWatch-Dashboard-Body-Structure.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html#cfn-cloudwatch-dashboard-dashboardbody
     */
    public dashboardBody: string;

    /**
     * The name of the dashboard. The name must be between 1 and 255 characters. If you do not specify a name, one will be generated automatically.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html#cfn-cloudwatch-dashboard-dashboardname
     */
    public dashboardName: string | undefined;

    /**
     * Create a new `AWS::CloudWatch::Dashboard`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDashboardProps) {
        super(scope, id, { type: CfnDashboard.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'dashboardBody', this);

        this.dashboardBody = props.dashboardBody;
        this.dashboardName = props.dashboardName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDashboard.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            dashboardBody: this.dashboardBody,
            dashboardName: this.dashboardName,
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDashboardPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnInsightRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-insightrule.html
 */
export interface CfnInsightRuleProps {

    /**
     * The definition of the rule, as a JSON object. For details about the syntax, see [Contributor Insights Rule Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights-RuleSyntax.html) in the *Amazon CloudWatch User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-insightrule.html#cfn-cloudwatch-insightrule-rulebody
     */
    readonly ruleBody: string;

    /**
     * The name of the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-insightrule.html#cfn-cloudwatch-insightrule-rulename
     */
    readonly ruleName: string;

    /**
     * The current state of the rule. Valid values are `ENABLED` and `DISABLED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-insightrule.html#cfn-cloudwatch-insightrule-rulestate
     */
    readonly ruleState: string;

    /**
     * A list of key-value pairs to associate with the Contributor Insights rule. You can associate as many as 50 tags with a rule.
     *
     * Tags can help you organize and categorize your resources. For more information, see [Tagging Your Amazon CloudWatch Resources](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Tagging.html) .
     *
     * To be able to associate tags with a rule, you must have the `cloudwatch:TagResource` permission in addition to the `cloudwatch:PutInsightRule` permission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-insightrule.html#cfn-cloudwatch-insightrule-tags
     */
    readonly tags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnInsightRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnInsightRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnInsightRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ruleBody', cdk.requiredValidator)(properties.ruleBody));
    errors.collect(cdk.propertyValidator('ruleBody', cdk.validateString)(properties.ruleBody));
    errors.collect(cdk.propertyValidator('ruleName', cdk.requiredValidator)(properties.ruleName));
    errors.collect(cdk.propertyValidator('ruleName', cdk.validateString)(properties.ruleName));
    errors.collect(cdk.propertyValidator('ruleState', cdk.requiredValidator)(properties.ruleState));
    errors.collect(cdk.propertyValidator('ruleState', cdk.validateString)(properties.ruleState));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnInsightRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::InsightRule` resource
 *
 * @param properties - the TypeScript properties of a `CfnInsightRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::InsightRule` resource.
 */
// @ts-ignore TS6133
function cfnInsightRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInsightRulePropsValidator(properties).assertSuccess();
    return {
        RuleBody: cdk.stringToCloudFormation(properties.ruleBody),
        RuleName: cdk.stringToCloudFormation(properties.ruleName),
        RuleState: cdk.stringToCloudFormation(properties.ruleState),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnInsightRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInsightRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInsightRuleProps>();
    ret.addPropertyResult('ruleBody', 'RuleBody', cfn_parse.FromCloudFormation.getString(properties.RuleBody));
    ret.addPropertyResult('ruleName', 'RuleName', cfn_parse.FromCloudFormation.getString(properties.RuleName));
    ret.addPropertyResult('ruleState', 'RuleState', cfn_parse.FromCloudFormation.getString(properties.RuleState));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CloudWatch::InsightRule`
 *
 * Creates or updates a Contributor Insights rule. Rules evaluate log events in a CloudWatch Logs log group, enabling you to find contributor data for the log events in that log group. For more information, see [Using Contributor Insights to Analyze High-Cardinality Data](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html) in the *Amazon CloudWatch User Guide* .
 *
 * @cloudformationResource AWS::CloudWatch::InsightRule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-insightrule.html
 */
export class CfnInsightRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudWatch::InsightRule";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInsightRule {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnInsightRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnInsightRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the Contributor Insights rule, such as `arn:aws:cloudwatch:us-west-2:123456789012:insight-rule/MyInsightRuleName` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the Contributor Insights rule.
     * @cloudformationAttribute RuleName
     */
    public readonly attrRuleName: string;

    /**
     * The definition of the rule, as a JSON object. For details about the syntax, see [Contributor Insights Rule Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights-RuleSyntax.html) in the *Amazon CloudWatch User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-insightrule.html#cfn-cloudwatch-insightrule-rulebody
     */
    public ruleBody: string;

    /**
     * The name of the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-insightrule.html#cfn-cloudwatch-insightrule-rulename
     */
    public ruleName: string;

    /**
     * The current state of the rule. Valid values are `ENABLED` and `DISABLED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-insightrule.html#cfn-cloudwatch-insightrule-rulestate
     */
    public ruleState: string;

    /**
     * A list of key-value pairs to associate with the Contributor Insights rule. You can associate as many as 50 tags with a rule.
     *
     * Tags can help you organize and categorize your resources. For more information, see [Tagging Your Amazon CloudWatch Resources](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Tagging.html) .
     *
     * To be able to associate tags with a rule, you must have the `cloudwatch:TagResource` permission in addition to the `cloudwatch:PutInsightRule` permission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-insightrule.html#cfn-cloudwatch-insightrule-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::CloudWatch::InsightRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInsightRuleProps) {
        super(scope, id, { type: CfnInsightRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'ruleBody', this);
        cdk.requireProperty(props, 'ruleName', this);
        cdk.requireProperty(props, 'ruleState', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrRuleName = cdk.Token.asString(this.getAtt('RuleName', cdk.ResolutionTypeHint.STRING));

        this.ruleBody = props.ruleBody;
        this.ruleName = props.ruleName;
        this.ruleState = props.ruleState;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CloudWatch::InsightRule", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnInsightRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            ruleBody: this.ruleBody,
            ruleName: this.ruleName,
            ruleState: this.ruleState,
            tags: this.tags.renderTags(),
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnInsightRulePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnMetricStream`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html
 */
export interface CfnMetricStreamProps {

    /**
     * The ARN of the Amazon Kinesis Firehose delivery stream to use for this metric stream. This Amazon Kinesis Firehose delivery stream must already exist and must be in the same account as the metric stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-firehosearn
     */
    readonly firehoseArn: string;

    /**
     * The output format for the stream. Valid values are `json` and `opentelemetry0.7` For more information about metric stream output formats, see [Metric streams output formats](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-metric-streams-formats.html) .
     *
     * This parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-outputformat
     */
    readonly outputFormat: string;

    /**
     * The ARN of an IAM role that this metric stream will use to access Amazon Kinesis Firehose resources. This IAM role must already exist and must be in the same account as the metric stream. This IAM role must include the `firehose:PutRecord` and `firehose:PutRecordBatch` permissions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-rolearn
     */
    readonly roleArn: string;

    /**
     * If you specify this parameter, the stream sends metrics from all metric namespaces except for the namespaces that you specify here. You cannot specify both `IncludeFilters` and `ExcludeFilters` in the same metric stream.
     *
     * When you modify the `IncludeFilters` or `ExcludeFilters` of an existing metric stream in any way, the metric stream is effectively restarted, so after such a change you will get only the datapoints that have a timestamp after the time of the update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-excludefilters
     */
    readonly excludeFilters?: Array<CfnMetricStream.MetricStreamFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * If you specify this parameter, the stream sends only the metrics from the metric namespaces that you specify here. You cannot specify both `IncludeFilters` and `ExcludeFilters` in the same metric stream.
     *
     * When you modify the `IncludeFilters` or `ExcludeFilters` of an existing metric stream in any way, the metric stream is effectively restarted, so after such a change you will get only the datapoints that have a timestamp after the time of the update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-includefilters
     */
    readonly includeFilters?: Array<CfnMetricStream.MetricStreamFilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * If you are creating a metric stream in a monitoring account, specify `true` to include metrics from source accounts that are linked to this monitoring account, in the metric stream. The default is `false` .
     *
     * For more information about linking accounts, see [CloudWatch cross-account observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-includelinkedaccountsmetrics
     */
    readonly includeLinkedAccountsMetrics?: boolean | cdk.IResolvable;

    /**
     * If you are creating a new metric stream, this is the name for the new stream. The name must be different than the names of other metric streams in this account and Region.
     *
     * If you are updating a metric stream, specify the name of that stream here.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-name
     */
    readonly name?: string;

    /**
     * By default, a metric stream always sends the MAX, MIN, SUM, and SAMPLECOUNT statistics for each metric that is streamed. You can use this parameter to have the metric stream also send additional statistics in the stream. This array can have up to 100 members.
     *
     * For each entry in this array, you specify one or more metrics and the list of additional statistics to stream for those metrics. The additional statistics that you can stream depend on the stream's `OutputFormat` . If the `OutputFormat` is `json` , you can stream any additional statistic that is supported by CloudWatch , listed in [CloudWatch statistics definitions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html.html) . If the `OutputFormat` is `opentelemetry0` .7, you can stream percentile statistics *(p??)* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-statisticsconfigurations
     */
    readonly statisticsConfigurations?: Array<CfnMetricStream.MetricStreamStatisticsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to the metric stream.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnMetricStreamProps`
 *
 * @param properties - the TypeScript properties of a `CfnMetricStreamProps`
 *
 * @returns the result of the validation.
 */
function CfnMetricStreamPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('excludeFilters', cdk.listValidator(CfnMetricStream_MetricStreamFilterPropertyValidator))(properties.excludeFilters));
    errors.collect(cdk.propertyValidator('firehoseArn', cdk.requiredValidator)(properties.firehoseArn));
    errors.collect(cdk.propertyValidator('firehoseArn', cdk.validateString)(properties.firehoseArn));
    errors.collect(cdk.propertyValidator('includeFilters', cdk.listValidator(CfnMetricStream_MetricStreamFilterPropertyValidator))(properties.includeFilters));
    errors.collect(cdk.propertyValidator('includeLinkedAccountsMetrics', cdk.validateBoolean)(properties.includeLinkedAccountsMetrics));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('outputFormat', cdk.requiredValidator)(properties.outputFormat));
    errors.collect(cdk.propertyValidator('outputFormat', cdk.validateString)(properties.outputFormat));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('statisticsConfigurations', cdk.listValidator(CfnMetricStream_MetricStreamStatisticsConfigurationPropertyValidator))(properties.statisticsConfigurations));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnMetricStreamProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::MetricStream` resource
 *
 * @param properties - the TypeScript properties of a `CfnMetricStreamProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::MetricStream` resource.
 */
// @ts-ignore TS6133
function cfnMetricStreamPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMetricStreamPropsValidator(properties).assertSuccess();
    return {
        FirehoseArn: cdk.stringToCloudFormation(properties.firehoseArn),
        OutputFormat: cdk.stringToCloudFormation(properties.outputFormat),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        ExcludeFilters: cdk.listMapper(cfnMetricStreamMetricStreamFilterPropertyToCloudFormation)(properties.excludeFilters),
        IncludeFilters: cdk.listMapper(cfnMetricStreamMetricStreamFilterPropertyToCloudFormation)(properties.includeFilters),
        IncludeLinkedAccountsMetrics: cdk.booleanToCloudFormation(properties.includeLinkedAccountsMetrics),
        Name: cdk.stringToCloudFormation(properties.name),
        StatisticsConfigurations: cdk.listMapper(cfnMetricStreamMetricStreamStatisticsConfigurationPropertyToCloudFormation)(properties.statisticsConfigurations),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnMetricStreamPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMetricStreamProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMetricStreamProps>();
    ret.addPropertyResult('firehoseArn', 'FirehoseArn', cfn_parse.FromCloudFormation.getString(properties.FirehoseArn));
    ret.addPropertyResult('outputFormat', 'OutputFormat', cfn_parse.FromCloudFormation.getString(properties.OutputFormat));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('excludeFilters', 'ExcludeFilters', properties.ExcludeFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnMetricStreamMetricStreamFilterPropertyFromCloudFormation)(properties.ExcludeFilters) : undefined);
    ret.addPropertyResult('includeFilters', 'IncludeFilters', properties.IncludeFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnMetricStreamMetricStreamFilterPropertyFromCloudFormation)(properties.IncludeFilters) : undefined);
    ret.addPropertyResult('includeLinkedAccountsMetrics', 'IncludeLinkedAccountsMetrics', properties.IncludeLinkedAccountsMetrics != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeLinkedAccountsMetrics) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('statisticsConfigurations', 'StatisticsConfigurations', properties.StatisticsConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnMetricStreamMetricStreamStatisticsConfigurationPropertyFromCloudFormation)(properties.StatisticsConfigurations) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CloudWatch::MetricStream`
 *
 * Creates or updates a metric stream. Metrics streams can automatically stream CloudWatch metrics to AWS destinations including Amazon S3 and to many third-party solutions. For more information, see [Metric streams](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Metric-Streams.html) .
 *
 * To create a metric stream, you must be logged on to an account that has the `iam:PassRole` permission and either the *CloudWatchFullAccess* policy or the `cloudwatch:PutMetricStream` permission.
 *
 * When you create or update a metric stream, you choose one of the following:
 *
 * - Stream metrics from all metric namespaces in the account.
 * - Stream metrics from all metric namespaces in the account, except for the namespaces that you list in `ExcludeFilters` .
 * - Stream metrics from only the metric namespaces that you list in `IncludeFilters` .
 *
 * When you create a metric stream, the stream is created in the `running` state. If you update an existing metric stream, the state does not change.
 *
 * If you create a metric stream in an account that has been set up as a monitoring account in CloudWatch cross-account observability, you can choose whether to include metrics from linked source accounts in the metric stream.
 *
 * @cloudformationResource AWS::CloudWatch::MetricStream
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html
 */
export class CfnMetricStream extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CloudWatch::MetricStream";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMetricStream {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnMetricStreamPropsFromCloudFormation(resourceProperties);
        const ret = new CfnMetricStream(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the metric stream.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The date that the metric stream was originally created.
     * @cloudformationAttribute CreationDate
     */
    public readonly attrCreationDate: string;

    /**
     * The date that the metric stream was most recently updated.
     * @cloudformationAttribute LastUpdateDate
     */
    public readonly attrLastUpdateDate: string;

    /**
     * The state of the metric stream, either `running` or `stopped` .
     * @cloudformationAttribute State
     */
    public readonly attrState: string;

    /**
     * The ARN of the Amazon Kinesis Firehose delivery stream to use for this metric stream. This Amazon Kinesis Firehose delivery stream must already exist and must be in the same account as the metric stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-firehosearn
     */
    public firehoseArn: string;

    /**
     * The output format for the stream. Valid values are `json` and `opentelemetry0.7` For more information about metric stream output formats, see [Metric streams output formats](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-metric-streams-formats.html) .
     *
     * This parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-outputformat
     */
    public outputFormat: string;

    /**
     * The ARN of an IAM role that this metric stream will use to access Amazon Kinesis Firehose resources. This IAM role must already exist and must be in the same account as the metric stream. This IAM role must include the `firehose:PutRecord` and `firehose:PutRecordBatch` permissions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-rolearn
     */
    public roleArn: string;

    /**
     * If you specify this parameter, the stream sends metrics from all metric namespaces except for the namespaces that you specify here. You cannot specify both `IncludeFilters` and `ExcludeFilters` in the same metric stream.
     *
     * When you modify the `IncludeFilters` or `ExcludeFilters` of an existing metric stream in any way, the metric stream is effectively restarted, so after such a change you will get only the datapoints that have a timestamp after the time of the update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-excludefilters
     */
    public excludeFilters: Array<CfnMetricStream.MetricStreamFilterProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * If you specify this parameter, the stream sends only the metrics from the metric namespaces that you specify here. You cannot specify both `IncludeFilters` and `ExcludeFilters` in the same metric stream.
     *
     * When you modify the `IncludeFilters` or `ExcludeFilters` of an existing metric stream in any way, the metric stream is effectively restarted, so after such a change you will get only the datapoints that have a timestamp after the time of the update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-includefilters
     */
    public includeFilters: Array<CfnMetricStream.MetricStreamFilterProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * If you are creating a metric stream in a monitoring account, specify `true` to include metrics from source accounts that are linked to this monitoring account, in the metric stream. The default is `false` .
     *
     * For more information about linking accounts, see [CloudWatch cross-account observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-includelinkedaccountsmetrics
     */
    public includeLinkedAccountsMetrics: boolean | cdk.IResolvable | undefined;

    /**
     * If you are creating a new metric stream, this is the name for the new stream. The name must be different than the names of other metric streams in this account and Region.
     *
     * If you are updating a metric stream, specify the name of that stream here.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-name
     */
    public name: string | undefined;

    /**
     * By default, a metric stream always sends the MAX, MIN, SUM, and SAMPLECOUNT statistics for each metric that is streamed. You can use this parameter to have the metric stream also send additional statistics in the stream. This array can have up to 100 members.
     *
     * For each entry in this array, you specify one or more metrics and the list of additional statistics to stream for those metrics. The additional statistics that you can stream depend on the stream's `OutputFormat` . If the `OutputFormat` is `json` , you can stream any additional statistic that is supported by CloudWatch , listed in [CloudWatch statistics definitions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html.html) . If the `OutputFormat` is `opentelemetry0` .7, you can stream percentile statistics *(p??)* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-statisticsconfigurations
     */
    public statisticsConfigurations: Array<CfnMetricStream.MetricStreamStatisticsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to the metric stream.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-metricstream.html#cfn-cloudwatch-metricstream-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::CloudWatch::MetricStream`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMetricStreamProps) {
        super(scope, id, { type: CfnMetricStream.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'firehoseArn', this);
        cdk.requireProperty(props, 'outputFormat', this);
        cdk.requireProperty(props, 'roleArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreationDate = cdk.Token.asString(this.getAtt('CreationDate', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdateDate = cdk.Token.asString(this.getAtt('LastUpdateDate', cdk.ResolutionTypeHint.STRING));
        this.attrState = cdk.Token.asString(this.getAtt('State', cdk.ResolutionTypeHint.STRING));

        this.firehoseArn = props.firehoseArn;
        this.outputFormat = props.outputFormat;
        this.roleArn = props.roleArn;
        this.excludeFilters = props.excludeFilters;
        this.includeFilters = props.includeFilters;
        this.includeLinkedAccountsMetrics = props.includeLinkedAccountsMetrics;
        this.name = props.name;
        this.statisticsConfigurations = props.statisticsConfigurations;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CloudWatch::MetricStream", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMetricStream.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected override get cfnProperties(): { [key: string]: any }  {
        return {
            firehoseArn: this.firehoseArn,
            outputFormat: this.outputFormat,
            roleArn: this.roleArn,
            excludeFilters: this.excludeFilters,
            includeFilters: this.includeFilters,
            includeLinkedAccountsMetrics: this.includeLinkedAccountsMetrics,
            name: this.name,
            statisticsConfigurations: this.statisticsConfigurations,
            tags: this.tags.renderTags(),
        };
    }

    protected override renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMetricStreamPropsToCloudFormation(props);
    }
}

export namespace CfnMetricStream {
    /**
     * This structure contains the name of one of the metric namespaces that is listed in a filter of a metric stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-metricstream-metricstreamfilter.html
     */
    export interface MetricStreamFilterProperty {
        /**
         * The name of the metric namespace in the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-metricstream-metricstreamfilter.html#cfn-cloudwatch-metricstream-metricstreamfilter-namespace
         */
        readonly namespace: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetricStreamFilterProperty`
 *
 * @param properties - the TypeScript properties of a `MetricStreamFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnMetricStream_MetricStreamFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('namespace', cdk.requiredValidator)(properties.namespace));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    return errors.wrap('supplied properties not correct for "MetricStreamFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::MetricStream.MetricStreamFilter` resource
 *
 * @param properties - the TypeScript properties of a `MetricStreamFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::MetricStream.MetricStreamFilter` resource.
 */
// @ts-ignore TS6133
function cfnMetricStreamMetricStreamFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMetricStream_MetricStreamFilterPropertyValidator(properties).assertSuccess();
    return {
        Namespace: cdk.stringToCloudFormation(properties.namespace),
    };
}

// @ts-ignore TS6133
function CfnMetricStreamMetricStreamFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMetricStream.MetricStreamFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMetricStream.MetricStreamFilterProperty>();
    ret.addPropertyResult('namespace', 'Namespace', cfn_parse.FromCloudFormation.getString(properties.Namespace));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMetricStream {
    /**
     * This structure specifies a list of additional statistics to stream, and the metrics to stream those additional statistics for.
     *
     * All metrics that match the combination of metric name and namespace will be streamed with the additional statistics, no matter their dimensions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-metricstream-metricstreamstatisticsconfiguration.html
     */
    export interface MetricStreamStatisticsConfigurationProperty {
        /**
         * The additional statistics to stream for the metrics listed in `IncludeMetrics` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-metricstream-metricstreamstatisticsconfiguration.html#cfn-cloudwatch-metricstream-metricstreamstatisticsconfiguration-additionalstatistics
         */
        readonly additionalStatistics: string[];
        /**
         * An array that defines the metrics that are to have additional statistics streamed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-metricstream-metricstreamstatisticsconfiguration.html#cfn-cloudwatch-metricstream-metricstreamstatisticsconfiguration-includemetrics
         */
        readonly includeMetrics: Array<CfnMetricStream.MetricStreamStatisticsMetricProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MetricStreamStatisticsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MetricStreamStatisticsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnMetricStream_MetricStreamStatisticsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('additionalStatistics', cdk.requiredValidator)(properties.additionalStatistics));
    errors.collect(cdk.propertyValidator('additionalStatistics', cdk.listValidator(cdk.validateString))(properties.additionalStatistics));
    errors.collect(cdk.propertyValidator('includeMetrics', cdk.requiredValidator)(properties.includeMetrics));
    errors.collect(cdk.propertyValidator('includeMetrics', cdk.listValidator(CfnMetricStream_MetricStreamStatisticsMetricPropertyValidator))(properties.includeMetrics));
    return errors.wrap('supplied properties not correct for "MetricStreamStatisticsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::MetricStream.MetricStreamStatisticsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `MetricStreamStatisticsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::MetricStream.MetricStreamStatisticsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnMetricStreamMetricStreamStatisticsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMetricStream_MetricStreamStatisticsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AdditionalStatistics: cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalStatistics),
        IncludeMetrics: cdk.listMapper(cfnMetricStreamMetricStreamStatisticsMetricPropertyToCloudFormation)(properties.includeMetrics),
    };
}

// @ts-ignore TS6133
function CfnMetricStreamMetricStreamStatisticsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMetricStream.MetricStreamStatisticsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMetricStream.MetricStreamStatisticsConfigurationProperty>();
    ret.addPropertyResult('additionalStatistics', 'AdditionalStatistics', cfn_parse.FromCloudFormation.getStringArray(properties.AdditionalStatistics));
    ret.addPropertyResult('includeMetrics', 'IncludeMetrics', cfn_parse.FromCloudFormation.getArray(CfnMetricStreamMetricStreamStatisticsMetricPropertyFromCloudFormation)(properties.IncludeMetrics));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMetricStream {
    /**
     * A structure that specifies the metric name and namespace for one metric that is going to have additional statistics included in the stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-metricstream-metricstreamstatisticsmetric.html
     */
    export interface MetricStreamStatisticsMetricProperty {
        /**
         * The name of the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-metricstream-metricstreamstatisticsmetric.html#cfn-cloudwatch-metricstream-metricstreamstatisticsmetric-metricname
         */
        readonly metricName: string;
        /**
         * The namespace of the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-metricstream-metricstreamstatisticsmetric.html#cfn-cloudwatch-metricstream-metricstreamstatisticsmetric-namespace
         */
        readonly namespace: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetricStreamStatisticsMetricProperty`
 *
 * @param properties - the TypeScript properties of a `MetricStreamStatisticsMetricProperty`
 *
 * @returns the result of the validation.
 */
function CfnMetricStream_MetricStreamStatisticsMetricPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('namespace', cdk.requiredValidator)(properties.namespace));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    return errors.wrap('supplied properties not correct for "MetricStreamStatisticsMetricProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CloudWatch::MetricStream.MetricStreamStatisticsMetric` resource
 *
 * @param properties - the TypeScript properties of a `MetricStreamStatisticsMetricProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CloudWatch::MetricStream.MetricStreamStatisticsMetric` resource.
 */
// @ts-ignore TS6133
function cfnMetricStreamMetricStreamStatisticsMetricPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMetricStream_MetricStreamStatisticsMetricPropertyValidator(properties).assertSuccess();
    return {
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
    };
}

// @ts-ignore TS6133
function CfnMetricStreamMetricStreamStatisticsMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMetricStream.MetricStreamStatisticsMetricProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMetricStream.MetricStreamStatisticsMetricProperty>();
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('namespace', 'Namespace', cfn_parse.FromCloudFormation.getString(properties.Namespace));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
