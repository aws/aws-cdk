import { DockerImageAsset } from '@aws-cdk/assets-docker';
import cdk = require('@aws-cdk/cdk');
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, RepositoryCreds } from '../container-image';
import { CfnTaskDefinition } from '../ecs.generated';

export interface AssetImageProps {
  /**
   * The directory where the Dockerfile is stored
   */
  directory: string;
}

/**
 * An image that will be built at synthesis time
 */
export class AssetImage extends ContainerImage {
  protected readonly credentials?: RepositoryCreds;
  private readonly asset: DockerImageAsset;

  constructor(scope: cdk.Construct, id: string, props: AssetImageProps) {
    super();
    this.asset = new DockerImageAsset(scope, id, { directory: props.directory });
  }

  public bind(containerDefinition: ContainerDefinition): void {
    this.asset.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
  }

  public renderRepositoryCredentials(): CfnTaskDefinition.RepositoryCredentialsProperty | undefined {
      return undefined;
  }

  public get imageName() {
    return this.asset.imageUri;
  }
}
