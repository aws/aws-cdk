import * as ecr from '@aws-cdk/aws-ecr';
import { Construct } from 'constructs';
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, ContainerImageConfig } from '../container-image';
/**
 * A special type of `ContainerImage` that uses an ECR repository for the image,
 * but a CloudFormation Parameter for the tag of the image in that repository.
 * This allows providing this tag through the Parameter at deploy time,
 * for example in a CodePipeline that pushes a new tag of the image to the repository during a build step,
 * and then provides that new tag through the CloudFormation Parameter in the deploy step.
 *
 * @see #tagParameterName
 */
export declare class TagParameterContainerImage extends ContainerImage {
    private readonly repository;
    private imageTagParameter?;
    constructor(repository: ecr.IRepository);
    bind(scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig;
    /**
     * Returns the name of the CloudFormation Parameter that represents the tag of the image
     * in the ECR repository.
     */
    get tagParameterName(): string;
    /**
     * Returns the value of the CloudFormation Parameter that represents the tag of the image
     * in the ECR repository.
     */
    get tagParameterValue(): string;
}
