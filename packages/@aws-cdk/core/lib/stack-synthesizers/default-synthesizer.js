"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStackSynthesizer = exports.BOOTSTRAP_QUALIFIER_CONTEXT = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxapi = require("@aws-cdk/cx-api");
const _shared_1 = require("./_shared");
const asset_manifest_builder_1 = require("./asset-manifest-builder");
const stack_synthesizer_1 = require("./stack-synthesizer");
const token_1 = require("../token");
exports.BOOTSTRAP_QUALIFIER_CONTEXT = '@aws-cdk/core:bootstrapQualifier';
/* eslint-disable max-len */
/**
 * The minimum bootstrap stack version required by this app.
 */
const MIN_BOOTSTRAP_STACK_VERSION = 6;
/**
 * The minimum bootstrap stack version required
 * to use the lookup role.
 */
const MIN_LOOKUP_ROLE_BOOTSTRAP_STACK_VERSION = 8;
/**
 * Uses conventionally named roles and asset storage locations
 *
 * This synthesizer:
 *
 * - Supports cross-account deployments (the CLI can have credentials to one
 *   account, and you can still deploy to another account by assuming roles with
 *   well-known names in the other account).
 * - Supports the **CDK Pipelines** library.
 *
 * Requires the environment to have been bootstrapped with Bootstrap Stack V2
 * (also known as "modern bootstrap stack"). The synthesizer adds a version
 * check to the template, to make sure the bootstrap stack is recent enough
 * to support all features expected by this synthesizer.
 */
class DefaultStackSynthesizer extends stack_synthesizer_1.StackSynthesizer {
    constructor(props = {}) {
        super();
        this.props = props;
        this.assetManifest = new asset_manifest_builder_1.AssetManifestBuilder();
        try {
            jsiiDeprecationWarnings._aws_cdk_core_DefaultStackSynthesizerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, DefaultStackSynthesizer);
            }
            throw error;
        }
        this.useLookupRoleForStackOperations = props.useLookupRoleForStackOperations ?? true;
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                validateNoToken(key);
            }
        }
        function validateNoToken(key) {
            const prop = props[key];
            if (typeof prop === 'string' && token_1.Token.isUnresolved(prop)) {
                throw new Error(`DefaultStackSynthesizer property '${key}' cannot contain tokens; only the following placeholder strings are allowed: ` + [
                    '${Qualifier}',
                    cxapi.EnvironmentPlaceholders.CURRENT_REGION,
                    cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT,
                    cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
                ].join(', '));
            }
        }
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
        const qualifier = this.props.qualifier ?? stack.node.tryGetContext(exports.BOOTSTRAP_QUALIFIER_CONTEXT) ?? DefaultStackSynthesizer.DEFAULT_QUALIFIER;
        this.qualifier = qualifier;
        const spec = new _shared_1.StringSpecializer(stack, qualifier);
        /* eslint-disable max-len */
        this.bucketName = spec.specialize(this.props.fileAssetsBucketName ?? DefaultStackSynthesizer.DEFAULT_FILE_ASSETS_BUCKET_NAME);
        this.repositoryName = spec.specialize(this.props.imageAssetsRepositoryName ?? DefaultStackSynthesizer.DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME);
        this._deployRoleArn = spec.specialize(this.props.deployRoleArn ?? DefaultStackSynthesizer.DEFAULT_DEPLOY_ROLE_ARN);
        this._cloudFormationExecutionRoleArn = spec.specialize(this.props.cloudFormationExecutionRole ?? DefaultStackSynthesizer.DEFAULT_CLOUDFORMATION_ROLE_ARN);
        this.fileAssetPublishingRoleArn = spec.specialize(this.props.fileAssetPublishingRoleArn ?? DefaultStackSynthesizer.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_ARN);
        this.imageAssetPublishingRoleArn = spec.specialize(this.props.imageAssetPublishingRoleArn ?? DefaultStackSynthesizer.DEFAULT_IMAGE_ASSET_PUBLISHING_ROLE_ARN);
        this.lookupRoleArn = spec.specialize(this.props.lookupRoleArn ?? DefaultStackSynthesizer.DEFAULT_LOOKUP_ROLE_ARN);
        this.bucketPrefix = spec.specialize(this.props.bucketPrefix ?? DefaultStackSynthesizer.DEFAULT_FILE_ASSET_PREFIX);
        this.dockerTagPrefix = spec.specialize(this.props.dockerTagPrefix ?? DefaultStackSynthesizer.DEFAULT_DOCKER_ASSET_PREFIX);
        this.bootstrapStackVersionSsmParameter = spec.qualifierOnly(this.props.bootstrapStackVersionSsmParameter ?? DefaultStackSynthesizer.DEFAULT_BOOTSTRAP_STACK_VERSION_SSM_PARAMETER);
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
            role: this.fileAssetPublishingRoleArn ? {
                assumeRoleArn: this.fileAssetPublishingRoleArn,
                assumeRoleExternalId: this.props.fileAssetPublishingExternalId,
            } : undefined,
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
            role: this.imageAssetPublishingRoleArn ? {
                assumeRoleArn: this.imageAssetPublishingRoleArn,
                assumeRoleExternalId: this.props.imageAssetPublishingExternalId,
            } : undefined,
        });
        return this.cloudFormationLocationFromDockerImageAsset(location);
    }
    /**
     * Synthesize the stack template to the given session, passing the configured lookup role ARN
     */
    synthesizeStackTemplate(stack, session) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
            jsiiDeprecationWarnings._aws_cdk_core_ISynthesisSession(session);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.synthesizeStackTemplate);
            }
            throw error;
        }
        stack._synthesizeTemplate(session, this.lookupRoleArn);
    }
    /**
     * Return the currently bound stack
     *
     * @deprecated Use `boundStack` instead.
     */
    get stack() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.DefaultStackSynthesizer#stack", "Use `boundStack` instead.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "stack").get);
            }
            throw error;
        }
        return this.boundStack;
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
        // Must be done here -- if it's done in bind() (called in the Stack's constructor)
        // then it will become impossible to set context after that.
        //
        // If it's done AFTER _synthesizeTemplate(), then the template won't contain the
        // right constructs.
        if (this.props.generateBootstrapVersionRule ?? true) {
            this.addBootstrapVersionRule(MIN_BOOTSTRAP_STACK_VERSION, this.bootstrapStackVersionSsmParameter);
        }
        const templateAssetSource = this.synthesizeTemplate(session, this.lookupRoleArn);
        const templateAsset = this.addFileAsset(templateAssetSource);
        const assetManifestId = this.assetManifest.emitManifest(this.boundStack, session, {
            requiresBootstrapStackVersion: MIN_BOOTSTRAP_STACK_VERSION,
            bootstrapStackVersionSsmParameter: this.bootstrapStackVersionSsmParameter,
        });
        this.emitArtifact(session, {
            assumeRoleExternalId: this.props.deployRoleExternalId,
            assumeRoleArn: this._deployRoleArn,
            cloudFormationExecutionRoleArn: this._cloudFormationExecutionRoleArn,
            stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
            requiresBootstrapStackVersion: MIN_BOOTSTRAP_STACK_VERSION,
            bootstrapStackVersionSsmParameter: this.bootstrapStackVersionSsmParameter,
            additionalDependencies: [assetManifestId],
            lookupRole: this.useLookupRoleForStackOperations && this.lookupRoleArn ? {
                arn: this.lookupRoleArn,
                assumeRoleExternalId: this.props.lookupRoleExternalId,
                requiresBootstrapStackVersion: MIN_LOOKUP_ROLE_BOOTSTRAP_STACK_VERSION,
                bootstrapStackVersionSsmParameter: this.bootstrapStackVersionSsmParameter,
            } : undefined,
        });
    }
    /**
     * Returns the ARN of the deploy Role.
     */
    get deployRoleArn() {
        if (!this._deployRoleArn) {
            throw new Error('deployRoleArn getter can only be called after the synthesizer has been bound to a Stack');
        }
        return this._deployRoleArn;
    }
    /**
     * Returns the ARN of the CFN execution Role.
     */
    get cloudFormationExecutionRoleArn() {
        if (!this._cloudFormationExecutionRoleArn) {
            throw new Error('cloudFormationExecutionRoleArn getter can only be called after the synthesizer has been bound to a Stack');
        }
        return this._cloudFormationExecutionRoleArn;
    }
}
_a = JSII_RTTI_SYMBOL_1;
DefaultStackSynthesizer[_a] = { fqn: "@aws-cdk/core.DefaultStackSynthesizer", version: "0.0.0" };
/**
 * Default ARN qualifier
 */
