/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-batchscramsecret.html.
 *
 * @cloudformationResource AWS::MSK::BatchScramSecret
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-batchscramsecret.html
 */
export class CfnBatchScramSecret extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MSK::BatchScramSecret";

  /**
   * Build a CfnBatchScramSecret from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBatchScramSecret {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBatchScramSecretPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBatchScramSecret(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  public clusterArn: string;

  public secretArnList?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBatchScramSecretProps) {
    super(scope, id, {
      "type": CfnBatchScramSecret.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clusterArn", this);

    this.clusterArn = props.clusterArn;
    this.secretArnList = props.secretArnList;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clusterArn": this.clusterArn,
      "secretArnList": this.secretArnList
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBatchScramSecret.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBatchScramSecretPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnBatchScramSecret`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-batchscramsecret.html
 */
export interface CfnBatchScramSecretProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-batchscramsecret.html#cfn-msk-batchscramsecret-clusterarn
   */
  readonly clusterArn: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-batchscramsecret.html#cfn-msk-batchscramsecret-secretarnlist
   */
  readonly secretArnList?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnBatchScramSecretProps`
 *
 * @param properties - the TypeScript properties of a `CfnBatchScramSecretProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBatchScramSecretPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterArn", cdk.requiredValidator)(properties.clusterArn));
  errors.collect(cdk.propertyValidator("clusterArn", cdk.validateString)(properties.clusterArn));
  errors.collect(cdk.propertyValidator("secretArnList", cdk.listValidator(cdk.validateString))(properties.secretArnList));
  return errors.wrap("supplied properties not correct for \"CfnBatchScramSecretProps\"");
}

// @ts-ignore TS6133
function convertCfnBatchScramSecretPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBatchScramSecretPropsValidator(properties).assertSuccess();
  return {
    "ClusterArn": cdk.stringToCloudFormation(properties.clusterArn),
    "SecretArnList": cdk.listMapper(cdk.stringToCloudFormation)(properties.secretArnList)
  };
}

