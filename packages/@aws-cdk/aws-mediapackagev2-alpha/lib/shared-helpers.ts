
/**
 * Render Tags to correct format.
 *
 * @internal
 */
export function renderTags(tags: { [key: string]: string }): Array<{key: string; value: string}> {
  return Object.keys(tags).map((key) => ({ key, value: tags[key] }));
}

/**
 * Convert date to UTC string
 * @internal
 */
export function convertDateToString(date: Date): string {
  return `${date.getUTCFullYear()}-` +
    `${String(date.getUTCMonth()+1).padStart(2, '0')}-` +
    `${String(date.getUTCDate()).padStart(2, '0')}T` +
    `${String(date.getUTCHours()).padStart(2, '0')}:` +
    `${String(date.getUTCMinutes()).padStart(2, '0')}:` +
    `${String(date.getUTCSeconds()).padStart(2, '0')}+00:00`;
}
