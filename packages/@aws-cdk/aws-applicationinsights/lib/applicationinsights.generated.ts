// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:11.674Z","fingerprint":"eOZ4uKGhqKlFDzPl4ygB09FWyu7QQU4LC3BImYowoBA="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html
 */
export interface CfnApplicationProps {

    /**
     * The name of the resource group used for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-resourcegroupname
     */
    readonly resourceGroupName: string;

    /**
     * If set to `true` , the application components will be configured with the monitoring configuration recommended by Application Insights.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-autoconfigurationenabled
     */
    readonly autoConfigurationEnabled?: boolean | cdk.IResolvable;

    /**
     * The monitoring settings of the components.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-componentmonitoringsettings
     */
    readonly componentMonitoringSettings?: Array<CfnApplication.ComponentMonitoringSettingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Describes a custom component by grouping similar standalone instances to monitor.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-customcomponents
     */
    readonly customComponents?: Array<CfnApplication.CustomComponentProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Indicates whether Application Insights can listen to CloudWatch events for the application resources, such as `instance terminated` , `failed deployment` , and others.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-cwemonitorenabled
     */
    readonly cweMonitorEnabled?: boolean | cdk.IResolvable;

    /**
     * Application Insights can create applications based on a resource group or on an account. To create an account-based application using all of the resources in the account, set this parameter to `ACCOUNT_BASED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-groupingtype
     */
    readonly groupingType?: string;

    /**
     * The log pattern sets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-logpatternsets
     */
    readonly logPatternSets?: Array<CfnApplication.LogPatternSetProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Indicates whether Application Insights will create OpsItems for any problem that is detected by Application Insights for an application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-opscenterenabled
     */
    readonly opsCenterEnabled?: boolean | cdk.IResolvable;

    /**
     * The SNS topic provided to Application Insights that is associated with the created OpsItems to receive SNS notifications for opsItem updates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-opsitemsnstopicarn
     */
    readonly opsItemSnsTopicArn?: string;

