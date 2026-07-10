import { CidrBlock } from '../network-util';

/**
 * Order-theoretic normalization of security-group rules (Phase 1: subsumption pruning).
 *
 * A security-group rule is a point in a product lattice:
 *
 *   rule = (protocol, portRange) x peer
 *
 * We define a partial order `⊑` ("is at least as permissive as", i.e. admits a
 * subset of the traffic) on each dimension, take the product order, and remove
 * any rule that is dominated by another rule in the same set. Dropping a
 * dominated rule never changes the set of admitted traffic, so the reduced set
 * is semantically equivalent to the input.
 *
 * This module contains ONLY pure functions over plain rule objects so that it can
 * be property-tested in isolation (see `test/rule-subsumption.test.ts`). It knows
 * nothing about constructs, tokens, or CloudFormation resources.
 *
 * See `docs/rfcs/connections-rule-subsumption.md` for the full design.
 */

/**
 * The peer/port fields of a security-group rule that matter for subsumption.
 *
 * This is intentionally the intersection of `CfnSecurityGroup.IngressProperty`
 * and `CfnSecurityGroup.EgressProperty` (minus `description`, which is cosmetic
 * and does not affect admitted traffic). Both ingress and egress rules can be
 * projected onto this shape.
 */
export interface NormalizableRule {
  readonly ipProtocol?: string;
  readonly fromPort?: number;
  readonly toPort?: number;

  // Peer fields. Exactly one family is populated for a resolved rule.
  readonly cidrIp?: string;
  readonly cidrIpv6?: string;
  readonly sourceSecurityGroupId?: string;
  readonly sourceSecurityGroupName?: string;
  readonly sourceSecurityGroupOwnerId?: string;
  readonly sourcePrefixListId?: string;
  readonly destinationSecurityGroupId?: string;
  readonly destinationPrefixListId?: string;

  // Cosmetic. Never affects subsumption/admitted traffic; used only as the final
  // tie-breaker in the canonical order so that output is fully deterministic.
  readonly description?: string;
}

const ALL_PROTOCOLS = '-1';
const ANY_IPV4 = '0.0.0.0/0';
const ANY_IPV6 = '::/0';

/**
 * Whether a rule is "fully resolved" — i.e. contains no unresolved Tokens and can
 * therefore participate in subsumption reasoning.
 *
 * Rules with tokenized ports or peers never reach the inline-rule arrays in the
 * first place (they are emitted as standalone `CfnSecurityGroupIngress/Egress`
 * resources), so in practice this is a defensive check. We treat a `{IndirectX}`
 * marker or a value carrying an unresolved-token shape as opaque and refuse to
 * reduce it. Opaque rules pass through the normalizer verbatim.
 */
export function isResolvedRule(rule: NormalizableRule): boolean {
  // A tokenized number resolves to a string marker like "${Token[...]}" once
  // rendered; a tokenized peer renders to "{IndirectPeer}". Guard against both
  // by rejecting anything that isn't a concrete number/CIDR/id we understand.
  if (rule.fromPort !== undefined && typeof rule.fromPort !== 'number') return false;
  if (rule.toPort !== undefined && typeof rule.toPort !== 'number') return false;

  for (const s of [
    rule.cidrIp, rule.cidrIpv6, rule.sourceSecurityGroupId, rule.sourceSecurityGroupName,
    rule.sourceSecurityGroupOwnerId, rule.sourcePrefixListId, rule.destinationSecurityGroupId,
    rule.destinationPrefixListId,
  ]) {
    if (s === undefined) continue;
    // A peer that is still an unresolved token may arrive as a non-string
    // `IResolvable` object or as a `${Token[...]}` / `{Indirect...}` string
    // marker. Treat anything that isn't a plain concrete string as opaque.
    if (typeof s !== 'string' || looksTokenized(s)) return false;
  }
  return true;
}

function looksTokenized(s: string): boolean {
  return s.includes('${Token[') || s.includes('{Indirect');
}

/**
 * Port dimension: does port range `a` fit within port range `b`?
 *
 * `-1` (all protocols) is the top element: it dominates any port range regardless
 * of the other rule's protocol. Within the same protocol, containment is interval
 * containment `[a.from, a.to] ⊆ [b.from, b.to]`. Different protocols (neither of
 * them the wildcard) are incomparable.
 */
function portDominates(a: NormalizableRule, b: NormalizableRule): boolean {
  // `b` is the (potentially) dominating rule.
  if (b.ipProtocol === ALL_PROTOCOLS) {
    // All-protocols admits every protocol and every port.
    return true;
  }
  if (a.ipProtocol === ALL_PROTOCOLS) {
    // `a` is broader than a specific-protocol `b`; `b` cannot dominate it.
    return false;
  }
  if (a.ipProtocol !== b.ipProtocol) {
    // Distinct concrete protocols are incomparable.
    return false;
  }

  // Same protocol: compare port intervals. When ports are absent (e.g. for
  // protocols where CFN allows omitting them), treat as the full range so that
  // an absent-port rule behaves like "all ports of this protocol".
  const [aFrom, aTo] = portInterval(a);
  const [bFrom, bTo] = portInterval(b);
  return bFrom <= aFrom && aTo <= bTo;
}

