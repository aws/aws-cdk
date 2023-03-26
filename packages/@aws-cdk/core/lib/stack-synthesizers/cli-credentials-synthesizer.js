"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliCredentialsStackSynthesizer = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxapi = require("@aws-cdk/cx-api");
const _shared_1 = require("./_shared");
const asset_manifest_builder_1 = require("./asset-manifest-builder");
const default_synthesizer_1 = require("./default-synthesizer");
const stack_synthesizer_1 = require("./stack-synthesizer");
const token_1 = require("../token");
/**
 * A synthesizer that uses conventional asset locations, but not conventional deployment roles
 *
 * Instead of assuming the bootstrapped deployment roles, all stack operations will be performed
 * using the CLI's current credentials.
 *
 * - This synthesizer does not support deploying to accounts to which the CLI does not have
 *   credentials. It also does not support deploying using **CDK Pipelines**. For either of those
 *   features, use `DefaultStackSynthesizer`.
 * - This synthesizer requires an S3 bucket and ECR repository with well-known names. To
 *   not depend on those, use `LegacyStackSynthesizer`.
 *
 * Be aware that your CLI credentials must be valid for the duration of the
 * entire deployment. If you are using session credentials, make sure the
 * session lifetime is long enough.
 *
 * By default, expects the environment to have been bootstrapped with just the staging resources
 * of the Bootstrap Stack V2 (also known as "modern bootstrap stack"). You can override
 * the default names using the synthesizer's construction properties.
 */
