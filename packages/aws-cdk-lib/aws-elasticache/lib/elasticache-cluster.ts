import { Construct } from 'constructs';
import * as elasticache from './elasticache.generated';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Resource, ResourceProps, Tags, Duration } from 'aws-cdk-lib';

export interface ElastiCacheClusterProps {
  vpc: ec2.IVpc;
  clusterName?: string;
  engine: 'redis' | 'memcached';
  engineVersion?: string;
  cacheNodeType: string;
  numCacheNodes: number;
  port?: number;
  subnetGroup?: elasticache.CfnSubnetGroup;
  securityGroups?: ec2.ISecurityGroup[];
  parameterGroup?: elasticache.CfnParameterGroup;
  autoMinorVersionUpgrade?: boolean;
  preferredMaintenanceWindow?: string;
  snapshotRetentionLimit?: number;
  snapshotWindow?: string;
  tags?: { [key: string]: string };
  encryption?: {
    atRest: boolean;
    inTransit: boolean;
    kmsKey?: kms.IKey;
  };
  autoScaling?: {
    minCapacity: number;
    maxCapacity: number;
    targetUtilization: number;
  };
  backups?: {
    retention: Duration;
    preferredWindow?: string;
  };
  performanceInsights?: {
    enabled: boolean;
    retentionPeriod?: Duration;
  };
}

export class ElastiCacheClusterV2 extends Resource {
  public readonly cluster: elasticache.CfnCacheCluster;
  public readonly connections: ec2.Connections;
  private readonly securityGroup: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props: ElastiCacheClusterProps) {
    super(scope, id);

    const port = props.port ?? (props.engine === 'redis' ? 6379 : 11211);

    // Create a security group if not provided
    this.securityGroup = props.securityGroups?.[0] ?? new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
      description: 'Security group for ElastiCache cluster',
      allowAllOutbound: true,
    });

    // Create a subnet group if not provided
    const subnetGroup = props.subnetGroup ?? new elasticache.CfnSubnetGroup(this, 'SubnetGroup', {
      description: 'Subnet group for ElastiCache cluster',
      subnetIds: props.vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }).subnetIds,
    });

    // Create the ElastiCache cluster
    this.cluster = new elasticache.CfnCacheCluster(this, 'Resource', {
      clusterName: props.clusterName,
      engine: props.engine,
      engineVersion: props.engineVersion,
      cacheNodeType: props.cacheNodeType,
      numCacheNodes: props.numCacheNodes,
      port: port,
      cacheSubnetGroupName: subnetGroup.ref,
      vpcSecurityGroupIds: [this.securityGroup.securityGroupId],
      cacheParameterGroupName: props.parameterGroup?.ref,
      autoMinorVersionUpgrade: props.autoMinorVersionUpgrade,
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      snapshotRetentionLimit: props.snapshotRetentionLimit,
      snapshotWindow: props.snapshotWindow,
    });

    // Configure encryption
    if (props.encryption) {
      this.cluster.atRestEncryptionEnabled = props.encryption.atRest;
      this.cluster.transitEncryptionEnabled = props.encryption.inTransit;
      if (props.encryption.kmsKey) {
        this.cluster.kmsKeyId = props.encryption.kmsKey.keyId;
      }
    }

    // Configure auto-scaling
    if (props.autoScaling) {
      // Note: This is a placeholder. Actual implementation would depend on ElastiCache's auto-scaling capabilities
      // and might require additional constructs or custom resources.
      console.log('Auto-scaling configuration would be implemented here');
    }

    // Configure backups
    if (props.backups) {
      this.cluster.snapshotRetentionLimit = props.backups.retention.toDays();
      if (props.backups.preferredWindow) {
        this.cluster.snapshotWindow = props.backups.preferredWindow;
      }
    }

    // Configure performance insights
    if (props.performanceInsights) {
      // Note: This is a placeholder. Actual implementation would depend on ElastiCache's performance insights capabilities
      // and might require additional constructs or custom resources.
      console.log('Performance insights configuration would be implemented here');
    }

    // Add tags
    if (props.tags) {
      Object.entries(props.tags).forEach(([key, value]) => {
        Tags.of(this).add(key, value);
      });
    }

    // Set up connections
    this.connections = new ec2.Connections({
      securityGroups: [this.securityGroup],
      defaultPort: ec2.Port.tcp(port),
    });
  }

  // Helper method to allow connections from other security groups
  public allowConnectionsFrom(other: ec2.IConnectable, port?: ec2.Port) {
    other.connections.allowTo(this, port);
  }

  // Method to add a read replica
  public addReadReplica(id: string, props: { 
    numCacheNodes?: number, 
    region?: string 
  }) {
    // Note: This is a placeholder. Actual implementation would depend on ElastiCache's read replica capabilities
    // and might require additional constructs or custom resources.
    console.log(`Read replica ${id} would be added here with ${props.numCacheNodes} nodes in region ${props.region}`);
  }
}
