import type { IConstruct } from 'constructs';
import { CfnResource } from '../cfn-resource';
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
  return current === undefined ? { status: 'missing' } : { status: 'found', value: current };
}

/**
 * Safely traverses a nested property path on an object, returning a fallback
 * if any value along the path is an unresolved token (`IResolvable`).
 *
 * Array indexing is supported using numeric path segments (e.g. `'rules.0.name'`).
 *
 * Return value semantics:
 * - Returns the resolved value if the full path is reachable and no segment is a token.
 * - Returns `undefined` if a segment along the path is `null` or `undefined`,
 *   meaning the property was never configured.
 * - Returns the `fallback` if a segment (or the leaf) is an `IResolvable` token,
 *   meaning the property is configured but its value can't be inspected at synthesis time.
 *
 * @param obj - The root object to traverse.
 * @param path - Dot-separated property path.
 * @param fallback - Value to return when an unresolved token is encountered.
 */
export function resolvedGet<T>(obj: any, path: string, fallback: T): any | T {
  const result = resolvedTraverse(obj, path);
  if (result.status === 'token') return fallback;
  if (result.status === 'missing') return undefined;
  return result.value;
}

/**
 * Checks whether a nested property exists on an object, returning a
 * three-state result that accounts for unresolved tokens.
 *
 * - Returns `true` if the full path is reachable and the leaf value is not `undefined`.
 * - Returns `false` if a segment along the path is `null` or `undefined`.
 * - Returns `undefined` if any segment (or the leaf) is an `IResolvable` token,
 *   or if `obj` itself is `null`/`undefined`.
 *
 * @param obj - The root object to traverse.
 * @param path - Dot-separated property path.
 */
export function resolvedExists(obj: any, path: string): boolean | undefined {
  if (obj == null) return undefined;
  const result = resolvedTraverse(obj, path);
  if (result.status === 'token') return undefined;
  return result.status === 'found';
}

/**
 * Checks whether a nested property equals an expected value, returning a
 * three-state result that accounts for unresolved tokens.
 *
 * - Returns `true` if the full path is reachable and the leaf equals `expected`.
 * - Returns `false` if the path is not configured or the leaf differs from `expected`.
 * - Returns `undefined` if any segment (or the leaf) is an `IResolvable` token,
 *   or if `obj` itself is `null`/`undefined`.
 *
 * @param obj - The root object to traverse.
 * @param path - Dot-separated property path.
 * @param expected - The value to compare against.
 */
export function resolvedEquals(obj: any, path: string, expected: any): boolean | undefined {
  if (obj == null) return undefined;
  const result = resolvedTraverse(obj, path);
  if (result.status === 'token') return undefined;
  if (result.status === 'missing') return false;
  return result.value === expected;
}

/**
 * Finds the closest related resource in the construct tree.
 * Searches children first (depth-first), then ancestors (breadth-first).
 *
 * @param primary - The construct to search a related resource for
 * @param relatedCfnResourceType - The CloudFormation resource type to search for
 * @param isConnected - Predicate to determine if a candidate is related to the primary
 * @returns The closest matching resource, or undefined if none found
 */
export function findClosestRelatedResource<TPrimary extends IConstruct, TRelated extends CfnResource>(
  primary: TPrimary,
  relatedCfnResourceType: string,
  isConnected: (primary: TPrimary, candidate: TRelated) => boolean,
): TRelated | undefined {
  let closestMatch: TRelated | undefined;
  let closestDistance = Infinity;
  const visited = new Set<IConstruct>();

  const isRelatedResource = (child: IConstruct): child is TRelated => {
    return CfnResource.isCfnResource(child) && child.cfnResourceType === relatedCfnResourceType;
  };

  const checkCandidate = (candidate: IConstruct, distance: number) => {
    // Check if candidate is the right type, connected to primary, and closer than current match
    if (isRelatedResource(candidate) && isConnected(primary, candidate) && distance < closestDistance) {
      closestMatch = candidate;
      closestDistance = distance;
    }
  };

  // Search all descendants depth-first
  const searchChildren = (parent: IConstruct, distance: number) => {
    // Stop searching if we're already farther than the closest match
    if (distance >= closestDistance) {
      return;
    }

    // Check each child and recursively search its descendants
    for (const child of parent.node.children) {
      // Skip if already visited
      if (visited.has(child)) {
        continue;
      }
      visited.add(child);

      checkCandidate(child, distance);
      searchChildren(child, distance + 1);
    }
  };

  searchChildren(primary, 1);

  // Search ancestors and their descendants breadth-first
  let ancestor = primary.node.scope;
  let ancestorDistance = 1;

  // Walk up the tree while we have ancestors and haven't exceeded closest distance
  while (ancestor && ancestorDistance < closestDistance) {
    // Check all siblings and their descendants at this ancestor level
    for (const sibling of ancestor.node.children) {
      searchChildren(sibling, ancestorDistance);
    }
    ancestor = ancestor.node.scope;
    ancestorDistance++;
  }

  return closestMatch;
}

/**
 * Attempts to find the L1 CfnResource for a given Ref interface.
 * Searches children first (for L2 wrappers), then the construct tree.
 *
 * @param ref - The Ref interface (e.g., IKeyRef, IBucketRef)
 * @param cfnResourceType - The CloudFormation resource type (e.g., 'AWS::KMS::Key')
 * @param extractId - Function to extract the identifying property from the ref
 * @param extractCfnId - Function to extract the identifying property from the CfnResource
 * @returns The L1 CfnResource if found, undefined otherwise
 */
export function findL1FromRef<TRef extends IConstruct, TCfn extends CfnResource>(
  ref: TRef,
  cfnResourceType: string,
  compareIdToCfnId: (cfn: TCfn, ref: TRef) => boolean,
): TCfn | undefined {
  // Helper to check if a CfnResource matches our criteria
  const isCfnMatch = (construct: IConstruct): construct is TCfn => {
    return CfnResource.isCfnResource(construct) && construct.cfnResourceType === cfnResourceType;
  };

  // First check if ref itself is the L1 construct
  if (isCfnMatch(ref)) {
    return ref;
  }

  // Check if ref is an L2 construct with a defaultChild
  if (ref.node.defaultChild && isCfnMatch(ref.node.defaultChild)) {
    return ref.node.defaultChild;
  }

  // Finally search the broader construct tree
  return findClosestRelatedResource<TRef, TCfn>(
    ref,
    cfnResourceType,
    (_, candidate) => compareIdToCfnId(candidate, ref),
  );
}

/**
 * Finds the parent L2 construct scope if this construct is a default child.
 * L2 constructs create their L1 resource as a child with id 'Resource' or 'Default'.
 * Only these two ids have special meaning.
 *
 * @param construct - The construct to find the parent L2 scope for
 * @returns The parent L2 scope if the construct is a default child, undefined otherwise
 */
export function findParentL2Scope(construct: IConstruct): IConstruct | undefined {
  if (construct.node.scope && (construct.node.id === 'Resource' || construct.node.id === 'Default')) {
    return construct.node.scope;
  }
  return;
}
