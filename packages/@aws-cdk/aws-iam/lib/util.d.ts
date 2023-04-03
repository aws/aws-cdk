import { IPostProcessor, IResolvable, IResolveContext } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { IPolicy } from './policy';
export declare const LITERAL_STRING_KEY = "LiteralString";
export declare function undefinedIfEmpty(f: () => string[]): string[];
/**
 * Used to generate a unique policy name based on the policy resource construct.
 * The logical ID of the resource is a great candidate as long as it doesn't exceed
 * 128 characters, so we take the last 128 characters (in order to make sure the hash
 * is there).
 */
export declare function generatePolicyName(scope: IConstruct, logicalId: string): string;
/**
 * Helper class that maintains the set of attached policies for a principal.
 */
export declare class AttachedPolicies {
    private policies;
    /**
     * Adds a policy to the list of attached policies.
     *
     * If this policy is already, attached, returns false.
     * If there is another policy attached with the same name, throws an exception.
     */
    attach(policy: IPolicy): void;
}
/**
 * Merge two dictionaries that represent IAM principals
 *
 * Does an in-place merge.
 */
export declare function mergePrincipal(target: {
    [key: string]: string[];
}, source: {
    [key: string]: string[];
}): {
    [key: string]: string[];
};
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
export declare class UniqueStringSet implements IResolvable, IPostProcessor {
    private readonly fn;
    static from(fn: () => string[]): string[];
    readonly creationStack: string[];
    private constructor();
    resolve(context: IResolveContext): string[];
    postProcess(input: any, _context: IResolveContext): any;
    toString(): string;
}
export declare function sum(xs: number[]): number;
