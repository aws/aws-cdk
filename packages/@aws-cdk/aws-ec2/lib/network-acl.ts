import { Construct, IResource,  Resource, ResourceProps } from '@aws-cdk/core';
import cdk = require('@aws-cdk/core');
import { CfnNetworkAcl, CfnNetworkAclEntry  } from './ec2.generated';
import { IVpc } from './vpc';

export interface INetworkACL extends IResource {
  /**
   * ID for the current Network ACL
   * @attribute
   */
  readonly NetworkAclId: string;
}

/**
 * A NetworkAclBase that is not created in this template
 */
abstract class NetworkAclBase extends Resource implements INetworkACL {
public abstract readonly NetworkAclId: string;
constructor(scope: Construct, id: string, props?: ResourceProps) {
    super(scope, id, props);

  }

  public get uniqueId() {
    return this.node.uniqueId;
  }
}

export interface NetworkAclProps {
  /**
   * The VPC in which to create the NetworkACL.
   */
  readonly vpc: IVpc;
}

export class NetworkAcl extends NetworkAclBase {
  /**
   * Import an existing NetworkAcl into this app.
   */
  public static fromNetworkAclId(scope: Construct, id: string, networkAclId: string): INetworkACL {
  class Import extends NetworkAclBase {
    public NetworkAclId = networkAclId;
    }

  return new Import(scope, id);
  }
  /**
   * The ID of the NetworkACL
   *
   * @attribute
   */
  public readonly NetworkAclId: string;

  /**
   * The VPC ID for this NetworkACL
   *
   * @attribute
   */
  public readonly NetworkAclVpcId: string;

  private readonly networkACL: CfnNetworkAcl;

  constructor(scope: Construct, id: string, props: NetworkAclProps) {
    super(scope, id, {
      physicalName: cdk.PhysicalName.GENERATE_IF_NEEDED
    });
    this.networkACL = new CfnNetworkAcl(this, 'Resource', {
      vpcId: props.vpc.vpcId,
    });

    this.NetworkAclId = this.networkACL.logicalId;
    this.NetworkAclVpcId = this.networkACL.vpcId;
  }
}

export interface Icmp {
  /**
   * The Internet Control Message Protocol (ICMP) code. You can use -1 to specify all ICMP
   * codes for the given ICMP type. Requirement is conditional: Required if you
   * specify 1 (ICMP) for the protocol parameter.
   */
  readonly code?: number
  /**
   * The Internet Control Message Protocol (ICMP) type. You can use -1 to specify all ICMP types.
   * Conditional requirement: Required if you specify 1 (ICMP) for the CreateNetworkAclEntry protocol parameter.
   */
  readonly type?: number
}

export interface PortRange {
  /**
   * The first port in the range. Required if you specify 6 (TCP) or 17 (UDP) for the protocol parameter.
   */
  readonly from?: number
  /**
   * The last port in the range. Required if you specify 6 (TCP) or 17 (UDP) for the protocol parameter.
   */
  readonly to?: number
}

export interface INetworkAclEntry {
  /**
   * The IPv4 CIDR range to allow or deny, in CIDR notation (for example, 172.16.0.0/24).
   * Requirement is conditional: You must specify the CidrBlock or Ipv6CidrBlock property.
   */
  readonly cidrBlock: string;

  /**
   * Whether this rule applies to egress traffic from the subnet (true) or ingress traffic to the subnet (false).
   * By default, AWS CloudFormation specifies false.
   *   @default false
   */
  readonly egress: boolean;

  /**
   * The Internet Control Message Protocol (ICMP) code and type.
   * Requirement is conditional: Required if specifying 1 (ICMP) for the protocol parameter.
   */
  readonly icmp?: Icmp

  /**
   * The IPv6 network range to allow or deny, in CIDR notation.
   * Requirement is conditional: You must specify the CidrBlock or Ipv6CidrBlock property.
   */
  readonly ipv6CidrBlock?: string

  /**
   * The ID of the network ACL.
   */
  readonly networkAclId: string

  /**
   * The range of port numbers for the UDP/TCP protocol.
   * Conditional required if specifying 6 (TCP) or 17 (UDP) for the protocol parameter.
   */
  readonly portRange?: PortRange

  /**
   * The protocol number. A value of "-1" means all protocols. If you specify "-1"
   * or a protocol number other than "6" (TCP), "17" (UDP), or "1" (ICMP), traffic
   * on all ports is allowed, regardless of any ports or ICMP types or codes that
   * you specify. If you specify protocol "58" (ICMPv6) and specify an IPv4 CIDR
   * block, traffic for all ICMP types and codes allowed, regardless of any that
   * you specify. If you specify protocol "58" (ICMPv6) and specify an IPv6 CIDR
   * block, you must specify an ICMP type and code.
   *
   * @default 17
   */
  readonly protocol: number;

