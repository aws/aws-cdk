import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './ec2.generated';
import { NetworkBuilder } from './network-util';
import { DEFAULT_SUBNET_NAME, subnetId } from './util';
import { SubnetType, VpcNetworkRef, VpcSubnetRef } from './vpc-ref';

/**
 * Name tag constant
 */
const NAME_TAG: string = 'Name';

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
  tags?: cdk.Tags;

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
  natGateways?: number;

  /**
   * Configure the subnets to build for each AZ
   *
   * The subnets are constructed in the context of the VPC so you only need
   * specify the configuration. The VPC details (VPC ID, specific CIDR,
   * specific AZ will be calculated during creation)
   *
   * For example if you want 1 public subnet, 1 private subnet, and 1 isolated
   * subnet in each AZ provide the following:
   * subnetConfiguration: [
   *    {
   *      cidrMask: 24,
   *      name: 'ingress',
   *      subnetType: SubnetType.Public,
   *    },
   *    {
   *      cidrMask: 24,
   *      name: 'application',
   *      subnetType: SubnetType.Private,
   *    },
   *    {
   *      cidrMask: 28,
   *      name: 'rds',
   *      subnetType: SubnetType.Isolated,
   *    }
   * ]
   *
   * `cidrMask` is optional and if not provided the IP space in the VPC will be
   * evenly divided between the requested subnets.
   *
   * @default the VPC CIDR will be evenly divided between 1 public and 1
   * private subnet per AZ
   */
  subnetConfiguration?: SubnetConfiguration[];
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
 * Specify configuration parameters for a VPC to be built
 */
export interface SubnetConfiguration {
  /**
   * The CIDR Mask or the number of leading 1 bits in the routing mask
   *
   * Valid values are 16 - 28
   */
  cidrMask?: number;

  /**
   * The type of Subnet to configure.
   *
   * The Subnet type will control the ability to route and connect to the
   * Internet.
   */
  subnetType: SubnetType;

  /**
   * The common Logical Name for the `VpcSubnet`
   *
   * Thi name will be suffixed with an integer correlating to a specific
   * availability zone.
   */
  name: string;

  /**
   * The AWS resource tags to associate with the resource.
   */
  tags?: cdk.Tags;
}

