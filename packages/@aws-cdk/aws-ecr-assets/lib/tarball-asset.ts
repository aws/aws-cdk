import * as fs from 'fs';
import * as path from 'path';
import { IAsset } from '@aws-cdk/assets';
import * as ecr from '@aws-cdk/aws-ecr';
import { AssetStaging, Stack, Stage } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Options for TarballImageAsset
 */
export interface TarballImageAssetProps {
  /**
   * Absolute path to the tarball.
   *
   * It is recommended to to use the script running directory (e.g. `__dirname`
   * in Node.js projects or dirname of `__file__` in Python) if your tarball
   * is located as a resource inside your project.
   */
  readonly tarballFile: string;
}

/**
 * An asset that represents a Docker image.
 *
 * The image will loaded from an existing tarball and uploaded to an ECR repository.
 */
export class TarballImageAsset extends Construct implements IAsset {
  /**
   * The full URI of the image (including a tag). Use this reference to pull
   * the asset.
   */
  public imageUri: string;

  /**
   * Repository where the image is stored
   */
  public repository: ecr.IRepository;

  /**
   * A hash of the source of this asset, which is available at construction time. As this is a plain
   * string, it can be used in construct IDs in order to enforce creation of a new resource when
   * the content hash has changed.
   * @deprecated use assetHash
   */
  public readonly sourceHash: string;

  /**
   * A hash of this asset, which is available at construction time. As this is a plain string, it
   * can be used in construct IDs in order to enforce creation of a new resource when the content
   * hash has changed.
   */
  public readonly assetHash: string;

  /**
   * The tag of this asset when it is uploaded to ECR. The tag may differ from the assetHash if a stack synthesizer adds a dockerTagPrefix.
   */
  public readonly imageTag: string;

  constructor(scope: Construct, id: string, props: TarballImageAssetProps) {
    super(scope, id);

    if (!fs.existsSync(props.tarballFile)) {
      throw new Error(`Cannot find file at ${props.tarballFile}`);
    }

    const stagedTarball = new AssetStaging(this, 'Staging', { sourcePath: props.tarballFile });

    this.sourceHash = stagedTarball.assetHash;
    this.assetHash = stagedTarball.assetHash;

    const stage = Stage.of(this);
    const relativePathInOutDir = stage ? path.relative(stage.assetOutdir, stagedTarball.absoluteStagedPath) : stagedTarball.absoluteStagedPath;

    const stack = Stack.of(this);
    const location = stack.synthesizer.addDockerImageAsset({
      sourceHash: stagedTarball.assetHash,
      executable: [
        'sh',
        '-c',
        `docker load -i ${relativePathInOutDir} | tail -n 1 | sed "s/Loaded image: //g"`,
      ],
    });

    this.repository = ecr.Repository.fromRepositoryName(this, 'Repository', location.repositoryName);
    this.imageUri = location.imageUri;
    this.imageTag = location.imageTag ?? this.assetHash;
  }
}

