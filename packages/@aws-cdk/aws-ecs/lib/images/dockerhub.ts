import { ContainerDefinition } from "../container-definition";
import { IContainerImage } from "../container-image";

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
export class DockerHubImage implements IContainerImage {
  constructor(public readonly imageName: string) {
  }

  public bind(_containerDefinition: ContainerDefinition): void {
    // Nothing to do
  }
}
