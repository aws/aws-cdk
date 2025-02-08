export type KeyFunc<T> = (x: T) => string;
export type DepFunc<T> = (x: T) => string[];

/**
 * Return a topological sort of all elements of xs, according to the given dependency functions
 *
 * Dependencies outside the referenced set are ignored.
 *
 * Not a stable sort, but in order to keep the order as stable as possible, we'll sort by key
 * among elements of equal precedence.
 */
export function topologicalSort<T>(xs: Iterable<T>, keyFn: KeyFunc<T>, depFn: DepFunc<T>): T[] {
  const remaining = new Map<string, TopoElement<T>>();
  for (const element of xs) {
    const key = keyFn(element);
    remaining.set(key, { key, element, dependencies: depFn(element) });
  }

  const ret = new Array<T>();
  while (remaining.size > 0) {
    // All elements with no more deps in the set can be ordered
    const selectable = Array.from(remaining.values()).filter(e => e.dependencies.every(d => !remaining.has(d)));

    selectable.sort((a, b) => a.key < b.key ? -1 : b.key < a.key ? 1 : 0);

    for (const selected of selectable) {
      ret.push(selected.element);
      remaining.delete(selected.key);
    }

    // If we didn't make any progress, we got stuck
    if (selectable.length === 0) {
      throw new Error(`Could not determine ordering between: ${Array.from(remaining.keys()).join(', ')}`);
    }
  }

  return ret;
}

interface TopoElement<T> {
  key: string;
  dependencies: string[];
  element: T;
}
