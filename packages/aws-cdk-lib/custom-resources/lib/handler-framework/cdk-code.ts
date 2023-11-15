import { Code, Runtime } from '../../../aws-lambda';

/**
 * Placeholder
 */
export interface CdkCodeProps {
  /**
   * Placeholder
   */
  readonly compatibleRuntimes: Runtime[];
}

/**
 * Placeholder
 */
export class CdkCode {
  /**
   * Placeholder
   */
  public static fromAsset(path: string, props: CdkCodeProps) {
    return new CdkCode(path, props);
  }

  /**
   * Placeholder
   */
  public readonly codeFromAsset: Code;

  /**
   * Placeholder
   */
  public readonly compatibleRuntimes: Runtime[];

  private constructor(path: string, props: CdkCodeProps) {
    this.codeFromAsset = Code.fromAsset(path);
    this.compatibleRuntimes = props.compatibleRuntimes;
  }
}
