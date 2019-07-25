import { ConcreteDependable, Construct, ContextProvider, DependableTrait, IConstruct,
    IDependable, IResource, Resource, Stack, Tag, Token } from '@aws-cdk/core';
import cxapi = require('@aws-cdk/cx-api');
import { CfnEIP, CfnInternetGateway, CfnNatGateway, CfnRoute, CfnVPNGateway, CfnVPNGatewayRoutePropagation } from './ec2.generated';
import { CfnRouteTable, CfnSubnet, CfnSubnetRouteTableAssociation, CfnVPC, CfnVPCGatewayAttachment } from './ec2.generated';
import { NetworkBuilder } from './network-util';
import { allRouteTableIds, defaultSubnetName, ImportSubnetGroup, subnetId, subnetName  } from './util';
import { GatewayVpcEndpoint, GatewayVpcEndpointAwsService, GatewayVpcEndpointOptions } from './vpc-endpoint';
import { InterfaceVpcEndpoint, InterfaceVpcEndpointOptions } from './vpc-endpoint';
import { VpcLookupOptions } from './vpc-lookup';
import { VpnConnection, VpnConnectionOptions, VpnConnectionType } from './vpn';

const VPC_SUBNET_SYMBOL = Symbol.for('@aws-cdk/aws-ec2.VpcSubnet');

export interface ISubnet extends IResource {
  /**
   * The Availability Zone the subnet is located in
   */
  readonly availabilityZone: string;

  /**
   * The subnetId for this particular subnet
   * @attribute
   */
  readonly subnetId: string;

  /**
   * Dependable that can be depended upon to force internet connectivity established on the VPC
   */
  readonly internetConnectivityEstablished: IDependable;

  /**
   * The route table for this subnet
   */
  readonly routeTable: IRouteTable;
}

/**
 * An absract route table
 */
export interface IRouteTable {
  /**
   * Route table ID
   */
  readonly routeTableId: string;
}

export interface IVpc extends IResource {
  /**
   * Identifier for this VPC
   * @attribute
   */
  readonly vpcId: string;

  /**
   * List of public subnets in this VPC
   */
  readonly publicSubnets: ISubnet[];

  /**
   * List of private subnets in this VPC
   */
  readonly privateSubnets: ISubnet[];

  /**
   * List of isolated subnets in this VPC
   */
  readonly isolatedSubnets: ISubnet[];

  /**
   * AZs for this VPC
   */
  readonly availabilityZones: string[];

  /**
   * Identifier for the VPN gateway
   */
  readonly vpnGatewayId?: string;
  /**
   * Dependable that can be depended upon to force internet connectivity established on the VPC
   */
  readonly internetConnectivityEstablished: IDependable;

  /**
   * Return information on the subnets appropriate for the given selection strategy
   *
   * Requires that at least one subnet is matched, throws a descriptive
   * error message otherwise.
   */
  selectSubnets(selection?: SubnetSelection): SelectedSubnets;

  /**
   * Adds a new VPN connection to this VPC
   */
  addVpnConnection(id: string, options: VpnConnectionOptions): VpnConnection;

  /**
   * Adds a new interface endpoint to this VPC
   */
  addInterfaceEndpoint(id: string, options: InterfaceVpcEndpointOptions): InterfaceVpcEndpoint
}

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
  ISOLATED = 'Isolated',

  /**
   * Subnet that routes to the internet, but not vice versa.
   *
   * Instances in a private subnet can connect to the Internet, but will not
   * allow connections to be initiated from the Internet.
   *
   * Outbound traffic will be routed via a NAT Gateway. Preference being in
   * the same AZ, but if not available will use another AZ (control by
   * specifing `maxGateways` on VpcNetwork). This might be used for
   * experimental cost conscious accounts or accounts where HA outbound
   * traffic is not needed.
   */
  PRIVATE = 'Private',

  /**
   * Subnet connected to the Internet
   *
   * Instances in a Public subnet can connect to the Internet and can be
   * connected to from the Internet as long as they are launched with public
   * IPs (controlled on the AutoScalingGroup or other constructs that launch
   * instances).
   *
   * Public subnets route outbound traffic via an Internet Gateway.
   */
  PUBLIC = 'Public'
}

/**
 * Customize subnets that are selected for placement of ENIs
 *
 * Constructs that allow customization of VPC placement use parameters of this
 * type to provide placement settings.
 *
 * By default, the instances are placed in the private subnets.
 */
export interface SubnetSelection {
  /**
   * Place the instances in the subnets of the given type
   *
   * At most one of `subnetType` and `subnetName` can be supplied.
   *
   * @default SubnetType.Private
   */
  readonly subnetType?: SubnetType;

  /**
   * Place the instances in the subnets with the given name
   *
   * (This is the name supplied in subnetConfiguration).
   *
   * At most one of `subnetType` and `subnetName` can be supplied.
   *
   * @default name
   */
  readonly subnetName?: string;

