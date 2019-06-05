import { Token } from '@aws-cdk/cdk';
import { Connections, IConnectable } from "./connections";

/**
 * Interface for classes that provide the peer-specification parts of a security group rule
 */
export interface ISecurityGroupRule {
  /**
   * Whether the rule can be inlined into a SecurityGroup or not
   */
  readonly canInlineRule: boolean;

  /**
   * A unique identifier for this connection peer
   */
  readonly uniqueId: string;

  /**
   * Produce the ingress rule JSON for the given connection
   */
  toIngressRuleJSON(): any;

  /**
   * Produce the egress rule JSON for the given connection
   */
  toEgressRuleJSON(): any;
}

/**
 * A connection to and from a given IP range
 */
export class CidrIPv4 implements ISecurityGroupRule, IConnectable {
  public readonly canInlineRule = true;
  public readonly connections: Connections = new Connections({ securityGroupRule: this });
  public readonly uniqueId: string;

  constructor(private readonly cidrIp: string) {
    this.uniqueId = cidrIp;
  }

  /**
   * Produce the ingress rule JSON for the given connection
   */
  public toIngressRuleJSON(): any {
    return { cidrIp: this.cidrIp };
  }
  /**
   * Produce the egress rule JSON for the given connection
   */
  public toEgressRuleJSON(): any {
    return { cidrIp: this.cidrIp };
  }
}

/**
 * Any IPv4 address
 */
export class AnyIPv4 extends CidrIPv4 {
  constructor() {
    super("0.0.0.0/0");
  }
}

/**
 * A connection to a from a given IPv6 range
 */
export class CidrIPv6 implements ISecurityGroupRule, IConnectable {
  public readonly canInlineRule = true;
  public readonly connections: Connections = new Connections({ securityGroupRule: this });
  public readonly uniqueId: string;

  constructor(private readonly cidrIpv6: string) {
    this.uniqueId = cidrIpv6;
  }

  /**
   * Produce the ingress rule JSON for the given connection
   */
  public toIngressRuleJSON(): any {
    return { cidrIpv6: this.cidrIpv6 };
  }
  /**
   * Produce the egress rule JSON for the given connection
   */
  public toEgressRuleJSON(): any {
    return { cidrIpv6: this.cidrIpv6 };
  }
}

/**
 * Any IPv6 address
 */
export class AnyIPv6 extends CidrIPv6 {
  constructor() {
    super("::0/0");
  }
}

/**
 * A prefix list
 *
 * Prefix lists are used to allow traffic to VPC-local service endpoints.
 *
 * For more information, see this page:
 *
 * https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-endpoints.html
 */
export class PrefixList implements ISecurityGroupRule, IConnectable {
  public readonly canInlineRule = false;
  public readonly connections: Connections = new Connections({ securityGroupRule: this });
  public readonly uniqueId: string;

  constructor(private readonly prefixListId: string) {
    this.uniqueId = prefixListId;
  }

  public toIngressRuleJSON(): any {
    return { sourcePrefixListId: this.prefixListId };
  }

  public toEgressRuleJSON(): any {
    return { destinationPrefixListId: this.prefixListId };
  }
}

/**
 * Interface for classes that provide the connection-specification parts of a security group rule
 */
export interface IPortRange {
  /**
   * Whether the rule containing this port range can be inlined into a securitygroup or not.
   */
  readonly canInlineRule: boolean;

  /**
   * Produce the ingress/egress rule JSON for the given connection
   */
  toRuleJSON(): any;
}

/**
 * Protocol for use in Connection Rules
 */
export enum Protocol {
  All = '-1',
  Tcp = 'tcp',
  Udp = 'udp',
  Icmp = 'icmp',
  Icmpv6 = '58',
}

/**
 * A single TCP port
 */
export class TcpPort implements IPortRange {
  public readonly canInlineRule = !Token.unresolved(this.port);

  constructor(private readonly port: number) {
  }

  public toRuleJSON(): any {
    return {
      ipProtocol: Protocol.Tcp,
      fromPort: this.port,
      toPort: this.port
    };
  }

  public toString() {
    return Token.unresolved(this.port) ? `{IndirectPort}` : this.port.toString();
  }
}

/**
 * A TCP port range
 */
