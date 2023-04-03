import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Construct } from 'constructs';
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, ContainerImageConfig } from '../container-image';
/**
 * The properties for an image hosted in a public or private repository.
 */
export interface RepositoryImageProps {
    /**
     * The secret to expose to the container that contains the credentials for the image repository.
     * The supported value is the full ARN of an AWS Secrets Manager secret.
     */
    readonly credentials?: secretsmanager.ISecret;
}
/**
 * An image hosted in a public or private repository. For images hosted in Amazon ECR, see
 * [EcrImage](https://docs.aws.amazon.com/AmazonECR/latest/userguide/images.html).
 */
export declare class RepositoryImage extends ContainerImage {
    private readonly imageName;
    private readonly props;
    /**
     * Constructs a new instance of the RepositoryImage class.
     */
    constructor(imageName: string, props?: RepositoryImageProps);
    bind(scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig;
}
