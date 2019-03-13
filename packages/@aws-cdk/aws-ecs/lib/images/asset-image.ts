import { DockerImageAsset } from '@aws-cdk/assets-docker';
import cdk = require('@aws-cdk/cdk');
import { ContainerDefinition } from '../container-definition';
import { ContainerImage } from '../container-image';
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
  private readonly asset: DockerImageAsset;

  constructor(scope: cdk.Construct, id: string, props: AssetImageProps) {
    super();
    this.asset = new DockerImageAsset(scope, id, { directory: props.directory });
  }

  public bind(containerDefinition: ContainerDefinition): void {
    this.asset.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
  }

  public toRepositoryCredentialsJson(): CfnTaskDefinition.RepositoryCredentialsProperty | undefined {
      return undefined;
  }

  public get imageName() {
    return this.asset.imageUri;
  }
}
