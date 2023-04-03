import { IResource, Resource, ResourceProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Connections } from './connections';
import { IPeer } from './peer';
import { Port } from './port';
import { IVpc } from './vpc';
/**
 * Interface for security group-like objects
 */
export interface ISecurityGroup extends IResource, IPeer {
    /**
     * ID for the current security group
     * @attribute
     */
    readonly securityGroupId: string;
    /**
     * Whether the SecurityGroup has been configured to allow all outbound traffic
     */
    readonly allowAllOutbound: boolean;
    /**
     * Add an ingress rule for the current security group
     *
     * `remoteRule` controls where the Rule object is created if the peer is also a
     * securityGroup and they are in different stack. If false (default) the
     * rule object is created under the current SecurityGroup object. If true and the
     * peer is also a SecurityGroup, the rule object is created under the remote
     * SecurityGroup object.
     */
    addIngressRule(peer: IPeer, connection: Port, description?: string, remoteRule?: boolean): void;
    /**
     * Add an egress rule for the current security group
     *
     * `remoteRule` controls where the Rule object is created if the peer is also a
     * securityGroup and they are in different stack. If false (default) the
     * rule object is created under the current SecurityGroup object. If true and the
     * peer is also a SecurityGroup, the rule object is created under the remote
     * SecurityGroup object.
     */
    addEgressRule(peer: IPeer, connection: Port, description?: string, remoteRule?: boolean): void;
}
/**
 * A SecurityGroup that is not created in this template
 */
declare abstract class SecurityGroupBase extends Resource implements ISecurityGroup {
    /**
     * Return whether the indicated object is a security group
     */
    static isSecurityGroup(x: any): x is SecurityGroupBase;
    abstract readonly securityGroupId: string;
    abstract readonly allowAllOutbound: boolean;
    abstract readonly allowAllIpv6Outbound: boolean;
    readonly canInlineRule = false;
    readonly connections: Connections;
    readonly defaultPort?: Port;
    private peerAsTokenCount;
    constructor(scope: Construct, id: string, props?: ResourceProps);
    get uniqueId(): string;
    addIngressRule(peer: IPeer, connection: Port, description?: string, remoteRule?: boolean): void;
    addEgressRule(peer: IPeer, connection: Port, description?: string, remoteRule?: boolean): void;
    toIngressRuleConfig(): any;
    toEgressRuleConfig(): any;
    /**
     * Determine where to parent a new ingress/egress rule
     *
     * A SecurityGroup rule is parented under the group it's related to, UNLESS
     * we're in a cross-stack scenario with another Security Group. In that case,
     * we respect the 'remoteRule' flag and will parent under the other security
     * group.
     *
     * This is necessary to avoid cyclic dependencies between stacks, since both
     * ingress and egress rules will reference both security groups, and a naive
     * parenting will lead to the following situation:
     *
     *   ╔════════════════════╗         ╔════════════════════╗
     *   ║  ┌───────────┐     ║         ║    ┌───────────┐   ║
     *   ║  │  GroupA   │◀────╬─┐   ┌───╬───▶│  GroupB   │   ║
     *   ║  └───────────┘     ║ │   │   ║    └───────────┘   ║
     *   ║        ▲           ║ │   │   ║          ▲         ║
     *   ║        │           ║ │   │   ║          │         ║
     *   ║        │           ║ │   │   ║          │         ║
     *   ║  ┌───────────┐     ║ └───┼───╬────┌───────────┐   ║
     *   ║  │  EgressA  │─────╬─────┘   ║    │ IngressB  │   ║
     *   ║  └───────────┘     ║         ║    └───────────┘   ║
     *   ║                    ║         ║                    ║
     *   ╚════════════════════╝         ╚════════════════════╝
     *
     * By having the ability to switch the parent, we avoid the cyclic reference by
     * keeping all rules in a single stack.
     *
     * If this happens, we also have to change the construct ID, because
     * otherwise we might have two objects with the same ID if we have
     * multiple reversed security group relationships.
     *
     *   ╔═══════════════════════════════════╗
     *   ║┌───────────┐                      ║
     *   ║│  GroupB   │                      ║
     *   ║└───────────┘                      ║
     *   ║      ▲                            ║
     *   ║      │              ┌───────────┐ ║
     *   ║      ├────"from A"──│ IngressB  │ ║
     *   ║      │              └───────────┘ ║
     *   ║      │              ┌───────────┐ ║
     *   ║      ├─────"to B"───│  EgressA  │ ║
     *   ║      │              └───────────┘ ║
     *   ║      │              ┌───────────┐ ║
     *   ║      └─────"to B"───│  EgressC  │ ║  <-- oops
     *   ║                     └───────────┘ ║
     *   ╚═══════════════════════════════════╝
     */
    protected determineRuleScope(peer: IPeer, connection: Port, fromTo: 'from' | 'to', remoteRule?: boolean): RuleScope;
    private renderPeer;
}
/**
 * The scope and id in which a given SecurityGroup rule should be defined.
 */
