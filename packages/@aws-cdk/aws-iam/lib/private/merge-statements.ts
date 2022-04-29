// IAM Statement merging
//
// See docs/policy-merging.als for a formal model of the logic
// implemented here.


import { PolicyStatement } from '../policy-statement';
import { IPrincipal } from '../principals';
import { LITERAL_STRING_KEY } from '../util';


/*
 * Don't produce any merged statements larger than this.
 *
 * They will become impossible to divide across managed policies if we do,
 * and this is the maximum size for User policies.
 */
const MAX_MERGE_SIZE = 2000;

/**
 * Merge as many statements as possible to shrink the total policy doc, modifying the input array in place
 *
 * We compare and merge all pairs of statements (O(N^2) complexity), opportunistically
 * merging them. This is not guaranteed to produce the optimal output, but it's probably
 * Good Enough(tm). If it merges anything, it's at least going to produce a smaller output
 * than the input.
 */
export function mergeStatements(statements: PolicyStatement[]): MergeStatementResult {
  const compStatements = statements.map(makeComparable);

  // Keep trying until nothing changes anymore
  while (onePass()) { /* again */ }

  const mergedStatements = new Array<PolicyStatement>();
  const originsMap = new Map<PolicyStatement, PolicyStatement[]>();
  for (const comp of compStatements) {
    const statement = renderComparable(comp);
    mergedStatements.push(statement);
    originsMap.set(statement, comp.originals);
  }

  return { mergedStatements, originsMap };

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

export interface MergeStatementResult {
  /**
   * The list of maximally merged statements
   */
  readonly mergedStatements: PolicyStatement[];

  /**
   * Mapping of old to new statements
   */
  readonly originsMap: Map<PolicyStatement, PolicyStatement[]>;
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
  if (a.statement.effect !== b.statement.effect) { return; }
  // We don't merge Sids (for now)
  if (a.statement.sid || b.statement.sid) { return; }
  // Not if the combination grows too large
  if (a.sizeEstimate + b.sizeEstimate > MAX_MERGE_SIZE) { return; }

  if (a.conditionString !== b.conditionString) { return; }
  if (
    !setEqual(a.statement.notActions, b.statement.notActions) ||
    !setEqual(a.statement.notResources, b.statement.notResources) ||
    !setEqual(a.notPrincipalStrings, b.notPrincipalStrings)
  ) {
    return;
  }

  // We can merge these statements if 2 out of the 3 sets of Action, Resource, Principal
  // are the same.
  const setsEqual = (setEqual(a.statement.actions, b.statement.actions) ? 1 : 0) +
    (setEqual(a.statement.resources, b.statement.resources) ? 1 : 0) +
    (setEqual(a.principalStrings, b.principalStrings) ? 1 : 0);

  if (setsEqual < 2 || unmergeablePrincipals(a, b)) { return; }

  return {
    originals: [...a.originals, ...b.originals],
    statement: a.statement.copy({
      actions: setMerge(a.statement.actions, b.statement.actions),
      resources: setMerge(a.statement.resources, b.statement.resources),
      principals: setMerge(a.statement.principals, b.statement.principals),
    }),
    principalStrings: setMerge(a.principalStrings, b.principalStrings),
    notPrincipalStrings: a.notPrincipalStrings,
    conditionString: a.conditionString,
    sizeEstimate: a.sizeEstimate + b.sizeEstimate,
  };
}

/**
 * Calculate and return cached string set representation of the statement elements
 *
 * This is to be able to do comparisons on these sets quickly.
 */
function makeComparable(s: PolicyStatement): ComparableStatement {
  return {
    originals: [s],
    statement: s,
    conditionString: JSON.stringify(s.conditions),
    principalStrings: s.principals.map(renderPrincipal),
    notPrincipalStrings: s.notPrincipals.map(renderPrincipal),
    sizeEstimate: s._estimateSize(),
  };

  function renderPrincipal(x: IPrincipal) {
    return JSON.stringify(x.policyFragment.principalJson);
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
  const aHasLiteral = a.statement.principals.some(v => LITERAL_STRING_KEY in v.policyFragment.principalJson);
  const bHasLiteral = b.statement.principals.some(v => LITERAL_STRING_KEY in v.policyFragment.principalJson);
  return aHasLiteral !== bHasLiteral;
}

/**
 * Turn a ComparableStatement back into a Statement
 */
function renderComparable(s: ComparableStatement): PolicyStatement {
  return s.statement;
}

/**
 * An analyzed version of a statement that makes it easier to do comparisons and merging on
 */
interface ComparableStatement {
  readonly statement: PolicyStatement;
  readonly originals: PolicyStatement[];
  readonly principalStrings: string[];
  readonly notPrincipalStrings: string[];
  readonly conditionString: string;
  readonly sizeEstimate: number;
}

/**
 * Whether the given sets are equal
 */
function setEqual<A>(a: A[], b: A[]) {
  const bSet = new Set(b);
  return a.length === b.length && a.every(k => bSet.has(k));
}

/**
 * Merge two IAM value sets
 */
function setMerge<A>(x: A[], y: A[]): A[] {
  return Array.from(new Set([...x, ...y])).sort();
}