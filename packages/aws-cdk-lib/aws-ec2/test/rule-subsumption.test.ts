import type { NormalizableRule } from '../lib/private/rule-subsumption';
import { isDominatedBy, isResolvedRule, pruneSubsumed } from '../lib/private/rule-subsumption';

/**
 * Expand a rule to a canonical set of (protocol, port, address-sample) triples it
 * admits, so we can assert that pruning is traffic-preserving. Uses a small,
 * fixed sample space rather than the full 2^32 address space.
 */
function admits(rule: NormalizableRule): Set<string> {
  const protocols = rule.ipProtocol === '-1' ? ['tcp', 'udp', 'icmp'] : [rule.ipProtocol ?? 'tcp'];
  const from = rule.fromPort ?? 0;
  const to = rule.toPort ?? 65535;
  // Sample ports at the boundaries and a few interior/well-known values.
  const portSamples = [0, 22, 80, 443, 1024, 3306, 65535].filter((p) => p >= from && p <= to);

  const addrSamples = addressSamples(rule);

  const out = new Set<string>();
  for (const proto of protocols) {
    for (const port of portSamples) {
      for (const addr of addrSamples) {
        out.add(`${proto}:${port}:${addr}`);
      }
    }
  }
  return out;
}

/**
 * A fixed set of representative addresses/peers, filtered to those the rule admits.
 */
function addressSamples(rule: NormalizableRule): string[] {
  const ALL_ADDR = ['10.0.0.5', '10.0.1.5', '10.1.0.5', '192.168.0.1', 'sg-A', 'sg-B', 'pl-A'];
  return ALL_ADDR.filter((a) => rulePermitsAddress(rule, a));
}

function rulePermitsAddress(rule: NormalizableRule, addr: string): boolean {
  if (addr.startsWith('sg-')) {
    return (rule.sourceSecurityGroupId ?? rule.destinationSecurityGroupId) === addr;
  }
  if (addr.startsWith('pl-')) {
    return (rule.sourcePrefixListId ?? rule.destinationPrefixListId) === addr;
  }
  // IPv4 address string.
  const cidr = rule.cidrIp;
  if (cidr === undefined) return false;
  return ipInCidr(addr, cidr);
}

function ipToNum(ip: string): number {
  return ip.split('.').reduce((acc, oct) => acc * 256 + parseInt(oct, 10), 0);
}

function ipInCidr(ip: string, cidr: string): boolean {
  const [base, maskStr] = cidr.split('/');
  const mask = parseInt(maskStr, 10);
  const size = 2 ** (32 - mask);
  const baseNum = ipToNum(base);
  const min = baseNum - (baseNum % size);
  const n = ipToNum(ip);
  return n >= min && n < min + size;
}

function admitsSet(rules: NormalizableRule[]): Set<string> {
  const out = new Set<string>();
  for (const r of rules) {
    for (const t of admits(r)) out.add(t);
  }
  return out;
}

// Rule builders for readability.
const tcp = (fromPort: number, toPort: number, cidrIp: string): NormalizableRule =>
  ({ ipProtocol: 'tcp', fromPort, toPort, cidrIp });
const tcpPort = (port: number, cidrIp: string): NormalizableRule => tcp(port, port, cidrIp);
const allTraffic = (cidrIp: string): NormalizableRule => ({ ipProtocol: '-1', cidrIp });
const sgRule = (fromPort: number, toPort: number, sg: string): NormalizableRule =>
  ({ ipProtocol: 'tcp', fromPort, toPort, sourceSecurityGroupId: sg });

