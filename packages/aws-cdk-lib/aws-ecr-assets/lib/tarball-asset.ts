import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { IAsset } from '../../assets';
import * as ecr from '../../aws-ecr';
import { AssetStaging, Names, Stack, Stage, ValidationError } from '../../core';

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

  /**
   * A display name for this asset
   *
   * If supplied, the display name will be used in locations where the asset
   * identifier is printed, like in the CLI progress information. If the same
   * asset is added multiple times, the display name of the first occurrence is
   * used.
   *
   * The default is the construct path of the `TarballImageAsset` construct,
   * with respect to the enclosing stack. If the asset is produced by a
   * construct helper function (such as `lambda.Code.fromAssetImage()`), this
   * will look like `MyFunction/AssetImage`.
   *
   * We use the stack-relative construct path so that in the common case where
   * you have multiple stacks with the same asset, we won't show something like
   * `/MyBetaStack/MyFunction/Code` when you are actually deploying to
   * production.
   *
   * @default - Stack-relative construct path
   */
  readonly displayName?: string;
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
      throw new ValidationError(`Cannot find file at ${props.tarballFile}`, this);
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
      displayName: props.displayName ?? Names.stackRelativeConstructPath(this),
    });

    this.repository = ecr.Repository.fromRepositoryName(this, 'Repository', location.repositoryName);
    this.imageUri = location.imageUri;
    this.imageTag = location.imageTag ?? this.assetHash;
  }
}

