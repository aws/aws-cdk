import cdk = require('@aws-cdk/cdk');
import { ConcreteDependable, IDependable } from '@aws-cdk/cdk';
import { CfnEIP, CfnInternetGateway, CfnNatGateway, CfnRoute, CfnVPNGateway, CfnVPNGatewayRoutePropagation } from './ec2.generated';
import { CfnRouteTable, CfnSubnet, CfnSubnetRouteTableAssociation, CfnVPC, CfnVPCGatewayAttachment } from './ec2.generated';
import { NetworkBuilder } from './network-util';
import { DEFAULT_SUBNET_NAME, ExportSubnetGroup, ImportSubnetGroup, subnetId  } from './util';
import { VpcEndpointAwsService, VpcGatewayEndpoint, VpcGatewayEndpointOptions } from './vpc-endpoint';
import { VpcNetworkProvider, VpcNetworkProviderProps } from './vpc-network-provider';
import { IVpcNetwork, IVpcSubnet, SubnetSelection, SubnetType, VpcNetworkBase, VpcNetworkImportProps, VpcSubnetImportProps } from './vpc-ref';
import { VpnConnectionOptions, VpnConnectionType } from './vpn';

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
   * Define the maximum number of AZs to use in this region
   *
   * If the region has more AZs than you want to use (for example, because of EIP limits),
   * pick a lower number here. The AZs will be sorted and picked from the start of the list.
   *
   * If you pick a higher number than the number of AZs in the region, all AZs in
   * the region will be selected. To use "all AZs" available to your account, use a
   * high number (such as 99).
   *
   * @default 3
   */
  maxAZs?: number;

  /**
   * The number of NAT Gateways to create.
   *
   * For example, if set this to 1 and your subnet configuration is for 3 Public subnets then only
   * one of the Public subnets will have a gateway and all Private subnets will route to this NAT Gateway.
   * @default maxAZs
   */
  natGateways?: number;

  /**
   * Configures the subnets which will have NAT Gateways
   *
   * You can pick a specific group of subnets by specifying the group name;
   * the picked subnets must be public subnets.
   *
   * @default All public subnets
   */
  natGatewaySubnets?: SubnetSelection;

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

  /**
   * Indicates whether a VPN gateway should be created and attached to this VPC.
   *
   * @default true when vpnGatewayAsn or vpnConnections is specified.
   */
  vpnGateway?: boolean;

  /**
   * The private Autonomous System Number (ASN) for the VPN gateway.
   *
   * @default Amazon default ASN
   */
  vpnGatewayAsn?: number;

  /**
   * VPN connections to this VPC.
   *
   * @default no connections
   */
  vpnConnections?: { [id: string]: VpnConnectionOptions }

  /**
   * Where to propagate VPN routes.
   *
   * @default on the route tables associated with private subnets
   */
  vpnRoutePropagation?: SubnetType[]

  /**
   * Gateway endpoints to add to this VPC.
   */
  gatewayEndpoints?: { [id: string]: VpcGatewayEndpointOptions }
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
export class VpcNetwork extends VpcNetworkBase {
  /**
   * @returns The IPv4 CidrBlock as returned by the VPC
   */
  public get cidr(): string {
    return this.resource.getAtt("CidrBlock").toString();
  }

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
   * Import an exported VPC
   */
  public static import(scope: cdk.Construct, id: string, props: VpcNetworkImportProps): IVpcNetwork {
    return new ImportedVpcNetwork(scope, id, props);
  }

  /**
   * Import an existing VPC from context
   */
  public static importFromContext(scope: cdk.Construct, id: string, props: VpcNetworkProviderProps): IVpcNetwork {
    return VpcNetwork.import(scope, id, new VpcNetworkProvider(scope, props).vpcProps);
  }

  /**
   * Identifier for this VPC
   */
  public readonly vpcId: string;

  /**
   * List of public subnets in this VPC
   */
  public readonly publicSubnets: IVpcSubnet[] = [];

  /**
   * List of private subnets in this VPC
   */
  public readonly privateSubnets: IVpcSubnet[] = [];

  /**
   * List of isolated subnets in this VPC
   */
  public readonly isolatedSubnets: IVpcSubnet[] = [];

