import type { IReadableBox } from '../helpers-internal/box';
import { Box } from '../helpers-internal/box';
import { deepMerge as deepMergeCopy } from '../private/deep-merge';
import { Tokenization } from '../token';

/**
 * Attempt to unwrap a value into a Box.
 * Returns the Box if the value is a Box directly, or if it's a token
 * that can be reversed to a Box. Returns undefined otherwise.
 */
function tryUnbox(value: any): IReadableBox<any> | undefined {
  if (Box.isBox(value)) {
    return value;
  }
  const reversed = Tokenization.reverse(value, { failConcat: false });
  if (reversed && Box.isBox(reversed)) {
    return reversed;
  }
  return undefined;
}

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
 * Interface for merging arrays
 */
export interface IArrayMergeStrategy {
  /**
   * Merge source array into target array
   */
  merge(target: any[], source: any[]): any[];
}

/**
 * Strategies for merging arrays in L1 property mixins.
 * Array elements are never deep-merged.
 */
export class ArrayMergeStrategy {
  /**
   * Replace the target array entirely with the source array.
   *
   * @example
   * // target: [1, 2, 3], source: [4, 5] → [4, 5]
   */
  public static replace(): IArrayMergeStrategy {
    return new ArrayReplaceStrategy();
  }

  /**
   * Append source elements after the existing target elements.
   *
   * @example
   * // target: [1, 2], source: [3, 4] → [1, 2, 3, 4]
   */
  public static append(): IArrayMergeStrategy {
    return new ArrayAppendStrategy();
  }

  /**
   * Prepend source elements before the existing target elements.
   *
   * @example
   * // target: [1, 2], source: [3, 4] → [3, 4, 1, 2]
   */
  public static prepend(): IArrayMergeStrategy {
    return new ArrayPrependStrategy();
  }

  /**
   * Overwrite target elements positionally with source elements.
   * Target elements beyond the source length are preserved.
   *
   * @example
   * // target: ['a', 'b', 'c', 'd'], source: ['x', 'y'] → ['x', 'y', 'c', 'd']
   */
  public static replaceByIndex(): IArrayMergeStrategy {
    return new ArrayReplaceByIndexStrategy();
  }

  /**
   * Match source and target elements by a shared key property.
   * Matching target elements are replaced (not deep-merged).
   * Unmatched source elements are appended.
   *
   * Supports Box-backed elements: when target array elements are Boxes, the
   * match is deferred until the Boxes resolve.
   *
   * @param key - The property name to match elements on.
   *
   * @example
   * // key: 'id'
   * // target: [{id: 1, v: 'old'}, {id: 2, v: 'keep'}]
   * // source: [{id: 1, v: 'new'}, {id: 3, v: 'added'}]
   * // result: [{id: 1, v: 'new'}, {id: 2, v: 'keep'}, {id: 3, v: 'added'}]
   */
  public static replaceByKey(key: string): IArrayMergeStrategy {
    // Wrapped in BoxSafeArrayStrategy because replaceByKey reads element[key]
    // to match elements. If an element is a Box, that property access would fail
    // since the Box hasn't resolved yet. The wrapper defers the merge until all
    // Box elements are resolved.
    return new BoxSafeArrayStrategy(new ArrayReplaceByKeyStrategy(key));
  }

  private constructor() {}
}

/**
 * Options for the combine strategy
 */
export interface CombineStrategyOptions {
  /**
   * Strategy for merging arrays.
   *
   * @default ArrayMergeStrategy.replace()
   */
  readonly arrays?: IArrayMergeStrategy;
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
   *
   * Supports Box-backed values: when the target value is a Box, the merge
   * is deferred until the Box resolves.
   */
  public static combine(options?: CombineStrategyOptions): IMergeStrategy {
    // Wrapped in BoxSafeMergeStrategy because CombineStrategy reads and
    // compares property values (e.g. to decide between deep-merge and array-merge).
    // If a value is a Box, those checks would fail since the Box hasn't resolved yet.
    // The wrapper defers per-key merging until all Box values are resolved.
    return new BoxSafeMergeStrategy(new CombineStrategy(options?.arrays ?? ArrayMergeStrategy.replace()));
  }

  private constructor() {}
}

class CombineStrategy implements IMergeStrategy {
  constructor(private readonly arrayStrategy: IArrayMergeStrategy) {}

