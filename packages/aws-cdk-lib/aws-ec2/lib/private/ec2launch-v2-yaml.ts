import * as YAML from 'yaml';
import type { Scalar, Schema } from 'yaml/types';
import { Type } from 'yaml/util';
import { Token, Tokenization, UnscopedValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';

/**
 * How the yaml library writes a string
 */
type StringifyString = (item: Scalar, ctx: Schema.StringifyContext) => string;

/**
 * Render an EC2Launch v2 user data document
 *
 * Uses the YAML 1.1 schema, so strings such as `yes` or `on` are quoted.
 * Strings are written by `stringifyEc2LaunchV2String()`.
 */
export function renderEc2LaunchV2Yaml(value: any): string {
  const doc = new YAML.Document({
    version: '1.1',
    // Keep how the schema parses strings, and wrap how it writes them
    customTags: (tags: any[]) => tags.map(tag => tag.tag === 'tag:yaml.org,2002:str'
      ? { ...tag, stringify: (item: Scalar, ctx: Schema.StringifyContext) => stringifyEc2LaunchV2String(item, ctx, tag.stringify) }
      : tag),
  });
  doc.contents = YAML.createNode(normalizeEc2LaunchV2Value(value)) as any;
  return withoutFolding(() => doc.toString());
}

/**
 * Write a string into an EC2Launch v2 user data document
 *
 * Multi-line strings are written as literal blocks (`|`), so that scripts
 * stay readable.
 *
 * Strings that contain tokens are always written as literal blocks, because
 * CloudFormation substitutes values into the document without escaping them,
 * and a literal block is the only kind of scalar that needs no escaping. So:
 *
 * - When a literal block cannot represent the string, for example when it
 *   contains a carriage return, the yaml library writes a double-quoted
 *   string instead. Such strings are rejected.
 * - A parser takes the indentation of a literal block from its first
 *   non-empty line, so a substituted value that starts that line with spaces
 *   would change the indentation of the whole block. The block header gets an
 *   explicit indentation indicator (`|2`) to prevent that.
 *
 * Map keys, and other strings, are written as the yaml library chooses.
 *
 * @param stringify how the yaml library writes strings
 */
function stringifyEc2LaunchV2String(item: Scalar, ctx: Schema.StringifyContext, stringify: StringifyString): string {
  const value = String(item.value);
  const hasToken = Token.isUnresolved(value);
  if (ctx.implicitKey || (!hasToken && !value.includes('\n'))) {
    return stringify(item, ctx);
  }

  const block = stringify({ ...item, type: Type.BLOCK_LITERAL } as Scalar, ctx);
  if (!hasToken) {
    return block;
  }
  if (!block.startsWith('|')) {
    throw new UnscopedValidationError(lit`Ec2LaunchV2TokenNotLiteral`, `values containing tokens must not contain carriage returns or other control characters, or end with a line of only whitespace, got ${JSON.stringify(value)}`);
  }
  // The header is `|` and an optional chomping indicator (`-` or `+`). The
  // indicator is relative to the parent, which the yaml library indents by 2
  // spaces, except at the root of the document.
  return block.replace(/^\|(?=[-+]?\n)/, `|${ctx.indent ? 2 : 1}`);
}

/**
 * Run a function with line folding of the yaml library disabled
 *
 * Folding is a global option of the yaml library, so it is restored afterwards.
 */
function withoutFolding<T>(fn: () => T): T {
  const fold = YAML.scalarOptions.str.fold;
  const lineWidth = fold.lineWidth;
  fold.lineWidth = 0;
  try {
    return fn();
  } finally {
    fold.lineWidth = lineWidth;
  }
}

/**
 * Prepare a value for rendering into an EC2Launch v2 document
 *
 * Removes `undefined` properties, and turns tokens that are not strings into
 * string tokens, so that they are substituted into the document. Lists cannot
 * be substituted into a YAML document, so list tokens are rejected.
 */
export function normalizeEc2LaunchV2Value(value: any): any {
  if (Tokenization.isResolvable(value)) {
    return Token.asString(value);
  }
  if (typeof value === 'number' && Token.isUnresolved(value)) {
    return Tokenization.stringifyNumber(value);
  }
  if (Array.isArray(value)) {
    if (Token.isUnresolved(value)) {
      throw new UnscopedValidationError(lit`Ec2LaunchV2ListToken`, 'lists in EC2Launch v2 task inputs cannot be tokens, pass a list of values instead');
    }
    return value.map(normalizeEc2LaunchV2Value);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, normalizeEc2LaunchV2Value(v)]));
  }
  return value;
}
