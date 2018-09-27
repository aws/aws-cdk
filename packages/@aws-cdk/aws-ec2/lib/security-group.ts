import { Construct, ITaggable, Output, TagManager, Tags, Token } from '@aws-cdk/cdk';
import { Connections, IConnectable } from './connections';
import { cloudformation } from './ec2.generated';
import { IPortRange, ISecurityGroupRule } from './security-group-rule';
import { VpcNetworkRef } from './vpc-ref';

export interface SecurityGroupRefProps {
  /**
   * ID of security group
   */
  securityGroupId: string;
}

/**
 * A SecurityGroup that is not created in this template
 */
export abstract class SecurityGroupRef extends Construct implements ISecurityGroupRule, IConnectable {
  /**
   * Import an existing SecurityGroup
   */
  public static import(parent: Construct, id: string, props: SecurityGroupRefProps): SecurityGroupRef {
    return new ImportedSecurityGroup(parent, id, props);
  }

  public abstract readonly securityGroupId: string;
  public readonly canInlineRule = false;
  public readonly connections = new Connections({ securityGroup: this });

  /**
   * FIXME: Where to place this??
   */
  public readonly defaultPortRange?: IPortRange;

  public addIngressRule(peer: ISecurityGroupRule, connection: IPortRange, description?: string) {
    let id = `from ${peer.uniqueId}:${connection}`;
    if (description === undefined) {
      description = id;
    }
    id = id.replace('/', '_');

    // Skip duplicates
    if (this.tryFindChild(id) === undefined) {
      new cloudformation.SecurityGroupIngressResource(this, id, {
        groupId: this.securityGroupId,
        ...peer.toIngressRuleJSON(),
        ...connection.toRuleJSON(),
        description
      });
    }
  }

  public addEgressRule(peer: ISecurityGroupRule, connection: IPortRange, description?: string) {
    let id = `to ${peer.uniqueId}:${connection}`;
    if (description === undefined) {
      description = id;
    }
    id = id.replace('/', '_');

    // Skip duplicates
    if (this.tryFindChild(id) === undefined) {
      new cloudformation.SecurityGroupEgressResource(this, id, {
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
  public export(): SecurityGroupRefProps {
    return {
      securityGroupId: new Output(this, 'SecurityGroupId', { value: this.securityGroupId }).makeImportValue().toString()
    };
  }

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
  groupName?: string;

  /**
   * A description of the security group.
   *
   * @default The default name will be the construct's CDK path.
   */
  description?: string;

  /**
   * The AWS resource tags to associate with the security group.
   */
  tags?: Tags;

  /**
   * The VPC in which to create the security group.
   */
  vpc: VpcNetworkRef;
}

/**
 * Creates an Amazon EC2 security group within a VPC.
 *
 * This class has an additional optimization over SecurityGroupRef that it can also create
 * inline ingress and egress rule (which saves on the total number of resources inside
 * the template).
 */
export class SecurityGroup extends SecurityGroupRef implements ITaggable {
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

  /**
   * Manage tags for this construct and children
   */
  public readonly tags: TagManager;

  private readonly securityGroup: cloudformation.SecurityGroupResource;
  private readonly directIngressRules: cloudformation.SecurityGroupResource.IngressProperty[] = [];
  private readonly directEgressRules: cloudformation.SecurityGroupResource.EgressProperty[] = [];

  constructor(parent: Construct, name: string, props: SecurityGroupProps) {
    super(parent, name);

    this.tags = new TagManager(this, { initialTags: props.tags});
    const groupDescription = props.description || this.path;
    this.securityGroup = new cloudformation.SecurityGroupResource(this, 'Resource', {
      groupName: props.groupName,
      groupDescription,
      securityGroupIngress: new Token(() => this.directIngressRules),
      securityGroupEgress: new Token(() => this.directEgressRules),
      vpcId: props.vpc.vpcId,
      tags: this.tags,
    });

    this.securityGroupId = this.securityGroup.securityGroupId;
    this.groupName = this.securityGroup.securityGroupName;
    this.vpcId = this.securityGroup.securityGroupVpcId;
  }

  public addIngressRule(peer: ISecurityGroupRule, connection: IPortRange, description?: string) {
    if (!peer.canInlineRule || !connection.canInlineRule) {
      super.addIngressRule(peer, connection, description);
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

  public addEgressRule(peer: ISecurityGroupRule, connection: IPortRange, description?: string) {
    if (!peer.canInlineRule || !connection.canInlineRule) {
      super.addEgressRule(peer, connection, description);
      return;
    }

    if (description === undefined) {
      description = `from ${peer.uniqueId}:${connection}`;
    }

    this.addDirectEgressRule({
      ...peer.toEgressRuleJSON(),
      ...connection.toRuleJSON(),
      description
    });
  }

  /**
   * Add a direct ingress rule
   */
  private addDirectIngressRule(rule: cloudformation.SecurityGroupResource.IngressProperty) {
    if (!this.hasIngressRule(rule)) {
      this.directIngressRules.push(rule);
    }
  }

  /**
   * Return whether the given ingress rule exists on the group
   */
  private hasIngressRule(rule: cloudformation.SecurityGroupResource.IngressProperty): boolean {
    return this.directIngressRules.findIndex(r => ingressRulesEqual(r, rule)) > -1;
  }

  /**
   * Add a direct egress rule
   */
  private addDirectEgressRule(rule: cloudformation.SecurityGroupResource.EgressProperty) {
    if (!this.hasEgressRule(rule)) {
      this.directEgressRules.push(rule);
    }
  }

  /**
   * Return whether the given egress rule exists on the group
   */
  private hasEgressRule(rule: cloudformation.SecurityGroupResource.EgressProperty): boolean {
    return this.directEgressRules.findIndex(r => egressRulesEqual(r, rule)) > -1;
  }
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
  protocol?: string;

  /**
   * Start of port range for the TCP and UDP protocols, or an ICMP type number.
   *
   * If you specify icmp for the IpProtocol property, you can specify
   * -1 as a wildcard (i.e., any ICMP type number).
   */
  fromPort: number;

  /**
   * End of port range for the TCP and UDP protocols, or an ICMP code.
   *
   * If you specify icmp for the IpProtocol property, you can specify -1 as a
   * wildcard (i.e., any ICMP code).
   *
   * @default If toPort is not specified, it will be the same as fromPort.
   */
  toPort?: number;

  /**
   * Description of this connection. It is applied to both the ingress rule
   * and the egress rule.
   *
   * @default No description
   */
  description?: string;
}

/**
 * A SecurityGroup that hasn't been created here
 */
class ImportedSecurityGroup extends SecurityGroupRef {
  public readonly securityGroupId: string;

  constructor(parent: Construct, name: string, props: SecurityGroupRefProps) {
    super(parent, name);

    this.securityGroupId = props.securityGroupId;
  }
}

/**
 * Compare two ingress rules for equality the same way CloudFormation would (discarding description)
 */
function ingressRulesEqual(a: cloudformation.SecurityGroupResource.IngressProperty, b: cloudformation.SecurityGroupResource.IngressProperty) {
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
function egressRulesEqual(a: cloudformation.SecurityGroupResource.EgressProperty, b: cloudformation.SecurityGroupResource.EgressProperty) {
  return a.cidrIp === b.cidrIp
    && a.cidrIpv6 === b.cidrIpv6
    && a.fromPort === b.fromPort
    && a.toPort === b.toPort
    && a.ipProtocol === b.ipProtocol
    && a.destinationPrefixListId === b.destinationPrefixListId
    && a.destinationSecurityGroupId === b.destinationSecurityGroupId;
}
