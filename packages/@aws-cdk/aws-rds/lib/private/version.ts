/**
 * Compare two version strings. Fails if the comparison has to tiebreak with non-numbers.
 * @returns 0 if both are same, 1 if 'a' is later version than 'b' and -1 if 'b' is later version than 'a'
 */
export function compare(a: string, b: string) {
  const aParts = a.split('.');
  const bParts = b.split('.');
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    if (i === aParts.length) { return -1; }
    if (i === bParts.length) { return 1; }

    if (!aParts[i] || !bParts[i] || isNaN(aParts[i] as any) || isNaN(bParts[i] as any)) {
      throw new Error(`Can only compare version strings with numbers. Received [${a}] and [${b}].`);
    }
    const partCompare = parseInt(aParts[i], 10) - parseInt(bParts[i], 10);

    if (partCompare < 0) { return -1; }
    if (partCompare > 0) { return 1; }
  }
  return 0;
}