/**
 * VpcNetwork deploys an AWS VPC, with public and private subnets per Availability Zone.
 * For example:
 *
 * import { VpcNetwork } from '@aws-cdk/aws-ec2'
 *
 * const vpc = new VpcNetwork(this, {
 *   cidr: "10.0.0.0/16"
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
export class VpcNetwork extends VpcNetworkRef implements cdk.ITaggable {

  /**
   * The default CIDR range used when creating VPCs.
   * This can be overridden using VpcNetworkProps when creating a VPCNetwork resource.
   * e.g. new VpcResource(this, { cidr: '192.168.0.0./16' })
   */
  public static readonly DEFAULT_CIDR_RANGE: string = '10.0.0.0/16';

  /**
   * The default subnet configuration
   *
   * 1 Public and 1 Private subnet per AZ evenly split
   */
  public static readonly DEFAULT_SUBNETS: SubnetConfiguration[] = [
    {
      subnetType: SubnetType.Public,
      name: DEFAULT_SUBNET_NAME[SubnetType.Public],
    },
    {
      subnetType: SubnetType.Private,
      name: DEFAULT_SUBNET_NAME[SubnetType.Private],
    }
  ];

  /**
   * Identifier for this VPC
   */
  public readonly vpcId: string;

  /**
   * List of public subnets in this VPC
   */
  public readonly publicSubnets: VpcSubnetRef[] = [];

  /**
   * List of private subnets in this VPC
   */
  public readonly privateSubnets: VpcSubnetRef[] = [];

  /**
   * List of isolated subnets in this VPC
   */
  public readonly isolatedSubnets: VpcSubnetRef[] = [];

  /**
   * AZs for this VPC
   */
  public readonly availabilityZones: string[];

  /**
   * Manage tags for this construct and children
   */
  public readonly tags: cdk.TagManager;

  /**
   * Maximum Number of NAT Gateways used to control cost
   *
   * @default {VpcNetworkProps.maxAZs}
   */
  private readonly natGateways: number;

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
  private natGatewayByAZ: { [az: string]: string } = {};

  /**
   * Subnet configurations for this VPC
   */
  private subnetConfiguration: SubnetConfiguration[] = [];

  /**
   * VpcNetwork creates a VPC that spans a whole region.
   * It will automatically divide the provided VPC CIDR range, and create public and private subnets per Availability Zone.
   * Network routing for the public subnets will be configured to allow outbound access directly via an Internet Gateway.
   * Network routing for the private subnets will be configured to allow outbound access via a set of resilient NAT Gateways (one per AZ).
   */
  constructor(parent: cdk.Construct, name: string, props: VpcNetworkProps = {}) {
    super(parent, name);

    // Can't have enabledDnsHostnames without enableDnsSupport
    if (props.enableDnsHostnames && !props.enableDnsSupport) {
      throw new Error('To use DNS Hostnames, DNS Support must be enabled, however, it was explicitly disabled.');
    }

    this.tags = new cdk.TagManager(this, { initialTags: props.tags});
    this.tags.setTag(NAME_TAG, this.path, { overwrite: false });

    const cidrBlock = ifUndefined(props.cidr, VpcNetwork.DEFAULT_CIDR_RANGE);
    this.networkBuilder = new NetworkBuilder(cidrBlock);

    const enableDnsHostnames = props.enableDnsHostnames == null ? true : props.enableDnsHostnames;
    const enableDnsSupport = props.enableDnsSupport == null ? true : props.enableDnsSupport;
    const instanceTenancy = props.defaultInstanceTenancy || 'default';

    // Define a VPC using the provided CIDR range
    this.resource = new cloudformation.VPCResource(this, 'Resource', {
      cidrBlock,
      enableDnsHostnames,
      enableDnsSupport,
      instanceTenancy,
      tags: this.tags,
    });

    this.availabilityZones = new cdk.AvailabilityZoneProvider(this).availabilityZones;
    this.availabilityZones.sort();
    if (props.maxAZs != null) {
       this.availabilityZones = this.availabilityZones.slice(0, props.maxAZs);
    }

    this.vpcId = this.resource.vpcId;
    this.dependencyElements.push(this.resource);

    this.subnetConfiguration = ifUndefined(props.subnetConfiguration, VpcNetwork.DEFAULT_SUBNETS);
    const useNatGateway = this.subnetConfiguration.filter(
      subnet => (subnet.subnetType === SubnetType.Private)).length > 0;
    this.natGateways = ifUndefined(props.natGateways,
      useNatGateway ? this.availabilityZones.length : 0);

    // subnetConfiguration and natGateways must be set before calling createSubnets
    this.createSubnets();

    const allowOutbound = this.subnetConfiguration.filter(
      subnet => (subnet.subnetType !== SubnetType.Isolated)).length > 0;

    // Create an Internet Gateway and attach it if necessary
    if (allowOutbound) {
      const igw = new cloudformation.InternetGatewayResource(this, 'IGW', {
        tags: new cdk.TagManager(this),
      });
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
   * @returns The IPv4 CidrBlock as returned by the VPC
   */
  public get cidr(): string {
    return this.resource.getAtt("CidrBlock").toString();
  }

  /**
   * createSubnets creates the subnets specified by the subnet configuration
   * array or creates the `DEFAULT_SUBNETS` configuration
   */
  private createSubnets() {
    const remainingSpaceSubnets: SubnetConfiguration[] = [];

    // Calculate number of public/private subnets based on number of AZs
    const zones = new cdk.AvailabilityZoneProvider(this).availabilityZones;
    zones.sort();

    for (const subnet of this.subnetConfiguration) {
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
      const name = subnetId(subnetConfig.name, index);
      const subnetProps: VpcSubnetProps = {
        availabilityZone: zone,
        vpcId: this.vpcId,
        cidrBlock: this.networkBuilder.addSubnet(cidrMask),
        mapPublicIpOnLaunch: (subnetConfig.subnetType === SubnetType.Public),
        tags: subnetConfig.tags,
      };

      switch (subnetConfig.subnetType) {
        case SubnetType.Public:
          const publicSubnet = new VpcPublicSubnet(this, name, subnetProps);
          if (this.natGateways > 0) {
            const ngwArray = Array.from(Object.values(this.natGatewayByAZ));
            if (ngwArray.length < this.natGateways) {
              this.natGatewayByAZ[zone] = publicSubnet.addNatGateway();
            }
          }
          this.publicSubnets.push(publicSubnet);
          break;
        case SubnetType.Private:
          const privateSubnet = new VpcPrivateSubnet(this, name, subnetProps);
          this.privateSubnets.push(privateSubnet);
          break;
        case SubnetType.Isolated:
          const isolatedSubnet = new VpcPrivateSubnet(this, name, subnetProps);
          this.isolatedSubnets.push(isolatedSubnet);
          break;
      }
    });
  }
}

