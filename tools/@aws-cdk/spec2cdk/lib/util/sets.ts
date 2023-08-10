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
