// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:22.868Z","fingerprint":"80Tbkuy098Njn6V+xHrwEry5ye1ttPZ9axRcDf5/evE="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAnomalyMonitor`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html
 */
export interface CfnAnomalyMonitorProps {

    /**
     * The name of the monitor.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitorname
     */
    readonly monitorName: string;

    /**
     * The possible type values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitortype
     */
    readonly monitorType: string;

    /**
     * The dimensions to evaluate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitordimension
     */
    readonly monitorDimension?: string;

    /**
     * The array of `MonitorSpecification` in JSON array format. For instance, you can use `MonitorSpecification` to specify a tag, Cost Category, or linked account for your custom anomaly monitor. For further information, see the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#aws-resource-ce-anomalymonitor--examples) section of this page.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitorspecification
     */
    readonly monitorSpecification?: string;

    /**
     * `AWS::CE::AnomalyMonitor.ResourceTags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-resourcetags
     */
    readonly resourceTags?: Array<CfnAnomalyMonitor.ResourceTagProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnAnomalyMonitorProps`
 *
 * @param properties - the TypeScript properties of a `CfnAnomalyMonitorProps`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyMonitorPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('monitorDimension', cdk.validateString)(properties.monitorDimension));
    errors.collect(cdk.propertyValidator('monitorName', cdk.requiredValidator)(properties.monitorName));
    errors.collect(cdk.propertyValidator('monitorName', cdk.validateString)(properties.monitorName));
    errors.collect(cdk.propertyValidator('monitorSpecification', cdk.validateString)(properties.monitorSpecification));
    errors.collect(cdk.propertyValidator('monitorType', cdk.requiredValidator)(properties.monitorType));
    errors.collect(cdk.propertyValidator('monitorType', cdk.validateString)(properties.monitorType));
    errors.collect(cdk.propertyValidator('resourceTags', cdk.listValidator(CfnAnomalyMonitor_ResourceTagPropertyValidator))(properties.resourceTags));
    return errors.wrap('supplied properties not correct for "CfnAnomalyMonitorProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CE::AnomalyMonitor` resource
 *
 * @param properties - the TypeScript properties of a `CfnAnomalyMonitorProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CE::AnomalyMonitor` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyMonitorPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyMonitorPropsValidator(properties).assertSuccess();
    return {
        MonitorName: cdk.stringToCloudFormation(properties.monitorName),
        MonitorType: cdk.stringToCloudFormation(properties.monitorType),
        MonitorDimension: cdk.stringToCloudFormation(properties.monitorDimension),
        MonitorSpecification: cdk.stringToCloudFormation(properties.monitorSpecification),
        ResourceTags: cdk.listMapper(cfnAnomalyMonitorResourceTagPropertyToCloudFormation)(properties.resourceTags),
    };
}

