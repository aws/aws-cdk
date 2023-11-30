import { Construct } from 'constructs';
import { RuntimeDeterminer } from './utils/runtime-determiner';
import { Code, Runtime } from '../../aws-lambda';

/**
 * Properties used to define source code executed within a Lambda function acting as a
 * custom resource provider.
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
   *
   * @default 'index.handler'
   */
  readonly entrypoint?: string;
}

/**
 * Represents source code that will be executed within a Lambda function acting as a
 * custom resource provider.
 */
export class CdkHandler extends Construct {
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
    this.entrypoint = props.entrypoint ?? 'index.handler';
    this.runtime = RuntimeDeterminer.determineLatestRuntime(props.compatibleRuntimes);
  }
}