export interface RuleScope {
    /**
     * The SecurityGroup in which a rule should be scoped.
     */
    readonly scope: ISecurityGroup;
    /**
     * The construct ID to use for the rule.
     */
    readonly id: string;
}
export interface SecurityGroupProps {
    /**
     * The name of the security group. For valid values, see the GroupName
     * parameter of the CreateSecurityGroup action in the Amazon EC2 API
     * Reference.
     *
     * It is not recommended to use an explicit group name.
     *
     * @default If you don't specify a GroupName, AWS CloudFormation generates a
     * unique physical ID and uses that ID for the group name.
     */
    readonly securityGroupName?: string;
    /**
     * A description of the security group.
     *
     * @default The default name will be the construct's CDK path.
     */
    readonly description?: string;
    /**
     * The VPC in which to create the security group.
     */
    readonly vpc: IVpc;
    /**
     * Whether to allow all outbound traffic by default.
     *
     * If this is set to true, there will only be a single egress rule which allows all
     * outbound traffic. If this is set to false, no outbound traffic will be allowed by
     * default and all egress traffic must be explicitly authorized.
     *
     * To allow all ipv6 traffic use allowAllIpv6Outbound
     *
     * @default true
     */
    readonly allowAllOutbound?: boolean;
    /**
     * Whether to allow all outbound ipv6 traffic by default.
     *
     * If this is set to true, there will only be a single egress rule which allows all
     * outbound ipv6 traffic. If this is set to false, no outbound traffic will be allowed by
     * default and all egress ipv6 traffic must be explicitly authorized.
     *
     * To allow all ipv4 traffic use allowAllOutbound
     *
     * @default false
     */
    readonly allowAllIpv6Outbound?: boolean;
    /**
     * Whether to disable inline ingress and egress rule optimization.
     *
     * If this is set to true, ingress and egress rules will not be declared under the
     * SecurityGroup in cloudformation, but will be separate elements.
     *
     * Inlining rules is an optimization for producing smaller stack templates. Sometimes
     * this is not desirable, for example when security group access is managed via tags.
     *
     * The default value can be overriden globally by setting the context variable
     * '@aws-cdk/aws-ec2.securityGroupDisableInlineRules'.
     *
     * @default false
     */
    readonly disableInlineRules?: boolean;
}
/**
 * Additional options for imported security groups
 */
export interface SecurityGroupImportOptions {
    /**
     * Mark the SecurityGroup as having been created allowing all outbound traffic
     *
     * Only if this is set to false will egress rules be added to this security
     * group. Be aware, this would undo any potential "all outbound traffic"
     * default.
     *
     *
     * @default true
     */
    readonly allowAllOutbound?: boolean;
    /**
     * Mark the SecurityGroup as having been created allowing all outbound ipv6 traffic
     *
     * Only if this is set to false will egress rules for ipv6 be added to this security
     * group. Be aware, this would undo any potential "all outbound traffic"
     * default.
     *
     * @default false
     */
    readonly allowAllIpv6Outbound?: boolean;
    /**
     * If a SecurityGroup is mutable CDK can add rules to existing groups
     *
     * Beware that making a SecurityGroup immutable might lead to issue
     * due to missing ingress/egress rules for new resources.
     *
     *
     * @default true
     */
    readonly mutable?: boolean;
}
/**
 * Creates an Amazon EC2 security group within a VPC.
 *
 * Security Groups act like a firewall with a set of rules, and are associated
 * with any AWS resource that has or creates Elastic Network Interfaces (ENIs).
 * A typical example of a resource that has a security group is an Instance (or
 * Auto Scaling Group of instances)
 *
 * If you are defining new infrastructure in CDK, there is a good chance you
 * won't have to interact with this class at all. Like IAM Roles, Security
 * Groups need to exist to control access between AWS resources, but CDK will
 * automatically generate and populate them with least-privilege permissions
 * for you so you can concentrate on your business logic.
 *
 * All Constructs that require Security Groups will create one for you if you
 * don't specify one at construction. After construction, you can selectively
 * allow connections to and between constructs via--for example-- the `instance.connections`
 * object. Think of it as "allowing connections to your instance", rather than
 * "adding ingress rules a security group". See the [Allowing
 * Connections](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-ec2-readme.html#allowing-connections)
 * section in the library documentation for examples.
 *
 * Direct manipulation of the Security Group through `addIngressRule` and
 * `addEgressRule` is possible, but mutation through the `.connections` object
 * is recommended. If you peer two constructs with security groups this way,
 * appropriate rules will be created in both.
 *
 * If you have an existing security group you want to use in your CDK application,
 * you would import it like this:
 *
 * ```ts
 * const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'SG', 'sg-12345', {
 *   mutable: false
 * });
 * ```
 */
