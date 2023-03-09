import { PolicyDocument } from '@aws-cdk/aws-iam';
import { RemovalPolicy, Resource, Token, Tokenization } from '@aws-cdk/core';
import { CfnReference } from '@aws-cdk/core/lib/private/cfn-reference';
import { Construct } from 'constructs';
import { Bucket, IBucket } from './bucket';
import { CfnBucket, CfnBucketPolicy } from './s3.generated';

export interface BucketPolicyProps {
  /**
   * The Amazon S3 bucket that the policy applies to.
   */
  readonly bucket: IBucket;

  /**
   * Policy to apply when the policy is removed from this stack.
   *
   * @default - RemovalPolicy.DESTROY.
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * The bucket policy for an Amazon S3 bucket
 *
 * Policies define the operations that are allowed on this resource.
 *
 * You almost never need to define this construct directly.
 *
 * All AWS resources that support resource policies have a method called
 * `addToResourcePolicy()`, which will automatically create a new resource
 * policy if one doesn't exist yet, otherwise it will add to the existing
 * policy.
 *
 * Prefer to use `addToResourcePolicy()` instead.
 */
export class BucketPolicy extends Resource {
  /**
   * Create a mutable `BucketPolicy` from a `CfnBucketPolicy`.
   */
  public static fromCfnBucketPolicy(cfnBucketPolicy: CfnBucketPolicy): BucketPolicy {
    // use a "weird" id that has a higher chance of being unique
    const id = '@FromCfnBucketPolicy';

    // if fromCfnBucketPolicy() was already called on this CfnBucketPolicy,
    // return the same L2
    // (as different L2s would conflict, because of the mutation of the document property of the L1 below)
    const existing = cfnBucketPolicy.node.tryFindChild(id);
    if (existing) {
      return <BucketPolicy>existing;
    }

    // resolve the Bucket this Policy references
    let bucket: IBucket | undefined;
    if (Token.isUnresolved(cfnBucketPolicy.bucket)) {
      const bucketIResolvable = Tokenization.reverse(cfnBucketPolicy.bucket);
      if (bucketIResolvable instanceof CfnReference) {
        const cfnElement = bucketIResolvable.target;
        if (cfnElement instanceof CfnBucket) {
          bucket = Bucket.fromCfnBucket(cfnElement);
        }
      }
    }
    if (!bucket) {
      bucket = Bucket.fromBucketName(cfnBucketPolicy, '@FromCfnBucket', cfnBucketPolicy.bucket);
    }

    const ret = new class extends BucketPolicy {
      public readonly document = PolicyDocument.fromJson(cfnBucketPolicy.policyDocument);
    }(cfnBucketPolicy, id, {
      bucket,
    });
    // mark the Bucket as having this Policy
    bucket.policy = ret;
    return ret;
  }

  /**
   * A policy document containing permissions to add to the specified bucket.
   * For more information, see Access Policy Language Overview in the Amazon
   * Simple Storage Service Developer Guide.
   */
  public readonly document = new PolicyDocument();

  /** The Bucket this Policy applies to. */
  public readonly bucket: IBucket;

  private resource: CfnBucketPolicy;

  constructor(scope: Construct, id: string, props: BucketPolicyProps) {
    super(scope, id);

    this.bucket = props.bucket;

    this.resource = new CfnBucketPolicy(this, 'Resource', {
      bucket: this.bucket.bucketName,
      policyDocument: this.document,
    });

    if (props.removalPolicy) {
      this.resource.applyRemovalPolicy(props.removalPolicy);
    }
  }

  /**
   * Sets the removal policy for the BucketPolicy.
   * @param removalPolicy the RemovalPolicy to set.
   */
  public applyRemovalPolicy(removalPolicy: RemovalPolicy) {
    this.resource.applyRemovalPolicy(removalPolicy);
  }
}
