import { ContainerDefinition } from './container-definition';

export abstract class ContainerImage {
  public abstract readonly imageName: string;
  public abstract bind(containerDefinition: ContainerDefinition): void;
}

export class DockerHub {
  public static image(name: string): ContainerImage {
    return new DockerHubImage(name);
  }
}

class DockerHubImage {
  constructor(public readonly imageName: string) {
  }

  public bind(_containerDefinition: ContainerDefinition): void {
    // Nothing
  }
}