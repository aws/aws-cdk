import { DockerImageAsset } from '@aws-cdk/assets-docker';
import cdk = require('@aws-cdk/cdk');
import { ContainerDefinition } from '../container-definition';
import { IContainerImage } from '../container-image';

export interface AssetImageProps {
  /**
   * The directory where the Dockerfile is stored
   */
  directory: string;
}

/**
 * An image that will be built at synthesis time
 */
export class AssetImage extends DockerImageAsset implements IContainerImage {
  constructor(scope: cdk.Construct, scid: string, props: AssetImageProps) {
    super(scope, scid, { directory: props.directory });
  }

  public bind(containerDefinition: ContainerDefinition): void {
    this.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
  }

  public get imageName() {
    return this.imageUri;
  }
}
