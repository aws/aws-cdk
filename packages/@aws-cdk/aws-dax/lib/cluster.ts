import { Metric, MetricOptions } from '@aws-cdk/aws-cloudwatch';
import { ITable } from '@aws-cdk/aws-dynamodb';
import { ISecurityGroup, ISubnet, Peer, Port, SecurityGroup } from '@aws-cdk/aws-ec2';
import { Grant, IGrantable, IRole, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Construct, Duration, IResource, Resource, Stack } from '@aws-cdk/core';
import { CfnCluster, CfnParameterGroup, CfnSubnetGroup } from './dax.generated';

export const READ_DATA_ACTIONS = [
  'dax:GetItem',
  'dax:BatchGetItem',
  'dax:Query',
  'dax:Scan',
];

export const WRITE_DATA_ACTIONS = [
  'dax:PutItem',
  'dax:UpdateItem',
  'dax:DeleteItem',
  'dax:BatchWriteItem',
];

/**
 * What class and generation of instance to use
 */
export enum InstanceClass {
  /**
   * Memory optimized instances, 3rd generation
   */
  R3 = 'r3',

  /**
   * Memory optimized instances, 4th generation
   */
  R4 = 'r4',

  /**
   * Burstable instances, 2nd generation
   */
  T2 = 't2',
}

/**
 * What size of instance to use
 */
export enum InstanceSize {
  /**
   * small
   */
  SMALL = 'small',

  /**
   * medium
   */
  MEDIUM = 'medium',

  /**
   * large
   */
  LARGE = 'large',

  /**
   * xlarge
   */
  XLARGE = 'xlarge',

  /**
   * 2xlarge
   */
  XLARGE2 = '2xlarge',

  /**
   * 4xlarge
   */
  XLARGE4 = '4xlarge',

  /**
   * 8xlarge
   */
  XLARGE8 = '8xlarge',

  /**
   * 16xlarge
   */
  XLARGE16 = '16xlarge',
}

/**
 * Instance type for DAX instances
 *
 * This class takes a literal string, good if you already
 * know the identifier of the type you want.
 */
export class InstanceType {
  /**
   * Instance type for DAX instances
   *
   * This class takes a combination of a class and size.
   *
   * Be aware that not all combinations of class and size are available, and not all
   * classes are available in all regions.
   */
  public static of(instanceClass: InstanceClass, instanceSize: InstanceSize) {
    return new InstanceType(`dax.${instanceClass}.${instanceSize}`);
  }

  constructor(private readonly instanceTypeIdentifier: string) {
  }

  /**
   * Return the instance type as a dotted string
   */
  public toString(): string {
    return this.instanceTypeIdentifier;
  }
}

/**
 * an interface that represents a DAX Cluster - either created with CDK, or an existing one.
 */
export interface ICluster extends IResource {

  /**
   * Name of DAX Cluster.
   *
   * @attribute
   */
  readonly clusterName: string;

  /**
   * Arn of DAX Cluster.
   *
   * @attribute
   */
  readonly clusterArn: string;

  /**
   * Adds an IAM policy statement associated with this cluster to an IAM
   * principal's policy.
   *
   * @param grantee The principal to grant access to
   * @param actions The set of actions to allow (i.e. "dax:PutItem", "dax:GetItem", ...)
   */
  grant(grantee: IGrantable, ...actions: string[]): Grant;

  /**
   * Permits an IAM principal all data read operations from this cluster:
   * GetItem, BatchGetItem, Query, Scan.
   *
   * @param grantee The principal to grant access to
   */
  grantReadData(grantee: IGrantable): Grant;

  /**
   * Permits an IAM principal all data write operations to this cluster:
   * PutItem, UpdateItem, DeleteItem, BatchWriteItem.
   *
   * @param grantee The principal to grant access to
   */
  grantWriteData(grantee: IGrantable): Grant;

