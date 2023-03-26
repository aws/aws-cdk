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
    /**
     * @param mode The networking mode to use for docker build
     */
    constructor(mode) {
        this.mode = mode;
    }
}
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
exports.NetworkMode = NetworkMode;
/**
 * platform supported by docker
 */
class Platform {
    /**
     * Used to specify a custom platform
     * Use this if the platform name is not yet supported by the CDK.
     *
     * @param platform The platform to use for docker build
     */
    static custom(platform) {
        return new Platform(platform);
    }
    /**
     * @param platform The platform to use for docker build
     */
    constructor(platform) {
        this.platform = platform;
    }
}
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
exports.Platform = Platform;
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
_c = JSII_RTTI_SYMBOL_1;
DockerImageAsset[_c] = { fqn: "@aws-cdk/aws-ecr-assets.DockerImageAsset", version: "0.0.0" };
exports.DockerImageAsset = DockerImageAsset;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtYXNzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbWFnZS1hc3NldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDRDQUF5RTtBQUN6RSx3Q0FBd0M7QUFDeEMsd0NBQWlLO0FBQ2pLLHlDQUF5QztBQUN6QywyQ0FBdUM7QUFFdkM7O0dBRUc7QUFDSCxNQUFhLFdBQVc7SUFnQnRCOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQW1CO1FBQzdDLE9BQU8sSUFBSSxXQUFXLENBQUMsYUFBYSxXQUFXLEVBQUUsQ0FBQyxDQUFDO0tBQ3BEO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVk7UUFDL0IsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM5QjtJQUVEOztPQUVHO0lBQ0gsWUFBb0MsSUFBWTtRQUFaLFNBQUksR0FBSixJQUFJLENBQVE7S0FBSzs7OztBQXJDckQ7O0dBRUc7QUFDb0IsbUJBQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUU1RDs7R0FFRztBQUNvQixnQkFBSSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRXREOztHQUVHO0FBQ29CLGdCQUFJLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFkM0Msa0NBQVc7QUF5Q3hCOztHQUVHO0FBQ0gsTUFBYSxRQUFRO0lBV25COzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFnQjtRQUNuQyxPQUFPLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQy9CO0lBRUQ7O09BRUc7SUFDSCxZQUFvQyxRQUFnQjtRQUFoQixhQUFRLEdBQVIsUUFBUSxDQUFRO0tBQUs7Ozs7QUF2QnpEOztHQUVHO0FBQ29CLG9CQUFXLEdBQUcsSUFBSSxRQUFRLENBQUMs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QUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7U0FBRTtRQUNyRyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsU0FBUyxLQUFLLEtBQUssSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO1lBQUUsU0FBUyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1NBQUU7UUFDMUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLFlBQVksS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRTtZQUFFLFNBQVMsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztTQUFFO1FBQ3RILElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxNQUFNLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7U0FBRTtRQUM5RixJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsSUFBSSxLQUFLLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQUUsU0FBUyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1NBQUU7UUFDdEYsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLGNBQWMsS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtZQUFFLFNBQVMsQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztTQUFFO1FBQzlILElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxXQUFXLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFBRSxTQUFTLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7U0FBRTtRQUNsSCxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsUUFBUSxLQUFLLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQUUsU0FBUyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1NBQUU7UUFDdEcsSUFBSSxLQUFLLENBQUMsWUFB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QUFDO1FBQ3RELEtBQUssbUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLHdCQUFpQixDQUFDLE1BQU0sQ0FBQztRQUN4RCxLQUFLLG1CQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyx3QkFBaUIsQ0FBQyxjQUFjLENBQUM7UUFDeEUsS0FBSyxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sd0JBQWlCLENBQUMsUUFBUSxDQUFDO0tBQzdEO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBGaW5nZXJwcmludE9wdGlvbnMsIEZvbGxvd01vZGUsIElBc3NldCB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2V0cyc7XG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcic7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucywgQXNzZXRTdGFnaW5nLCBGZWF0dXJlRmxhZ3MsIEZpbGVGaW5nZXJwcmludE9wdGlvbnMsIElnbm9yZU1vZGUsIFN0YWNrLCBTeW1saW5rRm9sbG93TW9kZSwgVG9rZW4sIFN0YWdlLCBDZm5SZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKipcbiAqIG5ldHdvcmtpbmcgbW9kZSBvbiBidWlsZCB0aW1lIHN1cHBvcnRlZCBieSBkb2NrZXJcbiAqL1xuZXhwb3J0IGNsYXNzIE5ldHdvcmtNb2RlIHtcbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IG5ldHdvcmtpbmcgbW9kZSBpZiBvbWl0dGVkLCBjcmVhdGUgYSBuZXR3b3JrIHN0YWNrIG9uIHRoZSBkZWZhdWx0IERvY2tlciBicmlkZ2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVCA9IG5ldyBOZXR3b3JrTW9kZSgnZGVmYXVsdCcpO1xuXG4gIC8qKlxuICAgKiBVc2UgdGhlIERvY2tlciBob3N0IG5ldHdvcmsgc3RhY2tcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgSE9TVCA9IG5ldyBOZXR3b3JrTW9kZSgnaG9zdCcpO1xuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHRoZSBuZXR3b3JrIHN0YWNrLCBvbmx5IHRoZSBsb29wYmFjayBkZXZpY2Ugd2lsbCBiZSBjcmVhdGVkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE5PTkUgPSBuZXcgTmV0d29ya01vZGUoJ25vbmUnKTtcblxuICAvKipcbiAgICogUmV1c2UgYW5vdGhlciBjb250YWluZXIncyBuZXR3b3JrIHN0YWNrXG4gICAqXG4gICAqIEBwYXJhbSBjb250YWluZXJJZCBUaGUgdGFyZ2V0IGNvbnRhaW5lcidzIGlkIG9yIG5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNvbnRhaW5lcihjb250YWluZXJJZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBOZXR3b3JrTW9kZShgY29udGFpbmVyOiR7Y29udGFpbmVySWR9YCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBzcGVjaWZ5IGEgY3VzdG9tIG5ldHdvcmtpbmcgbW9kZVxuICAgKiBVc2UgdGhpcyBpZiB0aGUgbmV0d29ya2luZyBtb2RlIG5hbWUgaXMgbm90IHlldCBzdXBwb3J0ZWQgYnkgdGhlIENESy5cbiAgICpcbiAgICogQHBhcmFtIG1vZGUgVGhlIG5ldHdvcmtpbmcgbW9kZSB0byB1c2UgZm9yIGRvY2tlciBidWlsZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjdXN0b20obW9kZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBOZXR3b3JrTW9kZShtb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gbW9kZSBUaGUgbmV0d29ya2luZyBtb2RlIHRvIHVzZSBmb3IgZG9ja2VyIGJ1aWxkXG4gICAqL1xuICBwcml2YXRlIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBtb2RlOiBzdHJpbmcpIHsgfVxufVxuXG4vKipcbiAqIHBsYXRmb3JtIHN1cHBvcnRlZCBieSBkb2NrZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFBsYXRmb3JtIHtcbiAgLyoqXG4gICAqIEJ1aWxkIGZvciBsaW51eC9hbWQ2NFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBMSU5VWF9BTUQ2NCA9IG5ldyBQbGF0Zm9ybSgnbGludXgvYW1kNjQnKTtcblxuICAvKipcbiAgICogQnVpbGQgZm9yIGxpbnV4L2FybTY0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExJTlVYX0FSTTY0ID0gbmV3IFBsYXRmb3JtKCdsaW51eC9hcm02NCcpO1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHNwZWNpZnkgYSBjdXN0b20gcGxhdGZvcm1cbiAgICogVXNlIHRoaXMgaWYgdGhlIHBsYXRmb3JtIG5hbWUgaXMgbm90IHlldCBzdXBwb3J0ZWQgYnkgdGhlIENESy5cbiAgICpcbiAgICogQHBhcmFtIHBsYXRmb3JtIFRoZSBwbGF0Zm9ybSB0byB1c2UgZm9yIGRvY2tlciBidWlsZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjdXN0b20ocGxhdGZvcm06IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgUGxhdGZvcm0ocGxhdGZvcm0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBwbGF0Zm9ybSBUaGUgcGxhdGZvcm0gdG8gdXNlIGZvciBkb2NrZXIgYnVpbGRcbiAgICovXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHBsYXRmb3JtOiBzdHJpbmcpIHsgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgdG8gY29udHJvbCBpbnZhbGlkYXRpb24gb2YgYERvY2tlckltYWdlQXNzZXRgIGFzc2V0IGhhc2hlc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIERvY2tlckltYWdlQXNzZXRJbnZhbGlkYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFVzZSBgZXh0cmFIYXNoYCB3aGlsZSBjYWxjdWxhdGluZyB0aGUgYXNzZXQgaGFzaFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBleHRyYUhhc2g/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBVc2UgYGJ1aWxkQXJnc2Agd2hpbGUgY2FsY3VsYXRpbmcgdGhlIGFzc2V0IGhhc2hcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYnVpbGRBcmdzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVXNlIGBidWlsZFNlY3JldHNgIHdoaWxlIGNhbGN1bGF0aW5nIHRoZSBhc3NldCBoYXNoXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGJ1aWxkU2VjcmV0cz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFVzZSBgdGFyZ2V0YCB3aGlsZSBjYWxjdWxhdGluZyB0aGUgYXNzZXQgaGFzaFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSB0YXJnZXQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBVc2UgYGZpbGVgIHdoaWxlIGNhbGN1bGF0aW5nIHRoZSBhc3NldCBoYXNoXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGZpbGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBVc2UgYHJlcG9zaXRvcnlOYW1lYCB3aGlsZSBjYWxjdWxhdGluZyB0aGUgYXNzZXQgaGFzaFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSByZXBvc2l0b3J5TmFtZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFVzZSBgbmV0d29ya01vZGVgIHdoaWxlIGNhbGN1bGF0aW5nIHRoZSBhc3NldCBoYXNoXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IG5ldHdvcmtNb2RlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVXNlIGBwbGF0Zm9ybWAgd2hpbGUgY2FsY3VsYXRpbmcgdGhlIGFzc2V0IGhhc2hcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgcGxhdGZvcm0/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBVc2UgYG91dHB1dHNgIHdoaWxlIGNhbGN1bGF0aW5nIHRoZSBhc3NldCBoYXNoXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IG91dHB1dHM/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIHRoZSBEb2NrZXIgY2FjaGUgYmFja2VuZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIERvY2tlckNhY2hlT3B0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIGNhY2hlIHRvIHVzZS5cbiAgICogUmVmZXIgdG8gaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vYnVpbGQvY2FjaGUvYmFja2VuZHMvIGZvciBmdWxsIGxpc3Qgb2YgYmFja2VuZHMuXG4gICAqIEBkZWZhdWx0IC0gdW5zcGVjaWZpZWRcbiAgICpcbiAgICogQGV4YW1wbGUgJ3JlZ2lzdHJ5J1xuICAgKi9cbiAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAvKipcbiAgICogQW55IHBhcmFtZXRlcnMgdG8gcGFzcyBpbnRvIHRoZSBkb2NrZXIgY2FjaGUgYmFja2VuZCBjb25maWd1cmF0aW9uLlxuICAgKiBSZWZlciB0byBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9idWlsZC9jYWNoZS9iYWNrZW5kcy8gZm9yIGNhY2hlIGJhY2tlbmQgY29uZmlndXJhdGlvbi5cbiAgICogQGRlZmF1bHQge30gTm8gb3B0aW9ucyBwcm92aWRlZFxuICAgKlxuICAgKiBAZXhhbXBsZSB7IHJlZjogYDEyMzQ1Njc4LmRrci5lY3IudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vY2FjaGU6JHticmFuY2h9YCwgbW9kZTogXCJtYXhcIiB9XG4gICAqL1xuICByZWFkb25seSBwYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIERvY2tlckltYWdlQXNzZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEb2NrZXJJbWFnZUFzc2V0T3B0aW9ucyBleHRlbmRzIEZpbmdlcnByaW50T3B0aW9ucywgRmlsZUZpbmdlcnByaW50T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBFQ1IgcmVwb3NpdG9yeSBuYW1lXG4gICAqXG4gICAqIFNwZWNpZnkgdGhpcyBwcm9wZXJ0eSBpZiB5b3UgbmVlZCB0byBzdGF0aWNhbGx5IGFkZHJlc3MgdGhlIGltYWdlLCBlLmcuXG4gICAqIGZyb20gYSBLdWJlcm5ldGVzIFBvZC4gTm90ZSwgdGhpcyBpcyBvbmx5IHRoZSByZXBvc2l0b3J5IG5hbWUsIHdpdGhvdXQgdGhlXG4gICAqIHJlZ2lzdHJ5IGFuZCB0aGUgdGFnIHBhcnRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBkZWZhdWx0IEVDUiByZXBvc2l0b3J5IGZvciBDREsgYXNzZXRzXG4gICAqIEBkZXByZWNhdGVkIHRvIGNvbnRyb2wgdGhlIGxvY2F0aW9uIG9mIGRvY2tlciBpbWFnZSBhc3NldHMsIHBsZWFzZSBvdmVycmlkZVxuICAgKiBgU3RhY2suYWRkRG9ja2VySW1hZ2VBc3NldGAuIHRoaXMgZmVhdHVyZSB3aWxsIGJlIHJlbW92ZWQgaW4gZnV0dXJlXG4gICAqIHJlbGVhc2VzLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3NpdG9yeU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEJ1aWxkIGFyZ3MgdG8gcGFzcyB0byB0aGUgYGRvY2tlciBidWlsZGAgY29tbWFuZC5cbiAgICpcbiAgICogU2luY2UgRG9ja2VyIGJ1aWxkIGFyZ3VtZW50cyBhcmUgcmVzb2x2ZWQgYmVmb3JlIGRlcGxveW1lbnQsIGtleXMgYW5kXG4gICAqIHZhbHVlcyBjYW5ub3QgcmVmZXIgdG8gdW5yZXNvbHZlZCB0b2tlbnMgKHN1Y2ggYXMgYGxhbWJkYS5mdW5jdGlvbkFybmAgb3JcbiAgICogYHF1ZXVlLnF1ZXVlVXJsYCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYnVpbGQgYXJncyBhcmUgcGFzc2VkXG4gICAqL1xuICByZWFkb25seSBidWlsZEFyZ3M/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBCdWlsZCBzZWNyZXRzLlxuICAgKlxuICAgKiBEb2NrZXIgQnVpbGRLaXQgbXVzdCBiZSBlbmFibGVkIHRvIHVzZSBidWlsZCBzZWNyZXRzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2J1aWxkL2J1aWxka2l0L1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGJ1aWxkIHNlY3JldHNcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICoge1xuICAgKiAgICdNWV9TRUNSRVQnOiBEb2NrZXJCdWlsZFNlY3JldC5mcm9tU3JjKCdmaWxlLnR4dCcpLFxuICAgKiAgICdQSVBfSU5ERVhfVVJMJzogRG9ja2VyQnVpbGRTZWNyZXQuZnJvbUVudmlyb25tZW50KCdQSVBfSU5ERVhfVVJMJyksXG4gICAqIH1cbiAgICovXG4gIHJlYWRvbmx5IGJ1aWxkU2VjcmV0cz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH1cblxuICAvKipcbiAgICogRG9ja2VyIHRhcmdldCB0byBidWlsZCB0b1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHRhcmdldFxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQYXRoIHRvIHRoZSBEb2NrZXJmaWxlIChyZWxhdGl2ZSB0byB0aGUgZGlyZWN0b3J5KS5cbiAgICpcbiAgICogQGRlZmF1bHQgJ0RvY2tlcmZpbGUnXG4gICAqL1xuICByZWFkb25seSBmaWxlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOZXR3b3JraW5nIG1vZGUgZm9yIHRoZSBSVU4gY29tbWFuZHMgZHVyaW5nIGJ1aWxkLiBTdXBwb3J0IGRvY2tlciBBUEkgMS4yNSsuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gbmV0d29ya2luZyBtb2RlIHNwZWNpZmllZCAodGhlIGRlZmF1bHQgbmV0d29ya2luZyBtb2RlIGBOZXR3b3JrTW9kZS5ERUZBVUxUYCB3aWxsIGJlIHVzZWQpXG4gICAqL1xuICByZWFkb25seSBuZXR3b3JrTW9kZT86IE5ldHdvcmtNb2RlO1xuXG4gIC8qKlxuICAgKiBQbGF0Zm9ybSB0byBidWlsZCBmb3IuIF9SZXF1aXJlcyBEb2NrZXIgQnVpbGR4Xy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBwbGF0Zm9ybSBzcGVjaWZpZWQgKHRoZSBjdXJyZW50IG1hY2hpbmUgYXJjaGl0ZWN0dXJlIHdpbGwgYmUgdXNlZClcbiAgICovXG4gIHJlYWRvbmx5IHBsYXRmb3JtPzogUGxhdGZvcm07XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgdG8gY29udHJvbCB3aGljaCBwYXJhbWV0ZXJzIGFyZSB1c2VkIHRvIGludmFsaWRhdGUgdGhlIGFzc2V0IGhhc2guXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gaGFzaCBhbGwgcGFyYW1ldGVyc1xuICAgKi9cbiAgcmVhZG9ubHkgaW52YWxpZGF0aW9uPzogRG9ja2VySW1hZ2VBc3NldEludmFsaWRhdGlvbk9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIE91dHB1dHMgdG8gcGFzcyB0byB0aGUgYGRvY2tlciBidWlsZGAgY29tbWFuZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBvdXRwdXRzIGFyZSBwYXNzZWQgdG8gdGhlIGJ1aWxkIGNvbW1hbmQgKGRlZmF1bHQgb3V0cHV0cyBhcmUgdXNlZClcbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2NvbW1hbmRsaW5lL2J1aWxkLyNjdXN0b20tYnVpbGQtb3V0cHV0c1xuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0cz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBDYWNoZSBmcm9tIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgYGRvY2tlciBidWlsZGAgY29tbWFuZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBjYWNoZSBmcm9tIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUgYnVpbGQgY29tbWFuZFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2J1aWxkL2NhY2hlL2JhY2tlbmRzL1xuICAgKi9cbiAgcmVhZG9ubHkgY2FjaGVGcm9tPzogRG9ja2VyQ2FjaGVPcHRpb25bXTtcblxuICAvKipcbiAgICogQ2FjaGUgdG8gb3B0aW9ucyB0byBwYXNzIHRvIHRoZSBgZG9ja2VyIGJ1aWxkYCBjb21tYW5kLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGNhY2hlIHRvIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUgYnVpbGQgY29tbWFuZFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2J1aWxkL2NhY2hlL2JhY2tlbmRzL1xuICAgKi9cbiAgcmVhZG9ubHkgY2FjaGVUbz86IERvY2tlckNhY2hlT3B0aW9uO1xufVxuXG4vKipcbiAqIFByb3BzIGZvciBEb2NrZXJJbWFnZUFzc2V0c1xuICovXG5leHBvcnQgaW50ZXJmYWNlIERvY2tlckltYWdlQXNzZXRQcm9wcyBleHRlbmRzIERvY2tlckltYWdlQXNzZXRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBkaXJlY3Rvcnkgd2hlcmUgdGhlIERvY2tlcmZpbGUgaXMgc3RvcmVkXG4gICAqXG4gICAqIEFueSBkaXJlY3RvcnkgaW5zaWRlIHdpdGggYSBuYW1lIHRoYXQgbWF0Y2hlcyB0aGUgQ0RLIG91dHB1dCBmb2xkZXIgKGNkay5vdXQgYnkgZGVmYXVsdCkgd2lsbCBiZSBleGNsdWRlZCBmcm9tIHRoZSBhc3NldFxuICAgKi9cbiAgcmVhZG9ubHkgZGlyZWN0b3J5OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQW4gYXNzZXQgdGhhdCByZXByZXNlbnRzIGEgRG9ja2VyIGltYWdlLlxuICpcbiAqIFRoZSBpbWFnZSB3aWxsIGJlIGNyZWF0ZWQgaW4gYnVpbGQgdGltZSBhbmQgdXBsb2FkZWQgdG8gYW4gRUNSIHJlcG9zaXRvcnkuXG4gKi9cbmV4cG9ydCBjbGFzcyBEb2NrZXJJbWFnZUFzc2V0IGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSUFzc2V0IHtcbiAgLyoqXG4gICAqIFRoZSBmdWxsIFVSSSBvZiB0aGUgaW1hZ2UgKGluY2x1ZGluZyBhIHRhZykuIFVzZSB0aGlzIHJlZmVyZW5jZSB0byBwdWxsXG4gICAqIHRoZSBhc3NldC5cbiAgICovXG4gIHB1YmxpYyBpbWFnZVVyaTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXBvc2l0b3J5IHdoZXJlIHRoZSBpbWFnZSBpcyBzdG9yZWRcbiAgICovXG4gIHB1YmxpYyByZXBvc2l0b3J5OiBlY3IuSVJlcG9zaXRvcnk7XG5cbiAgLyoqXG4gICAqIEEgaGFzaCBvZiB0aGUgc291cmNlIG9mIHRoaXMgYXNzZXQsIHdoaWNoIGlzIGF2YWlsYWJsZSBhdCBjb25zdHJ1Y3Rpb24gdGltZS4gQXMgdGhpcyBpcyBhIHBsYWluXG4gICAqIHN0cmluZywgaXQgY2FuIGJlIHVzZWQgaW4gY29uc3RydWN0IElEcyBpbiBvcmRlciB0byBlbmZvcmNlIGNyZWF0aW9uIG9mIGEgbmV3IHJlc291cmNlIHdoZW5cbiAgICogdGhlIGNvbnRlbnQgaGFzaCBoYXMgY2hhbmdlZC5cbiAgICogQGRlcHJlY2F0ZWQgdXNlIGFzc2V0SGFzaFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNvdXJjZUhhc2g6IHN0cmluZztcblxuICAvKipcbiAgICogQSBoYXNoIG9mIHRoaXMgYXNzZXQsIHdoaWNoIGlzIGF2YWlsYWJsZSBhdCBjb25zdHJ1Y3Rpb24gdGltZS4gQXMgdGhpcyBpcyBhIHBsYWluIHN0cmluZywgaXRcbiAgICogY2FuIGJlIHVzZWQgaW4gY29uc3RydWN0IElEcyBpbiBvcmRlciB0byBlbmZvcmNlIGNyZWF0aW9uIG9mIGEgbmV3IHJlc291cmNlIHdoZW4gdGhlIGNvbnRlbnRcbiAgICogaGFzaCBoYXMgY2hhbmdlZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhc3NldEhhc2g6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHRhZyBvZiB0aGlzIGFzc2V0IHdoZW4gaXQgaXMgdXBsb2FkZWQgdG8gRUNSLiBUaGUgdGFnIG1heSBkaWZmZXIgZnJvbSB0aGUgYXNzZXRIYXNoIGlmIGEgc3RhY2sgc3ludGhlc2l6ZXIgYWRkcyBhIGRvY2tlclRhZ1ByZWZpeC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBpbWFnZVRhZzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgYXNzZXQsIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IENsb3VkIEFzc2VtYmx5XG4gICAqXG4gICAqIElmIGFzc2V0IHN0YWdpbmcgaXMgZGlzYWJsZWQsIHRoaXMgd2lsbCBqdXN0IGJlIHRoZSBvcmlnaW5hbCBwYXRoLlxuICAgKlxuICAgKiBJZiBhc3NldCBzdGFnaW5nIGlzIGVuYWJsZWQgaXQgd2lsbCBiZSB0aGUgc3RhZ2VkIHBhdGguXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGFzc2V0UGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgRG9ja2VyZmlsZSwgcmVsYXRpdmUgdG8gdGhlIGFzc2V0UGF0aFxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBkb2NrZXJmaWxlUGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogQnVpbGQgYXJncyB0byBwYXNzIHRvIHRoZSBgZG9ja2VyIGJ1aWxkYCBjb21tYW5kLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBkb2NrZXJCdWlsZEFyZ3M/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBCdWlsZCBzZWNyZXRzIHRvIHBhc3MgdG8gdGhlIGBkb2NrZXIgYnVpbGRgIGNvbW1hbmQuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGRvY2tlckJ1aWxkU2VjcmV0cz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIE91dHB1dHMgdG8gcGFzcyB0byB0aGUgYGRvY2tlciBidWlsZGAgY29tbWFuZC5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgZG9ja2VyT3V0cHV0cz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBDYWNoZSBmcm9tIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgYGRvY2tlciBidWlsZGAgY29tbWFuZC5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgZG9ja2VyQ2FjaGVGcm9tPzogRG9ja2VyQ2FjaGVPcHRpb25bXTtcblxuICAvKipcbiAgICogQ2FjaGUgdG8gb3B0aW9ucyB0byBwYXNzIHRvIHRoZSBgZG9ja2VyIGJ1aWxkYCBjb21tYW5kLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBkb2NrZXJDYWNoZVRvPzogRG9ja2VyQ2FjaGVPcHRpb247XG5cbiAgLyoqXG4gICAqIERvY2tlciB0YXJnZXQgdG8gYnVpbGQgdG9cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgZG9ja2VyQnVpbGRUYXJnZXQ/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IERvY2tlckltYWdlQXNzZXRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBub25lIG9mIHRoZSBwcm9wZXJ0aWVzIHVzZSB0b2tlbnNcbiAgICB2YWxpZGF0ZVByb3BzKHByb3BzKTtcblxuICAgIC8vIHJlc29sdmUgZnVsbCBwYXRoXG4gICAgY29uc3QgZGlyID0gcGF0aC5yZXNvbHZlKHByb3BzLmRpcmVjdG9yeSk7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGRpcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgaW1hZ2UgZGlyZWN0b3J5IGF0ICR7ZGlyfWApO1xuICAgIH1cblxuICAgIC8vIHZhbGlkYXRlIHRoZSBkb2NrZXIgZmlsZSBleGlzdHNcbiAgICB0aGlzLmRvY2tlcmZpbGVQYXRoID0gcHJvcHMuZmlsZSB8fCAnRG9ja2VyZmlsZSc7XG4gICAgY29uc3QgZmlsZSA9IHBhdGguam9pbihkaXIsIHRoaXMuZG9ja2VyZmlsZVBhdGgpO1xuICAgIGlmICghZnMuZXhpc3RzU3luYyhmaWxlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBmaWxlIGF0ICR7ZmlsZX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0SWdub3JlTW9kZSA9IEZlYXR1cmVGbGFncy5vZih0aGlzKS5pc0VuYWJsZWQoY3hhcGkuRE9DS0VSX0lHTk9SRV9TVVBQT1JUKVxuICAgICAgPyBJZ25vcmVNb2RlLkRPQ0tFUiA6IElnbm9yZU1vZGUuR0xPQjtcbiAgICBsZXQgaWdub3JlTW9kZSA9IHByb3BzLmlnbm9yZU1vZGUgPz8gZGVmYXVsdElnbm9yZU1vZGU7XG5cbiAgICBsZXQgZXhjbHVkZTogc3RyaW5nW10gPSBwcm9wcy5leGNsdWRlIHx8IFtdO1xuXG4gICAgY29uc3QgaWdub3JlID0gcGF0aC5qb2luKGRpciwgJy5kb2NrZXJpZ25vcmUnKTtcblxuICAgIGlmIChmcy5leGlzdHNTeW5jKGlnbm9yZSkpIHtcbiAgICAgIGNvbnN0IGRvY2tlcklnbm9yZVBhdHRlcm5zID0gZnMucmVhZEZpbGVTeW5jKGlnbm9yZSkudG9TdHJpbmcoKS5zcGxpdCgnXFxuJykuZmlsdGVyKGUgPT4gISFlKTtcblxuICAgICAgZXhjbHVkZSA9IFtcbiAgICAgICAgLi4uZG9ja2VySWdub3JlUGF0dGVybnMsXG4gICAgICAgIC4uLmV4Y2x1ZGUsXG5cbiAgICAgICAgLy8gRW5zdXJlIC5kb2NrZXJpZ25vcmUgaXMgaW5jbHVkZWQgbm8gbWF0dGVyIHdoYXQuXG4gICAgICAgICchLmRvY2tlcmlnbm9yZScsXG4gICAgICBdO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSB0aGUgRG9ja2VyZmlsZSBpcyBpbmNsdWRlZCBubyBtYXR0ZXIgd2hhdC5cbiAgICBleGNsdWRlLnB1c2goJyEnICsgcGF0aC5iYXNlbmFtZShmaWxlKSk7XG4gICAgLy8gRW5zdXJlIHRoZSBjZGsub3V0IGZvbGRlciBpcyBub3QgaW5jbHVkZWQgdG8gYXZvaWQgaW5maW5pdGUgbG9vcHMuXG4gICAgY29uc3QgY2Rrb3V0ID0gU3RhZ2Uub2YodGhpcyk/Lm91dGRpciA/PyAnY2RrLm91dCc7XG4gICAgZXhjbHVkZS5wdXNoKGNka291dCk7XG5cbiAgICBpZiAocHJvcHMucmVwb3NpdG9yeU5hbWUpIHtcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoJ0RvY2tlckltYWdlQXNzZXQucmVwb3NpdG9yeU5hbWUgaXMgZGVwcmVjYXRlZC4gT3ZlcnJpZGUgXCJjb3JlLlN0YWNrLmFkZERvY2tlckltYWdlQXNzZXRcIiB0byBjb250cm9sIGFzc2V0IGxvY2F0aW9ucycpO1xuICAgIH1cblxuICAgIC8vIGluY2x1ZGUgYnVpbGQgY29udGV4dCBpbiBcImV4dHJhXCIgc28gaXQgd2lsbCBpbXBhY3QgdGhlIGhhc2hcbiAgICBjb25zdCBleHRyYUhhc2g6IHsgW2ZpZWxkOiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuICAgIGlmIChwcm9wcy5pbnZhbGlkYXRpb24/LmV4dHJhSGFzaCAhPT0gZmFsc2UgJiYgcHJvcHMuZXh0cmFIYXNoKSB7IGV4dHJhSGFzaC51c2VyID0gcHJvcHMuZXh0cmFIYXNoOyB9XG4gICAgaWYgKHByb3BzLmludmFsaWRhdGlvbj8uYnVpbGRBcmdzICE9PSBmYWxzZSAmJiBwcm9wcy5idWlsZEFyZ3MpIHsgZXh0cmFIYXNoLmJ1aWxkQXJncyA9IHByb3BzLmJ1aWxkQXJnczsgfVxuICAgIGlmIChwcm9wcy5pbnZhbGlkYXRpb24/LmJ1aWxkU2VjcmV0cyAhPT0gZmFsc2UgJiYgcHJvcHMuYnVpbGRTZWNyZXRzKSB7IGV4dHJhSGFzaC5idWlsZFNlY3JldHMgPSBwcm9wcy5idWlsZFNlY3JldHM7IH1cbiAgICBpZiAocHJvcHMuaW52YWxpZGF0aW9uPy50YXJnZXQgIT09IGZhbHNlICYmIHByb3BzLnRhcmdldCkgeyBleHRyYUhhc2gudGFyZ2V0ID0gcHJvcHMudGFyZ2V0OyB9XG4gICAgaWYgKHByb3BzLmludmFsaWRhdGlvbj8uZmlsZSAhPT0gZmFsc2UgJiYgcHJvcHMuZmlsZSkgeyBleHRyYUhhc2guZmlsZSA9IHByb3BzLmZpbGU7IH1cbiAgICBpZiAocHJvcHMuaW52YWxpZGF0aW9uPy5yZXBvc2l0b3J5TmFtZSAhPT0gZmFsc2UgJiYgcHJvcHMucmVwb3NpdG9yeU5hbWUpIHsgZXh0cmFIYXNoLnJlcG9zaXRvcnlOYW1lID0gcHJvcHMucmVwb3NpdG9yeU5hbWU7IH1cbiAgICBpZiAocHJvcHMuaW52YWxpZGF0aW9uPy5uZXR3b3JrTW9kZSAhPT0gZmFsc2UgJiYgcHJvcHMubmV0d29ya01vZGUpIHsgZXh0cmFIYXNoLm5ldHdvcmtNb2RlID0gcHJvcHMubmV0d29ya01vZGU7IH1cbiAgICBpZiAocHJvcHMuaW52YWxpZGF0aW9uPy5wbGF0Zm9ybSAhPT0gZmFsc2UgJiYgcHJvcHMucGxhdGZvcm0pIHsgZXh0cmFIYXNoLnBsYXRmb3JtID0gcHJvcHMucGxhdGZvcm07IH1cbiAgICBpZiAocHJvcHMuaW52YWxpZGF0aW9uPy5vdXRwdXRzICE9PSBmYWxzZSAmJiBwcm9wcy5vdXRwdXRzKSB7IGV4dHJhSGFzaC5vdXRwdXRzID0gcHJvcHMub3V0cHV0czsgfVxuXG4gICAgLy8gYWRkIFwic2FsdFwiIHRvIHRoZSBoYXNoIGluIG9yZGVyIHRvIGludmFsaWRhdGUgdGhlIGltYWdlIGluIHRoZSB1cGdyYWRlIHRvXG4gICAgLy8gMS4yMS4wIHdoaWNoIHJlbW92ZXMgdGhlIEFkb3B0ZWRSZXBvc2l0b3J5IHJlc291cmNlIChhbmQgd2lsbCBjYXVzZSB0aGVcbiAgICAvLyBkZWxldGlvbiBvZiB0aGUgRUNSIHJlcG9zaXRvcnkgdGhlIGFwcCB1c2VkKS5cbiAgICBleHRyYUhhc2gudmVyc2lvbiA9ICcxLjIxLjAnO1xuXG4gICAgY29uc3Qgc3RhZ2luZyA9IG5ldyBBc3NldFN0YWdpbmcodGhpcywgJ1N0YWdpbmcnLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGZvbGxvdzogcHJvcHMuZm9sbG93U3ltbGlua3MgPz8gdG9TeW1saW5rRm9sbG93KHByb3BzLmZvbGxvdyksXG4gICAgICBleGNsdWRlLFxuICAgICAgaWdub3JlTW9kZSxcbiAgICAgIHNvdXJjZVBhdGg6IGRpcixcbiAgICAgIGV4dHJhSGFzaDogT2JqZWN0LmtleXMoZXh0cmFIYXNoKS5sZW5ndGggPT09IDBcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiBKU09OLnN0cmluZ2lmeShleHRyYUhhc2gpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zb3VyY2VIYXNoID0gc3RhZ2luZy5hc3NldEhhc2g7XG4gICAgdGhpcy5hc3NldEhhc2ggPSBzdGFnaW5nLmFzc2V0SGFzaDtcblxuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcyk7XG4gICAgdGhpcy5hc3NldFBhdGggPSBzdGFnaW5nLnJlbGF0aXZlU3RhZ2VkUGF0aChzdGFjayk7XG4gICAgdGhpcy5kb2NrZXJCdWlsZEFyZ3MgPSBwcm9wcy5idWlsZEFyZ3M7XG4gICAgdGhpcy5kb2NrZXJCdWlsZFNlY3JldHMgPSBwcm9wcy5idWlsZFNlY3JldHM7XG4gICAgdGhpcy5kb2NrZXJCdWlsZFRhcmdldCA9IHByb3BzLnRhcmdldDtcbiAgICB0aGlzLmRvY2tlck91dHB1dHMgPSBwcm9wcy5vdXRwdXRzO1xuICAgIHRoaXMuZG9ja2VyQ2FjaGVGcm9tID0gcHJvcHMuY2FjaGVGcm9tO1xuICAgIHRoaXMuZG9ja2VyQ2FjaGVUbyA9IHByb3BzLmNhY2hlVG87XG5cbiAgICBjb25zdCBsb2NhdGlvbiA9IHN0YWNrLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoe1xuICAgICAgZGlyZWN0b3J5TmFtZTogdGhpcy5hc3NldFBhdGgsXG4gICAgICBkb2NrZXJCdWlsZEFyZ3M6IHRoaXMuZG9ja2VyQnVpbGRBcmdzLFxuICAgICAgZG9ja2VyQnVpbGRTZWNyZXRzOiB0aGlzLmRvY2tlckJ1aWxkU2VjcmV0cyxcbiAgICAgIGRvY2tlckJ1aWxkVGFyZ2V0OiB0aGlzLmRvY2tlckJ1aWxkVGFyZ2V0LFxuICAgICAgZG9ja2VyRmlsZTogcHJvcHMuZmlsZSxcbiAgICAgIHNvdXJjZUhhc2g6IHN0YWdpbmcuYXNzZXRIYXNoLFxuICAgICAgbmV0d29ya01vZGU6IHByb3BzLm5ldHdvcmtNb2RlPy5tb2RlLFxuICAgICAgcGxhdGZvcm06IHByb3BzLnBsYXRmb3JtPy5wbGF0Zm9ybSxcbiAgICAgIGRvY2tlck91dHB1dHM6IHRoaXMuZG9ja2VyT3V0cHV0cyxcbiAgICAgIGRvY2tlckNhY2hlRnJvbTogdGhpcy5kb2NrZXJDYWNoZUZyb20sXG4gICAgICBkb2NrZXJDYWNoZVRvOiB0aGlzLmRvY2tlckNhY2hlVG8sXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlcG9zaXRvcnkgPSBlY3IuUmVwb3NpdG9yeS5mcm9tUmVwb3NpdG9yeU5hbWUodGhpcywgJ1JlcG9zaXRvcnknLCBsb2NhdGlvbi5yZXBvc2l0b3J5TmFtZSk7XG4gICAgdGhpcy5pbWFnZVVyaSA9IGxvY2F0aW9uLmltYWdlVXJpO1xuICAgIHRoaXMuaW1hZ2VUYWcgPSBsb2NhdGlvbi5pbWFnZVRhZyA/PyB0aGlzLmFzc2V0SGFzaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIG1ldGFkYXRhIHRvIHRoZSBzcGVjaWZpZWQgcmVzb3VyY2Ugd2l0aFxuICAgKiBpbmZvcm1hdGlvbiB0aGF0IGluZGljYXRlcyB3aGljaCByZXNvdXJjZSBwcm9wZXJ0eSBpcyBtYXBwZWQgdG8gdGhpcyBsb2NhbFxuICAgKiBhc3NldC4gVGhpcyBjYW4gYmUgdXNlZCBieSB0b29scyBzdWNoIGFzIFNBTSBDTEkgdG8gcHJvdmlkZSBsb2NhbFxuICAgKiBleHBlcmllbmNlIHN1Y2ggYXMgbG9jYWwgaW52b2NhdGlvbiBhbmQgZGVidWdnaW5nIG9mIExhbWJkYSBmdW5jdGlvbnMuXG4gICAqXG4gICAqIEFzc2V0IG1ldGFkYXRhIHdpbGwgb25seSBiZSBpbmNsdWRlZCBpZiB0aGUgc3RhY2sgaXMgc3ludGhlc2l6ZWQgd2l0aCB0aGVcbiAgICogXCJhd3M6Y2RrOmVuYWJsZS1hc3NldC1tZXRhZGF0YVwiIGNvbnRleHQga2V5IGRlZmluZWQsIHdoaWNoIGlzIHRoZSBkZWZhdWx0XG4gICAqIGJlaGF2aW9yIHdoZW4gc3ludGhlc2l6aW5nIHZpYSB0aGUgQ0RLIFRvb2xraXQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy8xNDMyXG4gICAqXG4gICAqIEBwYXJhbSByZXNvdXJjZSBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2Ugd2hpY2ggaXMgdXNpbmcgdGhpcyBhc3NldCBbZGlzYWJsZS1hd3NsaW50OnJlZi12aWEtaW50ZXJmYWNlXVxuICAgKiBAcGFyYW0gcmVzb3VyY2VQcm9wZXJ0eSBUaGUgcHJvcGVydHkgbmFtZSB3aGVyZSB0aGlzIGFzc2V0IGlzIHJlZmVyZW5jZWRcbiAgICovXG4gIHB1YmxpYyBhZGRSZXNvdXJjZU1ldGFkYXRhKHJlc291cmNlOiBDZm5SZXNvdXJjZSwgcmVzb3VyY2VQcm9wZXJ0eTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9FTkFCTEVEX0NPTlRFWFQpKSB7XG4gICAgICByZXR1cm47IC8vIG5vdCBlbmFibGVkXG4gICAgfVxuXG4gICAgLy8gdGVsbCB0b29scyBzdWNoIGFzIFNBTSBDTEkgdGhhdCB0aGUgcmVzb3VyY2VQcm9wZXJ0eSBvZiB0aGlzIHJlc291cmNlXG4gICAgLy8gcG9pbnRzIHRvIGEgbG9jYWwgcGF0aCBhbmQgaW5jbHVkZSB0aGUgcGF0aCB0byBkZSBkb2NrZXJmaWxlLCBkb2NrZXIgYnVpbGQgYXJncywgYW5kIHRhcmdldCxcbiAgICAvLyBpbiBvcmRlciB0byBlbmFibGUgbG9jYWwgaW52b2NhdGlvbiBvZiB0aGlzIGZ1bmN0aW9uLlxuICAgIHJlc291cmNlLmNmbk9wdGlvbnMubWV0YWRhdGEgPSByZXNvdXJjZS5jZm5PcHRpb25zLm1ldGFkYXRhIHx8IHt9O1xuICAgIHJlc291cmNlLmNmbk9wdGlvbnMubWV0YWRhdGFbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfUEFUSF9LRVldID0gdGhpcy5hc3NldFBhdGg7XG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YVtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9ET0NLRVJGSUxFX1BBVEhfS0VZXSA9IHRoaXMuZG9ja2VyZmlsZVBhdGg7XG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YVtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9ET0NLRVJfQlVJTERfQVJHU19LRVldID0gdGhpcy5kb2NrZXJCdWlsZEFyZ3M7XG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YVtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9ET0NLRVJfQlVJTERfU0VDUkVUU19LRVldID0gdGhpcy5kb2NrZXJCdWlsZFNlY3JldHM7XG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YVtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9ET0NLRVJfQlVJTERfVEFSR0VUX0tFWV0gPSB0aGlzLmRvY2tlckJ1aWxkVGFyZ2V0O1xuICAgIHJlc291cmNlLmNmbk9wdGlvbnMubWV0YWRhdGFbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfUFJPUEVSVFlfS0VZXSA9IHJlc291cmNlUHJvcGVydHk7XG4gICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5tZXRhZGF0YVtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9ET0NLRVJfT1VUUFVUU19LRVldID0gdGhpcy5kb2NrZXJPdXRwdXRzO1xuICAgIHJlc291cmNlLmNmbk9wdGlvbnMubWV0YWRhdGFbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRE9DS0VSX0NBQ0hFX0ZST01fS0VZXSA9IHRoaXMuZG9ja2VyQ2FjaGVGcm9tO1xuICAgIHJlc291cmNlLmNmbk9wdGlvbnMubWV0YWRhdGFbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRE9DS0VSX0NBQ0hFX1RPX0tFWV0gPSB0aGlzLmRvY2tlckNhY2hlVG87XG4gIH1cblxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3BzKHByb3BzOiBEb2NrZXJJbWFnZUFzc2V0UHJvcHMpIHtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHMpKSB7XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZCh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHVzZSBUb2tlbiBhcyB2YWx1ZSBvZiAnJHtrZXl9JzogdGhpcyB2YWx1ZSBpcyB1c2VkIGJlZm9yZSBkZXBsb3ltZW50IHN0YXJ0c2ApO1xuICAgIH1cbiAgfVxuXG4gIHZhbGlkYXRlQnVpbGRBcmdzKHByb3BzLmJ1aWxkQXJncyk7XG4gIHZhbGlkYXRlQnVpbGRTZWNyZXRzKHByb3BzLmJ1aWxkU2VjcmV0cyk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQnVpbGRQcm9wcyhidWlsZFByb3BOYW1lOiBzdHJpbmcsIGJ1aWxkUHJvcHM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGJ1aWxkUHJvcHMgfHwge30pKSB7XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChrZXkpIHx8IFRva2VuLmlzVW5yZXNvbHZlZCh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHVzZSB0b2tlbnMgaW4ga2V5cyBvciB2YWx1ZXMgb2YgXCIke2J1aWxkUHJvcE5hbWV9XCIgc2luY2UgdGhleSBhcmUgbmVlZGVkIGJlZm9yZSBkZXBsb3ltZW50YCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQnVpbGRBcmdzKGJ1aWxkQXJncz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgdmFsaWRhdGVCdWlsZFByb3BzKCdidWlsZEFyZ3MnLCBidWlsZEFyZ3MpO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUJ1aWxkU2VjcmV0cyhidWlsZFNlY3JldHM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gIHZhbGlkYXRlQnVpbGRQcm9wcygnYnVpbGRTZWNyZXRzJywgYnVpbGRTZWNyZXRzKTtcbn1cblxuZnVuY3Rpb24gdG9TeW1saW5rRm9sbG93KGZvbGxvdz86IEZvbGxvd01vZGUpOiBTeW1saW5rRm9sbG93TW9kZSB8IHVuZGVmaW5lZCB7XG4gIHN3aXRjaCAoZm9sbG93KSB7XG4gICAgY2FzZSB1bmRlZmluZWQ6IHJldHVybiB1bmRlZmluZWQ7XG4gICAgY2FzZSBGb2xsb3dNb2RlLk5FVkVSOiByZXR1cm4gU3ltbGlua0ZvbGxvd01vZGUuTkVWRVI7XG4gICAgY2FzZSBGb2xsb3dNb2RlLkFMV0FZUzogcmV0dXJuIFN5bWxpbmtGb2xsb3dNb2RlLkFMV0FZUztcbiAgICBjYXNlIEZvbGxvd01vZGUuQkxPQ0tfRVhURVJOQUw6IHJldHVybiBTeW1saW5rRm9sbG93TW9kZS5CTE9DS19FWFRFUk5BTDtcbiAgICBjYXNlIEZvbGxvd01vZGUuRVhURVJOQUw6IHJldHVybiBTeW1saW5rRm9sbG93TW9kZS5FWFRFUk5BTDtcbiAgfVxufVxuIl19