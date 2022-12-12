import { captureStackTrace, DefaultTokenResolver, IPostProcessor, IResolvable, IResolveContext, Lazy, StringConcat, Token, Tokenization } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { IPolicy } from '../policy';

const MAX_POLICY_NAME_LEN = 128;

export const LITERAL_STRING_KEY = 'LiteralString';

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
 *
 * Does an in-place merge.
 */
export function mergePrincipal(target: { [key: string]: string[] }, source: { [key: string]: string[] }) {
  // If one represents a literal string, the other one must be empty
  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target);

  if ((LITERAL_STRING_KEY in source && targetKeys.some(k => k !== LITERAL_STRING_KEY)) ||
    (LITERAL_STRING_KEY in target && sourceKeys.some(k => k !== LITERAL_STRING_KEY))) {
    throw new Error(`Cannot merge principals ${JSON.stringify(target)} and ${JSON.stringify(source)}; if one uses a literal principal string the other one must be empty`);
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

  public readonly creationStack: string[];

  private constructor(private readonly fn: () => string[]) {
    this.creationStack = captureStackTrace();
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
