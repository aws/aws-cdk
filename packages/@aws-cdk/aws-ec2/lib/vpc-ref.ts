import { Construct, IConstruct, IDependable } from "@aws-cdk/cdk";
import { DEFAULT_SUBNET_NAME, subnetName } from './util';
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
   * Return the subnets appropriate for the placement strategy
   *
   * Prefer using {@link subnetIds} if you need to pass subnet IDs to a
   * CloudFormation Resource.
   */
  subnets(placement?: VpcPlacementStrategy): IVpcSubnet[];

  /**
   * Return IDs of the subnets appropriate for the given placement strategy
   *
   * Requires that at least once subnet is matched, throws a descriptive
   * error message otherwise.
   *
   * Prefer to use this method over {@link subnets} if you need to pass subnet
   * IDs to a CloudFormation Resource.
   */
  subnetIds(placement?: VpcPlacementStrategy): string[];

  /**
   * Return whether the given subnet is one of this VPC's public subnets.
   *
   * The subnet must literally be one of the subnet object obtained from
   * this VPC. A subnet that merely represents the same subnet will
   * never return true.
   */
  isPublicSubnet(subnet: IVpcSubnet): boolean;

  /**
   * Adds a new VPN connection to this VPC
   */
  addVpnConnection(id: string, options: VpnConnectionOptions): VpnConnection;

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
 * Customize how instances are placed inside a VPC
 *
 * Constructs that allow customization of VPC placement use parameters of this
 * type to provide placement settings.
 *
 * By default, the instances are placed in the private subnets.
 */
export interface VpcPlacementStrategy {
  /**
   * Place the instances in the subnets of the given type
   *
   * At most one of `subnetsToUse` and `subnetName` can be supplied.
   *
   * @default SubnetType.Private
   */
  subnetsToUse?: SubnetType;

  /**
   * Place the instances in the subnets with the given name
   *
   * (This is the name supplied in subnetConfiguration).
   *
   * At most one of `subnetsToUse` and `subnetName` can be supplied.
   *
   * @default name
   */
  subnetName?: string;
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
   * Return the subnets appropriate for the placement strategy
   */
  public subnets(placement: VpcPlacementStrategy = {}): IVpcSubnet[] {
    placement = reifyDefaultsPlacement(placement);

    // Select by name
    if (placement.subnetName !== undefined) {
      const allSubnets = this.privateSubnets.concat(this.publicSubnets).concat(this.isolatedSubnets);
      const selectedSubnets = allSubnets.filter(s => subnetName(s) === placement.subnetName);
      if (selectedSubnets.length === 0) {
        throw new Error(`No subnets with name: ${placement.subnetName}`);
      }
      return selectedSubnets;
    }

    // Select by type
    if (placement.subnetsToUse === undefined) { return this.privateSubnets; }

    return {
      [SubnetType.Isolated]: this.isolatedSubnets,
      [SubnetType.Private]: this.privateSubnets,
      [SubnetType.Public]: this.publicSubnets,
    }[placement.subnetsToUse];
  }

  /**
   * Returns IDs of selected subnets
   */
  public subnetIds(placement: VpcPlacementStrategy = {}): string[] {
    placement = reifyDefaultsPlacement(placement);

    const nets = this.subnets(placement);
    if (nets.length === 0) {
      throw new Error(`There are no ${describePlacement(placement)} in this VPC. Use a different VPC placement strategy.`);
    }

    return nets.map(n => n.subnetId);
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
   * Export this VPC from the stack
   */
  public abstract export(): VpcNetworkImportProps;

  /**
   * Return whether the given subnet is one of this VPC's public subnets.
   *
   * The subnet must literally be one of the subnet object obtained from
   * this VPC. A subnet that merely represents the same subnet will
   * never return true.
   */
  public isPublicSubnet(subnet: IVpcSubnet) {
    return this.publicSubnets.indexOf(subnet) > -1;
  }

  /**
   * The region where this VPC is defined
   */
  public get vpcRegion(): string {
    return this.node.stack.region;
  }

}

/**
 * Properties that reference an external VpcNetwork
 */
export interface VpcNetworkImportProps {
  /**
   * VPC's identifier
   */
  vpcId: string;

  /**
   * List of availability zones for the subnets in this VPC.
   */
  availabilityZones: string[];

  /**
   * List of public subnet IDs
   *
   * Must be undefined or match the availability zones in length and order.
   */
  publicSubnetIds?: string[];

  /**
   * List of names for the public subnets
   *
   * Must be undefined or have a name for every public subnet group.
   */
  publicSubnetNames?: string[];

  /**
   * List of private subnet IDs
   *
   * Must be undefined or match the availability zones in length and order.
   */
  privateSubnetIds?: string[];

  /**
   * List of names for the private subnets
   *
   * Must be undefined or have a name for every private subnet group.
   */
  privateSubnetNames?: string[];

  /**
   * List of isolated subnet IDs
   *
   * Must be undefined or match the availability zones in length and order.
   */
  isolatedSubnetIds?: string[];

  /**
   * List of names for the isolated subnets
   *
   * Must be undefined or have a name for every isolated subnet group.
   */
  isolatedSubnetNames?: string[];

  /**
   * VPN gateway's identifier
   */
  vpnGatewayId?: string;
}

export interface VpcSubnetImportProps {
  /**
   * The Availability Zone the subnet is located in
   */
  availabilityZone: string;

  /**
   * The subnetId for this particular subnet
   */
  subnetId: string;
}

/**
 * If the placement strategy is completely "default", reify the defaults so
 * consuming code doesn't have to reimplement the same analysis every time.
 *
 * Returns "private subnets" by default.
 */
function reifyDefaultsPlacement(placement: VpcPlacementStrategy): VpcPlacementStrategy {
    if (placement.subnetsToUse !== undefined && placement.subnetName !== undefined) {
      throw new Error('At most one of subnetsToUse and subnetName can be supplied');
    }

    if (placement.subnetsToUse === undefined && placement.subnetName === undefined) {
      return { subnetsToUse: SubnetType.Private };
    }

    return placement;
}

/**
 * Describe the given placement strategy
 */
function describePlacement(placement: VpcPlacementStrategy) {
  if (placement.subnetsToUse !== undefined) {
    return `'${DEFAULT_SUBNET_NAME[placement.subnetsToUse]}' subnets`;
  }
  if (placement.subnetName !== undefined) {
    return `subnets named '${placement.subnetName}'`;
  }
  return '???';
}