describe('rule subsumption — dimension logic', () => {
  test('all-traffic (-1) dominates any specific port rule for the same/contained peer', () => {
    expect(isDominatedBy(tcpPort(443, '10.0.0.0/16'), allTraffic('10.0.0.0/16'))).toBe(true);
    expect(isDominatedBy(tcpPort(443, '10.0.1.0/24'), allTraffic('10.0.0.0/16'))).toBe(true);
  });

  test('a specific port rule does not dominate all-traffic', () => {
    expect(isDominatedBy(allTraffic('10.0.0.0/16'), tcpPort(443, '10.0.0.0/16'))).toBe(false);
  });

  test('port interval containment, same protocol and peer', () => {
    expect(isDominatedBy(tcp(443, 443, '10.0.0.0/8'), tcp(100, 500, '10.0.0.0/8'))).toBe(true);
    expect(isDominatedBy(tcp(100, 500, '10.0.0.0/8'), tcp(443, 443, '10.0.0.0/8'))).toBe(false);
  });

  test('different concrete protocols are incomparable', () => {
    const udp = (p: number, c: string): NormalizableRule => ({ ipProtocol: 'udp', fromPort: p, toPort: p, cidrIp: c });
    expect(isDominatedBy(tcpPort(53, '10.0.0.0/8'), udp(53, '10.0.0.0/8'))).toBe(false);
    expect(isDominatedBy(udp(53, '10.0.0.0/8'), tcpPort(53, '10.0.0.0/8'))).toBe(false);
  });

  test('CIDR containment on the peer dimension', () => {
    expect(isDominatedBy(tcpPort(443, '10.0.1.0/24'), tcpPort(443, '10.0.0.0/16'))).toBe(true);
    expect(isDominatedBy(tcpPort(443, '10.0.0.0/16'), tcpPort(443, '10.0.1.0/24'))).toBe(false);
    // 0.0.0.0/0 contains everything.
    expect(isDominatedBy(tcpPort(443, '10.0.1.0/24'), tcpPort(443, '0.0.0.0/0'))).toBe(true);
  });

  test('security-group and prefix-list peers are discrete (equality only)', () => {
    expect(isDominatedBy(sgRule(443, 443, 'sg-A'), sgRule(0, 65535, 'sg-A'))).toBe(true); // same peer, port range
    expect(isDominatedBy(sgRule(443, 443, 'sg-A'), sgRule(443, 443, 'sg-B'))).toBe(false); // different SG
    // An SG-id peer is never dominated by a CIDR peer, even 0.0.0.0/0.
    expect(isDominatedBy(sgRule(443, 443, 'sg-A'), tcpPort(443, '0.0.0.0/0'))).toBe(false);
  });

  test('IPv4 and IPv6 peers are never comparable', () => {
    const v6 = (p: number): NormalizableRule => ({ ipProtocol: 'tcp', fromPort: p, toPort: p, cidrIpv6: '::/0' });
    expect(isDominatedBy(tcpPort(443, '10.0.0.0/8'), v6(443))).toBe(false);
    expect(isDominatedBy(v6(443), tcpPort(443, '0.0.0.0/0'))).toBe(false);
  });
});

