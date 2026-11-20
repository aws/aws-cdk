import type { CfnBucket, IBucket } from '../../../aws-s3';
import { Bucket } from '../../../aws-s3';
import { BucketDeployment, ServerSideEncryption, Source } from '../../../aws-s3-deployment';
import * as cdk from '../../../core';
import { UnscopedValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';

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
  readonly assetBucket?: IBucket;

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

  /**
   * The amount of memory (in MiB) to allocate to the AWS Lambda function which
   * replicates the files from the CDK bucket to the destination bucket.
   *
   * If you are deploying large files, you will need to increase this number
   * accordingly.
   *
   * @default 128
   */
  readonly memoryLimit?: number;
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
  private readonly memoryLimit?: number;
  private parentAssetBucket?: IBucket;

  constructor(props: ProductStackSynthesizerProps) {
    super();
    this.parentStack = props.parentStack;
    this.assetBucket = props.assetBucket;
    this.serverSideEncryption = props.serverSideEncryption;
    this.serverSideEncryptionAwsKmsKeyId = props.serverSideEncryptionAwsKmsKeyId;
    this.memoryLimit = props.memoryLimit;

    if (this.assetBucket && !cdk.Resource.isOwnedResource(this.assetBucket)) {
      cdk.Annotations.of(this.parentStack).addWarningV2('@aws-cdk/aws-servicecatalog:assetsManuallyAddBucketPermissions', '[WARNING] Bucket Policy Permissions cannot be added to' +
        ' referenced Bucket. Please make sure your bucket has the correct permissions');
    }
  }

  public addFileAsset(asset: cdk.FileAssetSource): cdk.FileAssetLocation {
    if (!this.assetBucket) {
      throw new UnscopedValidationError(lit`AssetBucketRequired`, 'An Asset Bucket must be provided to use Assets');
    }

    // Register the asset on the stack that owns the asset bucket, because that is where the
    // 'ProductAssetsDeployment' copying it lives. That way the asset is published before the
    // deployment runs, even if the asset bucket is in a different stack than the parent stack.
    // This assumes all assets added to that stack's synthesizer go into the same bucket.
    const location = cdk.Stack.of(this.assetBucket).synthesizer.addFileAsset(asset);
    if (!this.parentAssetBucket) {
      this.parentAssetBucket = Bucket.fromBucketName(this.boundStack, 'ParentAssetBucket', location.bucketName);
    }
    const objectKey = location.objectKey;
    const source = Source.bucket(this.parentAssetBucket, location.objectKey);

    if (this.serverSideEncryption === ServerSideEncryption.AWS_KMS && !this.serverSideEncryptionAwsKmsKeyId) {
      throw new UnscopedValidationError(lit`KmsKeyRequiredForSseKms`, 'A KMS Key must be provided to use SSE_KMS');
    }
    if (this.serverSideEncryption !== ServerSideEncryption.AWS_KMS && this.serverSideEncryptionAwsKmsKeyId) {
      throw new UnscopedValidationError(lit`SseKmsRequiredForKmsKey`, 'A SSE_KMS encryption must be enabled if you provide KMS Key');
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
        memoryLimit: this.memoryLimit,
        outputObjectKeys: false,
      });
    bucketDeployment.addSource(source);

    const bucketName = this.physicalNameOfBucket(this.assetBucket);
    if (!asset.fileName) {
      throw new UnscopedValidationError(lit`AssetFileNameRequired`, 'Asset file name is undefined');
    }
    const s3ObjectUrl = `s3://${bucketName}/${objectKey}`;
    const httpUrl = `https://s3.${bucketName}/${objectKey}`;

    return { bucketName, objectKey, httpUrl, s3ObjectUrl, s3Url: httpUrl };
  }

  /**
   * Return the configured physical name of the bucket.
   *
   * We do this to simplify referencing the assets from INSIDE the ProductStack when
   * that eventually gets deployed; we don't know what account it will be deployed into,
   * so publishing a generated name will become tricky: Exports? SSM? Only in the same
   * account. And we don't really have another mechanism.
   *
   * Solution: we force the user to have specified a known physical name for the bucket and use that.
   * This is not allowed to have any tokens in it (technically speaking we could
   * allow specifically `${AWS::Partition}` and `${AWS::Region}`, but we just don't for the moment).
   */
  private physicalNameOfBucket(bucket: IBucket) {
    const candidateName = cdk.Resource.isOwnedResource(bucket)
      // This is an `s3.Bucket`, grab the configured name of the underlying CfnBucket resource.
      ? (bucket.node.defaultChild as CfnBucket).bucketName
      : bucket.bucketName;

    // For `s3.Bucket`, `cfnBucket.bucketName` attribute starts out as a Token that may eventually
    // turn into a concrete physical name or remain `undefined`. To be able to
    // tell the difference, we need to resolve it first.
    const resolvedName = cdk.Stack.of(bucket).resolve(candidateName);
    if (resolvedName === undefined) {
      throw new cdk.ValidationError(lit`BucketNameRequiredForAssets`, 'A ProductStack\'s assetBucket must have a physical name', bucket);
    }
    // `resolve()` will produce a non-string expression if there were tokens in the original string
    // This is the simplest way to disallow this for now.
    if (typeof resolvedName !== 'string') {
      throw new cdk.ValidationError(lit`ProductStackBucketNameError`, `The ProductStack\'s assetBucket may not have Tokens in its physical name (got '${candidateName}')`, bucket);
    }

    return resolvedName;
  }

  public addDockerImageAsset(_asset: cdk.DockerImageAssetSource): cdk.DockerImageAssetLocation {
    throw new UnscopedValidationError(lit`DockerAssetsNotSupported`, 'Service Catalog Product Stacks cannot use Assets');
  }

  public synthesize(session: cdk.ISynthesisSession): void {
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of its parent instead.
    this.synthesizeTemplate(session);
  }
}
