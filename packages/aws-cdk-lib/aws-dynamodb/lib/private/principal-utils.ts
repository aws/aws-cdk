import { ServicePrincipal } from '../../../aws-iam';
import type { IPrincipal } from '../../../aws-iam';

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
