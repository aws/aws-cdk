import { ContainerDefinition } from './container-definition';

/**
 * A container image
 */
export interface IContainerImage {
  /**
   * Name of the image
   */
  readonly imageName: string;

  /**
   * Called when the image is used by a ContainerDefinition
   */
  bind(containerDefinition: ContainerDefinition): void;
}

/**
 * Factory for DockerHub images
 */
export class DockerHub {
  /**
   * Reference an image on DockerHub
   */
  public static image(name: string): IContainerImage {
    return new DockerHubImage(name);
  }
}

/**
 * A DockerHub image
 */
class DockerHubImage implements IContainerImage {
  constructor(public readonly imageName: string) {
  }

  public bind(_containerDefinition: ContainerDefinition): void {
    // Nothing to do
  }
}
