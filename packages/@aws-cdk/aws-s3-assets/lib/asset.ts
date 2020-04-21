import * as assets from '@aws-cdk/assets';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs';
import * as path from 'path';

const ARCHIVE_EXTENSIONS = [ '.zip', '.jar' ];

export interface AssetOptions extends assets.CopyOptions {

  /**
   * A list of principals that should be able to read this asset from S3.
   * You can use `asset.grantRead(principal)` to grant read permissions later.
   *
   * @default - No principals that can read file asset.
   */
  readonly readers?: iam.IGrantable[];

  /**
   * Custom source hash to use when identifying the specific version of the asset.
   *
   * NOTE: the source hash is used in order to identify a specific revision of the asset,
   * and used for optimizing and caching deployment activities related to this asset such as
   * packaging, uploading to Amazon S3, etc. If you chose to customize the source hash,
   * you will need to make sure it is updated every time the source changes, or otherwise
   * it is possible that some deployments will not be invalidated.
   *
   * @default - automatically calculate source hash based on the contents
   * of the source file or directory.
   *
   * @experimental
   */
  readonly sourceHash?: string;
}

export interface AssetProps extends AssetOptions {
  /**
   * The disk location of the asset.
   *
   * The path should refer to one of the following:
   * - A regular file or a .zip file, in which case the file will be uploaded as-is to S3.
   * - A directory, in which case it will be archived into a .zip file and uploaded to S3.
   */
  readonly path: string;
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

  constructor(scope: cdk.Construct, id: string, props: AssetProps) {
    super(scope, id);

    // stage the asset source (conditionally).
    const staging = new assets.Staging(this, 'Stage', {
      ...props,
      sourcePath: path.resolve(props.path),
    });

    this.sourceHash = props.sourceHash || staging.sourceHash;

    this.assetPath = staging.stagedPath;

    const packaging = determinePackaging(staging.sourcePath);

    // sets isZipArchive based on the type of packaging and file extension
    this.isZipArchive = packaging === cdk.FileAssetPackaging.ZIP_DIRECTORY
      ? true
      : ARCHIVE_EXTENSIONS.some(ext => staging.sourcePath.toLowerCase().endsWith(ext));

    const stack = cdk.Stack.of(this);

    const location = stack.addFileAsset({
      packaging,
      sourceHash: this.sourceHash,
      fileName: staging.stagedPath,
    });

    this.s3BucketName = location.bucketName;
    this.s3ObjectKey = location.objectKey;
    this.s3Url = location.s3Url;

    this.bucket = s3.Bucket.fromBucketName(this, 'AssetBucket', this.s3BucketName);

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
   * Grants read permissions to the principal on the assets bucket.
   */
  public grantRead(grantee: iam.IGrantable) {
    // we give permissions on all files in the bucket since we don't want to
    // accidentally revoke permission on old versions when deploying a new
    // version (for example, when using Lambda traffic shifting).
    this.bucket.grantRead(grantee);
  }
}

function determinePackaging(assetPath: string): cdk.FileAssetPackaging {
  if (!fs.existsSync(assetPath)) {
    throw new Error(`Cannot find asset at ${assetPath}`);
  }

  if (fs.statSync(assetPath).isDirectory()) {
    return cdk.FileAssetPackaging.ZIP_DIRECTORY;
  }

  if (fs.statSync(assetPath).isFile()) {
    return cdk.FileAssetPackaging.FILE;
  }

  throw new Error(`Asset ${assetPath} is expected to be either a directory or a regular file`);
}
