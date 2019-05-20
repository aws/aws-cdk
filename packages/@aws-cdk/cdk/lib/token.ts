import { IConstruct } from "./construct";
import { unresolved } from "./encoding";
import { TokenMap } from "./token-map";

/**
 * If objects has a function property by this name, they will be considered tokens, and this
 * function will be called to resolve the value for this object.
 */
export const RESOLVE_METHOD = 'resolve';

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
   * @deprecated use `Token.isToken`
   */
  public static unresolved(obj: any): boolean {
    return unresolved(obj);
  }

  /**
   * Returns true if obj is a token (i.e. has the resolve() method or is a
   * string or array which includes token markers).
   *
   * @param obj The object to test.
   */
  public static isToken(obj: any): boolean {
    return unresolved(obj);
  }

  private tokenStringification?: string;
  private tokenListification?: string[];
  private tokenNumberification?: number;

  /**
   * Creates a token that resolves to `value`.
   *
   * If value is a function, the function is evaluated upon resolution and
   * the value it returns will be used as the token's value.
   *
   * displayName is used to represent the Token when it's embedded into a string; it
   * will look something like this:
   *
   *    "embedded in a larger string is ${Token[DISPLAY_NAME.123]}"
   *
   * This value is used as a hint to humans what the meaning of the Token is,
   * and does not have any effect on the evaluation.
   *
   * Must contain only alphanumeric and simple separator characters (_.:-).
   *
   * @param valueOrFunction What this token will evaluate to, literal or function.
   * @param displayName A human-readable display hint for this Token
   */
  constructor(private readonly valueOrFunction?: any, private readonly displayName?: string) {
  }

  /**
   * @returns The resolved value for this token.
   */
  public resolve(context: IResolveContext): any {
    let value = this.valueOrFunction;
    if (typeof(value) === 'function') {
      value = value(context);
    }

    return value;
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
  public toString(): string {
    const valueType = typeof this.valueOrFunction;
    // Optimization: if we can immediately resolve this, don't bother
    // registering a Token.
    if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
      return this.valueOrFunction.toString();
    }

    if (this.tokenStringification === undefined) {
      this.tokenStringification = TokenMap.instance().registerString(this, this.displayName);
    }
    return this.tokenStringification;
  }

  /**
   * Turn this Token into JSON
   *
   * This gets called by JSON.stringify(). We want to prohibit this, because
   * it's not possible to do this properly, so we just throw an error here.
   */
  public toJSON(): any {
    // We can't do the right work here because in case we contain a function, we
    // won't know the type of value that function represents (in the simplest
    // case, string or number), and we can't know that without an
    // IResolveContext to actually do the resolution, which we don't have.

    // We used to throw an error, but since JSON.stringify() is often used in
    // error messages to produce a readable representation of an object, if we
    // throw here we'll obfuscate that descriptive error with something worse.
    // So return a string representation that indicates this thing is a token
    // and needs resolving.
    return JSON.stringify(`<unresolved-token:${this.displayName || 'TOKEN'}>`);
  }

  /**
   * Return a string list representation of this token
   *
   * Call this if the Token intrinsically evaluates to a list of strings.
   * If so, you can represent the Token in a similar way in the type
   * system.
   *
   * Note that even though the Token is represented as a list of strings, you
   * still cannot do any operations on it such as concatenation, indexing,
   * or taking its length. The only useful operations you can do to these lists
   * is constructing a `FnJoin` or a `FnSelect` on it.
   */
  public toList(): string[] {
    const valueType = typeof this.valueOrFunction;
    if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
      throw new Error('Got a literal Token value; only intrinsics can ever evaluate to lists.');
    }

    if (this.tokenListification === undefined) {
      this.tokenListification = TokenMap.instance().registerList(this, this.displayName);
    }
    return this.tokenListification;
  }

  /**
   * Return a floating point representation of this Token
   *
   * Call this if the Token intrinsically resolves to something that represents
   * a number, and you need to pass it into an API that expects a number.
   *
   * You may not do any operations on the returned value; any arithmetic or
   * other operations can and probably will destroy the token-ness of the value.
   */
  public toNumber(): number {
    if (this.tokenNumberification === undefined) {
      const valueType = typeof this.valueOrFunction;
      // Optimization: if we can immediately resolve this, don't bother
      // registering a Token.
      if (valueType === 'number') { return this.valueOrFunction; }
      if (valueType !== 'function') {
        throw new Error(`Token value is not number or lazy, can't represent as number: ${this.valueOrFunction}`);
      }
      this.tokenNumberification = TokenMap.instance().registerNumber(this);
    }

    return this.tokenNumberification;
  }
}

/**
 * Current resolution context for tokens
 */
export interface IResolveContext {
  /**
   * The scope from which resolution has been initiated
   */
  readonly scope: IConstruct;

  /**
   * Resolve an inner object
   */
  resolve(x: any): any;
}

/**
 * A Token that can post-process the complete resolved value, after resolve() has recursed over it
 */
export interface IResolvedValuePostProcessor {
  /**
   * Process the completely resolved value, after full recursion/resolution has happened
   */
  postProcess(input: any, context: IResolveContext): any;
}

/**
 * Whether the given object is an `IResolvedValuePostProcessor`
 */
export function isResolvedValuePostProcessor(x: any): x is IResolvedValuePostProcessor {
  return x.postProcess !== undefined;
}