import { BlockPublicAccess, BucketEncryption, IBucket } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { ProductStack } from '../product-stack';
import { ProductStackAssetBucket } from '../product-stack-asset-bucket';
import { hashValues } from './util';

/**
 * Deployment environment for an AWS Service Catalog product stack.
 *
 * Interoperates with the StackSynthesizer of the parent stack.
 */
export class ProductStackSynthesizer extends cdk.StackSynthesizer {
  private stack?: cdk.Stack;
  private assetBucket?: IBucket;

  constructor(assetBucket?: IBucket) {
    super();
    this.assetBucket = assetBucket;
  }

  public bind(stack: cdk.Stack): void {
    if (this.stack !== undefined) {
      throw new Error('A Stack Synthesizer can only be bound once, create a new instance to use with a different Stack');
    }
    this.stack = stack;
  }

  public addFileAsset(asset: cdk.FileAssetSource): cdk.FileAssetLocation {
    if (!this.stack) {
      throw new Error('You must call bindStack() first');
    }

    if (!this.assetBucket) {
      const parentStack = (this.stack as ProductStack)._getParentStack();
      this.assetBucket = new ProductStackAssetBucket(parentStack, `ProductStackAssetBucket${hashValues(this.stack.stackName)}`, {
        bucketName: (this.stack as ProductStack)._generateBucketName(),
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        encryption: BucketEncryption.KMS,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      });
    }

    (this.stack as ProductStack)._setAssetBucket(this.assetBucket);
    (this.assetBucket as ProductStackAssetBucket)._addAsset(asset);

    const bucketName = this.assetBucket.bucketName;
    const s3Filename = asset.fileName?.split('.')[1] + '.zip';
    const objectKey = `${s3Filename}`;
    const s3ObjectUrl = `s3://${bucketName}/${objectKey}`;
    const httpUrl = `https://s3.${bucketName}/${objectKey}`;

    return { bucketName, objectKey, httpUrl, s3ObjectUrl, s3Url: httpUrl };
  }

  public addDockerImageAsset(_asset: cdk.DockerImageAssetSource): cdk.DockerImageAssetLocation {
    throw new Error('Service Catalog Product Stacks cannot use Assets');
  }

  public synthesize(session: cdk.ISynthesisSession): void {
    if (!this.stack) {
      throw new Error('You must call bindStack() first');
    }
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of its parent instead.
    this.synthesizeStackTemplate(this.stack, session);
  }
}