  /**
   * If true, return at most one subnet per AZ
   *
   * @defautl false
   */
  readonly onePerAz?: boolean;
}

/**
 * Result of selecting a subset of subnets from a VPC
 */
export interface SelectedSubnets {
  /**
   * The subnet IDs
   */
  readonly subnetIds: string[];

  /**
   * The respective AZs of each subnet
   */
  readonly availabilityZones: string[];

  /**
   * Dependency representing internet connectivity for these subnets
   */
  readonly internetConnectivityEstablished: IDependable;

  /**
   * Selected subnet objects
   */
  readonly subnets: ISubnet[];

  /**
   * Whether any of the given subnets are from the VPC's public subnets.
   */
  readonly hasPublic: boolean;
}

/**
 * A new or imported VPC
 */
abstract class VpcBase extends Resource implements IVpc {

  /**
   * Identifier for this VPC
   */
  public abstract readonly vpcId: string;

  /**
   * List of public subnets in this VPC
   */
  public abstract readonly publicSubnets: ISubnet[];

  /**
   * List of private subnets in this VPC
   */
  public abstract readonly privateSubnets: ISubnet[];

  /**
   * List of isolated subnets in this VPC
   */
  public abstract readonly isolatedSubnets: ISubnet[];

  /**
   * AZs for this VPC
   */
  public abstract readonly availabilityZones: string[];

  /**
   * Identifier for the VPN gateway
   */
  public abstract readonly vpnGatewayId?: string;

  /**
   * Dependencies for internet connectivity
   */
  public abstract readonly internetConnectivityEstablished: IDependable;

  /**
   * Dependencies for NAT connectivity
   */
  protected readonly natDependencies = new Array<IConstruct>();

  /**
   * Returns IDs of selected subnets
   */
  public selectSubnets(selection: SubnetSelection = {}): SelectedSubnets {
    const subnets = this.selectSubnetObjects(selection);
    const pubs = new Set(this.publicSubnets);

    return {
      subnetIds: subnets.map(s => s.subnetId),
      availabilityZones: subnets.map(s => s.availabilityZone),
      internetConnectivityEstablished: tap(new CompositeDependable(), d => subnets.forEach(s => d.add(s.internetConnectivityEstablished))),
      subnets,
      hasPublic: subnets.some(s => pubs.has(s))
    };
  }

  /**
   * Adds a new VPN connection to this VPC
   */
  public addVpnConnection(id: string, options: VpnConnectionOptions): VpnConnection {
    return new VpnConnection(this, id, {
      vpc: this,
      ...options
    });
  }

  /**
   * Adds a new interface endpoint to this VPC
   */
  public addInterfaceEndpoint(id: string, options: InterfaceVpcEndpointOptions): InterfaceVpcEndpoint {
    return new InterfaceVpcEndpoint(this, id, {
      vpc: this,
      ...options
    });
  }

  /**
   * Return the subnets appropriate for the placement strategy
   */
  protected selectSubnetObjects(selection: SubnetSelection = {}): ISubnet[] {
    selection = reifySelectionDefaults(selection);
    let subnets: ISubnet[] = [];

    if (selection.subnetName !== undefined) { // Select by name
      const allSubnets =  [...this.publicSubnets, ...this.privateSubnets, ...this.isolatedSubnets];
      subnets = allSubnets.filter(s => subnetName(s) === selection.subnetName);
    } else { // Select by type
      subnets = {
        [SubnetType.ISOLATED]: this.isolatedSubnets,
        [SubnetType.PRIVATE]: this.privateSubnets,
        [SubnetType.PUBLIC]: this.publicSubnets,
      }[selection.subnetType || SubnetType.PRIVATE];

      if (selection.onePerAz && subnets.length > 0) {
        // Restrict to at most one subnet group
        subnets = subnets.filter(s => subnetName(s) === subnetName(subnets[0]));
      }
    }

    if (subnets.length === 0) {
      throw new Error(`There are no ${describeSelection(selection)} in this VPC. Use a different VPC subnet selection.`);
    }

    return subnets;
  }
}

/**
 * Properties that reference an external VpcNetwork
 */
export interface VpcAttributes {
  /**
   * VPC's identifier
   */
  readonly vpcId: string;

  /**
   * List of availability zones for the subnets in this VPC.
   */
  readonly availabilityZones: string[];

  /**
   * List of public subnet IDs
   *
   * Must be undefined or match the availability zones in length and order.
   */
  readonly publicSubnetIds?: string[];

  /**
   * List of names for the public subnets
   *
   * Must be undefined or have a name for every public subnet group.
   */
  readonly publicSubnetNames?: string[];

  /**
   * List of IDs of routing tables for the public subnets.
   *
   * Must be undefined or have a name for every public subnet group.
   */
  readonly publicSubnetRouteTableIds?: string[];

  /**
   * List of private subnet IDs
   *
   * Must be undefined or match the availability zones in length and order.
   */
  readonly privateSubnetIds?: string[];

