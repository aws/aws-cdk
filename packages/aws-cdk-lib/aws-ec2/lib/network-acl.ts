import { Construct } from 'constructs';
import {
  CfnNetworkAcl,
  CfnNetworkAclEntry,
  CfnSubnetNetworkAclAssociation,
  INetworkAclEntryRef,
  INetworkAclRef,
  ISubnetNetworkAclAssociationRef, NetworkAclEntryReference, NetworkAclReference, SubnetNetworkAclAssociationReference,
} from './ec2.generated';
import { AclCidr, AclTraffic } from './network-acl-types';
import { ISubnet, IVpc, SubnetSelection } from './vpc';
import { IResource, Resource, Tags } from '../../core';
import { asNetworkAcl, asSubnet } from './private/conversions';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Name tag constant
 */
const NAME_TAG: string = 'Name';

/**
 * A NetworkAcl
 */
export interface INetworkAcl extends IResource, INetworkAclRef {
  /**
   * ID for the current Network ACL
   * @attribute
   */
  readonly networkAclId: string;

  /**
   * Add a new entry to the ACL
   */
  addEntry(id: string, options: CommonNetworkAclEntryOptions): NetworkAclEntry;
}

/**
 * A NetworkAclBase that is not created in this template
 *
 *
 */
abstract class NetworkAclBase extends Resource implements INetworkAcl {
  public abstract readonly networkAclId: string;

  public get networkAclRef(): NetworkAclReference {
    return {
      networkAclId: this.networkAclId,
    };
  }

  /**
   * Add a new entry to the ACL
   */
  public addEntry(id: string, options: CommonNetworkAclEntryOptions): NetworkAclEntry {
    return new NetworkAclEntry(this, id, {
      networkAcl: this,
      ...options,
    });
  }
}

/**
 * Properties to create NetworkAcl
 *
 *
 */
export interface NetworkAclProps {
  /**
   * The name of the NetworkAcl.
   *
   * Since the NetworkAcl resource doesn't support providing a physical name, the value provided here will be recorded in the `Name` tag.
   *
   * @default CDK generated name
   */
  readonly networkAclName?: string;

  /**
   * The VPC in which to create the NetworkACL.
   */
  readonly vpc: IVpc;

  /**
   * Subnets in the given VPC to associate the ACL with
   *
   * More subnets can always be added later by calling
   * `associateWithSubnets()`.
   *
   * @default - No subnets associated
   */
  readonly subnetSelection?: SubnetSelection;
}

/**
 * Define a new custom network ACL
 *
 * By default, will deny all inbound and outbound traffic unless entries are
 * added explicitly allowing it.
 *
 *
 */
