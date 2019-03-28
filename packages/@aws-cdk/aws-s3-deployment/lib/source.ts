import assets = require('@aws-cdk/assets');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import fs = require('fs');

export interface SourceProps {
  /**
   * The source bucket to deploy from.
   */
  readonly bucket: s3.IBucket;

  /**
   * An S3 object key in the source bucket that points to a zip file.
   */
  readonly zipObjectKey: string;
}

/**
 * Represents a source for bucket deployments.
 */
export interface ISource {
  /**
   * Binds the source to a bucket deployment.
   * @param context The construct tree context.
   */
  bind(context: cdk.Construct): SourceProps;
}

/**
 * Specifies bucket deployment source.
 *
 * Usage:
 *
 *     Source.bucket(bucket, key)
 *     Source.asset('/local/path/to/directory')
 *     Source.asset('/local/path/to/a/file.zip')
 *
 */
export class Source {
  /**
   * Uses a .zip file stored in an S3 bucket as the source for the destination bucket contents.
   * @param bucket The S3 Bucket
   * @param zipObjectKey The S3 object key of the zip file with contents
   */
  public static bucket(bucket: s3.IBucket, zipObjectKey: string): ISource {
    return {
      bind: () => ({ bucket, zipObjectKey })
    };
  }

  /**
   * Uses a local asset as the deployment source.
   * @param path The path to a local .zip file or a directory
   */
  public static asset(path: string): ISource {
    return {
      bind(context: cdk.Construct): SourceProps {
        const packaging = fs.lstatSync(path).isDirectory() ? assets.AssetPackaging.ZipDirectory : assets.AssetPackaging.File;
        const asset = new assets.Asset(context, 'Asset', { packaging, path });
        if (!asset.isZipArchive) {
          throw new Error(`Asset path must be either a .zip file or a directory`);
        }
        return {
          bucket: asset.bucket,
          zipObjectKey: asset.s3ObjectKey
        };
      }
    };
  }

  private constructor() { }
}