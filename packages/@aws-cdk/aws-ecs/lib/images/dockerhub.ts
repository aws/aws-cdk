import { ContainerDefinition } from "../container-definition";
import { ContainerImage } from "../container-image";

/**
 * A DockerHub image
 */
export class DockerHubImage extends ContainerImage {
  constructor(public readonly imageName: string) {
    super();
  }

  public bind(_containerDefinition: ContainerDefinition): void {
    // Nothing to do
  }
}
