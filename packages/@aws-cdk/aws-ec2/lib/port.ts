import { Token } from '@aws-cdk/core';

/**
 * Protocol for use in Connection Rules
 */
export enum Protocol {
  ALL = '-1',
  TCP = 'tcp',
  UDP = 'udp',
  ICMP = 'icmp',
  ICMPV6 = '58',
  ESP = 'esp',
  AH = 'ah',
}

/**
 * Properties to create a port range
 */
export interface PortProps {
  /**
   * The protocol for the range
   */
  readonly protocol: Protocol;

  /**
   * The starting port for the range
   *
   * @default - Not included in the rule
   */
  readonly fromPort?: number;

  /**
   * The ending port for the range
   *
   * @default - Not included in the rule
   */
  readonly toPort?: number;

  /**
   * String representation for this object
   */
  readonly stringRepresentation: string;
}

/**
 * Interface for classes that provide the connection-specification parts of a security group rule
 */
export class Port {
  /**
   * A single TCP port
   */
  public static tcp(port: number): Port {
    return new Port({
      protocol: Protocol.TCP,
      fromPort: port,
      toPort: port,
      stringRepresentation: renderPort(port),
    });
  }

  /**
   * A TCP port range
   */
  public static tcpRange(startPort: number, endPort: number) {
    return new Port({
      protocol: Protocol.TCP,
      fromPort: startPort,
      toPort: endPort,
      stringRepresentation: `${renderPort(startPort)}-${renderPort(endPort)}`,
    });
  }

  /**
   * Any TCP traffic
   */
  public static allTcp() {
    return new Port({
      protocol: Protocol.TCP,
      fromPort: 0,
      toPort: 65535,
      stringRepresentation: 'ALL PORTS',
    });
  }

  /**
   * A single UDP port
   */
  public static udp(port: number): Port {
    return new Port({
      protocol: Protocol.UDP,
      fromPort: port,
      toPort: port,
      stringRepresentation: `UDP ${renderPort(port)}`,
    });
  }

  /**
   * A UDP port range
   */
  public static udpRange(startPort: number, endPort: number) {
    return new Port({
      protocol: Protocol.UDP,
      fromPort: startPort,
      toPort: endPort,
      stringRepresentation: `UDP ${renderPort(startPort)}-${renderPort(endPort)}`,
    });
  }

  /**
   * Any UDP traffic
   */
  public static allUdp() {
    return new Port({
      protocol: Protocol.UDP,
      fromPort: 0,
      toPort: 65535,
      stringRepresentation: 'UDP ALL PORTS',
    });
  }

  /**
   * A specific combination of ICMP type and code
   *
   * @see https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml
   */
  public static icmpTypeAndCode(type: number, code: number) {
    return new Port({
      protocol: Protocol.ICMP,
      fromPort: type,
      toPort: code,
      stringRepresentation: `ICMP Type ${type} Code ${code}`,
    });
  }

  /**
   * All codes for a single ICMP type
   */
  public static icmpType(type: number): Port {
    return new Port({
      protocol: Protocol.ICMP,
      fromPort: type,
      toPort: -1,
      stringRepresentation: `ICMP Type ${type}`,
    });
  }

  /**
   * ICMP ping (echo) traffic
   */
  public static icmpPing() {
    return Port.icmpType(8);
  }

  /**
   * All ICMP traffic
   */
  public static allIcmp() {
    return new Port({
      protocol: Protocol.ICMP,
      fromPort: -1,
      toPort: -1,
      stringRepresentation: 'ALL ICMP',
    });
  }

  /**
   * All traffic
   */
  public static allTraffic() {
    return new Port({
      protocol: Protocol.ALL,
      stringRepresentation: 'ALL TRAFFIC',
    });
  }

  /**
   * A single ESP port
   */
  public static esp(): Port {
    return new Port({
      protocol: Protocol.ESP,
      fromPort: 50,
      toPort: 50,
      stringRepresentation: 'ESP 50',
    });
  }

  /**
   * A single AH port
   */
  public static ah(): Port {
    return new Port({
      protocol: Protocol.AH,
      fromPort: 51,
      toPort: 51,
      stringRepresentation: 'AH 51',
    });
  }

  /**
   * Whether the rule containing this port range can be inlined into a securitygroup or not.
   */
  public readonly canInlineRule: boolean;

  constructor(private readonly props: PortProps) {
    this.canInlineRule = !Token.isUnresolved(props.fromPort) && !Token.isUnresolved(props.toPort);
  }

  /**
   * Produce the ingress/egress rule JSON for the given connection
   */
  public toRuleJson(): any {
    return {
      ipProtocol: this.props.protocol,
      fromPort: this.props.fromPort,
      toPort: this.props.toPort,
    };
  }

  public toString(): string {
    return this.props.stringRepresentation;
  }
}

function renderPort(port: number) {
  return Token.isUnresolved(port) ? '{IndirectPort}' : port.toString();
}
