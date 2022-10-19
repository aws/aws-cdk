/**
 * Architectures supported by AWS Lambda
 */
export class Architecture {
  /**
   * 64 bit architecture with x86 instruction set.
   */
  public static readonly X86_64 = new Architecture('x86_64', 'linux/amd64');

  /**
   * 64 bit architecture with the ARM instruction set.
   */
  public static readonly ARM_64 = new Architecture('arm64', 'linux/arm64');

  /**
   * Used to specify a custom architecture name.
   * Use this if the architecture name is not yet supported by the CDK.
   * @param name the architecture name as recognized by AWS Lambda.
   * @param [dockerPlatform=linux/amd64] the platform to use for this architecture when building with Docker
   */
  public static custom(name: string, dockerPlatform?: string) {
    return new Architecture(name, dockerPlatform ?? 'linux/amd64');
  }

  /**
   * The name of the architecture as recognized by the AWS Lambda service APIs.
   */
  public readonly name: string;

  /**
   * The platform to use for this architecture when building with Docker.
   */
  public readonly dockerPlatform: string;

  private constructor(archName: string, dockerPlatform: string) {
    this.name = archName;
    this.dockerPlatform = dockerPlatform;
  }
}
