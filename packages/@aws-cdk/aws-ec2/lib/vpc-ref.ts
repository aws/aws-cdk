import { Construct, IDependable, Output, StringListOutput } from "@aws-cdk/cdk";
import { SubnetId, VPCId } from "./ec2.generated";

/**
 * Customize how instances are placed inside a VPC
 *
 * Constructs that allow customization of VPC placement use parameters of this
 * type to provide placement settings.
 */
export interface VpcPlacementStrategy {
    /**
     * Whether to use the VPC's public subnets to start instances
     *
     * If false, the instances are started in the private subnets.
     *
     * @default false
     */
    usePublicSubnets?: boolean;
}

/**
 * A new or imported VPC
 */
export abstract class VpcNetworkRef extends Construct implements IDependable {
    /**
     * Import an exported VPC
     */
    public static import(parent: Construct, name: string, props: VpcNetworkRefProps): VpcNetworkRef {
        return new ImportedVpcNetwork(parent, name, props);
    }

    /**
     * Identifier for this VPC
     */
    public abstract readonly vpcId: VPCId;

    /**
     * List of public subnets in this VPC
     */
    public abstract readonly publicSubnets: VpcSubnetRef[];

    /**
     * List of private subnets in this VPC
     */
    public abstract readonly privateSubnets: VpcSubnetRef[];

    /**
     * Parts of the VPC that constitute full construction
     */
    public readonly dependencyElements: IDependable[] = [];

    /**
     * Return the subnets appropriate for the placement strategy
     */
    public subnets(placement?: VpcPlacementStrategy): VpcSubnetRef[] {
        if (!placement) { return this.privateSubnets; }
        return placement.usePublicSubnets ? this.publicSubnets : this.privateSubnets;
    }

    /**
     * Export this VPC from the stack
     */
    public export(): VpcNetworkRefProps {
        // tslint:disable:max-line-length
        return {
            vpcId: new VPCId(new Output(this, 'VpcId', { value: this.vpcId }).makeImportValue()),
            availabilityZones: this.publicSubnets.map(s => s.availabilityZone),
            publicSubnetIds: new StringListOutput(this, 'PublicSubnetIDs', { values: this.publicSubnets.map(s => s.subnetId) }).makeImportValues().map(x => new SubnetId(x)),
            privateSubnetIds: new StringListOutput(this, 'PrivateSubnetIDs', { values: this.privateSubnets.map(s => s.subnetId) }).makeImportValues().map(x => new SubnetId(x)),
        };
        // tslint:enable:max-line-length
    }
}

/**
 * An imported VpcNetwork
 */
class ImportedVpcNetwork extends VpcNetworkRef {
    /**
     * Identifier for this VPC
     */
    public readonly vpcId: VPCId;

    /**
     * List of public subnets in this VPC
     */
    public readonly publicSubnets: VpcSubnetRef[];

    /**
     * List of private subnets in this VPC
     */
    public readonly privateSubnets: VpcSubnetRef[];

    constructor(parent: Construct, name: string, props: VpcNetworkRefProps) {
        super(parent, name);

        this.vpcId = props.vpcId;

        if (props.availabilityZones.length !== props.publicSubnetIds.length) {
            throw new Error('Availability zone and public subnet ID arrays must be same length');
        }

        if (props.availabilityZones.length !== props.privateSubnetIds.length) {
            throw new Error('Availability zone and private subnet ID arrays must be same length');
        }

        const n = props.availabilityZones.length;
        this.publicSubnets = range(n).map(i => VpcSubnetRef.import(this, `PublicSubnet${i}`, {
            availabilityZone: props.availabilityZones[i],
            subnetId: props.publicSubnetIds[i]
        }));
        this.privateSubnets = range(n).map(i => VpcSubnetRef.import(this, `PrivateSubnet${i}`, {
            availabilityZone: props.availabilityZones[i],
            subnetId: props.privateSubnetIds[i]
        }));
    }
}

/**
 * Properties that reference an external VpcNetwork
 */
export interface VpcNetworkRefProps {
    /**
     * VPC's identifier
     */
    vpcId: VPCId;

    /**
     * List of a availability zones, one for every subnet.
     *
     * The first half are for the public subnets, the second half are for
     * the private subnets.
     */
    availabilityZones: string[];

    /**
     * List of public subnet IDs, one for every subnet
     *
     * Must match the availability zones and private subnet ids in length and order.
     */
    publicSubnetIds: SubnetId[];

    /**
     * List of private subnet IDs, one for every subnet
     *
     * Must match the availability zones and public subnet ids in length and order.
     */
    privateSubnetIds: SubnetId[];
}

/**
 * A new or imported VPC Subnet
 */
export abstract class VpcSubnetRef extends Construct implements IDependable {
    public static import(parent: Construct, name: string, props: VpcSubnetRefProps): VpcSubnetRef {
        return new ImportedVpcSubnet(parent, name, props);
    }

    /**
     * The Availability Zone the subnet is located in
     */
    public abstract readonly availabilityZone: string;

    /**
     * The subnetId for this particular subnet
     */
    public abstract readonly subnetId: SubnetId;

    /**
     * Parts of this VPC subnet
     */
    public readonly dependencyElements: IDependable[] = [];
}

/**
 * Subnet of an imported VPC
 */
class ImportedVpcSubnet extends VpcSubnetRef {
    /**
     * The Availability Zone the subnet is located in
     */
    public readonly availabilityZone: string;

    /**
     * The subnetId for this particular subnet
     */
    public readonly subnetId: SubnetId;

    constructor(parent: Construct, name: string, props: VpcSubnetRefProps) {
        super(parent, name);

        this.availabilityZone = props.availabilityZone;
        this.subnetId = props.subnetId;
    }
}

export interface VpcSubnetRefProps {
    /**
     * The Availability Zone the subnet is located in
     */
    availabilityZone: string;

    /**
     * The subnetId for this particular subnet
     */
    subnetId: SubnetId;
}

/**
 * Generate the list of numbers of [0..n)
 */
function range(n: number): number[] {
    const ret: number[] = [];
    for (let i = 0; i < n; i++) {
        ret.push(i);
    }
    return ret;
}
