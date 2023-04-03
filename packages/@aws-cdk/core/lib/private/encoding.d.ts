import { IFragmentConcatenator, IResolvable } from '../resolvable';
import { TokenizedStringFragments } from '../string-fragments';
export declare const BEGIN_STRING_TOKEN_MARKER = "${Token[";
export declare const BEGIN_LIST_TOKEN_MARKER = "#{Token[";
export declare const END_TOKEN_MARKER = "]}";
export declare const VALID_KEY_CHARS = "a-zA-Z0-9:._-";
export declare const STRINGIFIED_NUMBER_PATTERN = "-1\\.\\d{10,16}e\\+289";
/**
 * A string with markers in it that can be resolved to external values
 */
export declare class TokenString {
    private readonly str;
    private readonly re;
    /**
     * Returns a `TokenString` for this string.
     */
    static forString(s: string): TokenString;
    /**
     * Returns a `TokenString` for this string (must be the first string element of the list)
     */
    static forListToken(s: string): TokenString;
    constructor(str: string, re: RegExp);
    /**
     * Split string on markers, substituting markers with Tokens
     */
    split(lookup: (id: string) => IResolvable): TokenizedStringFragments;
    /**
     * Indicates if this string includes tokens.
     */
    test(): boolean;
}
/**
 * Quote a string for use in a regex
 */
export declare function regexQuote(s: string): string;
/**
 * Concatenator that disregards the input
 *
 * Can be used when traversing the tokens is important, but the
 * result isn't.
 */
export declare class NullConcat implements IFragmentConcatenator {
    join(_left: any | undefined, _right: any | undefined): any;
}
export declare function containsListTokenElement(xs: any[]): boolean;
/**
 * Returns true if obj is a token (i.e. has the resolve() method or is a string
 * that includes token markers), or it's a listifictaion of a Token string.
 *
 * @param obj The object to test.
 */
export declare function unresolved(obj: any): boolean;
/**
 * Return a special Double value that encodes the given nonnegative integer
 *
 * We use this to encode Token ordinals.
 */
export declare function createTokenDouble(x: number): number;
/**
 * Extract the encoded integer out of the special Double value
 *
 * Returns undefined if the float is a not an encoded token.
 */
export declare function extractTokenDouble(encoded: number): number | undefined;
/**
 * Return whether the given string contains accidentally stringified number tokens
 */
export declare function stringContainsNumberTokens(x: string): boolean;
