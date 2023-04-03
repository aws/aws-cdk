import * as ecr from '@aws-cdk/aws-ecr';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import { Construct } from 'constructs';
import { ContainerDefinition } from './container-definition';
import { CfnTaskDefinition } from './ecs.generated';
/**
 * Constructs for types of container images
 */
export declare abstract class ContainerImage {
    /**
     * Reference an image on DockerHub or another online registry
     */
    static fromRegistry(name: string, props?: RepositoryImageProps): RepositoryImage;
    /**
     * Reference an image in an ECR repository
     */
    static fromEcrRepository(repository: ecr.IRepository, tag?: string): EcrImage;
    /**
     * Reference an image that's constructed directly from sources on disk.
     *
     * If you already have a `DockerImageAsset` instance, you can use the
     * `ContainerImage.fromDockerImageAsset` method instead.
     *
     * @param directory The directory containing the Dockerfile
     */
    static fromAsset(directory: string, props?: AssetImageProps): AssetImage;
    /**
     * Use an existing `DockerImageAsset` for this container image.
     *
     * @param asset The `DockerImageAsset` to use for this container definition.
     */
    static fromDockerImageAsset(asset: DockerImageAsset): ContainerImage;
    /**
     * Use an existing tarball for this container image.
     *
     * Use this method if the container image has already been created by another process (e.g. jib)
     * and you want to add it as a container image asset.
     *
     * @param tarballFile Absolute path to the tarball. You can use language-specific idioms (such as `__dirname` in Node.js)
     *                    to create an absolute path based on the current script running directory.
     */
    static fromTarball(tarballFile: string): ContainerImage;
    /**
     * Called when the image is used by a ContainerDefinition
     */
    abstract bind(scope: Construct, containerDefinition: ContainerDefinition): ContainerImageConfig;
}
/**
 * The configuration for creating a container image.
 */
export interface ContainerImageConfig {
    /**
     * Specifies the name of the container image.
     */
    readonly imageName: string;
    /**
     * Specifies the credentials used to access the image repository.
     */
    readonly repositoryCredentials?: CfnTaskDefinition.RepositoryCredentialsProperty;
}
import { AssetImage, AssetImageProps } from './images/asset-image';
import { EcrImage } from './images/ecr';
import { RepositoryImage, RepositoryImageProps } from './images/repository';
