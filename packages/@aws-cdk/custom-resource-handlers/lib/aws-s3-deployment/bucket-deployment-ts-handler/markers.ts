/**
 * Marker substitution.
 *
 * Markers let a caller inject values that are only known at deployment time into content
 * that was packaged earlier. Substitution is literal and byte-level: a marker key is
 * whatever bytes the caller supplied, with no placeholder syntax.
 *
 * Two properties worth preserving:
 *
 * - Replacement is **single-pass**: all markers are matched simultaneously against the
 *   original bytes, so a value that happens to contain another marker's key is not
 *   re-substituted and the result does not depend on map ordering.
 * - Matching spans the **whole file** rather than one line at a time, so a marker
 *   containing a newline is found.
 */

/** Per-source marker configuration, as it arrives on the wire. */
export interface MarkersConfig {
  /**
   * When `"true"`, the default encoding is `UNQUOTED_JSON_VALUE` instead of `LITERAL`.
   */
  readonly jsonEscape?: string;

  /** Encoding per marker name; markers without an entry use the default encoding. */
  readonly markerEncodings?: Record<string, string>;
}

/** Plain YAML scalars that are guaranteed to load back as the same string. */
const SAFE_PLAIN_YAML = /^[A-Za-z][A-Za-z0-9._-]*$/;
/** Plain scalars that match the pattern above but a YAML 1.1 parser reads as bool/null. */
const YAML_RESERVED = new Set(['y', 'n', 'yes', 'no', 'true', 'false', 'on', 'off', 'null']);

/**
 * Encode one marker value.
 *
 * The encoding comes from `markerEncodings[markerName]`, falling back to
 * `UNQUOTED_JSON_VALUE` when `jsonEscape` is on and `LITERAL` otherwise:
 *
 * - `LITERAL`: the string as-is.
 * - `UNQUOTED_JSON_VALUE`: JSON-encoded, with the surrounding quotes stripped from a
 *   string so it fits inside a pre-quoted JSON string literal. Non-strings keep their JSON
 *   form (`42`, `{"a":1}`) for a value position.
 * - `JSON_VALUE`: a complete JSON value, quotes included.
 * - `YAML_STRING`: a plain YAML scalar when that is unambiguous, otherwise a double-quoted one.
 *
 * `LITERAL` and `YAML_STRING` only accept strings. The error names the marker but not the
 * value, which may be a secret.
 */
export function encodeMarkerValue(markerName: string, value: unknown, config: MarkersConfig | undefined): string {
  const encoding = config?.markerEncodings?.[markerName] ?? (isJsonEscape(config) ? 'UNQUOTED_JSON_VALUE' : 'LITERAL');

  switch (encoding) {
    case 'LITERAL':
      return requireString(markerName, value, encoding);
    case 'UNQUOTED_JSON_VALUE': {
      const serialized = JSON.stringify(value) ?? 'null';
      return typeof value === 'string' ? serialized.slice(1, -1) : serialized;
    }
    case 'JSON_VALUE':
      return JSON.stringify(value) ?? 'null';
    case 'YAML_STRING': {
      const str = requireString(markerName, value, encoding);
      // A JSON string literal is also a valid YAML double-quoted scalar.
      return SAFE_PLAIN_YAML.test(str) && !YAML_RESERVED.has(str.toLowerCase()) ? str : JSON.stringify(str);
    }
    default:
      throw new Error(`Unknown marker encoding for marker ${markerName}: ${JSON.stringify(encoding)}`);
  }
}

function requireString(markerName: string, value: unknown, encoding: string): string {
  if (typeof value !== 'string') {
    const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
    throw new Error(`Expected a string for ${encoding} encoding for marker ${markerName}, got ${type}`);
  }
  return value;
}

/** Whether there is anything to substitute. Absent and empty mean the same: nothing. */
export function hasMarkers(markers: Record<string, unknown> | undefined): markers is Record<string, unknown> {
  return Object.keys(markers ?? {}).length > 0;
}

/** Whether a `jsonEscape` flag is on. Accepts any casing; absent means off. */
export function isJsonEscape(config: MarkersConfig | undefined): boolean {
  return String(config?.jsonEscape ?? 'false').toLowerCase() === 'true';
}

/**
 * Substitute every marker in `contents`, in a single pass.
 *
 * Longer keys are matched first so that one marker key being a prefix of another gives the
 * more specific match, which is the only sensible reading of "literal substitution".
 */
export function replaceMarkers(
  contents: Buffer,
  markers: Record<string, unknown> | undefined,
  config: MarkersConfig | undefined,
): Buffer {
  if (!hasMarkers(markers)) { return contents; }
  const keys = Object.keys(markers);

  const replacements = keys
    .map((key) => ({
      search: Buffer.from(key, 'utf-8'),
      replace: Buffer.from(encodeMarkerValue(key, markers[key], config), 'utf-8'),
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
