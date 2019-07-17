import assets = require('@aws-cdk/assets');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import { CfnParameter, Construct, Fn } from '@aws-cdk/core';
import cxapi = require('@aws-cdk/cx-api');

export interface SynthesizedAssetProps {
  /**
   * A unique hash of the source of the asset.
   */
  readonly sourceHash: string;

  /**
   * The path of the asset as it will be synthesized into the cloud assembly
   * directory.
   *
   * The file does not have to exist at the time of the definition of the asset.
   */
  readonly assemblyPath: string;

  /**
   * Determines whether the asset is a file or a directory, which will be zipped
   * and uploaded as an archive.
   *
   * @default FILE By default, we assume the asset is a file.
   */
  readonly packaging: AssetPackaging;

  /**
   * A list of principals that should be able to read this asset from S3.
   * You can use `asset.grantRead(principal)` to grant read permissions later.
   *
   * @default - No principals that can read file asset.
   */
  readonly readers?: iam.IGrantable[];
}

export class SynthesizedAsset extends Construct implements assets.IAsset {
  public readonly sourceHash: string;
  public readonly artifactHash: string;

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
   * The S3 bucket in which this asset resides.
   */
  public readonly bucket: s3.IBucket;

  /**
   * The S3 prefix where all different versions of this asset are stored
   */
  private readonly s3Prefix: string;

  constructor(scope: Construct, id: string, props: SynthesizedAssetProps) {
    super(scope, id);

    this.sourceHash = props.sourceHash;

    // add parameters for s3 bucket and s3 key. those will be set by
    // the toolkit or by CI/CD when the stack is deployed and will include
    // the name of the bucket and the S3 key where the code lives.

    const bucketParam = new CfnParameter(this, 'S3Bucket', {
      type: 'String',
      description: `S3 bucket for asset "${this.node.path}"`,
    });

    const keyParam = new CfnParameter(this, 'S3VersionKey', {
      type: 'String',
      description: `S3 key for asset version "${this.node.path}"`
    });

    const hashParam = new CfnParameter(this, 'ArtifactHash', {
      description: `Artifact hash for asset "${this.node.path}"`,
      type: 'String',
    });

    this.s3BucketName = bucketParam.valueAsString;
    this.s3Prefix = Fn.select(0, Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, keyParam.valueAsString)).toString();
    const s3Filename = Fn.select(1, Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, keyParam.valueAsString)).toString();
    this.s3ObjectKey = `${this.s3Prefix}${s3Filename}`;
    this.artifactHash = hashParam.valueAsString;

    this.bucket = s3.Bucket.fromBucketName(this, 'AssetBucket', this.s3BucketName);

    // form the s3 URL of the object key
    this.s3Url = this.bucket.urlForObject(this.s3ObjectKey);

    // attach metadata to the lambda function which includes information
    // for tooling to be able to package and upload a directory to the
    // s3 bucket and plug in the bucket name and key in the correct
    // parameters.
    const asset: cxapi.FileAssetMetadataEntry = {
      path: props.assemblyPath,
      id: this.node.uniqueId,
      packaging: props.packaging,
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

/**
 * Defines the way an asset is packaged before it is uploaded to S3.
 */
export enum AssetPackaging {
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
