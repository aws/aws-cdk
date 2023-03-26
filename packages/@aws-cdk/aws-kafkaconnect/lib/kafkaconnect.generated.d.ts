import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnConnector`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html
 */
export interface CfnConnectorProps {
    /**
     * The connector's compute capacity settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-capacity
     */
    readonly capacity: CfnConnector.CapacityProperty | cdk.IResolvable;
    /**
     * The configuration of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectorconfiguration
     */
    readonly connectorConfiguration: {
        [key: string]: (string);
    } | cdk.IResolvable;
    /**
     * The name of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectorname
     */
    readonly connectorName: string;
    /**
     * The details of the Apache Kafka cluster to which the connector is connected.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkacluster
     */
    readonly kafkaCluster: CfnConnector.KafkaClusterProperty | cdk.IResolvable;
    /**
     * The type of client authentication used to connect to the Apache Kafka cluster. The value is NONE when no client authentication is used.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaclusterclientauthentication
     */
    readonly kafkaClusterClientAuthentication: CfnConnector.KafkaClusterClientAuthenticationProperty | cdk.IResolvable;
    /**
     * Details of encryption in transit to the Apache Kafka cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaclusterencryptionintransit
     */
    readonly kafkaClusterEncryptionInTransit: CfnConnector.KafkaClusterEncryptionInTransitProperty | cdk.IResolvable;
    /**
     * The version of Kafka Connect. It has to be compatible with both the Apache Kafka cluster's version and the plugins.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaconnectversion
     */
    readonly kafkaConnectVersion: string;
    /**
     * Specifies which plugin to use for the connector. You must specify a single-element list. Amazon MSK Connect does not currently support specifying multiple plugins.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-plugins
     */
    readonly plugins: Array<CfnConnector.PluginProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used by the connector to access Amazon Web Services resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-serviceexecutionrolearn
     */
    readonly serviceExecutionRoleArn: string;
    /**
     * The description of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectordescription
     */
    readonly connectorDescription?: string;
    /**
     * The settings for delivering connector logs to Amazon CloudWatch Logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-logdelivery
     */
    readonly logDelivery?: CfnConnector.LogDeliveryProperty | cdk.IResolvable;
    /**
     * The worker configurations that are in use with the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-workerconfiguration
     */
    readonly workerConfiguration?: CfnConnector.WorkerConfigurationProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::KafkaConnect::Connector`
 *
 * Creates a connector using the specified properties.
 *
 * @cloudformationResource AWS::KafkaConnect::Connector
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html
 */
