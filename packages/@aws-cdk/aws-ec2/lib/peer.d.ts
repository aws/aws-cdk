import { IConnectable } from './connections';
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
 * Peer object factories (to be used in Security Group management)
 *
 * The static methods on this object can be used to create peer objects
 * which represent a connection partner in Security Group rules.
 *
 * Use this object if you need to represent connection partners using plain IP
 * addresses, or a prefix list ID.
 *
 * If you want to address a connection partner by Security Group, you can just
 * use the Security Group (or the construct that contains a Security Group)
 * directly, as it already implements `IPeer`.
 */
export declare class Peer {
    /**
     * Create an IPv4 peer from a CIDR
     */
    static ipv4(cidrIp: string): IPeer;
    /**
     * Any IPv4 address
     */
    static anyIpv4(): IPeer;
    /**
     * Create an IPv6 peer from a CIDR
     */
    static ipv6(cidrIp: string): IPeer;
    /**
     * Any IPv6 address
     */
    static anyIpv6(): IPeer;
    /**
     * A prefix list
     */
    static prefixList(prefixListId: string): IPeer;
    /**
     * A security group ID
     */
    static securityGroupId(securityGroupId: string, sourceSecurityGroupOwnerId?: string): IPeer;
    protected constructor();
}
