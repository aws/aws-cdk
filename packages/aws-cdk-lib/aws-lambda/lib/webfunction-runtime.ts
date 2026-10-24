/**
 * Runtime environment for WebFunction
 */
export class WebFunctionRuntime {
  /**
   * Node.js 24.x runtime
   */
  public static readonly NODEJS_24_X = new WebFunctionRuntime('nodejs24.x');

  /**
   * The latest NodeJS version currently available in ALL regions (not necessarily the latest NodeJS version
   * available in YOUR region).
   *
   * This value changes as new Node.js runtimes become available; it currently resolves to
   * Node.js 24.x. The runtime is part of a revision's build configuration, so when an
   * upgrade of the CDK library moves this to a newer runtime, the next deployment creates a
   * new revision on it and shifts the endpoint's traffic there — without any change to your
   * code. Use a specific version such as `NODEJS_24_X` to control when that happens.
   */
  public static readonly NODEJS_LATEST = new WebFunctionRuntime('nodejs24.x');

  /**
   * Use a custom runtime string not yet supported by the CDK.
   *
   * This allows customers to use a newly released runtime without waiting
   * for a CDK library update.
   *
   * @param name The runtime identifier (e.g. 'nodejs26.x')
   */
  public static of(name: string): WebFunctionRuntime {
    return new WebFunctionRuntime(name);
  }

  /**
   * The name of this runtime, as expected by the WebFunction resource.
   */
  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }

  /**
   * Returns the runtime name
   */
  public toString(): string {
    return this.name;
  }
}