@propertyInjectable
export class NetworkAcl extends NetworkAclBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-ec2.NetworkAcl';

  /**
   * Import an existing NetworkAcl into this app.
   */
  public static fromNetworkAclId(scope: Construct, id: string, networkAclId: string): INetworkAcl {
    class Import extends NetworkAclBase {
      public readonly networkAclId = networkAclId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of the NetworkACL
   *
   * @attribute
   */
  public readonly networkAclId: string;

  /**
   * The VPC ID for this NetworkACL
   *
   * @attribute
   */
  public readonly networkAclVpcId: string;

  private readonly networkAcl: CfnNetworkAcl;
  private readonly vpc: IVpc;

  constructor(scope: Construct, id: string, props: NetworkAclProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.vpc = props.vpc;

    Tags.of(this).add(NAME_TAG, props.networkAclName || this.node.path);

    this.networkAcl = new CfnNetworkAcl(this, 'Resource', {
      vpcId: props.vpc.vpcId,
    });

    this.networkAclId = this.networkAcl.ref;
    this.networkAclVpcId = this.networkAcl.vpcId;

    if (props.subnetSelection !== undefined) {
      this.associateWithSubnet('DefaultAssociation', props.subnetSelection);
    }
  }

  /**
   * Associate the ACL with a given set of subnets
   */
  @MethodMetadata()
  public associateWithSubnet(id: string, selection: SubnetSelection) {
    const subnets = this.vpc.selectSubnets(selection);
    for (const subnet of subnets.subnets) {
      subnet.associateNetworkAcl(id, this);
    }
  }
}

/**
 * What action to apply to traffic matching the ACL
 *
 *
 */
export enum Action {
  /**
   * Allow the traffic
   */
  ALLOW = 'allow',

  /**
   * Deny the traffic
   */
  DENY = 'deny',
}

/**
 * A NetworkAclEntry
 *
 *
 */
export interface INetworkAclEntry extends IResource, INetworkAclEntryRef {
  /**
   * The network ACL.
   */
  readonly networkAcl: INetworkAcl;
}

/**
 * Base class for NetworkAclEntries
 *
 *
 */
abstract class NetworkAclEntryBase extends Resource implements INetworkAclEntry {
  public abstract readonly networkAcl: INetworkAcl;
  public abstract readonly networkAclEntryRef: NetworkAclEntryReference;
}

/**
 * Direction of traffic the AclEntry applies to
 *
 *
 */
export enum TrafficDirection {
  /**
   * Traffic leaving the subnet
   */
  EGRESS,

  /**
   * Traffic entering the subnet
   */
  INGRESS,
}

/**
 * Basic NetworkACL entry props
 *
 *
 */
export interface CommonNetworkAclEntryOptions {
  /**
   * The name of the NetworkAclEntry.
   *
   * It is not recommended to use an explicit group name.
   *
   * @default If you don't specify a NetworkAclName, AWS CloudFormation generates a
   * unique physical ID and uses that ID for the group name.
   */
  readonly networkAclEntryName?: string;

  /**
   * The CIDR range to allow or deny.
   */
  readonly cidr: AclCidr;

  /**
   * What kind of traffic this ACL rule applies to
   */
  readonly traffic: AclTraffic;

  /**
   * Traffic direction, with respect to the subnet, this rule applies to
   *
   * @default TrafficDirection.INGRESS
   */
  readonly direction?: TrafficDirection;

  /**
   * Whether to allow or deny traffic that matches the rule; valid values are "allow" or "deny".
   *
   * Any traffic that is not explicitly allowed is automatically denied in a custom
   * ACL, all traffic is automatically allowed in a default ACL.
   *
   * @default ALLOW
   */
  readonly ruleAction?: Action;

  /**
   * Rule number to assign to the entry, such as 100. ACL entries are processed in ascending order by rule number.
   * Entries can't use the same rule number unless one is an egress rule and the other is an ingress rule.
   */
  readonly ruleNumber: number;
}

/**
 * Properties to create NetworkAclEntry
 *
 *
 */
export interface NetworkAclEntryProps extends CommonNetworkAclEntryOptions {
  /**
   * The network ACL this entry applies to.
   */
  readonly networkAcl: INetworkAcl;
}

/**
 * Define an entry in a Network ACL table
 *
 *
 */
@propertyInjectable
export class NetworkAclEntry extends NetworkAclEntryBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-ec2.NetworkAclEntry';

  public readonly networkAcl: INetworkAcl;
  public readonly networkAclEntryRef: NetworkAclEntryReference;

  constructor(scope: Construct, id: string, props: NetworkAclEntryProps) {
    super(scope, id, {
      physicalName: props.networkAclEntryName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.networkAcl = props.networkAcl;

    const resource = new CfnNetworkAclEntry(this, 'Resource', {
      networkAclId: this.networkAcl.networkAclRef.networkAclId,
      ruleNumber: props.ruleNumber,
      ruleAction: props.ruleAction ?? Action.ALLOW,
      egress: props.direction !== undefined ? props.direction === TrafficDirection.EGRESS : undefined,
      ...props.traffic.toTrafficConfig(),
      ...props.cidr.toCidrConfig(),
    });
    this.networkAclEntryRef = resource.networkAclEntryRef;
  }
}

/**
 * A SubnetNetworkAclAssociation
 *
 *
 */
export interface ISubnetNetworkAclAssociation extends IResource, ISubnetNetworkAclAssociationRef {
  /**
   * ID for the current SubnetNetworkAclAssociation
   * @attribute
   */
  readonly subnetNetworkAclAssociationAssociationId: string;
}

/**
 * Properties to create a SubnetNetworkAclAssociation
 *
 *
 */
export interface SubnetNetworkAclAssociationProps {
  /**
   * The name of the SubnetNetworkAclAssociation.
   *
   * It is not recommended to use an explicit name.
   *
   * @default If you don't specify a SubnetNetworkAclAssociationName, AWS CloudFormation generates a
   * unique physical ID and uses that ID for the group name.
   */
  readonly subnetNetworkAclAssociationName?: string;

  /**
   * The Network ACL this association is defined for
   */
  readonly networkAcl: INetworkAclRef;

  /**
   * ID of the Subnet
   */
  readonly subnet: ISubnet;
}

/**
 * Associate a network ACL with a subnet
 *
 *
 */
abstract class SubnetNetworkAclAssociationBase extends Resource implements ISubnetNetworkAclAssociation {
  public abstract readonly subnetNetworkAclAssociationAssociationId: string;

  public get subnetNetworkAclAssociationRef(): SubnetNetworkAclAssociationReference {
    return {
      associationId: this.subnetNetworkAclAssociationAssociationId,
    };
  }
}

@propertyInjectable
export class SubnetNetworkAclAssociation extends SubnetNetworkAclAssociationBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-ec2.SubnetNetworkAclAssociation';

  public static fromSubnetNetworkAclAssociationAssociationId(
    scope: Construct, id: string,
    subnetNetworkAclAssociationAssociationId: string): ISubnetNetworkAclAssociation {
    class Import extends SubnetNetworkAclAssociationBase {
      public readonly subnetNetworkAclAssociationAssociationId = subnetNetworkAclAssociationAssociationId;
    }

    return new Import(scope, id);
  }
  /**
   * ID for the current SubnetNetworkAclAssociation
   * @attribute
   */
  public readonly subnetNetworkAclAssociationAssociationId: string;

  private readonly _subnet: ISubnet;

  private association: CfnSubnetNetworkAclAssociation;
  private readonly _networkAcl: INetworkAclRef;

  constructor(scope: Construct, id: string, props: SubnetNetworkAclAssociationProps) {
    super(scope, id, {
      physicalName: props.subnetNetworkAclAssociationName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.association = new CfnSubnetNetworkAclAssociation(this, 'Resource', {
      networkAclId: props.networkAcl.networkAclRef.networkAclId,
      subnetId: props.subnet.subnetRef.subnetId,
    });

    this._networkAcl = props.networkAcl;
    this._subnet = props.subnet;
    this.subnetNetworkAclAssociationAssociationId = this.association.attrAssociationId;
  }

  /**
   * ID of the Subnet
   */
  public get subnet(): ISubnet {
    return asSubnet(this._subnet, this);
  }

  /**
   * ID for the current Network ACL
   */
  public get networkAcl(): INetworkAcl {
    return asNetworkAcl(this._networkAcl, this);
  }
}
