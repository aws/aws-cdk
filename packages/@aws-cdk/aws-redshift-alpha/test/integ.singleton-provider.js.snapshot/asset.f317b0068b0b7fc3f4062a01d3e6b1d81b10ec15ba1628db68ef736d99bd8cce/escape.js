"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteIdentifier = quoteIdentifier;
exports.quoteQualifiedIdentifier = quoteQualifiedIdentifier;
exports.quoteLiteral = quoteLiteral;
/** A valid bare identifier (letter/underscore then letters, digits, `_`, or `$`); needs no quoting. */
const BARE_IDENTIFIER = /^[\p{L}_][\p{L}\p{N}_$]*$/u;
/** Returns a bare-safe identifier unchanged; otherwise double-quotes it, doubling embedded double quotes. */
function quoteIdentifier(identifier) {
    if (BARE_IDENTIFIER.test(identifier)) {
        return identifier;
    }
    return `"${identifier.replace(/"/g, '""')}"`;
}
/** Applies {@link quoteIdentifier} to each `.`-separated component, keeping the dot separator. */
function quoteQualifiedIdentifier(qualified) {
    return qualified.split('.').map(quoteIdentifier).join('.');
}
/**
 * Quotes a SQL string literal, doubling any embedded backslash and then any embedded single quote.
 *
 * Redshift processes backslash escape sequences in string literals, so a backslash is doubled to be read as written.
 */
function quoteLiteral(literal) {
    return `'${literal.replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}