    /**
     * An array of `Tags` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-tags
     */
    readonly tags?: cdk.CfnTag[];
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
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoConfigurationEnabled', cdk.validateBoolean)(properties.autoConfigurationEnabled));
    errors.collect(cdk.propertyValidator('cweMonitorEnabled', cdk.validateBoolean)(properties.cweMonitorEnabled));
    errors.collect(cdk.propertyValidator('componentMonitoringSettings', cdk.listValidator(CfnApplication_ComponentMonitoringSettingPropertyValidator))(properties.componentMonitoringSettings));
    errors.collect(cdk.propertyValidator('customComponents', cdk.listValidator(CfnApplication_CustomComponentPropertyValidator))(properties.customComponents));
    errors.collect(cdk.propertyValidator('groupingType', cdk.validateString)(properties.groupingType));
    errors.collect(cdk.propertyValidator('logPatternSets', cdk.listValidator(CfnApplication_LogPatternSetPropertyValidator))(properties.logPatternSets));
    errors.collect(cdk.propertyValidator('opsCenterEnabled', cdk.validateBoolean)(properties.opsCenterEnabled));
    errors.collect(cdk.propertyValidator('opsItemSnsTopicArn', cdk.validateString)(properties.opsItemSnsTopicArn));
    errors.collect(cdk.propertyValidator('resourceGroupName', cdk.requiredValidator)(properties.resourceGroupName));
    errors.collect(cdk.propertyValidator('resourceGroupName', cdk.validateString)(properties.resourceGroupName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnApplicationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application` resource.
 */
// @ts-ignore TS6133
function cfnApplicationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationPropsValidator(properties).assertSuccess();
    return {
        ResourceGroupName: cdk.stringToCloudFormation(properties.resourceGroupName),
        AutoConfigurationEnabled: cdk.booleanToCloudFormation(properties.autoConfigurationEnabled),
        ComponentMonitoringSettings: cdk.listMapper(cfnApplicationComponentMonitoringSettingPropertyToCloudFormation)(properties.componentMonitoringSettings),
        CustomComponents: cdk.listMapper(cfnApplicationCustomComponentPropertyToCloudFormation)(properties.customComponents),
        CWEMonitorEnabled: cdk.booleanToCloudFormation(properties.cweMonitorEnabled),
        GroupingType: cdk.stringToCloudFormation(properties.groupingType),
        LogPatternSets: cdk.listMapper(cfnApplicationLogPatternSetPropertyToCloudFormation)(properties.logPatternSets),
        OpsCenterEnabled: cdk.booleanToCloudFormation(properties.opsCenterEnabled),
        OpsItemSNSTopicArn: cdk.stringToCloudFormation(properties.opsItemSnsTopicArn),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
    ret.addPropertyResult('resourceGroupName', 'ResourceGroupName', cfn_parse.FromCloudFormation.getString(properties.ResourceGroupName));
    ret.addPropertyResult('autoConfigurationEnabled', 'AutoConfigurationEnabled', properties.AutoConfigurationEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoConfigurationEnabled) : undefined);
    ret.addPropertyResult('componentMonitoringSettings', 'ComponentMonitoringSettings', properties.ComponentMonitoringSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationComponentMonitoringSettingPropertyFromCloudFormation)(properties.ComponentMonitoringSettings) : undefined);
    ret.addPropertyResult('customComponents', 'CustomComponents', properties.CustomComponents != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationCustomComponentPropertyFromCloudFormation)(properties.CustomComponents) : undefined);
    ret.addPropertyResult('cweMonitorEnabled', 'CWEMonitorEnabled', properties.CWEMonitorEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CWEMonitorEnabled) : undefined);
    ret.addPropertyResult('groupingType', 'GroupingType', properties.GroupingType != null ? cfn_parse.FromCloudFormation.getString(properties.GroupingType) : undefined);
    ret.addPropertyResult('logPatternSets', 'LogPatternSets', properties.LogPatternSets != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationLogPatternSetPropertyFromCloudFormation)(properties.LogPatternSets) : undefined);
    ret.addPropertyResult('opsCenterEnabled', 'OpsCenterEnabled', properties.OpsCenterEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.OpsCenterEnabled) : undefined);
    ret.addPropertyResult('opsItemSnsTopicArn', 'OpsItemSNSTopicArn', properties.OpsItemSNSTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.OpsItemSNSTopicArn) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ApplicationInsights::Application`
 *
 * The `AWS::ApplicationInsights::Application` resource adds an application that is created from a resource group.
 *
 * @cloudformationResource AWS::ApplicationInsights::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApplicationInsights::Application";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApplication(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the Amazon Resource Name (ARN) of the application, such as `arn:aws:applicationinsights:us-east-1:123456789012:application/resource-group/my_resource_group` .
     * @cloudformationAttribute ApplicationARN
     */
    public readonly attrApplicationArn: string;

    /**
     * The name of the resource group used for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-resourcegroupname
     */
    public resourceGroupName: string;

    /**
     * If set to `true` , the application components will be configured with the monitoring configuration recommended by Application Insights.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-autoconfigurationenabled
     */
    public autoConfigurationEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The monitoring settings of the components.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-componentmonitoringsettings
     */
    public componentMonitoringSettings: Array<CfnApplication.ComponentMonitoringSettingProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Describes a custom component by grouping similar standalone instances to monitor.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-customcomponents
     */
    public customComponents: Array<CfnApplication.CustomComponentProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Indicates whether Application Insights can listen to CloudWatch events for the application resources, such as `instance terminated` , `failed deployment` , and others.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-cwemonitorenabled
     */
    public cweMonitorEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * Application Insights can create applications based on a resource group or on an account. To create an account-based application using all of the resources in the account, set this parameter to `ACCOUNT_BASED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-groupingtype
     */
    public groupingType: string | undefined;

    /**
     * The log pattern sets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-logpatternsets
     */
    public logPatternSets: Array<CfnApplication.LogPatternSetProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Indicates whether Application Insights will create OpsItems for any problem that is detected by Application Insights for an application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-opscenterenabled
     */
    public opsCenterEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The SNS topic provided to Application Insights that is associated with the created OpsItems to receive SNS notifications for opsItem updates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-opsitemsnstopicarn
     */
    public opsItemSnsTopicArn: string | undefined;

    /**
     * An array of `Tags` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ApplicationInsights::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
        super(scope, id, { type: CfnApplication.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'resourceGroupName', this);
        this.attrApplicationArn = cdk.Token.asString(this.getAtt('ApplicationARN', cdk.ResolutionTypeHint.STRING));

        this.resourceGroupName = props.resourceGroupName;
        this.autoConfigurationEnabled = props.autoConfigurationEnabled;
        this.componentMonitoringSettings = props.componentMonitoringSettings;
        this.customComponents = props.customComponents;
        this.cweMonitorEnabled = props.cweMonitorEnabled;
        this.groupingType = props.groupingType;
        this.logPatternSets = props.logPatternSets;
        this.opsCenterEnabled = props.opsCenterEnabled;
        this.opsItemSnsTopicArn = props.opsItemSnsTopicArn;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ApplicationInsights::Application", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            resourceGroupName: this.resourceGroupName,
            autoConfigurationEnabled: this.autoConfigurationEnabled,
            componentMonitoringSettings: this.componentMonitoringSettings,
            customComponents: this.customComponents,
            cweMonitorEnabled: this.cweMonitorEnabled,
            groupingType: this.groupingType,
            logPatternSets: this.logPatternSets,
            opsCenterEnabled: this.opsCenterEnabled,
            opsItemSnsTopicArn: this.opsItemSnsTopicArn,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationPropsToCloudFormation(props);
    }
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application Alarm` property type defines a CloudWatch alarm to be monitored for the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-alarm.html
     */
    export interface AlarmProperty {
        /**
         * The name of the CloudWatch alarm to be monitored for the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-alarm.html#cfn-applicationinsights-application-alarm-alarmname
         */
        readonly alarmName: string;
        /**
         * Indicates the degree of outage when the alarm goes off.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-alarm.html#cfn-applicationinsights-application-alarm-severity
         */
        readonly severity?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AlarmProperty`
 *
 * @param properties - the TypeScript properties of a `AlarmProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_AlarmPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alarmName', cdk.requiredValidator)(properties.alarmName));
    errors.collect(cdk.propertyValidator('alarmName', cdk.validateString)(properties.alarmName));
    errors.collect(cdk.propertyValidator('severity', cdk.validateString)(properties.severity));
    return errors.wrap('supplied properties not correct for "AlarmProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.Alarm` resource
 *
 * @param properties - the TypeScript properties of a `AlarmProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.Alarm` resource.
 */
// @ts-ignore TS6133
function cfnApplicationAlarmPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_AlarmPropertyValidator(properties).assertSuccess();
    return {
        AlarmName: cdk.stringToCloudFormation(properties.alarmName),
        Severity: cdk.stringToCloudFormation(properties.severity),
    };
}

// @ts-ignore TS6133
function CfnApplicationAlarmPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.AlarmProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.AlarmProperty>();
    ret.addPropertyResult('alarmName', 'AlarmName', cfn_parse.FromCloudFormation.getString(properties.AlarmName));
    ret.addPropertyResult('severity', 'Severity', properties.Severity != null ? cfn_parse.FromCloudFormation.getString(properties.Severity) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application AlarmMetric` property type defines a metric to monitor for the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-alarmmetric.html
     */
    export interface AlarmMetricProperty {
        /**
         * The name of the metric to be monitored for the component. For metrics supported by Application Insights, see [Logs and metrics supported by Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-logs-and-metrics.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-alarmmetric.html#cfn-applicationinsights-application-alarmmetric-alarmmetricname
         */
        readonly alarmMetricName: string;
    }
}

/**
 * Determine whether the given properties match those of a `AlarmMetricProperty`
 *
 * @param properties - the TypeScript properties of a `AlarmMetricProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_AlarmMetricPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alarmMetricName', cdk.requiredValidator)(properties.alarmMetricName));
    errors.collect(cdk.propertyValidator('alarmMetricName', cdk.validateString)(properties.alarmMetricName));
    return errors.wrap('supplied properties not correct for "AlarmMetricProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.AlarmMetric` resource
 *
 * @param properties - the TypeScript properties of a `AlarmMetricProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.AlarmMetric` resource.
 */
// @ts-ignore TS6133
function cfnApplicationAlarmMetricPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_AlarmMetricPropertyValidator(properties).assertSuccess();
    return {
        AlarmMetricName: cdk.stringToCloudFormation(properties.alarmMetricName),
    };
}

// @ts-ignore TS6133
function CfnApplicationAlarmMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.AlarmMetricProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.AlarmMetricProperty>();
    ret.addPropertyResult('alarmMetricName', 'AlarmMetricName', cfn_parse.FromCloudFormation.getString(properties.AlarmMetricName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application ComponentConfiguration` property type defines the configuration settings of the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentconfiguration.html
     */
    export interface ComponentConfigurationProperty {
        /**
         * The configuration settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentconfiguration.html#cfn-applicationinsights-application-componentconfiguration-configurationdetails
         */
        readonly configurationDetails?: CfnApplication.ConfigurationDetailsProperty | cdk.IResolvable;
        /**
         * Sub-component configurations of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentconfiguration.html#cfn-applicationinsights-application-componentconfiguration-subcomponenttypeconfigurations
         */
        readonly subComponentTypeConfigurations?: Array<CfnApplication.SubComponentTypeConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ComponentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configurationDetails', CfnApplication_ConfigurationDetailsPropertyValidator)(properties.configurationDetails));
    errors.collect(cdk.propertyValidator('subComponentTypeConfigurations', cdk.listValidator(CfnApplication_SubComponentTypeConfigurationPropertyValidator))(properties.subComponentTypeConfigurations));
    return errors.wrap('supplied properties not correct for "ComponentConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.ComponentConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ComponentConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.ComponentConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationComponentConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ComponentConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ConfigurationDetails: cfnApplicationConfigurationDetailsPropertyToCloudFormation(properties.configurationDetails),
        SubComponentTypeConfigurations: cdk.listMapper(cfnApplicationSubComponentTypeConfigurationPropertyToCloudFormation)(properties.subComponentTypeConfigurations),
    };
}

// @ts-ignore TS6133
function CfnApplicationComponentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ComponentConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ComponentConfigurationProperty>();
    ret.addPropertyResult('configurationDetails', 'ConfigurationDetails', properties.ConfigurationDetails != null ? CfnApplicationConfigurationDetailsPropertyFromCloudFormation(properties.ConfigurationDetails) : undefined);
    ret.addPropertyResult('subComponentTypeConfigurations', 'SubComponentTypeConfigurations', properties.SubComponentTypeConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationSubComponentTypeConfigurationPropertyFromCloudFormation)(properties.SubComponentTypeConfigurations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application ComponentMonitoringSetting` property type defines the monitoring setting of the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentmonitoringsetting.html
     */
    export interface ComponentMonitoringSettingProperty {
        /**
         * The ARN of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentmonitoringsetting.html#cfn-applicationinsights-application-componentmonitoringsetting-componentarn
         */
        readonly componentArn?: string;
        /**
         * Component monitoring can be configured in one of the following three modes:
         *
         * - `DEFAULT` : The component will be configured with the recommended default monitoring settings of the selected `Tier` .
         * - `CUSTOM` : The component will be configured with the customized monitoring settings that are specified in `CustomComponentConfiguration` . If used, `CustomComponentConfiguration` must be provided.
         * - `DEFAULT_WITH_OVERWRITE` : The component will be configured with the recommended default monitoring settings of the selected `Tier` , and merged with customized overwrite settings that are specified in `DefaultOverwriteComponentConfiguration` . If used, `DefaultOverwriteComponentConfiguration` must be provided.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentmonitoringsetting.html#cfn-applicationinsights-application-componentmonitoringsetting-componentconfigurationmode
         */
        readonly componentConfigurationMode: string;
        /**
         * The name of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentmonitoringsetting.html#cfn-applicationinsights-application-componentmonitoringsetting-componentname
         */
        readonly componentName?: string;
        /**
         * Customized monitoring settings. Required if CUSTOM mode is configured in `ComponentConfigurationMode` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentmonitoringsetting.html#cfn-applicationinsights-application-componentmonitoringsetting-customcomponentconfiguration
         */
        readonly customComponentConfiguration?: CfnApplication.ComponentConfigurationProperty | cdk.IResolvable;
        /**
         * Customized overwrite monitoring settings. Required if CUSTOM mode is configured in `ComponentConfigurationMode` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentmonitoringsetting.html#cfn-applicationinsights-application-componentmonitoringsetting-defaultoverwritecomponentconfiguration
         */
        readonly defaultOverwriteComponentConfiguration?: CfnApplication.ComponentConfigurationProperty | cdk.IResolvable;
        /**
         * The tier of the application component. Supported tiers include `DOT_NET_CORE` , `DOT_NET_WORKER` , `DOT_NET_WEB` , `SQL_SERVER` , `SQL_SERVER_ALWAYSON_AVAILABILITY_GROUP` , `SQL_SERVER_FAILOVER_CLUSTER_INSTANCE` , `MYSQL` , `POSTGRESQL` , `JAVA_JMX` , `ORACLE` , `SAP_HANA_MULTI_NODE` , `SAP_HANA_SINGLE_NODE` , `SAP_HANA_HIGH_AVAILABILITY` , `SHAREPOINT` . `ACTIVE_DIRECTORY` , and `DEFAULT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentmonitoringsetting.html#cfn-applicationinsights-application-componentmonitoringsetting-tier
         */
        readonly tier: string;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentMonitoringSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentMonitoringSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ComponentMonitoringSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentArn', cdk.validateString)(properties.componentArn));
    errors.collect(cdk.propertyValidator('componentConfigurationMode', cdk.requiredValidator)(properties.componentConfigurationMode));
    errors.collect(cdk.propertyValidator('componentConfigurationMode', cdk.validateString)(properties.componentConfigurationMode));
    errors.collect(cdk.propertyValidator('componentName', cdk.validateString)(properties.componentName));
    errors.collect(cdk.propertyValidator('customComponentConfiguration', CfnApplication_ComponentConfigurationPropertyValidator)(properties.customComponentConfiguration));
    errors.collect(cdk.propertyValidator('defaultOverwriteComponentConfiguration', CfnApplication_ComponentConfigurationPropertyValidator)(properties.defaultOverwriteComponentConfiguration));
    errors.collect(cdk.propertyValidator('tier', cdk.requiredValidator)(properties.tier));
    errors.collect(cdk.propertyValidator('tier', cdk.validateString)(properties.tier));
    return errors.wrap('supplied properties not correct for "ComponentMonitoringSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.ComponentMonitoringSetting` resource
 *
 * @param properties - the TypeScript properties of a `ComponentMonitoringSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.ComponentMonitoringSetting` resource.
 */
// @ts-ignore TS6133
function cfnApplicationComponentMonitoringSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ComponentMonitoringSettingPropertyValidator(properties).assertSuccess();
    return {
        ComponentARN: cdk.stringToCloudFormation(properties.componentArn),
        ComponentConfigurationMode: cdk.stringToCloudFormation(properties.componentConfigurationMode),
        ComponentName: cdk.stringToCloudFormation(properties.componentName),
        CustomComponentConfiguration: cfnApplicationComponentConfigurationPropertyToCloudFormation(properties.customComponentConfiguration),
        DefaultOverwriteComponentConfiguration: cfnApplicationComponentConfigurationPropertyToCloudFormation(properties.defaultOverwriteComponentConfiguration),
        Tier: cdk.stringToCloudFormation(properties.tier),
    };
}

// @ts-ignore TS6133
function CfnApplicationComponentMonitoringSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ComponentMonitoringSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ComponentMonitoringSettingProperty>();
    ret.addPropertyResult('componentArn', 'ComponentARN', properties.ComponentARN != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentARN) : undefined);
    ret.addPropertyResult('componentConfigurationMode', 'ComponentConfigurationMode', cfn_parse.FromCloudFormation.getString(properties.ComponentConfigurationMode));
    ret.addPropertyResult('componentName', 'ComponentName', properties.ComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentName) : undefined);
    ret.addPropertyResult('customComponentConfiguration', 'CustomComponentConfiguration', properties.CustomComponentConfiguration != null ? CfnApplicationComponentConfigurationPropertyFromCloudFormation(properties.CustomComponentConfiguration) : undefined);
    ret.addPropertyResult('defaultOverwriteComponentConfiguration', 'DefaultOverwriteComponentConfiguration', properties.DefaultOverwriteComponentConfiguration != null ? CfnApplicationComponentConfigurationPropertyFromCloudFormation(properties.DefaultOverwriteComponentConfiguration) : undefined);
    ret.addPropertyResult('tier', 'Tier', cfn_parse.FromCloudFormation.getString(properties.Tier));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application ConfigurationDetails` property type specifies the configuration settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-configurationdetails.html
     */
    export interface ConfigurationDetailsProperty {
        /**
         * A list of metrics to monitor for the component. All component types can use `AlarmMetrics` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-configurationdetails.html#cfn-applicationinsights-application-configurationdetails-alarmmetrics
         */
        readonly alarmMetrics?: Array<CfnApplication.AlarmMetricProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A list of alarms to monitor for the component. All component types can use `Alarm` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-configurationdetails.html#cfn-applicationinsights-application-configurationdetails-alarms
         */
        readonly alarms?: Array<CfnApplication.AlarmProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The HA cluster Prometheus Exporter settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-configurationdetails.html#cfn-applicationinsights-application-configurationdetails-haclusterprometheusexporter
         */
        readonly haClusterPrometheusExporter?: CfnApplication.HAClusterPrometheusExporterProperty | cdk.IResolvable;
        /**
         * The HANA DB Prometheus Exporter settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-configurationdetails.html#cfn-applicationinsights-application-configurationdetails-hanaprometheusexporter
         */
        readonly hanaPrometheusExporter?: CfnApplication.HANAPrometheusExporterProperty | cdk.IResolvable;
        /**
         * A list of Java metrics to monitor for the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-configurationdetails.html#cfn-applicationinsights-application-configurationdetails-jmxprometheusexporter
         */
        readonly jmxPrometheusExporter?: CfnApplication.JMXPrometheusExporterProperty | cdk.IResolvable;
        /**
         * A list of logs to monitor for the component. Only Amazon EC2 instances can use `Logs` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-configurationdetails.html#cfn-applicationinsights-application-configurationdetails-logs
         */
        readonly logs?: Array<CfnApplication.LogProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A list of Windows Events to monitor for the component. Only Amazon EC2 instances running on Windows can use `WindowsEvents` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-configurationdetails.html#cfn-applicationinsights-application-configurationdetails-windowsevents
         */
        readonly windowsEvents?: Array<CfnApplication.WindowsEventProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ConfigurationDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_ConfigurationDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alarmMetrics', cdk.listValidator(CfnApplication_AlarmMetricPropertyValidator))(properties.alarmMetrics));
    errors.collect(cdk.propertyValidator('alarms', cdk.listValidator(CfnApplication_AlarmPropertyValidator))(properties.alarms));
    errors.collect(cdk.propertyValidator('haClusterPrometheusExporter', CfnApplication_HAClusterPrometheusExporterPropertyValidator)(properties.haClusterPrometheusExporter));
    errors.collect(cdk.propertyValidator('hanaPrometheusExporter', CfnApplication_HANAPrometheusExporterPropertyValidator)(properties.hanaPrometheusExporter));
    errors.collect(cdk.propertyValidator('jmxPrometheusExporter', CfnApplication_JMXPrometheusExporterPropertyValidator)(properties.jmxPrometheusExporter));
    errors.collect(cdk.propertyValidator('logs', cdk.listValidator(CfnApplication_LogPropertyValidator))(properties.logs));
    errors.collect(cdk.propertyValidator('windowsEvents', cdk.listValidator(CfnApplication_WindowsEventPropertyValidator))(properties.windowsEvents));
    return errors.wrap('supplied properties not correct for "ConfigurationDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.ConfigurationDetails` resource
 *
 * @param properties - the TypeScript properties of a `ConfigurationDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.ConfigurationDetails` resource.
 */
// @ts-ignore TS6133
function cfnApplicationConfigurationDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_ConfigurationDetailsPropertyValidator(properties).assertSuccess();
    return {
        AlarmMetrics: cdk.listMapper(cfnApplicationAlarmMetricPropertyToCloudFormation)(properties.alarmMetrics),
        Alarms: cdk.listMapper(cfnApplicationAlarmPropertyToCloudFormation)(properties.alarms),
        HAClusterPrometheusExporter: cfnApplicationHAClusterPrometheusExporterPropertyToCloudFormation(properties.haClusterPrometheusExporter),
        HANAPrometheusExporter: cfnApplicationHANAPrometheusExporterPropertyToCloudFormation(properties.hanaPrometheusExporter),
        JMXPrometheusExporter: cfnApplicationJMXPrometheusExporterPropertyToCloudFormation(properties.jmxPrometheusExporter),
        Logs: cdk.listMapper(cfnApplicationLogPropertyToCloudFormation)(properties.logs),
        WindowsEvents: cdk.listMapper(cfnApplicationWindowsEventPropertyToCloudFormation)(properties.windowsEvents),
    };
}

// @ts-ignore TS6133
function CfnApplicationConfigurationDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ConfigurationDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ConfigurationDetailsProperty>();
    ret.addPropertyResult('alarmMetrics', 'AlarmMetrics', properties.AlarmMetrics != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationAlarmMetricPropertyFromCloudFormation)(properties.AlarmMetrics) : undefined);
    ret.addPropertyResult('alarms', 'Alarms', properties.Alarms != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationAlarmPropertyFromCloudFormation)(properties.Alarms) : undefined);
    ret.addPropertyResult('haClusterPrometheusExporter', 'HAClusterPrometheusExporter', properties.HAClusterPrometheusExporter != null ? CfnApplicationHAClusterPrometheusExporterPropertyFromCloudFormation(properties.HAClusterPrometheusExporter) : undefined);
    ret.addPropertyResult('hanaPrometheusExporter', 'HANAPrometheusExporter', properties.HANAPrometheusExporter != null ? CfnApplicationHANAPrometheusExporterPropertyFromCloudFormation(properties.HANAPrometheusExporter) : undefined);
    ret.addPropertyResult('jmxPrometheusExporter', 'JMXPrometheusExporter', properties.JMXPrometheusExporter != null ? CfnApplicationJMXPrometheusExporterPropertyFromCloudFormation(properties.JMXPrometheusExporter) : undefined);
    ret.addPropertyResult('logs', 'Logs', properties.Logs != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationLogPropertyFromCloudFormation)(properties.Logs) : undefined);
    ret.addPropertyResult('windowsEvents', 'WindowsEvents', properties.WindowsEvents != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationWindowsEventPropertyFromCloudFormation)(properties.WindowsEvents) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application CustomComponent` property type describes a custom component by grouping similar standalone instances to monitor.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-customcomponent.html
     */
    export interface CustomComponentProperty {
        /**
         * The name of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-customcomponent.html#cfn-applicationinsights-application-customcomponent-componentname
         */
        readonly componentName: string;
        /**
         * The list of resource ARNs that belong to the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-customcomponent.html#cfn-applicationinsights-application-customcomponent-resourcelist
         */
        readonly resourceList: string[];
    }
}

/**
 * Determine whether the given properties match those of a `CustomComponentProperty`
 *
 * @param properties - the TypeScript properties of a `CustomComponentProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_CustomComponentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentName', cdk.requiredValidator)(properties.componentName));
    errors.collect(cdk.propertyValidator('componentName', cdk.validateString)(properties.componentName));
    errors.collect(cdk.propertyValidator('resourceList', cdk.requiredValidator)(properties.resourceList));
    errors.collect(cdk.propertyValidator('resourceList', cdk.listValidator(cdk.validateString))(properties.resourceList));
    return errors.wrap('supplied properties not correct for "CustomComponentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.CustomComponent` resource
 *
 * @param properties - the TypeScript properties of a `CustomComponentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.CustomComponent` resource.
 */
// @ts-ignore TS6133
function cfnApplicationCustomComponentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_CustomComponentPropertyValidator(properties).assertSuccess();
    return {
        ComponentName: cdk.stringToCloudFormation(properties.componentName),
        ResourceList: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceList),
    };
}

// @ts-ignore TS6133
function CfnApplicationCustomComponentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.CustomComponentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.CustomComponentProperty>();
    ret.addPropertyResult('componentName', 'ComponentName', cfn_parse.FromCloudFormation.getString(properties.ComponentName));
    ret.addPropertyResult('resourceList', 'ResourceList', cfn_parse.FromCloudFormation.getStringArray(properties.ResourceList));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application HAClusterPrometheusExporter` property type defines the HA cluster Prometheus Exporter settings. For more information, see the [component configuration](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/component-config-sections.html#component-configuration-prometheus) in the CloudWatch Application Insights documentation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-haclusterprometheusexporter.html
     */
    export interface HAClusterPrometheusExporterProperty {
        /**
         * The target port to which Prometheus sends metrics. If not specified, the default port 9668 is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-haclusterprometheusexporter.html#cfn-applicationinsights-application-haclusterprometheusexporter-prometheusport
         */
        readonly prometheusPort?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HAClusterPrometheusExporterProperty`
 *
 * @param properties - the TypeScript properties of a `HAClusterPrometheusExporterProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_HAClusterPrometheusExporterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('prometheusPort', cdk.validateString)(properties.prometheusPort));
    return errors.wrap('supplied properties not correct for "HAClusterPrometheusExporterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.HAClusterPrometheusExporter` resource
 *
 * @param properties - the TypeScript properties of a `HAClusterPrometheusExporterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.HAClusterPrometheusExporter` resource.
 */
// @ts-ignore TS6133
function cfnApplicationHAClusterPrometheusExporterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_HAClusterPrometheusExporterPropertyValidator(properties).assertSuccess();
    return {
        PrometheusPort: cdk.stringToCloudFormation(properties.prometheusPort),
    };
}

