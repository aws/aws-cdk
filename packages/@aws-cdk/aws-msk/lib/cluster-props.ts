import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as core from '@aws-cdk/core';
import { KafkaVersion } from './';

/**
 *  Properties for a MSK Cluster
 */
export interface ClusterProps {
  /**
   * Properties to be used for brokers in the cluster.
   */
  readonly brokerNodeGroupProps: BrokerNodeGroupProps;
  /**
   * The physical name of the cluster.
   */
  readonly clusterName: string;
  /**
   * The version of Apache Kafka.
   *
   * @default - 2.2.1
   */
  readonly kafkaVersion?: KafkaVersion;
  /**
   * Number of Apache Kafka brokers deployed in each Availability Zone.
   *
   * @default 1
   */
  readonly numberOfBrokerNodes?: number;
  /**
   * The Amazon MSK configuration to use for the cluster.
   *
   * @default - none
   */
  readonly configurationInfo?: ClusterConfigurationInfo;
  /**
   * Cluster monitoring configuration.
   *
   * @default - DEFAULT monitoring level
   */
  readonly monitoringConfiguration?: MonitoringConfiguration;
  /**
   * Configure your MSK cluster to send broker logs to different destination types.
   *
   * @default - disabled
   */
  readonly brokerLoggingConfiguration?: BrokerLoggingConfiguration;
  /**
   * Config details for encryption in transit.
   *
   * @default - enabled
   */
  readonly encryptionInTransitConfig?: EncryptionInTransitConfig;
  /**
   * Configuration properties for client authentication.
   * MSK supports using private TLS certificates or SASL/SCRAM to authenticate the identity of clients.
   *
   * @default - disabled
   */
  readonly clientAuthenticationConfiguration?: ClientAuthenticationConfig;
  /**
   * What to do when this resource is deleted from a stack.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: core.RemovalPolicy;
}

/**
 * Properties to be used for brokers in the cluster.
 */
export interface BrokerNodeGroupProps {
  /**
   * Defines the virtual networking environment for this cluster.
   * Must have at least 2 subnets in two different AZs.
   */
  readonly vpc: ec2.IVpc;
  /**
   * Where to place the nodes within the VPC.
   * Amazon MSK distributes the broker nodes evenly across the subnets that you specify.
   * The subnets that you specify must be in distinct Availability Zones.
   * Client subnets can't be in Availability Zone us-east-1e.
   *
   * @default - the Vpc default strategy if not specified.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;
  /**
   * The EC2 instance type that you want Amazon MSK to use when it creates your brokers.
   *
   * @see https://docs.aws.amazon.com/msk/latest/developerguide/msk-create-cluster.html#broker-instance-types
   * @default kafka.m5.large
   */
  readonly instanceType?: ec2.InstanceType;
  /**
   * The AWS security groups to associate with the elastic network interfaces in order to specify who can
   * connect to and communicate with the Amazon MSK cluster.
   *
   * @default - create new security group
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
  /**
   * Information about storage volumes attached to MSK broker nodes.
   *
   * @default - 1000 GiB EBS volume
   */
  readonly storageInfo?: StorageInfo;
  /**
   * The distribution of broker nodes across Availability Zones. This is an optional parameter. If you don't
   * specify it, Amazon MSK gives it the value DEFAULT.
   * You can also explicitly set this parameter to the value DEFAULT.
   *
   * **No other values are currently allowed.**
   *
   * @default - DEFAULT
   */
  readonly brokerAzDistribution?: string;
}

/**
 * Information about storage volumes attached to MSK broker nodes.
 */
export interface StorageInfo {
  /**
   * EBS volume information.
   *
   * @default - 1000 GiB volume size
   */
  readonly ebsStorageInfo?: EbsStorageInfo;
}

/**
 * EBS volume information.
 */
export interface EbsStorageInfo {
  /**
   * The size in GiB of the EBS volume for the data drive on each broker node.
   *
   * @default 1000
   */
  readonly volumeSize?: number;
  /**
   * The AWS KMS key for encrypting data at rest.
   *
   * @default Uses AWS managed CMK (aws/kafka)
   */
  readonly kmsKey?: kms.IKey;
}

/**
 * The Amazon MSK configuration to use for the cluster.
 * Note: There is currently no Cloudformation Resource to create a Configuration
 */
export interface ClusterConfigurationInfo {
  /**
   * The Amazon Resource Name (ARN) of the MSK configuration to use.
   * For example, arn:aws:kafka:us-east-1:123456789012:configuration/example-configuration-name/abcdabcd-1234-abcd-1234-abcd123e8e8e-1.
   */
  readonly arn: string;
  /**
   * The revision of the Amazon MSK configuration to use.
   */
  readonly revision: number;
}

/**
 * The level of monitoring for the MSK cluster
 *
 * @see https://docs.aws.amazon.com/msk/latest/developerguide/monitoring.html#metrics-details
 */
export enum ClusterMonitoringLevel {
  /**
   * Default metrics are the essential metrics to monitor.
   */
  DEFAULT = 'DEFAULT',
  /**
   * Per Broker metrics give you metrics at the broker level.
   */
  PER_BROKER = 'PER_BROKER',
  /**
   * Per Topic Per Broker metrics help you understand volume at the topic level,
   */
  PER_TOPIC_PER_BROKER = 'PER_TOPIC_PER_BROKER',
}

/**
 * Monitoring Configuration
 */
export interface MonitoringConfiguration {
  /**
   * Specifies the level of monitoring for the MSK cluster.
   *
   * @default DEFAULT
   */
  readonly clusterMonitoringLevel?: ClusterMonitoringLevel;
  /**
   * Indicates whether you want to enable or disable the JMX Exporter.
   *
   * @default false
   */
  readonly enableJmxExporter?: boolean;
  /**
   * Indicates whether you want to enable or disable the Prometheus Node Exporter.
   *
   * You can use the Prometheus Node Exporter to get CPU and disk metrics for the broker nodes.
   *
   * @default false
   */
  readonly enablePrometheusNodeExporter?: boolean;
}

/**
 * Configuration details related to broker logs.
 */
export interface BrokerLoggingConfiguration {
  /**
   * The Kinesis Data Firehose delivery stream that is the destination for broker logs.
   *
   * @default - disabled
   */
  readonly firehoseDeliveryStreamArn?: string;
  /**
   * The CloudWatch Logs group that is the destination for broker logs.
   *
   * @default - disabled
   */
  readonly cloudwatchLogGroup?: logs.ILogGroup;
  /**
   * Details of the Amazon S3 destination for broker logs.
   *
   * @default - disabled
   */
  readonly s3?: S3LoggingConfiguration;
}

/**
 * Details of the Amazon S3 destination for broker logs.
 */
export interface S3LoggingConfiguration {
  /**
   * The S3 bucket that is the destination for broker logs.
   */
  readonly bucket: s3.IBucket;
  /**
   * The S3 prefix that is the destination for broker logs.
   *
   * @default - no prefix
   */
  readonly prefix?: string;
}

/**
 * Indicates the encryption setting for data in transit between clients and brokers.
 */
export enum ClientBrokerEncryption {
  /**
   * TLS means that client-broker communication is enabled with TLS only.
   */
  TLS = 'TLS',
  /**
   * TLS_PLAINTEXT means that client-broker communication is enabled for both TLS-encrypted, as well as plaintext data.
   */
  TLS_PLAINTEXT = 'TLS_PLAINTEXT',
  /**
   * PLAINTEXT means that client-broker communication is enabled in plaintext only.
   */
  PLAINTEXT = 'PLAINTEXT',
}

/**
 * The settings for encrypting data in transit.
 *
 * @see https://docs.aws.amazon.com/msk/latest/developerguide/msk-encryption.html#msk-encryption-in-transit
 */
export interface EncryptionInTransitConfig {
  /**
   * Indicates the encryption setting for data in transit between clients and brokers.
   *
   * @default - TLS
   */
  readonly clientBroker?: ClientBrokerEncryption;
  /**
   * Indicates that data communication among the broker nodes of the cluster is encrypted.
   *
   * @default true
   */
  readonly enableInCluster?: boolean;
}

/**
 * Configuration properties for client authentication.
 */
export interface ClientAuthenticationConfig {
  /**
   * SASL authentication configuration
   *
   * @default - disabled
   */
  readonly sasl?: SaslAuthConfig;
  /**
   * TLS authentication configuration
   *
   * @default - disabled
   */
  readonly tls?: TlsAuthConfig;
}

/**
 * SASL authentication configuration
 */
export interface SaslAuthConfig {
  /**
   * Enable SASL/SCRAM authentication.
   *
   * @default false
   */
  readonly scram?: boolean;
  /**
   * KMS Key to encrypt SASL/SCRAM secrets.
   *
   * You must use a customer master key (CMK) when creating users in secrets manager.
   * You cannot use a Secret with Amazon MSK that uses the default Secrets Manager encryption key.
   *
   * @default - CMK will be created with alias msk/sasl/scram
   */
  readonly key?: kms.IKey;
}

/**
 * TLS authentication configuration
 */
export interface TlsAuthConfig {
  /**
   * List of ACM Certificate Authorities to enable TLS authentication.
   *
   * @default - none
   */
  readonly certificateAuthorityArns?: string[];
}
