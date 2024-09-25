import { AwsDestination } from './aws-destination';
/**
 * A file asset
 */
export interface DockerImageAsset {
    /**
     * Source description for file assets
     */
    readonly source: DockerImageSource;
    /**
     * Destinations for this file asset
     */
    readonly destinations: {
        [id: string]: DockerImageDestination;
    };
}
/**
 * Properties for how to produce a Docker image from a source
 */
export interface DockerImageSource {
    /**
     * The directory containing the Docker image build instructions.
     *
     * This path is relative to the asset manifest location.
     *
     * @default - Exactly one of `directory` and `executable` is required
     */
    readonly directory?: string;
    /**
     * A command-line executable that returns the name of a local
     * Docker image on stdout after being run.
     *
     * @default - Exactly one of `directory` and `executable` is required
     */
    readonly executable?: string[];
    /**
     * The name of the file with build instructions
     *
     * Only allowed when `directory` is set.
     *
     * @default "Dockerfile"
     */
    readonly dockerFile?: string;
    /**
     * Target build stage in a Dockerfile with multiple build stages
     *
     * Only allowed when `directory` is set.
     *
     * @default - The last stage in the Dockerfile
     */
    readonly dockerBuildTarget?: string;
    /**
     * Additional build arguments
     *
     * Only allowed when `directory` is set.
     *
     * @default - No additional build arguments
     */
    readonly dockerBuildArgs?: {
        [name: string]: string;
    };
    /**
     * SSH agent socket or keys
     *
     * Requires building with docker buildkit.
     *
     * @default - No ssh flag is set
     */
    readonly dockerBuildSsh?: string;
    /**
     * Additional build secrets
     *
     * Only allowed when `directory` is set.
     *
     * @default - No additional build secrets
     */
    readonly dockerBuildSecrets?: {
        [name: string]: string;
    };
    /**
     * Networking mode for the RUN commands during build. _Requires Docker Engine API v1.25+_.
     *
     * Specify this property to build images on a specific networking mode.
     *
     * @default - no networking mode specified
     */
    readonly networkMode?: string;
    /**
     * Platform to build for. _Requires Docker Buildx_.
     *
     * Specify this property to build images on a specific platform/architecture.
     *
     * @default - current machine platform
     */
    readonly platform?: string;
    /**
     * Outputs
     *
     * @default - no outputs are passed to the build command (default outputs are used)
     * @see https://docs.docker.com/engine/reference/commandline/build/#custom-build-outputs
     */
    readonly dockerOutputs?: string[];
    /**
     * Cache from options to pass to the `docker build` command.
     *
     * @default - no cache from options are passed to the build command
     * @see https://docs.docker.com/build/cache/backends/
     */
    readonly cacheFrom?: DockerCacheOption[];
    /**
     * Cache to options to pass to the `docker build` command.
     *
     * @default - no cache to options are passed to the build command
     * @see https://docs.docker.com/build/cache/backends/
     */
    readonly cacheTo?: DockerCacheOption;
    /**
     * Disable the cache and pass `--no-cache` to the `docker build` command.
     *
     * @default - cache is used
     */
    readonly cacheDisabled?: boolean;
}
/**
 * Where to publish docker images
 */
export interface DockerImageDestination extends AwsDestination {
    /**
     * Name of the ECR repository to publish to
     */
    readonly repositoryName: string;
    /**
     * Tag of the image to publish
     */
    readonly imageTag: string;
}
/**
 * Options for configuring the Docker cache backend
 */
export interface DockerCacheOption {
    /**
     * The type of cache to use.
     * Refer to https://docs.docker.com/build/cache/backends/ for full list of backends.
     * @default - unspecified
     *
     * @example 'registry'
     */
    readonly type: string;
    /**
     * Any parameters to pass into the docker cache backend configuration.
     * Refer to https://docs.docker.com/build/cache/backends/ for cache backend configuration.
     * @default {} No options provided
     *
     * @example
     * declare const branch: string;
     *
     * const params = {
     *   ref: `12345678.dkr.ecr.us-west-2.amazonaws.com/cache:${branch}`,
     *   mode: "max",
     * };
     */
    readonly params?: {
        [key: string]: string;
    };
}
