import { Code, Runtime } from '../../aws-lambda';

/**
 * Properties used to define source code executed within a Lambda function acting as a
 * custom resource provider.
 */
export interface CdkHandlerProps {
  /**
   * The name of the method within your code that Lambda calls to execute your function.
   */
  readonly handler: string;

  /**
   * Runtimes that are compatible with the source code.
   */
  readonly compatibleRuntimes: Runtime[];
}

/**
 * Represents source code that will be executed within a Lambda function acting as a
 * custom resource provider.
 */
export class CdkHandler {
  /**
   * Loads the source code from a local disk path.
   */
  public static fromAsset(path: string, props: CdkHandlerProps) {
    return new CdkHandler(path, props);
  }

  /**
   * The source code loaded from a local disk path.
   */
  public readonly code: Code;

  /**
   * The name of the method within your code that Lambda calls to execute your function.
   */
  public readonly handler: string;

  /**
   * Runtimes that are compatible with the source code.
   */
  public readonly compatibleRuntimes: Runtime[];

  private constructor(path: string, props: CdkHandlerProps) {
    this.code = Code.fromAsset(path);
    this.handler = props.handler;
    this.compatibleRuntimes = props.compatibleRuntimes;
  }
}
