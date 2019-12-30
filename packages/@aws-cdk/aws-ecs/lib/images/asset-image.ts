import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as cdk from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, ContainerImageConfig } from '../container-image';

/**
 * The properties for building an AssetImage.
 */
export interface AssetImageProps {
  /**
   * The arguments to pass to the `docker build` command
   *
   * @default none
   */
  readonly buildArgs?: { [key: string]: string };

  /**
   * Docker target to build to
   *
   * @default none
   */
  readonly target?: string;
}

/**
 * An image that will be built from a local directory with a Dockerfile
 */
export class AssetImage extends ContainerImage {
  /**
   * Constructs a new instance of the AssetImage class.
   *
   * @param directory The directory containing the Dockerfile
   */
  constructor(private readonly directory: string, private readonly props: AssetImageProps = {}) {
    super();
  }

  public bind(scope: cdk.Construct, containerDefinition: ContainerDefinition): ContainerImageConfig {
    const asset = new DockerImageAsset(scope, 'AssetImage', {
      directory: this.directory,
      buildArgs: this.props.buildArgs,
      target: this.props.target,
    });
    asset.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());

    return {
      imageName: asset.imageUri,
    };
  }
}
