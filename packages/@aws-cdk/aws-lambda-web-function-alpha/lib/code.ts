import type * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
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
   * Uploads a local directory as an S3 asset and deploys it as the web function code.
   *
   * @param path the directory containing the application source
   * @param options asset options
   */
  public static fromAsset(path: string, options?: s3assets.AssetOptions): WebFunctionCode {
    return new AssetWebFunctionCode(path, options);
  }

  /**
   * Uses an existing S3 object as the web function code.
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
   */
  public abstract bind(scope: Construct): WebFunctionCodeConfig;
}

class AssetWebFunctionCode extends WebFunctionCode {
  constructor(private readonly path: string, private readonly options?: s3assets.AssetOptions) {
    super();
  }

  public bind(scope: Construct): WebFunctionCodeConfig {
    const asset = new s3assets.Asset(scope, 'Code', { path: this.path, ...this.options });
    return { bucket: asset.s3BucketName, key: asset.s3ObjectKey };
  }
}

class BucketWebFunctionCode extends WebFunctionCode {
  constructor(private readonly bucket: s3.IBucket, private readonly key: string, private readonly versionId?: string) {
    super();
  }

  public bind(_scope: Construct): WebFunctionCodeConfig {
    return { bucket: this.bucket.bucketName, key: this.key, versionId: this.versionId };
  }
}
