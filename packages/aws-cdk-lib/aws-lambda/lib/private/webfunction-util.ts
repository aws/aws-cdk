import type { Construct } from 'constructs';
import { Stack, Token } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { md5hash } from '../../../core/lib/helpers-internal';
import { lit } from '../../../core/lib/private/literal-string';

/**
 * A short hash of an endpoint's type and replica regions.
 *
 * Both are create-only, like the endpoint name, so changing them replaces the endpoint, which
 * CloudFormation cannot do under the same name. A default name includes this hash so that it
 * changes with them. `regions` is the normalized list the endpoint renders (see
 * `WebFunctionEndpointLocation._regionList`), so listing the same Regions differently changes
 * neither.
 */
export function endpointShapeHash(scope: Construct, endpointType: string, regions: string[] | undefined): string {
  return md5hash(JSON.stringify([endpointType, Stack.of(scope).resolve(regions) ?? null])).slice(0, 8);
}

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

/**
 * The WebFunctions in this app that have an egress network connector. The service only accepts
 * a `HOME_REGION` endpoint for them, which `WebFunctionEndpoint` checks for every endpoint,
 * however it is created.
 */
export const FUNCTIONS_WITH_EGRESS_CONNECTOR = new WeakSet<object>();

/** A list token has `length === 1`, so both the list and its elements must be checked. */
export function hasTokens(list: string[]): boolean {
  return Token.isUnresolved(list) || list.some((r) => Token.isUnresolved(r));
}
