/**
 * Strategy for handling nested properties in L1 property mixins
 */
export class PropertyMergeStrategy {
  /**
   * Override all properties
   */
  public static override() {
    return new PropertyMergeStrategy({ strategy: 'override' });
  }

  /**
   * Deep merge nested objects, override primitives and arrays
   */
  public static merge() {
    return new PropertyMergeStrategy({ strategy: 'merge' });
  }

  private constructor(public readonly value: { readonly strategy: 'merge' | 'override' }) {}
}

/**
 * Options for applying CfnProperty mixins
 */
export interface CfnPropertyMixinOptions {
  /**
   * Strategy for merging nested properties
   *
   * @default - PropertyMergeStrategy.merge()
   */
  readonly strategy?: PropertyMergeStrategy;
}
