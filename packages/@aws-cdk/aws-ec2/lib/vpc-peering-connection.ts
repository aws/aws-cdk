import { Construct, IResource, Resource } from "@aws-cdk/core";
import { CfnVPCPeeringConnection } from "./ec2.generated";
import { IVpc } from "./vpc";

/**
 * Options to add vpc peering conection to vpc
 */
export interface VpcPeeringConnectionOptions {
    /**
     * Peered Vpc
     * Required: either a peeredVpcId or peeredVpc
     */
    readonly peeredVpc?: IVpc;
    /**
     * Peering connection vpc id
     * Required: either a peeredVpcId or peeredVpc
     */
    readonly peeredVpcId?: string;

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

export interface VpcPeeringConnectionProps extends VpcPeeringConnectionOptions {
    /**
     * Vpc
     */
    readonly vpc: IVpc;

}
export interface IVpcPeeringConnection extends IResource {
    readonly vpcId: string;

    readonly peeringVpcId: string;

}

export class VpcPeeringConnection extends Resource implements IVpcPeeringConnection {
    public readonly vpcId: string;
    public readonly peeringVpcId: string;

    constructor(scope: Construct, id: string, props: VpcPeeringConnectionProps) {
        super(scope, id);

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

        this.vpcId = vpcPeeringConnection.vpcId;
        this.peeringVpcId = vpcPeeringConnection.peerVpcId;
    }

}