  /**
   * Whether to allow or deny traffic that matches the rule; valid values are "allow" or "deny".
   */
  readonly ruleAction: string

  /**
   * Rule number to assign to the entry, such as 100. ACL entries are processed in ascending order by rule number.
   * Entries can't use the same rule number unless one is an egress rule and the other is an ingress rule.
   */
  readonly ruleNumber: number

}

abstract class NetworkAclEntryBase extends Resource implements INetworkAclEntry {
  public abstract readonly  cidrBlock: string;
  public abstract readonly  egress: boolean;
  public abstract readonly  icmp?: Icmp;
  public abstract readonly  ipv6CidrBlock?: string;
  public abstract readonly  networkAclId: string;
  public abstract readonly  portRange?: PortRange;
  public abstract readonly  protocol: number;
  public abstract readonly  ruleAction: string;
  public abstract readonly  ruleNumber: number;

  constructor(scope: Construct, id: string, props?: ResourceProps) {
    super(scope, id, props);

  }

  public get uniqueId() {
    return this.node.uniqueId;
  }
}

export interface NetworkAclEntryProps {
 /**
  * The IPv4 CIDR range to allow or deny, in CIDR notation (for example, 172.16.0.0/24).
  * Requirement is conditional: You must specify the CidrBlock or Ipv6CidrBlock property.
  */
  readonly cidrBlock: string;

  /**
   * Whether this rule applies to egress traffic from the subnet (true) or ingress traffic to the subnet (false).
   * By default, AWS CloudFormation specifies false.
   * @default false
   */
  readonly egress: boolean;

  /**
   * The Internet Control Message Protocol (ICMP) code and type.
   * Requirement is conditional: Required if specifying 1 (ICMP) for the protocol parameter.
   */
  readonly icmp?: Icmp

  /**
   * The IPv6 network range to allow or deny, in CIDR notation.
   * Requirement is conditional: You must specify the CidrBlock or Ipv6CidrBlock property.
   */
  readonly ipv6CidrBlock?: string

  /**
   * The ID of the network ACL.
   */
  readonly networkAcl: INetworkACL

  /**
   * The range of port numbers for the UDP/TCP protocol.
   * Conditional required if specifying 6 (TCP) or 17 (UDP) for the protocol parameter.
   */
  readonly portRange?: PortRange

  /**
   * The protocol number. A value of "-1" means all protocols. If you specify "-1"
   * or a protocol number other than "6" (TCP), "17" (UDP), or "1" (ICMP), traffic
   * on all ports is allowed, regardless of any ports or ICMP types or codes that
   * you specify. If you specify protocol "58" (ICMPv6) and specify an IPv4 CIDR
   * block, traffic for all ICMP types and codes allowed, regardless of any that
   * you specify. If you specify protocol "58" (ICMPv6) and specify an IPv6 CIDR
   * block, you must specify an ICMP type and code.
   *
   * @default 17
   */
  readonly protocol: number;

  /**
   * Whether to allow or deny traffic that matches the rule; valid values are "allow" or "deny".
   */
  readonly ruleAction: string

  /**
   * Rule number to assign to the entry, such as 100. ACL entries are processed in ascending order by rule number.
   * Entries can't use the same rule number unless one is an egress rule and the other is an ingress rule.
   */
  readonly ruleNumber: number
}

export class NetworkAclEntry extends NetworkAclEntryBase {
  public readonly  cidrBlock: string;
  public readonly  egress: boolean;
  public readonly  icmp?: Icmp;
  public readonly  ipv6CidrBlock?: string;
  public readonly  networkAclId: string;
  public readonly  portRange?: PortRange;
  public readonly  protocol: number;
  public readonly  ruleAction: string;
  public readonly  ruleNumber: number;
  private readonly networkAclEntry: CfnNetworkAclEntry;

  constructor(scope: Construct, id: string, props: NetworkAclEntryProps) {
    super(scope, id, {
      physicalName: cdk.PhysicalName.GENERATE_IF_NEEDED
    });

    this.cidrBlock = props.cidrBlock;
    this.egress = props.egress;
    this.icmp = props.icmp;
    this.ipv6CidrBlock = props.ipv6CidrBlock;
    this.portRange = props.portRange;
    this.protocol = props.protocol;
    this.ruleAction = props.ruleAction;
    this.ruleNumber = props.ruleNumber;

    this.networkAclEntry = new CfnNetworkAclEntry(this, 'Resource', {
      networkAclId: props.networkAcl.NetworkAclId,
      ruleNumber: props.ruleNumber,
      protocol: props.protocol,
      ruleAction: props.ruleAction,
      egress: props.egress,
      cidrBlock: props.cidrBlock,
      icmp: props.icmp,
      portRange: props.portRange
    });

    this.networkAclId = this.networkAclEntry.networkAclId;
  }

  public get uniqueId() {
    return this.node.uniqueId;
  }
}