export declare class SecurityGroup extends SecurityGroupBase {
    /**
     * Look up a security group by id.
     *
     * @deprecated Use `fromLookupById()` instead
     */
    static fromLookup(scope: Construct, id: string, securityGroupId: string): ISecurityGroup;
    /**
     * Look up a security group by id.
     */
    static fromLookupById(scope: Construct, id: string, securityGroupId: string): ISecurityGroup;
    /**
     * Look up a security group by name.
     */
    static fromLookupByName(scope: Construct, id: string, securityGroupName: string, vpc: IVpc): ISecurityGroup;
    /**
     * Import an existing security group into this app.
     *
     * This method will assume that the Security Group has a rule in it which allows
     * all outbound traffic, and so will not add egress rules to the imported Security
     * Group (only ingress rules).
     *
     * If your existing Security Group needs to have egress rules added, pass the
     * `allowAllOutbound: false` option on import.
     */
    static fromSecurityGroupId(scope: Construct, id: string, securityGroupId: string, options?: SecurityGroupImportOptions): ISecurityGroup;
    /**
     * Look up a security group.
     */
    private static fromLookupAttributes;
    /**
     * An attribute that represents the security group name.
     *
     * @attribute
     * @deprecated returns the security group ID, rather than the name.
     */
    readonly securityGroupName: string;
    /**
     * The ID of the security group
     *
     * @attribute
     */
    readonly securityGroupId: string;
    /**
     * The VPC ID this security group is part of.
     *
     * @attribute
     */
    readonly securityGroupVpcId: string;
    /**
     * Whether the SecurityGroup has been configured to allow all outbound traffic
     */
    readonly allowAllOutbound: boolean;
    /**
     * Whether the SecurityGroup has been configured to allow all outbound ipv6 traffic
     */
    readonly allowAllIpv6Outbound: boolean;
    private readonly securityGroup;
    private readonly directIngressRules;
    private readonly directEgressRules;
    /**
     * Whether to disable optimization for inline security group rules.
     */
    private readonly disableInlineRules;
    constructor(scope: Construct, id: string, props: SecurityGroupProps);
    addIngressRule(peer: IPeer, connection: Port, description?: string, remoteRule?: boolean): void;
    addEgressRule(peer: IPeer, connection: Port, description?: string, remoteRule?: boolean): void;
    /**
     * Add a direct ingress rule
     */
    private addDirectIngressRule;
    /**
     * Return whether the given ingress rule exists on the group
     */
    private hasIngressRule;
    /**
     * Add a direct egress rule
     */
    private addDirectEgressRule;
    /**
     * Return whether the given egress rule exists on the group
     */
    private hasEgressRule;
    /**
     * Add the default egress rule to the securityGroup
     *
     * This depends on allowAllOutbound:
     *
     * - If allowAllOutbound is true, we *TECHNICALLY* don't need to do anything, because
     *   EC2 is going to create this default rule anyway. But, for maximum readability
     *   of the template, we will add one anyway.
     * - If allowAllOutbound is false, we add a bogus rule that matches no traffic in
     *   order to get rid of the default "all outbound" rule that EC2 creates by default.
     *   If other rules happen to get added later, we remove the bogus rule again so
     *   that it doesn't clutter up the template too much (even though that's not
     *   strictly necessary).
     */
    private addDefaultEgressRule;
    /**
     * Add a allow all ipv6 egress rule to the securityGroup
     *
     * This depends on allowAllIpv6Outbound:
     *
     * - If allowAllIpv6Outbound is true, we will add an allow all rule.
     * - If allowAllOutbound is false, we don't do anything since EC2 does not add
     *   a default allow all ipv6 rule.
     */
    private addDefaultIpv6EgressRule;
    /**
     * Remove the bogus rule if it exists
     */
    private removeNoTrafficRule;
}
export interface ConnectionRule {
    /**
     * The IP protocol name (tcp, udp, icmp) or number (see Protocol Numbers).
     * Use -1 to specify all protocols. If you specify -1, or a protocol number
     * other than tcp, udp, icmp, or 58 (ICMPv6), traffic on all ports is
     * allowed, regardless of any ports you specify. For tcp, udp, and icmp, you
     * must specify a port range. For protocol 58 (ICMPv6), you can optionally
     * specify a port range; if you don't, traffic for all types and codes is
     * allowed.
     *
     * @default tcp
     */
    readonly protocol?: string;
    /**
     * Start of port range for the TCP and UDP protocols, or an ICMP type number.
     *
     * If you specify icmp for the IpProtocol property, you can specify
     * -1 as a wildcard (i.e., any ICMP type number).
     */
    readonly fromPort: number;
    /**
     * End of port range for the TCP and UDP protocols, or an ICMP code.
     *
     * If you specify icmp for the IpProtocol property, you can specify -1 as a
     * wildcard (i.e., any ICMP code).
     *
     * @default If toPort is not specified, it will be the same as fromPort.
     */
    readonly toPort?: number;
    /**
     * Description of this connection. It is applied to both the ingress rule
     * and the egress rule.
     *
     * @default No description
     */
    readonly description?: string;
}
export {};
