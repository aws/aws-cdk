import { IConstruct } from "./construct";
import { unresolved } from "./encoding";
import { createStackTrace } from './stack-trace';
import { TokenMap } from "./token-map";

/**
 * If objects has a function property by this name, they will be considered tokens, and this
 * function will be called to resolve the value for this object.
 */
export const RESOLVE_METHOD = 'resolve';

/**
 * Interface for Tokens
 *
 * Tokens are special objects that participate in synthesis.
 */
export interface IToken {
  /**
   * A hint for the Token's purpose when stringifying it
   */
  readonly displayHint?: string;

  /**
   * Produce the Token's value at resolution time
   */
  [RESOLVE_METHOD](context: IResolveContext): any;
}

/**
 * Properties for instantiating a Token
 */
export interface TokenProps {
  /**
   * A hint for the Token's purpose when stringifying it
   */
  readonly displayHint?: string;
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
export abstract class Token implements IToken {
  /**
   * Return true if input value is a Token or encoded Token
   */
  public static unresolved(obj: any): boolean {
    return unresolved(obj);
  }

  /**
   * Returns true if obj is an IToken object.
   *
   * @param obj The object to test.
   */
  public static isToken(obj: any): obj is IToken {
    return obj && typeof obj[RESOLVE_METHOD] === 'function';
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
  public static encodeAsString(token: IToken): string {
    return TokenMap.instance().registerString(token);
  }

  /**
   * Return a reversible number representation of this token
   */
  public static encodeAsNumber(token: IToken): number {
    return TokenMap.instance().registerNumber(token);
  }

  /**
   * Return a reversible list representation of this token
   */
  public static encodeAsList(token: IToken): string[] {
    return TokenMap.instance().registerList(token);
  }

  /**
   * The captured stack trace which represents the location in which this token was created.
   */
  protected readonly trace: string[];

  /**
   * displayName is used to represent the Token when it's embedded into a string; it
   * will look something like this:
   *
   *    "embedded in a larger string is ${Token[DISPLAY_NAME.123]}"
   *
   * This value is used as a hint to humans what the meaning of the Token is,
   * and does not have any effect on the evaluation.
   *
   * Must contain only alphanumeric and simple separator characters (_.:-).
   */
  constructor(private readonly props: TokenProps = {}) {
    this.trace = createStackTrace();
  }

  /**
   * @returns The resolved value for this token.
   */
  public abstract resolve(context: IResolveContext): any;

  /**
   * Convert an instance of this Token to a string
   *
   * This method will be called implicitly by language runtimes if the object
   * is embedded into a string. We treat it the same as an explicit
   * stringification.
   */
  public toString(): string {
    return Token.encodeAsString(this);
  }

  /**
   * Turn this Token into JSON
   *
   * Called automatically when JSON.stringify() is called on a Token.
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
    return JSON.stringify(`<unresolved-token:${this.props.displayHint || 'TOKEN'}>`);
  }

  /**
   * Creates a throwable Error object that contains the token creation stack trace.
   * @param message Error message
   */
  protected newError(message: string): any {
    return new Error(`${message}\nToken created:\n    at ${this.trace.join('\n    at ')}\nError thrown:`);
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