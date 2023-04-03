/**
 * Either an IPv4 or an IPv6 CIDR
 *
 *
 */
export declare abstract class AclCidr {
    /**
     * An IP network range in CIDR notation (for example, 172.16.0.0/24).
     */
    static ipv4(ipv4Cidr: string): AclCidr;
    /**
     * The CIDR containing all IPv4 addresses (i.e., 0.0.0.0/0)
     */
    static anyIpv4(): AclCidr;
    /**
     * An IPv6 network range in CIDR notation (for example, 2001:db8::/48)
     */
    static ipv6(ipv6Cidr: string): AclCidr;
    /**
     * The CIDR containing all IPv6 addresses (i.e., ::/0)
     */
    static anyIpv6(): AclCidr;
    abstract toCidrConfig(): AclCidrConfig;
}
/**
 * Acl Configuration for CIDR
 *
 *
 */
export interface AclCidrConfig {
    /**
     * Ipv4 CIDR
     */
    readonly cidrBlock?: string;
    /**
     * Ipv6 CIDR
     */
    readonly ipv6CidrBlock?: string;
}
/**
 * The traffic that is configured using a Network ACL entry
 *
 *
 */
export declare abstract class AclTraffic {
    /**
     * Apply the ACL entry to all traffic
     */
    static allTraffic(): AclTraffic;
    /**
     * Apply the ACL entry to ICMP traffic of given type and code
     */
    static icmp(props: AclIcmp): AclTraffic;
    /**
     * Apply the ACL entry to ICMPv6 traffic of given type and code
     *
     * Requires an IPv6 CIDR block.
     */
    static icmpv6(props: AclIcmp): AclTraffic;
    /**
     * Apply the ACL entry to TCP traffic on a given port
     */
    static tcpPort(port: number): AclTraffic;
    /**
     * Apply the ACL entry to TCP traffic on a given port range
     */
    static tcpPortRange(startPort: number, endPort: number): AclTraffic;
    /**
     * Apply the ACL entry to UDP traffic on a given port
     */
    static udpPort(port: number): AclTraffic;
    /**
     * Apply the ACL entry to UDP traffic on a given port range
     */
    static udpPortRange(startPort: number, endPort: number): AclTraffic;
    abstract toTrafficConfig(): AclTrafficConfig;
}
/**
 * Acl Configuration for traffic
 *
 *
 */
export interface AclTrafficConfig {
    /**
     * The Internet Control Message Protocol (ICMP) code and type.
     *
     * @default - Required if specifying 1 (ICMP) for the protocol parameter.
     */
    readonly icmp?: AclIcmp;
    /**
     * The range of port numbers for the UDP/TCP protocol.
     *
     * @default - Required if specifying 6 (TCP) or 17 (UDP) for the protocol parameter
     */
    readonly portRange?: AclPortRange;
    /**
     * The protocol number.
     *
     * A value of "-1" means all protocols.
     *
     * If you specify "-1" or a protocol number other than "6" (TCP), "17" (UDP),
     * or "1" (ICMP), traffic on all ports is allowed, regardless of any ports or
     * ICMP types or codes that you specify.
     *
     * If you specify protocol "58" (ICMPv6) and specify an IPv4 CIDR
     * block, traffic for all ICMP types and codes allowed, regardless of any that
     * you specify. If you specify protocol "58" (ICMPv6) and specify an IPv6 CIDR
     * block, you must specify an ICMP type and code.
     *
     * @default 17
     */
    readonly protocol: number;
}
/**
 * Properties to create Icmp
 *
 *
 */
export interface AclIcmp {
    /**
     * The Internet Control Message Protocol (ICMP) type. You can use -1 to specify all ICMP types.
     * Conditional requirement: Required if you specify 1 (ICMP) for the CreateNetworkAclEntry protocol parameter.
     */
    readonly type?: number;
    /**
     * The Internet Control Message Protocol (ICMP) code. You can use -1 to specify all ICMP
     * codes for the given ICMP type. Requirement is conditional: Required if you
     * specify 1 (ICMP) for the protocol parameter.
     */
    readonly code?: number;
}
/**
 * Properties to create PortRange
 *
 *
 */
export interface AclPortRange {
    /**
     * The first port in the range. Required if you specify 6 (TCP) or 17 (UDP) for the protocol parameter.
     */
    readonly from?: number;
    /**
     * The last port in the range. Required if you specify 6 (TCP) or 17 (UDP) for the protocol parameter.
     */
    readonly to?: number;
}
