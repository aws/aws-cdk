import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as cr from 'aws-cdk-lib/custom-resources';
import type { Construct } from 'constructs';

/**
 * The S3 location of the source code for a web function revision
 */
export interface WebFunctionCodeConfig {
  /**
   * The S3 bucket name
   */
  readonly bucket: string;

  /**
   * The S3 object key
   */
  readonly key: string;

  /**
   * The S3 object version ID
   *
   * @default - the latest version
   */
  readonly versionId?: string;
}

/**
 * Source code for a Web Function
 */
export abstract class WebFunctionCode {
  /**
   * Uploads a local directory and deploys it as the web function code.
   *
   * The directory is first staged as a CDK asset. The Web Functions service cannot read assets in the
   * CDK bootstrap bucket, so the construct copies the asset into a versioned bucket that the service can
   * read. The bucket is shared by the web functions of the stack.
   *
   * This is a workaround. The bootstrap bucket policy should grant the service read access, which removes
   * the need for the copy. Until bootstrap supports this, the construct creates the bucket, the copy
   * function and the custom resource, and keeps them in the stack.
   *
   * @param path the directory containing the application source
   * @param options asset options
   */
  public static fromAsset(path: string, options?: s3assets.AssetOptions): WebFunctionCode {
    return new AssetWebFunctionCode(path, options);
  }

  /**
   * Uploads a local directory and copies it into a bucket that the caller provides.
   *
   * The bucket must have versioning enabled. The construct adds a bucket policy statement that lets
   * `lambda.amazonaws.com` read (`s3:GetObject` and `s3:GetObjectVersion`) the revisions of the web function,
   * scoped to the owning account. For a bucket defined in this app, versioning and encryption are validated
   * at synth time.
   *
   * @param bucket the bucket that receives the copy of the asset
   * @param path the directory containing the application source
   * @param options asset options
   */
  public static fromAssetToProvidedBucket(bucket: s3.IBucket, path: string, options?: s3assets.AssetOptions): WebFunctionCode {
    return new AssetWebFunctionCode(path, options, bucket);
  }

  /**
   * Uses an existing S3 object as the web function code.
   *
   * The bucket must have versioning enabled, and the Web Functions service must be able to
   * read the object (`s3:GetObject` and `s3:GetObjectVersion` for `lambda.amazonaws.com`).
   * For a bucket defined in this app, versioning and encryption are validated at synth time.
   * Encryption with the AWS managed key (`BucketEncryption.KMS_MANAGED` or
   * `BucketEncryption.DSSE_MANAGED`) is not supported, because its key policy cannot grant the
   * service access. SSE-S3 and a customer managed key both work.
   *
   * @param bucket the bucket containing the code archive
   * @param key the object key of the code archive
   * @param versionId the object version ID of the code archive
   */
  public static fromBucket(bucket: s3.IBucket, key: string, versionId?: string): WebFunctionCode {
    return new BucketWebFunctionCode(bucket, key, versionId);
  }

  /**
   * Returns the S3 location of the code, creating any required resources in the given scope.
   *
   * @param scope the construct that owns the code resources
   * @param webFunctionArn the ARN of the web function that reads the code
   */
  public abstract bind(scope: Construct, webFunctionArn: string): WebFunctionCodeConfig;
}

const SHARED_BUCKET_ID = 'WebFunctionCodeBucket';
const SHARED_COPY_HANDLER_ID = 'WebFunctionCodeCopyHandler';
const SHARED_COPY_PROVIDER_ID = 'WebFunctionCodeCopyProvider';

class AssetWebFunctionCode extends WebFunctionCode {
  constructor(
    private readonly path: string,
    private readonly options?: s3assets.AssetOptions,
    private readonly providedBucket?: s3.IBucket,
  ) {
    super();
  }

  public bind(scope: Construct, webFunctionArn: string): WebFunctionCodeConfig {
    const asset = new s3assets.Asset(scope, 'Code', { path: this.path, ...this.options });

    let bucket: s3.IBucket;
    if (this.providedBucket) {
      bucket = this.providedBucket;
      scope.node.addValidation({ validate: () => validateCodeBucket(bucket) });
    } else {
      bucket = sharedCodeBucket(scope);
    }
    // The service reads the code of this function's revisions only
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
      actions: ['s3:GetObject', 's3:GetObjectVersion'],
      resources: [bucket.arnForObjects('*')],
      conditions: {
        StringEquals: { 'aws:SourceAccount': cdk.Stack.of(scope).account },
        ArnLike: { 'aws:SourceArn': `${webFunctionArn}/revision/*` },
      },
    }));

    // Copies the asset into the bucket and returns the version ID of the copy
    const copier = copyHandler(scope);
    asset.grantRead(copier);
    bucket.grantPut(copier);

    const copy = new cdk.CustomResource(scope, 'CodeCopy', {
      serviceToken: copyProvider(scope).serviceToken,
      properties: {
        SourceBucket: asset.s3BucketName,
        SourceKey: asset.s3ObjectKey,
        DestinationBucket: bucket.bucketName,
        DestinationKey: asset.s3ObjectKey,
      },
    });
    copy.node.addDependency(bucket);

    return {
      bucket: bucket.bucketName,
      key: asset.s3ObjectKey,
      versionId: copy.getAttString('VersionId'),
    };
  }
}

