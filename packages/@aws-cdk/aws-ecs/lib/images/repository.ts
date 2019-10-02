import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from "../container-definition";
import { ContainerImage, ContainerImageConfig } from "../container-image";

/**
 * The properties for an image hosted in a public or private repository.
 */
export interface RepositoryImageProps {
  /**
   * The secret to expose to the container that contains the credentials for the image repository.
   * The supported value is the full ARN of an AWS Secrets Manager secret.
   */
  readonly credentials?: secretsmanager.ISecret;

  /**
   * Whether the repository is an ECR repository.
   *
   * @experimental
   */
  readonly ecrRepository?: boolean;
}

/**
 * An image hosted in a public or private repository. For images hosted in Amazon ECR, see
 * [EcrImage](https://docs.aws.amazon.com/AmazonECR/latest/userguide/images.html).
 */
export class RepositoryImage extends ContainerImage {

  /**
   * Constructs a new instance of the RepositoryImage class.
   */
  constructor(private readonly imageName: string, private readonly props: RepositoryImageProps = {}) {
    super();
  }

  public bind(scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig {
    if (this.props.ecrRepository) {
      scope.node.addWarning("Proper policies need to be attached before pulling from ECR repository.");
    }

    if (this.props.credentials) {
      this.props.credentials.grantRead(containerDefinition.taskDefinition.obtainExecutionRole());
    }

    return {
      imageName: this.imageName,
      repositoryCredentials: this.props.credentials && {
        credentialsParameter: this.props.credentials.secretArn
      }
    };
  }
}
