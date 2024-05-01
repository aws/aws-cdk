export function arrayDiff(oldValues: string[], newValues: string[]) {
  const deletes = new Set(oldValues);
  const adds = new Set<string>();

  for (const v of new Set(newValues)) {
    if (deletes.has(v)) {
      deletes.delete(v);
    } else {
      adds.add(v);
    }
  }

  return {
    adds: Array.from(adds),
    deletes: Array.from(deletes),
  };
}
