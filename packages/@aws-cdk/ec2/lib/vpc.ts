import { AvailabilityZoneProvider, Construct, Tag, Token } from '@aws-cdk/core';
import { ec2 } from '@aws-cdk/resources';
import { Obj } from '@aws-cdk/util';
import { NetworkBuilder, NetworkUtils } from './network-util';
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
     * Defines whether the VPC is configured to route outbound traffic from private and/or public subnets.
     * By default, outbound traffic will be allowed from public and private subnets.
     */
    outboundTraffic?: OutboundTrafficMode;

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
     * Configure the subnets to build for each AZ
     *
     * The subnets are constructed in the context of the VPC so you only need
     * specify the configuration. The VPC details (VPC ID, specific CIDR,
     * specific AZ will be calculated during creation)
     *
     * For example if you want three private subnets and three public subnets
     * across 3 AZs then maxAZs = 3 and provide the following:
     * subnets: [
     * {
     *   cidrMask: 24,
     *   name: ingress,
     *   subnetType: SubnetType.Public,
     *   natGateway: true,
     * },
     * {
     *   cidrMask: 24,
     *   name: application,
     *   subnetType: SubnetType.Private,
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
 * The outbound traffic mode defines whether the VPC is configured to route outbound traffic.
 */
export enum OutboundTrafficMode {

    /**
     * Outbound traffic is not routed. No Internet Gateway (IGW) will be deployed, and no NAT Gateways will be deployed.
     */
    None = 1,

    /**
     * Outbound traffic will be routed from public subnets via an Internet Gateway.
     * Outbound traffic from private subnets will not be routed.
     */
    FromPublicSubnetsOnly = 2,

    /**
     * Outbound traffic from public subnets will be routed via an Internet Gateway.
     * Outbound traffic from private subnets will be routed via a set of NAT Gateways (1 per AZ).
     */
    FromPublicAndPrivateSubnets = 3
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
    public static readonly DEFAULT_CIDR_RANGE = '10.0.0.0/16';

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
     * The VPC resource
     */
    private resource: ec2.VPCResource;

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
        const enableDnsHostnames = props.enableDnsHostnames == null ? true : props.enableDnsHostnames;
        const enableDnsSupport = props.enableDnsSupport == null ? true : props.enableDnsSupport;
        const instanceTenancy = props.defaultInstanceTenancy || 'default';
        const tags = props.tags || [];
        const outboundTraffic = props.outboundTraffic || OutboundTrafficMode.FromPublicAndPrivateSubnets;

        // Define a VPC using the provided CIDR range
        this.resource = new ec2.VPCResource(this, 'Resource', {
            cidrBlock,
            enableDnsHostnames,
            enableDnsSupport,
            instanceTenancy,
            tags
        });

        this.vpcId = this.resource.ref;
        this.dependencyElements.push(this.resource);

        const allowOutbound =
            outboundTraffic === OutboundTrafficMode.FromPublicSubnetsOnly ||
            outboundTraffic === OutboundTrafficMode.FromPublicAndPrivateSubnets;

        // Create public and private subnets in each AZ
        this.createSubnets(cidrBlock, outboundTraffic, props.maxAZs, props.subnetConfigurations);

        // Create an Internet Gateway and attach it (if the outbound traffic mode != None)
        if (allowOutbound) {
            const igw = new ec2.InternetGatewayResource(this, 'IGW');
            const att = new ec2.VPCGatewayAttachmentResource(this, 'VPCGW', {
                internetGatewayId: igw.ref,
                vpcId: this.resource.ref
            });
            (this.publicSubnets as VpcPublicSubnet[]).forEach(publicSubnet => {
                publicSubnet.addDefaultIGWRouteEntry(igw.ref);
            });

            this.dependencyElements.push(igw, att);
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
    private createSubnets(
      cidr: string,
      outboundTraffic: OutboundTrafficMode,
      maxAZs?: number,
      subnets?: SubnetConfiguration[]) {

        // Calculate number of public/private subnets based on number of AZs
        const zones = new AvailabilityZoneProvider(this).availabilityZones;
        zones.sort();

        // Restrict to maxAZs if given
        if (maxAZs != null) {
            zones.splice(maxAZs);
        }

        if (subnets != null) {
          const networkBuilder = new NetworkBuilder(cidr);
          this.createCustomSubnets(networkBuilder, subnets, zones);
        } else {
          // Split the CIDR range into each availablity zone
          const ranges = NetworkUtils.splitCIDR(cidr, zones.length);

          for (let i = 0; i < zones.length; i++) {
            this.createSubnetPair(ranges[i], zones[i], i + 1, outboundTraffic);
          }
        }

    }

    /**
     * Creates a public and private subnet, as well as the needed nat gateway and default route, if necessary.
     */
    private createSubnetPair(azCidr: string, zone: string, index: number, outboundTraffic: OutboundTrafficMode) {
        // Split the CIDR range for this AZ into two (public and private)
        const subnetRanges = NetworkUtils.splitCIDR(azCidr, 2);
        const publicSubnet = new VpcPublicSubnet(this, `PublicSubnet${index}`, {
            mapPublicIpOnLaunch: true,
            vpcId: this.vpcId,
            availabilityZone: zone,
            cidrBlock: subnetRanges[0]
        });
        const privateSubnet = new VpcPrivateSubnet(this, `PrivateSubnet${index}`, {
            mapPublicIpOnLaunch: false,
            vpcId: this.vpcId,
            availabilityZone: zone,
            cidrBlock: subnetRanges[1]
        });

        // If outbound traffic from private subnets is configured, also configure NAT Gateways
        // in each public subnet, and configure the default route for the private subnet via them.
        if (outboundTraffic === OutboundTrafficMode.FromPublicAndPrivateSubnets) {
            const ngwId = publicSubnet.addNatGateway();
            privateSubnet.addDefaultNatRouteEntry(ngwId);
        }

        this.publicSubnets.push(publicSubnet);
        this.privateSubnets.push(privateSubnet);
        this.dependencyElements.push(publicSubnet, privateSubnet);
    }
    private createCustomSubnets(builder: NetworkBuilder, subnets: SubnetConfiguration[], zones: string[]) {

      const natGatewayByAZ: Obj<Token> = {};

      for (const subnet of subnets) {
        let azs = zones;
        if (subnet.numAZs != null) {
          azs = zones.slice(subnet.numAZs);
        }
        for (const zone of azs) {
          const cidr: string = builder.addSubnet(subnet.cidrMask);
          const name: string = `${subnet.name}AZ${zone.substr(-1)}`;
          switch (subnet.subnetType) {
            case SubnetType.Public:
              const publicSubnet = new VpcPublicSubnet(this, name, {
                  mapPublicIpOnLaunch: subnet.mapPublicIpOnLaunch || true,
                  vpcId: this.vpcId,
                  availabilityZone: zone,
                  cidrBlock: cidr
              });
              if (subnet.natGateway) {
                natGatewayByAZ[zone] = publicSubnet.addNatGateway();
              }
              this.publicSubnets.push(publicSubnet);
              break;
            case SubnetType.Private:
              const privateSubnet = new VpcPrivateSubnet(this, name, {
                  mapPublicIpOnLaunch: subnet.mapPublicIpOnLaunch || false,
                  vpcId: this.vpcId,
                  availabilityZone: zone,
                  cidrBlock: cidr
              });
              this.privateSubnets.push(privateSubnet);
              break;
            case SubnetType.Internal:
              const internalSubnet = new VpcPrivateSubnet(this, name, {
                  mapPublicIpOnLaunch: subnet.mapPublicIpOnLaunch || false,
                  vpcId: this.vpcId,
                  availabilityZone: zone,
                  cidrBlock: cidr
              });
              this.internalSubnets.push(internalSubnet);
              break;
          }
        }
      }
      (this.privateSubnets as VpcPrivateSubnet[]).forEach((privateSubnet, i) => {
        let ngwId = natGatewayByAZ[privateSubnet.availabilityZone];
        if (ngwId === undefined) {
          const ngwArray = Array.from(Object.values(natGatewayByAZ));
          ngwId = ngwArray[i % ngwArray.length];
        }
        privateSubnet.addDefaultNatRouteEntry(ngwId);
      });
    }

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
    cidrMask: number;
    // Public (IGW), Private (Nat GW), Internal (no outbound)
    subnetType: SubnetType;
    // name that will be used to generate an AZ specific name e.g. name-2a
    name: string;
    // if true will place a NAT Gateway in this subnet, subnetType must be Public
    natGateway?: boolean;
    // defaults to true in Subnet.Public, false in Subnet.Private or Subnet.Internal
    mapPublicIpOnLaunch?: boolean;
    // number of AZs to build this subnet in
    numAZs?: number;
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
        const subnet = new ec2.SubnetResource(this, 'Subnet', {
            vpcId: props.vpcId,
            cidrBlock: props.cidrBlock,
            availabilityZone: props.availabilityZone,
            mapPublicIpOnLaunch: props.mapPublicIpOnLaunch,
        });
        this.subnetId = subnet.ref;
        const table = new ec2.RouteTableResource(this, 'RouteTable', {
            vpcId: props.vpcId,
        });
        this.routeTableId = table.ref;

        // Associate the public route table for this subnet, to this subnet
        const routeAssoc = new ec2.SubnetRouteTableAssociationResource(this, 'RouteTableAssociatioin', {
            subnetId: this.subnetId,
            routeTableId: table.ref
        });

        this.dependencyElements.push(subnet, table, routeAssoc);
    }

    protected addDefaultRouteToNAT(natGatewayId: Token) {
        new ec2.RouteResource(this, `DefaultRoute`, {
            routeTableId: this.routeTableId,
            destinationCidrBlock: '0.0.0.0/0',
            natGatewayId
        });
    }

    protected addDefaultRouteToIGW(gatewayId: Token) {
        new ec2.RouteResource(this, `DefaultRoute`, {
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
        const ngw = new ec2.NatGatewayResource(this, `NATGateway`, {
            subnetId: this.subnetId,
            allocationId: new ec2.EIPResource(this, `EIP`, {
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
