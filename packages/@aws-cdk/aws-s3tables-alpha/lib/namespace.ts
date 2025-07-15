import { Construct } from 'constructs';
import { RemovalPolicy, Resource } from 'aws-cdk-lib/core';
import { ITableBucket } from './table-bucket';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { CfnNamespace } from 'aws-cdk-lib/aws-s3tables';

/**
 * Parameters for constructing a TableBucketPolicy
 */
export interface NamespaceProps {
  /**
   * A name for the namespace
   */
  readonly namespaceName: string;
  /**
   * The table bucket this namespace belongs to.
   */
  readonly tableBucket: ITableBucket;
  /**
   * Policy to apply when the policy is removed from this stack.
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * An S3 Tables Namespace with helpers.
 *
 */
export class Namespace extends Resource {
  /**
   * @internal The underlying policy resource.
   */
  private readonly _resource: CfnNamespace;

  constructor(scope: Construct, id: string, props: NamespaceProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this._resource = new CfnNamespace(this, id, {
      namespace: props.namespaceName,
      tableBucketArn: props.tableBucket.tableBucketArn,
    });

    if (props.removalPolicy) {
      this._resource.applyRemovalPolicy(props.removalPolicy);
    }
  }
}
