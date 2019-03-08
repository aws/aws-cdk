import ecr = require('@aws-cdk/aws-ecr');
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import cdk = require('@aws-cdk/cdk');
import { ContainerDefinition } from './container-definition';
import { CfnTaskDefinition } from './ecs.generated';

/**
 * Repository Credential resources
 */
export interface RepositoryCreds {
  /**
   * The secret that contains credentials for the image repository
   */
  readonly secret: secretsmanager.ISecret;
}

/**
 * Constructs for types of container images
 */
export abstract class ContainerImage {
  /**
   * Reference an image on DockerHub or another online registry
   */
  public static fromInternet(name: string, props: InternetHostedImageProps = {}) {
    return new InternetHostedImage(name, props);
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
   * Optional credentials for a private image registry
   */
  protected abstract readonly credentials?: RepositoryCreds;

  /**
   * Called when the image is used by a ContainerDefinition
   */
  public abstract bind(containerDefinition: ContainerDefinition): void;

  /**
   * Render the Repository credentials to the CloudFormation object
   */
  public abstract renderRepositoryCredentials(): CfnTaskDefinition.RepositoryCredentialsProperty | undefined;
}

import { AssetImage, AssetImageProps } from './images/asset-image';
import { EcrImage } from './images/ecr';
import { InternetHostedImage, InternetHostedImageProps } from './images/internet-hosted';