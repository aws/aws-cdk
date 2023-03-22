import { IConstruct } from 'constructs';
import { TokenString } from './private/encoding';
import { TokenMap } from './private/token-map';
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
 */
export class DefaultTokenResolver implements ITokenResolver {
  constructor(private readonly concat: IFragmentConcatenator) {
  }

  /**
   * Default Token resolution
   *
   * Resolve the Token, recurse into whatever it returns,
   * then finally post-process it.
   */
  public resolveToken(t: IResolvable, context: IResolveContext, postProcessor: IPostProcessor) {
    try {
      let resolved = t.resolve(context);

      // The token might have returned more values that need resolving, recurse
      resolved = context.resolve(resolved);
      resolved = postProcessor.postProcess(resolved, context);
      return resolved;
    } catch (e: any) {
      let message = `Resolution error: ${e.message}.`;
      if (t.creationStack && t.creationStack.length > 0) {
        message += `\nObject creation stack:\n  at ${t.creationStack.join('\n  at ')}`;
      }

      e.message = message;
      throw e;
    }
  }

  /**
   * Resolve string fragments to Tokens
   */
  public resolveString(fragments: TokenizedStringFragments, context: IResolveContext) {
    return fragments.mapTokens({ mapToken: context.resolve }).join(this.concat);
  }

  public resolveList(xs: string[], context: IResolveContext) {
    // Must be a singleton list token, because concatenation is not allowed.
    if (xs.length !== 1) {
      throw new Error(`Cannot add elements to list token, got: ${xs}`);
    }

    const str = TokenString.forListToken(xs[0]);
    const tokenMap = TokenMap.instance();
    const fragments = str.split(tokenMap.lookupToken.bind(tokenMap));
    if (fragments.length !== 1) {
      throw new Error(`Cannot concatenate strings in a tokenized string array, got: ${xs[0]}`);
    }

    return fragments.mapTokens({ mapToken: context.resolve }).firstValue;
  }
}
