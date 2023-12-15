import { CfnBucket, IBucket, Bucket, ICfnBucket } from '../../../aws-s3';
import { BucketDeployment, ServerSideEncryption, Source } from '../../../aws-s3-deployment';
import * as cdk from '../../../core';

/**
 * Product stack synthesizer props.
 */
export interface ProductStackSynthesizerProps {
  /**
   * The parent stack of the stack that this synthesizer is bound to.
   */
  readonly parentStack: cdk.Stack;

  /**
   * The bucket used to store assets and enable ProductStack asset support.
   *
   * @default - No bucket provided and assets will not be supported
   */
  readonly assetBucket?: ICfnBucket;

  /**
   * A ServerSideEncryption can be enabled to encrypt assets that are put into assetBucket.
   *
   * @default - No encryption is used
   */
  readonly serverSideEncryption? : ServerSideEncryption;

  /**
   * For AWS_KMS ServerSideEncryption a KMS KeyId must be provided which will be used to encrypt assets.
   *
   * @default - No KMS KeyId and SSE_KMS encryption cannot be used
   */
  readonly serverSideEncryptionAwsKmsKeyId? : string;
}

/**
 * Deployment environment for an AWS Service Catalog product stack.
 *
 * Interoperates with the StackSynthesizer of the parent stack.
 */
export class ProductStackSynthesizer extends cdk.StackSynthesizer {
  private readonly parentStack: cdk.Stack;
  private readonly assetBucket?: IBucket;
  private readonly serverSideEncryption? : ServerSideEncryption;
  private readonly serverSideEncryptionAwsKmsKeyId? : string;
  private parentAssetBucket?: IBucket;

  constructor(props: ProductStackSynthesizerProps) {
    super();
    this.parentStack = props.parentStack;
    this.assetBucket = props.assetBucket ? Bucket.fromCfnBucket(props.assetBucket) : undefined;
    this.serverSideEncryption = props.serverSideEncryption;
    this.serverSideEncryptionAwsKmsKeyId = props.serverSideEncryptionAwsKmsKeyId;

    if (this.assetBucket && !cdk.Resource.isOwnedResource(this.assetBucket)) {
      cdk.Annotations.of(this.parentStack).addWarningV2('@aws-cdk/aws-servicecatalog:assetsManuallyAddBucketPermissions', '[WARNING] Bucket Policy Permissions cannot be added to' +
        ' referenced Bucket. Please make sure your bucket has the correct permissions');
    }
  }

  public addFileAsset(asset: cdk.FileAssetSource): cdk.FileAssetLocation {
    if (!this.assetBucket) {
      throw new Error('An Asset Bucket must be provided to use Assets');
    }

    // This assumes all assets added to the parent stack's synthesizer go into the same bucket.
    const location = this.parentStack.synthesizer.addFileAsset(asset);
    if (!this.parentAssetBucket) {
      this.parentAssetBucket = Bucket.fromBucketName(this.boundStack, 'ParentAssetBucket', location.bucketName);
    }
    const objectKey = location.objectKey;
    const source = Source.bucket(this.parentAssetBucket, location.objectKey);

    if (this.serverSideEncryption === ServerSideEncryption.AWS_KMS && !this.serverSideEncryptionAwsKmsKeyId) {
      throw new Error('A KMS Key must be provided to use SSE_KMS');
    }
    if (this.serverSideEncryption !== ServerSideEncryption.AWS_KMS && this.serverSideEncryptionAwsKmsKeyId) {
      throw new Error('A SSE_KMS encryption must be enabled if you provide KMS Key');
    }

    // Multiple Products deploying into the same bucket will use the same 'BucketDeployment' construct.
    const deploymentScope = this.assetBucket;
    const deploymentCid = 'ProductAssetsDeployment';
    const bucketDeployment = deploymentScope.node.tryFindChild(deploymentCid) as BucketDeployment | undefined
      ?? new BucketDeployment(deploymentScope, deploymentCid, {
        sources: [source],
        destinationBucket: this.assetBucket,
        extract: false,
        prune: false,
        retainOnDelete: true,
        serverSideEncryption: this.serverSideEncryption,
        serverSideEncryptionAwsKmsKeyId: this.serverSideEncryptionAwsKmsKeyId,
      });
    bucketDeployment.addSource(source);

    const bucketName = this.physicalNameOfBucket(this.assetBucket);
    if (!asset.fileName) {
      throw new Error('Asset file name is undefined');
    }
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
