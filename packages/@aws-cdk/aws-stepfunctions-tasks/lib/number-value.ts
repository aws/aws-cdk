/**
 * A number value argument to a Task
 *
 * Either obtained from the current state, or from a literal number.
 *
 * This class is only necessary until https://github.com/awslabs/aws-cdk/issues/1455 is solved,
 * after which time we'll be able to use actual numbers to encode Tokens.
 */
export class NumberValue {
  /**
   * Use a literal number
   */
  public static fromNumber(n: number): NumberValue {
    return new NumberValue(n);
  }

  /**
   * Obtain a number from the current state
   */
  public static fromJsonPath(path: string): NumberValue {
    return new NumberValue(undefined, path);
  }

  private constructor(private readonly n?: number, private readonly path?: string) {
  }

  /**
   * Return whether the NumberValue contains a literal number
   */
  public get isLiteralNumber(): boolean {
    return this.n !== undefined;
  }

  /**
   * Get the literal number from the NumberValue
   */
  public get numberValue(): number {
    if (this.n === undefined) {
      throw new Error('NumberValue does not have a number');
    }
    return this.n;
  }

  /**
   * Get the JSON Path from the NumberValue
   */
  public get jsonPath(): string {
    if (this.path === undefined) {
      throw new Error('NumberValue does not have a JSONPath');
    }
    return this.path;
  }
}