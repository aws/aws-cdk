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
 * A CloudFormation `AWS::LookoutMetrics::Alert`
 *
 * The `AWS::LookoutMetrics::Alert` type creates an alert for an anomaly detector.
 *
 * @cloudformationResource AWS::LookoutMetrics::Alert
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html
 */
export declare class CfnAlert extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LookoutMetrics::Alert";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAlert;
    /**
     * The Amazon Resource Name (ARN) of the alert. For example, `arn:aws:lookoutmetrics:us-east-2:123456789012:Alert:my-alert`
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Action that will be triggered when there is an alert.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-action
     */
    action: CfnAlert.ActionProperty | cdk.IResolvable;
    /**
     * An integer from 0 to 100 specifying the alert sensitivity threshold.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertsensitivitythreshold
     */
    alertSensitivityThreshold: number;
    /**
     * The ARN of the detector to which the alert is attached.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-anomalydetectorarn
     */
    anomalyDetectorArn: string;
    /**
     * A description of the alert.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertdescription
     */
    alertDescription: string | undefined;
    /**
     * The name of the alert.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-alert.html#cfn-lookoutmetrics-alert-alertname
     */
    alertName: string | undefined;
    /**
     * Create a new `AWS::LookoutMetrics::Alert`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAlertProps);
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
export declare namespace CfnAlert {
    /**
     * A configuration that specifies the action to perform when anomalies are detected.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-action.html
     */
    interface ActionProperty {
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
export declare namespace CfnAlert {
    /**
     * Contains information about a Lambda configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-lambdaconfiguration.html
     */
    interface LambdaConfigurationProperty {
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
export declare namespace CfnAlert {
    /**
     * Contains information about the SNS topic to which you want to send your alerts and the IAM role that has access to that topic.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-alert-snsconfiguration.html
     */
    interface SNSConfigurationProperty {
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
 * A CloudFormation `AWS::LookoutMetrics::AnomalyDetector`
 *
 * The `AWS::LookoutMetrics::AnomalyDetector` type creates an anomaly detector.
 *
 * @cloudformationResource AWS::LookoutMetrics::AnomalyDetector
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html
 */
export declare class CfnAnomalyDetector extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LookoutMetrics::AnomalyDetector";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnomalyDetector;
    /**
     * The Amazon Resource Name (ARN) of the detector. For example, `arn:aws:lookoutmetrics:us-east-2:123456789012:AnomalyDetector:my-detector`
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Contains information about the configuration of the anomaly detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectorconfig
     */
    anomalyDetectorConfig: CfnAnomalyDetector.AnomalyDetectorConfigProperty | cdk.IResolvable;
    /**
     * The detector's dataset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-metricsetlist
     */
    metricSetList: Array<CfnAnomalyDetector.MetricSetProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A description of the detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectordescription
     */
    anomalyDetectorDescription: string | undefined;
    /**
     * The name of the detector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-anomalydetectorname
     */
    anomalyDetectorName: string | undefined;
    /**
     * The ARN of the KMS key to use to encrypt your data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutmetrics-anomalydetector.html#cfn-lookoutmetrics-anomalydetector-kmskeyarn
     */
    kmsKeyArn: string | undefined;
    /**
     * Create a new `AWS::LookoutMetrics::AnomalyDetector`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAnomalyDetectorProps);
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
export declare namespace CfnAnomalyDetector {
    /**
     * Contains information about a detector's configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-anomalydetectorconfig.html
     */
    interface AnomalyDetectorConfigProperty {
        /**
         * The frequency at which the detector analyzes its source data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-anomalydetectorconfig.html#cfn-lookoutmetrics-anomalydetector-anomalydetectorconfig-anomalydetectorfrequency
         */
        readonly anomalyDetectorFrequency: string;
    }
}
export declare namespace CfnAnomalyDetector {
    /**
     * Details about an Amazon AppFlow flow datasource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-appflowconfig.html
     */
    interface AppFlowConfigProperty {
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
export declare namespace CfnAnomalyDetector {
    /**
     * Details about an Amazon CloudWatch datasource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-cloudwatchconfig.html
     */
    interface CloudwatchConfigProperty {
        /**
         * An IAM role that gives Amazon Lookout for Metrics permission to access data in Amazon CloudWatch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-cloudwatchconfig.html#cfn-lookoutmetrics-anomalydetector-cloudwatchconfig-rolearn
         */
        readonly roleArn: string;
    }
}
export declare namespace CfnAnomalyDetector {
    /**
     * Contains information about how a source CSV data file should be analyzed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-csvformatdescriptor.html
     */
    interface CsvFormatDescriptorProperty {
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
export declare namespace CfnAnomalyDetector {
    /**
     * Contains information about a source file's formatting.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-fileformatdescriptor.html
     */
    interface FileFormatDescriptorProperty {
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
export declare namespace CfnAnomalyDetector {
    /**
     * Contains information about how a source JSON data file should be analyzed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-jsonformatdescriptor.html
     */
    interface JsonFormatDescriptorProperty {
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
export declare namespace CfnAnomalyDetector {
    /**
     * A calculation made by contrasting a measure and a dimension from your source data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metric.html
     */
    interface MetricProperty {
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
export declare namespace CfnAnomalyDetector {
    /**
     * Contains information about a dataset.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricset.html
     */
    interface MetricSetProperty {
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
export declare namespace CfnAnomalyDetector {
    /**
     * Contains information about how the source data should be interpreted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-metricsource.html
     */
    interface MetricSourceProperty {
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
export declare namespace CfnAnomalyDetector {
    /**
     * Contains information about the Amazon Relational Database Service (RDS) configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-rdssourceconfig.html
     */
    interface RDSSourceConfigProperty {
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
export declare namespace CfnAnomalyDetector {
    /**
     * Provides information about the Amazon Redshift database configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-redshiftsourceconfig.html
     */
    interface RedshiftSourceConfigProperty {
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
export declare namespace CfnAnomalyDetector {
    /**
     * Contains information about the configuration of the S3 bucket that contains source files.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-s3sourceconfig.html
     */
    interface S3SourceConfigProperty {
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
export declare namespace CfnAnomalyDetector {
    /**
     * Contains information about the column used to track time in a source data file.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-timestampcolumn.html
     */
    interface TimestampColumnProperty {
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
export declare namespace CfnAnomalyDetector {
    /**
     * Contains configuration information about the Amazon Virtual Private Cloud (VPC).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lookoutmetrics-anomalydetector-vpcconfiguration.html
     */
    interface VpcConfigurationProperty {
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
