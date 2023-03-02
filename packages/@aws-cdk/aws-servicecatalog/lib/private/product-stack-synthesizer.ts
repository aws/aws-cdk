import * as path from 'path';
import { CfnBucket, IBucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import { ProductStack } from '../product-stack';

/**
 * Deployment environment for an AWS Service Catalog product stack.
 *
 * Interoperates with the StackSynthesizer of the parent stack.
 */
export class ProductStackSynthesizer extends cdk.StackSynthesizer {
  private readonly assetBucket?: IBucket;
  private bucketDeployment?: BucketDeployment;

  constructor(assetBucket?: IBucket) {
    super();
    this.assetBucket = assetBucket;
  }

  public addFileAsset(asset: cdk.FileAssetSource): cdk.FileAssetLocation {
    if (!this.assetBucket) {
      throw new Error('An Asset Bucket must be provided to use Assets');
    }
    const outdir = cdk.App.of(this.boundStack)?.outdir ?? 'cdk.out';
    const assetPath = `${outdir}/${asset.fileName}`;
    if (!this.bucketDeployment) {
      const parentStack = (this.boundStack as ProductStack)._getParentStack();
      if (!cdk.Resource.isOwnedResource(this.assetBucket)) {
        cdk.Annotations.of(parentStack).addWarning('[WARNING] Bucket Policy Permissions cannot be added to' +
          ' referenced Bucket. Please make sure your bucket has the correct permissions');
      }
      this.bucketDeployment = new BucketDeployment(parentStack, 'AssetsBucketDeployment', {
        sources: [Source.asset(assetPath)],
        destinationBucket: this.assetBucket,
        extract: false,
        prune: false,
      });
    } else {
      this.bucketDeployment.addSource(Source.asset(assetPath));
    }

    const physicalName = this.physicalNameOfBucket(this.assetBucket);

    const bucketName = physicalName;
    if (!asset.fileName) {
      throw new Error('Asset file name is undefined');
    }
    const assetFileBaseName = path.basename(asset.fileName);
    const s3Filename = assetFileBaseName.split('.')[1] + '.zip';
    const objectKey = `${s3Filename}`;
    const s3ObjectUrl = `s3://${bucketName}/${objectKey}`;
    const httpUrl = `https://s3.${bucketName}/${objectKey}`;

    return { bucketName, objectKey, httpUrl, s3ObjectUrl, s3Url: httpUrl };
  }

  private physicalNameOfBucket(bucket: IBucket) {
    let resolvedName;
    if (cdk.Resource.isOwnedResource(bucket)) {
      resolvedName = cdk.Stack.of(bucket).resolve((bucket.node.defaultChild as CfnBucket).bucketName);
    } else {
      resolvedName = bucket.bucketName;
    }
    if (resolvedName === undefined) {
      throw new Error('A bucketName must be provided to use Assets');
    }
    return resolvedName;
  }

  public addDockerImageAsset(_asset: cdk.DockerImageAssetSource): cdk.DockerImageAssetLocation {
    throw new Error('Service Catalog Product Stacks cannot use Assets');
  }

  public synthesize(session: cdk.ISynthesisSession): void {
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of its parent instead.
    this.synthesizeTemplate(session);
  }
}
