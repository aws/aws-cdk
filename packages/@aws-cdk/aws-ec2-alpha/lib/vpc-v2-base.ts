import { Aws, Resource, Annotations } from 'aws-cdk-lib';
import { IVpc, ISubnet, SubnetSelection, SelectedSubnets, EnableVpnGatewayOptions, VpnGateway, VpnConnectionType, CfnVPCGatewayAttachment, CfnVPNGatewayRoutePropagation, VpnConnectionOptions, VpnConnection, ClientVpnEndpointOptions, ClientVpnEndpoint, InterfaceVpcEndpointOptions, InterfaceVpcEndpoint, GatewayVpcEndpointOptions, GatewayVpcEndpoint, FlowLogOptions, FlowLog, FlowLogResourceType, SubnetType, SubnetFilter } from 'aws-cdk-lib/aws-ec2';
import { allRouteTableIds, flatten, subnetGroupNameFromConstructId } from './util';
import { IDependable, Dependable, IConstruct, DependencyGroup } from 'constructs';
import { EgressOnlyInternetGateway, InternetGateway, NatConnectivityType, NatGateway, NatGatewayOptions, Route, VPCPeeringConnection, VPCPeeringConnectionOptions, VPNGatewayV2 } from './route';
import { ISubnetV2 } from './subnet-v2';
import { AccountPrincipal, Effect, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { IVPCCidrBlock } from './vpc-v2';

/**
 * Options to define EgressOnlyInternetGateway for VPC
 */
export interface EgressOnlyInternetGatewayOptions {
  /**
   * List of subnets where route to EGW will be added
   *
   * @default - no route created
   */
  readonly subnets?: SubnetSelection[];

  /**
   * Destination Ipv6 address for EGW route
   *
   * @default - '::/0' all Ipv6 traffic
   */
  readonly destination?: string;
}

/**
 * Options to define InternetGateway for VPC
 */
export interface InternetGatewayOptions{

  /**
   * Destination Ipv6 address for EGW route
   *
   * @default - '0.0.0.0' all Ipv4 traffic
   */
  readonly ipv4Destination?: string;

  /**
   * Destination Ipv6 address for EGW route
   *
   * @default - '::/0' all Ipv6 traffic
   */
  readonly ipv6Destination?: string;
}

/**
 * Options to define VPNGatewayV2 for VPC
 */
export interface VPNGatewayV2Options {
  /**
   * The type of VPN connection the virtual private gateway supports.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpngateway.html#cfn-ec2-vpngateway-type
   */
  readonly type: VpnConnectionType;

  /**
   * The private Autonomous System Number (ASN) for the Amazon side of a BGP session.
   *
   * @default - no ASN set for BGP session
   */
  readonly amazonSideAsn?: number;

  /**
   * The resource name of the VPN gateway.
   *
   * @default - resource provisioned without any name
   */
  readonly vpnGatewayName?: string;

  /**
   * Subnets where the route propagation should be added.
   *
   * @default - no propogation for routes
   */
  readonly vpnRoutePropagation?: SubnetSelection[];
}

/**
 * Placeholder to see what extra props we might need,
 * will be added to original IVPC
 */
export interface IVpcV2 extends IVpc {
  /**
   * The secondary CIDR blocks associated with the VPC.
   *
   * For more information, see the {@link https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html#vpc-resize}.
   */
  readonly secondaryCidrBlock?: IVPCCidrBlock[];

  /**
   * The primary IPv4 CIDR block associated with the VPC.
   * Needed in order to validate the vpc range of subnet
   * current prop vpcCidrBlock refers to the token value
   * For more information, see the {@link https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html#vpc-sizing-ipv4}.
   */
  readonly ipv4CidrBlock: string;

  /**
   * Optional to override inferred region
   *
   * @default - current stack's environment region
   */
  readonly region: string;

  /**
   * The ID of the AWS account that owns the VPC
   *
   * @default - the account id of the parent stack
   */
  readonly ownerAccountId: string;

  /**
   * IPv4 CIDR provisioned under pool
   * Required to check for overlapping CIDRs after provisioning
   * is complete under IPAM pool
   */
  readonly ipv4IpamProvisionedCidrs?: string[];

  /**
   * Add an Egress only Internet Gateway to current VPC.
   * Can only be used for ipv6 enabled VPCs.
   * For more information, see the {@link https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway-basics.html}.
   */
  addEgressOnlyInternetGateway(options?: EgressOnlyInternetGatewayOptions): void;

  /**
   * Adds an Internet Gateway to current VPC.
   * For more information, see the {@link https://docs.aws.amazon.com/vpc/latest/userguide/vpc-igw-internet-access.html}.
   *
   * @default - defines route for all ipv4('0.0.0.0') and ipv6 addresses('::/0')
   */
  addInternetGateway(options?: InternetGatewayOptions): void;

  /**
   * Adds VPN Gateway to VPC and set route propogation.
   * For more information, see the {@link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpngateway.html}.
   *
   * @default - no route propogation
   */
  enableVpnGatewayV2(options: VPNGatewayV2Options): VPNGatewayV2;

  /**
   * Adds a new NAT Gateway to VPC
   * A NAT gateway is a Network Address Translation (NAT) service. NAT Gateway Connectivity can be of type `Public` or `Private`.
   * For more information, see the {@link https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html}.
   *
   * @default ConnectivityType.Public
   */
  addNatGateway(options: NatGatewayOptions): NatGateway;

  /**
   * Adds a new role to acceptor VPC account
   * A cross account role is required for the VPC to peer with another account.
   * For more information, see the {@link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/peer-with-vpc-in-another-account.html}.
   */
  createAcceptorVpcRole(requestorAccountId: string): Role;

  /**
   * Creates a new peering connection
   * A peering connection is a private virtual network established between two VPCs.
   * For more information, see the {@link https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html}.
   */
  createPeeringConnection(id: string, options: VPCPeeringConnectionOptions): VPCPeeringConnection;
}

/**
 * Base class for creating a VPC (Virtual Private Cloud) in AWS.
 *
 * For more information, see the {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Vpc.html|AWS CDK Documentation on VPCs}.
 */
export abstract class VpcV2Base extends Resource implements IVpcV2 {

  /**
  * Identifier for this VPC
  */
  public abstract readonly vpcId: string;

  /**
  * Arn of this VPC
  */
  public abstract readonly vpcArn: string;

  /**
  * CIDR range for this VPC
  */
  public abstract readonly vpcCidrBlock: string;

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
  public abstract readonly isolatedSubnets: ISubnet[];

  /**
  * AZs for this VPC
  */
  public readonly availabilityZones: string[] = [];

  /**
  * Dependable that can be depended upon to force internet connectivity established on the VPC
  */
  public abstract readonly internetConnectivityEstablished: IDependable;

  /**
   * Dependable that can be depended upon to force internet connectivity established on the VPC
   * Add igw to this if its a public subnet
   * @internal
   */
  protected readonly _internetConnectivityEstablished = new DependencyGroup();

  /**
   * Secondary IPs for the VPC, can be multiple Ipv4 or Ipv6
   * Ipv4 should be within RFC#1918 range
   */
  public abstract readonly secondaryCidrBlock?: IVPCCidrBlock[];

  /**
   * The primary IPv4 CIDR block associated with the VPC.
   * Needed in order to validate the vpc range of subnet
   * current prop vpcCidrBlock refers to the token value
   * For more information, see the {@link https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html#vpc-sizing-ipv4}.
   */
  public abstract readonly ipv4CidrBlock: string;

  /**
  * Region for this VPC
  */
  public abstract readonly region: string;

  /**
  * Identifier of the owner for this VPC
  */
  public abstract readonly ownerAccountId: string;

  /**
   * IPv4 CIDR provisioned under pool
   * Required to check for overlapping CIDRs after provisioning
   * is complete under IPAM pool
   */
  public abstract readonly ipv4IpamProvisionedCidrs?: string[];

  /**
  * If this is set to true, don't error out on trying to select subnets
  */
  protected incompleteSubnetDefinition: boolean = false;

  /**
   * Mutable private field for the vpnGatewayId
   * @internal
   */
  protected _vpnGatewayId?: string;

  /**
   * Mutable private field for the internetGatewayId
   * @internal
   */
  protected _internetGatewayId = '';

  /**
  * Return information on the subnets appropriate for the given selection strategy
  *
  * Requires that at least one subnet is matched, throws a descriptive
  * error message otherwise.
  */
  public selectSubnets(selection: SubnetSelection = {}): SelectedSubnets {
    const subnets = this.selectSubnetObjects(selection);
    const pubs = new Set(this.publicSubnets);

    return {
      subnetIds: subnets.map(s => s.subnetId),
      get availabilityZones(): string[] { return subnets.map(s => s.availabilityZone); },
      internetConnectivityEstablished: tap(new CompositeDependable(), d => subnets.forEach(s => d.add(s.internetConnectivityEstablished))),
      subnets,
      hasPublic: subnets.some(s => pubs.has(s)),
      isPendingLookup: this.incompleteSubnetDefinition,
    };
  }

  /**
  * Adds a VPN Gateway to this VPC
  * @deprecated use enableVpnGatewayV2 for compatibility with VPCV2.Route
  */
  public enableVpnGateway(options: EnableVpnGatewayOptions): void {
    if (this.vpnGatewayId) {
      throw new Error('The VPN Gateway has already been enabled.');
    }

    const vpnGateway = new VpnGateway(this, 'VpnGateway', {
      amazonSideAsn: options.amazonSideAsn,
      type: VpnConnectionType.IPSEC_1,
    });

    this._vpnGatewayId = vpnGateway.gatewayId;

    const attachment = new CfnVPCGatewayAttachment(this, 'VPCVPNGW', {
      vpcId: this.vpcId,
      vpnGatewayId: this._vpnGatewayId,
    });

    // Propagate routes on route tables associated with the right subnets
    const vpnRoutePropagation = options.vpnRoutePropagation ?? [{}];
    const routeTableIds = allRouteTableIds(flatten(vpnRoutePropagation.map(s => this.selectSubnets(s).subnets)));

    if (routeTableIds.length === 0) {
      Annotations.of(this).addError(`enableVpnGateway: no subnets matching selection: '${JSON.stringify(vpnRoutePropagation)}'. Select other subnets to add routes to.`);
    }

    const routePropagation = new CfnVPNGatewayRoutePropagation(this, 'RoutePropagation', {
      routeTableIds,
      vpnGatewayId: this._vpnGatewayId,
    });
      // The AWS::EC2::VPNGatewayRoutePropagation resource cannot use the VPN gateway
      // until it has successfully attached to the VPC.
      // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpn-gatewayrouteprop.html
    routePropagation.node.addDependency(attachment);
  }

  /**
   * Adds VPNGAtewayV2 to this VPC
   */
  public enableVpnGatewayV2(options: VPNGatewayV2Options): VPNGatewayV2 {
    if (this.vpnGatewayId) {
      throw new Error('The VPN Gateway has already been enabled.');
    }

    const vpnGateway = new VPNGatewayV2(this, 'VpnGateway', {
      vpc: this,
      ...options,
    });

    this._internetConnectivityEstablished.add(vpnGateway);
    this._vpnGatewayId = vpnGateway.routerTargetId;

    return vpnGateway;
  }

  /**
  * Adds a new VPN connection to this VPC
  */
  public addVpnConnection(id: string, options: VpnConnectionOptions): VpnConnection {
    return new VpnConnection(this, id, {
      vpc: this,
      ...options,
    });
  }

  /**
  * Adds a new client VPN endpoint to this VPC
  */
  public addClientVpnEndpoint(id: string, options: ClientVpnEndpointOptions): ClientVpnEndpoint {
    return new ClientVpnEndpoint(this, id, {
      ...options,
      vpc: this,
    });
  }

  /**
  * Adds a new interface endpoint to this VPC
  */
  public addInterfaceEndpoint(id: string, options: InterfaceVpcEndpointOptions): InterfaceVpcEndpoint {
    return new InterfaceVpcEndpoint(this, id, {
      vpc: this,
      ...options,
    });
  }

  /**
  * Adds a new gateway endpoint to this VPC
  */
  public addGatewayEndpoint(id: string, options: GatewayVpcEndpointOptions): GatewayVpcEndpoint {
    return new GatewayVpcEndpoint(this, id, {
      vpc: this,
      ...options,
    });
  }

  /**
   * Adds a new Egress Only Internet Gateway to this VPC and defines a new route
   * to the route table of given subnets.
   *
   * @default - in case of no input subnets, no route is created
   */
  public addEgressOnlyInternetGateway(options?: EgressOnlyInternetGatewayOptions): void {
    const egw = new EgressOnlyInternetGateway(this, 'EgressOnlyGW', {
      vpc: this,
    });

    let useIpv6;
    if (this.secondaryCidrBlock) {
      useIpv6 = (this.secondaryCidrBlock.some((secondaryAddress) => secondaryAddress.amazonProvidedIpv6CidrBlock === true ||
    secondaryAddress.ipv6IpamPoolId != undefined));
    }

    if (!useIpv6) {
      throw new Error('Egress only IGW can only be added to Ipv6 enabled VPC');
    };

    if (options?.subnets) {
      const subnets = flatten(options.subnets.map(s => this.selectSubnets(s).subnets));
      subnets.forEach((subnet) => {
        this.createEgressRoute(subnet, egw, options.destination);
      });
    }
  }

  /**
   * Creates a route for EGW with destination set to outbound IPv6('::/0') or custom ipv6 address.
   * @internal
   */
  private createEgressRoute(subnet: ISubnetV2, egw: EgressOnlyInternetGateway, destination?: string): void {
    const destinationIpv6 = destination ?? '::/0';
    new Route(this, `${subnet.node.id}-EgressRoute`, {
      routeTable: subnet.routeTable,
      destination: destinationIpv6, // IPv6 default route
      target: { gateway: egw },
    });
  }

  /**
   * Adds a new Internet Gateway to this VPC
   *
   * @default - creates a new route for public subnets(with all outbound access) to the Internet Gateway.
   */
  public addInternetGateway(options?: InternetGatewayOptions): void {
    if (this._internetGatewayId) {
      throw new Error('The Internet Gateway has already been enabled.');
    }

    const igw = new InternetGateway(this, 'InternetGateway', {
      vpc: this,
    });

    this._internetConnectivityEstablished.add(igw);
    this._internetGatewayId = igw.routerTargetId;

    // If there are no public subnets defined, no default route will be added
    if (this.publicSubnets) {
      this.publicSubnets.forEach( (s) => this.addDefaultInternetRoute(s, igw, options));
    }
  }

  /**
   * Adds default route for the internet gateway
   * @internal
   */
  private addDefaultInternetRoute(subnet: ISubnetV2, igw: InternetGateway, options?: InternetGatewayOptions): void {

    if (subnet.subnetType !== SubnetType.PUBLIC) {
      throw new Error('No public subnets defined to add route for internet gateway');
    }

    // Add default route to IGW for IPv6
    if (subnet.ipv6CidrBlock) {
      new Route(this, `${subnet.node.id}-DefaultIPv6Route`, {
        routeTable: subnet.routeTable,
        destination: options?.ipv6Destination ?? '::/0',
        target: { gateway: igw },
      });
    }
    //Add default route to IGW for IPv4
    new Route(this, `${subnet.node.id}-DefaultRoute`, {
      routeTable: subnet.routeTable,
      destination: options?.ipv4Destination ?? '0.0.0.0/0',
      target: { gateway: igw },
    });
  }

  /**
   * Adds a new NAT Gateway to the given subnet of this VPC
   * of given subnets.
   */
  public addNatGateway(options: NatGatewayOptions): NatGateway {
    if (options.connectivityType === NatConnectivityType.PUBLIC && !this._internetGatewayId) {
      throw new Error('Cannot add a Public NAT Gateway without an Internet Gateway enabled on VPC');
    }
    return new NatGateway(this, 'NATGateway', {
      vpc: this,
      ...options,
    });
  }

  /**
  * Adds a new flow log to this VPC
  */
  public addFlowLog(id: string, options?: FlowLogOptions): FlowLog {
    return new FlowLog(this, id, {
      resourceType: FlowLogResourceType.fromVpc(this),
      ...options,
    });
  }

  /**
  * Creates peering connection role for acceptor VPC
  */
  public createAcceptorVpcRole(requestorAccountId: string): Role {
    const peeringRole = new Role(this, 'VpcPeeringRole', {
      assumedBy: new AccountPrincipal(requestorAccountId),
      roleName: 'VpcPeeringRole',
      description: 'Restrictive role for VPC peering',
    });

    peeringRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['ec2:AcceptVpcPeeringConnection'],
      resources: [`arn:${Aws.PARTITION}:ec2:${this.region}:${this.ownerAccountId}:vpc/${this.vpcId}`],
    }));

    peeringRole.addToPolicy(new PolicyStatement({
      actions: ['ec2:AcceptVpcPeeringConnection'],
      effect: Effect.ALLOW,
      resources: [`arn:${Aws.PARTITION}:ec2:${this.region}:${this.ownerAccountId}:vpc-peering-connection/*`],
      conditions: {
        StringEquals: {
          'ec2:AccepterVpc': `arn:${Aws.PARTITION}:ec2:${this.region}:${this.ownerAccountId}:vpc/${this.vpcId}`,
        },
      },
    }));

    return peeringRole;
  }

  /**
  * Creates a peering connection
  */
  public createPeeringConnection(id: string, options: VPCPeeringConnectionOptions): VPCPeeringConnection {
    return new VPCPeeringConnection(this, id, {
      requestorVpc: this,
      ...options,
    });
  }

  /**
  * Returns the id of the VPN Gateway (if enabled)
  */
  public get vpnGatewayId(): string | undefined {
    return this._vpnGatewayId;
  }

  /**
  * Returns the id of the Internet Gateway (if enabled)
  */
  public get internetGatewayId(): string | undefined {
    return this._internetGatewayId;
  }

  /**
  * Return the subnets appropriate for the placement strategy
  */
  protected selectSubnetObjects(selection: SubnetSelection = {}): ISubnet[] {
    selection = this.reifySelectionDefaults(selection);

    if (selection.subnets !== undefined) {
      return selection.subnets;
    }

    let subnets;

    if (selection.subnetGroupName !== undefined) { // Select by name
      subnets = this.selectSubnetObjectsByName(selection.subnetGroupName);

    } else { // Or specify by type
      const type = selection.subnetType || SubnetType.PRIVATE_WITH_EGRESS;
      subnets = this.selectSubnetObjectsByType(type);
    }

    // Apply all the filters
    subnets = this.applySubnetFilters(subnets, selection.subnetFilters ?? []);

    return subnets;
  }

  private applySubnetFilters(subnets: ISubnet[], filters: SubnetFilter[]): ISubnet[] {
    let filtered = subnets;
    // Apply each filter in sequence
    for (const filter of filters) {
      filtered = filter.selectSubnets(filtered);
    }
    return filtered;
  }

  private selectSubnetObjectsByName(groupName: string) {
    const allSubnets = [...this.publicSubnets, ...this.privateSubnets, ...this.isolatedSubnets];
    const subnets = allSubnets.filter(s => subnetGroupNameFromConstructId(s) === groupName);

    if (subnets.length === 0 && !this.incompleteSubnetDefinition) {
      const names = Array.from(new Set(allSubnets.map(subnetGroupNameFromConstructId)));
      throw new Error(`There are no subnet groups with name '${groupName}' in this VPC. Available names: ${names}`);
    }

    return subnets;
  }

  private selectSubnetObjectsByType(subnetType: SubnetType) {
    const allSubnets = {
      [SubnetType.PRIVATE_ISOLATED]: this.isolatedSubnets,
      [SubnetType.ISOLATED]: this.isolatedSubnets,
      [SubnetType.PRIVATE_WITH_NAT]: this.privateSubnets,
      [SubnetType.PRIVATE_WITH_EGRESS]: this.privateSubnets,
      [SubnetType.PRIVATE]: this.privateSubnets,
      [SubnetType.PUBLIC]: this.publicSubnets,
    };

    const subnets = allSubnets[subnetType];

    // Force merge conflict here with https://github.com/aws/aws-cdk/pull/4089
    // see ImportedVpc

    if (subnets.length === 0 && !this.incompleteSubnetDefinition) {
      const availableTypes = Object.entries(allSubnets).filter(([_, subs]) => subs.length > 0).map(([typeName, _]) => typeName);
      throw new Error(`There are no '${subnetType}' subnet groups in this VPC. Available types: ${availableTypes}`);
    }

    return subnets;
  }

  /**
  * Validate the fields in a SubnetSelection object, and reify defaults if necessary
  *
  * In case of default selection, select the first type of PRIVATE, ISOLATED,
  * PUBLIC (in that order) that has any subnets.
  */
  private reifySelectionDefaults(placement: SubnetSelection): SubnetSelection {

    // TODO: throw error as new VpcV2 cannot support subnetName or subnetGroupName anymore
    if (placement.subnetName !== undefined) {
      if (placement.subnetGroupName !== undefined) {
        throw new Error('Please use only \'subnetGroupName\' (\'subnetName\' is deprecated and has the same behavior)');
      } else {
        Annotations.of(this).addWarningV2('@aws-cdk/aws-ec2:subnetNameDeprecated', 'Usage of \'subnetName\' in SubnetSelection is deprecated, use \'subnetGroupName\' instead');
      }
      placement = { ...placement, subnetGroupName: placement.subnetName };
    }

    const exclusiveSelections: Array<keyof SubnetSelection> = ['subnets', 'subnetType', 'subnetGroupName'];
    const providedSelections = exclusiveSelections.filter(key => placement[key] !== undefined);
    if (providedSelections.length > 1) {
      throw new Error(`Only one of '${providedSelections}' can be supplied to subnet selection.`);
    }

    if (placement.subnetType === undefined && placement.subnetGroupName === undefined && placement.subnets === undefined) {
      // Return default subnet type based on subnets that actually exist
      let subnetType = this.privateSubnets.length
        ? SubnetType.PRIVATE_WITH_EGRESS : this.isolatedSubnets.length ? SubnetType.PRIVATE_ISOLATED : SubnetType.PUBLIC;
      placement = { ...placement, subnetType: subnetType };
    }

    // Establish which subnet filters are going to be used
    let subnetFilters = placement.subnetFilters ?? [];

    // Backwards compatibility with existing `availabilityZones` and `onePerAz` functionality
    if (placement.availabilityZones !== undefined) { // Filter by AZs, if specified
      subnetFilters.push(SubnetFilter.availabilityZones(placement.availabilityZones));
    }
    if (!!placement.onePerAz) { // Ensure one per AZ if specified
      subnetFilters.push(SubnetFilter.onePerAz());
    }

    // Overwrite the provided placement filters and remove the availabilityZones and onePerAz properties
    placement = { ...placement, subnetFilters: subnetFilters, availabilityZones: undefined, onePerAz: undefined };
    const { availabilityZones, onePerAz, ...rest } = placement;

    return rest;
  }

}

class CompositeDependable implements IDependable {
  private readonly dependables = new Array<IDependable>();

  constructor() {
    const self = this;
    Dependable.implement(this, {
      get dependencyRoots() {
        const ret = new Array<IConstruct>();
        for (const dep of self.dependables) {
          ret.push(...Dependable.of(dep).dependencyRoots);
        }
        return ret;
      },
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
