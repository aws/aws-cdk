import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnVectorBucketPolicy } from 'aws-cdk-lib/aws-s3vectors';
import type { RemovalPolicy } from 'aws-cdk-lib/core';
import { Resource } from 'aws-cdk-lib/core';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { IVectorBucket } from './vector-bucket';

/**
 * Parameters for constructing a VectorBucketPolicy.
 */
export interface VectorBucketPolicyProps {
  /**
   * The associated vector bucket.
   */
  readonly vectorBucket: IVectorBucket;

  /**
   * The policy document for the bucket's resource policy.
   * @default - An empty iam.PolicyDocument will be initialized.
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
 * A Bucket Policy for S3 VectorBuckets.
 *
 * You will almost never need to use this construct directly. Instead,
 * `VectorBucket.addToResourcePolicy` can be used to add more policies to
 * your bucket directly.
 */
@propertyInjectable
export class VectorBucketPolicy extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-s3vectors-alpha.VectorBucketPolicy';

  /**
   * The IAM PolicyDocument containing permissions represented by this policy.
   */
  public readonly document: iam.PolicyDocument;

  /**
   * @internal The underlying policy resource.
   */
  private readonly _resource: CfnVectorBucketPolicy;

  constructor(scope: Construct, id: string, props: VectorBucketPolicyProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.document = props.resourcePolicy || new iam.PolicyDocument({});

    this._resource = new CfnVectorBucketPolicy(this, 'Resource', {
      vectorBucketArn: props.vectorBucket.vectorBucketArn,
      policy: this.document,
    });

    if (props.removalPolicy) {
      this._resource.applyRemovalPolicy(props.removalPolicy);
    }
  }
}
