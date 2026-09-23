import type { IPolicy } from './policy';
import { ValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

export const LITERAL_STRING_KEY = 'LiteralString';

/**
 * Helper class that maintains the set of attached policies for a principal.
 */
export class AttachedPolicies {
  private policies = new Array<IPolicy>();

  /**
   * Adds a policy to the list of attached policies.
   *
   * If this policy is already, attached, returns false.
   * If there is another policy attached with the same name, throws an exception.
   */
  public attach(policy: IPolicy) {
    if (this.policies.find(p => p === policy)) {
      return; // already attached
    }

    if (this.policies.find(p => p.policyName === policy.policyName)) {
      throw new ValidationError(lit`PolicyNamedAlreadyAttached`, `A policy named "${policy.policyName}" is already attached`, policy);
    }

    this.policies.push(policy);
  }
}
