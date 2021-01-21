import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, ContainerImageConfig } from '../container-image';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * A special type of {@link ContainerImage} that uses an ECR repository for the image,
 * but a CloudFormation Parameter for the tag of the image in that repository.
 * This allows providing this tag through the Parameter at deploy time,
 * for example in a CodePipeline that pushes a new tag of the image to the repository during a build step,
 * and then provides that new tag through the CloudFormation Parameter in the deploy step.
 *
 * @see #tagParameterName
 */
export class TagParameterContainerImage extends ContainerImage {
  private readonly repository: ecr.IRepository;
  private imageTagParameter?: cdk.CfnParameter;

  public constructor(repository: ecr.IRepository) {
    super();
    this.repository = repository;
  }

  public bind(scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig {
    this.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
    const imageTagParameter = new cdk.CfnParameter(scope, 'ImageTagParam');
    this.imageTagParameter = imageTagParameter;
    return {
      imageName: this.repository.repositoryUriForTag(imageTagParameter.valueAsString),
    };
  }

  /**
   * Returns the name of the CloudFormation Parameter that represents the tag of the image
   * in the ECR repository.
   */
  public get tagParameterName(): string {
    return cdk.Lazy.string({
      produce: () => {
        if (this.imageTagParameter) {
          return this.imageTagParameter.logicalId;
        } else {
          throw new Error('TagParameterContainerImage must be used in a container definition when using tagParameterName');
        }
      },
    });
  }
}
