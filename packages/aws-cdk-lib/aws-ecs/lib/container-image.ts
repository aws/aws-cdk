
import { Construct } from 'constructs';
import { ContainerDefinition } from './container-definition';
import { CfnTaskDefinition } from './ecs.generated';
import * as ecr from '../../aws-ecr';
import { DockerImageAsset, TarballImageAsset } from '../../aws-ecr-assets';
import * as secretsmanager from '../../aws-secretsmanager';

/**
 * Interface for container image providers.
 *
 * Implementations of this interface provide a container image that can be used by an ECS task.
 */
export interface IContainerImage {
  /**
   * Called when the image is used by a ContainerDefinition.
   *
   * @param scope The scope in which to create resources
   * @param containerDefinition The container definition using this image
   */
  bind(scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig;
}

/**
 * Constructs for types of container images
 */
export abstract class ContainerImage implements IContainerImage {
  /**
   * Reference an image on DockerHub or another online registry
   */
  public static fromRegistry(name: string, props: RepositoryImageProps = {}) {
    return new RepositoryImage(name, props);
  }

  /**
   * Reference an image in an ECR repository
   *
   * @param tag If you don't specify this parameter, `latest` is used as default.
   */
  public static fromEcrRepository(repository: ecr.IRepository, tag: string = 'latest') {
    return new EcrImage(repository, tag);
  }

  /**
   * Reference an image that's constructed directly from sources on disk.
   *
   * If you already have a `DockerImageAsset` instance, you can use the
   * `ContainerImage.fromDockerImageAsset` method instead.
   *
   * @param directory The directory containing the Dockerfile
   */
  public static fromAsset(directory: string, props: AssetImageProps = {}) {
    return new AssetImage(directory, props);
  }

  /**
   * Use an existing `DockerImageAsset` for this container image.
   *
   * @param asset The `DockerImageAsset` to use for this container definition.
   */
  public static fromDockerImageAsset(asset: DockerImageAsset): ContainerImage {
    return {
      bind(_scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig {
        containerDefinition._defaultDisableVersionConsistency?.();
        asset.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
        return {
          imageName: asset.imageUri,
        };
      },
    };
  }

  /**
   * Use an existing tarball for this container image.
   *
   * Use this method if the container image has already been created by another process (e.g. jib)
   * and you want to add it as a container image asset.
   *
   * @param tarballFile Absolute path to the tarball. You can use language-specific idioms (such as `__dirname` in Node.js)
   *                    to create an absolute path based on the current script running directory.
   */
  public static fromTarball(tarballFile: string): ContainerImage {
    return {
      bind(scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig {
        const asset = new TarballImageAsset(scope, 'Tarball', { tarballFile });
        asset.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());

        return {
          imageName: asset.imageUri,
        };
      },
    };
  }

  /**
   * Use a custom container image configuration.
   *
   * This method allows you to specify custom container images from any registry
   * without implementing the IContainerImage interface directly.
   *
   * @param config Configuration for the custom container image
   */
  public static fromCustomConfiguration(config: CustomContainerImageConfig): ContainerImage {
    return {
      bind(_scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig {
        // Grant read permissions on the secret if credentials are provided
        if (config.repositoryCredential) {
          config.repositoryCredential.grantRead(containerDefinition.taskDefinition.obtainExecutionRole());
        }

        return {
          imageName: config.imageName,
          repositoryCredentials: config.repositoryCredential && {
            credentialsParameter: config.repositoryCredential.secretArn,
          },
        };
      },
    };
  }

  /**
   * Called when the image is used by a ContainerDefinition
   */
  public abstract bind(scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig;
}

/**
 * Configuration for a custom container image.
 */
export interface CustomContainerImageConfig {
  /**
   * The image name. Images in Docker Hub or ECR are supported.
   *
   * @example 'custom-registry.example.com/my-app:v1.0'
   */
  readonly imageName: string;

  /**
   * The secret that contains the credentials for the image repository.
   * The supported value is the full ARN of an AWS Secrets Manager secret.
   *
   * @default - No credentials are used
   */
  readonly repositoryCredential?: secretsmanager.ISecret;
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

// These imports have to be at the end to prevent circular imports
import { AssetImage, AssetImageProps } from './images/asset-image';
import { EcrImage } from './images/ecr';
import { RepositoryImage, RepositoryImageProps } from './images/repository';
