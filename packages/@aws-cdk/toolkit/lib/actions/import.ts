import { BaseDeployOptions } from './deploy';

export interface ImportOptions extends Omit<BaseDeployOptions, 'reuseAssets' | 'hotswap'> {
  /**
   * Build a physical resource mapping and write it to the given file, without performing the actual import operation
   *
   * @default - No file
   */
  readonly recordResourceMapping?: string;

  /**
   * Path to a file with the physical resource mapping to CDK constructs in JSON format
   *
   * @default - No mapping file
   */
  readonly resourceMappingFile?: string;

  /**
   * Allow non-addition changes to the template
   *
   * @default false
   */
  readonly force?: boolean;
}
