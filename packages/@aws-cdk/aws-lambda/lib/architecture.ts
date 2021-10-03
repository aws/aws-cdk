/**
 * Architectures supported by AWS Lambda
 */
export class Architecture {
  /**
   * 64 bit architecture with x86 instruction set.
   */
  public static readonly X86_64 = new Architecture('x86_64');

  /**
   * 64 bit architecture with the ARM instruction set.
   */
  public static readonly ARM_64 = new Architecture('arm64');

  /**
   * Used to specify a custom architecture name.
   * Use this if the architecture name is not yet supported by the CDK.
   * @param name the architecture name as recognized by AWS Lambda.
   */
  public static custom(name: string) {
    return new Architecture(name);
  }

  /**
   * The name of the architecture as recognized by the AWS Lambda service APIs.
   */
  public readonly name: string;

  private constructor(archName: string) {
    this.name = archName;
  }
}