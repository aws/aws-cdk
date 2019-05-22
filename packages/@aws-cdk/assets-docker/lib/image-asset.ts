import assets = require('@aws-cdk/assets');
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
   * Build args to pass to the `docker build` command
   *
   * @default no build args are passed
   */
  readonly buildArgs?: { [key: string]: string };
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
    const dir = path.resolve(props.directory);
    if (!fs.existsSync(dir)) {
      throw new Error(`Cannot find image directory at ${dir}`);
    }
    if (!fs.existsSync(path.join(dir, 'Dockerfile'))) {
      throw new Error(`No 'Dockerfile' found in ${dir}`);
    }

    const staging = new assets.Staging(this, 'Staging', {
      sourcePath: dir
    });

    this.directory = staging.stagedPath;

    const imageNameParameter = new cdk.CfnParameter(this, 'ImageName', {
      type: 'String',
      description: `ECR repository name and tag asset "${this.node.path}"`,
    });

    const asset: cxapi.ContainerImageAssetMetadataEntry = {
      packaging: 'container-image',
      path: this.directory,
      id: this.node.uniqueId,
      imageNameParameter: imageNameParameter.logicalId,
      repositoryName: props.repositoryName,
      buildArgs: props.buildArgs
    };

    this.node.addMetadata(cxapi.ASSET_METADATA, asset);

    // parse repository name and tag from the parameter (<REPO_NAME>:<TAG>)
    const components = cdk.Fn.split(':', imageNameParameter.stringValue);
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
  }
}
