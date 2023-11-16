import { Code, Runtime } from '../../../aws-lambda';

/**
 * Properties used to define source code executed within a Lambda function acting as a
 * custom resource provider.
 */
export interface CdkCodeProps {
  /**
   * Runtimes that are compatible with the source code.
   */
  readonly compatibleRuntimes: Runtime[];
}

/**
 * Represents source code that will be executed within a Lambda function acting as a
 * custom resource provider.
 */
export class CdkCode {
  /**
   * Loads the source code from a local disk path.
   */
  public static fromAsset(path: string, props: CdkCodeProps) {
    return new CdkCode(path, props);
  }

  /**
   * The source code loaded from a local disk path.
   */
  public readonly codeFromAsset: Code;

  /**
   * Runtimes that are compatible with the source code.
   */
  public readonly compatibleRuntimes: Runtime[];

  private constructor(path: string, props: CdkCodeProps) {
    this.codeFromAsset = Code.fromAsset(path);
    this.compatibleRuntimes = props.compatibleRuntimes;
  }
}
