import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Before deploying your GameLift-enabled multiplayer game servers for hosting with the GameLift service, you need to upload your game server files.
 * The class helps you on preparing and uploading custom game server build files or Realtime Servers server script files.
 */
export abstract class Content {
  /**
     * Game content as an S3 object.
     * @param bucket The S3 bucket
     * @param key The object key
     * @param objectVersion Optional S3 ob ject version
     */
  public static fromBucket(bucket: s3.IBucket, key: string, objectVersion?: string): S3Content {
    return new S3Content(bucket, key, objectVersion);
  }


  /**
     * Loads the game content from a local disk path.
     *
     * @param path Either a directory with the game content bundle or a .zip file
     */
  public static fromAsset(path: string, options?: s3_assets.AssetOptions): AssetContent {
    return new AssetContent(path, options);
  }

  /**
     * Called when the Build is initialized to allow this object to bind
     */
  public abstract bind(scope: Construct, grantable: iam.IGrantable): ContentConfig;

}

/**
 * Result of binding `Content` into a `Build`.
 */
export interface ContentConfig {
  /**
   * The location of the content in S3.
   */
  readonly s3Location: s3.Location;
}

/**
 * Game content from an S3 archive.
 */
export class S3Content extends Content {

  constructor(private readonly bucket: s3.IBucket, private key: string, private objectVersion?: string) {
    super();
    if (!bucket.bucketName) {
      throw new Error('bucketName is undefined for the provided bucket');
    }
  }

  public bind(_scope: Construct, grantable: iam.IGrantable): ContentConfig {
    this.bucket.grantRead(grantable, this.key);
    return {
      s3Location: {
        bucketName: this.bucket.bucketName,
        objectKey: this.key,
        objectVersion: this.objectVersion,
      },
    };
  }
}

/**
 * Game content from a local directory.
 */
export class AssetContent extends Content {
  private asset?: s3_assets.Asset;

  /**
   * @param path The path to the asset file or directory.
   */
  constructor(public readonly path: string, private readonly options: s3_assets.AssetOptions = { }) {
    super();
  }

  public bind(scope: Construct, grantable: iam.IGrantable): ContentConfig {
    // If the same AssetContent is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      this.asset = new s3_assets.Asset(scope, 'Content', {
        path: this.path,
        ...this.options,
      });
    } else if (cdk.Stack.of(this.asset) !== cdk.Stack.of(scope)) {
      throw new Error(`Asset is already associated with another stack '${cdk.Stack.of(this.asset).stackName}'. ` +
        'Create a new Content instance for every stack.');
    }
    this.asset.grantRead(grantable);

    if (!this.asset.isZipArchive) {
      throw new Error(`Asset must be a .zip file or a directory (${this.path})`);
    }

    return {
      s3Location: {
        bucketName: this.asset.s3BucketName,
        objectKey: this.asset.s3ObjectKey,
      },
    };
  }
}
