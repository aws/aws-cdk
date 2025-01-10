import { CloudAssembly } from '@aws-cdk/cx-api';

export interface ICloudAssemblySource {
  /**
   * produce
   */
  produce(): Promise<CloudAssembly>;
}

/**
 * Configuration for creating a CLI from an AWS CDK App directory
 */
export interface CdkAppDirectoryProps {
  /**
   * Command-line for executing your app or a cloud assembly directory
   * e.g. "node bin/my-app.js"
   * or
   * "cdk.out"
   *
   * @default - read from cdk.json
   */
  readonly app?: string;

  /**
   * Emits the synthesized cloud assembly into a directory
   *
   * @default cdk.out
   */
  readonly output?: string;
}

export class CloudAssemblySource implements ICloudAssemblySource {
  /**
   * Use a directory containing an AWS CDK app as source.
   * @param directory the directory of the AWS CDK app. Defaults to the current working directory.
   * @param props additional configuration properties
   * @returns an instance of `AwsCdkCli`
   */
  public static fromCdkAppDirectory(_directory?: string, _props: CdkAppDirectoryProps = {}) {}

  /**
   * Create the CLI from a Cloud Assembly builder function.
   */
  public static fromAssemblyBuilder(_builder: (context: Record<string, any>) => Promise<CloudAssembly>) {}

  public produce(): Promise<CloudAssembly> {
    throw new Error('Method not implemented.');
  }
}

/**
 * A CloudAssemblySource that is caching its result once produced.
 *
 * Most Toolkit interactions should use a cached source.
 * Not caching is relevant when the source changes frequently
 * and it is to expensive to predict if the source has changed.
 */
export class CachedCloudAssemblySource implements ICloudAssemblySource {
  private source: ICloudAssemblySource;
  private cloudAssembly: CloudAssembly | undefined;

  public constructor(source: ICloudAssemblySource) {
    this.source = source;
  }

  public async produce(): Promise<CloudAssembly> {
    if (!this.cloudAssembly) {
      this.cloudAssembly = await this.source.produce();
    }
    return this.cloudAssembly;
  }
}
