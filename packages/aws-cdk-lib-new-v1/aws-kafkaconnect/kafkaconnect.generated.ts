/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a connector using the specified properties.
 *
 * @cloudformationResource AWS::KafkaConnect::Connector
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html
 */
export class CfnConnector extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::KafkaConnect::Connector";

  /**
   * Build a CfnConnector from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnector {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnector(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the newly created connector.
   *
   * @cloudformationAttribute ConnectorArn
   */
  public readonly attrConnectorArn: string;

  /**
   * The connector's compute capacity settings.
   */
  public capacity: CfnConnector.CapacityProperty | cdk.IResolvable;

  /**
   * The configuration of the connector.
   */
  public connectorConfiguration: cdk.IResolvable | Record<string, string>;

  /**
   * The description of the connector.
   */
  public connectorDescription?: string;

  /**
   * The name of the connector.
   */
  public connectorName: string;

  /**
   * The details of the Apache Kafka cluster to which the connector is connected.
   */
  public kafkaCluster: cdk.IResolvable | CfnConnector.KafkaClusterProperty;

  /**
   * The type of client authentication used to connect to the Apache Kafka cluster.
   */
  public kafkaClusterClientAuthentication: cdk.IResolvable | CfnConnector.KafkaClusterClientAuthenticationProperty;

  /**
   * Details of encryption in transit to the Apache Kafka cluster.
   */
  public kafkaClusterEncryptionInTransit: cdk.IResolvable | CfnConnector.KafkaClusterEncryptionInTransitProperty;

  /**
   * The version of Kafka Connect.
   */
  public kafkaConnectVersion: string;

  /**
   * The settings for delivering connector logs to Amazon CloudWatch Logs.
   */
  public logDelivery?: cdk.IResolvable | CfnConnector.LogDeliveryProperty;

  /**
   * Specifies which plugin to use for the connector.
   */
  public plugins: Array<cdk.IResolvable | CfnConnector.PluginProperty> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the IAM role used by the connector to access Amazon Web Services resources.
   */
  public serviceExecutionRoleArn: string;

  /**
   * The worker configurations that are in use with the connector.
   */
  public workerConfiguration?: cdk.IResolvable | CfnConnector.WorkerConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectorProps) {
    super(scope, id, {
      "type": CfnConnector.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "capacity", this);
    cdk.requireProperty(props, "connectorConfiguration", this);
    cdk.requireProperty(props, "connectorName", this);
    cdk.requireProperty(props, "kafkaCluster", this);
    cdk.requireProperty(props, "kafkaClusterClientAuthentication", this);
    cdk.requireProperty(props, "kafkaClusterEncryptionInTransit", this);
    cdk.requireProperty(props, "kafkaConnectVersion", this);
    cdk.requireProperty(props, "plugins", this);
    cdk.requireProperty(props, "serviceExecutionRoleArn", this);

    this.attrConnectorArn = cdk.Token.asString(this.getAtt("ConnectorArn", cdk.ResolutionTypeHint.STRING));
    this.capacity = props.capacity;
    this.connectorConfiguration = props.connectorConfiguration;
    this.connectorDescription = props.connectorDescription;
    this.connectorName = props.connectorName;
    this.kafkaCluster = props.kafkaCluster;
    this.kafkaClusterClientAuthentication = props.kafkaClusterClientAuthentication;
    this.kafkaClusterEncryptionInTransit = props.kafkaClusterEncryptionInTransit;
    this.kafkaConnectVersion = props.kafkaConnectVersion;
    this.logDelivery = props.logDelivery;
    this.plugins = props.plugins;
    this.serviceExecutionRoleArn = props.serviceExecutionRoleArn;
    this.workerConfiguration = props.workerConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "capacity": this.capacity,
      "connectorConfiguration": this.connectorConfiguration,
      "connectorDescription": this.connectorDescription,
      "connectorName": this.connectorName,
      "kafkaCluster": this.kafkaCluster,
      "kafkaClusterClientAuthentication": this.kafkaClusterClientAuthentication,
      "kafkaClusterEncryptionInTransit": this.kafkaClusterEncryptionInTransit,
      "kafkaConnectVersion": this.kafkaConnectVersion,
      "logDelivery": this.logDelivery,
      "plugins": this.plugins,
      "serviceExecutionRoleArn": this.serviceExecutionRoleArn,
      "workerConfiguration": this.workerConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnector.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectorPropsToCloudFormation(props);
  }
}

export namespace CfnConnector {
  /**
   * The details of the Apache Kafka cluster to which the connector is connected.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkacluster.html
   */
  export interface KafkaClusterProperty {
    /**
     * The Apache Kafka cluster to which the connector is connected.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkacluster.html#cfn-kafkaconnect-connector-kafkacluster-apachekafkacluster
     */
    readonly apacheKafkaCluster: CfnConnector.ApacheKafkaClusterProperty | cdk.IResolvable;
  }

  /**
   * The details of the Apache Kafka cluster to which the connector is connected.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-apachekafkacluster.html
   */
  export interface ApacheKafkaClusterProperty {
    /**
     * The bootstrap servers of the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-apachekafkacluster.html#cfn-kafkaconnect-connector-apachekafkacluster-bootstrapservers
     */
    readonly bootstrapServers: string;

    /**
     * Details of an Amazon VPC which has network connectivity to the Apache Kafka cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-apachekafkacluster.html#cfn-kafkaconnect-connector-apachekafkacluster-vpc
     */
    readonly vpc: cdk.IResolvable | CfnConnector.VpcProperty;
  }

