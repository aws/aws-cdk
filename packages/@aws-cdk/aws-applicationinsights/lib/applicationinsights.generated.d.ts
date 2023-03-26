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
 * A CloudFormation `AWS::ApplicationInsights::Application`
 *
 * The `AWS::ApplicationInsights::Application` resource adds an application that is created from a resource group.
 *
 * @cloudformationResource AWS::ApplicationInsights::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html
 */
export declare class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApplicationInsights::Application";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication;
    /**
     * Returns the Amazon Resource Name (ARN) of the application, such as `arn:aws:applicationinsights:us-east-1:123456789012:application/resource-group/my_resource_group` .
     * @cloudformationAttribute ApplicationARN
     */
    readonly attrApplicationArn: string;
    /**
     * The name of the resource group used for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-resourcegroupname
     */
    resourceGroupName: string;
    /**
     * If set to `true` , the application components will be configured with the monitoring configuration recommended by Application Insights.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-autoconfigurationenabled
     */
    autoConfigurationEnabled: boolean | cdk.IResolvable | undefined;
    /**
     * The monitoring settings of the components.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-componentmonitoringsettings
     */
    componentMonitoringSettings: Array<CfnApplication.ComponentMonitoringSettingProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Describes a custom component by grouping similar standalone instances to monitor.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-customcomponents
     */
    customComponents: Array<CfnApplication.CustomComponentProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Indicates whether Application Insights can listen to CloudWatch events for the application resources, such as `instance terminated` , `failed deployment` , and others.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-cwemonitorenabled
     */
    cweMonitorEnabled: boolean | cdk.IResolvable | undefined;
    /**
     * Application Insights can create applications based on a resource group or on an account. To create an account-based application using all of the resources in the account, set this parameter to `ACCOUNT_BASED` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-groupingtype
     */
    groupingType: string | undefined;
    /**
     * The log pattern sets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-logpatternsets
     */
    logPatternSets: Array<CfnApplication.LogPatternSetProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Indicates whether Application Insights will create OpsItems for any problem that is detected by Application Insights for an application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-opscenterenabled
     */
    opsCenterEnabled: boolean | cdk.IResolvable | undefined;
    /**
     * The SNS topic provided to Application Insights that is associated with the created OpsItems to receive SNS notifications for opsItem updates.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-opsitemsnstopicarn
     */
    opsItemSnsTopicArn: string | undefined;
    /**
     * An array of `Tags` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationinsights-application.html#cfn-applicationinsights-application-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::ApplicationInsights::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps);
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application Alarm` property type defines a CloudWatch alarm to be monitored for the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-alarm.html
     */
    interface AlarmProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application AlarmMetric` property type defines a metric to monitor for the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-alarmmetric.html
     */
    interface AlarmMetricProperty {
        /**
         * The name of the metric to be monitored for the component. For metrics supported by Application Insights, see [Logs and metrics supported by Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-logs-and-metrics.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-alarmmetric.html#cfn-applicationinsights-application-alarmmetric-alarmmetricname
         */
        readonly alarmMetricName: string;
    }
}
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application ComponentConfiguration` property type defines the configuration settings of the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentconfiguration.html
     */
    interface ComponentConfigurationProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application ComponentMonitoringSetting` property type defines the monitoring setting of the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-componentmonitoringsetting.html
     */
    interface ComponentMonitoringSettingProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application ConfigurationDetails` property type specifies the configuration settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-configurationdetails.html
     */
    interface ConfigurationDetailsProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application CustomComponent` property type describes a custom component by grouping similar standalone instances to monitor.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-customcomponent.html
     */
    interface CustomComponentProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application HAClusterPrometheusExporter` property type defines the HA cluster Prometheus Exporter settings. For more information, see the [component configuration](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/component-config-sections.html#component-configuration-prometheus) in the CloudWatch Application Insights documentation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-haclusterprometheusexporter.html
     */
    interface HAClusterPrometheusExporterProperty {
        /**
         * The target port to which Prometheus sends metrics. If not specified, the default port 9668 is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-haclusterprometheusexporter.html#cfn-applicationinsights-application-haclusterprometheusexporter-prometheusport
         */
        readonly prometheusPort?: string;
    }
}
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application HANAPrometheusExporter` property type defines the HANA DB Prometheus Exporter settings. For more information, see the [component configuration](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/component-config-sections.html#component-configuration-prometheus) in the CloudWatch Application Insights documentation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-hanaprometheusexporter.html
     */
    interface HANAPrometheusExporterProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application JMXPrometheusExporter` property type defines the JMXPrometheus Exporter configuration. For more information, see the [component configuration](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/component-config-sections.html#component-configuration-prometheus) in the CloudWatch Application Insights documentation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-jmxprometheusexporter.html
     */
    interface JMXPrometheusExporterProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application Log` property type specifies a log to monitor for the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-log.html
     */
    interface LogProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application LogPattern` property type specifies an object that defines the log patterns that belong to a `LogPatternSet` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-logpattern.html
     */
    interface LogPatternProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application LogPatternSet` property type specifies the log pattern set.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-logpatternset.html
     */
    interface LogPatternSetProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application SubComponentConfigurationDetails` property type specifies the configuration settings of the sub-components.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-subcomponentconfigurationdetails.html
     */
    interface SubComponentConfigurationDetailsProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application SubComponentTypeConfiguration` property type specifies the sub-component configurations for a component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-subcomponenttypeconfiguration.html
     */
    interface SubComponentTypeConfigurationProperty {
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
export declare namespace CfnApplication {
    /**
     * The `AWS::ApplicationInsights::Application WindowsEvent` property type specifies a Windows Event to monitor for the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationinsights-application-windowsevent.html
     */
    interface WindowsEventProperty {
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