// @ts-ignore TS6133
function CfnApplicationHAClusterPrometheusExporterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.HAClusterPrometheusExporterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.HAClusterPrometheusExporterProperty>();
    ret.addPropertyResult('prometheusPort', 'PrometheusPort', properties.PrometheusPort != null ? cfn_parse.FromCloudFormation.getString(properties.PrometheusPort) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application HANAPrometheusExporter` property type defines the HANA DB Prometheus Exporter settings. For more information, see the [component configuration](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/component-config-sections.html#component-configuration-prometheus) in the CloudWatch Application Insights documentation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-hanaprometheusexporter.html
     */
    export interface HANAPrometheusExporterProperty {
        /**
         * Designates whether you agree to install the HANA DB client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-hanaprometheusexporter.html#cfn-applicationinsights-application-hanaprometheusexporter-agreetoinstallhanadbclient
         */
        readonly agreeToInstallHanadbClient: boolean | cdk.IResolvable;
        /**
         * The HANA database port by which the exporter will query HANA metrics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-hanaprometheusexporter.html#cfn-applicationinsights-application-hanaprometheusexporter-hanaport
         */
        readonly hanaPort: string;
        /**
         * The three-character SAP system ID (SID) of the SAP HANA system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-hanaprometheusexporter.html#cfn-applicationinsights-application-hanaprometheusexporter-hanasid
         */
        readonly hanasid: string;
        /**
         * The AWS Secrets Manager secret that stores HANA monitoring user credentials. The HANA Prometheus exporter uses these credentials to connect to the database and query HANA metrics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-hanaprometheusexporter.html#cfn-applicationinsights-application-hanaprometheusexporter-hanasecretname
         */
        readonly hanaSecretName: string;
        /**
         * The target port to which Prometheus sends metrics. If not specified, the default port 9668 is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-hanaprometheusexporter.html#cfn-applicationinsights-application-hanaprometheusexporter-prometheusport
         */
        readonly prometheusPort?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HANAPrometheusExporterProperty`
 *
 * @param properties - the TypeScript properties of a `HANAPrometheusExporterProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_HANAPrometheusExporterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('agreeToInstallHanadbClient', cdk.requiredValidator)(properties.agreeToInstallHanadbClient));
    errors.collect(cdk.propertyValidator('agreeToInstallHanadbClient', cdk.validateBoolean)(properties.agreeToInstallHanadbClient));
    errors.collect(cdk.propertyValidator('hanaPort', cdk.requiredValidator)(properties.hanaPort));
    errors.collect(cdk.propertyValidator('hanaPort', cdk.validateString)(properties.hanaPort));
    errors.collect(cdk.propertyValidator('hanasid', cdk.requiredValidator)(properties.hanasid));
    errors.collect(cdk.propertyValidator('hanasid', cdk.validateString)(properties.hanasid));
    errors.collect(cdk.propertyValidator('hanaSecretName', cdk.requiredValidator)(properties.hanaSecretName));
    errors.collect(cdk.propertyValidator('hanaSecretName', cdk.validateString)(properties.hanaSecretName));
    errors.collect(cdk.propertyValidator('prometheusPort', cdk.validateString)(properties.prometheusPort));
    return errors.wrap('supplied properties not correct for "HANAPrometheusExporterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.HANAPrometheusExporter` resource
 *
 * @param properties - the TypeScript properties of a `HANAPrometheusExporterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.HANAPrometheusExporter` resource.
 */
// @ts-ignore TS6133
function cfnApplicationHANAPrometheusExporterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_HANAPrometheusExporterPropertyValidator(properties).assertSuccess();
    return {
        AgreeToInstallHANADBClient: cdk.booleanToCloudFormation(properties.agreeToInstallHanadbClient),
        HANAPort: cdk.stringToCloudFormation(properties.hanaPort),
        HANASID: cdk.stringToCloudFormation(properties.hanasid),
        HANASecretName: cdk.stringToCloudFormation(properties.hanaSecretName),
        PrometheusPort: cdk.stringToCloudFormation(properties.prometheusPort),
    };
}