  /**
   * Information about the VPC in which the connector resides.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-vpc.html
   */
  export interface VpcProperty {
    /**
     * The security groups for the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-vpc.html#cfn-kafkaconnect-connector-vpc-securitygroups
     */
    readonly securityGroups: Array<string>;

    /**
     * The subnets for the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-vpc.html#cfn-kafkaconnect-connector-vpc-subnets
     */
    readonly subnets: Array<string>;
  }

  /**
   * The configuration of the workers, which are the processes that run the connector logic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerconfiguration.html
   */
  export interface WorkerConfigurationProperty {
    /**
     * The revision of the worker configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerconfiguration.html#cfn-kafkaconnect-connector-workerconfiguration-revision
     */
    readonly revision: number;

    /**
     * The Amazon Resource Name (ARN) of the worker configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerconfiguration.html#cfn-kafkaconnect-connector-workerconfiguration-workerconfigurationarn
     */
    readonly workerConfigurationArn: string;
  }

  /**
   * Information about the capacity of the connector, whether it is auto scaled or provisioned.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-capacity.html
   */
  export interface CapacityProperty {
    /**
     * Information about the auto scaling parameters for the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-capacity.html#cfn-kafkaconnect-connector-capacity-autoscaling
     */
    readonly autoScaling?: CfnConnector.AutoScalingProperty | cdk.IResolvable;

    /**
     * Details about a fixed capacity allocated to a connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-capacity.html#cfn-kafkaconnect-connector-capacity-provisionedcapacity
     */
    readonly provisionedCapacity?: cdk.IResolvable | CfnConnector.ProvisionedCapacityProperty;
  }

  /**
   * Details about a connector's provisioned capacity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-provisionedcapacity.html
   */
  export interface ProvisionedCapacityProperty {
    /**
     * The number of microcontroller units (MCUs) allocated to each connector worker.
     *
     * The valid values are 1,2,4,8.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-provisionedcapacity.html#cfn-kafkaconnect-connector-provisionedcapacity-mcucount
     */
    readonly mcuCount?: number;

    /**
     * The number of workers that are allocated to the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-provisionedcapacity.html#cfn-kafkaconnect-connector-provisionedcapacity-workercount
     */
    readonly workerCount: number;
  }

  /**
   * Specifies how the connector scales.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html
   */
  export interface AutoScalingProperty {
    /**
     * The maximum number of workers allocated to the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-maxworkercount
     */
    readonly maxWorkerCount: number;

    /**
     * The number of microcontroller units (MCUs) allocated to each connector worker.
     *
     * The valid values are 1,2,4,8.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-mcucount
     */
    readonly mcuCount: number;

    /**
     * The minimum number of workers allocated to the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-minworkercount
     */
    readonly minWorkerCount: number;

    /**
     * The sacle-in policy for the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-scaleinpolicy
     */
    readonly scaleInPolicy: cdk.IResolvable | CfnConnector.ScaleInPolicyProperty;

    /**
     * The sacle-out policy for the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-autoscaling.html#cfn-kafkaconnect-connector-autoscaling-scaleoutpolicy
     */
    readonly scaleOutPolicy: cdk.IResolvable | CfnConnector.ScaleOutPolicyProperty;
  }

  /**
   * The scale-out policy for the connector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleoutpolicy.html
   */
  export interface ScaleOutPolicyProperty {
    /**
     * The CPU utilization percentage threshold at which you want connector scale out to be triggered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleoutpolicy.html#cfn-kafkaconnect-connector-scaleoutpolicy-cpuutilizationpercentage
     */
    readonly cpuUtilizationPercentage: number;
  }

  /**
   * The scale-in policy for the connector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleinpolicy.html
   */
  export interface ScaleInPolicyProperty {
    /**
     * Specifies the CPU utilization percentage threshold at which you want connector scale in to be triggered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-scaleinpolicy.html#cfn-kafkaconnect-connector-scaleinpolicy-cpuutilizationpercentage
     */
    readonly cpuUtilizationPercentage: number;
  }

  /**
   * Details of encryption in transit to the Apache Kafka cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterencryptionintransit.html
   */
  export interface KafkaClusterEncryptionInTransitProperty {
    /**
     * The type of encryption in transit to the Apache Kafka cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterencryptionintransit.html#cfn-kafkaconnect-connector-kafkaclusterencryptionintransit-encryptiontype
     */
    readonly encryptionType: string;
  }

  /**
   * The client authentication information used in order to authenticate with the Apache Kafka cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterclientauthentication.html
   */
  export interface KafkaClusterClientAuthenticationProperty {
    /**
     * The type of client authentication used to connect to the Apache Kafka cluster.
     *
     * Value NONE means that no client authentication is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-kafkaclusterclientauthentication.html#cfn-kafkaconnect-connector-kafkaclusterclientauthentication-authenticationtype
     */
    readonly authenticationType: string;
  }

  /**
   * Details about log delivery.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-logdelivery.html
   */
  export interface LogDeliveryProperty {
    /**
     * The workers can send worker logs to different destination types.
     *
     * This configuration specifies the details of these destinations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-logdelivery.html#cfn-kafkaconnect-connector-logdelivery-workerlogdelivery
     */
    readonly workerLogDelivery: cdk.IResolvable | CfnConnector.WorkerLogDeliveryProperty;
  }