  /**
   * List of names for the private subnets
   *
   * Must be undefined or have a name for every private subnet group.
   */
  readonly privateSubnetNames?: string[];

  /**
   * List of IDs of routing tables for the private subnets.
   *
   * Must be undefined or have a name for every private subnet group.
   */
  readonly privateSubnetRouteTableIds?: string[];

  /**
   * List of isolated subnet IDs
   *
   * Must be undefined or match the availability zones in length and order.
   */
  readonly isolatedSubnetIds?: string[];

  /**
   * List of names for the isolated subnets
   *
   * Must be undefined or have a name for every isolated subnet group.
   */
  readonly isolatedSubnetNames?: string[];

  /**
   * List of IDs of routing tables for the isolated subnets.
   *
   * Must be undefined or have a name for every isolated subnet group.
   */
  readonly isolatedSubnetRouteTableIds?: string[];

  /**
   * VPN gateway's identifier
   */
  readonly vpnGatewayId?: string;
}

export interface SubnetAttributes {
  /**
   * The Availability Zone the subnet is located in
   */
  readonly availabilityZone: string;

  /**
   * The subnetId for this particular subnet
   */
  readonly subnetId: string;

  /**
   * The ID of the route table for this particular subnet
   */
  readonly routeTableId?: string;
}

/**
 * Name tag constant
 */
const NAME_TAG: string = 'Name';

/**
 * Configuration for Vpc
 */
export interface VpcProps {

  /**
   * The CIDR range to use for the VPC (e.g. '10.0.0.0/16'). Should be a minimum of /28 and maximum size of /16.
   * The range will be split evenly into two subnets per Availability Zone (one public, one private).
   *
   * @default Vpc.DEFAULT_CIDR_RANGE
   */
  readonly cidr?: string;

  /**
   * Indicates whether the instances launched in the VPC get public DNS hostnames.
   * If this attribute is true, instances in the VPC get public DNS hostnames,
   * but only if the enableDnsSupport attribute is also set to true.
   *
   * @default true
   */
  readonly enableDnsHostnames?: boolean;

  /**
   * Indicates whether the DNS resolution is supported for the VPC. If this attribute
   * is false, the Amazon-provided DNS server in the VPC that resolves public DNS hostnames
   * to IP addresses is not enabled. If this attribute is true, queries to the Amazon
   * provided DNS server at the 169.254.169.253 IP address, or the reserved IP address
   * at the base of the VPC IPv4 network range plus two will succeed.
   *
   * @default true
   */
  readonly enableDnsSupport?: boolean;

  /**
   * The default tenancy of instances launched into the VPC.
   * By setting this to dedicated tenancy, instances will be launched on hardware dedicated
   * to a single AWS customer, unless specifically specified at instance launch time.
   * Please note, not all instance types are usable with Dedicated tenancy.
   *
   * @default DefaultInstanceTenancy.Default (shared) tenancy
   */
  readonly defaultInstanceTenancy?: DefaultInstanceTenancy;

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
  readonly maxAzs?: number;

  /**
   * The number of NAT Gateways to create.
   *
   * For example, if set this to 1 and your subnet configuration is for 3 Public subnets then only
   * one of the Public subnets will have a gateway and all Private subnets will route to this NAT Gateway.
   *
   * @default maxAZs
   */
  readonly natGateways?: number;

  /**
   * Configures the subnets which will have NAT Gateways
   *
   * You can pick a specific group of subnets by specifying the group name;
   * the picked subnets must be public subnets.
   *
   * @default - All public subnets.
   */
  readonly natGatewaySubnets?: SubnetSelection;

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
   * @default - The VPC CIDR will be evenly divided between 1 public and 1
   * private subnet per AZ.
   */
  readonly subnetConfiguration?: SubnetConfiguration[];

  /**
   * Indicates whether a VPN gateway should be created and attached to this VPC.
   *
   * @default - true when vpnGatewayAsn or vpnConnections is specified.
   */
  readonly vpnGateway?: boolean;

  /**
   * The private Autonomous System Number (ASN) for the VPN gateway.
   *
   * @default - Amazon default ASN.
   */
  readonly vpnGatewayAsn?: number;

  /**
   * VPN connections to this VPC.
   *
   * @default - No connections.
   */
  readonly vpnConnections?: { [id: string]: VpnConnectionOptions }

  /**
   * Where to propagate VPN routes.
   *
   * @default - On the route tables associated with private subnets.
   */
  readonly vpnRoutePropagation?: SubnetSelection[]

  /**
   * Gateway endpoints to add to this VPC.
   *
   * @default - None.
   */
  readonly gatewayEndpoints?: { [id: string]: GatewayVpcEndpointOptions }
}

/**
 * The default tenancy of instances launched into the VPC.
 */
export enum DefaultInstanceTenancy {
  /**
   * Instances can be launched with any tenancy.
   */
  DEFAULT = 'default',

