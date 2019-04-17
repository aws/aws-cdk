import { CfnOutput, Construct, IResource, Resource, Token } from '@aws-cdk/cdk';
import { Connections, IConnectable } from './connections';
import { CfnSecurityGroup, CfnSecurityGroupEgress, CfnSecurityGroupIngress } from './ec2.generated';
import { IPortRange, ISecurityGroupRule } from './security-group-rule';
import { IVpcNetwork } from './vpc-ref';

const isSecurityGroupSymbol = Symbol.for('aws-cdk:isSecurityGroup');

export interface ISecurityGroup extends IResource, ISecurityGroupRule, IConnectable {
  /**
   * ID for the current security group
   */
  readonly securityGroupId: string;

  /**
   * Add an ingress rule for the current security group
   *
   * `remoteRule` controls where the Rule object is created if the peer is also a
   * securityGroup and they are in different stack. If false (default) the
   * rule object is created under the current SecurityGroup object. If true and the
   * peer is also a SecurityGroup, the rule object is created under the remote
   * SecurityGroup object.
   */
  addIngressRule(peer: ISecurityGroupRule, connection: IPortRange, description?: string, remoteRule?: boolean): void;

  /**
   * Add an egress rule for the current security group
   *
   * `remoteRule` controls where the Rule object is created if the peer is also a
   * securityGroup and they are in different stack. If false (default) the
   * rule object is created under the current SecurityGroup object. If true and the
   * peer is also a SecurityGroup, the rule object is created under the remote
   * SecurityGroup object.
   */
  addEgressRule(peer: ISecurityGroupRule, connection: IPortRange, description?: string, remoteRule?: boolean): void;

  /**
   * Export the security group
   */
  export(): SecurityGroupImportProps;
}

export interface SecurityGroupImportProps {
  /**
   * ID of security group
   */
  readonly securityGroupId: string;
}

/**
 * A SecurityGroup that is not created in this template
 */
export abstract class SecurityGroupBase extends Resource implements ISecurityGroup {
  /**
   * Return whether the indicated object is a security group
   */
  public static isSecurityGroup(construct: any): construct is SecurityGroupBase {
    return (construct as any)[isSecurityGroupSymbol] === true;
  }

  public abstract readonly securityGroupId: string;
  public readonly canInlineRule = false;
  public readonly connections: Connections = new Connections({ securityGroups: [this] });

  /**
   * FIXME: Where to place this??
   */
  public readonly defaultPortRange?: IPortRange;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    Object.defineProperty(this, isSecurityGroupSymbol, { value: true });
  }

  public get uniqueId() {
    return this.node.uniqueId;
  }

  public addIngressRule(peer: ISecurityGroupRule, connection: IPortRange, description?: string, remoteRule?: boolean) {
    if (description === undefined) {
      description = `from ${peer.uniqueId}:${connection}`;
    }

    const [scope, id] = determineRuleScope(this, peer, connection, 'from', remoteRule);

    // Skip duplicates
    if (scope.node.tryFindChild(id) === undefined) {
      new CfnSecurityGroupIngress(scope, id, {
        groupId: this.securityGroupId,
        ...peer.toIngressRuleJSON(),
        ...connection.toRuleJSON(),
        description
      });
    }
  }

  public addEgressRule(peer: ISecurityGroupRule, connection: IPortRange, description?: string, remoteRule?: boolean) {
    if (description === undefined) {
      description = `to ${peer.uniqueId}:${connection}`;
    }

    const [scope, id] = determineRuleScope(this, peer, connection, 'to', remoteRule);

    // Skip duplicates
    if (scope.node.tryFindChild(id) === undefined) {
      new CfnSecurityGroupEgress(scope, id, {
        groupId: this.securityGroupId,
        ...peer.toEgressRuleJSON(),
        ...connection.toRuleJSON(),
        description
      });
    }
  }

  public toIngressRuleJSON(): any {
    return { sourceSecurityGroupId: this.securityGroupId };
  }

  public toEgressRuleJSON(): any {
    return { destinationSecurityGroupId: this.securityGroupId };
  }

  /**
   * Export this SecurityGroup for use in a different Stack
   */
  public abstract export(): SecurityGroupImportProps;
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
function determineRuleScope(
      group: SecurityGroupBase,
      peer: ISecurityGroupRule,
      connection: IPortRange,
      fromTo: 'from' | 'to',
      remoteRule?: boolean): [SecurityGroupBase, string] {

  if (remoteRule && SecurityGroupBase.isSecurityGroup(peer) && differentStacks(group, peer)) {
    // Reversed
    const reversedFromTo = fromTo === 'from' ? 'to' : 'from';
    return [peer, `${group.uniqueId}:${connection} ${reversedFromTo}`];
  } else {
    // Regular (do old ID escaping to in order to not disturb existing deployments)
    return [group, `${fromTo} ${peer.uniqueId}:${connection}`.replace('/', '_')];
  }
}

