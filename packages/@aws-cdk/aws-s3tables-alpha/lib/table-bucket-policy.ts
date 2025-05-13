import { Construct } from 'constructs';
import { CfnTableBucketPolicy } from 'aws-cdk-lib/aws-s3tables';
import * as iam from 'aws-cdk-lib/aws-iam';
import { RemovalPolicy, Resource } from 'aws-cdk-lib/core';
import { ITableBucket } from './table-bucket';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';

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
  /**
   * Policy to apply when the policy is removed from this stack.
   *
   * @default - RemovalPolicy.DESTROY.
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * A Bucket Policy for S3 TableBuckets.
 *
 * You will almost never need to use this construct directly.
 * Instead, TableBucket.addToResourcePolicy can be used to add more policies to your bucket directly
 */
@propertyInjectable
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
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Use default policy if not provided with props
    this.document = props.resourcePolicy || new iam.PolicyDocument({});

    this._resource = new CfnTableBucketPolicy(this, id, {
      tableBucketArn: props.tableBucket.tableBucketArn,
      resourcePolicy: this.document,
    });

    if (props.removalPolicy) {
      this._resource.applyRemovalPolicy(props.removalPolicy);
    }
  }

  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-s3tables-alpha.TableBucketPolicy';
}
