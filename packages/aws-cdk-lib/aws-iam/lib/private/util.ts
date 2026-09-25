import type { IConstruct } from 'constructs';
import type { IPostProcessor, IResolvable, IResolveContext } from '../../../core';
import {
  DefaultTokenResolver,
  FeatureFlags,
  Names,
  StringConcat,
  Token,
  Tokenization,
  UnscopedValidationError,
  ValidationError,
} from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import type { IPolicy } from '../policy';

export const MAX_POLICY_NAME_LEN = 128;

export const LITERAL_STRING_KEY = 'LiteralString';

/**
 * The name to give to the default policy of an imported principal.
 *
 * Without the feature flag the policy keeps its historical name, which only depends on the path inside
 * the stack. Importing the same principal into two stacks then attaches two inline policies with the
 * same name to the same physical principal, and since an inline policy is identified by (principal,
 * policy name), the stack that deploys last replaces the permissions granted by the other one.
 *
 * With the feature flag enabled the name is derived from the principal's path in the app, which
 * includes the stack, so every stack gets an inline policy of its own.
 */
export function defaultPolicyNameFor(scope: IConstruct, featureFlag: string, prefix: string): DefaultPolicyName {
  const useUniqueName = FeatureFlags.of(scope).isEnabled(featureFlag) ?? false;
  if (!useUniqueName) {
    return { useUniqueName, name: prefix };
  }

  // To preserve existing policy names, use Names.uniqueResourceName() only when exceeding the limit of policy names
  // See https://github.com/aws/aws-cdk/pull/27548 for more
  let name = `${prefix}${Names.uniqueId(scope)}`;
  if (name.length > MAX_POLICY_NAME_LEN) {
    name = `${prefix}${Names.uniqueResourceName(scope, { maxLength: MAX_POLICY_NAME_LEN - prefix.length })}`;
  }
  return { useUniqueName, name };
}

/**
 * The outcome of `defaultPolicyNameFor`.
 */
export interface DefaultPolicyName {
  /**
   * Whether the stack-safe name is in effect, i.e. whether the feature flag is enabled.
   *
   * The name is only given to the policy as a physical name when it is, so that apps that have not
   * enabled the flag keep the physical name CloudFormation generates for them today.
   */
  readonly useUniqueName: boolean;

  /**
   * The name to use, both as the construct id of the policy and, when `useUniqueName` is set, as its
   * physical name.
   */
  readonly name: string;
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
      throw new ValidationError(lit`PolicyNamedAlreadyAttached`, `A policy named "${policy.policyName}" is already attached`, policy);
    }

    this.policies.push(policy);
  }
}

/**
 * Merge two dictionaries that represent IAM principals
 *
 * Does an in-place merge.
 */
export function mergePrincipal(target: { [key: string]: string[] }, source: { [key: string]: string[] }) {
  // If one represents a literal string, the other one must be empty
  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target);

  if ((LITERAL_STRING_KEY in source && targetKeys.some(k => k !== LITERAL_STRING_KEY)) ||
    (LITERAL_STRING_KEY in target && sourceKeys.some(k => k !== LITERAL_STRING_KEY))) {
    throw new UnscopedValidationError(lit`CannotMustBeCannotMerge`, `Cannot merge principals ${JSON.stringify(target)} and ${JSON.stringify(source)}; if one uses a literal principal string the other one must be empty`);
  }

  for (const key of sourceKeys) {
    target[key] = target[key] ?? [];

    let value = source[key];
    if (!Array.isArray(value)) {
      value = [value];
    }

    target[key].push(...value);
  }

  return target;
}

/**
 * Lazy string set token that dedupes entries
 *
 * Needs to operate post-resolve, because the inputs could be
 * `[ '${Token[TOKEN.9]}', '${Token[TOKEN.10]}', '${Token[TOKEN.20]}' ]`, which
 * still all resolve to the same string value.
 *
 * Needs to JSON.stringify() results because strings could resolve to literal
 * strings but could also resolve to `{ Fn::Join: [...] }`.
 */
export class UniqueStringSet implements IResolvable, IPostProcessor {
  public static from(fn: () => string[]) {
    return Token.asList(new UniqueStringSet(fn));
  }

  public readonly creationStack: string[] = ['Token stack traces are no longer captured'];

  private constructor(private readonly fn: () => string[]) {
  }

  public resolve(context: IResolveContext) {
    context.registerPostProcessor(this);
    return this.fn();
  }

  public postProcess(input: any, _context: IResolveContext) {
    if (!Array.isArray(input)) { return input; }
    if (input.length === 0) { return undefined; }

    const uniq: Record<string, any> = {};
    for (const el of input) {
      uniq[JSON.stringify(el)] = el;
    }
    return Object.values(uniq);
  }

  public toString(): string {
    return Token.asString(this);
  }
}

export function sum(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0);
}
