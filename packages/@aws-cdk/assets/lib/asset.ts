import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');

/**
 * Defines the way an asset is packaged before it is uploaded to S3.
 */
export enum AssetPackaging {
  /**
   * Path refers to a directory on disk, the contents of the directory is
   * archived into a .zip.
   */
  ZipDirectory = 'zip',

  /**
   * Path refers to a single file on disk. The file is uploaded as-is.
   */
  File = 'file',
}

export interface GenericAssetProps {
  /**
   * The disk location of the asset.
   */
  path: string;

  /**
   * The packaging type for this asset.
   */
  packaging: AssetPackaging;

  /**
   * A list of principals that should be able to read this asset from S3.
   * You can use `asset.grantRead(principal)` to grant read permissions later.
   */
  readers?: iam.IPrincipal[];
}

/**
 * An asset represents a local file or directory, which is automatically uploaded to S3
 * and then can be referenced within a CDK application.
 */
export class Asset extends cdk.Construct {
  /**
   * Attribute that represents the name of the bucket this asset exists in.
   */
  public readonly s3BucketName: string;

  /**
   * Attribute which represents the S3 object key of this asset.
   */
  public readonly s3ObjectKey: string;

  /**
   * Attribute which represents the S3 URL of this asset.
   * @example https://s3.us-west-1.amazonaws.com/bucket/key
   */
  public readonly s3Url: string;

  /**
   * Resolved full-path location of this asset.
   */
  public readonly assetPath: string;

  private readonly bucket: s3.BucketRef;

  /**
   * The S3 prefix where all different versions of this asset are stored
   */
  private readonly s3Prefix: string;

  constructor(parent: cdk.Construct, id: string, props: GenericAssetProps) {
    super(parent, id);

    // resolve full path
    this.assetPath = path.resolve(props.path);

    validateAssetOnDisk(this.assetPath, props.packaging);

    // add parameters for s3 bucket and s3 key. those will be set by
    // the toolkit or by CI/CD when the stack is deployed and will include
    // the name of the bucket and the S3 key where the code lives.

    const bucketParam = new cdk.Parameter(this, 'S3Bucket', {
      type: 'String',
      description: `S3 bucket for asset "${this.path}"`,
    });

    const keyParam = new cdk.Parameter(this, 'S3VersionKey', {
      type: 'String',
      description: `S3 key for asset version "${this.path}"`
    });

    this.s3BucketName = bucketParam.value.toString();
    this.s3Prefix = new cdk.FnSelect(0, new cdk.FnSplit(cxapi.ASSET_PREFIX_SEPARATOR, keyParam.value)).toString();
    const s3Filename = new cdk.FnSelect(1, new cdk.FnSplit(cxapi.ASSET_PREFIX_SEPARATOR, keyParam.value)).toString();
    this.s3ObjectKey = `${this.s3Prefix}${s3Filename}`;

    this.bucket = s3.BucketRef.import(this, 'AssetBucket', {
      bucketName: this.s3BucketName
    });

    // form the s3 URL of the object key
    this.s3Url = this.bucket.urlForObject(this.s3ObjectKey);

    // attach metadata to the lambda function which includes information
    // for tooling to be able to package and upload a directory to the
    // s3 bucket and plug in the bucket name and key in the correct
    // parameters.
    const asset: cxapi.AssetMetadataEntry = {
      path: this.assetPath,
      id: this.uniqueId,
      packaging: props.packaging,
      s3BucketParameter: bucketParam.logicalId,
      s3KeyParameter: keyParam.logicalId,
    };

    this.addMetadata(cxapi.ASSET_METADATA, asset);

    for (const reader of (props.readers || [])) {
      this.grantRead(reader);
    }
  }

  /**
   * Grants read permissions to the principal on the asset's S3 object.
   */
  public grantRead(principal?: iam.IPrincipal) {
    // We give permissions on all files with the same prefix. Presumably
    // different versions of the same file will have the same prefix
    // and we don't want to accidentally revoke permission on old versions
    // when deploying a new version.
    this.bucket.grantRead(principal, `${this.s3Prefix}*`);
  }
}

export interface FileAssetProps {
  /**
   * File path.
   */
  path: string;

  /**
   * A list of principals that should be able to read this file asset from S3.
   * You can use `asset.grantRead(principal)` to grant read permissions later.
   */
  readers?: iam.IPrincipal[];
}

/**
 * An asset that represents a file on disk.
 */
export class FileAsset extends Asset {
  constructor(parent: cdk.Construct, id: string, props: FileAssetProps) {
    super(parent, id, { packaging: AssetPackaging.File, ...props });
  }
}

export interface ZipDirectoryAssetProps {
  /**
   * Path of the directory.
   */
  path: string;

  /**
   * A list of principals that should be able to read this ZIP file from S3.
   * You can use `asset.grantRead(principal)` to grant read permissions later.
   */
  readers?: iam.IPrincipal[];
}

/**
 * An asset that represents a ZIP archive of a directory on disk.
 */
export class ZipDirectoryAsset extends Asset {
  constructor(parent: cdk.Construct, id: string, props: ZipDirectoryAssetProps) {
    super(parent, id, { packaging: AssetPackaging.ZipDirectory, ...props });
  }
}

function validateAssetOnDisk(assetPath: string, packaging: AssetPackaging) {
  if (!fs.existsSync(assetPath)) {
    throw new Error(`Cannot find asset at ${assetPath}`);
  }

  switch (packaging) {
    case AssetPackaging.ZipDirectory:
      if (!fs.statSync(assetPath).isDirectory()) {
        throw new Error(`${assetPath} is expected to be a directory when asset packaging is 'zip'`);
      }
      break;

    case AssetPackaging.File:
      if (!fs.statSync(assetPath).isFile()) {
        throw new Error(`${assetPath} is expected to be a regular file when asset packaging is 'file'`);
      }
      break;

    default:
      throw new Error(`Unsupported asset packaging format: ${packaging}`);
  }
}
