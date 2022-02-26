const LENGTH_CACHE_SYM = Symbol();

/**
 * Merge as many statements as possible to shrink the total policy doc, modifying the input array in place
 */
export function mergeStatements(statements: StatementSchema[]): StatementSchema[] {
  let merges = findMerges(statements);
  while (merges.length > 0) {
    merges.sort((a, b) => a.sizeDelta - b.sizeDelta); // Biggest reduction first
    if (merges[0].sizeDelta >= 0) { break; } // Nothing more to be gained

    // Apply all merges, order biggest to smallest gain
    while (merges.length > 0 && merges[0].sizeDelta < 0) { // Only while we're not adding size
      const merge = merges.shift()!;
      statements[merge.i0] = merge.combined;
      statements.splice(merge.i1, 1);

      // Optimization: we can still merges that are for other pairs in this same
      // go-around (which saves us recalculating all merge pairs again). We will
      // need to adjust indices because we just changed the input array.
      //
      // The following removes all merges involving i0 or i1 (no longer valid,
      // these have been used up), and shifts all indices > i1 left by 1.
      // Assumes i0 < i1.
      const invalidIndices = [merge.i0, merge.i1];
      let j = 0;
      while (j < merges.length) {
        if (invalidIndices.includes(merges[j].i0) || invalidIndices.includes(merges[j].i1)) {
          merges.splice(j, 1);
        } else {
          if (merges[j].i0 > merge.i1) { merges[j].i0 -= 1; }
          if (merges[j].i1 > merge.i1) { merges[j].i1 -= 1; }
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
 */
function findMerges(statements: StatementSchema[]): StatementMerge[] {
  const ret = new Array<StatementMerge>();
  for (let i0 = 0; i0 < statements.length; i0++) {
    for (let i1 = i0 + 1; i1 < statements.length; i1++) {
      tryMerge(statements, i0, i1, ret);
    }
  }
  return ret;
}

function tryMerge(statements: StatementSchema[], i0: number, i1: number, into: StatementMerge[]) {
  const a = statements[i0];
  const b = statements[i1];

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

    const combined = {
      ...a,
      [key]: (usesObjects ? mergeObjects : mergeValues)(a[key], b[key]),
    };

    into.push({
      i0,
      i1,
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
function normalizedArray(...xs: unknown[]) {
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
   * Index of statement 0
   *
   * Contract: i0 < i1
   */
  i0: number;

  /**
   * Index of statement 1
   *
   * Contract: i0 < i1
   */
  i1: number;

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