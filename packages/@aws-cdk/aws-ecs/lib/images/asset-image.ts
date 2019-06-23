import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import cdk = require('@aws-cdk/core');
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, ContainerImageConfig } from '../container-image';

export interface AssetImageProps {
  /**
   * Build args to pass to the `docker build` command
   *
   * @default no build args are passed
   */
  readonly buildArgs?: { [key: string]: string };
}

/**
 * An image that will be built at synthesis time from a directory with a Dockerfile
 */
export class AssetImage extends ContainerImage {
  /**
   * Create an AssetImage
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
    });
    asset.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());

    return {
      imageName: asset.imageUri,
    };
  }
}
