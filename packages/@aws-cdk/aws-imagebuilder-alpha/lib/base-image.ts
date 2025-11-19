import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ssm from 'aws-cdk-lib/aws-ssm';

/**
 * Represents a base image that is used to start from in EC2 Image Builder image builds
 */
export class BaseContainerImage {
  /**
   * The DockerHub image to use as the base image in a container recipe
   *
   * @param repository The DockerHub repository where the base image resides in
   * @param tag The tag of the base image in the DockerHub repository
   */
  public static fromDockerHub(repository: string, tag: string): BaseContainerImage {
    return new BaseContainerImage(`${repository}:${tag}`);
  }

  /**
   * The ECR container image to use as the base image in a container recipe
   *
   * @param repository The ECR repository where the base image resides in
   * @param tag The tag of the base image in the ECR repository
   */
  public static fromEcr(repository: ecr.IRepository, tag: string): BaseContainerImage {
    return new BaseContainerImage(repository.repositoryUriForTag(tag));
  }

  /**
   * The ECR public container image to use as the base image in a container recipe
   *
   * @param registryAlias The alias of the ECR public registry where the base image resides in
   * @param repositoryName The name of the ECR public repository, where the base image resides in
   * @param tag The tag of the base image in the ECR public repository
   */
  public static fromEcrPublic(registryAlias: string, repositoryName: string, tag: string): BaseContainerImage {
    return new BaseContainerImage(`public.ecr.aws/${registryAlias}/${repositoryName}:${tag}`);
  }

  /**
   * The string value of the base image to use in a container recipe. This can be an EC2 Image Builder image ARN,
   * an ECR or ECR public image, or a container URI sourced from a third-party container registry such as DockerHub.
   *
   * @param baseContainerImageString The base image as a direct string value
   */
  public static fromString(baseContainerImageString: string): BaseContainerImage {
    return new BaseContainerImage(baseContainerImageString);
  }

  /**
   * The rendered base image to use
   **/
  public readonly image: string;

  protected constructor(image: string) {
    this.image = image;
  }
}

/**
 * Represents a container instance image that is used to launch the instance used for building the container for an
 * EC2 Image Builder container build.
 */
export class ContainerInstanceImage {
  /**
   * The AMI ID to use to launch the instance for building the container image
   *
   * @param amiId The AMI ID to use as the container instance image
   */
  public static fromAmiId(amiId: string): ContainerInstanceImage {
    return new ContainerInstanceImage(amiId);
  }

  /**
   * The SSM parameter to use to launch the instance for building the container image
   *
   * @param parameter The SSM parameter to use as the container instance image
   */
  public static fromSsmParameter(parameter: ssm.IStringParameter): ContainerInstanceImage {
    return this.fromSsmParameterName(parameter.parameterArn);
  }

  /**
   * The name of the SSM parameter used to launch the instance for building the container image
   *
   * @param parameterName The name of the SSM parameter used as the container instance image
   */
  public static fromSsmParameterName(parameterName: string): ContainerInstanceImage {
    return new ContainerInstanceImage(`ssm:${parameterName}`);
  }

  /**
   * The string value of the container instance image to use in a container recipe. This can either be an SSM parameter,
   * or an AMI ID.
   *
   * @param containerInstanceImageString The container instance image as a direct string value
   */
  public static fromString(containerInstanceImageString: string): ContainerInstanceImage {
    return new ContainerInstanceImage(containerInstanceImageString);
  }

  /**
   * The rendered container instance image to use
   **/
  public readonly image: string;

  protected constructor(image: string) {
    this.image = image;
  }
}