  /**
   * AZs for this VPC
   */
  public readonly availabilityZones: string[];

  /**
   * Identifier for the VPN gateway
   */
  public readonly vpnGatewayId?: string;

  /**
   * The VPC resource
   */
  private resource: CfnVPC;

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
  constructor(scope: cdk.Construct, id: string, props: VpcNetworkProps = {}) {
    super(scope, id);

    // Can't have enabledDnsHostnames without enableDnsSupport
    if (props.enableDnsHostnames && !props.enableDnsSupport) {
      throw new Error('To use DNS Hostnames, DNS Support must be enabled, however, it was explicitly disabled.');
    }

    const cidrBlock = ifUndefined(props.cidr, VpcNetwork.DEFAULT_CIDR_RANGE);
    this.networkBuilder = new NetworkBuilder(cidrBlock);

    const enableDnsHostnames = props.enableDnsHostnames == null ? true : props.enableDnsHostnames;
    const enableDnsSupport = props.enableDnsSupport == null ? true : props.enableDnsSupport;
    const instanceTenancy = props.defaultInstanceTenancy || 'default';

    // Define a VPC using the provided CIDR range
    this.resource = new CfnVPC(this, 'Resource', {
      cidrBlock,
      enableDnsHostnames,
      enableDnsSupport,
      instanceTenancy,
    });

    this.node.apply(new cdk.Tag(NAME_TAG, this.node.path));

    this.availabilityZones = new cdk.AvailabilityZoneProvider(this).availabilityZones;
    this.availabilityZones.sort();

    const maxAZs = props.maxAZs !== undefined ? props.maxAZs : 3;
    this.availabilityZones = this.availabilityZones.slice(0, maxAZs);

    this.vpcId = this.resource.vpcId;

    this.subnetConfiguration = ifUndefined(props.subnetConfiguration, VpcNetwork.DEFAULT_SUBNETS);
    // subnetConfiguration and natGateways must be set before calling createSubnets
    this.createSubnets();

    const allowOutbound = this.subnetConfiguration.filter(
      subnet => (subnet.subnetType !== SubnetType.Isolated)).length > 0;

    // Create an Internet Gateway and attach it if necessary
    if (allowOutbound) {
      const igw = new CfnInternetGateway(this, 'IGW', {
      });
      this.internetDependencies.push(igw);
      const att = new CfnVPCGatewayAttachment(this, 'VPCGW', {
        internetGatewayId: igw.ref,
        vpcId: this.resource.ref
      });

      (this.publicSubnets as VpcPublicSubnet[]).forEach(publicSubnet => {
        publicSubnet.addDefaultIGWRouteEntry(igw, att);
      });

      // if gateways are needed create them
      this.createNatGateways(props.natGateways, props.natGatewaySubnets);

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

    if ((props.vpnConnections || props.vpnGatewayAsn) && props.vpnGateway === false) {
      throw new Error('Cannot specify `vpnConnections` or `vpnGatewayAsn` when `vpnGateway` is set to false.');
    }

    if (props.vpnGateway || props.vpnConnections || props.vpnGatewayAsn) {
      const vpnGateway = new CfnVPNGateway(this, 'VpnGateway', {
        amazonSideAsn: props.vpnGatewayAsn,
        type: VpnConnectionType.IPsec1
      });

      const attachment = new CfnVPCGatewayAttachment(this, 'VPCVPNGW', {
        vpcId: this.vpcId,
        vpnGatewayId: vpnGateway.vpnGatewayName
      });

      this.vpnGatewayId = vpnGateway.vpnGatewayName;

      // Propagate routes on route tables associated with the right subnets
      const vpnRoutePropagation = props.vpnRoutePropagation || [SubnetType.Private];
      let subnets: IVpcSubnet[] = [];
      if (vpnRoutePropagation.includes(SubnetType.Public)) {
        subnets = [...subnets, ...this.publicSubnets];
      }
      if (vpnRoutePropagation.includes(SubnetType.Private)) {
        subnets = [...subnets, ...this.privateSubnets];
      }
      if (vpnRoutePropagation.includes(SubnetType.Isolated)) {
        subnets = [...subnets, ...this.isolatedSubnets];
      }
      const routePropagation = new CfnVPNGatewayRoutePropagation(this, 'RoutePropagation', {
        routeTableIds: (subnets as VpcSubnet[]).map(subnet => subnet.routeTableId),
        vpnGatewayId: this.vpnGatewayId
      });

      // The AWS::EC2::VPNGatewayRoutePropagation resource cannot use the VPN gateway
      // until it has successfully attached to the VPC.
      // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpn-gatewayrouteprop.html
      routePropagation.node.addDependency(attachment);

      const vpnConnections = props.vpnConnections || {};
      for (const [connectionId, connection] of Object.entries(vpnConnections)) {
        this.addVpnConnection(connectionId, connection);
      }
    }

    // Allow creation of gateway endpoints on VPC instantiation as those can be
    // immediately functional without further configuration. This is not the case
    // for interface endpoints where the security group must be configured.
    if (props.gatewayEndpoints) {
      const gatewayEndpoints = props.gatewayEndpoints || {};
      for (const [endpointId, endpoint] of Object.entries(gatewayEndpoints)) {
        this.addGatewayEndpoint(endpointId, endpoint);
      }
    }
  }

  /**
   * Adds a new gateway endpoint to this VPC
   */
  public addGatewayEndpoint(id: string, options: VpcGatewayEndpointOptions): VpcGatewayEndpoint {
    return new VpcGatewayEndpoint(this, id, {
      vpc: this,
      ...options
    });
  }

  /**
   * Adds a new S3 gateway endpoint to this VPC
   */
  public addS3Endpoint(id: string, subnets?: SubnetSelection[]): VpcGatewayEndpoint {
    return new VpcGatewayEndpoint(this, id, {
      service: VpcEndpointAwsService.S3,
      vpc: this,
      subnets
    });
  }

  /**
   * Adds a new DynamoDB gateway endpoint to this VPC
   */
  public addDynamoDbEndpoint(id: string, subnets?: SubnetSelection[]): VpcGatewayEndpoint {
    return new VpcGatewayEndpoint(this, id, {
      service: VpcEndpointAwsService.DynamoDb,
      vpc: this,
      subnets
    });
  }

  /**
   * Export this VPC from the stack
   */
  public export(): VpcNetworkImportProps {
    const pub = new ExportSubnetGroup(this, 'PublicSubnetIDs', this.publicSubnets, SubnetType.Public, this.availabilityZones.length);
    const priv = new ExportSubnetGroup(this, 'PrivateSubnetIDs', this.privateSubnets, SubnetType.Private, this.availabilityZones.length);
    const iso = new ExportSubnetGroup(this, 'IsolatedSubnetIDs', this.isolatedSubnets, SubnetType.Isolated, this.availabilityZones.length);

    return {
      vpcId: new cdk.CfnOutput(this, 'VpcId', { value: this.vpcId }).makeImportValue().toString(),
      vpnGatewayId: new cdk.CfnOutput(this, 'VpnGatewayId', { value: this.vpnGatewayId }).makeImportValue().toString(),
      availabilityZones: this.availabilityZones,
      publicSubnetIds: pub.ids,
      publicSubnetNames: pub.names,
      privateSubnetIds: priv.ids,
      privateSubnetNames: priv.names,
      isolatedSubnetIds: iso.ids,
      isolatedSubnetNames: iso.names,
    };
  }

  private createNatGateways(gateways?: number, placement?: SubnetSelection): void {
    const useNatGateway = this.subnetConfiguration.filter(
      subnet => (subnet.subnetType === SubnetType.Private)).length > 0;

    const natCount = ifUndefined(gateways,
      useNatGateway ? this.availabilityZones.length : 0);

    let natSubnets: VpcPublicSubnet[];
    if (placement) {
      const subnets = this.subnets(placement);
      for (const sub of subnets) {
        if (this.publicSubnets.indexOf(sub) === -1) {
          throw new Error(`natGatewayPlacement ${placement} contains non public subnet ${sub}`);
        }
      }
      natSubnets = subnets as VpcPublicSubnet[];
    } else {
      natSubnets =  this.publicSubnets as VpcPublicSubnet[];
    }

    natSubnets = natSubnets.slice(0, natCount);
    for (const sub of natSubnets) {
      const gateway = sub.addNatGateway();
      this.natGatewayByAZ[sub.availabilityZone] = gateway.natGatewayId;
      this.natDependencies.push(gateway);
    }
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
      };

      let subnet: VpcSubnet;
      switch (subnetConfig.subnetType) {
        case SubnetType.Public:
          const publicSubnet = new VpcPublicSubnet(this, name, subnetProps);
          this.publicSubnets.push(publicSubnet);
          subnet = publicSubnet;
          break;
        case SubnetType.Private:
          const privateSubnet = new VpcPrivateSubnet(this, name, subnetProps);
          this.privateSubnets.push(privateSubnet);
          subnet = privateSubnet;
          break;
        case SubnetType.Isolated:
          const isolatedSubnet = new VpcPrivateSubnet(this, name, subnetProps);
          this.isolatedSubnets.push(isolatedSubnet);
          subnet = isolatedSubnet;
          break;
        default:
          throw new Error(`Unrecognized subnet type: ${subnetConfig.subnetType}`);
      }

      // These values will be used to recover the config upon provider import
      const includeResourceTypes = [CfnSubnet.resourceTypeName];
      subnet.node.apply(new cdk.Tag(SUBNETNAME_TAG, subnetConfig.name, {includeResourceTypes}));
      subnet.node.apply(new cdk.Tag(SUBNETTYPE_TAG, subnetTypeTagValue(subnetConfig.subnetType), {includeResourceTypes}));
    });
  }
}

