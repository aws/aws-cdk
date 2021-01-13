export function addAll<A>(into: Set<A>, from: Iterable<A>) {
  for (const x of from) {
    into.add(x);
  }
}

export function extract<A, B>(from: Map<A, B>, key: A): B | undefined {
  const ret = from.get(key);
  from.delete(key);
  return ret;
}

export function* flatMap<A, B>(xs: Iterable<A>, fn: (x: A) => Iterable<B>): IterableIterator<B> {
  for (const x of xs) {
    for (const y of fn(x)) {
      yield y;
    }
  }
}

export function* enumerate<A>(xs: Iterable<A>): IterableIterator<[number, A]> {
  let i = 0;
  for (const x of xs) {
    yield [i++, x];
  }
}


export function expectProp<A extends object, B extends keyof A>(obj: A, key: B): NonNullable<A[B]> {
  if (!obj[key]) { throw new Error(`Expecting '${key}' to be set!`); }
  return obj[key] as any;
}

export function* flatten<A>(xs: Iterable<A[]>): IterableIterator<A> {
  for (const x of xs) {
    for (const y of x) {
      yield y;
    }
  }
}

export function filterEmpty(xs: Array<string | undefined>): string[] {
  return xs.filter(x => x) as any;
}

export function mapValues<A, B>(xs: Record<string, A>, fn: (x: A) => B): Record<string, B> {
  const ret: Record<string, B> = {};
  for (const [k, v] of Object.entries(xs)) {
    ret[k] = fn(v);
  }
  return ret;
}

export function noEmptyObject<A>(xs: Record<string, A>): Record<string, A> | undefined {
  if (Object.keys(xs).length === 0) { return undefined; }
  return xs;
}

export function maybeSuffix(x: string | undefined, suffix: string): string | undefined {
  if (x === undefined) { return undefined; }
  return `${x}${suffix}`;
}
