import type { IConstruct } from 'constructs';
import type { CfnKey } from '../../../aws-kms';
import { Reference, Tokenization } from '../../../core';
import { findClosestRelatedResource, findL1FromRef } from '../../../core/lib/helpers-internal';
import type { IBucketRef, CfnBucket, CfnBucketPolicy } from '../s3.generated';

/**
 * Attempts to find the KMS key used for server-side encryption on a bucket.
 *
 * @param bucket - The S3 bucket reference to search for an associated KMS key
 * @returns The KMS key if found, undefined otherwise
 */
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
 * Attempts to find the L1 CfnBucket for a given bucket reference.
 *
 * @param bucket - The S3 bucket reference to resolve
 * @returns The CfnBucket if found, undefined otherwise
 */
export function tryFindBucketConstruct(bucket: IBucketRef): CfnBucket | undefined {
  return findL1FromRef<IBucketRef, CfnBucket>(
    bucket,
    'AWS::S3::Bucket',
    (cfn, ref) => ref.bucketRef == cfn.bucketRef,
  );
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
    (b: IBucketRef, policy) => {
      // Resolve to the L1 CfnBucket for a stable identity to compare against
      const resolved = tryFindBucketConstruct(b) ?? b;

      const reversed = Tokenization.reverse(policy.bucket) || policy.bucket;
      if (Reference.isReference(reversed)) {
        return resolved === reversed.target;
      }
      const possibleRefs = new Set([(resolved as any).ref, resolved.bucketRef?.bucketName, resolved.bucketRef?.bucketArn].filter(Boolean));
      return possibleRefs.has(reversed) || String(reversed).includes(resolved.node.id);
    },
  );
}
