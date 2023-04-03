"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityGroup = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const connections_1 = require("./connections");
const ec2_generated_1 = require("./ec2.generated");
const peer_1 = require("./peer");
const port_1 = require("./port");
const SECURITY_GROUP_SYMBOL = Symbol.for('@aws-cdk/iam.SecurityGroup');
const SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY = '@aws-cdk/aws-ec2.securityGroupDisableInlineRules';
/**
 * A SecurityGroup that is not created in this template
 */
class SecurityGroupBase extends core_1.Resource {
    /**
     * Return whether the indicated object is a security group
     */
    static isSecurityGroup(x) {
        return SECURITY_GROUP_SYMBOL in x;
    }
    constructor(scope, id, props) {
        super(scope, id, props);
        this.canInlineRule = false;
        this.connections = new connections_1.Connections({ securityGroups: [this] });
        this.peerAsTokenCount = 0;
        Object.defineProperty(this, SECURITY_GROUP_SYMBOL, { value: true });
    }
    get uniqueId() {
        return core_1.Names.nodeUniqueId(this.node);
    }
    addIngressRule(peer, connection, description, remoteRule) {
        if (description === undefined) {
            description = `from ${peer.uniqueId}:${connection}`;
        }
        const { scope, id } = this.determineRuleScope(peer, connection, 'from', remoteRule);
        // Skip duplicates
        if (scope.node.tryFindChild(id) === undefined) {
            new ec2_generated_1.CfnSecurityGroupIngress(scope, id, {
                groupId: this.securityGroupId,
                ...peer.toIngressRuleConfig(),
                ...connection.toRuleJson(),
                description,
            });
        }
    }
    addEgressRule(peer, connection, description, remoteRule) {
        if (description === undefined) {
            description = `to ${peer.uniqueId}:${connection}`;
        }
        const { scope, id } = this.determineRuleScope(peer, connection, 'to', remoteRule);
        // Skip duplicates
        if (scope.node.tryFindChild(id) === undefined) {
            new ec2_generated_1.CfnSecurityGroupEgress(scope, id, {
                groupId: this.securityGroupId,
                ...peer.toEgressRuleConfig(),
                ...connection.toRuleJson(),
                description,
            });
        }
    }
    toIngressRuleConfig() {
        return { sourceSecurityGroupId: this.securityGroupId };
    }
    toEgressRuleConfig() {
        return { destinationSecurityGroupId: this.securityGroupId };
    }
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
    determineRuleScope(peer, connection, fromTo, remoteRule) {
        if (remoteRule && SecurityGroupBase.isSecurityGroup(peer) && differentStacks(this, peer)) {
            // Reversed
            const reversedFromTo = fromTo === 'from' ? 'to' : 'from';
            return { scope: peer, id: `${this.uniqueId}:${connection} ${reversedFromTo}` };
        }
        else {
            // Regular (do old ID escaping to in order to not disturb existing deployments)
            return { scope: this, id: `${fromTo} ${this.renderPeer(peer)}:${connection}`.replace('/', '_') };
        }
    }
    renderPeer(peer) {
        if (core_1.Token.isUnresolved(peer.uniqueId)) {
            // Need to return a unique value each time a peer
            // is an unresolved token, else the duplicate skipper
            // in `sg.addXxxRule` can detect unique rules as duplicates
            return this.peerAsTokenCount++ ? `'{IndirectPeer${this.peerAsTokenCount}}'` : '{IndirectPeer}';
        }
        else {
            return peer.uniqueId;
        }
    }
}
function differentStacks(group1, group2) {
    return core_1.Stack.of(group1) !== core_1.Stack.of(group2);
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
class SecurityGroup extends SecurityGroupBase {
    /**
     * Look up a security group by id.
     *
     * @deprecated Use `fromLookupById()` instead
     */
    static fromLookup(scope, id, securityGroupId) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-ec2.SecurityGroup#fromLookup", "Use `fromLookupById()` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLookup);
            }
            throw error;
        }
        return this.fromLookupAttributes(scope, id, { securityGroupId });
    }
    /**
     * Look up a security group by id.
     */
    static fromLookupById(scope, id, securityGroupId) {
        return this.fromLookupAttributes(scope, id, { securityGroupId });
    }
    /**
     * Look up a security group by name.
     */
    static fromLookupByName(scope, id, securityGroupName, vpc) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_IVpc(vpc);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLookupByName);
            }
            throw error;
        }
        return this.fromLookupAttributes(scope, id, { securityGroupName, vpc });
    }
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
    static fromSecurityGroupId(scope, id, securityGroupId, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_SecurityGroupImportOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSecurityGroupId);
            }
            throw error;
        }
        class MutableImport extends SecurityGroupBase {
            constructor() {
                super(...arguments);
                this.securityGroupId = securityGroupId;
                this.allowAllOutbound = options.allowAllOutbound ?? true;
                this.allowAllIpv6Outbound = options.allowAllIpv6Outbound ?? false;
            }
            addEgressRule(peer, connection, description, remoteRule) {
                // Only if allowAllOutbound has been disabled
                if (options.allowAllOutbound === false) {
                    super.addEgressRule(peer, connection, description, remoteRule);
                }
            }
        }
        class ImmutableImport extends SecurityGroupBase {
            constructor() {
                super(...arguments);
                this.securityGroupId = securityGroupId;
                this.allowAllOutbound = options.allowAllOutbound ?? true;
                this.allowAllIpv6Outbound = options.allowAllIpv6Outbound ?? false;
            }
            addEgressRule(_peer, _connection, _description, _remoteRule) {
                // do nothing
            }
            addIngressRule(_peer, _connection, _description, _remoteRule) {
                // do nothing
            }
        }
        return options.mutable !== false
            ? new MutableImport(scope, id)
            : new ImmutableImport(scope, id);
    }
    /**
     * Look up a security group.
     */
    static fromLookupAttributes(scope, id, options) {
        if (core_1.Token.isUnresolved(options.securityGroupId) || core_1.Token.isUnresolved(options.securityGroupName) || core_1.Token.isUnresolved(options.vpc?.vpcId)) {
            throw new Error('All arguments to look up a security group must be concrete (no Tokens)');
        }
        const attributes = core_1.ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.SECURITY_GROUP_PROVIDER,
            props: {
                securityGroupId: options.securityGroupId,
                securityGroupName: options.securityGroupName,
                vpcId: options.vpc?.vpcId,
            },
            dummyValue: {
                securityGroupId: 'sg-12345678',
                allowAllOutbound: true,
            },
        }).value;
        return SecurityGroup.fromSecurityGroupId(scope, id, attributes.securityGroupId, {
            allowAllOutbound: attributes.allowAllOutbound,
            mutable: true,
        });
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.securityGroupName,
        });
        this.directIngressRules = [];
        this.directEgressRules = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_SecurityGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SecurityGroup);
            }
            throw error;
        }
        const groupDescription = props.description || this.node.path;
        this.allowAllOutbound = props.allowAllOutbound !== false;
        this.allowAllIpv6Outbound = props.allowAllIpv6Outbound ?? false;
        this.disableInlineRules = props.disableInlineRules !== undefined ?
            !!props.disableInlineRules :
            !!this.node.tryGetContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY);
        this.securityGroup = new ec2_generated_1.CfnSecurityGroup(this, 'Resource', {
            groupName: this.physicalName,
            groupDescription,
            securityGroupIngress: core_1.Lazy.any({ produce: () => this.directIngressRules }, { omitEmptyArray: true }),
            securityGroupEgress: core_1.Lazy.any({ produce: () => this.directEgressRules }, { omitEmptyArray: true }),
            vpcId: props.vpc.vpcId,
        });
        this.securityGroupId = this.securityGroup.attrGroupId;
        this.securityGroupVpcId = this.securityGroup.attrVpcId;
        this.securityGroupName = this.securityGroup.ref;
        this.addDefaultEgressRule();
        this.addDefaultIpv6EgressRule();
    }
    addIngressRule(peer, connection, description, remoteRule) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_IPeer(peer);
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_Port(connection);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addIngressRule);
            }
            throw error;
        }
        if (!peer.canInlineRule || !connection.canInlineRule || this.disableInlineRules) {
            super.addIngressRule(peer, connection, description, remoteRule);
            return;
        }
        if (description === undefined) {
            description = `from ${peer.uniqueId}:${connection}`;
        }
        this.addDirectIngressRule({
            ...peer.toIngressRuleConfig(),
            ...connection.toRuleJson(),
            description,
        });
    }
    addEgressRule(peer, connection, description, remoteRule) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_IPeer(peer);
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_Port(connection);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addEgressRule);
            }
            throw error;
        }
        const isIpv6 = peer.toEgressRuleConfig().hasOwnProperty('cidrIpv6');
        if (!isIpv6 && this.allowAllOutbound) {
            // In the case of "allowAllOutbound", we don't add any more rules. There
            // is only one rule which allows all traffic and that subsumes any other
            // rule.
            if (!remoteRule) { // Warn only if addEgressRule() was explicitely called
                core_1.Annotations.of(this).addWarning('Ignoring Egress rule since \'allowAllOutbound\' is set to true; To add customized rules, set allowAllOutbound=false on the SecurityGroup');
            }
            return;
        }
        else if (!isIpv6 && !this.allowAllOutbound) {
            // Otherwise, if the bogus rule exists we can now remove it because the
            // presence of any other rule will get rid of EC2's implicit "all
            // outbound" rule anyway.
            this.removeNoTrafficRule();
        }
        if (isIpv6 && this.allowAllIpv6Outbound) {
            // In the case of "allowAllIpv6Outbound", we don't add any more rules. There
            // is only one rule which allows all traffic and that subsumes any other
            // rule.
            if (!remoteRule) { // Warn only if addEgressRule() was explicitely called
                core_1.Annotations.of(this).addWarning('Ignoring Egress rule since \'allowAllIpv6Outbound\' is set to true; To add customized rules, set allowAllIpv6Outbound=false on the SecurityGroup');
            }
            return;
        }
        if (!peer.canInlineRule || !connection.canInlineRule || this.disableInlineRules) {
            super.addEgressRule(peer, connection, description, remoteRule);
            return;
        }
        if (description === undefined) {
            description = `from ${peer.uniqueId}:${connection}`;
        }
        const rule = {
            ...peer.toEgressRuleConfig(),
            ...connection.toRuleJson(),
            description,
        };
        if (isAllTrafficRule(rule)) {
            // We cannot allow this; if someone adds the rule in this way, it will be
            // removed again if they add other rules. We also can't automatically switch
            // to "allOutbound=true" mode, because we might have already emitted
            // EgressRule objects (which count as rules added later) and there's no way
            // to recall those. Better to prevent this for now.
            throw new Error('Cannot add an "all traffic" egress rule in this way; set allowAllOutbound=true (for ipv6) or allowAllIpv6Outbound=true (for ipv6) on the SecurityGroup instead.');
        }
        this.addDirectEgressRule(rule);
    }
    /**
     * Add a direct ingress rule
     */
    addDirectIngressRule(rule) {
        if (!this.hasIngressRule(rule)) {
            this.directIngressRules.push(rule);
        }
    }
    /**
     * Return whether the given ingress rule exists on the group
     */
    hasIngressRule(rule) {
        return this.directIngressRules.findIndex(r => ingressRulesEqual(r, rule)) > -1;
    }
    /**
     * Add a direct egress rule
     */
    addDirectEgressRule(rule) {
        if (!this.hasEgressRule(rule)) {
            this.directEgressRules.push(rule);
        }
    }
    /**
     * Return whether the given egress rule exists on the group
     */
    hasEgressRule(rule) {
        return this.directEgressRules.findIndex(r => egressRulesEqual(r, rule)) > -1;
    }
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
    addDefaultEgressRule() {
        if (this.disableInlineRules) {
            const peer = this.allowAllOutbound ? ALL_TRAFFIC_PEER : NO_TRAFFIC_PEER;
            const port = this.allowAllOutbound ? ALL_TRAFFIC_PORT : NO_TRAFFIC_PORT;
            const description = this.allowAllOutbound ? ALLOW_ALL_RULE.description : MATCH_NO_TRAFFIC.description;
            super.addEgressRule(peer, port, description, false);
        }
        else {
            const rule = this.allowAllOutbound ? ALLOW_ALL_RULE : MATCH_NO_TRAFFIC;
            this.directEgressRules.push(rule);
        }
    }
    /**
     * Add a allow all ipv6 egress rule to the securityGroup
     *
     * This depends on allowAllIpv6Outbound:
     *
     * - If allowAllIpv6Outbound is true, we will add an allow all rule.
     * - If allowAllOutbound is false, we don't do anything since EC2 does not add
     *   a default allow all ipv6 rule.
     */
    addDefaultIpv6EgressRule() {
        const description = 'Allow all outbound ipv6 traffic by default';
        const peer = peer_1.Peer.anyIpv6();
        if (this.allowAllIpv6Outbound) {
            if (this.disableInlineRules) {
                super.addEgressRule(peer, port_1.Port.allTraffic(), description, false);
            }
            else {
                this.directEgressRules.push({
                    ipProtocol: '-1',
                    cidrIpv6: peer.uniqueId,
                    description,
                });
            }
        }
    }
    /**
     * Remove the bogus rule if it exists
     */
    removeNoTrafficRule() {
        if (this.disableInlineRules) {
            const { scope, id } = this.determineRuleScope(NO_TRAFFIC_PEER, NO_TRAFFIC_PORT, 'to', false);
            scope.node.tryRemoveChild(id);
        }
        else {
            const i = this.directEgressRules.findIndex(r => egressRulesEqual(r, MATCH_NO_TRAFFIC));
            if (i > -1) {
                this.directEgressRules.splice(i, 1);
            }
        }
    }
}
_a = JSII_RTTI_SYMBOL_1;
SecurityGroup[_a] = { fqn: "@aws-cdk/aws-ec2.SecurityGroup", version: "0.0.0" };
exports.SecurityGroup = SecurityGroup;
/**
 * Egress rule that purposely matches no traffic
 *
 * This is used in order to disable the "all traffic" default of Security Groups.
 *
 * No machine can ever actually have the 255.255.255.255 IP address, but
 * in order to lock it down even more we'll restrict to a nonexistent
 * ICMP traffic type.
 */
