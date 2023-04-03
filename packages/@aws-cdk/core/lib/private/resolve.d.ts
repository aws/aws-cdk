import { IConstruct } from 'constructs';
import { DefaultTokenResolver, IPostProcessor, IResolvable, IResolveContext, ITokenResolver } from '../resolvable';
import { TokenizedStringFragments } from '../string-fragments';
import { ResolutionTypeHint } from '../type-hints';
/**
 * Prefix used for intrinsic keys
 *
 * If a key with this prefix is found in an object, the actual value of the
 * key doesn't matter. The value of this key will be an `[ actualKey, actualValue ]`
 * tuple, and the `actualKey` will be a value which otherwise couldn't be represented
 * in the types of `string | number | symbol`, which are the only possible JavaScript
 * object keys.
 */
export declare const INTRINSIC_KEY_PREFIX = "$IntrinsicKey$";
/**
 * Options to the resolve() operation
 *
 * NOT the same as the ResolveContext; ResolveContext is exposed to Token
 * implementors and resolution hooks, whereas this struct is just to bundle
 * a number of things that would otherwise be arguments to resolve() in a
 * readable way.
 */
export interface IResolveOptions {
    scope: IConstruct;
    preparing: boolean;
    resolver: ITokenResolver;
    prefix?: string[];
    /**
     * Whether or not to allow intrinsics in keys of an object
     *
     * Because keys of an object must be strings, a (resolved) intrinsic, which
     * is an object, cannot be stored in that position. By default, we reject these
     * intrinsics if we encounter them.
     *
     * If this is set to `true`, in order to store the complex value in a map,
     * keys that happen to evaluate to intrinsics will be added with a unique key
     * identified by an uncomming prefix, mapped to a tuple that represents the
     * actual key/value-pair. The map will look like this:
     *
     * {
     *    '$IntrinsicKey$0': [ { Ref: ... }, 'value1' ],
     *    '$IntrinsicKey$1': [ { Ref: ... }, 'value2' ],
     *    'regularKey': 'value3',
     *    ...
     * }
     *
     * Callers should only set this option to `true` if they are prepared to deal with
     * the object in this weird shape, and massage it back into a correct object afterwards.
     *
     * (A regular but uncommon string was chosen over something like symbols or
     * other ways of tagging the extra values in order to simplify the implementation which
     * maintains the desired behavior `resolve(resolve(x)) == resolve(x)`).
     *
     * @default false
     */
    allowIntrinsicKeys?: boolean;
    /**
     * Whether to remove undefined elements from arrays and objects when resolving.
     *
     * @default true
     */
    removeEmpty?: boolean;
}
/**
 * Resolves an object by evaluating all tokens and removing any undefined or empty objects or arrays.
 * Values can only be primitives, arrays or tokens. Other objects (i.e. with methods) will be rejected.
 *
 * @param obj The object to resolve.
 * @param prefix Prefix key path components for diagnostics.
 */
export declare function resolve(obj: any, options: IResolveOptions): any;
/**
 * Find all Tokens that are used in the given structure
 */
export declare function findTokens(scope: IConstruct, fn: () => any): IResolvable[];
/**
 * Remember all Tokens encountered while resolving
 */
export declare class RememberingTokenResolver extends DefaultTokenResolver {
    private readonly tokensSeen;
    resolveToken(t: IResolvable, context: IResolveContext, postProcessor: IPostProcessor): any;
    resolveString(s: TokenizedStringFragments, context: IResolveContext): any;
    get tokens(): IResolvable[];
}
/**
 * Return the type hint from the given value
 *
 * If the value is not a resolved value (i.e, the result of resolving a token),
 * `undefined` will be returned.
 *
 * These type hints are used for correct JSON-ification of intrinsic values.
 */
export declare function resolvedTypeHint(value: any): ResolutionTypeHint | undefined;