export declare class CfnConnector extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::KafkaConnect::Connector";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnector;
    /**
     * The Amazon Resource Name (ARN) of the newly created connector.
     * @cloudformationAttribute ConnectorArn
     */
    readonly attrConnectorArn: string;
    /**
     * The connector's compute capacity settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-capacity
     */
    capacity: CfnConnector.CapacityProperty | cdk.IResolvable;
    /**
     * The configuration of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectorconfiguration
     */
    connectorConfiguration: {
        [key: string]: (string);
    } | cdk.IResolvable;
    /**
     * The name of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectorname
     */
    connectorName: string;
    /**
     * The details of the Apache Kafka cluster to which the connector is connected.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkacluster
     */
    kafkaCluster: CfnConnector.KafkaClusterProperty | cdk.IResolvable;
    /**
     * The type of client authentication used to connect to the Apache Kafka cluster. The value is NONE when no client authentication is used.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaclusterclientauthentication
     */
    kafkaClusterClientAuthentication: CfnConnector.KafkaClusterClientAuthenticationProperty | cdk.IResolvable;
    /**
     * Details of encryption in transit to the Apache Kafka cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaclusterencryptionintransit
     */
    kafkaClusterEncryptionInTransit: CfnConnector.KafkaClusterEncryptionInTransitProperty | cdk.IResolvable;
    /**
     * The version of Kafka Connect. It has to be compatible with both the Apache Kafka cluster's version and the plugins.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaconnectversion
     */
    kafkaConnectVersion: string;
    /**
     * Specifies which plugin to use for the connector. You must specify a single-element list. Amazon MSK Connect does not currently support specifying multiple plugins.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-plugins
     */
    plugins: Array<CfnConnector.PluginProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used by the connector to access Amazon Web Services resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-serviceexecutionrolearn
     */
    serviceExecutionRoleArn: string;
    /**
     * The description of the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectordescription
     */
    connectorDescription: string | undefined;
    /**
     * The settings for delivering connector logs to Amazon CloudWatch Logs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-logdelivery
     */
    logDelivery: CfnConnector.LogDeliveryProperty | cdk.IResolvable | undefined;
    /**
     * The worker configurations that are in use with the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-workerconfiguration
     */
    workerConfiguration: CfnConnector.WorkerConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::KafkaConnect::Connector`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConnectorProps);
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
export declare namespace CfnConnector {
    /**
     * The details of the Apache Kafka cluster to which the connector is connected.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-apachekafkacluster.html
     */
    interface ApacheKafkaClusterProperty {
        /**
         * The bootstrap servers of the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-apachekafkacluster.html#cfn-kafkaconnect-connector-apachekafkacluster-bootstrapservers
         */
        readonly bootstrapServers: string;
        /**
         * Details of an Amazon VPC which has network connectivity to the Apache Kafka cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-apachekafkacluster.html#cfn-kafkaconnect-connector-apachekafkacluster-vpc
         */
        readonly vpc: CfnConnector.VpcProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnector {
    /**
     * Specifies how the connector scales.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html
     */
    interface AutoScalingProperty {
        /**
         * The maximum number of workers allocated to the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-maxworkercount
         */
        readonly maxWorkerCount: number;
        /**
         * The number of microcontroller units (MCUs) allocated to each connector worker. The valid values are 1,2,4,8.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-mcucount
         */
        readonly mcuCount: number;
        /**
         * The minimum number of workers allocated to the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-minworkercount
         */
        readonly minWorkerCount: number;
        /**
         * The sacle-in policy for the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-scaleinpolicy
         */
        readonly scaleInPolicy: CfnConnector.ScaleInPolicyProperty | cdk.IResolvable;
        /**
         * The sacle-out policy for the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-scaleoutpolicy
         */
        readonly scaleOutPolicy: CfnConnector.ScaleOutPolicyProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnector {
    /**
     * Information about the capacity of the connector, whether it is auto scaled or provisioned.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-capacity.html
     */
    interface CapacityProperty {
        /**
         * Information about the auto scaling parameters for the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-capacity.html#cfn-kafkaconnect-connector-capacity-autoscaling
         */
        readonly autoScaling?: CfnConnector.AutoScalingProperty | cdk.IResolvable;
        /**
         * Details about a fixed capacity allocated to a connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-capacity.html#cfn-kafkaconnect-connector-capacity-provisionedcapacity
         */
        readonly provisionedCapacity?: CfnConnector.ProvisionedCapacityProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnector {
    /**
     * The settings for delivering connector logs to Amazon CloudWatch Logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-cloudwatchlogslogdelivery.html
     */
    interface CloudWatchLogsLogDeliveryProperty {
        /**
         * Whether log delivery to Amazon CloudWatch Logs is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-cloudwatchlogslogdelivery.html#cfn-kafkaconnect-connector-cloudwatchlogslogdelivery-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * The name of the CloudWatch log group that is the destination for log delivery.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-cloudwatchlogslogdelivery.html#cfn-kafkaconnect-connector-cloudwatchlogslogdelivery-loggroup
         */
        readonly logGroup?: string;
    }
}
export declare namespace CfnConnector {
    /**
     * A plugin is an AWS resource that contains the code that defines a connector's logic.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-customplugin.html
     */
    interface CustomPluginProperty {
        /**
         * The Amazon Resource Name (ARN) of the custom plugin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-customplugin.html#cfn-kafkaconnect-connector-customplugin-custompluginarn
         */
        readonly customPluginArn: string;
        /**
         * The revision of the custom plugin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-customplugin.html#cfn-kafkaconnect-connector-customplugin-revision
         */
        readonly revision: number;
    }
}
export declare namespace CfnConnector {
    /**
     * The settings for delivering logs to Amazon Kinesis Data Firehose.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-firehoselogdelivery.html
     */
    interface FirehoseLogDeliveryProperty {
        /**
         * The name of the Kinesis Data Firehose delivery stream that is the destination for log delivery.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-firehoselogdelivery.html#cfn-kafkaconnect-connector-firehoselogdelivery-deliverystream
         */
        readonly deliveryStream?: string;
        /**
         * Specifies whether connector logs get delivered to Amazon Kinesis Data Firehose.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-firehoselogdelivery.html#cfn-kafkaconnect-connector-firehoselogdelivery-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnConnector {
    /**
     * The details of the Apache Kafka cluster to which the connector is connected.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkacluster.html
     */
    interface KafkaClusterProperty {
        /**
         * The Apache Kafka cluster to which the connector is connected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkacluster.html#cfn-kafkaconnect-connector-kafkacluster-apachekafkacluster
         */
        readonly apacheKafkaCluster: CfnConnector.ApacheKafkaClusterProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnector {
    /**
     * The client authentication information used in order to authenticate with the Apache Kafka cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterclientauthentication.html
     */
    interface KafkaClusterClientAuthenticationProperty {
        /**
         * The type of client authentication used to connect to the Apache Kafka cluster. Value NONE means that no client authentication is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterclientauthentication.html#cfn-kafkaconnect-connector-kafkaclusterclientauthentication-authenticationtype
         */
        readonly authenticationType: string;
    }
}
export declare namespace CfnConnector {
    /**
     * Details of encryption in transit to the Apache Kafka cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterencryptionintransit.html
     */
    interface KafkaClusterEncryptionInTransitProperty {
        /**
         * The type of encryption in transit to the Apache Kafka cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterencryptionintransit.html#cfn-kafkaconnect-connector-kafkaclusterencryptionintransit-encryptiontype
         */
        readonly encryptionType: string;
    }
}
export declare namespace CfnConnector {
    /**
     * Details about log delivery.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-logdelivery.html
     */
    interface LogDeliveryProperty {
        /**
         * The workers can send worker logs to different destination types. This configuration specifies the details of these destinations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-logdelivery.html#cfn-kafkaconnect-connector-logdelivery-workerlogdelivery
         */
        readonly workerLogDelivery: CfnConnector.WorkerLogDeliveryProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnector {
    /**
     * A plugin is an AWS resource that contains the code that defines your connector logic.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-plugin.html
     */
    interface PluginProperty {
        /**
         * Details about a custom plugin.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-plugin.html#cfn-kafkaconnect-connector-plugin-customplugin
         */
        readonly customPlugin: CfnConnector.CustomPluginProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnector {
    /**
     * Details about a connector's provisioned capacity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-provisionedcapacity.html
     */
    interface ProvisionedCapacityProperty {
        /**
         * The number of microcontroller units (MCUs) allocated to each connector worker. The valid values are 1,2,4,8.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-provisionedcapacity.html#cfn-kafkaconnect-connector-provisionedcapacity-mcucount
         */
        readonly mcuCount?: number;
        /**
         * The number of workers that are allocated to the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-provisionedcapacity.html#cfn-kafkaconnect-connector-provisionedcapacity-workercount
         */
        readonly workerCount: number;
    }
}
export declare namespace CfnConnector {
    /**
     * Details about delivering logs to Amazon S3.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html
     */
    interface S3LogDeliveryProperty {
        /**
         * The name of the S3 bucket that is the destination for log delivery.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html#cfn-kafkaconnect-connector-s3logdelivery-bucket
         */
        readonly bucket?: string;
        /**
         * Specifies whether connector logs get sent to the specified Amazon S3 destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html#cfn-kafkaconnect-connector-s3logdelivery-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * The S3 prefix that is the destination for log delivery.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html#cfn-kafkaconnect-connector-s3logdelivery-prefix
         */
        readonly prefix?: string;
    }
}
export declare namespace CfnConnector {
    /**
     * The scale-in policy for the connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleinpolicy.html
     */
    interface ScaleInPolicyProperty {
        /**
         * Specifies the CPU utilization percentage threshold at which you want connector scale in to be triggered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleinpolicy.html#cfn-kafkaconnect-connector-scaleinpolicy-cpuutilizationpercentage
         */
        readonly cpuUtilizationPercentage: number;
    }
}
export declare namespace CfnConnector {
    /**
     * The scale-out policy for the connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleoutpolicy.html
     */
    interface ScaleOutPolicyProperty {
        /**
         * The CPU utilization percentage threshold at which you want connector scale out to be triggered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleoutpolicy.html#cfn-kafkaconnect-connector-scaleoutpolicy-cpuutilizationpercentage
         */
        readonly cpuUtilizationPercentage: number;
    }
}
export declare namespace CfnConnector {
    /**
     * Information about the VPC in which the connector resides.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-vpc.html
     */
    interface VpcProperty {
        /**
         * The security groups for the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-vpc.html#cfn-kafkaconnect-connector-vpc-securitygroups
         */
        readonly securityGroups: string[];
        /**
         * The subnets for the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-vpc.html#cfn-kafkaconnect-connector-vpc-subnets
         */
        readonly subnets: string[];
    }
}
export declare namespace CfnConnector {
    /**
     * The configuration of the workers, which are the processes that run the connector logic.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerconfiguration.html
     */
    interface WorkerConfigurationProperty {
        /**
         * The revision of the worker configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerconfiguration.html#cfn-kafkaconnect-connector-workerconfiguration-revision
         */
        readonly revision: number;
        /**
         * The Amazon Resource Name (ARN) of the worker configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerconfiguration.html#cfn-kafkaconnect-connector-workerconfiguration-workerconfigurationarn
         */
        readonly workerConfigurationArn: string;
    }
}
export declare namespace CfnConnector {
    /**
     * Workers can send worker logs to different destination types. This configuration specifies the details of these destinations.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html
     */
    interface WorkerLogDeliveryProperty {
        /**
         * Details about delivering logs to Amazon CloudWatch Logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html#cfn-kafkaconnect-connector-workerlogdelivery-cloudwatchlogs
         */
        readonly cloudWatchLogs?: CfnConnector.CloudWatchLogsLogDeliveryProperty | cdk.IResolvable;
        /**
         * Details about delivering logs to Amazon Kinesis Data Firehose.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html#cfn-kafkaconnect-connector-workerlogdelivery-firehose
         */
        readonly firehose?: CfnConnector.FirehoseLogDeliveryProperty | cdk.IResolvable;
        /**
         * Details about delivering logs to Amazon S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html#cfn-kafkaconnect-connector-workerlogdelivery-s3
         */
        readonly s3?: CfnConnector.S3LogDeliveryProperty | cdk.IResolvable;
    }
}
