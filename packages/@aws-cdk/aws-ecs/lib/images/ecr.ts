import ecr = require('@aws-cdk/aws-ecr');
import { ContainerDefinition } from '../container-definition';
import { IContainerImage } from '../container-image';

/**
 * An image from an ECR repository
 */
export class EcrImage implements IContainerImage {
  public readonly imageName: string;
  private readonly repository: ecr.RepositoryRef;

  constructor(repository: ecr.RepositoryRef, tag: string) {
    this.imageName = `${repository.repositoryUri}:${tag}`;
    this.repository = repository;
  }

  public bind(containerDefinition: ContainerDefinition): void {
    this.repository.grantUseImage(containerDefinition.taskDefinition.obtainExecutionRole());
  }
}
