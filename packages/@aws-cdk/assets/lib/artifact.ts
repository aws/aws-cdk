import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import { AssetPackaging, GenericAssetProps } from './asset';
import { copyDirectory } from './fs-copy';
import { fingerprint } from './fs-fingerprint';

export interface AssetArtifactProps extends GenericAssetProps {
  fingerprint: string;
}

/**
 * This is an internal construct (only available within this module) which represents a unique
 * asset within the app.
 *
 * To get an instance, use `AssetArtifact.forAsset`. It will calculate the fingerprint
 * of the asset based on content hash and look up if there is already an artifact with this
 * fingerprint in the app.
 */
export class AssetArtifact extends cdk.Construct implements cdk.ISynthesizable {

  /**
   * @returns gets or creates a singletone asset artifact for a specific asset
   */
  public static forAsset(scope: cdk.Construct, props: GenericAssetProps): AssetArtifact {
    const extra = {
      packaging: props.packaging,
      extra: props.extra,
    };

    const sourcePath = path.resolve(props.path);
    validateAssetOnDisk(sourcePath, props.packaging);

    // calculate content hash, which is what we use as the app-level ID of this asset
    const fp = fingerprint(props.path, {
      exclude: props.exclude,
      follow: props.follow,
      extra: JSON.stringify(extra)
    });

    const root = scope.node.root;

    const id = `asset_${fp}`;
    const artifact = root.node.tryFindChild(id) as AssetArtifact || new AssetArtifact(root, id, {
      fingerprint: fp,
      path: sourcePath,
      ...props
    });

    return artifact;
  }

  /**
   * The unique fingerprint of this asset, based MD5 hash of the content and the
   * directory structure.
   */
  public readonly fingerprint: string;

  private readonly artifactId: string;
  private readonly environments = new Set<string>();

  private constructor(scope: cdk.Construct, id: string, private readonly props: AssetArtifactProps) {
    super(scope, id);

    this.fingerprint = props.fingerprint;
    this.artifactId = id; // based on the fingerprint
  }

  /**
   * Creates (or reuses) the set of bucket/key parameters that will be used to wire assets
   * into a specific stack. Called by the `Asset` class to "subscribe" the asset to the stack.
   *
   * @param stack
   */
  public wireToStack(stack: cdk.Stack): AssetArtifactParameters {
    const bucketParamId = `asset-${this.fingerprint}-S3Bucket`;
    const keyParamId = `asset-${this.fingerprint}-S3Key`;
    const hashParamId = `asset-${this.fingerprint}-S3ContentHash`;

    // if we already have a parameters wired for this asset, just return them (assuming they all exist)
    if (stack.node.tryFindChild(keyParamId)) {
      return {
        bucket: stack.node.findChild(bucketParamId) as cdk.Parameter,
        key: stack.node.findChild(keyParamId) as cdk.Parameter,
        sha256: stack.node.findChild(hashParamId) as cdk.Parameter
      };
    }

    // okay, "register" this asset with the stack. this includes adding a bunch of parameters
    // and a metadata entry that tells the toolkit how to build the asset.

    const bucketParam = new cdk.Parameter(stack, bucketParamId, {
      type: 'String',
      description: `S3 bucket for asset ${this.fingerprint} from ${this.props.path}`,
    });

    const keyParam = new cdk.Parameter(stack, keyParamId, {
      type: 'String',
      description: `S3 key for asset ${this.fingerprint} from ${this.props.path}`
    });

    const contentHashParam = new cdk.Parameter(stack, hashParamId, {
      type: 'String',
      description: 'SHA-256 hash of the asset as it was uploaded to S3'
    });

    stack.setParameterValue(bucketParam, `\${${this.artifactId}}.s3bucket`);
    stack.setParameterValue(keyParam, `\${${this.artifactId}}.s3key`);
    stack.setParameterValue(contentHashParam, `\${${this.artifactId}}.sha256`);

    this.environments.add(stack.environment);

    return {
      bucket: bucketParam,
      key: keyParam,
      sha256: contentHashParam
    };
  }

  public synthesize(session: cdk.ISynthesisSession) {

    switch (this.props.packaging) {
      case AssetPackaging.File:
        this.synthesizeFile(session);
        return;

      case AssetPackaging.ZipDirectory:
        this.synthesizeZipDirectory(session);
        return;
    }

  }

  private synthesizeFile(session: cdk.ISynthesisSession) {
    const ext = path.extname(this.props.path);
    const fileName = `${this.fingerprint}${ext}`;

    const stagingFile = path.join(this.fingerprint, path.basename(this.props.path));

    fs.mkdirSync(path.join(session.staging.path, this.fingerprint));
    fs.copyFileSync(this.props.path, path.join(session.staging.path, stagingFile));

    session.addBuildStep(this.artifactId, {
      type: 'CopyFileTask',
      parameters: {
        src: `staging/${stagingFile}`,
        dest: `assembly/${fileName}` // relative to outdir
      }
    });

    for (const env of this.environments) {
      session.addArtifact(this.artifactId, {
        type: cxapi.ArtifactType.AwsS3Object,
        environment: env,
        properties: {
          file: fileName // relative to assembly
        }
      });
    }
  }

  private synthesizeZipDirectory(session: cdk.ISynthesisSession) {
    const fileName = `${this.fingerprint}.zip`;

    // copy source contents to a staging directory
    const stagingDir = this.fingerprint;
    fs.mkdirSync(path.join(session.staging.path, stagingDir));
    copyDirectory(this.props.path, path.join(session.staging.path, stagingDir));

    session.addBuildStep(this.artifactId, {
      type: 'ZipDirectoryTask',
      parameters: {
        src: `staging/${stagingDir}`,
        dest: `assembly/${fileName}`, // relative to outdir
      }
    });

    for (const env of this.environments) {
      session.addArtifact(this.artifactId, {
        type: cxapi.ArtifactType.AwsS3Object,
        environment: env,
        properties: {
          file: fileName // relative to assembly/
        }
      });
    }
  }
}

export interface AssetArtifactParameters {
  bucket: cdk.Parameter;
  key: cdk.Parameter;
  sha256: cdk.Parameter;
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
