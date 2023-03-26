// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:07.010Z","fingerprint":"Z+8oAYjd7TPceF0xvt5QrOjwZSdMNbOgLALiZIoYjZ8="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAppMonitor`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html
 */
export interface CfnAppMonitorProps {

    /**
     * The top-level internet domain name for which your application has administrative authority. This parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-domain
     */
    readonly domain: string;

    /**
     * A name for the app monitor. This parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-name
     */
    readonly name: string;

    /**
     * A structure that contains much of the configuration data for the app monitor. If you are using Amazon Cognito for authorization, you must include this structure in your request, and it must include the ID of the Amazon Cognito identity pool to use for authorization. If you don't include `AppMonitorConfiguration` , you must set up your own authorization method. For more information, see [Authorize your application to send data to AWS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-get-started-authorization.html) .
     *
     * If you omit this argument, the sample rate used for CloudWatch RUM is set to 10% of the user sessions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-appmonitorconfiguration
     */
    readonly appMonitorConfiguration?: CfnAppMonitor.AppMonitorConfigurationProperty | cdk.IResolvable;

    /**
     * Data collected by CloudWatch RUM is kept by RUM for 30 days and then deleted. This parameter specifies whether CloudWatch RUM sends a copy of this telemetry data to Amazon CloudWatch Logs in your account. This enables you to keep the telemetry data for more than 30 days, but it does incur Amazon CloudWatch Logs charges.
     *
     * If you omit this parameter, the default is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-cwlogenabled
     */
    readonly cwLogEnabled?: boolean | cdk.IResolvable;

