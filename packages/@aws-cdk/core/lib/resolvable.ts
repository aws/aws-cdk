import { DefaultTokenResolver as CDefaultTokenResolver } from 'constructs';
import { IConstruct } from './construct-compat';
import { TokenizedStringFragments } from './string-fragments';

/**
 * Current resolution context for tokens
 *
 * @deprecated use the `IResolveContext` interface from the `constructs` package instead.
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
   * Resolve an inner object
   */
  resolve(x: any): any;

  /**
   * Use this postprocessor after the entire token structure has been resolved
   */
  registerPostProcessor(postProcessor: IPostProcessor): void;
}

/**
 * Interface for values that can be resolvable later
 *
 * Tokens are special objects that participate in synthesis.
 *
 * @deprecated use the `IResolvable` interface from the `constructs` package instead.
 */
export interface IResolvable {
  /**
   * The creation stack of this resolvable which will be appended to errors
   * thrown during resolution.
   *
   * If this returns an empty array the stack will not be attached.
   */
  readonly creationStack: string[];

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
 *
 * @deprecated use the `IPostProcessor` interface from the `constructs` package instead.
 */
export interface IPostProcessor  {
  /**
   * Process the completely resolved value, after full recursion/resolution has happened
   */
  postProcess(input: any, context: IResolveContext): any;
}

/**
 * How to resolve tokens
 *
 * @deprecated use the `ITokenResolver` interface from the `constructs` package instead.
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
 * @deprecated use the `IFragmentConcatenator` interface from the `constructs` package instead.
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
 *
 * @deprecated use the `StringConcat` class from the `constructs` package instead.
 */
export class StringConcat implements IFragmentConcatenator {
  public join(left: any | undefined, right: any | undefined): any {
    if (left === undefined) { return right !== undefined ? `${right}` : undefined; }
    if (right === undefined) { return `${left}`; }
    return `${left}${right}`;
  }
}

/**
 * Default resolver implementation
 *
 * @deprecated use the `DefaultTokenResolver` class from the `constructs` package instead.
 */
export class DefaultTokenResolver implements ITokenResolver {
  private readonly delegate: CDefaultTokenResolver;

  constructor(concat: IFragmentConcatenator) {
    this.delegate = new CDefaultTokenResolver(concat);
  }

  /**
   * Default Token resolution
   *
   * Resolve the Token, recurse into whatever it returns,
   * then finally post-process it.
   */
  public resolveToken(t: IResolvable, context: IResolveContext, postProcessor: IPostProcessor) {
    return this.delegate.resolveToken(t, context, postProcessor);
  }

  /**
   * Resolve string fragments to Tokens
   */
  public resolveString(fragments: TokenizedStringFragments, context: IResolveContext) {
    return this.delegate.resolveString(fragments._delegate, context);
  }

  public resolveList(xs: string[], context: IResolveContext) {
    return this.delegate.resolveList(xs, context);
  }
}