  /**
   * Permits an IAM principal to all data read/write operations to this cluster.
   * GetItem, BatchGetItem, Query, Scan,
   * PutItem, UpdateItem, DeleteItem, BatchWriteItem
   *
   * @param grantee The principal to grant access to
   */
  grantReadWriteData(grantee: IGrantable): Grant;

  /**
   * Permits all DAX operations ("dax:*") to an IAM principal.
   *
   * @param grantee The principal to grant access to
   */
  grantFullAccess(grantee: IGrantable): Grant;

  /**
   * Return the given named metric for this Cluster.
   * see: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/dax-metrics-dimensions-dax.html
   *
   * @param metricName DAX Metric to be retrieved
   * @param props MetricOptions
   */
  metric(metricName: string, props?: MetricOptions): Metric;

}

abstract class ClusterBase extends Resource implements ICluster {

  /**
   * @attribute
   */
  public abstract readonly clusterName: string;

  /**
   * @attribute
   */
  public abstract readonly clusterArn: string;

  public grant(grantee: IGrantable, ...actions: string[]): Grant {
    return Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.clusterArn],
    });
  }

  public grantReadData(grantee: IGrantable): Grant {
    return this.grant(grantee, ...READ_DATA_ACTIONS);
  }

  public grantWriteData(grantee: IGrantable): Grant {
    return this.grant(grantee, ...WRITE_DATA_ACTIONS);
  }

  public grantReadWriteData(grantee: IGrantable): Grant {
    return this.grant(grantee, ...READ_DATA_ACTIONS, ...WRITE_DATA_ACTIONS);
  }

  public grantFullAccess(grantee: IGrantable): Grant {
    return this.grant(grantee, 'dax:*');
  }

  public metric(metricName: string, props?: MetricOptions): Metric {
    return new Metric({
      namespace: 'AWS/DAX',
      metricName,
      dimensions: {
        ClusterId: this.clusterName,
      },
      ...props,
    });
  }

}

/**
 * Properties of a DAX Cluster.
 */
export interface ClusterProps {

  /**
   * The Availability Zones (AZs) in which the cluster nodes will reside after the cluster has been created or updated.
   * If provided, the length of this list must equal the ReplicationFactor parameter.
   *
   * @default - DAX will spread the nodes across Availability Zones for the highest availability.
   */
  readonly availabilityZones?: string[]

  /**
   * Name of DAX Cluster.
   *
   * @default - CFN generated Cluster Name.
   */
  readonly clusterName?: string

  /**
   * The description of the cluster.
   *
   * @default - CFN generated Cluster Description.
   */
  readonly description?: string

  /**
   * IAM role DAX will assume to access DynamoDB.
   *
   * @default - CDK generated Role with read and write access to Table.
   */
  readonly iamRole?: IRole

  /**
   * List of DynamoDB Tables which DAX Cluster will be given access to.
   * This is needed when iamRole is not provided since CDK needs to build IAM role for DAX and provide it access to necessary DynamoDB Tables.
   *
   * @default - no access to any table
   */
  readonly tables?: ITable[]

  /**
   * Node Type for Nodes in DAX Cluster.
   *
   * @default - 'dax.t2.small'
   */
  readonly nodeType?: InstanceType

  /**
   * TTL for record fetched via GetItem or BatchGetItem.
   *
   * @default - 5 minutes
   */
  readonly recordTtl?: Duration

  /**
   * TTL for records fetched via Query or Scan.
   *
   * @default - 5 minutes
   */
  readonly queryTtl?: Duration

  /**
   * The number of nodes in the DAX cluster.
   *
   * @default - 3
   */
  readonly replicationFactor?: number

  /**
   * Subnets to be used to build SubnetGroup for DAX Cluster.
   *
   * @default - DAX assigns the default VPC subnets to each node.
   */
  readonly subnets?: ISubnet[]

  /**
   * Enable server-side encryption on the cluster.
   *
   * @default - false
   */
  readonly serverSideEncryption?: boolean

  /**
   * A list of SecurityGroups to be assigned to each node in the DAX cluster.
   *
   * @default - DAX assigns the default VPC security group to each node.
   */
  readonly securityGroups?: ISecurityGroup[]

}

