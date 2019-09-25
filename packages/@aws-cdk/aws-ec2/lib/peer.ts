import { Token } from "@aws-cdk/core";
import { Connections, IConnectable } from "./connections";

/**
 * Interface for classes that provide the peer-specification parts of a security group rule
 */
export interface IPeer extends IConnectable {
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
  toIngressRuleConfig(): any;

  /**
   * Produce the egress rule JSON for the given connection
   */
  toEgressRuleConfig(): any;
}

/**
 * Factories for static connection peer
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

  /**
   * Create an IPv6 peer from a CIDR
   */
  public static ipv6(cidrIp: string): IPeer {
    return new CidrIPv6(cidrIp);
  }

  /**
   * Any IPv6 address
   */
  public static anyIpv6(): IPeer {
    return new AnyIPv6();
  }

  /**
   * A prefix list
   */
  public static prefixList(prefixListId: string): IPeer {
    return new PrefixList(prefixListId);
  }

  protected constructor() {
  }
}

/**
 * A connection to and from a given IP range
 */
class CidrIPv4 implements IPeer {
  public readonly canInlineRule = true;
  public readonly connections: Connections = new Connections({ peer: this });
  public readonly uniqueId: string;

  constructor(private readonly cidrIp: string) {
    if (!Token.isUnresolved(cidrIp)) {
      const cidrMatch = cidrIp.match(CIDR_VALIDATION_REGEXES.ipv4);

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
  public toIngressRuleConfig(): any {
    return { cidrIp: this.cidrIp };
  }
  /**
   * Produce the egress rule JSON for the given connection
   */
  public toEgressRuleConfig(): any {
    return { cidrIp: this.cidrIp };
  }
}

/**
 * Any IPv4 address
 */
class AnyIPv4 extends CidrIPv4 {
  constructor() {
    super("0.0.0.0/0");
  }
}

/**
 * A connection to a from a given IPv6 range
 */
class CidrIPv6 implements IPeer {
  public readonly canInlineRule = true;
  public readonly connections: Connections = new Connections({ peer: this });
  public readonly uniqueId: string;

  constructor(private readonly cidrIpv6: string) {
    if (!Token.isUnresolved(cidrIpv6)) {
      const cidrMatch = cidrIpv6.match(CIDR_VALIDATION_REGEXES.ipv6);

      if (!cidrMatch) {
        throw new Error(`Invalid IPv6 CIDR: "${cidrIpv6}"`);
      }

      if (!cidrMatch[3]) {
        throw new Error(`CIDR mask is missing in IPv6: "${cidrIpv6}". Did you mean "${cidrIpv6}/128"?`);
      }
    }

    this.uniqueId = cidrIpv6;
  }

  /**
   * Produce the ingress rule JSON for the given connection
   */
  public toIngressRuleConfig(): any {
    return { cidrIpv6: this.cidrIpv6 };
  }
  /**
   * Produce the egress rule JSON for the given connection
   */
  public toEgressRuleConfig(): any {
    return { cidrIpv6: this.cidrIpv6 };
  }
}

/**
 * Any IPv6 address
 */
class AnyIPv6 extends CidrIPv6 {
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
class PrefixList implements IPeer {
  public readonly canInlineRule = false;
  public readonly connections: Connections = new Connections({ peer: this });
  public readonly uniqueId: string;

  constructor(private readonly prefixListId: string) {
    this.uniqueId = prefixListId;
  }

  public toIngressRuleConfig(): any {
    return { sourcePrefixListId: this.prefixListId };
  }

  public toEgressRuleConfig(): any {
    return { destinationPrefixListId: this.prefixListId };
  }
}

export const CIDR_VALIDATION_REGEXES = {
  ipv4: /^(\d{1,3}\.){3}\d{1,3}(\/\d+)?$/,
  ipv6: /^([\da-f]{0,4}:){2,7}([\da-f]{0,4})?(\/\d+)?$/,
};
