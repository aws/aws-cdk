import { Construct } from 'constructs';
import { RuntimeDeterminer } from './utils/runtime-determiner';
import { Code, Runtime } from '../../aws-lambda';

/**
 * Properties used to initialize `CdkHandler`.
 */
export interface CdkHandlerProps {
  /**
   * A local file system directory with the provider's code. The code will be
   * bundled into a zip asset and wired to the provider's AWS Lambda function.
   */
  readonly codeDirectory: string;

  /**
   * Runtimes that are compatible with the source code.
   */
  readonly compatibleRuntimes: Runtime[];

  /**
   * The name of the method within your code that Lambda calls to execute your function.
   */
  readonly entrypoint: string;
}

/**
 * Represents an instance of `CdkHandler`.
 */
export class CdkHandler extends Construct {
  /**
   * The latest nodejs runtime version available across all AWS regions
   */
  private static readonly DEFAULT_RUNTIME = Runtime.NODEJS_LATEST;

  /**
   * The source code loaded from a local disk path.
   */
  public readonly codeDirectory: string;

  /**
   * The source code of your Lambda function.
   */
  public readonly code: Code;

  /**
   * The name of the method within your code that Lambda calls to execute your function.
   */
  public readonly entrypoint: string;

  /**
   * The latest runtime that is compatible with the source code.
   */
  public readonly runtime: Runtime;

  public constructor(scope: Construct, id: string, props: CdkHandlerProps) {
    super(scope, id);
    this.codeDirectory = props.codeDirectory;
    this.code = Code.fromAsset(props.codeDirectory);
    this.entrypoint = props.entrypoint;
    this.runtime = RuntimeDeterminer.determineLatestRuntime(CdkHandler.DEFAULT_RUNTIME, props.compatibleRuntimes);
  }
}
