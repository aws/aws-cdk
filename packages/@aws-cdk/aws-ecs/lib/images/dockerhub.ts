import { ContainerDefinition } from "../container-definition";
import { IContainerImage } from "../container-image";

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
