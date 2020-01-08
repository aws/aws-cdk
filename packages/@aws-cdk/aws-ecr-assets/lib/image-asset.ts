import * as assets from '@aws-cdk/assets';
import * as ecr from '@aws-cdk/aws-ecr';
import { Construct, Stack, Token } from '@aws-cdk/core';
import * as fs from 'fs';
import * as path from 'path';
import { AdoptedRepository } from './adopted-repository';

export interface DockerImageAssetProps extends assets.FingerprintOptions {
  /**
   * The directory where the Dockerfile is stored
   */
  readonly directory: string;

  /**
   * ECR repository name
   *
   * Specify this property if you need to statically address the image, e.g.
   * from a Kubernetes Pod. Note, this is only the repository name, without the
   * registry and the tag parts.
   *
   * @default - automatically derived from the asset's ID.
   */
  readonly repositoryName?: string;

  /**
   * Build args to pass to the `docker build` command.
   *
   * Since Docker build arguments are resolved before deployment, keys and
   * values cannot refer to unresolved tokens (such as `lambda.functionArn` or
   * `queue.queueUrl`).
   *
   * @default - no build args are passed
   */
  readonly buildArgs?: { [key: string]: string };

  /**
   * Docker target to build to
   *
   * @default - no target
   */
  readonly target?: string;

  /**
   * Path to the Dockerfile (relative to the directory).
   *
   * @default 'Dockerfile'
   */
  readonly file?: string;
}

/**
 * An asset that represents a Docker image.
 *
 * The image will be created in build time and uploaded to an ECR repository.
 */
export class DockerImageAsset extends Construct implements assets.IAsset {
  /**
   * The full URI of the image (including a tag). Use this reference to pull
   * the asset.
   */
  public imageUri: string;

  /**
   * Repository where the image is stored
   */
  public repository: ecr.IRepository;

  public readonly sourceHash: string;

  constructor(scope: Construct, id: string, props: DockerImageAssetProps) {
    super(scope, id);

    // none of the properties use tokens
    validateProps(props);

    // resolve full path
    const dir = path.resolve(props.directory);
    if (!fs.existsSync(dir)) {
      throw new Error(`Cannot find image directory at ${dir}`);
    }

    // validate the docker file exists
    const file = path.join(dir, props.file || 'Dockerfile');
    if (!fs.existsSync(file)) {
      throw new Error(`Cannot find file at ${file}`);
    }

    let exclude: string[] = props.exclude || [];

    const ignore = path.join(dir, '.dockerignore');

    if (fs.existsSync(ignore)) {
      exclude = [...exclude, ...fs.readFileSync(ignore).toString().split('\n').filter(e => !!e)];
    }

    // include build context in "extra" so it will impact the hash
    const extraHash = new Array<any>();
    if (props.extra) { extraHash.push(props.extra); }
    if (props.buildArgs) {
      extraHash.push({ buildArgs: props.buildArgs });
    }
    if (props.target) {
      extraHash.push({ target: props.target });
    }
    if (props.file) {
      extraHash.push({ file: props.file });
    }

    const staging = new assets.Staging(this, 'Staging', {
      ...props,
      exclude,
      sourcePath: dir,
      extra: extraHash.length === 0 ? undefined : extraHash.map(x => JSON.stringify(x)).join('=====')
    });

    this.sourceHash = staging.sourceHash;

    const stack = Stack.of(this);
    const location = stack.addDockerImageAsset({
      directoryName: staging.stagedPath,
      dockerBuildArgs: props.buildArgs,
      dockerBuildTarget: props.target,
      dockerFile: file,
      repositoryName: props.repositoryName || `cdk/${this.node.uniqueId.replace(/[:/]/g, '-').toLowerCase()}`,
      sourceHash: staging.sourceHash
    });

    // Require that repository adoption happens first, so we route the
    // input ARN into the Custom Resource and then get the URI which we use to
    // refer to the image FROM the Custom Resource.
    //
    // If adoption fails (because the repository might be twice-adopted), we
    // haven't already started using the image.
    this.repository = new AdoptedRepository(this, 'AdoptRepository', { repositoryName: location.repositoryName });
    this.imageUri = location.imageUri;
  }
}

function validateProps(props: DockerImageAssetProps) {
  for (const [key, value] of Object.entries(props)) {
    if (Token.isUnresolved(value)) {
      throw new Error(`Cannot use Token as value of '${key}': this value is used before deployment starts`);
    }
  }

  validateBuildArgs(props.buildArgs);
}

function validateBuildArgs(buildArgs?: { [key: string]: string }) {
  for (const [key, value] of Object.entries(buildArgs || {})) {
    if (Token.isUnresolved(key) || Token.isUnresolved(value)) {
      throw new Error(`Cannot use tokens in keys or values of "buildArgs" since they are needed before deployment`);
    }
  }
}
