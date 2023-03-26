// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:59.536Z","fingerprint":"hiAE6xUQxuyJMOX054Z42QJ2NYvVEO1MNXKIbSkWWO0="}

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
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html
 */
export interface CfnAlarmProps {

    /**
     * The name of the alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-alarmname
     */
    readonly alarmName: string;

    /**
     * The arithmetic operation to use when comparing the specified statistic and threshold.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-comparisonoperator
     */
    readonly comparisonOperator: string;

    /**
     * The number of periods over which data is compared to the specified threshold.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-evaluationperiods
     */
    readonly evaluationPeriods: number;

    /**
     * The name of the metric associated with the alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-metricname
     */
    readonly metricName: string;

    /**
     * The name of the Lightsail resource that the alarm monitors.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-monitoredresourcename
     */
    readonly monitoredResourceName: string;

    /**
     * The value against which the specified statistic is compared.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-threshold
     */
    readonly threshold: number;

    /**
     * The contact protocols for the alarm, such as `Email` , `SMS` (text messaging), or both.
     *
     * *Allowed Values* : `Email` | `SMS`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-contactprotocols
     */
    readonly contactProtocols?: string[];

    /**
     * The number of data points within the evaluation periods that must be breaching to cause the alarm to go to the `ALARM` state.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-datapointstoalarm
     */
    readonly datapointsToAlarm?: number;

    /**
     * A Boolean value indicating whether the alarm is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-notificationenabled
     */
    readonly notificationEnabled?: boolean | cdk.IResolvable;

    /**
     * The alarm states that trigger a notification.
     *
     * > To specify the `OK` and `INSUFFICIENT_DATA` values, you must also specify `ContactProtocols` values. Otherwise, the `OK` and `INSUFFICIENT_DATA` values will not take effect and the stack will drift.
     *
     * *Allowed Values* : `OK` | `ALARM` | `INSUFFICIENT_DATA`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-notificationtriggers
     */
    readonly notificationTriggers?: string[];

    /**
     * Specifies how the alarm handles missing data points.
     *
     * An alarm can treat missing data in the following ways:
     *
     * - `breaching` - Assumes the missing data is not within the threshold. Missing data counts towards the number of times that the metric is not within the threshold.
     * - `notBreaching` - Assumes the missing data is within the threshold. Missing data does not count towards the number of times that the metric is not within the threshold.
     * - `ignore` - Ignores the missing data. Maintains the current alarm state.
     * - `missing` - Missing data is treated as missing.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-treatmissingdata
     */
    readonly treatMissingData?: string;
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
    errors.collect(cdk.propertyValidator('alarmName', cdk.requiredValidator)(properties.alarmName));
    errors.collect(cdk.propertyValidator('alarmName', cdk.validateString)(properties.alarmName));
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.requiredValidator)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.validateString)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('contactProtocols', cdk.listValidator(cdk.validateString))(properties.contactProtocols));
    errors.collect(cdk.propertyValidator('datapointsToAlarm', cdk.validateNumber)(properties.datapointsToAlarm));
    errors.collect(cdk.propertyValidator('evaluationPeriods', cdk.requiredValidator)(properties.evaluationPeriods));
    errors.collect(cdk.propertyValidator('evaluationPeriods', cdk.validateNumber)(properties.evaluationPeriods));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('monitoredResourceName', cdk.requiredValidator)(properties.monitoredResourceName));
    errors.collect(cdk.propertyValidator('monitoredResourceName', cdk.validateString)(properties.monitoredResourceName));
    errors.collect(cdk.propertyValidator('notificationEnabled', cdk.validateBoolean)(properties.notificationEnabled));
    errors.collect(cdk.propertyValidator('notificationTriggers', cdk.listValidator(cdk.validateString))(properties.notificationTriggers));
    errors.collect(cdk.propertyValidator('threshold', cdk.requiredValidator)(properties.threshold));
    errors.collect(cdk.propertyValidator('threshold', cdk.validateNumber)(properties.threshold));
    errors.collect(cdk.propertyValidator('treatMissingData', cdk.validateString)(properties.treatMissingData));
    return errors.wrap('supplied properties not correct for "CfnAlarmProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Alarm` resource
 *
 * @param properties - the TypeScript properties of a `CfnAlarmProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Alarm` resource.
 */
// @ts-ignore TS6133
function cfnAlarmPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlarmPropsValidator(properties).assertSuccess();
    return {
        AlarmName: cdk.stringToCloudFormation(properties.alarmName),
        ComparisonOperator: cdk.stringToCloudFormation(properties.comparisonOperator),
        EvaluationPeriods: cdk.numberToCloudFormation(properties.evaluationPeriods),
        MetricName: cdk.stringToCloudFormation(properties.metricName),
        MonitoredResourceName: cdk.stringToCloudFormation(properties.monitoredResourceName),
        Threshold: cdk.numberToCloudFormation(properties.threshold),
        ContactProtocols: cdk.listMapper(cdk.stringToCloudFormation)(properties.contactProtocols),
        DatapointsToAlarm: cdk.numberToCloudFormation(properties.datapointsToAlarm),
        NotificationEnabled: cdk.booleanToCloudFormation(properties.notificationEnabled),
        NotificationTriggers: cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationTriggers),
        TreatMissingData: cdk.stringToCloudFormation(properties.treatMissingData),
    };
}

// @ts-ignore TS6133
function CfnAlarmPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmProps>();
    ret.addPropertyResult('alarmName', 'AlarmName', cfn_parse.FromCloudFormation.getString(properties.AlarmName));
    ret.addPropertyResult('comparisonOperator', 'ComparisonOperator', cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator));
    ret.addPropertyResult('evaluationPeriods', 'EvaluationPeriods', cfn_parse.FromCloudFormation.getNumber(properties.EvaluationPeriods));
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('monitoredResourceName', 'MonitoredResourceName', cfn_parse.FromCloudFormation.getString(properties.MonitoredResourceName));
    ret.addPropertyResult('threshold', 'Threshold', cfn_parse.FromCloudFormation.getNumber(properties.Threshold));
    ret.addPropertyResult('contactProtocols', 'ContactProtocols', properties.ContactProtocols != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ContactProtocols) : undefined);
    ret.addPropertyResult('datapointsToAlarm', 'DatapointsToAlarm', properties.DatapointsToAlarm != null ? cfn_parse.FromCloudFormation.getNumber(properties.DatapointsToAlarm) : undefined);
    ret.addPropertyResult('notificationEnabled', 'NotificationEnabled', properties.NotificationEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NotificationEnabled) : undefined);
    ret.addPropertyResult('notificationTriggers', 'NotificationTriggers', properties.NotificationTriggers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.NotificationTriggers) : undefined);
    ret.addPropertyResult('treatMissingData', 'TreatMissingData', properties.TreatMissingData != null ? cfn_parse.FromCloudFormation.getString(properties.TreatMissingData) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lightsail::Alarm`
 *
 * The `AWS::Lightsail::Alarm` resource specifies an alarm that can be used to monitor a single metric for one of your Lightsail resources.
 *
 * @cloudformationResource AWS::Lightsail::Alarm
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html
 */
export class CfnAlarm extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lightsail::Alarm";

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
     * The Amazon Resource Name (ARN) of the alarm.
     * @cloudformationAttribute AlarmArn
     */
    public readonly attrAlarmArn: string;

    /**
     * The current state of the alarm.
     *
     * An alarm has the following possible states:
     *
     * - `ALARM` - The metric is outside of the defined threshold.
     * - `INSUFFICIENT_DATA` - The alarm has recently started, the metric is not available, or not enough data is available for the metric to determine the alarm state.
     * - `OK` - The metric is within the defined threshold.
     * @cloudformationAttribute State
     */
    public readonly attrState: string;

    /**
     * The name of the alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-alarmname
     */
    public alarmName: string;

    /**
     * The arithmetic operation to use when comparing the specified statistic and threshold.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-comparisonoperator
     */
    public comparisonOperator: string;

    /**
     * The number of periods over which data is compared to the specified threshold.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-evaluationperiods
     */
    public evaluationPeriods: number;

    /**
     * The name of the metric associated with the alarm.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-metricname
     */
    public metricName: string;

    /**
     * The name of the Lightsail resource that the alarm monitors.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-monitoredresourcename
     */
    public monitoredResourceName: string;

    /**
     * The value against which the specified statistic is compared.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-threshold
     */
    public threshold: number;

    /**
     * The contact protocols for the alarm, such as `Email` , `SMS` (text messaging), or both.
     *
     * *Allowed Values* : `Email` | `SMS`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-contactprotocols
     */
    public contactProtocols: string[] | undefined;

    /**
     * The number of data points within the evaluation periods that must be breaching to cause the alarm to go to the `ALARM` state.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-datapointstoalarm
     */
    public datapointsToAlarm: number | undefined;

    /**
     * A Boolean value indicating whether the alarm is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-notificationenabled
     */
    public notificationEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The alarm states that trigger a notification.
     *
     * > To specify the `OK` and `INSUFFICIENT_DATA` values, you must also specify `ContactProtocols` values. Otherwise, the `OK` and `INSUFFICIENT_DATA` values will not take effect and the stack will drift.
     *
     * *Allowed Values* : `OK` | `ALARM` | `INSUFFICIENT_DATA`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-notificationtriggers
     */
    public notificationTriggers: string[] | undefined;

    /**
     * Specifies how the alarm handles missing data points.
     *
     * An alarm can treat missing data in the following ways:
     *
     * - `breaching` - Assumes the missing data is not within the threshold. Missing data counts towards the number of times that the metric is not within the threshold.
     * - `notBreaching` - Assumes the missing data is within the threshold. Missing data does not count towards the number of times that the metric is not within the threshold.
     * - `ignore` - Ignores the missing data. Maintains the current alarm state.
     * - `missing` - Missing data is treated as missing.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-treatmissingdata
     */
    public treatMissingData: string | undefined;

    /**
     * Create a new `AWS::Lightsail::Alarm`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAlarmProps) {
        super(scope, id, { type: CfnAlarm.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'alarmName', this);
        cdk.requireProperty(props, 'comparisonOperator', this);
        cdk.requireProperty(props, 'evaluationPeriods', this);
        cdk.requireProperty(props, 'metricName', this);
        cdk.requireProperty(props, 'monitoredResourceName', this);
        cdk.requireProperty(props, 'threshold', this);
        this.attrAlarmArn = cdk.Token.asString(this.getAtt('AlarmArn', cdk.ResolutionTypeHint.STRING));
        this.attrState = cdk.Token.asString(this.getAtt('State', cdk.ResolutionTypeHint.STRING));

        this.alarmName = props.alarmName;
        this.comparisonOperator = props.comparisonOperator;
        this.evaluationPeriods = props.evaluationPeriods;
        this.metricName = props.metricName;
        this.monitoredResourceName = props.monitoredResourceName;
        this.threshold = props.threshold;
        this.contactProtocols = props.contactProtocols;
        this.datapointsToAlarm = props.datapointsToAlarm;
        this.notificationEnabled = props.notificationEnabled;
        this.notificationTriggers = props.notificationTriggers;
        this.treatMissingData = props.treatMissingData;
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

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            alarmName: this.alarmName,
            comparisonOperator: this.comparisonOperator,
            evaluationPeriods: this.evaluationPeriods,
            metricName: this.metricName,
            monitoredResourceName: this.monitoredResourceName,
            threshold: this.threshold,
            contactProtocols: this.contactProtocols,
            datapointsToAlarm: this.datapointsToAlarm,
            notificationEnabled: this.notificationEnabled,
            notificationTriggers: this.notificationTriggers,
            treatMissingData: this.treatMissingData,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAlarmPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnBucket`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html
 */
export interface CfnBucketProps {

    /**
     * The name of the bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-bucketname
     */
    readonly bucketName: string;

    /**
     * The bundle ID for the bucket (for example, `small_1_0` ).
     *
     * A bucket bundle specifies the monthly cost, storage space, and data transfer quota for a bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-bundleid
     */
    readonly bundleId: string;

    /**
     * An object that describes the access rules for the bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-accessrules
     */
    readonly accessRules?: CfnBucket.AccessRulesProperty | cdk.IResolvable;

    /**
     * Indicates whether object versioning is enabled for the bucket.
     *
     * The following options can be configured:
     *
     * - `Enabled` - Object versioning is enabled.
     * - `Suspended` - Object versioning was previously enabled but is currently suspended. Existing object versions are retained.
     * - `NeverEnabled` - Object versioning has never been enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-objectversioning
     */
    readonly objectVersioning?: boolean | cdk.IResolvable;

    /**
     * An array of AWS account IDs that have read-only access to the bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-readonlyaccessaccounts
     */
    readonly readOnlyAccessAccounts?: string[];

    /**
     * An array of Lightsail instances that have access to the bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-resourcesreceivingaccess
     */
    readonly resourcesReceivingAccess?: string[];

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnBucketProps`
 *
 * @param properties - the TypeScript properties of a `CfnBucketProps`
 *
 * @returns the result of the validation.
 */
function CfnBucketPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessRules', CfnBucket_AccessRulesPropertyValidator)(properties.accessRules));
    errors.collect(cdk.propertyValidator('bucketName', cdk.requiredValidator)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bundleId', cdk.requiredValidator)(properties.bundleId));
    errors.collect(cdk.propertyValidator('bundleId', cdk.validateString)(properties.bundleId));
    errors.collect(cdk.propertyValidator('objectVersioning', cdk.validateBoolean)(properties.objectVersioning));
    errors.collect(cdk.propertyValidator('readOnlyAccessAccounts', cdk.listValidator(cdk.validateString))(properties.readOnlyAccessAccounts));
    errors.collect(cdk.propertyValidator('resourcesReceivingAccess', cdk.listValidator(cdk.validateString))(properties.resourcesReceivingAccess));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnBucketProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Bucket` resource
 *
 * @param properties - the TypeScript properties of a `CfnBucketProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Bucket` resource.
 */
// @ts-ignore TS6133
function cfnBucketPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucketPropsValidator(properties).assertSuccess();
    return {
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        BundleId: cdk.stringToCloudFormation(properties.bundleId),
        AccessRules: cfnBucketAccessRulesPropertyToCloudFormation(properties.accessRules),
        ObjectVersioning: cdk.booleanToCloudFormation(properties.objectVersioning),
        ReadOnlyAccessAccounts: cdk.listMapper(cdk.stringToCloudFormation)(properties.readOnlyAccessAccounts),
        ResourcesReceivingAccess: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourcesReceivingAccess),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnBucketPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucketProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucketProps>();
    ret.addPropertyResult('bucketName', 'BucketName', cfn_parse.FromCloudFormation.getString(properties.BucketName));
    ret.addPropertyResult('bundleId', 'BundleId', cfn_parse.FromCloudFormation.getString(properties.BundleId));
    ret.addPropertyResult('accessRules', 'AccessRules', properties.AccessRules != null ? CfnBucketAccessRulesPropertyFromCloudFormation(properties.AccessRules) : undefined);
    ret.addPropertyResult('objectVersioning', 'ObjectVersioning', properties.ObjectVersioning != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ObjectVersioning) : undefined);
    ret.addPropertyResult('readOnlyAccessAccounts', 'ReadOnlyAccessAccounts', properties.ReadOnlyAccessAccounts != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ReadOnlyAccessAccounts) : undefined);
    ret.addPropertyResult('resourcesReceivingAccess', 'ResourcesReceivingAccess', properties.ResourcesReceivingAccess != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ResourcesReceivingAccess) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lightsail::Bucket`
 *
 * The `AWS::Lightsail::Bucket` resource specifies a bucket.
 *
 * @cloudformationResource AWS::Lightsail::Bucket
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html
 */
export class CfnBucket extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lightsail::Bucket";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBucket {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBucketPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBucket(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A Boolean value indicating whether the bundle that is currently applied to your distribution can be changed to another bundle.
     * @cloudformationAttribute AbleToUpdateBundle
     */
    public readonly attrAbleToUpdateBundle: cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the bucket.
     * @cloudformationAttribute BucketArn
     */
    public readonly attrBucketArn: string;

    /**
     * The URL of the bucket.
     * @cloudformationAttribute Url
     */
    public readonly attrUrl: string;

    /**
     * The name of the bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-bucketname
     */
    public bucketName: string;

    /**
     * The bundle ID for the bucket (for example, `small_1_0` ).
     *
     * A bucket bundle specifies the monthly cost, storage space, and data transfer quota for a bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-bundleid
     */
    public bundleId: string;

    /**
     * An object that describes the access rules for the bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-accessrules
     */
    public accessRules: CfnBucket.AccessRulesProperty | cdk.IResolvable | undefined;

    /**
     * Indicates whether object versioning is enabled for the bucket.
     *
     * The following options can be configured:
     *
     * - `Enabled` - Object versioning is enabled.
     * - `Suspended` - Object versioning was previously enabled but is currently suspended. Existing object versions are retained.
     * - `NeverEnabled` - Object versioning has never been enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-objectversioning
     */
    public objectVersioning: boolean | cdk.IResolvable | undefined;

    /**
     * An array of AWS account IDs that have read-only access to the bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-readonlyaccessaccounts
     */
    public readOnlyAccessAccounts: string[] | undefined;

    /**
     * An array of Lightsail instances that have access to the bucket.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-resourcesreceivingaccess
     */
    public resourcesReceivingAccess: string[] | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Lightsail::Bucket`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBucketProps) {
        super(scope, id, { type: CfnBucket.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'bucketName', this);
        cdk.requireProperty(props, 'bundleId', this);
        this.attrAbleToUpdateBundle = this.getAtt('AbleToUpdateBundle', cdk.ResolutionTypeHint.STRING);
        this.attrBucketArn = cdk.Token.asString(this.getAtt('BucketArn', cdk.ResolutionTypeHint.STRING));
        this.attrUrl = cdk.Token.asString(this.getAtt('Url', cdk.ResolutionTypeHint.STRING));

        this.bucketName = props.bucketName;
        this.bundleId = props.bundleId;
        this.accessRules = props.accessRules;
        this.objectVersioning = props.objectVersioning;
        this.readOnlyAccessAccounts = props.readOnlyAccessAccounts;
        this.resourcesReceivingAccess = props.resourcesReceivingAccess;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Bucket", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBucket.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            bucketName: this.bucketName,
            bundleId: this.bundleId,
            accessRules: this.accessRules,
            objectVersioning: this.objectVersioning,
            readOnlyAccessAccounts: this.readOnlyAccessAccounts,
            resourcesReceivingAccess: this.resourcesReceivingAccess,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBucketPropsToCloudFormation(props);
    }
}

