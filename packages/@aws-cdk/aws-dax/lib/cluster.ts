import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import { Construct } from '@aws-cdk/core';
import { CfnCluster, CfnSubnetGroup } from './dax.generated';

/**
 * Properties to define a Cluster
 */
export interface ClusterProps {
  /**
   * Name of the cluster
   *
   * @default - The name is automatically generated
   */
  readonly clusterName?: string;

  /**
   * Description of the cluster
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * The role to use
   *
   * @default - Role
   */
  readonly role?: iam.IRole;

  /**
   * Instance type of the node (starts with 'dax.')
   */
  readonly nodeType: string;

  /**
   * How many instances to run
   */
  readonly replicationFactor: number;

  /**
   * VPC to create the cluster in
   */
  readonly vpc: ec2.IVpc;
}

/**
 * Define a new Dynamo Accelerator (DAX) Cluster
 *
 * A DAX Cluster will speed up DynamoDB accesses by caching
 * records.
 */
export class Cluster extends Construct {
  constructor(scope: Construct, id: string, props: ClusterProps) {
    super(scope, id);

    const role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('dax.amazonaws.com')
    });

    const subnetGroup = new CfnSubnetGroup(this, 'SubnetGroup', {
      subnetIds: props.vpc.selectSubnets().subnetIds
    });

    const securityGroups = [new ec2.SecurityGroup(this, 'SG', {
      vpc: props.vpc
    })];

    new CfnCluster(this, 'Resource', {
      clusterName: props.clusterName,
      description: props.description,
      iamRoleArn: role.roleArn,
      nodeType: props.nodeType,
      replicationFactor: props.replicationFactor || 3,
      securityGroupIds: securityGroups.map(s => s.securityGroupId),
      subnetGroupName: subnetGroup.ref
    });
  }
}