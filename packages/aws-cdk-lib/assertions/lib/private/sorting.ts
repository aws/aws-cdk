/**
 * Make a sorting comparator that will sort by a given sort key
 */
export function sortKeyComparator<A>(keyFn: (x: A) => Array<string | number>) {
  return (a: A, b: A): number => {
    const ak = keyFn(a);
    const bk = keyFn(b);

    for (let i = 0; i < ak.length && i < bk.length; i++) {
      const av = ak[i];
      const bv = bk[i];

      let diff = 0;
      if (typeof av === 'number' && typeof bv === 'number') {
        diff = av - bv;
      } else if (typeof av === 'string' && typeof bv === 'string') {
        diff = av.localeCompare(bv);
      }

      if (diff !== 0) {
        return diff;
      }
    }

    return (bk.length - ak.length);
  };
}