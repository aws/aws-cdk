import { Construct, IResource,  Resource, ResourceProps } from '@aws-cdk/core';
import { CfnNetworkAcl, CfnNetworkAclEntry  } from './ec2.generated';
import { IVpc } from './vpc';

export interface INetworkACL extends IResource {
  /**
   * ID for the current Network ACL
   * @attribute
   */
  readonly networkAclId: string;
}

/**
 * A NetworkAclBase that is not created in this template
 */
abstract class NetworkAclBase extends Resource implements INetworkACL {
public abstract readonly networkAclId: string;
constructor(scope: Construct, id: string, props?: ResourceProps) {
    super(scope, id, props);

  }

  public get uniqueId() {
    return this.node.uniqueId;
  }
}

export interface NetworkAclProps {
  /**
   * The name of the NetworkAcl.
   *
   * It is not recommended to use an explicit name.
   *
   * @default If you don't specify a networkAclName, AWS CloudFormation generates a
   * unique physical ID and uses that ID for the group name.
   */
  readonly networkAclName?: string;
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
    public networkAclId = networkAclId;
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

  private readonly networkACL: CfnNetworkAcl;

  constructor(scope: Construct, id: string, props: NetworkAclProps) {
    super(scope, id, {
      physicalName: props.networkAclName
    });
    this.networkACL = new CfnNetworkAcl(this, 'Resource', {
      vpcId: props.vpc.vpcId,
    });

    this.networkAclId = this.networkACL.ref;
    this.networkAclVpcId = this.networkACL.vpcId;
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

export interface INetworkAclEntry extends IResource {
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
   *
   * @default undefined
   */
  readonly icmp?: Icmp

  /**
   * The IPv6 network range to allow or deny, in CIDR notation.
   * Requirement is conditional: You must specify the CidrBlock or Ipv6CidrBlock property.
   *
   * @default undefined
   */
  readonly ipv6CidrBlock?: string

  /**
   * The ID of the network ACL.
   */
  readonly networkAcl: INetworkACL

  /**
   * The range of port numbers for the UDP/TCP protocol.
   * Conditional required if specifying 6 (TCP) or 17 (UDP) for the protocol parameter.
   *
   * @default undefined
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
  public abstract readonly  networkAcl: INetworkACL;
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
   * The name of the NetworkAclEntry.
   *
   * It is not recommended to use an explicit group name.
   *
   * @default If you don't specify a NetworkAclName, AWS CloudFormation generates a
   * unique physical ID and uses that ID for the group name.
   */
  readonly networkAclEntryName?: string;
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
   *
   * @default undefined
   */
  readonly icmp?: Icmp

  /**
   * The IPv6 network range to allow or deny, in CIDR notation.
   * Requirement is conditional: You must specify the CidrBlock or Ipv6CidrBlock property.
   *
   * @default undefined
   */
  readonly ipv6CidrBlock?: string

  /**
   * The ID of the network ACL.
   */
  readonly networkAcl: INetworkACL

  /**
   * The range of port numbers for the UDP/TCP protocol.
   * Conditional required if specifying 6 (TCP) or 17 (UDP) for the protocol parameter.
   *
   * @default undefined
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
  public readonly  networkAcl: INetworkACL;
  public readonly  portRange?: PortRange;
  public readonly  protocol: number;
  public readonly  ruleAction: string;
  public readonly  ruleNumber: number;

  constructor(scope: Construct, id: string, props: NetworkAclEntryProps) {
    super(scope, id, {
      physicalName: props.networkAclEntryName
    });

    this.cidrBlock = props.cidrBlock;
    this.egress = props.egress;
    this.icmp = props.icmp;
    this.networkAcl = props.networkAcl;
    this.ipv6CidrBlock = props.ipv6CidrBlock;
    this.portRange = props.portRange;
    this.protocol = props.protocol;
    this.ruleAction = props.ruleAction;
    this.ruleNumber = props.ruleNumber;

    new CfnNetworkAclEntry(this, 'Resource', {
      networkAclId: this.networkAcl.networkAclId,
      ruleNumber: props.ruleNumber,
      protocol: props.protocol,
      ruleAction: props.ruleAction,
      egress: props.egress,
      cidrBlock: props.cidrBlock,
      icmp: props.icmp,
      portRange: props.portRange
    });

  }

  public get uniqueId() {
    return this.node.uniqueId;
  }
}