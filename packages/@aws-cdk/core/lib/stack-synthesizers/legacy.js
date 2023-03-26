"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyStackSynthesizer = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const _shared_1 = require("./_shared");
const stack_synthesizer_1 = require("./stack-synthesizer");
const cfn_fn_1 = require("../cfn-fn");
const asset_parameters_1 = require("../private/asset-parameters");
/**
 * The well-known name for the docker image asset ECR repository. All docker
 * image assets will be pushed into this repository with an image tag based on
 * the source hash.
 */
const ASSETS_ECR_REPOSITORY_NAME = 'aws-cdk/assets';
/**
 * This allows users to work around the fact that the ECR repository is
 * (currently) not configurable by setting this context key to their desired
 * repository name. The CLI will auto-create this ECR repository if it's not
 * already created.
 */
const ASSETS_ECR_REPOSITORY_NAME_OVERRIDE_CONTEXT_KEY = 'assets-ecr-repository-name';
/**
 * Use the CDK classic way of referencing assets
 *
 * This synthesizer will generate CloudFormation parameters for every referenced
 * asset, and use the CLI's current credentials to deploy the stack.
 *
 * - It does not support cross-account deployment (the CLI must have credentials
 *   to the account you are trying to deploy to).
 * - It cannot be used with **CDK Pipelines**. To deploy using CDK Pipelines,
 *   you must use the `DefaultStackSynthesizer`.
 * - Each asset will take up a CloudFormation Parameter in your template. Keep in
 *   mind that there is a maximum of 200 parameters in a CloudFormation template.
 *   To use determinstic asset locations instead, use `CliCredentialsStackSynthesizer`.
 *
 * Be aware that your CLI credentials must be valid for the duration of the
 * entire deployment. If you are using session credentials, make sure the
 * session lifetime is long enough.
 *
 * This is the only StackSynthesizer that supports customizing asset behavior
 * by overriding `Stack.addFileAsset()` and `Stack.addDockerImageAsset()`.
 */
