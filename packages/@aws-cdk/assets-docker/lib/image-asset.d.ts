import assets = require('@aws-cdk/assets');
import ecr = require('@aws-cdk/aws-ecr');
import cdk = require('@aws-cdk/cdk');
export interface DockerImageAssetProps extends assets.CopyOptions {
    /**
     * The directory where the Dockerfile is stored
     */
    readonly directory: string;
    /**
     * ECR repository name
     *
     * Specify this property if you need to statically address the image, e.g.
     * from a Kubernetes Pod. Note, this is only the repository name, without the
     * registry and the tag parts.
     *
     * @default automatically derived from the asset's ID.
     */
    readonly repositoryName?: string;
    /**
     * Build args to pass to the `docker build` command
     *
     * @default no build args are passed
     */
    readonly buildArgs?: {
        [key: string]: string;
    };
}
/**
 * An asset that represents a Docker image.
 *
 * The image will be created in build time and uploaded to an ECR repository.
 */
export declare class DockerImageAsset extends cdk.Construct implements assets.IAsset {
    /**
     * The full URI of the image (including a tag). Use this reference to pull
     * the asset.
     */
    imageUri: string;
    /**
     * Repository where the image is stored
     */
    repository: ecr.IRepository;
    readonly sourceHash: string;
    readonly artifactHash: string;
    /**
     * Directory where the source files are stored
     */
    private readonly directory;
    constructor(scope: cdk.Construct, id: string, props: DockerImageAssetProps);
}
