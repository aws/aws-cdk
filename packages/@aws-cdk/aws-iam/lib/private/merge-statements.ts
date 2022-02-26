// IAM Statement merging
//
// See docs/policy-merging.als for a formal model of the logic
// implemented here.

const LENGTH_CACHE_SYM = Symbol('jsonLength');

/**
 * Merge as many statements as possible to shrink the total policy doc, modifying the input array in place
 *
 * If there are multiple merges to be made (which may involve the same
 * statements, so we can only pick 1 of them), we merge the ones that make the
 * biggest size different first. This is a greedy strategy in a complex
 * optimization problem: it's not guanteed to produce the smallest result, but
 * it will probably do something sensible in most cases.
 */
export function mergeStatements(statements: StatementSchema[]): StatementSchema[] {
  let merges = findMerges(statements);
  while (merges.length > 0 && merges[0].sizeDelta < 0) {
    // Optimization: we could only merge the first pair here and then
    // recalculate new possible merges for the next iteration. To save
    // recalculating merge pairs however, we will try to apply as many merges as
    // possible in one go. We will need to adjust indices because we just
    // changed the input array.
    while (merges.length > 0 && merges[0].sizeDelta < 0) {
      const merge = merges.shift()!;
      statements[merge.index1] = merge.combined;
      statements.splice(merge.index2, 1);

      // The following removes all merges involving index1 or index2 (no longer valid,
      // these have been used up), and shifts all indices > index2 left by 1.
      // Assumes index1 < index2.
      const invalidIndices = [merge.index1, merge.index2];
      let j = 0;
      while (j < merges.length) {
        if (invalidIndices.includes(merges[j].index1) || invalidIndices.includes(merges[j].index2)) {
          merges.splice(j, 1);
        } else {
          if (merges[j].index1 > merge.index2) { merges[j].index1 -= 1; }
          if (merges[j].index2 > merge.index2) { merges[j].index2 -= 1; }
          j++;
        }
      }
    }

    merges = findMerges(statements);
  }
  return statements;
}

/**
 * Return all possible merges between all pairs of statements in the input array
 *
 * Returns the results sorted with the biggest reduction first (i.e. lowest
 * sizeDelta)
 */
function findMerges(statements: StatementSchema[]): StatementMerge[] {
  const ret = new Array<StatementMerge>();
  for (let i0 = 0; i0 < statements.length; i0++) {
    for (let i1 = i0 + 1; i1 < statements.length; i1++) {
      tryMerge(statements, i0, i1, ret);
    }
  }
  ret.sort((a, b) => a.sizeDelta - b.sizeDelta);
  return ret;
}

/**
 * Given two statements, return a list of all possible merge results for these 2 statements
 *
 * This may return an empty array if the two given statements cannot be merged,
 * otherwise will contain one or more records showing what the merged statement
 * would look like, and how many bytes we would save if we were to merge these two
 * statements in this fashion.
 *
 * We will in turn try to merge the Resource, Action and Principal entries. We
 * only merge if (taking the element we are merging out of the picture), the
 * statements are otherwise completely identical. (Example: if we are considering
 * merging 'Resource', then 'Action', 'NotAction', 'Principal', 'NotPrincipal',
 * and 'Condition' all need to be exactly the same). We determine that by taking
 * a 'deepEqual' on the JSON structures excepting the key we are considering.
 */
function tryMerge(statements: StatementSchema[], index1: number, index2: number, into: StatementMerge[]) {
  const a = statements[index1];
  const b = statements[index2];

  // Effects must be the same
  if (a.Effect !== b.Effect) { return; }
  // We don't merge Sids (for now)
  if (a.Sid || b.Sid) { return; }

  const beforeLen = jsonLength(a) + jsonLength(b);

  tryMerging('Resource', false);
  tryMerging('Action', false);
  tryMerging('Principal', true);

  function tryMerging<A extends keyof StatementSchema>(key: A, usesObjects: boolean) {
    if (!deepEqual(a, b, [key])) { return; }

    const combined: StatementSchema = {
      ...a,
      [key]: (usesObjects ? mergeObjects : mergeValues)(a[key], b[key]),
    };

    into.push({
      index1,
      index2,
      combined,
      sizeDelta: jsonLength(combined) - beforeLen,
    });
  }
}

/**
 * Return the length of a JSON representation of the given object, cached on the object
 */
function jsonLength<A extends StatementSchema>(x: A): number {
  if ((x as any)[LENGTH_CACHE_SYM]) {
    return (x as any)[LENGTH_CACHE_SYM];
  }

  const length = JSON.stringify(x).length;
  Object.defineProperty(x, LENGTH_CACHE_SYM, {
    value: length,
    enumerable: false,
  });
  return length;
}

function deepEqual(a: any, b: any, ignoreKeys: string[]): boolean {
  // Short-circuit same object identity as well
  if (a === b) { return true; }

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) { return false; }
    return a.every((x, i) => deepEqual(x, b[i], []));
  }

  if (typeof a === 'object' || typeof b === 'object') {
    if (typeof a !== 'object' || typeof b !== 'object') { return false; }

    const keysA = new Set(Object.keys(a));
    const keysB = new Set(Object.keys(b));
    for (const k of ignoreKeys) {
      keysA.delete(k);
      keysB.delete(k);
    }

    for (const k of keysA) {
      if (!deepEqual(a[k], b[k], [])) { return false; }
      keysB.delete(k);
    }

    return keysB.size === 0;
  }

  return false;
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
function mergeObjects(a: IamValue, b: IamValue): any {
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
 * Only the parts of the policy schema we're interested in
 */
interface StatementSchema {
  readonly Sid?: string;
  readonly Effect?: string;
  readonly Principal?: IamValue | Record<string, IamValue>;
  readonly Resource?: IamValue;
  readonly Action?: IamValue;
}

interface StatementMerge {
  /**
   * Index of statement 1
   *
   * Contract: index1 < index2
   */
  index1: number;

  /**
   * Index of statement 1
   *
   * Contract: index1 < index2
   */
  index2: number;

  /**
   * The result of combining them
   */
  readonly combined: StatementSchema;

  /**
   * How many bytes the new schema is bigger than the old ones combined
   *
   * (Expected to be negative in order for the merge to be useful)
   */
  readonly sizeDelta: number;
}