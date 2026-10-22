/**
 * Marker substitution (contract §4).
 *
 * Markers let a caller inject values that are only known at deployment time into content
 * that was packaged earlier. Substitution is literal and byte-level: a marker key is
 * whatever bytes the caller supplied, with no placeholder syntax.
 *
 * Two deliberate differences from the original Python implementation, both of which fix
 * defects rather than change the contract:
 *
 * - Replacement is **single-pass**: all markers are matched simultaneously against the
 *   original bytes, so a value that happens to contain another marker's key is not
 *   re-substituted. The old implementation applied markers one after another, making the
 *   result depend on map ordering (B15).
 * - Matching spans the **whole file** rather than one line at a time, so a marker
 *   containing a newline is found (B14).
 */

/** Per-source marker configuration, as it arrives on the wire. */
export interface MarkersConfig {
  /** When `"true"`, values are encoded so they stay valid inside a JSON string literal. */
  readonly jsonEscape?: string;
}

/**
 * Encode one marker value.
 *
 * Without `jsonEscape` a string value is inserted as-is and a non-string is stringified —
 * the Python implementation raised on non-strings in this path (B18), which was an
 * inconsistency with the escaped path rather than a deliberate restriction.
 *
 * With `jsonEscape`, the value is JSON-encoded and the surrounding quotes stripped from a
 * string result, so quotes, backslashes and control characters survive insertion into a
 * JSON string literal. A non-string keeps its JSON form (`42`, `{"a":1}`) so it can be
 * dropped into a value position.
 */
export function encodeMarkerValue(value: unknown, jsonEscape: boolean): string {
  if (!jsonEscape) {
    return typeof value === 'string' ? value : JSON.stringify(value) ?? String(value);
  }

  const serialized = JSON.stringify(value) ?? 'null';
  return typeof value === 'string' ? serialized.slice(1, -1) : serialized;
}

/** Whether a `jsonEscape` flag is on. Accepts any casing; absent means off. */
export function isJsonEscape(config: MarkersConfig | undefined): boolean {
  return (config?.jsonEscape ?? 'false').toLowerCase() === 'true';
}

/**
 * Substitute every marker in `contents`, in a single pass.
 *
 * Longer keys are matched first so that one marker key being a prefix of another gives the
 * more specific match, which is the only sensible reading of "literal substitution".
 */
export function replaceMarkers(
  contents: Buffer,
  markers: Record<string, unknown>,
  config: MarkersConfig | undefined,
): Buffer {
  const keys = Object.keys(markers);
  if (keys.length === 0) { return contents; }

  const jsonEscape = isJsonEscape(config);
  const replacements = keys
    .map((key) => ({
      search: Buffer.from(key, 'utf-8'),
      replace: Buffer.from(encodeMarkerValue(markers[key], jsonEscape), 'utf-8'),
    }))
    .filter((r) => r.search.length > 0)
    .sort((a, b) => b.search.length - a.search.length);

  if (replacements.length === 0) { return contents; }

  const pieces: Buffer[] = [];
  let cursor = 0;

  while (cursor < contents.length) {
    let matched: { at: number; search: Buffer; replace: Buffer } | undefined;

    // Find the earliest match across all markers; ties go to the longest key because of
    // the sort above.
    for (const replacement of replacements) {
      const at = contents.indexOf(replacement.search, cursor);
      if (at < 0) { continue; }
      if (!matched || at < matched.at) {
        matched = { at, ...replacement };
      }
    }

    if (!matched) { break; }

    pieces.push(contents.subarray(cursor, matched.at), matched.replace);
    cursor = matched.at + matched.search.length;
  }

  if (cursor === 0) { return contents; }

  pieces.push(contents.subarray(cursor));
  return Buffer.concat(pieces);
}
