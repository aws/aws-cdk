import { IConstruct } from 'constructs';
import { IResolvable, ITokenResolver } from './resolvable';
import { TokenizedStringFragments } from './string-fragments';
/**
 * An enum-like class that represents the result of comparing two Tokens.
 * The return type of `Token.compareStrings`.
 */
export declare class TokenComparison {
    /**
     * This means we're certain the two components are NOT
     * Tokens, and identical.
     */
    static readonly SAME: TokenComparison;
    /**
     * This means we're certain the two components are NOT
     * Tokens, and different.
     */
    static readonly DIFFERENT: TokenComparison;
    /** This means exactly one of the components is a Token. */
    static readonly ONE_UNRESOLVED: TokenComparison;
    /** This means both components are Tokens. */
    static readonly BOTH_UNRESOLVED: TokenComparison;
    private constructor();
}
/**
 * Represents a special or lazily-evaluated value.
 *
 * Can be used to delay evaluation of a certain value in case, for example,
 * that it requires some context or late-bound data. Can also be used to
 * mark values that need special processing at document rendering time.
 *
 * Tokens can be embedded into strings while retaining their original
 * semantics.
 */
export declare class Token {
    /**
     * Returns true if obj represents an unresolved value
     *
     * One of these must be true:
     *
     * - `obj` is an IResolvable
     * - `obj` is a string containing at least one encoded `IResolvable`
     * - `obj` is either an encoded number or list
     *
     * This does NOT recurse into lists or objects to see if they
     * containing resolvables.
     *
     * @param obj The object to test.
     */
    static isUnresolved(obj: any): boolean;
    /**
     * Return a reversible string representation of this token
     *
     * If the Token is initialized with a literal, the stringified value of the
     * literal is returned. Otherwise, a special quoted string representation
     * of the Token is returned that can be embedded into other strings.
     *
     * Strings with quoted Tokens in them can be restored back into
     * complex values with the Tokens restored by calling `resolve()`
     * on the string.
     */
    static asString(value: any, options?: EncodingOptions): string;
    /**
     * Return a reversible number representation of this token
     */
    static asNumber(value: any): number;
    /**
     * Return a reversible list representation of this token
     */
    static asList(value: any, options?: EncodingOptions): string[];
    /**
     * Return a resolvable representation of the given value
     */
    static asAny(value: any): IResolvable;
    /** Compare two strings that might contain Tokens with each other. */
    static compareStrings(possibleToken1: string, possibleToken2: string): TokenComparison;
    private constructor();
}
/**
 * Less oft-needed functions to manipulate Tokens
 */
export declare class Tokenization {
    /**
     * Un-encode a string potentially containing encoded tokens
     */
    static reverseString(s: string): TokenizedStringFragments;
    /**
     * Un-encode a string which is either a complete encoded token, or doesn't contain tokens at all
     *
     * It's illegal for the string to be a concatenation of an encoded token and something else.
     */
    static reverseCompleteString(s: string): IResolvable | undefined;
    /**
     * Un-encode a Tokenized value from a number
     */
    static reverseNumber(n: number): IResolvable | undefined;
    /**
     * Un-encode a Tokenized value from a list
     */
    static reverseList(l: string[]): IResolvable | undefined;
    /**
     * Reverse any value into a Resolvable, if possible
     *
     * In case of a string, the string must not be a concatenation.
     */
    static reverse(x: any, options?: ReverseOptions): IResolvable | undefined;
    /**
     * Resolves an object by evaluating all tokens and removing any undefined or empty objects or arrays.
     * Values can only be primitives, arrays or tokens. Other objects (i.e. with methods) will be rejected.
     *
     * @param obj The object to resolve.
     * @param options Prefix key path components for diagnostics.
     */
    static resolve(obj: any, options: ResolveOptions): any;
    /**
     * Return whether the given object is an IResolvable object
     *
     * This is different from Token.isUnresolved() which will also check for
     * encoded Tokens, whereas this method will only do a type check on the given
     * object.
     */
    static isResolvable(obj: any): obj is IResolvable;
    /**
     * Stringify a number directly or lazily if it's a Token. If it is an object (i.e., { Ref: 'SomeLogicalId' }), return it as-is.
     */
    static stringifyNumber(x: number): string;
    private constructor();
}
/**
 * Options for the 'reverse()' operation
 */
export interface ReverseOptions {
    /**
     * Fail if the given string is a concatenation
     *
     * If `false`, just return `undefined`.
     *
     * @default true
     */
    readonly failConcat?: boolean;
}
/**
 * Options to the resolve() operation
 *
 * NOT the same as the ResolveContext; ResolveContext is exposed to Token
 * implementors and resolution hooks, whereas this struct is just to bundle
 * a number of things that would otherwise be arguments to resolve() in a
 * readable way.
 */
export interface ResolveOptions {
    /**
     * The scope from which resolution is performed
     */
    readonly scope: IConstruct;
    /**
     * The resolver to apply to any resolvable tokens found
     */
    readonly resolver: ITokenResolver;
    /**
     * Whether the resolution is being executed during the prepare phase or not.
     * @default false
     */
    readonly preparing?: boolean;
    /**
     * Whether to remove undefined elements from arrays and objects when resolving.
     *
     * @default true
     */
    readonly removeEmpty?: boolean;
}
/**
 * Properties to string encodings
 */
export interface EncodingOptions {
    /**
     * A hint for the Token's purpose when stringifying it
     */
    readonly displayHint?: string;
}
export declare function isResolvableObject(x: any): x is IResolvable;
/**
 * Call the given function only if all given values are resolved
 *
 * Exported as a function since it will be used by TypeScript modules, but
 * can't be exposed via JSII because of the generics.
 */
export declare function withResolved<A>(a: A, fn: (a: A) => void): void;
export declare function withResolved<A, B>(a: A, b: B, fn: (a: A, b: B) => void): void;
export declare function withResolved<A, B, C>(a: A, b: B, c: C, fn: (a: A, b: B, c: C) => void): void;
