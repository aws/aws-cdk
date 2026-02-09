/**
 * ATTENTION: these functions were copied from the mixins-preview package, because we cannot
 * depend on that package from core. When mixins goes GA, this file should be removed
 * and all references to the functions in it should be updated to import from the new
 * location in core.
 */

import type { IConstruct } from 'constructs';
import { CfnResource } from '../cfn-resource';

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

