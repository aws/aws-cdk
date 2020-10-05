/**
 * A single security group rule, either egress or ingress
 */
export class SecurityGroupRule {
  /**
   * Group ID of the group this rule applies to
   */
  public readonly groupId: string;

  /**
   * IP protocol this rule applies to
   */
  public readonly ipProtocol: string;

  /**
   * Start of port range this rule applies to, or ICMP type
   */
  public readonly fromPort?: number;

  /**
   * End of port range this rule applies to, or ICMP code
   */
  public readonly toPort?: number;

  /**
   * Peer of this rule
   */
  public readonly peer?: RulePeer;

  constructor(ruleObject: any, groupRef?: string) {
    this.ipProtocol = ruleObject.IpProtocol || '*unknown*';
    this.fromPort = ruleObject.FromPort;
    this.toPort = ruleObject.ToPort;
    this.groupId = ruleObject.GroupId || groupRef || '*unknown*'; // In case of an inline rule

    this.peer =
        findFirst(ruleObject,
          ['CidrIp', 'CidrIpv6'],
          (ip) => ({ kind: 'cidr-ip', ip } as CidrIpPeer))
        ||
        findFirst(ruleObject,
          ['DestinationSecurityGroupId', 'SourceSecurityGroupId'],
          (securityGroupId) => ({ kind: 'security-group', securityGroupId } as SecurityGroupPeer))
        ||
        findFirst(ruleObject,
          ['DestinationPrefixListId', 'SourcePrefixListId'],
          (prefixListId) => ({ kind: 'prefix-list', prefixListId } as PrefixListPeer));
  }

  public equal(other: SecurityGroupRule) {
    return this.ipProtocol === other.ipProtocol
        && this.fromPort === other.fromPort
        && this.toPort === other.toPort
        && peerEqual(this.peer, other.peer);
  }

  public describeProtocol() {
    if (this.ipProtocol === '-1') { return 'Everything'; }

    const ipProtocol = this.ipProtocol.toUpperCase();

    if (this.fromPort === -1) { return `All ${ipProtocol}`; }
    if (this.fromPort === this.toPort) { return `${ipProtocol} ${this.fromPort}`; }
    return `${ipProtocol} ${this.fromPort}-${this.toPort}`;
  }

  public describePeer() {
    if (this.peer) {
      switch (this.peer.kind) {
        case 'cidr-ip':
          if (this.peer.ip === '0.0.0.0/0') { return 'Everyone (IPv4)'; }
          if (this.peer.ip === '::/0') { return 'Everyone (IPv6)'; }
          return `${this.peer.ip}`;
        case 'prefix-list': return `${this.peer.prefixListId}`;
        case 'security-group': return `${this.peer.securityGroupId}`;
      }
    }

    return '?';
  }

  public toJson(): RuleJson {
    return {
      groupId: this.groupId,
      ipProtocol: this.ipProtocol,
      fromPort: this.fromPort,
      toPort: this.toPort,
      peer: this.peer,
    };
  }
}

export interface CidrIpPeer {
  kind: 'cidr-ip';
  ip: string;
}

export interface SecurityGroupPeer {
  kind: 'security-group';
  securityGroupId: string;
}

export interface PrefixListPeer {
  kind: 'prefix-list';
  prefixListId: string;
}

export type RulePeer = CidrIpPeer | SecurityGroupPeer | PrefixListPeer;

function peerEqual(a?: RulePeer, b?: RulePeer) {
  if ((a === undefined) !== (b === undefined)) { return false; }
  if (a === undefined) { return true; }

  if (a.kind !== b!.kind) { return false; }
  switch (a.kind) {
    case 'cidr-ip': return a.ip === (b as typeof a).ip;
    case 'security-group': return a.securityGroupId === (b as typeof a).securityGroupId;
    case 'prefix-list': return a.prefixListId === (b as typeof a).prefixListId;
  }
}

function findFirst<T>(obj: any, keys: string[], fn: (x: string) => T): T | undefined {
  for (const key of keys) {
    if (key in obj) {
      return fn(obj[key]);
    }
  }
  return undefined;
}

export interface RuleJson {
  groupId: string;
  ipProtocol: string;
  fromPort?: number;
  toPort?: number;
  peer?: RulePeer;
}