class LegacyStackSynthesizer extends stack_synthesizer_1.StackSynthesizer {
    constructor() {
        super(...arguments);
        this.cycle = false;
        /**
         * The image ID of all the docker image assets that were already added to this
         * stack (to avoid duplication).
         */
        this.addedImageAssets = new Set();
    }
    addFileAsset(asset) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_FileAssetSource(asset);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFileAsset);
            }
            throw error;
        }
        // Backwards compatibility hack. We have a number of conflicting goals here:
        //
        // - We want put the actual logic in this class
        // - We ALSO want to keep supporting people overriding Stack.addFileAsset (for backwards compatibility,
        // because that mechanism is currently used to make CI/CD scenarios work)
        // - We ALSO want to allow both entry points from user code (our own framework
        // code will always call stack.deploymentMechanism.addFileAsset() but existing users
        // may still be calling `stack.addFileAsset()` directly.
        //
        // Solution: delegate call to the stack, but if the stack delegates back to us again
        // then do the actual logic.
        //
        // @deprecated: this can be removed for v2
        if (this.cycle) {
            return this.doAddFileAsset(asset);
        }
        this.cycle = true;
        try {
            const stack = this.boundStack;
            return withoutDeprecationWarnings(() => stack.addFileAsset(asset));
        }
        finally {
            this.cycle = false;
        }
    }
    addDockerImageAsset(asset) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_DockerImageAssetSource(asset);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDockerImageAsset);
            }
            throw error;
        }
        // See `addFileAsset` for explanation.
        // @deprecated: this can be removed for v2
        if (this.cycle) {
            return this.doAddDockerImageAsset(asset);
        }
        this.cycle = true;
        try {
            const stack = this.boundStack;
            return withoutDeprecationWarnings(() => stack.addDockerImageAsset(asset));
        }
        finally {
            this.cycle = false;
        }
    }
    /**
     * Synthesize the associated stack to the session
     */
    synthesize(session) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ISynthesisSession(session);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.synthesize);
            }
            throw error;
        }
        this.synthesizeTemplate(session);
        // Just do the default stuff, nothing special
        this.emitArtifact(session);
    }
    /**
     * Produce a bound Stack Synthesizer for the given stack.
     *
     * This method may be called more than once on the same object.
     */
    reusableBind(stack) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.reusableBind);
            }
            throw error;
        }
        // Create a copy of the current object and bind that
        const copy = Object.create(this);
        copy.bind(stack);
        return copy;
    }
    doAddDockerImageAsset(asset) {
        // check if we have an override from context
        const repositoryNameOverride = this.boundStack.node.tryGetContext(ASSETS_ECR_REPOSITORY_NAME_OVERRIDE_CONTEXT_KEY);
        const repositoryName = asset.repositoryName ?? repositoryNameOverride ?? ASSETS_ECR_REPOSITORY_NAME;
        const imageTag = asset.sourceHash;
        const assetId = asset.sourceHash;
        // only add every image (identified by source hash) once for each stack that uses it.
        if (!this.addedImageAssets.has(assetId)) {
            if (!asset.directoryName) {
                throw new Error(`LegacyStackSynthesizer does not support this type of file asset: ${JSON.stringify(asset)}`);
            }
            const metadata = {
                repositoryName,
                imageTag,
                id: assetId,
                packaging: 'container-image',
                path: asset.directoryName,
                sourceHash: asset.sourceHash,
                buildArgs: asset.dockerBuildArgs,
                target: asset.dockerBuildTarget,
                file: asset.dockerFile,
                networkMode: asset.networkMode,
                platform: asset.platform,
                outputs: asset.dockerOutputs,
                cacheFrom: asset.dockerCacheFrom,
                cacheTo: asset.dockerCacheTo,
            };
            this.boundStack.node.addMetadata(cxschema.ArtifactMetadataEntryType.ASSET, metadata);
            this.addedImageAssets.add(assetId);
        }
        return {
            imageUri: `${this.boundStack.account}.dkr.ecr.${this.boundStack.region}.${this.boundStack.urlSuffix}/${repositoryName}:${imageTag}`,
            repositoryName,
        };
    }
    doAddFileAsset(asset) {
        let params = this.assetParameters.node.tryFindChild(asset.sourceHash);
        if (!params) {
            params = new asset_parameters_1.FileAssetParameters(this.assetParameters, asset.sourceHash);
            if (!asset.fileName || !asset.packaging) {
                throw new Error(`LegacyStackSynthesizer does not support this type of file asset: ${JSON.stringify(asset)}`);
            }
            const metadata = {
                path: asset.fileName,
                id: asset.sourceHash,
                packaging: asset.packaging,
                sourceHash: asset.sourceHash,
                s3BucketParameter: params.bucketNameParameter.logicalId,
                s3KeyParameter: params.objectKeyParameter.logicalId,
                artifactHashParameter: params.artifactHashParameter.logicalId,
            };
            this.boundStack.node.addMetadata(cxschema.ArtifactMetadataEntryType.ASSET, metadata);
        }
        const bucketName = params.bucketNameParameter.valueAsString;
        // key is prefix|postfix
        const encodedKey = params.objectKeyParameter.valueAsString;
        const s3Prefix = cfn_fn_1.Fn.select(0, cfn_fn_1.Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, encodedKey));
        const s3Filename = cfn_fn_1.Fn.select(1, cfn_fn_1.Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, encodedKey));
        const objectKey = `${s3Prefix}${s3Filename}`;
        const httpUrl = `https://s3.${this.boundStack.region}.${this.boundStack.urlSuffix}/${bucketName}/${objectKey}`;
        const s3ObjectUrl = `s3://${bucketName}/${objectKey}`;
        return { bucketName, objectKey, httpUrl, s3ObjectUrl, s3Url: httpUrl };
    }
    get assetParameters() {
        (0, _shared_1.assertBound)(this.boundStack);
        if (!this._assetParameters) {
            this._assetParameters = new constructs_1.Construct(this.boundStack, 'AssetParameters');
        }
        return this._assetParameters;
    }
}
_a = JSII_RTTI_SYMBOL_1;
LegacyStackSynthesizer[_a] = { fqn: "@aws-cdk/core.LegacyStackSynthesizer", version: "0.0.0" };
exports.LegacyStackSynthesizer = LegacyStackSynthesizer;
function withoutDeprecationWarnings(block) {
    const orig = process.env.JSII_DEPRECATED;
    process.env.JSII_DEPRECATED = 'quiet';
    try {
        return block();
    }
    finally {
        process.env.JSII_DEPRECATED = orig;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGVnYWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJEQUEyRDtBQUMzRCx5Q0FBeUM7QUFDekMsMkNBQXVDO0FBQ3ZDLHVDQUF3QztBQUN4QywyREFBdUQ7QUFHdkQsc0NBQStCO0FBQy9CLGtFQUFrRTtBQUdsRTs7OztHQUlHO0FBQ0gsTUFBTSwwQkFBMEIsR0FBRyxnQkFBZ0IsQ0FBQztBQUVwRDs7Ozs7R0FLRztBQUNILE1BQU0sK0NBQStDLEdBQUcsNEJBQTRCLENBQUM7QUFFckY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JHO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxvQ0FBZ0I7SUFBNUQ7O1FBQ1UsVUFBSyxHQUFHLEtBQUssQ0FBQztRQU90Qjs7O1dBR0c7UUFDYyxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0tBdUp2RDtJQXJKUSxZQUFZLENBQUMsS0FBc0I7Ozs7Ozs7Ozs7UUFDeEMsNEVBQTRFO1FBQzVFLEVBQUU7UUFDRiwrQ0FBK0M7UUFDL0MsdUdBQXVHO1FBQ3ZHLHlFQUF5RTtRQUN6RSw4RUFBOEU7UUFDOUUsb0ZBQW9GO1FBQ3BGLHdEQUF3RDtRQUN4RCxFQUFFO1FBQ0Ysb0ZBQW9GO1FBQ3BGLDRCQUE0QjtRQUM1QixFQUFFO1FBQ0YsMENBQTBDO1FBQzFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQztRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUk7WUFDRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzlCLE9BQU8sMEJBQTBCLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3BFO2dCQUFTO1lBQ1IsSUFBSSxDQUFD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QUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO0lBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQztJQUN0QyxJQUFJO1FBQ0YsT0FBTyxLQUFLLEVBQUUsQ0FBQztLQUNoQjtZQUFTO1FBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0tBQ3BDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBhc3NlcnRCb3VuZCB9IGZyb20gJy4vX3NoYXJlZCc7XG5pbXBvcnQgeyBTdGFja1N5bnRoZXNpemVyIH0gZnJvbSAnLi9zdGFjay1zeW50aGVzaXplcic7XG5pbXBvcnQgeyBJU3ludGhlc2lzU2Vzc2lvbiwgSVJldXNhYmxlU3RhY2tTeW50aGVzaXplciwgSUJvdW5kU3RhY2tTeW50aGVzaXplciB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgRG9ja2VySW1hZ2VBc3NldExvY2F0aW9uLCBEb2NrZXJJbWFnZUFzc2V0U291cmNlLCBGaWxlQXNzZXRMb2NhdGlvbiwgRmlsZUFzc2V0U291cmNlIH0gZnJvbSAnLi4vYXNzZXRzJztcbmltcG9ydCB7IEZuIH0gZnJvbSAnLi4vY2ZuLWZuJztcbmltcG9ydCB7IEZpbGVBc3NldFBhcmFtZXRlcnMgfSBmcm9tICcuLi9wcml2YXRlL2Fzc2V0LXBhcmFtZXRlcnMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuLi9zdGFjayc7XG5cbi8qKlxuICogVGhlIHdlbGwta25vd24gbmFtZSBmb3IgdGhlIGRvY2tlciBpbWFnZSBhc3NldCBFQ1IgcmVwb3NpdG9yeS4gQWxsIGRvY2tlclxuICogaW1hZ2UgYXNzZXRzIHdpbGwgYmUgcHVzaGVkIGludG8gdGhpcyByZXBvc2l0b3J5IHdpdGggYW4gaW1hZ2UgdGFnIGJhc2VkIG9uXG4gKiB0aGUgc291cmNlIGhhc2guXG4gKi9cbmNvbnN0IEFTU0VUU19FQ1JfUkVQT1NJVE9SWV9OQU1FID0gJ2F3cy1jZGsvYXNzZXRzJztcblxuLyoqXG4gKiBUaGlzIGFsbG93cyB1c2VycyB0byB3b3JrIGFyb3VuZCB0aGUgZmFjdCB0aGF0IHRoZSBFQ1IgcmVwb3NpdG9yeSBpc1xuICogKGN1cnJlbnRseSkgbm90IGNvbmZpZ3VyYWJsZSBieSBzZXR0aW5nIHRoaXMgY29udGV4dCBrZXkgdG8gdGhlaXIgZGVzaXJlZFxuICogcmVwb3NpdG9yeSBuYW1lLiBUaGUgQ0xJIHdpbGwgYXV0by1jcmVhdGUgdGhpcyBFQ1IgcmVwb3NpdG9yeSBpZiBpdCdzIG5vdFxuICogYWxyZWFkeSBjcmVhdGVkLlxuICovXG5jb25zdCBBU1NFVFNfRUNSX1JFUE9TSVRPUllfTkFNRV9PVkVSUklERV9DT05URVhUX0tFWSA9ICdhc3NldHMtZWNyLXJlcG9zaXRvcnktbmFtZSc7XG5cbi8qKlxuICogVXNlIHRoZSBDREsgY2xhc3NpYyB3YXkgb2YgcmVmZXJlbmNpbmcgYXNzZXRzXG4gKlxuICogVGhpcyBzeW50aGVzaXplciB3aWxsIGdlbmVyYXRlIENsb3VkRm9ybWF0aW9uIHBhcmFtZXRlcnMgZm9yIGV2ZXJ5IHJlZmVyZW5jZWRcbiAqIGFzc2V0LCBhbmQgdXNlIHRoZSBDTEkncyBjdXJyZW50IGNyZWRlbnRpYWxzIHRvIGRlcGxveSB0aGUgc3RhY2suXG4gKlxuICogLSBJdCBkb2VzIG5vdCBzdXBwb3J0IGNyb3NzLWFjY291bnQgZGVwbG95bWVudCAodGhlIENMSSBtdXN0IGhhdmUgY3JlZGVudGlhbHNcbiAqICAgdG8gdGhlIGFjY291bnQgeW91IGFyZSB0cnlpbmcgdG8gZGVwbG95IHRvKS5cbiAqIC0gSXQgY2Fubm90IGJlIHVzZWQgd2l0aCAqKkNESyBQaXBlbGluZXMqKi4gVG8gZGVwbG95IHVzaW5nIENESyBQaXBlbGluZXMsXG4gKiAgIHlvdSBtdXN0IHVzZSB0aGUgYERlZmF1bHRTdGFja1N5bnRoZXNpemVyYC5cbiAqIC0gRWFjaCBhc3NldCB3aWxsIHRha2UgdXAgYSBDbG91ZEZvcm1hdGlvbiBQYXJhbWV0ZXIgaW4geW91ciB0ZW1wbGF0ZS4gS2VlcCBpblxuICogICBtaW5kIHRoYXQgdGhlcmUgaXMgYSBtYXhpbXVtIG9mIDIwMCBwYXJhbWV0ZXJzIGluIGEgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gKiAgIFRvIHVzZSBkZXRlcm1pbnN0aWMgYXNzZXQgbG9jYXRpb25zIGluc3RlYWQsIHVzZSBgQ2xpQ3JlZGVudGlhbHNTdGFja1N5bnRoZXNpemVyYC5cbiAqXG4gKiBCZSBhd2FyZSB0aGF0IHlvdXIgQ0xJIGNyZWRlbnRpYWxzIG11c3QgYmUgdmFsaWQgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGVcbiAqIGVudGlyZSBkZXBsb3ltZW50LiBJZiB5b3UgYXJlIHVzaW5nIHNlc3Npb24gY3JlZGVudGlhbHMsIG1ha2Ugc3VyZSB0aGVcbiAqIHNlc3Npb24gbGlmZXRpbWUgaXMgbG9uZyBlbm91Z2guXG4gKlxuICogVGhpcyBpcyB0aGUgb25seSBTdGFja1N5bnRoZXNpemVyIHRoYXQgc3VwcG9ydHMgY3VzdG9taXppbmcgYXNzZXQgYmVoYXZpb3JcbiAqIGJ5IG92ZXJyaWRpbmcgYFN0YWNrLmFkZEZpbGVBc3NldCgpYCBhbmQgYFN0YWNrLmFkZERvY2tlckltYWdlQXNzZXQoKWAuXG4gKi9cbmV4cG9ydCBjbGFzcyBMZWdhY3lTdGFja1N5bnRoZXNpemVyIGV4dGVuZHMgU3RhY2tTeW50aGVzaXplciBpbXBsZW1lbnRzIElSZXVzYWJsZVN0YWNrU3ludGhlc2l6ZXIsIElCb3VuZFN0YWNrU3ludGhlc2l6ZXIge1xuICBwcml2YXRlIGN5Y2xlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEluY2x1ZGVzIGFsbCBwYXJhbWV0ZXJzIHN5bnRoZXNpemVkIGZvciBhc3NldHMgKGxhenkpLlxuICAgKi9cbiAgcHJpdmF0ZSBfYXNzZXRQYXJhbWV0ZXJzPzogQ29uc3RydWN0O1xuXG4gIC8qKlxuICAgKiBUaGUgaW1hZ2UgSUQgb2YgYWxsIHRoZSBkb2NrZXIgaW1hZ2UgYXNzZXRzIHRoYXQgd2VyZSBhbHJlYWR5IGFkZGVkIHRvIHRoaXNcbiAgICogc3RhY2sgKHRvIGF2b2lkIGR1cGxpY2F0aW9uKS5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgYWRkZWRJbWFnZUFzc2V0cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIHB1YmxpYyBhZGRGaWxlQXNzZXQoYXNzZXQ6IEZpbGVBc3NldFNvdXJjZSk6IEZpbGVBc3NldExvY2F0aW9uIHtcbiAgICAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBoYWNrLiBXZSBoYXZlIGEgbnVtYmVyIG9mIGNvbmZsaWN0aW5nIGdvYWxzIGhlcmU6XG4gICAgLy9cbiAgICAvLyAtIFdlIHdhbnQgcHV0IHRoZSBhY3R1YWwgbG9naWMgaW4gdGhpcyBjbGFzc1xuICAgIC8vIC0gV2UgQUxTTyB3YW50IHRvIGtlZXAgc3VwcG9ydGluZyBwZW9wbGUgb3ZlcnJpZGluZyBTdGFjay5hZGRGaWxlQXNzZXQgKGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSxcbiAgICAvLyBiZWNhdXNlIHRoYXQgbWVjaGFuaXNtIGlzIGN1cnJlbnRseSB1c2VkIHRvIG1ha2UgQ0kvQ0Qgc2NlbmFyaW9zIHdvcmspXG4gICAgLy8gLSBXZSBBTFNPIHdhbnQgdG8gYWxsb3cgYm90aCBlbnRyeSBwb2ludHMgZnJvbSB1c2VyIGNvZGUgKG91ciBvd24gZnJhbWV3b3JrXG4gICAgLy8gY29kZSB3aWxsIGFsd2F5cyBjYWxsIHN0YWNrLmRlcGxveW1lbnRNZWNoYW5pc20uYWRkRmlsZUFzc2V0KCkgYnV0IGV4aXN0aW5nIHVzZXJzXG4gICAgLy8gbWF5IHN0aWxsIGJlIGNhbGxpbmcgYHN0YWNrLmFkZEZpbGVBc3NldCgpYCBkaXJlY3RseS5cbiAgICAvL1xuICAgIC8vIFNvbHV0aW9uOiBkZWxlZ2F0ZSBjYWxsIHRvIHRoZSBzdGFjaywgYnV0IGlmIHRoZSBzdGFjayBkZWxlZ2F0ZXMgYmFjayB0byB1cyBhZ2FpblxuICAgIC8vIHRoZW4gZG8gdGhlIGFjdHVhbCBsb2dpYy5cbiAgICAvL1xuICAgIC8vIEBkZXByZWNhdGVkOiB0aGlzIGNhbiBiZSByZW1vdmVkIGZvciB2MlxuICAgIGlmICh0aGlzLmN5Y2xlKSB7XG4gICAgICByZXR1cm4gdGhpcy5kb0FkZEZpbGVBc3NldChhc3NldCk7XG4gICAgfVxuICAgIHRoaXMuY3ljbGUgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGFjayA9IHRoaXMuYm91bmRTdGFjaztcbiAgICAgIHJldHVybiB3aXRob3V0RGVwcmVjYXRpb25XYXJuaW5ncygoKSA9PiBzdGFjay5hZGRGaWxlQXNzZXQoYXNzZXQpKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5jeWNsZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZGREb2NrZXJJbWFnZUFzc2V0KGFzc2V0OiBEb2NrZXJJbWFnZUFzc2V0U291cmNlKTogRG9ja2VySW1hZ2VBc3NldExvY2F0aW9uIHtcbiAgICAvLyBTZWUgYGFkZEZpbGVBc3NldGAgZm9yIGV4cGxhbmF0aW9uLlxuICAgIC8vIEBkZXByZWNhdGVkOiB0aGlzIGNhbiBiZSByZW1vdmVkIGZvciB2MlxuICAgIGlmICh0aGlzLmN5Y2xlKSB7XG4gICAgICByZXR1cm4gdGhpcy5kb0FkZERvY2tlckltYWdlQXNzZXQoYXNzZXQpO1xuICAgIH1cbiAgICB0aGlzLmN5Y2xlID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RhY2sgPSB0aGlzLmJvdW5kU3RhY2s7XG4gICAgICByZXR1cm4gd2l0aG91dERlcHJlY2F0aW9uV2FybmluZ3MoKCkgPT4gc3RhY2suYWRkRG9ja2VySW1hZ2VBc3NldChhc3NldCkpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmN5Y2xlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN5bnRoZXNpemUgdGhlIGFzc29jaWF0ZWQgc3RhY2sgdG8gdGhlIHNlc3Npb25cbiAgICovXG4gIHB1YmxpYyBzeW50aGVzaXplKHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uKTogdm9pZCB7XG4gICAgdGhpcy5zeW50aGVzaXplVGVtcGxhdGUoc2Vzc2lvbik7XG5cbiAgICAvLyBKdXN0IGRvIHRoZSBkZWZhdWx0IHN0dWZmLCBub3RoaW5nIHNwZWNpYWxcbiAgICB0aGlzLmVtaXRBcnRpZmFjdChzZXNzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9kdWNlIGEgYm91bmQgU3RhY2sgU3ludGhlc2l6ZXIgZm9yIHRoZSBnaXZlbiBzdGFjay5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgbWF5IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSBvbiB0aGUgc2FtZSBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgcmV1c2FibGVCaW5kKHN0YWNrOiBTdGFjayk6IElCb3VuZFN0YWNrU3ludGhlc2l6ZXIge1xuICAgIC8vIENyZWF0ZSBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgb2JqZWN0IGFuZCBiaW5kIHRoYXRcbiAgICBjb25zdCBjb3B5ID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICBjb3B5LmJpbmQoc3RhY2spO1xuICAgIHJldHVybiBjb3B5O1xuICB9XG5cbiAgcHJpdmF0ZSBkb0FkZERvY2tlckltYWdlQXNzZXQoYXNzZXQ6IERvY2tlckltYWdlQXNzZXRTb3VyY2UpOiBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb24ge1xuICAgIC8vIGNoZWNrIGlmIHdlIGhhdmUgYW4gb3ZlcnJpZGUgZnJvbSBjb250ZXh0XG4gICAgY29uc3QgcmVwb3NpdG9yeU5hbWVPdmVycmlkZSA9IHRoaXMuYm91bmRTdGFjay5ub2RlLnRyeUdldENvbnRleHQoQVNTRVRTX0VDUl9SRVBPU0lUT1JZX05BTUVfT1ZFUlJJREVfQ09OVEVYVF9LRVkpO1xuICAgIGNvbnN0IHJlcG9zaXRvcnlOYW1lID0gYXNzZXQucmVwb3NpdG9yeU5hbWUgPz8gcmVwb3NpdG9yeU5hbWVPdmVycmlkZSA/PyBBU1NFVFNfRUNSX1JFUE9TSVRPUllfTkFNRTtcbiAgICBjb25zdCBpbWFnZVRhZyA9IGFzc2V0LnNvdXJjZUhhc2g7XG4gICAgY29uc3QgYXNzZXRJZCA9IGFzc2V0LnNvdXJjZUhhc2g7XG5cbiAgICAvLyBvbmx5IGFkZCBldmVyeSBpbWFnZSAoaWRlbnRpZmllZCBieSBzb3VyY2UgaGFzaCkgb25jZSBmb3IgZWFjaCBzdGFjayB0aGF0IHVzZXMgaXQuXG4gICAgaWYgKCF0aGlzLmFkZGVkSW1hZ2VBc3NldHMuaGFzKGFzc2V0SWQpKSB7XG4gICAgICBpZiAoIWFzc2V0LmRpcmVjdG9yeU5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMZWdhY3lTdGFja1N5bnRoZXNpemVyIGRvZXMgbm90IHN1cHBvcnQgdGhpcyB0eXBlIG9mIGZpbGUgYXNzZXQ6ICR7SlNPTi5zdHJpbmdpZnkoYXNzZXQpfWApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtZXRhZGF0YTogY3hzY2hlbWEuQ29udGFpbmVySW1hZ2VBc3NldE1ldGFkYXRhRW50cnkgPSB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lLFxuICAgICAgICBpbWFnZVRhZyxcbiAgICAgICAgaWQ6IGFzc2V0SWQsXG4gICAgICAgIHBhY2thZ2luZzogJ2NvbnRhaW5lci1pbWFnZScsXG4gICAgICAgIHBhdGg6IGFzc2V0LmRpcmVjdG9yeU5hbWUsXG4gICAgICAgIHNvdXJjZUhhc2g6IGFzc2V0LnNvdXJjZUhhc2gsXG4gICAgICAgIGJ1aWxkQXJnczogYXNzZXQuZG9ja2VyQnVpbGRBcmdzLFxuICAgICAgICB0YXJnZXQ6IGFzc2V0LmRvY2tlckJ1aWxkVGFyZ2V0LFxuICAgICAgICBmaWxlOiBhc3NldC5kb2NrZXJGaWxlLFxuICAgICAgICBuZXR3b3JrTW9kZTogYXNzZXQubmV0d29ya01vZGUsXG4gICAgICAgIHBsYXRmb3JtOiBhc3NldC5wbGF0Zm9ybSxcbiAgICAgICAgb3V0cHV0czogYXNzZXQuZG9ja2VyT3V0cHV0cyxcbiAgICAgICAgY2FjaGVGcm9tOiBhc3NldC5kb2NrZXJDYWNoZUZyb20sXG4gICAgICAgIGNhY2hlVG86IGFzc2V0LmRvY2tlckNhY2hlVG8sXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmJvdW5kU3RhY2subm9kZS5hZGRNZXRhZGF0YShjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLkFTU0VULCBtZXRhZGF0YSk7XG4gICAgICB0aGlzLmFkZGVkSW1hZ2VBc3NldHMuYWRkKGFzc2V0SWQpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpbWFnZVVyaTogYCR7dGhpcy5ib3VuZFN0YWNrLmFjY291bnR9LmRrci5lY3IuJHt0aGlzLmJvdW5kU3RhY2sucmVnaW9ufS4ke3RoaXMuYm91bmRTdGFjay51cmxTdWZmaXh9LyR7cmVwb3NpdG9yeU5hbWV9OiR7aW1hZ2VUYWd9YCxcbiAgICAgIHJlcG9zaXRvcnlOYW1lLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGRvQWRkRmlsZUFzc2V0KGFzc2V0OiBGaWxlQXNzZXRTb3VyY2UpOiBGaWxlQXNzZXRMb2NhdGlvbiB7XG4gICAgbGV0IHBhcmFtcyA9IHRoaXMuYXNzZXRQYXJhbWV0ZXJzLm5vZGUudHJ5RmluZENoaWxkKGFzc2V0LnNvdXJjZUhhc2gpIGFzIEZpbGVBc3NldFBhcmFtZXRlcnM7XG4gICAgaWYgKCFwYXJhbXMpIHtcbiAgICAgIHBhcmFtcyA9IG5ldyBGaWxlQXNzZXRQYXJhbWV0ZXJzKHRoaXMuYXNzZXRQYXJhbWV0ZXJzLCBhc3NldC5zb3VyY2VIYXNoKTtcblxuICAgICAgaWYgKCFhc3NldC5maWxlTmFtZSB8fCAhYXNzZXQucGFja2FnaW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTGVnYWN5U3RhY2tTeW50aGVzaXplciBkb2VzIG5vdCBzdXBwb3J0IHRoaXMgdHlwZSBvZiBmaWxlIGFzc2V0OiAke0pTT04uc3RyaW5naWZ5KGFzc2V0KX1gKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWV0YWRhdGE6IGN4c2NoZW1hLkZpbGVBc3NldE1ldGFkYXRhRW50cnkgPSB7XG4gICAgICAgIHBhdGg6IGFzc2V0LmZpbGVOYW1lLFxuICAgICAgICBpZDogYXNzZXQuc291cmNlSGFzaCxcbiAgICAgICAgcGFja2FnaW5nOiBhc3NldC5wYWNrYWdpbmcsXG4gICAgICAgIHNvdXJjZUhhc2g6IGFzc2V0LnNvdXJjZUhhc2gsXG5cbiAgICAgICAgczNCdWNrZXRQYXJhbWV0ZXI6IHBhcmFtcy5idWNrZXROYW1lUGFyYW1ldGVyLmxvZ2ljYWxJZCxcbiAgICAgICAgczNLZXlQYXJhbWV0ZXI6IHBhcmFtcy5vYmplY3RLZXlQYXJhbWV0ZXIubG9naWNhbElkLFxuICAgICAgICBhcnRpZmFjdEhhc2hQYXJhbWV0ZXI6IHBhcmFtcy5hcnRpZmFjdEhhc2hQYXJhbWV0ZXIubG9naWNhbElkLFxuICAgICAgfTtcblxuICAgICAgdGhpcy5ib3VuZFN0YWNrLm5vZGUuYWRkTWV0YWRhdGEoY3hzY2hlbWEuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5BU1NFVCwgbWV0YWRhdGEpO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1Y2tldE5hbWUgPSBwYXJhbXMuYnVja2V0TmFtZVBhcmFtZXRlci52YWx1ZUFzU3RyaW5nO1xuXG4gICAgLy8ga2V5IGlzIHByZWZpeHxwb3N0Zml4XG4gICAgY29uc3QgZW5jb2RlZEtleSA9IHBhcmFtcy5vYmplY3RLZXlQYXJhbWV0ZXIudmFsdWVBc1N0cmluZztcblxuICAgIGNvbnN0IHMzUHJlZml4ID0gRm4uc2VsZWN0KDAsIEZuLnNwbGl0KGN4YXBpLkFTU0VUX1BSRUZJWF9TRVBBUkFUT1IsIGVuY29kZWRLZXkpKTtcbiAgICBjb25zdCBzM0ZpbGVuYW1lID0gRm4uc2VsZWN0KDEsIEZuLnNwbGl0KGN4YXBpLkFTU0VUX1BSRUZJWF9TRVBBUkFUT1IsIGVuY29kZWRLZXkpKTtcbiAgICBjb25zdCBvYmplY3RLZXkgPSBgJHtzM1ByZWZpeH0ke3MzRmlsZW5hbWV9YDtcblxuICAgIGNvbnN0IGh0dHBVcmwgPSBgaHR0cHM6Ly9zMy4ke3RoaXMuYm91bmRTdGFjay5yZWdpb259LiR7dGhpcy5ib3VuZFN0YWNrLnVybFN1ZmZpeH0vJHtidWNrZXROYW1lfS8ke29iamVjdEtleX1gO1xuICAgIGNvbnN0IHMzT2JqZWN0VXJsID0gYHMzOi8vJHtidWNrZXROYW1lfS8ke29iamVjdEtleX1gO1xuXG4gICAgcmV0dXJuIHsgYnVja2V0TmFtZSwgb2JqZWN0S2V5LCBodHRwVXJsLCBzM09iamVjdFVybCwgczNVcmw6IGh0dHBVcmwgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGFzc2V0UGFyYW1ldGVycygpIHtcbiAgICBhc3NlcnRCb3VuZCh0aGlzLmJvdW5kU3RhY2spO1xuXG4gICAgaWYgKCF0aGlzLl9hc3NldFBhcmFtZXRlcnMpIHtcbiAgICAgIHRoaXMuX2Fzc2V0UGFyYW1ldGVycyA9IG5ldyBDb25zdHJ1Y3QodGhpcy5ib3VuZFN0YWNrLCAnQXNzZXRQYXJhbWV0ZXJzJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hc3NldFBhcmFtZXRlcnM7XG4gIH1cbn1cblxuZnVuY3Rpb24gd2l0aG91dERlcHJlY2F0aW9uV2FybmluZ3M8QT4oYmxvY2s6ICgpID0+IEEpOiBBIHtcbiAgY29uc3Qgb3JpZyA9IHByb2Nlc3MuZW52LkpTSUlfREVQUkVDQVRFRDtcbiAgcHJvY2Vzcy5lbnYuSlNJSV9ERVBSRUNBVEVEID0gJ3F1aWV0JztcbiAgdHJ5IHtcbiAgICByZXR1cm4gYmxvY2soKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBwcm9jZXNzLmVudi5KU0lJX0RFUFJFQ0FURUQgPSBvcmlnO1xuICB9XG59XG4iXX0=