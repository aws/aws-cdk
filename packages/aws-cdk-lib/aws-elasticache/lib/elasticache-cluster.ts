import { Construct } from 'constructs';
import * as elasticache from './elasticache.generated';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Resource, ResourceProps, Tags } from 'aws-cdk-lib';

export interface ElastiCacheClusterProps {
  vpc: ec2.IVpc;
  clusterName?: string;
  engine?: 'redis' | 'memcached';
  engineVersion?: string;
  cacheNodeType?: string;
  numCacheNodes?: number;
  port?: number;
  subnetGroup?: elasticache.CfnSubnetGroup;
  securityGroups?: ec2.ISecurityGroup[];
  parameterGroup?: elasticache.CfnParameterGroup;
  autoMinorVersionUpgrade?: boolean;
  preferredMaintenanceWindow?: string;
  snapshotRetentionLimit?: number;
  snapshotWindow?: string;
  tags?: { [key: string]: string };
}

/* This implementation does the following:

It extends the Resource class from CDK, which provides some common functionality for all CDK resources.

It sets default values for engine, port, cache node type, and number of cache nodes if not provided.

It creates a security group if one isn't provided in the props.

It creates a subnet group if one isn't provided, using the private subnets of the given VPC.

It creates the ElastiCache cluster using the L1 CfnCacheCluster construct, applying all the provided properties.

It sets up the connections property to allow easy management of network connections to the cluster.

It applies any tags provided in the props.

It includes a helper method allowConnectionsFrom to easily allow connections from other constructs.
*/

export class ElastiCacheCluster extends Resource {
  public readonly cluster: elasticache.CfnCacheCluster;
  public readonly connections: ec2.Connections;
  private readonly securityGroup: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props: ElastiCacheClusterProps) {
    super(scope, id);

    // Set defaults
    const port = props.port ?? (engine === 'redis' ? 6379 : 11211);
    const cacheNodeType = props.cacheNodeType ?? 'cache.t3.micro';
    const numCacheNodes = props.numCacheNodes ?? 1;

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
      engine: engine,
      engineVersion: props.engineVersion,
      cacheNodeType: cacheNodeType,
      numCacheNodes: numCacheNodes,
      port: port,
      cacheSubnetGroupName: subnetGroup.ref,
      vpcSecurityGroupIds: [this.securityGroup.securityGroupId],
      cacheParameterGroupName: props.parameterGroup?.ref,
      autoMinorVersionUpgrade: props.autoMinorVersionUpgrade,
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      snapshotRetentionLimit: props.snapshotRetentionLimit,
      snapshotWindow: props.snapshotWindow,
    });

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
}
