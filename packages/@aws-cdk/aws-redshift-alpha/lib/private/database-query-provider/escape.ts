/** A valid bare identifier (letter/underscore then letters, digits, `_`, or `$`); needs no quoting. */
const BARE_IDENTIFIER = /^[\p{L}_][\p{L}\p{N}_$]*$/u;

/** Returns a bare-safe identifier unchanged; otherwise double-quotes it, doubling embedded double quotes. */
export function quoteIdentifier(identifier: string): string {
  if (BARE_IDENTIFIER.test(identifier)) {
    return identifier;
  }
  return `"${identifier.replace(/"/g, '""')}"`;
}

/** Applies {@link quoteIdentifier} to each `.`-separated component, keeping the dot separator. */
export function quoteQualifiedIdentifier(qualified: string): string {
  return qualified.split('.').map(quoteIdentifier).join('.');
}

/** Quotes a SQL string literal, doubling any embedded single quote. */
export function quoteLiteral(literal: string): string {
  return `'${literal.replace(/'/g, "''")}'`;
}
