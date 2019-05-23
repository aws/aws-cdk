import { IFragmentConcatenator } from "./resolve";
import { Token } from "./token";

/**
 * Result of the split of a string with Tokens
 *
 * Either a literal part of the string, or an unresolved Token.
 */
type LiteralFragment = { type: 'literal'; lit: any; };
type TokenFragment = { type: 'token'; token: Token; };
type IntrinsicFragment = { type: 'intrinsic'; value: any; };
type Fragment =  LiteralFragment | TokenFragment | IntrinsicFragment;

/**
 * Fragments of a string with markers
 */
export class TokenizedStringFragments {
  private readonly fragments = new Array<Fragment>();

  public get firstToken(): Token | undefined {
    const first = this.fragments[0];
    if (first.type === 'token') { return first.token; }
    return undefined;
  }

  public get firstValue(): any {
    return fragmentValue(this.fragments[0]);
  }

  public get length() {
    return this.fragments.length;
  }

  public addLiteral(lit: any) {
    this.fragments.push({ type: 'literal', lit });
  }

  public addToken(token: Token) {
    this.fragments.push({ type: 'token', token });
  }

  public addIntrinsic(value: any) {
    this.fragments.push({ type: 'intrinsic', value });
  }

  public mapTokens(mapper: ITokenMapper): TokenizedStringFragments {
    const ret = new TokenizedStringFragments();

    for (const f of this.fragments) {
      switch (f.type) {
        case 'literal':
          ret.addLiteral(f.lit);
          break;
        case 'token':
          const mapped = mapper.mapToken(f.token);
          if (isTokenObject(mapped)) {
            ret.addToken(mapped);
          } else {
            ret.addIntrinsic(mapped);
          }
          break;
        case 'intrinsic':
          ret.addIntrinsic(f.value);
          break;
      }
    }

    return ret;
  }

  /**
   * Combine the string fragments using the given joiner.
   *
   * If there are any
   */
  public join(concat: IFragmentConcatenator): any {
    if (this.fragments.length === 0) { return concat.join(undefined, undefined); }
    if (this.fragments.length === 1) { return this.firstValue; }

    const values = this.fragments.map(fragmentValue);

    while (values.length > 1) {
      const prefix = values.splice(0, 2);
      values.splice(0, 0, concat.join(prefix[0], prefix[1]));
    }

    return values[0];
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
  mapToken(t: Token): any;
}

/**
 * Resolve the value from a single fragment
 *
 * If the fragment is a Token, return the string encoding of the Token.
 */
function fragmentValue(fragment: Fragment): any {
  switch (fragment.type) {
    case 'literal': return fragment.lit;
    case 'token': return fragment.token.toString();
    case 'intrinsic': return fragment.value;
  }
}

/**
 * Whether x is literally a Token object
 *
 * Can't use Token.isToken() because that has been co-opted
 * to mean something else.
 */
function isTokenObject(x: any): x is Token {
  return typeof(x) === 'object' && x !== null && Token.isToken(x);
}