import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import { AssetArtifact } from './artifact';
import { FollowMode } from './follow-mode';

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
  readonly path: string;

  /**
   * The packaging type for this asset.
   */
  readonly packaging: AssetPackaging;

  /**
   * How to treat symlinks in the asset directory (only applicable if this is a directory)
   * @default External only follows symlinks that are external to the source directory
   */
  follow?: FollowMode;

  /**
   * Glob patterns to exclude from the copy.
   * Only applicable for directories.
   */
  exclude?: string[];

  /**
   * An extra string to include in the asset's fingerprint. This can be used to
   * incorporate things like build commands and settings into the asset hash so
   * that it will be invalidated based on those as well as on the content
   * itself.
   */
  extra?: string;

  /**
   * A list of principals that should be able to read this asset from S3.
   * You can use `asset.grantRead(principal)` to grant read permissions later.
   */
  readonly readers?: iam.IGrantable[];
}

/**
 * An asset represents a local file or directory, which is automatically
 * uploaded to S3 and then can be referenced within a CDK application.
 *
 * Assets are deduplicated at the CDK app level based on their content hash
 * (fingerprint). This means that two `Asset` objects that refer to the same
 * asset (with the same copy options) will materialize in synthesis as a single
 * artifact.
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
   * Deploy-time attribute with the SHA-256 hash of the asset as it is uploaded to S3.
   */
  public readonly contentSha256: string;

  /**
   * Attribute which represents the S3 URL of this asset.
   * @example https://s3.us-west-1.amazonaws.com/bucket/key
   */
  public readonly s3Url: string;

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
   * The fingerprint (content hash) of this asset.
   */
  public readonly fingerprint: string;

  /**
   * The S3 prefix where all different versions of this asset are stored
   */
  private readonly s3Prefix: string;

  /**
   * Path of source
   */
  private readonly sourcePath: string;

  constructor(scope: cdk.Construct, id: string, props: GenericAssetProps) {
    super(scope, id);

    this.sourcePath = props.path;

    const artifact = AssetArtifact.forAsset(this, props);
    const params = artifact.wireToStack(this.node.stack);

    // sets isZipArchive based on the type of packaging and file extension
    const allowedExtensions: string[] = ['.jar', '.zip'];
    this.isZipArchive = props.packaging === AssetPackaging.ZipDirectory
      ? true
      : allowedExtensions.some(ext => props.path.toLowerCase().endsWith(ext));

    this.fingerprint = artifact.fingerprint;
    this.s3BucketName = params.bucket.stringValue;
    this.s3Prefix = cdk.Fn.select(0, cdk.Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, params.key.stringValue)).toString();
    const s3Filename = cdk.Fn.select(1, cdk.Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, params.key.stringValue)).toString();
    this.s3ObjectKey = `${this.s3Prefix}${s3Filename}`;
    this.bucket = s3.Bucket.import(this, 'AssetBucket', { bucketName: this.s3BucketName });
    this.s3Url = this.bucket.urlForObject(this.s3ObjectKey);
    this.contentSha256 = params.sha256.stringValue;

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
  public addResourceMetadata(resource: cdk.CfnResource, resourceProperty: string) {
    if (!this.node.getContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT)) {
      return; // not enabled
    }

    // tell tools such as SAM CLI that the "Code" property of this resource
    // points to a local path in order to enable local invocation of this function.
    resource.options.metadata = resource.options.metadata || { };
    resource.options.metadata[cxapi.ASSET_RESOURCE_METADATA_PATH_KEY] = this.sourcePath;
    resource.options.metadata[cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY] = resourceProperty;
  }

  /**
   * Grants read permissions to the principal on the asset's S3 object.
   */
  public grantRead(grantee: iam.IGrantable) {
    // We give permissions on all files with the same prefix. Presumably
    // different versions of the same file will have the same prefix
    // and we don't want to accidentally revoke permission on old versions
    // when deploying a new version.
    this.bucket.grantRead(grantee, `${this.s3Prefix}*`);
  }
}

export interface FileAssetProps {
  /**
   * File path.
   */
  readonly path: string;

  /**
   * A list of principals that should be able to read this file asset from S3.
   * You can use `asset.grantRead(principal)` to grant read permissions later.
   */
  readonly readers?: iam.IGrantable[];
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
  readonly path: string;

  /**
   * A list of principals that should be able to read this ZIP file from S3.
   * You can use `asset.grantRead(principal)` to grant read permissions later.
   */
  readonly readers?: iam.IGrantable[];
}

/**
 * An asset that represents a ZIP archive of a directory on disk.
 */
export class ZipDirectoryAsset extends Asset {
  constructor(scope: cdk.Construct, id: string, props: ZipDirectoryAssetProps) {
    super(scope, id, { packaging: AssetPackaging.ZipDirectory, ...props });
  }
}