    /**
     * Assigns one or more tags (key-value pairs) to the app monitor.
     *
     * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
     *
     * Tags don't have any semantic meaning to AWS and are interpreted strictly as strings of characters.
     *
     * You can associate as many as 50 tags with an app monitor.
     *
     * For more information, see [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnAppMonitorProps`
 *
 * @param properties - the TypeScript properties of a `CfnAppMonitorProps`
 *
 * @returns the result of the validation.
 */
function CfnAppMonitorPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appMonitorConfiguration', CfnAppMonitor_AppMonitorConfigurationPropertyValidator)(properties.appMonitorConfiguration));
    errors.collect(cdk.propertyValidator('cwLogEnabled', cdk.validateBoolean)(properties.cwLogEnabled));
    errors.collect(cdk.propertyValidator('domain', cdk.requiredValidator)(properties.domain));
    errors.collect(cdk.propertyValidator('domain', cdk.validateString)(properties.domain));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnAppMonitorProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RUM::AppMonitor` resource
 *
 * @param properties - the TypeScript properties of a `CfnAppMonitorProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RUM::AppMonitor` resource.
 */
// @ts-ignore TS6133
function cfnAppMonitorPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAppMonitorPropsValidator(properties).assertSuccess();
    return {
        Domain: cdk.stringToCloudFormation(properties.domain),
        Name: cdk.stringToCloudFormation(properties.name),
        AppMonitorConfiguration: cfnAppMonitorAppMonitorConfigurationPropertyToCloudFormation(properties.appMonitorConfiguration),
        CwLogEnabled: cdk.booleanToCloudFormation(properties.cwLogEnabled),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAppMonitorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppMonitorProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppMonitorProps>();
    ret.addPropertyResult('domain', 'Domain', cfn_parse.FromCloudFormation.getString(properties.Domain));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('appMonitorConfiguration', 'AppMonitorConfiguration', properties.AppMonitorConfiguration != null ? CfnAppMonitorAppMonitorConfigurationPropertyFromCloudFormation(properties.AppMonitorConfiguration) : undefined);
    ret.addPropertyResult('cwLogEnabled', 'CwLogEnabled', properties.CwLogEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CwLogEnabled) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RUM::AppMonitor`
 *
 * Creates a CloudWatch RUM app monitor, which you can use to collect telemetry data from your application and send it to CloudWatch RUM. The data includes performance and reliability information such as page load time, client-side errors, and user behavior.
 *
 * After you create an app monitor, sign in to the CloudWatch RUM console to get the JavaScript code snippet to add to your web application. For more information, see [How do I find a code snippet that I've already generated?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-find-code-snippet.html)
 *
 * @cloudformationResource AWS::RUM::AppMonitor
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html
 */
export class CfnAppMonitor extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RUM::AppMonitor";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAppMonitor {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAppMonitorPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAppMonitor(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The top-level internet domain name for which your application has administrative authority. This parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-domain
     */
    public domain: string;

    /**
     * A name for the app monitor. This parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-name
     */
    public name: string;

    /**
     * A structure that contains much of the configuration data for the app monitor. If you are using Amazon Cognito for authorization, you must include this structure in your request, and it must include the ID of the Amazon Cognito identity pool to use for authorization. If you don't include `AppMonitorConfiguration` , you must set up your own authorization method. For more information, see [Authorize your application to send data to AWS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-get-started-authorization.html) .
     *
     * If you omit this argument, the sample rate used for CloudWatch RUM is set to 10% of the user sessions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-appmonitorconfiguration
     */
    public appMonitorConfiguration: CfnAppMonitor.AppMonitorConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Data collected by CloudWatch RUM is kept by RUM for 30 days and then deleted. This parameter specifies whether CloudWatch RUM sends a copy of this telemetry data to Amazon CloudWatch Logs in your account. This enables you to keep the telemetry data for more than 30 days, but it does incur Amazon CloudWatch Logs charges.
     *
     * If you omit this parameter, the default is `false` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-cwlogenabled
     */
    public cwLogEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * Assigns one or more tags (key-value pairs) to the app monitor.
     *
     * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
     *
     * Tags don't have any semantic meaning to AWS and are interpreted strictly as strings of characters.
     *
     * You can associate as many as 50 tags with an app monitor.
     *
     * For more information, see [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::RUM::AppMonitor`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAppMonitorProps) {
        super(scope, id, { type: CfnAppMonitor.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'domain', this);
        cdk.requireProperty(props, 'name', this);

        this.domain = props.domain;
        this.name = props.name;
        this.appMonitorConfiguration = props.appMonitorConfiguration;
        this.cwLogEnabled = props.cwLogEnabled;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RUM::AppMonitor", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAppMonitor.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            domain: this.domain,
            name: this.name,
            appMonitorConfiguration: this.appMonitorConfiguration,
            cwLogEnabled: this.cwLogEnabled,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAppMonitorPropsToCloudFormation(props);
    }
}

export namespace CfnAppMonitor {
    /**
     * This structure contains much of the configuration data for the app monitor.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html
     */
    export interface AppMonitorConfigurationProperty {
        /**
         * If you set this to `true` , the CloudWatch RUM web client sets two cookies, a session cookie and a user cookie. The cookies allow the CloudWatch RUM web client to collect data relating to the number of users an application has and the behavior of the application across a sequence of events. Cookies are stored in the top-level domain of the current page.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-allowcookies
         */
        readonly allowCookies?: boolean | cdk.IResolvable;
        /**
         * If you set this to `true` , CloudWatch RUM sends client-side traces to X-Ray for each sampled session. You can then see traces and segments from these user sessions in the RUM dashboard and the CloudWatch ServiceLens console. For more information, see [What is AWS X-Ray ?](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-enablexray
         */
        readonly enableXRay?: boolean | cdk.IResolvable;
        /**
         * A list of URLs in your website or application to exclude from RUM data collection.
         *
         * You can't include both `ExcludedPages` and `IncludedPages` in the same app monitor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-excludedpages
         */
        readonly excludedPages?: string[];
        /**
         * A list of pages in your application that are to be displayed with a "favorite" icon in the CloudWatch RUM console.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-favoritepages
         */
        readonly favoritePages?: string[];
        /**
         * The ARN of the guest IAM role that is attached to the Amazon Cognito identity pool that is used to authorize the sending of data to CloudWatch RUM.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-guestrolearn
         */
        readonly guestRoleArn?: string;
        /**
         * The ID of the Amazon Cognito identity pool that is used to authorize the sending of data to CloudWatch RUM.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-identitypoolid
         */
        readonly identityPoolId?: string;
        /**
         * If this app monitor is to collect data from only certain pages in your application, this structure lists those pages.
         *
         * You can't include both `ExcludedPages` and `IncludedPages` in the same app monitor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-includedpages
         */
        readonly includedPages?: string[];
        /**
         * An array of structures that each define a destination that this app monitor will send extended metrics to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-metricdestinations
         */
        readonly metricDestinations?: Array<CfnAppMonitor.MetricDestinationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies the portion of user sessions to use for CloudWatch RUM data collection. Choosing a higher portion gives you more data but also incurs more costs.
         *
         * The range for this value is 0 to 1 inclusive. Setting this to 1 means that 100% of user sessions are sampled, and setting it to 0.1 means that 10% of user sessions are sampled.
         *
         * If you omit this parameter, the default of 0.1 is used, and 10% of sessions will be sampled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-sessionsamplerate
         */
        readonly sessionSampleRate?: number;
        /**
         * An array that lists the types of telemetry data that this app monitor is to collect.
         *
         * - `errors` indicates that RUM collects data about unhandled JavaScript errors raised by your application.
         * - `performance` indicates that RUM collects performance data about how your application and its resources are loaded and rendered. This includes Core Web Vitals.
         * - `http` indicates that RUM collects data about HTTP errors thrown by your application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-telemetries
         */
        readonly telemetries?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AppMonitorConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AppMonitorConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAppMonitor_AppMonitorConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowCookies', cdk.validateBoolean)(properties.allowCookies));
    errors.collect(cdk.propertyValidator('enableXRay', cdk.validateBoolean)(properties.enableXRay));
    errors.collect(cdk.propertyValidator('excludedPages', cdk.listValidator(cdk.validateString))(properties.excludedPages));
    errors.collect(cdk.propertyValidator('favoritePages', cdk.listValidator(cdk.validateString))(properties.favoritePages));
    errors.collect(cdk.propertyValidator('guestRoleArn', cdk.validateString)(properties.guestRoleArn));
    errors.collect(cdk.propertyValidator('identityPoolId', cdk.validateString)(properties.identityPoolId));
    errors.collect(cdk.propertyValidator('includedPages', cdk.listValidator(cdk.validateString))(properties.includedPages));
    errors.collect(cdk.propertyValidator('metricDestinations', cdk.listValidator(CfnAppMonitor_MetricDestinationPropertyValidator))(properties.metricDestinations));
    errors.collect(cdk.propertyValidator('sessionSampleRate', cdk.validateNumber)(properties.sessionSampleRate));
    errors.collect(cdk.propertyValidator('telemetries', cdk.listValidator(cdk.validateString))(properties.telemetries));
    return errors.wrap('supplied properties not correct for "AppMonitorConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RUM::AppMonitor.AppMonitorConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AppMonitorConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RUM::AppMonitor.AppMonitorConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAppMonitorAppMonitorConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAppMonitor_AppMonitorConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AllowCookies: cdk.booleanToCloudFormation(properties.allowCookies),
        EnableXRay: cdk.booleanToCloudFormation(properties.enableXRay),
        ExcludedPages: cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedPages),
        FavoritePages: cdk.listMapper(cdk.stringToCloudFormation)(properties.favoritePages),
        GuestRoleArn: cdk.stringToCloudFormation(properties.guestRoleArn),
        IdentityPoolId: cdk.stringToCloudFormation(properties.identityPoolId),
        IncludedPages: cdk.listMapper(cdk.stringToCloudFormation)(properties.includedPages),
        MetricDestinations: cdk.listMapper(cfnAppMonitorMetricDestinationPropertyToCloudFormation)(properties.metricDestinations),
        SessionSampleRate: cdk.numberToCloudFormation(properties.sessionSampleRate),
        Telemetries: cdk.listMapper(cdk.stringToCloudFormation)(properties.telemetries),
    };
}

// @ts-ignore TS6133
function CfnAppMonitorAppMonitorConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppMonitor.AppMonitorConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppMonitor.AppMonitorConfigurationProperty>();
    ret.addPropertyResult('allowCookies', 'AllowCookies', properties.AllowCookies != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCookies) : undefined);
    ret.addPropertyResult('enableXRay', 'EnableXRay', properties.EnableXRay != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableXRay) : undefined);
    ret.addPropertyResult('excludedPages', 'ExcludedPages', properties.ExcludedPages != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExcludedPages) : undefined);
    ret.addPropertyResult('favoritePages', 'FavoritePages', properties.FavoritePages != null ? cfn_parse.FromCloudFormation.getStringArray(properties.FavoritePages) : undefined);
    ret.addPropertyResult('guestRoleArn', 'GuestRoleArn', properties.GuestRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.GuestRoleArn) : undefined);
    ret.addPropertyResult('identityPoolId', 'IdentityPoolId', properties.IdentityPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityPoolId) : undefined);
    ret.addPropertyResult('includedPages', 'IncludedPages', properties.IncludedPages != null ? cfn_parse.FromCloudFormation.getStringArray(properties.IncludedPages) : undefined);
    ret.addPropertyResult('metricDestinations', 'MetricDestinations', properties.MetricDestinations != null ? cfn_parse.FromCloudFormation.getArray(CfnAppMonitorMetricDestinationPropertyFromCloudFormation)(properties.MetricDestinations) : undefined);
    ret.addPropertyResult('sessionSampleRate', 'SessionSampleRate', properties.SessionSampleRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.SessionSampleRate) : undefined);
    ret.addPropertyResult('telemetries', 'Telemetries', properties.Telemetries != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Telemetries) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAppMonitor {
    /**
     * Specifies the extended metrics that you want the CloudWatch RUM app monitor to send to a destination. Valid destinations include CloudWatch and Evidently.
     *
     * By default, RUM app monitors send some metrics to CloudWatch . These default metrics are listed in [CloudWatch metrics that you can collect with CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html) .
     *
     * If you also send extended metrics, you can send metrics to Evidently as well as CloudWatch , and you can also optionally send the metrics with additional dimensions. The valid dimension names for the additional dimensions are `BrowserName` , `CountryCode` , `DeviceType` , `FileType` , `OSName` , and `PageId` . For more information, see [Extended metrics that you can send to CloudWatch and CloudWatch Evidently](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-vended-metrics.html) .
     *
     * The maximum number of metric definitions that one destination can contain is 2000.
     *
     * Extended metrics sent are charged as CloudWatch custom metrics. Each combination of additional dimension name and dimension value counts as a custom metric.
     *
     * If some metric definitions that you specify are not valid, then the operation will not modify any metric definitions even if other metric definitions specified are valid.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html
     */
    export interface MetricDefinitionProperty {
        /**
         * This field is a map of field paths to dimension names. It defines the dimensions to associate with this metric in CloudWatch The value of this field is used only if the metric destination is `CloudWatch` . If the metric destination is `Evidently` , the value of `DimensionKeys` is ignored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html#cfn-rum-appmonitor-metricdefinition-dimensionkeys
         */
        readonly dimensionKeys?: { [key: string]: (string) } | cdk.IResolvable;
        /**
         * The pattern that defines the metric. RUM checks events that happen in a user's session against the pattern, and events that match the pattern are sent to the metric destination.
         *
         * If the metrics destination is `CloudWatch` and the event also matches a value in `DimensionKeys` , then the metric is published with the specified dimensions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html#cfn-rum-appmonitor-metricdefinition-eventpattern
         */
        readonly eventPattern?: string;
        /**
         * The name of the metric that is defined in this structure.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html#cfn-rum-appmonitor-metricdefinition-name
         */
        readonly name: string;
        /**
         * Use this field only if you are sending this metric to CloudWatch . It defines the CloudWatch metric unit that this metric is measured in.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html#cfn-rum-appmonitor-metricdefinition-unitlabel
         */
        readonly unitLabel?: string;
        /**
         * The field within the event object that the metric value is sourced from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html#cfn-rum-appmonitor-metricdefinition-valuekey
         */
        readonly valueKey?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetricDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDefinitionProperty`
 *
 * @returns the result of the validation.
 */
function CfnAppMonitor_MetricDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensionKeys', cdk.hashValidator(cdk.validateString))(properties.dimensionKeys));
    errors.collect(cdk.propertyValidator('eventPattern', cdk.validateString)(properties.eventPattern));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('unitLabel', cdk.validateString)(properties.unitLabel));
    errors.collect(cdk.propertyValidator('valueKey', cdk.validateString)(properties.valueKey));
    return errors.wrap('supplied properties not correct for "MetricDefinitionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RUM::AppMonitor.MetricDefinition` resource
 *
 * @param properties - the TypeScript properties of a `MetricDefinitionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RUM::AppMonitor.MetricDefinition` resource.
 */
// @ts-ignore TS6133
function cfnAppMonitorMetricDefinitionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAppMonitor_MetricDefinitionPropertyValidator(properties).assertSuccess();
    return {
        DimensionKeys: cdk.hashMapper(cdk.stringToCloudFormation)(properties.dimensionKeys),
        EventPattern: cdk.stringToCloudFormation(properties.eventPattern),
        Name: cdk.stringToCloudFormation(properties.name),
        UnitLabel: cdk.stringToCloudFormation(properties.unitLabel),
        ValueKey: cdk.stringToCloudFormation(properties.valueKey),
    };
}

// @ts-ignore TS6133
function CfnAppMonitorMetricDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppMonitor.MetricDefinitionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppMonitor.MetricDefinitionProperty>();
    ret.addPropertyResult('dimensionKeys', 'DimensionKeys', properties.DimensionKeys != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.DimensionKeys) : undefined);
    ret.addPropertyResult('eventPattern', 'EventPattern', properties.EventPattern != null ? cfn_parse.FromCloudFormation.getString(properties.EventPattern) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('unitLabel', 'UnitLabel', properties.UnitLabel != null ? cfn_parse.FromCloudFormation.getString(properties.UnitLabel) : undefined);
    ret.addPropertyResult('valueKey', 'ValueKey', properties.ValueKey != null ? cfn_parse.FromCloudFormation.getString(properties.ValueKey) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAppMonitor {
    /**
     * Creates or updates a destination to receive extended metrics from CloudWatch RUM. You can send extended metrics to CloudWatch or to a CloudWatch Evidently experiment.
     *
     * For more information about extended metrics, see [Extended metrics that you can send to CloudWatch and CloudWatch Evidently](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-vended-metrics.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdestination.html
     */
    export interface MetricDestinationProperty {
        /**
         * Defines the destination to send the metrics to. Valid values are `CloudWatch` and `Evidently` . If you specify `Evidently` , you must also specify the ARN of the CloudWatch Evidently experiment that is to be the destination and an IAM role that has permission to write to the experiment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdestination.html#cfn-rum-appmonitor-metricdestination-destination
         */
        readonly destination: string;
        /**
         * Use this parameter only if `Destination` is `Evidently` . This parameter specifies the ARN of the Evidently experiment that will receive the extended metrics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdestination.html#cfn-rum-appmonitor-metricdestination-destinationarn
         */
        readonly destinationArn?: string;
        /**
         * This parameter is required if `Destination` is `Evidently` . If `Destination` is `CloudWatch` , do not use this parameter.
         *
         * This parameter specifies the ARN of an IAM role that RUM will assume to write to the Evidently experiment that you are sending metrics to. This role must have permission to write to that experiment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdestination.html#cfn-rum-appmonitor-metricdestination-iamrolearn
         */
        readonly iamRoleArn?: string;
        /**
         * An array of structures which define the metrics that you want to send.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdestination.html#cfn-rum-appmonitor-metricdestination-metricdefinitions
         */
        readonly metricDefinitions?: Array<CfnAppMonitor.MetricDefinitionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MetricDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAppMonitor_MetricDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', cdk.validateString)(properties.destination));
    errors.collect(cdk.propertyValidator('destinationArn', cdk.validateString)(properties.destinationArn));
    errors.collect(cdk.propertyValidator('iamRoleArn', cdk.validateString)(properties.iamRoleArn));
    errors.collect(cdk.propertyValidator('metricDefinitions', cdk.listValidator(CfnAppMonitor_MetricDefinitionPropertyValidator))(properties.metricDefinitions));
    return errors.wrap('supplied properties not correct for "MetricDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RUM::AppMonitor.MetricDestination` resource
 *
 * @param properties - the TypeScript properties of a `MetricDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RUM::AppMonitor.MetricDestination` resource.
 */
// @ts-ignore TS6133
function cfnAppMonitorMetricDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAppMonitor_MetricDestinationPropertyValidator(properties).assertSuccess();
    return {
        Destination: cdk.stringToCloudFormation(properties.destination),
        DestinationArn: cdk.stringToCloudFormation(properties.destinationArn),
        IamRoleArn: cdk.stringToCloudFormation(properties.iamRoleArn),
        MetricDefinitions: cdk.listMapper(cfnAppMonitorMetricDefinitionPropertyToCloudFormation)(properties.metricDefinitions),
    };
}

// @ts-ignore TS6133
function CfnAppMonitorMetricDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppMonitor.MetricDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppMonitor.MetricDestinationProperty>();
    ret.addPropertyResult('destination', 'Destination', cfn_parse.FromCloudFormation.getString(properties.Destination));
    ret.addPropertyResult('destinationArn', 'DestinationArn', properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined);
    ret.addPropertyResult('iamRoleArn', 'IamRoleArn', properties.IamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamRoleArn) : undefined);
    ret.addPropertyResult('metricDefinitions', 'MetricDefinitions', properties.MetricDefinitions != null ? cfn_parse.FromCloudFormation.getArray(CfnAppMonitorMetricDefinitionPropertyFromCloudFormation)(properties.MetricDefinitions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