  /**
   * Any instance launched into the VPC automatically has dedicated tenancy, unless you launch it with the default tenancy.
   */
  DEDICATED = 'dedicated'
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
  readonly cidrMask?: number;

  /**
   * The type of Subnet to configure.
   *
   * The Subnet type will control the ability to route and connect to the
   * Internet.
   */
  readonly subnetType: SubnetType;

  /**
   * The common Logical Name for the `VpcSubnet`
   *
   * This name will be suffixed with an integer correlating to a specific
   * availability zone.
   */
  readonly name: string;

 /**
  * Controls if subnet IP space needs to be reserved.
  *
  * When true, the IP space for the subnet is reserved but no actual
  * resources are provisioned. This space is only dependent on the
  * number of availibility zones and on `cidrMask` - all other subnet
  * properties are ignored.
  *
  * @default false
  */
  readonly reserved?: boolean;
}

/**
 * VpcNetwork deploys an AWS VPC, with public and private subnets per Availability Zone.
 * For example:
 *
 * ```ts
 * import { Vpc } from '@aws-cdk/aws-ec2'
 *
 * const vpc = new Vpc(this, {
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
 * ```
 *
 * @resource AWS::EC2::VPC
 */
export class Vpc extends VpcBase {
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
      subnetType: SubnetType.PUBLIC,
      name: defaultSubnetName(SubnetType.PUBLIC),
    },
    {
      subnetType: SubnetType.PRIVATE,
      name: defaultSubnetName(SubnetType.PRIVATE),
    }
  ];

  /**
   * Import an exported VPC
   */
  public static fromVpcAttributes(scope: Construct, id: string, attrs: VpcAttributes): IVpc {
    return new ImportedVpc(scope, id, attrs);
  }

  /**
   * Import an existing VPC from by querying the AWS environment this stack is deployed to.
   */
  public static fromLookup(scope: Construct, id: string, options: VpcLookupOptions): IVpc {
    const filter: {[key: string]: string} = options.tags || {};

    // We give special treatment to some tags
    if (options.vpcId) { filter['vpc-id'] = options.vpcId; }
    if (options.vpcName) { filter['tag:Name'] = options.vpcName; }
    if (options.isDefault !== undefined) {
      filter.isDefault = options.isDefault ? 'true' : 'false';
    }

    const attributes = ContextProvider.getValue(scope, {
      provider: cxapi.VPC_PROVIDER,
      props: { filter } as cxapi.VpcContextQuery,
      dummyValue: DUMMY_VPC_PROPS
    });

    return this.fromVpcAttributes(scope, id, attributes);
  }

  /**
   * Identifier for this VPC
   */
  public readonly vpcId: string;

  /**
   * @attribute
   */
  public readonly vpcCidrBlock: string;

  /**
   * @attribute
   */
  public readonly vpcDefaultNetworkAcl: string;

  /**
   * @attribute
   */
  public readonly vpcCidrBlockAssociations: string[];

  /**
   * @attribute
   */
  public readonly vpcDefaultSecurityGroup: string;

  /**
   * @attribute
   */
  public readonly vpcIpv6CidrBlocks: string[];

  /**
   * List of public subnets in this VPC
   */
  public readonly publicSubnets: ISubnet[] = [];

  /**
   * List of private subnets in this VPC
   */
  public readonly privateSubnets: ISubnet[] = [];

  /**
   * List of isolated subnets in this VPC
   */
  public readonly isolatedSubnets: ISubnet[] = [];

  /**
   * AZs for this VPC
   */
  public readonly availabilityZones: string[];

  /**
   * Identifier for the VPN gateway
   */
  public readonly vpnGatewayId?: string;

  public readonly internetConnectivityEstablished: IDependable;

  /**
   * The VPC resource
   */
  private readonly resource: CfnVPC;

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

  private readonly _internetConnectivityEstablished = new ConcreteDependable();

  /**
   * VpcNetwork creates a VPC that spans a whole region.
   * It will automatically divide the provided VPC CIDR range, and create public and private subnets per Availability Zone.
   * Network routing for the public subnets will be configured to allow outbound access directly via an Internet Gateway.
   * Network routing for the private subnets will be configured to allow outbound access via a set of resilient NAT Gateways (one per AZ).
   */
  constructor(scope: Construct, id: string, props: VpcProps = {}) {
    super(scope, id);

    const stack = Stack.of(this);

    // Can't have enabledDnsHostnames without enableDnsSupport
    if (props.enableDnsHostnames && !props.enableDnsSupport) {
      throw new Error('To use DNS Hostnames, DNS Support must be enabled, however, it was explicitly disabled.');
    }

    const cidrBlock = ifUndefined(props.cidr, Vpc.DEFAULT_CIDR_RANGE);
    this.networkBuilder = new NetworkBuilder(cidrBlock);

    const enableDnsHostnames = props.enableDnsHostnames == null ? true : props.enableDnsHostnames;
    const enableDnsSupport = props.enableDnsSupport == null ? true : props.enableDnsSupport;
    const instanceTenancy = props.defaultInstanceTenancy || 'default';
    this.internetConnectivityEstablished = this._internetConnectivityEstablished;

    // Define a VPC using the provided CIDR range
    this.resource = new CfnVPC(this, 'Resource', {
      cidrBlock,
      enableDnsHostnames,
      enableDnsSupport,
      instanceTenancy,
    });

    this.vpcDefaultNetworkAcl = this.resource.attrDefaultNetworkAcl;
    this.vpcCidrBlockAssociations = this.resource.attrCidrBlockAssociations;
    this.vpcCidrBlock = this.resource.attrCidrBlock;
    this.vpcDefaultSecurityGroup = this.resource.attrDefaultSecurityGroup;
    this.vpcIpv6CidrBlocks = this.resource.attrIpv6CidrBlocks;

    this.node.applyAspect(new Tag(NAME_TAG, this.node.path));

    this.availabilityZones = stack.availabilityZones;

    const maxAZs = props.maxAzs !== undefined ? props.maxAzs : 3;
    this.availabilityZones = this.availabilityZones.slice(0, maxAZs);

    this.vpcId = this.resource.ref;

    this.subnetConfiguration = ifUndefined(props.subnetConfiguration, Vpc.DEFAULT_SUBNETS);
    // subnetConfiguration and natGateways must be set before calling createSubnets
    this.createSubnets();

    const allowOutbound = this.subnetConfiguration.filter(
      subnet => (subnet.subnetType !== SubnetType.ISOLATED)).length > 0;

    // Create an Internet Gateway and attach it if necessary
    if (allowOutbound) {
      const igw = new CfnInternetGateway(this, 'IGW', {
      });
      this._internetConnectivityEstablished.add(igw);
      const att = new CfnVPCGatewayAttachment(this, 'VPCGW', {
        internetGatewayId: igw.ref,
        vpcId: this.resource.ref
      });

      (this.publicSubnets as PublicSubnet[]).forEach(publicSubnet => {
        publicSubnet.addDefaultInternetRoute(igw.ref, att);
      });

      // if gateways are needed create them
      this.createNatGateways(props.natGateways, props.natGatewaySubnets);

      (this.privateSubnets as PrivateSubnet[]).forEach((privateSubnet, i) => {
        let ngwId = this.natGatewayByAZ[privateSubnet.availabilityZone];
        if (ngwId === undefined) {
          const ngwArray = Array.from(Object.values(this.natGatewayByAZ));
          // round robin the available NatGW since one is not in your AZ
          ngwId = ngwArray[i % ngwArray.length];
        }
        privateSubnet.addDefaultNatRoute(ngwId);
      });
    }

    if ((props.vpnConnections || props.vpnGatewayAsn) && props.vpnGateway === false) {
      throw new Error('Cannot specify `vpnConnections` or `vpnGatewayAsn` when `vpnGateway` is set to false.');
    }

    if (props.vpnGateway || props.vpnConnections || props.vpnGatewayAsn) {
      const vpnGateway = new CfnVPNGateway(this, 'VpnGateway', {
        amazonSideAsn: props.vpnGatewayAsn,
        type: VpnConnectionType.IPSEC_1
      });

      const attachment = new CfnVPCGatewayAttachment(this, 'VPCVPNGW', {
        vpcId: this.vpcId,
        vpnGatewayId: vpnGateway.ref,
      });

      this.vpnGatewayId = vpnGateway.ref;

      // Propagate routes on route tables associated with the right subnets
      const vpnRoutePropagation = props.vpnRoutePropagation || [{ subnetType: SubnetType.PRIVATE }];
      const routeTableIds = allRouteTableIds(...vpnRoutePropagation.map(s => this.selectSubnets(s)));
      const routePropagation = new CfnVPNGatewayRoutePropagation(this, 'RoutePropagation', {
        routeTableIds,
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
  public addGatewayEndpoint(id: string, options: GatewayVpcEndpointOptions): GatewayVpcEndpoint {
    return new GatewayVpcEndpoint(this, id, {
      vpc: this,
      ...options
    });
  }

  /**
   * Adds a new S3 gateway endpoint to this VPC
   */
  public addS3Endpoint(id: string, subnets?: SubnetSelection[]): GatewayVpcEndpoint {
    return new GatewayVpcEndpoint(this, id, {
      service: GatewayVpcEndpointAwsService.S3,
      vpc: this,
      subnets
    });
  }

  /**
   * Adds a new DynamoDB gateway endpoint to this VPC
   */
  public addDynamoDbEndpoint(id: string, subnets?: SubnetSelection[]): GatewayVpcEndpoint {
    return new GatewayVpcEndpoint(this, id, {
      service: GatewayVpcEndpointAwsService.DYNAMODB,
      vpc: this,
      subnets
    });
  }

  private createNatGateways(gateways?: number, placement?: SubnetSelection): void {
    const useNatGateway = this.subnetConfiguration.filter(
      subnet => (subnet.subnetType === SubnetType.PRIVATE)).length > 0;

    const natCount = ifUndefined(gateways,
      useNatGateway ? this.availabilityZones.length : 0);

    let natSubnets: PublicSubnet[];
    if (placement) {
      const subnets = this.selectSubnetObjects(placement);
      for (const sub of subnets) {
        if (this.publicSubnets.indexOf(sub) === -1) {
          throw new Error(`natGatewayPlacement ${placement} contains non public subnet ${sub}`);
        }
      }
      natSubnets = subnets as PublicSubnet[];
    } else {
      natSubnets =  this.publicSubnets as PublicSubnet[];
    }

    natSubnets = natSubnets.slice(0, natCount);
    for (const sub of natSubnets) {
      const gateway = sub.addNatGateway();
      this.natGatewayByAZ[sub.availabilityZone] = gateway.ref;
      this.natDependencies.push(gateway);
    }
  }

  /**
   * createSubnets creates the subnets specified by the subnet configuration
   * array or creates the `DEFAULT_SUBNETS` configuration
   */
  private createSubnets() {
    const remainingSpaceSubnets: SubnetConfiguration[] = [];

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
      if (subnetConfig.reserved === true) {
        // For reserved subnets, just allocate ip space but do not create any resources
        this.networkBuilder.addSubnet(cidrMask);
        return;
      }

      const name = subnetId(subnetConfig.name, index);
      const subnetProps: SubnetProps = {
        availabilityZone: zone,
        vpcId: this.vpcId,
        cidrBlock: this.networkBuilder.addSubnet(cidrMask),
        mapPublicIpOnLaunch: (subnetConfig.subnetType === SubnetType.PUBLIC),
      };

      let subnet: Subnet;
      switch (subnetConfig.subnetType) {
        case SubnetType.PUBLIC:
          const publicSubnet = new PublicSubnet(this, name, subnetProps);
          this.publicSubnets.push(publicSubnet);
          subnet = publicSubnet;
          break;
        case SubnetType.PRIVATE:
          const privateSubnet = new PrivateSubnet(this, name, subnetProps);
          this.privateSubnets.push(privateSubnet);
          subnet = privateSubnet;
          break;
        case SubnetType.ISOLATED:
          const isolatedSubnet = new PrivateSubnet(this, name, subnetProps);
          this.isolatedSubnets.push(isolatedSubnet);
          subnet = isolatedSubnet;
          break;
        default:
          throw new Error(`Unrecognized subnet type: ${subnetConfig.subnetType}`);
      }

      // These values will be used to recover the config upon provider import
      const includeResourceTypes = [CfnSubnet.CFN_RESOURCE_TYPE_NAME];
      subnet.node.applyAspect(new Tag(SUBNETNAME_TAG, subnetConfig.name, {includeResourceTypes}));
      subnet.node.applyAspect(new Tag(SUBNETTYPE_TAG, subnetTypeTagValue(subnetConfig.subnetType), {includeResourceTypes}));
    });
  }
}

const SUBNETTYPE_TAG = 'aws-cdk:subnet-type';
const SUBNETNAME_TAG = 'aws-cdk:subnet-name';

function subnetTypeTagValue(type: SubnetType) {
  switch (type) {
    case SubnetType.PUBLIC: return 'Public';
    case SubnetType.PRIVATE: return 'Private';
    case SubnetType.ISOLATED: return 'Isolated';
  }
}

/**
 * Specify configuration parameters for a VPC subnet
 */
export interface SubnetProps {

  /**
   * The availability zone for the subnet
   */
  readonly availabilityZone: string;

  /**
   * The VPC which this subnet is part of
   */
  readonly vpcId: string;

  /**
   * The CIDR notation for this subnet
   */
  readonly cidrBlock: string;

  /**
   * Controls if a public IP is associated to an instance at launch
   *
   * @default true in Subnet.Public, false in Subnet.Private or Subnet.Isolated.
   */
  readonly mapPublicIpOnLaunch?: boolean;
}

/**
 * Represents a new VPC subnet resource
 *
 * @resource AWS::EC2::Subnet
 */
export class Subnet extends Resource implements ISubnet {

  public static isVpcSubnet(x: any): x is Subnet {
    return VPC_SUBNET_SYMBOL in x;
  }

  public static fromSubnetAttributes(scope: Construct, id: string, attrs: SubnetAttributes): ISubnet {
    return new ImportedSubnet(scope, id, attrs);
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
   * @attribute
   */
  public readonly subnetVpcId: string;

  /**
   * @attribute
   */
  public readonly subnetAvailabilityZone: string;

  /**
   * @attribute
   */
  public readonly subnetIpv6CidrBlocks: string[];

  /**
   * @attribute
   */
  public readonly subnetNetworkAclAssociationId: string;

  /**
   * Parts of this VPC subnet
   */
  public readonly dependencyElements: IDependable[] = [];

  /**
   * The routeTableId attached to this subnet.
   */
  public readonly routeTable: IRouteTable;

  public readonly internetConnectivityEstablished: IDependable;

  private readonly _internetConnectivityEstablished = new ConcreteDependable();

  constructor(scope: Construct, id: string, props: SubnetProps) {
    super(scope, id);

    Object.defineProperty(this, VPC_SUBNET_SYMBOL, { value: true });

    this.node.applyAspect(new Tag(NAME_TAG, this.node.path));

    this.availabilityZone = props.availabilityZone;
    const subnet = new CfnSubnet(this, 'Subnet', {
      vpcId: props.vpcId,
      cidrBlock: props.cidrBlock,
      availabilityZone: props.availabilityZone,
      mapPublicIpOnLaunch: props.mapPublicIpOnLaunch,
    });
    this.subnetId = subnet.ref;
    this.subnetVpcId = subnet.attrVpcId;
    this.subnetAvailabilityZone = subnet.attrAvailabilityZone;
    this.subnetIpv6CidrBlocks = subnet.attrIpv6CidrBlocks;
    this.subnetNetworkAclAssociationId = subnet.attrNetworkAclAssociationId;

    const table = new CfnRouteTable(this, 'RouteTable', {
      vpcId: props.vpcId,
    });
    this.routeTable = { routeTableId: table.ref };

    // Associate the public route table for this subnet, to this subnet
    new CfnSubnetRouteTableAssociation(this, 'RouteTableAssociation', {
      subnetId: this.subnetId,
      routeTableId: table.ref
    });

    this.internetConnectivityEstablished = this._internetConnectivityEstablished;
  }

  /**
   * Create a default route that points to a passed IGW, with a dependency
   * on the IGW's attachment to the VPC.
   *
   * @param gatewayId the logical ID (ref) of the gateway attached to your VPC
   * @param gatewayAttachment the gateway attachment construct to be added as a dependency
   */
  public addDefaultInternetRoute(gatewayId: string, gatewayAttachment: IDependable) {
    const route = new CfnRoute(this, `DefaultRoute`, {
      routeTableId: this.routeTable.routeTableId,
      destinationCidrBlock: '0.0.0.0/0',
      gatewayId
    });
    route.node.addDependency(gatewayAttachment);

    // Since the 'route' depends on the gateway attachment, just
    // depending on the route is enough.
    this._internetConnectivityEstablished.add(route);
  }

  /**
   * Adds an entry to this subnets route table that points to the passed NATGatwayId
   * @param natGatewayId The ID of the NAT gateway
   */
  public addDefaultNatRoute(natGatewayId: string) {
    const route = new CfnRoute(this, `DefaultRoute`, {
      routeTableId: this.routeTable.routeTableId,
      destinationCidrBlock: '0.0.0.0/0',
      natGatewayId
    });
    this._internetConnectivityEstablished.add(route);
  }
}

// tslint:disable-next-line:no-empty-interface
export interface PublicSubnetProps extends SubnetProps {

}

export interface IPublicSubnet extends ISubnet { }
export interface PublicSubnetAttributes extends SubnetAttributes { }

/**
 * Represents a public VPC subnet resource
 */
export class PublicSubnet extends Subnet implements IPublicSubnet {

  public static fromPublicSubnetAttributes(scope: Construct, id: string, attrs: PublicSubnetAttributes): IPublicSubnet {
    return new ImportedSubnet(scope, id, attrs);
  }

  constructor(scope: Construct, id: string, props: PublicSubnetProps) {
    super(scope, id, props);
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
      }).attrAllocationId,
    });
    return ngw;
  }
}

