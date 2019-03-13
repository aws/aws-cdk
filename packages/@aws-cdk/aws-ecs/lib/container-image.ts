import ecr = require('@aws-cdk/aws-ecr');
import cdk = require('@aws-cdk/cdk');
import { ContainerDefinition } from './container-definition';
import { CfnTaskDefinition } from './ecs.generated';

/**
 * Constructs for types of container images
 */
export abstract class ContainerImage {
  /**
   * Reference an image on DockerHub or another online registry
   */
  public static fromRepository(name: string, props: RepositoryImageProps = {}) {
    return new RepositoryImage(name, props);
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

  /**
   * Render the Repository credentials to the CloudFormation object
   */
  public abstract toRepositoryCredentialsJson(): CfnTaskDefinition.RepositoryCredentialsProperty | undefined;
}

import { AssetImage, AssetImageProps } from './images/asset-image';
import { EcrImage } from './images/ecr';
import { RepositoryImage, RepositoryImageProps } from './images/repository';