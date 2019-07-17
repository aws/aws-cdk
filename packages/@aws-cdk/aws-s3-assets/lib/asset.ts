import assets = require('@aws-cdk/assets');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import { AssetPackaging, SynthesizedAsset } from './synthesized-asset';

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
export class Asset extends SynthesizedAsset {
  /**
   * The path to the asset (stringinfied token).
   *
   * If asset staging is disabled, this will just be the original path.
   * If asset staging is enabled it will be the staged path.
   */
  public readonly assetPath: string;

  /**
   * Indicates if this asset is a zip archive. Allows constructs to ensure that the
   * correct file type was used.
   */
  public readonly isZipArchive: boolean;

  constructor(scope: cdk.Construct, id: string, props: AssetProps) {

    // stage the asset source (conditionally).
    const staging = new assets.Staging(scope, id + '.Stage', {
      ...props,
      sourcePath: path.resolve(props.path),
    });

    super(scope, id, {
      sourceHash: staging.sourceHash,
      assemblyPath: staging.stagedPath,
      packaging: determinePackaging(staging.sourcePath),
      readers: props.readers
    });

    this.assetPath = staging.stagedPath;

    const packaging = determinePackaging(staging.sourcePath);

    // sets isZipArchive based on the type of packaging and file extension
    this.isZipArchive = packaging === AssetPackaging.ZIP_DIRECTORY
      ? true
      : ARCHIVE_EXTENSIONS.some(ext => staging.sourcePath.toLowerCase().endsWith(ext));
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
