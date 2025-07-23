import { IConstruct } from 'constructs';
import { BucketProps } from './bucket';
import { Mixin } from './mixin';
import { CfnBucket } from './s3.generated';
import { Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

export interface ICfnBucket extends IConstruct {
  readonly attrArn: string;
  readonly attrBucketName: string;
}

/**
 * An S3 bucket with associated policy objects
 *
 * This bucket does not yet have all features that exposed by the underlying
 * BucketResource.
 *
 * @example
 * import { RemovalPolicy } from 'aws-cdk-lib';
 *
 * new s3.Bucket(scope, 'Bucket', {
 *   blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
 *   encryption: s3.BucketEncryption.S3_MANAGED,
 *   enforceSSL: true,
 *   versioned: true,
 *   removalPolicy: RemovalPolicy.RETAIN,
 * });
 *
 */
@propertyInjectable
export class Bucket extends Resource implements ICfnBucket {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-s3.Bucket';

  public readonly cfn: CfnBucket;
  public readonly attrArn: string;
  public readonly attrBucketName: string;

  public constructor(scope: IConstruct, id: string, props: BucketProps = {}) {
    super(scope, id);
    // @todo physical name

    addConstructMetadata(this, props);

    this.cfn = new CfnBucket(this, 'Resource');
    this.attrArn = this.cfn.attrArn;
    this.attrBucketName = this.cfn.ref;

    const mixins: Mixin<CfnBucket, any>[] = [];
    this.with(...mixins);
  }

  private with(...mixins: Mixin<CfnBucket, any>[]): this {
    for (const mixin of mixins) {
      mixin.apply(this.cfn);
    }
    return this;
  }
}