class BucketWebFunctionCode extends WebFunctionCode {
  constructor(private readonly bucket: s3.IBucket, private readonly key: string, private readonly versionId?: string) {
    super();
  }

  public bind(scope: Construct, _webFunctionArn: string): WebFunctionCodeConfig {
    // Only buckets defined in this app can be inspected; imported buckets are not validated
    if (cdk.Resource.isOwnedResource(this.bucket)) {
      scope.node.addValidation({
        validate: () => validateCodeBucket(this.bucket),
      });
    }
    return { bucket: this.bucket.bucketName, key: this.key, versionId: this.versionId };
  }
}

/**
 * The versioned, private bucket that holds the copies of the assets of the stack. It is created once per stack.
 */
function sharedCodeBucket(scope: Construct): s3.IBucket {
  const stack = cdk.Stack.of(scope);
  const existing = stack.node.tryFindChild(SHARED_BUCKET_ID);
  if (existing) {
    return existing as s3.IBucket;
  }
  return new s3.Bucket(stack, SHARED_BUCKET_ID, {
    versioned: true,
    encryption: s3.BucketEncryption.S3_MANAGED,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    enforceSSL: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });
}

/**
 * The function that copies an asset. It is shared by the stack.
 */
function copyHandler(scope: Construct): lambda.Function {
  const stack = cdk.Stack.of(scope);
  const existing = stack.node.tryFindChild(SHARED_COPY_HANDLER_ID);
  if (existing) {
    return existing as lambda.Function;
  }
  return new lambda.Function(stack, SHARED_COPY_HANDLER_ID, {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    // Only the compiled handler goes into the asset, not the TypeScript sources next to it
    code: lambda.Code.fromAsset(join(__dirname, 'copy-asset'), { exclude: ['*.ts', '*.map'] }),
    timeout: cdk.Duration.minutes(5),
  });
}

/**
 * The provider that runs the copy function for the custom resources of the stack.
 */
function copyProvider(scope: Construct): cr.Provider {
  const stack = cdk.Stack.of(scope);
  const existing = stack.node.tryFindChild(SHARED_COPY_PROVIDER_ID);
  if (existing) {
    return existing as cr.Provider;
  }
  return new cr.Provider(stack, SHARED_COPY_PROVIDER_ID, {
    onEventHandler: copyHandler(scope),
  });
}

/**
 * Checks that a bucket used for web function code has versioning and a supported encryption
 */
function validateCodeBucket(bucket: s3.IBucket): string[] {
  // Only buckets defined in this app can be inspected
  if (!cdk.Resource.isOwnedResource(bucket)) {
    return [];
  }
  const cfn = bucket.node.defaultChild;
  if (!s3.CfnBucket.isCfnBucket(cfn)) {
    return [];
  }

  const errors: string[] = [];
  const versioning = cfn.versioningConfiguration as s3.CfnBucket.VersioningConfigurationProperty | undefined;
  if (versioning?.status !== 'Enabled') {
    errors.push(`bucket ${bucket.node.path} must have versioning enabled to hold web function code`);
  }

  const encryption = cfn.bucketEncryption as s3.CfnBucket.BucketEncryptionProperty | undefined;
  const rules = encryption?.serverSideEncryptionConfiguration as s3.CfnBucket.ServerSideEncryptionRuleProperty[] | undefined;
  const sse = rules?.[0]?.serverSideEncryptionByDefault as s3.CfnBucket.ServerSideEncryptionByDefaultProperty | undefined;
  const managedKms = sse?.sseAlgorithm === 'aws:kms:dsse' || (sse?.sseAlgorithm === 'aws:kms' && sse.kmsMasterKeyId === undefined);
  if (managedKms) {
    errors.push(`bucket ${bucket.node.path} must not use the AWS managed KMS key (BucketEncryption.KMS_MANAGED or DSSE_MANAGED); use SSE-S3 or a customer managed key`);
  }

  return errors;
}
