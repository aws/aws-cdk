import { IResolvable } from '../resolvable';
import { TokenizedStringFragments } from '../string-fragments';
import { Token } from '../token';
import { BEGIN_LIST_TOKEN_MARKER, BEGIN_STRING_TOKEN_MARKER, createTokenDouble,
  END_TOKEN_MARKER, extractTokenDouble, TokenString, VALID_KEY_CHARS } from './encoding';

const glob = global as any;

const STRING_SYMBOL = Symbol.for('@aws-cdk/core.TokenMap.STRING');
const LIST_SYMBOL = Symbol.for('@aws-cdk/core.TokenMap.LIST');
const NUMBER_SYMBOL = Symbol.for('@aws-cdk/core.TokenMap.NUMBER');

/**
 * Central place where we keep a mapping from Tokens to their String representation
 *
 * The string representation is used to embed token into strings,
 * and stored to be able to reverse that mapping.
 *
 * All instances of TokenStringMap share the same storage, so that this process
 * works even when different copies of the library are loaded.
 */
export class TokenMap {
  /**
   * Singleton instance of the token string map
   */
  public static instance(): TokenMap {
    if (!glob.__cdkTokenMap) {
      glob.__cdkTokenMap = new TokenMap();
    }
    return glob.__cdkTokenMap;
  }

  private readonly stringTokenMap = new Map<string, IResolvable>();
  private readonly numberTokenMap = new Map<number, IResolvable>();
  private tokenCounter = 0;

  /**
   * Generate a unique string for this Token, returning a key
   *
   * Every call for the same Token will produce a new unique string, no
   * attempt is made to deduplicate. Token objects should cache the
   * value themselves, if required.
   *
   * The token can choose (part of) its own representation string with a
   * hint. This may be used to produce aesthetically pleasing and
   * recognizable token representations for humans.
   */
  public registerString(token: IResolvable, displayHint?: string): string {
    return cachedValue(token, STRING_SYMBOL, () => {
      const key = this.registerStringKey(token, displayHint);
      return `${BEGIN_STRING_TOKEN_MARKER}${key}${END_TOKEN_MARKER}`;
    });
  }

  /**
   * Generate a unique string for this Token, returning a key
   */
  public registerList(token: IResolvable, displayHint?: string): string[] {
    return cachedValue(token, LIST_SYMBOL, () => {
      const key = this.registerStringKey(token, displayHint);
      return [`${BEGIN_LIST_TOKEN_MARKER}${key}${END_TOKEN_MARKER}`];
    });
  }

  /**
   * Create a unique number representation for this Token and return it
   */
  public registerNumber(token: IResolvable): number {
    return cachedValue(token, NUMBER_SYMBOL, () => {
      return this.registerNumberKey(token);
    });
  }

  /**
   * Lookup a token from an encoded value
   */
  public tokenFromEncoding(x: any): IResolvable | undefined {
    if (typeof x === 'string') { return this.lookupString(x); }
    if (Array.isArray(x)) { return this.lookupList(x); }
    if (Token.isUnresolved(x)) { return x; }
    return undefined;
  }

  /**
   * Reverse a string representation into a Token object
   */
  public lookupString(s: string): IResolvable | undefined {
    const fragments = this.splitString(s);
    if (fragments.tokens.length > 0 && fragments.length === 1) {
      return fragments.firstToken;
    }
    return undefined;
  }

  /**
   * Reverse a string representation into a Token object
   */
  public lookupList(xs: string[]): IResolvable | undefined {
    if (xs.length !== 1) { return undefined; }
    const str = TokenString.forListToken(xs[0]);
    const fragments = str.split(this.lookupToken.bind(this));
    if (fragments.length === 1) {
      return fragments.firstToken;
    }
    return undefined;
  }

  /**
   * Split a string into literals and Tokens
   */
  public splitString(s: string): TokenizedStringFragments {
    const str = TokenString.forString(s);
    return str.split(this.lookupToken.bind(this));
  }

  /**
   * Reverse a number encoding into a Token, or undefined if the number wasn't a Token
   */
  public lookupNumberToken(x: number): IResolvable | undefined {
    const tokenIndex = extractTokenDouble(x);
    if (tokenIndex === undefined) { return undefined; }
    const t = this.numberTokenMap.get(tokenIndex);
    if (t === undefined) { throw new Error('Encoded representation of unknown number Token found'); }
    return t;
  }

  /**
   * Find a Token by key.
   *
   * This excludes the token markers.
   */
  public lookupToken(key: string): IResolvable {
    const token = this.stringTokenMap.get(key);
    if (!token) {
      throw new Error(`Unrecognized token key: ${key}`);
    }
    return token;
  }

  private registerStringKey(token: IResolvable, displayHint?: string): string {
    const counter = this.tokenCounter++;
    const representation = (displayHint || 'TOKEN').replace(new RegExp(`[^${VALID_KEY_CHARS}]`, 'g'), '.');
    const key = `${representation}.${counter}`;
    this.stringTokenMap.set(key, token);
    return key;
  }

  private registerNumberKey(token: IResolvable): number {
    const counter = this.tokenCounter++;
    this.numberTokenMap.set(counter, token);
    return createTokenDouble(counter);
  }
}

/**
 * Get a cached value for an object, storing it on the object in a symbol
 */
function cachedValue<A extends object, B>(x: A, sym: symbol, prod: () => B) {
  let cached = (x as any)[sym as any];
  if (cached === undefined) {
    cached = prod();
    Object.defineProperty(x, sym, { value: cached });
  }
  return cached;
}
