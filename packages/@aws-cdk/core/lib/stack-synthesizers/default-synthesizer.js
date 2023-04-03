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
        _shared_1.assertBound(this.bucketName);
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
        _shared_1.assertBound(this.repositoryName);
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
        _shared_1.assertBound(this.qualifier);
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
exports.DefaultStackSynthesizer = DefaultStackSynthesizer;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1zeW50aGVzaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQtc3ludGhlc2l6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUNBQXlDO0FBQ3pDLHVDQUEyRDtBQUMzRCxxRUFBZ0U7QUFDaEUsMkRBQXVEO0FBSXZELG9DQUFpQztBQUVwQixRQUFBLDJCQUEyQixHQUFHLGtDQUFrQyxDQUFDO0FBRTlFLDRCQUE0QjtBQUU1Qjs7R0FFRztBQUNILE1BQU0sMkJBQTJCLEdBQUcsQ0FBQyxDQUFDO0FBRXRDOzs7R0FHRztBQUNILE1BQU0sdUNBQXVDLEdBQUcsQ0FBQyxDQUFDO0FBZ01sRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQWEsdUJBQXdCLFNBQVEsb0NBQWdCO0lBMEUzRCxZQUE2QixRQUFzQyxFQUFFO1FBQ25FLEtBQUssRUFBRSxDQUFDO1FBRG1CLFVBQUssR0FBTCxLQUFLLENBQW1DO1FBRjdELGtCQUFhLEdBQUcsSUFBSSw2Q0FBb0IsRUFBRSxDQUFDOzs7Ozs7K0NBeEV4Qyx1QkFBdUI7Ozs7UUE0RWhDLElBQUksQ0FBQywrQkFBK0IsR0FBRyxLQUFLLENBQUMsK0JBQStCLElBQUksSUFBSSxDQUFDO1FBRXJGLEtBQUssTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFO1lBQ3ZCLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDN0IsZUFBZSxDQUFDLEdBQXlDLENBQUMsQ0FBQzthQUM1RDtTQUNGO1FBRUQsU0FBUyxlQUFlLENBQStDLEdBQU07WUFDM0UsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLGFBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLEdBQUcsK0VBQStFLEdBQUc7b0JB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RUc7QUFDb0IsK0NBQXVCLEdBQUcsaUhBQWlILENBQUM7QUFFbks7O0dBRUc7QUFDb0IsNERBQW9DLEdBQUcsb0VBQW9FLENBQUM7QUFFbkk7O0dBRUc7QUFDb0IsdURBQStCLEdBQUcsMERBQTBELENBQUM7QUFFcEg7O0dBRUc7QUFDb0IsOERBQXNDLEdBQUcsMkNBQTJDLENBQUM7QUFFNUc7O0dBRUc7QUFDb0IsaURBQXlCLEdBQUcsRUFBRSxDQUFDO0FBQ3REOztHQUVHO0FBQ29CLG1EQUEyQixHQUFHLEVBQUUsQ0FBQztBQUV4RDs7R0FFRztBQUNvQixxRUFBNkMsR0FBRyxxQ0FBcUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBhc3NlcnRCb3VuZCwgU3RyaW5nU3BlY2lhbGl6ZXIgfSBmcm9tICcuL19zaGFyZWQnO1xuaW1wb3J0IHsgQXNzZXRNYW5pZmVzdEJ1aWxkZXIgfSBmcm9tICcuL2Fzc2V0LW1hbmlmZXN0LWJ1aWxkZXInO1xuaW1wb3J0IHsgU3RhY2tTeW50aGVzaXplciB9IGZyb20gJy4vc3RhY2stc3ludGhlc2l6ZXInO1xuaW1wb3J0IHsgSVN5bnRoZXNpc1Nlc3Npb24sIElSZXVzYWJsZVN0YWNrU3ludGhlc2l6ZXIsIElCb3VuZFN0YWNrU3ludGhlc2l6ZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiwgRG9ja2VySW1hZ2VBc3NldFNvdXJjZSwgRmlsZUFzc2V0TG9jYXRpb24sIEZpbGVBc3NldFNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi4vdG9rZW4nO1xuXG5leHBvcnQgY29uc3QgQk9PVFNUUkFQX1FVQUxJRklFUl9DT05URVhUID0gJ0Bhd3MtY2RrL2NvcmU6Ym9vdHN0cmFwUXVhbGlmaWVyJztcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG4vKipcbiAqIFRoZSBtaW5pbXVtIGJvb3RzdHJhcCBzdGFjayB2ZXJzaW9uIHJlcXVpcmVkIGJ5IHRoaXMgYXBwLlxuICovXG5jb25zdCBNSU5fQk9PVFNUUkFQX1NUQUNLX1ZFUlNJT04gPSA2O1xuXG4vKipcbiAqIFRoZSBtaW5pbXVtIGJvb3RzdHJhcCBzdGFjayB2ZXJzaW9uIHJlcXVpcmVkXG4gKiB0byB1c2UgdGhlIGxvb2t1cCByb2xlLlxuICovXG5jb25zdCBNSU5fTE9PS1VQX1JPTEVfQk9PVFNUUkFQX1NUQUNLX1ZFUlNJT04gPSA4O1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBmb3IgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWZhdWx0U3RhY2tTeW50aGVzaXplclByb3BzIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIFMzIGJ1Y2tldCB0byBob2xkIGZpbGUgYXNzZXRzXG4gICAqXG4gICAqIFlvdSBtdXN0IHN1cHBseSB0aGlzIGlmIHlvdSBoYXZlIGdpdmVuIGEgbm9uLXN0YW5kYXJkIG5hbWUgdG8gdGhlIHN0YWdpbmcgYnVja2V0LlxuICAgKlxuICAgKiBUaGUgcGxhY2Vob2xkZXJzIGAke1F1YWxpZmllcn1gLCBgJHtBV1M6OkFjY291bnRJZH1gIGFuZCBgJHtBV1M6OlJlZ2lvbn1gIHdpbGxcbiAgICogYmUgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWVzIG9mIHF1YWxpZmllciBhbmQgdGhlIHN0YWNrJ3MgYWNjb3VudCBhbmQgcmVnaW9uLFxuICAgKiByZXNwZWN0aXZlbHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfRklMRV9BU1NFVFNfQlVDS0VUX05BTUVcbiAgICovXG4gIHJlYWRvbmx5IGZpbGVBc3NldHNCdWNrZXROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBFQ1IgcmVwb3NpdG9yeSB0byBob2xkIERvY2tlciBJbWFnZSBhc3NldHNcbiAgICpcbiAgICogWW91IG11c3Qgc3VwcGx5IHRoaXMgaWYgeW91IGhhdmUgZ2l2ZW4gYSBub24tc3RhbmRhcmQgbmFtZSB0byB0aGUgRUNSIHJlcG9zaXRvcnkuXG4gICAqXG4gICAqIFRoZSBwbGFjZWhvbGRlcnMgYCR7UXVhbGlmaWVyfWAsIGAke0FXUzo6QWNjb3VudElkfWAgYW5kIGAke0FXUzo6UmVnaW9ufWAgd2lsbFxuICAgKiBiZSByZXBsYWNlZCB3aXRoIHRoZSB2YWx1ZXMgb2YgcXVhbGlmaWVyIGFuZCB0aGUgc3RhY2sncyBhY2NvdW50IGFuZCByZWdpb24sXG4gICAqIHJlc3BlY3RpdmVseS5cbiAgICpcbiAgICogQGRlZmF1bHQgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9JTUFHRV9BU1NFVFNfUkVQT1NJVE9SWV9OQU1FXG4gICAqL1xuICByZWFkb25seSBpbWFnZUFzc2V0c1JlcG9zaXRvcnlOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSB0byB1c2UgdG8gcHVibGlzaCBmaWxlIGFzc2V0cyB0byB0aGUgUzMgYnVja2V0IGluIHRoaXMgZW52aXJvbm1lbnRcbiAgICpcbiAgICogWW91IG11c3Qgc3VwcGx5IHRoaXMgaWYgeW91IGhhdmUgZ2l2ZW4gYSBub24tc3RhbmRhcmQgbmFtZSB0byB0aGUgcHVibGlzaGluZyByb2xlLlxuICAgKlxuICAgKiBUaGUgcGxhY2Vob2xkZXJzIGAke1F1YWxpZmllcn1gLCBgJHtBV1M6OkFjY291bnRJZH1gIGFuZCBgJHtBV1M6OlJlZ2lvbn1gIHdpbGxcbiAgICogYmUgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWVzIG9mIHF1YWxpZmllciBhbmQgdGhlIHN0YWNrJ3MgYWNjb3VudCBhbmQgcmVnaW9uLFxuICAgKiByZXNwZWN0aXZlbHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfRklMRV9BU1NFVF9QVUJMSVNISU5HX1JPTEVfQVJOXG4gICAqL1xuICByZWFkb25seSBmaWxlQXNzZXRQdWJsaXNoaW5nUm9sZUFybj86IHN0cmluZztcblxuICAvKipcbiAgICogRXh0ZXJuYWwgSUQgdG8gdXNlIHdoZW4gYXNzdW1pbmcgcm9sZSBmb3IgZmlsZSBhc3NldCBwdWJsaXNoaW5nXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZXh0ZXJuYWwgSURcbiAgICovXG4gIHJlYWRvbmx5IGZpbGVBc3NldFB1Ymxpc2hpbmdFeHRlcm5hbElkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSB0byB1c2UgdG8gcHVibGlzaCBpbWFnZSBhc3NldHMgdG8gdGhlIEVDUiByZXBvc2l0b3J5IGluIHRoaXMgZW52aXJvbm1lbnRcbiAgICpcbiAgICogWW91IG11c3Qgc3VwcGx5IHRoaXMgaWYgeW91IGhhdmUgZ2l2ZW4gYSBub24tc3RhbmRhcmQgbmFtZSB0byB0aGUgcHVibGlzaGluZyByb2xlLlxuICAgKlxuICAgKiBUaGUgcGxhY2Vob2xkZXJzIGAke1F1YWxpZmllcn1gLCBgJHtBV1M6OkFjY291bnRJZH1gIGFuZCBgJHtBV1M6OlJlZ2lvbn1gIHdpbGxcbiAgICogYmUgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWVzIG9mIHF1YWxpZmllciBhbmQgdGhlIHN0YWNrJ3MgYWNjb3VudCBhbmQgcmVnaW9uLFxuICAgKiByZXNwZWN0aXZlbHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfSU1BR0VfQVNTRVRfUFVCTElTSElOR19ST0xFX0FSTlxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VBc3NldFB1Ymxpc2hpbmdSb2xlQXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSB0byB1c2UgdG8gbG9vayB1cCB2YWx1ZXMgZnJvbSB0aGUgdGFyZ2V0IEFXUyBhY2NvdW50IGR1cmluZyBzeW50aGVzaXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSBsb29rdXBSb2xlQXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFeHRlcm5hbCBJRCB0byB1c2Ugd2hlbiBhc3N1bWluZyBsb29rdXAgcm9sZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGV4dGVybmFsIElEXG4gICAqL1xuICByZWFkb25seSBsb29rdXBSb2xlRXh0ZXJuYWxJZD86IHN0cmluZztcblxuICAvKipcbiAgICogVXNlIHRoZSBib290c3RyYXBwZWQgbG9va3VwIHJvbGUgZm9yIChyZWFkLW9ubHkpIHN0YWNrIG9wZXJhdGlvbnNcbiAgICpcbiAgICogVXNlIHRoZSBsb29rdXAgcm9sZSB3aGVuIHBlcmZvcm1pbmcgYSBgY2RrIGRpZmZgLiBJZiBzZXQgdG8gYGZhbHNlYCwgdGhlXG4gICAqIGBkZXBsb3kgcm9sZWAgY3JlZGVudGlhbHMgd2lsbCBiZSB1c2VkIHRvIHBlcmZvcm0gYSBgY2RrIGRpZmZgLlxuICAgKlxuICAgKiBSZXF1aXJlcyBib290c3RyYXAgc3RhY2sgdmVyc2lvbiA4LlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSB1c2VMb29rdXBSb2xlRm9yU3RhY2tPcGVyYXRpb25zPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRXh0ZXJuYWwgSUQgdG8gdXNlIHdoZW4gYXNzdW1pbmcgcm9sZSBmb3IgaW1hZ2UgYXNzZXQgcHVibGlzaGluZ1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGV4dGVybmFsIElEXG4gICAqL1xuICByZWFkb25seSBpbWFnZUFzc2V0UHVibGlzaGluZ0V4dGVybmFsSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsIElEIHRvIHVzZSB3aGVuIGFzc3VtaW5nIHJvbGUgZm9yIGNsb3VkZm9ybWF0aW9uIGRlcGxveW1lbnRzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZXh0ZXJuYWwgSURcbiAgICovXG4gIHJlYWRvbmx5IGRlcGxveVJvbGVFeHRlcm5hbElkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSB0byBhc3N1bWUgdG8gaW5pdGlhdGUgYSBkZXBsb3ltZW50IGluIHRoaXMgZW52aXJvbm1lbnRcbiAgICpcbiAgICogWW91IG11c3Qgc3VwcGx5IHRoaXMgaWYgeW91IGhhdmUgZ2l2ZW4gYSBub24tc3RhbmRhcmQgbmFtZSB0byB0aGUgcHVibGlzaGluZyByb2xlLlxuICAgKlxuICAgKiBUaGUgcGxhY2Vob2xkZXJzIGAke1F1YWxpZmllcn1gLCBgJHtBV1M6OkFjY291bnRJZH1gIGFuZCBgJHtBV1M6OlJlZ2lvbn1gIHdpbGxcbiAgICogYmUgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWVzIG9mIHF1YWxpZmllciBhbmQgdGhlIHN0YWNrJ3MgYWNjb3VudCBhbmQgcmVnaW9uLFxuICAgKiByZXNwZWN0aXZlbHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfREVQTE9ZX1JPTEVfQVJOXG4gICAqL1xuICByZWFkb25seSBkZXBsb3lSb2xlQXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSBDbG91ZEZvcm1hdGlvbiB3aWxsIGFzc3VtZSB3aGVuIGRlcGxveWluZyB0aGUgU3RhY2tcbiAgICpcbiAgICogWW91IG11c3Qgc3VwcGx5IHRoaXMgaWYgeW91IGhhdmUgZ2l2ZW4gYSBub24tc3RhbmRhcmQgbmFtZSB0byB0aGUgZXhlY3V0aW9uIHJvbGUuXG4gICAqXG4gICAqIFRoZSBwbGFjZWhvbGRlcnMgYCR7UXVhbGlmaWVyfWAsIGAke0FXUzo6QWNjb3VudElkfWAgYW5kIGAke0FXUzo6UmVnaW9ufWAgd2lsbFxuICAgKiBiZSByZXBsYWNlZCB3aXRoIHRoZSB2YWx1ZXMgb2YgcXVhbGlmaWVyIGFuZCB0aGUgc3RhY2sncyBhY2NvdW50IGFuZCByZWdpb24sXG4gICAqIHJlc3BlY3RpdmVseS5cbiAgICpcbiAgICogQGRlZmF1bHQgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9DTE9VREZPUk1BVElPTl9ST0xFX0FSTlxuICAgKi9cbiAgcmVhZG9ubHkgY2xvdWRGb3JtYXRpb25FeGVjdXRpb25Sb2xlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBDbG91ZEZvcm1hdGlvbiBFeHBvcnQgd2l0aCB0aGUgYXNzZXQga2V5IG5hbWVcbiAgICpcbiAgICogWW91IG11c3Qgc3VwcGx5IHRoaXMgaWYgeW91IGhhdmUgZ2l2ZW4gYSBub24tc3RhbmRhcmQgbmFtZSB0byB0aGUgS01TIGtleSBleHBvcnRcbiAgICpcbiAgICogVGhlIHBsYWNlaG9sZGVycyBgJHtRdWFsaWZpZXJ9YCwgYCR7QVdTOjpBY2NvdW50SWR9YCBhbmQgYCR7QVdTOjpSZWdpb259YCB3aWxsXG4gICAqIGJlIHJlcGxhY2VkIHdpdGggdGhlIHZhbHVlcyBvZiBxdWFsaWZpZXIgYW5kIHRoZSBzdGFjaydzIGFjY291bnQgYW5kIHJlZ2lvbixcbiAgICogcmVzcGVjdGl2ZWx5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0ZJTEVfQVNTRVRfS0VZX0FSTl9FWFBPUlRfTkFNRVxuICAgKiBAZGVwcmVjYXRlZCBUaGlzIHByb3BlcnR5IGlzIG5vdCB1c2VkIGFueW1vcmVcbiAgICovXG4gIHJlYWRvbmx5IGZpbGVBc3NldEtleUFybkV4cG9ydE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFF1YWxpZmllciB0byBkaXNhbWJpZ3VhdGUgbXVsdGlwbGUgZW52aXJvbm1lbnRzIGluIHRoZSBzYW1lIGFjY291bnRcbiAgICpcbiAgICogWW91IGNhbiB1c2UgdGhpcyBhbmQgbGVhdmUgdGhlIG90aGVyIG5hbWluZyBwcm9wZXJ0aWVzIGVtcHR5IGlmIHlvdSBoYXZlIGRlcGxveWVkXG4gICAqIHRoZSBib290c3RyYXAgZW52aXJvbm1lbnQgd2l0aCBzdGFuZGFyZCBuYW1lcyBidXQgb25seSBkaWZmZXJuZXQgcXVhbGlmaWVycy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBWYWx1ZSBvZiBjb250ZXh0IGtleSAnQGF3cy1jZGsvY29yZTpib290c3RyYXBRdWFsaWZpZXInIGlmIHNldCwgb3RoZXJ3aXNlIGBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX1FVQUxJRklFUmBcbiAgICovXG4gIHJlYWRvbmx5IHF1YWxpZmllcj86IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0byBhZGQgYSBSdWxlIHRvIHRoZSBzdGFjayB0ZW1wbGF0ZSB2ZXJpZnlpbmcgdGhlIGJvb3RzdHJhcCBzdGFjayB2ZXJzaW9uXG4gICAqXG4gICAqIFRoaXMgZ2VuZXJhbGx5IHNob3VsZCBiZSBsZWZ0IHNldCB0byBgdHJ1ZWAsIHVubGVzcyB5b3UgZXhwbGljaXRseVxuICAgKiB3YW50IHRvIGJlIGFibGUgdG8gZGVwbG95IHRvIGFuIHVuYm9vdHN0cmFwcGVkIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBnZW5lcmF0ZUJvb3RzdHJhcFZlcnNpb25SdWxlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogYnVja2V0UHJlZml4IHRvIHVzZSB3aGlsZSBzdG9yaW5nIFMzIEFzc2V0c1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfRklMRV9BU1NFVF9QUkVGSVhcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldFByZWZpeD86IHN0cmluZztcblxuICAvKipcbiAgICogQSBwcmVmaXggdG8gdXNlIHdoaWxlIHRhZ2dpbmcgYW5kIHVwbG9hZGluZyBEb2NrZXIgaW1hZ2VzIHRvIEVDUi5cbiAgICpcbiAgICogVGhpcyBkb2VzIG5vdCBhZGQgYW55IHNlcGFyYXRvcnMgLSB0aGUgc291cmNlIGhhc2ggd2lsbCBiZSBhcHBlbmRlZCB0b1xuICAgKiB0aGlzIHN0cmluZyBkaXJlY3RseS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0RPQ0tFUl9BU1NFVF9QUkVGSVhcbiAgICovXG4gIHJlYWRvbmx5IGRvY2tlclRhZ1ByZWZpeD86IHN0cmluZztcblxuICAvKipcbiAgICogQm9vdHN0cmFwIHN0YWNrIHZlcnNpb24gU1NNIHBhcmFtZXRlci5cbiAgICpcbiAgICogVGhlIHBsYWNlaG9sZGVyIGAke1F1YWxpZmllcn1gIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWUgb2YgcXVhbGlmaWVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0JPT1RTVFJBUF9TVEFDS19WRVJTSU9OX1NTTV9QQVJBTUVURVJcbiAgICovXG4gIHJlYWRvbmx5IGJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBVc2VzIGNvbnZlbnRpb25hbGx5IG5hbWVkIHJvbGVzIGFuZCBhc3NldCBzdG9yYWdlIGxvY2F0aW9uc1xuICpcbiAqIFRoaXMgc3ludGhlc2l6ZXI6XG4gKlxuICogLSBTdXBwb3J0cyBjcm9zcy1hY2NvdW50IGRlcGxveW1lbnRzICh0aGUgQ0xJIGNhbiBoYXZlIGNyZWRlbnRpYWxzIHRvIG9uZVxuICogICBhY2NvdW50LCBhbmQgeW91IGNhbiBzdGlsbCBkZXBsb3kgdG8gYW5vdGhlciBhY2NvdW50IGJ5IGFzc3VtaW5nIHJvbGVzIHdpdGhcbiAqICAgd2VsbC1rbm93biBuYW1lcyBpbiB0aGUgb3RoZXIgYWNjb3VudCkuXG4gKiAtIFN1cHBvcnRzIHRoZSAqKkNESyBQaXBlbGluZXMqKiBsaWJyYXJ5LlxuICpcbiAqIFJlcXVpcmVzIHRoZSBlbnZpcm9ubWVudCB0byBoYXZlIGJlZW4gYm9vdHN0cmFwcGVkIHdpdGggQm9vdHN0cmFwIFN0YWNrIFYyXG4gKiAoYWxzbyBrbm93biBhcyBcIm1vZGVybiBib290c3RyYXAgc3RhY2tcIikuIFRoZSBzeW50aGVzaXplciBhZGRzIGEgdmVyc2lvblxuICogY2hlY2sgdG8gdGhlIHRlbXBsYXRlLCB0byBtYWtlIHN1cmUgdGhlIGJvb3RzdHJhcCBzdGFjayBpcyByZWNlbnQgZW5vdWdoXG4gKiB0byBzdXBwb3J0IGFsbCBmZWF0dXJlcyBleHBlY3RlZCBieSB0aGlzIHN5bnRoZXNpemVyLlxuICovXG5leHBvcnQgY2xhc3MgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIgZXh0ZW5kcyBTdGFja1N5bnRoZXNpemVyIGltcGxlbWVudHMgSVJldXNhYmxlU3RhY2tTeW50aGVzaXplciwgSUJvdW5kU3RhY2tTeW50aGVzaXplciB7XG4gIC8qKlxuICAgKiBEZWZhdWx0IEFSTiBxdWFsaWZpZXJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9RVUFMSUZJRVIgPSAnaG5iNjU5ZmRzJztcblxuICAvKipcbiAgICogRGVmYXVsdCBDbG91ZEZvcm1hdGlvbiByb2xlIEFSTi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9DTE9VREZPUk1BVElPTl9ST0xFX0FSTiA9ICdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjoke0FXUzo6QWNjb3VudElkfTpyb2xlL2Nkay0ke1F1YWxpZmllcn0tY2ZuLWV4ZWMtcm9sZS0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufSc7XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgZGVwbG95IHJvbGUgQVJOLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0RFUExPWV9ST0xFX0FSTiA9ICdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjoke0FXUzo6QWNjb3VudElkfTpyb2xlL2Nkay0ke1F1YWxpZmllcn0tZGVwbG95LXJvbGUtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGFzc2V0IHB1Ymxpc2hpbmcgcm9sZSBBUk4gZm9yIGZpbGUgKFMzKSBhc3NldHMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRklMRV9BU1NFVF9QVUJMSVNISU5HX1JPTEVfQVJOID0gJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OiR7QVdTOjpBY2NvdW50SWR9OnJvbGUvY2RrLSR7UXVhbGlmaWVyfS1maWxlLXB1Ymxpc2hpbmctcm9sZS0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufSc7XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgYXNzZXQgcHVibGlzaGluZyByb2xlIEFSTiBmb3IgaW1hZ2UgKEVDUikgYXNzZXRzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0lNQUdFX0FTU0VUX1BVQkxJU0hJTkdfUk9MRV9BUk4gPSAnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6JHtBV1M6OkFjY291bnRJZH06cm9sZS9jZGstJHtRdWFsaWZpZXJ9LWltYWdlLXB1Ymxpc2hpbmctcm9sZS0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufSc7XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgbG9va3VwIHJvbGUgQVJOIGZvciBtaXNzaW5nIHZhbHVlcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9MT09LVVBfUk9MRV9BUk4gPSAnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6JHtBV1M6OkFjY291bnRJZH06cm9sZS9jZGstJHtRdWFsaWZpZXJ9LWxvb2t1cC1yb2xlLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JztcblxuICAvKipcbiAgICogRGVmYXVsdCBpbWFnZSBhc3NldHMgcmVwb3NpdG9yeSBuYW1lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfSU1BR0VfQVNTRVRTX1JFUE9TSVRPUllfTkFNRSA9ICdjZGstJHtRdWFsaWZpZXJ9LWNvbnRhaW5lci1hc3NldHMtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGZpbGUgYXNzZXRzIGJ1Y2tldCBuYW1lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRklMRV9BU1NFVFNfQlVDS0VUX05BTUUgPSAnY2RrLSR7UXVhbGlmaWVyfS1hc3NldHMtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBDbG91ZEZvcm1hdGlvbiBFeHBvcnQgd2l0aCB0aGUgYXNzZXQga2V5IG5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9GSUxFX0FTU0VUX0tFWV9BUk5fRVhQT1JUX05BTUUgPSAnQ2RrQm9vdHN0cmFwLSR7UXVhbGlmaWVyfS1GaWxlQXNzZXRLZXlBcm4nO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGZpbGUgYXNzZXQgcHJlZml4XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRklMRV9BU1NFVF9QUkVGSVggPSAnJztcbiAgLyoqXG4gICAqIERlZmF1bHQgRG9ja2VyIGFzc2V0IHByZWZpeFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0RPQ0tFUl9BU1NFVF9QUkVGSVggPSAnJztcblxuICAvKipcbiAgICogRGVmYXVsdCBib290c3RyYXAgc3RhY2sgdmVyc2lvbiBTU00gcGFyYW1ldGVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0JPT1RTVFJBUF9TVEFDS19WRVJTSU9OX1NTTV9QQVJBTUVURVIgPSAnL2Nkay1ib290c3RyYXAvJHtRdWFsaWZpZXJ9L3ZlcnNpb24nO1xuXG4gIHByaXZhdGUgYnVja2V0TmFtZT86IHN0cmluZztcbiAgcHJpdmF0ZSByZXBvc2l0b3J5TmFtZT86IHN0cmluZztcbiAgcHJpdmF0ZSBfZGVwbG95Um9sZUFybj86IHN0cmluZztcbiAgcHJpdmF0ZSBfY2xvdWRGb3JtYXRpb25FeGVjdXRpb25Sb2xlQXJuPzogc3RyaW5nO1xuICBwcml2YXRlIGZpbGVBc3NldFB1Ymxpc2hpbmdSb2xlQXJuPzogc3RyaW5nO1xuICBwcml2YXRlIGltYWdlQXNzZXRQdWJsaXNoaW5nUm9sZUFybj86IHN0cmluZztcbiAgcHJpdmF0ZSBsb29rdXBSb2xlQXJuPzogc3RyaW5nO1xuICBwcml2YXRlIHVzZUxvb2t1cFJvbGVGb3JTdGFja09wZXJhdGlvbnM6IGJvb2xlYW47XG4gIHByaXZhdGUgcXVhbGlmaWVyPzogc3RyaW5nO1xuICBwcml2YXRlIGJ1Y2tldFByZWZpeD86IHN0cmluZztcbiAgcHJpdmF0ZSBkb2NrZXJUYWdQcmVmaXg/OiBzdHJpbmc7XG4gIHByaXZhdGUgYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyPzogc3RyaW5nO1xuICBwcml2YXRlIGFzc2V0TWFuaWZlc3QgPSBuZXcgQXNzZXRNYW5pZmVzdEJ1aWxkZXIoKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBEZWZhdWx0U3RhY2tTeW50aGVzaXplclByb3BzID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudXNlTG9va3VwUm9sZUZvclN0YWNrT3BlcmF0aW9ucyA9IHByb3BzLnVzZUxvb2t1cFJvbGVGb3JTdGFja09wZXJhdGlvbnMgPz8gdHJ1ZTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzKSB7XG4gICAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB2YWxpZGF0ZU5vVG9rZW4oa2V5IGFzIGtleW9mIERlZmF1bHRTdGFja1N5bnRoZXNpemVyUHJvcHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlTm9Ub2tlbjxBIGV4dGVuZHMga2V5b2YgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXJQcm9wcz4oa2V5OiBBKSB7XG4gICAgICBjb25zdCBwcm9wID0gcHJvcHNba2V5XTtcbiAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycgJiYgVG9rZW4uaXNVbnJlc29sdmVkKHByb3ApKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIgcHJvcGVydHkgJyR7a2V5fScgY2Fubm90IGNvbnRhaW4gdG9rZW5zOyBvbmx5IHRoZSBmb2xsb3dpbmcgcGxhY2Vob2xkZXIgc3RyaW5ncyBhcmUgYWxsb3dlZDogYCArIFtcbiAgICAgICAgICAnJHtRdWFsaWZpZXJ9JyxcbiAgICAgICAgICBjeGFwaS5FbnZpcm9ubWVudFBsYWNlaG9sZGVycy5DVVJSRU5UX1JFR0lPTixcbiAgICAgICAgICBjeGFwaS5FbnZpcm9ubWVudFBsYWNlaG9sZGVycy5DVVJSRU5UX0FDQ09VTlQsXG4gICAgICAgICAgY3hhcGkuRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMuQ1VSUkVOVF9QQVJUSVRJT04sXG4gICAgICAgIF0uam9pbignLCAnKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb2R1Y2UgYSBib3VuZCBTdGFjayBTeW50aGVzaXplciBmb3IgdGhlIGdpdmVuIHN0YWNrLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBtYXkgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIG9uIHRoZSBzYW1lIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyByZXVzYWJsZUJpbmQoc3RhY2s6IFN0YWNrKTogSUJvdW5kU3RhY2tTeW50aGVzaXplciB7XG4gICAgLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgY3VycmVudCBvYmplY3QgYW5kIGJpbmQgdGhhdFxuICAgIGNvbnN0IGNvcHkgPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xuICAgIGNvcHkuYmluZChzdGFjayk7XG4gICAgcmV0dXJuIGNvcHk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHF1YWxpZmllciB1c2VkIHRvIGJvb3RzdHJhcCB0aGlzIHN0YWNrXG4gICAqL1xuICBwdWJsaWMgZ2V0IGJvb3RzdHJhcFF1YWxpZmllcigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnF1YWxpZmllcjtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKHN0YWNrOiBTdGFjayk6IHZvaWQge1xuICAgIHN1cGVyLmJpbmQoc3RhY2spO1xuXG4gICAgY29uc3QgcXVhbGlmaWVyID0gdGhpcy5wcm9wcy5xdWFsaWZpZXIgPz8gc3RhY2subm9kZS50cnlHZXRDb250ZXh0KEJPT1RTVFJBUF9RVUFMSUZJRVJfQ09OVEVYVCkgPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9RVUFMSUZJRVI7XG4gICAgdGhpcy5xdWFsaWZpZXIgPSBxdWFsaWZpZXI7XG5cbiAgICBjb25zdCBzcGVjID0gbmV3IFN0cmluZ1NwZWNpYWxpemVyKHN0YWNrLCBxdWFsaWZpZXIpO1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuICAgIHRoaXMuYnVja2V0TmFtZSA9IHNwZWMuc3BlY2lhbGl6ZSh0aGlzLnByb3BzLmZpbGVBc3NldHNCdWNrZXROYW1lID8/IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfRklMRV9BU1NFVFNfQlVDS0VUX05BTUUpO1xuICAgIHRoaXMucmVwb3NpdG9yeU5hbWUgPSBzcGVjLnNwZWNpYWxpemUodGhpcy5wcm9wcy5pbWFnZUFzc2V0c1JlcG9zaXRvcnlOYW1lID8/IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfSU1BR0VfQVNTRVRTX1JFUE9TSVRPUllfTkFNRSk7XG4gICAgdGhpcy5fZGVwbG95Um9sZUFybiA9IHNwZWMuc3BlY2lhbGl6ZSh0aGlzLnByb3BzLmRlcGxveVJvbGVBcm4gPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9ERVBMT1lfUk9MRV9BUk4pO1xuICAgIHRoaXMuX2Nsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZUFybiA9IHNwZWMuc3BlY2lhbGl6ZSh0aGlzLnByb3BzLmNsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZSA/PyBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0NMT1VERk9STUFUSU9OX1JPTEVfQVJOKTtcbiAgICB0aGlzLmZpbGVBc3NldFB1Ymxpc2hpbmdSb2xlQXJuID0gc3BlYy5zcGVjaWFsaXplKHRoaXMucHJvcHMuZmlsZUFzc2V0UHVibGlzaGluZ1JvbGVBcm4gPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9GSUxFX0FTU0VUX1BVQkxJU0hJTkdfUk9MRV9BUk4pO1xuICAgIHRoaXMuaW1hZ2VBc3NldFB1Ymxpc2hpbmdSb2xlQXJuID0gc3BlYy5zcGVjaWFsaXplKHRoaXMucHJvcHMuaW1hZ2VBc3NldFB1Ymxpc2hpbmdSb2xlQXJuID8/IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfSU1BR0VfQVNTRVRfUFVCTElTSElOR19ST0xFX0FSTik7XG4gICAgdGhpcy5sb29rdXBSb2xlQXJuID0gc3BlYy5zcGVjaWFsaXplKHRoaXMucHJvcHMubG9va3VwUm9sZUFybiA/PyBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0xPT0tVUF9ST0xFX0FSTik7XG4gICAgdGhpcy5idWNrZXRQcmVmaXggPSBzcGVjLnNwZWNpYWxpemUodGhpcy5wcm9wcy5idWNrZXRQcmVmaXggPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9GSUxFX0FTU0VUX1BSRUZJWCk7XG4gICAgdGhpcy5kb2NrZXJUYWdQcmVmaXggPSBzcGVjLnNwZWNpYWxpemUodGhpcy5wcm9wcy5kb2NrZXJUYWdQcmVmaXggPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9ET0NLRVJfQVNTRVRfUFJFRklYKTtcbiAgICB0aGlzLmJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlciA9IHNwZWMucXVhbGlmaWVyT25seSh0aGlzLnByb3BzLmJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlciA/PyBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0JPT1RTVFJBUF9TVEFDS19WRVJTSU9OX1NTTV9QQVJBTUVURVIpO1xuICAgIC8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuICB9XG5cbiAgcHVibGljIGFkZEZpbGVBc3NldChhc3NldDogRmlsZUFzc2V0U291cmNlKTogRmlsZUFzc2V0TG9jYXRpb24ge1xuICAgIGFzc2VydEJvdW5kKHRoaXMuYnVja2V0TmFtZSk7XG5cbiAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuYXNzZXRNYW5pZmVzdC5kZWZhdWx0QWRkRmlsZUFzc2V0KHRoaXMuYm91bmRTdGFjaywgYXNzZXQsIHtcbiAgICAgIGJ1Y2tldE5hbWU6IHRoaXMuYnVja2V0TmFtZSxcbiAgICAgIGJ1Y2tldFByZWZpeDogdGhpcy5idWNrZXRQcmVmaXgsXG4gICAgICByb2xlOiB0aGlzLmZpbGVBc3NldFB1Ymxpc2hpbmdSb2xlQXJuID8ge1xuICAgICAgICBhc3N1bWVSb2xlQXJuOiB0aGlzLmZpbGVBc3NldFB1Ymxpc2hpbmdSb2xlQXJuLFxuICAgICAgICBhc3N1bWVSb2xlRXh0ZXJuYWxJZDogdGhpcy5wcm9wcy5maWxlQXNzZXRQdWJsaXNoaW5nRXh0ZXJuYWxJZCxcbiAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY2xvdWRGb3JtYXRpb25Mb2NhdGlvbkZyb21GaWxlQXNzZXQobG9jYXRpb24pO1xuICB9XG5cbiAgcHVibGljIGFkZERvY2tlckltYWdlQXNzZXQoYXNzZXQ6IERvY2tlckltYWdlQXNzZXRTb3VyY2UpOiBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb24ge1xuICAgIGFzc2VydEJvdW5kKHRoaXMucmVwb3NpdG9yeU5hbWUpO1xuXG4gICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmFzc2V0TWFuaWZlc3QuZGVmYXVsdEFkZERvY2tlckltYWdlQXNzZXQodGhpcy5ib3VuZFN0YWNrLCBhc3NldCwge1xuICAgICAgcmVwb3NpdG9yeU5hbWU6IHRoaXMucmVwb3NpdG9yeU5hbWUsXG4gICAgICBkb2NrZXJUYWdQcmVmaXg6IHRoaXMuZG9ja2VyVGFnUHJlZml4LFxuICAgICAgcm9sZTogdGhpcy5pbWFnZUFzc2V0UHVibGlzaGluZ1JvbGVBcm4gPyB7XG4gICAgICAgIGFzc3VtZVJvbGVBcm46IHRoaXMuaW1hZ2VBc3NldFB1Ymxpc2hpbmdSb2xlQXJuLFxuICAgICAgICBhc3N1bWVSb2xlRXh0ZXJuYWxJZDogdGhpcy5wcm9wcy5pbWFnZUFzc2V0UHVibGlzaGluZ0V4dGVybmFsSWQsXG4gICAgICB9IDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNsb3VkRm9ybWF0aW9uTG9jYXRpb25Gcm9tRG9ja2VySW1hZ2VBc3NldChsb2NhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3ludGhlc2l6ZSB0aGUgc3RhY2sgdGVtcGxhdGUgdG8gdGhlIGdpdmVuIHNlc3Npb24sIHBhc3NpbmcgdGhlIGNvbmZpZ3VyZWQgbG9va3VwIHJvbGUgQVJOXG4gICAqL1xuICBwcm90ZWN0ZWQgc3ludGhlc2l6ZVN0YWNrVGVtcGxhdGUoc3RhY2s6IFN0YWNrLCBzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbikge1xuICAgIHN0YWNrLl9zeW50aGVzaXplVGVtcGxhdGUoc2Vzc2lvbiwgdGhpcy5sb29rdXBSb2xlQXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGN1cnJlbnRseSBib3VuZCBzdGFja1xuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGJvdW5kU3RhY2tgIGluc3RlYWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0IHN0YWNrKCk6IFN0YWNrIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5ib3VuZFN0YWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bnRoZXNpemUgdGhlIGFzc29jaWF0ZWQgc3RhY2sgdG8gdGhlIHNlc3Npb25cbiAgICovXG4gIHB1YmxpYyBzeW50aGVzaXplKHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uKTogdm9pZCB7XG4gICAgYXNzZXJ0Qm91bmQodGhpcy5xdWFsaWZpZXIpO1xuXG4gICAgLy8gTXVzdCBiZSBkb25lIGhlcmUgLS0gaWYgaXQncyBkb25lIGluIGJpbmQoKSAoY2FsbGVkIGluIHRoZSBTdGFjaydzIGNvbnN0cnVjdG9yKVxuICAgIC8vIHRoZW4gaXQgd2lsbCBiZWNvbWUgaW1wb3NzaWJsZSB0byBzZXQgY29udGV4dCBhZnRlciB0aGF0LlxuICAgIC8vXG4gICAgLy8gSWYgaXQncyBkb25lIEFGVEVSIF9zeW50aGVzaXplVGVtcGxhdGUoKSwgdGhlbiB0aGUgdGVtcGxhdGUgd29uJ3QgY29udGFpbiB0aGVcbiAgICAvLyByaWdodCBjb25zdHJ1Y3RzLlxuICAgIGlmICh0aGlzLnByb3BzLmdlbmVyYXRlQm9vdHN0cmFwVmVyc2lvblJ1bGUgPz8gdHJ1ZSkge1xuICAgICAgdGhpcy5hZGRCb290c3RyYXBWZXJzaW9uUnVsZShNSU5fQk9PVFNUUkFQX1NUQUNLX1ZFUlNJT04sIHRoaXMuYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyISk7XG4gICAgfVxuXG4gICAgY29uc3QgdGVtcGxhdGVBc3NldFNvdXJjZSA9IHRoaXMuc3ludGhlc2l6ZVRlbXBsYXRlKHNlc3Npb24sIHRoaXMubG9va3VwUm9sZUFybik7XG4gICAgY29uc3QgdGVtcGxhdGVBc3NldCA9IHRoaXMuYWRkRmlsZUFzc2V0KHRlbXBsYXRlQXNzZXRTb3VyY2UpO1xuXG4gICAgY29uc3QgYXNzZXRNYW5pZmVzdElkID0gdGhpcy5hc3NldE1hbmlmZXN0LmVtaXRNYW5pZmVzdCh0aGlzLmJvdW5kU3RhY2ssIHNlc3Npb24sIHtcbiAgICAgIHJlcXVpcmVzQm9vdHN0cmFwU3RhY2tWZXJzaW9uOiBNSU5fQk9PVFNUUkFQX1NUQUNLX1ZFUlNJT04sXG4gICAgICBib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXI6IHRoaXMuYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyLFxuICAgIH0pO1xuXG4gICAgdGhpcy5lbWl0QXJ0aWZhY3Qoc2Vzc2lvbiwge1xuICAgICAgYXNzdW1lUm9sZUV4dGVybmFsSWQ6IHRoaXMucHJvcHMuZGVwbG95Um9sZUV4dGVybmFsSWQsXG4gICAgICBhc3N1bWVSb2xlQXJuOiB0aGlzLl9kZXBsb3lSb2xlQXJuLFxuICAgICAgY2xvdWRGb3JtYXRpb25FeGVjdXRpb25Sb2xlQXJuOiB0aGlzLl9jbG91ZEZvcm1hdGlvbkV4ZWN1dGlvblJvbGVBcm4sXG4gICAgICBzdGFja1RlbXBsYXRlQXNzZXRPYmplY3RVcmw6IHRlbXBsYXRlQXNzZXQuczNPYmplY3RVcmxXaXRoUGxhY2Vob2xkZXJzLFxuICAgICAgcmVxdWlyZXNCb290c3RyYXBTdGFja1ZlcnNpb246IE1JTl9CT09UU1RSQVBfU1RBQ0tfVkVSU0lPTixcbiAgICAgIGJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcjogdGhpcy5ib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXIsXG4gICAgICBhZGRpdGlvbmFsRGVwZW5kZW5jaWVzOiBbYXNzZXRNYW5pZmVzdElkXSxcbiAgICAgIGxvb2t1cFJvbGU6IHRoaXMudXNlTG9va3VwUm9sZUZvclN0YWNrT3BlcmF0aW9ucyAmJiB0aGlzLmxvb2t1cFJvbGVBcm4gPyB7XG4gICAgICAgIGFybjogdGhpcy5sb29rdXBSb2xlQXJuLFxuICAgICAgICBhc3N1bWVSb2xlRXh0ZXJuYWxJZDogdGhpcy5wcm9wcy5sb29rdXBSb2xlRXh0ZXJuYWxJZCxcbiAgICAgICAgcmVxdWlyZXNCb290c3RyYXBTdGFja1ZlcnNpb246IE1JTl9MT09LVVBfUk9MRV9CT09UU1RSQVBfU1RBQ0tfVkVSU0lPTixcbiAgICAgICAgYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyOiB0aGlzLmJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcixcbiAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQVJOIG9mIHRoZSBkZXBsb3kgUm9sZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgZGVwbG95Um9sZUFybigpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5fZGVwbG95Um9sZUFybikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdkZXBsb3lSb2xlQXJuIGdldHRlciBjYW4gb25seSBiZSBjYWxsZWQgYWZ0ZXIgdGhlIHN5bnRoZXNpemVyIGhhcyBiZWVuIGJvdW5kIHRvIGEgU3RhY2snKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2RlcGxveVJvbGVBcm47XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQVJOIG9mIHRoZSBDRk4gZXhlY3V0aW9uIFJvbGUuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGNsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZUFybigpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5fY2xvdWRGb3JtYXRpb25FeGVjdXRpb25Sb2xlQXJuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZUFybiBnZXR0ZXIgY2FuIG9ubHkgYmUgY2FsbGVkIGFmdGVyIHRoZSBzeW50aGVzaXplciBoYXMgYmVlbiBib3VuZCB0byBhIFN0YWNrJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jbG91ZEZvcm1hdGlvbkV4ZWN1dGlvblJvbGVBcm47XG4gIH1cbn1cbiJdfQ==