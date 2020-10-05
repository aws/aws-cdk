/**
 * Turn a (multi-key) extraction function into a comparator for use in Array.sort()
 */
export function makeComparator<T, U>(keyFn: (x: T) => U[]) {
  return (a: T, b: T) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);
    const len = Math.min(keyA.length, keyB.length);

    for (let i = 0; i < len; i++) {
      const c = compare(keyA[i], keyB[i]);
      if (c !== 0) { return c; }
    }

    // Arrays are the same up to the min length -- shorter array sorts first
    return keyA.length - keyB.length;
  };
}

function compare<T>(a: T, b: T) {
  if (a < b) { return -1; }
  if (b < a) { return 1; }
  return 0;
}

export function dropIfEmpty<T>(xs: T[]): T[] | undefined {
  return xs.length > 0 ? xs : undefined;
}

export function deepRemoveUndefined(x: any): any {
  if (typeof x === undefined || x === null) { return x; }
  if (Array.isArray(x)) { return x.map(deepRemoveUndefined); }
  if (typeof x === 'object') {
    for (const [key, value] of Object.entries(x)) {
      x[key] = deepRemoveUndefined(value);
      if (x[key] === undefined) { delete x[key]; }
    }
    return x;
  }
  return x;
}

export function flatMap<T, U>(xs: T[], f: (x: T) => U[]): U[] {
  const ret = new Array<U>();
  for (const x of xs) {
    ret.push(...f(x));
  }
  return ret;
}