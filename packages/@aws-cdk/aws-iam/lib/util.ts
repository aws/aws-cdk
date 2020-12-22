import { DefaultTokenResolver, Lazy, StringConcat, Tokenization } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { IPolicy } from './policy';

const MAX_POLICY_NAME_LEN = 128;

export function undefinedIfEmpty(f: () => string[]): string[] {
  return Lazy.list({
    produce: () => {
      const array = f();
      return (array && array.length > 0) ? array : undefined;
    },
  });
}

/**
 * Used to generate a unique policy name based on the policy resource construct.
 * The logical ID of the resource is a great candidate as long as it doesn't exceed
 * 128 characters, so we take the last 128 characters (in order to make sure the hash
 * is there).
 */
export function generatePolicyName(scope: IConstruct, logicalId: string): string {
  // as logicalId is itself a Token, resolve it first
  const resolvedLogicalId = Tokenization.resolve(logicalId, {
    scope,
    resolver: new DefaultTokenResolver(new StringConcat()),
  });
  return lastNCharacters(resolvedLogicalId, MAX_POLICY_NAME_LEN);
}

/**
 * Returns a string composed of the last n characters of str.
 * If str is shorter than n, returns str.
 *
 * @param str the string to return the last n characters of
 * @param n how many characters to return
 */
function lastNCharacters(str: string, n: number) {
  const startIndex = Math.max(str.length - n, 0);
  return str.substring(startIndex, str.length);
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

    let value = source[key];
    if (!Array.isArray(value)) {
      value = [value];
    }

    target[key].push(...value);
  }

  return target;
}
