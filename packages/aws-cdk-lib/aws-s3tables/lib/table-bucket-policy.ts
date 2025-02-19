import { Construct } from 'constructs';
import { CfnTableBucketPolicy } from './s3tables.generated';
import { TableBucket } from './table-bucket';
import * as iam from '../../aws-iam';
import { PolicyDocument } from '../../aws-iam';
import { Resource, ValidationError } from '../../core';

type TableBucketPolicyPropsWithArn = {
  tableBucketArn: string;
  tableBucket?: never;
  resourcePolicy?: iam.Policy;
};

type TableBucketPolicyPropsWithBucket = {
  tableBucketArn?: never;
  tableBucket: TableBucket;
  resourcePolicy?: iam.Policy;
};

/**
 * Parameters for constructing a TableBucketPolicy
 *
 * This supports two options:
 * 1. tableBucketArn along with the IAM Policy
 * 2. TableBucket entity along with the IAM Policy
 */
export type TableBucketPolicyProps =
  | TableBucketPolicyPropsWithArn
  | TableBucketPolicyPropsWithBucket;

function isArnProps(props: TableBucketPolicyProps): boolean {
  return 'tableBucketArn' in props;
}

/**
 * A Bucket Policy for S3 TableBuckets.
 *
 * You will almost never need to use this construct directly.
 * Instead, TableBucket.addToResourcePolicy can be used to add more policies to your bucket directly
 */
export class TableBucketPolicy extends Resource {
  public readonly policy: CfnTableBucketPolicy;
  /**
   * A policy document containing permissions to add to the specified table bucket.
   */
  public readonly document = new PolicyDocument();

  constructor(scope: Construct, id: string, props: TableBucketPolicyProps) {
    super(scope, id);
    let tableBucketArn;
    if (isArnProps(props)) {
      tableBucketArn = props.tableBucketArn;
    } else {
      tableBucketArn = props.tableBucket?._resource.attrTableBucketArn;
    }

    if (!tableBucketArn) {
      throw new ValidationError('Expected either tableBucketArn or tableBucket entity to be provided', this);
    }

    if (props.resourcePolicy?.document) {
      this.document = props.resourcePolicy.document;
    }

    this.policy = new CfnTableBucketPolicy(this, id, {
      tableBucketArn,
      resourcePolicy: this.document,
    });
  }
}
