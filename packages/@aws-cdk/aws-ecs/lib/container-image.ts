import { ContainerDefinition } from './container-definition';

/**
 * Base class for container images
 */
export abstract class ContainerImage {
  /**
   * Name of the image
   */
  public abstract readonly imageName: string;

  /**
   * Called when the image is used by a ContainerDefinition
   */
  public abstract bind(containerDefinition: ContainerDefinition): void;
}

/**
 * Factory for DockerHub images
 */
export class DockerHub {
  /**
   * Reference an image on DockerHub
   */
  public static image(name: string): ContainerImage {
    return new DockerHubImage(name);
  }
}

/**
 * A DockerHub image
 */
class DockerHubImage {
  constructor(public readonly imageName: string) {
  }

  public bind(_containerDefinition: ContainerDefinition): void {
    // Nothing
  }
}