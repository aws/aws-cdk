import { BEGIN_LIST_TOKEN_MARKER, BEGIN_STRING_TOKEN_MARKER, createTokenDouble,
  END_TOKEN_MARKER, extractTokenDouble, TokenString, VALID_KEY_CHARS } from "./encoding";
import { Token } from "./token";

const glob = global as any;

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

  private readonly stringTokenMap = new Map<string, Token>();
  private readonly numberTokenMap = new Map<number, Token>();
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
  public registerString(token: Token, representationHint?: string): string {
    const key = this.register(token, representationHint);
    return `${BEGIN_STRING_TOKEN_MARKER}${key}${END_TOKEN_MARKER}`;
  }

  /**
   * Generate a unique string for this Token, returning a key
   */
  public registerList(token: Token, representationHint?: string): string[] {
    const key = this.register(token, representationHint);
    return [`${BEGIN_LIST_TOKEN_MARKER}${key}${END_TOKEN_MARKER}`];
  }

  /**
   * Lookup a token from an encoded value
   */
  public tokenFromEncoding(x: any): Token | undefined {
    if (typeof 'x' === 'string') { return this.lookupString(x); }
    if (Array.isArray(x)) { return this.lookupList(x); }
    if (typeof x === 'object' && x !== null && Token.isToken(x)) {
      return x as Token;
    }
    return undefined;
  }

  /**
   * Create a unique number representation for this Token and return it
   */
  public registerNumber(token: Token): number {
    const tokenIndex = this.tokenCounter++;
    this.numberTokenMap.set(tokenIndex, token);
    return createTokenDouble(tokenIndex);
  }

  /**
   * Reverse a string representation into a Token object
   */
  public lookupString(s: string): Token | undefined {
    const str = TokenString.forStringToken(s);
    const fragments = str.split(this.lookupToken.bind(this));
    if (fragments.length === 1) {
      return fragments.firstToken;
    }
    return undefined;
  }

  /**
   * Reverse a string representation into a Token object
   */
  public lookupList(xs: string[]): Token | undefined {
    if (xs.length !== 1) { return undefined; }
    const str = TokenString.forListToken(xs[0]);
    const fragments = str.split(this.lookupToken.bind(this));
    if (fragments.length === 1) {
      return fragments.firstToken;
    }
    return undefined;
  }

  /**
   * Reverse a number encoding into a Token, or undefined if the number wasn't a Token
   */
  public lookupNumberToken(x: number): Token | undefined {
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
  public lookupToken(key: string): Token {
    const token = this.stringTokenMap.get(key);
    if (!token) {
      throw new Error(`Unrecognized token key: ${key}`);
    }
    return token;
  }

  private register(token: Token, representationHint?: string): string {
    const counter = this.tokenCounter++;
    const representation = (representationHint || `TOKEN`).replace(new RegExp(`[^${VALID_KEY_CHARS}]`, 'g'), '.');
    const key = `${representation}.${counter}`;
    this.stringTokenMap.set(key, token);
    return key;
  }
}