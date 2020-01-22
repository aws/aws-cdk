import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';
import { ContainerDefinition } from './container-definition';
import { CfnTaskDefinition } from './ecs.generated';

/**
 * Constructs for types of container images
 */
export abstract class ContainerImage {
  /**
   * Reference an image on DockerHub or another online registry
   */
  public static fromRegistry(name: string, props: RepositoryImageProps = {}) {
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
   *
   * @param directory The directory containing the Dockerfile
   */
  public static fromAsset(directory: string, props: AssetImageProps = {}) {
    return new AssetImage(directory, props);
  }

  /**
   * Called when the image is used by a ContainerDefinition
   */
  public abstract bind(scope: cdk.Construct, containerDefinition: ContainerDefinition): ContainerImageConfig;
}

/**
 * The configuration for creating a container image.
 */
export interface ContainerImageConfig {
  /**
   * Specifies the name of the container image.
   */
  readonly imageName: string;

  /**
   * Specifies the credentials used to access the image repository.
   */
  readonly repositoryCredentials?: CfnTaskDefinition.RepositoryCredentialsProperty;
}

import { AssetImage, AssetImageProps } from './images/asset-image';
import { EcrImage } from './images/ecr';
import { RepositoryImage, RepositoryImageProps } from './images/repository';
