// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:05.720Z","fingerprint":"17A4bj5VwUv3u/45yujRhmS2xEcv6dQhouiAHtWP+8s="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAlert`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html
 */
export interface CfnAlertProps {

    /**
     * Action that will be triggered when there is an alert.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-action
     */
    readonly action: CfnAlert.ActionProperty | cdk.IResolvable;

    /**
     * An integer from 0 to 100 specifying the alert sensitivity threshold.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertsensitivitythreshold
     */
    readonly alertSensitivityThreshold: number;

    /**
     * The ARN of the detector to which the alert is attached.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-anomalydetectorarn
     */
    readonly anomalyDetectorArn: string;

    /**
     * A description of the alert.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertdescription
     */
    readonly alertDescription?: string;

    /**
     * The name of the alert.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertname
     */
    readonly alertName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAlertProps`
 *
 * @param properties - the TypeScript properties of a `CfnAlertProps`
 *
 * @returns the result of the validation.
 */
function CfnAlertPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', CfnAlert_ActionPropertyValidator)(properties.action));
    errors.collect(cdk.propertyValidator('alertDescription', cdk.validateString)(properties.alertDescription));
    errors.collect(cdk.propertyValidator('alertName', cdk.validateString)(properties.alertName));
    errors.collect(cdk.propertyValidator('alertSensitivityThreshold', cdk.requiredValidator)(properties.alertSensitivityThreshold));
    errors.collect(cdk.propertyValidator('alertSensitivityThreshold', cdk.validateNumber)(properties.alertSensitivityThreshold));
    errors.collect(cdk.propertyValidator('anomalyDetectorArn', cdk.requiredValidator)(properties.anomalyDetectorArn));
    errors.collect(cdk.propertyValidator('anomalyDetectorArn', cdk.validateString)(properties.anomalyDetectorArn));
    return errors.wrap('supplied properties not correct for "CfnAlertProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::Alert` resource
 *
 * @param properties - the TypeScript properties of a `CfnAlertProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::Alert` resource.
 */
// @ts-ignore TS6133
function cfnAlertPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlertPropsValidator(properties).assertSuccess();
    return {
        Action: cfnAlertActionPropertyToCloudFormation(properties.action),
        AlertSensitivityThreshold: cdk.numberToCloudFormation(properties.alertSensitivityThreshold),
        AnomalyDetectorArn: cdk.stringToCloudFormation(properties.anomalyDetectorArn),
        AlertDescription: cdk.stringToCloudFormation(properties.alertDescription),
        AlertName: cdk.stringToCloudFormation(properties.alertName),
    };
}

