import { IFragmentConcatenator, IResolvable } from './resolvable';
/**
 * Fragments of a concatenated string containing stringified Tokens
 */
export declare class TokenizedStringFragments {
    private readonly fragments;
    get firstToken(): IResolvable | undefined;
    get firstValue(): any;
    get length(): number;
    addLiteral(lit: any): void;
    addToken(token: IResolvable): void;
    addIntrinsic(value: any): void;
    /**
     * Return all Tokens from this string
     */
    get tokens(): IResolvable[];
    /**
     * Apply a transformation function to all tokens in the string
     */
    mapTokens(mapper: ITokenMapper): TokenizedStringFragments;
    /**
     * Combine the string fragments using the given joiner.
     *
     * If there are any
     */
    join(concat: IFragmentConcatenator): any;
}
/**
 * Interface to apply operation to tokens in a string
 *
 * Interface so it can be exported via jsii.
 */
export interface ITokenMapper {
    /**
     * Replace a single token
     */
    mapToken(t: IResolvable): any;
}
