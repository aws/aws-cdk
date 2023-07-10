import * as path from 'path';
import { CfnBucket, IBucket, Bucket } from '../../../aws-s3';
import { BucketDeployment, ISource, Source } from '../../../aws-s3-deployment';
import * as cdk from '../../../core';
import { ProductStack } from '../product-stack';

/**
 * Deployment environment for an AWS Service Catalog product stack.
 *
 * Interoperates with the StackSynthesizer of the parent stack.
 */
export class ProductStackSynthesizer extends cdk.StackSynthesizer {
  private parentAssetBucket?: IBucket;
  private sources: ISource[] = [];

  constructor(private readonly parentDeployment: cdk.IStackSynthesizer, private readonly assetBucket?: IBucket) {
    super();
  }

  public addFileAsset(asset: cdk.FileAssetSource): cdk.FileAssetLocation {
    if (!this.assetBucket) {
      throw new Error('An Asset Bucket must be provided to use Assets');
    }

    let source: ISource;
    let objectKey: string;
    if (asset.isTemplateFile) {
      const location = this.parentDeployment.addFileAsset(asset);
      if (!this.parentAssetBucket) {
        this.parentAssetBucket = Bucket.fromBucketName(this.boundStack, 'ParentAssetBucket', location.bucketName);
      }
      objectKey = location.objectKey;
      source = Source.bucket(this.parentAssetBucket, location.objectKey);
    } else {
      const outdir = cdk.App.of(this.boundStack)?.outdir ?? 'cdk.out';
      const assetPath = `${outdir}/${asset.fileName}`;
      if (!asset.fileName) {
        throw new Error('Asset file name is undefined');
      }
      const assetFileBaseName = path.basename(asset.fileName);
      const s3Filename = assetFileBaseName.split('.')[1] + '.zip';
      objectKey = `${s3Filename}`;
      source = Source.asset(assetPath);
    }
    this.sources.push(source);

    const bucketName = this.physicalNameOfBucket(this.assetBucket);
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

  private createDeploymentBucket() {
    if (!this.assetBucket) {
      throw new Error('An Asset Bucket must be provided to use Assets');
    }
    const parentStack = (this.boundStack as ProductStack)._getParentStack();
    if (!cdk.Resource.isOwnedResource(this.assetBucket)) {
      cdk.Annotations.of(parentStack).addWarning('[WARNING] Bucket Policy Permissions cannot be added to' +
        ' referenced Bucket. Please make sure your bucket has the correct permissions');
    }
    new BucketDeployment(parentStack, 'AssetsBucketDeployment', {
      sources: this.sources,
      destinationBucket: this.assetBucket,
      extract: false,
      prune: false,
    });
  }

  public addDockerImageAsset(_asset: cdk.DockerImageAssetSource): cdk.DockerImageAssetLocation {
    throw new Error('Service Catalog Product Stacks cannot use Assets');
  }

  public synthesize(session: cdk.ISynthesisSession): void {
    if (this.sources.length > 0) {
      this.createDeploymentBucket();
    }
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of its parent instead.
    this.synthesizeTemplate(session);
  }
}