// @ts-ignore TS6133
function CfnAlertPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlertProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlertProps>();
    ret.addPropertyResult('action', 'Action', CfnAlertActionPropertyFromCloudFormation(properties.Action));
    ret.addPropertyResult('alertSensitivityThreshold', 'AlertSensitivityThreshold', cfn_parse.FromCloudFormation.getNumber(properties.AlertSensitivityThreshold));
    ret.addPropertyResult('anomalyDetectorArn', 'AnomalyDetectorArn', cfn_parse.FromCloudFormation.getString(properties.AnomalyDetectorArn));
    ret.addPropertyResult('alertDescription', 'AlertDescription', properties.AlertDescription != null ? cfn_parse.FromCloudFormation.getString(properties.AlertDescription) : undefined);
    ret.addPropertyResult('alertName', 'AlertName', properties.AlertName != null ? cfn_parse.FromCloudFormation.getString(properties.AlertName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::LookoutMetrics::Alert`
 *
 * The `AWS::LookoutMetrics::Alert` type creates an alert for an anomaly detector.
 *
 * @cloudformationResource AWS::LookoutMetrics::Alert
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html
 */
export class CfnAlert extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LookoutMetrics::Alert";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAlert {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAlertPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAlert(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the alert. For example, `arn:aws:lookoutmetrics:us-east-2:123456789012:Alert:my-alert`
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Action that will be triggered when there is an alert.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-action
     */
    public action: CfnAlert.ActionProperty | cdk.IResolvable;

    /**
     * An integer from 0 to 100 specifying the alert sensitivity threshold.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertsensitivitythreshold
     */
    public alertSensitivityThreshold: number;

    /**
     * The ARN of the detector to which the alert is attached.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-anomalydetectorarn
     */
    public anomalyDetectorArn: string;

    /**
     * A description of the alert.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertdescription
     */
    public alertDescription: string | undefined;

    /**
     * The name of the alert.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertname
     */
    public alertName: string | undefined;

    /**
     * Create a new `AWS::LookoutMetrics::Alert`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAlertProps) {
        super(scope, id, { type: CfnAlert.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'action', this);
        cdk.requireProperty(props, 'alertSensitivityThreshold', this);
        cdk.requireProperty(props, 'anomalyDetectorArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.action = props.action;
        this.alertSensitivityThreshold = props.alertSensitivityThreshold;
        this.anomalyDetectorArn = props.anomalyDetectorArn;
        this.alertDescription = props.alertDescription;
        this.alertName = props.alertName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAlert.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            action: this.action,
            alertSensitivityThreshold: this.alertSensitivityThreshold,
            anomalyDetectorArn: this.anomalyDetectorArn,
            alertDescription: this.alertDescription,
            alertName: this.alertName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAlertPropsToCloudFormation(props);
    }
}

export namespace CfnAlert {
    /**
     * A configuration that specifies the action to perform when anomalies are detected.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-action.html
     */
    export interface ActionProperty {
        /**
         * A configuration for an AWS Lambda channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-action.html#cfn-lookoutmetrics-alert-action-lambdaconfiguration
         */
        readonly lambdaConfiguration?: CfnAlert.LambdaConfigurationProperty | cdk.IResolvable;
        /**
         * A configuration for an Amazon SNS channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-action.html#cfn-lookoutmetrics-alert-action-snsconfiguration
         */
        readonly snsConfiguration?: CfnAlert.SNSConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnAlert_ActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lambdaConfiguration', CfnAlert_LambdaConfigurationPropertyValidator)(properties.lambdaConfiguration));
    errors.collect(cdk.propertyValidator('snsConfiguration', CfnAlert_SNSConfigurationPropertyValidator)(properties.snsConfiguration));
    return errors.wrap('supplied properties not correct for "ActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::Alert.Action` resource
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::Alert.Action` resource.
 */
// @ts-ignore TS6133
function cfnAlertActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlert_ActionPropertyValidator(properties).assertSuccess();
    return {
        LambdaConfiguration: cfnAlertLambdaConfigurationPropertyToCloudFormation(properties.lambdaConfiguration),
        SNSConfiguration: cfnAlertSNSConfigurationPropertyToCloudFormation(properties.snsConfiguration),
    };
}

// @ts-ignore TS6133
function CfnAlertActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlert.ActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlert.ActionProperty>();
    ret.addPropertyResult('lambdaConfiguration', 'LambdaConfiguration', properties.LambdaConfiguration != null ? CfnAlertLambdaConfigurationPropertyFromCloudFormation(properties.LambdaConfiguration) : undefined);
    ret.addPropertyResult('snsConfiguration', 'SNSConfiguration', properties.SNSConfiguration != null ? CfnAlertSNSConfigurationPropertyFromCloudFormation(properties.SNSConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAlert {
    /**
     * Contains information about a Lambda configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-lambdaconfiguration.html
     */
    export interface LambdaConfigurationProperty {
        /**
         * The ARN of the Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-lambdaconfiguration.html#cfn-lookoutmetrics-alert-lambdaconfiguration-lambdaarn
         */
        readonly lambdaArn: string;
        /**
         * The ARN of an IAM role that has permission to invoke the Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-lambdaconfiguration.html#cfn-lookoutmetrics-alert-lambdaconfiguration-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAlert_LambdaConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lambdaArn', cdk.requiredValidator)(properties.lambdaArn));
    errors.collect(cdk.propertyValidator('lambdaArn', cdk.validateString)(properties.lambdaArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "LambdaConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::Alert.LambdaConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LambdaConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::Alert.LambdaConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAlertLambdaConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlert_LambdaConfigurationPropertyValidator(properties).assertSuccess();
    return {
        LambdaArn: cdk.stringToCloudFormation(properties.lambdaArn),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnAlertLambdaConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlert.LambdaConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlert.LambdaConfigurationProperty>();
    ret.addPropertyResult('lambdaArn', 'LambdaArn', cfn_parse.FromCloudFormation.getString(properties.LambdaArn));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAlert {
    /**
     * Contains information about the SNS topic to which you want to send your alerts and the IAM role that has access to that topic.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-snsconfiguration.html
     */
    export interface SNSConfigurationProperty {
        /**
         * The ARN of the IAM role that has access to the target SNS topic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-snsconfiguration.html#cfn-lookoutmetrics-alert-snsconfiguration-rolearn
         */
        readonly roleArn: string;
        /**
         * The ARN of the target SNS topic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-snsconfiguration.html#cfn-lookoutmetrics-alert-snsconfiguration-snstopicarn
         */
        readonly snsTopicArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `SNSConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SNSConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAlert_SNSConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('snsTopicArn', cdk.requiredValidator)(properties.snsTopicArn));
    errors.collect(cdk.propertyValidator('snsTopicArn', cdk.validateString)(properties.snsTopicArn));
    return errors.wrap('supplied properties not correct for "SNSConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::Alert.SNSConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SNSConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::Alert.SNSConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAlertSNSConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAlert_SNSConfigurationPropertyValidator(properties).assertSuccess();
    return {
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SnsTopicArn: cdk.stringToCloudFormation(properties.snsTopicArn),
    };
}

// @ts-ignore TS6133
function CfnAlertSNSConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlert.SNSConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlert.SNSConfigurationProperty>();
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('snsTopicArn', 'SnsTopicArn', cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnAnomalyDetector`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html
 */
export interface CfnAnomalyDetectorProps {

    /**
     * Contains information about the configuration of the anomaly detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectorconfig
     */
    readonly anomalyDetectorConfig: CfnAnomalyDetector.AnomalyDetectorConfigProperty | cdk.IResolvable;

    /**
     * The detector's dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-metricsetlist
     */
    readonly metricSetList: Array<CfnAnomalyDetector.MetricSetProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A description of the detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectordescription
     */
    readonly anomalyDetectorDescription?: string;

    /**
     * The name of the detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectorname
     */
    readonly anomalyDetectorName?: string;

    /**
     * The ARN of the KMS key to use to encrypt your data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-kmskeyarn
     */
    readonly kmsKeyArn?: string;
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
    errors.collect(cdk.propertyValidator('anomalyDetectorConfig', cdk.requiredValidator)(properties.anomalyDetectorConfig));
    errors.collect(cdk.propertyValidator('anomalyDetectorConfig', CfnAnomalyDetector_AnomalyDetectorConfigPropertyValidator)(properties.anomalyDetectorConfig));
    errors.collect(cdk.propertyValidator('anomalyDetectorDescription', cdk.validateString)(properties.anomalyDetectorDescription));
    errors.collect(cdk.propertyValidator('anomalyDetectorName', cdk.validateString)(properties.anomalyDetectorName));
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('metricSetList', cdk.requiredValidator)(properties.metricSetList));
    errors.collect(cdk.propertyValidator('metricSetList', cdk.listValidator(CfnAnomalyDetector_MetricSetPropertyValidator))(properties.metricSetList));
    return errors.wrap('supplied properties not correct for "CfnAnomalyDetectorProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector` resource
 *
 * @param properties - the TypeScript properties of a `CfnAnomalyDetectorProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetectorPropsValidator(properties).assertSuccess();
    return {
        AnomalyDetectorConfig: cfnAnomalyDetectorAnomalyDetectorConfigPropertyToCloudFormation(properties.anomalyDetectorConfig),
        MetricSetList: cdk.listMapper(cfnAnomalyDetectorMetricSetPropertyToCloudFormation)(properties.metricSetList),
        AnomalyDetectorDescription: cdk.stringToCloudFormation(properties.anomalyDetectorDescription),
        AnomalyDetectorName: cdk.stringToCloudFormation(properties.anomalyDetectorName),
        KmsKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetectorProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetectorProps>();
    ret.addPropertyResult('anomalyDetectorConfig', 'AnomalyDetectorConfig', CfnAnomalyDetectorAnomalyDetectorConfigPropertyFromCloudFormation(properties.AnomalyDetectorConfig));
    ret.addPropertyResult('metricSetList', 'MetricSetList', cfn_parse.FromCloudFormation.getArray(CfnAnomalyDetectorMetricSetPropertyFromCloudFormation)(properties.MetricSetList));
    ret.addPropertyResult('anomalyDetectorDescription', 'AnomalyDetectorDescription', properties.AnomalyDetectorDescription != null ? cfn_parse.FromCloudFormation.getString(properties.AnomalyDetectorDescription) : undefined);
    ret.addPropertyResult('anomalyDetectorName', 'AnomalyDetectorName', properties.AnomalyDetectorName != null ? cfn_parse.FromCloudFormation.getString(properties.AnomalyDetectorName) : undefined);
    ret.addPropertyResult('kmsKeyArn', 'KmsKeyArn', properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::LookoutMetrics::AnomalyDetector`
 *
 * The `AWS::LookoutMetrics::AnomalyDetector` type creates an anomaly detector.
 *
 * @cloudformationResource AWS::LookoutMetrics::AnomalyDetector
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html
 */
export class CfnAnomalyDetector extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LookoutMetrics::AnomalyDetector";

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
     * The Amazon Resource Name (ARN) of the detector. For example, `arn:aws:lookoutmetrics:us-east-2:123456789012:AnomalyDetector:my-detector`
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Contains information about the configuration of the anomaly detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectorconfig
     */
    public anomalyDetectorConfig: CfnAnomalyDetector.AnomalyDetectorConfigProperty | cdk.IResolvable;

    /**
     * The detector's dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-metricsetlist
     */
    public metricSetList: Array<CfnAnomalyDetector.MetricSetProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A description of the detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectordescription
     */
    public anomalyDetectorDescription: string | undefined;

    /**
     * The name of the detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectorname
     */
    public anomalyDetectorName: string | undefined;

    /**
     * The ARN of the KMS key to use to encrypt your data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-kmskeyarn
     */
    public kmsKeyArn: string | undefined;

    /**
     * Create a new `AWS::LookoutMetrics::AnomalyDetector`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAnomalyDetectorProps) {
        super(scope, id, { type: CfnAnomalyDetector.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'anomalyDetectorConfig', this);
        cdk.requireProperty(props, 'metricSetList', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.anomalyDetectorConfig = props.anomalyDetectorConfig;
        this.metricSetList = props.metricSetList;
        this.anomalyDetectorDescription = props.anomalyDetectorDescription;
        this.anomalyDetectorName = props.anomalyDetectorName;
        this.kmsKeyArn = props.kmsKeyArn;
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

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            anomalyDetectorConfig: this.anomalyDetectorConfig,
            metricSetList: this.metricSetList,
            anomalyDetectorDescription: this.anomalyDetectorDescription,
            anomalyDetectorName: this.anomalyDetectorName,
            kmsKeyArn: this.kmsKeyArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAnomalyDetectorPropsToCloudFormation(props);
    }
}

export namespace CfnAnomalyDetector {
    /**
     * Contains information about a detector's configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-anomalydetectorconfig.html
     */
    export interface AnomalyDetectorConfigProperty {
        /**
         * The frequency at which the detector analyzes its source data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-anomalydetectorconfig.html#cfn-lookoutmetrics-anomalydetector-anomalydetectorconfig-anomalydetectorfrequency
         */
        readonly anomalyDetectorFrequency: string;
    }
}

/**
 * Determine whether the given properties match those of a `AnomalyDetectorConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AnomalyDetectorConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_AnomalyDetectorConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('anomalyDetectorFrequency', cdk.requiredValidator)(properties.anomalyDetectorFrequency));
    errors.collect(cdk.propertyValidator('anomalyDetectorFrequency', cdk.validateString)(properties.anomalyDetectorFrequency));
    return errors.wrap('supplied properties not correct for "AnomalyDetectorConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.AnomalyDetectorConfig` resource
 *
 * @param properties - the TypeScript properties of a `AnomalyDetectorConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.AnomalyDetectorConfig` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorAnomalyDetectorConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_AnomalyDetectorConfigPropertyValidator(properties).assertSuccess();
    return {
        AnomalyDetectorFrequency: cdk.stringToCloudFormation(properties.anomalyDetectorFrequency),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorAnomalyDetectorConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.AnomalyDetectorConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.AnomalyDetectorConfigProperty>();
    ret.addPropertyResult('anomalyDetectorFrequency', 'AnomalyDetectorFrequency', cfn_parse.FromCloudFormation.getString(properties.AnomalyDetectorFrequency));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Details about an Amazon AppFlow flow datasource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-appflowconfig.html
     */
    export interface AppFlowConfigProperty {
        /**
         * name of the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-appflowconfig.html#cfn-lookoutmetrics-anomalydetector-appflowconfig-flowname
         */
        readonly flowName: string;
        /**
         * An IAM role that gives Amazon Lookout for Metrics permission to access the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-appflowconfig.html#cfn-lookoutmetrics-anomalydetector-appflowconfig-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `AppFlowConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AppFlowConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_AppFlowConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('flowName', cdk.requiredValidator)(properties.flowName));
    errors.collect(cdk.propertyValidator('flowName', cdk.validateString)(properties.flowName));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "AppFlowConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.AppFlowConfig` resource
 *
 * @param properties - the TypeScript properties of a `AppFlowConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.AppFlowConfig` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorAppFlowConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_AppFlowConfigPropertyValidator(properties).assertSuccess();
    return {
        FlowName: cdk.stringToCloudFormation(properties.flowName),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorAppFlowConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.AppFlowConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.AppFlowConfigProperty>();
    ret.addPropertyResult('flowName', 'FlowName', cfn_parse.FromCloudFormation.getString(properties.FlowName));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Details about an Amazon CloudWatch datasource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-cloudwatchconfig.html
     */
    export interface CloudwatchConfigProperty {
        /**
         * An IAM role that gives Amazon Lookout for Metrics permission to access data in Amazon CloudWatch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-cloudwatchconfig.html#cfn-lookoutmetrics-anomalydetector-cloudwatchconfig-rolearn
         */
        readonly roleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudwatchConfigProperty`
 *
 * @param properties - the TypeScript properties of a `CloudwatchConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_CloudwatchConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "CloudwatchConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.CloudwatchConfig` resource
 *
 * @param properties - the TypeScript properties of a `CloudwatchConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.CloudwatchConfig` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorCloudwatchConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_CloudwatchConfigPropertyValidator(properties).assertSuccess();
    return {
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorCloudwatchConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.CloudwatchConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.CloudwatchConfigProperty>();
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Contains information about how a source CSV data file should be analyzed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html
     */
    export interface CsvFormatDescriptorProperty {
        /**
         * The character set in which the source CSV file is written.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-charset
         */
        readonly charset?: string;
        /**
         * Whether or not the source CSV file contains a header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-containsheader
         */
        readonly containsHeader?: boolean | cdk.IResolvable;
        /**
         * The character used to delimit the source CSV file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-delimiter
         */
        readonly delimiter?: string;
        /**
         * The level of compression of the source CSV file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-filecompression
         */
        readonly fileCompression?: string;
        /**
         * A list of the source CSV file's headers, if any.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-headerlist
         */
        readonly headerList?: string[];
        /**
         * The character used as a quote character.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-csvformatdescriptor-quotesymbol
         */
        readonly quoteSymbol?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CsvFormatDescriptorProperty`
 *
 * @param properties - the TypeScript properties of a `CsvFormatDescriptorProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_CsvFormatDescriptorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('charset', cdk.validateString)(properties.charset));
    errors.collect(cdk.propertyValidator('containsHeader', cdk.validateBoolean)(properties.containsHeader));
    errors.collect(cdk.propertyValidator('delimiter', cdk.validateString)(properties.delimiter));
    errors.collect(cdk.propertyValidator('fileCompression', cdk.validateString)(properties.fileCompression));
    errors.collect(cdk.propertyValidator('headerList', cdk.listValidator(cdk.validateString))(properties.headerList));
    errors.collect(cdk.propertyValidator('quoteSymbol', cdk.validateString)(properties.quoteSymbol));
    return errors.wrap('supplied properties not correct for "CsvFormatDescriptorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.CsvFormatDescriptor` resource
 *
 * @param properties - the TypeScript properties of a `CsvFormatDescriptorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.CsvFormatDescriptor` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorCsvFormatDescriptorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_CsvFormatDescriptorPropertyValidator(properties).assertSuccess();
    return {
        Charset: cdk.stringToCloudFormation(properties.charset),
        ContainsHeader: cdk.booleanToCloudFormation(properties.containsHeader),
        Delimiter: cdk.stringToCloudFormation(properties.delimiter),
        FileCompression: cdk.stringToCloudFormation(properties.fileCompression),
        HeaderList: cdk.listMapper(cdk.stringToCloudFormation)(properties.headerList),
        QuoteSymbol: cdk.stringToCloudFormation(properties.quoteSymbol),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorCsvFormatDescriptorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.CsvFormatDescriptorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.CsvFormatDescriptorProperty>();
    ret.addPropertyResult('charset', 'Charset', properties.Charset != null ? cfn_parse.FromCloudFormation.getString(properties.Charset) : undefined);
    ret.addPropertyResult('containsHeader', 'ContainsHeader', properties.ContainsHeader != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ContainsHeader) : undefined);
    ret.addPropertyResult('delimiter', 'Delimiter', properties.Delimiter != null ? cfn_parse.FromCloudFormation.getString(properties.Delimiter) : undefined);
    ret.addPropertyResult('fileCompression', 'FileCompression', properties.FileCompression != null ? cfn_parse.FromCloudFormation.getString(properties.FileCompression) : undefined);
    ret.addPropertyResult('headerList', 'HeaderList', properties.HeaderList != null ? cfn_parse.FromCloudFormation.getStringArray(properties.HeaderList) : undefined);
    ret.addPropertyResult('quoteSymbol', 'QuoteSymbol', properties.QuoteSymbol != null ? cfn_parse.FromCloudFormation.getString(properties.QuoteSymbol) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Contains information about a source file's formatting.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-fileformatdescriptor.html
     */
    export interface FileFormatDescriptorProperty {
        /**
         * Contains information about how a source CSV data file should be analyzed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-fileformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-fileformatdescriptor-csvformatdescriptor
         */
        readonly csvFormatDescriptor?: CfnAnomalyDetector.CsvFormatDescriptorProperty | cdk.IResolvable;
        /**
         * Contains information about how a source JSON data file should be analyzed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-fileformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-fileformatdescriptor-jsonformatdescriptor
         */
        readonly jsonFormatDescriptor?: CfnAnomalyDetector.JsonFormatDescriptorProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FileFormatDescriptorProperty`
 *
 * @param properties - the TypeScript properties of a `FileFormatDescriptorProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_FileFormatDescriptorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('csvFormatDescriptor', CfnAnomalyDetector_CsvFormatDescriptorPropertyValidator)(properties.csvFormatDescriptor));
    errors.collect(cdk.propertyValidator('jsonFormatDescriptor', CfnAnomalyDetector_JsonFormatDescriptorPropertyValidator)(properties.jsonFormatDescriptor));
    return errors.wrap('supplied properties not correct for "FileFormatDescriptorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.FileFormatDescriptor` resource
 *
 * @param properties - the TypeScript properties of a `FileFormatDescriptorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.FileFormatDescriptor` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorFileFormatDescriptorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_FileFormatDescriptorPropertyValidator(properties).assertSuccess();
    return {
        CsvFormatDescriptor: cfnAnomalyDetectorCsvFormatDescriptorPropertyToCloudFormation(properties.csvFormatDescriptor),
        JsonFormatDescriptor: cfnAnomalyDetectorJsonFormatDescriptorPropertyToCloudFormation(properties.jsonFormatDescriptor),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorFileFormatDescriptorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.FileFormatDescriptorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.FileFormatDescriptorProperty>();
    ret.addPropertyResult('csvFormatDescriptor', 'CsvFormatDescriptor', properties.CsvFormatDescriptor != null ? CfnAnomalyDetectorCsvFormatDescriptorPropertyFromCloudFormation(properties.CsvFormatDescriptor) : undefined);
    ret.addPropertyResult('jsonFormatDescriptor', 'JsonFormatDescriptor', properties.JsonFormatDescriptor != null ? CfnAnomalyDetectorJsonFormatDescriptorPropertyFromCloudFormation(properties.JsonFormatDescriptor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Contains information about how a source JSON data file should be analyzed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-jsonformatdescriptor.html
     */
    export interface JsonFormatDescriptorProperty {
        /**
         * The character set in which the source JSON file is written.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-jsonformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-jsonformatdescriptor-charset
         */
        readonly charset?: string;
        /**
         * The level of compression of the source CSV file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-jsonformatdescriptor.html#cfn-lookoutmetrics-anomalydetector-jsonformatdescriptor-filecompression
         */
        readonly fileCompression?: string;
    }
}

/**
 * Determine whether the given properties match those of a `JsonFormatDescriptorProperty`
 *
 * @param properties - the TypeScript properties of a `JsonFormatDescriptorProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_JsonFormatDescriptorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('charset', cdk.validateString)(properties.charset));
    errors.collect(cdk.propertyValidator('fileCompression', cdk.validateString)(properties.fileCompression));
    return errors.wrap('supplied properties not correct for "JsonFormatDescriptorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.JsonFormatDescriptor` resource
 *
 * @param properties - the TypeScript properties of a `JsonFormatDescriptorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.JsonFormatDescriptor` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorJsonFormatDescriptorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_JsonFormatDescriptorPropertyValidator(properties).assertSuccess();
    return {
        Charset: cdk.stringToCloudFormation(properties.charset),
        FileCompression: cdk.stringToCloudFormation(properties.fileCompression),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorJsonFormatDescriptorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.JsonFormatDescriptorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.JsonFormatDescriptorProperty>();
    ret.addPropertyResult('charset', 'Charset', properties.Charset != null ? cfn_parse.FromCloudFormation.getString(properties.Charset) : undefined);
    ret.addPropertyResult('fileCompression', 'FileCompression', properties.FileCompression != null ? cfn_parse.FromCloudFormation.getString(properties.FileCompression) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * A calculation made by contrasting a measure and a dimension from your source data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metric.html
     */
    export interface MetricProperty {
        /**
         * The function with which the metric is calculated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metric.html#cfn-lookoutmetrics-anomalydetector-metric-aggregationfunction
         */
        readonly aggregationFunction: string;
        /**
         * The name of the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metric.html#cfn-lookoutmetrics-anomalydetector-metric-metricname
         */
        readonly metricName: string;
        /**
         * The namespace for the metric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metric.html#cfn-lookoutmetrics-anomalydetector-metric-namespace
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
function CfnAnomalyDetector_MetricPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('aggregationFunction', cdk.requiredValidator)(properties.aggregationFunction));
    errors.collect(cdk.propertyValidator('aggregationFunction', cdk.validateString)(properties.aggregationFunction));
    errors.collect(cdk.propertyValidator('metricName', cdk.requiredValidator)(properties.metricName));
    errors.collect(cdk.propertyValidator('metricName', cdk.validateString)(properties.metricName));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    return errors.wrap('supplied properties not correct for "MetricProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.Metric` resource
 *
 * @param properties - the TypeScript properties of a `MetricProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.Metric` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorMetricPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_MetricPropertyValidator(properties).assertSuccess();
    return {
        AggregationFunction: cdk.stringToCloudFormation(properties.aggregationFunction),
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
    ret.addPropertyResult('aggregationFunction', 'AggregationFunction', cfn_parse.FromCloudFormation.getString(properties.AggregationFunction));
    ret.addPropertyResult('metricName', 'MetricName', cfn_parse.FromCloudFormation.getString(properties.MetricName));
    ret.addPropertyResult('namespace', 'Namespace', properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Contains information about a dataset.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html
     */
    export interface MetricSetProperty {
        /**
         * A list of the fields you want to treat as dimensions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-dimensionlist
         */
        readonly dimensionList?: string[];
        /**
         * A list of metrics that the dataset will contain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-metriclist
         */
        readonly metricList: Array<CfnAnomalyDetector.MetricProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A description of the dataset you are creating.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-metricsetdescription
         */
        readonly metricSetDescription?: string;
        /**
         * The frequency with which the source data will be analyzed for anomalies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-metricsetfrequency
         */
        readonly metricSetFrequency?: string;
        /**
         * The name of the dataset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-metricsetname
         */
        readonly metricSetName: string;
        /**
         * Contains information about how the source data should be interpreted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-metricsource
         */
        readonly metricSource: CfnAnomalyDetector.MetricSourceProperty | cdk.IResolvable;
        /**
         * After an interval ends, the amount of seconds that the detector waits before importing data. Offset is only supported for S3, Redshift, Athena and datasources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-offset
         */
        readonly offset?: number;
        /**
         * Contains information about the column used for tracking time in your source data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-timestampcolumn
         */
        readonly timestampColumn?: CfnAnomalyDetector.TimestampColumnProperty | cdk.IResolvable;
        /**
         * The time zone in which your source data was recorded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html#cfn-lookoutmetrics-anomalydetector-metricset-timezone
         */
        readonly timezone?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetricSetProperty`
 *
 * @param properties - the TypeScript properties of a `MetricSetProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_MetricSetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensionList', cdk.listValidator(cdk.validateString))(properties.dimensionList));
    errors.collect(cdk.propertyValidator('metricList', cdk.requiredValidator)(properties.metricList));
    errors.collect(cdk.propertyValidator('metricList', cdk.listValidator(CfnAnomalyDetector_MetricPropertyValidator))(properties.metricList));
    errors.collect(cdk.propertyValidator('metricSetDescription', cdk.validateString)(properties.metricSetDescription));
    errors.collect(cdk.propertyValidator('metricSetFrequency', cdk.validateString)(properties.metricSetFrequency));
    errors.collect(cdk.propertyValidator('metricSetName', cdk.requiredValidator)(properties.metricSetName));
    errors.collect(cdk.propertyValidator('metricSetName', cdk.validateString)(properties.metricSetName));
    errors.collect(cdk.propertyValidator('metricSource', cdk.requiredValidator)(properties.metricSource));
    errors.collect(cdk.propertyValidator('metricSource', CfnAnomalyDetector_MetricSourcePropertyValidator)(properties.metricSource));
    errors.collect(cdk.propertyValidator('offset', cdk.validateNumber)(properties.offset));
    errors.collect(cdk.propertyValidator('timestampColumn', CfnAnomalyDetector_TimestampColumnPropertyValidator)(properties.timestampColumn));
    errors.collect(cdk.propertyValidator('timezone', cdk.validateString)(properties.timezone));
    return errors.wrap('supplied properties not correct for "MetricSetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.MetricSet` resource
 *
 * @param properties - the TypeScript properties of a `MetricSetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.MetricSet` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorMetricSetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_MetricSetPropertyValidator(properties).assertSuccess();
    return {
        DimensionList: cdk.listMapper(cdk.stringToCloudFormation)(properties.dimensionList),
        MetricList: cdk.listMapper(cfnAnomalyDetectorMetricPropertyToCloudFormation)(properties.metricList),
        MetricSetDescription: cdk.stringToCloudFormation(properties.metricSetDescription),
        MetricSetFrequency: cdk.stringToCloudFormation(properties.metricSetFrequency),
        MetricSetName: cdk.stringToCloudFormation(properties.metricSetName),
        MetricSource: cfnAnomalyDetectorMetricSourcePropertyToCloudFormation(properties.metricSource),
        Offset: cdk.numberToCloudFormation(properties.offset),
        TimestampColumn: cfnAnomalyDetectorTimestampColumnPropertyToCloudFormation(properties.timestampColumn),
        Timezone: cdk.stringToCloudFormation(properties.timezone),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorMetricSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.MetricSetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.MetricSetProperty>();
    ret.addPropertyResult('dimensionList', 'DimensionList', properties.DimensionList != null ? cfn_parse.FromCloudFormation.getStringArray(properties.DimensionList) : undefined);
    ret.addPropertyResult('metricList', 'MetricList', cfn_parse.FromCloudFormation.getArray(CfnAnomalyDetectorMetricPropertyFromCloudFormation)(properties.MetricList));
    ret.addPropertyResult('metricSetDescription', 'MetricSetDescription', properties.MetricSetDescription != null ? cfn_parse.FromCloudFormation.getString(properties.MetricSetDescription) : undefined);
    ret.addPropertyResult('metricSetFrequency', 'MetricSetFrequency', properties.MetricSetFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.MetricSetFrequency) : undefined);
    ret.addPropertyResult('metricSetName', 'MetricSetName', cfn_parse.FromCloudFormation.getString(properties.MetricSetName));
    ret.addPropertyResult('metricSource', 'MetricSource', CfnAnomalyDetectorMetricSourcePropertyFromCloudFormation(properties.MetricSource));
    ret.addPropertyResult('offset', 'Offset', properties.Offset != null ? cfn_parse.FromCloudFormation.getNumber(properties.Offset) : undefined);
    ret.addPropertyResult('timestampColumn', 'TimestampColumn', properties.TimestampColumn != null ? CfnAnomalyDetectorTimestampColumnPropertyFromCloudFormation(properties.TimestampColumn) : undefined);
    ret.addPropertyResult('timezone', 'Timezone', properties.Timezone != null ? cfn_parse.FromCloudFormation.getString(properties.Timezone) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Contains information about how the source data should be interpreted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html
     */
    export interface MetricSourceProperty {
        /**
         * Details about an AppFlow datasource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html#cfn-lookoutmetrics-anomalydetector-metricsource-appflowconfig
         */
        readonly appFlowConfig?: CfnAnomalyDetector.AppFlowConfigProperty | cdk.IResolvable;
        /**
         * Details about an Amazon CloudWatch monitoring datasource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html#cfn-lookoutmetrics-anomalydetector-metricsource-cloudwatchconfig
         */
        readonly cloudwatchConfig?: CfnAnomalyDetector.CloudwatchConfigProperty | cdk.IResolvable;
        /**
         * Details about an Amazon Relational Database Service (RDS) datasource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html#cfn-lookoutmetrics-anomalydetector-metricsource-rdssourceconfig
         */
        readonly rdsSourceConfig?: CfnAnomalyDetector.RDSSourceConfigProperty | cdk.IResolvable;
        /**
         * Details about an Amazon Redshift database datasource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html#cfn-lookoutmetrics-anomalydetector-metricsource-redshiftsourceconfig
         */
        readonly redshiftSourceConfig?: CfnAnomalyDetector.RedshiftSourceConfigProperty | cdk.IResolvable;
        /**
         * Contains information about the configuration of the S3 bucket that contains source files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html#cfn-lookoutmetrics-anomalydetector-metricsource-s3sourceconfig
         */
        readonly s3SourceConfig?: CfnAnomalyDetector.S3SourceConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MetricSourceProperty`
 *
 * @param properties - the TypeScript properties of a `MetricSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_MetricSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appFlowConfig', CfnAnomalyDetector_AppFlowConfigPropertyValidator)(properties.appFlowConfig));
    errors.collect(cdk.propertyValidator('cloudwatchConfig', CfnAnomalyDetector_CloudwatchConfigPropertyValidator)(properties.cloudwatchConfig));
    errors.collect(cdk.propertyValidator('rdsSourceConfig', CfnAnomalyDetector_RDSSourceConfigPropertyValidator)(properties.rdsSourceConfig));
    errors.collect(cdk.propertyValidator('redshiftSourceConfig', CfnAnomalyDetector_RedshiftSourceConfigPropertyValidator)(properties.redshiftSourceConfig));
    errors.collect(cdk.propertyValidator('s3SourceConfig', CfnAnomalyDetector_S3SourceConfigPropertyValidator)(properties.s3SourceConfig));
    return errors.wrap('supplied properties not correct for "MetricSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.MetricSource` resource
 *
 * @param properties - the TypeScript properties of a `MetricSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.MetricSource` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorMetricSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_MetricSourcePropertyValidator(properties).assertSuccess();
    return {
        AppFlowConfig: cfnAnomalyDetectorAppFlowConfigPropertyToCloudFormation(properties.appFlowConfig),
        CloudwatchConfig: cfnAnomalyDetectorCloudwatchConfigPropertyToCloudFormation(properties.cloudwatchConfig),
        RDSSourceConfig: cfnAnomalyDetectorRDSSourceConfigPropertyToCloudFormation(properties.rdsSourceConfig),
        RedshiftSourceConfig: cfnAnomalyDetectorRedshiftSourceConfigPropertyToCloudFormation(properties.redshiftSourceConfig),
        S3SourceConfig: cfnAnomalyDetectorS3SourceConfigPropertyToCloudFormation(properties.s3SourceConfig),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorMetricSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.MetricSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.MetricSourceProperty>();
    ret.addPropertyResult('appFlowConfig', 'AppFlowConfig', properties.AppFlowConfig != null ? CfnAnomalyDetectorAppFlowConfigPropertyFromCloudFormation(properties.AppFlowConfig) : undefined);
    ret.addPropertyResult('cloudwatchConfig', 'CloudwatchConfig', properties.CloudwatchConfig != null ? CfnAnomalyDetectorCloudwatchConfigPropertyFromCloudFormation(properties.CloudwatchConfig) : undefined);
    ret.addPropertyResult('rdsSourceConfig', 'RDSSourceConfig', properties.RDSSourceConfig != null ? CfnAnomalyDetectorRDSSourceConfigPropertyFromCloudFormation(properties.RDSSourceConfig) : undefined);
    ret.addPropertyResult('redshiftSourceConfig', 'RedshiftSourceConfig', properties.RedshiftSourceConfig != null ? CfnAnomalyDetectorRedshiftSourceConfigPropertyFromCloudFormation(properties.RedshiftSourceConfig) : undefined);
    ret.addPropertyResult('s3SourceConfig', 'S3SourceConfig', properties.S3SourceConfig != null ? CfnAnomalyDetectorS3SourceConfigPropertyFromCloudFormation(properties.S3SourceConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Contains information about the Amazon Relational Database Service (RDS) configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html
     */
    export interface RDSSourceConfigProperty {
        /**
         * A string identifying the database instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-dbinstanceidentifier
         */
        readonly dbInstanceIdentifier: string;
        /**
         * The host name of the database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-databasehost
         */
        readonly databaseHost: string;
        /**
         * The name of the RDS database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-databasename
         */
        readonly databaseName: string;
        /**
         * The port number where the database can be accessed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-databaseport
         */
        readonly databasePort: number;
        /**
         * The Amazon Resource Name (ARN) of the role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-rolearn
         */
        readonly roleArn: string;
        /**
         * The Amazon Resource Name (ARN) of the AWS Secrets Manager role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-secretmanagerarn
         */
        readonly secretManagerArn: string;
        /**
         * The name of the table in the database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-tablename
         */
        readonly tableName: string;
        /**
         * An object containing information about the Amazon Virtual Private Cloud (VPC) configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html#cfn-lookoutmetrics-anomalydetector-rdssourceconfig-vpcconfiguration
         */
        readonly vpcConfiguration: CfnAnomalyDetector.VpcConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RDSSourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RDSSourceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_RDSSourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dbInstanceIdentifier', cdk.requiredValidator)(properties.dbInstanceIdentifier));
    errors.collect(cdk.propertyValidator('dbInstanceIdentifier', cdk.validateString)(properties.dbInstanceIdentifier));
    errors.collect(cdk.propertyValidator('databaseHost', cdk.requiredValidator)(properties.databaseHost));
    errors.collect(cdk.propertyValidator('databaseHost', cdk.validateString)(properties.databaseHost));
    errors.collect(cdk.propertyValidator('databaseName', cdk.requiredValidator)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databasePort', cdk.requiredValidator)(properties.databasePort));
    errors.collect(cdk.propertyValidator('databasePort', cdk.validateNumber)(properties.databasePort));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('secretManagerArn', cdk.requiredValidator)(properties.secretManagerArn));
    errors.collect(cdk.propertyValidator('secretManagerArn', cdk.validateString)(properties.secretManagerArn));
    errors.collect(cdk.propertyValidator('tableName', cdk.requiredValidator)(properties.tableName));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    errors.collect(cdk.propertyValidator('vpcConfiguration', cdk.requiredValidator)(properties.vpcConfiguration));
    errors.collect(cdk.propertyValidator('vpcConfiguration', CfnAnomalyDetector_VpcConfigurationPropertyValidator)(properties.vpcConfiguration));
    return errors.wrap('supplied properties not correct for "RDSSourceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.RDSSourceConfig` resource
 *
 * @param properties - the TypeScript properties of a `RDSSourceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.RDSSourceConfig` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorRDSSourceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_RDSSourceConfigPropertyValidator(properties).assertSuccess();
    return {
        DBInstanceIdentifier: cdk.stringToCloudFormation(properties.dbInstanceIdentifier),
        DatabaseHost: cdk.stringToCloudFormation(properties.databaseHost),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        DatabasePort: cdk.numberToCloudFormation(properties.databasePort),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SecretManagerArn: cdk.stringToCloudFormation(properties.secretManagerArn),
        TableName: cdk.stringToCloudFormation(properties.tableName),
        VpcConfiguration: cfnAnomalyDetectorVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorRDSSourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.RDSSourceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.RDSSourceConfigProperty>();
    ret.addPropertyResult('dbInstanceIdentifier', 'DBInstanceIdentifier', cfn_parse.FromCloudFormation.getString(properties.DBInstanceIdentifier));
    ret.addPropertyResult('databaseHost', 'DatabaseHost', cfn_parse.FromCloudFormation.getString(properties.DatabaseHost));
    ret.addPropertyResult('databaseName', 'DatabaseName', cfn_parse.FromCloudFormation.getString(properties.DatabaseName));
    ret.addPropertyResult('databasePort', 'DatabasePort', cfn_parse.FromCloudFormation.getNumber(properties.DatabasePort));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('secretManagerArn', 'SecretManagerArn', cfn_parse.FromCloudFormation.getString(properties.SecretManagerArn));
    ret.addPropertyResult('tableName', 'TableName', cfn_parse.FromCloudFormation.getString(properties.TableName));
    ret.addPropertyResult('vpcConfiguration', 'VpcConfiguration', CfnAnomalyDetectorVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Provides information about the Amazon Redshift database configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html
     */
    export interface RedshiftSourceConfigProperty {
        /**
         * A string identifying the Redshift cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-clusteridentifier
         */
        readonly clusterIdentifier: string;
        /**
         * The name of the database host.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-databasehost
         */
        readonly databaseHost: string;
        /**
         * The Redshift database name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-databasename
         */
        readonly databaseName: string;
        /**
         * The port number where the database can be accessed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-databaseport
         */
        readonly databasePort: number;
        /**
         * The Amazon Resource Name (ARN) of the role providing access to the database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-rolearn
         */
        readonly roleArn: string;
        /**
         * The Amazon Resource Name (ARN) of the AWS Secrets Manager role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-secretmanagerarn
         */
        readonly secretManagerArn: string;
        /**
         * The table name of the Redshift database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-tablename
         */
        readonly tableName: string;
        /**
         * Contains information about the Amazon Virtual Private Cloud (VPC) configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html#cfn-lookoutmetrics-anomalydetector-redshiftsourceconfig-vpcconfiguration
         */
        readonly vpcConfiguration: CfnAnomalyDetector.VpcConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RedshiftSourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RedshiftSourceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_RedshiftSourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clusterIdentifier', cdk.requiredValidator)(properties.clusterIdentifier));
    errors.collect(cdk.propertyValidator('clusterIdentifier', cdk.validateString)(properties.clusterIdentifier));
    errors.collect(cdk.propertyValidator('databaseHost', cdk.requiredValidator)(properties.databaseHost));
    errors.collect(cdk.propertyValidator('databaseHost', cdk.validateString)(properties.databaseHost));
    errors.collect(cdk.propertyValidator('databaseName', cdk.requiredValidator)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databasePort', cdk.requiredValidator)(properties.databasePort));
    errors.collect(cdk.propertyValidator('databasePort', cdk.validateNumber)(properties.databasePort));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('secretManagerArn', cdk.requiredValidator)(properties.secretManagerArn));
    errors.collect(cdk.propertyValidator('secretManagerArn', cdk.validateString)(properties.secretManagerArn));
    errors.collect(cdk.propertyValidator('tableName', cdk.requiredValidator)(properties.tableName));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    errors.collect(cdk.propertyValidator('vpcConfiguration', cdk.requiredValidator)(properties.vpcConfiguration));
    errors.collect(cdk.propertyValidator('vpcConfiguration', CfnAnomalyDetector_VpcConfigurationPropertyValidator)(properties.vpcConfiguration));
    return errors.wrap('supplied properties not correct for "RedshiftSourceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.RedshiftSourceConfig` resource
 *
 * @param properties - the TypeScript properties of a `RedshiftSourceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.RedshiftSourceConfig` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorRedshiftSourceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_RedshiftSourceConfigPropertyValidator(properties).assertSuccess();
    return {
        ClusterIdentifier: cdk.stringToCloudFormation(properties.clusterIdentifier),
        DatabaseHost: cdk.stringToCloudFormation(properties.databaseHost),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        DatabasePort: cdk.numberToCloudFormation(properties.databasePort),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SecretManagerArn: cdk.stringToCloudFormation(properties.secretManagerArn),
        TableName: cdk.stringToCloudFormation(properties.tableName),
        VpcConfiguration: cfnAnomalyDetectorVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorRedshiftSourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.RedshiftSourceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.RedshiftSourceConfigProperty>();
    ret.addPropertyResult('clusterIdentifier', 'ClusterIdentifier', cfn_parse.FromCloudFormation.getString(properties.ClusterIdentifier));
    ret.addPropertyResult('databaseHost', 'DatabaseHost', cfn_parse.FromCloudFormation.getString(properties.DatabaseHost));
    ret.addPropertyResult('databaseName', 'DatabaseName', cfn_parse.FromCloudFormation.getString(properties.DatabaseName));
    ret.addPropertyResult('databasePort', 'DatabasePort', cfn_parse.FromCloudFormation.getNumber(properties.DatabasePort));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('secretManagerArn', 'SecretManagerArn', cfn_parse.FromCloudFormation.getString(properties.SecretManagerArn));
    ret.addPropertyResult('tableName', 'TableName', cfn_parse.FromCloudFormation.getString(properties.TableName));
    ret.addPropertyResult('vpcConfiguration', 'VpcConfiguration', CfnAnomalyDetectorVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Contains information about the configuration of the S3 bucket that contains source files.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-s3sourceconfig.html
     */
    export interface S3SourceConfigProperty {
        /**
         * Contains information about a source file's formatting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-s3sourceconfig.html#cfn-lookoutmetrics-anomalydetector-s3sourceconfig-fileformatdescriptor
         */
        readonly fileFormatDescriptor: CfnAnomalyDetector.FileFormatDescriptorProperty | cdk.IResolvable;
        /**
         * A list of paths to the historical data files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-s3sourceconfig.html#cfn-lookoutmetrics-anomalydetector-s3sourceconfig-historicaldatapathlist
         */
        readonly historicalDataPathList?: string[];
        /**
         * The ARN of an IAM role that has read and write access permissions to the source S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-s3sourceconfig.html#cfn-lookoutmetrics-anomalydetector-s3sourceconfig-rolearn
         */
        readonly roleArn: string;
        /**
         * A list of templated paths to the source files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-s3sourceconfig.html#cfn-lookoutmetrics-anomalydetector-s3sourceconfig-templatedpathlist
         */
        readonly templatedPathList?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `S3SourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3SourceConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_S3SourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('fileFormatDescriptor', cdk.requiredValidator)(properties.fileFormatDescriptor));
    errors.collect(cdk.propertyValidator('fileFormatDescriptor', CfnAnomalyDetector_FileFormatDescriptorPropertyValidator)(properties.fileFormatDescriptor));
    errors.collect(cdk.propertyValidator('historicalDataPathList', cdk.listValidator(cdk.validateString))(properties.historicalDataPathList));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('templatedPathList', cdk.listValidator(cdk.validateString))(properties.templatedPathList));
    return errors.wrap('supplied properties not correct for "S3SourceConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.S3SourceConfig` resource
 *
 * @param properties - the TypeScript properties of a `S3SourceConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.S3SourceConfig` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorS3SourceConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_S3SourceConfigPropertyValidator(properties).assertSuccess();
    return {
        FileFormatDescriptor: cfnAnomalyDetectorFileFormatDescriptorPropertyToCloudFormation(properties.fileFormatDescriptor),
        HistoricalDataPathList: cdk.listMapper(cdk.stringToCloudFormation)(properties.historicalDataPathList),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        TemplatedPathList: cdk.listMapper(cdk.stringToCloudFormation)(properties.templatedPathList),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorS3SourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.S3SourceConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.S3SourceConfigProperty>();
    ret.addPropertyResult('fileFormatDescriptor', 'FileFormatDescriptor', CfnAnomalyDetectorFileFormatDescriptorPropertyFromCloudFormation(properties.FileFormatDescriptor));
    ret.addPropertyResult('historicalDataPathList', 'HistoricalDataPathList', properties.HistoricalDataPathList != null ? cfn_parse.FromCloudFormation.getStringArray(properties.HistoricalDataPathList) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('templatedPathList', 'TemplatedPathList', properties.TemplatedPathList != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TemplatedPathList) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Contains information about the column used to track time in a source data file.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-timestampcolumn.html
     */
    export interface TimestampColumnProperty {
        /**
         * The format of the timestamp column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-timestampcolumn.html#cfn-lookoutmetrics-anomalydetector-timestampcolumn-columnformat
         */
        readonly columnFormat?: string;
        /**
         * The name of the timestamp column.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-timestampcolumn.html#cfn-lookoutmetrics-anomalydetector-timestampcolumn-columnname
         */
        readonly columnName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TimestampColumnProperty`
 *
 * @param properties - the TypeScript properties of a `TimestampColumnProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_TimestampColumnPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnFormat', cdk.validateString)(properties.columnFormat));
    errors.collect(cdk.propertyValidator('columnName', cdk.validateString)(properties.columnName));
    return errors.wrap('supplied properties not correct for "TimestampColumnProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.TimestampColumn` resource
 *
 * @param properties - the TypeScript properties of a `TimestampColumnProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.TimestampColumn` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorTimestampColumnPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_TimestampColumnPropertyValidator(properties).assertSuccess();
    return {
        ColumnFormat: cdk.stringToCloudFormation(properties.columnFormat),
        ColumnName: cdk.stringToCloudFormation(properties.columnName),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorTimestampColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.TimestampColumnProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.TimestampColumnProperty>();
    ret.addPropertyResult('columnFormat', 'ColumnFormat', properties.ColumnFormat != null ? cfn_parse.FromCloudFormation.getString(properties.ColumnFormat) : undefined);
    ret.addPropertyResult('columnName', 'ColumnName', properties.ColumnName != null ? cfn_parse.FromCloudFormation.getString(properties.ColumnName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAnomalyDetector {
    /**
     * Contains configuration information about the Amazon Virtual Private Cloud (VPC).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-vpcconfiguration.html
     */
    export interface VpcConfigurationProperty {
        /**
         * An array of strings containing the list of security groups.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-vpcconfiguration.html#cfn-lookoutmetrics-anomalydetector-vpcconfiguration-securitygroupidlist
         */
        readonly securityGroupIdList: string[];
        /**
         * An array of strings containing the Amazon VPC subnet IDs (e.g., `subnet-0bb1c79de3EXAMPLE` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-vpcconfiguration.html#cfn-lookoutmetrics-anomalydetector-vpcconfiguration-subnetidlist
         */
        readonly subnetIdList: string[];
    }
}

/**
 * Determine whether the given properties match those of a `VpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAnomalyDetector_VpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('securityGroupIdList', cdk.requiredValidator)(properties.securityGroupIdList));
    errors.collect(cdk.propertyValidator('securityGroupIdList', cdk.listValidator(cdk.validateString))(properties.securityGroupIdList));
    errors.collect(cdk.propertyValidator('subnetIdList', cdk.requiredValidator)(properties.subnetIdList));
    errors.collect(cdk.propertyValidator('subnetIdList', cdk.listValidator(cdk.validateString))(properties.subnetIdList));
    return errors.wrap('supplied properties not correct for "VpcConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.VpcConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LookoutMetrics::AnomalyDetector.VpcConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAnomalyDetectorVpcConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAnomalyDetector_VpcConfigurationPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroupIdList: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIdList),
        SubnetIdList: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIdList),
    };
}

// @ts-ignore TS6133
function CfnAnomalyDetectorVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyDetector.VpcConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyDetector.VpcConfigurationProperty>();
    ret.addPropertyResult('securityGroupIdList', 'SecurityGroupIdList', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIdList));
    ret.addPropertyResult('subnetIdList', 'SubnetIdList', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIdList));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
