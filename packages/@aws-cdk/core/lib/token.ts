import { IConstruct } from 'constructs';
import { Lazy } from './lazy';
import { unresolved } from './private/encoding';
import { Intrinsic } from './private/intrinsic';
import { resolve } from './private/resolve';
import { TokenMap } from './private/token-map';
import { IResolvable, ITokenResolver } from './resolvable';
import { TokenizedStringFragments } from './string-fragments';

/**
 * An enum-like class that represents the result of comparing two Tokens.
 * The return type of {@link Token.compareStrings}.
 */
export class TokenComparison {
  /**
   * This means we're certain the two components are NOT
   * Tokens, and identical.
   */
  public static readonly SAME = new TokenComparison();

  /**
   * This means we're certain the two components are NOT
   * Tokens, and different.
   */
  public static readonly DIFFERENT = new TokenComparison();

  /** This means exactly one of the components is a Token. */
  public static readonly ONE_UNRESOLVED = new TokenComparison();

  /** This means both components are Tokens. */
  public static readonly BOTH_UNRESOLVED = new TokenComparison();

  private constructor() {
  }
}

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

  /** Compare two strings that might contain Tokens with each other. */
  public static compareStrings(possibleToken1: string, possibleToken2: string): TokenComparison {
    const firstIsUnresolved = Token.isUnresolved(possibleToken1);
    const secondIsUnresolved = Token.isUnresolved(possibleToken2);

    if (firstIsUnresolved && secondIsUnresolved) {
      return TokenComparison.BOTH_UNRESOLVED;
    }
    if (firstIsUnresolved || secondIsUnresolved) {
      return TokenComparison.ONE_UNRESOLVED;
    }

    return possibleToken1 === possibleToken2 ? TokenComparison.SAME : TokenComparison.DIFFERENT;
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
    return resolve(obj, {
      scope: options.scope,
      resolver: options.resolver,
      preparing: (options.preparing !== undefined ? options.preparing : false),
    });
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

  /**
   * Stringify a number directly or lazily if it's a Token. If it is an object (i.e., { Ref: 'SomeLogicalId' }), return it as-is.
   */
  public static stringifyNumber(x: number) {
    // only convert numbers to strings so that Refs, conditions, and other things don't end up synthesizing as [object object]

    if (Token.isUnresolved(x)) {
      return Lazy.uncachedString({
        produce: context => {
          const resolved = context.resolve(x);
          return typeof resolved !== 'number' ? resolved : `${resolved}`;
        },
      });
    } else {
      return typeof x !== 'number' ? x : `${x}`;
    }
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

  /**
   * Whether the resolution is being executed during the prepare phase or not.
   * @default false
   */
  readonly preparing?: boolean;
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

/**
 * Call the given function only if all given values are resolved
 *
 * Exported as a function since it will be used by TypeScript modules, but
 * can't be exposed via JSII because of the generics.
 */
export function withResolved<A>(a: A, fn: (a: A) => void): void;
export function withResolved<A, B>(a: A, b: B, fn: (a: A, b: B) => void): void;
export function withResolved<A, B, C>(a: A, b: B, c: C, fn: (a: A, b: B, c: C) => void): void;
export function withResolved(...args: any[]) {
  if (args.length < 2) { return; }
  const argArray = args.slice(0, args.length - 1);
  if (argArray.some(Token.isUnresolved)) { return; }
  args[args.length - 1].apply(arguments, argArray);
}