// tslint:disable-next-line:no-empty-interface
export interface PrivateSubnetProps extends SubnetProps {

}

export interface IPrivateSubnet extends ISubnet { }

export interface PrivateSubnetAttributes extends SubnetAttributes { }

/**
 * Represents a private VPC subnet resource
 */
export class PrivateSubnet extends Subnet implements IPrivateSubnet {

  public static fromPrivateSubnetAttributes(scope: Construct, id: string, attrs: PrivateSubnetAttributes): IPrivateSubnet {
    return new ImportedSubnet(scope, id, attrs);
  }

  constructor(scope: Construct, id: string, props: PrivateSubnetProps) {
    super(scope, id, props);
  }
}

function ifUndefined<T>(value: T | undefined, defaultValue: T): T {
  return value !== undefined ? value : defaultValue;
}

class ImportedVpc extends VpcBase {
  public readonly vpcId: string;
  public readonly publicSubnets: ISubnet[];
  public readonly privateSubnets: ISubnet[];
  public readonly isolatedSubnets: ISubnet[];
  public readonly availabilityZones: string[];
  public readonly vpnGatewayId?: string;
  public readonly internetConnectivityEstablished: IDependable = new ConcreteDependable();

  constructor(scope: Construct, id: string, props: VpcAttributes) {
    super(scope, id);

    this.vpcId = props.vpcId;
    this.availabilityZones = props.availabilityZones;
    this.vpnGatewayId = props.vpnGatewayId;

    // tslint:disable:max-line-length
    const pub = new ImportSubnetGroup(props.publicSubnetIds, props.publicSubnetNames, props.publicSubnetRouteTableIds, SubnetType.PUBLIC, this.availabilityZones, 'publicSubnetIds', 'publicSubnetNames', 'publicSubnetRouteTableIds');
    const priv = new ImportSubnetGroup(props.privateSubnetIds, props.privateSubnetNames, props.privateSubnetRouteTableIds, SubnetType.PRIVATE, this.availabilityZones, 'privateSubnetIds', 'privateSubnetNames', 'privateSubnetRouteTableIds');
    const iso = new ImportSubnetGroup(props.isolatedSubnetIds, props.isolatedSubnetNames, props.isolatedSubnetRouteTableIds, SubnetType.ISOLATED, this.availabilityZones, 'isolatedSubnetIds', 'isolatedSubnetNames', 'isolatedSubnetRouteTableIds');
    // tslint:enable:max-line-length

    this.publicSubnets = pub.import(this);
    this.privateSubnets = priv.import(this);
    this.isolatedSubnets = iso.import(this);
  }
}