/**
 * Specify configuration parameters for a VPC subnet
 */
export interface VpcSubnetProps {

  /**
   * The availability zone for the subnet
   */
  availabilityZone: string;

  /**
   * The VPC which this subnet is part of
   */
  vpcId: string;

  /**
   * The CIDR notation for this subnet
   */
  cidrBlock: string;

  /**
   * Controls if a public IP is associated to an instance at launch
   *
   * Defaults to true in Subnet.Public, false in Subnet.Private or Subnet.Isolated.
   */
  mapPublicIpOnLaunch?: boolean;

  /**
   * The AWS resource tags to associate with the Subnet
   */
  tags?: cdk.Tags;
}

/**
 * Represents a new VPC subnet resource
 */
export class VpcSubnet extends VpcSubnetRef implements cdk.ITaggable {

  /**
   * The Availability Zone the subnet is located in
   */
  public readonly availabilityZone: string;

  /**
   * The subnetId for this particular subnet
   */
  public readonly subnetId: string;

  /**
   * Manage tags for Construct and propagate to children
   */
  public readonly tags: cdk.TagManager;

  /**
   * The routeTableId attached to this subnet.
   */
  private readonly routeTableId: string;

  constructor(parent: cdk.Construct, name: string, props: VpcSubnetProps) {
    super(parent, name);
    this.tags = new cdk.TagManager(this, {initialTags: props.tags});
    this.tags.setTag(NAME_TAG, this.path, {overwrite: false});

    this.availabilityZone = props.availabilityZone;
    const subnet = new cloudformation.SubnetResource(this, 'Subnet', {
      vpcId: props.vpcId,
      cidrBlock: props.cidrBlock,
      availabilityZone: props.availabilityZone,
      mapPublicIpOnLaunch: props.mapPublicIpOnLaunch,
      tags: this.tags,
    });
    this.subnetId = subnet.subnetId;
    const table = new cloudformation.RouteTableResource(this, 'RouteTable', {
      vpcId: props.vpcId,
      tags: new cdk.TagManager(this),
    });
    this.routeTableId = table.ref;

    // Associate the public route table for this subnet, to this subnet
    const routeAssoc = new cloudformation.SubnetRouteTableAssociationResource(this, 'RouteTableAssociatioin', {
      subnetId: this.subnetId,
      routeTableId: table.ref
    });

    this.dependencyElements.push(subnet, table, routeAssoc);
  }

  protected addDefaultRouteToNAT(natGatewayId: string) {
    new cloudformation.RouteResource(this, `DefaultRoute`, {
      routeTableId: this.routeTableId,
      destinationCidrBlock: '0.0.0.0/0',
      natGatewayId
    });
  }

  protected addDefaultRouteToIGW(gatewayId: string) {
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
  constructor(parent: cdk.Construct, name: string, props: VpcSubnetProps) {
    super(parent, name, props);
  }

  /**
   * Create a default route that points to a passed IGW
   */
  public addDefaultIGWRouteEntry(gatewayId: string) {
    this.addDefaultRouteToIGW(gatewayId);
  }

  /**
   * Creates a new managed NAT gateway attached to this public subnet.
   * Also adds the EIP for the managed NAT.
   * @returns A ref to the the NAT Gateway ID
   */
  public addNatGateway() {
    // Create a NAT Gateway in this public subnet
    const ngw = new cloudformation.NatGatewayResource(this, `NATGateway`, {
      subnetId: this.subnetId,
      allocationId: new cloudformation.EIPResource(this, `EIP`, {
        domain: 'vpc'
      }).eipAllocationId,
      tags: new cdk.TagManager(this),
    });
    return ngw.natGatewayId;
  }
}

/**
 * Represents a private VPC subnet resource
 */
export class VpcPrivateSubnet extends VpcSubnet {
  constructor(parent: cdk.Construct, name: string, props: VpcSubnetProps) {
    super(parent, name, props);
  }

  /**
   * Adds an entry to this subnets route table that points to the passed NATGatwayId
   */
  public addDefaultNatRouteEntry(natGatewayId: string) {
    this.addDefaultRouteToNAT(natGatewayId);
  }
}

function ifUndefined<T>(value: T | undefined, defaultValue: T): T {
     return value !== undefined ? value : defaultValue;
}
