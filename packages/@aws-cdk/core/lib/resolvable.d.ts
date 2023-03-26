import { IConstruct } from 'constructs';
import { TokenizedStringFragments } from './string-fragments';
import { ResolutionTypeHint } from './type-hints';
/**
 * Current resolution context for tokens
 */
export interface IResolveContext {
    /**
     * The scope from which resolution has been initiated
     */
    readonly scope: IConstruct;
    /**
     * True when we are still preparing, false if we're rendering the final output
     */
    readonly preparing: boolean;
    /**
     * Path in the JSON document that is being constructed
     */
    readonly documentPath: string[];
    /**
     * Resolve an inner object
     */
    resolve(x: any, options?: ResolveChangeContextOptions): any;
    /**
     * Use this postprocessor after the entire token structure has been resolved
     */
    registerPostProcessor(postProcessor: IPostProcessor): void;
}
/**
 * Options that can be changed while doing a recursive resolve
 */
export interface ResolveChangeContextOptions {
    /**
     * Change the 'allowIntrinsicKeys' option
     *
     * @default - Unchanged
     */
    readonly allowIntrinsicKeys?: boolean;
}
/**
 * Interface for values that can be resolvable later
 *
 * Tokens are special objects that participate in synthesis.
 */
export interface IResolvable {
    /**
     * The creation stack of this resolvable which will be appended to errors
     * thrown during resolution.
     *
     * This may return an array with a single informational element indicating how
     * to get this property populated, if it was skipped for performance reasons.
     */
    readonly creationStack: string[];
    /**
     * The type that this token will likely resolve to.
     */
    readonly typeHint?: ResolutionTypeHint;
    /**
     * Produce the Token's value at resolution time
     */
    resolve(context: IResolveContext): any;
    /**
     * Return a string representation of this resolvable object.
     *
     * Returns a reversible string representation.
     */
    toString(): string;
}
/**
 * A Token that can post-process the complete resolved value, after resolve() has recursed over it
 */
export interface IPostProcessor {
    /**
     * Process the completely resolved value, after full recursion/resolution has happened
     */
    postProcess(input: any, context: IResolveContext): any;
}
/**
 * How to resolve tokens
 */
export interface ITokenResolver {
    /**
     * Resolve a single token
     */
    resolveToken(t: IResolvable, context: IResolveContext, postProcessor: IPostProcessor): any;
    /**
     * Resolve a string with at least one stringified token in it
     *
     * (May use concatenation)
     */
    resolveString(s: TokenizedStringFragments, context: IResolveContext): any;
    /**
     * Resolve a tokenized list
     */
    resolveList(l: string[], context: IResolveContext): any;
}
/**
 * Function used to concatenate symbols in the target document language
 *
 * Interface so it could potentially be exposed over jsii.
 *
 */
export interface IFragmentConcatenator {
    /**
     * Join the fragment on the left and on the right
     */
    join(left: any | undefined, right: any | undefined): any;
}
/**
 * Converts all fragments to strings and concats those
 *
 * Drops 'undefined's.
 */
export declare class StringConcat implements IFragmentConcatenator {
    join(left: any | undefined, right: any | undefined): any;
}
/**
 * Default resolver implementation
 *
 */
export declare class DefaultTokenResolver implements ITokenResolver {
    private readonly concat;
    constructor(concat: IFragmentConcatenator);
    /**
     * Default Token resolution
     *
     * Resolve the Token, recurse into whatever it returns,
     * then finally post-process it.
     */
    resolveToken(t: IResolvable, context: IResolveContext, postProcessor: IPostProcessor): any;
    /**
     * Resolve string fragments to Tokens
     */
    resolveString(fragments: TokenizedStringFragments, context: IResolveContext): any;
    resolveList(xs: string[], context: IResolveContext): any;
}