  /**
   * Workers can send worker logs to different destination types.
   *
   * This configuration specifies the details of these destinations.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html
   */
  export interface WorkerLogDeliveryProperty {
    /**
     * Details about delivering logs to Amazon CloudWatch Logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html#cfn-kafkaconnect-connector-workerlogdelivery-cloudwatchlogs
     */
    readonly cloudWatchLogs?: CfnConnector.CloudWatchLogsLogDeliveryProperty | cdk.IResolvable;

    /**
     * Details about delivering logs to Amazon Kinesis Data Firehose.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html#cfn-kafkaconnect-connector-workerlogdelivery-firehose
     */
    readonly firehose?: CfnConnector.FirehoseLogDeliveryProperty | cdk.IResolvable;

    /**
     * Details about delivering logs to Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-workerlogdelivery.html#cfn-kafkaconnect-connector-workerlogdelivery-s3
     */
    readonly s3?: cdk.IResolvable | CfnConnector.S3LogDeliveryProperty;
  }

  /**
   * Details about delivering logs to Amazon S3.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html
   */
  export interface S3LogDeliveryProperty {
    /**
     * The name of the S3 bucket that is the destination for log delivery.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html#cfn-kafkaconnect-connector-s3logdelivery-bucket
     */
    readonly bucket?: string;

    /**
     * Specifies whether connector logs get sent to the specified Amazon S3 destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html#cfn-kafkaconnect-connector-s3logdelivery-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The S3 prefix that is the destination for log delivery.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-s3logdelivery.html#cfn-kafkaconnect-connector-s3logdelivery-prefix
     */
    readonly prefix?: string;
  }

  /**
   * The settings for delivering logs to Amazon Kinesis Data Firehose.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-firehoselogdelivery.html
   */
  export interface FirehoseLogDeliveryProperty {
    /**
     * The name of the Kinesis Data Firehose delivery stream that is the destination for log delivery.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-firehoselogdelivery.html#cfn-kafkaconnect-connector-firehoselogdelivery-deliverystream
     */
    readonly deliveryStream?: string;

    /**
     * Specifies whether connector logs get delivered to Amazon Kinesis Data Firehose.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-firehoselogdelivery.html#cfn-kafkaconnect-connector-firehoselogdelivery-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * The settings for delivering connector logs to Amazon CloudWatch Logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-cloudwatchlogslogdelivery.html
   */
  export interface CloudWatchLogsLogDeliveryProperty {
    /**
     * Whether log delivery to Amazon CloudWatch Logs is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-cloudwatchlogslogdelivery.html#cfn-kafkaconnect-connector-cloudwatchlogslogdelivery-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The name of the CloudWatch log group that is the destination for log delivery.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-cloudwatchlogslogdelivery.html#cfn-kafkaconnect-connector-cloudwatchlogslogdelivery-loggroup
     */
    readonly logGroup?: string;
  }

  /**
   * A plugin is an AWS resource that contains the code that defines your connector logic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-plugin.html
   */
  export interface PluginProperty {
    /**
     * Details about a custom plugin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-plugin.html#cfn-kafkaconnect-connector-plugin-customplugin
     */
    readonly customPlugin: CfnConnector.CustomPluginProperty | cdk.IResolvable;
  }

  /**
   * A plugin is an AWS resource that contains the code that defines a connector's logic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-customplugin.html
   */
  export interface CustomPluginProperty {
    /**
     * The Amazon Resource Name (ARN) of the custom plugin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-customplugin.html#cfn-kafkaconnect-connector-customplugin-custompluginarn
     */
    readonly customPluginArn: string;

    /**
     * The revision of the custom plugin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kafkaconnect-connector-customplugin.html#cfn-kafkaconnect-connector-customplugin-revision
     */
    readonly revision: number;
  }
}

/**
 * Properties for defining a `CfnConnector`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html
 */
export interface CfnConnectorProps {
  /**
   * The connector's compute capacity settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-capacity
   */
  readonly capacity: CfnConnector.CapacityProperty | cdk.IResolvable;

  /**
   * The configuration of the connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectorconfiguration
   */
  readonly connectorConfiguration: cdk.IResolvable | Record<string, string>;

  /**
   * The description of the connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectordescription
   */
  readonly connectorDescription?: string;

  /**
   * The name of the connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-connectorname
   */
  readonly connectorName: string;

  /**
   * The details of the Apache Kafka cluster to which the connector is connected.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkacluster
   */
  readonly kafkaCluster: cdk.IResolvable | CfnConnector.KafkaClusterProperty;

  /**
   * The type of client authentication used to connect to the Apache Kafka cluster.
   *
   * The value is NONE when no client authentication is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaclusterclientauthentication
   */
  readonly kafkaClusterClientAuthentication: cdk.IResolvable | CfnConnector.KafkaClusterClientAuthenticationProperty;

  /**
   * Details of encryption in transit to the Apache Kafka cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaclusterencryptionintransit
   */
  readonly kafkaClusterEncryptionInTransit: cdk.IResolvable | CfnConnector.KafkaClusterEncryptionInTransitProperty;

  /**
   * The version of Kafka Connect.
   *
   * It has to be compatible with both the Apache Kafka cluster's version and the plugins.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-kafkaconnectversion
   */
  readonly kafkaConnectVersion: string;

  /**
   * The settings for delivering connector logs to Amazon CloudWatch Logs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-logdelivery
   */
  readonly logDelivery?: cdk.IResolvable | CfnConnector.LogDeliveryProperty;

