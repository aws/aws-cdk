import * as ec2 from '@aws-cdk/aws-ec2';
import * as core from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as constructs from 'constructs'
import {
  CfnCluster,
  KafkaVersion,
  ClusterProps,
  ClientBrokerEncryption,
} from './';

/**
 * Represents a MSK Cluster
 */
export interface ICluster extends core.IResource, ec2.IConnectable {
  /**
   * The ARN of cluster.
   *
   * @attribute
   */
  readonly clusterArn: string;

  /**
   * The physical name of the cluster.
   *
   * @attribute
   */
  readonly clusterName: string;
}

/**
 * A new or imported MSK Cluster.
 */
abstract class ClusterBase extends core.Resource implements ICluster {
  public abstract readonly clusterArn: string;
  public abstract readonly clusterName: string;
  /** @internal */
  protected _connections: ec2.Connections | undefined;

  /** Manages connections for the cluster */
  public get connections(): ec2.Connections {
    if (!this._connections) {
      throw new Error('An imported Cluster cannot manage its security groups');
    }
    return this._connections;
  }
}

/**
 * Create a MSK Cluster.
 *
 * @resource AWS::MSK::Cluster
 */
export class Cluster extends ClusterBase {
  /**
   * Reference an existing cluster, defined outside of the CDK code, by name.
   */
  public static fromClusterArn(
    scope: constructs.Construct,
    id: string,
    clusterArn: string,
  ): ICluster {
    class Import extends ClusterBase {
      public readonly clusterArn = clusterArn;
      public readonly clusterName = clusterArn.split('/')[1]; // ['arn:partition:kafka:region:account-id', clusterName, clusterId]
    }

    return new Import(scope, id);
  }

  public readonly clusterArn: string;
  public readonly clusterName: string;

  constructor(scope: constructs.Construct, id: string, props: ClusterProps) {
    super(scope, id, {
      physicalName: props.clusterName,
    });

    const brokerNodeGroupProps = props.brokerNodeGroupProps;

    const subnetSelection = brokerNodeGroupProps.vpc.selectSubnets({
      ...brokerNodeGroupProps.vpcSubnets,
    });

    this._connections = new ec2.Connections({
      securityGroups: brokerNodeGroupProps.securityGroups ?? [
        new ec2.SecurityGroup(this, 'SecurityGroup', {
          description: 'MSK security group',
          vpc: brokerNodeGroupProps.vpc,
        }),
      ],
    });

    if (subnetSelection.subnets.length < 2) {
      core.Annotations.of(this).addError(
        `Cluster requires at least 2 subnets, got ${subnetSelection.subnets.length}`,
      );
    }

    if (
      props.clusterName !== undefined &&
      !core.Token.isUnresolved(props.clusterName) &&
      !/^[a-zA-Z0-9]+$/.test(props.clusterName) &&
      props.clusterName.length > 64
    ) {
      core.Annotations.of(this).addError(
        'The cluster name must only contain alphanumeric characters and have a maximum length of 64 characters.' +
          `got: '${props.clusterName}. length: ${props.clusterName.length}'`,
      );
    }

    if (
      props.encryptionInTransitConfig?.clientBroker ===
        ClientBrokerEncryption.TLS &&
      !props.encryptionInTransitConfig.certificateAuthorityArns
    ) {
      core.Annotations.of(this).addError(
        'When allowing only TLS encrypted traffic between clients and brokers you must supply a ACM Private CA ARN, otherwise you will not be able to authenticate with the cluster. See - https://docs.aws.amazon.com/msk/latest/developerguide/msk-authentication.html',
      );
    }
    const volumeSize =
      brokerNodeGroupProps.storageInfo?.ebsStorageInfo?.volumeSize;
    // Minimum: 1 GiB, maximum: 16384 GiB
    if (volumeSize && volumeSize < 1 && volumeSize > 16384) {
      core.Annotations.of(this).addError(
        'EBS volume size should be in the range 1-16384',
      );
    }

    const instanceType = brokerNodeGroupProps.instanceType
      ? this.mskInstanceType(brokerNodeGroupProps.instanceType)
      : this.mskInstanceType(
        ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      );

    const encryptionAtRest = brokerNodeGroupProps.storageInfo?.ebsStorageInfo
      ?.kmsKey
      ? {
        dataVolumeKmsKeyId:
            brokerNodeGroupProps.storageInfo.ebsStorageInfo.kmsKey.keyId,
      }
      : undefined; // MSK will create the managed key

    const encryptionInTransit = {
      clientBroker:
        props.encryptionInTransitConfig?.clientBroker ??
        ClientBrokerEncryption.TLS_PLAINTEXT,
      inCluster: props.encryptionInTransitConfig?.enableInCluster ?? true,
    };

    const openMonitoring =
      props.monitoringConfiguration?.enableJmxExporter ||
      props.monitoringConfiguration?.enablePrometheusNodeExporter
        ? {
          prometheus: {
            jmxExporter: props.monitoringConfiguration?.enableJmxExporter
              ? { enabledInBroker: true }
              : undefined,
            nodeExporter: props.monitoringConfiguration
                ?.enablePrometheusNodeExporter
              ? { enabledInBroker: true }
              : undefined,
          },
        }
        : undefined;

    const loggingInfo = {
      brokerLogs: {
        cloudWatchLogs: {
          enabled:
            props.brokerLoggingConfiguration?.cloudwatchLogGroup !== undefined,
          logGroup:
            props.brokerLoggingConfiguration?.cloudwatchLogGroup?.logGroupName,
        },
        firehose: {
          enabled:
            props.brokerLoggingConfiguration?.firehoseDeliveryStreamArn !==
            undefined,
          deliveryStream:
            props.brokerLoggingConfiguration?.firehoseDeliveryStreamArn,
        },
        s3: {
          enabled: props.brokerLoggingConfiguration?.s3?.bucket !== undefined,
          bucket: props.brokerLoggingConfiguration?.s3?.bucket.bucketName,
          prefix: props.brokerLoggingConfiguration?.s3?.prefix,
        },
      },
    };

    const resource = new CfnCluster(this, 'Resource', {
      clusterName: this.physicalName,
      kafkaVersion:
        props.kafkaVersion?.version ?? KafkaVersion.of('2.2.1').version,
      numberOfBrokerNodes:
        props.numberOfBrokerNodes !== undefined ? props.numberOfBrokerNodes : 1,
      brokerNodeGroupInfo: {
        instanceType,
        brokerAzDistribution:
          brokerNodeGroupProps.brokerAzDistribution || 'DEFAULT',
        clientSubnets: subnetSelection.subnetIds,
        securityGroups: this.connections.securityGroups.map(
          (group) => group.securityGroupId,
        ),
        storageInfo: {
          ebsStorageInfo: {
            volumeSize: volumeSize || 1000,
          },
        },
      },
      encryptionInfo: {
        encryptionAtRest,
        encryptionInTransit,
      },
      configurationInfo: props.configurationInfo,
      enhancedMonitoring: props.monitoringConfiguration?.clusterMonitoringLevel,
      openMonitoring: openMonitoring,
      loggingInfo: loggingInfo,
      clientAuthentication: {
        tls: {
          certificateAuthorityArnList:
            props.encryptionInTransitConfig?.certificateAuthorityArns,
        },
      },
    });

    this.clusterName = this.getResourceNameAttribute(
      core.Fn.select(1, core.Fn.split('/', resource.ref)),
    );
    this.clusterArn = resource.ref;

    resource.applyRemovalPolicy(props.removalPolicy, {
      default: core.RemovalPolicy.RETAIN,
    });
  }

