import { Code, Runtime } from '../../../aws-lambda';

/**
 *
 */
export interface CdkHandlerProps {
  /**
   *
   */
  readonly compatibleRuntimes: Runtime[];

  /**
   *
   */
  readonly handler: string;
}

export class CdkHandler {
  /**
   *
   */
  public static fromAsset(path: string, props: CdkHandlerProps) {
    return new CdkHandler(path, props);
  }

  /**
   *
   */
  public readonly code: Code;

  /**
   *
   */
  public readonly handler: string;

  /**
   *
   */
  public readonly compatibleRuntimes: Runtime[];

  private constructor(path: string, props: CdkHandlerProps) {
    this.code = Code.fromAsset(path);
    this.handler = props.handler;
    this.compatibleRuntimes = props.compatibleRuntimes;
  }
}
