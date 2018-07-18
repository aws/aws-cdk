import { AvailabilityZoneProvider, Construct, Tag, Token } from '@aws-cdk/core';
import { Obj } from '@aws-cdk/util';
import { cloudformation } from './ec2.generated';
import { NetworkBuilder } from './network-util';
import { VpcNetworkId, VpcNetworkRef, VpcSubnetId, VpcSubnetRef } from './vpc-ref';
/**
 * VpcNetworkProps allows you to specify configuration options for a VPC
 */
export interface VpcNetworkProps {

    /**
     * The CIDR range to use for the VPC (e.g. '10.0.0.0/16'). Should be a minimum of /28 and maximum size of /16.
     * The range will be split evenly into two subnets per Availability Zone (one public, one private).
     */
    cidr?: string;

    /**
     * Indicates whether the instances launched in the VPC get public DNS hostnames.
     * If this attribute is true, instances in the VPC get public DNS hostnames,
     * but only if the enableDnsSupport attribute is also set to true.
     */
    enableDnsHostnames?: boolean;

    /**
     * Indicates whether the DNS resolution is supported for the VPC. If this attribute
     * is false, the Amazon-provided DNS server in the VPC that resolves public DNS hostnames
     * to IP addresses is not enabled. If this attribute is true, queries to the Amazon
     * provided DNS server at the 169.254.169.253 IP address, or the reserved IP address
     * at the base of the VPC IPv4 network range plus two will succeed.
     */
    enableDnsSupport?: boolean;

    /**
     * The default tenancy of instances launched into the VPC.
     * By default, instances will be launched with default (shared) tenancy.
     * By setting this to dedicated tenancy, instances will be launched on hardware dedicated
     * to a single AWS customer, unless specifically specified at instance launch time.
     * Please note, not all instance types are usable with Dedicated tenancy.
     */
    defaultInstanceTenancy?: DefaultInstanceTenancy;

    /**
     * The AWS resource tags to associate with the VPC.
     */
    tags?: Tag[];

    /**
     * Define the maximum number of AZs to use in this region
     *
     * If the region has more AZs than you want to use (for example, because of EIP limits),
     * pick a lower number here. The AZs will be sorted and picked from the start of the list.
     *
     * @default All AZs in the region
     */
    maxAZs?: number;

    /**
     * Define the maximum number of NAT Gateways for this VPC
     *
     * Setting this number enables a VPC to trade availability for the cost of
     * running a NAT Gateway. For example, if set this to 1 and your subnet
     * configuration is for 3 Public subnets with natGateway = `true` then only
     * one of the Public subnets will have a gateway and all Private subnets
     * will route to this NAT Gateway.
     * @default maxAZs
     */
    maxNatGateways?: number;

    /**
     * Configure the subnets to build for each AZ
     *
     * The subnets are constructed in the context of the VPC so you only need
     * specify the configuration. The VPC details (VPC ID, specific CIDR,
     * specific AZ will be calculated during creation)
     *
     * For example if you want 1 public subnet, 1 private subnet, and 1 internal
     * subnet in each AZ provide the following:
     * subnets: [
     * {
     *   cidrMask: 24,
     *   name: application,
     *   subnetType: SubnetType.Private,
     * },
     * {
     *   cidrMask: 26,
     *   name: ingress,
     *   subnetType: SubnetType.Public,
     *   natGateway: true,
     * },
     * {
     *   cidrMask: 28,
     *   name: rds,
     *   subnetType: SubnetType.Internal,
     * }
     * ]
     * @default the VPC CIDR will be evenly divided between 1 public and 1
     * private subnet per AZ
     */
    subnetConfigurations?: SubnetConfiguration[];
}

/**
 * The default tenancy of instances launched into the VPC.
 */
export enum DefaultInstanceTenancy {
    /**
     * Instances can be launched with any tenancy.
     */
    Default = 'default',

    /**
     * Any instance launched into the VPC automatically has dedicated tenancy, unless you launch it with the default tenancy.
     */
    Dedicated = 'dedicated'
}

/**
 * The type of Subnet
 */
export enum SubnetType {

    /**
     * Internal Subnets do not route Outbound traffic
     *
     * This can be good for subnets with RDS or
     * Elasticache endpoints
     */
    Internal = 1,

    /**
     * Public subnets route outbound traffic via an Internet Gateway
     *
     * If this is set and OutboundTrafficMode.None is configure an error
     * will be thrown.
     */
    Public = 2,

