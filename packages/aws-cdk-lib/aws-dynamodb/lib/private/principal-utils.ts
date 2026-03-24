import type { IPrincipal } from '../../../aws-iam';

/**
 * Returns true if the principal resolves to a Service principal in the policy document.
 * Checks the policyFragment output to handle wrapped principals
 * (e.g. PrincipalWithConditions, SessionTagsPrincipal).
 */
export function isServicePrincipal(principal: IPrincipal): boolean {
  const principalJson = principal.policyFragment.principalJson;
  return 'Service' in principalJson;
}
