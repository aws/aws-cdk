"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerImageAsset = exports.Platform = exports.NetworkMode = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const assets_1 = require("@aws-cdk/assets");
const ecr = require("@aws-cdk/aws-ecr");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
/**
 * networking mode on build time supported by docker
 */
class NetworkMode {
    /**
     * @param mode The networking mode to use for docker build
     */
    constructor(mode) {
        this.mode = mode;
    }
    /**
     * Reuse another container's network stack
     *
     * @param containerId The target container's id or name
     */
    static fromContainer(containerId) {
        return new NetworkMode(`container:${containerId}`);
    }
    /**
     * Used to specify a custom networking mode
     * Use this if the networking mode name is not yet supported by the CDK.
     *
     * @param mode The networking mode to use for docker build
     */
    static custom(mode) {
        return new NetworkMode(mode);
    }
}
exports.NetworkMode = NetworkMode;
_a = JSII_RTTI_SYMBOL_1;
NetworkMode[_a] = { fqn: "@aws-cdk/aws-ecr-assets.NetworkMode", version: "0.0.0" };
/**
 * The default networking mode if omitted, create a network stack on the default Docker bridge
 */
NetworkMode.DEFAULT = new NetworkMode('default');
/**
 * Use the Docker host network stack
 */
NetworkMode.HOST = new NetworkMode('host');
/**
 * Disable the network stack, only the loopback device will be created
 */
NetworkMode.NONE = new NetworkMode('none');
/**
 * platform supported by docker
 */
class Platform {
    /**
     * @param platform The platform to use for docker build
     */
    constructor(platform) {
        this.platform = platform;
    }
    /**
     * Used to specify a custom platform
     * Use this if the platform name is not yet supported by the CDK.
     *
     * @param platform The platform to use for docker build
     */
    static custom(platform) {
        return new Platform(platform);
    }
}
exports.Platform = Platform;
_b = JSII_RTTI_SYMBOL_1;
Platform[_b] = { fqn: "@aws-cdk/aws-ecr-assets.Platform", version: "0.0.0" };
/**
 * Build for linux/amd64
 */
Platform.LINUX_AMD64 = new Platform('linux/amd64');
/**
 * Build for linux/arm64
 */
Platform.LINUX_ARM64 = new Platform('linux/arm64');
/**
 * An asset that represents a Docker image.
 *
 * The image will be created in build time and uploaded to an ECR repository.
 */