    /**
     * Private subnets route outbound traffic via a NAT Gateway
     *
     * Outbound traffic will be routed via a NAT Gateways preference being in
     * the same AZ, but if not available will use another AZ. This is common for
     * experimental cost conscious accounts or accounts where HA outbound
     * traffic is not needed.
     */
    Private = 3
}

/**
 * Specify configuration parameters for a VPC to be built
 */
export interface SubnetConfiguration {
    // the cidr mask value from 16-28
    cidrMask?: number;
    // Public (IGW), Private (Nat GW), Internal (no outbound)
    subnetType: SubnetType;
    // name that will be used to generate an AZ specific name e.g. name-2a
    name: string;
    // if true will place a NAT Gateway in this subnet, subnetType must be Public
    natGateway?: boolean;
    // defaults to true in Subnet.Public, false in Subnet.Private or Subnet.Internal
    mapPublicIpOnLaunch?: boolean;
}

/**
 * VpcNetwork deploys an AWS VPC, with public and private subnets per Availability Zone.
 * For example:
 *
 * import { VpcNetwork } from '@aws-cdk/ec2'
 *
 * const vpc = new VpcNetwork(this, {
 *     cidr: "10.0.0.0/16"
 * })
 *
 * // Iterate the public subnets
 * for (let subnet of vpc.publicSubnets) {
 *
 * }
 *
 * // Iterate the private subnets
 * for (let subnet of vpc.privateSubnets) {
 *
 * }
 */
export class VpcNetwork extends VpcNetworkRef {

    /**
     * The default CIDR range used when creating VPCs.
     * This can be overridden using VpcNetworkProps when creating a VPCNetwork resource.
     * e.g. new VpcResource(this, { cidr: '192.168.0.0./16' })
     */
    public static readonly DEFAULT_CIDR_RANGE: string = '10.0.0.0/16';

    /**
     * Maximum Number of NAT Gateways used to control cost
     *
     * @link https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Appendix_Limits.html
     * defaulting 256 is an arbitrary max that should be impracticel to reach
     */
    public static readonly MAX_NAT_GATEWAYS: number = 256;

    /**
     * The deafult subnet configuration
     *
     * 1 Public and 1 Private subnet per AZ evenly split
     */
    public static readonly DEFAULT_SUBNETS: SubnetConfiguration[] = [
        {
            subnetType: SubnetType.Public,
            name: 'Public',
            natGateway: true
        },
        {
            subnetType: SubnetType.Private,
            name: 'Private',
            natGateway: false
        }
    ];

    /**
     * Identifier for this VPC
     */
    public readonly vpcId: VpcNetworkId;

    /**
     * List of public subnets in this VPC
     */
    public readonly publicSubnets: VpcSubnetRef[] = [];

    /**
     * List of private subnets in this VPC
     */
    public readonly privateSubnets: VpcSubnetRef[] = [];

    /**
     * List of internal subnets in this VPC
     */
    public readonly internalSubnets: VpcSubnetRef[] = [];

    /**
     * Maximum Number of NAT Gateways used to control cost
     *
     * @default {VpcNetwork.MAX_NAT_GATEWAYS}
     */
    private readonly maxNatGateways: number;

    /**
     * The VPC resource
     */
    private resource: cloudformation.VPCResource;

    /**
     * The NetworkBuilder
     */
    private networkBuilder: NetworkBuilder;

    /**
     * Mapping of NatGateway by AZ
     */
    private natGatewayByAZ: Obj<Token> = {};

    /**
     * Subnet configurations for this VPC
     */
    private subnetConfigurations: SubnetConfiguration[] = [];

    /**
     * Maximum AZs to Uses for this VPC
     *
     * @default All
     */
    private availabilityZones: string[];

