/**
 * Whether A is a subset of B
 */
export function isSubsetOf<T>(as: Set<T>, bs: Set<T>) {
  for (const a of as) {
    if (!bs.has(a)) {
      return false;
    }
  }
  return true;
}

/**
 * Add elements of set B to set A
 */
export function setAdd<T>(as: Set<T>, bs: Iterable<T>) {
  for (const b of bs) {
    as.add(b);
  }
  return as;
}
