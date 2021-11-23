export function sortBy<A>(xs: A[], keyFn: (x: A) => Array<string | number>) {
  return xs.sort((a, b) => {
    const aKey = keyFn(a);
    const bKey = keyFn(b);

    for (let i = 0; i < Math.min(aKey.length, bKey.length); i++) {
      // Compare aKey[i] to bKey[i]
      const av = aKey[i];
      const bv = bKey[i];

      if (av === bv) { continue; }

      if (typeof av !== typeof bv) {
        throw new Error(`Type of sort key ${JSON.stringify(aKey)} not same as ${JSON.stringify(bKey)}`);
      }

      if (typeof av === 'number' && typeof bv === 'number') {
        return av - bv;
      }

      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv);
      }
    }

    return aKey.length - bKey.length;
  });
}