    /**
     * VpcNetwork creates a VPC that spans a whole region.
     * It will automatically divide the provided VPC CIDR range, and create public and private subnets per Availability Zone.
     * Network routing for the public subnets will be configured to allow outbound access directly via an Internet Gateway.
     * Network routing for the private subnets will be configured to allow outbound access via a set of resilient NAT Gateways (one per AZ).
     */
    constructor(parent: Construct, name: string, props: VpcNetworkProps = {}) {
        super(parent, name);

        // Can't have enabledDnsHostnames without enableDnsSupport
        if (props.enableDnsHostnames && !props.enableDnsSupport) {
            throw new Error('To use DNS Hostnames, DNS Support must be enabled, however, it was explicitly disabled.');
        }

        const cidrBlock = props.cidr || VpcNetwork.DEFAULT_CIDR_RANGE;
        this.networkBuilder = new NetworkBuilder(cidrBlock);

        const enableDnsHostnames = props.enableDnsHostnames == null ? true : props.enableDnsHostnames;
        const enableDnsSupport = props.enableDnsSupport == null ? true : props.enableDnsSupport;
        const instanceTenancy = props.defaultInstanceTenancy || 'default';
        const tags = props.tags || [];

        // Define a VPC using the provided CIDR range
        this.resource = new cloudformation.VPCResource(this, 'Resource', {
            cidrBlock,
            enableDnsHostnames,
            enableDnsSupport,
            instanceTenancy,
            tags
        });

        this.availabilityZones = new AvailabilityZoneProvider(this).availabilityZones;
        this.availabilityZones.sort();
        if (props.maxAZs != null) {
           this.availabilityZones = this.availabilityZones.slice(0, props.maxAZs);
        }

        this.vpcId = this.resource.ref;
        this.dependencyElements.push(this.resource);

        this.maxNatGateways = props.maxNatGateways || VpcNetwork.MAX_NAT_GATEWAYS;

        this.subnetConfigurations = props.subnetConfigurations || VpcNetwork.DEFAULT_SUBNETS;
        this.createSubnets();

        const allowOutbound = this.subnetConfigurations.filter(
            (subnet) => (subnet.subnetType !== SubnetType.Internal)).length > 0;

        // Create an Internet Gateway and attach it (if the outbound traffic mode != None)
        if (allowOutbound) {
            const igw = new cloudformation.InternetGatewayResource(this, 'IGW');
            const att = new cloudformation.VPCGatewayAttachmentResource(this, 'VPCGW', {
                internetGatewayId: igw.ref,
                vpcId: this.resource.ref
            });
            (this.publicSubnets as VpcPublicSubnet[]).forEach(publicSubnet => {
                publicSubnet.addDefaultIGWRouteEntry(igw.ref);
            });

            this.dependencyElements.push(igw, att);

            (this.privateSubnets as VpcPrivateSubnet[]).forEach((privateSubnet, i) => {
                let ngwId = this.natGatewayByAZ[privateSubnet.availabilityZone];
                if (ngwId === undefined) {
                    const ngwArray = Array.from(Object.values(this.natGatewayByAZ));
                    // round robin the available NatGW since one is not in your AZ
                    ngwId = ngwArray[i % ngwArray.length];
                }
                privateSubnet.addDefaultNatRouteEntry(ngwId);
            });
        }
    }

    /**
     * @returns {Token} The IPv4 CidrBlock as returned by the VPC
     */
    public get cidr(): Token {
        return this.resource.getAtt("CidrBlock");
    }

    /**
     * createSubnets takes a VPC, and creates a public and private subnet
     * in each Availability Zone.
     */
    private createSubnets() {
        const remainingSpaceSubnets: SubnetConfiguration[] = [];

        // Calculate number of public/private subnets based on number of AZs

        for (const subnet of this.subnetConfigurations) {
            subnet.mapPublicIpOnLaunch = subnet.mapPublicIpOnLaunch ||
                (subnet.subnetType === SubnetType.Public);

            if (subnet.cidrMask === undefined) {
                remainingSpaceSubnets.push(subnet);
                continue;
            }
            this.createSubnetResources(subnet, subnet.cidrMask);
        }

        const totalRemaining = remainingSpaceSubnets.length * this.availabilityZones.length;
        const cidrMaskForRemaing = this.networkBuilder.maskForRemainingSubnets(totalRemaining);
        for (const subnet of remainingSpaceSubnets) {
            this.createSubnetResources(subnet, cidrMaskForRemaing);
        }
    }