function portInterval(rule: NormalizableRule): [number, number] {
  const from = rule.fromPort ?? 0;
  const to = rule.toPort ?? 65535;
  return [from, to];
}

/**
 * Peer dimension: does peer of `a` fit within peer of `b`?
 *
 * - CIDRs order by containment (`10.0.1.0/24 ⊑ 10.0.0.0/16 ⊑ 0.0.0.0/0`), per
 *   address family. IPv4 and IPv6 are separate families and never comparable.
 * - Security-group ids and prefix-list ids are DISCRETE: comparable only by
 *   equality. An SG-id peer never dominates a different SG-id or a CIDR.
 * - Peers of different kinds are incomparable (except that they may be equal,
 *   which is handled by the discrete case).
 */
function peerDominates(a: NormalizableRule, b: NormalizableRule): boolean {
  const ka = peerKind(a);
  const kb = peerKind(b);
  if (ka === undefined || kb === undefined || ka.kind !== kb.kind) {
    return false;
  }

  switch (ka.kind) {
    case 'ipv4':
      return cidrContains(kb.value, ka.value);
    case 'ipv6':
      // We do not have an IPv6 CIDR-containment helper; only exact equality and
      // the ::/0 top element are safe to reason about.
      return kb.value === ANY_IPV6 || kb.value === ka.value;
    case 'sg':
    case 'prefixList':
      // Discrete: comparable only by equality.
      return ka.value === kb.value;
  }
}

interface PeerKind {
  readonly kind: 'ipv4' | 'ipv6' | 'sg' | 'prefixList';
  readonly value: string;
}

function peerKind(rule: NormalizableRule): PeerKind | undefined {
  if (rule.cidrIp !== undefined) return { kind: 'ipv4', value: rule.cidrIp };
  if (rule.cidrIpv6 !== undefined) return { kind: 'ipv6', value: rule.cidrIpv6 };
  const sg = rule.sourceSecurityGroupId ?? rule.destinationSecurityGroupId;
  if (sg !== undefined) {
    // Include owner/name so that peers that differ in owner/name are not
    // treated as equal.
    const owner = rule.sourceSecurityGroupOwnerId ?? '';
    const name = rule.sourceSecurityGroupName ?? '';
    return { kind: 'sg', value: `${sg}|${owner}|${name}` };
  }
  const pl = rule.sourcePrefixListId ?? rule.destinationPrefixListId;
  if (pl !== undefined) return { kind: 'prefixList', value: pl };
  return undefined;
}

/**
 * Whether IPv4 CIDR `outer` fully contains IPv4 CIDR `inner`.
 *
 * `0.0.0.0/0` contains everything. Falls back to `false` on any parse trouble
 * so we never drop a rule we cannot prove is subsumed.
 *
 * IMPORTANT: `CidrBlock` does NOT interpret a non-canonical CIDR (one with host
 * bits set, e.g. `10.0.0.5/24`) the way AWS does. AWS masks the host bits off
 * (`10.0.0.5/24` means `10.0.0.0/24`), but `CidrBlock` rounds UP to the next
 * block (`10.0.0.5/24` -> `10.0.1.0/24`). Reasoning about containment with such
 * a value could wrongly conclude a rule is subsumed and silently drop traffic.
 * We therefore only trust containment when BOTH CIDRs are already canonical;
 * otherwise we conservatively return `false` (keep the rule).
 */
function cidrContains(outer: string, inner: string): boolean {
  if (outer === ANY_IPV4) return true;
  try {
    const outerBlock = new CidrBlock(outer);
    const innerBlock = new CidrBlock(inner);
    if (!isCanonicalCidr(outer, outerBlock) || !isCanonicalCidr(inner, innerBlock)) {
      return false;
    }
    return outerBlock.containsCidr(innerBlock);
  } catch {
    return false;
  }
}

/**
 * Whether `cidr` is written in canonical form (its host bits are already zero),
 * so that `CidrBlock`'s numeric interpretation matches AWS's masking semantics.
 *
 * `CidrBlock.cidr` is the normalized `minIp()/mask` form; if it round-trips to
 * the original string, the input had no host bits set.
 */
function isCanonicalCidr(original: string, block: CidrBlock): boolean {
  return block.cidr === original;
}

/**
 * Whether rule `a` is dominated by rule `b` (`a ⊑ b`, `a !== b` allowed).
 *
 * `a` is dominated when every packet `a` admits is also admitted by `b`, which
 * holds iff `b` dominates `a` on BOTH the port and peer dimensions.
 */
