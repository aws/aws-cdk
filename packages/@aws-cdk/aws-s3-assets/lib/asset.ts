import assets = require('@aws-cdk/assets');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');

const ARCHIVE_EXTENSIONS = [ '.zip', '.jar' ];

export interface AssetProps extends assets.CopyOptions {
  /**
   * The disk location of the asset.
   *
   * The path should refer to one of the following:
   * - A regular file or a .zip file, in which case the file will be uploaded as-is to S3.
   * - A directory, in which case it will be archived into a .zip file and uploaded to S3.
   */
  readonly path: string;

  /**
   * A list of principals that should be able to read this asset from S3.
   * You can use `asset.grantRead(principal)` to grant read permissions later.
   *
   * @default - No principals that can read file asset.
   */
  readonly readers?: iam.IGrantable[];
}

/**
 * An asset represents a local file or directory, which is automatically uploaded to S3
 * and then can be referenced within a CDK application.
 */
export class Asset extends cdk.Construct implements assets.IAsset {
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
   * The path to the asset (stringinfied token).
   *
   * If asset staging is disabled, this will just be the original path.
   * If asset staging is enabled it will be the staged path.
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

  public readonly sourceHash: string;

  /**
   * The S3 prefix where all different versions of this asset are stored
   */
  private readonly s3Prefix: string;

  constructor(scope: cdk.Construct, id: string, props: AssetProps) {
    super(scope, id);

    // stage the asset source (conditionally).
    const staging = new assets.Staging(this, 'Stage', {
      ...props,
      sourcePath: path.resolve(props.path),
    });
    this.sourceHash = staging.sourceHash;

    this.assetPath = staging.stagedPath;

    const packaging = determinePackaging(staging.sourcePath);

    // sets isZipArchive based on the type of packaging and file extension
    this.isZipArchive = packaging === AssetPackaging.ZIP_DIRECTORY
      ? true
      : ARCHIVE_EXTENSIONS.some(ext => staging.sourcePath.toLowerCase().endsWith(ext));

    // add parameters for s3 bucket and s3 key. those will be set by
    // the toolkit or by CI/CD when the stack is deployed and will include
    // the name of the bucket and the S3 key where the code lives.

    const bucketParam = new cdk.CfnParameter(this, 'S3Bucket', {
      type: 'String',
      description: `S3 bucket for asset "${this.node.path}"`,
    });

    const keyParam = new cdk.CfnParameter(this, 'S3VersionKey', {
      type: 'String',
      description: `S3 key for asset version "${this.node.path}"`
    });

    const hashParam = new cdk.CfnParameter(this, 'ArtifactHash', {
      description: `Artifact hash for asset "${this.node.path}"`,
      type: 'String',
    });

    this.s3BucketName = bucketParam.valueAsString;
    this.s3Prefix = cdk.Fn.select(0, cdk.Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, keyParam.valueAsString)).toString();
    const s3Filename = cdk.Fn.select(1, cdk.Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, keyParam.valueAsString)).toString();
    this.s3ObjectKey = `${this.s3Prefix}${s3Filename}`;

    this.bucket = s3.Bucket.fromBucketName(this, 'AssetBucket', this.s3BucketName);

    // form the s3 URL of the object key
    this.s3Url = this.bucket.urlForObject(this.s3ObjectKey);

    // attach metadata to the lambda function which includes information
    // for tooling to be able to package and upload a directory to the
    // s3 bucket and plug in the bucket name and key in the correct
    // parameters.
    const asset: cxapi.FileAssetMetadataEntry = {
      path: this.assetPath,
      id: this.node.uniqueId,
      packaging,
      sourceHash: this.sourceHash,

      s3BucketParameter: bucketParam.logicalId,
      s3KeyParameter: keyParam.logicalId,
      artifactHashParameter: hashParam.logicalId,
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
   * @see https://github.com/aws/aws-cdk/issues/1432
   *
   * @param resource The CloudFormation resource which is using this asset [disable-awslint:ref-via-interface]
   * @param resourceProperty The property name where this asset is referenced
   * (e.g. "Code" for AWS::Lambda::Function)
   */
  public addResourceMetadata(resource: cdk.CfnResource, resourceProperty: string) {
    if (!this.node.tryGetContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT)) {
      return; // not enabled
    }

    // tell tools such as SAM CLI that the "Code" property of this resource
    // points to a local path in order to enable local invocation of this function.
    resource.cfnOptions.metadata = resource.cfnOptions.metadata || { };
    resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_PATH_KEY] = this.assetPath;
    resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY] = resourceProperty;
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

function determinePackaging(assetPath: string): AssetPackaging {
  if (!fs.existsSync(assetPath)) {
    throw new Error(`Cannot find asset at ${assetPath}`);
  }

  if (fs.statSync(assetPath).isDirectory()) {
    return AssetPackaging.ZIP_DIRECTORY;
  }

  if (fs.statSync(assetPath).isFile()) {
    return AssetPackaging.FILE;
  }

  throw new Error(`Asset ${assetPath} is expected to be either a directory or a regular file`);
}

/**
 * Defines the way an asset is packaged before it is uploaded to S3.
 */
enum AssetPackaging {
  /**
   * Path refers to a directory on disk, the contents of the directory is
   * archived into a .zip.
   */
  ZIP_DIRECTORY = 'zip',

  /**
   * Path refers to a single file on disk. The file is uploaded as-is.
   */
  FILE = 'file',
}
