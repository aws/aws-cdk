import type { Construct } from 'constructs';
import type * as ecr from '../../../aws-ecr';
import * as cdk from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import type { ContainerDefinition } from '../container-definition';
import type { ContainerImageConfig } from '../container-image';
import { ContainerImage } from '../container-image';

/**
 * Properties for `TagParameterContainerImage`.
 */
export interface TagParameterContainerImageProps {
  /**
   * Whether the CloudFormation Parameter holds an image digest (`sha256:...`) rather than a tag.
   *
   * When `true`, the separator between the repository URI and the parameter value is `@`
   * instead of `:`, producing `ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPO@sha256:...`.
   *
   * Use this when your pipeline passes a digest rather than a mutable tag.
   *
   * @default false
   */
  readonly imageDigest?: boolean;
}

/**
 * A special type of `ContainerImage` that uses an ECR repository for the image,
 * but a CloudFormation Parameter for the tag or digest of the image in that repository.
 * This allows providing this tag or digest through the Parameter at deploy time,
 * for example in a CodePipeline that pushes a new tag of the image to the repository during a build step,
 * and then provides that new tag through the CloudFormation Parameter in the deploy step.
 *
 * @see #tagParameterName
 */
export class TagParameterContainerImage extends ContainerImage {
  private readonly repository: ecr.IRepository;
  private readonly imageDigest: boolean;
  private imageTagParameter?: cdk.CfnParameter;

  public constructor(repository: ecr.IRepository, props: TagParameterContainerImageProps = {}) {
    super();
    this.repository = repository;
    this.imageDigest = props.imageDigest ?? false;
  }

  public bind(scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig {
    this.repository.grantPull(containerDefinition.taskDefinition.obtainExecutionRole());
    const imageTagParameter = new cdk.CfnParameter(scope, 'ImageTagParam');
    this.imageTagParameter = imageTagParameter;
    return {
      imageName: this.imageDigest
        ? this.repository.repositoryUriForDigest(imageTagParameter.valueAsString)
        : this.repository.repositoryUriForTag(imageTagParameter.valueAsString),
    };
  }

  /**
   * Returns the name of the CloudFormation Parameter that represents the tag or digest of the image
   * in the ECR repository.
   */
  public get tagParameterName(): string {
    return cdk.Lazy.string({
      produce: () => {
        if (this.imageTagParameter) {
          return this.imageTagParameter.logicalId;
        } else {
          throw new cdk.UnscopedValidationError(lit`TagParameterNotBound`, 'TagParameterContainerImage must be used in a container definition when using tagParameterName');
        }
      },
    });
  }

  /**
   * Returns the value of the CloudFormation Parameter that represents the tag or digest of the image
   * in the ECR repository.
   */
  public get tagParameterValue(): string {
    return cdk.Lazy.string({
      produce: () => {
        if (this.imageTagParameter) {
          return this.imageTagParameter.valueAsString;
        } else {
          throw new cdk.UnscopedValidationError(lit`TagParameterNotBound`, 'TagParameterContainerImage must be used in a container definition when using tagParameterValue');
        }
      },
    });
  }
}
