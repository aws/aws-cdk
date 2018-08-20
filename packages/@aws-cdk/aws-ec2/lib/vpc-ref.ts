import { Construct, IDependable, Output, StringListOutput, Token } from "@aws-cdk/cdk";

/**
 * The type of Subnet
 */
export enum SubnetType {
    /**
     * Isolated Subnets do not route Outbound traffic
     *
     * This can be good for subnets with RDS or
     * Elasticache endpoints
     */
    Isolated = 1,

    /**
     * Subnet that routes to the internet, but not vice versa.
     *
     * Instances in a private subnet can connect to the Internet, but will not
     * allow connections to be initiated from the Internet.
     *
     * Outbound traffic will be routed via a NAT Gateway. Preference being in
     * the same AZ, but if not available will use another AZ. This is common for
     * experimental cost conscious accounts or accounts where HA outbound
     * traffic is not needed.
     */
    Private = 2,

    /**
     * Subnet connected to the Internet
     *
     * Instances in a Public subnet can connect to the Internet and can be
     * connected to from the Internet as long as they are launched with public IPs.
     *
     * Public subnets route outbound traffic via an Internet Gateway.
     */
    Public = 3
}

/**
 * Customize how instances are placed inside a VPC
 *
 * Constructs that allow customization of VPC placement use parameters of this
 * type to provide placement settings.
 */
export interface VpcPlacementStrategy {
    /**
     * What subnet type to place the instances in
     *
     * By default, the instances are placed in the private subnets.
     *
     * @default SubnetType.Private
     */
    subnetsToUse?: SubnetType;
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
    public abstract readonly vpcId: VpcNetworkId;

    /**
     * List of public subnets in this VPC
     */
    public abstract readonly publicSubnets: VpcSubnetRef[];

    /**
     * List of private subnets in this VPC
     */
    public abstract readonly privateSubnets: VpcSubnetRef[];

    /**
     * List of isolated subnets in this VPC
     */
    public abstract readonly isolatedSubnets: VpcSubnetRef[];

    /**
     * AZs for this VPC
     */
    public abstract readonly availabilityZones: string[];

    /**
     * Parts of the VPC that constitute full construction
     */
    public readonly dependencyElements: IDependable[] = [];

    /**
     * Return the subnets appropriate for the placement strategy
     */
    public subnets(placement: VpcPlacementStrategy = {}): VpcSubnetRef[] {
        if (placement.subnetsToUse === undefined) { return this.privateSubnets; }
        return {
            [SubnetType.Isolated]: this.isolatedSubnets,
            [SubnetType.Private]: this.privateSubnets,
            [SubnetType.Public]: this.publicSubnets,
        }[placement.subnetsToUse];
    }

    /**
     * Export this VPC from the stack
     */
    public export(): VpcNetworkRefProps {
        return {
            vpcId: new Output(this, 'VpcId', { value: this.vpcId }).makeImportValue(),
            availabilityZones: this.availabilityZones,
            publicSubnetIds: this.exportSubnetIds('PublicSubnetIDs', this.publicSubnets),
            privateSubnetIds: this.exportSubnetIds('PrivateSubnetIDs', this.privateSubnets),
            isolatedSubnetIds: this.exportSubnetIds('IsolatedSubnetIDs', this.isolatedSubnets),
        };
    }

    private exportSubnetIds(name: string, subnets: VpcSubnetRef[]): Token[] | undefined {
        if (subnets.length === 0) { return undefined; }
        return new StringListOutput(this, name, { values: subnets.map(s => s.subnetId) }).makeImportValues();
    }
}

/**
 * An imported VpcNetwork
 */
class ImportedVpcNetwork extends VpcNetworkRef {
    /**
     * Identifier for this VPC
     */
    public readonly vpcId: VpcNetworkId;

    /**
     * List of public subnets in this VPC
     */
    public readonly publicSubnets: VpcSubnetRef[];

    /**
     * List of private subnets in this VPC
     */
    public readonly privateSubnets: VpcSubnetRef[];

    /**
     * List of isolated subnets in this VPC
     */
    public readonly isolatedSubnets: VpcSubnetRef[];

    /**
     * AZs for this VPC
     */
    public readonly availabilityZones: string[];

    constructor(parent: Construct, name: string, props: VpcNetworkRefProps) {
        super(parent, name);

        this.vpcId = props.vpcId;
        this.availabilityZones = props.availabilityZones;

        const privateSubnetIds = props.privateSubnetIds || [];
        const publicSubnetIds = props.publicSubnetIds || [];
        const isolatedSubnetIds = props.isolatedSubnetIds || [];

        if (publicSubnetIds.length > 0 && this.availabilityZones.length !== publicSubnetIds.length) {
            throw new Error('Must have Public subnet for every AZ');
        }

        if (privateSubnetIds.length > 0 && this.availabilityZones.length !== privateSubnetIds.length) {
            throw new Error('Must have Private subnet for every AZ');
        }

        if (isolatedSubnetIds.length > 0 && this.availabilityZones.length !== isolatedSubnetIds.length) {
            throw new Error('Must have Isolated subnet for every AZ');
        }

        const n = props.availabilityZones.length;
        this.publicSubnets = range(n).map(i => VpcSubnetRef.import(this, `PublicSubnet${i}`, {
            availabilityZone: this.availabilityZones[i],
            subnetId: publicSubnetIds[i]
        }));
        this.privateSubnets = range(n).map(i => VpcSubnetRef.import(this, `PrivateSubnet${i}`, {
            availabilityZone: this.availabilityZones[i],
            subnetId: privateSubnetIds[i]
        }));
        this.isolatedSubnets = range(n).map(i => VpcSubnetRef.import(this, `IsolatedSubnet${i}`, {
            availabilityZone: this.availabilityZones[i],
            subnetId: isolatedSubnetIds[i]
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
    vpcId: VpcNetworkId;

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
    publicSubnetIds?: VpcSubnetId[];

    /**
     * List of private subnet IDs, one for every subnet
     *
     * Must match the availability zones and public subnet ids in length and order.
     */
    privateSubnetIds?: VpcSubnetId[];

    /**
     * List of isolated subnet IDs, one for every subnet
     *
     * Must match the availability zones and public subnet ids in length and order.
     */
    isolatedSubnetIds?: VpcSubnetId[];
}

/**
 * Identifier for a VPC
 */
export class VpcNetworkId extends Token {
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
    public abstract readonly subnetId: VpcSubnetId;

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
    public readonly subnetId: VpcSubnetId;

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
    subnetId: VpcSubnetId;
}

/**
 * Id of a VPC Subnet
 */
export class VpcSubnetId extends Token {
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