function differentStacks(group1: SecurityGroupBase, group2: SecurityGroupBase) {
  return group1.node.stack !== group2.node.stack;
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
  readonly groupName?: string;

  /**
   * A description of the security group.
   *
   * @default The default name will be the construct's CDK path.
   */
  readonly description?: string;

  /**
   * The VPC in which to create the security group.
   */
  readonly vpc: IVpcNetwork;

  /**
   * Whether to allow all outbound traffic by default.
   *
   * If this is set to true, there will only be a single egress rule which allows all
   * outbound traffic. If this is set to false, no outbound traffic will be allowed by
   * default and all egress traffic must be explicitly authorized.
   *
   * @default true
   */
  readonly allowAllOutbound?: boolean;
}

/**
 * Creates an Amazon EC2 security group within a VPC.
 *
 * This class has an additional optimization over imported security groups that it can also create
 * inline ingress and egress rule (which saves on the total number of resources inside
 * the template).
 */
export class SecurityGroup extends SecurityGroupBase {
  /**
   * Import an existing SecurityGroup
   */
  public static import(scope: Construct, id: string, props: SecurityGroupImportProps): ISecurityGroup {
    return new ImportedSecurityGroup(scope, id, props);
  }

  /**
   * An attribute that represents the security group name.
   */
  public readonly groupName: string;

  /**
   * An attribute that represents the physical VPC ID this security group is part of.
   */
  public readonly vpcId: string;

  /**
   * The ID of the security group
   */
  public readonly securityGroupId: string;

  private readonly securityGroup: CfnSecurityGroup;
  private readonly directIngressRules: CfnSecurityGroup.IngressProperty[] = [];
  private readonly directEgressRules: CfnSecurityGroup.EgressProperty[] = [];

  private readonly allowAllOutbound: boolean;

  constructor(scope: Construct, id: string, props: SecurityGroupProps) {
    super(scope, id);

    const groupDescription = props.description || this.node.path;

    this.allowAllOutbound = props.allowAllOutbound !== false;

    this.securityGroup = new CfnSecurityGroup(this, 'Resource', {
      groupName: props.groupName,
      groupDescription,
      securityGroupIngress: new Token(() => this.directIngressRules),
      securityGroupEgress: new Token(() => this.directEgressRules),
      vpcId: props.vpc.vpcId,
    });

    this.securityGroupId = this.securityGroup.securityGroupId;
    this.groupName = this.securityGroup.securityGroupName;
    this.vpcId = this.securityGroup.securityGroupVpcId;

    this.addDefaultEgressRule();
  }

  /**
   * Export this SecurityGroup for use in a different Stack
   */
  public export(): SecurityGroupImportProps {
    return {
      securityGroupId: new CfnOutput(this, 'SecurityGroupId', { value: this.securityGroupId }).makeImportValue().toString()
    };
  }

  public addIngressRule(peer: ISecurityGroupRule, connection: IPortRange, description?: string, remoteRule?: boolean) {
    if (!peer.canInlineRule || !connection.canInlineRule) {
      super.addIngressRule(peer, connection, description, remoteRule);
      return;
    }

    if (description === undefined) {
      description = `from ${peer.uniqueId}:${connection}`;
    }

    this.addDirectIngressRule({
      ...peer.toIngressRuleJSON(),
      ...connection.toRuleJSON(),
      description
    });
  }

