import { TokenizedStringFragments as CTokenizedStringFragments } from 'constructs';
import { IFragmentConcatenator, IResolvable } from './resolvable';

/**
 * Fragments of a concatenated string containing stringified Tokens
 */
export class TokenizedStringFragments {
  /** @internal */
  public readonly _delegate: CTokenizedStringFragments;

  public constructor(delegate = new CTokenizedStringFragments()) {
    this._delegate = delegate;
  }

  public get firstToken(): IResolvable | undefined {
    return this._delegate.firstToken;
  }

  public get firstValue(): any {
    return this._delegate.firstValue();
  }

  public get length() {
    return this._delegate.length;
  }

  public addLiteral(lit: any) {
    return this._delegate.addLiteral(lit);
  }

  public addToken(token: IResolvable) {
    return this._delegate.addToken(token);
  }

  public addIntrinsic(value: any) {
    return this._delegate.addIntrinsic(value);
  }

  /**
   * Return all Tokens from this string
   */
  public get tokens(): IResolvable[] {
    return this._delegate.tokens;
  }

  /**
   * Apply a transformation function to all tokens in the string
   */
  public mapTokens(mapper: ITokenMapper): TokenizedStringFragments {
    return new TokenizedStringFragments(this._delegate.mapTokens(mapper));
  }

  /**
   * Combine the string fragments using the given joiner.
   *
   * If there are any
   */
  public join(concat: IFragmentConcatenator): any {
    return this._delegate.join(concat);
  }
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
