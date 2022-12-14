import { IResolvable, IResolveContext } from '../resolvable';
import { captureStackTrace } from '../stack-trace';
import { Token } from '../token';
import { ResolutionTypeHint } from '../type-hints';

/**
 * Customization properties for an Intrinsic token
 *
 */
export interface IntrinsicProps {
  /**
   * Capture the stack trace of where this token is created
   *
   * @default true
   */
  readonly stackTrace?: boolean;

  /**
   *
   * Type that this token is expected to evaluate to
   *
   * @default ResolutionTypeHint.STRING
   */
  readonly typeHint?: ResolutionTypeHint;
}

/**
 * Token subclass that represents values intrinsic to the target document language
 *
 * WARNING: this class should not be externally exposed, but is currently visible
 * because of a limitation of jsii (https://github.com/aws/jsii/issues/524).
 *
 * This class will disappear in a future release and should not be used.
 *
 */
export class Intrinsic implements IResolvable {
  /**
   * The captured stack trace which represents the location in which this token was created.
   */
  public readonly creationStack: string[];

  /**
   * Type that the Intrinsic is expected to evaluate to.
   */
  public readonly typeHint?: ResolutionTypeHint;

  private readonly value: any;

  constructor(value: any, options: IntrinsicProps = {}) {
    if (isFunction(value)) {
      throw new Error(`Argument to Intrinsic must be a plain value object, got ${value}`);
    }

    this.creationStack = options.stackTrace ?? true ? captureStackTrace() : [];
    this.value = value;
    this.typeHint = options.typeHint ?? ResolutionTypeHint.STRING;
  }

  public resolve(_context: IResolveContext) {
    return this.value;
  }

  /**
   * Convert an instance of this Token to a string
   *
   * This method will be called implicitly by language runtimes if the object
   * is embedded into a string. We treat it the same as an explicit
   * stringification.
   */
  public toString(): string {
    return Token.asString(this);
  }

  /**
   * Convert an instance of this Token to a string list
   *
   * This method will be called implicitly by language runtimes if the object
   * is embedded into a list. We treat it the same as an explicit
   * stringification.
   */
  public toStringList(): string[] {
    return Token.asList(this);
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
    return '<unresolved-token>';
  }

  /**
   * Creates a throwable Error object that contains the token creation stack trace.
   * @param message Error message
   */
  protected newError(message: string): any {
    return new Error(`${message}\nToken created:\n    at ${this.creationStack.join('\n    at ')}\nError thrown:`);
  }
}

function isFunction(x: any) {
  return typeof x === 'function';
}