/**
 * If the placement strategy is completely "default", reify the defaults so
 * consuming code doesn't have to reimplement the same analysis every time.
 *
 * Returns "private subnets" by default.
 */
function reifySelectionDefaults(placement: SubnetSelection): SubnetSelection {
  if (placement.subnetType !== undefined && placement.subnetName !== undefined) {
    throw new Error('Only one of subnetType and subnetName can be supplied');
  }

  if (placement.subnetType === undefined && placement.subnetName === undefined) {
    return { subnetType: SubnetType.PRIVATE, onePerAz: placement.onePerAz };
  }

  return placement;
}

/**
 * Describe the given placement strategy
 */
function describeSelection(placement: SubnetSelection): string {
  if (placement.subnetType !== undefined) {
    return `'${defaultSubnetName(placement.subnetType)}' subnets`;
  }
  if (placement.subnetName !== undefined) {
    return `subnets named '${placement.subnetName}'`;
  }
  return JSON.stringify(placement);
}

class CompositeDependable implements IDependable {
  private readonly dependables = new Array<IDependable>();

  constructor() {
    const self = this;
    DependableTrait.implement(this, {
      get dependencyRoots() {
        const ret = [];
        for (const dep of self.dependables) {
          ret.push(...DependableTrait.get(dep).dependencyRoots);
        }
        return ret;
      }
    });
  }

