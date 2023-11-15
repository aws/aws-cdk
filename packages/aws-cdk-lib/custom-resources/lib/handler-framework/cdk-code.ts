import { Code, Runtime } from '../../../aws-lambda';

/**
 *
 */
export interface CdkCodeProps {
  /**
   *
   */
  readonly compatibleRuntimes: Runtime[];
}

export class CdkCode {
  /**
   *
   */
  public static fromAsset(path: string, props: CdkCodeProps) {
    return new CdkCode(path, props);
  }

  /**
   *
   */
  public readonly codeFromAsset: Code;

  /**
   *
   */
  public readonly compatibleRuntimes: Runtime[];

  private constructor(path: string, props: CdkCodeProps) {
    this.codeFromAsset = Code.fromAsset(path);
    this.compatibleRuntimes = props.compatibleRuntimes;
  }
}
