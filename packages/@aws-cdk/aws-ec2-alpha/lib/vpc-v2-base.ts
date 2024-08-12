import { Resource, Annotations } from 'aws-cdk-lib';
import { IVpc, ISubnet, SubnetSelection, SelectedSubnets, EnableVpnGatewayOptions, VpnGateway, VpnConnectionType, CfnVPCGatewayAttachment, CfnVPNGatewayRoutePropagation, VpnConnectionOptions, VpnConnection, ClientVpnEndpointOptions, ClientVpnEndpoint, InterfaceVpcEndpointOptions, InterfaceVpcEndpoint, GatewayVpcEndpointOptions, GatewayVpcEndpoint, FlowLogOptions, FlowLog, FlowLogResourceType, SubnetType, SubnetFilter, CfnVPCCidrBlock } from 'aws-cdk-lib/aws-ec2';
import { allRouteTableIds, flatten, subnetGroupNameFromConstructId } from './util';
import { IDependable, Dependable, IConstruct } from 'constructs';

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
  readonly secondaryCidrBlock: CfnVPCCidrBlock[];

  /**
   * The primary IPv4 CIDR block associated with the VPC.
   * Needed in order to validate the vpc range of subnet
   * current prop vpcCidrBlock refers to the token value
   * For more information, see the {@link https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html#vpc-sizing-ipv4}.
   */
  readonly ipv4CidrBlock: string;

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
   * Secondary IPs for the VPC, can be multiple Ipv4 or Ipv6
   * Ipv4 should be within RFC#1918 range
   */
  public abstract readonly secondaryCidrBlock: CfnVPCCidrBlock[];

  /**
   * The primary IPv4 CIDR block associated with the VPC.
   * Needed in order to validate the vpc range of subnet
   * current prop vpcCidrBlock refers to the token value
   * For more information, see the {@link https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html#vpc-sizing-ipv4}.
   */
  public abstract readonly ipv4CidrBlock: string;

  /**
  * If this is set to true, don't error out on trying to select subnets
  */
  protected incompleteSubnetDefinition: boolean = false;

  /**
   * Mutable private field for the vpnGatewayId
   *
   * @internal
   */
  protected _vpnGatewayId?: string;

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
  * Adds a new flow log to this VPC
  */
  public addFlowLog(id: string, options?: FlowLogOptions): FlowLog {
    return new FlowLog(this, id, {
      resourceType: FlowLogResourceType.fromVpc(this),
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