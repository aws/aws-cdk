import { Token } from '@aws-cdk/cdk';
import { IPolicy } from './policy';

const MAX_POLICY_NAME_LEN = 128;

export function undefinedIfEmpty(f: () => string[]): string[] {
  return new Token(() => {
    const array = f();
    return (array && array.length > 0) ? array : undefined;
  }).toList();
}

/**
 * Used to generate a unique policy name based on the policy resource construct.
 * The logical ID of the resource is a great candidate as long as it doesn't exceed
 * 128 characters, so we take the last 128 characters (in order to make sure the hash
 * is there).
 */
export function generatePolicyName(logicalId: string) {
  return logicalId.substring(Math.max(logicalId.length - MAX_POLICY_NAME_LEN, 0), logicalId.length);
}

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
      throw new Error(`A policy named "${policy.policyName}" is already attached`);
    }

    this.policies.push(policy);
  }
}

/**
 * Merge two dictionaries that represent IAM principals
 */
export function mergePrincipal(target: { [key: string]: string[] }, source: { [key: string]: string[] }) {
  for (const key of Object.keys(source)) {
    target[key] = target[key] || [];

    const value = source[key];
    if (!Array.isArray(value)) {
      throw new Error(`Principal value must be an array (it will be normalized later): ${value}`);
    }

    target[key].push(...value);
  }

  return target;
}