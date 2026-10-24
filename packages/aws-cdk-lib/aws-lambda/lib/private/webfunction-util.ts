import type { Construct } from 'constructs';
import { Token } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/private/literal-string';

/**
 * Marks the props of the endpoint a WebFunction creates for itself, so that endpoint keeps the
 * name it has always had.
 */
export const DEFAULT_ENDPOINT = Symbol.for('@aws-cdk/aws-lambda.WebFunctionDefaultEndpoint');

/**
 * The names the service accepts for a WebFunction and for its endpoint.
 *
 * Both are validated with the same rule: 2–64 characters of letters, numbers, hyphens and
 * underscores, starting and ending with a letter or number.
 */
const RESOURCE_NAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}[a-zA-Z0-9]$/;

export function validateResourceName(name: string, label: string, scope: Construct): void {
  if (!RESOURCE_NAME_REGEX.test(name)) {
    throw new ValidationError(lit`WebFunctionNameInvalid`,
      `${label} '${name}' must be 2 to 64 characters of letters, numbers, hyphens or underscores, ` +
      'starting and ending with a letter or number.', scope);
  }
}

/** A list token has `length === 1`, so both the list and its elements must be checked. */
export function hasTokens(list: string[]): boolean {
  return Token.isUnresolved(list) || list.some((r) => Token.isUnresolved(r));
}
