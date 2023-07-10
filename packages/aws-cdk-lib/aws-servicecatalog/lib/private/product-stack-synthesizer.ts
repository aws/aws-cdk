import { CfnBucket, IBucket, Bucket } from '../../../aws-s3';
import { BucketDeployment, Source } from '../../../aws-s3-deployment';
import * as cdk from '../../../core';
import { ProductStack } from '../product-stack';

/**
 * Deployment environment for an AWS Service Catalog product stack.
 *
 * Interoperates with the StackSynthesizer of the parent stack.
 */
export class ProductStackSynthesizer extends cdk.StackSynthesizer {
  private bucketDeployment?: BucketDeployment;
  private parentAssetBucket?: IBucket;

  constructor(private readonly parentDeployment: cdk.IStackSynthesizer, private readonly assetBucket?: IBucket) {
    super();
  }

  public addFileAsset(asset: cdk.FileAssetSource): cdk.FileAssetLocation {
    if (!this.assetBucket) {
      throw new Error('An Asset Bucket must be provided to use Assets');
    }

    const location = this.parentDeployment.addFileAsset(asset);
    if (!this.parentAssetBucket) {
      this.parentAssetBucket = Bucket.fromBucketName(this.boundStack, 'ParentAssetBucket', location.bucketName);
    }
    const objectKey = location.objectKey;
    const source = Source.bucket(this.parentAssetBucket, location.objectKey);

    if (!this.bucketDeployment) {
      const parentStack = (this.boundStack as ProductStack)._getParentStack();
      if (!cdk.Resource.isOwnedResource(this.assetBucket)) {
        cdk.Annotations.of(parentStack).addWarning('[WARNING] Bucket Policy Permissions cannot be added to' +
          ' referenced Bucket. Please make sure your bucket has the correct permissions');
      }
      this.bucketDeployment = new BucketDeployment(parentStack, 'AssetsBucketDeployment', {
        sources: [source],
        destinationBucket: this.assetBucket,
        extract: false,
        prune: false,
      });
    } else {
      this.bucketDeployment.addSource(source);
    }

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

  public addDockerImageAsset(_asset: cdk.DockerImageAssetSource): cdk.DockerImageAssetLocation {
    throw new Error('Service Catalog Product Stacks cannot use Assets');
  }

  public synthesize(session: cdk.ISynthesisSession): void {
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of its parent instead.
    this.synthesizeTemplate(session);
  }
}
