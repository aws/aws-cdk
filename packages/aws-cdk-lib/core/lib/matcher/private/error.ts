const ASSERTION_ERROR_SYMBOL = Symbol.for('@aws-cdk/assertions.AssertionError');

/**
 * An AssertionError is thrown from the assertions module when an assertion fails.
 * Assertion errors are directly connected to an assertion a user wrote.
 *
 * Not all errors from the assertions module are automatically AssertionErrors.
 * When a pre-condition is incorrect (e.g. disallowed use of a matcher),
 * throwing an UnscopedValidationError is more appropriate.
 *
 * @internal
 */
export class AssertionError extends Error {
  #time: string;

  /**
   * The time the error was thrown.
   */
  public get time(): string {
    return this.#time;
  }

  public get type(): 'assertion' {
    return 'assertion';
  }

  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, AssertionError.prototype);
    Object.defineProperty(this, ASSERTION_ERROR_SYMBOL, { value: true });

    this.name = new.target.name;
    this.#time = new Date().toISOString();
  }
}
