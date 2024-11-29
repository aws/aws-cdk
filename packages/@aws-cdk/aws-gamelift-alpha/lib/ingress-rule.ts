import * as cdk from 'aws-cdk-lib/core';

/**
 * Protocol for use in Connection Rules
 *
 * https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml
 */
export enum Protocol {
  TCP = 'TCP',
  UDP = 'UDP',
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
   * A starting value for a range of allowed port numbers.
   *
   * For fleets using Windows and Linux builds, only ports 1026-60000 are valid.
   */
  readonly fromPort: number;

  /**
   * An ending value for a range of allowed port numbers. Port numbers are end-inclusive.
   * This value must be higher than `fromPort`.
   *
   * For fleets using Windows and Linux builds, only ports 1026-60000 are valid.
   *
   * @default the `fromPort` value
   */
  readonly toPort?: number;
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
    });
  }

  /**
   * Any TCP traffic
   */
  public static allTcp() {
    return new Port({
      protocol: Protocol.TCP,
      fromPort: 1026,
      toPort: 60000,
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
    });
  }

  /**
   * Any UDP traffic
   */
  public static allUdp() {
    return new Port({
      protocol: Protocol.UDP,
      fromPort: 1026,
      toPort: 60000,
    });
  }

  constructor(private readonly props: PortProps) {}

  /**
   * Produce the ingress rule JSON for the given connection
   */
  public toJson(): any {
    return {
      protocol: this.props.protocol,
      fromPort: this.props.fromPort,
      toPort: this.props.toPort,
    };
  }
}

/**
 * Interface for classes that provide the peer-specification parts of an inbound permission
 */
export interface IPeer {

  /**
   * A unique identifier for this connection peer
   */
  readonly uniqueId: string;

  /**
   * Produce the ingress rule JSON for the given connection
   */
  toJson(): any;
}

/**
   * Peer object factories
   *
   * The static methods on this object can be used to create peer objects
   * which represent a connection partner in inbound permission rules.
   *
   * Use this object if you need to represent connection partners using plain IP addresses.
   */
export class Peer {
  /**
   * Create an IPv4 peer from a CIDR
   */
  public static ipv4(cidrIp: string): IPeer {
    return new CidrIPv4(cidrIp);
  }

  /**
   * Any IPv4 address
   */
  public static anyIpv4(): IPeer {
    return new AnyIPv4();
  }

  protected constructor() {
  }
}

/**
   * A connection to and from a given IP range
   */
class CidrIPv4 implements IPeer {
  public readonly canInlineRule = true;
  public readonly uniqueId: string;

  constructor(private readonly cidrIp: string) {
    if (!cdk.Token.isUnresolved(cidrIp)) {
      const cidrMatch = cidrIp.match(/^(\d{1,3}\.){3}\d{1,3}(\/\d+)?$/);

      if (!cidrMatch) {
        throw new Error(`Invalid IPv4 CIDR: "${cidrIp}"`);
      }

      if (!cidrMatch[2]) {
        throw new Error(`CIDR mask is missing in IPv4: "${cidrIp}". Did you mean "${cidrIp}/32"?`);
      }
    }

    this.uniqueId = cidrIp;
  }

  /**
   * Produce the ingress rule JSON for the given connection
   */
  public toJson(): any {
    return { ipRange: this.cidrIp };
  }
}

/**
   * Any IPv4 address
   */
class AnyIPv4 extends CidrIPv4 {
  constructor() {
    super('0.0.0.0/0');
  }
}

/**
 * A range of IP addresses and port settings that allow inbound traffic to connect to server processes on an instance in a fleet.
 * New game sessions are assigned an IP address/port number combination, which must fall into the fleet's allowed ranges.
 *
 * Fleets with custom game builds must have permissions explicitly set.
 * For Realtime Servers fleets, GameLift automatically opens two port ranges, one for TCP messaging and one for UDP.
 */
export interface IngressRule {
  /**
   * The port range used for ingress traffic
   */
  readonly port: Port;

  /**
   * A range of allowed IP addresses .
   */
  readonly source: IPeer;
}