DefaultStackSynthesizer.DEFAULT_QUALIFIER = 'hnb659fds';
/**
 * Default CloudFormation role ARN.
 */
DefaultStackSynthesizer.DEFAULT_CLOUDFORMATION_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-cfn-exec-role-${AWS::AccountId}-${AWS::Region}';
/**
 * Default deploy role ARN.
 */
DefaultStackSynthesizer.DEFAULT_DEPLOY_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-deploy-role-${AWS::AccountId}-${AWS::Region}';
/**
 * Default asset publishing role ARN for file (S3) assets.
 */
DefaultStackSynthesizer.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-file-publishing-role-${AWS::AccountId}-${AWS::Region}';
/**
 * Default asset publishing role ARN for image (ECR) assets.
 */
DefaultStackSynthesizer.DEFAULT_IMAGE_ASSET_PUBLISHING_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-image-publishing-role-${AWS::AccountId}-${AWS::Region}';
/**
 * Default lookup role ARN for missing values.
 */
DefaultStackSynthesizer.DEFAULT_LOOKUP_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-lookup-role-${AWS::AccountId}-${AWS::Region}';
/**
 * Default image assets repository name
 */
DefaultStackSynthesizer.DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME = 'cdk-${Qualifier}-container-assets-${AWS::AccountId}-${AWS::Region}';
/**
 * Default file assets bucket name
 */
DefaultStackSynthesizer.DEFAULT_FILE_ASSETS_BUCKET_NAME = 'cdk-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}';
/**
 * Name of the CloudFormation Export with the asset key name
 */
DefaultStackSynthesizer.DEFAULT_FILE_ASSET_KEY_ARN_EXPORT_NAME = 'CdkBootstrap-${Qualifier}-FileAssetKeyArn';
/**
 * Default file asset prefix
 */
DefaultStackSynthesizer.DEFAULT_FILE_ASSET_PREFIX = '';
/**
 * Default Docker asset prefix
 */
DefaultStackSynthesizer.DEFAULT_DOCKER_ASSET_PREFIX = '';
/**
 * Default bootstrap stack version SSM parameter.
 */