/**
 * Provides a DAX Cluster.
 */
export class Cluster extends ClusterBase {

  /**
   * Import an existing DAX Cluster provided a DAX Cluster Name.
   *
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param profilingGroupName DAX Cluster Name
   */
  public static fromClusterName(scope: Construct, id: string, clusterName: string): ICluster {
    const stack = Stack.of(scope);

    return this.fromClusterArn(scope, id, stack.formatArn({
      service: 'dax',
      resource: 'cache',
      resourceName: clusterName,
    }));
  }

  /**
   * Import an existing DAX Cluster provided an ARN.
   *
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param clusterArn DAX Cluster ARN
   */
  public static fromClusterArn(scope: Construct, id: string, clusterArn: string): ICluster {
    class Import extends ClusterBase {
      public readonly clusterName = Stack.of(scope).parseArn(clusterArn).resource;
      public readonly clusterArn = clusterArn;
    }

    return new Import(scope, id);
  }

  /**
   * Name of DAX Cluster.
   *
   * @attribute
   */
  public readonly clusterName: string;

  /**
   * Arn of DAX Cluster.
   *
   * @attribute
   */
  public readonly clusterArn: string;

  /**
   * Configuration Endpoint of DAX Cluster
   *
   * @attribute
   */
  public readonly clusterDiscoveryEndpoint: string;

  constructor(scope: Construct, id: string, props: ClusterProps = {}) {
    super(scope, id);

    const clusterRole = props.iamRole || this.buildClusterRole(props);

    const replicationFactor = props.replicationFactor || 3;

    if (props.availabilityZones && (props.availabilityZones.length !== replicationFactor)) {
      throw new Error('number of availability zones should be equal to replication factor');
    }

    const parameterGroup = new CfnParameterGroup(this, 'ParameterGroup', {
      parameterNameValues: {
        'record-ttl-millis': props.recordTtl ? props.recordTtl.toMilliseconds().toString() : undefined,
        'query-ttl-millis': props.queryTtl ? props.queryTtl.toMilliseconds().toString() : undefined,
      },
    });

    const subnetGroup = new CfnSubnetGroup(this, 'SubnetGroup', {
      subnetIds: (props.subnets || []).map(subnet => {
        return subnet.subnetId;
      }),
    });

    const securityGroupIds = (props.securityGroups || []).map(securityGroup => {
      return securityGroup.securityGroupId;
    });

    const nodeType = props.nodeType || InstanceType.of(InstanceClass.T2, InstanceSize.SMALL);

    const cluster = new CfnCluster(this, 'Cluster', {
      availabilityZones: props.availabilityZones,
      clusterName: props.clusterName,
      description: props.description,
      iamRoleArn: clusterRole.roleArn,
      nodeType: nodeType.toString(),
      parameterGroupName: parameterGroup.parameterGroupName,
      replicationFactor,
      securityGroupIds,
      sseSpecification: (props.serverSideEncryption) ? {
        sseEnabled: props.serverSideEncryption,
      } : undefined,
      subnetGroupName: subnetGroup.subnetGroupName,
    });

    (cluster.securityGroupIds || []).forEach((securityGroupId, index) => {
      SecurityGroup
        .fromSecurityGroupId(this, `SecurityGroup-${index}`, securityGroupId)
        .addIngressRule(Peer.anyIpv4(), Port.tcp(8111));
    });

    this.clusterName = this.getResourceNameAttribute(cluster.ref);
    this.clusterArn = this.getResourceArnAttribute(cluster.attrArn, {
      service: 'dax',
      resource: 'cache',
      resourceName: this.physicalName,
    });
    this.clusterDiscoveryEndpoint = cluster.attrClusterDiscoveryEndpoint;
  }

  private buildClusterRole(props: ClusterProps): IRole {
    const clusterRole = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('dax.amazonaws.com'),
    });

    (props.tables || []).forEach(table => {
      table.grantFullAccess(clusterRole);
    });

    return clusterRole;
  }
}
