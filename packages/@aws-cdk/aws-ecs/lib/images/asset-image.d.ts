import { DockerImageAssetOptions } from '@aws-cdk/aws-ecr-assets';
import { Construct } from 'constructs';
import { ContainerDefinition } from '../container-definition';
import { ContainerImage, ContainerImageConfig } from '../container-image';
/**
 * The properties for building an AssetImage.
 */
export interface AssetImageProps extends DockerImageAssetOptions {
}
/**
 * An image that will be built from a local directory with a Dockerfile
 */
export declare class AssetImage extends ContainerImage {
    private readonly directory;
    private readonly props;
    /**
     * Constructs a new instance of the AssetImage class.
     *
     * @param directory The directory containing the Dockerfile
     */
    constructor(directory: string, props?: AssetImageProps);
    bind(scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig;
}
