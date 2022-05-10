import { DockerImageAsset, DockerImageAssetOptions } from '@aws-cdk/aws-ecr-assets';
import { Construct } from 'constructs';
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, ContainerImageConfig } from '../container-image';

/**
 * The properties for building an AssetImage.
 */
export interface AssetImageProps extends DockerImageAssetOptions {
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

  public bind(scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig {
    const asset = new DockerImageAsset(scope, 'AssetImage', {
      directory: this.directory,
      ...this.props,
    });

    asset.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());

    return {
      imageName: asset.imageUri,
    };
  }
}
