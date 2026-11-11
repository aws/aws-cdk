import { AssumptionError } from '../errors';
import type { Branded } from './type-brand';

/**
 * A literal string.
 *
 * This is a string guaranteed to not contain any interpolated variables; i.e., its
 * contents MUST occur literally in the source code.
 *
 * The only way to obtain a `StringLiteral` is by using a tagged template:
 *
 * ```ts
 * const x: StringLiteral = lit`literal string`;
 * ```
 *
 * `StringLiteral`s can be used anywhere strings are used.
 */
export type LiteralString = Branded<string, 'LiteralString'>;

export function lit(x: TemplateStringsArray): LiteralString {
  if (x.length !== 1) {
    throw new AssumptionError('NotLiteral' as any, `String literal may not contain any variables, got \`${x.join('${...}')}\``);
  }

  return x[0] as LiteralString;
}