// @ts-ignore TS6133
function CfnBatchScramSecretPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBatchScramSecretProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBatchScramSecretProps>();
  ret.addPropertyResult("clusterArn", "ClusterArn", (properties.ClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterArn) : undefined));
  ret.addPropertyResult("secretArnList", "SecretArnList", (properties.SecretArnList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecretArnList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new MSK cluster.
 *
 * The following Python 3.6 examples shows how you can create a cluster that's distributed over two Availability Zones. Before you run this Python script, replace the example subnet and security-group IDs with the IDs of your subnets and security group. When you create an MSK cluster, its brokers get evenly distributed over a number of Availability Zones that's equal to the number of subnets that you specify in the `BrokerNodeGroupInfo` parameter. In this example, you can add a third subnet to get a cluster that's distributed over three Availability Zones.
 *
 * ```PYTHON
 * import boto3 client = boto3.client('kafka') response = client.create_cluster( BrokerNodeGroupInfo={ 'BrokerAZDistribution': 'DEFAULT', 'ClientSubnets': [ 'subnet-012345678901fedcba', 'subnet-9876543210abcdef01' ], 'InstanceType': 'kafka.m5.large', 'SecurityGroups': [ 'sg-012345abcdef789789' ] }, ClusterName='SalesCluster', EncryptionInfo={ 'EncryptionInTransit': { 'ClientBroker': 'TLS_PLAINTEXT', 'InCluster': True } }, EnhancedMonitoring='PER_TOPIC_PER_BROKER', KafkaVersion='2.2.1', NumberOfBrokerNodes=2
 * ) print(response)
 * ```
 *
 * @cloudformationResource AWS::MSK::Cluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MSK::Cluster";

  /**
   * Build a CfnCluster from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCluster {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClusterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCluster(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Information about the broker nodes in the cluster.
   */
  public brokerNodeGroupInfo: CfnCluster.BrokerNodeGroupInfoProperty | cdk.IResolvable;

  /**
   * VPC connection control settings for brokers.
   */
  public clientAuthentication?: CfnCluster.ClientAuthenticationProperty | cdk.IResolvable;

  /**
   * The name of the cluster.
   */
  public clusterName: string;

  /**
   * Represents the configuration that you want MSK to use for the cluster.
   */
  public configurationInfo?: CfnCluster.ConfigurationInfoProperty | cdk.IResolvable;

  /**
   * The version of the cluster that you want to update.
   */
  public currentVersion?: string;

  /**
   * Includes all encryption-related information.
   */
  public encryptionInfo?: CfnCluster.EncryptionInfoProperty | cdk.IResolvable;

  /**
   * Specifies the level of monitoring for the MSK cluster.
   */
  public enhancedMonitoring?: string;

  /**
   * The version of Apache Kafka.
   */
  public kafkaVersion: string;

  /**
   * Logging Info details.
   */
  public loggingInfo?: cdk.IResolvable | CfnCluster.LoggingInfoProperty;

  /**
   * The number of broker nodes in the cluster.
   */
  public numberOfBrokerNodes: number;

  /**
   * The settings for open monitoring.
   */
  public openMonitoring?: cdk.IResolvable | CfnCluster.OpenMonitoringProperty;

  /**
   * This controls storage mode for supported storage tiers.
   */
  public storageMode?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Create tags when creating the cluster.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClusterProps) {
    super(scope, id, {
      "type": CfnCluster.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "brokerNodeGroupInfo", this);
    cdk.requireProperty(props, "clusterName", this);
    cdk.requireProperty(props, "kafkaVersion", this);
    cdk.requireProperty(props, "numberOfBrokerNodes", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.brokerNodeGroupInfo = props.brokerNodeGroupInfo;
    this.clientAuthentication = props.clientAuthentication;
    this.clusterName = props.clusterName;
    this.configurationInfo = props.configurationInfo;
    this.currentVersion = props.currentVersion;
    this.encryptionInfo = props.encryptionInfo;
    this.enhancedMonitoring = props.enhancedMonitoring;
    this.kafkaVersion = props.kafkaVersion;
    this.loggingInfo = props.loggingInfo;
    this.numberOfBrokerNodes = props.numberOfBrokerNodes;
    this.openMonitoring = props.openMonitoring;
    this.storageMode = props.storageMode;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::MSK::Cluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "brokerNodeGroupInfo": this.brokerNodeGroupInfo,
      "clientAuthentication": this.clientAuthentication,
      "clusterName": this.clusterName,
      "configurationInfo": this.configurationInfo,
      "currentVersion": this.currentVersion,
      "encryptionInfo": this.encryptionInfo,
      "enhancedMonitoring": this.enhancedMonitoring,
      "kafkaVersion": this.kafkaVersion,
      "loggingInfo": this.loggingInfo,
      "numberOfBrokerNodes": this.numberOfBrokerNodes,
      "openMonitoring": this.openMonitoring,
      "storageMode": this.storageMode,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCluster.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClusterPropsToCloudFormation(props);
  }
}

export namespace CfnCluster {
  /**
   * Includes encryption-related information, such as the Amazon KMS key used for encrypting data at rest and whether you want MSK to encrypt your data in transit.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-encryptioninfo.html
   */
  export interface EncryptionInfoProperty {
    /**
     * The data-volume encryption details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-encryptioninfo.html#cfn-msk-cluster-encryptioninfo-encryptionatrest
     */
    readonly encryptionAtRest?: CfnCluster.EncryptionAtRestProperty | cdk.IResolvable;

    /**
     * The details for encryption in transit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-encryptioninfo.html#cfn-msk-cluster-encryptioninfo-encryptionintransit
     */
    readonly encryptionInTransit?: CfnCluster.EncryptionInTransitProperty | cdk.IResolvable;
  }

  /**
   * The data-volume encryption details.
   *
   * You can't update encryption at rest settings for existing clusters.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-encryptionatrest.html
   */
  export interface EncryptionAtRestProperty {
    /**
     * The Amazon Resource Name (ARN) of the Amazon KMS key for encrypting data at rest.
     *
     * If you don't specify a KMS key, MSK creates one for you and uses it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-encryptionatrest.html#cfn-msk-cluster-encryptionatrest-datavolumekmskeyid
     */
    readonly dataVolumeKmsKeyId: string;
  }

  /**
   * The settings for encrypting data in transit.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-encryptionintransit.html
   */
  export interface EncryptionInTransitProperty {
    /**
     * Indicates the encryption setting for data in transit between clients and brokers.
     *
     * You must set it to one of the following values.
     *
     * `TLS` means that client-broker communication is enabled with TLS only.
     *
     * `TLS_PLAINTEXT` means that client-broker communication is enabled for both TLS-encrypted, as well as plaintext data.
     *
     * `PLAINTEXT` means that client-broker communication is enabled in plaintext only.
     *
     * The default value is `TLS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-encryptionintransit.html#cfn-msk-cluster-encryptionintransit-clientbroker
     */
    readonly clientBroker?: string;

    /**
     * When set to true, it indicates that data communication among the broker nodes of the cluster is encrypted.
     *
     * When set to false, the communication happens in plaintext.
     *
     * The default value is true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-encryptionintransit.html#cfn-msk-cluster-encryptionintransit-incluster
     */
    readonly inCluster?: boolean | cdk.IResolvable;
  }

  /**
   * JMX and Node monitoring for the MSK cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-openmonitoring.html
   */
  export interface OpenMonitoringProperty {
    /**
     * Prometheus exporter settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-openmonitoring.html#cfn-msk-cluster-openmonitoring-prometheus
     */
    readonly prometheus: cdk.IResolvable | CfnCluster.PrometheusProperty;
  }

  /**
   * Prometheus settings for open monitoring.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-prometheus.html
   */
  export interface PrometheusProperty {
    /**
     * Indicates whether you want to enable or disable the JMX Exporter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-prometheus.html#cfn-msk-cluster-prometheus-jmxexporter
     */
    readonly jmxExporter?: cdk.IResolvable | CfnCluster.JmxExporterProperty;

    /**
     * Indicates whether you want to enable or disable the Node Exporter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-prometheus.html#cfn-msk-cluster-prometheus-nodeexporter
     */
    readonly nodeExporter?: cdk.IResolvable | CfnCluster.NodeExporterProperty;
  }

  /**
   * Indicates whether you want to enable or disable the JMX Exporter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-jmxexporter.html
   */
  export interface JmxExporterProperty {
    /**
     * Indicates whether you want to enable or disable the JMX Exporter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-jmxexporter.html#cfn-msk-cluster-jmxexporter-enabledinbroker
     */
    readonly enabledInBroker: boolean | cdk.IResolvable;
  }

  /**
   * Indicates whether you want to enable or disable the Node Exporter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-nodeexporter.html
   */
  export interface NodeExporterProperty {
    /**
     * Indicates whether you want to enable or disable the Node Exporter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-nodeexporter.html#cfn-msk-cluster-nodeexporter-enabledinbroker
     */
    readonly enabledInBroker: boolean | cdk.IResolvable;
  }

  /**
   * Specifies the configuration to use for the brokers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-configurationinfo.html
   */
  export interface ConfigurationInfoProperty {
    /**
     * ARN of the configuration to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-configurationinfo.html#cfn-msk-cluster-configurationinfo-arn
     */
    readonly arn: string;

    /**
     * The revision of the configuration to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-configurationinfo.html#cfn-msk-cluster-configurationinfo-revision
     */
    readonly revision: number;
  }

  /**
   * Describes the setup to be used for the broker nodes in the cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-brokernodegroupinfo.html
   */
  export interface BrokerNodeGroupInfoProperty {
    /**
     * This parameter is currently not in use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-brokernodegroupinfo.html#cfn-msk-cluster-brokernodegroupinfo-brokerazdistribution
     */
    readonly brokerAzDistribution?: string;

    /**
     * The list of subnets to connect to in the client virtual private cloud (VPC).
     *
     * Amazon creates elastic network interfaces inside these subnets. Client applications use elastic network interfaces to produce and consume data.
     *
     * If you use the US West (N. California) Region, specify exactly two subnets. For other Regions where Amazon MSK is available, you can specify either two or three subnets. The subnets that you specify must be in distinct Availability Zones. When you create a cluster, Amazon MSK distributes the broker nodes evenly across the subnets that you specify.
     *
     * Client subnets can't occupy the Availability Zone with ID `use1-az3` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-brokernodegroupinfo.html#cfn-msk-cluster-brokernodegroupinfo-clientsubnets
     */
    readonly clientSubnets: Array<string>;

    /**
     * Information about the cluster's connectivity setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-brokernodegroupinfo.html#cfn-msk-cluster-brokernodegroupinfo-connectivityinfo
     */
    readonly connectivityInfo?: CfnCluster.ConnectivityInfoProperty | cdk.IResolvable;

    /**
     * The type of Amazon EC2 instances to use for brokers.
     *
     * The following instance types are allowed: kafka.m5.large, kafka.m5.xlarge, kafka.m5.2xlarge, kafka.m5.4xlarge, kafka.m5.8xlarge, kafka.m5.12xlarge, kafka.m5.16xlarge, kafka.m5.24xlarge, and kafka.t3.small.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-brokernodegroupinfo.html#cfn-msk-cluster-brokernodegroupinfo-instancetype
     */
    readonly instanceType: string;

    /**
     * The security groups to associate with the elastic network interfaces in order to specify who can connect to and communicate with the Amazon MSK cluster.
     *
     * If you don't specify a security group, Amazon MSK uses the default security group associated with the VPC. If you specify security groups that were shared with you, you must ensure that you have permissions to them. Specifically, you need the `ec2:DescribeSecurityGroups` permission.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-brokernodegroupinfo.html#cfn-msk-cluster-brokernodegroupinfo-securitygroups
     */
    readonly securityGroups?: Array<string>;

    /**
     * Contains information about storage volumes attached to Amazon MSK broker nodes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-brokernodegroupinfo.html#cfn-msk-cluster-brokernodegroupinfo-storageinfo
     */
    readonly storageInfo?: cdk.IResolvable | CfnCluster.StorageInfoProperty;
  }

  /**
   * Broker access controls.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-connectivityinfo.html
   */
  export interface ConnectivityInfoProperty {
    /**
     * Access control settings for the cluster's brokers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-connectivityinfo.html#cfn-msk-cluster-connectivityinfo-publicaccess
     */
    readonly publicAccess?: cdk.IResolvable | CfnCluster.PublicAccessProperty;

    /**
     * VPC connection control settings for brokers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-connectivityinfo.html#cfn-msk-cluster-connectivityinfo-vpcconnectivity
     */
    readonly vpcConnectivity?: cdk.IResolvable | CfnCluster.VpcConnectivityProperty;
  }

  /**
   * VPC connection control settings for brokers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivity.html
   */
  export interface VpcConnectivityProperty {
    /**
     * VPC connection control settings for brokers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivity.html#cfn-msk-cluster-vpcconnectivity-clientauthentication
     */
    readonly clientAuthentication?: cdk.IResolvable | CfnCluster.VpcConnectivityClientAuthenticationProperty;
  }

  /**
   * Includes all client authentication information for VpcConnectivity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivityclientauthentication.html
   */
  export interface VpcConnectivityClientAuthenticationProperty {
    /**
     * Details for VpcConnectivity ClientAuthentication using SASL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivityclientauthentication.html#cfn-msk-cluster-vpcconnectivityclientauthentication-sasl
     */
    readonly sasl?: cdk.IResolvable | CfnCluster.VpcConnectivitySaslProperty;

    /**
     * Details for VpcConnectivity ClientAuthentication using TLS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivityclientauthentication.html#cfn-msk-cluster-vpcconnectivityclientauthentication-tls
     */
    readonly tls?: cdk.IResolvable | CfnCluster.VpcConnectivityTlsProperty;
  }

  /**
   * Details for client authentication using SASL for VpcConnectivity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivitysasl.html
   */
  export interface VpcConnectivitySaslProperty {
    /**
     * Details for ClientAuthentication using IAM for VpcConnectivity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivitysasl.html#cfn-msk-cluster-vpcconnectivitysasl-iam
     */
    readonly iam?: cdk.IResolvable | CfnCluster.VpcConnectivityIamProperty;

    /**
     * Details for SASL/SCRAM client authentication for VpcConnectivity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivitysasl.html#cfn-msk-cluster-vpcconnectivitysasl-scram
     */
    readonly scram?: cdk.IResolvable | CfnCluster.VpcConnectivityScramProperty;
  }

  /**
   * Details for SASL/IAM client authentication for VpcConnectivity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivityiam.html
   */
  export interface VpcConnectivityIamProperty {
    /**
     * SASL/IAM authentication is enabled or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivityiam.html#cfn-msk-cluster-vpcconnectivityiam-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Details for SASL/SCRAM client authentication for vpcConnectivity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivityscram.html
   */
  export interface VpcConnectivityScramProperty {
    /**
     * SASL/SCRAM authentication is enabled or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivityscram.html#cfn-msk-cluster-vpcconnectivityscram-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Details for client authentication using TLS for vpcConnectivity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivitytls.html
   */
  export interface VpcConnectivityTlsProperty {
    /**
     * TLS authentication is enabled or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-vpcconnectivitytls.html#cfn-msk-cluster-vpcconnectivitytls-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Broker access controls.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-publicaccess.html
   */
  export interface PublicAccessProperty {
    /**
     * DISABLED means that public access is turned off.
     *
     * SERVICE_PROVIDED_EIPS means that public access is turned on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-publicaccess.html#cfn-msk-cluster-publicaccess-type
     */
    readonly type?: string;
  }

  /**
   * Contains information about storage volumes attached to Amazon MSK broker nodes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-storageinfo.html
   */
  export interface StorageInfoProperty {
    /**
     * EBS volume information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-storageinfo.html#cfn-msk-cluster-storageinfo-ebsstorageinfo
     */
    readonly ebsStorageInfo?: CfnCluster.EBSStorageInfoProperty | cdk.IResolvable;
  }

  /**
   * Contains information about the EBS storage volumes attached to the broker nodes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-ebsstorageinfo.html
   */
  export interface EBSStorageInfoProperty {
    /**
     * EBS volume provisioned throughput information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-ebsstorageinfo.html#cfn-msk-cluster-ebsstorageinfo-provisionedthroughput
     */
    readonly provisionedThroughput?: cdk.IResolvable | CfnCluster.ProvisionedThroughputProperty;

    /**
     * The size in GiB of the EBS volume for the data drive on each broker node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-ebsstorageinfo.html#cfn-msk-cluster-ebsstorageinfo-volumesize
     */
    readonly volumeSize?: number;
  }

  /**
   * Contains information about provisioned throughput for EBS storage volumes attached to kafka broker nodes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-provisionedthroughput.html
   */
  export interface ProvisionedThroughputProperty {
    /**
     * Provisioned throughput is enabled or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-provisionedthroughput.html#cfn-msk-cluster-provisionedthroughput-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * Throughput value of the EBS volumes for the data drive on each kafka broker node in MiB per second.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-provisionedthroughput.html#cfn-msk-cluster-provisionedthroughput-volumethroughput
     */
    readonly volumeThroughput?: number;
  }

  /**
   * Includes all client authentication information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-clientauthentication.html
   */
  export interface ClientAuthenticationProperty {
    /**
     * Details for client authentication using SASL.
     *
     * To turn on SASL, you must also turn on `EncryptionInTransit` by setting `inCluster` to true. You must set `clientBroker` to either `TLS` or `TLS_PLAINTEXT` . If you choose `TLS_PLAINTEXT` , then you must also set `unauthenticated` to true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-clientauthentication.html#cfn-msk-cluster-clientauthentication-sasl
     */
    readonly sasl?: cdk.IResolvable | CfnCluster.SaslProperty;

    /**
     * Details for ClientAuthentication using TLS.
     *
     * To turn on TLS access control, you must also turn on `EncryptionInTransit` by setting `inCluster` to true and `clientBroker` to `TLS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-clientauthentication.html#cfn-msk-cluster-clientauthentication-tls
     */
    readonly tls?: cdk.IResolvable | CfnCluster.TlsProperty;

    /**
     * Details for ClientAuthentication using no authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-clientauthentication.html#cfn-msk-cluster-clientauthentication-unauthenticated
     */
    readonly unauthenticated?: cdk.IResolvable | CfnCluster.UnauthenticatedProperty;
  }

  /**
   * Details for client authentication using SASL.
   *
   * To turn on SASL, you must also turn on `EncryptionInTransit` by setting `inCluster` to true. You must set `clientBroker` to either `TLS` or `TLS_PLAINTEXT` . If you choose `TLS_PLAINTEXT` , then you must also set `unauthenticated` to true.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-sasl.html
   */
  export interface SaslProperty {
    /**
     * Details for ClientAuthentication using IAM.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-sasl.html#cfn-msk-cluster-sasl-iam
     */
    readonly iam?: CfnCluster.IamProperty | cdk.IResolvable;

    /**
     * Details for SASL/SCRAM client authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-sasl.html#cfn-msk-cluster-sasl-scram
     */
    readonly scram?: cdk.IResolvable | CfnCluster.ScramProperty;
  }

  /**
   * Details for SASL/IAM client authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-iam.html
   */
  export interface IamProperty {
    /**
     * SASL/IAM authentication is enabled or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-iam.html#cfn-msk-cluster-iam-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Details for SASL/SCRAM client authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-scram.html
   */
  export interface ScramProperty {
    /**
     * SASL/SCRAM authentication is enabled or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-scram.html#cfn-msk-cluster-scram-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Details for allowing no client authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-unauthenticated.html
   */
  export interface UnauthenticatedProperty {
    /**
     * Unauthenticated is enabled or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-unauthenticated.html#cfn-msk-cluster-unauthenticated-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Details for client authentication using TLS.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-tls.html
   */
  export interface TlsProperty {
    /**
     * List of AWS Private CA Amazon Resource Name (ARN)s.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-tls.html#cfn-msk-cluster-tls-certificateauthorityarnlist
     */
    readonly certificateAuthorityArnList?: Array<string>;

    /**
     * TLS authentication is enabled or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-tls.html#cfn-msk-cluster-tls-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * You can configure your MSK cluster to send broker logs to different destination types.
   *
   * This is a container for the configuration details related to broker logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-logginginfo.html
   */
  export interface LoggingInfoProperty {
    /**
     * You can configure your MSK cluster to send broker logs to different destination types.
     *
     * This configuration specifies the details of these destinations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-logginginfo.html#cfn-msk-cluster-logginginfo-brokerlogs
     */
    readonly brokerLogs: CfnCluster.BrokerLogsProperty | cdk.IResolvable;
  }

  /**
   * The broker logs configuration for this MSK cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-brokerlogs.html
   */
  export interface BrokerLogsProperty {
    /**
     * Details of the CloudWatch Logs destination for broker logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-brokerlogs.html#cfn-msk-cluster-brokerlogs-cloudwatchlogs
     */
    readonly cloudWatchLogs?: CfnCluster.CloudWatchLogsProperty | cdk.IResolvable;

    /**
     * Details of the Kinesis Data Firehose delivery stream that is the destination for broker logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-brokerlogs.html#cfn-msk-cluster-brokerlogs-firehose
     */
    readonly firehose?: CfnCluster.FirehoseProperty | cdk.IResolvable;

    /**
     * Details of the Amazon S3 destination for broker logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-brokerlogs.html#cfn-msk-cluster-brokerlogs-s3
     */
    readonly s3?: cdk.IResolvable | CfnCluster.S3Property;
  }

  /**
   * The details of the Amazon S3 destination for broker logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-s3.html
   */
  export interface S3Property {
    /**
     * The name of the S3 bucket that is the destination for broker logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-s3.html#cfn-msk-cluster-s3-bucket
     */
    readonly bucket?: string;

    /**
     * Specifies whether broker logs get sent to the specified Amazon S3 destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-s3.html#cfn-msk-cluster-s3-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The S3 prefix that is the destination for broker logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-s3.html#cfn-msk-cluster-s3-prefix
     */
    readonly prefix?: string;
  }

  /**
   * Firehose details for BrokerLogs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-firehose.html
   */
  export interface FirehoseProperty {
    /**
     * The Kinesis Data Firehose delivery stream that is the destination for broker logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-firehose.html#cfn-msk-cluster-firehose-deliverystream
     */
    readonly deliveryStream?: string;

    /**
     * Specifies whether broker logs get sent to the specified Kinesis Data Firehose delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-firehose.html#cfn-msk-cluster-firehose-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Details of the CloudWatch Logs destination for broker logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-cloudwatchlogs.html
   */
  export interface CloudWatchLogsProperty {
    /**
     * Specifies whether broker logs get sent to the specified CloudWatch Logs destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-cloudwatchlogs.html#cfn-msk-cluster-cloudwatchlogs-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The CloudWatch log group that is the destination for broker logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-cluster-cloudwatchlogs.html#cfn-msk-cluster-cloudwatchlogs-loggroup
     */
    readonly logGroup?: string;
  }
}

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html
 */
export interface CfnClusterProps {
  /**
   * Information about the broker nodes in the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-brokernodegroupinfo
   */
  readonly brokerNodeGroupInfo: CfnCluster.BrokerNodeGroupInfoProperty | cdk.IResolvable;

  /**
   * VPC connection control settings for brokers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-clientauthentication
   */
  readonly clientAuthentication?: CfnCluster.ClientAuthenticationProperty | cdk.IResolvable;

  /**
   * The name of the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-clustername
   */
  readonly clusterName: string;

  /**
   * Represents the configuration that you want MSK to use for the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-configurationinfo
   */
  readonly configurationInfo?: CfnCluster.ConfigurationInfoProperty | cdk.IResolvable;

  /**
   * The version of the cluster that you want to update.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-currentversion
   */
  readonly currentVersion?: string;

  /**
   * Includes all encryption-related information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-encryptioninfo
   */
  readonly encryptionInfo?: CfnCluster.EncryptionInfoProperty | cdk.IResolvable;

  /**
   * Specifies the level of monitoring for the MSK cluster.
   *
   * The possible values are `DEFAULT` , `PER_BROKER` , and `PER_TOPIC_PER_BROKER` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-enhancedmonitoring
   */
  readonly enhancedMonitoring?: string;

  /**
   * The version of Apache Kafka.
   *
   * You can use Amazon MSK to create clusters that use Apache Kafka versions 1.1.1 and 2.2.1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-kafkaversion
   */
  readonly kafkaVersion: string;

  /**
   * Logging Info details.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-logginginfo
   */
  readonly loggingInfo?: cdk.IResolvable | CfnCluster.LoggingInfoProperty;

  /**
   * The number of broker nodes in the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-numberofbrokernodes
   */
  readonly numberOfBrokerNodes: number;

  /**
   * The settings for open monitoring.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-openmonitoring
   */
  readonly openMonitoring?: cdk.IResolvable | CfnCluster.OpenMonitoringProperty;

  /**
   * This controls storage mode for supported storage tiers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-storagemode
   */
  readonly storageMode?: string;

  /**
   * Create tags when creating the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-cluster.html#cfn-msk-cluster-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `EncryptionAtRestProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionAtRestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterEncryptionAtRestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataVolumeKmsKeyId", cdk.requiredValidator)(properties.dataVolumeKmsKeyId));
  errors.collect(cdk.propertyValidator("dataVolumeKmsKeyId", cdk.validateString)(properties.dataVolumeKmsKeyId));
  return errors.wrap("supplied properties not correct for \"EncryptionAtRestProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterEncryptionAtRestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterEncryptionAtRestPropertyValidator(properties).assertSuccess();
  return {
    "DataVolumeKMSKeyId": cdk.stringToCloudFormation(properties.dataVolumeKmsKeyId)
  };
}

// @ts-ignore TS6133
function CfnClusterEncryptionAtRestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EncryptionAtRestProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EncryptionAtRestProperty>();
  ret.addPropertyResult("dataVolumeKmsKeyId", "DataVolumeKMSKeyId", (properties.DataVolumeKMSKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.DataVolumeKMSKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionInTransitProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionInTransitProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterEncryptionInTransitPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientBroker", cdk.validateString)(properties.clientBroker));
  errors.collect(cdk.propertyValidator("inCluster", cdk.validateBoolean)(properties.inCluster));
  return errors.wrap("supplied properties not correct for \"EncryptionInTransitProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterEncryptionInTransitPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterEncryptionInTransitPropertyValidator(properties).assertSuccess();
  return {
    "ClientBroker": cdk.stringToCloudFormation(properties.clientBroker),
    "InCluster": cdk.booleanToCloudFormation(properties.inCluster)
  };
}

// @ts-ignore TS6133
function CfnClusterEncryptionInTransitPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EncryptionInTransitProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EncryptionInTransitProperty>();
  ret.addPropertyResult("clientBroker", "ClientBroker", (properties.ClientBroker != null ? cfn_parse.FromCloudFormation.getString(properties.ClientBroker) : undefined));
  ret.addPropertyResult("inCluster", "InCluster", (properties.InCluster != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InCluster) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionInfoProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterEncryptionInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionAtRest", CfnClusterEncryptionAtRestPropertyValidator)(properties.encryptionAtRest));
  errors.collect(cdk.propertyValidator("encryptionInTransit", CfnClusterEncryptionInTransitPropertyValidator)(properties.encryptionInTransit));
  return errors.wrap("supplied properties not correct for \"EncryptionInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterEncryptionInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterEncryptionInfoPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionAtRest": convertCfnClusterEncryptionAtRestPropertyToCloudFormation(properties.encryptionAtRest),
    "EncryptionInTransit": convertCfnClusterEncryptionInTransitPropertyToCloudFormation(properties.encryptionInTransit)
  };
}

// @ts-ignore TS6133
function CfnClusterEncryptionInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EncryptionInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EncryptionInfoProperty>();
  ret.addPropertyResult("encryptionAtRest", "EncryptionAtRest", (properties.EncryptionAtRest != null ? CfnClusterEncryptionAtRestPropertyFromCloudFormation(properties.EncryptionAtRest) : undefined));
  ret.addPropertyResult("encryptionInTransit", "EncryptionInTransit", (properties.EncryptionInTransit != null ? CfnClusterEncryptionInTransitPropertyFromCloudFormation(properties.EncryptionInTransit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JmxExporterProperty`
 *
 * @param properties - the TypeScript properties of a `JmxExporterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterJmxExporterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabledInBroker", cdk.requiredValidator)(properties.enabledInBroker));
  errors.collect(cdk.propertyValidator("enabledInBroker", cdk.validateBoolean)(properties.enabledInBroker));
  return errors.wrap("supplied properties not correct for \"JmxExporterProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterJmxExporterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterJmxExporterPropertyValidator(properties).assertSuccess();
  return {
    "EnabledInBroker": cdk.booleanToCloudFormation(properties.enabledInBroker)
  };
}

// @ts-ignore TS6133
function CfnClusterJmxExporterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.JmxExporterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.JmxExporterProperty>();
  ret.addPropertyResult("enabledInBroker", "EnabledInBroker", (properties.EnabledInBroker != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnabledInBroker) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NodeExporterProperty`
 *
 * @param properties - the TypeScript properties of a `NodeExporterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterNodeExporterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabledInBroker", cdk.requiredValidator)(properties.enabledInBroker));
  errors.collect(cdk.propertyValidator("enabledInBroker", cdk.validateBoolean)(properties.enabledInBroker));
  return errors.wrap("supplied properties not correct for \"NodeExporterProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterNodeExporterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterNodeExporterPropertyValidator(properties).assertSuccess();
  return {
    "EnabledInBroker": cdk.booleanToCloudFormation(properties.enabledInBroker)
  };
}

// @ts-ignore TS6133
function CfnClusterNodeExporterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.NodeExporterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.NodeExporterProperty>();
  ret.addPropertyResult("enabledInBroker", "EnabledInBroker", (properties.EnabledInBroker != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnabledInBroker) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrometheusProperty`
 *
 * @param properties - the TypeScript properties of a `PrometheusProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterPrometheusPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("jmxExporter", CfnClusterJmxExporterPropertyValidator)(properties.jmxExporter));
  errors.collect(cdk.propertyValidator("nodeExporter", CfnClusterNodeExporterPropertyValidator)(properties.nodeExporter));
  return errors.wrap("supplied properties not correct for \"PrometheusProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterPrometheusPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPrometheusPropertyValidator(properties).assertSuccess();
  return {
    "JmxExporter": convertCfnClusterJmxExporterPropertyToCloudFormation(properties.jmxExporter),
    "NodeExporter": convertCfnClusterNodeExporterPropertyToCloudFormation(properties.nodeExporter)
  };
}

// @ts-ignore TS6133
function CfnClusterPrometheusPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.PrometheusProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.PrometheusProperty>();
  ret.addPropertyResult("jmxExporter", "JmxExporter", (properties.JmxExporter != null ? CfnClusterJmxExporterPropertyFromCloudFormation(properties.JmxExporter) : undefined));
  ret.addPropertyResult("nodeExporter", "NodeExporter", (properties.NodeExporter != null ? CfnClusterNodeExporterPropertyFromCloudFormation(properties.NodeExporter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OpenMonitoringProperty`
 *
 * @param properties - the TypeScript properties of a `OpenMonitoringProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterOpenMonitoringPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("prometheus", cdk.requiredValidator)(properties.prometheus));
  errors.collect(cdk.propertyValidator("prometheus", CfnClusterPrometheusPropertyValidator)(properties.prometheus));
  return errors.wrap("supplied properties not correct for \"OpenMonitoringProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterOpenMonitoringPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterOpenMonitoringPropertyValidator(properties).assertSuccess();
  return {
    "Prometheus": convertCfnClusterPrometheusPropertyToCloudFormation(properties.prometheus)
  };
}

// @ts-ignore TS6133
function CfnClusterOpenMonitoringPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.OpenMonitoringProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.OpenMonitoringProperty>();
  ret.addPropertyResult("prometheus", "Prometheus", (properties.Prometheus != null ? CfnClusterPrometheusPropertyFromCloudFormation(properties.Prometheus) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfigurationInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterConfigurationInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("revision", cdk.requiredValidator)(properties.revision));
  errors.collect(cdk.propertyValidator("revision", cdk.validateNumber)(properties.revision));
  return errors.wrap("supplied properties not correct for \"ConfigurationInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterConfigurationInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterConfigurationInfoPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "Revision": cdk.numberToCloudFormation(properties.revision)
  };
}

// @ts-ignore TS6133
function CfnClusterConfigurationInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ConfigurationInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ConfigurationInfoProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("revision", "Revision", (properties.Revision != null ? cfn_parse.FromCloudFormation.getNumber(properties.Revision) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConnectivityIamProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConnectivityIamProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterVpcConnectivityIamPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"VpcConnectivityIamProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterVpcConnectivityIamPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterVpcConnectivityIamPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnClusterVpcConnectivityIamPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.VpcConnectivityIamProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.VpcConnectivityIamProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConnectivityScramProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConnectivityScramProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterVpcConnectivityScramPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"VpcConnectivityScramProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterVpcConnectivityScramPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterVpcConnectivityScramPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnClusterVpcConnectivityScramPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.VpcConnectivityScramProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.VpcConnectivityScramProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConnectivitySaslProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConnectivitySaslProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterVpcConnectivitySaslPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iam", CfnClusterVpcConnectivityIamPropertyValidator)(properties.iam));
  errors.collect(cdk.propertyValidator("scram", CfnClusterVpcConnectivityScramPropertyValidator)(properties.scram));
  return errors.wrap("supplied properties not correct for \"VpcConnectivitySaslProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterVpcConnectivitySaslPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterVpcConnectivitySaslPropertyValidator(properties).assertSuccess();
  return {
    "Iam": convertCfnClusterVpcConnectivityIamPropertyToCloudFormation(properties.iam),
    "Scram": convertCfnClusterVpcConnectivityScramPropertyToCloudFormation(properties.scram)
  };
}

// @ts-ignore TS6133
function CfnClusterVpcConnectivitySaslPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.VpcConnectivitySaslProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.VpcConnectivitySaslProperty>();
  ret.addPropertyResult("iam", "Iam", (properties.Iam != null ? CfnClusterVpcConnectivityIamPropertyFromCloudFormation(properties.Iam) : undefined));
  ret.addPropertyResult("scram", "Scram", (properties.Scram != null ? CfnClusterVpcConnectivityScramPropertyFromCloudFormation(properties.Scram) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConnectivityTlsProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConnectivityTlsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterVpcConnectivityTlsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"VpcConnectivityTlsProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterVpcConnectivityTlsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterVpcConnectivityTlsPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnClusterVpcConnectivityTlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.VpcConnectivityTlsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.VpcConnectivityTlsProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConnectivityClientAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConnectivityClientAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterVpcConnectivityClientAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sasl", CfnClusterVpcConnectivitySaslPropertyValidator)(properties.sasl));
  errors.collect(cdk.propertyValidator("tls", CfnClusterVpcConnectivityTlsPropertyValidator)(properties.tls));
  return errors.wrap("supplied properties not correct for \"VpcConnectivityClientAuthenticationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterVpcConnectivityClientAuthenticationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterVpcConnectivityClientAuthenticationPropertyValidator(properties).assertSuccess();
  return {
    "Sasl": convertCfnClusterVpcConnectivitySaslPropertyToCloudFormation(properties.sasl),
    "Tls": convertCfnClusterVpcConnectivityTlsPropertyToCloudFormation(properties.tls)
  };
}

// @ts-ignore TS6133
function CfnClusterVpcConnectivityClientAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.VpcConnectivityClientAuthenticationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.VpcConnectivityClientAuthenticationProperty>();
  ret.addPropertyResult("sasl", "Sasl", (properties.Sasl != null ? CfnClusterVpcConnectivitySaslPropertyFromCloudFormation(properties.Sasl) : undefined));
  ret.addPropertyResult("tls", "Tls", (properties.Tls != null ? CfnClusterVpcConnectivityTlsPropertyFromCloudFormation(properties.Tls) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConnectivityProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConnectivityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterVpcConnectivityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientAuthentication", CfnClusterVpcConnectivityClientAuthenticationPropertyValidator)(properties.clientAuthentication));
  return errors.wrap("supplied properties not correct for \"VpcConnectivityProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterVpcConnectivityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterVpcConnectivityPropertyValidator(properties).assertSuccess();
  return {
    "ClientAuthentication": convertCfnClusterVpcConnectivityClientAuthenticationPropertyToCloudFormation(properties.clientAuthentication)
  };
}

// @ts-ignore TS6133
function CfnClusterVpcConnectivityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.VpcConnectivityProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.VpcConnectivityProperty>();
  ret.addPropertyResult("clientAuthentication", "ClientAuthentication", (properties.ClientAuthentication != null ? CfnClusterVpcConnectivityClientAuthenticationPropertyFromCloudFormation(properties.ClientAuthentication) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PublicAccessProperty`
 *
 * @param properties - the TypeScript properties of a `PublicAccessProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterPublicAccessPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PublicAccessProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterPublicAccessPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPublicAccessPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnClusterPublicAccessPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.PublicAccessProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.PublicAccessProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectivityInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectivityInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterConnectivityInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("publicAccess", CfnClusterPublicAccessPropertyValidator)(properties.publicAccess));
  errors.collect(cdk.propertyValidator("vpcConnectivity", CfnClusterVpcConnectivityPropertyValidator)(properties.vpcConnectivity));
  return errors.wrap("supplied properties not correct for \"ConnectivityInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterConnectivityInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterConnectivityInfoPropertyValidator(properties).assertSuccess();
  return {
    "PublicAccess": convertCfnClusterPublicAccessPropertyToCloudFormation(properties.publicAccess),
    "VpcConnectivity": convertCfnClusterVpcConnectivityPropertyToCloudFormation(properties.vpcConnectivity)
  };
}

// @ts-ignore TS6133
function CfnClusterConnectivityInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ConnectivityInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ConnectivityInfoProperty>();
  ret.addPropertyResult("publicAccess", "PublicAccess", (properties.PublicAccess != null ? CfnClusterPublicAccessPropertyFromCloudFormation(properties.PublicAccess) : undefined));
  ret.addPropertyResult("vpcConnectivity", "VpcConnectivity", (properties.VpcConnectivity != null ? CfnClusterVpcConnectivityPropertyFromCloudFormation(properties.VpcConnectivity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProvisionedThroughputProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedThroughputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterProvisionedThroughputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("volumeThroughput", cdk.validateNumber)(properties.volumeThroughput));
  return errors.wrap("supplied properties not correct for \"ProvisionedThroughputProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterProvisionedThroughputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterProvisionedThroughputPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "VolumeThroughput": cdk.numberToCloudFormation(properties.volumeThroughput)
  };
}

// @ts-ignore TS6133
function CfnClusterProvisionedThroughputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.ProvisionedThroughputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ProvisionedThroughputProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("volumeThroughput", "VolumeThroughput", (properties.VolumeThroughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeThroughput) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EBSStorageInfoProperty`
 *
 * @param properties - the TypeScript properties of a `EBSStorageInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterEBSStorageInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("provisionedThroughput", CfnClusterProvisionedThroughputPropertyValidator)(properties.provisionedThroughput));
  errors.collect(cdk.propertyValidator("volumeSize", cdk.validateNumber)(properties.volumeSize));
  return errors.wrap("supplied properties not correct for \"EBSStorageInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterEBSStorageInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterEBSStorageInfoPropertyValidator(properties).assertSuccess();
  return {
    "ProvisionedThroughput": convertCfnClusterProvisionedThroughputPropertyToCloudFormation(properties.provisionedThroughput),
    "VolumeSize": cdk.numberToCloudFormation(properties.volumeSize)
  };
}

// @ts-ignore TS6133
function CfnClusterEBSStorageInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EBSStorageInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EBSStorageInfoProperty>();
  ret.addPropertyResult("provisionedThroughput", "ProvisionedThroughput", (properties.ProvisionedThroughput != null ? CfnClusterProvisionedThroughputPropertyFromCloudFormation(properties.ProvisionedThroughput) : undefined));
  ret.addPropertyResult("volumeSize", "VolumeSize", (properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StorageInfoProperty`
 *
 * @param properties - the TypeScript properties of a `StorageInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterStorageInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ebsStorageInfo", CfnClusterEBSStorageInfoPropertyValidator)(properties.ebsStorageInfo));
  return errors.wrap("supplied properties not correct for \"StorageInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterStorageInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterStorageInfoPropertyValidator(properties).assertSuccess();
  return {
    "EBSStorageInfo": convertCfnClusterEBSStorageInfoPropertyToCloudFormation(properties.ebsStorageInfo)
  };
}

// @ts-ignore TS6133
function CfnClusterStorageInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.StorageInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.StorageInfoProperty>();
  ret.addPropertyResult("ebsStorageInfo", "EBSStorageInfo", (properties.EBSStorageInfo != null ? CfnClusterEBSStorageInfoPropertyFromCloudFormation(properties.EBSStorageInfo) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BrokerNodeGroupInfoProperty`
 *
 * @param properties - the TypeScript properties of a `BrokerNodeGroupInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterBrokerNodeGroupInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("brokerAzDistribution", cdk.validateString)(properties.brokerAzDistribution));
  errors.collect(cdk.propertyValidator("clientSubnets", cdk.requiredValidator)(properties.clientSubnets));
  errors.collect(cdk.propertyValidator("clientSubnets", cdk.listValidator(cdk.validateString))(properties.clientSubnets));
  errors.collect(cdk.propertyValidator("connectivityInfo", CfnClusterConnectivityInfoPropertyValidator)(properties.connectivityInfo));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("storageInfo", CfnClusterStorageInfoPropertyValidator)(properties.storageInfo));
  return errors.wrap("supplied properties not correct for \"BrokerNodeGroupInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterBrokerNodeGroupInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterBrokerNodeGroupInfoPropertyValidator(properties).assertSuccess();
  return {
    "BrokerAZDistribution": cdk.stringToCloudFormation(properties.brokerAzDistribution),
    "ClientSubnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.clientSubnets),
    "ConnectivityInfo": convertCfnClusterConnectivityInfoPropertyToCloudFormation(properties.connectivityInfo),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "StorageInfo": convertCfnClusterStorageInfoPropertyToCloudFormation(properties.storageInfo)
  };
}

// @ts-ignore TS6133
function CfnClusterBrokerNodeGroupInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.BrokerNodeGroupInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.BrokerNodeGroupInfoProperty>();
  ret.addPropertyResult("brokerAzDistribution", "BrokerAZDistribution", (properties.BrokerAZDistribution != null ? cfn_parse.FromCloudFormation.getString(properties.BrokerAZDistribution) : undefined));
  ret.addPropertyResult("clientSubnets", "ClientSubnets", (properties.ClientSubnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ClientSubnets) : undefined));
  ret.addPropertyResult("connectivityInfo", "ConnectivityInfo", (properties.ConnectivityInfo != null ? CfnClusterConnectivityInfoPropertyFromCloudFormation(properties.ConnectivityInfo) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("storageInfo", "StorageInfo", (properties.StorageInfo != null ? CfnClusterStorageInfoPropertyFromCloudFormation(properties.StorageInfo) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IamProperty`
 *
 * @param properties - the TypeScript properties of a `IamProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterIamPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"IamProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterIamPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterIamPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnClusterIamPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.IamProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.IamProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScramProperty`
 *
 * @param properties - the TypeScript properties of a `ScramProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterScramPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"ScramProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterScramPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterScramPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnClusterScramPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.ScramProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ScramProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SaslProperty`
 *
 * @param properties - the TypeScript properties of a `SaslProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterSaslPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iam", CfnClusterIamPropertyValidator)(properties.iam));
  errors.collect(cdk.propertyValidator("scram", CfnClusterScramPropertyValidator)(properties.scram));
  return errors.wrap("supplied properties not correct for \"SaslProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterSaslPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterSaslPropertyValidator(properties).assertSuccess();
  return {
    "Iam": convertCfnClusterIamPropertyToCloudFormation(properties.iam),
    "Scram": convertCfnClusterScramPropertyToCloudFormation(properties.scram)
  };
}

// @ts-ignore TS6133
function CfnClusterSaslPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.SaslProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.SaslProperty>();
  ret.addPropertyResult("iam", "Iam", (properties.Iam != null ? CfnClusterIamPropertyFromCloudFormation(properties.Iam) : undefined));
  ret.addPropertyResult("scram", "Scram", (properties.Scram != null ? CfnClusterScramPropertyFromCloudFormation(properties.Scram) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UnauthenticatedProperty`
 *
 * @param properties - the TypeScript properties of a `UnauthenticatedProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterUnauthenticatedPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"UnauthenticatedProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterUnauthenticatedPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterUnauthenticatedPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnClusterUnauthenticatedPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.UnauthenticatedProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.UnauthenticatedProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TlsProperty`
 *
 * @param properties - the TypeScript properties of a `TlsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterTlsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateAuthorityArnList", cdk.listValidator(cdk.validateString))(properties.certificateAuthorityArnList));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"TlsProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterTlsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterTlsPropertyValidator(properties).assertSuccess();
  return {
    "CertificateAuthorityArnList": cdk.listMapper(cdk.stringToCloudFormation)(properties.certificateAuthorityArnList),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnClusterTlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.TlsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.TlsProperty>();
  ret.addPropertyResult("certificateAuthorityArnList", "CertificateAuthorityArnList", (properties.CertificateAuthorityArnList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CertificateAuthorityArnList) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ClientAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `ClientAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterClientAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sasl", CfnClusterSaslPropertyValidator)(properties.sasl));
  errors.collect(cdk.propertyValidator("tls", CfnClusterTlsPropertyValidator)(properties.tls));
  errors.collect(cdk.propertyValidator("unauthenticated", CfnClusterUnauthenticatedPropertyValidator)(properties.unauthenticated));
  return errors.wrap("supplied properties not correct for \"ClientAuthenticationProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterClientAuthenticationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterClientAuthenticationPropertyValidator(properties).assertSuccess();
  return {
    "Sasl": convertCfnClusterSaslPropertyToCloudFormation(properties.sasl),
    "Tls": convertCfnClusterTlsPropertyToCloudFormation(properties.tls),
    "Unauthenticated": convertCfnClusterUnauthenticatedPropertyToCloudFormation(properties.unauthenticated)
  };
}

// @ts-ignore TS6133
function CfnClusterClientAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ClientAuthenticationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ClientAuthenticationProperty>();
  ret.addPropertyResult("sasl", "Sasl", (properties.Sasl != null ? CfnClusterSaslPropertyFromCloudFormation(properties.Sasl) : undefined));
  ret.addPropertyResult("tls", "Tls", (properties.Tls != null ? CfnClusterTlsPropertyFromCloudFormation(properties.Tls) : undefined));
  ret.addPropertyResult("unauthenticated", "Unauthenticated", (properties.Unauthenticated != null ? CfnClusterUnauthenticatedPropertyFromCloudFormation(properties.Unauthenticated) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3Property`
 *
 * @param properties - the TypeScript properties of a `S3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterS3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"S3Property\"");
}

// @ts-ignore TS6133
function convertCfnClusterS3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterS3PropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnClusterS3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.S3Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.S3Property>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FirehoseProperty`
 *
 * @param properties - the TypeScript properties of a `FirehoseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterFirehosePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryStream", cdk.validateString)(properties.deliveryStream));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"FirehoseProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterFirehosePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterFirehosePropertyValidator(properties).assertSuccess();
  return {
    "DeliveryStream": cdk.stringToCloudFormation(properties.deliveryStream),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnClusterFirehosePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.FirehoseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.FirehoseProperty>();
  ret.addPropertyResult("deliveryStream", "DeliveryStream", (properties.DeliveryStream != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStream) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterCloudWatchLogsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("logGroup", cdk.validateString)(properties.logGroup));
  return errors.wrap("supplied properties not correct for \"CloudWatchLogsProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterCloudWatchLogsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterCloudWatchLogsPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "LogGroup": cdk.stringToCloudFormation(properties.logGroup)
  };
}

// @ts-ignore TS6133
function CfnClusterCloudWatchLogsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.CloudWatchLogsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.CloudWatchLogsProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("logGroup", "LogGroup", (properties.LogGroup != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BrokerLogsProperty`
 *
 * @param properties - the TypeScript properties of a `BrokerLogsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterBrokerLogsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogs", CfnClusterCloudWatchLogsPropertyValidator)(properties.cloudWatchLogs));
  errors.collect(cdk.propertyValidator("firehose", CfnClusterFirehosePropertyValidator)(properties.firehose));
  errors.collect(cdk.propertyValidator("s3", CfnClusterS3PropertyValidator)(properties.s3));
  return errors.wrap("supplied properties not correct for \"BrokerLogsProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterBrokerLogsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterBrokerLogsPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogs": convertCfnClusterCloudWatchLogsPropertyToCloudFormation(properties.cloudWatchLogs),
    "Firehose": convertCfnClusterFirehosePropertyToCloudFormation(properties.firehose),
    "S3": convertCfnClusterS3PropertyToCloudFormation(properties.s3)
  };
}

// @ts-ignore TS6133
function CfnClusterBrokerLogsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.BrokerLogsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.BrokerLogsProperty>();
  ret.addPropertyResult("cloudWatchLogs", "CloudWatchLogs", (properties.CloudWatchLogs != null ? CfnClusterCloudWatchLogsPropertyFromCloudFormation(properties.CloudWatchLogs) : undefined));
  ret.addPropertyResult("firehose", "Firehose", (properties.Firehose != null ? CfnClusterFirehosePropertyFromCloudFormation(properties.Firehose) : undefined));
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnClusterS3PropertyFromCloudFormation(properties.S3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingInfoProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterLoggingInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("brokerLogs", cdk.requiredValidator)(properties.brokerLogs));
  errors.collect(cdk.propertyValidator("brokerLogs", CfnClusterBrokerLogsPropertyValidator)(properties.brokerLogs));
  return errors.wrap("supplied properties not correct for \"LoggingInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterLoggingInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterLoggingInfoPropertyValidator(properties).assertSuccess();
  return {
    "BrokerLogs": convertCfnClusterBrokerLogsPropertyToCloudFormation(properties.brokerLogs)
  };
}

// @ts-ignore TS6133
function CfnClusterLoggingInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.LoggingInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.LoggingInfoProperty>();
  ret.addPropertyResult("brokerLogs", "BrokerLogs", (properties.BrokerLogs != null ? CfnClusterBrokerLogsPropertyFromCloudFormation(properties.BrokerLogs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("brokerNodeGroupInfo", cdk.requiredValidator)(properties.brokerNodeGroupInfo));
  errors.collect(cdk.propertyValidator("brokerNodeGroupInfo", CfnClusterBrokerNodeGroupInfoPropertyValidator)(properties.brokerNodeGroupInfo));
  errors.collect(cdk.propertyValidator("clientAuthentication", CfnClusterClientAuthenticationPropertyValidator)(properties.clientAuthentication));
  errors.collect(cdk.propertyValidator("clusterName", cdk.requiredValidator)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("configurationInfo", CfnClusterConfigurationInfoPropertyValidator)(properties.configurationInfo));
  errors.collect(cdk.propertyValidator("currentVersion", cdk.validateString)(properties.currentVersion));
  errors.collect(cdk.propertyValidator("encryptionInfo", CfnClusterEncryptionInfoPropertyValidator)(properties.encryptionInfo));
  errors.collect(cdk.propertyValidator("enhancedMonitoring", cdk.validateString)(properties.enhancedMonitoring));
  errors.collect(cdk.propertyValidator("kafkaVersion", cdk.requiredValidator)(properties.kafkaVersion));
  errors.collect(cdk.propertyValidator("kafkaVersion", cdk.validateString)(properties.kafkaVersion));
  errors.collect(cdk.propertyValidator("loggingInfo", CfnClusterLoggingInfoPropertyValidator)(properties.loggingInfo));
  errors.collect(cdk.propertyValidator("numberOfBrokerNodes", cdk.requiredValidator)(properties.numberOfBrokerNodes));
  errors.collect(cdk.propertyValidator("numberOfBrokerNodes", cdk.validateNumber)(properties.numberOfBrokerNodes));
  errors.collect(cdk.propertyValidator("openMonitoring", CfnClusterOpenMonitoringPropertyValidator)(properties.openMonitoring));
  errors.collect(cdk.propertyValidator("storageMode", cdk.validateString)(properties.storageMode));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPropsValidator(properties).assertSuccess();
  return {
    "BrokerNodeGroupInfo": convertCfnClusterBrokerNodeGroupInfoPropertyToCloudFormation(properties.brokerNodeGroupInfo),
    "ClientAuthentication": convertCfnClusterClientAuthenticationPropertyToCloudFormation(properties.clientAuthentication),
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "ConfigurationInfo": convertCfnClusterConfigurationInfoPropertyToCloudFormation(properties.configurationInfo),
    "CurrentVersion": cdk.stringToCloudFormation(properties.currentVersion),
    "EncryptionInfo": convertCfnClusterEncryptionInfoPropertyToCloudFormation(properties.encryptionInfo),
    "EnhancedMonitoring": cdk.stringToCloudFormation(properties.enhancedMonitoring),
    "KafkaVersion": cdk.stringToCloudFormation(properties.kafkaVersion),
    "LoggingInfo": convertCfnClusterLoggingInfoPropertyToCloudFormation(properties.loggingInfo),
    "NumberOfBrokerNodes": cdk.numberToCloudFormation(properties.numberOfBrokerNodes),
    "OpenMonitoring": convertCfnClusterOpenMonitoringPropertyToCloudFormation(properties.openMonitoring),
    "StorageMode": cdk.stringToCloudFormation(properties.storageMode),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterProps>();
  ret.addPropertyResult("brokerNodeGroupInfo", "BrokerNodeGroupInfo", (properties.BrokerNodeGroupInfo != null ? CfnClusterBrokerNodeGroupInfoPropertyFromCloudFormation(properties.BrokerNodeGroupInfo) : undefined));
  ret.addPropertyResult("clientAuthentication", "ClientAuthentication", (properties.ClientAuthentication != null ? CfnClusterClientAuthenticationPropertyFromCloudFormation(properties.ClientAuthentication) : undefined));
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("configurationInfo", "ConfigurationInfo", (properties.ConfigurationInfo != null ? CfnClusterConfigurationInfoPropertyFromCloudFormation(properties.ConfigurationInfo) : undefined));
  ret.addPropertyResult("currentVersion", "CurrentVersion", (properties.CurrentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentVersion) : undefined));
  ret.addPropertyResult("encryptionInfo", "EncryptionInfo", (properties.EncryptionInfo != null ? CfnClusterEncryptionInfoPropertyFromCloudFormation(properties.EncryptionInfo) : undefined));
  ret.addPropertyResult("enhancedMonitoring", "EnhancedMonitoring", (properties.EnhancedMonitoring != null ? cfn_parse.FromCloudFormation.getString(properties.EnhancedMonitoring) : undefined));
  ret.addPropertyResult("kafkaVersion", "KafkaVersion", (properties.KafkaVersion != null ? cfn_parse.FromCloudFormation.getString(properties.KafkaVersion) : undefined));
  ret.addPropertyResult("loggingInfo", "LoggingInfo", (properties.LoggingInfo != null ? CfnClusterLoggingInfoPropertyFromCloudFormation(properties.LoggingInfo) : undefined));
  ret.addPropertyResult("numberOfBrokerNodes", "NumberOfBrokerNodes", (properties.NumberOfBrokerNodes != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfBrokerNodes) : undefined));
  ret.addPropertyResult("openMonitoring", "OpenMonitoring", (properties.OpenMonitoring != null ? CfnClusterOpenMonitoringPropertyFromCloudFormation(properties.OpenMonitoring) : undefined));
  ret.addPropertyResult("storageMode", "StorageMode", (properties.StorageMode != null ? cfn_parse.FromCloudFormation.getString(properties.StorageMode) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create or update cluster policy.
 *
 * @cloudformationResource AWS::MSK::ClusterPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-clusterpolicy.html
 */
export class CfnClusterPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MSK::ClusterPolicy";

  /**
   * Build a CfnClusterPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnClusterPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClusterPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnClusterPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The current version of the policy attached to the specified cluster.
   *
   * @cloudformationAttribute CurrentVersion
   */
  public readonly attrCurrentVersion: string;

  /**
   * The Amazon Resource Name (ARN) that uniquely identifies the cluster.
   */
  public clusterArn: string;

  /**
   * Resource policy for the cluster.
   */
  public policy: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClusterPolicyProps) {
    super(scope, id, {
      "type": CfnClusterPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clusterArn", this);
    cdk.requireProperty(props, "policy", this);

    this.attrCurrentVersion = cdk.Token.asString(this.getAtt("CurrentVersion", cdk.ResolutionTypeHint.STRING));
    this.clusterArn = props.clusterArn;
    this.policy = props.policy;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clusterArn": this.clusterArn,
      "policy": this.policy
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnClusterPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClusterPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnClusterPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-clusterpolicy.html
 */
export interface CfnClusterPolicyProps {
  /**
   * The Amazon Resource Name (ARN) that uniquely identifies the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-clusterpolicy.html#cfn-msk-clusterpolicy-clusterarn
   */
  readonly clusterArn: string;

  /**
   * Resource policy for the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-clusterpolicy.html#cfn-msk-clusterpolicy-policy
   */
  readonly policy: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnClusterPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterArn", cdk.requiredValidator)(properties.clusterArn));
  errors.collect(cdk.propertyValidator("clusterArn", cdk.validateString)(properties.clusterArn));
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  return errors.wrap("supplied properties not correct for \"CfnClusterPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPolicyPropsValidator(properties).assertSuccess();
  return {
    "ClusterArn": cdk.stringToCloudFormation(properties.clusterArn),
    "Policy": cdk.objectToCloudFormation(properties.policy)
  };
}

// @ts-ignore TS6133
function CfnClusterPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterPolicyProps>();
  ret.addPropertyResult("clusterArn", "ClusterArn", (properties.ClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterArn) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new MSK configuration.
 *
 * To see an example of how to use this operation, first save the following text to a file and name the file config-file.txt .
 *
 * `auto.create.topics.enable = true zookeeper.connection.timeout.ms = 1000 log.roll.ms = 604800000`
 *
 * Now run the following Python 3.6 script in the folder where you saved config-file.txt . This script uses the properties specified in config-file.txt to create a configuration named `SalesClusterConfiguration` . This configuration can work with Apache Kafka versions 1.1.1 and 2.1.0.
 *
 * ```PYTHON
 * import boto3 client = boto3.client('kafka') config_file = open('config-file.txt', 'r') server_properties = config_file.read() response = client.create_configuration( Name='SalesClusterConfiguration', Description='The configuration to use on all sales clusters.', KafkaVersions=['1.1.1', '2.1.0'], ServerProperties=server_properties
 * ) print(response)
 * ```
 *
 * @cloudformationResource AWS::MSK::Configuration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-configuration.html
 */
export class CfnConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MSK::Configuration";

  /**
   * Build a CfnConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute LatestRevision.CreationTime
   */
  public readonly attrLatestRevisionCreationTime: string;

  /**
   * @cloudformationAttribute LatestRevision.Description
   */
  public readonly attrLatestRevisionDescription: string;

  /**
   * @cloudformationAttribute LatestRevision.Revision
   */
  public readonly attrLatestRevisionRevision: number;

  /**
   * The description of the configuration.
   */
  public description?: string;

  public kafkaVersionsList?: Array<string>;

  /**
   * Latest revision of the configuration.
   */
  public latestRevision?: cdk.IResolvable | CfnConfiguration.LatestRevisionProperty;

  /**
   * The name of the configuration.
   */
  public name: string;

  /**
   * Contents of the server.properties file. When using the API, you must ensure that the contents of the file are base64 encoded. When using the console, the SDK, or the CLI, the contents of server.properties can be in plaintext.
   */
  public serverProperties: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigurationProps) {
    super(scope, id, {
      "type": CfnConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "serverProperties", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrLatestRevisionCreationTime = cdk.Token.asString(this.getAtt("LatestRevision.CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrLatestRevisionDescription = cdk.Token.asString(this.getAtt("LatestRevision.Description", cdk.ResolutionTypeHint.STRING));
    this.attrLatestRevisionRevision = cdk.Token.asNumber(this.getAtt("LatestRevision.Revision", cdk.ResolutionTypeHint.NUMBER));
    this.description = props.description;
    this.kafkaVersionsList = props.kafkaVersionsList;
    this.latestRevision = props.latestRevision;
    this.name = props.name;
    this.serverProperties = props.serverProperties;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "kafkaVersionsList": this.kafkaVersionsList,
      "latestRevision": this.latestRevision,
      "name": this.name,
      "serverProperties": this.serverProperties
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnConfiguration {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-configuration-latestrevision.html
   */
  export interface LatestRevisionProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-configuration-latestrevision.html#cfn-msk-configuration-latestrevision-creationtime
     */
    readonly creationTime?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-configuration-latestrevision.html#cfn-msk-configuration-latestrevision-description
     */
    readonly description?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-configuration-latestrevision.html#cfn-msk-configuration-latestrevision-revision
     */
    readonly revision?: number;
  }
}

/**
 * Properties for defining a `CfnConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-configuration.html
 */
export interface CfnConfigurationProps {
  /**
   * The description of the configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-configuration.html#cfn-msk-configuration-description
   */
  readonly description?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-configuration.html#cfn-msk-configuration-kafkaversionslist
   */
  readonly kafkaVersionsList?: Array<string>;

  /**
   * Latest revision of the configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-configuration.html#cfn-msk-configuration-latestrevision
   */
  readonly latestRevision?: cdk.IResolvable | CfnConfiguration.LatestRevisionProperty;

  /**
   * The name of the configuration.
   *
   * Configuration names are strings that match the regex "^[0-9A-Za-z][0-9A-Za-z-]{0,}$".
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-configuration.html#cfn-msk-configuration-name
   */
  readonly name: string;

  /**
   * Contents of the server.properties file. When using the API, you must ensure that the contents of the file are base64 encoded. When using the console, the SDK, or the CLI, the contents of server.properties can be in plaintext.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-configuration.html#cfn-msk-configuration-serverproperties
   */
  readonly serverProperties: string;
}

/**
 * Determine whether the given properties match those of a `LatestRevisionProperty`
 *
 * @param properties - the TypeScript properties of a `LatestRevisionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationLatestRevisionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("creationTime", cdk.validateString)(properties.creationTime));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("revision", cdk.validateNumber)(properties.revision));
  return errors.wrap("supplied properties not correct for \"LatestRevisionProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationLatestRevisionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationLatestRevisionPropertyValidator(properties).assertSuccess();
  return {
    "CreationTime": cdk.stringToCloudFormation(properties.creationTime),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Revision": cdk.numberToCloudFormation(properties.revision)
  };
}

// @ts-ignore TS6133
function CfnConfigurationLatestRevisionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfiguration.LatestRevisionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfiguration.LatestRevisionProperty>();
  ret.addPropertyResult("creationTime", "CreationTime", (properties.CreationTime != null ? cfn_parse.FromCloudFormation.getString(properties.CreationTime) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("revision", "Revision", (properties.Revision != null ? cfn_parse.FromCloudFormation.getNumber(properties.Revision) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("kafkaVersionsList", cdk.listValidator(cdk.validateString))(properties.kafkaVersionsList));
  errors.collect(cdk.propertyValidator("latestRevision", CfnConfigurationLatestRevisionPropertyValidator)(properties.latestRevision));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("serverProperties", cdk.requiredValidator)(properties.serverProperties));
  errors.collect(cdk.propertyValidator("serverProperties", cdk.validateString)(properties.serverProperties));
  return errors.wrap("supplied properties not correct for \"CfnConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "KafkaVersionsList": cdk.listMapper(cdk.stringToCloudFormation)(properties.kafkaVersionsList),
    "LatestRevision": convertCfnConfigurationLatestRevisionPropertyToCloudFormation(properties.latestRevision),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ServerProperties": cdk.stringToCloudFormation(properties.serverProperties)
  };
}

// @ts-ignore TS6133
function CfnConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("kafkaVersionsList", "KafkaVersionsList", (properties.KafkaVersionsList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.KafkaVersionsList) : undefined));
  ret.addPropertyResult("latestRevision", "LatestRevision", (properties.LatestRevision != null ? CfnConfigurationLatestRevisionPropertyFromCloudFormation(properties.LatestRevision) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("serverProperties", "ServerProperties", (properties.ServerProperties != null ? cfn_parse.FromCloudFormation.getString(properties.ServerProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-serverlesscluster.html.
 *
 * @cloudformationResource AWS::MSK::ServerlessCluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-serverlesscluster.html
 */
export class CfnServerlessCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MSK::ServerlessCluster";

  /**
   * Build a CfnServerlessCluster from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServerlessCluster {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServerlessClusterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnServerlessCluster(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Includes all client authentication information.
   */
  public clientAuthentication: CfnServerlessCluster.ClientAuthenticationProperty | cdk.IResolvable;

  public clusterName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A key-value pair to associate with a resource.
   */
  public tagsRaw?: Record<string, string>;

  public vpcConfigs: Array<cdk.IResolvable | CfnServerlessCluster.VpcConfigProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServerlessClusterProps) {
    super(scope, id, {
      "type": CfnServerlessCluster.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clientAuthentication", this);
    cdk.requireProperty(props, "clusterName", this);
    cdk.requireProperty(props, "vpcConfigs", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.clientAuthentication = props.clientAuthentication;
    this.clusterName = props.clusterName;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::MSK::ServerlessCluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcConfigs = props.vpcConfigs;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clientAuthentication": this.clientAuthentication,
      "clusterName": this.clusterName,
      "tags": this.tags.renderTags(),
      "vpcConfigs": this.vpcConfigs
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServerlessCluster.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServerlessClusterPropsToCloudFormation(props);
  }
}

export namespace CfnServerlessCluster {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-serverlesscluster-vpcconfig.html
   */
  export interface VpcConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-serverlesscluster-vpcconfig.html#cfn-msk-serverlesscluster-vpcconfig-securitygroups
     */
    readonly securityGroups?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-serverlesscluster-vpcconfig.html#cfn-msk-serverlesscluster-vpcconfig-subnetids
     */
    readonly subnetIds: Array<string>;
  }

  /**
   * Includes all client authentication information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-serverlesscluster-clientauthentication.html
   */
  export interface ClientAuthenticationProperty {
    /**
     * Details for client authentication using SASL.
     *
     * To turn on SASL, you must also turn on `EncryptionInTransit` by setting `inCluster` to true. You must set `clientBroker` to either `TLS` or `TLS_PLAINTEXT` . If you choose `TLS_PLAINTEXT` , then you must also set `unauthenticated` to true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-serverlesscluster-clientauthentication.html#cfn-msk-serverlesscluster-clientauthentication-sasl
     */
    readonly sasl: cdk.IResolvable | CfnServerlessCluster.SaslProperty;
  }

  /**
   * Details for client authentication using SASL.
   *
   * To turn on SASL, you must also turn on `EncryptionInTransit` by setting `inCluster` to true. You must set `clientBroker` to either `TLS` or `TLS_PLAINTEXT` . If you choose `TLS_PLAINTEXT` , then you must also set `unauthenticated` to true.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-serverlesscluster-sasl.html
   */
  export interface SaslProperty {
    /**
     * Details for ClientAuthentication using IAM.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-serverlesscluster-sasl.html#cfn-msk-serverlesscluster-sasl-iam
     */
    readonly iam: CfnServerlessCluster.IamProperty | cdk.IResolvable;
  }

  /**
   * Details for SASL/IAM client authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-serverlesscluster-iam.html
   */
  export interface IamProperty {
    /**
     * SASL/IAM authentication is enabled or not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-serverlesscluster-iam.html#cfn-msk-serverlesscluster-iam-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnServerlessCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-serverlesscluster.html
 */
export interface CfnServerlessClusterProps {
  /**
   * Includes all client authentication information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-serverlesscluster.html#cfn-msk-serverlesscluster-clientauthentication
   */
  readonly clientAuthentication: CfnServerlessCluster.ClientAuthenticationProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-serverlesscluster.html#cfn-msk-serverlesscluster-clustername
   */
  readonly clusterName: string;

  /**
   * A key-value pair to associate with a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-serverlesscluster.html#cfn-msk-serverlesscluster-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-serverlesscluster.html#cfn-msk-serverlesscluster-vpcconfigs
   */
  readonly vpcConfigs: Array<cdk.IResolvable | CfnServerlessCluster.VpcConfigProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerlessClusterVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"VpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnServerlessClusterVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerlessClusterVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnServerlessClusterVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnServerlessCluster.VpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServerlessCluster.VpcConfigProperty>();
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IamProperty`
 *
 * @param properties - the TypeScript properties of a `IamProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerlessClusterIamPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"IamProperty\"");
}

// @ts-ignore TS6133
function convertCfnServerlessClusterIamPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerlessClusterIamPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnServerlessClusterIamPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServerlessCluster.IamProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServerlessCluster.IamProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SaslProperty`
 *
 * @param properties - the TypeScript properties of a `SaslProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerlessClusterSaslPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iam", cdk.requiredValidator)(properties.iam));
  errors.collect(cdk.propertyValidator("iam", CfnServerlessClusterIamPropertyValidator)(properties.iam));
  return errors.wrap("supplied properties not correct for \"SaslProperty\"");
}

// @ts-ignore TS6133
function convertCfnServerlessClusterSaslPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerlessClusterSaslPropertyValidator(properties).assertSuccess();
  return {
    "Iam": convertCfnServerlessClusterIamPropertyToCloudFormation(properties.iam)
  };
}

// @ts-ignore TS6133
function CfnServerlessClusterSaslPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnServerlessCluster.SaslProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServerlessCluster.SaslProperty>();
  ret.addPropertyResult("iam", "Iam", (properties.Iam != null ? CfnServerlessClusterIamPropertyFromCloudFormation(properties.Iam) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ClientAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `ClientAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerlessClusterClientAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sasl", cdk.requiredValidator)(properties.sasl));
  errors.collect(cdk.propertyValidator("sasl", CfnServerlessClusterSaslPropertyValidator)(properties.sasl));
  return errors.wrap("supplied properties not correct for \"ClientAuthenticationProperty\"");
}

// @ts-ignore TS6133
function convertCfnServerlessClusterClientAuthenticationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerlessClusterClientAuthenticationPropertyValidator(properties).assertSuccess();
  return {
    "Sasl": convertCfnServerlessClusterSaslPropertyToCloudFormation(properties.sasl)
  };
}

// @ts-ignore TS6133
function CfnServerlessClusterClientAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServerlessCluster.ClientAuthenticationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServerlessCluster.ClientAuthenticationProperty>();
  ret.addPropertyResult("sasl", "Sasl", (properties.Sasl != null ? CfnServerlessClusterSaslPropertyFromCloudFormation(properties.Sasl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnServerlessClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnServerlessClusterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServerlessClusterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientAuthentication", cdk.requiredValidator)(properties.clientAuthentication));
  errors.collect(cdk.propertyValidator("clientAuthentication", CfnServerlessClusterClientAuthenticationPropertyValidator)(properties.clientAuthentication));
  errors.collect(cdk.propertyValidator("clusterName", cdk.requiredValidator)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcConfigs", cdk.requiredValidator)(properties.vpcConfigs));
  errors.collect(cdk.propertyValidator("vpcConfigs", cdk.listValidator(CfnServerlessClusterVpcConfigPropertyValidator))(properties.vpcConfigs));
  return errors.wrap("supplied properties not correct for \"CfnServerlessClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnServerlessClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServerlessClusterPropsValidator(properties).assertSuccess();
  return {
    "ClientAuthentication": convertCfnServerlessClusterClientAuthenticationPropertyToCloudFormation(properties.clientAuthentication),
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "VpcConfigs": cdk.listMapper(convertCfnServerlessClusterVpcConfigPropertyToCloudFormation)(properties.vpcConfigs)
  };
}

// @ts-ignore TS6133
function CfnServerlessClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServerlessClusterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServerlessClusterProps>();
  ret.addPropertyResult("clientAuthentication", "ClientAuthentication", (properties.ClientAuthentication != null ? CfnServerlessClusterClientAuthenticationPropertyFromCloudFormation(properties.ClientAuthentication) : undefined));
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcConfigs", "VpcConfigs", (properties.VpcConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnServerlessClusterVpcConfigPropertyFromCloudFormation)(properties.VpcConfigs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create remote VPC connection.
 *
 * @cloudformationResource AWS::MSK::VpcConnection
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-vpcconnection.html
 */
export class CfnVpcConnection extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MSK::VpcConnection";

  /**
   * Build a CfnVpcConnection from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVpcConnection {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVpcConnectionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVpcConnection(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the VPC connection.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The type of private link authentication.
   */
  public authentication: string;

  /**
   * The list of subnets in the client VPC to connect to.
   */
  public clientSubnets: Array<string>;

  /**
   * The security groups to attach to the ENIs for the broker nodes.
   */
  public securityGroups: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Create tags when creating the VPC connection.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The Amazon Resource Name (ARN) of the cluster.
   */
  public targetClusterArn: string;

  /**
   * The VPC id of the remote client.
   */
  public vpcId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVpcConnectionProps) {
    super(scope, id, {
      "type": CfnVpcConnection.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "authentication", this);
    cdk.requireProperty(props, "clientSubnets", this);
    cdk.requireProperty(props, "securityGroups", this);
    cdk.requireProperty(props, "targetClusterArn", this);
    cdk.requireProperty(props, "vpcId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.authentication = props.authentication;
    this.clientSubnets = props.clientSubnets;
    this.securityGroups = props.securityGroups;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::MSK::VpcConnection", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetClusterArn = props.targetClusterArn;
    this.vpcId = props.vpcId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authentication": this.authentication,
      "clientSubnets": this.clientSubnets,
      "securityGroups": this.securityGroups,
      "tags": this.tags.renderTags(),
      "targetClusterArn": this.targetClusterArn,
      "vpcId": this.vpcId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVpcConnection.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVpcConnectionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnVpcConnection`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-vpcconnection.html
 */
export interface CfnVpcConnectionProps {
  /**
   * The type of private link authentication.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-vpcconnection.html#cfn-msk-vpcconnection-authentication
   */
  readonly authentication: string;

  /**
   * The list of subnets in the client VPC to connect to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-vpcconnection.html#cfn-msk-vpcconnection-clientsubnets
   */
  readonly clientSubnets: Array<string>;

  /**
   * The security groups to attach to the ENIs for the broker nodes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-vpcconnection.html#cfn-msk-vpcconnection-securitygroups
   */
  readonly securityGroups: Array<string>;

  /**
   * Create tags when creating the VPC connection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-vpcconnection.html#cfn-msk-vpcconnection-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The Amazon Resource Name (ARN) of the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-vpcconnection.html#cfn-msk-vpcconnection-targetclusterarn
   */
  readonly targetClusterArn: string;

  /**
   * The VPC id of the remote client.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-vpcconnection.html#cfn-msk-vpcconnection-vpcid
   */
  readonly vpcId: string;
}

/**
 * Determine whether the given properties match those of a `CfnVpcConnectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnVpcConnectionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVpcConnectionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authentication", cdk.requiredValidator)(properties.authentication));
  errors.collect(cdk.propertyValidator("authentication", cdk.validateString)(properties.authentication));
  errors.collect(cdk.propertyValidator("clientSubnets", cdk.requiredValidator)(properties.clientSubnets));
  errors.collect(cdk.propertyValidator("clientSubnets", cdk.listValidator(cdk.validateString))(properties.clientSubnets));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.requiredValidator)(properties.securityGroups));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("targetClusterArn", cdk.requiredValidator)(properties.targetClusterArn));
  errors.collect(cdk.propertyValidator("targetClusterArn", cdk.validateString)(properties.targetClusterArn));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"CfnVpcConnectionProps\"");
}

// @ts-ignore TS6133
function convertCfnVpcConnectionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVpcConnectionPropsValidator(properties).assertSuccess();
  return {
    "Authentication": cdk.stringToCloudFormation(properties.authentication),
    "ClientSubnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.clientSubnets),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "TargetClusterArn": cdk.stringToCloudFormation(properties.targetClusterArn),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnVpcConnectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcConnectionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcConnectionProps>();
  ret.addPropertyResult("authentication", "Authentication", (properties.Authentication != null ? cfn_parse.FromCloudFormation.getString(properties.Authentication) : undefined));
  ret.addPropertyResult("clientSubnets", "ClientSubnets", (properties.ClientSubnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ClientSubnets) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("targetClusterArn", "TargetClusterArn", (properties.TargetClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetClusterArn) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Resource Type definition for AWS::MSK::Replicator.
 *
 * @cloudformationResource AWS::MSK::Replicator
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-replicator.html
 */
export class CfnReplicator extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MSK::Replicator";

  /**
   * Build a CfnReplicator from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReplicator {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnReplicatorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnReplicator(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Amazon Resource Name (ARN) for the created replicator.
   *
   * @cloudformationAttribute ReplicatorArn
   */
  public readonly attrReplicatorArn: string;

  /**
   * The current version of the MSK replicator.
   */
  public currentVersion?: string;

  /**
   * A summary description of the replicator.
   */
  public description?: string;

  /**
   * Specifies a list of Kafka clusters which are targets of the replicator.
   */
  public kafkaClusters: Array<cdk.IResolvable | CfnReplicator.KafkaClusterProperty> | cdk.IResolvable;

  /**
   * A list of replication configurations, where each configuration targets a given source cluster to target cluster replication flow.
   */
  public replicationInfoList: Array<cdk.IResolvable | CfnReplicator.ReplicationInfoProperty> | cdk.IResolvable;

  /**
   * The name of the replicator.
   */
  public replicatorName: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role used by the replicator to access external resources.
   */
  public serviceExecutionRoleArn: string;

  /**
   * A collection of tags associated with a resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnReplicatorProps) {
    super(scope, id, {
      "type": CfnReplicator.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "kafkaClusters", this);
    cdk.requireProperty(props, "replicationInfoList", this);
    cdk.requireProperty(props, "replicatorName", this);
    cdk.requireProperty(props, "serviceExecutionRoleArn", this);

    this.attrReplicatorArn = cdk.Token.asString(this.getAtt("ReplicatorArn", cdk.ResolutionTypeHint.STRING));
    this.currentVersion = props.currentVersion;
    this.description = props.description;
    this.kafkaClusters = props.kafkaClusters;
    this.replicationInfoList = props.replicationInfoList;
    this.replicatorName = props.replicatorName;
    this.serviceExecutionRoleArn = props.serviceExecutionRoleArn;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "currentVersion": this.currentVersion,
      "description": this.description,
      "kafkaClusters": this.kafkaClusters,
      "replicationInfoList": this.replicationInfoList,
      "replicatorName": this.replicatorName,
      "serviceExecutionRoleArn": this.serviceExecutionRoleArn,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnReplicator.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnReplicatorPropsToCloudFormation(props);
  }
}

export namespace CfnReplicator {
  /**
   * Details of a Kafka cluster for replication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-kafkacluster.html
   */
  export interface KafkaClusterProperty {
    /**
     * Details of an Amazon MSK cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-kafkacluster.html#cfn-msk-replicator-kafkacluster-amazonmskcluster
     */
    readonly amazonMskCluster: CfnReplicator.AmazonMskClusterProperty | cdk.IResolvable;

    /**
     * Details of an Amazon VPC which has network connectivity to the Kafka cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-kafkacluster.html#cfn-msk-replicator-kafkacluster-vpcconfig
     */
    readonly vpcConfig: cdk.IResolvable | CfnReplicator.KafkaClusterClientVpcConfigProperty;
  }

  /**
   * Details of an Amazon MSK cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-amazonmskcluster.html
   */
  export interface AmazonMskClusterProperty {
    /**
     * The ARN of an Amazon MSK cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-amazonmskcluster.html#cfn-msk-replicator-amazonmskcluster-mskclusterarn
     */
    readonly mskClusterArn: string;
  }

  /**
   * Details of an Amazon VPC which has network connectivity to the Kafka cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-kafkaclusterclientvpcconfig.html
   */
  export interface KafkaClusterClientVpcConfigProperty {
    /**
     * The AWS security groups to associate with the elastic network interfaces in order to specify what the replicator has access to.
     *
     * If a security group is not specified, the default security group associated with the VPC is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-kafkaclusterclientvpcconfig.html#cfn-msk-replicator-kafkaclusterclientvpcconfig-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * The list of subnets to connect to in the virtual private cloud (VPC).
     *
     * AWS creates elastic network interfaces inside these subnets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-kafkaclusterclientvpcconfig.html#cfn-msk-replicator-kafkaclusterclientvpcconfig-subnetids
     */
    readonly subnetIds: Array<string>;
  }

  /**
   * Specifies configuration for replication between a source and target Kafka cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-replicationinfo.html
   */
  export interface ReplicationInfoProperty {
    /**
     * Configuration relating to consumer group replication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-replicationinfo.html#cfn-msk-replicator-replicationinfo-consumergroupreplication
     */
    readonly consumerGroupReplication: CfnReplicator.ConsumerGroupReplicationProperty | cdk.IResolvable;

    /**
     * Amazon Resource Name of the source Kafka cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-replicationinfo.html#cfn-msk-replicator-replicationinfo-sourcekafkaclusterarn
     */
    readonly sourceKafkaClusterArn: string;

    /**
     * The type of compression to use writing records to target Kafka cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-replicationinfo.html#cfn-msk-replicator-replicationinfo-targetcompressiontype
     */
    readonly targetCompressionType: string;

    /**
     * Amazon Resource Name of the target Kafka cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-replicationinfo.html#cfn-msk-replicator-replicationinfo-targetkafkaclusterarn
     */
    readonly targetKafkaClusterArn: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-replicationinfo.html#cfn-msk-replicator-replicationinfo-topicreplication
     */
    readonly topicReplication: cdk.IResolvable | CfnReplicator.TopicReplicationProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-topicreplication.html
   */
  export interface TopicReplicationProperty {
    /**
     * Whether to periodically configure remote topic ACLs to match their corresponding upstream topics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-topicreplication.html#cfn-msk-replicator-topicreplication-copyaccesscontrollistsfortopics
     */
    readonly copyAccessControlListsForTopics?: boolean | cdk.IResolvable;

    /**
     * Whether to periodically configure remote topics to match their corresponding upstream topics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-topicreplication.html#cfn-msk-replicator-topicreplication-copytopicconfigurations
     */
    readonly copyTopicConfigurations?: boolean | cdk.IResolvable;

    /**
     * Whether to periodically check for new topics and partitions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-topicreplication.html#cfn-msk-replicator-topicreplication-detectandcopynewtopics
     */
    readonly detectAndCopyNewTopics?: boolean | cdk.IResolvable;

    /**
     * List of regular expression patterns indicating the topics that should not be replicated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-topicreplication.html#cfn-msk-replicator-topicreplication-topicstoexclude
     */
    readonly topicsToExclude?: Array<string>;

    /**
     * List of regular expression patterns indicating the topics to copy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-topicreplication.html#cfn-msk-replicator-topicreplication-topicstoreplicate
     */
    readonly topicsToReplicate: Array<string>;
  }

  /**
   * Configuration relating to consumer group replication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-consumergroupreplication.html
   */
  export interface ConsumerGroupReplicationProperty {
    /**
     * List of regular expression patterns indicating the consumer groups that should not be replicated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-consumergroupreplication.html#cfn-msk-replicator-consumergroupreplication-consumergroupstoexclude
     */
    readonly consumerGroupsToExclude?: Array<string>;

    /**
     * List of regular expression patterns indicating the consumer groups to copy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-consumergroupreplication.html#cfn-msk-replicator-consumergroupreplication-consumergroupstoreplicate
     */
    readonly consumerGroupsToReplicate: Array<string>;

    /**
     * Whether to periodically check for new consumer groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-consumergroupreplication.html#cfn-msk-replicator-consumergroupreplication-detectandcopynewconsumergroups
     */
    readonly detectAndCopyNewConsumerGroups?: boolean | cdk.IResolvable;

    /**
     * Whether to periodically write the translated offsets to __consumer_offsets topic in target cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-msk-replicator-consumergroupreplication.html#cfn-msk-replicator-consumergroupreplication-synchroniseconsumergroupoffsets
     */
    readonly synchroniseConsumerGroupOffsets?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnReplicator`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-replicator.html
 */
export interface CfnReplicatorProps {
  /**
   * The current version of the MSK replicator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-replicator.html#cfn-msk-replicator-currentversion
   */
  readonly currentVersion?: string;

  /**
   * A summary description of the replicator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-replicator.html#cfn-msk-replicator-description
   */
  readonly description?: string;

  /**
   * Specifies a list of Kafka clusters which are targets of the replicator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-replicator.html#cfn-msk-replicator-kafkaclusters
   */
  readonly kafkaClusters: Array<cdk.IResolvable | CfnReplicator.KafkaClusterProperty> | cdk.IResolvable;

  /**
   * A list of replication configurations, where each configuration targets a given source cluster to target cluster replication flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-replicator.html#cfn-msk-replicator-replicationinfolist
   */
  readonly replicationInfoList: Array<cdk.IResolvable | CfnReplicator.ReplicationInfoProperty> | cdk.IResolvable;

  /**
   * The name of the replicator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-replicator.html#cfn-msk-replicator-replicatorname
   */
  readonly replicatorName: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role used by the replicator to access external resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-replicator.html#cfn-msk-replicator-serviceexecutionrolearn
   */
  readonly serviceExecutionRoleArn: string;

  /**
   * A collection of tags associated with a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-msk-replicator.html#cfn-msk-replicator-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AmazonMskClusterProperty`
 *
 * @param properties - the TypeScript properties of a `AmazonMskClusterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicatorAmazonMskClusterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mskClusterArn", cdk.requiredValidator)(properties.mskClusterArn));
  errors.collect(cdk.propertyValidator("mskClusterArn", cdk.validateString)(properties.mskClusterArn));
  return errors.wrap("supplied properties not correct for \"AmazonMskClusterProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicatorAmazonMskClusterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicatorAmazonMskClusterPropertyValidator(properties).assertSuccess();
  return {
    "MskClusterArn": cdk.stringToCloudFormation(properties.mskClusterArn)
  };
}

// @ts-ignore TS6133
function CfnReplicatorAmazonMskClusterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicator.AmazonMskClusterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicator.AmazonMskClusterProperty>();
  ret.addPropertyResult("mskClusterArn", "MskClusterArn", (properties.MskClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.MskClusterArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KafkaClusterClientVpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KafkaClusterClientVpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicatorKafkaClusterClientVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"KafkaClusterClientVpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicatorKafkaClusterClientVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicatorKafkaClusterClientVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnReplicatorKafkaClusterClientVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReplicator.KafkaClusterClientVpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicator.KafkaClusterClientVpcConfigProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
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
function CfnReplicatorKafkaClusterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amazonMskCluster", cdk.requiredValidator)(properties.amazonMskCluster));
  errors.collect(cdk.propertyValidator("amazonMskCluster", CfnReplicatorAmazonMskClusterPropertyValidator)(properties.amazonMskCluster));
  errors.collect(cdk.propertyValidator("vpcConfig", cdk.requiredValidator)(properties.vpcConfig));
  errors.collect(cdk.propertyValidator("vpcConfig", CfnReplicatorKafkaClusterClientVpcConfigPropertyValidator)(properties.vpcConfig));
  return errors.wrap("supplied properties not correct for \"KafkaClusterProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicatorKafkaClusterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicatorKafkaClusterPropertyValidator(properties).assertSuccess();
  return {
    "AmazonMskCluster": convertCfnReplicatorAmazonMskClusterPropertyToCloudFormation(properties.amazonMskCluster),
    "VpcConfig": convertCfnReplicatorKafkaClusterClientVpcConfigPropertyToCloudFormation(properties.vpcConfig)
  };
}

// @ts-ignore TS6133
function CfnReplicatorKafkaClusterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReplicator.KafkaClusterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicator.KafkaClusterProperty>();
  ret.addPropertyResult("amazonMskCluster", "AmazonMskCluster", (properties.AmazonMskCluster != null ? CfnReplicatorAmazonMskClusterPropertyFromCloudFormation(properties.AmazonMskCluster) : undefined));
  ret.addPropertyResult("vpcConfig", "VpcConfig", (properties.VpcConfig != null ? CfnReplicatorKafkaClusterClientVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TopicReplicationProperty`
 *
 * @param properties - the TypeScript properties of a `TopicReplicationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicatorTopicReplicationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("copyAccessControlListsForTopics", cdk.validateBoolean)(properties.copyAccessControlListsForTopics));
  errors.collect(cdk.propertyValidator("copyTopicConfigurations", cdk.validateBoolean)(properties.copyTopicConfigurations));
  errors.collect(cdk.propertyValidator("detectAndCopyNewTopics", cdk.validateBoolean)(properties.detectAndCopyNewTopics));
  errors.collect(cdk.propertyValidator("topicsToExclude", cdk.listValidator(cdk.validateString))(properties.topicsToExclude));
  errors.collect(cdk.propertyValidator("topicsToReplicate", cdk.requiredValidator)(properties.topicsToReplicate));
  errors.collect(cdk.propertyValidator("topicsToReplicate", cdk.listValidator(cdk.validateString))(properties.topicsToReplicate));
  return errors.wrap("supplied properties not correct for \"TopicReplicationProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicatorTopicReplicationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicatorTopicReplicationPropertyValidator(properties).assertSuccess();
  return {
    "CopyAccessControlListsForTopics": cdk.booleanToCloudFormation(properties.copyAccessControlListsForTopics),
    "CopyTopicConfigurations": cdk.booleanToCloudFormation(properties.copyTopicConfigurations),
    "DetectAndCopyNewTopics": cdk.booleanToCloudFormation(properties.detectAndCopyNewTopics),
    "TopicsToExclude": cdk.listMapper(cdk.stringToCloudFormation)(properties.topicsToExclude),
    "TopicsToReplicate": cdk.listMapper(cdk.stringToCloudFormation)(properties.topicsToReplicate)
  };
}

// @ts-ignore TS6133
function CfnReplicatorTopicReplicationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReplicator.TopicReplicationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicator.TopicReplicationProperty>();
  ret.addPropertyResult("copyAccessControlListsForTopics", "CopyAccessControlListsForTopics", (properties.CopyAccessControlListsForTopics != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyAccessControlListsForTopics) : undefined));
  ret.addPropertyResult("copyTopicConfigurations", "CopyTopicConfigurations", (properties.CopyTopicConfigurations != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTopicConfigurations) : undefined));
  ret.addPropertyResult("detectAndCopyNewTopics", "DetectAndCopyNewTopics", (properties.DetectAndCopyNewTopics != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DetectAndCopyNewTopics) : undefined));
  ret.addPropertyResult("topicsToExclude", "TopicsToExclude", (properties.TopicsToExclude != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TopicsToExclude) : undefined));
  ret.addPropertyResult("topicsToReplicate", "TopicsToReplicate", (properties.TopicsToReplicate != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TopicsToReplicate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConsumerGroupReplicationProperty`
 *
 * @param properties - the TypeScript properties of a `ConsumerGroupReplicationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicatorConsumerGroupReplicationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("consumerGroupsToExclude", cdk.listValidator(cdk.validateString))(properties.consumerGroupsToExclude));
  errors.collect(cdk.propertyValidator("consumerGroupsToReplicate", cdk.requiredValidator)(properties.consumerGroupsToReplicate));
  errors.collect(cdk.propertyValidator("consumerGroupsToReplicate", cdk.listValidator(cdk.validateString))(properties.consumerGroupsToReplicate));
  errors.collect(cdk.propertyValidator("detectAndCopyNewConsumerGroups", cdk.validateBoolean)(properties.detectAndCopyNewConsumerGroups));
  errors.collect(cdk.propertyValidator("synchroniseConsumerGroupOffsets", cdk.validateBoolean)(properties.synchroniseConsumerGroupOffsets));
  return errors.wrap("supplied properties not correct for \"ConsumerGroupReplicationProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicatorConsumerGroupReplicationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicatorConsumerGroupReplicationPropertyValidator(properties).assertSuccess();
  return {
    "ConsumerGroupsToExclude": cdk.listMapper(cdk.stringToCloudFormation)(properties.consumerGroupsToExclude),
    "ConsumerGroupsToReplicate": cdk.listMapper(cdk.stringToCloudFormation)(properties.consumerGroupsToReplicate),
    "DetectAndCopyNewConsumerGroups": cdk.booleanToCloudFormation(properties.detectAndCopyNewConsumerGroups),
    "SynchroniseConsumerGroupOffsets": cdk.booleanToCloudFormation(properties.synchroniseConsumerGroupOffsets)
  };
}

// @ts-ignore TS6133
function CfnReplicatorConsumerGroupReplicationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicator.ConsumerGroupReplicationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicator.ConsumerGroupReplicationProperty>();
  ret.addPropertyResult("consumerGroupsToExclude", "ConsumerGroupsToExclude", (properties.ConsumerGroupsToExclude != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ConsumerGroupsToExclude) : undefined));
  ret.addPropertyResult("consumerGroupsToReplicate", "ConsumerGroupsToReplicate", (properties.ConsumerGroupsToReplicate != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ConsumerGroupsToReplicate) : undefined));
  ret.addPropertyResult("detectAndCopyNewConsumerGroups", "DetectAndCopyNewConsumerGroups", (properties.DetectAndCopyNewConsumerGroups != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DetectAndCopyNewConsumerGroups) : undefined));
  ret.addPropertyResult("synchroniseConsumerGroupOffsets", "SynchroniseConsumerGroupOffsets", (properties.SynchroniseConsumerGroupOffsets != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SynchroniseConsumerGroupOffsets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicatorReplicationInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("consumerGroupReplication", cdk.requiredValidator)(properties.consumerGroupReplication));
  errors.collect(cdk.propertyValidator("consumerGroupReplication", CfnReplicatorConsumerGroupReplicationPropertyValidator)(properties.consumerGroupReplication));
  errors.collect(cdk.propertyValidator("sourceKafkaClusterArn", cdk.requiredValidator)(properties.sourceKafkaClusterArn));
  errors.collect(cdk.propertyValidator("sourceKafkaClusterArn", cdk.validateString)(properties.sourceKafkaClusterArn));
  errors.collect(cdk.propertyValidator("targetCompressionType", cdk.requiredValidator)(properties.targetCompressionType));
  errors.collect(cdk.propertyValidator("targetCompressionType", cdk.validateString)(properties.targetCompressionType));
  errors.collect(cdk.propertyValidator("targetKafkaClusterArn", cdk.requiredValidator)(properties.targetKafkaClusterArn));
  errors.collect(cdk.propertyValidator("targetKafkaClusterArn", cdk.validateString)(properties.targetKafkaClusterArn));
  errors.collect(cdk.propertyValidator("topicReplication", cdk.requiredValidator)(properties.topicReplication));
  errors.collect(cdk.propertyValidator("topicReplication", CfnReplicatorTopicReplicationPropertyValidator)(properties.topicReplication));
  return errors.wrap("supplied properties not correct for \"ReplicationInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicatorReplicationInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicatorReplicationInfoPropertyValidator(properties).assertSuccess();
  return {
    "ConsumerGroupReplication": convertCfnReplicatorConsumerGroupReplicationPropertyToCloudFormation(properties.consumerGroupReplication),
    "SourceKafkaClusterArn": cdk.stringToCloudFormation(properties.sourceKafkaClusterArn),
    "TargetCompressionType": cdk.stringToCloudFormation(properties.targetCompressionType),
    "TargetKafkaClusterArn": cdk.stringToCloudFormation(properties.targetKafkaClusterArn),
    "TopicReplication": convertCfnReplicatorTopicReplicationPropertyToCloudFormation(properties.topicReplication)
  };
}

// @ts-ignore TS6133
function CfnReplicatorReplicationInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReplicator.ReplicationInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicator.ReplicationInfoProperty>();
  ret.addPropertyResult("consumerGroupReplication", "ConsumerGroupReplication", (properties.ConsumerGroupReplication != null ? CfnReplicatorConsumerGroupReplicationPropertyFromCloudFormation(properties.ConsumerGroupReplication) : undefined));
  ret.addPropertyResult("sourceKafkaClusterArn", "SourceKafkaClusterArn", (properties.SourceKafkaClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceKafkaClusterArn) : undefined));
  ret.addPropertyResult("targetCompressionType", "TargetCompressionType", (properties.TargetCompressionType != null ? cfn_parse.FromCloudFormation.getString(properties.TargetCompressionType) : undefined));
  ret.addPropertyResult("targetKafkaClusterArn", "TargetKafkaClusterArn", (properties.TargetKafkaClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetKafkaClusterArn) : undefined));
  ret.addPropertyResult("topicReplication", "TopicReplication", (properties.TopicReplication != null ? CfnReplicatorTopicReplicationPropertyFromCloudFormation(properties.TopicReplication) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnReplicatorProps`
 *
 * @param properties - the TypeScript properties of a `CfnReplicatorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicatorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("currentVersion", cdk.validateString)(properties.currentVersion));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("kafkaClusters", cdk.requiredValidator)(properties.kafkaClusters));
  errors.collect(cdk.propertyValidator("kafkaClusters", cdk.listValidator(CfnReplicatorKafkaClusterPropertyValidator))(properties.kafkaClusters));
  errors.collect(cdk.propertyValidator("replicationInfoList", cdk.requiredValidator)(properties.replicationInfoList));
  errors.collect(cdk.propertyValidator("replicationInfoList", cdk.listValidator(CfnReplicatorReplicationInfoPropertyValidator))(properties.replicationInfoList));
  errors.collect(cdk.propertyValidator("replicatorName", cdk.requiredValidator)(properties.replicatorName));
  errors.collect(cdk.propertyValidator("replicatorName", cdk.validateString)(properties.replicatorName));
  errors.collect(cdk.propertyValidator("serviceExecutionRoleArn", cdk.requiredValidator)(properties.serviceExecutionRoleArn));
  errors.collect(cdk.propertyValidator("serviceExecutionRoleArn", cdk.validateString)(properties.serviceExecutionRoleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnReplicatorProps\"");
}

// @ts-ignore TS6133
function convertCfnReplicatorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicatorPropsValidator(properties).assertSuccess();
  return {
    "CurrentVersion": cdk.stringToCloudFormation(properties.currentVersion),
    "Description": cdk.stringToCloudFormation(properties.description),
    "KafkaClusters": cdk.listMapper(convertCfnReplicatorKafkaClusterPropertyToCloudFormation)(properties.kafkaClusters),
    "ReplicationInfoList": cdk.listMapper(convertCfnReplicatorReplicationInfoPropertyToCloudFormation)(properties.replicationInfoList),
    "ReplicatorName": cdk.stringToCloudFormation(properties.replicatorName),
    "ServiceExecutionRoleArn": cdk.stringToCloudFormation(properties.serviceExecutionRoleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnReplicatorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicatorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicatorProps>();
  ret.addPropertyResult("currentVersion", "CurrentVersion", (properties.CurrentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentVersion) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("kafkaClusters", "KafkaClusters", (properties.KafkaClusters != null ? cfn_parse.FromCloudFormation.getArray(CfnReplicatorKafkaClusterPropertyFromCloudFormation)(properties.KafkaClusters) : undefined));
  ret.addPropertyResult("replicationInfoList", "ReplicationInfoList", (properties.ReplicationInfoList != null ? cfn_parse.FromCloudFormation.getArray(CfnReplicatorReplicationInfoPropertyFromCloudFormation)(properties.ReplicationInfoList) : undefined));
  ret.addPropertyResult("replicatorName", "ReplicatorName", (properties.ReplicatorName != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicatorName) : undefined));
  ret.addPropertyResult("serviceExecutionRoleArn", "ServiceExecutionRoleArn", (properties.ServiceExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceExecutionRoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}