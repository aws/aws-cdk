import { PolicyDocument } from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/cdk';
import { BucketRef } from './bucket';
import { CfnBucketPolicy } from './s3.generated';

export interface BucketPolicyProps {
  /**
   * The Amazon S3 bucket that the policy applies to.
   */
  bucket: BucketRef;
}

/**
 * Applies an Amazon S3 bucket policy to an Amazon S3 bucket.
 */
export class BucketPolicy extends Construct {

  /**
   * A policy document containing permissions to add to the specified bucket.
   * For more information, see Access Policy Language Overview in the Amazon
   * Simple Storage Service Developer Guide.
   */
  public readonly document = new PolicyDocument();

  constructor(parent: Construct, name: string, props: BucketPolicyProps) {
    super(parent, name);

    if (!props.bucket.bucketName) {
      throw new Error('Bucket doesn\'t have a bucketName defined');
    }

    new CfnBucketPolicy(this, 'Resource', {
      bucket: props.bucket.bucketName,
      policyDocument: this.document,
    });
  }
}
