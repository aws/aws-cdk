import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import { ContainerDefinition } from "../container-definition";
import { ContainerImage, RepositoryCreds } from "../container-image";

export interface InternetHostedImageProps {
    /**
     * Optional secret that houses credentials for the image registry
     */
    credentials?: secretsmanager.ISecret;
}

/**
 * A DockerHub image
 */
export class DockerHubImage extends ContainerImage {
  public readonly imageName: string;
  public readonly credentials?: RepositoryCreds;

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
}