export class TcpPortRange implements IPortRange {
  public readonly canInlineRule = !Token.unresolved(this.startPort) && !Token.unresolved(this.endPort);

  constructor(private readonly startPort: number, private readonly endPort: number) {
  }

  public toRuleJSON(): any {
    return {
      ipProtocol: Protocol.Tcp,
      fromPort: this.startPort,
      toPort: this.endPort
    };
  }

  public toString() {
    return `${this.startPort}-${this.endPort}`;
  }
}

/**
 * All TCP Ports
 */
export class TcpAllPorts implements IPortRange {
  public readonly canInlineRule = true;

  public toRuleJSON(): any {
    return {
      ipProtocol: Protocol.Tcp,
      fromPort: 0,
      toPort: 65535
    };
  }

  public toString() {
    return 'ALL PORTS';
  }
}

/**
 * A single UDP port
 */
export class UdpPort implements IPortRange {
  public readonly canInlineRule = !Token.unresolved(this.port);

  constructor(private readonly port: number) {
  }

  public toRuleJSON(): any {
    return {
      ipProtocol: Protocol.Udp,
      fromPort: this.port,
      toPort: this.port
    };
  }

  public toString() {
    const port = Token.unresolved(this.port) ? '{IndirectPort}' : this.port;
    return `UDP ${port}`;
  }
}

/**
 * A UDP port range
 */
export class UdpPortRange implements IPortRange {
  public readonly canInlineRule = !Token.unresolved(this.startPort) && !Token.unresolved(this.endPort);

  constructor(private readonly startPort: number, private readonly endPort: number) {
  }

  public toRuleJSON(): any {
    return {
      ipProtocol: Protocol.Udp,
      fromPort: this.startPort,
      toPort: this.endPort
    };
  }

  public toString() {
    return `UDP ${this.startPort}-${this.endPort}`;
  }
}

/**
 * All UDP Ports
 */
export class UdpAllPorts implements IPortRange {
  public readonly canInlineRule = true;

  public toRuleJSON(): any {
    return {
      ipProtocol: Protocol.Udp,
      fromPort: 0,
      toPort: 65535
    };
  }

  public toString() {
    return 'UDP ALL PORTS';
  }
}

/**
 * A set of matching ICMP Type & Code
 */
export class IcmpTypeAndCode implements IPortRange {
  public readonly canInlineRule = !Token.unresolved(this.type) && !Token.unresolved(this.code);

  constructor(private readonly type: number, private readonly code: number) {
  }

  public toRuleJSON(): any {
    return {
      ipProtocol: Protocol.Icmp,
      fromPort: this.type,
      toPort: this.code
    };
  }

  public toString() {
    return `ICMP Type ${this.type} Code ${this.code}`;
  }
}

/**
 * ICMP Ping traffic
 */
export class IcmpPing implements IPortRange {
  public readonly canInlineRule = true;

  public toRuleJSON(): any {
    return {
      ipProtocol: Protocol.Icmp,
      fromPort: 8,
      toPort: -1
    };
  }

  public toString() {
    return `ICMP PING`;
  }
}

/**
 * All ICMP Codes for a given ICMP Type
 */
export class IcmpAllTypeCodes implements IPortRange {
  public readonly canInlineRule = !Token.unresolved(this.type);

  constructor(private readonly type: number) {
  }

  public toRuleJSON(): any {
    return {
      ipProtocol: Protocol.Icmp,
      fromPort: this.type,
      toPort: -1
    };
  }

  public toString() {
    return `ICMP Type ${this.type}`;
  }
}

/**
 * All ICMP Types & Codes
 */
export class IcmpAllTypesAndCodes implements IPortRange {
  public readonly canInlineRule = true;

  public toRuleJSON(): any {
    return {
      ipProtocol: Protocol.Icmp,
      fromPort: -1,
      toPort: -1
    };
  }

  public toString() {
    return 'ALL ICMP';
  }
}

/**
 * All Traffic
 */
export class AllTraffic implements IPortRange {
  public readonly canInlineRule = true;

  public toRuleJSON(): any {
    return {
      ipProtocol: '-1',
    };
  }

  public toString() {
    return 'ALL TRAFFIC';
  }
}