const MATCH_NO_TRAFFIC = {
    cidrIp: '255.255.255.255/32',
    description: 'Disallow all traffic',
    ipProtocol: 'icmp',
    fromPort: 252,
    toPort: 86,
};
const NO_TRAFFIC_PEER = peer_1.Peer.ipv4(MATCH_NO_TRAFFIC.cidrIp);
const NO_TRAFFIC_PORT = port_1.Port.icmpTypeAndCode(MATCH_NO_TRAFFIC.fromPort, MATCH_NO_TRAFFIC.toPort);
/**
 * Egress rule that matches all traffic
 */
const ALLOW_ALL_RULE = {
    cidrIp: '0.0.0.0/0',
    description: 'Allow all outbound traffic by default',
    ipProtocol: '-1',
};
const ALL_TRAFFIC_PEER = peer_1.Peer.anyIpv4();
const ALL_TRAFFIC_PORT = port_1.Port.allTraffic();
/**
 * Compare two ingress rules for equality the same way CloudFormation would (discarding description)
 */
function ingressRulesEqual(a, b) {
    return a.cidrIp === b.cidrIp
        && a.cidrIpv6 === b.cidrIpv6
        && a.fromPort === b.fromPort
        && a.toPort === b.toPort
        && a.ipProtocol === b.ipProtocol
        && a.sourceSecurityGroupId === b.sourceSecurityGroupId
        && a.sourceSecurityGroupName === b.sourceSecurityGroupName
        && a.sourceSecurityGroupOwnerId === b.sourceSecurityGroupOwnerId;
}
/**
 * Compare two egress rules for equality the same way CloudFormation would (discarding description)
 */
function egressRulesEqual(a, b) {
    return a.cidrIp === b.cidrIp
        && a.cidrIpv6 === b.cidrIpv6
        && a.fromPort === b.fromPort
        && a.toPort === b.toPort
        && a.ipProtocol === b.ipProtocol
        && a.destinationPrefixListId === b.destinationPrefixListId
        && a.destinationSecurityGroupId === b.destinationSecurityGroupId;
}
/**
 * Whether this rule refers to all traffic
 */
