// IAM Statement merging
//
// See docs/policy-merging.als for a formal model of the logic
// implemented here.


import { LITERAL_STRING_KEY } from '../util';
import { StatementSchema, normalizeStatement, IamValue } from './postprocess-policy-document';

/**
 * Merge as many statements as possible to shrink the total policy doc, modifying the input array in place
 *
 * We compare and merge all pairs of statements (O(N^2) complexity), opportunistically
 * merging them. This is not guaranteed to produce the optimal output, but it's probably
 * Good Enough(tm). If it merges anything, it's at least going to produce a smaller output
 * than the input.
 */
export function mergeStatements(statements: StatementSchema[]): StatementSchema[] {
  const compStatements = statements.map(makeComparable);

  // Keep trying until nothing changes anymore
  while (onePass()) { /* again */ }
  return compStatements.map(renderComparable);

  // Do one optimization pass, return 'true' if we merged anything
  function onePass() {
    let ret = false;
    let i = 0;
    while (i < compStatements.length) {
      let didMerge = false;

      for (let j = i + 1; j < compStatements.length; j++) {
        const merged = tryMerge(compStatements[i], compStatements[j]);
        if (merged) {
          compStatements[i] = merged;
          compStatements.splice(j, 1);
          ret = didMerge = true;
          break;
        }
      }

      if (!didMerge) {
        i++;
      }
    }
    return ret;
  }
}

/**
 * Given two statements, return their merging (if possible)
 *
 * We can merge two statements if:
 *
 * - Their effects are the same
 * - They don't have Sids (not really a hard requirement, but just a simplification and an escape hatch)
 * - Their Conditions are the same
 * - Their NotAction, NotResource and NotPrincipal sets are the same (empty sets is fine).
 * - From their Action, Resource and Principal sets, 2 are subsets of each other
 *   (empty sets are fine).
 */
function tryMerge(a: ComparableStatement, b: ComparableStatement): ComparableStatement | undefined {
  // Effects must be the same
  if (a.effect !== b.effect) { return; }
  // We don't merge Sids (for now)
  if (a.sid || b.sid) { return; }

  if (a.conditionString !== b.conditionString) { return; }
  if (!setEqual(a.notAction, b.notAction) || !setEqual(a.notResource, b.notResource) || !setEqual(a.notPrincipal, b.notPrincipal)) { return; }

  // We can merge these statements if 2 out of the 3 sets of Action, Resource, Principal
  // are the same.
  const setsEqual = (setEqual(a.action, b.action) ? 1 : 0) +
    (setEqual(a.resource, b.resource) ? 1 : 0) +
    (setEqual(a.principal, b.principal) ? 1 : 0);

  if (setsEqual < 2 || unmergeablePrincipals(a, b)) { return; }

  return {
    effect: a.effect,
    conditionString: a.conditionString,
    conditionValue: b.conditionValue,
    notAction: a.notAction,
    notPrincipal: a.notPrincipal,
    notResource: a.notResource,

    action: setMerge(a.action, b.action),
    resource: setMerge(a.resource, b.resource),
    principal: setMerge(a.principal, b.principal),
  };
}

/**
 * Calculate and return cached string set representation of the statement elements
 *
 * This is to be able to do comparisons on these sets quickly.
 */
function makeComparable(s: StatementSchema): ComparableStatement {
  return {
    effect: s.Effect,
    sid: s.Sid,
    action: iamSet(s.Action),
    notAction: iamSet(s.NotAction),
    resource: iamSet(s.Resource),
    notResource: iamSet(s.NotResource),
    principal: principalIamSet(s.Principal),
    notPrincipal: principalIamSet(s.NotPrincipal),
    conditionString: JSON.stringify(s.Condition),
    conditionValue: s.Condition,
  };

  function forceArray<A>(x: A | Array<A>): Array<A> {
    return Array.isArray(x) ? x : [x];
  }

  function iamSet(x: IamValue | undefined): IamValueSet {
    if (x == undefined) { return {}; }
    return mkdict(forceArray(x).map(e => [JSON.stringify(e), e]));
  }

  function principalIamSet(x: IamValue | Record<string, IamValue> | undefined): IamValueSet {
    if (x === undefined) { return {}; }

    if (Array.isArray(x) || typeof x === 'string') {
      x = { [LITERAL_STRING_KEY]: x };
    }

    if (typeof x === 'object' && x !== null) {
      // Turn { AWS: [a, b], Service: [c] } into [{ AWS: a }, { AWS: b }, { Service: c }]
      const individualPrincipals = Object.entries(x).flatMap(([principalType, value]) => forceArray(value).map(v => ({ [principalType]: v })));
      return iamSet(individualPrincipals);
    }
    return {};
  }
}