    private createSubnetResources(subnetConfig: SubnetConfiguration, cidrMask: number) {
        this.availabilityZones.forEach((zone, index) => {
            const name: string = `${subnetConfig.name}Subnet${index + 1}`;
            const subnetProps = {
                availabilityZone: zone,
                vpcId: this.vpcId,
                cidrBlock: this.networkBuilder.addSubnet(cidrMask),
                mapPublicIpOnLaunch: subnetConfig.mapPublicIpOnLaunch
            };

            switch (subnetConfig.subnetType) {
                case SubnetType.Public:
                    const publicSubnet = new VpcPublicSubnet(this, name, subnetProps);
                    if (subnetConfig.natGateway) {
                        const ngwArray = Array.from(Object.values(this.natGatewayByAZ));
                        if (ngwArray.length < this.maxNatGateways) {
                            this.natGatewayByAZ[zone] = publicSubnet.addNatGateway();
                        }
                    }
                    this.publicSubnets.push(publicSubnet);
                    break;
                case SubnetType.Private:
                    const privateSubnet = new VpcPrivateSubnet(this, name, subnetProps);
                    this.privateSubnets.push(privateSubnet);
                    break;
                case SubnetType.Internal:
                    const internalSubnet = new VpcPrivateSubnet(this, name, subnetProps);
                    this.internalSubnets.push(internalSubnet);
                    break;
            }
        });
    }
}

/**
 * Specify configuration parameters for a VPC subnet
 */
export interface VpcSubnetProps {
    availabilityZone: string;
    vpcId: Token;
    cidrBlock: string;
    mapPublicIpOnLaunch?: boolean;
}

/**
 * Represents a new VPC subnet resource
 */
export class VpcSubnet extends VpcSubnetRef {
    /**
     * The Availability Zone the subnet is located in
     */
    public readonly availabilityZone: string;

    /**
     * The subnetId for this particular subnet
     */
    public readonly subnetId: VpcSubnetId;

    /**
     * The routeTableId attached to this subnet.
     */
    private readonly routeTableId: Token;

    constructor(parent: Construct, name: string, props: VpcSubnetProps) {
        super(parent, name);
        this.availabilityZone = props.availabilityZone;
        const subnet = new cloudformation.SubnetResource(this, 'Subnet', {
            vpcId: props.vpcId,
            cidrBlock: props.cidrBlock,
            availabilityZone: props.availabilityZone,
            mapPublicIpOnLaunch: props.mapPublicIpOnLaunch,
        });
        this.subnetId = subnet.ref;
        const table = new cloudformation.RouteTableResource(this, 'RouteTable', {
            vpcId: props.vpcId,
        });
        this.routeTableId = table.ref;

        // Associate the public route table for this subnet, to this subnet
        const routeAssoc = new cloudformation.SubnetRouteTableAssociationResource(this, 'RouteTableAssociatioin', {
            subnetId: this.subnetId,
            routeTableId: table.ref
        });

        this.dependencyElements.push(subnet, table, routeAssoc);
    }

    protected addDefaultRouteToNAT(natGatewayId: Token) {
        new cloudformation.RouteResource(this, `DefaultRoute`, {
            routeTableId: this.routeTableId,
            destinationCidrBlock: '0.0.0.0/0',
            natGatewayId
        });
    }

    protected addDefaultRouteToIGW(gatewayId: Token) {
        new cloudformation.RouteResource(this, `DefaultRoute`, {
            routeTableId: this.routeTableId,
            destinationCidrBlock: '0.0.0.0/0',
            gatewayId
        });
    }
}

/**
 * Represents a public VPC subnet resource
 */
export class VpcPublicSubnet extends VpcSubnet {
    constructor(parent: Construct, name: string, props: VpcSubnetProps) {
        super(parent, name, props);
    }

    /**
     * Create a default route that points to a passed IGW
     */
    public addDefaultIGWRouteEntry(gatewayId: Token) {
        this.addDefaultRouteToIGW(gatewayId);
    }

    /**
     * Creates a new managed NAT gateway attached to this public subnet.
     * Also adds the EIP for the managed NAT.
     * Returns the NAT Gateway ref
     */
    public addNatGateway() {
        // Create a NAT Gateway in this public subnet
        const ngw = new cloudformation.NatGatewayResource(this, `NATGateway`, {
            subnetId: this.subnetId,
            allocationId: new cloudformation.EIPResource(this, `EIP`, {
                domain: 'vpc'
            }).eipAllocationId
        });
        return ngw.ref;
    }
}

/**
 * Represents a private VPC subnet resource
 */
export class VpcPrivateSubnet extends VpcSubnet {
    constructor(parent: Construct, name: string, props: VpcSubnetProps) {
        super(parent, name, props);
    }

    /**
     * Adds an entry to this subnets route table that points to the passed NATGatwayId
     */
    public addDefaultNatRouteEntry(natGatewayId: Token) {
        this.addDefaultRouteToNAT(natGatewayId);
    }
}
