/**
 * Downcase the first character in a string.
 *
 * @param str the string to be processed.
 */
export function downcaseFirst(str: string): string {
  if (str === '') { return str; }
  return `${str[0].toLocaleLowerCase()}${str.slice(1)}`;
}

/**
 * Join two strings with a separator if they're both present, otherwise return the present one
 */
export function joinIf(left: string | undefined, sep: string, right: string | undefined): string {
  if (!left) { return right || ''; }
  if (!right) { return left || ''; }
  return left + sep + right;
}