export namespace CfnBucket {
    /**
     * `AccessRules` is a property of the [AWS::Lightsail::Bucket](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html) resource. It describes access rules for a bucket.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-bucket-accessrules.html
     */
    export interface AccessRulesProperty {
        /**
         * A Boolean value indicating whether the access control list (ACL) permissions that are applied to individual objects override the `GetObject` option that is currently specified.
         *
         * When this is true, you can use the [PutObjectAcl](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObjectAcl.html) Amazon S3 API operation to set individual objects to public (read-only) or private, using either the `public-read` ACL or the `private` ACL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-bucket-accessrules.html#cfn-lightsail-bucket-accessrules-allowpublicoverrides
         */
        readonly allowPublicOverrides?: boolean | cdk.IResolvable;
        /**
         * Specifies the anonymous access to all objects in a bucket.
         *
         * The following options can be specified:
         *
         * - `public` - Sets all objects in the bucket to public (read-only), making them readable by everyone on the internet.
         *
         * If the `GetObject` value is set to `public` , then all objects in the bucket default to public regardless of the `allowPublicOverrides` value.
         * - `private` - Sets all objects in the bucket to private, making them readable only by you and anyone that you grant access to.
         *
         * If the `GetObject` value is set to `private` , and the `allowPublicOverrides` value is set to `true` , then all objects in the bucket default to private unless they are configured with a `public-read` ACL. Individual objects with a `public-read` ACL are readable by everyone on the internet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-bucket-accessrules.html#cfn-lightsail-bucket-accessrules-getobject
         */
        readonly objectAccess?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AccessRulesProperty`
 *
 * @param properties - the TypeScript properties of a `AccessRulesProperty`
 *
 * @returns the result of the validation.
 */
function CfnBucket_AccessRulesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowPublicOverrides', cdk.validateBoolean)(properties.allowPublicOverrides));
    errors.collect(cdk.propertyValidator('objectAccess', cdk.validateString)(properties.objectAccess));
    return errors.wrap('supplied properties not correct for "AccessRulesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Bucket.AccessRules` resource
 *
 * @param properties - the TypeScript properties of a `AccessRulesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Bucket.AccessRules` resource.
 */
// @ts-ignore TS6133
function cfnBucketAccessRulesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBucket_AccessRulesPropertyValidator(properties).assertSuccess();
    return {
        AllowPublicOverrides: cdk.booleanToCloudFormation(properties.allowPublicOverrides),
        GetObject: cdk.stringToCloudFormation(properties.objectAccess),
    };
}

// @ts-ignore TS6133
function CfnBucketAccessRulesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.AccessRulesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.AccessRulesProperty>();
    ret.addPropertyResult('allowPublicOverrides', 'AllowPublicOverrides', properties.AllowPublicOverrides != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowPublicOverrides) : undefined);
    ret.addPropertyResult('objectAccess', 'GetObject', properties.GetObject != null ? cfn_parse.FromCloudFormation.getString(properties.GetObject) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnCertificate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html
 */
export interface CfnCertificateProps {

    /**
     * The name of the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-certificatename
     */
    readonly certificateName: string;

    /**
     * The domain name of the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-domainname
     */
    readonly domainName: string;

    /**
     * An array of strings that specify the alternate domains (such as `example.org` ) and subdomains (such as `blog.example.com` ) of the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-subjectalternativenames
     */
    readonly subjectAlternativeNames?: string[];

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProps`
 *
 * @returns the result of the validation.
 */
function CfnCertificatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateName', cdk.requiredValidator)(properties.certificateName));
    errors.collect(cdk.propertyValidator('certificateName', cdk.validateString)(properties.certificateName));
    errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('subjectAlternativeNames', cdk.listValidator(cdk.validateString))(properties.subjectAlternativeNames));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnCertificateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Certificate` resource
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Certificate` resource.
 */
// @ts-ignore TS6133
function cfnCertificatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificatePropsValidator(properties).assertSuccess();
    return {
        CertificateName: cdk.stringToCloudFormation(properties.certificateName),
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        SubjectAlternativeNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.subjectAlternativeNames),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateProps>();
    ret.addPropertyResult('certificateName', 'CertificateName', cfn_parse.FromCloudFormation.getString(properties.CertificateName));
    ret.addPropertyResult('domainName', 'DomainName', cfn_parse.FromCloudFormation.getString(properties.DomainName));
    ret.addPropertyResult('subjectAlternativeNames', 'SubjectAlternativeNames', properties.SubjectAlternativeNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubjectAlternativeNames) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lightsail::Certificate`
 *
 * The `AWS::Lightsail::Certificate` resource specifies an SSL/TLS certificate that you can use with a content delivery network (CDN) distribution and a container service.
 *
 * > For information about certificates that you can use with a load balancer, see [AWS::Lightsail::LoadBalancerTlsCertificate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html) .
 *
 * @cloudformationResource AWS::Lightsail::Certificate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html
 */
export class CfnCertificate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lightsail::Certificate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCertificate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCertificatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnCertificate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the certificate.
     * @cloudformationAttribute CertificateArn
     */
    public readonly attrCertificateArn: string;

    /**
     * The validation status of the certificate.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The name of the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-certificatename
     */
    public certificateName: string;

    /**
     * The domain name of the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-domainname
     */
    public domainName: string;

    /**
     * An array of strings that specify the alternate domains (such as `example.org` ) and subdomains (such as `blog.example.com` ) of the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-subjectalternativenames
     */
    public subjectAlternativeNames: string[] | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Lightsail::Certificate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCertificateProps) {
        super(scope, id, { type: CfnCertificate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'certificateName', this);
        cdk.requireProperty(props, 'domainName', this);
        this.attrCertificateArn = cdk.Token.asString(this.getAtt('CertificateArn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.certificateName = props.certificateName;
        this.domainName = props.domainName;
        this.subjectAlternativeNames = props.subjectAlternativeNames;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Certificate", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCertificate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            certificateName: this.certificateName,
            domainName: this.domainName,
            subjectAlternativeNames: this.subjectAlternativeNames,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCertificatePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnContainer`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html
 */
export interface CfnContainerProps {

    /**
     * The power specification of the container service.
     *
     * The power specifies the amount of RAM, the number of vCPUs, and the base price of the container service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-power
     */
    readonly power: string;

    /**
     * The scale specification of the container service.
     *
     * The scale specifies the allocated compute nodes of the container service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-scale
     */
    readonly scale: number;

    /**
     * The name of the container service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-servicename
     */
    readonly serviceName: string;

    /**
     * An object that describes the current container deployment of the container service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-containerservicedeployment
     */
    readonly containerServiceDeployment?: CfnContainer.ContainerServiceDeploymentProperty | cdk.IResolvable;

    /**
     * A Boolean value indicating whether the container service is disabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-isdisabled
     */
    readonly isDisabled?: boolean | cdk.IResolvable;

    /**
     * The public domain name of the container service, such as `example.com` and `www.example.com` .
     *
     * You can specify up to four public domain names for a container service. The domain names that you specify are used when you create a deployment with a container that is configured as the public endpoint of your container service.
     *
     * If you don't specify public domain names, then you can use the default domain of the container service.
     *
     * > You must create and validate an SSL/TLS certificate before you can use public domain names with your container service. Use the [AWS::Lightsail::Certificate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html) resource to create a certificate for the public domain names that you want to use with your container service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-publicdomainnames
     */
    readonly publicDomainNames?: Array<CfnContainer.PublicDomainNameProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnContainerProps`
 *
 * @param properties - the TypeScript properties of a `CfnContainerProps`
 *
 * @returns the result of the validation.
 */
function CfnContainerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('containerServiceDeployment', CfnContainer_ContainerServiceDeploymentPropertyValidator)(properties.containerServiceDeployment));
    errors.collect(cdk.propertyValidator('isDisabled', cdk.validateBoolean)(properties.isDisabled));
    errors.collect(cdk.propertyValidator('power', cdk.requiredValidator)(properties.power));
    errors.collect(cdk.propertyValidator('power', cdk.validateString)(properties.power));
    errors.collect(cdk.propertyValidator('publicDomainNames', cdk.listValidator(CfnContainer_PublicDomainNamePropertyValidator))(properties.publicDomainNames));
    errors.collect(cdk.propertyValidator('scale', cdk.requiredValidator)(properties.scale));
    errors.collect(cdk.propertyValidator('scale', cdk.validateNumber)(properties.scale));
    errors.collect(cdk.propertyValidator('serviceName', cdk.requiredValidator)(properties.serviceName));
    errors.collect(cdk.propertyValidator('serviceName', cdk.validateString)(properties.serviceName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnContainerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Container` resource
 *
 * @param properties - the TypeScript properties of a `CfnContainerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Container` resource.
 */
// @ts-ignore TS6133
function cfnContainerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainerPropsValidator(properties).assertSuccess();
    return {
        Power: cdk.stringToCloudFormation(properties.power),
        Scale: cdk.numberToCloudFormation(properties.scale),
        ServiceName: cdk.stringToCloudFormation(properties.serviceName),
        ContainerServiceDeployment: cfnContainerContainerServiceDeploymentPropertyToCloudFormation(properties.containerServiceDeployment),
        IsDisabled: cdk.booleanToCloudFormation(properties.isDisabled),
        PublicDomainNames: cdk.listMapper(cfnContainerPublicDomainNamePropertyToCloudFormation)(properties.publicDomainNames),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnContainerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerProps>();
    ret.addPropertyResult('power', 'Power', cfn_parse.FromCloudFormation.getString(properties.Power));
    ret.addPropertyResult('scale', 'Scale', cfn_parse.FromCloudFormation.getNumber(properties.Scale));
    ret.addPropertyResult('serviceName', 'ServiceName', cfn_parse.FromCloudFormation.getString(properties.ServiceName));
    ret.addPropertyResult('containerServiceDeployment', 'ContainerServiceDeployment', properties.ContainerServiceDeployment != null ? CfnContainerContainerServiceDeploymentPropertyFromCloudFormation(properties.ContainerServiceDeployment) : undefined);
    ret.addPropertyResult('isDisabled', 'IsDisabled', properties.IsDisabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsDisabled) : undefined);
    ret.addPropertyResult('publicDomainNames', 'PublicDomainNames', properties.PublicDomainNames != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerPublicDomainNamePropertyFromCloudFormation)(properties.PublicDomainNames) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lightsail::Container`
 *
 * The `AWS::Lightsail::Container` resource specifies a container service.
 *
 * A Lightsail container service is a compute resource to which you can deploy containers.
 *
 * @cloudformationResource AWS::Lightsail::Container
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html
 */
export class CfnContainer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lightsail::Container";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContainer {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnContainerPropsFromCloudFormation(resourceProperties);
        const ret = new CfnContainer(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the container.
     * @cloudformationAttribute ContainerArn
     */
    public readonly attrContainerArn: string;

    /**
     * The publicly accessible URL of the container service.
     *
     * If no public endpoint is specified in the current deployment, this URL returns a 404 response.
     * @cloudformationAttribute Url
     */
    public readonly attrUrl: string;

    /**
     * The power specification of the container service.
     *
     * The power specifies the amount of RAM, the number of vCPUs, and the base price of the container service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-power
     */
    public power: string;

    /**
     * The scale specification of the container service.
     *
     * The scale specifies the allocated compute nodes of the container service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-scale
     */
    public scale: number;

    /**
     * The name of the container service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-servicename
     */
    public serviceName: string;

    /**
     * An object that describes the current container deployment of the container service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-containerservicedeployment
     */
    public containerServiceDeployment: CfnContainer.ContainerServiceDeploymentProperty | cdk.IResolvable | undefined;

    /**
     * A Boolean value indicating whether the container service is disabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-isdisabled
     */
    public isDisabled: boolean | cdk.IResolvable | undefined;

    /**
     * The public domain name of the container service, such as `example.com` and `www.example.com` .
     *
     * You can specify up to four public domain names for a container service. The domain names that you specify are used when you create a deployment with a container that is configured as the public endpoint of your container service.
     *
     * If you don't specify public domain names, then you can use the default domain of the container service.
     *
     * > You must create and validate an SSL/TLS certificate before you can use public domain names with your container service. Use the [AWS::Lightsail::Certificate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html) resource to create a certificate for the public domain names that you want to use with your container service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-publicdomainnames
     */
    public publicDomainNames: Array<CfnContainer.PublicDomainNameProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Lightsail::Container`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContainerProps) {
        super(scope, id, { type: CfnContainer.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'power', this);
        cdk.requireProperty(props, 'scale', this);
        cdk.requireProperty(props, 'serviceName', this);
        this.attrContainerArn = cdk.Token.asString(this.getAtt('ContainerArn', cdk.ResolutionTypeHint.STRING));
        this.attrUrl = cdk.Token.asString(this.getAtt('Url', cdk.ResolutionTypeHint.STRING));

        this.power = props.power;
        this.scale = props.scale;
        this.serviceName = props.serviceName;
        this.containerServiceDeployment = props.containerServiceDeployment;
        this.isDisabled = props.isDisabled;
        this.publicDomainNames = props.publicDomainNames;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Container", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnContainer.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            power: this.power,
            scale: this.scale,
            serviceName: this.serviceName,
            containerServiceDeployment: this.containerServiceDeployment,
            isDisabled: this.isDisabled,
            publicDomainNames: this.publicDomainNames,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnContainerPropsToCloudFormation(props);
    }
}

export namespace CfnContainer {
    /**
     * `Container` is a property of the [ContainerServiceDeployment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-containerservicedeployment.html) property. It describes the settings of a container that will be launched, or that is launched, to an Amazon Lightsail container service.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html
     */
    export interface ContainerProperty {
        /**
         * The launch command for the container.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html#cfn-lightsail-container-container-command
         */
        readonly command?: string[];
        /**
         * The name of the container.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html#cfn-lightsail-container-container-containername
         */
        readonly containerName?: string;
        /**
         * The environment variables of the container.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html#cfn-lightsail-container-container-environment
         */
        readonly environment?: Array<CfnContainer.EnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the image used for the container.
         *
         * Container images that are sourced from (registered and stored on) your container service start with a colon ( `:` ). For example, if your container service name is `container-service-1` , the container image label is `mystaticsite` , and you want to use the third version ( `3` ) of the registered container image, then you should specify `:container-service-1.mystaticsite.3` . To use the latest version of a container image, specify `latest` instead of a version number (for example, `:container-service-1.mystaticsite.latest` ). Your container service will automatically use the highest numbered version of the registered container image.
         *
         * Container images that are sourced from a public registry like Docker Hub don’t start with a colon. For example, `nginx:latest` or `nginx` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html#cfn-lightsail-container-container-image
         */
        readonly image?: string;
        /**
         * An object that describes the open firewall ports and protocols of the container.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html#cfn-lightsail-container-container-ports
         */
        readonly ports?: Array<CfnContainer.PortInfoProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ContainerProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainer_ContainerPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('command', cdk.listValidator(cdk.validateString))(properties.command));
    errors.collect(cdk.propertyValidator('containerName', cdk.validateString)(properties.containerName));
    errors.collect(cdk.propertyValidator('environment', cdk.listValidator(CfnContainer_EnvironmentVariablePropertyValidator))(properties.environment));
    errors.collect(cdk.propertyValidator('image', cdk.validateString)(properties.image));
    errors.collect(cdk.propertyValidator('ports', cdk.listValidator(CfnContainer_PortInfoPropertyValidator))(properties.ports));
    return errors.wrap('supplied properties not correct for "ContainerProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Container.Container` resource
 *
 * @param properties - the TypeScript properties of a `ContainerProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Container.Container` resource.
 */
// @ts-ignore TS6133
function cfnContainerContainerPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainer_ContainerPropertyValidator(properties).assertSuccess();
    return {
        Command: cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
        ContainerName: cdk.stringToCloudFormation(properties.containerName),
        Environment: cdk.listMapper(cfnContainerEnvironmentVariablePropertyToCloudFormation)(properties.environment),
        Image: cdk.stringToCloudFormation(properties.image),
        Ports: cdk.listMapper(cfnContainerPortInfoPropertyToCloudFormation)(properties.ports),
    };
}

// @ts-ignore TS6133
function CfnContainerContainerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.ContainerProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.ContainerProperty>();
    ret.addPropertyResult('command', 'Command', properties.Command != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Command) : undefined);
    ret.addPropertyResult('containerName', 'ContainerName', properties.ContainerName != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerName) : undefined);
    ret.addPropertyResult('environment', 'Environment', properties.Environment != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerEnvironmentVariablePropertyFromCloudFormation)(properties.Environment) : undefined);
    ret.addPropertyResult('image', 'Image', properties.Image != null ? cfn_parse.FromCloudFormation.getString(properties.Image) : undefined);
    ret.addPropertyResult('ports', 'Ports', properties.Ports != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerPortInfoPropertyFromCloudFormation)(properties.Ports) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContainer {
    /**
     * `ContainerServiceDeployment` is a property of the [AWS::Lightsail::Container](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html) resource. It describes a container deployment configuration of a container service.
     *
     * A deployment specifies the settings, such as the ports and launch command, of containers that are deployed to your container service.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-containerservicedeployment.html
     */
    export interface ContainerServiceDeploymentProperty {
        /**
         * An object that describes the configuration for the containers of the deployment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-containerservicedeployment.html#cfn-lightsail-container-containerservicedeployment-containers
         */
        readonly containers?: Array<CfnContainer.ContainerProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * An object that describes the endpoint of the deployment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-containerservicedeployment.html#cfn-lightsail-container-containerservicedeployment-publicendpoint
         */
        readonly publicEndpoint?: CfnContainer.PublicEndpointProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ContainerServiceDeploymentProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerServiceDeploymentProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainer_ContainerServiceDeploymentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('containers', cdk.listValidator(CfnContainer_ContainerPropertyValidator))(properties.containers));
    errors.collect(cdk.propertyValidator('publicEndpoint', CfnContainer_PublicEndpointPropertyValidator)(properties.publicEndpoint));
    return errors.wrap('supplied properties not correct for "ContainerServiceDeploymentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Container.ContainerServiceDeployment` resource
 *
 * @param properties - the TypeScript properties of a `ContainerServiceDeploymentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Container.ContainerServiceDeployment` resource.
 */
// @ts-ignore TS6133
function cfnContainerContainerServiceDeploymentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainer_ContainerServiceDeploymentPropertyValidator(properties).assertSuccess();
    return {
        Containers: cdk.listMapper(cfnContainerContainerPropertyToCloudFormation)(properties.containers),
        PublicEndpoint: cfnContainerPublicEndpointPropertyToCloudFormation(properties.publicEndpoint),
    };
}

// @ts-ignore TS6133
function CfnContainerContainerServiceDeploymentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.ContainerServiceDeploymentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.ContainerServiceDeploymentProperty>();
    ret.addPropertyResult('containers', 'Containers', properties.Containers != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerContainerPropertyFromCloudFormation)(properties.Containers) : undefined);
    ret.addPropertyResult('publicEndpoint', 'PublicEndpoint', properties.PublicEndpoint != null ? CfnContainerPublicEndpointPropertyFromCloudFormation(properties.PublicEndpoint) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContainer {
    /**
     * `EnvironmentVariable` is a property of the [Container](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html) property. It describes the environment variables of a container on a container service which are key-value parameters that provide dynamic configuration of the application or script run by the container.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-environmentvariable.html
     */
    export interface EnvironmentVariableProperty {
        /**
         * The environment variable value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-environmentvariable.html#cfn-lightsail-container-environmentvariable-value
         */
        readonly value?: string;
        /**
         * The environment variable key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-environmentvariable.html#cfn-lightsail-container-environmentvariable-variable
         */
        readonly variable?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EnvironmentVariableProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentVariableProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainer_EnvironmentVariablePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    errors.collect(cdk.propertyValidator('variable', cdk.validateString)(properties.variable));
    return errors.wrap('supplied properties not correct for "EnvironmentVariableProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Container.EnvironmentVariable` resource
 *
 * @param properties - the TypeScript properties of a `EnvironmentVariableProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Container.EnvironmentVariable` resource.
 */
// @ts-ignore TS6133
function cfnContainerEnvironmentVariablePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainer_EnvironmentVariablePropertyValidator(properties).assertSuccess();
    return {
        Value: cdk.stringToCloudFormation(properties.value),
        Variable: cdk.stringToCloudFormation(properties.variable),
    };
}

// @ts-ignore TS6133
function CfnContainerEnvironmentVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.EnvironmentVariableProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.EnvironmentVariableProperty>();
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addPropertyResult('variable', 'Variable', properties.Variable != null ? cfn_parse.FromCloudFormation.getString(properties.Variable) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContainer {
    /**
     * `HealthCheckConfig` is a property of the [PublicEndpoint](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicendpoint.html) property. It describes the healthcheck configuration of a container deployment on a container service.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html
     */
    export interface HealthCheckConfigProperty {
        /**
         * The number of consecutive health check successes required before moving the container to the `Healthy` state. The default value is `2` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-healthythreshold
         */
        readonly healthyThreshold?: number;
        /**
         * The approximate interval, in seconds, between health checks of an individual container. You can specify between `5` and `300` seconds. The default value is `5` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-intervalseconds
         */
        readonly intervalSeconds?: number;
        /**
         * The path on the container on which to perform the health check. The default value is `/` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-path
         */
        readonly path?: string;
        /**
         * The HTTP codes to use when checking for a successful response from a container. You can specify values between `200` and `499` . You can specify multiple values (for example, `200,202` ) or a range of values (for example, `200-299` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-successcodes
         */
        readonly successCodes?: string;
        /**
         * The amount of time, in seconds, during which no response means a failed health check. You can specify between `2` and `60` seconds. The default value is `2` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-timeoutseconds
         */
        readonly timeoutSeconds?: number;
        /**
         * The number of consecutive health check failures required before moving the container to the `Unhealthy` state. The default value is `2` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-unhealthythreshold
         */
        readonly unhealthyThreshold?: number;
    }
}

/**
 * Determine whether the given properties match those of a `HealthCheckConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HealthCheckConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainer_HealthCheckConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('healthyThreshold', cdk.validateNumber)(properties.healthyThreshold));
    errors.collect(cdk.propertyValidator('intervalSeconds', cdk.validateNumber)(properties.intervalSeconds));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    errors.collect(cdk.propertyValidator('successCodes', cdk.validateString)(properties.successCodes));
    errors.collect(cdk.propertyValidator('timeoutSeconds', cdk.validateNumber)(properties.timeoutSeconds));
    errors.collect(cdk.propertyValidator('unhealthyThreshold', cdk.validateNumber)(properties.unhealthyThreshold));
    return errors.wrap('supplied properties not correct for "HealthCheckConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Container.HealthCheckConfig` resource
 *
 * @param properties - the TypeScript properties of a `HealthCheckConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Container.HealthCheckConfig` resource.
 */
// @ts-ignore TS6133
function cfnContainerHealthCheckConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainer_HealthCheckConfigPropertyValidator(properties).assertSuccess();
    return {
        HealthyThreshold: cdk.numberToCloudFormation(properties.healthyThreshold),
        IntervalSeconds: cdk.numberToCloudFormation(properties.intervalSeconds),
        Path: cdk.stringToCloudFormation(properties.path),
        SuccessCodes: cdk.stringToCloudFormation(properties.successCodes),
        TimeoutSeconds: cdk.numberToCloudFormation(properties.timeoutSeconds),
        UnhealthyThreshold: cdk.numberToCloudFormation(properties.unhealthyThreshold),
    };
}

// @ts-ignore TS6133
function CfnContainerHealthCheckConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.HealthCheckConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.HealthCheckConfigProperty>();
    ret.addPropertyResult('healthyThreshold', 'HealthyThreshold', properties.HealthyThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthyThreshold) : undefined);
    ret.addPropertyResult('intervalSeconds', 'IntervalSeconds', properties.IntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntervalSeconds) : undefined);
    ret.addPropertyResult('path', 'Path', properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined);
    ret.addPropertyResult('successCodes', 'SuccessCodes', properties.SuccessCodes != null ? cfn_parse.FromCloudFormation.getString(properties.SuccessCodes) : undefined);
    ret.addPropertyResult('timeoutSeconds', 'TimeoutSeconds', properties.TimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutSeconds) : undefined);
    ret.addPropertyResult('unhealthyThreshold', 'UnhealthyThreshold', properties.UnhealthyThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnhealthyThreshold) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContainer {
    /**
     * `PortInfo` is a property of the [Container](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html) property. It describes the ports to open and the protocols to use for a container on a Amazon Lightsail container service.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-portinfo.html
     */
    export interface PortInfoProperty {
        /**
         * The open firewall ports of the container.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-portinfo.html#cfn-lightsail-container-portinfo-port
         */
        readonly port?: string;
        /**
         * The protocol name for the open ports.
         *
         * *Allowed values* : `HTTP` | `HTTPS` | `TCP` | `UDP`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-portinfo.html#cfn-lightsail-container-portinfo-protocol
         */
        readonly protocol?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PortInfoProperty`
 *
 * @param properties - the TypeScript properties of a `PortInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainer_PortInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('port', cdk.validateString)(properties.port));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    return errors.wrap('supplied properties not correct for "PortInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Container.PortInfo` resource
 *
 * @param properties - the TypeScript properties of a `PortInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Container.PortInfo` resource.
 */
// @ts-ignore TS6133
function cfnContainerPortInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainer_PortInfoPropertyValidator(properties).assertSuccess();
    return {
        Port: cdk.stringToCloudFormation(properties.port),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
    };
}

// @ts-ignore TS6133
function CfnContainerPortInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.PortInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.PortInfoProperty>();
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContainer {
    /**
     * `PublicDomainName` is a property of the [AWS::Lightsail::Container](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html) resource. It describes the public domain names to use with a container service, such as `example.com` and `www.example.com` . It also describes the certificates to use with a container service.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicdomainname.html
     */
    export interface PublicDomainNameProperty {
        /**
         * The name of the certificate for the public domains.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicdomainname.html#cfn-lightsail-container-publicdomainname-certificatename
         */
        readonly certificateName?: string;
        /**
         * The public domain names to use with the container service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicdomainname.html#cfn-lightsail-container-publicdomainname-domainnames
         */
        readonly domainNames?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `PublicDomainNameProperty`
 *
 * @param properties - the TypeScript properties of a `PublicDomainNameProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainer_PublicDomainNamePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateName', cdk.validateString)(properties.certificateName));
    errors.collect(cdk.propertyValidator('domainNames', cdk.listValidator(cdk.validateString))(properties.domainNames));
    return errors.wrap('supplied properties not correct for "PublicDomainNameProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Container.PublicDomainName` resource
 *
 * @param properties - the TypeScript properties of a `PublicDomainNameProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Container.PublicDomainName` resource.
 */
// @ts-ignore TS6133
function cfnContainerPublicDomainNamePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainer_PublicDomainNamePropertyValidator(properties).assertSuccess();
    return {
        CertificateName: cdk.stringToCloudFormation(properties.certificateName),
        DomainNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.domainNames),
    };
}

// @ts-ignore TS6133
function CfnContainerPublicDomainNamePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.PublicDomainNameProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.PublicDomainNameProperty>();
    ret.addPropertyResult('certificateName', 'CertificateName', properties.CertificateName != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateName) : undefined);
    ret.addPropertyResult('domainNames', 'DomainNames', properties.DomainNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.DomainNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContainer {
    /**
     * `PublicEndpoint` is a property of the [ContainerServiceDeployment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-containerservicedeployment.html) property. It describes describes the settings of the public endpoint of a container on a container service.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicendpoint.html
     */
    export interface PublicEndpointProperty {
        /**
         * The name of the container entry of the deployment that the endpoint configuration applies to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicendpoint.html#cfn-lightsail-container-publicendpoint-containername
         */
        readonly containerName?: string;
        /**
         * The port of the specified container to which traffic is forwarded to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicendpoint.html#cfn-lightsail-container-publicendpoint-containerport
         */
        readonly containerPort?: number;
        /**
         * An object that describes the health check configuration of the container.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicendpoint.html#cfn-lightsail-container-publicendpoint-healthcheckconfig
         */
        readonly healthCheckConfig?: CfnContainer.HealthCheckConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PublicEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `PublicEndpointProperty`
 *
 * @returns the result of the validation.
 */
function CfnContainer_PublicEndpointPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('containerName', cdk.validateString)(properties.containerName));
    errors.collect(cdk.propertyValidator('containerPort', cdk.validateNumber)(properties.containerPort));
    errors.collect(cdk.propertyValidator('healthCheckConfig', CfnContainer_HealthCheckConfigPropertyValidator)(properties.healthCheckConfig));
    return errors.wrap('supplied properties not correct for "PublicEndpointProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Container.PublicEndpoint` resource
 *
 * @param properties - the TypeScript properties of a `PublicEndpointProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Container.PublicEndpoint` resource.
 */
// @ts-ignore TS6133
function cfnContainerPublicEndpointPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContainer_PublicEndpointPropertyValidator(properties).assertSuccess();
    return {
        ContainerName: cdk.stringToCloudFormation(properties.containerName),
        ContainerPort: cdk.numberToCloudFormation(properties.containerPort),
        HealthCheckConfig: cfnContainerHealthCheckConfigPropertyToCloudFormation(properties.healthCheckConfig),
    };
}

// @ts-ignore TS6133
function CfnContainerPublicEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.PublicEndpointProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.PublicEndpointProperty>();
    ret.addPropertyResult('containerName', 'ContainerName', properties.ContainerName != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerName) : undefined);
    ret.addPropertyResult('containerPort', 'ContainerPort', properties.ContainerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContainerPort) : undefined);
    ret.addPropertyResult('healthCheckConfig', 'HealthCheckConfig', properties.HealthCheckConfig != null ? CfnContainerHealthCheckConfigPropertyFromCloudFormation(properties.HealthCheckConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDatabase`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html
 */
export interface CfnDatabaseProps {

    /**
     * The meaning of this parameter differs according to the database engine you use.
     *
     * *MySQL*
     *
     * The name of the database to create when the Lightsail database resource is created. If this parameter isn't specified, no database is created in the database resource.
     *
     * Constraints:
     *
     * - Must contain 1-64 letters or numbers.
     * - Must begin with a letter. Subsequent characters can be letters, underscores, or numbers (0-9).
     * - Can't be a word reserved by the specified database engine.
     *
     * For more information about reserved words in MySQL, see the Keywords and Reserved Words articles for [MySQL 5.6](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.6/en/keywords.html) , [MySQL 5.7](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.7/en/keywords.html) , and [MySQL 8.0](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/8.0/en/keywords.html) .
     *
     * *PostgreSQL*
     *
     * The name of the database to create when the Lightsail database resource is created. If this parameter isn't specified, a database named `postgres` is created in the database resource.
     *
     * Constraints:
     *
     * - Must contain 1-63 letters or numbers.
     * - Must begin with a letter. Subsequent characters can be letters, underscores, or numbers (0-9).
     * - Can't be a word reserved by the specified database engine.
     *
     * For more information about reserved words in PostgreSQL, see the SQL Key Words articles for [PostgreSQL 9.6](https://docs.aws.amazon.com/https://www.postgresql.org/docs/9.6/sql-keywords-appendix.html) , [PostgreSQL 10](https://docs.aws.amazon.com/https://www.postgresql.org/docs/10/sql-keywords-appendix.html) , [PostgreSQL 11](https://docs.aws.amazon.com/https://www.postgresql.org/docs/11/sql-keywords-appendix.html) , and [PostgreSQL 12](https://docs.aws.amazon.com/https://www.postgresql.org/docs/12/sql-keywords-appendix.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-masterdatabasename
     */
    readonly masterDatabaseName: string;

    /**
     * The name for the primary user.
     *
     * *MySQL*
     *
     * Constraints:
     *
     * - Required for MySQL.
     * - Must be 1-16 letters or numbers. Can contain underscores.
     * - First character must be a letter.
     * - Can't be a reserved word for the chosen database engine.
     *
     * For more information about reserved words in MySQL 5.6 or 5.7, see the Keywords and Reserved Words articles for [MySQL 5.6](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.6/en/keywords.html) , [MySQL 5.7](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.7/en/keywords.html) , or [MySQL 8.0](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/8.0/en/keywords.html) .
     *
     * *PostgreSQL*
     *
     * Constraints:
     *
     * - Required for PostgreSQL.
     * - Must be 1-63 letters or numbers. Can contain underscores.
     * - First character must be a letter.
     * - Can't be a reserved word for the chosen database engine.
     *
     * For more information about reserved words in MySQL 5.6 or 5.7, see the Keywords and Reserved Words articles for [PostgreSQL 9.6](https://docs.aws.amazon.com/https://www.postgresql.org/docs/9.6/sql-keywords-appendix.html) , [PostgreSQL 10](https://docs.aws.amazon.com/https://www.postgresql.org/docs/10/sql-keywords-appendix.html) , [PostgreSQL 11](https://docs.aws.amazon.com/https://www.postgresql.org/docs/11/sql-keywords-appendix.html) , and [PostgreSQL 12](https://docs.aws.amazon.com/https://www.postgresql.org/docs/12/sql-keywords-appendix.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-masterusername
     */
    readonly masterUsername: string;

    /**
     * The blueprint ID for the database (for example, `mysql_8_0` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabaseblueprintid
     */
    readonly relationalDatabaseBlueprintId: string;

    /**
     * The bundle ID for the database (for example, `medium_1_0` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabasebundleid
     */
    readonly relationalDatabaseBundleId: string;

    /**
     * The name of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabasename
     */
    readonly relationalDatabaseName: string;

    /**
     * The Availability Zone for the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * A Boolean value indicating whether automated backup retention is enabled for the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-backupretention
     */
    readonly backupRetention?: boolean | cdk.IResolvable;

    /**
     * The certificate associated with the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-cacertificateidentifier
     */
    readonly caCertificateIdentifier?: string;

    /**
     * The password for the primary user of the database. The password can include any printable ASCII character except the following: /, ", or @. It cannot contain spaces.
     *
     * > The `MasterUserPassword` and `RotateMasterUserPassword` parameters cannot be used together in the same template.
     *
     * *MySQL*
     *
     * Constraints: Must contain 8-41 characters.
     *
     * *PostgreSQL*
     *
     * Constraints: Must contain 8-128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-masteruserpassword
     */
    readonly masterUserPassword?: string;

    /**
     * The daily time range during which automated backups are created for the database (for example, `16:00-16:30` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-preferredbackupwindow
     */
    readonly preferredBackupWindow?: string;

    /**
     * The weekly time range during which system maintenance can occur for the database, formatted as follows: `ddd:hh24:mi-ddd:hh24:mi` . For example, `Tue:17:00-Tue:17:30` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-preferredmaintenancewindow
     */
    readonly preferredMaintenanceWindow?: string;

    /**
     * A Boolean value indicating whether the database is accessible to anyone on the internet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-publiclyaccessible
     */
    readonly publiclyAccessible?: boolean | cdk.IResolvable;

    /**
     * An array of parameters for the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabaseparameters
     */
    readonly relationalDatabaseParameters?: Array<CfnDatabase.RelationalDatabaseParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A Boolean value indicating whether to change the primary user password to a new, strong password generated by Lightsail .
     *
     * > The `RotateMasterUserPassword` and `MasterUserPassword` parameters cannot be used together in the same template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-rotatemasteruserpassword
     */
    readonly rotateMasterUserPassword?: boolean | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDatabaseProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatabaseProps`
 *
 * @returns the result of the validation.
 */
function CfnDatabasePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('backupRetention', cdk.validateBoolean)(properties.backupRetention));
    errors.collect(cdk.propertyValidator('caCertificateIdentifier', cdk.validateString)(properties.caCertificateIdentifier));
    errors.collect(cdk.propertyValidator('masterDatabaseName', cdk.requiredValidator)(properties.masterDatabaseName));
    errors.collect(cdk.propertyValidator('masterDatabaseName', cdk.validateString)(properties.masterDatabaseName));
    errors.collect(cdk.propertyValidator('masterUserPassword', cdk.validateString)(properties.masterUserPassword));
    errors.collect(cdk.propertyValidator('masterUsername', cdk.requiredValidator)(properties.masterUsername));
    errors.collect(cdk.propertyValidator('masterUsername', cdk.validateString)(properties.masterUsername));
    errors.collect(cdk.propertyValidator('preferredBackupWindow', cdk.validateString)(properties.preferredBackupWindow));
    errors.collect(cdk.propertyValidator('preferredMaintenanceWindow', cdk.validateString)(properties.preferredMaintenanceWindow));
    errors.collect(cdk.propertyValidator('publiclyAccessible', cdk.validateBoolean)(properties.publiclyAccessible));
    errors.collect(cdk.propertyValidator('relationalDatabaseBlueprintId', cdk.requiredValidator)(properties.relationalDatabaseBlueprintId));
    errors.collect(cdk.propertyValidator('relationalDatabaseBlueprintId', cdk.validateString)(properties.relationalDatabaseBlueprintId));
    errors.collect(cdk.propertyValidator('relationalDatabaseBundleId', cdk.requiredValidator)(properties.relationalDatabaseBundleId));
    errors.collect(cdk.propertyValidator('relationalDatabaseBundleId', cdk.validateString)(properties.relationalDatabaseBundleId));
    errors.collect(cdk.propertyValidator('relationalDatabaseName', cdk.requiredValidator)(properties.relationalDatabaseName));
    errors.collect(cdk.propertyValidator('relationalDatabaseName', cdk.validateString)(properties.relationalDatabaseName));
    errors.collect(cdk.propertyValidator('relationalDatabaseParameters', cdk.listValidator(CfnDatabase_RelationalDatabaseParameterPropertyValidator))(properties.relationalDatabaseParameters));
    errors.collect(cdk.propertyValidator('rotateMasterUserPassword', cdk.validateBoolean)(properties.rotateMasterUserPassword));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDatabaseProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Database` resource
 *
 * @param properties - the TypeScript properties of a `CfnDatabaseProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Database` resource.
 */
// @ts-ignore TS6133
function cfnDatabasePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatabasePropsValidator(properties).assertSuccess();
    return {
        MasterDatabaseName: cdk.stringToCloudFormation(properties.masterDatabaseName),
        MasterUsername: cdk.stringToCloudFormation(properties.masterUsername),
        RelationalDatabaseBlueprintId: cdk.stringToCloudFormation(properties.relationalDatabaseBlueprintId),
        RelationalDatabaseBundleId: cdk.stringToCloudFormation(properties.relationalDatabaseBundleId),
        RelationalDatabaseName: cdk.stringToCloudFormation(properties.relationalDatabaseName),
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
        BackupRetention: cdk.booleanToCloudFormation(properties.backupRetention),
        CaCertificateIdentifier: cdk.stringToCloudFormation(properties.caCertificateIdentifier),
        MasterUserPassword: cdk.stringToCloudFormation(properties.masterUserPassword),
        PreferredBackupWindow: cdk.stringToCloudFormation(properties.preferredBackupWindow),
        PreferredMaintenanceWindow: cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
        PubliclyAccessible: cdk.booleanToCloudFormation(properties.publiclyAccessible),
        RelationalDatabaseParameters: cdk.listMapper(cfnDatabaseRelationalDatabaseParameterPropertyToCloudFormation)(properties.relationalDatabaseParameters),
        RotateMasterUserPassword: cdk.booleanToCloudFormation(properties.rotateMasterUserPassword),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDatabasePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatabaseProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabaseProps>();
    ret.addPropertyResult('masterDatabaseName', 'MasterDatabaseName', cfn_parse.FromCloudFormation.getString(properties.MasterDatabaseName));
    ret.addPropertyResult('masterUsername', 'MasterUsername', cfn_parse.FromCloudFormation.getString(properties.MasterUsername));
    ret.addPropertyResult('relationalDatabaseBlueprintId', 'RelationalDatabaseBlueprintId', cfn_parse.FromCloudFormation.getString(properties.RelationalDatabaseBlueprintId));
    ret.addPropertyResult('relationalDatabaseBundleId', 'RelationalDatabaseBundleId', cfn_parse.FromCloudFormation.getString(properties.RelationalDatabaseBundleId));
    ret.addPropertyResult('relationalDatabaseName', 'RelationalDatabaseName', cfn_parse.FromCloudFormation.getString(properties.RelationalDatabaseName));
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined);
    ret.addPropertyResult('backupRetention', 'BackupRetention', properties.BackupRetention != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BackupRetention) : undefined);
    ret.addPropertyResult('caCertificateIdentifier', 'CaCertificateIdentifier', properties.CaCertificateIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.CaCertificateIdentifier) : undefined);
    ret.addPropertyResult('masterUserPassword', 'MasterUserPassword', properties.MasterUserPassword != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserPassword) : undefined);
    ret.addPropertyResult('preferredBackupWindow', 'PreferredBackupWindow', properties.PreferredBackupWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredBackupWindow) : undefined);
    ret.addPropertyResult('preferredMaintenanceWindow', 'PreferredMaintenanceWindow', properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined);
    ret.addPropertyResult('publiclyAccessible', 'PubliclyAccessible', properties.PubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible) : undefined);
    ret.addPropertyResult('relationalDatabaseParameters', 'RelationalDatabaseParameters', properties.RelationalDatabaseParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnDatabaseRelationalDatabaseParameterPropertyFromCloudFormation)(properties.RelationalDatabaseParameters) : undefined);
    ret.addPropertyResult('rotateMasterUserPassword', 'RotateMasterUserPassword', properties.RotateMasterUserPassword != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RotateMasterUserPassword) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lightsail::Database`
 *
 * The `AWS::Lightsail::Database` resource specifies an Amazon Lightsail database.
 *
 * @cloudformationResource AWS::Lightsail::Database
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html
 */
export class CfnDatabase extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lightsail::Database";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatabase {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDatabasePropsFromCloudFormation(resourceProperties);
        const ret = new CfnDatabase(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the database (for example, `arn:aws:lightsail:us-east-2:123456789101:RelationalDatabase/244ad76f-8aad-4741-809f-12345EXAMPLE` ).
     * @cloudformationAttribute DatabaseArn
     */
    public readonly attrDatabaseArn: string;

    /**
     * The meaning of this parameter differs according to the database engine you use.
     *
     * *MySQL*
     *
     * The name of the database to create when the Lightsail database resource is created. If this parameter isn't specified, no database is created in the database resource.
     *
     * Constraints:
     *
     * - Must contain 1-64 letters or numbers.
     * - Must begin with a letter. Subsequent characters can be letters, underscores, or numbers (0-9).
     * - Can't be a word reserved by the specified database engine.
     *
     * For more information about reserved words in MySQL, see the Keywords and Reserved Words articles for [MySQL 5.6](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.6/en/keywords.html) , [MySQL 5.7](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.7/en/keywords.html) , and [MySQL 8.0](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/8.0/en/keywords.html) .
     *
     * *PostgreSQL*
     *
     * The name of the database to create when the Lightsail database resource is created. If this parameter isn't specified, a database named `postgres` is created in the database resource.
     *
     * Constraints:
     *
     * - Must contain 1-63 letters or numbers.
     * - Must begin with a letter. Subsequent characters can be letters, underscores, or numbers (0-9).
     * - Can't be a word reserved by the specified database engine.
     *
     * For more information about reserved words in PostgreSQL, see the SQL Key Words articles for [PostgreSQL 9.6](https://docs.aws.amazon.com/https://www.postgresql.org/docs/9.6/sql-keywords-appendix.html) , [PostgreSQL 10](https://docs.aws.amazon.com/https://www.postgresql.org/docs/10/sql-keywords-appendix.html) , [PostgreSQL 11](https://docs.aws.amazon.com/https://www.postgresql.org/docs/11/sql-keywords-appendix.html) , and [PostgreSQL 12](https://docs.aws.amazon.com/https://www.postgresql.org/docs/12/sql-keywords-appendix.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-masterdatabasename
     */
    public masterDatabaseName: string;

    /**
     * The name for the primary user.
     *
     * *MySQL*
     *
     * Constraints:
     *
     * - Required for MySQL.
     * - Must be 1-16 letters or numbers. Can contain underscores.
     * - First character must be a letter.
     * - Can't be a reserved word for the chosen database engine.
     *
     * For more information about reserved words in MySQL 5.6 or 5.7, see the Keywords and Reserved Words articles for [MySQL 5.6](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.6/en/keywords.html) , [MySQL 5.7](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.7/en/keywords.html) , or [MySQL 8.0](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/8.0/en/keywords.html) .
     *
     * *PostgreSQL*
     *
     * Constraints:
     *
     * - Required for PostgreSQL.
     * - Must be 1-63 letters or numbers. Can contain underscores.
     * - First character must be a letter.
     * - Can't be a reserved word for the chosen database engine.
     *
     * For more information about reserved words in MySQL 5.6 or 5.7, see the Keywords and Reserved Words articles for [PostgreSQL 9.6](https://docs.aws.amazon.com/https://www.postgresql.org/docs/9.6/sql-keywords-appendix.html) , [PostgreSQL 10](https://docs.aws.amazon.com/https://www.postgresql.org/docs/10/sql-keywords-appendix.html) , [PostgreSQL 11](https://docs.aws.amazon.com/https://www.postgresql.org/docs/11/sql-keywords-appendix.html) , and [PostgreSQL 12](https://docs.aws.amazon.com/https://www.postgresql.org/docs/12/sql-keywords-appendix.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-masterusername
     */
    public masterUsername: string;

    /**
     * The blueprint ID for the database (for example, `mysql_8_0` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabaseblueprintid
     */
    public relationalDatabaseBlueprintId: string;

    /**
     * The bundle ID for the database (for example, `medium_1_0` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabasebundleid
     */
    public relationalDatabaseBundleId: string;

    /**
     * The name of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabasename
     */
    public relationalDatabaseName: string;

    /**
     * The Availability Zone for the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-availabilityzone
     */
    public availabilityZone: string | undefined;

    /**
     * A Boolean value indicating whether automated backup retention is enabled for the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-backupretention
     */
    public backupRetention: boolean | cdk.IResolvable | undefined;

    /**
     * The certificate associated with the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-cacertificateidentifier
     */
    public caCertificateIdentifier: string | undefined;

    /**
     * The password for the primary user of the database. The password can include any printable ASCII character except the following: /, ", or @. It cannot contain spaces.
     *
     * > The `MasterUserPassword` and `RotateMasterUserPassword` parameters cannot be used together in the same template.
     *
     * *MySQL*
     *
     * Constraints: Must contain 8-41 characters.
     *
     * *PostgreSQL*
     *
     * Constraints: Must contain 8-128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-masteruserpassword
     */
    public masterUserPassword: string | undefined;

    /**
     * The daily time range during which automated backups are created for the database (for example, `16:00-16:30` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-preferredbackupwindow
     */
    public preferredBackupWindow: string | undefined;

    /**
     * The weekly time range during which system maintenance can occur for the database, formatted as follows: `ddd:hh24:mi-ddd:hh24:mi` . For example, `Tue:17:00-Tue:17:30` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-preferredmaintenancewindow
     */
    public preferredMaintenanceWindow: string | undefined;

    /**
     * A Boolean value indicating whether the database is accessible to anyone on the internet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-publiclyaccessible
     */
    public publiclyAccessible: boolean | cdk.IResolvable | undefined;

    /**
     * An array of parameters for the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabaseparameters
     */
    public relationalDatabaseParameters: Array<CfnDatabase.RelationalDatabaseParameterProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A Boolean value indicating whether to change the primary user password to a new, strong password generated by Lightsail .
     *
     * > The `RotateMasterUserPassword` and `MasterUserPassword` parameters cannot be used together in the same template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-rotatemasteruserpassword
     */
    public rotateMasterUserPassword: boolean | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Lightsail::Database`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDatabaseProps) {
        super(scope, id, { type: CfnDatabase.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'masterDatabaseName', this);
        cdk.requireProperty(props, 'masterUsername', this);
        cdk.requireProperty(props, 'relationalDatabaseBlueprintId', this);
        cdk.requireProperty(props, 'relationalDatabaseBundleId', this);
        cdk.requireProperty(props, 'relationalDatabaseName', this);
        this.attrDatabaseArn = cdk.Token.asString(this.getAtt('DatabaseArn', cdk.ResolutionTypeHint.STRING));

        this.masterDatabaseName = props.masterDatabaseName;
        this.masterUsername = props.masterUsername;
        this.relationalDatabaseBlueprintId = props.relationalDatabaseBlueprintId;
        this.relationalDatabaseBundleId = props.relationalDatabaseBundleId;
        this.relationalDatabaseName = props.relationalDatabaseName;
        this.availabilityZone = props.availabilityZone;
        this.backupRetention = props.backupRetention;
        this.caCertificateIdentifier = props.caCertificateIdentifier;
        this.masterUserPassword = props.masterUserPassword;
        this.preferredBackupWindow = props.preferredBackupWindow;
        this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
        this.publiclyAccessible = props.publiclyAccessible;
        this.relationalDatabaseParameters = props.relationalDatabaseParameters;
        this.rotateMasterUserPassword = props.rotateMasterUserPassword;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Database", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDatabase.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            masterDatabaseName: this.masterDatabaseName,
            masterUsername: this.masterUsername,
            relationalDatabaseBlueprintId: this.relationalDatabaseBlueprintId,
            relationalDatabaseBundleId: this.relationalDatabaseBundleId,
            relationalDatabaseName: this.relationalDatabaseName,
            availabilityZone: this.availabilityZone,
            backupRetention: this.backupRetention,
            caCertificateIdentifier: this.caCertificateIdentifier,
            masterUserPassword: this.masterUserPassword,
            preferredBackupWindow: this.preferredBackupWindow,
            preferredMaintenanceWindow: this.preferredMaintenanceWindow,
            publiclyAccessible: this.publiclyAccessible,
            relationalDatabaseParameters: this.relationalDatabaseParameters,
            rotateMasterUserPassword: this.rotateMasterUserPassword,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDatabasePropsToCloudFormation(props);
    }
}

export namespace CfnDatabase {
    /**
     * `RelationalDatabaseParameter` is a property of the [AWS::Lightsail::Database](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html) resource. It describes parameters for the database.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html
     */
    export interface RelationalDatabaseParameterProperty {
        /**
         * The valid range of values for the parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-allowedvalues
         */
        readonly allowedValues?: string;
        /**
         * Indicates when parameter updates are applied.
         *
         * Can be `immediate` or `pending-reboot` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-applymethod
         */
        readonly applyMethod?: string;
        /**
         * Specifies the engine-specific parameter type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-applytype
         */
        readonly applyType?: string;
        /**
         * The valid data type of the parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-datatype
         */
        readonly dataType?: string;
        /**
         * A description of the parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-description
         */
        readonly description?: string;
        /**
         * A Boolean value indicating whether the parameter can be modified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-ismodifiable
         */
        readonly isModifiable?: boolean | cdk.IResolvable;
        /**
         * The name of the parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-parametername
         */
        readonly parameterName?: string;
        /**
         * The value for the parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-parametervalue
         */
        readonly parameterValue?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RelationalDatabaseParameterProperty`
 *
 * @param properties - the TypeScript properties of a `RelationalDatabaseParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnDatabase_RelationalDatabaseParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedValues', cdk.validateString)(properties.allowedValues));
    errors.collect(cdk.propertyValidator('applyMethod', cdk.validateString)(properties.applyMethod));
    errors.collect(cdk.propertyValidator('applyType', cdk.validateString)(properties.applyType));
    errors.collect(cdk.propertyValidator('dataType', cdk.validateString)(properties.dataType));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('isModifiable', cdk.validateBoolean)(properties.isModifiable));
    errors.collect(cdk.propertyValidator('parameterName', cdk.validateString)(properties.parameterName));
    errors.collect(cdk.propertyValidator('parameterValue', cdk.validateString)(properties.parameterValue));
    return errors.wrap('supplied properties not correct for "RelationalDatabaseParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Database.RelationalDatabaseParameter` resource
 *
 * @param properties - the TypeScript properties of a `RelationalDatabaseParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Database.RelationalDatabaseParameter` resource.
 */
// @ts-ignore TS6133
function cfnDatabaseRelationalDatabaseParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDatabase_RelationalDatabaseParameterPropertyValidator(properties).assertSuccess();
    return {
        AllowedValues: cdk.stringToCloudFormation(properties.allowedValues),
        ApplyMethod: cdk.stringToCloudFormation(properties.applyMethod),
        ApplyType: cdk.stringToCloudFormation(properties.applyType),
        DataType: cdk.stringToCloudFormation(properties.dataType),
        Description: cdk.stringToCloudFormation(properties.description),
        IsModifiable: cdk.booleanToCloudFormation(properties.isModifiable),
        ParameterName: cdk.stringToCloudFormation(properties.parameterName),
        ParameterValue: cdk.stringToCloudFormation(properties.parameterValue),
    };
}

// @ts-ignore TS6133
function CfnDatabaseRelationalDatabaseParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatabase.RelationalDatabaseParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabase.RelationalDatabaseParameterProperty>();
    ret.addPropertyResult('allowedValues', 'AllowedValues', properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getString(properties.AllowedValues) : undefined);
    ret.addPropertyResult('applyMethod', 'ApplyMethod', properties.ApplyMethod != null ? cfn_parse.FromCloudFormation.getString(properties.ApplyMethod) : undefined);
    ret.addPropertyResult('applyType', 'ApplyType', properties.ApplyType != null ? cfn_parse.FromCloudFormation.getString(properties.ApplyType) : undefined);
    ret.addPropertyResult('dataType', 'DataType', properties.DataType != null ? cfn_parse.FromCloudFormation.getString(properties.DataType) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('isModifiable', 'IsModifiable', properties.IsModifiable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsModifiable) : undefined);
    ret.addPropertyResult('parameterName', 'ParameterName', properties.ParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterName) : undefined);
    ret.addPropertyResult('parameterValue', 'ParameterValue', properties.ParameterValue != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterValue) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDisk`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html
 */
export interface CfnDiskProps {

    /**
     * The name of the disk.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-diskname
     */
    readonly diskName: string;

    /**
     * The size of the disk in GB.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-sizeingb
     */
    readonly sizeInGb: number;

    /**
     * An array of add-ons for the disk.
     *
     * > If the disk has an add-on enabled when performing a delete disk request, the add-on is automatically disabled before the disk is deleted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-addons
     */
    readonly addOns?: Array<CfnDisk.AddOnProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The AWS Region and Availability Zone location for the disk (for example, `us-east-1a` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDiskProps`
 *
 * @param properties - the TypeScript properties of a `CfnDiskProps`
 *
 * @returns the result of the validation.
 */
function CfnDiskPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addOns', cdk.listValidator(CfnDisk_AddOnPropertyValidator))(properties.addOns));
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('diskName', cdk.requiredValidator)(properties.diskName));
    errors.collect(cdk.propertyValidator('diskName', cdk.validateString)(properties.diskName));
    errors.collect(cdk.propertyValidator('sizeInGb', cdk.requiredValidator)(properties.sizeInGb));
    errors.collect(cdk.propertyValidator('sizeInGb', cdk.validateNumber)(properties.sizeInGb));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDiskProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Disk` resource
 *
 * @param properties - the TypeScript properties of a `CfnDiskProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Disk` resource.
 */
// @ts-ignore TS6133
function cfnDiskPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDiskPropsValidator(properties).assertSuccess();
    return {
        DiskName: cdk.stringToCloudFormation(properties.diskName),
        SizeInGb: cdk.numberToCloudFormation(properties.sizeInGb),
        AddOns: cdk.listMapper(cfnDiskAddOnPropertyToCloudFormation)(properties.addOns),
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDiskPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDiskProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDiskProps>();
    ret.addPropertyResult('diskName', 'DiskName', cfn_parse.FromCloudFormation.getString(properties.DiskName));
    ret.addPropertyResult('sizeInGb', 'SizeInGb', cfn_parse.FromCloudFormation.getNumber(properties.SizeInGb));
    ret.addPropertyResult('addOns', 'AddOns', properties.AddOns != null ? cfn_parse.FromCloudFormation.getArray(CfnDiskAddOnPropertyFromCloudFormation)(properties.AddOns) : undefined);
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lightsail::Disk`
 *
 * The `AWS::Lightsail::Disk` resource specifies a disk that can be attached to an Amazon Lightsail instance that is in the same AWS Region and Availability Zone.
 *
 * @cloudformationResource AWS::Lightsail::Disk
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html
 */
export class CfnDisk extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lightsail::Disk";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDisk {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDiskPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDisk(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The instance to which the disk is attached.
     * @cloudformationAttribute AttachedTo
     */
    public readonly attrAttachedTo: string;

    /**
     * (Deprecated) The attachment state of the disk.
     *
     * > In releases prior to November 14, 2017, this parameter returned `attached` for system disks in the API response. It is now deprecated, but still included in the response. Use `isAttached` instead.
     * @cloudformationAttribute AttachmentState
     */
    public readonly attrAttachmentState: string;

    /**
     * The Amazon Resource Name (ARN) of the disk.
     * @cloudformationAttribute DiskArn
     */
    public readonly attrDiskArn: string;

    /**
     * The input/output operations per second (IOPS) of the disk.
     * @cloudformationAttribute Iops
     */
    public readonly attrIops: number;

    /**
     * A Boolean value indicating whether the disk is attached to an instance.
     * @cloudformationAttribute IsAttached
     */
    public readonly attrIsAttached: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute Location.AvailabilityZone
     */
    public readonly attrLocationAvailabilityZone: string;

    /**
     *
     * @cloudformationAttribute Location.RegionName
     */
    public readonly attrLocationRegionName: string;

    /**
     * The path of the disk.
     * @cloudformationAttribute Path
     */
    public readonly attrPath: string;

    /**
     * The resource type of the disk (for example, `Disk` ).
     * @cloudformationAttribute ResourceType
     */
    public readonly attrResourceType: string;

    /**
     * The state of the disk (for example, `in-use` ).
     * @cloudformationAttribute State
     */
    public readonly attrState: string;

    /**
     * The support code of the disk.
     *
     * Include this code in your email to support when you have questions about a disk or another resource in Lightsail . This code helps our support team to look up your Lightsail information.
     * @cloudformationAttribute SupportCode
     */
    public readonly attrSupportCode: string;

    /**
     * The name of the disk.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-diskname
     */
    public diskName: string;

    /**
     * The size of the disk in GB.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-sizeingb
     */
    public sizeInGb: number;

    /**
     * An array of add-ons for the disk.
     *
     * > If the disk has an add-on enabled when performing a delete disk request, the add-on is automatically disabled before the disk is deleted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-addons
     */
    public addOns: Array<CfnDisk.AddOnProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The AWS Region and Availability Zone location for the disk (for example, `us-east-1a` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-availabilityzone
     */
    public availabilityZone: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Lightsail::Disk`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDiskProps) {
        super(scope, id, { type: CfnDisk.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'diskName', this);
        cdk.requireProperty(props, 'sizeInGb', this);
        this.attrAttachedTo = cdk.Token.asString(this.getAtt('AttachedTo', cdk.ResolutionTypeHint.STRING));
        this.attrAttachmentState = cdk.Token.asString(this.getAtt('AttachmentState', cdk.ResolutionTypeHint.STRING));
        this.attrDiskArn = cdk.Token.asString(this.getAtt('DiskArn', cdk.ResolutionTypeHint.STRING));
        this.attrIops = cdk.Token.asNumber(this.getAtt('Iops', cdk.ResolutionTypeHint.NUMBER));
        this.attrIsAttached = this.getAtt('IsAttached', cdk.ResolutionTypeHint.STRING);
        this.attrLocationAvailabilityZone = cdk.Token.asString(this.getAtt('Location.AvailabilityZone', cdk.ResolutionTypeHint.STRING));
        this.attrLocationRegionName = cdk.Token.asString(this.getAtt('Location.RegionName', cdk.ResolutionTypeHint.STRING));
        this.attrPath = cdk.Token.asString(this.getAtt('Path', cdk.ResolutionTypeHint.STRING));
        this.attrResourceType = cdk.Token.asString(this.getAtt('ResourceType', cdk.ResolutionTypeHint.STRING));
        this.attrState = cdk.Token.asString(this.getAtt('State', cdk.ResolutionTypeHint.STRING));
        this.attrSupportCode = cdk.Token.asString(this.getAtt('SupportCode', cdk.ResolutionTypeHint.STRING));

        this.diskName = props.diskName;
        this.sizeInGb = props.sizeInGb;
        this.addOns = props.addOns;
        this.availabilityZone = props.availabilityZone;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Disk", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDisk.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            diskName: this.diskName,
            sizeInGb: this.sizeInGb,
            addOns: this.addOns,
            availabilityZone: this.availabilityZone,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDiskPropsToCloudFormation(props);
    }
}

export namespace CfnDisk {
    /**
     * `AddOn` is a property of the [AWS::Lightsail::Disk](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html) resource. It describes the add-ons for a disk.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-addon.html
     */
    export interface AddOnProperty {
        /**
         * The add-on type (for example, `AutoSnapshot` ).
         *
         * > `AutoSnapshot` is the only add-on that can be enabled for a disk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-addon.html#cfn-lightsail-disk-addon-addontype
         */
        readonly addOnType: string;
        /**
         * The parameters for the automatic snapshot add-on, such as the daily time when an automatic snapshot will be created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-addon.html#cfn-lightsail-disk-addon-autosnapshotaddonrequest
         */
        readonly autoSnapshotAddOnRequest?: CfnDisk.AutoSnapshotAddOnProperty | cdk.IResolvable;
        /**
         * The status of the add-on.
         *
         * Valid Values: `Enabled` | `Disabled`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-addon.html#cfn-lightsail-disk-addon-status
         */
        readonly status?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AddOnProperty`
 *
 * @param properties - the TypeScript properties of a `AddOnProperty`
 *
 * @returns the result of the validation.
 */
function CfnDisk_AddOnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addOnType', cdk.requiredValidator)(properties.addOnType));
    errors.collect(cdk.propertyValidator('addOnType', cdk.validateString)(properties.addOnType));
    errors.collect(cdk.propertyValidator('autoSnapshotAddOnRequest', CfnDisk_AutoSnapshotAddOnPropertyValidator)(properties.autoSnapshotAddOnRequest));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "AddOnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Disk.AddOn` resource
 *
 * @param properties - the TypeScript properties of a `AddOnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Disk.AddOn` resource.
 */
// @ts-ignore TS6133
function cfnDiskAddOnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDisk_AddOnPropertyValidator(properties).assertSuccess();
    return {
        AddOnType: cdk.stringToCloudFormation(properties.addOnType),
        AutoSnapshotAddOnRequest: cfnDiskAutoSnapshotAddOnPropertyToCloudFormation(properties.autoSnapshotAddOnRequest),
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnDiskAddOnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDisk.AddOnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDisk.AddOnProperty>();
    ret.addPropertyResult('addOnType', 'AddOnType', cfn_parse.FromCloudFormation.getString(properties.AddOnType));
    ret.addPropertyResult('autoSnapshotAddOnRequest', 'AutoSnapshotAddOnRequest', properties.AutoSnapshotAddOnRequest != null ? CfnDiskAutoSnapshotAddOnPropertyFromCloudFormation(properties.AutoSnapshotAddOnRequest) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDisk {
    /**
     * `AutoSnapshotAddOn` is a property of the [AddOn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-addon.html) property. It describes the automatic snapshot add-on for a disk.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-autosnapshotaddon.html
     */
    export interface AutoSnapshotAddOnProperty {
        /**
         * The daily time when an automatic snapshot will be created.
         *
         * Constraints:
         *
         * - Must be in `HH:00` format, and in an hourly increment.
         * - Specified in Coordinated Universal Time (UTC).
         * - The snapshot will be automatically created between the time specified and up to 45 minutes after.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-autosnapshotaddon.html#cfn-lightsail-disk-autosnapshotaddon-snapshottimeofday
         */
        readonly snapshotTimeOfDay?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AutoSnapshotAddOnProperty`
 *
 * @param properties - the TypeScript properties of a `AutoSnapshotAddOnProperty`
 *
 * @returns the result of the validation.
 */
function CfnDisk_AutoSnapshotAddOnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('snapshotTimeOfDay', cdk.validateString)(properties.snapshotTimeOfDay));
    return errors.wrap('supplied properties not correct for "AutoSnapshotAddOnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Disk.AutoSnapshotAddOn` resource
 *
 * @param properties - the TypeScript properties of a `AutoSnapshotAddOnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Disk.AutoSnapshotAddOn` resource.
 */
// @ts-ignore TS6133
function cfnDiskAutoSnapshotAddOnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDisk_AutoSnapshotAddOnPropertyValidator(properties).assertSuccess();
    return {
        SnapshotTimeOfDay: cdk.stringToCloudFormation(properties.snapshotTimeOfDay),
    };
}

// @ts-ignore TS6133
function CfnDiskAutoSnapshotAddOnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDisk.AutoSnapshotAddOnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDisk.AutoSnapshotAddOnProperty>();
    ret.addPropertyResult('snapshotTimeOfDay', 'SnapshotTimeOfDay', properties.SnapshotTimeOfDay != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotTimeOfDay) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDisk {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-location.html
     */
    export interface LocationProperty {
        /**
         * `CfnDisk.LocationProperty.AvailabilityZone`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-location.html#cfn-lightsail-disk-location-availabilityzone
         */
        readonly availabilityZone?: string;
        /**
         * `CfnDisk.LocationProperty.RegionName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-location.html#cfn-lightsail-disk-location-regionname
         */
        readonly regionName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LocationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDisk_LocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('regionName', cdk.validateString)(properties.regionName));
    return errors.wrap('supplied properties not correct for "LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Disk.Location` resource
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Disk.Location` resource.
 */
// @ts-ignore TS6133
function cfnDiskLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDisk_LocationPropertyValidator(properties).assertSuccess();
    return {
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
        RegionName: cdk.stringToCloudFormation(properties.regionName),
    };
}

// @ts-ignore TS6133
function CfnDiskLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDisk.LocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDisk.LocationProperty>();
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined);
    ret.addPropertyResult('regionName', 'RegionName', properties.RegionName != null ? cfn_parse.FromCloudFormation.getString(properties.RegionName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDistribution`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html
 */
export interface CfnDistributionProps {

    /**
     * The ID of the bundle applied to the distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-bundleid
     */
    readonly bundleId: string;

    /**
     * An object that describes the default cache behavior of the distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-defaultcachebehavior
     */
    readonly defaultCacheBehavior: CfnDistribution.CacheBehaviorProperty | cdk.IResolvable;

    /**
     * The name of the distribution
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-distributionname
     */
    readonly distributionName: string;

    /**
     * An object that describes the origin resource of the distribution, such as a Lightsail instance, bucket, or load balancer.
     *
     * The distribution pulls, caches, and serves content from the origin.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-origin
     */
    readonly origin: CfnDistribution.InputOriginProperty | cdk.IResolvable;

    /**
     * An array of objects that describe the per-path cache behavior of the distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-cachebehaviors
     */
    readonly cacheBehaviors?: Array<CfnDistribution.CacheBehaviorPerPathProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An object that describes the cache behavior settings of the distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-cachebehaviorsettings
     */
    readonly cacheBehaviorSettings?: CfnDistribution.CacheSettingsProperty | cdk.IResolvable;

    /**
     * The name of the SSL/TLS certificate attached to the distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-certificatename
     */
    readonly certificateName?: string;

    /**
     * The IP address type of the distribution.
     *
     * The possible values are `ipv4` for IPv4 only, and `dualstack` for IPv4 and IPv6.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-ipaddresstype
     */
    readonly ipAddressType?: string;

    /**
     * A Boolean value indicating whether the distribution is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-isenabled
     */
    readonly isEnabled?: boolean | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDistributionProps`
 *
 * @param properties - the TypeScript properties of a `CfnDistributionProps`
 *
 * @returns the result of the validation.
 */
function CfnDistributionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bundleId', cdk.requiredValidator)(properties.bundleId));
    errors.collect(cdk.propertyValidator('bundleId', cdk.validateString)(properties.bundleId));
    errors.collect(cdk.propertyValidator('cacheBehaviorSettings', CfnDistribution_CacheSettingsPropertyValidator)(properties.cacheBehaviorSettings));
    errors.collect(cdk.propertyValidator('cacheBehaviors', cdk.listValidator(CfnDistribution_CacheBehaviorPerPathPropertyValidator))(properties.cacheBehaviors));
    errors.collect(cdk.propertyValidator('certificateName', cdk.validateString)(properties.certificateName));
    errors.collect(cdk.propertyValidator('defaultCacheBehavior', cdk.requiredValidator)(properties.defaultCacheBehavior));
    errors.collect(cdk.propertyValidator('defaultCacheBehavior', CfnDistribution_CacheBehaviorPropertyValidator)(properties.defaultCacheBehavior));
    errors.collect(cdk.propertyValidator('distributionName', cdk.requiredValidator)(properties.distributionName));
    errors.collect(cdk.propertyValidator('distributionName', cdk.validateString)(properties.distributionName));
    errors.collect(cdk.propertyValidator('ipAddressType', cdk.validateString)(properties.ipAddressType));
    errors.collect(cdk.propertyValidator('isEnabled', cdk.validateBoolean)(properties.isEnabled));
    errors.collect(cdk.propertyValidator('origin', cdk.requiredValidator)(properties.origin));
    errors.collect(cdk.propertyValidator('origin', CfnDistribution_InputOriginPropertyValidator)(properties.origin));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDistributionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Distribution` resource
 *
 * @param properties - the TypeScript properties of a `CfnDistributionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Distribution` resource.
 */
// @ts-ignore TS6133
function cfnDistributionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistributionPropsValidator(properties).assertSuccess();
    return {
        BundleId: cdk.stringToCloudFormation(properties.bundleId),
        DefaultCacheBehavior: cfnDistributionCacheBehaviorPropertyToCloudFormation(properties.defaultCacheBehavior),
        DistributionName: cdk.stringToCloudFormation(properties.distributionName),
        Origin: cfnDistributionInputOriginPropertyToCloudFormation(properties.origin),
        CacheBehaviors: cdk.listMapper(cfnDistributionCacheBehaviorPerPathPropertyToCloudFormation)(properties.cacheBehaviors),
        CacheBehaviorSettings: cfnDistributionCacheSettingsPropertyToCloudFormation(properties.cacheBehaviorSettings),
        CertificateName: cdk.stringToCloudFormation(properties.certificateName),
        IpAddressType: cdk.stringToCloudFormation(properties.ipAddressType),
        IsEnabled: cdk.booleanToCloudFormation(properties.isEnabled),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDistributionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionProps>();
    ret.addPropertyResult('bundleId', 'BundleId', cfn_parse.FromCloudFormation.getString(properties.BundleId));
    ret.addPropertyResult('defaultCacheBehavior', 'DefaultCacheBehavior', CfnDistributionCacheBehaviorPropertyFromCloudFormation(properties.DefaultCacheBehavior));
    ret.addPropertyResult('distributionName', 'DistributionName', cfn_parse.FromCloudFormation.getString(properties.DistributionName));
    ret.addPropertyResult('origin', 'Origin', CfnDistributionInputOriginPropertyFromCloudFormation(properties.Origin));
    ret.addPropertyResult('cacheBehaviors', 'CacheBehaviors', properties.CacheBehaviors != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionCacheBehaviorPerPathPropertyFromCloudFormation)(properties.CacheBehaviors) : undefined);
    ret.addPropertyResult('cacheBehaviorSettings', 'CacheBehaviorSettings', properties.CacheBehaviorSettings != null ? CfnDistributionCacheSettingsPropertyFromCloudFormation(properties.CacheBehaviorSettings) : undefined);
    ret.addPropertyResult('certificateName', 'CertificateName', properties.CertificateName != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateName) : undefined);
    ret.addPropertyResult('ipAddressType', 'IpAddressType', properties.IpAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddressType) : undefined);
    ret.addPropertyResult('isEnabled', 'IsEnabled', properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lightsail::Distribution`
 *
 * The `AWS::Lightsail::Distribution` resource specifies a content delivery network (CDN) distribution. You can create distributions only in the `us-east-1` AWS Region.
 *
 * A distribution is a globally distributed network of caching servers that improve the performance of your website or web application hosted on a Lightsail instance, static content hosted on a Lightsail bucket, or through a Lightsail load balancer.
 *
 * @cloudformationResource AWS::Lightsail::Distribution
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html
 */
export class CfnDistribution extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lightsail::Distribution";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDistribution {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDistributionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDistribution(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Indicates whether you can update the distribution’s current bundle to another bundle.
     * @cloudformationAttribute AbleToUpdateBundle
     */
    public readonly attrAbleToUpdateBundle: cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the distribution.
     * @cloudformationAttribute DistributionArn
     */
    public readonly attrDistributionArn: string;

    /**
     * The status of the distribution.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The ID of the bundle applied to the distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-bundleid
     */
    public bundleId: string;

    /**
     * An object that describes the default cache behavior of the distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-defaultcachebehavior
     */
    public defaultCacheBehavior: CfnDistribution.CacheBehaviorProperty | cdk.IResolvable;

    /**
     * The name of the distribution
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-distributionname
     */
    public distributionName: string;

    /**
     * An object that describes the origin resource of the distribution, such as a Lightsail instance, bucket, or load balancer.
     *
     * The distribution pulls, caches, and serves content from the origin.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-origin
     */
    public origin: CfnDistribution.InputOriginProperty | cdk.IResolvable;

    /**
     * An array of objects that describe the per-path cache behavior of the distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-cachebehaviors
     */
    public cacheBehaviors: Array<CfnDistribution.CacheBehaviorPerPathProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * An object that describes the cache behavior settings of the distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-cachebehaviorsettings
     */
    public cacheBehaviorSettings: CfnDistribution.CacheSettingsProperty | cdk.IResolvable | undefined;

    /**
     * The name of the SSL/TLS certificate attached to the distribution.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-certificatename
     */
    public certificateName: string | undefined;

    /**
     * The IP address type of the distribution.
     *
     * The possible values are `ipv4` for IPv4 only, and `dualstack` for IPv4 and IPv6.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-ipaddresstype
     */
    public ipAddressType: string | undefined;

    /**
     * A Boolean value indicating whether the distribution is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-isenabled
     */
    public isEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Lightsail::Distribution`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDistributionProps) {
        super(scope, id, { type: CfnDistribution.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'bundleId', this);
        cdk.requireProperty(props, 'defaultCacheBehavior', this);
        cdk.requireProperty(props, 'distributionName', this);
        cdk.requireProperty(props, 'origin', this);
        this.attrAbleToUpdateBundle = this.getAtt('AbleToUpdateBundle', cdk.ResolutionTypeHint.STRING);
        this.attrDistributionArn = cdk.Token.asString(this.getAtt('DistributionArn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.bundleId = props.bundleId;
        this.defaultCacheBehavior = props.defaultCacheBehavior;
        this.distributionName = props.distributionName;
        this.origin = props.origin;
        this.cacheBehaviors = props.cacheBehaviors;
        this.cacheBehaviorSettings = props.cacheBehaviorSettings;
        this.certificateName = props.certificateName;
        this.ipAddressType = props.ipAddressType;
        this.isEnabled = props.isEnabled;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Distribution", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDistribution.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            bundleId: this.bundleId,
            defaultCacheBehavior: this.defaultCacheBehavior,
            distributionName: this.distributionName,
            origin: this.origin,
            cacheBehaviors: this.cacheBehaviors,
            cacheBehaviorSettings: this.cacheBehaviorSettings,
            certificateName: this.certificateName,
            ipAddressType: this.ipAddressType,
            isEnabled: this.isEnabled,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDistributionPropsToCloudFormation(props);
    }
}

export namespace CfnDistribution {
    /**
     * `CacheBehavior` is a property of the [AWS::Lightsail::Distribution](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html) resource. It describes the default cache behavior of an Amazon Lightsail content delivery network (CDN) distribution.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachebehavior.html
     */
    export interface CacheBehaviorProperty {
        /**
         * The cache behavior of the distribution.
         *
         * The following cache behaviors can be specified:
         *
         * - *`cache`* - This option is best for static sites. When specified, your distribution caches and serves your entire website as static content. This behavior is ideal for websites with static content that doesn't change depending on who views it, or for websites that don't use cookies, headers, or query strings to personalize content.
         * - *`dont-cache`* - This option is best for sites that serve a mix of static and dynamic content. When specified, your distribution caches and serves only the content that is specified in the distribution’s `CacheBehaviorPerPath` parameter. This behavior is ideal for websites or web applications that use cookies, headers, and query strings to personalize content for individual users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachebehavior.html#cfn-lightsail-distribution-cachebehavior-behavior
         */
        readonly behavior?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CacheBehaviorProperty`
 *
 * @param properties - the TypeScript properties of a `CacheBehaviorProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_CacheBehaviorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('behavior', cdk.validateString)(properties.behavior));
    return errors.wrap('supplied properties not correct for "CacheBehaviorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.CacheBehavior` resource
 *
 * @param properties - the TypeScript properties of a `CacheBehaviorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.CacheBehavior` resource.
 */
// @ts-ignore TS6133
function cfnDistributionCacheBehaviorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_CacheBehaviorPropertyValidator(properties).assertSuccess();
    return {
        Behavior: cdk.stringToCloudFormation(properties.behavior),
    };
}

// @ts-ignore TS6133
function CfnDistributionCacheBehaviorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CacheBehaviorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CacheBehaviorProperty>();
    ret.addPropertyResult('behavior', 'Behavior', properties.Behavior != null ? cfn_parse.FromCloudFormation.getString(properties.Behavior) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * `CacheBehaviorPerPath` is a property of the [AWS::Lightsail::Distribution](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html) resource. It describes the per-path cache behavior of an Amazon Lightsail content delivery network (CDN) distribution.
     *
     * Use a per-path cache behavior to override the default cache behavior of a distribution, or to add an exception to it. For example, if you set the `CacheBehavior` to `cache` , you can use a per-path cache behavior to specify a directory, file, or file type that your distribution will cache. If you don’t want your distribution to cache a specified directory, file, or file type, set the per-path cache behavior to `dont-cache` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachebehaviorperpath.html
     */
    export interface CacheBehaviorPerPathProperty {
        /**
         * The cache behavior for the specified path.
         *
         * You can specify one of the following per-path cache behaviors:
         *
         * - *`cache`* - This behavior caches the specified path.
         * - *`dont-cache`* - This behavior doesn't cache the specified path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachebehaviorperpath.html#cfn-lightsail-distribution-cachebehaviorperpath-behavior
         */
        readonly behavior?: string;
        /**
         * The path to a directory or file to cache, or not cache. Use an asterisk symbol to specify wildcard directories ( `path/to/assets/*` ), and file types ( `*.html` , `*jpg` , `*js` ). Directories and file paths are case-sensitive.
         *
         * Examples:
         *
         * - Specify the following to cache all files in the document root of an Apache web server running on a instance.
         *
         * `var/www/html/`
         * - Specify the following file to cache only the index page in the document root of an Apache web server.
         *
         * `var/www/html/index.html`
         * - Specify the following to cache only the .html files in the document root of an Apache web server.
         *
         * `var/www/html/*.html`
         * - Specify the following to cache only the .jpg, .png, and .gif files in the images sub-directory of the document root of an Apache web server.
         *
         * `var/www/html/images/*.jpg`
         *
         * `var/www/html/images/*.png`
         *
         * `var/www/html/images/*.gif`
         *
         * Specify the following to cache all files in the images subdirectory of the document root of an Apache web server.
         *
         * `var/www/html/images/`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachebehaviorperpath.html#cfn-lightsail-distribution-cachebehaviorperpath-path
         */
        readonly path?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CacheBehaviorPerPathProperty`
 *
 * @param properties - the TypeScript properties of a `CacheBehaviorPerPathProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_CacheBehaviorPerPathPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('behavior', cdk.validateString)(properties.behavior));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    return errors.wrap('supplied properties not correct for "CacheBehaviorPerPathProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.CacheBehaviorPerPath` resource
 *
 * @param properties - the TypeScript properties of a `CacheBehaviorPerPathProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.CacheBehaviorPerPath` resource.
 */
// @ts-ignore TS6133
function cfnDistributionCacheBehaviorPerPathPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_CacheBehaviorPerPathPropertyValidator(properties).assertSuccess();
    return {
        Behavior: cdk.stringToCloudFormation(properties.behavior),
        Path: cdk.stringToCloudFormation(properties.path),
    };
}

// @ts-ignore TS6133
function CfnDistributionCacheBehaviorPerPathPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CacheBehaviorPerPathProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CacheBehaviorPerPathProperty>();
    ret.addPropertyResult('behavior', 'Behavior', properties.Behavior != null ? cfn_parse.FromCloudFormation.getString(properties.Behavior) : undefined);
    ret.addPropertyResult('path', 'Path', properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * `CacheSettings` is a property of the [AWS::Lightsail::Distribution](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html) resource. It describes the cache settings of an Amazon Lightsail content delivery network (CDN) distribution.
     *
     * These settings apply only to your distribution’s `CacheBehaviors` that have a `Behavior` of `cache` . This includes the `DefaultCacheBehavior` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html
     */
    export interface CacheSettingsProperty {
        /**
         * The HTTP methods that are processed and forwarded to the distribution's origin.
         *
         * You can specify the following options:
         *
         * - `GET,HEAD` - The distribution forwards the `GET` and `HEAD` methods.
         * - `GET,HEAD,OPTIONS` - The distribution forwards the `GET` , `HEAD` , and `OPTIONS` methods.
         * - `GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE` - The distribution forwards the `GET` , `HEAD` , `OPTIONS` , `PUT` , `PATCH` , `POST` , and `DELETE` methods.
         *
         * If you specify `GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE` , you might need to restrict access to your distribution's origin so users can't perform operations that you don't want them to. For example, you might not want users to have permission to delete objects from your origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-allowedhttpmethods
         */
        readonly allowedHttpMethods?: string;
        /**
         * The HTTP method responses that are cached by your distribution.
         *
         * You can specify the following options:
         *
         * - `GET,HEAD` - The distribution caches responses to the `GET` and `HEAD` methods.
         * - `GET,HEAD,OPTIONS` - The distribution caches responses to the `GET` , `HEAD` , and `OPTIONS` methods.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-cachedhttpmethods
         */
        readonly cachedHttpMethods?: string;
        /**
         * The default amount of time that objects stay in the distribution's cache before the distribution forwards another request to the origin to determine whether the content has been updated.
         *
         * > The value specified applies only when the origin does not add HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-defaultttl
         */
        readonly defaultTtl?: number;
        /**
         * An object that describes the cookies that are forwarded to the origin. Your content is cached based on the cookies that are forwarded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-forwardedcookies
         */
        readonly forwardedCookies?: CfnDistribution.CookieObjectProperty | cdk.IResolvable;
        /**
         * An object that describes the headers that are forwarded to the origin. Your content is cached based on the headers that are forwarded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-forwardedheaders
         */
        readonly forwardedHeaders?: CfnDistribution.HeaderObjectProperty | cdk.IResolvable;
        /**
         * An object that describes the query strings that are forwarded to the origin. Your content is cached based on the query strings that are forwarded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-forwardedquerystrings
         */
        readonly forwardedQueryStrings?: CfnDistribution.QueryStringObjectProperty | cdk.IResolvable;
        /**
         * The maximum amount of time that objects stay in the distribution's cache before the distribution forwards another request to the origin to determine whether the object has been updated.
         *
         * The value specified applies only when the origin adds HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-maximumttl
         */
        readonly maximumTtl?: number;
        /**
         * The minimum amount of time that objects stay in the distribution's cache before the distribution forwards another request to the origin to determine whether the object has been updated.
         *
         * A value of `0` must be specified for `minimumTTL` if the distribution is configured to forward all headers to the origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-minimumttl
         */
        readonly minimumTtl?: number;
    }
}

/**
 * Determine whether the given properties match those of a `CacheSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `CacheSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_CacheSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedHttpMethods', cdk.validateString)(properties.allowedHttpMethods));
    errors.collect(cdk.propertyValidator('cachedHttpMethods', cdk.validateString)(properties.cachedHttpMethods));
    errors.collect(cdk.propertyValidator('defaultTtl', cdk.validateNumber)(properties.defaultTtl));
    errors.collect(cdk.propertyValidator('forwardedCookies', CfnDistribution_CookieObjectPropertyValidator)(properties.forwardedCookies));
    errors.collect(cdk.propertyValidator('forwardedHeaders', CfnDistribution_HeaderObjectPropertyValidator)(properties.forwardedHeaders));
    errors.collect(cdk.propertyValidator('forwardedQueryStrings', CfnDistribution_QueryStringObjectPropertyValidator)(properties.forwardedQueryStrings));
    errors.collect(cdk.propertyValidator('maximumTtl', cdk.validateNumber)(properties.maximumTtl));
    errors.collect(cdk.propertyValidator('minimumTtl', cdk.validateNumber)(properties.minimumTtl));
    return errors.wrap('supplied properties not correct for "CacheSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.CacheSettings` resource
 *
 * @param properties - the TypeScript properties of a `CacheSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.CacheSettings` resource.
 */
// @ts-ignore TS6133
function cfnDistributionCacheSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_CacheSettingsPropertyValidator(properties).assertSuccess();
    return {
        AllowedHTTPMethods: cdk.stringToCloudFormation(properties.allowedHttpMethods),
        CachedHTTPMethods: cdk.stringToCloudFormation(properties.cachedHttpMethods),
        DefaultTTL: cdk.numberToCloudFormation(properties.defaultTtl),
        ForwardedCookies: cfnDistributionCookieObjectPropertyToCloudFormation(properties.forwardedCookies),
        ForwardedHeaders: cfnDistributionHeaderObjectPropertyToCloudFormation(properties.forwardedHeaders),
        ForwardedQueryStrings: cfnDistributionQueryStringObjectPropertyToCloudFormation(properties.forwardedQueryStrings),
        MaximumTTL: cdk.numberToCloudFormation(properties.maximumTtl),
        MinimumTTL: cdk.numberToCloudFormation(properties.minimumTtl),
    };
}

// @ts-ignore TS6133
function CfnDistributionCacheSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CacheSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CacheSettingsProperty>();
    ret.addPropertyResult('allowedHttpMethods', 'AllowedHTTPMethods', properties.AllowedHTTPMethods != null ? cfn_parse.FromCloudFormation.getString(properties.AllowedHTTPMethods) : undefined);
    ret.addPropertyResult('cachedHttpMethods', 'CachedHTTPMethods', properties.CachedHTTPMethods != null ? cfn_parse.FromCloudFormation.getString(properties.CachedHTTPMethods) : undefined);
    ret.addPropertyResult('defaultTtl', 'DefaultTTL', properties.DefaultTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultTTL) : undefined);
    ret.addPropertyResult('forwardedCookies', 'ForwardedCookies', properties.ForwardedCookies != null ? CfnDistributionCookieObjectPropertyFromCloudFormation(properties.ForwardedCookies) : undefined);
    ret.addPropertyResult('forwardedHeaders', 'ForwardedHeaders', properties.ForwardedHeaders != null ? CfnDistributionHeaderObjectPropertyFromCloudFormation(properties.ForwardedHeaders) : undefined);
    ret.addPropertyResult('forwardedQueryStrings', 'ForwardedQueryStrings', properties.ForwardedQueryStrings != null ? CfnDistributionQueryStringObjectPropertyFromCloudFormation(properties.ForwardedQueryStrings) : undefined);
    ret.addPropertyResult('maximumTtl', 'MaximumTTL', properties.MaximumTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumTTL) : undefined);
    ret.addPropertyResult('minimumTtl', 'MinimumTTL', properties.MinimumTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumTTL) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * `CookieObject` is a property of the [CacheSettings](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html) property. It describes whether an Amazon Lightsail content delivery network (CDN) distribution forwards cookies to the origin and, if so, which ones.
     *
     * For the cookies that you specify, your distribution caches separate versions of the specified content based on the cookie values in viewer requests.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cookieobject.html
     */
    export interface CookieObjectProperty {
        /**
         * The specific cookies to forward to your distribution's origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cookieobject.html#cfn-lightsail-distribution-cookieobject-cookiesallowlist
         */
        readonly cookiesAllowList?: string[];
        /**
         * Specifies which cookies to forward to the distribution's origin for a cache behavior.
         *
         * Use one of the following configurations for your distribution:
         *
         * - *`all`* - Forwards all cookies to your origin.
         * - *`none`* - Doesn’t forward cookies to your origin.
         * - *`allow-list`* - Forwards only the cookies that you specify using the `CookiesAllowList` parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cookieobject.html#cfn-lightsail-distribution-cookieobject-option
         */
        readonly option?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CookieObjectProperty`
 *
 * @param properties - the TypeScript properties of a `CookieObjectProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_CookieObjectPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cookiesAllowList', cdk.listValidator(cdk.validateString))(properties.cookiesAllowList));
    errors.collect(cdk.propertyValidator('option', cdk.validateString)(properties.option));
    return errors.wrap('supplied properties not correct for "CookieObjectProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.CookieObject` resource
 *
 * @param properties - the TypeScript properties of a `CookieObjectProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.CookieObject` resource.
 */
// @ts-ignore TS6133
function cfnDistributionCookieObjectPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_CookieObjectPropertyValidator(properties).assertSuccess();
    return {
        CookiesAllowList: cdk.listMapper(cdk.stringToCloudFormation)(properties.cookiesAllowList),
        Option: cdk.stringToCloudFormation(properties.option),
    };
}

// @ts-ignore TS6133
function CfnDistributionCookieObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CookieObjectProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CookieObjectProperty>();
    ret.addPropertyResult('cookiesAllowList', 'CookiesAllowList', properties.CookiesAllowList != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CookiesAllowList) : undefined);
    ret.addPropertyResult('option', 'Option', properties.Option != null ? cfn_parse.FromCloudFormation.getString(properties.Option) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * `HeaderObject` is a property of the [CacheSettings](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html) property. It describes the request headers used by your distribution, which caches your content based on the request headers.
     *
     * For the headers that you specify, your distribution caches separate versions of the specified content based on the header values in viewer requests. For example, suppose that viewer requests for logo.jpg contain a custom product header that has a value of either acme or apex. Also, suppose that you configure your distribution to cache your content based on values in the product header. Your distribution forwards the product header to the origin and caches the response from the origin once for each header value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-headerobject.html
     */
    export interface HeaderObjectProperty {
        /**
         * The specific headers to forward to your distribution's origin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-headerobject.html#cfn-lightsail-distribution-headerobject-headersallowlist
         */
        readonly headersAllowList?: string[];
        /**
         * The headers that you want your distribution to forward to your origin. Your distribution caches your content based on these headers.
         *
         * Use one of the following configurations for your distribution:
         *
         * - *`all`* - Forwards all headers to your origin..
         * - *`none`* - Forwards only the default headers.
         * - *`allow-list`* - Forwards only the headers that you specify using the `HeadersAllowList` parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-headerobject.html#cfn-lightsail-distribution-headerobject-option
         */
        readonly option?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HeaderObjectProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderObjectProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_HeaderObjectPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('headersAllowList', cdk.listValidator(cdk.validateString))(properties.headersAllowList));
    errors.collect(cdk.propertyValidator('option', cdk.validateString)(properties.option));
    return errors.wrap('supplied properties not correct for "HeaderObjectProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.HeaderObject` resource
 *
 * @param properties - the TypeScript properties of a `HeaderObjectProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.HeaderObject` resource.
 */
// @ts-ignore TS6133
function cfnDistributionHeaderObjectPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_HeaderObjectPropertyValidator(properties).assertSuccess();
    return {
        HeadersAllowList: cdk.listMapper(cdk.stringToCloudFormation)(properties.headersAllowList),
        Option: cdk.stringToCloudFormation(properties.option),
    };
}

// @ts-ignore TS6133
function CfnDistributionHeaderObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.HeaderObjectProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.HeaderObjectProperty>();
    ret.addPropertyResult('headersAllowList', 'HeadersAllowList', properties.HeadersAllowList != null ? cfn_parse.FromCloudFormation.getStringArray(properties.HeadersAllowList) : undefined);
    ret.addPropertyResult('option', 'Option', properties.Option != null ? cfn_parse.FromCloudFormation.getString(properties.Option) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * `InputOrigin` is a property of the [AWS::Lightsail::Distribution](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html) resource. It describes the origin resource of an Amazon Lightsail content delivery network (CDN) distribution.
     *
     * An origin can be a instance, bucket, or load balancer. A distribution pulls content from an origin, caches it, and serves it to viewers through a worldwide network of edge servers.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-inputorigin.html
     */
    export interface InputOriginProperty {
        /**
         * The name of the origin resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-inputorigin.html#cfn-lightsail-distribution-inputorigin-name
         */
        readonly name?: string;
        /**
         * The protocol that your Amazon Lightsail distribution uses when establishing a connection with your origin to pull content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-inputorigin.html#cfn-lightsail-distribution-inputorigin-protocolpolicy
         */
        readonly protocolPolicy?: string;
        /**
         * The AWS Region name of the origin resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-inputorigin.html#cfn-lightsail-distribution-inputorigin-regionname
         */
        readonly regionName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputOriginProperty`
 *
 * @param properties - the TypeScript properties of a `InputOriginProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_InputOriginPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('protocolPolicy', cdk.validateString)(properties.protocolPolicy));
    errors.collect(cdk.propertyValidator('regionName', cdk.validateString)(properties.regionName));
    return errors.wrap('supplied properties not correct for "InputOriginProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.InputOrigin` resource
 *
 * @param properties - the TypeScript properties of a `InputOriginProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.InputOrigin` resource.
 */
// @ts-ignore TS6133
function cfnDistributionInputOriginPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_InputOriginPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        ProtocolPolicy: cdk.stringToCloudFormation(properties.protocolPolicy),
        RegionName: cdk.stringToCloudFormation(properties.regionName),
    };
}

// @ts-ignore TS6133
function CfnDistributionInputOriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.InputOriginProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.InputOriginProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('protocolPolicy', 'ProtocolPolicy', properties.ProtocolPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.ProtocolPolicy) : undefined);
    ret.addPropertyResult('regionName', 'RegionName', properties.RegionName != null ? cfn_parse.FromCloudFormation.getString(properties.RegionName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDistribution {
    /**
     * `QueryStringObject` is a property of the [CacheSettings](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html) property. It describes the query string parameters that an Amazon Lightsail content delivery network (CDN) distribution to bases caching on.
     *
     * For the query strings that you specify, your distribution caches separate versions of the specified content based on the query string values in viewer requests.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-querystringobject.html
     */
    export interface QueryStringObjectProperty {
        /**
         * Indicates whether the distribution forwards and caches based on query strings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-querystringobject.html#cfn-lightsail-distribution-querystringobject-option
         */
        readonly option?: boolean | cdk.IResolvable;
        /**
         * The specific query strings that the distribution forwards to the origin.
         *
         * Your distribution caches content based on the specified query strings.
         *
         * If the `option` parameter is true, then your distribution forwards all query strings, regardless of what you specify using the `QueryStringsAllowList` parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-querystringobject.html#cfn-lightsail-distribution-querystringobject-querystringsallowlist
         */
        readonly queryStringsAllowList?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `QueryStringObjectProperty`
 *
 * @param properties - the TypeScript properties of a `QueryStringObjectProperty`
 *
 * @returns the result of the validation.
 */
function CfnDistribution_QueryStringObjectPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('option', cdk.validateBoolean)(properties.option));
    errors.collect(cdk.propertyValidator('queryStringsAllowList', cdk.listValidator(cdk.validateString))(properties.queryStringsAllowList));
    return errors.wrap('supplied properties not correct for "QueryStringObjectProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.QueryStringObject` resource
 *
 * @param properties - the TypeScript properties of a `QueryStringObjectProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Distribution.QueryStringObject` resource.
 */
// @ts-ignore TS6133
function cfnDistributionQueryStringObjectPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDistribution_QueryStringObjectPropertyValidator(properties).assertSuccess();
    return {
        Option: cdk.booleanToCloudFormation(properties.option),
        QueryStringsAllowList: cdk.listMapper(cdk.stringToCloudFormation)(properties.queryStringsAllowList),
    };
}

// @ts-ignore TS6133
function CfnDistributionQueryStringObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.QueryStringObjectProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.QueryStringObjectProperty>();
    ret.addPropertyResult('option', 'Option', properties.Option != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Option) : undefined);
    ret.addPropertyResult('queryStringsAllowList', 'QueryStringsAllowList', properties.QueryStringsAllowList != null ? cfn_parse.FromCloudFormation.getStringArray(properties.QueryStringsAllowList) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnInstance`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html
 */
export interface CfnInstanceProps {

    /**
     * The blueprint ID for the instance (for example, `os_amlinux_2016_03` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-blueprintid
     */
    readonly blueprintId: string;

    /**
     * The bundle ID for the instance (for example, `micro_1_0` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-bundleid
     */
    readonly bundleId: string;

    /**
     * The name of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-instancename
     */
    readonly instanceName: string;

    /**
     * An array of add-ons for the instance.
     *
     * > If the instance has an add-on enabled when performing a delete instance request, the add-on is automatically disabled before the instance is deleted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-addons
     */
    readonly addOns?: Array<CfnInstance.AddOnProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Availability Zone for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * The hardware properties for the instance, such as the vCPU count, attached disks, and amount of RAM.
     *
     * > The instance restarts when performing an attach disk or detach disk request. This resets the public IP address of your instance if a static IP isn't attached to it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-hardware
     */
    readonly hardware?: CfnInstance.HardwareProperty | cdk.IResolvable;

    /**
     * The name of the key pair to use for the instance.
     *
     * If no key pair name is specified, the Regional Lightsail default key pair is used.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-keypairname
     */
    readonly keyPairName?: string;

    /**
     * The location for the instance, such as the AWS Region and Availability Zone.
     *
     * > The `Location` property is read-only and should not be specified in a create instance or update instance request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-location
     */
    readonly location?: CfnInstance.LocationProperty | cdk.IResolvable;

    /**
     * The public ports and the monthly amount of data transfer allocated for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-networking
     */
    readonly networking?: CfnInstance.NetworkingProperty | cdk.IResolvable;

    /**
     * The status code and the state (for example, `running` ) of the instance.
     *
     * > The `State` property is read-only and should not be specified in a create instance or update instance request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-state
     */
    readonly state?: CfnInstance.StateProperty | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The optional launch script for the instance.
     *
     * Specify a launch script to configure an instance with additional user data. For example, you might want to specify `apt-get -y update` as a launch script.
     *
     * > Depending on the blueprint of your instance, the command to get software on your instance varies. Amazon Linux and CentOS use `yum` , Debian and Ubuntu use `apt-get` , and FreeBSD uses `pkg` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-userdata
     */
    readonly userData?: string;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceProps`
 *
 * @returns the result of the validation.
 */
function CfnInstancePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addOns', cdk.listValidator(CfnInstance_AddOnPropertyValidator))(properties.addOns));
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('blueprintId', cdk.requiredValidator)(properties.blueprintId));
    errors.collect(cdk.propertyValidator('blueprintId', cdk.validateString)(properties.blueprintId));
    errors.collect(cdk.propertyValidator('bundleId', cdk.requiredValidator)(properties.bundleId));
    errors.collect(cdk.propertyValidator('bundleId', cdk.validateString)(properties.bundleId));
    errors.collect(cdk.propertyValidator('hardware', CfnInstance_HardwarePropertyValidator)(properties.hardware));
    errors.collect(cdk.propertyValidator('instanceName', cdk.requiredValidator)(properties.instanceName));
    errors.collect(cdk.propertyValidator('instanceName', cdk.validateString)(properties.instanceName));
    errors.collect(cdk.propertyValidator('keyPairName', cdk.validateString)(properties.keyPairName));
    errors.collect(cdk.propertyValidator('location', CfnInstance_LocationPropertyValidator)(properties.location));
    errors.collect(cdk.propertyValidator('networking', CfnInstance_NetworkingPropertyValidator)(properties.networking));
    errors.collect(cdk.propertyValidator('state', CfnInstance_StatePropertyValidator)(properties.state));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('userData', cdk.validateString)(properties.userData));
    return errors.wrap('supplied properties not correct for "CfnInstanceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Instance` resource
 *
 * @param properties - the TypeScript properties of a `CfnInstanceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Instance` resource.
 */
// @ts-ignore TS6133
function cfnInstancePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstancePropsValidator(properties).assertSuccess();
    return {
        BlueprintId: cdk.stringToCloudFormation(properties.blueprintId),
        BundleId: cdk.stringToCloudFormation(properties.bundleId),
        InstanceName: cdk.stringToCloudFormation(properties.instanceName),
        AddOns: cdk.listMapper(cfnInstanceAddOnPropertyToCloudFormation)(properties.addOns),
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
        Hardware: cfnInstanceHardwarePropertyToCloudFormation(properties.hardware),
        KeyPairName: cdk.stringToCloudFormation(properties.keyPairName),
        Location: cfnInstanceLocationPropertyToCloudFormation(properties.location),
        Networking: cfnInstanceNetworkingPropertyToCloudFormation(properties.networking),
        State: cfnInstanceStatePropertyToCloudFormation(properties.state),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        UserData: cdk.stringToCloudFormation(properties.userData),
    };
}

// @ts-ignore TS6133
function CfnInstancePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceProps>();
    ret.addPropertyResult('blueprintId', 'BlueprintId', cfn_parse.FromCloudFormation.getString(properties.BlueprintId));
    ret.addPropertyResult('bundleId', 'BundleId', cfn_parse.FromCloudFormation.getString(properties.BundleId));
    ret.addPropertyResult('instanceName', 'InstanceName', cfn_parse.FromCloudFormation.getString(properties.InstanceName));
    ret.addPropertyResult('addOns', 'AddOns', properties.AddOns != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceAddOnPropertyFromCloudFormation)(properties.AddOns) : undefined);
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined);
    ret.addPropertyResult('hardware', 'Hardware', properties.Hardware != null ? CfnInstanceHardwarePropertyFromCloudFormation(properties.Hardware) : undefined);
    ret.addPropertyResult('keyPairName', 'KeyPairName', properties.KeyPairName != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPairName) : undefined);
    ret.addPropertyResult('location', 'Location', properties.Location != null ? CfnInstanceLocationPropertyFromCloudFormation(properties.Location) : undefined);
    ret.addPropertyResult('networking', 'Networking', properties.Networking != null ? CfnInstanceNetworkingPropertyFromCloudFormation(properties.Networking) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? CfnInstanceStatePropertyFromCloudFormation(properties.State) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('userData', 'UserData', properties.UserData != null ? cfn_parse.FromCloudFormation.getString(properties.UserData) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lightsail::Instance`
 *
 * The `AWS::Lightsail::Instance` resource specifies an Amazon Lightsail instance.
 *
 * @cloudformationResource AWS::Lightsail::Instance
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html
 */
export class CfnInstance extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lightsail::Instance";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstance {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnInstancePropsFromCloudFormation(resourceProperties);
        const ret = new CfnInstance(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The number of vCPUs the instance has.
     * @cloudformationAttribute Hardware.CpuCount
     */
    public readonly attrHardwareCpuCount: number;

    /**
     * The amount of RAM in GB on the instance (for example, `1.0` ).
     * @cloudformationAttribute Hardware.RamSizeInGb
     */
    public readonly attrHardwareRamSizeInGb: number;

    /**
     * The Amazon Resource Name (ARN) of the instance (for example, `arn:aws:lightsail:us-east-2:123456789101:Instance/244ad76f-8aad-4741-809f-12345EXAMPLE` ).
     * @cloudformationAttribute InstanceArn
     */
    public readonly attrInstanceArn: string;

    /**
     * A Boolean value indicating whether the instance has a static IP assigned to it.
     * @cloudformationAttribute IsStaticIp
     */
    public readonly attrIsStaticIp: cdk.IResolvable;

    /**
     * The AWS Region and Availability Zone where the instance is located.
     * @cloudformationAttribute Location.AvailabilityZone
     */
    public readonly attrLocationAvailabilityZone: string;

    /**
     * The AWS Region of the instance.
     * @cloudformationAttribute Location.RegionName
     */
    public readonly attrLocationRegionName: string;

    /**
     * The amount of allocated monthly data transfer (in GB) for an instance.
     * @cloudformationAttribute Networking.MonthlyTransfer.GbPerMonthAllocated
     */
    public readonly attrNetworkingMonthlyTransferGbPerMonthAllocated: string;

    /**
     * The private IP address of the instance.
     * @cloudformationAttribute PrivateIpAddress
     */
    public readonly attrPrivateIpAddress: string;

    /**
     * The public IP address of the instance.
     * @cloudformationAttribute PublicIpAddress
     */
    public readonly attrPublicIpAddress: string;

    /**
     * The resource type of the instance (for example, `Instance` ).
     * @cloudformationAttribute ResourceType
     */
    public readonly attrResourceType: string;

    /**
     * The name of the SSH key pair used by the instance.
     * @cloudformationAttribute SshKeyName
     */
    public readonly attrSshKeyName: string;

    /**
     * The status code of the instance.
     * @cloudformationAttribute State.Code
     */
    public readonly attrStateCode: number;

    /**
     * The state of the instance (for example, `running` or `pending` ).
     * @cloudformationAttribute State.Name
     */
    public readonly attrStateName: string;

    /**
     * The support code of the instance.
     *
     * Include this code in your email to support when you have questions about an instance or another resource in Lightsail . This code helps our support team to look up your Lightsail information.
     * @cloudformationAttribute SupportCode
     */
    public readonly attrSupportCode: string;

    /**
     * The user name for connecting to the instance (for example, `ec2-user` ).
     * @cloudformationAttribute UserName
     */
    public readonly attrUserName: string;

    /**
     * The blueprint ID for the instance (for example, `os_amlinux_2016_03` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-blueprintid
     */
    public blueprintId: string;

    /**
     * The bundle ID for the instance (for example, `micro_1_0` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-bundleid
     */
    public bundleId: string;

    /**
     * The name of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-instancename
     */
    public instanceName: string;

    /**
     * An array of add-ons for the instance.
     *
     * > If the instance has an add-on enabled when performing a delete instance request, the add-on is automatically disabled before the instance is deleted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-addons
     */
    public addOns: Array<CfnInstance.AddOnProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The Availability Zone for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-availabilityzone
     */
    public availabilityZone: string | undefined;

    /**
     * The hardware properties for the instance, such as the vCPU count, attached disks, and amount of RAM.
     *
     * > The instance restarts when performing an attach disk or detach disk request. This resets the public IP address of your instance if a static IP isn't attached to it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-hardware
     */
    public hardware: CfnInstance.HardwareProperty | cdk.IResolvable | undefined;

    /**
     * The name of the key pair to use for the instance.
     *
     * If no key pair name is specified, the Regional Lightsail default key pair is used.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-keypairname
     */
    public keyPairName: string | undefined;

    /**
     * The location for the instance, such as the AWS Region and Availability Zone.
     *
     * > The `Location` property is read-only and should not be specified in a create instance or update instance request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-location
     */
    public location: CfnInstance.LocationProperty | cdk.IResolvable | undefined;

    /**
     * The public ports and the monthly amount of data transfer allocated for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-networking
     */
    public networking: CfnInstance.NetworkingProperty | cdk.IResolvable | undefined;

    /**
     * The status code and the state (for example, `running` ) of the instance.
     *
     * > The `State` property is read-only and should not be specified in a create instance or update instance request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-state
     */
    public state: CfnInstance.StateProperty | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The optional launch script for the instance.
     *
     * Specify a launch script to configure an instance with additional user data. For example, you might want to specify `apt-get -y update` as a launch script.
     *
     * > Depending on the blueprint of your instance, the command to get software on your instance varies. Amazon Linux and CentOS use `yum` , Debian and Ubuntu use `apt-get` , and FreeBSD uses `pkg` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-userdata
     */
    public userData: string | undefined;

    /**
     * Create a new `AWS::Lightsail::Instance`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInstanceProps) {
        super(scope, id, { type: CfnInstance.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'blueprintId', this);
        cdk.requireProperty(props, 'bundleId', this);
        cdk.requireProperty(props, 'instanceName', this);
        this.attrHardwareCpuCount = cdk.Token.asNumber(this.getAtt('Hardware.CpuCount', cdk.ResolutionTypeHint.NUMBER));
        this.attrHardwareRamSizeInGb = cdk.Token.asNumber(this.getAtt('Hardware.RamSizeInGb', cdk.ResolutionTypeHint.NUMBER));
        this.attrInstanceArn = cdk.Token.asString(this.getAtt('InstanceArn', cdk.ResolutionTypeHint.STRING));
        this.attrIsStaticIp = this.getAtt('IsStaticIp', cdk.ResolutionTypeHint.STRING);
        this.attrLocationAvailabilityZone = cdk.Token.asString(this.getAtt('Location.AvailabilityZone', cdk.ResolutionTypeHint.STRING));
        this.attrLocationRegionName = cdk.Token.asString(this.getAtt('Location.RegionName', cdk.ResolutionTypeHint.STRING));
        this.attrNetworkingMonthlyTransferGbPerMonthAllocated = cdk.Token.asString(this.getAtt('Networking.MonthlyTransfer.GbPerMonthAllocated', cdk.ResolutionTypeHint.STRING));
        this.attrPrivateIpAddress = cdk.Token.asString(this.getAtt('PrivateIpAddress', cdk.ResolutionTypeHint.STRING));
        this.attrPublicIpAddress = cdk.Token.asString(this.getAtt('PublicIpAddress', cdk.ResolutionTypeHint.STRING));
        this.attrResourceType = cdk.Token.asString(this.getAtt('ResourceType', cdk.ResolutionTypeHint.STRING));
        this.attrSshKeyName = cdk.Token.asString(this.getAtt('SshKeyName', cdk.ResolutionTypeHint.STRING));
        this.attrStateCode = cdk.Token.asNumber(this.getAtt('State.Code', cdk.ResolutionTypeHint.NUMBER));
        this.attrStateName = cdk.Token.asString(this.getAtt('State.Name', cdk.ResolutionTypeHint.STRING));
        this.attrSupportCode = cdk.Token.asString(this.getAtt('SupportCode', cdk.ResolutionTypeHint.STRING));
        this.attrUserName = cdk.Token.asString(this.getAtt('UserName', cdk.ResolutionTypeHint.STRING));

        this.blueprintId = props.blueprintId;
        this.bundleId = props.bundleId;
        this.instanceName = props.instanceName;
        this.addOns = props.addOns;
        this.availabilityZone = props.availabilityZone;
        this.hardware = props.hardware;
        this.keyPairName = props.keyPairName;
        this.location = props.location;
        this.networking = props.networking;
        this.state = props.state;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Instance", props.tags, { tagPropertyName: 'tags' });
        this.userData = props.userData;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstance.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            blueprintId: this.blueprintId,
            bundleId: this.bundleId,
            instanceName: this.instanceName,
            addOns: this.addOns,
            availabilityZone: this.availabilityZone,
            hardware: this.hardware,
            keyPairName: this.keyPairName,
            location: this.location,
            networking: this.networking,
            state: this.state,
            tags: this.tags.renderTags(),
            userData: this.userData,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnInstancePropsToCloudFormation(props);
    }
}

export namespace CfnInstance {
    /**
     * `AddOn` is a property of the [AWS::Lightsail::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html) resource. It describes the add-ons for an instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-addon.html
     */
    export interface AddOnProperty {
        /**
         * The add-on type (for example, `AutoSnapshot` ).
         *
         * > `AutoSnapshot` is the only add-on that can be enabled for an instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-addon.html#cfn-lightsail-instance-addon-addontype
         */
        readonly addOnType: string;
        /**
         * The parameters for the automatic snapshot add-on, such as the daily time when an automatic snapshot will be created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-addon.html#cfn-lightsail-instance-addon-autosnapshotaddonrequest
         */
        readonly autoSnapshotAddOnRequest?: CfnInstance.AutoSnapshotAddOnProperty | cdk.IResolvable;
        /**
         * The status of the add-on.
         *
         * Valid Values: `Enabled` | `Disabled`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-addon.html#cfn-lightsail-instance-addon-status
         */
        readonly status?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AddOnProperty`
 *
 * @param properties - the TypeScript properties of a `AddOnProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_AddOnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addOnType', cdk.requiredValidator)(properties.addOnType));
    errors.collect(cdk.propertyValidator('addOnType', cdk.validateString)(properties.addOnType));
    errors.collect(cdk.propertyValidator('autoSnapshotAddOnRequest', CfnInstance_AutoSnapshotAddOnPropertyValidator)(properties.autoSnapshotAddOnRequest));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "AddOnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Instance.AddOn` resource
 *
 * @param properties - the TypeScript properties of a `AddOnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Instance.AddOn` resource.
 */
// @ts-ignore TS6133
function cfnInstanceAddOnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_AddOnPropertyValidator(properties).assertSuccess();
    return {
        AddOnType: cdk.stringToCloudFormation(properties.addOnType),
        AutoSnapshotAddOnRequest: cfnInstanceAutoSnapshotAddOnPropertyToCloudFormation(properties.autoSnapshotAddOnRequest),
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnInstanceAddOnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.AddOnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.AddOnProperty>();
    ret.addPropertyResult('addOnType', 'AddOnType', cfn_parse.FromCloudFormation.getString(properties.AddOnType));
    ret.addPropertyResult('autoSnapshotAddOnRequest', 'AutoSnapshotAddOnRequest', properties.AutoSnapshotAddOnRequest != null ? CfnInstanceAutoSnapshotAddOnPropertyFromCloudFormation(properties.AutoSnapshotAddOnRequest) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstance {
    /**
     * `AutoSnapshotAddOn` is a property of the [AddOn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-addon.html) property. It describes the automatic snapshot add-on for an instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-autosnapshotaddon.html
     */
    export interface AutoSnapshotAddOnProperty {
        /**
         * The daily time when an automatic snapshot will be created.
         *
         * Constraints:
         *
         * - Must be in `HH:00` format, and in an hourly increment.
         * - Specified in Coordinated Universal Time (UTC).
         * - The snapshot will be automatically created between the time specified and up to 45 minutes after.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-autosnapshotaddon.html#cfn-lightsail-instance-autosnapshotaddon-snapshottimeofday
         */
        readonly snapshotTimeOfDay?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AutoSnapshotAddOnProperty`
 *
 * @param properties - the TypeScript properties of a `AutoSnapshotAddOnProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_AutoSnapshotAddOnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('snapshotTimeOfDay', cdk.validateString)(properties.snapshotTimeOfDay));
    return errors.wrap('supplied properties not correct for "AutoSnapshotAddOnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Instance.AutoSnapshotAddOn` resource
 *
 * @param properties - the TypeScript properties of a `AutoSnapshotAddOnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Instance.AutoSnapshotAddOn` resource.
 */
// @ts-ignore TS6133
function cfnInstanceAutoSnapshotAddOnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_AutoSnapshotAddOnPropertyValidator(properties).assertSuccess();
    return {
        SnapshotTimeOfDay: cdk.stringToCloudFormation(properties.snapshotTimeOfDay),
    };
}

// @ts-ignore TS6133
function CfnInstanceAutoSnapshotAddOnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.AutoSnapshotAddOnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.AutoSnapshotAddOnProperty>();
    ret.addPropertyResult('snapshotTimeOfDay', 'SnapshotTimeOfDay', properties.SnapshotTimeOfDay != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotTimeOfDay) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstance {
    /**
     * `Disk` is a property of the [Hardware](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-hardware.html) property. It describes a disk attached to an instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html
     */
    export interface DiskProperty {
        /**
         * The resources to which the disk is attached.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-attachedto
         */
        readonly attachedTo?: string;
        /**
         * (Deprecated) The attachment state of the disk.
         *
         * > In releases prior to November 14, 2017, this parameter returned `attached` for system disks in the API response. It is now deprecated, but still included in the response. Use `isAttached` instead.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-attachmentstate
         */
        readonly attachmentState?: string;
        /**
         * The unique name of the disk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-diskname
         */
        readonly diskName: string;
        /**
         * The input/output operations per second (IOPS) of the disk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-iops
         */
        readonly iops?: number;
        /**
         * A Boolean value indicating whether this disk is a system disk (has an operating system loaded on it).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-issystemdisk
         */
        readonly isSystemDisk?: boolean | cdk.IResolvable;
        /**
         * The disk path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-path
         */
        readonly path: string;
        /**
         * The size of the disk in GB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-sizeingb
         */
        readonly sizeInGb?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DiskProperty`
 *
 * @param properties - the TypeScript properties of a `DiskProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_DiskPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attachedTo', cdk.validateString)(properties.attachedTo));
    errors.collect(cdk.propertyValidator('attachmentState', cdk.validateString)(properties.attachmentState));
    errors.collect(cdk.propertyValidator('diskName', cdk.requiredValidator)(properties.diskName));
    errors.collect(cdk.propertyValidator('diskName', cdk.validateString)(properties.diskName));
    errors.collect(cdk.propertyValidator('iops', cdk.validateNumber)(properties.iops));
    errors.collect(cdk.propertyValidator('isSystemDisk', cdk.validateBoolean)(properties.isSystemDisk));
    errors.collect(cdk.propertyValidator('path', cdk.requiredValidator)(properties.path));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    errors.collect(cdk.propertyValidator('sizeInGb', cdk.validateString)(properties.sizeInGb));
    return errors.wrap('supplied properties not correct for "DiskProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Instance.Disk` resource
 *
 * @param properties - the TypeScript properties of a `DiskProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Instance.Disk` resource.
 */
// @ts-ignore TS6133
function cfnInstanceDiskPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_DiskPropertyValidator(properties).assertSuccess();
    return {
        AttachedTo: cdk.stringToCloudFormation(properties.attachedTo),
        AttachmentState: cdk.stringToCloudFormation(properties.attachmentState),
        DiskName: cdk.stringToCloudFormation(properties.diskName),
        IOPS: cdk.numberToCloudFormation(properties.iops),
        IsSystemDisk: cdk.booleanToCloudFormation(properties.isSystemDisk),
        Path: cdk.stringToCloudFormation(properties.path),
        SizeInGb: cdk.stringToCloudFormation(properties.sizeInGb),
    };
}

// @ts-ignore TS6133
function CfnInstanceDiskPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.DiskProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.DiskProperty>();
    ret.addPropertyResult('attachedTo', 'AttachedTo', properties.AttachedTo != null ? cfn_parse.FromCloudFormation.getString(properties.AttachedTo) : undefined);
    ret.addPropertyResult('attachmentState', 'AttachmentState', properties.AttachmentState != null ? cfn_parse.FromCloudFormation.getString(properties.AttachmentState) : undefined);
    ret.addPropertyResult('diskName', 'DiskName', cfn_parse.FromCloudFormation.getString(properties.DiskName));
    ret.addPropertyResult('iops', 'IOPS', properties.IOPS != null ? cfn_parse.FromCloudFormation.getNumber(properties.IOPS) : undefined);
    ret.addPropertyResult('isSystemDisk', 'IsSystemDisk', properties.IsSystemDisk != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsSystemDisk) : undefined);
    ret.addPropertyResult('path', 'Path', cfn_parse.FromCloudFormation.getString(properties.Path));
    ret.addPropertyResult('sizeInGb', 'SizeInGb', properties.SizeInGb != null ? cfn_parse.FromCloudFormation.getString(properties.SizeInGb) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstance {
    /**
     * `Hardware` is a property of the [AWS::Lightsail::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html) resource. It describes the hardware properties for the instance, such as the vCPU count, attached disks, and amount of RAM.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-hardware.html
     */
    export interface HardwareProperty {
        /**
         * The number of vCPUs the instance has.
         *
         * > The `CpuCount` property is read-only and should not be specified in a create instance or update instance request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-hardware.html#cfn-lightsail-instance-hardware-cpucount
         */
        readonly cpuCount?: number;
        /**
         * The disks attached to the instance.
         *
         * The instance restarts when performing an attach disk or detach disk request. This resets the public IP address of your instance if a static IP isn't attached to it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-hardware.html#cfn-lightsail-instance-hardware-disks
         */
        readonly disks?: Array<CfnInstance.DiskProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The amount of RAM in GB on the instance (for example, `1.0` ).
         *
         * > The `RamSizeInGb` property is read-only and should not be specified in a create instance or update instance request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-hardware.html#cfn-lightsail-instance-hardware-ramsizeingb
         */
        readonly ramSizeInGb?: number;
    }
}

/**
 * Determine whether the given properties match those of a `HardwareProperty`
 *
 * @param properties - the TypeScript properties of a `HardwareProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_HardwarePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cpuCount', cdk.validateNumber)(properties.cpuCount));
    errors.collect(cdk.propertyValidator('disks', cdk.listValidator(CfnInstance_DiskPropertyValidator))(properties.disks));
    errors.collect(cdk.propertyValidator('ramSizeInGb', cdk.validateNumber)(properties.ramSizeInGb));
    return errors.wrap('supplied properties not correct for "HardwareProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Instance.Hardware` resource
 *
 * @param properties - the TypeScript properties of a `HardwareProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Instance.Hardware` resource.
 */
// @ts-ignore TS6133
function cfnInstanceHardwarePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_HardwarePropertyValidator(properties).assertSuccess();
    return {
        CpuCount: cdk.numberToCloudFormation(properties.cpuCount),
        Disks: cdk.listMapper(cfnInstanceDiskPropertyToCloudFormation)(properties.disks),
        RamSizeInGb: cdk.numberToCloudFormation(properties.ramSizeInGb),
    };
}

// @ts-ignore TS6133
function CfnInstanceHardwarePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.HardwareProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.HardwareProperty>();
    ret.addPropertyResult('cpuCount', 'CpuCount', properties.CpuCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.CpuCount) : undefined);
    ret.addPropertyResult('disks', 'Disks', properties.Disks != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceDiskPropertyFromCloudFormation)(properties.Disks) : undefined);
    ret.addPropertyResult('ramSizeInGb', 'RamSizeInGb', properties.RamSizeInGb != null ? cfn_parse.FromCloudFormation.getNumber(properties.RamSizeInGb) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstance {
    /**
     * `Location` is a property of the [AWS::Lightsail::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html) resource. It describes the location for an instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-location.html
     */
    export interface LocationProperty {
        /**
         * The Availability Zone for the instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-location.html#cfn-lightsail-instance-location-availabilityzone
         */
        readonly availabilityZone?: string;
        /**
         * The name of the AWS Region for the instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-location.html#cfn-lightsail-instance-location-regionname
         */
        readonly regionName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LocationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_LocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('regionName', cdk.validateString)(properties.regionName));
    return errors.wrap('supplied properties not correct for "LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Instance.Location` resource
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Instance.Location` resource.
 */
// @ts-ignore TS6133
function cfnInstanceLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_LocationPropertyValidator(properties).assertSuccess();
    return {
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
        RegionName: cdk.stringToCloudFormation(properties.regionName),
    };
}

// @ts-ignore TS6133
function CfnInstanceLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.LocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.LocationProperty>();
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined);
    ret.addPropertyResult('regionName', 'RegionName', properties.RegionName != null ? cfn_parse.FromCloudFormation.getString(properties.RegionName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstance {
    /**
     * `MonthlyTransfer` is a property of the [Networking](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-networking.html) property. It describes the amount of allocated monthly data transfer (in GB) for an instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-monthlytransfer.html
     */
    export interface MonthlyTransferProperty {
        /**
         * The amount of allocated monthly data transfer (in GB) for an instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-monthlytransfer.html#cfn-lightsail-instance-monthlytransfer-gbpermonthallocated
         */
        readonly gbPerMonthAllocated?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MonthlyTransferProperty`
 *
 * @param properties - the TypeScript properties of a `MonthlyTransferProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_MonthlyTransferPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('gbPerMonthAllocated', cdk.validateString)(properties.gbPerMonthAllocated));
    return errors.wrap('supplied properties not correct for "MonthlyTransferProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Instance.MonthlyTransfer` resource
 *
 * @param properties - the TypeScript properties of a `MonthlyTransferProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Instance.MonthlyTransfer` resource.
 */
// @ts-ignore TS6133
function cfnInstanceMonthlyTransferPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_MonthlyTransferPropertyValidator(properties).assertSuccess();
    return {
        GbPerMonthAllocated: cdk.stringToCloudFormation(properties.gbPerMonthAllocated),
    };
}

// @ts-ignore TS6133
function CfnInstanceMonthlyTransferPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.MonthlyTransferProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.MonthlyTransferProperty>();
    ret.addPropertyResult('gbPerMonthAllocated', 'GbPerMonthAllocated', properties.GbPerMonthAllocated != null ? cfn_parse.FromCloudFormation.getString(properties.GbPerMonthAllocated) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstance {
    /**
     * `Networking` is a property of the [AWS::Lightsail::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html) resource. It describes the public ports and the monthly amount of data transfer allocated for the instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-networking.html
     */
    export interface NetworkingProperty {
        /**
         * The monthly amount of data transfer, in GB, allocated for the instance
         */
        readonly monthlyTransfer?: number;
        /**
         * An array of ports to open on the instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-networking.html#cfn-lightsail-instance-networking-ports
         */
        readonly ports: Array<CfnInstance.PortProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NetworkingProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkingProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_NetworkingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('monthlyTransfer', cdk.validateNumber)(properties.monthlyTransfer));
    errors.collect(cdk.propertyValidator('ports', cdk.requiredValidator)(properties.ports));
    errors.collect(cdk.propertyValidator('ports', cdk.listValidator(CfnInstance_PortPropertyValidator))(properties.ports));
    return errors.wrap('supplied properties not correct for "NetworkingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Instance.Networking` resource
 *
 * @param properties - the TypeScript properties of a `NetworkingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Instance.Networking` resource.
 */
// @ts-ignore TS6133
function cfnInstanceNetworkingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_NetworkingPropertyValidator(properties).assertSuccess();
    return {
        MonthlyTransfer: cdk.numberToCloudFormation(properties.monthlyTransfer),
        Ports: cdk.listMapper(cfnInstancePortPropertyToCloudFormation)(properties.ports),
    };
}

// @ts-ignore TS6133
function CfnInstanceNetworkingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.NetworkingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.NetworkingProperty>();
    ret.addPropertyResult('monthlyTransfer', 'MonthlyTransfer', properties.MonthlyTransfer != null ? cfn_parse.FromCloudFormation.getNumber(properties.MonthlyTransfer) : undefined);
    ret.addPropertyResult('ports', 'Ports', cfn_parse.FromCloudFormation.getArray(CfnInstancePortPropertyFromCloudFormation)(properties.Ports));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstance {
    /**
     * `Port` is a property of the [Networking](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-networking.html) property. It describes information about ports for an instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html
     */
    export interface PortProperty {
        /**
         * The access direction ( `inbound` or `outbound` ).
         *
         * > Lightsail currently supports only `inbound` access direction.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-accessdirection
         */
        readonly accessDirection?: string;
        /**
         * The location from which access is allowed. For example, `Anywhere (0.0.0.0/0)` , or `Custom` if a specific IP address or range of IP addresses is allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-accessfrom
         */
        readonly accessFrom?: string;
        /**
         * The type of access ( `Public` or `Private` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-accesstype
         */
        readonly accessType?: string;
        /**
         * An alias that defines access for a preconfigured range of IP addresses.
         *
         * The only alias currently supported is `lightsail-connect` , which allows IP addresses of the browser-based RDP/SSH client in the Lightsail console to connect to your instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-cidrlistaliases
         */
        readonly cidrListAliases?: string[];
        /**
         * The IPv4 address, or range of IPv4 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol.
         *
         * > The `ipv6Cidrs` parameter lists the IPv6 addresses that are allowed to connect to an instance.
         *
         * Examples:
         *
         * - To allow the IP address `192.0.2.44` , specify `192.0.2.44` or `192.0.2.44/32` .
         * - To allow the IP addresses `192.0.2.0` to `192.0.2.255` , specify `192.0.2.0/24` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-cidrs
         */
        readonly cidrs?: string[];
        /**
         * The common name of the port information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-commonname
         */
        readonly commonName?: string;
        /**
         * The first port in a range of open ports on an instance.
         *
         * Allowed ports:
         *
         * - TCP and UDP - `0` to `65535`
         * - ICMP - The ICMP type for IPv4 addresses. For example, specify `8` as the `fromPort` (ICMP type), and `-1` as the `toPort` (ICMP code), to enable ICMP Ping.
         * - ICMPv6 - The ICMP type for IPv6 addresses. For example, specify `128` as the `fromPort` (ICMPv6 type), and `0` as `toPort` (ICMPv6 code).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-fromport
         */
        readonly fromPort?: number;
        /**
         * The IPv6 address, or range of IPv6 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol. Only devices with an IPv6 address can connect to an instance through IPv6; otherwise, IPv4 should be used.
         *
         * > The `cidrs` parameter lists the IPv4 addresses that are allowed to connect to an instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-ipv6cidrs
         */
        readonly ipv6Cidrs?: string[];
        /**
         * The IP protocol name.
         *
         * The name can be one of the following:
         *
         * - `tcp` - Transmission Control Protocol (TCP) provides reliable, ordered, and error-checked delivery of streamed data between applications running on hosts communicating by an IP network. If you have an application that doesn't require reliable data stream service, use UDP instead.
         * - `all` - All transport layer protocol types.
         * - `udp` - With User Datagram Protocol (UDP), computer applications can send messages (or datagrams) to other hosts on an Internet Protocol (IP) network. Prior communications are not required to set up transmission channels or data paths. Applications that don't require reliable data stream service can use UDP, which provides a connectionless datagram service that emphasizes reduced latency over reliability. If you do require reliable data stream service, use TCP instead.
         * - `icmp` - Internet Control Message Protocol (ICMP) is used to send error messages and operational information indicating success or failure when communicating with an instance. For example, an error is indicated when an instance could not be reached. When you specify `icmp` as the `protocol` , you must specify the ICMP type using the `fromPort` parameter, and ICMP code using the `toPort` parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-protocol
         */
        readonly protocol?: string;
        /**
         * The last port in a range of open ports on an instance.
         *
         * Allowed ports:
         *
         * - TCP and UDP - `0` to `65535`
         * - ICMP - The ICMP code for IPv4 addresses. For example, specify `8` as the `fromPort` (ICMP type), and `-1` as the `toPort` (ICMP code), to enable ICMP Ping.
         * - ICMPv6 - The ICMP code for IPv6 addresses. For example, specify `128` as the `fromPort` (ICMPv6 type), and `0` as `toPort` (ICMPv6 code).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-toport
         */
        readonly toPort?: number;
    }
}

/**
 * Determine whether the given properties match those of a `PortProperty`
 *
 * @param properties - the TypeScript properties of a `PortProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_PortPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessDirection', cdk.validateString)(properties.accessDirection));
    errors.collect(cdk.propertyValidator('accessFrom', cdk.validateString)(properties.accessFrom));
    errors.collect(cdk.propertyValidator('accessType', cdk.validateString)(properties.accessType));
    errors.collect(cdk.propertyValidator('cidrListAliases', cdk.listValidator(cdk.validateString))(properties.cidrListAliases));
    errors.collect(cdk.propertyValidator('cidrs', cdk.listValidator(cdk.validateString))(properties.cidrs));
    errors.collect(cdk.propertyValidator('commonName', cdk.validateString)(properties.commonName));
    errors.collect(cdk.propertyValidator('fromPort', cdk.validateNumber)(properties.fromPort));
    errors.collect(cdk.propertyValidator('ipv6Cidrs', cdk.listValidator(cdk.validateString))(properties.ipv6Cidrs));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('toPort', cdk.validateNumber)(properties.toPort));
    return errors.wrap('supplied properties not correct for "PortProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Instance.Port` resource
 *
 * @param properties - the TypeScript properties of a `PortProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Instance.Port` resource.
 */
// @ts-ignore TS6133
function cfnInstancePortPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_PortPropertyValidator(properties).assertSuccess();
    return {
        AccessDirection: cdk.stringToCloudFormation(properties.accessDirection),
        AccessFrom: cdk.stringToCloudFormation(properties.accessFrom),
        AccessType: cdk.stringToCloudFormation(properties.accessType),
        CidrListAliases: cdk.listMapper(cdk.stringToCloudFormation)(properties.cidrListAliases),
        Cidrs: cdk.listMapper(cdk.stringToCloudFormation)(properties.cidrs),
        CommonName: cdk.stringToCloudFormation(properties.commonName),
        FromPort: cdk.numberToCloudFormation(properties.fromPort),
        Ipv6Cidrs: cdk.listMapper(cdk.stringToCloudFormation)(properties.ipv6Cidrs),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        ToPort: cdk.numberToCloudFormation(properties.toPort),
    };
}

// @ts-ignore TS6133
function CfnInstancePortPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.PortProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.PortProperty>();
    ret.addPropertyResult('accessDirection', 'AccessDirection', properties.AccessDirection != null ? cfn_parse.FromCloudFormation.getString(properties.AccessDirection) : undefined);
    ret.addPropertyResult('accessFrom', 'AccessFrom', properties.AccessFrom != null ? cfn_parse.FromCloudFormation.getString(properties.AccessFrom) : undefined);
    ret.addPropertyResult('accessType', 'AccessType', properties.AccessType != null ? cfn_parse.FromCloudFormation.getString(properties.AccessType) : undefined);
    ret.addPropertyResult('cidrListAliases', 'CidrListAliases', properties.CidrListAliases != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CidrListAliases) : undefined);
    ret.addPropertyResult('cidrs', 'Cidrs', properties.Cidrs != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Cidrs) : undefined);
    ret.addPropertyResult('commonName', 'CommonName', properties.CommonName != null ? cfn_parse.FromCloudFormation.getString(properties.CommonName) : undefined);
    ret.addPropertyResult('fromPort', 'FromPort', properties.FromPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.FromPort) : undefined);
    ret.addPropertyResult('ipv6Cidrs', 'Ipv6Cidrs', properties.Ipv6Cidrs != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Ipv6Cidrs) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addPropertyResult('toPort', 'ToPort', properties.ToPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ToPort) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstance {
    /**
     * `State` is a property of the [AWS::Lightsail::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html) resource. It describes the status code and the state (for example, `running` ) of an instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-state.html
     */
    export interface StateProperty {
        /**
         * The status code of the instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-state.html#cfn-lightsail-instance-state-code
         */
        readonly code?: number;
        /**
         * The state of the instance (for example, `running` or `pending` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-state.html#cfn-lightsail-instance-state-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StateProperty`
 *
 * @param properties - the TypeScript properties of a `StateProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_StatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('code', cdk.validateNumber)(properties.code));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "StateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::Instance.State` resource
 *
 * @param properties - the TypeScript properties of a `StateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::Instance.State` resource.
 */
// @ts-ignore TS6133
function cfnInstanceStatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_StatePropertyValidator(properties).assertSuccess();
    return {
        Code: cdk.numberToCloudFormation(properties.code),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnInstanceStatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.StateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.StateProperty>();
    ret.addPropertyResult('code', 'Code', properties.Code != null ? cfn_parse.FromCloudFormation.getNumber(properties.Code) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLoadBalancer`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html
 */
export interface CfnLoadBalancerProps {

    /**
     * The port that the load balancer uses to direct traffic to your Lightsail instances. For HTTP traffic, specify port `80` . For HTTPS traffic, specify port `443` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-instanceport
     */
    readonly instancePort: number;

    /**
     * The name of the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-loadbalancername
     */
    readonly loadBalancerName: string;

    /**
     * The Lightsail instances to attach to the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-attachedinstances
     */
    readonly attachedInstances?: string[];

    /**
     * The path on the attached instance where the health check will be performed. If no path is specified, the load balancer tries to make a request to the default (root) page ( `/index.html` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-healthcheckpath
     */
    readonly healthCheckPath?: string;

    /**
     * The IP address type of the load balancer.
     *
     * The possible values are `ipv4` for IPv4 only, and `dualstack` for both IPv4 and IPv6.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-ipaddresstype
     */
    readonly ipAddressType?: string;

    /**
     * A Boolean value indicating whether session stickiness is enabled.
     *
     * Enable session stickiness (also known as *session affinity* ) to bind a user's session to a specific instance. This ensures that all requests from the user during the session are sent to the same instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-sessionstickinessenabled
     */
    readonly sessionStickinessEnabled?: boolean | cdk.IResolvable;

    /**
     * The time period, in seconds, after which the load balancer session stickiness cookie should be considered stale. If you do not specify this parameter, the default value is 0, which indicates that the sticky session should last for the duration of the browser session.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-sessionstickinesslbcookiedurationseconds
     */
    readonly sessionStickinessLbCookieDurationSeconds?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The name of the TLS security policy for the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-tlspolicyname
     */
    readonly tlsPolicyName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLoadBalancerProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoadBalancerProps`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attachedInstances', cdk.listValidator(cdk.validateString))(properties.attachedInstances));
    errors.collect(cdk.propertyValidator('healthCheckPath', cdk.validateString)(properties.healthCheckPath));
    errors.collect(cdk.propertyValidator('instancePort', cdk.requiredValidator)(properties.instancePort));
    errors.collect(cdk.propertyValidator('instancePort', cdk.validateNumber)(properties.instancePort));
    errors.collect(cdk.propertyValidator('ipAddressType', cdk.validateString)(properties.ipAddressType));
    errors.collect(cdk.propertyValidator('loadBalancerName', cdk.requiredValidator)(properties.loadBalancerName));
    errors.collect(cdk.propertyValidator('loadBalancerName', cdk.validateString)(properties.loadBalancerName));
    errors.collect(cdk.propertyValidator('sessionStickinessEnabled', cdk.validateBoolean)(properties.sessionStickinessEnabled));
    errors.collect(cdk.propertyValidator('sessionStickinessLbCookieDurationSeconds', cdk.validateString)(properties.sessionStickinessLbCookieDurationSeconds));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('tlsPolicyName', cdk.validateString)(properties.tlsPolicyName));
    return errors.wrap('supplied properties not correct for "CfnLoadBalancerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::LoadBalancer` resource
 *
 * @param properties - the TypeScript properties of a `CfnLoadBalancerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::LoadBalancer` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancerPropsValidator(properties).assertSuccess();
    return {
        InstancePort: cdk.numberToCloudFormation(properties.instancePort),
        LoadBalancerName: cdk.stringToCloudFormation(properties.loadBalancerName),
        AttachedInstances: cdk.listMapper(cdk.stringToCloudFormation)(properties.attachedInstances),
        HealthCheckPath: cdk.stringToCloudFormation(properties.healthCheckPath),
        IpAddressType: cdk.stringToCloudFormation(properties.ipAddressType),
        SessionStickinessEnabled: cdk.booleanToCloudFormation(properties.sessionStickinessEnabled),
        SessionStickinessLBCookieDurationSeconds: cdk.stringToCloudFormation(properties.sessionStickinessLbCookieDurationSeconds),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TlsPolicyName: cdk.stringToCloudFormation(properties.tlsPolicyName),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancerProps>();
    ret.addPropertyResult('instancePort', 'InstancePort', cfn_parse.FromCloudFormation.getNumber(properties.InstancePort));
    ret.addPropertyResult('loadBalancerName', 'LoadBalancerName', cfn_parse.FromCloudFormation.getString(properties.LoadBalancerName));
    ret.addPropertyResult('attachedInstances', 'AttachedInstances', properties.AttachedInstances != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AttachedInstances) : undefined);
    ret.addPropertyResult('healthCheckPath', 'HealthCheckPath', properties.HealthCheckPath != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheckPath) : undefined);
    ret.addPropertyResult('ipAddressType', 'IpAddressType', properties.IpAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddressType) : undefined);
    ret.addPropertyResult('sessionStickinessEnabled', 'SessionStickinessEnabled', properties.SessionStickinessEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SessionStickinessEnabled) : undefined);
    ret.addPropertyResult('sessionStickinessLbCookieDurationSeconds', 'SessionStickinessLBCookieDurationSeconds', properties.SessionStickinessLBCookieDurationSeconds != null ? cfn_parse.FromCloudFormation.getString(properties.SessionStickinessLBCookieDurationSeconds) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('tlsPolicyName', 'TlsPolicyName', properties.TlsPolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.TlsPolicyName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lightsail::LoadBalancer`
 *
 * The `AWS::Lightsail::LoadBalancer` resource specifies a load balancer that can be used with Lightsail instances.
 *
 * > You cannot attach a TLS certificate to a load balancer using the `AWS::Lightsail::LoadBalancer` resource type. Instead, use the `AWS::Lightsail::LoadBalancerTlsCertificate` resource type to create a certificate and attach it to a load balancer.
 *
 * @cloudformationResource AWS::Lightsail::LoadBalancer
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html
 */
export class CfnLoadBalancer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lightsail::LoadBalancer";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoadBalancer {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLoadBalancerPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLoadBalancer(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     * @cloudformationAttribute LoadBalancerArn
     */
    public readonly attrLoadBalancerArn: string;

    /**
     * The port that the load balancer uses to direct traffic to your Lightsail instances. For HTTP traffic, specify port `80` . For HTTPS traffic, specify port `443` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-instanceport
     */
    public instancePort: number;

    /**
     * The name of the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-loadbalancername
     */
    public loadBalancerName: string;

    /**
     * The Lightsail instances to attach to the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-attachedinstances
     */
    public attachedInstances: string[] | undefined;

    /**
     * The path on the attached instance where the health check will be performed. If no path is specified, the load balancer tries to make a request to the default (root) page ( `/index.html` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-healthcheckpath
     */
    public healthCheckPath: string | undefined;

    /**
     * The IP address type of the load balancer.
     *
     * The possible values are `ipv4` for IPv4 only, and `dualstack` for both IPv4 and IPv6.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-ipaddresstype
     */
    public ipAddressType: string | undefined;

    /**
     * A Boolean value indicating whether session stickiness is enabled.
     *
     * Enable session stickiness (also known as *session affinity* ) to bind a user's session to a specific instance. This ensures that all requests from the user during the session are sent to the same instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-sessionstickinessenabled
     */
    public sessionStickinessEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The time period, in seconds, after which the load balancer session stickiness cookie should be considered stale. If you do not specify this parameter, the default value is 0, which indicates that the sticky session should last for the duration of the browser session.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-sessionstickinesslbcookiedurationseconds
     */
    public sessionStickinessLbCookieDurationSeconds: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
     *
     * > The `Value` of `Tags` is optional for Lightsail resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The name of the TLS security policy for the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-tlspolicyname
     */
    public tlsPolicyName: string | undefined;

    /**
     * Create a new `AWS::Lightsail::LoadBalancer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLoadBalancerProps) {
        super(scope, id, { type: CfnLoadBalancer.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'instancePort', this);
        cdk.requireProperty(props, 'loadBalancerName', this);
        this.attrLoadBalancerArn = cdk.Token.asString(this.getAtt('LoadBalancerArn', cdk.ResolutionTypeHint.STRING));

        this.instancePort = props.instancePort;
        this.loadBalancerName = props.loadBalancerName;
        this.attachedInstances = props.attachedInstances;
        this.healthCheckPath = props.healthCheckPath;
        this.ipAddressType = props.ipAddressType;
        this.sessionStickinessEnabled = props.sessionStickinessEnabled;
        this.sessionStickinessLbCookieDurationSeconds = props.sessionStickinessLbCookieDurationSeconds;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::LoadBalancer", props.tags, { tagPropertyName: 'tags' });
        this.tlsPolicyName = props.tlsPolicyName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoadBalancer.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            instancePort: this.instancePort,
            loadBalancerName: this.loadBalancerName,
            attachedInstances: this.attachedInstances,
            healthCheckPath: this.healthCheckPath,
            ipAddressType: this.ipAddressType,
            sessionStickinessEnabled: this.sessionStickinessEnabled,
            sessionStickinessLbCookieDurationSeconds: this.sessionStickinessLbCookieDurationSeconds,
            tags: this.tags.renderTags(),
            tlsPolicyName: this.tlsPolicyName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLoadBalancerPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnLoadBalancerTlsCertificate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html
 */
export interface CfnLoadBalancerTlsCertificateProps {

    /**
     * The domain name for the SSL/TLS certificate. For example, `example.com` or `www.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-certificatedomainname
     */
    readonly certificateDomainName: string;

    /**
     * The name of the SSL/TLS certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-certificatename
     */
    readonly certificateName: string;

    /**
     * The name of the load balancer that the SSL/TLS certificate is attached to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-loadbalancername
     */
    readonly loadBalancerName: string;

    /**
     * An array of alternative domain names and subdomain names for your SSL/TLS certificate.
     *
     * In addition to the primary domain name, you can have up to nine alternative domain names. Wildcards (such as `*.example.com` ) are not supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-certificatealternativenames
     */
    readonly certificateAlternativeNames?: string[];

    /**
     * A Boolean value indicating whether HTTPS redirection is enabled for the load balancer that the TLS certificate is attached to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-httpsredirectionenabled
     */
    readonly httpsRedirectionEnabled?: boolean | cdk.IResolvable;

    /**
     * A Boolean value indicating whether the SSL/TLS certificate is attached to a Lightsail load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-isattached
     */
    readonly isAttached?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnLoadBalancerTlsCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoadBalancerTlsCertificateProps`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancerTlsCertificatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateAlternativeNames', cdk.listValidator(cdk.validateString))(properties.certificateAlternativeNames));
    errors.collect(cdk.propertyValidator('certificateDomainName', cdk.requiredValidator)(properties.certificateDomainName));
    errors.collect(cdk.propertyValidator('certificateDomainName', cdk.validateString)(properties.certificateDomainName));
    errors.collect(cdk.propertyValidator('certificateName', cdk.requiredValidator)(properties.certificateName));
    errors.collect(cdk.propertyValidator('certificateName', cdk.validateString)(properties.certificateName));
    errors.collect(cdk.propertyValidator('httpsRedirectionEnabled', cdk.validateBoolean)(properties.httpsRedirectionEnabled));
    errors.collect(cdk.propertyValidator('isAttached', cdk.validateBoolean)(properties.isAttached));
    errors.collect(cdk.propertyValidator('loadBalancerName', cdk.requiredValidator)(properties.loadBalancerName));
    errors.collect(cdk.propertyValidator('loadBalancerName', cdk.validateString)(properties.loadBalancerName));
    return errors.wrap('supplied properties not correct for "CfnLoadBalancerTlsCertificateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::LoadBalancerTlsCertificate` resource
 *
 * @param properties - the TypeScript properties of a `CfnLoadBalancerTlsCertificateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::LoadBalancerTlsCertificate` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerTlsCertificatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancerTlsCertificatePropsValidator(properties).assertSuccess();
    return {
        CertificateDomainName: cdk.stringToCloudFormation(properties.certificateDomainName),
        CertificateName: cdk.stringToCloudFormation(properties.certificateName),
        LoadBalancerName: cdk.stringToCloudFormation(properties.loadBalancerName),
        CertificateAlternativeNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.certificateAlternativeNames),
        HttpsRedirectionEnabled: cdk.booleanToCloudFormation(properties.httpsRedirectionEnabled),
        IsAttached: cdk.booleanToCloudFormation(properties.isAttached),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerTlsCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancerTlsCertificateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancerTlsCertificateProps>();
    ret.addPropertyResult('certificateDomainName', 'CertificateDomainName', cfn_parse.FromCloudFormation.getString(properties.CertificateDomainName));
    ret.addPropertyResult('certificateName', 'CertificateName', cfn_parse.FromCloudFormation.getString(properties.CertificateName));
    ret.addPropertyResult('loadBalancerName', 'LoadBalancerName', cfn_parse.FromCloudFormation.getString(properties.LoadBalancerName));
    ret.addPropertyResult('certificateAlternativeNames', 'CertificateAlternativeNames', properties.CertificateAlternativeNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CertificateAlternativeNames) : undefined);
    ret.addPropertyResult('httpsRedirectionEnabled', 'HttpsRedirectionEnabled', properties.HttpsRedirectionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.HttpsRedirectionEnabled) : undefined);
    ret.addPropertyResult('isAttached', 'IsAttached', properties.IsAttached != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsAttached) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lightsail::LoadBalancerTlsCertificate`
 *
 * The `AWS::Lightsail::LoadBalancerTlsCertificate` resource specifies a TLS certificate that can be used with a Lightsail load balancer.
 *
 * @cloudformationResource AWS::Lightsail::LoadBalancerTlsCertificate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html
 */
export class CfnLoadBalancerTlsCertificate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lightsail::LoadBalancerTlsCertificate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoadBalancerTlsCertificate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLoadBalancerTlsCertificatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnLoadBalancerTlsCertificate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the SSL/TLS certificate.
     * @cloudformationAttribute LoadBalancerTlsCertificateArn
     */
    public readonly attrLoadBalancerTlsCertificateArn: string;

    /**
     * The validation status of the SSL/TLS certificate.
     *
     * Valid Values: `PENDING_VALIDATION` | `ISSUED` | `INACTIVE` | `EXPIRED` | `VALIDATION_TIMED_OUT` | `REVOKED` | `FAILED` | `UNKNOWN`
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The domain name for the SSL/TLS certificate. For example, `example.com` or `www.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-certificatedomainname
     */
    public certificateDomainName: string;

    /**
     * The name of the SSL/TLS certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-certificatename
     */
    public certificateName: string;

    /**
     * The name of the load balancer that the SSL/TLS certificate is attached to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-loadbalancername
     */
    public loadBalancerName: string;

    /**
     * An array of alternative domain names and subdomain names for your SSL/TLS certificate.
     *
     * In addition to the primary domain name, you can have up to nine alternative domain names. Wildcards (such as `*.example.com` ) are not supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-certificatealternativenames
     */
    public certificateAlternativeNames: string[] | undefined;

    /**
     * A Boolean value indicating whether HTTPS redirection is enabled for the load balancer that the TLS certificate is attached to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-httpsredirectionenabled
     */
    public httpsRedirectionEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * A Boolean value indicating whether the SSL/TLS certificate is attached to a Lightsail load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-isattached
     */
    public isAttached: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Lightsail::LoadBalancerTlsCertificate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLoadBalancerTlsCertificateProps) {
        super(scope, id, { type: CfnLoadBalancerTlsCertificate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'certificateDomainName', this);
        cdk.requireProperty(props, 'certificateName', this);
        cdk.requireProperty(props, 'loadBalancerName', this);
        this.attrLoadBalancerTlsCertificateArn = cdk.Token.asString(this.getAtt('LoadBalancerTlsCertificateArn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.certificateDomainName = props.certificateDomainName;
        this.certificateName = props.certificateName;
        this.loadBalancerName = props.loadBalancerName;
        this.certificateAlternativeNames = props.certificateAlternativeNames;
        this.httpsRedirectionEnabled = props.httpsRedirectionEnabled;
        this.isAttached = props.isAttached;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoadBalancerTlsCertificate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            certificateDomainName: this.certificateDomainName,
            certificateName: this.certificateName,
            loadBalancerName: this.loadBalancerName,
            certificateAlternativeNames: this.certificateAlternativeNames,
            httpsRedirectionEnabled: this.httpsRedirectionEnabled,
            isAttached: this.isAttached,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLoadBalancerTlsCertificatePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnStaticIp`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-staticip.html
 */
export interface CfnStaticIpProps {

    /**
     * The name of the static IP.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-staticip.html#cfn-lightsail-staticip-staticipname
     */
    readonly staticIpName: string;

    /**
     * The instance that the static IP is attached to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-staticip.html#cfn-lightsail-staticip-attachedto
     */
    readonly attachedTo?: string;
}

/**
 * Determine whether the given properties match those of a `CfnStaticIpProps`
 *
 * @param properties - the TypeScript properties of a `CfnStaticIpProps`
 *
 * @returns the result of the validation.
 */
function CfnStaticIpPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attachedTo', cdk.validateString)(properties.attachedTo));
    errors.collect(cdk.propertyValidator('staticIpName', cdk.requiredValidator)(properties.staticIpName));
    errors.collect(cdk.propertyValidator('staticIpName', cdk.validateString)(properties.staticIpName));
    return errors.wrap('supplied properties not correct for "CfnStaticIpProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lightsail::StaticIp` resource
 *
 * @param properties - the TypeScript properties of a `CfnStaticIpProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lightsail::StaticIp` resource.
 */
// @ts-ignore TS6133
function cfnStaticIpPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStaticIpPropsValidator(properties).assertSuccess();
    return {
        StaticIpName: cdk.stringToCloudFormation(properties.staticIpName),
        AttachedTo: cdk.stringToCloudFormation(properties.attachedTo),
    };
}

// @ts-ignore TS6133
function CfnStaticIpPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStaticIpProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStaticIpProps>();
    ret.addPropertyResult('staticIpName', 'StaticIpName', cfn_parse.FromCloudFormation.getString(properties.StaticIpName));
    ret.addPropertyResult('attachedTo', 'AttachedTo', properties.AttachedTo != null ? cfn_parse.FromCloudFormation.getString(properties.AttachedTo) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lightsail::StaticIp`
 *
 * The `AWS::Lightsail::StaticIp` resource specifies a static IP that can be attached to an Amazon Lightsail instance that is in the same AWS Region and Availability Zone.
 *
 * @cloudformationResource AWS::Lightsail::StaticIp
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-staticip.html
 */
export class CfnStaticIp extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lightsail::StaticIp";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStaticIp {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStaticIpPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStaticIp(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The IP address of the static IP.
     * @cloudformationAttribute IpAddress
     */
    public readonly attrIpAddress: string;

    /**
     * A Boolean value indicating whether the static IP is attached to an instance.
     * @cloudformationAttribute IsAttached
     */
    public readonly attrIsAttached: cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the static IP (for example, `arn:aws:lightsail:us-east-2:123456789101:StaticIp/244ad76f-8aad-4741-809f-12345EXAMPLE` ).
     * @cloudformationAttribute StaticIpArn
     */
    public readonly attrStaticIpArn: string;

    /**
     * The name of the static IP.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-staticip.html#cfn-lightsail-staticip-staticipname
     */
    public staticIpName: string;

    /**
     * The instance that the static IP is attached to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-staticip.html#cfn-lightsail-staticip-attachedto
     */
    public attachedTo: string | undefined;

    /**
     * Create a new `AWS::Lightsail::StaticIp`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStaticIpProps) {
        super(scope, id, { type: CfnStaticIp.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'staticIpName', this);
        this.attrIpAddress = cdk.Token.asString(this.getAtt('IpAddress', cdk.ResolutionTypeHint.STRING));
        this.attrIsAttached = this.getAtt('IsAttached', cdk.ResolutionTypeHint.STRING);
        this.attrStaticIpArn = cdk.Token.asString(this.getAtt('StaticIpArn', cdk.ResolutionTypeHint.STRING));

        this.staticIpName = props.staticIpName;
        this.attachedTo = props.attachedTo;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStaticIp.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            staticIpName: this.staticIpName,
            attachedTo: this.attachedTo,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStaticIpPropsToCloudFormation(props);
    }
}