DefaultStackSynthesizer.DEFAULT_BOOTSTRAP_STACK_VERSION_SSM_PARAMETER = '/cdk-bootstrap/${Qualifier}/version';
exports.DefaultStackSynthesizer = DefaultStackSynthesizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1zeW50aGVzaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQtc3ludGhlc2l6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUNBQXlDO0FBQ3pDLHVDQUEyRDtBQUMzRCxxRUFBZ0U7QUFDaEUsMkRBQXVEO0FBSXZELG9DQUFpQztBQUVwQixRQUFBLDJCQUEyQixHQUFHLGtDQUFrQyxDQUFDO0FBRTlFLDRCQUE0QjtBQUU1Qjs7R0FFRztBQUNILE1BQU0sMkJBQTJCLEdBQUcsQ0FBQyxDQUFDO0FBRXRDOzs7R0FHRztBQUNILE1BQU0sdUNBQXVDLEdBQUcsQ0FBQyxDQUFDO0FBZ01sRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQWEsdUJBQXdCLFNBQVEsb0NBQWdCO0lBMEUzRCxZQUE2QixRQUFzQyxFQUFFO1FBQ25FLEtBQUssRUFBRSxDQUFDO1FBRG1CLFVBQUssR0FBTCxLQUFLLENBQW1DO1FBRjdELGtCQUFhLEdBQUcsSUFBSSw2Q0FBb0IsRUFBRSxDQUFDOzs7Ozs7K0NBeEV4Qyx1QkFBdUI7Ozs7UUE0RWhDLElBQUksQ0FBQywrQkFBK0IsR0FBRyxLQUFLLENBQUMsK0JBQStCLElBQUksSUFBSSxDQUFDO1FBRXJGLEtBQUssTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFO1lBQ3ZCLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDN0IsZUFBZSxDQUFDLEdBQXlDLENBQUMsQ0FBQzthQUM1RDtTQUNGO1FBRUQsU0FBUyxlQUFlLENBQStDLEdBQU07WUFDM0UsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLGFBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLEdBQUcsK0VBQStFLEdBQUc7b0JB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QyxHQUFHLDJIQUEySCxBQUE5SCxDQUErSDtBQUU3TDs7R0FFRztBQUNvQiwrQ0FBdUIsR0FBRyxpSEFBaUgsQUFBcEgsQ0FBcUg7QUFFbks7O0dBRUc7QUFDb0IsNERBQW9DLEdBQUcsb0VBQW9FLEFBQXZFLENBQXdFO0FBRW5JOztHQUVHO0FBQ29CLHVEQUErQixHQUFHLDBEQUEwRCxBQUE3RCxDQUE4RDtBQUVwSDs7R0FFRztBQUNvQiw4REFBc0MsR0FBRywyQ0FBMkMsQUFBOUMsQ0FBK0M7QUFFNUc7O0dBRUc7QUFDb0IsaURBQXlCLEdBQUcsRUFBRSxBQUFMLENBQU07QUFDdEQ7O0dBRUc7QUFDb0IsbURBQTJCLEdBQUcsRUFBRSxBQUFMLENBQU07QUFFeEQ7O0dBRUc7QUFDb0IscUVBQTZDLEdBQUcscUNBQXFDLEFBQXhDLENBQXlDO0FBMURsRywwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgYXNzZXJ0Qm91bmQsIFN0cmluZ1NwZWNpYWxpemVyIH0gZnJvbSAnLi9fc2hhcmVkJztcbmltcG9ydCB7IEFzc2V0TWFuaWZlc3RCdWlsZGVyIH0gZnJvbSAnLi9hc3NldC1tYW5pZmVzdC1idWlsZGVyJztcbmltcG9ydCB7IFN0YWNrU3ludGhlc2l6ZXIgfSBmcm9tICcuL3N0YWNrLXN5bnRoZXNpemVyJztcbmltcG9ydCB7IElTeW50aGVzaXNTZXNzaW9uLCBJUmV1c2FibGVTdGFja1N5bnRoZXNpemVyLCBJQm91bmRTdGFja1N5bnRoZXNpemVyIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb24sIERvY2tlckltYWdlQXNzZXRTb3VyY2UsIEZpbGVBc3NldExvY2F0aW9uLCBGaWxlQXNzZXRTb3VyY2UgfSBmcm9tICcuLi9hc3NldHMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuLi9zdGFjayc7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gJy4uL3Rva2VuJztcblxuZXhwb3J0IGNvbnN0IEJPT1RTVFJBUF9RVUFMSUZJRVJfQ09OVEVYVCA9ICdAYXdzLWNkay9jb3JlOmJvb3RzdHJhcFF1YWxpZmllcic7XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuLyoqXG4gKiBUaGUgbWluaW11bSBib290c3RyYXAgc3RhY2sgdmVyc2lvbiByZXF1aXJlZCBieSB0aGlzIGFwcC5cbiAqL1xuY29uc3QgTUlOX0JPT1RTVFJBUF9TVEFDS19WRVJTSU9OID0gNjtcblxuLyoqXG4gKiBUaGUgbWluaW11bSBib290c3RyYXAgc3RhY2sgdmVyc2lvbiByZXF1aXJlZFxuICogdG8gdXNlIHRoZSBsb29rdXAgcm9sZS5cbiAqL1xuY29uc3QgTUlOX0xPT0tVUF9ST0xFX0JPT1RTVFJBUF9TVEFDS19WRVJTSU9OID0gODtcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHByb3BlcnRpZXMgZm9yIERlZmF1bHRTdGFja1N5bnRoZXNpemVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBTMyBidWNrZXQgdG8gaG9sZCBmaWxlIGFzc2V0c1xuICAgKlxuICAgKiBZb3UgbXVzdCBzdXBwbHkgdGhpcyBpZiB5b3UgaGF2ZSBnaXZlbiBhIG5vbi1zdGFuZGFyZCBuYW1lIHRvIHRoZSBzdGFnaW5nIGJ1Y2tldC5cbiAgICpcbiAgICogVGhlIHBsYWNlaG9sZGVycyBgJHtRdWFsaWZpZXJ9YCwgYCR7QVdTOjpBY2NvdW50SWR9YCBhbmQgYCR7QVdTOjpSZWdpb259YCB3aWxsXG4gICAqIGJlIHJlcGxhY2VkIHdpdGggdGhlIHZhbHVlcyBvZiBxdWFsaWZpZXIgYW5kIHRoZSBzdGFjaydzIGFjY291bnQgYW5kIHJlZ2lvbixcbiAgICogcmVzcGVjdGl2ZWx5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0ZJTEVfQVNTRVRTX0JVQ0tFVF9OQU1FXG4gICAqL1xuICByZWFkb25seSBmaWxlQXNzZXRzQnVja2V0TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgRUNSIHJlcG9zaXRvcnkgdG8gaG9sZCBEb2NrZXIgSW1hZ2UgYXNzZXRzXG4gICAqXG4gICAqIFlvdSBtdXN0IHN1cHBseSB0aGlzIGlmIHlvdSBoYXZlIGdpdmVuIGEgbm9uLXN0YW5kYXJkIG5hbWUgdG8gdGhlIEVDUiByZXBvc2l0b3J5LlxuICAgKlxuICAgKiBUaGUgcGxhY2Vob2xkZXJzIGAke1F1YWxpZmllcn1gLCBgJHtBV1M6OkFjY291bnRJZH1gIGFuZCBgJHtBV1M6OlJlZ2lvbn1gIHdpbGxcbiAgICogYmUgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWVzIG9mIHF1YWxpZmllciBhbmQgdGhlIHN0YWNrJ3MgYWNjb3VudCBhbmQgcmVnaW9uLFxuICAgKiByZXNwZWN0aXZlbHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfSU1BR0VfQVNTRVRTX1JFUE9TSVRPUllfTkFNRVxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VBc3NldHNSZXBvc2l0b3J5TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJvbGUgdG8gdXNlIHRvIHB1Ymxpc2ggZmlsZSBhc3NldHMgdG8gdGhlIFMzIGJ1Y2tldCBpbiB0aGlzIGVudmlyb25tZW50XG4gICAqXG4gICAqIFlvdSBtdXN0IHN1cHBseSB0aGlzIGlmIHlvdSBoYXZlIGdpdmVuIGEgbm9uLXN0YW5kYXJkIG5hbWUgdG8gdGhlIHB1Ymxpc2hpbmcgcm9sZS5cbiAgICpcbiAgICogVGhlIHBsYWNlaG9sZGVycyBgJHtRdWFsaWZpZXJ9YCwgYCR7QVdTOjpBY2NvdW50SWR9YCBhbmQgYCR7QVdTOjpSZWdpb259YCB3aWxsXG4gICAqIGJlIHJlcGxhY2VkIHdpdGggdGhlIHZhbHVlcyBvZiBxdWFsaWZpZXIgYW5kIHRoZSBzdGFjaydzIGFjY291bnQgYW5kIHJlZ2lvbixcbiAgICogcmVzcGVjdGl2ZWx5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0ZJTEVfQVNTRVRfUFVCTElTSElOR19ST0xFX0FSTlxuICAgKi9cbiAgcmVhZG9ubHkgZmlsZUFzc2V0UHVibGlzaGluZ1JvbGVBcm4/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsIElEIHRvIHVzZSB3aGVuIGFzc3VtaW5nIHJvbGUgZm9yIGZpbGUgYXNzZXQgcHVibGlzaGluZ1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGV4dGVybmFsIElEXG4gICAqL1xuICByZWFkb25seSBmaWxlQXNzZXRQdWJsaXNoaW5nRXh0ZXJuYWxJZD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJvbGUgdG8gdXNlIHRvIHB1Ymxpc2ggaW1hZ2UgYXNzZXRzIHRvIHRoZSBFQ1IgcmVwb3NpdG9yeSBpbiB0aGlzIGVudmlyb25tZW50XG4gICAqXG4gICAqIFlvdSBtdXN0IHN1cHBseSB0aGlzIGlmIHlvdSBoYXZlIGdpdmVuIGEgbm9uLXN0YW5kYXJkIG5hbWUgdG8gdGhlIHB1Ymxpc2hpbmcgcm9sZS5cbiAgICpcbiAgICogVGhlIHBsYWNlaG9sZGVycyBgJHtRdWFsaWZpZXJ9YCwgYCR7QVdTOjpBY2NvdW50SWR9YCBhbmQgYCR7QVdTOjpSZWdpb259YCB3aWxsXG4gICAqIGJlIHJlcGxhY2VkIHdpdGggdGhlIHZhbHVlcyBvZiBxdWFsaWZpZXIgYW5kIHRoZSBzdGFjaydzIGFjY291bnQgYW5kIHJlZ2lvbixcbiAgICogcmVzcGVjdGl2ZWx5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0lNQUdFX0FTU0VUX1BVQkxJU0hJTkdfUk9MRV9BUk5cbiAgICovXG4gIHJlYWRvbmx5IGltYWdlQXNzZXRQdWJsaXNoaW5nUm9sZUFybj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJvbGUgdG8gdXNlIHRvIGxvb2sgdXAgdmFsdWVzIGZyb20gdGhlIHRhcmdldCBBV1MgYWNjb3VudCBkdXJpbmcgc3ludGhlc2lzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgbG9va3VwUm9sZUFybj86IHN0cmluZztcblxuICAvKipcbiAgICogRXh0ZXJuYWwgSUQgdG8gdXNlIHdoZW4gYXNzdW1pbmcgbG9va3VwIHJvbGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBleHRlcm5hbCBJRFxuICAgKi9cbiAgcmVhZG9ubHkgbG9va3VwUm9sZUV4dGVybmFsSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYm9vdHN0cmFwcGVkIGxvb2t1cCByb2xlIGZvciAocmVhZC1vbmx5KSBzdGFjayBvcGVyYXRpb25zXG4gICAqXG4gICAqIFVzZSB0aGUgbG9va3VwIHJvbGUgd2hlbiBwZXJmb3JtaW5nIGEgYGNkayBkaWZmYC4gSWYgc2V0IHRvIGBmYWxzZWAsIHRoZVxuICAgKiBgZGVwbG95IHJvbGVgIGNyZWRlbnRpYWxzIHdpbGwgYmUgdXNlZCB0byBwZXJmb3JtIGEgYGNkayBkaWZmYC5cbiAgICpcbiAgICogUmVxdWlyZXMgYm9vdHN0cmFwIHN0YWNrIHZlcnNpb24gOC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgdXNlTG9va3VwUm9sZUZvclN0YWNrT3BlcmF0aW9ucz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsIElEIHRvIHVzZSB3aGVuIGFzc3VtaW5nIHJvbGUgZm9yIGltYWdlIGFzc2V0IHB1Ymxpc2hpbmdcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBleHRlcm5hbCBJRFxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VBc3NldFB1Ymxpc2hpbmdFeHRlcm5hbElkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFeHRlcm5hbCBJRCB0byB1c2Ugd2hlbiBhc3N1bWluZyByb2xlIGZvciBjbG91ZGZvcm1hdGlvbiBkZXBsb3ltZW50c1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGV4dGVybmFsIElEXG4gICAqL1xuICByZWFkb25seSBkZXBsb3lSb2xlRXh0ZXJuYWxJZD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJvbGUgdG8gYXNzdW1lIHRvIGluaXRpYXRlIGEgZGVwbG95bWVudCBpbiB0aGlzIGVudmlyb25tZW50XG4gICAqXG4gICAqIFlvdSBtdXN0IHN1cHBseSB0aGlzIGlmIHlvdSBoYXZlIGdpdmVuIGEgbm9uLXN0YW5kYXJkIG5hbWUgdG8gdGhlIHB1Ymxpc2hpbmcgcm9sZS5cbiAgICpcbiAgICogVGhlIHBsYWNlaG9sZGVycyBgJHtRdWFsaWZpZXJ9YCwgYCR7QVdTOjpBY2NvdW50SWR9YCBhbmQgYCR7QVdTOjpSZWdpb259YCB3aWxsXG4gICAqIGJlIHJlcGxhY2VkIHdpdGggdGhlIHZhbHVlcyBvZiBxdWFsaWZpZXIgYW5kIHRoZSBzdGFjaydzIGFjY291bnQgYW5kIHJlZ2lvbixcbiAgICogcmVzcGVjdGl2ZWx5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0RFUExPWV9ST0xFX0FSTlxuICAgKi9cbiAgcmVhZG9ubHkgZGVwbG95Um9sZUFybj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJvbGUgQ2xvdWRGb3JtYXRpb24gd2lsbCBhc3N1bWUgd2hlbiBkZXBsb3lpbmcgdGhlIFN0YWNrXG4gICAqXG4gICAqIFlvdSBtdXN0IHN1cHBseSB0aGlzIGlmIHlvdSBoYXZlIGdpdmVuIGEgbm9uLXN0YW5kYXJkIG5hbWUgdG8gdGhlIGV4ZWN1dGlvbiByb2xlLlxuICAgKlxuICAgKiBUaGUgcGxhY2Vob2xkZXJzIGAke1F1YWxpZmllcn1gLCBgJHtBV1M6OkFjY291bnRJZH1gIGFuZCBgJHtBV1M6OlJlZ2lvbn1gIHdpbGxcbiAgICogYmUgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWVzIG9mIHF1YWxpZmllciBhbmQgdGhlIHN0YWNrJ3MgYWNjb3VudCBhbmQgcmVnaW9uLFxuICAgKiByZXNwZWN0aXZlbHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfQ0xPVURGT1JNQVRJT05fUk9MRV9BUk5cbiAgICovXG4gIHJlYWRvbmx5IGNsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZT86IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgQ2xvdWRGb3JtYXRpb24gRXhwb3J0IHdpdGggdGhlIGFzc2V0IGtleSBuYW1lXG4gICAqXG4gICAqIFlvdSBtdXN0IHN1cHBseSB0aGlzIGlmIHlvdSBoYXZlIGdpdmVuIGEgbm9uLXN0YW5kYXJkIG5hbWUgdG8gdGhlIEtNUyBrZXkgZXhwb3J0XG4gICAqXG4gICAqIFRoZSBwbGFjZWhvbGRlcnMgYCR7UXVhbGlmaWVyfWAsIGAke0FXUzo6QWNjb3VudElkfWAgYW5kIGAke0FXUzo6UmVnaW9ufWAgd2lsbFxuICAgKiBiZSByZXBsYWNlZCB3aXRoIHRoZSB2YWx1ZXMgb2YgcXVhbGlmaWVyIGFuZCB0aGUgc3RhY2sncyBhY2NvdW50IGFuZCByZWdpb24sXG4gICAqIHJlc3BlY3RpdmVseS5cbiAgICpcbiAgICogQGRlZmF1bHQgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9GSUxFX0FTU0VUX0tFWV9BUk5fRVhQT1JUX05BTUVcbiAgICogQGRlcHJlY2F0ZWQgVGhpcyBwcm9wZXJ0eSBpcyBub3QgdXNlZCBhbnltb3JlXG4gICAqL1xuICByZWFkb25seSBmaWxlQXNzZXRLZXlBcm5FeHBvcnROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBRdWFsaWZpZXIgdG8gZGlzYW1iaWd1YXRlIG11bHRpcGxlIGVudmlyb25tZW50cyBpbiB0aGUgc2FtZSBhY2NvdW50XG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIHRoaXMgYW5kIGxlYXZlIHRoZSBvdGhlciBuYW1pbmcgcHJvcGVydGllcyBlbXB0eSBpZiB5b3UgaGF2ZSBkZXBsb3llZFxuICAgKiB0aGUgYm9vdHN0cmFwIGVudmlyb25tZW50IHdpdGggc3RhbmRhcmQgbmFtZXMgYnV0IG9ubHkgZGlmZmVybmV0IHF1YWxpZmllcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVmFsdWUgb2YgY29udGV4dCBrZXkgJ0Bhd3MtY2RrL2NvcmU6Ym9vdHN0cmFwUXVhbGlmaWVyJyBpZiBzZXQsIG90aGVyd2lzZSBgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9RVUFMSUZJRVJgXG4gICAqL1xuICByZWFkb25seSBxdWFsaWZpZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYWRkIGEgUnVsZSB0byB0aGUgc3RhY2sgdGVtcGxhdGUgdmVyaWZ5aW5nIHRoZSBib290c3RyYXAgc3RhY2sgdmVyc2lvblxuICAgKlxuICAgKiBUaGlzIGdlbmVyYWxseSBzaG91bGQgYmUgbGVmdCBzZXQgdG8gYHRydWVgLCB1bmxlc3MgeW91IGV4cGxpY2l0bHlcbiAgICogd2FudCB0byBiZSBhYmxlIHRvIGRlcGxveSB0byBhbiB1bmJvb3RzdHJhcHBlZCBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZ2VuZXJhdGVCb290c3RyYXBWZXJzaW9uUnVsZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIGJ1Y2tldFByZWZpeCB0byB1c2Ugd2hpbGUgc3RvcmluZyBTMyBBc3NldHNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0ZJTEVfQVNTRVRfUFJFRklYXG4gICAqL1xuICByZWFkb25seSBidWNrZXRQcmVmaXg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgcHJlZml4IHRvIHVzZSB3aGlsZSB0YWdnaW5nIGFuZCB1cGxvYWRpbmcgRG9ja2VyIGltYWdlcyB0byBFQ1IuXG4gICAqXG4gICAqIFRoaXMgZG9lcyBub3QgYWRkIGFueSBzZXBhcmF0b3JzIC0gdGhlIHNvdXJjZSBoYXNoIHdpbGwgYmUgYXBwZW5kZWQgdG9cbiAgICogdGhpcyBzdHJpbmcgZGlyZWN0bHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9ET0NLRVJfQVNTRVRfUFJFRklYXG4gICAqL1xuICByZWFkb25seSBkb2NrZXJUYWdQcmVmaXg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEJvb3RzdHJhcCBzdGFjayB2ZXJzaW9uIFNTTSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIFRoZSBwbGFjZWhvbGRlciBgJHtRdWFsaWZpZXJ9YCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHZhbHVlIG9mIHF1YWxpZmllci5cbiAgICpcbiAgICogQGRlZmF1bHQgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9CT09UU1RSQVBfU1RBQ0tfVkVSU0lPTl9TU01fUEFSQU1FVEVSXG4gICAqL1xuICByZWFkb25seSBib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXI/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVXNlcyBjb252ZW50aW9uYWxseSBuYW1lZCByb2xlcyBhbmQgYXNzZXQgc3RvcmFnZSBsb2NhdGlvbnNcbiAqXG4gKiBUaGlzIHN5bnRoZXNpemVyOlxuICpcbiAqIC0gU3VwcG9ydHMgY3Jvc3MtYWNjb3VudCBkZXBsb3ltZW50cyAodGhlIENMSSBjYW4gaGF2ZSBjcmVkZW50aWFscyB0byBvbmVcbiAqICAgYWNjb3VudCwgYW5kIHlvdSBjYW4gc3RpbGwgZGVwbG95IHRvIGFub3RoZXIgYWNjb3VudCBieSBhc3N1bWluZyByb2xlcyB3aXRoXG4gKiAgIHdlbGwta25vd24gbmFtZXMgaW4gdGhlIG90aGVyIGFjY291bnQpLlxuICogLSBTdXBwb3J0cyB0aGUgKipDREsgUGlwZWxpbmVzKiogbGlicmFyeS5cbiAqXG4gKiBSZXF1aXJlcyB0aGUgZW52aXJvbm1lbnQgdG8gaGF2ZSBiZWVuIGJvb3RzdHJhcHBlZCB3aXRoIEJvb3RzdHJhcCBTdGFjayBWMlxuICogKGFsc28ga25vd24gYXMgXCJtb2Rlcm4gYm9vdHN0cmFwIHN0YWNrXCIpLiBUaGUgc3ludGhlc2l6ZXIgYWRkcyBhIHZlcnNpb25cbiAqIGNoZWNrIHRvIHRoZSB0ZW1wbGF0ZSwgdG8gbWFrZSBzdXJlIHRoZSBib290c3RyYXAgc3RhY2sgaXMgcmVjZW50IGVub3VnaFxuICogdG8gc3VwcG9ydCBhbGwgZmVhdHVyZXMgZXhwZWN0ZWQgYnkgdGhpcyBzeW50aGVzaXplci5cbiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHRTdGFja1N5bnRoZXNpemVyIGV4dGVuZHMgU3RhY2tTeW50aGVzaXplciBpbXBsZW1lbnRzIElSZXVzYWJsZVN0YWNrU3ludGhlc2l6ZXIsIElCb3VuZFN0YWNrU3ludGhlc2l6ZXIge1xuICAvKipcbiAgICogRGVmYXVsdCBBUk4gcXVhbGlmaWVyXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfUVVBTElGSUVSID0gJ2huYjY1OWZkcyc7XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgQ2xvdWRGb3JtYXRpb24gcm9sZSBBUk4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfQ0xPVURGT1JNQVRJT05fUk9MRV9BUk4gPSAnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6JHtBV1M6OkFjY291bnRJZH06cm9sZS9jZGstJHtRdWFsaWZpZXJ9LWNmbi1leGVjLXJvbGUtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGRlcGxveSByb2xlIEFSTi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9ERVBMT1lfUk9MRV9BUk4gPSAnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6JHtBV1M6OkFjY291bnRJZH06cm9sZS9jZGstJHtRdWFsaWZpZXJ9LWRlcGxveS1yb2xlLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JztcblxuICAvKipcbiAgICogRGVmYXVsdCBhc3NldCBwdWJsaXNoaW5nIHJvbGUgQVJOIGZvciBmaWxlIChTMykgYXNzZXRzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0ZJTEVfQVNTRVRfUFVCTElTSElOR19ST0xFX0FSTiA9ICdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjoke0FXUzo6QWNjb3VudElkfTpyb2xlL2Nkay0ke1F1YWxpZmllcn0tZmlsZS1wdWJsaXNoaW5nLXJvbGUtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGFzc2V0IHB1Ymxpc2hpbmcgcm9sZSBBUk4gZm9yIGltYWdlIChFQ1IpIGFzc2V0cy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9JTUFHRV9BU1NFVF9QVUJMSVNISU5HX1JPTEVfQVJOID0gJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OiR7QVdTOjpBY2NvdW50SWR9OnJvbGUvY2RrLSR7UXVhbGlmaWVyfS1pbWFnZS1wdWJsaXNoaW5nLXJvbGUtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGxvb2t1cCByb2xlIEFSTiBmb3IgbWlzc2luZyB2YWx1ZXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfTE9PS1VQX1JPTEVfQVJOID0gJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OiR7QVdTOjpBY2NvdW50SWR9OnJvbGUvY2RrLSR7UXVhbGlmaWVyfS1sb29rdXAtcm9sZS0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufSc7XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgaW1hZ2UgYXNzZXRzIHJlcG9zaXRvcnkgbmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0lNQUdFX0FTU0VUU19SRVBPU0lUT1JZX05BTUUgPSAnY2RrLSR7UXVhbGlmaWVyfS1jb250YWluZXItYXNzZXRzLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JztcblxuICAvKipcbiAgICogRGVmYXVsdCBmaWxlIGFzc2V0cyBidWNrZXQgbmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0ZJTEVfQVNTRVRTX0JVQ0tFVF9OQU1FID0gJ2Nkay0ke1F1YWxpZmllcn0tYXNzZXRzLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JztcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgQ2xvdWRGb3JtYXRpb24gRXhwb3J0IHdpdGggdGhlIGFzc2V0IGtleSBuYW1lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRklMRV9BU1NFVF9LRVlfQVJOX0VYUE9SVF9OQU1FID0gJ0Nka0Jvb3RzdHJhcC0ke1F1YWxpZmllcn0tRmlsZUFzc2V0S2V5QXJuJztcblxuICAvKipcbiAgICogRGVmYXVsdCBmaWxlIGFzc2V0IHByZWZpeFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0ZJTEVfQVNTRVRfUFJFRklYID0gJyc7XG4gIC8qKlxuICAgKiBEZWZhdWx0IERvY2tlciBhc3NldCBwcmVmaXhcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9ET0NLRVJfQVNTRVRfUFJFRklYID0gJyc7XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgYm9vdHN0cmFwIHN0YWNrIHZlcnNpb24gU1NNIHBhcmFtZXRlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9CT09UU1RSQVBfU1RBQ0tfVkVSU0lPTl9TU01fUEFSQU1FVEVSID0gJy9jZGstYm9vdHN0cmFwLyR7UXVhbGlmaWVyfS92ZXJzaW9uJztcblxuICBwcml2YXRlIGJ1Y2tldE5hbWU/OiBzdHJpbmc7XG4gIHByaXZhdGUgcmVwb3NpdG9yeU5hbWU/OiBzdHJpbmc7XG4gIHByaXZhdGUgX2RlcGxveVJvbGVBcm4/OiBzdHJpbmc7XG4gIHByaXZhdGUgX2Nsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZUFybj86IHN0cmluZztcbiAgcHJpdmF0ZSBmaWxlQXNzZXRQdWJsaXNoaW5nUm9sZUFybj86IHN0cmluZztcbiAgcHJpdmF0ZSBpbWFnZUFzc2V0UHVibGlzaGluZ1JvbGVBcm4/OiBzdHJpbmc7XG4gIHByaXZhdGUgbG9va3VwUm9sZUFybj86IHN0cmluZztcbiAgcHJpdmF0ZSB1c2VMb29rdXBSb2xlRm9yU3RhY2tPcGVyYXRpb25zOiBib29sZWFuO1xuICBwcml2YXRlIHF1YWxpZmllcj86IHN0cmluZztcbiAgcHJpdmF0ZSBidWNrZXRQcmVmaXg/OiBzdHJpbmc7XG4gIHByaXZhdGUgZG9ja2VyVGFnUHJlZml4Pzogc3RyaW5nO1xuICBwcml2YXRlIGJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcj86IHN0cmluZztcbiAgcHJpdmF0ZSBhc3NldE1hbmlmZXN0ID0gbmV3IEFzc2V0TWFuaWZlc3RCdWlsZGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXJQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnVzZUxvb2t1cFJvbGVGb3JTdGFja09wZXJhdGlvbnMgPSBwcm9wcy51c2VMb29rdXBSb2xlRm9yU3RhY2tPcGVyYXRpb25zID8/IHRydWU7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcykge1xuICAgICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgdmFsaWRhdGVOb1Rva2VuKGtleSBhcyBrZXlvZiBEZWZhdWx0U3RhY2tTeW50aGVzaXplclByb3BzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZU5vVG9rZW48QSBleHRlbmRzIGtleW9mIERlZmF1bHRTdGFja1N5bnRoZXNpemVyUHJvcHM+KGtleTogQSkge1xuICAgICAgY29uc3QgcHJvcCA9IHByb3BzW2tleV07XG4gICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdzdHJpbmcnICYmIFRva2VuLmlzVW5yZXNvbHZlZChwcm9wKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERlZmF1bHRTdGFja1N5bnRoZXNpemVyIHByb3BlcnR5ICcke2tleX0nIGNhbm5vdCBjb250YWluIHRva2Vuczsgb25seSB0aGUgZm9sbG93aW5nIHBsYWNlaG9sZGVyIHN0cmluZ3MgYXJlIGFsbG93ZWQ6IGAgKyBbXG4gICAgICAgICAgJyR7UXVhbGlmaWVyfScsXG4gICAgICAgICAgY3hhcGkuRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMuQ1VSUkVOVF9SRUdJT04sXG4gICAgICAgICAgY3hhcGkuRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMuQ1VSUkVOVF9BQ0NPVU5ULFxuICAgICAgICAgIGN4YXBpLkVudmlyb25tZW50UGxhY2Vob2xkZXJzLkNVUlJFTlRfUEFSVElUSU9OLFxuICAgICAgICBdLmpvaW4oJywgJykpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9kdWNlIGEgYm91bmQgU3RhY2sgU3ludGhlc2l6ZXIgZm9yIHRoZSBnaXZlbiBzdGFjay5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgbWF5IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSBvbiB0aGUgc2FtZSBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgcmV1c2FibGVCaW5kKHN0YWNrOiBTdGFjayk6IElCb3VuZFN0YWNrU3ludGhlc2l6ZXIge1xuICAgIC8vIENyZWF0ZSBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgb2JqZWN0IGFuZCBiaW5kIHRoYXRcbiAgICBjb25zdCBjb3B5ID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICBjb3B5LmJpbmQoc3RhY2spO1xuICAgIHJldHVybiBjb3B5O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBxdWFsaWZpZXIgdXNlZCB0byBib290c3RyYXAgdGhpcyBzdGFja1xuICAgKi9cbiAgcHVibGljIGdldCBib290c3RyYXBRdWFsaWZpZXIoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5xdWFsaWZpZXI7XG4gIH1cblxuICBwdWJsaWMgYmluZChzdGFjazogU3RhY2spOiB2b2lkIHtcbiAgICBzdXBlci5iaW5kKHN0YWNrKTtcblxuICAgIGNvbnN0IHF1YWxpZmllciA9IHRoaXMucHJvcHMucXVhbGlmaWVyID8/IHN0YWNrLm5vZGUudHJ5R2V0Q29udGV4dChCT09UU1RSQVBfUVVBTElGSUVSX0NPTlRFWFQpID8/IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfUVVBTElGSUVSO1xuICAgIHRoaXMucXVhbGlmaWVyID0gcXVhbGlmaWVyO1xuXG4gICAgY29uc3Qgc3BlYyA9IG5ldyBTdHJpbmdTcGVjaWFsaXplcihzdGFjaywgcXVhbGlmaWVyKTtcblxuICAgIC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbiAgICB0aGlzLmJ1Y2tldE5hbWUgPSBzcGVjLnNwZWNpYWxpemUodGhpcy5wcm9wcy5maWxlQXNzZXRzQnVja2V0TmFtZSA/PyBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0ZJTEVfQVNTRVRTX0JVQ0tFVF9OQU1FKTtcbiAgICB0aGlzLnJlcG9zaXRvcnlOYW1lID0gc3BlYy5zcGVjaWFsaXplKHRoaXMucHJvcHMuaW1hZ2VBc3NldHNSZXBvc2l0b3J5TmFtZSA/PyBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0lNQUdFX0FTU0VUU19SRVBPU0lUT1JZX05BTUUpO1xuICAgIHRoaXMuX2RlcGxveVJvbGVBcm4gPSBzcGVjLnNwZWNpYWxpemUodGhpcy5wcm9wcy5kZXBsb3lSb2xlQXJuID8/IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfREVQTE9ZX1JPTEVfQVJOKTtcbiAgICB0aGlzLl9jbG91ZEZvcm1hdGlvbkV4ZWN1dGlvblJvbGVBcm4gPSBzcGVjLnNwZWNpYWxpemUodGhpcy5wcm9wcy5jbG91ZEZvcm1hdGlvbkV4ZWN1dGlvblJvbGUgPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9DTE9VREZPUk1BVElPTl9ST0xFX0FSTik7XG4gICAgdGhpcy5maWxlQXNzZXRQdWJsaXNoaW5nUm9sZUFybiA9IHNwZWMuc3BlY2lhbGl6ZSh0aGlzLnByb3BzLmZpbGVBc3NldFB1Ymxpc2hpbmdSb2xlQXJuID8/IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfRklMRV9BU1NFVF9QVUJMSVNISU5HX1JPTEVfQVJOKTtcbiAgICB0aGlzLmltYWdlQXNzZXRQdWJsaXNoaW5nUm9sZUFybiA9IHNwZWMuc3BlY2lhbGl6ZSh0aGlzLnByb3BzLmltYWdlQXNzZXRQdWJsaXNoaW5nUm9sZUFybiA/PyBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0lNQUdFX0FTU0VUX1BVQkxJU0hJTkdfUk9MRV9BUk4pO1xuICAgIHRoaXMubG9va3VwUm9sZUFybiA9IHNwZWMuc3BlY2lhbGl6ZSh0aGlzLnByb3BzLmxvb2t1cFJvbGVBcm4gPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9MT09LVVBfUk9MRV9BUk4pO1xuICAgIHRoaXMuYnVja2V0UHJlZml4ID0gc3BlYy5zcGVjaWFsaXplKHRoaXMucHJvcHMuYnVja2V0UHJlZml4ID8/IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfRklMRV9BU1NFVF9QUkVGSVgpO1xuICAgIHRoaXMuZG9ja2VyVGFnUHJlZml4ID0gc3BlYy5zcGVjaWFsaXplKHRoaXMucHJvcHMuZG9ja2VyVGFnUHJlZml4ID8/IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfRE9DS0VSX0FTU0VUX1BSRUZJWCk7XG4gICAgdGhpcy5ib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXIgPSBzcGVjLnF1YWxpZmllck9ubHkodGhpcy5wcm9wcy5ib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXIgPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9CT09UU1RSQVBfU1RBQ0tfVkVSU0lPTl9TU01fUEFSQU1FVEVSKTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG1heC1sZW4gKi9cbiAgfVxuXG4gIHB1YmxpYyBhZGRGaWxlQXNzZXQoYXNzZXQ6IEZpbGVBc3NldFNvdXJjZSk6IEZpbGVBc3NldExvY2F0aW9uIHtcbiAgICBhc3NlcnRCb3VuZCh0aGlzLmJ1Y2tldE5hbWUpO1xuXG4gICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmFzc2V0TWFuaWZlc3QuZGVmYXVsdEFkZEZpbGVBc3NldCh0aGlzLmJvdW5kU3RhY2ssIGFzc2V0LCB7XG4gICAgICBidWNrZXROYW1lOiB0aGlzLmJ1Y2tldE5hbWUsXG4gICAgICBidWNrZXRQcmVmaXg6IHRoaXMuYnVja2V0UHJlZml4LFxuICAgICAgcm9sZTogdGhpcy5maWxlQXNzZXRQdWJsaXNoaW5nUm9sZUFybiA/IHtcbiAgICAgICAgYXNzdW1lUm9sZUFybjogdGhpcy5maWxlQXNzZXRQdWJsaXNoaW5nUm9sZUFybixcbiAgICAgICAgYXNzdW1lUm9sZUV4dGVybmFsSWQ6IHRoaXMucHJvcHMuZmlsZUFzc2V0UHVibGlzaGluZ0V4dGVybmFsSWQsXG4gICAgICB9IDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNsb3VkRm9ybWF0aW9uTG9jYXRpb25Gcm9tRmlsZUFzc2V0KGxvY2F0aW9uKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGREb2NrZXJJbWFnZUFzc2V0KGFzc2V0OiBEb2NrZXJJbWFnZUFzc2V0U291cmNlKTogRG9ja2VySW1hZ2VBc3NldExvY2F0aW9uIHtcbiAgICBhc3NlcnRCb3VuZCh0aGlzLnJlcG9zaXRvcnlOYW1lKTtcblxuICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5hc3NldE1hbmlmZXN0LmRlZmF1bHRBZGREb2NrZXJJbWFnZUFzc2V0KHRoaXMuYm91bmRTdGFjaywgYXNzZXQsIHtcbiAgICAgIHJlcG9zaXRvcnlOYW1lOiB0aGlzLnJlcG9zaXRvcnlOYW1lLFxuICAgICAgZG9ja2VyVGFnUHJlZml4OiB0aGlzLmRvY2tlclRhZ1ByZWZpeCxcbiAgICAgIHJvbGU6IHRoaXMuaW1hZ2VBc3NldFB1Ymxpc2hpbmdSb2xlQXJuID8ge1xuICAgICAgICBhc3N1bWVSb2xlQXJuOiB0aGlzLmltYWdlQXNzZXRQdWJsaXNoaW5nUm9sZUFybixcbiAgICAgICAgYXNzdW1lUm9sZUV4dGVybmFsSWQ6IHRoaXMucHJvcHMuaW1hZ2VBc3NldFB1Ymxpc2hpbmdFeHRlcm5hbElkLFxuICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jbG91ZEZvcm1hdGlvbkxvY2F0aW9uRnJvbURvY2tlckltYWdlQXNzZXQobG9jYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bnRoZXNpemUgdGhlIHN0YWNrIHRlbXBsYXRlIHRvIHRoZSBnaXZlbiBzZXNzaW9uLCBwYXNzaW5nIHRoZSBjb25maWd1cmVkIGxvb2t1cCByb2xlIEFSTlxuICAgKi9cbiAgcHJvdGVjdGVkIHN5bnRoZXNpemVTdGFja1RlbXBsYXRlKHN0YWNrOiBTdGFjaywgc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24pIHtcbiAgICBzdGFjay5fc3ludGhlc2l6ZVRlbXBsYXRlKHNlc3Npb24sIHRoaXMubG9va3VwUm9sZUFybik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjdXJyZW50bHkgYm91bmQgc3RhY2tcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBib3VuZFN0YWNrYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldCBzdGFjaygpOiBTdGFjayB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuYm91bmRTdGFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW50aGVzaXplIHRoZSBhc3NvY2lhdGVkIHN0YWNrIHRvIHRoZSBzZXNzaW9uXG4gICAqL1xuICBwdWJsaWMgc3ludGhlc2l6ZShzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbik6IHZvaWQge1xuICAgIGFzc2VydEJvdW5kKHRoaXMucXVhbGlmaWVyKTtcblxuICAgIC8vIE11c3QgYmUgZG9uZSBoZXJlIC0tIGlmIGl0J3MgZG9uZSBpbiBiaW5kKCkgKGNhbGxlZCBpbiB0aGUgU3RhY2sncyBjb25zdHJ1Y3RvcilcbiAgICAvLyB0aGVuIGl0IHdpbGwgYmVjb21lIGltcG9zc2libGUgdG8gc2V0IGNvbnRleHQgYWZ0ZXIgdGhhdC5cbiAgICAvL1xuICAgIC8vIElmIGl0J3MgZG9uZSBBRlRFUiBfc3ludGhlc2l6ZVRlbXBsYXRlKCksIHRoZW4gdGhlIHRlbXBsYXRlIHdvbid0IGNvbnRhaW4gdGhlXG4gICAgLy8gcmlnaHQgY29uc3RydWN0cy5cbiAgICBpZiAodGhpcy5wcm9wcy5nZW5lcmF0ZUJvb3RzdHJhcFZlcnNpb25SdWxlID8/IHRydWUpIHtcbiAgICAgIHRoaXMuYWRkQm9vdHN0cmFwVmVyc2lvblJ1bGUoTUlOX0JPT1RTVFJBUF9TVEFDS19WRVJTSU9OLCB0aGlzLmJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlciEpO1xuICAgIH1cblxuICAgIGNvbnN0IHRlbXBsYXRlQXNzZXRTb3VyY2UgPSB0aGlzLnN5bnRoZXNpemVUZW1wbGF0ZShzZXNzaW9uLCB0aGlzLmxvb2t1cFJvbGVBcm4pO1xuICAgIGNvbnN0IHRlbXBsYXRlQXNzZXQgPSB0aGlzLmFkZEZpbGVBc3NldCh0ZW1wbGF0ZUFzc2V0U291cmNlKTtcblxuICAgIGNvbnN0IGFzc2V0TWFuaWZlc3RJZCA9IHRoaXMuYXNzZXRNYW5pZmVzdC5lbWl0TWFuaWZlc3QodGhpcy5ib3VuZFN0YWNrLCBzZXNzaW9uLCB7XG4gICAgICByZXF1aXJlc0Jvb3RzdHJhcFN0YWNrVmVyc2lvbjogTUlOX0JPT1RTVFJBUF9TVEFDS19WRVJTSU9OLFxuICAgICAgYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyOiB0aGlzLmJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcixcbiAgICB9KTtcblxuICAgIHRoaXMuZW1pdEFydGlmYWN0KHNlc3Npb24sIHtcbiAgICAgIGFzc3VtZVJvbGVFeHRlcm5hbElkOiB0aGlzLnByb3BzLmRlcGxveVJvbGVFeHRlcm5hbElkLFxuICAgICAgYXNzdW1lUm9sZUFybjogdGhpcy5fZGVwbG95Um9sZUFybixcbiAgICAgIGNsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZUFybjogdGhpcy5fY2xvdWRGb3JtYXRpb25FeGVjdXRpb25Sb2xlQXJuLFxuICAgICAgc3RhY2tUZW1wbGF0ZUFzc2V0T2JqZWN0VXJsOiB0ZW1wbGF0ZUFzc2V0LnMzT2JqZWN0VXJsV2l0aFBsYWNlaG9sZGVycyxcbiAgICAgIHJlcXVpcmVzQm9vdHN0cmFwU3RhY2tWZXJzaW9uOiBNSU5fQk9PVFNUUkFQX1NUQUNLX1ZFUlNJT04sXG4gICAgICBib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXI6IHRoaXMuYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyLFxuICAgICAgYWRkaXRpb25hbERlcGVuZGVuY2llczogW2Fzc2V0TWFuaWZlc3RJZF0sXG4gICAgICBsb29rdXBSb2xlOiB0aGlzLnVzZUxvb2t1cFJvbGVGb3JTdGFja09wZXJhdGlvbnMgJiYgdGhpcy5sb29rdXBSb2xlQXJuID8ge1xuICAgICAgICBhcm46IHRoaXMubG9va3VwUm9sZUFybixcbiAgICAgICAgYXNzdW1lUm9sZUV4dGVybmFsSWQ6IHRoaXMucHJvcHMubG9va3VwUm9sZUV4dGVybmFsSWQsXG4gICAgICAgIHJlcXVpcmVzQm9vdHN0cmFwU3RhY2tWZXJzaW9uOiBNSU5fTE9PS1VQX1JPTEVfQk9PVFNUUkFQX1NUQUNLX1ZFUlNJT04sXG4gICAgICAgIGJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcjogdGhpcy5ib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXIsXG4gICAgICB9IDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIEFSTiBvZiB0aGUgZGVwbG95IFJvbGUuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGRlcGxveVJvbGVBcm4oKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuX2RlcGxveVJvbGVBcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZGVwbG95Um9sZUFybiBnZXR0ZXIgY2FuIG9ubHkgYmUgY2FsbGVkIGFmdGVyIHRoZSBzeW50aGVzaXplciBoYXMgYmVlbiBib3VuZCB0byBhIFN0YWNrJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9kZXBsb3lSb2xlQXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIEFSTiBvZiB0aGUgQ0ZOIGV4ZWN1dGlvbiBSb2xlLlxuICAgKi9cbiAgcHVibGljIGdldCBjbG91ZEZvcm1hdGlvbkV4ZWN1dGlvblJvbGVBcm4oKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuX2Nsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZUFybikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbG91ZEZvcm1hdGlvbkV4ZWN1dGlvblJvbGVBcm4gZ2V0dGVyIGNhbiBvbmx5IGJlIGNhbGxlZCBhZnRlciB0aGUgc3ludGhlc2l6ZXIgaGFzIGJlZW4gYm91bmQgdG8gYSBTdGFjaycpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY2xvdWRGb3JtYXRpb25FeGVjdXRpb25Sb2xlQXJuO1xuICB9XG59XG4iXX0=