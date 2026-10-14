import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnNetworkConnector } from 'aws-cdk-lib/aws-lambda';
import type { INetworkConnectorRef, NetworkConnectorReference } from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';

/**
 * The network protocol of a network connector
 */
export enum NetworkProtocol {
  /**
   * IPv4 only
   */
  IPV4 = 'IPv4',

  /**
   * IPv4 and IPv6
   */
  DUAL_STACK = 'DualStack',
}

/**
 * A Lambda Network Connector, which gives web functions egress into a VPC
 */
export interface INetworkConnector extends cdk.IResource, INetworkConnectorRef {
  /**
   * The unqualified ARN of the network connector. It identifies the connector across its versions.
   *
   * @attribute
   */
  readonly networkConnectorArn: string;

  /**
   * The qualified ARN of the latest version of the network connector.
   *
   * A web function revision is pinned to this version. An update to the connector creates a new
   * version and replaces the revision that references it.
   *
   * @attribute
   */
  readonly latestVersionArn: string;
}

/**
 * Properties for a Network Connector
 */
export interface NetworkConnectorProps {
  /**
   * The name of the network connector. It cannot be changed once created.
   *
   * @default - no name
   */
  readonly networkConnectorName?: string;

  /**
   * The VPC in which the connector provisions its network interfaces.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The subnets in which the connector provisions its network interfaces. Between 1 and 16 subnets.
   *
   * @default - the private subnets with egress of the VPC
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The security groups attached to the network interfaces. They must be in the VPC.
   *
   * @default - a new security group that allows all outbound traffic
   */
  readonly securityGroups?: ec2.ISecurityGroupRef[];

  /**
   * The network protocol of the connector.
   *
   * @default NetworkProtocol.IPV4
   */
  readonly networkProtocol?: NetworkProtocol;

  /**
   * The role that the service assumes to manage the network interfaces. It must have the
   * `AWSLambdaNetworkConnectorOperatorPolicy` managed policy and trust `lambda.amazonaws.com`.
   *
   * @default - a new role with the `AWSLambdaNetworkConnectorOperatorPolicy` managed policy
   */
  readonly operatorRole?: iam.IRole;
}

/**
 * A Lambda Network Connector, which gives web functions egress into a VPC.
 *
 * The network interfaces are provisioned once for the connector, not per function.
 *
 * @resource AWS::Lambda::NetworkConnector
 */
export class NetworkConnector extends cdk.Resource implements INetworkConnector {
  /**
   * The unqualified ARN of the network connector
   */
  public readonly networkConnectorArn: string;

  /**
   * The qualified ARN of the latest version of the network connector
   */
  public readonly latestVersionArn: string;

  /**
   * The role that the service assumes to manage the network interfaces
   */
  public readonly operatorRole: iam.IRole;

  /**
   * The underlying `AWS::Lambda::NetworkConnector` resource
   */
  public readonly cfnNetworkConnector: CfnNetworkConnector;

  /**
   * A reference to this network connector, for use in other constructs
   */
  public get networkConnectorRef(): NetworkConnectorReference {
    return { networkConnectorArn: this.networkConnectorArn };
  }

  constructor(scope: Construct, id: string, props: NetworkConnectorProps) {
    super(scope, id, { physicalName: props.networkConnectorName });

    const subnets = props.vpc.selectSubnets(props.vpcSubnets ?? { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS });
    const securityGroups: ec2.ISecurityGroupRef[] = props.securityGroups ?? [
      new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc: props.vpc,
        description: `Network connector ${id}`,
        allowAllOutbound: true,
      }),
    ];

    // The operator role is trusted by the service. The managed policy lets it create the
    // network interfaces. A role passed in must already have the policy attached.
    this.operatorRole = props.operatorRole ?? new iam.Role(this, 'OperatorRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambdaNetworkConnectorOperatorPolicy'),
      ],
    });

    this.cfnNetworkConnector = new CfnNetworkConnector(this, 'Resource', {
      name: props.networkConnectorName,
      configuration: {
        vpcEgressConfiguration: {
          subnetIds: subnets.subnetIds,
          securityGroupIds: securityGroups.map((sg) => sg.securityGroupRef.securityGroupId),
          networkProtocol: props.networkProtocol ?? NetworkProtocol.IPV4,
          associatedComputeResourceTypes: ['WebFunction'],
        },
      },
      operatorRole: this.operatorRole.roleArn,
    });

    this.networkConnectorArn = this.cfnNetworkConnector.attrArn;
    this.latestVersionArn = this.cfnNetworkConnector.attrLatestVersionArn;
  }
}