  private mskInstanceType(instanceType: ec2.InstanceType): string {
    return `kafka.${instanceType.toString()}`;
  }

  /**
   * Get the ZooKeeper Connection string
   *
   * Uses a Custom Resource to make an API call to `describeCluster` using the Javascript SDK
   *
   * @returns - The connection string to use to connect to the Apache ZooKeeper cluster.
   */
  public get zookeeperConnectionString(): string {
    const zookeeperConnect = new cr.AwsCustomResource(
      this,
      'ZookeeperConnect',
      {
        onUpdate: {
          service: 'Kafka',
          action: 'describeCluster',
          parameters: {
            ClusterArn: this.clusterArn,
          },
          physicalResourceId: cr.PhysicalResourceId.of(
            'ZooKeeperConnectionString',
          ),
        },
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: [this.clusterArn],
        }),
      },
    );

    return zookeeperConnect.getResponseField(
      'ClusterInfo.ZookeeperConnectString',
    );
  }

  /**
   * Get the list of brokers that a client application can use to bootstrap
   *
   * Uses a Custom Resource to make an API call to `getBootstrapBrokers` using the Javascript SDK
   *
   * @returns - A string containing one or more hostname:port pairs.
   */
  public get bootstrapBrokers(): string {
    const bootstrapBrokers = new cr.AwsCustomResource(
      this,
      'BootstrapBrokers',
      {
        onUpdate: {
          service: 'Kafka',
          action: 'getBootstrapBrokers',
          parameters: {
            ClusterArn: this.clusterArn,
          },
          physicalResourceId: cr.PhysicalResourceId.of('BootstrapBrokers'),
        },
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: [this.clusterArn],
        }),
      },
    );

    return bootstrapBrokers.getResponseField('BootstrapBrokerString');
  }

  /**
   * Get the list of brokers that a client application can use to bootstrap
   *
   * Uses a Custom Resource to make an API call to `getBootstrapBrokers` using the Javascript SDK
   *
   * @returns - A string containing one or more DNS names (or IP) and TLS port pairs.
   */
  public get bootstrapBrokersTls(): string {
    const bootstrapBrokers = new cr.AwsCustomResource(
      this,
      'BootstrapBrokers',
      {
        onUpdate: {
          service: 'Kafka',
          action: 'getBootstrapBrokers',
          parameters: {
            ClusterArn: this.clusterArn,
          },
          physicalResourceId: cr.PhysicalResourceId.of('BootstrapBrokers'),
        },
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: [this.clusterArn],
        }),
      },
    );

    return bootstrapBrokers.getResponseField('BootstrapBrokerStringTls');
  }
}
