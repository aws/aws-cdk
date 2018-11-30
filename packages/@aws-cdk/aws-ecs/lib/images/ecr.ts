import ecr = require('@aws-cdk/aws-ecr');
import { ContainerDefinition } from '../container-definition';
import { IContainerImage } from '../container-image';

/**
 * An image from an ECR repository
 */
export class EcrImage implements IContainerImage {
  public readonly imageName: string;
  private readonly repository: ecr.IRepository;

  constructor(repository: ecr.IRepository, tag: string) {
    this.imageName = repository.repositoryUriForTag(tag);
    this.repository = repository;
  }

  public bind(containerDefinition: ContainerDefinition): void {
    this.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
  }
}