/**
 * Return 'true' if the two principals are unmergeable
 *
 * This only happens if one of them is a literal, untyped principal (typically,
 * `Principal: '*'`) and the other one is typed.
 *
 * `Principal: '*'` behaves subtly different than `Principal: { AWS: '*' }` and must
 * therefore be preserved.
 */
function unmergeablePrincipals(a: ComparableStatement, b: ComparableStatement) {
  const aHasLiteral = Object.values(a.principal).some(v => LITERAL_STRING_KEY in v);
  const bHasLiteral = Object.values(b.principal).some(v => LITERAL_STRING_KEY in v);
  return aHasLiteral !== bHasLiteral;
}

/**
 * Turn a ComparableStatement back into a StatementSchema
 */
function renderComparable(s: ComparableStatement): StatementSchema {
  return normalizeStatement({
    Effect: s.effect,
    Sid: s.sid,
    Condition: s.conditionValue,
    Action: renderSet(s.action),
    NotAction: renderSet(s.notAction),
    Resource: renderSet(s.resource),
    NotResource: renderSet(s.notResource),
    Principal: renderPrincipalSet(s.principal),
    NotPrincipal: renderPrincipalSet(s.notPrincipal),
  });

  function renderSet(x: IamValueSet): IamValue | undefined {
    // Return as sorted array so that we normalize
    const keys = Object.keys(x).sort();
    return keys.length > 0 ? keys.map(key => x[key]) : undefined;
  }

  function renderPrincipalSet(x: IamValueSet): Record<string, IamValue> {
    const keys = Object.keys(x).sort();
    // The first level will be an object
    const ret: Record<string, IamValue> = {};
    for (const key of keys) {
      const principal = x[key];
      if (principal == null || typeof principal !== 'object') {
        throw new Error(`Principal should be an object with a principal type, got: ${principal}`);
      }
      const principalKeys = Object.keys(principal);
      if (principalKeys.length !== 1) {
        throw new Error(`Principal should be an object with 1 key, found keys: ${principalKeys}`);
      }
      const pk = principalKeys[0];
      if (!ret[pk]) {
        ret[pk] = [];
      }
      (ret[pk] as IamValue[]).push(principal[pk]);
    }
    return ret;
  }
}

/**
 * An analyzed version of a statement that makes it easier to do comparisons and merging on
 *
 * We will stringify parts of the statement: comparisons are done on the strings, the original
 * values are retained so we can stitch them back together into a real policy.
 */
interface ComparableStatement {
  readonly effect?: string;
  readonly sid?: string;

  readonly principal: IamValueSet;
  readonly notPrincipal: IamValueSet;
  readonly action: IamValueSet;
  readonly notAction: IamValueSet;
  readonly resource: IamValueSet;
  readonly notResource: IamValueSet;

  readonly conditionString: string;
  readonly conditionValue: any;
}

/**
 * A collection of comparable IAM values
 *
 * Each value is indexed by its stringified value, mapping to its original value.
 * This allows us to compare values quickly and easily (even if they are complex),
 * while also being able to deduplicate the originals.
 */
type IamValueSet = Record<string, any>;

/**
 * Whether the given sets are equal
 */
function setEqual(a: IamValueSet, b: IamValueSet) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  return keysA.length === keysB.length && keysA.every(k => k in b);
}

/**
 * Merge two IAM value sets
 */
function setMerge(x: IamValueSet, y: IamValueSet): IamValueSet {
  return { ...x, ...y };
}

function mkdict<A>(xs: Array<[string, A]>): Record<string, A> {
  const ret: Record<string, A> = {};
  for (const x of xs) {
    ret[x[0]] = x[1];
  }
  return ret;
}
