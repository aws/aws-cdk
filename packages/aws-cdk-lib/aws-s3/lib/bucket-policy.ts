import { Construct } from 'constructs';
import { Bucket, IBucket } from './bucket';
import { CfnBucket, CfnBucketPolicy } from './s3.generated';
import { PolicyDocument } from '../../aws-iam';
import { RemovalPolicy, Resource, Token, Tokenization } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { CfnReference } from '../../core/lib/private/cfn-reference';

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
 * The bucket policy method is implemented differently than `addToResourcePolicy()`
 * as `BucketPolicy()` creates a new policy without knowing one earlier existed.
 * e.g. if during Bucket creation, if `autoDeleteObject:true`, these policies are
 * added to the bucket policy:
 *    ["s3:DeleteObject*", "s3:GetBucket*", "s3:List*", "s3:PutBucketPolicy"],
 * and when you add a new BucketPolicy with ["s3:GetObject", "s3:ListBucket"] on
 * this existing bucket, invoking `BucketPolicy()` will create a new Policy
 * without knowing one earlier exists already, so it creates a new one.
 * In this case, the custom resource handler will not have access to
 * `s3:GetBucketTagging` action which will cause failure during deletion of stack.
 *
 * Hence its strongly recommended to use `addToResourcePolicy()` method to add
 * new permissions to existing policy.
 *
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
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

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
  @MethodMetadata()
  public applyRemovalPolicy(removalPolicy: RemovalPolicy) {
    this.resource.applyRemovalPolicy(removalPolicy);
  }
}
