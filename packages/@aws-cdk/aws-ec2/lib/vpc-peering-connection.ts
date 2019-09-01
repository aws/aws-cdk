import { Construct, IResource, Resource, Stack } from "@aws-cdk/core";
import { CfnVPCPeeringConnection } from "./ec2.generated";
import { IVpc, Route } from "./vpc";

/**
 * Options to add vpc peering conection to vpc
 */
export interface VpcPeeringConnectionOptions {
  /**
   * Peered Vpc
   * Required: either a peeredVpcId or peeredVpc
   * @default null
   */
  readonly peeredVpc?: IVpc;
  /**
   * Peering connection vpc id
   * Required: either a peeredVpcId or peeredVpc
   * @default null
   */
  readonly peeredVpcId?: string;

  /**
   * Peering connection owner Id
   * @default Your AWS account ID
   */
  readonly ownerId?: string;

  /**
   * Peering connection region
   * @default The Region in which you make the request
   */
  readonly region?: string;

  /**
   * Peering connection role arn - Required if you provide different ownerId.
   * @default -
   */
  readonly roleArn?: string;
}

export interface VpcPeeringConnectionProps extends VpcPeeringConnectionOptions {
  /**
   * Vpc
   */
  readonly vpc: IVpc;
}
export interface IVpcPeeringConnection extends IResource {
  readonly vpcId: string;

  readonly peeringVpcId: string;

  readonly peeringConnectionId: string;

  /**
   * Add route to peering VPC route tables to peered VPC.
   * @param cidr Cidr block of the peered VPC
   */
  addRoute(cidr: string): Route;
  /**
   * Add route to peered VPC route tables to peering VPC.
   * @param cidr Cidr block of the peering VPC
   */
  addPeeredRoute(cidr: string): Route;
}

/**
 * @resource AWS::EC2::VPCPeeringConnection
 */
export class VpcPeeringConnection extends Resource implements IVpcPeeringConnection {
  public readonly vpcId: string;
  public readonly peeringVpcId: string;
  public readonly peeringConnectionId: string;

  private id: string;

  private vpc: IVpc;

  private peeredVpc?: IVpc;

  constructor(scope: Construct, id: string, props: VpcPeeringConnectionProps) {
    super(scope, id);

    const stack = Stack.of(this);
    let ownerId = stack.account;
    if (props.ownerId !== undefined) {
        ownerId = props.ownerId;
    }

    if (props.peeredVpcId !== undefined && ownerId !== stack.account && props.roleArn === undefined) {
      throw new Error("roleArn is required when peering to another vpc in outside cdk");
    }

    if (props.vpc === undefined) {
      throw new Error("Vpc is requried");
    }

    const peeredVpcId = props.peeredVpc === undefined ? props.peeredVpcId : props.peeredVpc.vpcId;

    if (peeredVpcId === undefined) {
      throw new Error("Either a peerVpc contruct or a peerVpcId is required");
    }
    const vpcPeeringConnection = new CfnVPCPeeringConnection(this, id, {
      vpcId: props.vpc.vpcId,
      peerVpcId: peeredVpcId,
      peerOwnerId: props.ownerId,
      peerRegion: props.region,
      peerRoleArn: props.roleArn
    });
    this.id = id;
    this.vpc = props.vpc;
    this.peeredVpc = props.peeredVpc;
    this.vpcId = vpcPeeringConnection.vpcId;
    this.peeringVpcId = vpcPeeringConnection.peerVpcId;
    this.peeringConnectionId = vpcPeeringConnection.ref;
  }

  public addRoute(cidr: string): Route {
    return this.vpc.addRoute(`${this.id}Route`, {
      destinationCidr: cidr,
      targetType: "vpcPeeringConnectionId",
      targetId: this.peeringConnectionId
    });
  }

  public addPeeredRoute(cidr: string): Route {
    if (this.peeredVpc === undefined) {
      throw new Error("Can't add peer route to undefined Vpc");
    }
    return this.peeredVpc.addRoute(`${this.id}PeeredRoute`, {
      destinationCidr: cidr,
      targetType: "vpcPeeringConnectionId",
      targetId: this.peeringConnectionId
    });
  }
}
