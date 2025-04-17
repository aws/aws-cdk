const ASSEMBLY_ERROR_SYMBOL = Symbol.for('@aws-cdk/cx-api.CloudAssemblyError');

/**
 * A CloudAssemblyError is thrown for issues with the synthesized CloudAssembly.
 *
 * These are typically exceptions that are unexpected for end-users,
 * and should only occur during abnormal operation, e.g. when the synthesis
 * didn't fully complete.
 *
 * @internal
 */
export class CloudAssemblyError extends Error {
  #time: string;

  /**
   * The time the error was thrown.
   */
  public get time(): string {
    return this.#time;
  }

  public get type(): 'assembly' {
    return 'assembly';
  }

  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, CloudAssemblyError.prototype);
    Object.defineProperty(this, ASSEMBLY_ERROR_SYMBOL, { value: true });

    this.name = new.target.name;
    this.#time = new Date().toISOString();
  }
}