class CliCredentialsStackSynthesizer extends stack_synthesizer_1.StackSynthesizer {
    constructor(props = {}) {
        super();
        this.props = props;
        this.assetManifest = new asset_manifest_builder_1.AssetManifestBuilder();
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CliCredentialsStackSynthesizerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CliCredentialsStackSynthesizer);
            }
            throw error;
        }
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                validateNoToken(key);
            }
        }
        function validateNoToken(key) {
            const prop = props[key];
            if (typeof prop === 'string' && token_1.Token.isUnresolved(prop)) {
                throw new Error(`CliCredentialsStackSynthesizer property '${key}' cannot contain tokens; only the following placeholder strings are allowed: ` + [
                    '${Qualifier}',
                    cxapi.EnvironmentPlaceholders.CURRENT_REGION,
                    cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT,
                    cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
                ].join(', '));
            }
        }
    }
    /**
     * The qualifier used to bootstrap this stack
     */
    get bootstrapQualifier() {
        return this.qualifier;
    }
    bind(stack) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        super.bind(stack);
        const qualifier = this.props.qualifier ?? stack.node.tryGetContext(default_synthesizer_1.BOOTSTRAP_QUALIFIER_CONTEXT) ?? default_synthesizer_1.DefaultStackSynthesizer.DEFAULT_QUALIFIER;
        this.qualifier = qualifier;
        const spec = new _shared_1.StringSpecializer(stack, qualifier);
        /* eslint-disable max-len */
        this.bucketName = spec.specialize(this.props.fileAssetsBucketName ?? default_synthesizer_1.DefaultStackSynthesizer.DEFAULT_FILE_ASSETS_BUCKET_NAME);
        this.repositoryName = spec.specialize(this.props.imageAssetsRepositoryName ?? default_synthesizer_1.DefaultStackSynthesizer.DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME);
        this.bucketPrefix = spec.specialize(this.props.bucketPrefix ?? default_synthesizer_1.DefaultStackSynthesizer.DEFAULT_FILE_ASSET_PREFIX);
        this.dockerTagPrefix = spec.specialize(this.props.dockerTagPrefix ?? default_synthesizer_1.DefaultStackSynthesizer.DEFAULT_DOCKER_ASSET_PREFIX);
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
        (0, _shared_1.assertBound)(this.bucketName);
        const location = this.assetManifest.defaultAddFileAsset(this.boundStack, asset, {
            bucketName: this.bucketName,
            bucketPrefix: this.bucketPrefix,
        });
        return this.cloudFormationLocationFromFileAsset(location);
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
        (0, _shared_1.assertBound)(this.repositoryName);
        const location = this.assetManifest.defaultAddDockerImageAsset(this.boundStack, asset, {
            repositoryName: this.repositoryName,
            dockerTagPrefix: this.dockerTagPrefix,
        });
        return this.cloudFormationLocationFromDockerImageAsset(location);
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
        (0, _shared_1.assertBound)(this.qualifier);
        const templateAssetSource = this.synthesizeTemplate(session);
        const templateAsset = this.addFileAsset(templateAssetSource);
        const assetManifestId = this.assetManifest.emitManifest(this.boundStack, session);
        this.emitArtifact(session, {
            stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
            additionalDependencies: [assetManifestId],
        });
    }
}
_a = JSII_RTTI_SYMBOL_1;
CliCredentialsStackSynthesizer[_a] = { fqn: "@aws-cdk/core.CliCredentialsStackSynthesizer", version: "0.0.0" };
exports.CliCredentialsStackSynthesizer = CliCredentialsStackSynthesizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWNyZWRlbnRpYWxzLXN5bnRoZXNpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpLWNyZWRlbnRpYWxzLXN5bnRoZXNpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHlDQUF5QztBQUN6Qyx1Q0FBMkQ7QUFDM0QscUVBQWdFO0FBQ2hFLCtEQUE2RjtBQUM3RiwyREFBdUQ7QUFJdkQsb0NBQWlDO0FBNERqQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUNILE1BQWEsOEJBQStCLFNBQVEsb0NBQWdCO0lBU2xFLFlBQTZCLFFBQTZDLEVBQUU7UUFDMUUsS0FBSyxFQUFFLENBQUM7UUFEbUIsVUFBSyxHQUFMLEtBQUssQ0FBMEM7UUFGM0Qsa0JBQWEsR0FBRyxJQUFJLDZDQUFvQixFQUFFLENBQUM7Ozs7OzsrQ0FQakQsOEJBQThCOzs7O1FBWXZDLEtBQUssTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFO1lBQ3ZCLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDN0IsZUFBZSxDQUFDLEdBQWdELENBQUMsQ0FBQzthQUNuRTtTQUNGO1FBRUQsU0FBUyxlQUFlLENBQXNELEdBQU07WUFDbEYsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLGFBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLEdBQUcsK0VBQStFLEdBQUc7b0JBQy9JLGNBQWM7b0JBQ2QsS0FBSyxDQUFDLHVCQUF1QixDQUFDLGNBQWM7b0JBQzVDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxlQUFlO29CQUM3QyxLQUFLLENBQUMsdUJBQXVCLENBQUMsaUJBQWlCO2lCQUNoRCxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ2Y7UUFDSCxDQUFDO0tBQ0Y7SUFFRDs7T0FFRztJQUNILElBQVcsa0JBQWtCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUN2QjtJQUVNLElBQUksQ0FBQyxLQUFZOzs7Ozs7Ozs7O1FBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsaURBQTJCLENBQUMsSUFBSSw2Q0FBdUIsQ0FBQyxpQkFBaUIsQ0FBQztRQUM3SSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUUzQixNQUFNLElBQUksR0FBRyxJQUFJLDJCQUFpQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVyRCw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLElBQUksNkNBQXVCLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUM5SCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsSUFBSSw2Q0FBdUIsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQzVJLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSw2Q0FBdUIsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ2xILElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsSUFBSSw2Q0FBdUIsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0tBRTNIO0lBRUQ7Ozs7T0FJRztJQUNJLFlBQVksQ0FBQyxLQUFZOzs7Ozs7Ozs7O1FBQzlCLG9EQUFvRDtRQUNwRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVNLFlBQVksQ0FBQyxLQUFzQjs7Ozs7Ozs7OztRQUN4QyxJQUFBLHFCQUFXLEVBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTdCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUU7WUFDOUUsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQzNCLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtTQUNoQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMzRDtJQUVNLG1CQUFtQixDQUFDLEtBQTZCOzs7Ozs7Ozs7O1FBQ3RELElBQUEscUJBQVcsRUFBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRTtZQUNyRixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbkMsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO1NBQ3RDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDLDBDQUEwQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xFO0lBRUQ7O09BRUc7SUFDSSxVQUFVLENBQUMsT0FBMEI7Ozs7Ozs7Ozs7UUFDMUMsSUFBQSxxQkFBVyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU1QixNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3RCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFN0QsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVsRixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUN6QiwyQkFBMkIsRUFBRSxhQUFhLENBQUMsMkJBQTJCO1lBQ3RFLHNCQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDO1NBQzFDLENBQUMsQ0FBQztLQUNKOzs7O0FBckdVLHdFQUE4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBhc3NlcnRCb3VuZCwgU3RyaW5nU3BlY2lhbGl6ZXIgfSBmcm9tICcuL19zaGFyZWQnO1xuaW1wb3J0IHsgQXNzZXRNYW5pZmVzdEJ1aWxkZXIgfSBmcm9tICcuL2Fzc2V0LW1hbmlmZXN0LWJ1aWxkZXInO1xuaW1wb3J0IHsgQk9PVFNUUkFQX1FVQUxJRklFUl9DT05URVhULCBEZWZhdWx0U3RhY2tTeW50aGVzaXplciB9IGZyb20gJy4vZGVmYXVsdC1zeW50aGVzaXplcic7XG5pbXBvcnQgeyBTdGFja1N5bnRoZXNpemVyIH0gZnJvbSAnLi9zdGFjay1zeW50aGVzaXplcic7XG5pbXBvcnQgeyBJU3ludGhlc2lzU2Vzc2lvbiwgSVJldXNhYmxlU3RhY2tTeW50aGVzaXplciwgSUJvdW5kU3RhY2tTeW50aGVzaXplciB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgRG9ja2VySW1hZ2VBc3NldExvY2F0aW9uLCBEb2NrZXJJbWFnZUFzc2V0U291cmNlLCBGaWxlQXNzZXRMb2NhdGlvbiwgRmlsZUFzc2V0U291cmNlIH0gZnJvbSAnLi4vYXNzZXRzJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuLi90b2tlbic7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgdGhlIENsaUNyZWRlbnRpYWxzU3RhY2tTeW50aGVzaXplclxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsaUNyZWRlbnRpYWxzU3RhY2tTeW50aGVzaXplclByb3BzIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIFMzIGJ1Y2tldCB0byBob2xkIGZpbGUgYXNzZXRzXG4gICAqXG4gICAqIFlvdSBtdXN0IHN1cHBseSB0aGlzIGlmIHlvdSBoYXZlIGdpdmVuIGEgbm9uLXN0YW5kYXJkIG5hbWUgdG8gdGhlIHN0YWdpbmcgYnVja2V0LlxuICAgKlxuICAgKiBUaGUgcGxhY2Vob2xkZXJzIGAke1F1YWxpZmllcn1gLCBgJHtBV1M6OkFjY291bnRJZH1gIGFuZCBgJHtBV1M6OlJlZ2lvbn1gIHdpbGxcbiAgICogYmUgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWVzIG9mIHF1YWxpZmllciBhbmQgdGhlIHN0YWNrJ3MgYWNjb3VudCBhbmQgcmVnaW9uLFxuICAgKiByZXNwZWN0aXZlbHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfRklMRV9BU1NFVFNfQlVDS0VUX05BTUVcbiAgICovXG4gIHJlYWRvbmx5IGZpbGVBc3NldHNCdWNrZXROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBFQ1IgcmVwb3NpdG9yeSB0byBob2xkIERvY2tlciBJbWFnZSBhc3NldHNcbiAgICpcbiAgICogWW91IG11c3Qgc3VwcGx5IHRoaXMgaWYgeW91IGhhdmUgZ2l2ZW4gYSBub24tc3RhbmRhcmQgbmFtZSB0byB0aGUgRUNSIHJlcG9zaXRvcnkuXG4gICAqXG4gICAqIFRoZSBwbGFjZWhvbGRlcnMgYCR7UXVhbGlmaWVyfWAsIGAke0FXUzo6QWNjb3VudElkfWAgYW5kIGAke0FXUzo6UmVnaW9ufWAgd2lsbFxuICAgKiBiZSByZXBsYWNlZCB3aXRoIHRoZSB2YWx1ZXMgb2YgcXVhbGlmaWVyIGFuZCB0aGUgc3RhY2sncyBhY2NvdW50IGFuZCByZWdpb24sXG4gICAqIHJlc3BlY3RpdmVseS5cbiAgICpcbiAgICogQGRlZmF1bHQgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9JTUFHRV9BU1NFVFNfUkVQT1NJVE9SWV9OQU1FXG4gICAqL1xuICByZWFkb25seSBpbWFnZUFzc2V0c1JlcG9zaXRvcnlOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBRdWFsaWZpZXIgdG8gZGlzYW1iaWd1YXRlIG11bHRpcGxlIGVudmlyb25tZW50cyBpbiB0aGUgc2FtZSBhY2NvdW50XG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIHRoaXMgYW5kIGxlYXZlIHRoZSBvdGhlciBuYW1pbmcgcHJvcGVydGllcyBlbXB0eSBpZiB5b3UgaGF2ZSBkZXBsb3llZFxuICAgKiB0aGUgYm9vdHN0cmFwIGVudmlyb25tZW50IHdpdGggc3RhbmRhcmQgbmFtZXMgYnV0IG9ubHkgZGlmZmVybmV0IHF1YWxpZmllcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVmFsdWUgb2YgY29udGV4dCBrZXkgJ0Bhd3MtY2RrL2NvcmU6Ym9vdHN0cmFwUXVhbGlmaWVyJyBpZiBzZXQsIG90aGVyd2lzZSBgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9RVUFMSUZJRVJgXG4gICAqL1xuICByZWFkb25seSBxdWFsaWZpZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGJ1Y2tldFByZWZpeCB0byB1c2Ugd2hpbGUgc3RvcmluZyBTMyBBc3NldHNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0ZJTEVfQVNTRVRfUFJFRklYXG4gICAqL1xuICByZWFkb25seSBidWNrZXRQcmVmaXg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgcHJlZml4IHRvIHVzZSB3aGlsZSB0YWdnaW5nIGFuZCB1cGxvYWRpbmcgRG9ja2VyIGltYWdlcyB0byBFQ1IuXG4gICAqXG4gICAqIFRoaXMgZG9lcyBub3QgYWRkIGFueSBzZXBhcmF0b3JzIC0gdGhlIHNvdXJjZSBoYXNoIHdpbGwgYmUgYXBwZW5kZWQgdG9cbiAgICogdGhpcyBzdHJpbmcgZGlyZWN0bHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9ET0NLRVJfQVNTRVRfUFJFRklYXG4gICAqL1xuICByZWFkb25seSBkb2NrZXJUYWdQcmVmaXg/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBzeW50aGVzaXplciB0aGF0IHVzZXMgY29udmVudGlvbmFsIGFzc2V0IGxvY2F0aW9ucywgYnV0IG5vdCBjb252ZW50aW9uYWwgZGVwbG95bWVudCByb2xlc1xuICpcbiAqIEluc3RlYWQgb2YgYXNzdW1pbmcgdGhlIGJvb3RzdHJhcHBlZCBkZXBsb3ltZW50IHJvbGVzLCBhbGwgc3RhY2sgb3BlcmF0aW9ucyB3aWxsIGJlIHBlcmZvcm1lZFxuICogdXNpbmcgdGhlIENMSSdzIGN1cnJlbnQgY3JlZGVudGlhbHMuXG4gKlxuICogLSBUaGlzIHN5bnRoZXNpemVyIGRvZXMgbm90IHN1cHBvcnQgZGVwbG95aW5nIHRvIGFjY291bnRzIHRvIHdoaWNoIHRoZSBDTEkgZG9lcyBub3QgaGF2ZVxuICogICBjcmVkZW50aWFscy4gSXQgYWxzbyBkb2VzIG5vdCBzdXBwb3J0IGRlcGxveWluZyB1c2luZyAqKkNESyBQaXBlbGluZXMqKi4gRm9yIGVpdGhlciBvZiB0aG9zZVxuICogICBmZWF0dXJlcywgdXNlIGBEZWZhdWx0U3RhY2tTeW50aGVzaXplcmAuXG4gKiAtIFRoaXMgc3ludGhlc2l6ZXIgcmVxdWlyZXMgYW4gUzMgYnVja2V0IGFuZCBFQ1IgcmVwb3NpdG9yeSB3aXRoIHdlbGwta25vd24gbmFtZXMuIFRvXG4gKiAgIG5vdCBkZXBlbmQgb24gdGhvc2UsIHVzZSBgTGVnYWN5U3RhY2tTeW50aGVzaXplcmAuXG4gKlxuICogQmUgYXdhcmUgdGhhdCB5b3VyIENMSSBjcmVkZW50aWFscyBtdXN0IGJlIHZhbGlkIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlXG4gKiBlbnRpcmUgZGVwbG95bWVudC4gSWYgeW91IGFyZSB1c2luZyBzZXNzaW9uIGNyZWRlbnRpYWxzLCBtYWtlIHN1cmUgdGhlXG4gKiBzZXNzaW9uIGxpZmV0aW1lIGlzIGxvbmcgZW5vdWdoLlxuICpcbiAqIEJ5IGRlZmF1bHQsIGV4cGVjdHMgdGhlIGVudmlyb25tZW50IHRvIGhhdmUgYmVlbiBib290c3RyYXBwZWQgd2l0aCBqdXN0IHRoZSBzdGFnaW5nIHJlc291cmNlc1xuICogb2YgdGhlIEJvb3RzdHJhcCBTdGFjayBWMiAoYWxzbyBrbm93biBhcyBcIm1vZGVybiBib290c3RyYXAgc3RhY2tcIikuIFlvdSBjYW4gb3ZlcnJpZGVcbiAqIHRoZSBkZWZhdWx0IG5hbWVzIHVzaW5nIHRoZSBzeW50aGVzaXplcidzIGNvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgY2xhc3MgQ2xpQ3JlZGVudGlhbHNTdGFja1N5bnRoZXNpemVyIGV4dGVuZHMgU3RhY2tTeW50aGVzaXplciBpbXBsZW1lbnRzIElSZXVzYWJsZVN0YWNrU3ludGhlc2l6ZXIsIElCb3VuZFN0YWNrU3ludGhlc2l6ZXIge1xuICBwcml2YXRlIHF1YWxpZmllcj86IHN0cmluZztcbiAgcHJpdmF0ZSBidWNrZXROYW1lPzogc3RyaW5nO1xuICBwcml2YXRlIHJlcG9zaXRvcnlOYW1lPzogc3RyaW5nO1xuICBwcml2YXRlIGJ1Y2tldFByZWZpeD86IHN0cmluZztcbiAgcHJpdmF0ZSBkb2NrZXJUYWdQcmVmaXg/OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhc3NldE1hbmlmZXN0ID0gbmV3IEFzc2V0TWFuaWZlc3RCdWlsZGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogQ2xpQ3JlZGVudGlhbHNTdGFja1N5bnRoZXNpemVyUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcykge1xuICAgICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgdmFsaWRhdGVOb1Rva2VuKGtleSBhcyBrZXlvZiBDbGlDcmVkZW50aWFsc1N0YWNrU3ludGhlc2l6ZXJQcm9wcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVOb1Rva2VuPEEgZXh0ZW5kcyBrZXlvZiBDbGlDcmVkZW50aWFsc1N0YWNrU3ludGhlc2l6ZXJQcm9wcz4oa2V5OiBBKSB7XG4gICAgICBjb25zdCBwcm9wID0gcHJvcHNba2V5XTtcbiAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycgJiYgVG9rZW4uaXNVbnJlc29sdmVkKHByb3ApKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2xpQ3JlZGVudGlhbHNTdGFja1N5bnRoZXNpemVyIHByb3BlcnR5ICcke2tleX0nIGNhbm5vdCBjb250YWluIHRva2Vuczsgb25seSB0aGUgZm9sbG93aW5nIHBsYWNlaG9sZGVyIHN0cmluZ3MgYXJlIGFsbG93ZWQ6IGAgKyBbXG4gICAgICAgICAgJyR7UXVhbGlmaWVyfScsXG4gICAgICAgICAgY3hhcGkuRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMuQ1VSUkVOVF9SRUdJT04sXG4gICAgICAgICAgY3hhcGkuRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMuQ1VSUkVOVF9BQ0NPVU5ULFxuICAgICAgICAgIGN4YXBpLkVudmlyb25tZW50UGxhY2Vob2xkZXJzLkNVUlJFTlRfUEFSVElUSU9OLFxuICAgICAgICBdLmpvaW4oJywgJykpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcXVhbGlmaWVyIHVzZWQgdG8gYm9vdHN0cmFwIHRoaXMgc3RhY2tcbiAgICovXG4gIHB1YmxpYyBnZXQgYm9vdHN0cmFwUXVhbGlmaWVyKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMucXVhbGlmaWVyO1xuICB9XG5cbiAgcHVibGljIGJpbmQoc3RhY2s6IFN0YWNrKTogdm9pZCB7XG4gICAgc3VwZXIuYmluZChzdGFjayk7XG5cbiAgICBjb25zdCBxdWFsaWZpZXIgPSB0aGlzLnByb3BzLnF1YWxpZmllciA/PyBzdGFjay5ub2RlLnRyeUdldENvbnRleHQoQk9PVFNUUkFQX1FVQUxJRklFUl9DT05URVhUKSA/PyBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX1FVQUxJRklFUjtcbiAgICB0aGlzLnF1YWxpZmllciA9IHF1YWxpZmllcjtcblxuICAgIGNvbnN0IHNwZWMgPSBuZXcgU3RyaW5nU3BlY2lhbGl6ZXIoc3RhY2ssIHF1YWxpZmllcik7XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG4gICAgdGhpcy5idWNrZXROYW1lID0gc3BlYy5zcGVjaWFsaXplKHRoaXMucHJvcHMuZmlsZUFzc2V0c0J1Y2tldE5hbWUgPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9GSUxFX0FTU0VUU19CVUNLRVRfTkFNRSk7XG4gICAgdGhpcy5yZXBvc2l0b3J5TmFtZSA9IHNwZWMuc3BlY2lhbGl6ZSh0aGlzLnByb3BzLmltYWdlQXNzZXRzUmVwb3NpdG9yeU5hbWUgPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9JTUFHRV9BU1NFVFNfUkVQT1NJVE9SWV9OQU1FKTtcbiAgICB0aGlzLmJ1Y2tldFByZWZpeCA9IHNwZWMuc3BlY2lhbGl6ZSh0aGlzLnByb3BzLmJ1Y2tldFByZWZpeCA/PyBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0ZJTEVfQVNTRVRfUFJFRklYKTtcbiAgICB0aGlzLmRvY2tlclRhZ1ByZWZpeCA9IHNwZWMuc3BlY2lhbGl6ZSh0aGlzLnByb3BzLmRvY2tlclRhZ1ByZWZpeCA/PyBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0RPQ0tFUl9BU1NFVF9QUkVGSVgpO1xuICAgIC8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2R1Y2UgYSBib3VuZCBTdGFjayBTeW50aGVzaXplciBmb3IgdGhlIGdpdmVuIHN0YWNrLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBtYXkgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIG9uIHRoZSBzYW1lIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyByZXVzYWJsZUJpbmQoc3RhY2s6IFN0YWNrKTogSUJvdW5kU3RhY2tTeW50aGVzaXplciB7XG4gICAgLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgY3VycmVudCBvYmplY3QgYW5kIGJpbmQgdGhhdFxuICAgIGNvbnN0IGNvcHkgPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xuICAgIGNvcHkuYmluZChzdGFjayk7XG4gICAgcmV0dXJuIGNvcHk7XG4gIH1cblxuICBwdWJsaWMgYWRkRmlsZUFzc2V0KGFzc2V0OiBGaWxlQXNzZXRTb3VyY2UpOiBGaWxlQXNzZXRMb2NhdGlvbiB7XG4gICAgYXNzZXJ0Qm91bmQodGhpcy5idWNrZXROYW1lKTtcblxuICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5hc3NldE1hbmlmZXN0LmRlZmF1bHRBZGRGaWxlQXNzZXQodGhpcy5ib3VuZFN0YWNrLCBhc3NldCwge1xuICAgICAgYnVja2V0TmFtZTogdGhpcy5idWNrZXROYW1lLFxuICAgICAgYnVja2V0UHJlZml4OiB0aGlzLmJ1Y2tldFByZWZpeCxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jbG91ZEZvcm1hdGlvbkxvY2F0aW9uRnJvbUZpbGVBc3NldChsb2NhdGlvbik7XG4gIH1cblxuICBwdWJsaWMgYWRkRG9ja2VySW1hZ2VBc3NldChhc3NldDogRG9ja2VySW1hZ2VBc3NldFNvdXJjZSk6IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiB7XG4gICAgYXNzZXJ0Qm91bmQodGhpcy5yZXBvc2l0b3J5TmFtZSk7XG5cbiAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuYXNzZXRNYW5pZmVzdC5kZWZhdWx0QWRkRG9ja2VySW1hZ2VBc3NldCh0aGlzLmJvdW5kU3RhY2ssIGFzc2V0LCB7XG4gICAgICByZXBvc2l0b3J5TmFtZTogdGhpcy5yZXBvc2l0b3J5TmFtZSxcbiAgICAgIGRvY2tlclRhZ1ByZWZpeDogdGhpcy5kb2NrZXJUYWdQcmVmaXgsXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY2xvdWRGb3JtYXRpb25Mb2NhdGlvbkZyb21Eb2NrZXJJbWFnZUFzc2V0KGxvY2F0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW50aGVzaXplIHRoZSBhc3NvY2lhdGVkIHN0YWNrIHRvIHRoZSBzZXNzaW9uXG4gICAqL1xuICBwdWJsaWMgc3ludGhlc2l6ZShzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbik6IHZvaWQge1xuICAgIGFzc2VydEJvdW5kKHRoaXMucXVhbGlmaWVyKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlQXNzZXRTb3VyY2UgPSB0aGlzLnN5bnRoZXNpemVUZW1wbGF0ZShzZXNzaW9uKTtcbiAgICBjb25zdCB0ZW1wbGF0ZUFzc2V0ID0gdGhpcy5hZGRGaWxlQXNzZXQodGVtcGxhdGVBc3NldFNvdXJjZSk7XG5cbiAgICBjb25zdCBhc3NldE1hbmlmZXN0SWQgPSB0aGlzLmFzc2V0TWFuaWZlc3QuZW1pdE1hbmlmZXN0KHRoaXMuYm91bmRTdGFjaywgc2Vzc2lvbik7XG5cbiAgICB0aGlzLmVtaXRBcnRpZmFjdChzZXNzaW9uLCB7XG4gICAgICBzdGFja1RlbXBsYXRlQXNzZXRPYmplY3RVcmw6IHRlbXBsYXRlQXNzZXQuczNPYmplY3RVcmxXaXRoUGxhY2Vob2xkZXJzLFxuICAgICAgYWRkaXRpb25hbERlcGVuZGVuY2llczogW2Fzc2V0TWFuaWZlc3RJZF0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==