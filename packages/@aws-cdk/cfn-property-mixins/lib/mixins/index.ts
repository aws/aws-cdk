import type { IMergeStrategy } from 'aws-cdk-lib/core';

/**
 * Options for applying CfnProperty mixins
 */
export interface CfnPropertyMixinOptions {
  /**
   * Strategy for merging nested properties
   *
   * @default - PropertyMergeStrategy.combine()
   */
  readonly strategy?: IMergeStrategy;
}
