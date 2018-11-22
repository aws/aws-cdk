import ecr = require('@aws-cdk/aws-ecr');
import cdk = require('@aws-cdk/cdk');

import { ContainerDefinition } from './container-definition';
import { AssetImage, AssetImageProps } from './images/asset-image';
import { DockerHubImage } from './images/dockerhub';
import { EcrImage } from './images/ecr';

/**
 * A container image
 */
export interface IContainerImage {
  /**
   * Name of the image
   */
  readonly imageName: string;

  /**
   * Called when the image is used by a ContainerDefinition
   */
  bind(containerDefinition: ContainerDefinition): void;
}

/**
 * Constructs for types of container images
 */
export class ContainerImage {
  /**
   * Reference an image on DockerHub
   */
  public static fromDockerHub(name: string) {
    return new DockerHubImage(name);
  }

  /**
   * Reference an image in an ECR repository
   */
  public static fromEcrRepository(repository: ecr.IRepository, tag: string = 'latest') {
    return new EcrImage(repository, tag);
  }

  /**
   * Reference an image that's constructed directly from sources on disk
   */
  public static fromAsset(parent: cdk.Construct, id: string, props: AssetImageProps) {
    return new AssetImage(parent, id, props);
  }
}
