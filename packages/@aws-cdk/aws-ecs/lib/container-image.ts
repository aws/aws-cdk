import { ContainerDefinition } from './container-definition';

export interface IContainerImage {
  readonly imageName: string;
  bind(containerDefinition: ContainerDefinition): void;
}

export class DockerHub {
  public static image(name: string): IContainerImage {
    return new DockerHubImage(name);
  }
}

class DockerHubImage implements IContainerImage {
  constructor(public readonly imageName: string) {
  }

  public bind(_containerDefinition: ContainerDefinition): void {
    // Nothing to do
  }
}
