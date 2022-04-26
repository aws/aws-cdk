import { IBucket, Location } from '@aws-cdk/aws-s3';
import { Asset, AssetOptions } from '@aws-cdk/aws-s3-assets';
import { Construct } from '@aws-cdk/core';

/**
 * Constructs for types of environment files
 */
export abstract class EnvironmentFile {
  /**
   * Loads the environment file from a local disk path.
   *
   * @param path Local disk path
   * @param options
   */
  public static fromAsset(path: string, options?: AssetOptions): AssetEnvironmentFile {
    return new AssetEnvironmentFile(path, options);
  }

  /**
   * Loads the environment file from an S3 bucket.
   *
   * @returns `S3EnvironmentFile` associated with the specified S3 object.
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   */
  public static fromBucket(bucket: IBucket, key: string, objectVersion?: string): S3EnvironmentFile {
    return new S3EnvironmentFile(bucket, key, objectVersion);
  }

  /**
   * Called when the container is initialized to allow this object to bind
   * to the stack.
   *
   * @param scope The binding scope
   */
  public abstract bind(scope: Construct): EnvironmentFileConfig;
}

/**
 * Environment file from a local directory.
 */
export class AssetEnvironmentFile extends EnvironmentFile {
  private asset?: Asset;

  /**
   * @param path The path to the asset file or directory.
   * @param options
   */
  constructor(public readonly path: string, private readonly options: AssetOptions = { }) {
    super();
  }

  public bind(scope: Construct): EnvironmentFileConfig {
    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      this.asset = new Asset(scope, 'EnvironmentFile', {
        path: this.path,
        ...this.options,
      });
    }

    if (!this.asset.isFile) {
      throw new Error(`Asset must be a single file (${this.path})`);
    }

    return {
      fileType: EnvironmentFileType.S3,
      s3Location: {
        bucketName: this.asset.s3BucketName,
        objectKey: this.asset.s3ObjectKey,
      },
    };
  }
}

/**
 * Environment file from S3.
 */
export class S3EnvironmentFile extends EnvironmentFile {
  private readonly bucketName: string;

  constructor(bucket: IBucket, private key: string, private objectVersion?: string) {
    super();

    if (!bucket.bucketName) {
      throw new Error('bucketName is undefined for the provided bucket');
    }

    this.bucketName = bucket.bucketName;
  }

  public bind(_scope: Construct): EnvironmentFileConfig {
    return {
      fileType: EnvironmentFileType.S3,
      s3Location: {
        bucketName: this.bucketName,
        objectKey: this.key,
        objectVersion: this.objectVersion,
      },
    };
  }
}

/**
 * Configuration for the environment file
 */
export interface EnvironmentFileConfig {
  /**
   * The type of environment file
   */
  readonly fileType: EnvironmentFileType;

  /**
   * The location of the environment file in S3
   */
  readonly s3Location: Location;
}

/**
 * Type of environment file to be included in the container definition
 */
export enum EnvironmentFileType {
  /**
   * Environment file hosted on S3, referenced by object ARN
   */
  S3 = 's3',
}