export function isDominatedBy(a: NormalizableRule, b: NormalizableRule): boolean {
  return portDominates(a, b) && peerDominates(a, b);
}

/**
 * Reduce a set of rules to a minimal equivalent set by removing rules that are
 * subsumed by another rule in the set, and emit the survivors in a canonical
 * order (Phase 1).
 *
 * Properties (verified in tests):
 * - Traffic-preserving: `admits(prune(R)) === admits(R)`.
 * - Idempotent: `prune(prune(R)) === prune(R)`.
 * - Canonical: the RESULT (as an ordered array) is a pure function of the input
 *   *set*, independent of the order rules were added. This is what makes the
 *   synthesized rule list stable across runs regardless of insertion-order noise
 *   (e.g. differing library versions or cross-stack aggregation order).
 *
 * Rules that are not fully resolved (`isResolvedRule` is false) are passed
 * through untouched and never used to dominate another rule.
 *
 * The original rule objects (including their `description`) are preserved; we
 * only decide which ones to keep. When two rules are mutually dominating
 * (equivalent — e.g. `10.0.0.5/24` and `10.0.0.0/24`, which denote the same
 * block), the canonically-smallest one is kept, so the choice does not depend on
 * insertion order. Byte-identical duplicates fall back to keeping the earliest.
 */
export function pruneSubsumed<T extends NormalizableRule>(rules: readonly T[]): T[] {
  const resolved: Array<{ rule: T; index: number }> = [];
  const opaque: T[] = [];
  rules.forEach((rule, index) => {
    if (isResolvedRule(rule)) {
      resolved.push({ rule, index });
    } else {
      opaque.push(rule);
    }
  });

  const kept: T[] = [];
  for (const candidate of resolved) {
    const dominated = resolved.some((other) => {
      if (other === candidate) return false;
      if (!isDominatedBy(candidate.rule, other.rule)) return false;
      if (!isDominatedBy(other.rule, candidate.rule)) {
        // `other` strictly dominates `candidate` — drop `candidate`.
        return true;
      }
      // Mutually dominating (equivalent). Keep the canonically-smallest so the
      // surviving representative does not depend on insertion order; for
      // byte-identical rules (compare === 0) keep the earliest so exact
      // duplicates still collapse to a single rule.
      const cmp = canonicalCompare(other.rule, candidate.rule);
      return cmp < 0 || (cmp === 0 && other.index < candidate.index);
    });
    if (!dominated) {
      kept.push(candidate.rule);
    }
  }

  // Emit a canonical ordering for the resolved survivors. Rule order is
  // semantically irrelevant to EC2, so sorting is safe; it makes the resolved
  // portion of the output a pure function of the rule set's content, regardless
  // of insertion order. Opaque (tokenized) rules are appended in their original
  // input order — their field values may still be unresolved `IResolvable`
  // objects at this point, so they cannot be compared by content.
  kept.sort(canonicalCompare);
  return [...kept, ...opaque];
}

/**
 * A total order over rules by their (resolved) content, used both to pick the
 * canonical representative among equivalent rules and to emit a stable ordering.
 *
 * Ports are compared numerically (so `443` sorts before `3306`); all other
 * fields lexicographically, over a fixed field order. `description` is compared
 * LAST — it does not affect admitted traffic, so it only breaks ties between
 * rules that are otherwise identical, ensuring the surviving representative (and
 * hence the output) is fully deterministic regardless of insertion order.
 */
function canonicalCompare(a: NormalizableRule, b: NormalizableRule): number {
  return (
    cmpStr(a.ipProtocol, b.ipProtocol) ||
    cmpNum(a.fromPort, b.fromPort) ||
    cmpNum(a.toPort, b.toPort) ||
    cmpStr(a.cidrIp, b.cidrIp) ||
    cmpStr(a.cidrIpv6, b.cidrIpv6) ||
    cmpStr(a.sourceSecurityGroupId, b.sourceSecurityGroupId) ||
    cmpStr(a.sourceSecurityGroupName, b.sourceSecurityGroupName) ||
    cmpStr(a.sourceSecurityGroupOwnerId, b.sourceSecurityGroupOwnerId) ||
    cmpStr(a.sourcePrefixListId, b.sourcePrefixListId) ||
    cmpStr(a.destinationSecurityGroupId, b.destinationSecurityGroupId) ||
    cmpStr(a.destinationPrefixListId, b.destinationPrefixListId) ||
    cmpStr(a.description, b.description)
  );
}

function cmpNum(a?: number, b?: number): number {
  const av = a ?? -1;
  const bv = b ?? -1;
  return av === bv ? 0 : av < bv ? -1 : 1;
}

function cmpStr(a?: string, b?: string): number {
  const av = a ?? '';
  const bv = b ?? '';
  return av < bv ? -1 : av > bv ? 1 : 0;
}
