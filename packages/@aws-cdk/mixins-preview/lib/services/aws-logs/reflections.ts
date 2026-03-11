/**
 * ATTENTION: these functions are partly copied from the aws-cdk-lib package, because
 * they are not exported from there. Before mixins goes GA, vended logs should be
 * updated to use resource traits instead and duplicate reflections removed.
 */
import type { IConstruct } from 'constructs';
import type { CfnBucket, CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';
import { type IBucketRef } from 'aws-cdk-lib/aws-s3';
import type { CfnDeliverySource } from 'aws-cdk-lib/aws-logs';
import type { CfnKey, IKeyRef } from 'aws-cdk-lib/aws-kms';
import { findClosestRelatedResource, findL1FromRef } from 'aws-cdk-lib/core/lib/helpers-internal';

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

export function tryFindKmsKeyConstruct(kmsKey: IKeyRef): CfnKey | undefined {
  return findL1FromRef<IKeyRef, CfnKey>(
    kmsKey,
    'AWS::KMS::Key',
    (cfn, ref) => ref.keyRef === cfn.keyRef,
  );
}

function tryFindBucketConstruct(bucket: IBucketRef): CfnBucket | undefined {
  return findL1FromRef<IBucketRef, CfnBucket>(
    bucket,
    'AWS::S3::Bucket',
    (cfn, ref) => ref.bucketRef == cfn.bucketRef,
  );
}
