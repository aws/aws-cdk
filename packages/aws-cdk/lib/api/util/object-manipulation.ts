/**
 * Splits the given object into two, such that:
 *
 * 1. The first object is smaller (after stringified in UTF-8) than the provided size limit.
 * 2. Merging the two objects results in the original one.
 */
export function splitBySize(data: any, maxSizeBytes: number): [any, any] {
  const entries = Object.entries(data);
  return recurse(0, 0);

  function entrySize(entry: [string, unknown]) {
    return Buffer.byteLength(JSON.stringify(Object.fromEntries([entry])));
  }

  function recurse(index: number, runningTotalSize: number): [any, any] {
    if (index >= entries.length) {
      return [{}, data];
    }

    const size = runningTotalSize + entrySize(entries[index]);
    return (size > maxSizeBytes)
      ? [
        Object.fromEntries(entries.slice(0, index)),
        Object.fromEntries(entries.slice(index)),
      ]
      : recurse(index + 1, size);
  }
}