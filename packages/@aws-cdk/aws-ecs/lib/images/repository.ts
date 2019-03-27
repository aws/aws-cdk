import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import { ContainerDefinition } from "../container-definition";
import { ContainerImage } from "../container-image";
import { CfnTaskDefinition } from '../ecs.generated';

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
  public readonly imageName: string;

  private credentialsSecret?: secretsmanager.ISecret;

  constructor(imageName: string, props: RepositoryImageProps = {}) {
    super();
    this.imageName = imageName;
    this.credentialsSecret = props.credentials;
  }

  public bind(containerDefinition: ContainerDefinition): void {
    if (this.credentialsSecret) {
      this.credentialsSecret.grantRead(containerDefinition.taskDefinition.obtainExecutionRole());
    }
  }

  public toRepositoryCredentialsJson(): CfnTaskDefinition.RepositoryCredentialsProperty | undefined {
    if (!this.credentialsSecret) { return undefined; }
    return {
      credentialsParameter: this.credentialsSecret.secretArn
    };
  }
}
