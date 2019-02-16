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

  /**
   * The S3 bucket in which this asset resides.
   */
  public readonly bucket: s3.IBucket;

  /**
   * Indicates if this asset is a zip archive. Allows constructs to ensure that the
   * correct file type was used.
   */
  public readonly isZipArchive: boolean;

  /**
   * The S3 prefix where all different versions of this asset are stored
   */
  private readonly s3Prefix: string;

  constructor(scope: cdk.Construct, id: string, props: GenericAssetProps) {
    super(scope, id);

    // resolve full path
    this.assetPath = path.resolve(props.path);

    // sets isZipArchive based on the type of packaging and file extension
    const allowedExtensions: string[] = ['.jar', '.zip'];
    this.isZipArchive = props.packaging === AssetPackaging.ZipDirectory
      ? true
      : allowedExtensions.some(ext => this.assetPath.toLowerCase().endsWith(ext));

    validateAssetOnDisk(this.assetPath, props.packaging);

    // add parameters for s3 bucket and s3 key. those will be set by
    // the toolkit or by CI/CD when the stack is deployed and will include
    // the name of the bucket and the S3 key where the code lives.

    const bucketParam = new cdk.Parameter(this, 'S3Bucket', {
      type: 'String',
      description: `S3 bucket for asset "${this.node.path}"`,
    });

    const keyParam = new cdk.Parameter(this, 'S3VersionKey', {
      type: 'String',
      description: `S3 key for asset version "${this.node.path}"`
    });

    this.s3BucketName = bucketParam.stringValue;
    this.s3Prefix = cdk.Fn.select(0, cdk.Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, keyParam.stringValue)).toString();
    const s3Filename = cdk.Fn.select(1, cdk.Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, keyParam.stringValue)).toString();
    this.s3ObjectKey = `${this.s3Prefix}${s3Filename}`;

    this.bucket = s3.Bucket.import(this, 'AssetBucket', {
      bucketName: this.s3BucketName
    });

    // form the s3 URL of the object key
    this.s3Url = this.bucket.urlForObject(this.s3ObjectKey);

    // attach metadata to the lambda function which includes information
    // for tooling to be able to package and upload a directory to the
    // s3 bucket and plug in the bucket name and key in the correct
    // parameters.
    const asset: cxapi.FileAssetMetadataEntry = {
      path: this.assetPath,
      id: this.node.uniqueId,
      packaging: props.packaging,
      s3BucketParameter: bucketParam.logicalId,
      s3KeyParameter: keyParam.logicalId,
    };

    this.node.addMetadata(cxapi.ASSET_METADATA, asset);

    for (const reader of (props.readers || [])) {
      this.grantRead(reader);
    }
  }

  /**
   * Adds CloudFormation template metadata to the specified resource with
   * information that indicates which resource property is mapped to this local
   * asset. This can be used by tools such as SAM CLI to provide local
   * experience such as local invocation and debugging of Lambda functions.
   *
   * Asset metadata will only be included if the stack is synthesized with the
   * "aws:cdk:enable-asset-metadata" context key defined, which is the default
   * behavior when synthesizing via the CDK Toolkit.
   *
   * @see https://github.com/awslabs/aws-cdk/issues/1432
   *
   * @param resource The CloudFormation resource which is using this asset.
   * @param resourceProperty The property name where this asset is referenced
   * (e.g. "Code" for AWS::Lambda::Function)
   */
  public addResourceMetadata(resource: cdk.Resource, resourceProperty: string) {
    if (!this.node.getContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT)) {
      return; // not enabled
    }

    // tell tools such as SAM CLI that the "Code" property of this resource
    // points to a local path in order to enable local invocation of this function.
    resource.options.metadata = resource.options.metadata || { };
    resource.options.metadata[cxapi.ASSET_RESOURCE_METADATA_PATH_KEY] = this.assetPath;
    resource.options.metadata[cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY] = resourceProperty;
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
  constructor(scope: cdk.Construct, id: string, props: FileAssetProps) {
    super(scope, id, { packaging: AssetPackaging.File, ...props });
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
  constructor(scope: cdk.Construct, id: string, props: ZipDirectoryAssetProps) {
    super(scope, id, { packaging: AssetPackaging.ZipDirectory, ...props });
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
