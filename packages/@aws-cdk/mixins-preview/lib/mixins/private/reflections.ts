import type { IConstruct } from 'constructs';
import { CfnResource } from 'aws-cdk-lib/core';
import { type IBucketRef, type CfnBucketPolicy, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { CfnDeliverySource } from 'aws-cdk-lib/aws-logs';
import { CfnKey, IKeyRef } from 'aws-cdk-lib/aws-kms';

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

export function tryFindDeliverySourceForResource(source: IConstruct, sourceArn: string, logType: string): CfnDeliverySource | undefined {
  return findClosestRelatedResource<IConstruct, CfnDeliverySource>(
    source,
    'AWS::Logs::DeliverySource',
    (_, deliverySource) => deliverySource.resourceArn === sourceArn && deliverySource.logType === logType,
  );
}

export function tryFindKmsKeyforBucket(bucket: IBucketRef): CfnKey | undefined {
  const cfnBucket = tryFindBucketConstruct(bucket);
  const kmsMasterKeyId = cfnBucket && Array.isArray((cfnBucket.bucketEncryption as
        CfnBucket.BucketEncryptionProperty)?.serverSideEncryptionConfiguration) ?
    (((cfnBucket.bucketEncryption as CfnBucket.BucketEncryptionProperty).serverSideEncryptionConfiguration as
        CfnBucket.ServerSideEncryptionRuleProperty[])[0]?.serverSideEncryptionByDefault as
        CfnBucket.ServerSideEncryptionByDefaultProperty)?.kmsMasterKeyId
    : undefined;
  if (!kmsMasterKeyId) {
    return undefined;
  }
  return findClosestRelatedResource<IConstruct, CfnKey>(
    bucket,
    'AWS::KMS::Key',
    (_, key) => key.ref === kmsMasterKeyId || key.attrKeyId === kmsMasterKeyId || key.attrArn === kmsMasterKeyId,
  );
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

export function tryFindKmsKeyConstruct(kmsKey: IKeyRef): CfnKey | undefined {
  return findL1FromRef<IKeyRef, CfnKey>(
    kmsKey,
    'AWS::KMS::Key',
    (cfn, ref) => ref.keyRef === cfn.keyRef,
  );
}

export function tryFindBucketConstruct(bucket: IBucketRef): CfnBucket | undefined {
  return findL1FromRef<IBucketRef, CfnBucket>(
    bucket,
    'AWS::S3::Bucket',
    (cfn, ref) => ref.bucketRef == cfn.bucketRef,
  );
}
