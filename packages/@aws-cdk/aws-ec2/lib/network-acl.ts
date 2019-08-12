import {  Construct, IResource,  Resource } from '@aws-cdk/core';
import { CfnNetworkAcl  } from './ec2.generated';
import { IVpc } from './vpc';



export interface INetworkACL extends IResource {
  /**
   * ID for the current Network ACL
   * @attribute
   */
  readonly NetworkAclId : string;
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


  constructor(scope: Construct, id: string, props: NetworkACLProps) {
    super(scope, id, {
      physicalName: cdk.PhysicalName.GENERATE_IF_NEEDED
    });
   
    this.networkACL = new CfnNetworkAcl(this, 'Resource', {
      vpcId: props.vpc.vpcId,
    });

    this.NetworkAclId = this.networkACL.attrNetworkAclId;
    this.NetworkAclVpcId = this.networkACL.attrVpcId;
  }
}


export interface icmp{
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

export interface portRange{
  /**
   *The first port in the range. Required if you specify 6 (TCP) or 17 (UDP) for the protocol parameter.
   */
  readonly from?: number
  /**
   *The last port in the range. Required if you specify 6 (TCP) or 17 (UDP) for the protocol parameter.
   */
  readonly to?: number
}

export interface NetworkAclEntry {
  /**
   * The IPv4 CIDR range to allow or deny, in CIDR notation (for example, 172.16.0.0/24). 
   * Requirement is conditional: You must specify the CidrBlock or Ipv6CidrBlock property.
   */
  readonly cidrBlock: string;

  /**
   * Whether this rule applies to egress traffic from the subnet (true) or ingress traffic to the subnet (false).
   * By default, AWS CloudFormation specifies false.
   * 
   * @default false
   */
  readonly egress: boolean;

  /**
   * The Internet Control Message Protocol (ICMP) code and type. 
   * Requirement is conditional: Required if specifying 1 (ICMP) for the protocol parameter.
   */
  readonly icmp?: icmp

  /**
   * The IPv6 network range to allow or deny, in CIDR notation. 
   * Requirement is conditional: You must specify the CidrBlock or Ipv6CidrBlock property. 
   */
  readonly ipv6CidrBlock?: string
  
  /**
   * The range of port numbers for the UDP/TCP protocol. 
   * Conditional required if specifying 6 (TCP) or 17 (UDP) for the protocol parameter.
   */
  readonly portRange?: portRange

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
  readonly protocol?: string;

  /**
   * Whether to allow or deny traffic that matches the rule; valid values are "allow" or "deny".
   */
  readonly ruleAction:string

  /**
   * Rule number to assign to the entry, such as 100. ACL entries are processed in ascending order by rule number.
   * Entries can't use the same rule number unless one is an egress rule and the other is an ingress rule.
   */
  readonly ruleNumber: number

}


