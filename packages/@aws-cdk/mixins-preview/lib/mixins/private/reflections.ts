import type { IConstruct } from 'constructs';
import { CfnResource } from 'aws-cdk-lib/core';
import type { IBucketRef, CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';

/**
 * Finds the closest related resource in the construct tree.
 * Searches children first (depth-first), then ancestors (breadth-first).
 *
 * @param primary - The construct to search a related resource for
 * @param relatedCfnResourceType - The CloudFormation resource type to search for
 * @param isConnected - Predicate to determine if a candidate is related to the primary
 * @returns The closest matching resource, or undefined if none found
 */
function findClosestRelatedResource<TPrimary extends IConstruct, TRelated extends CfnResource>(
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
 * Attempts to find an existing bucket policy for the specified S3 bucket.
 * Finds the closest matching policy to the specified bucket.
 *
 * @param bucket - The S3 bucket reference to search for an associated bucket policy
 * @returns The bucket policy if found, undefined otherwise
 */
export function tryFindBucketPolicyForBucket(bucket: IBucketRef): CfnBucketPolicy | undefined {
  return findClosestRelatedResource<IBucketRef, CfnBucketPolicy>(
    bucket,
    'AWS::S3::BucketPolicy',
    (b: any, policy) => {
      const possibleRefs = new Set([b.ref, b.bucketName, b.bucketArn, b.bucketRef?.bucketName, b.bucketRef?.bucketArn].filter(Boolean));
      return possibleRefs.has(policy.bucket) || String(policy.bucket).includes(b.node.id);
    },
  );
}
