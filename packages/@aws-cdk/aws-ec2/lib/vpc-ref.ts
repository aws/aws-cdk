import { Construct, IDependable, Output } from "@aws-cdk/cdk";
import { ExportSubnetGroup, ImportSubnetGroup, subnetName } from './util';

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
  public abstract readonly vpcId: string;

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
    if (placement.subnetsToUse !== undefined && placement.subnetName !== undefined) {
      throw new Error('At most one of subnetsToUse and subnetName can be supplied');
    }

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
   * Export this VPC from the stack
   */
  public export(): VpcNetworkRefProps {
    const pub = new ExportSubnetGroup(this, 'PublicSubnetIDs', this.publicSubnets, SubnetType.Public, this.availabilityZones.length);
    const priv = new ExportSubnetGroup(this, 'PrivateSubnetIDs', this.privateSubnets, SubnetType.Private, this.availabilityZones.length);
    const iso = new ExportSubnetGroup(this, 'IsolatedSubnetIDs', this.isolatedSubnets, SubnetType.Isolated, this.availabilityZones.length);

    return {
      vpcId: new Output(this, 'VpcId', { value: this.vpcId }).makeImportValue().toString(),
      availabilityZones: this.availabilityZones,
      publicSubnetIds: pub.ids,
      publicSubnetNames: pub.names,
      privateSubnetIds: priv.ids,
      privateSubnetNames: priv.names,
      isolatedSubnetIds: iso.ids,
      isolatedSubnetNames: iso.names,
    };
  }

  /**
   * Return whether the given subnet is one of this VPC's public subnets.
   *
   * The subnet must literally be one of the subnet object obtained from
   * this VPC. A subnet that merely represents the same subnet will
   * never return true.
   */
  public isPublicSubnet(subnet: VpcSubnetRef) {
    return this.publicSubnets.indexOf(subnet) > -1;
  }
}

/**
 * An imported VpcNetwork
 */
class ImportedVpcNetwork extends VpcNetworkRef {
  /**
   * Identifier for this VPC
   */
  public readonly vpcId: string;

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

    // tslint:disable:max-line-length
    const pub = new ImportSubnetGroup(props.publicSubnetIds, props.publicSubnetNames, SubnetType.Public, this.availabilityZones, 'publicSubnetIds', 'publicSubnetNames');
    const priv = new ImportSubnetGroup(props.privateSubnetIds, props.privateSubnetNames, SubnetType.Private, this.availabilityZones, 'privateSubnetIds', 'privateSubnetNames');
    const iso = new ImportSubnetGroup(props.isolatedSubnetIds, props.isolatedSubnetNames, SubnetType.Isolated, this.availabilityZones, 'isolatedSubnetIds', 'isolatedSubnetNames');
    // tslint:enable:max-line-length

    this.publicSubnets = pub.import(this);
    this.privateSubnets = priv.import(this);
    this.isolatedSubnets = iso.import(this);
  }
}

/**
 * Properties that reference an external VpcNetwork
 */
export interface VpcNetworkRefProps {
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
  public abstract readonly subnetId: string;

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
  public readonly subnetId: string;

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
  subnetId: string;
}