  public apply(target: object, source: object, allowedKeys: string[]): void {
    for (const key of allowedKeys) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      if (!(key in source)) {
        continue;
      }

      const sourceValue = (source as any)[key];
      const targetValue = (target as any)[key];

      if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        (target as any)[key] = this.arrayStrategy.merge(targetValue, sourceValue);
      } else if (typeof sourceValue === 'object' && sourceValue != null && !Array.isArray(sourceValue) &&
          typeof targetValue === 'object' && targetValue != null && !Array.isArray(targetValue)) {
        (target as any)[key] = deepMergeCopy(Object.create(null), targetValue, sourceValue);
      } else {
        (target as any)[key] = sourceValue;
      }
    }
  }
}

/**
 * Wraps an IMergeStrategy to make it box-safe.
 * When the target value for a key is a Box, the merge is deferred via
 * Box.combine so the delegate operates on the resolved value.
 */
class BoxSafeMergeStrategy implements IMergeStrategy {
  constructor(private readonly delegate: IMergeStrategy) {}

  public apply(target: object, source: object, allowedKeys: string[]): void {
    for (const key of allowedKeys) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      if (!(key in source)) {
        continue;
      }

      const targetValue = (target as any)[key];
      const box = tryUnbox(targetValue);

      if (box) {
        const delegate = this.delegate;
        const sourceValue = (source as any)[key];

        (target as any)[key] = Box.combine({ box }, ({ box: resolved }) => {
          const tmp: any = { value: resolved };
          delegate.apply(tmp, { value: sourceValue }, ['value']);
          return tmp.value;
        });
      } else {
        this.delegate.apply(target, source, [key]);
      }
    }
  }
}

class OverrideStrategy implements IMergeStrategy {
  public apply(target: object, source: object, allowedKeys: string[]): void {
    for (const key of allowedKeys) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      if (key in source) {
        (target as any)[key] = (source as any)[key];
      }
    }
  }
}

/**
 * Wraps an array merge strategy to make it box-safe.
 * If any element in the target array is a Box, the merge is deferred via Box.combine.
 */
class BoxSafeArrayStrategy implements IArrayMergeStrategy {
  constructor(private readonly delegate: IArrayMergeStrategy) {}

  public merge(target: any[], source: any[]): any {
    const boxes: Record<string, IReadableBox<any>> = {};
    for (let i = 0; i < target.length; i++) {
      const box = tryUnbox(target[i]);
      if (box) {
        boxes[`t${i}`] = box;
      }
    }

    if (Object.keys(boxes).length === 0) {
      return this.delegate.merge(target, source);
    }

    const delegate = this.delegate;
    return Box.combine(boxes, (resolved) => {
      const resolvedTarget = target.map((el, i) => `t${i}` in resolved ? resolved[`t${i}`] : el);
      return delegate.merge(resolvedTarget, source);
    });
  }
}

class ArrayReplaceStrategy implements IArrayMergeStrategy {
  public merge(_target: any[], source: any[]): any[] {
    return source;
  }
}

class ArrayAppendStrategy implements IArrayMergeStrategy {
  public merge(target: any[], source: any[]): any[] {
    return [...target, ...source];
  }
}

class ArrayPrependStrategy implements IArrayMergeStrategy {
  public merge(target: any[], source: any[]): any[] {
    return [...source, ...target];
  }
}

class ArrayReplaceByIndexStrategy implements IArrayMergeStrategy {
  public merge(target: any[], source: any[]): any[] {
    const result = [...target];
    for (let i = 0; i < source.length; i++) {
      result[i] = source[i];
    }
    return result;
  }
}

class ArrayReplaceByKeyStrategy implements IArrayMergeStrategy {
  constructor(private readonly key: string) {}

  public merge(target: any[], source: any[]): any[] {
    const result = [...target];
    for (const sourceItem of source) {
      if (typeof sourceItem !== 'object' || sourceItem == null) {
        continue;
      }
      const keyValue = sourceItem[this.key];
      const idx = result.findIndex(
        (t) => typeof t === 'object' && t != null && t[this.key] === keyValue,
      );
      if (idx >= 0) {
        result[idx] = sourceItem;
      } else {
        result.push(sourceItem);
      }
    }
    return result;
  }
}
