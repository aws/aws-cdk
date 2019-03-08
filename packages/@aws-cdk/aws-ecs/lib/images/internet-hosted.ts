import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import { ContainerDefinition } from "../container-definition";
import { ContainerImage, RepositoryCreds } from "../container-image";
import { CfnTaskDefinition } from '../ecs.generated';

export interface InternetHostedImageProps {
    /**
     * Optional secret that houses credentials for the image registry
     */
    credentials?: secretsmanager.ISecret;
}

/**
 * A container image hosted on DockerHub or another online registry
 */
export class InternetHostedImage extends ContainerImage {
  public readonly imageName: string;
  protected readonly credentials?: RepositoryCreds;

  constructor(imageName: string, props: InternetHostedImageProps = {}) {
    super();
    this.imageName = imageName;

    if (props.credentials !== undefined) {
        this.credentials = { secret: props.credentials };
    }
  }

  public bind(containerDefinition: ContainerDefinition): void {
    if (this.credentials !== undefined) {
        this.credentials.secret.grantRead(containerDefinition.taskDefinition.obtainExecutionRole());
    }
  }

  public renderRepositoryCredentials(): CfnTaskDefinition.RepositoryCredentialsProperty | undefined {
    if (!this.credentials) { return undefined; }
    return {
        credentialsParameter: this.credentials.secret.secretArn
    };
  }
}
