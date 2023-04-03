import * as ecr from '@aws-cdk/aws-ecr';
import { Construct } from 'constructs';
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, ContainerImageConfig } from '../container-image';
/**
 * An image from an Amazon ECR repository.
 */
export declare class EcrImage extends ContainerImage {
    private readonly repository;
    private readonly tagOrDigest;
    /**
     * The image name. Images in Amazon ECR repositories can be specified by either using the full registry/repository:tag or
     * registry/repository@digest.
     *
     * For example, 012345678910.dkr.ecr.<region-name>.amazonaws.com/<repository-name>:latest or
     * 012345678910.dkr.ecr.<region-name>.amazonaws.com/<repository-name>@sha256:94afd1f2e64d908bc90dbca0035a5b567EXAMPLE.
     */
    readonly imageName: string;
    /**
     * Constructs a new instance of the EcrImage class.
     */
    constructor(repository: ecr.IRepository, tagOrDigest: string);
    bind(_scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig;
}
