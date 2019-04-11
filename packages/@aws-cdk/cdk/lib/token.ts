import { IConstruct } from "./construct";
import { TOKEN_MAP } from "./encoding";
import { unresolved } from './unresolved';

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
   * Returns true if obj is a token (i.e. has the resolve() method or is a string
   * that includes token markers), or it's a listifictaion of a Token string.
   *
   * @param obj The object to test.
   */
  public static unresolved(obj: any): boolean {
    return unresolved(obj);
  }

  private tokenStringification?: string;
  private tokenListification?: string[];

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
  public resolve(_context: ResolveContext): any {
    let value = this.valueOrFunction;
    if (typeof(value) === 'function') {
      value = value();
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
      this.tokenStringification = TOKEN_MAP.registerString(this, this.displayName);
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
    // tslint:disable-next-line:max-line-length
    throw new Error('JSON.stringify() cannot be applied to structure with a Token in it. Use this.node.stringifyJson() instead.');
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
      this.tokenListification = TOKEN_MAP.registerList(this, this.displayName);
    }
    return this.tokenListification;
  }
}

/**
 * Current resolution context for tokens
 */
export interface ResolveContext {
  readonly scope: IConstruct;
  readonly prefix: string[];
}

/**
 * A Token that can post-process the complete resolved value, after resolve() has recursed over it
 */
export interface IResolvedValuePostProcessor {
  /**
   * Process the completely resolved value, after full recursion/resolution has happened
   */
  postProcess(input: any, context: ResolveContext): any;
}

/**
 * Whether the given object is an `IResolvedValuePostProcessor`
 */
export function isResolvedValuePostProcessor(x: any): x is IResolvedValuePostProcessor {
  return x.postProcess !== undefined;
}