"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyStackSynthesizer = void 0;
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
 *   To use deterministic asset locations instead, use `CliCredentialsStackSynthesizer`.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGVnYWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJEQUEyRDtBQUMzRCx5Q0FBeUM7QUFDekMsMkNBQXVDO0FBQ3ZDLHVDQUF3QztBQUN4QywyREFBdUQ7QUFHdkQsc0NBQStCO0FBQy9CLGtFQUFrRTtBQUdsRTs7OztHQUlHO0FBQ0gsTUFBTSwwQkFBMEIsR0FBRyxnQkFBZ0IsQ0FBQztBQUVwRDs7Ozs7R0FLRztBQUNILE1BQU0sK0NBQStDLEdBQUcsNEJBQTRCLENBQUM7QUFFckY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JHO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxvQ0FBZ0I7SUFBNUQ7O1FBQ1UsVUFBSyxHQUFHLEtBQUssQ0FBQztRQU90Qjs7O1dBR0c7UUFDYyxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0lBdUp4RCxDQUFDO0lBckpRLFlBQVksQ0FBQyxLQUFzQjtRQUN4Qyw0RUFBNEU7UUFDNUUsRUFBRTtRQUNGLCtDQUErQztRQUMvQyx1R0FBdUc7UUFDdkcseUVBQXlFO1FBQ3pFLDhFQUE4RTtRQUM5RSxvRkFBb0Y7UUFDcEYsd0RBQXdEO1FBQ3hELEVBQUU7UUFDRixvRkFBb0Y7UUFDcEYsNEJBQTRCO1FBQzVCLEVBQUU7UUFDRiwwQ0FBMEM7UUFDMUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDOUIsT0FBTywwQkFBMEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDcEU7Z0JBQVM7WUFDUixJQUFJLENBQUMsS0FBSyxH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R0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztJQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7SUFDdEMsSUFBSTtRQUNGLE9BQU8sS0FBSyxFQUFFLENBQUM7S0FDaEI7WUFBUztRQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztLQUNwQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgYXNzZXJ0Qm91bmQgfSBmcm9tICcuL19zaGFyZWQnO1xuaW1wb3J0IHsgU3RhY2tTeW50aGVzaXplciB9IGZyb20gJy4vc3RhY2stc3ludGhlc2l6ZXInO1xuaW1wb3J0IHsgSVN5bnRoZXNpc1Nlc3Npb24sIElSZXVzYWJsZVN0YWNrU3ludGhlc2l6ZXIsIElCb3VuZFN0YWNrU3ludGhlc2l6ZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiwgRG9ja2VySW1hZ2VBc3NldFNvdXJjZSwgRmlsZUFzc2V0TG9jYXRpb24sIEZpbGVBc3NldFNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cyc7XG5pbXBvcnQgeyBGbiB9IGZyb20gJy4uL2Nmbi1mbic7XG5pbXBvcnQgeyBGaWxlQXNzZXRQYXJhbWV0ZXJzIH0gZnJvbSAnLi4vcHJpdmF0ZS9hc3NldC1wYXJhbWV0ZXJzJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vc3RhY2snO1xuXG4vKipcbiAqIFRoZSB3ZWxsLWtub3duIG5hbWUgZm9yIHRoZSBkb2NrZXIgaW1hZ2UgYXNzZXQgRUNSIHJlcG9zaXRvcnkuIEFsbCBkb2NrZXJcbiAqIGltYWdlIGFzc2V0cyB3aWxsIGJlIHB1c2hlZCBpbnRvIHRoaXMgcmVwb3NpdG9yeSB3aXRoIGFuIGltYWdlIHRhZyBiYXNlZCBvblxuICogdGhlIHNvdXJjZSBoYXNoLlxuICovXG5jb25zdCBBU1NFVFNfRUNSX1JFUE9TSVRPUllfTkFNRSA9ICdhd3MtY2RrL2Fzc2V0cyc7XG5cbi8qKlxuICogVGhpcyBhbGxvd3MgdXNlcnMgdG8gd29yayBhcm91bmQgdGhlIGZhY3QgdGhhdCB0aGUgRUNSIHJlcG9zaXRvcnkgaXNcbiAqIChjdXJyZW50bHkpIG5vdCBjb25maWd1cmFibGUgYnkgc2V0dGluZyB0aGlzIGNvbnRleHQga2V5IHRvIHRoZWlyIGRlc2lyZWRcbiAqIHJlcG9zaXRvcnkgbmFtZS4gVGhlIENMSSB3aWxsIGF1dG8tY3JlYXRlIHRoaXMgRUNSIHJlcG9zaXRvcnkgaWYgaXQncyBub3RcbiAqIGFscmVhZHkgY3JlYXRlZC5cbiAqL1xuY29uc3QgQVNTRVRTX0VDUl9SRVBPU0lUT1JZX05BTUVfT1ZFUlJJREVfQ09OVEVYVF9LRVkgPSAnYXNzZXRzLWVjci1yZXBvc2l0b3J5LW5hbWUnO1xuXG4vKipcbiAqIFVzZSB0aGUgQ0RLIGNsYXNzaWMgd2F5IG9mIHJlZmVyZW5jaW5nIGFzc2V0c1xuICpcbiAqIFRoaXMgc3ludGhlc2l6ZXIgd2lsbCBnZW5lcmF0ZSBDbG91ZEZvcm1hdGlvbiBwYXJhbWV0ZXJzIGZvciBldmVyeSByZWZlcmVuY2VkXG4gKiBhc3NldCwgYW5kIHVzZSB0aGUgQ0xJJ3MgY3VycmVudCBjcmVkZW50aWFscyB0byBkZXBsb3kgdGhlIHN0YWNrLlxuICpcbiAqIC0gSXQgZG9lcyBub3Qgc3VwcG9ydCBjcm9zcy1hY2NvdW50IGRlcGxveW1lbnQgKHRoZSBDTEkgbXVzdCBoYXZlIGNyZWRlbnRpYWxzXG4gKiAgIHRvIHRoZSBhY2NvdW50IHlvdSBhcmUgdHJ5aW5nIHRvIGRlcGxveSB0bykuXG4gKiAtIEl0IGNhbm5vdCBiZSB1c2VkIHdpdGggKipDREsgUGlwZWxpbmVzKiouIFRvIGRlcGxveSB1c2luZyBDREsgUGlwZWxpbmVzLFxuICogICB5b3UgbXVzdCB1c2UgdGhlIGBEZWZhdWx0U3RhY2tTeW50aGVzaXplcmAuXG4gKiAtIEVhY2ggYXNzZXQgd2lsbCB0YWtlIHVwIGEgQ2xvdWRGb3JtYXRpb24gUGFyYW1ldGVyIGluIHlvdXIgdGVtcGxhdGUuIEtlZXAgaW5cbiAqICAgbWluZCB0aGF0IHRoZXJlIGlzIGEgbWF4aW11bSBvZiAyMDAgcGFyYW1ldGVycyBpbiBhIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlLlxuICogICBUbyB1c2UgZGV0ZXJtaW5pc3RpYyBhc3NldCBsb2NhdGlvbnMgaW5zdGVhZCwgdXNlIGBDbGlDcmVkZW50aWFsc1N0YWNrU3ludGhlc2l6ZXJgLlxuICpcbiAqIEJlIGF3YXJlIHRoYXQgeW91ciBDTEkgY3JlZGVudGlhbHMgbXVzdCBiZSB2YWxpZCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZVxuICogZW50aXJlIGRlcGxveW1lbnQuIElmIHlvdSBhcmUgdXNpbmcgc2Vzc2lvbiBjcmVkZW50aWFscywgbWFrZSBzdXJlIHRoZVxuICogc2Vzc2lvbiBsaWZldGltZSBpcyBsb25nIGVub3VnaC5cbiAqXG4gKiBUaGlzIGlzIHRoZSBvbmx5IFN0YWNrU3ludGhlc2l6ZXIgdGhhdCBzdXBwb3J0cyBjdXN0b21pemluZyBhc3NldCBiZWhhdmlvclxuICogYnkgb3ZlcnJpZGluZyBgU3RhY2suYWRkRmlsZUFzc2V0KClgIGFuZCBgU3RhY2suYWRkRG9ja2VySW1hZ2VBc3NldCgpYC5cbiAqL1xuZXhwb3J0IGNsYXNzIExlZ2FjeVN0YWNrU3ludGhlc2l6ZXIgZXh0ZW5kcyBTdGFja1N5bnRoZXNpemVyIGltcGxlbWVudHMgSVJldXNhYmxlU3RhY2tTeW50aGVzaXplciwgSUJvdW5kU3RhY2tTeW50aGVzaXplciB7XG4gIHByaXZhdGUgY3ljbGUgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW5jbHVkZXMgYWxsIHBhcmFtZXRlcnMgc3ludGhlc2l6ZWQgZm9yIGFzc2V0cyAobGF6eSkuXG4gICAqL1xuICBwcml2YXRlIF9hc3NldFBhcmFtZXRlcnM/OiBDb25zdHJ1Y3Q7XG5cbiAgLyoqXG4gICAqIFRoZSBpbWFnZSBJRCBvZiBhbGwgdGhlIGRvY2tlciBpbWFnZSBhc3NldHMgdGhhdCB3ZXJlIGFscmVhZHkgYWRkZWQgdG8gdGhpc1xuICAgKiBzdGFjayAodG8gYXZvaWQgZHVwbGljYXRpb24pLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBhZGRlZEltYWdlQXNzZXRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgcHVibGljIGFkZEZpbGVBc3NldChhc3NldDogRmlsZUFzc2V0U291cmNlKTogRmlsZUFzc2V0TG9jYXRpb24ge1xuICAgIC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGhhY2suIFdlIGhhdmUgYSBudW1iZXIgb2YgY29uZmxpY3RpbmcgZ29hbHMgaGVyZTpcbiAgICAvL1xuICAgIC8vIC0gV2Ugd2FudCBwdXQgdGhlIGFjdHVhbCBsb2dpYyBpbiB0aGlzIGNsYXNzXG4gICAgLy8gLSBXZSBBTFNPIHdhbnQgdG8ga2VlcCBzdXBwb3J0aW5nIHBlb3BsZSBvdmVycmlkaW5nIFN0YWNrLmFkZEZpbGVBc3NldCAoZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LFxuICAgIC8vIGJlY2F1c2UgdGhhdCBtZWNoYW5pc20gaXMgY3VycmVudGx5IHVzZWQgdG8gbWFrZSBDSS9DRCBzY2VuYXJpb3Mgd29yaylcbiAgICAvLyAtIFdlIEFMU08gd2FudCB0byBhbGxvdyBib3RoIGVudHJ5IHBvaW50cyBmcm9tIHVzZXIgY29kZSAob3VyIG93biBmcmFtZXdvcmtcbiAgICAvLyBjb2RlIHdpbGwgYWx3YXlzIGNhbGwgc3RhY2suZGVwbG95bWVudE1lY2hhbmlzbS5hZGRGaWxlQXNzZXQoKSBidXQgZXhpc3RpbmcgdXNlcnNcbiAgICAvLyBtYXkgc3RpbGwgYmUgY2FsbGluZyBgc3RhY2suYWRkRmlsZUFzc2V0KClgIGRpcmVjdGx5LlxuICAgIC8vXG4gICAgLy8gU29sdXRpb246IGRlbGVnYXRlIGNhbGwgdG8gdGhlIHN0YWNrLCBidXQgaWYgdGhlIHN0YWNrIGRlbGVnYXRlcyBiYWNrIHRvIHVzIGFnYWluXG4gICAgLy8gdGhlbiBkbyB0aGUgYWN0dWFsIGxvZ2ljLlxuICAgIC8vXG4gICAgLy8gQGRlcHJlY2F0ZWQ6IHRoaXMgY2FuIGJlIHJlbW92ZWQgZm9yIHYyXG4gICAgaWYgKHRoaXMuY3ljbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvQWRkRmlsZUFzc2V0KGFzc2V0KTtcbiAgICB9XG4gICAgdGhpcy5jeWNsZSA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gdGhpcy5ib3VuZFN0YWNrO1xuICAgICAgcmV0dXJuIHdpdGhvdXREZXByZWNhdGlvbldhcm5pbmdzKCgpID0+IHN0YWNrLmFkZEZpbGVBc3NldChhc3NldCkpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmN5Y2xlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZERvY2tlckltYWdlQXNzZXQoYXNzZXQ6IERvY2tlckltYWdlQXNzZXRTb3VyY2UpOiBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb24ge1xuICAgIC8vIFNlZSBgYWRkRmlsZUFzc2V0YCBmb3IgZXhwbGFuYXRpb24uXG4gICAgLy8gQGRlcHJlY2F0ZWQ6IHRoaXMgY2FuIGJlIHJlbW92ZWQgZm9yIHYyXG4gICAgaWYgKHRoaXMuY3ljbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvQWRkRG9ja2VySW1hZ2VBc3NldChhc3NldCk7XG4gICAgfVxuICAgIHRoaXMuY3ljbGUgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGFjayA9IHRoaXMuYm91bmRTdGFjaztcbiAgICAgIHJldHVybiB3aXRob3V0RGVwcmVjYXRpb25XYXJuaW5ncygoKSA9PiBzdGFjay5hZGREb2NrZXJJbWFnZUFzc2V0KGFzc2V0KSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuY3ljbGUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3ludGhlc2l6ZSB0aGUgYXNzb2NpYXRlZCBzdGFjayB0byB0aGUgc2Vzc2lvblxuICAgKi9cbiAgcHVibGljIHN5bnRoZXNpemUoc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24pOiB2b2lkIHtcbiAgICB0aGlzLnN5bnRoZXNpemVUZW1wbGF0ZShzZXNzaW9uKTtcblxuICAgIC8vIEp1c3QgZG8gdGhlIGRlZmF1bHQgc3R1ZmYsIG5vdGhpbmcgc3BlY2lhbFxuICAgIHRoaXMuZW1pdEFydGlmYWN0KHNlc3Npb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2R1Y2UgYSBib3VuZCBTdGFjayBTeW50aGVzaXplciBmb3IgdGhlIGdpdmVuIHN0YWNrLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBtYXkgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIG9uIHRoZSBzYW1lIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyByZXVzYWJsZUJpbmQoc3RhY2s6IFN0YWNrKTogSUJvdW5kU3RhY2tTeW50aGVzaXplciB7XG4gICAgLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgY3VycmVudCBvYmplY3QgYW5kIGJpbmQgdGhhdFxuICAgIGNvbnN0IGNvcHkgPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xuICAgIGNvcHkuYmluZChzdGFjayk7XG4gICAgcmV0dXJuIGNvcHk7XG4gIH1cblxuICBwcml2YXRlIGRvQWRkRG9ja2VySW1hZ2VBc3NldChhc3NldDogRG9ja2VySW1hZ2VBc3NldFNvdXJjZSk6IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiB7XG4gICAgLy8gY2hlY2sgaWYgd2UgaGF2ZSBhbiBvdmVycmlkZSBmcm9tIGNvbnRleHRcbiAgICBjb25zdCByZXBvc2l0b3J5TmFtZU92ZXJyaWRlID0gdGhpcy5ib3VuZFN0YWNrLm5vZGUudHJ5R2V0Q29udGV4dChBU1NFVFNfRUNSX1JFUE9TSVRPUllfTkFNRV9PVkVSUklERV9DT05URVhUX0tFWSk7XG4gICAgY29uc3QgcmVwb3NpdG9yeU5hbWUgPSBhc3NldC5yZXBvc2l0b3J5TmFtZSA/PyByZXBvc2l0b3J5TmFtZU92ZXJyaWRlID8/IEFTU0VUU19FQ1JfUkVQT1NJVE9SWV9OQU1FO1xuICAgIGNvbnN0IGltYWdlVGFnID0gYXNzZXQuc291cmNlSGFzaDtcbiAgICBjb25zdCBhc3NldElkID0gYXNzZXQuc291cmNlSGFzaDtcblxuICAgIC8vIG9ubHkgYWRkIGV2ZXJ5IGltYWdlIChpZGVudGlmaWVkIGJ5IHNvdXJjZSBoYXNoKSBvbmNlIGZvciBlYWNoIHN0YWNrIHRoYXQgdXNlcyBpdC5cbiAgICBpZiAoIXRoaXMuYWRkZWRJbWFnZUFzc2V0cy5oYXMoYXNzZXRJZCkpIHtcbiAgICAgIGlmICghYXNzZXQuZGlyZWN0b3J5TmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYExlZ2FjeVN0YWNrU3ludGhlc2l6ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGlzIHR5cGUgb2YgZmlsZSBhc3NldDogJHtKU09OLnN0cmluZ2lmeShhc3NldCl9YCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1ldGFkYXRhOiBjeHNjaGVtYS5Db250YWluZXJJbWFnZUFzc2V0TWV0YWRhdGFFbnRyeSA9IHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWUsXG4gICAgICAgIGltYWdlVGFnLFxuICAgICAgICBpZDogYXNzZXRJZCxcbiAgICAgICAgcGFja2FnaW5nOiAnY29udGFpbmVyLWltYWdlJyxcbiAgICAgICAgcGF0aDogYXNzZXQuZGlyZWN0b3J5TmFtZSxcbiAgICAgICAgc291cmNlSGFzaDogYXNzZXQuc291cmNlSGFzaCxcbiAgICAgICAgYnVpbGRBcmdzOiBhc3NldC5kb2NrZXJCdWlsZEFyZ3MsXG4gICAgICAgIHRhcmdldDogYXNzZXQuZG9ja2VyQnVpbGRUYXJnZXQsXG4gICAgICAgIGZpbGU6IGFzc2V0LmRvY2tlckZpbGUsXG4gICAgICAgIG5ldHdvcmtNb2RlOiBhc3NldC5uZXR3b3JrTW9kZSxcbiAgICAgICAgcGxhdGZvcm06IGFzc2V0LnBsYXRmb3JtLFxuICAgICAgICBvdXRwdXRzOiBhc3NldC5kb2NrZXJPdXRwdXRzLFxuICAgICAgICBjYWNoZUZyb206IGFzc2V0LmRvY2tlckNhY2hlRnJvbSxcbiAgICAgICAgY2FjaGVUbzogYXNzZXQuZG9ja2VyQ2FjaGVUbyxcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuYm91bmRTdGFjay5ub2RlLmFkZE1ldGFkYXRhKGN4c2NoZW1hLkFydGlmYWN0TWV0YWRhdGFFbnRyeVR5cGUuQVNTRVQsIG1ldGFkYXRhKTtcbiAgICAgIHRoaXMuYWRkZWRJbWFnZUFzc2V0cy5hZGQoYXNzZXRJZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlVXJpOiBgJHt0aGlzLmJvdW5kU3RhY2suYWNjb3VudH0uZGtyLmVjci4ke3RoaXMuYm91bmRTdGFjay5yZWdpb259LiR7dGhpcy5ib3VuZFN0YWNrLnVybFN1ZmZpeH0vJHtyZXBvc2l0b3J5TmFtZX06JHtpbWFnZVRhZ31gLFxuICAgICAgcmVwb3NpdG9yeU5hbWUsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZG9BZGRGaWxlQXNzZXQoYXNzZXQ6IEZpbGVBc3NldFNvdXJjZSk6IEZpbGVBc3NldExvY2F0aW9uIHtcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5hc3NldFBhcmFtZXRlcnMubm9kZS50cnlGaW5kQ2hpbGQoYXNzZXQuc291cmNlSGFzaCkgYXMgRmlsZUFzc2V0UGFyYW1ldGVycztcbiAgICBpZiAoIXBhcmFtcykge1xuICAgICAgcGFyYW1zID0gbmV3IEZpbGVBc3NldFBhcmFtZXRlcnModGhpcy5hc3NldFBhcmFtZXRlcnMsIGFzc2V0LnNvdXJjZUhhc2gpO1xuXG4gICAgICBpZiAoIWFzc2V0LmZpbGVOYW1lIHx8ICFhc3NldC5wYWNrYWdpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMZWdhY3lTdGFja1N5bnRoZXNpemVyIGRvZXMgbm90IHN1cHBvcnQgdGhpcyB0eXBlIG9mIGZpbGUgYXNzZXQ6ICR7SlNPTi5zdHJpbmdpZnkoYXNzZXQpfWApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtZXRhZGF0YTogY3hzY2hlbWEuRmlsZUFzc2V0TWV0YWRhdGFFbnRyeSA9IHtcbiAgICAgICAgcGF0aDogYXNzZXQuZmlsZU5hbWUsXG4gICAgICAgIGlkOiBhc3NldC5zb3VyY2VIYXNoLFxuICAgICAgICBwYWNrYWdpbmc6IGFzc2V0LnBhY2thZ2luZyxcbiAgICAgICAgc291cmNlSGFzaDogYXNzZXQuc291cmNlSGFzaCxcblxuICAgICAgICBzM0J1Y2tldFBhcmFtZXRlcjogcGFyYW1zLmJ1Y2tldE5hbWVQYXJhbWV0ZXIubG9naWNhbElkLFxuICAgICAgICBzM0tleVBhcmFtZXRlcjogcGFyYW1zLm9iamVjdEtleVBhcmFtZXRlci5sb2dpY2FsSWQsXG4gICAgICAgIGFydGlmYWN0SGFzaFBhcmFtZXRlcjogcGFyYW1zLmFydGlmYWN0SGFzaFBhcmFtZXRlci5sb2dpY2FsSWQsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmJvdW5kU3RhY2subm9kZS5hZGRNZXRhZGF0YShjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLkFTU0VULCBtZXRhZGF0YSk7XG4gICAgfVxuXG4gICAgY29uc3QgYnVja2V0TmFtZSA9IHBhcmFtcy5idWNrZXROYW1lUGFyYW1ldGVyLnZhbHVlQXNTdHJpbmc7XG5cbiAgICAvLyBrZXkgaXMgcHJlZml4fHBvc3RmaXhcbiAgICBjb25zdCBlbmNvZGVkS2V5ID0gcGFyYW1zLm9iamVjdEtleVBhcmFtZXRlci52YWx1ZUFzU3RyaW5nO1xuXG4gICAgY29uc3QgczNQcmVmaXggPSBGbi5zZWxlY3QoMCwgRm4uc3BsaXQoY3hhcGkuQVNTRVRfUFJFRklYX1NFUEFSQVRPUiwgZW5jb2RlZEtleSkpO1xuICAgIGNvbnN0IHMzRmlsZW5hbWUgPSBGbi5zZWxlY3QoMSwgRm4uc3BsaXQoY3hhcGkuQVNTRVRfUFJFRklYX1NFUEFSQVRPUiwgZW5jb2RlZEtleSkpO1xuICAgIGNvbnN0IG9iamVjdEtleSA9IGAke3MzUHJlZml4fSR7czNGaWxlbmFtZX1gO1xuXG4gICAgY29uc3QgaHR0cFVybCA9IGBodHRwczovL3MzLiR7dGhpcy5ib3VuZFN0YWNrLnJlZ2lvbn0uJHt0aGlzLmJvdW5kU3RhY2sudXJsU3VmZml4fS8ke2J1Y2tldE5hbWV9LyR7b2JqZWN0S2V5fWA7XG4gICAgY29uc3QgczNPYmplY3RVcmwgPSBgczM6Ly8ke2J1Y2tldE5hbWV9LyR7b2JqZWN0S2V5fWA7XG5cbiAgICByZXR1cm4geyBidWNrZXROYW1lLCBvYmplY3RLZXksIGh0dHBVcmwsIHMzT2JqZWN0VXJsLCBzM1VybDogaHR0cFVybCB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgYXNzZXRQYXJhbWV0ZXJzKCkge1xuICAgIGFzc2VydEJvdW5kKHRoaXMuYm91bmRTdGFjayk7XG5cbiAgICBpZiAoIXRoaXMuX2Fzc2V0UGFyYW1ldGVycykge1xuICAgICAgdGhpcy5fYXNzZXRQYXJhbWV0ZXJzID0gbmV3IENvbnN0cnVjdCh0aGlzLmJvdW5kU3RhY2ssICdBc3NldFBhcmFtZXRlcnMnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Fzc2V0UGFyYW1ldGVycztcbiAgfVxufVxuXG5mdW5jdGlvbiB3aXRob3V0RGVwcmVjYXRpb25XYXJuaW5nczxBPihibG9jazogKCkgPT4gQSk6IEEge1xuICBjb25zdCBvcmlnID0gcHJvY2Vzcy5lbnYuSlNJSV9ERVBSRUNBVEVEO1xuICBwcm9jZXNzLmVudi5KU0lJX0RFUFJFQ0FURUQgPSAncXVpZXQnO1xuICB0cnkge1xuICAgIHJldHVybiBibG9jaygpO1xuICB9IGZpbmFsbHkge1xuICAgIHByb2Nlc3MuZW52LkpTSUlfREVQUkVDQVRFRCA9IG9yaWc7XG4gIH1cbn1cbiJdfQ==