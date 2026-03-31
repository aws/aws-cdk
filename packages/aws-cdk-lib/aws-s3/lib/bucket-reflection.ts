import type { IConstruct } from 'constructs';
import type { CfnBucket, CfnBucketPolicy } from './s3.generated';
import type { CfnKey } from '../../aws-kms';
import { Fn, Reference, Tokenization, UnscopedValidationError } from '../../core';
import { findClosestRelatedResource, findL1FromRef, memoizedGetter, resolvedEquals, resolvedExists, resolvedGet } from '../../core/lib/helpers-internal';
import type { IBucketRef } from '../../interfaces/generated/aws-s3-interfaces.generated';

/**
 * Provides read-only reflection on the configuration of an S3 Bucket's
 * underlying CfnBucket resource.
 *
 * Use `BucketReflection.of()` to obtain an instance from any Bucket reference.
 * All getters read directly from the L1 resource, providing a single source of
 * truth regardless of whether the bucket was created as an L2, imported, or
 * constructed directly as a CfnBucket.
 */
export class BucketReflection {
  /**
   * Creates a BucketReflection for the given bucket reference.
   *
   * Resolves the underlying CfnBucket from the construct tree.
   *
   * @param bucketRef - The bucket reference to reflect on.
   * @throws If the underlying CfnBucket resource cannot be found.
   */
  static of(bucketRef: IBucketRef) {
    return new BucketReflection(bucketRef);
  }

  /**
   * The CfnBucket L1 resource that is reflected on.
   *
   * @throws If the underlying CfnBucket resource cannot be found.
   */
  public get bucket(): CfnBucket {
    if (!this._bucket) {
      throw new UnscopedValidationError('CannotFindUnderlyingResource', `Unable to find underlying resource for ${this.ref.node.path}. Please pass the resource construct directly.`);
    }
    return this._bucket;
  }

  private readonly ref: IBucketRef;
  private readonly _bucket: CfnBucket | undefined;

  private constructor(ref: IBucketRef) {
    this.ref = ref;
    this._bucket = findL1FromRef<IBucketRef, CfnBucket>(
      ref,
      'AWS::S3::Bucket',
      (cfn, bucketRef) => bucketRef.bucketRef == cfn.bucketRef,
    );
  }

  /**
   * The domain name of the static website endpoint.
   *
   * Derived from the bucket's website URL attribute.
   */
  @memoizedGetter
  get bucketWebsiteDomainName(): string {
    return Fn.select(2, Fn.split('/', this.bucket.attrWebsiteUrl));
  }

  /**
   * Whether the bucket is configured for static website hosting.
   */
  get isWebsite(): boolean | undefined {
    return resolvedExists(this._bucket, 'websiteConfiguration');
  }

  /**
   * Whether the bucket's public access block configuration blocks public bucket policies.
   */
  get disallowPublicAccess(): boolean | undefined {
    return resolvedEquals(this._bucket, 'publicAccessBlockConfiguration.blockPublicPolicy', true);
  }

  /**
   * The bucket policy associated with this bucket, if any.
   *
   * Searches the construct tree for a CfnBucketPolicy that references this bucket.
   */
  get policy(): CfnBucketPolicy | undefined {
    const resolved = this._bucket || this.ref;

    return findClosestRelatedResource<IBucketRef | CfnBucket, CfnBucketPolicy>(
      resolved,
      'AWS::S3::BucketPolicy',
      (bucket, policy) => {
        const reversed = Tokenization.reverse(policy.bucket) || policy.bucket;
        if (Reference.isReference(reversed)) {
          return bucket === reversed.target;
        }

        const possibleRefs = new Set<any>([
          (bucket as CfnBucket).ref,
          bucket.bucketRef?.bucketName,
          bucket.bucketRef?.bucketArn,
        ].filter(Boolean));

        return possibleRefs.has(reversed) || String(reversed).includes(bucket.node.id);
      },
    );
  }

  /**
   * The KMS key used for server-side encryption, if any.
   *
   * Searches the construct tree for a CfnKey referenced by the bucket's
   * encryption configuration.
   */
  get encryptionKey(): CfnKey | undefined {
    if (!this._bucket) {
      return undefined;
    }
    const kmsMasterKeyId = resolvedGet(this._bucket, 'bucketEncryption.serverSideEncryptionConfiguration.0.serverSideEncryptionByDefault.kmsMasterKeyId', undefined);
    if (!kmsMasterKeyId) {
      return undefined;
    }

    return findClosestRelatedResource<IConstruct, CfnKey>(
      this._bucket,
      'AWS::KMS::Key',
      (_, key) => key.ref === kmsMasterKeyId || key.attrKeyId === kmsMasterKeyId || key.attrArn === kmsMasterKeyId,
    );
  }
}