function isAllTrafficRule(rule) {
    return (rule.cidrIp === '0.0.0.0/0' || rule.cidrIpv6 === '::/0') && rule.ipProtocol === '-1';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHktZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWN1cml0eS1ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyREFBMkQ7QUFDM0Qsd0NBQTRIO0FBRzVILCtDQUE0QztBQUM1QyxtREFBb0c7QUFDcEcsaUNBQXFDO0FBQ3JDLGlDQUE4QjtBQUc5QixNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUV2RSxNQUFNLCtDQUErQyxHQUFHLGtEQUFrRCxDQUFDO0FBd0MzRzs7R0FFRztBQUNILE1BQWUsaUJBQWtCLFNBQVEsZUFBUTtJQUMvQzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBTTtRQUNsQyxPQUFPLHFCQUFxQixJQUFJLENBQUMsQ0FBQztLQUNuQztJQVlELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBcUI7UUFDN0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFQVixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUN0QixnQkFBVyxHQUFnQixJQUFJLHlCQUFXLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFHL0UscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBS25DLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDckU7SUFFRCxJQUFXLFFBQVE7UUFDakIsT0FBTyxZQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0QztJQUVNLGNBQWMsQ0FBQyxJQUFXLEVBQUUsVUFBZ0IsRUFBRSxXQUFvQixFQUFFLFVBQW9CO1FBQzdGLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM3QixXQUFXLEdBQUcsUUFB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L2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucywgQ29udGV4dFByb3ZpZGVyLCBJUmVzb3VyY2UsIExhenksIE5hbWVzLCBSZXNvdXJjZSwgUmVzb3VyY2VQcm9wcywgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDb25uZWN0aW9ucyB9IGZyb20gJy4vY29ubmVjdGlvbnMnO1xuaW1wb3J0IHsgQ2ZuU2VjdXJpdHlHcm91cCwgQ2ZuU2VjdXJpdHlHcm91cEVncmVzcywgQ2ZuU2VjdXJpdHlHcm91cEluZ3Jlc3MgfSBmcm9tICcuL2VjMi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVBlZXIsIFBlZXIgfSBmcm9tICcuL3BlZXInO1xuaW1wb3J0IHsgUG9ydCB9IGZyb20gJy4vcG9ydCc7XG5pbXBvcnQgeyBJVnBjIH0gZnJvbSAnLi92cGMnO1xuXG5jb25zdCBTRUNVUklUWV9HUk9VUF9TWU1CT0wgPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9pYW0uU2VjdXJpdHlHcm91cCcpO1xuXG5jb25zdCBTRUNVUklUWV9HUk9VUF9ESVNBQkxFX0lOTElORV9SVUxFU19DT05URVhUX0tFWSA9ICdAYXdzLWNkay9hd3MtZWMyLnNlY3VyaXR5R3JvdXBEaXNhYmxlSW5saW5lUnVsZXMnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3Igc2VjdXJpdHkgZ3JvdXAtbGlrZSBvYmplY3RzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNlY3VyaXR5R3JvdXAgZXh0ZW5kcyBJUmVzb3VyY2UsIElQZWVyIHtcbiAgLyoqXG4gICAqIElEIGZvciB0aGUgY3VycmVudCBzZWN1cml0eSBncm91cFxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgU2VjdXJpdHlHcm91cCBoYXMgYmVlbiBjb25maWd1cmVkIHRvIGFsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljXG4gICAqL1xuICByZWFkb25seSBhbGxvd0FsbE91dGJvdW5kOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gaW5ncmVzcyBydWxlIGZvciB0aGUgY3VycmVudCBzZWN1cml0eSBncm91cFxuICAgKlxuICAgKiBgcmVtb3RlUnVsZWAgY29udHJvbHMgd2hlcmUgdGhlIFJ1bGUgb2JqZWN0IGlzIGNyZWF0ZWQgaWYgdGhlIHBlZXIgaXMgYWxzbyBhXG4gICAqIHNlY3VyaXR5R3JvdXAgYW5kIHRoZXkgYXJlIGluIGRpZmZlcmVudCBzdGFjay4gSWYgZmFsc2UgKGRlZmF1bHQpIHRoZVxuICAgKiBydWxlIG9iamVjdCBpcyBjcmVhdGVkIHVuZGVyIHRoZSBjdXJyZW50IFNlY3VyaXR5R3JvdXAgb2JqZWN0LiBJZiB0cnVlIGFuZCB0aGVcbiAgICogcGVlciBpcyBhbHNvIGEgU2VjdXJpdHlHcm91cCwgdGhlIHJ1bGUgb2JqZWN0IGlzIGNyZWF0ZWQgdW5kZXIgdGhlIHJlbW90ZVxuICAgKiBTZWN1cml0eUdyb3VwIG9iamVjdC5cbiAgICovXG4gIGFkZEluZ3Jlc3NSdWxlKHBlZXI6IElQZWVyLCBjb25uZWN0aW9uOiBQb3J0LCBkZXNjcmlwdGlvbj86IHN0cmluZywgcmVtb3RlUnVsZT86IGJvb2xlYW4pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gZWdyZXNzIHJ1bGUgZm9yIHRoZSBjdXJyZW50IHNlY3VyaXR5IGdyb3VwXG4gICAqXG4gICAqIGByZW1vdGVSdWxlYCBjb250cm9scyB3aGVyZSB0aGUgUnVsZSBvYmplY3QgaXMgY3JlYXRlZCBpZiB0aGUgcGVlciBpcyBhbHNvIGFcbiAgICogc2VjdXJpdHlHcm91cCBhbmQgdGhleSBhcmUgaW4gZGlmZmVyZW50IHN0YWNrLiBJZiBmYWxzZSAoZGVmYXVsdCkgdGhlXG4gICAqIHJ1bGUgb2JqZWN0IGlzIGNyZWF0ZWQgdW5kZXIgdGhlIGN1cnJlbnQgU2VjdXJpdHlHcm91cCBvYmplY3QuIElmIHRydWUgYW5kIHRoZVxuICAgKiBwZWVyIGlzIGFsc28gYSBTZWN1cml0eUdyb3VwLCB0aGUgcnVsZSBvYmplY3QgaXMgY3JlYXRlZCB1bmRlciB0aGUgcmVtb3RlXG4gICAqIFNlY3VyaXR5R3JvdXAgb2JqZWN0LlxuICAgKi9cbiAgYWRkRWdyZXNzUnVsZShwZWVyOiBJUGVlciwgY29ubmVjdGlvbjogUG9ydCwgZGVzY3JpcHRpb24/OiBzdHJpbmcsIHJlbW90ZVJ1bGU/OiBib29sZWFuKTogdm9pZDtcbn1cblxuLyoqXG4gKiBBIFNlY3VyaXR5R3JvdXAgdGhhdCBpcyBub3QgY3JlYXRlZCBpbiB0aGlzIHRlbXBsYXRlXG4gKi9cbmFic3RyYWN0IGNsYXNzIFNlY3VyaXR5R3JvdXBCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJU2VjdXJpdHlHcm91cCB7XG4gIC8qKlxuICAgKiBSZXR1cm4gd2hldGhlciB0aGUgaW5kaWNhdGVkIG9iamVjdCBpcyBhIHNlY3VyaXR5IGdyb3VwXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzU2VjdXJpdHlHcm91cCh4OiBhbnkpOiB4IGlzIFNlY3VyaXR5R3JvdXBCYXNlIHtcbiAgICByZXR1cm4gU0VDVVJJVFlfR1JPVVBfU1lNQk9MIGluIHg7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgc2VjdXJpdHlHcm91cElkOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBhbGxvd0FsbE91dGJvdW5kOiBib29sZWFuO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYWxsb3dBbGxJcHY2T3V0Ym91bmQ6IGJvb2xlYW47XG5cbiAgcHVibGljIHJlYWRvbmx5IGNhbklubGluZVJ1bGUgPSBmYWxzZTtcbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zOiBDb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9ucyh7IHNlY3VyaXR5R3JvdXBzOiBbdGhpc10gfSk7XG4gIHB1YmxpYyByZWFkb25seSBkZWZhdWx0UG9ydD86IFBvcnQ7XG5cbiAgcHJpdmF0ZSBwZWVyQXNUb2tlbkNvdW50OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogUmVzb3VyY2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFNFQ1VSSVRZX0dST1VQX1NZTUJPTCwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgdW5pcXVlSWQoKSB7XG4gICAgcmV0dXJuIE5hbWVzLm5vZGVVbmlxdWVJZCh0aGlzLm5vZGUpO1xuICB9XG5cbiAgcHVibGljIGFkZEluZ3Jlc3NSdWxlKHBlZXI6IElQZWVyLCBjb25uZWN0aW9uOiBQb3J0LCBkZXNjcmlwdGlvbj86IHN0cmluZywgcmVtb3RlUnVsZT86IGJvb2xlYW4pIHtcbiAgICBpZiAoZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVzY3JpcHRpb24gPSBgZnJvbSAke3BlZXIudW5pcXVlSWR9OiR7Y29ubmVjdGlvbn1gO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2NvcGUsIGlkIH0gPSB0aGlzLmRldGVybWluZVJ1bGVTY29wZShwZWVyLCBjb25uZWN0aW9uLCAnZnJvbScsIHJlbW90ZVJ1bGUpO1xuXG4gICAgLy8gU2tpcCBkdXBsaWNhdGVzXG4gICAgaWYgKHNjb3BlLm5vZGUudHJ5RmluZENoaWxkKGlkKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXcgQ2ZuU2VjdXJpdHlHcm91cEluZ3Jlc3Moc2NvcGUsIGlkLCB7XG4gICAgICAgIGdyb3VwSWQ6IHRoaXMuc2VjdXJpdHlHcm91cElkLFxuICAgICAgICAuLi5wZWVyLnRvSW5ncmVzc1J1bGVDb25maWcoKSxcbiAgICAgICAgLi4uY29ubmVjdGlvbi50b1J1bGVKc29uKCksXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZEVncmVzc1J1bGUocGVlcjogSVBlZXIsIGNvbm5lY3Rpb246IFBvcnQsIGRlc2NyaXB0aW9uPzogc3RyaW5nLCByZW1vdGVSdWxlPzogYm9vbGVhbikge1xuICAgIGlmIChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IGB0byAke3BlZXIudW5pcXVlSWR9OiR7Y29ubmVjdGlvbn1gO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2NvcGUsIGlkIH0gPSB0aGlzLmRldGVybWluZVJ1bGVTY29wZShwZWVyLCBjb25uZWN0aW9uLCAndG8nLCByZW1vdGVSdWxlKTtcblxuICAgIC8vIFNraXAgZHVwbGljYXRlc1xuICAgIGlmIChzY29wZS5ub2RlLnRyeUZpbmRDaGlsZChpZCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3IENmblNlY3VyaXR5R3JvdXBFZ3Jlc3Moc2NvcGUsIGlkLCB7XG4gICAgICAgIGdyb3VwSWQ6IHRoaXMuc2VjdXJpdHlHcm91cElkLFxuICAgICAgICAuLi5wZWVyLnRvRWdyZXNzUnVsZUNvbmZpZygpLFxuICAgICAgICAuLi5jb25uZWN0aW9uLnRvUnVsZUpzb24oKSxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdG9JbmdyZXNzUnVsZUNvbmZpZygpOiBhbnkge1xuICAgIHJldHVybiB7IHNvdXJjZVNlY3VyaXR5R3JvdXBJZDogdGhpcy5zZWN1cml0eUdyb3VwSWQgfTtcbiAgfVxuXG4gIHB1YmxpYyB0b0VncmVzc1J1bGVDb25maWcoKTogYW55IHtcbiAgICByZXR1cm4geyBkZXN0aW5hdGlvblNlY3VyaXR5R3JvdXBJZDogdGhpcy5zZWN1cml0eUdyb3VwSWQgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgd2hlcmUgdG8gcGFyZW50IGEgbmV3IGluZ3Jlc3MvZWdyZXNzIHJ1bGVcbiAgICpcbiAgICogQSBTZWN1cml0eUdyb3VwIHJ1bGUgaXMgcGFyZW50ZWQgdW5kZXIgdGhlIGdyb3VwIGl0J3MgcmVsYXRlZCB0bywgVU5MRVNTXG4gICAqIHdlJ3JlIGluIGEgY3Jvc3Mtc3RhY2sgc2NlbmFyaW8gd2l0aCBhbm90aGVyIFNlY3VyaXR5IEdyb3VwLiBJbiB0aGF0IGNhc2UsXG4gICAqIHdlIHJlc3BlY3QgdGhlICdyZW1vdGVSdWxlJyBmbGFnIGFuZCB3aWxsIHBhcmVudCB1bmRlciB0aGUgb3RoZXIgc2VjdXJpdHlcbiAgICogZ3JvdXAuXG4gICAqXG4gICAqIFRoaXMgaXMgbmVjZXNzYXJ5IHRvIGF2b2lkIGN5Y2xpYyBkZXBlbmRlbmNpZXMgYmV0d2VlbiBzdGFja3MsIHNpbmNlIGJvdGhcbiAgICogaW5ncmVzcyBhbmQgZWdyZXNzIHJ1bGVzIHdpbGwgcmVmZXJlbmNlIGJvdGggc2VjdXJpdHkgZ3JvdXBzLCBhbmQgYSBuYWl2ZVxuICAgKiBwYXJlbnRpbmcgd2lsbCBsZWFkIHRvIHRoZSBmb2xsb3dpbmcgc2l0dWF0aW9uOlxuICAgKlxuICAgKiAgIOKVlOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVlyAgICAgICAgIOKVlOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVl1xuICAgKiAgIOKVkSAg4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQICAgICDilZEgICAgICAgICDilZEgICAg4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQICAg4pWRXG4gICAqICAg4pWRICDilIIgIEdyb3VwQSAgIOKUguKXgOKUgOKUgOKUgOKUgOKVrOKUgOKUkCAgIOKUjOKUgOKUgOKUgOKVrOKUgOKUgOKUgOKWtuKUgiAgR3JvdXBCICAg4pSCICAg4pWRXG4gICAqICAg4pWRICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJggICAgIOKVkSDilIIgICDilIIgICDilZEgICAg4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYICAg4pWRXG4gICAqICAg4pWRICAgICAgICDilrIgICAgICAgICAgIOKVkSDilIIgICDilIIgICDilZEgICAgICAgICAg4payICAgICAgICAg4pWRXG4gICAqICAg4pWRICAgICAgICDilIIgICAgICAgICAgIOKVkSDilIIgICDilIIgICDilZEgICAgICAgICAg4pSCICAgICAgICAg4pWRXG4gICAqICAg4pWRICAgICAgICDilIIgICAgICAgICAgIOKVkSDilIIgICDilIIgICDilZEgICAgICAgICAg4pSCICAgICAgICAg4pWRXG4gICAqICAg4pWRICDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJAgICAgIOKVkSDilJTilIDilIDilIDilLzilIDilIDilIDilazilIDilIDilIDilIDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJAgICDilZFcbiAgICogICDilZEgIOKUgiAgRWdyZXNzQSAg4pSC4pSA4pSA4pSA4pSA4pSA4pWs4pSA4pSA4pSA4pSA4pSA4pSYICAg4pWRICAgIOKUgiBJbmdyZXNzQiAg4pSCICAg4pWRXG4gICAqICAg4pWRICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJggICAgIOKVkSAgICAgICAgIOKVkSAgICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJggICDilZFcbiAgICogICDilZEgICAgICAgICAgICAgICAgICAgIOKVkSAgICAgICAgIOKVkSAgICAgICAgICAgICAgICAgICAg4pWRXG4gICAqICAg4pWa4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWdICAgICAgICAg4pWa4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWdXG4gICAqXG4gICAqIEJ5IGhhdmluZyB0aGUgYWJpbGl0eSB0byBzd2l0Y2ggdGhlIHBhcmVudCwgd2UgYXZvaWQgdGhlIGN5Y2xpYyByZWZlcmVuY2UgYnlcbiAgICoga2VlcGluZyBhbGwgcnVsZXMgaW4gYSBzaW5nbGUgc3RhY2suXG4gICAqXG4gICAqIElmIHRoaXMgaGFwcGVucywgd2UgYWxzbyBoYXZlIHRvIGNoYW5nZSB0aGUgY29uc3RydWN0IElELCBiZWNhdXNlXG4gICAqIG90aGVyd2lzZSB3ZSBtaWdodCBoYXZlIHR3byBvYmplY3RzIHdpdGggdGhlIHNhbWUgSUQgaWYgd2UgaGF2ZVxuICAgKiBtdWx0aXBsZSByZXZlcnNlZCBzZWN1cml0eSBncm91cCByZWxhdGlvbnNoaXBzLlxuICAgKlxuICAgKiAgIOKVlOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVl1xuICAgKiAgIOKVkeKUjOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUkCAgICAgICAgICAgICAgICAgICAgICDilZFcbiAgICogICDilZHilIIgIEdyb3VwQiAgIOKUgiAgICAgICAgICAgICAgICAgICAgICDilZFcbiAgICogICDilZHilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJggICAgICAgICAgICAgICAgICAgICAg4pWRXG4gICAqICAg4pWRICAgICAg4payICAgICAgICAgICAgICAgICAgICAgICAgICAgIOKVkVxuICAgKiAgIOKVkSAgICAgIOKUgiAgICAgICAgICAgICAg4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQIOKVkVxuICAgKiAgIOKVkSAgICAgIOKUnOKUgOKUgOKUgOKUgFwiZnJvbSBBXCLilIDilIDilIIgSW5ncmVzc0IgIOKUgiDilZFcbiAgICogICDilZEgICAgICDilIIgICAgICAgICAgICAgIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmCDilZFcbiAgICogICDilZEgICAgICDilIIgICAgICAgICAgICAgIOKUjOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUkCDilZFcbiAgICogICDilZEgICAgICDilJzilIDilIDilIDilIDilIBcInRvIEJcIuKUgOKUgOKUgOKUgiAgRWdyZXNzQSAg4pSCIOKVkVxuICAgKiAgIOKVkSAgICAgIOKUgiAgICAgICAgICAgICAg4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYIOKVkVxuICAgKiAgIOKVkSAgICAgIOKUgiAgICAgICAgICAgICAg4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQIOKVkVxuICAgKiAgIOKVkSAgICAgIOKUlOKUgOKUgOKUgOKUgOKUgFwidG8gQlwi4pSA4pSA4pSA4pSCICBFZ3Jlc3NDICDilIIg4pWRICA8LS0gb29wc1xuICAgKiAgIOKVkSAgICAgICAgICAgICAgICAgICAgIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmCDilZFcbiAgICogICDilZrilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZ1cbiAgICovXG5cbiAgcHJvdGVjdGVkIGRldGVybWluZVJ1bGVTY29wZShcbiAgICBwZWVyOiBJUGVlcixcbiAgICBjb25uZWN0aW9uOiBQb3J0LFxuICAgIGZyb21UbzogJ2Zyb20nIHwgJ3RvJyxcbiAgICByZW1vdGVSdWxlPzogYm9vbGVhbik6IFJ1bGVTY29wZSB7XG5cbiAgICBpZiAocmVtb3RlUnVsZSAmJiBTZWN1cml0eUdyb3VwQmFzZS5pc1NlY3VyaXR5R3JvdXAocGVlcikgJiYgZGlmZmVyZW50U3RhY2tzKHRoaXMsIHBlZXIpKSB7XG4gICAgICAvLyBSZXZlcnNlZFxuICAgICAgY29uc3QgcmV2ZXJzZWRGcm9tVG8gPSBmcm9tVG8gPT09ICdmcm9tJyA/ICd0bycgOiAnZnJvbSc7XG4gICAgICByZXR1cm4geyBzY29wZTogcGVlciwgaWQ6IGAke3RoaXMudW5pcXVlSWR9OiR7Y29ubmVjdGlvbn0gJHtyZXZlcnNlZEZyb21Ub31gIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlZ3VsYXIgKGRvIG9sZCBJRCBlc2NhcGluZyB0byBpbiBvcmRlciB0byBub3QgZGlzdHVyYiBleGlzdGluZyBkZXBsb3ltZW50cylcbiAgICAgIHJldHVybiB7IHNjb3BlOiB0aGlzLCBpZDogYCR7ZnJvbVRvfSAke3RoaXMucmVuZGVyUGVlcihwZWVyKX06JHtjb25uZWN0aW9ufWAucmVwbGFjZSgnLycsICdfJykgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclBlZXIocGVlcjogSVBlZXIpIHtcbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHBlZXIudW5pcXVlSWQpKSB7XG4gICAgICAvLyBOZWVkIHRvIHJldHVybiBhIHVuaXF1ZSB2YWx1ZSBlYWNoIHRpbWUgYSBwZWVyXG4gICAgICAvLyBpcyBhbiB1bnJlc29sdmVkIHRva2VuLCBlbHNlIHRoZSBkdXBsaWNhdGUgc2tpcHBlclxuICAgICAgLy8gaW4gYHNnLmFkZFh4eFJ1bGVgIGNhbiBkZXRlY3QgdW5pcXVlIHJ1bGVzIGFzIGR1cGxpY2F0ZXNcbiAgICAgIHJldHVybiB0aGlzLnBlZXJBc1Rva2VuQ291bnQrKyA/IGAne0luZGlyZWN0UGVlciR7dGhpcy5wZWVyQXNUb2tlbkNvdW50fX0nYCA6ICd7SW5kaXJlY3RQZWVyfSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwZWVyLnVuaXF1ZUlkO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRoZSBzY29wZSBhbmQgaWQgaW4gd2hpY2ggYSBnaXZlbiBTZWN1cml0eUdyb3VwIHJ1bGUgc2hvdWxkIGJlIGRlZmluZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZVNjb3BlIHtcbiAgLyoqXG4gICAqIFRoZSBTZWN1cml0eUdyb3VwIGluIHdoaWNoIGEgcnVsZSBzaG91bGQgYmUgc2NvcGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgc2NvcGU6IElTZWN1cml0eUdyb3VwO1xuICAvKipcbiAgICogVGhlIGNvbnN0cnVjdCBJRCB0byB1c2UgZm9yIHRoZSBydWxlLlxuICAgKi9cbiAgcmVhZG9ubHkgaWQ6IHN0cmluZztcbn1cblxuZnVuY3Rpb24gZGlmZmVyZW50U3RhY2tzKGdyb3VwMTogU2VjdXJpdHlHcm91cEJhc2UsIGdyb3VwMjogU2VjdXJpdHlHcm91cEJhc2UpIHtcbiAgcmV0dXJuIFN0YWNrLm9mKGdyb3VwMSkgIT09IFN0YWNrLm9mKGdyb3VwMik7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VjdXJpdHlHcm91cFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzZWN1cml0eSBncm91cC4gRm9yIHZhbGlkIHZhbHVlcywgc2VlIHRoZSBHcm91cE5hbWVcbiAgICogcGFyYW1ldGVyIG9mIHRoZSBDcmVhdGVTZWN1cml0eUdyb3VwIGFjdGlvbiBpbiB0aGUgQW1hem9uIEVDMiBBUElcbiAgICogUmVmZXJlbmNlLlxuICAgKlxuICAgKiBJdCBpcyBub3QgcmVjb21tZW5kZWQgdG8gdXNlIGFuIGV4cGxpY2l0IGdyb3VwIG5hbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IElmIHlvdSBkb24ndCBzcGVjaWZ5IGEgR3JvdXBOYW1lLCBBV1MgQ2xvdWRGb3JtYXRpb24gZ2VuZXJhdGVzIGFcbiAgICogdW5pcXVlIHBoeXNpY2FsIElEIGFuZCB1c2VzIHRoYXQgSUQgZm9yIHRoZSBncm91cCBuYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpb24gb2YgdGhlIHNlY3VyaXR5IGdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCBUaGUgZGVmYXVsdCBuYW1lIHdpbGwgYmUgdGhlIGNvbnN0cnVjdCdzIENESyBwYXRoLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBWUEMgaW4gd2hpY2ggdG8gY3JlYXRlIHRoZSBzZWN1cml0eSBncm91cC5cbiAgICovXG4gIHJlYWRvbmx5IHZwYzogSVZwYztcblxuICAvKipcbiAgICogV2hldGhlciB0byBhbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBieSBkZWZhdWx0LlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIHNldCB0byB0cnVlLCB0aGVyZSB3aWxsIG9ubHkgYmUgYSBzaW5nbGUgZWdyZXNzIHJ1bGUgd2hpY2ggYWxsb3dzIGFsbFxuICAgKiBvdXRib3VuZCB0cmFmZmljLiBJZiB0aGlzIGlzIHNldCB0byBmYWxzZSwgbm8gb3V0Ym91bmQgdHJhZmZpYyB3aWxsIGJlIGFsbG93ZWQgYnlcbiAgICogZGVmYXVsdCBhbmQgYWxsIGVncmVzcyB0cmFmZmljIG11c3QgYmUgZXhwbGljaXRseSBhdXRob3JpemVkLlxuICAgKlxuICAgKiBUbyBhbGxvdyBhbGwgaXB2NiB0cmFmZmljIHVzZSBhbGxvd0FsbElwdjZPdXRib3VuZFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBhbGxvd0FsbE91dGJvdW5kPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBhbGxvdyBhbGwgb3V0Ym91bmQgaXB2NiB0cmFmZmljIGJ5IGRlZmF1bHQuXG4gICAqXG4gICAqIElmIHRoaXMgaXMgc2V0IHRvIHRydWUsIHRoZXJlIHdpbGwgb25seSBiZSBhIHNpbmdsZSBlZ3Jlc3MgcnVsZSB3aGljaCBhbGxvd3MgYWxsXG4gICAqIG91dGJvdW5kIGlwdjYgdHJhZmZpYy4gSWYgdGhpcyBpcyBzZXQgdG8gZmFsc2UsIG5vIG91dGJvdW5kIHRyYWZmaWMgd2lsbCBiZSBhbGxvd2VkIGJ5XG4gICAqIGRlZmF1bHQgYW5kIGFsbCBlZ3Jlc3MgaXB2NiB0cmFmZmljIG11c3QgYmUgZXhwbGljaXRseSBhdXRob3JpemVkLlxuICAgKlxuICAgKiBUbyBhbGxvdyBhbGwgaXB2NCB0cmFmZmljIHVzZSBhbGxvd0FsbE91dGJvdW5kXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBhbGxvd0FsbElwdjZPdXRib3VuZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzYWJsZSBpbmxpbmUgaW5ncmVzcyBhbmQgZWdyZXNzIHJ1bGUgb3B0aW1pemF0aW9uLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIHNldCB0byB0cnVlLCBpbmdyZXNzIGFuZCBlZ3Jlc3MgcnVsZXMgd2lsbCBub3QgYmUgZGVjbGFyZWQgdW5kZXIgdGhlXG4gICAqIFNlY3VyaXR5R3JvdXAgaW4gY2xvdWRmb3JtYXRpb24sIGJ1dCB3aWxsIGJlIHNlcGFyYXRlIGVsZW1lbnRzLlxuICAgKlxuICAgKiBJbmxpbmluZyBydWxlcyBpcyBhbiBvcHRpbWl6YXRpb24gZm9yIHByb2R1Y2luZyBzbWFsbGVyIHN0YWNrIHRlbXBsYXRlcy4gU29tZXRpbWVzXG4gICAqIHRoaXMgaXMgbm90IGRlc2lyYWJsZSwgZm9yIGV4YW1wbGUgd2hlbiBzZWN1cml0eSBncm91cCBhY2Nlc3MgaXMgbWFuYWdlZCB2aWEgdGFncy5cbiAgICpcbiAgICogVGhlIGRlZmF1bHQgdmFsdWUgY2FuIGJlIG92ZXJyaWRlbiBnbG9iYWxseSBieSBzZXR0aW5nIHRoZSBjb250ZXh0IHZhcmlhYmxlXG4gICAqICdAYXdzLWNkay9hd3MtZWMyLnNlY3VyaXR5R3JvdXBEaXNhYmxlSW5saW5lUnVsZXMnLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZGlzYWJsZUlubGluZVJ1bGVzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBZGRpdGlvbmFsIG9wdGlvbnMgZm9yIGltcG9ydGVkIHNlY3VyaXR5IGdyb3Vwc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlY3VyaXR5R3JvdXBJbXBvcnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIE1hcmsgdGhlIFNlY3VyaXR5R3JvdXAgYXMgaGF2aW5nIGJlZW4gY3JlYXRlZCBhbGxvd2luZyBhbGwgb3V0Ym91bmQgdHJhZmZpY1xuICAgKlxuICAgKiBPbmx5IGlmIHRoaXMgaXMgc2V0IHRvIGZhbHNlIHdpbGwgZWdyZXNzIHJ1bGVzIGJlIGFkZGVkIHRvIHRoaXMgc2VjdXJpdHlcbiAgICogZ3JvdXAuIEJlIGF3YXJlLCB0aGlzIHdvdWxkIHVuZG8gYW55IHBvdGVudGlhbCBcImFsbCBvdXRib3VuZCB0cmFmZmljXCJcbiAgICogZGVmYXVsdC5cbiAgICpcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dBbGxPdXRib3VuZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE1hcmsgdGhlIFNlY3VyaXR5R3JvdXAgYXMgaGF2aW5nIGJlZW4gY3JlYXRlZCBhbGxvd2luZyBhbGwgb3V0Ym91bmQgaXB2NiB0cmFmZmljXG4gICAqXG4gICAqIE9ubHkgaWYgdGhpcyBpcyBzZXQgdG8gZmFsc2Ugd2lsbCBlZ3Jlc3MgcnVsZXMgZm9yIGlwdjYgYmUgYWRkZWQgdG8gdGhpcyBzZWN1cml0eVxuICAgKiBncm91cC4gQmUgYXdhcmUsIHRoaXMgd291bGQgdW5kbyBhbnkgcG90ZW50aWFsIFwiYWxsIG91dGJvdW5kIHRyYWZmaWNcIlxuICAgKiBkZWZhdWx0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dBbGxJcHY2T3V0Ym91bmQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBhIFNlY3VyaXR5R3JvdXAgaXMgbXV0YWJsZSBDREsgY2FuIGFkZCBydWxlcyB0byBleGlzdGluZyBncm91cHNcbiAgICpcbiAgICogQmV3YXJlIHRoYXQgbWFraW5nIGEgU2VjdXJpdHlHcm91cCBpbW11dGFibGUgbWlnaHQgbGVhZCB0byBpc3N1ZVxuICAgKiBkdWUgdG8gbWlzc2luZyBpbmdyZXNzL2VncmVzcyBydWxlcyBmb3IgbmV3IHJlc291cmNlcy5cbiAgICpcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgbXV0YWJsZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBBbWF6b24gRUMyIHNlY3VyaXR5IGdyb3VwIHdpdGhpbiBhIFZQQy5cbiAqXG4gKiBTZWN1cml0eSBHcm91cHMgYWN0IGxpa2UgYSBmaXJld2FsbCB3aXRoIGEgc2V0IG9mIHJ1bGVzLCBhbmQgYXJlIGFzc29jaWF0ZWRcbiAqIHdpdGggYW55IEFXUyByZXNvdXJjZSB0aGF0IGhhcyBvciBjcmVhdGVzIEVsYXN0aWMgTmV0d29yayBJbnRlcmZhY2VzIChFTklzKS5cbiAqIEEgdHlwaWNhbCBleGFtcGxlIG9mIGEgcmVzb3VyY2UgdGhhdCBoYXMgYSBzZWN1cml0eSBncm91cCBpcyBhbiBJbnN0YW5jZSAob3JcbiAqIEF1dG8gU2NhbGluZyBHcm91cCBvZiBpbnN0YW5jZXMpXG4gKlxuICogSWYgeW91IGFyZSBkZWZpbmluZyBuZXcgaW5mcmFzdHJ1Y3R1cmUgaW4gQ0RLLCB0aGVyZSBpcyBhIGdvb2QgY2hhbmNlIHlvdVxuICogd29uJ3QgaGF2ZSB0byBpbnRlcmFjdCB3aXRoIHRoaXMgY2xhc3MgYXQgYWxsLiBMaWtlIElBTSBSb2xlcywgU2VjdXJpdHlcbiAqIEdyb3VwcyBuZWVkIHRvIGV4aXN0IHRvIGNvbnRyb2wgYWNjZXNzIGJldHdlZW4gQVdTIHJlc291cmNlcywgYnV0IENESyB3aWxsXG4gKiBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlIGFuZCBwb3B1bGF0ZSB0aGVtIHdpdGggbGVhc3QtcHJpdmlsZWdlIHBlcm1pc3Npb25zXG4gKiBmb3IgeW91IHNvIHlvdSBjYW4gY29uY2VudHJhdGUgb24geW91ciBidXNpbmVzcyBsb2dpYy5cbiAqXG4gKiBBbGwgQ29uc3RydWN0cyB0aGF0IHJlcXVpcmUgU2VjdXJpdHkgR3JvdXBzIHdpbGwgY3JlYXRlIG9uZSBmb3IgeW91IGlmIHlvdVxuICogZG9uJ3Qgc3BlY2lmeSBvbmUgYXQgY29uc3RydWN0aW9uLiBBZnRlciBjb25zdHJ1Y3Rpb24sIHlvdSBjYW4gc2VsZWN0aXZlbHlcbiAqIGFsbG93IGNvbm5lY3Rpb25zIHRvIGFuZCBiZXR3ZWVuIGNvbnN0cnVjdHMgdmlhLS1mb3IgZXhhbXBsZS0tIHRoZSBgaW5zdGFuY2UuY29ubmVjdGlvbnNgXG4gKiBvYmplY3QuIFRoaW5rIG9mIGl0IGFzIFwiYWxsb3dpbmcgY29ubmVjdGlvbnMgdG8geW91ciBpbnN0YW5jZVwiLCByYXRoZXIgdGhhblxuICogXCJhZGRpbmcgaW5ncmVzcyBydWxlcyBhIHNlY3VyaXR5IGdyb3VwXCIuIFNlZSB0aGUgW0FsbG93aW5nXG4gKiBDb25uZWN0aW9uc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvbGF0ZXN0L2RvY3MvYXdzLWVjMi1yZWFkbWUuaHRtbCNhbGxvd2luZy1jb25uZWN0aW9ucylcbiAqIHNlY3Rpb24gaW4gdGhlIGxpYnJhcnkgZG9jdW1lbnRhdGlvbiBmb3IgZXhhbXBsZXMuXG4gKlxuICogRGlyZWN0IG1hbmlwdWxhdGlvbiBvZiB0aGUgU2VjdXJpdHkgR3JvdXAgdGhyb3VnaCBgYWRkSW5ncmVzc1J1bGVgIGFuZFxuICogYGFkZEVncmVzc1J1bGVgIGlzIHBvc3NpYmxlLCBidXQgbXV0YXRpb24gdGhyb3VnaCB0aGUgYC5jb25uZWN0aW9uc2Agb2JqZWN0XG4gKiBpcyByZWNvbW1lbmRlZC4gSWYgeW91IHBlZXIgdHdvIGNvbnN0cnVjdHMgd2l0aCBzZWN1cml0eSBncm91cHMgdGhpcyB3YXksXG4gKiBhcHByb3ByaWF0ZSBydWxlcyB3aWxsIGJlIGNyZWF0ZWQgaW4gYm90aC5cbiAqXG4gKiBJZiB5b3UgaGF2ZSBhbiBleGlzdGluZyBzZWN1cml0eSBncm91cCB5b3Ugd2FudCB0byB1c2UgaW4geW91ciBDREsgYXBwbGljYXRpb24sXG4gKiB5b3Ugd291bGQgaW1wb3J0IGl0IGxpa2UgdGhpczpcbiAqXG4gKiBgYGB0c1xuICogY29uc3Qgc2VjdXJpdHlHcm91cCA9IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQodGhpcywgJ1NHJywgJ3NnLTEyMzQ1Jywge1xuICogICBtdXRhYmxlOiBmYWxzZVxuICogfSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIFNlY3VyaXR5R3JvdXAgZXh0ZW5kcyBTZWN1cml0eUdyb3VwQmFzZSB7XG4gIC8qKlxuICAgKiBMb29rIHVwIGEgc2VjdXJpdHkgZ3JvdXAgYnkgaWQuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZnJvbUxvb2t1cEJ5SWQoKWAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTG9va3VwKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHNlY3VyaXR5R3JvdXBJZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbUxvb2t1cEF0dHJpYnV0ZXMoc2NvcGUsIGlkLCB7IHNlY3VyaXR5R3JvdXBJZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rIHVwIGEgc2VjdXJpdHkgZ3JvdXAgYnkgaWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Mb29rdXBCeUlkKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHNlY3VyaXR5R3JvdXBJZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbUxvb2t1cEF0dHJpYnV0ZXMoc2NvcGUsIGlkLCB7IHNlY3VyaXR5R3JvdXBJZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rIHVwIGEgc2VjdXJpdHkgZ3JvdXAgYnkgbmFtZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxvb2t1cEJ5TmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzZWN1cml0eUdyb3VwTmFtZTogc3RyaW5nLCB2cGM6IElWcGMpIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tTG9va3VwQXR0cmlidXRlcyhzY29wZSwgaWQsIHsgc2VjdXJpdHlHcm91cE5hbWUsIHZwYyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3Rpbmcgc2VjdXJpdHkgZ3JvdXAgaW50byB0aGlzIGFwcC5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgd2lsbCBhc3N1bWUgdGhhdCB0aGUgU2VjdXJpdHkgR3JvdXAgaGFzIGEgcnVsZSBpbiBpdCB3aGljaCBhbGxvd3NcbiAgICogYWxsIG91dGJvdW5kIHRyYWZmaWMsIGFuZCBzbyB3aWxsIG5vdCBhZGQgZWdyZXNzIHJ1bGVzIHRvIHRoZSBpbXBvcnRlZCBTZWN1cml0eVxuICAgKiBHcm91cCAob25seSBpbmdyZXNzIHJ1bGVzKS5cbiAgICpcbiAgICogSWYgeW91ciBleGlzdGluZyBTZWN1cml0eSBHcm91cCBuZWVkcyB0byBoYXZlIGVncmVzcyBydWxlcyBhZGRlZCwgcGFzcyB0aGVcbiAgICogYGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlYCBvcHRpb24gb24gaW1wb3J0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU2VjdXJpdHlHcm91cElkKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHNlY3VyaXR5R3JvdXBJZDogc3RyaW5nLCBvcHRpb25zOiBTZWN1cml0eUdyb3VwSW1wb3J0T3B0aW9ucyA9IHt9KTogSVNlY3VyaXR5R3JvdXAge1xuICAgIGNsYXNzIE11dGFibGVJbXBvcnQgZXh0ZW5kcyBTZWN1cml0eUdyb3VwQmFzZSB7XG4gICAgICBwdWJsaWMgc2VjdXJpdHlHcm91cElkID0gc2VjdXJpdHlHcm91cElkO1xuICAgICAgcHVibGljIGFsbG93QWxsT3V0Ym91bmQgPSBvcHRpb25zLmFsbG93QWxsT3V0Ym91bmQgPz8gdHJ1ZTtcbiAgICAgIHB1YmxpYyBhbGxvd0FsbElwdjZPdXRib3VuZCA9IG9wdGlvbnMuYWxsb3dBbGxJcHY2T3V0Ym91bmQgPz8gZmFsc2U7XG5cbiAgICAgIHB1YmxpYyBhZGRFZ3Jlc3NSdWxlKHBlZXI6IElQZWVyLCBjb25uZWN0aW9uOiBQb3J0LCBkZXNjcmlwdGlvbj86IHN0cmluZywgcmVtb3RlUnVsZT86IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gT25seSBpZiBhbGxvd0FsbE91dGJvdW5kIGhhcyBiZWVuIGRpc2FibGVkXG4gICAgICAgIGlmIChvcHRpb25zLmFsbG93QWxsT3V0Ym91bmQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgc3VwZXIuYWRkRWdyZXNzUnVsZShwZWVyLCBjb25uZWN0aW9uLCBkZXNjcmlwdGlvbiwgcmVtb3RlUnVsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBJbW11dGFibGVJbXBvcnQgZXh0ZW5kcyBTZWN1cml0eUdyb3VwQmFzZSB7XG4gICAgICBwdWJsaWMgc2VjdXJpdHlHcm91cElkID0gc2VjdXJpdHlHcm91cElkO1xuICAgICAgcHVibGljIGFsbG93QWxsT3V0Ym91bmQgPSBvcHRpb25zLmFsbG93QWxsT3V0Ym91bmQgPz8gdHJ1ZTtcbiAgICAgIHB1YmxpYyBhbGxvd0FsbElwdjZPdXRib3VuZCA9IG9wdGlvbnMuYWxsb3dBbGxJcHY2T3V0Ym91bmQgPz8gZmFsc2U7XG5cbiAgICAgIHB1YmxpYyBhZGRFZ3Jlc3NSdWxlKF9wZWVyOiBJUGVlciwgX2Nvbm5lY3Rpb246IFBvcnQsIF9kZXNjcmlwdGlvbj86IHN0cmluZywgX3JlbW90ZVJ1bGU/OiBib29sZWFuKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgIH1cblxuICAgICAgcHVibGljIGFkZEluZ3Jlc3NSdWxlKF9wZWVyOiBJUGVlciwgX2Nvbm5lY3Rpb246IFBvcnQsIF9kZXNjcmlwdGlvbj86IHN0cmluZywgX3JlbW90ZVJ1bGU/OiBib29sZWFuKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucy5tdXRhYmxlICE9PSBmYWxzZVxuICAgICAgPyBuZXcgTXV0YWJsZUltcG9ydChzY29wZSwgaWQpXG4gICAgICA6IG5ldyBJbW11dGFibGVJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rIHVwIGEgc2VjdXJpdHkgZ3JvdXAuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBmcm9tTG9va3VwQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBvcHRpb25zOiBTZWN1cml0eUdyb3VwTG9va3VwT3B0aW9ucykge1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQob3B0aW9ucy5zZWN1cml0eUdyb3VwSWQpIHx8wqBUb2tlbi5pc1VucmVzb2x2ZWQob3B0aW9ucy5zZWN1cml0eUdyb3VwTmFtZSkgfHwgVG9rZW4uaXNVbnJlc29sdmVkKG9wdGlvbnMudnBjPy52cGNJZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQWxsIGFyZ3VtZW50cyB0byBsb29rIHVwIGEgc2VjdXJpdHkgZ3JvdXAgbXVzdCBiZSBjb25jcmV0ZSAobm8gVG9rZW5zKScpO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IGN4YXBpLlNlY3VyaXR5R3JvdXBDb250ZXh0UmVzcG9uc2UgPSBDb250ZXh0UHJvdmlkZXIuZ2V0VmFsdWUoc2NvcGUsIHtcbiAgICAgIHByb3ZpZGVyOiBjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIuU0VDVVJJVFlfR1JPVVBfUFJPVklERVIsXG4gICAgICBwcm9wczoge1xuICAgICAgICBzZWN1cml0eUdyb3VwSWQ6IG9wdGlvbnMuc2VjdXJpdHlHcm91cElkLFxuICAgICAgICBzZWN1cml0eUdyb3VwTmFtZTogb3B0aW9ucy5zZWN1cml0eUdyb3VwTmFtZSxcbiAgICAgICAgdnBjSWQ6IG9wdGlvbnMudnBjPy52cGNJZCxcbiAgICAgIH0sXG4gICAgICBkdW1teVZhbHVlOiB7XG4gICAgICAgIHNlY3VyaXR5R3JvdXBJZDogJ3NnLTEyMzQ1Njc4JyxcbiAgICAgICAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcbiAgICAgIH0gYXMgY3hhcGkuU2VjdXJpdHlHcm91cENvbnRleHRSZXNwb25zZSxcbiAgICB9KS52YWx1ZTtcblxuICAgIHJldHVybiBTZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQoc2NvcGUsIGlkLCBhdHRyaWJ1dGVzLnNlY3VyaXR5R3JvdXBJZCwge1xuICAgICAgYWxsb3dBbGxPdXRib3VuZDogYXR0cmlidXRlcy5hbGxvd0FsbE91dGJvdW5kLFxuICAgICAgbXV0YWJsZTogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhdHRyaWJ1dGUgdGhhdCByZXByZXNlbnRzIHRoZSBzZWN1cml0eSBncm91cCBuYW1lLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqIEBkZXByZWNhdGVkIHJldHVybnMgdGhlIHNlY3VyaXR5IGdyb3VwIElELCByYXRoZXIgdGhhbiB0aGUgbmFtZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZWN1cml0eUdyb3VwTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIHNlY3VyaXR5IGdyb3VwXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZWN1cml0eUdyb3VwSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFZQQyBJRCB0aGlzIHNlY3VyaXR5IGdyb3VwIGlzIHBhcnQgb2YuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZWN1cml0eUdyb3VwVnBjSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgU2VjdXJpdHlHcm91cCBoYXMgYmVlbiBjb25maWd1cmVkIHRvIGFsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWxsb3dBbGxPdXRib3VuZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgU2VjdXJpdHlHcm91cCBoYXMgYmVlbiBjb25maWd1cmVkIHRvIGFsbG93IGFsbCBvdXRib3VuZCBpcHY2IHRyYWZmaWNcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhbGxvd0FsbElwdjZPdXRib3VuZDogYm9vbGVhbjtcblxuICBwcml2YXRlIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA6IENmblNlY3VyaXR5R3JvdXA7XG4gIHByaXZhdGUgcmVhZG9ubHkgZGlyZWN0SW5ncmVzc1J1bGVzOiBDZm5TZWN1cml0eUdyb3VwLkluZ3Jlc3NQcm9wZXJ0eVtdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgZGlyZWN0RWdyZXNzUnVsZXM6IENmblNlY3VyaXR5R3JvdXAuRWdyZXNzUHJvcGVydHlbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc2FibGUgb3B0aW1pemF0aW9uIGZvciBpbmxpbmUgc2VjdXJpdHkgZ3JvdXAgcnVsZXMuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGRpc2FibGVJbmxpbmVSdWxlczogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU2VjdXJpdHlHcm91cFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnNlY3VyaXR5R3JvdXBOYW1lLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZ3JvdXBEZXNjcmlwdGlvbiA9IHByb3BzLmRlc2NyaXB0aW9uIHx8IHRoaXMubm9kZS5wYXRoO1xuXG4gICAgdGhpcy5hbGxvd0FsbE91dGJvdW5kID0gcHJvcHMuYWxsb3dBbGxPdXRib3VuZCAhPT0gZmFsc2U7XG4gICAgdGhpcy5hbGxvd0FsbElwdjZPdXRib3VuZCA9IHByb3BzLmFsbG93QWxsSXB2Nk91dGJvdW5kID8/IGZhbHNlO1xuXG4gICAgdGhpcy5kaXNhYmxlSW5saW5lUnVsZXMgPSBwcm9wcy5kaXNhYmxlSW5saW5lUnVsZXMgIT09IHVuZGVmaW5lZCA/XG4gICAgICAhIXByb3BzLmRpc2FibGVJbmxpbmVSdWxlcyA6XG4gICAgICAhIXRoaXMubm9kZS50cnlHZXRDb250ZXh0KFNFQ1VSSVRZX0dST1VQX0RJU0FCTEVfSU5MSU5FX1JVTEVTX0NPTlRFWFRfS0VZKTtcblxuICAgIHRoaXMuc2VjdXJpdHlHcm91cCA9IG5ldyBDZm5TZWN1cml0eUdyb3VwKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGdyb3VwTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBncm91cERlc2NyaXB0aW9uLFxuICAgICAgc2VjdXJpdHlHcm91cEluZ3Jlc3M6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5kaXJlY3RJbmdyZXNzUnVsZXMgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9ICksXG4gICAgICBzZWN1cml0eUdyb3VwRWdyZXNzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMuZGlyZWN0RWdyZXNzUnVsZXMgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9ICksXG4gICAgICB2cGNJZDogcHJvcHMudnBjLnZwY0lkLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZWN1cml0eUdyb3VwSWQgPSB0aGlzLnNlY3VyaXR5R3JvdXAuYXR0ckdyb3VwSWQ7XG4gICAgdGhpcy5zZWN1cml0eUdyb3VwVnBjSWQgPSB0aGlzLnNlY3VyaXR5R3JvdXAuYXR0clZwY0lkO1xuICAgIHRoaXMuc2VjdXJpdHlHcm91cE5hbWUgPSB0aGlzLnNlY3VyaXR5R3JvdXAucmVmO1xuXG4gICAgdGhpcy5hZGREZWZhdWx0RWdyZXNzUnVsZSgpO1xuICAgIHRoaXMuYWRkRGVmYXVsdElwdjZFZ3Jlc3NSdWxlKCk7XG4gIH1cblxuICBwdWJsaWMgYWRkSW5ncmVzc1J1bGUocGVlcjogSVBlZXIsIGNvbm5lY3Rpb246IFBvcnQsIGRlc2NyaXB0aW9uPzogc3RyaW5nLCByZW1vdGVSdWxlPzogYm9vbGVhbikge1xuICAgIGlmICghcGVlci5jYW5JbmxpbmVSdWxlIHx8ICFjb25uZWN0aW9uLmNhbklubGluZVJ1bGUgfHwgdGhpcy5kaXNhYmxlSW5saW5lUnVsZXMpIHtcbiAgICAgIHN1cGVyLmFkZEluZ3Jlc3NSdWxlKHBlZXIsIGNvbm5lY3Rpb24sIGRlc2NyaXB0aW9uLCByZW1vdGVSdWxlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVzY3JpcHRpb24gPSBgZnJvbSAke3BlZXIudW5pcXVlSWR9OiR7Y29ubmVjdGlvbn1gO1xuICAgIH1cblxuICAgIHRoaXMuYWRkRGlyZWN0SW5ncmVzc1J1bGUoe1xuICAgICAgLi4ucGVlci50b0luZ3Jlc3NSdWxlQ29uZmlnKCksXG4gICAgICAuLi5jb25uZWN0aW9uLnRvUnVsZUpzb24oKSxcbiAgICAgIGRlc2NyaXB0aW9uLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFkZEVncmVzc1J1bGUocGVlcjogSVBlZXIsIGNvbm5lY3Rpb246IFBvcnQsIGRlc2NyaXB0aW9uPzogc3RyaW5nLCByZW1vdGVSdWxlPzogYm9vbGVhbikge1xuICAgIGNvbnN0IGlzSXB2NiA9IHBlZXIudG9FZ3Jlc3NSdWxlQ29uZmlnKCkuaGFzT3duUHJvcGVydHkoJ2NpZHJJcHY2Jyk7XG5cbiAgICBpZiAoIWlzSXB2NiAmJiB0aGlzLmFsbG93QWxsT3V0Ym91bmQpIHtcbiAgICAgIC8vIEluIHRoZSBjYXNlIG9mIFwiYWxsb3dBbGxPdXRib3VuZFwiLCB3ZSBkb24ndCBhZGQgYW55IG1vcmUgcnVsZXMuIFRoZXJlXG4gICAgICAvLyBpcyBvbmx5IG9uZSBydWxlIHdoaWNoIGFsbG93cyBhbGwgdHJhZmZpYyBhbmQgdGhhdCBzdWJzdW1lcyBhbnkgb3RoZXJcbiAgICAgIC8vIHJ1bGUuXG4gICAgICBpZiAoIXJlbW90ZVJ1bGUpIHsgLy8gV2FybiBvbmx5IGlmIGFkZEVncmVzc1J1bGUoKSB3YXMgZXhwbGljaXRlbHkgY2FsbGVkXG4gICAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoJ0lnbm9yaW5nIEVncmVzcyBydWxlIHNpbmNlIFxcJ2FsbG93QWxsT3V0Ym91bmRcXCcgaXMgc2V0IHRvIHRydWU7IFRvIGFkZCBjdXN0b21pemVkIHJ1bGVzLCBzZXQgYWxsb3dBbGxPdXRib3VuZD1mYWxzZSBvbiB0aGUgU2VjdXJpdHlHcm91cCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoIWlzSXB2NiAmJiAhdGhpcy5hbGxvd0FsbE91dGJvdW5kKSB7XG4gICAgICAvLyBPdGhlcndpc2UsIGlmIHRoZSBib2d1cyBydWxlIGV4aXN0cyB3ZSBjYW4gbm93IHJlbW92ZSBpdCBiZWNhdXNlIHRoZVxuICAgICAgLy8gcHJlc2VuY2Ugb2YgYW55IG90aGVyIHJ1bGUgd2lsbCBnZXQgcmlkIG9mIEVDMidzIGltcGxpY2l0IFwiYWxsXG4gICAgICAvLyBvdXRib3VuZFwiIHJ1bGUgYW55d2F5LlxuICAgICAgdGhpcy5yZW1vdmVOb1RyYWZmaWNSdWxlKCk7XG4gICAgfVxuXG4gICAgaWYgKGlzSXB2NiAmJiB0aGlzLmFsbG93QWxsSXB2Nk91dGJvdW5kKSB7XG4gICAgICAvLyBJbiB0aGUgY2FzZSBvZiBcImFsbG93QWxsSXB2Nk91dGJvdW5kXCIsIHdlIGRvbid0IGFkZCBhbnkgbW9yZSBydWxlcy4gVGhlcmVcbiAgICAgIC8vIGlzIG9ubHkgb25lIHJ1bGUgd2hpY2ggYWxsb3dzIGFsbCB0cmFmZmljIGFuZCB0aGF0IHN1YnN1bWVzIGFueSBvdGhlclxuICAgICAgLy8gcnVsZS5cbiAgICAgIGlmICghcmVtb3RlUnVsZSkgeyAvLyBXYXJuIG9ubHkgaWYgYWRkRWdyZXNzUnVsZSgpIHdhcyBleHBsaWNpdGVseSBjYWxsZWRcbiAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZygnSWdub3JpbmcgRWdyZXNzIHJ1bGUgc2luY2UgXFwnYWxsb3dBbGxJcHY2T3V0Ym91bmRcXCcgaXMgc2V0IHRvIHRydWU7IFRvIGFkZCBjdXN0b21pemVkIHJ1bGVzLCBzZXQgYWxsb3dBbGxJcHY2T3V0Ym91bmQ9ZmFsc2Ugb24gdGhlIFNlY3VyaXR5R3JvdXAnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXBlZXIuY2FuSW5saW5lUnVsZSB8fCAhY29ubmVjdGlvbi5jYW5JbmxpbmVSdWxlIHx8IHRoaXMuZGlzYWJsZUlubGluZVJ1bGVzKSB7XG4gICAgICBzdXBlci5hZGRFZ3Jlc3NSdWxlKHBlZXIsIGNvbm5lY3Rpb24sIGRlc2NyaXB0aW9uLCByZW1vdGVSdWxlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVzY3JpcHRpb24gPSBgZnJvbSAke3BlZXIudW5pcXVlSWR9OiR7Y29ubmVjdGlvbn1gO1xuICAgIH1cblxuICAgIGNvbnN0IHJ1bGUgPSB7XG4gICAgICAuLi5wZWVyLnRvRWdyZXNzUnVsZUNvbmZpZygpLFxuICAgICAgLi4uY29ubmVjdGlvbi50b1J1bGVKc29uKCksXG4gICAgICBkZXNjcmlwdGlvbixcbiAgICB9O1xuXG4gICAgaWYgKGlzQWxsVHJhZmZpY1J1bGUocnVsZSkpIHtcbiAgICAgIC8vIFdlIGNhbm5vdCBhbGxvdyB0aGlzOyBpZiBzb21lb25lIGFkZHMgdGhlIHJ1bGUgaW4gdGhpcyB3YXksIGl0IHdpbGwgYmVcbiAgICAgIC8vIHJlbW92ZWQgYWdhaW4gaWYgdGhleSBhZGQgb3RoZXIgcnVsZXMuIFdlIGFsc28gY2FuJ3QgYXV0b21hdGljYWxseSBzd2l0Y2hcbiAgICAgIC8vIHRvIFwiYWxsT3V0Ym91bmQ9dHJ1ZVwiIG1vZGUsIGJlY2F1c2Ugd2UgbWlnaHQgaGF2ZSBhbHJlYWR5IGVtaXR0ZWRcbiAgICAgIC8vIEVncmVzc1J1bGUgb2JqZWN0cyAod2hpY2ggY291bnQgYXMgcnVsZXMgYWRkZWQgbGF0ZXIpIGFuZCB0aGVyZSdzIG5vIHdheVxuICAgICAgLy8gdG8gcmVjYWxsIHRob3NlLiBCZXR0ZXIgdG8gcHJldmVudCB0aGlzIGZvciBub3cuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgYW4gXCJhbGwgdHJhZmZpY1wiIGVncmVzcyBydWxlIGluIHRoaXMgd2F5OyBzZXQgYWxsb3dBbGxPdXRib3VuZD10cnVlIChmb3IgaXB2Nikgb3IgYWxsb3dBbGxJcHY2T3V0Ym91bmQ9dHJ1ZSAoZm9yIGlwdjYpIG9uIHRoZSBTZWN1cml0eUdyb3VwIGluc3RlYWQuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5hZGREaXJlY3RFZ3Jlc3NSdWxlKHJ1bGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGRpcmVjdCBpbmdyZXNzIHJ1bGVcbiAgICovXG4gIHByaXZhdGUgYWRkRGlyZWN0SW5ncmVzc1J1bGUocnVsZTogQ2ZuU2VjdXJpdHlHcm91cC5JbmdyZXNzUHJvcGVydHkpIHtcbiAgICBpZiAoIXRoaXMuaGFzSW5ncmVzc1J1bGUocnVsZSkpIHtcbiAgICAgIHRoaXMuZGlyZWN0SW5ncmVzc1J1bGVzLnB1c2gocnVsZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB3aGV0aGVyIHRoZSBnaXZlbiBpbmdyZXNzIHJ1bGUgZXhpc3RzIG9uIHRoZSBncm91cFxuICAgKi9cbiAgcHJpdmF0ZSBoYXNJbmdyZXNzUnVsZShydWxlOiBDZm5TZWN1cml0eUdyb3VwLkluZ3Jlc3NQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpcmVjdEluZ3Jlc3NSdWxlcy5maW5kSW5kZXgociA9PiBpbmdyZXNzUnVsZXNFcXVhbChyLCBydWxlKSkgPiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBkaXJlY3QgZWdyZXNzIHJ1bGVcbiAgICovXG4gIHByaXZhdGUgYWRkRGlyZWN0RWdyZXNzUnVsZShydWxlOiBDZm5TZWN1cml0eUdyb3VwLkVncmVzc1Byb3BlcnR5KSB7XG4gICAgaWYgKCF0aGlzLmhhc0VncmVzc1J1bGUocnVsZSkpIHtcbiAgICAgIHRoaXMuZGlyZWN0RWdyZXNzUnVsZXMucHVzaChydWxlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHdoZXRoZXIgdGhlIGdpdmVuIGVncmVzcyBydWxlIGV4aXN0cyBvbiB0aGUgZ3JvdXBcbiAgICovXG4gIHByaXZhdGUgaGFzRWdyZXNzUnVsZShydWxlOiBDZm5TZWN1cml0eUdyb3VwLkVncmVzc1Byb3BlcnR5KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlyZWN0RWdyZXNzUnVsZXMuZmluZEluZGV4KHIgPT4gZWdyZXNzUnVsZXNFcXVhbChyLCBydWxlKSkgPiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGRlZmF1bHQgZWdyZXNzIHJ1bGUgdG8gdGhlIHNlY3VyaXR5R3JvdXBcbiAgICpcbiAgICogVGhpcyBkZXBlbmRzIG9uIGFsbG93QWxsT3V0Ym91bmQ6XG4gICAqXG4gICAqIC0gSWYgYWxsb3dBbGxPdXRib3VuZCBpcyB0cnVlLCB3ZSAqVEVDSE5JQ0FMTFkqIGRvbid0IG5lZWQgdG8gZG8gYW55dGhpbmcsIGJlY2F1c2VcbiAgICogICBFQzIgaXMgZ29pbmcgdG8gY3JlYXRlIHRoaXMgZGVmYXVsdCBydWxlIGFueXdheS4gQnV0LCBmb3IgbWF4aW11bSByZWFkYWJpbGl0eVxuICAgKiAgIG9mIHRoZSB0ZW1wbGF0ZSwgd2Ugd2lsbCBhZGQgb25lIGFueXdheS5cbiAgICogLSBJZiBhbGxvd0FsbE91dGJvdW5kIGlzIGZhbHNlLCB3ZSBhZGQgYSBib2d1cyBydWxlIHRoYXQgbWF0Y2hlcyBubyB0cmFmZmljIGluXG4gICAqICAgb3JkZXIgdG8gZ2V0IHJpZCBvZiB0aGUgZGVmYXVsdCBcImFsbCBvdXRib3VuZFwiIHJ1bGUgdGhhdCBFQzIgY3JlYXRlcyBieSBkZWZhdWx0LlxuICAgKiAgIElmIG90aGVyIHJ1bGVzIGhhcHBlbiB0byBnZXQgYWRkZWQgbGF0ZXIsIHdlIHJlbW92ZSB0aGUgYm9ndXMgcnVsZSBhZ2FpbiBzb1xuICAgKiAgIHRoYXQgaXQgZG9lc24ndCBjbHV0dGVyIHVwIHRoZSB0ZW1wbGF0ZSB0b28gbXVjaCAoZXZlbiB0aG91Z2ggdGhhdCdzIG5vdFxuICAgKiAgIHN0cmljdGx5IG5lY2Vzc2FyeSkuXG4gICAqL1xuICBwcml2YXRlIGFkZERlZmF1bHRFZ3Jlc3NSdWxlKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVJbmxpbmVSdWxlcykge1xuICAgICAgY29uc3QgcGVlciA9IHRoaXMuYWxsb3dBbGxPdXRib3VuZCA/IEFMTF9UUkFGRklDX1BFRVIgOiBOT19UUkFGRklDX1BFRVI7XG4gICAgICBjb25zdCBwb3J0ID0gdGhpcy5hbGxvd0FsbE91dGJvdW5kID8gQUxMX1RSQUZGSUNfUE9SVCA6IE5PX1RSQUZGSUNfUE9SVDtcbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5hbGxvd0FsbE91dGJvdW5kID8gQUxMT1dfQUxMX1JVTEUuZGVzY3JpcHRpb24gOiBNQVRDSF9OT19UUkFGRklDLmRlc2NyaXB0aW9uO1xuICAgICAgc3VwZXIuYWRkRWdyZXNzUnVsZShwZWVyLCBwb3J0LCBkZXNjcmlwdGlvbiwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBydWxlID0gdGhpcy5hbGxvd0FsbE91dGJvdW5kPyBBTExPV19BTExfUlVMRSA6IE1BVENIX05PX1RSQUZGSUM7XG4gICAgICB0aGlzLmRpcmVjdEVncmVzc1J1bGVzLnB1c2gocnVsZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGFsbG93IGFsbCBpcHY2IGVncmVzcyBydWxlIHRvIHRoZSBzZWN1cml0eUdyb3VwXG4gICAqXG4gICAqIFRoaXMgZGVwZW5kcyBvbiBhbGxvd0FsbElwdjZPdXRib3VuZDpcbiAgICpcbiAgICogLSBJZiBhbGxvd0FsbElwdjZPdXRib3VuZCBpcyB0cnVlLCB3ZSB3aWxsIGFkZCBhbiBhbGxvdyBhbGwgcnVsZS5cbiAgICogLSBJZiBhbGxvd0FsbE91dGJvdW5kIGlzIGZhbHNlLCB3ZSBkb24ndCBkbyBhbnl0aGluZyBzaW5jZSBFQzIgZG9lcyBub3QgYWRkXG4gICAqICAgYSBkZWZhdWx0IGFsbG93IGFsbCBpcHY2IHJ1bGUuXG4gICAqL1xuICBwcml2YXRlIGFkZERlZmF1bHRJcHY2RWdyZXNzUnVsZSgpIHtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9ICdBbGxvdyBhbGwgb3V0Ym91bmQgaXB2NiB0cmFmZmljIGJ5IGRlZmF1bHQnO1xuICAgIGNvbnN0IHBlZXIgPSBQZWVyLmFueUlwdjYoKTtcbiAgICBpZiAodGhpcy5hbGxvd0FsbElwdjZPdXRib3VuZCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZUlubGluZVJ1bGVzKSB7XG4gICAgICAgIHN1cGVyLmFkZEVncmVzc1J1bGUocGVlciwgUG9ydC5hbGxUcmFmZmljKCksIGRlc2NyaXB0aW9uLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpcmVjdEVncmVzc1J1bGVzLnB1c2goe1xuICAgICAgICAgIGlwUHJvdG9jb2w6ICctMScsXG4gICAgICAgICAgY2lkcklwdjY6IHBlZXIudW5pcXVlSWQsXG4gICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIGJvZ3VzIHJ1bGUgaWYgaXQgZXhpc3RzXG4gICAqL1xuICBwcml2YXRlIHJlbW92ZU5vVHJhZmZpY1J1bGUoKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZUlubGluZVJ1bGVzKSB7XG4gICAgICBjb25zdCB7IHNjb3BlLCBpZCB9ID0gdGhpcy5kZXRlcm1pbmVSdWxlU2NvcGUoXG4gICAgICAgIE5PX1RSQUZGSUNfUEVFUixcbiAgICAgICAgTk9fVFJBRkZJQ19QT1JULFxuICAgICAgICAndG8nLFxuICAgICAgICBmYWxzZSxcbiAgICAgICk7XG4gICAgICBzY29wZS5ub2RlLnRyeVJlbW92ZUNoaWxkKGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaSA9IHRoaXMuZGlyZWN0RWdyZXNzUnVsZXMuZmluZEluZGV4KHIgPT4gZWdyZXNzUnVsZXNFcXVhbChyLCBNQVRDSF9OT19UUkFGRklDKSk7XG4gICAgICBpZiAoaSA+IC0xKSB7XG4gICAgICAgIHRoaXMuZGlyZWN0RWdyZXNzUnVsZXMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEVncmVzcyBydWxlIHRoYXQgcHVycG9zZWx5IG1hdGNoZXMgbm8gdHJhZmZpY1xuICpcbiAqIFRoaXMgaXMgdXNlZCBpbiBvcmRlciB0byBkaXNhYmxlIHRoZSBcImFsbCB0cmFmZmljXCIgZGVmYXVsdCBvZiBTZWN1cml0eSBHcm91cHMuXG4gKlxuICogTm8gbWFjaGluZSBjYW4gZXZlciBhY3R1YWxseSBoYXZlIHRoZSAyNTUuMjU1LjI1NS4yNTUgSVAgYWRkcmVzcywgYnV0XG4gKiBpbiBvcmRlciB0byBsb2NrIGl0IGRvd24gZXZlbiBtb3JlIHdlJ2xsIHJlc3RyaWN0IHRvIGEgbm9uZXhpc3RlbnRcbiAqIElDTVAgdHJhZmZpYyB0eXBlLlxuICovXG5jb25zdCBNQVRDSF9OT19UUkFGRklDID0ge1xuICBjaWRySXA6ICcyNTUuMjU1LjI1NS4yNTUvMzInLFxuICBkZXNjcmlwdGlvbjogJ0Rpc2FsbG93IGFsbCB0cmFmZmljJyxcbiAgaXBQcm90b2NvbDogJ2ljbXAnLFxuICBmcm9tUG9ydDogMjUyLFxuICB0b1BvcnQ6IDg2LFxufTtcblxuY29uc3QgTk9fVFJBRkZJQ19QRUVSID0gUGVlci5pcHY0KE1BVENIX05PX1RSQUZGSUMuY2lkcklwKTtcbmNvbnN0IE5PX1RSQUZGSUNfUE9SVCA9IFBvcnQuaWNtcFR5cGVBbmRDb2RlKE1BVENIX05PX1RSQUZGSUMuZnJvbVBvcnQsIE1BVENIX05PX1RSQUZGSUMudG9Qb3J0KTtcblxuLyoqXG4gKiBFZ3Jlc3MgcnVsZSB0aGF0IG1hdGNoZXMgYWxsIHRyYWZmaWNcbiAqL1xuY29uc3QgQUxMT1dfQUxMX1JVTEUgPSB7XG4gIGNpZHJJcDogJzAuMC4wLjAvMCcsXG4gIGRlc2NyaXB0aW9uOiAnQWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdCcsXG4gIGlwUHJvdG9jb2w6ICctMScsXG59O1xuXG5jb25zdCBBTExfVFJBRkZJQ19QRUVSID0gUGVlci5hbnlJcHY0KCk7XG5jb25zdCBBTExfVFJBRkZJQ19QT1JUID0gUG9ydC5hbGxUcmFmZmljKCk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdGlvblJ1bGUge1xuICAvKipcbiAgICogVGhlIElQIHByb3RvY29sIG5hbWUgKHRjcCwgdWRwLCBpY21wKSBvciBudW1iZXIgKHNlZSBQcm90b2NvbCBOdW1iZXJzKS5cbiAgICogVXNlIC0xIHRvIHNwZWNpZnkgYWxsIHByb3RvY29scy4gSWYgeW91IHNwZWNpZnkgLTEsIG9yIGEgcHJvdG9jb2wgbnVtYmVyXG4gICAqIG90aGVyIHRoYW4gdGNwLCB1ZHAsIGljbXAsIG9yIDU4IChJQ01QdjYpLCB0cmFmZmljIG9uIGFsbCBwb3J0cyBpc1xuICAgKiBhbGxvd2VkLCByZWdhcmRsZXNzIG9mIGFueSBwb3J0cyB5b3Ugc3BlY2lmeS4gRm9yIHRjcCwgdWRwLCBhbmQgaWNtcCwgeW91XG4gICAqIG11c3Qgc3BlY2lmeSBhIHBvcnQgcmFuZ2UuIEZvciBwcm90b2NvbCA1OCAoSUNNUHY2KSwgeW91IGNhbiBvcHRpb25hbGx5XG4gICAqIHNwZWNpZnkgYSBwb3J0IHJhbmdlOyBpZiB5b3UgZG9uJ3QsIHRyYWZmaWMgZm9yIGFsbCB0eXBlcyBhbmQgY29kZXMgaXNcbiAgICogYWxsb3dlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgdGNwXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbD86IHN0cmluZztcblxuICAvKipcbiAgICogU3RhcnQgb2YgcG9ydCByYW5nZSBmb3IgdGhlIFRDUCBhbmQgVURQIHByb3RvY29scywgb3IgYW4gSUNNUCB0eXBlIG51bWJlci5cbiAgICpcbiAgICogSWYgeW91IHNwZWNpZnkgaWNtcCBmb3IgdGhlIElwUHJvdG9jb2wgcHJvcGVydHksIHlvdSBjYW4gc3BlY2lmeVxuICAgKiAtMSBhcyBhIHdpbGRjYXJkIChpLmUuLCBhbnkgSUNNUCB0eXBlIG51bWJlcikuXG4gICAqL1xuICByZWFkb25seSBmcm9tUG9ydDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBFbmQgb2YgcG9ydCByYW5nZSBmb3IgdGhlIFRDUCBhbmQgVURQIHByb3RvY29scywgb3IgYW4gSUNNUCBjb2RlLlxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSBpY21wIGZvciB0aGUgSXBQcm90b2NvbCBwcm9wZXJ0eSwgeW91IGNhbiBzcGVjaWZ5IC0xIGFzIGFcbiAgICogd2lsZGNhcmQgKGkuZS4sIGFueSBJQ01QIGNvZGUpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBJZiB0b1BvcnQgaXMgbm90IHNwZWNpZmllZCwgaXQgd2lsbCBiZSB0aGUgc2FtZSBhcyBmcm9tUG9ydC5cbiAgICovXG4gIHJlYWRvbmx5IHRvUG9ydD86IG51bWJlcjtcblxuICAvKipcbiAgICogRGVzY3JpcHRpb24gb2YgdGhpcyBjb25uZWN0aW9uLiBJdCBpcyBhcHBsaWVkIHRvIGJvdGggdGhlIGluZ3Jlc3MgcnVsZVxuICAgKiBhbmQgdGhlIGVncmVzcyBydWxlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBkZXNjcmlwdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29tcGFyZSB0d28gaW5ncmVzcyBydWxlcyBmb3IgZXF1YWxpdHkgdGhlIHNhbWUgd2F5IENsb3VkRm9ybWF0aW9uIHdvdWxkIChkaXNjYXJkaW5nIGRlc2NyaXB0aW9uKVxuICovXG5mdW5jdGlvbiBpbmdyZXNzUnVsZXNFcXVhbChhOiBDZm5TZWN1cml0eUdyb3VwLkluZ3Jlc3NQcm9wZXJ0eSwgYjogQ2ZuU2VjdXJpdHlHcm91cC5JbmdyZXNzUHJvcGVydHkpIHtcbiAgcmV0dXJuIGEuY2lkcklwID09PSBiLmNpZHJJcFxuICAgICYmIGEuY2lkcklwdjYgPT09IGIuY2lkcklwdjZcbiAgICAmJiBhLmZyb21Qb3J0ID09PSBiLmZyb21Qb3J0XG4gICAgJiYgYS50b1BvcnQgPT09IGIudG9Qb3J0XG4gICAgJiYgYS5pcFByb3RvY29sID09PSBiLmlwUHJvdG9jb2xcbiAgICAmJiBhLnNvdXJjZVNlY3VyaXR5R3JvdXBJZCA9PT0gYi5zb3VyY2VTZWN1cml0eUdyb3VwSWRcbiAgICAmJiBhLnNvdXJjZVNlY3VyaXR5R3JvdXBOYW1lID09PSBiLnNvdXJjZVNlY3VyaXR5R3JvdXBOYW1lXG4gICAgJiYgYS5zb3VyY2VTZWN1cml0eUdyb3VwT3duZXJJZCA9PT0gYi5zb3VyY2VTZWN1cml0eUdyb3VwT3duZXJJZDtcbn1cblxuLyoqXG4gKiBDb21wYXJlIHR3byBlZ3Jlc3MgcnVsZXMgZm9yIGVxdWFsaXR5IHRoZSBzYW1lIHdheSBDbG91ZEZvcm1hdGlvbiB3b3VsZCAoZGlzY2FyZGluZyBkZXNjcmlwdGlvbilcbiAqL1xuZnVuY3Rpb24gZWdyZXNzUnVsZXNFcXVhbChhOiBDZm5TZWN1cml0eUdyb3VwLkVncmVzc1Byb3BlcnR5LCBiOiBDZm5TZWN1cml0eUdyb3VwLkVncmVzc1Byb3BlcnR5KSB7XG4gIHJldHVybiBhLmNpZHJJcCA9PT0gYi5jaWRySXBcbiAgICAmJiBhLmNpZHJJcHY2ID09PSBiLmNpZHJJcHY2XG4gICAgJiYgYS5mcm9tUG9ydCA9PT0gYi5mcm9tUG9ydFxuICAgICYmIGEudG9Qb3J0ID09PSBiLnRvUG9ydFxuICAgICYmIGEuaXBQcm90b2NvbCA9PT0gYi5pcFByb3RvY29sXG4gICAgJiYgYS5kZXN0aW5hdGlvblByZWZpeExpc3RJZCA9PT0gYi5kZXN0aW5hdGlvblByZWZpeExpc3RJZFxuICAgICYmIGEuZGVzdGluYXRpb25TZWN1cml0eUdyb3VwSWQgPT09IGIuZGVzdGluYXRpb25TZWN1cml0eUdyb3VwSWQ7XG59XG5cbi8qKlxuICogV2hldGhlciB0aGlzIHJ1bGUgcmVmZXJzIHRvIGFsbCB0cmFmZmljXG4gKi9cbmZ1bmN0aW9uIGlzQWxsVHJhZmZpY1J1bGUocnVsZTogYW55KSB7XG4gIHJldHVybiAocnVsZS5jaWRySXAgPT09ICcwLjAuMC4wLzAnIHx8IHJ1bGUuY2lkcklwdjYgPT09ICc6Oi8wJykgJiYgcnVsZS5pcFByb3RvY29sID09PSAnLTEnO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGxvb2tpbmcgdXAgYW4gZXhpc3RpbmcgU2VjdXJpdHlHcm91cC5cbiAqXG4gKiBFaXRoZXIgYHNlY3VyaXR5R3JvdXBOYW1lYCBvciBgc2VjdXJpdHlHcm91cElkYCBoYXMgdG8gYmUgc3BlY2lmaWVkLlxuICovXG5pbnRlcmZhY2UgU2VjdXJpdHlHcm91cExvb2t1cE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNlY3VyaXR5IGdyb3VwXG4gICAqXG4gICAqIElmIGdpdmVuLCB3aWxsIGltcG9ydCB0aGUgU2VjdXJpdHlHcm91cCB3aXRoIHRoaXMgbmFtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgRG9uJ3QgZmlsdGVyIG9uIHNlY3VyaXR5R3JvdXBOYW1lXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBzZWN1cml0eSBncm91cFxuICAgKlxuICAgKiBJZiBnaXZlbiwgd2lsbCBpbXBvcnQgdGhlIFNlY3VyaXR5R3JvdXAgd2l0aCB0aGlzIElELlxuICAgKlxuICAgKiBAZGVmYXVsdCBEb24ndCBmaWx0ZXIgb24gc2VjdXJpdHlHcm91cElkXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBWUEMgb2YgdGhlIHNlY3VyaXR5IGdyb3VwXG4gICAqXG4gICAqIElmIGdpdmVuLCB3aWxsIGZpbHRlciB0aGUgU2VjdXJpdHlHcm91cCBiYXNlZCBvbiB0aGUgVlBDLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEb24ndCBmaWx0ZXIgb24gVlBDXG4gICAqL1xuICByZWFkb25seSB2cGM/OiBJVnBjLFxufVxuIl19