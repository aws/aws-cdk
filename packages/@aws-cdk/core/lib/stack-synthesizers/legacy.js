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
        _shared_1.assertBound(this.boundStack);
        if (!this._assetParameters) {
            this._assetParameters = new constructs_1.Construct(this.boundStack, 'AssetParameters');
        }
        return this._assetParameters;
    }
}
exports.LegacyStackSynthesizer = LegacyStackSynthesizer;
_a = JSII_RTTI_SYMBOL_1;
LegacyStackSynthesizer[_a] = { fqn: "@aws-cdk/core.LegacyStackSynthesizer", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGVnYWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJEQUEyRDtBQUMzRCx5Q0FBeUM7QUFDekMsMkNBQXVDO0FBQ3ZDLHVDQUF3QztBQUN4QywyREFBdUQ7QUFHdkQsc0NBQStCO0FBQy9CLGtFQUFrRTtBQUdsRTs7OztHQUlHO0FBQ0gsTUFBTSwwQkFBMEIsR0FBRyxnQkFBZ0IsQ0FBQztBQUVwRDs7Ozs7R0FLRztBQUNILE1BQU0sK0NBQStDLEdBQUcsNEJBQTRCLENBQUM7QUFFckY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JHO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxvQ0FBZ0I7SUFBNUQ7O1FBQ1UsVUFBSyxHQUFHLEtBQUssQ0FBQztRQU90Qjs7O1dBR0c7UUFDYyxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0tBdUp2RDtJQXJKUSxZQUFZLENBQUMsS0FBc0I7Ozs7Ozs7Ozs7UUFDeEMsNEVBQTRFO1FBQzVFLEVBQUU7UUFDRiwrQ0FBK0M7UUFDL0MsdUdBQXVHO1FBQ3ZHLHlFQUF5RTtRQUN6RSw4RUFBOEU7UUFDOUUsb0ZBQW9GO1FBQ3BGLHdEQUF3RDtRQUN4RCxFQUFFO1FBQ0Ysb0ZBQW9GO1FBQ3BGLDRCQUE0QjtRQUM1QixFQUFFO1FBQ0YsMENBQTBDO1FBQzFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQztRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUk7WUFDRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzlCLE9BQU8sMEJBQTBCLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3BFO2dCQUFTO1lBQ1IsSUFBSSxDQUFD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TyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7SUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDO0lBQ3RDLElBQUk7UUFDRixPQUFPLEtBQUssRUFBRSxDQUFDO0tBQ2hCO1lBQVM7UUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7S0FDcEM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IGFzc2VydEJvdW5kIH0gZnJvbSAnLi9fc2hhcmVkJztcbmltcG9ydCB7IFN0YWNrU3ludGhlc2l6ZXIgfSBmcm9tICcuL3N0YWNrLXN5bnRoZXNpemVyJztcbmltcG9ydCB7IElTeW50aGVzaXNTZXNzaW9uLCBJUmV1c2FibGVTdGFja1N5bnRoZXNpemVyLCBJQm91bmRTdGFja1N5bnRoZXNpemVyIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb24sIERvY2tlckltYWdlQXNzZXRTb3VyY2UsIEZpbGVBc3NldExvY2F0aW9uLCBGaWxlQXNzZXRTb3VyY2UgfSBmcm9tICcuLi9hc3NldHMnO1xuaW1wb3J0IHsgRm4gfSBmcm9tICcuLi9jZm4tZm4nO1xuaW1wb3J0IHsgRmlsZUFzc2V0UGFyYW1ldGVycyB9IGZyb20gJy4uL3ByaXZhdGUvYXNzZXQtcGFyYW1ldGVycyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcblxuLyoqXG4gKiBUaGUgd2VsbC1rbm93biBuYW1lIGZvciB0aGUgZG9ja2VyIGltYWdlIGFzc2V0IEVDUiByZXBvc2l0b3J5LiBBbGwgZG9ja2VyXG4gKiBpbWFnZSBhc3NldHMgd2lsbCBiZSBwdXNoZWQgaW50byB0aGlzIHJlcG9zaXRvcnkgd2l0aCBhbiBpbWFnZSB0YWcgYmFzZWQgb25cbiAqIHRoZSBzb3VyY2UgaGFzaC5cbiAqL1xuY29uc3QgQVNTRVRTX0VDUl9SRVBPU0lUT1JZX05BTUUgPSAnYXdzLWNkay9hc3NldHMnO1xuXG4vKipcbiAqIFRoaXMgYWxsb3dzIHVzZXJzIHRvIHdvcmsgYXJvdW5kIHRoZSBmYWN0IHRoYXQgdGhlIEVDUiByZXBvc2l0b3J5IGlzXG4gKiAoY3VycmVudGx5KSBub3QgY29uZmlndXJhYmxlIGJ5IHNldHRpbmcgdGhpcyBjb250ZXh0IGtleSB0byB0aGVpciBkZXNpcmVkXG4gKiByZXBvc2l0b3J5IG5hbWUuIFRoZSBDTEkgd2lsbCBhdXRvLWNyZWF0ZSB0aGlzIEVDUiByZXBvc2l0b3J5IGlmIGl0J3Mgbm90XG4gKiBhbHJlYWR5IGNyZWF0ZWQuXG4gKi9cbmNvbnN0IEFTU0VUU19FQ1JfUkVQT1NJVE9SWV9OQU1FX09WRVJSSURFX0NPTlRFWFRfS0VZID0gJ2Fzc2V0cy1lY3ItcmVwb3NpdG9yeS1uYW1lJztcblxuLyoqXG4gKiBVc2UgdGhlIENESyBjbGFzc2ljIHdheSBvZiByZWZlcmVuY2luZyBhc3NldHNcbiAqXG4gKiBUaGlzIHN5bnRoZXNpemVyIHdpbGwgZ2VuZXJhdGUgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVycyBmb3IgZXZlcnkgcmVmZXJlbmNlZFxuICogYXNzZXQsIGFuZCB1c2UgdGhlIENMSSdzIGN1cnJlbnQgY3JlZGVudGlhbHMgdG8gZGVwbG95IHRoZSBzdGFjay5cbiAqXG4gKiAtIEl0IGRvZXMgbm90IHN1cHBvcnQgY3Jvc3MtYWNjb3VudCBkZXBsb3ltZW50ICh0aGUgQ0xJIG11c3QgaGF2ZSBjcmVkZW50aWFsc1xuICogICB0byB0aGUgYWNjb3VudCB5b3UgYXJlIHRyeWluZyB0byBkZXBsb3kgdG8pLlxuICogLSBJdCBjYW5ub3QgYmUgdXNlZCB3aXRoICoqQ0RLIFBpcGVsaW5lcyoqLiBUbyBkZXBsb3kgdXNpbmcgQ0RLIFBpcGVsaW5lcyxcbiAqICAgeW91IG11c3QgdXNlIHRoZSBgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXJgLlxuICogLSBFYWNoIGFzc2V0IHdpbGwgdGFrZSB1cCBhIENsb3VkRm9ybWF0aW9uIFBhcmFtZXRlciBpbiB5b3VyIHRlbXBsYXRlLiBLZWVwIGluXG4gKiAgIG1pbmQgdGhhdCB0aGVyZSBpcyBhIG1heGltdW0gb2YgMjAwIHBhcmFtZXRlcnMgaW4gYSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS5cbiAqICAgVG8gdXNlIGRldGVybWluc3RpYyBhc3NldCBsb2NhdGlvbnMgaW5zdGVhZCwgdXNlIGBDbGlDcmVkZW50aWFsc1N0YWNrU3ludGhlc2l6ZXJgLlxuICpcbiAqIEJlIGF3YXJlIHRoYXQgeW91ciBDTEkgY3JlZGVudGlhbHMgbXVzdCBiZSB2YWxpZCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZVxuICogZW50aXJlIGRlcGxveW1lbnQuIElmIHlvdSBhcmUgdXNpbmcgc2Vzc2lvbiBjcmVkZW50aWFscywgbWFrZSBzdXJlIHRoZVxuICogc2Vzc2lvbiBsaWZldGltZSBpcyBsb25nIGVub3VnaC5cbiAqXG4gKiBUaGlzIGlzIHRoZSBvbmx5IFN0YWNrU3ludGhlc2l6ZXIgdGhhdCBzdXBwb3J0cyBjdXN0b21pemluZyBhc3NldCBiZWhhdmlvclxuICogYnkgb3ZlcnJpZGluZyBgU3RhY2suYWRkRmlsZUFzc2V0KClgIGFuZCBgU3RhY2suYWRkRG9ja2VySW1hZ2VBc3NldCgpYC5cbiAqL1xuZXhwb3J0IGNsYXNzIExlZ2FjeVN0YWNrU3ludGhlc2l6ZXIgZXh0ZW5kcyBTdGFja1N5bnRoZXNpemVyIGltcGxlbWVudHMgSVJldXNhYmxlU3RhY2tTeW50aGVzaXplciwgSUJvdW5kU3RhY2tTeW50aGVzaXplciB7XG4gIHByaXZhdGUgY3ljbGUgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW5jbHVkZXMgYWxsIHBhcmFtZXRlcnMgc3ludGhlc2l6ZWQgZm9yIGFzc2V0cyAobGF6eSkuXG4gICAqL1xuICBwcml2YXRlIF9hc3NldFBhcmFtZXRlcnM/OiBDb25zdHJ1Y3Q7XG5cbiAgLyoqXG4gICAqIFRoZSBpbWFnZSBJRCBvZiBhbGwgdGhlIGRvY2tlciBpbWFnZSBhc3NldHMgdGhhdCB3ZXJlIGFscmVhZHkgYWRkZWQgdG8gdGhpc1xuICAgKiBzdGFjayAodG8gYXZvaWQgZHVwbGljYXRpb24pLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBhZGRlZEltYWdlQXNzZXRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgcHVibGljIGFkZEZpbGVBc3NldChhc3NldDogRmlsZUFzc2V0U291cmNlKTogRmlsZUFzc2V0TG9jYXRpb24ge1xuICAgIC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGhhY2suIFdlIGhhdmUgYSBudW1iZXIgb2YgY29uZmxpY3RpbmcgZ29hbHMgaGVyZTpcbiAgICAvL1xuICAgIC8vIC0gV2Ugd2FudCBwdXQgdGhlIGFjdHVhbCBsb2dpYyBpbiB0aGlzIGNsYXNzXG4gICAgLy8gLSBXZSBBTFNPIHdhbnQgdG8ga2VlcCBzdXBwb3J0aW5nIHBlb3BsZSBvdmVycmlkaW5nIFN0YWNrLmFkZEZpbGVBc3NldCAoZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LFxuICAgIC8vIGJlY2F1c2UgdGhhdCBtZWNoYW5pc20gaXMgY3VycmVudGx5IHVzZWQgdG8gbWFrZSBDSS9DRCBzY2VuYXJpb3Mgd29yaylcbiAgICAvLyAtIFdlIEFMU08gd2FudCB0byBhbGxvdyBib3RoIGVudHJ5IHBvaW50cyBmcm9tIHVzZXIgY29kZSAob3VyIG93biBmcmFtZXdvcmtcbiAgICAvLyBjb2RlIHdpbGwgYWx3YXlzIGNhbGwgc3RhY2suZGVwbG95bWVudE1lY2hhbmlzbS5hZGRGaWxlQXNzZXQoKSBidXQgZXhpc3RpbmcgdXNlcnNcbiAgICAvLyBtYXkgc3RpbGwgYmUgY2FsbGluZyBgc3RhY2suYWRkRmlsZUFzc2V0KClgIGRpcmVjdGx5LlxuICAgIC8vXG4gICAgLy8gU29sdXRpb246IGRlbGVnYXRlIGNhbGwgdG8gdGhlIHN0YWNrLCBidXQgaWYgdGhlIHN0YWNrIGRlbGVnYXRlcyBiYWNrIHRvIHVzIGFnYWluXG4gICAgLy8gdGhlbiBkbyB0aGUgYWN0dWFsIGxvZ2ljLlxuICAgIC8vXG4gICAgLy8gQGRlcHJlY2F0ZWQ6IHRoaXMgY2FuIGJlIHJlbW92ZWQgZm9yIHYyXG4gICAgaWYgKHRoaXMuY3ljbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvQWRkRmlsZUFzc2V0KGFzc2V0KTtcbiAgICB9XG4gICAgdGhpcy5jeWNsZSA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gdGhpcy5ib3VuZFN0YWNrO1xuICAgICAgcmV0dXJuIHdpdGhvdXREZXByZWNhdGlvbldhcm5pbmdzKCgpID0+IHN0YWNrLmFkZEZpbGVBc3NldChhc3NldCkpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmN5Y2xlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZERvY2tlckltYWdlQXNzZXQoYXNzZXQ6IERvY2tlckltYWdlQXNzZXRTb3VyY2UpOiBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb24ge1xuICAgIC8vIFNlZSBgYWRkRmlsZUFzc2V0YCBmb3IgZXhwbGFuYXRpb24uXG4gICAgLy8gQGRlcHJlY2F0ZWQ6IHRoaXMgY2FuIGJlIHJlbW92ZWQgZm9yIHYyXG4gICAgaWYgKHRoaXMuY3ljbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvQWRkRG9ja2VySW1hZ2VBc3NldChhc3NldCk7XG4gICAgfVxuICAgIHRoaXMuY3ljbGUgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGFjayA9IHRoaXMuYm91bmRTdGFjaztcbiAgICAgIHJldHVybiB3aXRob3V0RGVwcmVjYXRpb25XYXJuaW5ncygoKSA9PiBzdGFjay5hZGREb2NrZXJJbWFnZUFzc2V0KGFzc2V0KSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuY3ljbGUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3ludGhlc2l6ZSB0aGUgYXNzb2NpYXRlZCBzdGFjayB0byB0aGUgc2Vzc2lvblxuICAgKi9cbiAgcHVibGljIHN5bnRoZXNpemUoc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24pOiB2b2lkIHtcbiAgICB0aGlzLnN5bnRoZXNpemVUZW1wbGF0ZShzZXNzaW9uKTtcblxuICAgIC8vIEp1c3QgZG8gdGhlIGRlZmF1bHQgc3R1ZmYsIG5vdGhpbmcgc3BlY2lhbFxuICAgIHRoaXMuZW1pdEFydGlmYWN0KHNlc3Npb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2R1Y2UgYSBib3VuZCBTdGFjayBTeW50aGVzaXplciBmb3IgdGhlIGdpdmVuIHN0YWNrLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBtYXkgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIG9uIHRoZSBzYW1lIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyByZXVzYWJsZUJpbmQoc3RhY2s6IFN0YWNrKTogSUJvdW5kU3RhY2tTeW50aGVzaXplciB7XG4gICAgLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgY3VycmVudCBvYmplY3QgYW5kIGJpbmQgdGhhdFxuICAgIGNvbnN0IGNvcHkgPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xuICAgIGNvcHkuYmluZChzdGFjayk7XG4gICAgcmV0dXJuIGNvcHk7XG4gIH1cblxuICBwcml2YXRlIGRvQWRkRG9ja2VySW1hZ2VBc3NldChhc3NldDogRG9ja2VySW1hZ2VBc3NldFNvdXJjZSk6IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiB7XG4gICAgLy8gY2hlY2sgaWYgd2UgaGF2ZSBhbiBvdmVycmlkZSBmcm9tIGNvbnRleHRcbiAgICBjb25zdCByZXBvc2l0b3J5TmFtZU92ZXJyaWRlID0gdGhpcy5ib3VuZFN0YWNrLm5vZGUudHJ5R2V0Q29udGV4dChBU1NFVFNfRUNSX1JFUE9TSVRPUllfTkFNRV9PVkVSUklERV9DT05URVhUX0tFWSk7XG4gICAgY29uc3QgcmVwb3NpdG9yeU5hbWUgPSBhc3NldC5yZXBvc2l0b3J5TmFtZSA/PyByZXBvc2l0b3J5TmFtZU92ZXJyaWRlID8/IEFTU0VUU19FQ1JfUkVQT1NJVE9SWV9OQU1FO1xuICAgIGNvbnN0IGltYWdlVGFnID0gYXNzZXQuc291cmNlSGFzaDtcbiAgICBjb25zdCBhc3NldElkID0gYXNzZXQuc291cmNlSGFzaDtcblxuICAgIC8vIG9ubHkgYWRkIGV2ZXJ5IGltYWdlIChpZGVudGlmaWVkIGJ5IHNvdXJjZSBoYXNoKSBvbmNlIGZvciBlYWNoIHN0YWNrIHRoYXQgdXNlcyBpdC5cbiAgICBpZiAoIXRoaXMuYWRkZWRJbWFnZUFzc2V0cy5oYXMoYXNzZXRJZCkpIHtcbiAgICAgIGlmICghYXNzZXQuZGlyZWN0b3J5TmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYExlZ2FjeVN0YWNrU3ludGhlc2l6ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGlzIHR5cGUgb2YgZmlsZSBhc3NldDogJHtKU09OLnN0cmluZ2lmeShhc3NldCl9YCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1ldGFkYXRhOiBjeHNjaGVtYS5Db250YWluZXJJbWFnZUFzc2V0TWV0YWRhdGFFbnRyeSA9IHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWUsXG4gICAgICAgIGltYWdlVGFnLFxuICAgICAgICBpZDogYXNzZXRJZCxcbiAgICAgICAgcGFja2FnaW5nOiAnY29udGFpbmVyLWltYWdlJyxcbiAgICAgICAgcGF0aDogYXNzZXQuZGlyZWN0b3J5TmFtZSxcbiAgICAgICAgc291cmNlSGFzaDogYXNzZXQuc291cmNlSGFzaCxcbiAgICAgICAgYnVpbGRBcmdzOiBhc3NldC5kb2NrZXJCdWlsZEFyZ3MsXG4gICAgICAgIHRhcmdldDogYXNzZXQuZG9ja2VyQnVpbGRUYXJnZXQsXG4gICAgICAgIGZpbGU6IGFzc2V0LmRvY2tlckZpbGUsXG4gICAgICAgIG5ldHdvcmtNb2RlOiBhc3NldC5uZXR3b3JrTW9kZSxcbiAgICAgICAgcGxhdGZvcm06IGFzc2V0LnBsYXRmb3JtLFxuICAgICAgICBvdXRwdXRzOiBhc3NldC5kb2NrZXJPdXRwdXRzLFxuICAgICAgICBjYWNoZUZyb206IGFzc2V0LmRvY2tlckNhY2hlRnJvbSxcbiAgICAgICAgY2FjaGVUbzogYXNzZXQuZG9ja2VyQ2FjaGVUbyxcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuYm91bmRTdGFjay5ub2RlLmFkZE1ldGFkYXRhKGN4c2NoZW1hLkFydGlmYWN0TWV0YWRhdGFFbnRyeVR5cGUuQVNTRVQsIG1ldGFkYXRhKTtcbiAgICAgIHRoaXMuYWRkZWRJbWFnZUFzc2V0cy5hZGQoYXNzZXRJZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlVXJpOiBgJHt0aGlzLmJvdW5kU3RhY2suYWNjb3VudH0uZGtyLmVjci4ke3RoaXMuYm91bmRTdGFjay5yZWdpb259LiR7dGhpcy5ib3VuZFN0YWNrLnVybFN1ZmZpeH0vJHtyZXBvc2l0b3J5TmFtZX06JHtpbWFnZVRhZ31gLFxuICAgICAgcmVwb3NpdG9yeU5hbWUsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZG9BZGRGaWxlQXNzZXQoYXNzZXQ6IEZpbGVBc3NldFNvdXJjZSk6IEZpbGVBc3NldExvY2F0aW9uIHtcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5hc3NldFBhcmFtZXRlcnMubm9kZS50cnlGaW5kQ2hpbGQoYXNzZXQuc291cmNlSGFzaCkgYXMgRmlsZUFzc2V0UGFyYW1ldGVycztcbiAgICBpZiAoIXBhcmFtcykge1xuICAgICAgcGFyYW1zID0gbmV3IEZpbGVBc3NldFBhcmFtZXRlcnModGhpcy5hc3NldFBhcmFtZXRlcnMsIGFzc2V0LnNvdXJjZUhhc2gpO1xuXG4gICAgICBpZiAoIWFzc2V0LmZpbGVOYW1lIHx8ICFhc3NldC5wYWNrYWdpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMZWdhY3lTdGFja1N5bnRoZXNpemVyIGRvZXMgbm90IHN1cHBvcnQgdGhpcyB0eXBlIG9mIGZpbGUgYXNzZXQ6ICR7SlNPTi5zdHJpbmdpZnkoYXNzZXQpfWApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtZXRhZGF0YTogY3hzY2hlbWEuRmlsZUFzc2V0TWV0YWRhdGFFbnRyeSA9IHtcbiAgICAgICAgcGF0aDogYXNzZXQuZmlsZU5hbWUsXG4gICAgICAgIGlkOiBhc3NldC5zb3VyY2VIYXNoLFxuICAgICAgICBwYWNrYWdpbmc6IGFzc2V0LnBhY2thZ2luZyxcbiAgICAgICAgc291cmNlSGFzaDogYXNzZXQuc291cmNlSGFzaCxcblxuICAgICAgICBzM0J1Y2tldFBhcmFtZXRlcjogcGFyYW1zLmJ1Y2tldE5hbWVQYXJhbWV0ZXIubG9naWNhbElkLFxuICAgICAgICBzM0tleVBhcmFtZXRlcjogcGFyYW1zLm9iamVjdEtleVBhcmFtZXRlci5sb2dpY2FsSWQsXG4gICAgICAgIGFydGlmYWN0SGFzaFBhcmFtZXRlcjogcGFyYW1zLmFydGlmYWN0SGFzaFBhcmFtZXRlci5sb2dpY2FsSWQsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmJvdW5kU3RhY2subm9kZS5hZGRNZXRhZGF0YShjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLkFTU0VULCBtZXRhZGF0YSk7XG4gICAgfVxuXG4gICAgY29uc3QgYnVja2V0TmFtZSA9IHBhcmFtcy5idWNrZXROYW1lUGFyYW1ldGVyLnZhbHVlQXNTdHJpbmc7XG5cbiAgICAvLyBrZXkgaXMgcHJlZml4fHBvc3RmaXhcbiAgICBjb25zdCBlbmNvZGVkS2V5ID0gcGFyYW1zLm9iamVjdEtleVBhcmFtZXRlci52YWx1ZUFzU3RyaW5nO1xuXG4gICAgY29uc3QgczNQcmVmaXggPSBGbi5zZWxlY3QoMCwgRm4uc3BsaXQoY3hhcGkuQVNTRVRfUFJFRklYX1NFUEFSQVRPUiwgZW5jb2RlZEtleSkpO1xuICAgIGNvbnN0IHMzRmlsZW5hbWUgPSBGbi5zZWxlY3QoMSwgRm4uc3BsaXQoY3hhcGkuQVNTRVRfUFJFRklYX1NFUEFSQVRPUiwgZW5jb2RlZEtleSkpO1xuICAgIGNvbnN0IG9iamVjdEtleSA9IGAke3MzUHJlZml4fSR7czNGaWxlbmFtZX1gO1xuXG4gICAgY29uc3QgaHR0cFVybCA9IGBodHRwczovL3MzLiR7dGhpcy5ib3VuZFN0YWNrLnJlZ2lvbn0uJHt0aGlzLmJvdW5kU3RhY2sudXJsU3VmZml4fS8ke2J1Y2tldE5hbWV9LyR7b2JqZWN0S2V5fWA7XG4gICAgY29uc3QgczNPYmplY3RVcmwgPSBgczM6Ly8ke2J1Y2tldE5hbWV9LyR7b2JqZWN0S2V5fWA7XG5cbiAgICByZXR1cm4geyBidWNrZXROYW1lLCBvYmplY3RLZXksIGh0dHBVcmwsIHMzT2JqZWN0VXJsLCBzM1VybDogaHR0cFVybCB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgYXNzZXRQYXJhbWV0ZXJzKCkge1xuICAgIGFzc2VydEJvdW5kKHRoaXMuYm91bmRTdGFjayk7XG5cbiAgICBpZiAoIXRoaXMuX2Fzc2V0UGFyYW1ldGVycykge1xuICAgICAgdGhpcy5fYXNzZXRQYXJhbWV0ZXJzID0gbmV3IENvbnN0cnVjdCh0aGlzLmJvdW5kU3RhY2ssICdBc3NldFBhcmFtZXRlcnMnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Fzc2V0UGFyYW1ldGVycztcbiAgfVxufVxuXG5mdW5jdGlvbiB3aXRob3V0RGVwcmVjYXRpb25XYXJuaW5nczxBPihibG9jazogKCkgPT4gQSk6IEEge1xuICBjb25zdCBvcmlnID0gcHJvY2Vzcy5lbnYuSlNJSV9ERVBSRUNBVEVEO1xuICBwcm9jZXNzLmVudi5KU0lJX0RFUFJFQ0FURUQgPSAncXVpZXQnO1xuICB0cnkge1xuICAgIHJldHVybiBibG9jaygpO1xuICB9IGZpbmFsbHkge1xuICAgIHByb2Nlc3MuZW52LkpTSUlfREVQUkVDQVRFRCA9IG9yaWc7XG4gIH1cbn1cbiJdfQ==