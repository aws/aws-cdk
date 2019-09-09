import assets = require('@aws-cdk/assets');
import ecr = require('@aws-cdk/aws-ecr');
import cdk = require('@aws-cdk/core');
import { Token } from '@aws-cdk/core';
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import { AdoptedRepository } from './adopted-repository';

export interface DockerImageAssetProps extends assets.CopyOptions {
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
}

/**
 * An asset that represents a Docker image.
 *
 * The image will be created in build time and uploaded to an ECR repository.
 */
export class DockerImageAsset extends cdk.Construct implements assets.IAsset {
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
  public readonly artifactHash: string;

  /**
   * Directory where the source files are stored
   */
  private readonly directory: string;

  constructor(scope: cdk.Construct, id: string, props: DockerImageAssetProps) {
    super(scope, id);

    // verify buildArgs do not use tokens in neither keys nor values
    validateBuildArgs(props.buildArgs);

    // resolve full path
    const dir = path.resolve(props.directory);
    if (!fs.existsSync(dir)) {
      throw new Error(`Cannot find image directory at ${dir}`);
    }
    if (!fs.existsSync(path.join(dir, 'Dockerfile'))) {
      throw new Error(`No 'Dockerfile' found in ${dir}`);
    }

    const staging = new assets.Staging(this, 'Staging', {
      ...props,
      sourcePath: dir
    });

    this.directory = staging.stagedPath;
    this.sourceHash = staging.sourceHash;

    const imageNameParameter = new cdk.CfnParameter(this, 'ImageName', {
      type: 'String',
      description: `ECR repository name and tag asset "${this.node.path}"`,
    });

    const asset: cxapi.ContainerImageAssetMetadataEntry = {
      id: this.node.uniqueId,
      packaging: 'container-image',
      path: this.directory,
      sourceHash: this.sourceHash,
      imageNameParameter: imageNameParameter.logicalId,
      repositoryName: props.repositoryName,
      buildArgs: props.buildArgs
    };

    this.node.addMetadata(cxapi.ASSET_METADATA, asset);

    // Parse repository name and tag from the parameter (<REPO_NAME>@sha256:<TAG>)
    // Example: cdk/cdkexampleimageb2d7f504@sha256:72c4f956379a43b5623d529ddd969f6826dde944d6221f445ff3e7add9875500
    const components = cdk.Fn.split('@sha256:', imageNameParameter.valueAsString);
    const repositoryName = cdk.Fn.select(0, components).toString();
    const imageSha = cdk.Fn.select(1, components).toString();

    // Require that repository adoption happens first, so we route the
    // input ARN into the Custom Resource and then get the URI which we use to
    // refer to the image FROM the Custom Resource.
    //
    // If adoption fails (because the repository might be twice-adopted), we
    // haven't already started using the image.
    this.repository = new AdoptedRepository(this, 'AdoptRepository', { repositoryName });
    this.imageUri = `${this.repository.repositoryUri}@sha256:${imageSha}`;
    this.artifactHash = imageSha;
  }
}

function validateBuildArgs(buildArgs?: { [key: string]: string }) {
  for (const [ key, value ] of Object.entries(buildArgs || {})) {
    if (Token.isUnresolved(key) || Token.isUnresolved(value)) {
      throw new Error(`Cannot use tokens in keys or values of "buildArgs" since they are needed before deployment`);
    }
  }
}