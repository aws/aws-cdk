import { IPrincipal } from '../principals';


/**
 * Compare two principals, check if they are the same
 *
 * This only needs to be implemented for principals that could potentially be value-equal.
 * Identity-equal principals will be handled correctly by default.
 */
export interface IComparablePrincipal extends IPrincipal {
  /**
   * Return whether or not this principal is equal to the given principal
   */
  equalTo(other: IPrincipal): boolean;
}

function isComparablePrincipal(x: IPrincipal): x is IComparablePrincipal {
  return 'equalTo' in x;
}

export function equalPrincipals(a: IPrincipal, b: IPrincipal) {
  return a === b || (isComparablePrincipal(a) ? a.equalTo(b) : false);
}