import ecr = require('@aws-cdk/aws-ecr');
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, RepositoryCreds } from '../container-image';

/**
 * An image from an ECR repository
 */
export class EcrImage extends ContainerImage {
  public readonly imageName: string;
  public readonly credentials?: RepositoryCreds;
  private readonly repository: ecr.IRepository;

  constructor(repository: ecr.IRepository, tag: string) {
    super();
    this.imageName = repository.repositoryUriForTag(tag);
    this.repository = repository;
  }

  public bind(containerDefinition: ContainerDefinition): void {
    this.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
  }
}
