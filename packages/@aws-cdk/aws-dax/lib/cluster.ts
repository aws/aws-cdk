import * as cdk from '@aws-cdk/core';
import { Role, ServicePrincipal, Policy, PolicyStatement, Grant, IGrantable } from '@aws-cdk/aws-iam';
import { SecurityGroup, Connections, Port, Protocol, IVpc, Vpc, InstanceType } from '@aws-cdk/aws-ec2';
import { Table as DynamoDBTable } from '@aws-cdk/aws-dynamodb';
import { CfnParameterGroup, CfnCluster, CfnSubnetGroup } from './dax.generated';
import { Ec2Service } from '../../aws-ecs/lib';

interface DaxClusterProps extends cdk.StackProps {
  /**
   * The VPC where your ECS instances will be running or your ENIs will be deployed
   */
  vpc: IVpc;

  /**
   * The instance type that will be used for each DAX instance in the cluster
   */
  instanceType: InstanceType,

  /**
   * How many instances the cluster should have. A replication factor of at least
   * three is needed for high availability.
   */
  replicationFactor: number,

  /**
   * A map of cluster parameters to send to DAX. Example:
   *
   *   {
   *     'query-ttl-millis': '1000',
   *     'record-ttl-millis': '30000'
   *   }
   */
  clusterParameters: Map<string, string>
}

class DaxCluster extends cdk.Construct {

  protected id: string;

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
   * Parameters that control the behavior of the DAX cluster, such as how long
   * to cache items or queries for
   */
  public readonly parameterGroup: CfnParameterGroup;

  /**
   * The underlying Cfn resource for the cluster
   */
  public readonly cluster: CfnCluster;

  /**
   * The endpoint at which the cluster can be accessed
   */
  public readonly endpoint: string;

  /**
   * IAM policies associated with the cluster
   */
  protected policies: Policy[];

  constructor(scope: cdk.Construct, id: string, props: DaxClusterProps) {
    super(scope, id);
    this.id = id;

    this.vpc = props.vpc;

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
        stringRepresentation: "TCP",
      })
    });

    this.role = new Role(this, `${id}-role`, {
      assumedBy: new ServicePrincipal('dax.amazonaws.com'),
      description: 'Role that allows DynamoDB Accelerator to talk to DynamoDB',
    });

    // The parameters for this cluster
    this.parameterGroup = new CfnParameterGroup(this, '${id}-parameters', {
      parameterNameValues: props.clusterParameters
      /*parameterNameValues: {
          'query-ttl-millis': '1000',
          'record-ttl-millis': '30000'
      },*/
    });

    // The cluster resource itself.
    this.cluster = new CfnCluster(this, `${id}-cluster`, {
      iamRoleArn: this.role.roleArn,
      nodeType: props.instanceType,
      replicationFactor: props.replicationFactor,
      subnetGroupName: subnetGroup.ref,
      parameterGroupName: this.parameterGroup.ref,
      securityGroupIds: [
        this.securityGroup.securityGroupId
      ],
    });

    this.endpoint = this.cluster.attrClusterDiscoveryEndpoint;

    this.policies = [];
  }

  // Add a table for the Dax cluster to be able to access
  // This helper method adds a Policy on the same stack as the table,
  // which allows the IAM role of this DAX cluster to talk to the table
  addTable(tableName: string, table: DynamoDBTable) {
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

  // Grant the bearer of role permissions to talk to this DAX cluster.
  // This is needed because DAX has its own custom IAM permissions prefixed
  // with dax: instead of dynamodb:
  grantReadWriteData(grantee: IGrantable) {
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
        'dax:Endpoints'
      ],
      resourceArns: [
        this.cluster.attrArn,
      ],
      scope: this,
    });
  }
}