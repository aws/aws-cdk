import { PolicyDocument } from '@aws-cdk/aws-iam';
import { RemovalPolicy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IBucket } from './bucket';
import { CfnBucketPolicy } from './s3.generated';

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
   * A policy document containing permissions to add to the specified bucket.
   * For more information, see Access Policy Language Overview in the Amazon
   * Simple Storage Service Developer Guide.
   */
  public readonly document = new PolicyDocument();

  private resource: CfnBucketPolicy;

  constructor(scope: Construct, id: string, props: BucketPolicyProps) {
    super(scope, id);

    if (!props.bucket.bucketName) {
      throw new Error('Bucket doesn\'t have a bucketName defined');
    }

    this.resource = new CfnBucketPolicy(this, 'Resource', {
      bucket: props.bucket.bucketName,
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
