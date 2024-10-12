import { Construct } from 'constructs';
import * as elasticache from './elasticache.generated';
import * as ec2 from '../aws-ec2';
import * as kms from '../aws-kms';
import { Resource, ResourceProps, Tags, Duration, IResolvable } from '../core';

export enum CacheEngine {
  REDIS = 'redis',
  MEMCACHED = 'memcached'
}

export enum CacheClusterStatus {
  AVAILABLE = 'available',
  CREATING = 'creating',
  DELETED = 'deleted',
  DELETING = 'deleting',
  INCOMPATIBLE_NETWORK = 'incompatible-network',
  MODIFYING = 'modifying',
  REBOOTING_CLUSTER_NODES = 'rebooting-cluster-nodes',
  RESTORE_FAILED = 'restore-failed',
  SNAPSHOTTING = 'snapshotting'
}

export interface ElastiCacheClusterProps {
  readonly vpc: ec2.IVpc;
  readonly engine: CacheEngine;
  readonly cacheNodeType: string;
  readonly numCacheNodes: number;

  readonly clusterName?: string;
  readonly engineVersion?: string;
  readonly port?: number;
  readonly subnetGroup?: elasticache.CfnSubnetGroup;
  readonly securityGroups?: ec2.ISecurityGroup[];
  readonly cacheParameterGroupName?: string;
  readonly autoMinorVersionUpgrade?: boolean;
  readonly azMode?: string;
  readonly preferredAvailabilityZone?: string;
  readonly preferredAvailabilityZones?: string[];
  readonly preferredMaintenanceWindow?: string;
  readonly notificationTopicArn?: string;
  readonly snapshotArns?: string[];
  readonly snapshotName?: string;
  readonly snapshotRetentionLimit?: number;
  readonly snapshotWindow?: string;
  readonly tags?: { [key: string]: string };
  readonly encryption?: {
    atRest: boolean;
    inTransit: boolean;
    kmsKey?: kms.IKey;
  };
  readonly backups?: {
    retention: Duration;
    preferredWindow?: string;
  };
}

export class ElastiCacheCluster extends Resource {
  public readonly cluster: elasticache.CfnCacheCluster;
  public readonly connections: ec2.Connections;
  private readonly securityGroup: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props: ElastiCacheClusterProps) {
    super(scope, id);

    const port = props.port ?? (props.engine === CacheEngine.REDIS ? 6379 : 11211);

    this.securityGroup = props.securityGroups?.[0] ?? new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
      description: 'Security group for ElastiCache cluster',
      allowAllOutbound: true,
    });

    const subnetGroup = props.subnetGroup ?? new elasticache.CfnSubnetGroup(this, 'SubnetGroup', {
      description: 'Subnet group for ElastiCache cluster',
      subnetIds: props.vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }).subnetIds,
    });

    this.cluster = new elasticache.CfnCacheCluster(this, 'Resource', {
      clusterName: props.clusterName,
      engine: props.engine,
      engineVersion: props.engineVersion,
      cacheNodeType: props.cacheNodeType,
      numCacheNodes: props.numCacheNodes,
      port,
      cacheSubnetGroupName: subnetGroup.ref,
      vpcSecurityGroupIds: [this.securityGroup.securityGroupId],
      cacheParameterGroupName: props.cacheParameterGroupName,
      autoMinorVersionUpgrade: props.autoMinorVersionUpgrade,
      azMode: props.azMode,
      preferredAvailabilityZone: props.preferredAvailabilityZone,
      preferredAvailabilityZones: props.preferredAvailabilityZones,
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      notificationTopicArn: props.notificationTopicArn,
      snapshotArns: props.snapshotArns,
      snapshotName: props.snapshotName,
      snapshotRetentionLimit: props.snapshotRetentionLimit,
      snapshotWindow: props.snapshotWindow,
    });

    if (props.encryption) {
      this.cluster.atRestEncryptionEnabled = props.encryption.atRest;
      this.cluster.transitEncryptionEnabled = props.encryption.inTransit;
      if (props.encryption.kmsKey) {
        this.cluster.kmsKeyId = props.encryption.kmsKey.keyId;
      }
    }

    if (props.backups) {
      this.cluster.snapshotRetentionLimit = props.backups.retention.toDays();
      if (props.backups.preferredWindow) {
        this.cluster.snapshotWindow = props.backups.preferredWindow;
      }
    }

    if (props.tags) {
      Object.entries(props.tags).forEach(([key, value]) => {
        Tags.of(this).add(key, value);
      });
    }

    this.connections = new ec2.Connections({
      securityGroups: [this.securityGroup],
      defaultPort: ec2.Port.tcp(port),
    });
  }

  public allowConnectionsFrom(other: ec2.IConnectable, port?: ec2.Port) {
    other.connections.allowTo(this, port);
  }

  public addReadReplica(id: string, props: { 
    numCacheNodes?: number, 
    region?: string 
  }) {
    // Placeholder for read replica implementation
  }

  public get clusterStatus(): string | IResolvable {
    return this.cluster.attrCacheClusterStatus;
  }

  public get configurationEndpoint(): string | IResolvable {
    return this.cluster.attrConfigurationEndpoint;
  }

  public get redisEndpoint(): string | IResolvable {
    return this.cluster.attrRedisEndpointAddress;
  }

  public get redisPort(): string | IResolvable {
    return this.cluster.attrRedisEndpointPort;
  }
}
