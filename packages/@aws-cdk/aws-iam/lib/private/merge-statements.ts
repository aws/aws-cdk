// IAM Statement merging
//
// See docs/policy-merging.als for a formal model of the logic
// implemented here.


import { StatementSchema, normalizeStatement } from './postprocess-policy-document';

const STATEMENT_ANALYSIS_SYM = Symbol('statement-analysis');

/**
 * Merge as many statements as possible to shrink the total policy doc, modifying the input array in place
 *
 * We compare and merge all pairs of statements (O(N^2) complexity), opportunistically
 * merging them. This is not guaranteed to produce the optimal output, but it's probably
 * Good Enough(tm).
 */
export function mergeStatements(statements: StatementSchema[]): StatementSchema[] {
  let i = 0;
  while (i < statements.length) {
    let didMerge = false;

    for (let j = i + 1; j < statements.length; j++) {
      const merged = tryMerge(statements[i], statements[j]);
      if (merged) {
        statements[i] = merged;
        statements.splice(j, 1);
        didMerge = true;
        break;
      }
    }

    if (!didMerge) {
      i++;
    }
  }

  return statements;
}

/**
 * Given two statements, return their merging (if possible)
 *
 * We can merge two statements if:
 *
 * - Their effects are the same
 * - They don't have Sids (not really a hard requirement, but just a simplification)
 * - Their Conditions are the same
 * - Their NotAction, NotResource and NotPrincipal sets are the same (empty sets is fine).
 * - From their Action, Resource and Principal sets, 2 are subsets of each other
 *   (empty sets are fine).
 */
function tryMerge(a: StatementSchema, b: StatementSchema): StatementSchema | undefined {
  // Effects must be the same
  if (a.Effect !== b.Effect) { return; }
  // We don't merge Sids (for now)
  if (a.Sid || b.Sid) { return; }

  const aa = statementAnalysis(a);
  const bb = statementAnalysis(b);

  if (aa.condition !== bb.condition) { return; }
  if (!setEqual(aa.notAction, bb.notAction) || !setEqual(aa.notResource, bb.notResource) || !setEqual(aa.notPrincipal, bb.notPrincipal)) { return; }

  // We can merge these statements if 2 out of the 3 sets of Action, Resource, Principal
  // are the same.
  const setsEqual = (setEqual(aa.action, bb.action) ? 1 : 0) +
    (setEqual(aa.resource, bb.resource) ? 1 : 0) +
    (setEqual(aa.principal, bb.principal) ? 1 : 0);

  if (setsEqual < 2) { return; }

  return normalizeStatement({
    Effect: a.Effect,
    Condition: a.Condition,

    Action: aa.action.size + bb.action.size > 0 ? mergeValues(a.Action, b.Action) : undefined,
    Resource: aa.resource.size + bb.resource.size > 0 ? mergeValues(a.Resource, b.Resource) : undefined,
    Principal: aa.principal.size + bb.principal.size > 0 ? mergePrincipals(a.Principal, b.Principal) : undefined,

    NotAction: a.NotAction,
    NotPrincipal: a.NotPrincipal,
    NotResource: a.NotResource,
  });
}

function mergeValues(a: IamValue, b: IamValue): any {
  if (!a && !b) { return a; }
  if (Array.isArray(a) && Array.isArray(b)) { return normalizedArray(...a, ...b); }
  if (Array.isArray(a) && typeof b === 'string') { return normalizedArray(...a, b); }
  if (Array.isArray(b) && typeof a === 'string') { return normalizedArray(a, ...b); }
  if (typeof a === 'string' && typeof b === 'string') { return normalizedArray(a, b); }

  // Otherwise combine both into an array
  return [a, b];
}

/**
 * Merge objects (if both arguments are objects)
 *
 * Used for merging principal types.
 */
function mergePrincipals(a: IamValue, b: IamValue): any {
  if (typeof a === 'object' && typeof b === 'object' && b != null) {
    const ret: any = { ...a };
    for (const [k, v] of Object.entries(b)) {
      // Not recursive -- we only ever do one level of object merging
      ret[k] = ret[k] ? mergeValues(ret[k], v) : v;
    }
    return ret;
  }

  return mergeValues(a, b);
}

/**
 * Deduplicate and sort.
 *
 * Elements should be strings, but may not be.
 *
 * - Deduplication is a necessary part of minimization.
 * - Sorting is just nice for snapshots.
 */
function normalizedArray(...xs: unknown[]): unknown[] {
  return Array.from(new Set(xs)).sort();
}

type IamValue = unknown | unknown[];

/**
 * Calculate and return cached string set representation of the statement elements
 *
 * This is to be able to do comparisons on these sets quickly.
 */
function statementAnalysis(s: StatementSchema): StatementAnalysis {
  if (!(s as any)[STATEMENT_ANALYSIS_SYM]) {
    const analysis: StatementAnalysis = {
      action: asSet(s.Action),
      notAction: asSet(s.NotAction),
      resource: asSet(s.Resource),
      notResource: asSet(s.NotResource),
      principal: principalAsSet(s.Principal),
      notPrincipal: principalAsSet(s.NotPrincipal),
      condition: JSON.stringify(s.Condition),
    };
    Object.defineProperty(s, STATEMENT_ANALYSIS_SYM, {
      value: analysis,
      enumerable: false,
    });
  }
  return (s as any)[STATEMENT_ANALYSIS_SYM];

  function asSet(x: IamValue | undefined): Set<string> {
    if (x == undefined) { return new Set(); }
    return Array.isArray(x) ? new Set(x.map(e => JSON.stringify(e))) : new Set([JSON.stringify(x)]);
  }

  function principalAsSet(x: IamValue | Record<string, IamValue>): Set<string> {
    if (Array.isArray(x) || typeof x === 'string') { return asSet(x); }
    if (typeof x === 'object' && x !== null) {
      return new Set(Object.entries(x).flatMap(([key, value]) => Array.from(asSet(value)).map(e => `${key}:${e}`)));
    }
    return new Set();
  }
}

/**
 * Cached information on a Statement
 *
 * Stringified representations of the most important aspects of the statement.
 * These are only used to compare two statements.
 */
interface StatementAnalysis {
  readonly principal: Set<string>;
  readonly notPrincipal: Set<string>;
  readonly action: Set<string>;
  readonly notAction: Set<string>;
  readonly resource: Set<string>;
  readonly notResource: Set<string>;
  readonly condition: string;
}

/**
 * Whether the given sets are equal
 */
function setEqual(a: Set<string>, b: Set<string>) {
  return a.size == b.size && Array.from(a).every(e => b.has(e));
}