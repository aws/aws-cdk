import { IRole } from "@aws-cdk/aws-iam";
import { Construct, IResource, Resource, Stack } from "@aws-cdk/core";
import { CfnVPCPeeringConnection } from "./ec2.generated";
import { IRoute, IVpc, RouteTargetType } from "./vpc";

/**
 * Options to add vpc peering conection to vpc
 */
export interface VpcPeeringConnectionOptions {
  /**
   * The VPC with which you are creating the VPC peering connection
   * @default - Specify either a peerVpc or peerVpcId
   */
  readonly peerVpc?: IVpc;
  /**
   * The ID of the VPC with which you are creating the VPC peering connection
   * @default - Specify either a peerVpc or peerVpcId
   */
  readonly peerVpcId?: string;

  /**
   * The AWS account ID of the owner of the peer VPC.
   * @default Your AWS account ID if peerVpcId is provided or the AWS account ID of the peerVpc.
   */
  readonly ownerId?: string;

  /**
   * The region in which the peer VPC is located.
   * @default The Region in which you make the request
   */
  readonly region?: string;

  /**
   * The VPC peer role for the peering connection when connecting to another AWS account.
   * @default - Specify if the peerVpc/peerVpcId and the Vpc are in different accounts.
   */
  readonly role?: IRole;
}

export interface VpcPeeringConnectionProps extends VpcPeeringConnectionOptions {
  /**
   * The VPC which is initiating the peering connection.
   */
  readonly vpc: IVpc;
}
/**
 * VPC peering connection
 */
export interface IVpcPeeringConnection extends IResource {
  /**
   * The ID of the VPC which is initiating the peering connection.
   */
  readonly vpcId: string;

  /**
   * The ID of the VPC with which the peering connection was created.
   */
  readonly peerVpcId: string;

  /**
   * The ID of the VPC peering connection.
   */
  readonly peeringConnectionId: string;

  /**
   * Add route to the VPC's route tables that initiated the VPC peering connection.
   * @param cidr Cidr block of the peered VPC
   */
  addRoute(cidr: string): IRoute[];
  /**
   * Add route to the VPC's route tables with which the VPC peering connection was created.
   * @param cidr Cidr block of the peering VPC
   */
  addPeerRoute(cidr: string): IRoute[];
}

/**
 * Requests a VPC peering connection between two VPCs:
 * -  a requester VPC that you own
 * -  an accepter VPC with which to create the connection.
 * The accepter VPC can belong to another AWS account and can be in a different Region to the requester VPC.
 * The requester VPC and accepter VPC cannot have overlapping CIDR blocks.
 * @resource AWS::EC2::VPCPeeringConnection
 */
export class VpcPeeringConnection extends Resource implements IVpcPeeringConnection {
  public readonly vpcId: string;
  public readonly peerVpcId: string;
  public readonly peeringConnectionId: string;

  private vpc: IVpc;

  private peerVpc?: IVpc;

  constructor(scope: Construct, id: string, props: VpcPeeringConnectionProps) {
    super(scope, id);

    const stack = Stack.of(this);
    let peerOwnerId = stack.account;
    let peerVpcId: string;
    let roleArn: string | undefined;
    if (props.peerVpcId !== undefined && props.peerVpc !== undefined) {
      throw new Error("Either a peerVpc or a peerVpcId is required");
    }

    if (props.peerVpc !== undefined) {
      peerVpcId = props.peerVpc.vpcId;
      const peerVpcStack = Stack.of(props.peerVpc);
      peerOwnerId = peerVpcStack.account;
    } else if (props.peerVpcId !== undefined) {
      peerVpcId = props.peerVpcId;
      peerOwnerId = props.ownerId || stack.account;
    } else {
      throw new Error("Either a peerVpc or a peerVpcId is required");
    }

    if (peerOwnerId !== stack.account && props.role === undefined) {
      throw new Error("A role is required when creating a VPC peering connection with a VPC in another account.");
    }
    if (props.role !== undefined) {
      roleArn = props.role.roleArn;
    }

    const vpcPeeringConnection = new CfnVPCPeeringConnection(this, id, {
      vpcId: props.vpc.vpcId,
      peerVpcId,
      peerOwnerId,
      peerRegion: props.region,
      peerRoleArn: roleArn
    });

    this.vpc = props.vpc;
    this.peerVpc = props.peerVpc;
    this.vpcId = vpcPeeringConnection.vpcId;
    this.peerVpcId = vpcPeeringConnection.peerVpcId;
    this.peeringConnectionId = vpcPeeringConnection.ref;
  }

  public addRoute(cidr: string): IRoute[] {
    const routes = this.vpc.addRoute(`DefaultRoute`, {
      destinationCidr: cidr,
      targetType: RouteTargetType.VPC_PEERING_CONNECTION_ID,
      targetId: this.peeringConnectionId
    });
    return routes;
  }

  public addPeerRoute(cidr: string): IRoute[] {
    if (this.peerVpc === undefined) {
      throw new Error("Can't add peer route to undefined Vpc");
    }
    const peeredRoute = this.peerVpc.addRoute(`DefaultPeeredRoute`, {
      destinationCidr: cidr,
      targetType: RouteTargetType.VPC_PEERING_CONNECTION_ID,
      targetId: this.peeringConnectionId
    });
    return peeredRoute;
  }
}
