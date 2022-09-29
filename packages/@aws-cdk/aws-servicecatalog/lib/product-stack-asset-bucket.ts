import { Bucket, BucketProps } from '@aws-cdk/aws-s3';
import { BucketDeployment, ISource, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';

/**
 * Product stack asset bucket props.
 */
export interface ProductStackAssetBucketProps extends BucketProps {
}

/**
 * A Service Catalog product stack asset bucket, which is similar in form to an Amazon S3 bucket.
 * You can store multiple product stack assets and collectively deploy them to S3.
 */
export class ProductStackAssetBucket extends Bucket {
  private readonly assets: ISource[];

  constructor(scope: Construct, id: string, props: ProductStackAssetBucketProps = {}) {
    super(scope, id, props);

    if (props.bucketName == undefined) {
      throw new Error('BucketName must be defined for assetBucket');
    }

    this.assets = [];

    cdk.Aspects.of(this).add({
      visit(c: IConstruct) {
        if (c instanceof ProductStackAssetBucket) {
          c.deployAssets();
        };
      },
    });
  }

  /**
   * Asset are prepared for bulk deployment to S3.
   * @internal
   */
  public _addAsset(asset: cdk.FileAssetSource): void {
    const assetPath = './cdk.out/' + asset.fileName;
    this.assets.push(Source.asset(assetPath));
  }

  /**
   * Deploy all assets to S3.
   */
  private deployAssets() {
    if (this.assets.length > 0) {
      new BucketDeployment(this, 'AssetsBucketDeployment', {
        sources: this.assets,
        destinationBucket: this,
        extract: false,
        prune: false,
      });
    }
  }
}