import ecr = require('@aws-cdk/aws-ecr');
import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import { AdoptedRepository } from './adopted-repository';

export interface DockerImageAssetProps {
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
   * @default automatically derived from the asset's ID.
   */
  readonly repositoryName?: string;

  /**
   * Image tag within ECR repository.
   *
   * @default tag image with tag calculated by CDK.
   */
  readonly imageTag?: string;

  /**
   * Whether to allow image layer caching while building the image.
   * If set to `false` layer chaching is deactivated, neither local (`--no-cache`)
   * nor remote (`--cache-from`) cache is used. If set to `true` remote cache will
   * be used if `imageTag` is defined and local cache will be enabled.
   *
   * If in doubt do not set this property and use the default behavior, with defaults
   * to Docker's default behavior and usually is a good trade-off between correctness
   * and speed. Use `false` if you want to ensure correnctness and reproducable builds
   * and use `true` only if build speed is more important than reproducability.
   *
   * @default If not set, the default local layer caching of the docker daemon
   *          is enabled, but `--cache-from` is not used.
   */
  readonly allowLayerCaching?: boolean;
}

/**
 * An asset that represents a Docker image.
 *
 * The image will be created in build time and uploaded to an ECR repository.
 */
export class DockerImageAsset extends cdk.Construct {
  /**
   * The full URI of the image (including a tag). Use this reference to pull
   * the asset.
   */
  public imageUri: string;

  /**
   * The canonical URI of the image including the images unique repository digest.
   * Use this reference to pull the asset.
   */
  public imageDigestUri: string;

  /**
   * Repository where the image is stored
   */
  public repository: ecr.IRepository;

  /**
   * Directory where the source files are stored
   */
  private readonly directory: string;

  constructor(scope: cdk.Construct, id: string, props: DockerImageAssetProps) {
    super(scope, id);

    // resolve full path
    this.directory = path.resolve(props.directory);
    if (!fs.existsSync(this.directory)) {
      throw new Error(`Cannot find image directory at ${this.directory}`);
    }
    if (!fs.existsSync(path.join(this.directory, 'Dockerfile'))) {
      throw new Error(`No 'Dockerfile' found in ${this.directory}`);
    }

    const imageNameParameter = new cdk.CfnParameter(this, 'ImageName', {
      type: 'CommaDelimitedList',
      description: `ECR repository name and tag asset "${this.node.path}"`,
    });

    const asset: cxapi.ContainerImageAssetMetadataEntry = {
      packaging: 'container-image',
      path: this.directory,
      id: this.node.uniqueId,
      imageNameParameter: imageNameParameter.logicalId,
      repositoryName: props.repositoryName,
      imageTag: props.imageTag,
      allowLayerCaching: props.allowLayerCaching,
    };

    this.node.addMetadata(cxapi.ASSET_METADATA, asset);

    // parse repository name and tag from the parameter ([<REPO_NAME>:<TAG>, <REPO_URL>@<REPO_DIGEST>])
    const components = cdk.Fn.split(':', imageNameParameter.stringListValue[0]);
    const repositoryName = cdk.Fn.select(0, components).toString();
    const imageTag = cdk.Fn.select(1, components).toString();

    // Require that repository adoption happens first, so we route the
    // input ARN into the Custom Resource and then get the URI which we use to
    // refer to the image FROM the Custom Resource.
    //
    // If adoption fails (because the repository might be twice-adopted), we
    // haven't already started using the image.
    this.repository = new AdoptedRepository(this, 'AdoptRepository', { repositoryName });
    this.imageUri = this.repository.repositoryUriForTag(imageTag);
    this.imageDigestUri = imageNameParameter.stringListValue[1];
  }
}
