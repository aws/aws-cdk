import { ITable } from '@aws-cdk/aws-dynamodb';
import { Connections, InstanceType, ISecurityGroup, IVpc, Port, Protocol, SecurityGroup } from '@aws-cdk/aws-ec2';
import { Grant, IGrantable, IRole, Policy, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { CfnCluster, CfnSubnetGroup } from './dax.generated';
import { IParameterGroup, ParameterGroup } from './parameter-group';

/**
 * The properties used to define a DAX cluster
 */
export interface ClusterProps {
  /**
   * The name of the cluster.
   */
  readonly clusterName: string;

  /**
   * The VPC where your ECS instances will be running or your ENIs will be deployed
   */
  readonly vpc: IVpc;

  /**
   * The instance type that will be used for each DAX instance in the cluster
   */
  readonly instanceType: InstanceType,

  /**
   * How many instances the cluster should have. A replication factor of at least
   * three is needed for high availability.
   *
   * @default 3
   */
  readonly replicationFactor: number,

  /**
   * The cluster parameters
   *
   * @default The default parameter group sets cache TTL to 5 minutes for both queries and records
   */
  readonly parameterGroup?: IParameterGroup
}

/**
 * A cluster of DAX instances capable of caching DynamoDB responses
 */
export interface ICluster extends cdk.IResource {
  /**
   * The VPC associated with the cluster.
   */
  readonly vpc: IVpc;

  /**
   * Manage the allowed network connections for the cluster with Security Groups.
   */
  readonly connections: Connections;

  /**
   * The endpoint at which the cluster can be accessed
   * @attribute
   */
  readonly clusterDiscoveryEndpoint: string;

  /**
   * The ARN of the cluster
   * @attribute
   */
  readonly clusterArn: string;

  /**
   * The name of the cluster
   * @attribute
   */
  readonly clusterName: string;
}

/**
 * A DAX cluster
 *
 * @resource AWS::DAX::Cluster
 */
export class Cluster extends cdk.Resource implements ICluster {
  /**
   * Import an existing cluster to the stack from its attributes.
   */
  public static fromClusterAttributes(scope: cdk.Construct, id: string, attrs: ClusterAttributes): ICluster {
    return new ImportedCluster(scope, id, attrs);
  }

  /**
   * The VPC associated with the cluster.
   */
  public readonly vpc: IVpc;

  /**
   * The security group which protects access to the DAX cluster
   */
  public readonly securityGroup: SecurityGroup;

  /**
   * Manage the allowed network connections for the cluster with Security Groups.
   */
  public readonly connections: Connections;

  /**
   * The role of the cluster
   */
  public readonly role: Role;

  /**
   * The underlying Cfn resource for the cluster
   * @attribute
   */
  public readonly cluster: CfnCluster;

  /**
   * The endpoint at which the cluster can be accessed
   * @attribute
   */
  public readonly clusterDiscoveryEndpoint: string;

  /**
   * The ARN of the cluster
   * @attribute
   */
  public readonly clusterArn: string;

  /**
   * The name of the cluster
   * @attribute
   */
  public readonly clusterName: string;

  /**
   * IAM policies associated with the cluster
   */
  protected policies: Policy[];

  protected id: string;

  constructor(scope: cdk.Construct, id: string, props: ClusterProps) {
    super(scope, id);
    this.id = id;
    this.vpc = props.vpc;
    this.clusterName = props.clusterName;

    // Define a group for telling Elasticache which subnets to put cache nodes in.
    const subnetGroup = new CfnSubnetGroup(this, `${id}-subnet-group`, {
      description: `List of subnets used for dax cache ${id}`,
      subnetIds: this.vpc.privateSubnets.map(subnet => subnet.subnetId),
    });

    // The security group that defines network level access to the cluster
    this.securityGroup = new SecurityGroup(this, `${id}-security-group`, { vpc: this.vpc });

    this.connections = new Connections({
      securityGroups: [this.securityGroup],
      defaultPort: new Port({
        protocol: Protocol.TCP,
        fromPort: 8111,
        toPort: 8111,
        stringRepresentation: 'TCP',
      }),
    });

    this.role = new Role(this, `${id}-role`, {
      assumedBy: new ServicePrincipal('dax.amazonaws.com'),
      description: 'Role that allows DynamoDB Accelerator to talk to DynamoDB',
    });

    // The parameters for this cluster
    let parameterGroup = props.parameterGroup;

    if (!parameterGroup) {
      parameterGroup = new ParameterGroup(this, '${id}-parameters', {
        parameters: {
          'query-ttl-millis': cdk.Duration.minutes(5).toMilliseconds().toString(),
          'record-ttl-millis': cdk.Duration.minutes(5).toMilliseconds().toString(),
        },
      });
    }

    // The cluster resource itself.
    this.cluster = new CfnCluster(this, `${id}-cluster`, {
      iamRoleArn: this.role.roleArn,
      nodeType: props.instanceType.toString(),
      replicationFactor: props.replicationFactor ? props.replicationFactor : 3,
      subnetGroupName: subnetGroup.ref,
      parameterGroupName: parameterGroup.parameterGroupName,
      securityGroupIds: [
        this.securityGroup.securityGroupId,
      ],
    });

    this.clusterDiscoveryEndpoint = this.cluster.attrClusterDiscoveryEndpoint;
    this.clusterArn = this.cluster.attrArn;

    this.policies = [];
  }

  /**
   * Add a table to the DAX cluster. This adds a policy on the same stack
   * as the table while allows the IAM role of the cluster to have read/write
   * access to the table.
   */
  public addTable(tableName: string, table: ITable) {
    const destinationStack = cdk.Stack.of(table);

    const policy = new Policy(destinationStack, `${this.id}-access-${tableName}`);

    const statement = new PolicyStatement();
    statement.addResources(table.tableArn);
    statement.addActions(
      'dynamodb:BatchGetItem',
      'dynamodb:BatchWriteItem',
      'dynamodb:DeleteItem',
      'dynamodb:GetItem',
      'dynamodb:GetRecords',
      'dynamodb:GetShardIterator',
      'dynamodb:PutItem',
      'dynamodb:Query',
      'dynamodb:Scan',
      'dynamodb:UpdateItem',
      'dynamodb:DescribeTable',
    );

    policy.addStatements(statement);

    // Attach the policy to the role of the DAX cluster
    policy.attachToRole(this.role);

    this.policies.push(policy);
  }

  /**
   * Grant the bearer of role permissions to read data from
   * and write data to the tables that are added to this DAX
   * cluster
   */
  public grantReadWriteData(grantee: IGrantable) {
    return Grant.addToPrincipal({
      grantee,
      actions: [
        // Permissions which map to DynamoDB
        'dax:GetItem',
        'dax:BatchGetItem',
        'dax:Query',
        'dax:Scan',
        'dax:PutItem',
        'dax:UpdateItem',
        'dax:DeleteItem',
        'dax:BatchWriteItem',
        'dax:ConditionCheckItem',

        // Dax specific permissions
        'dax:DefineAttributeList',
        'dax:DefineAttributeListId',
        'dax:DefineKeySchema',
        'dax:Endpoints',
      ],
      resourceArns: [
        this.cluster.attrArn,
      ],
      scope: this,
    });
  }
}

/**
 * The properties to import from the ECS cluster.
 */
export interface ClusterAttributes {
  /**
   * The VPC associated with the cluster.
   */
  readonly vpc: IVpc;

  /**
   * The security group which protects access to the DAX cluster
   */
  readonly securityGroup: ISecurityGroup;

  /**
   * The name of the cluster
   */
  readonly clusterName: string;

  /**
   * The ARN of the cluster
   */
  readonly clusterArn: string;

  /**
   * The role of the cluster
   */
  readonly role: IRole;

  /**
   * The endpoint at which the cluster can be accessed
   * @attribute
   */
  readonly clusterDiscoveryEndpoint: string;
}

class ImportedCluster extends cdk.Resource implements ICluster {
  /**
   * The VPC associated with the cluster.
   */
  public readonly vpc: IVpc;

  /**
   * Manage the allowed network connections for the cluster with Security Groups.
   */
  public readonly connections: Connections;

  /**
   * The endpoint at which the cluster can be accessed
   * @attribute
   */
  public readonly clusterDiscoveryEndpoint: string;

  /**
   * The ARN of the cluster
   * @attribute
   */
  public readonly clusterArn: string;

  /**
   * The name of the cluster
   * @attribute
   */
  public readonly clusterName: string;

  protected id: string;

  constructor(scope: cdk.Construct, id: string, props: ClusterAttributes) {
    super(scope, id);

    this.id = id;
    this.vpc = props.vpc;
    this.clusterName = props.clusterName;
    this.clusterArn = props.clusterArn;
    this.clusterDiscoveryEndpoint = props.clusterDiscoveryEndpoint;

    this.connections = new Connections({
      securityGroups: [props.securityGroup],
    });
  }
}