import { DockerImageAsset, DockerImageAssetOptions } from '@aws-cdk/aws-ecr-assets';
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, ContainerImageConfig } from '../container-image';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

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

  public bind(scope: CoreConstruct, containerDefinition: ContainerDefinition): ContainerImageConfig {
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