// @ts-ignore TS6133
function CfnAnomalyMonitorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyMonitorProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyMonitorProps>();
    ret.addPropertyResult('monitorName', 'MonitorName', cfn_parse.FromCloudFormation.getString(properties.MonitorName));
    ret.addPropertyResult('monitorType', 'MonitorType', cfn_parse.FromCloudFormation.getString(properties.MonitorType));
    ret.addPropertyResult('monitorDimension', 'MonitorDimension', properties.MonitorDimension != null ? cfn_parse.FromCloudFormation.getString(properties.MonitorDimension) : undefined);
    ret.addPropertyResult('monitorSpecification', 'MonitorSpecification', properties.MonitorSpecification != null ? cfn_parse.FromCloudFormation.getString(properties.MonitorSpecification) : undefined);
    ret.addPropertyResult('resourceTags', 'ResourceTags', properties.ResourceTags != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalyMonitorResourceTagPropertyFromCloudFormation)(properties.ResourceTags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CE::AnomalyMonitor`
 *
 * The `AWS::CE::AnomalyMonitor` resource is a Cost Explorer resource type that continuously inspects your account's cost data for anomalies, based on `MonitorType` and `MonitorSpecification` . The content consists of detailed metadata and the current status of the monitor object.
 *
 * @cloudformationResource AWS::CE::AnomalyMonitor
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html
 */
export class CfnAnomalyMonitor extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CE::AnomalyMonitor";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnomalyMonitor {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAnomalyMonitorPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAnomalyMonitor(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The date when the monitor was created.
     * @cloudformationAttribute CreationDate
     */
    public readonly attrCreationDate: string;

    /**
     * The value for evaluated dimensions.
     * @cloudformationAttribute DimensionalValueCount
     */
    public readonly attrDimensionalValueCount: number;

    /**
     * The date when the monitor last evaluated for anomalies.
     * @cloudformationAttribute LastEvaluatedDate
     */
    public readonly attrLastEvaluatedDate: string;

    /**
     * The date when the monitor was last updated.
     * @cloudformationAttribute LastUpdatedDate
     */
    public readonly attrLastUpdatedDate: string;

    /**
     * The Amazon Resource Name (ARN) value for the monitor.
     * @cloudformationAttribute MonitorArn
     */
    public readonly attrMonitorArn: string;

    /**
     * The name of the monitor.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitorname
     */
    public monitorName: string;

    /**
     * The possible type values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitortype
     */
    public monitorType: string;

    /**
     * The dimensions to evaluate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitordimension
     */
    public monitorDimension: string | undefined;

    /**
     * The array of `MonitorSpecification` in JSON array format. For instance, you can use `MonitorSpecification` to specify a tag, Cost Category, or linked account for your custom anomaly monitor. For further information, see the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#aws-resource-ce-anomalymonitor--examples) section of this page.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitorspecification
     */
    public monitorSpecification: string | undefined;

    /**
     * `AWS::CE::AnomalyMonitor.ResourceTags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-resourcetags
     */
    public resourceTags: Array<CfnAnomalyMonitor.ResourceTagProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::CE::AnomalyMonitor`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAnomalyMonitorProps) {
        super(scope, id, { type: CfnAnomalyMonitor.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'monitorName', this);
        cdk.requireProperty(props, 'monitorType', this);
        this.attrCreationDate = cdk.Token.asString(this.getAtt('CreationDate', cdk.ResolutionTypeHint.STRING));
        this.attrDimensionalValueCount = cdk.Token.asNumber(this.getAtt('DimensionalValueCount', cdk.ResolutionTypeHint.NUMBER));
        this.attrLastEvaluatedDate = cdk.Token.asString(this.getAtt('LastEvaluatedDate', cdk.ResolutionTypeHint.STRING));
        this.attrLastUpdatedDate = cdk.Token.asString(this.getAtt('LastUpdatedDate', cdk.ResolutionTypeHint.STRING));
        this.attrMonitorArn = cdk.Token.asString(this.getAtt('MonitorArn', cdk.ResolutionTypeHint.STRING));

        this.monitorName = props.monitorName;
        this.monitorType = props.monitorType;
        this.monitorDimension = props.monitorDimension;
        this.monitorSpecification = props.monitorSpecification;
        this.resourceTags = props.resourceTags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAnomalyMonitor.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            monitorName: this.monitorName,
            monitorType: this.monitorType,
            monitorDimension: this.monitorDimension,
            monitorSpecification: this.monitorSpecification,
            resourceTags: this.resourceTags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAnomalyMonitorPropsToCloudFormation(props);
    }
}

export namespace CfnAnomalyMonitor {
    /**
     * The tag structure that contains a tag key and value.
     *
     * > Tagging is supported only for the following Cost Explorer resource types: [`AnomalyMonitor`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_AnomalyMonitor.html) , [`AnomalySubscription`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_AnomalySubscription.html) , [`CostCategory`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_CostCategory.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalymonitor-resourcetag.html
     */
    export interface ResourceTagProperty {
        /**
         * The key that's associated with the tag.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalymonitor-resourcetag.html#cfn-ce-anomalymonitor-resourcetag-key
         */
        readonly key: string;
        /**
         * The value that's associated with the tag.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalymonitor-resourcetag.html#cfn-ce-anomalymonitor-resourcetag-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourceTagProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceTagProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyMonitor_ResourceTagPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ResourceTagProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CE::AnomalyMonitor.ResourceTag` resource
 *
 * @param properties - the TypeScript properties of a `ResourceTagProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CE::AnomalyMonitor.ResourceTag` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyMonitorResourceTagPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyMonitor_ResourceTagPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnAnomalyMonitorResourceTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyMonitor.ResourceTagProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyMonitor.ResourceTagProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnAnomalySubscription`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html
 */
export interface CfnAnomalySubscriptionProps {

    /**
     * The frequency that anomaly reports are sent over email.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-frequency
     */
    readonly frequency: string;

    /**
     * A list of cost anomaly monitors.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-monitorarnlist
     */
    readonly monitorArnList: string[];

    /**
     * A list of subscribers to notify.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-subscribers
     */
    readonly subscribers: Array<CfnAnomalySubscription.SubscriberProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name for the subscription.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-subscriptionname
     */
    readonly subscriptionName: string;

    /**
     * `AWS::CE::AnomalySubscription.ResourceTags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-resourcetags
     */
    readonly resourceTags?: Array<CfnAnomalySubscription.ResourceTagProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * (deprecated)
     *
     * The dollar value that triggers a notification if the threshold is exceeded.
     *
     * This field has been deprecated. To specify a threshold, use ThresholdExpression. Continued use of Threshold will be treated as shorthand syntax for a ThresholdExpression.
     *
     * One of Threshold or ThresholdExpression is required for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-threshold
     */
    readonly threshold?: number;

    /**
     * `AWS::CE::AnomalySubscription.ThresholdExpression`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-thresholdexpression
     */
    readonly thresholdExpression?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAnomalySubscriptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnAnomalySubscriptionProps`
 *
 * @returns the result of the validation.
 */
function CfnAnomalySubscriptionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('frequency', cdk.requiredValidator)(properties.frequency));
    errors.collect(cdk.propertyValidator('frequency', cdk.validateString)(properties.frequency));
    errors.collect(cdk.propertyValidator('monitorArnList', cdk.requiredValidator)(properties.monitorArnList));
    errors.collect(cdk.propertyValidator('monitorArnList', cdk.listValidator(cdk.validateString))(properties.monitorArnList));
    errors.collect(cdk.propertyValidator('resourceTags', cdk.listValidator(CfnAnomalySubscription_ResourceTagPropertyValidator))(properties.resourceTags));
    errors.collect(cdk.propertyValidator('subscribers', cdk.requiredValidator)(properties.subscribers));
    errors.collect(cdk.propertyValidator('subscribers', cdk.listValidator(CfnAnomalySubscription_SubscriberPropertyValidator))(properties.subscribers));
    errors.collect(cdk.propertyValidator('subscriptionName', cdk.requiredValidator)(properties.subscriptionName));
    errors.collect(cdk.propertyValidator('subscriptionName', cdk.validateString)(properties.subscriptionName));
    errors.collect(cdk.propertyValidator('threshold', cdk.validateNumber)(properties.threshold));
    errors.collect(cdk.propertyValidator('thresholdExpression', cdk.validateString)(properties.thresholdExpression));
    return errors.wrap('supplied properties not correct for "CfnAnomalySubscriptionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CE::AnomalySubscription` resource
 *
 * @param properties - the TypeScript properties of a `CfnAnomalySubscriptionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CE::AnomalySubscription` resource.
 */
// @ts-ignore TS6133
function cfnAnomalySubscriptionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalySubscriptionPropsValidator(properties).assertSuccess();
    return {
        Frequency: cdk.stringToCloudFormation(properties.frequency),
        MonitorArnList: cdk.listMapper(cdk.stringToCloudFormation)(properties.monitorArnList),
        Subscribers: cdk.listMapper(cfnAnomalySubscriptionSubscriberPropertyToCloudFormation)(properties.subscribers),
        SubscriptionName: cdk.stringToCloudFormation(properties.subscriptionName),
        ResourceTags: cdk.listMapper(cfnAnomalySubscriptionResourceTagPropertyToCloudFormation)(properties.resourceTags),
        Threshold: cdk.numberToCloudFormation(properties.threshold),
        ThresholdExpression: cdk.stringToCloudFormation(properties.thresholdExpression),
    };
}