  public addEgressRule(peer: ISecurityGroupRule, connection: IPortRange, description?: string, remoteRule?: boolean) {
    if (this.allowAllOutbound) {
      // In the case of "allowAllOutbound", we don't add any more rules. There
      // is only one rule which allows all traffic and that subsumes any other
      // rule.
      return;
    } else {
      // Otherwise, if the bogus rule exists we can now remove it because the
      // presence of any other rule will get rid of EC2's implicit "all
      // outbound" rule anyway.
      this.removeNoTrafficRule();
    }

    if (!peer.canInlineRule || !connection.canInlineRule) {
      super.addEgressRule(peer, connection, description, remoteRule);
      return;
    }

    if (description === undefined) {
      description = `from ${peer.uniqueId}:${connection}`;
    }

    const rule = {
      ...peer.toEgressRuleJSON(),
      ...connection.toRuleJSON(),
      description
    };

    if (isAllTrafficRule(rule)) {
      // We cannot allow this; if someone adds the rule in this way, it will be
      // removed again if they add other rules. We also can't automatically switch
      // to "allOutbound=true" mode, because we might have already emitted
      // EgressRule objects (which count as rules added later) and there's no way
      // to recall those. Better to prevent this for now.
      throw new Error('Cannot add an "all traffic" egress rule in this way; set allowAllOutbound=true on the SecurityGroup instead.');
    }

    this.addDirectEgressRule(rule);
  }

  /**
   * Add a direct ingress rule
   */
  private addDirectIngressRule(rule: CfnSecurityGroup.IngressProperty) {
    if (!this.hasIngressRule(rule)) {
      this.directIngressRules.push(rule);
    }
  }

  /**
   * Return whether the given ingress rule exists on the group
   */
  private hasIngressRule(rule: CfnSecurityGroup.IngressProperty): boolean {
    return this.directIngressRules.findIndex(r => ingressRulesEqual(r, rule)) > -1;
  }

  /**
   * Add a direct egress rule
   */
  private addDirectEgressRule(rule: CfnSecurityGroup.EgressProperty) {
    if (!this.hasEgressRule(rule)) {
      this.directEgressRules.push(rule);
    }
  }

  /**
   * Return whether the given egress rule exists on the group
   */
  private hasEgressRule(rule: CfnSecurityGroup.EgressProperty): boolean {
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
  private addDefaultEgressRule() {
    if (this.allowAllOutbound) {
      this.directEgressRules.push(ALLOW_ALL_RULE);
    } else {
      this.directEgressRules.push(MATCH_NO_TRAFFIC);
    }
  }

  /**
   * Remove the bogus rule if it exists
   */
  private removeNoTrafficRule() {
    const i = this.directEgressRules.findIndex(r => egressRulesEqual(r, MATCH_NO_TRAFFIC));
    if (i > -1) {
      this.directEgressRules.splice(i, 1);
    }
  }
}

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
  toPort: 86
};

/**
 * Egress rule that matches all traffic
 */
const ALLOW_ALL_RULE = {
  cidrIp: '0.0.0.0/0',
  description: 'Allow all outbound traffic by default',
  ipProtocol: '-1',
};

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

/**
 * A SecurityGroup that hasn't been created here
 */
class ImportedSecurityGroup extends SecurityGroupBase {
  public readonly securityGroupId: string;

  constructor(scope: Construct, id: string, private readonly props: SecurityGroupImportProps) {
    super(scope, id);

    this.securityGroupId = props.securityGroupId;
  }

  public export() {
    return this.props;
  }
}

/**
 * Compare two ingress rules for equality the same way CloudFormation would (discarding description)
 */
function ingressRulesEqual(a: CfnSecurityGroup.IngressProperty, b: CfnSecurityGroup.IngressProperty) {
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
function egressRulesEqual(a: CfnSecurityGroup.EgressProperty, b: CfnSecurityGroup.EgressProperty) {
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
function isAllTrafficRule(rule: any) {
  return rule.cidrIp === '0.0.0.0/0' && rule.ipProtocol === '-1';
}
