import * as ka from '@aws-cdk/aws-kinesisanalytics';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import { Construct } from 'constructs';

/**
 * The return type of `ApplicationCode.bind`. This represents
 * CloudFormation configuration and an s3 bucket holding the Flink application
 * JAR file.
 */
export interface ApplicationCodeConfig {
  /**
   * Low-level Cloudformation ApplicationConfigurationProperty
   */
  readonly applicationCodeConfigurationProperty: ka.CfnApplicationV2.ApplicationConfigurationProperty;

  /**
   * S3 Bucket that stores the Flink application code
   */
  readonly bucket: s3.IBucket;
}

/**
 * Code configuration providing the location to a Flink application JAR file.
 */
export abstract class ApplicationCode {
  /**
   * Reference code from an S3 bucket.
   *
   * @param bucket - an s3 bucket
   * @param fileKey - a key pointing to a Flink JAR file
   * @param objectVersion - an optional version string for the provided fileKey
   */
  public static fromBucket(bucket: s3.IBucket, fileKey: string, objectVersion?: string): ApplicationCode {
    return new BucketApplicationCode({
      bucket,
      fileKey,
      objectVersion,
    });
  }

  /**
   * Reference code from a local directory containing a Flink JAR file.
   *
   * @param path - a local directory path
   * @parm options - standard s3 AssetOptions
   */
  public static fromAsset(path: string, options?: s3_assets.AssetOptions): ApplicationCode {
    return new AssetApplicationCode(path, options);
  }

  /**
   * A method to lazily bind asset resources to the parent FlinkApplication.
   */
  public abstract bind(scope: Construct): ApplicationCodeConfig;
}

interface BucketApplicationCodeProps {
  readonly bucket: s3.IBucket;
  readonly fileKey: string;
  readonly objectVersion?: string;
}

class BucketApplicationCode extends ApplicationCode {
  public readonly bucket?: s3.IBucket;
  public readonly fileKey: string;
  public readonly objectVersion?: string;

  constructor(props: BucketApplicationCodeProps) {
    super();
    this.bucket = props.bucket;
    this.fileKey = props.fileKey;
    this.objectVersion = props.objectVersion;
  }

  public bind(_scope: Construct): ApplicationCodeConfig {
    return {
      applicationCodeConfigurationProperty: {
        applicationCodeConfiguration: {
          codeContent: {
            s3ContentLocation: {
              bucketArn: this.bucket!.bucketArn,
              fileKey: this.fileKey,
              objectVersion: this.objectVersion,
            },
          },
          codeContentType: 'ZIPFILE',
        },
      },
      bucket: this.bucket!,
    };
  }
}

class AssetApplicationCode extends ApplicationCode {
  private readonly path: string;
  private readonly options?: s3_assets.AssetOptions;
  private _asset?: s3_assets.Asset;

  constructor(path: string, options?: s3_assets.AssetOptions) {
    super();
    this.path = path;
    this.options = options;
  }

  public bind(scope: Construct): ApplicationCodeConfig {
    this._asset = new s3_assets.Asset(scope, 'Code', {
      path: this.path,
      ...this.options,
    });

    if (!this._asset.isZipArchive) {
      throw new Error(`Asset must be a .zip file or a directory (${this.path})`);
    }

    return {
      applicationCodeConfigurationProperty: {
        applicationCodeConfiguration: {
          codeContent: {
            s3ContentLocation: {
              bucketArn: this._asset.bucket.bucketArn,
              fileKey: this._asset.s3ObjectKey,
            },
          },
          codeContentType: 'ZIPFILE',
        },
      },
      bucket: this._asset.bucket,
    };
  }

  get asset(): s3_assets.Asset | undefined {
    return this._asset;
  }

  get bucket(): s3.IBucket | undefined {
    return this._asset?.bucket;
  }
}