describe('rule subsumption — isDominatedBy is a preorder', () => {
  // A diverse pool spanning every dimension: protocols (incl. the -1 wildcard),
  // port representations (single, range, all-ports, absent), and every peer kind
  // (nested CIDRs, disjoint CIDRs, the 0.0.0.0/0 top, IPv6, two SGs, a prefix list).
  const udp = (from: number, to: number, cidrIp: string): NormalizableRule =>
    ({ ipProtocol: 'udp', fromPort: from, toPort: to, cidrIp });
  const v6 = (from: number, to: number): NormalizableRule =>
    ({ ipProtocol: 'tcp', fromPort: from, toPort: to, cidrIpv6: '::/0' });
  const plRule = (from: number, to: number, pl: string): NormalizableRule =>
    ({ ipProtocol: 'tcp', fromPort: from, toPort: to, sourcePrefixListId: pl });

  const POOL: NormalizableRule[] = [
    // TCP, nested IPv4 CIDRs, nested port ranges.
    tcpPort(443, '10.0.1.0/24'),
    tcp(443, 443, '10.0.0.0/16'),
    tcp(400, 500, '10.0.0.0/16'),
    tcp(0, 65535, '10.0.0.0/8'),
    tcpPort(443, '0.0.0.0/0'),
    allTraffic('10.0.0.0/16'),
    allTraffic('0.0.0.0/0'),
    // A disjoint CIDR + a different protocol.
    tcpPort(80, '192.168.0.0/24'),
    udp(53, 53, '10.0.0.0/16'),
    udp(0, 65535, '10.0.0.0/8'),
    // Other peer kinds.
    sgRule(443, 443, 'sg-A'),
    sgRule(0, 65535, 'sg-A'),
    sgRule(443, 443, 'sg-B'),
    plRule(443, 443, 'pl-A'),
    v6(443, 443),
    v6(0, 65535),
    // Absent-port rule (treated as full range for its protocol).
    { ipProtocol: 'tcp', cidrIp: '10.0.0.0/16' },
  ];

  test('reflexive: every rule dominates itself', () => {
    for (const r of POOL) {
      expect(isDominatedBy(r, r)).toBe(true);
    }
  });

  test('transitive: a ⊑ b and b ⊑ c implies a ⊑ c (exhaustive over the pool)', () => {
    // Transitivity is what makes a single pruning pass produce the minimal set,
    // so guard it directly: if a future change to the dimension orders breaks it,
    // this fails loudly.
    const violations: string[] = [];
    for (const a of POOL) {
      for (const b of POOL) {
        if (!isDominatedBy(a, b)) continue;
        for (const c of POOL) {
          if (isDominatedBy(b, c) && !isDominatedBy(a, c)) {
            violations.push(`${JSON.stringify(a)} ⊑ ${JSON.stringify(b)} ⊑ ${JSON.stringify(c)} but not a ⊑ c`);
          }
        }
      }
    }
    expect(violations).toEqual([]);
  });

  test('domination implies traffic containment (order is sound w.r.t. semantics)', () => {
    // The whole point of the order: a ⊑ b must mean admits(a) ⊆ admits(b).
    for (const a of POOL) {
      for (const b of POOL) {
        if (!isDominatedBy(a, b)) continue;
        const admitsA = admits(a);
        const admitsB = admits(b);
        for (const t of admitsA) {
          expect(admitsB.has(t)).toBe(true);
        }
      }
    }
  });
});

describe('rule subsumption — token safety', () => {
  test('rules with tokenized peers are opaque and never dropped', () => {
    const tokenPeer: NormalizableRule = { ipProtocol: 'tcp', fromPort: 443, toPort: 443, sourceSecurityGroupId: '${Token[TOKEN.42]}' };
    const broad = allTraffic('0.0.0.0/0');
    const result = pruneSubsumed([broad, tokenPeer]);
    expect(result).toContain(tokenPeer);
  });

  test('an opaque rule never dominates a resolved rule', () => {
    const indirect: NormalizableRule = { ipProtocol: 'tcp', fromPort: 443, toPort: 443, cidrIp: '{IndirectPeer}' };
    const concrete = tcpPort(443, '10.0.0.0/24');
    // Even though the strings differ, the point is: the opaque rule must not be
    // treated as a broad dominator that eliminates the concrete rule.
    const result = pruneSubsumed([indirect, concrete]);
    expect(result).toContain(concrete);
    expect(result).toContain(indirect);
  });

  test('isResolvedRule rejects tokenized values', () => {
    expect(isResolvedRule(tcpPort(443, '10.0.0.0/24'))).toBe(true);
    expect(isResolvedRule({ ipProtocol: 'tcp', fromPort: 443, toPort: 443, cidrIp: '${Token[TOKEN.1]}' })).toBe(false);
  });
});

