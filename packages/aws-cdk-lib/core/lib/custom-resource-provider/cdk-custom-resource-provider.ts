import { CustomResourceProviderOptions } from './shared';
import { Runtime } from '../../../aws-lambda';

/**
 * Initialization properties for `CdkCustomResourceProvider`
 */
export interface CdkCustomResourceProviderProps extends CustomResourceProviderOptions {
  /**
   * A local file system directory with the provider's code. The code will be
   * bundled into a zip asset and wired to the provider's AWS Lambda function.
   */
  readonly codeDirectory: string;

  /**
   * Runtimes that are compatible with the source code.
   */
  readonly compatibleRuntimes: Runtime[];
}

export class CdkCustomResourceProvider {}
