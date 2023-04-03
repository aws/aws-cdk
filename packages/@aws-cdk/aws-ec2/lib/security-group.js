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
    constructor(scope, id, props) {
        super(scope, id, props);
        this.canInlineRule = false;
        this.connections = new connections_1.Connections({ securityGroups: [this] });
        this.peerAsTokenCount = 0;
        Object.defineProperty(this, SECURITY_GROUP_SYMBOL, { value: true });
    }
    /**
     * Return whether the indicated object is a security group
     */
    static isSecurityGroup(x) {
        return SECURITY_GROUP_SYMBOL in x;
    }
    get uniqueId() {
        return core_1.Names.nodeUniqueId(this.node);
    }
    addIngressRule(peer, connection, description, remoteRule) {
        if (description === undefined) {
            description = `from ${peer.uniqueId}:${connection}`;
        }
        const [scope, id] = this.determineRuleScope(peer, connection, 'from', remoteRule);
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
        const [scope, id] = this.determineRuleScope(peer, connection, 'to', remoteRule);
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
            return [peer, `${this.uniqueId}:${connection} ${reversedFromTo}`];
        }
        else {
            // Regular (do old ID escaping to in order to not disturb existing deployments)
            return [this, `${fromTo} ${this.renderPeer(peer)}:${connection}`.replace('/', '_')];
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
            const [scope, id] = this.determineRuleScope(NO_TRAFFIC_PEER, NO_TRAFFIC_PORT, 'to', false);
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
exports.SecurityGroup = SecurityGroup;
_a = JSII_RTTI_SYMBOL_1;
SecurityGroup[_a] = { fqn: "@aws-cdk/aws-ec2.SecurityGroup", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHktZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWN1cml0eS1ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyREFBMkQ7QUFDM0Qsd0NBQTRIO0FBRzVILCtDQUE0QztBQUM1QyxtREFBb0c7QUFDcEcsaUNBQXFDO0FBQ3JDLGlDQUE4QjtBQUc5QixNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUV2RSxNQUFNLCtDQUErQyxHQUFHLGtEQUFrRCxDQUFDO0FBd0MzRzs7R0FFRztBQUNILE1BQWUsaUJBQWtCLFNBQVEsZUFBUTtJQWtCL0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQVBWLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLGdCQUFXLEdBQWdCLElBQUkseUJBQVcsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUcvRSxxQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFLbkMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNyRTtJQXJCRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBTTtRQUNsQyxPQUFPLHFCQUFxQixJQUFJLENBQUMsQ0FBQztLQUNuQztJQWtCRCxJQUFXLFFBQVE7UUFDakIsT0FBTyxZQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0QztJQUVNLGNBQWMsQ0FBQyxJQUFXLEVBQUUsVUFBZ0IsRUFBRSxXQUFvQixFQUFFLFVBQW9CO1FBQzdGLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM3QixXQUFXLEdBQUcs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QUMsUUFBUTtXQUN6QixDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxRQUFRO1dBQ3pCLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU07V0FDckIsQ0FBQyxDQUFDLFVBQVUsS0FBSyxDQUFDLENBQUMsVUFBVTtXQUM3QixDQUFDLENBQUMscUJBQXFCLEtBQUssQ0FBQyxDQUFDLHFCQUFxQjtXQUNuRCxDQUFDLENBQUMsdUJBQXVCLEtBQUssQ0FBQyxDQUFDLHVCQUF1QjtXQUN2RCxDQUFDLENBQUMsMEJBQTBCLEtBQUssQ0FBQyxDQUFDLDBCQUEwQixDQUFDO0FBQ3JFLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZ0JBQWdCLENBQUMsQ0FBa0MsRUFBRSxDQUFrQztJQUM5RixPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU07V0FDdkIsQ0FBQyxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsUUFBUTtXQUN6QixDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxRQUFRO1dBQ3pCLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU07V0FDckIsQ0FBQyxDQUFDLFVBQVUsS0FBSyxDQUFDLENBQUMsVUFBVTtXQUM3QixDQUFDLENBQUMsdUJBQXVCLEtBQUssQ0FBQyxDQUFDLHVCQUF1QjtXQUN2RCxDQUFDLENBQUMsMEJBQTBCLEtBQUssQ0FBQyxDQUFDLDBCQUEwQixDQUFDO0FBQ3JFLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZ0JBQWdCLENBQUMsSUFBUztJQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxXQUFXLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQztBQUMvRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCB7IEFubm90YXRpb25zLCBDb250ZXh0UHJvdmlkZXIsIElSZXNvdXJjZSwgTGF6eSwgTmFtZXMsIFJlc291cmNlLCBSZXNvdXJjZVByb3BzLCBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvbm5lY3Rpb25zIH0gZnJvbSAnLi9jb25uZWN0aW9ucyc7XG5pbXBvcnQgeyBDZm5TZWN1cml0eUdyb3VwLCBDZm5TZWN1cml0eUdyb3VwRWdyZXNzLCBDZm5TZWN1cml0eUdyb3VwSW5ncmVzcyB9IGZyb20gJy4vZWMyLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJUGVlciwgUGVlciB9IGZyb20gJy4vcGVlcic7XG5pbXBvcnQgeyBQb3J0IH0gZnJvbSAnLi9wb3J0JztcbmltcG9ydCB7IElWcGMgfSBmcm9tICcuL3ZwYyc7XG5cbmNvbnN0IFNFQ1VSSVRZX0dST1VQX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2lhbS5TZWN1cml0eUdyb3VwJyk7XG5cbmNvbnN0IFNFQ1VSSVRZX0dST1VQX0RJU0FCTEVfSU5MSU5FX1JVTEVTX0NPTlRFWFRfS0VZID0gJ0Bhd3MtY2RrL2F3cy1lYzIuc2VjdXJpdHlHcm91cERpc2FibGVJbmxpbmVSdWxlcyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBzZWN1cml0eSBncm91cC1saWtlIG9iamVjdHNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU2VjdXJpdHlHcm91cCBleHRlbmRzIElSZXNvdXJjZSwgSVBlZXIge1xuICAvKipcbiAgICogSUQgZm9yIHRoZSBjdXJyZW50IHNlY3VyaXR5IGdyb3VwXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBTZWN1cml0eUdyb3VwIGhhcyBiZWVuIGNvbmZpZ3VyZWQgdG8gYWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWNcbiAgICovXG4gIHJlYWRvbmx5IGFsbG93QWxsT3V0Ym91bmQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBpbmdyZXNzIHJ1bGUgZm9yIHRoZSBjdXJyZW50IHNlY3VyaXR5IGdyb3VwXG4gICAqXG4gICAqIGByZW1vdGVSdWxlYCBjb250cm9scyB3aGVyZSB0aGUgUnVsZSBvYmplY3QgaXMgY3JlYXRlZCBpZiB0aGUgcGVlciBpcyBhbHNvIGFcbiAgICogc2VjdXJpdHlHcm91cCBhbmQgdGhleSBhcmUgaW4gZGlmZmVyZW50IHN0YWNrLiBJZiBmYWxzZSAoZGVmYXVsdCkgdGhlXG4gICAqIHJ1bGUgb2JqZWN0IGlzIGNyZWF0ZWQgdW5kZXIgdGhlIGN1cnJlbnQgU2VjdXJpdHlHcm91cCBvYmplY3QuIElmIHRydWUgYW5kIHRoZVxuICAgKiBwZWVyIGlzIGFsc28gYSBTZWN1cml0eUdyb3VwLCB0aGUgcnVsZSBvYmplY3QgaXMgY3JlYXRlZCB1bmRlciB0aGUgcmVtb3RlXG4gICAqIFNlY3VyaXR5R3JvdXAgb2JqZWN0LlxuICAgKi9cbiAgYWRkSW5ncmVzc1J1bGUocGVlcjogSVBlZXIsIGNvbm5lY3Rpb246IFBvcnQsIGRlc2NyaXB0aW9uPzogc3RyaW5nLCByZW1vdGVSdWxlPzogYm9vbGVhbik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBlZ3Jlc3MgcnVsZSBmb3IgdGhlIGN1cnJlbnQgc2VjdXJpdHkgZ3JvdXBcbiAgICpcbiAgICogYHJlbW90ZVJ1bGVgIGNvbnRyb2xzIHdoZXJlIHRoZSBSdWxlIG9iamVjdCBpcyBjcmVhdGVkIGlmIHRoZSBwZWVyIGlzIGFsc28gYVxuICAgKiBzZWN1cml0eUdyb3VwIGFuZCB0aGV5IGFyZSBpbiBkaWZmZXJlbnQgc3RhY2suIElmIGZhbHNlIChkZWZhdWx0KSB0aGVcbiAgICogcnVsZSBvYmplY3QgaXMgY3JlYXRlZCB1bmRlciB0aGUgY3VycmVudCBTZWN1cml0eUdyb3VwIG9iamVjdC4gSWYgdHJ1ZSBhbmQgdGhlXG4gICAqIHBlZXIgaXMgYWxzbyBhIFNlY3VyaXR5R3JvdXAsIHRoZSBydWxlIG9iamVjdCBpcyBjcmVhdGVkIHVuZGVyIHRoZSByZW1vdGVcbiAgICogU2VjdXJpdHlHcm91cCBvYmplY3QuXG4gICAqL1xuICBhZGRFZ3Jlc3NSdWxlKHBlZXI6IElQZWVyLCBjb25uZWN0aW9uOiBQb3J0LCBkZXNjcmlwdGlvbj86IHN0cmluZywgcmVtb3RlUnVsZT86IGJvb2xlYW4pOiB2b2lkO1xufVxuXG4vKipcbiAqIEEgU2VjdXJpdHlHcm91cCB0aGF0IGlzIG5vdCBjcmVhdGVkIGluIHRoaXMgdGVtcGxhdGVcbiAqL1xuYWJzdHJhY3QgY2xhc3MgU2VjdXJpdHlHcm91cEJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElTZWN1cml0eUdyb3VwIHtcbiAgLyoqXG4gICAqIFJldHVybiB3aGV0aGVyIHRoZSBpbmRpY2F0ZWQgb2JqZWN0IGlzIGEgc2VjdXJpdHkgZ3JvdXBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNTZWN1cml0eUdyb3VwKHg6IGFueSk6IHggaXMgU2VjdXJpdHlHcm91cEJhc2Uge1xuICAgIHJldHVybiBTRUNVUklUWV9HUk9VUF9TWU1CT0wgaW4geDtcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBzZWN1cml0eUdyb3VwSWQ6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGFsbG93QWxsT3V0Ym91bmQ6IGJvb2xlYW47XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBhbGxvd0FsbElwdjZPdXRib3VuZDogYm9vbGVhbjtcblxuICBwdWJsaWMgcmVhZG9ubHkgY2FuSW5saW5lUnVsZSA9IGZhbHNlO1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbnM6IENvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25zKHsgc2VjdXJpdHlHcm91cHM6IFt0aGlzXSB9KTtcbiAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRQb3J0PzogUG9ydDtcblxuICBwcml2YXRlIHBlZXJBc1Rva2VuQ291bnQ6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBSZXNvdXJjZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgU0VDVVJJVFlfR1JPVVBfU1lNQk9MLCB7IHZhbHVlOiB0cnVlIH0pO1xuICB9XG5cbiAgcHVibGljIGdldCB1bmlxdWVJZCgpIHtcbiAgICByZXR1cm4gTmFtZXMubm9kZVVuaXF1ZUlkKHRoaXMubm9kZSk7XG4gIH1cblxuICBwdWJsaWMgYWRkSW5ncmVzc1J1bGUocGVlcjogSVBlZXIsIGNvbm5lY3Rpb246IFBvcnQsIGRlc2NyaXB0aW9uPzogc3RyaW5nLCByZW1vdGVSdWxlPzogYm9vbGVhbikge1xuICAgIGlmIChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IGBmcm9tICR7cGVlci51bmlxdWVJZH06JHtjb25uZWN0aW9ufWA7XG4gICAgfVxuXG4gICAgY29uc3QgW3Njb3BlLCBpZF0gPSB0aGlzLmRldGVybWluZVJ1bGVTY29wZShwZWVyLCBjb25uZWN0aW9uLCAnZnJvbScsIHJlbW90ZVJ1bGUpO1xuXG4gICAgLy8gU2tpcCBkdXBsaWNhdGVzXG4gICAgaWYgKHNjb3BlLm5vZGUudHJ5RmluZENoaWxkKGlkKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXcgQ2ZuU2VjdXJpdHlHcm91cEluZ3Jlc3Moc2NvcGUsIGlkLCB7XG4gICAgICAgIGdyb3VwSWQ6IHRoaXMuc2VjdXJpdHlHcm91cElkLFxuICAgICAgICAuLi5wZWVyLnRvSW5ncmVzc1J1bGVDb25maWcoKSxcbiAgICAgICAgLi4uY29ubmVjdGlvbi50b1J1bGVKc29uKCksXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZEVncmVzc1J1bGUocGVlcjogSVBlZXIsIGNvbm5lY3Rpb246IFBvcnQsIGRlc2NyaXB0aW9uPzogc3RyaW5nLCByZW1vdGVSdWxlPzogYm9vbGVhbikge1xuICAgIGlmIChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IGB0byAke3BlZXIudW5pcXVlSWR9OiR7Y29ubmVjdGlvbn1gO1xuICAgIH1cblxuICAgIGNvbnN0IFtzY29wZSwgaWRdID0gdGhpcy5kZXRlcm1pbmVSdWxlU2NvcGUocGVlciwgY29ubmVjdGlvbiwgJ3RvJywgcmVtb3RlUnVsZSk7XG5cbiAgICAvLyBTa2lwIGR1cGxpY2F0ZXNcbiAgICBpZiAoc2NvcGUubm9kZS50cnlGaW5kQ2hpbGQoaWQpID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ldyBDZm5TZWN1cml0eUdyb3VwRWdyZXNzKHNjb3BlLCBpZCwge1xuICAgICAgICBncm91cElkOiB0aGlzLnNlY3VyaXR5R3JvdXBJZCxcbiAgICAgICAgLi4ucGVlci50b0VncmVzc1J1bGVDb25maWcoKSxcbiAgICAgICAgLi4uY29ubmVjdGlvbi50b1J1bGVKc29uKCksXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRvSW5ncmVzc1J1bGVDb25maWcoKTogYW55IHtcbiAgICByZXR1cm4geyBzb3VyY2VTZWN1cml0eUdyb3VwSWQ6IHRoaXMuc2VjdXJpdHlHcm91cElkIH07XG4gIH1cblxuICBwdWJsaWMgdG9FZ3Jlc3NSdWxlQ29uZmlnKCk6IGFueSB7XG4gICAgcmV0dXJuIHsgZGVzdGluYXRpb25TZWN1cml0eUdyb3VwSWQ6IHRoaXMuc2VjdXJpdHlHcm91cElkIH07XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHdoZXJlIHRvIHBhcmVudCBhIG5ldyBpbmdyZXNzL2VncmVzcyBydWxlXG4gICAqXG4gICAqIEEgU2VjdXJpdHlHcm91cCBydWxlIGlzIHBhcmVudGVkIHVuZGVyIHRoZSBncm91cCBpdCdzIHJlbGF0ZWQgdG8sIFVOTEVTU1xuICAgKiB3ZSdyZSBpbiBhIGNyb3NzLXN0YWNrIHNjZW5hcmlvIHdpdGggYW5vdGhlciBTZWN1cml0eSBHcm91cC4gSW4gdGhhdCBjYXNlLFxuICAgKiB3ZSByZXNwZWN0IHRoZSAncmVtb3RlUnVsZScgZmxhZyBhbmQgd2lsbCBwYXJlbnQgdW5kZXIgdGhlIG90aGVyIHNlY3VyaXR5XG4gICAqIGdyb3VwLlxuICAgKlxuICAgKiBUaGlzIGlzIG5lY2Vzc2FyeSB0byBhdm9pZCBjeWNsaWMgZGVwZW5kZW5jaWVzIGJldHdlZW4gc3RhY2tzLCBzaW5jZSBib3RoXG4gICAqIGluZ3Jlc3MgYW5kIGVncmVzcyBydWxlcyB3aWxsIHJlZmVyZW5jZSBib3RoIHNlY3VyaXR5IGdyb3VwcywgYW5kIGEgbmFpdmVcbiAgICogcGFyZW50aW5nIHdpbGwgbGVhZCB0byB0aGUgZm9sbG93aW5nIHNpdHVhdGlvbjpcbiAgICpcbiAgICogICDilZTilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZcgICAgICAgICDilZTilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZdcbiAgICogICDilZEgIOKUjOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUkCAgICAg4pWRICAgICAgICAg4pWRICAgIOKUjOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUkCAgIOKVkVxuICAgKiAgIOKVkSAg4pSCICBHcm91cEEgICDilILil4DilIDilIDilIDilIDilazilIDilJAgICDilIzilIDilIDilIDilazilIDilIDilIDilrbilIIgIEdyb3VwQiAgIOKUgiAgIOKVkVxuICAgKiAgIOKVkSAg4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYICAgICDilZEg4pSCICAg4pSCICAg4pWRICAgIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmCAgIOKVkVxuICAgKiAgIOKVkSAgICAgICAg4payICAgICAgICAgICDilZEg4pSCICAg4pSCICAg4pWRICAgICAgICAgIOKWsiAgICAgICAgIOKVkVxuICAgKiAgIOKVkSAgICAgICAg4pSCICAgICAgICAgICDilZEg4pSCICAg4pSCICAg4pWRICAgICAgICAgIOKUgiAgICAgICAgIOKVkVxuICAgKiAgIOKVkSAgICAgICAg4pSCICAgICAgICAgICDilZEg4pSCICAg4pSCICAg4pWRICAgICAgICAgIOKUgiAgICAgICAgIOKVkVxuICAgKiAgIOKVkSAg4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQICAgICDilZEg4pSU4pSA4pSA4pSA4pS84pSA4pSA4pSA4pWs4pSA4pSA4pSA4pSA4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQICAg4pWRXG4gICAqICAg4pWRICDilIIgIEVncmVzc0EgIOKUguKUgOKUgOKUgOKUgOKUgOKVrOKUgOKUgOKUgOKUgOKUgOKUmCAgIOKVkSAgICDilIIgSW5ncmVzc0IgIOKUgiAgIOKVkVxuICAgKiAgIOKVkSAg4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYICAgICDilZEgICAgICAgICDilZEgICAg4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYICAg4pWRXG4gICAqICAg4pWRICAgICAgICAgICAgICAgICAgICDilZEgICAgICAgICDilZEgICAgICAgICAgICAgICAgICAgIOKVkVxuICAgKiAgIOKVmuKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVnSAgICAgICAgIOKVmuKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVnVxuICAgKlxuICAgKiBCeSBoYXZpbmcgdGhlIGFiaWxpdHkgdG8gc3dpdGNoIHRoZSBwYXJlbnQsIHdlIGF2b2lkIHRoZSBjeWNsaWMgcmVmZXJlbmNlIGJ5XG4gICAqIGtlZXBpbmcgYWxsIHJ1bGVzIGluIGEgc2luZ2xlIHN0YWNrLlxuICAgKlxuICAgKiBJZiB0aGlzIGhhcHBlbnMsIHdlIGFsc28gaGF2ZSB0byBjaGFuZ2UgdGhlIGNvbnN0cnVjdCBJRCwgYmVjYXVzZVxuICAgKiBvdGhlcndpc2Ugd2UgbWlnaHQgaGF2ZSB0d28gb2JqZWN0cyB3aXRoIHRoZSBzYW1lIElEIGlmIHdlIGhhdmVcbiAgICogbXVsdGlwbGUgcmV2ZXJzZWQgc2VjdXJpdHkgZ3JvdXAgcmVsYXRpb25zaGlwcy5cbiAgICpcbiAgICogICDilZTilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZdcbiAgICogICDilZHilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJAgICAgICAgICAgICAgICAgICAgICAg4pWRXG4gICAqICAg4pWR4pSCICBHcm91cEIgICDilIIgICAgICAgICAgICAgICAgICAgICAg4pWRXG4gICAqICAg4pWR4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYICAgICAgICAgICAgICAgICAgICAgIOKVkVxuICAgKiAgIOKVkSAgICAgIOKWsiAgICAgICAgICAgICAgICAgICAgICAgICAgICDilZFcbiAgICogICDilZEgICAgICDilIIgICAgICAgICAgICAgIOKUjOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUkCDilZFcbiAgICogICDilZEgICAgICDilJzilIDilIDilIDilIBcImZyb20gQVwi4pSA4pSA4pSCIEluZ3Jlc3NCICDilIIg4pWRXG4gICAqICAg4pWRICAgICAg4pSCICAgICAgICAgICAgICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJgg4pWRXG4gICAqICAg4pWRICAgICAg4pSCICAgICAgICAgICAgICDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJAg4pWRXG4gICAqICAg4pWRICAgICAg4pSc4pSA4pSA4pSA4pSA4pSAXCJ0byBCXCLilIDilIDilIDilIIgIEVncmVzc0EgIOKUgiDilZFcbiAgICogICDilZEgICAgICDilIIgICAgICAgICAgICAgIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmCDilZFcbiAgICogICDilZEgICAgICDilIIgICAgICAgICAgICAgIOKUjOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUkCDilZFcbiAgICogICDilZEgICAgICDilJTilIDilIDilIDilIDilIBcInRvIEJcIuKUgOKUgOKUgOKUgiAgRWdyZXNzQyAg4pSCIOKVkSAgPC0tIG9vcHNcbiAgICogICDilZEgICAgICAgICAgICAgICAgICAgICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJgg4pWRXG4gICAqICAg4pWa4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWdXG4gICAqL1xuXG4gIHByb3RlY3RlZCBkZXRlcm1pbmVSdWxlU2NvcGUoXG4gICAgcGVlcjogSVBlZXIsXG4gICAgY29ubmVjdGlvbjogUG9ydCxcbiAgICBmcm9tVG86ICdmcm9tJyB8ICd0bycsXG4gICAgcmVtb3RlUnVsZT86IGJvb2xlYW4pOiBbU2VjdXJpdHlHcm91cEJhc2UsIHN0cmluZ10ge1xuXG4gICAgaWYgKHJlbW90ZVJ1bGUgJiYgU2VjdXJpdHlHcm91cEJhc2UuaXNTZWN1cml0eUdyb3VwKHBlZXIpICYmIGRpZmZlcmVudFN0YWNrcyh0aGlzLCBwZWVyKSkge1xuICAgICAgLy8gUmV2ZXJzZWRcbiAgICAgIGNvbnN0IHJldmVyc2VkRnJvbVRvID0gZnJvbVRvID09PSAnZnJvbScgPyAndG8nIDogJ2Zyb20nO1xuICAgICAgcmV0dXJuIFtwZWVyLCBgJHt0aGlzLnVuaXF1ZUlkfToke2Nvbm5lY3Rpb259ICR7cmV2ZXJzZWRGcm9tVG99YF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlZ3VsYXIgKGRvIG9sZCBJRCBlc2NhcGluZyB0byBpbiBvcmRlciB0byBub3QgZGlzdHVyYiBleGlzdGluZyBkZXBsb3ltZW50cylcbiAgICAgIHJldHVybiBbdGhpcywgYCR7ZnJvbVRvfSAke3RoaXMucmVuZGVyUGVlcihwZWVyKX06JHtjb25uZWN0aW9ufWAucmVwbGFjZSgnLycsICdfJyldO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyUGVlcihwZWVyOiBJUGVlcikge1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQocGVlci51bmlxdWVJZCkpIHtcbiAgICAgIC8vIE5lZWQgdG8gcmV0dXJuIGEgdW5pcXVlIHZhbHVlIGVhY2ggdGltZSBhIHBlZXJcbiAgICAgIC8vIGlzIGFuIHVucmVzb2x2ZWQgdG9rZW4sIGVsc2UgdGhlIGR1cGxpY2F0ZSBza2lwcGVyXG4gICAgICAvLyBpbiBgc2cuYWRkWHh4UnVsZWAgY2FuIGRldGVjdCB1bmlxdWUgcnVsZXMgYXMgZHVwbGljYXRlc1xuICAgICAgcmV0dXJuIHRoaXMucGVlckFzVG9rZW5Db3VudCsrID8gYCd7SW5kaXJlY3RQZWVyJHt0aGlzLnBlZXJBc1Rva2VuQ291bnR9fSdgIDogJ3tJbmRpcmVjdFBlZXJ9JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBlZXIudW5pcXVlSWQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRpZmZlcmVudFN0YWNrcyhncm91cDE6IFNlY3VyaXR5R3JvdXBCYXNlLCBncm91cDI6IFNlY3VyaXR5R3JvdXBCYXNlKSB7XG4gIHJldHVybiBTdGFjay5vZihncm91cDEpICE9PSBTdGFjay5vZihncm91cDIpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlY3VyaXR5R3JvdXBQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc2VjdXJpdHkgZ3JvdXAuIEZvciB2YWxpZCB2YWx1ZXMsIHNlZSB0aGUgR3JvdXBOYW1lXG4gICAqIHBhcmFtZXRlciBvZiB0aGUgQ3JlYXRlU2VjdXJpdHlHcm91cCBhY3Rpb24gaW4gdGhlIEFtYXpvbiBFQzIgQVBJXG4gICAqIFJlZmVyZW5jZS5cbiAgICpcbiAgICogSXQgaXMgbm90IHJlY29tbWVuZGVkIHRvIHVzZSBhbiBleHBsaWNpdCBncm91cCBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhIEdyb3VwTmFtZSwgQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhXG4gICAqIHVuaXF1ZSBwaHlzaWNhbCBJRCBhbmQgdXNlcyB0aGF0IElEIGZvciB0aGUgZ3JvdXAgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGRlc2NyaXB0aW9uIG9mIHRoZSBzZWN1cml0eSBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgVGhlIGRlZmF1bHQgbmFtZSB3aWxsIGJlIHRoZSBjb25zdHJ1Y3QncyBDREsgcGF0aC5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgVlBDIGluIHdoaWNoIHRvIGNyZWF0ZSB0aGUgc2VjdXJpdHkgZ3JvdXAuXG4gICAqL1xuICByZWFkb25seSB2cGM6IElWcGM7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdC5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBzZXQgdG8gdHJ1ZSwgdGhlcmUgd2lsbCBvbmx5IGJlIGEgc2luZ2xlIGVncmVzcyBydWxlIHdoaWNoIGFsbG93cyBhbGxcbiAgICogb3V0Ym91bmQgdHJhZmZpYy4gSWYgdGhpcyBpcyBzZXQgdG8gZmFsc2UsIG5vIG91dGJvdW5kIHRyYWZmaWMgd2lsbCBiZSBhbGxvd2VkIGJ5XG4gICAqIGRlZmF1bHQgYW5kIGFsbCBlZ3Jlc3MgdHJhZmZpYyBtdXN0IGJlIGV4cGxpY2l0bHkgYXV0aG9yaXplZC5cbiAgICpcbiAgICogVG8gYWxsb3cgYWxsIGlwdjYgdHJhZmZpYyB1c2UgYWxsb3dBbGxJcHY2T3V0Ym91bmRcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dBbGxPdXRib3VuZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYWxsb3cgYWxsIG91dGJvdW5kIGlwdjYgdHJhZmZpYyBieSBkZWZhdWx0LlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIHNldCB0byB0cnVlLCB0aGVyZSB3aWxsIG9ubHkgYmUgYSBzaW5nbGUgZWdyZXNzIHJ1bGUgd2hpY2ggYWxsb3dzIGFsbFxuICAgKiBvdXRib3VuZCBpcHY2IHRyYWZmaWMuIElmIHRoaXMgaXMgc2V0IHRvIGZhbHNlLCBubyBvdXRib3VuZCB0cmFmZmljIHdpbGwgYmUgYWxsb3dlZCBieVxuICAgKiBkZWZhdWx0IGFuZCBhbGwgZWdyZXNzIGlwdjYgdHJhZmZpYyBtdXN0IGJlIGV4cGxpY2l0bHkgYXV0aG9yaXplZC5cbiAgICpcbiAgICogVG8gYWxsb3cgYWxsIGlwdjQgdHJhZmZpYyB1c2UgYWxsb3dBbGxPdXRib3VuZFxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dBbGxJcHY2T3V0Ym91bmQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc2FibGUgaW5saW5lIGluZ3Jlc3MgYW5kIGVncmVzcyBydWxlIG9wdGltaXphdGlvbi5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBzZXQgdG8gdHJ1ZSwgaW5ncmVzcyBhbmQgZWdyZXNzIHJ1bGVzIHdpbGwgbm90IGJlIGRlY2xhcmVkIHVuZGVyIHRoZVxuICAgKiBTZWN1cml0eUdyb3VwIGluIGNsb3VkZm9ybWF0aW9uLCBidXQgd2lsbCBiZSBzZXBhcmF0ZSBlbGVtZW50cy5cbiAgICpcbiAgICogSW5saW5pbmcgcnVsZXMgaXMgYW4gb3B0aW1pemF0aW9uIGZvciBwcm9kdWNpbmcgc21hbGxlciBzdGFjayB0ZW1wbGF0ZXMuIFNvbWV0aW1lc1xuICAgKiB0aGlzIGlzIG5vdCBkZXNpcmFibGUsIGZvciBleGFtcGxlIHdoZW4gc2VjdXJpdHkgZ3JvdXAgYWNjZXNzIGlzIG1hbmFnZWQgdmlhIHRhZ3MuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IHZhbHVlIGNhbiBiZSBvdmVycmlkZW4gZ2xvYmFsbHkgYnkgc2V0dGluZyB0aGUgY29udGV4dCB2YXJpYWJsZVxuICAgKiAnQGF3cy1jZGsvYXdzLWVjMi5zZWN1cml0eUdyb3VwRGlzYWJsZUlubGluZVJ1bGVzJy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGRpc2FibGVJbmxpbmVSdWxlcz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQWRkaXRpb25hbCBvcHRpb25zIGZvciBpbXBvcnRlZCBzZWN1cml0eSBncm91cHNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZWN1cml0eUdyb3VwSW1wb3J0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBNYXJrIHRoZSBTZWN1cml0eUdyb3VwIGFzIGhhdmluZyBiZWVuIGNyZWF0ZWQgYWxsb3dpbmcgYWxsIG91dGJvdW5kIHRyYWZmaWNcbiAgICpcbiAgICogT25seSBpZiB0aGlzIGlzIHNldCB0byBmYWxzZSB3aWxsIGVncmVzcyBydWxlcyBiZSBhZGRlZCB0byB0aGlzIHNlY3VyaXR5XG4gICAqIGdyb3VwLiBCZSBhd2FyZSwgdGhpcyB3b3VsZCB1bmRvIGFueSBwb3RlbnRpYWwgXCJhbGwgb3V0Ym91bmQgdHJhZmZpY1wiXG4gICAqIGRlZmF1bHQuXG4gICAqXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGFsbG93QWxsT3V0Ym91bmQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBNYXJrIHRoZSBTZWN1cml0eUdyb3VwIGFzIGhhdmluZyBiZWVuIGNyZWF0ZWQgYWxsb3dpbmcgYWxsIG91dGJvdW5kIGlwdjYgdHJhZmZpY1xuICAgKlxuICAgKiBPbmx5IGlmIHRoaXMgaXMgc2V0IHRvIGZhbHNlIHdpbGwgZWdyZXNzIHJ1bGVzIGZvciBpcHY2IGJlIGFkZGVkIHRvIHRoaXMgc2VjdXJpdHlcbiAgICogZ3JvdXAuIEJlIGF3YXJlLCB0aGlzIHdvdWxkIHVuZG8gYW55IHBvdGVudGlhbCBcImFsbCBvdXRib3VuZCB0cmFmZmljXCJcbiAgICogZGVmYXVsdC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGFsbG93QWxsSXB2Nk91dGJvdW5kPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgYSBTZWN1cml0eUdyb3VwIGlzIG11dGFibGUgQ0RLIGNhbiBhZGQgcnVsZXMgdG8gZXhpc3RpbmcgZ3JvdXBzXG4gICAqXG4gICAqIEJld2FyZSB0aGF0IG1ha2luZyBhIFNlY3VyaXR5R3JvdXAgaW1tdXRhYmxlIG1pZ2h0IGxlYWQgdG8gaXNzdWVcbiAgICogZHVlIHRvIG1pc3NpbmcgaW5ncmVzcy9lZ3Jlc3MgcnVsZXMgZm9yIG5ldyByZXNvdXJjZXMuXG4gICAqXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IG11dGFibGU/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gQW1hem9uIEVDMiBzZWN1cml0eSBncm91cCB3aXRoaW4gYSBWUEMuXG4gKlxuICogU2VjdXJpdHkgR3JvdXBzIGFjdCBsaWtlIGEgZmlyZXdhbGwgd2l0aCBhIHNldCBvZiBydWxlcywgYW5kIGFyZSBhc3NvY2lhdGVkXG4gKiB3aXRoIGFueSBBV1MgcmVzb3VyY2UgdGhhdCBoYXMgb3IgY3JlYXRlcyBFbGFzdGljIE5ldHdvcmsgSW50ZXJmYWNlcyAoRU5JcykuXG4gKiBBIHR5cGljYWwgZXhhbXBsZSBvZiBhIHJlc291cmNlIHRoYXQgaGFzIGEgc2VjdXJpdHkgZ3JvdXAgaXMgYW4gSW5zdGFuY2UgKG9yXG4gKiBBdXRvIFNjYWxpbmcgR3JvdXAgb2YgaW5zdGFuY2VzKVxuICpcbiAqIElmIHlvdSBhcmUgZGVmaW5pbmcgbmV3IGluZnJhc3RydWN0dXJlIGluIENESywgdGhlcmUgaXMgYSBnb29kIGNoYW5jZSB5b3VcbiAqIHdvbid0IGhhdmUgdG8gaW50ZXJhY3Qgd2l0aCB0aGlzIGNsYXNzIGF0IGFsbC4gTGlrZSBJQU0gUm9sZXMsIFNlY3VyaXR5XG4gKiBHcm91cHMgbmVlZCB0byBleGlzdCB0byBjb250cm9sIGFjY2VzcyBiZXR3ZWVuIEFXUyByZXNvdXJjZXMsIGJ1dCBDREsgd2lsbFxuICogYXV0b21hdGljYWxseSBnZW5lcmF0ZSBhbmQgcG9wdWxhdGUgdGhlbSB3aXRoIGxlYXN0LXByaXZpbGVnZSBwZXJtaXNzaW9uc1xuICogZm9yIHlvdSBzbyB5b3UgY2FuIGNvbmNlbnRyYXRlIG9uIHlvdXIgYnVzaW5lc3MgbG9naWMuXG4gKlxuICogQWxsIENvbnN0cnVjdHMgdGhhdCByZXF1aXJlIFNlY3VyaXR5IEdyb3VwcyB3aWxsIGNyZWF0ZSBvbmUgZm9yIHlvdSBpZiB5b3VcbiAqIGRvbid0IHNwZWNpZnkgb25lIGF0IGNvbnN0cnVjdGlvbi4gQWZ0ZXIgY29uc3RydWN0aW9uLCB5b3UgY2FuIHNlbGVjdGl2ZWx5XG4gKiBhbGxvdyBjb25uZWN0aW9ucyB0byBhbmQgYmV0d2VlbiBjb25zdHJ1Y3RzIHZpYS0tZm9yIGV4YW1wbGUtLSB0aGUgYGluc3RhbmNlLmNvbm5lY3Rpb25zYFxuICogb2JqZWN0LiBUaGluayBvZiBpdCBhcyBcImFsbG93aW5nIGNvbm5lY3Rpb25zIHRvIHlvdXIgaW5zdGFuY2VcIiwgcmF0aGVyIHRoYW5cbiAqIFwiYWRkaW5nIGluZ3Jlc3MgcnVsZXMgYSBzZWN1cml0eSBncm91cFwiLiBTZWUgdGhlIFtBbGxvd2luZ1xuICogQ29ubmVjdGlvbnNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL2xhdGVzdC9kb2NzL2F3cy1lYzItcmVhZG1lLmh0bWwjYWxsb3dpbmctY29ubmVjdGlvbnMpXG4gKiBzZWN0aW9uIGluIHRoZSBsaWJyYXJ5IGRvY3VtZW50YXRpb24gZm9yIGV4YW1wbGVzLlxuICpcbiAqIERpcmVjdCBtYW5pcHVsYXRpb24gb2YgdGhlIFNlY3VyaXR5IEdyb3VwIHRocm91Z2ggYGFkZEluZ3Jlc3NSdWxlYCBhbmRcbiAqIGBhZGRFZ3Jlc3NSdWxlYCBpcyBwb3NzaWJsZSwgYnV0IG11dGF0aW9uIHRocm91Z2ggdGhlIGAuY29ubmVjdGlvbnNgIG9iamVjdFxuICogaXMgcmVjb21tZW5kZWQuIElmIHlvdSBwZWVyIHR3byBjb25zdHJ1Y3RzIHdpdGggc2VjdXJpdHkgZ3JvdXBzIHRoaXMgd2F5LFxuICogYXBwcm9wcmlhdGUgcnVsZXMgd2lsbCBiZSBjcmVhdGVkIGluIGJvdGguXG4gKlxuICogSWYgeW91IGhhdmUgYW4gZXhpc3Rpbmcgc2VjdXJpdHkgZ3JvdXAgeW91IHdhbnQgdG8gdXNlIGluIHlvdXIgQ0RLIGFwcGxpY2F0aW9uLFxuICogeW91IHdvdWxkIGltcG9ydCBpdCBsaWtlIHRoaXM6XG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHRoaXMsICdTRycsICdzZy0xMjM0NScsIHtcbiAqICAgbXV0YWJsZTogZmFsc2VcbiAqIH0pO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWN1cml0eUdyb3VwIGV4dGVuZHMgU2VjdXJpdHlHcm91cEJhc2Uge1xuICAvKipcbiAgICogTG9vayB1cCBhIHNlY3VyaXR5IGdyb3VwIGJ5IGlkLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGZyb21Mb29rdXBCeUlkKClgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxvb2t1cChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzZWN1cml0eUdyb3VwSWQ6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmZyb21Mb29rdXBBdHRyaWJ1dGVzKHNjb3BlLCBpZCwgeyBzZWN1cml0eUdyb3VwSWQgfSk7XG4gIH1cblxuICAvKipcbiAgICogTG9vayB1cCBhIHNlY3VyaXR5IGdyb3VwIGJ5IGlkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTG9va3VwQnlJZChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzZWN1cml0eUdyb3VwSWQ6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmZyb21Mb29rdXBBdHRyaWJ1dGVzKHNjb3BlLCBpZCwgeyBzZWN1cml0eUdyb3VwSWQgfSk7XG4gIH1cblxuICAvKipcbiAgICogTG9vayB1cCBhIHNlY3VyaXR5IGdyb3VwIGJ5IG5hbWUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Mb29rdXBCeU5hbWUoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgc2VjdXJpdHlHcm91cE5hbWU6IHN0cmluZywgdnBjOiBJVnBjKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbUxvb2t1cEF0dHJpYnV0ZXMoc2NvcGUsIGlkLCB7IHNlY3VyaXR5R3JvdXBOYW1lLCB2cGMgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIHNlY3VyaXR5IGdyb3VwIGludG8gdGhpcyBhcHAuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgYXNzdW1lIHRoYXQgdGhlIFNlY3VyaXR5IEdyb3VwIGhhcyBhIHJ1bGUgaW4gaXQgd2hpY2ggYWxsb3dzXG4gICAqIGFsbCBvdXRib3VuZCB0cmFmZmljLCBhbmQgc28gd2lsbCBub3QgYWRkIGVncmVzcyBydWxlcyB0byB0aGUgaW1wb3J0ZWQgU2VjdXJpdHlcbiAgICogR3JvdXAgKG9ubHkgaW5ncmVzcyBydWxlcykuXG4gICAqXG4gICAqIElmIHlvdXIgZXhpc3RpbmcgU2VjdXJpdHkgR3JvdXAgbmVlZHMgdG8gaGF2ZSBlZ3Jlc3MgcnVsZXMgYWRkZWQsIHBhc3MgdGhlXG4gICAqIGBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZWAgb3B0aW9uIG9uIGltcG9ydC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNlY3VyaXR5R3JvdXBJZChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzZWN1cml0eUdyb3VwSWQ6IHN0cmluZywgb3B0aW9uczogU2VjdXJpdHlHcm91cEltcG9ydE9wdGlvbnMgPSB7fSk6IElTZWN1cml0eUdyb3VwIHtcbiAgICBjbGFzcyBNdXRhYmxlSW1wb3J0IGV4dGVuZHMgU2VjdXJpdHlHcm91cEJhc2Uge1xuICAgICAgcHVibGljIHNlY3VyaXR5R3JvdXBJZCA9IHNlY3VyaXR5R3JvdXBJZDtcbiAgICAgIHB1YmxpYyBhbGxvd0FsbE91dGJvdW5kID0gb3B0aW9ucy5hbGxvd0FsbE91dGJvdW5kID8/IHRydWU7XG4gICAgICBwdWJsaWMgYWxsb3dBbGxJcHY2T3V0Ym91bmQgPSBvcHRpb25zLmFsbG93QWxsSXB2Nk91dGJvdW5kID8/IGZhbHNlO1xuXG4gICAgICBwdWJsaWMgYWRkRWdyZXNzUnVsZShwZWVyOiBJUGVlciwgY29ubmVjdGlvbjogUG9ydCwgZGVzY3JpcHRpb24/OiBzdHJpbmcsIHJlbW90ZVJ1bGU/OiBib29sZWFuKSB7XG4gICAgICAgIC8vIE9ubHkgaWYgYWxsb3dBbGxPdXRib3VuZCBoYXMgYmVlbiBkaXNhYmxlZFxuICAgICAgICBpZiAob3B0aW9ucy5hbGxvd0FsbE91dGJvdW5kID09PSBmYWxzZSkge1xuICAgICAgICAgIHN1cGVyLmFkZEVncmVzc1J1bGUocGVlciwgY29ubmVjdGlvbiwgZGVzY3JpcHRpb24sIHJlbW90ZVJ1bGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgSW1tdXRhYmxlSW1wb3J0IGV4dGVuZHMgU2VjdXJpdHlHcm91cEJhc2Uge1xuICAgICAgcHVibGljIHNlY3VyaXR5R3JvdXBJZCA9IHNlY3VyaXR5R3JvdXBJZDtcbiAgICAgIHB1YmxpYyBhbGxvd0FsbE91dGJvdW5kID0gb3B0aW9ucy5hbGxvd0FsbE91dGJvdW5kID8/IHRydWU7XG4gICAgICBwdWJsaWMgYWxsb3dBbGxJcHY2T3V0Ym91bmQgPSBvcHRpb25zLmFsbG93QWxsSXB2Nk91dGJvdW5kID8/IGZhbHNlO1xuXG4gICAgICBwdWJsaWMgYWRkRWdyZXNzUnVsZShfcGVlcjogSVBlZXIsIF9jb25uZWN0aW9uOiBQb3J0LCBfZGVzY3JpcHRpb24/OiBzdHJpbmcsIF9yZW1vdGVSdWxlPzogYm9vbGVhbikge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyBhZGRJbmdyZXNzUnVsZShfcGVlcjogSVBlZXIsIF9jb25uZWN0aW9uOiBQb3J0LCBfZGVzY3JpcHRpb24/OiBzdHJpbmcsIF9yZW1vdGVSdWxlPzogYm9vbGVhbikge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnMubXV0YWJsZSAhPT0gZmFsc2VcbiAgICAgID8gbmV3IE11dGFibGVJbXBvcnQoc2NvcGUsIGlkKVxuICAgICAgOiBuZXcgSW1tdXRhYmxlSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogTG9vayB1cCBhIHNlY3VyaXR5IGdyb3VwLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgZnJvbUxvb2t1cEF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgb3B0aW9uczogU2VjdXJpdHlHcm91cExvb2t1cE9wdGlvbnMpIHtcbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKG9wdGlvbnMuc2VjdXJpdHlHcm91cElkKSB8fMKgVG9rZW4uaXNVbnJlc29sdmVkKG9wdGlvbnMuc2VjdXJpdHlHcm91cE5hbWUpIHx8IFRva2VuLmlzVW5yZXNvbHZlZChvcHRpb25zLnZwYz8udnBjSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FsbCBhcmd1bWVudHMgdG8gbG9vayB1cCBhIHNlY3VyaXR5IGdyb3VwIG11c3QgYmUgY29uY3JldGUgKG5vIFRva2VucyknKTtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBjeGFwaS5TZWN1cml0eUdyb3VwQ29udGV4dFJlc3BvbnNlID0gQ29udGV4dFByb3ZpZGVyLmdldFZhbHVlKHNjb3BlLCB7XG4gICAgICBwcm92aWRlcjogY3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyLlNFQ1VSSVRZX0dST1VQX1BST1ZJREVSLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgc2VjdXJpdHlHcm91cElkOiBvcHRpb25zLnNlY3VyaXR5R3JvdXBJZCxcbiAgICAgICAgc2VjdXJpdHlHcm91cE5hbWU6IG9wdGlvbnMuc2VjdXJpdHlHcm91cE5hbWUsXG4gICAgICAgIHZwY0lkOiBvcHRpb25zLnZwYz8udnBjSWQsXG4gICAgICB9LFxuICAgICAgZHVtbXlWYWx1ZToge1xuICAgICAgICBzZWN1cml0eUdyb3VwSWQ6ICdzZy0xMjM0NTY3OCcsXG4gICAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXG4gICAgICB9IGFzIGN4YXBpLlNlY3VyaXR5R3JvdXBDb250ZXh0UmVzcG9uc2UsXG4gICAgfSkudmFsdWU7XG5cbiAgICByZXR1cm4gU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHNjb3BlLCBpZCwgYXR0cmlidXRlcy5zZWN1cml0eUdyb3VwSWQsIHtcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IGF0dHJpYnV0ZXMuYWxsb3dBbGxPdXRib3VuZCxcbiAgICAgIG11dGFibGU6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQW4gYXR0cmlidXRlIHRoYXQgcmVwcmVzZW50cyB0aGUgc2VjdXJpdHkgZ3JvdXAgbmFtZS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKiBAZGVwcmVjYXRlZCByZXR1cm5zIHRoZSBzZWN1cml0eSBncm91cCBJRCwgcmF0aGVyIHRoYW4gdGhlIG5hbWUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2VjdXJpdHlHcm91cE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBzZWN1cml0eSBncm91cFxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2VjdXJpdHlHcm91cElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBWUEMgSUQgdGhpcyBzZWN1cml0eSBncm91cCBpcyBwYXJ0IG9mLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2VjdXJpdHlHcm91cFZwY0lkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIFNlY3VyaXR5R3JvdXAgaGFzIGJlZW4gY29uZmlndXJlZCB0byBhbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpY1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFsbG93QWxsT3V0Ym91bmQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIFNlY3VyaXR5R3JvdXAgaGFzIGJlZW4gY29uZmlndXJlZCB0byBhbGxvdyBhbGwgb3V0Ym91bmQgaXB2NiB0cmFmZmljXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWxsb3dBbGxJcHY2T3V0Ym91bmQ6IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSByZWFkb25seSBzZWN1cml0eUdyb3VwOiBDZm5TZWN1cml0eUdyb3VwO1xuICBwcml2YXRlIHJlYWRvbmx5IGRpcmVjdEluZ3Jlc3NSdWxlczogQ2ZuU2VjdXJpdHlHcm91cC5JbmdyZXNzUHJvcGVydHlbXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IGRpcmVjdEVncmVzc1J1bGVzOiBDZm5TZWN1cml0eUdyb3VwLkVncmVzc1Byb3BlcnR5W10gPSBbXTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBkaXNhYmxlIG9wdGltaXphdGlvbiBmb3IgaW5saW5lIHNlY3VyaXR5IGdyb3VwIHJ1bGVzLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBkaXNhYmxlSW5saW5lUnVsZXM6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNlY3VyaXR5R3JvdXBQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5zZWN1cml0eUdyb3VwTmFtZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdyb3VwRGVzY3JpcHRpb24gPSBwcm9wcy5kZXNjcmlwdGlvbiB8fCB0aGlzLm5vZGUucGF0aDtcblxuICAgIHRoaXMuYWxsb3dBbGxPdXRib3VuZCA9IHByb3BzLmFsbG93QWxsT3V0Ym91bmQgIT09IGZhbHNlO1xuICAgIHRoaXMuYWxsb3dBbGxJcHY2T3V0Ym91bmQgPSBwcm9wcy5hbGxvd0FsbElwdjZPdXRib3VuZCA/PyBmYWxzZTtcblxuICAgIHRoaXMuZGlzYWJsZUlubGluZVJ1bGVzID0gcHJvcHMuZGlzYWJsZUlubGluZVJ1bGVzICE9PSB1bmRlZmluZWQgP1xuICAgICAgISFwcm9wcy5kaXNhYmxlSW5saW5lUnVsZXMgOlxuICAgICAgISF0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChTRUNVUklUWV9HUk9VUF9ESVNBQkxFX0lOTElORV9SVUxFU19DT05URVhUX0tFWSk7XG5cbiAgICB0aGlzLnNlY3VyaXR5R3JvdXAgPSBuZXcgQ2ZuU2VjdXJpdHlHcm91cCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBncm91cE5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgZ3JvdXBEZXNjcmlwdGlvbixcbiAgICAgIHNlY3VyaXR5R3JvdXBJbmdyZXNzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMuZGlyZWN0SW5ncmVzc1J1bGVzIH0sIHsgb21pdEVtcHR5QXJyYXk6IHRydWUgfSApLFxuICAgICAgc2VjdXJpdHlHcm91cEVncmVzczogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLmRpcmVjdEVncmVzc1J1bGVzIH0sIHsgb21pdEVtcHR5QXJyYXk6IHRydWUgfSApLFxuICAgICAgdnBjSWQ6IHByb3BzLnZwYy52cGNJZCxcbiAgICB9KTtcblxuICAgIHRoaXMuc2VjdXJpdHlHcm91cElkID0gdGhpcy5zZWN1cml0eUdyb3VwLmF0dHJHcm91cElkO1xuICAgIHRoaXMuc2VjdXJpdHlHcm91cFZwY0lkID0gdGhpcy5zZWN1cml0eUdyb3VwLmF0dHJWcGNJZDtcbiAgICB0aGlzLnNlY3VyaXR5R3JvdXBOYW1lID0gdGhpcy5zZWN1cml0eUdyb3VwLnJlZjtcblxuICAgIHRoaXMuYWRkRGVmYXVsdEVncmVzc1J1bGUoKTtcbiAgICB0aGlzLmFkZERlZmF1bHRJcHY2RWdyZXNzUnVsZSgpO1xuICB9XG5cbiAgcHVibGljIGFkZEluZ3Jlc3NSdWxlKHBlZXI6IElQZWVyLCBjb25uZWN0aW9uOiBQb3J0LCBkZXNjcmlwdGlvbj86IHN0cmluZywgcmVtb3RlUnVsZT86IGJvb2xlYW4pIHtcbiAgICBpZiAoIXBlZXIuY2FuSW5saW5lUnVsZSB8fCAhY29ubmVjdGlvbi5jYW5JbmxpbmVSdWxlIHx8IHRoaXMuZGlzYWJsZUlubGluZVJ1bGVzKSB7XG4gICAgICBzdXBlci5hZGRJbmdyZXNzUnVsZShwZWVyLCBjb25uZWN0aW9uLCBkZXNjcmlwdGlvbiwgcmVtb3RlUnVsZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gYGZyb20gJHtwZWVyLnVuaXF1ZUlkfToke2Nvbm5lY3Rpb259YDtcbiAgICB9XG5cbiAgICB0aGlzLmFkZERpcmVjdEluZ3Jlc3NSdWxlKHtcbiAgICAgIC4uLnBlZXIudG9JbmdyZXNzUnVsZUNvbmZpZygpLFxuICAgICAgLi4uY29ubmVjdGlvbi50b1J1bGVKc29uKCksXG4gICAgICBkZXNjcmlwdGlvbixcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRFZ3Jlc3NSdWxlKHBlZXI6IElQZWVyLCBjb25uZWN0aW9uOiBQb3J0LCBkZXNjcmlwdGlvbj86IHN0cmluZywgcmVtb3RlUnVsZT86IGJvb2xlYW4pIHtcbiAgICBjb25zdCBpc0lwdjYgPSBwZWVyLnRvRWdyZXNzUnVsZUNvbmZpZygpLmhhc093blByb3BlcnR5KCdjaWRySXB2NicpO1xuXG4gICAgaWYgKCFpc0lwdjYgJiYgdGhpcy5hbGxvd0FsbE91dGJvdW5kKSB7XG4gICAgICAvLyBJbiB0aGUgY2FzZSBvZiBcImFsbG93QWxsT3V0Ym91bmRcIiwgd2UgZG9uJ3QgYWRkIGFueSBtb3JlIHJ1bGVzLiBUaGVyZVxuICAgICAgLy8gaXMgb25seSBvbmUgcnVsZSB3aGljaCBhbGxvd3MgYWxsIHRyYWZmaWMgYW5kIHRoYXQgc3Vic3VtZXMgYW55IG90aGVyXG4gICAgICAvLyBydWxlLlxuICAgICAgaWYgKCFyZW1vdGVSdWxlKSB7IC8vIFdhcm4gb25seSBpZiBhZGRFZ3Jlc3NSdWxlKCkgd2FzIGV4cGxpY2l0ZWx5IGNhbGxlZFxuICAgICAgICBBbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRXYXJuaW5nKCdJZ25vcmluZyBFZ3Jlc3MgcnVsZSBzaW5jZSBcXCdhbGxvd0FsbE91dGJvdW5kXFwnIGlzIHNldCB0byB0cnVlOyBUbyBhZGQgY3VzdG9taXplZCBydWxlcywgc2V0IGFsbG93QWxsT3V0Ym91bmQ9ZmFsc2Ugb24gdGhlIFNlY3VyaXR5R3JvdXAnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKCFpc0lwdjYgJiYgIXRoaXMuYWxsb3dBbGxPdXRib3VuZCkge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGUgYm9ndXMgcnVsZSBleGlzdHMgd2UgY2FuIG5vdyByZW1vdmUgaXQgYmVjYXVzZSB0aGVcbiAgICAgIC8vIHByZXNlbmNlIG9mIGFueSBvdGhlciBydWxlIHdpbGwgZ2V0IHJpZCBvZiBFQzIncyBpbXBsaWNpdCBcImFsbFxuICAgICAgLy8gb3V0Ym91bmRcIiBydWxlIGFueXdheS5cbiAgICAgIHRoaXMucmVtb3ZlTm9UcmFmZmljUnVsZSgpO1xuICAgIH1cblxuICAgIGlmIChpc0lwdjYgJiYgdGhpcy5hbGxvd0FsbElwdjZPdXRib3VuZCkge1xuICAgICAgLy8gSW4gdGhlIGNhc2Ugb2YgXCJhbGxvd0FsbElwdjZPdXRib3VuZFwiLCB3ZSBkb24ndCBhZGQgYW55IG1vcmUgcnVsZXMuIFRoZXJlXG4gICAgICAvLyBpcyBvbmx5IG9uZSBydWxlIHdoaWNoIGFsbG93cyBhbGwgdHJhZmZpYyBhbmQgdGhhdCBzdWJzdW1lcyBhbnkgb3RoZXJcbiAgICAgIC8vIHJ1bGUuXG4gICAgICBpZiAoIXJlbW90ZVJ1bGUpIHsgLy8gV2FybiBvbmx5IGlmIGFkZEVncmVzc1J1bGUoKSB3YXMgZXhwbGljaXRlbHkgY2FsbGVkXG4gICAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoJ0lnbm9yaW5nIEVncmVzcyBydWxlIHNpbmNlIFxcJ2FsbG93QWxsSXB2Nk91dGJvdW5kXFwnIGlzIHNldCB0byB0cnVlOyBUbyBhZGQgY3VzdG9taXplZCBydWxlcywgc2V0IGFsbG93QWxsSXB2Nk91dGJvdW5kPWZhbHNlIG9uIHRoZSBTZWN1cml0eUdyb3VwJyk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFwZWVyLmNhbklubGluZVJ1bGUgfHwgIWNvbm5lY3Rpb24uY2FuSW5saW5lUnVsZSB8fCB0aGlzLmRpc2FibGVJbmxpbmVSdWxlcykge1xuICAgICAgc3VwZXIuYWRkRWdyZXNzUnVsZShwZWVyLCBjb25uZWN0aW9uLCBkZXNjcmlwdGlvbiwgcmVtb3RlUnVsZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gYGZyb20gJHtwZWVyLnVuaXF1ZUlkfToke2Nvbm5lY3Rpb259YDtcbiAgICB9XG5cbiAgICBjb25zdCBydWxlID0ge1xuICAgICAgLi4ucGVlci50b0VncmVzc1J1bGVDb25maWcoKSxcbiAgICAgIC4uLmNvbm5lY3Rpb24udG9SdWxlSnNvbigpLFxuICAgICAgZGVzY3JpcHRpb24sXG4gICAgfTtcblxuICAgIGlmIChpc0FsbFRyYWZmaWNSdWxlKHJ1bGUpKSB7XG4gICAgICAvLyBXZSBjYW5ub3QgYWxsb3cgdGhpczsgaWYgc29tZW9uZSBhZGRzIHRoZSBydWxlIGluIHRoaXMgd2F5LCBpdCB3aWxsIGJlXG4gICAgICAvLyByZW1vdmVkIGFnYWluIGlmIHRoZXkgYWRkIG90aGVyIHJ1bGVzLiBXZSBhbHNvIGNhbid0IGF1dG9tYXRpY2FsbHkgc3dpdGNoXG4gICAgICAvLyB0byBcImFsbE91dGJvdW5kPXRydWVcIiBtb2RlLCBiZWNhdXNlIHdlIG1pZ2h0IGhhdmUgYWxyZWFkeSBlbWl0dGVkXG4gICAgICAvLyBFZ3Jlc3NSdWxlIG9iamVjdHMgKHdoaWNoIGNvdW50IGFzIHJ1bGVzIGFkZGVkIGxhdGVyKSBhbmQgdGhlcmUncyBubyB3YXlcbiAgICAgIC8vIHRvIHJlY2FsbCB0aG9zZS4gQmV0dGVyIHRvIHByZXZlbnQgdGhpcyBmb3Igbm93LlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkIGFuIFwiYWxsIHRyYWZmaWNcIiBlZ3Jlc3MgcnVsZSBpbiB0aGlzIHdheTsgc2V0IGFsbG93QWxsT3V0Ym91bmQ9dHJ1ZSAoZm9yIGlwdjYpIG9yIGFsbG93QWxsSXB2Nk91dGJvdW5kPXRydWUgKGZvciBpcHY2KSBvbiB0aGUgU2VjdXJpdHlHcm91cCBpbnN0ZWFkLicpO1xuICAgIH1cblxuICAgIHRoaXMuYWRkRGlyZWN0RWdyZXNzUnVsZShydWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBkaXJlY3QgaW5ncmVzcyBydWxlXG4gICAqL1xuICBwcml2YXRlIGFkZERpcmVjdEluZ3Jlc3NSdWxlKHJ1bGU6IENmblNlY3VyaXR5R3JvdXAuSW5ncmVzc1Byb3BlcnR5KSB7XG4gICAgaWYgKCF0aGlzLmhhc0luZ3Jlc3NSdWxlKHJ1bGUpKSB7XG4gICAgICB0aGlzLmRpcmVjdEluZ3Jlc3NSdWxlcy5wdXNoKHJ1bGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gd2hldGhlciB0aGUgZ2l2ZW4gaW5ncmVzcyBydWxlIGV4aXN0cyBvbiB0aGUgZ3JvdXBcbiAgICovXG4gIHByaXZhdGUgaGFzSW5ncmVzc1J1bGUocnVsZTogQ2ZuU2VjdXJpdHlHcm91cC5JbmdyZXNzUHJvcGVydHkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kaXJlY3RJbmdyZXNzUnVsZXMuZmluZEluZGV4KHIgPT4gaW5ncmVzc1J1bGVzRXF1YWwociwgcnVsZSkpID4gLTE7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgZGlyZWN0IGVncmVzcyBydWxlXG4gICAqL1xuICBwcml2YXRlIGFkZERpcmVjdEVncmVzc1J1bGUocnVsZTogQ2ZuU2VjdXJpdHlHcm91cC5FZ3Jlc3NQcm9wZXJ0eSkge1xuICAgIGlmICghdGhpcy5oYXNFZ3Jlc3NSdWxlKHJ1bGUpKSB7XG4gICAgICB0aGlzLmRpcmVjdEVncmVzc1J1bGVzLnB1c2gocnVsZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB3aGV0aGVyIHRoZSBnaXZlbiBlZ3Jlc3MgcnVsZSBleGlzdHMgb24gdGhlIGdyb3VwXG4gICAqL1xuICBwcml2YXRlIGhhc0VncmVzc1J1bGUocnVsZTogQ2ZuU2VjdXJpdHlHcm91cC5FZ3Jlc3NQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpcmVjdEVncmVzc1J1bGVzLmZpbmRJbmRleChyID0+IGVncmVzc1J1bGVzRXF1YWwociwgcnVsZSkpID4gLTE7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBkZWZhdWx0IGVncmVzcyBydWxlIHRvIHRoZSBzZWN1cml0eUdyb3VwXG4gICAqXG4gICAqIFRoaXMgZGVwZW5kcyBvbiBhbGxvd0FsbE91dGJvdW5kOlxuICAgKlxuICAgKiAtIElmIGFsbG93QWxsT3V0Ym91bmQgaXMgdHJ1ZSwgd2UgKlRFQ0hOSUNBTExZKiBkb24ndCBuZWVkIHRvIGRvIGFueXRoaW5nLCBiZWNhdXNlXG4gICAqICAgRUMyIGlzIGdvaW5nIHRvIGNyZWF0ZSB0aGlzIGRlZmF1bHQgcnVsZSBhbnl3YXkuIEJ1dCwgZm9yIG1heGltdW0gcmVhZGFiaWxpdHlcbiAgICogICBvZiB0aGUgdGVtcGxhdGUsIHdlIHdpbGwgYWRkIG9uZSBhbnl3YXkuXG4gICAqIC0gSWYgYWxsb3dBbGxPdXRib3VuZCBpcyBmYWxzZSwgd2UgYWRkIGEgYm9ndXMgcnVsZSB0aGF0IG1hdGNoZXMgbm8gdHJhZmZpYyBpblxuICAgKiAgIG9yZGVyIHRvIGdldCByaWQgb2YgdGhlIGRlZmF1bHQgXCJhbGwgb3V0Ym91bmRcIiBydWxlIHRoYXQgRUMyIGNyZWF0ZXMgYnkgZGVmYXVsdC5cbiAgICogICBJZiBvdGhlciBydWxlcyBoYXBwZW4gdG8gZ2V0IGFkZGVkIGxhdGVyLCB3ZSByZW1vdmUgdGhlIGJvZ3VzIHJ1bGUgYWdhaW4gc29cbiAgICogICB0aGF0IGl0IGRvZXNuJ3QgY2x1dHRlciB1cCB0aGUgdGVtcGxhdGUgdG9vIG11Y2ggKGV2ZW4gdGhvdWdoIHRoYXQncyBub3RcbiAgICogICBzdHJpY3RseSBuZWNlc3NhcnkpLlxuICAgKi9cbiAgcHJpdmF0ZSBhZGREZWZhdWx0RWdyZXNzUnVsZSgpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlSW5saW5lUnVsZXMpIHtcbiAgICAgIGNvbnN0IHBlZXIgPSB0aGlzLmFsbG93QWxsT3V0Ym91bmQgPyBBTExfVFJBRkZJQ19QRUVSIDogTk9fVFJBRkZJQ19QRUVSO1xuICAgICAgY29uc3QgcG9ydCA9IHRoaXMuYWxsb3dBbGxPdXRib3VuZCA/IEFMTF9UUkFGRklDX1BPUlQgOiBOT19UUkFGRklDX1BPUlQ7XG4gICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuYWxsb3dBbGxPdXRib3VuZCA/IEFMTE9XX0FMTF9SVUxFLmRlc2NyaXB0aW9uIDogTUFUQ0hfTk9fVFJBRkZJQy5kZXNjcmlwdGlvbjtcbiAgICAgIHN1cGVyLmFkZEVncmVzc1J1bGUocGVlciwgcG9ydCwgZGVzY3JpcHRpb24sIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcnVsZSA9IHRoaXMuYWxsb3dBbGxPdXRib3VuZD8gQUxMT1dfQUxMX1JVTEUgOiBNQVRDSF9OT19UUkFGRklDO1xuICAgICAgdGhpcy5kaXJlY3RFZ3Jlc3NSdWxlcy5wdXNoKHJ1bGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBhbGxvdyBhbGwgaXB2NiBlZ3Jlc3MgcnVsZSB0byB0aGUgc2VjdXJpdHlHcm91cFxuICAgKlxuICAgKiBUaGlzIGRlcGVuZHMgb24gYWxsb3dBbGxJcHY2T3V0Ym91bmQ6XG4gICAqXG4gICAqIC0gSWYgYWxsb3dBbGxJcHY2T3V0Ym91bmQgaXMgdHJ1ZSwgd2Ugd2lsbCBhZGQgYW4gYWxsb3cgYWxsIHJ1bGUuXG4gICAqIC0gSWYgYWxsb3dBbGxPdXRib3VuZCBpcyBmYWxzZSwgd2UgZG9uJ3QgZG8gYW55dGhpbmcgc2luY2UgRUMyIGRvZXMgbm90IGFkZFxuICAgKiAgIGEgZGVmYXVsdCBhbGxvdyBhbGwgaXB2NiBydWxlLlxuICAgKi9cbiAgcHJpdmF0ZSBhZGREZWZhdWx0SXB2NkVncmVzc1J1bGUoKSB7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSAnQWxsb3cgYWxsIG91dGJvdW5kIGlwdjYgdHJhZmZpYyBieSBkZWZhdWx0JztcbiAgICBjb25zdCBwZWVyID0gUGVlci5hbnlJcHY2KCk7XG4gICAgaWYgKHRoaXMuYWxsb3dBbGxJcHY2T3V0Ym91bmQpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVJbmxpbmVSdWxlcykge1xuICAgICAgICBzdXBlci5hZGRFZ3Jlc3NSdWxlKHBlZXIsIFBvcnQuYWxsVHJhZmZpYygpLCBkZXNjcmlwdGlvbiwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXJlY3RFZ3Jlc3NSdWxlcy5wdXNoKHtcbiAgICAgICAgICBpcFByb3RvY29sOiAnLTEnLFxuICAgICAgICAgIGNpZHJJcHY2OiBwZWVyLnVuaXF1ZUlkLFxuICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBib2d1cyBydWxlIGlmIGl0IGV4aXN0c1xuICAgKi9cbiAgcHJpdmF0ZSByZW1vdmVOb1RyYWZmaWNSdWxlKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVJbmxpbmVSdWxlcykge1xuICAgICAgY29uc3QgW3Njb3BlLCBpZF0gPSB0aGlzLmRldGVybWluZVJ1bGVTY29wZShcbiAgICAgICAgTk9fVFJBRkZJQ19QRUVSLFxuICAgICAgICBOT19UUkFGRklDX1BPUlQsXG4gICAgICAgICd0bycsXG4gICAgICAgIGZhbHNlLFxuICAgICAgKTtcbiAgICAgIHNjb3BlLm5vZGUudHJ5UmVtb3ZlQ2hpbGQoaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpID0gdGhpcy5kaXJlY3RFZ3Jlc3NSdWxlcy5maW5kSW5kZXgociA9PiBlZ3Jlc3NSdWxlc0VxdWFsKHIsIE1BVENIX05PX1RSQUZGSUMpKTtcbiAgICAgIGlmIChpID4gLTEpIHtcbiAgICAgICAgdGhpcy5kaXJlY3RFZ3Jlc3NSdWxlcy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRWdyZXNzIHJ1bGUgdGhhdCBwdXJwb3NlbHkgbWF0Y2hlcyBubyB0cmFmZmljXG4gKlxuICogVGhpcyBpcyB1c2VkIGluIG9yZGVyIHRvIGRpc2FibGUgdGhlIFwiYWxsIHRyYWZmaWNcIiBkZWZhdWx0IG9mIFNlY3VyaXR5IEdyb3Vwcy5cbiAqXG4gKiBObyBtYWNoaW5lIGNhbiBldmVyIGFjdHVhbGx5IGhhdmUgdGhlIDI1NS4yNTUuMjU1LjI1NSBJUCBhZGRyZXNzLCBidXRcbiAqIGluIG9yZGVyIHRvIGxvY2sgaXQgZG93biBldmVuIG1vcmUgd2UnbGwgcmVzdHJpY3QgdG8gYSBub25leGlzdGVudFxuICogSUNNUCB0cmFmZmljIHR5cGUuXG4gKi9cbmNvbnN0IE1BVENIX05PX1RSQUZGSUMgPSB7XG4gIGNpZHJJcDogJzI1NS4yNTUuMjU1LjI1NS8zMicsXG4gIGRlc2NyaXB0aW9uOiAnRGlzYWxsb3cgYWxsIHRyYWZmaWMnLFxuICBpcFByb3RvY29sOiAnaWNtcCcsXG4gIGZyb21Qb3J0OiAyNTIsXG4gIHRvUG9ydDogODYsXG59O1xuXG5jb25zdCBOT19UUkFGRklDX1BFRVIgPSBQZWVyLmlwdjQoTUFUQ0hfTk9fVFJBRkZJQy5jaWRySXApO1xuY29uc3QgTk9fVFJBRkZJQ19QT1JUID0gUG9ydC5pY21wVHlwZUFuZENvZGUoTUFUQ0hfTk9fVFJBRkZJQy5mcm9tUG9ydCwgTUFUQ0hfTk9fVFJBRkZJQy50b1BvcnQpO1xuXG4vKipcbiAqIEVncmVzcyBydWxlIHRoYXQgbWF0Y2hlcyBhbGwgdHJhZmZpY1xuICovXG5jb25zdCBBTExPV19BTExfUlVMRSA9IHtcbiAgY2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgZGVzY3JpcHRpb246ICdBbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBieSBkZWZhdWx0JyxcbiAgaXBQcm90b2NvbDogJy0xJyxcbn07XG5cbmNvbnN0IEFMTF9UUkFGRklDX1BFRVIgPSBQZWVyLmFueUlwdjQoKTtcbmNvbnN0IEFMTF9UUkFGRklDX1BPUlQgPSBQb3J0LmFsbFRyYWZmaWMoKTtcblxuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9uUnVsZSB7XG4gIC8qKlxuICAgKiBUaGUgSVAgcHJvdG9jb2wgbmFtZSAodGNwLCB1ZHAsIGljbXApIG9yIG51bWJlciAoc2VlIFByb3RvY29sIE51bWJlcnMpLlxuICAgKiBVc2UgLTEgdG8gc3BlY2lmeSBhbGwgcHJvdG9jb2xzLiBJZiB5b3Ugc3BlY2lmeSAtMSwgb3IgYSBwcm90b2NvbCBudW1iZXJcbiAgICogb3RoZXIgdGhhbiB0Y3AsIHVkcCwgaWNtcCwgb3IgNTggKElDTVB2NiksIHRyYWZmaWMgb24gYWxsIHBvcnRzIGlzXG4gICAqIGFsbG93ZWQsIHJlZ2FyZGxlc3Mgb2YgYW55IHBvcnRzIHlvdSBzcGVjaWZ5LiBGb3IgdGNwLCB1ZHAsIGFuZCBpY21wLCB5b3VcbiAgICogbXVzdCBzcGVjaWZ5IGEgcG9ydCByYW5nZS4gRm9yIHByb3RvY29sIDU4IChJQ01QdjYpLCB5b3UgY2FuIG9wdGlvbmFsbHlcbiAgICogc3BlY2lmeSBhIHBvcnQgcmFuZ2U7IGlmIHlvdSBkb24ndCwgdHJhZmZpYyBmb3IgYWxsIHR5cGVzIGFuZCBjb2RlcyBpc1xuICAgKiBhbGxvd2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0Y3BcbiAgICovXG4gIHJlYWRvbmx5IHByb3RvY29sPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTdGFydCBvZiBwb3J0IHJhbmdlIGZvciB0aGUgVENQIGFuZCBVRFAgcHJvdG9jb2xzLCBvciBhbiBJQ01QIHR5cGUgbnVtYmVyLlxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSBpY21wIGZvciB0aGUgSXBQcm90b2NvbCBwcm9wZXJ0eSwgeW91IGNhbiBzcGVjaWZ5XG4gICAqIC0xIGFzIGEgd2lsZGNhcmQgKGkuZS4sIGFueSBJQ01QIHR5cGUgbnVtYmVyKS5cbiAgICovXG4gIHJlYWRvbmx5IGZyb21Qb3J0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEVuZCBvZiBwb3J0IHJhbmdlIGZvciB0aGUgVENQIGFuZCBVRFAgcHJvdG9jb2xzLCBvciBhbiBJQ01QIGNvZGUuXG4gICAqXG4gICAqIElmIHlvdSBzcGVjaWZ5IGljbXAgZm9yIHRoZSBJcFByb3RvY29sIHByb3BlcnR5LCB5b3UgY2FuIHNwZWNpZnkgLTEgYXMgYVxuICAgKiB3aWxkY2FyZCAoaS5lLiwgYW55IElDTVAgY29kZSkuXG4gICAqXG4gICAqIEBkZWZhdWx0IElmIHRvUG9ydCBpcyBub3Qgc3BlY2lmaWVkLCBpdCB3aWxsIGJlIHRoZSBzYW1lIGFzIGZyb21Qb3J0LlxuICAgKi9cbiAgcmVhZG9ubHkgdG9Qb3J0PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBEZXNjcmlwdGlvbiBvZiB0aGlzIGNvbm5lY3Rpb24uIEl0IGlzIGFwcGxpZWQgdG8gYm90aCB0aGUgaW5ncmVzcyBydWxlXG4gICAqIGFuZCB0aGUgZWdyZXNzIHJ1bGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGRlc2NyaXB0aW9uXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb21wYXJlIHR3byBpbmdyZXNzIHJ1bGVzIGZvciBlcXVhbGl0eSB0aGUgc2FtZSB3YXkgQ2xvdWRGb3JtYXRpb24gd291bGQgKGRpc2NhcmRpbmcgZGVzY3JpcHRpb24pXG4gKi9cbmZ1bmN0aW9uIGluZ3Jlc3NSdWxlc0VxdWFsKGE6IENmblNlY3VyaXR5R3JvdXAuSW5ncmVzc1Byb3BlcnR5LCBiOiBDZm5TZWN1cml0eUdyb3VwLkluZ3Jlc3NQcm9wZXJ0eSkge1xuICByZXR1cm4gYS5jaWRySXAgPT09IGIuY2lkcklwXG4gICAgJiYgYS5jaWRySXB2NiA9PT0gYi5jaWRySXB2NlxuICAgICYmIGEuZnJvbVBvcnQgPT09IGIuZnJvbVBvcnRcbiAgICAmJiBhLnRvUG9ydCA9PT0gYi50b1BvcnRcbiAgICAmJiBhLmlwUHJvdG9jb2wgPT09IGIuaXBQcm90b2NvbFxuICAgICYmIGEuc291cmNlU2VjdXJpdHlHcm91cElkID09PSBiLnNvdXJjZVNlY3VyaXR5R3JvdXBJZFxuICAgICYmIGEuc291cmNlU2VjdXJpdHlHcm91cE5hbWUgPT09IGIuc291cmNlU2VjdXJpdHlHcm91cE5hbWVcbiAgICAmJiBhLnNvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkID09PSBiLnNvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkO1xufVxuXG4vKipcbiAqIENvbXBhcmUgdHdvIGVncmVzcyBydWxlcyBmb3IgZXF1YWxpdHkgdGhlIHNhbWUgd2F5IENsb3VkRm9ybWF0aW9uIHdvdWxkIChkaXNjYXJkaW5nIGRlc2NyaXB0aW9uKVxuICovXG5mdW5jdGlvbiBlZ3Jlc3NSdWxlc0VxdWFsKGE6IENmblNlY3VyaXR5R3JvdXAuRWdyZXNzUHJvcGVydHksIGI6IENmblNlY3VyaXR5R3JvdXAuRWdyZXNzUHJvcGVydHkpIHtcbiAgcmV0dXJuIGEuY2lkcklwID09PSBiLmNpZHJJcFxuICAgICYmIGEuY2lkcklwdjYgPT09IGIuY2lkcklwdjZcbiAgICAmJiBhLmZyb21Qb3J0ID09PSBiLmZyb21Qb3J0XG4gICAgJiYgYS50b1BvcnQgPT09IGIudG9Qb3J0XG4gICAgJiYgYS5pcFByb3RvY29sID09PSBiLmlwUHJvdG9jb2xcbiAgICAmJiBhLmRlc3RpbmF0aW9uUHJlZml4TGlzdElkID09PSBiLmRlc3RpbmF0aW9uUHJlZml4TGlzdElkXG4gICAgJiYgYS5kZXN0aW5hdGlvblNlY3VyaXR5R3JvdXBJZCA9PT0gYi5kZXN0aW5hdGlvblNlY3VyaXR5R3JvdXBJZDtcbn1cblxuLyoqXG4gKiBXaGV0aGVyIHRoaXMgcnVsZSByZWZlcnMgdG8gYWxsIHRyYWZmaWNcbiAqL1xuZnVuY3Rpb24gaXNBbGxUcmFmZmljUnVsZShydWxlOiBhbnkpIHtcbiAgcmV0dXJuIChydWxlLmNpZHJJcCA9PT0gJzAuMC4wLjAvMCcgfHwgcnVsZS5jaWRySXB2NiA9PT0gJzo6LzAnKSAmJiBydWxlLmlwUHJvdG9jb2wgPT09ICctMSc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgbG9va2luZyB1cCBhbiBleGlzdGluZyBTZWN1cml0eUdyb3VwLlxuICpcbiAqIEVpdGhlciBgc2VjdXJpdHlHcm91cE5hbWVgIG9yIGBzZWN1cml0eUdyb3VwSWRgIGhhcyB0byBiZSBzcGVjaWZpZWQuXG4gKi9cbmludGVyZmFjZSBTZWN1cml0eUdyb3VwTG9va3VwT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc2VjdXJpdHkgZ3JvdXBcbiAgICpcbiAgICogSWYgZ2l2ZW4sIHdpbGwgaW1wb3J0IHRoZSBTZWN1cml0eUdyb3VwIHdpdGggdGhpcyBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEb24ndCBmaWx0ZXIgb24gc2VjdXJpdHlHcm91cE5hbWVcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIHNlY3VyaXR5IGdyb3VwXG4gICAqXG4gICAqIElmIGdpdmVuLCB3aWxsIGltcG9ydCB0aGUgU2VjdXJpdHlHcm91cCB3aXRoIHRoaXMgSUQuXG4gICAqXG4gICAqIEBkZWZhdWx0IERvbid0IGZpbHRlciBvbiBzZWN1cml0eUdyb3VwSWRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBJZD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFZQQyBvZiB0aGUgc2VjdXJpdHkgZ3JvdXBcbiAgICpcbiAgICogSWYgZ2l2ZW4sIHdpbGwgZmlsdGVyIHRoZSBTZWN1cml0eUdyb3VwIGJhc2VkIG9uIHRoZSBWUEMuXG4gICAqXG4gICAqIEBkZWZhdWx0IERvbid0IGZpbHRlciBvbiBWUENcbiAgICovXG4gIHJlYWRvbmx5IHZwYz86IElWcGMsXG59XG4iXX0=