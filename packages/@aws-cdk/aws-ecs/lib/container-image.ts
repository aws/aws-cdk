import ecr = require('@aws-cdk/aws-ecr');
import cdk = require('@aws-cdk/cdk');

import { ContainerDefinition } from './container-definition';

/**
 * Constructs for types of container images
 */
export abstract class ContainerImage {
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
  public static fromAsset(scope: cdk.Construct, id: string, props: AssetImageProps) {
    return new AssetImage(scope, id, props);
  }

  /**
   * Name of the image
   */
  public abstract readonly imageName: string;

  /**
   * Called when the image is used by a ContainerDefinition
   */
  public abstract bind(containerDefinition: ContainerDefinition): void;
}

import { AssetImage, AssetImageProps } from './images/asset-image';
import { DockerHubImage } from './images/dockerhub';
import { EcrImage } from './images/ecr';
