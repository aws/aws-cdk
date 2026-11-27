import { ServicePrincipal } from '../../../aws-iam';
import type { IPrincipal } from '../../../aws-iam';
import { Token } from '../../../core';

/**
 * Service principals known to be valid grantees for DynamoDB resource policies.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/RedshiftforDynamoDB-zero-etl.html
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/globaltables_MA_security.html
 * @see https://docs.aws.amazon.com/glue/latest/dg/zero-etl-sources.html#zero-etl-config-source-dynamodb
 */
const KNOWN_DYNAMODB_SERVICE_PRINCIPALS = new Set([
  'redshift.amazonaws.com',
  'replication.dynamodb.amazonaws.com',
  'glue.amazonaws.com',
]);

/**
 * Returns true if the principal resolves to a Service principal in the policy document.
 * Checks the policyFragment output to handle wrapped principals
 * (e.g. PrincipalWithConditions, SessionTagsPrincipal).
 */
export function isServicePrincipal(principal: IPrincipal): boolean {
  const principalJson = principal.policyFragment.principalJson;
  return 'Service' in principalJson;
}

/**
 * Returns true if the principal is a service principal whose service name
 * is NOT in the known-valid allowlist for DynamoDB resource policies.
 */
export function isUnsupportedServicePrincipal(principal: IPrincipal): boolean {
  if (!isServicePrincipal(principal)) {
    return false;
  }
  const serviceName = extractServiceName(principal);
  return serviceName === undefined || !KNOWN_DYNAMODB_SERVICE_PRINCIPALS.has(serviceName);
}

/**
 * Extracts the service name from a principal that may be a ServicePrincipal
 * or a wrapper around one (e.g. PrincipalWithConditions).
 */
function extractServiceName(principal: IPrincipal): string | undefined {
  if (principal instanceof ServicePrincipal) {
    return principal.service;
  }
  // Walk through wrapper principals (PrincipalWithConditions, SessionTagsPrincipal, etc.)
  // that extend PrincipalAdapter and store the inner principal in `wrapped`.
  const inner = (principal as any).wrapped;
  if (inner != null) {
    return extractServiceName(inner);
  }
  return undefined;
}

/**
 * Fine-grained access control condition keys, in lower case. They are not in
 * the SearchVectors request context, so a statement that names one of them
 * does not match a SearchVectors request.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/VectorSearch.Security.html
 */
const FGAC_CONDITION_KEYS = new Set([
  'dynamodb:leadingkeys',
  'dynamodb:attributes',
  'dynamodb:select',
]);

/**
 * Returns the first fine-grained access control condition key in the
 * principal's conditions, or undefined if there is none. IAM condition keys
 * are case-insensitive. Conditions that are a token, and condition blocks that
 * are tokens, are skipped.
 */
export function findFgacConditionKey(principal: IPrincipal): string | undefined {
  const conditions = principal.policyFragment.conditions;
  if (Token.isUnresolved(conditions)) {
    return undefined;
  }
  for (const block of Object.values(conditions)) {
    if (block === null || typeof block !== 'object' || Token.isUnresolved(block)) {
      continue;
    }
    const key = Object.keys(block).find(k => FGAC_CONDITION_KEYS.has(k.toLowerCase()));
    if (key !== undefined) {
      return key;
    }
  }
  return undefined;
}
