import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from "../container-definition";
import { ContainerImage, ContainerImageConfig } from "../container-image";

export interface RepositoryImageProps {
  /**
   * Optional secret that houses credentials for the image registry
   */
  readonly credentials?: secretsmanager.ISecret;
}

/**
 * A container image hosted on DockerHub or another online registry
 */
export class RepositoryImage extends ContainerImage {

  constructor(private readonly imageName: string, private readonly props: RepositoryImageProps = {}) {
    super();
  }

  public bind(_scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig {
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
