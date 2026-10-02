import type { CfnResource } from '../cfn-resource';
import { isResolvableObject } from '../token';

/**
 * Result of traversing a property path on an object.
 * - `'missing'` — a segment along the path was `null` or `undefined`.
 * - `'token'` — a segment (or the leaf) is an unresolved `IResolvable`.
 * - `'found'` — the full path was reachable and the leaf is a concrete value.
 */
type TraverseResult = { status: 'missing' } | { status: 'token' } | { status: 'found'; value: any };

/**
 * Traverses a dot-separated property path, classifying the outcome.
 */
function resolvedTraverse(obj: any, path: string): TraverseResult {
  let current = obj;
  for (const key of path.split('.')) {
    if (current == null) return { status: 'missing' };
    if (isResolvableObject(current)) return { status: 'token' };
    current = current[key];
  }
  if (isResolvableObject(current)) return { status: 'token' };
  return current == null ? { status: 'missing' } : { status: 'found', value: current };
}

/**
 * Token-aware property inspection for a nested property path.
 *
 * Use `PropertyReflection.of()` to traverse a dot-separated path on an object,
 * then query the result with `.value`, `.exists()`, `.equals()`, or `.get()`.
 *
 * Array indexing is supported using numeric path segments (e.g. `'rules.0.name'`).
 */
export class PropertyReflection {
  /**
   * Traverse a dot-separated property path on an object.
   * If `obj` is `undefined` or `null`, the result is treated as 'missing' (not 'unknown').`
   * @param obj - The root object to traverse.
   * @param path - Dot-separated property path.
   */
  static of(obj: CfnResource | undefined, path: string): PropertyReflection {
    return new PropertyReflection(resolvedTraverse(obj, path));
  }

  private constructor(private readonly result: TraverseResult) {}

  /**
   * Whether the property exists.
   *
   * - Returns `true` if the full path is reachable and the leaf is not `undefined`.
   * - Returns `false` if a segment along the path is `null` or `undefined`.
   * - Returns `undefined` if any segment (or the leaf) is an unresolved token.
   */
  exists(): boolean | undefined {
    if (this.result.status === 'token') return undefined;
    return this.result.status === 'found';
  }

  /**
   * Whether the property strictly equals an expected value.
   *
   * - Returns `true` if the full path is reachable and the leaf `=== expected`.
   * - Returns `false` if the path is missing or the leaf differs.
   * - Returns `undefined` if any segment (or the leaf) is an unresolved token.
   */
  equals(expected: any): boolean | undefined {
    if (this.result.status === 'token') return undefined;
    if (this.result.status === 'missing') return false;
    return this.result.value === expected;
  }

  /**
   * The property value, with an optional fallback for unresolved tokens.
   *
   * - Returns the resolved value if the full path is reachable.
   * - Returns `undefined` if a segment along the path is missing.
   * - Returns `fallback` if any segment (or the leaf) is an unresolved token.
   */
  get(fallback?: any): any {
    if (this.result.status === 'token') return fallback;
    if (this.result.status === 'missing') return undefined;
    return this.result.value;
  }
}
