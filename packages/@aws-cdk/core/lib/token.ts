import { IConstruct } from "./construct";
import { unresolved } from "./private/encoding";
import { Intrinsic } from "./private/intrinsic";
import { resolve } from "./private/resolve";
import { TokenMap } from "./private/token-map";
import { IResolvable, ITokenResolver } from "./resolvable";
import { TokenizedStringFragments } from "./string-fragments";

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
export class Token {
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
  public static isUnresolved(obj: any): boolean {
    return unresolved(obj);
  }

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
  public static asString(value: any, options: EncodingOptions = {}): string {
    if (typeof value === 'string') { return value; }
    return TokenMap.instance().registerString(Token.asAny(value), options.displayHint);
  }

  /**
   * Return a reversible number representation of this token
   */
  public static asNumber(value: any): number {
    if (typeof value === 'number') { return value; }
    return TokenMap.instance().registerNumber(Token.asAny(value));
  }

  /**
   * Return a reversible list representation of this token
   */
  public static asList(value: any, options: EncodingOptions = {}): string[] {
    if (Array.isArray(value) && value.every(x => typeof x === 'string')) { return value; }
    return TokenMap.instance().registerList(Token.asAny(value), options.displayHint);
  }

  /**
   * Return a resolvable representation of the given value
   */
  public static asAny(value: any): IResolvable {
    return isResolvableObject(value) ? value : new Intrinsic(value);
  }

  private constructor() {
  }
}

/**
 * Less oft-needed functions to manipulate Tokens
 */
export class Tokenization {
  /**
   * Un-encode a string potentially containing encoded tokens
   */
  public static reverseString(s: string): TokenizedStringFragments {
    return TokenMap.instance().splitString(s);
  }

  /**
   * Un-encode a Tokenized value from a number
   */
  public static reverseNumber(n: number): IResolvable | undefined {
    return TokenMap.instance().lookupNumberToken(n);
  }

  /**
   * Un-encode a Tokenized value from a list
   */
  public static reverseList(l: string[]): IResolvable | undefined {
    return TokenMap.instance().lookupList(l);
  }

  /**
   * Resolves an object by evaluating all tokens and removing any undefined or empty objects or arrays.
   * Values can only be primitives, arrays or tokens. Other objects (i.e. with methods) will be rejected.
   *
   * @param obj The object to resolve.
   * @param options Prefix key path components for diagnostics.
   */
  public static resolve(obj: any, options: ResolveOptions): any {
    return resolve(obj, options);
  }

  /**
   * Return whether the given object is an IResolvable object
   *
   * This is different from Token.isUnresolved() which will also check for
   * encoded Tokens, whereas this method will only do a type check on the given
   * object.
   */
  public static isResolvable(obj: any): obj is IResolvable {
    return isResolvableObject(obj);
  }

  private constructor() {
  }
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

export function isResolvableObject(x: any): x is IResolvable {
  return typeof(x) === 'object' && x !== null && typeof x.resolve === 'function';
}
