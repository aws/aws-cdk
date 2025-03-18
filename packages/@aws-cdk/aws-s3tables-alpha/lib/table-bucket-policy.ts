import { Construct } from 'constructs';
import { CfnTableBucketPolicy } from 'aws-cdk-lib/aws-s3tables';
import * as iam from 'aws-cdk-lib/aws-iam';
import { PhysicalName, Resource } from 'aws-cdk-lib/core';
import { ITableBucket } from './table-bucket';

/**
 * Parameters for constructing a TableBucketPolicy
 */
export interface TableBucketPolicyProps {
  /**
   * The associated table bucket
   */
  readonly tableBucket: ITableBucket;
  /**
   * The policy document for the bucket's resource policy
   * @default undefined An empty iam.PolicyDocument will be initialized
   */
  readonly resourcePolicy?: iam.PolicyDocument;
}

/**
 * A Bucket Policy for S3 TableBuckets.
 *
 * You will almost never need to use this construct directly.
 * Instead, TableBucket.addToResourcePolicy can be used to add more policies to your bucket directly
 */
export class TableBucketPolicy extends Resource {
  /**
   * The IAM PolicyDocument containing permissions represented by this policy.
   */
  public readonly document: iam.PolicyDocument;
  /**
   * @internal The underlying policy resource.
   */
  private readonly _resource: CfnTableBucketPolicy;

  constructor(scope: Construct, id: string, props: TableBucketPolicyProps) {
    super(scope, id, {
      physicalName: PhysicalName.GENERATE_IF_NEEDED,
    });

    // Use default policy if not provided with props
    this.document = props.resourcePolicy || new iam.PolicyDocument({});

    this._resource = new CfnTableBucketPolicy(this, id, {
      tableBucketArn: props.tableBucket.tableBucketArn,
      resourcePolicy: this.document,
    });
  }

  /**
   * Adds a statement to the resource policy for a principal (i.e.
   * account/role/service) to perform actions on the associated table bucket and/or its
   * contents.
   *
   * @param statement the policy statement to be added to the bucket's
   * policy.
   */
  public addToResourcePolicy(statement: iam.PolicyStatement) {
    this.document.addStatements(statement);
    this._resource.resourcePolicy = this.document;
  }
}
