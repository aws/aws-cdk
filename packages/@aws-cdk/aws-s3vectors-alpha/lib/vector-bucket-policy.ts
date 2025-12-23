import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnVectorBucketPolicy } from 'aws-cdk-lib/aws-s3vectors';
import { RemovalPolicy, Resource } from 'aws-cdk-lib/core';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import { IVectorBucket } from './vector-bucket';

/**
 * Parameters for constructing a VectorBucketPolicy
 */
export interface VectorBucketPolicyProps {
  /**
   * The associated vector bucket
   */
  readonly vectorBucket: IVectorBucket;
  /**
   * The policy document for the vector bucket's resource policy
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
 * A Policy for S3 Vector Buckets.
 *
 * You will almost never need to use this construct directly.
 * Instead, VectorBucket.addToResourcePolicy can be used to add more policies to your vector bucket directly
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

    // Use default policy if not provided with props
    this.document = props.resourcePolicy || new iam.PolicyDocument({});

    // Use vectorBucketArn for the policy
    // Note: CloudFormation accepts either vectorBucketArn or vectorBucketName,
    // but using ARN is preferred for CDK constructs
    this._resource = new CfnVectorBucketPolicy(this, id, {
      vectorBucketArn: props.vectorBucket.vectorBucketArn,
      policy: this.document,
    });

    if (props.removalPolicy) {
      this._resource.applyRemovalPolicy(props.removalPolicy);
    }
  }
}