// @ts-ignore TS6133
function CfnAnomalySubscriptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalySubscriptionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalySubscriptionProps>();
    ret.addPropertyResult('frequency', 'Frequency', cfn_parse.FromCloudFormation.getString(properties.Frequency));
    ret.addPropertyResult('monitorArnList', 'MonitorArnList', cfn_parse.FromCloudFormation.getStringArray(properties.MonitorArnList));
    ret.addPropertyResult('subscribers', 'Subscribers', cfn_parse.FromCloudFormation.getArray(CfnAnomalySubscriptionSubscriberPropertyFromCloudFormation)(properties.Subscribers));
    ret.addPropertyResult('subscriptionName', 'SubscriptionName', cfn_parse.FromCloudFormation.getString(properties.SubscriptionName));
    ret.addPropertyResult('resourceTags', 'ResourceTags', properties.ResourceTags != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalySubscriptionResourceTagPropertyFromCloudFormation)(properties.ResourceTags) : undefined);
    ret.addPropertyResult('threshold', 'Threshold', properties.Threshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.Threshold) : undefined);
    ret.addPropertyResult('thresholdExpression', 'ThresholdExpression', properties.ThresholdExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ThresholdExpression) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CE::AnomalySubscription`
 *
 * The `AWS::CE::AnomalySubscription` resource is a Cost Explorer resource type that associates a monitor, threshold, and list of subscribers. It delivers notifications about anomalies detected by a monitor that exceeds a threshold. The content consists of the detailed metadata and the current status of the `AnomalySubscription` object.
 *
 * @cloudformationResource AWS::CE::AnomalySubscription
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html
 */
export class CfnAnomalySubscription extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CE::AnomalySubscription";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnomalySubscription {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAnomalySubscriptionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAnomalySubscription(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Your unique account identifier.
     * @cloudformationAttribute AccountId
     */
    public readonly attrAccountId: string;

    /**
     * The `AnomalySubscription` Amazon Resource Name (ARN).
     * @cloudformationAttribute SubscriptionArn
     */
    public readonly attrSubscriptionArn: string;

    /**
     * The frequency that anomaly reports are sent over email.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-frequency
     */
    public frequency: string;

    /**
     * A list of cost anomaly monitors.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-monitorarnlist
     */
    public monitorArnList: string[];

    /**
     * A list of subscribers to notify.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-subscribers
     */
    public subscribers: Array<CfnAnomalySubscription.SubscriberProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name for the subscription.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-subscriptionname
     */
    public subscriptionName: string;

    /**
     * `AWS::CE::AnomalySubscription.ResourceTags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-resourcetags
     */
    public resourceTags: Array<CfnAnomalySubscription.ResourceTagProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * (deprecated)
     *
     * The dollar value that triggers a notification if the threshold is exceeded.
     *
     * This field has been deprecated. To specify a threshold, use ThresholdExpression. Continued use of Threshold will be treated as shorthand syntax for a ThresholdExpression.
     *
     * One of Threshold or ThresholdExpression is required for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-threshold
     */
    public threshold: number | undefined;

    /**
     * `AWS::CE::AnomalySubscription.ThresholdExpression`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-thresholdexpression
     */
    public thresholdExpression: string | undefined;

    /**
     * Create a new `AWS::CE::AnomalySubscription`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAnomalySubscriptionProps) {
        super(scope, id, { type: CfnAnomalySubscription.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'frequency', this);
        cdk.requireProperty(props, 'monitorArnList', this);
        cdk.requireProperty(props, 'subscribers', this);
        cdk.requireProperty(props, 'subscriptionName', this);
        this.attrAccountId = cdk.Token.asString(this.getAtt('AccountId', cdk.ResolutionTypeHint.STRING));
        this.attrSubscriptionArn = cdk.Token.asString(this.getAtt('SubscriptionArn', cdk.ResolutionTypeHint.STRING));

        this.frequency = props.frequency;
        this.monitorArnList = props.monitorArnList;
        this.subscribers = props.subscribers;
        this.subscriptionName = props.subscriptionName;
        this.resourceTags = props.resourceTags;
        this.threshold = props.threshold;
        this.thresholdExpression = props.thresholdExpression;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAnomalySubscription.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            frequency: this.frequency,
            monitorArnList: this.monitorArnList,
            subscribers: this.subscribers,
            subscriptionName: this.subscriptionName,
            resourceTags: this.resourceTags,
            threshold: this.threshold,
            thresholdExpression: this.thresholdExpression,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAnomalySubscriptionPropsToCloudFormation(props);
    }
}

export namespace CfnAnomalySubscription {
    /**
     * The tag structure that contains a tag key and value.
     *
     * > Tagging is supported only for the following Cost Explorer resource types: [`AnomalyMonitor`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_AnomalyMonitor.html) , [`AnomalySubscription`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_AnomalySubscription.html) , [`CostCategory`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_CostCategory.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-resourcetag.html
     */
    export interface ResourceTagProperty {
        /**
         * The key that's associated with the tag.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-resourcetag.html#cfn-ce-anomalysubscription-resourcetag-key
         */
        readonly key: string;
        /**
         * The value that's associated with the tag.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-resourcetag.html#cfn-ce-anomalysubscription-resourcetag-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourceTagProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceTagProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalySubscription_ResourceTagPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ResourceTagProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CE::AnomalySubscription.ResourceTag` resource
 *
 * @param properties - the TypeScript properties of a `ResourceTagProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CE::AnomalySubscription.ResourceTag` resource.
 */
// @ts-ignore TS6133
function cfnAnomalySubscriptionResourceTagPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalySubscription_ResourceTagPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnAnomalySubscriptionResourceTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalySubscription.ResourceTagProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalySubscription.ResourceTagProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalySubscription {
    /**
     * The recipient of `AnomalySubscription` notifications.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-subscriber.html
     */
    export interface SubscriberProperty {
        /**
         * The email address or SNS Topic Amazon Resource Name (ARN), depending on the `Type` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-subscriber.html#cfn-ce-anomalysubscription-subscriber-address
         */
        readonly address: string;
        /**
         * Indicates if the subscriber accepts the notifications.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-subscriber.html#cfn-ce-anomalysubscription-subscriber-status
         */
        readonly status?: string;
        /**
         * The notification delivery channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-subscriber.html#cfn-ce-anomalysubscription-subscriber-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `SubscriberProperty`
 *
 * @param properties - the TypeScript properties of a `SubscriberProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalySubscription_SubscriberPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('address', cdk.requiredValidator)(properties.address));
    errors.collect(cdk.propertyValidator('address', cdk.validateString)(properties.address));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "SubscriberProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CE::AnomalySubscription.Subscriber` resource
 *
 * @param properties - the TypeScript properties of a `SubscriberProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CE::AnomalySubscription.Subscriber` resource.
 */
// @ts-ignore TS6133
function cfnAnomalySubscriptionSubscriberPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalySubscription_SubscriberPropertyValidator(properties).assertSuccess();
    return {
        Address: cdk.stringToCloudFormation(properties.address),
        Status: cdk.stringToCloudFormation(properties.status),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnAnomalySubscriptionSubscriberPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalySubscription.SubscriberProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalySubscription.SubscriberProperty>();
    ret.addPropertyResult('address', 'Address', cfn_parse.FromCloudFormation.getString(properties.Address));
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnCostCategory`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html
 */
export interface CfnCostCategoryProps {

    /**
     * The unique name of the Cost Category.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-name
     */
    readonly name: string;

    /**
     * The array of CostCategoryRule in JSON array format.
     *
     * > Rules are processed in order. If there are multiple rules that match the line item, then the first rule to match is used to determine that Cost Category value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-rules
     */
    readonly rules: string;

    /**
     * The rule schema version in this particular Cost Category.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-ruleversion
     */
    readonly ruleVersion: string;

    /**
     * The default value for the cost category.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-defaultvalue
     */
    readonly defaultValue?: string;

    /**
     * The split charge rules that are used to allocate your charges between your Cost Category values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-splitchargerules
     */
    readonly splitChargeRules?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCostCategoryProps`
 *
 * @param properties - the TypeScript properties of a `CfnCostCategoryProps`
 *
 * @returns the result of the validation.
 */
function CfnCostCategoryPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('ruleVersion', cdk.requiredValidator)(properties.ruleVersion));
    errors.collect(cdk.propertyValidator('ruleVersion', cdk.validateString)(properties.ruleVersion));
    errors.collect(cdk.propertyValidator('rules', cdk.requiredValidator)(properties.rules));
    errors.collect(cdk.propertyValidator('rules', cdk.validateString)(properties.rules));
    errors.collect(cdk.propertyValidator('splitChargeRules', cdk.validateString)(properties.splitChargeRules));
    return errors.wrap('supplied properties not correct for "CfnCostCategoryProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CE::CostCategory` resource
 *
 * @param properties - the TypeScript properties of a `CfnCostCategoryProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CE::CostCategory` resource.
 */
// @ts-ignore TS6133
function cfnCostCategoryPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCostCategoryPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Rules: cdk.stringToCloudFormation(properties.rules),
        RuleVersion: cdk.stringToCloudFormation(properties.ruleVersion),
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
        SplitChargeRules: cdk.stringToCloudFormation(properties.splitChargeRules),
    };
}

// @ts-ignore TS6133
function CfnCostCategoryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCostCategoryProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCostCategoryProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getString(properties.Rules));
    ret.addPropertyResult('ruleVersion', 'RuleVersion', cfn_parse.FromCloudFormation.getString(properties.RuleVersion));
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined);
    ret.addPropertyResult('splitChargeRules', 'SplitChargeRules', properties.SplitChargeRules != null ? cfn_parse.FromCloudFormation.getString(properties.SplitChargeRules) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CE::CostCategory`
 *
 * The `AWS::CE::CostCategory` resource creates groupings of cost that you can use across products in the AWS Billing and Cost Management console, such as Cost Explorer and AWS Budgets. For more information, see [Managing Your Costs with Cost Categories](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/manage-cost-categories.html) in the *AWS Billing and Cost Management User Guide* .
 *
 * @cloudformationResource AWS::CE::CostCategory
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html
 */
export class CfnCostCategory extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CE::CostCategory";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCostCategory {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCostCategoryPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCostCategory(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for your Cost Category.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The Cost Category's effective start date.
     * @cloudformationAttribute EffectiveStart
     */
    public readonly attrEffectiveStart: string;

    /**
     * The unique name of the Cost Category.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-name
     */
    public name: string;

    /**
     * The array of CostCategoryRule in JSON array format.
     *
     * > Rules are processed in order. If there are multiple rules that match the line item, then the first rule to match is used to determine that Cost Category value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-rules
     */
    public rules: string;

    /**
     * The rule schema version in this particular Cost Category.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-ruleversion
     */
    public ruleVersion: string;

    /**
     * The default value for the cost category.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-defaultvalue
     */
    public defaultValue: string | undefined;

    /**
     * The split charge rules that are used to allocate your charges between your Cost Category values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-splitchargerules
     */
    public splitChargeRules: string | undefined;

    /**
     * Create a new `AWS::CE::CostCategory`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCostCategoryProps) {
        super(scope, id, { type: CfnCostCategory.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'ruleVersion', this);
        cdk.requireProperty(props, 'rules', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrEffectiveStart = cdk.Token.asString(this.getAtt('EffectiveStart', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.rules = props.rules;
        this.ruleVersion = props.ruleVersion;
        this.defaultValue = props.defaultValue;
        this.splitChargeRules = props.splitChargeRules;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCostCategory.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            rules: this.rules,
            ruleVersion: this.ruleVersion,
            defaultValue: this.defaultValue,
            splitChargeRules: this.splitChargeRules,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCostCategoryPropsToCloudFormation(props);
    }
}