describe('rule subsumption — reducer properties', () => {
  const scenarios: Array<{ name: string; rules: NormalizableRule[]; expectedCount: number }> = [
    {
      name: 'broad all-traffic subsumes narrow port rule (same peer)',
      rules: [allTraffic('10.0.0.0/16'), tcpPort(443, '10.0.0.0/16')],
      expectedCount: 1,
    },
    {
      name: 'broad CIDR subsumes narrow CIDR (same port)',
      rules: [tcpPort(443, '10.0.0.0/16'), tcpPort(443, '10.0.1.0/24')],
      expectedCount: 1,
    },
    {
      name: 'exact duplicates collapse to one',
      rules: [tcpPort(443, '10.0.0.0/24'), tcpPort(443, '10.0.0.0/24')],
      expectedCount: 1,
    },
    {
      name: 'independent rules all survive',
      rules: [tcpPort(443, '10.0.0.0/24'), tcpPort(80, '192.168.0.0/24'), sgRule(22, 22, 'sg-A')],
      expectedCount: 3,
    },
    {
      name: 'chain: /24 ⊑ /16 ⊑ /8 collapses to the /8',
      rules: [tcpPort(443, '10.0.1.0/24'), tcpPort(443, '10.0.0.0/16'), tcpPort(443, '10.0.0.0/8')],
      expectedCount: 1,
    },
  ];

  test.each(scenarios)('$name → $expectedCount rule(s)', ({ rules, expectedCount }) => {
    expect(pruneSubsumed(rules)).toHaveLength(expectedCount);
  });

  test.each(scenarios)('traffic-preserving: $name', ({ rules }) => {
    expect(admitsSet(pruneSubsumed(rules))).toEqual(admitsSet(rules));
  });

  test.each(scenarios)('idempotent: $name', ({ rules }) => {
    const once = pruneSubsumed(rules);
    expect(pruneSubsumed(once)).toEqual(once);
  });

  test.each(scenarios)('canonical: exact array output invariant under permutation: $name', ({ rules }) => {
    // Stronger than set-equality: the emitted ARRAY (order and chosen
    // representatives) must be identical for every permutation of the input.
    const canonical = pruneSubsumed(rules);
    for (const perm of permutations(rules)) {
      expect(pruneSubsumed(perm)).toEqual(canonical);
    }
  });

  test('canonical representative does not depend on insertion order (equivalent rules)', () => {
    // Two rules that denote the same traffic but differ only by description are
    // mutually dominating. The surviving representative must be the same
    // regardless of insertion order.
    const a: NormalizableRule = { ipProtocol: 'tcp', fromPort: 443, toPort: 443, cidrIp: '10.0.0.0/24', description: 'A' };
    const b: NormalizableRule = { ipProtocol: 'tcp', fromPort: 443, toPort: 443, cidrIp: '10.0.0.0/24', description: 'B' };
    const forward = pruneSubsumed([a, b]);
    const backward = pruneSubsumed([b, a]);
    expect(forward).toHaveLength(1);
    expect(backward).toHaveLength(1);
    expect(forward).toEqual(backward);
  });

  test('non-canonical CIDRs are NOT pruned (soundness: CidrBlock misinterprets host bits)', () => {
    // `10.0.255.9/24` means `10.0.255.0/24` to AWS, but CidrBlock parses it as
    // `10.1.0.0/24`. We must NOT let that mis-parse cause a spurious subsumption
    // (which would silently drop traffic). The rule with host bits set survives.
    const broad = tcpPort(443, '10.1.0.0/16');
    const nonCanonical = tcpPort(443, '10.0.255.9/24');
    const result = pruneSubsumed([broad, nonCanonical]);
    expect(result).toContain(nonCanonical);
    expect(result).toHaveLength(2);
  });

  test('survivors are emitted in a canonical order regardless of insertion order', () => {
    const r1 = tcpPort(443, '10.0.0.0/24');
    const r2 = tcpPort(80, '192.168.0.0/24');
    const r3 = sgRule(22, 22, 'sg-A');
    expect(pruneSubsumed([r1, r2, r3])).toEqual(pruneSubsumed([r3, r1, r2]));
    expect(pruneSubsumed([r1, r2, r3])).toEqual(pruneSubsumed([r2, r3, r1]));
  });
});

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const p of permutations(rest)) {
      out.push([arr[i], ...p]);
    }
  }
  return out;
}