class DockerImageAsset extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_assets_DockerImageAssetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, DockerImageAsset);
            }
            throw error;
        }
        // none of the properties use tokens
        validateProps(props);
        // resolve full path
        const dir = path.resolve(props.directory);
        if (!fs.existsSync(dir)) {
            throw new Error(`Cannot find image directory at ${dir}`);
        }
        // validate the docker file exists
        this.dockerfilePath = props.file || 'Dockerfile';
        const file = path.join(dir, this.dockerfilePath);
        if (!fs.existsSync(file)) {
            throw new Error(`Cannot find file at ${file}`);
        }
        const defaultIgnoreMode = core_1.FeatureFlags.of(this).isEnabled(cxapi.DOCKER_IGNORE_SUPPORT)
            ? core_1.IgnoreMode.DOCKER : core_1.IgnoreMode.GLOB;
        let ignoreMode = props.ignoreMode ?? defaultIgnoreMode;
        let exclude = props.exclude || [];
        const ignore = path.join(dir, '.dockerignore');
        if (fs.existsSync(ignore)) {
            const dockerIgnorePatterns = fs.readFileSync(ignore).toString().split('\n').filter(e => !!e);
            exclude = [
                ...dockerIgnorePatterns,
                ...exclude,
                // Ensure .dockerignore is included no matter what.
                '!.dockerignore',
            ];
        }
        // Ensure the Dockerfile is included no matter what.
        exclude.push('!' + path.basename(file));
        // Ensure the cdk.out folder is not included to avoid infinite loops.
        const cdkout = core_1.Stage.of(this)?.outdir ?? 'cdk.out';
        exclude.push(cdkout);
        if (props.repositoryName) {
            core_1.Annotations.of(this).addWarning('DockerImageAsset.repositoryName is deprecated. Override "core.Stack.addDockerImageAsset" to control asset locations');
        }
        // include build context in "extra" so it will impact the hash
        const extraHash = {};
        if (props.invalidation?.extraHash !== false && props.extraHash) {
            extraHash.user = props.extraHash;
        }
        if (props.invalidation?.buildArgs !== false && props.buildArgs) {
            extraHash.buildArgs = props.buildArgs;
        }
        if (props.invalidation?.buildSecrets !== false && props.buildSecrets) {
            extraHash.buildSecrets = props.buildSecrets;
        }
        if (props.invalidation?.target !== false && props.target) {
            extraHash.target = props.target;
        }
        if (props.invalidation?.file !== false && props.file) {
            extraHash.file = props.file;
        }
        if (props.invalidation?.repositoryName !== false && props.repositoryName) {
            extraHash.repositoryName = props.repositoryName;
        }
        if (props.invalidation?.networkMode !== false && props.networkMode) {
            extraHash.networkMode = props.networkMode;
        }
        if (props.invalidation?.platform !== false && props.platform) {
            extraHash.platform = props.platform;
        }
        if (props.invalidation?.outputs !== false && props.outputs) {
            extraHash.outputs = props.outputs;
        }
        // add "salt" to the hash in order to invalidate the image in the upgrade to
        // 1.21.0 which removes the AdoptedRepository resource (and will cause the
        // deletion of the ECR repository the app used).
        extraHash.version = '1.21.0';
        const staging = new core_1.AssetStaging(this, 'Staging', {
            ...props,
            follow: props.followSymlinks ?? toSymlinkFollow(props.follow),
            exclude,
            ignoreMode,
            sourcePath: dir,
            extraHash: Object.keys(extraHash).length === 0
                ? undefined
                : JSON.stringify(extraHash),
        });
        this.sourceHash = staging.assetHash;
        this.assetHash = staging.assetHash;
        const stack = core_1.Stack.of(this);
        this.assetPath = staging.relativeStagedPath(stack);
        this.dockerBuildArgs = props.buildArgs;
        this.dockerBuildSecrets = props.buildSecrets;
        this.dockerBuildTarget = props.target;
        this.dockerOutputs = props.outputs;
        this.dockerCacheFrom = props.cacheFrom;
        this.dockerCacheTo = props.cacheTo;
        const location = stack.synthesizer.addDockerImageAsset({
            directoryName: this.assetPath,
            dockerBuildArgs: this.dockerBuildArgs,
            dockerBuildSecrets: this.dockerBuildSecrets,
            dockerBuildTarget: this.dockerBuildTarget,
            dockerFile: props.file,
            sourceHash: staging.assetHash,
            networkMode: props.networkMode?.mode,
            platform: props.platform?.platform,
            dockerOutputs: this.dockerOutputs,
            dockerCacheFrom: this.dockerCacheFrom,
            dockerCacheTo: this.dockerCacheTo,
        });
        this.repository = ecr.Repository.fromRepositoryName(this, 'Repository', location.repositoryName);
        this.imageUri = location.imageUri;
        this.imageTag = location.imageTag ?? this.assetHash;
    }
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
    addResourceMetadata(resource, resourceProperty) {
        if (!this.node.tryGetContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT)) {
            return; // not enabled
        }
        // tell tools such as SAM CLI that the resourceProperty of this resource
        // points to a local path and include the path to de dockerfile, docker build args, and target,
        // in order to enable local invocation of this function.
        resource.cfnOptions.metadata = resource.cfnOptions.metadata || {};
        resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_PATH_KEY] = this.assetPath;
        resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_DOCKERFILE_PATH_KEY] = this.dockerfilePath;
        resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_DOCKER_BUILD_ARGS_KEY] = this.dockerBuildArgs;
        resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_DOCKER_BUILD_SECRETS_KEY] = this.dockerBuildSecrets;
        resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_DOCKER_BUILD_TARGET_KEY] = this.dockerBuildTarget;
        resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY] = resourceProperty;
        resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_DOCKER_OUTPUTS_KEY] = this.dockerOutputs;
        resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_DOCKER_CACHE_FROM_KEY] = this.dockerCacheFrom;
        resource.cfnOptions.metadata[cxapi.ASSET_RESOURCE_METADATA_DOCKER_CACHE_TO_KEY] = this.dockerCacheTo;
    }
}
exports.DockerImageAsset = DockerImageAsset;
_c = JSII_RTTI_SYMBOL_1;
DockerImageAsset[_c] = { fqn: "@aws-cdk/aws-ecr-assets.DockerImageAsset", version: "0.0.0" };
function validateProps(props) {
    for (const [key, value] of Object.entries(props)) {
        if (core_1.Token.isUnresolved(value)) {
            throw new Error(`Cannot use Token as value of '${key}': this value is used before deployment starts`);
        }
    }
    validateBuildArgs(props.buildArgs);
    validateBuildSecrets(props.buildSecrets);
}
function validateBuildProps(buildPropName, buildProps) {
    for (const [key, value] of Object.entries(buildProps || {})) {
        if (core_1.Token.isUnresolved(key) || core_1.Token.isUnresolved(value)) {
            throw new Error(`Cannot use tokens in keys or values of "${buildPropName}" since they are needed before deployment`);
        }
    }
}
function validateBuildArgs(buildArgs) {
    validateBuildProps('buildArgs', buildArgs);
}
function validateBuildSecrets(buildSecrets) {
    validateBuildProps('buildSecrets', buildSecrets);
}
function toSymlinkFollow(follow) {
    switch (follow) {
        case undefined: return undefined;
        case assets_1.FollowMode.NEVER: return core_1.SymlinkFollowMode.NEVER;
        case assets_1.FollowMode.ALWAYS: return core_1.SymlinkFollowMode.ALWAYS;
        case assets_1.FollowMode.BLOCK_EXTERNAL: return core_1.SymlinkFollowMode.BLOCK_EXTERNAL;
        case assets_1.FollowMode.EXTERNAL: return core_1.SymlinkFollowMode.EXTERNAL;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtYXNzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbWFnZS1hc3NldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDRDQUF5RTtBQUN6RSx3Q0FBd0M7QUFDeEMsd0NBQWlLO0FBQ2pLLHlDQUF5QztBQUN6QywyQ0FBdUM7QUFFdkM7O0dBRUc7QUFDSCxNQUFhLFdBQVc7SUFtQ3RCOztPQUVHO0lBQ0gsWUFBb0MsSUFBWTtRQUFaLFNBQUksR0FBSixJQUFJLENBQVE7S0FBSztJQXRCckQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBbUI7UUFDN0MsT0FBTyxJQUFJLFdBQVcsQ0FBQyxhQUFhLFdBQVcsRUFBRSxDQUFDLENBQUM7S0FDcEQ7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBWTtRQUMvQixPQUFPLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzlCOztBQWpDSCxrQ0F1Q0M7OztBQXRDQzs7R0FFRztBQUNvQixtQkFBTyxHQUFHLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRTVEOztHQUVHO0FBQ29CLGdCQUFJLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFdEQ7O0dBRUc7QUFDb0IsZ0JBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQTJCeEQ7O0dBRUc7QUFDSCxNQUFhLFFBQVE7SUFxQm5COztPQUVHO0lBQ0gsWUFBb0MsUUFBZ0I7UUFBaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtLQUFLO0lBYnpEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFnQjtRQUNuQyxPQUFPLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQy9COztBQW5CSCw0QkF5QkM7OztBQXhCQzs7R0FFRztBQUNvQixvQkFBVyxHQUFH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QUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1NBQUU7UUFDckcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLFNBQVMsS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUFFLFNBQVMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztTQUFFO1FBQzFHLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxZQUFZLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFBRSxTQUFTLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7U0FBRTtRQUN0SCxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsTUFBTSxLQUFLLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQUUsU0FBUyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1NBQUU7UUFDOUYsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksRUFBRTtZQUFFLFNBQVMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztTQUFFO1FBQ3RGLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxjQUFjLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUU7WUFBRSxTQUFTLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7U0FBRTtRQUM5SCxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsV0FBVyxLQUFLLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQUUsU0FBUyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO1NBQUU7UUFDbEgsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLFFBQVEsS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUFFLFNBQVMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztTQUFFO1FBQ3RHLElBQUksS0FBSyxDQUFD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LENBQUM7UUFDdEQsS0FBSyxtQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sd0JBQWlCLENBQUMsTUFBTSxDQUFDO1FBQ3hELEtBQUssbUJBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLHdCQUFpQixDQUFDLGNBQWMsQ0FBQztRQUN4RSxLQUFLLG1CQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyx3QkFBaUIsQ0FBQyxRQUFRLENBQUM7S0FDN0Q7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEZpbmdlcnByaW50T3B0aW9ucywgRm9sbG93TW9kZSwgSUFzc2V0IH0gZnJvbSAnQGF3cy1jZGsvYXNzZXRzJztcbmltcG9ydCAqIGFzIGVjciBmcm9tICdAYXdzLWNkay9hd3MtZWNyJztcbmltcG9ydCB7IEFubm90YXRpb25zLCBBc3NldFN0YWdpbmcsIEZlYXR1cmVGbGFncywgRmlsZUZpbmdlcnByaW50T3B0aW9ucywgSWdub3JlTW9kZSwgU3RhY2ssIFN5bWxpbmtGb2xsb3dNb2RlLCBUb2tlbiwgU3RhZ2UsIENmblJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogbmV0d29ya2luZyBtb2RlIG9uIGJ1aWxkIHRpbWUgc3VwcG9ydGVkIGJ5IGRvY2tlclxuICovXG5leHBvcnQgY2xhc3MgTmV0d29ya01vZGUge1xuICAvKipcbiAgICogVGhlIGRlZmF1bHQgbmV0d29ya2luZyBtb2RlIGlmIG9taXR0ZWQsIGNyZWF0ZSBhIG5ldHdvcmsgc3RhY2sgb24gdGhlIGRlZmF1bHQgRG9ja2VyIGJyaWRnZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUID0gbmV3IE5ldHdvcmtNb2RlKCdkZWZhdWx0Jyk7XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgRG9ja2VyIGhvc3QgbmV0d29yayBzdGFja1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBIT1NUID0gbmV3IE5ldHdvcmtNb2RlKCdob3N0Jyk7XG5cbiAgLyoqXG4gICAqIERpc2FibGUgdGhlIG5ldHdvcmsgc3RhY2ssIG9ubHkgdGhlIGxvb3BiYWNrIGRldmljZSB3aWxsIGJlIGNyZWF0ZWRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTk9ORSA9IG5ldyBOZXR3b3JrTW9kZSgnbm9uZScpO1xuXG4gIC8qKlxuICAgKiBSZXVzZSBhbm90aGVyIGNvbnRhaW5lcidzIG5ldHdvcmsgc3RhY2tcbiAgICpcbiAgICogQHBhcmFtIGNvbnRhaW5lcklkIFRoZSB0YXJnZXQgY29udGFpbmVyJ3MgaWQgb3IgbmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ29udGFpbmVyKGNvbnRhaW5lcklkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IE5ldHdvcmtNb2RlKGBjb250YWluZXI6JHtjb250YWluZXJJZH1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHNwZWNpZnkgYSBjdXN0b20gbmV0d29ya2luZyBtb2RlXG4gICAqIFVzZSB0aGlzIGlmIHRoZSBuZXR3b3JraW5nIG1vZGUgbmFtZSBpcyBub3QgeWV0IHN1cHBvcnRlZCBieSB0aGUgQ0RLLlxuICAgKlxuICAgKiBAcGFyYW0gbW9kZSBUaGUgbmV0d29ya2luZyBtb2RlIHRvIHVzZSBmb3IgZG9ja2VyIGJ1aWxkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGN1c3RvbShtb2RlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IE5ldHdvcmtNb2RlKG1vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBtb2RlIFRoZSBuZXR3b3JraW5nIG1vZGUgdG8gdXNlIGZvciBkb2NrZXIgYnVpbGRcbiAgICovXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG1vZGU6IHN0cmluZykgeyB9XG59XG5cbi8qKlxuICogcGxhdGZvcm0gc3VwcG9ydGVkIGJ5IGRvY2tlclxuICovXG5leHBvcnQgY2xhc3MgUGxhdGZvcm0ge1xuICAvKipcbiAgICogQnVpbGQgZm9yIGxpbnV4L2FtZDY0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExJTlVYX0FNRDY0ID0gbmV3IFBsYXRmb3JtKCdsaW51eC9hbWQ2NCcpO1xuXG4gIC8qKlxuICAgKiBCdWlsZCBmb3IgbGludXgvYXJtNjRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTElOVVhfQVJNNjQgPSBuZXcgUGxhdGZvcm0oJ2xpbnV4L2FybTY0Jyk7XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gc3BlY2lmeSBhIGN1c3RvbSBwbGF0Zm9ybVxuICAgKiBVc2UgdGhpcyBpZiB0aGUgcGxhdGZvcm0gbmFtZSBpcyBub3QgeWV0IHN1cHBvcnRlZCBieSB0aGUgQ0RLLlxuICAgKlxuICAgKiBAcGFyYW0gcGxhdGZvcm0gVGhlIHBsYXRmb3JtIHRvIHVzZSBmb3IgZG9ja2VyIGJ1aWxkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGN1c3RvbShwbGF0Zm9ybTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBQbGF0Zm9ybShwbGF0Zm9ybSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHBsYXRmb3JtIFRoZSBwbGF0Zm9ybSB0byB1c2UgZm9yIGRvY2tlciBidWlsZFxuICAgKi9cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgcGxhdGZvcm06IHN0cmluZykgeyB9XG59XG5cbi8qKlxuICogT3B0aW9ucyB0byBjb250cm9sIGludmFsaWRhdGlvbiBvZiBgRG9ja2VySW1hZ2VBc3NldGAgYXNzZXQgaGFzaGVzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRG9ja2VySW1hZ2VBc3NldEludmFsaWRhdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVXNlIGBleHRyYUhhc2hgIHdoaWxlIGNhbGN1bGF0aW5nIHRoZSBhc3NldCBoYXNoXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGV4dHJhSGFzaD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFVzZSBgYnVpbGRBcmdzYCB3aGlsZSBjYWxjdWxhdGluZyB0aGUgYXNzZXQgaGFzaFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBidWlsZEFyZ3M/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBVc2UgYGJ1aWxkU2VjcmV0c2Agd2hpbGUgY2FsY3VsYXRpbmcgdGhlIGFzc2V0IGhhc2hcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYnVpbGRTZWNyZXRzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVXNlIGB0YXJnZXRgIHdoaWxlIGNhbGN1bGF0aW5nIHRoZSBhc3NldCBoYXNoXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFVzZSBgZmlsZWAgd2hpbGUgY2FsY3VsYXRpbmcgdGhlIGFzc2V0IGhhc2hcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZmlsZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFVzZSBgcmVwb3NpdG9yeU5hbWVgIHdoaWxlIGNhbGN1bGF0aW5nIHRoZSBhc3NldCBoYXNoXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHJlcG9zaXRvcnlOYW1lPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVXNlIGBuZXR3b3JrTW9kZWAgd2hpbGUgY2FsY3VsYXRpbmcgdGhlIGFzc2V0IGhhc2hcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgbmV0d29ya01vZGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBVc2UgYHBsYXRmb3JtYCB3aGlsZSBjYWxjdWxhdGluZyB0aGUgYXNzZXQgaGFzaFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBwbGF0Zm9ybT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFVzZSBgb3V0cHV0c2Agd2hpbGUgY2FsY3VsYXRpbmcgdGhlIGFzc2V0IGhhc2hcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0cz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIERvY2tlciBjYWNoZSBiYWNrZW5kXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRG9ja2VyQ2FjaGVPcHRpb24ge1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgY2FjaGUgdG8gdXNlLlxuICAgKiBSZWZlciB0byBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9idWlsZC9jYWNoZS9iYWNrZW5kcy8gZm9yIGZ1bGwgbGlzdCBvZiBiYWNrZW5kcy5cbiAgICogQGRlZmF1bHQgLSB1bnNwZWNpZmllZFxuICAgKlxuICAgKiBAZXhhbXBsZSAncmVnaXN0cnknXG4gICAqL1xuICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBbnkgcGFyYW1ldGVycyB0byBwYXNzIGludG8gdGhlIGRvY2tlciBjYWNoZSBiYWNrZW5kIGNvbmZpZ3VyYXRpb24uXG4gICAqIFJlZmVyIHRvIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2J1aWxkL2NhY2hlL2JhY2tlbmRzLyBmb3IgY2FjaGUgYmFja2VuZCBjb25maWd1cmF0aW9uLlxuICAgKiBAZGVmYXVsdCB7fSBObyBvcHRpb25zIHByb3ZpZGVkXG4gICAqXG4gICAqIEBleGFtcGxlIHsgcmVmOiBgMTIzNDU2NzguZGtyLmVjci51cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9jYWNoZToke2JyYW5jaH1gLCBtb2RlOiBcIm1heFwiIH1cbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgRG9ja2VySW1hZ2VBc3NldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIERvY2tlckltYWdlQXNzZXRPcHRpb25zIGV4dGVuZHMgRmluZ2VycHJpbnRPcHRpb25zLCBGaWxlRmluZ2VycHJpbnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIEVDUiByZXBvc2l0b3J5IG5hbWVcbiAgICpcbiAgICogU3BlY2lmeSB0aGlzIHByb3BlcnR5IGlmIHlvdSBuZWVkIHRvIHN0YXRpY2FsbHkgYWRkcmVzcyB0aGUgaW1hZ2UsIGUuZy5cbiAgICogZnJvbSBhIEt1YmVybmV0ZXMgUG9kLiBOb3RlLCB0aGlzIGlzIG9ubHkgdGhlIHJlcG9zaXRvcnkgbmFtZSwgd2l0aG91dCB0aGVcbiAgICogcmVnaXN0cnkgYW5kIHRoZSB0YWcgcGFydHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIGRlZmF1bHQgRUNSIHJlcG9zaXRvcnkgZm9yIENESyBhc3NldHNcbiAgICogQGRlcHJlY2F0ZWQgdG8gY29udHJvbCB0aGUgbG9jYXRpb24gb2YgZG9ja2VyIGltYWdlIGFzc2V0cywgcGxlYXNlIG92ZXJyaWRlXG4gICAqIGBTdGFjay5hZGREb2NrZXJJbWFnZUFzc2V0YC4gdGhpcyBmZWF0dXJlIHdpbGwgYmUgcmVtb3ZlZCBpbiBmdXR1cmVcbiAgICogcmVsZWFzZXMuXG4gICAqL1xuICByZWFkb25seSByZXBvc2l0b3J5TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQnVpbGQgYXJncyB0byBwYXNzIHRvIHRoZSBgZG9ja2VyIGJ1aWxkYCBjb21tYW5kLlxuICAgKlxuICAgKiBTaW5jZSBEb2NrZXIgYnVpbGQgYXJndW1lbnRzIGFyZSByZXNvbHZlZCBiZWZvcmUgZGVwbG95bWVudCwga2V5cyBhbmRcbiAgICogdmFsdWVzIGNhbm5vdCByZWZlciB0byB1bnJlc29sdmVkIHRva2VucyAoc3VjaCBhcyBgbGFtYmRhLmZ1bmN0aW9uQXJuYCBvclxuICAgKiBgcXVldWUucXVldWVVcmxgKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBidWlsZCBhcmdzIGFyZSBwYXNzZWRcbiAgICovXG4gIHJlYWRvbmx5IGJ1aWxkQXJncz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIEJ1aWxkIHNlY3JldHMuXG4gICAqXG4gICAqIERvY2tlciBCdWlsZEtpdCBtdXN0IGJlIGVuYWJsZWQgdG8gdXNlIGJ1aWxkIHNlY3JldHMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vYnVpbGQvYnVpbGRraXQvXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYnVpbGQgc2VjcmV0c1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB7XG4gICAqICAgJ01ZX1NFQ1JFVCc6IERvY2tlckJ1aWxkU2VjcmV0LmZyb21TcmMoJ2ZpbGUudHh0JylcbiAgICogfVxuICAgKi9cbiAgcmVhZG9ubHkgYnVpbGRTZWNyZXRzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfVxuXG4gIC8qKlxuICAgKiBEb2NrZXIgdGFyZ2V0IHRvIGJ1aWxkIHRvXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gdGFyZ2V0XG4gICAqL1xuICByZWFkb25seSB0YXJnZXQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFBhdGggdG8gdGhlIERvY2tlcmZpbGUgKHJlbGF0aXZlIHRvIHRoZSBkaXJlY3RvcnkpLlxuICAgKlxuICAgKiBAZGVmYXVsdCAnRG9ja2VyZmlsZSdcbiAgICovXG4gIHJlYWRvbmx5IGZpbGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE5ldHdvcmtpbmcgbW9kZSBmb3IgdGhlIFJVTiBjb21tYW5kcyBkdXJpbmcgYnVpbGQuIFN1cHBvcnQgZG9ja2VyIEFQSSAxLjI1Ky5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBuZXR3b3JraW5nIG1vZGUgc3BlY2lmaWVkICh0aGUgZGVmYXVsdCBuZXR3b3JraW5nIG1vZGUgYE5ldHdvcmtNb2RlLkRFRkFVTFRgIHdpbGwgYmUgdXNlZClcbiAgICovXG4gIHJlYWRvbmx5IG5ldHdvcmtNb2RlPzogTmV0d29ya01vZGU7XG5cbiAgLyoqXG4gICAqIFBsYXRmb3JtIHRvIGJ1aWxkIGZvci4gX1JlcXVpcmVzIERvY2tlciBCdWlsZHhfLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHBsYXRmb3JtIHNwZWNpZmllZCAodGhlIGN1cnJlbnQgbWFjaGluZSBhcmNoaXRlY3R1cmUgd2lsbCBiZSB1c2VkKVxuICAgKi9cbiAgcmVhZG9ubHkgcGxhdGZvcm0/OiBQbGF0Zm9ybTtcblxuICAvKipcbiAgICogT3B0aW9ucyB0byBjb250cm9sIHdoaWNoIHBhcmFtZXRlcnMgYXJlIHVzZWQgdG8gaW52YWxpZGF0ZSB0aGUgYXNzZXQgaGFzaC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBoYXNoIGFsbCBwYXJhbWV0ZXJzXG4gICAqL1xuICByZWFkb25seSBpbnZhbGlkYXRpb24/OiBEb2NrZXJJbWFnZUFzc2V0SW52YWxpZGF0aW9uT3B0aW9ucztcblxuICAvKipcbiAgICogT3V0cHV0cyB0byBwYXNzIHRvIHRoZSBgZG9ja2VyIGJ1aWxkYCBjb21tYW5kLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIG91dHB1dHMgYXJlIHBhc3NlZCB0byB0aGUgYnVpbGQgY29tbWFuZCAoZGVmYXVsdCBvdXRwdXRzIGFyZSB1c2VkKVxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvY29tbWFuZGxpbmUvYnVpbGQvI2N1c3RvbS1idWlsZC1vdXRwdXRzXG4gICAqL1xuICByZWFkb25seSBvdXRwdXRzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIENhY2hlIGZyb20gb3B0aW9ucyB0byBwYXNzIHRvIHRoZSBgZG9ja2VyIGJ1aWxkYCBjb21tYW5kLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGNhY2hlIGZyb20gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSBidWlsZCBjb21tYW5kXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vYnVpbGQvY2FjaGUvYmFja2VuZHMvXG4gICAqL1xuICByZWFkb25seSBjYWNoZUZyb20/OiBEb2NrZXJDYWNoZU9wdGlvbltdO1xuXG4gIC8qKlxuICAgKiBDYWNoZSB0byBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIGBkb2NrZXIgYnVpbGRgIGNvbW1hbmQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gY2FjaGUgdG8gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSBidWlsZCBjb21tYW5kXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vYnVpbGQvY2FjaGUvYmFja2VuZHMvXG4gICAqL1xuICByZWFkb25seSBjYWNoZVRvPzogRG9ja2VyQ2FjaGVPcHRpb247XG59XG5cbi8qKlxuICogUHJvcHMgZm9yIERvY2tlckltYWdlQXNzZXRzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRG9ja2VySW1hZ2VBc3NldFByb3BzIGV4dGVuZHMgRG9ja2VySW1hZ2VBc3NldE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGRpcmVjdG9yeSB3aGVyZSB0aGUgRG9ja2VyZmlsZSBpcyBzdG9yZWRcbiAgICpcbiAgICogQW55IGRpcmVjdG9yeSBpbnNpZGUgd2l0aCBhIG5hbWUgdGhhdCBtYXRjaGVzIHRoZSBDREsgb3V0cHV0IGZvbGRlciAoY2RrLm91dCBieSBkZWZhdWx0KSB3aWxsIGJlIGV4Y2x1ZGVkIGZyb20gdGhlIGFzc2V0XG4gICAqL1xuICByZWFkb25seSBkaXJlY3Rvcnk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBbiBhc3NldCB0aGF0IHJlcHJlc2VudHMgYSBEb2NrZXIgaW1hZ2UuXG4gKlxuICogVGhlIGltYWdlIHdpbGwgYmUgY3JlYXRlZCBpbiBidWlsZCB0aW1lIGFuZCB1cGxvYWRlZCB0byBhbiBFQ1IgcmVwb3NpdG9yeS5cbiAqL1xuZXhwb3J0IGNsYXNzIERvY2tlckltYWdlQXNzZXQgZXh0ZW5kcyBDb25zdHJ1Y3QgaW1wbGVtZW50cyBJQXNzZXQge1xuICAvKipcbiAgICogVGhlIGZ1bGwgVVJJIG9mIHRoZSBpbWFnZSAoaW5jbHVkaW5nIGEgdGFnKS4gVXNlIHRoaXMgcmVmZXJlbmNlIHRvIHB1bGxcbiAgICogdGhlIGFzc2V0LlxuICAgKi9cbiAgcHVibGljIGltYWdlVXJpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlcG9zaXRvcnkgd2hlcmUgdGhlIGltYWdlIGlzIHN0b3JlZFxuICAgKi9cbiAgcHVibGljIHJlcG9zaXRvcnk6IGVjci5JUmVwb3NpdG9yeTtcblxuICAvKipcbiAgICogQSBoYXNoIG9mIHRoZSBzb3VyY2Ugb2YgdGhpcyBhc3NldCwgd2hpY2ggaXMgYXZhaWxhYmxlIGF0IGNvbnN0cnVjdGlvbiB0aW1lLiBBcyB0aGlzIGlzIGEgcGxhaW5cbiAgICogc3RyaW5nLCBpdCBjYW4gYmUgdXNlZCBpbiBjb25zdHJ1Y3QgSURzIGluIG9yZGVyIHRvIGVuZm9yY2UgY3JlYXRpb24gb2YgYSBuZXcgcmVzb3VyY2Ugd2hlblxuICAgKiB0aGUgY29udGVudCBoYXNoIGhhcyBjaGFuZ2VkLlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYXNzZXRIYXNoXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc291cmNlSGFzaDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGhhc2ggb2YgdGhpcyBhc3NldCwgd2hpY2ggaXMgYXZhaWxhYmxlIGF0IGNvbnN0cnVjdGlvbiB0aW1lLiBBcyB0aGlzIGlzIGEgcGxhaW4gc3RyaW5nLCBpdFxuICAgKiBjYW4gYmUgdXNlZCBpbiBjb25zdHJ1Y3QgSURzIGluIG9yZGVyIHRvIGVuZm9yY2UgY3JlYXRpb24gb2YgYSBuZXcgcmVzb3VyY2Ugd2hlbiB0aGUgY29udGVudFxuICAgKiBoYXNoIGhhcyBjaGFuZ2VkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFzc2V0SGFzaDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdGFnIG9mIHRoaXMgYXNzZXQgd2hlbiBpdCBpcyB1cGxvYWRlZCB0byBFQ1IuIFRoZSB0YWcgbWF5IGRpZmZlciBmcm9tIHRoZSBhc3NldEhhc2ggaWYgYSBzdGFjayBzeW50aGVzaXplciBhZGRzIGEgZG9ja2VyVGFnUHJlZml4LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGltYWdlVGFnOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSBhc3NldCwgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgQ2xvdWQgQXNzZW1ibHlcbiAgICpcbiAgICogSWYgYXNzZXQgc3RhZ2luZyBpcyBkaXNhYmxlZCwgdGhpcyB3aWxsIGp1c3QgYmUgdGhlIG9yaWdpbmFsIHBhdGguXG4gICAqXG4gICAqIElmIGFzc2V0IHN0YWdpbmcgaXMgZW5hYmxlZCBpdCB3aWxsIGJlIHRoZSBzdGFnZWQgcGF0aC5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgYXNzZXRQYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSBEb2NrZXJmaWxlLCByZWxhdGl2ZSB0byB0aGUgYXNzZXRQYXRoXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGRvY2tlcmZpbGVQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBCdWlsZCBhcmdzIHRvIHBhc3MgdG8gdGhlIGBkb2NrZXIgYnVpbGRgIGNvbW1hbmQuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGRvY2tlckJ1aWxkQXJncz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIEJ1aWxkIHNlY3JldHMgdG8gcGFzcyB0byB0aGUgYGRvY2tlciBidWlsZGAgY29tbWFuZC5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgZG9ja2VyQnVpbGRTZWNyZXRzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogT3V0cHV0cyB0byBwYXNzIHRvIHRoZSBgZG9ja2VyIGJ1aWxkYCBjb21tYW5kLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBkb2NrZXJPdXRwdXRzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIENhY2hlIGZyb20gb3B0aW9ucyB0byBwYXNzIHRvIHRoZSBgZG9ja2VyIGJ1aWxkYCBjb21tYW5kLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBkb2NrZXJDYWNoZUZyb20/OiBEb2NrZXJDYWNoZU9wdGlvbltdO1xuXG4gIC8qKlxuICAgKiBDYWNoZSB0byBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIGBkb2NrZXIgYnVpbGRgIGNvbW1hbmQuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGRvY2tlckNhY2hlVG8/OiBEb2NrZXJDYWNoZU9wdGlvbjtcblxuICAvKipcbiAgICogRG9ja2VyIHRhcmdldCB0byBidWlsZCB0b1xuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBkb2NrZXJCdWlsZFRhcmdldD86IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRG9ja2VySW1hZ2VBc3NldFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vIG5vbmUgb2YgdGhlIHByb3BlcnRpZXMgdXNlIHRva2Vuc1xuICAgIHZhbGlkYXRlUHJvcHMocHJvcHMpO1xuXG4gICAgLy8gcmVzb2x2ZSBmdWxsIHBhdGhcbiAgICBjb25zdCBkaXIgPSBwYXRoLnJlc29sdmUocHJvcHMuZGlyZWN0b3J5KTtcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZGlyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBpbWFnZSBkaXJlY3RvcnkgYXQgJHtkaXJ9YCk7XG4gICAgfVxuXG4gICAgLy8gdmFsaWRhdGUgdGhlIGRvY2tlciBmaWxlIGV4aXN0c1xuICAgIHRoaXMuZG9ja2VyZmlsZVBhdGggPSBwcm9wcy5maWxlIHx8ICdEb2NrZXJmaWxlJztcbiAgICBjb25zdCBmaWxlID0gcGF0aC5qb2luKGRpciwgdGhpcy5kb2NrZXJmaWxlUGF0aCk7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIGZpbGUgYXQgJHtmaWxlfWApO1xuICAgIH1cblxuICAgIGNvbnN0IGRlZmF1bHRJZ25vcmVNb2RlID0gRmVhdHVyZUZsYWdzLm9mKHRoaXMpLmlzRW5hYmxlZChjeGFwaS5ET0NLRVJfSUdOT1JFX1NVUFBPUlQpXG4gICAgICA/IElnbm9yZU1vZGUuRE9DS0VSIDogSWdub3JlTW9kZS5HTE9CO1xuICAgIGxldCBpZ25vcmVNb2RlID0gcHJvcHMuaWdub3JlTW9kZSA/PyBkZWZhdWx0SWdub3JlTW9kZTtcblxuICAgIGxldCBleGNsdWRlOiBzdHJpbmdbXSA9IHByb3BzLmV4Y2x1ZGUgfHwgW107XG5cbiAgICBjb25zdCBpZ25vcmUgPSBwYXRoLmpvaW4oZGlyLCAnLmRvY2tlcmlnbm9yZScpO1xuXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoaWdub3JlKSkge1xuICAgICAgY29uc3QgZG9ja2VySWdub3JlUGF0dGVybnMgPSBmcy5yZWFkRmlsZVN5bmMoaWdub3JlKS50b1N0cmluZygpLnNwbGl0KCdcXG4nKS5maWx0ZXIoZSA9PiAhIWUpO1xuXG4gICAgICBleGNsdWRlID0gW1xuICAgICAgICAuLi5kb2NrZXJJZ25vcmVQYXR0ZXJucyxcbiAgICAgICAgLi4uZXhjbHVkZSxcblxuICAgICAgICAvLyBFbnN1cmUgLmRvY2tlcmlnbm9yZSBpcyBpbmNsdWRlZCBubyBtYXR0ZXIgd2hhdC5cbiAgICAgICAgJyEuZG9ja2VyaWdub3JlJyxcbiAgICAgIF07XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIHRoZSBEb2NrZXJmaWxlIGlzIGluY2x1ZGVkIG5vIG1hdHRlciB3aGF0LlxuICAgIGV4Y2x1ZGUucHVzaCgnIScgKyBwYXRoLmJhc2VuYW1lKGZpbGUpKTtcbiAgICAvLyBFbnN1cmUgdGhlIGNkay5vdXQgZm9sZGVyIGlzIG5vdCBpbmNsdWRlZCB0byBhdm9pZCBpbmZpbml0ZSBsb29wcy5cbiAgICBjb25zdCBjZGtvdXQgPSBTdGFnZS5vZih0aGlzKT8ub3V0ZGlyID8/ICdjZGsub3V0JztcbiAgICBleGNsdWRlLnB1c2goY2Rrb3V0KTtcblxuICAgIGlmIChwcm9wcy5yZXBvc2l0b3J5TmFtZSkge1xuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZygnRG9ja2VySW1hZ2VBc3NldC5yZXBvc2l0b3J5TmFtZSBpcyBkZXByZWNhdGVkLiBPdmVycmlkZSBcImNvcmUuU3RhY2suYWRkRG9ja2VySW1hZ2VBc3NldFwiIHRvIGNvbnRyb2wgYXNzZXQgbG9jYXRpb25zJyk7XG4gICAgfVxuXG4gICAgLy8gaW5jbHVkZSBidWlsZCBjb250ZXh0IGluIFwiZXh0cmFcIiBzbyBpdCB3aWxsIGltcGFjdCB0aGUgaGFzaFxuICAgIGNvbnN0IGV4dHJhSGFzaDogeyBbZmllbGQ6IHN0cmluZ106IGFueSB9ID0ge307XG4gICAgaWYgKHByb3BzLmludmFsaWRhdGlvbj8uZXh0cmFIYXNoICE9PSBmYWxzZSAmJiBwcm9wcy5leHRyYUhhc2gpIHsgZXh0cmFIYXNoLnVzZXIgPSBwcm9wcy5leHRyYUhhc2g7IH1cbiAgICBpZiAocHJvcHMuaW52YWxpZGF0aW9uPy5idWlsZEFyZ3MgIT09IGZhbHNlICYmIHByb3BzLmJ1aWxkQXJncykgeyBleHRyYUhhc2guYnVpbGRBcmdzID0gcHJvcHMuYnVpbGRBcmdzOyB9XG4gICAgaWYgKHByb3BzLmludmFsaWRhdGlvbj8uYnVpbGRTZWNyZXRzICE9PSBmYWxzZSAmJiBwcm9wcy5idWlsZFNlY3JldHMpIHsgZXh0cmFIYXNoLmJ1aWxkU2VjcmV0cyA9IHByb3BzLmJ1aWxkU2VjcmV0czsgfVxuICAgIGlmIChwcm9wcy5pbnZhbGlkYXRpb24/LnRhcmdldCAhPT0gZmFsc2UgJiYgcHJvcHMudGFyZ2V0KSB7IGV4dHJhSGFzaC50YXJnZXQgPSBwcm9wcy50YXJnZXQ7IH1cbiAgICBpZiAocHJvcHMuaW52YWxpZGF0aW9uPy5maWxlICE9PSBmYWxzZSAmJiBwcm9wcy5maWxlKSB7IGV4dHJhSGFzaC5maWxlID0gcHJvcHMuZmlsZTsgfVxuICAgIGlmIChwcm9wcy5pbnZhbGlkYXRpb24/LnJlcG9zaXRvcnlOYW1lICE9PSBmYWxzZSAmJiBwcm9wcy5yZXBvc2l0b3J5TmFtZSkgeyBleHRyYUhhc2gucmVwb3NpdG9yeU5hbWUgPSBwcm9wcy5yZXBvc2l0b3J5TmFtZTsgfVxuICAgIGlmIChwcm9wcy5pbnZhbGlkYXRpb24/Lm5ldHdvcmtNb2RlICE9PSBmYWxzZSAmJiBwcm9wcy5uZXR3b3JrTW9kZSkgeyBleHRyYUhhc2gubmV0d29ya01vZGUgPSBwcm9wcy5uZXR3b3JrTW9kZTsgfVxuICAgIGlmIChwcm9wcy5pbnZhbGlkYXRpb24/LnBsYXRmb3JtICE9PSBmYWxzZSAmJiBwcm9wcy5wbGF0Zm9ybSkgeyBleHRyYUhhc2gucGxhdGZvcm0gPSBwcm9wcy5wbGF0Zm9ybTsgfVxuICAgIGlmIChwcm9wcy5pbnZhbGlkYXRpb24/Lm91dHB1dHMgIT09IGZhbHNlICYmIHByb3BzLm91dHB1dHMpIHsgZXh0cmFIYXNoLm91dHB1dHMgPSBwcm9wcy5vdXRwdXRzOyB9XG5cbiAgICAvLyBhZGQgXCJzYWx0XCIgdG8gdGhlIGhhc2ggaW4gb3JkZXIgdG8gaW52YWxpZGF0ZSB0aGUgaW1hZ2UgaW4gdGhlIHVwZ3JhZGUgdG9cbiAgICAvLyAxLjIxLjAgd2hpY2ggcmVtb3ZlcyB0aGUgQWRvcHRlZFJlcG9zaXRvcnkgcmVzb3VyY2UgKGFuZCB3aWxsIGNhdXNlIHRoZVxuICAgIC8vIGRlbGV0aW9uIG9mIHRoZSBFQ1IgcmVwb3NpdG9yeSB0aGUgYXBwIHVzZWQpLlxuICAgIGV4dHJhSGFzaC52ZXJzaW9uID0gJzEuMjEuMCc7XG5cbiAgICBjb25zdCBzdGFnaW5nID0gbmV3IEFzc2V0U3RhZ2luZyh0aGlzLCAnU3RhZ2luZycsIHtcbiAgICAgIC4uLnByb3BzLFxuICAgICAgZm9sbG93OiBwcm9wcy5mb2xsb3dTeW1saW5rcyA/PyB0b1N5bWxpbmtGb2xsb3cocHJvcHMuZm9sbG93KSxcbiAgICAgIGV4Y2x1ZGUsXG4gICAgICBpZ25vcmVNb2RlLFxuICAgICAgc291cmNlUGF0aDogZGlyLFxuICAgICAgZXh0cmFIYXNoOiBPYmplY3Qua2V5cyhleHRyYUhhc2gpLmxlbmd0aCA9PT0gMFxuICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICA6IEpTT04uc3RyaW5naWZ5KGV4dHJhSGFzaCksXG4gICAgfSk7XG5cbiAgICB0aGlzLnNvdXJjZUhhc2ggPSBzdGFnaW5nLmFzc2V0SGFzaDtcbiAgICB0aGlzLmFzc2V0SGFzaCA9IHN0YWdpbmcuYXNzZXRIYXNoO1xuXG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcbiAgICB0aGlzLmFzc2V0UGF0aCA9IHN0YWdpbmcucmVsYXRpdmVTdGFnZWRQYXRoKHN0YWNrKTtcbiAgICB0aGlzLmRvY2tlckJ1aWxkQXJncyA9IHByb3BzLmJ1aWxkQXJncztcbiAgICB0aGlzLmRvY2tlckJ1aWxkU2VjcmV0cyA9IHByb3BzLmJ1aWxkU2VjcmV0cztcbiAgICB0aGlzLmRvY2tlckJ1aWxkVGFyZ2V0ID0gcHJvcHMudGFyZ2V0O1xuICAgIHRoaXMuZG9ja2VyT3V0cHV0cyA9IHByb3BzLm91dHB1dHM7XG4gICAgdGhpcy5kb2NrZXJDYWNoZUZyb20gPSBwcm9wcy5jYWNoZUZyb207XG4gICAgdGhpcy5kb2NrZXJDYWNoZVRvID0gcHJvcHMuY2FjaGVUbztcblxuICAgIGNvbnN0IGxvY2F0aW9uID0gc3RhY2suc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldCh7XG4gICAgICBkaXJlY3RvcnlOYW1lOiB0aGlzLmFzc2V0UGF0aCxcbiAgICAgIGRvY2tlckJ1aWxkQXJnczogdGhpcy5kb2NrZXJCdWlsZEFyZ3MsXG4gICAgICBkb2NrZXJCdWlsZFNlY3JldHM6IHRoaXMuZG9ja2VyQnVpbGRTZWNyZXRzLFxuICAgICAgZG9ja2VyQnVpbGRUYXJnZXQ6IHRoaXMuZG9ja2VyQnVpbGRUYXJnZXQsXG4gICAgICBkb2NrZXJGaWxlOiBwcm9wcy5maWxlLFxuICAgICAgc291cmNlSGFzaDogc3RhZ2luZy5hc3NldEhhc2gsXG4gICAgICBuZXR3b3JrTW9kZTogcHJvcHMubmV0d29ya01vZGU/Lm1vZGUsXG4gICAgICBwbGF0Zm9ybTogcHJvcHMucGxhdGZvcm0/LnBsYXRmb3JtLFxuICAgICAgZG9ja2VyT3V0cHV0czogdGhpcy5kb2NrZXJPdXRwdXRzLFxuICAgICAgZG9ja2VyQ2FjaGVGcm9tOiB0aGlzLmRvY2tlckNhY2hlRnJvbSxcbiAgICAgIGRvY2tlckNhY2hlVG86IHRoaXMuZG9ja2VyQ2FjaGVUbyxcbiAgICB9KTtcblxuICAgIHRoaXMucmVwb3NpdG9yeSA9IGVjci5SZXBvc2l0b3J5LmZyb21SZXBvc2l0b3J5TmFtZSh0aGlzLCAnUmVwb3NpdG9yeScsIGxvY2F0aW9uLnJlcG9zaXRvcnlOYW1lKTtcbiAgICB0aGlzLmltYWdlVXJpID0gbG9jYXRpb24uaW1hZ2VVcmk7XG4gICAgdGhpcy5pbWFnZVRhZyA9IGxvY2F0aW9uLmltYWdlVGFnID8/IHRoaXMuYXNzZXRIYXNoO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgbWV0YWRhdGEgdG8gdGhlIHNwZWNpZmllZCByZXNvdXJjZSB3aXRoXG4gICAqIGluZm9ybWF0aW9uIHRoYXQgaW5kaWNhdGVzIHdoaWNoIHJlc291cmNlIHByb3BlcnR5IGlzIG1hcHBlZCB0byB0aGlzIGxvY2FsXG4gICAqIGFzc2V0LiBUaGlzIGNhbiBiZSB1c2VkIGJ5IHRvb2xzIHN1Y2ggYXMgU0FNIENMSSB0byBwcm92aWRlIGxvY2FsXG4gICAqIGV4cGVyaWVuY2Ugc3VjaCBhcyBsb2NhbCBpbnZvY2F0aW9uIGFuZCBkZWJ1Z2dpbmcgb2YgTGFtYmRhIGZ1bmN0aW9ucy5cbiAgICpcbiAgICogQXNzZXQgbWV0YWRhdGEgd2lsbCBvbmx5IGJlIGluY2x1ZGVkIGlmIHRoZSBzdGFjayBpcyBzeW50aGVzaXplZCB3aXRoIHRoZVxuICAgKiBcImF3czpjZGs6ZW5hYmxlLWFzc2V0LW1ldGFkYXRhXCIgY29udGV4dCBrZXkgZGVmaW5lZCwgd2hpY2ggaXMgdGhlIGRlZmF1bHRcbiAgICogYmVoYXZpb3Igd2hlbiBzeW50aGVzaXppbmcgdmlhIHRoZSBDREsgVG9vbGtpdC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzE0MzJcbiAgICpcbiAgICogQHBhcmFtIHJlc291cmNlIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB3aGljaCBpcyB1c2luZyB0aGlzIGFzc2V0IFtkaXNhYmxlLWF3c2xpbnQ6cmVmLXZpYS1pbnRlcmZhY2VdXG4gICAqIEBwYXJhbSByZXNvdXJjZVByb3BlcnR5IFRoZSBwcm9wZXJ0eSBuYW1lIHdoZXJlIHRoaXMgYXNzZXQgaXMgcmVmZXJlbmNlZFxuICAgKi9cbiAgcHVibGljIGFkZFJlc291cmNlTWV0YWRhdGEocmVzb3VyY2U6IENmblJlc291cmNlLCByZXNvdXJjZVByb3BlcnR5OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMubm9kZS50cnlHZXRDb250ZXh0KGN4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0VOQUJMRURfQ09OVEVYVCkpIHtcbiAgICAgIHJldHVybjsgLy8gbm90IGVuYWJsZWRcbiAgICB9XG5cbiAgICAvLyB0ZWxsIHRvb2xzIHN1Y2ggYXMgU0FNIENMSSB0aGF0IHRoZSByZXNvdXJjZVByb3BlcnR5IG9mIHRoaXMgcmVzb3VyY2VcbiAgICAvLyBwb2ludHMgdG8gYSBsb2NhbCBwYXRoIGFuZCBpbmNsdWRlIHRoZSBwYXRoIHRvIGRlIGRvY2tlcmZpbGUsIGRvY2tlciBidWlsZCBhcmdzLCBhbmQgdGFyZ2V0LFxuICAgIC8vIGluIG9yZGVyIHRvIGVuYWJsZSBsb2NhbCBpbnZvY2F0aW9uIG9mIHRoaXMgZnVuY3Rpb24uXG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YSA9IHJlc291cmNlLmNmbk9wdGlvbnMubWV0YWRhdGEgfHwge307XG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YVtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QQVRIX0tFWV0gPSB0aGlzLmFzc2V0UGF0aDtcbiAgICByZXNvdXJjZS5jZm5PcHRpb25zLm1ldGFkYXRhW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0RPQ0tFUkZJTEVfUEFUSF9LRVldID0gdGhpcy5kb2NrZXJmaWxlUGF0aDtcbiAgICByZXNvdXJjZS5jZm5PcHRpb25zLm1ldGFkYXRhW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0RPQ0tFUl9CVUlMRF9BUkdTX0tFWV0gPSB0aGlzLmRvY2tlckJ1aWxkQXJncztcbiAgICByZXNvdXJjZS5jZm5PcHRpb25zLm1ldGFkYXRhW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0RPQ0tFUl9CVUlMRF9TRUNSRVRTX0tFWV0gPSB0aGlzLmRvY2tlckJ1aWxkU2VjcmV0cztcbiAgICByZXNvdXJjZS5jZm5PcHRpb25zLm1ldGFkYXRhW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0RPQ0tFUl9CVUlMRF9UQVJHRVRfS0VZXSA9IHRoaXMuZG9ja2VyQnVpbGRUYXJnZXQ7XG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YVtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QUk9QRVJUWV9LRVldID0gcmVzb3VyY2VQcm9wZXJ0eTtcbiAgICByZXNvdXJjZS5jZm5PcHRpb25zLm1ldGFkYXRhW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0RPQ0tFUl9PVVRQVVRTX0tFWV0gPSB0aGlzLmRvY2tlck91dHB1dHM7XG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YVtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9ET0NLRVJfQ0FDSEVfRlJPTV9LRVldID0gdGhpcy5kb2NrZXJDYWNoZUZyb207XG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YVtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9ET0NLRVJfQ0FDSEVfVE9fS0VZXSA9IHRoaXMuZG9ja2VyQ2FjaGVUbztcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcHMocHJvcHM6IERvY2tlckltYWdlQXNzZXRQcm9wcykge1xuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwcm9wcykpIHtcbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgdXNlIFRva2VuIGFzIHZhbHVlIG9mICcke2tleX0nOiB0aGlzIHZhbHVlIGlzIHVzZWQgYmVmb3JlIGRlcGxveW1lbnQgc3RhcnRzYCk7XG4gICAgfVxuICB9XG5cbiAgdmFsaWRhdGVCdWlsZEFyZ3MocHJvcHMuYnVpbGRBcmdzKTtcbiAgdmFsaWRhdGVCdWlsZFNlY3JldHMocHJvcHMuYnVpbGRTZWNyZXRzKTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVCdWlsZFByb3BzKGJ1aWxkUHJvcE5hbWU6IHN0cmluZywgYnVpbGRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYnVpbGRQcm9wcyB8fCB7fSkpIHtcbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGtleSkgfHwgVG9rZW4uaXNVbnJlc29sdmVkKHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgdXNlIHRva2VucyBpbiBrZXlzIG9yIHZhbHVlcyBvZiBcIiR7YnVpbGRQcm9wTmFtZX1cIiBzaW5jZSB0aGV5IGFyZSBuZWVkZWQgYmVmb3JlIGRlcGxveW1lbnRgKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVCdWlsZEFyZ3MoYnVpbGRBcmdzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICB2YWxpZGF0ZUJ1aWxkUHJvcHMoJ2J1aWxkQXJncycsIGJ1aWxkQXJncyk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQnVpbGRTZWNyZXRzKGJ1aWxkU2VjcmV0cz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgdmFsaWRhdGVCdWlsZFByb3BzKCdidWlsZFNlY3JldHMnLCBidWlsZFNlY3JldHMpO1xufVxuXG5mdW5jdGlvbiB0b1N5bWxpbmtGb2xsb3coZm9sbG93PzogRm9sbG93TW9kZSk6IFN5bWxpbmtGb2xsb3dNb2RlIHwgdW5kZWZpbmVkIHtcbiAgc3dpdGNoIChmb2xsb3cpIHtcbiAgICBjYXNlIHVuZGVmaW5lZDogcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjYXNlIEZvbGxvd01vZGUuTkVWRVI6IHJldHVybiBTeW1saW5rRm9sbG93TW9kZS5ORVZFUjtcbiAgICBjYXNlIEZvbGxvd01vZGUuQUxXQVlTOiByZXR1cm4gU3ltbGlua0ZvbGxvd01vZGUuQUxXQVlTO1xuICAgIGNhc2UgRm9sbG93TW9kZS5CTE9DS19FWFRFUk5BTDogcmV0dXJuIFN5bWxpbmtGb2xsb3dNb2RlLkJMT0NLX0VYVEVSTkFMO1xuICAgIGNhc2UgRm9sbG93TW9kZS5FWFRFUk5BTDogcmV0dXJuIFN5bWxpbmtGb2xsb3dNb2RlLkVYVEVSTkFMO1xuICB9XG59XG4iXX0=