// @ts-ignore TS6133
function CfnApplicationHANAPrometheusExporterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.HANAPrometheusExporterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.HANAPrometheusExporterProperty>();
    ret.addPropertyResult('agreeToInstallHanadbClient', 'AgreeToInstallHANADBClient', cfn_parse.FromCloudFormation.getBoolean(properties.AgreeToInstallHANADBClient));
    ret.addPropertyResult('hanaPort', 'HANAPort', cfn_parse.FromCloudFormation.getString(properties.HANAPort));
    ret.addPropertyResult('hanasid', 'HANASID', cfn_parse.FromCloudFormation.getString(properties.HANASID));
    ret.addPropertyResult('hanaSecretName', 'HANASecretName', cfn_parse.FromCloudFormation.getString(properties.HANASecretName));
    ret.addPropertyResult('prometheusPort', 'PrometheusPort', properties.PrometheusPort != null ? cfn_parse.FromCloudFormation.getString(properties.PrometheusPort) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application JMXPrometheusExporter` property type defines the JMXPrometheus Exporter configuration. For more information, see the [component configuration](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/component-config-sections.html#component-configuration-prometheus) in the CloudWatch Application Insights documentation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-jmxprometheusexporter.html
     */
    export interface JMXPrometheusExporterProperty {
        /**
         * The host and port to connect to through remote JMX. Only one of `jmxURL` and `hostPort` can be specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-jmxprometheusexporter.html#cfn-applicationinsights-application-jmxprometheusexporter-hostport
         */
        readonly hostPort?: string;
        /**
         * The complete JMX URL to connect to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-jmxprometheusexporter.html#cfn-applicationinsights-application-jmxprometheusexporter-jmxurl
         */
        readonly jmxurl?: string;
        /**
         * The target port to send Prometheus metrics to. If not specified, the default port `9404` is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-jmxprometheusexporter.html#cfn-applicationinsights-application-jmxprometheusexporter-prometheusport
         */
        readonly prometheusPort?: string;
    }
}

/**
 * Determine whether the given properties match those of a `JMXPrometheusExporterProperty`
 *
 * @param properties - the TypeScript properties of a `JMXPrometheusExporterProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_JMXPrometheusExporterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hostPort', cdk.validateString)(properties.hostPort));
    errors.collect(cdk.propertyValidator('jmxurl', cdk.validateString)(properties.jmxurl));
    errors.collect(cdk.propertyValidator('prometheusPort', cdk.validateString)(properties.prometheusPort));
    return errors.wrap('supplied properties not correct for "JMXPrometheusExporterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.JMXPrometheusExporter` resource
 *
 * @param properties - the TypeScript properties of a `JMXPrometheusExporterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.JMXPrometheusExporter` resource.
 */
// @ts-ignore TS6133
function cfnApplicationJMXPrometheusExporterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_JMXPrometheusExporterPropertyValidator(properties).assertSuccess();
    return {
        HostPort: cdk.stringToCloudFormation(properties.hostPort),
        JMXURL: cdk.stringToCloudFormation(properties.jmxurl),
        PrometheusPort: cdk.stringToCloudFormation(properties.prometheusPort),
    };
}

// @ts-ignore TS6133
function CfnApplicationJMXPrometheusExporterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.JMXPrometheusExporterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.JMXPrometheusExporterProperty>();
    ret.addPropertyResult('hostPort', 'HostPort', properties.HostPort != null ? cfn_parse.FromCloudFormation.getString(properties.HostPort) : undefined);
    ret.addPropertyResult('jmxurl', 'JMXURL', properties.JMXURL != null ? cfn_parse.FromCloudFormation.getString(properties.JMXURL) : undefined);
    ret.addPropertyResult('prometheusPort', 'PrometheusPort', properties.PrometheusPort != null ? cfn_parse.FromCloudFormation.getString(properties.PrometheusPort) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application Log` property type specifies a log to monitor for the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-log.html
     */
    export interface LogProperty {
        /**
         * The type of encoding of the logs to be monitored. The specified encoding should be included in the list of CloudWatch agent supported encodings. If not provided, CloudWatch Application Insights uses the default encoding type for the log type:
         *
         * - `APPLICATION/DEFAULT` : utf-8 encoding
         * - `SQL_SERVER` : utf-16 encoding
         * - `IIS` : ascii encoding
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-log.html#cfn-applicationinsights-application-log-encoding
         */
        readonly encoding?: string;
        /**
         * The CloudWatch log group name to be associated with the monitored log.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-log.html#cfn-applicationinsights-application-log-loggroupname
         */
        readonly logGroupName?: string;
        /**
         * The path of the logs to be monitored. The log path must be an absolute Windows or Linux system file path. For more information, see [CloudWatch Agent Configuration File: Logs Section](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-log.html#cfn-applicationinsights-application-log-logpath
         */
        readonly logPath?: string;
        /**
         * The log type decides the log patterns against which Application Insights analyzes the log. The log type is selected from the following: `SQL_SERVER` , `MYSQL` , `MYSQL_SLOW_QUERY` , `POSTGRESQL` , `ORACLE_ALERT` , `ORACLE_LISTENER` , `IIS` , `APPLICATION` , `WINDOWS_EVENTS` , `WINDOWS_EVENTS_ACTIVE_DIRECTORY` , `WINDOWS_EVENTS_DNS` , `WINDOWS_EVENTS_IIS` , `WINDOWS_EVENTS_SHAREPOINT` , `SQL_SERVER_ALWAYSON_AVAILABILITY_GROUP` , `SQL_SERVER_FAILOVER_CLUSTER_INSTANCE` , `STEP_FUNCTION` , `API_GATEWAY_ACCESS` , `API_GATEWAY_EXECUTION` , `SAP_HANA_LOGS` , `SAP_HANA_TRACE` , `SAP_HANA_HIGH_AVAILABILITY` , and `DEFAULT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-log.html#cfn-applicationinsights-application-log-logtype
         */
        readonly logType: string;
        /**
         * The log pattern set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-log.html#cfn-applicationinsights-application-log-patternset
         */
        readonly patternSet?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LogProperty`
 *
 * @param properties - the TypeScript properties of a `LogProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_LogPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encoding', cdk.validateString)(properties.encoding));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logPath', cdk.validateString)(properties.logPath));
    errors.collect(cdk.propertyValidator('logType', cdk.requiredValidator)(properties.logType));
    errors.collect(cdk.propertyValidator('logType', cdk.validateString)(properties.logType));
    errors.collect(cdk.propertyValidator('patternSet', cdk.validateString)(properties.patternSet));
    return errors.wrap('supplied properties not correct for "LogProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.Log` resource
 *
 * @param properties - the TypeScript properties of a `LogProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.Log` resource.
 */
// @ts-ignore TS6133
function cfnApplicationLogPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_LogPropertyValidator(properties).assertSuccess();
    return {
        Encoding: cdk.stringToCloudFormation(properties.encoding),
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
        LogPath: cdk.stringToCloudFormation(properties.logPath),
        LogType: cdk.stringToCloudFormation(properties.logType),
        PatternSet: cdk.stringToCloudFormation(properties.patternSet),
    };
}

