import { Construct, IConstruct, IDependable } from "@aws-cdk/cdk";
import { DEFAULT_SUBNET_NAME, subnetName } from './util';
import { InterfaceVpcEndpoint, InterfaceVpcEndpointOptions } from './vpc-endpoint';
import { VpnConnection, VpnConnectionOptions } from './vpn';

export interface IVpcSubnet extends IConstruct {
  /**
   * The Availability Zone the subnet is located in
   */
  readonly availabilityZone: string;

  /**
   * The subnetId for this particular subnet
   */
  readonly subnetId: string;

  /**
   * Dependable that can be depended upon to force internet connectivity established on the VPC
   */
  readonly internetConnectivityEstablished: IDependable;

  /**
   * Exports this subnet to another stack.
   */
  export(): VpcSubnetImportProps;
}

export interface IVpcNetwork extends IConstruct {
  /**
   * Identifier for this VPC
   */
  readonly vpcId: string;

  /**
   * List of public subnets in this VPC
   */
  readonly publicSubnets: IVpcSubnet[];

  /**
   * List of private subnets in this VPC
   */
  readonly privateSubnets: IVpcSubnet[];

  /**
   * List of isolated subnets in this VPC
   */
  readonly isolatedSubnets: IVpcSubnet[];

  /**
   * AZs for this VPC
   */
  readonly availabilityZones: string[];

  /**
   * Region where this VPC is located
   */
  readonly vpcRegion: string;

  /**
   * Identifier for the VPN gateway
   */
  readonly vpnGatewayId?: string;

  /**
   * Return IDs of the subnets appropriate for the given selection strategy
   *
   * Requires that at least once subnet is matched, throws a descriptive
   * error message otherwise.
   *
   * Prefer to use this method over {@link subnets} if you need to pass subnet
   * IDs to a CloudFormation Resource.
   */
  subnetIds(selection?: SubnetSelection): string[];

  /**
   * Return the subnets appropriate for the placement strategy
   */
  subnets(selection?: SubnetSelection): IVpcSubnet[];

  /**
   * Return a dependable object representing internet connectivity for the given subnets
   */
  subnetInternetDependencies(selection?: SubnetSelection): IDependable;

  /**
   * Return whether all of the given subnets are from the VPC's public subnets.
   */
  isPublicSubnets(subnetIds: string[]): boolean;

  /**
   * Adds a new VPN connection to this VPC
   */
  addVpnConnection(id: string, options: VpnConnectionOptions): VpnConnection;

  /**
   * Adds a new interface endpoint to this VPC
   */
  addInterfaceEndpoint(id: string, options: InterfaceVpcEndpointOptions): InterfaceVpcEndpoint

  /**
   * Exports this VPC so it can be consumed by another stack.
   */
  export(): VpcNetworkImportProps;
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
  Isolated = 1,

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
  Private = 2,

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
  Public = 3
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
}

/**
 * A new or imported VPC
 */
export abstract class VpcNetworkBase extends Construct implements IVpcNetwork {

  /**
   * Identifier for this VPC
   */
  public abstract readonly vpcId: string;

  /**
   * List of public subnets in this VPC
   */
  public abstract readonly publicSubnets: IVpcSubnet[];

  /**
   * List of private subnets in this VPC
   */
  public abstract readonly privateSubnets: IVpcSubnet[];

  /**
   * List of isolated subnets in this VPC
   */
  public abstract readonly isolatedSubnets: IVpcSubnet[];

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
  public readonly internetDependencies = new Array<IConstruct>();

  /**
   * Dependencies for NAT connectivity
   */
  public readonly natDependencies = new Array<IConstruct>();

  /**
   * Returns IDs of selected subnets
   */
  public subnetIds(selection: SubnetSelection = {}): string[] {
    selection = reifySelectionDefaults(selection);

    const nets = this.subnets(selection);
    if (nets.length === 0) {
      throw new Error(`There are no ${describeSelection(selection)} in this VPC. Use a different VPC subnet selection.`);
    }

    return nets.map(n => n.subnetId);
  }

  /**
   * Return a dependable object representing internet connectivity for the given subnets
   */
  public subnetInternetDependencies(selection: SubnetSelection = {}): IDependable {
    selection = reifySelectionDefaults(selection);

    const ret = new CompositeDependable();
    for (const subnet of this.subnets(selection)) {
      ret.add(subnet.internetConnectivityEstablished);
    }
    return ret;
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
   * Export this VPC from the stack
   */
  public abstract export(): VpcNetworkImportProps;

  /**
   * Return whether all of the given subnets are from the VPC's public subnets.
   */
  public isPublicSubnets(subnetIds: string[]): boolean {
    const pubIds = new Set(this.publicSubnets.map(n => n.subnetId));
    return subnetIds.every(pubIds.has.bind(pubIds));
  }

  /**
   * The region where this VPC is defined
   */
  public get vpcRegion(): string {
    return this.node.stack.region;
  }

  /**
   * Return the subnets appropriate for the placement strategy
   */
  public subnets(selection: SubnetSelection = {}): IVpcSubnet[] {
    selection = reifySelectionDefaults(selection);

    // Select by name
    if (selection.subnetName !== undefined) {
      const allSubnets = this.privateSubnets.concat(this.publicSubnets).concat(this.isolatedSubnets);
      const selectedSubnets = allSubnets.filter(s => subnetName(s) === selection.subnetName);
      if (selectedSubnets.length === 0) {
        throw new Error(`No subnets with name: ${selection.subnetName}`);
      }
      return selectedSubnets;
    }

    // Select by type
    if (selection.subnetType === undefined) { return this.privateSubnets; }

    return {
      [SubnetType.Isolated]: this.isolatedSubnets,
      [SubnetType.Private]: this.privateSubnets,
      [SubnetType.Public]: this.publicSubnets,
    }[selection.subnetType];
  }
}

/**
 * Properties that reference an external VpcNetwork
 */
export interface VpcNetworkImportProps {
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
   * VPN gateway's identifier
   */
  readonly vpnGatewayId?: string;
}

export interface VpcSubnetImportProps {
  /**
   * The Availability Zone the subnet is located in
   */
  readonly availabilityZone: string;

  /**
   * The subnetId for this particular subnet
   */
  readonly subnetId: string;
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
      return { subnetType: SubnetType.Private };
    }

    return placement;
}

/**
 * Describe the given placement strategy
 */
function describeSelection(placement: SubnetSelection): string {
  if (placement.subnetType !== undefined) {
    return `'${DEFAULT_SUBNET_NAME[placement.subnetType]}' subnets`;
  }
  if (placement.subnetName !== undefined) {
    return `subnets named '${placement.subnetName}'`;
  }
  return JSON.stringify(placement);
}

class CompositeDependable implements IDependable {
  private readonly dependables = new Array<IDependable>();

  /**
   * Add a construct to the dependency roots
   */
  public add(dep: IDependable) {
    this.dependables.push(dep);
  }

  /**
   * Retrieve the current set of dependency roots
   */
  public get dependencyRoots(): IConstruct[] {
    const ret = [];
    for (const dep of this.dependables) {
      ret.push(...dep.dependencyRoots);
    }
    return ret;
  }
}
