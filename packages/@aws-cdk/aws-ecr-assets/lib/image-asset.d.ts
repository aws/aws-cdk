import { FingerprintOptions, IAsset } from '@aws-cdk/assets';
import * as ecr from '@aws-cdk/aws-ecr';
import { FileFingerprintOptions, CfnResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * networking mode on build time supported by docker
 */
export declare class NetworkMode {
    readonly mode: string;
    /**
     * The default networking mode if omitted, create a network stack on the default Docker bridge
     */
    static readonly DEFAULT: NetworkMode;
    /**
     * Use the Docker host network stack
     */
    static readonly HOST: NetworkMode;
    /**
     * Disable the network stack, only the loopback device will be created
     */
    static readonly NONE: NetworkMode;
    /**
     * Reuse another container's network stack
     *
     * @param containerId The target container's id or name
     */
    static fromContainer(containerId: string): NetworkMode;
    /**
     * Used to specify a custom networking mode
     * Use this if the networking mode name is not yet supported by the CDK.
     *
     * @param mode The networking mode to use for docker build
     */
    static custom(mode: string): NetworkMode;
    /**
     * @param mode The networking mode to use for docker build
     */
    private constructor();
}
/**
 * platform supported by docker
 */
export declare class Platform {
    readonly platform: string;
    /**
     * Build for linux/amd64
     */
    static readonly LINUX_AMD64: Platform;
    /**
     * Build for linux/arm64
     */
    static readonly LINUX_ARM64: Platform;
    /**
     * Used to specify a custom platform
     * Use this if the platform name is not yet supported by the CDK.
     *
     * @param platform The platform to use for docker build
     */
    static custom(platform: string): Platform;
    /**
     * @param platform The platform to use for docker build
     */
    private constructor();
}
/**
 * Options to control invalidation of `DockerImageAsset` asset hashes
 */
export interface DockerImageAssetInvalidationOptions {
    /**
     * Use `extraHash` while calculating the asset hash
     *
     * @default true
     */
    readonly extraHash?: boolean;
    /**
     * Use `buildArgs` while calculating the asset hash
     *
     * @default true
     */
    readonly buildArgs?: boolean;
    /**
     * Use `buildSecrets` while calculating the asset hash
     *
     * @default true
     */
    readonly buildSecrets?: boolean;
    /**
     * Use `target` while calculating the asset hash
     *
     * @default true
     */
    readonly target?: boolean;
    /**
     * Use `file` while calculating the asset hash
     *
     * @default true
     */
    readonly file?: boolean;
    /**
     * Use `repositoryName` while calculating the asset hash
     *
     * @default true
     */
    readonly repositoryName?: boolean;
    /**
     * Use `networkMode` while calculating the asset hash
     *
     * @default true
     */
    readonly networkMode?: boolean;
    /**
     * Use `platform` while calculating the asset hash
     *
     * @default true
     */
    readonly platform?: boolean;
    /**
     * Use `outputs` while calculating the asset hash
     *
     * @default true
     */
    readonly outputs?: boolean;
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
     * @example { ref: `12345678.dkr.ecr.us-west-2.amazonaws.com/cache:${branch}`, mode: "max" }
     */
    readonly params?: {
        [key: string]: string;
    };
}
/**
 * Options for DockerImageAsset
 */
export interface DockerImageAssetOptions extends FingerprintOptions, FileFingerprintOptions {
    /**
     * ECR repository name
     *
     * Specify this property if you need to statically address the image, e.g.
     * from a Kubernetes Pod. Note, this is only the repository name, without the
     * registry and the tag parts.
     *
     * @default - the default ECR repository for CDK assets
     * @deprecated to control the location of docker image assets, please override
     * `Stack.addDockerImageAsset`. this feature will be removed in future
     * releases.
     */
    readonly repositoryName?: string;
    /**
     * Build args to pass to the `docker build` command.
     *
     * Since Docker build arguments are resolved before deployment, keys and
     * values cannot refer to unresolved tokens (such as `lambda.functionArn` or
     * `queue.queueUrl`).
     *
     * @default - no build args are passed
     */
    readonly buildArgs?: {
        [key: string]: string;
    };
    /**
     * Build secrets.
     *
     * Docker BuildKit must be enabled to use build secrets.
     *
     * @see https://docs.docker.com/build/buildkit/
     *
     * @default - no build secrets
     *
     * @example
     *
     * {
     *   'MY_SECRET': DockerBuildSecret.fromSrc('file.txt')
     * }
     */
    readonly buildSecrets?: {
        [key: string]: string;
    };
    /**
     * Docker target to build to
     *
     * @default - no target
     */
    readonly target?: string;
    /**
     * Path to the Dockerfile (relative to the directory).
     *
     * @default 'Dockerfile'
     */
    readonly file?: string;
    /**
     * Networking mode for the RUN commands during build. Support docker API 1.25+.
     *
     * @default - no networking mode specified (the default networking mode `NetworkMode.DEFAULT` will be used)
     */
    readonly networkMode?: NetworkMode;
    /**
     * Platform to build for. _Requires Docker Buildx_.
     *
     * @default - no platform specified (the current machine architecture will be used)
     */
    readonly platform?: Platform;
    /**
     * Options to control which parameters are used to invalidate the asset hash.
     *
     * @default - hash all parameters
     */
    readonly invalidation?: DockerImageAssetInvalidationOptions;
    /**
     * Outputs to pass to the `docker build` command.
     *
     * @default - no outputs are passed to the build command (default outputs are used)
     * @see https://docs.docker.com/engine/reference/commandline/build/#custom-build-outputs
     */
    readonly outputs?: string[];
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
}
/**
 * Props for DockerImageAssets
 */
export interface DockerImageAssetProps extends DockerImageAssetOptions {
    /**
     * The directory where the Dockerfile is stored
     *
     * Any directory inside with a name that matches the CDK output folder (cdk.out by default) will be excluded from the asset
     */
    readonly directory: string;
}
/**
 * An asset that represents a Docker image.
 *
 * The image will be created in build time and uploaded to an ECR repository.
 */
export declare class DockerImageAsset extends Construct implements IAsset {
    /**
     * The full URI of the image (including a tag). Use this reference to pull
     * the asset.
     */
    imageUri: string;
    /**
     * Repository where the image is stored
     */
    repository: ecr.IRepository;
    /**
     * A hash of the source of this asset, which is available at construction time. As this is a plain
     * string, it can be used in construct IDs in order to enforce creation of a new resource when
     * the content hash has changed.
     * @deprecated use assetHash
     */
    readonly sourceHash: string;
    /**
     * A hash of this asset, which is available at construction time. As this is a plain string, it
     * can be used in construct IDs in order to enforce creation of a new resource when the content
     * hash has changed.
     */
    readonly assetHash: string;
    /**
     * The tag of this asset when it is uploaded to ECR. The tag may differ from the assetHash if a stack synthesizer adds a dockerTagPrefix.
     */
    readonly imageTag: string;
    /**
     * The path to the asset, relative to the current Cloud Assembly
     *
     * If asset staging is disabled, this will just be the original path.
     *
     * If asset staging is enabled it will be the staged path.
     */
    private readonly assetPath;
    /**
     * The path to the Dockerfile, relative to the assetPath
     */
    private readonly dockerfilePath?;
    /**
     * Build args to pass to the `docker build` command.
     */
    private readonly dockerBuildArgs?;
    /**
     * Build secrets to pass to the `docker build` command.
     */
    private readonly dockerBuildSecrets?;
    /**
     * Outputs to pass to the `docker build` command.
     */
    private readonly dockerOutputs?;
    /**
     * Cache from options to pass to the `docker build` command.
     */
    private readonly dockerCacheFrom?;
    /**
     * Cache to options to pass to the `docker build` command.
     */
    private readonly dockerCacheTo?;
    /**
     * Docker target to build to
     */
    private readonly dockerBuildTarget?;
    constructor(scope: Construct, id: string, props: DockerImageAssetProps);
    /**
     * Adds CloudFormation template metadata to the specified resource with
     * information that indicates which resource property is mapped to this local
     * asset. This can be used by tools such as SAM CLI to provide local
     * experience such as local invocation and debugging of Lambda functions.
     *
     * Asset metadata will only be included if the stack is synthesized with the
     * "aws:cdk:enable-asset-metadata" context key defined, which is the default
     * behavior when synthesizing via the CDK Toolkit.
     *
     * @see https://github.com/aws/aws-cdk/issues/1432
     *
     * @param resource The CloudFormation resource which is using this asset [disable-awslint:ref-via-interface]
     * @param resourceProperty The property name where this asset is referenced
     */
    addResourceMetadata(resource: CfnResource, resourceProperty: string): void;
}