// @ts-ignore TS6133
function CfnApplicationLogPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.LogProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.LogProperty>();
    ret.addPropertyResult('encoding', 'Encoding', properties.Encoding != null ? cfn_parse.FromCloudFormation.getString(properties.Encoding) : undefined);
    ret.addPropertyResult('logGroupName', 'LogGroupName', properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined);
    ret.addPropertyResult('logPath', 'LogPath', properties.LogPath != null ? cfn_parse.FromCloudFormation.getString(properties.LogPath) : undefined);
    ret.addPropertyResult('logType', 'LogType', cfn_parse.FromCloudFormation.getString(properties.LogType));
    ret.addPropertyResult('patternSet', 'PatternSet', properties.PatternSet != null ? cfn_parse.FromCloudFormation.getString(properties.PatternSet) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application LogPattern` property type specifies an object that defines the log patterns that belong to a `LogPatternSet` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-logpattern.html
     */
    export interface LogPatternProperty {
        /**
         * A regular expression that defines the log pattern. A log pattern can contain up to 50 characters, and it cannot be empty.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-logpattern.html#cfn-applicationinsights-application-logpattern-pattern
         */
        readonly pattern: string;
        /**
         * The name of the log pattern. A log pattern name can contain up to 50 characters, and it cannot be empty. The characters can be Unicode letters, digits, or one of the following symbols: period, dash, underscore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-logpattern.html#cfn-applicationinsights-application-logpattern-patternname
         */
        readonly patternName: string;
        /**
         * The rank of the log pattern.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-logpattern.html#cfn-applicationinsights-application-logpattern-rank
         */
        readonly rank: number;
    }
}

/**
 * Determine whether the given properties match those of a `LogPatternProperty`
 *
 * @param properties - the TypeScript properties of a `LogPatternProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_LogPatternPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pattern', cdk.requiredValidator)(properties.pattern));
    errors.collect(cdk.propertyValidator('pattern', cdk.validateString)(properties.pattern));
    errors.collect(cdk.propertyValidator('patternName', cdk.requiredValidator)(properties.patternName));
    errors.collect(cdk.propertyValidator('patternName', cdk.validateString)(properties.patternName));
    errors.collect(cdk.propertyValidator('rank', cdk.requiredValidator)(properties.rank));
    errors.collect(cdk.propertyValidator('rank', cdk.validateNumber)(properties.rank));
    return errors.wrap('supplied properties not correct for "LogPatternProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.LogPattern` resource
 *
 * @param properties - the TypeScript properties of a `LogPatternProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.LogPattern` resource.
 */
// @ts-ignore TS6133
function cfnApplicationLogPatternPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_LogPatternPropertyValidator(properties).assertSuccess();
    return {
        Pattern: cdk.stringToCloudFormation(properties.pattern),
        PatternName: cdk.stringToCloudFormation(properties.patternName),
        Rank: cdk.numberToCloudFormation(properties.rank),
    };
}

// @ts-ignore TS6133
function CfnApplicationLogPatternPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.LogPatternProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.LogPatternProperty>();
    ret.addPropertyResult('pattern', 'Pattern', cfn_parse.FromCloudFormation.getString(properties.Pattern));
    ret.addPropertyResult('patternName', 'PatternName', cfn_parse.FromCloudFormation.getString(properties.PatternName));
    ret.addPropertyResult('rank', 'Rank', cfn_parse.FromCloudFormation.getNumber(properties.Rank));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application LogPatternSet` property type specifies the log pattern set.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-logpatternset.html
     */
    export interface LogPatternSetProperty {
        /**
         * A list of objects that define the log patterns that belong to `LogPatternSet` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-logpatternset.html#cfn-applicationinsights-application-logpatternset-logpatterns
         */
        readonly logPatterns: Array<CfnApplication.LogPatternProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the log pattern. A log pattern name can contain up to 30 characters, and it cannot be empty. The characters can be Unicode letters, digits, or one of the following symbols: period, dash, underscore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-logpatternset.html#cfn-applicationinsights-application-logpatternset-patternsetname
         */
        readonly patternSetName: string;
    }
}

/**
 * Determine whether the given properties match those of a `LogPatternSetProperty`
 *
 * @param properties - the TypeScript properties of a `LogPatternSetProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_LogPatternSetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logPatterns', cdk.requiredValidator)(properties.logPatterns));
    errors.collect(cdk.propertyValidator('logPatterns', cdk.listValidator(CfnApplication_LogPatternPropertyValidator))(properties.logPatterns));
    errors.collect(cdk.propertyValidator('patternSetName', cdk.requiredValidator)(properties.patternSetName));
    errors.collect(cdk.propertyValidator('patternSetName', cdk.validateString)(properties.patternSetName));
    return errors.wrap('supplied properties not correct for "LogPatternSetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.LogPatternSet` resource
 *
 * @param properties - the TypeScript properties of a `LogPatternSetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.LogPatternSet` resource.
 */
// @ts-ignore TS6133
function cfnApplicationLogPatternSetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_LogPatternSetPropertyValidator(properties).assertSuccess();
    return {
        LogPatterns: cdk.listMapper(cfnApplicationLogPatternPropertyToCloudFormation)(properties.logPatterns),
        PatternSetName: cdk.stringToCloudFormation(properties.patternSetName),
    };
}

// @ts-ignore TS6133
function CfnApplicationLogPatternSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.LogPatternSetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.LogPatternSetProperty>();
    ret.addPropertyResult('logPatterns', 'LogPatterns', cfn_parse.FromCloudFormation.getArray(CfnApplicationLogPatternPropertyFromCloudFormation)(properties.LogPatterns));
    ret.addPropertyResult('patternSetName', 'PatternSetName', cfn_parse.FromCloudFormation.getString(properties.PatternSetName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application SubComponentConfigurationDetails` property type specifies the configuration settings of the sub-components.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-subcomponentconfigurationdetails.html
     */
    export interface SubComponentConfigurationDetailsProperty {
        /**
         * A list of metrics to monitor for the component. All component types can use `AlarmMetrics` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-subcomponentconfigurationdetails.html#cfn-applicationinsights-application-subcomponentconfigurationdetails-alarmmetrics
         */
        readonly alarmMetrics?: Array<CfnApplication.AlarmMetricProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A list of logs to monitor for the component. Only Amazon EC2 instances can use `Logs` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-subcomponentconfigurationdetails.html#cfn-applicationinsights-application-subcomponentconfigurationdetails-logs
         */
        readonly logs?: Array<CfnApplication.LogProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A list of Windows Events to monitor for the component. Only Amazon EC2 instances running on Windows can use `WindowsEvents` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-subcomponentconfigurationdetails.html#cfn-applicationinsights-application-subcomponentconfigurationdetails-windowsevents
         */
        readonly windowsEvents?: Array<CfnApplication.WindowsEventProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SubComponentConfigurationDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `SubComponentConfigurationDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_SubComponentConfigurationDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alarmMetrics', cdk.listValidator(CfnApplication_AlarmMetricPropertyValidator))(properties.alarmMetrics));
    errors.collect(cdk.propertyValidator('logs', cdk.listValidator(CfnApplication_LogPropertyValidator))(properties.logs));
    errors.collect(cdk.propertyValidator('windowsEvents', cdk.listValidator(CfnApplication_WindowsEventPropertyValidator))(properties.windowsEvents));
    return errors.wrap('supplied properties not correct for "SubComponentConfigurationDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.SubComponentConfigurationDetails` resource
 *
 * @param properties - the TypeScript properties of a `SubComponentConfigurationDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.SubComponentConfigurationDetails` resource.
 */
// @ts-ignore TS6133
function cfnApplicationSubComponentConfigurationDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_SubComponentConfigurationDetailsPropertyValidator(properties).assertSuccess();
    return {
        AlarmMetrics: cdk.listMapper(cfnApplicationAlarmMetricPropertyToCloudFormation)(properties.alarmMetrics),
        Logs: cdk.listMapper(cfnApplicationLogPropertyToCloudFormation)(properties.logs),
        WindowsEvents: cdk.listMapper(cfnApplicationWindowsEventPropertyToCloudFormation)(properties.windowsEvents),
    };
}

// @ts-ignore TS6133
function CfnApplicationSubComponentConfigurationDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.SubComponentConfigurationDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.SubComponentConfigurationDetailsProperty>();
    ret.addPropertyResult('alarmMetrics', 'AlarmMetrics', properties.AlarmMetrics != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationAlarmMetricPropertyFromCloudFormation)(properties.AlarmMetrics) : undefined);
    ret.addPropertyResult('logs', 'Logs', properties.Logs != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationLogPropertyFromCloudFormation)(properties.Logs) : undefined);
    ret.addPropertyResult('windowsEvents', 'WindowsEvents', properties.WindowsEvents != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationWindowsEventPropertyFromCloudFormation)(properties.WindowsEvents) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application SubComponentTypeConfiguration` property type specifies the sub-component configurations for a component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-subcomponenttypeconfiguration.html
     */
    export interface SubComponentTypeConfigurationProperty {
        /**
         * The configuration settings of the sub-components.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-subcomponenttypeconfiguration.html#cfn-applicationinsights-application-subcomponenttypeconfiguration-subcomponentconfigurationdetails
         */
        readonly subComponentConfigurationDetails: CfnApplication.SubComponentConfigurationDetailsProperty | cdk.IResolvable;
        /**
         * The sub-component type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-subcomponenttypeconfiguration.html#cfn-applicationinsights-application-subcomponenttypeconfiguration-subcomponenttype
         */
        readonly subComponentType: string;
    }
}

/**
 * Determine whether the given properties match those of a `SubComponentTypeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SubComponentTypeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_SubComponentTypeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('subComponentConfigurationDetails', cdk.requiredValidator)(properties.subComponentConfigurationDetails));
    errors.collect(cdk.propertyValidator('subComponentConfigurationDetails', CfnApplication_SubComponentConfigurationDetailsPropertyValidator)(properties.subComponentConfigurationDetails));
    errors.collect(cdk.propertyValidator('subComponentType', cdk.requiredValidator)(properties.subComponentType));
    errors.collect(cdk.propertyValidator('subComponentType', cdk.validateString)(properties.subComponentType));
    return errors.wrap('supplied properties not correct for "SubComponentTypeConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.SubComponentTypeConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SubComponentTypeConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.SubComponentTypeConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnApplicationSubComponentTypeConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_SubComponentTypeConfigurationPropertyValidator(properties).assertSuccess();
    return {
        SubComponentConfigurationDetails: cfnApplicationSubComponentConfigurationDetailsPropertyToCloudFormation(properties.subComponentConfigurationDetails),
        SubComponentType: cdk.stringToCloudFormation(properties.subComponentType),
    };
}