const SUBNETTYPE_TAG = 'aws-cdk:subnet-type';
const SUBNETNAME_TAG = 'aws-cdk:subnet-name';

function subnetTypeTagValue(type: SubnetType) {
  switch (type) {
    case SubnetType.Public: return 'Public';
    case SubnetType.Private: return 'Private';
    case SubnetType.Isolated: return 'Isolated';
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
}

/**
 * Represents a new VPC subnet resource
 */
export class VpcSubnet extends cdk.Construct implements IVpcSubnet {
  public static import(scope: cdk.Construct, id: string, props: VpcSubnetImportProps): IVpcSubnet {
    return new ImportedVpcSubnet(scope, id, props);
  }

  /**
   * The Availability Zone the subnet is located in
   */
  public readonly availabilityZone: string;

  /**
   * The subnetId for this particular subnet
   */
  public readonly subnetId: string;

  /**
   * Parts of this VPC subnet
   */
  public readonly dependencyElements: cdk.IDependable[] = [];

  /**
   * The routeTableId attached to this subnet.
   */
  public readonly routeTableId: string;

  private readonly internetDependencies = new ConcreteDependable();

  constructor(scope: cdk.Construct, id: string, props: VpcSubnetProps) {
    super(scope, id);
    this.node.apply(new cdk.Tag(NAME_TAG, this.node.path));

    this.availabilityZone = props.availabilityZone;
    const subnet = new CfnSubnet(this, 'Subnet', {
      vpcId: props.vpcId,
      cidrBlock: props.cidrBlock,
      availabilityZone: props.availabilityZone,
      mapPublicIpOnLaunch: props.mapPublicIpOnLaunch,
    });
    this.subnetId = subnet.subnetId;
    const table = new CfnRouteTable(this, 'RouteTable', {
      vpcId: props.vpcId,
    });
    this.routeTableId = table.ref;

    // Associate the public route table for this subnet, to this subnet
    new CfnSubnetRouteTableAssociation(this, 'RouteTableAssociation', {
      subnetId: this.subnetId,
      routeTableId: table.ref
    });
  }

  public export(): VpcSubnetImportProps {
    return {
      availabilityZone: new cdk.CfnOutput(this, 'AvailabilityZone', { value: this.availabilityZone }).makeImportValue().toString(),
      subnetId: new cdk.CfnOutput(this, 'VpcSubnetId', { value: this.subnetId }).makeImportValue().toString(),
    };
  }

  public get internetConnectivityEstablished(): IDependable {
    return this.internetDependencies;
  }

  protected addDefaultRouteToNAT(natGatewayId: string) {
    const route = new CfnRoute(this, `DefaultRoute`, {
      routeTableId: this.routeTableId,
      destinationCidrBlock: '0.0.0.0/0',
      natGatewayId
    });
    this.internetDependencies.add(route);
  }

  /**
   * Create a default route that points to a passed IGW, with a dependency
   * on the IGW's attachment to the VPC.
   */
  protected addDefaultRouteToIGW(
    gateway: CfnInternetGateway,
    gatewayAttachment: CfnVPCGatewayAttachment) {
    const route = new CfnRoute(this, `DefaultRoute`, {
      routeTableId: this.routeTableId,
      destinationCidrBlock: '0.0.0.0/0',
      gatewayId: gateway.ref
    });
    route.node.addDependency(gatewayAttachment);

    // Since the 'route' depends on the gateway attachment, just
    // depending on the route is enough.
    this.internetDependencies.add(route);
  }
}

/**
 * Represents a public VPC subnet resource
 */
export class VpcPublicSubnet extends VpcSubnet {

  constructor(scope: cdk.Construct, id: string, props: VpcSubnetProps) {
    super(scope, id, props);
  }

  /**
   * Create a default route that points to a passed IGW, with a dependency
   * on the IGW's attachment to the VPC.
   */
  public addDefaultIGWRouteEntry(
    gateway: CfnInternetGateway,
    gatewayAttachment: CfnVPCGatewayAttachment) {
    this.addDefaultRouteToIGW(gateway, gatewayAttachment);
  }

  /**
   * Creates a new managed NAT gateway attached to this public subnet.
   * Also adds the EIP for the managed NAT.
   * @returns A ref to the the NAT Gateway ID
   */
  public addNatGateway() {
    // Create a NAT Gateway in this public subnet
    const ngw = new CfnNatGateway(this, `NATGateway`, {
      subnetId: this.subnetId,
      allocationId: new CfnEIP(this, `EIP`, {
        domain: 'vpc'
      }).eipAllocationId,
    });
    return ngw;
  }
}

/**
 * Represents a private VPC subnet resource
 */
export class VpcPrivateSubnet extends VpcSubnet {
  constructor(scope: cdk.Construct, id: string, props: VpcSubnetProps) {
    super(scope, id, props);
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

class ImportedVpcNetwork extends VpcNetworkBase {
  public readonly vpcId: string;
  public readonly publicSubnets: IVpcSubnet[];
  public readonly privateSubnets: IVpcSubnet[];
  public readonly isolatedSubnets: IVpcSubnet[];
  public readonly availabilityZones: string[];
  public readonly vpnGatewayId?: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: VpcNetworkImportProps) {
    super(scope, id);

    this.vpcId = props.vpcId;
    this.availabilityZones = props.availabilityZones;
    this.vpnGatewayId = props.vpnGatewayId;

    // tslint:disable:max-line-length
    const pub = new ImportSubnetGroup(props.publicSubnetIds, props.publicSubnetNames, SubnetType.Public, this.availabilityZones, 'publicSubnetIds', 'publicSubnetNames');
    const priv = new ImportSubnetGroup(props.privateSubnetIds, props.privateSubnetNames, SubnetType.Private, this.availabilityZones, 'privateSubnetIds', 'privateSubnetNames');
    const iso = new ImportSubnetGroup(props.isolatedSubnetIds, props.isolatedSubnetNames, SubnetType.Isolated, this.availabilityZones, 'isolatedSubnetIds', 'isolatedSubnetNames');
    // tslint:enable:max-line-length

    this.publicSubnets = pub.import(this);
    this.privateSubnets = priv.import(this);
    this.isolatedSubnets = iso.import(this);
  }

  public export() {
    return this.props;
  }
}

class ImportedVpcSubnet extends cdk.Construct implements IVpcSubnet {
  public readonly internetConnectivityEstablished: cdk.IDependable = new cdk.ConcreteDependable();
  public readonly availabilityZone: string;
  public readonly subnetId: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: VpcSubnetImportProps) {
    super(scope, id);

    this.subnetId = props.subnetId;
    this.availabilityZone = props.availabilityZone;
  }

  public export() {
    return this.props;
  }
}
