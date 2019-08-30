import { Construct, IResource, Resource } from "@aws-cdk/core";
import { CfnVPCPeeringConnection } from "./ec2.generated";
import { IVpc } from "./vpc";

/**
 * Options to add vpc peering conection to vpc
 */
export interface VpcPeeringConnectionOptions {
  /**
   * Peering connection vpc id
   */
  readonly vpcId: string;

  /**
   * Peering connection owner Id
   */
  readonly ownerId?: string;

  /**
   * Peering connection region
   */
  readonly region?: string;

  /**
   * Peering connection role arn
   */
  readonly roleArn?: string;
}

export interface IVpcPeeringConnection extends IResource {
    readonly vpcId: string;

    readonly peeringVpcId: string;

}

export interface VpcPeeringConnectionProps extends VpcPeeringConnectionOptions {
    vpc: IVpc;
}

export class VpcPeeringConnection extends Resource implements IVpcPeeringConnection {
    public readonly vpcId: string;
    public readonly peeringVpcId: string;

    constructor(scope: Construct, id: string, props: VpcPeeringConnectionProps) {
        super(scope, id);

        const vpcPeeringConnection = new CfnVPCPeeringConnection(this, id, {
            vpcId: props.vpc.vpcId,
            peerVpcId: props.vpcId,
            peerOwnerId: props.ownerId,
            peerRegion: props.region,
            peerRoleArn: props.roleArn
        });

        this.vpcId = vpcPeeringConnection.vpcId;
        this.peeringVpcId = vpcPeeringConnection.peerVpcId;
    }

  }
