/**
 * Strategy for handling nested properties in L1 property mixins
 */
export enum PropertyMergeStrategy {
  /**
   * Override all properties
   */
  OVERRIDE = 'override',
  /**
   * Deep merge nested objects, override primitives and arrays
   */
  MERGE = 'merge',
}

/**
 * Options for applying CfnProperty mixins
 */
export interface CfnPropertyMixinOptions {
  /**
   * Strategy for merging nested properties
   *
   * @default - PropertyMergeStrategy.MERGE
   */
  readonly strategy?: PropertyMergeStrategy;
}