  /**
   * Add a construct to the dependency roots
   */
  public add(dep: IDependable) {
    this.dependables.push(dep);
  }
}

/**
 * Invoke a function on a value (for its side effect) and return the value
 */
function tap<T>(x: T, fn: (x: T) => void): T {
  fn(x);
  return x;
}

class ImportedSubnet extends Resource implements ISubnet, IPublicSubnet, IPrivateSubnet {
  public readonly internetConnectivityEstablished: IDependable = new ConcreteDependable();
  public readonly availabilityZone: string;
  public readonly subnetId: string;
  public readonly routeTable: IRouteTable;

  constructor(scope: Construct, id: string, attrs: SubnetAttributes) {
    super(scope, id);

    if (!attrs.routeTableId) {
      const ref = Token.isUnresolved(attrs.subnetId)
        ? `at '${scope.node.path}/${id}'`
        : `'${attrs.subnetId}'`;
      // tslint:disable-next-line: max-line-length
      scope.node.addWarning(`No routeTableId was provided to the subnet ${ref}. Attempting to read it's .routeTable.routeTableId will return null/undefined. (More info: https://github.com/aws/aws-cdk/pull/3171)`);
    }

    this.availabilityZone = attrs.availabilityZone;
    this.subnetId = attrs.subnetId;
    this.routeTable = {
      // Forcing routeTableId to pretend non-null to maintain backwards-compatibility. See https://github.com/aws/aws-cdk/pull/3171
      routeTableId: attrs.routeTableId!
    };
  }
}

/**
 * There are returned when the provider has not supplied props yet
 *
 * It's only used for testing and on the first run-through.
 */
const DUMMY_VPC_PROPS: cxapi.VpcContextResponse = {
  availabilityZones: ['dummy-1a', 'dummy-1b'],
  vpcId: 'vpc-12345',
  publicSubnetIds: ['s-12345', 's-67890'],
  publicSubnetRouteTableIds: ['rtb-12345s', 'rtb-67890s'],
  privateSubnetIds: ['p-12345', 'p-67890'],
  privateSubnetRouteTableIds: ['rtb-12345p', 'rtb-57890p'],
};
