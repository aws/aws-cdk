/**
 * Pad 's' on the left with 'char' until it is n characters wide
 */
export function leftPad(s: string, n: number, char: string) {
  const padding = Math.max(0, n - s.length);
  return char.repeat(padding) + s;
}