// @ts-ignore TS6133
function CfnApplicationSubComponentTypeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.SubComponentTypeConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.SubComponentTypeConfigurationProperty>();
    ret.addPropertyResult('subComponentConfigurationDetails', 'SubComponentConfigurationDetails', CfnApplicationSubComponentConfigurationDetailsPropertyFromCloudFormation(properties.SubComponentConfigurationDetails));
    ret.addPropertyResult('subComponentType', 'SubComponentType', cfn_parse.FromCloudFormation.getString(properties.SubComponentType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application WindowsEvent` property type specifies a Windows Event to monitor for the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-windowsevent.html
     */
    export interface WindowsEventProperty {
        /**
         * The levels of event to log. You must specify each level to log. Possible values include `INFORMATION` , `WARNING` , `ERROR` , `CRITICAL` , and `VERBOSE` . This field is required for each type of Windows Event to log.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-windowsevent.html#cfn-applicationinsights-application-windowsevent-eventlevels
         */
        readonly eventLevels: string[];
        /**
         * The type of Windows Events to log, equivalent to the Windows Event log channel name. For example, System, Security, CustomEventName, and so on. This field is required for each type of Windows event to log.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-windowsevent.html#cfn-applicationinsights-application-windowsevent-eventname
         */
        readonly eventName: string;
        /**
         * The CloudWatch log group name to be associated with the monitored log.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-windowsevent.html#cfn-applicationinsights-application-windowsevent-loggroupname
         */
        readonly logGroupName: string;
        /**
         * The log pattern set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-windowsevent.html#cfn-applicationinsights-application-windowsevent-patternset
         */
        readonly patternSet?: string;
    }
}

/**
 * Determine whether the given properties match those of a `WindowsEventProperty`
 *
 * @param properties - the TypeScript properties of a `WindowsEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplication_WindowsEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventLevels', cdk.requiredValidator)(properties.eventLevels));
    errors.collect(cdk.propertyValidator('eventLevels', cdk.listValidator(cdk.validateString))(properties.eventLevels));
    errors.collect(cdk.propertyValidator('eventName', cdk.requiredValidator)(properties.eventName));
    errors.collect(cdk.propertyValidator('eventName', cdk.validateString)(properties.eventName));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.requiredValidator)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('logGroupName', cdk.validateString)(properties.logGroupName));
    errors.collect(cdk.propertyValidator('patternSet', cdk.validateString)(properties.patternSet));
    return errors.wrap('supplied properties not correct for "WindowsEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.WindowsEvent` resource
 *
 * @param properties - the TypeScript properties of a `WindowsEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApplicationInsights::Application.WindowsEvent` resource.
 */
// @ts-ignore TS6133
function cfnApplicationWindowsEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplication_WindowsEventPropertyValidator(properties).assertSuccess();
    return {
        EventLevels: cdk.listMapper(cdk.stringToCloudFormation)(properties.eventLevels),
        EventName: cdk.stringToCloudFormation(properties.eventName),
        LogGroupName: cdk.stringToCloudFormation(properties.logGroupName),
        PatternSet: cdk.stringToCloudFormation(properties.patternSet),
    };
}

// @ts-ignore TS6133
function CfnApplicationWindowsEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.WindowsEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.WindowsEventProperty>();
    ret.addPropertyResult('eventLevels', 'EventLevels', cfn_parse.FromCloudFormation.getStringArray(properties.EventLevels));
    ret.addPropertyResult('eventName', 'EventName', cfn_parse.FromCloudFormation.getString(properties.EventName));
    ret.addPropertyResult('logGroupName', 'LogGroupName', cfn_parse.FromCloudFormation.getString(properties.LogGroupName));
    ret.addPropertyResult('patternSet', 'PatternSet', properties.PatternSet != null ? cfn_parse.FromCloudFormation.getString(properties.PatternSet) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