  /**
   * Specifies which plugin to use for the connector.
   *
   * You must specify a single-element list. Amazon MSK Connect does not currently support specifying multiple plugins.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-plugins
   */
  readonly plugins: Array<cdk.IResolvable | CfnConnector.PluginProperty> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the IAM role used by the connector to access Amazon Web Services resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-serviceexecutionrolearn
   */
  readonly serviceExecutionRoleArn: string;

  /**
   * The worker configurations that are in use with the connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kafkaconnect-connector.html#cfn-kafkaconnect-connector-workerconfiguration
   */
  readonly workerConfiguration?: cdk.IResolvable | CfnConnector.WorkerConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `VpcProperty`
 *
 * @param properties - the TypeScript properties of a `VpcProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorVpcPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroups", cdk.requiredValidator)(properties.securityGroups));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("subnets", cdk.requiredValidator)(properties.subnets));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  return errors.wrap("supplied properties not correct for \"VpcProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorVpcPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorVpcPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets)
  };
}

// @ts-ignore TS6133
function CfnConnectorVpcPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.VpcProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.VpcProperty>();
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApacheKafkaClusterProperty`
 *
 * @param properties - the TypeScript properties of a `ApacheKafkaClusterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorApacheKafkaClusterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bootstrapServers", cdk.requiredValidator)(properties.bootstrapServers));
  errors.collect(cdk.propertyValidator("bootstrapServers", cdk.validateString)(properties.bootstrapServers));
  errors.collect(cdk.propertyValidator("vpc", cdk.requiredValidator)(properties.vpc));
  errors.collect(cdk.propertyValidator("vpc", CfnConnectorVpcPropertyValidator)(properties.vpc));
  return errors.wrap("supplied properties not correct for \"ApacheKafkaClusterProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorApacheKafkaClusterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorApacheKafkaClusterPropertyValidator(properties).assertSuccess();
  return {
    "BootstrapServers": cdk.stringToCloudFormation(properties.bootstrapServers),
    "Vpc": convertCfnConnectorVpcPropertyToCloudFormation(properties.vpc)
  };
}

// @ts-ignore TS6133
function CfnConnectorApacheKafkaClusterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.ApacheKafkaClusterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.ApacheKafkaClusterProperty>();
  ret.addPropertyResult("bootstrapServers", "BootstrapServers", (properties.BootstrapServers != null ? cfn_parse.FromCloudFormation.getString(properties.BootstrapServers) : undefined));
  ret.addPropertyResult("vpc", "Vpc", (properties.Vpc != null ? CfnConnectorVpcPropertyFromCloudFormation(properties.Vpc) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KafkaClusterProperty`
 *
 * @param properties - the TypeScript properties of a `KafkaClusterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorKafkaClusterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apacheKafkaCluster", cdk.requiredValidator)(properties.apacheKafkaCluster));
  errors.collect(cdk.propertyValidator("apacheKafkaCluster", CfnConnectorApacheKafkaClusterPropertyValidator)(properties.apacheKafkaCluster));
  return errors.wrap("supplied properties not correct for \"KafkaClusterProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorKafkaClusterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorKafkaClusterPropertyValidator(properties).assertSuccess();
  return {
    "ApacheKafkaCluster": convertCfnConnectorApacheKafkaClusterPropertyToCloudFormation(properties.apacheKafkaCluster)
  };
}

// @ts-ignore TS6133
function CfnConnectorKafkaClusterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.KafkaClusterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.KafkaClusterProperty>();
  ret.addPropertyResult("apacheKafkaCluster", "ApacheKafkaCluster", (properties.ApacheKafkaCluster != null ? CfnConnectorApacheKafkaClusterPropertyFromCloudFormation(properties.ApacheKafkaCluster) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkerConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WorkerConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorWorkerConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("revision", cdk.requiredValidator)(properties.revision));
  errors.collect(cdk.propertyValidator("revision", cdk.validateNumber)(properties.revision));
  errors.collect(cdk.propertyValidator("workerConfigurationArn", cdk.requiredValidator)(properties.workerConfigurationArn));
  errors.collect(cdk.propertyValidator("workerConfigurationArn", cdk.validateString)(properties.workerConfigurationArn));
  return errors.wrap("supplied properties not correct for \"WorkerConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorWorkerConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorWorkerConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Revision": cdk.numberToCloudFormation(properties.revision),
    "WorkerConfigurationArn": cdk.stringToCloudFormation(properties.workerConfigurationArn)
  };
}

// @ts-ignore TS6133
function CfnConnectorWorkerConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.WorkerConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.WorkerConfigurationProperty>();
  ret.addPropertyResult("revision", "Revision", (properties.Revision != null ? cfn_parse.FromCloudFormation.getNumber(properties.Revision) : undefined));
  ret.addPropertyResult("workerConfigurationArn", "WorkerConfigurationArn", (properties.WorkerConfigurationArn != null ? cfn_parse.FromCloudFormation.getString(properties.WorkerConfigurationArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProvisionedCapacityProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedCapacityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProvisionedCapacityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mcuCount", cdk.validateNumber)(properties.mcuCount));
  errors.collect(cdk.propertyValidator("workerCount", cdk.requiredValidator)(properties.workerCount));
  errors.collect(cdk.propertyValidator("workerCount", cdk.validateNumber)(properties.workerCount));
  return errors.wrap("supplied properties not correct for \"ProvisionedCapacityProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProvisionedCapacityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProvisionedCapacityPropertyValidator(properties).assertSuccess();
  return {
    "McuCount": cdk.numberToCloudFormation(properties.mcuCount),
    "WorkerCount": cdk.numberToCloudFormation(properties.workerCount)
  };
}

// @ts-ignore TS6133
function CfnConnectorProvisionedCapacityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.ProvisionedCapacityProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.ProvisionedCapacityProperty>();
  ret.addPropertyResult("mcuCount", "McuCount", (properties.McuCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.McuCount) : undefined));
  ret.addPropertyResult("workerCount", "WorkerCount", (properties.WorkerCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.WorkerCount) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScaleOutPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ScaleOutPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorScaleOutPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cpuUtilizationPercentage", cdk.requiredValidator)(properties.cpuUtilizationPercentage));
  errors.collect(cdk.propertyValidator("cpuUtilizationPercentage", cdk.validateNumber)(properties.cpuUtilizationPercentage));
  return errors.wrap("supplied properties not correct for \"ScaleOutPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorScaleOutPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorScaleOutPolicyPropertyValidator(properties).assertSuccess();
  return {
    "CpuUtilizationPercentage": cdk.numberToCloudFormation(properties.cpuUtilizationPercentage)
  };
}

// @ts-ignore TS6133
function CfnConnectorScaleOutPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.ScaleOutPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.ScaleOutPolicyProperty>();
  ret.addPropertyResult("cpuUtilizationPercentage", "CpuUtilizationPercentage", (properties.CpuUtilizationPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.CpuUtilizationPercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScaleInPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ScaleInPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorScaleInPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cpuUtilizationPercentage", cdk.requiredValidator)(properties.cpuUtilizationPercentage));
  errors.collect(cdk.propertyValidator("cpuUtilizationPercentage", cdk.validateNumber)(properties.cpuUtilizationPercentage));
  return errors.wrap("supplied properties not correct for \"ScaleInPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorScaleInPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorScaleInPolicyPropertyValidator(properties).assertSuccess();
  return {
    "CpuUtilizationPercentage": cdk.numberToCloudFormation(properties.cpuUtilizationPercentage)
  };
}

// @ts-ignore TS6133
function CfnConnectorScaleInPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.ScaleInPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.ScaleInPolicyProperty>();
  ret.addPropertyResult("cpuUtilizationPercentage", "CpuUtilizationPercentage", (properties.CpuUtilizationPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.CpuUtilizationPercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoScalingProperty`
 *
 * @param properties - the TypeScript properties of a `AutoScalingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorAutoScalingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxWorkerCount", cdk.requiredValidator)(properties.maxWorkerCount));
  errors.collect(cdk.propertyValidator("maxWorkerCount", cdk.validateNumber)(properties.maxWorkerCount));
  errors.collect(cdk.propertyValidator("mcuCount", cdk.requiredValidator)(properties.mcuCount));
  errors.collect(cdk.propertyValidator("mcuCount", cdk.validateNumber)(properties.mcuCount));
  errors.collect(cdk.propertyValidator("minWorkerCount", cdk.requiredValidator)(properties.minWorkerCount));
  errors.collect(cdk.propertyValidator("minWorkerCount", cdk.validateNumber)(properties.minWorkerCount));
  errors.collect(cdk.propertyValidator("scaleInPolicy", cdk.requiredValidator)(properties.scaleInPolicy));
  errors.collect(cdk.propertyValidator("scaleInPolicy", CfnConnectorScaleInPolicyPropertyValidator)(properties.scaleInPolicy));
  errors.collect(cdk.propertyValidator("scaleOutPolicy", cdk.requiredValidator)(properties.scaleOutPolicy));
  errors.collect(cdk.propertyValidator("scaleOutPolicy", CfnConnectorScaleOutPolicyPropertyValidator)(properties.scaleOutPolicy));
  return errors.wrap("supplied properties not correct for \"AutoScalingProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorAutoScalingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorAutoScalingPropertyValidator(properties).assertSuccess();
  return {
    "MaxWorkerCount": cdk.numberToCloudFormation(properties.maxWorkerCount),
    "McuCount": cdk.numberToCloudFormation(properties.mcuCount),
    "MinWorkerCount": cdk.numberToCloudFormation(properties.minWorkerCount),
    "ScaleInPolicy": convertCfnConnectorScaleInPolicyPropertyToCloudFormation(properties.scaleInPolicy),
    "ScaleOutPolicy": convertCfnConnectorScaleOutPolicyPropertyToCloudFormation(properties.scaleOutPolicy)
  };
}

// @ts-ignore TS6133
function CfnConnectorAutoScalingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.AutoScalingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.AutoScalingProperty>();
  ret.addPropertyResult("maxWorkerCount", "MaxWorkerCount", (properties.MaxWorkerCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxWorkerCount) : undefined));
  ret.addPropertyResult("mcuCount", "McuCount", (properties.McuCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.McuCount) : undefined));
  ret.addPropertyResult("minWorkerCount", "MinWorkerCount", (properties.MinWorkerCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinWorkerCount) : undefined));
  ret.addPropertyResult("scaleInPolicy", "ScaleInPolicy", (properties.ScaleInPolicy != null ? CfnConnectorScaleInPolicyPropertyFromCloudFormation(properties.ScaleInPolicy) : undefined));
  ret.addPropertyResult("scaleOutPolicy", "ScaleOutPolicy", (properties.ScaleOutPolicy != null ? CfnConnectorScaleOutPolicyPropertyFromCloudFormation(properties.ScaleOutPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CapacityProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorCapacityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoScaling", CfnConnectorAutoScalingPropertyValidator)(properties.autoScaling));
  errors.collect(cdk.propertyValidator("provisionedCapacity", CfnConnectorProvisionedCapacityPropertyValidator)(properties.provisionedCapacity));
  return errors.wrap("supplied properties not correct for \"CapacityProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorCapacityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorCapacityPropertyValidator(properties).assertSuccess();
  return {
    "AutoScaling": convertCfnConnectorAutoScalingPropertyToCloudFormation(properties.autoScaling),
    "ProvisionedCapacity": convertCfnConnectorProvisionedCapacityPropertyToCloudFormation(properties.provisionedCapacity)
  };
}

// @ts-ignore TS6133
function CfnConnectorCapacityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.CapacityProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.CapacityProperty>();
  ret.addPropertyResult("autoScaling", "AutoScaling", (properties.AutoScaling != null ? CfnConnectorAutoScalingPropertyFromCloudFormation(properties.AutoScaling) : undefined));
  ret.addPropertyResult("provisionedCapacity", "ProvisionedCapacity", (properties.ProvisionedCapacity != null ? CfnConnectorProvisionedCapacityPropertyFromCloudFormation(properties.ProvisionedCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KafkaClusterEncryptionInTransitProperty`
 *
 * @param properties - the TypeScript properties of a `KafkaClusterEncryptionInTransitProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorKafkaClusterEncryptionInTransitPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionType", cdk.requiredValidator)(properties.encryptionType));
  errors.collect(cdk.propertyValidator("encryptionType", cdk.validateString)(properties.encryptionType));
  return errors.wrap("supplied properties not correct for \"KafkaClusterEncryptionInTransitProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorKafkaClusterEncryptionInTransitPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorKafkaClusterEncryptionInTransitPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionType": cdk.stringToCloudFormation(properties.encryptionType)
  };
}

// @ts-ignore TS6133
function CfnConnectorKafkaClusterEncryptionInTransitPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.KafkaClusterEncryptionInTransitProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.KafkaClusterEncryptionInTransitProperty>();
  ret.addPropertyResult("encryptionType", "EncryptionType", (properties.EncryptionType != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KafkaClusterClientAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `KafkaClusterClientAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorKafkaClusterClientAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationType", cdk.requiredValidator)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("authenticationType", cdk.validateString)(properties.authenticationType));
  return errors.wrap("supplied properties not correct for \"KafkaClusterClientAuthenticationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorKafkaClusterClientAuthenticationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorKafkaClusterClientAuthenticationPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticationType": cdk.stringToCloudFormation(properties.authenticationType)
  };
}

// @ts-ignore TS6133
function CfnConnectorKafkaClusterClientAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.KafkaClusterClientAuthenticationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.KafkaClusterClientAuthenticationProperty>();
  ret.addPropertyResult("authenticationType", "AuthenticationType", (properties.AuthenticationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3LogDeliveryProperty`
 *
 * @param properties - the TypeScript properties of a `S3LogDeliveryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorS3LogDeliveryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"S3LogDeliveryProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorS3LogDeliveryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorS3LogDeliveryPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnConnectorS3LogDeliveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.S3LogDeliveryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.S3LogDeliveryProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FirehoseLogDeliveryProperty`
 *
 * @param properties - the TypeScript properties of a `FirehoseLogDeliveryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorFirehoseLogDeliveryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryStream", cdk.validateString)(properties.deliveryStream));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"FirehoseLogDeliveryProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorFirehoseLogDeliveryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorFirehoseLogDeliveryPropertyValidator(properties).assertSuccess();
  return {
    "DeliveryStream": cdk.stringToCloudFormation(properties.deliveryStream),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnConnectorFirehoseLogDeliveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.FirehoseLogDeliveryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.FirehoseLogDeliveryProperty>();
  ret.addPropertyResult("deliveryStream", "DeliveryStream", (properties.DeliveryStream != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStream) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsLogDeliveryProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsLogDeliveryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorCloudWatchLogsLogDeliveryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("logGroup", cdk.validateString)(properties.logGroup));
  return errors.wrap("supplied properties not correct for \"CloudWatchLogsLogDeliveryProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorCloudWatchLogsLogDeliveryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorCloudWatchLogsLogDeliveryPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "LogGroup": cdk.stringToCloudFormation(properties.logGroup)
  };
}

// @ts-ignore TS6133
function CfnConnectorCloudWatchLogsLogDeliveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.CloudWatchLogsLogDeliveryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.CloudWatchLogsLogDeliveryProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("logGroup", "LogGroup", (properties.LogGroup != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkerLogDeliveryProperty`
 *
 * @param properties - the TypeScript properties of a `WorkerLogDeliveryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorWorkerLogDeliveryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogs", CfnConnectorCloudWatchLogsLogDeliveryPropertyValidator)(properties.cloudWatchLogs));
  errors.collect(cdk.propertyValidator("firehose", CfnConnectorFirehoseLogDeliveryPropertyValidator)(properties.firehose));
  errors.collect(cdk.propertyValidator("s3", CfnConnectorS3LogDeliveryPropertyValidator)(properties.s3));
  return errors.wrap("supplied properties not correct for \"WorkerLogDeliveryProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorWorkerLogDeliveryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorWorkerLogDeliveryPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogs": convertCfnConnectorCloudWatchLogsLogDeliveryPropertyToCloudFormation(properties.cloudWatchLogs),
    "Firehose": convertCfnConnectorFirehoseLogDeliveryPropertyToCloudFormation(properties.firehose),
    "S3": convertCfnConnectorS3LogDeliveryPropertyToCloudFormation(properties.s3)
  };
}

// @ts-ignore TS6133
function CfnConnectorWorkerLogDeliveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.WorkerLogDeliveryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.WorkerLogDeliveryProperty>();
  ret.addPropertyResult("cloudWatchLogs", "CloudWatchLogs", (properties.CloudWatchLogs != null ? CfnConnectorCloudWatchLogsLogDeliveryPropertyFromCloudFormation(properties.CloudWatchLogs) : undefined));
  ret.addPropertyResult("firehose", "Firehose", (properties.Firehose != null ? CfnConnectorFirehoseLogDeliveryPropertyFromCloudFormation(properties.Firehose) : undefined));
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnConnectorS3LogDeliveryPropertyFromCloudFormation(properties.S3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogDeliveryProperty`
 *
 * @param properties - the TypeScript properties of a `LogDeliveryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorLogDeliveryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("workerLogDelivery", cdk.requiredValidator)(properties.workerLogDelivery));
  errors.collect(cdk.propertyValidator("workerLogDelivery", CfnConnectorWorkerLogDeliveryPropertyValidator)(properties.workerLogDelivery));
  return errors.wrap("supplied properties not correct for \"LogDeliveryProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorLogDeliveryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorLogDeliveryPropertyValidator(properties).assertSuccess();
  return {
    "WorkerLogDelivery": convertCfnConnectorWorkerLogDeliveryPropertyToCloudFormation(properties.workerLogDelivery)
  };
}

// @ts-ignore TS6133
function CfnConnectorLogDeliveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.LogDeliveryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.LogDeliveryProperty>();
  ret.addPropertyResult("workerLogDelivery", "WorkerLogDelivery", (properties.WorkerLogDelivery != null ? CfnConnectorWorkerLogDeliveryPropertyFromCloudFormation(properties.WorkerLogDelivery) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomPluginProperty`
 *
 * @param properties - the TypeScript properties of a `CustomPluginProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorCustomPluginPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customPluginArn", cdk.requiredValidator)(properties.customPluginArn));
  errors.collect(cdk.propertyValidator("customPluginArn", cdk.validateString)(properties.customPluginArn));
  errors.collect(cdk.propertyValidator("revision", cdk.requiredValidator)(properties.revision));
  errors.collect(cdk.propertyValidator("revision", cdk.validateNumber)(properties.revision));
  return errors.wrap("supplied properties not correct for \"CustomPluginProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorCustomPluginPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorCustomPluginPropertyValidator(properties).assertSuccess();
  return {
    "CustomPluginArn": cdk.stringToCloudFormation(properties.customPluginArn),
    "Revision": cdk.numberToCloudFormation(properties.revision)
  };
}

// @ts-ignore TS6133
function CfnConnectorCustomPluginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.CustomPluginProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.CustomPluginProperty>();
  ret.addPropertyResult("customPluginArn", "CustomPluginArn", (properties.CustomPluginArn != null ? cfn_parse.FromCloudFormation.getString(properties.CustomPluginArn) : undefined));
  ret.addPropertyResult("revision", "Revision", (properties.Revision != null ? cfn_parse.FromCloudFormation.getNumber(properties.Revision) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PluginProperty`
 *
 * @param properties - the TypeScript properties of a `PluginProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorPluginPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customPlugin", cdk.requiredValidator)(properties.customPlugin));
  errors.collect(cdk.propertyValidator("customPlugin", CfnConnectorCustomPluginPropertyValidator)(properties.customPlugin));
  return errors.wrap("supplied properties not correct for \"PluginProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorPluginPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorPluginPropertyValidator(properties).assertSuccess();
  return {
    "CustomPlugin": convertCfnConnectorCustomPluginPropertyToCloudFormation(properties.customPlugin)
  };
}

// @ts-ignore TS6133
function CfnConnectorPluginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.PluginProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.PluginProperty>();
  ret.addPropertyResult("customPlugin", "CustomPlugin", (properties.CustomPlugin != null ? CfnConnectorCustomPluginPropertyFromCloudFormation(properties.CustomPlugin) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacity", cdk.requiredValidator)(properties.capacity));
  errors.collect(cdk.propertyValidator("capacity", CfnConnectorCapacityPropertyValidator)(properties.capacity));
  errors.collect(cdk.propertyValidator("connectorConfiguration", cdk.requiredValidator)(properties.connectorConfiguration));
  errors.collect(cdk.propertyValidator("connectorConfiguration", cdk.hashValidator(cdk.validateString))(properties.connectorConfiguration));
  errors.collect(cdk.propertyValidator("connectorDescription", cdk.validateString)(properties.connectorDescription));
  errors.collect(cdk.propertyValidator("connectorName", cdk.requiredValidator)(properties.connectorName));
  errors.collect(cdk.propertyValidator("connectorName", cdk.validateString)(properties.connectorName));
  errors.collect(cdk.propertyValidator("kafkaCluster", cdk.requiredValidator)(properties.kafkaCluster));
  errors.collect(cdk.propertyValidator("kafkaCluster", CfnConnectorKafkaClusterPropertyValidator)(properties.kafkaCluster));
  errors.collect(cdk.propertyValidator("kafkaClusterClientAuthentication", cdk.requiredValidator)(properties.kafkaClusterClientAuthentication));
  errors.collect(cdk.propertyValidator("kafkaClusterClientAuthentication", CfnConnectorKafkaClusterClientAuthenticationPropertyValidator)(properties.kafkaClusterClientAuthentication));
  errors.collect(cdk.propertyValidator("kafkaClusterEncryptionInTransit", cdk.requiredValidator)(properties.kafkaClusterEncryptionInTransit));
  errors.collect(cdk.propertyValidator("kafkaClusterEncryptionInTransit", CfnConnectorKafkaClusterEncryptionInTransitPropertyValidator)(properties.kafkaClusterEncryptionInTransit));
  errors.collect(cdk.propertyValidator("kafkaConnectVersion", cdk.requiredValidator)(properties.kafkaConnectVersion));
  errors.collect(cdk.propertyValidator("kafkaConnectVersion", cdk.validateString)(properties.kafkaConnectVersion));
  errors.collect(cdk.propertyValidator("logDelivery", CfnConnectorLogDeliveryPropertyValidator)(properties.logDelivery));
  errors.collect(cdk.propertyValidator("plugins", cdk.requiredValidator)(properties.plugins));
  errors.collect(cdk.propertyValidator("plugins", cdk.listValidator(CfnConnectorPluginPropertyValidator))(properties.plugins));
  errors.collect(cdk.propertyValidator("serviceExecutionRoleArn", cdk.requiredValidator)(properties.serviceExecutionRoleArn));
  errors.collect(cdk.propertyValidator("serviceExecutionRoleArn", cdk.validateString)(properties.serviceExecutionRoleArn));
  errors.collect(cdk.propertyValidator("workerConfiguration", CfnConnectorWorkerConfigurationPropertyValidator)(properties.workerConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnConnectorProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorPropsValidator(properties).assertSuccess();
  return {
    "Capacity": convertCfnConnectorCapacityPropertyToCloudFormation(properties.capacity),
    "ConnectorConfiguration": cdk.hashMapper(cdk.stringToCloudFormation)(properties.connectorConfiguration),
    "ConnectorDescription": cdk.stringToCloudFormation(properties.connectorDescription),
    "ConnectorName": cdk.stringToCloudFormation(properties.connectorName),
    "KafkaCluster": convertCfnConnectorKafkaClusterPropertyToCloudFormation(properties.kafkaCluster),
    "KafkaClusterClientAuthentication": convertCfnConnectorKafkaClusterClientAuthenticationPropertyToCloudFormation(properties.kafkaClusterClientAuthentication),
    "KafkaClusterEncryptionInTransit": convertCfnConnectorKafkaClusterEncryptionInTransitPropertyToCloudFormation(properties.kafkaClusterEncryptionInTransit),
    "KafkaConnectVersion": cdk.stringToCloudFormation(properties.kafkaConnectVersion),
    "LogDelivery": convertCfnConnectorLogDeliveryPropertyToCloudFormation(properties.logDelivery),
    "Plugins": cdk.listMapper(convertCfnConnectorPluginPropertyToCloudFormation)(properties.plugins),
    "ServiceExecutionRoleArn": cdk.stringToCloudFormation(properties.serviceExecutionRoleArn),
    "WorkerConfiguration": convertCfnConnectorWorkerConfigurationPropertyToCloudFormation(properties.workerConfiguration)
  };
}

// @ts-ignore TS6133
function CfnConnectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProps>();
  ret.addPropertyResult("capacity", "Capacity", (properties.Capacity != null ? CfnConnectorCapacityPropertyFromCloudFormation(properties.Capacity) : undefined));
  ret.addPropertyResult("connectorConfiguration", "ConnectorConfiguration", (properties.ConnectorConfiguration != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ConnectorConfiguration) : undefined));
  ret.addPropertyResult("connectorDescription", "ConnectorDescription", (properties.ConnectorDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorDescription) : undefined));
  ret.addPropertyResult("connectorName", "ConnectorName", (properties.ConnectorName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorName) : undefined));
  ret.addPropertyResult("kafkaCluster", "KafkaCluster", (properties.KafkaCluster != null ? CfnConnectorKafkaClusterPropertyFromCloudFormation(properties.KafkaCluster) : undefined));
  ret.addPropertyResult("kafkaClusterClientAuthentication", "KafkaClusterClientAuthentication", (properties.KafkaClusterClientAuthentication != null ? CfnConnectorKafkaClusterClientAuthenticationPropertyFromCloudFormation(properties.KafkaClusterClientAuthentication) : undefined));
  ret.addPropertyResult("kafkaClusterEncryptionInTransit", "KafkaClusterEncryptionInTransit", (properties.KafkaClusterEncryptionInTransit != null ? CfnConnectorKafkaClusterEncryptionInTransitPropertyFromCloudFormation(properties.KafkaClusterEncryptionInTransit) : undefined));
  ret.addPropertyResult("kafkaConnectVersion", "KafkaConnectVersion", (properties.KafkaConnectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.KafkaConnectVersion) : undefined));
  ret.addPropertyResult("logDelivery", "LogDelivery", (properties.LogDelivery != null ? CfnConnectorLogDeliveryPropertyFromCloudFormation(properties.LogDelivery) : undefined));
  ret.addPropertyResult("plugins", "Plugins", (properties.Plugins != null ? cfn_parse.FromCloudFormation.getArray(CfnConnectorPluginPropertyFromCloudFormation)(properties.Plugins) : undefined));
  ret.addPropertyResult("serviceExecutionRoleArn", "ServiceExecutionRoleArn", (properties.ServiceExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceExecutionRoleArn) : undefined));
  ret.addPropertyResult("workerConfiguration", "WorkerConfiguration", (properties.WorkerConfiguration != null ? CfnConnectorWorkerConfigurationPropertyFromCloudFormation(properties.WorkerConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}