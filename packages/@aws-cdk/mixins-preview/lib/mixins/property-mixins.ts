import { deepMerge, shallowAssign } from '../util/property-mixins';

/**
 * Interface for applying properties to a target using a specific strategy
 */
export interface IMergeStrategy {
  /**
   * Apply properties from source to target for the given keys
   *
   * @param target - The construct to apply properties to
   * @param source - The property values to apply
   * @param allowedKeys - Only properties whose names are in this list will be
   * read from `source` and written to `target`. This acts as an allowlist
   * to ensure only known CloudFormation resource properties are applied.
   */
  apply(target: object, source: object, allowedKeys: string[]): void;
}

/**
 * Strategy for handling nested properties in L1 property mixins
 */
export class PropertyMergeStrategy {
  /**
   * Replaces existing property values on the target with the values from the source.
   * Each allowed key is copied from source to target as-is, without
   * inspecting nested objects. Any previous value on the target is discarded.
   */
  public static override(): IMergeStrategy {
    return new OverrideStrategy();
  }

  /**
   * Deep merges nested objects from source into target.
   * When both the existing and new value for a key are plain objects,
   * their properties are merged recursively. Primitives, arrays, and
   * mismatched types are overridden by the source value.
   */
  public static combine(): IMergeStrategy {
    return new CombineStrategy();
  }

  private constructor() {}
}

class CombineStrategy implements IMergeStrategy {
  public apply(target: object, source: object, allowedKeys: string[]): void {
    deepMerge(target, source, allowedKeys);
  }
}

class OverrideStrategy implements IMergeStrategy {
  public apply(target: object, source: object, allowedKeys: string[]): void {
    shallowAssign(target, source, allowedKeys);
  }
}

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
